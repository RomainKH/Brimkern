"use strict";(()=>{function he(h){let t=new Float32Array(1),r=new Uint32Array(t.buffer);t[0]=h;let e=r[0],n=e>>16&32768,i=(e>>23&255)-127+15,s=e&8388607;return i<=0?n:i>=31?n|31743:(s=(s>>13)+(s>>12&1),s===1024&&(s=0,i+=1),n|i<<10|s&1023)}function te(h){let t=h>>15&1,r=h>>10&31,e=h&1023,n;return r===0?n=e*59604645e-15:r===31?n=e?NaN:1/0:n=(1+e/1024)*2**(r-15),t===1?-n:n}var ie=32;function Ue(h){let t=h.length;if(t%ie!==0)throw new Error(`q4web: length ${t} not a multiple of ${ie}`);let r=t/ie,e=new Uint8Array(t/2),n=new Uint16Array(r),i=new Uint16Array(r);for(let s=0;s<r;s++){let a=s*ie,o=1/0,u=-1/0;for(let m=0;m<ie;m++){let p=h[a+m];p<o&&(o=p),p>u&&(u=p)}let c=(u-o)/15||1e-8,f=he(c),l=he(o);n[s]=f,i[s]=l;let g=te(f)||1e-8,d=te(l);for(let m=0;m<ie;m++){let p=Math.round((h[a+m]-d)/g);p=p<0?0:p>15?15:p;let w=a+m;(m&1)===0?e[w>>1]=p:e[w>>1]|=p<<4}}return{nibbles:e,scales:n,mins:i,nElems:t}}function fe(h,t){let r=t/ie,e=t/2,n=h.slice(0,e),i=new Uint16Array(r),s=new Uint16Array(r),a=new DataView(h.buffer,h.byteOffset);for(let o=0;o<r;o++)i[o]=a.getUint16(e+o*2,!0);for(let o=0;o<r;o++)s[o]=a.getUint16(e+r*2+o*2,!0);return{nibbles:n,scales:i,mins:s,nElems:t}}function se(h){let t=new Float32Array(h.nElems),r=h.nElems/ie;for(let e=0;e<r;e++){let n=te(h.scales[e]),i=te(h.mins[e]),s=e*ie;for(let a=0;a<ie;a++){let o=s+a,u=h.nibbles[o>>1],c=(a&1)===0?u&15:u>>4;t[o]=c*n+i}}return t}var ae=32;function Pe(h){let t=h.length;if(t%ae!==0)throw new Error(`q8web: length ${t} not a multiple of ${ae}`);let r=t/ae,e=new Int8Array(t),n=new Uint16Array(r);for(let i=0;i<r;i++){let s=i*ae,a=0;for(let f=0;f<ae;f++){let l=Math.abs(h[s+f]);l>a&&(a=l)}let o=a/127||1e-8,u=he(o);n[i]=u;let c=te(u)||1e-8;for(let f=0;f<ae;f++){let l=Math.round(h[s+f]/c);l=l<-127?-127:l>127?127:l,e[s+f]=l}}return{codes:e,scales:n,nElems:t}}function ge(h,t){let r=t/ae,e=new Int8Array(h.buffer.slice(h.byteOffset,h.byteOffset+t)),n=new Uint16Array(r),i=new DataView(h.buffer,h.byteOffset);for(let s=0;s<r;s++)n[s]=i.getUint16(t+s*2,!0);return{codes:e,scales:n,nElems:t}}function le(h){let t=new Float32Array(h.nElems),r=h.nElems/ae;for(let e=0;e<r;e++){let n=te(h.scales[e]),i=e*ae;for(let s=0;s<ae;s++)t[i+s]=h.codes[i+s]*n}return t}var oe=32;function Ee(h){let t=h.length;if(t%oe!==0)throw new Error(`q3web: length ${t} not a multiple of ${oe}`);let r=t/oe,e=new Uint32Array(t/16),n=new Uint32Array(t/32),i=new Uint16Array(r),s=new Uint16Array(r);for(let a=0;a<r;a++){let o=a*oe,u=1/0,c=-1/0;for(let p=0;p<oe;p++){let w=h[o+p];w<u&&(u=w),w>c&&(c=w)}let f=(c-u)/7||1e-8,l=he(f),g=he(u);i[a]=l,s[a]=g;let d=te(l)||1e-8,m=te(g);for(let p=0;p<oe;p++){let w=Math.round((h[o+p]-m)/d);w=w<0?0:w>7?7:w;let G=o+p;e[G>>4]|=(w&3)<<(G&15)*2,n[G>>5]|=w>>2<<(G&31)}}return{lo:e,hi:n,scales:i,mins:s,nElems:t}}function Fe(h,t){let r=t/oe,e=t/16,n=t/32,i=e*4,s=n*4,a=new DataView(h.buffer,h.byteOffset),o=new Uint32Array(e),u=new Uint32Array(n),c=new Uint16Array(r),f=new Uint16Array(r);for(let d=0;d<e;d++)o[d]=a.getUint32(d*4,!0);for(let d=0;d<n;d++)u[d]=a.getUint32(i+d*4,!0);let l=i+s,g=l+r*2;for(let d=0;d<r;d++)c[d]=a.getUint16(l+d*2,!0);for(let d=0;d<r;d++)f[d]=a.getUint16(g+d*2,!0);return{lo:o,hi:u,scales:c,mins:f,nElems:t}}function Se(h){let t=new Float32Array(h.nElems),r=h.nElems/oe;for(let e=0;e<r;e++){let n=te(h.scales[e]),i=te(h.mins[e]),s=e*oe;for(let a=0;a<oe;a++){let o=s+a,u=h.lo[o>>4]>>(o&15)*2&3|(h.hi[o>>5]>>(o&31)&1)<<2;t[o]=u*n+i}}return t}var je={matmul:`
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
		}`,lfm2_shortconv_batch:`
		struct Dims { d: u32, lc: u32, t: u32 };
		@group(0) @binding(0) var<uniform> dm: Dims;
		@group(0) @binding(1) var<storage, read> bcx: array<f32>;
		@group(0) @binding(2) var<storage, read> w: array<f32>;
		@group(0) @binding(3) var<storage, read> state: array<f32>;
		@group(0) @binding(4) var<storage, read_write> outv: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let idx = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			let D = dm.d; let LC = dm.lc; let T = dm.t;
			if (idx >= T * D) { return; }
			let t = idx / D; let i = idx % D;
			let row = 3u * D;
			var y = 0.0;
			for (var k = 0u; k < LC; k = k + 1u) {
				// indice DANS LE BATCH du token dont on lit bx (n\xE9gatif \u2192 \xE9tat entrant)
				let j = i32(t) + i32(k) - (i32(LC) - 1);
				var bx: f32;
				if (j < 0) {
					bx = state[u32(j + i32(LC) - 1) * D + i];
				} else {
					let b = u32(j) * row;
					bx = bcx[b + i] * bcx[b + 2u * D + i];
				}
				y = y + w[i * LC + k] * bx;
			}
			outv[idx] = y * bcx[t * row + D + i];
		}`,lfm2_shortconv_state:`
		struct Dims { d: u32, lc: u32, t: u32 };
		@group(0) @binding(0) var<uniform> dm: Dims;
		@group(0) @binding(1) var<storage, read> bcx: array<f32>;
		@group(0) @binding(2) var<storage, read_write> state: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let idx = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			let D = dm.d; let LC = dm.lc; let T = dm.t;
			if (idx >= (LC - 1u) * D) { return; }
			let k = idx / D; let i = idx % D;
			let j = T + k + 1u - LC;
			let b = j * 3u * D;
			state[idx] = bcx[b + i] * bcx[b + 2u * D + i];
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
		}`},Qe=`
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
	}`;var Z=64,I=class I{constructor(){this.device=null;this.modules={};this.pipelines={};this.maxStorageBufferBindingSize=0;this.hasF16=!1;this.validationFailure=null;this.lost=!1;this.onLost=null;this.attnDecodeOk=!0;this.attnFullWgOk=!0;this.mropeOk=!0;this.rwkvWkv7Ok=!0;this.lfm2ShortConvOk=!0;this.lfm2ResidentOk=!0;this.lfm2BatchOk=!0;this.videoOk=!0;this.videoResidentOk=!0;this.bufferPool=new Map;this.poolSize=new WeakMap;this.pooled=new WeakSet;this.uniformPool=new Map;this.uniformSize=new WeakMap;this.convTiledOk=!0;this.kvGpu=new Map;this.topKOk=!0;this.kvSession="";this.kvQuant=!1;this.lfm2KvGpu=new Map;this.lfm2ConvGpu=new Map;this.lfm2Session=""}async init(){let t=navigator.gpu;if(!t)return!1;let r=await t.requestAdapter();if(!r)return!1;let e=r.limits,n={maxStorageBufferBindingSize:e.maxStorageBufferBindingSize,maxBufferSize:e.maxBufferSize},i=[];try{r.features?.has("shader-f16")&&i.push("shader-f16")}catch{}try{this.device=await r.requestDevice({requiredLimits:n,requiredFeatures:i})}catch{try{this.device=await r.requestDevice({requiredLimits:n})}catch{this.device=await r.requestDevice()}}this.maxStorageBufferBindingSize=this.device.limits?.maxStorageBufferBindingSize??134217728,this.hasF16=!!this.device.features?.has?.("shader-f16");try{typeof location<"u"&&new URLSearchParams(location.search).get("attndecode")==="0"&&(this.attnDecodeOk=!1,console.warn("[webgpu] attention d\xE9codage COUP\xC9E par ?attndecode=0 \u2014 kernels classiques")),typeof location<"u"&&new URLSearchParams(location.search).get("attnfullwg")==="0"&&(this.attnFullWgOk=!1,console.warn("[webgpu] attention_full workgroup COUP\xC9E par ?attnfullwg=0 \u2014 kernel classique")),typeof location<"u"&&new URLSearchParams(location.search).get("rwkv")==="0"&&(this.rwkvWkv7Ok=!1,console.warn("[webgpu] kernel RWKV-7 WKV COUP\xC9 par ?rwkv=0")),typeof location<"u"&&new URLSearchParams(location.search).get("lfm2")==="0"&&(this.lfm2ShortConvOk=!1,console.warn("[webgpu] kernel shortconv LFM2 COUP\xC9 par ?lfm2=0")),typeof location<"u"&&new URLSearchParams(location.search).get("lfm2resident")==="0"&&(this.lfm2ResidentOk=!1,console.warn("[webgpu] LFM2 r\xE9sident COUP\xC9 par ?lfm2resident=0 \u2014 forwardToken JS+readback")),typeof location<"u"&&new URLSearchParams(location.search).get("lfm2batch")==="0"&&(this.lfm2BatchOk=!1,console.warn("[webgpu] prefill LFM2 batch\xE9 COUP\xC9 par ?lfm2batch=0 \u2014 token par token")),typeof location<"u"&&new URLSearchParams(location.search).get("video")==="0"&&(this.videoOk=!1,console.warn("[webgpu] chemin vid\xE9o (module motion) COUP\xC9 par ?video=0")),typeof location<"u"&&new URLSearchParams(location.search).get("videoresident")==="0"&&(this.videoResidentOk=!1,console.warn("[webgpu] motion r\xE9sident COUP\xC9 par ?videoresident=0 \u2014 chemin JS+readback"))}catch{}this.device.lost?.then?.(s=>{this.lost=!0,console.warn("[webgpu] device GPU perdu :",s?.reason||"unknown",s?.message||""),this.onLost?.(s)});for(let[s,a]of Object.entries(je))this.modules[s]=this.device.createShaderModule({code:a});return this.hasF16&&(this.modules.matmul_t_f16w=this.device.createShaderModule({code:Qe})),!0}buf(t,r){let e=this.device.createBuffer({size:t.byteLength,usage:r});return this.device.queue.writeBuffer(e,0,t),e}bufU32(t,r){let e=this.device.createBuffer({size:t.byteLength,usage:r});return this.device.queue.writeBuffer(e,0,t),e}async readBack(t,r){let e=globalThis,n=this.device.createBuffer({size:r,usage:e.GPUBufferUsage.COPY_DST|e.GPUBufferUsage.MAP_READ}),i=this.device.createCommandEncoder();i.copyBufferToBuffer(t,0,n,0,r),this.device.queue.submit([i.finish()]),await n.mapAsync(e.GPUMapMode.READ);let s=new Float32Array(n.getMappedRange().slice(0));return n.unmap(),n.destroy(),s}async readBackBytes(t,r){let e=globalThis,n=Math.ceil(r/4)*4,i=this.device.createBuffer({size:n,usage:e.GPUBufferUsage.COPY_DST|e.GPUBufferUsage.MAP_READ}),s=this.device.createCommandEncoder();s.copyBufferToBuffer(t,0,i,0,n),this.device.queue.submit([s.finish()]),await i.mapAsync(e.GPUMapMode.READ);let a=new Uint8Array(i.getMappedRange().slice(0,r));return i.unmap(),i.destroy(),a}async quantizeToBytes(t,r,e,n,i){let s=e/32,a=n==="q8"?new Uint8Array(e+s*2):new Uint8Array(e/2+s*4),o=I.BLOCK_ELEMS[t]??1,u=e/o,c=r.byteLength/u,f=(m,p)=>p===0?m:f(p,m%p),l=o*32/f(o,32),g=Math.floor(this.maxStorageBufferBindingSize*.9/4),d=i??g;d=Math.max(l,Math.floor(d/l)*l);for(let m=0;m<e;m+=d){let p=Math.min(d,e-m),w=r.slice(m/o*c,(m+p)/o*c),G=this.dequantizeToGpu(t,w,p);try{if(n==="q8"){let{codes:D,sc:F}=this.f32ToQ8Gpu(G,p),S=await this.readBackBytes(D,p),M=await this.readBackBytes(F,p/32*2);D.destroy?.(),F.destroy?.(),a.set(S,m),a.set(M,e+m/32*2)}else{let{nib:D,sc:F,mn:S}=this.f32ToQ4Gpu(G,p),M=await this.readBackBytes(D,p/2),U=await this.readBackBytes(F,p/32*2),v=await this.readBackBytes(S,p/32*2);D.destroy?.(),F.destroy?.(),S.destroy?.(),a.set(M,m/2),a.set(U,e/2+m/32*2),a.set(v,e/2+s*2+m/32*2)}}finally{G.destroy?.()}}return a}pipeline(t){let r=this.pipelines[t];return r||(r=this.device.createComputePipeline({layout:"auto",compute:{module:this.modules[t],entryPoint:"main"}}),this.pipelines[t]=r),r}grid1D(t){let r=Math.ceil(t/Z);if(r<=I.MAX_WG_DIM)return[r,1,1];let e=I.MAX_WG_DIM;return[e,Math.ceil(r/e),1]}recordPass(t,r,e,n){let i=this.pipeline(r),s=this.device.createBindGroup({layout:i.getBindGroupLayout(0),entries:e.map((o,u)=>({binding:u,resource:{buffer:o}}))}),a=t.beginComputePass();a.setPipeline(i),a.setBindGroup(0,s),a.dispatchWorkgroups(...n),a.end()}dispatch(t,r,e){let n=this.device.createCommandEncoder();this.recordPass(n,t,r,e),this.device.queue.submit([n.finish()])}async run(t,r,e,n,i){return this.dispatch(t,r,e),this.readBack(n,i)}isF32(t){return t instanceof Float32Array}async matmul(t,r,e,n,i){let s=globalThis,a=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,o=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([e,n,i]));let u=this.isF32(r)?this.buf(r,a):r,c=this.device.createBuffer({size:e*i*4,usage:a|s.GPUBufferUsage.COPY_SRC});return this.run("matmul",[o,this.buf(t,a),u,c],[Math.ceil(e/8),Math.ceil(i/8),1],c,e*i*4)}async matmulT(t,r,e,n,i,s=!1){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([e,n,i]));let c=this.isF32(r)?this.buf(r,o):r,f=this.device.createBuffer({size:e*i*4,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run(this.matmulTShader(n,s),[u,this.buf(t,o),c,f],[Math.ceil(e/8),Math.ceil(i/8),1],f,e*i*4)}matmulTShader(t,r){return r&&this.hasF16?"matmul_t_f16w":t%4===0?"matmul_t_vec4":"matmul_t"}async rmsnorm(t,r,e,n,i=1e-5,s=!1){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([e,n])),this.device.queue.writeBuffer(u,8,new Float32Array([i])),this.device.queue.writeBuffer(u,12,new Uint32Array([s?1:0]));let c=this.device.createBuffer({size:t.byteLength,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("rmsnorm",[u,this.buf(t,o),this.buf(r,o),c],[Math.ceil(e/Z),1,1],c,t.byteLength)}async binary(t,r,e){let n=globalThis,i=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST,s=this.device.createBuffer({size:r.byteLength,usage:i|n.GPUBufferUsage.COPY_SRC});return this.run(t,[this.buf(r,i),this.buf(e,i),s],this.grid1D(r.length),s,r.byteLength)}swiglu(t,r){return this.binary("swiglu",t,r)}geglu(t,r){return this.binary("geglu",t,r)}add(t,r){return this.binary("add",t,r)}async silu(t){let r=globalThis,e=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:t.byteLength,usage:e|r.GPUBufferUsage.COPY_SRC});return this.run("silu",[this.buf(t,e),n],this.grid1D(t.length),n,t.byteLength)}async groupNorm(t,r,e,n,i,s,a=1e-5){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([n,i,s])),this.device.queue.writeBuffer(c,12,new Float32Array([a]));let f=this.device.createBuffer({size:t.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("group_norm",[c,this.buf(t,u),this.buf(r,u),this.buf(e,u),f],[s,1,1],f,t.byteLength)}async conv2d(t,r,e,n,i,s,a,o,u,c=1,f=0){let l=globalThis,g=l.GPUBufferUsage.STORAGE|l.GPUBufferUsage.COPY_DST,d=Math.floor((i+2*f-o)/c)+1,m=Math.floor((s+2*f-u)/c)+1,p=n*o*u,w=d*m;if(p*w*4>this.maxStorageBufferBindingSize*.9)return this.conv2dDirect(t,r,e,n,i,s,a,o,u,c,f);let G=this.device.createBuffer({size:48,usage:l.GPUBufferUsage.UNIFORM|l.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(G,0,new Uint32Array([n,i,s,o,u,c,f,d,m]));let D=this.device.createBuffer({size:p*w*4,usage:g|l.GPUBufferUsage.COPY_SRC});this.dispatch("im2col",[G,this.buf(t,g),D],this.grid1D(p*w));let F=await this.matmul(r,D,a,p,w);if(D.destroy?.(),G.destroy?.(),e)for(let S=0;S<a;S++){let M=e[S];for(let U=0;U<w;U++)F[S*w+U]+=M}return F}async conv2dDirect(t,r,e,n,i,s,a,o,u,c=1,f=0){let l=globalThis,g=l.GPUBufferUsage.STORAGE|l.GPUBufferUsage.COPY_DST,d=Math.floor((i+2*f-o)/c)+1,m=Math.floor((s+2*f-u)/c)+1,p=a*d*m,w=this.device.createBuffer({size:48,usage:l.GPUBufferUsage.UNIFORM|l.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(w,0,new Uint32Array([n,i,s,a,o,u,c,f,d,m]));let G=e??new Float32Array(a),D=this.device.createBuffer({size:p*4,usage:g|l.GPUBufferUsage.COPY_SRC});return this.run("conv2d_direct",[w,this.buf(t,g),this.buf(r,g),this.buf(G,g),D],this.grid1D(p),D,p*4)}async layernorm(t,r,e,n,i,s=1e-5){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,i])),this.device.queue.writeBuffer(u,8,new Float32Array([s]));let c=this.device.createBuffer({size:t.byteLength,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("layernorm",[u,this.buf(t,o),this.buf(r,o),this.buf(e,o),c],[Math.ceil(n/Z),1,1],c,t.byteLength)}async quickGelu(t){let r=globalThis,e=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:t.byteLength,usage:e|r.GPUBufferUsage.COPY_SRC});return this.run("quick_gelu",[this.buf(t,e),n],this.grid1D(t.length),n,t.byteLength)}async gelu(t){let r=globalThis,e=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:t.byteLength,usage:e|r.GPUBufferUsage.COPY_SRC});return this.run("gelu",[this.buf(t,e),n],this.grid1D(t.length),n,t.byteLength)}async relu(t){let r=globalThis,e=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:t.byteLength,usage:e|r.GPUBufferUsage.COPY_SRC});return this.run("relu",[this.buf(t,e),n],this.grid1D(t.length),n,t.byteLength)}async upsampleNearest(t,r,e,n,i=2){let s=globalThis,a=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,o=e*i,u=n*i,c=r*o*u,f=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(f,0,new Uint32Array([r,e,n,i]));let l=this.device.createBuffer({size:c*4,usage:a|s.GPUBufferUsage.COPY_SRC});return this.run("upsample_nearest",[f,this.buf(t,a),l],this.grid1D(c),l,c*4)}async rope(t,r,e,n,i=0,s=1e4){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:32,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([r,e,n,i])),this.device.queue.writeBuffer(u,16,new Float32Array([s]));let c=this.device.createBuffer({size:t.byteLength,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("rope",[u,this.buf(t,o),c],[Math.ceil(r/Z),1,1],c,t.byteLength)}async ropeFactors(t,r,e,n,i,s=0,a=1e4){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:32,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([e,n,i,s])),this.device.queue.writeBuffer(c,16,new Float32Array([a]));let f=this.device.createBuffer({size:r.byteLength,usage:u});this.device.queue.writeBuffer(f,0,r);let l=this.device.createBuffer({size:t.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("rope_factors",[c,this.buf(t,u),f,l],[Math.ceil(e/Z),1,1],l,t.byteLength)}async ropeMrope(t,r,e,n,i,s,a=1e4){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:32,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([e,n,i,s[0],s[0]+s[1]])),this.device.queue.writeBuffer(c,20,new Float32Array([a]));let f=this.device.createBuffer({size:r.byteLength,usage:u});this.device.queue.writeBuffer(f,0,r);let l=this.device.createBuffer({size:t.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("rope_mrope",[c,this.buf(t,u),f,l],[Math.ceil(e/Z),1,1],l,t.byteLength)}async rope2d(t,r,e,n,i,s=1e4){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:32,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([e,n,i,0])),this.device.queue.writeBuffer(u,16,new Float32Array([s]));let c=this.device.createBuffer({size:r.byteLength,usage:o});this.device.queue.writeBuffer(c,0,r);let f=this.device.createBuffer({size:t.byteLength,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("rope_2d",[u,this.buf(t,o),c,f],[Math.ceil(e/Z),1,1],f,t.byteLength)}async attention(t,r,e,n,i,s,a,o=0,u,c=0){let f=globalThis,l=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,g=o+n,d=this.device.createBuffer({size:32,usage:f.GPUBufferUsage.UNIFORM|f.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(d,0,new Uint32Array([n,i,s,a,g,o])),this.device.queue.writeBuffer(d,24,new Float32Array([u??1/Math.sqrt(a),c]));let m=n*i*a*4,p=this.device.createBuffer({size:m,usage:l|f.GPUBufferUsage.COPY_SRC});return this.run("attention",[d,this.buf(t,l),this.buf(r,l),this.buf(e,l),p],[Math.ceil(n*i/Z),1,1],p,m)}async attentionDecode(t,r,e,n,i,s,a,o=0,u,c=0){let f=globalThis,l=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,g=o+n,d=this.device.createBuffer({size:32,usage:f.GPUBufferUsage.UNIFORM|f.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(d,0,new Uint32Array([n,i,s,a,g,o])),this.device.queue.writeBuffer(d,24,new Float32Array([u??1/Math.sqrt(a),c]));let m=n*i*a*4,p=this.device.createBuffer({size:m,usage:l|f.GPUBufferUsage.COPY_SRC});return this.run("attention_decode",[d,this.buf(t,l),this.buf(r,l),this.buf(e,l),p],[n*i,1,1],p,m)}async attentionFull(t,r,e,n,i,s,a,o,u,c=0){let f=globalThis,l=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,g=this.device.createBuffer({size:32,usage:f.GPUBufferUsage.UNIFORM|f.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(g,0,new Uint32Array([n,i,s,a,o,0])),this.device.queue.writeBuffer(g,24,new Float32Array([u??1/Math.sqrt(a),c]));let d=n*i*a*4,m=this.device.createBuffer({size:d,usage:l|f.GPUBufferUsage.COPY_SRC});return this.run("attention_full",[g,this.buf(t,l),this.buf(r,l),this.buf(e,l),m],[Math.ceil(n*i/Z),1,1],m,d)}async attentionFullWg(t,r,e,n,i,s,a,o,u,c=0){let f=globalThis,l=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,g=this.device.createBuffer({size:32,usage:f.GPUBufferUsage.UNIFORM|f.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(g,0,new Uint32Array([n,i,s,a,o,0])),this.device.queue.writeBuffer(g,24,new Float32Array([u??1/Math.sqrt(a),c]));let d=n*i*a*4,m=this.device.createBuffer({size:d,usage:l|f.GPUBufferUsage.COPY_SRC});return this.run("attention_full_wg",[g,this.buf(t,l),this.buf(r,l),this.buf(e,l),m],[n*i,1,1],m,d)}async quantizeKvReadback(t,r,e,n){let i=globalThis,s=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST|i.GPUBufferUsage.COPY_SRC,a=e*n,o=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([r,e,n,0]));let u=this.device.createBuffer({size:r*a,usage:s}),c=this.device.createBuffer({size:r*e*4,usage:s});this.dispatch("quantize_kv",[o,this.buf(t,s),u,c],this.grid1D(r*e));let f=await this.readBack(u,r*a),l=new Uint32Array(f.buffer,0,r*a/4),g=await this.readBack(c,r*e*4);return u.destroy?.(),c.destroy?.(),{codes:l,scales:g}}async attentionQ8Kv(t,r,e,n,i,s,a,o,u,c=0,f,l=0){let g=globalThis,d=g.GPUBufferUsage.STORAGE|g.GPUBufferUsage.COPY_DST,m=c+s,p=this.device.createBuffer({size:32,usage:g.GPUBufferUsage.UNIFORM|g.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(p,0,new Uint32Array([s,a,o,u,m,c])),this.device.queue.writeBuffer(p,24,new Float32Array([f??1/Math.sqrt(u),l]));let w=s*a*u*4,G=this.device.createBuffer({size:w,usage:d|g.GPUBufferUsage.COPY_SRC});return this.run("attention_q8kv",[p,this.buf(t,d),this.bufU32(r,d),this.buf(e,d),this.bufU32(n,d),this.buf(i,d),G],[Math.ceil(s*a/Z),1,1],G,w)}async attentionQ8KvDecode(t,r,e,n,i,s,a,o,u,c=0,f,l=0){let g=globalThis,d=g.GPUBufferUsage.STORAGE|g.GPUBufferUsage.COPY_DST,m=c+s,p=this.device.createBuffer({size:32,usage:g.GPUBufferUsage.UNIFORM|g.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(p,0,new Uint32Array([s,a,o,u,m,c])),this.device.queue.writeBuffer(p,24,new Float32Array([f??1/Math.sqrt(u),l]));let w=s*a*u*4,G=this.device.createBuffer({size:w,usage:d|g.GPUBufferUsage.COPY_SRC});return this.run("attention_decode_q8kv",[p,this.buf(t,d),this.bufU32(r,d),this.buf(e,d),this.bufU32(n,d),this.buf(i,d),G],[s*a,1,1],G,w)}async addBias(t,r,e,n){let i=globalThis,s=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,a=this.device.createBuffer({size:8,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(a,0,new Uint32Array([e,n]));let o=this.device.createBuffer({size:t.byteLength,usage:s|i.GPUBufferUsage.COPY_SRC});return this.run("addbias",[a,this.buf(t,s),this.buf(r,s),o],this.grid1D(t.length),o,t.byteLength)}async dequantBlocked(t,r,e,n){let i=globalThis,s=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,a=e/n;if(!Number.isInteger(a))throw new Error(`${t}: nElems ${e} not a multiple of ${n}`);let o=r.byteLength%4===0?r:(()=>{let l=new Uint8Array(Math.ceil(r.byteLength/4)*4);return l.set(r),l})(),u=new Uint32Array(o.buffer,o.byteOffset,o.byteLength/4),c=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([a]));let f=this.device.createBuffer({size:e*4,usage:s|i.GPUBufferUsage.COPY_SRC});return this.run(t,[c,this.bufU32(u,s),f],this.grid1D(a),f,e*4)}async dequantizeQ4K(t,r){return this.dequantBlocked("dequant_q4k",t,r,256)}async dequantizeByType(t,r,e){if(t==="F32")return new Float32Array(r.buffer,r.byteOffset,e);if(t==="F16"){let s=new DataView(r.buffer,r.byteOffset),a=new Float32Array(e);for(let o=0;o<e;o++)a[o]=ne(s.getUint16(o*2,!0));return a}if(t==="Q4W")return se(fe(r,e));if(t==="Q8W")return le(ge(r,e));if(t==="Q3W")return Se(Fe(r,e));let n=I.DEQUANT_SHADER[t],i=I.BLOCK_ELEMS[t];if(!n||!i)throw new Error(`dequant: unsupported GGML type ${t}`);return this.dequantBlocked(n,r,e,i)}dequantBlockedGpu(t,r,e,n){let i=globalThis,s=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,a=e/n;if(!Number.isInteger(a))throw new Error(`${t}: nElems ${e} not a multiple of ${n}`);let o=r.byteLength%4===0?r:(()=>{let l=new Uint8Array(Math.ceil(r.byteLength/4)*4);return l.set(r),l})(),u=new Uint32Array(o.buffer,o.byteOffset,o.byteLength/4),c=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([a]));let f=this.device.createBuffer({size:e*4,usage:s});return this.dispatch(t,[c,this.bufU32(u,s),f],this.grid1D(a)),f}dequantizeToGpu(t,r,e){let n=globalThis,i=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST;if(t==="F32")return this.buf(new Float32Array(r.buffer,r.byteOffset,e),i);if(t==="F16"){let o=new DataView(r.buffer,r.byteOffset),u=new Float32Array(e);for(let c=0;c<e;c++)u[c]=ne(o.getUint16(c*2,!0));return this.buf(u,i)}if(t==="Q4W")return this.buf(se(fe(r,e)),i);if(t==="Q8W")return this.buf(le(ge(r,e)),i);if(t==="Q3W")return this.buf(Se(Fe(r,e)),i);let s=I.DEQUANT_SHADER[t],a=I.BLOCK_ELEMS[t];if(!s||!a)throw new Error(`dequant: unsupported GGML type ${t}`);return this.dequantBlockedGpu(s,r,e,a)}async layerForward(t,r,e,n=!1){let{seq:i,d:s,nHeads:a,nKvHeads:o,headDim:u,ffn:c,ropeTheta:f,eps:l}=r,g=o*u,d=n?(_,O,L,T,R)=>this.matmulT(_,O,L,T,R):(_,O,L,T,R)=>this.matmul(_,O,L,T,R),m=a*u,p=r.rmsGainOnePlus===!0,w=r.attnLogitSoftcap??0,G=(_,O)=>r.act==="gelu"?this.geglu(_,O):this.swiglu(_,O),D=await this.rmsnorm(t,e.attnNorm,i,s,l,p),F=await d(D,e.wq,i,s,m),S=await d(D,e.wk,i,s,g),M=await d(D,e.wv,i,s,g);e.bq&&(F=await this.addBias(F,e.bq,i,m)),e.bk&&(S=await this.addBias(S,e.bk,i,g)),e.bv&&(M=await this.addBias(M,e.bv,i,g)),e.qNorm&&(F=await this.rmsnorm(F,e.qNorm,i*a,u,l,p)),e.kNorm&&(S=await this.rmsnorm(S,e.kNorm,i*o,u,l,p));let U=await this.rope(F,i*a,u,a,0,f),v=await this.rope(S,i*o,u,o,0,f),b=await this.attention(U,v,M,i,a,o,u,0,r.attnScale,w),k=await d(b,e.wo,i,m,s);e.postAttnNorm&&(k=await this.rmsnorm(k,e.postAttnNorm,i,s,l,p));let x=await this.add(t,k),y=await this.rmsnorm(x,e.ffnNorm,i,s,l,p),P=await d(y,e.wgate,i,s,c),A=await d(y,e.wup,i,s,c),B=await G(P,A),q=await d(B,e.wdown,i,c,s);return e.postFfnNorm&&(q=await this.rmsnorm(q,e.postFfnNorm,i,s,l,p)),this.add(x,q)}async layerForwardKV(t,r,e,n,i,s,a=!1){let{seq:o,d:u,nHeads:c,nKvHeads:f,headDim:l,ffn:g,ropeTheta:d,eps:m}=r,p=f*l,w=a?(W,Y,V,X,C)=>this.matmulT(W,Y,V,X,C):(W,Y,V,X,C)=>this.matmul(W,Y,V,X,C),G=(W,Y)=>{let V=new Float32Array(W.length+Y.length);return V.set(W),V.set(Y,W.length),V},D=c*l,F=r.rmsGainOnePlus===!0,S=r.attnLogitSoftcap??0,M=(W,Y)=>r.act==="gelu"?this.geglu(W,Y):this.swiglu(W,Y),U=await this.rmsnorm(t,e.attnNorm,o,u,m,F),v=await w(U,e.wq,o,u,D),b=await w(U,e.wk,o,u,p),k=await w(U,e.wv,o,u,p);e.bq&&(v=await this.addBias(v,e.bq,o,D)),e.bk&&(b=await this.addBias(b,e.bk,o,p)),e.bv&&(k=await this.addBias(k,e.bv,o,p)),e.qNorm&&(v=await this.rmsnorm(v,e.qNorm,o*c,l,m,F)),e.kNorm&&(b=await this.rmsnorm(b,e.kNorm,o*f,l,m,F));let x=await this.rope(v,o*c,l,c,n,d),y=await this.rope(b,o*f,l,f,n,d),P=G(i,y),A=G(s,k),B=await this.attention(x,P,A,o,c,f,l,n,r.attnScale,S),q=await w(B,e.wo,o,D,u);e.postAttnNorm&&(q=await this.rmsnorm(q,e.postAttnNorm,o,u,m,F));let _=await this.add(t,q),O=await this.rmsnorm(_,e.ffnNorm,o,u,m,F),L=await w(O,e.wgate,o,u,g),T=await w(O,e.wup,o,u,g),R=await M(L,T),E=await w(R,e.wdown,o,g,u);return e.postFfnNorm&&(E=await this.rmsnorm(E,e.postFfnNorm,o,u,m,F)),{out:await this.add(_,E),k:P,v:A}}storage(t){let r=this.bufferPool.get(t);if(r&&r.length){let n=r.pop();return this.pooled.delete(n),n}let e=this.device.createBuffer({size:t,usage:I.STORAGE_USAGE});return this.poolSize.set(e,t),e}release(t){for(let r of t){if(!r)continue;let e=this.poolSize.get(r);if(e!==void 0){if(this.pooled.has(r))continue;this.pooled.add(r);let i=this.bufferPool.get(e);i||(i=[],this.bufferPool.set(e,i)),i.push(r);continue}let n=this.uniformSize.get(r);if(n!==void 0){if(this.pooled.has(r))continue;this.pooled.add(r);let i=this.uniformPool.get(n);i||(i=[],this.uniformPool.set(n,i)),i.push(r);continue}r.destroy?.()}}uploadGpu(t){return t instanceof Float32Array?this.buf(t,I.STORAGE_USAGE):this.f16ToF32Gpu(t.f16,t.n)}uploadGpuF16(t){let r=new Uint16Array(t.length);for(let e=0;e<t.length;e++)r[e]=ye(t[e]);return this.bufU16(r)}f32ToF16Gpu(t,r){let e=globalThis,n=Math.ceil(r/2),i=this.device.createBuffer({size:n*4,usage:I.STORAGE_USAGE}),s=this.device.createBuffer({size:16,usage:e.GPUBufferUsage.UNIFORM|e.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(s,0,new Uint32Array([n])),this.dispatch("packf16",[s,t,i],this.grid1D(n)),i}f32ToQ8Gpu(t,r){let e=globalThis,n=r/32,i=this.device.createBuffer({size:r,usage:I.STORAGE_USAGE}),s=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:I.STORAGE_USAGE}),a=this.device.createBuffer({size:16,usage:e.GPUBufferUsage.UNIFORM|e.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(a,0,new Uint32Array([n])),this.dispatch("quantize_q8",[a,t,i,s],this.grid1D(n)),{codes:i,sc:s}}f32ToQ4Gpu(t,r){let e=globalThis,n=r/32,i=this.device.createBuffer({size:r/2,usage:I.STORAGE_USAGE}),s=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:I.STORAGE_USAGE}),a=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:I.STORAGE_USAGE}),o=this.device.createBuffer({size:16,usage:e.GPUBufferUsage.UNIFORM|e.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(o,0,new Uint32Array([n])),this.dispatch("quantize_q4",[o,t,i,s,a],this.grid1D(n)),{nib:i,sc:s,mn:a}}uploadGpuRawF16(t){let r=Math.ceil(t.byteLength/4)*4,e=this.device.createBuffer({size:r,usage:I.STORAGE_USAGE});if(this.device.queue.writeBuffer(e,0,t,0,t.byteLength-t.byteLength%4),t.byteLength%4){let n=new Uint8Array(4);n.set(t.subarray(t.byteLength-t.byteLength%4)),this.device.queue.writeBuffer(e,t.byteLength-t.byteLength%4,n)}return e}bufU16(t){let r=this.device.createBuffer({size:t.byteLength,usage:I.STORAGE_USAGE});return this.device.queue.writeBuffer(r,0,t),r}uploadGpuRaw(t){let r=Math.ceil(t.byteLength/4)*4,e=this.device.createBuffer({size:r,usage:I.STORAGE_USAGE}),n=t.byteLength-t.byteLength%4;if(this.device.queue.writeBuffer(e,0,t,0,n),t.byteLength%4){let i=new Uint8Array(4);i.set(t.subarray(n)),this.device.queue.writeBuffer(e,n,i)}return e}async matmulQ4(t,r,e,n,i,s,a){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([i,s,a]));let f=this.device.createBuffer({size:i*a*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4",[c,this.buf(t,u),r,e,n,f],[Math.ceil(i/8),Math.ceil(a/8),1],f,i*a*4)}async matmulQ4Tiled(t,r,e,n,i,s,a){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([i,s,a]));let f=this.device.createBuffer({size:i*a*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_tiled",[c,this.buf(t,u),r,e,n,f],[Math.ceil(Math.ceil(i/4)/8),Math.ceil(a/8),1],f,i*a*4)}async matmulQ4Shared(t,r,e,n,i,s,a){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([i,s,a]));let f=this.device.createBuffer({size:i*a*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_shared",[c,this.buf(t,u),r,e,n,f],[Math.ceil(a/16),Math.ceil(i/16),1],f,i*a*4)}async matmulQ3(t,r,e,n,i,s,a,o){let u=globalThis,c=u.GPUBufferUsage.STORAGE|u.GPUBufferUsage.COPY_DST,f=this.device.createBuffer({size:16,usage:u.GPUBufferUsage.UNIFORM|u.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(f,0,new Uint32Array([s,a,o]));let l=this.device.createBuffer({size:s*o*4,usage:c|u.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q3",[f,this.buf(t,c),r,e,n,i,l],[Math.ceil(s/8),Math.ceil(o/8),1],l,s*o*4)}async rwkvWkv7(t,r,e,n,i,s,a,o,u){let c=globalThis,f=c.GPUBufferUsage.STORAGE|c.GPUBufferUsage.COPY_DST,l=this.device.createBuffer({size:8,usage:c.GPUBufferUsage.UNIFORM|c.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(l,0,new Uint32Array([o,u]));let g=this.device.createBuffer({size:t.byteLength,usage:f|c.GPUBufferUsage.COPY_SRC});this.device.queue.writeBuffer(g,0,t);let d=this.device.createBuffer({size:o*u*4,usage:f|c.GPUBufferUsage.COPY_SRC});this.dispatch("rwkv_wkv7",[l,this.buf(r,f),this.buf(e,f),this.buf(n,f),this.buf(i,f),this.buf(s,f),this.buf(a,f),g,d],this.grid1D(o*u));let m=await this.readBack(g,t.byteLength),p=await this.readBack(d,o*u*4);return g.destroy?.(),d.destroy?.(),{S:m,y:p}}async rwkvTokenShift(t,r,e,n){let i=globalThis,s=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,a=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(a,0,new Uint32Array([n]));let o=this.device.createBuffer({size:6*n*4,usage:s|i.GPUBufferUsage.COPY_SRC});this.dispatch("rwkv_token_shift",[a,this.buf(t,s),this.buf(r,s),this.buf(e,s),o],this.grid1D(n*6));let u=await this.readBack(o,6*n*4);return o.destroy?.(),u}async lfm2ShortConv(t,r,e,n,i){let s=globalThis,a=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,o=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([n,i]));let u=this.buf(r,a|s.GPUBufferUsage.COPY_SRC),c=this.device.createBuffer({size:n*4,usage:a|s.GPUBufferUsage.COPY_SRC});this.dispatch("lfm2_shortconv",[o,this.buf(t,a),this.buf(e,a),u,c],this.grid1D(n));let f=await this.readBack(c,n*4),l=await this.readBack(u,(i-1)*n*4);return c.destroy?.(),u.destroy?.(),{out:f,state:l}}async matmulQ8(t,r,e,n,i,s){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,i,s]));let c=this.device.createBuffer({size:n*s*4,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8",[u,this.buf(t,o),r,e,c],[Math.ceil(n/8),Math.ceil(s/8),1],c,n*s*4)}async matmulQ8Tiled(t,r,e,n,i,s){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,i,s]));let c=this.device.createBuffer({size:n*s*4,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_tiled",[u,this.buf(t,o),r,e,c],[Math.ceil(Math.ceil(n/4)/8),Math.ceil(s/8),1],c,n*s*4)}async matmulQ8Shared(t,r,e,n,i,s){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,i,s]));let c=this.device.createBuffer({size:n*s*4,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_shared",[u,this.buf(t,o),r,e,c],[Math.ceil(s/16),Math.ceil(n/16),1],c,n*s*4)}uniformOf(t){let r=globalThis,e=this.uniformPool.get(t);if(e&&e.length){let i=e.pop();return this.pooled.delete(i),i}let n=this.device.createBuffer({size:t,usage:r.GPUBufferUsage.UNIFORM|r.GPUBufferUsage.COPY_DST});return this.uniformSize.set(n,t),n}uniform(t,r){let e=this.uniformOf(32);if(this.device.queue.writeBuffer(e,0,new Uint32Array(t)),r){let n=Array.isArray(r.value)?r.value:[r.value];this.device.queue.writeBuffer(e,r.offset,new Float32Array(n))}return e}recMatmulT(t,r,e,n,i,s,a,o=!1){let u=this.uniform([i,s,a]),c=this.storage(i*a*4);return this.recordPass(t,this.matmulTShader(s,o),[u,e,n,c],[Math.ceil(i/8),Math.ceil(a/8),1]),r.push(u,c),c}recConv2dDirect(t,r,e,n,i,s,a,o,u,c,f,l,g){let d=Math.floor((a+2*g-c)/l)+1,m=Math.floor((o+2*g-f)/l)+1,p=u*d*m,w=this.uniformOf(48);if(this.device.queue.writeBuffer(w,0,new Uint32Array([s,a,o,u,c,f,l,g,d,m])),c===3&&f===3&&l===1&&g===1&&this.convTiledOk){let D=this.storage(p*4);return this.recordPass(t,"conv2d_3x3_tiled",[w,e,n,i,D],[Math.ceil(m/16),Math.ceil(d/16),u]),r.push(w,D),D}let G=this.storage(p*4);return this.recordPass(t,"conv2d_direct",[w,e,n,i,G],this.grid1D(p)),r.push(w,G),G}recConv2dDirectQ8(t,r,e,n,i,s,a,o,u,c,f,l,g){let d=Math.floor((a+2*g-c)/l)+1,m=Math.floor((o+2*g-f)/l)+1,p=u*d*m,w=this.uniformOf(48);this.device.queue.writeBuffer(w,0,new Uint32Array([s,a,o,u,c,f,l,g,d,m]));let G=this.storage(p*4);return this.recordPass(t,"conv2d_direct_q8",[w,e,n.codes,n.sc,i,G],this.grid1D(p)),r.push(w,G),G}recConv2dDirectQ4(t,r,e,n,i,s,a,o,u,c,f,l,g){let d=Math.floor((a+2*g-c)/l)+1,m=Math.floor((o+2*g-f)/l)+1,p=u*d*m,w=this.uniformOf(48);this.device.queue.writeBuffer(w,0,new Uint32Array([s,a,o,u,c,f,l,g,d,m]));let G=this.storage(p*4);return this.recordPass(t,"conv2d_direct_q4",[w,e,n.nib,n.sc,n.mn,i,G],this.grid1D(p)),r.push(w,G),G}recGroupNorm(t,r,e,n,i,s,a,o,u){let c=this.uniform([s,a,o],{offset:12,value:u}),f=this.storage(s*a*4);return this.recordPass(t,"group_norm",[c,e,n,i,f],[o,1,1]),r.push(c,f),f}recUnary(t,r,e,n,i){let s=this.storage(i*4);return this.recordPass(t,e,[n,s],this.grid1D(i)),r.push(s),s}recLayernorm(t,r,e,n,i,s,a,o){let u=this.uniform([s,a],{offset:8,value:o}),c=this.storage(s*a*4);return this.recordPass(t,"layernorm",[u,e,n,i,c],[Math.ceil(s/Z),1,1]),r.push(u,c),c}recAttentionFull(t,r,e,n,i,s,a,o,u,c,f){let l=this.uniform([s,a,o,u,c,0],{offset:24,value:[f??1/Math.sqrt(u),0]}),g=this.storage(s*a*u*4),d=s*a;return this.attnFullWgOk&&u<=192&&d<=65535?this.recordPass(t,"attention_full_wg",[l,e,n,i,g],[d,1,1]):this.recordPass(t,"attention_full",[l,e,n,i,g],[Math.ceil(d/Z),1,1]),r.push(l,g),g}recUpsample(t,r,e,n,i,s,a){let o=this.uniform([n,i,s,a]),u=n*(i*a)*(s*a),c=this.storage(u*4);return this.recordPass(t,"upsample_nearest",[o,e,c],this.grid1D(u)),r.push(o,c),c}recConcat(t,r,e,n,i,s,a){let o=this.storage((i+s)*a*4);return t.copyBufferToBuffer(e,0,o,0,i*a*4),t.copyBufferToBuffer(n,0,o,i*a*4,s*a*4),r.push(o),o}recAddChannelBias(t,r,e,n,i,s){let a=this.uniform([i,s]),o=this.storage(i*s*4);return this.recordPass(t,"add_channel_bias",[a,e,n,o],this.grid1D(i*s)),r.push(a,o),o}recTranspose(t,r,e,n,i){let s=this.uniform([n,i]),a=this.storage(n*i*4);return this.recordPass(t,"transpose2d",[s,e,a],this.grid1D(n*i)),r.push(s,a),a}recGegluSplit(t,r,e,n,i){let s=this.uniform([n,i]),a=this.storage(n*i*4);return this.recordPass(t,"geglu_split",[s,e,a],this.grid1D(n*i)),r.push(s,a),a}recVideoGather(t,r,e,n,i,s){let a=this.uniform([n,i,s]),o=this.storage(s*n*i*4);return this.recordPass(t,"video_motion_gather",[a,e,o],this.grid1D(s*n*i)),r.push(a,o),o}recVideoScatter(t,r,e,n,i,s,a){let o=this.uniform([i,s,a]),u=this.storage(i*s*a*4);return this.recordPass(t,"video_motion_scatter",[o,e,n,u],this.grid1D(i*s*a)),r.push(o,u),u}recVideoAddPe(t,r,e,n,i,s,a){let o=this.uniform([i,s,a]),u=this.storage(a*i*s*4);return this.recordPass(t,"video_add_pe",[o,e,n,u],this.grid1D(a*i*s)),r.push(o,u),u}recAttnTemporal(t,r,e,n,i,s,a,o,u){let c=this.uniform([s,a,o,u],{offset:16,value:1/Math.sqrt(u)}),f=this.storage(s*a*o*u*4);return this.recordPass(t,"attn_temporal",[c,e,n,i,f],this.grid1D(s*a*o)),r.push(c,f),f}recordingSession(){let t=this.device.createCommandEncoder(),r=[],e=n=>{if(n instanceof Float32Array){let i=this.uploadGpu(n);return r.push(i),i}return n};return{conv2d:(n,i,s,a,o,u,c,f,l,g,d)=>i&&i.nib?this.recConv2dDirectQ4(t,r,e(n),i,e(s),a,o,u,c,f,l,g,d):i&&i.codes?this.recConv2dDirectQ8(t,r,e(n),i,e(s),a,o,u,c,f,l,g,d):this.recConv2dDirect(t,r,e(n),e(i),e(s),a,o,u,c,f,l,g,d),groupNorm:(n,i,s,a,o,u,c)=>this.recGroupNorm(t,r,e(n),e(i),e(s),a,o,u,c),silu:(n,i)=>this.recUnary(t,r,"silu",e(n),i),quickGelu:(n,i)=>this.recUnary(t,r,"quick_gelu",e(n),i),gelu:(n,i)=>this.recUnary(t,r,"gelu",e(n),i),relu:(n,i)=>this.recUnary(t,r,"relu",e(n),i),add:(n,i,s)=>this.recBinary(t,r,"add",e(n),e(i),s),geglu:(n,i,s)=>this.recBinary(t,r,"geglu",e(n),e(i),s),matmulT:(n,i,s,a,o)=>this.recMM(t,r,e(n),i instanceof Float32Array?e(i):i,s,a,o,!1),addBias:(n,i,s,a)=>this.recAddBias(t,r,e(n),e(i),s,a),addChannelBias:(n,i,s,a)=>this.recAddChannelBias(t,r,e(n),e(i),s,a),attentionFull:(n,i,s,a,o,u,c,f)=>this.recAttentionFull(t,r,e(n),e(i),e(s),a,o,u,c,f),rope2d:(n,i,s,a,o,u)=>{let c=i instanceof Uint32Array?(()=>{let f=this.uploadGpuRaw(new Uint8Array(i.buffer,i.byteOffset,i.byteLength));return r.push(f),f})():i;return this.recRope2d(t,r,e(n),c,s,a,o,u)},attention:(n,i,s,a,o,u,c,f,l)=>this.recAttention(t,r,e(n),e(i),e(s),a,o,u,c,f,l),upsample:(n,i,s,a,o)=>this.recUpsample(t,r,e(n),i,s,a,o),layernorm:(n,i,s,a,o,u)=>this.recLayernorm(t,r,e(n),e(i),e(s),a,o,u),concat:(n,i,s,a,o)=>this.recConcat(t,r,e(n),e(i),s,a,o),transpose:(n,i,s)=>this.recTranspose(t,r,e(n),i,s),gegluSplit:(n,i,s)=>this.recGegluSplit(t,r,e(n),i,s),videoGather:(n,i,s,a)=>this.recVideoGather(t,r,e(n),i,s,a),videoScatter:(n,i,s,a,o)=>this.recVideoScatter(t,r,e(n),e(i),s,a,o),videoAddPe:(n,i,s,a,o)=>this.recVideoAddPe(t,r,e(n),e(i),s,a,o),attnTemporal:(n,i,s,a,o,u,c)=>this.recAttnTemporal(t,r,e(n),e(i),e(s),a,o,u,c),alloc:n=>{let i=this.storage(n);return r.push(i),i},copy:(n,i,s,a,o)=>{t.copyBufferToBuffer(s,a,n,i,o)},finish:async(n,i)=>{this.device.queue.submit([t.finish()]);let s=await this.readBack(n,i*4);return this.release(r),s},finishKeep:n=>{this.device.queue.submit([t.finish()]);let i=r.indexOf(n);return i>=0&&r.splice(i,1),this.release(r),n},finishKeepMany:n=>{this.device.queue.submit([t.finish()]);for(let i of n){let s=r.indexOf(i);s>=0&&r.splice(s,1)}return this.release(r),n}}}readGpu(t,r){return this.readBack(t,r*4)}trimPool(t=64<<20){let r=[...this.bufferPool.keys()].sort((n,i)=>i-n),e=0;for(let n of this.bufferPool.values())for(let i of n)e+=this.poolSize.get(i)??0;for(let n of r){let i=this.bufferPool.get(n);for(;i.length&&e>t;){let s=i.pop();this.pooled.delete(s),this.poolSize.delete(s),s.destroy?.(),e-=n}}}releaseGpu(t){this.release(t)}waitGpu(){return this.device.queue.onSubmittedWorkDone()}destroy(){try{this.device?.destroy?.()}catch{}this.bufferPool.clear(),this.uniformPool.clear()}f16ToF32Gpu(t,r){let e=this.uploadGpuRawF16(t),n=this.device.createBuffer({size:r*4,usage:I.STORAGE_USAGE}),i=this.uniformOf(16);return this.device.queue.writeBuffer(i,0,new Uint32Array([r])),this.dispatch("f16_to_f32",[i,e,n],this.grid1D(Math.ceil(r/2))),e.destroy?.(),this.release([i]),n}quantizeQ8Gpu(t){let r=t instanceof Float32Array?t.length:t.n;if(r%32!==0)return this.uploadGpu(t);let e=t instanceof Float32Array?this.buf(t,I.STORAGE_USAGE):this.f16ToF32Gpu(t.f16,r),n=this.f32ToQ8Gpu(e,r);return e.destroy?.(),n}async validateResidentOps(){let t=globalThis,r=x=>Float32Array.from({length:x},()=>(Math.random()*2-1)*.5),e=(x,y,P=.005)=>x.length===y.length&&x.every((A,B)=>Math.abs(A-y[B])<=P*(1+Math.abs(y[B]))),n=4,i=4,s=4,a=4,o=2,u=1e-5,c=a*i*s,f=r(n*i*s),l=r(a*n*9),g=r(a),d=r(a),m=r(a),p=await this.silu(await this.groupNorm(await this.conv2dDirect(f,l,g,n,i,s,a,3,3,1,1),d,m,a,i*s,o,u)),w=[],G=this.device.createCommandEncoder(),D=this.uploadGpu(f),F=this.uploadGpu(l),S=this.uploadGpu(g),M=this.uploadGpu(d),U=this.uploadGpu(m);w.push(D,F,S,M,U);let v=this.recConv2dDirect(G,w,D,F,S,n,i,s,a,3,3,1,1);v=this.recGroupNorm(G,w,v,M,U,a,i*s,o,u),v=this.recUnary(G,w,"silu",v,c);let b=this.device.createBuffer({size:c*4,usage:t.GPUBufferUsage.COPY_DST|t.GPUBufferUsage.MAP_READ});G.copyBufferToBuffer(v,0,b,0,c*4),this.device.queue.submit([G.finish()]),await b.mapAsync(t.GPUMapMode.READ);let k=new Float32Array(b.getMappedRange().slice(0));return b.unmap(),b.destroy(),this.release(w),e(k,p)?null:"resident_ops"}recMatmulQ4(t,r,e,n,i,s,a){let o=this.uniform([i,s,a]),u=this.storage(i*a*4);return i>=16?this.recordPass(t,"matmul_t_q4_shared",[o,e,n.nib,n.sc,n.mn,u],[Math.ceil(a/16),Math.ceil(i/16),1]):i>=2?this.recordPass(t,"matmul_t_q4_tiled",[o,e,n.nib,n.sc,n.mn,u],[Math.ceil(Math.ceil(i/4)/8),Math.ceil(a/8),1]):this.recordPass(t,"matmul_t_q4",[o,e,n.nib,n.sc,n.mn,u],[Math.ceil(i/8),Math.ceil(a/8),1]),r.push(o,u),u}recMatmulQ8(t,r,e,n,i,s,a){let o=this.uniform([i,s,a]),u=this.storage(i*a*4);return i>=16?this.recordPass(t,"matmul_t_q8_shared",[o,e,n.codes,n.sc,u],[Math.ceil(a/16),Math.ceil(i/16),1]):i>=2?this.recordPass(t,"matmul_t_q8_tiled",[o,e,n.codes,n.sc,u],[Math.ceil(Math.ceil(i/4)/8),Math.ceil(a/8),1]):this.recordPass(t,"matmul_t_q8",[o,e,n.codes,n.sc,u],[Math.ceil(i/8),Math.ceil(a/8),1]),r.push(o,u),u}recMatmulQ3(t,r,e,n,i,s,a){let o=this.uniform([i,s,a]),u=this.storage(i*a*4);return this.recordPass(t,"matmul_t_q3",[o,e,n.lo,n.hi,n.sc,n.mn,u],[Math.ceil(i/8),Math.ceil(a/8),1]),r.push(o,u),u}recMM(t,r,e,n,i,s,a,o){return n&&n.q3?this.recMatmulQ3(t,r,e,n,i,s,a):n&&n.nib?this.recMatmulQ4(t,r,e,n,i,s,a):n&&n.codes?this.recMatmulQ8(t,r,e,n,i,s,a):this.recMatmulT(t,r,e,n,i,s,a,o)}recRmsnorm(t,r,e,n,i,s,a,o=!1){let u=this.uniform([i,s,0,o?1:0],{offset:8,value:a}),c=this.storage(i*s*4);return this.recordPass(t,"rmsnorm",[u,e,n,c],[Math.ceil(i/Z),1,1]),r.push(u,c),c}recRope(t,r,e,n,i,s,a,o){let u=this.uniform([n,i,s,a],{offset:16,value:o}),c=this.storage(n*i*4);return this.recordPass(t,"rope",[u,e,c],[Math.ceil(n/Z),1,1]),r.push(u,c),c}recRopeMrope(t,r,e,n,i,s,a,o,u){let c=u[0],f=u[0]+u[1],l=this.uniform([i,s,a,c,f],{offset:20,value:o}),g=this.storage(i*s*4);return this.recordPass(t,"rope_mrope",[l,e,n,g],[Math.ceil(i/Z),1,1]),r.push(l,g),g}preparePositions(t,r){if(t.positions&&t.mropeSections){let e=this.storage(t.positions.byteLength);this.device.queue.writeBuffer(e,0,t.positions),r.push(e),t._posGpu=e}if(t.ropeFactors){let e=this.storage(t.ropeFactors.byteLength);this.device.queue.writeBuffer(e,0,t.ropeFactors),r.push(e),t._ffGpu=e}}recRope2d(t,r,e,n,i,s,a,o){let u=this.uniform([i,s,a,0],{offset:16,value:o}),c=this.storage(i*s*4);return this.recordPass(t,"rope_2d",[u,e,n,c],[Math.ceil(i/Z),1,1]),r.push(u,c),c}recRopeFactors(t,r,e,n,i,s,a,o,u){let c=this.uniform([i,s,a,o],{offset:16,value:u}),f=this.storage(i*s*4);return this.recordPass(t,"rope_factors",[c,e,n,f],[Math.ceil(i/Z),1,1]),r.push(c,f),f}recAttention(t,r,e,n,i,s,a,o,u,c,f,l,g=0){let d=this.uniform([s,a,o,u,c,f],{offset:24,value:[l??1/Math.sqrt(u),g]}),m=this.storage(s*a*u*4);return this.attnDecodeOk&&s*a<256&&u<=128?this.recordPass(t,"attention_decode",[d,e,n,i,m],[s*a,1,1]):this.recordPass(t,"attention",[d,e,n,i,m],[Math.ceil(s*a/Z),1,1]),r.push(d,m),m}recQuantizeKv(t,r,e,n,i,s,a,o,u){let c=this.uniform([s,a,o,u]);this.recordPass(t,"quantize_kv",[c,e,n,i],this.grid1D(s*a)),r.push(c)}recAttentionQ8(t,r,e,n,i,s,a,o,u,c,f,l,g,d,m=0){let p=this.uniform([o,u,c,f,l,g],{offset:24,value:[d??1/Math.sqrt(f),m]}),w=this.storage(o*u*f*4);return this.attnDecodeOk&&o*u<256&&f<=128?this.recordPass(t,"attention_decode_q8kv",[p,e,n,i,s,a,w],[o*u,1,1]):this.recordPass(t,"attention_q8kv",[p,e,n,i,s,a,w],[Math.ceil(o*u/Z),1,1]),r.push(p,w),w}recAddBias(t,r,e,n,i,s){let a=this.uniform([i,s]),o=this.storage(i*s*4);return this.recordPass(t,"addbias",[a,e,n,o],this.grid1D(i*s)),r.push(a,o),o}recBinary(t,r,e,n,i,s){let a=this.storage(s*4);return this.recordPass(t,e,[n,i,a],this.grid1D(s)),r.push(a),a}recLfm2ShortConv(t,r,e,n,i,s,a){let o=this.uniform([s,a]),u=this.storage(s*4);return this.recordPass(t,"lfm2_shortconv",[o,e,i,n,u],this.grid1D(s)),r.push(o,u),u}recordLayerKV(t,r,e,n,i,s,a){let o=a.k,u=a.v,{seq:c,d:f,nHeads:l,nKvHeads:g,headDim:d,ffn:m,ropeTheta:p,eps:w}=n,G=g*d,D=s+c,F=i.matF16===!0,S=l*d,M=n.rmsGainOnePlus===!0,U=n.attnLogitSoftcap??0,v=n.act==="gelu"?"geglu":"swiglu",b=this.recRmsnorm(t,r,e,i.attnNorm,c,f,w,M),k=this.recMM(t,r,b,i.wq,c,f,S,F),x=this.recMM(t,r,b,i.wk,c,f,G,F),y=this.recMM(t,r,b,i.wv,c,f,G,F);i.bq&&(k=this.recAddBias(t,r,k,i.bq,c,S)),i.bk&&(x=this.recAddBias(t,r,x,i.bk,c,G)),i.bv&&(y=this.recAddBias(t,r,y,i.bv,c,G)),i.qNorm&&(k=this.recRmsnorm(t,r,k,i.qNorm,c*l,d,w,M)),i.kNorm&&(x=this.recRmsnorm(t,r,x,i.kNorm,c*g,d,w,M));let P=n._posGpu,A=n._ffGpu,B=(V,X,C)=>P?this.recRopeMrope(t,r,V,P,X,d,C,p,n.mropeSections):A?this.recRopeFactors(t,r,V,A,X,d,C,s,p):this.recRope(t,r,V,X,d,C,s,p),q=B(k,c*l,l),_=B(x,c*g,g),O;if(a.kScale)this.recQuantizeKv(t,r,_,o,a.kScale,c,g,d,s),this.recQuantizeKv(t,r,y,u,a.vScale,c,g,d,s),O=this.recAttentionQ8(t,r,q,o,a.kScale,u,a.vScale,c,l,g,d,D,s,n.attnScale,U);else{let V=G*4;t.copyBufferToBuffer(_,0,o,s*V,c*V),t.copyBufferToBuffer(y,0,u,s*V,c*V),O=this.recAttention(t,r,q,o,u,c,l,g,d,D,s,n.attnScale,U)}let L=this.recMM(t,r,O,i.wo,c,S,f,F);i.postAttnNorm&&(L=this.recRmsnorm(t,r,L,i.postAttnNorm,c,f,w,M));let T=this.recBinary(t,r,"add",e,L,c*f),R=this.recRmsnorm(t,r,T,i.ffnNorm,c,f,w,M),E=this.recMM(t,r,R,i.wgate,c,f,m,F),j=this.recMM(t,r,R,i.wup,c,f,m,F),W=this.recBinary(t,r,v,E,j,c*m),Y=this.recMM(t,r,W,i.wdown,c,m,f,F);return i.postFfnNorm&&(Y=this.recRmsnorm(t,r,Y,i.postFfnNorm,c,f,w,M)),this.recBinary(t,r,"add",T,Y,c*f)}setKvQuant(t){this.kvQuant!==t&&(this.kvQuant=t,this.resetKvGpu())}resetKvGpu(){for(let t of this.kvGpu.values())t.k.destroy?.(),t.v.destroy?.(),t.kScale?.destroy?.(),t.vScale?.destroy?.();this.kvGpu.clear(),this.kvSession="";for(let t of this.bufferPool.values())for(let r of t)r.destroy?.();this.bufferPool.clear()}clearKvCache(){this.resetKvGpu()}ensureKv(t,r,e,n){let i=this.kvGpu.get(t);if(i&&i.cap>=r)return i;let s=Math.max(r,(i?.cap??0)+1024,1024),a=this.kvQuant,o=this.storage(s*e*(a?1:4)),u=this.storage(s*e*(a?1:4)),c=a?this.storage(s*n*4):void 0,f=a?this.storage(s*n*4):void 0;if(i){let g=this.device.createCommandEncoder();g.copyBufferToBuffer(i.k,0,o,0,i.cap*e*(a?1:4)),g.copyBufferToBuffer(i.v,0,u,0,i.cap*e*(a?1:4)),a&&i.kScale&&(g.copyBufferToBuffer(i.kScale,0,c,0,i.cap*n*4),g.copyBufferToBuffer(i.vScale,0,f,0,i.cap*n*4)),this.device.queue.submit([g.finish()]),i.k.destroy?.(),i.v.destroy?.(),i.kScale?.destroy?.(),i.vScale?.destroy?.()}let l={k:o,v:u,cap:s,kScale:c,vScale:f};return this.kvGpu.set(t,l),l}async runDecodeGpu(t,r,e,n,i,s){let{seq:a,d:o,nKvHeads:u,headDim:c,eps:f}=r,l=u*c,g=n+a;(s!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${s}" inconnue avec pastLen=${n} \u2014 cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=s);for(let F=0;F<e.length;F++)this.ensureKv(F,g,l,u);let d=[];this.preparePositions(r,d);let m=this.device.createCommandEncoder(),p=this.storage(t.byteLength);this.device.queue.writeBuffer(p,0,t),d.push(p);for(let F=0;F<e.length;F++){let S=this.kvGpu.get(F);p=this.recordLayerKV(m,d,p,{...r,seq:a},e[F],n,S)}let w=this.recRmsnorm(m,d,p,i,a,o,f,r.rmsGainOnePlus===!0),G=this.storage(o*4);m.copyBufferToBuffer(w,(a-1)*o*4,G,0,o*4),this.device.queue.submit([m.finish()]);let D=await this.readBack(G,o*4);return d.push(G),this.release(d),D}async decodeLogitsQ8(t,r,e,n,i,s,a,o){let u=globalThis,{seq:c,d:f,nKvHeads:l,headDim:g,eps:d}=r,m=l*g,p=n+c;(s!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${s}" inconnue avec pastLen=${n} \u2014 cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=s);for(let b=0;b<e.length;b++)this.ensureKv(b,p,m,l);let w=[];this.preparePositions(r,w);let G=this.device.createCommandEncoder(),D=this.storage(t.byteLength);this.device.queue.writeBuffer(D,0,t),w.push(D);for(let b=0;b<e.length;b++){let k=this.kvGpu.get(b);D=this.recordLayerKV(G,w,D,{...r,seq:c},e[b],n,k)}let F=this.recRmsnorm(G,w,D,i,c,f,d,r.rmsGainOnePlus===!0),S=this.storage(f*4);G.copyBufferToBuffer(F,(c-1)*f*4,S,0,f*4),w.push(S);let M=this.storage(o*4);w.push(M);for(let b of a){let k=this.recMM(G,w,S,b.w,1,f,b.rows,!1);G.copyBufferToBuffer(k,0,M,b.r0*4,b.rows*4)}let U=this.device.createBuffer({size:o*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});G.copyBufferToBuffer(M,0,U,0,o*4),this.device.queue.submit([G.finish()]),await U.mapAsync(u.GPUMapMode.READ);let v=new Float32Array(U.getMappedRange().slice(0));return U.unmap(),U.destroy(),this.release(w),v}async decodeTopKQ8(t,r,e,n,i,s,a,o,u,c,f,l=64){let g=globalThis,{seq:d,d:m,nKvHeads:p,headDim:w,eps:G}=r,D=p*w,F=n+d;(s!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${s}" inconnue avec pastLen=${n} \u2014 cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=s);for(let A=0;A<e.length;A++)this.ensureKv(A,F,D,p);let S=[];this.preparePositions(r,S);let M=this.device.createCommandEncoder(),U=this.storage(t.byteLength);this.device.queue.writeBuffer(U,0,t),S.push(U);for(let A=0;A<e.length;A++){let B=this.kvGpu.get(A);U=this.recordLayerKV(M,S,U,{...r,seq:d},e[A],n,B)}let v=this.recRmsnorm(M,S,U,i,d,m,G,r.rmsGainOnePlus===!0),b=this.storage(m*4);M.copyBufferToBuffer(v,(d-1)*m*4,b,0,m*4),S.push(b);let k=this.storage(o*4);S.push(k);for(let A of a){let B=this.recMM(M,S,b,A.w,1,m,A.rows,!1);M.copyBufferToBuffer(B,0,k,A.r0*4,A.rows*4)}if(f&&f>0){let A=this.uniform([o],{offset:4,value:f});this.recordPass(M,"softcap_logits",[A,k],this.grid1D(o)),S.push(A)}if(c&&c!==1&&u.length){let A=Uint32Array.from(u),B=this.bufU32(A,g.GPUBufferUsage.STORAGE|g.GPUBufferUsage.COPY_DST),q=this.uniform([A.length],{offset:4,value:c});this.recordPass(M,"penalize_logits",[q,B,k],this.grid1D(A.length)),S.push(q,B)}let x=this.storage(l*2*4);S.push(x);{let A=this.uniform([o,l]);this.recordPass(M,"top_k",[A,k,x],[1,1,1]),S.push(A)}let y=this.device.createBuffer({size:l*2*4,usage:g.GPUBufferUsage.COPY_DST|g.GPUBufferUsage.MAP_READ});M.copyBufferToBuffer(x,0,y,0,l*2*4),this.device.queue.submit([M.finish()]),await y.mapAsync(g.GPUMapMode.READ);let P=new Uint32Array(y.getMappedRange().slice(0));return y.unmap(),y.destroy(),this.release(S),{ids:P.slice(0,l),vals:new Float32Array(P.buffer,l*4,l)}}resetLfm2State(){for(let t of this.lfm2KvGpu.values())t.k.destroy?.(),t.v.destroy?.();for(let t of this.lfm2ConvGpu.values())t.destroy?.();this.lfm2KvGpu.clear(),this.lfm2ConvGpu.clear(),this.lfm2Session="";for(let t of this.bufferPool.values())for(let r of t)r.destroy?.();this.bufferPool.clear()}clearLfm2State(){this.resetLfm2State()}ensureLfm2Kv(t,r,e){let n=this.lfm2KvGpu.get(t);if(n&&n.cap>=r)return n;let i=Math.max(r,(n?.cap??0)+1024,1024),s=this.storage(i*e*4),a=this.storage(i*e*4);if(n){let u=this.device.createCommandEncoder();u.copyBufferToBuffer(n.k,0,s,0,n.cap*e*4),u.copyBufferToBuffer(n.v,0,a,0,n.cap*e*4),this.device.queue.submit([u.finish()]),n.k.destroy?.(),n.v.destroy?.()}let o={k:s,v:a,cap:i};return this.lfm2KvGpu.set(t,o),o}ensureLfm2Conv(t,r){let e=this.lfm2ConvGpu.get(t);return e||(e=this.storage(r*4),this.device.queue.writeBuffer(e,0,new Float32Array(r)),this.lfm2ConvGpu.set(t,e)),e}recLfm2ShortConvBatch(t,r,e,n,i,s,a,o){let u=this.uniform([s,a,o]),c=this.storage(o*s*4);this.recordPass(t,"lfm2_shortconv_batch",[u,e,i,n,c],this.grid1D(o*s));let f=this.uniform([s,a,o]);return this.recordPass(t,"lfm2_shortconv_state",[f,e,n],this.grid1D((a-1)*s)),r.push(u,f,c),c}recordLfm2(t,r,e,n,i,s,a,o){let{D:u,nHeads:c,nKvHeads:f,headDim:l,ffn:g,eps:d,theta:m,lc:p}=i,w=f*l,G=c*l,D=w*4;for(let S=0;S<s.length;S++)s[S].conv?this.ensureLfm2Conv(S,(p-1)*u):this.ensureLfm2Kv(S,o+n,w);if(n>=p-1&&this.lfm2BatchOk){let S=this.storage(n*u*4);this.device.queue.writeBuffer(S,0,e),r.push(S);for(let U=0;U<s.length;U++){let v=s[U],b=this.recRmsnorm(t,r,S,v.attnNorm,n,u,d),k;if(v.conv){let q=this.recMM(t,r,b,v.inProj,n,u,3*u,!1),_=this.recLfm2ShortConvBatch(t,r,q,this.lfm2ConvGpu.get(U),v.convW,u,p,n);k=this.recMM(t,r,_,v.outProj,n,u,u,!1)}else{let q=this.recMM(t,r,b,v.wq,n,u,G,!1),_=this.recMM(t,r,b,v.wk,n,u,w,!1),O=this.recMM(t,r,b,v.wv,n,u,w,!1);q=this.recRmsnorm(t,r,q,v.qNorm,n*c,l,d),_=this.recRmsnorm(t,r,_,v.kNorm,n*f,l,d),q=this.recRope(t,r,q,n*c,l,c,o,m),_=this.recRope(t,r,_,n*f,l,f,o,m);let L=this.lfm2KvGpu.get(U);t.copyBufferToBuffer(_,0,L.k,o*D,n*D),t.copyBufferToBuffer(O,0,L.v,o*D,n*D);let T=this.recAttention(t,r,q,L.k,L.v,n,c,f,l,o+n,o);k=this.recMM(t,r,T,v.wo,n,G,u,!1)}S=this.recBinary(t,r,"add",S,k,n*u);let x=this.recRmsnorm(t,r,S,v.ffnNorm,n,u,d),y=this.recMM(t,r,x,v.wgate,n,u,g,!1),P=this.recMM(t,r,x,v.wup,n,u,g,!1),A=this.recBinary(t,r,"swiglu",y,P,n*g),B=this.recMM(t,r,A,v.wdown,n,g,u,!1);S=this.recBinary(t,r,"add",S,B,n*u)}let M=this.storage(u*4);return r.push(M),t.copyBufferToBuffer(S,(n-1)*u*4,M,0,u*4),this.recRmsnorm(t,r,M,a,1,u,d)}let F=null;for(let S=0;S<n;S++){let M=o+S,U=this.storage(u*4);this.device.queue.writeBuffer(U,0,e.subarray(S*u,(S+1)*u)),r.push(U);for(let v=0;v<s.length;v++){let b=s[v],k=this.recRmsnorm(t,r,U,b.attnNorm,1,u,d),x;if(b.conv){let _=this.recMM(t,r,k,b.inProj,1,u,3*u,!1),O=this.recLfm2ShortConv(t,r,_,this.lfm2ConvGpu.get(v),b.convW,u,p);x=this.recMM(t,r,O,b.outProj,1,u,u,!1)}else{let _=this.recMM(t,r,k,b.wq,1,u,G,!1),O=this.recMM(t,r,k,b.wk,1,u,w,!1),L=this.recMM(t,r,k,b.wv,1,u,w,!1);_=this.recRmsnorm(t,r,_,b.qNorm,c,l,d),O=this.recRmsnorm(t,r,O,b.kNorm,f,l,d),_=this.recRope(t,r,_,c,l,c,M,m),O=this.recRope(t,r,O,f,l,f,M,m);let T=this.lfm2KvGpu.get(v);t.copyBufferToBuffer(O,0,T.k,M*D,D),t.copyBufferToBuffer(L,0,T.v,M*D,D);let R=this.recAttention(t,r,_,T.k,T.v,1,c,f,l,M+1,M);x=this.recMM(t,r,R,b.wo,1,G,u,!1)}U=this.recBinary(t,r,"add",U,x,u);let y=this.recRmsnorm(t,r,U,b.ffnNorm,1,u,d),P=this.recMM(t,r,y,b.wgate,1,u,g,!1),A=this.recMM(t,r,y,b.wup,1,u,g,!1),B=this.recBinary(t,r,"swiglu",P,A,g),q=this.recMM(t,r,B,b.wdown,1,g,u,!1);U=this.recBinary(t,r,"add",U,q,u)}S===n-1&&(F=this.recRmsnorm(t,r,U,a,1,u,d))}return F}lfm2SessionReset(t,r){(t!==this.lfm2Session||r===0)&&(r>0&&console.error(`[lfm2] session "${t}" inconnue avec pastLen=${r} \u2014 \xE9tat perdu, sortie invalide. Repartir de pastLen 0.`),this.resetLfm2State(),this.lfm2Session=t)}async lfm2PrefillGpu(t,r,e,n,i,s,a){this.lfm2SessionReset(a,s);let o=[],u=this.device.createCommandEncoder();this.recordLfm2(u,o,t,r,e,n,i,s),this.device.queue.submit([u.finish()]),await this.device.queue.onSubmittedWorkDone(),this.release(o)}async lfm2LogitsGpu(t,r,e,n,i,s,a,o){let u=globalThis;this.lfm2SessionReset(o,a);let c=[],f=this.device.createCommandEncoder(),l=this.recordLfm2(f,c,t,r,e,n,s,a),g=this.recMM(f,c,l,i,1,e.D,e.vocab,!1),d=this.device.createBuffer({size:e.vocab*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});f.copyBufferToBuffer(g,0,d,0,e.vocab*4),this.device.queue.submit([f.finish()]),await d.mapAsync(u.GPUMapMode.READ);let m=new Float32Array(d.getMappedRange().slice(0));return d.unmap(),d.destroy(),this.release(c),m}async lfm2TopKGpu(t,r,e,n,i,s,a,o,u,c,f=64){let l=globalThis;this.lfm2SessionReset(o,a);let g=[],d=this.device.createCommandEncoder(),m=this.recordLfm2(d,g,t,r,e,n,s,a),p=this.recMM(d,g,m,i,1,e.D,e.vocab,!1);if(c&&c!==1&&u.length){let F=Uint32Array.from(u),S=this.bufU32(F,l.GPUBufferUsage.STORAGE|l.GPUBufferUsage.COPY_DST),M=this.uniform([F.length],{offset:4,value:c});this.recordPass(d,"penalize_logits",[M,S,p],this.grid1D(F.length)),g.push(M,S)}let w=this.storage(f*2*4);g.push(w);{let F=this.uniform([e.vocab,f]);this.recordPass(d,"top_k",[F,p,w],[1,1,1]),g.push(F)}let G=this.device.createBuffer({size:f*2*4,usage:l.GPUBufferUsage.COPY_DST|l.GPUBufferUsage.MAP_READ});d.copyBufferToBuffer(w,0,G,0,f*2*4),this.device.queue.submit([d.finish()]),await G.mapAsync(l.GPUMapMode.READ);let D=new Uint32Array(G.getMappedRange().slice(0));return G.unmap(),G.destroy(),this.release(g),{ids:D.slice(0,f),vals:new Float32Array(D.buffer,f*4,f)}}async argmaxProjection(t,r,e,n,i=!1){let s=globalThis,a=[],o=this.device.createCommandEncoder(),u=this.storage(t.byteLength);this.device.queue.writeBuffer(u,0,t),a.push(u);let c=this.storage(n*4);a.push(c);for(let m of r){let p=this.recMatmulT(o,a,u,m.buf,1,e,m.rows,i);o.copyBufferToBuffer(p,0,c,m.r0*4,m.rows*4)}let f=this.storage(4),l=this.uniform([n]);a.push(f,l),this.recordPass(o,"argmax",[l,c,f],[1,1,1]);let g=this.device.createBuffer({size:4,usage:s.GPUBufferUsage.COPY_DST|s.GPUBufferUsage.MAP_READ});o.copyBufferToBuffer(f,0,g,0,4),this.device.queue.submit([o.finish()]),await g.mapAsync(s.GPUMapMode.READ);let d=new Uint32Array(g.getMappedRange().slice(0))[0];return g.unmap(),g.destroy(),this.release(a),d}async projectLogits(t,r,e,n,i=!1){let s=globalThis,a=[],o=this.device.createCommandEncoder(),u=this.storage(t.byteLength);this.device.queue.writeBuffer(u,0,t),a.push(u);let c=this.storage(n*4);a.push(c);for(let g of r){let d=this.recMatmulT(o,a,u,g.buf,1,e,g.rows,i);o.copyBufferToBuffer(d,0,c,g.r0*4,g.rows*4)}let f=this.device.createBuffer({size:n*4,usage:s.GPUBufferUsage.COPY_DST|s.GPUBufferUsage.MAP_READ});o.copyBufferToBuffer(c,0,f,0,n*4),this.device.queue.submit([o.finish()]),await f.mapAsync(s.GPUMapMode.READ);let l=new Float32Array(f.getMappedRange().slice(0));return f.unmap(),f.destroy(),this.release(a),l}async selfValidate(){this.validationFailure=null;let t=U=>(this.validationFailure=U,console.error("[selfValidate] FAILED at:",U,"(hasF16="+this.hasF16+")"),!1),r=(U,v)=>U.length===v.length&&U.every((b,k)=>Math.abs(b-v[k])<.001),e=U=>Float32Array.from({length:U},()=>Math.random()*2-1),n=3,i=4,s=5,a=e(n*i),o=e(i*s),u=new Float32Array(n*s);for(let U=0;U<n;U++)for(let v=0;v<s;v++){let b=0;for(let k=0;k<i;k++)b+=a[U*i+k]*o[k*s+v];u[U*s+v]=b}if(!r(await this.matmul(a,o,n,i,s),u))return t("matmul");{let U=(b,k,x,y,P)=>{let A=new Float32Array(x*P);for(let B=0;B<x;B++)for(let q=0;q<P;q++){let _=0;for(let O=0;O<y;O++)_+=b[B*y+O]*k[q*y+O];A[B*P+q]=_}return A},v=async(b,k,x)=>{let y=e(b*k),P=e(x*k);return r(await this.matmulT(y,P,b,k,x),U(y,P,b,k,x))};if(!await v(3,8,5))return t("matmulT.vec4(3,8,5)");if(!await v(1,16,7))return t("matmulT.vec4(1,16,7)");if(!await v(2,6,4))return t("matmulT.scalar(2,6,4)");if(this.hasF16){let y=e(16),P=e(112),A=this.uploadGpuF16(P),B=await this.matmulT(y,A,1,16,7,!0),q=new Float32Array(7);for(let R=0;R<7;R++){let E=0;for(let j=0;j<16;j++)E+=y[j]*P[R*16+j];q[R]=E}A.destroy?.();let _=R=>R.length===q.length&&R.every((E,j)=>Math.abs(E-q[j])<=.03*(1+Math.abs(q[j])));if(!_(B))return t("matmulT.f16");let O=this.uploadGpu(P),L=this.f32ToF16Gpu(O,112),T=await this.matmulT(y,L,1,16,7,!0);if(O.destroy?.(),L.destroy?.(),!_(T))return t("packf16")}}{let k=e(128),x=e(768),y=Ue(x),P=this.uploadGpuRaw(y.nibbles),A=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),B=this.uploadGpuRaw(new Uint8Array(y.mins.buffer,y.mins.byteOffset,y.mins.byteLength)),q=await this.matmulQ4(k,P,A,B,1,128,6),_=se(y),O=new Float32Array(6);for(let j=0;j<6;j++){let W=0;for(let Y=0;Y<128;Y++)W+=k[Y]*_[j*128+Y];O[j]=W}if(P.destroy?.(),A.destroy?.(),B.destroy?.(),!r(q,O))return t("matmulQ4");let L=this.uploadGpu(x),T=this.f32ToQ4Gpu(L,768),R=await this.matmulQ4(k,T.nib,T.sc,T.mn,1,128,6);if(L.destroy?.(),T.nib.destroy?.(),T.sc.destroy?.(),T.mn.destroy?.(),!(R.length===O.length&&R.every((j,W)=>Math.abs(j-O[W])<=.06*(1+Math.abs(O[W]))+.02)))return t("quantize_q4")}{let k=e(640),x=e(768),y=Ee(x),P=this.uploadGpuRaw(new Uint8Array(y.lo.buffer,y.lo.byteOffset,y.lo.byteLength)),A=this.uploadGpuRaw(new Uint8Array(y.hi.buffer,y.hi.byteOffset,y.hi.byteLength)),B=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),q=this.uploadGpuRaw(new Uint8Array(y.mins.buffer,y.mins.byteOffset,y.mins.byteLength)),_=await this.matmulQ3(k,P,A,B,q,5,128,6),O=Se(y),L=new Float32Array(30);for(let T=0;T<5;T++)for(let R=0;R<6;R++){let E=0;for(let j=0;j<128;j++)E+=k[T*128+j]*O[R*128+j];L[T*6+R]=E}if(P.destroy?.(),A.destroy?.(),B.destroy?.(),q.destroy?.(),!r(_,L))return t("matmulQ3")}{let k=e(640),x=e(768),y=Ue(x),P=this.uploadGpuRaw(y.nibbles),A=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),B=this.uploadGpuRaw(new Uint8Array(y.mins.buffer,y.mins.byteOffset,y.mins.byteLength)),q=await this.matmulQ4Tiled(k,P,A,B,5,128,6),_=se(y),O=new Float32Array(30);for(let L=0;L<5;L++)for(let T=0;T<6;T++){let R=0;for(let E=0;E<128;E++)R+=k[L*128+E]*_[T*128+E];O[L*6+T]=R}if(P.destroy?.(),A.destroy?.(),B.destroy?.(),!r(q,O))return t("matmul_q4_tiled")}{let k=e(2560),x=e(2304),y=Ue(x),P=this.uploadGpuRaw(y.nibbles),A=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),B=this.uploadGpuRaw(new Uint8Array(y.mins.buffer,y.mins.byteOffset,y.mins.byteLength)),q=await this.matmulQ4Shared(k,P,A,B,20,128,18),_=se(y),O=new Float32Array(360);for(let L=0;L<20;L++)for(let T=0;T<18;T++){let R=0;for(let E=0;E<128;E++)R+=k[L*128+E]*_[T*128+E];O[L*18+T]=R}if(P.destroy?.(),A.destroy?.(),B.destroy?.(),!r(q,O))return t("matmul_q4_shared")}{let k=e(128),x=e(768),y=Pe(x),P=this.uploadGpuRaw(new Uint8Array(y.codes.buffer,y.codes.byteOffset,y.codes.byteLength)),A=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),B=await this.matmulQ8(k,P,A,1,128,6),q=le(y),_=new Float32Array(6);for(let R=0;R<6;R++){let E=0;for(let j=0;j<128;j++)E+=k[j]*q[R*128+j];_[R]=E}if(P.destroy?.(),A.destroy?.(),!r(B,_))return t("matmulQ8");let O=this.uploadGpu(x),L=this.f32ToQ8Gpu(O,768),T=await this.matmulQ8(k,L.codes,L.sc,1,128,6);if(O.destroy?.(),L.codes.destroy?.(),L.sc.destroy?.(),!r(T,_))return t("quantize_q8")}{let k=e(640),x=e(768),y=Pe(x),P=this.uploadGpuRaw(new Uint8Array(y.codes.buffer,y.codes.byteOffset,y.codes.byteLength)),A=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),B=await this.matmulQ8Tiled(k,P,A,5,128,6),q=le(y),_=new Float32Array(30);for(let O=0;O<5;O++)for(let L=0;L<6;L++){let T=0;for(let R=0;R<128;R++)T+=k[O*128+R]*q[L*128+R];_[O*6+L]=T}if(P.destroy?.(),A.destroy?.(),!r(B,_))return t("matmul_q8_tiled")}{let k=e(2560),x=e(2304),y=Pe(x),P=this.uploadGpuRaw(new Uint8Array(y.codes.buffer,y.codes.byteOffset,y.codes.byteLength)),A=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),B=await this.matmulQ8Shared(k,P,A,20,128,18),q=le(y),_=new Float32Array(360);for(let O=0;O<20;O++)for(let L=0;L<18;L++){let T=0;for(let R=0;R<128;R++)T+=k[O*128+R]*q[L*128+R];_[O*18+L]=T}if(P.destroy?.(),A.destroy?.(),!r(B,_))return t("matmul_q8_shared")}{let v=e(1632),b=new Uint8Array(v.buffer,v.byteOffset,v.byteLength),k=(x,y)=>x.length===y.length&&x.every((P,A)=>P===y[A]);if(!k(await this.quantizeToBytes("F32",b,1632,"q8"),await this.quantizeToBytes("F32",b,1632,"q8",256)))return t("quantize_chunk_q8");if(!k(await this.quantizeToBytes("F32",b,1632,"q4"),await this.quantizeToBytes("F32",b,1632,"q4",256)))return t("quantize_chunk_q4")}let c=2,f=8,l=e(c*f),g=e(f),d=new Float32Array(c*f);for(let U=0;U<c;U++){let v=0;for(let k=0;k<f;k++)v+=l[U*f+k]**2;let b=1/Math.sqrt(v/f+1e-5);for(let k=0;k<f;k++)d[U*f+k]=l[U*f+k]*b*g[k]}if(!r(await this.rmsnorm(l,g,c,f),d))return t("rmsnorm");if(!r(await this.rmsnorm(l,g,c,f,1e-5,!0),me(l,g,c,f,1e-5,!0)))return t("rmsnorm.onePlus");let m=e(16),p=e(16),w=m.map((U,v)=>U/(1+Math.exp(-U))*p[v]);if(!r(await this.swiglu(m,p),w))return t("swiglu");let G=m.map((U,v)=>We(U)*p[v]);if(!r(await this.geglu(m,p),G))return t("geglu");let D=m.map((U,v)=>U+p[v]);if(!r(await this.add(m,p),D))return t("add");{let U=I.MAX_WG_DIM*Z+257,v=new Float32Array(U),b=new Float32Array(U),k=[0,1,Z-1,Z,I.MAX_WG_DIM*Z-1,I.MAX_WG_DIM*Z,U-1];for(let P of k)v[P]=P%7-3,b[P]=P%5-2;let x=await this.add(v,b),y=x.length===U;for(let P of k)Math.abs(x[P]-(v[P]+b[P]))>1e-5&&(y=!1);if(!y)return t("grid1D.add(2D)")}let F=(U,v,b=.003)=>U.length===v.length&&U.every((k,x)=>Math.abs(k-v[x])<=b*(1+Math.abs(v[x])));{let y=e(8);if(!F(await this.rope(y,2,4,2,1,1e4),Be(y,2,4,2,1,1e4)))return t("rope")}{let y=e(384),P=new Float32Array(64/2).fill(1);if(!F(await this.ropeFactors(y,P,6,64,2,7,5e5),Be(y,6,64,2,7,5e5)))return t("rope_factors.ones");let A=Float32Array.from({length:64/2},(B,q)=>1+q%5*.7);if(!F(await this.ropeFactors(y,A,6,64,2,7,5e5),yt(y,A,6,64,2,7,5e5)))return t("rope_factors")}{let b=[16,24,24],k=1e6,x=3,y=x*2,P=5,A=e(y*128),B=new Uint32Array(x*3);for(let L=0;L<x;L++){let T=P+L;B.set([T,T,T],L*3)}let q=new Uint32Array([5,5,5,5,6,9,5,7,5]),_=F(await this.ropeMrope(A,B,y,128,2,b,k),Be(A,y,128,2,P,k)),O=F(await this.ropeMrope(A,q,y,128,2,b,k),bt(A,q,y,128,2,b,k));(!_||!O)&&(this.mropeOk=!1,console.error(`[selfValidate] rope_mrope KO sur ce GPU (${_?"positions 3D":"d\xE9g\xE9n\xE9r\xE9\u2260rope"}) \u2014 vision d\xE9sactiv\xE9e, chat texte intact.`))}{let P=e(32),A=e(32),B=e(32);if(!F(await this.attention(P,A,B,2,4,2,4,2),we(P,A,B,2,4,2,4,2)))return t("attention");let q=.3,_=5;if(!F(await this.attention(P,A,B,2,4,2,4,2,q,_),we(P,A,B,2,4,2,4,2,q,_)))return t("attention.softcap");{let O=await this.quantizeKvReadback(A,4,2,4),L=await this.quantizeKvReadback(B,4,2,4),T=await this.attentionQ8Kv(P,O.codes,O.scales,L.codes,L.scales,2,4,2,4,2),R=(V,X)=>{let C=new Float32Array(32);for(let z=0;z<4;z++)for(let N=0;N<2;N++){let $=X[z*2+N];for(let Q=0;Q<4;Q++){let K=z*2*4+N*4+Q,H=V[K>>2]>>(K&3)*8&255;C[K]=(H<128?H:H-256)*$}}return C},E=R(O.codes,O.scales),j=R(L.codes,L.scales),W=we(P,E,j,2,4,2,4,2);if(!F(T,W,.005))return t("attention.q8kv");let Y=0;for(let V=0;V<A.length;V++)Y=Math.max(Y,Math.abs(E[V]-A[V]));if(Y>.05)return t("quantize_kv.error")}}{let U=b=>{this.attnDecodeOk=!1,console.error("[selfValidate] attention d\xE9codage HS sur ce GPU (\xE9tape :",b,") \u2192 repli kernels classiques (plus lents \xE0 contexte long, corrects)")},v=[{nT:1,nH:14,nKv:2,hd:64,past:300},{nT:10,nH:14,nKv:2,hd:64,past:173}];for(let b of v){if(!this.attnDecodeOk)break;let k=b.past+b.nT,x=e(b.nT*b.nH*b.hd),y=e(k*b.nKv*b.hd),P=e(k*b.nKv*b.hd);if(!F(await this.attentionDecode(x,y,P,b.nT,b.nH,b.nKv,b.hd,b.past),we(x,y,P,b.nT,b.nH,b.nKv,b.hd,b.past))){U(`decode(nT=${b.nT})`);break}let A=await this.quantizeKvReadback(y,k,b.nKv,b.hd),B=await this.quantizeKvReadback(P,k,b.nKv,b.hd),q=await this.attentionQ8KvDecode(x,A.codes,A.scales,B.codes,B.scales,b.nT,b.nH,b.nKv,b.hd,b.past),_=await this.attentionQ8Kv(x,A.codes,A.scales,B.codes,B.scales,b.nT,b.nH,b.nKv,b.hd,b.past);if(!F(q,_,.005)){U(`decode.q8kv(nT=${b.nT})`);break}}if(this.attnDecodeOk){let A=e(64),B=e(350*8),q=e(350*8);F(await this.attentionDecode(A,B,q,2,4,2,8,173,.3,5),we(A,B,q,2,4,2,8,173,.3,5))||U("decode.softcap")}if(this.attnDecodeOk){let A=e(256),B=e(9088),q=e(9088);F(await this.attentionDecode(A,B,q,1,2,1,128,70),we(A,B,q,1,2,1,128,70))||U("decode.hd128")}}{let A={seq:3,d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},B={attnNorm:e(16),wq:e(256),wk:e(128),wv:e(128),wo:e(256),bq:e(16),bk:e(8),bv:e(8),ffnNorm:e(16),wgate:e(256),wup:e(256),wdown:e(256)},q=e(48);if(!F(await this.layerForward(q,A,B),Re(q,A,B),.005))return t("layerForward")}{let B={seq:3,d:12,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6,attnScale:1/Math.sqrt(4),attnLogitSoftcap:5,act:"gelu",rmsGainOnePlus:!0},q={attnNorm:e(12),wq:e(192),wk:e(96),wv:e(96),wo:e(192),ffnNorm:e(12),wgate:e(192),wup:e(192),wdown:e(192),postAttnNorm:e(12),postFfnNorm:e(12)},_=e(36);if(!F(await this.layerForward(_,B,q),Re(_,B,q),.005))return t("layerForward.gemma2")}{let B={seq:3,d:12,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e6,eps:1e-6},q={attnNorm:e(12),wq:e(192),wk:e(96),wv:e(96),wo:e(192),ffnNorm:e(12),wgate:e(192),wup:e(192),wdown:e(192),qNorm:e(4),kNorm:e(4)},_=e(36);if(!F(await this.layerForward(_,B,q),Re(_,B,q),.005))return t("layerForward.qwen3")}{let v=new Uint8Array(720);for(let k=0;k<5;k++){let x=k*144,y=new DataView(v.buffer);y.setUint16(x,ye(.005+Math.random()*.05),!0),y.setUint16(x+2,ye(.001+Math.random()*.02),!0);for(let P=4;P<144;P++)v[x+P]=Math.random()*256|0}let b=await this.dequantizeQ4K(v,5*256);if(!F(b,lt(v,5),1e-4))return t("dequant.Q4_K")}{let U=q=>{let _=new Uint8Array(q);for(let O=0;O<q;O++)_[O]=Math.random()*256|0;return _},v=(q,_)=>{let O=new DataView(q.buffer),L=T=>_===210?T*210+208:T*_;for(let T=0;T*_<q.length;T++)O.setUint16(L(T),ye(.005+Math.random()*.05),!0);return q},k=v(U(136),34);if(!F(await this.dequantizeByType("Q8_0",k,128),dt(k,4),1e-4))return t("dequant.Q8_0");let x=v(U(88),22);if(!F(await this.dequantizeByType("Q5_0",x,128),ht(x,4),1e-4))return t("dequant.Q5_0");let y=v(U(840),210);if(!F(await this.dequantizeByType("Q6_K",y,4*256),pt(y,4),1e-4))return t("dequant.Q6_K");let P=v(U(72),18);if(!F(await this.dequantizeByType("Q4_0",P,128),gt(P,4),1e-4))return t("dequant.Q4_0");let A=U(704),B=new DataView(A.buffer);for(let q=0;q<4;q++)B.setUint16(q*176,ye(.005+Math.random()*.05),!0),B.setUint16(q*176+2,ye(.001+Math.random()*.02),!0);if(!F(await this.dequantizeByType("Q5_K",A,4*256),mt(A,4),1e-4))return t("dequant.Q5_K")}{let P={d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},A={attnNorm:e(16),wq:e(256),wk:e(128),wv:e(128),wo:e(256),bq:e(16),bk:e(8),bv:e(8),ffnNorm:e(16),wgate:e(256),wup:e(256),wdown:e(256)},B=e(48),_=(await this.layerForward(B,{...P,seq:3},A)).slice(32,48),O=new Float32Array(0),L=await this.layerForwardKV(B.slice(0,32),{...P,seq:2},A,0,O,O),T=await this.layerForwardKV(B.slice(32,48),{...P,seq:1},A,2,L.k,L.v);if(!F(T.out,_,.005))return t("layerForwardKV")}{let b=e(4),k=e(40),x=new Float32Array(10);for(let B=0;B<10;B++){let q=0;for(let _=0;_<4;_++)q+=b[_]*k[B*4+_];x[B]=q}let y=0;for(let B=1;B<10;B++)x[B]>x[y]&&(y=B);let P=this.uploadGpu(k),A=await this.argmaxProjection(b,[{buf:P,rows:10,r0:0}],4,10,!1);if(P.destroy?.(),A!==y)return t("argmaxProjection")}{let P={seq:4,d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},A={attnNorm:e(16),wq:e(256),wk:e(128),wv:e(128),wo:e(256),bq:e(16),bk:e(8),bv:e(8),ffnNorm:e(16),wgate:e(256),wup:e(256),wdown:e(256)},B=e(16),q=e(64),_=new Float32Array(0),O=await this.layerForwardKV(q,{...P,seq:4},A,0,_,_,!0),L=me(O.out.slice(48,64),B,1,16,1e-6),T={attnNorm:this.uploadGpu(A.attnNorm),wq:this.uploadGpu(A.wq),wk:this.uploadGpu(A.wk),wv:this.uploadGpu(A.wv),wo:this.uploadGpu(A.wo),ffnNorm:this.uploadGpu(A.ffnNorm),wgate:this.uploadGpu(A.wgate),wup:this.uploadGpu(A.wup),wdown:this.uploadGpu(A.wdown),bq:this.uploadGpu(A.bq),bk:this.uploadGpu(A.bk),bv:this.uploadGpu(A.bv)},R=this.uploadGpu(B),E=this.kvQuant;this.kvQuant=!1,this.resetKvGpu();let j=await this.runDecodeGpu(q,{...P,seq:4},[T],0,R,"selftest-A");if(!F(j,L,.008))return this.resetKvGpu(),this.kvQuant=E,t("runDecodeGpu.prefill");await this.runDecodeGpu(q.slice(0,48),{...P,seq:3},[T],0,R,"selftest-B");let W=await this.runDecodeGpu(q.slice(48,64),{...P,seq:1},[T],3,R,"selftest-B");if(!F(W,L,.008))return this.resetKvGpu(),this.kvQuant=E,t("runDecodeGpu.decode");this.kvQuant=E,this.resetKvGpu();for(let Y of Object.values(T))Y?.destroy?.();R.destroy?.()}{let x=Float32Array.from({length:152064},()=>(Math.random()*2-1)*8),y=[...new Set(Array.from({length:40},()=>Math.floor(Math.random()*152064)))],P=x.slice();for(let C=0;C<152064;C++)P[C]=30*Math.tanh(P[C]/30);for(let C of y)P[C]=P[C]>0?P[C]/1.15:P[C]*1.15;let A=Array.from(P.keys()).sort((C,z)=>P[z]-P[C]).slice(0,64),B=globalThis,q=[],_=this.storage(152064*4);this.device.queue.writeBuffer(_,0,x),q.push(_);let O=this.device.createCommandEncoder(),L=this.uniform([152064],{offset:4,value:30});this.recordPass(O,"softcap_logits",[L,_],this.grid1D(152064));let T=this.bufU32(Uint32Array.from(y),B.GPUBufferUsage.STORAGE|B.GPUBufferUsage.COPY_DST),R=this.uniform([y.length],{offset:4,value:1.15});this.recordPass(O,"penalize_logits",[R,T,_],this.grid1D(y.length));let E=this.storage(512),j=this.uniform([152064,64]);this.recordPass(O,"top_k",[j,_,E],[1,1,1]),q.push(L,T,R,j,E);let W=this.device.createBuffer({size:512,usage:B.GPUBufferUsage.COPY_DST|B.GPUBufferUsage.MAP_READ});O.copyBufferToBuffer(E,0,W,0,512),this.device.queue.submit([O.finish()]),await W.mapAsync(B.GPUMapMode.READ);let Y=new Uint32Array(W.getMappedRange().slice(0));W.unmap(),W.destroy(),this.release(q);let V=Y.slice(0,64),X=new Float32Array(Y.buffer,256,64);this.topKOk=!0;for(let C=0;C<64;C++){let z=Math.abs(X[C]-P[A[C]])<=1e-4*(1+Math.abs(P[A[C]])),N=Math.abs(P[V[C]]-X[C])<=1e-4*(1+Math.abs(X[C]));if(!z||!N){this.topKOk=!1,console.error(`[selfValidate] top_k KO sur ce GPU (rang ${C}) \u2014 repli sur le sampling CPU plein-vocab (plus lent, m\xEAme r\xE9sultat).`);break}}}if(this.rwkvWkv7Ok){let k=e(128),x=e(16),y=e(16),P=e(16),A=e(16),B=e(16),q=Float32Array.from({length:16},()=>Math.random()*.5+.5),_=k.slice(),O=new Float32Array(16);for(let X=0;X<2;X++){let C=X*8;for(let z=0;z<8;z++){let N=X*8*8+z*8,$=P[C+z],Q=0;for(let H=0;H<8;H++)Q+=B[C+H]*_[N+H];let K=0;for(let H=0;H<8;H++){let J=q[C+H]*_[N+H]+$*y[C+H]+A[C+H]*Q;_[N+H]=J,K+=x[C+H]*J}O[C+z]=K}}let L=await this.rwkvWkv7(k.slice(),x,q,y,P,B,A,2,8),T=(X,C)=>X.length===C.length&&X.every((z,N)=>Math.abs(z-C[N])<=.001*(1+Math.abs(C[N])));!T(L.S,_)||!T(L.y,O)?(this.rwkvWkv7Ok=!1,console.error("[selfValidate] RWKV-7 WKV KO sur ce GPU \u2014 une archi RWKV (moteur v2) refuserait de charger (non bloquant pour le chat texte).")):console.log("[selfValidate] RWKV-7 WKV OK (r\xE9currence \xE0 \xE9tat fixe, moteur v2)");let R=16,E=e(R),j=e(R),W=e(R*6),Y=new Float32Array(R*6);for(let X=0;X<6;X++)for(let C=0;C<R;C++){let z=X*R+C;Y[z]=E[C]+(j[C]-E[C])*W[z]}let V=await this.rwkvTokenShift(E,j,W,R);T(V,Y)?console.log("[selfValidate] RWKV-7 token-shift OK"):(this.rwkvWkv7Ok=!1,console.error("[selfValidate] RWKV-7 token-shift KO sur ce GPU (non bloquant pour le chat texte)."))}if(this.lfm2ShortConvOk){let U=_=>Float32Array.from({length:_},()=>Math.random()*2-1),v=(_,O)=>_.length===O.length&&_.every((L,T)=>Math.abs(L-O[T])<=.001*(1+Math.abs(O[T]))),x=U(96),y=U(64),P=U(96),A=new Float32Array(32),B=y.slice();for(let _=0;_<32;_++){let O=x[_]*x[64+_],L=P[_*3+2]*O;for(let T=0;T<2;T++)L+=P[_*3+T]*y[T*32+_];for(let T=0;T+2<3;T++)B[T*32+_]=y[(T+1)*32+_];B[32+_]=O,A[_]=L*x[32+_]}let q=await this.lfm2ShortConv(x,y.slice(),P,32,3);!v(q.out,A)||!v(q.state,B)?(this.lfm2ShortConvOk=!1,console.error("[selfValidate] LFM2 shortconv KO sur ce GPU \u2014 une archi lfm2 refuserait de charger (non bloquant pour le reste).")):console.log("[selfValidate] LFM2 shortconv OK (conv courte gat\xE9e, moteur v2)")}let S=await this.validateDiffusion();S?console.warn("[selfValidate] image-gen primitive KO:",S,"(non bloquant \u2014 chemin texte intact)"):console.log("[selfValidate] image-gen primitives OK (silu, group_norm, conv2d, conv2d_direct, conv2d_direct_q8, relu, upsample_nearest, layernorm, quick_gelu, attention_full)");let M=await this.validateVideoResident();return M?(this.videoResidentOk=!1,console.warn("[selfValidate] motion r\xE9sident KO:",M,"\u2014 repli JS+readback (plus lent, m\xEAme r\xE9sultat).")):console.log("[selfValidate] motion r\xE9sident OK (video_motion_gather, video_motion_scatter, video_add_pe, attn_temporal)"),!0}async validateVideoResident(){let t=o=>Float32Array.from({length:o},()=>Math.random()*2-1),r=(o,u,c=.005)=>o.length===u.length&&o.every((f,l)=>Math.abs(f-u[l])<=c*(1+Math.abs(u[l])));{let o=t(120),u=new Float32Array(120);for(let l=0;l<5;l++)for(let g=0;g<3;g++)for(let d=0;d<8;d++)u[(l*3+g)*8+d]=o[(g*8+d)*5+l];let c=this.recordingSession(),f=await c.finish(c.videoGather(o,3,8,5),120);if(!r(f,u,1e-6))return"video_motion_gather"}{let o=t(120),u=t(120),c=new Float32Array(120);for(let g=0;g<3;g++)for(let d=0;d<8;d++)for(let m=0;m<5;m++)c[(g*8+d)*5+m]=o[(m*3+g)*8+d]+u[(g*8+d)*5+m];let f=this.recordingSession(),l=await f.finish(f.videoScatter(o,u,3,8,5),120);if(!r(l,c,1e-6))return"video_motion_scatter"}{let o=t(120),u=t(24),c=new Float32Array(120);for(let g=0;g<5;g++)for(let d=0;d<3;d++)for(let m=0;m<8;m++)c[(g*3+d)*8+m]=o[(g*3+d)*8+m]+u[d*8+m];let f=this.recordingSession(),l=await f.finish(f.videoAddPe(o,u,3,8,5),120);if(!r(l,c,1e-6))return"video_add_pe"}{let o=t(120),u=t(120),c=t(120),f=1/Math.sqrt(4),l=new Float32Array(120);for(let m=0;m<5;m++)for(let p=0;p<2;p++){let w=p*4,G=m*3;for(let D=0;D<3;D++){let F=(G+D)*8+w,S=new Float32Array(3),M=-1e30;for(let v=0;v<3;v++){let b=0,k=(G+v)*8+w;for(let x=0;x<4;x++)b+=o[F+x]*u[k+x];S[v]=b*f,S[v]>M&&(M=S[v])}let U=0;for(let v=0;v<3;v++)S[v]=Math.exp(S[v]-M),U+=S[v];for(let v=0;v<3;v++){let b=S[v]/U,k=(G+v)*8+w;for(let x=0;x<4;x++)l[F+x]+=b*c[k+x]}}}let g=this.recordingSession(),d=await g.finish(g.attnTemporal(o,u,c,5,3,2,4),120);if(!r(d,l))return"attn_temporal"}return null}async validateDiffusion(){let t=C=>Float32Array.from({length:C},()=>Math.random()*2-1),r=(C,z,N=.005)=>C.length===z.length&&C.every(($,Q)=>Math.abs($-z[Q])<=N*(1+Math.abs(z[Q]))),e=t(70),n=e.map(C=>C/(1+Math.exp(-C)));if(!r(await this.silu(e),n))return"silu";let i=4,s=5,a=2,o=1e-5,u=t(i*s),c=t(i),f=t(i),l=new Float32Array(i*s),g=i/a;for(let C=0;C<a;C++){let z=C*g*s,N=g*s,$=0;for(let H=0;H<N;H++)$+=u[z+H];$/=N;let Q=0;for(let H=0;H<N;H++){let J=u[z+H]-$;Q+=J*J}Q/=N;let K=1/Math.sqrt(Q+o);for(let H=0;H<N;H++){let J=C*g+Math.floor(H/s);l[z+H]=(u[z+H]-$)*K*c[J]+f[J]}}if(!r(await this.groupNorm(u,c,f,i,s,a,o),l))return"group_norm";let d=2,m=4,p=4,w=3,G=3,D=1,F=1,S=4,M=4,U=t(d*m*p),v=t(w*d*G*G),b=t(w),k=new Float32Array(w*S*M);for(let C=0;C<w;C++)for(let z=0;z<S;z++)for(let N=0;N<M;N++){let $=b[C];for(let Q=0;Q<d;Q++)for(let K=0;K<G;K++)for(let H=0;H<G;H++){let J=z*D+K-F,re=N*D+H-F;J>=0&&J<m&&re>=0&&re<p&&($+=U[Q*m*p+J*p+re]*v[((C*d+Q)*G+K)*G+H])}k[(C*S+z)*M+N]=$}if(!r(await this.conv2d(U,v,b,d,m,p,w,G,G,D,F),k))return"conv2d";if(!r(await this.conv2dDirect(U,v,b,d,m,p,w,G,G,D,F),k))return"conv2d_direct";{let Q=t(1200),K=t(108),H=t(4),J=await this.conv2dDirect(Q,K,H,3,20,20,4,3,3,1,1),re=this.convTiledOk;this.convTiledOk=!0;let ue=this.recordingSession(),de=await ue.finish(ue.conv2d(Q,K,H,3,20,20,4,3,3,1,1),1600);this.convTiledOk=re,r(de,J)||(this.convTiledOk=!1,console.warn("[selfValidate] conv2d_3x3_tiled KO sur ce GPU \u2014 repli sur conv2d_direct (plus lent, m\xEAme r\xE9sultat)."))}{let N=t(8*m*p),$=t(32*G*G),Q=t(4),K=Pe($),H=await this.conv2dDirect(N,le(K),Q,8,m,p,4,G,G,D,F),J={codes:this.uploadGpuRaw(new Uint8Array(K.codes.buffer,K.codes.byteOffset,K.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(K.scales.buffer,K.scales.byteOffset,K.scales.byteLength))},re=this.recordingSession(),ue=await re.finish(re.conv2d(N,J,Q,8,m,p,4,G,G,D,F),4*m*p);if(this.releaseGpu([J.codes,J.sc]),!r(ue,H))return"conv2d_direct_q8"}{let N=t(8*m*p),$=t(32*G*G),Q=t(4),K=Ue($),H=await this.conv2dDirect(N,se(K),Q,8,m,p,4,G,G,D,F),J={nib:this.uploadGpuRaw(K.nibbles),sc:this.uploadGpuRaw(new Uint8Array(K.scales.buffer,K.scales.byteOffset,K.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(K.mins.buffer,K.mins.byteOffset,K.mins.byteLength))},re=this.recordingSession(),ue=await re.finish(re.conv2d(N,J,Q,8,m,p,4,G,G,D,F),4*m*p);if(this.releaseGpu([J.nib,J.sc,J.mn]),!r(ue,H))return"conv2d_direct_q4"}{let z=t(66),N=new Uint16Array(66);for(let H=0;H<66;H++)N[H]=ye(z[H]);let $=new Float32Array(66);for(let H=0;H<66;H++)$[H]=ne(N[H]);let Q=this.f16ToF32Gpu(new Uint8Array(N.buffer,N.byteOffset,N.byteLength),66),K=await this.readGpu(Q,66);if(Q.destroy?.(),!r(K,$,1e-6))return"f16_to_f32"}let x=t(70);if(!r(await this.relu(x),x.map(C=>Math.max(C,0))))return"relu";let y=2,P=2,A=2,B=2,q=P*B,_=A*B,O=t(y*P*A),L=new Float32Array(y*q*_);for(let C=0;C<y;C++)for(let z=0;z<q;z++)for(let N=0;N<_;N++)L[C*q*_+z*_+N]=O[C*P*A+Math.floor(z/B)*A+Math.floor(N/B)];if(!r(await this.upsampleNearest(O,y,P,A,B),L))return"upsample_nearest";let T=2,R=8,E=1e-5,j=t(T*R),W=t(R),Y=t(R),V=new Float32Array(T*R);for(let C=0;C<T;C++){let z=C*R,N=0;for(let K=0;K<R;K++)N+=j[z+K];N/=R;let $=0;for(let K=0;K<R;K++){let H=j[z+K]-N;$+=H*H}$/=R;let Q=1/Math.sqrt($+E);for(let K=0;K<R;K++)V[z+K]=(j[z+K]-N)*Q*W[K]+Y[K]}if(!r(await this.layernorm(j,W,Y,T,R,E),V))return"layernorm";let X=t(70);if(!r(await this.quickGelu(X),X.map(C=>C/(1+Math.exp(-1.702*C)))))return"quick_gelu";{let K=1/Math.sqrt(4),H=t(24),J=t(40),re=t(40),ue=new Float32Array(24);for(let de=0;de<2;de++)for(let qe=0;qe<3;qe++){let be=new Float32Array(5),Me=-1/0;for(let ee=0;ee<5;ee++){let ke=0;for(let ce=0;ce<4;ce++)ke+=H[qe*8+de*4+ce]*J[ee*8+de*4+ce];be[ee]=ke*K,be[ee]>Me&&(Me=be[ee])}let Ne=0;for(let ee=0;ee<5;ee++)be[ee]=Math.exp(be[ee]-Me),Ne+=be[ee];for(let ee=0;ee<4;ee++){let ke=0;for(let ce=0;ce<5;ce++)ke+=be[ce]/Ne*re[ce*8+de*4+ee];ue[qe*8+de*4+ee]=ke}}if(!r(await this.attentionFull(H,J,re,3,2,2,4,5),ue))return"attention_full"}if(this.attnFullWgOk){let C=[{nT:70,kvL:70,nH:5,hd:64},{nT:16,kvL:77,nH:5,hd:64},{nT:9,kvL:9,nH:8,hd:160}];for(let z of C){let N=z.nH*z.hd,$=t(z.nT*N),Q=t(z.kvL*N),K=t(z.kvL*N),H=await this.attentionFull($,Q,K,z.nT,z.nH,z.nH,z.hd,z.kvL),J=await this.attentionFullWg($,Q,K,z.nT,z.nH,z.nH,z.hd,z.kvL);if(!r(J,H)){this.attnFullWgOk=!1,console.warn(`[selfValidate] attention_full_wg KO sur ce GPU (hd=${z.hd}, kv=${z.kvL}) \u2014 repli sur attention_full (plus lent, m\xEAme r\xE9sultat).`);break}}}return null}};I.MAX_WG_DIM=65535,I.BLOCK_ELEMS={Q4_K:256,Q5_K:256,Q6_K:256,Q8_0:32,Q5_0:32,Q4_0:32,F32:1,F16:1},I.DEQUANT_SHADER={Q4_K:"dequant_q4k",Q8_0:"dequant_q8_0",Q5_0:"dequant_q5_0",Q6_K:"dequant_q6k",Q4_0:"dequant_q4_0",Q5_K:"dequant_q5k"},I.STORAGE_USAGE=140;var Oe=I;function ne(h){let t=h>>15&1,r=h>>10&31,e=h&1023,n;return r===0?n=e*59604645e-15:r===31?n=65504:n=(1+e/1024)*2**(r-15),t===1?-n:n}function ye(h){let t=new Float32Array(1),r=new Uint32Array(t.buffer);t[0]=h;let e=r[0],n=e>>16&32768,i=(e>>23&255)-127+15,s=e&8388607;return i<=0?n:i>=31?n|31743:(s=(s>>13)+(s>>12&1),s===1024&&(s=0,i+=1),n|i<<10|s&1023)}function lt(h,t){let r=new Float32Array(t*256),e=new DataView(h.buffer,h.byteOffset);for(let n=0;n<t;n++){let i=n*144,s=ne(e.getUint16(i,!0)),a=ne(e.getUint16(i+2,!0)),o=l=>{let g=d=>h[i+4+d];return l<4?[g(l)&63,g(l+4)&63]:[g(l+4)&15|g(l-4)>>6<<4,g(l+4)>>4|g(l)>>6<<4]},u=n*256,c=0,f=0;for(let l=0;l<256;l+=64){let[g,d]=o(c),m=s*g,p=a*d,[w,G]=o(c+1),D=s*w,F=a*G;for(let S=0;S<32;S++){let M=h[i+16+f+S];r[u+l+S]=m*(M&15)-p,r[u+l+32+S]=D*(M>>4)-F}f+=32,c+=2}}return r}function Ge(h){return h>127?h-256:h}function dt(h,t){let r=new Float32Array(t*32),e=new DataView(h.buffer,h.byteOffset);for(let n=0;n<t;n++){let i=n*34,s=ne(e.getUint16(i,!0));for(let a=0;a<32;a++)r[n*32+a]=s*Ge(h[i+2+a])}return r}function ht(h,t){let r=new Float32Array(t*32),e=new DataView(h.buffer,h.byteOffset);for(let n=0;n<t;n++){let i=n*22,s=ne(e.getUint16(i,!0)),a=e.getUint32(i+2,!0);for(let o=0;o<16;o++){let u=h[i+6+o],c=a>>>o<<4&16,f=a>>>o+12&16;r[n*32+o]=s*((u&15|c)-16),r[n*32+o+16]=s*((u>>4|f)-16)}}return r}function gt(h,t){let r=new Float32Array(t*32),e=new DataView(h.buffer,h.byteOffset);for(let n=0;n<t;n++){let i=n*18,s=ne(e.getUint16(i,!0));for(let a=0;a<16;a++){let o=h[i+2+a];r[n*32+a]=s*((o&15)-8),r[n*32+a+16]=s*((o>>4)-8)}}return r}function mt(h,t){let r=new Float32Array(t*256),e=new DataView(h.buffer,h.byteOffset);for(let n=0;n<t;n++){let i=n*176,s=ne(e.getUint16(i,!0)),a=ne(e.getUint16(i+2,!0)),o=d=>{let m=p=>h[i+4+p];return d<4?[m(d)&63,m(d+4)&63]:[m(d+4)&15|m(d-4)>>6<<4,m(d+4)>>4|m(d)>>6<<4]},u=n*256,c=0,f=0,l=1,g=2;for(let d=0;d<256;d+=64){let[m,p]=o(c),w=s*m,G=a*p,[D,F]=o(c+1),S=s*D,M=a*F;for(let U=0;U<32;U++){let v=h[i+48+f+U],b=h[i+16+U];r[u+d+U]=w*((v&15)+(b&l?16:0))-G,r[u+d+32+U]=S*((v>>4)+(b&g?16:0))-M}f+=32,c+=2,l<<=2,g<<=2}}return r}function pt(h,t){let r=new Float32Array(t*256),e=new DataView(h.buffer,h.byteOffset);for(let n=0;n<t;n++){let i=n*210,s=ne(e.getUint16(i+208,!0)),a=n*256;for(let o=0;o<2;o++){let u=i+o*64,c=i+128+o*32,f=i+192+o*8,l=a+o*128;for(let g=0;g<32;g++){let d=g/16|0,m=h[u+g],p=h[u+g+32],w=h[c+g],G=(m&15|(w>>0&3)<<4)-32,D=(p&15|(w>>2&3)<<4)-32,F=(m>>4|(w>>4&3)<<4)-32,S=(p>>4|(w>>6&3)<<4)-32;r[l+g]=s*Ge(h[f+d])*G,r[l+g+32]=s*Ge(h[f+d+2])*D,r[l+g+64]=s*Ge(h[f+d+4])*F,r[l+g+96]=s*Ge(h[f+d+6])*S}}}return r}function ve(h,t,r,e,n){let i=new Float32Array(r*n);for(let s=0;s<r;s++)for(let a=0;a<n;a++){let o=0;for(let u=0;u<e;u++)o+=h[s*e+u]*t[u*n+a];i[s*n+a]=o}return i}function me(h,t,r,e,n=1e-5,i=!1){let s=new Float32Array(r*e);for(let a=0;a<r;a++){let o=0;for(let c=0;c<e;c++)o+=h[a*e+c]**2;let u=1/Math.sqrt(o/e+n);for(let c=0;c<e;c++)s[a*e+c]=h[a*e+c]*u*(i?1+t[c]:t[c])}return s}function bt(h,t,r,e,n,i,s){let a=new Float32Array(h.length),o=e/2,u=i[0],c=i[0]+i[1];for(let f=0;f<r;f++){let l=Math.floor(f/n),g=f*e;for(let d=0;d<o;d++){let m=d<u?0:d<c?1:2,w=t[l*3+m]/s**(2*d/e),G=Math.cos(w),D=Math.sin(w),F=h[g+d],S=h[g+d+o];a[g+d]=F*G-S*D,a[g+d+o]=S*G+F*D}}return a}function yt(h,t,r,e,n,i=0,s=1e4){let a=new Float32Array(h.length),o=e/2;for(let u=0;u<r;u++){let c=i+Math.floor(u/n),f=u*e;for(let l=0;l<o;l++){let g=c/(s**(2*l/e)*t[l]),d=Math.cos(g),m=Math.sin(g),p=h[f+l],w=h[f+l+o];a[f+l]=p*d-w*m,a[f+l+o]=w*d+p*m}}return a}function Be(h,t,r,e,n=0,i=1e4){let s=new Float32Array(h.length),a=r/2;for(let o=0;o<t;o++){let u=n+Math.floor(o/e),c=o*r;for(let f=0;f<a;f++){let l=u/i**(2*f/r),g=Math.cos(l),d=Math.sin(l),m=h[c+f],p=h[c+f+a];s[c+f]=m*g-p*d,s[c+f+a]=p*g+m*d}}return s}function Le(h,t,r){return h.map((e,n)=>e+t[n%r])}function we(h,t,r,e,n,i,s,a=0,o,u=0){let c=new Float32Array(e*n*s),f=o??1/Math.sqrt(s),l=d=>u>0?u*Math.tanh(d/u):d,g=n/i;for(let d=0;d<e;d++)for(let m=0;m<n;m++){let p=Math.floor(m/g),w=(d*n+m)*s,G=a+d,D=[],F=-1/0;for(let M=0;M<=G;M++){let U=(M*i+p)*s,v=0;for(let k=0;k<s;k++)v+=h[w+k]*t[U+k];let b=l(v*f);D[M]=b,b>F&&(F=b)}let S=0;for(let M=0;M<=G;M++)D[M]=Math.exp(D[M]-F),S+=D[M];for(let M=0;M<=G;M++){let U=D[M]/S,v=(M*i+p)*s;for(let b=0;b<s;b++)c[w+b]+=U*r[v+b]}}return c}function We(h){return .5*h*(1+Math.tanh(.7978845608*(h+.044715*h*h*h)))}function Re(h,t,r){let{seq:e,d:n,nHeads:i,nKvHeads:s,headDim:a,ffn:o,ropeTheta:u,eps:c}=t,f=s*a,l=i*a,g=t.rmsGainOnePlus===!0,d=t.attnLogitSoftcap??0,m=me(h,r.attnNorm,e,n,c,g),p=ve(m,r.wq,e,n,l),w=ve(m,r.wk,e,n,f),G=ve(m,r.wv,e,n,f);r.bq&&(p=Le(p,r.bq,l)),r.bk&&(w=Le(w,r.bk,f)),r.bv&&(G=Le(G,r.bv,f)),r.qNorm&&(p=me(p,r.qNorm,e*i,a,c,g)),r.kNorm&&(w=me(w,r.kNorm,e*s,a,c,g));let D=Be(p,e*i,a,i,0,u),F=Be(w,e*s,a,s,0,u),S=we(D,F,G,e,i,s,a,0,t.attnScale,d),M=ve(S,r.wo,e,l,n);r.postAttnNorm&&(M=me(M,r.postAttnNorm,e,n,c,g));let U=h.map((P,A)=>P+M[A]),v=me(U,r.ffnNorm,e,n,c,g),b=ve(v,r.wgate,e,n,o),k=ve(v,r.wup,e,n,o),x=t.act==="gelu"?b.map((P,A)=>We(P)*k[A]):b.map((P,A)=>P/(1+Math.exp(-P))*k[A]),y=ve(x,r.wdown,e,o,n);return r.postFfnNorm&&(y=me(y,r.postFfnNorm,e,n,c,g)),U.map((P,A)=>P+y[A])}function Ye(h,t){let r=new DataView(h.buffer,h.byteOffset,h.byteLength),e=new Float32Array(t);for(let n=0;n<t;n++)e[n]=te(r.getUint16(n*2,!0));return e}function Ve(h,t){let r=new DataView(h.buffer,h.byteOffset,h.byteLength),e=new Float32Array(t);for(let n=0;n<t;n++)e[n]=r.getFloat32(n*4,!0);return e}function _e(h,t,r,e){let n=0;for(let a=0;a<r;a++)n+=h[a]*h[a];let i=1/Math.sqrt(n/r+e),s=new Float32Array(r);for(let a=0;a<r;a++)s[a]=h[a]*i*t[a];return s}var vt=h=>h/(1+Math.exp(-h)),Ae=class Ae{constructor(t,r,e){this.engine=t;this.manifest=r;this.raw=e;this.w=new Map;this.g=new Map;this.pos=0;this.rLayers=[];this.tokNormGpu=null;this.normBufs=[];this.ffn=0}isBigProj(t){return/\.(shortconv\.(in_proj|out_proj)|attn_(q|k|v|output)|ffn_(gate|up|down))\.weight$/.test(t)}async load(t){if(!this.engine.lfm2ShortConvOk)throw new Error("kernel shortconv LFM2 invalid\xE9 sur ce GPU (selfValidate) \u2014 archi lfm2 refus\xE9e.");let r=this.manifest.arch;if(this.D=r.d,this.NH=r.nHeads,this.NKV=r.nKvHeads,this.HD=r.headDim,this.NL=r.blockCount,this.vocab=r.vocab,this.EPS=r.rmsEps,this.THETA=r.ropeTheta,!r.lfm2)throw new Error("manifest sans profil lfm2");this.LC=r.lfm2.lCache,this.convLayer=r.lfm2.kvHeadsPerLayer.map(e=>e===0),this.tok=t,this.stops=new Set(this.manifest.chat?.stopTokenIds?.length?this.manifest.chat.stopTokenIds:[7]);for(let[e,n]of Object.entries(this.manifest.tensors)){if(e==="token_embd.weight"){if(this.embedBytes=await this.raw(e),this.embedDtype=n.dtype,n.dtype==="q4"){let s=fe(this.embedBytes,n.nElems);this.g.set("head",{kind:"q4",nib:this.engine.uploadGpuRaw(s.nibbles),sc:this.up(s.scales),mn:this.up(s.mins),IN:this.D,OUT:this.vocab})}else if(n.dtype==="q8"){let s=ge(this.embedBytes,n.nElems);this.g.set("head",{kind:"q8",codes:this.upI8(s.codes),sc:this.up(s.scales),IN:this.D,OUT:this.vocab})}continue}let i=await this.raw(e);if(this.isBigProj(e)&&(n.dtype==="q4"||n.dtype==="q8")){let s=n.shape[0],a=n.nElems/s;if(n.dtype==="q8"){let o=ge(i,n.nElems);this.g.set(e,{kind:"q8",codes:this.upI8(o.codes),sc:this.up(o.scales),IN:s,OUT:a})}else{let o=fe(i,n.nElems);this.g.set(e,{kind:"q4",nib:this.engine.uploadGpuRaw(o.nibbles),sc:this.up(o.scales),mn:this.up(o.mins),IN:s,OUT:a})}}else this.w.set(e,n.dtype==="f32"?Ve(i,n.nElems):n.dtype==="f16"?Ye(i,n.nElems):n.dtype==="q8"?le(ge(i,n.nElems)):se(fe(i,n.nElems)))}this.buildResidentLayers(),this.reset()}buildResidentLayers(){let t=r=>{let e=this.engine.uploadGpu(this.w.get(r));return this.normBufs.push(e),e};this.tokNormGpu=t("token_embd_norm.weight"),this.ffn=this.g.get("blk.0.ffn_gate.weight")?.OUT??0,this.rLayers=[];for(let r=0;r<this.NL;r++){let e=`blk.${r}.`,n={attnNorm:t(e+"attn_norm.weight"),ffnNorm:t(e+"ffn_norm.weight"),wgate:this.g.get(e+"ffn_gate.weight"),wup:this.g.get(e+"ffn_up.weight"),wdown:this.g.get(e+"ffn_down.weight")};this.convLayer[r]?this.rLayers.push({conv:!0,...n,convW:t(e+"shortconv.conv.weight"),inProj:this.g.get(e+"shortconv.in_proj.weight"),outProj:this.g.get(e+"shortconv.out_proj.weight")}):this.rLayers.push({conv:!1,...n,qNorm:t(e+"attn_q_norm.weight"),kNorm:t(e+"attn_k_norm.weight"),wq:this.g.get(e+"attn_q.weight"),wk:this.g.get(e+"attn_k.weight"),wv:this.g.get(e+"attn_v.weight"),wo:this.g.get(e+"attn_output.weight")})}}residentAvailable(){return this.engine.lfm2ResidentOk!==!1&&!!this.g.get("head")&&this.rLayers.length===this.NL&&this.ffn>0}cfg(){return{D:this.D,nHeads:this.NH,nKvHeads:this.NKV,headDim:this.HD,ffn:this.ffn,eps:this.EPS,theta:this.THETA,lc:this.LC,vocab:this.vocab}}embedsFor(t){let r=this.D,e=new Float32Array(t.length*r);for(let n=0;n<t.length;n++)e.set(this.embedRow(t[n]),n*r);return e}async logitsGpu(t,r,e){return this.pos=r+t.length,this.engine.lfm2LogitsGpu(this.embedsFor(t),t.length,this.cfg(),this.rLayers,this.g.get("head"),this.tokNormGpu,r,e)}async topKGpu(t,r,e,n,i,s=40){return this.pos=r+t.length,this.engine.lfm2TopKGpu(this.embedsFor(t),t.length,this.cfg(),this.rLayers,this.g.get("head"),this.tokNormGpu,r,e,n,i,s)}async prefillGpu(t,r,e){this.pos=r+t.length,await this.engine.lfm2PrefillGpu(this.embedsFor(t),t.length,this.cfg(),this.rLayers,this.tokNormGpu,r,e)}up(t){return this.engine.uploadGpuRaw(new Uint8Array(t.buffer,t.byteOffset,t.byteLength))}upI8(t){return this.engine.uploadGpuRaw(new Uint8Array(t.buffer,t.byteOffset,t.byteLength))}unload(){for(let t of this.g.values())for(let r of["nib","sc","mn","codes"])t[r]?.destroy?.();for(let t of this.normBufs)t?.destroy?.();this.normBufs=[],this.rLayers=[],this.tokNormGpu=null,this.engine.clearLfm2State?.(),this.g.clear(),this.w.clear()}reset(){this.pos=0,this.state=Array.from({length:this.NL},(t,r)=>this.convLayer[r]?{conv:new Float32Array((this.LC-1)*this.D)}:{K:[],V:[]})}async gemm(t,r){let e=this.g.get(t);if(!e){let n=this.w.get(t==="head"?"token_embd.weight":t),i=n.length/r.length,s=new Float32Array(i);for(let a=0;a<i;a++){let o=0,u=a*r.length;for(let c=0;c<r.length;c++)o+=n[u+c]*r[c];s[a]=o}return s}return e.kind==="q8"?this.engine.matmulQ8(r,e.codes,e.sc,1,e.IN,e.OUT):this.engine.matmulQ4(r,e.nib,e.sc,e.mn,1,e.IN,e.OUT)}embedRow(t){let r=this.D;if(this.embedDtype==="f16")return Ye(this.embedBytes.subarray(t*r*2,t*r*2+r*2),r);if(this.embedDtype==="f32")return Ve(this.embedBytes.subarray(t*r*4,t*r*4+r*4),r);if(this.embedDtype==="q8"){let o=this.vocab*r,u=r/32,c=new Int8Array(this.embedBytes.buffer,this.embedBytes.byteOffset+t*r,r),f=this.embedBytes.subarray(o+t*u*2,o+t*u*2+u*2),l=new DataView(f.buffer,f.byteOffset,f.byteLength),g=new Float32Array(r);for(let d=0;d<u;d++){let m=te(l.getUint16(d*2,!0));for(let p=0;p<32;p++)g[d*32+p]=c[d*32+p]*m}return g}let e=this.vocab*r,n=r/32,i=e/2,s=e/2+e/32*2,a=new Uint8Array(r/2+n*2*2);return a.set(this.embedBytes.subarray(t*r/2,t*r/2+r/2),0),a.set(this.embedBytes.subarray(i+t*n*2,i+t*n*2+n*2),r/2),a.set(this.embedBytes.subarray(s+t*n*2,s+t*n*2+n*2),r/2+n*2),se(fe(a,r))}rope(t,r,e){let n=this.HD,i=t.slice();for(let s=0;s<r;s++){let a=s*n;for(let o=0;o<n/2;o++){let u=Math.pow(this.THETA,-2*o/n),c=Math.cos(e*u),f=Math.sin(e*u),l=t[a+o],g=t[a+o+n/2];i[a+o]=l*c-g*f,i[a+o+n/2]=l*f+g*c}}return i}async forwardToken(t){let r=this.D,e=this.pos++,n=this.embedRow(t);for(let i=0;i<this.NL;i++){let s=`blk.${i}.`,a=this.state[i],o=_e(n,this.w.get(s+"attn_norm.weight"),r,this.EPS),u;if(this.convLayer[i]){let d=await this.gemm(s+"shortconv.in_proj.weight",o),m=await this.engine.lfm2ShortConv(d,a.conv,this.w.get(s+"shortconv.conv.weight"),r,this.LC);a.conv=m.state,u=await this.gemm(s+"shortconv.out_proj.weight",m.out)}else{let d=this.NKV*this.HD,m=await this.gemm(s+"attn_q.weight",o),p=await this.gemm(s+"attn_k.weight",o),w=await this.gemm(s+"attn_v.weight",o),G=this.w.get(s+"attn_q_norm.weight"),D=this.w.get(s+"attn_k_norm.weight");for(let v=0;v<this.NH;v++)m.set(_e(m.slice(v*this.HD,(v+1)*this.HD),G,this.HD,this.EPS),v*this.HD);for(let v=0;v<this.NKV;v++)p.set(_e(p.slice(v*this.HD,(v+1)*this.HD),D,this.HD,this.EPS),v*this.HD);m=this.rope(m,this.NH,e),p=this.rope(p,this.NKV,e),a.K.push(p),a.V.push(w);let F=new Float32Array(this.NH*this.HD),S=a.K.length,M=1/Math.sqrt(this.HD),U=this.NH/this.NKV;for(let v=0;v<this.NH;v++){let b=Math.floor(v/U),k=v*this.HD,x=b*this.HD,y=new Float32Array(S),P=-1e30;for(let B=0;B<S;B++){let q=0;for(let _=0;_<this.HD;_++)q+=m[k+_]*a.K[B][x+_];y[B]=q*M,y[B]>P&&(P=y[B])}let A=0;for(let B=0;B<S;B++)y[B]=Math.exp(y[B]-P),A+=y[B];for(let B=0;B<S;B++){let q=y[B]/A;for(let _=0;_<this.HD;_++)F[k+_]+=q*a.V[B][x+_]}}u=await this.gemm(s+"attn_output.weight",F)}for(let d=0;d<r;d++)n[d]+=u[d];let c=_e(n,this.w.get(s+"ffn_norm.weight"),r,this.EPS),f=await this.gemm(s+"ffn_gate.weight",c),l=await this.gemm(s+"ffn_up.weight",c);for(let d=0;d<f.length;d++)f[d]=vt(f[d])*l[d];let g=await this.gemm(s+"ffn_down.weight",f);for(let d=0;d<r;d++)n[d]+=g[d]}return n=_e(n,this.w.get("token_embd_norm.weight"),r,this.EPS),this.gemm("head",n)}async classify(t,r){this.reset();let e;for(let i of this.tok.encode(t))e=await this.forwardToken(i);let n=r.map(i=>{let s=this.tok.encode(i);return{label:i,logit:e[s[1]??s[0]]}}).sort((i,s)=>s.logit-i.logit);return{label:n[0].label,scores:n}}banTools(t){for(let r of Ae.TOOL_BAN)r<t.length&&(t[r]=-1e30);return t}sampleTok(t,r,e){let{temperature:n=.8,topK:i=40,repeatPenalty:s=1.3}=e,a=new Set(r),o=[];for(let l=0;l<t.length;l++){let g=t[l];a.has(l)&&(g=g>0?g/s:g*s),o.push({i:l,v:g})}o.sort((l,g)=>g.v-l.v),o.length=i;let u=o[0].v,c=0;for(let l of o)l.p=Math.exp((l.v-u)/n),c+=l.p;let f=Math.random()*c;for(let l of o)if(f-=l.p,f<=0)return l.i;return o[0].i}async generate(t,r,e,n,i){this.reset();let s=this.tok.encode(t),a;for(let u of s)a=await this.forwardToken(u);let o=[];for(let u=0;u<r&&!n?.();u++){this.banTools(a);let c;if(i?.sample)c=this.sampleTok(a,o.slice(-64),i);else{c=0;for(let f=1;f<a.length;f++)a[f]>a[c]&&(c=f)}if(this.stops.has(c))break;o.push(c),e&&e(this.tok.decode(o)),a=await this.forwardToken(c)}return o.length?this.tok.decode(o):""}async generateResident(t,r,e,n,i){if(!this.residentAvailable())return this.generate(t,r,e,n,i);let s="gen",a=this.tok.encode(t),o,u=0;for(;u<a.length;){if(n?.())return"";let l=Math.min(u+Ae.PREFILL_CHUNK,a.length),g=a.slice(u,l);l<a.length?await this.prefillGpu(g,u,s):o=await this.logitsGpu(g,u,s),u=l}let c=a.length,f=[];for(let l=0;l<r&&!n?.();l++){this.banTools(o);let g;if(i?.sample)g=this.sampleTok(o,f.slice(-64),i);else{g=0;for(let d=1;d<o.length;d++)o[d]>o[g]&&(g=d)}if(this.stops.has(g))break;f.push(g),e&&e(this.tok.decode(f)),o=await this.logitsGpu([g],c,s),c++}return f.length?this.tok.decode(f):""}};Ae.TOOL_BAN=[8,10,12],Ae.PREFILL_CHUNK=128;var Te=Ae;function $e(h,t=16){return Math.ceil(h/t)*t}var wt="BRIK",xe=12;function At(h){return $e(xe+h)}function ze(h){if(h.length<xe)throw new Error("BRIK: fichier tronqu\xE9 (en-t\xEAte)");let t=String.fromCharCode(h[0],h[1],h[2],h[3]);if(t!==wt)throw new Error(`BRIK: sceau magique absent (${t})`);let r=new DataView(h.buffer,h.byteOffset,h.byteLength),e=r.getUint32(4,!0),n=r.getUint32(8,!0);if(xe+n>h.length)throw new Error("BRIK: manifeste tronqu\xE9");return{manifest:JSON.parse(new TextDecoder().decode(h.subarray(xe,xe+n))),version:e,dataStart:At(n)}}function Ie(h){let{manifest:t,version:r,dataStart:e}=ze(h);return{manifest:t,version:r,dataStart:e,data:h.subarray(e)}}var kt={f16:"F16",f32:"F32",q4:"Q4W",q8:"Q8W",q3:"Q3W"};function Xe(h){let t=[...h].sort((n,i)=>n.id-i.id),r=[],e=0;for(let n of t)r[n.id]=e,e+=n.byteLength;return r}function Je(h){let t=Xe(h.shards),r={};for(let[n,i]of Object.entries(h.tensors)){let s=kt[i.dtype];if(!s)throw new Error(`dtype BRIK inconnu pour ${n} : ${i.dtype}`);if(t[i.shard]===void 0)throw new Error(`shard ${i.shard} absent du manifeste (tenseur ${n})`);r[n]={offset:t[i.shard]+i.offset,bytes:i.byteLength,nElems:i.nElems,type:s,shape:i.shape}}let e=h.arch;return{arch:e.arch,config:{d:e.d,nHeads:e.nHeads,nKvHeads:e.nKvHeads,headDim:e.headDim,ffn:e.ffn,blockCount:e.blockCount,ropeTheta:e.ropeTheta,rmsEps:e.rmsEps,attnLogitSoftcap:e.attnLogitSoftcap,finalLogitSoftcap:e.finalLogitSoftcap,attnScale:e.attnScale,act:e.act,rmsGainOnePlus:e.rmsGainOnePlus,embedScale:e.embedScale,rwkv:e.rwkv,lfm2:e.lfm2},tensors:r}}var Ut="brik-range-v1";function Pt(h,t,r){return`${h}${h.includes("?")?"&":"?"}__brik=${t}-${r}`}async function Gt(){try{return await caches.open(Ut)}catch{return null}}async function He(h,t,r,e){let n=t+r-1,i=await Gt(),s=Pt(h,t,n);if(i){let o=await i.match(s);if(o)return{bytes:new Uint8Array(await o.arrayBuffer()),ranged:!0}}let a;for(let o=0;o<4;o++)try{let u=await fetch(h,{headers:{Range:`bytes=${t}-${n}`},signal:e});if(!u.ok&&u.status!==206)throw new Error(`range fetch ${t}-${n} \xE9chou\xE9 : HTTP ${u.status}`);let c=u.status===206,f=new Uint8Array(await u.arrayBuffer()),l=c?f:f.subarray(t,t+r);if(i&&c)try{await i.put(s,new Response(l,{headers:{"Content-Length":String(l.byteLength)}}))}catch(g){rt(g)}return{bytes:l,ranged:c}}catch(u){if(e?.aborted)throw u;a=u,o<3&&await new Promise(c=>setTimeout(c,500*2**o))}throw a instanceof Error?a:new Error(String(a))}var Ze=!1;function rt(h){Ze||(Ze=!0,console.warn("[cache] \xE9criture refus\xE9e (quota plein ? navigation priv\xE9e ?) \u2014 les t\xE9l\xE9chargements de mod\xE8les ne seront PAS r\xE9utilisables \xE0 la prochaine visite. Lib\xE9rez de l'espace via le panneau Stockage.",h))}var et="brimkern-model-cache";async function Bt(h){try{let n=await(await caches.open(et)).match(h);if(n)return new Uint8Array(await n.arrayBuffer())}catch{}let t=await fetch(h);if(!t.ok)throw new Error(`HTTP ${t.status}`);let r=new Uint8Array(await t.arrayBuffer());try{await(await caches.open(et)).put(h,new Response(r.slice(),{headers:{"Content-Length":String(r.byteLength)}}))}catch(e){rt(e)}return r}function _t(h,t){return{bytes:async(r,e)=>(await He(h,t+r,e)).bytes}}function xt(h){return{bytes:async(t,r)=>h.subarray(t,t+r)}}async function nt(h){let t=await He(h,0,12);if(!t.ranged){let s=await Bt(h),{manifest:a,data:o}=Ie(s);return tt(a,xt(o))}let r=new DataView(t.bytes.buffer,t.bytes.byteOffset,12).getUint32(8,!0),e=await He(h,0,12+r),{manifest:n,dataStart:i}=ze(e.bytes);return tt(n,_t(h,i))}function tt(h,t){if(h.model?.uiArch==="image")throw new Error("Ce fichier est un BRIK image (UNet/CLIP) \u2014 il se charge via la tuile de g\xE9n\xE9ration d'image, pas comme un LLM.");return{source:t,manifest:Je(h),tokenizerId:h.tokenizer?.id,tokenizer:h.tokenizer,uiArch:h.model?.uiArch,modelName:h.model.name}}function it(h,t,r){let e="";if(t==="deepseek"){e+="<\uFF5Cbegin\u2581of\u2581sentence\uFF5C>",r.trim()&&(e+=r);for(let n of h)n.role==="user"?e+=`<\uFF5CUser\uFF5C>${n.content}`:n.role==="assistant"&&(e+=`<\uFF5CAssistant\uFF5C>${n.content}<\uFF5Cend\u2581of\u2581sentence\uFF5C>`);return e+="<\uFF5CAssistant\uFF5C>",e}if(t==="rwkv7"){r.trim()&&(e+=`System: ${r.trim()}

`);for(let n of h)n.role==="user"?e+=`User: ${n.content.trim()}

`:n.role==="assistant"&&(e+=`Assistant: ${n.content.trim()}

`);return e+="Assistant:",e}if(t==="qwen"||t==="qwen3"||t==="lfm2"){r.trim()&&(e+=`<|im_start|>system
${r}<|im_end|>
`);for(let n of h)e+=`<|im_start|>${n.role}
${n.content}<|im_end|>
`;e+=`<|im_start|>assistant
`}else if(t==="llama3"){e+="<|begin_of_text|>",r.trim()&&(e+=`<|start_header_id|>system<|end_header_id|>

${r}<|eot_id|>`);for(let n of h)e+=`<|start_header_id|>${n.role}<|end_header_id|>

${n.content}<|eot_id|>`;e+=`<|start_header_id|>assistant<|end_header_id|>

`}else if(t==="mistral3"){e+="<s>",r.trim()&&(e+=`[SYSTEM_PROMPT]${r}[/SYSTEM_PROMPT]`);for(let n of h)n.role==="user"?e+=`[INST]${n.content}[/INST]`:n.role==="assistant"&&(e+=`${n.content}</s>`)}else if(t==="gemma"){r.trim()&&(e+=`<start_of_turn>model
${r}<end_of_turn>
`);for(let n of h)e+=`<start_of_turn>${n.role==="assistant"?"model":"user"}
${n.content}<end_of_turn>
`;e+=`<start_of_turn>model
`}return e}var qt="https://esm.sh/@huggingface/transformers@4.2.0",st={"lfm2.5-230m":"https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik"},Ft={F16:"f16",F32:"f32",Q4W:"q4",Q8W:"q8",Q3W:"q3"},St=12,ut=`
Answer briefly and honestly. If you do not know something, say so \u2014 never invent facts or details.
You have no tools and no internet access: never emit tool calls, reply in plain text only.`;async function Ot(h,t){let r=new Oe;if(!await r.init())throw new Error("WebGPU indisponible sur ce navigateur.");r.onLost=g=>{console.warn("[brimkern] device GPU perdu ("+(g?.reason||"unknown")+") \u2014 rechargement au prochain appel"),pe.delete(h)},await r.selfValidate(),t("t\xE9l\xE9chargement du mod\xE8le\u2026");let e=await nt(h),n=e.manifest,i=n.tensors["token_embd.weight"],s={arch:{...n.config,arch:"lfm2",vocab:i?i.nElems/n.config.d:0},tensors:Object.fromEntries(Object.entries(n.tensors).map(([g,d])=>[g,{dtype:Ft[d.type]??d.type,shape:d.shape,nElems:d.nElems,shard:0,offset:d.offset,byteLength:d.bytes}])),shards:[{id:0,file:"",byteLength:0}],chat:{template:"chatml",stopTokenIds:[7,2,8,10,12]}},a=async g=>{let d=n.tensors[g];if(!d)throw new Error(`tenseur absent : ${g}`);return e.source.bytes(d.offset,d.bytes)};t("tokenizer\u2026");let u=await import(qt),c=new u.PreTrainedTokenizer(JSON.parse(e.tokenizer.json),JSON.parse(e.tokenizer.config)),f={encode:g=>Array.from(c(g).input_ids.data,d=>Number(d)),decode:g=>c.decode(g,{skip_special_tokens:!0})},l=new Te(r,s,a);return t("poids sur le GPU\u2026"),await l.load(f),{core:l,engine:r}}var pe=new Map;function De(h){return h&&(h.startsWith("https://")||/^http:\/\/(localhost|127\.0\.0\.1)[:/]/.test(h))?h:st[h||"lfm2.5-230m"]||st["lfm2.5-230m"]}function Ce(h,t){let r=pe.get(h);if(!r){let e={status:"initialisation\u2026",state:"loading",listeners:new Set,promise:null};e.promise=Ot(h,n=>{e.status=n,e.listeners.forEach(i=>i(n))}).then(n=>(e.state="ready",n)).catch(n=>{throw e.state="error",pe.delete(h),n}),pe.set(h,e),r=e}return t&&(t(r.status),r.listeners.add(t),r.promise.finally(()=>r.listeners.delete(t)).catch(()=>{})),r.promise}async function Ke(h,t){let r=await Ce(h,t);return r.engine.lost?(pe.delete(h),(await Ce(h,t)).core):r.core}async function ct(h,t){let r=await Ke(h);try{return await t(r)}catch(e){let n=pe.get(h);if(!(!n||await n.promise.then(s=>s.engine.lost).catch(()=>!0)))throw e;return console.warn("[brimkern] g\xE9n\xE9ration interrompue par une perte de device \u2014 nouvelle tentative"),pe.delete(h),t(await Ke(h))}}function Tt(h,t){let r=h.replace(/<\|[a-z_]+\|>/g,"");if(t){let e=r.replace(/^\s*(hello|hi|hey|bonjour|salut)\s*[!,.]\s*/i,"");e.trim()&&(r=e)}return r.trimEnd()}async function ft(h,t,r,e,n,i,s,a=[]){let o=it([...a,...t.slice(-St)],"lfm2",r),u=a.some(l=>l.role==="assistant")||t.some(l=>l.role==="assistant"),c="";return await(h.residentAvailable?.()?h.generateResident.bind(h):h.generate.bind(h))(o,e,l=>{c=Tt(l,u),i?.(c)},s,{sample:!0,temperature:n,topK:40,repeatPenalty:1.3}),c}function at(h={}){let t=De(h.model),r=h.maxTokens||220,e=h.temperature??.55,n=(h.system||"You are a helpful assistant.")+ut,i=(h.examples||[]).flatMap(u=>[{role:"user",content:u.user},{role:"assistant",content:u.assistant}]),s=[],a=!1,o=!1;return{async ask(u,c={}){if(o)throw new Error("session d\xE9truite");if(a)throw new Error("g\xE9n\xE9ration d\xE9j\xE0 en cours sur cette session");a=!0,s.push({role:"user",content:u});try{let f=await ct(t,l=>ft(l,s,n,r,e,c.onToken,()=>!!c.signal?.aborted,i));return c.signal?.aborted?(s.pop(),""):(s.push({role:"assistant",content:f}),f)}catch(f){throw s.pop(),f}finally{a=!1}},reset(){s=[]},destroy(){o=!0,s=[]},get history(){return s.slice()}}}function Dt(h){if(document.getElementById("bk-style"))return;let t=document.createElement("style");t.id="bk-style",t.textContent=`
  .bk-fab{position:fixed;right:20px;bottom:20px;width:56px;height:56px;border-radius:16px;background:${h};color:#fff;border:none;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.25);font-size:24px;z-index:2147483000;display:flex;align-items:center;justify-content:center;transition:transform .15s}
  .bk-fab:hover{transform:translateY(-2px)}
  .bk-panel{position:fixed;right:20px;bottom:88px;width:360px;max-width:calc(100vw - 40px);height:520px;max-height:calc(100vh - 120px);background:#f2efe8;border:1px solid #e0dccf;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.28);z-index:2147483000;display:none;flex-direction:column;overflow:hidden;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;color:#1a1a1a}
  .bk-panel.bk-open{display:flex}
  .bk-hd{padding:12px 14px;background:#fff;border-bottom:1px solid #ece8dd;display:flex;align-items:center;gap:8px;font-weight:700;font-size:14px}
  .bk-hd .bk-dot{width:8px;height:8px;border-radius:50%;background:${h}}
  .bk-hd .bk-x{margin-left:auto;background:none;border:none;cursor:pointer;color:#8b887f;font-size:18px;line-height:1}
  .bk-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px}
  .bk-m{max-width:82%;padding:8px 12px;border-radius:12px;font-size:14px;line-height:1.45;white-space:pre-wrap;word-wrap:break-word}
  .bk-m.bk-u{align-self:flex-end;background:${h};color:#fff;border-bottom-right-radius:4px}
  .bk-m.bk-a{align-self:flex-start;background:#fff;border:1px solid #ece8dd;border-bottom-left-radius:4px}
  .bk-foot{padding:10px;border-top:1px solid #ece8dd;background:#fff;display:flex;gap:8px}
  .bk-in{flex:1;border:1px solid #e0dccf;border-radius:10px;padding:9px 11px;font-size:14px;font-family:inherit;background:#fff;color:#1a1a1a;resize:none;outline:none}
  .bk-in:focus{border-color:${h}}
  .bk-send{background:${h};color:#fff;border:none;border-radius:10px;padding:0 14px;cursor:pointer;font-size:14px}
  .bk-send:disabled{opacity:.5;cursor:default}
  .bk-note{font-size:10.5px;color:#8b887f;text-align:center;padding:4px 8px 8px}
  `,document.head.appendChild(t)}function Ct(h){if(!h)return"#c72c1e";if(/^#[0-9a-fA-F]{3,8}$/.test(h))return h;try{if(typeof CSS<"u"&&CSS.supports("color",h)&&!/[{};()]/.test(h))return h}catch{}return"#c72c1e"}function ot(h){let t=Ct(h.accent),r=h.title||"Assistant",e=h.maxTokens||220;Dt(t);let n=document.createElement("button");n.className="bk-fab",n.setAttribute("aria-label","Ouvrir le chat"),n.textContent="\u{1F4AC}";let i=document.createElement("div");i.className="bk-panel",i.innerHTML=`
    <div class="bk-hd"><span class="bk-dot"></span><span>${Mt(r)}</span><button class="bk-x" aria-label="Fermer">\xD7</button></div>
    <div class="bk-msgs"></div>
    <div class="bk-foot"><textarea class="bk-in" rows="1" placeholder="\xC9cris un message\u2026"></textarea><button class="bk-send">\u2191</button></div>
    <div class="bk-note">IA locale \u2014 tourne sur votre GPU, aucune donn\xE9e envoy\xE9e.</div>`,document.body.appendChild(n),document.body.appendChild(i);let s=i.querySelector(".bk-msgs"),a=i.querySelector(".bk-in"),o=i.querySelector(".bk-send"),u=[],c=!1,f=!1,l=(p,w)=>{let G=document.createElement("div");return G.className=`bk-m ${p==="user"?"bk-u":"bk-a"}`,G.textContent=w,s.appendChild(G),s.scrollTop=s.scrollHeight,G};h.greeting&&(u.push({role:"assistant",content:h.greeting}),l("assistant",h.greeting));let g=De(h.model),d=()=>{if(!f){f=!0;let p=l("assistant","Initialisation\u2026");p.classList.add("bk-status"),Ce(g,w=>{p.textContent=w}).then(()=>p.remove()).catch(w=>{p.textContent="Erreur : "+(w?.message||w),f=!1})}return Ke(g)},m=async()=>{let p=a.value.trim();if(!p||c)return;c=!0,o.disabled=!0,a.value="",u.push({role:"user",content:p}),l("user",p);let w=l("assistant","\u2026");try{await d();let G=(h.system||"You are a helpful assistant.")+ut,D=await ct(g,F=>ft(F,u,G,e,.55,S=>{w.textContent=S||"\u2026",s.scrollTop=s.scrollHeight}));D||(D="Sorry, I can only answer in plain text here \u2014 could you rephrase?"),w.textContent=D,u.push({role:"assistant",content:D})}catch(G){w.textContent="Erreur : "+(G?.message||String(G))}finally{c=!1,o.disabled=!1,a.focus()}};n.onclick=()=>{i.classList.toggle("bk-open")&&(a.focus(),d())},i.querySelector(".bk-x").onclick=()=>i.classList.remove("bk-open"),o.onclick=()=>{m()},a.onkeydown=p=>{p.key==="Enter"&&!p.shiftKey&&(p.preventDefault(),m())}}function Mt(h){return h.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}window.Brimkern={embed:(h={})=>{document.body?ot(h):window.addEventListener("DOMContentLoaded",()=>ot(h))},createSession:at,generate:async h=>at(h).ask(h.prompt,{onToken:h.onToken,signal:h.signal}),preload:(h={})=>typeof navigator<"u"&&"gpu"in navigator?Ce(De(h.model),h.onProgress).then(()=>!0).catch(()=>!1):Promise.resolve(!1),status:h=>{if(typeof navigator>"u"||!("gpu"in navigator))return"unavailable";let t=pe.get(De(h));return t?t.state:"idle"}};})();
