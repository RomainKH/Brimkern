"use strict";(()=>{function he(g){let t=new Float32Array(1),r=new Uint32Array(t.buffer);t[0]=g;let e=r[0],n=e>>16&32768,a=(e>>23&255)-127+15,s=e&8388607;return a<=0?n:a>=31?n|31743:(s=(s>>13)+(s>>12&1),s===1024&&(s=0,a+=1),n|a<<10|s&1023)}function te(g){let t=g>>15&1,r=g>>10&31,e=g&1023,n;return r===0?n=e*59604645e-15:r===31?n=e?NaN:1/0:n=(1+e/1024)*2**(r-15),t===1?-n:n}var ae=32;function Ae(g){let t=g.length;if(t%ae!==0)throw new Error(`q4web: length ${t} not a multiple of ${ae}`);let r=t/ae,e=new Uint8Array(t/2),n=new Uint16Array(r),a=new Uint16Array(r);for(let s=0;s<r;s++){let i=s*ae,o=1/0,u=-1/0;for(let p=0;p<ae;p++){let m=g[i+p];m<o&&(o=m),m>u&&(u=m)}let c=(u-o)/15||1e-8,f=he(c),l=he(o);n[s]=f,a[s]=l;let h=te(f)||1e-8,d=te(l);for(let p=0;p<ae;p++){let m=Math.round((g[i+p]-d)/h);m=m<0?0:m>15?15:m;let v=i+p;(p&1)===0?e[v>>1]=m:e[v>>1]|=m<<4}}return{nibbles:e,scales:n,mins:a,nElems:t}}function fe(g,t){let r=t/ae,e=t/2,n=g.slice(0,e),a=new Uint16Array(r),s=new Uint16Array(r),i=new DataView(g.buffer,g.byteOffset);for(let o=0;o<r;o++)a[o]=i.getUint16(e+o*2,!0);for(let o=0;o<r;o++)s[o]=i.getUint16(e+r*2+o*2,!0);return{nibbles:n,scales:a,mins:s,nElems:t}}function se(g){let t=new Float32Array(g.nElems),r=g.nElems/ae;for(let e=0;e<r;e++){let n=te(g.scales[e]),a=te(g.mins[e]),s=e*ae;for(let i=0;i<ae;i++){let o=s+i,u=g.nibbles[o>>1],c=(i&1)===0?u&15:u>>4;t[o]=c*n+a}}return t}var ie=32;function Ue(g){let t=g.length;if(t%ie!==0)throw new Error(`q8web: length ${t} not a multiple of ${ie}`);let r=t/ie,e=new Int8Array(t),n=new Uint16Array(r);for(let a=0;a<r;a++){let s=a*ie,i=0;for(let f=0;f<ie;f++){let l=Math.abs(g[s+f]);l>i&&(i=l)}let o=i/127||1e-8,u=he(o);n[a]=u;let c=te(u)||1e-8;for(let f=0;f<ie;f++){let l=Math.round(g[s+f]/c);l=l<-127?-127:l>127?127:l,e[s+f]=l}}return{codes:e,scales:n,nElems:t}}function ge(g,t){let r=t/ie,e=new Int8Array(g.buffer.slice(g.byteOffset,g.byteOffset+t)),n=new Uint16Array(r),a=new DataView(g.buffer,g.byteOffset);for(let s=0;s<r;s++)n[s]=a.getUint16(t+s*2,!0);return{codes:e,scales:n,nElems:t}}function le(g){let t=new Float32Array(g.nElems),r=g.nElems/ie;for(let e=0;e<r;e++){let n=te(g.scales[e]),a=e*ie;for(let s=0;s<ie;s++)t[a+s]=g.codes[a+s]*n}return t}var oe=32;function Re(g){let t=g.length;if(t%oe!==0)throw new Error(`q3web: length ${t} not a multiple of ${oe}`);let r=t/oe,e=new Uint32Array(t/16),n=new Uint32Array(t/32),a=new Uint16Array(r),s=new Uint16Array(r);for(let i=0;i<r;i++){let o=i*oe,u=1/0,c=-1/0;for(let m=0;m<oe;m++){let v=g[o+m];v<u&&(u=v),v>c&&(c=v)}let f=(c-u)/7||1e-8,l=he(f),h=he(u);a[i]=l,s[i]=h;let d=te(l)||1e-8,p=te(h);for(let m=0;m<oe;m++){let v=Math.round((g[o+m]-p)/d);v=v<0?0:v>7?7:v;let U=o+m;e[U>>4]|=(v&3)<<(U&15)*2,n[U>>5]|=v>>2<<(U&31)}}return{lo:e,hi:n,scales:a,mins:s,nElems:t}}function xe(g,t){let r=t/oe,e=t/16,n=t/32,a=e*4,s=n*4,i=new DataView(g.buffer,g.byteOffset),o=new Uint32Array(e),u=new Uint32Array(n),c=new Uint16Array(r),f=new Uint16Array(r);for(let d=0;d<e;d++)o[d]=i.getUint32(d*4,!0);for(let d=0;d<n;d++)u[d]=i.getUint32(a+d*4,!0);let l=a+s,h=l+r*2;for(let d=0;d<r;d++)c[d]=i.getUint16(l+d*2,!0);for(let d=0;d<r;d++)f[d]=i.getUint16(h+d*2,!0);return{lo:o,hi:u,scales:c,mins:f,nElems:t}}function qe(g){let t=new Float32Array(g.nElems),r=g.nElems/oe;for(let e=0;e<r;e++){let n=te(g.scales[e]),a=te(g.mins[e]),s=e*oe;for(let i=0;i<oe;i++){let o=s+i,u=g.lo[o>>4]>>(o&15)*2&3|(g.hi[o>>5]>>(o&31)&1)<<2;t[o]=u*n+a}}return t}var ze={matmul:`
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
		}`,matmul_t:`
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
		}`,matmul_t_vec4:`
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
				acc = acc + a[aBase + i] * w[wBase + i];   // 128-bit load \xD7 128-bit load, fused multiply-add
			}
			c[row * d.n + col] = acc.x + acc.y + acc.z + acc.w;
		}`,matmul_t_q4:`
		struct Dims { m: u32, k: u32, n: u32 };
		@group(0) @binding(0) var<uniform> d: Dims;
		@group(0) @binding(1) var<storage, read> a: array<vec4<f32>>;
		@group(0) @binding(2) var<storage, read> nib: array<u32>;
		@group(0) @binding(3) var<storage, read> sc: array<u32>;
		@group(0) @binding(4) var<storage, read> mn: array<u32>;
		@group(0) @binding(5) var<storage, read_write> c: array<f32>;
		fn f16d(h: u32) -> f32 {
			let s = (h >> 15u) & 1u; let e = (h >> 10u) & 0x1Fu; let m = h & 0x3FFu; var v: f32;
			if (e == 0u) { v = f32(m) * 5.9604645e-8; } else if (e == 31u) { v = 65504.0; }
			else { v = (1.0 + f32(m) / 1024.0) * pow(2.0, f32(e) - 15.0); }
			return select(v, -v, s == 1u);
		}
		@compute @workgroup_size(8, 8)
		fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
			let row = gid.x; let col = gid.y;
			if (row >= d.m || col >= d.n) { return; }
			let k = d.k; let nGroups = k / 32u;
			let aVecRow = row * (k / 4u);  // a is vec4: 4 floats per element
			let wordRow = col * (k / 8u);  // 8 nibbles per u32 word
			let gBase = col * nGroups;
			var acc = vec4<f32>(0.0);
			for (var g = 0u; g < nGroups; g = g + 1u) {
				let si = gBase + g;
				let sw = sc[si >> 1u]; let s = f16d(select(sw & 0xFFFFu, sw >> 16u, (si & 1u) == 1u));
				let mw = mn[si >> 1u]; let mvec = vec4<f32>(f16d(select(mw & 0xFFFFu, mw >> 16u, (si & 1u) == 1u)));
				let wb = wordRow + g * 4u;
				let avb = aVecRow + g * 8u;
				for (var w = 0u; w < 4u; w = w + 1u) {
					let word = nib[wb + w];
					let n0 = vec4<f32>(f32(word & 0xFu), f32((word >> 4u) & 0xFu), f32((word >> 8u) & 0xFu), f32((word >> 12u) & 0xFu));
					let n1 = vec4<f32>(f32((word >> 16u) & 0xFu), f32((word >> 20u) & 0xFu), f32((word >> 24u) & 0xFu), f32((word >> 28u) & 0xFu));
					acc = acc + a[avb + w * 2u] * (n0 * s + mvec) + a[avb + w * 2u + 1u] * (n1 * s + mvec);
				}
			}
			c[row * d.n + col] = acc.x + acc.y + acc.z + acc.w;
		}`,matmul_t_q4_tiled:`
		struct Dims { m: u32, k: u32, n: u32 };
		@group(0) @binding(0) var<uniform> d: Dims;
		@group(0) @binding(1) var<storage, read> a: array<vec4<f32>>;
		@group(0) @binding(2) var<storage, read> nib: array<u32>;
		@group(0) @binding(3) var<storage, read> sc: array<u32>;
		@group(0) @binding(4) var<storage, read> mn: array<u32>;
		@group(0) @binding(5) var<storage, read_write> c: array<f32>;
		fn f16d(h: u32) -> f32 {
			let s = (h >> 15u) & 1u; let e = (h >> 10u) & 0x1Fu; let m = h & 0x3FFu; var v: f32;
			if (e == 0u) { v = f32(m) * 5.9604645e-8; } else if (e == 31u) { v = 65504.0; }
			else { v = (1.0 + f32(m) / 1024.0) * pow(2.0, f32(e) - 15.0); }
			return select(v, -v, s == 1u);
		}
		@compute @workgroup_size(8, 8)
		fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
			let col = gid.y;
			if (col >= d.n) { return; }
			let row0 = gid.x * 4u;
			let k = d.k; let nGroups = k / 32u; let kv = k / 4u;
			let wordRow = col * (k / 8u);
			let gBase = col * nGroups;
			let m = d.m;
			let r0 = row0 < m; let r1 = row0 + 1u < m; let r2 = row0 + 2u < m; let r3 = row0 + 3u < m;
			let a0 = row0 * kv; let a1 = (row0 + 1u) * kv; let a2 = (row0 + 2u) * kv; let a3 = (row0 + 3u) * kv;
			var acc0 = vec4<f32>(0.0); var acc1 = vec4<f32>(0.0); var acc2 = vec4<f32>(0.0); var acc3 = vec4<f32>(0.0);
			for (var g = 0u; g < nGroups; g = g + 1u) {
				let si = gBase + g;
				let sw = sc[si >> 1u]; let s = f16d(select(sw & 0xFFFFu, sw >> 16u, (si & 1u) == 1u));
				let mw = mn[si >> 1u]; let mvec = vec4<f32>(f16d(select(mw & 0xFFFFu, mw >> 16u, (si & 1u) == 1u)));
				let wb = wordRow + g * 4u;
				let aoff = g * 8u;
				for (var w = 0u; w < 4u; w = w + 1u) {
					let word = nib[wb + w];
					let n0 = vec4<f32>(f32(word & 0xFu), f32((word >> 4u) & 0xFu), f32((word >> 8u) & 0xFu), f32((word >> 12u) & 0xFu));
					let n1 = vec4<f32>(f32((word >> 16u) & 0xFu), f32((word >> 20u) & 0xFu), f32((word >> 24u) & 0xFu), f32((word >> 28u) & 0xFu));
					let wv0 = n0 * s + mvec; let wv1 = n1 * s + mvec;
					let i0 = aoff + w * 2u; let i1 = i0 + 1u;
					if (r0) { acc0 = acc0 + a[a0 + i0] * wv0 + a[a0 + i1] * wv1; }
					if (r1) { acc1 = acc1 + a[a1 + i0] * wv0 + a[a1 + i1] * wv1; }
					if (r2) { acc2 = acc2 + a[a2 + i0] * wv0 + a[a2 + i1] * wv1; }
					if (r3) { acc3 = acc3 + a[a3 + i0] * wv0 + a[a3 + i1] * wv1; }
				}
			}
			if (r0) { c[row0 * d.n + col] = acc0.x + acc0.y + acc0.z + acc0.w; }
			if (r1) { c[(row0 + 1u) * d.n + col] = acc1.x + acc1.y + acc1.z + acc1.w; }
			if (r2) { c[(row0 + 2u) * d.n + col] = acc2.x + acc2.y + acc2.z + acc2.w; }
			if (r3) { c[(row0 + 3u) * d.n + col] = acc3.x + acc3.y + acc3.z + acc3.w; }
		}`,rwkv_token_shift:`
		struct Dims { d: u32 };
		@group(0) @binding(0) var<uniform> dm: Dims;
		@group(0) @binding(1) var<storage, read> ln: array<f32>;
		@group(0) @binding(2) var<storage, read> prev: array<f32>;
		@group(0) @binding(3) var<storage, read> lerp: array<f32>;
		@group(0) @binding(4) var<storage, read_write> out: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
			let idx = gid.x; let D = dm.d;
			if (idx >= D * 6u) { return; }
			let i = idx % D;
			out[idx] = ln[i] + (prev[i] - ln[i]) * lerp[idx];
		}`,rwkv_wkv7:`
		struct Dims { h: u32, n: u32 };
		@group(0) @binding(0) var<uniform> d: Dims;
		@group(0) @binding(1) var<storage, read> r: array<f32>;
		@group(0) @binding(2) var<storage, read> w: array<f32>;
		@group(0) @binding(3) var<storage, read> k: array<f32>;
		@group(0) @binding(4) var<storage, read> v: array<f32>;
		@group(0) @binding(5) var<storage, read> a: array<f32>;
		@group(0) @binding(6) var<storage, read> b: array<f32>;
		@group(0) @binding(7) var<storage, read_write> S: array<f32>;
		@group(0) @binding(8) var<storage, read_write> y: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
			let n = d.n;
			let idx = gid.x;              // (t\xEAte, i) aplati
			if (idx >= d.h * n) { return; }
			let head = idx / n;
			let i = idx % n;
			let hb = head * n;           // base des vecteurs de cette t\xEAte
			let rowBase = head * n * n + i * n; // base de la ligne i de l'\xE9tat de cette t\xEAte
			let vi = v[hb + i];
			var sa = 0.0;
			for (var j = 0u; j < n; j = j + 1u) { sa = sa + a[hb + j] * S[rowBase + j]; }
			var yi = 0.0;
			for (var j = 0u; j < n; j = j + 1u) {
				let s = w[hb + j] * S[rowBase + j] + vi * k[hb + j] + b[hb + j] * sa;
				S[rowBase + j] = s;
				yi = yi + r[hb + j] * s;
			}
			y[hb + i] = yi;
		}`,lfm2_shortconv:`
		struct Dims { d: u32, lc: u32 };
		@group(0) @binding(0) var<uniform> dm: Dims;
		@group(0) @binding(1) var<storage, read> bcx: array<f32>;
		@group(0) @binding(2) var<storage, read> w: array<f32>;
		@group(0) @binding(3) var<storage, read_write> state: array<f32>;
		@group(0) @binding(4) var<storage, read_write> outv: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
			let i = gid.x; let D = dm.d; let LC = dm.lc;
			if (i >= D) { return; }
			let bxn = bcx[i] * bcx[2u * D + i];
			var y = w[i * LC + (LC - 1u)] * bxn;
			for (var k = 0u; k + 1u < LC; k = k + 1u) {
				y = y + w[i * LC + k] * state[k * D + i];
			}
			for (var k = 0u; k + 2u < LC; k = k + 1u) {
				state[k * D + i] = state[(k + 1u) * D + i];
			}
			state[(LC - 2u) * D + i] = bxn;
			outv[i] = y * bcx[D + i];
		}`,matmul_t_q3:`
		struct Dims { m: u32, k: u32, n: u32 };
		@group(0) @binding(0) var<uniform> d: Dims;
		@group(0) @binding(1) var<storage, read> a: array<vec4<f32>>;
		@group(0) @binding(2) var<storage, read> lo: array<u32>;
		@group(0) @binding(3) var<storage, read> hi: array<u32>;
		@group(0) @binding(4) var<storage, read> sc: array<u32>;
		@group(0) @binding(5) var<storage, read> mn: array<u32>;
		@group(0) @binding(6) var<storage, read_write> c: array<f32>;
		fn f16d(h: u32) -> f32 {
			let s = (h >> 15u) & 1u; let e = (h >> 10u) & 0x1Fu; let m = h & 0x3FFu; var v: f32;
			if (e == 0u) { v = f32(m) * 5.9604645e-8; } else if (e == 31u) { v = 65504.0; }
			else { v = (1.0 + f32(m) / 1024.0) * pow(2.0, f32(e) - 15.0); }
			return select(v, -v, s == 1u);
		}
		@compute @workgroup_size(8, 8)
		fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
			let row = gid.x; let col = gid.y;
			if (row >= d.m || col >= d.n) { return; }
			let k = d.k; let nGroups = k / 32u;
			let aVecRow = row * (k / 4u);  // a is vec4: 4 floats per element
			let loRow = col * (k / 16u);   // 16 low-2bit codes per u32 word
			let hiRow = col * (k / 32u);   // 32 high-1bit codes per u32 word
			let gBase = col * nGroups;
			var acc = vec4<f32>(0.0);
			for (var g = 0u; g < nGroups; g = g + 1u) {
				let si = gBase + g;
				let sw = sc[si >> 1u]; let s = f16d(select(sw & 0xFFFFu, sw >> 16u, (si & 1u) == 1u));
				let mw = mn[si >> 1u]; let mvec = vec4<f32>(f16d(select(mw & 0xFFFFu, mw >> 16u, (si & 1u) == 1u)));
				let lo0 = lo[loRow + g * 2u];
				let lo1 = lo[loRow + g * 2u + 1u];
				let hiW = hi[hiRow + g];
				let avb = aVecRow + g * 8u;
				for (var w = 0u; w < 8u; w = w + 1u) {
					let loWord = select(lo0, lo1, w >= 4u);
					let baseBit = (w & 3u) * 8u;   // 4 codes start at bit 8*(w mod 4) within the 16-code word
					let j = w * 4u;
					let q0 = ((loWord >> baseBit) & 3u) | (((hiW >> j) & 1u) << 2u);
					let q1 = ((loWord >> (baseBit + 2u)) & 3u) | (((hiW >> (j + 1u)) & 1u) << 2u);
					let q2 = ((loWord >> (baseBit + 4u)) & 3u) | (((hiW >> (j + 2u)) & 1u) << 2u);
					let q3v = ((loWord >> (baseBit + 6u)) & 3u) | (((hiW >> (j + 3u)) & 1u) << 2u);
					let wv = vec4<f32>(f32(q0), f32(q1), f32(q2), f32(q3v)) * s + mvec;
					acc = acc + a[avb + w] * wv;
				}
			}
			c[row * d.n + col] = acc.x + acc.y + acc.z + acc.w;
		}`,matmul_t_q8:`
		struct Dims { m: u32, k: u32, n: u32 };
		@group(0) @binding(0) var<uniform> d: Dims;
		@group(0) @binding(1) var<storage, read> a: array<vec4<f32>>;
		@group(0) @binding(2) var<storage, read> codes: array<u32>;
		@group(0) @binding(3) var<storage, read> sc: array<u32>;
		@group(0) @binding(4) var<storage, read_write> c: array<f32>;
		fn f16d(h: u32) -> f32 {
			let s = (h >> 15u) & 1u; let e = (h >> 10u) & 0x1Fu; let m = h & 0x3FFu; var v: f32;
			if (e == 0u) { v = f32(m) * 5.9604645e-8; } else if (e == 31u) { v = 65504.0; }
			else { v = (1.0 + f32(m) / 1024.0) * pow(2.0, f32(e) - 15.0); }
			return select(v, -v, s == 1u);
		}
		// The 4 signed int8 packed in a u32 word as a vec4<f32>. Sign-extend each byte by shifting
		// it into the top 8 bits then arithmetic-right-shifting back (>> on i32 is arithmetic in
		// WGSL) \u2014 branchless, no per-byte compare.
		fn s8x4(word: u32) -> vec4<f32> {
			return vec4<f32>(
				f32(i32(word << 24u) >> 24u),
				f32(i32(word << 16u) >> 24u),
				f32(i32(word << 8u) >> 24u),
				f32(i32(word) >> 24u));
		}
		@compute @workgroup_size(8, 8)
		fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
			let row = gid.x; let col = gid.y;
			if (row >= d.m || col >= d.n) { return; }
			let k = d.k; let nGroups = k / 32u;
			let aVecRow = row * (k / 4u);  // a is vec4: 4 floats per element \u2192 k/4 per row
			let wordRow = col * (k / 4u);  // 4 int8 per u32 word \u2192 k/4 words per row
			let gBase = col * nGroups;
			var acc = vec4<f32>(0.0);
			for (var g = 0u; g < nGroups; g = g + 1u) {
				let si = gBase + g;
				let sw = sc[si >> 1u]; let s = f16d(select(sw & 0xFFFFu, sw >> 16u, (si & 1u) == 1u));
				let wb = wordRow + g * 8u;   // 32 weights = 8 words per group
				let avb = aVecRow + g * 8u;  // 32 floats   = 8 vec4 per group
				for (var w = 0u; w < 8u; w = w + 1u) {
					acc = acc + a[avb + w] * (s8x4(codes[wb + w]) * s);
				}
			}
			c[row * d.n + col] = acc.x + acc.y + acc.z + acc.w;
		}`,matmul_t_q8_tiled:`
		struct Dims { m: u32, k: u32, n: u32 };
		@group(0) @binding(0) var<uniform> d: Dims;
		@group(0) @binding(1) var<storage, read> a: array<vec4<f32>>;
		@group(0) @binding(2) var<storage, read> codes: array<u32>;
		@group(0) @binding(3) var<storage, read> sc: array<u32>;
		@group(0) @binding(4) var<storage, read_write> c: array<f32>;
		fn f16d(h: u32) -> f32 {
			let s = (h >> 15u) & 1u; let e = (h >> 10u) & 0x1Fu; let m = h & 0x3FFu; var v: f32;
			if (e == 0u) { v = f32(m) * 5.9604645e-8; } else if (e == 31u) { v = 65504.0; }
			else { v = (1.0 + f32(m) / 1024.0) * pow(2.0, f32(e) - 15.0); }
			return select(v, -v, s == 1u);
		}
		fn s8x4(word: u32) -> vec4<f32> {
			return vec4<f32>(
				f32(i32(word << 24u) >> 24u),
				f32(i32(word << 16u) >> 24u),
				f32(i32(word << 8u) >> 24u),
				f32(i32(word) >> 24u));
		}
		@compute @workgroup_size(8, 8)
		fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
			let col = gid.y;
			if (col >= d.n) { return; }
			let row0 = gid.x * 4u;
			let k = d.k; let nGroups = k / 32u; let kv = k / 4u;
			let wordRow = col * kv;
			let gBase = col * nGroups;
			let m = d.m;
			let r0 = row0 < m; let r1 = row0 + 1u < m; let r2 = row0 + 2u < m; let r3 = row0 + 3u < m;
			let a0 = row0 * kv; let a1 = (row0 + 1u) * kv; let a2 = (row0 + 2u) * kv; let a3 = (row0 + 3u) * kv;
			var acc0 = vec4<f32>(0.0); var acc1 = vec4<f32>(0.0); var acc2 = vec4<f32>(0.0); var acc3 = vec4<f32>(0.0);
			for (var g = 0u; g < nGroups; g = g + 1u) {
				let si = gBase + g;
				let sw = sc[si >> 1u]; let s = f16d(select(sw & 0xFFFFu, sw >> 16u, (si & 1u) == 1u));
				let wb = wordRow + g * 8u;
				let off = g * 8u;
				for (var w = 0u; w < 8u; w = w + 1u) {
					let wv = s8x4(codes[wb + w]) * s;
					if (r0) { acc0 = acc0 + a[a0 + off + w] * wv; }
					if (r1) { acc1 = acc1 + a[a1 + off + w] * wv; }
					if (r2) { acc2 = acc2 + a[a2 + off + w] * wv; }
					if (r3) { acc3 = acc3 + a[a3 + off + w] * wv; }
				}
			}
			if (r0) { c[row0 * d.n + col] = acc0.x + acc0.y + acc0.z + acc0.w; }
			if (r1) { c[(row0 + 1u) * d.n + col] = acc1.x + acc1.y + acc1.z + acc1.w; }
			if (r2) { c[(row0 + 2u) * d.n + col] = acc2.x + acc2.y + acc2.z + acc2.w; }
			if (r3) { c[(row0 + 3u) * d.n + col] = acc3.x + acc3.y + acc3.z + acc3.w; }
		}`,matmul_t_q8_shared:`
		struct Dims { m: u32, k: u32, n: u32 };
		@group(0) @binding(0) var<uniform> d: Dims;
		@group(0) @binding(1) var<storage, read> a: array<f32>;
		@group(0) @binding(2) var<storage, read> codes: array<u32>;
		@group(0) @binding(3) var<storage, read> sc: array<u32>;
		@group(0) @binding(4) var<storage, read_write> c: array<f32>;
		var<workgroup> As: array<f32, 256>;
		var<workgroup> Ws: array<f32, 256>;
		fn f16d(h: u32) -> f32 {
			let s = (h >> 15u) & 1u; let e = (h >> 10u) & 0x1Fu; let mm = h & 0x3FFu; var v: f32;
			if (e == 0u) { v = f32(mm) * 5.9604645e-8; } else if (e == 31u) { v = 65504.0; }
			else { v = (1.0 + f32(mm) / 1024.0) * pow(2.0, f32(e) - 15.0); }
			return select(v, -v, s == 1u);
		}
		@compute @workgroup_size(16, 16)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let ty = lid.y; let tx = lid.x;
			let row = wid.y * 16u + ty;
			let col = wid.x * 16u + tx;
			let k = d.k; let m = d.m; let n = d.n;
			var acc = 0.0;
			let nTiles = (k + 15u) / 16u;
			for (var t = 0u; t < nTiles; t = t + 1u) {
				let kk = t * 16u;
				let aCol = kk + tx;
				As[ty * 16u + tx] = select(0.0, a[row * k + aCol], row < m && aCol < k);
				let wK = kk + ty;
				var wv = 0.0;
				if (col < n && wK < k) {
					let codeWord = codes[col * (k / 4u) + (wK / 4u)];
					let code = f32(i32(codeWord << ((3u - (wK & 3u)) * 8u)) >> 24u);
					let si = col * (k / 32u) + (wK / 32u);
					let sw = sc[si >> 1u];
					let s = f16d(select(sw & 0xFFFFu, sw >> 16u, (si & 1u) == 1u));
					wv = code * s;
				}
				Ws[tx * 16u + ty] = wv;
				workgroupBarrier();
				for (var i = 0u; i < 16u; i = i + 1u) {
					acc = acc + As[ty * 16u + i] * Ws[tx * 16u + i];
				}
				workgroupBarrier();
			}
			if (row < m && col < n) { c[row * n + col] = acc; }
		}`,matmul_t_q4_shared:`
		struct Dims { m: u32, k: u32, n: u32 };
		@group(0) @binding(0) var<uniform> d: Dims;
		@group(0) @binding(1) var<storage, read> a: array<f32>;
		@group(0) @binding(2) var<storage, read> nib: array<u32>;
		@group(0) @binding(3) var<storage, read> sc: array<u32>;
		@group(0) @binding(4) var<storage, read> mn: array<u32>;
		@group(0) @binding(5) var<storage, read_write> c: array<f32>;
		var<workgroup> As: array<f32, 256>;
		var<workgroup> Ws: array<f32, 256>;
		fn f16d(h: u32) -> f32 {
			let s = (h >> 15u) & 1u; let e = (h >> 10u) & 0x1Fu; let mm = h & 0x3FFu; var v: f32;
			if (e == 0u) { v = f32(mm) * 5.9604645e-8; } else if (e == 31u) { v = 65504.0; }
			else { v = (1.0 + f32(mm) / 1024.0) * pow(2.0, f32(e) - 15.0); }
			return select(v, -v, s == 1u);
		}
		@compute @workgroup_size(16, 16)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let ty = lid.y; let tx = lid.x;
			let row = wid.y * 16u + ty;
			let col = wid.x * 16u + tx;
			let k = d.k; let m = d.m; let n = d.n;
			var acc = 0.0;
			let nTiles = (k + 15u) / 16u;
			for (var t = 0u; t < nTiles; t = t + 1u) {
				let kk = t * 16u;
				let aCol = kk + tx;
				As[ty * 16u + tx] = select(0.0, a[row * k + aCol], row < m && aCol < k);
				let wK = kk + ty;
				var wv = 0.0;
				if (col < n && wK < k) {
					let nibWord = nib[col * (k / 8u) + (wK / 8u)];
					let nib4 = (nibWord >> ((wK & 7u) * 4u)) & 0xFu;
					let si = col * (k / 32u) + (wK / 32u);
					let sw = sc[si >> 1u]; let s = f16d(select(sw & 0xFFFFu, sw >> 16u, (si & 1u) == 1u));
					let mw = mn[si >> 1u]; let mnv = f16d(select(mw & 0xFFFFu, mw >> 16u, (si & 1u) == 1u));
					wv = f32(nib4) * s + mnv;
				}
				Ws[tx * 16u + ty] = wv;
				workgroupBarrier();
				for (var i = 0u; i < 16u; i = i + 1u) {
					acc = acc + As[ty * 16u + i] * Ws[tx * 16u + i];
				}
				workgroupBarrier();
			}
			if (row < m && col < n) { c[row * n + col] = acc; }
		}`,rmsnorm:`
		struct P { rows: u32, dim: u32, eps: f32, onePlus: u32 };
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
				// Gemma scales by (1 + w) instead of w; onePlus selects the convention.
				let g = select(w[i], 1.0 + w[i], p.onePlus == 1u);
				o[r * p.dim + i] = x[r * p.dim + i] * inv * g;
			}
		}`,swiglu:`
		@group(0) @binding(0) var<storage, read> a: array<f32>;
		@group(0) @binding(1) var<storage, read> b: array<f32>;
		@group(0) @binding(2) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let i = (wid.y * nwg.x + wid.x) * 64u + lid.x;  // 2-D workgroup grid \u2192 flat index (no dim > 65535)
			if (i >= arrayLength(&o)) { return; }
			let v = a[i];
			o[i] = (v / (1.0 + exp(-v))) * b[i];
		}`,geglu:`
		@group(0) @binding(0) var<storage, read> a: array<f32>;
		@group(0) @binding(1) var<storage, read> b: array<f32>;
		@group(0) @binding(2) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let i = (wid.y * nwg.x + wid.x) * 64u + lid.x;  // 2-D workgroup grid \u2192 flat index (no dim > 65535)
			if (i >= arrayLength(&o)) { return; }
			let v = a[i];
			// tanh-approx GELU: 0.5\xB7v\xB7(1 + tanh(\u221A(2/\u03C0)\xB7(v + 0.044715\xB7v\xB3)))
			// Clamp l'argument du tanh : pour v\u224810 l'argument atteint ~45, et les drivers qui calculent
			// tanh via (exp(2x)\u22121)/(exp(2x)+1) d\xE9bordent f32 (exp(90)>3.4e38 \u2192 inf/inf = NaN). tanh est
			// satur\xE9 (tanh(20)=1.0 en f32) donc clamper \xE0 \xB120 est exact et tue le NaN (bug Gemma geglu).
			let arg = clamp(0.7978845608 * (v + 0.044715 * v * v * v), -20.0, 20.0);
			let gelu = 0.5 * v * (1.0 + tanh(arg));
			o[i] = gelu * b[i];
		}`,add:`
		@group(0) @binding(0) var<storage, read> a: array<f32>;
		@group(0) @binding(1) var<storage, read> b: array<f32>;
		@group(0) @binding(2) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let i = (wid.y * nwg.x + wid.x) * 64u + lid.x;  // 2-D workgroup grid \u2192 flat index (no dim > 65535)
			if (i >= arrayLength(&o)) { return; }
			o[i] = a[i] + b[i];
		}`,silu:`
		@group(0) @binding(0) var<storage, read> x: array<f32>;
		@group(0) @binding(1) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let i = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (i >= arrayLength(&o)) { return; }
			let v = x[i];
			o[i] = v / (1.0 + exp(-v));
		}`,group_norm:`
		struct P { C: u32, HW: u32, G: u32, eps: f32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> x: array<f32>;
		@group(0) @binding(2) var<storage, read> gamma: array<f32>;
		@group(0) @binding(3) var<storage, read> beta: array<f32>;
		@group(0) @binding(4) var<storage, read_write> o: array<f32>;
		var<workgroup> ssum: array<f32, 256>;
		var<workgroup> ssq: array<f32, 256>;
		@compute @workgroup_size(256)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let g = wid.x;
			if (g >= p.G) { return; }            // uniform across the workgroup \u2192 no barrier in divergence
			let cpg = p.C / p.G;                  // channels per group
			let n = cpg * p.HW;                   // elements in this group
			let base = g * cpg * p.HW;
			var s = 0.0; var sq = 0.0;
			var i = lid.x;
			loop {
				if (i >= n) { break; }
				let v = x[base + i];
				s = s + v; sq = sq + v * v;
				i = i + 256u;
			}
			ssum[lid.x] = s; ssq[lid.x] = sq;
			workgroupBarrier();
			var stride = 128u;
			loop {
				if (stride == 0u) { break; }
				if (lid.x < stride) { ssum[lid.x] = ssum[lid.x] + ssum[lid.x + stride]; ssq[lid.x] = ssq[lid.x] + ssq[lid.x + stride]; }
				workgroupBarrier();
				stride = stride / 2u;
			}
			let mean = ssum[0] / f32(n);
			let varr = ssq[0] / f32(n) - mean * mean;
			let inv = 1.0 / sqrt(varr + p.eps);
			var j = lid.x;
			loop {
				if (j >= n) { break; }
				let ch = g * cpg + j / p.HW;
				o[base + j] = (x[base + j] - mean) * inv * gamma[ch] + beta[ch];
				j = j + 256u;
			}
		}`,im2col:`
		struct P { Cin: u32, H: u32, W: u32, kh: u32, kw: u32, stride: u32, pad: u32, OH: u32, OW: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> inp: array<f32>;
		@group(0) @binding(2) var<storage, read_write> col: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let idx = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			let np = p.OH * p.OW;                 // number of output pixels
			let K = p.Cin * p.kh * p.kw;          // patch length
			if (idx >= K * np) { return; }
			let krow = idx / np;                  // which (cin, ky, kx)
			let pix = idx % np;                   // which output pixel
			let kx = krow % p.kw;
			let ky = (krow / p.kw) % p.kh;
			let cin = krow / (p.kw * p.kh);
			let ox = pix % p.OW;
			let oy = pix / p.OW;
			let iy = i32(oy * p.stride + ky) - i32(p.pad);
			let ix = i32(ox * p.stride + kx) - i32(p.pad);
			var v = 0.0;
			if (iy >= 0 && iy < i32(p.H) && ix >= 0 && ix < i32(p.W)) {
				v = inp[cin * p.H * p.W + u32(iy) * p.W + u32(ix)];
			}
			col[idx] = v;
		}`,relu:`
		@group(0) @binding(0) var<storage, read> x: array<f32>;
		@group(0) @binding(1) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let i = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (i >= arrayLength(&o)) { return; }
			o[i] = max(x[i], 0.0);
		}`,add_channel_bias:`
		struct P { C: u32, HW: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> x: array<f32>;
		@group(0) @binding(2) var<storage, read> bias: array<f32>;
		@group(0) @binding(3) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let i = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (i >= p.C * p.HW) { return; }
			o[i] = x[i] + bias[i / p.HW];
		}`,transpose2d:`
		struct P { rows: u32, cols: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> x: array<f32>;
		@group(0) @binding(2) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let idx = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (idx >= p.rows * p.cols) { return; }
			let row = idx / p.cols;
			let col = idx % p.cols;
			o[col * p.rows + row] = x[idx];
		}`,geglu_split:`
		struct P { rows: u32, F: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> proj: array<f32>;
		@group(0) @binding(2) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let idx = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (idx >= p.rows * p.F) { return; }
			let row = idx / p.F;
			let i = idx % p.F;
			let base = row * 2u * p.F;
			let hid = proj[base + i];
			let g = proj[base + p.F + i];
			let arg = clamp(0.7978845608 * (g + 0.044715 * g * g * g), -20.0, 20.0);
			o[idx] = hid * (0.5 * g * (1.0 + tanh(arg)));
		}`,video_motion_gather:`
		struct P { F: u32, C: u32, S: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> inp: array<f32>;
		@group(0) @binding(2) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let idx = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (idx >= p.S * p.F * p.C) { return; }
			let c = idx % p.C;
			let r = idx / p.C;          // s\xB7F + f
			let f = r % p.F;
			let s = r / p.F;
			o[idx] = inp[f * p.C * p.S + c * p.S + s];
		}`,video_motion_scatter:`
		struct P { F: u32, C: u32, S: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> h: array<f32>;
		@group(0) @binding(2) var<storage, read> res: array<f32>;
		@group(0) @binding(3) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let idx = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (idx >= p.F * p.C * p.S) { return; }
			let s = idx % p.S;
			let t = idx / p.S;
			let c = t % p.C;
			let f = t / p.C;
			o[idx] = h[(s * p.F + f) * p.C + c] + res[idx];
		}`,video_add_pe:`
		struct P { F: u32, C: u32, S: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> x: array<f32>;
		@group(0) @binding(2) var<storage, read> pe: array<f32>;
		@group(0) @binding(3) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let idx = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (idx >= p.S * p.F * p.C) { return; }
			let c = idx % p.C;
			let f = (idx / p.C) % p.F;
			o[idx] = x[idx] + pe[f * p.C + c];
		}`,attn_temporal:`
		struct P { S: u32, F: u32, heads: u32, hd: u32, scale: f32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> q: array<f32>;
		@group(0) @binding(2) var<storage, read> k: array<f32>;
		@group(0) @binding(3) var<storage, read> v: array<f32>;
		@group(0) @binding(4) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let unit = (wid.y * nwg.x + wid.x) * 64u + lid.x; // (ligne\xB7heads + t\xEAte)
			if (unit >= p.S * p.F * p.heads) { return; }
			let h = unit % p.heads;
			let r = unit / p.heads;      // s\xB7F + ti
			let s = r / p.F;
			let C = p.heads * p.hd;
			let blockBase = s * p.F;     // 1re ligne du bloc s
			let qBase = r * C + h * p.hd;
			var m = -3.0e38;
			for (var tj = 0u; tj < p.F; tj = tj + 1u) {
				let kB = (blockBase + tj) * C + h * p.hd;
				var dot = 0.0;
				for (var d = 0u; d < p.hd; d = d + 1u) { dot = dot + q[qBase + d] * k[kB + d]; }
				m = max(m, dot * p.scale);
			}
			for (var d = 0u; d < p.hd; d = d + 1u) { o[qBase + d] = 0.0; }
			var denom = 0.0;
			for (var tj = 0u; tj < p.F; tj = tj + 1u) {
				let kB = (blockBase + tj) * C + h * p.hd;
				var dot = 0.0;
				for (var d = 0u; d < p.hd; d = d + 1u) { dot = dot + q[qBase + d] * k[kB + d]; }
				let w = exp(dot * p.scale - m);
				denom = denom + w;
				let vB = (blockBase + tj) * C + h * p.hd;
				for (var d = 0u; d < p.hd; d = d + 1u) { o[qBase + d] = o[qBase + d] + w * v[vB + d]; }
			}
			let inv = 1.0 / denom;
			for (var d = 0u; d < p.hd; d = d + 1u) { o[qBase + d] = o[qBase + d] * inv; }
		}`,upsample_nearest:`
		struct P { C: u32, H: u32, W: u32, scale: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> inp: array<f32>;
		@group(0) @binding(2) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let idx = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			let OW = p.W * p.scale;
			let OH = p.H * p.scale;
			if (idx >= p.C * OH * OW) { return; }
			let ox = idx % OW;
			let oy = (idx / OW) % OH;
			let c = idx / (OW * OH);
			let iy = oy / p.scale;
			let ix = ox / p.scale;
			o[idx] = inp[c * p.H * p.W + iy * p.W + ix];
		}`,f16_to_f32:`
		struct P { n: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> src: array<u32>;
		@group(0) @binding(2) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let i = (wid.y * nwg.x + wid.x) * 64u + lid.x; // one u32 word = 2 halves
			let base = i * 2u;
			if (base >= p.n) { return; }
			let v = unpack2x16float(src[i]);
			o[base] = v.x;
			if (base + 1u < p.n) { o[base + 1u] = v.y; }
		}`,softcap_logits:`
		struct P { n: u32, cap: f32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read_write> logits: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let i = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (i >= p.n) { return; }
			logits[i] = p.cap * tanh(logits[i] / p.cap);
		}`,penalize_logits:`
		struct P { n: u32, penalty: f32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> recent: array<u32>;
		@group(0) @binding(2) var<storage, read_write> logits: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
			let i = gid.x;
			if (i >= p.n) { return; }
			let id = recent[i];
			let v = logits[id];
			logits[id] = select(v * p.penalty, v / p.penalty, v > 0.0);
		}`,top_k:`
		struct P { n: u32, k: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> logits: array<f32>;
		@group(0) @binding(2) var<storage, read_write> outv: array<u32>;
		var<workgroup> candV: array<f32, 1024>;
		var<workgroup> candI: array<u32, 1024>;
		@compute @workgroup_size(128)
		fn main(@builtin(local_invocation_id) lid: vec3<u32>) {
			let t = lid.x;
			var vs: array<f32, 8>;
			var ix: array<u32, 8>;
			for (var j = 0u; j < 8u; j = j + 1u) { vs[j] = -3.4e38; ix[j] = 0u; }
			var minPos = 0u;
			for (var i = t; i < p.n; i = i + 128u) {
				let v = logits[i];
				if (v > vs[minPos]) {
					vs[minPos] = v; ix[minPos] = i;
					minPos = 0u;
					for (var j = 1u; j < 8u; j = j + 1u) { if (vs[j] < vs[minPos]) { minPos = j; } }
				}
			}
			for (var j = 0u; j < 8u; j = j + 1u) { candV[t * 8u + j] = vs[j]; candI[t * 8u + j] = ix[j]; }
			workgroupBarrier();
			if (t == 0u) {
				for (var r = 0u; r < p.k; r = r + 1u) {
					var best = 0u; var bv = -3.4e38;
					for (var c = 0u; c < 1024u; c = c + 1u) { if (candV[c] > bv) { bv = candV[c]; best = c; } }
					outv[r] = candI[best];
					outv[p.k + r] = bitcast<u32>(bv);
					candV[best] = -3.4e38;
				}
			}
		}`,conv2d_direct_q8:`
		struct P { Cin: u32, H: u32, W: u32, Cout: u32, kh: u32, kw: u32, stride: u32, pad: u32, OH: u32, OW: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> inp: array<f32>;
		@group(0) @binding(2) var<storage, read> codes: array<u32>;
		@group(0) @binding(3) var<storage, read> sc: array<u32>;
		@group(0) @binding(4) var<storage, read> bias: array<f32>;
		@group(0) @binding(5) var<storage, read_write> o: array<f32>;
		fn f16d(h: u32) -> f32 {
			let s = (h >> 15u) & 1u; let e = (h >> 10u) & 0x1Fu; let m = h & 0x3FFu; var v: f32;
			if (e == 0u) { v = f32(m) * 5.9604645e-8; } else if (e == 31u) { v = 65504.0; }
			else { v = (1.0 + f32(m) / 1024.0) * pow(2.0, f32(e) - 15.0); }
			return select(v, -v, s == 1u);
		}
		// weight[i] = signed byte i of codes (4 per u32 word) \xD7 its 32-group's f16 scale.
		fn wq8(i: u32) -> f32 {
			let q = f32(i32(codes[i >> 2u] << ((3u - (i & 3u)) * 8u)) >> 24u);
			let si = i >> 5u;
			let sw = sc[si >> 1u];
			return q * f16d(select(sw & 0xFFFFu, sw >> 16u, (si & 1u) == 1u));
		}
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let idx = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			let np = p.OH * p.OW;
			if (idx >= p.Cout * np) { return; }
			let ox = idx % p.OW;
			let oy = (idx / p.OW) % p.OH;
			let co = idx / np;
			var acc = bias[co];
			for (var ci = 0u; ci < p.Cin; ci = ci + 1u) {
				let inBase = ci * p.H * p.W;
				let wBase = (co * p.Cin + ci) * p.kh * p.kw;
				for (var ky = 0u; ky < p.kh; ky = ky + 1u) {
					let iy = i32(oy * p.stride + ky) - i32(p.pad);
					if (iy < 0 || iy >= i32(p.H)) { continue; }
					for (var kx = 0u; kx < p.kw; kx = kx + 1u) {
						let ix = i32(ox * p.stride + kx) - i32(p.pad);
						if (ix < 0 || ix >= i32(p.W)) { continue; }
						acc = acc + inp[inBase + u32(iy) * p.W + u32(ix)] * wq8(wBase + ky * p.kw + kx);
					}
				}
			}
			o[idx] = acc;
		}`,conv2d_direct_q4:`
		struct P { Cin: u32, H: u32, W: u32, Cout: u32, kh: u32, kw: u32, stride: u32, pad: u32, OH: u32, OW: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> inp: array<f32>;
		@group(0) @binding(2) var<storage, read> nib: array<u32>;
		@group(0) @binding(3) var<storage, read> sc: array<u32>;
		@group(0) @binding(4) var<storage, read> mn: array<u32>;
		@group(0) @binding(5) var<storage, read> bias: array<f32>;
		@group(0) @binding(6) var<storage, read_write> o: array<f32>;
		fn f16d(h: u32) -> f32 {
			let s = (h >> 15u) & 1u; let e = (h >> 10u) & 0x1Fu; let m = h & 0x3FFu; var v: f32;
			if (e == 0u) { v = f32(m) * 5.9604645e-8; } else if (e == 31u) { v = 65504.0; }
			else { v = (1.0 + f32(m) / 1024.0) * pow(2.0, f32(e) - 15.0); }
			return select(v, -v, s == 1u);
		}
		fn wq4(i: u32) -> f32 {
			let q = f32((nib[i >> 3u] >> ((i & 7u) * 4u)) & 0xFu);
			let si = i >> 5u;
			let half = (si & 1u) == 1u;
			let s = f16d(select(sc[si >> 1u] & 0xFFFFu, sc[si >> 1u] >> 16u, half));
			let m = f16d(select(mn[si >> 1u] & 0xFFFFu, mn[si >> 1u] >> 16u, half));
			return q * s + m;
		}
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let idx = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			let np = p.OH * p.OW;
			if (idx >= p.Cout * np) { return; }
			let ox = idx % p.OW;
			let oy = (idx / p.OW) % p.OH;
			let co = idx / np;
			var acc = bias[co];
			for (var ci = 0u; ci < p.Cin; ci = ci + 1u) {
				let inBase = ci * p.H * p.W;
				let wBase = (co * p.Cin + ci) * p.kh * p.kw;
				for (var ky = 0u; ky < p.kh; ky = ky + 1u) {
					let iy = i32(oy * p.stride + ky) - i32(p.pad);
					if (iy < 0 || iy >= i32(p.H)) { continue; }
					for (var kx = 0u; kx < p.kw; kx = kx + 1u) {
						let ix = i32(ox * p.stride + kx) - i32(p.pad);
						if (ix < 0 || ix >= i32(p.W)) { continue; }
						acc = acc + inp[inBase + u32(iy) * p.W + u32(ix)] * wq4(wBase + ky * p.kw + kx);
					}
				}
			}
			o[idx] = acc;
		}`,conv2d_3x3_tiled:`
		struct P { Cin: u32, H: u32, W: u32, Cout: u32, kh: u32, kw: u32, stride: u32, pad: u32, OH: u32, OW: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> inp: array<f32>;
		@group(0) @binding(2) var<storage, read> wt: array<f32>;
		@group(0) @binding(3) var<storage, read> bias: array<f32>;
		@group(0) @binding(4) var<storage, read_write> o: array<f32>;
		var<workgroup> tile: array<f32, 324>; // 18\xD718 input patch (16 out + 1px halo each side)
		var<workgroup> wloc: array<f32, 9>;   // the 3\xD73 weights of (co, ci)
		@compute @workgroup_size(16, 16)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let co = wid.z;
			let oy0 = wid.y * 16u;
			let ox0 = wid.x * 16u;
			let oy = oy0 + lid.y;
			let ox = ox0 + lid.x;
			let inBounds = oy < p.OH && ox < p.OW;
			let tid = lid.y * 16u + lid.x;
			var acc = 0.0;
			for (var ci = 0u; ci < p.Cin; ci = ci + 1u) {
				let base = ci * p.H * p.W;
				// Cooperative patch load (324 cells over 256 threads \u2192 \u22642 each). Guarded branch, not
				// select(): select evaluates both sides and an OOB index would read garbage.
				for (var t = tid; t < 324u; t = t + 256u) {
					let iy = i32(oy0 + t / 18u) - 1;
					let ix = i32(ox0 + t % 18u) - 1;
					var v = 0.0;
					if (iy >= 0 && iy < i32(p.H) && ix >= 0 && ix < i32(p.W)) { v = inp[base + u32(iy) * p.W + u32(ix)]; }
					tile[t] = v;
				}
				if (tid < 9u) { wloc[tid] = wt[(co * p.Cin + ci) * 9u + tid]; }
				workgroupBarrier();
				if (inBounds) {
					let r0 = lid.y * 18u + lid.x;        // top-left of this output's 3\xD73 window in the patch
					acc = acc
						+ tile[r0]           * wloc[0u] + tile[r0 + 1u]        * wloc[1u] + tile[r0 + 2u]        * wloc[2u]
						+ tile[r0 + 18u]     * wloc[3u] + tile[r0 + 19u]       * wloc[4u] + tile[r0 + 20u]       * wloc[5u]
						+ tile[r0 + 36u]     * wloc[6u] + tile[r0 + 37u]       * wloc[7u] + tile[r0 + 38u]       * wloc[8u];
				}
				workgroupBarrier(); // the next ci overwrites the patch
			}
			if (inBounds) { o[(co * p.OH + oy) * p.OW + ox] = acc + bias[co]; }
		}`,conv2d_direct:`
		struct P { Cin: u32, H: u32, W: u32, Cout: u32, kh: u32, kw: u32, stride: u32, pad: u32, OH: u32, OW: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> inp: array<f32>;
		@group(0) @binding(2) var<storage, read> wt: array<f32>;
		@group(0) @binding(3) var<storage, read> bias: array<f32>;
		@group(0) @binding(4) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let idx = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			let np = p.OH * p.OW;
			if (idx >= p.Cout * np) { return; }
			let ox = idx % p.OW;
			let oy = (idx / p.OW) % p.OH;
			let co = idx / np;
			var acc = bias[co];
			for (var ci = 0u; ci < p.Cin; ci = ci + 1u) {
				let inBase = ci * p.H * p.W;
				let wBase = (co * p.Cin + ci) * p.kh * p.kw;
				for (var ky = 0u; ky < p.kh; ky = ky + 1u) {
					let iy = i32(oy * p.stride + ky) - i32(p.pad);
					if (iy < 0 || iy >= i32(p.H)) { continue; }
					for (var kx = 0u; kx < p.kw; kx = kx + 1u) {
						let ix = i32(ox * p.stride + kx) - i32(p.pad);
						if (ix < 0 || ix >= i32(p.W)) { continue; }
						acc = acc + inp[inBase + u32(iy) * p.W + u32(ix)] * wt[wBase + ky * p.kw + kx];
					}
				}
			}
			o[idx] = acc;
		}`,layernorm:`
		struct P { rows: u32, dim: u32, eps: f32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> x: array<f32>;
		@group(0) @binding(2) var<storage, read> gamma: array<f32>;
		@group(0) @binding(3) var<storage, read> beta: array<f32>;
		@group(0) @binding(4) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
			let r = gid.x;
			if (r >= p.rows) { return; }
			let base = r * p.dim;
			var mean = 0.0;
			for (var i = 0u; i < p.dim; i = i + 1u) { mean = mean + x[base + i]; }
			mean = mean / f32(p.dim);
			var v = 0.0;
			for (var i = 0u; i < p.dim; i = i + 1u) { let d = x[base + i] - mean; v = v + d * d; }
			let inv = 1.0 / sqrt(v / f32(p.dim) + p.eps);
			for (var i = 0u; i < p.dim; i = i + 1u) {
				o[base + i] = (x[base + i] - mean) * inv * gamma[i] + beta[i];
			}
		}`,quick_gelu:`
		@group(0) @binding(0) var<storage, read> x: array<f32>;
		@group(0) @binding(1) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let i = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (i >= arrayLength(&o)) { return; }
			let v = x[i];
			o[i] = v / (1.0 + exp(-1.702 * v));
		}`,gelu:`
		@group(0) @binding(0) var<storage, read> x: array<f32>;
		@group(0) @binding(1) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let i = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (i >= arrayLength(&o)) { return; }
			let v = x[i];
			let arg = clamp(0.7978845608 * (v + 0.044715 * v * v * v), -20.0, 20.0);
			o[i] = 0.5 * v * (1.0 + tanh(arg));
		}`,packf16:`
		struct P { nPairs: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> src: array<f32>;
		@group(0) @binding(2) var<storage, read_write> dst: array<u32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let i = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (i >= p.nPairs) { return; }
			dst[i] = pack2x16float(vec2<f32>(src[i * 2u], src[i * 2u + 1u]));
		}`,quantize_q8:`
		struct QP { nGroups: u32 };
		@group(0) @binding(0) var<uniform> p: QP;
		@group(0) @binding(1) var<storage, read> src: array<f32>;
		@group(0) @binding(2) var<storage, read_write> codes: array<u32>;
		@group(0) @binding(3) var<storage, read_write> scales: array<atomic<u32>>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let g = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (g >= p.nGroups) { return; }
			let base = g * 32u;
			var amax = 0.0;
			for (var d = 0u; d < 32u; d = d + 1u) { amax = max(amax, abs(src[base + d])); }
			let scale = select(amax / 127.0, 1e-8, amax == 0.0);
			// low 16 bits of pack2x16float(scale,0) = the f16 bits of scale.
			let bits = pack2x16float(vec2<f32>(scale, 0.0)) & 0xFFFFu;
			atomicOr(&scales[g >> 1u], bits << ((g & 1u) * 16u));
			// Quantize against the f16-DECODED scale (what the matmul dequantizes with + what the CPU
			// codec uses) \u2014 not the raw f32 scale, else quantize and dequant disagree.
			var sD = unpack2x16float(bits).x; sD = select(sD, 1e-8, sD == 0.0);
			let inv = 1.0 / sD;
			let wb = g * 8u;
			for (var w = 0u; w < 8u; w = w + 1u) {
				var word = 0u;
				for (var b = 0u; b < 4u; b = b + 1u) {
					var q = i32(round(src[base + w * 4u + b] * inv));
					q = clamp(q, -127, 127);
					word = word | ((u32(q) & 0xFFu) << (b * 8u));
				}
				codes[wb + w] = word;
			}
		}`,quantize_q4:`
		struct QP { nGroups: u32 };
		@group(0) @binding(0) var<uniform> p: QP;
		@group(0) @binding(1) var<storage, read> src: array<f32>;
		@group(0) @binding(2) var<storage, read_write> nibbles: array<u32>;
		@group(0) @binding(3) var<storage, read_write> scales: array<atomic<u32>>;
		@group(0) @binding(4) var<storage, read_write> mins: array<atomic<u32>>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let g = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (g >= p.nGroups) { return; }
			let base = g * 32u;
			var mn = src[base]; var mx = src[base];
			for (var d = 1u; d < 32u; d = d + 1u) { let v = src[base + d]; mn = min(mn, v); mx = max(mx, v); }
			let scale = select((mx - mn) / 15.0, 1e-8, mx == mn);
			let sBits = pack2x16float(vec2<f32>(scale, 0.0)) & 0xFFFFu;
			let mBits = pack2x16float(vec2<f32>(mn, 0.0)) & 0xFFFFu;
			atomicOr(&scales[g >> 1u], sBits << ((g & 1u) * 16u));
			atomicOr(&mins[g >> 1u], mBits << ((g & 1u) * 16u));
			var sD = unpack2x16float(sBits).x; sD = select(sD, 1e-8, sD == 0.0);
			let mD = unpack2x16float(mBits).x;
			let inv = 1.0 / sD;
			let wb = g * 4u;
			for (var w = 0u; w < 4u; w = w + 1u) {
				var word = 0u;
				for (var h = 0u; h < 4u; h = h + 1u) {
					let ci = (w * 4u + h) * 2u; // group-local even code index
					var q0 = i32(round((src[base + ci] - mD) * inv)); q0 = clamp(q0, 0, 15);
					var q1 = i32(round((src[base + ci + 1u] - mD) * inv)); q1 = clamp(q1, 0, 15);
					word = word | ((u32(q0) | (u32(q1) << 4u)) << (h * 8u));
				}
				nibbles[wb + w] = word;
			}
		}`,rope:`
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
		}`,rope_factors:`
		struct RP { rows: u32, headDim: u32, nHeads: u32, pastLen: u32, base: f32 };
		@group(0) @binding(0) var<uniform> p: RP;
		@group(0) @binding(1) var<storage, read> x: array<f32>;
		@group(0) @binding(2) var<storage, read> ff: array<f32>;
		@group(0) @binding(3) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
			let r = gid.x;
			if (r >= p.rows) { return; }
			let half = p.headDim / 2u;
			let pos = f32(p.pastLen + r / p.nHeads);
			let base = r * p.headDim;
			for (var i = 0u; i < half; i = i + 1u) {
				let freq = pos / (pow(p.base, (2.0 * f32(i)) / f32(p.headDim)) * ff[i]);
				let c = cos(freq); let s = sin(freq);
				let x0 = x[base + i];
				let x1 = x[base + i + half];
				o[base + i]        = x0 * c - x1 * s;
				o[base + i + half] = x1 * c + x0 * s;
			}
		}`,rope_mrope:`
		struct RP { rows: u32, headDim: u32, nHeads: u32, c0: u32, c1: u32, base: f32 };
		@group(0) @binding(0) var<uniform> p: RP;
		@group(0) @binding(1) var<storage, read> x: array<f32>;
		@group(0) @binding(2) var<storage, read> pos: array<u32>;
		@group(0) @binding(3) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
			let r = gid.x;
			if (r >= p.rows) { return; }
			let half = p.headDim / 2u;
			let tok = r / p.nHeads;
			let base = r * p.headDim;
			for (var i = 0u; i < half; i = i + 1u) {
				let axis = select(select(2u, 1u, i < p.c1), 0u, i < p.c0);
				let posI = f32(pos[tok * 3u + axis]);
				let freq = posI / pow(p.base, (2.0 * f32(i)) / f32(p.headDim));
				let c = cos(freq); let s = sin(freq);
				let x0 = x[base + i];
				let x1 = x[base + i + half];
				o[base + i]        = x0 * c - x1 * s;
				o[base + i + half] = x1 * c + x0 * s;
			}
		}`,rope_2d:`
		struct RP { rows: u32, headDim: u32, nHeads: u32, pad: u32, base: f32 };
		@group(0) @binding(0) var<uniform> p: RP;
		@group(0) @binding(1) var<storage, read> x: array<f32>;
		@group(0) @binding(2) var<storage, read> pos: array<u32>;
		@group(0) @binding(3) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
			let r = gid.x;
			if (r >= p.rows) { return; }
			let half = p.headDim / 2u;
			let quarter = half / 2u;
			let pIdx = r / p.nHeads; // index du patch (\xAB patch \xBB est un mot r\xE9serv\xE9 WGSL)
			let hPos = f32(pos[pIdx * 2u]);
			let wPos = f32(pos[pIdx * 2u + 1u]);
			let base = r * p.headDim;
			for (var i = 0u; i < half; i = i + 1u) {
				let isH = i < quarter;
				let j = select(i - quarter, i, isH);
				let posI = select(wPos, hPos, isH);
				let freq = posI / pow(p.base, f32(j) / f32(quarter));
				let c = cos(freq); let s = sin(freq);
				let x0 = x[base + i];
				let x1 = x[base + i + half];
				o[base + i]        = x0 * c - x1 * s;
				o[base + i + half] = x1 * c + x0 * s;
			}
		}`,attention:`
		struct AP { nTokens: u32, nHeads: u32, nKvHeads: u32, headDim: u32, kvLen: u32, pastLen: u32, scale: f32, softcap: f32 };
		@group(0) @binding(0) var<uniform> p: AP;
		@group(0) @binding(1) var<storage, read> q: array<f32>;
		@group(0) @binding(2) var<storage, read> k: array<f32>;
		@group(0) @binding(3) var<storage, read> v: array<f32>;
		@group(0) @binding(4) var<storage, read_write> o: array<f32>;
		// Score = dot\xB7scale, optionally tanh-softcapped (Gemma2): c\xB7tanh(s/c). softcap<=0 disables.
		fn score(dot: f32) -> f32 {
			let s = dot * p.scale;
			return select(s, p.softcap * tanh(s / p.softcap), p.softcap > 0.0);
		}
		@compute @workgroup_size(64)
		fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
			let idx = gid.x;
			if (idx >= p.nTokens * p.nHeads) { return; }
			let t = idx / p.nHeads;
			let h = idx % p.nHeads;
			let hd = p.headDim;
			let kvh = h / (p.nHeads / p.nKvHeads); // grouped-query: map q-head \u2192 kv-head
			let qBase = (t * p.nHeads + h) * hd;
			let last = p.pastLen + t;
			var m = -3.0e38;
			for (var j = 0u; j <= last; j = j + 1u) {
				let kB = (j * p.nKvHeads + kvh) * hd;
				var dot = 0.0;
				for (var d = 0u; d < hd; d = d + 1u) { dot = dot + q[qBase + d] * k[kB + d]; }
				m = max(m, score(dot));
			}
			for (var d = 0u; d < hd; d = d + 1u) { o[qBase + d] = 0.0; }
			var denom = 0.0;
			for (var j = 0u; j <= last; j = j + 1u) {
				let kB = (j * p.nKvHeads + kvh) * hd;
				var dot = 0.0;
				for (var d = 0u; d < hd; d = d + 1u) { dot = dot + q[qBase + d] * k[kB + d]; }
				let w = exp(score(dot) - m);
				denom = denom + w;
				let vB = (j * p.nKvHeads + kvh) * hd;
				for (var d = 0u; d < hd; d = d + 1u) { o[qBase + d] = o[qBase + d] + w * v[vB + d]; }
			}
			let inv = 1.0 / denom;
			for (var d = 0u; d < hd; d = d + 1u) { o[qBase + d] = o[qBase + d] * inv; }
		}`,attention_full:`
		struct AP { nTokens: u32, nHeads: u32, nKvHeads: u32, headDim: u32, kvLen: u32, pastLen: u32, scale: f32, softcap: f32 };
		@group(0) @binding(0) var<uniform> p: AP;
		@group(0) @binding(1) var<storage, read> q: array<f32>;
		@group(0) @binding(2) var<storage, read> k: array<f32>;
		@group(0) @binding(3) var<storage, read> v: array<f32>;
		@group(0) @binding(4) var<storage, read_write> o: array<f32>;
		fn score(dot: f32) -> f32 {
			let s = dot * p.scale;
			return select(s, p.softcap * tanh(s / p.softcap), p.softcap > 0.0);
		}
		@compute @workgroup_size(64)
		fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
			let idx = gid.x;
			if (idx >= p.nTokens * p.nHeads) { return; }
			let t = idx / p.nHeads;
			let h = idx % p.nHeads;
			let hd = p.headDim;
			let kvh = h / (p.nHeads / p.nKvHeads);
			let qBase = (t * p.nHeads + h) * hd;
			var m = -3.0e38;
			for (var j = 0u; j < p.kvLen; j = j + 1u) {
				let kB = (j * p.nKvHeads + kvh) * hd;
				var dot = 0.0;
				for (var d = 0u; d < hd; d = d + 1u) { dot = dot + q[qBase + d] * k[kB + d]; }
				m = max(m, score(dot));
			}
			for (var d = 0u; d < hd; d = d + 1u) { o[qBase + d] = 0.0; }
			var denom = 0.0;
			for (var j = 0u; j < p.kvLen; j = j + 1u) {
				let kB = (j * p.nKvHeads + kvh) * hd;
				var dot = 0.0;
				for (var d = 0u; d < hd; d = d + 1u) { dot = dot + q[qBase + d] * k[kB + d]; }
				let w = exp(score(dot) - m);
				denom = denom + w;
				let vB = (j * p.nKvHeads + kvh) * hd;
				for (var d = 0u; d < hd; d = d + 1u) { o[qBase + d] = o[qBase + d] + w * v[vB + d]; }
			}
			let inv = 1.0 / denom;
			for (var d = 0u; d < hd; d = d + 1u) { o[qBase + d] = o[qBase + d] * inv; }
		}`,attention_full_wg:`
		struct AP { nTokens: u32, nHeads: u32, nKvHeads: u32, headDim: u32, kvLen: u32, pastLen: u32, scale: f32, softcap: f32 };
		@group(0) @binding(0) var<uniform> p: AP;
		@group(0) @binding(1) var<storage, read> q: array<f32>;
		@group(0) @binding(2) var<storage, read> k: array<f32>;
		@group(0) @binding(3) var<storage, read> v: array<f32>;
		@group(0) @binding(4) var<storage, read_write> o: array<f32>;
		var<workgroup> qs: array<f32, 192>;  // la query de cette t\xEAte (headDim \u2264 192)
		var<workgroup> sc: array<f32, 64>;   // poids exp de la tuile
		var<workgroup> red: array<f32, 64>;  // scratch de r\xE9duction (max puis somme)
		fn score(dot: f32) -> f32 {
			let s = dot * p.scale;
			return select(s, p.softcap * tanh(s / p.softcap), p.softcap > 0.0);
		}
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let idx = wid.x;
			let lane = lid.x;
			let t = idx / p.nHeads;
			let h = idx % p.nHeads;
			let hd = p.headDim;
			let kvh = h / (p.nHeads / p.nKvHeads);
			let qBase = (t * p.nHeads + h) * hd;
			let d0 = lane;
			let d1 = lane + 64u;
			let d2 = lane + 128u;
			if (d0 < hd) { qs[d0] = q[qBase + d0]; }
			if (d1 < hd) { qs[d1] = q[qBase + d1]; }
			if (d2 < hd) { qs[d2] = q[qBase + d2]; }
			workgroupBarrier();
			var m = -3.0e38;
			var denom = 0.0;
			var acc0 = 0.0;
			var acc1 = 0.0;
			var acc2 = 0.0;
			let nChunks = (p.kvLen + 63u) / 64u; // \u2308kvLen/64\u2309 (kvLen \u2265 1)
			for (var c = 0u; c < nChunks; c = c + 1u) {
				let j = c * 64u + lane;
				var s = -3.0e38;
				if (j < p.kvLen) {
					let kB = (j * p.nKvHeads + kvh) * hd;
					var dot = 0.0;
					for (var d = 0u; d < hd; d = d + 1u) { dot = dot + qs[d] * k[kB + d]; }
					s = score(dot);
				}
				red[lane] = s;
				workgroupBarrier();
				for (var off = 32u; off > 0u; off = off >> 1u) {
					if (lane < off) { red[lane] = max(red[lane], red[lane + off]); }
					workgroupBarrier();
				}
				let newM = max(m, red[0]);
				workgroupBarrier(); // red[0] lu par toutes les lanes avant r\xE9\xE9criture
				let e = select(0.0, exp(s - newM), j < p.kvLen);
				sc[lane] = e;
				red[lane] = e;
				workgroupBarrier();
				for (var off = 32u; off > 0u; off = off >> 1u) {
					if (lane < off) { red[lane] = red[lane] + red[lane + off]; }
					workgroupBarrier();
				}
				let alpha = exp(m - newM); // m initial -3e38 \u2192 alpha 0 : \xE9crase l'\xE9tat vide, jamais NaN
				denom = denom * alpha + red[0];
				m = newM;
				let nValid = min(64u, p.kvLen - c * 64u);
				let vRow0 = (c * 64u * p.nKvHeads + kvh) * hd;
				let vStride = p.nKvHeads * hd;
				if (d0 < hd) {
					var a0 = acc0 * alpha;
					for (var i = 0u; i < nValid; i = i + 1u) { a0 = a0 + sc[i] * v[vRow0 + i * vStride + d0]; }
					acc0 = a0;
				}
				if (d1 < hd) {
					var a1 = acc1 * alpha;
					for (var i = 0u; i < nValid; i = i + 1u) { a1 = a1 + sc[i] * v[vRow0 + i * vStride + d1]; }
					acc1 = a1;
				}
				if (d2 < hd) {
					var a2 = acc2 * alpha;
					for (var i = 0u; i < nValid; i = i + 1u) { a2 = a2 + sc[i] * v[vRow0 + i * vStride + d2]; }
					acc2 = a2;
				}
				workgroupBarrier(); // sc/red r\xE9utilis\xE9s \xE0 la tuile suivante
			}
			let inv = 1.0 / denom;
			if (d0 < hd) { o[qBase + d0] = acc0 * inv; }
			if (d1 < hd) { o[qBase + d1] = acc1 * inv; }
			if (d2 < hd) { o[qBase + d2] = acc2 * inv; }
		}`,quantize_kv:`
		struct QP { rows: u32, nKvHeads: u32, headDim: u32, rowOffset: u32 };
		@group(0) @binding(0) var<uniform> p: QP;
		@group(0) @binding(1) var<storage, read> src: array<f32>;
		@group(0) @binding(2) var<storage, read_write> codes: array<u32>;
		@group(0) @binding(3) var<storage, read_write> scales: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let idx = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (idx >= p.rows * p.nKvHeads) { return; }
			let row = idx / p.nKvHeads;
			let head = idx % p.nKvHeads;
			let hd = p.headDim;
			let kvDim = p.nKvHeads * hd;
			let srcBase = row * kvDim + head * hd;
			var amax = 0.0;
			for (var d = 0u; d < hd; d = d + 1u) { amax = max(amax, abs(src[srcBase + d])); }
			let scale = select(amax / 127.0, 1e-8, amax == 0.0);
			let dstRow = p.rowOffset + row;
			scales[dstRow * p.nKvHeads + head] = scale;
			let wordBase = (dstRow * kvDim + head * hd) / 4u;
			let inv = 1.0 / scale;
			let words = hd / 4u;
			for (var w = 0u; w < words; w = w + 1u) {
				var word = 0u;
				for (var b = 0u; b < 4u; b = b + 1u) {
					var qd = i32(round(src[srcBase + w * 4u + b] * inv));
					qd = clamp(qd, -127, 127);
					word = word | ((u32(qd) & 0xFFu) << (b * 8u));
				}
				codes[wordBase + w] = word;
			}
		}`,attention_q8kv:`
		struct AP { nTokens: u32, nHeads: u32, nKvHeads: u32, headDim: u32, kvLen: u32, pastLen: u32, scale: f32, softcap: f32 };
		@group(0) @binding(0) var<uniform> p: AP;
		@group(0) @binding(1) var<storage, read> q: array<f32>;
		@group(0) @binding(2) var<storage, read> kc: array<u32>;
		@group(0) @binding(3) var<storage, read> ks: array<f32>;
		@group(0) @binding(4) var<storage, read> vc: array<u32>;
		@group(0) @binding(5) var<storage, read> vs: array<f32>;
		@group(0) @binding(6) var<storage, read_write> o: array<f32>;
		fn sbyte(word: u32, b: u32) -> f32 { return f32(i32(word << ((3u - b) * 8u)) >> 24u); }
		fn score(dot: f32) -> f32 {
			let s = dot * p.scale;
			return select(s, p.softcap * tanh(s / p.softcap), p.softcap > 0.0);
		}
		@compute @workgroup_size(64)
		fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
			let idx = gid.x;
			if (idx >= p.nTokens * p.nHeads) { return; }
			let t = idx / p.nHeads;
			let h = idx % p.nHeads;
			let hd = p.headDim;
			let kvh = h / (p.nHeads / p.nKvHeads);
			let kvDim = p.nKvHeads * hd;
			let qBase = (t * p.nHeads + h) * hd;
			let last = p.pastLen + t;
			var m = -3.0e38;
			for (var j = 0u; j <= last; j = j + 1u) {
				let eb = j * kvDim + kvh * hd;
				var raw = 0.0;
				for (var d = 0u; d < hd; d = d + 1u) { let e = eb + d; raw = raw + q[qBase + d] * sbyte(kc[e >> 2u], e & 3u); }
				m = max(m, score(raw * ks[j * p.nKvHeads + kvh]));
			}
			for (var d = 0u; d < hd; d = d + 1u) { o[qBase + d] = 0.0; }
			var denom = 0.0;
			for (var j = 0u; j <= last; j = j + 1u) {
				let eb = j * kvDim + kvh * hd;
				var raw = 0.0;
				for (var d = 0u; d < hd; d = d + 1u) { let e = eb + d; raw = raw + q[qBase + d] * sbyte(kc[e >> 2u], e & 3u); }
				let w = exp(score(raw * ks[j * p.nKvHeads + kvh]) - m);
				denom = denom + w;
				let vsc = vs[j * p.nKvHeads + kvh];
				for (var d = 0u; d < hd; d = d + 1u) { let e = eb + d; o[qBase + d] = o[qBase + d] + w * vsc * sbyte(vc[e >> 2u], e & 3u); }
			}
			let inv = 1.0 / denom;
			for (var d = 0u; d < hd; d = d + 1u) { o[qBase + d] = o[qBase + d] * inv; }
		}`,attention_decode:`
		struct AP { nTokens: u32, nHeads: u32, nKvHeads: u32, headDim: u32, kvLen: u32, pastLen: u32, scale: f32, softcap: f32 };
		@group(0) @binding(0) var<uniform> p: AP;
		@group(0) @binding(1) var<storage, read> q: array<f32>;
		@group(0) @binding(2) var<storage, read> k: array<f32>;
		@group(0) @binding(3) var<storage, read> v: array<f32>;
		@group(0) @binding(4) var<storage, read_write> o: array<f32>;
		var<workgroup> qs: array<f32, 128>;  // la query de cette t\xEAte (headDim \u2264 128)
		var<workgroup> sc: array<f32, 64>;   // scores de la tuile \u2192 poids exp
		var<workgroup> red: array<f32, 64>;  // scratch de r\xE9duction (max puis somme)
		fn score(dot: f32) -> f32 {
			let s = dot * p.scale;
			return select(s, p.softcap * tanh(s / p.softcap), p.softcap > 0.0);
		}
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let idx = wid.x;
			let lane = lid.x;
			let t = idx / p.nHeads;
			let h = idx % p.nHeads;
			let hd = p.headDim;
			let kvh = h / (p.nHeads / p.nKvHeads);
			let qBase = (t * p.nHeads + h) * hd;
			let last = p.pastLen + t; // uniforme dans le workgroup (t l'est)
			// Accumulation V en DEUX SCALAIRES par lane (d0 = lane, d1 = lane+64 ; headDim \u2264 128
			// garanti au dispatch) \u2014 pas de tableau priv\xE9 index\xE9 dynamiquement, motif connu pour
			// spiller ou miscompiler sur les drivers mobiles (Adreno/Mali).
			let d0 = lane;
			let d1 = lane + 64u;
			if (d0 < hd) { qs[d0] = q[qBase + d0]; }
			if (d1 < hd) { qs[d1] = q[qBase + d1]; }
			workgroupBarrier();
			var m = -3.0e38;
			var denom = 0.0;
			var acc0 = 0.0;
			var acc1 = 0.0;
			let nChunks = (last + 64u) / 64u; // \u2308(last+1)/64\u2309 \u2014 \u2265 1, la tuile 0 contient j=0
			for (var c = 0u; c < nChunks; c = c + 1u) {
				let j = c * 64u + lane;
				var s = -3.0e38;
				if (j <= last) {
					let kB = (j * p.nKvHeads + kvh) * hd;
					var dot = 0.0;
					for (var d = 0u; d < hd; d = d + 1u) { dot = dot + qs[d] * k[kB + d]; }
					s = score(dot);
				}
				red[lane] = s;
				workgroupBarrier();
				for (var off = 32u; off > 0u; off = off >> 1u) {
					if (lane < off) { red[lane] = max(red[lane], red[lane + off]); }
					workgroupBarrier();
				}
				let newM = max(m, red[0]);
				workgroupBarrier(); // red[0] lu par toutes les lanes avant r\xE9\xE9criture
				let e = select(0.0, exp(s - newM), j <= last);
				sc[lane] = e;
				red[lane] = e;
				workgroupBarrier();
				for (var off = 32u; off > 0u; off = off >> 1u) {
					if (lane < off) { red[lane] = red[lane] + red[lane + off]; }
					workgroupBarrier();
				}
				let alpha = exp(m - newM); // m initial -3e38 \u2192 alpha 0 : \xE9crase l'\xE9tat vide, jamais NaN
				denom = denom * alpha + red[0];
				m = newM;
				let nValid = min(64u, last + 1u - c * 64u);
				let vRow0 = (c * 64u * p.nKvHeads + kvh) * hd;
				let vStride = p.nKvHeads * hd;
				if (d0 < hd) {
					var a0 = acc0 * alpha;
					for (var i = 0u; i < nValid; i = i + 1u) { a0 = a0 + sc[i] * v[vRow0 + i * vStride + d0]; }
					acc0 = a0;
				}
				if (d1 < hd) {
					var a1 = acc1 * alpha;
					for (var i = 0u; i < nValid; i = i + 1u) { a1 = a1 + sc[i] * v[vRow0 + i * vStride + d1]; }
					acc1 = a1;
				}
				workgroupBarrier(); // sc/red r\xE9utilis\xE9s \xE0 la tuile suivante
			}
			let inv = 1.0 / denom;
			if (d0 < hd) { o[qBase + d0] = acc0 * inv; }
			if (d1 < hd) { o[qBase + d1] = acc1 * inv; }
		}`,attention_decode_q8kv:`
		struct AP { nTokens: u32, nHeads: u32, nKvHeads: u32, headDim: u32, kvLen: u32, pastLen: u32, scale: f32, softcap: f32 };
		@group(0) @binding(0) var<uniform> p: AP;
		@group(0) @binding(1) var<storage, read> q: array<f32>;
		@group(0) @binding(2) var<storage, read> kc: array<u32>;
		@group(0) @binding(3) var<storage, read> ks: array<f32>;
		@group(0) @binding(4) var<storage, read> vc: array<u32>;
		@group(0) @binding(5) var<storage, read> vs: array<f32>;
		@group(0) @binding(6) var<storage, read_write> o: array<f32>;
		var<workgroup> qs: array<f32, 128>;
		var<workgroup> sc: array<f32, 64>;
		var<workgroup> red: array<f32, 64>;
		fn sbyte(word: u32, b: u32) -> f32 { return f32(i32(word << ((3u - b) * 8u)) >> 24u); }
		fn score(dot: f32) -> f32 {
			let s = dot * p.scale;
			return select(s, p.softcap * tanh(s / p.softcap), p.softcap > 0.0);
		}
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let idx = wid.x;
			let lane = lid.x;
			let t = idx / p.nHeads;
			let h = idx % p.nHeads;
			let hd = p.headDim;
			let kvh = h / (p.nHeads / p.nKvHeads);
			let kvDim = p.nKvHeads * hd;
			let qBase = (t * p.nHeads + h) * hd;
			let last = p.pastLen + t;
			let d0 = lane;
			let d1 = lane + 64u;
			if (d0 < hd) { qs[d0] = q[qBase + d0]; }
			if (d1 < hd) { qs[d1] = q[qBase + d1]; }
			workgroupBarrier();
			var m = -3.0e38;
			var denom = 0.0;
			var acc0 = 0.0;
			var acc1 = 0.0;
			let nChunks = (last + 64u) / 64u;
			for (var c = 0u; c < nChunks; c = c + 1u) {
				let j = c * 64u + lane;
				var s = -3.0e38;
				if (j <= last) {
					let eb = j * kvDim + kvh * hd;
					var raw = 0.0;
					for (var d = 0u; d < hd; d = d + 1u) { let e = eb + d; raw = raw + qs[d] * sbyte(kc[e >> 2u], e & 3u); }
					s = score(raw * ks[j * p.nKvHeads + kvh]);
				}
				red[lane] = s;
				workgroupBarrier();
				for (var off = 32u; off > 0u; off = off >> 1u) {
					if (lane < off) { red[lane] = max(red[lane], red[lane + off]); }
					workgroupBarrier();
				}
				let newM = max(m, red[0]);
				workgroupBarrier();
				// Poids \xD7 scale de V fusionn\xE9s \xE0 l'\xE9criture : denom veut le poids NU, donc deux tampons.
				// L'index de vs est gard\xE9 par un if (PAS un select : il \xE9value ses deux branches, et
				// j peut d\xE9passer kvLen sur la derni\xE8re tuile \u2014 le\xE7on conv2d tuil\xE9e).
				let e = select(0.0, exp(s - newM), j <= last);
				red[lane] = e;
				var ev = 0.0;
				if (j <= last) { ev = e * vs[j * p.nKvHeads + kvh]; }
				sc[lane] = ev;
				workgroupBarrier();
				for (var off = 32u; off > 0u; off = off >> 1u) {
					if (lane < off) { red[lane] = red[lane] + red[lane + off]; }
					workgroupBarrier();
				}
				let alpha = exp(m - newM);
				denom = denom * alpha + red[0];
				m = newM;
				let nValid = min(64u, last + 1u - c * 64u);
				let vRow0 = c * 64u * kvDim + kvh * hd;
				if (d0 < hd) {
					var a0 = acc0 * alpha;
					for (var i = 0u; i < nValid; i = i + 1u) { let e2 = vRow0 + i * kvDim + d0; a0 = a0 + sc[i] * sbyte(vc[e2 >> 2u], e2 & 3u); }
					acc0 = a0;
				}
				if (d1 < hd) {
					var a1 = acc1 * alpha;
					for (var i = 0u; i < nValid; i = i + 1u) { let e2 = vRow0 + i * kvDim + d1; a1 = a1 + sc[i] * sbyte(vc[e2 >> 2u], e2 & 3u); }
					acc1 = a1;
				}
				workgroupBarrier();
			}
			let inv = 1.0 / denom;
			if (d0 < hd) { o[qBase + d0] = acc0 * inv; }
			if (d1 < hd) { o[qBase + d1] = acc1 * inv; }
		}`,dequant_q4k:`
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
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let blk = (wid.y * nwg.x + wid.x) * 64u + lid.x;
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
		}`,dequant_q8_0:`
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
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let blk=(wid.y*nwg.x+wid.x)*64u+lid.x; if(blk>=p.nBlocks){return;}
			let base=blk*34u; let d=f16(gb(base)|(gb(base+1u)<<8u)); let ob=blk*32u;
			for(var l=0u;l<32u;l=l+1u){ o[ob+l]=d*si8(gb(base+2u+l)); }
		}`,dequant_q5_0:`
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
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let blk=(wid.y*nwg.x+wid.x)*64u+lid.x; if(blk>=p.nBlocks){return;}
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
		}`,dequant_q4_0:`
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
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let blk=(wid.y*nwg.x+wid.x)*64u+lid.x; if(blk>=p.nBlocks){return;}
			let base=blk*18u;
			let d=f16(gb(base)|(gb(base+1u)<<8u));
			let ob=blk*32u;
			for(var j=0u;j<16u;j=j+1u){
				let qsj=gb(base+2u+j);
				o[ob+j]     = d*f32(i32(qsj&0xFu)-8);
				o[ob+j+16u] = d*f32(i32(qsj>>4u)-8);
			}
		}`,dequant_q5k:`
		struct DQ { nBlocks: u32 };
		@group(0) @binding(0) var<uniform> p: DQ;
		@group(0) @binding(1) var<storage, read> q: array<u32>;
		@group(0) @binding(2) var<storage, read_write> o: array<f32>;
		fn f16(h: u32) -> f32 {
			let s=(h>>15u)&1u; let e=(h>>10u)&0x1Fu; let m=h&0x3FFu; var v:f32;
			if(e==0u){v=f32(m)*5.9604645e-8;}else if(e==31u){v=65504.0;}else{v=(1.0+f32(m)/1024.0)*pow(2.0,f32(e)-15.0);}
			return select(v,-v,s==1u);
		}
		fn byteAt(base: u32, k: u32) -> u32 { let word = q[base + (k >> 2u)]; return (word >> ((k & 3u) * 8u)) & 0xFFu; }
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
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let blk = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (blk >= p.nBlocks) { return; }
			let base = blk * 44u; // 176 bytes
			let d = f16(q[base] & 0xFFFFu);
			let dmin = f16((q[base] >> 16u) & 0xFFFFu);
			let outBase = blk * 256u;
			var is = 0u; var qsOff = 0u; var u1 = 1u; var u2 = 2u;
			for (var j = 0u; j < 256u; j = j + 64u) {
				let a = scaleMin(base, is);   let d1 = d * a.x; let m1 = dmin * a.y;
				let b = scaleMin(base, is + 1u); let d2 = d * b.x; let m2 = dmin * b.y;
				for (var l = 0u; l < 32u; l = l + 1u) {
					let ql = byteAt(base, 48u + qsOff + l);
					let qhl = byteAt(base, 16u + l);
					let hi1 = select(0u, 16u, (qhl & u1) != 0u);
					let hi2 = select(0u, 16u, (qhl & u2) != 0u);
					o[outBase + j + l]       = d1 * f32((ql & 0xFu) + hi1) - m1;
					o[outBase + j + 32u + l] = d2 * f32((ql >> 4u) + hi2) - m2;
				}
				qsOff = qsOff + 32u; is = is + 2u; u1 = u1 << 2u; u2 = u2 << 2u;
			}
		}`,dequant_q6k:`
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
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let blk=(wid.y*nwg.x+wid.x)*64u+lid.x; if(blk>=p.nBlocks){return;}
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
		}`,addbias:`
		struct BP { rows: u32, cols: u32 };
		@group(0) @binding(0) var<uniform> p: BP;
		@group(0) @binding(1) var<storage, read> x: array<f32>;
		@group(0) @binding(2) var<storage, read> bias: array<f32>;
		@group(0) @binding(3) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let i = (wid.y * nwg.x + wid.x) * 64u + lid.x;  // 2-D workgroup grid \u2192 flat index (no dim > 65535)
			if (i >= p.rows * p.cols) { return; }
			o[i] = x[i] + bias[i % p.cols];
		}`,argmax:`
		struct P { n: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> x: array<f32>;
		@group(0) @binding(2) var<storage, read_write> o: array<u32>;
		var<workgroup> sVal: array<f32, 256>;
		var<workgroup> sIdx: array<u32, 256>;
		@compute @workgroup_size(256)
		fn main(@builtin(local_invocation_id) lid: vec3<u32>) {
			let tid = lid.x;
			var bestV = -3.0e38;
			var bestI = 0u;
			var i = tid;
			loop {
				if (i >= p.n) { break; }
				let v = x[i];
				if (v > bestV) { bestV = v; bestI = i; }
				i = i + 256u;
			}
			sVal[tid] = bestV;
			sIdx[tid] = bestI;
			workgroupBarrier();
			var stride = 128u;
			loop {
				if (stride == 0u) { break; }
				if (tid < stride) {
					if (sVal[tid + stride] > sVal[tid]) {
						sVal[tid] = sVal[tid + stride];
						sIdx[tid] = sIdx[tid + stride];
					}
				}
				workgroupBarrier();
				stride = stride / 2u;
			}
			if (tid == 0u) { o[0] = sIdx[0]; }
		}`},He=`
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
	}`;var Z=64,I=class I{constructor(){this.device=null;this.modules={};this.pipelines={};this.maxStorageBufferBindingSize=0;this.hasF16=!1;this.validationFailure=null;this.lost=!1;this.onLost=null;this.attnDecodeOk=!0;this.attnFullWgOk=!0;this.mropeOk=!0;this.rwkvWkv7Ok=!0;this.lfm2ShortConvOk=!0;this.lfm2ResidentOk=!0;this.videoOk=!0;this.videoResidentOk=!0;this.bufferPool=new Map;this.poolSize=new WeakMap;this.pooled=new WeakSet;this.uniformPool=new Map;this.uniformSize=new WeakMap;this.convTiledOk=!0;this.kvGpu=new Map;this.topKOk=!0;this.kvSession="";this.kvQuant=!1;this.lfm2KvGpu=new Map;this.lfm2ConvGpu=new Map;this.lfm2Session=""}async init(){let t=navigator.gpu;if(!t)return!1;let r=await t.requestAdapter();if(!r)return!1;let e=r.limits,n={maxStorageBufferBindingSize:e.maxStorageBufferBindingSize,maxBufferSize:e.maxBufferSize},a=[];try{r.features?.has("shader-f16")&&a.push("shader-f16")}catch{}try{this.device=await r.requestDevice({requiredLimits:n,requiredFeatures:a})}catch{try{this.device=await r.requestDevice({requiredLimits:n})}catch{this.device=await r.requestDevice()}}this.maxStorageBufferBindingSize=this.device.limits?.maxStorageBufferBindingSize??134217728,this.hasF16=!!this.device.features?.has?.("shader-f16");try{typeof location<"u"&&new URLSearchParams(location.search).get("attndecode")==="0"&&(this.attnDecodeOk=!1,console.warn("[webgpu] attention d\xE9codage COUP\xC9E par ?attndecode=0 \u2014 kernels classiques")),typeof location<"u"&&new URLSearchParams(location.search).get("attnfullwg")==="0"&&(this.attnFullWgOk=!1,console.warn("[webgpu] attention_full workgroup COUP\xC9E par ?attnfullwg=0 \u2014 kernel classique")),typeof location<"u"&&new URLSearchParams(location.search).get("rwkv")==="0"&&(this.rwkvWkv7Ok=!1,console.warn("[webgpu] kernel RWKV-7 WKV COUP\xC9 par ?rwkv=0")),typeof location<"u"&&new URLSearchParams(location.search).get("lfm2")==="0"&&(this.lfm2ShortConvOk=!1,console.warn("[webgpu] kernel shortconv LFM2 COUP\xC9 par ?lfm2=0")),typeof location<"u"&&new URLSearchParams(location.search).get("lfm2resident")==="0"&&(this.lfm2ResidentOk=!1,console.warn("[webgpu] LFM2 r\xE9sident COUP\xC9 par ?lfm2resident=0 \u2014 forwardToken JS+readback")),typeof location<"u"&&new URLSearchParams(location.search).get("video")==="0"&&(this.videoOk=!1,console.warn("[webgpu] chemin vid\xE9o (module motion) COUP\xC9 par ?video=0")),typeof location<"u"&&new URLSearchParams(location.search).get("videoresident")==="0"&&(this.videoResidentOk=!1,console.warn("[webgpu] motion r\xE9sident COUP\xC9 par ?videoresident=0 \u2014 chemin JS+readback"))}catch{}this.device.lost?.then?.(s=>{this.lost=!0,console.warn("[webgpu] device GPU perdu :",s?.reason||"unknown",s?.message||""),this.onLost?.(s)});for(let[s,i]of Object.entries(ze))this.modules[s]=this.device.createShaderModule({code:i});return this.hasF16&&(this.modules.matmul_t_f16w=this.device.createShaderModule({code:He})),!0}buf(t,r){let e=this.device.createBuffer({size:t.byteLength,usage:r});return this.device.queue.writeBuffer(e,0,t),e}bufU32(t,r){let e=this.device.createBuffer({size:t.byteLength,usage:r});return this.device.queue.writeBuffer(e,0,t),e}async readBack(t,r){let e=globalThis,n=this.device.createBuffer({size:r,usage:e.GPUBufferUsage.COPY_DST|e.GPUBufferUsage.MAP_READ}),a=this.device.createCommandEncoder();a.copyBufferToBuffer(t,0,n,0,r),this.device.queue.submit([a.finish()]),await n.mapAsync(e.GPUMapMode.READ);let s=new Float32Array(n.getMappedRange().slice(0));return n.unmap(),n.destroy(),s}async readBackBytes(t,r){let e=globalThis,n=Math.ceil(r/4)*4,a=this.device.createBuffer({size:n,usage:e.GPUBufferUsage.COPY_DST|e.GPUBufferUsage.MAP_READ}),s=this.device.createCommandEncoder();s.copyBufferToBuffer(t,0,a,0,n),this.device.queue.submit([s.finish()]),await a.mapAsync(e.GPUMapMode.READ);let i=new Uint8Array(a.getMappedRange().slice(0,r));return a.unmap(),a.destroy(),i}async quantizeToBytes(t,r,e,n,a){let s=e/32,i=n==="q8"?new Uint8Array(e+s*2):new Uint8Array(e/2+s*4),o=I.BLOCK_ELEMS[t]??1,u=e/o,c=r.byteLength/u,f=(p,m)=>m===0?p:f(m,p%m),l=o*32/f(o,32),h=Math.floor(this.maxStorageBufferBindingSize*.9/4),d=a??h;d=Math.max(l,Math.floor(d/l)*l);for(let p=0;p<e;p+=d){let m=Math.min(d,e-p),v=r.slice(p/o*c,(p+m)/o*c),U=this.dequantizeToGpu(t,v,m);try{if(n==="q8"){let{codes:M,sc:q}=this.f32ToQ8Gpu(U,m),S=await this.readBackBytes(M,m),C=await this.readBackBytes(q,m/32*2);M.destroy?.(),q.destroy?.(),i.set(S,p),i.set(C,e+p/32*2)}else{let{nib:M,sc:q,mn:S}=this.f32ToQ4Gpu(U,m),C=await this.readBackBytes(M,m/2),G=await this.readBackBytes(q,m/32*2),A=await this.readBackBytes(S,m/32*2);M.destroy?.(),q.destroy?.(),S.destroy?.(),i.set(C,p/2),i.set(G,e/2+p/32*2),i.set(A,e/2+s*2+p/32*2)}}finally{U.destroy?.()}}return i}pipeline(t){let r=this.pipelines[t];return r||(r=this.device.createComputePipeline({layout:"auto",compute:{module:this.modules[t],entryPoint:"main"}}),this.pipelines[t]=r),r}grid1D(t){let r=Math.ceil(t/Z);if(r<=I.MAX_WG_DIM)return[r,1,1];let e=I.MAX_WG_DIM;return[e,Math.ceil(r/e),1]}recordPass(t,r,e,n){let a=this.pipeline(r),s=this.device.createBindGroup({layout:a.getBindGroupLayout(0),entries:e.map((o,u)=>({binding:u,resource:{buffer:o}}))}),i=t.beginComputePass();i.setPipeline(a),i.setBindGroup(0,s),i.dispatchWorkgroups(...n),i.end()}dispatch(t,r,e){let n=this.device.createCommandEncoder();this.recordPass(n,t,r,e),this.device.queue.submit([n.finish()])}async run(t,r,e,n,a){return this.dispatch(t,r,e),this.readBack(n,a)}isF32(t){return t instanceof Float32Array}async matmul(t,r,e,n,a){let s=globalThis,i=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,o=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([e,n,a]));let u=this.isF32(r)?this.buf(r,i):r,c=this.device.createBuffer({size:e*a*4,usage:i|s.GPUBufferUsage.COPY_SRC});return this.run("matmul",[o,this.buf(t,i),u,c],[Math.ceil(e/8),Math.ceil(a/8),1],c,e*a*4)}async matmulT(t,r,e,n,a,s=!1){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([e,n,a]));let c=this.isF32(r)?this.buf(r,o):r,f=this.device.createBuffer({size:e*a*4,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run(this.matmulTShader(n,s),[u,this.buf(t,o),c,f],[Math.ceil(e/8),Math.ceil(a/8),1],f,e*a*4)}matmulTShader(t,r){return r&&this.hasF16?"matmul_t_f16w":t%4===0?"matmul_t_vec4":"matmul_t"}async rmsnorm(t,r,e,n,a=1e-5,s=!1){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([e,n])),this.device.queue.writeBuffer(u,8,new Float32Array([a])),this.device.queue.writeBuffer(u,12,new Uint32Array([s?1:0]));let c=this.device.createBuffer({size:t.byteLength,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run("rmsnorm",[u,this.buf(t,o),this.buf(r,o),c],[Math.ceil(e/Z),1,1],c,t.byteLength)}async binary(t,r,e){let n=globalThis,a=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST,s=this.device.createBuffer({size:r.byteLength,usage:a|n.GPUBufferUsage.COPY_SRC});return this.run(t,[this.buf(r,a),this.buf(e,a),s],this.grid1D(r.length),s,r.byteLength)}swiglu(t,r){return this.binary("swiglu",t,r)}geglu(t,r){return this.binary("geglu",t,r)}add(t,r){return this.binary("add",t,r)}async silu(t){let r=globalThis,e=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:t.byteLength,usage:e|r.GPUBufferUsage.COPY_SRC});return this.run("silu",[this.buf(t,e),n],this.grid1D(t.length),n,t.byteLength)}async groupNorm(t,r,e,n,a,s,i=1e-5){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([n,a,s])),this.device.queue.writeBuffer(c,12,new Float32Array([i]));let f=this.device.createBuffer({size:t.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("group_norm",[c,this.buf(t,u),this.buf(r,u),this.buf(e,u),f],[s,1,1],f,t.byteLength)}async conv2d(t,r,e,n,a,s,i,o,u,c=1,f=0){let l=globalThis,h=l.GPUBufferUsage.STORAGE|l.GPUBufferUsage.COPY_DST,d=Math.floor((a+2*f-o)/c)+1,p=Math.floor((s+2*f-u)/c)+1,m=n*o*u,v=d*p;if(m*v*4>this.maxStorageBufferBindingSize*.9)return this.conv2dDirect(t,r,e,n,a,s,i,o,u,c,f);let U=this.device.createBuffer({size:48,usage:l.GPUBufferUsage.UNIFORM|l.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(U,0,new Uint32Array([n,a,s,o,u,c,f,d,p]));let M=this.device.createBuffer({size:m*v*4,usage:h|l.GPUBufferUsage.COPY_SRC});this.dispatch("im2col",[U,this.buf(t,h),M],this.grid1D(m*v));let q=await this.matmul(r,M,i,m,v);if(M.destroy?.(),U.destroy?.(),e)for(let S=0;S<i;S++){let C=e[S];for(let G=0;G<v;G++)q[S*v+G]+=C}return q}async conv2dDirect(t,r,e,n,a,s,i,o,u,c=1,f=0){let l=globalThis,h=l.GPUBufferUsage.STORAGE|l.GPUBufferUsage.COPY_DST,d=Math.floor((a+2*f-o)/c)+1,p=Math.floor((s+2*f-u)/c)+1,m=i*d*p,v=this.device.createBuffer({size:48,usage:l.GPUBufferUsage.UNIFORM|l.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(v,0,new Uint32Array([n,a,s,i,o,u,c,f,d,p]));let U=e??new Float32Array(i),M=this.device.createBuffer({size:m*4,usage:h|l.GPUBufferUsage.COPY_SRC});return this.run("conv2d_direct",[v,this.buf(t,h),this.buf(r,h),this.buf(U,h),M],this.grid1D(m),M,m*4)}async layernorm(t,r,e,n,a,s=1e-5){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,a])),this.device.queue.writeBuffer(u,8,new Float32Array([s]));let c=this.device.createBuffer({size:t.byteLength,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run("layernorm",[u,this.buf(t,o),this.buf(r,o),this.buf(e,o),c],[Math.ceil(n/Z),1,1],c,t.byteLength)}async quickGelu(t){let r=globalThis,e=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:t.byteLength,usage:e|r.GPUBufferUsage.COPY_SRC});return this.run("quick_gelu",[this.buf(t,e),n],this.grid1D(t.length),n,t.byteLength)}async gelu(t){let r=globalThis,e=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:t.byteLength,usage:e|r.GPUBufferUsage.COPY_SRC});return this.run("gelu",[this.buf(t,e),n],this.grid1D(t.length),n,t.byteLength)}async relu(t){let r=globalThis,e=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:t.byteLength,usage:e|r.GPUBufferUsage.COPY_SRC});return this.run("relu",[this.buf(t,e),n],this.grid1D(t.length),n,t.byteLength)}async upsampleNearest(t,r,e,n,a=2){let s=globalThis,i=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,o=e*a,u=n*a,c=r*o*u,f=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(f,0,new Uint32Array([r,e,n,a]));let l=this.device.createBuffer({size:c*4,usage:i|s.GPUBufferUsage.COPY_SRC});return this.run("upsample_nearest",[f,this.buf(t,i),l],this.grid1D(c),l,c*4)}async rope(t,r,e,n,a=0,s=1e4){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:32,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([r,e,n,a])),this.device.queue.writeBuffer(u,16,new Float32Array([s]));let c=this.device.createBuffer({size:t.byteLength,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run("rope",[u,this.buf(t,o),c],[Math.ceil(r/Z),1,1],c,t.byteLength)}async ropeFactors(t,r,e,n,a,s=0,i=1e4){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:32,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([e,n,a,s])),this.device.queue.writeBuffer(c,16,new Float32Array([i]));let f=this.device.createBuffer({size:r.byteLength,usage:u});this.device.queue.writeBuffer(f,0,r);let l=this.device.createBuffer({size:t.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("rope_factors",[c,this.buf(t,u),f,l],[Math.ceil(e/Z),1,1],l,t.byteLength)}async ropeMrope(t,r,e,n,a,s,i=1e4){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:32,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([e,n,a,s[0],s[0]+s[1]])),this.device.queue.writeBuffer(c,20,new Float32Array([i]));let f=this.device.createBuffer({size:r.byteLength,usage:u});this.device.queue.writeBuffer(f,0,r);let l=this.device.createBuffer({size:t.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("rope_mrope",[c,this.buf(t,u),f,l],[Math.ceil(e/Z),1,1],l,t.byteLength)}async rope2d(t,r,e,n,a,s=1e4){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:32,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([e,n,a,0])),this.device.queue.writeBuffer(u,16,new Float32Array([s]));let c=this.device.createBuffer({size:r.byteLength,usage:o});this.device.queue.writeBuffer(c,0,r);let f=this.device.createBuffer({size:t.byteLength,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run("rope_2d",[u,this.buf(t,o),c,f],[Math.ceil(e/Z),1,1],f,t.byteLength)}async attention(t,r,e,n,a,s,i,o=0,u,c=0){let f=globalThis,l=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,h=o+n,d=this.device.createBuffer({size:32,usage:f.GPUBufferUsage.UNIFORM|f.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(d,0,new Uint32Array([n,a,s,i,h,o])),this.device.queue.writeBuffer(d,24,new Float32Array([u??1/Math.sqrt(i),c]));let p=n*a*i*4,m=this.device.createBuffer({size:p,usage:l|f.GPUBufferUsage.COPY_SRC});return this.run("attention",[d,this.buf(t,l),this.buf(r,l),this.buf(e,l),m],[Math.ceil(n*a/Z),1,1],m,p)}async attentionDecode(t,r,e,n,a,s,i,o=0,u,c=0){let f=globalThis,l=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,h=o+n,d=this.device.createBuffer({size:32,usage:f.GPUBufferUsage.UNIFORM|f.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(d,0,new Uint32Array([n,a,s,i,h,o])),this.device.queue.writeBuffer(d,24,new Float32Array([u??1/Math.sqrt(i),c]));let p=n*a*i*4,m=this.device.createBuffer({size:p,usage:l|f.GPUBufferUsage.COPY_SRC});return this.run("attention_decode",[d,this.buf(t,l),this.buf(r,l),this.buf(e,l),m],[n*a,1,1],m,p)}async attentionFull(t,r,e,n,a,s,i,o,u,c=0){let f=globalThis,l=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,h=this.device.createBuffer({size:32,usage:f.GPUBufferUsage.UNIFORM|f.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(h,0,new Uint32Array([n,a,s,i,o,0])),this.device.queue.writeBuffer(h,24,new Float32Array([u??1/Math.sqrt(i),c]));let d=n*a*i*4,p=this.device.createBuffer({size:d,usage:l|f.GPUBufferUsage.COPY_SRC});return this.run("attention_full",[h,this.buf(t,l),this.buf(r,l),this.buf(e,l),p],[Math.ceil(n*a/Z),1,1],p,d)}async attentionFullWg(t,r,e,n,a,s,i,o,u,c=0){let f=globalThis,l=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,h=this.device.createBuffer({size:32,usage:f.GPUBufferUsage.UNIFORM|f.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(h,0,new Uint32Array([n,a,s,i,o,0])),this.device.queue.writeBuffer(h,24,new Float32Array([u??1/Math.sqrt(i),c]));let d=n*a*i*4,p=this.device.createBuffer({size:d,usage:l|f.GPUBufferUsage.COPY_SRC});return this.run("attention_full_wg",[h,this.buf(t,l),this.buf(r,l),this.buf(e,l),p],[n*a,1,1],p,d)}async quantizeKvReadback(t,r,e,n){let a=globalThis,s=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST|a.GPUBufferUsage.COPY_SRC,i=e*n,o=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([r,e,n,0]));let u=this.device.createBuffer({size:r*i,usage:s}),c=this.device.createBuffer({size:r*e*4,usage:s});this.dispatch("quantize_kv",[o,this.buf(t,s),u,c],this.grid1D(r*e));let f=await this.readBack(u,r*i),l=new Uint32Array(f.buffer,0,r*i/4),h=await this.readBack(c,r*e*4);return u.destroy?.(),c.destroy?.(),{codes:l,scales:h}}async attentionQ8Kv(t,r,e,n,a,s,i,o,u,c=0,f,l=0){let h=globalThis,d=h.GPUBufferUsage.STORAGE|h.GPUBufferUsage.COPY_DST,p=c+s,m=this.device.createBuffer({size:32,usage:h.GPUBufferUsage.UNIFORM|h.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(m,0,new Uint32Array([s,i,o,u,p,c])),this.device.queue.writeBuffer(m,24,new Float32Array([f??1/Math.sqrt(u),l]));let v=s*i*u*4,U=this.device.createBuffer({size:v,usage:d|h.GPUBufferUsage.COPY_SRC});return this.run("attention_q8kv",[m,this.buf(t,d),this.bufU32(r,d),this.buf(e,d),this.bufU32(n,d),this.buf(a,d),U],[Math.ceil(s*i/Z),1,1],U,v)}async attentionQ8KvDecode(t,r,e,n,a,s,i,o,u,c=0,f,l=0){let h=globalThis,d=h.GPUBufferUsage.STORAGE|h.GPUBufferUsage.COPY_DST,p=c+s,m=this.device.createBuffer({size:32,usage:h.GPUBufferUsage.UNIFORM|h.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(m,0,new Uint32Array([s,i,o,u,p,c])),this.device.queue.writeBuffer(m,24,new Float32Array([f??1/Math.sqrt(u),l]));let v=s*i*u*4,U=this.device.createBuffer({size:v,usage:d|h.GPUBufferUsage.COPY_SRC});return this.run("attention_decode_q8kv",[m,this.buf(t,d),this.bufU32(r,d),this.buf(e,d),this.bufU32(n,d),this.buf(a,d),U],[s*i,1,1],U,v)}async addBias(t,r,e,n){let a=globalThis,s=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,i=this.device.createBuffer({size:8,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(i,0,new Uint32Array([e,n]));let o=this.device.createBuffer({size:t.byteLength,usage:s|a.GPUBufferUsage.COPY_SRC});return this.run("addbias",[i,this.buf(t,s),this.buf(r,s),o],this.grid1D(t.length),o,t.byteLength)}async dequantBlocked(t,r,e,n){let a=globalThis,s=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,i=e/n;if(!Number.isInteger(i))throw new Error(`${t}: nElems ${e} not a multiple of ${n}`);let o=r.byteLength%4===0?r:(()=>{let l=new Uint8Array(Math.ceil(r.byteLength/4)*4);return l.set(r),l})(),u=new Uint32Array(o.buffer,o.byteOffset,o.byteLength/4),c=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([i]));let f=this.device.createBuffer({size:e*4,usage:s|a.GPUBufferUsage.COPY_SRC});return this.run(t,[c,this.bufU32(u,s),f],this.grid1D(i),f,e*4)}async dequantizeQ4K(t,r){return this.dequantBlocked("dequant_q4k",t,r,256)}async dequantizeByType(t,r,e){if(t==="F32")return new Float32Array(r.buffer,r.byteOffset,e);if(t==="F16"){let s=new DataView(r.buffer,r.byteOffset),i=new Float32Array(e);for(let o=0;o<e;o++)i[o]=ne(s.getUint16(o*2,!0));return i}if(t==="Q4W")return se(fe(r,e));if(t==="Q8W")return le(ge(r,e));if(t==="Q3W")return qe(xe(r,e));let n=I.DEQUANT_SHADER[t],a=I.BLOCK_ELEMS[t];if(!n||!a)throw new Error(`dequant: unsupported GGML type ${t}`);return this.dequantBlocked(n,r,e,a)}dequantBlockedGpu(t,r,e,n){let a=globalThis,s=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,i=e/n;if(!Number.isInteger(i))throw new Error(`${t}: nElems ${e} not a multiple of ${n}`);let o=r.byteLength%4===0?r:(()=>{let l=new Uint8Array(Math.ceil(r.byteLength/4)*4);return l.set(r),l})(),u=new Uint32Array(o.buffer,o.byteOffset,o.byteLength/4),c=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([i]));let f=this.device.createBuffer({size:e*4,usage:s});return this.dispatch(t,[c,this.bufU32(u,s),f],this.grid1D(i)),f}dequantizeToGpu(t,r,e){let n=globalThis,a=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST;if(t==="F32")return this.buf(new Float32Array(r.buffer,r.byteOffset,e),a);if(t==="F16"){let o=new DataView(r.buffer,r.byteOffset),u=new Float32Array(e);for(let c=0;c<e;c++)u[c]=ne(o.getUint16(c*2,!0));return this.buf(u,a)}if(t==="Q4W")return this.buf(se(fe(r,e)),a);if(t==="Q8W")return this.buf(le(ge(r,e)),a);if(t==="Q3W")return this.buf(qe(xe(r,e)),a);let s=I.DEQUANT_SHADER[t],i=I.BLOCK_ELEMS[t];if(!s||!i)throw new Error(`dequant: unsupported GGML type ${t}`);return this.dequantBlockedGpu(s,r,e,i)}async layerForward(t,r,e,n=!1){let{seq:a,d:s,nHeads:i,nKvHeads:o,headDim:u,ffn:c,ropeTheta:f,eps:l}=r,h=o*u,d=n?(_,T,R,D,L)=>this.matmulT(_,T,R,D,L):(_,T,R,D,L)=>this.matmul(_,T,R,D,L),p=i*u,m=r.rmsGainOnePlus===!0,v=r.attnLogitSoftcap??0,U=(_,T)=>r.act==="gelu"?this.geglu(_,T):this.swiglu(_,T),M=await this.rmsnorm(t,e.attnNorm,a,s,l,m),q=await d(M,e.wq,a,s,p),S=await d(M,e.wk,a,s,h),C=await d(M,e.wv,a,s,h);e.bq&&(q=await this.addBias(q,e.bq,a,p)),e.bk&&(S=await this.addBias(S,e.bk,a,h)),e.bv&&(C=await this.addBias(C,e.bv,a,h)),e.qNorm&&(q=await this.rmsnorm(q,e.qNorm,a*i,u,l,m)),e.kNorm&&(S=await this.rmsnorm(S,e.kNorm,a*o,u,l,m));let G=await this.rope(q,a*i,u,i,0,f),A=await this.rope(S,a*o,u,o,0,f),b=await this.attention(G,A,C,a,i,o,u,0,r.attnScale,v),k=await d(b,e.wo,a,p,s);e.postAttnNorm&&(k=await this.rmsnorm(k,e.postAttnNorm,a,s,l,m));let x=await this.add(t,k),y=await this.rmsnorm(x,e.ffnNorm,a,s,l,m),P=await d(y,e.wgate,a,s,c),w=await d(y,e.wup,a,s,c),B=await U(P,w),F=await d(B,e.wdown,a,c,s);return e.postFfnNorm&&(F=await this.rmsnorm(F,e.postFfnNorm,a,s,l,m)),this.add(x,F)}async layerForwardKV(t,r,e,n,a,s,i=!1){let{seq:o,d:u,nHeads:c,nKvHeads:f,headDim:l,ffn:h,ropeTheta:d,eps:p}=r,m=f*l,v=i?(W,Y,V,X,O)=>this.matmulT(W,Y,V,X,O):(W,Y,V,X,O)=>this.matmul(W,Y,V,X,O),U=(W,Y)=>{let V=new Float32Array(W.length+Y.length);return V.set(W),V.set(Y,W.length),V},M=c*l,q=r.rmsGainOnePlus===!0,S=r.attnLogitSoftcap??0,C=(W,Y)=>r.act==="gelu"?this.geglu(W,Y):this.swiglu(W,Y),G=await this.rmsnorm(t,e.attnNorm,o,u,p,q),A=await v(G,e.wq,o,u,M),b=await v(G,e.wk,o,u,m),k=await v(G,e.wv,o,u,m);e.bq&&(A=await this.addBias(A,e.bq,o,M)),e.bk&&(b=await this.addBias(b,e.bk,o,m)),e.bv&&(k=await this.addBias(k,e.bv,o,m)),e.qNorm&&(A=await this.rmsnorm(A,e.qNorm,o*c,l,p,q)),e.kNorm&&(b=await this.rmsnorm(b,e.kNorm,o*f,l,p,q));let x=await this.rope(A,o*c,l,c,n,d),y=await this.rope(b,o*f,l,f,n,d),P=U(a,y),w=U(s,k),B=await this.attention(x,P,w,o,c,f,l,n,r.attnScale,S),F=await v(B,e.wo,o,M,u);e.postAttnNorm&&(F=await this.rmsnorm(F,e.postAttnNorm,o,u,p,q));let _=await this.add(t,F),T=await this.rmsnorm(_,e.ffnNorm,o,u,p,q),R=await v(T,e.wgate,o,u,h),D=await v(T,e.wup,o,u,h),L=await C(R,D),E=await v(L,e.wdown,o,h,u);return e.postFfnNorm&&(E=await this.rmsnorm(E,e.postFfnNorm,o,u,p,q)),{out:await this.add(_,E),k:P,v:w}}storage(t){let r=this.bufferPool.get(t);if(r&&r.length){let n=r.pop();return this.pooled.delete(n),n}let e=this.device.createBuffer({size:t,usage:I.STORAGE_USAGE});return this.poolSize.set(e,t),e}release(t){for(let r of t){if(!r)continue;let e=this.poolSize.get(r);if(e!==void 0){if(this.pooled.has(r))continue;this.pooled.add(r);let a=this.bufferPool.get(e);a||(a=[],this.bufferPool.set(e,a)),a.push(r);continue}let n=this.uniformSize.get(r);if(n!==void 0){if(this.pooled.has(r))continue;this.pooled.add(r);let a=this.uniformPool.get(n);a||(a=[],this.uniformPool.set(n,a)),a.push(r);continue}r.destroy?.()}}uploadGpu(t){return t instanceof Float32Array?this.buf(t,I.STORAGE_USAGE):this.f16ToF32Gpu(t.f16,t.n)}uploadGpuF16(t){let r=new Uint16Array(t.length);for(let e=0;e<t.length;e++)r[e]=be(t[e]);return this.bufU16(r)}f32ToF16Gpu(t,r){let e=globalThis,n=Math.ceil(r/2),a=this.device.createBuffer({size:n*4,usage:I.STORAGE_USAGE}),s=this.device.createBuffer({size:16,usage:e.GPUBufferUsage.UNIFORM|e.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(s,0,new Uint32Array([n])),this.dispatch("packf16",[s,t,a],this.grid1D(n)),a}f32ToQ8Gpu(t,r){let e=globalThis,n=r/32,a=this.device.createBuffer({size:r,usage:I.STORAGE_USAGE}),s=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:I.STORAGE_USAGE}),i=this.device.createBuffer({size:16,usage:e.GPUBufferUsage.UNIFORM|e.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(i,0,new Uint32Array([n])),this.dispatch("quantize_q8",[i,t,a,s],this.grid1D(n)),{codes:a,sc:s}}f32ToQ4Gpu(t,r){let e=globalThis,n=r/32,a=this.device.createBuffer({size:r/2,usage:I.STORAGE_USAGE}),s=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:I.STORAGE_USAGE}),i=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:I.STORAGE_USAGE}),o=this.device.createBuffer({size:16,usage:e.GPUBufferUsage.UNIFORM|e.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(o,0,new Uint32Array([n])),this.dispatch("quantize_q4",[o,t,a,s,i],this.grid1D(n)),{nib:a,sc:s,mn:i}}uploadGpuRawF16(t){let r=Math.ceil(t.byteLength/4)*4,e=this.device.createBuffer({size:r,usage:I.STORAGE_USAGE});if(this.device.queue.writeBuffer(e,0,t,0,t.byteLength-t.byteLength%4),t.byteLength%4){let n=new Uint8Array(4);n.set(t.subarray(t.byteLength-t.byteLength%4)),this.device.queue.writeBuffer(e,t.byteLength-t.byteLength%4,n)}return e}bufU16(t){let r=this.device.createBuffer({size:t.byteLength,usage:I.STORAGE_USAGE});return this.device.queue.writeBuffer(r,0,t),r}uploadGpuRaw(t){let r=Math.ceil(t.byteLength/4)*4,e=this.device.createBuffer({size:r,usage:I.STORAGE_USAGE}),n=t.byteLength-t.byteLength%4;if(this.device.queue.writeBuffer(e,0,t,0,n),t.byteLength%4){let a=new Uint8Array(4);a.set(t.subarray(n)),this.device.queue.writeBuffer(e,n,a)}return e}async matmulQ4(t,r,e,n,a,s,i){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([a,s,i]));let f=this.device.createBuffer({size:a*i*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4",[c,this.buf(t,u),r,e,n,f],[Math.ceil(a/8),Math.ceil(i/8),1],f,a*i*4)}async matmulQ4Tiled(t,r,e,n,a,s,i){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([a,s,i]));let f=this.device.createBuffer({size:a*i*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_tiled",[c,this.buf(t,u),r,e,n,f],[Math.ceil(Math.ceil(a/4)/8),Math.ceil(i/8),1],f,a*i*4)}async matmulQ4Shared(t,r,e,n,a,s,i){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([a,s,i]));let f=this.device.createBuffer({size:a*i*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_shared",[c,this.buf(t,u),r,e,n,f],[Math.ceil(i/16),Math.ceil(a/16),1],f,a*i*4)}async matmulQ3(t,r,e,n,a,s,i,o){let u=globalThis,c=u.GPUBufferUsage.STORAGE|u.GPUBufferUsage.COPY_DST,f=this.device.createBuffer({size:16,usage:u.GPUBufferUsage.UNIFORM|u.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(f,0,new Uint32Array([s,i,o]));let l=this.device.createBuffer({size:s*o*4,usage:c|u.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q3",[f,this.buf(t,c),r,e,n,a,l],[Math.ceil(s/8),Math.ceil(o/8),1],l,s*o*4)}async rwkvWkv7(t,r,e,n,a,s,i,o,u){let c=globalThis,f=c.GPUBufferUsage.STORAGE|c.GPUBufferUsage.COPY_DST,l=this.device.createBuffer({size:8,usage:c.GPUBufferUsage.UNIFORM|c.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(l,0,new Uint32Array([o,u]));let h=this.device.createBuffer({size:t.byteLength,usage:f|c.GPUBufferUsage.COPY_SRC});this.device.queue.writeBuffer(h,0,t);let d=this.device.createBuffer({size:o*u*4,usage:f|c.GPUBufferUsage.COPY_SRC});this.dispatch("rwkv_wkv7",[l,this.buf(r,f),this.buf(e,f),this.buf(n,f),this.buf(a,f),this.buf(s,f),this.buf(i,f),h,d],this.grid1D(o*u));let p=await this.readBack(h,t.byteLength),m=await this.readBack(d,o*u*4);return h.destroy?.(),d.destroy?.(),{S:p,y:m}}async rwkvTokenShift(t,r,e,n){let a=globalThis,s=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,i=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(i,0,new Uint32Array([n]));let o=this.device.createBuffer({size:6*n*4,usage:s|a.GPUBufferUsage.COPY_SRC});this.dispatch("rwkv_token_shift",[i,this.buf(t,s),this.buf(r,s),this.buf(e,s),o],this.grid1D(n*6));let u=await this.readBack(o,6*n*4);return o.destroy?.(),u}async lfm2ShortConv(t,r,e,n,a){let s=globalThis,i=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,o=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([n,a]));let u=this.buf(r,i|s.GPUBufferUsage.COPY_SRC),c=this.device.createBuffer({size:n*4,usage:i|s.GPUBufferUsage.COPY_SRC});this.dispatch("lfm2_shortconv",[o,this.buf(t,i),this.buf(e,i),u,c],this.grid1D(n));let f=await this.readBack(c,n*4),l=await this.readBack(u,(a-1)*n*4);return c.destroy?.(),u.destroy?.(),{out:f,state:l}}async matmulQ8(t,r,e,n,a,s){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,a,s]));let c=this.device.createBuffer({size:n*s*4,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8",[u,this.buf(t,o),r,e,c],[Math.ceil(n/8),Math.ceil(s/8),1],c,n*s*4)}async matmulQ8Tiled(t,r,e,n,a,s){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,a,s]));let c=this.device.createBuffer({size:n*s*4,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_tiled",[u,this.buf(t,o),r,e,c],[Math.ceil(Math.ceil(n/4)/8),Math.ceil(s/8),1],c,n*s*4)}async matmulQ8Shared(t,r,e,n,a,s){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,a,s]));let c=this.device.createBuffer({size:n*s*4,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_shared",[u,this.buf(t,o),r,e,c],[Math.ceil(s/16),Math.ceil(n/16),1],c,n*s*4)}uniformOf(t){let r=globalThis,e=this.uniformPool.get(t);if(e&&e.length){let a=e.pop();return this.pooled.delete(a),a}let n=this.device.createBuffer({size:t,usage:r.GPUBufferUsage.UNIFORM|r.GPUBufferUsage.COPY_DST});return this.uniformSize.set(n,t),n}uniform(t,r){let e=this.uniformOf(32);if(this.device.queue.writeBuffer(e,0,new Uint32Array(t)),r){let n=Array.isArray(r.value)?r.value:[r.value];this.device.queue.writeBuffer(e,r.offset,new Float32Array(n))}return e}recMatmulT(t,r,e,n,a,s,i,o=!1){let u=this.uniform([a,s,i]),c=this.storage(a*i*4);return this.recordPass(t,this.matmulTShader(s,o),[u,e,n,c],[Math.ceil(a/8),Math.ceil(i/8),1]),r.push(u,c),c}recConv2dDirect(t,r,e,n,a,s,i,o,u,c,f,l,h){let d=Math.floor((i+2*h-c)/l)+1,p=Math.floor((o+2*h-f)/l)+1,m=u*d*p,v=this.uniformOf(48);if(this.device.queue.writeBuffer(v,0,new Uint32Array([s,i,o,u,c,f,l,h,d,p])),c===3&&f===3&&l===1&&h===1&&this.convTiledOk){let M=this.storage(m*4);return this.recordPass(t,"conv2d_3x3_tiled",[v,e,n,a,M],[Math.ceil(p/16),Math.ceil(d/16),u]),r.push(v,M),M}let U=this.storage(m*4);return this.recordPass(t,"conv2d_direct",[v,e,n,a,U],this.grid1D(m)),r.push(v,U),U}recConv2dDirectQ8(t,r,e,n,a,s,i,o,u,c,f,l,h){let d=Math.floor((i+2*h-c)/l)+1,p=Math.floor((o+2*h-f)/l)+1,m=u*d*p,v=this.uniformOf(48);this.device.queue.writeBuffer(v,0,new Uint32Array([s,i,o,u,c,f,l,h,d,p]));let U=this.storage(m*4);return this.recordPass(t,"conv2d_direct_q8",[v,e,n.codes,n.sc,a,U],this.grid1D(m)),r.push(v,U),U}recConv2dDirectQ4(t,r,e,n,a,s,i,o,u,c,f,l,h){let d=Math.floor((i+2*h-c)/l)+1,p=Math.floor((o+2*h-f)/l)+1,m=u*d*p,v=this.uniformOf(48);this.device.queue.writeBuffer(v,0,new Uint32Array([s,i,o,u,c,f,l,h,d,p]));let U=this.storage(m*4);return this.recordPass(t,"conv2d_direct_q4",[v,e,n.nib,n.sc,n.mn,a,U],this.grid1D(m)),r.push(v,U),U}recGroupNorm(t,r,e,n,a,s,i,o,u){let c=this.uniform([s,i,o],{offset:12,value:u}),f=this.storage(s*i*4);return this.recordPass(t,"group_norm",[c,e,n,a,f],[o,1,1]),r.push(c,f),f}recUnary(t,r,e,n,a){let s=this.storage(a*4);return this.recordPass(t,e,[n,s],this.grid1D(a)),r.push(s),s}recLayernorm(t,r,e,n,a,s,i,o){let u=this.uniform([s,i],{offset:8,value:o}),c=this.storage(s*i*4);return this.recordPass(t,"layernorm",[u,e,n,a,c],[Math.ceil(s/Z),1,1]),r.push(u,c),c}recAttentionFull(t,r,e,n,a,s,i,o,u,c,f){let l=this.uniform([s,i,o,u,c,0],{offset:24,value:[f??1/Math.sqrt(u),0]}),h=this.storage(s*i*u*4),d=s*i;return this.attnFullWgOk&&u<=192&&d<=65535?this.recordPass(t,"attention_full_wg",[l,e,n,a,h],[d,1,1]):this.recordPass(t,"attention_full",[l,e,n,a,h],[Math.ceil(d/Z),1,1]),r.push(l,h),h}recUpsample(t,r,e,n,a,s,i){let o=this.uniform([n,a,s,i]),u=n*(a*i)*(s*i),c=this.storage(u*4);return this.recordPass(t,"upsample_nearest",[o,e,c],this.grid1D(u)),r.push(o,c),c}recConcat(t,r,e,n,a,s,i){let o=this.storage((a+s)*i*4);return t.copyBufferToBuffer(e,0,o,0,a*i*4),t.copyBufferToBuffer(n,0,o,a*i*4,s*i*4),r.push(o),o}recAddChannelBias(t,r,e,n,a,s){let i=this.uniform([a,s]),o=this.storage(a*s*4);return this.recordPass(t,"add_channel_bias",[i,e,n,o],this.grid1D(a*s)),r.push(i,o),o}recTranspose(t,r,e,n,a){let s=this.uniform([n,a]),i=this.storage(n*a*4);return this.recordPass(t,"transpose2d",[s,e,i],this.grid1D(n*a)),r.push(s,i),i}recGegluSplit(t,r,e,n,a){let s=this.uniform([n,a]),i=this.storage(n*a*4);return this.recordPass(t,"geglu_split",[s,e,i],this.grid1D(n*a)),r.push(s,i),i}recVideoGather(t,r,e,n,a,s){let i=this.uniform([n,a,s]),o=this.storage(s*n*a*4);return this.recordPass(t,"video_motion_gather",[i,e,o],this.grid1D(s*n*a)),r.push(i,o),o}recVideoScatter(t,r,e,n,a,s,i){let o=this.uniform([a,s,i]),u=this.storage(a*s*i*4);return this.recordPass(t,"video_motion_scatter",[o,e,n,u],this.grid1D(a*s*i)),r.push(o,u),u}recVideoAddPe(t,r,e,n,a,s,i){let o=this.uniform([a,s,i]),u=this.storage(i*a*s*4);return this.recordPass(t,"video_add_pe",[o,e,n,u],this.grid1D(i*a*s)),r.push(o,u),u}recAttnTemporal(t,r,e,n,a,s,i,o,u){let c=this.uniform([s,i,o,u],{offset:16,value:1/Math.sqrt(u)}),f=this.storage(s*i*o*u*4);return this.recordPass(t,"attn_temporal",[c,e,n,a,f],this.grid1D(s*i*o)),r.push(c,f),f}recordingSession(){let t=this.device.createCommandEncoder(),r=[],e=n=>{if(n instanceof Float32Array){let a=this.uploadGpu(n);return r.push(a),a}return n};return{conv2d:(n,a,s,i,o,u,c,f,l,h,d)=>a&&a.nib?this.recConv2dDirectQ4(t,r,e(n),a,e(s),i,o,u,c,f,l,h,d):a&&a.codes?this.recConv2dDirectQ8(t,r,e(n),a,e(s),i,o,u,c,f,l,h,d):this.recConv2dDirect(t,r,e(n),e(a),e(s),i,o,u,c,f,l,h,d),groupNorm:(n,a,s,i,o,u,c)=>this.recGroupNorm(t,r,e(n),e(a),e(s),i,o,u,c),silu:(n,a)=>this.recUnary(t,r,"silu",e(n),a),quickGelu:(n,a)=>this.recUnary(t,r,"quick_gelu",e(n),a),gelu:(n,a)=>this.recUnary(t,r,"gelu",e(n),a),relu:(n,a)=>this.recUnary(t,r,"relu",e(n),a),add:(n,a,s)=>this.recBinary(t,r,"add",e(n),e(a),s),geglu:(n,a,s)=>this.recBinary(t,r,"geglu",e(n),e(a),s),matmulT:(n,a,s,i,o)=>this.recMM(t,r,e(n),a instanceof Float32Array?e(a):a,s,i,o,!1),addBias:(n,a,s,i)=>this.recAddBias(t,r,e(n),e(a),s,i),addChannelBias:(n,a,s,i)=>this.recAddChannelBias(t,r,e(n),e(a),s,i),attentionFull:(n,a,s,i,o,u,c,f)=>this.recAttentionFull(t,r,e(n),e(a),e(s),i,o,u,c,f),rope2d:(n,a,s,i,o,u)=>{let c=a instanceof Uint32Array?(()=>{let f=this.uploadGpuRaw(new Uint8Array(a.buffer,a.byteOffset,a.byteLength));return r.push(f),f})():a;return this.recRope2d(t,r,e(n),c,s,i,o,u)},attention:(n,a,s,i,o,u,c,f,l)=>this.recAttention(t,r,e(n),e(a),e(s),i,o,u,c,f,l),upsample:(n,a,s,i,o)=>this.recUpsample(t,r,e(n),a,s,i,o),layernorm:(n,a,s,i,o,u)=>this.recLayernorm(t,r,e(n),e(a),e(s),i,o,u),concat:(n,a,s,i,o)=>this.recConcat(t,r,e(n),e(a),s,i,o),transpose:(n,a,s)=>this.recTranspose(t,r,e(n),a,s),gegluSplit:(n,a,s)=>this.recGegluSplit(t,r,e(n),a,s),videoGather:(n,a,s,i)=>this.recVideoGather(t,r,e(n),a,s,i),videoScatter:(n,a,s,i,o)=>this.recVideoScatter(t,r,e(n),e(a),s,i,o),videoAddPe:(n,a,s,i,o)=>this.recVideoAddPe(t,r,e(n),e(a),s,i,o),attnTemporal:(n,a,s,i,o,u,c)=>this.recAttnTemporal(t,r,e(n),e(a),e(s),i,o,u,c),alloc:n=>{let a=this.storage(n);return r.push(a),a},copy:(n,a,s,i,o)=>{t.copyBufferToBuffer(s,i,n,a,o)},finish:async(n,a)=>{this.device.queue.submit([t.finish()]);let s=await this.readBack(n,a*4);return this.release(r),s},finishKeep:n=>{this.device.queue.submit([t.finish()]);let a=r.indexOf(n);return a>=0&&r.splice(a,1),this.release(r),n},finishKeepMany:n=>{this.device.queue.submit([t.finish()]);for(let a of n){let s=r.indexOf(a);s>=0&&r.splice(s,1)}return this.release(r),n}}}readGpu(t,r){return this.readBack(t,r*4)}trimPool(t=64<<20){let r=[...this.bufferPool.keys()].sort((n,a)=>a-n),e=0;for(let n of this.bufferPool.values())for(let a of n)e+=this.poolSize.get(a)??0;for(let n of r){let a=this.bufferPool.get(n);for(;a.length&&e>t;){let s=a.pop();this.pooled.delete(s),this.poolSize.delete(s),s.destroy?.(),e-=n}}}releaseGpu(t){this.release(t)}waitGpu(){return this.device.queue.onSubmittedWorkDone()}destroy(){try{this.device?.destroy?.()}catch{}this.bufferPool.clear(),this.uniformPool.clear()}f16ToF32Gpu(t,r){let e=this.uploadGpuRawF16(t),n=this.device.createBuffer({size:r*4,usage:I.STORAGE_USAGE}),a=this.uniformOf(16);return this.device.queue.writeBuffer(a,0,new Uint32Array([r])),this.dispatch("f16_to_f32",[a,e,n],this.grid1D(Math.ceil(r/2))),e.destroy?.(),this.release([a]),n}quantizeQ8Gpu(t){let r=t instanceof Float32Array?t.length:t.n;if(r%32!==0)return this.uploadGpu(t);let e=t instanceof Float32Array?this.buf(t,I.STORAGE_USAGE):this.f16ToF32Gpu(t.f16,r),n=this.f32ToQ8Gpu(e,r);return e.destroy?.(),n}async validateResidentOps(){let t=globalThis,r=x=>Float32Array.from({length:x},()=>(Math.random()*2-1)*.5),e=(x,y,P=.005)=>x.length===y.length&&x.every((w,B)=>Math.abs(w-y[B])<=P*(1+Math.abs(y[B]))),n=4,a=4,s=4,i=4,o=2,u=1e-5,c=i*a*s,f=r(n*a*s),l=r(i*n*9),h=r(i),d=r(i),p=r(i),m=await this.silu(await this.groupNorm(await this.conv2dDirect(f,l,h,n,a,s,i,3,3,1,1),d,p,i,a*s,o,u)),v=[],U=this.device.createCommandEncoder(),M=this.uploadGpu(f),q=this.uploadGpu(l),S=this.uploadGpu(h),C=this.uploadGpu(d),G=this.uploadGpu(p);v.push(M,q,S,C,G);let A=this.recConv2dDirect(U,v,M,q,S,n,a,s,i,3,3,1,1);A=this.recGroupNorm(U,v,A,C,G,i,a*s,o,u),A=this.recUnary(U,v,"silu",A,c);let b=this.device.createBuffer({size:c*4,usage:t.GPUBufferUsage.COPY_DST|t.GPUBufferUsage.MAP_READ});U.copyBufferToBuffer(A,0,b,0,c*4),this.device.queue.submit([U.finish()]),await b.mapAsync(t.GPUMapMode.READ);let k=new Float32Array(b.getMappedRange().slice(0));return b.unmap(),b.destroy(),this.release(v),e(k,m)?null:"resident_ops"}recMatmulQ4(t,r,e,n,a,s,i){let o=this.uniform([a,s,i]),u=this.storage(a*i*4);return a>=16?this.recordPass(t,"matmul_t_q4_shared",[o,e,n.nib,n.sc,n.mn,u],[Math.ceil(i/16),Math.ceil(a/16),1]):a>=2?this.recordPass(t,"matmul_t_q4_tiled",[o,e,n.nib,n.sc,n.mn,u],[Math.ceil(Math.ceil(a/4)/8),Math.ceil(i/8),1]):this.recordPass(t,"matmul_t_q4",[o,e,n.nib,n.sc,n.mn,u],[Math.ceil(a/8),Math.ceil(i/8),1]),r.push(o,u),u}recMatmulQ8(t,r,e,n,a,s,i){let o=this.uniform([a,s,i]),u=this.storage(a*i*4);return a>=16?this.recordPass(t,"matmul_t_q8_shared",[o,e,n.codes,n.sc,u],[Math.ceil(i/16),Math.ceil(a/16),1]):a>=2?this.recordPass(t,"matmul_t_q8_tiled",[o,e,n.codes,n.sc,u],[Math.ceil(Math.ceil(a/4)/8),Math.ceil(i/8),1]):this.recordPass(t,"matmul_t_q8",[o,e,n.codes,n.sc,u],[Math.ceil(a/8),Math.ceil(i/8),1]),r.push(o,u),u}recMatmulQ3(t,r,e,n,a,s,i){let o=this.uniform([a,s,i]),u=this.storage(a*i*4);return this.recordPass(t,"matmul_t_q3",[o,e,n.lo,n.hi,n.sc,n.mn,u],[Math.ceil(a/8),Math.ceil(i/8),1]),r.push(o,u),u}recMM(t,r,e,n,a,s,i,o){return n&&n.q3?this.recMatmulQ3(t,r,e,n,a,s,i):n&&n.nib?this.recMatmulQ4(t,r,e,n,a,s,i):n&&n.codes?this.recMatmulQ8(t,r,e,n,a,s,i):this.recMatmulT(t,r,e,n,a,s,i,o)}recRmsnorm(t,r,e,n,a,s,i,o=!1){let u=this.uniform([a,s,0,o?1:0],{offset:8,value:i}),c=this.storage(a*s*4);return this.recordPass(t,"rmsnorm",[u,e,n,c],[Math.ceil(a/Z),1,1]),r.push(u,c),c}recRope(t,r,e,n,a,s,i,o){let u=this.uniform([n,a,s,i],{offset:16,value:o}),c=this.storage(n*a*4);return this.recordPass(t,"rope",[u,e,c],[Math.ceil(n/Z),1,1]),r.push(u,c),c}recRopeMrope(t,r,e,n,a,s,i,o,u){let c=u[0],f=u[0]+u[1],l=this.uniform([a,s,i,c,f],{offset:20,value:o}),h=this.storage(a*s*4);return this.recordPass(t,"rope_mrope",[l,e,n,h],[Math.ceil(a/Z),1,1]),r.push(l,h),h}preparePositions(t,r){if(t.positions&&t.mropeSections){let e=this.storage(t.positions.byteLength);this.device.queue.writeBuffer(e,0,t.positions),r.push(e),t._posGpu=e}if(t.ropeFactors){let e=this.storage(t.ropeFactors.byteLength);this.device.queue.writeBuffer(e,0,t.ropeFactors),r.push(e),t._ffGpu=e}}recRope2d(t,r,e,n,a,s,i,o){let u=this.uniform([a,s,i,0],{offset:16,value:o}),c=this.storage(a*s*4);return this.recordPass(t,"rope_2d",[u,e,n,c],[Math.ceil(a/Z),1,1]),r.push(u,c),c}recRopeFactors(t,r,e,n,a,s,i,o,u){let c=this.uniform([a,s,i,o],{offset:16,value:u}),f=this.storage(a*s*4);return this.recordPass(t,"rope_factors",[c,e,n,f],[Math.ceil(a/Z),1,1]),r.push(c,f),f}recAttention(t,r,e,n,a,s,i,o,u,c,f,l,h=0){let d=this.uniform([s,i,o,u,c,f],{offset:24,value:[l??1/Math.sqrt(u),h]}),p=this.storage(s*i*u*4);return this.attnDecodeOk&&s*i<256&&u<=128?this.recordPass(t,"attention_decode",[d,e,n,a,p],[s*i,1,1]):this.recordPass(t,"attention",[d,e,n,a,p],[Math.ceil(s*i/Z),1,1]),r.push(d,p),p}recQuantizeKv(t,r,e,n,a,s,i,o,u){let c=this.uniform([s,i,o,u]);this.recordPass(t,"quantize_kv",[c,e,n,a],this.grid1D(s*i)),r.push(c)}recAttentionQ8(t,r,e,n,a,s,i,o,u,c,f,l,h,d,p=0){let m=this.uniform([o,u,c,f,l,h],{offset:24,value:[d??1/Math.sqrt(f),p]}),v=this.storage(o*u*f*4);return this.attnDecodeOk&&o*u<256&&f<=128?this.recordPass(t,"attention_decode_q8kv",[m,e,n,a,s,i,v],[o*u,1,1]):this.recordPass(t,"attention_q8kv",[m,e,n,a,s,i,v],[Math.ceil(o*u/Z),1,1]),r.push(m,v),v}recAddBias(t,r,e,n,a,s){let i=this.uniform([a,s]),o=this.storage(a*s*4);return this.recordPass(t,"addbias",[i,e,n,o],this.grid1D(a*s)),r.push(i,o),o}recBinary(t,r,e,n,a,s){let i=this.storage(s*4);return this.recordPass(t,e,[n,a,i],this.grid1D(s)),r.push(i),i}recLfm2ShortConv(t,r,e,n,a,s,i){let o=this.uniform([s,i]),u=this.storage(s*4);return this.recordPass(t,"lfm2_shortconv",[o,e,a,n,u],this.grid1D(s)),r.push(o,u),u}recordLayerKV(t,r,e,n,a,s,i){let o=i.k,u=i.v,{seq:c,d:f,nHeads:l,nKvHeads:h,headDim:d,ffn:p,ropeTheta:m,eps:v}=n,U=h*d,M=s+c,q=a.matF16===!0,S=l*d,C=n.rmsGainOnePlus===!0,G=n.attnLogitSoftcap??0,A=n.act==="gelu"?"geglu":"swiglu",b=this.recRmsnorm(t,r,e,a.attnNorm,c,f,v,C),k=this.recMM(t,r,b,a.wq,c,f,S,q),x=this.recMM(t,r,b,a.wk,c,f,U,q),y=this.recMM(t,r,b,a.wv,c,f,U,q);a.bq&&(k=this.recAddBias(t,r,k,a.bq,c,S)),a.bk&&(x=this.recAddBias(t,r,x,a.bk,c,U)),a.bv&&(y=this.recAddBias(t,r,y,a.bv,c,U)),a.qNorm&&(k=this.recRmsnorm(t,r,k,a.qNorm,c*l,d,v,C)),a.kNorm&&(x=this.recRmsnorm(t,r,x,a.kNorm,c*h,d,v,C));let P=n._posGpu,w=n._ffGpu,B=(V,X,O)=>P?this.recRopeMrope(t,r,V,P,X,d,O,m,n.mropeSections):w?this.recRopeFactors(t,r,V,w,X,d,O,s,m):this.recRope(t,r,V,X,d,O,s,m),F=B(k,c*l,l),_=B(x,c*h,h),T;if(i.kScale)this.recQuantizeKv(t,r,_,o,i.kScale,c,h,d,s),this.recQuantizeKv(t,r,y,u,i.vScale,c,h,d,s),T=this.recAttentionQ8(t,r,F,o,i.kScale,u,i.vScale,c,l,h,d,M,s,n.attnScale,G);else{let V=U*4;t.copyBufferToBuffer(_,0,o,s*V,c*V),t.copyBufferToBuffer(y,0,u,s*V,c*V),T=this.recAttention(t,r,F,o,u,c,l,h,d,M,s,n.attnScale,G)}let R=this.recMM(t,r,T,a.wo,c,S,f,q);a.postAttnNorm&&(R=this.recRmsnorm(t,r,R,a.postAttnNorm,c,f,v,C));let D=this.recBinary(t,r,"add",e,R,c*f),L=this.recRmsnorm(t,r,D,a.ffnNorm,c,f,v,C),E=this.recMM(t,r,L,a.wgate,c,f,p,q),j=this.recMM(t,r,L,a.wup,c,f,p,q),W=this.recBinary(t,r,A,E,j,c*p),Y=this.recMM(t,r,W,a.wdown,c,p,f,q);return a.postFfnNorm&&(Y=this.recRmsnorm(t,r,Y,a.postFfnNorm,c,f,v,C)),this.recBinary(t,r,"add",D,Y,c*f)}setKvQuant(t){this.kvQuant!==t&&(this.kvQuant=t,this.resetKvGpu())}resetKvGpu(){for(let t of this.kvGpu.values())t.k.destroy?.(),t.v.destroy?.(),t.kScale?.destroy?.(),t.vScale?.destroy?.();this.kvGpu.clear(),this.kvSession="";for(let t of this.bufferPool.values())for(let r of t)r.destroy?.();this.bufferPool.clear()}clearKvCache(){this.resetKvGpu()}ensureKv(t,r,e,n){let a=this.kvGpu.get(t);if(a&&a.cap>=r)return a;let s=Math.max(r,(a?.cap??0)+1024,1024),i=this.kvQuant,o=this.storage(s*e*(i?1:4)),u=this.storage(s*e*(i?1:4)),c=i?this.storage(s*n*4):void 0,f=i?this.storage(s*n*4):void 0;if(a){let h=this.device.createCommandEncoder();h.copyBufferToBuffer(a.k,0,o,0,a.cap*e*(i?1:4)),h.copyBufferToBuffer(a.v,0,u,0,a.cap*e*(i?1:4)),i&&a.kScale&&(h.copyBufferToBuffer(a.kScale,0,c,0,a.cap*n*4),h.copyBufferToBuffer(a.vScale,0,f,0,a.cap*n*4)),this.device.queue.submit([h.finish()]),a.k.destroy?.(),a.v.destroy?.(),a.kScale?.destroy?.(),a.vScale?.destroy?.()}let l={k:o,v:u,cap:s,kScale:c,vScale:f};return this.kvGpu.set(t,l),l}async runDecodeGpu(t,r,e,n,a,s){let{seq:i,d:o,nKvHeads:u,headDim:c,eps:f}=r,l=u*c,h=n+i;(s!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${s}" inconnue avec pastLen=${n} \u2014 cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=s);for(let q=0;q<e.length;q++)this.ensureKv(q,h,l,u);let d=[];this.preparePositions(r,d);let p=this.device.createCommandEncoder(),m=this.storage(t.byteLength);this.device.queue.writeBuffer(m,0,t),d.push(m);for(let q=0;q<e.length;q++){let S=this.kvGpu.get(q);m=this.recordLayerKV(p,d,m,{...r,seq:i},e[q],n,S)}let v=this.recRmsnorm(p,d,m,a,i,o,f,r.rmsGainOnePlus===!0),U=this.storage(o*4);p.copyBufferToBuffer(v,(i-1)*o*4,U,0,o*4),this.device.queue.submit([p.finish()]);let M=await this.readBack(U,o*4);return d.push(U),this.release(d),M}async decodeLogitsQ8(t,r,e,n,a,s,i,o){let u=globalThis,{seq:c,d:f,nKvHeads:l,headDim:h,eps:d}=r,p=l*h,m=n+c;(s!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${s}" inconnue avec pastLen=${n} \u2014 cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=s);for(let b=0;b<e.length;b++)this.ensureKv(b,m,p,l);let v=[];this.preparePositions(r,v);let U=this.device.createCommandEncoder(),M=this.storage(t.byteLength);this.device.queue.writeBuffer(M,0,t),v.push(M);for(let b=0;b<e.length;b++){let k=this.kvGpu.get(b);M=this.recordLayerKV(U,v,M,{...r,seq:c},e[b],n,k)}let q=this.recRmsnorm(U,v,M,a,c,f,d,r.rmsGainOnePlus===!0),S=this.storage(f*4);U.copyBufferToBuffer(q,(c-1)*f*4,S,0,f*4),v.push(S);let C=this.storage(o*4);v.push(C);for(let b of i){let k=this.recMM(U,v,S,b.w,1,f,b.rows,!1);U.copyBufferToBuffer(k,0,C,b.r0*4,b.rows*4)}let G=this.device.createBuffer({size:o*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});U.copyBufferToBuffer(C,0,G,0,o*4),this.device.queue.submit([U.finish()]),await G.mapAsync(u.GPUMapMode.READ);let A=new Float32Array(G.getMappedRange().slice(0));return G.unmap(),G.destroy(),this.release(v),A}async decodeTopKQ8(t,r,e,n,a,s,i,o,u,c,f,l=64){let h=globalThis,{seq:d,d:p,nKvHeads:m,headDim:v,eps:U}=r,M=m*v,q=n+d;(s!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${s}" inconnue avec pastLen=${n} \u2014 cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=s);for(let w=0;w<e.length;w++)this.ensureKv(w,q,M,m);let S=[];this.preparePositions(r,S);let C=this.device.createCommandEncoder(),G=this.storage(t.byteLength);this.device.queue.writeBuffer(G,0,t),S.push(G);for(let w=0;w<e.length;w++){let B=this.kvGpu.get(w);G=this.recordLayerKV(C,S,G,{...r,seq:d},e[w],n,B)}let A=this.recRmsnorm(C,S,G,a,d,p,U,r.rmsGainOnePlus===!0),b=this.storage(p*4);C.copyBufferToBuffer(A,(d-1)*p*4,b,0,p*4),S.push(b);let k=this.storage(o*4);S.push(k);for(let w of i){let B=this.recMM(C,S,b,w.w,1,p,w.rows,!1);C.copyBufferToBuffer(B,0,k,w.r0*4,w.rows*4)}if(f&&f>0){let w=this.uniform([o],{offset:4,value:f});this.recordPass(C,"softcap_logits",[w,k],this.grid1D(o)),S.push(w)}if(c&&c!==1&&u.length){let w=Uint32Array.from(u),B=this.bufU32(w,h.GPUBufferUsage.STORAGE|h.GPUBufferUsage.COPY_DST),F=this.uniform([w.length],{offset:4,value:c});this.recordPass(C,"penalize_logits",[F,B,k],this.grid1D(w.length)),S.push(F,B)}let x=this.storage(l*2*4);S.push(x);{let w=this.uniform([o,l]);this.recordPass(C,"top_k",[w,k,x],[1,1,1]),S.push(w)}let y=this.device.createBuffer({size:l*2*4,usage:h.GPUBufferUsage.COPY_DST|h.GPUBufferUsage.MAP_READ});C.copyBufferToBuffer(x,0,y,0,l*2*4),this.device.queue.submit([C.finish()]),await y.mapAsync(h.GPUMapMode.READ);let P=new Uint32Array(y.getMappedRange().slice(0));return y.unmap(),y.destroy(),this.release(S),{ids:P.slice(0,l),vals:new Float32Array(P.buffer,l*4,l)}}resetLfm2State(){for(let t of this.lfm2KvGpu.values())t.k.destroy?.(),t.v.destroy?.();for(let t of this.lfm2ConvGpu.values())t.destroy?.();this.lfm2KvGpu.clear(),this.lfm2ConvGpu.clear(),this.lfm2Session="";for(let t of this.bufferPool.values())for(let r of t)r.destroy?.();this.bufferPool.clear()}clearLfm2State(){this.resetLfm2State()}ensureLfm2Kv(t,r,e){let n=this.lfm2KvGpu.get(t);if(n&&n.cap>=r)return n;let a=Math.max(r,(n?.cap??0)+1024,1024),s=this.storage(a*e*4),i=this.storage(a*e*4);if(n){let u=this.device.createCommandEncoder();u.copyBufferToBuffer(n.k,0,s,0,n.cap*e*4),u.copyBufferToBuffer(n.v,0,i,0,n.cap*e*4),this.device.queue.submit([u.finish()]),n.k.destroy?.(),n.v.destroy?.()}let o={k:s,v:i,cap:a};return this.lfm2KvGpu.set(t,o),o}ensureLfm2Conv(t,r){let e=this.lfm2ConvGpu.get(t);return e||(e=this.storage(r*4),this.device.queue.writeBuffer(e,0,new Float32Array(r)),this.lfm2ConvGpu.set(t,e)),e}recordLfm2(t,r,e,n,a,s,i,o){let{D:u,nHeads:c,nKvHeads:f,headDim:l,ffn:h,eps:d,theta:p,lc:m}=a,v=f*l,U=c*l,M=v*4;for(let S=0;S<s.length;S++)s[S].conv?this.ensureLfm2Conv(S,(m-1)*u):this.ensureLfm2Kv(S,o+n,v);let q=null;for(let S=0;S<n;S++){let C=o+S,G=this.storage(u*4);this.device.queue.writeBuffer(G,0,e.subarray(S*u,(S+1)*u)),r.push(G);for(let A=0;A<s.length;A++){let b=s[A],k=this.recRmsnorm(t,r,G,b.attnNorm,1,u,d),x;if(b.conv){let _=this.recMM(t,r,k,b.inProj,1,u,3*u,!1),T=this.recLfm2ShortConv(t,r,_,this.lfm2ConvGpu.get(A),b.convW,u,m);x=this.recMM(t,r,T,b.outProj,1,u,u,!1)}else{let _=this.recMM(t,r,k,b.wq,1,u,U,!1),T=this.recMM(t,r,k,b.wk,1,u,v,!1),R=this.recMM(t,r,k,b.wv,1,u,v,!1);_=this.recRmsnorm(t,r,_,b.qNorm,c,l,d),T=this.recRmsnorm(t,r,T,b.kNorm,f,l,d),_=this.recRope(t,r,_,c,l,c,C,p),T=this.recRope(t,r,T,f,l,f,C,p);let D=this.lfm2KvGpu.get(A);t.copyBufferToBuffer(T,0,D.k,C*M,M),t.copyBufferToBuffer(R,0,D.v,C*M,M);let L=this.recAttention(t,r,_,D.k,D.v,1,c,f,l,C+1,C);x=this.recMM(t,r,L,b.wo,1,U,u,!1)}G=this.recBinary(t,r,"add",G,x,u);let y=this.recRmsnorm(t,r,G,b.ffnNorm,1,u,d),P=this.recMM(t,r,y,b.wgate,1,u,h,!1),w=this.recMM(t,r,y,b.wup,1,u,h,!1),B=this.recBinary(t,r,"swiglu",P,w,h),F=this.recMM(t,r,B,b.wdown,1,h,u,!1);G=this.recBinary(t,r,"add",G,F,u)}S===n-1&&(q=this.recRmsnorm(t,r,G,i,1,u,d))}return q}lfm2SessionReset(t,r){(t!==this.lfm2Session||r===0)&&(r>0&&console.error(`[lfm2] session "${t}" inconnue avec pastLen=${r} \u2014 \xE9tat perdu, sortie invalide. Repartir de pastLen 0.`),this.resetLfm2State(),this.lfm2Session=t)}async lfm2LogitsGpu(t,r,e,n,a,s,i,o){let u=globalThis;this.lfm2SessionReset(o,i);let c=[],f=this.device.createCommandEncoder(),l=this.recordLfm2(f,c,t,r,e,n,s,i),h=this.recMM(f,c,l,a,1,e.D,e.vocab,!1),d=this.device.createBuffer({size:e.vocab*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});f.copyBufferToBuffer(h,0,d,0,e.vocab*4),this.device.queue.submit([f.finish()]),await d.mapAsync(u.GPUMapMode.READ);let p=new Float32Array(d.getMappedRange().slice(0));return d.unmap(),d.destroy(),this.release(c),p}async lfm2TopKGpu(t,r,e,n,a,s,i,o,u,c,f=64){let l=globalThis;this.lfm2SessionReset(o,i);let h=[],d=this.device.createCommandEncoder(),p=this.recordLfm2(d,h,t,r,e,n,s,i),m=this.recMM(d,h,p,a,1,e.D,e.vocab,!1);if(c&&c!==1&&u.length){let q=Uint32Array.from(u),S=this.bufU32(q,l.GPUBufferUsage.STORAGE|l.GPUBufferUsage.COPY_DST),C=this.uniform([q.length],{offset:4,value:c});this.recordPass(d,"penalize_logits",[C,S,m],this.grid1D(q.length)),h.push(C,S)}let v=this.storage(f*2*4);h.push(v);{let q=this.uniform([e.vocab,f]);this.recordPass(d,"top_k",[q,m,v],[1,1,1]),h.push(q)}let U=this.device.createBuffer({size:f*2*4,usage:l.GPUBufferUsage.COPY_DST|l.GPUBufferUsage.MAP_READ});d.copyBufferToBuffer(v,0,U,0,f*2*4),this.device.queue.submit([d.finish()]),await U.mapAsync(l.GPUMapMode.READ);let M=new Uint32Array(U.getMappedRange().slice(0));return U.unmap(),U.destroy(),this.release(h),{ids:M.slice(0,f),vals:new Float32Array(M.buffer,f*4,f)}}async argmaxProjection(t,r,e,n,a=!1){let s=globalThis,i=[],o=this.device.createCommandEncoder(),u=this.storage(t.byteLength);this.device.queue.writeBuffer(u,0,t),i.push(u);let c=this.storage(n*4);i.push(c);for(let p of r){let m=this.recMatmulT(o,i,u,p.buf,1,e,p.rows,a);o.copyBufferToBuffer(m,0,c,p.r0*4,p.rows*4)}let f=this.storage(4),l=this.uniform([n]);i.push(f,l),this.recordPass(o,"argmax",[l,c,f],[1,1,1]);let h=this.device.createBuffer({size:4,usage:s.GPUBufferUsage.COPY_DST|s.GPUBufferUsage.MAP_READ});o.copyBufferToBuffer(f,0,h,0,4),this.device.queue.submit([o.finish()]),await h.mapAsync(s.GPUMapMode.READ);let d=new Uint32Array(h.getMappedRange().slice(0))[0];return h.unmap(),h.destroy(),this.release(i),d}async projectLogits(t,r,e,n,a=!1){let s=globalThis,i=[],o=this.device.createCommandEncoder(),u=this.storage(t.byteLength);this.device.queue.writeBuffer(u,0,t),i.push(u);let c=this.storage(n*4);i.push(c);for(let h of r){let d=this.recMatmulT(o,i,u,h.buf,1,e,h.rows,a);o.copyBufferToBuffer(d,0,c,h.r0*4,h.rows*4)}let f=this.device.createBuffer({size:n*4,usage:s.GPUBufferUsage.COPY_DST|s.GPUBufferUsage.MAP_READ});o.copyBufferToBuffer(c,0,f,0,n*4),this.device.queue.submit([o.finish()]),await f.mapAsync(s.GPUMapMode.READ);let l=new Float32Array(f.getMappedRange().slice(0));return f.unmap(),f.destroy(),this.release(i),l}async selfValidate(){this.validationFailure=null;let t=G=>(this.validationFailure=G,console.error("[selfValidate] FAILED at:",G,"(hasF16="+this.hasF16+")"),!1),r=(G,A)=>G.length===A.length&&G.every((b,k)=>Math.abs(b-A[k])<.001),e=G=>Float32Array.from({length:G},()=>Math.random()*2-1),n=3,a=4,s=5,i=e(n*a),o=e(a*s),u=new Float32Array(n*s);for(let G=0;G<n;G++)for(let A=0;A<s;A++){let b=0;for(let k=0;k<a;k++)b+=i[G*a+k]*o[k*s+A];u[G*s+A]=b}if(!r(await this.matmul(i,o,n,a,s),u))return t("matmul");{let G=(b,k,x,y,P)=>{let w=new Float32Array(x*P);for(let B=0;B<x;B++)for(let F=0;F<P;F++){let _=0;for(let T=0;T<y;T++)_+=b[B*y+T]*k[F*y+T];w[B*P+F]=_}return w},A=async(b,k,x)=>{let y=e(b*k),P=e(x*k);return r(await this.matmulT(y,P,b,k,x),G(y,P,b,k,x))};if(!await A(3,8,5))return t("matmulT.vec4(3,8,5)");if(!await A(1,16,7))return t("matmulT.vec4(1,16,7)");if(!await A(2,6,4))return t("matmulT.scalar(2,6,4)");if(this.hasF16){let y=e(16),P=e(112),w=this.uploadGpuF16(P),B=await this.matmulT(y,w,1,16,7,!0),F=new Float32Array(7);for(let L=0;L<7;L++){let E=0;for(let j=0;j<16;j++)E+=y[j]*P[L*16+j];F[L]=E}w.destroy?.();let _=L=>L.length===F.length&&L.every((E,j)=>Math.abs(E-F[j])<=.03*(1+Math.abs(F[j])));if(!_(B))return t("matmulT.f16");let T=this.uploadGpu(P),R=this.f32ToF16Gpu(T,112),D=await this.matmulT(y,R,1,16,7,!0);if(T.destroy?.(),R.destroy?.(),!_(D))return t("packf16")}}{let k=e(128),x=e(768),y=Ae(x),P=this.uploadGpuRaw(y.nibbles),w=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),B=this.uploadGpuRaw(new Uint8Array(y.mins.buffer,y.mins.byteOffset,y.mins.byteLength)),F=await this.matmulQ4(k,P,w,B,1,128,6),_=se(y),T=new Float32Array(6);for(let j=0;j<6;j++){let W=0;for(let Y=0;Y<128;Y++)W+=k[Y]*_[j*128+Y];T[j]=W}if(P.destroy?.(),w.destroy?.(),B.destroy?.(),!r(F,T))return t("matmulQ4");let R=this.uploadGpu(x),D=this.f32ToQ4Gpu(R,768),L=await this.matmulQ4(k,D.nib,D.sc,D.mn,1,128,6);if(R.destroy?.(),D.nib.destroy?.(),D.sc.destroy?.(),D.mn.destroy?.(),!(L.length===T.length&&L.every((j,W)=>Math.abs(j-T[W])<=.06*(1+Math.abs(T[W]))+.02)))return t("quantize_q4")}{let k=e(640),x=e(768),y=Re(x),P=this.uploadGpuRaw(new Uint8Array(y.lo.buffer,y.lo.byteOffset,y.lo.byteLength)),w=this.uploadGpuRaw(new Uint8Array(y.hi.buffer,y.hi.byteOffset,y.hi.byteLength)),B=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),F=this.uploadGpuRaw(new Uint8Array(y.mins.buffer,y.mins.byteOffset,y.mins.byteLength)),_=await this.matmulQ3(k,P,w,B,F,5,128,6),T=qe(y),R=new Float32Array(30);for(let D=0;D<5;D++)for(let L=0;L<6;L++){let E=0;for(let j=0;j<128;j++)E+=k[D*128+j]*T[L*128+j];R[D*6+L]=E}if(P.destroy?.(),w.destroy?.(),B.destroy?.(),F.destroy?.(),!r(_,R))return t("matmulQ3")}{let k=e(640),x=e(768),y=Ae(x),P=this.uploadGpuRaw(y.nibbles),w=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),B=this.uploadGpuRaw(new Uint8Array(y.mins.buffer,y.mins.byteOffset,y.mins.byteLength)),F=await this.matmulQ4Tiled(k,P,w,B,5,128,6),_=se(y),T=new Float32Array(30);for(let R=0;R<5;R++)for(let D=0;D<6;D++){let L=0;for(let E=0;E<128;E++)L+=k[R*128+E]*_[D*128+E];T[R*6+D]=L}if(P.destroy?.(),w.destroy?.(),B.destroy?.(),!r(F,T))return t("matmul_q4_tiled")}{let k=e(2560),x=e(2304),y=Ae(x),P=this.uploadGpuRaw(y.nibbles),w=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),B=this.uploadGpuRaw(new Uint8Array(y.mins.buffer,y.mins.byteOffset,y.mins.byteLength)),F=await this.matmulQ4Shared(k,P,w,B,20,128,18),_=se(y),T=new Float32Array(360);for(let R=0;R<20;R++)for(let D=0;D<18;D++){let L=0;for(let E=0;E<128;E++)L+=k[R*128+E]*_[D*128+E];T[R*18+D]=L}if(P.destroy?.(),w.destroy?.(),B.destroy?.(),!r(F,T))return t("matmul_q4_shared")}{let k=e(128),x=e(768),y=Ue(x),P=this.uploadGpuRaw(new Uint8Array(y.codes.buffer,y.codes.byteOffset,y.codes.byteLength)),w=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),B=await this.matmulQ8(k,P,w,1,128,6),F=le(y),_=new Float32Array(6);for(let L=0;L<6;L++){let E=0;for(let j=0;j<128;j++)E+=k[j]*F[L*128+j];_[L]=E}if(P.destroy?.(),w.destroy?.(),!r(B,_))return t("matmulQ8");let T=this.uploadGpu(x),R=this.f32ToQ8Gpu(T,768),D=await this.matmulQ8(k,R.codes,R.sc,1,128,6);if(T.destroy?.(),R.codes.destroy?.(),R.sc.destroy?.(),!r(D,_))return t("quantize_q8")}{let k=e(640),x=e(768),y=Ue(x),P=this.uploadGpuRaw(new Uint8Array(y.codes.buffer,y.codes.byteOffset,y.codes.byteLength)),w=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),B=await this.matmulQ8Tiled(k,P,w,5,128,6),F=le(y),_=new Float32Array(30);for(let T=0;T<5;T++)for(let R=0;R<6;R++){let D=0;for(let L=0;L<128;L++)D+=k[T*128+L]*F[R*128+L];_[T*6+R]=D}if(P.destroy?.(),w.destroy?.(),!r(B,_))return t("matmul_q8_tiled")}{let k=e(2560),x=e(2304),y=Ue(x),P=this.uploadGpuRaw(new Uint8Array(y.codes.buffer,y.codes.byteOffset,y.codes.byteLength)),w=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),B=await this.matmulQ8Shared(k,P,w,20,128,18),F=le(y),_=new Float32Array(360);for(let T=0;T<20;T++)for(let R=0;R<18;R++){let D=0;for(let L=0;L<128;L++)D+=k[T*128+L]*F[R*128+L];_[T*18+R]=D}if(P.destroy?.(),w.destroy?.(),!r(B,_))return t("matmul_q8_shared")}{let A=e(1632),b=new Uint8Array(A.buffer,A.byteOffset,A.byteLength),k=(x,y)=>x.length===y.length&&x.every((P,w)=>P===y[w]);if(!k(await this.quantizeToBytes("F32",b,1632,"q8"),await this.quantizeToBytes("F32",b,1632,"q8",256)))return t("quantize_chunk_q8");if(!k(await this.quantizeToBytes("F32",b,1632,"q4"),await this.quantizeToBytes("F32",b,1632,"q4",256)))return t("quantize_chunk_q4")}let c=2,f=8,l=e(c*f),h=e(f),d=new Float32Array(c*f);for(let G=0;G<c;G++){let A=0;for(let k=0;k<f;k++)A+=l[G*f+k]**2;let b=1/Math.sqrt(A/f+1e-5);for(let k=0;k<f;k++)d[G*f+k]=l[G*f+k]*b*h[k]}if(!r(await this.rmsnorm(l,h,c,f),d))return t("rmsnorm");if(!r(await this.rmsnorm(l,h,c,f,1e-5,!0),pe(l,h,c,f,1e-5,!0)))return t("rmsnorm.onePlus");let p=e(16),m=e(16),v=p.map((G,A)=>G/(1+Math.exp(-G))*m[A]);if(!r(await this.swiglu(p,m),v))return t("swiglu");let U=p.map((G,A)=>Ke(G)*m[A]);if(!r(await this.geglu(p,m),U))return t("geglu");let M=p.map((G,A)=>G+m[A]);if(!r(await this.add(p,m),M))return t("add");{let G=I.MAX_WG_DIM*Z+257,A=new Float32Array(G),b=new Float32Array(G),k=[0,1,Z-1,Z,I.MAX_WG_DIM*Z-1,I.MAX_WG_DIM*Z,G-1];for(let P of k)A[P]=P%7-3,b[P]=P%5-2;let x=await this.add(A,b),y=x.length===G;for(let P of k)Math.abs(x[P]-(A[P]+b[P]))>1e-5&&(y=!1);if(!y)return t("grid1D.add(2D)")}let q=(G,A,b=.003)=>G.length===A.length&&G.every((k,x)=>Math.abs(k-A[x])<=b*(1+Math.abs(A[x])));{let y=e(8);if(!q(await this.rope(y,2,4,2,1,1e4),Pe(y,2,4,2,1,1e4)))return t("rope")}{let y=e(384),P=new Float32Array(64/2).fill(1);if(!q(await this.ropeFactors(y,P,6,64,2,7,5e5),Pe(y,6,64,2,7,5e5)))return t("rope_factors.ones");let w=Float32Array.from({length:64/2},(B,F)=>1+F%5*.7);if(!q(await this.ropeFactors(y,w,6,64,2,7,5e5),ct(y,w,6,64,2,7,5e5)))return t("rope_factors")}{let b=[16,24,24],k=1e6,x=3,y=x*2,P=5,w=e(y*128),B=new Uint32Array(x*3);for(let R=0;R<x;R++){let D=P+R;B.set([D,D,D],R*3)}let F=new Uint32Array([5,5,5,5,6,9,5,7,5]),_=q(await this.ropeMrope(w,B,y,128,2,b,k),Pe(w,y,128,2,P,k)),T=q(await this.ropeMrope(w,F,y,128,2,b,k),ut(w,F,y,128,2,b,k));(!_||!T)&&(this.mropeOk=!1,console.error(`[selfValidate] rope_mrope KO sur ce GPU (${_?"positions 3D":"d\xE9g\xE9n\xE9r\xE9\u2260rope"}) \u2014 vision d\xE9sactiv\xE9e, chat texte intact.`))}{let P=e(32),w=e(32),B=e(32);if(!q(await this.attention(P,w,B,2,4,2,4,2),ve(P,w,B,2,4,2,4,2)))return t("attention");let F=.3,_=5;if(!q(await this.attention(P,w,B,2,4,2,4,2,F,_),ve(P,w,B,2,4,2,4,2,F,_)))return t("attention.softcap");{let T=await this.quantizeKvReadback(w,4,2,4),R=await this.quantizeKvReadback(B,4,2,4),D=await this.attentionQ8Kv(P,T.codes,T.scales,R.codes,R.scales,2,4,2,4,2),L=(V,X)=>{let O=new Float32Array(32);for(let z=0;z<4;z++)for(let N=0;N<2;N++){let $=X[z*2+N];for(let Q=0;Q<4;Q++){let K=z*2*4+N*4+Q,H=V[K>>2]>>(K&3)*8&255;O[K]=(H<128?H:H-256)*$}}return O},E=L(T.codes,T.scales),j=L(R.codes,R.scales),W=ve(P,E,j,2,4,2,4,2);if(!q(D,W,.005))return t("attention.q8kv");let Y=0;for(let V=0;V<w.length;V++)Y=Math.max(Y,Math.abs(E[V]-w[V]));if(Y>.05)return t("quantize_kv.error")}}{let G=b=>{this.attnDecodeOk=!1,console.error("[selfValidate] attention d\xE9codage HS sur ce GPU (\xE9tape :",b,") \u2192 repli kernels classiques (plus lents \xE0 contexte long, corrects)")},A=[{nT:1,nH:14,nKv:2,hd:64,past:300},{nT:10,nH:14,nKv:2,hd:64,past:173}];for(let b of A){if(!this.attnDecodeOk)break;let k=b.past+b.nT,x=e(b.nT*b.nH*b.hd),y=e(k*b.nKv*b.hd),P=e(k*b.nKv*b.hd);if(!q(await this.attentionDecode(x,y,P,b.nT,b.nH,b.nKv,b.hd,b.past),ve(x,y,P,b.nT,b.nH,b.nKv,b.hd,b.past))){G(`decode(nT=${b.nT})`);break}let w=await this.quantizeKvReadback(y,k,b.nKv,b.hd),B=await this.quantizeKvReadback(P,k,b.nKv,b.hd),F=await this.attentionQ8KvDecode(x,w.codes,w.scales,B.codes,B.scales,b.nT,b.nH,b.nKv,b.hd,b.past),_=await this.attentionQ8Kv(x,w.codes,w.scales,B.codes,B.scales,b.nT,b.nH,b.nKv,b.hd,b.past);if(!q(F,_,.005)){G(`decode.q8kv(nT=${b.nT})`);break}}if(this.attnDecodeOk){let w=e(64),B=e(350*8),F=e(350*8);q(await this.attentionDecode(w,B,F,2,4,2,8,173,.3,5),ve(w,B,F,2,4,2,8,173,.3,5))||G("decode.softcap")}if(this.attnDecodeOk){let w=e(256),B=e(9088),F=e(9088);q(await this.attentionDecode(w,B,F,1,2,1,128,70),ve(w,B,F,1,2,1,128,70))||G("decode.hd128")}}{let w={seq:3,d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},B={attnNorm:e(16),wq:e(256),wk:e(128),wv:e(128),wo:e(256),bq:e(16),bk:e(8),bv:e(8),ffnNorm:e(16),wgate:e(256),wup:e(256),wdown:e(256)},F=e(48);if(!q(await this.layerForward(F,w,B),De(F,w,B),.005))return t("layerForward")}{let B={seq:3,d:12,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6,attnScale:1/Math.sqrt(4),attnLogitSoftcap:5,act:"gelu",rmsGainOnePlus:!0},F={attnNorm:e(12),wq:e(192),wk:e(96),wv:e(96),wo:e(192),ffnNorm:e(12),wgate:e(192),wup:e(192),wdown:e(192),postAttnNorm:e(12),postFfnNorm:e(12)},_=e(36);if(!q(await this.layerForward(_,B,F),De(_,B,F),.005))return t("layerForward.gemma2")}{let B={seq:3,d:12,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e6,eps:1e-6},F={attnNorm:e(12),wq:e(192),wk:e(96),wv:e(96),wo:e(192),ffnNorm:e(12),wgate:e(192),wup:e(192),wdown:e(192),qNorm:e(4),kNorm:e(4)},_=e(36);if(!q(await this.layerForward(_,B,F),De(_,B,F),.005))return t("layerForward.qwen3")}{let A=new Uint8Array(720);for(let k=0;k<5;k++){let x=k*144,y=new DataView(A.buffer);y.setUint16(x,be(.005+Math.random()*.05),!0),y.setUint16(x+2,be(.001+Math.random()*.02),!0);for(let P=4;P<144;P++)A[x+P]=Math.random()*256|0}let b=await this.dequantizeQ4K(A,5*256);if(!q(b,rt(A,5),1e-4))return t("dequant.Q4_K")}{let G=F=>{let _=new Uint8Array(F);for(let T=0;T<F;T++)_[T]=Math.random()*256|0;return _},A=(F,_)=>{let T=new DataView(F.buffer),R=D=>_===210?D*210+208:D*_;for(let D=0;D*_<F.length;D++)T.setUint16(R(D),be(.005+Math.random()*.05),!0);return F},k=A(G(136),34);if(!q(await this.dequantizeByType("Q8_0",k,128),nt(k,4),1e-4))return t("dequant.Q8_0");let x=A(G(88),22);if(!q(await this.dequantizeByType("Q5_0",x,128),at(x,4),1e-4))return t("dequant.Q5_0");let y=A(G(840),210);if(!q(await this.dequantizeByType("Q6_K",y,4*256),ot(y,4),1e-4))return t("dequant.Q6_K");let P=A(G(72),18);if(!q(await this.dequantizeByType("Q4_0",P,128),st(P,4),1e-4))return t("dequant.Q4_0");let w=G(704),B=new DataView(w.buffer);for(let F=0;F<4;F++)B.setUint16(F*176,be(.005+Math.random()*.05),!0),B.setUint16(F*176+2,be(.001+Math.random()*.02),!0);if(!q(await this.dequantizeByType("Q5_K",w,4*256),it(w,4),1e-4))return t("dequant.Q5_K")}{let P={d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},w={attnNorm:e(16),wq:e(256),wk:e(128),wv:e(128),wo:e(256),bq:e(16),bk:e(8),bv:e(8),ffnNorm:e(16),wgate:e(256),wup:e(256),wdown:e(256)},B=e(48),_=(await this.layerForward(B,{...P,seq:3},w)).slice(32,48),T=new Float32Array(0),R=await this.layerForwardKV(B.slice(0,32),{...P,seq:2},w,0,T,T),D=await this.layerForwardKV(B.slice(32,48),{...P,seq:1},w,2,R.k,R.v);if(!q(D.out,_,.005))return t("layerForwardKV")}{let b=e(4),k=e(40),x=new Float32Array(10);for(let B=0;B<10;B++){let F=0;for(let _=0;_<4;_++)F+=b[_]*k[B*4+_];x[B]=F}let y=0;for(let B=1;B<10;B++)x[B]>x[y]&&(y=B);let P=this.uploadGpu(k),w=await this.argmaxProjection(b,[{buf:P,rows:10,r0:0}],4,10,!1);if(P.destroy?.(),w!==y)return t("argmaxProjection")}{let P={seq:4,d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},w={attnNorm:e(16),wq:e(256),wk:e(128),wv:e(128),wo:e(256),bq:e(16),bk:e(8),bv:e(8),ffnNorm:e(16),wgate:e(256),wup:e(256),wdown:e(256)},B=e(16),F=e(64),_=new Float32Array(0),T=await this.layerForwardKV(F,{...P,seq:4},w,0,_,_,!0),R=pe(T.out.slice(48,64),B,1,16,1e-6),D={attnNorm:this.uploadGpu(w.attnNorm),wq:this.uploadGpu(w.wq),wk:this.uploadGpu(w.wk),wv:this.uploadGpu(w.wv),wo:this.uploadGpu(w.wo),ffnNorm:this.uploadGpu(w.ffnNorm),wgate:this.uploadGpu(w.wgate),wup:this.uploadGpu(w.wup),wdown:this.uploadGpu(w.wdown),bq:this.uploadGpu(w.bq),bk:this.uploadGpu(w.bk),bv:this.uploadGpu(w.bv)},L=this.uploadGpu(B),E=this.kvQuant;this.kvQuant=!1,this.resetKvGpu();let j=await this.runDecodeGpu(F,{...P,seq:4},[D],0,L,"selftest-A");if(!q(j,R,.008))return this.resetKvGpu(),this.kvQuant=E,t("runDecodeGpu.prefill");await this.runDecodeGpu(F.slice(0,48),{...P,seq:3},[D],0,L,"selftest-B");let W=await this.runDecodeGpu(F.slice(48,64),{...P,seq:1},[D],3,L,"selftest-B");if(!q(W,R,.008))return this.resetKvGpu(),this.kvQuant=E,t("runDecodeGpu.decode");this.kvQuant=E,this.resetKvGpu();for(let Y of Object.values(D))Y?.destroy?.();L.destroy?.()}{let x=Float32Array.from({length:152064},()=>(Math.random()*2-1)*8),y=[...new Set(Array.from({length:40},()=>Math.floor(Math.random()*152064)))],P=x.slice();for(let O=0;O<152064;O++)P[O]=30*Math.tanh(P[O]/30);for(let O of y)P[O]=P[O]>0?P[O]/1.15:P[O]*1.15;let w=Array.from(P.keys()).sort((O,z)=>P[z]-P[O]).slice(0,64),B=globalThis,F=[],_=this.storage(152064*4);this.device.queue.writeBuffer(_,0,x),F.push(_);let T=this.device.createCommandEncoder(),R=this.uniform([152064],{offset:4,value:30});this.recordPass(T,"softcap_logits",[R,_],this.grid1D(152064));let D=this.bufU32(Uint32Array.from(y),B.GPUBufferUsage.STORAGE|B.GPUBufferUsage.COPY_DST),L=this.uniform([y.length],{offset:4,value:1.15});this.recordPass(T,"penalize_logits",[L,D,_],this.grid1D(y.length));let E=this.storage(512),j=this.uniform([152064,64]);this.recordPass(T,"top_k",[j,_,E],[1,1,1]),F.push(R,D,L,j,E);let W=this.device.createBuffer({size:512,usage:B.GPUBufferUsage.COPY_DST|B.GPUBufferUsage.MAP_READ});T.copyBufferToBuffer(E,0,W,0,512),this.device.queue.submit([T.finish()]),await W.mapAsync(B.GPUMapMode.READ);let Y=new Uint32Array(W.getMappedRange().slice(0));W.unmap(),W.destroy(),this.release(F);let V=Y.slice(0,64),X=new Float32Array(Y.buffer,256,64);this.topKOk=!0;for(let O=0;O<64;O++){let z=Math.abs(X[O]-P[w[O]])<=1e-4*(1+Math.abs(P[w[O]])),N=Math.abs(P[V[O]]-X[O])<=1e-4*(1+Math.abs(X[O]));if(!z||!N){this.topKOk=!1,console.error(`[selfValidate] top_k KO sur ce GPU (rang ${O}) \u2014 repli sur le sampling CPU plein-vocab (plus lent, m\xEAme r\xE9sultat).`);break}}}if(this.rwkvWkv7Ok){let k=e(128),x=e(16),y=e(16),P=e(16),w=e(16),B=e(16),F=Float32Array.from({length:16},()=>Math.random()*.5+.5),_=k.slice(),T=new Float32Array(16);for(let X=0;X<2;X++){let O=X*8;for(let z=0;z<8;z++){let N=X*8*8+z*8,$=P[O+z],Q=0;for(let H=0;H<8;H++)Q+=B[O+H]*_[N+H];let K=0;for(let H=0;H<8;H++){let J=F[O+H]*_[N+H]+$*y[O+H]+w[O+H]*Q;_[N+H]=J,K+=x[O+H]*J}T[O+z]=K}}let R=await this.rwkvWkv7(k.slice(),x,F,y,P,B,w,2,8),D=(X,O)=>X.length===O.length&&X.every((z,N)=>Math.abs(z-O[N])<=.001*(1+Math.abs(O[N])));!D(R.S,_)||!D(R.y,T)?(this.rwkvWkv7Ok=!1,console.error("[selfValidate] RWKV-7 WKV KO sur ce GPU \u2014 une archi RWKV (moteur v2) refuserait de charger (non bloquant pour le chat texte).")):console.log("[selfValidate] RWKV-7 WKV OK (r\xE9currence \xE0 \xE9tat fixe, moteur v2)");let L=16,E=e(L),j=e(L),W=e(L*6),Y=new Float32Array(L*6);for(let X=0;X<6;X++)for(let O=0;O<L;O++){let z=X*L+O;Y[z]=E[O]+(j[O]-E[O])*W[z]}let V=await this.rwkvTokenShift(E,j,W,L);D(V,Y)?console.log("[selfValidate] RWKV-7 token-shift OK"):(this.rwkvWkv7Ok=!1,console.error("[selfValidate] RWKV-7 token-shift KO sur ce GPU (non bloquant pour le chat texte)."))}if(this.lfm2ShortConvOk){let G=_=>Float32Array.from({length:_},()=>Math.random()*2-1),A=(_,T)=>_.length===T.length&&_.every((R,D)=>Math.abs(R-T[D])<=.001*(1+Math.abs(T[D]))),x=G(96),y=G(64),P=G(96),w=new Float32Array(32),B=y.slice();for(let _=0;_<32;_++){let T=x[_]*x[64+_],R=P[_*3+2]*T;for(let D=0;D<2;D++)R+=P[_*3+D]*y[D*32+_];for(let D=0;D+2<3;D++)B[D*32+_]=y[(D+1)*32+_];B[32+_]=T,w[_]=R*x[32+_]}let F=await this.lfm2ShortConv(x,y.slice(),P,32,3);!A(F.out,w)||!A(F.state,B)?(this.lfm2ShortConvOk=!1,console.error("[selfValidate] LFM2 shortconv KO sur ce GPU \u2014 une archi lfm2 refuserait de charger (non bloquant pour le reste).")):console.log("[selfValidate] LFM2 shortconv OK (conv courte gat\xE9e, moteur v2)")}let S=await this.validateDiffusion();S?console.warn("[selfValidate] image-gen primitive KO:",S,"(non bloquant \u2014 chemin texte intact)"):console.log("[selfValidate] image-gen primitives OK (silu, group_norm, conv2d, conv2d_direct, conv2d_direct_q8, relu, upsample_nearest, layernorm, quick_gelu, attention_full)");let C=await this.validateVideoResident();return C?(this.videoResidentOk=!1,console.warn("[selfValidate] motion r\xE9sident KO:",C,"\u2014 repli JS+readback (plus lent, m\xEAme r\xE9sultat).")):console.log("[selfValidate] motion r\xE9sident OK (video_motion_gather, video_motion_scatter, video_add_pe, attn_temporal)"),!0}async validateVideoResident(){let t=o=>Float32Array.from({length:o},()=>Math.random()*2-1),r=(o,u,c=.005)=>o.length===u.length&&o.every((f,l)=>Math.abs(f-u[l])<=c*(1+Math.abs(u[l])));{let o=t(120),u=new Float32Array(120);for(let l=0;l<5;l++)for(let h=0;h<3;h++)for(let d=0;d<8;d++)u[(l*3+h)*8+d]=o[(h*8+d)*5+l];let c=this.recordingSession(),f=await c.finish(c.videoGather(o,3,8,5),120);if(!r(f,u,1e-6))return"video_motion_gather"}{let o=t(120),u=t(120),c=new Float32Array(120);for(let h=0;h<3;h++)for(let d=0;d<8;d++)for(let p=0;p<5;p++)c[(h*8+d)*5+p]=o[(p*3+h)*8+d]+u[(h*8+d)*5+p];let f=this.recordingSession(),l=await f.finish(f.videoScatter(o,u,3,8,5),120);if(!r(l,c,1e-6))return"video_motion_scatter"}{let o=t(120),u=t(24),c=new Float32Array(120);for(let h=0;h<5;h++)for(let d=0;d<3;d++)for(let p=0;p<8;p++)c[(h*3+d)*8+p]=o[(h*3+d)*8+p]+u[d*8+p];let f=this.recordingSession(),l=await f.finish(f.videoAddPe(o,u,3,8,5),120);if(!r(l,c,1e-6))return"video_add_pe"}{let o=t(120),u=t(120),c=t(120),f=1/Math.sqrt(4),l=new Float32Array(120);for(let p=0;p<5;p++)for(let m=0;m<2;m++){let v=m*4,U=p*3;for(let M=0;M<3;M++){let q=(U+M)*8+v,S=new Float32Array(3),C=-1e30;for(let A=0;A<3;A++){let b=0,k=(U+A)*8+v;for(let x=0;x<4;x++)b+=o[q+x]*u[k+x];S[A]=b*f,S[A]>C&&(C=S[A])}let G=0;for(let A=0;A<3;A++)S[A]=Math.exp(S[A]-C),G+=S[A];for(let A=0;A<3;A++){let b=S[A]/G,k=(U+A)*8+v;for(let x=0;x<4;x++)l[q+x]+=b*c[k+x]}}}let h=this.recordingSession(),d=await h.finish(h.attnTemporal(o,u,c,5,3,2,4),120);if(!r(d,l))return"attn_temporal"}return null}async validateDiffusion(){let t=O=>Float32Array.from({length:O},()=>Math.random()*2-1),r=(O,z,N=.005)=>O.length===z.length&&O.every(($,Q)=>Math.abs($-z[Q])<=N*(1+Math.abs(z[Q]))),e=t(70),n=e.map(O=>O/(1+Math.exp(-O)));if(!r(await this.silu(e),n))return"silu";let a=4,s=5,i=2,o=1e-5,u=t(a*s),c=t(a),f=t(a),l=new Float32Array(a*s),h=a/i;for(let O=0;O<i;O++){let z=O*h*s,N=h*s,$=0;for(let H=0;H<N;H++)$+=u[z+H];$/=N;let Q=0;for(let H=0;H<N;H++){let J=u[z+H]-$;Q+=J*J}Q/=N;let K=1/Math.sqrt(Q+o);for(let H=0;H<N;H++){let J=O*h+Math.floor(H/s);l[z+H]=(u[z+H]-$)*K*c[J]+f[J]}}if(!r(await this.groupNorm(u,c,f,a,s,i,o),l))return"group_norm";let d=2,p=4,m=4,v=3,U=3,M=1,q=1,S=4,C=4,G=t(d*p*m),A=t(v*d*U*U),b=t(v),k=new Float32Array(v*S*C);for(let O=0;O<v;O++)for(let z=0;z<S;z++)for(let N=0;N<C;N++){let $=b[O];for(let Q=0;Q<d;Q++)for(let K=0;K<U;K++)for(let H=0;H<U;H++){let J=z*M+K-q,re=N*M+H-q;J>=0&&J<p&&re>=0&&re<m&&($+=G[Q*p*m+J*m+re]*A[((O*d+Q)*U+K)*U+H])}k[(O*S+z)*C+N]=$}if(!r(await this.conv2d(G,A,b,d,p,m,v,U,U,M,q),k))return"conv2d";if(!r(await this.conv2dDirect(G,A,b,d,p,m,v,U,U,M,q),k))return"conv2d_direct";{let Q=t(1200),K=t(108),H=t(4),J=await this.conv2dDirect(Q,K,H,3,20,20,4,3,3,1,1),re=this.convTiledOk;this.convTiledOk=!0;let ue=this.recordingSession(),de=await ue.finish(ue.conv2d(Q,K,H,3,20,20,4,3,3,1,1),1600);this.convTiledOk=re,r(de,J)||(this.convTiledOk=!1,console.warn("[selfValidate] conv2d_3x3_tiled KO sur ce GPU \u2014 repli sur conv2d_direct (plus lent, m\xEAme r\xE9sultat)."))}{let N=t(8*p*m),$=t(32*U*U),Q=t(4),K=Ue($),H=await this.conv2dDirect(N,le(K),Q,8,p,m,4,U,U,M,q),J={codes:this.uploadGpuRaw(new Uint8Array(K.codes.buffer,K.codes.byteOffset,K.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(K.scales.buffer,K.scales.byteOffset,K.scales.byteLength))},re=this.recordingSession(),ue=await re.finish(re.conv2d(N,J,Q,8,p,m,4,U,U,M,q),4*p*m);if(this.releaseGpu([J.codes,J.sc]),!r(ue,H))return"conv2d_direct_q8"}{let N=t(8*p*m),$=t(32*U*U),Q=t(4),K=Ae($),H=await this.conv2dDirect(N,se(K),Q,8,p,m,4,U,U,M,q),J={nib:this.uploadGpuRaw(K.nibbles),sc:this.uploadGpuRaw(new Uint8Array(K.scales.buffer,K.scales.byteOffset,K.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(K.mins.buffer,K.mins.byteOffset,K.mins.byteLength))},re=this.recordingSession(),ue=await re.finish(re.conv2d(N,J,Q,8,p,m,4,U,U,M,q),4*p*m);if(this.releaseGpu([J.nib,J.sc,J.mn]),!r(ue,H))return"conv2d_direct_q4"}{let z=t(66),N=new Uint16Array(66);for(let H=0;H<66;H++)N[H]=be(z[H]);let $=new Float32Array(66);for(let H=0;H<66;H++)$[H]=ne(N[H]);let Q=this.f16ToF32Gpu(new Uint8Array(N.buffer,N.byteOffset,N.byteLength),66),K=await this.readGpu(Q,66);if(Q.destroy?.(),!r(K,$,1e-6))return"f16_to_f32"}let x=t(70);if(!r(await this.relu(x),x.map(O=>Math.max(O,0))))return"relu";let y=2,P=2,w=2,B=2,F=P*B,_=w*B,T=t(y*P*w),R=new Float32Array(y*F*_);for(let O=0;O<y;O++)for(let z=0;z<F;z++)for(let N=0;N<_;N++)R[O*F*_+z*_+N]=T[O*P*w+Math.floor(z/B)*w+Math.floor(N/B)];if(!r(await this.upsampleNearest(T,y,P,w,B),R))return"upsample_nearest";let D=2,L=8,E=1e-5,j=t(D*L),W=t(L),Y=t(L),V=new Float32Array(D*L);for(let O=0;O<D;O++){let z=O*L,N=0;for(let K=0;K<L;K++)N+=j[z+K];N/=L;let $=0;for(let K=0;K<L;K++){let H=j[z+K]-N;$+=H*H}$/=L;let Q=1/Math.sqrt($+E);for(let K=0;K<L;K++)V[z+K]=(j[z+K]-N)*Q*W[K]+Y[K]}if(!r(await this.layernorm(j,W,Y,D,L,E),V))return"layernorm";let X=t(70);if(!r(await this.quickGelu(X),X.map(O=>O/(1+Math.exp(-1.702*O)))))return"quick_gelu";{let K=1/Math.sqrt(4),H=t(24),J=t(40),re=t(40),ue=new Float32Array(24);for(let de=0;de<2;de++)for(let _e=0;_e<3;_e++){let me=new Float32Array(5),Te=-1/0;for(let ee=0;ee<5;ee++){let we=0;for(let ce=0;ce<4;ce++)we+=H[_e*8+de*4+ce]*J[ee*8+de*4+ce];me[ee]=we*K,me[ee]>Te&&(Te=me[ee])}let Le=0;for(let ee=0;ee<5;ee++)me[ee]=Math.exp(me[ee]-Te),Le+=me[ee];for(let ee=0;ee<4;ee++){let we=0;for(let ce=0;ce<5;ce++)we+=me[ce]/Le*re[ce*8+de*4+ee];ue[_e*8+de*4+ee]=we}}if(!r(await this.attentionFull(H,J,re,3,2,2,4,5),ue))return"attention_full"}if(this.attnFullWgOk){let O=[{nT:70,kvL:70,nH:5,hd:64},{nT:16,kvL:77,nH:5,hd:64},{nT:9,kvL:9,nH:8,hd:160}];for(let z of O){let N=z.nH*z.hd,$=t(z.nT*N),Q=t(z.kvL*N),K=t(z.kvL*N),H=await this.attentionFull($,Q,K,z.nT,z.nH,z.nH,z.hd,z.kvL),J=await this.attentionFullWg($,Q,K,z.nT,z.nH,z.nH,z.hd,z.kvL);if(!r(J,H)){this.attnFullWgOk=!1,console.warn(`[selfValidate] attention_full_wg KO sur ce GPU (hd=${z.hd}, kv=${z.kvL}) \u2014 repli sur attention_full (plus lent, m\xEAme r\xE9sultat).`);break}}}return null}};I.MAX_WG_DIM=65535,I.BLOCK_ELEMS={Q4_K:256,Q5_K:256,Q6_K:256,Q8_0:32,Q5_0:32,Q4_0:32,F32:1,F16:1},I.DEQUANT_SHADER={Q4_K:"dequant_q4k",Q8_0:"dequant_q8_0",Q5_0:"dequant_q5_0",Q6_K:"dequant_q6k",Q4_0:"dequant_q4_0",Q5_K:"dequant_q5k"},I.STORAGE_USAGE=140;var Fe=I;function ne(g){let t=g>>15&1,r=g>>10&31,e=g&1023,n;return r===0?n=e*59604645e-15:r===31?n=65504:n=(1+e/1024)*2**(r-15),t===1?-n:n}function be(g){let t=new Float32Array(1),r=new Uint32Array(t.buffer);t[0]=g;let e=r[0],n=e>>16&32768,a=(e>>23&255)-127+15,s=e&8388607;return a<=0?n:a>=31?n|31743:(s=(s>>13)+(s>>12&1),s===1024&&(s=0,a+=1),n|a<<10|s&1023)}function rt(g,t){let r=new Float32Array(t*256),e=new DataView(g.buffer,g.byteOffset);for(let n=0;n<t;n++){let a=n*144,s=ne(e.getUint16(a,!0)),i=ne(e.getUint16(a+2,!0)),o=l=>{let h=d=>g[a+4+d];return l<4?[h(l)&63,h(l+4)&63]:[h(l+4)&15|h(l-4)>>6<<4,h(l+4)>>4|h(l)>>6<<4]},u=n*256,c=0,f=0;for(let l=0;l<256;l+=64){let[h,d]=o(c),p=s*h,m=i*d,[v,U]=o(c+1),M=s*v,q=i*U;for(let S=0;S<32;S++){let C=g[a+16+f+S];r[u+l+S]=p*(C&15)-m,r[u+l+32+S]=M*(C>>4)-q}f+=32,c+=2}}return r}function ke(g){return g>127?g-256:g}function nt(g,t){let r=new Float32Array(t*32),e=new DataView(g.buffer,g.byteOffset);for(let n=0;n<t;n++){let a=n*34,s=ne(e.getUint16(a,!0));for(let i=0;i<32;i++)r[n*32+i]=s*ke(g[a+2+i])}return r}function at(g,t){let r=new Float32Array(t*32),e=new DataView(g.buffer,g.byteOffset);for(let n=0;n<t;n++){let a=n*22,s=ne(e.getUint16(a,!0)),i=e.getUint32(a+2,!0);for(let o=0;o<16;o++){let u=g[a+6+o],c=i>>>o<<4&16,f=i>>>o+12&16;r[n*32+o]=s*((u&15|c)-16),r[n*32+o+16]=s*((u>>4|f)-16)}}return r}function st(g,t){let r=new Float32Array(t*32),e=new DataView(g.buffer,g.byteOffset);for(let n=0;n<t;n++){let a=n*18,s=ne(e.getUint16(a,!0));for(let i=0;i<16;i++){let o=g[a+2+i];r[n*32+i]=s*((o&15)-8),r[n*32+i+16]=s*((o>>4)-8)}}return r}function it(g,t){let r=new Float32Array(t*256),e=new DataView(g.buffer,g.byteOffset);for(let n=0;n<t;n++){let a=n*176,s=ne(e.getUint16(a,!0)),i=ne(e.getUint16(a+2,!0)),o=d=>{let p=m=>g[a+4+m];return d<4?[p(d)&63,p(d+4)&63]:[p(d+4)&15|p(d-4)>>6<<4,p(d+4)>>4|p(d)>>6<<4]},u=n*256,c=0,f=0,l=1,h=2;for(let d=0;d<256;d+=64){let[p,m]=o(c),v=s*p,U=i*m,[M,q]=o(c+1),S=s*M,C=i*q;for(let G=0;G<32;G++){let A=g[a+48+f+G],b=g[a+16+G];r[u+d+G]=v*((A&15)+(b&l?16:0))-U,r[u+d+32+G]=S*((A>>4)+(b&h?16:0))-C}f+=32,c+=2,l<<=2,h<<=2}}return r}function ot(g,t){let r=new Float32Array(t*256),e=new DataView(g.buffer,g.byteOffset);for(let n=0;n<t;n++){let a=n*210,s=ne(e.getUint16(a+208,!0)),i=n*256;for(let o=0;o<2;o++){let u=a+o*64,c=a+128+o*32,f=a+192+o*8,l=i+o*128;for(let h=0;h<32;h++){let d=h/16|0,p=g[u+h],m=g[u+h+32],v=g[c+h],U=(p&15|(v>>0&3)<<4)-32,M=(m&15|(v>>2&3)<<4)-32,q=(p>>4|(v>>4&3)<<4)-32,S=(m>>4|(v>>6&3)<<4)-32;r[l+h]=s*ke(g[f+d])*U,r[l+h+32]=s*ke(g[f+d+2])*M,r[l+h+64]=s*ke(g[f+d+4])*q,r[l+h+96]=s*ke(g[f+d+6])*S}}}return r}function ye(g,t,r,e,n){let a=new Float32Array(r*n);for(let s=0;s<r;s++)for(let i=0;i<n;i++){let o=0;for(let u=0;u<e;u++)o+=g[s*e+u]*t[u*n+i];a[s*n+i]=o}return a}function pe(g,t,r,e,n=1e-5,a=!1){let s=new Float32Array(r*e);for(let i=0;i<r;i++){let o=0;for(let c=0;c<e;c++)o+=g[i*e+c]**2;let u=1/Math.sqrt(o/e+n);for(let c=0;c<e;c++)s[i*e+c]=g[i*e+c]*u*(a?1+t[c]:t[c])}return s}function ut(g,t,r,e,n,a,s){let i=new Float32Array(g.length),o=e/2,u=a[0],c=a[0]+a[1];for(let f=0;f<r;f++){let l=Math.floor(f/n),h=f*e;for(let d=0;d<o;d++){let p=d<u?0:d<c?1:2,v=t[l*3+p]/s**(2*d/e),U=Math.cos(v),M=Math.sin(v),q=g[h+d],S=g[h+d+o];i[h+d]=q*U-S*M,i[h+d+o]=S*U+q*M}}return i}function ct(g,t,r,e,n,a=0,s=1e4){let i=new Float32Array(g.length),o=e/2;for(let u=0;u<r;u++){let c=a+Math.floor(u/n),f=u*e;for(let l=0;l<o;l++){let h=c/(s**(2*l/e)*t[l]),d=Math.cos(h),p=Math.sin(h),m=g[f+l],v=g[f+l+o];i[f+l]=m*d-v*p,i[f+l+o]=v*d+m*p}}return i}function Pe(g,t,r,e,n=0,a=1e4){let s=new Float32Array(g.length),i=r/2;for(let o=0;o<t;o++){let u=n+Math.floor(o/e),c=o*r;for(let f=0;f<i;f++){let l=u/a**(2*f/r),h=Math.cos(l),d=Math.sin(l),p=g[c+f],m=g[c+f+i];s[c+f]=p*h-m*d,s[c+f+i]=m*h+p*d}}return s}function Oe(g,t,r){return g.map((e,n)=>e+t[n%r])}function ve(g,t,r,e,n,a,s,i=0,o,u=0){let c=new Float32Array(e*n*s),f=o??1/Math.sqrt(s),l=d=>u>0?u*Math.tanh(d/u):d,h=n/a;for(let d=0;d<e;d++)for(let p=0;p<n;p++){let m=Math.floor(p/h),v=(d*n+p)*s,U=i+d,M=[],q=-1/0;for(let C=0;C<=U;C++){let G=(C*a+m)*s,A=0;for(let k=0;k<s;k++)A+=g[v+k]*t[G+k];let b=l(A*f);M[C]=b,b>q&&(q=b)}let S=0;for(let C=0;C<=U;C++)M[C]=Math.exp(M[C]-q),S+=M[C];for(let C=0;C<=U;C++){let G=M[C]/S,A=(C*a+m)*s;for(let b=0;b<s;b++)c[v+b]+=G*r[A+b]}}return c}function Ke(g){return .5*g*(1+Math.tanh(.7978845608*(g+.044715*g*g*g)))}function De(g,t,r){let{seq:e,d:n,nHeads:a,nKvHeads:s,headDim:i,ffn:o,ropeTheta:u,eps:c}=t,f=s*i,l=a*i,h=t.rmsGainOnePlus===!0,d=t.attnLogitSoftcap??0,p=pe(g,r.attnNorm,e,n,c,h),m=ye(p,r.wq,e,n,l),v=ye(p,r.wk,e,n,f),U=ye(p,r.wv,e,n,f);r.bq&&(m=Oe(m,r.bq,l)),r.bk&&(v=Oe(v,r.bk,f)),r.bv&&(U=Oe(U,r.bv,f)),r.qNorm&&(m=pe(m,r.qNorm,e*a,i,c,h)),r.kNorm&&(v=pe(v,r.kNorm,e*s,i,c,h));let M=Pe(m,e*a,i,a,0,u),q=Pe(v,e*s,i,s,0,u),S=ve(M,q,U,e,a,s,i,0,t.attnScale,d),C=ye(S,r.wo,e,l,n);r.postAttnNorm&&(C=pe(C,r.postAttnNorm,e,n,c,h));let G=g.map((P,w)=>P+C[w]),A=pe(G,r.ffnNorm,e,n,c,h),b=ye(A,r.wgate,e,n,o),k=ye(A,r.wup,e,n,o),x=t.act==="gelu"?b.map((P,w)=>Ke(P)*k[w]):b.map((P,w)=>P/(1+Math.exp(-P))*k[w]),y=ye(x,r.wdown,e,o,n);return r.postFfnNorm&&(y=pe(y,r.postFfnNorm,e,n,c,h)),G.map((P,w)=>P+y[w])}function Ne(g,t){let r=new DataView(g.buffer,g.byteOffset,g.byteLength),e=new Float32Array(t);for(let n=0;n<t;n++)e[n]=te(r.getUint16(n*2,!0));return e}function Ee(g,t){let r=new DataView(g.buffer,g.byteOffset,g.byteLength),e=new Float32Array(t);for(let n=0;n<t;n++)e[n]=r.getFloat32(n*4,!0);return e}function Ge(g,t,r,e){let n=0;for(let i=0;i<r;i++)n+=g[i]*g[i];let a=1/Math.sqrt(n/r+e),s=new Float32Array(r);for(let i=0;i<r;i++)s[i]=g[i]*a*t[i];return s}var ft=g=>g/(1+Math.exp(-g)),Se=class{constructor(t,r,e){this.engine=t;this.manifest=r;this.raw=e;this.w=new Map;this.g=new Map;this.pos=0;this.rLayers=[];this.tokNormGpu=null;this.normBufs=[];this.ffn=0}isBigProj(t){return/\.(shortconv\.(in_proj|out_proj)|attn_(q|k|v|output)|ffn_(gate|up|down))\.weight$/.test(t)}async load(t){if(!this.engine.lfm2ShortConvOk)throw new Error("kernel shortconv LFM2 invalid\xE9 sur ce GPU (selfValidate) \u2014 archi lfm2 refus\xE9e.");let r=this.manifest.arch;if(this.D=r.d,this.NH=r.nHeads,this.NKV=r.nKvHeads,this.HD=r.headDim,this.NL=r.blockCount,this.vocab=r.vocab,this.EPS=r.rmsEps,this.THETA=r.ropeTheta,!r.lfm2)throw new Error("manifest sans profil lfm2");this.LC=r.lfm2.lCache,this.convLayer=r.lfm2.kvHeadsPerLayer.map(e=>e===0),this.tok=t,this.stops=new Set(this.manifest.chat?.stopTokenIds?.length?this.manifest.chat.stopTokenIds:[7]);for(let[e,n]of Object.entries(this.manifest.tensors)){if(e==="token_embd.weight"){if(this.embedBytes=await this.raw(e),this.embedDtype=n.dtype,n.dtype==="q4"){let s=fe(this.embedBytes,n.nElems);this.g.set("head",{kind:"q4",nib:this.engine.uploadGpuRaw(s.nibbles),sc:this.up(s.scales),mn:this.up(s.mins),IN:this.D,OUT:this.vocab})}else if(n.dtype==="q8"){let s=ge(this.embedBytes,n.nElems);this.g.set("head",{kind:"q8",codes:this.upI8(s.codes),sc:this.up(s.scales),IN:this.D,OUT:this.vocab})}continue}let a=await this.raw(e);if(this.isBigProj(e)&&(n.dtype==="q4"||n.dtype==="q8")){let s=n.shape[0],i=n.nElems/s;if(n.dtype==="q8"){let o=ge(a,n.nElems);this.g.set(e,{kind:"q8",codes:this.upI8(o.codes),sc:this.up(o.scales),IN:s,OUT:i})}else{let o=fe(a,n.nElems);this.g.set(e,{kind:"q4",nib:this.engine.uploadGpuRaw(o.nibbles),sc:this.up(o.scales),mn:this.up(o.mins),IN:s,OUT:i})}}else this.w.set(e,n.dtype==="f32"?Ee(a,n.nElems):n.dtype==="f16"?Ne(a,n.nElems):n.dtype==="q8"?le(ge(a,n.nElems)):se(fe(a,n.nElems)))}this.buildResidentLayers(),this.reset()}buildResidentLayers(){let t=r=>{let e=this.engine.uploadGpu(this.w.get(r));return this.normBufs.push(e),e};this.tokNormGpu=t("token_embd_norm.weight"),this.ffn=this.g.get("blk.0.ffn_gate.weight")?.OUT??0,this.rLayers=[];for(let r=0;r<this.NL;r++){let e=`blk.${r}.`,n={attnNorm:t(e+"attn_norm.weight"),ffnNorm:t(e+"ffn_norm.weight"),wgate:this.g.get(e+"ffn_gate.weight"),wup:this.g.get(e+"ffn_up.weight"),wdown:this.g.get(e+"ffn_down.weight")};this.convLayer[r]?this.rLayers.push({conv:!0,...n,convW:t(e+"shortconv.conv.weight"),inProj:this.g.get(e+"shortconv.in_proj.weight"),outProj:this.g.get(e+"shortconv.out_proj.weight")}):this.rLayers.push({conv:!1,...n,qNorm:t(e+"attn_q_norm.weight"),kNorm:t(e+"attn_k_norm.weight"),wq:this.g.get(e+"attn_q.weight"),wk:this.g.get(e+"attn_k.weight"),wv:this.g.get(e+"attn_v.weight"),wo:this.g.get(e+"attn_output.weight")})}}residentAvailable(){return this.engine.lfm2ResidentOk!==!1&&!!this.g.get("head")&&this.rLayers.length===this.NL&&this.ffn>0}cfg(){return{D:this.D,nHeads:this.NH,nKvHeads:this.NKV,headDim:this.HD,ffn:this.ffn,eps:this.EPS,theta:this.THETA,lc:this.LC,vocab:this.vocab}}embedsFor(t){let r=this.D,e=new Float32Array(t.length*r);for(let n=0;n<t.length;n++)e.set(this.embedRow(t[n]),n*r);return e}async logitsGpu(t,r,e){return this.pos=r+t.length,this.engine.lfm2LogitsGpu(this.embedsFor(t),t.length,this.cfg(),this.rLayers,this.g.get("head"),this.tokNormGpu,r,e)}async topKGpu(t,r,e,n,a,s=40){return this.pos=r+t.length,this.engine.lfm2TopKGpu(this.embedsFor(t),t.length,this.cfg(),this.rLayers,this.g.get("head"),this.tokNormGpu,r,e,n,a,s)}up(t){return this.engine.uploadGpuRaw(new Uint8Array(t.buffer,t.byteOffset,t.byteLength))}upI8(t){return this.engine.uploadGpuRaw(new Uint8Array(t.buffer,t.byteOffset,t.byteLength))}unload(){for(let t of this.g.values())for(let r of["nib","sc","mn","codes"])t[r]?.destroy?.();for(let t of this.normBufs)t?.destroy?.();this.normBufs=[],this.rLayers=[],this.tokNormGpu=null,this.engine.clearLfm2State?.(),this.g.clear(),this.w.clear()}reset(){this.pos=0,this.state=Array.from({length:this.NL},(t,r)=>this.convLayer[r]?{conv:new Float32Array((this.LC-1)*this.D)}:{K:[],V:[]})}async gemm(t,r){let e=this.g.get(t);if(!e){let n=this.w.get(t==="head"?"token_embd.weight":t),a=n.length/r.length,s=new Float32Array(a);for(let i=0;i<a;i++){let o=0,u=i*r.length;for(let c=0;c<r.length;c++)o+=n[u+c]*r[c];s[i]=o}return s}return e.kind==="q8"?this.engine.matmulQ8(r,e.codes,e.sc,1,e.IN,e.OUT):this.engine.matmulQ4(r,e.nib,e.sc,e.mn,1,e.IN,e.OUT)}embedRow(t){let r=this.D;if(this.embedDtype==="f16")return Ne(this.embedBytes.subarray(t*r*2,t*r*2+r*2),r);if(this.embedDtype==="f32")return Ee(this.embedBytes.subarray(t*r*4,t*r*4+r*4),r);if(this.embedDtype==="q8"){let o=this.vocab*r,u=r/32,c=new Int8Array(this.embedBytes.buffer,this.embedBytes.byteOffset+t*r,r),f=this.embedBytes.subarray(o+t*u*2,o+t*u*2+u*2),l=new DataView(f.buffer,f.byteOffset,f.byteLength),h=new Float32Array(r);for(let d=0;d<u;d++){let p=te(l.getUint16(d*2,!0));for(let m=0;m<32;m++)h[d*32+m]=c[d*32+m]*p}return h}let e=this.vocab*r,n=r/32,a=e/2,s=e/2+e/32*2,i=new Uint8Array(r/2+n*2*2);return i.set(this.embedBytes.subarray(t*r/2,t*r/2+r/2),0),i.set(this.embedBytes.subarray(a+t*n*2,a+t*n*2+n*2),r/2),i.set(this.embedBytes.subarray(s+t*n*2,s+t*n*2+n*2),r/2+n*2),se(fe(i,r))}rope(t,r,e){let n=this.HD,a=t.slice();for(let s=0;s<r;s++){let i=s*n;for(let o=0;o<n/2;o++){let u=Math.pow(this.THETA,-2*o/n),c=Math.cos(e*u),f=Math.sin(e*u),l=t[i+o],h=t[i+o+n/2];a[i+o]=l*c-h*f,a[i+o+n/2]=l*f+h*c}}return a}async forwardToken(t){let r=this.D,e=this.pos++,n=this.embedRow(t);for(let a=0;a<this.NL;a++){let s=`blk.${a}.`,i=this.state[a],o=Ge(n,this.w.get(s+"attn_norm.weight"),r,this.EPS),u;if(this.convLayer[a]){let d=await this.gemm(s+"shortconv.in_proj.weight",o),p=await this.engine.lfm2ShortConv(d,i.conv,this.w.get(s+"shortconv.conv.weight"),r,this.LC);i.conv=p.state,u=await this.gemm(s+"shortconv.out_proj.weight",p.out)}else{let d=this.NKV*this.HD,p=await this.gemm(s+"attn_q.weight",o),m=await this.gemm(s+"attn_k.weight",o),v=await this.gemm(s+"attn_v.weight",o),U=this.w.get(s+"attn_q_norm.weight"),M=this.w.get(s+"attn_k_norm.weight");for(let A=0;A<this.NH;A++)p.set(Ge(p.slice(A*this.HD,(A+1)*this.HD),U,this.HD,this.EPS),A*this.HD);for(let A=0;A<this.NKV;A++)m.set(Ge(m.slice(A*this.HD,(A+1)*this.HD),M,this.HD,this.EPS),A*this.HD);p=this.rope(p,this.NH,e),m=this.rope(m,this.NKV,e),i.K.push(m),i.V.push(v);let q=new Float32Array(this.NH*this.HD),S=i.K.length,C=1/Math.sqrt(this.HD),G=this.NH/this.NKV;for(let A=0;A<this.NH;A++){let b=Math.floor(A/G),k=A*this.HD,x=b*this.HD,y=new Float32Array(S),P=-1e30;for(let B=0;B<S;B++){let F=0;for(let _=0;_<this.HD;_++)F+=p[k+_]*i.K[B][x+_];y[B]=F*C,y[B]>P&&(P=y[B])}let w=0;for(let B=0;B<S;B++)y[B]=Math.exp(y[B]-P),w+=y[B];for(let B=0;B<S;B++){let F=y[B]/w;for(let _=0;_<this.HD;_++)q[k+_]+=F*i.V[B][x+_]}}u=await this.gemm(s+"attn_output.weight",q)}for(let d=0;d<r;d++)n[d]+=u[d];let c=Ge(n,this.w.get(s+"ffn_norm.weight"),r,this.EPS),f=await this.gemm(s+"ffn_gate.weight",c),l=await this.gemm(s+"ffn_up.weight",c);for(let d=0;d<f.length;d++)f[d]=ft(f[d])*l[d];let h=await this.gemm(s+"ffn_down.weight",f);for(let d=0;d<r;d++)n[d]+=h[d]}return n=Ge(n,this.w.get("token_embd_norm.weight"),r,this.EPS),this.gemm("head",n)}async classify(t,r){this.reset();let e;for(let a of this.tok.encode(t))e=await this.forwardToken(a);let n=r.map(a=>{let s=this.tok.encode(a);return{label:a,logit:e[s[1]??s[0]]}}).sort((a,s)=>s.logit-a.logit);return{label:n[0].label,scores:n}}sampleTok(t,r,e){let{temperature:n=.8,topK:a=40,repeatPenalty:s=1.3}=e,i=new Set(r),o=[];for(let l=0;l<t.length;l++){let h=t[l];i.has(l)&&(h=h>0?h/s:h*s),o.push({i:l,v:h})}o.sort((l,h)=>h.v-l.v),o.length=a;let u=o[0].v,c=0;for(let l of o)l.p=Math.exp((l.v-u)/n),c+=l.p;let f=Math.random()*c;for(let l of o)if(f-=l.p,f<=0)return l.i;return o[0].i}async generate(t,r,e,n,a){this.reset();let s=this.tok.encode(t),i;for(let u of s)i=await this.forwardToken(u);let o=[];for(let u=0;u<r&&!n?.();u++){let c;if(a?.sample)c=this.sampleTok(i,o.slice(-64),a);else{c=0;for(let f=1;f<i.length;f++)i[f]>i[c]&&(c=f)}if(this.stops.has(c))break;o.push(c),e&&e(this.tok.decode(o)),i=await this.forwardToken(c)}return this.tok.decode(o)}async generateResident(t,r,e,n,a){if(!this.residentAvailable())return this.generate(t,r,e,n,a);let s="gen",i=this.tok.encode(t),o=await this.logitsGpu(i,0,s),u=i.length,c=[];for(let f=0;f<r&&!n?.();f++){let l;if(a?.sample)l=this.sampleTok(o,c.slice(-64),a);else{l=0;for(let h=1;h<o.length;h++)o[h]>o[l]&&(l=h)}if(this.stops.has(l))break;c.push(l),e&&e(this.tok.decode(c)),o=await this.logitsGpu([l],u,s),u++}return this.tok.decode(c)}};function je(g,t=16){return Math.ceil(g/t)*t}var lt="BRIK",Be=12;function dt(g){return je(Be+g)}function Ce(g){if(g.length<Be)throw new Error("BRIK: fichier tronqu\xE9 (en-t\xEAte)");let t=String.fromCharCode(g[0],g[1],g[2],g[3]);if(t!==lt)throw new Error(`BRIK: sceau magique absent (${t})`);let r=new DataView(g.buffer,g.byteOffset,g.byteLength),e=r.getUint32(4,!0),n=r.getUint32(8,!0);if(Be+n>g.length)throw new Error("BRIK: manifeste tronqu\xE9");return{manifest:JSON.parse(new TextDecoder().decode(g.subarray(Be,Be+n))),version:e,dataStart:dt(n)}}function Qe(g){let{manifest:t,version:r,dataStart:e}=Ce(g);return{manifest:t,version:r,dataStart:e,data:g.subarray(e)}}var ht={f16:"F16",f32:"F32",q4:"Q4W",q8:"Q8W",q3:"Q3W"};function We(g){let t=[...g].sort((n,a)=>n.id-a.id),r=[],e=0;for(let n of t)r[n.id]=e,e+=n.byteLength;return r}function Ye(g){let t=We(g.shards),r={};for(let[n,a]of Object.entries(g.tensors)){let s=ht[a.dtype];if(!s)throw new Error(`dtype BRIK inconnu pour ${n} : ${a.dtype}`);if(t[a.shard]===void 0)throw new Error(`shard ${a.shard} absent du manifeste (tenseur ${n})`);r[n]={offset:t[a.shard]+a.offset,bytes:a.byteLength,nElems:a.nElems,type:s,shape:a.shape}}let e=g.arch;return{arch:e.arch,config:{d:e.d,nHeads:e.nHeads,nKvHeads:e.nKvHeads,headDim:e.headDim,ffn:e.ffn,blockCount:e.blockCount,ropeTheta:e.ropeTheta,rmsEps:e.rmsEps,attnLogitSoftcap:e.attnLogitSoftcap,finalLogitSoftcap:e.finalLogitSoftcap,attnScale:e.attnScale,act:e.act,rmsGainOnePlus:e.rmsGainOnePlus,embedScale:e.embedScale,rwkv:e.rwkv,lfm2:e.lfm2},tensors:r}}var gt="brik-range-v1";function pt(g,t,r){return`${g}${g.includes("?")?"&":"?"}__brik=${t}-${r}`}async function mt(){try{return await caches.open(gt)}catch{return null}}async function Me(g,t,r,e){let n=t+r-1,a=await mt(),s=pt(g,t,n);if(a){let o=await a.match(s);if(o)return{bytes:new Uint8Array(await o.arrayBuffer()),ranged:!0}}let i;for(let o=0;o<4;o++)try{let u=await fetch(g,{headers:{Range:`bytes=${t}-${n}`},signal:e});if(!u.ok&&u.status!==206)throw new Error(`range fetch ${t}-${n} \xE9chou\xE9 : HTTP ${u.status}`);let c=u.status===206,f=new Uint8Array(await u.arrayBuffer()),l=c?f:f.subarray(t,t+r);if(a&&c)try{await a.put(s,new Response(l,{headers:{"Content-Length":String(l.byteLength)}}))}catch(h){Xe(h)}return{bytes:l,ranged:c}}catch(u){if(e?.aborted)throw u;i=u,o<3&&await new Promise(c=>setTimeout(c,500*2**o))}throw i instanceof Error?i:new Error(String(i))}var Ve=!1;function Xe(g){Ve||(Ve=!0,console.warn("[cache] \xE9criture refus\xE9e (quota plein ? navigation priv\xE9e ?) \u2014 les t\xE9l\xE9chargements de mod\xE8les ne seront PAS r\xE9utilisables \xE0 la prochaine visite. Lib\xE9rez de l'espace via le panneau Stockage.",g))}var $e="brimkern-model-cache";async function bt(g){try{let n=await(await caches.open($e)).match(g);if(n)return new Uint8Array(await n.arrayBuffer())}catch{}let t=await fetch(g);if(!t.ok)throw new Error(`HTTP ${t.status}`);let r=new Uint8Array(await t.arrayBuffer());try{await(await caches.open($e)).put(g,new Response(r.slice(),{headers:{"Content-Length":String(r.byteLength)}}))}catch(e){Xe(e)}return r}function yt(g,t){return{bytes:async(r,e)=>(await Me(g,t+r,e)).bytes}}function vt(g){return{bytes:async(t,r)=>g.subarray(t,t+r)}}async function Je(g){let t=await Me(g,0,12);if(!t.ranged){let s=await bt(g),{manifest:i,data:o}=Qe(s);return Ie(i,vt(o))}let r=new DataView(t.bytes.buffer,t.bytes.byteOffset,12).getUint32(8,!0),e=await Me(g,0,12+r),{manifest:n,dataStart:a}=Ce(e.bytes);return Ie(n,yt(g,a))}function Ie(g,t){if(g.model?.uiArch==="image")throw new Error("Ce fichier est un BRIK image (UNet/CLIP) \u2014 il se charge via la tuile de g\xE9n\xE9ration d'image, pas comme un LLM.");return{source:t,manifest:Ye(g),tokenizerId:g.tokenizer?.id,tokenizer:g.tokenizer,uiArch:g.model?.uiArch,modelName:g.model.name}}function Ze(g,t,r){let e="";if(t==="deepseek"){e+="<\uFF5Cbegin\u2581of\u2581sentence\uFF5C>",r.trim()&&(e+=r);for(let n of g)n.role==="user"?e+=`<\uFF5CUser\uFF5C>${n.content}`:n.role==="assistant"&&(e+=`<\uFF5CAssistant\uFF5C>${n.content}<\uFF5Cend\u2581of\u2581sentence\uFF5C>`);return e+="<\uFF5CAssistant\uFF5C>",e}if(t==="qwen"||t==="qwen3"||t==="lfm2"){r.trim()&&(e+=`<|im_start|>system
${r}<|im_end|>
`);for(let n of g)e+=`<|im_start|>${n.role}
${n.content}<|im_end|>
`;e+=`<|im_start|>assistant
`}else if(t==="llama3"){e+="<|begin_of_text|>",r.trim()&&(e+=`<|start_header_id|>system<|end_header_id|>

${r}<|eot_id|>`);for(let n of g)e+=`<|start_header_id|>${n.role}<|end_header_id|>

${n.content}<|eot_id|>`;e+=`<|start_header_id|>assistant<|end_header_id|>

`}else if(t==="mistral3"){e+="<s>",r.trim()&&(e+=`[SYSTEM_PROMPT]${r}[/SYSTEM_PROMPT]`);for(let n of g)n.role==="user"?e+=`[INST]${n.content}[/INST]`:n.role==="assistant"&&(e+=`${n.content}</s>`)}else if(t==="gemma"){r.trim()&&(e+=`<start_of_turn>model
${r}<end_of_turn>
`);for(let n of g)e+=`<start_of_turn>${n.role==="assistant"?"model":"user"}
${n.content}<end_of_turn>
`;e+=`<start_of_turn>model
`}return e}var wt="https://esm.sh/@huggingface/transformers@4.2.0",et={"lfm2.5-230m":"https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik"},At={F16:"f16",F32:"f32",Q4W:"q4",Q8W:"q8",Q3W:"q3"};async function Ut(g,t){let r=new Fe;if(!await r.init())throw new Error("WebGPU indisponible sur ce navigateur.");await r.selfValidate(),t("t\xE9l\xE9chargement du mod\xE8le\u2026");let e=await Je(g),n=e.manifest,a=n.tensors["token_embd.weight"],s={arch:{...n.config,arch:"lfm2",vocab:a?a.nElems/n.config.d:0},tensors:Object.fromEntries(Object.entries(n.tensors).map(([h,d])=>[h,{dtype:At[d.type]??d.type,shape:d.shape,nElems:d.nElems,shard:0,offset:d.offset,byteLength:d.bytes}])),shards:[{id:0,file:"",byteLength:0}],chat:{template:"chatml",stopTokenIds:[7]}},i=async h=>{let d=n.tensors[h];if(!d)throw new Error(`tenseur absent : ${h}`);return e.source.bytes(d.offset,d.bytes)};t("tokenizer\u2026");let u=await import(wt),c=new u.PreTrainedTokenizer(JSON.parse(e.tokenizer.json),JSON.parse(e.tokenizer.config)),f={encode:h=>Array.from(c(h).input_ids.data,d=>Number(d)),decode:h=>c.decode(h,{skip_special_tokens:!0})},l=new Se(r,s,i);return t("poids sur le GPU\u2026"),await l.load(f),l}function kt(g){if(document.getElementById("bk-style"))return;let t=document.createElement("style");t.id="bk-style",t.textContent=`
  .bk-fab{position:fixed;right:20px;bottom:20px;width:56px;height:56px;border-radius:16px;background:${g};color:#fff;border:none;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.25);font-size:24px;z-index:2147483000;display:flex;align-items:center;justify-content:center;transition:transform .15s}
  .bk-fab:hover{transform:translateY(-2px)}
  .bk-panel{position:fixed;right:20px;bottom:88px;width:360px;max-width:calc(100vw - 40px);height:520px;max-height:calc(100vh - 120px);background:#f2efe8;border:1px solid #e0dccf;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.28);z-index:2147483000;display:none;flex-direction:column;overflow:hidden;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;color:#1a1a1a}
  .bk-panel.bk-open{display:flex}
  .bk-hd{padding:12px 14px;background:#fff;border-bottom:1px solid #ece8dd;display:flex;align-items:center;gap:8px;font-weight:700;font-size:14px}
  .bk-hd .bk-dot{width:8px;height:8px;border-radius:50%;background:${g}}
  .bk-hd .bk-x{margin-left:auto;background:none;border:none;cursor:pointer;color:#8b887f;font-size:18px;line-height:1}
  .bk-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px}
  .bk-m{max-width:82%;padding:8px 12px;border-radius:12px;font-size:14px;line-height:1.45;white-space:pre-wrap;word-wrap:break-word}
  .bk-m.bk-u{align-self:flex-end;background:${g};color:#fff;border-bottom-right-radius:4px}
  .bk-m.bk-a{align-self:flex-start;background:#fff;border:1px solid #ece8dd;border-bottom-left-radius:4px}
  .bk-foot{padding:10px;border-top:1px solid #ece8dd;background:#fff;display:flex;gap:8px}
  .bk-in{flex:1;border:1px solid #e0dccf;border-radius:10px;padding:9px 11px;font-size:14px;font-family:inherit;background:#fff;color:#1a1a1a;resize:none;outline:none}
  .bk-in:focus{border-color:${g}}
  .bk-send{background:${g};color:#fff;border:none;border-radius:10px;padding:0 14px;cursor:pointer;font-size:14px}
  .bk-send:disabled{opacity:.5;cursor:default}
  .bk-note{font-size:10.5px;color:#8b887f;text-align:center;padding:4px 8px 8px}
  `,document.head.appendChild(t)}function tt(g){let t=g.accent||"#c72c1e",r=g.title||"Assistant",e=g.maxTokens||220;kt(t);let n=document.createElement("button");n.className="bk-fab",n.setAttribute("aria-label","Ouvrir le chat"),n.textContent="\u{1F4AC}";let a=document.createElement("div");a.className="bk-panel",a.innerHTML=`
    <div class="bk-hd"><span class="bk-dot"></span><span>${Pt(r)}</span><button class="bk-x" aria-label="Fermer">\xD7</button></div>
    <div class="bk-msgs"></div>
    <div class="bk-foot"><textarea class="bk-in" rows="1" placeholder="\xC9cris un message\u2026"></textarea><button class="bk-send">\u2191</button></div>
    <div class="bk-note">IA locale \u2014 tourne sur votre GPU, aucune donn\xE9e envoy\xE9e.</div>`,document.body.appendChild(n),document.body.appendChild(a);let s=a.querySelector(".bk-msgs"),i=a.querySelector(".bk-in"),o=a.querySelector(".bk-send"),u=[],c=!1,f=null,l=(m,v)=>{let U=document.createElement("div");return U.className=`bk-m ${m==="user"?"bk-u":"bk-a"}`,U.textContent=v,s.appendChild(U),s.scrollTop=s.scrollHeight,U},h=m=>{let v=s.querySelector(".bk-status")||l("assistant",m);v.classList.add("bk-status"),v.textContent=m};g.greeting&&(u.push({role:"assistant",content:g.greeting}),l("assistant",g.greeting));let d=()=>{if(!f){let m=g.model&&g.model.startsWith("http")?g.model:et[g.model||"lfm2.5-230m"]||et["lfm2.5-230m"],v=l("assistant","Initialisation\u2026");v.classList.add("bk-status"),f=Ut(m,U=>{v.textContent=U}).then(U=>(v.remove(),U)).catch(U=>{throw v.textContent="Erreur : "+(U?.message||U),f=null,U})}return f},p=async()=>{let m=i.value.trim();if(!m||c)return;c=!0,o.disabled=!0,i.value="",u.push({role:"user",content:m}),l("user",m);let v=l("assistant","\u2026");try{let U=await d(),M=Ze(u,"lfm2",g.system||""),q="";await(U.residentAvailable?.()?U.generateResident.bind(U):U.generate.bind(U))(M,e,C=>{q=C,v.textContent=C||"\u2026",s.scrollTop=s.scrollHeight},void 0,{sample:!0,temperature:.7,topK:40,repeatPenalty:1.3}),v.textContent=q||"(vide)",u.push({role:"assistant",content:q})}catch(U){v.textContent="Erreur : "+(U?.message||String(U))}finally{c=!1,o.disabled=!1,i.focus()}};n.onclick=()=>{a.classList.toggle("bk-open")&&(i.focus(),d())},a.querySelector(".bk-x").onclick=()=>a.classList.remove("bk-open"),o.onclick=()=>{p()},i.onkeydown=m=>{m.key==="Enter"&&!m.shiftKey&&(m.preventDefault(),p())}}function Pt(g){return g.replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t])}window.Brimkern={embed:(g={})=>{document.body?tt(g):window.addEventListener("DOMContentLoaded",()=>tt(g))}};})();
