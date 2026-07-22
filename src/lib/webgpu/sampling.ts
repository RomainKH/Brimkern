// Token sampling from a raw logits vector. Pure (no GPU/DOM) so it runs the same in the browser
// decode loop and in tests. Greedy argmax loops on small quantized models; a repetition penalty +
// temperature + top-k/top-p (nucleus) sampling keeps output varied and stops the degenerate
// "same sentence over and over" failure mode.

export interface SamplingOptions {
	temperature?: number; // <= 0 → greedy argmax (deterministic)
	topK?: number; // 0 → disabled (consider the whole vocab)
	topP?: number; // >= 1 → disabled (no nucleus cut)
	repetitionPenalty?: number; // 1 → disabled. HF-style: l>0 ? l/p : l*p
	recentTokens?: number[]; // token ids to penalize (recent context window)
	rng?: () => number; // injectable for deterministic tests; defaults to Math.random
}

// Indices of the k largest values in `logits` (unordered). O(n·k) with a tiny k — cheaper than
// sorting the whole ~152k vocab every token.
function topKIndices(logits: Float32Array, k: number): number[] {
	const idx = new Array<number>(k).fill(-1);
	const val = new Float32Array(k).fill(-Infinity);
	let minPos = 0;
	for (let i = 0; i < logits.length; i++) {
		if (logits[i] > val[minPos]) {
			idx[minPos] = i;
			val[minPos] = logits[i];
			let mp = 0;
			for (let j = 1; j < k; j++) if (val[j] < val[mp]) mp = j;
			minPos = mp;
		}
	}
	return idx.filter((x) => x >= 0);
}

function argmax(logits: Float32Array): number {
	let best = 0;
	let bv = logits[0];
	for (let i = 1; i < logits.length; i++) if (logits[i] > bv) { bv = logits[i]; best = i; }
	return best;
}

// Pick the next token from GPU-preselected top-K candidates (`ids` + `vals` SORTED descending,
// softcap + repetition penalty ALREADY applied on the GPU — see engine.decodeTopKQ8). Runs the
// exact same temperature/top-k/top-p math as sampleNextToken steps 2-7: since the GPU K (64) is a
// superset of `topK` (30), restricting to the first topK candidates equals the full-vocab result.
export function sampleFromTopK(ids: Uint32Array, vals: Float32Array, opts: SamplingOptions = {}): number {
	const { temperature = 0.7, topK = 40, topP = 0.9, rng = Math.random } = opts;
	if (!temperature || temperature <= 0) return ids[0]; // sorted desc → greedy = first
	const k = topK && topK > 0 ? Math.min(topK, ids.length) : ids.length;

	// Temperature-scaled softmax over the (already sorted) candidates.
	const invT = 1 / temperature;
	const maxL = vals[0];
	const probs = new Float64Array(k);
	let sum = 0;
	for (let j = 0; j < k; j++) { const p = Math.exp((vals[j] - maxL) * invT); probs[j] = p; sum += p; }
	for (let j = 0; j < k; j++) probs[j] /= sum;

	// Top-p: probs are already descending → the nucleus is a prefix.
	let cutoff = k;
	if (topP && topP < 1) {
		let cum = 0;
		for (let r = 0; r < k; r++) { cum += probs[r]; if (cum >= topP) { cutoff = r + 1; break; } }
	}
	let nucleusSum = 0;
	for (let r = 0; r < cutoff; r++) nucleusSum += probs[r];
	let target = rng() * nucleusSum;
	for (let r = 0; r < cutoff; r++) { target -= probs[r]; if (target <= 0) return ids[r]; }
	return ids[cutoff - 1];
}

// Pick the next token id from `logits`. Mutates `logits` in place (repetition penalty) — pass a
// throwaway buffer (the per-step readback is exactly that).
export function sampleNextToken(logits: Float32Array, opts: SamplingOptions = {}): number {
	const {
		temperature = 0.7,
		topK = 40,
		topP = 0.9,
		repetitionPenalty = 1.15,
		recentTokens,
		rng = Math.random,
	} = opts;
	const n = logits.length;

	// 1. Repetition penalty over the recent context (push down tokens we just used).
	if (repetitionPenalty && repetitionPenalty !== 1 && recentTokens && recentTokens.length) {
		for (const id of new Set(recentTokens)) {
			if (id < 0 || id >= n) continue;
			const v = logits[id];
			logits[id] = v > 0 ? v / repetitionPenalty : v * repetitionPenalty;
		}
	}

	// 2. Greedy.
	if (!temperature || temperature <= 0) return argmax(logits);

	// 3. Restrict to the top-k candidates.
	const k = topK && topK > 0 ? Math.min(topK, n) : n;
	const cand = topKIndices(logits, k);

	// 4. Temperature-scaled softmax over the candidates (max-subtract for stability).
	const invT = 1 / temperature;
	let maxL = -Infinity;
	for (const i of cand) if (logits[i] > maxL) maxL = logits[i];
	const probs = new Float64Array(cand.length);
	let sum = 0;
	for (let j = 0; j < cand.length; j++) {
		const p = Math.exp((logits[cand[j]] - maxL) * invT);
		probs[j] = p;
		sum += p;
	}
	for (let j = 0; j < probs.length; j++) probs[j] /= sum;

	// 5. Order candidates by probability (desc) for the nucleus cut.
	const order = Array.from(probs.keys()).sort((a, b) => probs[b] - probs[a]);

	// 6. Top-p (nucleus): keep the smallest prefix whose cumulative prob reaches topP.
	let cutoff = order.length;
	if (topP && topP < 1) {
		let cum = 0;
		for (let r = 0; r < order.length; r++) {
			cum += probs[order[r]];
			if (cum >= topP) { cutoff = r + 1; break; }
		}
	}

	// 7. Sample within the nucleus (renormalized).
	let nucleusSum = 0;
	for (let r = 0; r < cutoff; r++) nucleusSum += probs[order[r]];
	let target = rng() * nucleusSum;
	for (let r = 0; r < cutoff; r++) {
		target -= probs[order[r]];
		if (target <= 0) return cand[order[r]];
	}
	return cand[order[cutoff - 1]];
}
