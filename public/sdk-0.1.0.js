"use strict";(()=>{var Yr=Object.defineProperty;var te=(f,e,r)=>()=>{if(r)throw r[0];try{return f&&(e=f(f=0)),e}catch(t){throw r=[t],t}};var Qt=(f,e)=>{for(var r in e)Yr(f,r,{get:e[r],enumerable:!0})};function Pe(f){let e=new Float32Array(1),r=new Uint32Array(e.buffer);e[0]=f;let t=r[0],n=t>>16&32768,s=(t>>23&255)-127+15,a=t&8388607;return s<=0?n:s>=31?n|31743:(a=(a>>13)+(a>>12&1),a===1024&&(a=0,s+=1),n|s<<10|a&1023)}function ce(f){let e=f>>15&1,r=f>>10&31,t=f&1023,n;return r===0?n=t*59604645e-15:r===31?n=t?NaN:1/0:n=(1+t/1024)*2**(r-15),e===1?-n:n}var De=te(()=>{"use strict"});function Te(f){let e=f.length;if(e%me!==0)throw new Error(`q4web: length ${e} not a multiple of ${me}`);let r=e/me,t=new Uint8Array(e/2),n=new Uint16Array(r),s=new Uint16Array(r);for(let a=0;a<r;a++){let i=a*me,o=1/0,u=-1/0;for(let h=0;h<me;h++){let b=f[i+h];b<o&&(o=b),b>u&&(u=b)}let c=(u-o)/15||1e-8,l=Pe(c),d=Pe(o);n[a]=l,s[a]=d;let g=ce(l)||1e-8,p=ce(d);for(let h=0;h<me;h++){let b=Math.round((f[i+h]-p)/g);b=b<0?0:b>15?15:b;let k=i+h;(h&1)===0?t[k>>1]=b:t[k>>1]|=b<<4}}return{nibbles:t,scales:n,mins:s,nElems:e}}function Ue(f,e){let r=e/me,t=e/2,n=f.slice(0,t),s=new Uint16Array(r),a=new Uint16Array(r),i=new DataView(f.buffer,f.byteOffset);for(let o=0;o<r;o++)s[o]=i.getUint16(t+o*2,!0);for(let o=0;o<r;o++)a[o]=i.getUint16(t+r*2+o*2,!0);return{nibbles:n,scales:s,mins:a,nElems:e}}function ge(f){let e=new Float32Array(f.nElems),r=f.nElems/me;for(let t=0;t<r;t++){let n=ce(f.scales[t]),s=ce(f.mins[t]),a=t*me;for(let i=0;i<me;i++){let o=a+i,u=f.nibbles[o>>1],c=(i&1)===0?u&15:u>>4;e[o]=c*n+s}}return e}var me,at=te(()=>{"use strict";De();me=32});function Ce(f){let e=f.length;if(e%be!==0)throw new Error(`q8web: length ${e} not a multiple of ${be}`);let r=e/be,t=new Int8Array(e),n=new Uint16Array(r);for(let s=0;s<r;s++){let a=s*be,i=0;for(let l=0;l<be;l++){let d=Math.abs(f[a+l]);d>i&&(i=d)}let o=i/127||1e-8,u=Pe(o);n[s]=u;let c=ce(u)||1e-8;for(let l=0;l<be;l++){let d=Math.round(f[a+l]/c);d=d<-127?-127:d>127?127:d,t[a+l]=d}}return{codes:t,scales:n,nElems:e}}function xe(f,e){let r=e/be,t=new Int8Array(f.buffer.slice(f.byteOffset,f.byteOffset+e)),n=new Uint16Array(r),s=new DataView(f.buffer,f.byteOffset);for(let a=0;a<r;a++)n[a]=s.getUint16(e+a*2,!0);return{codes:t,scales:n,nElems:e}}function ve(f){let e=new Float32Array(f.nElems),r=f.nElems/be;for(let t=0;t<r;t++){let n=ce(f.scales[t]),s=t*be;for(let a=0;a<be;a++)e[s+a]=f.codes[s+a]*n}return e}var be,ot=te(()=>{"use strict";De();be=32});function Xt(f){let e=f.length;if(e%we!==0)throw new Error(`q3web: length ${e} not a multiple of ${we}`);let r=e/we,t=new Uint32Array(e/16),n=new Uint32Array(e/32),s=new Uint16Array(r),a=new Uint16Array(r);for(let i=0;i<r;i++){let o=i*we,u=1/0,c=-1/0;for(let b=0;b<we;b++){let k=f[o+b];k<u&&(u=k),k>c&&(c=k)}let l=(c-u)/7||1e-8,d=Pe(l),g=Pe(u);s[i]=d,a[i]=g;let p=ce(d)||1e-8,h=ce(g);for(let b=0;b<we;b++){let k=Math.round((f[o+b]-h)/p);k=k<0?0:k>7?7:k;let B=o+b;t[B>>4]|=(k&3)<<(B&15)*2,n[B>>5]|=k>>2<<(B&31)}}return{lo:t,hi:n,scales:s,mins:a,nElems:e}}function ut(f,e){let r=e/we,t=e/16,n=e/32,s=t*4,a=n*4,i=new DataView(f.buffer,f.byteOffset),o=new Uint32Array(t),u=new Uint32Array(n),c=new Uint16Array(r),l=new Uint16Array(r);for(let p=0;p<t;p++)o[p]=i.getUint32(p*4,!0);for(let p=0;p<n;p++)u[p]=i.getUint32(s+p*4,!0);let d=s+a,g=d+r*2;for(let p=0;p<r;p++)c[p]=i.getUint16(d+p*2,!0);for(let p=0;p<r;p++)l[p]=i.getUint16(g+p*2,!0);return{lo:o,hi:u,scales:c,mins:l,nElems:e}}function We(f){let e=new Float32Array(f.nElems),r=f.nElems/we;for(let t=0;t<r;t++){let n=ce(f.scales[t]),s=ce(f.mins[t]),a=t*we;for(let i=0;i<we;i++){let o=a+i,u=f.lo[o>>4]>>(o&15)*2&3|(f.hi[o>>5]>>(o&31)&1)<<2;e[o]=u*n+s}}return e}var we,Zt=te(()=>{"use strict";De();we=32});var er,tr,rr=te(()=>{"use strict";er={matmul:`
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
		}`,rmsnorm_vec:`
		struct P { rows: u32, dim: u32, eps: f32, onePlus: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> x: array<f32>;
		@group(0) @binding(2) var<storage, read> w: array<f32>;
		@group(0) @binding(3) var<storage, read_write> o: array<f32>;
		var<workgroup> part: array<f32, 256>;
		@compute @workgroup_size(256)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let r = wid.x;
			let tid = lid.x;
			let base = r * p.dim;
			var ss = 0.0;
			// (r < p.rows) est UNIFORME dans le workgroup (r vient de workgroup_id) : les barri\xE8res
			// restent en flux uniforme m\xEAme quand le dernier workgroup d\xE9passe le nombre de lignes.
			if (r < p.rows) {
				for (var i = tid; i < p.dim; i = i + 256u) { let v = x[base + i]; ss = ss + v * v; }
			}
			part[tid] = ss;
			workgroupBarrier();
			for (var stride = 128u; stride > 0u; stride = stride >> 1u) {
				if (tid < stride) { part[tid] = part[tid] + part[tid + stride]; }
				workgroupBarrier();
			}
			if (r >= p.rows) { return; }
			let inv = 1.0 / sqrt(part[0] / f32(p.dim) + p.eps);
			for (var i = tid; i < p.dim; i = i + 256u) {
				// Gemma scales by (1 + w) instead of w; onePlus selects the convention.
				let g = select(w[i], 1.0 + w[i], p.onePlus == 1u);
				o[base + i] = x[base + i] * inv * g;
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
		}`,top_k_par:`
		struct P { n: u32, k: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> logits: array<f32>;
		@group(0) @binding(2) var<storage, read_write> outv: array<u32>;
		var<workgroup> candV: array<f32, 1024>;
		var<workgroup> candI: array<u32, 1024>;
		var<workgroup> redV: array<f32, 128>;
		var<workgroup> redI: array<u32, 128>;
		@compute @workgroup_size(128)
		fn main(@builtin(local_invocation_id) lid: vec3<u32>) {
			let t = lid.x;
			// \u2500\u2500 Phase 1 : identique \xE0 top_k \u2014 chaque thread garde ses 8 meilleurs sur sa tranche. \u2500\u2500
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
			// \u2500\u2500 Phase 2 : K passes, le maximum trouv\xE9 PAR R\xC9DUCTION au lieu d'un balayage solitaire. \u2500\u2500
			for (var r = 0u; r < p.k; r = r + 1u) {
				var bv = -3.4e38;
				var bi = 0u;
				// Chaque thread balaie 8 candidats (foul\xE9e 128), indices CROISSANTS : \xE0 valeur \xE9gale
				// il garde le plus petit, comme le fait le balayage s\xE9quentiel.
				for (var c = t; c < 1024u; c = c + 128u) {
					if (candV[c] > bv) { bv = candV[c]; bi = c; }
				}
				redV[t] = bv; redI[t] = bi;
				workgroupBarrier();
				for (var s = 64u; s > 0u; s = s >> 1u) {
					if (t < s) {
						let o = t + s;
						if (redV[o] > redV[t] || (redV[o] == redV[t] && redI[o] < redI[t])) { redV[t] = redV[o]; redI[t] = redI[o]; }
					}
					workgroupBarrier();
				}
				if (t == 0u) {
					let best = redI[0];
					outv[r] = candI[best];
					outv[p.k + r] = bitcast<u32>(redV[0]);
					candV[best] = -3.4e38;   // retir\xE9 des candidats pour la passe suivante
				}
				workgroupBarrier();          // l'\xE9criture ci-dessus doit \xEAtre vue par tous avant la suite
			}
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
		}`},tr=`
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
	}`});var Qe,nr=te(()=>{"use strict";Qe=class{constructor(e){this.sets=[];this.cur=0;this.next=0;this.names=[];this.acc=new Map;this.dropped=0;this.pending=[];this.fenetre=0;this.device=e;let r=globalThis;for(let t=0;t<2;t++)this.sets.push({qs:e.createQuerySet({type:"timestamp",count:4096}),resolve:e.createBuffer({size:4096*8,usage:r.GPUBufferUsage.QUERY_RESOLVE|r.GPUBufferUsage.COPY_SRC}),read:e.createBuffer({size:4096*8,usage:r.GPUBufferUsage.COPY_DST|r.GPUBufferUsage.MAP_READ}),busy:!1})}slot(e){if(this.next+2>4096&&(this.rotate(),this.next+2>4096))return this.dropped++,null;let r=this.sets[this.cur];if(r.busy)return this.dropped++,null;let t=this.next;return this.next+=2,this.names.push(e),{querySet:r.qs,beginningOfPassWriteIndex:t,endOfPassWriteIndex:t+1}}rotate(){let e=this.cur,r=this.sets[e],t=this.names,n=this.next;if(this.cur=(this.cur+1)%2,this.next=0,this.names=[],!n||r.busy)return;r.busy=!0;let s=this.fenetre,a=this.device.createCommandEncoder();a.resolveQuerySet(r.qs,0,n,r.resolve,0),a.copyBufferToBuffer(r.resolve,0,r.read,0,n*8),this.device.queue.submit([a.finish()]);let i=globalThis,o=r.read.mapAsync(i.GPUMapMode.READ,0,n*8).then(()=>{let u=new BigUint64Array(r.read.getMappedRange(0,n*8).slice(0));if(r.read.unmap(),s===this.fenetre)for(let c=0;c<t.length;c++){let l=u[c*2],d=u[c*2+1];if(!l||!d||d<=l)continue;let g=Number(d-l),p=this.acc.get(t[c]);p?(p.calls++,p.ns+=g):this.acc.set(t[c],{calls:1,ns:g})}}).catch(()=>{}).finally(()=>{r.busy=!1});this.pending.push(o)}async report(){this.rotate();let e=this.pending;this.pending=[],await Promise.all(e);let r=0,t=0;for(let s of this.acc.values())r+=s.ns,t+=s.calls;return{passes:[...this.acc.entries()].map(([s,a])=>({name:s,calls:a.calls,totalMs:a.ns/1e6,meanUs:a.ns/a.calls/1e3,share:r?a.ns/r:0,reliable:a.calls>=50})).sort((s,a)=>a.totalMs-s.totalMs),totalMs:r/1e6,samples:t,dropped:this.dropped,quantumUs:100}}reset(){this.fenetre++,this.acc.clear(),this.dropped=0}destroy(){for(let e of this.sets)try{e.qs.destroy(),e.resolve.destroy(),e.read.destroy()}catch{}this.sets=[]}}});function en(){if(sr!==null)return sr;try{let f=globalThis.__brimkernSearch;if(typeof f=="string")return f}catch{}try{return typeof location<"u"?location.search:""}catch{return""}}function ae(f){try{return new URLSearchParams(en()).get(f)}catch{return null}}var sr,ir=te(()=>{"use strict";sr=null});function pe(f){let e=f>>15&1,r=f>>10&31,t=f&1023,n;return r===0?n=t*59604645e-15:r===31?n=65504:n=(1+t/1024)*2**(r-15),e===1?-n:n}function Fe(f){let e=new Float32Array(1),r=new Uint32Array(e.buffer);e[0]=f;let t=r[0],n=t>>16&32768,s=(t>>23&255)-127+15,a=t&8388607;return s<=0?n:s>=31?n|31743:(a=(a>>13)+(a>>12&1),a===1024&&(a=0,s+=1),n|s<<10|a&1023)}function tn(f,e){let r=new Float32Array(e*256),t=new DataView(f.buffer,f.byteOffset);for(let n=0;n<e;n++){let s=n*144,a=pe(t.getUint16(s,!0)),i=pe(t.getUint16(s+2,!0)),o=d=>{let g=p=>f[s+4+p];return d<4?[g(d)&63,g(d+4)&63]:[g(d+4)&15|g(d-4)>>6<<4,g(d+4)>>4|g(d)>>6<<4]},u=n*256,c=0,l=0;for(let d=0;d<256;d+=64){let[g,p]=o(c),h=a*g,b=i*p,[k,B]=o(c+1),M=a*k,F=i*B;for(let C=0;C<32;C++){let j=f[s+16+l+C];r[u+d+C]=h*(j&15)-b,r[u+d+32+C]=M*(j>>4)-F}l+=32,c+=2}}return r}function Re(f){return f>127?f-256:f}function rn(f,e){let r=new Float32Array(e*32),t=new DataView(f.buffer,f.byteOffset);for(let n=0;n<e;n++){let s=n*34,a=pe(t.getUint16(s,!0));for(let i=0;i<32;i++)r[n*32+i]=a*Re(f[s+2+i])}return r}function nn(f,e){let r=new Float32Array(e*32),t=new DataView(f.buffer,f.byteOffset);for(let n=0;n<e;n++){let s=n*22,a=pe(t.getUint16(s,!0)),i=t.getUint32(s+2,!0);for(let o=0;o<16;o++){let u=f[s+6+o],c=i>>>o<<4&16,l=i>>>o+12&16;r[n*32+o]=a*((u&15|c)-16),r[n*32+o+16]=a*((u>>4|l)-16)}}return r}function sn(f,e){let r=new Float32Array(e*32),t=new DataView(f.buffer,f.byteOffset);for(let n=0;n<e;n++){let s=n*18,a=pe(t.getUint16(s,!0));for(let i=0;i<16;i++){let o=f[s+2+i];r[n*32+i]=a*((o&15)-8),r[n*32+i+16]=a*((o>>4)-8)}}return r}function an(f,e){let r=new Float32Array(e*256),t=new DataView(f.buffer,f.byteOffset);for(let n=0;n<e;n++){let s=n*176,a=pe(t.getUint16(s,!0)),i=pe(t.getUint16(s+2,!0)),o=p=>{let h=b=>f[s+4+b];return p<4?[h(p)&63,h(p+4)&63]:[h(p+4)&15|h(p-4)>>6<<4,h(p+4)>>4|h(p)>>6<<4]},u=n*256,c=0,l=0,d=1,g=2;for(let p=0;p<256;p+=64){let[h,b]=o(c),k=a*h,B=i*b,[M,F]=o(c+1),C=a*M,j=i*F;for(let A=0;A<32;A++){let v=f[s+48+l+A],m=f[s+16+A];r[u+p+A]=k*((v&15)+(m&d?16:0))-B,r[u+p+32+A]=C*((v>>4)+(m&g?16:0))-j}l+=32,c+=2,d<<=2,g<<=2}}return r}function on(f,e){let r=new Float32Array(e*256),t=new DataView(f.buffer,f.byteOffset);for(let n=0;n<e;n++){let s=n*210,a=pe(t.getUint16(s+208,!0)),i=n*256;for(let o=0;o<2;o++){let u=s+o*64,c=s+128+o*32,l=s+192+o*8,d=i+o*128;for(let g=0;g<32;g++){let p=g/16|0,h=f[u+g],b=f[u+g+32],k=f[c+g],B=(h&15|(k>>0&3)<<4)-32,M=(b&15|(k>>2&3)<<4)-32,F=(h>>4|(k>>4&3)<<4)-32,C=(b>>4|(k>>6&3)<<4)-32;r[d+g]=a*Re(f[l+p])*B,r[d+g+32]=a*Re(f[l+p+2])*M,r[d+g+64]=a*Re(f[l+p+4])*F,r[d+g+96]=a*Re(f[l+p+6])*C}}}return r}function qe(f,e,r,t,n){let s=new Float32Array(r*n);for(let a=0;a<r;a++)for(let i=0;i<n;i++){let o=0;for(let u=0;u<t;u++)o+=f[a*t+u]*e[u*n+i];s[a*n+i]=o}return s}function Ge(f,e,r,t,n=1e-5,s=!1){let a=new Float32Array(r*t);for(let i=0;i<r;i++){let o=0;for(let c=0;c<t;c++)o+=f[i*t+c]**2;let u=1/Math.sqrt(o/t+n);for(let c=0;c<t;c++)a[i*t+c]=f[i*t+c]*u*(s?1+e[c]:e[c])}return a}function un(f,e,r,t,n,s,a){let i=new Float32Array(f.length),o=t/2,u=s[0],c=s[0]+s[1];for(let l=0;l<r;l++){let d=Math.floor(l/n),g=l*t;for(let p=0;p<o;p++){let h=p<u?0:p<c?1:2,k=e[d*3+h]/a**(2*p/t),B=Math.cos(k),M=Math.sin(k),F=f[g+p],C=f[g+p+o];i[g+p]=F*B-C*M,i[g+p+o]=C*B+F*M}}return i}function Ve(f,e,r,t,n=0,s=1e4,a){let i=new Float32Array(f.length),o=r/2;for(let u=0;u<e;u++){let c=n+Math.floor(u/t),l=u*r;for(let d=0;d<o;d++){let g=c/(s**(2*d/r)*(a?a[d]:1)),p=Math.cos(g),h=Math.sin(g),b=f[l+2*d],k=f[l+2*d+1];i[l+2*d]=b*p-k*h,i[l+2*d+1]=k*p+b*h}}return i}function cn(f,e,r,t,n,s=0,a=1e4){let i=new Float32Array(f.length),o=t/2;for(let u=0;u<r;u++){let c=s+Math.floor(u/n),l=u*t;for(let d=0;d<o;d++){let g=c/(a**(2*d/t)*e[d]),p=Math.cos(g),h=Math.sin(g),b=f[l+d],k=f[l+d+o];i[l+d]=b*p-k*h,i[l+d+o]=k*p+b*h}}return i}function Le(f,e,r,t,n=0,s=1e4){let a=new Float32Array(f.length),i=r/2;for(let o=0;o<e;o++){let u=n+Math.floor(o/t),c=o*r;for(let l=0;l<i;l++){let d=u/s**(2*l/r),g=Math.cos(d),p=Math.sin(d),h=f[c+l],b=f[c+l+i];a[c+l]=h*g-b*p,a[c+l+i]=b*g+h*p}}return a}function ct(f,e,r){return f.map((t,n)=>t+e[n%r])}function lt(f,e,r,t=!0){let n=t?f.windowPerLayer?.[r]??f.window??0:0,s=f.ropeThetaPerLayer?.[r]??f.ropeTheta,a=f.skipRopePerLayer?.[r]??f.skipRope??!1;return{...f,seq:e,window:n,ropeTheta:s,skipRope:a}}function ye(f,e,r,t,n,s,a,i=0,o,u=0,c=0){let l=new Float32Array(t*n*a),d=o??1/Math.sqrt(a),g=h=>u>0?u*Math.tanh(h/u):h,p=n/s;for(let h=0;h<t;h++)for(let b=0;b<n;b++){let k=Math.floor(b/p),B=(h*n+b)*a,M=i+h,F=c>0?Math.max(0,M+1-c):0,C=[],j=-1/0;for(let v=F;v<=M;v++){let m=(v*s+k)*a,y=0;for(let w=0;w<a;w++)y+=f[B+w]*e[m+w];let _=g(y*d);C[v]=_,_>j&&(j=_)}let A=0;for(let v=F;v<=M;v++)C[v]=Math.exp(C[v]-j),A+=C[v];for(let v=F;v<=M;v++){let m=C[v]/A,y=(v*s+k)*a;for(let _=0;_<a;_++)l[B+_]+=m*r[y+_]}}return l}function ar(f){return .5*f*(1+Math.tanh(.7978845608*(f+.044715*f*f*f)))}function ft(f,e,r){let{seq:t,d:n,nHeads:s,nKvHeads:a,headDim:i,ffn:o,ropeTheta:u,eps:c}=e,l=a*i,d=s*i,g=e.rmsGainOnePlus===!0,p=e.attnLogitSoftcap??0,h=Ge(f,r.attnNorm,t,n,c,g),b=qe(h,r.wq,t,n,d),k=qe(h,r.wk,t,n,l),B=qe(h,r.wv,t,n,l);r.bq&&(b=ct(b,r.bq,d)),r.bk&&(k=ct(k,r.bk,l)),r.bv&&(B=ct(B,r.bv,l)),r.qNorm&&(b=Ge(b,r.qNorm,t*s,i,c,g)),r.kNorm&&(k=Ge(k,r.kNorm,t*a,i,c,g));let M=Le(b,t*s,i,s,0,u),F=Le(k,t*a,i,a,0,u),C=ye(M,F,B,t,s,a,i,0,e.attnScale,p),j=qe(C,r.wo,t,d,n);r.postAttnNorm&&(j=Ge(j,r.postAttnNorm,t,n,c,g));let A=f.map((P,U)=>P+j[U]),v=Ge(A,r.ffnNorm,t,n,c,g),m=qe(v,r.wgate,t,n,o),y=qe(v,r.wup,t,n,o),_=e.act==="gelu"?m.map((P,U)=>ar(P)*y[U]):m.map((P,U)=>P/(1+Math.exp(-P))*y[U]),w=qe(_,r.wdown,t,o,n);return r.postFfnNorm&&(w=Ge(w,r.postFfnNorm,t,n,c,g)),A.map((P,U)=>P+w[U])}var ee,X,$e,or=te(()=>{"use strict";at();ot();Zt();rr();nr();ir();ee=64,X=class X{constructor(){this.device=null;this.modules={};this.pipelines={};this.maxStorageBufferBindingSize=0;this.hasF16=!1;this.validationFailure=null;this.lost=!1;this.onLost=null;this.attnDecodeOk=!0;this.attnFullWgOk=!0;this.mropeOk=!0;this.rwkvWkv7Ok=!0;this.lfm2ShortConvOk=!0;this.lfm2ResidentOk=!0;this.lfm2BatchOk=!0;this.swaOk=!0;this.rwkvResidentOk=!0;this.videoOk=!0;this.videoResidentOk=!0;this.f16SharedOk=!0;this.qSharedOk=!0;this.gemvOk=!0;this.rmsVecOk=!0;this.topKParOk=!0;this.profiler=null;this.bufferPool=new Map;this.poolSize=new WeakMap;this.pooled=new WeakSet;this.uniformPool=new Map;this.uniformSize=new WeakMap;this.convTiledOk=!0;this.kvGpu=new Map;this.topKOk=!0;this.kvSession="";this.kvQuant=!1;this.lfm2KvGpu=new Map;this.lfm2ConvGpu=new Map;this.lfm2Session="";this.rwkvStateGpu=new Map;this.rwkvVFirst=null;this.rwkvSession=""}async init(){let e=navigator.gpu;if(!e)return!1;let r=await e.requestAdapter();if(!r)return!1;let t=r.limits,n={maxStorageBufferBindingSize:t.maxStorageBufferBindingSize,maxBufferSize:t.maxBufferSize},s=[];try{r.features?.has("shader-f16")&&s.push("shader-f16")}catch{}try{X.profileOn&&r.features?.has("timestamp-query")&&s.push("timestamp-query")}catch{}try{this.device=await r.requestDevice({requiredLimits:n,requiredFeatures:s})}catch{try{this.device=await r.requestDevice({requiredLimits:n})}catch{this.device=await r.requestDevice()}}this.maxStorageBufferBindingSize=this.device.limits?.maxStorageBufferBindingSize??134217728,this.hasF16=!!this.device.features?.has?.("shader-f16"),X.profileOn&&(this.device.features?.has?.("timestamp-query")?(this.profiler=new Qe(this.device),console.info("[webgpu] profilage par passe ACTIF (?gpuprofile=1) \u2014 __gpuProfile() pour le rapport")):console.warn("[webgpu] ?gpuprofile=1 demand\xE9 mais la feature timestamp-query est ABSENTE de cet adapter \u2014 aucune mesure ne sera prise."));try{ae("attndecode")==="0"&&(this.attnDecodeOk=!1,console.warn("[webgpu] attention d\xE9codage COUP\xC9E par ?attndecode=0 \u2014 kernels classiques")),ae("attnfullwg")==="0"&&(this.attnFullWgOk=!1,console.warn("[webgpu] attention_full workgroup COUP\xC9E par ?attnfullwg=0 \u2014 kernel classique")),ae("rmsvec")==="0"&&(this.rmsVecOk=!1,console.warn("[webgpu] RMSNorm parall\xE8le COUP\xC9E par ?rmsvec=0 \u2014 kernel une-ligne-par-thread")),ae("topkpar")==="0"&&(this.topKParOk=!1,console.warn("[webgpu] top-K parall\xE8le COUP\xC9E par ?topkpar=0 \u2014 s\xE9lection finale sur un seul thread")),ae("rwkv")==="0"&&(this.rwkvWkv7Ok=!1,console.warn("[webgpu] kernel RWKV-7 WKV COUP\xC9 par ?rwkv=0")),ae("lfm2")==="0"&&(this.lfm2ShortConvOk=!1,console.warn("[webgpu] kernel shortconv LFM2 COUP\xC9 par ?lfm2=0")),ae("lfm2resident")==="0"&&(this.lfm2ResidentOk=!1,console.warn("[webgpu] LFM2 r\xE9sident COUP\xC9 par ?lfm2resident=0 \u2014 forwardToken JS+readback")),ae("lfm2batch")==="0"&&(this.lfm2BatchOk=!1,console.warn("[webgpu] prefill LFM2 batch\xE9 COUP\xC9 par ?lfm2batch=0 \u2014 token par token")),ae("swa")==="0"&&(this.swaOk=!1,console.warn("[webgpu] fen\xEAtre glissante COUP\xC9E par ?swa=0 \u2014 attention causale pleine sur toutes les couches")),ae("rwkvresident")==="0"&&(this.rwkvResidentOk=!1,console.warn("[webgpu] RWKV r\xE9sident COUP\xC9 par ?rwkvresident=0 \u2014 forwardToken JS+readback")),ae("video")==="0"&&(this.videoOk=!1,console.warn("[webgpu] chemin vid\xE9o (module motion) COUP\xC9 par ?video=0")),ae("f16shared")==="0"&&(this.f16SharedOk=!1,console.warn("[webgpu] GEMM f16 tuil\xE9 COUP\xC9 par ?f16shared=0 \u2014 matmul_t_f16w pour tous les m")),ae("gemv")==="0"&&(this.gemvOk=!1,console.warn("[webgpu] GEMV de d\xE9codage COUP\xC9 par ?gemv=0 \u2014 kernels par lignes")),ae("qshared")==="0"&&(this.qSharedOk=!1,console.warn("[webgpu] GEMM q8/q4 tuil\xE9s COUP\xC9S par ?qshared=0 \u2014 kernels 4 lignes/invocation")),ae("videoresident")==="0"&&(this.videoResidentOk=!1,console.warn("[webgpu] motion r\xE9sident COUP\xC9 par ?videoresident=0 \u2014 chemin JS+readback"))}catch{}this.device.lost?.then?.(a=>{this.lost=!0,console.warn("[webgpu] device GPU perdu :",a?.reason||"unknown",a?.message||""),this.onLost?.(a)});for(let[a,i]of Object.entries(er))this.modules[a]=this.device.createShaderModule({code:i});return this.hasF16&&(this.modules.matmul_t_f16w=this.device.createShaderModule({code:tr})),!0}buf(e,r){let t=this.device.createBuffer({size:e.byteLength,usage:r});return this.device.queue.writeBuffer(t,0,e),t}bufU32(e,r){let t=this.device.createBuffer({size:e.byteLength,usage:r});return this.device.queue.writeBuffer(t,0,e),t}async readBack(e,r){let t=globalThis,n=this.device.createBuffer({size:r,usage:t.GPUBufferUsage.COPY_DST|t.GPUBufferUsage.MAP_READ}),s=this.device.createCommandEncoder();s.copyBufferToBuffer(e,0,n,0,r),this.device.queue.submit([s.finish()]),await n.mapAsync(t.GPUMapMode.READ);let a=new Float32Array(n.getMappedRange().slice(0));return n.unmap(),n.destroy(),a}async readBackBytes(e,r){let t=globalThis,n=Math.ceil(r/4)*4,s=this.device.createBuffer({size:n,usage:t.GPUBufferUsage.COPY_DST|t.GPUBufferUsage.MAP_READ}),a=this.device.createCommandEncoder();a.copyBufferToBuffer(e,0,s,0,n),this.device.queue.submit([a.finish()]),await s.mapAsync(t.GPUMapMode.READ);let i=new Uint8Array(s.getMappedRange().slice(0,r));return s.unmap(),s.destroy(),i}async quantizeToBytes(e,r,t,n,s){let a=t/32,i=n==="q8"?new Uint8Array(t+a*2):new Uint8Array(t/2+a*4),o=X.BLOCK_ELEMS[e]??1,u=t/o,c=r.byteLength/u,l=(h,b)=>b===0?h:l(b,h%b),d=o*32/l(o,32),g=Math.floor(this.maxStorageBufferBindingSize*.9/4),p=s??g;p=Math.max(d,Math.floor(p/d)*d);for(let h=0;h<t;h+=p){let b=Math.min(p,t-h),k=r.slice(h/o*c,(h+b)/o*c),B=this.dequantizeToGpu(e,k,b);try{if(n==="q8"){let{codes:M,sc:F}=this.f32ToQ8Gpu(B,b),C=await this.readBackBytes(M,b),j=await this.readBackBytes(F,b/32*2);M.destroy?.(),F.destroy?.(),i.set(C,h),i.set(j,t+h/32*2)}else{let{nib:M,sc:F,mn:C}=this.f32ToQ4Gpu(B,b),j=await this.readBackBytes(M,b/2),A=await this.readBackBytes(F,b/32*2),v=await this.readBackBytes(C,b/32*2);M.destroy?.(),F.destroy?.(),C.destroy?.(),i.set(j,h/2),i.set(A,t/2+h/32*2),i.set(v,t/2+a*2+h/32*2)}}finally{B.destroy?.()}}return i}pipeline(e){let r=this.pipelines[e];return r||(r=this.device.createComputePipeline({layout:"auto",compute:{module:this.modules[e],entryPoint:"main"}}),this.pipelines[e]=r),r}grid1D(e){let r=Math.ceil(e/ee);if(r<=X.MAX_WG_DIM)return[r,1,1];let t=X.MAX_WG_DIM;return[t,Math.ceil(r/t),1]}recordPass(e,r,t,n){let s=this.pipeline(r),a=this.device.createBindGroup({layout:s.getBindGroupLayout(0),entries:t.map((u,c)=>({binding:c,resource:{buffer:u}}))}),i=this.profiler?.slot(r),o=e.beginComputePass(i?{timestampWrites:i}:void 0);o.setPipeline(s),o.setBindGroup(0,a),o.dispatchWorkgroups(...n),o.end()}dispatch(e,r,t){let n=this.device.createCommandEncoder();this.recordPass(n,e,r,t),this.device.queue.submit([n.finish()])}async run(e,r,t,n,s){return this.dispatch(e,r,t),this.readBack(n,s)}isF32(e){return e instanceof Float32Array}async matmul(e,r,t,n,s){let a=globalThis,i=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,o=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([t,n,s]));let u=this.isF32(r)?this.buf(r,i):r,c=this.device.createBuffer({size:t*s*4,usage:i|a.GPUBufferUsage.COPY_SRC});return this.run("matmul",[o,this.buf(e,i),u,c],[Math.ceil(t/8),Math.ceil(s/8),1],c,t*s*4)}async matmulT(e,r,t,n,s,a=!1){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([t,n,s]));let c=this.isF32(r)?this.buf(r,o):r,l=this.device.createBuffer({size:t*s*4,usage:o|i.GPUBufferUsage.COPY_SRC}),d=this.matmulTPlan(t,n,s,a);return this.run(d.shader,[u,this.buf(e,o),c,l],d.grid,l,t*s*4)}matmulTPlan(e,r,t,n){return n&&this.hasF16?this.f16SharedOk&&e>=32&&r%4===0?{shader:"matmul_t_f16w_shared",grid:[Math.ceil(t/64),Math.ceil(e/32),1]}:{shader:"matmul_t_f16w",grid:[Math.ceil(e/8),Math.ceil(t/8),1]}:{shader:r%4===0?"matmul_t_vec4":"matmul_t",grid:[Math.ceil(e/8),Math.ceil(t/8),1]}}async rmsnorm(e,r,t,n,s=1e-5,a=!1){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([t,n])),this.device.queue.writeBuffer(u,8,new Float32Array([s])),this.device.queue.writeBuffer(u,12,new Uint32Array([a?1:0]));let c=this.device.createBuffer({size:e.byteLength,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run("rmsnorm",[u,this.buf(e,o),this.buf(r,o),c],[Math.ceil(t/ee),1,1],c,e.byteLength)}async topKReadback(e,r,t){let n=globalThis,s=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST,a=this.device.createBuffer({size:8,usage:n.GPUBufferUsage.UNIFORM|n.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(a,0,new Uint32Array([e.length,r]));let i=this.device.createBuffer({size:r*2*4,usage:s|n.GPUBufferUsage.COPY_SRC}),o=this.device.createBuffer({size:r*2*4,usage:n.GPUBufferUsage.COPY_DST|n.GPUBufferUsage.MAP_READ}),u=this.device.createCommandEncoder(),c=this.buf(e,s);this.recordPass(u,t,[a,c,i],[1,1,1]),u.copyBufferToBuffer(i,0,o,0,r*2*4),this.device.queue.submit([u.finish()]),await o.mapAsync(n.GPUMapMode.READ);let l=new Uint32Array(o.getMappedRange().slice(0));return o.unmap(),o.destroy(),i.destroy?.(),a.destroy?.(),c.destroy?.(),l}async rmsnormVec(e,r,t,n,s=1e-5,a=!1){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([t,n])),this.device.queue.writeBuffer(u,8,new Float32Array([s])),this.device.queue.writeBuffer(u,12,new Uint32Array([a?1:0]));let c=this.device.createBuffer({size:e.byteLength,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run("rmsnorm_vec",[u,this.buf(e,o),this.buf(r,o),c],[t,1,1],c,e.byteLength)}async binary(e,r,t){let n=globalThis,s=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST,a=this.device.createBuffer({size:r.byteLength,usage:s|n.GPUBufferUsage.COPY_SRC});return this.run(e,[this.buf(r,s),this.buf(t,s),a],this.grid1D(r.length),a,r.byteLength)}swiglu(e,r){return this.binary("swiglu",e,r)}geglu(e,r){return this.binary("geglu",e,r)}add(e,r){return this.binary("add",e,r)}async silu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("silu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async groupNorm(e,r,t,n,s,a,i=1e-5){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([n,s,a])),this.device.queue.writeBuffer(c,12,new Float32Array([i]));let l=this.device.createBuffer({size:e.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("group_norm",[c,this.buf(e,u),this.buf(r,u),this.buf(t,u),l],[a,1,1],l,e.byteLength)}async conv2d(e,r,t,n,s,a,i,o,u,c=1,l=0){let d=globalThis,g=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,p=Math.floor((s+2*l-o)/c)+1,h=Math.floor((a+2*l-u)/c)+1,b=n*o*u,k=p*h;if(b*k*4>this.maxStorageBufferBindingSize*.9)return this.conv2dDirect(e,r,t,n,s,a,i,o,u,c,l);let B=this.device.createBuffer({size:48,usage:d.GPUBufferUsage.UNIFORM|d.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(B,0,new Uint32Array([n,s,a,o,u,c,l,p,h]));let M=this.device.createBuffer({size:b*k*4,usage:g|d.GPUBufferUsage.COPY_SRC});this.dispatch("im2col",[B,this.buf(e,g),M],this.grid1D(b*k));let F=await this.matmul(r,M,i,b,k);if(M.destroy?.(),B.destroy?.(),t)for(let C=0;C<i;C++){let j=t[C];for(let A=0;A<k;A++)F[C*k+A]+=j}return F}async conv2dDirect(e,r,t,n,s,a,i,o,u,c=1,l=0){let d=globalThis,g=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,p=Math.floor((s+2*l-o)/c)+1,h=Math.floor((a+2*l-u)/c)+1,b=i*p*h,k=this.device.createBuffer({size:48,usage:d.GPUBufferUsage.UNIFORM|d.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(k,0,new Uint32Array([n,s,a,i,o,u,c,l,p,h]));let B=t??new Float32Array(i),M=this.device.createBuffer({size:b*4,usage:g|d.GPUBufferUsage.COPY_SRC});return this.run("conv2d_direct",[k,this.buf(e,g),this.buf(r,g),this.buf(B,g),M],this.grid1D(b),M,b*4)}async layernorm(e,r,t,n,s,a=1e-5){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s])),this.device.queue.writeBuffer(u,8,new Float32Array([a]));let c=this.device.createBuffer({size:e.byteLength,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run("layernorm",[u,this.buf(e,o),this.buf(r,o),this.buf(t,o),c],[Math.ceil(n/ee),1,1],c,e.byteLength)}async quickGelu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("quick_gelu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async gelu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("gelu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async relu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("relu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async upsampleNearest(e,r,t,n,s=2){let a=globalThis,i=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,o=t*s,u=n*s,c=r*o*u,l=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(l,0,new Uint32Array([r,t,n,s]));let d=this.device.createBuffer({size:c*4,usage:i|a.GPUBufferUsage.COPY_SRC});return this.run("upsample_nearest",[l,this.buf(e,i),d],this.grid1D(c),d,c*4)}async rope(e,r,t,n,s=0,a=1e4,i=!1){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:32,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([r,t,n,s])),this.device.queue.writeBuffer(c,16,new Float32Array([a]));let l=this.device.createBuffer({size:e.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.device.queue.writeBuffer(c,20,new Uint32Array([i?1:0])),this.run("rope",[c,this.buf(e,u),l],[Math.ceil(r/ee),1,1],l,e.byteLength)}async ropeFactors(e,r,t,n,s,a=0,i=1e4,o=!1){let u=globalThis,c=u.GPUBufferUsage.STORAGE|u.GPUBufferUsage.COPY_DST,l=this.device.createBuffer({size:32,usage:u.GPUBufferUsage.UNIFORM|u.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(l,0,new Uint32Array([t,n,s,a])),this.device.queue.writeBuffer(l,16,new Float32Array([i]));let d=this.device.createBuffer({size:r.byteLength,usage:c});this.device.queue.writeBuffer(d,0,r);let g=this.device.createBuffer({size:e.byteLength,usage:c|u.GPUBufferUsage.COPY_SRC});return this.device.queue.writeBuffer(l,20,new Uint32Array([o?1:0])),this.run("rope_factors",[l,this.buf(e,c),d,g],[Math.ceil(t/ee),1,1],g,e.byteLength)}async ropeMrope(e,r,t,n,s,a,i=1e4){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:32,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([t,n,s,a[0],a[0]+a[1]])),this.device.queue.writeBuffer(c,20,new Float32Array([i]));let l=this.device.createBuffer({size:r.byteLength,usage:u});this.device.queue.writeBuffer(l,0,r);let d=this.device.createBuffer({size:e.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("rope_mrope",[c,this.buf(e,u),l,d],[Math.ceil(t/ee),1,1],d,e.byteLength)}async rope2d(e,r,t,n,s,a=1e4){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:32,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([t,n,s,0])),this.device.queue.writeBuffer(u,16,new Float32Array([a]));let c=this.device.createBuffer({size:r.byteLength,usage:o});this.device.queue.writeBuffer(c,0,r);let l=this.device.createBuffer({size:e.byteLength,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run("rope_2d",[u,this.buf(e,o),c,l],[Math.ceil(t/ee),1,1],l,e.byteLength)}async attention(e,r,t,n,s,a,i,o=0,u,c=0,l=0){let d=globalThis,g=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,p=o+n,h=this.attnUniform(n,s,a,i,p,o,u??1/Math.sqrt(i),c,l),b=n*s*i*4,k=this.device.createBuffer({size:b,usage:g|d.GPUBufferUsage.COPY_SRC});return this.run("attention",[h,this.buf(e,g),this.buf(r,g),this.buf(t,g),k],[Math.ceil(n*s/ee),1,1],k,b)}async attentionDecode(e,r,t,n,s,a,i,o=0,u,c=0,l=0){let d=globalThis,g=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,p=o+n,h=this.attnUniform(n,s,a,i,p,o,u??1/Math.sqrt(i),c,l),b=n*s*i*4,k=this.device.createBuffer({size:b,usage:g|d.GPUBufferUsage.COPY_SRC});return this.run("attention_decode",[h,this.buf(e,g),this.buf(r,g),this.buf(t,g),k],[n*s,1,1],k,b)}async attentionFull(e,r,t,n,s,a,i,o,u,c=0){let l=globalThis,d=l.GPUBufferUsage.STORAGE|l.GPUBufferUsage.COPY_DST,g=this.device.createBuffer({size:32,usage:l.GPUBufferUsage.UNIFORM|l.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(g,0,new Uint32Array([n,s,a,i,o,0])),this.device.queue.writeBuffer(g,24,new Float32Array([u??1/Math.sqrt(i),c]));let p=n*s*i*4,h=this.device.createBuffer({size:p,usage:d|l.GPUBufferUsage.COPY_SRC});return this.run("attention_full",[g,this.buf(e,d),this.buf(r,d),this.buf(t,d),h],[Math.ceil(n*s/ee),1,1],h,p)}async attentionFullWg(e,r,t,n,s,a,i,o,u,c=0){let l=globalThis,d=l.GPUBufferUsage.STORAGE|l.GPUBufferUsage.COPY_DST,g=this.device.createBuffer({size:32,usage:l.GPUBufferUsage.UNIFORM|l.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(g,0,new Uint32Array([n,s,a,i,o,0])),this.device.queue.writeBuffer(g,24,new Float32Array([u??1/Math.sqrt(i),c]));let p=n*s*i*4,h=this.device.createBuffer({size:p,usage:d|l.GPUBufferUsage.COPY_SRC});return this.run("attention_full_wg",[g,this.buf(e,d),this.buf(r,d),this.buf(t,d),h],[n*s,1,1],h,p)}async quantizeKvReadback(e,r,t,n){let s=globalThis,a=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST|s.GPUBufferUsage.COPY_SRC,i=t*n,o=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([r,t,n,0]));let u=this.device.createBuffer({size:r*i,usage:a}),c=this.device.createBuffer({size:r*t*4,usage:a});this.dispatch("quantize_kv",[o,this.buf(e,a),u,c],this.grid1D(r*t));let l=await this.readBack(u,r*i),d=new Uint32Array(l.buffer,0,r*i/4),g=await this.readBack(c,r*t*4);return u.destroy?.(),c.destroy?.(),{codes:d,scales:g}}async attentionQ8Kv(e,r,t,n,s,a,i,o,u,c=0,l,d=0,g=0){let p=globalThis,h=p.GPUBufferUsage.STORAGE|p.GPUBufferUsage.COPY_DST,b=c+a,k=this.attnUniform(a,i,o,u,b,c,l??1/Math.sqrt(u),d,g),B=a*i*u*4,M=this.device.createBuffer({size:B,usage:h|p.GPUBufferUsage.COPY_SRC});return this.run("attention_q8kv",[k,this.buf(e,h),this.bufU32(r,h),this.buf(t,h),this.bufU32(n,h),this.buf(s,h),M],[Math.ceil(a*i/ee),1,1],M,B)}async attentionQ8KvDecode(e,r,t,n,s,a,i,o,u,c=0,l,d=0,g=0){let p=globalThis,h=p.GPUBufferUsage.STORAGE|p.GPUBufferUsage.COPY_DST,b=c+a,k=this.attnUniform(a,i,o,u,b,c,l??1/Math.sqrt(u),d,g),B=a*i*u*4,M=this.device.createBuffer({size:B,usage:h|p.GPUBufferUsage.COPY_SRC});return this.run("attention_decode_q8kv",[k,this.buf(e,h),this.bufU32(r,h),this.buf(t,h),this.bufU32(n,h),this.buf(s,h),M],[a*i,1,1],M,B)}async addBias(e,r,t,n){let s=globalThis,a=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,i=this.device.createBuffer({size:8,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(i,0,new Uint32Array([t,n]));let o=this.device.createBuffer({size:e.byteLength,usage:a|s.GPUBufferUsage.COPY_SRC});return this.run("addbias",[i,this.buf(e,a),this.buf(r,a),o],this.grid1D(e.length),o,e.byteLength)}async dequantBlocked(e,r,t,n){let s=globalThis,a=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,i=t/n;if(!Number.isInteger(i))throw new Error(`${e}: nElems ${t} not a multiple of ${n}`);let o=r.byteLength%4===0?r:(()=>{let d=new Uint8Array(Math.ceil(r.byteLength/4)*4);return d.set(r),d})(),u=new Uint32Array(o.buffer,o.byteOffset,o.byteLength/4),c=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([i]));let l=this.device.createBuffer({size:t*4,usage:a|s.GPUBufferUsage.COPY_SRC});return this.run(e,[c,this.bufU32(u,a),l],this.grid1D(i),l,t*4)}async dequantizeQ4K(e,r){return this.dequantBlocked("dequant_q4k",e,r,256)}async dequantizeByType(e,r,t){if(e==="F32")return new Float32Array(r.buffer,r.byteOffset,t);if(e==="F16"){let a=new DataView(r.buffer,r.byteOffset),i=new Float32Array(t);for(let o=0;o<t;o++)i[o]=pe(a.getUint16(o*2,!0));return i}if(e==="Q4W")return ge(Ue(r,t));if(e==="Q8W")return ve(xe(r,t));if(e==="Q3W")return We(ut(r,t));let n=X.DEQUANT_SHADER[e],s=X.BLOCK_ELEMS[e];if(!n||!s)throw new Error(`dequant: unsupported GGML type ${e}`);return this.dequantBlocked(n,r,t,s)}dequantBlockedGpu(e,r,t,n){let s=globalThis,a=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,i=t/n;if(!Number.isInteger(i))throw new Error(`${e}: nElems ${t} not a multiple of ${n}`);let o=r.byteLength%4===0?r:(()=>{let d=new Uint8Array(Math.ceil(r.byteLength/4)*4);return d.set(r),d})(),u=new Uint32Array(o.buffer,o.byteOffset,o.byteLength/4),c=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([i]));let l=this.device.createBuffer({size:t*4,usage:a});return this.dispatch(e,[c,this.bufU32(u,a),l],this.grid1D(i)),l}dequantizeToGpu(e,r,t){let n=globalThis,s=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST;if(e==="F32")return this.buf(new Float32Array(r.buffer,r.byteOffset,t),s);if(e==="F16"){let o=new DataView(r.buffer,r.byteOffset),u=new Float32Array(t);for(let c=0;c<t;c++)u[c]=pe(o.getUint16(c*2,!0));return this.buf(u,s)}if(e==="Q4W")return this.buf(ge(Ue(r,t)),s);if(e==="Q8W")return this.buf(ve(xe(r,t)),s);if(e==="Q3W")return this.buf(We(ut(r,t)),s);let a=X.DEQUANT_SHADER[e],i=X.BLOCK_ELEMS[e];if(!a||!i)throw new Error(`dequant: unsupported GGML type ${e}`);return this.dequantBlockedGpu(a,r,t,i)}async layerForward(e,r,t,n=!1){let{seq:s,d:a,nHeads:i,nKvHeads:o,headDim:u,ffn:c,ropeTheta:l,eps:d}=r,g=o*u,p=n?(q,T,R,O,D)=>this.matmulT(q,T,R,O,D):(q,T,R,O,D)=>this.matmul(q,T,R,O,D),h=i*u,b=r.rmsGainOnePlus===!0,k=r.attnLogitSoftcap??0,B=(q,T)=>r.act==="gelu"?this.geglu(q,T):this.swiglu(q,T),M=await this.rmsnorm(e,t.attnNorm,s,a,d,b),F=await p(M,t.wq,s,a,h),C=await p(M,t.wk,s,a,g),j=await p(M,t.wv,s,a,g);t.bq&&(F=await this.addBias(F,t.bq,s,h)),t.bk&&(C=await this.addBias(C,t.bk,s,g)),t.bv&&(j=await this.addBias(j,t.bv,s,g)),t.qNorm&&(F=await this.rmsnorm(F,t.qNorm,s*i,u,d,b)),t.kNorm&&(C=await this.rmsnorm(C,t.kNorm,s*o,u,d,b));let A=await this.rope(F,s*i,u,i,0,l),v=await this.rope(C,s*o,u,o,0,l),m=await this.attention(A,v,j,s,i,o,u,0,r.attnScale,k),y=await p(m,t.wo,s,h,a);t.postAttnNorm&&(y=await this.rmsnorm(y,t.postAttnNorm,s,a,d,b));let _=await this.add(e,y),w=await this.rmsnorm(_,t.ffnNorm,s,a,d,b),P=await p(w,t.wgate,s,a,c),U=await p(w,t.wup,s,a,c),x=await B(P,U),G=await p(x,t.wdown,s,c,a);return t.postFfnNorm&&(G=await this.rmsnorm(G,t.postFfnNorm,s,a,d,b)),this.add(_,G)}async layerForwardKV(e,r,t,n,s,a,i=!1){let{seq:o,d:u,nHeads:c,nKvHeads:l,headDim:d,ffn:g,ropeTheta:p,eps:h}=r,b=l*d,k=i?($,V,I,W,S)=>this.matmulT($,V,I,W,S):($,V,I,W,S)=>this.matmul($,V,I,W,S),B=($,V)=>{let I=new Float32Array($.length+V.length);return I.set($),I.set(V,$.length),I},M=c*d,F=r.rmsGainOnePlus===!0,C=r.attnLogitSoftcap??0,j=($,V)=>r.act==="gelu"?this.geglu($,V):this.swiglu($,V),A=await this.rmsnorm(e,t.attnNorm,o,u,h,F),v=await k(A,t.wq,o,u,M),m=await k(A,t.wk,o,u,b),y=await k(A,t.wv,o,u,b);t.bq&&(v=await this.addBias(v,t.bq,o,M)),t.bk&&(m=await this.addBias(m,t.bk,o,b)),t.bv&&(y=await this.addBias(y,t.bv,o,b)),t.qNorm&&(v=await this.rmsnorm(v,t.qNorm,o*c,d,h,F)),t.kNorm&&(m=await this.rmsnorm(m,t.kNorm,o*l,d,h,F));let _=await this.rope(v,o*c,d,c,n,p),w=await this.rope(m,o*l,d,l,n,p),P=B(s,w),U=B(a,y),x=await this.attention(_,P,U,o,c,l,d,n,r.attnScale,C),G=await k(x,t.wo,o,M,u);t.postAttnNorm&&(G=await this.rmsnorm(G,t.postAttnNorm,o,u,h,F));let q=await this.add(e,G),T=await this.rmsnorm(q,t.ffnNorm,o,u,h,F),R=await k(T,t.wgate,o,u,g),O=await k(T,t.wup,o,u,g),D=await j(R,O),H=await k(D,t.wdown,o,g,u);return t.postFfnNorm&&(H=await this.rmsnorm(H,t.postFfnNorm,o,u,h,F)),{out:await this.add(q,H),k:P,v:U}}storage(e){let r=this.bufferPool.get(e);if(r&&r.length){let n=r.pop();return this.pooled.delete(n),n}let t=this.device.createBuffer({size:e,usage:X.STORAGE_USAGE});return this.poolSize.set(t,e),t}release(e){for(let r of e){if(!r)continue;let t=this.poolSize.get(r);if(t!==void 0){if(this.pooled.has(r))continue;this.pooled.add(r);let s=this.bufferPool.get(t);s||(s=[],this.bufferPool.set(t,s)),s.push(r);continue}let n=this.uniformSize.get(r);if(n!==void 0){if(this.pooled.has(r))continue;this.pooled.add(r);let s=this.uniformPool.get(n);s||(s=[],this.uniformPool.set(n,s)),s.push(r);continue}r.destroy?.()}}uploadGpu(e){return e instanceof Float32Array?this.buf(e,X.STORAGE_USAGE):this.f16ToF32Gpu(e.f16,e.n)}uploadGpuF16(e){let r=new Uint16Array(e.length);for(let t=0;t<e.length;t++)r[t]=Fe(e[t]);return this.bufU16(r)}f32ToF16Gpu(e,r){let t=globalThis,n=Math.ceil(r/2),s=this.device.createBuffer({size:n*4,usage:X.STORAGE_USAGE}),a=this.device.createBuffer({size:16,usage:t.GPUBufferUsage.UNIFORM|t.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(a,0,new Uint32Array([n])),this.dispatch("packf16",[a,e,s],this.grid1D(n)),s}f32ToQ8Gpu(e,r){let t=globalThis,n=r/32,s=this.device.createBuffer({size:r,usage:X.STORAGE_USAGE}),a=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:X.STORAGE_USAGE}),i=this.device.createBuffer({size:16,usage:t.GPUBufferUsage.UNIFORM|t.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(i,0,new Uint32Array([n])),this.dispatch("quantize_q8",[i,e,s,a],this.grid1D(n)),{codes:s,sc:a}}f32ToQ4Gpu(e,r){let t=globalThis,n=r/32,s=this.device.createBuffer({size:r/2,usage:X.STORAGE_USAGE}),a=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:X.STORAGE_USAGE}),i=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:X.STORAGE_USAGE}),o=this.device.createBuffer({size:16,usage:t.GPUBufferUsage.UNIFORM|t.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(o,0,new Uint32Array([n])),this.dispatch("quantize_q4",[o,e,s,a,i],this.grid1D(n)),{nib:s,sc:a,mn:i}}uploadGpuRawF16(e){let r=Math.ceil(e.byteLength/4)*4,t=this.device.createBuffer({size:r,usage:X.STORAGE_USAGE});if(this.device.queue.writeBuffer(t,0,e,0,e.byteLength-e.byteLength%4),e.byteLength%4){let n=new Uint8Array(4);n.set(e.subarray(e.byteLength-e.byteLength%4)),this.device.queue.writeBuffer(t,e.byteLength-e.byteLength%4,n)}return t}bufU16(e){let r=this.device.createBuffer({size:e.byteLength,usage:X.STORAGE_USAGE});return this.device.queue.writeBuffer(r,0,e),r}uploadGpuRaw(e){let r=Math.ceil(e.byteLength/4)*4,t=this.device.createBuffer({size:r,usage:X.STORAGE_USAGE}),n=e.byteLength-e.byteLength%4;if(this.device.queue.writeBuffer(t,0,e,0,n),e.byteLength%4){let s=new Uint8Array(4);s.set(e.subarray(n)),this.device.queue.writeBuffer(t,n,s)}return t}async matmulQ4(e,r,t,n,s,a,i){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s,a,i]));let l=this.device.createBuffer({size:s*i*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4",[c,this.buf(e,u),r,t,n,l],[Math.ceil(s/8),Math.ceil(i/8),1],l,s*i*4)}async matmulQ4Tiled(e,r,t,n,s,a,i){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s,a,i]));let l=this.device.createBuffer({size:s*i*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_tiled",[c,this.buf(e,u),r,t,n,l],[Math.ceil(Math.ceil(s/4)/8),Math.ceil(i/8),1],l,s*i*4)}async matmulQ4Shared(e,r,t,n,s,a,i){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s,a,i]));let l=this.device.createBuffer({size:s*i*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_shared",[c,this.buf(e,u),r,t,n,l],[Math.ceil(i/64),Math.ceil(s/32),1],l,s*i*4)}async matmulQ3(e,r,t,n,s,a,i,o){let u=globalThis,c=u.GPUBufferUsage.STORAGE|u.GPUBufferUsage.COPY_DST,l=this.device.createBuffer({size:16,usage:u.GPUBufferUsage.UNIFORM|u.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(l,0,new Uint32Array([a,i,o]));let d=this.device.createBuffer({size:a*o*4,usage:c|u.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q3",[l,this.buf(e,c),r,t,n,s,d],[Math.ceil(a/8),Math.ceil(o/8),1],d,a*o*4)}async rwkvWkv7(e,r,t,n,s,a,i,o,u){let c=globalThis,l=c.GPUBufferUsage.STORAGE|c.GPUBufferUsage.COPY_DST,d=this.device.createBuffer({size:8,usage:c.GPUBufferUsage.UNIFORM|c.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(d,0,new Uint32Array([o,u]));let g=this.device.createBuffer({size:e.byteLength,usage:l|c.GPUBufferUsage.COPY_SRC});this.device.queue.writeBuffer(g,0,e);let p=this.device.createBuffer({size:o*u*4,usage:l|c.GPUBufferUsage.COPY_SRC});this.dispatch("rwkv_wkv7",[d,this.buf(r,l),this.buf(t,l),this.buf(n,l),this.buf(s,l),this.buf(a,l),this.buf(i,l),g,p],this.grid1D(o*u));let h=await this.readBack(g,e.byteLength),b=await this.readBack(p,o*u*4);return g.destroy?.(),p.destroy?.(),{S:h,y:b}}async rwkvTokenShift(e,r,t,n){let s=globalThis,a=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,i=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(i,0,new Uint32Array([n]));let o=this.device.createBuffer({size:6*n*4,usage:a|s.GPUBufferUsage.COPY_SRC});this.dispatch("rwkv_token_shift",[i,this.buf(e,a),this.buf(r,a),this.buf(t,a),o],this.grid1D(n*6));let u=await this.readBack(o,6*n*4);return o.destroy?.(),u}async lfm2ShortConv(e,r,t,n,s){let a=globalThis,i=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,o=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([n,s]));let u=this.buf(r,i|a.GPUBufferUsage.COPY_SRC),c=this.device.createBuffer({size:n*4,usage:i|a.GPUBufferUsage.COPY_SRC});this.dispatch("lfm2_shortconv",[o,this.buf(e,i),this.buf(t,i),u,c],this.grid1D(n));let l=await this.readBack(c,n*4),d=await this.readBack(u,(s-1)*n*4);return c.destroy?.(),u.destroy?.(),{out:l,state:d}}async matmulQ8(e,r,t,n,s,a){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s,a]));let c=this.device.createBuffer({size:n*a*4,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8",[u,this.buf(e,o),r,t,c],[Math.ceil(n/8),Math.ceil(a/8),1],c,n*a*4)}async matmulQ8Tiled(e,r,t,n,s,a){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s,a]));let c=this.device.createBuffer({size:n*a*4,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_tiled",[u,this.buf(e,o),r,t,c],[Math.ceil(Math.ceil(n/4)/8),Math.ceil(a/8),1],c,n*a*4)}async matmulQ8Shared(e,r,t,n,s,a){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s,a]));let c=this.device.createBuffer({size:n*a*4,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_shared",[u,this.buf(e,o),r,t,c],[Math.ceil(a/64),Math.ceil(n/32),1],c,n*a*4)}uniformOf(e){let r=globalThis,t=this.uniformPool.get(e);if(t&&t.length){let s=t.pop();return this.pooled.delete(s),s}let n=this.device.createBuffer({size:e,usage:r.GPUBufferUsage.UNIFORM|r.GPUBufferUsage.COPY_DST});return this.uniformSize.set(n,e),n}uniform(e,r){let t=this.uniformOf(32);if(this.device.queue.writeBuffer(t,0,new Uint32Array(e)),r){let n=Array.isArray(r.value)?r.value:[r.value];this.device.queue.writeBuffer(t,r.offset,new Float32Array(n))}return t}attnUniform(e,r,t,n,s,a,i,o,u){let c=this.uniformOf(48);return this.device.queue.writeBuffer(c,0,new Uint32Array([e,r,t,n,s,a])),this.device.queue.writeBuffer(c,24,new Float32Array([i,o])),this.device.queue.writeBuffer(c,32,new Uint32Array([u])),c}recMatmulT(e,r,t,n,s,a,i,o=!1){let u=this.uniform([s,a,i]),c=this.storage(s*i*4),l=this.matmulTPlan(s,a,i,o);return this.recordPass(e,l.shader,[u,t,n,c],l.grid),r.push(u,c),c}recConv2dDirect(e,r,t,n,s,a,i,o,u,c,l,d,g){let p=Math.floor((i+2*g-c)/d)+1,h=Math.floor((o+2*g-l)/d)+1,b=u*p*h,k=this.uniformOf(48);if(this.device.queue.writeBuffer(k,0,new Uint32Array([a,i,o,u,c,l,d,g,p,h])),c===3&&l===3&&d===1&&g===1&&this.convTiledOk){let M=this.storage(b*4);return this.recordPass(e,"conv2d_3x3_tiled",[k,t,n,s,M],[Math.ceil(h/16),Math.ceil(p/16),u]),r.push(k,M),M}let B=this.storage(b*4);return this.recordPass(e,"conv2d_direct",[k,t,n,s,B],this.grid1D(b)),r.push(k,B),B}recConv2dDirectQ8(e,r,t,n,s,a,i,o,u,c,l,d,g){let p=Math.floor((i+2*g-c)/d)+1,h=Math.floor((o+2*g-l)/d)+1,b=u*p*h,k=this.uniformOf(48);this.device.queue.writeBuffer(k,0,new Uint32Array([a,i,o,u,c,l,d,g,p,h]));let B=this.storage(b*4);return this.recordPass(e,"conv2d_direct_q8",[k,t,n.codes,n.sc,s,B],this.grid1D(b)),r.push(k,B),B}recConv2dDirectQ4(e,r,t,n,s,a,i,o,u,c,l,d,g){let p=Math.floor((i+2*g-c)/d)+1,h=Math.floor((o+2*g-l)/d)+1,b=u*p*h,k=this.uniformOf(48);this.device.queue.writeBuffer(k,0,new Uint32Array([a,i,o,u,c,l,d,g,p,h]));let B=this.storage(b*4);return this.recordPass(e,"conv2d_direct_q4",[k,t,n.nib,n.sc,n.mn,s,B],this.grid1D(b)),r.push(k,B),B}recGroupNorm(e,r,t,n,s,a,i,o,u){let c=this.uniform([a,i,o],{offset:12,value:u}),l=this.storage(a*i*4);return this.recordPass(e,"group_norm",[c,t,n,s,l],[o,1,1]),r.push(c,l),l}recUnary(e,r,t,n,s){let a=this.storage(s*4);return this.recordPass(e,t,[n,a],this.grid1D(s)),r.push(a),a}recLayernorm(e,r,t,n,s,a,i,o){let u=this.uniform([a,i],{offset:8,value:o}),c=this.storage(a*i*4);return this.recordPass(e,"layernorm",[u,t,n,s,c],[Math.ceil(a/ee),1,1]),r.push(u,c),c}recAttentionFull(e,r,t,n,s,a,i,o,u,c,l){let d=this.uniform([a,i,o,u,c,0],{offset:24,value:[l??1/Math.sqrt(u),0]}),g=this.storage(a*i*u*4),p=a*i;return this.attnFullWgOk&&u<=192&&p<=65535?this.recordPass(e,"attention_full_wg",[d,t,n,s,g],[p,1,1]):this.recordPass(e,"attention_full",[d,t,n,s,g],[Math.ceil(p/ee),1,1]),r.push(d,g),g}recUpsample(e,r,t,n,s,a,i){let o=this.uniform([n,s,a,i]),u=n*(s*i)*(a*i),c=this.storage(u*4);return this.recordPass(e,"upsample_nearest",[o,t,c],this.grid1D(u)),r.push(o,c),c}recConcat(e,r,t,n,s,a,i){let o=this.storage((s+a)*i*4);return e.copyBufferToBuffer(t,0,o,0,s*i*4),e.copyBufferToBuffer(n,0,o,s*i*4,a*i*4),r.push(o),o}recAddChannelBias(e,r,t,n,s,a){let i=this.uniform([s,a]),o=this.storage(s*a*4);return this.recordPass(e,"add_channel_bias",[i,t,n,o],this.grid1D(s*a)),r.push(i,o),o}recTranspose(e,r,t,n,s){let a=this.uniform([n,s]),i=this.storage(n*s*4);return this.recordPass(e,"transpose2d",[a,t,i],this.grid1D(n*s)),r.push(a,i),i}recGegluSplit(e,r,t,n,s){let a=this.uniform([n,s]),i=this.storage(n*s*4);return this.recordPass(e,"geglu_split",[a,t,i],this.grid1D(n*s)),r.push(a,i),i}recVideoGather(e,r,t,n,s,a){let i=this.uniform([n,s,a]),o=this.storage(a*n*s*4);return this.recordPass(e,"video_motion_gather",[i,t,o],this.grid1D(a*n*s)),r.push(i,o),o}recVideoScatter(e,r,t,n,s,a,i){let o=this.uniform([s,a,i]),u=this.storage(s*a*i*4);return this.recordPass(e,"video_motion_scatter",[o,t,n,u],this.grid1D(s*a*i)),r.push(o,u),u}recVideoAddPe(e,r,t,n,s,a,i){let o=this.uniform([s,a,i]),u=this.storage(i*s*a*4);return this.recordPass(e,"video_add_pe",[o,t,n,u],this.grid1D(i*s*a)),r.push(o,u),u}recAttnTemporal(e,r,t,n,s,a,i,o,u){let c=this.uniform([a,i,o,u],{offset:16,value:1/Math.sqrt(u)}),l=this.storage(a*i*o*u*4);return this.recordPass(e,"attn_temporal",[c,t,n,s,l],this.grid1D(a*i*o)),r.push(c,l),l}recordingSession(){let e=this.device.createCommandEncoder(),r=[],t=n=>{if(n instanceof Float32Array){let s=this.uploadGpu(n);return r.push(s),s}return n};return{conv2d:(n,s,a,i,o,u,c,l,d,g,p)=>s&&s.nib?this.recConv2dDirectQ4(e,r,t(n),s,t(a),i,o,u,c,l,d,g,p):s&&s.codes?this.recConv2dDirectQ8(e,r,t(n),s,t(a),i,o,u,c,l,d,g,p):this.recConv2dDirect(e,r,t(n),t(s),t(a),i,o,u,c,l,d,g,p),groupNorm:(n,s,a,i,o,u,c)=>this.recGroupNorm(e,r,t(n),t(s),t(a),i,o,u,c),silu:(n,s)=>this.recUnary(e,r,"silu",t(n),s),quickGelu:(n,s)=>this.recUnary(e,r,"quick_gelu",t(n),s),gelu:(n,s)=>this.recUnary(e,r,"gelu",t(n),s),relu:(n,s)=>this.recUnary(e,r,"relu",t(n),s),add:(n,s,a)=>this.recBinary(e,r,"add",t(n),t(s),a),geglu:(n,s,a)=>this.recBinary(e,r,"geglu",t(n),t(s),a),matmulT:(n,s,a,i,o)=>this.recMM(e,r,t(n),s instanceof Float32Array?t(s):s,a,i,o,!1),addBias:(n,s,a,i)=>this.recAddBias(e,r,t(n),t(s),a,i),addChannelBias:(n,s,a,i)=>this.recAddChannelBias(e,r,t(n),t(s),a,i),attentionFull:(n,s,a,i,o,u,c,l)=>this.recAttentionFull(e,r,t(n),t(s),t(a),i,o,u,c,l),rope2d:(n,s,a,i,o,u)=>{let c=s instanceof Uint32Array?(()=>{let l=this.uploadGpuRaw(new Uint8Array(s.buffer,s.byteOffset,s.byteLength));return r.push(l),l})():s;return this.recRope2d(e,r,t(n),c,a,i,o,u)},attention:(n,s,a,i,o,u,c,l,d)=>this.recAttention(e,r,t(n),t(s),t(a),i,o,u,c,l,d),upsample:(n,s,a,i,o)=>this.recUpsample(e,r,t(n),s,a,i,o),layernorm:(n,s,a,i,o,u)=>this.recLayernorm(e,r,t(n),t(s),t(a),i,o,u),concat:(n,s,a,i,o)=>this.recConcat(e,r,t(n),t(s),a,i,o),transpose:(n,s,a)=>this.recTranspose(e,r,t(n),s,a),gegluSplit:(n,s,a)=>this.recGegluSplit(e,r,t(n),s,a),videoGather:(n,s,a,i)=>this.recVideoGather(e,r,t(n),s,a,i),videoScatter:(n,s,a,i,o)=>this.recVideoScatter(e,r,t(n),t(s),a,i,o),videoAddPe:(n,s,a,i,o)=>this.recVideoAddPe(e,r,t(n),t(s),a,i,o),attnTemporal:(n,s,a,i,o,u,c)=>this.recAttnTemporal(e,r,t(n),t(s),t(a),i,o,u,c),alloc:n=>{let s=this.storage(n);return r.push(s),s},copy:(n,s,a,i,o)=>{e.copyBufferToBuffer(a,i,n,s,o)},finish:async(n,s)=>{this.device.queue.submit([e.finish()]);let a=await this.readBack(n,s*4);return this.release(r),a},finishKeep:n=>{this.device.queue.submit([e.finish()]);let s=r.indexOf(n);return s>=0&&r.splice(s,1),this.release(r),n},finishKeepMany:n=>{this.device.queue.submit([e.finish()]);for(let s of n){let a=r.indexOf(s);a>=0&&r.splice(a,1)}return this.release(r),n}}}readGpu(e,r){return this.readBack(e,r*4)}trimPool(e=64<<20){let r=[...this.bufferPool.keys()].sort((n,s)=>s-n),t=0;for(let n of this.bufferPool.values())for(let s of n)t+=this.poolSize.get(s)??0;for(let n of r){let s=this.bufferPool.get(n);for(;s.length&&t>e;){let a=s.pop();this.pooled.delete(a),this.poolSize.delete(a),a.destroy?.(),t-=n}}}releaseGpu(e){this.release(e)}waitGpu(){return this.device.queue.onSubmittedWorkDone()}async benchMatmul(e,r,t,n,s,a={}){let{iters:i=10,shared:o=!0,wF16:u=!1}=a,c=this.f16SharedOk,l=this.qSharedOk;this.f16SharedOk=o,this.qSharedOk=o;let d=this.uploadGpu(e),g=[],p=this.device.createCommandEncoder();this.recMM(p,g,d,r,t,n,s,u),this.device.queue.submit([p.finish()]),await this.device.queue.onSubmittedWorkDone();let h=this.device.createCommandEncoder();for(let B=0;B<i;B++)this.recMM(h,g,d,r,t,n,s,u);let b=performance.now();this.device.queue.submit([h.finish()]),await this.device.queue.onSubmittedWorkDone();let k=(performance.now()-b)/i;return this.release(g),d.destroy?.(),this.f16SharedOk=c,this.qSharedOk=l,k}destroy(){try{this.profiler?.destroy()}catch{}this.profiler=null;try{this.device?.destroy?.()}catch{}this.bufferPool.clear(),this.uniformPool.clear()}f16ToF32Gpu(e,r){let t=this.uploadGpuRawF16(e),n=this.device.createBuffer({size:r*4,usage:X.STORAGE_USAGE}),s=this.uniformOf(16);return this.device.queue.writeBuffer(s,0,new Uint32Array([r])),this.dispatch("f16_to_f32",[s,t,n],this.grid1D(Math.ceil(r/2))),t.destroy?.(),this.release([s]),n}quantizeQ8Gpu(e){let r=e instanceof Float32Array?e.length:e.n;if(r%32!==0)return this.uploadGpu(e);let t=e instanceof Float32Array?this.buf(e,X.STORAGE_USAGE):this.f16ToF32Gpu(e.f16,r),n=this.f32ToQ8Gpu(t,r);return t.destroy?.(),n}async validateResidentOps(){let e=globalThis,r=_=>Float32Array.from({length:_},()=>(Math.random()*2-1)*.5),t=(_,w,P=.005)=>_.length===w.length&&_.every((U,x)=>Math.abs(U-w[x])<=P*(1+Math.abs(w[x]))),n=4,s=4,a=4,i=4,o=2,u=1e-5,c=i*s*a,l=r(n*s*a),d=r(i*n*9),g=r(i),p=r(i),h=r(i),b=await this.silu(await this.groupNorm(await this.conv2dDirect(l,d,g,n,s,a,i,3,3,1,1),p,h,i,s*a,o,u)),k=[],B=this.device.createCommandEncoder(),M=this.uploadGpu(l),F=this.uploadGpu(d),C=this.uploadGpu(g),j=this.uploadGpu(p),A=this.uploadGpu(h);k.push(M,F,C,j,A);let v=this.recConv2dDirect(B,k,M,F,C,n,s,a,i,3,3,1,1);v=this.recGroupNorm(B,k,v,j,A,i,s*a,o,u),v=this.recUnary(B,k,"silu",v,c);let m=this.device.createBuffer({size:c*4,usage:e.GPUBufferUsage.COPY_DST|e.GPUBufferUsage.MAP_READ});B.copyBufferToBuffer(v,0,m,0,c*4),this.device.queue.submit([B.finish()]),await m.mapAsync(e.GPUMapMode.READ);let y=new Float32Array(m.getMappedRange().slice(0));return m.unmap(),m.destroy(),this.release(k),t(y,b)?null:"resident_ops"}recMatmulQ4(e,r,t,n,s,a,i){let o=this.uniform([s,a,i]),u=this.storage(s*i*4);if(s===1&&this.gemvOk){let c=this.gemvGrid(i);this.recordPass(e,"matmul_t_q4_vec",[this.uniform([s,a,i,c.stride]),t,n.nib,n.sc,n.mn,u],c.grid)}else s>=32&&this.qSharedOk?this.recordPass(e,"matmul_t_q4_shared",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(i/64),Math.ceil(s/32),1]):s>=2?this.recordPass(e,"matmul_t_q4_tiled",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(Math.ceil(s/4)/8),Math.ceil(i/8),1]):this.recordPass(e,"matmul_t_q4",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(s/8),Math.ceil(i/8),1]);return r.push(o,u),u}recMatmulQ8(e,r,t,n,s,a,i){let o=this.uniform([s,a,i]),u=this.storage(s*i*4);if(s===1&&this.gemvOk){let c=this.gemvGrid(i);this.recordPass(e,"matmul_t_q8_vec",[this.uniform([s,a,i,c.stride]),t,n.codes,n.sc,u],c.grid)}else s>=32&&this.qSharedOk?this.recordPass(e,"matmul_t_q8_shared",[o,t,n.codes,n.sc,u],[Math.ceil(i/64),Math.ceil(s/32),1]):s>=2?this.recordPass(e,"matmul_t_q8_tiled",[o,t,n.codes,n.sc,u],[Math.ceil(Math.ceil(s/4)/8),Math.ceil(i/8),1]):this.recordPass(e,"matmul_t_q8",[o,t,n.codes,n.sc,u],[Math.ceil(s/8),Math.ceil(i/8),1]);return r.push(o,u),u}gemvGrid(e){return e<=32768?{grid:[e,1,1],stride:32768}:{grid:[32768,Math.ceil(e/32768),1],stride:32768}}async matmulQ4Vec(e,r,t,n,s,a){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.gemvGrid(a),c=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([1,s,a,u.stride]));let l=this.device.createBuffer({size:a*4,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_vec",[c,this.buf(e,o),r,t,n,l],u.grid,l,a*4)}async matmulQ8Vec(e,r,t,n,s){let a=globalThis,i=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,o=this.gemvGrid(s),u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([1,n,s,o.stride]));let c=this.device.createBuffer({size:s*4,usage:i|a.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_vec",[u,this.buf(e,i),r,t,c],o.grid,c,s*4)}recMatmulQ3(e,r,t,n,s,a,i){let o=this.uniform([s,a,i]),u=this.storage(s*i*4);return this.recordPass(e,"matmul_t_q3",[o,t,n.lo,n.hi,n.sc,n.mn,u],[Math.ceil(s/8),Math.ceil(i/8),1]),r.push(o,u),u}recMM(e,r,t,n,s,a,i,o){return n&&n.q3?this.recMatmulQ3(e,r,t,n,s,a,i):n&&n.nib?this.recMatmulQ4(e,r,t,n,s,a,i):n&&n.codes?this.recMatmulQ8(e,r,t,n,s,a,i):this.recMatmulT(e,r,t,n,s,a,i,o)}recRmsnorm(e,r,t,n,s,a,i,o=!1){let u=this.uniform([s,a,0,o?1:0],{offset:8,value:i}),c=this.storage(s*a*4);return this.rmsVecOk&&s<=65535?this.recordPass(e,"rmsnorm_vec",[u,t,n,c],[s,1,1]):this.recordPass(e,"rmsnorm",[u,t,n,c],[Math.ceil(s/ee),1,1]),r.push(u,c),c}recRope(e,r,t,n,s,a,i,o,u=!1){let c=this.uniform([n,s,a,i],{offset:16,value:o});this.device.queue.writeBuffer(c,20,new Uint32Array([u?1:0]));let l=this.storage(n*s*4);return this.recordPass(e,"rope",[c,t,l],[Math.ceil(n/ee),1,1]),r.push(c,l),l}recRopeMrope(e,r,t,n,s,a,i,o,u){let c=u[0],l=u[0]+u[1],d=this.uniform([s,a,i,c,l],{offset:20,value:o}),g=this.storage(s*a*4);return this.recordPass(e,"rope_mrope",[d,t,n,g],[Math.ceil(s/ee),1,1]),r.push(d,g),g}preparePositions(e,r){if(e.positions&&e.mropeSections){let t=this.storage(e.positions.byteLength);this.device.queue.writeBuffer(t,0,e.positions),r.push(t),e._posGpu=t}if(e.ropeFactors){let t=this.storage(e.ropeFactors.byteLength);this.device.queue.writeBuffer(t,0,e.ropeFactors),r.push(t),e._ffGpu=t}}recRope2d(e,r,t,n,s,a,i,o){let u=this.uniform([s,a,i,0],{offset:16,value:o}),c=this.storage(s*a*4);return this.recordPass(e,"rope_2d",[u,t,n,c],[Math.ceil(s/ee),1,1]),r.push(u,c),c}recRopeFactors(e,r,t,n,s,a,i,o,u,c=!1){let l=this.uniform([s,a,i,o],{offset:16,value:u});this.device.queue.writeBuffer(l,20,new Uint32Array([c?1:0]));let d=this.storage(s*a*4);return this.recordPass(e,"rope_factors",[l,t,n,d],[Math.ceil(s/ee),1,1]),r.push(l,d),d}recAttention(e,r,t,n,s,a,i,o,u,c,l,d,g=0,p=0){let h=this.attnUniform(a,i,o,u,c,l,d??1/Math.sqrt(u),g,p),b=this.storage(a*i*u*4);return this.attnDecodeOk&&a*i<256&&u<=128?this.recordPass(e,"attention_decode",[h,t,n,s,b],[a*i,1,1]):this.recordPass(e,"attention",[h,t,n,s,b],[Math.ceil(a*i/ee),1,1]),r.push(h,b),b}recQuantizeKv(e,r,t,n,s,a,i,o,u){let c=this.uniform([a,i,o,u]);this.recordPass(e,"quantize_kv",[c,t,n,s],this.grid1D(a*i)),r.push(c)}recAttentionQ8(e,r,t,n,s,a,i,o,u,c,l,d,g,p,h=0,b=0){let k=this.attnUniform(o,u,c,l,d,g,p??1/Math.sqrt(l),h,b),B=this.storage(o*u*l*4);return this.attnDecodeOk&&o*u<256&&l<=128?this.recordPass(e,"attention_decode_q8kv",[k,t,n,s,a,i,B],[o*u,1,1]):this.recordPass(e,"attention_q8kv",[k,t,n,s,a,i,B],[Math.ceil(o*u/ee),1,1]),r.push(k,B),B}recAddBias(e,r,t,n,s,a){let i=this.uniform([s,a]),o=this.storage(s*a*4);return this.recordPass(e,"addbias",[i,t,n,o],this.grid1D(s*a)),r.push(i,o),o}recBinary(e,r,t,n,s,a){let i=this.storage(a*4);return this.recordPass(e,t,[n,s,i],this.grid1D(a)),r.push(i),i}recLfm2ShortConv(e,r,t,n,s,a,i){let o=this.uniform([a,i]),u=this.storage(a*4);return this.recordPass(e,"lfm2_shortconv",[o,t,s,n,u],this.grid1D(a)),r.push(o,u),u}recordLayerKV(e,r,t,n,s,a,i){let o=i.k,u=i.v,{seq:c,d:l,nHeads:d,nKvHeads:g,headDim:p,ffn:h,ropeTheta:b,eps:k}=n,B=g*p,M=a+c,F=s.matF16===!0,C=d*p,j=n.rmsGainOnePlus===!0,A=n.attnLogitSoftcap??0,v=n.act==="gelu"?"geglu":"swiglu",m=this.recRmsnorm(e,r,t,s.attnNorm,c,l,k,j),y=this.recMM(e,r,m,s.wq,c,l,C,F),_=this.recMM(e,r,m,s.wk,c,l,B,F),w=this.recMM(e,r,m,s.wv,c,l,B,F);s.bq&&(y=this.recAddBias(e,r,y,s.bq,c,C)),s.bk&&(_=this.recAddBias(e,r,_,s.bk,c,B)),s.bv&&(w=this.recAddBias(e,r,w,s.bv,c,B)),s.qNorm&&(y=this.recRmsnorm(e,r,y,s.qNorm,c*d,p,k,j)),s.kNorm&&(_=this.recRmsnorm(e,r,_,s.kNorm,c*g,p,k,j));let P=n._posGpu,U=n._ffGpu,x=n.ropeInterleaved===!0,G=(W,S,L)=>n.skipRope?W:P?this.recRopeMrope(e,r,W,P,S,p,L,b,n.mropeSections):U?this.recRopeFactors(e,r,W,U,S,p,L,a,b,x):this.recRope(e,r,W,S,p,L,a,b,x),q=G(y,c*d,d),T=G(_,c*g,g),R;if(i.kScale)this.recQuantizeKv(e,r,T,o,i.kScale,c,g,p,a),this.recQuantizeKv(e,r,w,u,i.vScale,c,g,p,a),R=this.recAttentionQ8(e,r,q,o,i.kScale,u,i.vScale,c,d,g,p,M,a,n.attnScale,A,n.window??0);else{let W=B*4;e.copyBufferToBuffer(T,0,o,a*W,c*W),e.copyBufferToBuffer(w,0,u,a*W,c*W),R=this.recAttention(e,r,q,o,u,c,d,g,p,M,a,n.attnScale,A,n.window??0)}let O=this.recMM(e,r,R,s.wo,c,C,l,F);s.postAttnNorm&&(O=this.recRmsnorm(e,r,O,s.postAttnNorm,c,l,k,j));let D=this.recBinary(e,r,"add",t,O,c*l),H=this.recRmsnorm(e,r,D,s.ffnNorm,c,l,k,j),Q=this.recMM(e,r,H,s.wgate,c,l,h,F),$=this.recMM(e,r,H,s.wup,c,l,h,F),V=this.recBinary(e,r,v,Q,$,c*h),I=this.recMM(e,r,V,s.wdown,c,h,l,F);return s.postFfnNorm&&(I=this.recRmsnorm(e,r,I,s.postFfnNorm,c,l,k,j)),this.recBinary(e,r,"add",D,I,c*l)}setKvQuant(e){this.kvQuant!==e&&(this.kvQuant=e,this.resetKvGpu())}resetKvGpu(){for(let e of this.kvGpu.values())e.k.destroy?.(),e.v.destroy?.(),e.kScale?.destroy?.(),e.vScale?.destroy?.();this.kvGpu.clear(),this.kvSession="";for(let e of this.bufferPool.values())for(let r of e)r.destroy?.();this.bufferPool.clear()}clearKvCache(){this.resetKvGpu()}ensureKv(e,r,t,n){let s=this.kvGpu.get(e);if(s&&s.cap>=r)return s;let a=Math.max(r,(s?.cap??0)+1024,1024),i=this.kvQuant,o=this.storage(a*t*(i?1:4)),u=this.storage(a*t*(i?1:4)),c=i?this.storage(a*n*4):void 0,l=i?this.storage(a*n*4):void 0;if(s){let g=this.device.createCommandEncoder();g.copyBufferToBuffer(s.k,0,o,0,s.cap*t*(i?1:4)),g.copyBufferToBuffer(s.v,0,u,0,s.cap*t*(i?1:4)),i&&s.kScale&&(g.copyBufferToBuffer(s.kScale,0,c,0,s.cap*n*4),g.copyBufferToBuffer(s.vScale,0,l,0,s.cap*n*4)),this.device.queue.submit([g.finish()]),s.k.destroy?.(),s.v.destroy?.(),s.kScale?.destroy?.(),s.vScale?.destroy?.()}let d={k:o,v:u,cap:a,kScale:c,vScale:l};return this.kvGpu.set(e,d),d}async runDecodeGpu(e,r,t,n,s,a){let{seq:i,d:o,nKvHeads:u,headDim:c,eps:l}=r,d=u*c,g=n+i;(a!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${a}" inconnue avec pastLen=${n} \u2014 cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=a);for(let F=0;F<t.length;F++)this.ensureKv(F,g,d,u);let p=[];this.preparePositions(r,p);let h=this.device.createCommandEncoder(),b=this.storage(e.byteLength);this.device.queue.writeBuffer(b,0,e),p.push(b);for(let F=0;F<t.length;F++){let C=this.kvGpu.get(F);b=this.recordLayerKV(h,p,b,lt(r,i,F,this.swaOk),t[F],n,C)}let k=this.recRmsnorm(h,p,b,s,i,o,l,r.rmsGainOnePlus===!0),B=this.storage(o*4);h.copyBufferToBuffer(k,(i-1)*o*4,B,0,o*4),this.device.queue.submit([h.finish()]);let M=await this.readBack(B,o*4);return p.push(B),this.release(p),M}async decodeLogitsQ8(e,r,t,n,s,a,i,o){let u=globalThis,{seq:c,d:l,nKvHeads:d,headDim:g,eps:p}=r,h=d*g,b=n+c;(a!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${a}" inconnue avec pastLen=${n} \u2014 cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=a);for(let m=0;m<t.length;m++)this.ensureKv(m,b,h,d);let k=[];this.preparePositions(r,k);let B=this.device.createCommandEncoder(),M=this.storage(e.byteLength);this.device.queue.writeBuffer(M,0,e),k.push(M);for(let m=0;m<t.length;m++){let y=this.kvGpu.get(m);M=this.recordLayerKV(B,k,M,lt(r,c,m,this.swaOk),t[m],n,y)}let F=this.recRmsnorm(B,k,M,s,c,l,p,r.rmsGainOnePlus===!0),C=this.storage(l*4);B.copyBufferToBuffer(F,(c-1)*l*4,C,0,l*4),k.push(C);let j=this.storage(o*4);k.push(j);for(let m of i){let y=this.recMM(B,k,C,m.w,1,l,m.rows,!1);B.copyBufferToBuffer(y,0,j,m.r0*4,m.rows*4)}let A=this.device.createBuffer({size:o*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});B.copyBufferToBuffer(j,0,A,0,o*4),this.device.queue.submit([B.finish()]),await A.mapAsync(u.GPUMapMode.READ);let v=new Float32Array(A.getMappedRange().slice(0));return A.unmap(),A.destroy(),this.release(k),v}async decodeTopKQ8(e,r,t,n,s,a,i,o,u,c,l,d=64){let g=globalThis,{seq:p,d:h,nKvHeads:b,headDim:k,eps:B}=r,M=b*k,F=n+p;(a!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${a}" inconnue avec pastLen=${n} \u2014 cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=a);for(let G=0;G<t.length;G++)this.ensureKv(G,F,M,b);let C=X.timingOn?(G,q)=>console.info(`[timing:gpu] ${G} ${(performance.now()-q).toFixed(0)} ms`):null,j=performance.now(),A=[];this.preparePositions(r,A);let v=this.device.createCommandEncoder(),m=this.storage(e.byteLength);this.device.queue.writeBuffer(m,0,e),A.push(m);for(let G=0;G<t.length;G++){let q=this.kvGpu.get(G);m=this.recordLayerKV(v,A,m,lt(r,p,G,this.swaOk),t[G],n,q)}let y=this.recRmsnorm(v,A,m,s,p,h,B,r.rmsGainOnePlus===!0),_=this.storage(h*4);v.copyBufferToBuffer(y,(p-1)*h*4,_,0,h*4),A.push(_);let w=this.storage(o*4);A.push(w);for(let G of i){let q=this.recMM(v,A,_,G.w,1,h,G.rows,!1);v.copyBufferToBuffer(q,0,w,G.r0*4,G.rows*4)}if(l&&l>0){let G=this.uniform([o],{offset:4,value:l});this.recordPass(v,"softcap_logits",[G,w],this.grid1D(o)),A.push(G)}if(c&&c!==1&&u.length){let G=Uint32Array.from(u),q=this.bufU32(G,g.GPUBufferUsage.STORAGE|g.GPUBufferUsage.COPY_DST),T=this.uniform([G.length],{offset:4,value:c});this.recordPass(v,"penalize_logits",[T,q,w],this.grid1D(G.length)),A.push(T,q)}let P=this.storage(d*2*4);A.push(P);{let G=this.uniform([o,d]);this.recordPass(v,this.topKParOk?"top_k_par":"top_k",[G,w,P],[1,1,1]),A.push(G)}let U=this.device.createBuffer({size:d*2*4,usage:g.GPUBufferUsage.COPY_DST|g.GPUBufferUsage.MAP_READ});v.copyBufferToBuffer(P,0,U,0,d*2*4),C?.("enregistrement des passes (compilation des pipelines incluse)",j),j=performance.now(),this.device.queue.submit([v.finish()]),await U.mapAsync(g.GPUMapMode.READ),C?.("execution GPU (submit + readback)",j);let x=new Uint32Array(U.getMappedRange().slice(0));return U.unmap(),U.destroy(),this.release(A),{ids:x.slice(0,d),vals:new Float32Array(x.buffer,d*4,d)}}resetLfm2State(){for(let e of this.lfm2KvGpu.values())e.k.destroy?.(),e.v.destroy?.();for(let e of this.lfm2ConvGpu.values())e.destroy?.();this.lfm2KvGpu.clear(),this.lfm2ConvGpu.clear(),this.lfm2Session="";for(let e of this.bufferPool.values())for(let r of e)r.destroy?.();this.bufferPool.clear()}clearLfm2State(){this.resetLfm2State()}ensureLfm2Kv(e,r,t){let n=this.lfm2KvGpu.get(e);if(n&&n.cap>=r)return n;let s=Math.max(r,(n?.cap??0)+1024,1024),a=this.storage(s*t*4),i=this.storage(s*t*4);if(n){let u=this.device.createCommandEncoder();u.copyBufferToBuffer(n.k,0,a,0,n.cap*t*4),u.copyBufferToBuffer(n.v,0,i,0,n.cap*t*4),this.device.queue.submit([u.finish()]),n.k.destroy?.(),n.v.destroy?.()}let o={k:a,v:i,cap:s};return this.lfm2KvGpu.set(e,o),o}ensureLfm2Conv(e,r){let t=this.lfm2ConvGpu.get(e);return t||(t=this.storage(r*4),this.device.queue.writeBuffer(t,0,new Float32Array(r)),this.lfm2ConvGpu.set(e,t)),t}recLfm2ShortConvBatch(e,r,t,n,s,a,i,o){let u=this.uniform([a,i,o]),c=this.storage(o*a*4);this.recordPass(e,"lfm2_shortconv_batch",[u,t,s,n,c],this.grid1D(o*a));let l=this.uniform([a,i,o]);return this.recordPass(e,"lfm2_shortconv_state",[l,t,n],this.grid1D((i-1)*a)),r.push(u,l,c),c}recordLfm2(e,r,t,n,s,a,i,o){let{D:u,nHeads:c,nKvHeads:l,headDim:d,ffn:g,eps:p,theta:h,lc:b}=s,k=l*d,B=c*d,M=k*4;for(let C=0;C<a.length;C++)a[C].conv?this.ensureLfm2Conv(C,(b-1)*u):this.ensureLfm2Kv(C,o+n,k);if(n>=b-1&&this.lfm2BatchOk){let C=this.storage(n*u*4);this.device.queue.writeBuffer(C,0,t),r.push(C);for(let A=0;A<a.length;A++){let v=a[A],m=this.recRmsnorm(e,r,C,v.attnNorm,n,u,p),y;if(v.conv){let G=this.recMM(e,r,m,v.inProj,n,u,3*u,!1),q=this.recLfm2ShortConvBatch(e,r,G,this.lfm2ConvGpu.get(A),v.convW,u,b,n);y=this.recMM(e,r,q,v.outProj,n,u,u,!1)}else{let G=this.recMM(e,r,m,v.wq,n,u,B,!1),q=this.recMM(e,r,m,v.wk,n,u,k,!1),T=this.recMM(e,r,m,v.wv,n,u,k,!1);G=this.recRmsnorm(e,r,G,v.qNorm,n*c,d,p),q=this.recRmsnorm(e,r,q,v.kNorm,n*l,d,p),G=this.recRope(e,r,G,n*c,d,c,o,h),q=this.recRope(e,r,q,n*l,d,l,o,h);let R=this.lfm2KvGpu.get(A);e.copyBufferToBuffer(q,0,R.k,o*M,n*M),e.copyBufferToBuffer(T,0,R.v,o*M,n*M);let O=this.recAttention(e,r,G,R.k,R.v,n,c,l,d,o+n,o);y=this.recMM(e,r,O,v.wo,n,B,u,!1)}C=this.recBinary(e,r,"add",C,y,n*u);let _=this.recRmsnorm(e,r,C,v.ffnNorm,n,u,p),w=this.recMM(e,r,_,v.wgate,n,u,g,!1),P=this.recMM(e,r,_,v.wup,n,u,g,!1),U=this.recBinary(e,r,"swiglu",w,P,n*g),x=this.recMM(e,r,U,v.wdown,n,g,u,!1);C=this.recBinary(e,r,"add",C,x,n*u)}let j=this.storage(u*4);return r.push(j),e.copyBufferToBuffer(C,(n-1)*u*4,j,0,u*4),this.recRmsnorm(e,r,j,i,1,u,p)}let F=null;for(let C=0;C<n;C++){let j=o+C,A=this.storage(u*4);this.device.queue.writeBuffer(A,0,t.subarray(C*u,(C+1)*u)),r.push(A);for(let v=0;v<a.length;v++){let m=a[v],y=this.recRmsnorm(e,r,A,m.attnNorm,1,u,p),_;if(m.conv){let q=this.recMM(e,r,y,m.inProj,1,u,3*u,!1),T=this.recLfm2ShortConv(e,r,q,this.lfm2ConvGpu.get(v),m.convW,u,b);_=this.recMM(e,r,T,m.outProj,1,u,u,!1)}else{let q=this.recMM(e,r,y,m.wq,1,u,B,!1),T=this.recMM(e,r,y,m.wk,1,u,k,!1),R=this.recMM(e,r,y,m.wv,1,u,k,!1);q=this.recRmsnorm(e,r,q,m.qNorm,c,d,p),T=this.recRmsnorm(e,r,T,m.kNorm,l,d,p),q=this.recRope(e,r,q,c,d,c,j,h),T=this.recRope(e,r,T,l,d,l,j,h);let O=this.lfm2KvGpu.get(v);e.copyBufferToBuffer(T,0,O.k,j*M,M),e.copyBufferToBuffer(R,0,O.v,j*M,M);let D=this.recAttention(e,r,q,O.k,O.v,1,c,l,d,j+1,j);_=this.recMM(e,r,D,m.wo,1,B,u,!1)}A=this.recBinary(e,r,"add",A,_,u);let w=this.recRmsnorm(e,r,A,m.ffnNorm,1,u,p),P=this.recMM(e,r,w,m.wgate,1,u,g,!1),U=this.recMM(e,r,w,m.wup,1,u,g,!1),x=this.recBinary(e,r,"swiglu",P,U,g),G=this.recMM(e,r,x,m.wdown,1,g,u,!1);A=this.recBinary(e,r,"add",A,G,u)}C===n-1&&(F=this.recRmsnorm(e,r,A,i,1,u,p))}return F}lfm2SessionReset(e,r){(e!==this.lfm2Session||r===0)&&(r>0&&console.error(`[lfm2] session "${e}" inconnue avec pastLen=${r} \u2014 \xE9tat perdu, sortie invalide. Repartir de pastLen 0.`),this.resetLfm2State(),this.lfm2Session=e)}async lfm2PrefillGpu(e,r,t,n,s,a,i){this.lfm2SessionReset(i,a);let o=[],u=this.device.createCommandEncoder();this.recordLfm2(u,o,e,r,t,n,s,a),this.device.queue.submit([u.finish()]),await this.device.queue.onSubmittedWorkDone(),this.release(o)}async lfm2LogitsGpu(e,r,t,n,s,a,i,o){let u=globalThis;this.lfm2SessionReset(o,i);let c=[],l=this.device.createCommandEncoder(),d=this.recordLfm2(l,c,e,r,t,n,a,i),g=this.recMM(l,c,d,s,1,t.D,t.vocab,!1),p=this.device.createBuffer({size:t.vocab*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});l.copyBufferToBuffer(g,0,p,0,t.vocab*4),this.device.queue.submit([l.finish()]),await p.mapAsync(u.GPUMapMode.READ);let h=new Float32Array(p.getMappedRange().slice(0));return p.unmap(),p.destroy(),this.release(c),h}async lfm2TopKGpu(e,r,t,n,s,a,i,o,u,c,l=64){let d=globalThis;this.lfm2SessionReset(o,i);let g=[],p=this.device.createCommandEncoder(),h=this.recordLfm2(p,g,e,r,t,n,a,i),b=this.recMM(p,g,h,s,1,t.D,t.vocab,!1);if(c&&c!==1&&u.length){let F=Uint32Array.from(u),C=this.bufU32(F,d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST),j=this.uniform([F.length],{offset:4,value:c});this.recordPass(p,"penalize_logits",[j,C,b],this.grid1D(F.length)),g.push(j,C)}let k=this.storage(l*2*4);g.push(k);{let F=this.uniform([t.vocab,l]);this.recordPass(p,this.topKParOk?"top_k_par":"top_k",[F,b,k],[1,1,1]),g.push(F)}let B=this.device.createBuffer({size:l*2*4,usage:d.GPUBufferUsage.COPY_DST|d.GPUBufferUsage.MAP_READ});p.copyBufferToBuffer(k,0,B,0,l*2*4),this.device.queue.submit([p.finish()]),await B.mapAsync(d.GPUMapMode.READ);let M=new Uint32Array(B.getMappedRange().slice(0));return B.unmap(),B.destroy(),this.release(g),{ids:M.slice(0,l),vals:new Float32Array(M.buffer,l*4,l)}}resetRwkvState(){for(let e of this.rwkvStateGpu.values())e.S.destroy?.(),e.tm.destroy?.(),e.cm.destroy?.();this.rwkvStateGpu.clear(),this.rwkvVFirst?.destroy?.(),this.rwkvVFirst=null,this.rwkvSession="";for(let e of this.bufferPool.values())for(let r of e)r.destroy?.();this.bufferPool.clear()}clearRwkvState(){this.resetRwkvState()}ensureRwkvState(e,r,t,n){let s=this.rwkvStateGpu.get(e);if(!s){let a=this.storage(t*n*n*4),i=this.storage(r*4),o=this.storage(r*4);this.device.queue.writeBuffer(a,0,new Float32Array(t*n*n)),this.device.queue.writeBuffer(i,0,new Float32Array(r)),this.device.queue.writeBuffer(o,0,new Float32Array(r)),s={S:a,tm:i,cm:o},this.rwkvStateGpu.set(e,s)}return s}rwkvSessionReset(e,r){(e!==this.rwkvSession||r===0)&&(r>0&&console.error(`[rwkv] session "${e}" inconnue avec pastLen=${r} \u2014 \xE9tat perdu, sortie invalide. Repartir de pastLen 0.`),this.resetRwkvState(),this.rwkvSession=e)}recRwkvToken(e,r,t,n,s,a){let{D:i,H:o,NH:u}=n,c=1e-5,l=64e-5;for(let d=0;d<s.length;d++){let g=s[d],p=this.rwkvStateGpu.get(d),h=this.recLayernorm(e,r,t,g.attnNormW,g.attnNormB,1,i,c),b=this.storage(6*i*4);{let L=this.uniform([i]);this.recordPass(e,"rwkv_token_shift",[L,h,p.tm,g.lerpFused,b],this.grid1D(6*i)),r.push(L,b)}e.copyBufferToBuffer(h,0,p.tm,0,i*4);let k=L=>{let K=this.storage(i*4);return e.copyBufferToBuffer(b,L*i*4,K,0,i*4),r.push(K),K},B=k(0),M=k(1),F=k(2),C=k(3),j=k(4),A=k(5),v=this.recMM(e,r,B,g.R,1,i,i,!1),m=this.recMM(e,r,F,g.K,1,i,i,!1),y=this.recMM(e,r,C,g.V,1,i,i,!1),_=this.recUnary(e,r,"tanh_act",this.recMM(e,r,M,g.w1,1,i,g.rw,!1),g.rw),w=this.recMM(e,r,_,g.w2,1,g.rw,i,!1),P=this.storage(i*4);this.recordPass(e,"rwkv_decay",[g.w0,w,P],this.grid1D(i)),r.push(P);let U=this.recMM(e,r,this.recMM(e,r,j,g.a1,1,i,g.ra,!1),g.a2,1,g.ra,i,!1),x=this.storage(i*4);this.recordPass(e,"rwkv_bias_sigmoid",[g.a0,U,x],this.grid1D(i)),r.push(x);let G=this.recUnary(e,r,"sigmoid",this.recMM(e,r,A,g.g1,1,i,g.rg,!1),g.rg),q=this.recMM(e,r,G,g.g2,1,g.rg,i,!1);if(d===0)e.copyBufferToBuffer(y,0,a,0,i*4);else{let L=this.recMM(e,r,this.recMM(e,r,C,g.v1,1,i,g.rv,!1),g.v2,1,g.rv,i,!1);this.recordPass(e,"rwkv_vresid",[y,a,g.v0,L],this.grid1D(i))}let T=this.storage(i*4),R=this.storage(i*4),O=this.storage(i*4);{let L=this.uniform([u,o]);this.recordPass(e,"rwkv_kprep",[L,m,x,g.kk,g.ka,T,R,O],this.grid1D(u)),r.push(L,T,R,O)}let D=this.storage(i*4);{let L=this.uniform([u,o]);this.recordPass(e,"rwkv_wkv7",[L,v,P,T,y,R,O,p.S,D],this.grid1D(u*o)),r.push(L,D)}let H=this.storage(i*4);{let L=this.uniform([u,o],{offset:8,value:l});this.recordPass(e,"rwkv_out_gn",[L,D,v,T,g.rk,y,g.lnWB,H],this.grid1D(u)),r.push(L,H)}let Q=this.recBinary(e,r,"mul",H,q,i),$=this.recMM(e,r,Q,g.O,1,i,i,!1);t=this.recBinary(e,r,"add",t,$,i);let V=this.recLayernorm(e,r,t,g.attnNorm2W,g.attnNorm2B,1,i,c),I=this.storage(i*4);this.recordPass(e,"rwkv_lerp",[V,p.cm,g.lerpK,I],this.grid1D(i)),r.push(I),e.copyBufferToBuffer(V,0,p.cm,0,i*4);let W=this.recUnary(e,r,"sqrelu",this.recMM(e,r,I,g.cmK,1,i,g.ffn,!1),g.ffn),S=this.recMM(e,r,W,g.cmV,1,g.ffn,i,!1);t=this.recBinary(e,r,"add",t,S,i)}return t}recordRwkv(e,r,t,n,s,a,i){let{D:o,H:u,NH:c}=s;for(let d=0;d<a.length;d++)this.ensureRwkvState(d,o,c,u);this.rwkvVFirst||(this.rwkvVFirst=this.storage(o*4));let l=null;for(let d=0;d<n;d++){let g=this.storage(o*4);this.device.queue.writeBuffer(g,0,t.subarray(d*o,(d+1)*o)),r.push(g);let p=this.recLayernorm(e,r,g,i.tokW,i.tokB,1,o,1e-5),h=this.recRwkvToken(e,r,p,s,a,this.rwkvVFirst);d===n-1&&(l=this.recLayernorm(e,r,h,i.outW,i.outB,1,o,1e-5))}return l}async rwkvPrefillGpu(e,r,t,n,s,a,i){this.rwkvSessionReset(i,a);let o=[],u=this.device.createCommandEncoder();this.recordRwkv(u,o,e,r,t,n,s),this.device.queue.submit([u.finish()]),await this.device.queue.onSubmittedWorkDone(),this.release(o)}async rwkvLogitsGpu(e,r,t,n,s,a,i,o){let u=globalThis;this.rwkvSessionReset(o,i);let c=[],l=this.device.createCommandEncoder(),d=this.recordRwkv(l,c,e,r,t,n,a),g=this.recMM(l,c,d,s,1,t.D,t.vocab,!1),p=this.device.createBuffer({size:t.vocab*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});l.copyBufferToBuffer(g,0,p,0,t.vocab*4),this.device.queue.submit([l.finish()]),await p.mapAsync(u.GPUMapMode.READ);let h=new Float32Array(p.getMappedRange().slice(0));return p.unmap(),p.destroy(),this.release(c),h}async rwkvTopKGpu(e,r,t,n,s,a,i,o,u,c,l=64){let d=globalThis;this.rwkvSessionReset(o,i);let g=[],p=this.device.createCommandEncoder(),h=this.recordRwkv(p,g,e,r,t,n,a),b=this.recMM(p,g,h,s,1,t.D,t.vocab,!1);if(c&&c!==1&&u.length){let F=Uint32Array.from(u),C=this.bufU32(F,d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST),j=this.uniform([F.length],{offset:4,value:c});this.recordPass(p,"penalize_logits",[j,C,b],this.grid1D(F.length)),g.push(j,C)}let k=this.storage(l*2*4);g.push(k);{let F=this.uniform([t.vocab,l]);this.recordPass(p,this.topKParOk?"top_k_par":"top_k",[F,b,k],[1,1,1]),g.push(F)}let B=this.device.createBuffer({size:l*2*4,usage:d.GPUBufferUsage.COPY_DST|d.GPUBufferUsage.MAP_READ});p.copyBufferToBuffer(k,0,B,0,l*2*4),this.device.queue.submit([p.finish()]),await B.mapAsync(d.GPUMapMode.READ);let M=new Uint32Array(B.getMappedRange().slice(0));return B.unmap(),B.destroy(),this.release(g),{ids:M.slice(0,l),vals:new Float32Array(M.buffer,l*4,l)}}async argmaxProjection(e,r,t,n,s=!1){let a=globalThis,i=[],o=this.device.createCommandEncoder(),u=this.storage(e.byteLength);this.device.queue.writeBuffer(u,0,e),i.push(u);let c=this.storage(n*4);i.push(c);for(let h of r){let b=this.recMatmulT(o,i,u,h.buf,1,t,h.rows,s);o.copyBufferToBuffer(b,0,c,h.r0*4,h.rows*4)}let l=this.storage(4),d=this.uniform([n]);i.push(l,d),this.recordPass(o,"argmax",[d,c,l],[1,1,1]);let g=this.device.createBuffer({size:4,usage:a.GPUBufferUsage.COPY_DST|a.GPUBufferUsage.MAP_READ});o.copyBufferToBuffer(l,0,g,0,4),this.device.queue.submit([o.finish()]),await g.mapAsync(a.GPUMapMode.READ);let p=new Uint32Array(g.getMappedRange().slice(0))[0];return g.unmap(),g.destroy(),this.release(i),p}async projectLogits(e,r,t,n,s=!1){let a=globalThis,i=[],o=this.device.createCommandEncoder(),u=this.storage(e.byteLength);this.device.queue.writeBuffer(u,0,e),i.push(u);let c=this.storage(n*4);i.push(c);for(let g of r){let p=this.recMatmulT(o,i,u,g.buf,1,t,g.rows,s);o.copyBufferToBuffer(p,0,c,g.r0*4,g.rows*4)}let l=this.device.createBuffer({size:n*4,usage:a.GPUBufferUsage.COPY_DST|a.GPUBufferUsage.MAP_READ});o.copyBufferToBuffer(c,0,l,0,n*4),this.device.queue.submit([o.finish()]),await l.mapAsync(a.GPUMapMode.READ);let d=new Float32Array(l.getMappedRange().slice(0));return l.unmap(),l.destroy(),this.release(i),d}async selfValidate(){this.validationFailure=null;let e=A=>(this.validationFailure=A,console.error("[selfValidate] FAILED at:",A,"(hasF16="+this.hasF16+")"),!1),r=(A,v)=>A.length===v.length&&A.every((m,y)=>Math.abs(m-v[y])<.001),t=A=>Float32Array.from({length:A},()=>Math.random()*2-1),n=3,s=4,a=5,i=t(n*s),o=t(s*a),u=new Float32Array(n*a);for(let A=0;A<n;A++)for(let v=0;v<a;v++){let m=0;for(let y=0;y<s;y++)m+=i[A*s+y]*o[y*a+v];u[A*a+v]=m}if(!r(await this.matmul(i,o,n,s,a),u))return e("matmul");{let A=(m,y,_,w,P)=>{let U=new Float32Array(_*P);for(let x=0;x<_;x++)for(let G=0;G<P;G++){let q=0;for(let T=0;T<w;T++)q+=m[x*w+T]*y[G*w+T];U[x*P+G]=q}return U},v=async(m,y,_)=>{let w=t(m*y),P=t(_*y);return r(await this.matmulT(w,P,m,y,_),A(w,P,m,y,_))};if(!await v(3,8,5))return e("matmulT.vec4(3,8,5)");if(!await v(1,16,7))return e("matmulT.vec4(1,16,7)");if(!await v(2,6,4))return e("matmulT.scalar(2,6,4)");if(this.hasF16){let w=t(16),P=t(112),U=this.uploadGpuF16(P),x=await this.matmulT(w,U,1,16,7,!0),G=new Float32Array(7);for(let D=0;D<7;D++){let H=0;for(let Q=0;Q<16;Q++)H+=w[Q]*P[D*16+Q];G[D]=H}U.destroy?.();let q=D=>D.length===G.length&&D.every((H,Q)=>Math.abs(H-G[Q])<=.03*(1+Math.abs(G[Q])));if(!q(x))return e("matmulT.f16");let T=this.uploadGpu(P),R=this.f32ToF16Gpu(T,112),O=await this.matmulT(w,R,1,16,7,!0);if(T.destroy?.(),R.destroy?.(),!q(O))return e("packf16")}if(this.hasF16&&this.f16SharedOk){let m=[{m:20,k:128,n:18},{m:32,k:64,n:64},{m:70,k:40,n:130},{m:33,k:48,n:7}];for(let y of m){let _=t(y.m*y.k),w=t(y.n*y.k),P=this.uploadGpuF16(w),U=await this.matmulT(_,P,y.m,y.k,y.n,!0);this.f16SharedOk=!1;let x=await this.matmulT(_,P,y.m,y.k,y.n,!0);if(this.f16SharedOk=!0,P.destroy?.(),!(U.length===x.length&&U.every((q,T)=>Math.abs(q-x[T])<=.001*(1+Math.abs(x[T]))))){this.f16SharedOk=!1,console.warn(`[selfValidate] matmul_t_f16w_shared KO sur ce GPU (m=${y.m}, k=${y.k}, n=${y.n}) \u2014 repli sur matmul_t_f16w (plus lent, m\xEAme r\xE9sultat).`);break}}}}{let y=t(128),_=t(768),w=Te(_),P=this.uploadGpuRaw(w.nibbles),U=this.uploadGpuRaw(new Uint8Array(w.scales.buffer,w.scales.byteOffset,w.scales.byteLength)),x=this.uploadGpuRaw(new Uint8Array(w.mins.buffer,w.mins.byteOffset,w.mins.byteLength)),G=await this.matmulQ4(y,P,U,x,1,128,6),q=ge(w),T=new Float32Array(6);for(let Q=0;Q<6;Q++){let $=0;for(let V=0;V<128;V++)$+=y[V]*q[Q*128+V];T[Q]=$}if(P.destroy?.(),U.destroy?.(),x.destroy?.(),!r(G,T))return e("matmulQ4");let R=this.uploadGpu(_),O=this.f32ToQ4Gpu(R,768),D=await this.matmulQ4(y,O.nib,O.sc,O.mn,1,128,6);if(R.destroy?.(),O.nib.destroy?.(),O.sc.destroy?.(),O.mn.destroy?.(),!(D.length===T.length&&D.every((Q,$)=>Math.abs(Q-T[$])<=.06*(1+Math.abs(T[$]))+.02)))return e("quantize_q4")}{let y=t(640),_=t(768),w=Xt(_),P=this.uploadGpuRaw(new Uint8Array(w.lo.buffer,w.lo.byteOffset,w.lo.byteLength)),U=this.uploadGpuRaw(new Uint8Array(w.hi.buffer,w.hi.byteOffset,w.hi.byteLength)),x=this.uploadGpuRaw(new Uint8Array(w.scales.buffer,w.scales.byteOffset,w.scales.byteLength)),G=this.uploadGpuRaw(new Uint8Array(w.mins.buffer,w.mins.byteOffset,w.mins.byteLength)),q=await this.matmulQ3(y,P,U,x,G,5,128,6),T=We(w),R=new Float32Array(30);for(let O=0;O<5;O++)for(let D=0;D<6;D++){let H=0;for(let Q=0;Q<128;Q++)H+=y[O*128+Q]*T[D*128+Q];R[O*6+D]=H}if(P.destroy?.(),U.destroy?.(),x.destroy?.(),G.destroy?.(),!r(q,R))return e("matmulQ3")}{let y=t(640),_=t(768),w=Te(_),P=this.uploadGpuRaw(w.nibbles),U=this.uploadGpuRaw(new Uint8Array(w.scales.buffer,w.scales.byteOffset,w.scales.byteLength)),x=this.uploadGpuRaw(new Uint8Array(w.mins.buffer,w.mins.byteOffset,w.mins.byteLength)),G=await this.matmulQ4Tiled(y,P,U,x,5,128,6),q=ge(w),T=new Float32Array(30);for(let R=0;R<5;R++)for(let O=0;O<6;O++){let D=0;for(let H=0;H<128;H++)D+=y[R*128+H]*q[O*128+H];T[R*6+O]=D}if(P.destroy?.(),U.destroy?.(),x.destroy?.(),!r(G,T))return e("matmul_q4_tiled")}for(let A of[{m:20,n:18},{m:32,n:64},{m:70,n:130}]){let v=A.m,m=128,y=A.n,_=t(v*m),w=t(y*m),P=Te(w),U=this.uploadGpuRaw(P.nibbles),x=this.uploadGpuRaw(new Uint8Array(P.scales.buffer,P.scales.byteOffset,P.scales.byteLength)),G=this.uploadGpuRaw(new Uint8Array(P.mins.buffer,P.mins.byteOffset,P.mins.byteLength)),q=await this.matmulQ4Shared(_,U,x,G,v,m,y),T=ge(P),R=new Float32Array(v*y);for(let O=0;O<v;O++)for(let D=0;D<y;D++){let H=0;for(let Q=0;Q<m;Q++)H+=_[O*m+Q]*T[D*m+Q];R[O*y+D]=H}if(U.destroy?.(),x.destroy?.(),G.destroy?.(),!r(q,R))return e(`matmul_q4_shared(${v},${y})`)}{let y=t(128),_=t(768),w=Ce(_),P=this.uploadGpuRaw(new Uint8Array(w.codes.buffer,w.codes.byteOffset,w.codes.byteLength)),U=this.uploadGpuRaw(new Uint8Array(w.scales.buffer,w.scales.byteOffset,w.scales.byteLength)),x=await this.matmulQ8(y,P,U,1,128,6),G=ve(w),q=new Float32Array(6);for(let D=0;D<6;D++){let H=0;for(let Q=0;Q<128;Q++)H+=y[Q]*G[D*128+Q];q[D]=H}if(P.destroy?.(),U.destroy?.(),!r(x,q))return e("matmulQ8");let T=this.uploadGpu(_),R=this.f32ToQ8Gpu(T,768),O=await this.matmulQ8(y,R.codes,R.sc,1,128,6);if(T.destroy?.(),R.codes.destroy?.(),R.sc.destroy?.(),!r(O,q))return e("quantize_q8")}{let y=t(640),_=t(768),w=Ce(_),P=this.uploadGpuRaw(new Uint8Array(w.codes.buffer,w.codes.byteOffset,w.codes.byteLength)),U=this.uploadGpuRaw(new Uint8Array(w.scales.buffer,w.scales.byteOffset,w.scales.byteLength)),x=await this.matmulQ8Tiled(y,P,U,5,128,6),G=ve(w),q=new Float32Array(30);for(let T=0;T<5;T++)for(let R=0;R<6;R++){let O=0;for(let D=0;D<128;D++)O+=y[T*128+D]*G[R*128+D];q[T*6+R]=O}if(P.destroy?.(),U.destroy?.(),!r(x,q))return e("matmul_q8_tiled")}for(let A of[{k:128,n:6},{k:128,n:130},{k:4096,n:17}]){let v=A.k,m=A.n,y=t(v),_=t(m*v),w=Te(_),P=this.uploadGpuRaw(w.nibbles),U=this.uploadGpuRaw(new Uint8Array(w.scales.buffer,w.scales.byteOffset,w.scales.byteLength)),x=this.uploadGpuRaw(new Uint8Array(w.mins.buffer,w.mins.byteOffset,w.mins.byteLength)),G=await this.matmulQ4Vec(y,P,U,x,v,m),q=ge(w),T=new Float32Array(m);for(let V=0;V<m;V++){let I=0;for(let W=0;W<v;W++)I+=y[W]*q[V*v+W];T[V]=I}if(P.destroy?.(),U.destroy?.(),x.destroy?.(),!r(G,T))return e(`matmul_q4_vec(${v},${m})`);let R=Ce(_),O=this.uploadGpuRaw(new Uint8Array(R.codes.buffer,R.codes.byteOffset,R.codes.byteLength)),D=this.uploadGpuRaw(new Uint8Array(R.scales.buffer,R.scales.byteOffset,R.scales.byteLength)),H=await this.matmulQ8Vec(y,O,D,v,m),Q=ve(R),$=new Float32Array(m);for(let V=0;V<m;V++){let I=0;for(let W=0;W<v;W++)I+=y[W]*Q[V*v+W];$[V]=I}if(O.destroy?.(),D.destroy?.(),!r(H,$))return e(`matmul_q8_vec(${v},${m})`)}for(let A of[{m:20,n:18},{m:32,n:64},{m:70,n:130}]){let v=A.m,m=128,y=A.n,_=t(v*m),w=t(y*m),P=Ce(w),U=this.uploadGpuRaw(new Uint8Array(P.codes.buffer,P.codes.byteOffset,P.codes.byteLength)),x=this.uploadGpuRaw(new Uint8Array(P.scales.buffer,P.scales.byteOffset,P.scales.byteLength)),G=await this.matmulQ8Shared(_,U,x,v,m,y),q=ve(P),T=new Float32Array(v*y);for(let R=0;R<v;R++)for(let O=0;O<y;O++){let D=0;for(let H=0;H<m;H++)D+=_[R*m+H]*q[O*m+H];T[R*y+O]=D}if(U.destroy?.(),x.destroy?.(),!r(G,T))return e(`matmul_q8_shared(${v},${y})`)}{let v=t(1632),m=new Uint8Array(v.buffer,v.byteOffset,v.byteLength),y=(_,w)=>_.length===w.length&&_.every((P,U)=>P===w[U]);if(!y(await this.quantizeToBytes("F32",m,1632,"q8"),await this.quantizeToBytes("F32",m,1632,"q8",256)))return e("quantize_chunk_q8");if(!y(await this.quantizeToBytes("F32",m,1632,"q4"),await this.quantizeToBytes("F32",m,1632,"q4",256)))return e("quantize_chunk_q4")}let c=2,l=8,d=t(c*l),g=t(l),p=new Float32Array(c*l);for(let A=0;A<c;A++){let v=0;for(let y=0;y<l;y++)v+=d[A*l+y]**2;let m=1/Math.sqrt(v/l+1e-5);for(let y=0;y<l;y++)p[A*l+y]=d[A*l+y]*m*g[y]}if(!r(await this.rmsnorm(d,g,c,l),p))return e("rmsnorm");if(!r(await this.rmsnorm(d,g,c,l,1e-5,!0),Ge(d,g,c,l,1e-5,!0)))return e("rmsnorm.onePlus");let h=t(16),b=t(16),k=h.map((A,v)=>A/(1+Math.exp(-A))*b[v]);if(!r(await this.swiglu(h,b),k))return e("swiglu");let B=h.map((A,v)=>ar(A)*b[v]);if(!r(await this.geglu(h,b),B))return e("geglu");let M=h.map((A,v)=>A+b[v]);if(!r(await this.add(h,b),M))return e("add");{let A=X.MAX_WG_DIM*ee+257,v=new Float32Array(A),m=new Float32Array(A),y=[0,1,ee-1,ee,X.MAX_WG_DIM*ee-1,X.MAX_WG_DIM*ee,A-1];for(let P of y)v[P]=P%7-3,m[P]=P%5-2;let _=await this.add(v,m),w=_.length===A;for(let P of y)Math.abs(_[P]-(v[P]+m[P]))>1e-5&&(w=!1);if(!w)return e("grid1D.add(2D)")}let F=(A,v,m=.003)=>A.length===v.length&&A.every((y,_)=>Math.abs(y-v[_])<=m*(1+Math.abs(v[_])));{let w=t(8);if(!F(await this.rope(w,2,4,2,1,1e4),Le(w,2,4,2,1,1e4)))return e("rope")}{let w=t(384),P=new Float32Array(64/2).fill(1);if(!F(await this.ropeFactors(w,P,6,64,2,7,5e5),Le(w,6,64,2,7,5e5)))return e("rope_factors.ones");let U=Float32Array.from({length:64/2},(x,G)=>1+G%5*.7);if(!F(await this.ropeFactors(w,U,6,64,2,7,5e5),cn(w,U,6,64,2,7,5e5)))return e("rope_factors")}{let w=t(384);if(!F(await this.rope(w,6,64,2,7,5e5,!0),Ve(w,6,64,2,7,5e5)))return e("rope.interleaved");let P=t(8);if(!F(await this.rope(P,2,4,2,3,1e4,!0),Ve(P,2,4,2,3,1e4)))return e("rope.interleaved.hd4");let U=t(384);if(!F(await this.rope(U,6,64,2,0,5e5,!0),Ve(U,6,64,2,0,5e5)))return e("rope.interleaved.pos0");let x=64/2,G=new Float32Array(384);for(let D=0;D<6;D++)for(let H=0;H<x;H++)G[D*64+2*H]=w[D*64+H],G[D*64+2*H+1]=w[D*64+H+x];let q=await this.rope(G,6,64,2,7,5e5,!0),T=await this.rope(w,6,64,2,7,5e5,!1),R=new Float32Array(384);for(let D=0;D<6;D++)for(let H=0;H<x;H++)R[D*64+2*H]=T[D*64+H],R[D*64+2*H+1]=T[D*64+H+x];if(!F(q,R))return e("rope.interleaved.equivalence");let O=Float32Array.from({length:x},(D,H)=>1+H%5*.7);if(!F(await this.ropeFactors(w,O,6,64,2,7,5e5,!0),Ve(w,6,64,2,7,5e5,O)))return e("rope_factors.interleaved")}{let m=[16,24,24],y=1e6,_=3,w=_*2,P=5,U=t(w*128),x=new Uint32Array(_*3);for(let R=0;R<_;R++){let O=P+R;x.set([O,O,O],R*3)}let G=new Uint32Array([5,5,5,5,6,9,5,7,5]),q=F(await this.ropeMrope(U,x,w,128,2,m,y),Le(U,w,128,2,P,y)),T=F(await this.ropeMrope(U,G,w,128,2,m,y),un(U,G,w,128,2,m,y));(!q||!T)&&(this.mropeOk=!1,console.error(`[selfValidate] rope_mrope KO sur ce GPU (${q?"positions 3D":"d\xE9g\xE9n\xE9r\xE9\u2260rope"}) \u2014 vision d\xE9sactiv\xE9e, chat texte intact.`))}{let P=t(32),U=t(32),x=t(32);if(!F(await this.attention(P,U,x,2,4,2,4,2),ye(P,U,x,2,4,2,4,2)))return e("attention");let G=.3,q=5;if(!F(await this.attention(P,U,x,2,4,2,4,2,G,q),ye(P,U,x,2,4,2,4,2,G,q)))return e("attention.softcap");{let $=t(24),V=t(48),I=t(48);for(let W of[1,4,8,64]){if(!F(await this.attention($,V,I,3,2,1,4,9,void 0,0,W),ye($,V,I,3,2,1,4,9,void 0,0,W)))return e(`attention.window(${W})`);if(!F(await this.attentionDecode($,V,I,3,2,1,4,9,void 0,0,W),ye($,V,I,3,2,1,4,9,void 0,0,W)))return e(`attention_decode.window(${W})`)}}{let T=await this.quantizeKvReadback(U,4,2,4),R=await this.quantizeKvReadback(x,4,2,4),O=await this.attentionQ8Kv(P,T.codes,T.scales,R.codes,R.scales,2,4,2,4,2),D=(I,W)=>{let S=new Float32Array(32);for(let L=0;L<4;L++)for(let K=0;K<2;K++){let z=W[L*2+K];for(let Y=0;Y<4;Y++){let N=L*2*4+K*4+Y,E=I[N>>2]>>(N&3)*8&255;S[N]=(E<128?E:E-256)*z}}return S},H=D(T.codes,T.scales),Q=D(R.codes,R.scales),$=ye(P,H,Q,2,4,2,4,2);if(!F(O,$,.005))return e("attention.q8kv");let V=0;for(let I=0;I<U.length;I++)V=Math.max(V,Math.abs(H[I]-U[I]));if(V>.05)return e("quantize_kv.error")}}{let A=m=>{this.attnDecodeOk=!1,console.error("[selfValidate] attention d\xE9codage HS sur ce GPU (\xE9tape :",m,") \u2192 repli kernels classiques (plus lents \xE0 contexte long, corrects)")},v=[{nT:1,nH:14,nKv:2,hd:64,past:300},{nT:10,nH:14,nKv:2,hd:64,past:173}];for(let m of v){if(!this.attnDecodeOk)break;let y=m.past+m.nT,_=t(m.nT*m.nH*m.hd),w=t(y*m.nKv*m.hd),P=t(y*m.nKv*m.hd);if(!F(await this.attentionDecode(_,w,P,m.nT,m.nH,m.nKv,m.hd,m.past),ye(_,w,P,m.nT,m.nH,m.nKv,m.hd,m.past))){A(`decode(nT=${m.nT})`);break}let U=await this.quantizeKvReadback(w,y,m.nKv,m.hd),x=await this.quantizeKvReadback(P,y,m.nKv,m.hd),G=await this.attentionQ8KvDecode(_,U.codes,U.scales,x.codes,x.scales,m.nT,m.nH,m.nKv,m.hd,m.past),q=await this.attentionQ8Kv(_,U.codes,U.scales,x.codes,x.scales,m.nT,m.nH,m.nKv,m.hd,m.past);if(!F(G,q,.005)){A(`decode.q8kv(nT=${m.nT})`);break}}if(this.attnDecodeOk){let U=t(64),x=t(350*8),G=t(350*8);F(await this.attentionDecode(U,x,G,2,4,2,8,173,.3,5),ye(U,x,G,2,4,2,8,173,.3,5))||A("decode.softcap")}if(this.attnDecodeOk){let U=t(256),x=t(9088),G=t(9088);F(await this.attentionDecode(U,x,G,1,2,1,128,70),ye(U,x,G,1,2,1,128,70))||A("decode.hd128")}}{let A=m=>{this.rmsVecOk=!1,console.error("[selfValidate] RMSNorm parall\xE8le HS sur ce GPU (\xE9tape :",m,") \u2192 repli kernel une-ligne-par-thread (correct, plus lent en d\xE9codage)")},v=[{rows:1,dim:1024,onePlus:!1},{rows:1,dim:1536,onePlus:!1},{rows:1,dim:100,onePlus:!1},{rows:14,dim:64,onePlus:!1},{rows:37,dim:2048,onePlus:!1},{rows:3,dim:128,onePlus:!0}];for(let m of v){let y=t(m.rows*m.dim),_=t(m.dim),w=await this.rmsnormVec(y,_,m.rows,m.dim,1e-6,m.onePlus),P=await this.rmsnorm(y,_,m.rows,m.dim,1e-6,m.onePlus);if(!F(w,P,.005)){A(`rmsnorm_vec(${m.rows}\xD7${m.dim}${m.onePlus?",1+w":""})`);break}}}{let A=m=>{this.topKParOk=!1,console.error("[selfValidate] top-K parall\xE8le HS sur ce GPU (\xE9tape :",m,") \u2192 repli s\xE9lection sur un thread (correcte, plus lente)")},v=[{n:151936,k:64,ties:!1,label:"vocab Qwen (151936)"},{n:65536,k:64,ties:!1,label:"vocab World (65536)"},{n:1e3,k:64,ties:!1,label:"n non multiple de 128"},{n:300,k:64,ties:!1,label:"n < 1024 candidats"},{n:4096,k:8,ties:!1,label:"petit K"},{n:8192,k:64,ties:!0,label:"EX \xC6QUO (d\xE9partage)"}];for(let m of v){if(!this.topKParOk)break;let y=m.ties?Float32Array.from({length:m.n},(U,x)=>Math.round(Math.random()*6)+(x%7===0?3:0)):t(m.n),_=await this.topKReadback(y,m.k,"top_k"),w=await this.topKReadback(y,m.k,"top_k_par");if(!(_.length===w.length&&_.every((U,x)=>U===w[x]))){let U=_.findIndex((x,G)=>x!==w[G]);A(`top_k_par(${m.label}) \u2014 premier \xE9cart au rang ${U} : ${_[U]} vs ${w[U]}`);break}}}{let U={seq:3,d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},x={attnNorm:t(16),wq:t(256),wk:t(128),wv:t(128),wo:t(256),bq:t(16),bk:t(8),bv:t(8),ffnNorm:t(16),wgate:t(256),wup:t(256),wdown:t(256)},G=t(48);if(!F(await this.layerForward(G,U,x),ft(G,U,x),.005))return e("layerForward")}{let x={seq:3,d:12,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6,attnScale:1/Math.sqrt(4),attnLogitSoftcap:5,act:"gelu",rmsGainOnePlus:!0},G={attnNorm:t(12),wq:t(192),wk:t(96),wv:t(96),wo:t(192),ffnNorm:t(12),wgate:t(192),wup:t(192),wdown:t(192),postAttnNorm:t(12),postFfnNorm:t(12)},q=t(36);if(!F(await this.layerForward(q,x,G),ft(q,x,G),.005))return e("layerForward.gemma2")}{let x={seq:3,d:12,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e6,eps:1e-6},G={attnNorm:t(12),wq:t(192),wk:t(96),wv:t(96),wo:t(192),ffnNorm:t(12),wgate:t(192),wup:t(192),wdown:t(192),qNorm:t(4),kNorm:t(4)},q=t(36);if(!F(await this.layerForward(q,x,G),ft(q,x,G),.005))return e("layerForward.qwen3")}{let v=new Uint8Array(720);for(let y=0;y<5;y++){let _=y*144,w=new DataView(v.buffer);w.setUint16(_,Fe(.005+Math.random()*.05),!0),w.setUint16(_+2,Fe(.001+Math.random()*.02),!0);for(let P=4;P<144;P++)v[_+P]=Math.random()*256|0}let m=await this.dequantizeQ4K(v,5*256);if(!F(m,tn(v,5),1e-4))return e("dequant.Q4_K")}{let A=G=>{let q=new Uint8Array(G);for(let T=0;T<G;T++)q[T]=Math.random()*256|0;return q},v=(G,q)=>{let T=new DataView(G.buffer),R=O=>q===210?O*210+208:O*q;for(let O=0;O*q<G.length;O++)T.setUint16(R(O),Fe(.005+Math.random()*.05),!0);return G},y=v(A(136),34);if(!F(await this.dequantizeByType("Q8_0",y,128),rn(y,4),1e-4))return e("dequant.Q8_0");let _=v(A(88),22);if(!F(await this.dequantizeByType("Q5_0",_,128),nn(_,4),1e-4))return e("dequant.Q5_0");let w=v(A(840),210);if(!F(await this.dequantizeByType("Q6_K",w,4*256),on(w,4),1e-4))return e("dequant.Q6_K");let P=v(A(72),18);if(!F(await this.dequantizeByType("Q4_0",P,128),sn(P,4),1e-4))return e("dequant.Q4_0");let U=A(704),x=new DataView(U.buffer);for(let G=0;G<4;G++)x.setUint16(G*176,Fe(.005+Math.random()*.05),!0),x.setUint16(G*176+2,Fe(.001+Math.random()*.02),!0);if(!F(await this.dequantizeByType("Q5_K",U,4*256),an(U,4),1e-4))return e("dequant.Q5_K")}{let P={d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},U={attnNorm:t(16),wq:t(256),wk:t(128),wv:t(128),wo:t(256),bq:t(16),bk:t(8),bv:t(8),ffnNorm:t(16),wgate:t(256),wup:t(256),wdown:t(256)},x=t(48),q=(await this.layerForward(x,{...P,seq:3},U)).slice(32,48),T=new Float32Array(0),R=await this.layerForwardKV(x.slice(0,32),{...P,seq:2},U,0,T,T),O=await this.layerForwardKV(x.slice(32,48),{...P,seq:1},U,2,R.k,R.v);if(!F(O.out,q,.005))return e("layerForwardKV")}{let m=t(4),y=t(40),_=new Float32Array(10);for(let x=0;x<10;x++){let G=0;for(let q=0;q<4;q++)G+=m[q]*y[x*4+q];_[x]=G}let w=0;for(let x=1;x<10;x++)_[x]>_[w]&&(w=x);let P=this.uploadGpu(y),U=await this.argmaxProjection(m,[{buf:P,rows:10,r0:0}],4,10,!1);if(P.destroy?.(),U!==w)return e("argmaxProjection")}{let P={seq:4,d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},U={attnNorm:t(16),wq:t(256),wk:t(128),wv:t(128),wo:t(256),bq:t(16),bk:t(8),bv:t(8),ffnNorm:t(16),wgate:t(256),wup:t(256),wdown:t(256)},x=t(16),G=t(64),q=new Float32Array(0),T=await this.layerForwardKV(G,{...P,seq:4},U,0,q,q,!0),R=Ge(T.out.slice(48,64),x,1,16,1e-6),O={attnNorm:this.uploadGpu(U.attnNorm),wq:this.uploadGpu(U.wq),wk:this.uploadGpu(U.wk),wv:this.uploadGpu(U.wv),wo:this.uploadGpu(U.wo),ffnNorm:this.uploadGpu(U.ffnNorm),wgate:this.uploadGpu(U.wgate),wup:this.uploadGpu(U.wup),wdown:this.uploadGpu(U.wdown),bq:this.uploadGpu(U.bq),bk:this.uploadGpu(U.bk),bv:this.uploadGpu(U.bv)},D=this.uploadGpu(x),H=this.kvQuant;this.kvQuant=!1,this.resetKvGpu();let Q=await this.runDecodeGpu(G,{...P,seq:4},[O],0,D,"selftest-A");if(!F(Q,R,.008))return this.resetKvGpu(),this.kvQuant=H,e("runDecodeGpu.prefill");await this.runDecodeGpu(G.slice(0,48),{...P,seq:3},[O],0,D,"selftest-B");let $=await this.runDecodeGpu(G.slice(48,64),{...P,seq:1},[O],3,D,"selftest-B");if(!F($,R,.008))return this.resetKvGpu(),this.kvQuant=H,e("runDecodeGpu.decode");this.kvQuant=H,this.resetKvGpu();for(let V of Object.values(O))V?.destroy?.();D.destroy?.()}{let _=Float32Array.from({length:152064},()=>(Math.random()*2-1)*8),w=[...new Set(Array.from({length:40},()=>Math.floor(Math.random()*152064)))],P=_.slice();for(let S=0;S<152064;S++)P[S]=30*Math.tanh(P[S]/30);for(let S of w)P[S]=P[S]>0?P[S]/1.15:P[S]*1.15;let U=Array.from(P.keys()).sort((S,L)=>P[L]-P[S]).slice(0,64),x=globalThis,G=[],q=this.storage(152064*4);this.device.queue.writeBuffer(q,0,_),G.push(q);let T=this.device.createCommandEncoder(),R=this.uniform([152064],{offset:4,value:30});this.recordPass(T,"softcap_logits",[R,q],this.grid1D(152064));let O=this.bufU32(Uint32Array.from(w),x.GPUBufferUsage.STORAGE|x.GPUBufferUsage.COPY_DST),D=this.uniform([w.length],{offset:4,value:1.15});this.recordPass(T,"penalize_logits",[D,O,q],this.grid1D(w.length));let H=this.storage(512),Q=this.uniform([152064,64]);this.recordPass(T,this.topKParOk?"top_k_par":"top_k",[Q,q,H],[1,1,1]),G.push(R,O,D,Q,H);let $=this.device.createBuffer({size:512,usage:x.GPUBufferUsage.COPY_DST|x.GPUBufferUsage.MAP_READ});T.copyBufferToBuffer(H,0,$,0,512),this.device.queue.submit([T.finish()]),await $.mapAsync(x.GPUMapMode.READ);let V=new Uint32Array($.getMappedRange().slice(0));$.unmap(),$.destroy(),this.release(G);let I=V.slice(0,64),W=new Float32Array(V.buffer,256,64);this.topKOk=!0;for(let S=0;S<64;S++){let L=Math.abs(W[S]-P[U[S]])<=1e-4*(1+Math.abs(P[U[S]])),K=Math.abs(P[I[S]]-W[S])<=1e-4*(1+Math.abs(W[S]));if(!L||!K){this.topKOk=!1,console.error(`[selfValidate] top_k KO sur ce GPU (rang ${S}) \u2014 repli sur le sampling CPU plein-vocab (plus lent, m\xEAme r\xE9sultat).`);break}}}if(this.rwkvWkv7Ok){let y=t(128),_=t(16),w=t(16),P=t(16),U=t(16),x=t(16),G=Float32Array.from({length:16},()=>Math.random()*.5+.5),q=y.slice(),T=new Float32Array(16);for(let W=0;W<2;W++){let S=W*8;for(let L=0;L<8;L++){let K=W*8*8+L*8,z=P[S+L],Y=0;for(let E=0;E<8;E++)Y+=x[S+E]*q[K+E];let N=0;for(let E=0;E<8;E++){let J=G[S+E]*q[K+E]+z*w[S+E]+U[S+E]*Y;q[K+E]=J,N+=_[S+E]*J}T[S+L]=N}}let R=await this.rwkvWkv7(y.slice(),_,G,w,P,x,U,2,8),O=(W,S)=>W.length===S.length&&W.every((L,K)=>Math.abs(L-S[K])<=.001*(1+Math.abs(S[K])));!O(R.S,q)||!O(R.y,T)?(this.rwkvWkv7Ok=!1,console.error("[selfValidate] RWKV-7 WKV KO sur ce GPU \u2014 une archi RWKV (moteur v2) refuserait de charger (non bloquant pour le chat texte).")):console.log("[selfValidate] RWKV-7 WKV OK (r\xE9currence \xE0 \xE9tat fixe, moteur v2)");let D=16,H=t(D),Q=t(D),$=t(D*6),V=new Float32Array(D*6);for(let W=0;W<6;W++)for(let S=0;S<D;S++){let L=W*D+S;V[L]=H[S]+(Q[S]-H[S])*$[L]}let I=await this.rwkvTokenShift(H,Q,$,D);if(O(I,V)?console.log("[selfValidate] RWKV-7 token-shift OK"):(this.rwkvWkv7Ok=!1,console.error("[selfValidate] RWKV-7 token-shift KO sur ce GPU (non bloquant pour le chat texte).")),this.rwkvResidentOk){let W=globalThis,S=W.GPUBufferUsage.STORAGE|W.GPUBufferUsage.COPY_DST|W.GPUBufferUsage.COPY_SRC,L=2,K=8,z=L*K,Y=(E,J)=>{let se=Math.max(16,Math.ceil((E.length*4+(J?4:0))/16)*16),oe=this.device.createBuffer({size:se,usage:W.GPUBufferUsage.UNIFORM|W.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(oe,0,new Uint32Array(E)),J&&this.device.queue.writeBuffer(oe,J.off,new Float32Array([J.val])),oe},N=E=>this.device.createBuffer({size:E*4,usage:S});try{let E=t(z),J=t(z),se=t(z),oe=Float32Array.from({length:z},()=>Math.random()),fe=new Float32Array(z),_e=new Float32Array(z),he=new Float32Array(z);for(let ie=0;ie<L;ie++){let Z=0;for(let de=0;de<K;de++){let ue=E[ie*K+de]*J[ie*K+de];Z+=ue*ue}Z=Math.sqrt(Z)||1e-12;for(let de=0;de<K;de++){let ue=ie*K+de,Ne=E[ue]*J[ue]/Z;_e[ue]=-Ne,he[ue]=Ne*oe[ue],fe[ue]=E[ue]*(1+(oe[ue]-1)*se[ue])}}let Be=N(z),Me=N(z),re=N(z);this.dispatch("rwkv_kprep",[Y([L,K]),this.buf(E,S),this.buf(oe,S),this.buf(J,S),this.buf(se,S),Be,Me,re],this.grid1D(L));let Ae=O(await this.readBack(Be,z*4),fe)&&O(await this.readBack(Me,z*4),_e)&&O(await this.readBack(re,z*4),he);Be.destroy?.(),Me.destroy?.(),re.destroy?.();let le=t(z),Pt=t(z),Ut=t(z),Gt=t(z),_t=t(z),Bt=t(z),xt=new Float32Array(z);for(let ie=0;ie<L;ie++){let Z=ie*K,de=0;for(let ne=0;ne<K;ne++)de+=le[Z+ne];de/=K;let ue=0;for(let ne=0;ne<K;ne++){let Wt=le[Z+ne]-de;ue+=Wt*Wt}ue/=K;let Ne=1/Math.sqrt(ue+64e-5),Nt=0;for(let ne=0;ne<K;ne++)Nt+=Pt[Z+ne]*fe[Z+ne]*Ut[Z+ne];for(let ne=0;ne<K;ne++)xt[Z+ne]=(le[Z+ne]-de)*Ne*_t[Z+ne]+Bt[Z+ne]+Nt*Gt[Z+ne]}let et=new Float32Array(2*z);et.set(_t,0),et.set(Bt,z);let tt=N(z);this.dispatch("rwkv_out_gn",[Y([L,K],{off:8,val:64e-5}),this.buf(le,S),this.buf(Pt,S),this.buf(fe,S),this.buf(Ut,S),this.buf(Gt,S),this.buf(et,S),tt],this.grid1D(L));let Ft=O(await this.readBack(tt,z*4),xt);tt.destroy?.();let qt=t(z),St=t(z),Qr=Float32Array.from(qt,(ie,Z)=>Math.exp(-.606531/(1+Math.exp(-(ie+St[Z]))))),rt=N(z);this.dispatch("rwkv_decay",[this.buf(qt,S),this.buf(St,S),rt],this.grid1D(z));let Ot=O(await this.readBack(rt,z*4),Qr);rt.destroy?.();let Mt=t(z),Tt=t(z),Ct=t(z),Dt=t(z),Vr=Float32Array.from(Mt,(ie,Z)=>ie+(Tt[Z]-ie)*(1/(1+Math.exp(-(Ct[Z]+Dt[Z]))))),nt=this.buf(Mt,S);this.dispatch("rwkv_vresid",[nt,this.buf(Tt,S),this.buf(Ct,S),this.buf(Dt,S)],this.grid1D(z));let Rt=O(await this.readBack(nt,z*4),Vr);nt.destroy?.();let Lt=t(z),jt=t(z),zt=t(z),$r=Float32Array.from(Lt,(ie,Z)=>ie+(jt[Z]-ie)*zt[Z]),st=N(z);this.dispatch("rwkv_lerp",[this.buf(Lt,S),this.buf(jt,S),this.buf(zt,S),st],this.grid1D(z));let Kt=O(await this.readBack(st,z*4),$r);st.destroy?.();let Et=t(z),Ir=Float32Array.from(Et,ie=>{let Z=Math.max(ie,0);return Z*Z}),it=N(z);this.dispatch("sqrelu",[this.buf(Et,S),it],this.grid1D(z));let Ht=O(await this.readBack(it,z*4),Ir);it.destroy?.(),!Ae||!Ft||!Ot||!Rt||!Kt||!Ht?(this.rwkvResidentOk=!1,console.error(`[selfValidate] glu RWKV r\xE9sidente KO sur ce GPU (kprep:${Ae} gn:${Ft} decay:${Ot} vresid:${Rt} lerp:${Kt} sqrelu:${Ht}) \u2014 repli forwardToken JS+readback (correct, lent).`)):console.log("[selfValidate] glu RWKV r\xE9sidente OK (kprep, out_gn, decay, vresid, lerp, sqrelu)")}catch(E){this.rwkvResidentOk=!1,console.error("[selfValidate] glu RWKV r\xE9sidente : erreur d\u2019ex\xE9cution \u2014 repli forwardToken JS+readback.",E)}}}if(this.lfm2ShortConvOk){let A=q=>Float32Array.from({length:q},()=>Math.random()*2-1),v=(q,T)=>q.length===T.length&&q.every((R,O)=>Math.abs(R-T[O])<=.001*(1+Math.abs(T[O]))),_=A(96),w=A(64),P=A(96),U=new Float32Array(32),x=w.slice();for(let q=0;q<32;q++){let T=_[q]*_[64+q],R=P[q*3+2]*T;for(let O=0;O<2;O++)R+=P[q*3+O]*w[O*32+q];for(let O=0;O+2<3;O++)x[O*32+q]=w[(O+1)*32+q];x[32+q]=T,U[q]=R*_[32+q]}let G=await this.lfm2ShortConv(_,w.slice(),P,32,3);!v(G.out,U)||!v(G.state,x)?(this.lfm2ShortConvOk=!1,console.error("[selfValidate] LFM2 shortconv KO sur ce GPU \u2014 une archi lfm2 refuserait de charger (non bloquant pour le reste).")):console.log("[selfValidate] LFM2 shortconv OK (conv courte gat\xE9e, moteur v2)")}let C=await this.validateDiffusion();C?console.warn("[selfValidate] image-gen primitive KO:",C,"(non bloquant \u2014 chemin texte intact)"):console.log("[selfValidate] image-gen primitives OK (silu, group_norm, conv2d, conv2d_direct, conv2d_direct_q8, relu, upsample_nearest, layernorm, quick_gelu, attention_full)");let j=await this.validateVideoResident();return j?(this.videoResidentOk=!1,console.warn("[selfValidate] motion r\xE9sident KO:",j,"\u2014 repli JS+readback (plus lent, m\xEAme r\xE9sultat).")):console.log("[selfValidate] motion r\xE9sident OK (video_motion_gather, video_motion_scatter, video_add_pe, attn_temporal)"),!0}async validateVideoResident(){let e=o=>Float32Array.from({length:o},()=>Math.random()*2-1),r=(o,u,c=.005)=>o.length===u.length&&o.every((l,d)=>Math.abs(l-u[d])<=c*(1+Math.abs(u[d])));{let o=e(120),u=new Float32Array(120);for(let d=0;d<5;d++)for(let g=0;g<3;g++)for(let p=0;p<8;p++)u[(d*3+g)*8+p]=o[(g*8+p)*5+d];let c=this.recordingSession(),l=await c.finish(c.videoGather(o,3,8,5),120);if(!r(l,u,1e-6))return"video_motion_gather"}{let o=e(120),u=e(120),c=new Float32Array(120);for(let g=0;g<3;g++)for(let p=0;p<8;p++)for(let h=0;h<5;h++)c[(g*8+p)*5+h]=o[(h*3+g)*8+p]+u[(g*8+p)*5+h];let l=this.recordingSession(),d=await l.finish(l.videoScatter(o,u,3,8,5),120);if(!r(d,c,1e-6))return"video_motion_scatter"}{let o=e(120),u=e(24),c=new Float32Array(120);for(let g=0;g<5;g++)for(let p=0;p<3;p++)for(let h=0;h<8;h++)c[(g*3+p)*8+h]=o[(g*3+p)*8+h]+u[p*8+h];let l=this.recordingSession(),d=await l.finish(l.videoAddPe(o,u,3,8,5),120);if(!r(d,c,1e-6))return"video_add_pe"}{let o=e(120),u=e(120),c=e(120),l=1/Math.sqrt(4),d=new Float32Array(120);for(let h=0;h<5;h++)for(let b=0;b<2;b++){let k=b*4,B=h*3;for(let M=0;M<3;M++){let F=(B+M)*8+k,C=new Float32Array(3),j=-1e30;for(let v=0;v<3;v++){let m=0,y=(B+v)*8+k;for(let _=0;_<4;_++)m+=o[F+_]*u[y+_];C[v]=m*l,C[v]>j&&(j=C[v])}let A=0;for(let v=0;v<3;v++)C[v]=Math.exp(C[v]-j),A+=C[v];for(let v=0;v<3;v++){let m=C[v]/A,y=(B+v)*8+k;for(let _=0;_<4;_++)d[F+_]+=m*c[y+_]}}}let g=this.recordingSession(),p=await g.finish(g.attnTemporal(o,u,c,5,3,2,4),120);if(!r(p,d))return"attn_temporal"}return null}async validateDiffusion(){let e=S=>Float32Array.from({length:S},()=>Math.random()*2-1),r=(S,L,K=.005)=>S.length===L.length&&S.every((z,Y)=>Math.abs(z-L[Y])<=K*(1+Math.abs(L[Y]))),t=e(70),n=t.map(S=>S/(1+Math.exp(-S)));if(!r(await this.silu(t),n))return"silu";let s=4,a=5,i=2,o=1e-5,u=e(s*a),c=e(s),l=e(s),d=new Float32Array(s*a),g=s/i;for(let S=0;S<i;S++){let L=S*g*a,K=g*a,z=0;for(let E=0;E<K;E++)z+=u[L+E];z/=K;let Y=0;for(let E=0;E<K;E++){let J=u[L+E]-z;Y+=J*J}Y/=K;let N=1/Math.sqrt(Y+o);for(let E=0;E<K;E++){let J=S*g+Math.floor(E/a);d[L+E]=(u[L+E]-z)*N*c[J]+l[J]}}if(!r(await this.groupNorm(u,c,l,s,a,i,o),d))return"group_norm";let p=2,h=4,b=4,k=3,B=3,M=1,F=1,C=4,j=4,A=e(p*h*b),v=e(k*p*B*B),m=e(k),y=new Float32Array(k*C*j);for(let S=0;S<k;S++)for(let L=0;L<C;L++)for(let K=0;K<j;K++){let z=m[S];for(let Y=0;Y<p;Y++)for(let N=0;N<B;N++)for(let E=0;E<B;E++){let J=L*M+N-F,se=K*M+E-F;J>=0&&J<h&&se>=0&&se<b&&(z+=A[Y*h*b+J*b+se]*v[((S*p+Y)*B+N)*B+E])}y[(S*C+L)*j+K]=z}if(!r(await this.conv2d(A,v,m,p,h,b,k,B,B,M,F),y))return"conv2d";if(!r(await this.conv2dDirect(A,v,m,p,h,b,k,B,B,M,F),y))return"conv2d_direct";{let Y=e(1200),N=e(108),E=e(4),J=await this.conv2dDirect(Y,N,E,3,20,20,4,3,3,1,1),se=this.convTiledOk;this.convTiledOk=!0;let oe=this.recordingSession(),fe=await oe.finish(oe.conv2d(Y,N,E,3,20,20,4,3,3,1,1),1600);this.convTiledOk=se,r(fe,J)||(this.convTiledOk=!1,console.warn("[selfValidate] conv2d_3x3_tiled KO sur ce GPU \u2014 repli sur conv2d_direct (plus lent, m\xEAme r\xE9sultat)."))}{let K=e(8*h*b),z=e(32*B*B),Y=e(4),N=Ce(z),E=await this.conv2dDirect(K,ve(N),Y,8,h,b,4,B,B,M,F),J={codes:this.uploadGpuRaw(new Uint8Array(N.codes.buffer,N.codes.byteOffset,N.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(N.scales.buffer,N.scales.byteOffset,N.scales.byteLength))},se=this.recordingSession(),oe=await se.finish(se.conv2d(K,J,Y,8,h,b,4,B,B,M,F),4*h*b);if(this.releaseGpu([J.codes,J.sc]),!r(oe,E))return"conv2d_direct_q8"}{let K=e(8*h*b),z=e(32*B*B),Y=e(4),N=Te(z),E=await this.conv2dDirect(K,ge(N),Y,8,h,b,4,B,B,M,F),J={nib:this.uploadGpuRaw(N.nibbles),sc:this.uploadGpuRaw(new Uint8Array(N.scales.buffer,N.scales.byteOffset,N.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(N.mins.buffer,N.mins.byteOffset,N.mins.byteLength))},se=this.recordingSession(),oe=await se.finish(se.conv2d(K,J,Y,8,h,b,4,B,B,M,F),4*h*b);if(this.releaseGpu([J.nib,J.sc,J.mn]),!r(oe,E))return"conv2d_direct_q4"}{let L=e(66),K=new Uint16Array(66);for(let E=0;E<66;E++)K[E]=Fe(L[E]);let z=new Float32Array(66);for(let E=0;E<66;E++)z[E]=pe(K[E]);let Y=this.f16ToF32Gpu(new Uint8Array(K.buffer,K.byteOffset,K.byteLength),66),N=await this.readGpu(Y,66);if(Y.destroy?.(),!r(N,z,1e-6))return"f16_to_f32"}let _=e(70);if(!r(await this.relu(_),_.map(S=>Math.max(S,0))))return"relu";let w=2,P=2,U=2,x=2,G=P*x,q=U*x,T=e(w*P*U),R=new Float32Array(w*G*q);for(let S=0;S<w;S++)for(let L=0;L<G;L++)for(let K=0;K<q;K++)R[S*G*q+L*q+K]=T[S*P*U+Math.floor(L/x)*U+Math.floor(K/x)];if(!r(await this.upsampleNearest(T,w,P,U,x),R))return"upsample_nearest";let O=2,D=8,H=1e-5,Q=e(O*D),$=e(D),V=e(D),I=new Float32Array(O*D);for(let S=0;S<O;S++){let L=S*D,K=0;for(let N=0;N<D;N++)K+=Q[L+N];K/=D;let z=0;for(let N=0;N<D;N++){let E=Q[L+N]-K;z+=E*E}z/=D;let Y=1/Math.sqrt(z+H);for(let N=0;N<D;N++)I[L+N]=(Q[L+N]-K)*Y*$[N]+V[N]}if(!r(await this.layernorm(Q,$,V,O,D,H),I))return"layernorm";let W=e(70);if(!r(await this.quickGelu(W),W.map(S=>S/(1+Math.exp(-1.702*S)))))return"quick_gelu";{let N=1/Math.sqrt(4),E=e(24),J=e(40),se=e(40),oe=new Float32Array(24);for(let fe=0;fe<2;fe++)for(let _e=0;_e<3;_e++){let he=new Float32Array(5),Be=-1/0;for(let re=0;re<5;re++){let Ae=0;for(let le=0;le<4;le++)Ae+=E[_e*8+fe*4+le]*J[re*8+fe*4+le];he[re]=Ae*N,he[re]>Be&&(Be=he[re])}let Me=0;for(let re=0;re<5;re++)he[re]=Math.exp(he[re]-Be),Me+=he[re];for(let re=0;re<4;re++){let Ae=0;for(let le=0;le<5;le++)Ae+=he[le]/Me*se[le*8+fe*4+re];oe[_e*8+fe*4+re]=Ae}}if(!r(await this.attentionFull(E,J,se,3,2,2,4,5),oe))return"attention_full"}if(this.attnFullWgOk){let S=[{nT:70,kvL:70,nH:5,hd:64},{nT:16,kvL:77,nH:5,hd:64},{nT:9,kvL:9,nH:8,hd:160}];for(let L of S){let K=L.nH*L.hd,z=e(L.nT*K),Y=e(L.kvL*K),N=e(L.kvL*K),E=await this.attentionFull(z,Y,N,L.nT,L.nH,L.nH,L.hd,L.kvL),J=await this.attentionFullWg(z,Y,N,L.nT,L.nH,L.nH,L.hd,L.kvL);if(!r(J,E)){this.attnFullWgOk=!1,console.warn(`[selfValidate] attention_full_wg KO sur ce GPU (hd=${L.hd}, kv=${L.kvL}) \u2014 repli sur attention_full (plus lent, m\xEAme r\xE9sultat).`);break}}}return null}};X.timingOn=(()=>{try{return ae("timing")==="1"}catch{return!1}})(),X.profileOn=(()=>{try{return ae("gpuprofile")==="1"}catch{return!1}})(),X.MAX_WG_DIM=65535,X.BLOCK_ELEMS={Q4_K:256,Q5_K:256,Q6_K:256,Q8_0:32,Q5_0:32,Q4_0:32,F32:1,F16:1},X.DEQUANT_SHADER={Q4_K:"dequant_q4k",Q8_0:"dequant_q8_0",Q5_0:"dequant_q5_0",Q6_K:"dequant_q6k",Q4_0:"dequant_q4_0",Q5_K:"dequant_q5k"},X.STORAGE_USAGE=140;$e=X});function ur(f,e){let r=new DataView(f.buffer,f.byteOffset,f.byteLength),t=new Float32Array(e);for(let n=0;n<e;n++)t[n]=ce(r.getUint16(n*2,!0));return t}function cr(f,e){let r=new DataView(f.buffer,f.byteOffset,f.byteLength),t=new Float32Array(e);for(let n=0;n<e;n++)t[n]=r.getFloat32(n*4,!0);return t}function je(f,e,r,t){let n=0;for(let i=0;i<r;i++)n+=f[i]*f[i];let s=1/Math.sqrt(n/r+t),a=new Float32Array(r);for(let i=0;i<r;i++)a[i]=f[i]*s*e[i];return a}var ln,Se,Ie,lr=te(()=>{"use strict";at();ot();De();ln=f=>f/(1+Math.exp(-f)),Se=class Se{constructor(e,r,t){this.engine=e;this.manifest=r;this.raw=t;this.w=new Map;this.g=new Map;this.pos=0;this.rLayers=[];this.tokNormGpu=null;this.normBufs=[];this.ffn=0}isBigProj(e){return/\.(shortconv\.(in_proj|out_proj)|attn_(q|k|v|output)|ffn_(gate|up|down))\.weight$/.test(e)}async load(e){if(!this.engine.lfm2ShortConvOk)throw new Error("kernel shortconv LFM2 invalid\xE9 sur ce GPU (selfValidate) \u2014 archi lfm2 refus\xE9e.");let r=this.manifest.arch;if(this.D=r.d,this.NH=r.nHeads,this.NKV=r.nKvHeads,this.HD=r.headDim,this.NL=r.blockCount,this.vocab=r.vocab,this.EPS=r.rmsEps,this.THETA=r.ropeTheta,!r.lfm2)throw new Error("manifest sans profil lfm2");this.LC=r.lfm2.lCache,this.convLayer=r.lfm2.kvHeadsPerLayer.map(t=>t===0),this.tok=e,this.stops=new Set(this.manifest.chat?.stopTokenIds?.length?this.manifest.chat.stopTokenIds:[7]);for(let[t,n]of Object.entries(this.manifest.tensors)){if(t==="token_embd.weight"){if(this.embedBytes=await this.raw(t),this.embedDtype=n.dtype,n.dtype==="q4"){let a=Ue(this.embedBytes,n.nElems);this.g.set("head",{kind:"q4",nib:this.engine.uploadGpuRaw(a.nibbles),sc:this.up(a.scales),mn:this.up(a.mins),IN:this.D,OUT:this.vocab})}else if(n.dtype==="q8"){let a=xe(this.embedBytes,n.nElems);this.g.set("head",{kind:"q8",codes:this.upI8(a.codes),sc:this.up(a.scales),IN:this.D,OUT:this.vocab})}continue}let s=await this.raw(t);if(this.isBigProj(t)&&(n.dtype==="q4"||n.dtype==="q8")){let a=n.shape[0],i=n.nElems/a;if(n.dtype==="q8"){let o=xe(s,n.nElems);this.g.set(t,{kind:"q8",codes:this.upI8(o.codes),sc:this.up(o.scales),IN:a,OUT:i})}else{let o=Ue(s,n.nElems);this.g.set(t,{kind:"q4",nib:this.engine.uploadGpuRaw(o.nibbles),sc:this.up(o.scales),mn:this.up(o.mins),IN:a,OUT:i})}}else this.w.set(t,n.dtype==="f32"?cr(s,n.nElems):n.dtype==="f16"?ur(s,n.nElems):n.dtype==="q8"?ve(xe(s,n.nElems)):ge(Ue(s,n.nElems)))}this.buildResidentLayers(),this.reset()}buildResidentLayers(){let e=r=>{let t=this.engine.uploadGpu(this.w.get(r));return this.normBufs.push(t),t};this.tokNormGpu=e("token_embd_norm.weight"),this.ffn=this.g.get("blk.0.ffn_gate.weight")?.OUT??0,this.rLayers=[];for(let r=0;r<this.NL;r++){let t=`blk.${r}.`,n={attnNorm:e(t+"attn_norm.weight"),ffnNorm:e(t+"ffn_norm.weight"),wgate:this.g.get(t+"ffn_gate.weight"),wup:this.g.get(t+"ffn_up.weight"),wdown:this.g.get(t+"ffn_down.weight")};this.convLayer[r]?this.rLayers.push({conv:!0,...n,convW:e(t+"shortconv.conv.weight"),inProj:this.g.get(t+"shortconv.in_proj.weight"),outProj:this.g.get(t+"shortconv.out_proj.weight")}):this.rLayers.push({conv:!1,...n,qNorm:e(t+"attn_q_norm.weight"),kNorm:e(t+"attn_k_norm.weight"),wq:this.g.get(t+"attn_q.weight"),wk:this.g.get(t+"attn_k.weight"),wv:this.g.get(t+"attn_v.weight"),wo:this.g.get(t+"attn_output.weight")})}}residentAvailable(){return this.engine.lfm2ResidentOk!==!1&&!!this.g.get("head")&&this.rLayers.length===this.NL&&this.ffn>0}cfg(){return{D:this.D,nHeads:this.NH,nKvHeads:this.NKV,headDim:this.HD,ffn:this.ffn,eps:this.EPS,theta:this.THETA,lc:this.LC,vocab:this.vocab}}embedsFor(e){let r=this.D,t=new Float32Array(e.length*r);for(let n=0;n<e.length;n++)t.set(this.embedRow(e[n]),n*r);return t}async logitsGpu(e,r,t){return this.pos=r+e.length,this.engine.lfm2LogitsGpu(this.embedsFor(e),e.length,this.cfg(),this.rLayers,this.g.get("head"),this.tokNormGpu,r,t)}async topKGpu(e,r,t,n,s,a=40){return this.pos=r+e.length,this.engine.lfm2TopKGpu(this.embedsFor(e),e.length,this.cfg(),this.rLayers,this.g.get("head"),this.tokNormGpu,r,t,n,s,a)}async prefillGpu(e,r,t){this.pos=r+e.length,await this.engine.lfm2PrefillGpu(this.embedsFor(e),e.length,this.cfg(),this.rLayers,this.tokNormGpu,r,t)}up(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}upI8(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}unload(){for(let e of this.g.values())for(let r of["nib","sc","mn","codes"])e[r]?.destroy?.();for(let e of this.normBufs)e?.destroy?.();this.normBufs=[],this.rLayers=[],this.tokNormGpu=null,this.engine.clearLfm2State?.(),this.g.clear(),this.w.clear()}reset(){this.pos=0,this.state=Array.from({length:this.NL},(e,r)=>this.convLayer[r]?{conv:new Float32Array((this.LC-1)*this.D)}:{K:[],V:[]})}async gemm(e,r){let t=this.g.get(e);if(!t){let n=this.w.get(e==="head"?"token_embd.weight":e),s=n.length/r.length,a=new Float32Array(s);for(let i=0;i<s;i++){let o=0,u=i*r.length;for(let c=0;c<r.length;c++)o+=n[u+c]*r[c];a[i]=o}return a}return t.kind==="q8"?this.engine.matmulQ8(r,t.codes,t.sc,1,t.IN,t.OUT):this.engine.matmulQ4(r,t.nib,t.sc,t.mn,1,t.IN,t.OUT)}embedRow(e){let r=this.D;if(this.embedDtype==="f16")return ur(this.embedBytes.subarray(e*r*2,e*r*2+r*2),r);if(this.embedDtype==="f32")return cr(this.embedBytes.subarray(e*r*4,e*r*4+r*4),r);if(this.embedDtype==="q8"){let o=this.vocab*r,u=r/32,c=new Int8Array(this.embedBytes.buffer,this.embedBytes.byteOffset+e*r,r),l=this.embedBytes.subarray(o+e*u*2,o+e*u*2+u*2),d=new DataView(l.buffer,l.byteOffset,l.byteLength),g=new Float32Array(r);for(let p=0;p<u;p++){let h=ce(d.getUint16(p*2,!0));for(let b=0;b<32;b++)g[p*32+b]=c[p*32+b]*h}return g}let t=this.vocab*r,n=r/32,s=t/2,a=t/2+t/32*2,i=new Uint8Array(r/2+n*2*2);return i.set(this.embedBytes.subarray(e*r/2,e*r/2+r/2),0),i.set(this.embedBytes.subarray(s+e*n*2,s+e*n*2+n*2),r/2),i.set(this.embedBytes.subarray(a+e*n*2,a+e*n*2+n*2),r/2+n*2),ge(Ue(i,r))}rope(e,r,t){let n=this.HD,s=e.slice();for(let a=0;a<r;a++){let i=a*n;for(let o=0;o<n/2;o++){let u=Math.pow(this.THETA,-2*o/n),c=Math.cos(t*u),l=Math.sin(t*u),d=e[i+o],g=e[i+o+n/2];s[i+o]=d*c-g*l,s[i+o+n/2]=d*l+g*c}}return s}async forwardToken(e){let r=this.D,t=this.pos++,n=this.embedRow(e);for(let s=0;s<this.NL;s++){let a=`blk.${s}.`,i=this.state[s],o=je(n,this.w.get(a+"attn_norm.weight"),r,this.EPS),u;if(this.convLayer[s]){let p=await this.gemm(a+"shortconv.in_proj.weight",o),h=await this.engine.lfm2ShortConv(p,i.conv,this.w.get(a+"shortconv.conv.weight"),r,this.LC);i.conv=h.state,u=await this.gemm(a+"shortconv.out_proj.weight",h.out)}else{let p=await this.gemm(a+"attn_q.weight",o),h=await this.gemm(a+"attn_k.weight",o),b=await this.gemm(a+"attn_v.weight",o),k=this.w.get(a+"attn_q_norm.weight"),B=this.w.get(a+"attn_k_norm.weight");for(let A=0;A<this.NH;A++)p.set(je(p.slice(A*this.HD,(A+1)*this.HD),k,this.HD,this.EPS),A*this.HD);for(let A=0;A<this.NKV;A++)h.set(je(h.slice(A*this.HD,(A+1)*this.HD),B,this.HD,this.EPS),A*this.HD);p=this.rope(p,this.NH,t),h=this.rope(h,this.NKV,t),i.K.push(h),i.V.push(b);let M=new Float32Array(this.NH*this.HD),F=i.K.length,C=1/Math.sqrt(this.HD),j=this.NH/this.NKV;for(let A=0;A<this.NH;A++){let v=Math.floor(A/j),m=A*this.HD,y=v*this.HD,_=new Float32Array(F),w=-1e30;for(let U=0;U<F;U++){let x=0;for(let G=0;G<this.HD;G++)x+=p[m+G]*i.K[U][y+G];_[U]=x*C,_[U]>w&&(w=_[U])}let P=0;for(let U=0;U<F;U++)_[U]=Math.exp(_[U]-w),P+=_[U];for(let U=0;U<F;U++){let x=_[U]/P;for(let G=0;G<this.HD;G++)M[m+G]+=x*i.V[U][y+G]}}u=await this.gemm(a+"attn_output.weight",M)}for(let p=0;p<r;p++)n[p]+=u[p];let c=je(n,this.w.get(a+"ffn_norm.weight"),r,this.EPS),l=await this.gemm(a+"ffn_gate.weight",c),d=await this.gemm(a+"ffn_up.weight",c);for(let p=0;p<l.length;p++)l[p]=ln(l[p])*d[p];let g=await this.gemm(a+"ffn_down.weight",l);for(let p=0;p<r;p++)n[p]+=g[p]}return n=je(n,this.w.get("token_embd_norm.weight"),r,this.EPS),this.gemm("head",n)}async classify(e,r){this.reset();let t;for(let s of this.tok.encode(e))t=await this.forwardToken(s);let n=r.map(s=>{let a=this.tok.encode(s);return{label:s,logit:t[a[1]??a[0]]}}).sort((s,a)=>a.logit-s.logit);return{label:n[0].label,scores:n}}banTools(e){for(let r of Se.TOOL_BAN)r<e.length&&(e[r]=-1e30);return e}sampleTok(e,r,t){let{temperature:n=.8,topK:s=40,repeatPenalty:a=1.3}=t,i=new Set(r),o=[];for(let d=0;d<e.length;d++){let g=e[d];i.has(d)&&(g=g>0?g/a:g*a),o.push({i:d,v:g})}o.sort((d,g)=>g.v-d.v),o.length=s;let u=o[0].v,c=0;for(let d of o)d.p=Math.exp((d.v-u)/n),c+=d.p;let l=Math.random()*c;for(let d of o)if(l-=d.p,l<=0)return d.i;return o[0].i}async generate(e,r,t,n,s){this.reset();let a=this.tok.encode(e),i;for(let u of a)i=await this.forwardToken(u);let o=[];for(let u=0;u<r&&!n?.();u++){this.banTools(i);let c;if(s?.sample)c=this.sampleTok(i,o.slice(-64),s);else{c=0;for(let l=1;l<i.length;l++)i[l]>i[c]&&(c=l)}if(this.stops.has(c))break;o.push(c),t&&t(this.tok.decode(o)),i=await this.forwardToken(c)}return o.length?this.tok.decode(o):""}pickFromTopK(e,r){let t=[],n=[];for(let d=0;d<e.ids.length;d++)if(!Se.TOOL_BAN.includes(e.ids[d])){if(e.vals[d]===-1/0)break;t.push(e.ids[d]),n.push(e.vals[d])}if(!t.length)return e.ids[0];if(!r?.sample)return t[0];let{temperature:s=.8,topK:a=40}=r,i=Math.min(a,t.length),o=n[0],u=0,c=new Array(i);for(let d=0;d<i;d++)c[d]=Math.exp((n[d]-o)/s),u+=c[d];let l=Math.random()*u;for(let d=0;d<i;d++)if(l-=c[d],l<=0)return t[d];return t[0]}async generateResident(e,r,t,n,s){if(!this.residentAvailable())return this.generate(e,r,t,n,s);let a="gen",i=s?.repeatPenalty??(s?.sample?1.3:1),o=this.tok.encode(e),u,c=0;for(;c<o.length;){if(n?.())return"";let g=Math.min(c+Se.PREFILL_CHUNK,o.length),p=o.slice(c,g);g<o.length?await this.prefillGpu(p,c,a):u=await this.topKGpu(p,c,a,[],1,48),c=g}let l=o.length,d=[];for(let g=0;g<r&&!n?.();g++){let p=this.pickFromTopK(u,s);if(this.stops.has(p))break;d.push(p),t&&t(this.tok.decode(d)),u=await this.topKGpu([p],l,a,i!==1?[...new Set(d.slice(-64))]:[],i,48),l++}return d.length?this.tok.decode(d):""}};Se.TOOL_BAN=[8,10,12],Se.PREFILL_CHUNK=128;Ie=Se});function fr(f){if(!f.length)return null;let e=1/0,r=0,t=0;for(let n of f)e=Math.min(e,n.offset),r=Math.max(r,n.offset+n.bytes),t+=n.bytes;return r-e>64<<20||r-e>t*1.5?null:{start:e,end:r}}function dr(f,e){let r=new Map;for(let s of Object.keys(f)){let a=s.match(/^blk\.(\d+)\./);if(!a)continue;let i=r.get(a[1]);i||r.set(a[1],i=[]),i.push(s)}let t=new Map,n=new Map;return async s=>{let a=f[s];if(!a)throw new Error(`tenseur absent : ${s}`);let i=s.match(/^blk\.(\d+)\./),o=i?r.get(i[1]):void 0,u=o?fr(o.map(b=>f[b])):null;if(!i||!o||!u)return e.bytes(a.offset,a.bytes);let c=i[1],l=t.get(c);l||(l=e.bytes(u.start,u.end-u.start).then(b=>({start:u.start,bytes:b})),t.set(c,l),n.set(c,o.length));let{start:d,bytes:g}=await l,p=g.subarray(a.offset-d,a.offset-d+a.bytes),h=(n.get(c)??1)-1;return h<=0?(t.delete(c),n.delete(c),new Uint8Array(p)):(n.set(c,h),p)}}var dt=te(()=>{"use strict"});var gr=te(()=>{"use strict"});function pr(f,e=16){return Math.ceil(f/e)*e}var hr=te(()=>{"use strict"});function dn(f){return pr(ze+f)}function gt(f){if(f.length<ze)throw new Error("BRIK: fichier tronqu\xE9 (en-t\xEAte)");let e=String.fromCharCode(f[0],f[1],f[2],f[3]);if(e!==fn)throw new Error(`BRIK: sceau magique absent (${e})`);let r=new DataView(f.buffer,f.byteOffset,f.byteLength),t=r.getUint32(4,!0),n=r.getUint32(8,!0);if(ze+n>f.length)throw new Error("BRIK: manifeste tronqu\xE9");return{manifest:JSON.parse(new TextDecoder().decode(f.subarray(ze,ze+n))),version:t,dataStart:dn(n)}}function mr(f){let{manifest:e,version:r,dataStart:t}=gt(f);return{manifest:e,version:r,dataStart:t,data:f.subarray(t)}}var fn,ze,br=te(()=>{"use strict";hr();fn="BRIK",ze=12});function vr(f){let e=[...f].sort((n,s)=>n.id-s.id),r=[],t=0;for(let n of e)r[n.id]=t,t+=n.byteLength;return r}function wr(f){let e=vr(f.shards),r={};for(let[n,s]of Object.entries(f.tensors)){let a=gn[s.dtype];if(!a)throw new Error(`dtype BRIK inconnu pour ${n} : ${s.dtype}`);if(e[s.shard]===void 0)throw new Error(`shard ${s.shard} absent du manifeste (tenseur ${n})`);r[n]={offset:e[s.shard]+s.offset,bytes:s.byteLength,nElems:s.nElems,type:a,shape:s.shape}}let t=f.arch;return{arch:t.arch,config:{d:t.d,nHeads:t.nHeads,nKvHeads:t.nKvHeads,headDim:t.headDim,ffn:t.ffn,blockCount:t.blockCount,ropeTheta:t.ropeTheta,rmsEps:t.rmsEps,attnLogitSoftcap:t.attnLogitSoftcap,finalLogitSoftcap:t.finalLogitSoftcap,attnScale:t.attnScale,act:t.act,rmsGainOnePlus:t.rmsGainOnePlus,embedScale:t.embedScale,rwkv:t.rwkv,lfm2:t.lfm2},tensors:r}}var gn,yr=te(()=>{"use strict";gn={f16:"F16",f32:"F32",q4:"Q4W",q8:"Q8W",q3:"Q3W"}});function hn(f,e,r){return`${f}${f.includes("?")?"&":"?"}__brik=${e}-${r}`}async function mn(){try{return await caches.open(pn)}catch{return null}}async function pt(f,e,r,t){let n=e+r-1,s=await mn(),a=hn(f,e,n);if(s){let o=await s.match(a);if(o)return{bytes:new Uint8Array(await o.arrayBuffer()),ranged:!0}}let i;for(let o=0;o<4;o++)try{let u=await fetch(f,{headers:{Range:`bytes=${e}-${n}`},signal:t});if(!u.ok&&u.status!==206)throw new Error(`range fetch ${e}-${n} \xE9chou\xE9 : HTTP ${u.status}`);let c=u.status===206,l=new Uint8Array(await u.arrayBuffer()),d=c?l:l.subarray(e,e+r);if(s&&c)try{await s.put(a,new Response(d,{headers:{"Content-Length":String(d.byteLength)}}))}catch(g){Ur(g)}return{bytes:d,ranged:c}}catch(u){if(t?.aborted)throw u;i=u,o<3&&await new Promise(c=>setTimeout(c,500*2**o))}throw i instanceof Error?i:new Error(String(i))}function Ur(f){kr||(kr=!0,console.warn("[cache] \xE9criture refus\xE9e (quota plein ? navigation priv\xE9e ?) \u2014 les t\xE9l\xE9chargements de mod\xE8les ne seront PAS r\xE9utilisables \xE0 la prochaine visite. Lib\xE9rez de l'espace via le panneau Stockage.",f))}async function bn(f){try{let n=await(await caches.open(Ar)).match(f);if(n)return new Uint8Array(await n.arrayBuffer())}catch{}let e=await fetch(f);if(!e.ok)throw new Error(`HTTP ${e.status}`);let r=new Uint8Array(await e.arrayBuffer());try{await(await caches.open(Ar)).put(f,new Response(r.slice(),{headers:{"Content-Length":String(r.byteLength)}}))}catch(t){Ur(t)}return r}function vn(f,e){return{bytes:async(r,t)=>(await pt(f,e+r,t)).bytes}}function wn(f){return{bytes:async(e,r)=>f.subarray(e,e+r)}}async function Gr(f){let e=await pt(f,0,12);if(!e.ranged){let a=await bn(f),{manifest:i,data:o}=mr(a);return Pr(i,wn(o))}let r=new DataView(e.bytes.buffer,e.bytes.byteOffset,12).getUint32(8,!0),t=await pt(f,0,12+r),{manifest:n,dataStart:s}=gt(t.bytes);return Pr(n,vn(f,s))}function Pr(f,e){if(f.model?.uiArch==="image")throw new Error("Ce fichier est un BRIK image (UNet/CLIP) \u2014 il se charge via la tuile de g\xE9n\xE9ration d'image, pas comme un LLM.");return{source:e,manifest:wr(f),tokenizerId:f.tokenizer?.id,tokenizer:f.tokenizer,uiArch:f.model?.uiArch,modelName:f.model.name}}var pn,kr,Ar,_r=te(()=>{"use strict";"use client";dt();gr();br();yr();pn="brik-range-v1";kr=!1;Ar="brimkern-model-cache"});function yn(f){let e=f.indexOf("<think>");if(e===-1)return f;let r=f.indexOf("</think>",e);return(r===-1?f.slice(0,e):f.slice(0,e)+f.slice(r+8)).trim()}function Br(f,e,r){f=f.map(n=>n.role==="assistant"?{...n,content:yn(n.content)}:n);let t="";if(e==="deepseek"){t+="<\uFF5Cbegin\u2581of\u2581sentence\uFF5C>",r.trim()&&(t+=r);for(let n of f)n.role==="user"?t+=`<\uFF5CUser\uFF5C>${n.content}`:n.role==="assistant"&&(t+=`<\uFF5CAssistant\uFF5C>${n.content}<\uFF5Cend\u2581of\u2581sentence\uFF5C>`);return t+="<\uFF5CAssistant\uFF5C>",t}if(e==="rwkv7"){r.trim()&&(t+=`System: ${r.trim()}

`);for(let n of f)n.role==="user"?t+=`User: ${n.content.trim()}

`:n.role==="assistant"&&(t+=`Assistant: ${n.content.trim()}

`);return t+="Assistant:",t}if(e==="qwen"||e==="qwen3"||e==="lfm2"||e==="smollm3"){r.trim()&&(t+=`<|im_start|>system
${r}<|im_end|>
`);for(let n of f)t+=`<|im_start|>${n.role}
${n.content}<|im_end|>
`;t+=`<|im_start|>assistant
`}else if(e==="llama3"){t+="<|begin_of_text|>",r.trim()&&(t+=`<|start_header_id|>system<|end_header_id|>

${r}<|eot_id|>`);for(let n of f)t+=`<|start_header_id|>${n.role}<|end_header_id|>

${n.content}<|eot_id|>`;t+=`<|start_header_id|>assistant<|end_header_id|>

`}else if(e==="mistral3"){t+="<s>",r.trim()&&(t+=`[SYSTEM_PROMPT]${r}[/SYSTEM_PROMPT]`);for(let n of f)n.role==="user"?t+=`[INST]${n.content}[/INST]`:n.role==="assistant"&&(t+=`${n.content}</s>`)}else if(e==="gemma"||e==="gemma3"){r.trim()&&(t+=`<start_of_turn>model
${r}<end_of_turn>
`);for(let n of f)t+=`<start_of_turn>${n.role==="assistant"?"model":"user"}
${n.content}<end_of_turn>
`;t+=`<start_of_turn>model
`}return t}var xr=te(()=>{"use strict"});function kn(){let f=[];for(let s=33;s<=126;s++)f.push(s);for(let s=161;s<=172;s++)f.push(s);for(let s=174;s<=255;s++)f.push(s);let e=f.slice(),r=0;for(let s=0;s<256;s++)f.includes(s)||(f.push(s),e.push(256+r),r++);let t=new Array(256),n=new Map;for(let s=0;s<f.length;s++)t[f[s]]=String.fromCodePoint(e[s]),n.set(String.fromCodePoint(e[s]),f[s]);return{enc:t,dec:n}}var Fr,Ye,qr=te(()=>{"use strict";Fr="'(?:[sdmt]|ll|ve|re)| ?\\p{L}+| ?\\p{N}+| ?[^\\s\\p{L}\\p{N}]+|\\s+(?!\\S)|\\s+",Ye=class f{constructor(e){this.vocab=new Map;this.idToTok=new Map;this.ranks=new Map;this.added=[];this.specialIds=new Set;this.addedRe=null;this.bosIds=[];this.cache=new Map;let r=typeof e=="string"?JSON.parse(e):e;if(r?.model?.type!=="BPE")throw new Error(`BpeTokenizer : model.type ${r?.model?.type} non couvert (BPE uniquement)`);({enc:this.byteEnc,dec:this.byteDec}=kn());for(let[i,o]of Object.entries(r.model.vocab))this.vocab.set(i,o),this.idToTok.set(o,i);(r.model.merges??[]).forEach((i,o)=>this.ranks.set(Array.isArray(i)?`${i[0]} ${i[1]}`:i,o));for(let i of r.added_tokens??[])this.added.push(i),this.vocab.set(i.content,i.id),this.idToTok.set(i.id,i.content),i.special&&this.specialIds.add(i.id);if(this.added.length){let i=this.added.map(o=>o.content.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).sort((o,u)=>u.length-o.length);this.addedRe=new RegExp(`(${i.join("|")})`,"g")}let n=f.findSplitPattern(r.pre_tokenizer)??Fr;this.splitRe=new RegExp(n,"gu");let s=i=>{if(!i)return null;if(i.type==="TemplateProcessing")return i.single;if(i.type==="Sequence")for(let o of i.processors??[]){let u=s(o);if(u)return u}return null},a=s(r.post_processor);if(Array.isArray(a))for(let i of a)if(i.SpecialToken){let o=this.vocab.get(i.SpecialToken.id);o!==void 0&&this.bosIds.push(o)}else break}static findSplitPattern(e){if(!e)return null;if(e.type==="Split"&&e.pattern?.Regex)return e.pattern.Regex;if(e.type==="ByteLevel"&&e.use_regex!==!1)return Fr;if(e.type==="Sequence")for(let r of e.pretokenizers??[]){let t=f.findSplitPattern(r);if(t)return t}return null}bpe(e){let r=this.cache.get(e);if(r)return r;let t=Array.from(e);for(;t.length>1;){let s=-1,a=1/0;for(let i=0;i<t.length-1;i++){let o=this.ranks.get(`${t[i]} ${t[i+1]}`);o!==void 0&&o<a&&(a=o,s=i)}if(s<0)break;t=[...t.slice(0,s),t[s]+t[s+1],...t.slice(s+2)]}let n=[];for(let s of t){let a=this.vocab.get(s);if(a!==void 0)n.push(a);else for(let i of s){let o=this.vocab.get(i);o!==void 0&&n.push(o)}}return this.cache.set(e,n),n}encodeChunk(e){let r=[];for(let t of e.match(this.splitRe)??[]){let n=new TextEncoder().encode(t),s="";for(let a of n)s+=this.byteEnc[a];r.push(...this.bpe(s))}return r}encode(e){let r=[...this.bosIds];if(this.addedRe)for(let t of e.split(this.addedRe)){if(!t)continue;let n=this.vocab.get(t);n!==void 0&&this.added.some(s=>s.content===t)?r.push(n):r.push(...this.encodeChunk(t))}else r.push(...this.encodeChunk(e));return r}decode(e){let r=[];for(let t of e){if(this.specialIds.has(t))continue;let n=this.idToTok.get(t);if(n!==void 0)for(let s of n){let a=this.byteDec.get(s);if(a!==void 0)r.push(a);else for(let i of new TextEncoder().encode(s))r.push(i)}}return new TextDecoder("utf-8",{fatal:!1}).decode(new Uint8Array(r))}}});async function Gn(f,e){let r=new $e;if(!await r.init())throw new Error("WebGPU indisponible sur ce navigateur.");r.onLost=g=>{console.warn("[brimkern] device GPU perdu ("+(g?.reason||"unknown")+") \u2014 rechargement au prochain appel"),ke.delete(f)},await r.selfValidate(),e("t\xE9l\xE9chargement du mod\xE8le\u2026");let t=await Gr(f),n=t.manifest;if(!n?.config?.lfm2){let g=n?.arch??n?.config?.arch??"unknown";throw new Error(`Brimkern SDK v0 runs LFM2 .brik models only \u2014 this file's architecture is "${g}". Use the default model (omit \`model\`), or convert/pick an LFM2 .brik. Full model support lives in the app: https://brimkern.com/chat`)}let s=n.tensors["token_embd.weight"],a={arch:{...n.config,arch:"lfm2",vocab:s?s.nElems/n.config.d:0},tensors:Object.fromEntries(Object.entries(n.tensors).map(([g,p])=>[g,{dtype:Pn[p.type]??p.type,shape:p.shape,nElems:p.nElems,shard:0,offset:p.offset,byteLength:p.bytes}])),shards:[{id:0,file:"",byteLength:0}],chat:{template:"chatml",stopTokenIds:[7,2,8,10,12]}},i=Object.values(n.tensors).reduce((g,p)=>g+p.bytes,0),o=0,u=dr(n.tensors,t.source),c=async g=>{let p=n.tensors[g];if(!p)throw new Error(`tenseur absent : ${g}`);let h=await u(g);return o+=p.bytes,e("t\xE9l\xE9chargement du mod\xE8le\u2026",{loaded:o,total:i}),h};e("tokenizer\u2026");let l;try{let g=new Ye(t.tokenizer.json);l={encode:p=>g.encode(p),decode:p=>g.decode(p)}}catch(g){console.warn("[brimkern] tokenizer.json non couvert par le BPE bundl\xE9 \u2014 repli transformers.js (CDN)",g);let p=await import(An),h=new p.PreTrainedTokenizer(JSON.parse(t.tokenizer.json),JSON.parse(t.tokenizer.config));l={encode:b=>Array.from(h(b).input_ids.data,k=>Number(k)),decode:b=>h.decode(b,{skip_special_tokens:!0})}}let d=new Ie(r,a,c);return e("poids sur le GPU\u2026"),await d.load(l),{core:d,engine:r}}function Ke(f){return f&&(f.startsWith("https://")||/^http:\/\/(localhost|127\.0\.0\.1)[:/]/.test(f))?f:Sr[f||"lfm2.5-230m"]||Sr["lfm2.5-230m"]}function Je(f,e){let r=ke.get(f);if(!r){let t={status:"initialisation\u2026",state:"loading",listeners:new Set,promise:null};t.promise=Gn(f,(n,s)=>{t.status=n,t.progress=s,t.listeners.forEach(a=>a(n,s))}).then(n=>(t.state="ready",n)).catch(n=>{throw t.state="error",ke.delete(f),n}),ke.set(f,t),r=t}return e&&(e(r.status,r.progress),r.listeners.add(e),r.promise.finally(()=>r.listeners.delete(e)).catch(()=>{})),r.promise}async function Or(f,e){let r=await Je(f,e);return r.engine.lost?(ke.delete(f),(await Je(f,e)).core):r.core}async function Mr(f,e){let r=await Or(f);try{return await e(r)}catch(t){let n=ke.get(f);if(!(!n||await n.promise.then(a=>a.engine.lost).catch(()=>!0)))throw t;return console.warn("[brimkern] g\xE9n\xE9ration interrompue par une perte de device \u2014 nouvelle tentative"),ke.delete(f),e(await Or(f))}}function _n(f,e){let r=f.replace(/<\|[a-z_]+\|>/g,"");if(e){let t=r.replace(/^\s*(hello|hi|hey|bonjour|salut)\s*[!,.]\s*/i,"");t.trim()&&(r=t)}return r.trimEnd()}async function Tr(f,e,r,t,n,s,a,i=[]){let o=Br([...i,...e.slice(-Un)],"lfm2",r),u=i.some(d=>d.role==="assistant")||e.some(d=>d.role==="assistant"),c="";return await(f.residentAvailable?.()?f.generateResident.bind(f):f.generate.bind(f))(o,t,d=>{c=_n(d,u),s?.(c)},a,{sample:!0,temperature:n,topK:40,repeatPenalty:1.3}),c}var An,Sr,Pn,Un,ke,ht=te(()=>{"use strict";or();lr();_r();dt();xr();qr();An="https://esm.sh/@huggingface/transformers@4.2.0",Sr={"lfm2.5-230m":"https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik"},Pn={F16:"f16",F32:"f32",Q4W:"q4",Q8W:"q8",Q3W:"q3"},Un=12;ke=new Map});var Cr={};Qt(Cr,{LocalBackend:()=>Ee});var Ee,mt=te(()=>{"use strict";ht();Ee=class{constructor(){this.kind="main"}async preload(e,r){await Je(e,r)}state(e){return ke.get(e)?.state}turn(e,r,t){return Mr(e.url,n=>Tr(n,e.history,e.system,e.maxTokens,e.temperature,r,()=>!!t?.aborted,e.pinned))}dispose(){}}});function Bn(){try{if(typeof document>"u")return"";let f=document.currentScript;if(f?.src)return new URL(f.src,document.baseURI).href}catch{}return""}function Rr(f){Dr=f}function Lr(){return Dr||xn}var xn,Dr,bt=te(()=>{"use strict";xn=Bn(),Dr=""});var jr={};Qt(jr,{WorkerBackend:()=>vt});var vt,zr=te(()=>{"use strict";bt();vt=class{constructor(){this.kind="worker";this.seq=0;this.pending=new Map;this.states=new Map;if(typeof Worker>"u")throw new Error("Worker indisponible");let e=Lr();if(!e)throw new Error("URL du script introuvable (import ESM ?) \u2014 passez workerUrl");let r=(()=>{try{return location.search}catch{return""}})(),t=`self.__brimkernSearch=${JSON.stringify(r)};importScripts(${JSON.stringify(e)});`,n=new Blob([t],{type:"text/javascript"});this.url=URL.createObjectURL(n),this.worker=new Worker(this.url);let s,a;this.hello=new Promise((i,o)=>{s=i,a=o}),this.worker.onerror=i=>a(new Error(`worker: ${i.message||"\xE9chec de chargement"}`)),this.worker.onmessage=i=>{let o=i.data;if(o.type==="hello"){s();return}let u=this.pending.get(o.id);if(u){if(o.type==="progress"){u.onProgress?.(o.status,o.progress);return}if(o.type==="token"){u.onToken?.(o.text);return}this.pending.delete(o.id),o.type==="error"?u.reject(new Error(o.message)):o.type==="state"?u.resolve(o.state):u.resolve(o.text??"")}}}ready(){return this.hello}send(e,r={}){let t=++this.seq,n=new Promise((s,a)=>{this.pending.set(t,{resolve:s,reject:a,...r}),this.worker.postMessage({...e,id:t})});return{id:t,done:n}}async preload(e,r){await this.hello,this.states.get(e)!=="ready"&&this.states.set(e,"loading");try{await this.send({type:"preload",url:e},{onProgress:r}).done,this.states.set(e,"ready")}catch(t){throw this.states.set(e,"error"),t}}state(e){return this.states.get(e)}async turn(e,r,t){await this.hello;let{id:n,done:s}=this.send({type:"turn",req:e},{onToken:r}),a=()=>this.worker.postMessage({type:"stop",id:n});t?.aborted?a():t?.addEventListener("abort",a,{once:!0});try{let i=await s;return this.states.set(e.url,"ready"),i}finally{t?.removeEventListener("abort",a)}}dispose(){this.worker.terminate(),URL.revokeObjectURL(this.url);for(let e of this.pending.values())e.reject(new Error("worker arr\xEAt\xE9"));this.pending.clear()}}});var Fn={};var wt,Xe,Oe,Er=te(()=>{"use strict";mt();wt=new Ee,Xe=new Set,Oe=f=>self.postMessage(f);self.onmessage=async f=>{let e=f.data;if(e.type==="stop"){Xe.add(e.id);return}if(e.type==="state"){Oe({type:"state",id:e.id,state:wt.state(e.url)});return}try{if(e.type==="preload"){await wt.preload(e.url,(r,t)=>Oe({type:"progress",id:e.id,status:r,progress:t})),Oe({type:"done",id:e.id});return}if(e.type==="turn"){let r=new AbortController,t=new Proxy(r.signal,{get:(u,c)=>c==="aborted"?Xe.has(e.id):Reflect.get(u,c)}),n=16,s=0,a=null,i=()=>{a!==null&&(Oe({type:"token",id:e.id,text:a}),a=null,s=Date.now())},o=await wt.turn(e.req,u=>{a=u,Date.now()-s>=n&&i()},t);i(),Oe({type:"done",id:e.id,text:o}),Xe.delete(e.id);return}}catch(r){Xe.delete(e.id),Oe({type:"error",id:e.id,message:r instanceof Error?r.message:String(r)})}};Oe({type:"hello"})});var Jr=new Set(["avec","pour","dans","les","des","une","est","sur","par","que","qui","quoi","comment","pourquoi","quand","vous","nous","votre","notre","mais","plus","tout","tous","cette","sont","avez","puis","faire","fait","the","and","for","with","what","who","how","why","when","about","your","our","you","are","can","does","did","this","that","from","have"]);function Vt(f){let e=(f.toLowerCase().match(/[\p{L}\p{N}]{3,}/gu)??[]).filter(r=>!Jr.has(r));return[...new Set(e)]}function $t(f,e=600){let r=[];return f.forEach((t,n)=>{let s=(t.title||"").trim(),a=(t.text||"").split(/\n\s*\n+/).map(u=>u.trim()).filter(Boolean),i="",o=()=>{i.trim()&&r.push({title:s,text:i.trim(),doc:n}),i=""};for(let u of a){if(u.length>e*1.6){o();let c=u.split(/(?<=[.!?])\s+/),l="";for(let d of c)l&&(l+" "+d).length>e?(r.push({title:s,text:l.trim(),doc:n}),l=d):l=l?`${l} ${d}`:d;l.trim()&&r.push({title:s,text:l.trim(),doc:n});continue}i&&(i+`

`+u).length>e&&o(),i=i?`${i}

${u}`:u}o()}),r}function Xr(f,e,r){if(!f.length)return 0;let t=`${e.title} ${e.text}`.toLowerCase(),n=e.title.toLowerCase(),s=0,a=0;for(let i of f){let o=r.get(i)??1;a+=o,t.includes(i)&&(s+=o*(n.includes(i)?1.5:1))}return a?s/a:0}function Zr(f){let e=new Map;for(let n of f)for(let s of Vt(`${n.title} ${n.text}`))e.set(s,(e.get(s)??0)+1);let r=new Map,t=Math.max(1,f.length);for(let[n,s]of e)r.set(n,Math.log(1+t/s));return r}function It(f,e,r=1200,t=3,n=.34){let s=Vt(f);if(!s.length||!e.length)return[];let a=Zr(e),i=e.map(l=>({c:l,s:Xr(s,l,a)})).filter(l=>l.s>=n).sort((l,d)=>d.s-l.s),o=[],u=new Set,c=r;for(let{c:l}of i)o.length>=t||l.text.length>c||u.has(l.doc)||(o.push(l),u.add(l.doc),c-=l.text.length);for(let{c:l}of i){if(o.length>=t)break;o.includes(l)||l.text.length>c||(o.push(l),c-=l.text.length)}return o}function Yt(f){return f.length?`

Answer using ONLY the reference notes below. If the answer is not in them, say you do not have that information \u2014 never fill the gap with what you assume.

--- NOTES ---
${f.map((r,t)=>`[${t+1}]${r.title?` ${r.title}`:""}
${r.text}`).join(`

`)}
--- END OF NOTES ---`:`

No reference note matches this question. Say that you do not have this information \u2014 do not guess.`}function Jt(f){let e=Array.isArray(f)?f:[f],r=[];for(let t of e)typeof t=="string"&&t.trim()?r.push({text:t}):t&&typeof t=="object"&&typeof t.text=="string"&&t.text.trim()&&r.push({title:t.title,text:t.text});return r}ht();async function Kr(f){let{LocalBackend:e}=await Promise.resolve().then(()=>(mt(),Cr));if(f!==!0)return new e;try{let{WorkerBackend:r}=await Promise.resolve().then(()=>(zr(),jr)),t=new r;return await t.ready(),t}catch(r){return console.warn("[brimkern] Web Worker indisponible \u2014 inf\xE9rence sur le thread principal",r),new e}}bt();var qn=typeof self<"u"&&typeof self.importScripts=="function"&&typeof document>"u";qn&&Promise.resolve().then(()=>(Er(),Fn));var Ze=null,kt=null,yt;function He(){return Ze||(Ze=Kr(yt).then(f=>(kt=f,f))),Ze}var Sn=()=>kt?.kind??"pending";function At(f){if(f.workerUrl&&Rr(f.workerUrl),f.worker!==void 0){if(Ze&&yt!==f.worker){console.warn("[brimkern] option `worker` ignor\xE9e : le backend est d\xE9j\xE0 d\xE9marr\xE9 et partag\xE9 par la page.");return}yt=f.worker}}var On=`
Answer briefly and honestly. If you do not know something, say so \u2014 never invent facts or details.
You have no tools and no internet access: never emit tool calls, reply in plain text only.`;function Nr(f){let e=(f.system||"You are a helpful assistant.")+On,r=a=>a.flatMap(i=>[{role:"user",content:i.user},{role:"assistant",content:i.assistant}]);if(!f.knowledge)return{system:()=>e,userTurn:a=>a,pinned:r(f.examples||[])};let t=$t(Jt(f.knowledge)),n=f.knowledgeBudget??1200,s=e+`

The user message may include reference notes between --- markers. When it does, answer from those notes and quote their figures exactly. When it says no note matches, say you do not have that information.`;return{system:()=>s,userTurn:a=>Yt(It(a,t,n)).trim()+`

Question: ${a}`,pinned:r([...Mn(),...f.examples||[]])}}function Mn(){return[{user:`--- NOTES ---
[1] Opening hours
The workshop is open on Thursday until 8pm.
--- END OF NOTES ---

Question: Are you open on Thursday evening?`,assistant:"Yes \u2014 the workshop is open on Thursday until 8pm."},{user:`No reference note matches this question.

Question: Who won the 1998 World Cup?`,assistant:"I do not have that information in my notes."}]}function Wr(f={}){At(f);let e=Ke(f.model),r=f.maxTokens||220,t=f.temperature??.55,n=Nr(f),s=n.pinned,a=[],i=!1,o=!1;return{async ask(u,c={}){if(o)throw new Error("session d\xE9truite");if(i)throw new Error("g\xE9n\xE9ration d\xE9j\xE0 en cours sur cette session");i=!0,a.push({role:"user",content:u});try{let l=[...a.slice(0,-1),{role:"user",content:n.userTurn(u)}],d={url:e,history:l,system:n.system(u),maxTokens:r,temperature:t,pinned:s},g=await(await He()).turn(d,c.onToken,c.signal);return c.signal?.aborted?(a.pop(),""):(a.push({role:"assistant",content:g}),g)}catch(l){throw a.pop(),l}finally{i=!1}},reset(){a=[]},destroy(){o=!0,a=[]},get history(){return a.slice()}}}function Tn(f){if(document.getElementById("bk-style"))return;let e=document.createElement("style");e.id="bk-style",e.textContent=`
  .bk-fab{position:fixed;right:20px;bottom:20px;width:56px;height:56px;border-radius:16px;background:${f};color:#fff;border:none;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.25);font-size:24px;z-index:2147483000;display:flex;align-items:center;justify-content:center;transition:transform .15s}
  .bk-fab:hover{transform:translateY(-2px)}
  .bk-panel{position:fixed;right:20px;bottom:88px;width:360px;max-width:calc(100vw - 40px);height:520px;max-height:calc(100vh - 120px);background:#f2efe8;border:1px solid #e0dccf;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.28);z-index:2147483000;display:none;flex-direction:column;overflow:hidden;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;color:#1a1a1a}
  .bk-panel.bk-open{display:flex}
  .bk-hd{padding:12px 14px;background:#fff;border-bottom:1px solid #ece8dd;display:flex;align-items:center;gap:8px;font-weight:700;font-size:14px}
  .bk-hd .bk-dot{width:8px;height:8px;border-radius:50%;background:${f}}
  .bk-hd .bk-x{margin-left:auto;background:none;border:none;cursor:pointer;color:#8b887f;font-size:18px;line-height:1}
  .bk-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px}
  .bk-m{max-width:82%;padding:8px 12px;border-radius:12px;font-size:14px;line-height:1.45;white-space:pre-wrap;word-wrap:break-word}
  .bk-m.bk-u{align-self:flex-end;background:${f};color:#fff;border-bottom-right-radius:4px}
  .bk-m.bk-a{align-self:flex-start;background:#fff;border:1px solid #ece8dd;border-bottom-left-radius:4px}
  .bk-foot{padding:10px;border-top:1px solid #ece8dd;background:#fff;display:flex;gap:8px}
  .bk-in{flex:1;border:1px solid #e0dccf;border-radius:10px;padding:9px 11px;font-size:14px;font-family:inherit;background:#fff;color:#1a1a1a;resize:none;outline:none}
  .bk-in:focus{border-color:${f}}
  .bk-send{background:${f};color:#fff;border:none;border-radius:10px;padding:0 14px;cursor:pointer;font-size:14px}
  .bk-send:disabled{opacity:.5;cursor:default}
  .bk-note{font-size:10.5px;color:#8b887f;text-align:center;padding:4px 8px 8px}
  `,document.head.appendChild(e)}function Cn(f){if(!f)return"#c72c1e";if(/^#[0-9a-fA-F]{3,8}$/.test(f))return f;try{if(typeof CSS<"u"&&CSS.supports("color",f)&&!/[{};()]/.test(f))return f}catch{}return"#c72c1e"}function Hr(f){let e=Nr(f),r=Cn(f.accent),t=f.title||"Assistant",n=f.maxTokens||220;Tn(r);let s=document.createElement("button");s.className="bk-fab",s.setAttribute("aria-label","Ouvrir le chat"),s.textContent="\u{1F4AC}";let a=document.createElement("div");a.className="bk-panel",a.innerHTML=`
    <div class="bk-hd"><span class="bk-dot"></span><span>${Dn(t)}</span><button class="bk-x" aria-label="Fermer">\xD7</button></div>
    <div class="bk-msgs"></div>
    <div class="bk-foot"><textarea class="bk-in" rows="1" placeholder="\xC9cris un message\u2026"></textarea><button class="bk-send">\u2191</button></div>
    <div class="bk-note">IA locale \u2014 tourne sur votre GPU, aucune donn\xE9e envoy\xE9e.</div>`,document.body.appendChild(s),document.body.appendChild(a);let i=a.querySelector(".bk-msgs"),o=a.querySelector(".bk-in"),u=a.querySelector(".bk-send"),c=[],l=!1,d=!1,g=(k,B)=>{let M=document.createElement("div");return M.className=`bk-m ${k==="user"?"bk-u":"bk-a"}`,M.textContent=B,i.appendChild(M),i.scrollTop=i.scrollHeight,M};f.greeting&&(c.push({role:"assistant",content:f.greeting}),g("assistant",f.greeting));let p=Ke(f.model),h=()=>{if(!d){d=!0;let k=g("assistant","Initialisation\u2026");k.classList.add("bk-status"),He().then(B=>B.preload(p,(M,F)=>{k.textContent=F?.total?`${M} ${Math.round(F.loaded/1048576)} / ${Math.round(F.total/1048576)} Mo`:M})).then(()=>k.remove()).catch(B=>{k.textContent="Erreur : "+(B?.message||B),d=!1})}return He()},b=async()=>{let k=o.value.trim();if(!k||l)return;l=!0,u.disabled=!0,o.value="",c.push({role:"user",content:k}),g("user",k);let B=g("assistant","\u2026");try{await h();let M=[...c.slice(0,-1),{role:"user",content:e.userTurn(k)}],F={url:p,history:M,system:e.system(k),maxTokens:n,temperature:.55,pinned:e.pinned},C=await(await He()).turn(F,j=>{B.textContent=j||"\u2026",i.scrollTop=i.scrollHeight});C||(C="Sorry, I can only answer in plain text here \u2014 could you rephrase?"),B.textContent=C,c.push({role:"assistant",content:C})}catch(M){B.textContent="Erreur : "+(M?.message||String(M))}finally{l=!1,u.disabled=!1,o.focus()}};s.onclick=()=>{a.classList.toggle("bk-open")&&(o.focus(),h())},a.querySelector(".bk-x").onclick=()=>a.classList.remove("bk-open"),u.onclick=()=>{b()},o.onkeydown=k=>{k.key==="Enter"&&!k.shiftKey&&(k.preventDefault(),b())}}function Dn(f){return f.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}var Rn=(f={})=>{if(typeof window>"u"||typeof document>"u"){console.warn("[brimkern] embed() ignor\xE9 : aucun DOM (rendu serveur ?). Appelez-le dans un effet client.");return}At(f),document.body?Hr(f):window.addEventListener("DOMContentLoaded",()=>Hr(f))};var Ln=async f=>{if(typeof f!="object"||f===null||typeof f.prompt!="string")throw new TypeError(`Brimkern.generate expects a single object: generate({ prompt: "\u2026", model?, system? }). Received ${typeof f}${typeof f=="object"&&f?" without a `prompt` string":""}.`);return Wr(f).ask(f.prompt,{onToken:f.onToken,signal:f.signal})},jn=(f={})=>(At(f),typeof navigator<"u"&&"gpu"in navigator?He().then(e=>e.preload(Ke(f.model),f.onProgress)).then(()=>!0).catch(()=>!1):Promise.resolve(!1)),zn=f=>typeof navigator>"u"||!("gpu"in navigator)?"unavailable":kt?.state(Ke(f))??"idle";typeof window<"u"&&(window.Brimkern={embed:Rn,createSession:Wr,generate:Ln,preload:jn,status:zn,runtime:Sn});})();
