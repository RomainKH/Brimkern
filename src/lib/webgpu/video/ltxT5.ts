// ENCODEUR DE TEXTE T5 v1.1 XXL (le conditionnement de LTX-Video) sur les kernels du moteur —
// docs/ltx-video-feasibility.md. 24 blocs, d = 4096, 64 têtes de 64, FFN à porte 10240, sans biais.
//   bloc : a = RMSNorm(h)·w ; q, k, v = a·Wq, a·Wk, a·Wv ; scores = q·kᵀ + biais de position + masque
//          (SANS 1/√d — convention T5) ; h += softmax(scores)·v·Wo
//          a = RMSNorm(h)·w ; h += (gelu_tanh(a·Wi0) ⊙ a·Wi1)·Wo_ff
//   sortie : RMSNorm(h)·w_final                                  — [L, 4096], L = 128 jetons (padding compris)
// RMSNorm T5 = notre rmsnorm (pas de soustraction de moyenne), eps 1e-6. Le biais de position (32 seaux
// bidirectionnels, distance max 128) est calculé ici sur CPU depuis la table [32, 64] du bloc 0 et
// partagé par les 24 blocs ; le masque de padding s'y ajoute (−1e9). Les plongements d'entrée (table
// 32128 × 4096, q8 dans le BRIK) sont relus côté CPU : seules les L lignes utiles sont déquantifiées.
// Référence : t5_oracle.py (dossier de session) — forward manuel f32, mêmes poids f16.

import type { WebGpuEngine } from '../kernels';
import type { SafeTensor } from '../../safetensors';
import { toF32 } from '../../safetensors';

type Buf = any;
const D = 4096, H = 64, DK = 64, FF = 10240, LAYERS = 24, EPS = 1e-6, L_MAX = 128;
const BUCKETS = 32, MAX_DIST = 128;

export class LtxT5Encoder {
	private e: WebGpuEngine;
	private w: Map<string, SafeTensor>;
	private embed: Float32Array | null = null;   // [32128, 4096] déquantifié (CPU)
	private relTable: Float32Array | null = null; // [32, 64]

	constructor(engine: WebGpuEngine, weights: Map<string, SafeTensor>) {
		if (!(engine as any).ltxOk) throw new Error('encodeur T5 : briques coupées (?ltx=0 ou selfValidate)');
		this.e = engine; this.w = weights;
		for (const k of ['shared.weight', 'encoder.block.0.layer.0.SelfAttention.relative_attention_bias.weight', 'encoder.block.23.layer.1.DenseReluDense.wo.weight', 'encoder.final_layer_norm.weight'])
			if (!weights.has(k)) throw new Error(`encodeur T5 : poids manquant ${k}`);
	}
	static isCpuTensor(name: string): boolean { return name === 'shared.weight' || name.endsWith('relative_attention_bias.weight'); }

	private g(name: string): Buf {
		const t = this.w.get(name);
		if (!t) throw new Error(`encodeur T5 : poids manquant ${name}`);
		return t.data;
	}

	// Biais de position relative T5 (T5Attention._relative_position_bucket, bidirectionnel) + masque.
	positionBias(L: number, valid: number): Float32Array {
		if (!this.relTable) this.relTable = toF32(this.w.get('encoder.block.0.layer.0.SelfAttention.relative_attention_bias.weight')!.data as any);
		const tab = this.relTable, nb = BUCKETS / 2, maxExact = nb / 2, out = new Float32Array(H * L * L);
		for (let i = 0; i < L; i++) for (let j = 0; j < L; j++) {
			const rel = j - i, n = Math.abs(rel);
			let b = rel > 0 ? nb : 0;
			b += n < maxExact ? n : Math.min(nb - 1, maxExact + Math.floor(Math.log(n / maxExact) / Math.log(MAX_DIST / maxExact) * (nb - maxExact)));
			const masked = j >= valid ? -1e9 : 0;
			for (let h = 0; h < H; h++) out[(h * L + i) * L + j] = tab[b * H + h] + masked;
		}
		return out;
	}

	// ids : identifiants T5 (eos = 1 compris, pad = 0 jusqu'à L). Rend les plongements [L, 4096] et le
	// nombre de jetons valides ; `tap` : activations nommées comme l'oracle (validation).
	async encode(ids: number[], tap?: (name: string, data: Float32Array) => void): Promise<{ embeds: Float32Array; L: number; valid: number }> {
		const L = Math.min(L_MAX, ids.length), e = this.e;
		let valid = L; while (valid > 1 && ids[valid - 1] === 0) valid--;
		if (!this.embed) this.embed = toF32(this.w.get('shared.weight')!.data as any);
		const x = new Float32Array(L * D);
		for (let i = 0; i < L; i++) x.set(this.embed.subarray(ids[i] * D, (ids[i] + 1) * D), i * D);
		const probe = async (name: string, buf: Buf) => { if (tap) tap(name, await e.readGpu(buf, L * D)); };
		if (tap) tap('embed', x.slice());
		const bias = e.uploadGpu(this.positionBias(L, valid));
		let h: Buf = e.uploadGpu(x);
		for (let l = 0; l < LAYERS; l++) {
			const p = `encoder.block.${l}.layer.`, s = e.recordingSession();
			let a = s.rmsnorm(h, this.g(`${p}0.layer_norm.weight`), L, D, EPS);
			const q = s.matmulT(a, this.g(`${p}0.SelfAttention.q.weight`), L, D, D);
			const k = s.matmulT(a, this.g(`${p}0.SelfAttention.k.weight`), L, D, D);
			const v = s.matmulT(a, this.g(`${p}0.SelfAttention.v.weight`), L, D, D);
			const o = s.matmulT(s.attentionBias(q, k, v, bias, L, H, DK), this.g(`${p}0.SelfAttention.o.weight`), L, D, D);
			let h2 = s.add(h, o, L * D);
			a = s.rmsnorm(h2, this.g(`${p}1.layer_norm.weight`), L, D, EPS);
			const gate = s.matmulT(a, this.g(`${p}1.DenseReluDense.wi_0.weight`), L, D, FF);
			const up = s.matmulT(a, this.g(`${p}1.DenseReluDense.wi_1.weight`), L, D, FF);
			const f = s.matmulT(s.geglu(gate, up, L * FF), this.g(`${p}1.DenseReluDense.wo.weight`), L, FF, D);
			const next = s.finishKeep(s.add(h2, f, L * D));
			e.releaseGpu([h]); h = next;
			if (tap && (l === 0 || l === 11 || l === 23)) await probe(`block${l}`, h);
		}
		const s = e.recordingSession();
		const embeds = await s.finish(s.rmsnorm(h, this.g('encoder.final_layer_norm.weight'), L, D, EPS), L * D);
		e.releaseGpu([h, bias]);
		return { embeds, L, valid };
	}

	dispose(): void {
		const bufs: Buf[] = [];
		for (const t of this.w.values()) { const d = t.data as any; if (d?.codes) bufs.push(d.codes, d.sc); else if (d?.nib) bufs.push(d.nib, d.sc, d.mn); else if (d?.destroy) bufs.push(d); }
		this.e.releaseGpu(bufs);
		this.w.clear(); this.embed = null; this.relTable = null;
	}
}
