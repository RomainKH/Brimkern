# We divided prefill attention by 10.9 — then the GPU profiler lied to us by a factor of ~70

Two WebGPU kernel wins and the instrumentation trap between them. All numbers are from alternating
A/B runs in real Chrome on production builds; every kernel ships with a CPU reference check at
startup, a fallback, and a URL kill-switch — which is also what gives every bench its control arm.

**Prefill attention, ×10.9.** The profiler showed `attention` at 26 % of prefill GPU time. Our
first diagnosis — "not enough parallelism" — was wrong: at 467 tokens × 16 heads the old kernel
already launched 7 472 threads. What it lacked was **reuse**: each thread re-read its whole K slice
twice (max pass, then softmax pass) plus V once, for a single query — about 1.5 GB re-read per
attention pass, which at our measured 106.9 GB/s memory ceiling is exactly the ~14 ms we were
seeing. Bandwidth-bound, not occupancy-bound. Two fixes, zero new math: online softmax (one K pass
instead of two), and tiling **4 queries per workgroup** so one K/V sweep is shared — a lever that
only exists in prefill, since decode has one query and nothing to amortize.
Kernel: 18 485 → **1 691 µs** (×10.9; the int8-KV variant gets ×11.5). End to end, the only number
that commits us: **prefill 267 → 600 tok/s (×2.25)** on ~500-token prompts (Qwen3 0.6B), decode
×1.03 — noise, as it must be, that kernel isn't on the decode path. And on a 7B (d=3584) the same
change yields ×1.20: small-model speedups don't generalize, measure the size you claim.

**Quantized 3×3 convolution, ×1.84.** On the image path (SD-Turbo, int8 weights) the profile was
unambiguous: convolutions 73.8 % of GPU, one direct q8 kernel alone at 70.2 %. The f32 path had a
tiled 3×3 for ages; the q8/q4 paths — the ones production actually runs — did not. Same tile
structure (18×18 shared-memory patch, cooperative load), weights dequantized **once** per tile
instead of 256 times. 35 411 → 19 217 µs per shot; a 256px generation goes **5.0 s → 3.0 s** end
to end.

**Then the trap.** The next profile handed us the next target on a plate: `silu`, 19 % of GPU,
5 393 µs per shot. Absurd for a pointwise activation — so before writing a kernel we benched it in
isolation: **65.6 µs**, versus 62.5 µs for a pure copy of the same shape. Already at the bandwidth
floor. The profiler had overestimated by a factor of **~70**, and the mechanism is structural:
putting timestamps around a pass *isolates* it and prevents the GPU from overlapping it with its
neighbors — short, numerous passes suffer most. We still wrote the group_norm+silu fusion, gated
it, measured it end to end: ×1.001. The code was deleted.

The rule we keep: a profiler line with many dispatches and little real work is suspect by
construction. The profiler picks what to look at. The judge is the end-to-end A/B with alternating
arms — nothing else.

Engine and replayable benches: https://github.com/RomainKH/Brimkern · try it: https://brimkern.com
