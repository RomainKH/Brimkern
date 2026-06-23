// Neural Communia — WebGPU compute kernels for transformer layers (browser worker).
//
// These are the building blocks of a transformer layer forward pass, written as
// WGSL compute shaders. Each kernel ships with a tiny CPU reference; `selfValidate`
// runs every kernel on random inputs in the REAL browser and checks it against the
// reference. The worker only reports `can_compute` after this passes — so even if a
// shader is subtly wrong, it never feeds bad results into the swarm.
//
// Implemented: matmul (the dominant op), rmsnorm, swiglu, residual add, RoPE,
// causal attention (online softmax + KV cache). `layerForward` chains them into a
// full pre-norm transformer layer, also checked against a CPU reference.

/* eslint-disable @typescript-eslint/no-explicit-any */
type GPUAny = any;

export interface LayerCfg {
	seq: number;
	d: number;
	nHeads: number;
	// Grouped-query attention: number of key/value heads (== nHeads for plain MHA).
	nKvHeads: number;
	headDim: number;
	ffn: number;
	// RoPE base (Llama 3.2: 500000, Qwen2: 10000) and RMSNorm epsilon (Qwen2: 1e-6).
	ropeTheta: number;
	eps: number;
}
export interface LayerWeights {
	// Norms/biases stay f32 (small, consumed by rmsnorm/addBias). The big projection matrices
	// may be a Float32Array (uploaded per call) OR a persistent GPUBuffer (uploaded once and
	// reused across decode steps — the GPU-buffer weight-persistence fast path).
	attnNorm: Float32Array;
	wq: Float32Array | GPUAny; wk: Float32Array | GPUAny; wv: Float32Array | GPUAny; wo: Float32Array | GPUAny;
	ffnNorm: Float32Array;
	wgate: Float32Array | GPUAny; wup: Float32Array | GPUAny; wdown: Float32Array | GPUAny;
	// Optional additive biases on the q/k/v projections (Qwen2 has them; Llama doesn't).
	bq?: Float32Array; bk?: Float32Array; bv?: Float32Array;
}

const WG = 64; // workgroup size for 1D kernels

