#!/usr/bin/env python3
# convert_hf_to_gguf.py de llama.cpp, pour un Qwen 3 au VOCABULAIRE TAILLÉ (prune-vocab.py).
#
# llama.cpp reconnaît le pré-tokeniseur à l'empreinte du découpage d'une phrase de test
# multilingue (chinois, emoji…). Après la taille, ces caractères se découpent en octets : l'empreinte
# change et la conversion refuse (« BPE pre-tokenizer was not recognized »). Or le pré-tokeniseur —
# la regex qui coupe le texte AVANT le BPE — est intact : seuls les tokens ont changé. On le déclare
# donc « qwen2 », celui que llama.cpp choisit pour le Qwen 3 d'origine.
#
#   …/venv/bin/python scripts/train/to-gguf.py <dossier HF> --outtype q8_0 --outfile <x.gguf>
import os, runpy, sys

LLAMA = os.path.expanduser("~/.cache/brimkern-train/llama.cpp")
sys.path.insert(0, LLAMA)
from conversion import base  # noqa: E402

base.TextModel.get_vocab_base_pre = lambda self, tokenizer: "qwen2"
sys.argv = [os.path.join(LLAMA, "convert_hf_to_gguf.py")] + sys.argv[1:]
runpy.run_path(sys.argv[0], run_name="__main__")
