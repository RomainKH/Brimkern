# Oracle Python du chantier VIDÉO (étape 1, docs/video-gen-feasibility.md) — le pendant de
# rwkv-cpuref/lfm2-cpuref pour AnimateDiff : génère la vidéo de RÉFÉRENCE (seed fixe) et dumpe
# l'entrée/sortie d'un bloc d'attention temporelle du module motion → référence byte-near du
# futur selfValidate WGSL. llama.cpp ne couvre pas la vidéo : l'oracle est diffusers (comme la
# réf CLIP l'a été pour l'image).
#
# Usage : venv-video/bin/python scripts/video-oracle.py  (env VIDEO_OUT= pour changer la sortie)
# Sorties (.brik-build/video-oracle/) : frames PNG + ref.gif + motion_block_io.npz (+ méta JSON).
import json, os, sys
import numpy as np
import torch
from diffusers import AnimateDiffPipeline, MotionAdapter, EulerDiscreteScheduler
from diffusers.utils import export_to_gif
from huggingface_hub import hf_hub_download
from safetensors.torch import load_file

OUT = os.environ.get('VIDEO_OUT', os.path.join(os.path.dirname(__file__), '..', '.brik-build', 'video-oracle'))
os.makedirs(OUT, exist_ok=True)
DEVICE = 'mps' if torch.backends.mps.is_available() else 'cpu'
DTYPE = torch.float16 if DEVICE == 'mps' else torch.float32
STEPS = 4
BASE = os.environ.get('VIDEO_BASE', 'emilianJR/epiCRealism')  # base SD1.5 recommandée par ByteDance
PROMPT = 'a red fox running through a snowy forest, cinematic'
SEED = 42
FRAMES, SIZE = 16, 256

print(f'device={DEVICE} base={BASE} steps={STEPS} frames={FRAMES} size={SIZE}')
adapter = MotionAdapter().to(DEVICE, DTYPE)
adapter.load_state_dict(load_file(hf_hub_download('ByteDance/AnimateDiff-Lightning', f'animatediff_lightning_{STEPS}step_diffusers.safetensors'), device=DEVICE))
pipe = AnimateDiffPipeline.from_pretrained(BASE, motion_adapter=adapter, torch_dtype=DTYPE).to(DEVICE)
pipe.scheduler = EulerDiscreteScheduler.from_config(pipe.scheduler.config, timestep_spacing='trailing', beta_schedule='linear')

# Dump du 1er bloc motion (attention temporelle) : entrée/sortie au 1er step → réf selfValidate.
dumped = {}
motion_blocks = [(n, m) for n, m in pipe.unet.named_modules() if type(m).__name__ == 'TransformerTemporalModel']
if not motion_blocks:
    motion_blocks = [(n, m) for n, m in pipe.unet.named_modules() if 'motion_modules' in n and n.endswith('.motion_modules.0')]
name0, block0 = motion_blocks[0]
print(f'{len(motion_blocks)} blocs motion ; hook sur {name0} ({type(block0).__name__})')

def hook(module, args, output):
    if 'in' not in dumped:
        dumped['in'] = args[0].detach().to(torch.float32).cpu().numpy()
        out = output[0] if isinstance(output, tuple) else output
        out = out.sample if hasattr(out, 'sample') else out
        dumped['out'] = out.detach().to(torch.float32).cpu().numpy()
h = block0.register_forward_hook(hook)

gen = torch.Generator('cpu').manual_seed(SEED)
result = pipe(prompt=PROMPT, guidance_scale=1.0, num_inference_steps=STEPS,
              num_frames=FRAMES, height=SIZE, width=SIZE, generator=gen)
h.remove()
frames = result.frames[0]
export_to_gif(frames, os.path.join(OUT, 'ref.gif'))
for i, f in enumerate(frames):
    f.save(os.path.join(OUT, f'frame_{i:02d}.png'))
np.savez_compressed(os.path.join(OUT, 'motion_block_io.npz'), **dumped)
meta = {'base': BASE, 'steps': STEPS, 'frames': FRAMES, 'size': SIZE, 'seed': SEED, 'prompt': PROMPT,
        'device': DEVICE, 'dtype': str(DTYPE), 'hooked_block': name0, 'n_motion_blocks': len(motion_blocks),
        'in_shape': list(dumped['in'].shape), 'out_shape': list(dumped['out'].shape)}
json.dump(meta, open(os.path.join(OUT, 'meta.json'), 'w'), indent=1)
print('✅ oracle écrit :', OUT)
print(json.dumps(meta, indent=1))