const SHADERS = {
	// C[m,n] = A[m,k] · B[k,n]   (row-major, f32). One invocation per output element.
	matmul: `
		struct Dims { m: u32, k: u32, n: u32 };
		@group(0) @binding(0) var<uniform> d: Dims;
		@group(0) @binding(1) var<storage, read> a: array<f32>;
		@group(0) @binding(2) var<storage, read> b: array<f32>;
		@group(0) @binding(3) var<storage, read_write> c: array<f32>;
		@compute @workgroup_size(8, 8)
		fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
			let row = gid.x; let col = gid.y;
			if (row >= d.m || col >= d.n) { return; }
			var acc = 0.0;
			for (var i = 0u; i < d.k; i = i + 1u) {
				acc = acc + a[row * d.k + i] * b[i * d.n + col];
			}
			c[row * d.n + col] = acc;
		}`,

	// C[m,n] = A[m,k] · Wᵀ where W is [n,k] row-major — i.e. a linear layer y = x·Wᵀ with
	// the weight stored as GGUF stores it: [out, in]. Lets us consume dequantized model
	// weights directly, no transpose. One invocation per output element.
	matmul_t: `
		struct Dims { m: u32, k: u32, n: u32 };
		@group(0) @binding(0) var<uniform> d: Dims;
		@group(0) @binding(1) var<storage, read> a: array<f32>;
		@group(0) @binding(2) var<storage, read> w: array<f32>;
		@group(0) @binding(3) var<storage, read_write> c: array<f32>;
		@compute @workgroup_size(8, 8)
		fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
			let row = gid.x; let col = gid.y;
			if (row >= d.m || col >= d.n) { return; }
			var acc = 0.0;
			for (var i = 0u; i < d.k; i = i + 1u) {
				acc = acc + a[row * d.k + i] * w[col * d.k + i];
			}
			c[row * d.n + col] = acc;
		}`,

	// Vectorized matmul_t: identical maths to matmul_t, but the two operands are read as
	// vec4<f32> (128-bit loads) instead of scalar f32. Along the contraction axis k both
	// a[row,·] and w[col,·] are contiguous, so reinterpreting the SAME storage buffers as
	// array<vec4<f32>> coalesces 4 reads into one — aligning memory traffic with the GPU's
	// native 128-bit bus (~2-4× the effective bandwidth that bounds this op). Requires k % 4
	// == 0 (always true for these models: d, ffn, headDim are multiples of 4); matmulT falls
	// back to the scalar kernel otherwise.
	matmul_t_vec4: `
		struct Dims { m: u32, k: u32, n: u32 };
		@group(0) @binding(0) var<uniform> d: Dims;
		@group(0) @binding(1) var<storage, read> a: array<vec4<f32>>;
		@group(0) @binding(2) var<storage, read> w: array<vec4<f32>>;
		@group(0) @binding(3) var<storage, read_write> c: array<f32>;
		@compute @workgroup_size(8, 8)
		fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
			let row = gid.x; let col = gid.y;
			if (row >= d.m || col >= d.n) { return; }
			let kv = d.k / 4u;             // k is a multiple of 4 (checked on the CPU side)
			let aBase = row * kv;
			let wBase = col * kv;
			var acc = vec4<f32>(0.0);
			for (var i = 0u; i < kv; i = i + 1u) {
				acc = acc + a[aBase + i] * w[wBase + i];   // 128-bit load × 128-bit load, fused multiply-add
			}
			c[row * d.n + col] = acc.x + acc.y + acc.z + acc.w;
		}`,

	// RMSNorm over the last dimension (dim = cols), with a per-channel weight.
	rmsnorm: `
		struct P { rows: u32, dim: u32, eps: f32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> x: array<f32>;
		@group(0) @binding(2) var<storage, read> w: array<f32>;
		@group(0) @binding(3) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
			let r = gid.x;
			if (r >= p.rows) { return; }
			var ss = 0.0;
			for (var i = 0u; i < p.dim; i = i + 1u) { let v = x[r * p.dim + i]; ss = ss + v * v; }
			let inv = 1.0 / sqrt(ss / f32(p.dim) + p.eps);
			for (var i = 0u; i < p.dim; i = i + 1u) {
				o[r * p.dim + i] = x[r * p.dim + i] * inv * w[i];
			}
		}`,

	// o = silu(a) * b   (SwiGLU gate: silu(gate) * up)
	swiglu: `
		@group(0) @binding(0) var<storage, read> a: array<f32>;
		@group(0) @binding(1) var<storage, read> b: array<f32>;
		@group(0) @binding(2) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
			let i = gid.x;
			if (i >= arrayLength(&o)) { return; }
			let v = a[i];
			o[i] = (v / (1.0 + exp(-v))) * b[i];
		}`,

	// o = a + b  (residual add)
	add: `
		@group(0) @binding(0) var<storage, read> a: array<f32>;
		@group(0) @binding(1) var<storage, read> b: array<f32>;
		@group(0) @binding(2) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
			let i = gid.x;
			if (i >= arrayLength(&o)) { return; }
			o[i] = a[i] + b[i];
		}`,

	// Rotary position embedding (RoPE), Llama/NeoX "rotate_half" convention.
	// Input is viewed as [rows, headDim] with rows = seq * nHeads; the token
	// position of a row is pastLen + row/nHeads. One invocation per row.
	rope: `
		struct RP { rows: u32, headDim: u32, nHeads: u32, pastLen: u32, base: f32 };
		@group(0) @binding(0) var<uniform> p: RP;
		@group(0) @binding(1) var<storage, read> x: array<f32>;
		@group(0) @binding(2) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
			let r = gid.x;
			if (r >= p.rows) { return; }
			let half = p.headDim / 2u;
			let pos = f32(p.pastLen + r / p.nHeads);
			let base = r * p.headDim;
			for (var i = 0u; i < half; i = i + 1u) {
				let freq = pos / pow(p.base, (2.0 * f32(i)) / f32(p.headDim));
				let c = cos(freq); let s = sin(freq);
				let x0 = x[base + i];
				let x1 = x[base + i + half];
				o[base + i]        = x0 * c - x1 * s;
				o[base + i + half] = x1 * c + x0 * s;
			}
		}`,

	// Causal scaled-dot-product attention with KV cache + GQA, fused per (token, q-head).
	// q is [nTokens, nHeads, headDim]; k/v are [kvLen, nKvHeads, headDim] where
	// kvLen = pastLen + nTokens. With grouped-query attention each query head h reads the
	// kv head h / (nHeads/nKvHeads) (nKvHeads == nHeads ⇒ plain MHA). Query token t sits at
	// absolute position pastLen+t and attends to kv j in [0, pastLen+t]. Two passes
	// (max, then exp-sum while accumulating into o) keep softmax numerically stable
	// without a runtime-sized local buffer.
	attention: `
		struct AP { nTokens: u32, nHeads: u32, nKvHeads: u32, headDim: u32, kvLen: u32, pastLen: u32, scale: f32 };
		@group(0) @binding(0) var<uniform> p: AP;
		@group(0) @binding(1) var<storage, read> q: array<f32>;
		@group(0) @binding(2) var<storage, read> k: array<f32>;
		@group(0) @binding(3) var<storage, read> v: array<f32>;
		@group(0) @binding(4) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
			let idx = gid.x;
			if (idx >= p.nTokens * p.nHeads) { return; }
			let t = idx / p.nHeads;
			let h = idx % p.nHeads;
			let hd = p.headDim;
			let kvh = h / (p.nHeads / p.nKvHeads); // grouped-query: map q-head → kv-head
			let qBase = (t * p.nHeads + h) * hd;
			let last = p.pastLen + t;
			var m = -3.0e38;
			for (var j = 0u; j <= last; j = j + 1u) {
				let kB = (j * p.nKvHeads + kvh) * hd;
				var dot = 0.0;
				for (var d = 0u; d < hd; d = d + 1u) { dot = dot + q[qBase + d] * k[kB + d]; }
				m = max(m, dot * p.scale);
			}
			for (var d = 0u; d < hd; d = d + 1u) { o[qBase + d] = 0.0; }
			var denom = 0.0;
			for (var j = 0u; j <= last; j = j + 1u) {
				let kB = (j * p.nKvHeads + kvh) * hd;
				var dot = 0.0;
				for (var d = 0u; d < hd; d = d + 1u) { dot = dot + q[qBase + d] * k[kB + d]; }
				let w = exp(dot * p.scale - m);
				denom = denom + w;
				let vB = (j * p.nKvHeads + kvh) * hd;
				for (var d = 0u; d < hd; d = d + 1u) { o[qBase + d] = o[qBase + d] + w * v[vB + d]; }
			}
			let inv = 1.0 / denom;
			for (var d = 0u; d < hd; d = d + 1u) { o[qBase + d] = o[qBase + d] * inv; }
		}`,

	// Q4_K dequantization (GGML "k-quant"): super-blocks of 256 weights. Each block is
	// 144 bytes — fp16 d, fp16 dmin, 12 bytes of 6-bit packed scales/mins, 128 bytes of
	// 4-bit quants. We view the raw bytes as a u32 array and unpack. One invocation per
	// super-block writes 256 f32 outputs. Mirrors llama.cpp dequantize_row_q4_K exactly
	// (get_scale_min_k4 + the j+=64 loop: low nibbles → first 32, high nibbles → next 32).
	dequant_q4k: `
		struct DQ { nBlocks: u32 };
		@group(0) @binding(0) var<uniform> p: DQ;
		@group(0) @binding(1) var<storage, read> q: array<u32>;
		@group(0) @binding(2) var<storage, read_write> o: array<f32>;

		fn f16(h: u32) -> f32 {
			let s = (h >> 15u) & 1u;
			let e = (h >> 10u) & 0x1Fu;
			let m = h & 0x3FFu;
			var val: f32;
			if (e == 0u) {
				val = f32(m) * 5.9604645e-8;               // 2^-24 (subnormal)
			} else if (e == 31u) {
				val = 65504.0;                              // clamp inf/nan (shouldn't occur)
			} else {
				val = (1.0 + f32(m) / 1024.0) * pow(2.0, f32(e) - 15.0);
			}
			return select(val, -val, s == 1u);
		}

		// Byte k (0..143) of the super-block at u32 index base (36 u32 per block).
		fn byteAt(base: u32, k: u32) -> u32 {
			let word = q[base + (k >> 2u)];
			return (word >> ((k & 3u) * 8u)) & 0xFFu;
		}

		// get_scale_min_k4: returns (6-bit scale, 6-bit min) for sub-block j (0..7).
		// scales[12] live at byte offset 4 within the block.
		fn scaleMin(base: u32, j: u32) -> vec2<f32> {
			var d6: u32; var m6: u32;
			if (j < 4u) {
				d6 = byteAt(base, 4u + j) & 63u;
				m6 = byteAt(base, 4u + j + 4u) & 63u;
			} else {
				d6 = (byteAt(base, 4u + j + 4u) & 0xFu) | ((byteAt(base, 4u + j - 4u) >> 6u) << 4u);
				m6 = (byteAt(base, 4u + j + 4u) >> 4u) | ((byteAt(base, 4u + j) >> 6u) << 4u);
			}
			return vec2<f32>(f32(d6), f32(m6));
		}

		@compute @workgroup_size(64)
		fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
			let blk = gid.x;
			if (blk >= p.nBlocks) { return; }
			let base = blk * 36u;
			let d = f16(q[base] & 0xFFFFu);
			let dmin = f16((q[base] >> 16u) & 0xFFFFu);
			let outBase = blk * 256u;
			var is = 0u;
			var qsOff = 0u;
			for (var j = 0u; j < 256u; j = j + 64u) {
				let a = scaleMin(base, is);
				let d1 = d * a.x; let m1 = dmin * a.y;
				let b = scaleMin(base, is + 1u);
				let d2 = d * b.x; let m2 = dmin * b.y;
				for (var l = 0u; l < 32u; l = l + 1u) {
					let v = byteAt(base, 16u + qsOff + l);
					o[outBase + j + l]        = d1 * f32(v & 0xFu) - m1;
					o[outBase + j + 32u + l]  = d2 * f32(v >> 4u) - m2;
				}
				qsOff = qsOff + 32u;
				is = is + 2u;
			}
		}`,

	// Q8_0 dequant: 34-byte blocks (fp16 d + 32×int8), 32 weights. y[i] = d * qs[i].
	// Absolute byte addressing (34 isn't a multiple of 4, so per-block u32 indexing breaks).
	dequant_q8_0: `
		struct DQ { nBlocks: u32 };
		@group(0) @binding(0) var<uniform> p: DQ;
		@group(0) @binding(1) var<storage, read> q: array<u32>;
		@group(0) @binding(2) var<storage, read_write> o: array<f32>;
		fn gb(i: u32) -> u32 { return (q[i >> 2u] >> ((i & 3u) * 8u)) & 0xFFu; }
		fn f16(h: u32) -> f32 {
			let s=(h>>15u)&1u; let e=(h>>10u)&0x1Fu; let m=h&0x3FFu; var v:f32;
			if(e==0u){v=f32(m)*5.9604645e-8;}else if(e==31u){v=65504.0;}else{v=(1.0+f32(m)/1024.0)*pow(2.0,f32(e)-15.0);}
			return select(v,-v,s==1u);
		}
		fn si8(b: u32) -> f32 { let s=i32(b); return f32(select(s, s-256, s>127)); }
		@compute @workgroup_size(64)
		fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
			let blk=gid.x; if(blk>=p.nBlocks){return;}
			let base=blk*34u; let d=f16(gb(base)|(gb(base+1u)<<8u)); let ob=blk*32u;
			for(var l=0u;l<32u;l=l+1u){ o[ob+l]=d*si8(gb(base+2u+l)); }
		}`,

	// Q5_0 dequant: 22-byte blocks (fp16 d + 4-byte qh high-bits + 16-byte 4-bit qs), 32 weights.
	dequant_q5_0: `
		struct DQ { nBlocks: u32 };
		@group(0) @binding(0) var<uniform> p: DQ;
		@group(0) @binding(1) var<storage, read> q: array<u32>;
		@group(0) @binding(2) var<storage, read_write> o: array<f32>;
		fn gb(i: u32) -> u32 { return (q[i >> 2u] >> ((i & 3u) * 8u)) & 0xFFu; }
		fn f16(h: u32) -> f32 {
			let s=(h>>15u)&1u; let e=(h>>10u)&0x1Fu; let m=h&0x3FFu; var v:f32;
			if(e==0u){v=f32(m)*5.9604645e-8;}else if(e==31u){v=65504.0;}else{v=(1.0+f32(m)/1024.0)*pow(2.0,f32(e)-15.0);}
			return select(v,-v,s==1u);
		}
		@compute @workgroup_size(64)
		fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
			let blk=gid.x; if(blk>=p.nBlocks){return;}
			let base=blk*22u;
			let d=f16(gb(base)|(gb(base+1u)<<8u));
			let qh=gb(base+2u)|(gb(base+3u)<<8u)|(gb(base+4u)<<16u)|(gb(base+5u)<<24u);
			let ob=blk*32u;
			for(var j=0u;j<16u;j=j+1u){
				let qsj=gb(base+6u+j);
				let xh0=((qh>>j)<<4u)&0x10u;
				let xh1=(qh>>(j+12u))&0x10u;
				o[ob+j]      = d*f32(i32((qsj&0xFu)|xh0)-16);
				o[ob+j+16u]  = d*f32(i32((qsj>>4u)|xh1)-16);
			}
		}`,

	// Q6_K dequant: 210-byte super-blocks (128 ql + 64 qh + 16 int8 scales + fp16 d), 256 weights.
	// Mirrors llama.cpp dequantize_row_q6_K (two halves of 128, is = l/16, scales sc[is + {0,2,4,6}]).
	dequant_q6k: `
		struct DQ { nBlocks: u32 };
		@group(0) @binding(0) var<uniform> p: DQ;
		@group(0) @binding(1) var<storage, read> q: array<u32>;
		@group(0) @binding(2) var<storage, read_write> o: array<f32>;
		fn gb(i: u32) -> u32 { return (q[i >> 2u] >> ((i & 3u) * 8u)) & 0xFFu; }
		fn f16(h: u32) -> f32 {
			let s=(h>>15u)&1u; let e=(h>>10u)&0x1Fu; let m=h&0x3FFu; var v:f32;
			if(e==0u){v=f32(m)*5.9604645e-8;}else if(e==31u){v=65504.0;}else{v=(1.0+f32(m)/1024.0)*pow(2.0,f32(e)-15.0);}
			return select(v,-v,s==1u);
		}
		fn si8(b: u32) -> f32 { let s=i32(b); return f32(select(s, s-256, s>127)); }
		@compute @workgroup_size(64)
		fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
			let blk=gid.x; if(blk>=p.nBlocks){return;}
			let base=blk*210u;
			let d=f16(gb(base+208u)|(gb(base+209u)<<8u));
			let ob=blk*256u;
			for(var half=0u;half<2u;half=half+1u){
				let qlB=base+half*64u;
				let qhB=base+128u+half*32u;
				let scB=base+192u+half*8u;
				let outB=ob+half*128u;
				for(var l=0u;l<32u;l=l+1u){
					let is=l/16u;
					let qll=gb(qlB+l); let qll32=gb(qlB+l+32u); let qhl=gb(qhB+l);
					let q1=i32((qll&0xFu)|(((qhl>>0u)&3u)<<4u))-32;
					let q2=i32((qll32&0xFu)|(((qhl>>2u)&3u)<<4u))-32;
					let q3=i32((qll>>4u)|(((qhl>>4u)&3u)<<4u))-32;
					let q4=i32((qll32>>4u)|(((qhl>>6u)&3u)<<4u))-32;
					o[outB+l]     = d*si8(gb(scB+is+0u))*f32(q1);
					o[outB+l+32u] = d*si8(gb(scB+is+2u))*f32(q2);
					o[outB+l+64u] = d*si8(gb(scB+is+4u))*f32(q3);
					o[outB+l+96u] = d*si8(gb(scB+is+6u))*f32(q4);
				}
			}
		}`,

	// Row-broadcast bias add: o[r, c] = x[r, c] + bias[c]  (Qwen2 q/k/v projections).
	addbias: `
		struct BP { rows: u32, cols: u32 };
		@group(0) @binding(0) var<uniform> p: BP;
		@group(0) @binding(1) var<storage, read> x: array<f32>;
		@group(0) @binding(2) var<storage, read> bias: array<f32>;
		@group(0) @binding(3) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
			let i = gid.x;
			if (i >= p.rows * p.cols) { return; }
			o[i] = x[i] + bias[i % p.cols];
		}`
};

