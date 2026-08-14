"use strict";(()=>{var Ir=Object.defineProperty;var te=(f,e,r)=>()=>{if(r)throw r[0];try{return f&&(e=f(f=0)),e}catch(t){throw r=[t],t}};var Qt=(f,e)=>{for(var r in e)Ir(f,r,{get:e[r],enumerable:!0})};function Ue(f){let e=new Float32Array(1),r=new Uint32Array(e.buffer);e[0]=f;let t=r[0],n=t>>16&32768,s=(t>>23&255)-127+15,a=t&8388607;return s<=0?n:s>=31?n|31743:(a=(a>>13)+(a>>12&1),a===1024&&(a=0,s+=1),n|s<<10|a&1023)}function ue(f){let e=f>>15&1,r=f>>10&31,t=f&1023,n;return r===0?n=t*59604645e-15:r===31?n=t?NaN:1/0:n=(1+t/1024)*2**(r-15),e===1?-n:n}var Ce=te(()=>{"use strict"});function Oe(f){let e=f.length;if(e%me!==0)throw new Error(`q4web: length ${e} not a multiple of ${me}`);let r=e/me,t=new Uint8Array(e/2),n=new Uint16Array(r),s=new Uint16Array(r);for(let a=0;a<r;a++){let i=a*me,o=1/0,u=-1/0;for(let p=0;p<me;p++){let v=f[i+p];v<o&&(o=v),v>u&&(u=v)}let c=(u-o)/15||1e-8,l=Ue(c),d=Ue(o);n[a]=l,s[a]=d;let g=ue(l)||1e-8,h=ue(d);for(let p=0;p<me;p++){let v=Math.round((f[i+p]-h)/g);v=v<0?0:v>15?15:v;let y=i+p;(p&1)===0?t[y>>1]=v:t[y>>1]|=v<<4}}return{nibbles:t,scales:n,mins:s,nElems:e}}function Pe(f,e){let r=e/me,t=e/2,n=f.slice(0,t),s=new Uint16Array(r),a=new Uint16Array(r),i=new DataView(f.buffer,f.byteOffset);for(let o=0;o<r;o++)s[o]=i.getUint16(t+o*2,!0);for(let o=0;o<r;o++)a[o]=i.getUint16(t+r*2+o*2,!0);return{nibbles:n,scales:s,mins:a,nElems:e}}function ge(f){let e=new Float32Array(f.nElems),r=f.nElems/me;for(let t=0;t<r;t++){let n=ue(f.scales[t]),s=ue(f.mins[t]),a=t*me;for(let i=0;i<me;i++){let o=a+i,u=f.nibbles[o>>1],c=(i&1)===0?u&15:u>>4;e[o]=c*n+s}}return e}var me,at=te(()=>{"use strict";Ce();me=32});function De(f){let e=f.length;if(e%be!==0)throw new Error(`q8web: length ${e} not a multiple of ${be}`);let r=e/be,t=new Int8Array(e),n=new Uint16Array(r);for(let s=0;s<r;s++){let a=s*be,i=0;for(let l=0;l<be;l++){let d=Math.abs(f[a+l]);d>i&&(i=d)}let o=i/127||1e-8,u=Ue(o);n[s]=u;let c=ue(u)||1e-8;for(let l=0;l<be;l++){let d=Math.round(f[a+l]/c);d=d<-127?-127:d>127?127:d,t[a+l]=d}}return{codes:t,scales:n,nElems:e}}function xe(f,e){let r=e/be,t=new Int8Array(f.buffer.slice(f.byteOffset,f.byteOffset+e)),n=new Uint16Array(r),s=new DataView(f.buffer,f.byteOffset);for(let a=0;a<r;a++)n[a]=s.getUint16(e+a*2,!0);return{codes:t,scales:n,nElems:e}}function ve(f){let e=new Float32Array(f.nElems),r=f.nElems/be;for(let t=0;t<r;t++){let n=ue(f.scales[t]),s=t*be;for(let a=0;a<be;a++)e[s+a]=f.codes[s+a]*n}return e}var be,ot=te(()=>{"use strict";Ce();be=32});function Xt(f){let e=f.length;if(e%we!==0)throw new Error(`q3web: length ${e} not a multiple of ${we}`);let r=e/we,t=new Uint32Array(e/16),n=new Uint32Array(e/32),s=new Uint16Array(r),a=new Uint16Array(r);for(let i=0;i<r;i++){let o=i*we,u=1/0,c=-1/0;for(let v=0;v<we;v++){let y=f[o+v];y<u&&(u=y),y>c&&(c=y)}let l=(c-u)/7||1e-8,d=Ue(l),g=Ue(u);s[i]=d,a[i]=g;let h=ue(d)||1e-8,p=ue(g);for(let v=0;v<we;v++){let y=Math.round((f[o+v]-p)/h);y=y<0?0:y>7?7:y;let P=o+v;t[P>>4]|=(y&3)<<(P&15)*2,n[P>>5]|=y>>2<<(P&31)}}return{lo:t,hi:n,scales:s,mins:a,nElems:e}}function ut(f,e){let r=e/we,t=e/16,n=e/32,s=t*4,a=n*4,i=new DataView(f.buffer,f.byteOffset),o=new Uint32Array(t),u=new Uint32Array(n),c=new Uint16Array(r),l=new Uint16Array(r);for(let h=0;h<t;h++)o[h]=i.getUint32(h*4,!0);for(let h=0;h<n;h++)u[h]=i.getUint32(s+h*4,!0);let d=s+a,g=d+r*2;for(let h=0;h<r;h++)c[h]=i.getUint16(d+h*2,!0);for(let h=0;h<r;h++)l[h]=i.getUint16(g+h*2,!0);return{lo:o,hi:u,scales:c,mins:l,nElems:e}}function We(f){let e=new Float32Array(f.nElems),r=f.nElems/we;for(let t=0;t<r;t++){let n=ue(f.scales[t]),s=ue(f.mins[t]),a=t*we;for(let i=0;i<we;i++){let o=a+i,u=f.lo[o>>4]>>(o&15)*2&3|(f.hi[o>>5]>>(o&31)&1)<<2;e[o]=u*n+s}}return e}var we,Zt=te(()=>{"use strict";Ce();we=32});var er,tr,rr=te(()=>{"use strict";er={matmul:`
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
	}`});var Qe,nr=te(()=>{"use strict";Qe=class{constructor(e){this.sets=[];this.cur=0;this.next=0;this.names=[];this.acc=new Map;this.dropped=0;this.pending=[];this.device=e;let r=globalThis;for(let t=0;t<2;t++)this.sets.push({qs:e.createQuerySet({type:"timestamp",count:4096}),resolve:e.createBuffer({size:4096*8,usage:r.GPUBufferUsage.QUERY_RESOLVE|r.GPUBufferUsage.COPY_SRC}),read:e.createBuffer({size:4096*8,usage:r.GPUBufferUsage.COPY_DST|r.GPUBufferUsage.MAP_READ}),busy:!1})}slot(e){if(this.next+2>4096&&(this.rotate(),this.next+2>4096))return this.dropped++,null;let r=this.sets[this.cur];if(r.busy)return this.dropped++,null;let t=this.next;return this.next+=2,this.names.push(e),{querySet:r.qs,beginningOfPassWriteIndex:t,endOfPassWriteIndex:t+1}}rotate(){let e=this.cur,r=this.sets[e],t=this.names,n=this.next;if(this.cur=(this.cur+1)%2,this.next=0,this.names=[],!n||r.busy)return;r.busy=!0;let s=this.device.createCommandEncoder();s.resolveQuerySet(r.qs,0,n,r.resolve,0),s.copyBufferToBuffer(r.resolve,0,r.read,0,n*8),this.device.queue.submit([s.finish()]);let a=globalThis,i=r.read.mapAsync(a.GPUMapMode.READ,0,n*8).then(()=>{let o=new BigUint64Array(r.read.getMappedRange(0,n*8).slice(0));r.read.unmap();for(let u=0;u<t.length;u++){let c=o[u*2],l=o[u*2+1];if(!c||!l||l<=c)continue;let d=Number(l-c),g=this.acc.get(t[u]);g?(g.calls++,g.ns+=d):this.acc.set(t[u],{calls:1,ns:d})}}).catch(()=>{}).finally(()=>{r.busy=!1});this.pending.push(i)}async report(){this.rotate();let e=this.pending;this.pending=[],await Promise.all(e);let r=0,t=0;for(let s of this.acc.values())r+=s.ns,t+=s.calls;return{passes:[...this.acc.entries()].map(([s,a])=>({name:s,calls:a.calls,totalMs:a.ns/1e6,meanUs:a.ns/a.calls/1e3,share:r?a.ns/r:0,reliable:a.calls>=50})).sort((s,a)=>a.totalMs-s.totalMs),totalMs:r/1e6,samples:t,dropped:this.dropped,quantumUs:100}}reset(){this.acc.clear(),this.dropped=0}destroy(){for(let e of this.sets)try{e.qs.destroy(),e.resolve.destroy(),e.read.destroy()}catch{}this.sets=[]}}});function en(){if(sr!==null)return sr;try{let f=globalThis.__brimkernSearch;if(typeof f=="string")return f}catch{}try{return typeof location<"u"?location.search:""}catch{return""}}function ce(f){try{return new URLSearchParams(en()).get(f)}catch{return null}}var sr,ir=te(()=>{"use strict";sr=null});function he(f){let e=f>>15&1,r=f>>10&31,t=f&1023,n;return r===0?n=t*59604645e-15:r===31?n=65504:n=(1+t/1024)*2**(r-15),e===1?-n:n}function Fe(f){let e=new Float32Array(1),r=new Uint32Array(e.buffer);e[0]=f;let t=r[0],n=t>>16&32768,s=(t>>23&255)-127+15,a=t&8388607;return s<=0?n:s>=31?n|31743:(a=(a>>13)+(a>>12&1),a===1024&&(a=0,s+=1),n|s<<10|a&1023)}function tn(f,e){let r=new Float32Array(e*256),t=new DataView(f.buffer,f.byteOffset);for(let n=0;n<e;n++){let s=n*144,a=he(t.getUint16(s,!0)),i=he(t.getUint16(s+2,!0)),o=d=>{let g=h=>f[s+4+h];return d<4?[g(d)&63,g(d+4)&63]:[g(d+4)&15|g(d-4)>>6<<4,g(d+4)>>4|g(d)>>6<<4]},u=n*256,c=0,l=0;for(let d=0;d<256;d+=64){let[g,h]=o(c),p=a*g,v=i*h,[y,P]=o(c+1),O=a*y,q=i*P;for(let T=0;T<32;T++){let z=f[s+16+l+T];r[u+d+T]=p*(z&15)-v,r[u+d+32+T]=O*(z>>4)-q}l+=32,c+=2}}return r}function Re(f){return f>127?f-256:f}function rn(f,e){let r=new Float32Array(e*32),t=new DataView(f.buffer,f.byteOffset);for(let n=0;n<e;n++){let s=n*34,a=he(t.getUint16(s,!0));for(let i=0;i<32;i++)r[n*32+i]=a*Re(f[s+2+i])}return r}function nn(f,e){let r=new Float32Array(e*32),t=new DataView(f.buffer,f.byteOffset);for(let n=0;n<e;n++){let s=n*22,a=he(t.getUint16(s,!0)),i=t.getUint32(s+2,!0);for(let o=0;o<16;o++){let u=f[s+6+o],c=i>>>o<<4&16,l=i>>>o+12&16;r[n*32+o]=a*((u&15|c)-16),r[n*32+o+16]=a*((u>>4|l)-16)}}return r}function sn(f,e){let r=new Float32Array(e*32),t=new DataView(f.buffer,f.byteOffset);for(let n=0;n<e;n++){let s=n*18,a=he(t.getUint16(s,!0));for(let i=0;i<16;i++){let o=f[s+2+i];r[n*32+i]=a*((o&15)-8),r[n*32+i+16]=a*((o>>4)-8)}}return r}function an(f,e){let r=new Float32Array(e*256),t=new DataView(f.buffer,f.byteOffset);for(let n=0;n<e;n++){let s=n*176,a=he(t.getUint16(s,!0)),i=he(t.getUint16(s+2,!0)),o=h=>{let p=v=>f[s+4+v];return h<4?[p(h)&63,p(h+4)&63]:[p(h+4)&15|p(h-4)>>6<<4,p(h+4)>>4|p(h)>>6<<4]},u=n*256,c=0,l=0,d=1,g=2;for(let h=0;h<256;h+=64){let[p,v]=o(c),y=a*p,P=i*v,[O,q]=o(c+1),T=a*O,z=i*q;for(let U=0;U<32;U++){let m=f[s+48+l+U],b=f[s+16+U];r[u+h+U]=y*((m&15)+(b&d?16:0))-P,r[u+h+32+U]=T*((m>>4)+(b&g?16:0))-z}l+=32,c+=2,d<<=2,g<<=2}}return r}function on(f,e){let r=new Float32Array(e*256),t=new DataView(f.buffer,f.byteOffset);for(let n=0;n<e;n++){let s=n*210,a=he(t.getUint16(s+208,!0)),i=n*256;for(let o=0;o<2;o++){let u=s+o*64,c=s+128+o*32,l=s+192+o*8,d=i+o*128;for(let g=0;g<32;g++){let h=g/16|0,p=f[u+g],v=f[u+g+32],y=f[c+g],P=(p&15|(y>>0&3)<<4)-32,O=(v&15|(y>>2&3)<<4)-32,q=(p>>4|(y>>4&3)<<4)-32,T=(v>>4|(y>>6&3)<<4)-32;r[d+g]=a*Re(f[l+h])*P,r[d+g+32]=a*Re(f[l+h+2])*O,r[d+g+64]=a*Re(f[l+h+4])*q,r[d+g+96]=a*Re(f[l+h+6])*T}}}return r}function qe(f,e,r,t,n){let s=new Float32Array(r*n);for(let a=0;a<r;a++)for(let i=0;i<n;i++){let o=0;for(let u=0;u<t;u++)o+=f[a*t+u]*e[u*n+i];s[a*n+i]=o}return s}function Ge(f,e,r,t,n=1e-5,s=!1){let a=new Float32Array(r*t);for(let i=0;i<r;i++){let o=0;for(let c=0;c<t;c++)o+=f[i*t+c]**2;let u=1/Math.sqrt(o/t+n);for(let c=0;c<t;c++)a[i*t+c]=f[i*t+c]*u*(s?1+e[c]:e[c])}return a}function un(f,e,r,t,n,s,a){let i=new Float32Array(f.length),o=t/2,u=s[0],c=s[0]+s[1];for(let l=0;l<r;l++){let d=Math.floor(l/n),g=l*t;for(let h=0;h<o;h++){let p=h<u?0:h<c?1:2,y=e[d*3+p]/a**(2*h/t),P=Math.cos(y),O=Math.sin(y),q=f[g+h],T=f[g+h+o];i[g+h]=q*P-T*O,i[g+h+o]=T*P+q*O}}return i}function $e(f,e,r,t,n=0,s=1e4,a){let i=new Float32Array(f.length),o=r/2;for(let u=0;u<e;u++){let c=n+Math.floor(u/t),l=u*r;for(let d=0;d<o;d++){let g=c/(s**(2*d/r)*(a?a[d]:1)),h=Math.cos(g),p=Math.sin(g),v=f[l+2*d],y=f[l+2*d+1];i[l+2*d]=v*h-y*p,i[l+2*d+1]=y*h+v*p}}return i}function cn(f,e,r,t,n,s=0,a=1e4){let i=new Float32Array(f.length),o=t/2;for(let u=0;u<r;u++){let c=s+Math.floor(u/n),l=u*t;for(let d=0;d<o;d++){let g=c/(a**(2*d/t)*e[d]),h=Math.cos(g),p=Math.sin(g),v=f[l+d],y=f[l+d+o];i[l+d]=v*h-y*p,i[l+d+o]=y*h+v*p}}return i}function Le(f,e,r,t,n=0,s=1e4){let a=new Float32Array(f.length),i=r/2;for(let o=0;o<e;o++){let u=n+Math.floor(o/t),c=o*r;for(let l=0;l<i;l++){let d=u/s**(2*l/r),g=Math.cos(d),h=Math.sin(d),p=f[c+l],v=f[c+l+i];a[c+l]=p*g-v*h,a[c+l+i]=v*g+p*h}}return a}function ct(f,e,r){return f.map((t,n)=>t+e[n%r])}function lt(f,e,r,t=!0){let n=t?f.windowPerLayer?.[r]??f.window??0:0,s=f.ropeThetaPerLayer?.[r]??f.ropeTheta,a=f.skipRopePerLayer?.[r]??f.skipRope??!1;return{...f,seq:e,window:n,ropeTheta:s,skipRope:a}}function ye(f,e,r,t,n,s,a,i=0,o,u=0,c=0){let l=new Float32Array(t*n*a),d=o??1/Math.sqrt(a),g=p=>u>0?u*Math.tanh(p/u):p,h=n/s;for(let p=0;p<t;p++)for(let v=0;v<n;v++){let y=Math.floor(v/h),P=(p*n+v)*a,O=i+p,q=c>0?Math.max(0,O+1-c):0,T=[],z=-1/0;for(let m=q;m<=O;m++){let b=(m*s+y)*a,k=0;for(let w=0;w<a;w++)k+=f[P+w]*e[b+w];let F=g(k*d);T[m]=F,F>z&&(z=F)}let U=0;for(let m=q;m<=O;m++)T[m]=Math.exp(T[m]-z),U+=T[m];for(let m=q;m<=O;m++){let b=T[m]/U,k=(m*s+y)*a;for(let F=0;F<a;F++)l[P+F]+=b*r[k+F]}}return l}function ar(f){return .5*f*(1+Math.tanh(.7978845608*(f+.044715*f*f*f)))}function ft(f,e,r){let{seq:t,d:n,nHeads:s,nKvHeads:a,headDim:i,ffn:o,ropeTheta:u,eps:c}=e,l=a*i,d=s*i,g=e.rmsGainOnePlus===!0,h=e.attnLogitSoftcap??0,p=Ge(f,r.attnNorm,t,n,c,g),v=qe(p,r.wq,t,n,d),y=qe(p,r.wk,t,n,l),P=qe(p,r.wv,t,n,l);r.bq&&(v=ct(v,r.bq,d)),r.bk&&(y=ct(y,r.bk,l)),r.bv&&(P=ct(P,r.bv,l)),r.qNorm&&(v=Ge(v,r.qNorm,t*s,i,c,g)),r.kNorm&&(y=Ge(y,r.kNorm,t*a,i,c,g));let O=Le(v,t*s,i,s,0,u),q=Le(y,t*a,i,a,0,u),T=ye(O,q,P,t,s,a,i,0,e.attnScale,h),z=qe(T,r.wo,t,d,n);r.postAttnNorm&&(z=Ge(z,r.postAttnNorm,t,n,c,g));let U=f.map((A,x)=>A+z[x]),m=Ge(U,r.ffnNorm,t,n,c,g),b=qe(m,r.wgate,t,n,o),k=qe(m,r.wup,t,n,o),F=e.act==="gelu"?b.map((A,x)=>ar(A)*k[x]):b.map((A,x)=>A/(1+Math.exp(-A))*k[x]),w=qe(F,r.wdown,t,o,n);return r.postFfnNorm&&(w=Ge(w,r.postFfnNorm,t,n,c,g)),U.map((A,x)=>A+w[x])}var ee,X,Ye,or=te(()=>{"use strict";at();ot();Zt();rr();nr();ir();ee=64,X=class X{constructor(){this.device=null;this.modules={};this.pipelines={};this.maxStorageBufferBindingSize=0;this.hasF16=!1;this.validationFailure=null;this.lost=!1;this.onLost=null;this.attnDecodeOk=!0;this.attnFullWgOk=!0;this.mropeOk=!0;this.rwkvWkv7Ok=!0;this.lfm2ShortConvOk=!0;this.lfm2ResidentOk=!0;this.lfm2BatchOk=!0;this.swaOk=!0;this.rwkvResidentOk=!0;this.videoOk=!0;this.videoResidentOk=!0;this.f16SharedOk=!0;this.qSharedOk=!0;this.gemvOk=!0;this.profiler=null;this.bufferPool=new Map;this.poolSize=new WeakMap;this.pooled=new WeakSet;this.uniformPool=new Map;this.uniformSize=new WeakMap;this.convTiledOk=!0;this.kvGpu=new Map;this.topKOk=!0;this.kvSession="";this.kvQuant=!1;this.lfm2KvGpu=new Map;this.lfm2ConvGpu=new Map;this.lfm2Session="";this.rwkvStateGpu=new Map;this.rwkvVFirst=null;this.rwkvSession=""}async init(){let e=navigator.gpu;if(!e)return!1;let r=await e.requestAdapter();if(!r)return!1;let t=r.limits,n={maxStorageBufferBindingSize:t.maxStorageBufferBindingSize,maxBufferSize:t.maxBufferSize},s=[];try{r.features?.has("shader-f16")&&s.push("shader-f16")}catch{}try{X.profileOn&&r.features?.has("timestamp-query")&&s.push("timestamp-query")}catch{}try{this.device=await r.requestDevice({requiredLimits:n,requiredFeatures:s})}catch{try{this.device=await r.requestDevice({requiredLimits:n})}catch{this.device=await r.requestDevice()}}this.maxStorageBufferBindingSize=this.device.limits?.maxStorageBufferBindingSize??134217728,this.hasF16=!!this.device.features?.has?.("shader-f16"),X.profileOn&&(this.device.features?.has?.("timestamp-query")?(this.profiler=new Qe(this.device),console.info("[webgpu] profilage par passe ACTIF (?gpuprofile=1) \u2014 __gpuProfile() pour le rapport")):console.warn("[webgpu] ?gpuprofile=1 demand\xE9 mais la feature timestamp-query est ABSENTE de cet adapter \u2014 aucune mesure ne sera prise."));try{ce("attndecode")==="0"&&(this.attnDecodeOk=!1,console.warn("[webgpu] attention d\xE9codage COUP\xC9E par ?attndecode=0 \u2014 kernels classiques")),ce("attnfullwg")==="0"&&(this.attnFullWgOk=!1,console.warn("[webgpu] attention_full workgroup COUP\xC9E par ?attnfullwg=0 \u2014 kernel classique")),ce("rwkv")==="0"&&(this.rwkvWkv7Ok=!1,console.warn("[webgpu] kernel RWKV-7 WKV COUP\xC9 par ?rwkv=0")),ce("lfm2")==="0"&&(this.lfm2ShortConvOk=!1,console.warn("[webgpu] kernel shortconv LFM2 COUP\xC9 par ?lfm2=0")),ce("lfm2resident")==="0"&&(this.lfm2ResidentOk=!1,console.warn("[webgpu] LFM2 r\xE9sident COUP\xC9 par ?lfm2resident=0 \u2014 forwardToken JS+readback")),ce("lfm2batch")==="0"&&(this.lfm2BatchOk=!1,console.warn("[webgpu] prefill LFM2 batch\xE9 COUP\xC9 par ?lfm2batch=0 \u2014 token par token")),ce("swa")==="0"&&(this.swaOk=!1,console.warn("[webgpu] fen\xEAtre glissante COUP\xC9E par ?swa=0 \u2014 attention causale pleine sur toutes les couches")),ce("rwkvresident")==="0"&&(this.rwkvResidentOk=!1,console.warn("[webgpu] RWKV r\xE9sident COUP\xC9 par ?rwkvresident=0 \u2014 forwardToken JS+readback")),ce("video")==="0"&&(this.videoOk=!1,console.warn("[webgpu] chemin vid\xE9o (module motion) COUP\xC9 par ?video=0")),ce("f16shared")==="0"&&(this.f16SharedOk=!1,console.warn("[webgpu] GEMM f16 tuil\xE9 COUP\xC9 par ?f16shared=0 \u2014 matmul_t_f16w pour tous les m")),ce("gemv")==="0"&&(this.gemvOk=!1,console.warn("[webgpu] GEMV de d\xE9codage COUP\xC9 par ?gemv=0 \u2014 kernels par lignes")),ce("qshared")==="0"&&(this.qSharedOk=!1,console.warn("[webgpu] GEMM q8/q4 tuil\xE9s COUP\xC9S par ?qshared=0 \u2014 kernels 4 lignes/invocation")),ce("videoresident")==="0"&&(this.videoResidentOk=!1,console.warn("[webgpu] motion r\xE9sident COUP\xC9 par ?videoresident=0 \u2014 chemin JS+readback"))}catch{}this.device.lost?.then?.(a=>{this.lost=!0,console.warn("[webgpu] device GPU perdu :",a?.reason||"unknown",a?.message||""),this.onLost?.(a)});for(let[a,i]of Object.entries(er))this.modules[a]=this.device.createShaderModule({code:i});return this.hasF16&&(this.modules.matmul_t_f16w=this.device.createShaderModule({code:tr})),!0}buf(e,r){let t=this.device.createBuffer({size:e.byteLength,usage:r});return this.device.queue.writeBuffer(t,0,e),t}bufU32(e,r){let t=this.device.createBuffer({size:e.byteLength,usage:r});return this.device.queue.writeBuffer(t,0,e),t}async readBack(e,r){let t=globalThis,n=this.device.createBuffer({size:r,usage:t.GPUBufferUsage.COPY_DST|t.GPUBufferUsage.MAP_READ}),s=this.device.createCommandEncoder();s.copyBufferToBuffer(e,0,n,0,r),this.device.queue.submit([s.finish()]),await n.mapAsync(t.GPUMapMode.READ);let a=new Float32Array(n.getMappedRange().slice(0));return n.unmap(),n.destroy(),a}async readBackBytes(e,r){let t=globalThis,n=Math.ceil(r/4)*4,s=this.device.createBuffer({size:n,usage:t.GPUBufferUsage.COPY_DST|t.GPUBufferUsage.MAP_READ}),a=this.device.createCommandEncoder();a.copyBufferToBuffer(e,0,s,0,n),this.device.queue.submit([a.finish()]),await s.mapAsync(t.GPUMapMode.READ);let i=new Uint8Array(s.getMappedRange().slice(0,r));return s.unmap(),s.destroy(),i}async quantizeToBytes(e,r,t,n,s){let a=t/32,i=n==="q8"?new Uint8Array(t+a*2):new Uint8Array(t/2+a*4),o=X.BLOCK_ELEMS[e]??1,u=t/o,c=r.byteLength/u,l=(p,v)=>v===0?p:l(v,p%v),d=o*32/l(o,32),g=Math.floor(this.maxStorageBufferBindingSize*.9/4),h=s??g;h=Math.max(d,Math.floor(h/d)*d);for(let p=0;p<t;p+=h){let v=Math.min(h,t-p),y=r.slice(p/o*c,(p+v)/o*c),P=this.dequantizeToGpu(e,y,v);try{if(n==="q8"){let{codes:O,sc:q}=this.f32ToQ8Gpu(P,v),T=await this.readBackBytes(O,v),z=await this.readBackBytes(q,v/32*2);O.destroy?.(),q.destroy?.(),i.set(T,p),i.set(z,t+p/32*2)}else{let{nib:O,sc:q,mn:T}=this.f32ToQ4Gpu(P,v),z=await this.readBackBytes(O,v/2),U=await this.readBackBytes(q,v/32*2),m=await this.readBackBytes(T,v/32*2);O.destroy?.(),q.destroy?.(),T.destroy?.(),i.set(z,p/2),i.set(U,t/2+p/32*2),i.set(m,t/2+a*2+p/32*2)}}finally{P.destroy?.()}}return i}pipeline(e){let r=this.pipelines[e];return r||(r=this.device.createComputePipeline({layout:"auto",compute:{module:this.modules[e],entryPoint:"main"}}),this.pipelines[e]=r),r}grid1D(e){let r=Math.ceil(e/ee);if(r<=X.MAX_WG_DIM)return[r,1,1];let t=X.MAX_WG_DIM;return[t,Math.ceil(r/t),1]}recordPass(e,r,t,n){let s=this.pipeline(r),a=this.device.createBindGroup({layout:s.getBindGroupLayout(0),entries:t.map((u,c)=>({binding:c,resource:{buffer:u}}))}),i=this.profiler?.slot(r),o=e.beginComputePass(i?{timestampWrites:i}:void 0);o.setPipeline(s),o.setBindGroup(0,a),o.dispatchWorkgroups(...n),o.end()}dispatch(e,r,t){let n=this.device.createCommandEncoder();this.recordPass(n,e,r,t),this.device.queue.submit([n.finish()])}async run(e,r,t,n,s){return this.dispatch(e,r,t),this.readBack(n,s)}isF32(e){return e instanceof Float32Array}async matmul(e,r,t,n,s){let a=globalThis,i=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,o=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([t,n,s]));let u=this.isF32(r)?this.buf(r,i):r,c=this.device.createBuffer({size:t*s*4,usage:i|a.GPUBufferUsage.COPY_SRC});return this.run("matmul",[o,this.buf(e,i),u,c],[Math.ceil(t/8),Math.ceil(s/8),1],c,t*s*4)}async matmulT(e,r,t,n,s,a=!1){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([t,n,s]));let c=this.isF32(r)?this.buf(r,o):r,l=this.device.createBuffer({size:t*s*4,usage:o|i.GPUBufferUsage.COPY_SRC}),d=this.matmulTPlan(t,n,s,a);return this.run(d.shader,[u,this.buf(e,o),c,l],d.grid,l,t*s*4)}matmulTPlan(e,r,t,n){return n&&this.hasF16?this.f16SharedOk&&e>=32&&r%4===0?{shader:"matmul_t_f16w_shared",grid:[Math.ceil(t/64),Math.ceil(e/32),1]}:{shader:"matmul_t_f16w",grid:[Math.ceil(e/8),Math.ceil(t/8),1]}:{shader:r%4===0?"matmul_t_vec4":"matmul_t",grid:[Math.ceil(e/8),Math.ceil(t/8),1]}}async rmsnorm(e,r,t,n,s=1e-5,a=!1){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([t,n])),this.device.queue.writeBuffer(u,8,new Float32Array([s])),this.device.queue.writeBuffer(u,12,new Uint32Array([a?1:0]));let c=this.device.createBuffer({size:e.byteLength,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run("rmsnorm",[u,this.buf(e,o),this.buf(r,o),c],[Math.ceil(t/ee),1,1],c,e.byteLength)}async binary(e,r,t){let n=globalThis,s=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST,a=this.device.createBuffer({size:r.byteLength,usage:s|n.GPUBufferUsage.COPY_SRC});return this.run(e,[this.buf(r,s),this.buf(t,s),a],this.grid1D(r.length),a,r.byteLength)}swiglu(e,r){return this.binary("swiglu",e,r)}geglu(e,r){return this.binary("geglu",e,r)}add(e,r){return this.binary("add",e,r)}async silu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("silu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async groupNorm(e,r,t,n,s,a,i=1e-5){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([n,s,a])),this.device.queue.writeBuffer(c,12,new Float32Array([i]));let l=this.device.createBuffer({size:e.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("group_norm",[c,this.buf(e,u),this.buf(r,u),this.buf(t,u),l],[a,1,1],l,e.byteLength)}async conv2d(e,r,t,n,s,a,i,o,u,c=1,l=0){let d=globalThis,g=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,h=Math.floor((s+2*l-o)/c)+1,p=Math.floor((a+2*l-u)/c)+1,v=n*o*u,y=h*p;if(v*y*4>this.maxStorageBufferBindingSize*.9)return this.conv2dDirect(e,r,t,n,s,a,i,o,u,c,l);let P=this.device.createBuffer({size:48,usage:d.GPUBufferUsage.UNIFORM|d.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(P,0,new Uint32Array([n,s,a,o,u,c,l,h,p]));let O=this.device.createBuffer({size:v*y*4,usage:g|d.GPUBufferUsage.COPY_SRC});this.dispatch("im2col",[P,this.buf(e,g),O],this.grid1D(v*y));let q=await this.matmul(r,O,i,v,y);if(O.destroy?.(),P.destroy?.(),t)for(let T=0;T<i;T++){let z=t[T];for(let U=0;U<y;U++)q[T*y+U]+=z}return q}async conv2dDirect(e,r,t,n,s,a,i,o,u,c=1,l=0){let d=globalThis,g=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,h=Math.floor((s+2*l-o)/c)+1,p=Math.floor((a+2*l-u)/c)+1,v=i*h*p,y=this.device.createBuffer({size:48,usage:d.GPUBufferUsage.UNIFORM|d.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(y,0,new Uint32Array([n,s,a,i,o,u,c,l,h,p]));let P=t??new Float32Array(i),O=this.device.createBuffer({size:v*4,usage:g|d.GPUBufferUsage.COPY_SRC});return this.run("conv2d_direct",[y,this.buf(e,g),this.buf(r,g),this.buf(P,g),O],this.grid1D(v),O,v*4)}async layernorm(e,r,t,n,s,a=1e-5){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s])),this.device.queue.writeBuffer(u,8,new Float32Array([a]));let c=this.device.createBuffer({size:e.byteLength,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run("layernorm",[u,this.buf(e,o),this.buf(r,o),this.buf(t,o),c],[Math.ceil(n/ee),1,1],c,e.byteLength)}async quickGelu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("quick_gelu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async gelu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("gelu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async relu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("relu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async upsampleNearest(e,r,t,n,s=2){let a=globalThis,i=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,o=t*s,u=n*s,c=r*o*u,l=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(l,0,new Uint32Array([r,t,n,s]));let d=this.device.createBuffer({size:c*4,usage:i|a.GPUBufferUsage.COPY_SRC});return this.run("upsample_nearest",[l,this.buf(e,i),d],this.grid1D(c),d,c*4)}async rope(e,r,t,n,s=0,a=1e4,i=!1){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:32,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([r,t,n,s])),this.device.queue.writeBuffer(c,16,new Float32Array([a]));let l=this.device.createBuffer({size:e.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.device.queue.writeBuffer(c,20,new Uint32Array([i?1:0])),this.run("rope",[c,this.buf(e,u),l],[Math.ceil(r/ee),1,1],l,e.byteLength)}async ropeFactors(e,r,t,n,s,a=0,i=1e4,o=!1){let u=globalThis,c=u.GPUBufferUsage.STORAGE|u.GPUBufferUsage.COPY_DST,l=this.device.createBuffer({size:32,usage:u.GPUBufferUsage.UNIFORM|u.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(l,0,new Uint32Array([t,n,s,a])),this.device.queue.writeBuffer(l,16,new Float32Array([i]));let d=this.device.createBuffer({size:r.byteLength,usage:c});this.device.queue.writeBuffer(d,0,r);let g=this.device.createBuffer({size:e.byteLength,usage:c|u.GPUBufferUsage.COPY_SRC});return this.device.queue.writeBuffer(l,20,new Uint32Array([o?1:0])),this.run("rope_factors",[l,this.buf(e,c),d,g],[Math.ceil(t/ee),1,1],g,e.byteLength)}async ropeMrope(e,r,t,n,s,a,i=1e4){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:32,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([t,n,s,a[0],a[0]+a[1]])),this.device.queue.writeBuffer(c,20,new Float32Array([i]));let l=this.device.createBuffer({size:r.byteLength,usage:u});this.device.queue.writeBuffer(l,0,r);let d=this.device.createBuffer({size:e.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("rope_mrope",[c,this.buf(e,u),l,d],[Math.ceil(t/ee),1,1],d,e.byteLength)}async rope2d(e,r,t,n,s,a=1e4){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:32,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([t,n,s,0])),this.device.queue.writeBuffer(u,16,new Float32Array([a]));let c=this.device.createBuffer({size:r.byteLength,usage:o});this.device.queue.writeBuffer(c,0,r);let l=this.device.createBuffer({size:e.byteLength,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run("rope_2d",[u,this.buf(e,o),c,l],[Math.ceil(t/ee),1,1],l,e.byteLength)}async attention(e,r,t,n,s,a,i,o=0,u,c=0,l=0){let d=globalThis,g=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,h=o+n,p=this.attnUniform(n,s,a,i,h,o,u??1/Math.sqrt(i),c,l),v=n*s*i*4,y=this.device.createBuffer({size:v,usage:g|d.GPUBufferUsage.COPY_SRC});return this.run("attention",[p,this.buf(e,g),this.buf(r,g),this.buf(t,g),y],[Math.ceil(n*s/ee),1,1],y,v)}async attentionDecode(e,r,t,n,s,a,i,o=0,u,c=0,l=0){let d=globalThis,g=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,h=o+n,p=this.attnUniform(n,s,a,i,h,o,u??1/Math.sqrt(i),c,l),v=n*s*i*4,y=this.device.createBuffer({size:v,usage:g|d.GPUBufferUsage.COPY_SRC});return this.run("attention_decode",[p,this.buf(e,g),this.buf(r,g),this.buf(t,g),y],[n*s,1,1],y,v)}async attentionFull(e,r,t,n,s,a,i,o,u,c=0){let l=globalThis,d=l.GPUBufferUsage.STORAGE|l.GPUBufferUsage.COPY_DST,g=this.device.createBuffer({size:32,usage:l.GPUBufferUsage.UNIFORM|l.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(g,0,new Uint32Array([n,s,a,i,o,0])),this.device.queue.writeBuffer(g,24,new Float32Array([u??1/Math.sqrt(i),c]));let h=n*s*i*4,p=this.device.createBuffer({size:h,usage:d|l.GPUBufferUsage.COPY_SRC});return this.run("attention_full",[g,this.buf(e,d),this.buf(r,d),this.buf(t,d),p],[Math.ceil(n*s/ee),1,1],p,h)}async attentionFullWg(e,r,t,n,s,a,i,o,u,c=0){let l=globalThis,d=l.GPUBufferUsage.STORAGE|l.GPUBufferUsage.COPY_DST,g=this.device.createBuffer({size:32,usage:l.GPUBufferUsage.UNIFORM|l.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(g,0,new Uint32Array([n,s,a,i,o,0])),this.device.queue.writeBuffer(g,24,new Float32Array([u??1/Math.sqrt(i),c]));let h=n*s*i*4,p=this.device.createBuffer({size:h,usage:d|l.GPUBufferUsage.COPY_SRC});return this.run("attention_full_wg",[g,this.buf(e,d),this.buf(r,d),this.buf(t,d),p],[n*s,1,1],p,h)}async quantizeKvReadback(e,r,t,n){let s=globalThis,a=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST|s.GPUBufferUsage.COPY_SRC,i=t*n,o=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([r,t,n,0]));let u=this.device.createBuffer({size:r*i,usage:a}),c=this.device.createBuffer({size:r*t*4,usage:a});this.dispatch("quantize_kv",[o,this.buf(e,a),u,c],this.grid1D(r*t));let l=await this.readBack(u,r*i),d=new Uint32Array(l.buffer,0,r*i/4),g=await this.readBack(c,r*t*4);return u.destroy?.(),c.destroy?.(),{codes:d,scales:g}}async attentionQ8Kv(e,r,t,n,s,a,i,o,u,c=0,l,d=0,g=0){let h=globalThis,p=h.GPUBufferUsage.STORAGE|h.GPUBufferUsage.COPY_DST,v=c+a,y=this.attnUniform(a,i,o,u,v,c,l??1/Math.sqrt(u),d,g),P=a*i*u*4,O=this.device.createBuffer({size:P,usage:p|h.GPUBufferUsage.COPY_SRC});return this.run("attention_q8kv",[y,this.buf(e,p),this.bufU32(r,p),this.buf(t,p),this.bufU32(n,p),this.buf(s,p),O],[Math.ceil(a*i/ee),1,1],O,P)}async attentionQ8KvDecode(e,r,t,n,s,a,i,o,u,c=0,l,d=0,g=0){let h=globalThis,p=h.GPUBufferUsage.STORAGE|h.GPUBufferUsage.COPY_DST,v=c+a,y=this.attnUniform(a,i,o,u,v,c,l??1/Math.sqrt(u),d,g),P=a*i*u*4,O=this.device.createBuffer({size:P,usage:p|h.GPUBufferUsage.COPY_SRC});return this.run("attention_decode_q8kv",[y,this.buf(e,p),this.bufU32(r,p),this.buf(t,p),this.bufU32(n,p),this.buf(s,p),O],[a*i,1,1],O,P)}async addBias(e,r,t,n){let s=globalThis,a=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,i=this.device.createBuffer({size:8,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(i,0,new Uint32Array([t,n]));let o=this.device.createBuffer({size:e.byteLength,usage:a|s.GPUBufferUsage.COPY_SRC});return this.run("addbias",[i,this.buf(e,a),this.buf(r,a),o],this.grid1D(e.length),o,e.byteLength)}async dequantBlocked(e,r,t,n){let s=globalThis,a=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,i=t/n;if(!Number.isInteger(i))throw new Error(`${e}: nElems ${t} not a multiple of ${n}`);let o=r.byteLength%4===0?r:(()=>{let d=new Uint8Array(Math.ceil(r.byteLength/4)*4);return d.set(r),d})(),u=new Uint32Array(o.buffer,o.byteOffset,o.byteLength/4),c=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([i]));let l=this.device.createBuffer({size:t*4,usage:a|s.GPUBufferUsage.COPY_SRC});return this.run(e,[c,this.bufU32(u,a),l],this.grid1D(i),l,t*4)}async dequantizeQ4K(e,r){return this.dequantBlocked("dequant_q4k",e,r,256)}async dequantizeByType(e,r,t){if(e==="F32")return new Float32Array(r.buffer,r.byteOffset,t);if(e==="F16"){let a=new DataView(r.buffer,r.byteOffset),i=new Float32Array(t);for(let o=0;o<t;o++)i[o]=he(a.getUint16(o*2,!0));return i}if(e==="Q4W")return ge(Pe(r,t));if(e==="Q8W")return ve(xe(r,t));if(e==="Q3W")return We(ut(r,t));let n=X.DEQUANT_SHADER[e],s=X.BLOCK_ELEMS[e];if(!n||!s)throw new Error(`dequant: unsupported GGML type ${e}`);return this.dequantBlocked(n,r,t,s)}dequantBlockedGpu(e,r,t,n){let s=globalThis,a=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,i=t/n;if(!Number.isInteger(i))throw new Error(`${e}: nElems ${t} not a multiple of ${n}`);let o=r.byteLength%4===0?r:(()=>{let d=new Uint8Array(Math.ceil(r.byteLength/4)*4);return d.set(r),d})(),u=new Uint32Array(o.buffer,o.byteOffset,o.byteLength/4),c=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([i]));let l=this.device.createBuffer({size:t*4,usage:a});return this.dispatch(e,[c,this.bufU32(u,a),l],this.grid1D(i)),l}dequantizeToGpu(e,r,t){let n=globalThis,s=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST;if(e==="F32")return this.buf(new Float32Array(r.buffer,r.byteOffset,t),s);if(e==="F16"){let o=new DataView(r.buffer,r.byteOffset),u=new Float32Array(t);for(let c=0;c<t;c++)u[c]=he(o.getUint16(c*2,!0));return this.buf(u,s)}if(e==="Q4W")return this.buf(ge(Pe(r,t)),s);if(e==="Q8W")return this.buf(ve(xe(r,t)),s);if(e==="Q3W")return this.buf(We(ut(r,t)),s);let a=X.DEQUANT_SHADER[e],i=X.BLOCK_ELEMS[e];if(!a||!i)throw new Error(`dequant: unsupported GGML type ${e}`);return this.dequantBlockedGpu(a,r,t,i)}async layerForward(e,r,t,n=!1){let{seq:s,d:a,nHeads:i,nKvHeads:o,headDim:u,ffn:c,ropeTheta:l,eps:d}=r,g=o*u,h=n?(B,D,R,M,C)=>this.matmulT(B,D,R,M,C):(B,D,R,M,C)=>this.matmul(B,D,R,M,C),p=i*u,v=r.rmsGainOnePlus===!0,y=r.attnLogitSoftcap??0,P=(B,D)=>r.act==="gelu"?this.geglu(B,D):this.swiglu(B,D),O=await this.rmsnorm(e,t.attnNorm,s,a,d,v),q=await h(O,t.wq,s,a,p),T=await h(O,t.wk,s,a,g),z=await h(O,t.wv,s,a,g);t.bq&&(q=await this.addBias(q,t.bq,s,p)),t.bk&&(T=await this.addBias(T,t.bk,s,g)),t.bv&&(z=await this.addBias(z,t.bv,s,g)),t.qNorm&&(q=await this.rmsnorm(q,t.qNorm,s*i,u,d,v)),t.kNorm&&(T=await this.rmsnorm(T,t.kNorm,s*o,u,d,v));let U=await this.rope(q,s*i,u,i,0,l),m=await this.rope(T,s*o,u,o,0,l),b=await this.attention(U,m,z,s,i,o,u,0,r.attnScale,y),k=await h(b,t.wo,s,p,a);t.postAttnNorm&&(k=await this.rmsnorm(k,t.postAttnNorm,s,a,d,v));let F=await this.add(e,k),w=await this.rmsnorm(F,t.ffnNorm,s,a,d,v),A=await h(w,t.wgate,s,a,c),x=await h(w,t.wup,s,a,c),_=await P(A,x),G=await h(_,t.wdown,s,c,a);return t.postFfnNorm&&(G=await this.rmsnorm(G,t.postFfnNorm,s,a,d,v)),this.add(F,G)}async layerForwardKV(e,r,t,n,s,a,i=!1){let{seq:o,d:u,nHeads:c,nKvHeads:l,headDim:d,ffn:g,ropeTheta:h,eps:p}=r,v=l*d,y=i?(Y,$,V,W,S)=>this.matmulT(Y,$,V,W,S):(Y,$,V,W,S)=>this.matmul(Y,$,V,W,S),P=(Y,$)=>{let V=new Float32Array(Y.length+$.length);return V.set(Y),V.set($,Y.length),V},O=c*d,q=r.rmsGainOnePlus===!0,T=r.attnLogitSoftcap??0,z=(Y,$)=>r.act==="gelu"?this.geglu(Y,$):this.swiglu(Y,$),U=await this.rmsnorm(e,t.attnNorm,o,u,p,q),m=await y(U,t.wq,o,u,O),b=await y(U,t.wk,o,u,v),k=await y(U,t.wv,o,u,v);t.bq&&(m=await this.addBias(m,t.bq,o,O)),t.bk&&(b=await this.addBias(b,t.bk,o,v)),t.bv&&(k=await this.addBias(k,t.bv,o,v)),t.qNorm&&(m=await this.rmsnorm(m,t.qNorm,o*c,d,p,q)),t.kNorm&&(b=await this.rmsnorm(b,t.kNorm,o*l,d,p,q));let F=await this.rope(m,o*c,d,c,n,h),w=await this.rope(b,o*l,d,l,n,h),A=P(s,w),x=P(a,k),_=await this.attention(F,A,x,o,c,l,d,n,r.attnScale,T),G=await y(_,t.wo,o,O,u);t.postAttnNorm&&(G=await this.rmsnorm(G,t.postAttnNorm,o,u,p,q));let B=await this.add(e,G),D=await this.rmsnorm(B,t.ffnNorm,o,u,p,q),R=await y(D,t.wgate,o,u,g),M=await y(D,t.wup,o,u,g),C=await z(R,M),K=await y(C,t.wdown,o,g,u);return t.postFfnNorm&&(K=await this.rmsnorm(K,t.postFfnNorm,o,u,p,q)),{out:await this.add(B,K),k:A,v:x}}storage(e){let r=this.bufferPool.get(e);if(r&&r.length){let n=r.pop();return this.pooled.delete(n),n}let t=this.device.createBuffer({size:e,usage:X.STORAGE_USAGE});return this.poolSize.set(t,e),t}release(e){for(let r of e){if(!r)continue;let t=this.poolSize.get(r);if(t!==void 0){if(this.pooled.has(r))continue;this.pooled.add(r);let s=this.bufferPool.get(t);s||(s=[],this.bufferPool.set(t,s)),s.push(r);continue}let n=this.uniformSize.get(r);if(n!==void 0){if(this.pooled.has(r))continue;this.pooled.add(r);let s=this.uniformPool.get(n);s||(s=[],this.uniformPool.set(n,s)),s.push(r);continue}r.destroy?.()}}uploadGpu(e){return e instanceof Float32Array?this.buf(e,X.STORAGE_USAGE):this.f16ToF32Gpu(e.f16,e.n)}uploadGpuF16(e){let r=new Uint16Array(e.length);for(let t=0;t<e.length;t++)r[t]=Fe(e[t]);return this.bufU16(r)}f32ToF16Gpu(e,r){let t=globalThis,n=Math.ceil(r/2),s=this.device.createBuffer({size:n*4,usage:X.STORAGE_USAGE}),a=this.device.createBuffer({size:16,usage:t.GPUBufferUsage.UNIFORM|t.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(a,0,new Uint32Array([n])),this.dispatch("packf16",[a,e,s],this.grid1D(n)),s}f32ToQ8Gpu(e,r){let t=globalThis,n=r/32,s=this.device.createBuffer({size:r,usage:X.STORAGE_USAGE}),a=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:X.STORAGE_USAGE}),i=this.device.createBuffer({size:16,usage:t.GPUBufferUsage.UNIFORM|t.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(i,0,new Uint32Array([n])),this.dispatch("quantize_q8",[i,e,s,a],this.grid1D(n)),{codes:s,sc:a}}f32ToQ4Gpu(e,r){let t=globalThis,n=r/32,s=this.device.createBuffer({size:r/2,usage:X.STORAGE_USAGE}),a=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:X.STORAGE_USAGE}),i=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:X.STORAGE_USAGE}),o=this.device.createBuffer({size:16,usage:t.GPUBufferUsage.UNIFORM|t.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(o,0,new Uint32Array([n])),this.dispatch("quantize_q4",[o,e,s,a,i],this.grid1D(n)),{nib:s,sc:a,mn:i}}uploadGpuRawF16(e){let r=Math.ceil(e.byteLength/4)*4,t=this.device.createBuffer({size:r,usage:X.STORAGE_USAGE});if(this.device.queue.writeBuffer(t,0,e,0,e.byteLength-e.byteLength%4),e.byteLength%4){let n=new Uint8Array(4);n.set(e.subarray(e.byteLength-e.byteLength%4)),this.device.queue.writeBuffer(t,e.byteLength-e.byteLength%4,n)}return t}bufU16(e){let r=this.device.createBuffer({size:e.byteLength,usage:X.STORAGE_USAGE});return this.device.queue.writeBuffer(r,0,e),r}uploadGpuRaw(e){let r=Math.ceil(e.byteLength/4)*4,t=this.device.createBuffer({size:r,usage:X.STORAGE_USAGE}),n=e.byteLength-e.byteLength%4;if(this.device.queue.writeBuffer(t,0,e,0,n),e.byteLength%4){let s=new Uint8Array(4);s.set(e.subarray(n)),this.device.queue.writeBuffer(t,n,s)}return t}async matmulQ4(e,r,t,n,s,a,i){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s,a,i]));let l=this.device.createBuffer({size:s*i*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4",[c,this.buf(e,u),r,t,n,l],[Math.ceil(s/8),Math.ceil(i/8),1],l,s*i*4)}async matmulQ4Tiled(e,r,t,n,s,a,i){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s,a,i]));let l=this.device.createBuffer({size:s*i*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_tiled",[c,this.buf(e,u),r,t,n,l],[Math.ceil(Math.ceil(s/4)/8),Math.ceil(i/8),1],l,s*i*4)}async matmulQ4Shared(e,r,t,n,s,a,i){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s,a,i]));let l=this.device.createBuffer({size:s*i*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_shared",[c,this.buf(e,u),r,t,n,l],[Math.ceil(i/64),Math.ceil(s/32),1],l,s*i*4)}async matmulQ3(e,r,t,n,s,a,i,o){let u=globalThis,c=u.GPUBufferUsage.STORAGE|u.GPUBufferUsage.COPY_DST,l=this.device.createBuffer({size:16,usage:u.GPUBufferUsage.UNIFORM|u.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(l,0,new Uint32Array([a,i,o]));let d=this.device.createBuffer({size:a*o*4,usage:c|u.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q3",[l,this.buf(e,c),r,t,n,s,d],[Math.ceil(a/8),Math.ceil(o/8),1],d,a*o*4)}async rwkvWkv7(e,r,t,n,s,a,i,o,u){let c=globalThis,l=c.GPUBufferUsage.STORAGE|c.GPUBufferUsage.COPY_DST,d=this.device.createBuffer({size:8,usage:c.GPUBufferUsage.UNIFORM|c.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(d,0,new Uint32Array([o,u]));let g=this.device.createBuffer({size:e.byteLength,usage:l|c.GPUBufferUsage.COPY_SRC});this.device.queue.writeBuffer(g,0,e);let h=this.device.createBuffer({size:o*u*4,usage:l|c.GPUBufferUsage.COPY_SRC});this.dispatch("rwkv_wkv7",[d,this.buf(r,l),this.buf(t,l),this.buf(n,l),this.buf(s,l),this.buf(a,l),this.buf(i,l),g,h],this.grid1D(o*u));let p=await this.readBack(g,e.byteLength),v=await this.readBack(h,o*u*4);return g.destroy?.(),h.destroy?.(),{S:p,y:v}}async rwkvTokenShift(e,r,t,n){let s=globalThis,a=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,i=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(i,0,new Uint32Array([n]));let o=this.device.createBuffer({size:6*n*4,usage:a|s.GPUBufferUsage.COPY_SRC});this.dispatch("rwkv_token_shift",[i,this.buf(e,a),this.buf(r,a),this.buf(t,a),o],this.grid1D(n*6));let u=await this.readBack(o,6*n*4);return o.destroy?.(),u}async lfm2ShortConv(e,r,t,n,s){let a=globalThis,i=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,o=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([n,s]));let u=this.buf(r,i|a.GPUBufferUsage.COPY_SRC),c=this.device.createBuffer({size:n*4,usage:i|a.GPUBufferUsage.COPY_SRC});this.dispatch("lfm2_shortconv",[o,this.buf(e,i),this.buf(t,i),u,c],this.grid1D(n));let l=await this.readBack(c,n*4),d=await this.readBack(u,(s-1)*n*4);return c.destroy?.(),u.destroy?.(),{out:l,state:d}}async matmulQ8(e,r,t,n,s,a){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s,a]));let c=this.device.createBuffer({size:n*a*4,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8",[u,this.buf(e,o),r,t,c],[Math.ceil(n/8),Math.ceil(a/8),1],c,n*a*4)}async matmulQ8Tiled(e,r,t,n,s,a){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s,a]));let c=this.device.createBuffer({size:n*a*4,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_tiled",[u,this.buf(e,o),r,t,c],[Math.ceil(Math.ceil(n/4)/8),Math.ceil(a/8),1],c,n*a*4)}async matmulQ8Shared(e,r,t,n,s,a){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s,a]));let c=this.device.createBuffer({size:n*a*4,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_shared",[u,this.buf(e,o),r,t,c],[Math.ceil(a/64),Math.ceil(n/32),1],c,n*a*4)}uniformOf(e){let r=globalThis,t=this.uniformPool.get(e);if(t&&t.length){let s=t.pop();return this.pooled.delete(s),s}let n=this.device.createBuffer({size:e,usage:r.GPUBufferUsage.UNIFORM|r.GPUBufferUsage.COPY_DST});return this.uniformSize.set(n,e),n}uniform(e,r){let t=this.uniformOf(32);if(this.device.queue.writeBuffer(t,0,new Uint32Array(e)),r){let n=Array.isArray(r.value)?r.value:[r.value];this.device.queue.writeBuffer(t,r.offset,new Float32Array(n))}return t}attnUniform(e,r,t,n,s,a,i,o,u){let c=this.uniformOf(48);return this.device.queue.writeBuffer(c,0,new Uint32Array([e,r,t,n,s,a])),this.device.queue.writeBuffer(c,24,new Float32Array([i,o])),this.device.queue.writeBuffer(c,32,new Uint32Array([u])),c}recMatmulT(e,r,t,n,s,a,i,o=!1){let u=this.uniform([s,a,i]),c=this.storage(s*i*4),l=this.matmulTPlan(s,a,i,o);return this.recordPass(e,l.shader,[u,t,n,c],l.grid),r.push(u,c),c}recConv2dDirect(e,r,t,n,s,a,i,o,u,c,l,d,g){let h=Math.floor((i+2*g-c)/d)+1,p=Math.floor((o+2*g-l)/d)+1,v=u*h*p,y=this.uniformOf(48);if(this.device.queue.writeBuffer(y,0,new Uint32Array([a,i,o,u,c,l,d,g,h,p])),c===3&&l===3&&d===1&&g===1&&this.convTiledOk){let O=this.storage(v*4);return this.recordPass(e,"conv2d_3x3_tiled",[y,t,n,s,O],[Math.ceil(p/16),Math.ceil(h/16),u]),r.push(y,O),O}let P=this.storage(v*4);return this.recordPass(e,"conv2d_direct",[y,t,n,s,P],this.grid1D(v)),r.push(y,P),P}recConv2dDirectQ8(e,r,t,n,s,a,i,o,u,c,l,d,g){let h=Math.floor((i+2*g-c)/d)+1,p=Math.floor((o+2*g-l)/d)+1,v=u*h*p,y=this.uniformOf(48);this.device.queue.writeBuffer(y,0,new Uint32Array([a,i,o,u,c,l,d,g,h,p]));let P=this.storage(v*4);return this.recordPass(e,"conv2d_direct_q8",[y,t,n.codes,n.sc,s,P],this.grid1D(v)),r.push(y,P),P}recConv2dDirectQ4(e,r,t,n,s,a,i,o,u,c,l,d,g){let h=Math.floor((i+2*g-c)/d)+1,p=Math.floor((o+2*g-l)/d)+1,v=u*h*p,y=this.uniformOf(48);this.device.queue.writeBuffer(y,0,new Uint32Array([a,i,o,u,c,l,d,g,h,p]));let P=this.storage(v*4);return this.recordPass(e,"conv2d_direct_q4",[y,t,n.nib,n.sc,n.mn,s,P],this.grid1D(v)),r.push(y,P),P}recGroupNorm(e,r,t,n,s,a,i,o,u){let c=this.uniform([a,i,o],{offset:12,value:u}),l=this.storage(a*i*4);return this.recordPass(e,"group_norm",[c,t,n,s,l],[o,1,1]),r.push(c,l),l}recUnary(e,r,t,n,s){let a=this.storage(s*4);return this.recordPass(e,t,[n,a],this.grid1D(s)),r.push(a),a}recLayernorm(e,r,t,n,s,a,i,o){let u=this.uniform([a,i],{offset:8,value:o}),c=this.storage(a*i*4);return this.recordPass(e,"layernorm",[u,t,n,s,c],[Math.ceil(a/ee),1,1]),r.push(u,c),c}recAttentionFull(e,r,t,n,s,a,i,o,u,c,l){let d=this.uniform([a,i,o,u,c,0],{offset:24,value:[l??1/Math.sqrt(u),0]}),g=this.storage(a*i*u*4),h=a*i;return this.attnFullWgOk&&u<=192&&h<=65535?this.recordPass(e,"attention_full_wg",[d,t,n,s,g],[h,1,1]):this.recordPass(e,"attention_full",[d,t,n,s,g],[Math.ceil(h/ee),1,1]),r.push(d,g),g}recUpsample(e,r,t,n,s,a,i){let o=this.uniform([n,s,a,i]),u=n*(s*i)*(a*i),c=this.storage(u*4);return this.recordPass(e,"upsample_nearest",[o,t,c],this.grid1D(u)),r.push(o,c),c}recConcat(e,r,t,n,s,a,i){let o=this.storage((s+a)*i*4);return e.copyBufferToBuffer(t,0,o,0,s*i*4),e.copyBufferToBuffer(n,0,o,s*i*4,a*i*4),r.push(o),o}recAddChannelBias(e,r,t,n,s,a){let i=this.uniform([s,a]),o=this.storage(s*a*4);return this.recordPass(e,"add_channel_bias",[i,t,n,o],this.grid1D(s*a)),r.push(i,o),o}recTranspose(e,r,t,n,s){let a=this.uniform([n,s]),i=this.storage(n*s*4);return this.recordPass(e,"transpose2d",[a,t,i],this.grid1D(n*s)),r.push(a,i),i}recGegluSplit(e,r,t,n,s){let a=this.uniform([n,s]),i=this.storage(n*s*4);return this.recordPass(e,"geglu_split",[a,t,i],this.grid1D(n*s)),r.push(a,i),i}recVideoGather(e,r,t,n,s,a){let i=this.uniform([n,s,a]),o=this.storage(a*n*s*4);return this.recordPass(e,"video_motion_gather",[i,t,o],this.grid1D(a*n*s)),r.push(i,o),o}recVideoScatter(e,r,t,n,s,a,i){let o=this.uniform([s,a,i]),u=this.storage(s*a*i*4);return this.recordPass(e,"video_motion_scatter",[o,t,n,u],this.grid1D(s*a*i)),r.push(o,u),u}recVideoAddPe(e,r,t,n,s,a,i){let o=this.uniform([s,a,i]),u=this.storage(i*s*a*4);return this.recordPass(e,"video_add_pe",[o,t,n,u],this.grid1D(i*s*a)),r.push(o,u),u}recAttnTemporal(e,r,t,n,s,a,i,o,u){let c=this.uniform([a,i,o,u],{offset:16,value:1/Math.sqrt(u)}),l=this.storage(a*i*o*u*4);return this.recordPass(e,"attn_temporal",[c,t,n,s,l],this.grid1D(a*i*o)),r.push(c,l),l}recordingSession(){let e=this.device.createCommandEncoder(),r=[],t=n=>{if(n instanceof Float32Array){let s=this.uploadGpu(n);return r.push(s),s}return n};return{conv2d:(n,s,a,i,o,u,c,l,d,g,h)=>s&&s.nib?this.recConv2dDirectQ4(e,r,t(n),s,t(a),i,o,u,c,l,d,g,h):s&&s.codes?this.recConv2dDirectQ8(e,r,t(n),s,t(a),i,o,u,c,l,d,g,h):this.recConv2dDirect(e,r,t(n),t(s),t(a),i,o,u,c,l,d,g,h),groupNorm:(n,s,a,i,o,u,c)=>this.recGroupNorm(e,r,t(n),t(s),t(a),i,o,u,c),silu:(n,s)=>this.recUnary(e,r,"silu",t(n),s),quickGelu:(n,s)=>this.recUnary(e,r,"quick_gelu",t(n),s),gelu:(n,s)=>this.recUnary(e,r,"gelu",t(n),s),relu:(n,s)=>this.recUnary(e,r,"relu",t(n),s),add:(n,s,a)=>this.recBinary(e,r,"add",t(n),t(s),a),geglu:(n,s,a)=>this.recBinary(e,r,"geglu",t(n),t(s),a),matmulT:(n,s,a,i,o)=>this.recMM(e,r,t(n),s instanceof Float32Array?t(s):s,a,i,o,!1),addBias:(n,s,a,i)=>this.recAddBias(e,r,t(n),t(s),a,i),addChannelBias:(n,s,a,i)=>this.recAddChannelBias(e,r,t(n),t(s),a,i),attentionFull:(n,s,a,i,o,u,c,l)=>this.recAttentionFull(e,r,t(n),t(s),t(a),i,o,u,c,l),rope2d:(n,s,a,i,o,u)=>{let c=s instanceof Uint32Array?(()=>{let l=this.uploadGpuRaw(new Uint8Array(s.buffer,s.byteOffset,s.byteLength));return r.push(l),l})():s;return this.recRope2d(e,r,t(n),c,a,i,o,u)},attention:(n,s,a,i,o,u,c,l,d)=>this.recAttention(e,r,t(n),t(s),t(a),i,o,u,c,l,d),upsample:(n,s,a,i,o)=>this.recUpsample(e,r,t(n),s,a,i,o),layernorm:(n,s,a,i,o,u)=>this.recLayernorm(e,r,t(n),t(s),t(a),i,o,u),concat:(n,s,a,i,o)=>this.recConcat(e,r,t(n),t(s),a,i,o),transpose:(n,s,a)=>this.recTranspose(e,r,t(n),s,a),gegluSplit:(n,s,a)=>this.recGegluSplit(e,r,t(n),s,a),videoGather:(n,s,a,i)=>this.recVideoGather(e,r,t(n),s,a,i),videoScatter:(n,s,a,i,o)=>this.recVideoScatter(e,r,t(n),t(s),a,i,o),videoAddPe:(n,s,a,i,o)=>this.recVideoAddPe(e,r,t(n),t(s),a,i,o),attnTemporal:(n,s,a,i,o,u,c)=>this.recAttnTemporal(e,r,t(n),t(s),t(a),i,o,u,c),alloc:n=>{let s=this.storage(n);return r.push(s),s},copy:(n,s,a,i,o)=>{e.copyBufferToBuffer(a,i,n,s,o)},finish:async(n,s)=>{this.device.queue.submit([e.finish()]);let a=await this.readBack(n,s*4);return this.release(r),a},finishKeep:n=>{this.device.queue.submit([e.finish()]);let s=r.indexOf(n);return s>=0&&r.splice(s,1),this.release(r),n},finishKeepMany:n=>{this.device.queue.submit([e.finish()]);for(let s of n){let a=r.indexOf(s);a>=0&&r.splice(a,1)}return this.release(r),n}}}readGpu(e,r){return this.readBack(e,r*4)}trimPool(e=64<<20){let r=[...this.bufferPool.keys()].sort((n,s)=>s-n),t=0;for(let n of this.bufferPool.values())for(let s of n)t+=this.poolSize.get(s)??0;for(let n of r){let s=this.bufferPool.get(n);for(;s.length&&t>e;){let a=s.pop();this.pooled.delete(a),this.poolSize.delete(a),a.destroy?.(),t-=n}}}releaseGpu(e){this.release(e)}waitGpu(){return this.device.queue.onSubmittedWorkDone()}async benchMatmul(e,r,t,n,s,a={}){let{iters:i=10,shared:o=!0,wF16:u=!1}=a,c=this.f16SharedOk,l=this.qSharedOk;this.f16SharedOk=o,this.qSharedOk=o;let d=this.uploadGpu(e),g=[],h=this.device.createCommandEncoder();this.recMM(h,g,d,r,t,n,s,u),this.device.queue.submit([h.finish()]),await this.device.queue.onSubmittedWorkDone();let p=this.device.createCommandEncoder();for(let P=0;P<i;P++)this.recMM(p,g,d,r,t,n,s,u);let v=performance.now();this.device.queue.submit([p.finish()]),await this.device.queue.onSubmittedWorkDone();let y=(performance.now()-v)/i;return this.release(g),d.destroy?.(),this.f16SharedOk=c,this.qSharedOk=l,y}destroy(){try{this.profiler?.destroy()}catch{}this.profiler=null;try{this.device?.destroy?.()}catch{}this.bufferPool.clear(),this.uniformPool.clear()}f16ToF32Gpu(e,r){let t=this.uploadGpuRawF16(e),n=this.device.createBuffer({size:r*4,usage:X.STORAGE_USAGE}),s=this.uniformOf(16);return this.device.queue.writeBuffer(s,0,new Uint32Array([r])),this.dispatch("f16_to_f32",[s,t,n],this.grid1D(Math.ceil(r/2))),t.destroy?.(),this.release([s]),n}quantizeQ8Gpu(e){let r=e instanceof Float32Array?e.length:e.n;if(r%32!==0)return this.uploadGpu(e);let t=e instanceof Float32Array?this.buf(e,X.STORAGE_USAGE):this.f16ToF32Gpu(e.f16,r),n=this.f32ToQ8Gpu(t,r);return t.destroy?.(),n}async validateResidentOps(){let e=globalThis,r=F=>Float32Array.from({length:F},()=>(Math.random()*2-1)*.5),t=(F,w,A=.005)=>F.length===w.length&&F.every((x,_)=>Math.abs(x-w[_])<=A*(1+Math.abs(w[_]))),n=4,s=4,a=4,i=4,o=2,u=1e-5,c=i*s*a,l=r(n*s*a),d=r(i*n*9),g=r(i),h=r(i),p=r(i),v=await this.silu(await this.groupNorm(await this.conv2dDirect(l,d,g,n,s,a,i,3,3,1,1),h,p,i,s*a,o,u)),y=[],P=this.device.createCommandEncoder(),O=this.uploadGpu(l),q=this.uploadGpu(d),T=this.uploadGpu(g),z=this.uploadGpu(h),U=this.uploadGpu(p);y.push(O,q,T,z,U);let m=this.recConv2dDirect(P,y,O,q,T,n,s,a,i,3,3,1,1);m=this.recGroupNorm(P,y,m,z,U,i,s*a,o,u),m=this.recUnary(P,y,"silu",m,c);let b=this.device.createBuffer({size:c*4,usage:e.GPUBufferUsage.COPY_DST|e.GPUBufferUsage.MAP_READ});P.copyBufferToBuffer(m,0,b,0,c*4),this.device.queue.submit([P.finish()]),await b.mapAsync(e.GPUMapMode.READ);let k=new Float32Array(b.getMappedRange().slice(0));return b.unmap(),b.destroy(),this.release(y),t(k,v)?null:"resident_ops"}recMatmulQ4(e,r,t,n,s,a,i){let o=this.uniform([s,a,i]),u=this.storage(s*i*4);if(s===1&&this.gemvOk){let c=this.gemvGrid(i);this.recordPass(e,"matmul_t_q4_vec",[this.uniform([s,a,i,c.stride]),t,n.nib,n.sc,n.mn,u],c.grid)}else s>=32&&this.qSharedOk?this.recordPass(e,"matmul_t_q4_shared",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(i/64),Math.ceil(s/32),1]):s>=2?this.recordPass(e,"matmul_t_q4_tiled",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(Math.ceil(s/4)/8),Math.ceil(i/8),1]):this.recordPass(e,"matmul_t_q4",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(s/8),Math.ceil(i/8),1]);return r.push(o,u),u}recMatmulQ8(e,r,t,n,s,a,i){let o=this.uniform([s,a,i]),u=this.storage(s*i*4);if(s===1&&this.gemvOk){let c=this.gemvGrid(i);this.recordPass(e,"matmul_t_q8_vec",[this.uniform([s,a,i,c.stride]),t,n.codes,n.sc,u],c.grid)}else s>=32&&this.qSharedOk?this.recordPass(e,"matmul_t_q8_shared",[o,t,n.codes,n.sc,u],[Math.ceil(i/64),Math.ceil(s/32),1]):s>=2?this.recordPass(e,"matmul_t_q8_tiled",[o,t,n.codes,n.sc,u],[Math.ceil(Math.ceil(s/4)/8),Math.ceil(i/8),1]):this.recordPass(e,"matmul_t_q8",[o,t,n.codes,n.sc,u],[Math.ceil(s/8),Math.ceil(i/8),1]);return r.push(o,u),u}gemvGrid(e){return e<=32768?{grid:[e,1,1],stride:32768}:{grid:[32768,Math.ceil(e/32768),1],stride:32768}}async matmulQ4Vec(e,r,t,n,s,a){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.gemvGrid(a),c=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([1,s,a,u.stride]));let l=this.device.createBuffer({size:a*4,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_vec",[c,this.buf(e,o),r,t,n,l],u.grid,l,a*4)}async matmulQ8Vec(e,r,t,n,s){let a=globalThis,i=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,o=this.gemvGrid(s),u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([1,n,s,o.stride]));let c=this.device.createBuffer({size:s*4,usage:i|a.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_vec",[u,this.buf(e,i),r,t,c],o.grid,c,s*4)}recMatmulQ3(e,r,t,n,s,a,i){let o=this.uniform([s,a,i]),u=this.storage(s*i*4);return this.recordPass(e,"matmul_t_q3",[o,t,n.lo,n.hi,n.sc,n.mn,u],[Math.ceil(s/8),Math.ceil(i/8),1]),r.push(o,u),u}recMM(e,r,t,n,s,a,i,o){return n&&n.q3?this.recMatmulQ3(e,r,t,n,s,a,i):n&&n.nib?this.recMatmulQ4(e,r,t,n,s,a,i):n&&n.codes?this.recMatmulQ8(e,r,t,n,s,a,i):this.recMatmulT(e,r,t,n,s,a,i,o)}recRmsnorm(e,r,t,n,s,a,i,o=!1){let u=this.uniform([s,a,0,o?1:0],{offset:8,value:i}),c=this.storage(s*a*4);return this.recordPass(e,"rmsnorm",[u,t,n,c],[Math.ceil(s/ee),1,1]),r.push(u,c),c}recRope(e,r,t,n,s,a,i,o,u=!1){let c=this.uniform([n,s,a,i],{offset:16,value:o});this.device.queue.writeBuffer(c,20,new Uint32Array([u?1:0]));let l=this.storage(n*s*4);return this.recordPass(e,"rope",[c,t,l],[Math.ceil(n/ee),1,1]),r.push(c,l),l}recRopeMrope(e,r,t,n,s,a,i,o,u){let c=u[0],l=u[0]+u[1],d=this.uniform([s,a,i,c,l],{offset:20,value:o}),g=this.storage(s*a*4);return this.recordPass(e,"rope_mrope",[d,t,n,g],[Math.ceil(s/ee),1,1]),r.push(d,g),g}preparePositions(e,r){if(e.positions&&e.mropeSections){let t=this.storage(e.positions.byteLength);this.device.queue.writeBuffer(t,0,e.positions),r.push(t),e._posGpu=t}if(e.ropeFactors){let t=this.storage(e.ropeFactors.byteLength);this.device.queue.writeBuffer(t,0,e.ropeFactors),r.push(t),e._ffGpu=t}}recRope2d(e,r,t,n,s,a,i,o){let u=this.uniform([s,a,i,0],{offset:16,value:o}),c=this.storage(s*a*4);return this.recordPass(e,"rope_2d",[u,t,n,c],[Math.ceil(s/ee),1,1]),r.push(u,c),c}recRopeFactors(e,r,t,n,s,a,i,o,u,c=!1){let l=this.uniform([s,a,i,o],{offset:16,value:u});this.device.queue.writeBuffer(l,20,new Uint32Array([c?1:0]));let d=this.storage(s*a*4);return this.recordPass(e,"rope_factors",[l,t,n,d],[Math.ceil(s/ee),1,1]),r.push(l,d),d}recAttention(e,r,t,n,s,a,i,o,u,c,l,d,g=0,h=0){let p=this.attnUniform(a,i,o,u,c,l,d??1/Math.sqrt(u),g,h),v=this.storage(a*i*u*4);return this.attnDecodeOk&&a*i<256&&u<=128?this.recordPass(e,"attention_decode",[p,t,n,s,v],[a*i,1,1]):this.recordPass(e,"attention",[p,t,n,s,v],[Math.ceil(a*i/ee),1,1]),r.push(p,v),v}recQuantizeKv(e,r,t,n,s,a,i,o,u){let c=this.uniform([a,i,o,u]);this.recordPass(e,"quantize_kv",[c,t,n,s],this.grid1D(a*i)),r.push(c)}recAttentionQ8(e,r,t,n,s,a,i,o,u,c,l,d,g,h,p=0,v=0){let y=this.attnUniform(o,u,c,l,d,g,h??1/Math.sqrt(l),p,v),P=this.storage(o*u*l*4);return this.attnDecodeOk&&o*u<256&&l<=128?this.recordPass(e,"attention_decode_q8kv",[y,t,n,s,a,i,P],[o*u,1,1]):this.recordPass(e,"attention_q8kv",[y,t,n,s,a,i,P],[Math.ceil(o*u/ee),1,1]),r.push(y,P),P}recAddBias(e,r,t,n,s,a){let i=this.uniform([s,a]),o=this.storage(s*a*4);return this.recordPass(e,"addbias",[i,t,n,o],this.grid1D(s*a)),r.push(i,o),o}recBinary(e,r,t,n,s,a){let i=this.storage(a*4);return this.recordPass(e,t,[n,s,i],this.grid1D(a)),r.push(i),i}recLfm2ShortConv(e,r,t,n,s,a,i){let o=this.uniform([a,i]),u=this.storage(a*4);return this.recordPass(e,"lfm2_shortconv",[o,t,s,n,u],this.grid1D(a)),r.push(o,u),u}recordLayerKV(e,r,t,n,s,a,i){let o=i.k,u=i.v,{seq:c,d:l,nHeads:d,nKvHeads:g,headDim:h,ffn:p,ropeTheta:v,eps:y}=n,P=g*h,O=a+c,q=s.matF16===!0,T=d*h,z=n.rmsGainOnePlus===!0,U=n.attnLogitSoftcap??0,m=n.act==="gelu"?"geglu":"swiglu",b=this.recRmsnorm(e,r,t,s.attnNorm,c,l,y,z),k=this.recMM(e,r,b,s.wq,c,l,T,q),F=this.recMM(e,r,b,s.wk,c,l,P,q),w=this.recMM(e,r,b,s.wv,c,l,P,q);s.bq&&(k=this.recAddBias(e,r,k,s.bq,c,T)),s.bk&&(F=this.recAddBias(e,r,F,s.bk,c,P)),s.bv&&(w=this.recAddBias(e,r,w,s.bv,c,P)),s.qNorm&&(k=this.recRmsnorm(e,r,k,s.qNorm,c*d,h,y,z)),s.kNorm&&(F=this.recRmsnorm(e,r,F,s.kNorm,c*g,h,y,z));let A=n._posGpu,x=n._ffGpu,_=n.ropeInterleaved===!0,G=(W,S,L)=>n.skipRope?W:A?this.recRopeMrope(e,r,W,A,S,h,L,v,n.mropeSections):x?this.recRopeFactors(e,r,W,x,S,h,L,a,v,_):this.recRope(e,r,W,S,h,L,a,v,_),B=G(k,c*d,d),D=G(F,c*g,g),R;if(i.kScale)this.recQuantizeKv(e,r,D,o,i.kScale,c,g,h,a),this.recQuantizeKv(e,r,w,u,i.vScale,c,g,h,a),R=this.recAttentionQ8(e,r,B,o,i.kScale,u,i.vScale,c,d,g,h,O,a,n.attnScale,U,n.window??0);else{let W=P*4;e.copyBufferToBuffer(D,0,o,a*W,c*W),e.copyBufferToBuffer(w,0,u,a*W,c*W),R=this.recAttention(e,r,B,o,u,c,d,g,h,O,a,n.attnScale,U,n.window??0)}let M=this.recMM(e,r,R,s.wo,c,T,l,q);s.postAttnNorm&&(M=this.recRmsnorm(e,r,M,s.postAttnNorm,c,l,y,z));let C=this.recBinary(e,r,"add",t,M,c*l),K=this.recRmsnorm(e,r,C,s.ffnNorm,c,l,y,z),Q=this.recMM(e,r,K,s.wgate,c,l,p,q),Y=this.recMM(e,r,K,s.wup,c,l,p,q),$=this.recBinary(e,r,m,Q,Y,c*p),V=this.recMM(e,r,$,s.wdown,c,p,l,q);return s.postFfnNorm&&(V=this.recRmsnorm(e,r,V,s.postFfnNorm,c,l,y,z)),this.recBinary(e,r,"add",C,V,c*l)}setKvQuant(e){this.kvQuant!==e&&(this.kvQuant=e,this.resetKvGpu())}resetKvGpu(){for(let e of this.kvGpu.values())e.k.destroy?.(),e.v.destroy?.(),e.kScale?.destroy?.(),e.vScale?.destroy?.();this.kvGpu.clear(),this.kvSession="";for(let e of this.bufferPool.values())for(let r of e)r.destroy?.();this.bufferPool.clear()}clearKvCache(){this.resetKvGpu()}ensureKv(e,r,t,n){let s=this.kvGpu.get(e);if(s&&s.cap>=r)return s;let a=Math.max(r,(s?.cap??0)+1024,1024),i=this.kvQuant,o=this.storage(a*t*(i?1:4)),u=this.storage(a*t*(i?1:4)),c=i?this.storage(a*n*4):void 0,l=i?this.storage(a*n*4):void 0;if(s){let g=this.device.createCommandEncoder();g.copyBufferToBuffer(s.k,0,o,0,s.cap*t*(i?1:4)),g.copyBufferToBuffer(s.v,0,u,0,s.cap*t*(i?1:4)),i&&s.kScale&&(g.copyBufferToBuffer(s.kScale,0,c,0,s.cap*n*4),g.copyBufferToBuffer(s.vScale,0,l,0,s.cap*n*4)),this.device.queue.submit([g.finish()]),s.k.destroy?.(),s.v.destroy?.(),s.kScale?.destroy?.(),s.vScale?.destroy?.()}let d={k:o,v:u,cap:a,kScale:c,vScale:l};return this.kvGpu.set(e,d),d}async runDecodeGpu(e,r,t,n,s,a){let{seq:i,d:o,nKvHeads:u,headDim:c,eps:l}=r,d=u*c,g=n+i;(a!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${a}" inconnue avec pastLen=${n} \u2014 cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=a);for(let q=0;q<t.length;q++)this.ensureKv(q,g,d,u);let h=[];this.preparePositions(r,h);let p=this.device.createCommandEncoder(),v=this.storage(e.byteLength);this.device.queue.writeBuffer(v,0,e),h.push(v);for(let q=0;q<t.length;q++){let T=this.kvGpu.get(q);v=this.recordLayerKV(p,h,v,lt(r,i,q,this.swaOk),t[q],n,T)}let y=this.recRmsnorm(p,h,v,s,i,o,l,r.rmsGainOnePlus===!0),P=this.storage(o*4);p.copyBufferToBuffer(y,(i-1)*o*4,P,0,o*4),this.device.queue.submit([p.finish()]);let O=await this.readBack(P,o*4);return h.push(P),this.release(h),O}async decodeLogitsQ8(e,r,t,n,s,a,i,o){let u=globalThis,{seq:c,d:l,nKvHeads:d,headDim:g,eps:h}=r,p=d*g,v=n+c;(a!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${a}" inconnue avec pastLen=${n} \u2014 cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=a);for(let b=0;b<t.length;b++)this.ensureKv(b,v,p,d);let y=[];this.preparePositions(r,y);let P=this.device.createCommandEncoder(),O=this.storage(e.byteLength);this.device.queue.writeBuffer(O,0,e),y.push(O);for(let b=0;b<t.length;b++){let k=this.kvGpu.get(b);O=this.recordLayerKV(P,y,O,lt(r,c,b,this.swaOk),t[b],n,k)}let q=this.recRmsnorm(P,y,O,s,c,l,h,r.rmsGainOnePlus===!0),T=this.storage(l*4);P.copyBufferToBuffer(q,(c-1)*l*4,T,0,l*4),y.push(T);let z=this.storage(o*4);y.push(z);for(let b of i){let k=this.recMM(P,y,T,b.w,1,l,b.rows,!1);P.copyBufferToBuffer(k,0,z,b.r0*4,b.rows*4)}let U=this.device.createBuffer({size:o*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});P.copyBufferToBuffer(z,0,U,0,o*4),this.device.queue.submit([P.finish()]),await U.mapAsync(u.GPUMapMode.READ);let m=new Float32Array(U.getMappedRange().slice(0));return U.unmap(),U.destroy(),this.release(y),m}async decodeTopKQ8(e,r,t,n,s,a,i,o,u,c,l,d=64){let g=globalThis,{seq:h,d:p,nKvHeads:v,headDim:y,eps:P}=r,O=v*y,q=n+h;(a!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${a}" inconnue avec pastLen=${n} \u2014 cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=a);for(let G=0;G<t.length;G++)this.ensureKv(G,q,O,v);let T=X.timingOn?(G,B)=>console.info(`[timing:gpu] ${G} ${(performance.now()-B).toFixed(0)} ms`):null,z=performance.now(),U=[];this.preparePositions(r,U);let m=this.device.createCommandEncoder(),b=this.storage(e.byteLength);this.device.queue.writeBuffer(b,0,e),U.push(b);for(let G=0;G<t.length;G++){let B=this.kvGpu.get(G);b=this.recordLayerKV(m,U,b,lt(r,h,G,this.swaOk),t[G],n,B)}let k=this.recRmsnorm(m,U,b,s,h,p,P,r.rmsGainOnePlus===!0),F=this.storage(p*4);m.copyBufferToBuffer(k,(h-1)*p*4,F,0,p*4),U.push(F);let w=this.storage(o*4);U.push(w);for(let G of i){let B=this.recMM(m,U,F,G.w,1,p,G.rows,!1);m.copyBufferToBuffer(B,0,w,G.r0*4,G.rows*4)}if(l&&l>0){let G=this.uniform([o],{offset:4,value:l});this.recordPass(m,"softcap_logits",[G,w],this.grid1D(o)),U.push(G)}if(c&&c!==1&&u.length){let G=Uint32Array.from(u),B=this.bufU32(G,g.GPUBufferUsage.STORAGE|g.GPUBufferUsage.COPY_DST),D=this.uniform([G.length],{offset:4,value:c});this.recordPass(m,"penalize_logits",[D,B,w],this.grid1D(G.length)),U.push(D,B)}let A=this.storage(d*2*4);U.push(A);{let G=this.uniform([o,d]);this.recordPass(m,"top_k",[G,w,A],[1,1,1]),U.push(G)}let x=this.device.createBuffer({size:d*2*4,usage:g.GPUBufferUsage.COPY_DST|g.GPUBufferUsage.MAP_READ});m.copyBufferToBuffer(A,0,x,0,d*2*4),T?.("enregistrement des passes (compilation des pipelines incluse)",z),z=performance.now(),this.device.queue.submit([m.finish()]),await x.mapAsync(g.GPUMapMode.READ),T?.("execution GPU (submit + readback)",z);let _=new Uint32Array(x.getMappedRange().slice(0));return x.unmap(),x.destroy(),this.release(U),{ids:_.slice(0,d),vals:new Float32Array(_.buffer,d*4,d)}}resetLfm2State(){for(let e of this.lfm2KvGpu.values())e.k.destroy?.(),e.v.destroy?.();for(let e of this.lfm2ConvGpu.values())e.destroy?.();this.lfm2KvGpu.clear(),this.lfm2ConvGpu.clear(),this.lfm2Session="";for(let e of this.bufferPool.values())for(let r of e)r.destroy?.();this.bufferPool.clear()}clearLfm2State(){this.resetLfm2State()}ensureLfm2Kv(e,r,t){let n=this.lfm2KvGpu.get(e);if(n&&n.cap>=r)return n;let s=Math.max(r,(n?.cap??0)+1024,1024),a=this.storage(s*t*4),i=this.storage(s*t*4);if(n){let u=this.device.createCommandEncoder();u.copyBufferToBuffer(n.k,0,a,0,n.cap*t*4),u.copyBufferToBuffer(n.v,0,i,0,n.cap*t*4),this.device.queue.submit([u.finish()]),n.k.destroy?.(),n.v.destroy?.()}let o={k:a,v:i,cap:s};return this.lfm2KvGpu.set(e,o),o}ensureLfm2Conv(e,r){let t=this.lfm2ConvGpu.get(e);return t||(t=this.storage(r*4),this.device.queue.writeBuffer(t,0,new Float32Array(r)),this.lfm2ConvGpu.set(e,t)),t}recLfm2ShortConvBatch(e,r,t,n,s,a,i,o){let u=this.uniform([a,i,o]),c=this.storage(o*a*4);this.recordPass(e,"lfm2_shortconv_batch",[u,t,s,n,c],this.grid1D(o*a));let l=this.uniform([a,i,o]);return this.recordPass(e,"lfm2_shortconv_state",[l,t,n],this.grid1D((i-1)*a)),r.push(u,l,c),c}recordLfm2(e,r,t,n,s,a,i,o){let{D:u,nHeads:c,nKvHeads:l,headDim:d,ffn:g,eps:h,theta:p,lc:v}=s,y=l*d,P=c*d,O=y*4;for(let T=0;T<a.length;T++)a[T].conv?this.ensureLfm2Conv(T,(v-1)*u):this.ensureLfm2Kv(T,o+n,y);if(n>=v-1&&this.lfm2BatchOk){let T=this.storage(n*u*4);this.device.queue.writeBuffer(T,0,t),r.push(T);for(let U=0;U<a.length;U++){let m=a[U],b=this.recRmsnorm(e,r,T,m.attnNorm,n,u,h),k;if(m.conv){let G=this.recMM(e,r,b,m.inProj,n,u,3*u,!1),B=this.recLfm2ShortConvBatch(e,r,G,this.lfm2ConvGpu.get(U),m.convW,u,v,n);k=this.recMM(e,r,B,m.outProj,n,u,u,!1)}else{let G=this.recMM(e,r,b,m.wq,n,u,P,!1),B=this.recMM(e,r,b,m.wk,n,u,y,!1),D=this.recMM(e,r,b,m.wv,n,u,y,!1);G=this.recRmsnorm(e,r,G,m.qNorm,n*c,d,h),B=this.recRmsnorm(e,r,B,m.kNorm,n*l,d,h),G=this.recRope(e,r,G,n*c,d,c,o,p),B=this.recRope(e,r,B,n*l,d,l,o,p);let R=this.lfm2KvGpu.get(U);e.copyBufferToBuffer(B,0,R.k,o*O,n*O),e.copyBufferToBuffer(D,0,R.v,o*O,n*O);let M=this.recAttention(e,r,G,R.k,R.v,n,c,l,d,o+n,o);k=this.recMM(e,r,M,m.wo,n,P,u,!1)}T=this.recBinary(e,r,"add",T,k,n*u);let F=this.recRmsnorm(e,r,T,m.ffnNorm,n,u,h),w=this.recMM(e,r,F,m.wgate,n,u,g,!1),A=this.recMM(e,r,F,m.wup,n,u,g,!1),x=this.recBinary(e,r,"swiglu",w,A,n*g),_=this.recMM(e,r,x,m.wdown,n,g,u,!1);T=this.recBinary(e,r,"add",T,_,n*u)}let z=this.storage(u*4);return r.push(z),e.copyBufferToBuffer(T,(n-1)*u*4,z,0,u*4),this.recRmsnorm(e,r,z,i,1,u,h)}let q=null;for(let T=0;T<n;T++){let z=o+T,U=this.storage(u*4);this.device.queue.writeBuffer(U,0,t.subarray(T*u,(T+1)*u)),r.push(U);for(let m=0;m<a.length;m++){let b=a[m],k=this.recRmsnorm(e,r,U,b.attnNorm,1,u,h),F;if(b.conv){let B=this.recMM(e,r,k,b.inProj,1,u,3*u,!1),D=this.recLfm2ShortConv(e,r,B,this.lfm2ConvGpu.get(m),b.convW,u,v);F=this.recMM(e,r,D,b.outProj,1,u,u,!1)}else{let B=this.recMM(e,r,k,b.wq,1,u,P,!1),D=this.recMM(e,r,k,b.wk,1,u,y,!1),R=this.recMM(e,r,k,b.wv,1,u,y,!1);B=this.recRmsnorm(e,r,B,b.qNorm,c,d,h),D=this.recRmsnorm(e,r,D,b.kNorm,l,d,h),B=this.recRope(e,r,B,c,d,c,z,p),D=this.recRope(e,r,D,l,d,l,z,p);let M=this.lfm2KvGpu.get(m);e.copyBufferToBuffer(D,0,M.k,z*O,O),e.copyBufferToBuffer(R,0,M.v,z*O,O);let C=this.recAttention(e,r,B,M.k,M.v,1,c,l,d,z+1,z);F=this.recMM(e,r,C,b.wo,1,P,u,!1)}U=this.recBinary(e,r,"add",U,F,u);let w=this.recRmsnorm(e,r,U,b.ffnNorm,1,u,h),A=this.recMM(e,r,w,b.wgate,1,u,g,!1),x=this.recMM(e,r,w,b.wup,1,u,g,!1),_=this.recBinary(e,r,"swiglu",A,x,g),G=this.recMM(e,r,_,b.wdown,1,g,u,!1);U=this.recBinary(e,r,"add",U,G,u)}T===n-1&&(q=this.recRmsnorm(e,r,U,i,1,u,h))}return q}lfm2SessionReset(e,r){(e!==this.lfm2Session||r===0)&&(r>0&&console.error(`[lfm2] session "${e}" inconnue avec pastLen=${r} \u2014 \xE9tat perdu, sortie invalide. Repartir de pastLen 0.`),this.resetLfm2State(),this.lfm2Session=e)}async lfm2PrefillGpu(e,r,t,n,s,a,i){this.lfm2SessionReset(i,a);let o=[],u=this.device.createCommandEncoder();this.recordLfm2(u,o,e,r,t,n,s,a),this.device.queue.submit([u.finish()]),await this.device.queue.onSubmittedWorkDone(),this.release(o)}async lfm2LogitsGpu(e,r,t,n,s,a,i,o){let u=globalThis;this.lfm2SessionReset(o,i);let c=[],l=this.device.createCommandEncoder(),d=this.recordLfm2(l,c,e,r,t,n,a,i),g=this.recMM(l,c,d,s,1,t.D,t.vocab,!1),h=this.device.createBuffer({size:t.vocab*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});l.copyBufferToBuffer(g,0,h,0,t.vocab*4),this.device.queue.submit([l.finish()]),await h.mapAsync(u.GPUMapMode.READ);let p=new Float32Array(h.getMappedRange().slice(0));return h.unmap(),h.destroy(),this.release(c),p}async lfm2TopKGpu(e,r,t,n,s,a,i,o,u,c,l=64){let d=globalThis;this.lfm2SessionReset(o,i);let g=[],h=this.device.createCommandEncoder(),p=this.recordLfm2(h,g,e,r,t,n,a,i),v=this.recMM(h,g,p,s,1,t.D,t.vocab,!1);if(c&&c!==1&&u.length){let q=Uint32Array.from(u),T=this.bufU32(q,d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST),z=this.uniform([q.length],{offset:4,value:c});this.recordPass(h,"penalize_logits",[z,T,v],this.grid1D(q.length)),g.push(z,T)}let y=this.storage(l*2*4);g.push(y);{let q=this.uniform([t.vocab,l]);this.recordPass(h,"top_k",[q,v,y],[1,1,1]),g.push(q)}let P=this.device.createBuffer({size:l*2*4,usage:d.GPUBufferUsage.COPY_DST|d.GPUBufferUsage.MAP_READ});h.copyBufferToBuffer(y,0,P,0,l*2*4),this.device.queue.submit([h.finish()]),await P.mapAsync(d.GPUMapMode.READ);let O=new Uint32Array(P.getMappedRange().slice(0));return P.unmap(),P.destroy(),this.release(g),{ids:O.slice(0,l),vals:new Float32Array(O.buffer,l*4,l)}}resetRwkvState(){for(let e of this.rwkvStateGpu.values())e.S.destroy?.(),e.tm.destroy?.(),e.cm.destroy?.();this.rwkvStateGpu.clear(),this.rwkvVFirst?.destroy?.(),this.rwkvVFirst=null,this.rwkvSession="";for(let e of this.bufferPool.values())for(let r of e)r.destroy?.();this.bufferPool.clear()}clearRwkvState(){this.resetRwkvState()}ensureRwkvState(e,r,t,n){let s=this.rwkvStateGpu.get(e);if(!s){let a=this.storage(t*n*n*4),i=this.storage(r*4),o=this.storage(r*4);this.device.queue.writeBuffer(a,0,new Float32Array(t*n*n)),this.device.queue.writeBuffer(i,0,new Float32Array(r)),this.device.queue.writeBuffer(o,0,new Float32Array(r)),s={S:a,tm:i,cm:o},this.rwkvStateGpu.set(e,s)}return s}rwkvSessionReset(e,r){(e!==this.rwkvSession||r===0)&&(r>0&&console.error(`[rwkv] session "${e}" inconnue avec pastLen=${r} \u2014 \xE9tat perdu, sortie invalide. Repartir de pastLen 0.`),this.resetRwkvState(),this.rwkvSession=e)}recRwkvToken(e,r,t,n,s,a){let{D:i,H:o,NH:u}=n,c=1e-5,l=64e-5;for(let d=0;d<s.length;d++){let g=s[d],h=this.rwkvStateGpu.get(d),p=this.recLayernorm(e,r,t,g.attnNormW,g.attnNormB,1,i,c),v=this.storage(6*i*4);{let L=this.uniform([i]);this.recordPass(e,"rwkv_token_shift",[L,p,h.tm,g.lerpFused,v],this.grid1D(6*i)),r.push(L,v)}e.copyBufferToBuffer(p,0,h.tm,0,i*4);let y=L=>{let H=this.storage(i*4);return e.copyBufferToBuffer(v,L*i*4,H,0,i*4),r.push(H),H},P=y(0),O=y(1),q=y(2),T=y(3),z=y(4),U=y(5),m=this.recMM(e,r,P,g.R,1,i,i,!1),b=this.recMM(e,r,q,g.K,1,i,i,!1),k=this.recMM(e,r,T,g.V,1,i,i,!1),F=this.recUnary(e,r,"tanh_act",this.recMM(e,r,O,g.w1,1,i,g.rw,!1),g.rw),w=this.recMM(e,r,F,g.w2,1,g.rw,i,!1),A=this.storage(i*4);this.recordPass(e,"rwkv_decay",[g.w0,w,A],this.grid1D(i)),r.push(A);let x=this.recMM(e,r,this.recMM(e,r,z,g.a1,1,i,g.ra,!1),g.a2,1,g.ra,i,!1),_=this.storage(i*4);this.recordPass(e,"rwkv_bias_sigmoid",[g.a0,x,_],this.grid1D(i)),r.push(_);let G=this.recUnary(e,r,"sigmoid",this.recMM(e,r,U,g.g1,1,i,g.rg,!1),g.rg),B=this.recMM(e,r,G,g.g2,1,g.rg,i,!1);if(d===0)e.copyBufferToBuffer(k,0,a,0,i*4);else{let L=this.recMM(e,r,this.recMM(e,r,T,g.v1,1,i,g.rv,!1),g.v2,1,g.rv,i,!1);this.recordPass(e,"rwkv_vresid",[k,a,g.v0,L],this.grid1D(i))}let D=this.storage(i*4),R=this.storage(i*4),M=this.storage(i*4);{let L=this.uniform([u,o]);this.recordPass(e,"rwkv_kprep",[L,b,_,g.kk,g.ka,D,R,M],this.grid1D(u)),r.push(L,D,R,M)}let C=this.storage(i*4);{let L=this.uniform([u,o]);this.recordPass(e,"rwkv_wkv7",[L,m,A,D,k,R,M,h.S,C],this.grid1D(u*o)),r.push(L,C)}let K=this.storage(i*4);{let L=this.uniform([u,o],{offset:8,value:l});this.recordPass(e,"rwkv_out_gn",[L,C,m,D,g.rk,k,g.lnWB,K],this.grid1D(u)),r.push(L,K)}let Q=this.recBinary(e,r,"mul",K,B,i),Y=this.recMM(e,r,Q,g.O,1,i,i,!1);t=this.recBinary(e,r,"add",t,Y,i);let $=this.recLayernorm(e,r,t,g.attnNorm2W,g.attnNorm2B,1,i,c),V=this.storage(i*4);this.recordPass(e,"rwkv_lerp",[$,h.cm,g.lerpK,V],this.grid1D(i)),r.push(V),e.copyBufferToBuffer($,0,h.cm,0,i*4);let W=this.recUnary(e,r,"sqrelu",this.recMM(e,r,V,g.cmK,1,i,g.ffn,!1),g.ffn),S=this.recMM(e,r,W,g.cmV,1,g.ffn,i,!1);t=this.recBinary(e,r,"add",t,S,i)}return t}recordRwkv(e,r,t,n,s,a,i){let{D:o,H:u,NH:c}=s;for(let d=0;d<a.length;d++)this.ensureRwkvState(d,o,c,u);this.rwkvVFirst||(this.rwkvVFirst=this.storage(o*4));let l=null;for(let d=0;d<n;d++){let g=this.storage(o*4);this.device.queue.writeBuffer(g,0,t.subarray(d*o,(d+1)*o)),r.push(g);let h=this.recLayernorm(e,r,g,i.tokW,i.tokB,1,o,1e-5),p=this.recRwkvToken(e,r,h,s,a,this.rwkvVFirst);d===n-1&&(l=this.recLayernorm(e,r,p,i.outW,i.outB,1,o,1e-5))}return l}async rwkvPrefillGpu(e,r,t,n,s,a,i){this.rwkvSessionReset(i,a);let o=[],u=this.device.createCommandEncoder();this.recordRwkv(u,o,e,r,t,n,s),this.device.queue.submit([u.finish()]),await this.device.queue.onSubmittedWorkDone(),this.release(o)}async rwkvLogitsGpu(e,r,t,n,s,a,i,o){let u=globalThis;this.rwkvSessionReset(o,i);let c=[],l=this.device.createCommandEncoder(),d=this.recordRwkv(l,c,e,r,t,n,a),g=this.recMM(l,c,d,s,1,t.D,t.vocab,!1),h=this.device.createBuffer({size:t.vocab*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});l.copyBufferToBuffer(g,0,h,0,t.vocab*4),this.device.queue.submit([l.finish()]),await h.mapAsync(u.GPUMapMode.READ);let p=new Float32Array(h.getMappedRange().slice(0));return h.unmap(),h.destroy(),this.release(c),p}async rwkvTopKGpu(e,r,t,n,s,a,i,o,u,c,l=64){let d=globalThis;this.rwkvSessionReset(o,i);let g=[],h=this.device.createCommandEncoder(),p=this.recordRwkv(h,g,e,r,t,n,a),v=this.recMM(h,g,p,s,1,t.D,t.vocab,!1);if(c&&c!==1&&u.length){let q=Uint32Array.from(u),T=this.bufU32(q,d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST),z=this.uniform([q.length],{offset:4,value:c});this.recordPass(h,"penalize_logits",[z,T,v],this.grid1D(q.length)),g.push(z,T)}let y=this.storage(l*2*4);g.push(y);{let q=this.uniform([t.vocab,l]);this.recordPass(h,"top_k",[q,v,y],[1,1,1]),g.push(q)}let P=this.device.createBuffer({size:l*2*4,usage:d.GPUBufferUsage.COPY_DST|d.GPUBufferUsage.MAP_READ});h.copyBufferToBuffer(y,0,P,0,l*2*4),this.device.queue.submit([h.finish()]),await P.mapAsync(d.GPUMapMode.READ);let O=new Uint32Array(P.getMappedRange().slice(0));return P.unmap(),P.destroy(),this.release(g),{ids:O.slice(0,l),vals:new Float32Array(O.buffer,l*4,l)}}async argmaxProjection(e,r,t,n,s=!1){let a=globalThis,i=[],o=this.device.createCommandEncoder(),u=this.storage(e.byteLength);this.device.queue.writeBuffer(u,0,e),i.push(u);let c=this.storage(n*4);i.push(c);for(let p of r){let v=this.recMatmulT(o,i,u,p.buf,1,t,p.rows,s);o.copyBufferToBuffer(v,0,c,p.r0*4,p.rows*4)}let l=this.storage(4),d=this.uniform([n]);i.push(l,d),this.recordPass(o,"argmax",[d,c,l],[1,1,1]);let g=this.device.createBuffer({size:4,usage:a.GPUBufferUsage.COPY_DST|a.GPUBufferUsage.MAP_READ});o.copyBufferToBuffer(l,0,g,0,4),this.device.queue.submit([o.finish()]),await g.mapAsync(a.GPUMapMode.READ);let h=new Uint32Array(g.getMappedRange().slice(0))[0];return g.unmap(),g.destroy(),this.release(i),h}async projectLogits(e,r,t,n,s=!1){let a=globalThis,i=[],o=this.device.createCommandEncoder(),u=this.storage(e.byteLength);this.device.queue.writeBuffer(u,0,e),i.push(u);let c=this.storage(n*4);i.push(c);for(let g of r){let h=this.recMatmulT(o,i,u,g.buf,1,t,g.rows,s);o.copyBufferToBuffer(h,0,c,g.r0*4,g.rows*4)}let l=this.device.createBuffer({size:n*4,usage:a.GPUBufferUsage.COPY_DST|a.GPUBufferUsage.MAP_READ});o.copyBufferToBuffer(c,0,l,0,n*4),this.device.queue.submit([o.finish()]),await l.mapAsync(a.GPUMapMode.READ);let d=new Float32Array(l.getMappedRange().slice(0));return l.unmap(),l.destroy(),this.release(i),d}async selfValidate(){this.validationFailure=null;let e=U=>(this.validationFailure=U,console.error("[selfValidate] FAILED at:",U,"(hasF16="+this.hasF16+")"),!1),r=(U,m)=>U.length===m.length&&U.every((b,k)=>Math.abs(b-m[k])<.001),t=U=>Float32Array.from({length:U},()=>Math.random()*2-1),n=3,s=4,a=5,i=t(n*s),o=t(s*a),u=new Float32Array(n*a);for(let U=0;U<n;U++)for(let m=0;m<a;m++){let b=0;for(let k=0;k<s;k++)b+=i[U*s+k]*o[k*a+m];u[U*a+m]=b}if(!r(await this.matmul(i,o,n,s,a),u))return e("matmul");{let U=(b,k,F,w,A)=>{let x=new Float32Array(F*A);for(let _=0;_<F;_++)for(let G=0;G<A;G++){let B=0;for(let D=0;D<w;D++)B+=b[_*w+D]*k[G*w+D];x[_*A+G]=B}return x},m=async(b,k,F)=>{let w=t(b*k),A=t(F*k);return r(await this.matmulT(w,A,b,k,F),U(w,A,b,k,F))};if(!await m(3,8,5))return e("matmulT.vec4(3,8,5)");if(!await m(1,16,7))return e("matmulT.vec4(1,16,7)");if(!await m(2,6,4))return e("matmulT.scalar(2,6,4)");if(this.hasF16){let w=t(16),A=t(112),x=this.uploadGpuF16(A),_=await this.matmulT(w,x,1,16,7,!0),G=new Float32Array(7);for(let C=0;C<7;C++){let K=0;for(let Q=0;Q<16;Q++)K+=w[Q]*A[C*16+Q];G[C]=K}x.destroy?.();let B=C=>C.length===G.length&&C.every((K,Q)=>Math.abs(K-G[Q])<=.03*(1+Math.abs(G[Q])));if(!B(_))return e("matmulT.f16");let D=this.uploadGpu(A),R=this.f32ToF16Gpu(D,112),M=await this.matmulT(w,R,1,16,7,!0);if(D.destroy?.(),R.destroy?.(),!B(M))return e("packf16")}if(this.hasF16&&this.f16SharedOk){let b=[{m:20,k:128,n:18},{m:32,k:64,n:64},{m:70,k:40,n:130},{m:33,k:48,n:7}];for(let k of b){let F=t(k.m*k.k),w=t(k.n*k.k),A=this.uploadGpuF16(w),x=await this.matmulT(F,A,k.m,k.k,k.n,!0);this.f16SharedOk=!1;let _=await this.matmulT(F,A,k.m,k.k,k.n,!0);if(this.f16SharedOk=!0,A.destroy?.(),!(x.length===_.length&&x.every((B,D)=>Math.abs(B-_[D])<=.001*(1+Math.abs(_[D]))))){this.f16SharedOk=!1,console.warn(`[selfValidate] matmul_t_f16w_shared KO sur ce GPU (m=${k.m}, k=${k.k}, n=${k.n}) \u2014 repli sur matmul_t_f16w (plus lent, m\xEAme r\xE9sultat).`);break}}}}{let k=t(128),F=t(768),w=Oe(F),A=this.uploadGpuRaw(w.nibbles),x=this.uploadGpuRaw(new Uint8Array(w.scales.buffer,w.scales.byteOffset,w.scales.byteLength)),_=this.uploadGpuRaw(new Uint8Array(w.mins.buffer,w.mins.byteOffset,w.mins.byteLength)),G=await this.matmulQ4(k,A,x,_,1,128,6),B=ge(w),D=new Float32Array(6);for(let Q=0;Q<6;Q++){let Y=0;for(let $=0;$<128;$++)Y+=k[$]*B[Q*128+$];D[Q]=Y}if(A.destroy?.(),x.destroy?.(),_.destroy?.(),!r(G,D))return e("matmulQ4");let R=this.uploadGpu(F),M=this.f32ToQ4Gpu(R,768),C=await this.matmulQ4(k,M.nib,M.sc,M.mn,1,128,6);if(R.destroy?.(),M.nib.destroy?.(),M.sc.destroy?.(),M.mn.destroy?.(),!(C.length===D.length&&C.every((Q,Y)=>Math.abs(Q-D[Y])<=.06*(1+Math.abs(D[Y]))+.02)))return e("quantize_q4")}{let k=t(640),F=t(768),w=Xt(F),A=this.uploadGpuRaw(new Uint8Array(w.lo.buffer,w.lo.byteOffset,w.lo.byteLength)),x=this.uploadGpuRaw(new Uint8Array(w.hi.buffer,w.hi.byteOffset,w.hi.byteLength)),_=this.uploadGpuRaw(new Uint8Array(w.scales.buffer,w.scales.byteOffset,w.scales.byteLength)),G=this.uploadGpuRaw(new Uint8Array(w.mins.buffer,w.mins.byteOffset,w.mins.byteLength)),B=await this.matmulQ3(k,A,x,_,G,5,128,6),D=We(w),R=new Float32Array(30);for(let M=0;M<5;M++)for(let C=0;C<6;C++){let K=0;for(let Q=0;Q<128;Q++)K+=k[M*128+Q]*D[C*128+Q];R[M*6+C]=K}if(A.destroy?.(),x.destroy?.(),_.destroy?.(),G.destroy?.(),!r(B,R))return e("matmulQ3")}{let k=t(640),F=t(768),w=Oe(F),A=this.uploadGpuRaw(w.nibbles),x=this.uploadGpuRaw(new Uint8Array(w.scales.buffer,w.scales.byteOffset,w.scales.byteLength)),_=this.uploadGpuRaw(new Uint8Array(w.mins.buffer,w.mins.byteOffset,w.mins.byteLength)),G=await this.matmulQ4Tiled(k,A,x,_,5,128,6),B=ge(w),D=new Float32Array(30);for(let R=0;R<5;R++)for(let M=0;M<6;M++){let C=0;for(let K=0;K<128;K++)C+=k[R*128+K]*B[M*128+K];D[R*6+M]=C}if(A.destroy?.(),x.destroy?.(),_.destroy?.(),!r(G,D))return e("matmul_q4_tiled")}for(let U of[{m:20,n:18},{m:32,n:64},{m:70,n:130}]){let m=U.m,b=128,k=U.n,F=t(m*b),w=t(k*b),A=Oe(w),x=this.uploadGpuRaw(A.nibbles),_=this.uploadGpuRaw(new Uint8Array(A.scales.buffer,A.scales.byteOffset,A.scales.byteLength)),G=this.uploadGpuRaw(new Uint8Array(A.mins.buffer,A.mins.byteOffset,A.mins.byteLength)),B=await this.matmulQ4Shared(F,x,_,G,m,b,k),D=ge(A),R=new Float32Array(m*k);for(let M=0;M<m;M++)for(let C=0;C<k;C++){let K=0;for(let Q=0;Q<b;Q++)K+=F[M*b+Q]*D[C*b+Q];R[M*k+C]=K}if(x.destroy?.(),_.destroy?.(),G.destroy?.(),!r(B,R))return e(`matmul_q4_shared(${m},${k})`)}{let k=t(128),F=t(768),w=De(F),A=this.uploadGpuRaw(new Uint8Array(w.codes.buffer,w.codes.byteOffset,w.codes.byteLength)),x=this.uploadGpuRaw(new Uint8Array(w.scales.buffer,w.scales.byteOffset,w.scales.byteLength)),_=await this.matmulQ8(k,A,x,1,128,6),G=ve(w),B=new Float32Array(6);for(let C=0;C<6;C++){let K=0;for(let Q=0;Q<128;Q++)K+=k[Q]*G[C*128+Q];B[C]=K}if(A.destroy?.(),x.destroy?.(),!r(_,B))return e("matmulQ8");let D=this.uploadGpu(F),R=this.f32ToQ8Gpu(D,768),M=await this.matmulQ8(k,R.codes,R.sc,1,128,6);if(D.destroy?.(),R.codes.destroy?.(),R.sc.destroy?.(),!r(M,B))return e("quantize_q8")}{let k=t(640),F=t(768),w=De(F),A=this.uploadGpuRaw(new Uint8Array(w.codes.buffer,w.codes.byteOffset,w.codes.byteLength)),x=this.uploadGpuRaw(new Uint8Array(w.scales.buffer,w.scales.byteOffset,w.scales.byteLength)),_=await this.matmulQ8Tiled(k,A,x,5,128,6),G=ve(w),B=new Float32Array(30);for(let D=0;D<5;D++)for(let R=0;R<6;R++){let M=0;for(let C=0;C<128;C++)M+=k[D*128+C]*G[R*128+C];B[D*6+R]=M}if(A.destroy?.(),x.destroy?.(),!r(_,B))return e("matmul_q8_tiled")}for(let U of[{k:128,n:6},{k:128,n:130},{k:4096,n:17}]){let m=U.k,b=U.n,k=t(m),F=t(b*m),w=Oe(F),A=this.uploadGpuRaw(w.nibbles),x=this.uploadGpuRaw(new Uint8Array(w.scales.buffer,w.scales.byteOffset,w.scales.byteLength)),_=this.uploadGpuRaw(new Uint8Array(w.mins.buffer,w.mins.byteOffset,w.mins.byteLength)),G=await this.matmulQ4Vec(k,A,x,_,m,b),B=ge(w),D=new Float32Array(b);for(let $=0;$<b;$++){let V=0;for(let W=0;W<m;W++)V+=k[W]*B[$*m+W];D[$]=V}if(A.destroy?.(),x.destroy?.(),_.destroy?.(),!r(G,D))return e(`matmul_q4_vec(${m},${b})`);let R=De(F),M=this.uploadGpuRaw(new Uint8Array(R.codes.buffer,R.codes.byteOffset,R.codes.byteLength)),C=this.uploadGpuRaw(new Uint8Array(R.scales.buffer,R.scales.byteOffset,R.scales.byteLength)),K=await this.matmulQ8Vec(k,M,C,m,b),Q=ve(R),Y=new Float32Array(b);for(let $=0;$<b;$++){let V=0;for(let W=0;W<m;W++)V+=k[W]*Q[$*m+W];Y[$]=V}if(M.destroy?.(),C.destroy?.(),!r(K,Y))return e(`matmul_q8_vec(${m},${b})`)}for(let U of[{m:20,n:18},{m:32,n:64},{m:70,n:130}]){let m=U.m,b=128,k=U.n,F=t(m*b),w=t(k*b),A=De(w),x=this.uploadGpuRaw(new Uint8Array(A.codes.buffer,A.codes.byteOffset,A.codes.byteLength)),_=this.uploadGpuRaw(new Uint8Array(A.scales.buffer,A.scales.byteOffset,A.scales.byteLength)),G=await this.matmulQ8Shared(F,x,_,m,b,k),B=ve(A),D=new Float32Array(m*k);for(let R=0;R<m;R++)for(let M=0;M<k;M++){let C=0;for(let K=0;K<b;K++)C+=F[R*b+K]*B[M*b+K];D[R*k+M]=C}if(x.destroy?.(),_.destroy?.(),!r(G,D))return e(`matmul_q8_shared(${m},${k})`)}{let m=t(1632),b=new Uint8Array(m.buffer,m.byteOffset,m.byteLength),k=(F,w)=>F.length===w.length&&F.every((A,x)=>A===w[x]);if(!k(await this.quantizeToBytes("F32",b,1632,"q8"),await this.quantizeToBytes("F32",b,1632,"q8",256)))return e("quantize_chunk_q8");if(!k(await this.quantizeToBytes("F32",b,1632,"q4"),await this.quantizeToBytes("F32",b,1632,"q4",256)))return e("quantize_chunk_q4")}let c=2,l=8,d=t(c*l),g=t(l),h=new Float32Array(c*l);for(let U=0;U<c;U++){let m=0;for(let k=0;k<l;k++)m+=d[U*l+k]**2;let b=1/Math.sqrt(m/l+1e-5);for(let k=0;k<l;k++)h[U*l+k]=d[U*l+k]*b*g[k]}if(!r(await this.rmsnorm(d,g,c,l),h))return e("rmsnorm");if(!r(await this.rmsnorm(d,g,c,l,1e-5,!0),Ge(d,g,c,l,1e-5,!0)))return e("rmsnorm.onePlus");let p=t(16),v=t(16),y=p.map((U,m)=>U/(1+Math.exp(-U))*v[m]);if(!r(await this.swiglu(p,v),y))return e("swiglu");let P=p.map((U,m)=>ar(U)*v[m]);if(!r(await this.geglu(p,v),P))return e("geglu");let O=p.map((U,m)=>U+v[m]);if(!r(await this.add(p,v),O))return e("add");{let U=X.MAX_WG_DIM*ee+257,m=new Float32Array(U),b=new Float32Array(U),k=[0,1,ee-1,ee,X.MAX_WG_DIM*ee-1,X.MAX_WG_DIM*ee,U-1];for(let A of k)m[A]=A%7-3,b[A]=A%5-2;let F=await this.add(m,b),w=F.length===U;for(let A of k)Math.abs(F[A]-(m[A]+b[A]))>1e-5&&(w=!1);if(!w)return e("grid1D.add(2D)")}let q=(U,m,b=.003)=>U.length===m.length&&U.every((k,F)=>Math.abs(k-m[F])<=b*(1+Math.abs(m[F])));{let w=t(8);if(!q(await this.rope(w,2,4,2,1,1e4),Le(w,2,4,2,1,1e4)))return e("rope")}{let w=t(384),A=new Float32Array(64/2).fill(1);if(!q(await this.ropeFactors(w,A,6,64,2,7,5e5),Le(w,6,64,2,7,5e5)))return e("rope_factors.ones");let x=Float32Array.from({length:64/2},(_,G)=>1+G%5*.7);if(!q(await this.ropeFactors(w,x,6,64,2,7,5e5),cn(w,x,6,64,2,7,5e5)))return e("rope_factors")}{let w=t(384);if(!q(await this.rope(w,6,64,2,7,5e5,!0),$e(w,6,64,2,7,5e5)))return e("rope.interleaved");let A=t(8);if(!q(await this.rope(A,2,4,2,3,1e4,!0),$e(A,2,4,2,3,1e4)))return e("rope.interleaved.hd4");let x=t(384);if(!q(await this.rope(x,6,64,2,0,5e5,!0),$e(x,6,64,2,0,5e5)))return e("rope.interleaved.pos0");let _=64/2,G=new Float32Array(384);for(let C=0;C<6;C++)for(let K=0;K<_;K++)G[C*64+2*K]=w[C*64+K],G[C*64+2*K+1]=w[C*64+K+_];let B=await this.rope(G,6,64,2,7,5e5,!0),D=await this.rope(w,6,64,2,7,5e5,!1),R=new Float32Array(384);for(let C=0;C<6;C++)for(let K=0;K<_;K++)R[C*64+2*K]=D[C*64+K],R[C*64+2*K+1]=D[C*64+K+_];if(!q(B,R))return e("rope.interleaved.equivalence");let M=Float32Array.from({length:_},(C,K)=>1+K%5*.7);if(!q(await this.ropeFactors(w,M,6,64,2,7,5e5,!0),$e(w,6,64,2,7,5e5,M)))return e("rope_factors.interleaved")}{let b=[16,24,24],k=1e6,F=3,w=F*2,A=5,x=t(w*128),_=new Uint32Array(F*3);for(let R=0;R<F;R++){let M=A+R;_.set([M,M,M],R*3)}let G=new Uint32Array([5,5,5,5,6,9,5,7,5]),B=q(await this.ropeMrope(x,_,w,128,2,b,k),Le(x,w,128,2,A,k)),D=q(await this.ropeMrope(x,G,w,128,2,b,k),un(x,G,w,128,2,b,k));(!B||!D)&&(this.mropeOk=!1,console.error(`[selfValidate] rope_mrope KO sur ce GPU (${B?"positions 3D":"d\xE9g\xE9n\xE9r\xE9\u2260rope"}) \u2014 vision d\xE9sactiv\xE9e, chat texte intact.`))}{let A=t(32),x=t(32),_=t(32);if(!q(await this.attention(A,x,_,2,4,2,4,2),ye(A,x,_,2,4,2,4,2)))return e("attention");let G=.3,B=5;if(!q(await this.attention(A,x,_,2,4,2,4,2,G,B),ye(A,x,_,2,4,2,4,2,G,B)))return e("attention.softcap");{let Y=t(24),$=t(48),V=t(48);for(let W of[1,4,8,64]){if(!q(await this.attention(Y,$,V,3,2,1,4,9,void 0,0,W),ye(Y,$,V,3,2,1,4,9,void 0,0,W)))return e(`attention.window(${W})`);if(!q(await this.attentionDecode(Y,$,V,3,2,1,4,9,void 0,0,W),ye(Y,$,V,3,2,1,4,9,void 0,0,W)))return e(`attention_decode.window(${W})`)}}{let D=await this.quantizeKvReadback(x,4,2,4),R=await this.quantizeKvReadback(_,4,2,4),M=await this.attentionQ8Kv(A,D.codes,D.scales,R.codes,R.scales,2,4,2,4,2),C=(V,W)=>{let S=new Float32Array(32);for(let L=0;L<4;L++)for(let H=0;H<2;H++){let j=W[L*2+H];for(let I=0;I<4;I++){let N=L*2*4+H*4+I,E=V[N>>2]>>(N&3)*8&255;S[N]=(E<128?E:E-256)*j}}return S},K=C(D.codes,D.scales),Q=C(R.codes,R.scales),Y=ye(A,K,Q,2,4,2,4,2);if(!q(M,Y,.005))return e("attention.q8kv");let $=0;for(let V=0;V<x.length;V++)$=Math.max($,Math.abs(K[V]-x[V]));if($>.05)return e("quantize_kv.error")}}{let U=b=>{this.attnDecodeOk=!1,console.error("[selfValidate] attention d\xE9codage HS sur ce GPU (\xE9tape :",b,") \u2192 repli kernels classiques (plus lents \xE0 contexte long, corrects)")},m=[{nT:1,nH:14,nKv:2,hd:64,past:300},{nT:10,nH:14,nKv:2,hd:64,past:173}];for(let b of m){if(!this.attnDecodeOk)break;let k=b.past+b.nT,F=t(b.nT*b.nH*b.hd),w=t(k*b.nKv*b.hd),A=t(k*b.nKv*b.hd);if(!q(await this.attentionDecode(F,w,A,b.nT,b.nH,b.nKv,b.hd,b.past),ye(F,w,A,b.nT,b.nH,b.nKv,b.hd,b.past))){U(`decode(nT=${b.nT})`);break}let x=await this.quantizeKvReadback(w,k,b.nKv,b.hd),_=await this.quantizeKvReadback(A,k,b.nKv,b.hd),G=await this.attentionQ8KvDecode(F,x.codes,x.scales,_.codes,_.scales,b.nT,b.nH,b.nKv,b.hd,b.past),B=await this.attentionQ8Kv(F,x.codes,x.scales,_.codes,_.scales,b.nT,b.nH,b.nKv,b.hd,b.past);if(!q(G,B,.005)){U(`decode.q8kv(nT=${b.nT})`);break}}if(this.attnDecodeOk){let x=t(64),_=t(350*8),G=t(350*8);q(await this.attentionDecode(x,_,G,2,4,2,8,173,.3,5),ye(x,_,G,2,4,2,8,173,.3,5))||U("decode.softcap")}if(this.attnDecodeOk){let x=t(256),_=t(9088),G=t(9088);q(await this.attentionDecode(x,_,G,1,2,1,128,70),ye(x,_,G,1,2,1,128,70))||U("decode.hd128")}}{let x={seq:3,d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},_={attnNorm:t(16),wq:t(256),wk:t(128),wv:t(128),wo:t(256),bq:t(16),bk:t(8),bv:t(8),ffnNorm:t(16),wgate:t(256),wup:t(256),wdown:t(256)},G=t(48);if(!q(await this.layerForward(G,x,_),ft(G,x,_),.005))return e("layerForward")}{let _={seq:3,d:12,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6,attnScale:1/Math.sqrt(4),attnLogitSoftcap:5,act:"gelu",rmsGainOnePlus:!0},G={attnNorm:t(12),wq:t(192),wk:t(96),wv:t(96),wo:t(192),ffnNorm:t(12),wgate:t(192),wup:t(192),wdown:t(192),postAttnNorm:t(12),postFfnNorm:t(12)},B=t(36);if(!q(await this.layerForward(B,_,G),ft(B,_,G),.005))return e("layerForward.gemma2")}{let _={seq:3,d:12,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e6,eps:1e-6},G={attnNorm:t(12),wq:t(192),wk:t(96),wv:t(96),wo:t(192),ffnNorm:t(12),wgate:t(192),wup:t(192),wdown:t(192),qNorm:t(4),kNorm:t(4)},B=t(36);if(!q(await this.layerForward(B,_,G),ft(B,_,G),.005))return e("layerForward.qwen3")}{let m=new Uint8Array(720);for(let k=0;k<5;k++){let F=k*144,w=new DataView(m.buffer);w.setUint16(F,Fe(.005+Math.random()*.05),!0),w.setUint16(F+2,Fe(.001+Math.random()*.02),!0);for(let A=4;A<144;A++)m[F+A]=Math.random()*256|0}let b=await this.dequantizeQ4K(m,5*256);if(!q(b,tn(m,5),1e-4))return e("dequant.Q4_K")}{let U=G=>{let B=new Uint8Array(G);for(let D=0;D<G;D++)B[D]=Math.random()*256|0;return B},m=(G,B)=>{let D=new DataView(G.buffer),R=M=>B===210?M*210+208:M*B;for(let M=0;M*B<G.length;M++)D.setUint16(R(M),Fe(.005+Math.random()*.05),!0);return G},k=m(U(136),34);if(!q(await this.dequantizeByType("Q8_0",k,128),rn(k,4),1e-4))return e("dequant.Q8_0");let F=m(U(88),22);if(!q(await this.dequantizeByType("Q5_0",F,128),nn(F,4),1e-4))return e("dequant.Q5_0");let w=m(U(840),210);if(!q(await this.dequantizeByType("Q6_K",w,4*256),on(w,4),1e-4))return e("dequant.Q6_K");let A=m(U(72),18);if(!q(await this.dequantizeByType("Q4_0",A,128),sn(A,4),1e-4))return e("dequant.Q4_0");let x=U(704),_=new DataView(x.buffer);for(let G=0;G<4;G++)_.setUint16(G*176,Fe(.005+Math.random()*.05),!0),_.setUint16(G*176+2,Fe(.001+Math.random()*.02),!0);if(!q(await this.dequantizeByType("Q5_K",x,4*256),an(x,4),1e-4))return e("dequant.Q5_K")}{let A={d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},x={attnNorm:t(16),wq:t(256),wk:t(128),wv:t(128),wo:t(256),bq:t(16),bk:t(8),bv:t(8),ffnNorm:t(16),wgate:t(256),wup:t(256),wdown:t(256)},_=t(48),B=(await this.layerForward(_,{...A,seq:3},x)).slice(32,48),D=new Float32Array(0),R=await this.layerForwardKV(_.slice(0,32),{...A,seq:2},x,0,D,D),M=await this.layerForwardKV(_.slice(32,48),{...A,seq:1},x,2,R.k,R.v);if(!q(M.out,B,.005))return e("layerForwardKV")}{let b=t(4),k=t(40),F=new Float32Array(10);for(let _=0;_<10;_++){let G=0;for(let B=0;B<4;B++)G+=b[B]*k[_*4+B];F[_]=G}let w=0;for(let _=1;_<10;_++)F[_]>F[w]&&(w=_);let A=this.uploadGpu(k),x=await this.argmaxProjection(b,[{buf:A,rows:10,r0:0}],4,10,!1);if(A.destroy?.(),x!==w)return e("argmaxProjection")}{let A={seq:4,d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},x={attnNorm:t(16),wq:t(256),wk:t(128),wv:t(128),wo:t(256),bq:t(16),bk:t(8),bv:t(8),ffnNorm:t(16),wgate:t(256),wup:t(256),wdown:t(256)},_=t(16),G=t(64),B=new Float32Array(0),D=await this.layerForwardKV(G,{...A,seq:4},x,0,B,B,!0),R=Ge(D.out.slice(48,64),_,1,16,1e-6),M={attnNorm:this.uploadGpu(x.attnNorm),wq:this.uploadGpu(x.wq),wk:this.uploadGpu(x.wk),wv:this.uploadGpu(x.wv),wo:this.uploadGpu(x.wo),ffnNorm:this.uploadGpu(x.ffnNorm),wgate:this.uploadGpu(x.wgate),wup:this.uploadGpu(x.wup),wdown:this.uploadGpu(x.wdown),bq:this.uploadGpu(x.bq),bk:this.uploadGpu(x.bk),bv:this.uploadGpu(x.bv)},C=this.uploadGpu(_),K=this.kvQuant;this.kvQuant=!1,this.resetKvGpu();let Q=await this.runDecodeGpu(G,{...A,seq:4},[M],0,C,"selftest-A");if(!q(Q,R,.008))return this.resetKvGpu(),this.kvQuant=K,e("runDecodeGpu.prefill");await this.runDecodeGpu(G.slice(0,48),{...A,seq:3},[M],0,C,"selftest-B");let Y=await this.runDecodeGpu(G.slice(48,64),{...A,seq:1},[M],3,C,"selftest-B");if(!q(Y,R,.008))return this.resetKvGpu(),this.kvQuant=K,e("runDecodeGpu.decode");this.kvQuant=K,this.resetKvGpu();for(let $ of Object.values(M))$?.destroy?.();C.destroy?.()}{let F=Float32Array.from({length:152064},()=>(Math.random()*2-1)*8),w=[...new Set(Array.from({length:40},()=>Math.floor(Math.random()*152064)))],A=F.slice();for(let S=0;S<152064;S++)A[S]=30*Math.tanh(A[S]/30);for(let S of w)A[S]=A[S]>0?A[S]/1.15:A[S]*1.15;let x=Array.from(A.keys()).sort((S,L)=>A[L]-A[S]).slice(0,64),_=globalThis,G=[],B=this.storage(152064*4);this.device.queue.writeBuffer(B,0,F),G.push(B);let D=this.device.createCommandEncoder(),R=this.uniform([152064],{offset:4,value:30});this.recordPass(D,"softcap_logits",[R,B],this.grid1D(152064));let M=this.bufU32(Uint32Array.from(w),_.GPUBufferUsage.STORAGE|_.GPUBufferUsage.COPY_DST),C=this.uniform([w.length],{offset:4,value:1.15});this.recordPass(D,"penalize_logits",[C,M,B],this.grid1D(w.length));let K=this.storage(512),Q=this.uniform([152064,64]);this.recordPass(D,"top_k",[Q,B,K],[1,1,1]),G.push(R,M,C,Q,K);let Y=this.device.createBuffer({size:512,usage:_.GPUBufferUsage.COPY_DST|_.GPUBufferUsage.MAP_READ});D.copyBufferToBuffer(K,0,Y,0,512),this.device.queue.submit([D.finish()]),await Y.mapAsync(_.GPUMapMode.READ);let $=new Uint32Array(Y.getMappedRange().slice(0));Y.unmap(),Y.destroy(),this.release(G);let V=$.slice(0,64),W=new Float32Array($.buffer,256,64);this.topKOk=!0;for(let S=0;S<64;S++){let L=Math.abs(W[S]-A[x[S]])<=1e-4*(1+Math.abs(A[x[S]])),H=Math.abs(A[V[S]]-W[S])<=1e-4*(1+Math.abs(W[S]));if(!L||!H){this.topKOk=!1,console.error(`[selfValidate] top_k KO sur ce GPU (rang ${S}) \u2014 repli sur le sampling CPU plein-vocab (plus lent, m\xEAme r\xE9sultat).`);break}}}if(this.rwkvWkv7Ok){let k=t(128),F=t(16),w=t(16),A=t(16),x=t(16),_=t(16),G=Float32Array.from({length:16},()=>Math.random()*.5+.5),B=k.slice(),D=new Float32Array(16);for(let W=0;W<2;W++){let S=W*8;for(let L=0;L<8;L++){let H=W*8*8+L*8,j=A[S+L],I=0;for(let E=0;E<8;E++)I+=_[S+E]*B[H+E];let N=0;for(let E=0;E<8;E++){let J=G[S+E]*B[H+E]+j*w[S+E]+x[S+E]*I;B[H+E]=J,N+=F[S+E]*J}D[S+L]=N}}let R=await this.rwkvWkv7(k.slice(),F,G,w,A,_,x,2,8),M=(W,S)=>W.length===S.length&&W.every((L,H)=>Math.abs(L-S[H])<=.001*(1+Math.abs(S[H])));!M(R.S,B)||!M(R.y,D)?(this.rwkvWkv7Ok=!1,console.error("[selfValidate] RWKV-7 WKV KO sur ce GPU \u2014 une archi RWKV (moteur v2) refuserait de charger (non bloquant pour le chat texte).")):console.log("[selfValidate] RWKV-7 WKV OK (r\xE9currence \xE0 \xE9tat fixe, moteur v2)");let C=16,K=t(C),Q=t(C),Y=t(C*6),$=new Float32Array(C*6);for(let W=0;W<6;W++)for(let S=0;S<C;S++){let L=W*C+S;$[L]=K[S]+(Q[S]-K[S])*Y[L]}let V=await this.rwkvTokenShift(K,Q,Y,C);if(M(V,$)?console.log("[selfValidate] RWKV-7 token-shift OK"):(this.rwkvWkv7Ok=!1,console.error("[selfValidate] RWKV-7 token-shift KO sur ce GPU (non bloquant pour le chat texte).")),this.rwkvResidentOk){let W=globalThis,S=W.GPUBufferUsage.STORAGE|W.GPUBufferUsage.COPY_DST|W.GPUBufferUsage.COPY_SRC,L=2,H=8,j=L*H,I=(E,J)=>{let se=Math.max(16,Math.ceil((E.length*4+(J?4:0))/16)*16),ae=this.device.createBuffer({size:se,usage:W.GPUBufferUsage.UNIFORM|W.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(ae,0,new Uint32Array(E)),J&&this.device.queue.writeBuffer(ae,J.off,new Float32Array([J.val])),ae},N=E=>this.device.createBuffer({size:E*4,usage:S});try{let E=t(j),J=t(j),se=t(j),ae=Float32Array.from({length:j},()=>Math.random()),fe=new Float32Array(j),_e=new Float32Array(j),pe=new Float32Array(j);for(let ie=0;ie<L;ie++){let Z=0;for(let de=0;de<H;de++){let oe=E[ie*H+de]*J[ie*H+de];Z+=oe*oe}Z=Math.sqrt(Z)||1e-12;for(let de=0;de<H;de++){let oe=ie*H+de,Ne=E[oe]*J[oe]/Z;_e[oe]=-Ne,pe[oe]=Ne*ae[oe],fe[oe]=E[oe]*(1+(ae[oe]-1)*se[oe])}}let Be=N(j),Te=N(j),re=N(j);this.dispatch("rwkv_kprep",[I([L,H]),this.buf(E,S),this.buf(ae,S),this.buf(J,S),this.buf(se,S),Be,Te,re],this.grid1D(L));let Ae=M(await this.readBack(Be,j*4),fe)&&M(await this.readBack(Te,j*4),_e)&&M(await this.readBack(re,j*4),pe);Be.destroy?.(),Te.destroy?.(),re.destroy?.();let le=t(j),Ut=t(j),Pt=t(j),Gt=t(j),_t=t(j),Bt=t(j),xt=new Float32Array(j);for(let ie=0;ie<L;ie++){let Z=ie*H,de=0;for(let ne=0;ne<H;ne++)de+=le[Z+ne];de/=H;let oe=0;for(let ne=0;ne<H;ne++){let Wt=le[Z+ne]-de;oe+=Wt*Wt}oe/=H;let Ne=1/Math.sqrt(oe+64e-5),Nt=0;for(let ne=0;ne<H;ne++)Nt+=Ut[Z+ne]*fe[Z+ne]*Pt[Z+ne];for(let ne=0;ne<H;ne++)xt[Z+ne]=(le[Z+ne]-de)*Ne*_t[Z+ne]+Bt[Z+ne]+Nt*Gt[Z+ne]}let et=new Float32Array(2*j);et.set(_t,0),et.set(Bt,j);let tt=N(j);this.dispatch("rwkv_out_gn",[I([L,H],{off:8,val:64e-5}),this.buf(le,S),this.buf(Ut,S),this.buf(fe,S),this.buf(Pt,S),this.buf(Gt,S),this.buf(et,S),tt],this.grid1D(L));let Ft=M(await this.readBack(tt,j*4),xt);tt.destroy?.();let qt=t(j),St=t(j),Qr=Float32Array.from(qt,(ie,Z)=>Math.exp(-.606531/(1+Math.exp(-(ie+St[Z]))))),rt=N(j);this.dispatch("rwkv_decay",[this.buf(qt,S),this.buf(St,S),rt],this.grid1D(j));let Mt=M(await this.readBack(rt,j*4),Qr);rt.destroy?.();let Tt=t(j),Ot=t(j),Dt=t(j),Ct=t(j),$r=Float32Array.from(Tt,(ie,Z)=>ie+(Ot[Z]-ie)*(1/(1+Math.exp(-(Dt[Z]+Ct[Z]))))),nt=this.buf(Tt,S);this.dispatch("rwkv_vresid",[nt,this.buf(Ot,S),this.buf(Dt,S),this.buf(Ct,S)],this.grid1D(j));let Rt=M(await this.readBack(nt,j*4),$r);nt.destroy?.();let Lt=t(j),zt=t(j),jt=t(j),Yr=Float32Array.from(Lt,(ie,Z)=>ie+(zt[Z]-ie)*jt[Z]),st=N(j);this.dispatch("rwkv_lerp",[this.buf(Lt,S),this.buf(zt,S),this.buf(jt,S),st],this.grid1D(j));let Ht=M(await this.readBack(st,j*4),Yr);st.destroy?.();let Et=t(j),Vr=Float32Array.from(Et,ie=>{let Z=Math.max(ie,0);return Z*Z}),it=N(j);this.dispatch("sqrelu",[this.buf(Et,S),it],this.grid1D(j));let Kt=M(await this.readBack(it,j*4),Vr);it.destroy?.(),!Ae||!Ft||!Mt||!Rt||!Ht||!Kt?(this.rwkvResidentOk=!1,console.error(`[selfValidate] glu RWKV r\xE9sidente KO sur ce GPU (kprep:${Ae} gn:${Ft} decay:${Mt} vresid:${Rt} lerp:${Ht} sqrelu:${Kt}) \u2014 repli forwardToken JS+readback (correct, lent).`)):console.log("[selfValidate] glu RWKV r\xE9sidente OK (kprep, out_gn, decay, vresid, lerp, sqrelu)")}catch(E){this.rwkvResidentOk=!1,console.error("[selfValidate] glu RWKV r\xE9sidente : erreur d\u2019ex\xE9cution \u2014 repli forwardToken JS+readback.",E)}}}if(this.lfm2ShortConvOk){let U=B=>Float32Array.from({length:B},()=>Math.random()*2-1),m=(B,D)=>B.length===D.length&&B.every((R,M)=>Math.abs(R-D[M])<=.001*(1+Math.abs(D[M]))),F=U(96),w=U(64),A=U(96),x=new Float32Array(32),_=w.slice();for(let B=0;B<32;B++){let D=F[B]*F[64+B],R=A[B*3+2]*D;for(let M=0;M<2;M++)R+=A[B*3+M]*w[M*32+B];for(let M=0;M+2<3;M++)_[M*32+B]=w[(M+1)*32+B];_[32+B]=D,x[B]=R*F[32+B]}let G=await this.lfm2ShortConv(F,w.slice(),A,32,3);!m(G.out,x)||!m(G.state,_)?(this.lfm2ShortConvOk=!1,console.error("[selfValidate] LFM2 shortconv KO sur ce GPU \u2014 une archi lfm2 refuserait de charger (non bloquant pour le reste).")):console.log("[selfValidate] LFM2 shortconv OK (conv courte gat\xE9e, moteur v2)")}let T=await this.validateDiffusion();T?console.warn("[selfValidate] image-gen primitive KO:",T,"(non bloquant \u2014 chemin texte intact)"):console.log("[selfValidate] image-gen primitives OK (silu, group_norm, conv2d, conv2d_direct, conv2d_direct_q8, relu, upsample_nearest, layernorm, quick_gelu, attention_full)");let z=await this.validateVideoResident();return z?(this.videoResidentOk=!1,console.warn("[selfValidate] motion r\xE9sident KO:",z,"\u2014 repli JS+readback (plus lent, m\xEAme r\xE9sultat).")):console.log("[selfValidate] motion r\xE9sident OK (video_motion_gather, video_motion_scatter, video_add_pe, attn_temporal)"),!0}async validateVideoResident(){let e=o=>Float32Array.from({length:o},()=>Math.random()*2-1),r=(o,u,c=.005)=>o.length===u.length&&o.every((l,d)=>Math.abs(l-u[d])<=c*(1+Math.abs(u[d])));{let o=e(120),u=new Float32Array(120);for(let d=0;d<5;d++)for(let g=0;g<3;g++)for(let h=0;h<8;h++)u[(d*3+g)*8+h]=o[(g*8+h)*5+d];let c=this.recordingSession(),l=await c.finish(c.videoGather(o,3,8,5),120);if(!r(l,u,1e-6))return"video_motion_gather"}{let o=e(120),u=e(120),c=new Float32Array(120);for(let g=0;g<3;g++)for(let h=0;h<8;h++)for(let p=0;p<5;p++)c[(g*8+h)*5+p]=o[(p*3+g)*8+h]+u[(g*8+h)*5+p];let l=this.recordingSession(),d=await l.finish(l.videoScatter(o,u,3,8,5),120);if(!r(d,c,1e-6))return"video_motion_scatter"}{let o=e(120),u=e(24),c=new Float32Array(120);for(let g=0;g<5;g++)for(let h=0;h<3;h++)for(let p=0;p<8;p++)c[(g*3+h)*8+p]=o[(g*3+h)*8+p]+u[h*8+p];let l=this.recordingSession(),d=await l.finish(l.videoAddPe(o,u,3,8,5),120);if(!r(d,c,1e-6))return"video_add_pe"}{let o=e(120),u=e(120),c=e(120),l=1/Math.sqrt(4),d=new Float32Array(120);for(let p=0;p<5;p++)for(let v=0;v<2;v++){let y=v*4,P=p*3;for(let O=0;O<3;O++){let q=(P+O)*8+y,T=new Float32Array(3),z=-1e30;for(let m=0;m<3;m++){let b=0,k=(P+m)*8+y;for(let F=0;F<4;F++)b+=o[q+F]*u[k+F];T[m]=b*l,T[m]>z&&(z=T[m])}let U=0;for(let m=0;m<3;m++)T[m]=Math.exp(T[m]-z),U+=T[m];for(let m=0;m<3;m++){let b=T[m]/U,k=(P+m)*8+y;for(let F=0;F<4;F++)d[q+F]+=b*c[k+F]}}}let g=this.recordingSession(),h=await g.finish(g.attnTemporal(o,u,c,5,3,2,4),120);if(!r(h,d))return"attn_temporal"}return null}async validateDiffusion(){let e=S=>Float32Array.from({length:S},()=>Math.random()*2-1),r=(S,L,H=.005)=>S.length===L.length&&S.every((j,I)=>Math.abs(j-L[I])<=H*(1+Math.abs(L[I]))),t=e(70),n=t.map(S=>S/(1+Math.exp(-S)));if(!r(await this.silu(t),n))return"silu";let s=4,a=5,i=2,o=1e-5,u=e(s*a),c=e(s),l=e(s),d=new Float32Array(s*a),g=s/i;for(let S=0;S<i;S++){let L=S*g*a,H=g*a,j=0;for(let E=0;E<H;E++)j+=u[L+E];j/=H;let I=0;for(let E=0;E<H;E++){let J=u[L+E]-j;I+=J*J}I/=H;let N=1/Math.sqrt(I+o);for(let E=0;E<H;E++){let J=S*g+Math.floor(E/a);d[L+E]=(u[L+E]-j)*N*c[J]+l[J]}}if(!r(await this.groupNorm(u,c,l,s,a,i,o),d))return"group_norm";let h=2,p=4,v=4,y=3,P=3,O=1,q=1,T=4,z=4,U=e(h*p*v),m=e(y*h*P*P),b=e(y),k=new Float32Array(y*T*z);for(let S=0;S<y;S++)for(let L=0;L<T;L++)for(let H=0;H<z;H++){let j=b[S];for(let I=0;I<h;I++)for(let N=0;N<P;N++)for(let E=0;E<P;E++){let J=L*O+N-q,se=H*O+E-q;J>=0&&J<p&&se>=0&&se<v&&(j+=U[I*p*v+J*v+se]*m[((S*h+I)*P+N)*P+E])}k[(S*T+L)*z+H]=j}if(!r(await this.conv2d(U,m,b,h,p,v,y,P,P,O,q),k))return"conv2d";if(!r(await this.conv2dDirect(U,m,b,h,p,v,y,P,P,O,q),k))return"conv2d_direct";{let I=e(1200),N=e(108),E=e(4),J=await this.conv2dDirect(I,N,E,3,20,20,4,3,3,1,1),se=this.convTiledOk;this.convTiledOk=!0;let ae=this.recordingSession(),fe=await ae.finish(ae.conv2d(I,N,E,3,20,20,4,3,3,1,1),1600);this.convTiledOk=se,r(fe,J)||(this.convTiledOk=!1,console.warn("[selfValidate] conv2d_3x3_tiled KO sur ce GPU \u2014 repli sur conv2d_direct (plus lent, m\xEAme r\xE9sultat)."))}{let H=e(8*p*v),j=e(32*P*P),I=e(4),N=De(j),E=await this.conv2dDirect(H,ve(N),I,8,p,v,4,P,P,O,q),J={codes:this.uploadGpuRaw(new Uint8Array(N.codes.buffer,N.codes.byteOffset,N.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(N.scales.buffer,N.scales.byteOffset,N.scales.byteLength))},se=this.recordingSession(),ae=await se.finish(se.conv2d(H,J,I,8,p,v,4,P,P,O,q),4*p*v);if(this.releaseGpu([J.codes,J.sc]),!r(ae,E))return"conv2d_direct_q8"}{let H=e(8*p*v),j=e(32*P*P),I=e(4),N=Oe(j),E=await this.conv2dDirect(H,ge(N),I,8,p,v,4,P,P,O,q),J={nib:this.uploadGpuRaw(N.nibbles),sc:this.uploadGpuRaw(new Uint8Array(N.scales.buffer,N.scales.byteOffset,N.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(N.mins.buffer,N.mins.byteOffset,N.mins.byteLength))},se=this.recordingSession(),ae=await se.finish(se.conv2d(H,J,I,8,p,v,4,P,P,O,q),4*p*v);if(this.releaseGpu([J.nib,J.sc,J.mn]),!r(ae,E))return"conv2d_direct_q4"}{let L=e(66),H=new Uint16Array(66);for(let E=0;E<66;E++)H[E]=Fe(L[E]);let j=new Float32Array(66);for(let E=0;E<66;E++)j[E]=he(H[E]);let I=this.f16ToF32Gpu(new Uint8Array(H.buffer,H.byteOffset,H.byteLength),66),N=await this.readGpu(I,66);if(I.destroy?.(),!r(N,j,1e-6))return"f16_to_f32"}let F=e(70);if(!r(await this.relu(F),F.map(S=>Math.max(S,0))))return"relu";let w=2,A=2,x=2,_=2,G=A*_,B=x*_,D=e(w*A*x),R=new Float32Array(w*G*B);for(let S=0;S<w;S++)for(let L=0;L<G;L++)for(let H=0;H<B;H++)R[S*G*B+L*B+H]=D[S*A*x+Math.floor(L/_)*x+Math.floor(H/_)];if(!r(await this.upsampleNearest(D,w,A,x,_),R))return"upsample_nearest";let M=2,C=8,K=1e-5,Q=e(M*C),Y=e(C),$=e(C),V=new Float32Array(M*C);for(let S=0;S<M;S++){let L=S*C,H=0;for(let N=0;N<C;N++)H+=Q[L+N];H/=C;let j=0;for(let N=0;N<C;N++){let E=Q[L+N]-H;j+=E*E}j/=C;let I=1/Math.sqrt(j+K);for(let N=0;N<C;N++)V[L+N]=(Q[L+N]-H)*I*Y[N]+$[N]}if(!r(await this.layernorm(Q,Y,$,M,C,K),V))return"layernorm";let W=e(70);if(!r(await this.quickGelu(W),W.map(S=>S/(1+Math.exp(-1.702*S)))))return"quick_gelu";{let N=1/Math.sqrt(4),E=e(24),J=e(40),se=e(40),ae=new Float32Array(24);for(let fe=0;fe<2;fe++)for(let _e=0;_e<3;_e++){let pe=new Float32Array(5),Be=-1/0;for(let re=0;re<5;re++){let Ae=0;for(let le=0;le<4;le++)Ae+=E[_e*8+fe*4+le]*J[re*8+fe*4+le];pe[re]=Ae*N,pe[re]>Be&&(Be=pe[re])}let Te=0;for(let re=0;re<5;re++)pe[re]=Math.exp(pe[re]-Be),Te+=pe[re];for(let re=0;re<4;re++){let Ae=0;for(let le=0;le<5;le++)Ae+=pe[le]/Te*se[le*8+fe*4+re];ae[_e*8+fe*4+re]=Ae}}if(!r(await this.attentionFull(E,J,se,3,2,2,4,5),ae))return"attention_full"}if(this.attnFullWgOk){let S=[{nT:70,kvL:70,nH:5,hd:64},{nT:16,kvL:77,nH:5,hd:64},{nT:9,kvL:9,nH:8,hd:160}];for(let L of S){let H=L.nH*L.hd,j=e(L.nT*H),I=e(L.kvL*H),N=e(L.kvL*H),E=await this.attentionFull(j,I,N,L.nT,L.nH,L.nH,L.hd,L.kvL),J=await this.attentionFullWg(j,I,N,L.nT,L.nH,L.nH,L.hd,L.kvL);if(!r(J,E)){this.attnFullWgOk=!1,console.warn(`[selfValidate] attention_full_wg KO sur ce GPU (hd=${L.hd}, kv=${L.kvL}) \u2014 repli sur attention_full (plus lent, m\xEAme r\xE9sultat).`);break}}}return null}};X.timingOn=(()=>{try{return ce("timing")==="1"}catch{return!1}})(),X.profileOn=(()=>{try{return ce("gpuprofile")==="1"}catch{return!1}})(),X.MAX_WG_DIM=65535,X.BLOCK_ELEMS={Q4_K:256,Q5_K:256,Q6_K:256,Q8_0:32,Q5_0:32,Q4_0:32,F32:1,F16:1},X.DEQUANT_SHADER={Q4_K:"dequant_q4k",Q8_0:"dequant_q8_0",Q5_0:"dequant_q5_0",Q6_K:"dequant_q6k",Q4_0:"dequant_q4_0",Q5_K:"dequant_q5k"},X.STORAGE_USAGE=140;Ye=X});function ur(f,e){let r=new DataView(f.buffer,f.byteOffset,f.byteLength),t=new Float32Array(e);for(let n=0;n<e;n++)t[n]=ue(r.getUint16(n*2,!0));return t}function cr(f,e){let r=new DataView(f.buffer,f.byteOffset,f.byteLength),t=new Float32Array(e);for(let n=0;n<e;n++)t[n]=r.getFloat32(n*4,!0);return t}function ze(f,e,r,t){let n=0;for(let i=0;i<r;i++)n+=f[i]*f[i];let s=1/Math.sqrt(n/r+t),a=new Float32Array(r);for(let i=0;i<r;i++)a[i]=f[i]*s*e[i];return a}var ln,Se,Ve,lr=te(()=>{"use strict";at();ot();Ce();ln=f=>f/(1+Math.exp(-f)),Se=class Se{constructor(e,r,t){this.engine=e;this.manifest=r;this.raw=t;this.w=new Map;this.g=new Map;this.pos=0;this.rLayers=[];this.tokNormGpu=null;this.normBufs=[];this.ffn=0}isBigProj(e){return/\.(shortconv\.(in_proj|out_proj)|attn_(q|k|v|output)|ffn_(gate|up|down))\.weight$/.test(e)}async load(e){if(!this.engine.lfm2ShortConvOk)throw new Error("kernel shortconv LFM2 invalid\xE9 sur ce GPU (selfValidate) \u2014 archi lfm2 refus\xE9e.");let r=this.manifest.arch;if(this.D=r.d,this.NH=r.nHeads,this.NKV=r.nKvHeads,this.HD=r.headDim,this.NL=r.blockCount,this.vocab=r.vocab,this.EPS=r.rmsEps,this.THETA=r.ropeTheta,!r.lfm2)throw new Error("manifest sans profil lfm2");this.LC=r.lfm2.lCache,this.convLayer=r.lfm2.kvHeadsPerLayer.map(t=>t===0),this.tok=e,this.stops=new Set(this.manifest.chat?.stopTokenIds?.length?this.manifest.chat.stopTokenIds:[7]);for(let[t,n]of Object.entries(this.manifest.tensors)){if(t==="token_embd.weight"){if(this.embedBytes=await this.raw(t),this.embedDtype=n.dtype,n.dtype==="q4"){let a=Pe(this.embedBytes,n.nElems);this.g.set("head",{kind:"q4",nib:this.engine.uploadGpuRaw(a.nibbles),sc:this.up(a.scales),mn:this.up(a.mins),IN:this.D,OUT:this.vocab})}else if(n.dtype==="q8"){let a=xe(this.embedBytes,n.nElems);this.g.set("head",{kind:"q8",codes:this.upI8(a.codes),sc:this.up(a.scales),IN:this.D,OUT:this.vocab})}continue}let s=await this.raw(t);if(this.isBigProj(t)&&(n.dtype==="q4"||n.dtype==="q8")){let a=n.shape[0],i=n.nElems/a;if(n.dtype==="q8"){let o=xe(s,n.nElems);this.g.set(t,{kind:"q8",codes:this.upI8(o.codes),sc:this.up(o.scales),IN:a,OUT:i})}else{let o=Pe(s,n.nElems);this.g.set(t,{kind:"q4",nib:this.engine.uploadGpuRaw(o.nibbles),sc:this.up(o.scales),mn:this.up(o.mins),IN:a,OUT:i})}}else this.w.set(t,n.dtype==="f32"?cr(s,n.nElems):n.dtype==="f16"?ur(s,n.nElems):n.dtype==="q8"?ve(xe(s,n.nElems)):ge(Pe(s,n.nElems)))}this.buildResidentLayers(),this.reset()}buildResidentLayers(){let e=r=>{let t=this.engine.uploadGpu(this.w.get(r));return this.normBufs.push(t),t};this.tokNormGpu=e("token_embd_norm.weight"),this.ffn=this.g.get("blk.0.ffn_gate.weight")?.OUT??0,this.rLayers=[];for(let r=0;r<this.NL;r++){let t=`blk.${r}.`,n={attnNorm:e(t+"attn_norm.weight"),ffnNorm:e(t+"ffn_norm.weight"),wgate:this.g.get(t+"ffn_gate.weight"),wup:this.g.get(t+"ffn_up.weight"),wdown:this.g.get(t+"ffn_down.weight")};this.convLayer[r]?this.rLayers.push({conv:!0,...n,convW:e(t+"shortconv.conv.weight"),inProj:this.g.get(t+"shortconv.in_proj.weight"),outProj:this.g.get(t+"shortconv.out_proj.weight")}):this.rLayers.push({conv:!1,...n,qNorm:e(t+"attn_q_norm.weight"),kNorm:e(t+"attn_k_norm.weight"),wq:this.g.get(t+"attn_q.weight"),wk:this.g.get(t+"attn_k.weight"),wv:this.g.get(t+"attn_v.weight"),wo:this.g.get(t+"attn_output.weight")})}}residentAvailable(){return this.engine.lfm2ResidentOk!==!1&&!!this.g.get("head")&&this.rLayers.length===this.NL&&this.ffn>0}cfg(){return{D:this.D,nHeads:this.NH,nKvHeads:this.NKV,headDim:this.HD,ffn:this.ffn,eps:this.EPS,theta:this.THETA,lc:this.LC,vocab:this.vocab}}embedsFor(e){let r=this.D,t=new Float32Array(e.length*r);for(let n=0;n<e.length;n++)t.set(this.embedRow(e[n]),n*r);return t}async logitsGpu(e,r,t){return this.pos=r+e.length,this.engine.lfm2LogitsGpu(this.embedsFor(e),e.length,this.cfg(),this.rLayers,this.g.get("head"),this.tokNormGpu,r,t)}async topKGpu(e,r,t,n,s,a=40){return this.pos=r+e.length,this.engine.lfm2TopKGpu(this.embedsFor(e),e.length,this.cfg(),this.rLayers,this.g.get("head"),this.tokNormGpu,r,t,n,s,a)}async prefillGpu(e,r,t){this.pos=r+e.length,await this.engine.lfm2PrefillGpu(this.embedsFor(e),e.length,this.cfg(),this.rLayers,this.tokNormGpu,r,t)}up(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}upI8(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}unload(){for(let e of this.g.values())for(let r of["nib","sc","mn","codes"])e[r]?.destroy?.();for(let e of this.normBufs)e?.destroy?.();this.normBufs=[],this.rLayers=[],this.tokNormGpu=null,this.engine.clearLfm2State?.(),this.g.clear(),this.w.clear()}reset(){this.pos=0,this.state=Array.from({length:this.NL},(e,r)=>this.convLayer[r]?{conv:new Float32Array((this.LC-1)*this.D)}:{K:[],V:[]})}async gemm(e,r){let t=this.g.get(e);if(!t){let n=this.w.get(e==="head"?"token_embd.weight":e),s=n.length/r.length,a=new Float32Array(s);for(let i=0;i<s;i++){let o=0,u=i*r.length;for(let c=0;c<r.length;c++)o+=n[u+c]*r[c];a[i]=o}return a}return t.kind==="q8"?this.engine.matmulQ8(r,t.codes,t.sc,1,t.IN,t.OUT):this.engine.matmulQ4(r,t.nib,t.sc,t.mn,1,t.IN,t.OUT)}embedRow(e){let r=this.D;if(this.embedDtype==="f16")return ur(this.embedBytes.subarray(e*r*2,e*r*2+r*2),r);if(this.embedDtype==="f32")return cr(this.embedBytes.subarray(e*r*4,e*r*4+r*4),r);if(this.embedDtype==="q8"){let o=this.vocab*r,u=r/32,c=new Int8Array(this.embedBytes.buffer,this.embedBytes.byteOffset+e*r,r),l=this.embedBytes.subarray(o+e*u*2,o+e*u*2+u*2),d=new DataView(l.buffer,l.byteOffset,l.byteLength),g=new Float32Array(r);for(let h=0;h<u;h++){let p=ue(d.getUint16(h*2,!0));for(let v=0;v<32;v++)g[h*32+v]=c[h*32+v]*p}return g}let t=this.vocab*r,n=r/32,s=t/2,a=t/2+t/32*2,i=new Uint8Array(r/2+n*2*2);return i.set(this.embedBytes.subarray(e*r/2,e*r/2+r/2),0),i.set(this.embedBytes.subarray(s+e*n*2,s+e*n*2+n*2),r/2),i.set(this.embedBytes.subarray(a+e*n*2,a+e*n*2+n*2),r/2+n*2),ge(Pe(i,r))}rope(e,r,t){let n=this.HD,s=e.slice();for(let a=0;a<r;a++){let i=a*n;for(let o=0;o<n/2;o++){let u=Math.pow(this.THETA,-2*o/n),c=Math.cos(t*u),l=Math.sin(t*u),d=e[i+o],g=e[i+o+n/2];s[i+o]=d*c-g*l,s[i+o+n/2]=d*l+g*c}}return s}async forwardToken(e){let r=this.D,t=this.pos++,n=this.embedRow(e);for(let s=0;s<this.NL;s++){let a=`blk.${s}.`,i=this.state[s],o=ze(n,this.w.get(a+"attn_norm.weight"),r,this.EPS),u;if(this.convLayer[s]){let h=await this.gemm(a+"shortconv.in_proj.weight",o),p=await this.engine.lfm2ShortConv(h,i.conv,this.w.get(a+"shortconv.conv.weight"),r,this.LC);i.conv=p.state,u=await this.gemm(a+"shortconv.out_proj.weight",p.out)}else{let h=this.NKV*this.HD,p=await this.gemm(a+"attn_q.weight",o),v=await this.gemm(a+"attn_k.weight",o),y=await this.gemm(a+"attn_v.weight",o),P=this.w.get(a+"attn_q_norm.weight"),O=this.w.get(a+"attn_k_norm.weight");for(let m=0;m<this.NH;m++)p.set(ze(p.slice(m*this.HD,(m+1)*this.HD),P,this.HD,this.EPS),m*this.HD);for(let m=0;m<this.NKV;m++)v.set(ze(v.slice(m*this.HD,(m+1)*this.HD),O,this.HD,this.EPS),m*this.HD);p=this.rope(p,this.NH,t),v=this.rope(v,this.NKV,t),i.K.push(v),i.V.push(y);let q=new Float32Array(this.NH*this.HD),T=i.K.length,z=1/Math.sqrt(this.HD),U=this.NH/this.NKV;for(let m=0;m<this.NH;m++){let b=Math.floor(m/U),k=m*this.HD,F=b*this.HD,w=new Float32Array(T),A=-1e30;for(let _=0;_<T;_++){let G=0;for(let B=0;B<this.HD;B++)G+=p[k+B]*i.K[_][F+B];w[_]=G*z,w[_]>A&&(A=w[_])}let x=0;for(let _=0;_<T;_++)w[_]=Math.exp(w[_]-A),x+=w[_];for(let _=0;_<T;_++){let G=w[_]/x;for(let B=0;B<this.HD;B++)q[k+B]+=G*i.V[_][F+B]}}u=await this.gemm(a+"attn_output.weight",q)}for(let h=0;h<r;h++)n[h]+=u[h];let c=ze(n,this.w.get(a+"ffn_norm.weight"),r,this.EPS),l=await this.gemm(a+"ffn_gate.weight",c),d=await this.gemm(a+"ffn_up.weight",c);for(let h=0;h<l.length;h++)l[h]=ln(l[h])*d[h];let g=await this.gemm(a+"ffn_down.weight",l);for(let h=0;h<r;h++)n[h]+=g[h]}return n=ze(n,this.w.get("token_embd_norm.weight"),r,this.EPS),this.gemm("head",n)}async classify(e,r){this.reset();let t;for(let s of this.tok.encode(e))t=await this.forwardToken(s);let n=r.map(s=>{let a=this.tok.encode(s);return{label:s,logit:t[a[1]??a[0]]}}).sort((s,a)=>a.logit-s.logit);return{label:n[0].label,scores:n}}banTools(e){for(let r of Se.TOOL_BAN)r<e.length&&(e[r]=-1e30);return e}sampleTok(e,r,t){let{temperature:n=.8,topK:s=40,repeatPenalty:a=1.3}=t,i=new Set(r),o=[];for(let d=0;d<e.length;d++){let g=e[d];i.has(d)&&(g=g>0?g/a:g*a),o.push({i:d,v:g})}o.sort((d,g)=>g.v-d.v),o.length=s;let u=o[0].v,c=0;for(let d of o)d.p=Math.exp((d.v-u)/n),c+=d.p;let l=Math.random()*c;for(let d of o)if(l-=d.p,l<=0)return d.i;return o[0].i}async generate(e,r,t,n,s){this.reset();let a=this.tok.encode(e),i;for(let u of a)i=await this.forwardToken(u);let o=[];for(let u=0;u<r&&!n?.();u++){this.banTools(i);let c;if(s?.sample)c=this.sampleTok(i,o.slice(-64),s);else{c=0;for(let l=1;l<i.length;l++)i[l]>i[c]&&(c=l)}if(this.stops.has(c))break;o.push(c),t&&t(this.tok.decode(o)),i=await this.forwardToken(c)}return o.length?this.tok.decode(o):""}pickFromTopK(e,r){let t=[],n=[];for(let d=0;d<e.ids.length;d++)if(!Se.TOOL_BAN.includes(e.ids[d])){if(e.vals[d]===-1/0)break;t.push(e.ids[d]),n.push(e.vals[d])}if(!t.length)return e.ids[0];if(!r?.sample)return t[0];let{temperature:s=.8,topK:a=40}=r,i=Math.min(a,t.length),o=n[0],u=0,c=new Array(i);for(let d=0;d<i;d++)c[d]=Math.exp((n[d]-o)/s),u+=c[d];let l=Math.random()*u;for(let d=0;d<i;d++)if(l-=c[d],l<=0)return t[d];return t[0]}async generateResident(e,r,t,n,s){if(!this.residentAvailable())return this.generate(e,r,t,n,s);let a="gen",i=s?.repeatPenalty??(s?.sample?1.3:1),o=this.tok.encode(e),u,c=0;for(;c<o.length;){if(n?.())return"";let g=Math.min(c+Se.PREFILL_CHUNK,o.length),h=o.slice(c,g);g<o.length?await this.prefillGpu(h,c,a):u=await this.topKGpu(h,c,a,[],1,48),c=g}let l=o.length,d=[];for(let g=0;g<r&&!n?.();g++){let h=this.pickFromTopK(u,s);if(this.stops.has(h))break;d.push(h),t&&t(this.tok.decode(d)),u=await this.topKGpu([h],l,a,i!==1?[...new Set(d.slice(-64))]:[],i,48),l++}return d.length?this.tok.decode(d):""}};Se.TOOL_BAN=[8,10,12],Se.PREFILL_CHUNK=128;Ve=Se});function fr(f){if(!f.length)return null;let e=1/0,r=0,t=0;for(let n of f)e=Math.min(e,n.offset),r=Math.max(r,n.offset+n.bytes),t+=n.bytes;return r-e>64<<20||r-e>t*1.5?null:{start:e,end:r}}function dr(f,e){let r=new Map;for(let s of Object.keys(f)){let a=s.match(/^blk\.(\d+)\./);if(!a)continue;let i=r.get(a[1]);i||r.set(a[1],i=[]),i.push(s)}let t=new Map,n=new Map;return async s=>{let a=f[s];if(!a)throw new Error(`tenseur absent : ${s}`);let i=s.match(/^blk\.(\d+)\./),o=i?r.get(i[1]):void 0,u=o?fr(o.map(v=>f[v])):null;if(!i||!o||!u)return e.bytes(a.offset,a.bytes);let c=i[1],l=t.get(c);l||(l=e.bytes(u.start,u.end-u.start).then(v=>({start:u.start,bytes:v})),t.set(c,l),n.set(c,o.length));let{start:d,bytes:g}=await l,h=g.subarray(a.offset-d,a.offset-d+a.bytes),p=(n.get(c)??1)-1;return p<=0?(t.delete(c),n.delete(c),new Uint8Array(h)):(n.set(c,p),h)}}var dt=te(()=>{"use strict"});var gr=te(()=>{"use strict"});function hr(f,e=16){return Math.ceil(f/e)*e}var pr=te(()=>{"use strict"});function dn(f){return hr(je+f)}function gt(f){if(f.length<je)throw new Error("BRIK: fichier tronqu\xE9 (en-t\xEAte)");let e=String.fromCharCode(f[0],f[1],f[2],f[3]);if(e!==fn)throw new Error(`BRIK: sceau magique absent (${e})`);let r=new DataView(f.buffer,f.byteOffset,f.byteLength),t=r.getUint32(4,!0),n=r.getUint32(8,!0);if(je+n>f.length)throw new Error("BRIK: manifeste tronqu\xE9");return{manifest:JSON.parse(new TextDecoder().decode(f.subarray(je,je+n))),version:t,dataStart:dn(n)}}function mr(f){let{manifest:e,version:r,dataStart:t}=gt(f);return{manifest:e,version:r,dataStart:t,data:f.subarray(t)}}var fn,je,br=te(()=>{"use strict";pr();fn="BRIK",je=12});function vr(f){let e=[...f].sort((n,s)=>n.id-s.id),r=[],t=0;for(let n of e)r[n.id]=t,t+=n.byteLength;return r}function wr(f){let e=vr(f.shards),r={};for(let[n,s]of Object.entries(f.tensors)){let a=gn[s.dtype];if(!a)throw new Error(`dtype BRIK inconnu pour ${n} : ${s.dtype}`);if(e[s.shard]===void 0)throw new Error(`shard ${s.shard} absent du manifeste (tenseur ${n})`);r[n]={offset:e[s.shard]+s.offset,bytes:s.byteLength,nElems:s.nElems,type:a,shape:s.shape}}let t=f.arch;return{arch:t.arch,config:{d:t.d,nHeads:t.nHeads,nKvHeads:t.nKvHeads,headDim:t.headDim,ffn:t.ffn,blockCount:t.blockCount,ropeTheta:t.ropeTheta,rmsEps:t.rmsEps,attnLogitSoftcap:t.attnLogitSoftcap,finalLogitSoftcap:t.finalLogitSoftcap,attnScale:t.attnScale,act:t.act,rmsGainOnePlus:t.rmsGainOnePlus,embedScale:t.embedScale,rwkv:t.rwkv,lfm2:t.lfm2},tensors:r}}var gn,yr=te(()=>{"use strict";gn={f16:"F16",f32:"F32",q4:"Q4W",q8:"Q8W",q3:"Q3W"}});function pn(f,e,r){return`${f}${f.includes("?")?"&":"?"}__brik=${e}-${r}`}async function mn(){try{return await caches.open(hn)}catch{return null}}async function ht(f,e,r,t){let n=e+r-1,s=await mn(),a=pn(f,e,n);if(s){let o=await s.match(a);if(o)return{bytes:new Uint8Array(await o.arrayBuffer()),ranged:!0}}let i;for(let o=0;o<4;o++)try{let u=await fetch(f,{headers:{Range:`bytes=${e}-${n}`},signal:t});if(!u.ok&&u.status!==206)throw new Error(`range fetch ${e}-${n} \xE9chou\xE9 : HTTP ${u.status}`);let c=u.status===206,l=new Uint8Array(await u.arrayBuffer()),d=c?l:l.subarray(e,e+r);if(s&&c)try{await s.put(a,new Response(d,{headers:{"Content-Length":String(d.byteLength)}}))}catch(g){Pr(g)}return{bytes:d,ranged:c}}catch(u){if(t?.aborted)throw u;i=u,o<3&&await new Promise(c=>setTimeout(c,500*2**o))}throw i instanceof Error?i:new Error(String(i))}function Pr(f){kr||(kr=!0,console.warn("[cache] \xE9criture refus\xE9e (quota plein ? navigation priv\xE9e ?) \u2014 les t\xE9l\xE9chargements de mod\xE8les ne seront PAS r\xE9utilisables \xE0 la prochaine visite. Lib\xE9rez de l'espace via le panneau Stockage.",f))}async function bn(f){try{let n=await(await caches.open(Ar)).match(f);if(n)return new Uint8Array(await n.arrayBuffer())}catch{}let e=await fetch(f);if(!e.ok)throw new Error(`HTTP ${e.status}`);let r=new Uint8Array(await e.arrayBuffer());try{await(await caches.open(Ar)).put(f,new Response(r.slice(),{headers:{"Content-Length":String(r.byteLength)}}))}catch(t){Pr(t)}return r}function vn(f,e){return{bytes:async(r,t)=>(await ht(f,e+r,t)).bytes}}function wn(f){return{bytes:async(e,r)=>f.subarray(e,e+r)}}async function Gr(f){let e=await ht(f,0,12);if(!e.ranged){let a=await bn(f),{manifest:i,data:o}=mr(a);return Ur(i,wn(o))}let r=new DataView(e.bytes.buffer,e.bytes.byteOffset,12).getUint32(8,!0),t=await ht(f,0,12+r),{manifest:n,dataStart:s}=gt(t.bytes);return Ur(n,vn(f,s))}function Ur(f,e){if(f.model?.uiArch==="image")throw new Error("Ce fichier est un BRIK image (UNet/CLIP) \u2014 il se charge via la tuile de g\xE9n\xE9ration d'image, pas comme un LLM.");return{source:e,manifest:wr(f),tokenizerId:f.tokenizer?.id,tokenizer:f.tokenizer,uiArch:f.model?.uiArch,modelName:f.model.name}}var hn,kr,Ar,_r=te(()=>{"use strict";"use client";dt();gr();br();yr();hn="brik-range-v1";kr=!1;Ar="brimkern-model-cache"});function Br(f,e,r){let t="";if(e==="deepseek"){t+="<\uFF5Cbegin\u2581of\u2581sentence\uFF5C>",r.trim()&&(t+=r);for(let n of f)n.role==="user"?t+=`<\uFF5CUser\uFF5C>${n.content}`:n.role==="assistant"&&(t+=`<\uFF5CAssistant\uFF5C>${n.content}<\uFF5Cend\u2581of\u2581sentence\uFF5C>`);return t+="<\uFF5CAssistant\uFF5C>",t}if(e==="rwkv7"){r.trim()&&(t+=`System: ${r.trim()}

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
`}return t}var xr=te(()=>{"use strict"});function yn(){let f=[];for(let s=33;s<=126;s++)f.push(s);for(let s=161;s<=172;s++)f.push(s);for(let s=174;s<=255;s++)f.push(s);let e=f.slice(),r=0;for(let s=0;s<256;s++)f.includes(s)||(f.push(s),e.push(256+r),r++);let t=new Array(256),n=new Map;for(let s=0;s<f.length;s++)t[f[s]]=String.fromCodePoint(e[s]),n.set(String.fromCodePoint(e[s]),f[s]);return{enc:t,dec:n}}var Fr,Ie,qr=te(()=>{"use strict";Fr="'(?:[sdmt]|ll|ve|re)| ?\\p{L}+| ?\\p{N}+| ?[^\\s\\p{L}\\p{N}]+|\\s+(?!\\S)|\\s+",Ie=class f{constructor(e){this.vocab=new Map;this.idToTok=new Map;this.ranks=new Map;this.added=[];this.specialIds=new Set;this.addedRe=null;this.bosIds=[];this.cache=new Map;let r=typeof e=="string"?JSON.parse(e):e;if(r?.model?.type!=="BPE")throw new Error(`BpeTokenizer : model.type ${r?.model?.type} non couvert (BPE uniquement)`);({enc:this.byteEnc,dec:this.byteDec}=yn());for(let[i,o]of Object.entries(r.model.vocab))this.vocab.set(i,o),this.idToTok.set(o,i);(r.model.merges??[]).forEach((i,o)=>this.ranks.set(Array.isArray(i)?`${i[0]} ${i[1]}`:i,o));for(let i of r.added_tokens??[])this.added.push(i),this.vocab.set(i.content,i.id),this.idToTok.set(i.id,i.content),i.special&&this.specialIds.add(i.id);if(this.added.length){let i=this.added.map(o=>o.content.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).sort((o,u)=>u.length-o.length);this.addedRe=new RegExp(`(${i.join("|")})`,"g")}let n=f.findSplitPattern(r.pre_tokenizer)??Fr;this.splitRe=new RegExp(n,"gu");let s=i=>{if(!i)return null;if(i.type==="TemplateProcessing")return i.single;if(i.type==="Sequence")for(let o of i.processors??[]){let u=s(o);if(u)return u}return null},a=s(r.post_processor);if(Array.isArray(a))for(let i of a)if(i.SpecialToken){let o=this.vocab.get(i.SpecialToken.id);o!==void 0&&this.bosIds.push(o)}else break}static findSplitPattern(e){if(!e)return null;if(e.type==="Split"&&e.pattern?.Regex)return e.pattern.Regex;if(e.type==="ByteLevel"&&e.use_regex!==!1)return Fr;if(e.type==="Sequence")for(let r of e.pretokenizers??[]){let t=f.findSplitPattern(r);if(t)return t}return null}bpe(e){let r=this.cache.get(e);if(r)return r;let t=Array.from(e);for(;t.length>1;){let s=-1,a=1/0;for(let i=0;i<t.length-1;i++){let o=this.ranks.get(`${t[i]} ${t[i+1]}`);o!==void 0&&o<a&&(a=o,s=i)}if(s<0)break;t=[...t.slice(0,s),t[s]+t[s+1],...t.slice(s+2)]}let n=[];for(let s of t){let a=this.vocab.get(s);if(a!==void 0)n.push(a);else for(let i of s){let o=this.vocab.get(i);o!==void 0&&n.push(o)}}return this.cache.set(e,n),n}encodeChunk(e){let r=[];for(let t of e.match(this.splitRe)??[]){let n=new TextEncoder().encode(t),s="";for(let a of n)s+=this.byteEnc[a];r.push(...this.bpe(s))}return r}encode(e){let r=[...this.bosIds];if(this.addedRe)for(let t of e.split(this.addedRe)){if(!t)continue;let n=this.vocab.get(t);n!==void 0&&this.added.some(s=>s.content===t)?r.push(n):r.push(...this.encodeChunk(t))}else r.push(...this.encodeChunk(e));return r}decode(e){let r=[];for(let t of e){if(this.specialIds.has(t))continue;let n=this.idToTok.get(t);if(n!==void 0)for(let s of n){let a=this.byteDec.get(s);if(a!==void 0)r.push(a);else for(let i of new TextEncoder().encode(s))r.push(i)}}return new TextDecoder("utf-8",{fatal:!1}).decode(new Uint8Array(r))}}});async function Pn(f,e){let r=new Ye;if(!await r.init())throw new Error("WebGPU indisponible sur ce navigateur.");r.onLost=g=>{console.warn("[brimkern] device GPU perdu ("+(g?.reason||"unknown")+") \u2014 rechargement au prochain appel"),ke.delete(f)},await r.selfValidate(),e("t\xE9l\xE9chargement du mod\xE8le\u2026");let t=await Gr(f),n=t.manifest;if(!n?.config?.lfm2){let g=n?.arch??n?.config?.arch??"unknown";throw new Error(`Brimkern SDK v0 runs LFM2 .brik models only \u2014 this file's architecture is "${g}". Use the default model (omit \`model\`), or convert/pick an LFM2 .brik. Full model support lives in the app: https://brimkern.com/chat`)}let s=n.tensors["token_embd.weight"],a={arch:{...n.config,arch:"lfm2",vocab:s?s.nElems/n.config.d:0},tensors:Object.fromEntries(Object.entries(n.tensors).map(([g,h])=>[g,{dtype:An[h.type]??h.type,shape:h.shape,nElems:h.nElems,shard:0,offset:h.offset,byteLength:h.bytes}])),shards:[{id:0,file:"",byteLength:0}],chat:{template:"chatml",stopTokenIds:[7,2,8,10,12]}},i=Object.values(n.tensors).reduce((g,h)=>g+h.bytes,0),o=0,u=dr(n.tensors,t.source),c=async g=>{let h=n.tensors[g];if(!h)throw new Error(`tenseur absent : ${g}`);let p=await u(g);return o+=h.bytes,e("t\xE9l\xE9chargement du mod\xE8le\u2026",{loaded:o,total:i}),p};e("tokenizer\u2026");let l;try{let g=new Ie(t.tokenizer.json);l={encode:h=>g.encode(h),decode:h=>g.decode(h)}}catch(g){console.warn("[brimkern] tokenizer.json non couvert par le BPE bundl\xE9 \u2014 repli transformers.js (CDN)",g);let h=await import(kn),p=new h.PreTrainedTokenizer(JSON.parse(t.tokenizer.json),JSON.parse(t.tokenizer.config));l={encode:v=>Array.from(p(v).input_ids.data,y=>Number(y)),decode:v=>p.decode(v,{skip_special_tokens:!0})}}let d=new Ve(r,a,c);return e("poids sur le GPU\u2026"),await d.load(l),{core:d,engine:r}}function He(f){return f&&(f.startsWith("https://")||/^http:\/\/(localhost|127\.0\.0\.1)[:/]/.test(f))?f:Sr[f||"lfm2.5-230m"]||Sr["lfm2.5-230m"]}function Je(f,e){let r=ke.get(f);if(!r){let t={status:"initialisation\u2026",state:"loading",listeners:new Set,promise:null};t.promise=Pn(f,(n,s)=>{t.status=n,t.progress=s,t.listeners.forEach(a=>a(n,s))}).then(n=>(t.state="ready",n)).catch(n=>{throw t.state="error",ke.delete(f),n}),ke.set(f,t),r=t}return e&&(e(r.status,r.progress),r.listeners.add(e),r.promise.finally(()=>r.listeners.delete(e)).catch(()=>{})),r.promise}async function Mr(f,e){let r=await Je(f,e);return r.engine.lost?(ke.delete(f),(await Je(f,e)).core):r.core}async function Tr(f,e){let r=await Mr(f);try{return await e(r)}catch(t){let n=ke.get(f);if(!(!n||await n.promise.then(a=>a.engine.lost).catch(()=>!0)))throw t;return console.warn("[brimkern] g\xE9n\xE9ration interrompue par une perte de device \u2014 nouvelle tentative"),ke.delete(f),e(await Mr(f))}}function Gn(f,e){let r=f.replace(/<\|[a-z_]+\|>/g,"");if(e){let t=r.replace(/^\s*(hello|hi|hey|bonjour|salut)\s*[!,.]\s*/i,"");t.trim()&&(r=t)}return r.trimEnd()}async function Or(f,e,r,t,n,s,a,i=[]){let o=Br([...i,...e.slice(-Un)],"lfm2",r),u=i.some(d=>d.role==="assistant")||e.some(d=>d.role==="assistant"),c="";return await(f.residentAvailable?.()?f.generateResident.bind(f):f.generate.bind(f))(o,t,d=>{c=Gn(d,u),s?.(c)},a,{sample:!0,temperature:n,topK:40,repeatPenalty:1.3}),c}var kn,Sr,An,Un,ke,pt=te(()=>{"use strict";or();lr();_r();dt();xr();qr();kn="https://esm.sh/@huggingface/transformers@4.2.0",Sr={"lfm2.5-230m":"https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik"},An={F16:"f16",F32:"f32",Q4W:"q4",Q8W:"q8",Q3W:"q3"},Un=12;ke=new Map});var Dr={};Qt(Dr,{LocalBackend:()=>Ee});var Ee,mt=te(()=>{"use strict";pt();Ee=class{constructor(){this.kind="main"}async preload(e,r){await Je(e,r)}state(e){return ke.get(e)?.state}turn(e,r,t){return Tr(e.url,n=>Or(n,e.history,e.system,e.maxTokens,e.temperature,r,()=>!!t?.aborted,e.pinned))}dispose(){}}});function _n(){try{if(typeof document>"u")return"";let f=document.currentScript;if(f?.src)return new URL(f.src,document.baseURI).href}catch{}return""}function Rr(f){Cr=f}function Lr(){return Cr||Bn}var Bn,Cr,bt=te(()=>{"use strict";Bn=_n(),Cr=""});var zr={};Qt(zr,{WorkerBackend:()=>vt});var vt,jr=te(()=>{"use strict";bt();vt=class{constructor(){this.kind="worker";this.seq=0;this.pending=new Map;this.states=new Map;if(typeof Worker>"u")throw new Error("Worker indisponible");let e=Lr();if(!e)throw new Error("URL du script introuvable (import ESM ?) \u2014 passez workerUrl");let r=(()=>{try{return location.search}catch{return""}})(),t=`self.__brimkernSearch=${JSON.stringify(r)};importScripts(${JSON.stringify(e)});`,n=new Blob([t],{type:"text/javascript"});this.url=URL.createObjectURL(n),this.worker=new Worker(this.url);let s,a;this.hello=new Promise((i,o)=>{s=i,a=o}),this.worker.onerror=i=>a(new Error(`worker: ${i.message||"\xE9chec de chargement"}`)),this.worker.onmessage=i=>{let o=i.data;if(o.type==="hello"){s();return}let u=this.pending.get(o.id);if(u){if(o.type==="progress"){u.onProgress?.(o.status,o.progress);return}if(o.type==="token"){u.onToken?.(o.text);return}this.pending.delete(o.id),o.type==="error"?u.reject(new Error(o.message)):o.type==="state"?u.resolve(o.state):u.resolve(o.text??"")}}}ready(){return this.hello}send(e,r={}){let t=++this.seq,n=new Promise((s,a)=>{this.pending.set(t,{resolve:s,reject:a,...r}),this.worker.postMessage({...e,id:t})});return{id:t,done:n}}async preload(e,r){await this.hello,this.states.get(e)!=="ready"&&this.states.set(e,"loading");try{await this.send({type:"preload",url:e},{onProgress:r}).done,this.states.set(e,"ready")}catch(t){throw this.states.set(e,"error"),t}}state(e){return this.states.get(e)}async turn(e,r,t){await this.hello;let{id:n,done:s}=this.send({type:"turn",req:e},{onToken:r}),a=()=>this.worker.postMessage({type:"stop",id:n});t?.aborted?a():t?.addEventListener("abort",a,{once:!0});try{let i=await s;return this.states.set(e.url,"ready"),i}finally{t?.removeEventListener("abort",a)}}dispose(){this.worker.terminate(),URL.revokeObjectURL(this.url);for(let e of this.pending.values())e.reject(new Error("worker arr\xEAt\xE9"));this.pending.clear()}}});var xn={};var wt,Xe,Me,Er=te(()=>{"use strict";mt();wt=new Ee,Xe=new Set,Me=f=>self.postMessage(f);self.onmessage=async f=>{let e=f.data;if(e.type==="stop"){Xe.add(e.id);return}if(e.type==="state"){Me({type:"state",id:e.id,state:wt.state(e.url)});return}try{if(e.type==="preload"){await wt.preload(e.url,(r,t)=>Me({type:"progress",id:e.id,status:r,progress:t})),Me({type:"done",id:e.id});return}if(e.type==="turn"){let r=new AbortController,t=new Proxy(r.signal,{get:(u,c)=>c==="aborted"?Xe.has(e.id):Reflect.get(u,c)}),n=16,s=0,a=null,i=()=>{a!==null&&(Me({type:"token",id:e.id,text:a}),a=null,s=Date.now())},o=await wt.turn(e.req,u=>{a=u,Date.now()-s>=n&&i()},t);i(),Me({type:"done",id:e.id,text:o}),Xe.delete(e.id);return}}catch(r){Xe.delete(e.id),Me({type:"error",id:e.id,message:r instanceof Error?r.message:String(r)})}};Me({type:"hello"})});var Jr=new Set(["avec","pour","dans","les","des","une","est","sur","par","que","qui","quoi","comment","pourquoi","quand","vous","nous","votre","notre","mais","plus","tout","tous","cette","sont","avez","puis","faire","fait","the","and","for","with","what","who","how","why","when","about","your","our","you","are","can","does","did","this","that","from","have"]);function $t(f){let e=(f.toLowerCase().match(/[\p{L}\p{N}]{3,}/gu)??[]).filter(r=>!Jr.has(r));return[...new Set(e)]}function Yt(f,e=600){let r=[];return f.forEach((t,n)=>{let s=(t.title||"").trim(),a=(t.text||"").split(/\n\s*\n+/).map(u=>u.trim()).filter(Boolean),i="",o=()=>{i.trim()&&r.push({title:s,text:i.trim(),doc:n}),i=""};for(let u of a){if(u.length>e*1.6){o();let c=u.split(/(?<=[.!?])\s+/),l="";for(let d of c)l&&(l+" "+d).length>e?(r.push({title:s,text:l.trim(),doc:n}),l=d):l=l?`${l} ${d}`:d;l.trim()&&r.push({title:s,text:l.trim(),doc:n});continue}i&&(i+`

`+u).length>e&&o(),i=i?`${i}

${u}`:u}o()}),r}function Xr(f,e,r){if(!f.length)return 0;let t=`${e.title} ${e.text}`.toLowerCase(),n=e.title.toLowerCase(),s=0,a=0;for(let i of f){let o=r.get(i)??1;a+=o,t.includes(i)&&(s+=o*(n.includes(i)?1.5:1))}return a?s/a:0}function Zr(f){let e=new Map;for(let n of f)for(let s of $t(`${n.title} ${n.text}`))e.set(s,(e.get(s)??0)+1);let r=new Map,t=Math.max(1,f.length);for(let[n,s]of e)r.set(n,Math.log(1+t/s));return r}function Vt(f,e,r=1200,t=3,n=.34){let s=$t(f);if(!s.length||!e.length)return[];let a=Zr(e),i=e.map(l=>({c:l,s:Xr(s,l,a)})).filter(l=>l.s>=n).sort((l,d)=>d.s-l.s),o=[],u=new Set,c=r;for(let{c:l}of i)o.length>=t||l.text.length>c||u.has(l.doc)||(o.push(l),u.add(l.doc),c-=l.text.length);for(let{c:l}of i){if(o.length>=t)break;o.includes(l)||l.text.length>c||(o.push(l),c-=l.text.length)}return o}function It(f){return f.length?`

Answer using ONLY the reference notes below. If the answer is not in them, say you do not have that information \u2014 never fill the gap with what you assume.

--- NOTES ---
${f.map((r,t)=>`[${t+1}]${r.title?` ${r.title}`:""}
${r.text}`).join(`

`)}
--- END OF NOTES ---`:`

No reference note matches this question. Say that you do not have this information \u2014 do not guess.`}function Jt(f){let e=Array.isArray(f)?f:[f],r=[];for(let t of e)typeof t=="string"&&t.trim()?r.push({text:t}):t&&typeof t=="object"&&typeof t.text=="string"&&t.text.trim()&&r.push({title:t.title,text:t.text});return r}pt();async function Hr(f){let{LocalBackend:e}=await Promise.resolve().then(()=>(mt(),Dr));if(f!==!0)return new e;try{let{WorkerBackend:r}=await Promise.resolve().then(()=>(jr(),zr)),t=new r;return await t.ready(),t}catch(r){return console.warn("[brimkern] Web Worker indisponible \u2014 inf\xE9rence sur le thread principal",r),new e}}bt();var Fn=typeof self<"u"&&typeof self.importScripts=="function"&&typeof document>"u";Fn&&Promise.resolve().then(()=>(Er(),xn));var Ze=null,kt=null,yt;function Ke(){return Ze||(Ze=Hr(yt).then(f=>(kt=f,f))),Ze}var qn=()=>kt?.kind??"pending";function At(f){if(f.workerUrl&&Rr(f.workerUrl),f.worker!==void 0){if(Ze&&yt!==f.worker){console.warn("[brimkern] option `worker` ignor\xE9e : le backend est d\xE9j\xE0 d\xE9marr\xE9 et partag\xE9 par la page.");return}yt=f.worker}}var Sn=`
Answer briefly and honestly. If you do not know something, say so \u2014 never invent facts or details.
You have no tools and no internet access: never emit tool calls, reply in plain text only.`;function Nr(f){let e=(f.system||"You are a helpful assistant.")+Sn,r=a=>a.flatMap(i=>[{role:"user",content:i.user},{role:"assistant",content:i.assistant}]);if(!f.knowledge)return{system:()=>e,userTurn:a=>a,pinned:r(f.examples||[])};let t=Yt(Jt(f.knowledge)),n=f.knowledgeBudget??1200,s=e+`

The user message may include reference notes between --- markers. When it does, answer from those notes and quote their figures exactly. When it says no note matches, say you do not have that information.`;return{system:()=>s,userTurn:a=>It(Vt(a,t,n)).trim()+`

Question: ${a}`,pinned:r([...Mn(),...f.examples||[]])}}function Mn(){return[{user:`--- NOTES ---
[1] Opening hours
The workshop is open on Thursday until 8pm.
--- END OF NOTES ---

Question: Are you open on Thursday evening?`,assistant:"Yes \u2014 the workshop is open on Thursday until 8pm."},{user:`No reference note matches this question.

Question: Who won the 1998 World Cup?`,assistant:"I do not have that information in my notes."}]}function Wr(f={}){At(f);let e=He(f.model),r=f.maxTokens||220,t=f.temperature??.55,n=Nr(f),s=n.pinned,a=[],i=!1,o=!1;return{async ask(u,c={}){if(o)throw new Error("session d\xE9truite");if(i)throw new Error("g\xE9n\xE9ration d\xE9j\xE0 en cours sur cette session");i=!0,a.push({role:"user",content:u});try{let l=[...a.slice(0,-1),{role:"user",content:n.userTurn(u)}],d={url:e,history:l,system:n.system(u),maxTokens:r,temperature:t,pinned:s},g=await(await Ke()).turn(d,c.onToken,c.signal);return c.signal?.aborted?(a.pop(),""):(a.push({role:"assistant",content:g}),g)}catch(l){throw a.pop(),l}finally{i=!1}},reset(){a=[]},destroy(){o=!0,a=[]},get history(){return a.slice()}}}function Tn(f){if(document.getElementById("bk-style"))return;let e=document.createElement("style");e.id="bk-style",e.textContent=`
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
  `,document.head.appendChild(e)}function On(f){if(!f)return"#c72c1e";if(/^#[0-9a-fA-F]{3,8}$/.test(f))return f;try{if(typeof CSS<"u"&&CSS.supports("color",f)&&!/[{};()]/.test(f))return f}catch{}return"#c72c1e"}function Kr(f){let e=Nr(f),r=On(f.accent),t=f.title||"Assistant",n=f.maxTokens||220;Tn(r);let s=document.createElement("button");s.className="bk-fab",s.setAttribute("aria-label","Ouvrir le chat"),s.textContent="\u{1F4AC}";let a=document.createElement("div");a.className="bk-panel",a.innerHTML=`
    <div class="bk-hd"><span class="bk-dot"></span><span>${Dn(t)}</span><button class="bk-x" aria-label="Fermer">\xD7</button></div>
    <div class="bk-msgs"></div>
    <div class="bk-foot"><textarea class="bk-in" rows="1" placeholder="\xC9cris un message\u2026"></textarea><button class="bk-send">\u2191</button></div>
    <div class="bk-note">IA locale \u2014 tourne sur votre GPU, aucune donn\xE9e envoy\xE9e.</div>`,document.body.appendChild(s),document.body.appendChild(a);let i=a.querySelector(".bk-msgs"),o=a.querySelector(".bk-in"),u=a.querySelector(".bk-send"),c=[],l=!1,d=!1,g=(y,P)=>{let O=document.createElement("div");return O.className=`bk-m ${y==="user"?"bk-u":"bk-a"}`,O.textContent=P,i.appendChild(O),i.scrollTop=i.scrollHeight,O};f.greeting&&(c.push({role:"assistant",content:f.greeting}),g("assistant",f.greeting));let h=He(f.model),p=()=>{if(!d){d=!0;let y=g("assistant","Initialisation\u2026");y.classList.add("bk-status"),Ke().then(P=>P.preload(h,(O,q)=>{y.textContent=q?.total?`${O} ${Math.round(q.loaded/1048576)} / ${Math.round(q.total/1048576)} Mo`:O})).then(()=>y.remove()).catch(P=>{y.textContent="Erreur : "+(P?.message||P),d=!1})}return Ke()},v=async()=>{let y=o.value.trim();if(!y||l)return;l=!0,u.disabled=!0,o.value="",c.push({role:"user",content:y}),g("user",y);let P=g("assistant","\u2026");try{await p();let O=[...c.slice(0,-1),{role:"user",content:e.userTurn(y)}],q={url:h,history:O,system:e.system(y),maxTokens:n,temperature:.55,pinned:e.pinned},T=await(await Ke()).turn(q,z=>{P.textContent=z||"\u2026",i.scrollTop=i.scrollHeight});T||(T="Sorry, I can only answer in plain text here \u2014 could you rephrase?"),P.textContent=T,c.push({role:"assistant",content:T})}catch(O){P.textContent="Erreur : "+(O?.message||String(O))}finally{l=!1,u.disabled=!1,o.focus()}};s.onclick=()=>{a.classList.toggle("bk-open")&&(o.focus(),p())},a.querySelector(".bk-x").onclick=()=>a.classList.remove("bk-open"),u.onclick=()=>{v()},o.onkeydown=y=>{y.key==="Enter"&&!y.shiftKey&&(y.preventDefault(),v())}}function Dn(f){return f.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}var Cn=(f={})=>{if(typeof window>"u"||typeof document>"u"){console.warn("[brimkern] embed() ignor\xE9 : aucun DOM (rendu serveur ?). Appelez-le dans un effet client.");return}At(f),document.body?Kr(f):window.addEventListener("DOMContentLoaded",()=>Kr(f))};var Rn=async f=>{if(typeof f!="object"||f===null||typeof f.prompt!="string")throw new TypeError(`Brimkern.generate expects a single object: generate({ prompt: "\u2026", model?, system? }). Received ${typeof f}${typeof f=="object"&&f?" without a `prompt` string":""}.`);return Wr(f).ask(f.prompt,{onToken:f.onToken,signal:f.signal})},Ln=(f={})=>(At(f),typeof navigator<"u"&&"gpu"in navigator?Ke().then(e=>e.preload(He(f.model),f.onProgress)).then(()=>!0).catch(()=>!1):Promise.resolve(!1)),zn=f=>typeof navigator>"u"||!("gpu"in navigator)?"unavailable":kt?.state(He(f))??"idle";typeof window<"u"&&(window.Brimkern={embed:Cn,createSession:Wr,generate:Rn,preload:Ln,status:zn,runtime:qn});})();
