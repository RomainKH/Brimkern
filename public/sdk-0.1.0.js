"use strict";(()=>{function ye(d){let e=new Float32Array(1),r=new Uint32Array(e.buffer);e[0]=d;let t=r[0],n=t>>16&32768,a=(t>>23&255)-127+15,s=t&8388607;return a<=0?n:a>=31?n|31743:(s=(s>>13)+(s>>12&1),s===1024&&(s=0,a+=1),n|a<<10|s&1023)}function oe(d){let e=d>>15&1,r=d>>10&31,t=d&1023,n;return r===0?n=t*59604645e-15:r===31?n=t?NaN:1/0:n=(1+t/1024)*2**(r-15),e===1?-n:n}var he=32;function Se(d){let e=d.length;if(e%he!==0)throw new Error(`q4web: length ${e} not a multiple of ${he}`);let r=e/he,t=new Uint8Array(e/2),n=new Uint16Array(r),a=new Uint16Array(r);for(let s=0;s<r;s++){let i=s*he,o=1/0,u=-1/0;for(let m=0;m<he;m++){let v=d[i+m];v<o&&(o=v),v>u&&(u=v)}let c=(u-o)/15||1e-8,l=ye(c),f=ye(o);n[s]=l,a[s]=f;let g=oe(l)||1e-8,h=oe(f);for(let m=0;m<he;m++){let v=Math.round((d[i+m]-h)/g);v=v<0?0:v>15?15:v;let y=i+m;(m&1)===0?t[y>>1]=v:t[y>>1]|=v<<4}}return{nibbles:t,scales:n,mins:a,nElems:e}}function ke(d,e){let r=e/he,t=e/2,n=d.slice(0,t),a=new Uint16Array(r),s=new Uint16Array(r),i=new DataView(d.buffer,d.byteOffset);for(let o=0;o<r;o++)a[o]=i.getUint16(t+o*2,!0);for(let o=0;o<r;o++)s[o]=i.getUint16(t+r*2+o*2,!0);return{nibbles:n,scales:a,mins:s,nElems:e}}function fe(d){let e=new Float32Array(d.nElems),r=d.nElems/he;for(let t=0;t<r;t++){let n=oe(d.scales[t]),a=oe(d.mins[t]),s=t*he;for(let i=0;i<he;i++){let o=s+i,u=d.nibbles[o>>1],c=(i&1)===0?u&15:u>>4;e[o]=c*n+a}}return e}var me=32;function Oe(d){let e=d.length;if(e%me!==0)throw new Error(`q8web: length ${e} not a multiple of ${me}`);let r=e/me,t=new Int8Array(e),n=new Uint16Array(r);for(let a=0;a<r;a++){let s=a*me,i=0;for(let l=0;l<me;l++){let f=Math.abs(d[s+l]);f>i&&(i=f)}let o=i/127||1e-8,u=ye(o);n[a]=u;let c=oe(u)||1e-8;for(let l=0;l<me;l++){let f=Math.round(d[s+l]/c);f=f<-127?-127:f>127?127:f,t[s+l]=f}}return{codes:t,scales:n,nElems:e}}function _e(d,e){let r=e/me,t=new Int8Array(d.buffer.slice(d.byteOffset,d.byteOffset+e)),n=new Uint16Array(r),a=new DataView(d.buffer,d.byteOffset);for(let s=0;s<r;s++)n[s]=a.getUint16(e+s*2,!0);return{codes:t,scales:n,nElems:e}}function pe(d){let e=new Float32Array(d.nElems),r=d.nElems/me;for(let t=0;t<r;t++){let n=oe(d.scales[t]),a=t*me;for(let s=0;s<me;s++)e[a+s]=d.codes[a+s]*n}return e}var be=32;function Bt(d){let e=d.length;if(e%be!==0)throw new Error(`q3web: length ${e} not a multiple of ${be}`);let r=e/be,t=new Uint32Array(e/16),n=new Uint32Array(e/32),a=new Uint16Array(r),s=new Uint16Array(r);for(let i=0;i<r;i++){let o=i*be,u=1/0,c=-1/0;for(let v=0;v<be;v++){let y=d[o+v];y<u&&(u=y),y>c&&(c=y)}let l=(c-u)/7||1e-8,f=ye(l),g=ye(u);a[i]=f,s[i]=g;let h=oe(f)||1e-8,m=oe(g);for(let v=0;v<be;v++){let y=Math.round((d[o+v]-m)/h);y=y<0?0:y>7?7:y;let P=o+v;t[P>>4]|=(y&3)<<(P&15)*2,n[P>>5]|=y>>2<<(P&31)}}return{lo:t,hi:n,scales:a,mins:s,nElems:e}}function Je(d,e){let r=e/be,t=e/16,n=e/32,a=t*4,s=n*4,i=new DataView(d.buffer,d.byteOffset),o=new Uint32Array(t),u=new Uint32Array(n),c=new Uint16Array(r),l=new Uint16Array(r);for(let h=0;h<t;h++)o[h]=i.getUint32(h*4,!0);for(let h=0;h<n;h++)u[h]=i.getUint32(a+h*4,!0);let f=a+s,g=f+r*2;for(let h=0;h<r;h++)c[h]=i.getUint16(f+h*2,!0);for(let h=0;h<r;h++)l[h]=i.getUint16(g+h*2,!0);return{lo:o,hi:u,scales:c,mins:l,nElems:e}}function Le(d){let e=new Float32Array(d.nElems),r=d.nElems/be;for(let t=0;t<r;t++){let n=oe(d.scales[t]),a=oe(d.mins[t]),s=t*be;for(let i=0;i<be;i++){let o=s+i,u=d.lo[o>>4]>>(o&15)*2&3|(d.hi[o>>5]>>(o&31)&1)<<2;e[o]=u*n+a}}return e}var xt={matmul:`
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
		}`,rwkv_lerp:`
		@group(0) @binding(0) var<storage, read> x: array<f32>;
		@group(0) @binding(1) var<storage, read> prev: array<f32>;
		@group(0) @binding(2) var<storage, read> lerp: array<f32>;
		@group(0) @binding(3) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let i = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (i >= arrayLength(&o)) { return; }
			o[i] = x[i] + (prev[i] - x[i]) * lerp[i];
		}`,rwkv_decay:`
		@group(0) @binding(0) var<storage, read> w0: array<f32>;
		@group(0) @binding(1) var<storage, read> wpre: array<f32>;
		@group(0) @binding(2) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let i = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (i >= arrayLength(&o)) { return; }
			o[i] = exp(-0.606531 / (1.0 + exp(-(w0[i] + wpre[i]))));
		}`,rwkv_bias_sigmoid:`
		@group(0) @binding(0) var<storage, read> bb: array<f32>;
		@group(0) @binding(1) var<storage, read> x: array<f32>;
		@group(0) @binding(2) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let i = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (i >= arrayLength(&o)) { return; }
			o[i] = 1.0 / (1.0 + exp(-(bb[i] + x[i])));
		}`,rwkv_vresid:`
		@group(0) @binding(0) var<storage, read_write> v: array<f32>;
		@group(0) @binding(1) var<storage, read> vfirst: array<f32>;
		@group(0) @binding(2) var<storage, read> v0: array<f32>;
		@group(0) @binding(3) var<storage, read> vpre: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let i = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (i >= arrayLength(&v)) { return; }
			let s = 1.0 / (1.0 + exp(-(v0[i] + vpre[i])));
			v[i] = v[i] + (vfirst[i] - v[i]) * s;
		}`,rwkv_kprep:`
		struct Dims { nh: u32, hs: u32 };
		@group(0) @binding(0) var<uniform> d: Dims;
		@group(0) @binding(1) var<storage, read> k: array<f32>;
		@group(0) @binding(2) var<storage, read> a: array<f32>;
		@group(0) @binding(3) var<storage, read> kkw: array<f32>;
		@group(0) @binding(4) var<storage, read> kaw: array<f32>;
		@group(0) @binding(5) var<storage, read_write> kmod: array<f32>;
		@group(0) @binding(6) var<storage, read_write> negkk: array<f32>;
		@group(0) @binding(7) var<storage, read_write> kka: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
			let h = gid.x;
			if (h >= d.nh) { return; }
			let H = d.hs; let hb = h * H;
			var n = 0.0;
			for (var j = 0u; j < H; j = j + 1u) { let kv = k[hb + j] * kkw[hb + j]; n = n + kv * kv; }
			var nn = sqrt(n);
			if (nn == 0.0) { nn = 1e-12; }
			for (var j = 0u; j < H; j = j + 1u) {
				let i = hb + j;
				let kkn = (k[i] * kkw[i]) / nn;
				negkk[i] = -kkn;
				kka[i] = kkn * a[i];
				kmod[i] = k[i] * (1.0 + (a[i] - 1.0) * kaw[i]);
			}
		}`,rwkv_out_gn:`
		struct Dims { nh: u32, hs: u32, eps: f32 };
		@group(0) @binding(0) var<uniform> d: Dims;
		@group(0) @binding(1) var<storage, read> y: array<f32>;
		@group(0) @binding(2) var<storage, read> r: array<f32>;
		@group(0) @binding(3) var<storage, read> kmod: array<f32>;
		@group(0) @binding(4) var<storage, read> rk: array<f32>;
		@group(0) @binding(5) var<storage, read> v: array<f32>;
		@group(0) @binding(6) var<storage, read> lnw: array<f32>;
		@group(0) @binding(7) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
			let h = gid.x;
			if (h >= d.nh) { return; }
			let H = d.hs; let hb = h * H;
			var m = 0.0;
			for (var j = 0u; j < H; j = j + 1u) { m = m + y[hb + j]; }
			m = m / f32(H);
			var vv = 0.0;
			for (var j = 0u; j < H; j = j + 1u) { let dj = y[hb + j] - m; vv = vv + dj * dj; }
			vv = vv / f32(H);
			let sc = 1.0 / sqrt(vv + d.eps);
			var bonus = 0.0;
			for (var j = 0u; j < H; j = j + 1u) { bonus = bonus + r[hb + j] * kmod[hb + j] * rk[hb + j]; }
			// lnw contient [gamma | beta] concat\xE9n\xE9s (2\xB7D) \u2014 8 storage max par stage, on fusionne.
			let D = d.nh * H;
			for (var j = 0u; j < H; j = j + 1u) {
				let i = hb + j;
				o[i] = (y[i] - m) * sc * lnw[i] + lnw[D + i] + bonus * v[i];
			}
		}`,mul:`
		@group(0) @binding(0) var<storage, read> a: array<f32>;
		@group(0) @binding(1) var<storage, read> b: array<f32>;
		@group(0) @binding(2) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let i = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (i >= arrayLength(&o)) { return; }
			o[i] = a[i] * b[i];
		}`,sigmoid:`
		@group(0) @binding(0) var<storage, read> x: array<f32>;
		@group(0) @binding(1) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let i = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (i >= arrayLength(&o)) { return; }
			o[i] = 1.0 / (1.0 + exp(-x[i]));
		}`,tanh_act:`
		@group(0) @binding(0) var<storage, read> x: array<f32>;
		@group(0) @binding(1) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let i = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (i >= arrayLength(&o)) { return; }
			o[i] = tanh(clamp(x[i], -20.0, 20.0));
		}`,sqrelu:`
		@group(0) @binding(0) var<storage, read> x: array<f32>;
		@group(0) @binding(1) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let i = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (i >= arrayLength(&o)) { return; }
			let v = max(x[i], 0.0);
			o[i] = v * v;
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
		var<workgroup> As: array<f32, 512>;   // [16 k][32 lignes]
		var<workgroup> Ws: array<f32, 1024>;  // [16 k][64 colonnes]
		fn f16d(h: u32) -> f32 {
			let s = (h >> 15u) & 1u; let e = (h >> 10u) & 0x1Fu; let mm = h & 0x3FFu; var v: f32;
			if (e == 0u) { v = f32(mm) * 5.9604645e-8; } else if (e == 31u) { v = 65504.0; }
			else { v = (1.0 + f32(mm) / 1024.0) * pow(2.0, f32(e) - 15.0); }
			return select(v, -v, s == 1u);
		}
		@compute @workgroup_size(256)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_index) tid: u32) {
			let m = d.m; let k = d.k; let n = d.n;
			let row0 = wid.y * 32u;
			let col0 = wid.x * 64u;
			let aRow = tid >> 3u; let aK = (tid & 7u) * 2u;
			let aGRow = row0 + aRow;
			let wCol = tid >> 2u; let wK = (tid & 3u) * 4u;
			let wGCol = col0 + wCol;
			let tr = (tid >> 4u) * 2u; let tc = (tid & 15u) * 4u;
			var acc0 = 0.0; var acc1 = 0.0; var acc2 = 0.0; var acc3 = 0.0;
			var acc4 = 0.0; var acc5 = 0.0; var acc6 = 0.0; var acc7 = 0.0;
			let nTiles = (k + 15u) / 16u;
			for (var t = 0u; t < nTiles; t = t + 1u) {
				let kk = t * 16u;
				let aOk = aGRow < m;
				As[aK * 32u + aRow] = select(0.0, a[aGRow * k + kk + aK], aOk && (kk + aK) < k);
				As[(aK + 1u) * 32u + aRow] = select(0.0, a[aGRow * k + kk + aK + 1u], aOk && (kk + aK + 1u) < k);
				var v0 = 0.0; var v1 = 0.0; var v2 = 0.0; var v3 = 0.0;
				if (wGCol < n && (kk + wK) < k) {
					let idx = wGCol * k + kk + wK;
					let word = codes[idx >> 2u];
					let si = wGCol * (k / 32u) + ((kk + wK) / 32u);
					let sw = sc[si >> 1u];
					let s = f16d(select(sw & 0xFFFFu, sw >> 16u, (si & 1u) == 1u));
					v0 = f32(i32(word << 24u) >> 24u) * s;
					v1 = f32(i32(word << 16u) >> 24u) * s;
					v2 = f32(i32(word << 8u) >> 24u) * s;
					v3 = f32(i32(word) >> 24u) * s;
				}
				Ws[wK * 64u + wCol] = v0;
				Ws[(wK + 1u) * 64u + wCol] = v1;
				Ws[(wK + 2u) * 64u + wCol] = v2;
				Ws[(wK + 3u) * 64u + wCol] = v3;
				workgroupBarrier();
				for (var i = 0u; i < 16u; i = i + 1u) {
					let ab = i * 32u + tr; let wb = i * 64u + tc;
					let av0 = As[ab]; let av1 = As[ab + 1u];
					let wv0 = Ws[wb]; let wv1 = Ws[wb + 1u]; let wv2 = Ws[wb + 2u]; let wv3 = Ws[wb + 3u];
					acc0 = acc0 + av0 * wv0; acc1 = acc1 + av0 * wv1; acc2 = acc2 + av0 * wv2; acc3 = acc3 + av0 * wv3;
					acc4 = acc4 + av1 * wv0; acc5 = acc5 + av1 * wv1; acc6 = acc6 + av1 * wv2; acc7 = acc7 + av1 * wv3;
				}
				workgroupBarrier();
			}
			let gr0 = row0 + tr; let gr1 = gr0 + 1u; let gc = col0 + tc;
			if (gr0 < m) {
				if (gc < n) { c[gr0 * n + gc] = acc0; }
				if (gc + 1u < n) { c[gr0 * n + gc + 1u] = acc1; }
				if (gc + 2u < n) { c[gr0 * n + gc + 2u] = acc2; }
				if (gc + 3u < n) { c[gr0 * n + gc + 3u] = acc3; }
			}
			if (gr1 < m) {
				if (gc < n) { c[gr1 * n + gc] = acc4; }
				if (gc + 1u < n) { c[gr1 * n + gc + 1u] = acc5; }
				if (gc + 2u < n) { c[gr1 * n + gc + 2u] = acc6; }
				if (gc + 3u < n) { c[gr1 * n + gc + 3u] = acc7; }
			}
		}`,matmul_t_q4_shared:`
		struct Dims { m: u32, k: u32, n: u32 };
		@group(0) @binding(0) var<uniform> d: Dims;
		@group(0) @binding(1) var<storage, read> a: array<f32>;
		@group(0) @binding(2) var<storage, read> nib: array<u32>;
		@group(0) @binding(3) var<storage, read> sc: array<u32>;
		@group(0) @binding(4) var<storage, read> mn: array<u32>;
		@group(0) @binding(5) var<storage, read_write> c: array<f32>;
		var<workgroup> As: array<f32, 512>;
		var<workgroup> Ws: array<f32, 1024>;
		fn f16d(h: u32) -> f32 {
			let s = (h >> 15u) & 1u; let e = (h >> 10u) & 0x1Fu; let mm = h & 0x3FFu; var v: f32;
			if (e == 0u) { v = f32(mm) * 5.9604645e-8; } else if (e == 31u) { v = 65504.0; }
			else { v = (1.0 + f32(mm) / 1024.0) * pow(2.0, f32(e) - 15.0); }
			return select(v, -v, s == 1u);
		}
		@compute @workgroup_size(256)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_index) tid: u32) {
			let m = d.m; let k = d.k; let n = d.n;
			let row0 = wid.y * 32u;
			let col0 = wid.x * 64u;
			let aRow = tid >> 3u; let aK = (tid & 7u) * 2u;
			let aGRow = row0 + aRow;
			let wCol = tid >> 2u; let wK = (tid & 3u) * 4u;
			let wGCol = col0 + wCol;
			let tr = (tid >> 4u) * 2u; let tc = (tid & 15u) * 4u;
			var acc0 = 0.0; var acc1 = 0.0; var acc2 = 0.0; var acc3 = 0.0;
			var acc4 = 0.0; var acc5 = 0.0; var acc6 = 0.0; var acc7 = 0.0;
			let nTiles = (k + 15u) / 16u;
			for (var t = 0u; t < nTiles; t = t + 1u) {
				let kk = t * 16u;
				let aOk = aGRow < m;
				As[aK * 32u + aRow] = select(0.0, a[aGRow * k + kk + aK], aOk && (kk + aK) < k);
				As[(aK + 1u) * 32u + aRow] = select(0.0, a[aGRow * k + kk + aK + 1u], aOk && (kk + aK + 1u) < k);
				var v0 = 0.0; var v1 = 0.0; var v2 = 0.0; var v3 = 0.0;
				if (wGCol < n && (kk + wK) < k) {
					let idx = wGCol * k + kk + wK;
					let word = nib[idx >> 3u];
					let sh = (idx & 7u) * 4u;
					let si = wGCol * (k / 32u) + ((kk + wK) / 32u);
					let sw = sc[si >> 1u]; let s = f16d(select(sw & 0xFFFFu, sw >> 16u, (si & 1u) == 1u));
					let mw = mn[si >> 1u]; let mnv = f16d(select(mw & 0xFFFFu, mw >> 16u, (si & 1u) == 1u));
					v0 = f32((word >> sh) & 0xFu) * s + mnv;
					v1 = f32((word >> (sh + 4u)) & 0xFu) * s + mnv;
					v2 = f32((word >> (sh + 8u)) & 0xFu) * s + mnv;
					v3 = f32((word >> (sh + 12u)) & 0xFu) * s + mnv;
				}
				Ws[wK * 64u + wCol] = v0;
				Ws[(wK + 1u) * 64u + wCol] = v1;
				Ws[(wK + 2u) * 64u + wCol] = v2;
				Ws[(wK + 3u) * 64u + wCol] = v3;
				workgroupBarrier();
				for (var i = 0u; i < 16u; i = i + 1u) {
					let ab = i * 32u + tr; let wb = i * 64u + tc;
					let av0 = As[ab]; let av1 = As[ab + 1u];
					let wv0 = Ws[wb]; let wv1 = Ws[wb + 1u]; let wv2 = Ws[wb + 2u]; let wv3 = Ws[wb + 3u];
					acc0 = acc0 + av0 * wv0; acc1 = acc1 + av0 * wv1; acc2 = acc2 + av0 * wv2; acc3 = acc3 + av0 * wv3;
					acc4 = acc4 + av1 * wv0; acc5 = acc5 + av1 * wv1; acc6 = acc6 + av1 * wv2; acc7 = acc7 + av1 * wv3;
				}
				workgroupBarrier();
			}
			let gr0 = row0 + tr; let gr1 = gr0 + 1u; let gc = col0 + tc;
			if (gr0 < m) {
				if (gc < n) { c[gr0 * n + gc] = acc0; }
				if (gc + 1u < n) { c[gr0 * n + gc + 1u] = acc1; }
				if (gc + 2u < n) { c[gr0 * n + gc + 2u] = acc2; }
				if (gc + 3u < n) { c[gr0 * n + gc + 3u] = acc3; }
			}
			if (gr1 < m) {
				if (gc < n) { c[gr1 * n + gc] = acc4; }
				if (gc + 1u < n) { c[gr1 * n + gc + 1u] = acc5; }
				if (gc + 2u < n) { c[gr1 * n + gc + 2u] = acc6; }
				if (gc + 3u < n) { c[gr1 * n + gc + 3u] = acc7; }
			}
		}`,matmul_t_f16w_shared:`
		struct Dims { m: u32, k: u32, n: u32 };
		@group(0) @binding(0) var<uniform> d: Dims;
		@group(0) @binding(1) var<storage, read> a: array<f32>;
		@group(0) @binding(2) var<storage, read> w: array<u32>;
		@group(0) @binding(3) var<storage, read_write> c: array<f32>;
		var<workgroup> As: array<f32, 512>;   // [16 k][32 lignes]
		var<workgroup> Ws: array<f32, 1024>;  // [16 k][64 colonnes]
		@compute @workgroup_size(256)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_index) tid: u32) {
			let m = d.m; let k = d.k; let n = d.n;
			let row0 = wid.y * 32u;
			let col0 = wid.x * 64u;
			// Chargement de A : 512 \xE9l\xE9ments / 256 threads = 2 chacun. Un thread prend 2 k CONTIGUS
			// d'une ligne, et 8 threads cons\xE9cutifs couvrent les 16 k de la ligne \u2192 lecture globale
			// contigu\xEB (64 octets par groupe de 8).
			let aRow = tid >> 3u;         // 0..31 (ligne locale)
			let aK = (tid & 7u) * 2u;     // 0,2,\u2026,14
			let aGRow = row0 + aRow;
			// Chargement de W : 1024 \xE9l\xE9ments / 256 threads = 4 chacun, soit 4 k contigus (= 2 mots u32)
			// d'une colonne ; 4 threads cons\xE9cutifs couvrent les 16 k (32 octets contigus).
			let wCol = tid >> 2u;         // 0..63 (colonne locale)
			let wK = (tid & 3u) * 4u;     // 0,4,8,12
			let wGCol = col0 + wCol;
			// Le thread calcule 2 lignes \xD7 4 colonnes de la tuile.
			let tr = (tid >> 4u) * 2u;    // 0,2,\u2026,30
			let tc = (tid & 15u) * 4u;    // 0,4,\u2026,60
			var acc0 = 0.0; var acc1 = 0.0; var acc2 = 0.0; var acc3 = 0.0;
			var acc4 = 0.0; var acc5 = 0.0; var acc6 = 0.0; var acc7 = 0.0;
			let nTiles = (k + 15u) / 16u;
			for (var t = 0u; t < nTiles; t = t + 1u) {
				let kk = t * 16u;
				let aOk = aGRow < m;
				let a0ok = aOk && (kk + aK) < k;
				let a1ok = aOk && (kk + aK + 1u) < k;
				As[aK * 32u + aRow] = select(0.0, a[aGRow * k + kk + aK], a0ok);
				As[(aK + 1u) * 32u + aRow] = select(0.0, a[aGRow * k + kk + aK + 1u], a1ok);
				// 4 poids = 2 mots u32. k % 4 == 0 et wK multiple de 4 \u2192 le groupe de 4 est ENTIER
				// dedans ou ENTIER dehors : un seul garde suffit.
				var p0 = vec2<f32>(0.0); var p1 = vec2<f32>(0.0);
				if (wGCol < n && (kk + wK) < k) {
					let word = (wGCol * k + kk + wK) >> 1u;
					p0 = unpack2x16float(w[word]);
					p1 = unpack2x16float(w[word + 1u]);
				}
				Ws[wK * 64u + wCol] = p0.x;
				Ws[(wK + 1u) * 64u + wCol] = p0.y;
				Ws[(wK + 2u) * 64u + wCol] = p1.x;
				Ws[(wK + 3u) * 64u + wCol] = p1.y;
				workgroupBarrier();
				for (var i = 0u; i < 16u; i = i + 1u) {
					let ab = i * 32u + tr; let wb = i * 64u + tc;
					let av0 = As[ab]; let av1 = As[ab + 1u];
					let wv0 = Ws[wb]; let wv1 = Ws[wb + 1u]; let wv2 = Ws[wb + 2u]; let wv3 = Ws[wb + 3u];
					acc0 = acc0 + av0 * wv0; acc1 = acc1 + av0 * wv1; acc2 = acc2 + av0 * wv2; acc3 = acc3 + av0 * wv3;
					acc4 = acc4 + av1 * wv0; acc5 = acc5 + av1 * wv1; acc6 = acc6 + av1 * wv2; acc7 = acc7 + av1 * wv3;
				}
				workgroupBarrier();
			}
			let gr0 = row0 + tr; let gr1 = gr0 + 1u; let gc = col0 + tc;
			if (gr0 < m) {
				if (gc < n) { c[gr0 * n + gc] = acc0; }
				if (gc + 1u < n) { c[gr0 * n + gc + 1u] = acc1; }
				if (gc + 2u < n) { c[gr0 * n + gc + 2u] = acc2; }
				if (gc + 3u < n) { c[gr0 * n + gc + 3u] = acc3; }
			}
			if (gr1 < m) {
				if (gc < n) { c[gr1 * n + gc] = acc4; }
				if (gc + 1u < n) { c[gr1 * n + gc + 1u] = acc5; }
				if (gc + 2u < n) { c[gr1 * n + gc + 2u] = acc6; }
				if (gc + 3u < n) { c[gr1 * n + gc + 3u] = acc7; }
			}
		}`,matmul_t_q4_vec:`
		struct Dims { m: u32, k: u32, n: u32, stride: u32 };
		@group(0) @binding(0) var<uniform> d: Dims;
		@group(0) @binding(1) var<storage, read> a: array<vec4<f32>>;
		@group(0) @binding(2) var<storage, read> nib: array<u32>;
		@group(0) @binding(3) var<storage, read> sc: array<u32>;
		@group(0) @binding(4) var<storage, read> mn: array<u32>;
		@group(0) @binding(5) var<storage, read_write> c: array<f32>;
		var<workgroup> part: array<f32, 64>;
		fn f16d(h: u32) -> f32 {
			let s = (h >> 15u) & 1u; let e = (h >> 10u) & 0x1Fu; let m = h & 0x3FFu; var v: f32;
			if (e == 0u) { v = f32(m) * 5.9604645e-8; } else if (e == 31u) { v = 65504.0; }
			else { v = (1.0 + f32(m) / 1024.0) * pow(2.0, f32(e) - 15.0); }
			return select(v, -v, s == 1u);
		}
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let col = wid.y * d.stride + wid.x;
			let tid = lid.x;
			let k = d.k;
			let nGroups = k / 32u;
			var acc = 0.0;
			if (col < d.n) {
				let wordCol = col * (k / 8u);   // 8 nibbles par mot
				let gBase = col * nGroups;
				// Chaque thread prend un groupe de 32 \xE9l\xE9ments sur 64 (foul\xE9e = taille du workgroup).
				for (var g = tid; g < nGroups; g = g + 64u) {
					let si = gBase + g;
					let sw = sc[si >> 1u]; let s = f16d(select(sw & 0xFFFFu, sw >> 16u, (si & 1u) == 1u));
					let mw = mn[si >> 1u]; let mnv = f16d(select(mw & 0xFFFFu, mw >> 16u, (si & 1u) == 1u));
					let w0 = wordCol + g * 4u;   // 4 mots = 32 nibbles
					let aBase = g * 8u;          // 8 vec4 = 32 activations
					var sum = 0.0;
					for (var j = 0u; j < 4u; j = j + 1u) {
						let word = nib[w0 + j];
						let av0 = a[aBase + j * 2u];
						let av1 = a[aBase + j * 2u + 1u];
						let q0 = vec4<f32>(f32(word & 0xFu), f32((word >> 4u) & 0xFu), f32((word >> 8u) & 0xFu), f32((word >> 12u) & 0xFu));
						let q1 = vec4<f32>(f32((word >> 16u) & 0xFu), f32((word >> 20u) & 0xFu), f32((word >> 24u) & 0xFu), f32((word >> 28u) & 0xFu));
						sum = sum + dot(av0, q0 * s + vec4<f32>(mnv)) + dot(av1, q1 * s + vec4<f32>(mnv));
					}
					acc = acc + sum;
				}
			}
			part[tid] = acc;
			workgroupBarrier();
			// R\xE9duction en arbre (flux uniforme : la barriere est hors de toute condition sur col).
			for (var stride = 32u; stride > 0u; stride = stride >> 1u) {
				if (tid < stride) { part[tid] = part[tid] + part[tid + stride]; }
				workgroupBarrier();
			}
			if (tid == 0u && col < d.n) { c[col] = part[0]; }
		}`,matmul_t_q8_vec:`
		struct Dims { m: u32, k: u32, n: u32, stride: u32 };
		@group(0) @binding(0) var<uniform> d: Dims;
		@group(0) @binding(1) var<storage, read> a: array<vec4<f32>>;
		@group(0) @binding(2) var<storage, read> codes: array<u32>;
		@group(0) @binding(3) var<storage, read> sc: array<u32>;
		@group(0) @binding(4) var<storage, read_write> c: array<f32>;
		var<workgroup> part: array<f32, 64>;
		fn f16d(h: u32) -> f32 {
			let s = (h >> 15u) & 1u; let e = (h >> 10u) & 0x1Fu; let m = h & 0x3FFu; var v: f32;
			if (e == 0u) { v = f32(m) * 5.9604645e-8; } else if (e == 31u) { v = 65504.0; }
			else { v = (1.0 + f32(m) / 1024.0) * pow(2.0, f32(e) - 15.0); }
			return select(v, -v, s == 1u);
		}
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let col = wid.y * d.stride + wid.x;
			let tid = lid.x;
			let k = d.k;
			let nGroups = k / 32u;
			var acc = 0.0;
			if (col < d.n) {
				let wordCol = col * (k / 4u);   // 4 codes int8 par mot
				let gBase = col * nGroups;
				for (var g = tid; g < nGroups; g = g + 64u) {
					let si = gBase + g;
					let sw = sc[si >> 1u]; let s = f16d(select(sw & 0xFFFFu, sw >> 16u, (si & 1u) == 1u));
					let w0 = wordCol + g * 8u;   // 8 mots = 32 codes
					let aBase = g * 8u;
					var sum = 0.0;
					for (var j = 0u; j < 8u; j = j + 1u) {
						let word = codes[w0 + j];
						let q = vec4<f32>(
							f32(i32(word << 24u) >> 24u), f32(i32(word << 16u) >> 24u),
							f32(i32(word << 8u) >> 24u), f32(i32(word) >> 24u));
						sum = sum + dot(a[aBase + j], q * s);
					}
					acc = acc + sum;
				}
			}
			part[tid] = acc;
			workgroupBarrier();
			for (var stride = 32u; stride > 0u; stride = stride >> 1u) {
				if (tid < stride) { part[tid] = part[tid] + part[tid + stride]; }
				workgroupBarrier();
			}
			if (tid == 0u && col < d.n) { c[col] = part[0]; }
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
		struct RP { rows: u32, headDim: u32, nHeads: u32, pastLen: u32, base: f32, interleaved: u32 };
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
			let inter = p.interleaved == 1u;
			for (var i = 0u; i < half; i = i + 1u) {
				let freq = pos / pow(p.base, (2.0 * f32(i)) / f32(p.headDim));
				let c = cos(freq); let s = sin(freq);
				let j0 = select(base + i, base + 2u * i, inter);
				let j1 = select(base + i + half, base + 2u * i + 1u, inter);
				let x0 = x[j0];
				let x1 = x[j1];
				o[j0] = x0 * c - x1 * s;
				o[j1] = x1 * c + x0 * s;
			}
		}`,rope_factors:`
		struct RP { rows: u32, headDim: u32, nHeads: u32, pastLen: u32, base: f32, interleaved: u32 };
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
			let inter = p.interleaved == 1u;
			for (var i = 0u; i < half; i = i + 1u) {
				let freq = pos / (pow(p.base, (2.0 * f32(i)) / f32(p.headDim)) * ff[i]);
				let c = cos(freq); let s = sin(freq);
				let j0 = select(base + i, base + 2u * i, inter);
				let j1 = select(base + i + half, base + 2u * i + 1u, inter);
				let x0 = x[j0];
				let x1 = x[j1];
				o[j0] = x0 * c - x1 * s;
				o[j1] = x1 * c + x0 * s;
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
		struct AP { nTokens: u32, nHeads: u32, nKvHeads: u32, headDim: u32, kvLen: u32, pastLen: u32, scale: f32, softcap: f32, window: u32 };
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
			// Sliding window (Gemma 3, Mistral\u2026) : la requ\xEAte ne voit que les p.window derni\xE8res
			// positions, elle comprise. p.window == 0 \u2192 attention causale pleine, inchang\xE9e.
			var jStart = 0u;
			if (p.window > 0u && last + 1u > p.window) { jStart = last + 1u - p.window; }
			var m = -3.0e38;
			for (var j = jStart; j <= last; j = j + 1u) {
				let kB = (j * p.nKvHeads + kvh) * hd;
				var dot = 0.0;
				for (var d = 0u; d < hd; d = d + 1u) { dot = dot + q[qBase + d] * k[kB + d]; }
				m = max(m, score(dot));
			}
			for (var d = 0u; d < hd; d = d + 1u) { o[qBase + d] = 0.0; }
			var denom = 0.0;
			for (var j = jStart; j <= last; j = j + 1u) {
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
		struct AP { nTokens: u32, nHeads: u32, nKvHeads: u32, headDim: u32, kvLen: u32, pastLen: u32, scale: f32, softcap: f32, window: u32 };
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
			// Sliding window (Gemma 3, Mistral\u2026) : la requ\xEAte ne voit que les p.window derni\xE8res
			// positions, elle comprise. p.window == 0 \u2192 attention causale pleine, inchang\xE9e.
			var jStart = 0u;
			if (p.window > 0u && last + 1u > p.window) { jStart = last + 1u - p.window; }
			var m = -3.0e38;
			for (var j = jStart; j <= last; j = j + 1u) {
				let eb = j * kvDim + kvh * hd;
				var raw = 0.0;
				for (var d = 0u; d < hd; d = d + 1u) { let e = eb + d; raw = raw + q[qBase + d] * sbyte(kc[e >> 2u], e & 3u); }
				m = max(m, score(raw * ks[j * p.nKvHeads + kvh]));
			}
			for (var d = 0u; d < hd; d = d + 1u) { o[qBase + d] = 0.0; }
			var denom = 0.0;
			for (var j = jStart; j <= last; j = j + 1u) {
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
		struct AP { nTokens: u32, nHeads: u32, nKvHeads: u32, headDim: u32, kvLen: u32, pastLen: u32, scale: f32, softcap: f32, window: u32 };
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
			// Sliding window (Gemma 3, Mistral\u2026) : la requ\xEAte ne voit que les p.window derni\xE8res
			// positions, elle comprise. p.window == 0 \u2192 attention causale pleine, inchang\xE9e.
			var jStart = 0u;
			if (p.window > 0u && last + 1u > p.window) { jStart = last + 1u - p.window; }
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
			let nChunks = (last - jStart + 64u) / 64u; // \u2308(last-jStart+1)/64\u2309 \u2014 \u2265 1, la tuile 0 contient j=jStart
			for (var c = 0u; c < nChunks; c = c + 1u) {
				let j = jStart + c * 64u + lane;
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
				let nValid = min(64u, last + 1u - jStart - c * 64u);
				let vRow0 = ((jStart + c * 64u) * p.nKvHeads + kvh) * hd;
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
		struct AP { nTokens: u32, nHeads: u32, nKvHeads: u32, headDim: u32, kvLen: u32, pastLen: u32, scale: f32, softcap: f32, window: u32 };
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
			// Sliding window (Gemma 3, Mistral\u2026) : la requ\xEAte ne voit que les p.window derni\xE8res
			// positions, elle comprise. p.window == 0 \u2192 attention causale pleine, inchang\xE9e.
			var jStart = 0u;
			if (p.window > 0u && last + 1u > p.window) { jStart = last + 1u - p.window; }
			let d0 = lane;
			let d1 = lane + 64u;
			if (d0 < hd) { qs[d0] = q[qBase + d0]; }
			if (d1 < hd) { qs[d1] = q[qBase + d1]; }
			workgroupBarrier();
			var m = -3.0e38;
			var denom = 0.0;
			var acc0 = 0.0;
			var acc1 = 0.0;
			let nChunks = (last - jStart + 64u) / 64u;
			for (var c = 0u; c < nChunks; c = c + 1u) {
				let j = jStart + c * 64u + lane;
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
				let nValid = min(64u, last + 1u - jStart - c * 64u);
				let vRow0 = (jStart + c * 64u) * kvDim + kvh * hd;
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
		}`},Ft=`
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
	}`;var ee=64,X=class X{constructor(){this.device=null;this.modules={};this.pipelines={};this.maxStorageBufferBindingSize=0;this.hasF16=!1;this.validationFailure=null;this.lost=!1;this.onLost=null;this.attnDecodeOk=!0;this.attnFullWgOk=!0;this.mropeOk=!0;this.rwkvWkv7Ok=!0;this.lfm2ShortConvOk=!0;this.lfm2ResidentOk=!0;this.lfm2BatchOk=!0;this.swaOk=!0;this.rwkvResidentOk=!0;this.videoOk=!0;this.videoResidentOk=!0;this.f16SharedOk=!0;this.qSharedOk=!0;this.gemvOk=!0;this.bufferPool=new Map;this.poolSize=new WeakMap;this.pooled=new WeakSet;this.uniformPool=new Map;this.uniformSize=new WeakMap;this.convTiledOk=!0;this.kvGpu=new Map;this.topKOk=!0;this.kvSession="";this.kvQuant=!1;this.lfm2KvGpu=new Map;this.lfm2ConvGpu=new Map;this.lfm2Session="";this.rwkvStateGpu=new Map;this.rwkvVFirst=null;this.rwkvSession=""}async init(){let e=navigator.gpu;if(!e)return!1;let r=await e.requestAdapter();if(!r)return!1;let t=r.limits,n={maxStorageBufferBindingSize:t.maxStorageBufferBindingSize,maxBufferSize:t.maxBufferSize},a=[];try{r.features?.has("shader-f16")&&a.push("shader-f16")}catch{}try{this.device=await r.requestDevice({requiredLimits:n,requiredFeatures:a})}catch{try{this.device=await r.requestDevice({requiredLimits:n})}catch{this.device=await r.requestDevice()}}this.maxStorageBufferBindingSize=this.device.limits?.maxStorageBufferBindingSize??134217728,this.hasF16=!!this.device.features?.has?.("shader-f16");try{typeof location<"u"&&new URLSearchParams(location.search).get("attndecode")==="0"&&(this.attnDecodeOk=!1,console.warn("[webgpu] attention d\xE9codage COUP\xC9E par ?attndecode=0 \u2014 kernels classiques")),typeof location<"u"&&new URLSearchParams(location.search).get("attnfullwg")==="0"&&(this.attnFullWgOk=!1,console.warn("[webgpu] attention_full workgroup COUP\xC9E par ?attnfullwg=0 \u2014 kernel classique")),typeof location<"u"&&new URLSearchParams(location.search).get("rwkv")==="0"&&(this.rwkvWkv7Ok=!1,console.warn("[webgpu] kernel RWKV-7 WKV COUP\xC9 par ?rwkv=0")),typeof location<"u"&&new URLSearchParams(location.search).get("lfm2")==="0"&&(this.lfm2ShortConvOk=!1,console.warn("[webgpu] kernel shortconv LFM2 COUP\xC9 par ?lfm2=0")),typeof location<"u"&&new URLSearchParams(location.search).get("lfm2resident")==="0"&&(this.lfm2ResidentOk=!1,console.warn("[webgpu] LFM2 r\xE9sident COUP\xC9 par ?lfm2resident=0 \u2014 forwardToken JS+readback")),typeof location<"u"&&new URLSearchParams(location.search).get("lfm2batch")==="0"&&(this.lfm2BatchOk=!1,console.warn("[webgpu] prefill LFM2 batch\xE9 COUP\xC9 par ?lfm2batch=0 \u2014 token par token")),typeof location<"u"&&new URLSearchParams(location.search).get("swa")==="0"&&(this.swaOk=!1,console.warn("[webgpu] fen\xEAtre glissante COUP\xC9E par ?swa=0 \u2014 attention causale pleine sur toutes les couches")),typeof location<"u"&&new URLSearchParams(location.search).get("rwkvresident")==="0"&&(this.rwkvResidentOk=!1,console.warn("[webgpu] RWKV r\xE9sident COUP\xC9 par ?rwkvresident=0 \u2014 forwardToken JS+readback")),typeof location<"u"&&new URLSearchParams(location.search).get("video")==="0"&&(this.videoOk=!1,console.warn("[webgpu] chemin vid\xE9o (module motion) COUP\xC9 par ?video=0")),typeof location<"u"&&new URLSearchParams(location.search).get("f16shared")==="0"&&(this.f16SharedOk=!1,console.warn("[webgpu] GEMM f16 tuil\xE9 COUP\xC9 par ?f16shared=0 \u2014 matmul_t_f16w pour tous les m")),typeof location<"u"&&new URLSearchParams(location.search).get("gemv")==="0"&&(this.gemvOk=!1,console.warn("[webgpu] GEMV de d\xE9codage COUP\xC9 par ?gemv=0 \u2014 kernels par lignes")),typeof location<"u"&&new URLSearchParams(location.search).get("qshared")==="0"&&(this.qSharedOk=!1,console.warn("[webgpu] GEMM q8/q4 tuil\xE9s COUP\xC9S par ?qshared=0 \u2014 kernels 4 lignes/invocation")),typeof location<"u"&&new URLSearchParams(location.search).get("videoresident")==="0"&&(this.videoResidentOk=!1,console.warn("[webgpu] motion r\xE9sident COUP\xC9 par ?videoresident=0 \u2014 chemin JS+readback"))}catch{}this.device.lost?.then?.(s=>{this.lost=!0,console.warn("[webgpu] device GPU perdu :",s?.reason||"unknown",s?.message||""),this.onLost?.(s)});for(let[s,i]of Object.entries(xt))this.modules[s]=this.device.createShaderModule({code:i});return this.hasF16&&(this.modules.matmul_t_f16w=this.device.createShaderModule({code:Ft})),!0}buf(e,r){let t=this.device.createBuffer({size:e.byteLength,usage:r});return this.device.queue.writeBuffer(t,0,e),t}bufU32(e,r){let t=this.device.createBuffer({size:e.byteLength,usage:r});return this.device.queue.writeBuffer(t,0,e),t}async readBack(e,r){let t=globalThis,n=this.device.createBuffer({size:r,usage:t.GPUBufferUsage.COPY_DST|t.GPUBufferUsage.MAP_READ}),a=this.device.createCommandEncoder();a.copyBufferToBuffer(e,0,n,0,r),this.device.queue.submit([a.finish()]),await n.mapAsync(t.GPUMapMode.READ);let s=new Float32Array(n.getMappedRange().slice(0));return n.unmap(),n.destroy(),s}async readBackBytes(e,r){let t=globalThis,n=Math.ceil(r/4)*4,a=this.device.createBuffer({size:n,usage:t.GPUBufferUsage.COPY_DST|t.GPUBufferUsage.MAP_READ}),s=this.device.createCommandEncoder();s.copyBufferToBuffer(e,0,a,0,n),this.device.queue.submit([s.finish()]),await a.mapAsync(t.GPUMapMode.READ);let i=new Uint8Array(a.getMappedRange().slice(0,r));return a.unmap(),a.destroy(),i}async quantizeToBytes(e,r,t,n,a){let s=t/32,i=n==="q8"?new Uint8Array(t+s*2):new Uint8Array(t/2+s*4),o=X.BLOCK_ELEMS[e]??1,u=t/o,c=r.byteLength/u,l=(m,v)=>v===0?m:l(v,m%v),f=o*32/l(o,32),g=Math.floor(this.maxStorageBufferBindingSize*.9/4),h=a??g;h=Math.max(f,Math.floor(h/f)*f);for(let m=0;m<t;m+=h){let v=Math.min(h,t-m),y=r.slice(m/o*c,(m+v)/o*c),P=this.dequantizeToGpu(e,y,v);try{if(n==="q8"){let{codes:D,sc:q}=this.f32ToQ8Gpu(P,v),T=await this.readBackBytes(D,v),z=await this.readBackBytes(q,v/32*2);D.destroy?.(),q.destroy?.(),i.set(T,m),i.set(z,t+m/32*2)}else{let{nib:D,sc:q,mn:T}=this.f32ToQ4Gpu(P,v),z=await this.readBackBytes(D,v/2),U=await this.readBackBytes(q,v/32*2),p=await this.readBackBytes(T,v/32*2);D.destroy?.(),q.destroy?.(),T.destroy?.(),i.set(z,m/2),i.set(U,t/2+m/32*2),i.set(p,t/2+s*2+m/32*2)}}finally{P.destroy?.()}}return i}pipeline(e){let r=this.pipelines[e];return r||(r=this.device.createComputePipeline({layout:"auto",compute:{module:this.modules[e],entryPoint:"main"}}),this.pipelines[e]=r),r}grid1D(e){let r=Math.ceil(e/ee);if(r<=X.MAX_WG_DIM)return[r,1,1];let t=X.MAX_WG_DIM;return[t,Math.ceil(r/t),1]}recordPass(e,r,t,n){let a=this.pipeline(r),s=this.device.createBindGroup({layout:a.getBindGroupLayout(0),entries:t.map((o,u)=>({binding:u,resource:{buffer:o}}))}),i=e.beginComputePass();i.setPipeline(a),i.setBindGroup(0,s),i.dispatchWorkgroups(...n),i.end()}dispatch(e,r,t){let n=this.device.createCommandEncoder();this.recordPass(n,e,r,t),this.device.queue.submit([n.finish()])}async run(e,r,t,n,a){return this.dispatch(e,r,t),this.readBack(n,a)}isF32(e){return e instanceof Float32Array}async matmul(e,r,t,n,a){let s=globalThis,i=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,o=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([t,n,a]));let u=this.isF32(r)?this.buf(r,i):r,c=this.device.createBuffer({size:t*a*4,usage:i|s.GPUBufferUsage.COPY_SRC});return this.run("matmul",[o,this.buf(e,i),u,c],[Math.ceil(t/8),Math.ceil(a/8),1],c,t*a*4)}async matmulT(e,r,t,n,a,s=!1){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([t,n,a]));let c=this.isF32(r)?this.buf(r,o):r,l=this.device.createBuffer({size:t*a*4,usage:o|i.GPUBufferUsage.COPY_SRC}),f=this.matmulTPlan(t,n,a,s);return this.run(f.shader,[u,this.buf(e,o),c,l],f.grid,l,t*a*4)}matmulTPlan(e,r,t,n){return n&&this.hasF16?this.f16SharedOk&&e>=32&&r%4===0?{shader:"matmul_t_f16w_shared",grid:[Math.ceil(t/64),Math.ceil(e/32),1]}:{shader:"matmul_t_f16w",grid:[Math.ceil(e/8),Math.ceil(t/8),1]}:{shader:r%4===0?"matmul_t_vec4":"matmul_t",grid:[Math.ceil(e/8),Math.ceil(t/8),1]}}async rmsnorm(e,r,t,n,a=1e-5,s=!1){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([t,n])),this.device.queue.writeBuffer(u,8,new Float32Array([a])),this.device.queue.writeBuffer(u,12,new Uint32Array([s?1:0]));let c=this.device.createBuffer({size:e.byteLength,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run("rmsnorm",[u,this.buf(e,o),this.buf(r,o),c],[Math.ceil(t/ee),1,1],c,e.byteLength)}async binary(e,r,t){let n=globalThis,a=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST,s=this.device.createBuffer({size:r.byteLength,usage:a|n.GPUBufferUsage.COPY_SRC});return this.run(e,[this.buf(r,a),this.buf(t,a),s],this.grid1D(r.length),s,r.byteLength)}swiglu(e,r){return this.binary("swiglu",e,r)}geglu(e,r){return this.binary("geglu",e,r)}add(e,r){return this.binary("add",e,r)}async silu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("silu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async groupNorm(e,r,t,n,a,s,i=1e-5){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([n,a,s])),this.device.queue.writeBuffer(c,12,new Float32Array([i]));let l=this.device.createBuffer({size:e.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("group_norm",[c,this.buf(e,u),this.buf(r,u),this.buf(t,u),l],[s,1,1],l,e.byteLength)}async conv2d(e,r,t,n,a,s,i,o,u,c=1,l=0){let f=globalThis,g=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,h=Math.floor((a+2*l-o)/c)+1,m=Math.floor((s+2*l-u)/c)+1,v=n*o*u,y=h*m;if(v*y*4>this.maxStorageBufferBindingSize*.9)return this.conv2dDirect(e,r,t,n,a,s,i,o,u,c,l);let P=this.device.createBuffer({size:48,usage:f.GPUBufferUsage.UNIFORM|f.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(P,0,new Uint32Array([n,a,s,o,u,c,l,h,m]));let D=this.device.createBuffer({size:v*y*4,usage:g|f.GPUBufferUsage.COPY_SRC});this.dispatch("im2col",[P,this.buf(e,g),D],this.grid1D(v*y));let q=await this.matmul(r,D,i,v,y);if(D.destroy?.(),P.destroy?.(),t)for(let T=0;T<i;T++){let z=t[T];for(let U=0;U<y;U++)q[T*y+U]+=z}return q}async conv2dDirect(e,r,t,n,a,s,i,o,u,c=1,l=0){let f=globalThis,g=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,h=Math.floor((a+2*l-o)/c)+1,m=Math.floor((s+2*l-u)/c)+1,v=i*h*m,y=this.device.createBuffer({size:48,usage:f.GPUBufferUsage.UNIFORM|f.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(y,0,new Uint32Array([n,a,s,i,o,u,c,l,h,m]));let P=t??new Float32Array(i),D=this.device.createBuffer({size:v*4,usage:g|f.GPUBufferUsage.COPY_SRC});return this.run("conv2d_direct",[y,this.buf(e,g),this.buf(r,g),this.buf(P,g),D],this.grid1D(v),D,v*4)}async layernorm(e,r,t,n,a,s=1e-5){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,a])),this.device.queue.writeBuffer(u,8,new Float32Array([s]));let c=this.device.createBuffer({size:e.byteLength,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run("layernorm",[u,this.buf(e,o),this.buf(r,o),this.buf(t,o),c],[Math.ceil(n/ee),1,1],c,e.byteLength)}async quickGelu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("quick_gelu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async gelu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("gelu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async relu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("relu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async upsampleNearest(e,r,t,n,a=2){let s=globalThis,i=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,o=t*a,u=n*a,c=r*o*u,l=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(l,0,new Uint32Array([r,t,n,a]));let f=this.device.createBuffer({size:c*4,usage:i|s.GPUBufferUsage.COPY_SRC});return this.run("upsample_nearest",[l,this.buf(e,i),f],this.grid1D(c),f,c*4)}async rope(e,r,t,n,a=0,s=1e4,i=!1){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:32,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([r,t,n,a])),this.device.queue.writeBuffer(c,16,new Float32Array([s]));let l=this.device.createBuffer({size:e.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.device.queue.writeBuffer(c,20,new Uint32Array([i?1:0])),this.run("rope",[c,this.buf(e,u),l],[Math.ceil(r/ee),1,1],l,e.byteLength)}async ropeFactors(e,r,t,n,a,s=0,i=1e4,o=!1){let u=globalThis,c=u.GPUBufferUsage.STORAGE|u.GPUBufferUsage.COPY_DST,l=this.device.createBuffer({size:32,usage:u.GPUBufferUsage.UNIFORM|u.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(l,0,new Uint32Array([t,n,a,s])),this.device.queue.writeBuffer(l,16,new Float32Array([i]));let f=this.device.createBuffer({size:r.byteLength,usage:c});this.device.queue.writeBuffer(f,0,r);let g=this.device.createBuffer({size:e.byteLength,usage:c|u.GPUBufferUsage.COPY_SRC});return this.device.queue.writeBuffer(l,20,new Uint32Array([o?1:0])),this.run("rope_factors",[l,this.buf(e,c),f,g],[Math.ceil(t/ee),1,1],g,e.byteLength)}async ropeMrope(e,r,t,n,a,s,i=1e4){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:32,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([t,n,a,s[0],s[0]+s[1]])),this.device.queue.writeBuffer(c,20,new Float32Array([i]));let l=this.device.createBuffer({size:r.byteLength,usage:u});this.device.queue.writeBuffer(l,0,r);let f=this.device.createBuffer({size:e.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("rope_mrope",[c,this.buf(e,u),l,f],[Math.ceil(t/ee),1,1],f,e.byteLength)}async rope2d(e,r,t,n,a,s=1e4){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:32,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([t,n,a,0])),this.device.queue.writeBuffer(u,16,new Float32Array([s]));let c=this.device.createBuffer({size:r.byteLength,usage:o});this.device.queue.writeBuffer(c,0,r);let l=this.device.createBuffer({size:e.byteLength,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run("rope_2d",[u,this.buf(e,o),c,l],[Math.ceil(t/ee),1,1],l,e.byteLength)}async attention(e,r,t,n,a,s,i,o=0,u,c=0,l=0){let f=globalThis,g=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,h=o+n,m=this.attnUniform(n,a,s,i,h,o,u??1/Math.sqrt(i),c,l),v=n*a*i*4,y=this.device.createBuffer({size:v,usage:g|f.GPUBufferUsage.COPY_SRC});return this.run("attention",[m,this.buf(e,g),this.buf(r,g),this.buf(t,g),y],[Math.ceil(n*a/ee),1,1],y,v)}async attentionDecode(e,r,t,n,a,s,i,o=0,u,c=0,l=0){let f=globalThis,g=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,h=o+n,m=this.attnUniform(n,a,s,i,h,o,u??1/Math.sqrt(i),c,l),v=n*a*i*4,y=this.device.createBuffer({size:v,usage:g|f.GPUBufferUsage.COPY_SRC});return this.run("attention_decode",[m,this.buf(e,g),this.buf(r,g),this.buf(t,g),y],[n*a,1,1],y,v)}async attentionFull(e,r,t,n,a,s,i,o,u,c=0){let l=globalThis,f=l.GPUBufferUsage.STORAGE|l.GPUBufferUsage.COPY_DST,g=this.device.createBuffer({size:32,usage:l.GPUBufferUsage.UNIFORM|l.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(g,0,new Uint32Array([n,a,s,i,o,0])),this.device.queue.writeBuffer(g,24,new Float32Array([u??1/Math.sqrt(i),c]));let h=n*a*i*4,m=this.device.createBuffer({size:h,usage:f|l.GPUBufferUsage.COPY_SRC});return this.run("attention_full",[g,this.buf(e,f),this.buf(r,f),this.buf(t,f),m],[Math.ceil(n*a/ee),1,1],m,h)}async attentionFullWg(e,r,t,n,a,s,i,o,u,c=0){let l=globalThis,f=l.GPUBufferUsage.STORAGE|l.GPUBufferUsage.COPY_DST,g=this.device.createBuffer({size:32,usage:l.GPUBufferUsage.UNIFORM|l.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(g,0,new Uint32Array([n,a,s,i,o,0])),this.device.queue.writeBuffer(g,24,new Float32Array([u??1/Math.sqrt(i),c]));let h=n*a*i*4,m=this.device.createBuffer({size:h,usage:f|l.GPUBufferUsage.COPY_SRC});return this.run("attention_full_wg",[g,this.buf(e,f),this.buf(r,f),this.buf(t,f),m],[n*a,1,1],m,h)}async quantizeKvReadback(e,r,t,n){let a=globalThis,s=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST|a.GPUBufferUsage.COPY_SRC,i=t*n,o=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([r,t,n,0]));let u=this.device.createBuffer({size:r*i,usage:s}),c=this.device.createBuffer({size:r*t*4,usage:s});this.dispatch("quantize_kv",[o,this.buf(e,s),u,c],this.grid1D(r*t));let l=await this.readBack(u,r*i),f=new Uint32Array(l.buffer,0,r*i/4),g=await this.readBack(c,r*t*4);return u.destroy?.(),c.destroy?.(),{codes:f,scales:g}}async attentionQ8Kv(e,r,t,n,a,s,i,o,u,c=0,l,f=0,g=0){let h=globalThis,m=h.GPUBufferUsage.STORAGE|h.GPUBufferUsage.COPY_DST,v=c+s,y=this.attnUniform(s,i,o,u,v,c,l??1/Math.sqrt(u),f,g),P=s*i*u*4,D=this.device.createBuffer({size:P,usage:m|h.GPUBufferUsage.COPY_SRC});return this.run("attention_q8kv",[y,this.buf(e,m),this.bufU32(r,m),this.buf(t,m),this.bufU32(n,m),this.buf(a,m),D],[Math.ceil(s*i/ee),1,1],D,P)}async attentionQ8KvDecode(e,r,t,n,a,s,i,o,u,c=0,l,f=0,g=0){let h=globalThis,m=h.GPUBufferUsage.STORAGE|h.GPUBufferUsage.COPY_DST,v=c+s,y=this.attnUniform(s,i,o,u,v,c,l??1/Math.sqrt(u),f,g),P=s*i*u*4,D=this.device.createBuffer({size:P,usage:m|h.GPUBufferUsage.COPY_SRC});return this.run("attention_decode_q8kv",[y,this.buf(e,m),this.bufU32(r,m),this.buf(t,m),this.bufU32(n,m),this.buf(a,m),D],[s*i,1,1],D,P)}async addBias(e,r,t,n){let a=globalThis,s=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,i=this.device.createBuffer({size:8,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(i,0,new Uint32Array([t,n]));let o=this.device.createBuffer({size:e.byteLength,usage:s|a.GPUBufferUsage.COPY_SRC});return this.run("addbias",[i,this.buf(e,s),this.buf(r,s),o],this.grid1D(e.length),o,e.byteLength)}async dequantBlocked(e,r,t,n){let a=globalThis,s=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,i=t/n;if(!Number.isInteger(i))throw new Error(`${e}: nElems ${t} not a multiple of ${n}`);let o=r.byteLength%4===0?r:(()=>{let f=new Uint8Array(Math.ceil(r.byteLength/4)*4);return f.set(r),f})(),u=new Uint32Array(o.buffer,o.byteOffset,o.byteLength/4),c=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([i]));let l=this.device.createBuffer({size:t*4,usage:s|a.GPUBufferUsage.COPY_SRC});return this.run(e,[c,this.bufU32(u,s),l],this.grid1D(i),l,t*4)}async dequantizeQ4K(e,r){return this.dequantBlocked("dequant_q4k",e,r,256)}async dequantizeByType(e,r,t){if(e==="F32")return new Float32Array(r.buffer,r.byteOffset,t);if(e==="F16"){let s=new DataView(r.buffer,r.byteOffset),i=new Float32Array(t);for(let o=0;o<t;o++)i[o]=de(s.getUint16(o*2,!0));return i}if(e==="Q4W")return fe(ke(r,t));if(e==="Q8W")return pe(_e(r,t));if(e==="Q3W")return Le(Je(r,t));let n=X.DEQUANT_SHADER[e],a=X.BLOCK_ELEMS[e];if(!n||!a)throw new Error(`dequant: unsupported GGML type ${e}`);return this.dequantBlocked(n,r,t,a)}dequantBlockedGpu(e,r,t,n){let a=globalThis,s=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,i=t/n;if(!Number.isInteger(i))throw new Error(`${e}: nElems ${t} not a multiple of ${n}`);let o=r.byteLength%4===0?r:(()=>{let f=new Uint8Array(Math.ceil(r.byteLength/4)*4);return f.set(r),f})(),u=new Uint32Array(o.buffer,o.byteOffset,o.byteLength/4),c=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([i]));let l=this.device.createBuffer({size:t*4,usage:s});return this.dispatch(e,[c,this.bufU32(u,s),l],this.grid1D(i)),l}dequantizeToGpu(e,r,t){let n=globalThis,a=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST;if(e==="F32")return this.buf(new Float32Array(r.buffer,r.byteOffset,t),a);if(e==="F16"){let o=new DataView(r.buffer,r.byteOffset),u=new Float32Array(t);for(let c=0;c<t;c++)u[c]=de(o.getUint16(c*2,!0));return this.buf(u,a)}if(e==="Q4W")return this.buf(fe(ke(r,t)),a);if(e==="Q8W")return this.buf(pe(_e(r,t)),a);if(e==="Q3W")return this.buf(Le(Je(r,t)),a);let s=X.DEQUANT_SHADER[e],i=X.BLOCK_ELEMS[e];if(!s||!i)throw new Error(`dequant: unsupported GGML type ${e}`);return this.dequantBlockedGpu(s,r,t,i)}async layerForward(e,r,t,n=!1){let{seq:a,d:s,nHeads:i,nKvHeads:o,headDim:u,ffn:c,ropeTheta:l,eps:f}=r,g=o*u,h=n?(B,M,R,O,C)=>this.matmulT(B,M,R,O,C):(B,M,R,O,C)=>this.matmul(B,M,R,O,C),m=i*u,v=r.rmsGainOnePlus===!0,y=r.attnLogitSoftcap??0,P=(B,M)=>r.act==="gelu"?this.geglu(B,M):this.swiglu(B,M),D=await this.rmsnorm(e,t.attnNorm,a,s,f,v),q=await h(D,t.wq,a,s,m),T=await h(D,t.wk,a,s,g),z=await h(D,t.wv,a,s,g);t.bq&&(q=await this.addBias(q,t.bq,a,m)),t.bk&&(T=await this.addBias(T,t.bk,a,g)),t.bv&&(z=await this.addBias(z,t.bv,a,g)),t.qNorm&&(q=await this.rmsnorm(q,t.qNorm,a*i,u,f,v)),t.kNorm&&(T=await this.rmsnorm(T,t.kNorm,a*o,u,f,v));let U=await this.rope(q,a*i,u,i,0,l),p=await this.rope(T,a*o,u,o,0,l),b=await this.attention(U,p,z,a,i,o,u,0,r.attnScale,y),k=await h(b,t.wo,a,m,s);t.postAttnNorm&&(k=await this.rmsnorm(k,t.postAttnNorm,a,s,f,v));let F=await this.add(e,k),w=await this.rmsnorm(F,t.ffnNorm,a,s,f,v),A=await h(w,t.wgate,a,s,c),x=await h(w,t.wup,a,s,c),_=await P(A,x),G=await h(_,t.wdown,a,c,s);return t.postFfnNorm&&(G=await this.rmsnorm(G,t.postFfnNorm,a,s,f,v)),this.add(F,G)}async layerForwardKV(e,r,t,n,a,s,i=!1){let{seq:o,d:u,nHeads:c,nKvHeads:l,headDim:f,ffn:g,ropeTheta:h,eps:m}=r,v=l*f,y=i?(Y,V,$,W,S)=>this.matmulT(Y,V,$,W,S):(Y,V,$,W,S)=>this.matmul(Y,V,$,W,S),P=(Y,V)=>{let $=new Float32Array(Y.length+V.length);return $.set(Y),$.set(V,Y.length),$},D=c*f,q=r.rmsGainOnePlus===!0,T=r.attnLogitSoftcap??0,z=(Y,V)=>r.act==="gelu"?this.geglu(Y,V):this.swiglu(Y,V),U=await this.rmsnorm(e,t.attnNorm,o,u,m,q),p=await y(U,t.wq,o,u,D),b=await y(U,t.wk,o,u,v),k=await y(U,t.wv,o,u,v);t.bq&&(p=await this.addBias(p,t.bq,o,D)),t.bk&&(b=await this.addBias(b,t.bk,o,v)),t.bv&&(k=await this.addBias(k,t.bv,o,v)),t.qNorm&&(p=await this.rmsnorm(p,t.qNorm,o*c,f,m,q)),t.kNorm&&(b=await this.rmsnorm(b,t.kNorm,o*l,f,m,q));let F=await this.rope(p,o*c,f,c,n,h),w=await this.rope(b,o*l,f,l,n,h),A=P(a,w),x=P(s,k),_=await this.attention(F,A,x,o,c,l,f,n,r.attnScale,T),G=await y(_,t.wo,o,D,u);t.postAttnNorm&&(G=await this.rmsnorm(G,t.postAttnNorm,o,u,m,q));let B=await this.add(e,G),M=await this.rmsnorm(B,t.ffnNorm,o,u,m,q),R=await y(M,t.wgate,o,u,g),O=await y(M,t.wup,o,u,g),C=await z(R,O),E=await y(C,t.wdown,o,g,u);return t.postFfnNorm&&(E=await this.rmsnorm(E,t.postFfnNorm,o,u,m,q)),{out:await this.add(B,E),k:A,v:x}}storage(e){let r=this.bufferPool.get(e);if(r&&r.length){let n=r.pop();return this.pooled.delete(n),n}let t=this.device.createBuffer({size:e,usage:X.STORAGE_USAGE});return this.poolSize.set(t,e),t}release(e){for(let r of e){if(!r)continue;let t=this.poolSize.get(r);if(t!==void 0){if(this.pooled.has(r))continue;this.pooled.add(r);let a=this.bufferPool.get(t);a||(a=[],this.bufferPool.set(t,a)),a.push(r);continue}let n=this.uniformSize.get(r);if(n!==void 0){if(this.pooled.has(r))continue;this.pooled.add(r);let a=this.uniformPool.get(n);a||(a=[],this.uniformPool.set(n,a)),a.push(r);continue}r.destroy?.()}}uploadGpu(e){return e instanceof Float32Array?this.buf(e,X.STORAGE_USAGE):this.f16ToF32Gpu(e.f16,e.n)}uploadGpuF16(e){let r=new Uint16Array(e.length);for(let t=0;t<e.length;t++)r[t]=Be(e[t]);return this.bufU16(r)}f32ToF16Gpu(e,r){let t=globalThis,n=Math.ceil(r/2),a=this.device.createBuffer({size:n*4,usage:X.STORAGE_USAGE}),s=this.device.createBuffer({size:16,usage:t.GPUBufferUsage.UNIFORM|t.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(s,0,new Uint32Array([n])),this.dispatch("packf16",[s,e,a],this.grid1D(n)),a}f32ToQ8Gpu(e,r){let t=globalThis,n=r/32,a=this.device.createBuffer({size:r,usage:X.STORAGE_USAGE}),s=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:X.STORAGE_USAGE}),i=this.device.createBuffer({size:16,usage:t.GPUBufferUsage.UNIFORM|t.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(i,0,new Uint32Array([n])),this.dispatch("quantize_q8",[i,e,a,s],this.grid1D(n)),{codes:a,sc:s}}f32ToQ4Gpu(e,r){let t=globalThis,n=r/32,a=this.device.createBuffer({size:r/2,usage:X.STORAGE_USAGE}),s=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:X.STORAGE_USAGE}),i=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:X.STORAGE_USAGE}),o=this.device.createBuffer({size:16,usage:t.GPUBufferUsage.UNIFORM|t.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(o,0,new Uint32Array([n])),this.dispatch("quantize_q4",[o,e,a,s,i],this.grid1D(n)),{nib:a,sc:s,mn:i}}uploadGpuRawF16(e){let r=Math.ceil(e.byteLength/4)*4,t=this.device.createBuffer({size:r,usage:X.STORAGE_USAGE});if(this.device.queue.writeBuffer(t,0,e,0,e.byteLength-e.byteLength%4),e.byteLength%4){let n=new Uint8Array(4);n.set(e.subarray(e.byteLength-e.byteLength%4)),this.device.queue.writeBuffer(t,e.byteLength-e.byteLength%4,n)}return t}bufU16(e){let r=this.device.createBuffer({size:e.byteLength,usage:X.STORAGE_USAGE});return this.device.queue.writeBuffer(r,0,e),r}uploadGpuRaw(e){let r=Math.ceil(e.byteLength/4)*4,t=this.device.createBuffer({size:r,usage:X.STORAGE_USAGE}),n=e.byteLength-e.byteLength%4;if(this.device.queue.writeBuffer(t,0,e,0,n),e.byteLength%4){let a=new Uint8Array(4);a.set(e.subarray(n)),this.device.queue.writeBuffer(t,n,a)}return t}async matmulQ4(e,r,t,n,a,s,i){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([a,s,i]));let l=this.device.createBuffer({size:a*i*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4",[c,this.buf(e,u),r,t,n,l],[Math.ceil(a/8),Math.ceil(i/8),1],l,a*i*4)}async matmulQ4Tiled(e,r,t,n,a,s,i){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([a,s,i]));let l=this.device.createBuffer({size:a*i*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_tiled",[c,this.buf(e,u),r,t,n,l],[Math.ceil(Math.ceil(a/4)/8),Math.ceil(i/8),1],l,a*i*4)}async matmulQ4Shared(e,r,t,n,a,s,i){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([a,s,i]));let l=this.device.createBuffer({size:a*i*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_shared",[c,this.buf(e,u),r,t,n,l],[Math.ceil(i/64),Math.ceil(a/32),1],l,a*i*4)}async matmulQ3(e,r,t,n,a,s,i,o){let u=globalThis,c=u.GPUBufferUsage.STORAGE|u.GPUBufferUsage.COPY_DST,l=this.device.createBuffer({size:16,usage:u.GPUBufferUsage.UNIFORM|u.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(l,0,new Uint32Array([s,i,o]));let f=this.device.createBuffer({size:s*o*4,usage:c|u.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q3",[l,this.buf(e,c),r,t,n,a,f],[Math.ceil(s/8),Math.ceil(o/8),1],f,s*o*4)}async rwkvWkv7(e,r,t,n,a,s,i,o,u){let c=globalThis,l=c.GPUBufferUsage.STORAGE|c.GPUBufferUsage.COPY_DST,f=this.device.createBuffer({size:8,usage:c.GPUBufferUsage.UNIFORM|c.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(f,0,new Uint32Array([o,u]));let g=this.device.createBuffer({size:e.byteLength,usage:l|c.GPUBufferUsage.COPY_SRC});this.device.queue.writeBuffer(g,0,e);let h=this.device.createBuffer({size:o*u*4,usage:l|c.GPUBufferUsage.COPY_SRC});this.dispatch("rwkv_wkv7",[f,this.buf(r,l),this.buf(t,l),this.buf(n,l),this.buf(a,l),this.buf(s,l),this.buf(i,l),g,h],this.grid1D(o*u));let m=await this.readBack(g,e.byteLength),v=await this.readBack(h,o*u*4);return g.destroy?.(),h.destroy?.(),{S:m,y:v}}async rwkvTokenShift(e,r,t,n){let a=globalThis,s=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,i=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(i,0,new Uint32Array([n]));let o=this.device.createBuffer({size:6*n*4,usage:s|a.GPUBufferUsage.COPY_SRC});this.dispatch("rwkv_token_shift",[i,this.buf(e,s),this.buf(r,s),this.buf(t,s),o],this.grid1D(n*6));let u=await this.readBack(o,6*n*4);return o.destroy?.(),u}async lfm2ShortConv(e,r,t,n,a){let s=globalThis,i=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,o=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([n,a]));let u=this.buf(r,i|s.GPUBufferUsage.COPY_SRC),c=this.device.createBuffer({size:n*4,usage:i|s.GPUBufferUsage.COPY_SRC});this.dispatch("lfm2_shortconv",[o,this.buf(e,i),this.buf(t,i),u,c],this.grid1D(n));let l=await this.readBack(c,n*4),f=await this.readBack(u,(a-1)*n*4);return c.destroy?.(),u.destroy?.(),{out:l,state:f}}async matmulQ8(e,r,t,n,a,s){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,a,s]));let c=this.device.createBuffer({size:n*s*4,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8",[u,this.buf(e,o),r,t,c],[Math.ceil(n/8),Math.ceil(s/8),1],c,n*s*4)}async matmulQ8Tiled(e,r,t,n,a,s){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,a,s]));let c=this.device.createBuffer({size:n*s*4,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_tiled",[u,this.buf(e,o),r,t,c],[Math.ceil(Math.ceil(n/4)/8),Math.ceil(s/8),1],c,n*s*4)}async matmulQ8Shared(e,r,t,n,a,s){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,a,s]));let c=this.device.createBuffer({size:n*s*4,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_shared",[u,this.buf(e,o),r,t,c],[Math.ceil(s/64),Math.ceil(n/32),1],c,n*s*4)}uniformOf(e){let r=globalThis,t=this.uniformPool.get(e);if(t&&t.length){let a=t.pop();return this.pooled.delete(a),a}let n=this.device.createBuffer({size:e,usage:r.GPUBufferUsage.UNIFORM|r.GPUBufferUsage.COPY_DST});return this.uniformSize.set(n,e),n}uniform(e,r){let t=this.uniformOf(32);if(this.device.queue.writeBuffer(t,0,new Uint32Array(e)),r){let n=Array.isArray(r.value)?r.value:[r.value];this.device.queue.writeBuffer(t,r.offset,new Float32Array(n))}return t}attnUniform(e,r,t,n,a,s,i,o,u){let c=this.uniformOf(48);return this.device.queue.writeBuffer(c,0,new Uint32Array([e,r,t,n,a,s])),this.device.queue.writeBuffer(c,24,new Float32Array([i,o])),this.device.queue.writeBuffer(c,32,new Uint32Array([u])),c}recMatmulT(e,r,t,n,a,s,i,o=!1){let u=this.uniform([a,s,i]),c=this.storage(a*i*4),l=this.matmulTPlan(a,s,i,o);return this.recordPass(e,l.shader,[u,t,n,c],l.grid),r.push(u,c),c}recConv2dDirect(e,r,t,n,a,s,i,o,u,c,l,f,g){let h=Math.floor((i+2*g-c)/f)+1,m=Math.floor((o+2*g-l)/f)+1,v=u*h*m,y=this.uniformOf(48);if(this.device.queue.writeBuffer(y,0,new Uint32Array([s,i,o,u,c,l,f,g,h,m])),c===3&&l===3&&f===1&&g===1&&this.convTiledOk){let D=this.storage(v*4);return this.recordPass(e,"conv2d_3x3_tiled",[y,t,n,a,D],[Math.ceil(m/16),Math.ceil(h/16),u]),r.push(y,D),D}let P=this.storage(v*4);return this.recordPass(e,"conv2d_direct",[y,t,n,a,P],this.grid1D(v)),r.push(y,P),P}recConv2dDirectQ8(e,r,t,n,a,s,i,o,u,c,l,f,g){let h=Math.floor((i+2*g-c)/f)+1,m=Math.floor((o+2*g-l)/f)+1,v=u*h*m,y=this.uniformOf(48);this.device.queue.writeBuffer(y,0,new Uint32Array([s,i,o,u,c,l,f,g,h,m]));let P=this.storage(v*4);return this.recordPass(e,"conv2d_direct_q8",[y,t,n.codes,n.sc,a,P],this.grid1D(v)),r.push(y,P),P}recConv2dDirectQ4(e,r,t,n,a,s,i,o,u,c,l,f,g){let h=Math.floor((i+2*g-c)/f)+1,m=Math.floor((o+2*g-l)/f)+1,v=u*h*m,y=this.uniformOf(48);this.device.queue.writeBuffer(y,0,new Uint32Array([s,i,o,u,c,l,f,g,h,m]));let P=this.storage(v*4);return this.recordPass(e,"conv2d_direct_q4",[y,t,n.nib,n.sc,n.mn,a,P],this.grid1D(v)),r.push(y,P),P}recGroupNorm(e,r,t,n,a,s,i,o,u){let c=this.uniform([s,i,o],{offset:12,value:u}),l=this.storage(s*i*4);return this.recordPass(e,"group_norm",[c,t,n,a,l],[o,1,1]),r.push(c,l),l}recUnary(e,r,t,n,a){let s=this.storage(a*4);return this.recordPass(e,t,[n,s],this.grid1D(a)),r.push(s),s}recLayernorm(e,r,t,n,a,s,i,o){let u=this.uniform([s,i],{offset:8,value:o}),c=this.storage(s*i*4);return this.recordPass(e,"layernorm",[u,t,n,a,c],[Math.ceil(s/ee),1,1]),r.push(u,c),c}recAttentionFull(e,r,t,n,a,s,i,o,u,c,l){let f=this.uniform([s,i,o,u,c,0],{offset:24,value:[l??1/Math.sqrt(u),0]}),g=this.storage(s*i*u*4),h=s*i;return this.attnFullWgOk&&u<=192&&h<=65535?this.recordPass(e,"attention_full_wg",[f,t,n,a,g],[h,1,1]):this.recordPass(e,"attention_full",[f,t,n,a,g],[Math.ceil(h/ee),1,1]),r.push(f,g),g}recUpsample(e,r,t,n,a,s,i){let o=this.uniform([n,a,s,i]),u=n*(a*i)*(s*i),c=this.storage(u*4);return this.recordPass(e,"upsample_nearest",[o,t,c],this.grid1D(u)),r.push(o,c),c}recConcat(e,r,t,n,a,s,i){let o=this.storage((a+s)*i*4);return e.copyBufferToBuffer(t,0,o,0,a*i*4),e.copyBufferToBuffer(n,0,o,a*i*4,s*i*4),r.push(o),o}recAddChannelBias(e,r,t,n,a,s){let i=this.uniform([a,s]),o=this.storage(a*s*4);return this.recordPass(e,"add_channel_bias",[i,t,n,o],this.grid1D(a*s)),r.push(i,o),o}recTranspose(e,r,t,n,a){let s=this.uniform([n,a]),i=this.storage(n*a*4);return this.recordPass(e,"transpose2d",[s,t,i],this.grid1D(n*a)),r.push(s,i),i}recGegluSplit(e,r,t,n,a){let s=this.uniform([n,a]),i=this.storage(n*a*4);return this.recordPass(e,"geglu_split",[s,t,i],this.grid1D(n*a)),r.push(s,i),i}recVideoGather(e,r,t,n,a,s){let i=this.uniform([n,a,s]),o=this.storage(s*n*a*4);return this.recordPass(e,"video_motion_gather",[i,t,o],this.grid1D(s*n*a)),r.push(i,o),o}recVideoScatter(e,r,t,n,a,s,i){let o=this.uniform([a,s,i]),u=this.storage(a*s*i*4);return this.recordPass(e,"video_motion_scatter",[o,t,n,u],this.grid1D(a*s*i)),r.push(o,u),u}recVideoAddPe(e,r,t,n,a,s,i){let o=this.uniform([a,s,i]),u=this.storage(i*a*s*4);return this.recordPass(e,"video_add_pe",[o,t,n,u],this.grid1D(i*a*s)),r.push(o,u),u}recAttnTemporal(e,r,t,n,a,s,i,o,u){let c=this.uniform([s,i,o,u],{offset:16,value:1/Math.sqrt(u)}),l=this.storage(s*i*o*u*4);return this.recordPass(e,"attn_temporal",[c,t,n,a,l],this.grid1D(s*i*o)),r.push(c,l),l}recordingSession(){let e=this.device.createCommandEncoder(),r=[],t=n=>{if(n instanceof Float32Array){let a=this.uploadGpu(n);return r.push(a),a}return n};return{conv2d:(n,a,s,i,o,u,c,l,f,g,h)=>a&&a.nib?this.recConv2dDirectQ4(e,r,t(n),a,t(s),i,o,u,c,l,f,g,h):a&&a.codes?this.recConv2dDirectQ8(e,r,t(n),a,t(s),i,o,u,c,l,f,g,h):this.recConv2dDirect(e,r,t(n),t(a),t(s),i,o,u,c,l,f,g,h),groupNorm:(n,a,s,i,o,u,c)=>this.recGroupNorm(e,r,t(n),t(a),t(s),i,o,u,c),silu:(n,a)=>this.recUnary(e,r,"silu",t(n),a),quickGelu:(n,a)=>this.recUnary(e,r,"quick_gelu",t(n),a),gelu:(n,a)=>this.recUnary(e,r,"gelu",t(n),a),relu:(n,a)=>this.recUnary(e,r,"relu",t(n),a),add:(n,a,s)=>this.recBinary(e,r,"add",t(n),t(a),s),geglu:(n,a,s)=>this.recBinary(e,r,"geglu",t(n),t(a),s),matmulT:(n,a,s,i,o)=>this.recMM(e,r,t(n),a instanceof Float32Array?t(a):a,s,i,o,!1),addBias:(n,a,s,i)=>this.recAddBias(e,r,t(n),t(a),s,i),addChannelBias:(n,a,s,i)=>this.recAddChannelBias(e,r,t(n),t(a),s,i),attentionFull:(n,a,s,i,o,u,c,l)=>this.recAttentionFull(e,r,t(n),t(a),t(s),i,o,u,c,l),rope2d:(n,a,s,i,o,u)=>{let c=a instanceof Uint32Array?(()=>{let l=this.uploadGpuRaw(new Uint8Array(a.buffer,a.byteOffset,a.byteLength));return r.push(l),l})():a;return this.recRope2d(e,r,t(n),c,s,i,o,u)},attention:(n,a,s,i,o,u,c,l,f)=>this.recAttention(e,r,t(n),t(a),t(s),i,o,u,c,l,f),upsample:(n,a,s,i,o)=>this.recUpsample(e,r,t(n),a,s,i,o),layernorm:(n,a,s,i,o,u)=>this.recLayernorm(e,r,t(n),t(a),t(s),i,o,u),concat:(n,a,s,i,o)=>this.recConcat(e,r,t(n),t(a),s,i,o),transpose:(n,a,s)=>this.recTranspose(e,r,t(n),a,s),gegluSplit:(n,a,s)=>this.recGegluSplit(e,r,t(n),a,s),videoGather:(n,a,s,i)=>this.recVideoGather(e,r,t(n),a,s,i),videoScatter:(n,a,s,i,o)=>this.recVideoScatter(e,r,t(n),t(a),s,i,o),videoAddPe:(n,a,s,i,o)=>this.recVideoAddPe(e,r,t(n),t(a),s,i,o),attnTemporal:(n,a,s,i,o,u,c)=>this.recAttnTemporal(e,r,t(n),t(a),t(s),i,o,u,c),alloc:n=>{let a=this.storage(n);return r.push(a),a},copy:(n,a,s,i,o)=>{e.copyBufferToBuffer(s,i,n,a,o)},finish:async(n,a)=>{this.device.queue.submit([e.finish()]);let s=await this.readBack(n,a*4);return this.release(r),s},finishKeep:n=>{this.device.queue.submit([e.finish()]);let a=r.indexOf(n);return a>=0&&r.splice(a,1),this.release(r),n},finishKeepMany:n=>{this.device.queue.submit([e.finish()]);for(let a of n){let s=r.indexOf(a);s>=0&&r.splice(s,1)}return this.release(r),n}}}readGpu(e,r){return this.readBack(e,r*4)}trimPool(e=64<<20){let r=[...this.bufferPool.keys()].sort((n,a)=>a-n),t=0;for(let n of this.bufferPool.values())for(let a of n)t+=this.poolSize.get(a)??0;for(let n of r){let a=this.bufferPool.get(n);for(;a.length&&t>e;){let s=a.pop();this.pooled.delete(s),this.poolSize.delete(s),s.destroy?.(),t-=n}}}releaseGpu(e){this.release(e)}waitGpu(){return this.device.queue.onSubmittedWorkDone()}async benchMatmul(e,r,t,n,a,s={}){let{iters:i=10,shared:o=!0,wF16:u=!1}=s,c=this.f16SharedOk,l=this.qSharedOk;this.f16SharedOk=o,this.qSharedOk=o;let f=this.uploadGpu(e),g=[],h=this.device.createCommandEncoder();this.recMM(h,g,f,r,t,n,a,u),this.device.queue.submit([h.finish()]),await this.device.queue.onSubmittedWorkDone();let m=this.device.createCommandEncoder();for(let P=0;P<i;P++)this.recMM(m,g,f,r,t,n,a,u);let v=performance.now();this.device.queue.submit([m.finish()]),await this.device.queue.onSubmittedWorkDone();let y=(performance.now()-v)/i;return this.release(g),f.destroy?.(),this.f16SharedOk=c,this.qSharedOk=l,y}destroy(){try{this.device?.destroy?.()}catch{}this.bufferPool.clear(),this.uniformPool.clear()}f16ToF32Gpu(e,r){let t=this.uploadGpuRawF16(e),n=this.device.createBuffer({size:r*4,usage:X.STORAGE_USAGE}),a=this.uniformOf(16);return this.device.queue.writeBuffer(a,0,new Uint32Array([r])),this.dispatch("f16_to_f32",[a,t,n],this.grid1D(Math.ceil(r/2))),t.destroy?.(),this.release([a]),n}quantizeQ8Gpu(e){let r=e instanceof Float32Array?e.length:e.n;if(r%32!==0)return this.uploadGpu(e);let t=e instanceof Float32Array?this.buf(e,X.STORAGE_USAGE):this.f16ToF32Gpu(e.f16,r),n=this.f32ToQ8Gpu(t,r);return t.destroy?.(),n}async validateResidentOps(){let e=globalThis,r=F=>Float32Array.from({length:F},()=>(Math.random()*2-1)*.5),t=(F,w,A=.005)=>F.length===w.length&&F.every((x,_)=>Math.abs(x-w[_])<=A*(1+Math.abs(w[_]))),n=4,a=4,s=4,i=4,o=2,u=1e-5,c=i*a*s,l=r(n*a*s),f=r(i*n*9),g=r(i),h=r(i),m=r(i),v=await this.silu(await this.groupNorm(await this.conv2dDirect(l,f,g,n,a,s,i,3,3,1,1),h,m,i,a*s,o,u)),y=[],P=this.device.createCommandEncoder(),D=this.uploadGpu(l),q=this.uploadGpu(f),T=this.uploadGpu(g),z=this.uploadGpu(h),U=this.uploadGpu(m);y.push(D,q,T,z,U);let p=this.recConv2dDirect(P,y,D,q,T,n,a,s,i,3,3,1,1);p=this.recGroupNorm(P,y,p,z,U,i,a*s,o,u),p=this.recUnary(P,y,"silu",p,c);let b=this.device.createBuffer({size:c*4,usage:e.GPUBufferUsage.COPY_DST|e.GPUBufferUsage.MAP_READ});P.copyBufferToBuffer(p,0,b,0,c*4),this.device.queue.submit([P.finish()]),await b.mapAsync(e.GPUMapMode.READ);let k=new Float32Array(b.getMappedRange().slice(0));return b.unmap(),b.destroy(),this.release(y),t(k,v)?null:"resident_ops"}recMatmulQ4(e,r,t,n,a,s,i){let o=this.uniform([a,s,i]),u=this.storage(a*i*4);if(a===1&&this.gemvOk){let c=this.gemvGrid(i);this.recordPass(e,"matmul_t_q4_vec",[this.uniform([a,s,i,c.stride]),t,n.nib,n.sc,n.mn,u],c.grid)}else a>=32&&this.qSharedOk?this.recordPass(e,"matmul_t_q4_shared",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(i/64),Math.ceil(a/32),1]):a>=2?this.recordPass(e,"matmul_t_q4_tiled",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(Math.ceil(a/4)/8),Math.ceil(i/8),1]):this.recordPass(e,"matmul_t_q4",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(a/8),Math.ceil(i/8),1]);return r.push(o,u),u}recMatmulQ8(e,r,t,n,a,s,i){let o=this.uniform([a,s,i]),u=this.storage(a*i*4);if(a===1&&this.gemvOk){let c=this.gemvGrid(i);this.recordPass(e,"matmul_t_q8_vec",[this.uniform([a,s,i,c.stride]),t,n.codes,n.sc,u],c.grid)}else a>=32&&this.qSharedOk?this.recordPass(e,"matmul_t_q8_shared",[o,t,n.codes,n.sc,u],[Math.ceil(i/64),Math.ceil(a/32),1]):a>=2?this.recordPass(e,"matmul_t_q8_tiled",[o,t,n.codes,n.sc,u],[Math.ceil(Math.ceil(a/4)/8),Math.ceil(i/8),1]):this.recordPass(e,"matmul_t_q8",[o,t,n.codes,n.sc,u],[Math.ceil(a/8),Math.ceil(i/8),1]);return r.push(o,u),u}gemvGrid(e){return e<=32768?{grid:[e,1,1],stride:32768}:{grid:[32768,Math.ceil(e/32768),1],stride:32768}}async matmulQ4Vec(e,r,t,n,a,s){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.gemvGrid(s),c=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([1,a,s,u.stride]));let l=this.device.createBuffer({size:s*4,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_vec",[c,this.buf(e,o),r,t,n,l],u.grid,l,s*4)}async matmulQ8Vec(e,r,t,n,a){let s=globalThis,i=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,o=this.gemvGrid(a),u=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([1,n,a,o.stride]));let c=this.device.createBuffer({size:a*4,usage:i|s.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_vec",[u,this.buf(e,i),r,t,c],o.grid,c,a*4)}recMatmulQ3(e,r,t,n,a,s,i){let o=this.uniform([a,s,i]),u=this.storage(a*i*4);return this.recordPass(e,"matmul_t_q3",[o,t,n.lo,n.hi,n.sc,n.mn,u],[Math.ceil(a/8),Math.ceil(i/8),1]),r.push(o,u),u}recMM(e,r,t,n,a,s,i,o){return n&&n.q3?this.recMatmulQ3(e,r,t,n,a,s,i):n&&n.nib?this.recMatmulQ4(e,r,t,n,a,s,i):n&&n.codes?this.recMatmulQ8(e,r,t,n,a,s,i):this.recMatmulT(e,r,t,n,a,s,i,o)}recRmsnorm(e,r,t,n,a,s,i,o=!1){let u=this.uniform([a,s,0,o?1:0],{offset:8,value:i}),c=this.storage(a*s*4);return this.recordPass(e,"rmsnorm",[u,t,n,c],[Math.ceil(a/ee),1,1]),r.push(u,c),c}recRope(e,r,t,n,a,s,i,o,u=!1){let c=this.uniform([n,a,s,i],{offset:16,value:o});this.device.queue.writeBuffer(c,20,new Uint32Array([u?1:0]));let l=this.storage(n*a*4);return this.recordPass(e,"rope",[c,t,l],[Math.ceil(n/ee),1,1]),r.push(c,l),l}recRopeMrope(e,r,t,n,a,s,i,o,u){let c=u[0],l=u[0]+u[1],f=this.uniform([a,s,i,c,l],{offset:20,value:o}),g=this.storage(a*s*4);return this.recordPass(e,"rope_mrope",[f,t,n,g],[Math.ceil(a/ee),1,1]),r.push(f,g),g}preparePositions(e,r){if(e.positions&&e.mropeSections){let t=this.storage(e.positions.byteLength);this.device.queue.writeBuffer(t,0,e.positions),r.push(t),e._posGpu=t}if(e.ropeFactors){let t=this.storage(e.ropeFactors.byteLength);this.device.queue.writeBuffer(t,0,e.ropeFactors),r.push(t),e._ffGpu=t}}recRope2d(e,r,t,n,a,s,i,o){let u=this.uniform([a,s,i,0],{offset:16,value:o}),c=this.storage(a*s*4);return this.recordPass(e,"rope_2d",[u,t,n,c],[Math.ceil(a/ee),1,1]),r.push(u,c),c}recRopeFactors(e,r,t,n,a,s,i,o,u,c=!1){let l=this.uniform([a,s,i,o],{offset:16,value:u});this.device.queue.writeBuffer(l,20,new Uint32Array([c?1:0]));let f=this.storage(a*s*4);return this.recordPass(e,"rope_factors",[l,t,n,f],[Math.ceil(a/ee),1,1]),r.push(l,f),f}recAttention(e,r,t,n,a,s,i,o,u,c,l,f,g=0,h=0){let m=this.attnUniform(s,i,o,u,c,l,f??1/Math.sqrt(u),g,h),v=this.storage(s*i*u*4);return this.attnDecodeOk&&s*i<256&&u<=128?this.recordPass(e,"attention_decode",[m,t,n,a,v],[s*i,1,1]):this.recordPass(e,"attention",[m,t,n,a,v],[Math.ceil(s*i/ee),1,1]),r.push(m,v),v}recQuantizeKv(e,r,t,n,a,s,i,o,u){let c=this.uniform([s,i,o,u]);this.recordPass(e,"quantize_kv",[c,t,n,a],this.grid1D(s*i)),r.push(c)}recAttentionQ8(e,r,t,n,a,s,i,o,u,c,l,f,g,h,m=0,v=0){let y=this.attnUniform(o,u,c,l,f,g,h??1/Math.sqrt(l),m,v),P=this.storage(o*u*l*4);return this.attnDecodeOk&&o*u<256&&l<=128?this.recordPass(e,"attention_decode_q8kv",[y,t,n,a,s,i,P],[o*u,1,1]):this.recordPass(e,"attention_q8kv",[y,t,n,a,s,i,P],[Math.ceil(o*u/ee),1,1]),r.push(y,P),P}recAddBias(e,r,t,n,a,s){let i=this.uniform([a,s]),o=this.storage(a*s*4);return this.recordPass(e,"addbias",[i,t,n,o],this.grid1D(a*s)),r.push(i,o),o}recBinary(e,r,t,n,a,s){let i=this.storage(s*4);return this.recordPass(e,t,[n,a,i],this.grid1D(s)),r.push(i),i}recLfm2ShortConv(e,r,t,n,a,s,i){let o=this.uniform([s,i]),u=this.storage(s*4);return this.recordPass(e,"lfm2_shortconv",[o,t,a,n,u],this.grid1D(s)),r.push(o,u),u}recordLayerKV(e,r,t,n,a,s,i){let o=i.k,u=i.v,{seq:c,d:l,nHeads:f,nKvHeads:g,headDim:h,ffn:m,ropeTheta:v,eps:y}=n,P=g*h,D=s+c,q=a.matF16===!0,T=f*h,z=n.rmsGainOnePlus===!0,U=n.attnLogitSoftcap??0,p=n.act==="gelu"?"geglu":"swiglu",b=this.recRmsnorm(e,r,t,a.attnNorm,c,l,y,z),k=this.recMM(e,r,b,a.wq,c,l,T,q),F=this.recMM(e,r,b,a.wk,c,l,P,q),w=this.recMM(e,r,b,a.wv,c,l,P,q);a.bq&&(k=this.recAddBias(e,r,k,a.bq,c,T)),a.bk&&(F=this.recAddBias(e,r,F,a.bk,c,P)),a.bv&&(w=this.recAddBias(e,r,w,a.bv,c,P)),a.qNorm&&(k=this.recRmsnorm(e,r,k,a.qNorm,c*f,h,y,z)),a.kNorm&&(F=this.recRmsnorm(e,r,F,a.kNorm,c*g,h,y,z));let A=n._posGpu,x=n._ffGpu,_=n.ropeInterleaved===!0,G=(W,S,L)=>n.skipRope?W:A?this.recRopeMrope(e,r,W,A,S,h,L,v,n.mropeSections):x?this.recRopeFactors(e,r,W,x,S,h,L,s,v,_):this.recRope(e,r,W,S,h,L,s,v,_),B=G(k,c*f,f),M=G(F,c*g,g),R;if(i.kScale)this.recQuantizeKv(e,r,M,o,i.kScale,c,g,h,s),this.recQuantizeKv(e,r,w,u,i.vScale,c,g,h,s),R=this.recAttentionQ8(e,r,B,o,i.kScale,u,i.vScale,c,f,g,h,D,s,n.attnScale,U,n.window??0);else{let W=P*4;e.copyBufferToBuffer(M,0,o,s*W,c*W),e.copyBufferToBuffer(w,0,u,s*W,c*W),R=this.recAttention(e,r,B,o,u,c,f,g,h,D,s,n.attnScale,U,n.window??0)}let O=this.recMM(e,r,R,a.wo,c,T,l,q);a.postAttnNorm&&(O=this.recRmsnorm(e,r,O,a.postAttnNorm,c,l,y,z));let C=this.recBinary(e,r,"add",t,O,c*l),E=this.recRmsnorm(e,r,C,a.ffnNorm,c,l,y,z),Q=this.recMM(e,r,E,a.wgate,c,l,m,q),Y=this.recMM(e,r,E,a.wup,c,l,m,q),V=this.recBinary(e,r,p,Q,Y,c*m),$=this.recMM(e,r,V,a.wdown,c,m,l,q);return a.postFfnNorm&&($=this.recRmsnorm(e,r,$,a.postFfnNorm,c,l,y,z)),this.recBinary(e,r,"add",C,$,c*l)}setKvQuant(e){this.kvQuant!==e&&(this.kvQuant=e,this.resetKvGpu())}resetKvGpu(){for(let e of this.kvGpu.values())e.k.destroy?.(),e.v.destroy?.(),e.kScale?.destroy?.(),e.vScale?.destroy?.();this.kvGpu.clear(),this.kvSession="";for(let e of this.bufferPool.values())for(let r of e)r.destroy?.();this.bufferPool.clear()}clearKvCache(){this.resetKvGpu()}ensureKv(e,r,t,n){let a=this.kvGpu.get(e);if(a&&a.cap>=r)return a;let s=Math.max(r,(a?.cap??0)+1024,1024),i=this.kvQuant,o=this.storage(s*t*(i?1:4)),u=this.storage(s*t*(i?1:4)),c=i?this.storage(s*n*4):void 0,l=i?this.storage(s*n*4):void 0;if(a){let g=this.device.createCommandEncoder();g.copyBufferToBuffer(a.k,0,o,0,a.cap*t*(i?1:4)),g.copyBufferToBuffer(a.v,0,u,0,a.cap*t*(i?1:4)),i&&a.kScale&&(g.copyBufferToBuffer(a.kScale,0,c,0,a.cap*n*4),g.copyBufferToBuffer(a.vScale,0,l,0,a.cap*n*4)),this.device.queue.submit([g.finish()]),a.k.destroy?.(),a.v.destroy?.(),a.kScale?.destroy?.(),a.vScale?.destroy?.()}let f={k:o,v:u,cap:s,kScale:c,vScale:l};return this.kvGpu.set(e,f),f}async runDecodeGpu(e,r,t,n,a,s){let{seq:i,d:o,nKvHeads:u,headDim:c,eps:l}=r,f=u*c,g=n+i;(s!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${s}" inconnue avec pastLen=${n} \u2014 cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=s);for(let q=0;q<t.length;q++)this.ensureKv(q,g,f,u);let h=[];this.preparePositions(r,h);let m=this.device.createCommandEncoder(),v=this.storage(e.byteLength);this.device.queue.writeBuffer(v,0,e),h.push(v);for(let q=0;q<t.length;q++){let T=this.kvGpu.get(q);v=this.recordLayerKV(m,h,v,Ze(r,i,q,this.swaOk),t[q],n,T)}let y=this.recRmsnorm(m,h,v,a,i,o,l,r.rmsGainOnePlus===!0),P=this.storage(o*4);m.copyBufferToBuffer(y,(i-1)*o*4,P,0,o*4),this.device.queue.submit([m.finish()]);let D=await this.readBack(P,o*4);return h.push(P),this.release(h),D}async decodeLogitsQ8(e,r,t,n,a,s,i,o){let u=globalThis,{seq:c,d:l,nKvHeads:f,headDim:g,eps:h}=r,m=f*g,v=n+c;(s!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${s}" inconnue avec pastLen=${n} \u2014 cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=s);for(let b=0;b<t.length;b++)this.ensureKv(b,v,m,f);let y=[];this.preparePositions(r,y);let P=this.device.createCommandEncoder(),D=this.storage(e.byteLength);this.device.queue.writeBuffer(D,0,e),y.push(D);for(let b=0;b<t.length;b++){let k=this.kvGpu.get(b);D=this.recordLayerKV(P,y,D,Ze(r,c,b,this.swaOk),t[b],n,k)}let q=this.recRmsnorm(P,y,D,a,c,l,h,r.rmsGainOnePlus===!0),T=this.storage(l*4);P.copyBufferToBuffer(q,(c-1)*l*4,T,0,l*4),y.push(T);let z=this.storage(o*4);y.push(z);for(let b of i){let k=this.recMM(P,y,T,b.w,1,l,b.rows,!1);P.copyBufferToBuffer(k,0,z,b.r0*4,b.rows*4)}let U=this.device.createBuffer({size:o*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});P.copyBufferToBuffer(z,0,U,0,o*4),this.device.queue.submit([P.finish()]),await U.mapAsync(u.GPUMapMode.READ);let p=new Float32Array(U.getMappedRange().slice(0));return U.unmap(),U.destroy(),this.release(y),p}async decodeTopKQ8(e,r,t,n,a,s,i,o,u,c,l,f=64){let g=globalThis,{seq:h,d:m,nKvHeads:v,headDim:y,eps:P}=r,D=v*y,q=n+h;(s!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${s}" inconnue avec pastLen=${n} \u2014 cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=s);for(let G=0;G<t.length;G++)this.ensureKv(G,q,D,v);let T=X.timingOn?(G,B)=>console.info(`[timing:gpu] ${G} ${(performance.now()-B).toFixed(0)} ms`):null,z=performance.now(),U=[];this.preparePositions(r,U);let p=this.device.createCommandEncoder(),b=this.storage(e.byteLength);this.device.queue.writeBuffer(b,0,e),U.push(b);for(let G=0;G<t.length;G++){let B=this.kvGpu.get(G);b=this.recordLayerKV(p,U,b,Ze(r,h,G,this.swaOk),t[G],n,B)}let k=this.recRmsnorm(p,U,b,a,h,m,P,r.rmsGainOnePlus===!0),F=this.storage(m*4);p.copyBufferToBuffer(k,(h-1)*m*4,F,0,m*4),U.push(F);let w=this.storage(o*4);U.push(w);for(let G of i){let B=this.recMM(p,U,F,G.w,1,m,G.rows,!1);p.copyBufferToBuffer(B,0,w,G.r0*4,G.rows*4)}if(l&&l>0){let G=this.uniform([o],{offset:4,value:l});this.recordPass(p,"softcap_logits",[G,w],this.grid1D(o)),U.push(G)}if(c&&c!==1&&u.length){let G=Uint32Array.from(u),B=this.bufU32(G,g.GPUBufferUsage.STORAGE|g.GPUBufferUsage.COPY_DST),M=this.uniform([G.length],{offset:4,value:c});this.recordPass(p,"penalize_logits",[M,B,w],this.grid1D(G.length)),U.push(M,B)}let A=this.storage(f*2*4);U.push(A);{let G=this.uniform([o,f]);this.recordPass(p,"top_k",[G,w,A],[1,1,1]),U.push(G)}let x=this.device.createBuffer({size:f*2*4,usage:g.GPUBufferUsage.COPY_DST|g.GPUBufferUsage.MAP_READ});p.copyBufferToBuffer(A,0,x,0,f*2*4),T?.("enregistrement des passes (compilation des pipelines incluse)",z),z=performance.now(),this.device.queue.submit([p.finish()]),await x.mapAsync(g.GPUMapMode.READ),T?.("execution GPU (submit + readback)",z);let _=new Uint32Array(x.getMappedRange().slice(0));return x.unmap(),x.destroy(),this.release(U),{ids:_.slice(0,f),vals:new Float32Array(_.buffer,f*4,f)}}resetLfm2State(){for(let e of this.lfm2KvGpu.values())e.k.destroy?.(),e.v.destroy?.();for(let e of this.lfm2ConvGpu.values())e.destroy?.();this.lfm2KvGpu.clear(),this.lfm2ConvGpu.clear(),this.lfm2Session="";for(let e of this.bufferPool.values())for(let r of e)r.destroy?.();this.bufferPool.clear()}clearLfm2State(){this.resetLfm2State()}ensureLfm2Kv(e,r,t){let n=this.lfm2KvGpu.get(e);if(n&&n.cap>=r)return n;let a=Math.max(r,(n?.cap??0)+1024,1024),s=this.storage(a*t*4),i=this.storage(a*t*4);if(n){let u=this.device.createCommandEncoder();u.copyBufferToBuffer(n.k,0,s,0,n.cap*t*4),u.copyBufferToBuffer(n.v,0,i,0,n.cap*t*4),this.device.queue.submit([u.finish()]),n.k.destroy?.(),n.v.destroy?.()}let o={k:s,v:i,cap:a};return this.lfm2KvGpu.set(e,o),o}ensureLfm2Conv(e,r){let t=this.lfm2ConvGpu.get(e);return t||(t=this.storage(r*4),this.device.queue.writeBuffer(t,0,new Float32Array(r)),this.lfm2ConvGpu.set(e,t)),t}recLfm2ShortConvBatch(e,r,t,n,a,s,i,o){let u=this.uniform([s,i,o]),c=this.storage(o*s*4);this.recordPass(e,"lfm2_shortconv_batch",[u,t,a,n,c],this.grid1D(o*s));let l=this.uniform([s,i,o]);return this.recordPass(e,"lfm2_shortconv_state",[l,t,n],this.grid1D((i-1)*s)),r.push(u,l,c),c}recordLfm2(e,r,t,n,a,s,i,o){let{D:u,nHeads:c,nKvHeads:l,headDim:f,ffn:g,eps:h,theta:m,lc:v}=a,y=l*f,P=c*f,D=y*4;for(let T=0;T<s.length;T++)s[T].conv?this.ensureLfm2Conv(T,(v-1)*u):this.ensureLfm2Kv(T,o+n,y);if(n>=v-1&&this.lfm2BatchOk){let T=this.storage(n*u*4);this.device.queue.writeBuffer(T,0,t),r.push(T);for(let U=0;U<s.length;U++){let p=s[U],b=this.recRmsnorm(e,r,T,p.attnNorm,n,u,h),k;if(p.conv){let G=this.recMM(e,r,b,p.inProj,n,u,3*u,!1),B=this.recLfm2ShortConvBatch(e,r,G,this.lfm2ConvGpu.get(U),p.convW,u,v,n);k=this.recMM(e,r,B,p.outProj,n,u,u,!1)}else{let G=this.recMM(e,r,b,p.wq,n,u,P,!1),B=this.recMM(e,r,b,p.wk,n,u,y,!1),M=this.recMM(e,r,b,p.wv,n,u,y,!1);G=this.recRmsnorm(e,r,G,p.qNorm,n*c,f,h),B=this.recRmsnorm(e,r,B,p.kNorm,n*l,f,h),G=this.recRope(e,r,G,n*c,f,c,o,m),B=this.recRope(e,r,B,n*l,f,l,o,m);let R=this.lfm2KvGpu.get(U);e.copyBufferToBuffer(B,0,R.k,o*D,n*D),e.copyBufferToBuffer(M,0,R.v,o*D,n*D);let O=this.recAttention(e,r,G,R.k,R.v,n,c,l,f,o+n,o);k=this.recMM(e,r,O,p.wo,n,P,u,!1)}T=this.recBinary(e,r,"add",T,k,n*u);let F=this.recRmsnorm(e,r,T,p.ffnNorm,n,u,h),w=this.recMM(e,r,F,p.wgate,n,u,g,!1),A=this.recMM(e,r,F,p.wup,n,u,g,!1),x=this.recBinary(e,r,"swiglu",w,A,n*g),_=this.recMM(e,r,x,p.wdown,n,g,u,!1);T=this.recBinary(e,r,"add",T,_,n*u)}let z=this.storage(u*4);return r.push(z),e.copyBufferToBuffer(T,(n-1)*u*4,z,0,u*4),this.recRmsnorm(e,r,z,i,1,u,h)}let q=null;for(let T=0;T<n;T++){let z=o+T,U=this.storage(u*4);this.device.queue.writeBuffer(U,0,t.subarray(T*u,(T+1)*u)),r.push(U);for(let p=0;p<s.length;p++){let b=s[p],k=this.recRmsnorm(e,r,U,b.attnNorm,1,u,h),F;if(b.conv){let B=this.recMM(e,r,k,b.inProj,1,u,3*u,!1),M=this.recLfm2ShortConv(e,r,B,this.lfm2ConvGpu.get(p),b.convW,u,v);F=this.recMM(e,r,M,b.outProj,1,u,u,!1)}else{let B=this.recMM(e,r,k,b.wq,1,u,P,!1),M=this.recMM(e,r,k,b.wk,1,u,y,!1),R=this.recMM(e,r,k,b.wv,1,u,y,!1);B=this.recRmsnorm(e,r,B,b.qNorm,c,f,h),M=this.recRmsnorm(e,r,M,b.kNorm,l,f,h),B=this.recRope(e,r,B,c,f,c,z,m),M=this.recRope(e,r,M,l,f,l,z,m);let O=this.lfm2KvGpu.get(p);e.copyBufferToBuffer(M,0,O.k,z*D,D),e.copyBufferToBuffer(R,0,O.v,z*D,D);let C=this.recAttention(e,r,B,O.k,O.v,1,c,l,f,z+1,z);F=this.recMM(e,r,C,b.wo,1,P,u,!1)}U=this.recBinary(e,r,"add",U,F,u);let w=this.recRmsnorm(e,r,U,b.ffnNorm,1,u,h),A=this.recMM(e,r,w,b.wgate,1,u,g,!1),x=this.recMM(e,r,w,b.wup,1,u,g,!1),_=this.recBinary(e,r,"swiglu",A,x,g),G=this.recMM(e,r,_,b.wdown,1,g,u,!1);U=this.recBinary(e,r,"add",U,G,u)}T===n-1&&(q=this.recRmsnorm(e,r,U,i,1,u,h))}return q}lfm2SessionReset(e,r){(e!==this.lfm2Session||r===0)&&(r>0&&console.error(`[lfm2] session "${e}" inconnue avec pastLen=${r} \u2014 \xE9tat perdu, sortie invalide. Repartir de pastLen 0.`),this.resetLfm2State(),this.lfm2Session=e)}async lfm2PrefillGpu(e,r,t,n,a,s,i){this.lfm2SessionReset(i,s);let o=[],u=this.device.createCommandEncoder();this.recordLfm2(u,o,e,r,t,n,a,s),this.device.queue.submit([u.finish()]),await this.device.queue.onSubmittedWorkDone(),this.release(o)}async lfm2LogitsGpu(e,r,t,n,a,s,i,o){let u=globalThis;this.lfm2SessionReset(o,i);let c=[],l=this.device.createCommandEncoder(),f=this.recordLfm2(l,c,e,r,t,n,s,i),g=this.recMM(l,c,f,a,1,t.D,t.vocab,!1),h=this.device.createBuffer({size:t.vocab*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});l.copyBufferToBuffer(g,0,h,0,t.vocab*4),this.device.queue.submit([l.finish()]),await h.mapAsync(u.GPUMapMode.READ);let m=new Float32Array(h.getMappedRange().slice(0));return h.unmap(),h.destroy(),this.release(c),m}async lfm2TopKGpu(e,r,t,n,a,s,i,o,u,c,l=64){let f=globalThis;this.lfm2SessionReset(o,i);let g=[],h=this.device.createCommandEncoder(),m=this.recordLfm2(h,g,e,r,t,n,s,i),v=this.recMM(h,g,m,a,1,t.D,t.vocab,!1);if(c&&c!==1&&u.length){let q=Uint32Array.from(u),T=this.bufU32(q,f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST),z=this.uniform([q.length],{offset:4,value:c});this.recordPass(h,"penalize_logits",[z,T,v],this.grid1D(q.length)),g.push(z,T)}let y=this.storage(l*2*4);g.push(y);{let q=this.uniform([t.vocab,l]);this.recordPass(h,"top_k",[q,v,y],[1,1,1]),g.push(q)}let P=this.device.createBuffer({size:l*2*4,usage:f.GPUBufferUsage.COPY_DST|f.GPUBufferUsage.MAP_READ});h.copyBufferToBuffer(y,0,P,0,l*2*4),this.device.queue.submit([h.finish()]),await P.mapAsync(f.GPUMapMode.READ);let D=new Uint32Array(P.getMappedRange().slice(0));return P.unmap(),P.destroy(),this.release(g),{ids:D.slice(0,l),vals:new Float32Array(D.buffer,l*4,l)}}resetRwkvState(){for(let e of this.rwkvStateGpu.values())e.S.destroy?.(),e.tm.destroy?.(),e.cm.destroy?.();this.rwkvStateGpu.clear(),this.rwkvVFirst?.destroy?.(),this.rwkvVFirst=null,this.rwkvSession="";for(let e of this.bufferPool.values())for(let r of e)r.destroy?.();this.bufferPool.clear()}clearRwkvState(){this.resetRwkvState()}ensureRwkvState(e,r,t,n){let a=this.rwkvStateGpu.get(e);if(!a){let s=this.storage(t*n*n*4),i=this.storage(r*4),o=this.storage(r*4);this.device.queue.writeBuffer(s,0,new Float32Array(t*n*n)),this.device.queue.writeBuffer(i,0,new Float32Array(r)),this.device.queue.writeBuffer(o,0,new Float32Array(r)),a={S:s,tm:i,cm:o},this.rwkvStateGpu.set(e,a)}return a}rwkvSessionReset(e,r){(e!==this.rwkvSession||r===0)&&(r>0&&console.error(`[rwkv] session "${e}" inconnue avec pastLen=${r} \u2014 \xE9tat perdu, sortie invalide. Repartir de pastLen 0.`),this.resetRwkvState(),this.rwkvSession=e)}recRwkvToken(e,r,t,n,a,s){let{D:i,H:o,NH:u}=n,c=1e-5,l=64e-5;for(let f=0;f<a.length;f++){let g=a[f],h=this.rwkvStateGpu.get(f),m=this.recLayernorm(e,r,t,g.attnNormW,g.attnNormB,1,i,c),v=this.storage(6*i*4);{let L=this.uniform([i]);this.recordPass(e,"rwkv_token_shift",[L,m,h.tm,g.lerpFused,v],this.grid1D(6*i)),r.push(L,v)}e.copyBufferToBuffer(m,0,h.tm,0,i*4);let y=L=>{let K=this.storage(i*4);return e.copyBufferToBuffer(v,L*i*4,K,0,i*4),r.push(K),K},P=y(0),D=y(1),q=y(2),T=y(3),z=y(4),U=y(5),p=this.recMM(e,r,P,g.R,1,i,i,!1),b=this.recMM(e,r,q,g.K,1,i,i,!1),k=this.recMM(e,r,T,g.V,1,i,i,!1),F=this.recUnary(e,r,"tanh_act",this.recMM(e,r,D,g.w1,1,i,g.rw,!1),g.rw),w=this.recMM(e,r,F,g.w2,1,g.rw,i,!1),A=this.storage(i*4);this.recordPass(e,"rwkv_decay",[g.w0,w,A],this.grid1D(i)),r.push(A);let x=this.recMM(e,r,this.recMM(e,r,z,g.a1,1,i,g.ra,!1),g.a2,1,g.ra,i,!1),_=this.storage(i*4);this.recordPass(e,"rwkv_bias_sigmoid",[g.a0,x,_],this.grid1D(i)),r.push(_);let G=this.recUnary(e,r,"sigmoid",this.recMM(e,r,U,g.g1,1,i,g.rg,!1),g.rg),B=this.recMM(e,r,G,g.g2,1,g.rg,i,!1);if(f===0)e.copyBufferToBuffer(k,0,s,0,i*4);else{let L=this.recMM(e,r,this.recMM(e,r,T,g.v1,1,i,g.rv,!1),g.v2,1,g.rv,i,!1);this.recordPass(e,"rwkv_vresid",[k,s,g.v0,L],this.grid1D(i))}let M=this.storage(i*4),R=this.storage(i*4),O=this.storage(i*4);{let L=this.uniform([u,o]);this.recordPass(e,"rwkv_kprep",[L,b,_,g.kk,g.ka,M,R,O],this.grid1D(u)),r.push(L,M,R,O)}let C=this.storage(i*4);{let L=this.uniform([u,o]);this.recordPass(e,"rwkv_wkv7",[L,p,A,M,k,R,O,h.S,C],this.grid1D(u*o)),r.push(L,C)}let E=this.storage(i*4);{let L=this.uniform([u,o],{offset:8,value:l});this.recordPass(e,"rwkv_out_gn",[L,C,p,M,g.rk,k,g.lnWB,E],this.grid1D(u)),r.push(L,E)}let Q=this.recBinary(e,r,"mul",E,B,i),Y=this.recMM(e,r,Q,g.O,1,i,i,!1);t=this.recBinary(e,r,"add",t,Y,i);let V=this.recLayernorm(e,r,t,g.attnNorm2W,g.attnNorm2B,1,i,c),$=this.storage(i*4);this.recordPass(e,"rwkv_lerp",[V,h.cm,g.lerpK,$],this.grid1D(i)),r.push($),e.copyBufferToBuffer(V,0,h.cm,0,i*4);let W=this.recUnary(e,r,"sqrelu",this.recMM(e,r,$,g.cmK,1,i,g.ffn,!1),g.ffn),S=this.recMM(e,r,W,g.cmV,1,g.ffn,i,!1);t=this.recBinary(e,r,"add",t,S,i)}return t}recordRwkv(e,r,t,n,a,s,i){let{D:o,H:u,NH:c}=a;for(let f=0;f<s.length;f++)this.ensureRwkvState(f,o,c,u);this.rwkvVFirst||(this.rwkvVFirst=this.storage(o*4));let l=null;for(let f=0;f<n;f++){let g=this.storage(o*4);this.device.queue.writeBuffer(g,0,t.subarray(f*o,(f+1)*o)),r.push(g);let h=this.recLayernorm(e,r,g,i.tokW,i.tokB,1,o,1e-5),m=this.recRwkvToken(e,r,h,a,s,this.rwkvVFirst);f===n-1&&(l=this.recLayernorm(e,r,m,i.outW,i.outB,1,o,1e-5))}return l}async rwkvPrefillGpu(e,r,t,n,a,s,i){this.rwkvSessionReset(i,s);let o=[],u=this.device.createCommandEncoder();this.recordRwkv(u,o,e,r,t,n,a),this.device.queue.submit([u.finish()]),await this.device.queue.onSubmittedWorkDone(),this.release(o)}async rwkvLogitsGpu(e,r,t,n,a,s,i,o){let u=globalThis;this.rwkvSessionReset(o,i);let c=[],l=this.device.createCommandEncoder(),f=this.recordRwkv(l,c,e,r,t,n,s),g=this.recMM(l,c,f,a,1,t.D,t.vocab,!1),h=this.device.createBuffer({size:t.vocab*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});l.copyBufferToBuffer(g,0,h,0,t.vocab*4),this.device.queue.submit([l.finish()]),await h.mapAsync(u.GPUMapMode.READ);let m=new Float32Array(h.getMappedRange().slice(0));return h.unmap(),h.destroy(),this.release(c),m}async rwkvTopKGpu(e,r,t,n,a,s,i,o,u,c,l=64){let f=globalThis;this.rwkvSessionReset(o,i);let g=[],h=this.device.createCommandEncoder(),m=this.recordRwkv(h,g,e,r,t,n,s),v=this.recMM(h,g,m,a,1,t.D,t.vocab,!1);if(c&&c!==1&&u.length){let q=Uint32Array.from(u),T=this.bufU32(q,f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST),z=this.uniform([q.length],{offset:4,value:c});this.recordPass(h,"penalize_logits",[z,T,v],this.grid1D(q.length)),g.push(z,T)}let y=this.storage(l*2*4);g.push(y);{let q=this.uniform([t.vocab,l]);this.recordPass(h,"top_k",[q,v,y],[1,1,1]),g.push(q)}let P=this.device.createBuffer({size:l*2*4,usage:f.GPUBufferUsage.COPY_DST|f.GPUBufferUsage.MAP_READ});h.copyBufferToBuffer(y,0,P,0,l*2*4),this.device.queue.submit([h.finish()]),await P.mapAsync(f.GPUMapMode.READ);let D=new Uint32Array(P.getMappedRange().slice(0));return P.unmap(),P.destroy(),this.release(g),{ids:D.slice(0,l),vals:new Float32Array(D.buffer,l*4,l)}}async argmaxProjection(e,r,t,n,a=!1){let s=globalThis,i=[],o=this.device.createCommandEncoder(),u=this.storage(e.byteLength);this.device.queue.writeBuffer(u,0,e),i.push(u);let c=this.storage(n*4);i.push(c);for(let m of r){let v=this.recMatmulT(o,i,u,m.buf,1,t,m.rows,a);o.copyBufferToBuffer(v,0,c,m.r0*4,m.rows*4)}let l=this.storage(4),f=this.uniform([n]);i.push(l,f),this.recordPass(o,"argmax",[f,c,l],[1,1,1]);let g=this.device.createBuffer({size:4,usage:s.GPUBufferUsage.COPY_DST|s.GPUBufferUsage.MAP_READ});o.copyBufferToBuffer(l,0,g,0,4),this.device.queue.submit([o.finish()]),await g.mapAsync(s.GPUMapMode.READ);let h=new Uint32Array(g.getMappedRange().slice(0))[0];return g.unmap(),g.destroy(),this.release(i),h}async projectLogits(e,r,t,n,a=!1){let s=globalThis,i=[],o=this.device.createCommandEncoder(),u=this.storage(e.byteLength);this.device.queue.writeBuffer(u,0,e),i.push(u);let c=this.storage(n*4);i.push(c);for(let g of r){let h=this.recMatmulT(o,i,u,g.buf,1,t,g.rows,a);o.copyBufferToBuffer(h,0,c,g.r0*4,g.rows*4)}let l=this.device.createBuffer({size:n*4,usage:s.GPUBufferUsage.COPY_DST|s.GPUBufferUsage.MAP_READ});o.copyBufferToBuffer(c,0,l,0,n*4),this.device.queue.submit([o.finish()]),await l.mapAsync(s.GPUMapMode.READ);let f=new Float32Array(l.getMappedRange().slice(0));return l.unmap(),l.destroy(),this.release(i),f}async selfValidate(){this.validationFailure=null;let e=U=>(this.validationFailure=U,console.error("[selfValidate] FAILED at:",U,"(hasF16="+this.hasF16+")"),!1),r=(U,p)=>U.length===p.length&&U.every((b,k)=>Math.abs(b-p[k])<.001),t=U=>Float32Array.from({length:U},()=>Math.random()*2-1),n=3,a=4,s=5,i=t(n*a),o=t(a*s),u=new Float32Array(n*s);for(let U=0;U<n;U++)for(let p=0;p<s;p++){let b=0;for(let k=0;k<a;k++)b+=i[U*a+k]*o[k*s+p];u[U*s+p]=b}if(!r(await this.matmul(i,o,n,a,s),u))return e("matmul");{let U=(b,k,F,w,A)=>{let x=new Float32Array(F*A);for(let _=0;_<F;_++)for(let G=0;G<A;G++){let B=0;for(let M=0;M<w;M++)B+=b[_*w+M]*k[G*w+M];x[_*A+G]=B}return x},p=async(b,k,F)=>{let w=t(b*k),A=t(F*k);return r(await this.matmulT(w,A,b,k,F),U(w,A,b,k,F))};if(!await p(3,8,5))return e("matmulT.vec4(3,8,5)");if(!await p(1,16,7))return e("matmulT.vec4(1,16,7)");if(!await p(2,6,4))return e("matmulT.scalar(2,6,4)");if(this.hasF16){let w=t(16),A=t(112),x=this.uploadGpuF16(A),_=await this.matmulT(w,x,1,16,7,!0),G=new Float32Array(7);for(let C=0;C<7;C++){let E=0;for(let Q=0;Q<16;Q++)E+=w[Q]*A[C*16+Q];G[C]=E}x.destroy?.();let B=C=>C.length===G.length&&C.every((E,Q)=>Math.abs(E-G[Q])<=.03*(1+Math.abs(G[Q])));if(!B(_))return e("matmulT.f16");let M=this.uploadGpu(A),R=this.f32ToF16Gpu(M,112),O=await this.matmulT(w,R,1,16,7,!0);if(M.destroy?.(),R.destroy?.(),!B(O))return e("packf16")}if(this.hasF16&&this.f16SharedOk){let b=[{m:20,k:128,n:18},{m:32,k:64,n:64},{m:70,k:40,n:130},{m:33,k:48,n:7}];for(let k of b){let F=t(k.m*k.k),w=t(k.n*k.k),A=this.uploadGpuF16(w),x=await this.matmulT(F,A,k.m,k.k,k.n,!0);this.f16SharedOk=!1;let _=await this.matmulT(F,A,k.m,k.k,k.n,!0);if(this.f16SharedOk=!0,A.destroy?.(),!(x.length===_.length&&x.every((B,M)=>Math.abs(B-_[M])<=.001*(1+Math.abs(_[M]))))){this.f16SharedOk=!1,console.warn(`[selfValidate] matmul_t_f16w_shared KO sur ce GPU (m=${k.m}, k=${k.k}, n=${k.n}) \u2014 repli sur matmul_t_f16w (plus lent, m\xEAme r\xE9sultat).`);break}}}}{let k=t(128),F=t(768),w=Se(F),A=this.uploadGpuRaw(w.nibbles),x=this.uploadGpuRaw(new Uint8Array(w.scales.buffer,w.scales.byteOffset,w.scales.byteLength)),_=this.uploadGpuRaw(new Uint8Array(w.mins.buffer,w.mins.byteOffset,w.mins.byteLength)),G=await this.matmulQ4(k,A,x,_,1,128,6),B=fe(w),M=new Float32Array(6);for(let Q=0;Q<6;Q++){let Y=0;for(let V=0;V<128;V++)Y+=k[V]*B[Q*128+V];M[Q]=Y}if(A.destroy?.(),x.destroy?.(),_.destroy?.(),!r(G,M))return e("matmulQ4");let R=this.uploadGpu(F),O=this.f32ToQ4Gpu(R,768),C=await this.matmulQ4(k,O.nib,O.sc,O.mn,1,128,6);if(R.destroy?.(),O.nib.destroy?.(),O.sc.destroy?.(),O.mn.destroy?.(),!(C.length===M.length&&C.every((Q,Y)=>Math.abs(Q-M[Y])<=.06*(1+Math.abs(M[Y]))+.02)))return e("quantize_q4")}{let k=t(640),F=t(768),w=Bt(F),A=this.uploadGpuRaw(new Uint8Array(w.lo.buffer,w.lo.byteOffset,w.lo.byteLength)),x=this.uploadGpuRaw(new Uint8Array(w.hi.buffer,w.hi.byteOffset,w.hi.byteLength)),_=this.uploadGpuRaw(new Uint8Array(w.scales.buffer,w.scales.byteOffset,w.scales.byteLength)),G=this.uploadGpuRaw(new Uint8Array(w.mins.buffer,w.mins.byteOffset,w.mins.byteLength)),B=await this.matmulQ3(k,A,x,_,G,5,128,6),M=Le(w),R=new Float32Array(30);for(let O=0;O<5;O++)for(let C=0;C<6;C++){let E=0;for(let Q=0;Q<128;Q++)E+=k[O*128+Q]*M[C*128+Q];R[O*6+C]=E}if(A.destroy?.(),x.destroy?.(),_.destroy?.(),G.destroy?.(),!r(B,R))return e("matmulQ3")}{let k=t(640),F=t(768),w=Se(F),A=this.uploadGpuRaw(w.nibbles),x=this.uploadGpuRaw(new Uint8Array(w.scales.buffer,w.scales.byteOffset,w.scales.byteLength)),_=this.uploadGpuRaw(new Uint8Array(w.mins.buffer,w.mins.byteOffset,w.mins.byteLength)),G=await this.matmulQ4Tiled(k,A,x,_,5,128,6),B=fe(w),M=new Float32Array(30);for(let R=0;R<5;R++)for(let O=0;O<6;O++){let C=0;for(let E=0;E<128;E++)C+=k[R*128+E]*B[O*128+E];M[R*6+O]=C}if(A.destroy?.(),x.destroy?.(),_.destroy?.(),!r(G,M))return e("matmul_q4_tiled")}for(let U of[{m:20,n:18},{m:32,n:64},{m:70,n:130}]){let p=U.m,b=128,k=U.n,F=t(p*b),w=t(k*b),A=Se(w),x=this.uploadGpuRaw(A.nibbles),_=this.uploadGpuRaw(new Uint8Array(A.scales.buffer,A.scales.byteOffset,A.scales.byteLength)),G=this.uploadGpuRaw(new Uint8Array(A.mins.buffer,A.mins.byteOffset,A.mins.byteLength)),B=await this.matmulQ4Shared(F,x,_,G,p,b,k),M=fe(A),R=new Float32Array(p*k);for(let O=0;O<p;O++)for(let C=0;C<k;C++){let E=0;for(let Q=0;Q<b;Q++)E+=F[O*b+Q]*M[C*b+Q];R[O*k+C]=E}if(x.destroy?.(),_.destroy?.(),G.destroy?.(),!r(B,R))return e(`matmul_q4_shared(${p},${k})`)}{let k=t(128),F=t(768),w=Oe(F),A=this.uploadGpuRaw(new Uint8Array(w.codes.buffer,w.codes.byteOffset,w.codes.byteLength)),x=this.uploadGpuRaw(new Uint8Array(w.scales.buffer,w.scales.byteOffset,w.scales.byteLength)),_=await this.matmulQ8(k,A,x,1,128,6),G=pe(w),B=new Float32Array(6);for(let C=0;C<6;C++){let E=0;for(let Q=0;Q<128;Q++)E+=k[Q]*G[C*128+Q];B[C]=E}if(A.destroy?.(),x.destroy?.(),!r(_,B))return e("matmulQ8");let M=this.uploadGpu(F),R=this.f32ToQ8Gpu(M,768),O=await this.matmulQ8(k,R.codes,R.sc,1,128,6);if(M.destroy?.(),R.codes.destroy?.(),R.sc.destroy?.(),!r(O,B))return e("quantize_q8")}{let k=t(640),F=t(768),w=Oe(F),A=this.uploadGpuRaw(new Uint8Array(w.codes.buffer,w.codes.byteOffset,w.codes.byteLength)),x=this.uploadGpuRaw(new Uint8Array(w.scales.buffer,w.scales.byteOffset,w.scales.byteLength)),_=await this.matmulQ8Tiled(k,A,x,5,128,6),G=pe(w),B=new Float32Array(30);for(let M=0;M<5;M++)for(let R=0;R<6;R++){let O=0;for(let C=0;C<128;C++)O+=k[M*128+C]*G[R*128+C];B[M*6+R]=O}if(A.destroy?.(),x.destroy?.(),!r(_,B))return e("matmul_q8_tiled")}for(let U of[{k:128,n:6},{k:128,n:130},{k:4096,n:17}]){let p=U.k,b=U.n,k=t(p),F=t(b*p),w=Se(F),A=this.uploadGpuRaw(w.nibbles),x=this.uploadGpuRaw(new Uint8Array(w.scales.buffer,w.scales.byteOffset,w.scales.byteLength)),_=this.uploadGpuRaw(new Uint8Array(w.mins.buffer,w.mins.byteOffset,w.mins.byteLength)),G=await this.matmulQ4Vec(k,A,x,_,p,b),B=fe(w),M=new Float32Array(b);for(let V=0;V<b;V++){let $=0;for(let W=0;W<p;W++)$+=k[W]*B[V*p+W];M[V]=$}if(A.destroy?.(),x.destroy?.(),_.destroy?.(),!r(G,M))return e(`matmul_q4_vec(${p},${b})`);let R=Oe(F),O=this.uploadGpuRaw(new Uint8Array(R.codes.buffer,R.codes.byteOffset,R.codes.byteLength)),C=this.uploadGpuRaw(new Uint8Array(R.scales.buffer,R.scales.byteOffset,R.scales.byteLength)),E=await this.matmulQ8Vec(k,O,C,p,b),Q=pe(R),Y=new Float32Array(b);for(let V=0;V<b;V++){let $=0;for(let W=0;W<p;W++)$+=k[W]*Q[V*p+W];Y[V]=$}if(O.destroy?.(),C.destroy?.(),!r(E,Y))return e(`matmul_q8_vec(${p},${b})`)}for(let U of[{m:20,n:18},{m:32,n:64},{m:70,n:130}]){let p=U.m,b=128,k=U.n,F=t(p*b),w=t(k*b),A=Oe(w),x=this.uploadGpuRaw(new Uint8Array(A.codes.buffer,A.codes.byteOffset,A.codes.byteLength)),_=this.uploadGpuRaw(new Uint8Array(A.scales.buffer,A.scales.byteOffset,A.scales.byteLength)),G=await this.matmulQ8Shared(F,x,_,p,b,k),B=pe(A),M=new Float32Array(p*k);for(let R=0;R<p;R++)for(let O=0;O<k;O++){let C=0;for(let E=0;E<b;E++)C+=F[R*b+E]*B[O*b+E];M[R*k+O]=C}if(x.destroy?.(),_.destroy?.(),!r(G,M))return e(`matmul_q8_shared(${p},${k})`)}{let p=t(1632),b=new Uint8Array(p.buffer,p.byteOffset,p.byteLength),k=(F,w)=>F.length===w.length&&F.every((A,x)=>A===w[x]);if(!k(await this.quantizeToBytes("F32",b,1632,"q8"),await this.quantizeToBytes("F32",b,1632,"q8",256)))return e("quantize_chunk_q8");if(!k(await this.quantizeToBytes("F32",b,1632,"q4"),await this.quantizeToBytes("F32",b,1632,"q4",256)))return e("quantize_chunk_q4")}let c=2,l=8,f=t(c*l),g=t(l),h=new Float32Array(c*l);for(let U=0;U<c;U++){let p=0;for(let k=0;k<l;k++)p+=f[U*l+k]**2;let b=1/Math.sqrt(p/l+1e-5);for(let k=0;k<l;k++)h[U*l+k]=f[U*l+k]*b*g[k]}if(!r(await this.rmsnorm(f,g,c,l),h))return e("rmsnorm");if(!r(await this.rmsnorm(f,g,c,l,1e-5,!0),Ae(f,g,c,l,1e-5,!0)))return e("rmsnorm.onePlus");let m=t(16),v=t(16),y=m.map((U,p)=>U/(1+Math.exp(-U))*v[p]);if(!r(await this.swiglu(m,v),y))return e("swiglu");let P=m.map((U,p)=>qt(U)*v[p]);if(!r(await this.geglu(m,v),P))return e("geglu");let D=m.map((U,p)=>U+v[p]);if(!r(await this.add(m,v),D))return e("add");{let U=X.MAX_WG_DIM*ee+257,p=new Float32Array(U),b=new Float32Array(U),k=[0,1,ee-1,ee,X.MAX_WG_DIM*ee-1,X.MAX_WG_DIM*ee,U-1];for(let A of k)p[A]=A%7-3,b[A]=A%5-2;let F=await this.add(p,b),w=F.length===U;for(let A of k)Math.abs(F[A]-(p[A]+b[A]))>1e-5&&(w=!1);if(!w)return e("grid1D.add(2D)")}let q=(U,p,b=.003)=>U.length===p.length&&U.every((k,F)=>Math.abs(k-p[F])<=b*(1+Math.abs(p[F])));{let w=t(8);if(!q(await this.rope(w,2,4,2,1,1e4),Me(w,2,4,2,1,1e4)))return e("rope")}{let w=t(384),A=new Float32Array(64/2).fill(1);if(!q(await this.ropeFactors(w,A,6,64,2,7,5e5),Me(w,6,64,2,7,5e5)))return e("rope_factors.ones");let x=Float32Array.from({length:64/2},(_,G)=>1+G%5*.7);if(!q(await this.ropeFactors(w,x,6,64,2,7,5e5),hr(w,x,6,64,2,7,5e5)))return e("rope_factors")}{let w=t(384);if(!q(await this.rope(w,6,64,2,7,5e5,!0),ze(w,6,64,2,7,5e5)))return e("rope.interleaved");let A=t(8);if(!q(await this.rope(A,2,4,2,3,1e4,!0),ze(A,2,4,2,3,1e4)))return e("rope.interleaved.hd4");let x=t(384);if(!q(await this.rope(x,6,64,2,0,5e5,!0),ze(x,6,64,2,0,5e5)))return e("rope.interleaved.pos0");let _=64/2,G=new Float32Array(384);for(let C=0;C<6;C++)for(let E=0;E<_;E++)G[C*64+2*E]=w[C*64+E],G[C*64+2*E+1]=w[C*64+E+_];let B=await this.rope(G,6,64,2,7,5e5,!0),M=await this.rope(w,6,64,2,7,5e5,!1),R=new Float32Array(384);for(let C=0;C<6;C++)for(let E=0;E<_;E++)R[C*64+2*E]=M[C*64+E],R[C*64+2*E+1]=M[C*64+E+_];if(!q(B,R))return e("rope.interleaved.equivalence");let O=Float32Array.from({length:_},(C,E)=>1+E%5*.7);if(!q(await this.ropeFactors(w,O,6,64,2,7,5e5,!0),ze(w,6,64,2,7,5e5,O)))return e("rope_factors.interleaved")}{let b=[16,24,24],k=1e6,F=3,w=F*2,A=5,x=t(w*128),_=new Uint32Array(F*3);for(let R=0;R<F;R++){let O=A+R;_.set([O,O,O],R*3)}let G=new Uint32Array([5,5,5,5,6,9,5,7,5]),B=q(await this.ropeMrope(x,_,w,128,2,b,k),Me(x,w,128,2,A,k)),M=q(await this.ropeMrope(x,G,w,128,2,b,k),gr(x,G,w,128,2,b,k));(!B||!M)&&(this.mropeOk=!1,console.error(`[selfValidate] rope_mrope KO sur ce GPU (${B?"positions 3D":"d\xE9g\xE9n\xE9r\xE9\u2260rope"}) \u2014 vision d\xE9sactiv\xE9e, chat texte intact.`))}{let A=t(32),x=t(32),_=t(32);if(!q(await this.attention(A,x,_,2,4,2,4,2),ve(A,x,_,2,4,2,4,2)))return e("attention");let G=.3,B=5;if(!q(await this.attention(A,x,_,2,4,2,4,2,G,B),ve(A,x,_,2,4,2,4,2,G,B)))return e("attention.softcap");{let Y=t(24),V=t(48),$=t(48);for(let W of[1,4,8,64]){if(!q(await this.attention(Y,V,$,3,2,1,4,9,void 0,0,W),ve(Y,V,$,3,2,1,4,9,void 0,0,W)))return e(`attention.window(${W})`);if(!q(await this.attentionDecode(Y,V,$,3,2,1,4,9,void 0,0,W),ve(Y,V,$,3,2,1,4,9,void 0,0,W)))return e(`attention_decode.window(${W})`)}}{let M=await this.quantizeKvReadback(x,4,2,4),R=await this.quantizeKvReadback(_,4,2,4),O=await this.attentionQ8Kv(A,M.codes,M.scales,R.codes,R.scales,2,4,2,4,2),C=($,W)=>{let S=new Float32Array(32);for(let L=0;L<4;L++)for(let K=0;K<2;K++){let H=W[L*2+K];for(let I=0;I<4;I++){let N=L*2*4+K*4+I,j=$[N>>2]>>(N&3)*8&255;S[N]=(j<128?j:j-256)*H}}return S},E=C(M.codes,M.scales),Q=C(R.codes,R.scales),Y=ve(A,E,Q,2,4,2,4,2);if(!q(O,Y,.005))return e("attention.q8kv");let V=0;for(let $=0;$<x.length;$++)V=Math.max(V,Math.abs(E[$]-x[$]));if(V>.05)return e("quantize_kv.error")}}{let U=b=>{this.attnDecodeOk=!1,console.error("[selfValidate] attention d\xE9codage HS sur ce GPU (\xE9tape :",b,") \u2192 repli kernels classiques (plus lents \xE0 contexte long, corrects)")},p=[{nT:1,nH:14,nKv:2,hd:64,past:300},{nT:10,nH:14,nKv:2,hd:64,past:173}];for(let b of p){if(!this.attnDecodeOk)break;let k=b.past+b.nT,F=t(b.nT*b.nH*b.hd),w=t(k*b.nKv*b.hd),A=t(k*b.nKv*b.hd);if(!q(await this.attentionDecode(F,w,A,b.nT,b.nH,b.nKv,b.hd,b.past),ve(F,w,A,b.nT,b.nH,b.nKv,b.hd,b.past))){U(`decode(nT=${b.nT})`);break}let x=await this.quantizeKvReadback(w,k,b.nKv,b.hd),_=await this.quantizeKvReadback(A,k,b.nKv,b.hd),G=await this.attentionQ8KvDecode(F,x.codes,x.scales,_.codes,_.scales,b.nT,b.nH,b.nKv,b.hd,b.past),B=await this.attentionQ8Kv(F,x.codes,x.scales,_.codes,_.scales,b.nT,b.nH,b.nKv,b.hd,b.past);if(!q(G,B,.005)){U(`decode.q8kv(nT=${b.nT})`);break}}if(this.attnDecodeOk){let x=t(64),_=t(350*8),G=t(350*8);q(await this.attentionDecode(x,_,G,2,4,2,8,173,.3,5),ve(x,_,G,2,4,2,8,173,.3,5))||U("decode.softcap")}if(this.attnDecodeOk){let x=t(256),_=t(9088),G=t(9088);q(await this.attentionDecode(x,_,G,1,2,1,128,70),ve(x,_,G,1,2,1,128,70))||U("decode.hd128")}}{let x={seq:3,d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},_={attnNorm:t(16),wq:t(256),wk:t(128),wv:t(128),wo:t(256),bq:t(16),bk:t(8),bv:t(8),ffnNorm:t(16),wgate:t(256),wup:t(256),wdown:t(256)},G=t(48);if(!q(await this.layerForward(G,x,_),et(G,x,_),.005))return e("layerForward")}{let _={seq:3,d:12,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6,attnScale:1/Math.sqrt(4),attnLogitSoftcap:5,act:"gelu",rmsGainOnePlus:!0},G={attnNorm:t(12),wq:t(192),wk:t(96),wv:t(96),wo:t(192),ffnNorm:t(12),wgate:t(192),wup:t(192),wdown:t(192),postAttnNorm:t(12),postFfnNorm:t(12)},B=t(36);if(!q(await this.layerForward(B,_,G),et(B,_,G),.005))return e("layerForward.gemma2")}{let _={seq:3,d:12,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e6,eps:1e-6},G={attnNorm:t(12),wq:t(192),wk:t(96),wv:t(96),wo:t(192),ffnNorm:t(12),wgate:t(192),wup:t(192),wdown:t(192),qNorm:t(4),kNorm:t(4)},B=t(36);if(!q(await this.layerForward(B,_,G),et(B,_,G),.005))return e("layerForward.qwen3")}{let p=new Uint8Array(720);for(let k=0;k<5;k++){let F=k*144,w=new DataView(p.buffer);w.setUint16(F,Be(.005+Math.random()*.05),!0),w.setUint16(F+2,Be(.001+Math.random()*.02),!0);for(let A=4;A<144;A++)p[F+A]=Math.random()*256|0}let b=await this.dequantizeQ4K(p,5*256);if(!q(b,or(p,5),1e-4))return e("dequant.Q4_K")}{let U=G=>{let B=new Uint8Array(G);for(let M=0;M<G;M++)B[M]=Math.random()*256|0;return B},p=(G,B)=>{let M=new DataView(G.buffer),R=O=>B===210?O*210+208:O*B;for(let O=0;O*B<G.length;O++)M.setUint16(R(O),Be(.005+Math.random()*.05),!0);return G},k=p(U(136),34);if(!q(await this.dequantizeByType("Q8_0",k,128),ur(k,4),1e-4))return e("dequant.Q8_0");let F=p(U(88),22);if(!q(await this.dequantizeByType("Q5_0",F,128),cr(F,4),1e-4))return e("dequant.Q5_0");let w=p(U(840),210);if(!q(await this.dequantizeByType("Q6_K",w,4*256),dr(w,4),1e-4))return e("dequant.Q6_K");let A=p(U(72),18);if(!q(await this.dequantizeByType("Q4_0",A,128),lr(A,4),1e-4))return e("dequant.Q4_0");let x=U(704),_=new DataView(x.buffer);for(let G=0;G<4;G++)_.setUint16(G*176,Be(.005+Math.random()*.05),!0),_.setUint16(G*176+2,Be(.001+Math.random()*.02),!0);if(!q(await this.dequantizeByType("Q5_K",x,4*256),fr(x,4),1e-4))return e("dequant.Q5_K")}{let A={d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},x={attnNorm:t(16),wq:t(256),wk:t(128),wv:t(128),wo:t(256),bq:t(16),bk:t(8),bv:t(8),ffnNorm:t(16),wgate:t(256),wup:t(256),wdown:t(256)},_=t(48),B=(await this.layerForward(_,{...A,seq:3},x)).slice(32,48),M=new Float32Array(0),R=await this.layerForwardKV(_.slice(0,32),{...A,seq:2},x,0,M,M),O=await this.layerForwardKV(_.slice(32,48),{...A,seq:1},x,2,R.k,R.v);if(!q(O.out,B,.005))return e("layerForwardKV")}{let b=t(4),k=t(40),F=new Float32Array(10);for(let _=0;_<10;_++){let G=0;for(let B=0;B<4;B++)G+=b[B]*k[_*4+B];F[_]=G}let w=0;for(let _=1;_<10;_++)F[_]>F[w]&&(w=_);let A=this.uploadGpu(k),x=await this.argmaxProjection(b,[{buf:A,rows:10,r0:0}],4,10,!1);if(A.destroy?.(),x!==w)return e("argmaxProjection")}{let A={seq:4,d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},x={attnNorm:t(16),wq:t(256),wk:t(128),wv:t(128),wo:t(256),bq:t(16),bk:t(8),bv:t(8),ffnNorm:t(16),wgate:t(256),wup:t(256),wdown:t(256)},_=t(16),G=t(64),B=new Float32Array(0),M=await this.layerForwardKV(G,{...A,seq:4},x,0,B,B,!0),R=Ae(M.out.slice(48,64),_,1,16,1e-6),O={attnNorm:this.uploadGpu(x.attnNorm),wq:this.uploadGpu(x.wq),wk:this.uploadGpu(x.wk),wv:this.uploadGpu(x.wv),wo:this.uploadGpu(x.wo),ffnNorm:this.uploadGpu(x.ffnNorm),wgate:this.uploadGpu(x.wgate),wup:this.uploadGpu(x.wup),wdown:this.uploadGpu(x.wdown),bq:this.uploadGpu(x.bq),bk:this.uploadGpu(x.bk),bv:this.uploadGpu(x.bv)},C=this.uploadGpu(_),E=this.kvQuant;this.kvQuant=!1,this.resetKvGpu();let Q=await this.runDecodeGpu(G,{...A,seq:4},[O],0,C,"selftest-A");if(!q(Q,R,.008))return this.resetKvGpu(),this.kvQuant=E,e("runDecodeGpu.prefill");await this.runDecodeGpu(G.slice(0,48),{...A,seq:3},[O],0,C,"selftest-B");let Y=await this.runDecodeGpu(G.slice(48,64),{...A,seq:1},[O],3,C,"selftest-B");if(!q(Y,R,.008))return this.resetKvGpu(),this.kvQuant=E,e("runDecodeGpu.decode");this.kvQuant=E,this.resetKvGpu();for(let V of Object.values(O))V?.destroy?.();C.destroy?.()}{let F=Float32Array.from({length:152064},()=>(Math.random()*2-1)*8),w=[...new Set(Array.from({length:40},()=>Math.floor(Math.random()*152064)))],A=F.slice();for(let S=0;S<152064;S++)A[S]=30*Math.tanh(A[S]/30);for(let S of w)A[S]=A[S]>0?A[S]/1.15:A[S]*1.15;let x=Array.from(A.keys()).sort((S,L)=>A[L]-A[S]).slice(0,64),_=globalThis,G=[],B=this.storage(152064*4);this.device.queue.writeBuffer(B,0,F),G.push(B);let M=this.device.createCommandEncoder(),R=this.uniform([152064],{offset:4,value:30});this.recordPass(M,"softcap_logits",[R,B],this.grid1D(152064));let O=this.bufU32(Uint32Array.from(w),_.GPUBufferUsage.STORAGE|_.GPUBufferUsage.COPY_DST),C=this.uniform([w.length],{offset:4,value:1.15});this.recordPass(M,"penalize_logits",[C,O,B],this.grid1D(w.length));let E=this.storage(512),Q=this.uniform([152064,64]);this.recordPass(M,"top_k",[Q,B,E],[1,1,1]),G.push(R,O,C,Q,E);let Y=this.device.createBuffer({size:512,usage:_.GPUBufferUsage.COPY_DST|_.GPUBufferUsage.MAP_READ});M.copyBufferToBuffer(E,0,Y,0,512),this.device.queue.submit([M.finish()]),await Y.mapAsync(_.GPUMapMode.READ);let V=new Uint32Array(Y.getMappedRange().slice(0));Y.unmap(),Y.destroy(),this.release(G);let $=V.slice(0,64),W=new Float32Array(V.buffer,256,64);this.topKOk=!0;for(let S=0;S<64;S++){let L=Math.abs(W[S]-A[x[S]])<=1e-4*(1+Math.abs(A[x[S]])),K=Math.abs(A[$[S]]-W[S])<=1e-4*(1+Math.abs(W[S]));if(!L||!K){this.topKOk=!1,console.error(`[selfValidate] top_k KO sur ce GPU (rang ${S}) \u2014 repli sur le sampling CPU plein-vocab (plus lent, m\xEAme r\xE9sultat).`);break}}}if(this.rwkvWkv7Ok){let k=t(128),F=t(16),w=t(16),A=t(16),x=t(16),_=t(16),G=Float32Array.from({length:16},()=>Math.random()*.5+.5),B=k.slice(),M=new Float32Array(16);for(let W=0;W<2;W++){let S=W*8;for(let L=0;L<8;L++){let K=W*8*8+L*8,H=A[S+L],I=0;for(let j=0;j<8;j++)I+=_[S+j]*B[K+j];let N=0;for(let j=0;j<8;j++){let J=G[S+j]*B[K+j]+H*w[S+j]+x[S+j]*I;B[K+j]=J,N+=F[S+j]*J}M[S+L]=N}}let R=await this.rwkvWkv7(k.slice(),F,G,w,A,_,x,2,8),O=(W,S)=>W.length===S.length&&W.every((L,K)=>Math.abs(L-S[K])<=.001*(1+Math.abs(S[K])));!O(R.S,B)||!O(R.y,M)?(this.rwkvWkv7Ok=!1,console.error("[selfValidate] RWKV-7 WKV KO sur ce GPU \u2014 une archi RWKV (moteur v2) refuserait de charger (non bloquant pour le chat texte).")):console.log("[selfValidate] RWKV-7 WKV OK (r\xE9currence \xE0 \xE9tat fixe, moteur v2)");let C=16,E=t(C),Q=t(C),Y=t(C*6),V=new Float32Array(C*6);for(let W=0;W<6;W++)for(let S=0;S<C;S++){let L=W*C+S;V[L]=E[S]+(Q[S]-E[S])*Y[L]}let $=await this.rwkvTokenShift(E,Q,Y,C);if(O($,V)?console.log("[selfValidate] RWKV-7 token-shift OK"):(this.rwkvWkv7Ok=!1,console.error("[selfValidate] RWKV-7 token-shift KO sur ce GPU (non bloquant pour le chat texte).")),this.rwkvResidentOk){let W=globalThis,S=W.GPUBufferUsage.STORAGE|W.GPUBufferUsage.COPY_DST|W.GPUBufferUsage.COPY_SRC,L=2,K=8,H=L*K,I=(j,J)=>{let ne=Math.max(16,Math.ceil((j.length*4+(J?4:0))/16)*16),ie=this.device.createBuffer({size:ne,usage:W.GPUBufferUsage.UNIFORM|W.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(ie,0,new Uint32Array(j)),J&&this.device.queue.writeBuffer(ie,J.off,new Float32Array([J.val])),ie},N=j=>this.device.createBuffer({size:j*4,usage:S});try{let j=t(H),J=t(H),ne=t(H),ie=Float32Array.from({length:H},()=>Math.random()),ce=new Float32Array(H),Pe=new Float32Array(H),ge=new Float32Array(H);for(let ae=0;ae<L;ae++){let Z=0;for(let le=0;le<K;le++){let se=j[ae*K+le]*J[ae*K+le];Z+=se*se}Z=Math.sqrt(Z)||1e-12;for(let le=0;le<K;le++){let se=ae*K+le,Re=j[se]*J[se]/Z;Pe[se]=-Re,ge[se]=Re*ie[se],ce[se]=j[se]*(1+(ie[se]-1)*ne[se])}}let Ge=N(H),qe=N(H),te=N(H);this.dispatch("rwkv_kprep",[I([L,K]),this.buf(j,S),this.buf(ie,S),this.buf(J,S),this.buf(ne,S),Ge,qe,te],this.grid1D(L));let we=O(await this.readBack(Ge,H*4),ce)&&O(await this.readBack(qe,H*4),Pe)&&O(await this.readBack(te,H*4),ge);Ge.destroy?.(),qe.destroy?.(),te.destroy?.();let ue=t(H),at=t(H),it=t(H),st=t(H),ot=t(H),ut=t(H),ct=new Float32Array(H);for(let ae=0;ae<L;ae++){let Z=ae*K,le=0;for(let re=0;re<K;re++)le+=ue[Z+re];le/=K;let se=0;for(let re=0;re<K;re++){let _t=ue[Z+re]-le;se+=_t*_t}se/=K;let Re=1/Math.sqrt(se+64e-5),Gt=0;for(let re=0;re<K;re++)Gt+=at[Z+re]*ce[Z+re]*it[Z+re];for(let re=0;re<K;re++)ct[Z+re]=(ue[Z+re]-le)*Re*ot[Z+re]+ut[Z+re]+Gt*st[Z+re]}let We=new Float32Array(2*H);We.set(ot,0),We.set(ut,H);let Qe=N(H);this.dispatch("rwkv_out_gn",[I([L,K],{off:8,val:64e-5}),this.buf(ue,S),this.buf(at,S),this.buf(ce,S),this.buf(it,S),this.buf(st,S),this.buf(We,S),Qe],this.grid1D(L));let lt=O(await this.readBack(Qe,H*4),ct);Qe.destroy?.();let ft=t(H),dt=t(H),nr=Float32Array.from(ft,(ae,Z)=>Math.exp(-.606531/(1+Math.exp(-(ae+dt[Z]))))),Ve=N(H);this.dispatch("rwkv_decay",[this.buf(ft,S),this.buf(dt,S),Ve],this.grid1D(H));let gt=O(await this.readBack(Ve,H*4),nr);Ve.destroy?.();let ht=t(H),mt=t(H),pt=t(H),bt=t(H),ar=Float32Array.from(ht,(ae,Z)=>ae+(mt[Z]-ae)*(1/(1+Math.exp(-(pt[Z]+bt[Z]))))),Ye=this.buf(ht,S);this.dispatch("rwkv_vresid",[Ye,this.buf(mt,S),this.buf(pt,S),this.buf(bt,S)],this.grid1D(H));let vt=O(await this.readBack(Ye,H*4),ar);Ye.destroy?.();let wt=t(H),yt=t(H),kt=t(H),ir=Float32Array.from(wt,(ae,Z)=>ae+(yt[Z]-ae)*kt[Z]),$e=N(H);this.dispatch("rwkv_lerp",[this.buf(wt,S),this.buf(yt,S),this.buf(kt,S),$e],this.grid1D(H));let At=O(await this.readBack($e,H*4),ir);$e.destroy?.();let Ut=t(H),sr=Float32Array.from(Ut,ae=>{let Z=Math.max(ae,0);return Z*Z}),Ie=N(H);this.dispatch("sqrelu",[this.buf(Ut,S),Ie],this.grid1D(H));let Pt=O(await this.readBack(Ie,H*4),sr);Ie.destroy?.(),!we||!lt||!gt||!vt||!At||!Pt?(this.rwkvResidentOk=!1,console.error(`[selfValidate] glu RWKV r\xE9sidente KO sur ce GPU (kprep:${we} gn:${lt} decay:${gt} vresid:${vt} lerp:${At} sqrelu:${Pt}) \u2014 repli forwardToken JS+readback (correct, lent).`)):console.log("[selfValidate] glu RWKV r\xE9sidente OK (kprep, out_gn, decay, vresid, lerp, sqrelu)")}catch(j){this.rwkvResidentOk=!1,console.error("[selfValidate] glu RWKV r\xE9sidente : erreur d\u2019ex\xE9cution \u2014 repli forwardToken JS+readback.",j)}}}if(this.lfm2ShortConvOk){let U=B=>Float32Array.from({length:B},()=>Math.random()*2-1),p=(B,M)=>B.length===M.length&&B.every((R,O)=>Math.abs(R-M[O])<=.001*(1+Math.abs(M[O]))),F=U(96),w=U(64),A=U(96),x=new Float32Array(32),_=w.slice();for(let B=0;B<32;B++){let M=F[B]*F[64+B],R=A[B*3+2]*M;for(let O=0;O<2;O++)R+=A[B*3+O]*w[O*32+B];for(let O=0;O+2<3;O++)_[O*32+B]=w[(O+1)*32+B];_[32+B]=M,x[B]=R*F[32+B]}let G=await this.lfm2ShortConv(F,w.slice(),A,32,3);!p(G.out,x)||!p(G.state,_)?(this.lfm2ShortConvOk=!1,console.error("[selfValidate] LFM2 shortconv KO sur ce GPU \u2014 une archi lfm2 refuserait de charger (non bloquant pour le reste).")):console.log("[selfValidate] LFM2 shortconv OK (conv courte gat\xE9e, moteur v2)")}let T=await this.validateDiffusion();T?console.warn("[selfValidate] image-gen primitive KO:",T,"(non bloquant \u2014 chemin texte intact)"):console.log("[selfValidate] image-gen primitives OK (silu, group_norm, conv2d, conv2d_direct, conv2d_direct_q8, relu, upsample_nearest, layernorm, quick_gelu, attention_full)");let z=await this.validateVideoResident();return z?(this.videoResidentOk=!1,console.warn("[selfValidate] motion r\xE9sident KO:",z,"\u2014 repli JS+readback (plus lent, m\xEAme r\xE9sultat).")):console.log("[selfValidate] motion r\xE9sident OK (video_motion_gather, video_motion_scatter, video_add_pe, attn_temporal)"),!0}async validateVideoResident(){let e=o=>Float32Array.from({length:o},()=>Math.random()*2-1),r=(o,u,c=.005)=>o.length===u.length&&o.every((l,f)=>Math.abs(l-u[f])<=c*(1+Math.abs(u[f])));{let o=e(120),u=new Float32Array(120);for(let f=0;f<5;f++)for(let g=0;g<3;g++)for(let h=0;h<8;h++)u[(f*3+g)*8+h]=o[(g*8+h)*5+f];let c=this.recordingSession(),l=await c.finish(c.videoGather(o,3,8,5),120);if(!r(l,u,1e-6))return"video_motion_gather"}{let o=e(120),u=e(120),c=new Float32Array(120);for(let g=0;g<3;g++)for(let h=0;h<8;h++)for(let m=0;m<5;m++)c[(g*8+h)*5+m]=o[(m*3+g)*8+h]+u[(g*8+h)*5+m];let l=this.recordingSession(),f=await l.finish(l.videoScatter(o,u,3,8,5),120);if(!r(f,c,1e-6))return"video_motion_scatter"}{let o=e(120),u=e(24),c=new Float32Array(120);for(let g=0;g<5;g++)for(let h=0;h<3;h++)for(let m=0;m<8;m++)c[(g*3+h)*8+m]=o[(g*3+h)*8+m]+u[h*8+m];let l=this.recordingSession(),f=await l.finish(l.videoAddPe(o,u,3,8,5),120);if(!r(f,c,1e-6))return"video_add_pe"}{let o=e(120),u=e(120),c=e(120),l=1/Math.sqrt(4),f=new Float32Array(120);for(let m=0;m<5;m++)for(let v=0;v<2;v++){let y=v*4,P=m*3;for(let D=0;D<3;D++){let q=(P+D)*8+y,T=new Float32Array(3),z=-1e30;for(let p=0;p<3;p++){let b=0,k=(P+p)*8+y;for(let F=0;F<4;F++)b+=o[q+F]*u[k+F];T[p]=b*l,T[p]>z&&(z=T[p])}let U=0;for(let p=0;p<3;p++)T[p]=Math.exp(T[p]-z),U+=T[p];for(let p=0;p<3;p++){let b=T[p]/U,k=(P+p)*8+y;for(let F=0;F<4;F++)f[q+F]+=b*c[k+F]}}}let g=this.recordingSession(),h=await g.finish(g.attnTemporal(o,u,c,5,3,2,4),120);if(!r(h,f))return"attn_temporal"}return null}async validateDiffusion(){let e=S=>Float32Array.from({length:S},()=>Math.random()*2-1),r=(S,L,K=.005)=>S.length===L.length&&S.every((H,I)=>Math.abs(H-L[I])<=K*(1+Math.abs(L[I]))),t=e(70),n=t.map(S=>S/(1+Math.exp(-S)));if(!r(await this.silu(t),n))return"silu";let a=4,s=5,i=2,o=1e-5,u=e(a*s),c=e(a),l=e(a),f=new Float32Array(a*s),g=a/i;for(let S=0;S<i;S++){let L=S*g*s,K=g*s,H=0;for(let j=0;j<K;j++)H+=u[L+j];H/=K;let I=0;for(let j=0;j<K;j++){let J=u[L+j]-H;I+=J*J}I/=K;let N=1/Math.sqrt(I+o);for(let j=0;j<K;j++){let J=S*g+Math.floor(j/s);f[L+j]=(u[L+j]-H)*N*c[J]+l[J]}}if(!r(await this.groupNorm(u,c,l,a,s,i,o),f))return"group_norm";let h=2,m=4,v=4,y=3,P=3,D=1,q=1,T=4,z=4,U=e(h*m*v),p=e(y*h*P*P),b=e(y),k=new Float32Array(y*T*z);for(let S=0;S<y;S++)for(let L=0;L<T;L++)for(let K=0;K<z;K++){let H=b[S];for(let I=0;I<h;I++)for(let N=0;N<P;N++)for(let j=0;j<P;j++){let J=L*D+N-q,ne=K*D+j-q;J>=0&&J<m&&ne>=0&&ne<v&&(H+=U[I*m*v+J*v+ne]*p[((S*h+I)*P+N)*P+j])}k[(S*T+L)*z+K]=H}if(!r(await this.conv2d(U,p,b,h,m,v,y,P,P,D,q),k))return"conv2d";if(!r(await this.conv2dDirect(U,p,b,h,m,v,y,P,P,D,q),k))return"conv2d_direct";{let I=e(1200),N=e(108),j=e(4),J=await this.conv2dDirect(I,N,j,3,20,20,4,3,3,1,1),ne=this.convTiledOk;this.convTiledOk=!0;let ie=this.recordingSession(),ce=await ie.finish(ie.conv2d(I,N,j,3,20,20,4,3,3,1,1),1600);this.convTiledOk=ne,r(ce,J)||(this.convTiledOk=!1,console.warn("[selfValidate] conv2d_3x3_tiled KO sur ce GPU \u2014 repli sur conv2d_direct (plus lent, m\xEAme r\xE9sultat)."))}{let K=e(8*m*v),H=e(32*P*P),I=e(4),N=Oe(H),j=await this.conv2dDirect(K,pe(N),I,8,m,v,4,P,P,D,q),J={codes:this.uploadGpuRaw(new Uint8Array(N.codes.buffer,N.codes.byteOffset,N.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(N.scales.buffer,N.scales.byteOffset,N.scales.byteLength))},ne=this.recordingSession(),ie=await ne.finish(ne.conv2d(K,J,I,8,m,v,4,P,P,D,q),4*m*v);if(this.releaseGpu([J.codes,J.sc]),!r(ie,j))return"conv2d_direct_q8"}{let K=e(8*m*v),H=e(32*P*P),I=e(4),N=Se(H),j=await this.conv2dDirect(K,fe(N),I,8,m,v,4,P,P,D,q),J={nib:this.uploadGpuRaw(N.nibbles),sc:this.uploadGpuRaw(new Uint8Array(N.scales.buffer,N.scales.byteOffset,N.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(N.mins.buffer,N.mins.byteOffset,N.mins.byteLength))},ne=this.recordingSession(),ie=await ne.finish(ne.conv2d(K,J,I,8,m,v,4,P,P,D,q),4*m*v);if(this.releaseGpu([J.nib,J.sc,J.mn]),!r(ie,j))return"conv2d_direct_q4"}{let L=e(66),K=new Uint16Array(66);for(let j=0;j<66;j++)K[j]=Be(L[j]);let H=new Float32Array(66);for(let j=0;j<66;j++)H[j]=de(K[j]);let I=this.f16ToF32Gpu(new Uint8Array(K.buffer,K.byteOffset,K.byteLength),66),N=await this.readGpu(I,66);if(I.destroy?.(),!r(N,H,1e-6))return"f16_to_f32"}let F=e(70);if(!r(await this.relu(F),F.map(S=>Math.max(S,0))))return"relu";let w=2,A=2,x=2,_=2,G=A*_,B=x*_,M=e(w*A*x),R=new Float32Array(w*G*B);for(let S=0;S<w;S++)for(let L=0;L<G;L++)for(let K=0;K<B;K++)R[S*G*B+L*B+K]=M[S*A*x+Math.floor(L/_)*x+Math.floor(K/_)];if(!r(await this.upsampleNearest(M,w,A,x,_),R))return"upsample_nearest";let O=2,C=8,E=1e-5,Q=e(O*C),Y=e(C),V=e(C),$=new Float32Array(O*C);for(let S=0;S<O;S++){let L=S*C,K=0;for(let N=0;N<C;N++)K+=Q[L+N];K/=C;let H=0;for(let N=0;N<C;N++){let j=Q[L+N]-K;H+=j*j}H/=C;let I=1/Math.sqrt(H+E);for(let N=0;N<C;N++)$[L+N]=(Q[L+N]-K)*I*Y[N]+V[N]}if(!r(await this.layernorm(Q,Y,V,O,C,E),$))return"layernorm";let W=e(70);if(!r(await this.quickGelu(W),W.map(S=>S/(1+Math.exp(-1.702*S)))))return"quick_gelu";{let N=1/Math.sqrt(4),j=e(24),J=e(40),ne=e(40),ie=new Float32Array(24);for(let ce=0;ce<2;ce++)for(let Pe=0;Pe<3;Pe++){let ge=new Float32Array(5),Ge=-1/0;for(let te=0;te<5;te++){let we=0;for(let ue=0;ue<4;ue++)we+=j[Pe*8+ce*4+ue]*J[te*8+ce*4+ue];ge[te]=we*N,ge[te]>Ge&&(Ge=ge[te])}let qe=0;for(let te=0;te<5;te++)ge[te]=Math.exp(ge[te]-Ge),qe+=ge[te];for(let te=0;te<4;te++){let we=0;for(let ue=0;ue<5;ue++)we+=ge[ue]/qe*ne[ue*8+ce*4+te];ie[Pe*8+ce*4+te]=we}}if(!r(await this.attentionFull(j,J,ne,3,2,2,4,5),ie))return"attention_full"}if(this.attnFullWgOk){let S=[{nT:70,kvL:70,nH:5,hd:64},{nT:16,kvL:77,nH:5,hd:64},{nT:9,kvL:9,nH:8,hd:160}];for(let L of S){let K=L.nH*L.hd,H=e(L.nT*K),I=e(L.kvL*K),N=e(L.kvL*K),j=await this.attentionFull(H,I,N,L.nT,L.nH,L.nH,L.hd,L.kvL),J=await this.attentionFullWg(H,I,N,L.nT,L.nH,L.nH,L.hd,L.kvL);if(!r(J,j)){this.attnFullWgOk=!1,console.warn(`[selfValidate] attention_full_wg KO sur ce GPU (hd=${L.hd}, kv=${L.kvL}) \u2014 repli sur attention_full (plus lent, m\xEAme r\xE9sultat).`);break}}}return null}};X.timingOn=(()=>{try{return new URLSearchParams(location.search).get("timing")==="1"}catch{return!1}})(),X.MAX_WG_DIM=65535,X.BLOCK_ELEMS={Q4_K:256,Q5_K:256,Q6_K:256,Q8_0:32,Q5_0:32,Q4_0:32,F32:1,F16:1},X.DEQUANT_SHADER={Q4_K:"dequant_q4k",Q8_0:"dequant_q8_0",Q5_0:"dequant_q5_0",Q6_K:"dequant_q6k",Q4_0:"dequant_q4_0",Q5_K:"dequant_q5k"},X.STORAGE_USAGE=140;var He=X;function de(d){let e=d>>15&1,r=d>>10&31,t=d&1023,n;return r===0?n=t*59604645e-15:r===31?n=65504:n=(1+t/1024)*2**(r-15),e===1?-n:n}function Be(d){let e=new Float32Array(1),r=new Uint32Array(e.buffer);e[0]=d;let t=r[0],n=t>>16&32768,a=(t>>23&255)-127+15,s=t&8388607;return a<=0?n:a>=31?n|31743:(s=(s>>13)+(s>>12&1),s===1024&&(s=0,a+=1),n|a<<10|s&1023)}function or(d,e){let r=new Float32Array(e*256),t=new DataView(d.buffer,d.byteOffset);for(let n=0;n<e;n++){let a=n*144,s=de(t.getUint16(a,!0)),i=de(t.getUint16(a+2,!0)),o=f=>{let g=h=>d[a+4+h];return f<4?[g(f)&63,g(f+4)&63]:[g(f+4)&15|g(f-4)>>6<<4,g(f+4)>>4|g(f)>>6<<4]},u=n*256,c=0,l=0;for(let f=0;f<256;f+=64){let[g,h]=o(c),m=s*g,v=i*h,[y,P]=o(c+1),D=s*y,q=i*P;for(let T=0;T<32;T++){let z=d[a+16+l+T];r[u+f+T]=m*(z&15)-v,r[u+f+32+T]=D*(z>>4)-q}l+=32,c+=2}}return r}function De(d){return d>127?d-256:d}function ur(d,e){let r=new Float32Array(e*32),t=new DataView(d.buffer,d.byteOffset);for(let n=0;n<e;n++){let a=n*34,s=de(t.getUint16(a,!0));for(let i=0;i<32;i++)r[n*32+i]=s*De(d[a+2+i])}return r}function cr(d,e){let r=new Float32Array(e*32),t=new DataView(d.buffer,d.byteOffset);for(let n=0;n<e;n++){let a=n*22,s=de(t.getUint16(a,!0)),i=t.getUint32(a+2,!0);for(let o=0;o<16;o++){let u=d[a+6+o],c=i>>>o<<4&16,l=i>>>o+12&16;r[n*32+o]=s*((u&15|c)-16),r[n*32+o+16]=s*((u>>4|l)-16)}}return r}function lr(d,e){let r=new Float32Array(e*32),t=new DataView(d.buffer,d.byteOffset);for(let n=0;n<e;n++){let a=n*18,s=de(t.getUint16(a,!0));for(let i=0;i<16;i++){let o=d[a+2+i];r[n*32+i]=s*((o&15)-8),r[n*32+i+16]=s*((o>>4)-8)}}return r}function fr(d,e){let r=new Float32Array(e*256),t=new DataView(d.buffer,d.byteOffset);for(let n=0;n<e;n++){let a=n*176,s=de(t.getUint16(a,!0)),i=de(t.getUint16(a+2,!0)),o=h=>{let m=v=>d[a+4+v];return h<4?[m(h)&63,m(h+4)&63]:[m(h+4)&15|m(h-4)>>6<<4,m(h+4)>>4|m(h)>>6<<4]},u=n*256,c=0,l=0,f=1,g=2;for(let h=0;h<256;h+=64){let[m,v]=o(c),y=s*m,P=i*v,[D,q]=o(c+1),T=s*D,z=i*q;for(let U=0;U<32;U++){let p=d[a+48+l+U],b=d[a+16+U];r[u+h+U]=y*((p&15)+(b&f?16:0))-P,r[u+h+32+U]=T*((p>>4)+(b&g?16:0))-z}l+=32,c+=2,f<<=2,g<<=2}}return r}function dr(d,e){let r=new Float32Array(e*256),t=new DataView(d.buffer,d.byteOffset);for(let n=0;n<e;n++){let a=n*210,s=de(t.getUint16(a+208,!0)),i=n*256;for(let o=0;o<2;o++){let u=a+o*64,c=a+128+o*32,l=a+192+o*8,f=i+o*128;for(let g=0;g<32;g++){let h=g/16|0,m=d[u+g],v=d[u+g+32],y=d[c+g],P=(m&15|(y>>0&3)<<4)-32,D=(v&15|(y>>2&3)<<4)-32,q=(m>>4|(y>>4&3)<<4)-32,T=(v>>4|(y>>6&3)<<4)-32;r[f+g]=s*De(d[l+h])*P,r[f+g+32]=s*De(d[l+h+2])*D,r[f+g+64]=s*De(d[l+h+4])*q,r[f+g+96]=s*De(d[l+h+6])*T}}}return r}function xe(d,e,r,t,n){let a=new Float32Array(r*n);for(let s=0;s<r;s++)for(let i=0;i<n;i++){let o=0;for(let u=0;u<t;u++)o+=d[s*t+u]*e[u*n+i];a[s*n+i]=o}return a}function Ae(d,e,r,t,n=1e-5,a=!1){let s=new Float32Array(r*t);for(let i=0;i<r;i++){let o=0;for(let c=0;c<t;c++)o+=d[i*t+c]**2;let u=1/Math.sqrt(o/t+n);for(let c=0;c<t;c++)s[i*t+c]=d[i*t+c]*u*(a?1+e[c]:e[c])}return s}function gr(d,e,r,t,n,a,s){let i=new Float32Array(d.length),o=t/2,u=a[0],c=a[0]+a[1];for(let l=0;l<r;l++){let f=Math.floor(l/n),g=l*t;for(let h=0;h<o;h++){let m=h<u?0:h<c?1:2,y=e[f*3+m]/s**(2*h/t),P=Math.cos(y),D=Math.sin(y),q=d[g+h],T=d[g+h+o];i[g+h]=q*P-T*D,i[g+h+o]=T*P+q*D}}return i}function ze(d,e,r,t,n=0,a=1e4,s){let i=new Float32Array(d.length),o=r/2;for(let u=0;u<e;u++){let c=n+Math.floor(u/t),l=u*r;for(let f=0;f<o;f++){let g=c/(a**(2*f/r)*(s?s[f]:1)),h=Math.cos(g),m=Math.sin(g),v=d[l+2*f],y=d[l+2*f+1];i[l+2*f]=v*h-y*m,i[l+2*f+1]=y*h+v*m}}return i}function hr(d,e,r,t,n,a=0,s=1e4){let i=new Float32Array(d.length),o=t/2;for(let u=0;u<r;u++){let c=a+Math.floor(u/n),l=u*t;for(let f=0;f<o;f++){let g=c/(s**(2*f/t)*e[f]),h=Math.cos(g),m=Math.sin(g),v=d[l+f],y=d[l+f+o];i[l+f]=v*h-y*m,i[l+f+o]=y*h+v*m}}return i}function Me(d,e,r,t,n=0,a=1e4){let s=new Float32Array(d.length),i=r/2;for(let o=0;o<e;o++){let u=n+Math.floor(o/t),c=o*r;for(let l=0;l<i;l++){let f=u/a**(2*l/r),g=Math.cos(f),h=Math.sin(f),m=d[c+l],v=d[c+l+i];s[c+l]=m*g-v*h,s[c+l+i]=v*g+m*h}}return s}function Xe(d,e,r){return d.map((t,n)=>t+e[n%r])}function Ze(d,e,r,t=!0){let n=t?d.windowPerLayer?.[r]??d.window??0:0,a=d.ropeThetaPerLayer?.[r]??d.ropeTheta,s=d.skipRopePerLayer?.[r]??d.skipRope??!1;return{...d,seq:e,window:n,ropeTheta:a,skipRope:s}}function ve(d,e,r,t,n,a,s,i=0,o,u=0,c=0){let l=new Float32Array(t*n*s),f=o??1/Math.sqrt(s),g=m=>u>0?u*Math.tanh(m/u):m,h=n/a;for(let m=0;m<t;m++)for(let v=0;v<n;v++){let y=Math.floor(v/h),P=(m*n+v)*s,D=i+m,q=c>0?Math.max(0,D+1-c):0,T=[],z=-1/0;for(let p=q;p<=D;p++){let b=(p*a+y)*s,k=0;for(let w=0;w<s;w++)k+=d[P+w]*e[b+w];let F=g(k*f);T[p]=F,F>z&&(z=F)}let U=0;for(let p=q;p<=D;p++)T[p]=Math.exp(T[p]-z),U+=T[p];for(let p=q;p<=D;p++){let b=T[p]/U,k=(p*a+y)*s;for(let F=0;F<s;F++)l[P+F]+=b*r[k+F]}}return l}function qt(d){return .5*d*(1+Math.tanh(.7978845608*(d+.044715*d*d*d)))}function et(d,e,r){let{seq:t,d:n,nHeads:a,nKvHeads:s,headDim:i,ffn:o,ropeTheta:u,eps:c}=e,l=s*i,f=a*i,g=e.rmsGainOnePlus===!0,h=e.attnLogitSoftcap??0,m=Ae(d,r.attnNorm,t,n,c,g),v=xe(m,r.wq,t,n,f),y=xe(m,r.wk,t,n,l),P=xe(m,r.wv,t,n,l);r.bq&&(v=Xe(v,r.bq,f)),r.bk&&(y=Xe(y,r.bk,l)),r.bv&&(P=Xe(P,r.bv,l)),r.qNorm&&(v=Ae(v,r.qNorm,t*a,i,c,g)),r.kNorm&&(y=Ae(y,r.kNorm,t*s,i,c,g));let D=Me(v,t*a,i,a,0,u),q=Me(y,t*s,i,s,0,u),T=ve(D,q,P,t,a,s,i,0,e.attnScale,h),z=xe(T,r.wo,t,f,n);r.postAttnNorm&&(z=Ae(z,r.postAttnNorm,t,n,c,g));let U=d.map((A,x)=>A+z[x]),p=Ae(U,r.ffnNorm,t,n,c,g),b=xe(p,r.wgate,t,n,o),k=xe(p,r.wup,t,n,o),F=e.act==="gelu"?b.map((A,x)=>qt(A)*k[x]):b.map((A,x)=>A/(1+Math.exp(-A))*k[x]),w=xe(F,r.wdown,t,o,n);return r.postFfnNorm&&(w=Ae(w,r.postFfnNorm,t,n,c,g)),U.map((A,x)=>A+w[x])}function St(d,e){let r=new DataView(d.buffer,d.byteOffset,d.byteLength),t=new Float32Array(e);for(let n=0;n<e;n++)t[n]=oe(r.getUint16(n*2,!0));return t}function Ot(d,e){let r=new DataView(d.buffer,d.byteOffset,d.byteLength),t=new Float32Array(e);for(let n=0;n<e;n++)t[n]=r.getFloat32(n*4,!0);return t}function Te(d,e,r,t){let n=0;for(let i=0;i<r;i++)n+=d[i]*d[i];let a=1/Math.sqrt(n/r+t),s=new Float32Array(r);for(let i=0;i<r;i++)s[i]=d[i]*a*e[i];return s}var mr=d=>d/(1+Math.exp(-d)),Fe=class Fe{constructor(e,r,t){this.engine=e;this.manifest=r;this.raw=t;this.w=new Map;this.g=new Map;this.pos=0;this.rLayers=[];this.tokNormGpu=null;this.normBufs=[];this.ffn=0}isBigProj(e){return/\.(shortconv\.(in_proj|out_proj)|attn_(q|k|v|output)|ffn_(gate|up|down))\.weight$/.test(e)}async load(e){if(!this.engine.lfm2ShortConvOk)throw new Error("kernel shortconv LFM2 invalid\xE9 sur ce GPU (selfValidate) \u2014 archi lfm2 refus\xE9e.");let r=this.manifest.arch;if(this.D=r.d,this.NH=r.nHeads,this.NKV=r.nKvHeads,this.HD=r.headDim,this.NL=r.blockCount,this.vocab=r.vocab,this.EPS=r.rmsEps,this.THETA=r.ropeTheta,!r.lfm2)throw new Error("manifest sans profil lfm2");this.LC=r.lfm2.lCache,this.convLayer=r.lfm2.kvHeadsPerLayer.map(t=>t===0),this.tok=e,this.stops=new Set(this.manifest.chat?.stopTokenIds?.length?this.manifest.chat.stopTokenIds:[7]);for(let[t,n]of Object.entries(this.manifest.tensors)){if(t==="token_embd.weight"){if(this.embedBytes=await this.raw(t),this.embedDtype=n.dtype,n.dtype==="q4"){let s=ke(this.embedBytes,n.nElems);this.g.set("head",{kind:"q4",nib:this.engine.uploadGpuRaw(s.nibbles),sc:this.up(s.scales),mn:this.up(s.mins),IN:this.D,OUT:this.vocab})}else if(n.dtype==="q8"){let s=_e(this.embedBytes,n.nElems);this.g.set("head",{kind:"q8",codes:this.upI8(s.codes),sc:this.up(s.scales),IN:this.D,OUT:this.vocab})}continue}let a=await this.raw(t);if(this.isBigProj(t)&&(n.dtype==="q4"||n.dtype==="q8")){let s=n.shape[0],i=n.nElems/s;if(n.dtype==="q8"){let o=_e(a,n.nElems);this.g.set(t,{kind:"q8",codes:this.upI8(o.codes),sc:this.up(o.scales),IN:s,OUT:i})}else{let o=ke(a,n.nElems);this.g.set(t,{kind:"q4",nib:this.engine.uploadGpuRaw(o.nibbles),sc:this.up(o.scales),mn:this.up(o.mins),IN:s,OUT:i})}}else this.w.set(t,n.dtype==="f32"?Ot(a,n.nElems):n.dtype==="f16"?St(a,n.nElems):n.dtype==="q8"?pe(_e(a,n.nElems)):fe(ke(a,n.nElems)))}this.buildResidentLayers(),this.reset()}buildResidentLayers(){let e=r=>{let t=this.engine.uploadGpu(this.w.get(r));return this.normBufs.push(t),t};this.tokNormGpu=e("token_embd_norm.weight"),this.ffn=this.g.get("blk.0.ffn_gate.weight")?.OUT??0,this.rLayers=[];for(let r=0;r<this.NL;r++){let t=`blk.${r}.`,n={attnNorm:e(t+"attn_norm.weight"),ffnNorm:e(t+"ffn_norm.weight"),wgate:this.g.get(t+"ffn_gate.weight"),wup:this.g.get(t+"ffn_up.weight"),wdown:this.g.get(t+"ffn_down.weight")};this.convLayer[r]?this.rLayers.push({conv:!0,...n,convW:e(t+"shortconv.conv.weight"),inProj:this.g.get(t+"shortconv.in_proj.weight"),outProj:this.g.get(t+"shortconv.out_proj.weight")}):this.rLayers.push({conv:!1,...n,qNorm:e(t+"attn_q_norm.weight"),kNorm:e(t+"attn_k_norm.weight"),wq:this.g.get(t+"attn_q.weight"),wk:this.g.get(t+"attn_k.weight"),wv:this.g.get(t+"attn_v.weight"),wo:this.g.get(t+"attn_output.weight")})}}residentAvailable(){return this.engine.lfm2ResidentOk!==!1&&!!this.g.get("head")&&this.rLayers.length===this.NL&&this.ffn>0}cfg(){return{D:this.D,nHeads:this.NH,nKvHeads:this.NKV,headDim:this.HD,ffn:this.ffn,eps:this.EPS,theta:this.THETA,lc:this.LC,vocab:this.vocab}}embedsFor(e){let r=this.D,t=new Float32Array(e.length*r);for(let n=0;n<e.length;n++)t.set(this.embedRow(e[n]),n*r);return t}async logitsGpu(e,r,t){return this.pos=r+e.length,this.engine.lfm2LogitsGpu(this.embedsFor(e),e.length,this.cfg(),this.rLayers,this.g.get("head"),this.tokNormGpu,r,t)}async topKGpu(e,r,t,n,a,s=40){return this.pos=r+e.length,this.engine.lfm2TopKGpu(this.embedsFor(e),e.length,this.cfg(),this.rLayers,this.g.get("head"),this.tokNormGpu,r,t,n,a,s)}async prefillGpu(e,r,t){this.pos=r+e.length,await this.engine.lfm2PrefillGpu(this.embedsFor(e),e.length,this.cfg(),this.rLayers,this.tokNormGpu,r,t)}up(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}upI8(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}unload(){for(let e of this.g.values())for(let r of["nib","sc","mn","codes"])e[r]?.destroy?.();for(let e of this.normBufs)e?.destroy?.();this.normBufs=[],this.rLayers=[],this.tokNormGpu=null,this.engine.clearLfm2State?.(),this.g.clear(),this.w.clear()}reset(){this.pos=0,this.state=Array.from({length:this.NL},(e,r)=>this.convLayer[r]?{conv:new Float32Array((this.LC-1)*this.D)}:{K:[],V:[]})}async gemm(e,r){let t=this.g.get(e);if(!t){let n=this.w.get(e==="head"?"token_embd.weight":e),a=n.length/r.length,s=new Float32Array(a);for(let i=0;i<a;i++){let o=0,u=i*r.length;for(let c=0;c<r.length;c++)o+=n[u+c]*r[c];s[i]=o}return s}return t.kind==="q8"?this.engine.matmulQ8(r,t.codes,t.sc,1,t.IN,t.OUT):this.engine.matmulQ4(r,t.nib,t.sc,t.mn,1,t.IN,t.OUT)}embedRow(e){let r=this.D;if(this.embedDtype==="f16")return St(this.embedBytes.subarray(e*r*2,e*r*2+r*2),r);if(this.embedDtype==="f32")return Ot(this.embedBytes.subarray(e*r*4,e*r*4+r*4),r);if(this.embedDtype==="q8"){let o=this.vocab*r,u=r/32,c=new Int8Array(this.embedBytes.buffer,this.embedBytes.byteOffset+e*r,r),l=this.embedBytes.subarray(o+e*u*2,o+e*u*2+u*2),f=new DataView(l.buffer,l.byteOffset,l.byteLength),g=new Float32Array(r);for(let h=0;h<u;h++){let m=oe(f.getUint16(h*2,!0));for(let v=0;v<32;v++)g[h*32+v]=c[h*32+v]*m}return g}let t=this.vocab*r,n=r/32,a=t/2,s=t/2+t/32*2,i=new Uint8Array(r/2+n*2*2);return i.set(this.embedBytes.subarray(e*r/2,e*r/2+r/2),0),i.set(this.embedBytes.subarray(a+e*n*2,a+e*n*2+n*2),r/2),i.set(this.embedBytes.subarray(s+e*n*2,s+e*n*2+n*2),r/2+n*2),fe(ke(i,r))}rope(e,r,t){let n=this.HD,a=e.slice();for(let s=0;s<r;s++){let i=s*n;for(let o=0;o<n/2;o++){let u=Math.pow(this.THETA,-2*o/n),c=Math.cos(t*u),l=Math.sin(t*u),f=e[i+o],g=e[i+o+n/2];a[i+o]=f*c-g*l,a[i+o+n/2]=f*l+g*c}}return a}async forwardToken(e){let r=this.D,t=this.pos++,n=this.embedRow(e);for(let a=0;a<this.NL;a++){let s=`blk.${a}.`,i=this.state[a],o=Te(n,this.w.get(s+"attn_norm.weight"),r,this.EPS),u;if(this.convLayer[a]){let h=await this.gemm(s+"shortconv.in_proj.weight",o),m=await this.engine.lfm2ShortConv(h,i.conv,this.w.get(s+"shortconv.conv.weight"),r,this.LC);i.conv=m.state,u=await this.gemm(s+"shortconv.out_proj.weight",m.out)}else{let h=this.NKV*this.HD,m=await this.gemm(s+"attn_q.weight",o),v=await this.gemm(s+"attn_k.weight",o),y=await this.gemm(s+"attn_v.weight",o),P=this.w.get(s+"attn_q_norm.weight"),D=this.w.get(s+"attn_k_norm.weight");for(let p=0;p<this.NH;p++)m.set(Te(m.slice(p*this.HD,(p+1)*this.HD),P,this.HD,this.EPS),p*this.HD);for(let p=0;p<this.NKV;p++)v.set(Te(v.slice(p*this.HD,(p+1)*this.HD),D,this.HD,this.EPS),p*this.HD);m=this.rope(m,this.NH,t),v=this.rope(v,this.NKV,t),i.K.push(v),i.V.push(y);let q=new Float32Array(this.NH*this.HD),T=i.K.length,z=1/Math.sqrt(this.HD),U=this.NH/this.NKV;for(let p=0;p<this.NH;p++){let b=Math.floor(p/U),k=p*this.HD,F=b*this.HD,w=new Float32Array(T),A=-1e30;for(let _=0;_<T;_++){let G=0;for(let B=0;B<this.HD;B++)G+=m[k+B]*i.K[_][F+B];w[_]=G*z,w[_]>A&&(A=w[_])}let x=0;for(let _=0;_<T;_++)w[_]=Math.exp(w[_]-A),x+=w[_];for(let _=0;_<T;_++){let G=w[_]/x;for(let B=0;B<this.HD;B++)q[k+B]+=G*i.V[_][F+B]}}u=await this.gemm(s+"attn_output.weight",q)}for(let h=0;h<r;h++)n[h]+=u[h];let c=Te(n,this.w.get(s+"ffn_norm.weight"),r,this.EPS),l=await this.gemm(s+"ffn_gate.weight",c),f=await this.gemm(s+"ffn_up.weight",c);for(let h=0;h<l.length;h++)l[h]=mr(l[h])*f[h];let g=await this.gemm(s+"ffn_down.weight",l);for(let h=0;h<r;h++)n[h]+=g[h]}return n=Te(n,this.w.get("token_embd_norm.weight"),r,this.EPS),this.gemm("head",n)}async classify(e,r){this.reset();let t;for(let a of this.tok.encode(e))t=await this.forwardToken(a);let n=r.map(a=>{let s=this.tok.encode(a);return{label:a,logit:t[s[1]??s[0]]}}).sort((a,s)=>s.logit-a.logit);return{label:n[0].label,scores:n}}banTools(e){for(let r of Fe.TOOL_BAN)r<e.length&&(e[r]=-1e30);return e}sampleTok(e,r,t){let{temperature:n=.8,topK:a=40,repeatPenalty:s=1.3}=t,i=new Set(r),o=[];for(let f=0;f<e.length;f++){let g=e[f];i.has(f)&&(g=g>0?g/s:g*s),o.push({i:f,v:g})}o.sort((f,g)=>g.v-f.v),o.length=a;let u=o[0].v,c=0;for(let f of o)f.p=Math.exp((f.v-u)/n),c+=f.p;let l=Math.random()*c;for(let f of o)if(l-=f.p,l<=0)return f.i;return o[0].i}async generate(e,r,t,n,a){this.reset();let s=this.tok.encode(e),i;for(let u of s)i=await this.forwardToken(u);let o=[];for(let u=0;u<r&&!n?.();u++){this.banTools(i);let c;if(a?.sample)c=this.sampleTok(i,o.slice(-64),a);else{c=0;for(let l=1;l<i.length;l++)i[l]>i[c]&&(c=l)}if(this.stops.has(c))break;o.push(c),t&&t(this.tok.decode(o)),i=await this.forwardToken(c)}return o.length?this.tok.decode(o):""}pickFromTopK(e,r){let t=[],n=[];for(let f=0;f<e.ids.length;f++)if(!Fe.TOOL_BAN.includes(e.ids[f])){if(e.vals[f]===-1/0)break;t.push(e.ids[f]),n.push(e.vals[f])}if(!t.length)return e.ids[0];if(!r?.sample)return t[0];let{temperature:a=.8,topK:s=40}=r,i=Math.min(s,t.length),o=n[0],u=0,c=new Array(i);for(let f=0;f<i;f++)c[f]=Math.exp((n[f]-o)/a),u+=c[f];let l=Math.random()*u;for(let f=0;f<i;f++)if(l-=c[f],l<=0)return t[f];return t[0]}async generateResident(e,r,t,n,a){if(!this.residentAvailable())return this.generate(e,r,t,n,a);let s="gen",i=a?.repeatPenalty??(a?.sample?1.3:1),o=this.tok.encode(e),u,c=0;for(;c<o.length;){if(n?.())return"";let g=Math.min(c+Fe.PREFILL_CHUNK,o.length),h=o.slice(c,g);g<o.length?await this.prefillGpu(h,c,s):u=await this.topKGpu(h,c,s,[],1,48),c=g}let l=o.length,f=[];for(let g=0;g<r&&!n?.();g++){let h=this.pickFromTopK(u,a);if(this.stops.has(h))break;f.push(h),t&&t(this.tok.decode(f)),u=await this.topKGpu([h],l,s,i!==1?[...new Set(f.slice(-64))]:[],i,48),l++}return f.length?this.tok.decode(f):""}};Fe.TOOL_BAN=[8,10,12],Fe.PREFILL_CHUNK=128;var Ke=Fe;function Dt(d){if(!d.length)return null;let e=1/0,r=0,t=0;for(let n of d)e=Math.min(e,n.offset),r=Math.max(r,n.offset+n.bytes),t+=n.bytes;return r-e>64<<20||r-e>t*1.5?null:{start:e,end:r}}function Mt(d,e){let r=new Map;for(let a of Object.keys(d)){let s=a.match(/^blk\.(\d+)\./);if(!s)continue;let i=r.get(s[1]);i||r.set(s[1],i=[]),i.push(a)}let t=new Map,n=new Map;return async a=>{let s=d[a];if(!s)throw new Error(`tenseur absent : ${a}`);let i=a.match(/^blk\.(\d+)\./),o=i?r.get(i[1]):void 0,u=o?Dt(o.map(v=>d[v])):null;if(!i||!o||!u)return e.bytes(s.offset,s.bytes);let c=i[1],l=t.get(c);l||(l=e.bytes(u.start,u.end-u.start).then(v=>({start:u.start,bytes:v})),t.set(c,l),n.set(c,o.length));let{start:f,bytes:g}=await l,h=g.subarray(s.offset-f,s.offset-f+s.bytes),m=(n.get(c)??1)-1;return m<=0?(t.delete(c),n.delete(c),new Uint8Array(h)):(n.set(c,m),h)}}function Tt(d,e=16){return Math.ceil(d/e)*e}var pr="BRIK",Ce=12;function br(d){return Tt(Ce+d)}function tt(d){if(d.length<Ce)throw new Error("BRIK: fichier tronqu\xE9 (en-t\xEAte)");let e=String.fromCharCode(d[0],d[1],d[2],d[3]);if(e!==pr)throw new Error(`BRIK: sceau magique absent (${e})`);let r=new DataView(d.buffer,d.byteOffset,d.byteLength),t=r.getUint32(4,!0),n=r.getUint32(8,!0);if(Ce+n>d.length)throw new Error("BRIK: manifeste tronqu\xE9");return{manifest:JSON.parse(new TextDecoder().decode(d.subarray(Ce,Ce+n))),version:t,dataStart:br(n)}}function Ct(d){let{manifest:e,version:r,dataStart:t}=tt(d);return{manifest:e,version:r,dataStart:t,data:d.subarray(t)}}var vr={f16:"F16",f32:"F32",q4:"Q4W",q8:"Q8W",q3:"Q3W"};function Rt(d){let e=[...d].sort((n,a)=>n.id-a.id),r=[],t=0;for(let n of e)r[n.id]=t,t+=n.byteLength;return r}function Lt(d){let e=Rt(d.shards),r={};for(let[n,a]of Object.entries(d.tensors)){let s=vr[a.dtype];if(!s)throw new Error(`dtype BRIK inconnu pour ${n} : ${a.dtype}`);if(e[a.shard]===void 0)throw new Error(`shard ${a.shard} absent du manifeste (tenseur ${n})`);r[n]={offset:e[a.shard]+a.offset,bytes:a.byteLength,nElems:a.nElems,type:s,shape:a.shape}}let t=d.arch;return{arch:t.arch,config:{d:t.d,nHeads:t.nHeads,nKvHeads:t.nKvHeads,headDim:t.headDim,ffn:t.ffn,blockCount:t.blockCount,ropeTheta:t.ropeTheta,rmsEps:t.rmsEps,attnLogitSoftcap:t.attnLogitSoftcap,finalLogitSoftcap:t.finalLogitSoftcap,attnScale:t.attnScale,act:t.act,rmsGainOnePlus:t.rmsGainOnePlus,embedScale:t.embedScale,rwkv:t.rwkv,lfm2:t.lfm2},tensors:r}}var wr="brik-range-v1";function yr(d,e,r){return`${d}${d.includes("?")?"&":"?"}__brik=${e}-${r}`}async function kr(){try{return await caches.open(wr)}catch{return null}}async function rt(d,e,r,t){let n=e+r-1,a=await kr(),s=yr(d,e,n);if(a){let o=await a.match(s);if(o)return{bytes:new Uint8Array(await o.arrayBuffer()),ranged:!0}}let i;for(let o=0;o<4;o++)try{let u=await fetch(d,{headers:{Range:`bytes=${e}-${n}`},signal:t});if(!u.ok&&u.status!==206)throw new Error(`range fetch ${e}-${n} \xE9chou\xE9 : HTTP ${u.status}`);let c=u.status===206,l=new Uint8Array(await u.arrayBuffer()),f=c?l:l.subarray(e,e+r);if(a&&c)try{await a.put(s,new Response(f,{headers:{"Content-Length":String(f.byteLength)}}))}catch(g){jt(g)}return{bytes:f,ranged:c}}catch(u){if(t?.aborted)throw u;i=u,o<3&&await new Promise(c=>setTimeout(c,500*2**o))}throw i instanceof Error?i:new Error(String(i))}var zt=!1;function jt(d){zt||(zt=!0,console.warn("[cache] \xE9criture refus\xE9e (quota plein ? navigation priv\xE9e ?) \u2014 les t\xE9l\xE9chargements de mod\xE8les ne seront PAS r\xE9utilisables \xE0 la prochaine visite. Lib\xE9rez de l'espace via le panneau Stockage.",d))}var Ht="brimkern-model-cache";async function Ar(d){try{let n=await(await caches.open(Ht)).match(d);if(n)return new Uint8Array(await n.arrayBuffer())}catch{}let e=await fetch(d);if(!e.ok)throw new Error(`HTTP ${e.status}`);let r=new Uint8Array(await e.arrayBuffer());try{await(await caches.open(Ht)).put(d,new Response(r.slice(),{headers:{"Content-Length":String(r.byteLength)}}))}catch(t){jt(t)}return r}function Ur(d,e){return{bytes:async(r,t)=>(await rt(d,e+r,t)).bytes}}function Pr(d){return{bytes:async(e,r)=>d.subarray(e,e+r)}}async function Et(d){let e=await rt(d,0,12);if(!e.ranged){let s=await Ar(d),{manifest:i,data:o}=Ct(s);return Kt(i,Pr(o))}let r=new DataView(e.bytes.buffer,e.bytes.byteOffset,12).getUint32(8,!0),t=await rt(d,0,12+r),{manifest:n,dataStart:a}=tt(t.bytes);return Kt(n,Ur(d,a))}function Kt(d,e){if(d.model?.uiArch==="image")throw new Error("Ce fichier est un BRIK image (UNet/CLIP) \u2014 il se charge via la tuile de g\xE9n\xE9ration d'image, pas comme un LLM.");return{source:e,manifest:Lt(d),tokenizerId:d.tokenizer?.id,tokenizer:d.tokenizer,uiArch:d.model?.uiArch,modelName:d.model.name}}function Nt(d,e,r){let t="";if(e==="deepseek"){t+="<\uFF5Cbegin\u2581of\u2581sentence\uFF5C>",r.trim()&&(t+=r);for(let n of d)n.role==="user"?t+=`<\uFF5CUser\uFF5C>${n.content}`:n.role==="assistant"&&(t+=`<\uFF5CAssistant\uFF5C>${n.content}<\uFF5Cend\u2581of\u2581sentence\uFF5C>`);return t+="<\uFF5CAssistant\uFF5C>",t}if(e==="rwkv7"){r.trim()&&(t+=`System: ${r.trim()}

`);for(let n of d)n.role==="user"?t+=`User: ${n.content.trim()}

`:n.role==="assistant"&&(t+=`Assistant: ${n.content.trim()}

`);return t+="Assistant:",t}if(e==="qwen"||e==="qwen3"||e==="lfm2"||e==="smollm3"){r.trim()&&(t+=`<|im_start|>system
${r}<|im_end|>
`);for(let n of d)t+=`<|im_start|>${n.role}
${n.content}<|im_end|>
`;t+=`<|im_start|>assistant
`}else if(e==="llama3"){t+="<|begin_of_text|>",r.trim()&&(t+=`<|start_header_id|>system<|end_header_id|>

${r}<|eot_id|>`);for(let n of d)t+=`<|start_header_id|>${n.role}<|end_header_id|>

${n.content}<|eot_id|>`;t+=`<|start_header_id|>assistant<|end_header_id|>

`}else if(e==="mistral3"){t+="<s>",r.trim()&&(t+=`[SYSTEM_PROMPT]${r}[/SYSTEM_PROMPT]`);for(let n of d)n.role==="user"?t+=`[INST]${n.content}[/INST]`:n.role==="assistant"&&(t+=`${n.content}</s>`)}else if(e==="gemma"||e==="gemma3"){r.trim()&&(t+=`<start_of_turn>model
${r}<end_of_turn>
`);for(let n of d)t+=`<start_of_turn>${n.role==="assistant"?"model":"user"}
${n.content}<end_of_turn>
`;t+=`<start_of_turn>model
`}return t}var Gr=new Set(["avec","pour","dans","les","des","une","est","sur","par","que","qui","quoi","comment","pourquoi","quand","vous","nous","votre","notre","mais","plus","tout","tous","cette","sont","avez","puis","faire","fait","the","and","for","with","what","who","how","why","when","about","your","our","you","are","can","does","did","this","that","from","have"]);function Wt(d){let e=(d.toLowerCase().match(/[\p{L}\p{N}]{3,}/gu)??[]).filter(r=>!Gr.has(r));return[...new Set(e)]}function Qt(d,e=600){let r=[];return d.forEach((t,n)=>{let a=(t.title||"").trim(),s=(t.text||"").split(/\n\s*\n+/).map(u=>u.trim()).filter(Boolean),i="",o=()=>{i.trim()&&r.push({title:a,text:i.trim(),doc:n}),i=""};for(let u of s){if(u.length>e*1.6){o();let c=u.split(/(?<=[.!?])\s+/),l="";for(let f of c)l&&(l+" "+f).length>e?(r.push({title:a,text:l.trim(),doc:n}),l=f):l=l?`${l} ${f}`:f;l.trim()&&r.push({title:a,text:l.trim(),doc:n});continue}i&&(i+`

`+u).length>e&&o(),i=i?`${i}

${u}`:u}o()}),r}function _r(d,e,r){if(!d.length)return 0;let t=`${e.title} ${e.text}`.toLowerCase(),n=e.title.toLowerCase(),a=0,s=0;for(let i of d){let o=r.get(i)??1;s+=o,t.includes(i)&&(a+=o*(n.includes(i)?1.5:1))}return s?a/s:0}function Br(d){let e=new Map;for(let n of d)for(let a of Wt(`${n.title} ${n.text}`))e.set(a,(e.get(a)??0)+1);let r=new Map,t=Math.max(1,d.length);for(let[n,a]of e)r.set(n,Math.log(1+t/a));return r}function Vt(d,e,r=1200,t=3,n=.34){let a=Wt(d);if(!a.length||!e.length)return[];let s=Br(e),i=e.map(l=>({c:l,s:_r(a,l,s)})).filter(l=>l.s>=n).sort((l,f)=>f.s-l.s),o=[],u=new Set,c=r;for(let{c:l}of i)o.length>=t||l.text.length>c||u.has(l.doc)||(o.push(l),u.add(l.doc),c-=l.text.length);for(let{c:l}of i){if(o.length>=t)break;o.includes(l)||l.text.length>c||(o.push(l),c-=l.text.length)}return o}function Yt(d){return d.length?`

Answer using ONLY the reference notes below. If the answer is not in them, say you do not have that information \u2014 never fill the gap with what you assume.

--- NOTES ---
${d.map((r,t)=>`[${t+1}]${r.title?` ${r.title}`:""}
${r.text}`).join(`

`)}
--- END OF NOTES ---`:`

No reference note matches this question. Say that you do not have this information \u2014 do not guess.`}function $t(d){let e=Array.isArray(d)?d:[d],r=[];for(let t of e)typeof t=="string"&&t.trim()?r.push({text:t}):t&&typeof t=="object"&&typeof t.text=="string"&&t.text.trim()&&r.push({title:t.title,text:t.text});return r}function xr(){let d=[];for(let a=33;a<=126;a++)d.push(a);for(let a=161;a<=172;a++)d.push(a);for(let a=174;a<=255;a++)d.push(a);let e=d.slice(),r=0;for(let a=0;a<256;a++)d.includes(a)||(d.push(a),e.push(256+r),r++);let t=new Array(256),n=new Map;for(let a=0;a<d.length;a++)t[d[a]]=String.fromCodePoint(e[a]),n.set(String.fromCodePoint(e[a]),d[a]);return{enc:t,dec:n}}var It="'(?:[sdmt]|ll|ve|re)| ?\\p{L}+| ?\\p{N}+| ?[^\\s\\p{L}\\p{N}]+|\\s+(?!\\S)|\\s+",je=class d{constructor(e){this.vocab=new Map;this.idToTok=new Map;this.ranks=new Map;this.added=[];this.specialIds=new Set;this.addedRe=null;this.bosIds=[];this.cache=new Map;let r=typeof e=="string"?JSON.parse(e):e;if(r?.model?.type!=="BPE")throw new Error(`BpeTokenizer : model.type ${r?.model?.type} non couvert (BPE uniquement)`);({enc:this.byteEnc,dec:this.byteDec}=xr());for(let[i,o]of Object.entries(r.model.vocab))this.vocab.set(i,o),this.idToTok.set(o,i);(r.model.merges??[]).forEach((i,o)=>this.ranks.set(Array.isArray(i)?`${i[0]} ${i[1]}`:i,o));for(let i of r.added_tokens??[])this.added.push(i),this.vocab.set(i.content,i.id),this.idToTok.set(i.id,i.content),i.special&&this.specialIds.add(i.id);if(this.added.length){let i=this.added.map(o=>o.content.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).sort((o,u)=>u.length-o.length);this.addedRe=new RegExp(`(${i.join("|")})`,"g")}let n=d.findSplitPattern(r.pre_tokenizer)??It;this.splitRe=new RegExp(n,"gu");let a=i=>{if(!i)return null;if(i.type==="TemplateProcessing")return i.single;if(i.type==="Sequence")for(let o of i.processors??[]){let u=a(o);if(u)return u}return null},s=a(r.post_processor);if(Array.isArray(s))for(let i of s)if(i.SpecialToken){let o=this.vocab.get(i.SpecialToken.id);o!==void 0&&this.bosIds.push(o)}else break}static findSplitPattern(e){if(!e)return null;if(e.type==="Split"&&e.pattern?.Regex)return e.pattern.Regex;if(e.type==="ByteLevel"&&e.use_regex!==!1)return It;if(e.type==="Sequence")for(let r of e.pretokenizers??[]){let t=d.findSplitPattern(r);if(t)return t}return null}bpe(e){let r=this.cache.get(e);if(r)return r;let t=Array.from(e);for(;t.length>1;){let a=-1,s=1/0;for(let i=0;i<t.length-1;i++){let o=this.ranks.get(`${t[i]} ${t[i+1]}`);o!==void 0&&o<s&&(s=o,a=i)}if(a<0)break;t=[...t.slice(0,a),t[a]+t[a+1],...t.slice(a+2)]}let n=[];for(let a of t){let s=this.vocab.get(a);if(s!==void 0)n.push(s);else for(let i of a){let o=this.vocab.get(i);o!==void 0&&n.push(o)}}return this.cache.set(e,n),n}encodeChunk(e){let r=[];for(let t of e.match(this.splitRe)??[]){let n=new TextEncoder().encode(t),a="";for(let s of n)a+=this.byteEnc[s];r.push(...this.bpe(a))}return r}encode(e){let r=[...this.bosIds];if(this.addedRe)for(let t of e.split(this.addedRe)){if(!t)continue;let n=this.vocab.get(t);n!==void 0&&this.added.some(a=>a.content===t)?r.push(n):r.push(...this.encodeChunk(t))}else r.push(...this.encodeChunk(e));return r}decode(e){let r=[];for(let t of e){if(this.specialIds.has(t))continue;let n=this.idToTok.get(t);if(n!==void 0)for(let a of n){let s=this.byteDec.get(a);if(s!==void 0)r.push(s);else for(let i of new TextEncoder().encode(a))r.push(i)}}return new TextDecoder("utf-8",{fatal:!1}).decode(new Uint8Array(r))}};var Fr="https://esm.sh/@huggingface/transformers@4.2.0",Jt={"lfm2.5-230m":"https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik"},qr={F16:"f16",F32:"f32",Q4W:"q4",Q8W:"q8",Q3W:"q3"},Sr=12,Or=`
Answer briefly and honestly. If you do not know something, say so \u2014 never invent facts or details.
You have no tools and no internet access: never emit tool calls, reply in plain text only.`;async function Dr(d,e){let r=new He;if(!await r.init())throw new Error("WebGPU indisponible sur ce navigateur.");r.onLost=g=>{console.warn("[brimkern] device GPU perdu ("+(g?.reason||"unknown")+") \u2014 rechargement au prochain appel"),Ue.delete(d)},await r.selfValidate(),e("t\xE9l\xE9chargement du mod\xE8le\u2026");let t=await Et(d),n=t.manifest;if(!n?.config?.lfm2){let g=n?.arch??n?.config?.arch??"unknown";throw new Error(`Brimkern SDK v0 runs LFM2 .brik models only \u2014 this file's architecture is "${g}". Use the default model (omit \`model\`), or convert/pick an LFM2 .brik. Full model support lives in the app: https://brimkern.com/chat`)}let a=n.tensors["token_embd.weight"],s={arch:{...n.config,arch:"lfm2",vocab:a?a.nElems/n.config.d:0},tensors:Object.fromEntries(Object.entries(n.tensors).map(([g,h])=>[g,{dtype:qr[h.type]??h.type,shape:h.shape,nElems:h.nElems,shard:0,offset:h.offset,byteLength:h.bytes}])),shards:[{id:0,file:"",byteLength:0}],chat:{template:"chatml",stopTokenIds:[7,2,8,10,12]}},i=Object.values(n.tensors).reduce((g,h)=>g+h.bytes,0),o=0,u=Mt(n.tensors,t.source),c=async g=>{let h=n.tensors[g];if(!h)throw new Error(`tenseur absent : ${g}`);let m=await u(g);return o+=h.bytes,e("t\xE9l\xE9chargement du mod\xE8le\u2026",{loaded:o,total:i}),m};e("tokenizer\u2026");let l;try{let g=new je(t.tokenizer.json);l={encode:h=>g.encode(h),decode:h=>g.decode(h)}}catch(g){console.warn("[brimkern] tokenizer.json non couvert par le BPE bundl\xE9 \u2014 repli transformers.js (CDN)",g);let h=await import(Fr),m=new h.PreTrainedTokenizer(JSON.parse(t.tokenizer.json),JSON.parse(t.tokenizer.config));l={encode:v=>Array.from(m(v).input_ids.data,y=>Number(y)),decode:v=>m.decode(v,{skip_special_tokens:!0})}}let f=new Ke(r,s,c);return e("poids sur le GPU\u2026"),await f.load(l),{core:f,engine:r}}var Ue=new Map;function Ne(d){return d&&(d.startsWith("https://")||/^http:\/\/(localhost|127\.0\.0\.1)[:/]/.test(d))?d:Jt[d||"lfm2.5-230m"]||Jt["lfm2.5-230m"]}function Ee(d,e){let r=Ue.get(d);if(!r){let t={status:"initialisation\u2026",state:"loading",listeners:new Set,promise:null};t.promise=Dr(d,(n,a)=>{t.status=n,t.progress=a,t.listeners.forEach(s=>s(n,a))}).then(n=>(t.state="ready",n)).catch(n=>{throw t.state="error",Ue.delete(d),n}),Ue.set(d,t),r=t}return e&&(e(r.status,r.progress),r.listeners.add(e),r.promise.finally(()=>r.listeners.delete(e)).catch(()=>{})),r.promise}async function nt(d,e){let r=await Ee(d,e);return r.engine.lost?(Ue.delete(d),(await Ee(d,e)).core):r.core}async function Zt(d,e){let r=await nt(d);try{return await e(r)}catch(t){let n=Ue.get(d);if(!(!n||await n.promise.then(s=>s.engine.lost).catch(()=>!0)))throw t;return console.warn("[brimkern] g\xE9n\xE9ration interrompue par une perte de device \u2014 nouvelle tentative"),Ue.delete(d),e(await nt(d))}}function Mr(d,e){let r=d.replace(/<\|[a-z_]+\|>/g,"");if(e){let t=r.replace(/^\s*(hello|hi|hey|bonjour|salut)\s*[!,.]\s*/i,"");t.trim()&&(r=t)}return r.trimEnd()}async function er(d,e,r,t,n,a,s,i=[]){let o=Nt([...i,...e.slice(-Sr)],"lfm2",r),u=i.some(f=>f.role==="assistant")||e.some(f=>f.role==="assistant"),c="";return await(d.residentAvailable?.()?d.generateResident.bind(d):d.generate.bind(d))(o,t,f=>{c=Mr(f,u),a?.(c)},s,{sample:!0,temperature:n,topK:40,repeatPenalty:1.3}),c}function tr(d){let e=(d.system||"You are a helpful assistant.")+Or,r=s=>s.flatMap(i=>[{role:"user",content:i.user},{role:"assistant",content:i.assistant}]);if(!d.knowledge)return{system:()=>e,userTurn:s=>s,pinned:r(d.examples||[])};let t=Qt($t(d.knowledge)),n=d.knowledgeBudget??1200,a=e+`

The user message may include reference notes between --- markers. When it does, answer from those notes and quote their figures exactly. When it says no note matches, say you do not have that information.`;return{system:()=>a,userTurn:s=>Yt(Vt(s,t,n)).trim()+`

Question: ${s}`,pinned:r([...Tr(),...d.examples||[]])}}function Tr(){return[{user:`--- NOTES ---
[1] Opening hours
The workshop is open on Thursday until 8pm.
--- END OF NOTES ---

Question: Are you open on Thursday evening?`,assistant:"Yes \u2014 the workshop is open on Thursday until 8pm."},{user:`No reference note matches this question.

Question: Who won the 1998 World Cup?`,assistant:"I do not have that information in my notes."}]}function rr(d={}){let e=Ne(d.model),r=d.maxTokens||220,t=d.temperature??.55,n=tr(d),a=n.pinned,s=[],i=!1,o=!1;return{async ask(u,c={}){if(o)throw new Error("session d\xE9truite");if(i)throw new Error("g\xE9n\xE9ration d\xE9j\xE0 en cours sur cette session");i=!0,s.push({role:"user",content:u});try{let l=[...s.slice(0,-1),{role:"user",content:n.userTurn(u)}],f=await Zt(e,g=>er(g,l,n.system(u),r,t,c.onToken,()=>!!c.signal?.aborted,a));return c.signal?.aborted?(s.pop(),""):(s.push({role:"assistant",content:f}),f)}catch(l){throw s.pop(),l}finally{i=!1}},reset(){s=[]},destroy(){o=!0,s=[]},get history(){return s.slice()}}}function Cr(d){if(document.getElementById("bk-style"))return;let e=document.createElement("style");e.id="bk-style",e.textContent=`
  .bk-fab{position:fixed;right:20px;bottom:20px;width:56px;height:56px;border-radius:16px;background:${d};color:#fff;border:none;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.25);font-size:24px;z-index:2147483000;display:flex;align-items:center;justify-content:center;transition:transform .15s}
  .bk-fab:hover{transform:translateY(-2px)}
  .bk-panel{position:fixed;right:20px;bottom:88px;width:360px;max-width:calc(100vw - 40px);height:520px;max-height:calc(100vh - 120px);background:#f2efe8;border:1px solid #e0dccf;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.28);z-index:2147483000;display:none;flex-direction:column;overflow:hidden;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;color:#1a1a1a}
  .bk-panel.bk-open{display:flex}
  .bk-hd{padding:12px 14px;background:#fff;border-bottom:1px solid #ece8dd;display:flex;align-items:center;gap:8px;font-weight:700;font-size:14px}
  .bk-hd .bk-dot{width:8px;height:8px;border-radius:50%;background:${d}}
  .bk-hd .bk-x{margin-left:auto;background:none;border:none;cursor:pointer;color:#8b887f;font-size:18px;line-height:1}
  .bk-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px}
  .bk-m{max-width:82%;padding:8px 12px;border-radius:12px;font-size:14px;line-height:1.45;white-space:pre-wrap;word-wrap:break-word}
  .bk-m.bk-u{align-self:flex-end;background:${d};color:#fff;border-bottom-right-radius:4px}
  .bk-m.bk-a{align-self:flex-start;background:#fff;border:1px solid #ece8dd;border-bottom-left-radius:4px}
  .bk-foot{padding:10px;border-top:1px solid #ece8dd;background:#fff;display:flex;gap:8px}
  .bk-in{flex:1;border:1px solid #e0dccf;border-radius:10px;padding:9px 11px;font-size:14px;font-family:inherit;background:#fff;color:#1a1a1a;resize:none;outline:none}
  .bk-in:focus{border-color:${d}}
  .bk-send{background:${d};color:#fff;border:none;border-radius:10px;padding:0 14px;cursor:pointer;font-size:14px}
  .bk-send:disabled{opacity:.5;cursor:default}
  .bk-note{font-size:10.5px;color:#8b887f;text-align:center;padding:4px 8px 8px}
  `,document.head.appendChild(e)}function Rr(d){if(!d)return"#c72c1e";if(/^#[0-9a-fA-F]{3,8}$/.test(d))return d;try{if(typeof CSS<"u"&&CSS.supports("color",d)&&!/[{};()]/.test(d))return d}catch{}return"#c72c1e"}function Xt(d){let e=tr(d),r=Rr(d.accent),t=d.title||"Assistant",n=d.maxTokens||220;Cr(r);let a=document.createElement("button");a.className="bk-fab",a.setAttribute("aria-label","Ouvrir le chat"),a.textContent="\u{1F4AC}";let s=document.createElement("div");s.className="bk-panel",s.innerHTML=`
    <div class="bk-hd"><span class="bk-dot"></span><span>${Lr(t)}</span><button class="bk-x" aria-label="Fermer">\xD7</button></div>
    <div class="bk-msgs"></div>
    <div class="bk-foot"><textarea class="bk-in" rows="1" placeholder="\xC9cris un message\u2026"></textarea><button class="bk-send">\u2191</button></div>
    <div class="bk-note">IA locale \u2014 tourne sur votre GPU, aucune donn\xE9e envoy\xE9e.</div>`,document.body.appendChild(a),document.body.appendChild(s);let i=s.querySelector(".bk-msgs"),o=s.querySelector(".bk-in"),u=s.querySelector(".bk-send"),c=[],l=!1,f=!1,g=(y,P)=>{let D=document.createElement("div");return D.className=`bk-m ${y==="user"?"bk-u":"bk-a"}`,D.textContent=P,i.appendChild(D),i.scrollTop=i.scrollHeight,D};d.greeting&&(c.push({role:"assistant",content:d.greeting}),g("assistant",d.greeting));let h=Ne(d.model),m=()=>{if(!f){f=!0;let y=g("assistant","Initialisation\u2026");y.classList.add("bk-status"),Ee(h,(P,D)=>{y.textContent=D?.total?`${P} ${Math.round(D.loaded/1048576)} / ${Math.round(D.total/1048576)} Mo`:P}).then(()=>y.remove()).catch(P=>{y.textContent="Erreur : "+(P?.message||P),f=!1})}return nt(h)},v=async()=>{let y=o.value.trim();if(!y||l)return;l=!0,u.disabled=!0,o.value="",c.push({role:"user",content:y}),g("user",y);let P=g("assistant","\u2026");try{await m();let D=[...c.slice(0,-1),{role:"user",content:e.userTurn(y)}],q=await Zt(h,T=>er(T,D,e.system(y),n,.55,z=>{P.textContent=z||"\u2026",i.scrollTop=i.scrollHeight},void 0,e.pinned));q||(q="Sorry, I can only answer in plain text here \u2014 could you rephrase?"),P.textContent=q,c.push({role:"assistant",content:q})}catch(D){P.textContent="Erreur : "+(D?.message||String(D))}finally{l=!1,u.disabled=!1,o.focus()}};a.onclick=()=>{s.classList.toggle("bk-open")&&(o.focus(),m())},s.querySelector(".bk-x").onclick=()=>s.classList.remove("bk-open"),u.onclick=()=>{v()},o.onkeydown=y=>{y.key==="Enter"&&!y.shiftKey&&(y.preventDefault(),v())}}function Lr(d){return d.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}var zr=(d={})=>{if(typeof window>"u"||typeof document>"u"){console.warn("[brimkern] embed() ignor\xE9 : aucun DOM (rendu serveur ?). Appelez-le dans un effet client.");return}document.body?Xt(d):window.addEventListener("DOMContentLoaded",()=>Xt(d))};var Hr=async d=>{if(typeof d!="object"||d===null||typeof d.prompt!="string")throw new TypeError(`Brimkern.generate expects a single object: generate({ prompt: "\u2026", model?, system? }). Received ${typeof d}${typeof d=="object"&&d?" without a `prompt` string":""}.`);return rr(d).ask(d.prompt,{onToken:d.onToken,signal:d.signal})},Kr=(d={})=>typeof navigator<"u"&&"gpu"in navigator?Ee(Ne(d.model),d.onProgress).then(()=>!0).catch(()=>!1):Promise.resolve(!1),jr=d=>{if(typeof navigator>"u"||!("gpu"in navigator))return"unavailable";let e=Ue.get(Ne(d));return e?e.state:"idle"};typeof window<"u"&&(window.Brimkern={embed:zr,createSession:rr,generate:Hr,preload:Kr,status:jr});})();