// Vectorized matmul_t with f16 WEIGHTS (the BWP fast path). Activations stay f32; the weight is
// read as array<vec4<f16>> (8-byte loads, half the bandwidth of f32) and converted to f32 for an
// f32-accumulated dot product — bandwidth win, full-precision math. Requires the device's
// `shader-f16` feature; only compiled/used when available. k % 4 == 0 (BWP guarantees it).
const MATMUL_T_F16W = `
	enable f16;
	struct Dims { m: u32, k: u32, n: u32 };
	@group(0) @binding(0) var<uniform> d: Dims;
	@group(0) @binding(1) var<storage, read> a: array<vec4<f32>>;
	@group(0) @binding(2) var<storage, read> w: array<vec4<f16>>;
	@group(0) @binding(3) var<storage, read_write> c: array<f32>;
	@compute @workgroup_size(8, 8)
	fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
		let row = gid.x; let col = gid.y;
		if (row >= d.m || col >= d.n) { return; }
		let kv = d.k / 4u;
		let aBase = row * kv;
		let wBase = col * kv;
		var acc = vec4<f32>(0.0);
		for (var i = 0u; i < kv; i = i + 1u) {
			acc = acc + a[aBase + i] * vec4<f32>(w[wBase + i]);
		}
		c[row * d.n + col] = acc.x + acc.y + acc.z + acc.w;
	}`;

export interface LayerWeightsGpu {
	// Same weights as LayerWeights, but EVERY tensor is a persistent GPU buffer (uploaded once).
	// Consumed by the GPU-resident decode path, which never copies activations back to the CPU.
	attnNorm: GPUAny; wq: GPUAny; wk: GPUAny; wv: GPUAny; wo: GPUAny;
	ffnNorm: GPUAny; wgate: GPUAny; wup: GPUAny; wdown: GPUAny;
	bq?: GPUAny; bk?: GPUAny; bv?: GPUAny;
	// True when the projection matrices (wq…wdown) are stored as f16 (BWP) → use the f16 matmul.
	matF16?: boolean;
}

export class WebGpuEngine {
	device: GPUAny = null;
	private modules: Record<string, GPUAny> = {};
	// Compute pipelines are expensive to create; cache one per shader and reuse it everywhere.
	private pipelines: Record<string, GPUAny> = {};
	// Largest single storage-buffer binding this device allows (bytes). Caps the biggest
	// weight tensor a layer slice can hold → reported to the master to size the model.
	maxStorageBufferBindingSize = 0;
	// Whether the device supports `shader-f16` (enables the f16-weight matmul for BWP models).
	hasF16 = false;
	// Set to the name of the selfValidate stage that failed (surfaced in the UI error), else null.
	validationFailure: string | null = null;

	async init(): Promise<boolean> {
		const gpu = (navigator as any).gpu;
		if (!gpu) return false;
		const adapter = await gpu.requestAdapter();
		if (!adapter) return false;
		// Request the adapter's MAX limits so capable GPUs can hold larger weight tensors
		// (the default cap is only 128 MiB, too small for a 7B FFN matrix).
		const lim = adapter.limits;
		const want = {
			maxStorageBufferBindingSize: lim.maxStorageBufferBindingSize,
			maxBufferSize: lim.maxBufferSize
		};
		// Opt into shader-f16 when the adapter offers it (BWP's f16-weight matmul needs it).
		const features: string[] = [];
		try { if (adapter.features?.has('shader-f16')) features.push('shader-f16'); } catch { /* older impls */ }
		try {
			this.device = await adapter.requestDevice({ requiredLimits: want, requiredFeatures: features });
		} catch {
			try { this.device = await adapter.requestDevice({ requiredLimits: want }); }
			catch { this.device = await adapter.requestDevice(); }
		}
		this.maxStorageBufferBindingSize = this.device.limits?.maxStorageBufferBindingSize ?? 134217728;
		this.hasF16 = !!this.device.features?.has?.('shader-f16');
		for (const [name, code] of Object.entries(SHADERS)) {
			this.modules[name] = this.device.createShaderModule({ code });
		}
		// The f16 module only compiles where `enable f16;` is supported.
		if (this.hasF16) this.modules['matmul_t_f16w'] = this.device.createShaderModule({ code: MATMUL_T_F16W });
		return true;
	}

	private buf(data: Float32Array, usage: number): GPUAny {
		const b = this.device.createBuffer({ size: data.byteLength, usage });
		this.device.queue.writeBuffer(b, 0, data);
		return b;
	}

	// Upload raw bytes (e.g. a Q4_K-quantized tensor) as a u32 storage buffer.
	private bufU32(data: Uint32Array, usage: number): GPUAny {
		const b = this.device.createBuffer({ size: data.byteLength, usage });
		this.device.queue.writeBuffer(b, 0, data);
		return b;
	}

	private async readBack(src: GPUAny, byteLength: number): Promise<Float32Array> {
		const G = globalThis as any;
		const read = this.device.createBuffer({
			size: byteLength,
			usage: G.GPUBufferUsage.COPY_DST | G.GPUBufferUsage.MAP_READ
		});
		const enc = this.device.createCommandEncoder();
		enc.copyBufferToBuffer(src, 0, read, 0, byteLength);
		this.device.queue.submit([enc.finish()]);
		await read.mapAsync(G.GPUMapMode.READ);
		const out = new Float32Array(read.getMappedRange().slice(0));
		read.unmap();
		read.destroy();
		return out;
	}

	// Cached compute pipeline for a shader (created lazily, reused across every dispatch).
	private pipeline(name: string): GPUAny {
		let p = this.pipelines[name];
		if (!p) {
			p = this.device.createComputePipeline({ layout: 'auto', compute: { module: this.modules[name], entryPoint: 'main' } });
			this.pipelines[name] = p;
		}
		return p;
	}

	// Records ONE compute pass into an existing command encoder — no submit, no readback. The
	// building block of the GPU-resident path: dozens of these chain into a single encoder so a
	// whole forward pass is one queue submit (vs. the per-op submit+mapAsync the readback path pays).
	private recordPass(enc: GPUAny, name: string, buffers: GPUAny[], workgroups: [number, number, number]): void {
		const pipeline = this.pipeline(name);
		const bind = this.device.createBindGroup({
			layout: pipeline.getBindGroupLayout(0),
			entries: buffers.map((buffer, i) => ({ binding: i, resource: { buffer } }))
		});
		const pass = enc.beginComputePass();
		pass.setPipeline(pipeline);
		pass.setBindGroup(0, bind);
		pass.dispatchWorkgroups(...workgroups);
		pass.end();
	}

	// Records + submits a compute pass (no readback). Used both by `run` (which then reads
	// back) and by the GPU-persistent dequant (which keeps the output buffer on the GPU).
	private dispatch(name: string, buffers: GPUAny[], workgroups: [number, number, number]): void {
		const enc = this.device.createCommandEncoder();
		this.recordPass(enc, name, buffers, workgroups);
		this.device.queue.submit([enc.finish()]);
	}

	private async run(
		name: string,
		buffers: GPUAny[],
		workgroups: [number, number, number],
		outBuffer: GPUAny,
		outBytes: number
	): Promise<Float32Array> {
		this.dispatch(name, buffers, workgroups);
		return this.readBack(outBuffer, outBytes);
	}

	// True if `w` is a Float32Array (needs uploading) vs an already-on-GPU buffer to reuse.
	private isF32(w: Float32Array | GPUAny): w is Float32Array {
		return w instanceof Float32Array;
	}

