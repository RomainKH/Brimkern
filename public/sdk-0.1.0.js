"use strict";(()=>{var Ir=Object.defineProperty;var te=(f,e,r)=>()=>{if(r)throw r[0];try{return f&&(e=f(f=0)),e}catch(t){throw r=[t],t}};var Qt=(f,e)=>{for(var r in e)Ir(f,r,{get:e[r],enumerable:!0})};function Pe(f){let e=new Float32Array(1),r=new Uint32Array(e.buffer);e[0]=f;let t=r[0],n=t>>16&32768,a=(t>>23&255)-127+15,i=t&8388607;return a<=0?n:a>=31?n|31743:(i=(i>>13)+(i>>12&1),i===1024&&(i=0,a+=1),n|a<<10|i&1023)}function ce(f){let e=f>>15&1,r=f>>10&31,t=f&1023,n;return r===0?n=t*59604645e-15:r===31?n=t?NaN:1/0:n=(1+t/1024)*2**(r-15),e===1?-n:n}var De=te(()=>{"use strict"});function Be(f){let e=f.length;if(e%be!==0)throw new Error(`q4web: length ${e} not a multiple of ${be}`);let r=e/be,t=new Uint8Array(e/2),n=new Uint16Array(r),a=new Uint16Array(r);for(let i=0;i<r;i++){let s=i*be,o=1/0,u=-1/0;for(let m=0;m<be;m++){let b=f[s+m];b<o&&(o=b),b>u&&(u=b)}let c=(u-o)/15||1e-8,l=Pe(c),d=Pe(o);n[i]=l,a[i]=d;let g=ce(l)||1e-8,p=ce(d);for(let m=0;m<be;m++){let b=Math.round((f[s+m]-p)/g);b=b<0?0:b>15?15:b;let k=s+m;(m&1)===0?t[k>>1]=b:t[k>>1]|=b<<4}}return{nibbles:t,scales:n,mins:a,nElems:e}}function Ue(f,e){let r=e/be,t=e/2,n=f.slice(0,t),a=new Uint16Array(r),i=new Uint16Array(r),s=new DataView(f.buffer,f.byteOffset);for(let o=0;o<r;o++)a[o]=s.getUint16(t+o*2,!0);for(let o=0;o<r;o++)i[o]=s.getUint16(t+r*2+o*2,!0);return{nibbles:n,scales:a,mins:i,nElems:e}}function ge(f){let e=new Float32Array(f.nElems),r=f.nElems/be;for(let t=0;t<r;t++){let n=ce(f.scales[t]),a=ce(f.mins[t]),i=t*be;for(let s=0;s<be;s++){let o=i+s,u=f.nibbles[o>>1],c=(s&1)===0?u&15:u>>4;e[o]=c*n+a}}return e}var be,it=te(()=>{"use strict";De();be=32});function Fe(f){let e=f.length;if(e%we!==0)throw new Error(`q8web: length ${e} not a multiple of ${we}`);let r=e/we,t=new Int8Array(e),n=new Uint16Array(r);for(let a=0;a<r;a++){let i=a*we,s=0;for(let l=0;l<we;l++){let d=Math.abs(f[i+l]);d>s&&(s=d)}let o=s/127||1e-8,u=Pe(o);n[a]=u;let c=ce(u)||1e-8;for(let l=0;l<we;l++){let d=Math.round(f[i+l]/c);d=d<-127?-127:d>127?127:d,t[i+l]=d}}return{codes:t,scales:n,nElems:e}}function qe(f,e){let r=e/we,t=new Int8Array(f.buffer.slice(f.byteOffset,f.byteOffset+e)),n=new Uint16Array(r),a=new DataView(f.buffer,f.byteOffset);for(let i=0;i<r;i++)n[i]=a.getUint16(e+i*2,!0);return{codes:t,scales:n,nElems:e}}function pe(f){let e=new Float32Array(f.nElems),r=f.nElems/we;for(let t=0;t<r;t++){let n=ce(f.scales[t]),a=t*we;for(let i=0;i<we;i++)e[a+i]=f.codes[a+i]*n}return e}var we,ot=te(()=>{"use strict";De();we=32});function Xt(f){let e=f.length;if(e%ye!==0)throw new Error(`q3web: length ${e} not a multiple of ${ye}`);let r=e/ye,t=new Uint32Array(e/16),n=new Uint32Array(e/32),a=new Uint16Array(r),i=new Uint16Array(r);for(let s=0;s<r;s++){let o=s*ye,u=1/0,c=-1/0;for(let b=0;b<ye;b++){let k=f[o+b];k<u&&(u=k),k>c&&(c=k)}let l=(c-u)/7||1e-8,d=Pe(l),g=Pe(u);a[s]=d,i[s]=g;let p=ce(d)||1e-8,m=ce(g);for(let b=0;b<ye;b++){let k=Math.round((f[o+b]-m)/p);k=k<0?0:k>7?7:k;let B=o+b;t[B>>4]|=(k&3)<<(B&15)*2,n[B>>5]|=k>>2<<(B&31)}}return{lo:t,hi:n,scales:a,mins:i,nElems:e}}function ut(f,e){let r=e/ye,t=e/16,n=e/32,a=t*4,i=n*4,s=new DataView(f.buffer,f.byteOffset),o=new Uint32Array(t),u=new Uint32Array(n),c=new Uint16Array(r),l=new Uint16Array(r);for(let p=0;p<t;p++)o[p]=s.getUint32(p*4,!0);for(let p=0;p<n;p++)u[p]=s.getUint32(a+p*4,!0);let d=a+i,g=d+r*2;for(let p=0;p<r;p++)c[p]=s.getUint16(d+p*2,!0);for(let p=0;p<r;p++)l[p]=s.getUint16(g+p*2,!0);return{lo:o,hi:u,scales:c,mins:l,nElems:e}}function We(f){let e=new Float32Array(f.nElems),r=f.nElems/ye;for(let t=0;t<r;t++){let n=ce(f.scales[t]),a=ce(f.mins[t]),i=t*ye;for(let s=0;s<ye;s++){let o=i+s,u=f.lo[o>>4]>>(o&15)*2&3|(f.hi[o>>5]>>(o&31)&1)<<2;e[o]=u*n+a}}return e}var ye,Zt=te(()=>{"use strict";De();ye=32});var er,tr,rr=te(()=>{"use strict";er={matmul:`
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
		}`,matmul_t_q8_shared2:`
		struct Dims { m: u32, k: u32, n: u32 };
		@group(0) @binding(0) var<uniform> d: Dims;
		@group(0) @binding(1) var<storage, read> a: array<f32>;
		@group(0) @binding(2) var<storage, read> codes: array<u32>;
		@group(0) @binding(3) var<storage, read> sc: array<u32>;
		@group(0) @binding(4) var<storage, read_write> c: array<f32>;
		var<workgroup> Asv: array<vec4<f32>, 256>;  // [16 k][16 groupes de 4 lignes]
		var<workgroup> Wsv: array<vec4<f32>, 512>;  // [16 k][32 groupes de 4 colonnes]
		fn f16d(h: u32) -> f32 {
			let s = (h >> 15u) & 1u; let e = (h >> 10u) & 0x1Fu; let mm = h & 0x3FFu; var v: f32;
			if (e == 0u) { v = f32(mm) * 5.9604645e-8; } else if (e == 31u) { v = 65504.0; }
			else { v = (1.0 + f32(mm) / 1024.0) * pow(2.0, f32(e) - 15.0); }
			return select(v, -v, s == 1u);
		}
		fn q8x4(word: u32, s: f32) -> vec4<f32> {
			return vec4<f32>(
				f32(i32(word << 24u) >> 24u),
				f32(i32(word << 16u) >> 24u),
				f32(i32(word << 8u) >> 24u),
				f32(i32(word) >> 24u)) * s;
		}
		@compute @workgroup_size(256)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_index) tid: u32) {
			let m = d.m; let k = d.k; let n = d.n;
			let row0 = wid.y * 64u;
			let col0 = wid.x * 128u;
			let nG = k / 32u;
			// Threads 0-127 : W par micro-tuile 4 colonnes \xD7 4 k. Threads 128-255 : A, 2 vec4 chacun.
			let wCG = (tid >> 2u) & 31u; let wKq = tid & 3u;
			let tA = tid - 128u;
			let tr = (tid >> 4u) * 4u; let tc = (tid & 15u) * 8u; // calcul : bloc 4 lignes \xD7 8 colonnes
			var r00 = vec4<f32>(0.0); var r01 = vec4<f32>(0.0);
			var r10 = vec4<f32>(0.0); var r11 = vec4<f32>(0.0);
			var r20 = vec4<f32>(0.0); var r21 = vec4<f32>(0.0);
			var r30 = vec4<f32>(0.0); var r31 = vec4<f32>(0.0);
			let nTiles = (k + 15u) / 16u;
			for (var t = 0u; t < nTiles; t = t + 1u) {
				let kk = t * 16u;
				if (tid < 128u) {
					let kp = kk + wKq * 4u;
					let cBase = col0 + wCG * 4u;
					var v0 = vec4<f32>(0.0); var v1 = vec4<f32>(0.0); var v2 = vec4<f32>(0.0); var v3 = vec4<f32>(0.0);
					if (kp < k) {
						let gOff = kp / 32u;
						if (cBase < n) { let idx = cBase * k + kp; let si = cBase * nG + gOff; let sw = sc[si >> 1u]; v0 = q8x4(codes[idx >> 2u], f16d(select(sw & 0xFFFFu, sw >> 16u, (si & 1u) == 1u))); }
						if (cBase + 1u < n) { let idx = (cBase + 1u) * k + kp; let si = (cBase + 1u) * nG + gOff; let sw = sc[si >> 1u]; v1 = q8x4(codes[idx >> 2u], f16d(select(sw & 0xFFFFu, sw >> 16u, (si & 1u) == 1u))); }
						if (cBase + 2u < n) { let idx = (cBase + 2u) * k + kp; let si = (cBase + 2u) * nG + gOff; let sw = sc[si >> 1u]; v2 = q8x4(codes[idx >> 2u], f16d(select(sw & 0xFFFFu, sw >> 16u, (si & 1u) == 1u))); }
						if (cBase + 3u < n) { let idx = (cBase + 3u) * k + kp; let si = (cBase + 3u) * nG + gOff; let sw = sc[si >> 1u]; v3 = q8x4(codes[idx >> 2u], f16d(select(sw & 0xFFFFu, sw >> 16u, (si & 1u) == 1u))); }
					}
					// Transposition 4\xD74 en registres : composantes STATIQUES uniquement (cf. le\xE7on Metal).
					let wb = (wKq * 4u) * 32u + wCG;
					Wsv[wb] = vec4<f32>(v0.x, v1.x, v2.x, v3.x);
					Wsv[wb + 32u] = vec4<f32>(v0.y, v1.y, v2.y, v3.y);
					Wsv[wb + 64u] = vec4<f32>(v0.z, v1.z, v2.z, v3.z);
					Wsv[wb + 96u] = vec4<f32>(v0.w, v1.w, v2.w, v3.w);
				} else {
					for (var p = 0u; p < 2u; p = p + 1u) {
						let slot = tA * 2u + p;
						let aK = slot >> 4u; let aRG = slot & 15u;
						let kp = kk + aK;
						let ar = row0 + aRG * 4u;
						var av = vec4<f32>(0.0);
						if (kp < k) {
							if (ar < m) { av.x = a[ar * k + kp]; }
							if (ar + 1u < m) { av.y = a[(ar + 1u) * k + kp]; }
							if (ar + 2u < m) { av.z = a[(ar + 2u) * k + kp]; }
							if (ar + 3u < m) { av.w = a[(ar + 3u) * k + kp]; }
						}
						Asv[aK * 16u + aRG] = av;
					}
				}
				workgroupBarrier();
				for (var i = 0u; i < 16u; i = i + 1u) {
					let avc = Asv[i * 16u + (tr >> 2u)];
					let wb2 = i * 32u + (tc >> 2u);
					let wv0 = Wsv[wb2]; let wv1 = Wsv[wb2 + 1u];
					r00 = fma(vec4<f32>(avc.x), wv0, r00); r01 = fma(vec4<f32>(avc.x), wv1, r01);
					r10 = fma(vec4<f32>(avc.y), wv0, r10); r11 = fma(vec4<f32>(avc.y), wv1, r11);
					r20 = fma(vec4<f32>(avc.z), wv0, r20); r21 = fma(vec4<f32>(avc.z), wv1, r21);
					r30 = fma(vec4<f32>(avc.w), wv0, r30); r31 = fma(vec4<f32>(avc.w), wv1, r31);
				}
				workgroupBarrier();
			}
			let gr = row0 + tr;
			let gc = col0 + tc;
			if (gr < m) {
				if (gc < n) { c[gr * n + gc] = r00.x; }
				if (gc + 1u < n) { c[gr * n + gc + 1u] = r00.y; }
				if (gc + 2u < n) { c[gr * n + gc + 2u] = r00.z; }
				if (gc + 3u < n) { c[gr * n + gc + 3u] = r00.w; }
				if (gc + 4u < n) { c[gr * n + gc + 4u] = r01.x; }
				if (gc + 5u < n) { c[gr * n + gc + 5u] = r01.y; }
				if (gc + 6u < n) { c[gr * n + gc + 6u] = r01.z; }
				if (gc + 7u < n) { c[gr * n + gc + 7u] = r01.w; }
			}
			if (gr + 1u < m) {
				if (gc < n) { c[(gr + 1u) * n + gc] = r10.x; }
				if (gc + 1u < n) { c[(gr + 1u) * n + gc + 1u] = r10.y; }
				if (gc + 2u < n) { c[(gr + 1u) * n + gc + 2u] = r10.z; }
				if (gc + 3u < n) { c[(gr + 1u) * n + gc + 3u] = r10.w; }
				if (gc + 4u < n) { c[(gr + 1u) * n + gc + 4u] = r11.x; }
				if (gc + 5u < n) { c[(gr + 1u) * n + gc + 5u] = r11.y; }
				if (gc + 6u < n) { c[(gr + 1u) * n + gc + 6u] = r11.z; }
				if (gc + 7u < n) { c[(gr + 1u) * n + gc + 7u] = r11.w; }
			}
			if (gr + 2u < m) {
				if (gc < n) { c[(gr + 2u) * n + gc] = r20.x; }
				if (gc + 1u < n) { c[(gr + 2u) * n + gc + 1u] = r20.y; }
				if (gc + 2u < n) { c[(gr + 2u) * n + gc + 2u] = r20.z; }
				if (gc + 3u < n) { c[(gr + 2u) * n + gc + 3u] = r20.w; }
				if (gc + 4u < n) { c[(gr + 2u) * n + gc + 4u] = r21.x; }
				if (gc + 5u < n) { c[(gr + 2u) * n + gc + 5u] = r21.y; }
				if (gc + 6u < n) { c[(gr + 2u) * n + gc + 6u] = r21.z; }
				if (gc + 7u < n) { c[(gr + 2u) * n + gc + 7u] = r21.w; }
			}
			if (gr + 3u < m) {
				if (gc < n) { c[(gr + 3u) * n + gc] = r30.x; }
				if (gc + 1u < n) { c[(gr + 3u) * n + gc + 1u] = r30.y; }
				if (gc + 2u < n) { c[(gr + 3u) * n + gc + 2u] = r30.z; }
				if (gc + 3u < n) { c[(gr + 3u) * n + gc + 3u] = r30.w; }
				if (gc + 4u < n) { c[(gr + 3u) * n + gc + 4u] = r31.x; }
				if (gc + 5u < n) { c[(gr + 3u) * n + gc + 5u] = r31.y; }
				if (gc + 6u < n) { c[(gr + 3u) * n + gc + 6u] = r31.z; }
				if (gc + 7u < n) { c[(gr + 3u) * n + gc + 7u] = r31.w; }
			}
		}`,matmul_t_q4_shared2:`
		struct Dims { m: u32, k: u32, n: u32 };
		@group(0) @binding(0) var<uniform> d: Dims;
		@group(0) @binding(1) var<storage, read> a: array<f32>;
		@group(0) @binding(2) var<storage, read> nib: array<u32>;
		@group(0) @binding(3) var<storage, read> sc: array<u32>;
		@group(0) @binding(4) var<storage, read> mn: array<u32>;
		@group(0) @binding(5) var<storage, read_write> c: array<f32>;
		var<workgroup> Asv: array<vec4<f32>, 256>;
		var<workgroup> Wsv: array<vec4<f32>, 512>;
		fn f16d(h: u32) -> f32 {
			let s = (h >> 15u) & 1u; let e = (h >> 10u) & 0x1Fu; let mm = h & 0x3FFu; var v: f32;
			if (e == 0u) { v = f32(mm) * 5.9604645e-8; } else if (e == 31u) { v = 65504.0; }
			else { v = (1.0 + f32(mm) / 1024.0) * pow(2.0, f32(e) - 15.0); }
			return select(v, -v, s == 1u);
		}
		fn q4x4(word: u32, sh: u32, s: f32, mnv: f32) -> vec4<f32> {
			return vec4<f32>(
				f32((word >> sh) & 0xFu),
				f32((word >> (sh + 4u)) & 0xFu),
				f32((word >> (sh + 8u)) & 0xFu),
				f32((word >> (sh + 12u)) & 0xFu)) * s + vec4<f32>(mnv);
		}
		@compute @workgroup_size(256)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_index) tid: u32) {
			let m = d.m; let k = d.k; let n = d.n;
			let row0 = wid.y * 64u;
			let col0 = wid.x * 128u;
			let nG = k / 32u;
			let wCG = (tid >> 2u) & 31u; let wKq = tid & 3u;
			let tA = tid - 128u;
			let tr = (tid >> 4u) * 4u; let tc = (tid & 15u) * 8u;
			var r00 = vec4<f32>(0.0); var r01 = vec4<f32>(0.0);
			var r10 = vec4<f32>(0.0); var r11 = vec4<f32>(0.0);
			var r20 = vec4<f32>(0.0); var r21 = vec4<f32>(0.0);
			var r30 = vec4<f32>(0.0); var r31 = vec4<f32>(0.0);
			let nTiles = (k + 15u) / 16u;
			for (var t = 0u; t < nTiles; t = t + 1u) {
				let kk = t * 16u;
				if (tid < 128u) {
					let kp = kk + wKq * 4u;
					let cBase = col0 + wCG * 4u;
					var v0 = vec4<f32>(0.0); var v1 = vec4<f32>(0.0); var v2 = vec4<f32>(0.0); var v3 = vec4<f32>(0.0);
					if (kp < k) {
						let gOff = kp / 32u;
						if (cBase < n) { let idx = cBase * k + kp; let si = cBase * nG + gOff; let sw = sc[si >> 1u]; let mw = mn[si >> 1u]; v0 = q4x4(nib[idx >> 3u], (idx & 7u) * 4u, f16d(select(sw & 0xFFFFu, sw >> 16u, (si & 1u) == 1u)), f16d(select(mw & 0xFFFFu, mw >> 16u, (si & 1u) == 1u))); }
						if (cBase + 1u < n) { let idx = (cBase + 1u) * k + kp; let si = (cBase + 1u) * nG + gOff; let sw = sc[si >> 1u]; let mw = mn[si >> 1u]; v1 = q4x4(nib[idx >> 3u], (idx & 7u) * 4u, f16d(select(sw & 0xFFFFu, sw >> 16u, (si & 1u) == 1u)), f16d(select(mw & 0xFFFFu, mw >> 16u, (si & 1u) == 1u))); }
						if (cBase + 2u < n) { let idx = (cBase + 2u) * k + kp; let si = (cBase + 2u) * nG + gOff; let sw = sc[si >> 1u]; let mw = mn[si >> 1u]; v2 = q4x4(nib[idx >> 3u], (idx & 7u) * 4u, f16d(select(sw & 0xFFFFu, sw >> 16u, (si & 1u) == 1u)), f16d(select(mw & 0xFFFFu, mw >> 16u, (si & 1u) == 1u))); }
						if (cBase + 3u < n) { let idx = (cBase + 3u) * k + kp; let si = (cBase + 3u) * nG + gOff; let sw = sc[si >> 1u]; let mw = mn[si >> 1u]; v3 = q4x4(nib[idx >> 3u], (idx & 7u) * 4u, f16d(select(sw & 0xFFFFu, sw >> 16u, (si & 1u) == 1u)), f16d(select(mw & 0xFFFFu, mw >> 16u, (si & 1u) == 1u))); }
					}
					let wb = (wKq * 4u) * 32u + wCG;
					Wsv[wb] = vec4<f32>(v0.x, v1.x, v2.x, v3.x);
					Wsv[wb + 32u] = vec4<f32>(v0.y, v1.y, v2.y, v3.y);
					Wsv[wb + 64u] = vec4<f32>(v0.z, v1.z, v2.z, v3.z);
					Wsv[wb + 96u] = vec4<f32>(v0.w, v1.w, v2.w, v3.w);
				} else {
					for (var p = 0u; p < 2u; p = p + 1u) {
						let slot = tA * 2u + p;
						let aK = slot >> 4u; let aRG = slot & 15u;
						let kp = kk + aK;
						let ar = row0 + aRG * 4u;
						var av = vec4<f32>(0.0);
						if (kp < k) {
							if (ar < m) { av.x = a[ar * k + kp]; }
							if (ar + 1u < m) { av.y = a[(ar + 1u) * k + kp]; }
							if (ar + 2u < m) { av.z = a[(ar + 2u) * k + kp]; }
							if (ar + 3u < m) { av.w = a[(ar + 3u) * k + kp]; }
						}
						Asv[aK * 16u + aRG] = av;
					}
				}
				workgroupBarrier();
				for (var i = 0u; i < 16u; i = i + 1u) {
					let avc = Asv[i * 16u + (tr >> 2u)];
					let wb2 = i * 32u + (tc >> 2u);
					let wv0 = Wsv[wb2]; let wv1 = Wsv[wb2 + 1u];
					r00 = fma(vec4<f32>(avc.x), wv0, r00); r01 = fma(vec4<f32>(avc.x), wv1, r01);
					r10 = fma(vec4<f32>(avc.y), wv0, r10); r11 = fma(vec4<f32>(avc.y), wv1, r11);
					r20 = fma(vec4<f32>(avc.z), wv0, r20); r21 = fma(vec4<f32>(avc.z), wv1, r21);
					r30 = fma(vec4<f32>(avc.w), wv0, r30); r31 = fma(vec4<f32>(avc.w), wv1, r31);
				}
				workgroupBarrier();
			}
			let gr = row0 + tr;
			let gc = col0 + tc;
			if (gr < m) {
				if (gc < n) { c[gr * n + gc] = r00.x; }
				if (gc + 1u < n) { c[gr * n + gc + 1u] = r00.y; }
				if (gc + 2u < n) { c[gr * n + gc + 2u] = r00.z; }
				if (gc + 3u < n) { c[gr * n + gc + 3u] = r00.w; }
				if (gc + 4u < n) { c[gr * n + gc + 4u] = r01.x; }
				if (gc + 5u < n) { c[gr * n + gc + 5u] = r01.y; }
				if (gc + 6u < n) { c[gr * n + gc + 6u] = r01.z; }
				if (gc + 7u < n) { c[gr * n + gc + 7u] = r01.w; }
			}
			if (gr + 1u < m) {
				if (gc < n) { c[(gr + 1u) * n + gc] = r10.x; }
				if (gc + 1u < n) { c[(gr + 1u) * n + gc + 1u] = r10.y; }
				if (gc + 2u < n) { c[(gr + 1u) * n + gc + 2u] = r10.z; }
				if (gc + 3u < n) { c[(gr + 1u) * n + gc + 3u] = r10.w; }
				if (gc + 4u < n) { c[(gr + 1u) * n + gc + 4u] = r11.x; }
				if (gc + 5u < n) { c[(gr + 1u) * n + gc + 5u] = r11.y; }
				if (gc + 6u < n) { c[(gr + 1u) * n + gc + 6u] = r11.z; }
				if (gc + 7u < n) { c[(gr + 1u) * n + gc + 7u] = r11.w; }
			}
			if (gr + 2u < m) {
				if (gc < n) { c[(gr + 2u) * n + gc] = r20.x; }
				if (gc + 1u < n) { c[(gr + 2u) * n + gc + 1u] = r20.y; }
				if (gc + 2u < n) { c[(gr + 2u) * n + gc + 2u] = r20.z; }
				if (gc + 3u < n) { c[(gr + 2u) * n + gc + 3u] = r20.w; }
				if (gc + 4u < n) { c[(gr + 2u) * n + gc + 4u] = r21.x; }
				if (gc + 5u < n) { c[(gr + 2u) * n + gc + 5u] = r21.y; }
				if (gc + 6u < n) { c[(gr + 2u) * n + gc + 6u] = r21.z; }
				if (gc + 7u < n) { c[(gr + 2u) * n + gc + 7u] = r21.w; }
			}
			if (gr + 3u < m) {
				if (gc < n) { c[(gr + 3u) * n + gc] = r30.x; }
				if (gc + 1u < n) { c[(gr + 3u) * n + gc + 1u] = r30.y; }
				if (gc + 2u < n) { c[(gr + 3u) * n + gc + 2u] = r30.z; }
				if (gc + 3u < n) { c[(gr + 3u) * n + gc + 3u] = r30.w; }
				if (gc + 4u < n) { c[(gr + 3u) * n + gc + 4u] = r31.x; }
				if (gc + 5u < n) { c[(gr + 3u) * n + gc + 5u] = r31.y; }
				if (gc + 6u < n) { c[(gr + 3u) * n + gc + 6u] = r31.z; }
				if (gc + 7u < n) { c[(gr + 3u) * n + gc + 7u] = r31.w; }
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
		}`,attention_prefill:`
		struct AP { nTokens: u32, nHeads: u32, nKvHeads: u32, headDim: u32, kvLen: u32, pastLen: u32, scale: f32, softcap: f32, window: u32 };
		@group(0) @binding(0) var<uniform> p: AP;
		@group(0) @binding(1) var<storage, read> q: array<f32>;
		@group(0) @binding(2) var<storage, read> k: array<f32>;
		@group(0) @binding(3) var<storage, read> v: array<f32>;
		@group(0) @binding(4) var<storage, read_write> o: array<f32>;
		var<workgroup> qs: array<f32, 512>;  // 4 requ\xEAtes \xD7 pas fixe 128 (headDim \u2264 128)
		var<workgroup> sc: array<f32, 256>;  // poids exp de la tuile : 4 rang\xE9es \xD7 64 positions
		var<workgroup> red: array<f32, 256>; // scratch de r\xE9duction \u2014 les 4 rang\xE9es r\xE9duites ENSEMBLE
		fn score(dot: f32) -> f32 {
			let s = dot * p.scale;
			return select(s, p.softcap * tanh(s / p.softcap), p.softcap > 0.0);
		}
		// La position j est-elle visible par la rang\xE9e r de la tuile d\xE9marrant \xE0 t0 ? Les 4 requ\xEAtes
		// d'une tuile n'ont NI la m\xEAme borne causale NI la m\xEAme fen\xEAtre glissante \u2014 d'o\xF9 un masque
		// par rang\xE9e et non par tuile. (j + window < last + 1 : forme sans soustraction, u32 oblige.)
		fn visible(r: u32, t0: u32, j: u32) -> bool {
			let t = t0 + r;
			if (t >= p.nTokens) { return false; }
			let last = p.pastLen + t;
			if (j > last) { return false; }
			if (p.window > 0u && last + 1u > p.window && j + p.window < last + 1u) { return false; }
			return true;
		}
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let lane = lid.x;
			// t\xEAte en dimension RAPIDE : les workgroups voisins partagent la tuile de requ\xEAtes et,
			// en GQA, la m\xEAme t\xEAte KV (ratio 7 sur Qwen 0.5B) \u2014 K/V restent chauds en L2.
			let tile = wid.x / p.nHeads;
			let h = wid.x % p.nHeads;
			let t0 = tile * 4u;
			let hd = p.headDim;
			let kvh = h / (p.nHeads / p.nKvHeads); // grouped-query: map q-head \u2192 kv-head
			let d0 = lane;
			let d1 = lane + 64u;
			// Les 4 requ\xEAtes en m\xE9moire partag\xE9e : lues une fois, relues \xE0 CHAQUE position K balay\xE9e.
			for (var r = 0u; r < 4u; r = r + 1u) {
				var g0 = 0.0;
				var g1 = 0.0;
				if (t0 + r < p.nTokens) {
					let qBase = ((t0 + r) * p.nHeads + h) * hd;
					if (d0 < hd) { g0 = q[qBase + d0]; }
					if (d1 < hd) { g1 = q[qBase + d1]; }
				}
				if (d0 < hd) { qs[r * 128u + d0] = g0; }
				if (d1 < hd) { qs[r * 128u + d1] = g1; }
			}
			workgroupBarrier();
			// Bornes du balayage de la TUILE : la derni\xE8re rang\xE9e valide fixe la fin, la rang\xE9e 0 \u2014
			// dont la fen\xEAtre glissante d\xE9marre au plus t\xF4t \u2014 fixe le d\xE9but.
			let lastMax = p.pastLen + min(t0 + 3u, p.nTokens - 1u);
			let last0 = p.pastLen + t0;
			var jStart = 0u;
			if (p.window > 0u && last0 + 1u > p.window) { jStart = last0 + 1u - p.window; }
			var m0 = -3.0e38; var m1 = -3.0e38; var m2 = -3.0e38; var m3 = -3.0e38;
			var n0 = 0.0; var n1 = 0.0; var n2 = 0.0; var n3 = 0.0;
			var a00 = 0.0; var a01 = 0.0; var a02 = 0.0; var a03 = 0.0;
			var a10 = 0.0; var a11 = 0.0; var a12 = 0.0; var a13 = 0.0;
			let vStride = p.nKvHeads * hd;
			let nChunks = (lastMax - jStart + 64u) / 64u; // \u2308(lastMax-jStart+1)/64\u2309 \u2014 \u2265 1
			for (var c = 0u; c < nChunks; c = c + 1u) {
				let j = jStart + c * 64u + lane;
				// UNE position K par lane, QUATRE produits scalaires : k[kB+d] traverse la m\xE9moire
				// une seule fois et sert aux 4 rang\xE9es. Le gain du kernel est dans ces 4 lignes.
				var p0 = 0.0; var p1 = 0.0; var p2 = 0.0; var p3 = 0.0;
				if (j <= lastMax) {
					let kB = (j * p.nKvHeads + kvh) * hd;
					for (var d = 0u; d < hd; d = d + 1u) {
						let kd = k[kB + d];
						p0 = p0 + qs[d] * kd;
						p1 = p1 + qs[128u + d] * kd;
						p2 = p2 + qs[256u + d] * kd;
						p3 = p3 + qs[384u + d] * kd;
					}
				}
				let w0 = visible(0u, t0, j); let w1 = visible(1u, t0, j);
				let w2 = visible(2u, t0, j); let w3 = visible(3u, t0, j);
				var s0 = -3.0e38; if (w0) { s0 = score(p0); }
				var s1 = -3.0e38; if (w1) { s1 = score(p1); }
				var s2 = -3.0e38; if (w2) { s2 = score(p2); }
				var s3 = -3.0e38; if (w3) { s3 = score(p3); }
				// Les 4 rang\xE9es r\xE9duites dans le M\xCAME arbre : 6 barri\xE8res pour 4 softmax, pas 24.
				red[lane] = s0; red[64u + lane] = s1; red[128u + lane] = s2; red[192u + lane] = s3;
				workgroupBarrier();
				for (var off = 32u; off > 0u; off = off >> 1u) {
					if (lane < off) {
						red[lane] = max(red[lane], red[lane + off]);
						red[64u + lane] = max(red[64u + lane], red[64u + lane + off]);
						red[128u + lane] = max(red[128u + lane], red[128u + lane + off]);
						red[192u + lane] = max(red[192u + lane], red[192u + lane + off]);
					}
					workgroupBarrier();
				}
				let x0 = max(m0, red[0]); let x1 = max(m1, red[64u]);
				let x2 = max(m2, red[128u]); let x3 = max(m3, red[192u]);
				workgroupBarrier(); // red[*] lu par toutes les lanes avant r\xE9\xE9criture
				// Le masque force e = 0 : sans lui, une rang\xE9e dont TOUTE la tuile est masqu\xE9e ferait
				// exp(-3e38 \u2212 (\u22123e38)) = exp(0) = 1, un poids fant\xF4me inject\xE9 dans la somme.
				var e0 = 0.0; if (w0) { e0 = exp(s0 - x0); }
				var e1 = 0.0; if (w1) { e1 = exp(s1 - x1); }
				var e2 = 0.0; if (w2) { e2 = exp(s2 - x2); }
				var e3 = 0.0; if (w3) { e3 = exp(s3 - x3); }
				sc[lane] = e0; sc[64u + lane] = e1; sc[128u + lane] = e2; sc[192u + lane] = e3;
				red[lane] = e0; red[64u + lane] = e1; red[128u + lane] = e2; red[192u + lane] = e3;
				workgroupBarrier();
				for (var off = 32u; off > 0u; off = off >> 1u) {
					if (lane < off) {
						red[lane] = red[lane] + red[lane + off];
						red[64u + lane] = red[64u + lane] + red[64u + lane + off];
						red[128u + lane] = red[128u + lane] + red[128u + lane + off];
						red[192u + lane] = red[192u + lane] + red[192u + lane + off];
					}
					workgroupBarrier();
				}
				// alpha : m initial -3e38 \u2192 exp(0)=1 sur un accumulateur nul, ou exp(-inf)=0 d\xE8s que
				// le max devient fini \u2014 \xE9crase l'\xE9tat vide sans jamais produire de NaN.
				let b0 = exp(m0 - x0); let b1 = exp(m1 - x1);
				let b2 = exp(m2 - x2); let b3 = exp(m3 - x3);
				n0 = n0 * b0 + red[0]; n1 = n1 * b1 + red[64u];
				n2 = n2 * b2 + red[128u]; n3 = n3 * b3 + red[192u];
				m0 = x0; m1 = x1; m2 = x2; m3 = x3;
				// Accumulation V, r\xE9partie par dimension : v[\u2026+d] lu UNE fois par lane et vers\xE9 dans
				// les 4 rang\xE9es. nValid borne la tuile sur lastMax ; le masque PAR RANG\xC9E est d\xE9j\xE0
				// dans sc (poids nul), donc rien \xE0 re-tester ici.
				let nValid = min(64u, lastMax + 1u - jStart - c * 64u);
				let vRow0 = ((jStart + c * 64u) * p.nKvHeads + kvh) * hd;
				if (d0 < hd) {
					var y0 = a00 * b0; var y1 = a01 * b1; var y2 = a02 * b2; var y3 = a03 * b3;
					for (var i = 0u; i < nValid; i = i + 1u) {
						let vv = v[vRow0 + i * vStride + d0];
						y0 = y0 + sc[i] * vv;
						y1 = y1 + sc[64u + i] * vv;
						y2 = y2 + sc[128u + i] * vv;
						y3 = y3 + sc[192u + i] * vv;
					}
					a00 = y0; a01 = y1; a02 = y2; a03 = y3;
				}
				if (d1 < hd) {
					var y0 = a10 * b0; var y1 = a11 * b1; var y2 = a12 * b2; var y3 = a13 * b3;
					for (var i = 0u; i < nValid; i = i + 1u) {
						let vv = v[vRow0 + i * vStride + d1];
						y0 = y0 + sc[i] * vv;
						y1 = y1 + sc[64u + i] * vv;
						y2 = y2 + sc[128u + i] * vv;
						y3 = y3 + sc[192u + i] * vv;
					}
					a10 = y0; a11 = y1; a12 = y2; a13 = y3;
				}
				workgroupBarrier(); // sc/red r\xE9utilis\xE9s \xE0 la tuile suivante
			}
			// Une rang\xE9e \xE9crite par requ\xEAte R\xC9ELLE : la derni\xE8re tuile en compte moins de 4, et une
			// rang\xE9e hors nTokens a n = 0 (donc a/n = NaN) \u2014 elle ne doit jamais atteindre o.
			let oB = (t0 * p.nHeads + h) * hd;
			let oStride = p.nHeads * hd;
			if (d0 < hd) {
				if (t0 < p.nTokens) { o[oB + d0] = a00 / n0; }
				if (t0 + 1u < p.nTokens) { o[oB + oStride + d0] = a01 / n1; }
				if (t0 + 2u < p.nTokens) { o[oB + 2u * oStride + d0] = a02 / n2; }
				if (t0 + 3u < p.nTokens) { o[oB + 3u * oStride + d0] = a03 / n3; }
			}
			if (d1 < hd) {
				if (t0 < p.nTokens) { o[oB + d1] = a10 / n0; }
				if (t0 + 1u < p.nTokens) { o[oB + oStride + d1] = a11 / n1; }
				if (t0 + 2u < p.nTokens) { o[oB + 2u * oStride + d1] = a12 / n2; }
				if (t0 + 3u < p.nTokens) { o[oB + 3u * oStride + d1] = a13 / n3; }
			}
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
		}`,attention_prefill_q8kv:`
		struct AP { nTokens: u32, nHeads: u32, nKvHeads: u32, headDim: u32, kvLen: u32, pastLen: u32, scale: f32, softcap: f32, window: u32 };
		@group(0) @binding(0) var<uniform> p: AP;
		@group(0) @binding(1) var<storage, read> q: array<f32>;
		@group(0) @binding(2) var<storage, read> kc: array<u32>;
		@group(0) @binding(3) var<storage, read> ks: array<f32>;
		@group(0) @binding(4) var<storage, read> vc: array<u32>;
		@group(0) @binding(5) var<storage, read> vs: array<f32>;
		@group(0) @binding(6) var<storage, read_write> o: array<f32>;
		var<workgroup> qs: array<f32, 512>;  // 4 requ\xEAtes \xD7 pas fixe 128 (headDim \u2264 128)
		var<workgroup> sc: array<f32, 256>;  // poids \xD7 scale de V : 4 rang\xE9es \xD7 64 positions
		var<workgroup> red: array<f32, 256>; // scratch de r\xE9duction \u2014 poids NU pour le d\xE9nominateur
		fn sbyte(word: u32, b: u32) -> f32 { return f32(i32(word << ((3u - b) * 8u)) >> 24u); }
		fn score(dot: f32) -> f32 {
			let s = dot * p.scale;
			return select(s, p.softcap * tanh(s / p.softcap), p.softcap > 0.0);
		}
		// Identique \xE0 attention_prefill : causalit\xE9 + fen\xEAtre glissante, PAR RANG\xC9E de la tuile.
		fn visible(r: u32, t0: u32, j: u32) -> bool {
			let t = t0 + r;
			if (t >= p.nTokens) { return false; }
			let last = p.pastLen + t;
			if (j > last) { return false; }
			if (p.window > 0u && last + 1u > p.window && j + p.window < last + 1u) { return false; }
			return true;
		}
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let lane = lid.x;
			let tile = wid.x / p.nHeads;
			let h = wid.x % p.nHeads;
			let t0 = tile * 4u;
			let hd = p.headDim;
			let kvh = h / (p.nHeads / p.nKvHeads);
			let kvDim = p.nKvHeads * hd;
			let d0 = lane;
			let d1 = lane + 64u;
			for (var r = 0u; r < 4u; r = r + 1u) {
				var g0 = 0.0;
				var g1 = 0.0;
				if (t0 + r < p.nTokens) {
					let qBase = ((t0 + r) * p.nHeads + h) * hd;
					if (d0 < hd) { g0 = q[qBase + d0]; }
					if (d1 < hd) { g1 = q[qBase + d1]; }
				}
				if (d0 < hd) { qs[r * 128u + d0] = g0; }
				if (d1 < hd) { qs[r * 128u + d1] = g1; }
			}
			workgroupBarrier();
			let lastMax = p.pastLen + min(t0 + 3u, p.nTokens - 1u);
			let last0 = p.pastLen + t0;
			var jStart = 0u;
			if (p.window > 0u && last0 + 1u > p.window) { jStart = last0 + 1u - p.window; }
			var m0 = -3.0e38; var m1 = -3.0e38; var m2 = -3.0e38; var m3 = -3.0e38;
			var n0 = 0.0; var n1 = 0.0; var n2 = 0.0; var n3 = 0.0;
			var a00 = 0.0; var a01 = 0.0; var a02 = 0.0; var a03 = 0.0;
			var a10 = 0.0; var a11 = 0.0; var a12 = 0.0; var a13 = 0.0;
			let nChunks = (lastMax - jStart + 64u) / 64u;
			for (var c = 0u; c < nChunks; c = c + 1u) {
				let j = jStart + c * 64u + lane;
				// Un octet de K d\xE9quantifi\xE9 UNE fois, vers\xE9 dans les 4 produits scalaires.
				var p0 = 0.0; var p1 = 0.0; var p2 = 0.0; var p3 = 0.0;
				if (j <= lastMax) {
					let eb = j * kvDim + kvh * hd;
					for (var d = 0u; d < hd; d = d + 1u) {
						let e = eb + d;
						let kd = sbyte(kc[e >> 2u], e & 3u);
						p0 = p0 + qs[d] * kd;
						p1 = p1 + qs[128u + d] * kd;
						p2 = p2 + qs[256u + d] * kd;
						p3 = p3 + qs[384u + d] * kd;
					}
					// Le scale de K factorise hors du produit scalaire : une multiplication, pas hd.
					let kscale = ks[j * p.nKvHeads + kvh];
					p0 = p0 * kscale; p1 = p1 * kscale; p2 = p2 * kscale; p3 = p3 * kscale;
				}
				let w0 = visible(0u, t0, j); let w1 = visible(1u, t0, j);
				let w2 = visible(2u, t0, j); let w3 = visible(3u, t0, j);
				var s0 = -3.0e38; if (w0) { s0 = score(p0); }
				var s1 = -3.0e38; if (w1) { s1 = score(p1); }
				var s2 = -3.0e38; if (w2) { s2 = score(p2); }
				var s3 = -3.0e38; if (w3) { s3 = score(p3); }
				red[lane] = s0; red[64u + lane] = s1; red[128u + lane] = s2; red[192u + lane] = s3;
				workgroupBarrier();
				for (var off = 32u; off > 0u; off = off >> 1u) {
					if (lane < off) {
						red[lane] = max(red[lane], red[lane + off]);
						red[64u + lane] = max(red[64u + lane], red[64u + lane + off]);
						red[128u + lane] = max(red[128u + lane], red[128u + lane + off]);
						red[192u + lane] = max(red[192u + lane], red[192u + lane + off]);
					}
					workgroupBarrier();
				}
				let x0 = max(m0, red[0]); let x1 = max(m1, red[64u]);
				let x2 = max(m2, red[128u]); let x3 = max(m3, red[192u]);
				workgroupBarrier(); // red[*] lu par toutes les lanes avant r\xE9\xE9criture
				var e0 = 0.0; if (w0) { e0 = exp(s0 - x0); }
				var e1 = 0.0; if (w1) { e1 = exp(s1 - x1); }
				var e2 = 0.0; if (w2) { e2 = exp(s2 - x2); }
				var e3 = 0.0; if (w3) { e3 = exp(s3 - x3); }
				red[lane] = e0; red[64u + lane] = e1; red[128u + lane] = e2; red[192u + lane] = e3;
				// Le scale de V fusionn\xE9 DANS le poids : gard\xE9 par un if et NON par un select, qui
				// \xE9valuerait ses deux branches \u2014 or j d\xE9passe kvLen sur la derni\xE8re tuile (le\xE7on conv2d).
				var vsc = 0.0;
				if (j <= lastMax) { vsc = vs[j * p.nKvHeads + kvh]; }
				sc[lane] = e0 * vsc; sc[64u + lane] = e1 * vsc;
				sc[128u + lane] = e2 * vsc; sc[192u + lane] = e3 * vsc;
				workgroupBarrier();
				for (var off = 32u; off > 0u; off = off >> 1u) {
					if (lane < off) {
						red[lane] = red[lane] + red[lane + off];
						red[64u + lane] = red[64u + lane] + red[64u + lane + off];
						red[128u + lane] = red[128u + lane] + red[128u + lane + off];
						red[192u + lane] = red[192u + lane] + red[192u + lane + off];
					}
					workgroupBarrier();
				}
				let b0 = exp(m0 - x0); let b1 = exp(m1 - x1);
				let b2 = exp(m2 - x2); let b3 = exp(m3 - x3);
				n0 = n0 * b0 + red[0]; n1 = n1 * b1 + red[64u];
				n2 = n2 * b2 + red[128u]; n3 = n3 * b3 + red[192u];
				m0 = x0; m1 = x1; m2 = x2; m3 = x3;
				let nValid = min(64u, lastMax + 1u - jStart - c * 64u);
				let vRow0 = (jStart + c * 64u) * kvDim + kvh * hd;
				if (d0 < hd) {
					var y0 = a00 * b0; var y1 = a01 * b1; var y2 = a02 * b2; var y3 = a03 * b3;
					for (var i = 0u; i < nValid; i = i + 1u) {
						let e4 = vRow0 + i * kvDim + d0;
						let vv = sbyte(vc[e4 >> 2u], e4 & 3u);
						y0 = y0 + sc[i] * vv;
						y1 = y1 + sc[64u + i] * vv;
						y2 = y2 + sc[128u + i] * vv;
						y3 = y3 + sc[192u + i] * vv;
					}
					a00 = y0; a01 = y1; a02 = y2; a03 = y3;
				}
				if (d1 < hd) {
					var y0 = a10 * b0; var y1 = a11 * b1; var y2 = a12 * b2; var y3 = a13 * b3;
					for (var i = 0u; i < nValid; i = i + 1u) {
						let e4 = vRow0 + i * kvDim + d1;
						let vv = sbyte(vc[e4 >> 2u], e4 & 3u);
						y0 = y0 + sc[i] * vv;
						y1 = y1 + sc[64u + i] * vv;
						y2 = y2 + sc[128u + i] * vv;
						y3 = y3 + sc[192u + i] * vv;
					}
					a10 = y0; a11 = y1; a12 = y2; a13 = y3;
				}
				workgroupBarrier(); // sc/red r\xE9utilis\xE9s \xE0 la tuile suivante
			}
			let oB = (t0 * p.nHeads + h) * hd;
			let oStride = p.nHeads * hd;
			if (d0 < hd) {
				if (t0 < p.nTokens) { o[oB + d0] = a00 / n0; }
				if (t0 + 1u < p.nTokens) { o[oB + oStride + d0] = a01 / n1; }
				if (t0 + 2u < p.nTokens) { o[oB + 2u * oStride + d0] = a02 / n2; }
				if (t0 + 3u < p.nTokens) { o[oB + 3u * oStride + d0] = a03 / n3; }
			}
			if (d1 < hd) {
				if (t0 < p.nTokens) { o[oB + d1] = a10 / n0; }
				if (t0 + 1u < p.nTokens) { o[oB + oStride + d1] = a11 / n1; }
				if (t0 + 2u < p.nTokens) { o[oB + 2u * oStride + d1] = a12 / n2; }
				if (t0 + 3u < p.nTokens) { o[oB + 3u * oStride + d1] = a13 / n3; }
			}
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
	}`});var Qe,nr=te(()=>{"use strict";Qe=class{constructor(e){this.sets=[];this.cur=0;this.next=0;this.names=[];this.acc=new Map;this.dropped=0;this.pending=[];this.fenetre=0;this.device=e;let r=globalThis;for(let t=0;t<2;t++)this.sets.push({qs:e.createQuerySet({type:"timestamp",count:4096}),resolve:e.createBuffer({size:4096*8,usage:r.GPUBufferUsage.QUERY_RESOLVE|r.GPUBufferUsage.COPY_SRC}),read:e.createBuffer({size:4096*8,usage:r.GPUBufferUsage.COPY_DST|r.GPUBufferUsage.MAP_READ}),busy:!1})}slot(e){if(this.next+2>4096&&(this.rotate(),this.next+2>4096))return this.dropped++,null;let r=this.sets[this.cur];if(r.busy)return this.dropped++,null;let t=this.next;return this.next+=2,this.names.push(e),{querySet:r.qs,beginningOfPassWriteIndex:t,endOfPassWriteIndex:t+1}}rotate(){let e=this.cur,r=this.sets[e],t=this.names,n=this.next;if(this.cur=(this.cur+1)%2,this.next=0,this.names=[],!n||r.busy)return;r.busy=!0;let a=this.fenetre,i=this.device.createCommandEncoder();i.resolveQuerySet(r.qs,0,n,r.resolve,0),i.copyBufferToBuffer(r.resolve,0,r.read,0,n*8),this.device.queue.submit([i.finish()]);let s=globalThis,o=r.read.mapAsync(s.GPUMapMode.READ,0,n*8).then(()=>{let u=new BigUint64Array(r.read.getMappedRange(0,n*8).slice(0));if(r.read.unmap(),a===this.fenetre)for(let c=0;c<t.length;c++){let l=u[c*2],d=u[c*2+1];if(!l||!d||d<=l)continue;let g=Number(d-l),p=this.acc.get(t[c]);p?(p.calls++,p.ns+=g):this.acc.set(t[c],{calls:1,ns:g})}}).catch(()=>{}).finally(()=>{r.busy=!1});this.pending.push(o)}async report(){this.rotate();let e=this.pending;this.pending=[],await Promise.all(e);let r=0,t=0;for(let a of this.acc.values())r+=a.ns,t+=a.calls;return{passes:[...this.acc.entries()].map(([a,i])=>({name:a,calls:i.calls,totalMs:i.ns/1e6,meanUs:i.ns/i.calls/1e3,share:r?i.ns/r:0,reliable:i.calls>=50})).sort((a,i)=>i.totalMs-a.totalMs),totalMs:r/1e6,samples:t,dropped:this.dropped,quantumUs:100}}reset(){this.fenetre++,this.acc.clear(),this.dropped=0}destroy(){for(let e of this.sets)try{e.qs.destroy(),e.resolve.destroy(),e.read.destroy()}catch{}this.sets=[]}}});function en(){if(ar!==null)return ar;try{let f=globalThis.__brimkernSearch;if(typeof f=="string")return f}catch{}try{return typeof location<"u"?location.search:""}catch{return""}}function ae(f){try{return new URLSearchParams(en()).get(f)}catch{return null}}var ar,sr=te(()=>{"use strict";ar=null});function me(f){let e=f>>15&1,r=f>>10&31,t=f&1023,n;return r===0?n=t*59604645e-15:r===31?n=65504:n=(1+t/1024)*2**(r-15),e===1?-n:n}function Se(f){let e=new Float32Array(1),r=new Uint32Array(e.buffer);e[0]=f;let t=r[0],n=t>>16&32768,a=(t>>23&255)-127+15,i=t&8388607;return a<=0?n:a>=31?n|31743:(i=(i>>13)+(i>>12&1),i===1024&&(i=0,a+=1),n|a<<10|i&1023)}function tn(f,e){let r=new Float32Array(e*256),t=new DataView(f.buffer,f.byteOffset);for(let n=0;n<e;n++){let a=n*144,i=me(t.getUint16(a,!0)),s=me(t.getUint16(a+2,!0)),o=d=>{let g=p=>f[a+4+p];return d<4?[g(d)&63,g(d+4)&63]:[g(d+4)&15|g(d-4)>>6<<4,g(d+4)>>4|g(d)>>6<<4]},u=n*256,c=0,l=0;for(let d=0;d<256;d+=64){let[g,p]=o(c),m=i*g,b=s*p,[k,B]=o(c+1),M=i*k,F=s*B;for(let C=0;C<32;C++){let K=f[a+16+l+C];r[u+d+C]=m*(K&15)-b,r[u+d+32+C]=M*(K>>4)-F}l+=32,c+=2}}return r}function Re(f){return f>127?f-256:f}function rn(f,e){let r=new Float32Array(e*32),t=new DataView(f.buffer,f.byteOffset);for(let n=0;n<e;n++){let a=n*34,i=me(t.getUint16(a,!0));for(let s=0;s<32;s++)r[n*32+s]=i*Re(f[a+2+s])}return r}function nn(f,e){let r=new Float32Array(e*32),t=new DataView(f.buffer,f.byteOffset);for(let n=0;n<e;n++){let a=n*22,i=me(t.getUint16(a,!0)),s=t.getUint32(a+2,!0);for(let o=0;o<16;o++){let u=f[a+6+o],c=s>>>o<<4&16,l=s>>>o+12&16;r[n*32+o]=i*((u&15|c)-16),r[n*32+o+16]=i*((u>>4|l)-16)}}return r}function an(f,e){let r=new Float32Array(e*32),t=new DataView(f.buffer,f.byteOffset);for(let n=0;n<e;n++){let a=n*18,i=me(t.getUint16(a,!0));for(let s=0;s<16;s++){let o=f[a+2+s];r[n*32+s]=i*((o&15)-8),r[n*32+s+16]=i*((o>>4)-8)}}return r}function sn(f,e){let r=new Float32Array(e*256),t=new DataView(f.buffer,f.byteOffset);for(let n=0;n<e;n++){let a=n*176,i=me(t.getUint16(a,!0)),s=me(t.getUint16(a+2,!0)),o=p=>{let m=b=>f[a+4+b];return p<4?[m(p)&63,m(p+4)&63]:[m(p+4)&15|m(p-4)>>6<<4,m(p+4)>>4|m(p)>>6<<4]},u=n*256,c=0,l=0,d=1,g=2;for(let p=0;p<256;p+=64){let[m,b]=o(c),k=i*m,B=s*b,[M,F]=o(c+1),C=i*M,K=s*F;for(let A=0;A<32;A++){let w=f[a+48+l+A],v=f[a+16+A];r[u+p+A]=k*((w&15)+(v&d?16:0))-B,r[u+p+32+A]=C*((w>>4)+(v&g?16:0))-K}l+=32,c+=2,d<<=2,g<<=2}}return r}function on(f,e){let r=new Float32Array(e*256),t=new DataView(f.buffer,f.byteOffset);for(let n=0;n<e;n++){let a=n*210,i=me(t.getUint16(a+208,!0)),s=n*256;for(let o=0;o<2;o++){let u=a+o*64,c=a+128+o*32,l=a+192+o*8,d=s+o*128;for(let g=0;g<32;g++){let p=g/16|0,m=f[u+g],b=f[u+g+32],k=f[c+g],B=(m&15|(k>>0&3)<<4)-32,M=(b&15|(k>>2&3)<<4)-32,F=(m>>4|(k>>4&3)<<4)-32,C=(b>>4|(k>>6&3)<<4)-32;r[d+g]=i*Re(f[l+p])*B,r[d+g+32]=i*Re(f[l+p+2])*M,r[d+g+64]=i*Re(f[l+p+4])*F,r[d+g+96]=i*Re(f[l+p+6])*C}}}return r}function Te(f,e,r,t,n){let a=new Float32Array(r*n);for(let i=0;i<r;i++)for(let s=0;s<n;s++){let o=0;for(let u=0;u<t;u++)o+=f[i*t+u]*e[u*n+s];a[i*n+s]=o}return a}function Ge(f,e,r,t,n=1e-5,a=!1){let i=new Float32Array(r*t);for(let s=0;s<r;s++){let o=0;for(let c=0;c<t;c++)o+=f[s*t+c]**2;let u=1/Math.sqrt(o/t+n);for(let c=0;c<t;c++)i[s*t+c]=f[s*t+c]*u*(a?1+e[c]:e[c])}return i}function un(f,e,r,t,n,a,i){let s=new Float32Array(f.length),o=t/2,u=a[0],c=a[0]+a[1];for(let l=0;l<r;l++){let d=Math.floor(l/n),g=l*t;for(let p=0;p<o;p++){let m=p<u?0:p<c?1:2,k=e[d*3+m]/i**(2*p/t),B=Math.cos(k),M=Math.sin(k),F=f[g+p],C=f[g+p+o];s[g+p]=F*B-C*M,s[g+p+o]=C*B+F*M}}return s}function Ve(f,e,r,t,n=0,a=1e4,i){let s=new Float32Array(f.length),o=r/2;for(let u=0;u<e;u++){let c=n+Math.floor(u/t),l=u*r;for(let d=0;d<o;d++){let g=c/(a**(2*d/r)*(i?i[d]:1)),p=Math.cos(g),m=Math.sin(g),b=f[l+2*d],k=f[l+2*d+1];s[l+2*d]=b*p-k*m,s[l+2*d+1]=k*p+b*m}}return s}function cn(f,e,r,t,n,a=0,i=1e4){let s=new Float32Array(f.length),o=t/2;for(let u=0;u<r;u++){let c=a+Math.floor(u/n),l=u*t;for(let d=0;d<o;d++){let g=c/(i**(2*d/t)*e[d]),p=Math.cos(g),m=Math.sin(g),b=f[l+d],k=f[l+d+o];s[l+d]=b*p-k*m,s[l+d+o]=k*p+b*m}}return s}function Le(f,e,r,t,n=0,a=1e4){let i=new Float32Array(f.length),s=r/2;for(let o=0;o<e;o++){let u=n+Math.floor(o/t),c=o*r;for(let l=0;l<s;l++){let d=u/a**(2*l/r),g=Math.cos(d),p=Math.sin(d),m=f[c+l],b=f[c+l+s];i[c+l]=m*g-b*p,i[c+l+s]=b*g+m*p}}return i}function ct(f,e,r){return f.map((t,n)=>t+e[n%r])}function lt(f,e,r,t=!0){let n=t?f.windowPerLayer?.[r]??f.window??0:0,a=f.ropeThetaPerLayer?.[r]??f.ropeTheta,i=f.skipRopePerLayer?.[r]??f.skipRope??!1;return{...f,seq:e,window:n,ropeTheta:a,skipRope:i}}function he(f,e,r,t,n,a,i,s=0,o,u=0,c=0){let l=new Float32Array(t*n*i),d=o??1/Math.sqrt(i),g=m=>u>0?u*Math.tanh(m/u):m,p=n/a;for(let m=0;m<t;m++)for(let b=0;b<n;b++){let k=Math.floor(b/p),B=(m*n+b)*i,M=s+m,F=c>0?Math.max(0,M+1-c):0,C=[],K=-1/0;for(let w=F;w<=M;w++){let v=(w*a+k)*i,h=0;for(let y=0;y<i;y++)h+=f[B+y]*e[v+y];let G=g(h*d);C[w]=G,G>K&&(K=G)}let A=0;for(let w=F;w<=M;w++)C[w]=Math.exp(C[w]-K),A+=C[w];for(let w=F;w<=M;w++){let v=C[w]/A,h=(w*a+k)*i;for(let G=0;G<i;G++)l[B+G]+=v*r[h+G]}}return l}function ir(f){return .5*f*(1+Math.tanh(.7978845608*(f+.044715*f*f*f)))}function ft(f,e,r){let{seq:t,d:n,nHeads:a,nKvHeads:i,headDim:s,ffn:o,ropeTheta:u,eps:c}=e,l=i*s,d=a*s,g=e.rmsGainOnePlus===!0,p=e.attnLogitSoftcap??0,m=Ge(f,r.attnNorm,t,n,c,g),b=Te(m,r.wq,t,n,d),k=Te(m,r.wk,t,n,l),B=Te(m,r.wv,t,n,l);r.bq&&(b=ct(b,r.bq,d)),r.bk&&(k=ct(k,r.bk,l)),r.bv&&(B=ct(B,r.bv,l)),r.qNorm&&(b=Ge(b,r.qNorm,t*a,s,c,g)),r.kNorm&&(k=Ge(k,r.kNorm,t*i,s,c,g));let M=Le(b,t*a,s,a,0,u),F=Le(k,t*i,s,i,0,u),C=he(M,F,B,t,a,i,s,0,e.attnScale,p),K=Te(C,r.wo,t,d,n);r.postAttnNorm&&(K=Ge(K,r.postAttnNorm,t,n,c,g));let A=f.map((P,U)=>P+K[U]),w=Ge(A,r.ffnNorm,t,n,c,g),v=Te(w,r.wgate,t,n,o),h=Te(w,r.wup,t,n,o),G=e.act==="gelu"?v.map((P,U)=>ir(P)*h[U]):v.map((P,U)=>P/(1+Math.exp(-P))*h[U]),y=Te(G,r.wdown,t,o,n);return r.postFfnNorm&&(y=Ge(y,r.postFfnNorm,t,n,c,g)),A.map((P,U)=>P+y[U])}var ee,X,$e,or=te(()=>{"use strict";it();ot();Zt();rr();nr();sr();ee=64,X=class X{constructor(){this.device=null;this.modules={};this.pipelines={};this.maxStorageBufferBindingSize=0;this.hasF16=!1;this.validationFailure=null;this.lost=!1;this.onLost=null;this.attnDecodeOk=!0;this.attnPrefillOk=!0;this.attnFullWgOk=!0;this.mropeOk=!0;this.rwkvWkv7Ok=!0;this.lfm2ShortConvOk=!0;this.lfm2ResidentOk=!0;this.lfm2BatchOk=!0;this.swaOk=!0;this.rwkvResidentOk=!0;this.videoOk=!0;this.videoResidentOk=!0;this.f16SharedOk=!0;this.qSharedOk=!0;this.qShared2Ok=!0;this.gemvOk=!0;this.rmsVecOk=!0;this.topKParOk=!0;this.profiler=null;this.bufferPool=new Map;this.poolSize=new WeakMap;this.pooled=new WeakSet;this.uniformPool=new Map;this.uniformSize=new WeakMap;this.convTiledOk=!0;this.kvGpu=new Map;this.topKOk=!0;this.kvSession="";this.kvQuant=!1;this.lfm2KvGpu=new Map;this.lfm2ConvGpu=new Map;this.lfm2Session="";this.rwkvStateGpu=new Map;this.rwkvVFirst=null;this.rwkvSession=""}async init(){let e=navigator.gpu;if(!e)return!1;let r=await e.requestAdapter();if(!r)return!1;let t=r.limits,n={maxStorageBufferBindingSize:t.maxStorageBufferBindingSize,maxBufferSize:t.maxBufferSize},a=[];try{r.features?.has("shader-f16")&&a.push("shader-f16")}catch{}try{X.profileOn&&r.features?.has("timestamp-query")&&a.push("timestamp-query")}catch{}try{this.device=await r.requestDevice({requiredLimits:n,requiredFeatures:a})}catch{try{this.device=await r.requestDevice({requiredLimits:n})}catch{this.device=await r.requestDevice()}}this.maxStorageBufferBindingSize=this.device.limits?.maxStorageBufferBindingSize??134217728,this.hasF16=!!this.device.features?.has?.("shader-f16"),X.profileOn&&(this.device.features?.has?.("timestamp-query")?(this.profiler=new Qe(this.device),console.info("[webgpu] profilage par passe ACTIF (?gpuprofile=1) \u2014 __gpuProfile() pour le rapport")):console.warn("[webgpu] ?gpuprofile=1 demand\xE9 mais la feature timestamp-query est ABSENTE de cet adapter \u2014 aucune mesure ne sera prise."));try{ae("attndecode")==="0"&&(this.attnDecodeOk=!1,console.warn("[webgpu] attention d\xE9codage COUP\xC9E par ?attndecode=0 \u2014 kernels classiques")),ae("attnfullwg")==="0"&&(this.attnFullWgOk=!1,console.warn("[webgpu] attention_full workgroup COUP\xC9E par ?attnfullwg=0 \u2014 kernel classique")),ae("attnprefill")==="0"&&(this.attnPrefillOk=!1,console.warn("[webgpu] attention prefill tuil\xE9e COUP\xC9E par ?attnprefill=0 \u2014 kernel classique")),ae("rmsvec")==="0"&&(this.rmsVecOk=!1,console.warn("[webgpu] RMSNorm parall\xE8le COUP\xC9E par ?rmsvec=0 \u2014 kernel une-ligne-par-thread")),ae("topkpar")==="0"&&(this.topKParOk=!1,console.warn("[webgpu] top-K parall\xE8le COUP\xC9E par ?topkpar=0 \u2014 s\xE9lection finale sur un seul thread")),ae("rwkv")==="0"&&(this.rwkvWkv7Ok=!1,console.warn("[webgpu] kernel RWKV-7 WKV COUP\xC9 par ?rwkv=0")),ae("lfm2")==="0"&&(this.lfm2ShortConvOk=!1,console.warn("[webgpu] kernel shortconv LFM2 COUP\xC9 par ?lfm2=0")),ae("lfm2resident")==="0"&&(this.lfm2ResidentOk=!1,console.warn("[webgpu] LFM2 r\xE9sident COUP\xC9 par ?lfm2resident=0 \u2014 forwardToken JS+readback")),ae("lfm2batch")==="0"&&(this.lfm2BatchOk=!1,console.warn("[webgpu] prefill LFM2 batch\xE9 COUP\xC9 par ?lfm2batch=0 \u2014 token par token")),ae("swa")==="0"&&(this.swaOk=!1,console.warn("[webgpu] fen\xEAtre glissante COUP\xC9E par ?swa=0 \u2014 attention causale pleine sur toutes les couches")),ae("rwkvresident")==="0"&&(this.rwkvResidentOk=!1,console.warn("[webgpu] RWKV r\xE9sident COUP\xC9 par ?rwkvresident=0 \u2014 forwardToken JS+readback")),ae("video")==="0"&&(this.videoOk=!1,console.warn("[webgpu] chemin vid\xE9o (module motion) COUP\xC9 par ?video=0")),ae("f16shared")==="0"&&(this.f16SharedOk=!1,console.warn("[webgpu] GEMM f16 tuil\xE9 COUP\xC9 par ?f16shared=0 \u2014 matmul_t_f16w pour tous les m")),ae("gemv")==="0"&&(this.gemvOk=!1,console.warn("[webgpu] GEMV de d\xE9codage COUP\xC9 par ?gemv=0 \u2014 kernels par lignes")),ae("qshared")==="0"&&(this.qSharedOk=!1,console.warn("[webgpu] GEMM q8/q4 tuil\xE9s COUP\xC9S par ?qshared=0 \u2014 kernels 4 lignes/invocation")),ae("qshared2")==="0"&&(this.qShared2Ok=!1,console.warn("[webgpu] GEMM q8/q4 v2 (bloc 4\xD78 vec4) COUP\xC9S par ?qshared2=0 \u2014 tuile 32\xD764 v1")),ae("videoresident")==="0"&&(this.videoResidentOk=!1,console.warn("[webgpu] motion r\xE9sident COUP\xC9 par ?videoresident=0 \u2014 chemin JS+readback"))}catch{}this.device.lost?.then?.(i=>{this.lost=!0,console.warn("[webgpu] device GPU perdu :",i?.reason||"unknown",i?.message||""),this.onLost?.(i)});for(let[i,s]of Object.entries(er))this.modules[i]=this.device.createShaderModule({code:s});return this.hasF16&&(this.modules.matmul_t_f16w=this.device.createShaderModule({code:tr})),!0}buf(e,r){let t=this.device.createBuffer({size:e.byteLength,usage:r});return this.device.queue.writeBuffer(t,0,e),t}bufU32(e,r){let t=this.device.createBuffer({size:e.byteLength,usage:r});return this.device.queue.writeBuffer(t,0,e),t}async readBack(e,r){let t=globalThis,n=this.device.createBuffer({size:r,usage:t.GPUBufferUsage.COPY_DST|t.GPUBufferUsage.MAP_READ}),a=this.device.createCommandEncoder();a.copyBufferToBuffer(e,0,n,0,r),this.device.queue.submit([a.finish()]),await n.mapAsync(t.GPUMapMode.READ);let i=new Float32Array(n.getMappedRange().slice(0));return n.unmap(),n.destroy(),i}async readBackBytes(e,r){let t=globalThis,n=Math.ceil(r/4)*4,a=this.device.createBuffer({size:n,usage:t.GPUBufferUsage.COPY_DST|t.GPUBufferUsage.MAP_READ}),i=this.device.createCommandEncoder();i.copyBufferToBuffer(e,0,a,0,n),this.device.queue.submit([i.finish()]),await a.mapAsync(t.GPUMapMode.READ);let s=new Uint8Array(a.getMappedRange().slice(0,r));return a.unmap(),a.destroy(),s}async quantizeToBytes(e,r,t,n,a){let i=t/32,s=n==="q8"?new Uint8Array(t+i*2):new Uint8Array(t/2+i*4),o=X.BLOCK_ELEMS[e]??1,u=t/o,c=r.byteLength/u,l=(m,b)=>b===0?m:l(b,m%b),d=o*32/l(o,32),g=Math.floor(this.maxStorageBufferBindingSize*.9/4),p=a??g;p=Math.max(d,Math.floor(p/d)*d);for(let m=0;m<t;m+=p){let b=Math.min(p,t-m),k=r.slice(m/o*c,(m+b)/o*c),B=this.dequantizeToGpu(e,k,b);try{if(n==="q8"){let{codes:M,sc:F}=this.f32ToQ8Gpu(B,b),C=await this.readBackBytes(M,b),K=await this.readBackBytes(F,b/32*2);M.destroy?.(),F.destroy?.(),s.set(C,m),s.set(K,t+m/32*2)}else{let{nib:M,sc:F,mn:C}=this.f32ToQ4Gpu(B,b),K=await this.readBackBytes(M,b/2),A=await this.readBackBytes(F,b/32*2),w=await this.readBackBytes(C,b/32*2);M.destroy?.(),F.destroy?.(),C.destroy?.(),s.set(K,m/2),s.set(A,t/2+m/32*2),s.set(w,t/2+i*2+m/32*2)}}finally{B.destroy?.()}}return s}pipeline(e){let r=this.pipelines[e];return r||(r=this.device.createComputePipeline({layout:"auto",compute:{module:this.modules[e],entryPoint:"main"}}),this.pipelines[e]=r),r}grid1D(e){let r=Math.ceil(e/ee);if(r<=X.MAX_WG_DIM)return[r,1,1];let t=X.MAX_WG_DIM;return[t,Math.ceil(r/t),1]}recordPass(e,r,t,n){let a=this.pipeline(r),i=this.device.createBindGroup({layout:a.getBindGroupLayout(0),entries:t.map((u,c)=>({binding:c,resource:{buffer:u}}))}),s=this.profiler?.slot(r),o=e.beginComputePass(s?{timestampWrites:s}:void 0);o.setPipeline(a),o.setBindGroup(0,i),o.dispatchWorkgroups(...n),o.end()}dispatch(e,r,t){let n=this.device.createCommandEncoder();this.recordPass(n,e,r,t),this.device.queue.submit([n.finish()])}async run(e,r,t,n,a){return this.dispatch(e,r,t),this.readBack(n,a)}isF32(e){return e instanceof Float32Array}async matmul(e,r,t,n,a){let i=globalThis,s=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([t,n,a]));let u=this.isF32(r)?this.buf(r,s):r,c=this.device.createBuffer({size:t*a*4,usage:s|i.GPUBufferUsage.COPY_SRC});return this.run("matmul",[o,this.buf(e,s),u,c],[Math.ceil(t/8),Math.ceil(a/8),1],c,t*a*4)}async matmulT(e,r,t,n,a,i=!1){let s=globalThis,o=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([t,n,a]));let c=this.isF32(r)?this.buf(r,o):r,l=this.device.createBuffer({size:t*a*4,usage:o|s.GPUBufferUsage.COPY_SRC}),d=this.matmulTPlan(t,n,a,i);return this.run(d.shader,[u,this.buf(e,o),c,l],d.grid,l,t*a*4)}matmulTPlan(e,r,t,n){return n&&this.hasF16?this.f16SharedOk&&e>=32&&r%4===0?{shader:"matmul_t_f16w_shared",grid:[Math.ceil(t/64),Math.ceil(e/32),1]}:{shader:"matmul_t_f16w",grid:[Math.ceil(e/8),Math.ceil(t/8),1]}:{shader:r%4===0?"matmul_t_vec4":"matmul_t",grid:[Math.ceil(e/8),Math.ceil(t/8),1]}}async rmsnorm(e,r,t,n,a=1e-5,i=!1){let s=globalThis,o=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([t,n])),this.device.queue.writeBuffer(u,8,new Float32Array([a])),this.device.queue.writeBuffer(u,12,new Uint32Array([i?1:0]));let c=this.device.createBuffer({size:e.byteLength,usage:o|s.GPUBufferUsage.COPY_SRC});return this.run("rmsnorm",[u,this.buf(e,o),this.buf(r,o),c],[Math.ceil(t/ee),1,1],c,e.byteLength)}async topKReadback(e,r,t){let n=globalThis,a=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST,i=this.device.createBuffer({size:8,usage:n.GPUBufferUsage.UNIFORM|n.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(i,0,new Uint32Array([e.length,r]));let s=this.device.createBuffer({size:r*2*4,usage:a|n.GPUBufferUsage.COPY_SRC}),o=this.device.createBuffer({size:r*2*4,usage:n.GPUBufferUsage.COPY_DST|n.GPUBufferUsage.MAP_READ}),u=this.device.createCommandEncoder(),c=this.buf(e,a);this.recordPass(u,t,[i,c,s],[1,1,1]),u.copyBufferToBuffer(s,0,o,0,r*2*4),this.device.queue.submit([u.finish()]),await o.mapAsync(n.GPUMapMode.READ);let l=new Uint32Array(o.getMappedRange().slice(0));return o.unmap(),o.destroy(),s.destroy?.(),i.destroy?.(),c.destroy?.(),l}async rmsnormVec(e,r,t,n,a=1e-5,i=!1){let s=globalThis,o=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([t,n])),this.device.queue.writeBuffer(u,8,new Float32Array([a])),this.device.queue.writeBuffer(u,12,new Uint32Array([i?1:0]));let c=this.device.createBuffer({size:e.byteLength,usage:o|s.GPUBufferUsage.COPY_SRC});return this.run("rmsnorm_vec",[u,this.buf(e,o),this.buf(r,o),c],[t,1,1],c,e.byteLength)}async binary(e,r,t){let n=globalThis,a=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST,i=this.device.createBuffer({size:r.byteLength,usage:a|n.GPUBufferUsage.COPY_SRC});return this.run(e,[this.buf(r,a),this.buf(t,a),i],this.grid1D(r.length),i,r.byteLength)}swiglu(e,r){return this.binary("swiglu",e,r)}geglu(e,r){return this.binary("geglu",e,r)}add(e,r){return this.binary("add",e,r)}async silu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("silu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async groupNorm(e,r,t,n,a,i,s=1e-5){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([n,a,i])),this.device.queue.writeBuffer(c,12,new Float32Array([s]));let l=this.device.createBuffer({size:e.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("group_norm",[c,this.buf(e,u),this.buf(r,u),this.buf(t,u),l],[i,1,1],l,e.byteLength)}async conv2d(e,r,t,n,a,i,s,o,u,c=1,l=0){let d=globalThis,g=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,p=Math.floor((a+2*l-o)/c)+1,m=Math.floor((i+2*l-u)/c)+1,b=n*o*u,k=p*m;if(b*k*4>this.maxStorageBufferBindingSize*.9)return this.conv2dDirect(e,r,t,n,a,i,s,o,u,c,l);let B=this.device.createBuffer({size:48,usage:d.GPUBufferUsage.UNIFORM|d.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(B,0,new Uint32Array([n,a,i,o,u,c,l,p,m]));let M=this.device.createBuffer({size:b*k*4,usage:g|d.GPUBufferUsage.COPY_SRC});this.dispatch("im2col",[B,this.buf(e,g),M],this.grid1D(b*k));let F=await this.matmul(r,M,s,b,k);if(M.destroy?.(),B.destroy?.(),t)for(let C=0;C<s;C++){let K=t[C];for(let A=0;A<k;A++)F[C*k+A]+=K}return F}async conv2dDirect(e,r,t,n,a,i,s,o,u,c=1,l=0){let d=globalThis,g=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,p=Math.floor((a+2*l-o)/c)+1,m=Math.floor((i+2*l-u)/c)+1,b=s*p*m,k=this.device.createBuffer({size:48,usage:d.GPUBufferUsage.UNIFORM|d.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(k,0,new Uint32Array([n,a,i,s,o,u,c,l,p,m]));let B=t??new Float32Array(s),M=this.device.createBuffer({size:b*4,usage:g|d.GPUBufferUsage.COPY_SRC});return this.run("conv2d_direct",[k,this.buf(e,g),this.buf(r,g),this.buf(B,g),M],this.grid1D(b),M,b*4)}async layernorm(e,r,t,n,a,i=1e-5){let s=globalThis,o=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,a])),this.device.queue.writeBuffer(u,8,new Float32Array([i]));let c=this.device.createBuffer({size:e.byteLength,usage:o|s.GPUBufferUsage.COPY_SRC});return this.run("layernorm",[u,this.buf(e,o),this.buf(r,o),this.buf(t,o),c],[Math.ceil(n/ee),1,1],c,e.byteLength)}async quickGelu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("quick_gelu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async gelu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("gelu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async relu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("relu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async upsampleNearest(e,r,t,n,a=2){let i=globalThis,s=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=t*a,u=n*a,c=r*o*u,l=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(l,0,new Uint32Array([r,t,n,a]));let d=this.device.createBuffer({size:c*4,usage:s|i.GPUBufferUsage.COPY_SRC});return this.run("upsample_nearest",[l,this.buf(e,s),d],this.grid1D(c),d,c*4)}async rope(e,r,t,n,a=0,i=1e4,s=!1){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:32,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([r,t,n,a])),this.device.queue.writeBuffer(c,16,new Float32Array([i]));let l=this.device.createBuffer({size:e.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.device.queue.writeBuffer(c,20,new Uint32Array([s?1:0])),this.run("rope",[c,this.buf(e,u),l],[Math.ceil(r/ee),1,1],l,e.byteLength)}async ropeFactors(e,r,t,n,a,i=0,s=1e4,o=!1){let u=globalThis,c=u.GPUBufferUsage.STORAGE|u.GPUBufferUsage.COPY_DST,l=this.device.createBuffer({size:32,usage:u.GPUBufferUsage.UNIFORM|u.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(l,0,new Uint32Array([t,n,a,i])),this.device.queue.writeBuffer(l,16,new Float32Array([s]));let d=this.device.createBuffer({size:r.byteLength,usage:c});this.device.queue.writeBuffer(d,0,r);let g=this.device.createBuffer({size:e.byteLength,usage:c|u.GPUBufferUsage.COPY_SRC});return this.device.queue.writeBuffer(l,20,new Uint32Array([o?1:0])),this.run("rope_factors",[l,this.buf(e,c),d,g],[Math.ceil(t/ee),1,1],g,e.byteLength)}async ropeMrope(e,r,t,n,a,i,s=1e4){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:32,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([t,n,a,i[0],i[0]+i[1]])),this.device.queue.writeBuffer(c,20,new Float32Array([s]));let l=this.device.createBuffer({size:r.byteLength,usage:u});this.device.queue.writeBuffer(l,0,r);let d=this.device.createBuffer({size:e.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("rope_mrope",[c,this.buf(e,u),l,d],[Math.ceil(t/ee),1,1],d,e.byteLength)}async rope2d(e,r,t,n,a,i=1e4){let s=globalThis,o=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:32,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([t,n,a,0])),this.device.queue.writeBuffer(u,16,new Float32Array([i]));let c=this.device.createBuffer({size:r.byteLength,usage:o});this.device.queue.writeBuffer(c,0,r);let l=this.device.createBuffer({size:e.byteLength,usage:o|s.GPUBufferUsage.COPY_SRC});return this.run("rope_2d",[u,this.buf(e,o),c,l],[Math.ceil(t/ee),1,1],l,e.byteLength)}async attention(e,r,t,n,a,i,s,o=0,u,c=0,l=0){let d=globalThis,g=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,p=o+n,m=this.attnUniform(n,a,i,s,p,o,u??1/Math.sqrt(s),c,l),b=n*a*s*4,k=this.device.createBuffer({size:b,usage:g|d.GPUBufferUsage.COPY_SRC});return this.run("attention",[m,this.buf(e,g),this.buf(r,g),this.buf(t,g),k],[Math.ceil(n*a/ee),1,1],k,b)}async attentionDecode(e,r,t,n,a,i,s,o=0,u,c=0,l=0){let d=globalThis,g=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,p=o+n,m=this.attnUniform(n,a,i,s,p,o,u??1/Math.sqrt(s),c,l),b=n*a*s*4,k=this.device.createBuffer({size:b,usage:g|d.GPUBufferUsage.COPY_SRC});return this.run("attention_decode",[m,this.buf(e,g),this.buf(r,g),this.buf(t,g),k],[n*a,1,1],k,b)}async attentionPrefill(e,r,t,n,a,i,s,o=0,u,c=0,l=0){let d=globalThis,g=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,p=o+n,m=this.attnUniform(n,a,i,s,p,o,u??1/Math.sqrt(s),c,l),b=n*a*s*4,k=this.device.createBuffer({size:b,usage:g|d.GPUBufferUsage.COPY_SRC});return this.run("attention_prefill",[m,this.buf(e,g),this.buf(r,g),this.buf(t,g),k],[Math.ceil(n/4)*a,1,1],k,b)}async attentionFull(e,r,t,n,a,i,s,o,u,c=0){let l=globalThis,d=l.GPUBufferUsage.STORAGE|l.GPUBufferUsage.COPY_DST,g=this.device.createBuffer({size:32,usage:l.GPUBufferUsage.UNIFORM|l.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(g,0,new Uint32Array([n,a,i,s,o,0])),this.device.queue.writeBuffer(g,24,new Float32Array([u??1/Math.sqrt(s),c]));let p=n*a*s*4,m=this.device.createBuffer({size:p,usage:d|l.GPUBufferUsage.COPY_SRC});return this.run("attention_full",[g,this.buf(e,d),this.buf(r,d),this.buf(t,d),m],[Math.ceil(n*a/ee),1,1],m,p)}async attentionFullWg(e,r,t,n,a,i,s,o,u,c=0){let l=globalThis,d=l.GPUBufferUsage.STORAGE|l.GPUBufferUsage.COPY_DST,g=this.device.createBuffer({size:32,usage:l.GPUBufferUsage.UNIFORM|l.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(g,0,new Uint32Array([n,a,i,s,o,0])),this.device.queue.writeBuffer(g,24,new Float32Array([u??1/Math.sqrt(s),c]));let p=n*a*s*4,m=this.device.createBuffer({size:p,usage:d|l.GPUBufferUsage.COPY_SRC});return this.run("attention_full_wg",[g,this.buf(e,d),this.buf(r,d),this.buf(t,d),m],[n*a,1,1],m,p)}async quantizeKvReadback(e,r,t,n){let a=globalThis,i=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST|a.GPUBufferUsage.COPY_SRC,s=t*n,o=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([r,t,n,0]));let u=this.device.createBuffer({size:r*s,usage:i}),c=this.device.createBuffer({size:r*t*4,usage:i});this.dispatch("quantize_kv",[o,this.buf(e,i),u,c],this.grid1D(r*t));let l=await this.readBack(u,r*s),d=new Uint32Array(l.buffer,0,r*s/4),g=await this.readBack(c,r*t*4);return u.destroy?.(),c.destroy?.(),{codes:d,scales:g}}async attentionQ8Kv(e,r,t,n,a,i,s,o,u,c=0,l,d=0,g=0){let p=globalThis,m=p.GPUBufferUsage.STORAGE|p.GPUBufferUsage.COPY_DST,b=c+i,k=this.attnUniform(i,s,o,u,b,c,l??1/Math.sqrt(u),d,g),B=i*s*u*4,M=this.device.createBuffer({size:B,usage:m|p.GPUBufferUsage.COPY_SRC});return this.run("attention_q8kv",[k,this.buf(e,m),this.bufU32(r,m),this.buf(t,m),this.bufU32(n,m),this.buf(a,m),M],[Math.ceil(i*s/ee),1,1],M,B)}async attentionQ8KvDecode(e,r,t,n,a,i,s,o,u,c=0,l,d=0,g=0){let p=globalThis,m=p.GPUBufferUsage.STORAGE|p.GPUBufferUsage.COPY_DST,b=c+i,k=this.attnUniform(i,s,o,u,b,c,l??1/Math.sqrt(u),d,g),B=i*s*u*4,M=this.device.createBuffer({size:B,usage:m|p.GPUBufferUsage.COPY_SRC});return this.run("attention_decode_q8kv",[k,this.buf(e,m),this.bufU32(r,m),this.buf(t,m),this.bufU32(n,m),this.buf(a,m),M],[i*s,1,1],M,B)}async attentionQ8KvPrefill(e,r,t,n,a,i,s,o,u,c=0,l,d=0,g=0){let p=globalThis,m=p.GPUBufferUsage.STORAGE|p.GPUBufferUsage.COPY_DST,b=c+i,k=this.attnUniform(i,s,o,u,b,c,l??1/Math.sqrt(u),d,g),B=i*s*u*4,M=this.device.createBuffer({size:B,usage:m|p.GPUBufferUsage.COPY_SRC});return this.run("attention_prefill_q8kv",[k,this.buf(e,m),this.bufU32(r,m),this.buf(t,m),this.bufU32(n,m),this.buf(a,m),M],[Math.ceil(i/4)*s,1,1],M,B)}async addBias(e,r,t,n){let a=globalThis,i=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,s=this.device.createBuffer({size:8,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(s,0,new Uint32Array([t,n]));let o=this.device.createBuffer({size:e.byteLength,usage:i|a.GPUBufferUsage.COPY_SRC});return this.run("addbias",[s,this.buf(e,i),this.buf(r,i),o],this.grid1D(e.length),o,e.byteLength)}async dequantBlocked(e,r,t,n){let a=globalThis,i=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,s=t/n;if(!Number.isInteger(s))throw new Error(`${e}: nElems ${t} not a multiple of ${n}`);let o=r.byteLength%4===0?r:(()=>{let d=new Uint8Array(Math.ceil(r.byteLength/4)*4);return d.set(r),d})(),u=new Uint32Array(o.buffer,o.byteOffset,o.byteLength/4),c=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s]));let l=this.device.createBuffer({size:t*4,usage:i|a.GPUBufferUsage.COPY_SRC});return this.run(e,[c,this.bufU32(u,i),l],this.grid1D(s),l,t*4)}async dequantizeQ4K(e,r){return this.dequantBlocked("dequant_q4k",e,r,256)}async dequantizeByType(e,r,t){if(e==="F32")return new Float32Array(r.buffer,r.byteOffset,t);if(e==="F16"){let i=new DataView(r.buffer,r.byteOffset),s=new Float32Array(t);for(let o=0;o<t;o++)s[o]=me(i.getUint16(o*2,!0));return s}if(e==="Q4W")return ge(Ue(r,t));if(e==="Q8W")return pe(qe(r,t));if(e==="Q3W")return We(ut(r,t));let n=X.DEQUANT_SHADER[e],a=X.BLOCK_ELEMS[e];if(!n||!a)throw new Error(`dequant: unsupported GGML type ${e}`);return this.dequantBlocked(n,r,t,a)}dequantBlockedGpu(e,r,t,n){let a=globalThis,i=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,s=t/n;if(!Number.isInteger(s))throw new Error(`${e}: nElems ${t} not a multiple of ${n}`);let o=r.byteLength%4===0?r:(()=>{let d=new Uint8Array(Math.ceil(r.byteLength/4)*4);return d.set(r),d})(),u=new Uint32Array(o.buffer,o.byteOffset,o.byteLength/4),c=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s]));let l=this.device.createBuffer({size:t*4,usage:i});return this.dispatch(e,[c,this.bufU32(u,i),l],this.grid1D(s)),l}dequantizeToGpu(e,r,t){let n=globalThis,a=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST;if(e==="F32")return this.buf(new Float32Array(r.buffer,r.byteOffset,t),a);if(e==="F16"){let o=new DataView(r.buffer,r.byteOffset),u=new Float32Array(t);for(let c=0;c<t;c++)u[c]=me(o.getUint16(c*2,!0));return this.buf(u,a)}if(e==="Q4W")return this.buf(ge(Ue(r,t)),a);if(e==="Q8W")return this.buf(pe(qe(r,t)),a);if(e==="Q3W")return this.buf(We(ut(r,t)),a);let i=X.DEQUANT_SHADER[e],s=X.BLOCK_ELEMS[e];if(!i||!s)throw new Error(`dequant: unsupported GGML type ${e}`);return this.dequantBlockedGpu(i,r,t,s)}async layerForward(e,r,t,n=!1){let{seq:a,d:i,nHeads:s,nKvHeads:o,headDim:u,ffn:c,ropeTheta:l,eps:d}=r,g=o*u,p=n?(q,O,D,T,R)=>this.matmulT(q,O,D,T,R):(q,O,D,T,R)=>this.matmul(q,O,D,T,R),m=s*u,b=r.rmsGainOnePlus===!0,k=r.attnLogitSoftcap??0,B=(q,O)=>r.act==="gelu"?this.geglu(q,O):this.swiglu(q,O),M=await this.rmsnorm(e,t.attnNorm,a,i,d,b),F=await p(M,t.wq,a,i,m),C=await p(M,t.wk,a,i,g),K=await p(M,t.wv,a,i,g);t.bq&&(F=await this.addBias(F,t.bq,a,m)),t.bk&&(C=await this.addBias(C,t.bk,a,g)),t.bv&&(K=await this.addBias(K,t.bv,a,g)),t.qNorm&&(F=await this.rmsnorm(F,t.qNorm,a*s,u,d,b)),t.kNorm&&(C=await this.rmsnorm(C,t.kNorm,a*o,u,d,b));let A=await this.rope(F,a*s,u,s,0,l),w=await this.rope(C,a*o,u,o,0,l),v=await this.attention(A,w,K,a,s,o,u,0,r.attnScale,k),h=await p(v,t.wo,a,m,i);t.postAttnNorm&&(h=await this.rmsnorm(h,t.postAttnNorm,a,i,d,b));let G=await this.add(e,h),y=await this.rmsnorm(G,t.ffnNorm,a,i,d,b),P=await p(y,t.wgate,a,i,c),U=await p(y,t.wup,a,i,c),_=await B(P,U),x=await p(_,t.wdown,a,c,i);return t.postFfnNorm&&(x=await this.rmsnorm(x,t.postFfnNorm,a,i,d,b)),this.add(G,x)}async layerForwardKV(e,r,t,n,a,i,s=!1){let{seq:o,d:u,nHeads:c,nKvHeads:l,headDim:d,ffn:g,ropeTheta:p,eps:m}=r,b=l*d,k=s?($,V,Y,N,S)=>this.matmulT($,V,Y,N,S):($,V,Y,N,S)=>this.matmul($,V,Y,N,S),B=($,V)=>{let Y=new Float32Array($.length+V.length);return Y.set($),Y.set(V,$.length),Y},M=c*d,F=r.rmsGainOnePlus===!0,C=r.attnLogitSoftcap??0,K=($,V)=>r.act==="gelu"?this.geglu($,V):this.swiglu($,V),A=await this.rmsnorm(e,t.attnNorm,o,u,m,F),w=await k(A,t.wq,o,u,M),v=await k(A,t.wk,o,u,b),h=await k(A,t.wv,o,u,b);t.bq&&(w=await this.addBias(w,t.bq,o,M)),t.bk&&(v=await this.addBias(v,t.bk,o,b)),t.bv&&(h=await this.addBias(h,t.bv,o,b)),t.qNorm&&(w=await this.rmsnorm(w,t.qNorm,o*c,d,m,F)),t.kNorm&&(v=await this.rmsnorm(v,t.kNorm,o*l,d,m,F));let G=await this.rope(w,o*c,d,c,n,p),y=await this.rope(v,o*l,d,l,n,p),P=B(a,y),U=B(i,h),_=await this.attention(G,P,U,o,c,l,d,n,r.attnScale,C),x=await k(_,t.wo,o,M,u);t.postAttnNorm&&(x=await this.rmsnorm(x,t.postAttnNorm,o,u,m,F));let q=await this.add(e,x),O=await this.rmsnorm(q,t.ffnNorm,o,u,m,F),D=await k(O,t.wgate,o,u,g),T=await k(O,t.wup,o,u,g),R=await K(D,T),z=await k(R,t.wdown,o,g,u);return t.postFfnNorm&&(z=await this.rmsnorm(z,t.postFfnNorm,o,u,m,F)),{out:await this.add(q,z),k:P,v:U}}storage(e){let r=this.bufferPool.get(e);if(r&&r.length){let n=r.pop();return this.pooled.delete(n),n}let t=this.device.createBuffer({size:e,usage:X.STORAGE_USAGE});return this.poolSize.set(t,e),t}release(e){for(let r of e){if(!r)continue;let t=this.poolSize.get(r);if(t!==void 0){if(this.pooled.has(r))continue;this.pooled.add(r);let a=this.bufferPool.get(t);a||(a=[],this.bufferPool.set(t,a)),a.push(r);continue}let n=this.uniformSize.get(r);if(n!==void 0){if(this.pooled.has(r))continue;this.pooled.add(r);let a=this.uniformPool.get(n);a||(a=[],this.uniformPool.set(n,a)),a.push(r);continue}r.destroy?.()}}uploadGpu(e){return e instanceof Float32Array?this.buf(e,X.STORAGE_USAGE):this.f16ToF32Gpu(e.f16,e.n)}uploadGpuF16(e){let r=new Uint16Array(e.length);for(let t=0;t<e.length;t++)r[t]=Se(e[t]);return this.bufU16(r)}f32ToF16Gpu(e,r){let t=globalThis,n=Math.ceil(r/2),a=this.device.createBuffer({size:n*4,usage:X.STORAGE_USAGE}),i=this.device.createBuffer({size:16,usage:t.GPUBufferUsage.UNIFORM|t.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(i,0,new Uint32Array([n])),this.dispatch("packf16",[i,e,a],this.grid1D(n)),a}f32ToQ8Gpu(e,r){let t=globalThis,n=r/32,a=this.device.createBuffer({size:r,usage:X.STORAGE_USAGE}),i=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:X.STORAGE_USAGE}),s=this.device.createBuffer({size:16,usage:t.GPUBufferUsage.UNIFORM|t.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(s,0,new Uint32Array([n])),this.dispatch("quantize_q8",[s,e,a,i],this.grid1D(n)),{codes:a,sc:i}}f32ToQ4Gpu(e,r){let t=globalThis,n=r/32,a=this.device.createBuffer({size:r/2,usage:X.STORAGE_USAGE}),i=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:X.STORAGE_USAGE}),s=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:X.STORAGE_USAGE}),o=this.device.createBuffer({size:16,usage:t.GPUBufferUsage.UNIFORM|t.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(o,0,new Uint32Array([n])),this.dispatch("quantize_q4",[o,e,a,i,s],this.grid1D(n)),{nib:a,sc:i,mn:s}}uploadGpuRawF16(e){let r=Math.ceil(e.byteLength/4)*4,t=this.device.createBuffer({size:r,usage:X.STORAGE_USAGE});if(this.device.queue.writeBuffer(t,0,e,0,e.byteLength-e.byteLength%4),e.byteLength%4){let n=new Uint8Array(4);n.set(e.subarray(e.byteLength-e.byteLength%4)),this.device.queue.writeBuffer(t,e.byteLength-e.byteLength%4,n)}return t}bufU16(e){let r=this.device.createBuffer({size:e.byteLength,usage:X.STORAGE_USAGE});return this.device.queue.writeBuffer(r,0,e),r}uploadGpuRaw(e){let r=Math.ceil(e.byteLength/4)*4,t=this.device.createBuffer({size:r,usage:X.STORAGE_USAGE}),n=e.byteLength-e.byteLength%4;if(this.device.queue.writeBuffer(t,0,e,0,n),e.byteLength%4){let a=new Uint8Array(4);a.set(e.subarray(n)),this.device.queue.writeBuffer(t,n,a)}return t}async matmulQ4(e,r,t,n,a,i,s){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([a,i,s]));let l=this.device.createBuffer({size:a*s*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4",[c,this.buf(e,u),r,t,n,l],[Math.ceil(a/8),Math.ceil(s/8),1],l,a*s*4)}async matmulQ4Tiled(e,r,t,n,a,i,s){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([a,i,s]));let l=this.device.createBuffer({size:a*s*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_tiled",[c,this.buf(e,u),r,t,n,l],[Math.ceil(Math.ceil(a/4)/8),Math.ceil(s/8),1],l,a*s*4)}async matmulQ4Shared(e,r,t,n,a,i,s){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([a,i,s]));let l=this.device.createBuffer({size:a*s*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_shared",[c,this.buf(e,u),r,t,n,l],[Math.ceil(s/64),Math.ceil(a/32),1],l,a*s*4)}async matmulQ3(e,r,t,n,a,i,s,o){let u=globalThis,c=u.GPUBufferUsage.STORAGE|u.GPUBufferUsage.COPY_DST,l=this.device.createBuffer({size:16,usage:u.GPUBufferUsage.UNIFORM|u.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(l,0,new Uint32Array([i,s,o]));let d=this.device.createBuffer({size:i*o*4,usage:c|u.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q3",[l,this.buf(e,c),r,t,n,a,d],[Math.ceil(i/8),Math.ceil(o/8),1],d,i*o*4)}async rwkvWkv7(e,r,t,n,a,i,s,o,u){let c=globalThis,l=c.GPUBufferUsage.STORAGE|c.GPUBufferUsage.COPY_DST,d=this.device.createBuffer({size:8,usage:c.GPUBufferUsage.UNIFORM|c.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(d,0,new Uint32Array([o,u]));let g=this.device.createBuffer({size:e.byteLength,usage:l|c.GPUBufferUsage.COPY_SRC});this.device.queue.writeBuffer(g,0,e);let p=this.device.createBuffer({size:o*u*4,usage:l|c.GPUBufferUsage.COPY_SRC});this.dispatch("rwkv_wkv7",[d,this.buf(r,l),this.buf(t,l),this.buf(n,l),this.buf(a,l),this.buf(i,l),this.buf(s,l),g,p],this.grid1D(o*u));let m=await this.readBack(g,e.byteLength),b=await this.readBack(p,o*u*4);return g.destroy?.(),p.destroy?.(),{S:m,y:b}}async rwkvTokenShift(e,r,t,n){let a=globalThis,i=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,s=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(s,0,new Uint32Array([n]));let o=this.device.createBuffer({size:6*n*4,usage:i|a.GPUBufferUsage.COPY_SRC});this.dispatch("rwkv_token_shift",[s,this.buf(e,i),this.buf(r,i),this.buf(t,i),o],this.grid1D(n*6));let u=await this.readBack(o,6*n*4);return o.destroy?.(),u}async lfm2ShortConv(e,r,t,n,a){let i=globalThis,s=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([n,a]));let u=this.buf(r,s|i.GPUBufferUsage.COPY_SRC),c=this.device.createBuffer({size:n*4,usage:s|i.GPUBufferUsage.COPY_SRC});this.dispatch("lfm2_shortconv",[o,this.buf(e,s),this.buf(t,s),u,c],this.grid1D(n));let l=await this.readBack(c,n*4),d=await this.readBack(u,(a-1)*n*4);return c.destroy?.(),u.destroy?.(),{out:l,state:d}}async matmulQ8(e,r,t,n,a,i){let s=globalThis,o=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,a,i]));let c=this.device.createBuffer({size:n*i*4,usage:o|s.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8",[u,this.buf(e,o),r,t,c],[Math.ceil(n/8),Math.ceil(i/8),1],c,n*i*4)}async matmulQ8Tiled(e,r,t,n,a,i){let s=globalThis,o=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,a,i]));let c=this.device.createBuffer({size:n*i*4,usage:o|s.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_tiled",[u,this.buf(e,o),r,t,c],[Math.ceil(Math.ceil(n/4)/8),Math.ceil(i/8),1],c,n*i*4)}async matmulQ8Shared(e,r,t,n,a,i){let s=globalThis,o=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,a,i]));let c=this.device.createBuffer({size:n*i*4,usage:o|s.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_shared",[u,this.buf(e,o),r,t,c],[Math.ceil(i/64),Math.ceil(n/32),1],c,n*i*4)}async matmulQ8Shared2(e,r,t,n,a,i){let s=globalThis,o=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,a,i]));let c=this.device.createBuffer({size:n*i*4,usage:o|s.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_shared2",[u,this.buf(e,o),r,t,c],[Math.ceil(i/128),Math.ceil(n/64),1],c,n*i*4)}async matmulQ4Shared2(e,r,t,n,a,i,s){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([a,i,s]));let l=this.device.createBuffer({size:a*s*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_shared2",[c,this.buf(e,u),r,t,n,l],[Math.ceil(s/128),Math.ceil(a/64),1],l,a*s*4)}uniformOf(e){let r=globalThis,t=this.uniformPool.get(e);if(t&&t.length){let a=t.pop();return this.pooled.delete(a),a}let n=this.device.createBuffer({size:e,usage:r.GPUBufferUsage.UNIFORM|r.GPUBufferUsage.COPY_DST});return this.uniformSize.set(n,e),n}uniform(e,r){let t=this.uniformOf(32);if(this.device.queue.writeBuffer(t,0,new Uint32Array(e)),r){let n=Array.isArray(r.value)?r.value:[r.value];this.device.queue.writeBuffer(t,r.offset,new Float32Array(n))}return t}attnUniform(e,r,t,n,a,i,s,o,u){let c=this.uniformOf(48);return this.device.queue.writeBuffer(c,0,new Uint32Array([e,r,t,n,a,i])),this.device.queue.writeBuffer(c,24,new Float32Array([s,o])),this.device.queue.writeBuffer(c,32,new Uint32Array([u])),c}recMatmulT(e,r,t,n,a,i,s,o=!1){let u=this.uniform([a,i,s]),c=this.storage(a*s*4),l=this.matmulTPlan(a,i,s,o);return this.recordPass(e,l.shader,[u,t,n,c],l.grid),r.push(u,c),c}recConv2dDirect(e,r,t,n,a,i,s,o,u,c,l,d,g){let p=Math.floor((s+2*g-c)/d)+1,m=Math.floor((o+2*g-l)/d)+1,b=u*p*m,k=this.uniformOf(48);if(this.device.queue.writeBuffer(k,0,new Uint32Array([i,s,o,u,c,l,d,g,p,m])),c===3&&l===3&&d===1&&g===1&&this.convTiledOk){let M=this.storage(b*4);return this.recordPass(e,"conv2d_3x3_tiled",[k,t,n,a,M],[Math.ceil(m/16),Math.ceil(p/16),u]),r.push(k,M),M}let B=this.storage(b*4);return this.recordPass(e,"conv2d_direct",[k,t,n,a,B],this.grid1D(b)),r.push(k,B),B}recConv2dDirectQ8(e,r,t,n,a,i,s,o,u,c,l,d,g){let p=Math.floor((s+2*g-c)/d)+1,m=Math.floor((o+2*g-l)/d)+1,b=u*p*m,k=this.uniformOf(48);this.device.queue.writeBuffer(k,0,new Uint32Array([i,s,o,u,c,l,d,g,p,m]));let B=this.storage(b*4);return this.recordPass(e,"conv2d_direct_q8",[k,t,n.codes,n.sc,a,B],this.grid1D(b)),r.push(k,B),B}recConv2dDirectQ4(e,r,t,n,a,i,s,o,u,c,l,d,g){let p=Math.floor((s+2*g-c)/d)+1,m=Math.floor((o+2*g-l)/d)+1,b=u*p*m,k=this.uniformOf(48);this.device.queue.writeBuffer(k,0,new Uint32Array([i,s,o,u,c,l,d,g,p,m]));let B=this.storage(b*4);return this.recordPass(e,"conv2d_direct_q4",[k,t,n.nib,n.sc,n.mn,a,B],this.grid1D(b)),r.push(k,B),B}recGroupNorm(e,r,t,n,a,i,s,o,u){let c=this.uniform([i,s,o],{offset:12,value:u}),l=this.storage(i*s*4);return this.recordPass(e,"group_norm",[c,t,n,a,l],[o,1,1]),r.push(c,l),l}recUnary(e,r,t,n,a){let i=this.storage(a*4);return this.recordPass(e,t,[n,i],this.grid1D(a)),r.push(i),i}recLayernorm(e,r,t,n,a,i,s,o){let u=this.uniform([i,s],{offset:8,value:o}),c=this.storage(i*s*4);return this.recordPass(e,"layernorm",[u,t,n,a,c],[Math.ceil(i/ee),1,1]),r.push(u,c),c}recAttentionFull(e,r,t,n,a,i,s,o,u,c,l){let d=this.uniform([i,s,o,u,c,0],{offset:24,value:[l??1/Math.sqrt(u),0]}),g=this.storage(i*s*u*4),p=i*s;return this.attnFullWgOk&&u<=192&&p<=65535?this.recordPass(e,"attention_full_wg",[d,t,n,a,g],[p,1,1]):this.recordPass(e,"attention_full",[d,t,n,a,g],[Math.ceil(p/ee),1,1]),r.push(d,g),g}recUpsample(e,r,t,n,a,i,s){let o=this.uniform([n,a,i,s]),u=n*(a*s)*(i*s),c=this.storage(u*4);return this.recordPass(e,"upsample_nearest",[o,t,c],this.grid1D(u)),r.push(o,c),c}recConcat(e,r,t,n,a,i,s){let o=this.storage((a+i)*s*4);return e.copyBufferToBuffer(t,0,o,0,a*s*4),e.copyBufferToBuffer(n,0,o,a*s*4,i*s*4),r.push(o),o}recAddChannelBias(e,r,t,n,a,i){let s=this.uniform([a,i]),o=this.storage(a*i*4);return this.recordPass(e,"add_channel_bias",[s,t,n,o],this.grid1D(a*i)),r.push(s,o),o}recTranspose(e,r,t,n,a){let i=this.uniform([n,a]),s=this.storage(n*a*4);return this.recordPass(e,"transpose2d",[i,t,s],this.grid1D(n*a)),r.push(i,s),s}recGegluSplit(e,r,t,n,a){let i=this.uniform([n,a]),s=this.storage(n*a*4);return this.recordPass(e,"geglu_split",[i,t,s],this.grid1D(n*a)),r.push(i,s),s}recVideoGather(e,r,t,n,a,i){let s=this.uniform([n,a,i]),o=this.storage(i*n*a*4);return this.recordPass(e,"video_motion_gather",[s,t,o],this.grid1D(i*n*a)),r.push(s,o),o}recVideoScatter(e,r,t,n,a,i,s){let o=this.uniform([a,i,s]),u=this.storage(a*i*s*4);return this.recordPass(e,"video_motion_scatter",[o,t,n,u],this.grid1D(a*i*s)),r.push(o,u),u}recVideoAddPe(e,r,t,n,a,i,s){let o=this.uniform([a,i,s]),u=this.storage(s*a*i*4);return this.recordPass(e,"video_add_pe",[o,t,n,u],this.grid1D(s*a*i)),r.push(o,u),u}recAttnTemporal(e,r,t,n,a,i,s,o,u){let c=this.uniform([i,s,o,u],{offset:16,value:1/Math.sqrt(u)}),l=this.storage(i*s*o*u*4);return this.recordPass(e,"attn_temporal",[c,t,n,a,l],this.grid1D(i*s*o)),r.push(c,l),l}recordingSession(){let e=this.device.createCommandEncoder(),r=[],t=n=>{if(n instanceof Float32Array){let a=this.uploadGpu(n);return r.push(a),a}return n};return{conv2d:(n,a,i,s,o,u,c,l,d,g,p)=>a&&a.nib?this.recConv2dDirectQ4(e,r,t(n),a,t(i),s,o,u,c,l,d,g,p):a&&a.codes?this.recConv2dDirectQ8(e,r,t(n),a,t(i),s,o,u,c,l,d,g,p):this.recConv2dDirect(e,r,t(n),t(a),t(i),s,o,u,c,l,d,g,p),groupNorm:(n,a,i,s,o,u,c)=>this.recGroupNorm(e,r,t(n),t(a),t(i),s,o,u,c),silu:(n,a)=>this.recUnary(e,r,"silu",t(n),a),quickGelu:(n,a)=>this.recUnary(e,r,"quick_gelu",t(n),a),gelu:(n,a)=>this.recUnary(e,r,"gelu",t(n),a),relu:(n,a)=>this.recUnary(e,r,"relu",t(n),a),add:(n,a,i)=>this.recBinary(e,r,"add",t(n),t(a),i),geglu:(n,a,i)=>this.recBinary(e,r,"geglu",t(n),t(a),i),matmulT:(n,a,i,s,o)=>this.recMM(e,r,t(n),a instanceof Float32Array?t(a):a,i,s,o,!1),addBias:(n,a,i,s)=>this.recAddBias(e,r,t(n),t(a),i,s),addChannelBias:(n,a,i,s)=>this.recAddChannelBias(e,r,t(n),t(a),i,s),attentionFull:(n,a,i,s,o,u,c,l)=>this.recAttentionFull(e,r,t(n),t(a),t(i),s,o,u,c,l),rope2d:(n,a,i,s,o,u)=>{let c=a instanceof Uint32Array?(()=>{let l=this.uploadGpuRaw(new Uint8Array(a.buffer,a.byteOffset,a.byteLength));return r.push(l),l})():a;return this.recRope2d(e,r,t(n),c,i,s,o,u)},attention:(n,a,i,s,o,u,c,l,d)=>this.recAttention(e,r,t(n),t(a),t(i),s,o,u,c,l,d),upsample:(n,a,i,s,o)=>this.recUpsample(e,r,t(n),a,i,s,o),layernorm:(n,a,i,s,o,u)=>this.recLayernorm(e,r,t(n),t(a),t(i),s,o,u),concat:(n,a,i,s,o)=>this.recConcat(e,r,t(n),t(a),i,s,o),transpose:(n,a,i)=>this.recTranspose(e,r,t(n),a,i),gegluSplit:(n,a,i)=>this.recGegluSplit(e,r,t(n),a,i),videoGather:(n,a,i,s)=>this.recVideoGather(e,r,t(n),a,i,s),videoScatter:(n,a,i,s,o)=>this.recVideoScatter(e,r,t(n),t(a),i,s,o),videoAddPe:(n,a,i,s,o)=>this.recVideoAddPe(e,r,t(n),t(a),i,s,o),attnTemporal:(n,a,i,s,o,u,c)=>this.recAttnTemporal(e,r,t(n),t(a),t(i),s,o,u,c),alloc:n=>{let a=this.storage(n);return r.push(a),a},copy:(n,a,i,s,o)=>{e.copyBufferToBuffer(i,s,n,a,o)},finish:async(n,a)=>{this.device.queue.submit([e.finish()]);let i=await this.readBack(n,a*4);return this.release(r),i},finishKeep:n=>{this.device.queue.submit([e.finish()]);let a=r.indexOf(n);return a>=0&&r.splice(a,1),this.release(r),n},finishKeepMany:n=>{this.device.queue.submit([e.finish()]);for(let a of n){let i=r.indexOf(a);i>=0&&r.splice(i,1)}return this.release(r),n}}}readGpu(e,r){return this.readBack(e,r*4)}trimPool(e=64<<20){let r=[...this.bufferPool.keys()].sort((n,a)=>a-n),t=0;for(let n of this.bufferPool.values())for(let a of n)t+=this.poolSize.get(a)??0;for(let n of r){let a=this.bufferPool.get(n);for(;a.length&&t>e;){let i=a.pop();this.pooled.delete(i),this.poolSize.delete(i),i.destroy?.(),t-=n}}}releaseGpu(e){this.release(e)}waitGpu(){return this.device.queue.onSubmittedWorkDone()}async benchMatmul(e,r,t,n,a,i={}){let{iters:s=10,shared:o=!0,shared2:u=!0,wF16:c=!1}=i,l=this.f16SharedOk,d=this.qSharedOk,g=this.qShared2Ok;this.f16SharedOk=o,this.qSharedOk=o,this.qShared2Ok=o&&u;let p=this.uploadGpu(e),m=[],b=this.device.createCommandEncoder();this.recMM(b,m,p,r,t,n,a,c),this.device.queue.submit([b.finish()]),await this.device.queue.onSubmittedWorkDone();let k=this.device.createCommandEncoder();for(let F=0;F<s;F++)this.recMM(k,m,p,r,t,n,a,c);let B=performance.now();this.device.queue.submit([k.finish()]),await this.device.queue.onSubmittedWorkDone();let M=(performance.now()-B)/s;return this.release(m),p.destroy?.(),this.f16SharedOk=l,this.qSharedOk=d,this.qShared2Ok=g,M}destroy(){try{this.profiler?.destroy()}catch{}this.profiler=null;try{this.device?.destroy?.()}catch{}this.bufferPool.clear(),this.uniformPool.clear()}f16ToF32Gpu(e,r){let t=this.uploadGpuRawF16(e),n=this.device.createBuffer({size:r*4,usage:X.STORAGE_USAGE}),a=this.uniformOf(16);return this.device.queue.writeBuffer(a,0,new Uint32Array([r])),this.dispatch("f16_to_f32",[a,t,n],this.grid1D(Math.ceil(r/2))),t.destroy?.(),this.release([a]),n}quantizeQ8Gpu(e){let r=e instanceof Float32Array?e.length:e.n;if(r%32!==0)return this.uploadGpu(e);let t=e instanceof Float32Array?this.buf(e,X.STORAGE_USAGE):this.f16ToF32Gpu(e.f16,r),n=this.f32ToQ8Gpu(t,r);return t.destroy?.(),n}async validateResidentOps(){let e=globalThis,r=G=>Float32Array.from({length:G},()=>(Math.random()*2-1)*.5),t=(G,y,P=.005)=>G.length===y.length&&G.every((U,_)=>Math.abs(U-y[_])<=P*(1+Math.abs(y[_]))),n=4,a=4,i=4,s=4,o=2,u=1e-5,c=s*a*i,l=r(n*a*i),d=r(s*n*9),g=r(s),p=r(s),m=r(s),b=await this.silu(await this.groupNorm(await this.conv2dDirect(l,d,g,n,a,i,s,3,3,1,1),p,m,s,a*i,o,u)),k=[],B=this.device.createCommandEncoder(),M=this.uploadGpu(l),F=this.uploadGpu(d),C=this.uploadGpu(g),K=this.uploadGpu(p),A=this.uploadGpu(m);k.push(M,F,C,K,A);let w=this.recConv2dDirect(B,k,M,F,C,n,a,i,s,3,3,1,1);w=this.recGroupNorm(B,k,w,K,A,s,a*i,o,u),w=this.recUnary(B,k,"silu",w,c);let v=this.device.createBuffer({size:c*4,usage:e.GPUBufferUsage.COPY_DST|e.GPUBufferUsage.MAP_READ});B.copyBufferToBuffer(w,0,v,0,c*4),this.device.queue.submit([B.finish()]),await v.mapAsync(e.GPUMapMode.READ);let h=new Float32Array(v.getMappedRange().slice(0));return v.unmap(),v.destroy(),this.release(k),t(h,b)?null:"resident_ops"}recMatmulQ4(e,r,t,n,a,i,s){let o=this.uniform([a,i,s]),u=this.storage(a*s*4);if(a===1&&this.gemvOk){let c=this.gemvGrid(s);this.recordPass(e,"matmul_t_q4_vec",[this.uniform([a,i,s,c.stride]),t,n.nib,n.sc,n.mn,u],c.grid)}else a>=64&&this.qSharedOk&&this.qShared2Ok?this.recordPass(e,"matmul_t_q4_shared2",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(s/128),Math.ceil(a/64),1]):a>=32&&this.qSharedOk?this.recordPass(e,"matmul_t_q4_shared",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(s/64),Math.ceil(a/32),1]):a>=2?this.recordPass(e,"matmul_t_q4_tiled",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(Math.ceil(a/4)/8),Math.ceil(s/8),1]):this.recordPass(e,"matmul_t_q4",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(a/8),Math.ceil(s/8),1]);return r.push(o,u),u}recMatmulQ8(e,r,t,n,a,i,s){let o=this.uniform([a,i,s]),u=this.storage(a*s*4);if(a===1&&this.gemvOk){let c=this.gemvGrid(s);this.recordPass(e,"matmul_t_q8_vec",[this.uniform([a,i,s,c.stride]),t,n.codes,n.sc,u],c.grid)}else a>=64&&this.qSharedOk&&this.qShared2Ok?this.recordPass(e,"matmul_t_q8_shared2",[o,t,n.codes,n.sc,u],[Math.ceil(s/128),Math.ceil(a/64),1]):a>=32&&this.qSharedOk?this.recordPass(e,"matmul_t_q8_shared",[o,t,n.codes,n.sc,u],[Math.ceil(s/64),Math.ceil(a/32),1]):a>=2?this.recordPass(e,"matmul_t_q8_tiled",[o,t,n.codes,n.sc,u],[Math.ceil(Math.ceil(a/4)/8),Math.ceil(s/8),1]):this.recordPass(e,"matmul_t_q8",[o,t,n.codes,n.sc,u],[Math.ceil(a/8),Math.ceil(s/8),1]);return r.push(o,u),u}gemvGrid(e){return e<=32768?{grid:[e,1,1],stride:32768}:{grid:[32768,Math.ceil(e/32768),1],stride:32768}}async matmulQ4Vec(e,r,t,n,a,i){let s=globalThis,o=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,u=this.gemvGrid(i),c=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([1,a,i,u.stride]));let l=this.device.createBuffer({size:i*4,usage:o|s.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_vec",[c,this.buf(e,o),r,t,n,l],u.grid,l,i*4)}async matmulQ8Vec(e,r,t,n,a){let i=globalThis,s=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=this.gemvGrid(a),u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([1,n,a,o.stride]));let c=this.device.createBuffer({size:a*4,usage:s|i.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_vec",[u,this.buf(e,s),r,t,c],o.grid,c,a*4)}recMatmulQ3(e,r,t,n,a,i,s){let o=this.uniform([a,i,s]),u=this.storage(a*s*4);return this.recordPass(e,"matmul_t_q3",[o,t,n.lo,n.hi,n.sc,n.mn,u],[Math.ceil(a/8),Math.ceil(s/8),1]),r.push(o,u),u}recMM(e,r,t,n,a,i,s,o){return n&&n.q3?this.recMatmulQ3(e,r,t,n,a,i,s):n&&n.nib?this.recMatmulQ4(e,r,t,n,a,i,s):n&&n.codes?this.recMatmulQ8(e,r,t,n,a,i,s):this.recMatmulT(e,r,t,n,a,i,s,o)}recRmsnorm(e,r,t,n,a,i,s,o=!1){let u=this.uniform([a,i,0,o?1:0],{offset:8,value:s}),c=this.storage(a*i*4);return this.rmsVecOk&&a<=65535?this.recordPass(e,"rmsnorm_vec",[u,t,n,c],[a,1,1]):this.recordPass(e,"rmsnorm",[u,t,n,c],[Math.ceil(a/ee),1,1]),r.push(u,c),c}recRope(e,r,t,n,a,i,s,o,u=!1){let c=this.uniform([n,a,i,s],{offset:16,value:o});this.device.queue.writeBuffer(c,20,new Uint32Array([u?1:0]));let l=this.storage(n*a*4);return this.recordPass(e,"rope",[c,t,l],[Math.ceil(n/ee),1,1]),r.push(c,l),l}recRopeMrope(e,r,t,n,a,i,s,o,u){let c=u[0],l=u[0]+u[1],d=this.uniform([a,i,s,c,l],{offset:20,value:o}),g=this.storage(a*i*4);return this.recordPass(e,"rope_mrope",[d,t,n,g],[Math.ceil(a/ee),1,1]),r.push(d,g),g}preparePositions(e,r){if(e.positions&&e.mropeSections){let t=this.storage(e.positions.byteLength);this.device.queue.writeBuffer(t,0,e.positions),r.push(t),e._posGpu=t}if(e.ropeFactors){let t=this.storage(e.ropeFactors.byteLength);this.device.queue.writeBuffer(t,0,e.ropeFactors),r.push(t),e._ffGpu=t}}recRope2d(e,r,t,n,a,i,s,o){let u=this.uniform([a,i,s,0],{offset:16,value:o}),c=this.storage(a*i*4);return this.recordPass(e,"rope_2d",[u,t,n,c],[Math.ceil(a/ee),1,1]),r.push(u,c),c}recRopeFactors(e,r,t,n,a,i,s,o,u,c=!1){let l=this.uniform([a,i,s,o],{offset:16,value:u});this.device.queue.writeBuffer(l,20,new Uint32Array([c?1:0]));let d=this.storage(a*i*4);return this.recordPass(e,"rope_factors",[l,t,n,d],[Math.ceil(a/ee),1,1]),r.push(l,d),d}recAttention(e,r,t,n,a,i,s,o,u,c,l,d,g=0,p=0){let m=this.attnUniform(i,s,o,u,c,l,d??1/Math.sqrt(u),g,p),b=this.storage(i*s*u*4);return this.attnDecodeOk&&i*s<256&&u<=128?this.recordPass(e,"attention_decode",[m,t,n,a,b],[i*s,1,1]):this.attnPrefillOk&&u<=128?this.recordPass(e,"attention_prefill",[m,t,n,a,b],[Math.ceil(i/4)*s,1,1]):this.recordPass(e,"attention",[m,t,n,a,b],[Math.ceil(i*s/ee),1,1]),r.push(m,b),b}recQuantizeKv(e,r,t,n,a,i,s,o,u){let c=this.uniform([i,s,o,u]);this.recordPass(e,"quantize_kv",[c,t,n,a],this.grid1D(i*s)),r.push(c)}recAttentionQ8(e,r,t,n,a,i,s,o,u,c,l,d,g,p,m=0,b=0){let k=this.attnUniform(o,u,c,l,d,g,p??1/Math.sqrt(l),m,b),B=this.storage(o*u*l*4);return this.attnDecodeOk&&o*u<256&&l<=128?this.recordPass(e,"attention_decode_q8kv",[k,t,n,a,i,s,B],[o*u,1,1]):this.attnPrefillOk&&l<=128?this.recordPass(e,"attention_prefill_q8kv",[k,t,n,a,i,s,B],[Math.ceil(o/4)*u,1,1]):this.recordPass(e,"attention_q8kv",[k,t,n,a,i,s,B],[Math.ceil(o*u/ee),1,1]),r.push(k,B),B}recAddBias(e,r,t,n,a,i){let s=this.uniform([a,i]),o=this.storage(a*i*4);return this.recordPass(e,"addbias",[s,t,n,o],this.grid1D(a*i)),r.push(s,o),o}recBinary(e,r,t,n,a,i){let s=this.storage(i*4);return this.recordPass(e,t,[n,a,s],this.grid1D(i)),r.push(s),s}recLfm2ShortConv(e,r,t,n,a,i,s){let o=this.uniform([i,s]),u=this.storage(i*4);return this.recordPass(e,"lfm2_shortconv",[o,t,a,n,u],this.grid1D(i)),r.push(o,u),u}recordLayerKV(e,r,t,n,a,i,s){let o=s.k,u=s.v,{seq:c,d:l,nHeads:d,nKvHeads:g,headDim:p,ffn:m,ropeTheta:b,eps:k}=n,B=g*p,M=i+c,F=a.matF16===!0,C=d*p,K=n.rmsGainOnePlus===!0,A=n.attnLogitSoftcap??0,w=n.act==="gelu"?"geglu":"swiglu",v=this.recRmsnorm(e,r,t,a.attnNorm,c,l,k,K),h=this.recMM(e,r,v,a.wq,c,l,C,F),G=this.recMM(e,r,v,a.wk,c,l,B,F),y=this.recMM(e,r,v,a.wv,c,l,B,F);a.bq&&(h=this.recAddBias(e,r,h,a.bq,c,C)),a.bk&&(G=this.recAddBias(e,r,G,a.bk,c,B)),a.bv&&(y=this.recAddBias(e,r,y,a.bv,c,B)),a.qNorm&&(h=this.recRmsnorm(e,r,h,a.qNorm,c*d,p,k,K)),a.kNorm&&(G=this.recRmsnorm(e,r,G,a.kNorm,c*g,p,k,K));let P=n._posGpu,U=n._ffGpu,_=n.ropeInterleaved===!0,x=(N,S,L)=>n.skipRope?N:P?this.recRopeMrope(e,r,N,P,S,p,L,b,n.mropeSections):U?this.recRopeFactors(e,r,N,U,S,p,L,i,b,_):this.recRope(e,r,N,S,p,L,i,b,_),q=x(h,c*d,d),O=x(G,c*g,g),D;if(s.kScale)this.recQuantizeKv(e,r,O,o,s.kScale,c,g,p,i),this.recQuantizeKv(e,r,y,u,s.vScale,c,g,p,i),D=this.recAttentionQ8(e,r,q,o,s.kScale,u,s.vScale,c,d,g,p,M,i,n.attnScale,A,n.window??0);else{let N=B*4;e.copyBufferToBuffer(O,0,o,i*N,c*N),e.copyBufferToBuffer(y,0,u,i*N,c*N),D=this.recAttention(e,r,q,o,u,c,d,g,p,M,i,n.attnScale,A,n.window??0)}let T=this.recMM(e,r,D,a.wo,c,C,l,F);a.postAttnNorm&&(T=this.recRmsnorm(e,r,T,a.postAttnNorm,c,l,k,K));let R=this.recBinary(e,r,"add",t,T,c*l),z=this.recRmsnorm(e,r,R,a.ffnNorm,c,l,k,K),Q=this.recMM(e,r,z,a.wgate,c,l,m,F),$=this.recMM(e,r,z,a.wup,c,l,m,F),V=this.recBinary(e,r,w,Q,$,c*m),Y=this.recMM(e,r,V,a.wdown,c,m,l,F);return a.postFfnNorm&&(Y=this.recRmsnorm(e,r,Y,a.postFfnNorm,c,l,k,K)),this.recBinary(e,r,"add",R,Y,c*l)}setKvQuant(e){this.kvQuant!==e&&(this.kvQuant=e,this.resetKvGpu())}resetKvGpu(){for(let e of this.kvGpu.values())e.k.destroy?.(),e.v.destroy?.(),e.kScale?.destroy?.(),e.vScale?.destroy?.();this.kvGpu.clear(),this.kvSession="";for(let e of this.bufferPool.values())for(let r of e)r.destroy?.();this.bufferPool.clear()}clearKvCache(){this.resetKvGpu()}ensureKv(e,r,t,n){let a=this.kvGpu.get(e);if(a&&a.cap>=r)return a;let i=Math.max(r,(a?.cap??0)+1024,1024),s=this.kvQuant,o=this.storage(i*t*(s?1:4)),u=this.storage(i*t*(s?1:4)),c=s?this.storage(i*n*4):void 0,l=s?this.storage(i*n*4):void 0;if(a){let g=this.device.createCommandEncoder();g.copyBufferToBuffer(a.k,0,o,0,a.cap*t*(s?1:4)),g.copyBufferToBuffer(a.v,0,u,0,a.cap*t*(s?1:4)),s&&a.kScale&&(g.copyBufferToBuffer(a.kScale,0,c,0,a.cap*n*4),g.copyBufferToBuffer(a.vScale,0,l,0,a.cap*n*4)),this.device.queue.submit([g.finish()]),a.k.destroy?.(),a.v.destroy?.(),a.kScale?.destroy?.(),a.vScale?.destroy?.()}let d={k:o,v:u,cap:i,kScale:c,vScale:l};return this.kvGpu.set(e,d),d}async runDecodeGpu(e,r,t,n,a,i){let{seq:s,d:o,nKvHeads:u,headDim:c,eps:l}=r,d=u*c,g=n+s;(i!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${i}" inconnue avec pastLen=${n} \u2014 cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=i);for(let F=0;F<t.length;F++)this.ensureKv(F,g,d,u);let p=[];this.preparePositions(r,p);let m=this.device.createCommandEncoder(),b=this.storage(e.byteLength);this.device.queue.writeBuffer(b,0,e),p.push(b);for(let F=0;F<t.length;F++){let C=this.kvGpu.get(F);b=this.recordLayerKV(m,p,b,lt(r,s,F,this.swaOk),t[F],n,C)}let k=this.recRmsnorm(m,p,b,a,s,o,l,r.rmsGainOnePlus===!0),B=this.storage(o*4);m.copyBufferToBuffer(k,(s-1)*o*4,B,0,o*4),this.device.queue.submit([m.finish()]);let M=await this.readBack(B,o*4);return p.push(B),this.release(p),M}async decodeLogitsQ8(e,r,t,n,a,i,s,o){let u=globalThis,{seq:c,d:l,nKvHeads:d,headDim:g,eps:p}=r,m=d*g,b=n+c;(i!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${i}" inconnue avec pastLen=${n} \u2014 cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=i);for(let v=0;v<t.length;v++)this.ensureKv(v,b,m,d);let k=[];this.preparePositions(r,k);let B=this.device.createCommandEncoder(),M=this.storage(e.byteLength);this.device.queue.writeBuffer(M,0,e),k.push(M);for(let v=0;v<t.length;v++){let h=this.kvGpu.get(v);M=this.recordLayerKV(B,k,M,lt(r,c,v,this.swaOk),t[v],n,h)}let F=this.recRmsnorm(B,k,M,a,c,l,p,r.rmsGainOnePlus===!0),C=this.storage(l*4);B.copyBufferToBuffer(F,(c-1)*l*4,C,0,l*4),k.push(C);let K=this.storage(o*4);k.push(K);for(let v of s){let h=this.recMM(B,k,C,v.w,1,l,v.rows,!1);B.copyBufferToBuffer(h,0,K,v.r0*4,v.rows*4)}let A=this.device.createBuffer({size:o*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});B.copyBufferToBuffer(K,0,A,0,o*4),this.device.queue.submit([B.finish()]),await A.mapAsync(u.GPUMapMode.READ);let w=new Float32Array(A.getMappedRange().slice(0));return A.unmap(),A.destroy(),this.release(k),w}async decodeTopKQ8(e,r,t,n,a,i,s,o,u,c,l,d=64){let g=globalThis,{seq:p,d:m,nKvHeads:b,headDim:k,eps:B}=r,M=b*k,F=n+p;(i!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${i}" inconnue avec pastLen=${n} \u2014 cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=i);for(let x=0;x<t.length;x++)this.ensureKv(x,F,M,b);let C=X.timingOn?(x,q)=>console.info(`[timing:gpu] ${x} ${(performance.now()-q).toFixed(0)} ms`):null,K=performance.now(),A=[];this.preparePositions(r,A);let w=this.device.createCommandEncoder(),v=this.storage(e.byteLength);this.device.queue.writeBuffer(v,0,e),A.push(v);for(let x=0;x<t.length;x++){let q=this.kvGpu.get(x);v=this.recordLayerKV(w,A,v,lt(r,p,x,this.swaOk),t[x],n,q)}let h=this.recRmsnorm(w,A,v,a,p,m,B,r.rmsGainOnePlus===!0),G=this.storage(m*4);w.copyBufferToBuffer(h,(p-1)*m*4,G,0,m*4),A.push(G);let y=this.storage(o*4);A.push(y);for(let x of s){let q=this.recMM(w,A,G,x.w,1,m,x.rows,!1);w.copyBufferToBuffer(q,0,y,x.r0*4,x.rows*4)}if(l&&l>0){let x=this.uniform([o],{offset:4,value:l});this.recordPass(w,"softcap_logits",[x,y],this.grid1D(o)),A.push(x)}if(c&&c!==1&&u.length){let x=Uint32Array.from(u),q=this.bufU32(x,g.GPUBufferUsage.STORAGE|g.GPUBufferUsage.COPY_DST),O=this.uniform([x.length],{offset:4,value:c});this.recordPass(w,"penalize_logits",[O,q,y],this.grid1D(x.length)),A.push(O,q)}let P=this.storage(d*2*4);A.push(P);{let x=this.uniform([o,d]);this.recordPass(w,this.topKParOk?"top_k_par":"top_k",[x,y,P],[1,1,1]),A.push(x)}let U=this.device.createBuffer({size:d*2*4,usage:g.GPUBufferUsage.COPY_DST|g.GPUBufferUsage.MAP_READ});w.copyBufferToBuffer(P,0,U,0,d*2*4),C?.("enregistrement des passes (compilation des pipelines incluse)",K),K=performance.now(),this.device.queue.submit([w.finish()]),await U.mapAsync(g.GPUMapMode.READ),C?.("execution GPU (submit + readback)",K);let _=new Uint32Array(U.getMappedRange().slice(0));return U.unmap(),U.destroy(),this.release(A),{ids:_.slice(0,d),vals:new Float32Array(_.buffer,d*4,d)}}resetLfm2State(){for(let e of this.lfm2KvGpu.values())e.k.destroy?.(),e.v.destroy?.();for(let e of this.lfm2ConvGpu.values())e.destroy?.();this.lfm2KvGpu.clear(),this.lfm2ConvGpu.clear(),this.lfm2Session="";for(let e of this.bufferPool.values())for(let r of e)r.destroy?.();this.bufferPool.clear()}clearLfm2State(){this.resetLfm2State()}ensureLfm2Kv(e,r,t){let n=this.lfm2KvGpu.get(e);if(n&&n.cap>=r)return n;let a=Math.max(r,(n?.cap??0)+1024,1024),i=this.storage(a*t*4),s=this.storage(a*t*4);if(n){let u=this.device.createCommandEncoder();u.copyBufferToBuffer(n.k,0,i,0,n.cap*t*4),u.copyBufferToBuffer(n.v,0,s,0,n.cap*t*4),this.device.queue.submit([u.finish()]),n.k.destroy?.(),n.v.destroy?.()}let o={k:i,v:s,cap:a};return this.lfm2KvGpu.set(e,o),o}ensureLfm2Conv(e,r){let t=this.lfm2ConvGpu.get(e);return t||(t=this.storage(r*4),this.device.queue.writeBuffer(t,0,new Float32Array(r)),this.lfm2ConvGpu.set(e,t)),t}recLfm2ShortConvBatch(e,r,t,n,a,i,s,o){let u=this.uniform([i,s,o]),c=this.storage(o*i*4);this.recordPass(e,"lfm2_shortconv_batch",[u,t,a,n,c],this.grid1D(o*i));let l=this.uniform([i,s,o]);return this.recordPass(e,"lfm2_shortconv_state",[l,t,n],this.grid1D((s-1)*i)),r.push(u,l,c),c}recordLfm2(e,r,t,n,a,i,s,o){let{D:u,nHeads:c,nKvHeads:l,headDim:d,ffn:g,eps:p,theta:m,lc:b}=a,k=l*d,B=c*d,M=k*4;for(let C=0;C<i.length;C++)i[C].conv?this.ensureLfm2Conv(C,(b-1)*u):this.ensureLfm2Kv(C,o+n,k);if(n>=b-1&&this.lfm2BatchOk){let C=this.storage(n*u*4);this.device.queue.writeBuffer(C,0,t),r.push(C);for(let A=0;A<i.length;A++){let w=i[A],v=this.recRmsnorm(e,r,C,w.attnNorm,n,u,p),h;if(w.conv){let x=this.recMM(e,r,v,w.inProj,n,u,3*u,!1),q=this.recLfm2ShortConvBatch(e,r,x,this.lfm2ConvGpu.get(A),w.convW,u,b,n);h=this.recMM(e,r,q,w.outProj,n,u,u,!1)}else{let x=this.recMM(e,r,v,w.wq,n,u,B,!1),q=this.recMM(e,r,v,w.wk,n,u,k,!1),O=this.recMM(e,r,v,w.wv,n,u,k,!1);x=this.recRmsnorm(e,r,x,w.qNorm,n*c,d,p),q=this.recRmsnorm(e,r,q,w.kNorm,n*l,d,p),x=this.recRope(e,r,x,n*c,d,c,o,m),q=this.recRope(e,r,q,n*l,d,l,o,m);let D=this.lfm2KvGpu.get(A);e.copyBufferToBuffer(q,0,D.k,o*M,n*M),e.copyBufferToBuffer(O,0,D.v,o*M,n*M);let T=this.recAttention(e,r,x,D.k,D.v,n,c,l,d,o+n,o);h=this.recMM(e,r,T,w.wo,n,B,u,!1)}C=this.recBinary(e,r,"add",C,h,n*u);let G=this.recRmsnorm(e,r,C,w.ffnNorm,n,u,p),y=this.recMM(e,r,G,w.wgate,n,u,g,!1),P=this.recMM(e,r,G,w.wup,n,u,g,!1),U=this.recBinary(e,r,"swiglu",y,P,n*g),_=this.recMM(e,r,U,w.wdown,n,g,u,!1);C=this.recBinary(e,r,"add",C,_,n*u)}let K=this.storage(u*4);return r.push(K),e.copyBufferToBuffer(C,(n-1)*u*4,K,0,u*4),this.recRmsnorm(e,r,K,s,1,u,p)}let F=null;for(let C=0;C<n;C++){let K=o+C,A=this.storage(u*4);this.device.queue.writeBuffer(A,0,t.subarray(C*u,(C+1)*u)),r.push(A);for(let w=0;w<i.length;w++){let v=i[w],h=this.recRmsnorm(e,r,A,v.attnNorm,1,u,p),G;if(v.conv){let q=this.recMM(e,r,h,v.inProj,1,u,3*u,!1),O=this.recLfm2ShortConv(e,r,q,this.lfm2ConvGpu.get(w),v.convW,u,b);G=this.recMM(e,r,O,v.outProj,1,u,u,!1)}else{let q=this.recMM(e,r,h,v.wq,1,u,B,!1),O=this.recMM(e,r,h,v.wk,1,u,k,!1),D=this.recMM(e,r,h,v.wv,1,u,k,!1);q=this.recRmsnorm(e,r,q,v.qNorm,c,d,p),O=this.recRmsnorm(e,r,O,v.kNorm,l,d,p),q=this.recRope(e,r,q,c,d,c,K,m),O=this.recRope(e,r,O,l,d,l,K,m);let T=this.lfm2KvGpu.get(w);e.copyBufferToBuffer(O,0,T.k,K*M,M),e.copyBufferToBuffer(D,0,T.v,K*M,M);let R=this.recAttention(e,r,q,T.k,T.v,1,c,l,d,K+1,K);G=this.recMM(e,r,R,v.wo,1,B,u,!1)}A=this.recBinary(e,r,"add",A,G,u);let y=this.recRmsnorm(e,r,A,v.ffnNorm,1,u,p),P=this.recMM(e,r,y,v.wgate,1,u,g,!1),U=this.recMM(e,r,y,v.wup,1,u,g,!1),_=this.recBinary(e,r,"swiglu",P,U,g),x=this.recMM(e,r,_,v.wdown,1,g,u,!1);A=this.recBinary(e,r,"add",A,x,u)}C===n-1&&(F=this.recRmsnorm(e,r,A,s,1,u,p))}return F}lfm2SessionReset(e,r){(e!==this.lfm2Session||r===0)&&(r>0&&console.error(`[lfm2] session "${e}" inconnue avec pastLen=${r} \u2014 \xE9tat perdu, sortie invalide. Repartir de pastLen 0.`),this.resetLfm2State(),this.lfm2Session=e)}async lfm2PrefillGpu(e,r,t,n,a,i,s){this.lfm2SessionReset(s,i);let o=[],u=this.device.createCommandEncoder();this.recordLfm2(u,o,e,r,t,n,a,i),this.device.queue.submit([u.finish()]),await this.device.queue.onSubmittedWorkDone(),this.release(o)}async lfm2LogitsGpu(e,r,t,n,a,i,s,o){let u=globalThis;this.lfm2SessionReset(o,s);let c=[],l=this.device.createCommandEncoder(),d=this.recordLfm2(l,c,e,r,t,n,i,s),g=this.recMM(l,c,d,a,1,t.D,t.vocab,!1),p=this.device.createBuffer({size:t.vocab*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});l.copyBufferToBuffer(g,0,p,0,t.vocab*4),this.device.queue.submit([l.finish()]),await p.mapAsync(u.GPUMapMode.READ);let m=new Float32Array(p.getMappedRange().slice(0));return p.unmap(),p.destroy(),this.release(c),m}async lfm2TopKGpu(e,r,t,n,a,i,s,o,u,c,l=64){let d=globalThis;this.lfm2SessionReset(o,s);let g=[],p=this.device.createCommandEncoder(),m=this.recordLfm2(p,g,e,r,t,n,i,s),b=this.recMM(p,g,m,a,1,t.D,t.vocab,!1);if(c&&c!==1&&u.length){let F=Uint32Array.from(u),C=this.bufU32(F,d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST),K=this.uniform([F.length],{offset:4,value:c});this.recordPass(p,"penalize_logits",[K,C,b],this.grid1D(F.length)),g.push(K,C)}let k=this.storage(l*2*4);g.push(k);{let F=this.uniform([t.vocab,l]);this.recordPass(p,this.topKParOk?"top_k_par":"top_k",[F,b,k],[1,1,1]),g.push(F)}let B=this.device.createBuffer({size:l*2*4,usage:d.GPUBufferUsage.COPY_DST|d.GPUBufferUsage.MAP_READ});p.copyBufferToBuffer(k,0,B,0,l*2*4),this.device.queue.submit([p.finish()]),await B.mapAsync(d.GPUMapMode.READ);let M=new Uint32Array(B.getMappedRange().slice(0));return B.unmap(),B.destroy(),this.release(g),{ids:M.slice(0,l),vals:new Float32Array(M.buffer,l*4,l)}}resetRwkvState(){for(let e of this.rwkvStateGpu.values())e.S.destroy?.(),e.tm.destroy?.(),e.cm.destroy?.();this.rwkvStateGpu.clear(),this.rwkvVFirst?.destroy?.(),this.rwkvVFirst=null,this.rwkvSession="";for(let e of this.bufferPool.values())for(let r of e)r.destroy?.();this.bufferPool.clear()}clearRwkvState(){this.resetRwkvState()}ensureRwkvState(e,r,t,n){let a=this.rwkvStateGpu.get(e);if(!a){let i=this.storage(t*n*n*4),s=this.storage(r*4),o=this.storage(r*4);this.device.queue.writeBuffer(i,0,new Float32Array(t*n*n)),this.device.queue.writeBuffer(s,0,new Float32Array(r)),this.device.queue.writeBuffer(o,0,new Float32Array(r)),a={S:i,tm:s,cm:o},this.rwkvStateGpu.set(e,a)}return a}rwkvSessionReset(e,r){(e!==this.rwkvSession||r===0)&&(r>0&&console.error(`[rwkv] session "${e}" inconnue avec pastLen=${r} \u2014 \xE9tat perdu, sortie invalide. Repartir de pastLen 0.`),this.resetRwkvState(),this.rwkvSession=e)}recRwkvToken(e,r,t,n,a,i){let{D:s,H:o,NH:u}=n,c=1e-5,l=64e-5;for(let d=0;d<a.length;d++){let g=a[d],p=this.rwkvStateGpu.get(d),m=this.recLayernorm(e,r,t,g.attnNormW,g.attnNormB,1,s,c),b=this.storage(6*s*4);{let L=this.uniform([s]);this.recordPass(e,"rwkv_token_shift",[L,m,p.tm,g.lerpFused,b],this.grid1D(6*s)),r.push(L,b)}e.copyBufferToBuffer(m,0,p.tm,0,s*4);let k=L=>{let j=this.storage(s*4);return e.copyBufferToBuffer(b,L*s*4,j,0,s*4),r.push(j),j},B=k(0),M=k(1),F=k(2),C=k(3),K=k(4),A=k(5),w=this.recMM(e,r,B,g.R,1,s,s,!1),v=this.recMM(e,r,F,g.K,1,s,s,!1),h=this.recMM(e,r,C,g.V,1,s,s,!1),G=this.recUnary(e,r,"tanh_act",this.recMM(e,r,M,g.w1,1,s,g.rw,!1),g.rw),y=this.recMM(e,r,G,g.w2,1,g.rw,s,!1),P=this.storage(s*4);this.recordPass(e,"rwkv_decay",[g.w0,y,P],this.grid1D(s)),r.push(P);let U=this.recMM(e,r,this.recMM(e,r,K,g.a1,1,s,g.ra,!1),g.a2,1,g.ra,s,!1),_=this.storage(s*4);this.recordPass(e,"rwkv_bias_sigmoid",[g.a0,U,_],this.grid1D(s)),r.push(_);let x=this.recUnary(e,r,"sigmoid",this.recMM(e,r,A,g.g1,1,s,g.rg,!1),g.rg),q=this.recMM(e,r,x,g.g2,1,g.rg,s,!1);if(d===0)e.copyBufferToBuffer(h,0,i,0,s*4);else{let L=this.recMM(e,r,this.recMM(e,r,C,g.v1,1,s,g.rv,!1),g.v2,1,g.rv,s,!1);this.recordPass(e,"rwkv_vresid",[h,i,g.v0,L],this.grid1D(s))}let O=this.storage(s*4),D=this.storage(s*4),T=this.storage(s*4);{let L=this.uniform([u,o]);this.recordPass(e,"rwkv_kprep",[L,v,_,g.kk,g.ka,O,D,T],this.grid1D(u)),r.push(L,O,D,T)}let R=this.storage(s*4);{let L=this.uniform([u,o]);this.recordPass(e,"rwkv_wkv7",[L,w,P,O,h,D,T,p.S,R],this.grid1D(u*o)),r.push(L,R)}let z=this.storage(s*4);{let L=this.uniform([u,o],{offset:8,value:l});this.recordPass(e,"rwkv_out_gn",[L,R,w,O,g.rk,h,g.lnWB,z],this.grid1D(u)),r.push(L,z)}let Q=this.recBinary(e,r,"mul",z,q,s),$=this.recMM(e,r,Q,g.O,1,s,s,!1);t=this.recBinary(e,r,"add",t,$,s);let V=this.recLayernorm(e,r,t,g.attnNorm2W,g.attnNorm2B,1,s,c),Y=this.storage(s*4);this.recordPass(e,"rwkv_lerp",[V,p.cm,g.lerpK,Y],this.grid1D(s)),r.push(Y),e.copyBufferToBuffer(V,0,p.cm,0,s*4);let N=this.recUnary(e,r,"sqrelu",this.recMM(e,r,Y,g.cmK,1,s,g.ffn,!1),g.ffn),S=this.recMM(e,r,N,g.cmV,1,g.ffn,s,!1);t=this.recBinary(e,r,"add",t,S,s)}return t}recordRwkv(e,r,t,n,a,i,s){let{D:o,H:u,NH:c}=a;for(let d=0;d<i.length;d++)this.ensureRwkvState(d,o,c,u);this.rwkvVFirst||(this.rwkvVFirst=this.storage(o*4));let l=null;for(let d=0;d<n;d++){let g=this.storage(o*4);this.device.queue.writeBuffer(g,0,t.subarray(d*o,(d+1)*o)),r.push(g);let p=this.recLayernorm(e,r,g,s.tokW,s.tokB,1,o,1e-5),m=this.recRwkvToken(e,r,p,a,i,this.rwkvVFirst);d===n-1&&(l=this.recLayernorm(e,r,m,s.outW,s.outB,1,o,1e-5))}return l}async rwkvPrefillGpu(e,r,t,n,a,i,s){this.rwkvSessionReset(s,i);let o=[],u=this.device.createCommandEncoder();this.recordRwkv(u,o,e,r,t,n,a),this.device.queue.submit([u.finish()]),await this.device.queue.onSubmittedWorkDone(),this.release(o)}async rwkvLogitsGpu(e,r,t,n,a,i,s,o){let u=globalThis;this.rwkvSessionReset(o,s);let c=[],l=this.device.createCommandEncoder(),d=this.recordRwkv(l,c,e,r,t,n,i),g=this.recMM(l,c,d,a,1,t.D,t.vocab,!1),p=this.device.createBuffer({size:t.vocab*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});l.copyBufferToBuffer(g,0,p,0,t.vocab*4),this.device.queue.submit([l.finish()]),await p.mapAsync(u.GPUMapMode.READ);let m=new Float32Array(p.getMappedRange().slice(0));return p.unmap(),p.destroy(),this.release(c),m}async rwkvTopKGpu(e,r,t,n,a,i,s,o,u,c,l=64){let d=globalThis;this.rwkvSessionReset(o,s);let g=[],p=this.device.createCommandEncoder(),m=this.recordRwkv(p,g,e,r,t,n,i),b=this.recMM(p,g,m,a,1,t.D,t.vocab,!1);if(c&&c!==1&&u.length){let F=Uint32Array.from(u),C=this.bufU32(F,d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST),K=this.uniform([F.length],{offset:4,value:c});this.recordPass(p,"penalize_logits",[K,C,b],this.grid1D(F.length)),g.push(K,C)}let k=this.storage(l*2*4);g.push(k);{let F=this.uniform([t.vocab,l]);this.recordPass(p,this.topKParOk?"top_k_par":"top_k",[F,b,k],[1,1,1]),g.push(F)}let B=this.device.createBuffer({size:l*2*4,usage:d.GPUBufferUsage.COPY_DST|d.GPUBufferUsage.MAP_READ});p.copyBufferToBuffer(k,0,B,0,l*2*4),this.device.queue.submit([p.finish()]),await B.mapAsync(d.GPUMapMode.READ);let M=new Uint32Array(B.getMappedRange().slice(0));return B.unmap(),B.destroy(),this.release(g),{ids:M.slice(0,l),vals:new Float32Array(M.buffer,l*4,l)}}async argmaxProjection(e,r,t,n,a=!1){let i=globalThis,s=[],o=this.device.createCommandEncoder(),u=this.storage(e.byteLength);this.device.queue.writeBuffer(u,0,e),s.push(u);let c=this.storage(n*4);s.push(c);for(let m of r){let b=this.recMatmulT(o,s,u,m.buf,1,t,m.rows,a);o.copyBufferToBuffer(b,0,c,m.r0*4,m.rows*4)}let l=this.storage(4),d=this.uniform([n]);s.push(l,d),this.recordPass(o,"argmax",[d,c,l],[1,1,1]);let g=this.device.createBuffer({size:4,usage:i.GPUBufferUsage.COPY_DST|i.GPUBufferUsage.MAP_READ});o.copyBufferToBuffer(l,0,g,0,4),this.device.queue.submit([o.finish()]),await g.mapAsync(i.GPUMapMode.READ);let p=new Uint32Array(g.getMappedRange().slice(0))[0];return g.unmap(),g.destroy(),this.release(s),p}async projectLogits(e,r,t,n,a=!1){let i=globalThis,s=[],o=this.device.createCommandEncoder(),u=this.storage(e.byteLength);this.device.queue.writeBuffer(u,0,e),s.push(u);let c=this.storage(n*4);s.push(c);for(let g of r){let p=this.recMatmulT(o,s,u,g.buf,1,t,g.rows,a);o.copyBufferToBuffer(p,0,c,g.r0*4,g.rows*4)}let l=this.device.createBuffer({size:n*4,usage:i.GPUBufferUsage.COPY_DST|i.GPUBufferUsage.MAP_READ});o.copyBufferToBuffer(c,0,l,0,n*4),this.device.queue.submit([o.finish()]),await l.mapAsync(i.GPUMapMode.READ);let d=new Float32Array(l.getMappedRange().slice(0));return l.unmap(),l.destroy(),this.release(s),d}async selfValidate(){this.validationFailure=null;let e=A=>(this.validationFailure=A,console.error("[selfValidate] FAILED at:",A,"(hasF16="+this.hasF16+")"),!1),r=(A,w)=>A.length===w.length&&A.every((v,h)=>Math.abs(v-w[h])<.001),t=A=>Float32Array.from({length:A},()=>Math.random()*2-1),n=3,a=4,i=5,s=t(n*a),o=t(a*i),u=new Float32Array(n*i);for(let A=0;A<n;A++)for(let w=0;w<i;w++){let v=0;for(let h=0;h<a;h++)v+=s[A*a+h]*o[h*i+w];u[A*i+w]=v}if(!r(await this.matmul(s,o,n,a,i),u))return e("matmul");{let A=(v,h,G,y,P)=>{let U=new Float32Array(G*P);for(let _=0;_<G;_++)for(let x=0;x<P;x++){let q=0;for(let O=0;O<y;O++)q+=v[_*y+O]*h[x*y+O];U[_*P+x]=q}return U},w=async(v,h,G)=>{let y=t(v*h),P=t(G*h);return r(await this.matmulT(y,P,v,h,G),A(y,P,v,h,G))};if(!await w(3,8,5))return e("matmulT.vec4(3,8,5)");if(!await w(1,16,7))return e("matmulT.vec4(1,16,7)");if(!await w(2,6,4))return e("matmulT.scalar(2,6,4)");if(this.hasF16){let y=t(16),P=t(112),U=this.uploadGpuF16(P),_=await this.matmulT(y,U,1,16,7,!0),x=new Float32Array(7);for(let R=0;R<7;R++){let z=0;for(let Q=0;Q<16;Q++)z+=y[Q]*P[R*16+Q];x[R]=z}U.destroy?.();let q=R=>R.length===x.length&&R.every((z,Q)=>Math.abs(z-x[Q])<=.03*(1+Math.abs(x[Q])));if(!q(_))return e("matmulT.f16");let O=this.uploadGpu(P),D=this.f32ToF16Gpu(O,112),T=await this.matmulT(y,D,1,16,7,!0);if(O.destroy?.(),D.destroy?.(),!q(T))return e("packf16")}if(this.hasF16&&this.f16SharedOk){let v=[{m:20,k:128,n:18},{m:32,k:64,n:64},{m:70,k:40,n:130},{m:33,k:48,n:7}];for(let h of v){let G=t(h.m*h.k),y=t(h.n*h.k),P=this.uploadGpuF16(y),U=await this.matmulT(G,P,h.m,h.k,h.n,!0);this.f16SharedOk=!1;let _=await this.matmulT(G,P,h.m,h.k,h.n,!0);if(this.f16SharedOk=!0,P.destroy?.(),!(U.length===_.length&&U.every((q,O)=>Math.abs(q-_[O])<=.001*(1+Math.abs(_[O]))))){this.f16SharedOk=!1,console.warn(`[selfValidate] matmul_t_f16w_shared KO sur ce GPU (m=${h.m}, k=${h.k}, n=${h.n}) \u2014 repli sur matmul_t_f16w (plus lent, m\xEAme r\xE9sultat).`);break}}}}{let h=t(128),G=t(768),y=Be(G),P=this.uploadGpuRaw(y.nibbles),U=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),_=this.uploadGpuRaw(new Uint8Array(y.mins.buffer,y.mins.byteOffset,y.mins.byteLength)),x=await this.matmulQ4(h,P,U,_,1,128,6),q=ge(y),O=new Float32Array(6);for(let Q=0;Q<6;Q++){let $=0;for(let V=0;V<128;V++)$+=h[V]*q[Q*128+V];O[Q]=$}if(P.destroy?.(),U.destroy?.(),_.destroy?.(),!r(x,O))return e("matmulQ4");let D=this.uploadGpu(G),T=this.f32ToQ4Gpu(D,768),R=await this.matmulQ4(h,T.nib,T.sc,T.mn,1,128,6);if(D.destroy?.(),T.nib.destroy?.(),T.sc.destroy?.(),T.mn.destroy?.(),!(R.length===O.length&&R.every((Q,$)=>Math.abs(Q-O[$])<=.06*(1+Math.abs(O[$]))+.02)))return e("quantize_q4")}{let h=t(640),G=t(768),y=Xt(G),P=this.uploadGpuRaw(new Uint8Array(y.lo.buffer,y.lo.byteOffset,y.lo.byteLength)),U=this.uploadGpuRaw(new Uint8Array(y.hi.buffer,y.hi.byteOffset,y.hi.byteLength)),_=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),x=this.uploadGpuRaw(new Uint8Array(y.mins.buffer,y.mins.byteOffset,y.mins.byteLength)),q=await this.matmulQ3(h,P,U,_,x,5,128,6),O=We(y),D=new Float32Array(30);for(let T=0;T<5;T++)for(let R=0;R<6;R++){let z=0;for(let Q=0;Q<128;Q++)z+=h[T*128+Q]*O[R*128+Q];D[T*6+R]=z}if(P.destroy?.(),U.destroy?.(),_.destroy?.(),x.destroy?.(),!r(q,D))return e("matmulQ3")}{let h=t(640),G=t(768),y=Be(G),P=this.uploadGpuRaw(y.nibbles),U=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),_=this.uploadGpuRaw(new Uint8Array(y.mins.buffer,y.mins.byteOffset,y.mins.byteLength)),x=await this.matmulQ4Tiled(h,P,U,_,5,128,6),q=ge(y),O=new Float32Array(30);for(let D=0;D<5;D++)for(let T=0;T<6;T++){let R=0;for(let z=0;z<128;z++)R+=h[D*128+z]*q[T*128+z];O[D*6+T]=R}if(P.destroy?.(),U.destroy?.(),_.destroy?.(),!r(x,O))return e("matmul_q4_tiled")}for(let A of[{m:20,n:18},{m:32,n:64},{m:70,n:130}]){let w=A.m,v=128,h=A.n,G=t(w*v),y=t(h*v),P=Be(y),U=this.uploadGpuRaw(P.nibbles),_=this.uploadGpuRaw(new Uint8Array(P.scales.buffer,P.scales.byteOffset,P.scales.byteLength)),x=this.uploadGpuRaw(new Uint8Array(P.mins.buffer,P.mins.byteOffset,P.mins.byteLength)),q=await this.matmulQ4Shared(G,U,_,x,w,v,h),O=ge(P),D=new Float32Array(w*h);for(let T=0;T<w;T++)for(let R=0;R<h;R++){let z=0;for(let Q=0;Q<v;Q++)z+=G[T*v+Q]*O[R*v+Q];D[T*h+R]=z}if(U.destroy?.(),_.destroy?.(),x.destroy?.(),!r(q,D))return e(`matmul_q4_shared(${w},${h})`)}{let h=t(128),G=t(768),y=Fe(G),P=this.uploadGpuRaw(new Uint8Array(y.codes.buffer,y.codes.byteOffset,y.codes.byteLength)),U=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),_=await this.matmulQ8(h,P,U,1,128,6),x=pe(y),q=new Float32Array(6);for(let R=0;R<6;R++){let z=0;for(let Q=0;Q<128;Q++)z+=h[Q]*x[R*128+Q];q[R]=z}if(P.destroy?.(),U.destroy?.(),!r(_,q))return e("matmulQ8");let O=this.uploadGpu(G),D=this.f32ToQ8Gpu(O,768),T=await this.matmulQ8(h,D.codes,D.sc,1,128,6);if(O.destroy?.(),D.codes.destroy?.(),D.sc.destroy?.(),!r(T,q))return e("quantize_q8")}{let h=t(640),G=t(768),y=Fe(G),P=this.uploadGpuRaw(new Uint8Array(y.codes.buffer,y.codes.byteOffset,y.codes.byteLength)),U=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),_=await this.matmulQ8Tiled(h,P,U,5,128,6),x=pe(y),q=new Float32Array(30);for(let O=0;O<5;O++)for(let D=0;D<6;D++){let T=0;for(let R=0;R<128;R++)T+=h[O*128+R]*x[D*128+R];q[O*6+D]=T}if(P.destroy?.(),U.destroy?.(),!r(_,q))return e("matmul_q8_tiled")}for(let A of[{k:128,n:6},{k:128,n:130},{k:4096,n:17}]){let w=A.k,v=A.n,h=t(w),G=t(v*w),y=Be(G),P=this.uploadGpuRaw(y.nibbles),U=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),_=this.uploadGpuRaw(new Uint8Array(y.mins.buffer,y.mins.byteOffset,y.mins.byteLength)),x=await this.matmulQ4Vec(h,P,U,_,w,v),q=ge(y),O=new Float32Array(v);for(let V=0;V<v;V++){let Y=0;for(let N=0;N<w;N++)Y+=h[N]*q[V*w+N];O[V]=Y}if(P.destroy?.(),U.destroy?.(),_.destroy?.(),!r(x,O))return e(`matmul_q4_vec(${w},${v})`);let D=Fe(G),T=this.uploadGpuRaw(new Uint8Array(D.codes.buffer,D.codes.byteOffset,D.codes.byteLength)),R=this.uploadGpuRaw(new Uint8Array(D.scales.buffer,D.scales.byteOffset,D.scales.byteLength)),z=await this.matmulQ8Vec(h,T,R,w,v),Q=pe(D),$=new Float32Array(v);for(let V=0;V<v;V++){let Y=0;for(let N=0;N<w;N++)Y+=h[N]*Q[V*w+N];$[V]=Y}if(T.destroy?.(),R.destroy?.(),!r(z,$))return e(`matmul_q8_vec(${w},${v})`)}for(let A of[{m:20,n:18},{m:32,n:64},{m:70,n:130}]){let w=A.m,v=128,h=A.n,G=t(w*v),y=t(h*v),P=Fe(y),U=this.uploadGpuRaw(new Uint8Array(P.codes.buffer,P.codes.byteOffset,P.codes.byteLength)),_=this.uploadGpuRaw(new Uint8Array(P.scales.buffer,P.scales.byteOffset,P.scales.byteLength)),x=await this.matmulQ8Shared(G,U,_,w,v,h),q=pe(P),O=new Float32Array(w*h);for(let D=0;D<w;D++)for(let T=0;T<h;T++){let R=0;for(let z=0;z<v;z++)R+=G[D*v+z]*q[T*v+z];O[D*h+T]=R}if(U.destroy?.(),_.destroy?.(),!r(x,O))return e(`matmul_q8_shared(${w},${h})`)}if(this.qShared2Ok){let A=[{m:64,k:128,n:128},{m:65,k:128,n:130},{m:100,k:160,n:18},{m:70,k:96,n:200}];for(let w of A){let v=w.m,h=w.k,G=w.n,y=t(v*h),P=t(G*h),U=new Float32Array(v*G),_=Fe(P),x=pe(_);for(let N=0;N<v;N++)for(let S=0;S<G;S++){let L=0;for(let j=0;j<h;j++)L+=y[N*h+j]*x[S*h+j];U[N*G+S]=L}let q=this.uploadGpuRaw(new Uint8Array(_.codes.buffer,_.codes.byteOffset,_.codes.byteLength)),O=this.uploadGpuRaw(new Uint8Array(_.scales.buffer,_.scales.byteOffset,_.scales.byteLength)),D=await this.matmulQ8Shared2(y,q,O,v,h,G);q.destroy?.(),O.destroy?.();let T=Be(P),R=ge(T),z=new Float32Array(v*G);for(let N=0;N<v;N++)for(let S=0;S<G;S++){let L=0;for(let j=0;j<h;j++)L+=y[N*h+j]*R[S*h+j];z[N*G+S]=L}let Q=this.uploadGpuRaw(T.nibbles),$=this.uploadGpuRaw(new Uint8Array(T.scales.buffer,T.scales.byteOffset,T.scales.byteLength)),V=this.uploadGpuRaw(new Uint8Array(T.mins.buffer,T.mins.byteOffset,T.mins.byteLength)),Y=await this.matmulQ4Shared2(y,Q,$,V,v,h,G);if(Q.destroy?.(),$.destroy?.(),V.destroy?.(),!r(D,U)||!r(Y,z)){this.qShared2Ok=!1,console.warn(`[selfValidate] matmul_t_q8/q4_shared2 KO sur ce GPU (m=${v}, k=${h}, n=${G}) \u2014 repli sur les tuiles 32\xD764 v1 (plus lentes, m\xEAme r\xE9sultat).`);break}}}{let w=t(1632),v=new Uint8Array(w.buffer,w.byteOffset,w.byteLength),h=(G,y)=>G.length===y.length&&G.every((P,U)=>P===y[U]);if(!h(await this.quantizeToBytes("F32",v,1632,"q8"),await this.quantizeToBytes("F32",v,1632,"q8",256)))return e("quantize_chunk_q8");if(!h(await this.quantizeToBytes("F32",v,1632,"q4"),await this.quantizeToBytes("F32",v,1632,"q4",256)))return e("quantize_chunk_q4")}let c=2,l=8,d=t(c*l),g=t(l),p=new Float32Array(c*l);for(let A=0;A<c;A++){let w=0;for(let h=0;h<l;h++)w+=d[A*l+h]**2;let v=1/Math.sqrt(w/l+1e-5);for(let h=0;h<l;h++)p[A*l+h]=d[A*l+h]*v*g[h]}if(!r(await this.rmsnorm(d,g,c,l),p))return e("rmsnorm");if(!r(await this.rmsnorm(d,g,c,l,1e-5,!0),Ge(d,g,c,l,1e-5,!0)))return e("rmsnorm.onePlus");let m=t(16),b=t(16),k=m.map((A,w)=>A/(1+Math.exp(-A))*b[w]);if(!r(await this.swiglu(m,b),k))return e("swiglu");let B=m.map((A,w)=>ir(A)*b[w]);if(!r(await this.geglu(m,b),B))return e("geglu");let M=m.map((A,w)=>A+b[w]);if(!r(await this.add(m,b),M))return e("add");{let A=X.MAX_WG_DIM*ee+257,w=new Float32Array(A),v=new Float32Array(A),h=[0,1,ee-1,ee,X.MAX_WG_DIM*ee-1,X.MAX_WG_DIM*ee,A-1];for(let P of h)w[P]=P%7-3,v[P]=P%5-2;let G=await this.add(w,v),y=G.length===A;for(let P of h)Math.abs(G[P]-(w[P]+v[P]))>1e-5&&(y=!1);if(!y)return e("grid1D.add(2D)")}let F=(A,w,v=.003)=>A.length===w.length&&A.every((h,G)=>Math.abs(h-w[G])<=v*(1+Math.abs(w[G])));{let y=t(8);if(!F(await this.rope(y,2,4,2,1,1e4),Le(y,2,4,2,1,1e4)))return e("rope")}{let y=t(384),P=new Float32Array(64/2).fill(1);if(!F(await this.ropeFactors(y,P,6,64,2,7,5e5),Le(y,6,64,2,7,5e5)))return e("rope_factors.ones");let U=Float32Array.from({length:64/2},(_,x)=>1+x%5*.7);if(!F(await this.ropeFactors(y,U,6,64,2,7,5e5),cn(y,U,6,64,2,7,5e5)))return e("rope_factors")}{let y=t(384);if(!F(await this.rope(y,6,64,2,7,5e5,!0),Ve(y,6,64,2,7,5e5)))return e("rope.interleaved");let P=t(8);if(!F(await this.rope(P,2,4,2,3,1e4,!0),Ve(P,2,4,2,3,1e4)))return e("rope.interleaved.hd4");let U=t(384);if(!F(await this.rope(U,6,64,2,0,5e5,!0),Ve(U,6,64,2,0,5e5)))return e("rope.interleaved.pos0");let _=64/2,x=new Float32Array(384);for(let R=0;R<6;R++)for(let z=0;z<_;z++)x[R*64+2*z]=y[R*64+z],x[R*64+2*z+1]=y[R*64+z+_];let q=await this.rope(x,6,64,2,7,5e5,!0),O=await this.rope(y,6,64,2,7,5e5,!1),D=new Float32Array(384);for(let R=0;R<6;R++)for(let z=0;z<_;z++)D[R*64+2*z]=O[R*64+z],D[R*64+2*z+1]=O[R*64+z+_];if(!F(q,D))return e("rope.interleaved.equivalence");let T=Float32Array.from({length:_},(R,z)=>1+z%5*.7);if(!F(await this.ropeFactors(y,T,6,64,2,7,5e5,!0),Ve(y,6,64,2,7,5e5,T)))return e("rope_factors.interleaved")}{let v=[16,24,24],h=1e6,G=3,y=G*2,P=5,U=t(y*128),_=new Uint32Array(G*3);for(let D=0;D<G;D++){let T=P+D;_.set([T,T,T],D*3)}let x=new Uint32Array([5,5,5,5,6,9,5,7,5]),q=F(await this.ropeMrope(U,_,y,128,2,v,h),Le(U,y,128,2,P,h)),O=F(await this.ropeMrope(U,x,y,128,2,v,h),un(U,x,y,128,2,v,h));(!q||!O)&&(this.mropeOk=!1,console.error(`[selfValidate] rope_mrope KO sur ce GPU (${q?"positions 3D":"d\xE9g\xE9n\xE9r\xE9\u2260rope"}) \u2014 vision d\xE9sactiv\xE9e, chat texte intact.`))}{let P=t(32),U=t(32),_=t(32);if(!F(await this.attention(P,U,_,2,4,2,4,2),he(P,U,_,2,4,2,4,2)))return e("attention");let x=.3,q=5;if(!F(await this.attention(P,U,_,2,4,2,4,2,x,q),he(P,U,_,2,4,2,4,2,x,q)))return e("attention.softcap");{let $=t(24),V=t(48),Y=t(48);for(let N of[1,4,8,64]){if(!F(await this.attention($,V,Y,3,2,1,4,9,void 0,0,N),he($,V,Y,3,2,1,4,9,void 0,0,N)))return e(`attention.window(${N})`);if(!F(await this.attentionDecode($,V,Y,3,2,1,4,9,void 0,0,N),he($,V,Y,3,2,1,4,9,void 0,0,N)))return e(`attention_decode.window(${N})`)}}{let O=await this.quantizeKvReadback(U,4,2,4),D=await this.quantizeKvReadback(_,4,2,4),T=await this.attentionQ8Kv(P,O.codes,O.scales,D.codes,D.scales,2,4,2,4,2),R=(Y,N)=>{let S=new Float32Array(32);for(let L=0;L<4;L++)for(let j=0;j<2;j++){let H=N[L*2+j];for(let I=0;I<4;I++){let W=L*2*4+j*4+I,E=Y[W>>2]>>(W&3)*8&255;S[W]=(E<128?E:E-256)*H}}return S},z=R(O.codes,O.scales),Q=R(D.codes,D.scales),$=he(P,z,Q,2,4,2,4,2);if(!F(T,$,.005))return e("attention.q8kv");let V=0;for(let Y=0;Y<U.length;Y++)V=Math.max(V,Math.abs(z[Y]-U[Y]));if(V>.05)return e("quantize_kv.error")}}{let A=v=>{this.attnDecodeOk=!1,console.error("[selfValidate] attention d\xE9codage HS sur ce GPU (\xE9tape :",v,") \u2192 repli kernels classiques (plus lents \xE0 contexte long, corrects)")},w=[{nT:1,nH:14,nKv:2,hd:64,past:300},{nT:10,nH:14,nKv:2,hd:64,past:173}];for(let v of w){if(!this.attnDecodeOk)break;let h=v.past+v.nT,G=t(v.nT*v.nH*v.hd),y=t(h*v.nKv*v.hd),P=t(h*v.nKv*v.hd);if(!F(await this.attentionDecode(G,y,P,v.nT,v.nH,v.nKv,v.hd,v.past),he(G,y,P,v.nT,v.nH,v.nKv,v.hd,v.past))){A(`decode(nT=${v.nT})`);break}let U=await this.quantizeKvReadback(y,h,v.nKv,v.hd),_=await this.quantizeKvReadback(P,h,v.nKv,v.hd),x=await this.attentionQ8KvDecode(G,U.codes,U.scales,_.codes,_.scales,v.nT,v.nH,v.nKv,v.hd,v.past),q=await this.attentionQ8Kv(G,U.codes,U.scales,_.codes,_.scales,v.nT,v.nH,v.nKv,v.hd,v.past);if(!F(x,q,.005)){A(`decode.q8kv(nT=${v.nT})`);break}}if(this.attnDecodeOk){let U=t(64),_=t(350*8),x=t(350*8);F(await this.attentionDecode(U,_,x,2,4,2,8,173,.3,5),he(U,_,x,2,4,2,8,173,.3,5))||A("decode.softcap")}if(this.attnDecodeOk){let U=t(256),_=t(9088),x=t(9088);F(await this.attentionDecode(U,_,x,1,2,1,128,70),he(U,_,x,1,2,1,128,70))||A("decode.hd128")}}{let A=h=>{this.attnPrefillOk=!1,console.error("[selfValidate] attention prefill tuil\xE9e HS sur ce GPU (\xE9tape :",h,") \u2192 repli kernel classique (plus lent en prefill, correct)")},w=[{nT:37,nH:14,nKv:2,hd:64,past:0,sc:void 0,cap:0,win:0},{nT:13,nH:14,nKv:2,hd:64,past:173,sc:void 0,cap:0,win:0},{nT:1,nH:14,nKv:2,hd:64,past:300,sc:void 0,cap:0,win:0},{nT:4,nH:4,nKv:2,hd:32,past:7,sc:void 0,cap:0,win:0},{nT:5,nH:4,nKv:2,hd:32,past:0,sc:void 0,cap:0,win:0},{nT:9,nH:2,nKv:1,hd:128,past:70,sc:void 0,cap:0,win:0},{nT:6,nH:4,nKv:2,hd:8,past:17,sc:.3,cap:5,win:0}];for(let h of w){let G=h.past+h.nT,y=t(h.nT*h.nH*h.hd),P=t(G*h.nKv*h.hd),U=t(G*h.nKv*h.hd);if(!F(await this.attentionPrefill(y,P,U,h.nT,h.nH,h.nKv,h.hd,h.past,h.sc,h.cap,h.win),he(y,P,U,h.nT,h.nH,h.nKv,h.hd,h.past,h.sc,h.cap,h.win))){A(`prefill(nT=${h.nT},hd=${h.hd},past=${h.past}${h.cap>0?",softcap":""})`);break}}if(this.attnPrefillOk){let x=t(80),q=t(76),O=t(76);for(let D of[1,4,8,64])if(!F(await this.attentionPrefill(x,q,O,10,2,1,4,9,void 0,0,D),he(x,q,O,10,2,1,4,9,void 0,0,D))){A(`prefill.window(${D})`);break}}let v=[{nT:37,nH:14,nKv:2,hd:64,past:0,win:0},{nT:13,nH:14,nKv:2,hd:64,past:173,win:0},{nT:10,nH:2,nKv:1,hd:8,past:9,win:4}];for(let h of v){if(!this.attnPrefillOk)break;let G=h.past+h.nT,y=t(h.nT*h.nH*h.hd),P=t(G*h.nKv*h.hd),U=t(G*h.nKv*h.hd),_=await this.quantizeKvReadback(P,G,h.nKv,h.hd),x=await this.quantizeKvReadback(U,G,h.nKv,h.hd),q=await this.attentionQ8KvPrefill(y,_.codes,_.scales,x.codes,x.scales,h.nT,h.nH,h.nKv,h.hd,h.past,void 0,0,h.win),O=await this.attentionQ8Kv(y,_.codes,_.scales,x.codes,x.scales,h.nT,h.nH,h.nKv,h.hd,h.past,void 0,0,h.win);if(!F(q,O,.005)){A(`prefill.q8kv(nT=${h.nT},win=${h.win})`);break}}}{let A=v=>{this.rmsVecOk=!1,console.error("[selfValidate] RMSNorm parall\xE8le HS sur ce GPU (\xE9tape :",v,") \u2192 repli kernel une-ligne-par-thread (correct, plus lent en d\xE9codage)")},w=[{rows:1,dim:1024,onePlus:!1},{rows:1,dim:1536,onePlus:!1},{rows:1,dim:100,onePlus:!1},{rows:14,dim:64,onePlus:!1},{rows:37,dim:2048,onePlus:!1},{rows:3,dim:128,onePlus:!0}];for(let v of w){let h=t(v.rows*v.dim),G=t(v.dim),y=await this.rmsnormVec(h,G,v.rows,v.dim,1e-6,v.onePlus),P=await this.rmsnorm(h,G,v.rows,v.dim,1e-6,v.onePlus);if(!F(y,P,.005)){A(`rmsnorm_vec(${v.rows}\xD7${v.dim}${v.onePlus?",1+w":""})`);break}}}{let A=v=>{this.topKParOk=!1,console.error("[selfValidate] top-K parall\xE8le HS sur ce GPU (\xE9tape :",v,") \u2192 repli s\xE9lection sur un thread (correcte, plus lente)")},w=[{n:151936,k:64,ties:!1,label:"vocab Qwen (151936)"},{n:65536,k:64,ties:!1,label:"vocab World (65536)"},{n:1e3,k:64,ties:!1,label:"n non multiple de 128"},{n:300,k:64,ties:!1,label:"n < 1024 candidats"},{n:4096,k:8,ties:!1,label:"petit K"},{n:8192,k:64,ties:!0,label:"EX \xC6QUO (d\xE9partage)"}];for(let v of w){if(!this.topKParOk)break;let h=v.ties?Float32Array.from({length:v.n},(U,_)=>Math.round(Math.random()*6)+(_%7===0?3:0)):t(v.n),G=await this.topKReadback(h,v.k,"top_k"),y=await this.topKReadback(h,v.k,"top_k_par");if(!(G.length===y.length&&G.every((U,_)=>U===y[_]))){let U=G.findIndex((_,x)=>_!==y[x]);A(`top_k_par(${v.label}) \u2014 premier \xE9cart au rang ${U} : ${G[U]} vs ${y[U]}`);break}}}{let U={seq:3,d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},_={attnNorm:t(16),wq:t(256),wk:t(128),wv:t(128),wo:t(256),bq:t(16),bk:t(8),bv:t(8),ffnNorm:t(16),wgate:t(256),wup:t(256),wdown:t(256)},x=t(48);if(!F(await this.layerForward(x,U,_),ft(x,U,_),.005))return e("layerForward")}{let _={seq:3,d:12,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6,attnScale:1/Math.sqrt(4),attnLogitSoftcap:5,act:"gelu",rmsGainOnePlus:!0},x={attnNorm:t(12),wq:t(192),wk:t(96),wv:t(96),wo:t(192),ffnNorm:t(12),wgate:t(192),wup:t(192),wdown:t(192),postAttnNorm:t(12),postFfnNorm:t(12)},q=t(36);if(!F(await this.layerForward(q,_,x),ft(q,_,x),.005))return e("layerForward.gemma2")}{let _={seq:3,d:12,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e6,eps:1e-6},x={attnNorm:t(12),wq:t(192),wk:t(96),wv:t(96),wo:t(192),ffnNorm:t(12),wgate:t(192),wup:t(192),wdown:t(192),qNorm:t(4),kNorm:t(4)},q=t(36);if(!F(await this.layerForward(q,_,x),ft(q,_,x),.005))return e("layerForward.qwen3")}{let w=new Uint8Array(720);for(let h=0;h<5;h++){let G=h*144,y=new DataView(w.buffer);y.setUint16(G,Se(.005+Math.random()*.05),!0),y.setUint16(G+2,Se(.001+Math.random()*.02),!0);for(let P=4;P<144;P++)w[G+P]=Math.random()*256|0}let v=await this.dequantizeQ4K(w,5*256);if(!F(v,tn(w,5),1e-4))return e("dequant.Q4_K")}{let A=x=>{let q=new Uint8Array(x);for(let O=0;O<x;O++)q[O]=Math.random()*256|0;return q},w=(x,q)=>{let O=new DataView(x.buffer),D=T=>q===210?T*210+208:T*q;for(let T=0;T*q<x.length;T++)O.setUint16(D(T),Se(.005+Math.random()*.05),!0);return x},h=w(A(136),34);if(!F(await this.dequantizeByType("Q8_0",h,128),rn(h,4),1e-4))return e("dequant.Q8_0");let G=w(A(88),22);if(!F(await this.dequantizeByType("Q5_0",G,128),nn(G,4),1e-4))return e("dequant.Q5_0");let y=w(A(840),210);if(!F(await this.dequantizeByType("Q6_K",y,4*256),on(y,4),1e-4))return e("dequant.Q6_K");let P=w(A(72),18);if(!F(await this.dequantizeByType("Q4_0",P,128),an(P,4),1e-4))return e("dequant.Q4_0");let U=A(704),_=new DataView(U.buffer);for(let x=0;x<4;x++)_.setUint16(x*176,Se(.005+Math.random()*.05),!0),_.setUint16(x*176+2,Se(.001+Math.random()*.02),!0);if(!F(await this.dequantizeByType("Q5_K",U,4*256),sn(U,4),1e-4))return e("dequant.Q5_K")}{let P={d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},U={attnNorm:t(16),wq:t(256),wk:t(128),wv:t(128),wo:t(256),bq:t(16),bk:t(8),bv:t(8),ffnNorm:t(16),wgate:t(256),wup:t(256),wdown:t(256)},_=t(48),q=(await this.layerForward(_,{...P,seq:3},U)).slice(32,48),O=new Float32Array(0),D=await this.layerForwardKV(_.slice(0,32),{...P,seq:2},U,0,O,O),T=await this.layerForwardKV(_.slice(32,48),{...P,seq:1},U,2,D.k,D.v);if(!F(T.out,q,.005))return e("layerForwardKV")}{let v=t(4),h=t(40),G=new Float32Array(10);for(let _=0;_<10;_++){let x=0;for(let q=0;q<4;q++)x+=v[q]*h[_*4+q];G[_]=x}let y=0;for(let _=1;_<10;_++)G[_]>G[y]&&(y=_);let P=this.uploadGpu(h),U=await this.argmaxProjection(v,[{buf:P,rows:10,r0:0}],4,10,!1);if(P.destroy?.(),U!==y)return e("argmaxProjection")}{let P={seq:4,d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},U={attnNorm:t(16),wq:t(256),wk:t(128),wv:t(128),wo:t(256),bq:t(16),bk:t(8),bv:t(8),ffnNorm:t(16),wgate:t(256),wup:t(256),wdown:t(256)},_=t(16),x=t(64),q=new Float32Array(0),O=await this.layerForwardKV(x,{...P,seq:4},U,0,q,q,!0),D=Ge(O.out.slice(48,64),_,1,16,1e-6),T={attnNorm:this.uploadGpu(U.attnNorm),wq:this.uploadGpu(U.wq),wk:this.uploadGpu(U.wk),wv:this.uploadGpu(U.wv),wo:this.uploadGpu(U.wo),ffnNorm:this.uploadGpu(U.ffnNorm),wgate:this.uploadGpu(U.wgate),wup:this.uploadGpu(U.wup),wdown:this.uploadGpu(U.wdown),bq:this.uploadGpu(U.bq),bk:this.uploadGpu(U.bk),bv:this.uploadGpu(U.bv)},R=this.uploadGpu(_),z=this.kvQuant;this.kvQuant=!1,this.resetKvGpu();let Q=await this.runDecodeGpu(x,{...P,seq:4},[T],0,R,"selftest-A");if(!F(Q,D,.008))return this.resetKvGpu(),this.kvQuant=z,e("runDecodeGpu.prefill");await this.runDecodeGpu(x.slice(0,48),{...P,seq:3},[T],0,R,"selftest-B");let $=await this.runDecodeGpu(x.slice(48,64),{...P,seq:1},[T],3,R,"selftest-B");if(!F($,D,.008))return this.resetKvGpu(),this.kvQuant=z,e("runDecodeGpu.decode");this.kvQuant=z,this.resetKvGpu();for(let V of Object.values(T))V?.destroy?.();R.destroy?.()}{let G=Float32Array.from({length:152064},()=>(Math.random()*2-1)*8),y=[...new Set(Array.from({length:40},()=>Math.floor(Math.random()*152064)))],P=G.slice();for(let S=0;S<152064;S++)P[S]=30*Math.tanh(P[S]/30);for(let S of y)P[S]=P[S]>0?P[S]/1.15:P[S]*1.15;let U=Array.from(P.keys()).sort((S,L)=>P[L]-P[S]).slice(0,64),_=globalThis,x=[],q=this.storage(152064*4);this.device.queue.writeBuffer(q,0,G),x.push(q);let O=this.device.createCommandEncoder(),D=this.uniform([152064],{offset:4,value:30});this.recordPass(O,"softcap_logits",[D,q],this.grid1D(152064));let T=this.bufU32(Uint32Array.from(y),_.GPUBufferUsage.STORAGE|_.GPUBufferUsage.COPY_DST),R=this.uniform([y.length],{offset:4,value:1.15});this.recordPass(O,"penalize_logits",[R,T,q],this.grid1D(y.length));let z=this.storage(512),Q=this.uniform([152064,64]);this.recordPass(O,this.topKParOk?"top_k_par":"top_k",[Q,q,z],[1,1,1]),x.push(D,T,R,Q,z);let $=this.device.createBuffer({size:512,usage:_.GPUBufferUsage.COPY_DST|_.GPUBufferUsage.MAP_READ});O.copyBufferToBuffer(z,0,$,0,512),this.device.queue.submit([O.finish()]),await $.mapAsync(_.GPUMapMode.READ);let V=new Uint32Array($.getMappedRange().slice(0));$.unmap(),$.destroy(),this.release(x);let Y=V.slice(0,64),N=new Float32Array(V.buffer,256,64);this.topKOk=!0;for(let S=0;S<64;S++){let L=Math.abs(N[S]-P[U[S]])<=1e-4*(1+Math.abs(P[U[S]])),j=Math.abs(P[Y[S]]-N[S])<=1e-4*(1+Math.abs(N[S]));if(!L||!j){this.topKOk=!1,console.error(`[selfValidate] top_k KO sur ce GPU (rang ${S}) \u2014 repli sur le sampling CPU plein-vocab (plus lent, m\xEAme r\xE9sultat).`);break}}}if(this.rwkvWkv7Ok){let h=t(128),G=t(16),y=t(16),P=t(16),U=t(16),_=t(16),x=Float32Array.from({length:16},()=>Math.random()*.5+.5),q=h.slice(),O=new Float32Array(16);for(let N=0;N<2;N++){let S=N*8;for(let L=0;L<8;L++){let j=N*8*8+L*8,H=P[S+L],I=0;for(let E=0;E<8;E++)I+=_[S+E]*q[j+E];let W=0;for(let E=0;E<8;E++){let J=x[S+E]*q[j+E]+H*y[S+E]+U[S+E]*I;q[j+E]=J,W+=G[S+E]*J}O[S+L]=W}}let D=await this.rwkvWkv7(h.slice(),G,x,y,P,_,U,2,8),T=(N,S)=>N.length===S.length&&N.every((L,j)=>Math.abs(L-S[j])<=.001*(1+Math.abs(S[j])));!T(D.S,q)||!T(D.y,O)?(this.rwkvWkv7Ok=!1,console.error("[selfValidate] RWKV-7 WKV KO sur ce GPU \u2014 une archi RWKV (moteur v2) refuserait de charger (non bloquant pour le chat texte).")):console.log("[selfValidate] RWKV-7 WKV OK (r\xE9currence \xE0 \xE9tat fixe, moteur v2)");let R=16,z=t(R),Q=t(R),$=t(R*6),V=new Float32Array(R*6);for(let N=0;N<6;N++)for(let S=0;S<R;S++){let L=N*R+S;V[L]=z[S]+(Q[S]-z[S])*$[L]}let Y=await this.rwkvTokenShift(z,Q,$,R);if(T(Y,V)?console.log("[selfValidate] RWKV-7 token-shift OK"):(this.rwkvWkv7Ok=!1,console.error("[selfValidate] RWKV-7 token-shift KO sur ce GPU (non bloquant pour le chat texte).")),this.rwkvResidentOk){let N=globalThis,S=N.GPUBufferUsage.STORAGE|N.GPUBufferUsage.COPY_DST|N.GPUBufferUsage.COPY_SRC,L=2,j=8,H=L*j,I=(E,J)=>{let se=Math.max(16,Math.ceil((E.length*4+(J?4:0))/16)*16),oe=this.device.createBuffer({size:se,usage:N.GPUBufferUsage.UNIFORM|N.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(oe,0,new Uint32Array(E)),J&&this.device.queue.writeBuffer(oe,J.off,new Float32Array([J.val])),oe},W=E=>this.device.createBuffer({size:E*4,usage:S});try{let E=t(H),J=t(H),se=t(H),oe=Float32Array.from({length:H},()=>Math.random()),fe=new Float32Array(H),xe=new Float32Array(H),ve=new Float32Array(H);for(let ie=0;ie<L;ie++){let Z=0;for(let de=0;de<j;de++){let ue=E[ie*j+de]*J[ie*j+de];Z+=ue*ue}Z=Math.sqrt(Z)||1e-12;for(let de=0;de<j;de++){let ue=ie*j+de,Ne=E[ue]*J[ue]/Z;xe[ue]=-Ne,ve[ue]=Ne*oe[ue],fe[ue]=E[ue]*(1+(oe[ue]-1)*se[ue])}}let _e=W(H),Ce=W(H),re=W(H);this.dispatch("rwkv_kprep",[I([L,j]),this.buf(E,S),this.buf(oe,S),this.buf(J,S),this.buf(se,S),_e,Ce,re],this.grid1D(L));let Ae=T(await this.readBack(_e,H*4),fe)&&T(await this.readBack(Ce,H*4),xe)&&T(await this.readBack(re,H*4),ve);_e.destroy?.(),Ce.destroy?.(),re.destroy?.();let le=t(H),Pt=t(H),Ut=t(H),Gt=t(H),xt=t(H),_t=t(H),Bt=new Float32Array(H);for(let ie=0;ie<L;ie++){let Z=ie*j,de=0;for(let ne=0;ne<j;ne++)de+=le[Z+ne];de/=j;let ue=0;for(let ne=0;ne<j;ne++){let Wt=le[Z+ne]-de;ue+=Wt*Wt}ue/=j;let Ne=1/Math.sqrt(ue+64e-5),Nt=0;for(let ne=0;ne<j;ne++)Nt+=Pt[Z+ne]*fe[Z+ne]*Ut[Z+ne];for(let ne=0;ne<j;ne++)Bt[Z+ne]=(le[Z+ne]-de)*Ne*xt[Z+ne]+_t[Z+ne]+Nt*Gt[Z+ne]}let et=new Float32Array(2*H);et.set(xt,0),et.set(_t,H);let tt=W(H);this.dispatch("rwkv_out_gn",[I([L,j],{off:8,val:64e-5}),this.buf(le,S),this.buf(Pt,S),this.buf(fe,S),this.buf(Ut,S),this.buf(Gt,S),this.buf(et,S),tt],this.grid1D(L));let Ft=T(await this.readBack(tt,H*4),Bt);tt.destroy?.();let qt=t(H),St=t(H),Qr=Float32Array.from(qt,(ie,Z)=>Math.exp(-.606531/(1+Math.exp(-(ie+St[Z]))))),rt=W(H);this.dispatch("rwkv_decay",[this.buf(qt,S),this.buf(St,S),rt],this.grid1D(H));let Tt=T(await this.readBack(rt,H*4),Qr);rt.destroy?.();let Ot=t(H),Mt=t(H),Ct=t(H),Dt=t(H),Vr=Float32Array.from(Ot,(ie,Z)=>ie+(Mt[Z]-ie)*(1/(1+Math.exp(-(Ct[Z]+Dt[Z]))))),nt=this.buf(Ot,S);this.dispatch("rwkv_vresid",[nt,this.buf(Mt,S),this.buf(Ct,S),this.buf(Dt,S)],this.grid1D(H));let Rt=T(await this.readBack(nt,H*4),Vr);nt.destroy?.();let Lt=t(H),jt=t(H),Kt=t(H),$r=Float32Array.from(Lt,(ie,Z)=>ie+(jt[Z]-ie)*Kt[Z]),at=W(H);this.dispatch("rwkv_lerp",[this.buf(Lt,S),this.buf(jt,S),this.buf(Kt,S),at],this.grid1D(H));let zt=T(await this.readBack(at,H*4),$r);at.destroy?.();let Ht=t(H),Yr=Float32Array.from(Ht,ie=>{let Z=Math.max(ie,0);return Z*Z}),st=W(H);this.dispatch("sqrelu",[this.buf(Ht,S),st],this.grid1D(H));let Et=T(await this.readBack(st,H*4),Yr);st.destroy?.(),!Ae||!Ft||!Tt||!Rt||!zt||!Et?(this.rwkvResidentOk=!1,console.error(`[selfValidate] glu RWKV r\xE9sidente KO sur ce GPU (kprep:${Ae} gn:${Ft} decay:${Tt} vresid:${Rt} lerp:${zt} sqrelu:${Et}) \u2014 repli forwardToken JS+readback (correct, lent).`)):console.log("[selfValidate] glu RWKV r\xE9sidente OK (kprep, out_gn, decay, vresid, lerp, sqrelu)")}catch(E){this.rwkvResidentOk=!1,console.error("[selfValidate] glu RWKV r\xE9sidente : erreur d\u2019ex\xE9cution \u2014 repli forwardToken JS+readback.",E)}}}if(this.lfm2ShortConvOk){let A=q=>Float32Array.from({length:q},()=>Math.random()*2-1),w=(q,O)=>q.length===O.length&&q.every((D,T)=>Math.abs(D-O[T])<=.001*(1+Math.abs(O[T]))),G=A(96),y=A(64),P=A(96),U=new Float32Array(32),_=y.slice();for(let q=0;q<32;q++){let O=G[q]*G[64+q],D=P[q*3+2]*O;for(let T=0;T<2;T++)D+=P[q*3+T]*y[T*32+q];for(let T=0;T+2<3;T++)_[T*32+q]=y[(T+1)*32+q];_[32+q]=O,U[q]=D*G[32+q]}let x=await this.lfm2ShortConv(G,y.slice(),P,32,3);!w(x.out,U)||!w(x.state,_)?(this.lfm2ShortConvOk=!1,console.error("[selfValidate] LFM2 shortconv KO sur ce GPU \u2014 une archi lfm2 refuserait de charger (non bloquant pour le reste).")):console.log("[selfValidate] LFM2 shortconv OK (conv courte gat\xE9e, moteur v2)")}let C=await this.validateDiffusion();C?console.warn("[selfValidate] image-gen primitive KO:",C,"(non bloquant \u2014 chemin texte intact)"):console.log("[selfValidate] image-gen primitives OK (silu, group_norm, conv2d, conv2d_direct, conv2d_direct_q8, relu, upsample_nearest, layernorm, quick_gelu, attention_full)");let K=await this.validateVideoResident();return K?(this.videoResidentOk=!1,console.warn("[selfValidate] motion r\xE9sident KO:",K,"\u2014 repli JS+readback (plus lent, m\xEAme r\xE9sultat).")):console.log("[selfValidate] motion r\xE9sident OK (video_motion_gather, video_motion_scatter, video_add_pe, attn_temporal)"),!0}async validateVideoResident(){let e=o=>Float32Array.from({length:o},()=>Math.random()*2-1),r=(o,u,c=.005)=>o.length===u.length&&o.every((l,d)=>Math.abs(l-u[d])<=c*(1+Math.abs(u[d])));{let o=e(120),u=new Float32Array(120);for(let d=0;d<5;d++)for(let g=0;g<3;g++)for(let p=0;p<8;p++)u[(d*3+g)*8+p]=o[(g*8+p)*5+d];let c=this.recordingSession(),l=await c.finish(c.videoGather(o,3,8,5),120);if(!r(l,u,1e-6))return"video_motion_gather"}{let o=e(120),u=e(120),c=new Float32Array(120);for(let g=0;g<3;g++)for(let p=0;p<8;p++)for(let m=0;m<5;m++)c[(g*8+p)*5+m]=o[(m*3+g)*8+p]+u[(g*8+p)*5+m];let l=this.recordingSession(),d=await l.finish(l.videoScatter(o,u,3,8,5),120);if(!r(d,c,1e-6))return"video_motion_scatter"}{let o=e(120),u=e(24),c=new Float32Array(120);for(let g=0;g<5;g++)for(let p=0;p<3;p++)for(let m=0;m<8;m++)c[(g*3+p)*8+m]=o[(g*3+p)*8+m]+u[p*8+m];let l=this.recordingSession(),d=await l.finish(l.videoAddPe(o,u,3,8,5),120);if(!r(d,c,1e-6))return"video_add_pe"}{let o=e(120),u=e(120),c=e(120),l=1/Math.sqrt(4),d=new Float32Array(120);for(let m=0;m<5;m++)for(let b=0;b<2;b++){let k=b*4,B=m*3;for(let M=0;M<3;M++){let F=(B+M)*8+k,C=new Float32Array(3),K=-1e30;for(let w=0;w<3;w++){let v=0,h=(B+w)*8+k;for(let G=0;G<4;G++)v+=o[F+G]*u[h+G];C[w]=v*l,C[w]>K&&(K=C[w])}let A=0;for(let w=0;w<3;w++)C[w]=Math.exp(C[w]-K),A+=C[w];for(let w=0;w<3;w++){let v=C[w]/A,h=(B+w)*8+k;for(let G=0;G<4;G++)d[F+G]+=v*c[h+G]}}}let g=this.recordingSession(),p=await g.finish(g.attnTemporal(o,u,c,5,3,2,4),120);if(!r(p,d))return"attn_temporal"}return null}async validateDiffusion(){let e=S=>Float32Array.from({length:S},()=>Math.random()*2-1),r=(S,L,j=.005)=>S.length===L.length&&S.every((H,I)=>Math.abs(H-L[I])<=j*(1+Math.abs(L[I]))),t=e(70),n=t.map(S=>S/(1+Math.exp(-S)));if(!r(await this.silu(t),n))return"silu";let a=4,i=5,s=2,o=1e-5,u=e(a*i),c=e(a),l=e(a),d=new Float32Array(a*i),g=a/s;for(let S=0;S<s;S++){let L=S*g*i,j=g*i,H=0;for(let E=0;E<j;E++)H+=u[L+E];H/=j;let I=0;for(let E=0;E<j;E++){let J=u[L+E]-H;I+=J*J}I/=j;let W=1/Math.sqrt(I+o);for(let E=0;E<j;E++){let J=S*g+Math.floor(E/i);d[L+E]=(u[L+E]-H)*W*c[J]+l[J]}}if(!r(await this.groupNorm(u,c,l,a,i,s,o),d))return"group_norm";let p=2,m=4,b=4,k=3,B=3,M=1,F=1,C=4,K=4,A=e(p*m*b),w=e(k*p*B*B),v=e(k),h=new Float32Array(k*C*K);for(let S=0;S<k;S++)for(let L=0;L<C;L++)for(let j=0;j<K;j++){let H=v[S];for(let I=0;I<p;I++)for(let W=0;W<B;W++)for(let E=0;E<B;E++){let J=L*M+W-F,se=j*M+E-F;J>=0&&J<m&&se>=0&&se<b&&(H+=A[I*m*b+J*b+se]*w[((S*p+I)*B+W)*B+E])}h[(S*C+L)*K+j]=H}if(!r(await this.conv2d(A,w,v,p,m,b,k,B,B,M,F),h))return"conv2d";if(!r(await this.conv2dDirect(A,w,v,p,m,b,k,B,B,M,F),h))return"conv2d_direct";{let I=e(1200),W=e(108),E=e(4),J=await this.conv2dDirect(I,W,E,3,20,20,4,3,3,1,1),se=this.convTiledOk;this.convTiledOk=!0;let oe=this.recordingSession(),fe=await oe.finish(oe.conv2d(I,W,E,3,20,20,4,3,3,1,1),1600);this.convTiledOk=se,r(fe,J)||(this.convTiledOk=!1,console.warn("[selfValidate] conv2d_3x3_tiled KO sur ce GPU \u2014 repli sur conv2d_direct (plus lent, m\xEAme r\xE9sultat)."))}{let j=e(8*m*b),H=e(32*B*B),I=e(4),W=Fe(H),E=await this.conv2dDirect(j,pe(W),I,8,m,b,4,B,B,M,F),J={codes:this.uploadGpuRaw(new Uint8Array(W.codes.buffer,W.codes.byteOffset,W.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(W.scales.buffer,W.scales.byteOffset,W.scales.byteLength))},se=this.recordingSession(),oe=await se.finish(se.conv2d(j,J,I,8,m,b,4,B,B,M,F),4*m*b);if(this.releaseGpu([J.codes,J.sc]),!r(oe,E))return"conv2d_direct_q8"}{let j=e(8*m*b),H=e(32*B*B),I=e(4),W=Be(H),E=await this.conv2dDirect(j,ge(W),I,8,m,b,4,B,B,M,F),J={nib:this.uploadGpuRaw(W.nibbles),sc:this.uploadGpuRaw(new Uint8Array(W.scales.buffer,W.scales.byteOffset,W.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(W.mins.buffer,W.mins.byteOffset,W.mins.byteLength))},se=this.recordingSession(),oe=await se.finish(se.conv2d(j,J,I,8,m,b,4,B,B,M,F),4*m*b);if(this.releaseGpu([J.nib,J.sc,J.mn]),!r(oe,E))return"conv2d_direct_q4"}{let L=e(66),j=new Uint16Array(66);for(let E=0;E<66;E++)j[E]=Se(L[E]);let H=new Float32Array(66);for(let E=0;E<66;E++)H[E]=me(j[E]);let I=this.f16ToF32Gpu(new Uint8Array(j.buffer,j.byteOffset,j.byteLength),66),W=await this.readGpu(I,66);if(I.destroy?.(),!r(W,H,1e-6))return"f16_to_f32"}let G=e(70);if(!r(await this.relu(G),G.map(S=>Math.max(S,0))))return"relu";let y=2,P=2,U=2,_=2,x=P*_,q=U*_,O=e(y*P*U),D=new Float32Array(y*x*q);for(let S=0;S<y;S++)for(let L=0;L<x;L++)for(let j=0;j<q;j++)D[S*x*q+L*q+j]=O[S*P*U+Math.floor(L/_)*U+Math.floor(j/_)];if(!r(await this.upsampleNearest(O,y,P,U,_),D))return"upsample_nearest";let T=2,R=8,z=1e-5,Q=e(T*R),$=e(R),V=e(R),Y=new Float32Array(T*R);for(let S=0;S<T;S++){let L=S*R,j=0;for(let W=0;W<R;W++)j+=Q[L+W];j/=R;let H=0;for(let W=0;W<R;W++){let E=Q[L+W]-j;H+=E*E}H/=R;let I=1/Math.sqrt(H+z);for(let W=0;W<R;W++)Y[L+W]=(Q[L+W]-j)*I*$[W]+V[W]}if(!r(await this.layernorm(Q,$,V,T,R,z),Y))return"layernorm";let N=e(70);if(!r(await this.quickGelu(N),N.map(S=>S/(1+Math.exp(-1.702*S)))))return"quick_gelu";{let W=1/Math.sqrt(4),E=e(24),J=e(40),se=e(40),oe=new Float32Array(24);for(let fe=0;fe<2;fe++)for(let xe=0;xe<3;xe++){let ve=new Float32Array(5),_e=-1/0;for(let re=0;re<5;re++){let Ae=0;for(let le=0;le<4;le++)Ae+=E[xe*8+fe*4+le]*J[re*8+fe*4+le];ve[re]=Ae*W,ve[re]>_e&&(_e=ve[re])}let Ce=0;for(let re=0;re<5;re++)ve[re]=Math.exp(ve[re]-_e),Ce+=ve[re];for(let re=0;re<4;re++){let Ae=0;for(let le=0;le<5;le++)Ae+=ve[le]/Ce*se[le*8+fe*4+re];oe[xe*8+fe*4+re]=Ae}}if(!r(await this.attentionFull(E,J,se,3,2,2,4,5),oe))return"attention_full"}if(this.attnFullWgOk){let S=[{nT:70,kvL:70,nH:5,hd:64},{nT:16,kvL:77,nH:5,hd:64},{nT:9,kvL:9,nH:8,hd:160}];for(let L of S){let j=L.nH*L.hd,H=e(L.nT*j),I=e(L.kvL*j),W=e(L.kvL*j),E=await this.attentionFull(H,I,W,L.nT,L.nH,L.nH,L.hd,L.kvL),J=await this.attentionFullWg(H,I,W,L.nT,L.nH,L.nH,L.hd,L.kvL);if(!r(J,E)){this.attnFullWgOk=!1,console.warn(`[selfValidate] attention_full_wg KO sur ce GPU (hd=${L.hd}, kv=${L.kvL}) \u2014 repli sur attention_full (plus lent, m\xEAme r\xE9sultat).`);break}}}return null}};X.timingOn=(()=>{try{return ae("timing")==="1"}catch{return!1}})(),X.profileOn=(()=>{try{return ae("gpuprofile")==="1"}catch{return!1}})(),X.MAX_WG_DIM=65535,X.BLOCK_ELEMS={Q4_K:256,Q5_K:256,Q6_K:256,Q8_0:32,Q5_0:32,Q4_0:32,F32:1,F16:1},X.DEQUANT_SHADER={Q4_K:"dequant_q4k",Q8_0:"dequant_q8_0",Q5_0:"dequant_q5_0",Q6_K:"dequant_q6k",Q4_0:"dequant_q4_0",Q5_K:"dequant_q5k"},X.STORAGE_USAGE=140;$e=X});function ur(f,e){let r=new DataView(f.buffer,f.byteOffset,f.byteLength),t=new Float32Array(e);for(let n=0;n<e;n++)t[n]=ce(r.getUint16(n*2,!0));return t}function cr(f,e){let r=new DataView(f.buffer,f.byteOffset,f.byteLength),t=new Float32Array(e);for(let n=0;n<e;n++)t[n]=r.getFloat32(n*4,!0);return t}function je(f,e,r,t){let n=0;for(let s=0;s<r;s++)n+=f[s]*f[s];let a=1/Math.sqrt(n/r+t),i=new Float32Array(r);for(let s=0;s<r;s++)i[s]=f[s]*a*e[s];return i}var ln,Oe,Ye,lr=te(()=>{"use strict";it();ot();De();ln=f=>f/(1+Math.exp(-f)),Oe=class Oe{constructor(e,r,t){this.engine=e;this.manifest=r;this.raw=t;this.w=new Map;this.g=new Map;this.pos=0;this.rLayers=[];this.tokNormGpu=null;this.normBufs=[];this.ffn=0}isBigProj(e){return/\.(shortconv\.(in_proj|out_proj)|attn_(q|k|v|output)|ffn_(gate|up|down))\.weight$/.test(e)}async load(e){if(!this.engine.lfm2ShortConvOk)throw new Error("kernel shortconv LFM2 invalid\xE9 sur ce GPU (selfValidate) \u2014 archi lfm2 refus\xE9e.");let r=this.manifest.arch;if(this.D=r.d,this.NH=r.nHeads,this.NKV=r.nKvHeads,this.HD=r.headDim,this.NL=r.blockCount,this.vocab=r.vocab,this.EPS=r.rmsEps,this.THETA=r.ropeTheta,!r.lfm2)throw new Error("manifest sans profil lfm2");this.LC=r.lfm2.lCache,this.convLayer=r.lfm2.kvHeadsPerLayer.map(t=>t===0),this.tok=e,this.stops=new Set(this.manifest.chat?.stopTokenIds?.length?this.manifest.chat.stopTokenIds:[7]);for(let[t,n]of Object.entries(this.manifest.tensors)){if(t==="token_embd.weight"){if(this.embedBytes=await this.raw(t),this.embedDtype=n.dtype,n.dtype==="q4"){let i=Ue(this.embedBytes,n.nElems);this.g.set("head",{kind:"q4",nib:this.engine.uploadGpuRaw(i.nibbles),sc:this.up(i.scales),mn:this.up(i.mins),IN:this.D,OUT:this.vocab})}else if(n.dtype==="q8"){let i=qe(this.embedBytes,n.nElems);this.g.set("head",{kind:"q8",codes:this.upI8(i.codes),sc:this.up(i.scales),IN:this.D,OUT:this.vocab})}continue}let a=await this.raw(t);if(this.isBigProj(t)&&(n.dtype==="q4"||n.dtype==="q8")){let i=n.shape[0],s=n.nElems/i;if(n.dtype==="q8"){let o=qe(a,n.nElems);this.g.set(t,{kind:"q8",codes:this.upI8(o.codes),sc:this.up(o.scales),IN:i,OUT:s})}else{let o=Ue(a,n.nElems);this.g.set(t,{kind:"q4",nib:this.engine.uploadGpuRaw(o.nibbles),sc:this.up(o.scales),mn:this.up(o.mins),IN:i,OUT:s})}}else this.w.set(t,n.dtype==="f32"?cr(a,n.nElems):n.dtype==="f16"?ur(a,n.nElems):n.dtype==="q8"?pe(qe(a,n.nElems)):ge(Ue(a,n.nElems)))}this.buildResidentLayers(),this.reset()}buildResidentLayers(){let e=r=>{let t=this.engine.uploadGpu(this.w.get(r));return this.normBufs.push(t),t};this.tokNormGpu=e("token_embd_norm.weight"),this.ffn=this.g.get("blk.0.ffn_gate.weight")?.OUT??0,this.rLayers=[];for(let r=0;r<this.NL;r++){let t=`blk.${r}.`,n={attnNorm:e(t+"attn_norm.weight"),ffnNorm:e(t+"ffn_norm.weight"),wgate:this.g.get(t+"ffn_gate.weight"),wup:this.g.get(t+"ffn_up.weight"),wdown:this.g.get(t+"ffn_down.weight")};this.convLayer[r]?this.rLayers.push({conv:!0,...n,convW:e(t+"shortconv.conv.weight"),inProj:this.g.get(t+"shortconv.in_proj.weight"),outProj:this.g.get(t+"shortconv.out_proj.weight")}):this.rLayers.push({conv:!1,...n,qNorm:e(t+"attn_q_norm.weight"),kNorm:e(t+"attn_k_norm.weight"),wq:this.g.get(t+"attn_q.weight"),wk:this.g.get(t+"attn_k.weight"),wv:this.g.get(t+"attn_v.weight"),wo:this.g.get(t+"attn_output.weight")})}}residentAvailable(){return this.engine.lfm2ResidentOk!==!1&&!!this.g.get("head")&&this.rLayers.length===this.NL&&this.ffn>0}cfg(){return{D:this.D,nHeads:this.NH,nKvHeads:this.NKV,headDim:this.HD,ffn:this.ffn,eps:this.EPS,theta:this.THETA,lc:this.LC,vocab:this.vocab}}embedsFor(e){let r=this.D,t=new Float32Array(e.length*r);for(let n=0;n<e.length;n++)t.set(this.embedRow(e[n]),n*r);return t}async logitsGpu(e,r,t){return this.pos=r+e.length,this.engine.lfm2LogitsGpu(this.embedsFor(e),e.length,this.cfg(),this.rLayers,this.g.get("head"),this.tokNormGpu,r,t)}async topKGpu(e,r,t,n,a,i=40){return this.pos=r+e.length,this.engine.lfm2TopKGpu(this.embedsFor(e),e.length,this.cfg(),this.rLayers,this.g.get("head"),this.tokNormGpu,r,t,n,a,i)}async prefillGpu(e,r,t){this.pos=r+e.length,await this.engine.lfm2PrefillGpu(this.embedsFor(e),e.length,this.cfg(),this.rLayers,this.tokNormGpu,r,t)}up(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}upI8(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}unload(){for(let e of this.g.values())for(let r of["nib","sc","mn","codes"])e[r]?.destroy?.();for(let e of this.normBufs)e?.destroy?.();this.normBufs=[],this.rLayers=[],this.tokNormGpu=null,this.engine.clearLfm2State?.(),this.g.clear(),this.w.clear()}reset(){this.pos=0,this.state=Array.from({length:this.NL},(e,r)=>this.convLayer[r]?{conv:new Float32Array((this.LC-1)*this.D)}:{K:[],V:[]})}async gemm(e,r){let t=this.g.get(e);if(!t){let n=this.w.get(e==="head"?"token_embd.weight":e),a=n.length/r.length,i=new Float32Array(a);for(let s=0;s<a;s++){let o=0,u=s*r.length;for(let c=0;c<r.length;c++)o+=n[u+c]*r[c];i[s]=o}return i}return t.kind==="q8"?this.engine.matmulQ8(r,t.codes,t.sc,1,t.IN,t.OUT):this.engine.matmulQ4(r,t.nib,t.sc,t.mn,1,t.IN,t.OUT)}embedRow(e){let r=this.D;if(this.embedDtype==="f16")return ur(this.embedBytes.subarray(e*r*2,e*r*2+r*2),r);if(this.embedDtype==="f32")return cr(this.embedBytes.subarray(e*r*4,e*r*4+r*4),r);if(this.embedDtype==="q8"){let o=this.vocab*r,u=r/32,c=new Int8Array(this.embedBytes.buffer,this.embedBytes.byteOffset+e*r,r),l=this.embedBytes.subarray(o+e*u*2,o+e*u*2+u*2),d=new DataView(l.buffer,l.byteOffset,l.byteLength),g=new Float32Array(r);for(let p=0;p<u;p++){let m=ce(d.getUint16(p*2,!0));for(let b=0;b<32;b++)g[p*32+b]=c[p*32+b]*m}return g}let t=this.vocab*r,n=r/32,a=t/2,i=t/2+t/32*2,s=new Uint8Array(r/2+n*2*2);return s.set(this.embedBytes.subarray(e*r/2,e*r/2+r/2),0),s.set(this.embedBytes.subarray(a+e*n*2,a+e*n*2+n*2),r/2),s.set(this.embedBytes.subarray(i+e*n*2,i+e*n*2+n*2),r/2+n*2),ge(Ue(s,r))}rope(e,r,t){let n=this.HD,a=e.slice();for(let i=0;i<r;i++){let s=i*n;for(let o=0;o<n/2;o++){let u=Math.pow(this.THETA,-2*o/n),c=Math.cos(t*u),l=Math.sin(t*u),d=e[s+o],g=e[s+o+n/2];a[s+o]=d*c-g*l,a[s+o+n/2]=d*l+g*c}}return a}async forwardToken(e){let r=this.D,t=this.pos++,n=this.embedRow(e);for(let a=0;a<this.NL;a++){let i=`blk.${a}.`,s=this.state[a],o=je(n,this.w.get(i+"attn_norm.weight"),r,this.EPS),u;if(this.convLayer[a]){let p=await this.gemm(i+"shortconv.in_proj.weight",o),m=await this.engine.lfm2ShortConv(p,s.conv,this.w.get(i+"shortconv.conv.weight"),r,this.LC);s.conv=m.state,u=await this.gemm(i+"shortconv.out_proj.weight",m.out)}else{let p=await this.gemm(i+"attn_q.weight",o),m=await this.gemm(i+"attn_k.weight",o),b=await this.gemm(i+"attn_v.weight",o),k=this.w.get(i+"attn_q_norm.weight"),B=this.w.get(i+"attn_k_norm.weight");for(let A=0;A<this.NH;A++)p.set(je(p.slice(A*this.HD,(A+1)*this.HD),k,this.HD,this.EPS),A*this.HD);for(let A=0;A<this.NKV;A++)m.set(je(m.slice(A*this.HD,(A+1)*this.HD),B,this.HD,this.EPS),A*this.HD);p=this.rope(p,this.NH,t),m=this.rope(m,this.NKV,t),s.K.push(m),s.V.push(b);let M=new Float32Array(this.NH*this.HD),F=s.K.length,C=1/Math.sqrt(this.HD),K=this.NH/this.NKV;for(let A=0;A<this.NH;A++){let w=Math.floor(A/K),v=A*this.HD,h=w*this.HD,G=new Float32Array(F),y=-1e30;for(let U=0;U<F;U++){let _=0;for(let x=0;x<this.HD;x++)_+=p[v+x]*s.K[U][h+x];G[U]=_*C,G[U]>y&&(y=G[U])}let P=0;for(let U=0;U<F;U++)G[U]=Math.exp(G[U]-y),P+=G[U];for(let U=0;U<F;U++){let _=G[U]/P;for(let x=0;x<this.HD;x++)M[v+x]+=_*s.V[U][h+x]}}u=await this.gemm(i+"attn_output.weight",M)}for(let p=0;p<r;p++)n[p]+=u[p];let c=je(n,this.w.get(i+"ffn_norm.weight"),r,this.EPS),l=await this.gemm(i+"ffn_gate.weight",c),d=await this.gemm(i+"ffn_up.weight",c);for(let p=0;p<l.length;p++)l[p]=ln(l[p])*d[p];let g=await this.gemm(i+"ffn_down.weight",l);for(let p=0;p<r;p++)n[p]+=g[p]}return n=je(n,this.w.get("token_embd_norm.weight"),r,this.EPS),this.gemm("head",n)}async classify(e,r){this.reset();let t;for(let a of this.tok.encode(e))t=await this.forwardToken(a);let n=r.map(a=>{let i=this.tok.encode(a);return{label:a,logit:t[i[1]??i[0]]}}).sort((a,i)=>i.logit-a.logit);return{label:n[0].label,scores:n}}banTools(e){for(let r of Oe.TOOL_BAN)r<e.length&&(e[r]=-1e30);return e}sampleTok(e,r,t){let{temperature:n=.8,topK:a=40,repeatPenalty:i=1.3}=t,s=new Set(r),o=[];for(let d=0;d<e.length;d++){let g=e[d];s.has(d)&&(g=g>0?g/i:g*i),o.push({i:d,v:g})}o.sort((d,g)=>g.v-d.v),o.length=a;let u=o[0].v,c=0;for(let d of o)d.p=Math.exp((d.v-u)/n),c+=d.p;let l=Math.random()*c;for(let d of o)if(l-=d.p,l<=0)return d.i;return o[0].i}async generate(e,r,t,n,a){this.reset();let i=this.tok.encode(e),s;for(let u of i)s=await this.forwardToken(u);let o=[];for(let u=0;u<r&&!n?.();u++){this.banTools(s);let c;if(a?.sample)c=this.sampleTok(s,o.slice(-64),a);else{c=0;for(let l=1;l<s.length;l++)s[l]>s[c]&&(c=l)}if(this.stops.has(c))break;o.push(c),t&&t(this.tok.decode(o)),s=await this.forwardToken(c)}return o.length?this.tok.decode(o):""}pickFromTopK(e,r){let t=[],n=[];for(let d=0;d<e.ids.length;d++)if(!Oe.TOOL_BAN.includes(e.ids[d])){if(e.vals[d]===-1/0)break;t.push(e.ids[d]),n.push(e.vals[d])}if(!t.length)return e.ids[0];if(!r?.sample)return t[0];let{temperature:a=.8,topK:i=40}=r,s=Math.min(i,t.length),o=n[0],u=0,c=new Array(s);for(let d=0;d<s;d++)c[d]=Math.exp((n[d]-o)/a),u+=c[d];let l=Math.random()*u;for(let d=0;d<s;d++)if(l-=c[d],l<=0)return t[d];return t[0]}async generateResident(e,r,t,n,a){if(!this.residentAvailable())return this.generate(e,r,t,n,a);let i="gen",s=a?.repeatPenalty??(a?.sample?1.3:1),o=this.tok.encode(e),u,c=0;for(;c<o.length;){if(n?.())return"";let g=Math.min(c+Oe.PREFILL_CHUNK,o.length),p=o.slice(c,g);g<o.length?await this.prefillGpu(p,c,i):u=await this.topKGpu(p,c,i,[],1,48),c=g}let l=o.length,d=[];for(let g=0;g<r&&!n?.();g++){let p=this.pickFromTopK(u,a);if(this.stops.has(p))break;d.push(p),t&&t(this.tok.decode(d)),u=await this.topKGpu([p],l,i,s!==1?[...new Set(d.slice(-64))]:[],s,48),l++}return d.length?this.tok.decode(d):""}};Oe.TOOL_BAN=[8,10,12],Oe.PREFILL_CHUNK=128;Ye=Oe});function fr(f){if(!f.length)return null;let e=1/0,r=0,t=0;for(let n of f)e=Math.min(e,n.offset),r=Math.max(r,n.offset+n.bytes),t+=n.bytes;return r-e>64<<20||r-e>t*1.5?null:{start:e,end:r}}function dr(f,e){let r=new Map;for(let a of Object.keys(f)){let i=a.match(/^blk\.(\d+)\./);if(!i)continue;let s=r.get(i[1]);s||r.set(i[1],s=[]),s.push(a)}let t=new Map,n=new Map;return async a=>{let i=f[a];if(!i)throw new Error(`tenseur absent : ${a}`);let s=a.match(/^blk\.(\d+)\./),o=s?r.get(s[1]):void 0,u=o?fr(o.map(b=>f[b])):null;if(!s||!o||!u)return e.bytes(i.offset,i.bytes);let c=s[1],l=t.get(c);l||(l=e.bytes(u.start,u.end-u.start).then(b=>({start:u.start,bytes:b})),t.set(c,l),n.set(c,o.length));let{start:d,bytes:g}=await l,p=g.subarray(i.offset-d,i.offset-d+i.bytes),m=(n.get(c)??1)-1;return m<=0?(t.delete(c),n.delete(c),new Uint8Array(p)):(n.set(c,m),p)}}var dt=te(()=>{"use strict"});var gr=te(()=>{"use strict"});function pr(f,e=16){return Math.ceil(f/e)*e}var hr=te(()=>{"use strict"});function dn(f){return pr(Ke+f)}function gt(f){if(f.length<Ke)throw new Error("BRIK: fichier tronqu\xE9 (en-t\xEAte)");let e=String.fromCharCode(f[0],f[1],f[2],f[3]);if(e!==fn)throw new Error(`BRIK: sceau magique absent (${e})`);let r=new DataView(f.buffer,f.byteOffset,f.byteLength),t=r.getUint32(4,!0),n=r.getUint32(8,!0);if(Ke+n>f.length)throw new Error("BRIK: manifeste tronqu\xE9");return{manifest:JSON.parse(new TextDecoder().decode(f.subarray(Ke,Ke+n))),version:t,dataStart:dn(n)}}function mr(f){let{manifest:e,version:r,dataStart:t}=gt(f);return{manifest:e,version:r,dataStart:t,data:f.subarray(t)}}var fn,Ke,vr=te(()=>{"use strict";hr();fn="BRIK",Ke=12});function br(f){let e=[...f].sort((n,a)=>n.id-a.id),r=[],t=0;for(let n of e)r[n.id]=t,t+=n.byteLength;return r}function wr(f){let e=br(f.shards),r={};for(let[n,a]of Object.entries(f.tensors)){let i=gn[a.dtype];if(!i)throw new Error(`dtype BRIK inconnu pour ${n} : ${a.dtype}`);if(e[a.shard]===void 0)throw new Error(`shard ${a.shard} absent du manifeste (tenseur ${n})`);r[n]={offset:e[a.shard]+a.offset,bytes:a.byteLength,nElems:a.nElems,type:i,shape:a.shape}}let t=f.arch;return{arch:t.arch,config:{d:t.d,nHeads:t.nHeads,nKvHeads:t.nKvHeads,headDim:t.headDim,ffn:t.ffn,blockCount:t.blockCount,ropeTheta:t.ropeTheta,rmsEps:t.rmsEps,attnLogitSoftcap:t.attnLogitSoftcap,finalLogitSoftcap:t.finalLogitSoftcap,attnScale:t.attnScale,act:t.act,rmsGainOnePlus:t.rmsGainOnePlus,embedScale:t.embedScale,rwkv:t.rwkv,lfm2:t.lfm2},tensors:r}}var gn,yr=te(()=>{"use strict";gn={f16:"F16",f32:"F32",q4:"Q4W",q8:"Q8W",q3:"Q3W"}});function hn(f,e,r){return`${f}${f.includes("?")?"&":"?"}__brik=${e}-${r}`}async function mn(){try{return await caches.open(pn)}catch{return null}}async function pt(f,e,r,t){let n=e+r-1,a=await mn(),i=hn(f,e,n);if(a){let o=await a.match(i);if(o)return{bytes:new Uint8Array(await o.arrayBuffer()),ranged:!0}}let s;for(let o=0;o<4;o++)try{let u=await fetch(f,{headers:{Range:`bytes=${e}-${n}`},signal:t});if(!u.ok&&u.status!==206)throw new Error(`range fetch ${e}-${n} \xE9chou\xE9 : HTTP ${u.status}`);let c=u.status===206,l=new Uint8Array(await u.arrayBuffer()),d=c?l:l.subarray(e,e+r);if(a&&c)try{await a.put(i,new Response(d,{headers:{"Content-Length":String(d.byteLength)}}))}catch(g){Ur(g)}return{bytes:d,ranged:c}}catch(u){if(t?.aborted)throw u;s=u,o<3&&await new Promise(c=>setTimeout(c,500*2**o))}throw s instanceof Error?s:new Error(String(s))}function Ur(f){kr||(kr=!0,console.warn("[cache] \xE9criture refus\xE9e (quota plein ? navigation priv\xE9e ?) \u2014 les t\xE9l\xE9chargements de mod\xE8les ne seront PAS r\xE9utilisables \xE0 la prochaine visite. Lib\xE9rez de l'espace via le panneau Stockage.",f))}async function vn(f){try{let n=await(await caches.open(Ar)).match(f);if(n)return new Uint8Array(await n.arrayBuffer())}catch{}let e=await fetch(f);if(!e.ok)throw new Error(`HTTP ${e.status}`);let r=new Uint8Array(await e.arrayBuffer());try{await(await caches.open(Ar)).put(f,new Response(r.slice(),{headers:{"Content-Length":String(r.byteLength)}}))}catch(t){Ur(t)}return r}function bn(f,e){return{bytes:async(r,t)=>(await pt(f,e+r,t)).bytes}}function wn(f){return{bytes:async(e,r)=>f.subarray(e,e+r)}}async function Gr(f){let e=await pt(f,0,12);if(!e.ranged){let i=await vn(f),{manifest:s,data:o}=mr(i);return Pr(s,wn(o))}let r=new DataView(e.bytes.buffer,e.bytes.byteOffset,12).getUint32(8,!0),t=await pt(f,0,12+r),{manifest:n,dataStart:a}=gt(t.bytes);return Pr(n,bn(f,a))}function Pr(f,e){if(f.model?.uiArch==="image")throw new Error("Ce fichier est un BRIK image (UNet/CLIP) \u2014 il se charge via la tuile de g\xE9n\xE9ration d'image, pas comme un LLM.");return{source:e,manifest:wr(f),tokenizerId:f.tokenizer?.id,tokenizer:f.tokenizer,uiArch:f.model?.uiArch,modelName:f.model.name}}var pn,kr,Ar,xr=te(()=>{"use strict";"use client";dt();gr();vr();yr();pn="brik-range-v1";kr=!1;Ar="brimkern-model-cache"});function yn(f){let e=f.indexOf("<think>");if(e===-1)return f;let r=f.indexOf("</think>",e);return(r===-1?f.slice(0,e):f.slice(0,e)+f.slice(r+8)).trim()}function _r(f,e,r){f=f.map(n=>n.role==="assistant"?{...n,content:yn(n.content)}:n);let t="";if(e==="deepseek"){t+="<\uFF5Cbegin\u2581of\u2581sentence\uFF5C>",r.trim()&&(t+=r);for(let n of f)n.role==="user"?t+=`<\uFF5CUser\uFF5C>${n.content}`:n.role==="assistant"&&(t+=`<\uFF5CAssistant\uFF5C>${n.content}<\uFF5Cend\u2581of\u2581sentence\uFF5C>`);return t+="<\uFF5CAssistant\uFF5C>",t}if(e==="rwkv7"){r.trim()&&(t+=`System: ${r.trim()}

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
`}return t}var Br=te(()=>{"use strict"});function kn(){let f=[];for(let a=33;a<=126;a++)f.push(a);for(let a=161;a<=172;a++)f.push(a);for(let a=174;a<=255;a++)f.push(a);let e=f.slice(),r=0;for(let a=0;a<256;a++)f.includes(a)||(f.push(a),e.push(256+r),r++);let t=new Array(256),n=new Map;for(let a=0;a<f.length;a++)t[f[a]]=String.fromCodePoint(e[a]),n.set(String.fromCodePoint(e[a]),f[a]);return{enc:t,dec:n}}var Fr,Ie,qr=te(()=>{"use strict";Fr="'(?:[sdmt]|ll|ve|re)| ?\\p{L}+| ?\\p{N}+| ?[^\\s\\p{L}\\p{N}]+|\\s+(?!\\S)|\\s+",Ie=class f{constructor(e){this.vocab=new Map;this.idToTok=new Map;this.ranks=new Map;this.added=[];this.specialIds=new Set;this.addedRe=null;this.bosIds=[];this.cache=new Map;let r=typeof e=="string"?JSON.parse(e):e;if(r?.model?.type!=="BPE")throw new Error(`BpeTokenizer : model.type ${r?.model?.type} non couvert (BPE uniquement)`);({enc:this.byteEnc,dec:this.byteDec}=kn());for(let[s,o]of Object.entries(r.model.vocab))this.vocab.set(s,o),this.idToTok.set(o,s);(r.model.merges??[]).forEach((s,o)=>this.ranks.set(Array.isArray(s)?`${s[0]} ${s[1]}`:s,o));for(let s of r.added_tokens??[])this.added.push(s),this.vocab.set(s.content,s.id),this.idToTok.set(s.id,s.content),s.special&&this.specialIds.add(s.id);if(this.added.length){let s=this.added.map(o=>o.content.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).sort((o,u)=>u.length-o.length);this.addedRe=new RegExp(`(${s.join("|")})`,"g")}let n=f.findSplitPattern(r.pre_tokenizer)??Fr;this.splitRe=new RegExp(n,"gu");let a=s=>{if(!s)return null;if(s.type==="TemplateProcessing")return s.single;if(s.type==="Sequence")for(let o of s.processors??[]){let u=a(o);if(u)return u}return null},i=a(r.post_processor);if(Array.isArray(i))for(let s of i)if(s.SpecialToken){let o=this.vocab.get(s.SpecialToken.id);o!==void 0&&this.bosIds.push(o)}else break}static findSplitPattern(e){if(!e)return null;if(e.type==="Split"&&e.pattern?.Regex)return e.pattern.Regex;if(e.type==="ByteLevel"&&e.use_regex!==!1)return Fr;if(e.type==="Sequence")for(let r of e.pretokenizers??[]){let t=f.findSplitPattern(r);if(t)return t}return null}bpe(e){let r=this.cache.get(e);if(r)return r;let t=Array.from(e);for(;t.length>1;){let a=-1,i=1/0;for(let s=0;s<t.length-1;s++){let o=this.ranks.get(`${t[s]} ${t[s+1]}`);o!==void 0&&o<i&&(i=o,a=s)}if(a<0)break;t=[...t.slice(0,a),t[a]+t[a+1],...t.slice(a+2)]}let n=[];for(let a of t){let i=this.vocab.get(a);if(i!==void 0)n.push(i);else for(let s of a){let o=this.vocab.get(s);o!==void 0&&n.push(o)}}return this.cache.set(e,n),n}encodeChunk(e){let r=[];for(let t of e.match(this.splitRe)??[]){let n=new TextEncoder().encode(t),a="";for(let i of n)a+=this.byteEnc[i];r.push(...this.bpe(a))}return r}encode(e){let r=[...this.bosIds];if(this.addedRe)for(let t of e.split(this.addedRe)){if(!t)continue;let n=this.vocab.get(t);n!==void 0&&this.added.some(a=>a.content===t)?r.push(n):r.push(...this.encodeChunk(t))}else r.push(...this.encodeChunk(e));return r}decode(e){let r=[];for(let t of e){if(this.specialIds.has(t))continue;let n=this.idToTok.get(t);if(n!==void 0)for(let a of n){let i=this.byteDec.get(a);if(i!==void 0)r.push(i);else for(let s of new TextEncoder().encode(a))r.push(s)}}return new TextDecoder("utf-8",{fatal:!1}).decode(new Uint8Array(r))}}});async function Gn(f,e){let r=new $e;if(!await r.init())throw new Error("WebGPU indisponible sur ce navigateur.");r.onLost=g=>{console.warn("[brimkern] device GPU perdu ("+(g?.reason||"unknown")+") \u2014 rechargement au prochain appel"),ke.delete(f)},await r.selfValidate(),e("t\xE9l\xE9chargement du mod\xE8le\u2026");let t=await Gr(f),n=t.manifest;if(!n?.config?.lfm2){let g=n?.arch??n?.config?.arch??"unknown";throw new Error(`Brimkern SDK v0 runs LFM2 .brik models only \u2014 this file's architecture is "${g}". Use the default model (omit \`model\`), or convert/pick an LFM2 .brik. Full model support lives in the app: https://brimkern.com/chat`)}let a=n.tensors["token_embd.weight"],i={arch:{...n.config,arch:"lfm2",vocab:a?a.nElems/n.config.d:0},tensors:Object.fromEntries(Object.entries(n.tensors).map(([g,p])=>[g,{dtype:Pn[p.type]??p.type,shape:p.shape,nElems:p.nElems,shard:0,offset:p.offset,byteLength:p.bytes}])),shards:[{id:0,file:"",byteLength:0}],chat:{template:"chatml",stopTokenIds:[7,2,8,10,12]}},s=Object.values(n.tensors).reduce((g,p)=>g+p.bytes,0),o=0,u=dr(n.tensors,t.source),c=async g=>{let p=n.tensors[g];if(!p)throw new Error(`tenseur absent : ${g}`);let m=await u(g);return o+=p.bytes,e("t\xE9l\xE9chargement du mod\xE8le\u2026",{loaded:o,total:s}),m};e("tokenizer\u2026");let l;try{let g=new Ie(t.tokenizer.json);l={encode:p=>g.encode(p),decode:p=>g.decode(p)}}catch(g){console.warn("[brimkern] tokenizer.json non couvert par le BPE bundl\xE9 \u2014 repli transformers.js (CDN)",g);let p=await import(An),m=new p.PreTrainedTokenizer(JSON.parse(t.tokenizer.json),JSON.parse(t.tokenizer.config));l={encode:b=>Array.from(m(b).input_ids.data,k=>Number(k)),decode:b=>m.decode(b,{skip_special_tokens:!0})}}let d=new Ye(r,i,c);return e("poids sur le GPU\u2026"),await d.load(l),{core:d,engine:r}}function ze(f){return f&&(f.startsWith("https://")||/^http:\/\/(localhost|127\.0\.0\.1)[:/]/.test(f))?f:Sr[f||"lfm2.5-230m"]||Sr["lfm2.5-230m"]}function Je(f,e){let r=ke.get(f);if(!r){let t={status:"initialisation\u2026",state:"loading",listeners:new Set,promise:null};t.promise=Gn(f,(n,a)=>{t.status=n,t.progress=a,t.listeners.forEach(i=>i(n,a))}).then(n=>(t.state="ready",n)).catch(n=>{throw t.state="error",ke.delete(f),n}),ke.set(f,t),r=t}return e&&(e(r.status,r.progress),r.listeners.add(e),r.promise.finally(()=>r.listeners.delete(e)).catch(()=>{})),r.promise}async function Tr(f,e){let r=await Je(f,e);return r.engine.lost?(ke.delete(f),(await Je(f,e)).core):r.core}async function Or(f,e){let r=await Tr(f);try{return await e(r)}catch(t){let n=ke.get(f);if(!(!n||await n.promise.then(i=>i.engine.lost).catch(()=>!0)))throw t;return console.warn("[brimkern] g\xE9n\xE9ration interrompue par une perte de device \u2014 nouvelle tentative"),ke.delete(f),e(await Tr(f))}}function xn(f,e){let r=f.replace(/<\|[a-z_]+\|>/g,"");if(e){let t=r.replace(/^\s*(hello|hi|hey|bonjour|salut)\s*[!,.]\s*/i,"");t.trim()&&(r=t)}return r.trimEnd()}async function Mr(f,e,r,t,n,a,i,s=[]){let o=_r([...s,...e.slice(-Un)],"lfm2",r),u=s.some(d=>d.role==="assistant")||e.some(d=>d.role==="assistant"),c="";return await(f.residentAvailable?.()?f.generateResident.bind(f):f.generate.bind(f))(o,t,d=>{c=xn(d,u),a?.(c)},i,{sample:!0,temperature:n,topK:40,repeatPenalty:1.3}),c}var An,Sr,Pn,Un,ke,ht=te(()=>{"use strict";or();lr();xr();dt();Br();qr();An="https://esm.sh/@huggingface/transformers@4.2.0",Sr={"lfm2.5-230m":"https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik"},Pn={F16:"f16",F32:"f32",Q4W:"q4",Q8W:"q8",Q3W:"q3"},Un=12;ke=new Map});var Cr={};Qt(Cr,{LocalBackend:()=>He});var He,mt=te(()=>{"use strict";ht();He=class{constructor(){this.kind="main"}async preload(e,r){await Je(e,r)}state(e){return ke.get(e)?.state}turn(e,r,t){return Or(e.url,n=>Mr(n,e.history,e.system,e.maxTokens,e.temperature,r,()=>!!t?.aborted,e.pinned))}dispose(){}}});function _n(){try{if(typeof document>"u")return"";let f=document.currentScript;if(f?.src)return new URL(f.src,document.baseURI).href}catch{}return""}function Rr(f){Dr=f}function Lr(){return Dr||Bn}var Bn,Dr,vt=te(()=>{"use strict";Bn=_n(),Dr=""});var jr={};Qt(jr,{WorkerBackend:()=>bt});var bt,Kr=te(()=>{"use strict";vt();bt=class{constructor(){this.kind="worker";this.seq=0;this.pending=new Map;this.states=new Map;if(typeof Worker>"u")throw new Error("Worker indisponible");let e=Lr();if(!e)throw new Error("URL du script introuvable (import ESM ?) \u2014 passez workerUrl");let r=(()=>{try{return location.search}catch{return""}})(),t=`self.__brimkernSearch=${JSON.stringify(r)};importScripts(${JSON.stringify(e)});`,n=new Blob([t],{type:"text/javascript"});this.url=URL.createObjectURL(n),this.worker=new Worker(this.url);let a,i;this.hello=new Promise((s,o)=>{a=s,i=o}),this.worker.onerror=s=>i(new Error(`worker: ${s.message||"\xE9chec de chargement"}`)),this.worker.onmessage=s=>{let o=s.data;if(o.type==="hello"){a();return}let u=this.pending.get(o.id);if(u){if(o.type==="progress"){u.onProgress?.(o.status,o.progress);return}if(o.type==="token"){u.onToken?.(o.text);return}this.pending.delete(o.id),o.type==="error"?u.reject(new Error(o.message)):o.type==="state"?u.resolve(o.state):u.resolve(o.text??"")}}}ready(){return this.hello}send(e,r={}){let t=++this.seq,n=new Promise((a,i)=>{this.pending.set(t,{resolve:a,reject:i,...r}),this.worker.postMessage({...e,id:t})});return{id:t,done:n}}async preload(e,r){await this.hello,this.states.get(e)!=="ready"&&this.states.set(e,"loading");try{await this.send({type:"preload",url:e},{onProgress:r}).done,this.states.set(e,"ready")}catch(t){throw this.states.set(e,"error"),t}}state(e){return this.states.get(e)}async turn(e,r,t){await this.hello;let{id:n,done:a}=this.send({type:"turn",req:e},{onToken:r}),i=()=>this.worker.postMessage({type:"stop",id:n});t?.aborted?i():t?.addEventListener("abort",i,{once:!0});try{let s=await a;return this.states.set(e.url,"ready"),s}finally{t?.removeEventListener("abort",i)}}dispose(){this.worker.terminate(),URL.revokeObjectURL(this.url);for(let e of this.pending.values())e.reject(new Error("worker arr\xEAt\xE9"));this.pending.clear()}}});var Fn={};var wt,Xe,Me,Hr=te(()=>{"use strict";mt();wt=new He,Xe=new Set,Me=f=>self.postMessage(f);self.onmessage=async f=>{let e=f.data;if(e.type==="stop"){Xe.add(e.id);return}if(e.type==="state"){Me({type:"state",id:e.id,state:wt.state(e.url)});return}try{if(e.type==="preload"){await wt.preload(e.url,(r,t)=>Me({type:"progress",id:e.id,status:r,progress:t})),Me({type:"done",id:e.id});return}if(e.type==="turn"){let r=new AbortController,t=new Proxy(r.signal,{get:(u,c)=>c==="aborted"?Xe.has(e.id):Reflect.get(u,c)}),n=16,a=0,i=null,s=()=>{i!==null&&(Me({type:"token",id:e.id,text:i}),i=null,a=Date.now())},o=await wt.turn(e.req,u=>{i=u,Date.now()-a>=n&&s()},t);s(),Me({type:"done",id:e.id,text:o}),Xe.delete(e.id);return}}catch(r){Xe.delete(e.id),Me({type:"error",id:e.id,message:r instanceof Error?r.message:String(r)})}};Me({type:"hello"})});var Jr=new Set(["avec","pour","dans","les","des","une","est","sur","par","que","qui","quoi","comment","pourquoi","quand","vous","nous","votre","notre","mais","plus","tout","tous","cette","sont","avez","puis","faire","fait","the","and","for","with","what","who","how","why","when","about","your","our","you","are","can","does","did","this","that","from","have"]);function Vt(f){let e=(f.toLowerCase().match(/[\p{L}\p{N}]{3,}/gu)??[]).filter(r=>!Jr.has(r));return[...new Set(e)]}function $t(f,e=600){let r=[];return f.forEach((t,n)=>{let a=(t.title||"").trim(),i=(t.text||"").split(/\n\s*\n+/).map(u=>u.trim()).filter(Boolean),s="",o=()=>{s.trim()&&r.push({title:a,text:s.trim(),doc:n}),s=""};for(let u of i){if(u.length>e*1.6){o();let c=u.split(/(?<=[.!?])\s+/),l="";for(let d of c)l&&(l+" "+d).length>e?(r.push({title:a,text:l.trim(),doc:n}),l=d):l=l?`${l} ${d}`:d;l.trim()&&r.push({title:a,text:l.trim(),doc:n});continue}s&&(s+`

`+u).length>e&&o(),s=s?`${s}

${u}`:u}o()}),r}function Xr(f,e,r){if(!f.length)return 0;let t=`${e.title} ${e.text}`.toLowerCase(),n=e.title.toLowerCase(),a=0,i=0;for(let s of f){let o=r.get(s)??1;i+=o,t.includes(s)&&(a+=o*(n.includes(s)?1.5:1))}return i?a/i:0}function Zr(f){let e=new Map;for(let n of f)for(let a of Vt(`${n.title} ${n.text}`))e.set(a,(e.get(a)??0)+1);let r=new Map,t=Math.max(1,f.length);for(let[n,a]of e)r.set(n,Math.log(1+t/a));return r}function Yt(f,e,r=1200,t=3,n=.34){let a=Vt(f);if(!a.length||!e.length)return[];let i=Zr(e),s=e.map(l=>({c:l,s:Xr(a,l,i)})).filter(l=>l.s>=n).sort((l,d)=>d.s-l.s),o=[],u=new Set,c=r;for(let{c:l}of s)o.length>=t||l.text.length>c||u.has(l.doc)||(o.push(l),u.add(l.doc),c-=l.text.length);for(let{c:l}of s){if(o.length>=t)break;o.includes(l)||l.text.length>c||(o.push(l),c-=l.text.length)}return o}function It(f){return f.length?`

Answer using ONLY the reference notes below. If the answer is not in them, say you do not have that information \u2014 never fill the gap with what you assume.

--- NOTES ---
${f.map((r,t)=>`[${t+1}]${r.title?` ${r.title}`:""}
${r.text}`).join(`

`)}
--- END OF NOTES ---`:`

No reference note matches this question. Say that you do not have this information \u2014 do not guess.`}function Jt(f){let e=Array.isArray(f)?f:[f],r=[];for(let t of e)typeof t=="string"&&t.trim()?r.push({text:t}):t&&typeof t=="object"&&typeof t.text=="string"&&t.text.trim()&&r.push({title:t.title,text:t.text});return r}ht();async function zr(f){let{LocalBackend:e}=await Promise.resolve().then(()=>(mt(),Cr));if(f!==!0)return new e;try{let{WorkerBackend:r}=await Promise.resolve().then(()=>(Kr(),jr)),t=new r;return await t.ready(),t}catch(r){return console.warn("[brimkern] Web Worker indisponible \u2014 inf\xE9rence sur le thread principal",r),new e}}vt();var qn=typeof self<"u"&&typeof self.importScripts=="function"&&typeof document>"u";qn&&Promise.resolve().then(()=>(Hr(),Fn));var Ze=null,kt=null,yt;function Ee(){return Ze||(Ze=zr(yt).then(f=>(kt=f,f))),Ze}var Sn=()=>kt?.kind??"pending";function At(f){if(f.workerUrl&&Rr(f.workerUrl),f.worker!==void 0){if(Ze&&yt!==f.worker){console.warn("[brimkern] option `worker` ignor\xE9e : le backend est d\xE9j\xE0 d\xE9marr\xE9 et partag\xE9 par la page.");return}yt=f.worker}}var Tn=`
Answer briefly and honestly. If you do not know something, say so \u2014 never invent facts or details.
You have no tools and no internet access: never emit tool calls, reply in plain text only.`;function Nr(f){let e=(f.system||"You are a helpful assistant.")+Tn,r=i=>i.flatMap(s=>[{role:"user",content:s.user},{role:"assistant",content:s.assistant}]);if(!f.knowledge)return{system:()=>e,userTurn:i=>i,pinned:r(f.examples||[])};let t=$t(Jt(f.knowledge)),n=f.knowledgeBudget??1200,a=e+`

The user message may include reference notes between --- markers. When it does, answer from those notes and quote their figures exactly. When it says no note matches, say you do not have that information.`;return{system:()=>a,userTurn:i=>It(Yt(i,t,n)).trim()+`

Question: ${i}`,pinned:r([...On(),...f.examples||[]])}}function On(){return[{user:`--- NOTES ---
[1] Opening hours
The workshop is open on Thursday until 8pm.
--- END OF NOTES ---

Question: Are you open on Thursday evening?`,assistant:"Yes \u2014 the workshop is open on Thursday until 8pm."},{user:`No reference note matches this question.

Question: Who won the 1998 World Cup?`,assistant:"I do not have that information in my notes."}]}function Wr(f={}){At(f);let e=ze(f.model),r=f.maxTokens||220,t=f.temperature??.55,n=Nr(f),a=n.pinned,i=[],s=!1,o=!1;return{async ask(u,c={}){if(o)throw new Error("session d\xE9truite");if(s)throw new Error("g\xE9n\xE9ration d\xE9j\xE0 en cours sur cette session");s=!0,i.push({role:"user",content:u});try{let l=[...i.slice(0,-1),{role:"user",content:n.userTurn(u)}],d={url:e,history:l,system:n.system(u),maxTokens:r,temperature:t,pinned:a},g=await(await Ee()).turn(d,c.onToken,c.signal);return c.signal?.aborted?(i.pop(),""):(i.push({role:"assistant",content:g}),g)}catch(l){throw i.pop(),l}finally{s=!1}},reset(){i=[]},destroy(){o=!0,i=[]},get history(){return i.slice()}}}function Mn(f){if(document.getElementById("bk-style"))return;let e=document.createElement("style");e.id="bk-style",e.textContent=`
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
  `,document.head.appendChild(e)}function Cn(f){if(!f)return"#c72c1e";if(/^#[0-9a-fA-F]{3,8}$/.test(f))return f;try{if(typeof CSS<"u"&&CSS.supports("color",f)&&!/[{};()]/.test(f))return f}catch{}return"#c72c1e"}function Er(f){let e=Nr(f),r=Cn(f.accent),t=f.title||"Assistant",n=f.maxTokens||220;Mn(r);let a=document.createElement("button");a.className="bk-fab",a.setAttribute("aria-label","Ouvrir le chat"),a.textContent="\u{1F4AC}";let i=document.createElement("div");i.className="bk-panel",i.innerHTML=`
    <div class="bk-hd"><span class="bk-dot"></span><span>${Dn(t)}</span><button class="bk-x" aria-label="Fermer">\xD7</button></div>
    <div class="bk-msgs"></div>
    <div class="bk-foot"><textarea class="bk-in" rows="1" placeholder="\xC9cris un message\u2026"></textarea><button class="bk-send">\u2191</button></div>
    <div class="bk-note">IA locale \u2014 tourne sur votre GPU, aucune donn\xE9e envoy\xE9e.</div>`,document.body.appendChild(a),document.body.appendChild(i);let s=i.querySelector(".bk-msgs"),o=i.querySelector(".bk-in"),u=i.querySelector(".bk-send"),c=[],l=!1,d=!1,g=(k,B)=>{let M=document.createElement("div");return M.className=`bk-m ${k==="user"?"bk-u":"bk-a"}`,M.textContent=B,s.appendChild(M),s.scrollTop=s.scrollHeight,M};f.greeting&&(c.push({role:"assistant",content:f.greeting}),g("assistant",f.greeting));let p=ze(f.model),m=()=>{if(!d){d=!0;let k=g("assistant","Initialisation\u2026");k.classList.add("bk-status"),Ee().then(B=>B.preload(p,(M,F)=>{k.textContent=F?.total?`${M} ${Math.round(F.loaded/1048576)} / ${Math.round(F.total/1048576)} Mo`:M})).then(()=>k.remove()).catch(B=>{k.textContent="Erreur : "+(B?.message||B),d=!1})}return Ee()},b=async()=>{let k=o.value.trim();if(!k||l)return;l=!0,u.disabled=!0,o.value="",c.push({role:"user",content:k}),g("user",k);let B=g("assistant","\u2026");try{await m();let M=[...c.slice(0,-1),{role:"user",content:e.userTurn(k)}],F={url:p,history:M,system:e.system(k),maxTokens:n,temperature:.55,pinned:e.pinned},C=await(await Ee()).turn(F,K=>{B.textContent=K||"\u2026",s.scrollTop=s.scrollHeight});C||(C="Sorry, I can only answer in plain text here \u2014 could you rephrase?"),B.textContent=C,c.push({role:"assistant",content:C})}catch(M){B.textContent="Erreur : "+(M?.message||String(M))}finally{l=!1,u.disabled=!1,o.focus()}};a.onclick=()=>{i.classList.toggle("bk-open")&&(o.focus(),m())},i.querySelector(".bk-x").onclick=()=>i.classList.remove("bk-open"),u.onclick=()=>{b()},o.onkeydown=k=>{k.key==="Enter"&&!k.shiftKey&&(k.preventDefault(),b())}}function Dn(f){return f.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}var Rn=(f={})=>{if(typeof window>"u"||typeof document>"u"){console.warn("[brimkern] embed() ignor\xE9 : aucun DOM (rendu serveur ?). Appelez-le dans un effet client.");return}At(f),document.body?Er(f):window.addEventListener("DOMContentLoaded",()=>Er(f))};var Ln=async f=>{if(typeof f!="object"||f===null||typeof f.prompt!="string")throw new TypeError(`Brimkern.generate expects a single object: generate({ prompt: "\u2026", model?, system? }). Received ${typeof f}${typeof f=="object"&&f?" without a `prompt` string":""}.`);return Wr(f).ask(f.prompt,{onToken:f.onToken,signal:f.signal})},jn=(f={})=>(At(f),typeof navigator<"u"&&"gpu"in navigator?Ee().then(e=>e.preload(ze(f.model),f.onProgress)).then(()=>!0).catch(()=>!1):Promise.resolve(!1)),Kn=f=>typeof navigator>"u"||!("gpu"in navigator)?"unavailable":kt?.state(ze(f))??"idle";typeof window<"u"&&(window.Brimkern={embed:Rn,createSession:Wr,generate:Ln,preload:jn,status:Kn,runtime:Sn});})();
