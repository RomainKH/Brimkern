#!/usr/bin/env python3
# LoRA du modèle du SDK sur les tours rendus par render.mjs — mlx-lm, sur le GPU du Mac.
#
# Pourquoi un script et pas `mlx_lm.lora` tel quel : son format {prompt, completion} RÉAPPLIQUE le
# gabarit de conversation (le prompt devient un message utilisateur dans un second ChatML), et son
# format {text} ne sait pas masquer le prompt. Nos prompts sortent DÉJÀ formatés par le SDK
# (render.mjs) : on tokenise donc prompt + réponse bruts, et la perte ne porte que sur la réponse.
# La frontière tombe sur des tokens spéciaux (« <|im_start|>assistant\n » puis « <think> ») : le
# découpage du prompt seul est le préfixe exact du découpage complet.
#
#   ~/.cache/brimkern-train/venv/bin/python scripts/train/train-lora.py --model Qwen/Qwen3-0.6B \
#       --data ~/.cache/brimkern-train/sft --train --mask-prompt --iters 600 --adapter-path …
import os
import sys
import mlx.core as mx
from mlx_lm import lora

# ⚠️ Le pilote du 2026-09-28 (batch 4 × 2048, sans grad_checkpoint) a fait tomber le Mac : les
# logits d'un vocab de 152k tokens pèsent à eux seuls ~5 Go par pas. Plafond mémoire MLX par
# défaut à 6 Go (MLX_MEM_GB pour le changer) : au-delà, MLX libère son cache au lieu de gonfler.
mx.set_memory_limit(int(float(os.environ.get("MLX_MEM_GB", "6")) * 2**30))
from mlx_lm.tuner import datasets


def process_brut(self, d):
    prompt = self.tokenizer.encode(d[self.prompt_key], add_special_tokens=False)
    tokens = self.tokenizer.encode(d[self.prompt_key] + d[self.completion_key], add_special_tokens=False)
    assert tokens[: len(prompt)] == prompt, "le découpage du prompt n'est pas un préfixe du tour complet"
    return (tokens, len(prompt) if self.mask_prompt else 0)


datasets.CompletionsDataset.process = process_brut

if __name__ == "__main__":
    sys.exit(lora.main())
