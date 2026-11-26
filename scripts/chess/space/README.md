---
title: Kern 0 chess live
emoji: ♟️
colorFrom: gray
colorTo: red
sdk: static
pinned: false
license: mit
short_description: Watch Kern 0, a tiny chess model, learn vs Stockfish & Leela
---

Live view of the learning loop of Kern 0, the chess model of [brimkern](https://brimkern.com/chess): Kern 0 plays Stockfish and
Leela Chess Zero, Stockfish analyses its mistakes, it retrains, and a new candidate replaces the champion
only if it wins the gate match. Every finished generation is archived in the dataset
[romainkh14/brimkern-chess-games](https://huggingface.co/datasets/romainkh14/brimkern-chess-games).

The training runs on a single Mac. It writes the current position to the public bucket
[romainkh14/brimkern-chess-live](https://huggingface.co/buckets/romainkh14/brimkern-chess-live) every few
seconds and this static page reads it (source: `scripts/chess/space` in the brimkern repository).
