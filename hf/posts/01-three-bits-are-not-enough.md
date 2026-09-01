# 3 bits are not enough for this model — even with unsloth's importance-matrix quants

A negative result, with the probe that makes it stick.

Brimkern's default model is LiquidAI's LFM2.5-230M, shipped as a 149 MB int4 `.brik` that runs
in the browser on WebGPU. 149 MB felt improvable: our flat 3-bit build is 129 MB, and
`unsloth/LFM2.5-230M-GGUF` publishes Q3_K variants calibrated with an importance matrix — surely
better than our round-to-nearest?

Per-tensor RMS error against the F16 source says yes: their Q3_K sits at **14.7 %** where our flat
q3 is at 16.9 % (our q4: 7.9 %). But on the six document-Q&A cases our widget actually has to pass
(`sdk-rag.mjs`, same server, same bundle):

- q4, 149 MB → **6/6**
- our flat q3, 129 MB → 4/6
- q3 with unsloth's allocation map replayed from F16 (down/output/v back at 4 bits), 135 MB → 3/6
- **the probe**: unsloth's own Q3_K values, re-encoded losslessly (+0.02 pt RMS) → **4/6**

The probe is the test that decides. It separates "our 3 bits are badly chosen" from "3 bits are not
enough for this model". Their values, delivered without transport loss, fail the **same two cases,
deterministically**: reading one row out of a table, and refusing to answer outside the supplied
facts (the model invents "10 days"). The 2.2-point RMS gap between their quant and ours buys
nothing at this size. What breaks is going below 4 bits — not the way of getting there.

Direct consequence: we did **not** write a native Q3_K matmul kernel. It would ship a ~123 MB file
(−17 %) at the quality measured above (−2 cases out of 6). The real size lever for this model is
the vocabulary: 65 536 rows × 1024 dims = 42 MB of embeddings in q4, a third of the file.

One trap worth repeating: building from an already-quantized GGUF is always a loss when the F16
exists (double rounding — 20.9 % vs 16.9 % on the same tensors). A calibrated quant file doesn't
contribute *weights*, it contributes an **allocation map**.

The CPU dequantizer that made the comparison possible (Q3_K/Q4_K/Q5_K/Q6_K/Q8_0/Q4_0/Q5_0,
with the inverted-high-bit Q3_K layout tested) is in the repo, reusable on any quantized GGUF:
https://github.com/RomainKH/Brimkern

Try the 6/6 file, streamed to your GPU, nothing sent to a server:
https://brimkern.com/chat?model=romainkh14/LFM2.5-230M_BRIK
