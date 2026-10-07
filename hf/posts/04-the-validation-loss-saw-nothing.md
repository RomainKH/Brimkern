# The validation loss saw nothing: fine-tuning a 0.6B for an in-browser support widget

Brimkern's widget answers a site's visitors from the owner's notes, in the browser (WebGPU, no
server), and must refuse anything the notes don't say. Its model was a 149 MB LFM2.5-230M. We
fine-tuned a Qwen3-0.6B for that one job. The first attempt failed in a way the training metrics
could not see.

**Pilot: LoRA r16 on 100 synthetic businesses.** Validation loss 2.37 → 0.455. On the bench, with
alternating base/LoRA arms, the judged score didn't move, and the facts collapsed: **5/8 → 1/8**,
reproducibly. "14 days" for a 30-day return window. "Two working days or less" for 2-4 days. The
training answers, written by a large model, paraphrased every figure fluently. The 0.6B learnt the
fluency, not the figures.

The same bench had a second problem: the SDK's pinned prompt examples were a shoe-size guide, and
the bench's shop sold shoes. Part of every model's score was the example being copied back. So
before training again, we built a bench that this can't happen on: **5 businesses never seen in
training** (3 EN, 2 FR: phone accessories, a hotel, a dentist, a SaaS, web hosting), 30 questions
each run, scored automatically: expected figures present, none invented, refusals without a figure.
A contamination check now compares pinned examples against every bench. The 230M scores **~77 %**
on it.

**What changed in the data:**
- one rule for every answer: *copy the figure from the notes as written*;
- tables with neighbouring rows, so reading the wrong row costs something;
- a second model checks every training turn and rejects any paraphrased fact (6,270 turns, 47
  rejected);
- the vocabulary pruned to English + French, 151,643 → 42,880 tokens. Same bench score (103/120
  against 105/120, within run-to-run variance), +0.91 % tokens on unseen text.

Result on the five unseen businesses: **76 % → 93 %**, 0 invented figures. Two weaknesses were left:
it invented a shop name when the prompt gave none, and answered "Yes! We've got our own pool" to a
yes/no question the notes didn't cover. A targeted batch (one business in three unnamed, two
out-of-notes yes/no questions per business) fixed both: refusals 18/24 → **23/24**, invented names
**0**.

Another metric was misleading too. Our offline figure-recall eval ranked the *previous* version
higher (86 % vs 81 %). It only sees figures; the refusals and the names it was trained to fix are
invisible to it. The offline eval filters out invented figures; the browser bench decides.

**Size:**
- 4 bits everywhere, embedding included: **290 MB, 110/120** (92 %), within the variance of the 382 MB
  mixed build;
- 3 bits: 238 MB, **2/60**. It recites its own instructions. 290 MB is the floor for this model in
  this format.

It shipped as the default of `brimkern@0.8.0`. End-to-end check, SDK loading the file from the Hub:
55/60, identical to the local file. Weights are Apache-2.0 (Qwen3), which also removes the license
caveat the 230M carried.

What we'd tell anyone fine-tuning a small model on synthetic data: the loss tells you it learnt the
*style* of your data, and a model under 1B will learn your teacher's style before it learns the
facts. Write the facts verbatim, check every turn with a second model, and judge on businesses it
has never seen.

The model, with its card and numbers: https://huggingface.co/romainkh14/Qwen3-0.6B-Shop-ENFR_BRIK
One `<script>` tag to embed it: https://brimkern.com/docs/sdk
Benches and training scripts: https://github.com/RomainKH/Brimkern