	// matmul/matmulT accept the weight either as a Float32Array (uploaded each call) OR as a
	// persistent GPUBuffer (uploaded ONCE, reused across tokens — the big decode-speed win).
	async matmul(a: Float32Array, b: Float32Array | GPUAny, m: number, k: number, n: number): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const dims = this.device.createBuffer({ size: 16, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(dims, 0, new Uint32Array([m, k, n]));
		const bufB = this.isF32(b) ? this.buf(b, ST) : b;
		const out = this.device.createBuffer({ size: m * n * 4, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run('matmul', [dims, this.buf(a, ST), bufB, out], [Math.ceil(m / 8), Math.ceil(n / 8), 1], out, m * n * 4);
	}

	// y = a[m,k] · wᵀ where w is [n,k] (GGUF [out,in] layout). out is [m,n].
	async matmulT(a: Float32Array, w: Float32Array | GPUAny, m: number, k: number, n: number, wF16 = false): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const dims = this.device.createBuffer({ size: 16, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(dims, 0, new Uint32Array([m, k, n]));
		const bufW = this.isF32(w) ? this.buf(w, ST) : w;
		const out = this.device.createBuffer({ size: m * n * 4, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run(this.matmulTShader(k, wF16), [dims, this.buf(a, ST), bufW, out], [Math.ceil(m / 8), Math.ceil(n / 8), 1], out, m * n * 4);
	}

	// Pick the matmul_t variant. f16-weight kernel when the weight is f16 AND the device supports
	// it; else the vec4 kernel (both operands contiguous along k, k%4==0 → 128-bit loads); else
	// the scalar fallback for a k that isn't a multiple of 4.
	private matmulTShader(k: number, wF16: boolean): string {
		if (wF16 && this.hasF16) return 'matmul_t_f16w';
		return k % 4 === 0 ? 'matmul_t_vec4' : 'matmul_t';
	}

	async rmsnorm(x: Float32Array, w: Float32Array, rows: number, dim: number, eps = 1e-5): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const p = this.device.createBuffer({ size: 16, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(p, 0, new Uint32Array([rows, dim]));
		this.device.queue.writeBuffer(p, 8, new Float32Array([eps]));
		const out = this.device.createBuffer({ size: x.byteLength, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run('rmsnorm', [p, this.buf(x, ST), this.buf(w, ST), out], [Math.ceil(rows / WG), 1, 1], out, x.byteLength);
	}

	private async binary(name: string, a: Float32Array, b: Float32Array): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const out = this.device.createBuffer({ size: a.byteLength, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run(name, [this.buf(a, ST), this.buf(b, ST), out], [Math.ceil(a.length / WG), 1, 1], out, a.byteLength);
	}
	swiglu(gate: Float32Array, up: Float32Array) { return this.binary('swiglu', gate, up); }
	add(a: Float32Array, b: Float32Array) { return this.binary('add', a, b); }

	// RoPE over x viewed as [rows, headDim], rows = seq * nHeads.
	async rope(x: Float32Array, rows: number, headDim: number, nHeads: number, pastLen = 0, base = 10000): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const p = this.device.createBuffer({ size: 32, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(p, 0, new Uint32Array([rows, headDim, nHeads, pastLen]));
		this.device.queue.writeBuffer(p, 16, new Float32Array([base]));
		const out = this.device.createBuffer({ size: x.byteLength, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run('rope', [p, this.buf(x, ST), out], [Math.ceil(rows / WG), 1, 1], out, x.byteLength);
	}

	// Causal attention with KV cache + GQA. q: [nTokens,nHeads,headDim]; k,v:
	// [kvLen,nKvHeads,headDim], kvLen = pastLen + nTokens. Returns [nTokens,nHeads,headDim].
	async attention(q: Float32Array, k: Float32Array, v: Float32Array, nTokens: number, nHeads: number, nKvHeads: number, headDim: number, pastLen = 0): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const kvLen = pastLen + nTokens;
		const p = this.device.createBuffer({ size: 32, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(p, 0, new Uint32Array([nTokens, nHeads, nKvHeads, headDim, kvLen, pastLen]));
		this.device.queue.writeBuffer(p, 24, new Float32Array([1 / Math.sqrt(headDim)]));
		const outBytes = nTokens * nHeads * headDim * 4;
		const out = this.device.createBuffer({ size: outBytes, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run('attention', [p, this.buf(q, ST), this.buf(k, ST), this.buf(v, ST), out], [Math.ceil((nTokens * nHeads) / WG), 1, 1], out, outBytes);
	}

	// o[r, c] = x[r, c] + bias[c]. Used for Qwen2's q/k/v projection biases.
	async addBias(x: Float32Array, bias: Float32Array, rows: number, cols: number): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const p = this.device.createBuffer({ size: 8, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(p, 0, new Uint32Array([rows, cols]));
		const out = this.device.createBuffer({ size: x.byteLength, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run('addbias', [p, this.buf(x, ST), this.buf(bias, ST), out], [Math.ceil(x.length / WG), 1, 1], out, x.byteLength);
	}

	// Number of weights per quant block, by GGML type. F32/F16 are "1 per block".
	private static BLOCK_ELEMS: Record<string, number> = {
		Q4_K: 256, Q5_K: 256, Q6_K: 256, Q8_0: 32, Q5_0: 32, Q4_0: 32, F32: 1, F16: 1
	};
	private static DEQUANT_SHADER: Record<string, string> = {
		Q4_K: 'dequant_q4k', Q8_0: 'dequant_q8_0', Q5_0: 'dequant_q5_0', Q6_K: 'dequant_q6k'
	};

	// Generic GPU dequant: upload the raw GGUF tensor bytes as u32, run the per-type kernel
	// (one invocation per quant block), read back the f32 weights. `blockElems` is how many
	// weights one block expands to. This is the bridge from streamed quantized model
	// weights to real WebGPU compute.
	private async dequantBlocked(shader: string, data: Uint8Array, nElems: number, blockElems: number): Promise<Float32Array> {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const nBlocks = nElems / blockElems;
		if (!Number.isInteger(nBlocks)) throw new Error(`${shader}: nElems ${nElems} not a multiple of ${blockElems}`);
		// View bytes as u32 (pad to a 4-byte multiple; block sizes aren't all 4-aligned).
		const padded = data.byteLength % 4 === 0 ? data : (() => {
			const t = new Uint8Array(Math.ceil(data.byteLength / 4) * 4);
			t.set(data);
			return t;
		})();
		const u32 = new Uint32Array(padded.buffer, padded.byteOffset, padded.byteLength / 4);
		const p = this.device.createBuffer({ size: 16, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(p, 0, new Uint32Array([nBlocks]));
		const out = this.device.createBuffer({ size: nElems * 4, usage: ST | G.GPUBufferUsage.COPY_SRC });
		return this.run(shader, [p, this.bufU32(u32, ST), out], [Math.ceil(nBlocks / WG), 1, 1], out, nElems * 4);
	}

	async dequantizeQ4K(data: Uint8Array, nElems: number) { return this.dequantBlocked('dequant_q4k', data, nElems, 256); }

	// Dequantize a tensor of any supported GGML type to f32, given the manifest's `type`
	// string. F32 is returned as-is; F16 is decoded on the CPU (cheap, only norms/biases).
	async dequantizeByType(type: string, data: Uint8Array, nElems: number): Promise<Float32Array> {
		if (type === 'F32') return new Float32Array(data.buffer, data.byteOffset, nElems);
		if (type === 'F16') {
			const dv = new DataView(data.buffer, data.byteOffset);
			const o = new Float32Array(nElems);
			for (let i = 0; i < nElems; i++) o[i] = f16ToF32(dv.getUint16(i * 2, true));
			return o;
		}
		const shader = WebGpuEngine.DEQUANT_SHADER[type];
		const blockElems = WebGpuEngine.BLOCK_ELEMS[type];
		if (!shader || !blockElems) throw new Error(`dequant: unsupported GGML type ${type}`);
		return this.dequantBlocked(shader, data, nElems, blockElems);
	}

	// Like dequantBlocked but KEEPS the f32 output on the GPU (no readback) and returns the
	// buffer — a persistent weight matmul/matmulT can reuse across every decode step.
	private dequantBlockedGpu(shader: string, data: Uint8Array, nElems: number, blockElems: number): GPUAny {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		const nBlocks = nElems / blockElems;
		if (!Number.isInteger(nBlocks)) throw new Error(`${shader}: nElems ${nElems} not a multiple of ${blockElems}`);
		const padded = data.byteLength % 4 === 0 ? data : (() => {
			const t = new Uint8Array(Math.ceil(data.byteLength / 4) * 4);
			t.set(data);
			return t;
		})();
		const u32 = new Uint32Array(padded.buffer, padded.byteOffset, padded.byteLength / 4);
		const p = this.device.createBuffer({ size: 16, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(p, 0, new Uint32Array([nBlocks]));
		const out = this.device.createBuffer({ size: nElems * 4, usage: ST });
		this.dispatch(shader, [p, this.bufU32(u32, ST), out], [Math.ceil(nBlocks / WG), 1, 1]);
		return out;
	}

	// Dequantize a tensor straight into a PERSISTENT GPU buffer (no CPU round-trip) — used to
	// upload each model weight ONCE and reuse it as a matmul operand across all decode steps.
	dequantizeToGpu(type: string, data: Uint8Array, nElems: number): GPUAny {
		const G = globalThis as any;
		const ST = G.GPUBufferUsage.STORAGE | G.GPUBufferUsage.COPY_DST;
		if (type === 'F32') {
			return this.buf(new Float32Array(data.buffer, data.byteOffset, nElems), ST);
		}
		if (type === 'F16') {
			const dv = new DataView(data.buffer, data.byteOffset);
			const o = new Float32Array(nElems);
			for (let i = 0; i < nElems; i++) o[i] = f16ToF32(dv.getUint16(i * 2, true));
			return this.buf(o, ST);
		}
		const shader = WebGpuEngine.DEQUANT_SHADER[type];
		const blockElems = WebGpuEngine.BLOCK_ELEMS[type];
		if (!shader || !blockElems) throw new Error(`dequant: unsupported GGML type ${type}`);
		return this.dequantBlockedGpu(shader, data, nElems, blockElems);
	}

	// Full pre-norm transformer layer forward (prefill, no KV cache) using the GPU kernels.
	// Supports GQA (nKvHeads ≤ nHeads), optional q/k/v biases, configurable RoPE base + eps —
	// i.e. both Llama and Qwen2. d = nHeads * headDim; k/v project to kvDim = nKvHeads*headDim.
	// `transposed` selects the weight layout: false ⇒ row-major [in, out] (used by the
	// self-test); true ⇒ GGUF [out, in] consumed directly via matmulT (real model weights).
	async layerForward(x: Float32Array, cfg: LayerCfg, w: LayerWeights, transposed = false): Promise<Float32Array> {
		const { seq, d, nHeads, nKvHeads, headDim, ffn, ropeTheta, eps } = cfg;
		const kvDim = nKvHeads * headDim;
		const mm = transposed
			? (a: Float32Array, b: Float32Array | GPUAny, m: number, k: number, n: number) => this.matmulT(a, b, m, k, n)
			: (a: Float32Array, b: Float32Array | GPUAny, m: number, k: number, n: number) => this.matmul(a, b, m, k, n);
		const n1 = await this.rmsnorm(x, w.attnNorm, seq, d, eps);
		let qP = await mm(n1, w.wq, seq, d, d);
		let kP = await mm(n1, w.wk, seq, d, kvDim);
		let vP = await mm(n1, w.wv, seq, d, kvDim);
		if (w.bq) qP = await this.addBias(qP, w.bq, seq, d);
		if (w.bk) kP = await this.addBias(kP, w.bk, seq, kvDim);
		if (w.bv) vP = await this.addBias(vP, w.bv, seq, kvDim);
		const q = await this.rope(qP, seq * nHeads, headDim, nHeads, 0, ropeTheta);
		const k = await this.rope(kP, seq * nKvHeads, headDim, nKvHeads, 0, ropeTheta);
		const attn = await this.attention(q, k, vP, seq, nHeads, nKvHeads, headDim);
		const proj = await mm(attn, w.wo, seq, d, d);
		const h = await this.add(x, proj);
		const n2 = await this.rmsnorm(h, w.ffnNorm, seq, d, eps);
		const gate = await mm(n2, w.wgate, seq, d, ffn);
		const up = await mm(n2, w.wup, seq, d, ffn);
		const g = await this.swiglu(gate, up);
		const down = await mm(g, w.wdown, seq, ffn, d);
		return this.add(h, down);
	}

	// Same as layerForward but with a KV cache: processes `seq` NEW tokens at absolute
	// positions [pastLen, pastLen+seq), attends over the past K/V (`pastK`/`pastV`, laid out
	// [pastLen, nKvHeads, headDim]) plus the new ones, and returns the OUTPUT hidden state
	// together with the GROWN cache {k, v} to persist for the next decode step. This turns a
	// distributed slice into an incremental decoder — no O(n²) re-prefill each token.
	async layerForwardKV(
		x: Float32Array, cfg: LayerCfg, w: LayerWeights,
		pastLen: number, pastK: Float32Array, pastV: Float32Array, transposed = false
	): Promise<{ out: Float32Array; k: Float32Array; v: Float32Array }> {
		const { seq, d, nHeads, nKvHeads, headDim, ffn, ropeTheta, eps } = cfg;
		const kvDim = nKvHeads * headDim;
		const mm = transposed
			? (a: Float32Array, b: Float32Array | GPUAny, mm_: number, kk: number, nn: number) => this.matmulT(a, b, mm_, kk, nn)
			: (a: Float32Array, b: Float32Array | GPUAny, mm_: number, kk: number, nn: number) => this.matmul(a, b, mm_, kk, nn);
		const cat = (a: Float32Array, b: Float32Array) => { const c = new Float32Array(a.length + b.length); c.set(a); c.set(b, a.length); return c; };
		const n1 = await this.rmsnorm(x, w.attnNorm, seq, d, eps);
		let qP = await mm(n1, w.wq, seq, d, d);
		let kP = await mm(n1, w.wk, seq, d, kvDim);
		let vP = await mm(n1, w.wv, seq, d, kvDim);
		if (w.bq) qP = await this.addBias(qP, w.bq, seq, d);
		if (w.bk) kP = await this.addBias(kP, w.bk, seq, kvDim);
		if (w.bv) vP = await this.addBias(vP, w.bv, seq, kvDim);
		const q = await this.rope(qP, seq * nHeads, headDim, nHeads, pastLen, ropeTheta);
		const newK = await this.rope(kP, seq * nKvHeads, headDim, nKvHeads, pastLen, ropeTheta);
		// Append the new tokens' K/V to the cache (token axis), then attend over all of it.
		const fullK = cat(pastK, newK);
		const fullV = cat(pastV, vP);
		const attn = await this.attention(q, fullK, fullV, seq, nHeads, nKvHeads, headDim, pastLen);
		const proj = await mm(attn, w.wo, seq, d, d);
		const h = await this.add(x, proj);
		const n2 = await this.rmsnorm(h, w.ffnNorm, seq, d, eps);
		const gate = await mm(n2, w.wgate, seq, d, ffn);
		const up = await mm(n2, w.wup, seq, d, ffn);
		const g = await this.swiglu(gate, up);
		const down = await mm(g, w.wdown, seq, ffn, d);
		const out = await this.add(h, down);
		return { out, k: fullK, v: fullV };
	}

	// ── GPU-resident decode path ──────────────────────────────────────────────
	// The methods above read every intermediate back to the CPU between kernels (one mapAsync
	// per op). For real inference that is ~13 GPU↔CPU round-trips per layer × N layers per
	// token — latency-bound, and the true bottleneck. The path below keeps every activation in
	// GPU buffers, records the entire token forward (all layers + final norm) into ONE command
	// encoder, submits ONCE, and reads back ONLY the last token's hidden state.

	private static readonly STORAGE_USAGE = 0x80 | 0x4 | 0x8; // STORAGE | COPY_DST | COPY_SRC

	// A fresh GPU storage buffer (readable/writable by shaders, copyable both ways).
	private storage(byteLength: number): GPUAny {
		return this.device.createBuffer({ size: byteLength, usage: WebGpuEngine.STORAGE_USAGE });
	}

	// Upload a Float32Array into a PERSISTENT storage buffer (for GPU-resident norms/biases).
	uploadGpu(data: Float32Array): GPUAny { return this.buf(data, WebGpuEngine.STORAGE_USAGE); }

	// Upload an f32 array to a PERSISTENT buffer as packed f16 (for the f16-weight matmul).
	uploadGpuF16(data: Float32Array): GPUAny {
		const u16 = new Uint16Array(data.length);
		for (let i = 0; i < data.length; i++) u16[i] = f32ToF16(data[i]);
		return this.bufU16(u16);
	}

	// Upload raw f16 bytes (e.g. straight from a BWP shard) to a PERSISTENT buffer, no conversion.
	uploadGpuRawF16(bytes: Uint8Array): GPUAny {
		// writeBuffer needs a 4-byte-multiple length; pad the buffer if necessary.
		const size = Math.ceil(bytes.byteLength / 4) * 4;
		const b = this.device.createBuffer({ size, usage: WebGpuEngine.STORAGE_USAGE });
		this.device.queue.writeBuffer(b, 0, bytes, 0, bytes.byteLength - (bytes.byteLength % 4));
		if (bytes.byteLength % 4) {
			const tail = new Uint8Array(4); tail.set(bytes.subarray(bytes.byteLength - (bytes.byteLength % 4)));
			this.device.queue.writeBuffer(b, bytes.byteLength - (bytes.byteLength % 4), tail);
		}
		return b;
	}

	private bufU16(data: Uint16Array): GPUAny {
		const b = this.device.createBuffer({ size: data.byteLength, usage: WebGpuEngine.STORAGE_USAGE });
		this.device.queue.writeBuffer(b, 0, data);
		return b;
	}

	// A small uniform buffer holding the given u32 values, then an optional f32 tail value.
	private uniform(u32: number[], floatTail?: { offset: number; value: number }): GPUAny {
		const G = globalThis as any;
		const b = this.device.createBuffer({ size: 32, usage: G.GPUBufferUsage.UNIFORM | G.GPUBufferUsage.COPY_DST });
		this.device.queue.writeBuffer(b, 0, new Uint32Array(u32));
		if (floatTail) this.device.queue.writeBuffer(b, floatTail.offset, new Float32Array([floatTail.value]));
		return b;
	}

	// Recording variants of each kernel: allocate the output (and any uniform), record the pass
	// into `enc`, push transient buffers onto `trash` for post-submit cleanup, return the output
	// buffer. They mirror the public (readback) kernels' parameter packing exactly.
	private recMatmulT(enc: GPUAny, trash: GPUAny[], a: GPUAny, w: GPUAny, m: number, k: number, n: number, wF16 = false): GPUAny {
		const dims = this.uniform([m, k, n]);
		const out = this.storage(m * n * 4);
		this.recordPass(enc, this.matmulTShader(k, wF16), [dims, a, w, out], [Math.ceil(m / 8), Math.ceil(n / 8), 1]);
		trash.push(dims, out);
		return out;
	}
	private recRmsnorm(enc: GPUAny, trash: GPUAny[], x: GPUAny, w: GPUAny, rows: number, dim: number, eps: number): GPUAny {
		const p = this.uniform([rows, dim], { offset: 8, value: eps });
		const out = this.storage(rows * dim * 4);
		this.recordPass(enc, 'rmsnorm', [p, x, w, out], [Math.ceil(rows / WG), 1, 1]);
		trash.push(p, out);
		return out;
	}
	private recRope(enc: GPUAny, trash: GPUAny[], x: GPUAny, rows: number, headDim: number, nHeads: number, pastLen: number, base: number): GPUAny {
		const p = this.uniform([rows, headDim, nHeads, pastLen], { offset: 16, value: base });
		const out = this.storage(rows * headDim * 4);
		this.recordPass(enc, 'rope', [p, x, out], [Math.ceil(rows / WG), 1, 1]);
		trash.push(p, out);
		return out;
	}
	private recAttention(enc: GPUAny, trash: GPUAny[], q: GPUAny, k: GPUAny, v: GPUAny, nTokens: number, nHeads: number, nKvHeads: number, headDim: number, kvLen: number, pastLen: number): GPUAny {
		const p = this.uniform([nTokens, nHeads, nKvHeads, headDim, kvLen, pastLen], { offset: 24, value: 1 / Math.sqrt(headDim) });
		const out = this.storage(nTokens * nHeads * headDim * 4);
		this.recordPass(enc, 'attention', [p, q, k, v, out], [Math.ceil((nTokens * nHeads) / WG), 1, 1]);
		trash.push(p, out);
		return out;
	}
	private recAddBias(enc: GPUAny, trash: GPUAny[], x: GPUAny, bias: GPUAny, rows: number, cols: number): GPUAny {
		const p = this.uniform([rows, cols]);
		const out = this.storage(rows * cols * 4);
		this.recordPass(enc, 'addbias', [p, x, bias, out], [Math.ceil((rows * cols) / WG), 1, 1]);
		trash.push(p, out);
		return out;
	}
	private recBinary(enc: GPUAny, trash: GPUAny[], name: string, a: GPUAny, b: GPUAny, len: number): GPUAny {
		const out = this.storage(len * 4);
		this.recordPass(enc, name, [a, b, out], [Math.ceil(len / WG), 1, 1]);
		trash.push(out);
		return out;
	}

	// Records one full pre-norm transformer layer (with KV cache + GQA) into `enc`, all on the
	// GPU. `kBuf`/`vBuf` are this layer's PERSISTENT cache (capacity ≥ pastLen+seq rows of
	// kvDim): the freshly-projected, RoPE'd K and V for the new tokens are copied in at row
	// offset `pastLen`, then attention reads the whole [0, pastLen+seq) range. Returns the
	// output hidden-state buffer (the next layer's input).
	private recordLayerKV(enc: GPUAny, trash: GPUAny[], x: GPUAny, cfg: LayerCfg, w: LayerWeightsGpu, pastLen: number, kBuf: GPUAny, vBuf: GPUAny): GPUAny {
		const { seq, d, nHeads, nKvHeads, headDim, ffn, ropeTheta, eps } = cfg;
		const kvDim = nKvHeads * headDim;
		const kvLen = pastLen + seq;
		const f16 = w.matF16 === true; // projection matrices stored f16 (BWP) → f16 matmul
		const n1 = this.recRmsnorm(enc, trash, x, w.attnNorm, seq, d, eps);
		let qP = this.recMatmulT(enc, trash, n1, w.wq, seq, d, d, f16);
		let kP = this.recMatmulT(enc, trash, n1, w.wk, seq, d, kvDim, f16);
		let vP = this.recMatmulT(enc, trash, n1, w.wv, seq, d, kvDim, f16);
		if (w.bq) qP = this.recAddBias(enc, trash, qP, w.bq, seq, d);
		if (w.bk) kP = this.recAddBias(enc, trash, kP, w.bk, seq, kvDim);
		if (w.bv) vP = this.recAddBias(enc, trash, vP, w.bv, seq, kvDim);
		const q = this.recRope(enc, trash, qP, seq * nHeads, headDim, nHeads, pastLen, ropeTheta);
		const newK = this.recRope(enc, trash, kP, seq * nKvHeads, headDim, nKvHeads, pastLen, ropeTheta);
		// Append the new tokens' K/V into the persistent cache at row offset pastLen. kvDim*4 is a
		// multiple of 4 (copy alignment), and capacity was ensured ≥ kvLen by the caller.
		const rowBytes = kvDim * 4;
		enc.copyBufferToBuffer(newK, 0, kBuf, pastLen * rowBytes, seq * rowBytes);
		enc.copyBufferToBuffer(vP, 0, vBuf, pastLen * rowBytes, seq * rowBytes);
		const attn = this.recAttention(enc, trash, q, kBuf, vBuf, seq, nHeads, nKvHeads, headDim, kvLen, pastLen);
		const proj = this.recMatmulT(enc, trash, attn, w.wo, seq, d, d, f16);
		const h = this.recBinary(enc, trash, 'add', x, proj, seq * d);
		const n2 = this.recRmsnorm(enc, trash, h, w.ffnNorm, seq, d, eps);
		const gate = this.recMatmulT(enc, trash, n2, w.wgate, seq, d, ffn, f16);
		const up = this.recMatmulT(enc, trash, n2, w.wup, seq, d, ffn, f16);
		const g = this.recBinary(enc, trash, 'swiglu', gate, up, seq * ffn);
		const down = this.recMatmulT(enc, trash, g, w.wdown, seq, ffn, d, f16);
		return this.recBinary(enc, trash, 'add', h, down, seq * d);
	}

	// ── Persistent per-layer KV cache (GPU) for the resident path ───────────────
	private kvGpu = new Map<number, { k: GPUAny; v: GPUAny; cap: number }>();
	private kvSession = '';

	private resetKvGpu(): void {
		for (const e of this.kvGpu.values()) { e.k.destroy?.(); e.v.destroy?.(); }
		this.kvGpu.clear();
		this.kvSession = '';
	}

	// Public: drop the GPU KV cache (called between generations; weights stay resident).
	clearKvCache(): void { this.resetKvGpu(); }

	// Ensure layer `layer`'s KV buffers hold at least `rows` rows of `kvDim`. Grows (alloc +
	// GPU-side copy of the old contents) in ≥1024-row steps so growth is rare and never touches
	// the CPU. Returns the (possibly new) buffers.
	private ensureKv(layer: number, rows: number, kvDim: number): { k: GPUAny; v: GPUAny; cap: number } {
		const e = this.kvGpu.get(layer);
		if (e && e.cap >= rows) return e;
		const cap = Math.max(rows, (e?.cap ?? 0) + 1024, 1024);
		const bytes = cap * kvDim * 4;
		const k = this.storage(bytes);
		const v = this.storage(bytes);
		if (e) {
			const oldBytes = e.cap * kvDim * 4;
			const enc = this.device.createCommandEncoder();
			enc.copyBufferToBuffer(e.k, 0, k, 0, oldBytes);
			enc.copyBufferToBuffer(e.v, 0, v, 0, oldBytes);
			this.device.queue.submit([enc.finish()]);
			e.k.destroy?.(); e.v.destroy?.();
		}
		const ne = { k, v, cap };
		this.kvGpu.set(layer, ne);
		return ne;
	}

	// GPU-resident forward over the token sequence: embed buffer → every layer → final norm,
	// recorded into a single command encoder, ONE submit, ONE readback of the last token's
	// hidden state ([d] f32). Handles both prefill (pastLen 0, seq = promptLen) and decode
	// (seq 1) — the KV cache persists per layer keyed by `sessionId`, reset when the session
	// changes or pastLen is 0.
	async runDecodeGpu(embeds: Float32Array, cfg: LayerCfg, layers: LayerWeightsGpu[], pastLen: number, finalNorm: GPUAny, sessionId: string): Promise<Float32Array> {
		const { seq, d, nKvHeads, headDim, eps } = cfg;
		const kvDim = nKvHeads * headDim;
		const kvLen = pastLen + seq;
		if (sessionId !== this.kvSession || pastLen === 0) {
			this.resetKvGpu();
			this.kvSession = sessionId;
		}
		for (let i = 0; i < layers.length; i++) this.ensureKv(i, kvLen, kvDim);

		const trash: GPUAny[] = [];
		const enc = this.device.createCommandEncoder();
		let x = this.storage(embeds.byteLength);
		this.device.queue.writeBuffer(x, 0, embeds);
		trash.push(x);
		for (let i = 0; i < layers.length; i++) {
			const kv = this.kvGpu.get(i)!;
			x = this.recordLayerKV(enc, trash, x, { ...cfg, seq }, layers[i], pastLen, kv.k, kv.v);
		}
		const normed = this.recRmsnorm(enc, trash, x, finalNorm, seq, d, eps);
		const lastRow = this.storage(d * 4);
		enc.copyBufferToBuffer(normed, (seq - 1) * d * 4, lastRow, 0, d * 4);
		this.device.queue.submit([enc.finish()]);
		const out = await this.readBack(lastRow, d * 4);
		lastRow.destroy?.();
		for (const b of trash) b.destroy?.();
		return out;
	}

	/// Runs each kernel on random inputs and checks it against a CPU reference.
	/// Returns true only if ALL kernels match — the gate for `can_compute`.
	async selfValidate(): Promise<boolean> {
		this.validationFailure = null;
		// Record + log which check failed (returns false so call sites stay `return fail('x')`).
		const fail = (stage: string): false => {
			this.validationFailure = stage;
			// eslint-disable-next-line no-console
			console.error('[selfValidate] FAILED at:', stage, '(hasF16=' + this.hasF16 + ')');
			return false;
		};
		const close = (x: Float32Array, y: Float32Array) =>
			x.length === y.length && x.every((v, i) => Math.abs(v - y[i]) < 1e-3);
		const rand = (n: number) => Float32Array.from({ length: n }, () => Math.random() * 2 - 1);

		// matmul 3x4 · 4x5
		const m = 3, k = 4, n = 5;
		const A = rand(m * k), B = rand(k * n);
		const refMM = new Float32Array(m * n);
		for (let r = 0; r < m; r++)
			for (let c = 0; c < n; c++) {
				let s = 0;
				for (let i = 0; i < k; i++) s += A[r * k + i] * B[i * n + c];
				refMM[r * n + c] = s;
			}
		if (!close(await this.matmul(A, B, m, k, n), refMM)) return fail('matmul');

		// matmul_t (y = a · wᵀ, weight stored [n,k] GGUF-style) — the matmul every real model
		// op goes through (transposed=true). Cover BOTH the vec4 path (k%4==0) and the scalar
		// fallback (k%4≠0), including the m=1 decode shape.
		{
			const refT = (a: Float32Array, wt: Float32Array, mm: number, kk: number, nn: number) => {
				const o = new Float32Array(mm * nn);
				for (let r = 0; r < mm; r++)
					for (let c = 0; c < nn; c++) {
						let s = 0;
						for (let i = 0; i < kk; i++) s += a[r * kk + i] * wt[c * kk + i];
						o[r * nn + c] = s;
					}
				return o;
			};
			const checkT = async (mm: number, kk: number, nn: number) => {
				const a = rand(mm * kk), wt = rand(nn * kk);
				return close(await this.matmulT(a, wt, mm, kk, nn), refT(a, wt, mm, kk, nn));
			};
			if (!(await checkT(3, 8, 5))) return fail('matmulT.vec4(3,8,5)');
			if (!(await checkT(1, 16, 7))) return fail('matmulT.vec4(1,16,7)');
			if (!(await checkT(2, 6, 4))) return fail('matmulT.scalar(2,6,4)');

			// f16-weight matmul (BWP fast path), where supported: weight rounded to f16, dot
			// product accumulated in f32. Error stays within the f16 weight-precision budget.
			if (this.hasF16) {
				const m = 1, k = 16, n = 7;
				const a = rand(m * k), wt = rand(n * k);
				const wBuf = this.uploadGpuF16(wt);
				const got = await this.matmulT(a, wBuf, m, k, n, true);
				const ref = new Float32Array(m * n);
				for (let c = 0; c < n; c++) { let s = 0; for (let i = 0; i < k; i++) s += a[i] * wt[c * k + i]; ref[c] = s; }
				wBuf.destroy?.();
				// f16 weights → relative tolerance (closeRel isn't in scope yet here).
				const okF16 = got.length === ref.length && got.every((v, i) => Math.abs(v - ref[i]) <= 3e-2 * (1 + Math.abs(ref[i])));
				if (!okF16) return fail('matmulT.f16');
			}
		}

		// rmsnorm 2 rows, dim 8
		const rows = 2, dim = 8;
		const X = rand(rows * dim), W = rand(dim);
		const refRN = new Float32Array(rows * dim);
		for (let r = 0; r < rows; r++) {
			let ss = 0;
			for (let i = 0; i < dim; i++) ss += X[r * dim + i] ** 2;
			const inv = 1 / Math.sqrt(ss / dim + 1e-5);
			for (let i = 0; i < dim; i++) refRN[r * dim + i] = X[r * dim + i] * inv * W[i];
		}
		if (!close(await this.rmsnorm(X, W, rows, dim), refRN)) return fail('rmsnorm');

		// swiglu + add over 16 elems
		const g = rand(16), u = rand(16);
		const refSG = g.map((v, i) => (v / (1 + Math.exp(-v))) * u[i]);
		if (!close(await this.swiglu(g, u), refSG)) return fail('swiglu');
		const refAdd = g.map((v, i) => v + u[i]);
		if (!close(await this.add(g, u), refAdd)) return fail('add');

		// Relative tolerance for the deeper kernels / chained matmuls (error accumulates).
		const closeRel = (x: Float32Array, y: Float32Array, tol = 3e-3) =>
			x.length === y.length && x.every((val, i) => Math.abs(val - y[i]) <= tol * (1 + Math.abs(y[i])));

		// RoPE: 1 token, 2 heads, headDim 4, pastLen 1 (so positions = 1).
		{
			const nHeads = 2, headDim = 4, rows = 1 * nHeads, pastLen = 1, base = 10000;
			const xr = rand(rows * headDim);
			if (!closeRel(await this.rope(xr, rows, headDim, nHeads, pastLen, base), ropeCpu(xr, rows, headDim, nHeads, pastLen, base))) return fail('rope');
		}

		// Attention with KV cache + GQA: 2 new tokens, 4 q-heads / 2 kv-heads, headDim 4, pastLen 2.
		{
			const nTokens = 2, nHeads = 4, nKvHeads = 2, headDim = 4, pastLen = 2, kvLen = pastLen + nTokens;
			const q = rand(nTokens * nHeads * headDim);
			const k = rand(kvLen * nKvHeads * headDim);
			const v = rand(kvLen * nKvHeads * headDim);
			if (!closeRel(await this.attention(q, k, v, nTokens, nHeads, nKvHeads, headDim, pastLen), attentionCpu(q, k, v, nTokens, nHeads, nKvHeads, headDim, pastLen))) return fail('attention');
		}

		// Full transformer-layer forward (prefill) in a Qwen2-shaped config: GQA (4 q / 2 kv
		// heads), q/k/v biases, RoPE base 10000, eps 1e-6 — the gate for a real swarm contribution.
		{
			const seq = 3, nHeads = 4, nKvHeads = 2, headDim = 4, d = nHeads * headDim, kvDim = nKvHeads * headDim, ffn = 16;
			const cfg: LayerCfg = { seq, d, nHeads, nKvHeads, headDim, ffn, ropeTheta: 10000, eps: 1e-6 };
			const w: LayerWeights = {
				attnNorm: rand(d), wq: rand(d * d), wk: rand(d * kvDim), wv: rand(d * kvDim), wo: rand(d * d),
				bq: rand(d), bk: rand(kvDim), bv: rand(kvDim),
				ffnNorm: rand(d), wgate: rand(d * ffn), wup: rand(d * ffn), wdown: rand(ffn * d)
			};
			const x = rand(seq * d);
			if (!closeRel(await this.layerForward(x, cfg, w), layerForwardCpu(x, cfg, w), 5e-3)) return fail('layerForward');
		}

		// Q4_K dequantization: build random valid super-blocks (controlled fp16 d/dmin so
		// no inf/nan, random 6-bit scales + 4-bit quants) and check the GPU dequant against
		// the CPU reference that mirrors llama.cpp. This is the gate for streaming real
		// quantized model weights to the browser.
		{
			const nBlocks = 5;
			const bytes = new Uint8Array(nBlocks * 144);
			for (let blk = 0; blk < nBlocks; blk++) {
				const b = blk * 144;
				const dv = new DataView(bytes.buffer);
				dv.setUint16(b, f32ToF16(0.005 + Math.random() * 0.05), true);     // d
				dv.setUint16(b + 2, f32ToF16(0.001 + Math.random() * 0.02), true); // dmin
				for (let i = 4; i < 144; i++) bytes[b + i] = (Math.random() * 256) | 0;
			}
			const got = await this.dequantizeQ4K(bytes, nBlocks * 256);
			if (!closeRel(got, dequantQ4KCpu(bytes, nBlocks), 1e-4)) return fail('dequant.Q4_K');
		}

		// Q8_0 / Q5_0 / Q6_K dequant — the other quant types a real Qwen2 Q4_K_M model
		// uses for its layer tensors (verified via the master's /model/manifest). Each is
		// checked against a CPU reference mirroring llama.cpp.
		{
			const randBytes = (n: number) => { const b = new Uint8Array(n); for (let i = 0; i < n; i++) b[i] = (Math.random() * 256) | 0; return b; };
			const withScale = (b: Uint8Array, blockBytes: number) => {
				// Put a controlled fp16 scale at the block's d-offset so no inf/nan.
				const dv = new DataView(b.buffer);
				const dOff = (blk: number) => blockBytes === 210 ? blk * 210 + 208 : blk * blockBytes; // Q6_K d is last
				for (let blk = 0; blk * blockBytes < b.length; blk++) dv.setUint16(dOff(blk), f32ToF16(0.005 + Math.random() * 0.05), true);
				return b;
			};
			const nb = 4;
			const q8 = withScale(randBytes(nb * 34), 34);
			if (!closeRel(await this.dequantizeByType('Q8_0', q8, nb * 32), dequantQ8_0Cpu(q8, nb), 1e-4)) return fail('dequant.Q8_0');
			const q5 = withScale(randBytes(nb * 22), 22);
			if (!closeRel(await this.dequantizeByType('Q5_0', q5, nb * 32), dequantQ5_0Cpu(q5, nb), 1e-4)) return fail('dequant.Q5_0');
			const q6 = withScale(randBytes(nb * 210), 210);
			if (!closeRel(await this.dequantizeByType('Q6_K', q6, nb * 256), dequantQ6KCpu(q6, nb), 1e-4)) return fail('dequant.Q6_K');
		}

		// KV cache correctness: a 2-token prefill followed by a 1-token decode (with the
		// cached K/V) must yield the SAME last-token output as a full 3-token prefill.
		{
			const nHeads = 4, nKvHeads = 2, headDim = 4, d = nHeads * headDim, kvDim = nKvHeads * headDim, ffn = 16;
			const base = { d, nHeads, nKvHeads, headDim, ffn, ropeTheta: 10000, eps: 1e-6 };
			const w: LayerWeights = {
				attnNorm: rand(d), wq: rand(d * d), wk: rand(d * kvDim), wv: rand(d * kvDim), wo: rand(d * d),
				bq: rand(d), bk: rand(kvDim), bv: rand(kvDim),
				ffnNorm: rand(d), wgate: rand(d * ffn), wup: rand(d * ffn), wdown: rand(ffn * d)
			};
			const x = rand(3 * d);
			const full = await this.layerForward(x, { ...base, seq: 3 }, w);
			const fullLast = full.slice(2 * d, 3 * d);
			const empty = new Float32Array(0);
			const s1 = await this.layerForwardKV(x.slice(0, 2 * d), { ...base, seq: 2 }, w, 0, empty, empty);
			const s2 = await this.layerForwardKV(x.slice(2 * d, 3 * d), { ...base, seq: 1 }, w, 2, s1.k, s1.v);
			if (!closeRel(s2.out, fullLast, 5e-3)) return fail('layerForwardKV');
		}

		// GPU-resident decode path: the whole forward stays on the GPU (one submit, one
		// readback). Verify it against the trusted CPU reference, BOTH as a single prefill and
		// as a prefill-then-cached-decode split — this is the gate for using it for real tokens.
		{
			const nHeads = 4, nKvHeads = 2, headDim = 4, d = nHeads * headDim, kvDim = nKvHeads * headDim, ffn = 16;
			const cfg: LayerCfg = { seq: 4, d, nHeads, nKvHeads, headDim, ffn, ropeTheta: 10000, eps: 1e-6 };
			const wCpu: LayerWeights = {
				attnNorm: rand(d), wq: rand(d * d), wk: rand(d * kvDim), wv: rand(d * kvDim), wo: rand(d * d),
				bq: rand(d), bk: rand(kvDim), bv: rand(kvDim),
				ffnNorm: rand(d), wgate: rand(d * ffn), wup: rand(d * ffn), wdown: rand(ffn * d)
			};
			const finalNormArr = rand(d);
			const x = rand(4 * d);
			// Reference = the trusted READBACK path in TRANSPOSED mode (matmulT) — the SAME matmul
			// orientation the resident path uses. (layerForwardCpu uses NON-transposed matmul, so
			// it's the wrong reference for matmulT and would always mismatch on non-symmetric
			// weights.) This validates that the resident orchestration == the readback path.
			const empty0 = new Float32Array(0);
			const rb = await this.layerForwardKV(x, { ...cfg, seq: 4 }, wCpu, 0, empty0, empty0, true);
			const ref = rmsnormCpu(rb.out.slice(3 * d, 4 * d), finalNormArr, 1, d, 1e-6);

			const gpuW: LayerWeightsGpu = {
				attnNorm: this.uploadGpu(wCpu.attnNorm), wq: this.uploadGpu(wCpu.wq as Float32Array), wk: this.uploadGpu(wCpu.wk as Float32Array),
				wv: this.uploadGpu(wCpu.wv as Float32Array), wo: this.uploadGpu(wCpu.wo as Float32Array), ffnNorm: this.uploadGpu(wCpu.ffnNorm),
				wgate: this.uploadGpu(wCpu.wgate as Float32Array), wup: this.uploadGpu(wCpu.wup as Float32Array), wdown: this.uploadGpu(wCpu.wdown as Float32Array),
				bq: this.uploadGpu(wCpu.bq!), bk: this.uploadGpu(wCpu.bk!), bv: this.uploadGpu(wCpu.bv!)
			};
			const finalNormBuf = this.uploadGpu(finalNormArr);

			// (a) single 4-token prefill
			const got = await this.runDecodeGpu(x, { ...cfg, seq: 4 }, [gpuW], 0, finalNormBuf, 'selftest-A');
			if (!closeRel(got, ref, 8e-3)) { this.resetKvGpu(); return fail('runDecodeGpu.prefill'); }
			// (b) 3-token prefill + 1-token cached decode must reproduce the same last token
			await this.runDecodeGpu(x.slice(0, 3 * d), { ...cfg, seq: 3 }, [gpuW], 0, finalNormBuf, 'selftest-B');
			const dec = await this.runDecodeGpu(x.slice(3 * d, 4 * d), { ...cfg, seq: 1 }, [gpuW], 3, finalNormBuf, 'selftest-B');
			if (!closeRel(dec, ref, 8e-3)) { this.resetKvGpu(); return fail('runDecodeGpu.decode'); }

			this.resetKvGpu();
			for (const b of Object.values(gpuW)) b?.destroy?.();
			finalNormBuf.destroy?.();
		}

		return true;
	}
}

// ── CPU references (used only by selfValidate) ───────────────────────────────

// fp16 bits → f32, mirroring the WGSL `f16` helper exactly.
function f16ToF32(h: number): number {
	const s = (h >> 15) & 1;
	const e = (h >> 10) & 0x1f;
	const m = h & 0x3ff;
	let val: number;
	if (e === 0) val = m * 5.9604645e-8;
	else if (e === 31) val = 65504;
	else val = (1 + m / 1024) * 2 ** (e - 15);
	return s === 1 ? -val : val;
}

// f32 → fp16 bits (round-to-nearest-even), used only to build test data in a range
// that decodes cleanly (no inf/nan/subnormal) on both CPU and GPU.
function f32ToF16(val: number): number {
	const f = new Float32Array(1);
	const i = new Uint32Array(f.buffer);
	f[0] = val;
	const x = i[0];
	const sign = (x >> 16) & 0x8000;
	let exp = ((x >> 23) & 0xff) - 127 + 15;
	let mant = x & 0x7fffff;
	if (exp <= 0) return sign; // flush tiny to zero (test inputs avoid this)
	if (exp >= 31) return sign | 0x7bff; // clamp to max-normal
	// round mantissa to 10 bits, round-to-nearest-even
	const round = (mant >> 13) + ((mant >> 12) & 1);
	mant = round;
	if (mant === 0x400) { mant = 0; exp += 1; }
	return sign | (exp << 10) | (mant & 0x3ff);
}

// CPU reference for Q4_K dequant, mirroring llama.cpp dequantize_row_q4_K.
function dequantQ4KCpu(bytes: Uint8Array, nBlocks: number): Float32Array {
	const out = new Float32Array(nBlocks * 256);
	const dv = new DataView(bytes.buffer, bytes.byteOffset);
	for (let blk = 0; blk < nBlocks; blk++) {
		const base = blk * 144;
		const d = f16ToF32(dv.getUint16(base, true));
		const dmin = f16ToF32(dv.getUint16(base + 2, true));
		const sc = (j: number): [number, number] => {
			const s = (k: number) => bytes[base + 4 + k]; // scales[12] at offset 4
			if (j < 4) return [s(j) & 63, s(j + 4) & 63];
			return [
				(s(j + 4) & 0xf) | ((s(j - 4) >> 6) << 4),
				(s(j + 4) >> 4) | ((s(j) >> 6) << 4)
			];
		};
		const outBase = blk * 256;
		let is = 0;
		let qsOff = 0;
		for (let j = 0; j < 256; j += 64) {
			const [a0, a1] = sc(is);
			const d1 = d * a0, m1 = dmin * a1;
			const [b0, b1] = sc(is + 1);
			const d2 = d * b0, m2 = dmin * b1;
			for (let l = 0; l < 32; l++) {
				const v = bytes[base + 16 + qsOff + l]; // qs[128] at offset 16
				out[outBase + j + l] = d1 * (v & 0xf) - m1;
				out[outBase + j + 32 + l] = d2 * (v >> 4) - m2;
			}
			qsOff += 32;
			is += 2;
		}
	}
	return out;
}

// Signed int8 from a byte.
function si8(b: number): number { return b > 127 ? b - 256 : b; }

// CPU references for the other GGML quant types (mirror llama.cpp dequantize_row_*).
function dequantQ8_0Cpu(bytes: Uint8Array, nBlocks: number): Float32Array {
	const out = new Float32Array(nBlocks * 32);
	const dv = new DataView(bytes.buffer, bytes.byteOffset);
	for (let blk = 0; blk < nBlocks; blk++) {
		const base = blk * 34;
		const d = f16ToF32(dv.getUint16(base, true));
		for (let l = 0; l < 32; l++) out[blk * 32 + l] = d * si8(bytes[base + 2 + l]);
	}
	return out;
}

function dequantQ5_0Cpu(bytes: Uint8Array, nBlocks: number): Float32Array {
	const out = new Float32Array(nBlocks * 32);
	const dv = new DataView(bytes.buffer, bytes.byteOffset);
	for (let blk = 0; blk < nBlocks; blk++) {
		const base = blk * 22;
		const d = f16ToF32(dv.getUint16(base, true));
		const qh = dv.getUint32(base + 2, true);
		for (let j = 0; j < 16; j++) {
			const qsj = bytes[base + 6 + j];
			const xh0 = ((qh >>> j) << 4) & 0x10;
			const xh1 = (qh >>> (j + 12)) & 0x10;
			out[blk * 32 + j] = d * (((qsj & 0xf) | xh0) - 16);
			out[blk * 32 + j + 16] = d * (((qsj >> 4) | xh1) - 16);
		}
	}
	return out;
}

function dequantQ6KCpu(bytes: Uint8Array, nBlocks: number): Float32Array {
	const out = new Float32Array(nBlocks * 256);
	const dv = new DataView(bytes.buffer, bytes.byteOffset);
	for (let blk = 0; blk < nBlocks; blk++) {
		const base = blk * 210;
		const d = f16ToF32(dv.getUint16(base + 208, true));
		const ob = blk * 256;
		for (let half = 0; half < 2; half++) {
			const qlB = base + half * 64, qhB = base + 128 + half * 32, scB = base + 192 + half * 8, outB = ob + half * 128;
			for (let l = 0; l < 32; l++) {
				const is = (l / 16) | 0;
				const qll = bytes[qlB + l], qll32 = bytes[qlB + l + 32], qhl = bytes[qhB + l];
				const q1 = ((qll & 0xf) | (((qhl >> 0) & 3) << 4)) - 32;
				const q2 = ((qll32 & 0xf) | (((qhl >> 2) & 3) << 4)) - 32;
				const q3 = ((qll >> 4) | (((qhl >> 4) & 3) << 4)) - 32;
				const q4 = ((qll32 >> 4) | (((qhl >> 6) & 3) << 4)) - 32;
				out[outB + l] = d * si8(bytes[scB + is]) * q1;
				out[outB + l + 32] = d * si8(bytes[scB + is + 2]) * q2;
				out[outB + l + 64] = d * si8(bytes[scB + is + 4]) * q3;
				out[outB + l + 96] = d * si8(bytes[scB + is + 6]) * q4;
			}
		}
	}
	return out;
}

function matmulCpu(a: Float32Array, b: Float32Array, m: number, k: number, n: number): Float32Array {
	const o = new Float32Array(m * n);
	for (let r = 0; r < m; r++)
		for (let c = 0; c < n; c++) {
			let s = 0;
			for (let i = 0; i < k; i++) s += a[r * k + i] * b[i * n + c];
			o[r * n + c] = s;
		}
	return o;
}

function rmsnormCpu(x: Float32Array, w: Float32Array, rows: number, dim: number, eps = 1e-5): Float32Array {
	const o = new Float32Array(rows * dim);
	for (let r = 0; r < rows; r++) {
		let ss = 0;
		for (let i = 0; i < dim; i++) ss += x[r * dim + i] ** 2;
		const inv = 1 / Math.sqrt(ss / dim + eps);
		for (let i = 0; i < dim; i++) o[r * dim + i] = x[r * dim + i] * inv * w[i];
	}
	return o;
}

function ropeCpu(x: Float32Array, rows: number, headDim: number, nHeads: number, pastLen = 0, base = 10000): Float32Array {
	const o = new Float32Array(x.length);
	const half = headDim / 2;
	for (let r = 0; r < rows; r++) {
		const pos = pastLen + Math.floor(r / nHeads);
		const bse = r * headDim;
		for (let i = 0; i < half; i++) {
			const freq = pos / base ** ((2 * i) / headDim);
			const c = Math.cos(freq), s = Math.sin(freq);
			const x0 = x[bse + i], x1 = x[bse + i + half];
			o[bse + i] = x0 * c - x1 * s;
			o[bse + i + half] = x1 * c + x0 * s;
		}
	}
	return o;
}

function addBiasCpu(x: Float32Array, bias: Float32Array, cols: number): Float32Array {
	return x.map((v, i) => v + bias[i % cols]) as Float32Array;
}

function attentionCpu(q: Float32Array, k: Float32Array, v: Float32Array, nTokens: number, nHeads: number, nKvHeads: number, headDim: number, pastLen = 0): Float32Array {
	const o = new Float32Array(nTokens * nHeads * headDim);
	const scale = 1 / Math.sqrt(headDim);
	const group = nHeads / nKvHeads;
	for (let t = 0; t < nTokens; t++)
		for (let h = 0; h < nHeads; h++) {
			const kvh = Math.floor(h / group);
			const qB = (t * nHeads + h) * headDim;
			const last = pastLen + t;
			const scores: number[] = [];
			let mx = -Infinity;
			for (let j = 0; j <= last; j++) {
				const kB = (j * nKvHeads + kvh) * headDim;
				let dot = 0;
				for (let dd = 0; dd < headDim; dd++) dot += q[qB + dd] * k[kB + dd];
				const s = dot * scale;
				scores[j] = s;
				if (s > mx) mx = s;
			}
			let denom = 0;
			for (let j = 0; j <= last; j++) { scores[j] = Math.exp(scores[j] - mx); denom += scores[j]; }
			for (let j = 0; j <= last; j++) {
				const w = scores[j] / denom;
				const vB = (j * nKvHeads + kvh) * headDim;
				for (let dd = 0; dd < headDim; dd++) o[qB + dd] += w * v[vB + dd];
			}
		}
	return o;
}

function layerForwardCpu(x: Float32Array, cfg: LayerCfg, w: LayerWeights): Float32Array {
	const { seq, d, nHeads, nKvHeads, headDim, ffn, ropeTheta, eps } = cfg;
	const kvDim = nKvHeads * headDim;
	const n1 = rmsnormCpu(x, w.attnNorm, seq, d, eps);
	let qP = matmulCpu(n1, w.wq, seq, d, d);
	let kP = matmulCpu(n1, w.wk, seq, d, kvDim);
	let vP = matmulCpu(n1, w.wv, seq, d, kvDim);
	if (w.bq) qP = addBiasCpu(qP, w.bq, d);
	if (w.bk) kP = addBiasCpu(kP, w.bk, kvDim);
	if (w.bv) vP = addBiasCpu(vP, w.bv, kvDim);
	const q = ropeCpu(qP, seq * nHeads, headDim, nHeads, 0, ropeTheta);
	const k = ropeCpu(kP, seq * nKvHeads, headDim, nKvHeads, 0, ropeTheta);
	const attn = attentionCpu(q, k, vP, seq, nHeads, nKvHeads, headDim);
	const proj = matmulCpu(attn, w.wo, seq, d, d);
	const h = x.map((val, i) => val + proj[i]);
	const n2 = rmsnormCpu(h, w.ffnNorm, seq, d, eps);
	const gate = matmulCpu(n2, w.wgate, seq, d, ffn);
	const up = matmulCpu(n2, w.wup, seq, d, ffn);
	const g = gate.map((val, i) => (val / (1 + Math.exp(-val))) * up[i]);
	const down = matmulCpu(g, w.wdown, seq, ffn, d);
	return h.map((val, i) => val + down[i]);
}
