"use strict";(()=>{var fn=Object.defineProperty;var ae=(l,e,r)=>()=>{if(r)throw r[0];try{return l&&(e=l(l=0)),e}catch(t){throw r=[t],t}};var nr=(l,e)=>{for(var r in e)fn(l,r,{get:e[r],enumerable:!0})};function Be(l){let e=new Float32Array(1),r=new Uint32Array(e.buffer);e[0]=l;let t=r[0],n=t>>16&32768,s=(t>>23&255)-127+15,a=t&8388607;return s<=0?n:s>=31?n|31743:(a=(a>>13)+(a>>12&1),a===1024&&(a=0,s+=1),n|s<<10|a&1023)}function ge(l){let e=l>>15&1,r=l>>10&31,t=l&1023,n;return r===0?n=t*59604645e-15:r===31?n=t?NaN:1/0:n=(1+t/1024)*2**(r-15),e===1?-n:n}var je=ae(()=>{"use strict"});function ke(l){let e=l.length;if(e%ye!==0)throw new Error(`q4web: length ${e} not a multiple of ${ye}`);let r=e/ye,t=new Uint8Array(e/2),n=new Uint16Array(r),s=new Uint16Array(r);for(let a=0;a<r;a++){let i=a*ye,o=1/0,u=-1/0;for(let h=0;h<ye;h++){let w=l[i+h];w<o&&(o=w),w>u&&(u=w)}let c=(u-o)/15||1e-8,d=Be(c),f=Be(o);n[a]=d,s[a]=f;let g=ge(d)||1e-8,p=ge(f);for(let h=0;h<ye;h++){let w=Math.round((l[i+h]-p)/g);w=w<0?0:w>15?15:w;let P=i+h;(h&1)===0?t[P>>1]=w:t[P>>1]|=w<<4}}return{nibbles:t,scales:n,mins:s,nElems:e}}function qe(l,e){let r=e/ye,t=e/2,n=l.slice(0,t),s=new Uint16Array(r),a=new Uint16Array(r),i=new DataView(l.buffer,l.byteOffset);for(let o=0;o<r;o++)s[o]=i.getUint16(t+o*2,!0);for(let o=0;o<r;o++)a[o]=i.getUint16(t+r*2+o*2,!0);return{nibbles:n,scales:s,mins:a,nElems:e}}function pe(l){let e=new Float32Array(l.nElems),r=l.nElems/ye;for(let t=0;t<r;t++){let n=ge(l.scales[t]),s=ge(l.mins[t]),a=t*ye;for(let i=0;i<ye;i++){let o=a+i,u=l.nibbles[o>>1],c=(i&1)===0?u&15:u>>4;e[o]=c*n+s}}return e}var ye,mt=ae(()=>{"use strict";je();ye=32});function Pe(l){let e=l.length;if(e%Ae!==0)throw new Error(`q8web: length ${e} not a multiple of ${Ae}`);let r=e/Ae,t=new Int8Array(e),n=new Uint16Array(r);for(let s=0;s<r;s++){let a=s*Ae,i=0;for(let d=0;d<Ae;d++){let f=Math.abs(l[a+d]);f>i&&(i=f)}let o=i/127||1e-8,u=Be(o);n[s]=u;let c=ge(u)||1e-8;for(let d=0;d<Ae;d++){let f=Math.round(l[a+d]/c);f=f<-127?-127:f>127?127:f,t[a+d]=f}}return{codes:t,scales:n,nElems:e}}function Oe(l,e){let r=e/Ae,t=new Int8Array(l.buffer.slice(l.byteOffset,l.byteOffset+e)),n=new Uint16Array(r),s=new DataView(l.buffer,l.byteOffset);for(let a=0;a<r;a++)n[a]=s.getUint16(e+a*2,!0);return{codes:t,scales:n,nElems:e}}function me(l){let e=new Float32Array(l.nElems),r=l.nElems/Ae;for(let t=0;t<r;t++){let n=ge(l.scales[t]),s=t*Ae;for(let a=0;a<Ae;a++)e[s+a]=l.codes[s+a]*n}return e}var Ae,vt=ae(()=>{"use strict";je();Ae=32});function cr(l){let e=l.length;if(e%Ue!==0)throw new Error(`q3web: length ${e} not a multiple of ${Ue}`);let r=e/Ue,t=new Uint32Array(e/16),n=new Uint32Array(e/32),s=new Uint16Array(r),a=new Uint16Array(r);for(let i=0;i<r;i++){let o=i*Ue,u=1/0,c=-1/0;for(let w=0;w<Ue;w++){let P=l[o+w];P<u&&(u=P),P>c&&(c=P)}let d=(c-u)/7||1e-8,f=Be(d),g=Be(u);s[i]=f,a[i]=g;let p=ge(f)||1e-8,h=ge(g);for(let w=0;w<Ue;w++){let P=Math.round((l[o+w]-h)/p);P=P<0?0:P>7?7:P;let q=o+w;t[q>>4]|=(P&3)<<(q&15)*2,n[q>>5]|=P>>2<<(q&31)}}return{lo:t,hi:n,scales:s,mins:a,nElems:e}}function De(l,e){let r=e/Ue,t=e/16,n=e/32,s=t*4,a=n*4,i=new DataView(l.buffer,l.byteOffset),o=new Uint32Array(t),u=new Uint32Array(n),c=new Uint16Array(r),d=new Uint16Array(r);for(let p=0;p<t;p++)o[p]=i.getUint32(p*4,!0);for(let p=0;p<n;p++)u[p]=i.getUint32(s+p*4,!0);let f=s+a,g=f+r*2;for(let p=0;p<r;p++)c[p]=i.getUint16(f+p*2,!0);for(let p=0;p<r;p++)d[p]=i.getUint16(g+p*2,!0);return{lo:o,hi:u,scales:c,mins:d,nElems:e}}function Le(l){let e=new Float32Array(l.nElems),r=l.nElems/Ue;for(let t=0;t<r;t++){let n=ge(l.scales[t]),s=ge(l.mins[t]),a=t*Ue;for(let i=0;i<Ue;i++){let o=a+i,u=l.lo[o>>4]>>(o&15)*2&3|(l.hi[o>>5]>>(o&31)&1)<<2;e[o]=u*n+s}}return e}var Ue,bt=ae(()=>{"use strict";je();Ue=32});var lr,dr,fr=ae(()=>{"use strict";lr={matmul:`
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
		}`,conv2d_3x3_tiled_q8:`
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
		fn wq8(i: u32) -> f32 {
			let q = f32(i32(codes[i >> 2u] << ((3u - (i & 3u)) * 8u)) >> 24u);
			let si = i >> 5u;
			let sw = sc[si >> 1u];
			return q * f16d(select(sw & 0xFFFFu, sw >> 16u, (si & 1u) == 1u));
		}
		var<workgroup> tile: array<f32, 324>;
		var<workgroup> wloc: array<f32, 72>;   // 8 canaux de sortie \xD7 9 poids
		@compute @workgroup_size(16, 16)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let co0 = wid.z * 8u;
			let oy0 = wid.y * 16u;
			let ox0 = wid.x * 16u;
			let oy = oy0 + lid.y;
			let ox = ox0 + lid.x;
			let inBounds = oy < p.OH && ox < p.OW;
			let tid = lid.y * 16u + lid.x;
			var acc: array<f32, 8>;
			for (var j = 0u; j < 8u; j = j + 1u) { acc[j] = 0.0; }
			for (var ci = 0u; ci < p.Cin; ci = ci + 1u) {
				let base = ci * p.H * p.W;
				// Le patch d'entr\xE9e : charg\xE9 UNE fois pour les 8 canaux de sortie (c'est tout l'objet
				// du bloc). Branche gard\xE9e, pas select() : un indice hors bornes lirait n'importe quoi.
				for (var t = tid; t < 324u; t = t + 256u) {
					let iy = i32(oy0 + t / 18u) - 1;
					let ix = i32(ox0 + t % 18u) - 1;
					var v = 0.0;
					if (iy >= 0 && iy < i32(p.H) && ix >= 0 && ix < i32(p.W)) { v = inp[base + u32(iy) * p.W + u32(ix)]; }
					tile[t] = v;
				}
				// Les 72 poids du bloc, d\xE9quantifi\xE9s une seule fois par les 72 premiers threads.
				if (tid < 72u) {
					let j = tid / 9u;
					let co = co0 + j;
					if (co < p.Cout) { wloc[tid] = wq8((co * p.Cin + ci) * 9u + (tid % 9u)); }
					else { wloc[tid] = 0.0; }
				}
				workgroupBarrier();
				if (inBounds) {
					let r0 = lid.y * 18u + lid.x;
					// Les 9 valeurs du patch sont lues UNE fois puis r\xE9utilis\xE9es pour les 8 canaux :
					// 72 FMA pour 18 lectures partag\xE9es, contre 9 pour 18 dans la version d'avant.
					let v0 = tile[r0];       let v1 = tile[r0 + 1u];  let v2 = tile[r0 + 2u];
					let v3 = tile[r0 + 18u]; let v4 = tile[r0 + 19u]; let v5 = tile[r0 + 20u];
					let v6 = tile[r0 + 36u]; let v7 = tile[r0 + 37u]; let v8 = tile[r0 + 38u];
					for (var j = 0u; j < 8u; j = j + 1u) {
						let b = j * 9u;
						acc[j] = acc[j]
							+ v0 * wloc[b]      + v1 * wloc[b + 1u] + v2 * wloc[b + 2u]
							+ v3 * wloc[b + 3u] + v4 * wloc[b + 4u] + v5 * wloc[b + 5u]
							+ v6 * wloc[b + 6u] + v7 * wloc[b + 7u] + v8 * wloc[b + 8u];
					}
				}
				workgroupBarrier();
			}
			if (inBounds) {
				for (var j = 0u; j < 8u; j = j + 1u) {
					let co = co0 + j;
					if (co < p.Cout) { o[(co * p.OH + oy) * p.OW + ox] = acc[j] + bias[co]; }
				}
			}
		}`,conv2d_1x1_q8:`
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
		fn wq8(i: u32) -> f32 {
			let q = f32(i32(codes[i >> 2u] << ((3u - (i & 3u)) * 8u)) >> 24u);
			let si = i >> 5u;
			let sw = sc[si >> 1u];
			return q * f16d(select(sw & 0xFFFFu, sw >> 16u, (si & 1u) == 1u));
		}
		var<workgroup> wloc: array<f32, 256>;   // 8 canaux de sortie \xD7 32 canaux d'entr\xE9e
		@compute @workgroup_size(16, 16)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let co0 = wid.z * 8u;
			let oy = wid.y * 16u + lid.y;
			let ox = wid.x * 16u + lid.x;
			let dedans = oy < p.OH && ox < p.OW;
			let np = p.OH * p.OW;
			let pos = oy * p.OW + ox;
			let tid = lid.y * 16u + lid.x;
			var acc: array<f32, 8>;
			for (var j = 0u; j < 8u; j = j + 1u) { acc[j] = 0.0; }
			// Les poids par PAQUETS de 32 canaux d'entr\xE9e : une barri\xE8re tous les 32 ci au lieu d'une
			// par ci (Cin monte \xE0 1920 sur les raccourcis montants du UNet). Les 256 threads chargent
			// exactement les 8\xD732 poids du paquet.
			for (var cb = 0u; cb < p.Cin; cb = cb + 32u) {
				let j = tid / 32u;
				let k = tid % 32u;
				let co = co0 + j;
				let ci = cb + k;
				wloc[tid] = select(0.0, wq8(co * p.Cin + ci), co < p.Cout && ci < p.Cin);
				workgroupBarrier();
				if (dedans) {
					var fin = 32u;
					if (p.Cin - cb < 32u) { fin = p.Cin - cb; }
					// Une lecture globale par canal d'entr\xE9e, r\xE9utilis\xE9e pour les 8 canaux de sortie :
					// c'est tout le gain (le kernel direct la relisait pour CHAQUE canal de sortie).
					for (var k2 = 0u; k2 < fin; k2 = k2 + 1u) {
						let v = inp[(cb + k2) * np + pos];
						for (var j2 = 0u; j2 < 8u; j2 = j2 + 1u) { acc[j2] = acc[j2] + v * wloc[j2 * 32u + k2]; }
					}
				}
				workgroupBarrier();
			}
			if (dedans) {
				for (var j = 0u; j < 8u; j = j + 1u) {
					let co = co0 + j;
					if (co < p.Cout) { o[co * np + pos] = acc[j] + bias[co]; }
				}
			}
		}`,conv2d_3x3_tiled_q4:`
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
		var<workgroup> tile: array<f32, 324>;
		var<workgroup> wloc: array<f32, 72>;   // 8 canaux de sortie \xD7 9 poids
		@compute @workgroup_size(16, 16)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let co0 = wid.z * 8u;
			let oy0 = wid.y * 16u;
			let ox0 = wid.x * 16u;
			let oy = oy0 + lid.y;
			let ox = ox0 + lid.x;
			let inBounds = oy < p.OH && ox < p.OW;
			let tid = lid.y * 16u + lid.x;
			var acc: array<f32, 8>;
			for (var j = 0u; j < 8u; j = j + 1u) { acc[j] = 0.0; }
			for (var ci = 0u; ci < p.Cin; ci = ci + 1u) {
				let base = ci * p.H * p.W;
				// Le patch d'entr\xE9e : charg\xE9 UNE fois pour les 8 canaux de sortie (c'est tout l'objet
				// du bloc). Branche gard\xE9e, pas select() : un indice hors bornes lirait n'importe quoi.
				for (var t = tid; t < 324u; t = t + 256u) {
					let iy = i32(oy0 + t / 18u) - 1;
					let ix = i32(ox0 + t % 18u) - 1;
					var v = 0.0;
					if (iy >= 0 && iy < i32(p.H) && ix >= 0 && ix < i32(p.W)) { v = inp[base + u32(iy) * p.W + u32(ix)]; }
					tile[t] = v;
				}
				// Les 72 poids du bloc, d\xE9quantifi\xE9s une seule fois par les 72 premiers threads.
				if (tid < 72u) {
					let j = tid / 9u;
					let co = co0 + j;
					if (co < p.Cout) { wloc[tid] = wq4((co * p.Cin + ci) * 9u + (tid % 9u)); }
					else { wloc[tid] = 0.0; }
				}
				workgroupBarrier();
				if (inBounds) {
					let r0 = lid.y * 18u + lid.x;
					// Les 9 valeurs du patch sont lues UNE fois puis r\xE9utilis\xE9es pour les 8 canaux :
					// 72 FMA pour 18 lectures partag\xE9es, contre 9 pour 18 dans la version d'avant.
					let v0 = tile[r0];       let v1 = tile[r0 + 1u];  let v2 = tile[r0 + 2u];
					let v3 = tile[r0 + 18u]; let v4 = tile[r0 + 19u]; let v5 = tile[r0 + 20u];
					let v6 = tile[r0 + 36u]; let v7 = tile[r0 + 37u]; let v8 = tile[r0 + 38u];
					for (var j = 0u; j < 8u; j = j + 1u) {
						let b = j * 9u;
						acc[j] = acc[j]
							+ v0 * wloc[b]      + v1 * wloc[b + 1u] + v2 * wloc[b + 2u]
							+ v3 * wloc[b + 3u] + v4 * wloc[b + 4u] + v5 * wloc[b + 5u]
							+ v6 * wloc[b + 6u] + v7 * wloc[b + 7u] + v8 * wloc[b + 8u];
					}
				}
				workgroupBarrier();
			}
			if (inBounds) {
				for (var j = 0u; j < 8u; j = j + 1u) {
					let co = co0 + j;
					if (co < p.Cout) { o[(co * p.OH + oy) * p.OW + ox] = acc[j] + bias[co]; }
				}
			}
		}`,conv2d_3x3_s2_tiled_q8:`
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
		fn wq8(i: u32) -> f32 {
			let q = f32(i32(codes[i >> 2u] << ((3u - (i & 3u)) * 8u)) >> 24u);
			let si = i >> 5u;
			let sw = sc[si >> 1u];
			return q * f16d(select(sw & 0xFFFFu, sw >> 16u, (si & 1u) == 1u));
		}
		var<workgroup> tile: array<f32, 561>;
		var<workgroup> wloc: array<f32, 72>;
		@compute @workgroup_size(16, 8)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let co0 = wid.z * 8u;
			let oy0 = wid.y * 8u;
			let ox0 = wid.x * 16u;
			let oy = oy0 + lid.y;
			let ox = ox0 + lid.x;
			let inBounds = oy < p.OH && ox < p.OW;
			let tid = lid.y * 16u + lid.x;
			var acc: array<f32, 8>;
			for (var j = 0u; j < 8u; j = j + 1u) { acc[j] = 0.0; }
			for (var ci = 0u; ci < p.Cin; ci = ci + 1u) {
				let base = ci * p.H * p.W;
				for (var t = tid; t < 561u; t = t + 128u) {
					let ty = t / 33u;
					let tx = t % 33u;
					let iy = i32(oy0 * 2u + ty) - 1;
					let ix = i32(ox0 * 2u + tx) - 1;
					var v = 0.0;
					if (iy >= 0 && iy < i32(p.H) && ix >= 0 && ix < i32(p.W)) { v = inp[base + u32(iy) * p.W + u32(ix)]; }
					tile[t] = v;
				}
				if (tid < 72u) {
					let j = tid / 9u;
					let co = co0 + j;
					if (co < p.Cout) { wloc[tid] = wq8((co * p.Cin + ci) * 9u + (tid % 9u)); }
					else { wloc[tid] = 0.0; }
				}
				workgroupBarrier();
				if (inBounds) {
					let r0 = (lid.y * 2u) * 33u + (lid.x * 2u);
					let v0 = tile[r0];       let v1 = tile[r0 + 1u];  let v2 = tile[r0 + 2u];
					let v3 = tile[r0 + 33u]; let v4 = tile[r0 + 34u]; let v5 = tile[r0 + 35u];
					let v6 = tile[r0 + 66u]; let v7 = tile[r0 + 67u]; let v8 = tile[r0 + 68u];
					for (var j = 0u; j < 8u; j = j + 1u) {
						let b = j * 9u;
						acc[j] = acc[j]
							+ v0 * wloc[b]      + v1 * wloc[b + 1u] + v2 * wloc[b + 2u]
							+ v3 * wloc[b + 3u] + v4 * wloc[b + 4u] + v5 * wloc[b + 5u]
							+ v6 * wloc[b + 6u] + v7 * wloc[b + 7u] + v8 * wloc[b + 8u];
					}
				}
				workgroupBarrier();
			}
			if (inBounds) {
				for (var j = 0u; j < 8u; j = j + 1u) {
					let co = co0 + j;
					if (co < p.Cout) { o[(co * p.OH + oy) * p.OW + ox] = acc[j] + bias[co]; }
				}
			}
		}`,conv2d_3x3_s2_tiled_q4:`
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
		var<workgroup> tile: array<f32, 561>;
		var<workgroup> wloc: array<f32, 72>;
		@compute @workgroup_size(16, 8)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let co0 = wid.z * 8u;
			let oy0 = wid.y * 8u;
			let ox0 = wid.x * 16u;
			let oy = oy0 + lid.y;
			let ox = ox0 + lid.x;
			let inBounds = oy < p.OH && ox < p.OW;
			let tid = lid.y * 16u + lid.x;
			var acc: array<f32, 8>;
			for (var j = 0u; j < 8u; j = j + 1u) { acc[j] = 0.0; }
			for (var ci = 0u; ci < p.Cin; ci = ci + 1u) {
				let base = ci * p.H * p.W;
				for (var t = tid; t < 561u; t = t + 128u) {
					let ty = t / 33u;
					let tx = t % 33u;
					let iy = i32(oy0 * 2u + ty) - 1;
					let ix = i32(ox0 * 2u + tx) - 1;
					var v = 0.0;
					if (iy >= 0 && iy < i32(p.H) && ix >= 0 && ix < i32(p.W)) { v = inp[base + u32(iy) * p.W + u32(ix)]; }
					tile[t] = v;
				}
				if (tid < 72u) {
					let j = tid / 9u;
					let co = co0 + j;
					if (co < p.Cout) { wloc[tid] = wq4((co * p.Cin + ci) * 9u + (tid % 9u)); }
					else { wloc[tid] = 0.0; }
				}
				workgroupBarrier();
				if (inBounds) {
					let r0 = (lid.y * 2u) * 33u + (lid.x * 2u);
					let v0 = tile[r0];       let v1 = tile[r0 + 1u];  let v2 = tile[r0 + 2u];
					let v3 = tile[r0 + 33u]; let v4 = tile[r0 + 34u]; let v5 = tile[r0 + 35u];
					let v6 = tile[r0 + 66u]; let v7 = tile[r0 + 67u]; let v8 = tile[r0 + 68u];
					for (var j = 0u; j < 8u; j = j + 1u) {
						let b = j * 9u;
						acc[j] = acc[j]
							+ v0 * wloc[b]      + v1 * wloc[b + 1u] + v2 * wloc[b + 2u]
							+ v3 * wloc[b + 3u] + v4 * wloc[b + 4u] + v5 * wloc[b + 5u]
							+ v6 * wloc[b + 6u] + v7 * wloc[b + 7u] + v8 * wloc[b + 8u];
					}
				}
				workgroupBarrier();
			}
			if (inBounds) {
				for (var j = 0u; j < 8u; j = j + 1u) {
					let co = co0 + j;
					if (co < p.Cout) { o[(co * p.OH + oy) * p.OW + ox] = acc[j] + bias[co]; }
				}
			}
		}`,rmsnorm_vec_subgroup:`
		enable subgroups;
		struct P { rows: u32, dim: u32, eps: f32, onePlus: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> x: array<f32>;
		@group(0) @binding(2) var<storage, read> w: array<f32>;
		@group(0) @binding(3) var<storage, read_write> o: array<f32>;
		var<workgroup> part: array<f32, 64>;
		@compute @workgroup_size(256)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>, @builtin(subgroup_invocation_id) sgi: u32, @builtin(subgroup_size) sgs: u32) {
			let r = wid.x;
			let tid = lid.x;
			let base = r * p.dim;
			var ss = 0.0;
			if (r < p.rows) {
				for (var i = tid; i < p.dim; i = i + 256u) { let v = x[base + i]; ss = ss + v * v; }
			}
			let sg_sum = subgroupAdd(ss);
			let num_sg = min((256u + sgs - 1u) / sgs, 64u);
			let sg_id = tid / sgs;
			if (sgi == 0u && sg_id < 64u) {
				part[sg_id] = sg_sum;
			}
			workgroupBarrier();
			// Somme des partielles. Un seul subgroupAdd ne suffit PAS quand il y a plus de sous-groupes
			// que de voies dans un sous-groupe (sgs=4 \u2192 64 partielles pour 4 voies) : chaque voie cumule
			// donc d'abord sa tranche \xE0 pas fixe, puis le sous-groupe r\xE9duit \u2014 correct pour tout sgs.
			var acc = 0.0;
			for (var k = sgi; k < num_sg; k = k + sgs) { acc = acc + part[k]; }
			let total_ss = subgroupAdd(acc);
			if (r >= p.rows) { return; }
			let inv = 1.0 / sqrt(total_ss / f32(p.dim) + p.eps);
			for (var i = tid; i < p.dim; i = i + 256u) {
				let g = select(w[i], 1.0 + w[i], p.onePlus == 1u);
				o[base + i] = x[base + i] * inv * g;
			}
		}`,group_norm_subgroup:`
		enable subgroups;
		struct P { C: u32, HW: u32, G: u32, eps: f32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> x: array<f32>;
		@group(0) @binding(2) var<storage, read> gamma: array<f32>;
		@group(0) @binding(3) var<storage, read> beta: array<f32>;
		@group(0) @binding(4) var<storage, read_write> o: array<f32>;
		var<workgroup> ssum: array<f32, 64>;
		var<workgroup> ssq: array<f32, 64>;
		@compute @workgroup_size(256)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>, @builtin(subgroup_invocation_id) sgi: u32, @builtin(subgroup_size) sgs: u32) {
			let g = wid.x;
			if (g >= p.G) { return; }
			let cpg = p.C / p.G;
			let n = cpg * p.HW;
			let base = g * cpg * p.HW;
			var s = 0.0; var sq = 0.0;
			var i = lid.x;
			loop {
				if (i >= n) { break; }
				let v = x[base + i];
				s = s + v; sq = sq + v * v;
				i = i + 256u;
			}
			let sg_s = subgroupAdd(s);
			let sg_sq = subgroupAdd(sq);
			let num_sg = min((256u + sgs - 1u) / sgs, 64u);
			let sg_id = lid.x / sgs;
			if (sgi == 0u && sg_id < 64u) {
				ssum[sg_id] = sg_s;
				ssq[sg_id] = sg_sq;
			}
			workgroupBarrier();
			var acc_s = 0.0;
			var acc_sq = 0.0;
			for (var k = sgi; k < num_sg; k = k + sgs) { acc_s = acc_s + ssum[k]; acc_sq = acc_sq + ssq[k]; }
			let total_s = subgroupAdd(acc_s);
			let total_sq = subgroupAdd(acc_sq);
			let mean = total_s / f32(n);
			// max(\u2026, 0) : E[x\xB2] - moyenne\xB2 est math\xE9matiquement positif mais peut passer sous z\xE9ro en
			// f32 sur un groupe presque constant \u2014 sqrt d'un n\xE9gatif rendrait NaN sur tout le groupe.
			let varr = max(total_sq / f32(n) - mean * mean, 0.0);
			let inv = 1.0 / sqrt(varr + p.eps);
			var j = lid.x;
			loop {
				if (j >= n) { break; }
				let ch = g * cpg + j / p.HW;
				o[base + j] = (x[base + j] - mean) * inv * gamma[ch] + beta[ch];
				j = j + 256u;
			}
		}`,upscale2x_enhanced:`
		struct P { C: u32, H: u32, W: u32, sharpness: f32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> inp: array<f32>;
		@group(0) @binding(2) var<storage, read_write> o: array<f32>;

		fn sampleInp(c: u32, y: i32, x: i32) -> f32 {
			let cy = u32(clamp(y, 0, i32(p.H) - 1));
			let cx = u32(clamp(x, 0, i32(p.W) - 1));
			return inp[(c * p.H + cy) * p.W + cx];
		}

		// Laplacien discret \xE0 5 points en (y,x). sampleInp borne les coordonn\xE9es, donc les bords se
		// comportent comme un prolongement par la valeur du bord (pas de halo noir).
		fn laplacien(c: u32, y: i32, x: i32) -> f32 {
			let centre = sampleInp(c, y, x);
			return (sampleInp(c, y - 1, x) + sampleInp(c, y + 1, x) + sampleInp(c, y, x - 1) + sampleInp(c, y, x + 1)) * 0.25 - centre;
		}

		fn cubic(x: f32) -> vec4<f32> {
			let x2 = x * x;
			let x3 = x2 * x;
			let w0 = -0.5 * x3 + x2 - 0.5 * x;
			let w1 = 1.5 * x3 - 2.5 * x2 + 1.0;
			let w2 = -1.5 * x3 + 2.0 * x2 + 0.5 * x;
			let w3 = 0.5 * x3 - 0.5 * x2;
			return vec4<f32>(w0, w1, w2, w3);
		}

		@compute @workgroup_size(16, 16)
		fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
			let ox = gid.x;
			let oy = gid.y;
			let c = gid.z;
			let outW = p.W * 2u;
			let outH = p.H * 2u;
			if (ox >= outW || oy >= outH || c >= p.C) { return; }

			let srcX = (f32(ox) + 0.5) * 0.5 - 0.5;
			let srcY = (f32(oy) + 0.5) * 0.5 - 0.5;

			let x0 = i32(floor(srcX));
			let y0 = i32(floor(srcY));
			let fx = srcX - f32(x0);
			let fy = srcY - f32(y0);

			let wx = cubic(fx);
			let wy = cubic(fy);

			var bicubicVal = 0.0;
			for (var j = 0; j < 4; j = j + 1) {
				let py = y0 - 1 + j;
				var rowVal = 0.0;
				for (var i = 0; i < 4; i = i + 1) {
					let px = x0 - 1 + i;
					let s = sampleInp(c, py, px);
					rowVal = rowVal + s * wx[i];
				}
				bicubicVal = bicubicVal + rowVal * wy[j];
			}

			// Rehaussement d'ar\xEAtes : on retire au r\xE9sultat un laplacien (moyenne des 4 voisins moins le
			// centre) \u2014 soustraire un flou, c'est accentuer. Le laplacien est INTERPOL\xC9 \xE0 la position
			// r\xE9\xE9chantillonn\xE9e : \xE9valu\xE9 au seul pixel source floor(srcX/Y), les 4 pixels de sortie
			// issus d'un m\xEAme pixel source recevaient tous la M\xCAME correction, ce qui redessinait la
			// grille source en damier de blocs 2\xD72 sur les contours francs. Quatre laplaciens aux coins
			// entiers, puis une bilin\xE9aire : le rehaussement varie alors contin\xFBment comme le bicubique
			// qu'il corrige. Co\xFBt : 12 lectures de plus, toutes dans le m\xEAme voisinage d\xE9j\xE0 chaud.
			let lap00 = laplacien(c, y0, x0);
			let lap01 = laplacien(c, y0, x0 + 1);
			let lap10 = laplacien(c, y0 + 1, x0);
			let lap11 = laplacien(c, y0 + 1, x0 + 1);
			let lapTop = mix(lap00, lap01, fx);
			let lapBot = mix(lap10, lap11, fx);
			let laplacian = mix(lapTop, lapBot, fy);

			let enhanced = bicubicVal - p.sharpness * laplacian;
			let clamped = clamp(enhanced, 0.0, 1.0);

			o[(c * outH + oy) * outW + ox] = clamped;
		}`,conv2d_1x1_q4:`
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
		var<workgroup> wloc: array<f32, 256>;   // 8 canaux de sortie \xD7 32 canaux d'entr\xE9e
		@compute @workgroup_size(16, 16)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let co0 = wid.z * 8u;
			let oy = wid.y * 16u + lid.y;
			let ox = wid.x * 16u + lid.x;
			let dedans = oy < p.OH && ox < p.OW;
			let np = p.OH * p.OW;
			let pos = oy * p.OW + ox;
			let tid = lid.y * 16u + lid.x;
			var acc: array<f32, 8>;
			for (var j = 0u; j < 8u; j = j + 1u) { acc[j] = 0.0; }
			// Les poids par PAQUETS de 32 canaux d'entr\xE9e : une barri\xE8re tous les 32 ci au lieu d'une
			// par ci (Cin monte \xE0 1920 sur les raccourcis montants du UNet). Les 256 threads chargent
			// exactement les 8\xD732 poids du paquet.
			for (var cb = 0u; cb < p.Cin; cb = cb + 32u) {
				let j = tid / 32u;
				let k = tid % 32u;
				let co = co0 + j;
				let ci = cb + k;
				wloc[tid] = select(0.0, wq4(co * p.Cin + ci), co < p.Cout && ci < p.Cin);
				workgroupBarrier();
				if (dedans) {
					var fin = 32u;
					if (p.Cin - cb < 32u) { fin = p.Cin - cb; }
					// Une lecture globale par canal d'entr\xE9e, r\xE9utilis\xE9e pour les 8 canaux de sortie :
					// c'est tout le gain (le kernel direct la relisait pour CHAQUE canal de sortie).
					for (var k2 = 0u; k2 < fin; k2 = k2 + 1u) {
						let v = inp[(cb + k2) * np + pos];
						for (var j2 = 0u; j2 < 8u; j2 = j2 + 1u) { acc[j2] = acc[j2] + v * wloc[j2 * 32u + k2]; }
					}
				}
				workgroupBarrier();
			}
			if (dedans) {
				for (var j = 0u; j < 8u; j = j + 1u) {
					let co = co0 + j;
					if (co < p.Cout) { o[co * np + pos] = acc[j] + bias[co]; }
				}
			}
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
		}`},dr=`
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
	}`});var Xe,gr=ae(()=>{"use strict";Xe=class{constructor(e){this.sets=[];this.cur=0;this.next=0;this.names=[];this.acc=new Map;this.dropped=0;this.pending=[];this.fenetre=0;this.device=e;let r=globalThis;for(let t=0;t<2;t++)this.sets.push({qs:e.createQuerySet({type:"timestamp",count:4096}),resolve:e.createBuffer({size:4096*8,usage:r.GPUBufferUsage.QUERY_RESOLVE|r.GPUBufferUsage.COPY_SRC}),read:e.createBuffer({size:4096*8,usage:r.GPUBufferUsage.COPY_DST|r.GPUBufferUsage.MAP_READ}),busy:!1})}slot(e){if(this.next+2>4096&&(this.rotate(),this.next+2>4096))return this.dropped++,null;let r=this.sets[this.cur];if(r.busy)return this.dropped++,null;let t=this.next;return this.next+=2,this.names.push(e),{querySet:r.qs,beginningOfPassWriteIndex:t,endOfPassWriteIndex:t+1}}rotate(){let e=this.cur,r=this.sets[e],t=this.names,n=this.next;if(this.cur=(this.cur+1)%2,this.next=0,this.names=[],!n||r.busy)return;r.busy=!0;let s=this.fenetre,a=this.device.createCommandEncoder();a.resolveQuerySet(r.qs,0,n,r.resolve,0),a.copyBufferToBuffer(r.resolve,0,r.read,0,n*8),this.device.queue.submit([a.finish()]);let i=globalThis,o=r.read.mapAsync(i.GPUMapMode.READ,0,n*8).then(()=>{let u=new BigUint64Array(r.read.getMappedRange(0,n*8).slice(0));if(r.read.unmap(),s===this.fenetre)for(let c=0;c<t.length;c++){let d=u[c*2],f=u[c*2+1];if(!d||!f||f<=d)continue;let g=Number(f-d),p=this.acc.get(t[c]);p?(p.calls++,p.ns+=g):this.acc.set(t[c],{calls:1,ns:g})}}).catch(()=>{}).finally(()=>{r.busy=!1});this.pending.push(o)}async report(){this.rotate();let e=this.pending;this.pending=[],await Promise.all(e);let r=0,t=0;for(let s of this.acc.values())r+=s.ns,t+=s.calls;return{passes:[...this.acc.entries()].map(([s,a])=>({name:s,calls:a.calls,totalMs:a.ns/1e6,meanUs:a.ns/a.calls/1e3,share:r?a.ns/r:0,reliable:a.calls>=50})).sort((s,a)=>a.totalMs-s.totalMs),totalMs:r/1e6,samples:t,dropped:this.dropped,quantumUs:100}}reset(){this.fenetre++,this.acc.clear(),this.dropped=0}destroy(){for(let e of this.sets)try{e.qs.destroy(),e.resolve.destroy(),e.read.destroy()}catch{}this.sets=[]}}});function yn(){if(pr!==null)return pr;try{let l=globalThis.__brimkernSearch;if(typeof l=="string")return l}catch{}try{return typeof location<"u"?location.search:""}catch{return""}}function oe(l){try{return new URLSearchParams(yn()).get(l)}catch{return null}}var pr,hr=ae(()=>{"use strict";pr=null});function we(l){let e=l>>15&1,r=l>>10&31,t=l&1023,n;return r===0?n=t*59604645e-15:r===31?n=65504:n=(1+t/1024)*2**(r-15),e===1?-n:n}function Te(l){let e=new Float32Array(1),r=new Uint32Array(e.buffer);e[0]=l;let t=r[0],n=t>>16&32768,s=(t>>23&255)-127+15,a=t&8388607;return s<=0?n:s>=31?n|31743:(a=(a>>13)+(a>>12&1),a===1024&&(a=0,s+=1),n|s<<10|a&1023)}function kn(l,e){let r=new Float32Array(e*256),t=new DataView(l.buffer,l.byteOffset);for(let n=0;n<e;n++){let s=n*144,a=we(t.getUint16(s,!0)),i=we(t.getUint16(s+2,!0)),o=f=>{let g=p=>l[s+4+p];return f<4?[g(f)&63,g(f+4)&63]:[g(f+4)&15|g(f-4)>>6<<4,g(f+4)>>4|g(f)>>6<<4]},u=n*256,c=0,d=0;for(let f=0;f<256;f+=64){let[g,p]=o(c),h=a*g,w=i*p,[P,q]=o(c+1),S=a*P,F=i*q;for(let M=0;M<32;M++){let z=l[s+16+d+M];r[u+f+M]=h*(z&15)-w,r[u+f+32+M]=S*(z>>4)-F}d+=32,c+=2}}return r}function He(l){return l>127?l-256:l}function An(l,e){let r=new Float32Array(e*32),t=new DataView(l.buffer,l.byteOffset);for(let n=0;n<e;n++){let s=n*34,a=we(t.getUint16(s,!0));for(let i=0;i<32;i++)r[n*32+i]=a*He(l[s+2+i])}return r}function Pn(l,e){let r=new Float32Array(e*32),t=new DataView(l.buffer,l.byteOffset);for(let n=0;n<e;n++){let s=n*22,a=we(t.getUint16(s,!0)),i=t.getUint32(s+2,!0);for(let o=0;o<16;o++){let u=l[s+6+o],c=i>>>o<<4&16,d=i>>>o+12&16;r[n*32+o]=a*((u&15|c)-16),r[n*32+o+16]=a*((u>>4|d)-16)}}return r}function Un(l,e){let r=new Float32Array(e*32),t=new DataView(l.buffer,l.byteOffset);for(let n=0;n<e;n++){let s=n*18,a=we(t.getUint16(s,!0));for(let i=0;i<16;i++){let o=l[s+2+i];r[n*32+i]=a*((o&15)-8),r[n*32+i+16]=a*((o>>4)-8)}}return r}function xn(l,e){let r=new Float32Array(e*256),t=new DataView(l.buffer,l.byteOffset);for(let n=0;n<e;n++){let s=n*176,a=we(t.getUint16(s,!0)),i=we(t.getUint16(s+2,!0)),o=p=>{let h=w=>l[s+4+w];return p<4?[h(p)&63,h(p+4)&63]:[h(p+4)&15|h(p-4)>>6<<4,h(p+4)>>4|h(p)>>6<<4]},u=n*256,c=0,d=0,f=1,g=2;for(let p=0;p<256;p+=64){let[h,w]=o(c),P=a*h,q=i*w,[S,F]=o(c+1),M=a*S,z=i*F;for(let U=0;U<32;U++){let k=l[s+48+d+U],v=l[s+16+U];r[u+p+U]=P*((k&15)+(v&f?16:0))-q,r[u+p+32+U]=M*((k>>4)+(v&g?16:0))-z}d+=32,c+=2,f<<=2,g<<=2}}return r}function _n(l,e){let r=new Float32Array(e*256),t=new DataView(l.buffer,l.byteOffset);for(let n=0;n<e;n++){let s=n*210,a=we(t.getUint16(s+208,!0)),i=n*256;for(let o=0;o<2;o++){let u=s+o*64,c=s+128+o*32,d=s+192+o*8,f=i+o*128;for(let g=0;g<32;g++){let p=g/16|0,h=l[u+g],w=l[u+g+32],P=l[c+g],q=(h&15|(P>>0&3)<<4)-32,S=(w&15|(P>>2&3)<<4)-32,F=(h>>4|(P>>4&3)<<4)-32,M=(w>>4|(P>>6&3)<<4)-32;r[f+g]=a*He(l[d+p])*q,r[f+g+32]=a*He(l[d+p+2])*S,r[f+g+64]=a*He(l[d+p+4])*F,r[f+g+96]=a*He(l[d+p+6])*M}}}return r}function Ce(l,e,r,t,n){let s=new Float32Array(r*n);for(let a=0;a<r;a++)for(let i=0;i<n;i++){let o=0;for(let u=0;u<t;u++)o+=l[a*t+u]*e[u*n+i];s[a*n+i]=o}return s}function Fe(l,e,r,t,n=1e-5,s=!1){let a=new Float32Array(r*t);for(let i=0;i<r;i++){let o=0;for(let c=0;c<t;c++)o+=l[i*t+c]**2;let u=1/Math.sqrt(o/t+n);for(let c=0;c<t;c++)a[i*t+c]=l[i*t+c]*u*(s?1+e[c]:e[c])}return a}function Gn(l,e,r,t,n,s,a){let i=new Float32Array(l.length),o=t/2,u=s[0],c=s[0]+s[1];for(let d=0;d<r;d++){let f=Math.floor(d/n),g=d*t;for(let p=0;p<o;p++){let h=p<u?0:p<c?1:2,P=e[f*3+h]/a**(2*p/t),q=Math.cos(P),S=Math.sin(P),F=l[g+p],M=l[g+p+o];i[g+p]=F*q-M*S,i[g+p+o]=M*q+F*S}}return i}function Je(l,e,r,t,n=0,s=1e4,a){let i=new Float32Array(l.length),o=r/2;for(let u=0;u<e;u++){let c=n+Math.floor(u/t),d=u*r;for(let f=0;f<o;f++){let g=c/(s**(2*f/r)*(a?a[f]:1)),p=Math.cos(g),h=Math.sin(g),w=l[d+2*f],P=l[d+2*f+1];i[d+2*f]=w*p-P*h,i[d+2*f+1]=P*p+w*h}}return i}function Bn(l,e,r,t,n,s=0,a=1e4){let i=new Float32Array(l.length),o=t/2;for(let u=0;u<r;u++){let c=s+Math.floor(u/n),d=u*t;for(let f=0;f<o;f++){let g=c/(a**(2*f/t)*e[f]),p=Math.cos(g),h=Math.sin(g),w=l[d+f],P=l[d+f+o];i[d+f]=w*p-P*h,i[d+f+o]=P*p+w*h}}return i}function Ke(l,e,r,t,n=0,s=1e4){let a=new Float32Array(l.length),i=r/2;for(let o=0;o<e;o++){let u=n+Math.floor(o/t),c=o*r;for(let d=0;d<i;d++){let f=u/s**(2*d/r),g=Math.cos(f),p=Math.sin(f),h=l[c+d],w=l[c+d+i];a[c+d]=h*g-w*p,a[c+d+i]=w*g+h*p}}return a}function wt(l,e,r){return l.map((t,n)=>t+e[n%r])}function yt(l,e,r,t=!0){let n=t?l.windowPerLayer?.[r]??l.window??0:0,s=l.ropeThetaPerLayer?.[r]??l.ropeTheta,a=l.skipRopePerLayer?.[r]??l.skipRope??!1;return{...l,seq:e,window:n,ropeTheta:s,skipRope:a}}function be(l,e,r,t,n,s,a,i=0,o,u=0,c=0){let d=new Float32Array(t*n*a),f=o??1/Math.sqrt(a),g=h=>u>0?u*Math.tanh(h/u):h,p=n/s;for(let h=0;h<t;h++)for(let w=0;w<n;w++){let P=Math.floor(w/p),q=(h*n+w)*a,S=i+h,F=c>0?Math.max(0,S+1-c):0,M=[],z=-1/0;for(let k=F;k<=S;k++){let v=(k*s+P)*a,m=0;for(let b=0;b<a;b++)m+=l[q+b]*e[v+b];let y=g(m*f);M[k]=y,y>z&&(z=y)}let U=0;for(let k=F;k<=S;k++)M[k]=Math.exp(M[k]-z),U+=M[k];for(let k=F;k<=S;k++){let v=M[k]/U,m=(k*s+P)*a;for(let y=0;y<a;y++)d[q+y]+=v*r[m+y]}}return d}function mr(l){return .5*l*(1+Math.tanh(.7978845608*(l+.044715*l*l*l)))}function kt(l,e,r){let{seq:t,d:n,nHeads:s,nKvHeads:a,headDim:i,ffn:o,ropeTheta:u,eps:c}=e,d=a*i,f=s*i,g=e.rmsGainOnePlus===!0,p=e.attnLogitSoftcap??0,h=Fe(l,r.attnNorm,t,n,c,g),w=Ce(h,r.wq,t,n,f),P=Ce(h,r.wk,t,n,d),q=Ce(h,r.wv,t,n,d);r.bq&&(w=wt(w,r.bq,f)),r.bk&&(P=wt(P,r.bk,d)),r.bv&&(q=wt(q,r.bv,d)),r.qNorm&&(w=Fe(w,r.qNorm,t*s,i,c,g)),r.kNorm&&(P=Fe(P,r.kNorm,t*a,i,c,g));let S=Ke(w,t*s,i,s,0,u),F=Ke(P,t*a,i,a,0,u),M=be(S,F,q,t,s,a,i,0,e.attnScale,p),z=Ce(M,r.wo,t,f,n);r.postAttnNorm&&(z=Fe(z,r.postAttnNorm,t,n,c,g));let U=l.map((A,x)=>A+z[x]),k=Fe(U,r.ffnNorm,t,n,c,g),v=Ce(k,r.wgate,t,n,o),m=Ce(k,r.wup,t,n,o),y=e.act==="gelu"?v.map((A,x)=>mr(A)*m[x]):v.map((A,x)=>A/(1+Math.exp(-A))*m[x]),b=Ce(y,r.wdown,t,o,n);return r.postFfnNorm&&(b=Fe(b,r.postFfnNorm,t,n,c,g)),U.map((A,x)=>A+b[x])}var ie,ee,Ze,vr=ae(()=>{"use strict";mt();vt();bt();fr();gr();hr();ie=64,ee=class ee{constructor(){this.device=null;this.modules={};this.pipelines={};this.maxStorageBufferBindingSize=0;this.hasF16=!1;this.validationFailure=null;this.lost=!1;this.onLost=null;this.attnDecodeOk=!0;this.attnPrefillOk=!0;this.attnFullWgOk=!0;this.mropeOk=!0;this.rwkvWkv7Ok=!0;this.lfm2ShortConvOk=!0;this.lfm2ResidentOk=!0;this.lfm2BatchOk=!0;this.swaOk=!0;this.rwkvResidentOk=!0;this.videoOk=!0;this.videoResidentOk=!0;this.f16SharedOk=!0;this.qSharedOk=!0;this.qShared2Ok=!0;this.gemvOk=!0;this.rmsVecOk=!0;this.convS2Ok=!0;this.hasSubgroups=!1;this.subgroupsOk=!0;this.topKParOk=!0;this.profiler=null;this.bufferPool=new Map;this.poolSize=new WeakMap;this.pooled=new WeakSet;this.uniformPool=new Map;this.uniformSize=new WeakMap;this.convTiledOk=!0;this.convTiledQOk=!0;this.kvGpu=new Map;this.topKOk=!0;this.kvSession="";this.kvQuant=!1;this.lfm2KvGpu=new Map;this.lfm2ConvGpu=new Map;this.lfm2Session="";this.rwkvStateGpu=new Map;this.rwkvVFirst=null;this.rwkvSession=""}async init(){let e=navigator.gpu;if(!e)return!1;let r=await e.requestAdapter();if(!r)return!1;let t=r.limits,n={maxStorageBufferBindingSize:t.maxStorageBufferBindingSize,maxBufferSize:t.maxBufferSize},s=[];try{r.features?.has("shader-f16")&&s.push("shader-f16")}catch{}try{r.features?.has("subgroups")&&s.push("subgroups")}catch{}try{ee.profileOn&&r.features?.has("timestamp-query")&&s.push("timestamp-query")}catch{}try{this.device=await r.requestDevice({requiredLimits:n,requiredFeatures:s})}catch{try{this.device=await r.requestDevice({requiredLimits:n})}catch{this.device=await r.requestDevice()}}this.maxStorageBufferBindingSize=this.device.limits?.maxStorageBufferBindingSize??134217728,this.hasF16=!!this.device.features?.has?.("shader-f16"),this.hasSubgroups=!!this.device.features?.has?.("subgroups"),ee.profileOn&&(this.device.features?.has?.("timestamp-query")?(this.profiler=new Xe(this.device),console.info("[webgpu] profilage par passe ACTIF (?gpuprofile=1) : __gpuProfile() pour le rapport")):console.warn("[webgpu] ?gpuprofile=1 demand\xE9 mais la feature timestamp-query est ABSENTE de cet adapter : aucune mesure ne sera prise."));try{oe("attndecode")==="0"&&(this.attnDecodeOk=!1,console.warn("[webgpu] attention d\xE9codage COUP\xC9E par ?attndecode=0 : kernels classiques")),oe("attnfullwg")==="0"&&(this.attnFullWgOk=!1,console.warn("[webgpu] attention_full workgroup COUP\xC9E par ?attnfullwg=0 : kernel classique")),oe("attnprefill")==="0"&&(this.attnPrefillOk=!1,console.warn("[webgpu] attention prefill tuil\xE9e COUP\xC9E par ?attnprefill=0 : kernel classique")),oe("rmsvec")==="0"&&(this.rmsVecOk=!1,console.warn("[webgpu] RMSNorm parall\xE8le COUP\xC9E par ?rmsvec=0 : kernel une-ligne-par-thread")),oe("topkpar")==="0"&&(this.topKParOk=!1,console.warn("[webgpu] top-K parall\xE8le COUP\xC9E par ?topkpar=0 : s\xE9lection finale sur un seul thread")),oe("rwkv")==="0"&&(this.rwkvWkv7Ok=!1,console.warn("[webgpu] kernel RWKV-7 WKV COUP\xC9 par ?rwkv=0")),oe("lfm2")==="0"&&(this.lfm2ShortConvOk=!1,console.warn("[webgpu] kernel shortconv LFM2 COUP\xC9 par ?lfm2=0")),oe("lfm2resident")==="0"&&(this.lfm2ResidentOk=!1,console.warn("[webgpu] LFM2 r\xE9sident COUP\xC9 par ?lfm2resident=0 : forwardToken JS+readback")),oe("lfm2batch")==="0"&&(this.lfm2BatchOk=!1,console.warn("[webgpu] prefill LFM2 batch\xE9 COUP\xC9 par ?lfm2batch=0 : token par token")),oe("convs2")==="0"&&(this.convS2Ok=!1,console.warn("[webgpu] conv2d 3\xD73 stride-2 tuil\xE9 COUP\xC9 par ?convs2=0 : repli sur direct")),oe("subgroups")==="0"&&(this.subgroupsOk=!1,console.warn("[webgpu] subgroups COUP\xC9 par ?subgroups=0 : repli sur shared memory")),oe("swa")==="0"&&(this.swaOk=!1,console.warn("[webgpu] fen\xEAtre glissante COUP\xC9E par ?swa=0 : attention causale pleine sur toutes les couches")),oe("rwkvresident")==="0"&&(this.rwkvResidentOk=!1,console.warn("[webgpu] RWKV r\xE9sident COUP\xC9 par ?rwkvresident=0 : forwardToken JS+readback")),oe("video")==="0"&&(this.videoOk=!1,console.warn("[webgpu] chemin vid\xE9o (module motion) COUP\xC9 par ?video=0")),oe("f16shared")==="0"&&(this.f16SharedOk=!1,console.warn("[webgpu] GEMM f16 tuil\xE9 COUP\xC9 par ?f16shared=0 : matmul_t_f16w pour tous les m")),oe("gemv")==="0"&&(this.gemvOk=!1,console.warn("[webgpu] GEMV de d\xE9codage COUP\xC9 par ?gemv=0 : kernels par lignes")),oe("qshared")==="0"&&(this.qSharedOk=!1,console.warn("[webgpu] GEMM q8/q4 tuil\xE9s COUP\xC9S par ?qshared=0 : kernels 4 lignes/invocation")),oe("qshared2")==="0"&&(this.qShared2Ok=!1,console.warn("[webgpu] GEMM q8/q4 v2 (bloc 4\xD78 vec4) COUP\xC9S par ?qshared2=0 : tuile 32\xD764 v1")),oe("convtq")==="0"&&(this.convTiledQOk=!1,console.warn("[webgpu] conv 3\xD73 tuil\xE9 q8/q4 COUP\xC9 par ?convtq=0 : conv2d_direct_q8/q4 (plus lent, m\xEAme r\xE9sultat)")),oe("videoresident")==="0"&&(this.videoResidentOk=!1,console.warn("[webgpu] motion r\xE9sident COUP\xC9 par ?videoresident=0 : chemin JS+readback"))}catch{}this.device.lost?.then?.(a=>{this.lost=!0,console.warn("[webgpu] device GPU perdu :",a?.reason||"unknown",a?.message||""),this.onLost?.(a)});for(let[a,i]of Object.entries(lr))this.modules[a]=this.device.createShaderModule({code:i});return this.hasF16&&(this.modules.matmul_t_f16w=this.device.createShaderModule({code:dr})),!0}buf(e,r){let t=this.device.createBuffer({size:e.byteLength,usage:r});return this.device.queue.writeBuffer(t,0,e),t}bufU32(e,r){let t=this.device.createBuffer({size:e.byteLength,usage:r});return this.device.queue.writeBuffer(t,0,e),t}async readBack(e,r){let t=globalThis,n=this.device.createBuffer({size:r,usage:t.GPUBufferUsage.COPY_DST|t.GPUBufferUsage.MAP_READ}),s=this.device.createCommandEncoder();s.copyBufferToBuffer(e,0,n,0,r),this.device.queue.submit([s.finish()]),await n.mapAsync(t.GPUMapMode.READ);let a=new Float32Array(n.getMappedRange().slice(0));return n.unmap(),n.destroy(),a}async readBackBytes(e,r){let t=globalThis,n=Math.ceil(r/4)*4,s=this.device.createBuffer({size:n,usage:t.GPUBufferUsage.COPY_DST|t.GPUBufferUsage.MAP_READ}),a=this.device.createCommandEncoder();a.copyBufferToBuffer(e,0,s,0,n),this.device.queue.submit([a.finish()]),await s.mapAsync(t.GPUMapMode.READ);let i=new Uint8Array(s.getMappedRange().slice(0,r));return s.unmap(),s.destroy(),i}async quantizeToBytes(e,r,t,n,s){let a=t/32,i=n==="q8"?new Uint8Array(t+a*2):new Uint8Array(t/2+a*4),o=ee.BLOCK_ELEMS[e]??1,u=t/o,c=r.byteLength/u,d=(h,w)=>w===0?h:d(w,h%w),f=o*32/d(o,32),g=Math.floor(this.maxStorageBufferBindingSize*.9/4),p=s??g;p=Math.max(f,Math.floor(p/f)*f);for(let h=0;h<t;h+=p){let w=Math.min(p,t-h),P=r.slice(h/o*c,(h+w)/o*c),q=this.dequantizeToGpu(e,P,w);try{if(n==="q8"){let{codes:S,sc:F}=this.f32ToQ8Gpu(q,w),M=await this.readBackBytes(S,w),z=await this.readBackBytes(F,w/32*2);S.destroy?.(),F.destroy?.(),i.set(M,h),i.set(z,t+h/32*2)}else{let{nib:S,sc:F,mn:M}=this.f32ToQ4Gpu(q,w),z=await this.readBackBytes(S,w/2),U=await this.readBackBytes(F,w/32*2),k=await this.readBackBytes(M,w/32*2);S.destroy?.(),F.destroy?.(),M.destroy?.(),i.set(z,h/2),i.set(U,t/2+h/32*2),i.set(k,t/2+a*2+h/32*2)}}finally{q.destroy?.()}}return i}pipeline(e){let r=this.pipelines[e];return r||(r=this.device.createComputePipeline({layout:"auto",compute:{module:this.modules[e],entryPoint:"main"}}),this.pipelines[e]=r),r}grid1D(e){let r=Math.ceil(e/ie);if(r<=ee.MAX_WG_DIM)return[r,1,1];let t=ee.MAX_WG_DIM;return[t,Math.ceil(r/t),1]}recordPass(e,r,t,n){let s=this.pipeline(r),a=this.device.createBindGroup({layout:s.getBindGroupLayout(0),entries:t.map((u,c)=>({binding:c,resource:{buffer:u}}))}),i=this.profiler?.slot(r),o=e.beginComputePass(i?{timestampWrites:i}:void 0);o.setPipeline(s),o.setBindGroup(0,a),o.dispatchWorkgroups(...n),o.end()}dispatch(e,r,t){let n=this.device.createCommandEncoder();this.recordPass(n,e,r,t),this.device.queue.submit([n.finish()])}async run(e,r,t,n,s){return this.dispatch(e,r,t),this.readBack(n,s)}isF32(e){return e instanceof Float32Array}async matmul(e,r,t,n,s){let a=globalThis,i=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,o=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([t,n,s]));let u=this.isF32(r)?this.buf(r,i):r,c=this.device.createBuffer({size:t*s*4,usage:i|a.GPUBufferUsage.COPY_SRC});return this.run("matmul",[o,this.buf(e,i),u,c],[Math.ceil(t/8),Math.ceil(s/8),1],c,t*s*4)}async matmulT(e,r,t,n,s,a=!1){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([t,n,s]));let c=this.isF32(r)?this.buf(r,o):r,d=this.device.createBuffer({size:t*s*4,usage:o|i.GPUBufferUsage.COPY_SRC}),f=this.matmulTPlan(t,n,s,a);return this.run(f.shader,[u,this.buf(e,o),c,d],f.grid,d,t*s*4)}matmulTPlan(e,r,t,n){return n&&this.hasF16?this.f16SharedOk&&e>=32&&r%4===0?{shader:"matmul_t_f16w_shared",grid:[Math.ceil(t/64),Math.ceil(e/32),1]}:{shader:"matmul_t_f16w",grid:[Math.ceil(e/8),Math.ceil(t/8),1]}:{shader:r%4===0?"matmul_t_vec4":"matmul_t",grid:[Math.ceil(e/8),Math.ceil(t/8),1]}}async rmsnorm(e,r,t,n,s=1e-5,a=!1){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([t,n])),this.device.queue.writeBuffer(u,8,new Float32Array([s])),this.device.queue.writeBuffer(u,12,new Uint32Array([a?1:0]));let c=this.device.createBuffer({size:e.byteLength,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run("rmsnorm",[u,this.buf(e,o),this.buf(r,o),c],[Math.ceil(t/ie),1,1],c,e.byteLength)}async topKReadback(e,r,t){let n=globalThis,s=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST,a=this.device.createBuffer({size:8,usage:n.GPUBufferUsage.UNIFORM|n.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(a,0,new Uint32Array([e.length,r]));let i=this.device.createBuffer({size:r*2*4,usage:s|n.GPUBufferUsage.COPY_SRC}),o=this.device.createBuffer({size:r*2*4,usage:n.GPUBufferUsage.COPY_DST|n.GPUBufferUsage.MAP_READ}),u=this.device.createCommandEncoder(),c=this.buf(e,s);this.recordPass(u,t,[a,c,i],[1,1,1]),u.copyBufferToBuffer(i,0,o,0,r*2*4),this.device.queue.submit([u.finish()]),await o.mapAsync(n.GPUMapMode.READ);let d=new Uint32Array(o.getMappedRange().slice(0));return o.unmap(),o.destroy(),i.destroy?.(),a.destroy?.(),c.destroy?.(),d}async rmsnormVec(e,r,t,n,s=1e-5,a=!1,i="rmsnorm_vec"){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([t,n])),this.device.queue.writeBuffer(c,8,new Float32Array([s])),this.device.queue.writeBuffer(c,12,new Uint32Array([a?1:0]));let d=this.device.createBuffer({size:e.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run(i,[c,this.buf(e,u),this.buf(r,u),d],[t,1,1],d,e.byteLength)}async binary(e,r,t){let n=globalThis,s=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST,a=this.device.createBuffer({size:r.byteLength,usage:s|n.GPUBufferUsage.COPY_SRC});return this.run(e,[this.buf(r,s),this.buf(t,s),a],this.grid1D(r.length),a,r.byteLength)}swiglu(e,r){return this.binary("swiglu",e,r)}geglu(e,r){return this.binary("geglu",e,r)}add(e,r){return this.binary("add",e,r)}async silu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("silu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async groupNorm(e,r,t,n,s,a,i=1e-5,o="group_norm"){let u=globalThis,c=u.GPUBufferUsage.STORAGE|u.GPUBufferUsage.COPY_DST,d=this.device.createBuffer({size:16,usage:u.GPUBufferUsage.UNIFORM|u.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(d,0,new Uint32Array([n,s,a])),this.device.queue.writeBuffer(d,12,new Float32Array([i]));let f=this.device.createBuffer({size:e.byteLength,usage:c|u.GPUBufferUsage.COPY_SRC});return this.run(o,[d,this.buf(e,c),this.buf(r,c),this.buf(t,c),f],[a,1,1],f,e.byteLength)}async conv2d(e,r,t,n,s,a,i,o,u,c=1,d=0){let f=globalThis,g=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,p=Math.floor((s+2*d-o)/c)+1,h=Math.floor((a+2*d-u)/c)+1,w=n*o*u,P=p*h;if(w*P*4>this.maxStorageBufferBindingSize*.9)return this.conv2dDirect(e,r,t,n,s,a,i,o,u,c,d);let q=this.device.createBuffer({size:48,usage:f.GPUBufferUsage.UNIFORM|f.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(q,0,new Uint32Array([n,s,a,o,u,c,d,p,h]));let S=this.device.createBuffer({size:w*P*4,usage:g|f.GPUBufferUsage.COPY_SRC});this.dispatch("im2col",[q,this.buf(e,g),S],this.grid1D(w*P));let F=await this.matmul(r,S,i,w,P);if(S.destroy?.(),q.destroy?.(),t)for(let M=0;M<i;M++){let z=t[M];for(let U=0;U<P;U++)F[M*P+U]+=z}return F}async conv2dDirect(e,r,t,n,s,a,i,o,u,c=1,d=0){let f=globalThis,g=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,p=Math.floor((s+2*d-o)/c)+1,h=Math.floor((a+2*d-u)/c)+1,w=i*p*h,P=this.device.createBuffer({size:48,usage:f.GPUBufferUsage.UNIFORM|f.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(P,0,new Uint32Array([n,s,a,i,o,u,c,d,p,h]));let q=t??new Float32Array(i),S=this.device.createBuffer({size:w*4,usage:g|f.GPUBufferUsage.COPY_SRC});return this.run("conv2d_direct",[P,this.buf(e,g),this.buf(r,g),this.buf(q,g),S],this.grid1D(w),S,w*4)}async layernorm(e,r,t,n,s,a=1e-5){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s])),this.device.queue.writeBuffer(u,8,new Float32Array([a]));let c=this.device.createBuffer({size:e.byteLength,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run("layernorm",[u,this.buf(e,o),this.buf(r,o),this.buf(t,o),c],[Math.ceil(n/ie),1,1],c,e.byteLength)}async quickGelu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("quick_gelu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async gelu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("gelu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async relu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("relu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async upsampleNearest(e,r,t,n,s=2){let a=globalThis,i=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,o=t*s,u=n*s,c=r*o*u,d=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(d,0,new Uint32Array([r,t,n,s]));let f=this.device.createBuffer({size:c*4,usage:i|a.GPUBufferUsage.COPY_SRC});return this.run("upsample_nearest",[d,this.buf(e,i),f],this.grid1D(c),f,c*4)}async upscale2x(e,r,t,n,s=.5){let a=t*2,i=n*2,o=this.recordingSession(),u=this.uploadGpu(e),c=o.upscale2x(u,r,t,n,s),d=await o.finish(c,r*a*i);return this.releaseGpu([u]),d}async rope(e,r,t,n,s=0,a=1e4,i=!1){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:32,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([r,t,n,s])),this.device.queue.writeBuffer(c,16,new Float32Array([a]));let d=this.device.createBuffer({size:e.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.device.queue.writeBuffer(c,20,new Uint32Array([i?1:0])),this.run("rope",[c,this.buf(e,u),d],[Math.ceil(r/ie),1,1],d,e.byteLength)}async ropeFactors(e,r,t,n,s,a=0,i=1e4,o=!1){let u=globalThis,c=u.GPUBufferUsage.STORAGE|u.GPUBufferUsage.COPY_DST,d=this.device.createBuffer({size:32,usage:u.GPUBufferUsage.UNIFORM|u.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(d,0,new Uint32Array([t,n,s,a])),this.device.queue.writeBuffer(d,16,new Float32Array([i]));let f=this.device.createBuffer({size:r.byteLength,usage:c});this.device.queue.writeBuffer(f,0,r);let g=this.device.createBuffer({size:e.byteLength,usage:c|u.GPUBufferUsage.COPY_SRC});return this.device.queue.writeBuffer(d,20,new Uint32Array([o?1:0])),this.run("rope_factors",[d,this.buf(e,c),f,g],[Math.ceil(t/ie),1,1],g,e.byteLength)}async ropeMrope(e,r,t,n,s,a,i=1e4){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:32,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([t,n,s,a[0],a[0]+a[1]])),this.device.queue.writeBuffer(c,20,new Float32Array([i]));let d=this.device.createBuffer({size:r.byteLength,usage:u});this.device.queue.writeBuffer(d,0,r);let f=this.device.createBuffer({size:e.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("rope_mrope",[c,this.buf(e,u),d,f],[Math.ceil(t/ie),1,1],f,e.byteLength)}async rope2d(e,r,t,n,s,a=1e4){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:32,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([t,n,s,0])),this.device.queue.writeBuffer(u,16,new Float32Array([a]));let c=this.device.createBuffer({size:r.byteLength,usage:o});this.device.queue.writeBuffer(c,0,r);let d=this.device.createBuffer({size:e.byteLength,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run("rope_2d",[u,this.buf(e,o),c,d],[Math.ceil(t/ie),1,1],d,e.byteLength)}async attention(e,r,t,n,s,a,i,o=0,u,c=0,d=0){let f=globalThis,g=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,p=o+n,h=this.attnUniform(n,s,a,i,p,o,u??1/Math.sqrt(i),c,d),w=n*s*i*4,P=this.device.createBuffer({size:w,usage:g|f.GPUBufferUsage.COPY_SRC});return this.run("attention",[h,this.buf(e,g),this.buf(r,g),this.buf(t,g),P],[Math.ceil(n*s/ie),1,1],P,w)}async attentionDecode(e,r,t,n,s,a,i,o=0,u,c=0,d=0){let f=globalThis,g=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,p=o+n,h=this.attnUniform(n,s,a,i,p,o,u??1/Math.sqrt(i),c,d),w=n*s*i*4,P=this.device.createBuffer({size:w,usage:g|f.GPUBufferUsage.COPY_SRC});return this.run("attention_decode",[h,this.buf(e,g),this.buf(r,g),this.buf(t,g),P],[n*s,1,1],P,w)}async attentionPrefill(e,r,t,n,s,a,i,o=0,u,c=0,d=0){let f=globalThis,g=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,p=o+n,h=this.attnUniform(n,s,a,i,p,o,u??1/Math.sqrt(i),c,d),w=n*s*i*4,P=this.device.createBuffer({size:w,usage:g|f.GPUBufferUsage.COPY_SRC});return this.run("attention_prefill",[h,this.buf(e,g),this.buf(r,g),this.buf(t,g),P],[Math.ceil(n/4)*s,1,1],P,w)}async attentionFull(e,r,t,n,s,a,i,o,u,c=0){let d=globalThis,f=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,g=this.device.createBuffer({size:32,usage:d.GPUBufferUsage.UNIFORM|d.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(g,0,new Uint32Array([n,s,a,i,o,0])),this.device.queue.writeBuffer(g,24,new Float32Array([u??1/Math.sqrt(i),c]));let p=n*s*i*4,h=this.device.createBuffer({size:p,usage:f|d.GPUBufferUsage.COPY_SRC});return this.run("attention_full",[g,this.buf(e,f),this.buf(r,f),this.buf(t,f),h],[Math.ceil(n*s/ie),1,1],h,p)}async attentionFullWg(e,r,t,n,s,a,i,o,u,c=0){let d=globalThis,f=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,g=this.device.createBuffer({size:32,usage:d.GPUBufferUsage.UNIFORM|d.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(g,0,new Uint32Array([n,s,a,i,o,0])),this.device.queue.writeBuffer(g,24,new Float32Array([u??1/Math.sqrt(i),c]));let p=n*s*i*4,h=this.device.createBuffer({size:p,usage:f|d.GPUBufferUsage.COPY_SRC});return this.run("attention_full_wg",[g,this.buf(e,f),this.buf(r,f),this.buf(t,f),h],[n*s,1,1],h,p)}async quantizeKvReadback(e,r,t,n){let s=globalThis,a=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST|s.GPUBufferUsage.COPY_SRC,i=t*n,o=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([r,t,n,0]));let u=this.device.createBuffer({size:r*i,usage:a}),c=this.device.createBuffer({size:r*t*4,usage:a});this.dispatch("quantize_kv",[o,this.buf(e,a),u,c],this.grid1D(r*t));let d=await this.readBack(u,r*i),f=new Uint32Array(d.buffer,0,r*i/4),g=await this.readBack(c,r*t*4);return u.destroy?.(),c.destroy?.(),{codes:f,scales:g}}async attentionQ8Kv(e,r,t,n,s,a,i,o,u,c=0,d,f=0,g=0){let p=globalThis,h=p.GPUBufferUsage.STORAGE|p.GPUBufferUsage.COPY_DST,w=c+a,P=this.attnUniform(a,i,o,u,w,c,d??1/Math.sqrt(u),f,g),q=a*i*u*4,S=this.device.createBuffer({size:q,usage:h|p.GPUBufferUsage.COPY_SRC});return this.run("attention_q8kv",[P,this.buf(e,h),this.bufU32(r,h),this.buf(t,h),this.bufU32(n,h),this.buf(s,h),S],[Math.ceil(a*i/ie),1,1],S,q)}async attentionQ8KvDecode(e,r,t,n,s,a,i,o,u,c=0,d,f=0,g=0){let p=globalThis,h=p.GPUBufferUsage.STORAGE|p.GPUBufferUsage.COPY_DST,w=c+a,P=this.attnUniform(a,i,o,u,w,c,d??1/Math.sqrt(u),f,g),q=a*i*u*4,S=this.device.createBuffer({size:q,usage:h|p.GPUBufferUsage.COPY_SRC});return this.run("attention_decode_q8kv",[P,this.buf(e,h),this.bufU32(r,h),this.buf(t,h),this.bufU32(n,h),this.buf(s,h),S],[a*i,1,1],S,q)}async attentionQ8KvPrefill(e,r,t,n,s,a,i,o,u,c=0,d,f=0,g=0){let p=globalThis,h=p.GPUBufferUsage.STORAGE|p.GPUBufferUsage.COPY_DST,w=c+a,P=this.attnUniform(a,i,o,u,w,c,d??1/Math.sqrt(u),f,g),q=a*i*u*4,S=this.device.createBuffer({size:q,usage:h|p.GPUBufferUsage.COPY_SRC});return this.run("attention_prefill_q8kv",[P,this.buf(e,h),this.bufU32(r,h),this.buf(t,h),this.bufU32(n,h),this.buf(s,h),S],[Math.ceil(a/4)*i,1,1],S,q)}async addBias(e,r,t,n){let s=globalThis,a=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,i=this.device.createBuffer({size:8,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(i,0,new Uint32Array([t,n]));let o=this.device.createBuffer({size:e.byteLength,usage:a|s.GPUBufferUsage.COPY_SRC});return this.run("addbias",[i,this.buf(e,a),this.buf(r,a),o],this.grid1D(e.length),o,e.byteLength)}async dequantBlocked(e,r,t,n){let s=globalThis,a=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,i=t/n;if(!Number.isInteger(i))throw new Error(`${e}: nElems ${t} not a multiple of ${n}`);let o=r.byteLength%4===0?r:(()=>{let f=new Uint8Array(Math.ceil(r.byteLength/4)*4);return f.set(r),f})(),u=new Uint32Array(o.buffer,o.byteOffset,o.byteLength/4),c=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([i]));let d=this.device.createBuffer({size:t*4,usage:a|s.GPUBufferUsage.COPY_SRC});return this.run(e,[c,this.bufU32(u,a),d],this.grid1D(i),d,t*4)}async dequantizeQ4K(e,r){return this.dequantBlocked("dequant_q4k",e,r,256)}async dequantizeByType(e,r,t){if(e==="F32")return new Float32Array(r.buffer,r.byteOffset,t);if(e==="F16"){let a=new DataView(r.buffer,r.byteOffset),i=new Float32Array(t);for(let o=0;o<t;o++)i[o]=we(a.getUint16(o*2,!0));return i}if(e==="Q4W")return pe(qe(r,t));if(e==="Q8W")return me(Oe(r,t));if(e==="Q3W")return Le(De(r,t));let n=ee.DEQUANT_SHADER[e],s=ee.BLOCK_ELEMS[e];if(!n||!s)throw new Error(`dequant: unsupported GGML type ${e}`);return this.dequantBlocked(n,r,t,s)}dequantBlockedGpu(e,r,t,n){let s=globalThis,a=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,i=t/n;if(!Number.isInteger(i))throw new Error(`${e}: nElems ${t} not a multiple of ${n}`);let o=r.byteLength%4===0?r:(()=>{let f=new Uint8Array(Math.ceil(r.byteLength/4)*4);return f.set(r),f})(),u=new Uint32Array(o.buffer,o.byteOffset,o.byteLength/4),c=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([i]));let d=this.device.createBuffer({size:t*4,usage:a});return this.dispatch(e,[c,this.bufU32(u,a),d],this.grid1D(i)),d}dequantizeToGpu(e,r,t){let n=globalThis,s=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST;if(e==="F32")return this.buf(new Float32Array(r.buffer,r.byteOffset,t),s);if(e==="F16"){let o=new DataView(r.buffer,r.byteOffset),u=new Float32Array(t);for(let c=0;c<t;c++)u[c]=we(o.getUint16(c*2,!0));return this.buf(u,s)}if(e==="Q4W")return this.buf(pe(qe(r,t)),s);if(e==="Q8W")return this.buf(me(Oe(r,t)),s);if(e==="Q3W")return this.buf(Le(De(r,t)),s);let a=ee.DEQUANT_SHADER[e],i=ee.BLOCK_ELEMS[e];if(!a||!i)throw new Error(`dequant: unsupported GGML type ${e}`);return this.dequantBlockedGpu(a,r,t,i)}async layerForward(e,r,t,n=!1){let{seq:s,d:a,nHeads:i,nKvHeads:o,headDim:u,ffn:c,ropeTheta:d,eps:f}=r,g=o*u,p=n?(B,C,D,T,L)=>this.matmulT(B,C,D,T,L):(B,C,D,T,L)=>this.matmul(B,C,D,T,L),h=i*u,w=r.rmsGainOnePlus===!0,P=r.attnLogitSoftcap??0,q=(B,C)=>r.act==="gelu"?this.geglu(B,C):this.swiglu(B,C),S=await this.rmsnorm(e,t.attnNorm,s,a,f,w),F=await p(S,t.wq,s,a,h),M=await p(S,t.wk,s,a,g),z=await p(S,t.wv,s,a,g);t.bq&&(F=await this.addBias(F,t.bq,s,h)),t.bk&&(M=await this.addBias(M,t.bk,s,g)),t.bv&&(z=await this.addBias(z,t.bv,s,g)),t.qNorm&&(F=await this.rmsnorm(F,t.qNorm,s*i,u,f,w)),t.kNorm&&(M=await this.rmsnorm(M,t.kNorm,s*o,u,f,w));let U=await this.rope(F,s*i,u,i,0,d),k=await this.rope(M,s*o,u,o,0,d),v=await this.attention(U,k,z,s,i,o,u,0,r.attnScale,P),m=await p(v,t.wo,s,h,a);t.postAttnNorm&&(m=await this.rmsnorm(m,t.postAttnNorm,s,a,f,w));let y=await this.add(e,m),b=await this.rmsnorm(y,t.ffnNorm,s,a,f,w),A=await p(b,t.wgate,s,a,c),x=await p(b,t.wup,s,a,c),G=await q(A,x),_=await p(G,t.wdown,s,c,a);return t.postFfnNorm&&(_=await this.rmsnorm(_,t.postFfnNorm,s,a,f,w)),this.add(y,_)}async layerForwardKV(e,r,t,n,s,a,i=!1){let{seq:o,d:u,nHeads:c,nKvHeads:d,headDim:f,ffn:g,ropeTheta:p,eps:h}=r,w=d*f,P=i?(Y,$,J,W,O)=>this.matmulT(Y,$,J,W,O):(Y,$,J,W,O)=>this.matmul(Y,$,J,W,O),q=(Y,$)=>{let J=new Float32Array(Y.length+$.length);return J.set(Y),J.set($,Y.length),J},S=c*f,F=r.rmsGainOnePlus===!0,M=r.attnLogitSoftcap??0,z=(Y,$)=>r.act==="gelu"?this.geglu(Y,$):this.swiglu(Y,$),U=await this.rmsnorm(e,t.attnNorm,o,u,h,F),k=await P(U,t.wq,o,u,S),v=await P(U,t.wk,o,u,w),m=await P(U,t.wv,o,u,w);t.bq&&(k=await this.addBias(k,t.bq,o,S)),t.bk&&(v=await this.addBias(v,t.bk,o,w)),t.bv&&(m=await this.addBias(m,t.bv,o,w)),t.qNorm&&(k=await this.rmsnorm(k,t.qNorm,o*c,f,h,F)),t.kNorm&&(v=await this.rmsnorm(v,t.kNorm,o*d,f,h,F));let y=await this.rope(k,o*c,f,c,n,p),b=await this.rope(v,o*d,f,d,n,p),A=q(s,b),x=q(a,m),G=await this.attention(y,A,x,o,c,d,f,n,r.attnScale,M),_=await P(G,t.wo,o,S,u);t.postAttnNorm&&(_=await this.rmsnorm(_,t.postAttnNorm,o,u,h,F));let B=await this.add(e,_),C=await this.rmsnorm(B,t.ffnNorm,o,u,h,F),D=await P(C,t.wgate,o,u,g),T=await P(C,t.wup,o,u,g),L=await z(D,T),N=await P(L,t.wdown,o,g,u);return t.postFfnNorm&&(N=await this.rmsnorm(N,t.postFfnNorm,o,u,h,F)),{out:await this.add(B,N),k:A,v:x}}storage(e){let r=this.bufferPool.get(e);if(r&&r.length){let n=r.pop();return this.pooled.delete(n),n}let t=this.device.createBuffer({size:e,usage:ee.STORAGE_USAGE});return this.poolSize.set(t,e),t}release(e){for(let r of e){if(!r)continue;let t=this.poolSize.get(r);if(t!==void 0){if(this.pooled.has(r))continue;this.pooled.add(r);let s=this.bufferPool.get(t);s||(s=[],this.bufferPool.set(t,s)),s.push(r);continue}let n=this.uniformSize.get(r);if(n!==void 0){if(this.pooled.has(r))continue;this.pooled.add(r);let s=this.uniformPool.get(n);s||(s=[],this.uniformPool.set(n,s)),s.push(r);continue}r.destroy?.()}}uploadGpu(e){return e instanceof Float32Array?this.buf(e,ee.STORAGE_USAGE):this.f16ToF32Gpu(e.f16,e.n)}uploadGpuF16(e){let r=new Uint16Array(e.length);for(let t=0;t<e.length;t++)r[t]=Te(e[t]);return this.bufU16(r)}f32ToF16Gpu(e,r){let t=globalThis,n=Math.ceil(r/2),s=this.device.createBuffer({size:n*4,usage:ee.STORAGE_USAGE}),a=this.device.createBuffer({size:16,usage:t.GPUBufferUsage.UNIFORM|t.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(a,0,new Uint32Array([n])),this.dispatch("packf16",[a,e,s],this.grid1D(n)),s}f32ToQ8Gpu(e,r){let t=globalThis,n=r/32,s=this.device.createBuffer({size:r,usage:ee.STORAGE_USAGE}),a=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:ee.STORAGE_USAGE}),i=this.device.createBuffer({size:16,usage:t.GPUBufferUsage.UNIFORM|t.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(i,0,new Uint32Array([n])),this.dispatch("quantize_q8",[i,e,s,a],this.grid1D(n)),{codes:s,sc:a}}f32ToQ4Gpu(e,r){let t=globalThis,n=r/32,s=this.device.createBuffer({size:r/2,usage:ee.STORAGE_USAGE}),a=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:ee.STORAGE_USAGE}),i=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:ee.STORAGE_USAGE}),o=this.device.createBuffer({size:16,usage:t.GPUBufferUsage.UNIFORM|t.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(o,0,new Uint32Array([n])),this.dispatch("quantize_q4",[o,e,s,a,i],this.grid1D(n)),{nib:s,sc:a,mn:i}}uploadGpuRawF16(e){let r=Math.ceil(e.byteLength/4)*4,t=this.device.createBuffer({size:r,usage:ee.STORAGE_USAGE});if(this.device.queue.writeBuffer(t,0,e,0,e.byteLength-e.byteLength%4),e.byteLength%4){let n=new Uint8Array(4);n.set(e.subarray(e.byteLength-e.byteLength%4)),this.device.queue.writeBuffer(t,e.byteLength-e.byteLength%4,n)}return t}bufU16(e){let r=this.device.createBuffer({size:e.byteLength,usage:ee.STORAGE_USAGE});return this.device.queue.writeBuffer(r,0,e),r}uploadGpuRaw(e){let r=Math.ceil(e.byteLength/4)*4,t=this.device.createBuffer({size:r,usage:ee.STORAGE_USAGE}),n=e.byteLength-e.byteLength%4;if(this.device.queue.writeBuffer(t,0,e,0,n),e.byteLength%4){let s=new Uint8Array(4);s.set(e.subarray(n)),this.device.queue.writeBuffer(t,n,s)}return t}async matmulQ4(e,r,t,n,s,a,i){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s,a,i]));let d=this.device.createBuffer({size:s*i*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4",[c,this.buf(e,u),r,t,n,d],[Math.ceil(s/8),Math.ceil(i/8),1],d,s*i*4)}async matmulQ4Tiled(e,r,t,n,s,a,i){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s,a,i]));let d=this.device.createBuffer({size:s*i*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_tiled",[c,this.buf(e,u),r,t,n,d],[Math.ceil(Math.ceil(s/4)/8),Math.ceil(i/8),1],d,s*i*4)}async matmulQ4Shared(e,r,t,n,s,a,i){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s,a,i]));let d=this.device.createBuffer({size:s*i*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_shared",[c,this.buf(e,u),r,t,n,d],[Math.ceil(i/64),Math.ceil(s/32),1],d,s*i*4)}async matmulQ3(e,r,t,n,s,a,i,o){let u=globalThis,c=u.GPUBufferUsage.STORAGE|u.GPUBufferUsage.COPY_DST,d=this.device.createBuffer({size:16,usage:u.GPUBufferUsage.UNIFORM|u.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(d,0,new Uint32Array([a,i,o]));let f=this.device.createBuffer({size:a*o*4,usage:c|u.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q3",[d,this.buf(e,c),r,t,n,s,f],[Math.ceil(a/8),Math.ceil(o/8),1],f,a*o*4)}async rwkvWkv7(e,r,t,n,s,a,i,o,u){let c=globalThis,d=c.GPUBufferUsage.STORAGE|c.GPUBufferUsage.COPY_DST,f=this.device.createBuffer({size:8,usage:c.GPUBufferUsage.UNIFORM|c.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(f,0,new Uint32Array([o,u]));let g=this.device.createBuffer({size:e.byteLength,usage:d|c.GPUBufferUsage.COPY_SRC});this.device.queue.writeBuffer(g,0,e);let p=this.device.createBuffer({size:o*u*4,usage:d|c.GPUBufferUsage.COPY_SRC});this.dispatch("rwkv_wkv7",[f,this.buf(r,d),this.buf(t,d),this.buf(n,d),this.buf(s,d),this.buf(a,d),this.buf(i,d),g,p],this.grid1D(o*u));let h=await this.readBack(g,e.byteLength),w=await this.readBack(p,o*u*4);return g.destroy?.(),p.destroy?.(),{S:h,y:w}}async rwkvTokenShift(e,r,t,n){let s=globalThis,a=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,i=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(i,0,new Uint32Array([n]));let o=this.device.createBuffer({size:6*n*4,usage:a|s.GPUBufferUsage.COPY_SRC});this.dispatch("rwkv_token_shift",[i,this.buf(e,a),this.buf(r,a),this.buf(t,a),o],this.grid1D(n*6));let u=await this.readBack(o,6*n*4);return o.destroy?.(),u}async lfm2ShortConv(e,r,t,n,s){let a=globalThis,i=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,o=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([n,s]));let u=this.buf(r,i|a.GPUBufferUsage.COPY_SRC),c=this.device.createBuffer({size:n*4,usage:i|a.GPUBufferUsage.COPY_SRC});this.dispatch("lfm2_shortconv",[o,this.buf(e,i),this.buf(t,i),u,c],this.grid1D(n));let d=await this.readBack(c,n*4),f=await this.readBack(u,(s-1)*n*4);return c.destroy?.(),u.destroy?.(),{out:d,state:f}}async matmulQ8(e,r,t,n,s,a){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s,a]));let c=this.device.createBuffer({size:n*a*4,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8",[u,this.buf(e,o),r,t,c],[Math.ceil(n/8),Math.ceil(a/8),1],c,n*a*4)}async matmulQ8Tiled(e,r,t,n,s,a){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s,a]));let c=this.device.createBuffer({size:n*a*4,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_tiled",[u,this.buf(e,o),r,t,c],[Math.ceil(Math.ceil(n/4)/8),Math.ceil(a/8),1],c,n*a*4)}async matmulQ8Shared(e,r,t,n,s,a){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s,a]));let c=this.device.createBuffer({size:n*a*4,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_shared",[u,this.buf(e,o),r,t,c],[Math.ceil(a/64),Math.ceil(n/32),1],c,n*a*4)}async matmulQ8Shared2(e,r,t,n,s,a){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s,a]));let c=this.device.createBuffer({size:n*a*4,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_shared2",[u,this.buf(e,o),r,t,c],[Math.ceil(a/128),Math.ceil(n/64),1],c,n*a*4)}async matmulQ4Shared2(e,r,t,n,s,a,i){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s,a,i]));let d=this.device.createBuffer({size:s*i*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_shared2",[c,this.buf(e,u),r,t,n,d],[Math.ceil(i/128),Math.ceil(s/64),1],d,s*i*4)}uniformOf(e){let r=globalThis,t=this.uniformPool.get(e);if(t&&t.length){let s=t.pop();return this.pooled.delete(s),s}let n=this.device.createBuffer({size:e,usage:r.GPUBufferUsage.UNIFORM|r.GPUBufferUsage.COPY_DST});return this.uniformSize.set(n,e),n}uniform(e,r){let t=this.uniformOf(32);if(this.device.queue.writeBuffer(t,0,new Uint32Array(e)),r){let n=Array.isArray(r.value)?r.value:[r.value];this.device.queue.writeBuffer(t,r.offset,new Float32Array(n))}return t}attnUniform(e,r,t,n,s,a,i,o,u){let c=this.uniformOf(48);return this.device.queue.writeBuffer(c,0,new Uint32Array([e,r,t,n,s,a])),this.device.queue.writeBuffer(c,24,new Float32Array([i,o])),this.device.queue.writeBuffer(c,32,new Uint32Array([u])),c}recMatmulT(e,r,t,n,s,a,i,o=!1){let u=this.uniform([s,a,i]),c=this.storage(s*i*4),d=this.matmulTPlan(s,a,i,o);return this.recordPass(e,d.shader,[u,t,n,c],d.grid),r.push(u,c),c}recConv2dDirect(e,r,t,n,s,a,i,o,u,c,d,f,g){let p=Math.floor((i+2*g-c)/f)+1,h=Math.floor((o+2*g-d)/f)+1,w=u*p*h,P=this.uniformOf(48);if(this.device.queue.writeBuffer(P,0,new Uint32Array([a,i,o,u,c,d,f,g,p,h])),c===3&&d===3&&f===1&&g===1&&this.convTiledOk){let S=this.storage(w*4);return this.recordPass(e,"conv2d_3x3_tiled",[P,t,n,s,S],[Math.ceil(h/16),Math.ceil(p/16),u]),r.push(P,S),S}let q=this.storage(w*4);return this.recordPass(e,"conv2d_direct",[P,t,n,s,q],this.grid1D(w)),r.push(P,q),q}recConv2dDirectQ8(e,r,t,n,s,a,i,o,u,c,d,f,g){let p=Math.floor((i+2*g-c)/f)+1,h=Math.floor((o+2*g-d)/f)+1,w=u*p*h,P=this.uniformOf(48);if(this.device.queue.writeBuffer(P,0,new Uint32Array([a,i,o,u,c,d,f,g,p,h])),c===3&&d===3&&f===1&&g===1&&this.convTiledQOk){let S=this.storage(w*4);return this.recordPass(e,"conv2d_3x3_tiled_q8",[P,t,n.codes,n.sc,s,S],[Math.ceil(h/16),Math.ceil(p/16),Math.ceil(u/8)]),r.push(P,S),S}if(c===1&&d===1&&f===1&&g===0&&this.convTiledQOk){let S=this.storage(w*4);return this.recordPass(e,"conv2d_1x1_q8",[P,t,n.codes,n.sc,s,S],[Math.ceil(h/16),Math.ceil(p/16),Math.ceil(u/8)]),r.push(P,S),S}if(c===3&&d===3&&f===2&&g===1&&this.convTiledQOk&&this.convS2Ok){let S=this.storage(w*4);return this.recordPass(e,"conv2d_3x3_s2_tiled_q8",[P,t,n.codes,n.sc,s,S],[Math.ceil(h/16),Math.ceil(p/8),Math.ceil(u/8)]),r.push(P,S),S}let q=this.storage(w*4);return this.recordPass(e,"conv2d_direct_q8",[P,t,n.codes,n.sc,s,q],this.grid1D(w)),r.push(P,q),q}recConv2dDirectQ4(e,r,t,n,s,a,i,o,u,c,d,f,g){let p=Math.floor((i+2*g-c)/f)+1,h=Math.floor((o+2*g-d)/f)+1,w=u*p*h,P=this.uniformOf(48);if(this.device.queue.writeBuffer(P,0,new Uint32Array([a,i,o,u,c,d,f,g,p,h])),c===3&&d===3&&f===1&&g===1&&this.convTiledQOk){let S=this.storage(w*4);return this.recordPass(e,"conv2d_3x3_tiled_q4",[P,t,n.nib,n.sc,n.mn,s,S],[Math.ceil(h/16),Math.ceil(p/16),Math.ceil(u/8)]),r.push(P,S),S}if(c===1&&d===1&&f===1&&g===0&&this.convTiledQOk){let S=this.storage(w*4);return this.recordPass(e,"conv2d_1x1_q4",[P,t,n.nib,n.sc,n.mn,s,S],[Math.ceil(h/16),Math.ceil(p/16),Math.ceil(u/8)]),r.push(P,S),S}if(c===3&&d===3&&f===2&&g===1&&this.convTiledQOk&&this.convS2Ok){let S=this.storage(w*4);return this.recordPass(e,"conv2d_3x3_s2_tiled_q4",[P,t,n.nib,n.sc,n.mn,s,S],[Math.ceil(h/16),Math.ceil(p/8),Math.ceil(u/8)]),r.push(P,S),S}let q=this.storage(w*4);return this.recordPass(e,"conv2d_direct_q4",[P,t,n.nib,n.sc,n.mn,s,q],this.grid1D(w)),r.push(P,q),q}recGroupNorm(e,r,t,n,s,a,i,o,u){let c=this.uniform([a,i,o],{offset:12,value:u}),d=this.storage(a*i*4),f=this.hasSubgroups&&this.subgroupsOk?"group_norm_subgroup":"group_norm";return this.recordPass(e,f,[c,t,n,s,d],[o,1,1]),r.push(c,d),d}recUnary(e,r,t,n,s){let a=this.storage(s*4);return this.recordPass(e,t,[n,a],this.grid1D(s)),r.push(a),a}recLayernorm(e,r,t,n,s,a,i,o){let u=this.uniform([a,i],{offset:8,value:o}),c=this.storage(a*i*4);return this.recordPass(e,"layernorm",[u,t,n,s,c],[Math.ceil(a/ie),1,1]),r.push(u,c),c}recAttentionFull(e,r,t,n,s,a,i,o,u,c,d){let f=this.uniform([a,i,o,u,c,0],{offset:24,value:[d??1/Math.sqrt(u),0]}),g=this.storage(a*i*u*4),p=a*i;return this.attnFullWgOk&&u<=192&&p<=65535?this.recordPass(e,"attention_full_wg",[f,t,n,s,g],[p,1,1]):this.recordPass(e,"attention_full",[f,t,n,s,g],[Math.ceil(p/ie),1,1]),r.push(f,g),g}recUpsample(e,r,t,n,s,a,i){let o=this.uniform([n,s,a,i]),u=n*(s*i)*(a*i),c=this.storage(u*4);return this.recordPass(e,"upsample_nearest",[o,t,c],this.grid1D(u)),r.push(o,c),c}recConcat(e,r,t,n,s,a,i){let o=this.storage((s+a)*i*4);return e.copyBufferToBuffer(t,0,o,0,s*i*4),e.copyBufferToBuffer(n,0,o,s*i*4,a*i*4),r.push(o),o}recAddChannelBias(e,r,t,n,s,a){let i=this.uniform([s,a]),o=this.storage(s*a*4);return this.recordPass(e,"add_channel_bias",[i,t,n,o],this.grid1D(s*a)),r.push(i,o),o}recTranspose(e,r,t,n,s){let a=this.uniform([n,s]),i=this.storage(n*s*4);return this.recordPass(e,"transpose2d",[a,t,i],this.grid1D(n*s)),r.push(a,i),i}recGegluSplit(e,r,t,n,s){let a=this.uniform([n,s]),i=this.storage(n*s*4);return this.recordPass(e,"geglu_split",[a,t,i],this.grid1D(n*s)),r.push(a,i),i}recUpscale2x(e,r,t,n,s,a,i=.5){let o=this.uniform([n,s,a],{offset:12,value:i}),u=a*2,c=s*2,d=this.storage(n*c*u*4);return this.recordPass(e,"upscale2x_enhanced",[o,t,d],[Math.ceil(u/16),Math.ceil(c/16),n]),r.push(o,d),d}recVideoGather(e,r,t,n,s,a){let i=this.uniform([n,s,a]),o=this.storage(a*n*s*4);return this.recordPass(e,"video_motion_gather",[i,t,o],this.grid1D(a*n*s)),r.push(i,o),o}recVideoScatter(e,r,t,n,s,a,i){let o=this.uniform([s,a,i]),u=this.storage(s*a*i*4);return this.recordPass(e,"video_motion_scatter",[o,t,n,u],this.grid1D(s*a*i)),r.push(o,u),u}recVideoAddPe(e,r,t,n,s,a,i){let o=this.uniform([s,a,i]),u=this.storage(i*s*a*4);return this.recordPass(e,"video_add_pe",[o,t,n,u],this.grid1D(i*s*a)),r.push(o,u),u}recAttnTemporal(e,r,t,n,s,a,i,o,u){let c=this.uniform([a,i,o,u],{offset:16,value:1/Math.sqrt(u)}),d=this.storage(a*i*o*u*4);return this.recordPass(e,"attn_temporal",[c,t,n,s,d],this.grid1D(a*i*o)),r.push(c,d),d}recordingSession(){let e=this.device.createCommandEncoder(),r=[],t=n=>{if(n instanceof Float32Array){let s=this.uploadGpu(n);return r.push(s),s}return n};return{conv2d:(n,s,a,i,o,u,c,d,f,g,p)=>s&&s.nib?this.recConv2dDirectQ4(e,r,t(n),s,t(a),i,o,u,c,d,f,g,p):s&&s.codes?this.recConv2dDirectQ8(e,r,t(n),s,t(a),i,o,u,c,d,f,g,p):this.recConv2dDirect(e,r,t(n),t(s),t(a),i,o,u,c,d,f,g,p),groupNorm:(n,s,a,i,o,u,c)=>this.recGroupNorm(e,r,t(n),t(s),t(a),i,o,u,c),silu:(n,s)=>this.recUnary(e,r,"silu",t(n),s),quickGelu:(n,s)=>this.recUnary(e,r,"quick_gelu",t(n),s),gelu:(n,s)=>this.recUnary(e,r,"gelu",t(n),s),relu:(n,s)=>this.recUnary(e,r,"relu",t(n),s),add:(n,s,a)=>this.recBinary(e,r,"add",t(n),t(s),a),geglu:(n,s,a)=>this.recBinary(e,r,"geglu",t(n),t(s),a),matmulT:(n,s,a,i,o)=>this.recMM(e,r,t(n),s instanceof Float32Array?t(s):s,a,i,o,!1),addBias:(n,s,a,i)=>this.recAddBias(e,r,t(n),t(s),a,i),addChannelBias:(n,s,a,i)=>this.recAddChannelBias(e,r,t(n),t(s),a,i),attentionFull:(n,s,a,i,o,u,c,d)=>this.recAttentionFull(e,r,t(n),t(s),t(a),i,o,u,c,d),rope2d:(n,s,a,i,o,u)=>{let c=s instanceof Uint32Array?(()=>{let d=this.uploadGpuRaw(new Uint8Array(s.buffer,s.byteOffset,s.byteLength));return r.push(d),d})():s;return this.recRope2d(e,r,t(n),c,a,i,o,u)},attention:(n,s,a,i,o,u,c,d,f)=>this.recAttention(e,r,t(n),t(s),t(a),i,o,u,c,d,f),upsample:(n,s,a,i,o)=>this.recUpsample(e,r,t(n),s,a,i,o),upscale2x:(n,s,a,i,o=.5)=>this.recUpscale2x(e,r,t(n),s,a,i,o),layernorm:(n,s,a,i,o,u)=>this.recLayernorm(e,r,t(n),t(s),t(a),i,o,u),concat:(n,s,a,i,o)=>this.recConcat(e,r,t(n),t(s),a,i,o),transpose:(n,s,a)=>this.recTranspose(e,r,t(n),s,a),gegluSplit:(n,s,a)=>this.recGegluSplit(e,r,t(n),s,a),videoGather:(n,s,a,i)=>this.recVideoGather(e,r,t(n),s,a,i),videoScatter:(n,s,a,i,o)=>this.recVideoScatter(e,r,t(n),t(s),a,i,o),videoAddPe:(n,s,a,i,o)=>this.recVideoAddPe(e,r,t(n),t(s),a,i,o),attnTemporal:(n,s,a,i,o,u,c)=>this.recAttnTemporal(e,r,t(n),t(s),t(a),i,o,u,c),alloc:n=>{let s=this.storage(n);return r.push(s),s},copy:(n,s,a,i,o)=>{e.copyBufferToBuffer(a,i,n,s,o)},finish:async(n,s)=>{this.device.queue.submit([e.finish()]);let a=await this.readBack(n,s*4);return this.release(r),a},finishKeep:n=>{this.device.queue.submit([e.finish()]);let s=r.indexOf(n);return s>=0&&r.splice(s,1),this.release(r),n},finishKeepMany:n=>{this.device.queue.submit([e.finish()]);for(let s of n){let a=r.indexOf(s);a>=0&&r.splice(a,1)}return this.release(r),n}}}readGpu(e,r){return this.readBack(e,r*4)}trimPool(e=64<<20){let r=[...this.bufferPool.keys()].sort((n,s)=>s-n),t=0;for(let n of this.bufferPool.values())for(let s of n)t+=this.poolSize.get(s)??0;for(let n of r){let s=this.bufferPool.get(n);for(;s.length&&t>e;){let a=s.pop();this.pooled.delete(a),this.poolSize.delete(a),a.destroy?.(),t-=n}}}releaseGpu(e){this.release(e)}waitGpu(){return this.device.queue.onSubmittedWorkDone()}async benchMatmul(e,r,t,n,s,a={}){let{iters:i=10,shared:o=!0,shared2:u=!0,wF16:c=!1}=a,d=this.f16SharedOk,f=this.qSharedOk,g=this.qShared2Ok;this.f16SharedOk=o,this.qSharedOk=o,this.qShared2Ok=o&&u;let p=this.uploadGpu(e),h=[],w=this.device.createCommandEncoder();this.recMM(w,h,p,r,t,n,s,c),this.device.queue.submit([w.finish()]),await this.device.queue.onSubmittedWorkDone();let P=this.device.createCommandEncoder();for(let F=0;F<i;F++)this.recMM(P,h,p,r,t,n,s,c);let q=performance.now();this.device.queue.submit([P.finish()]),await this.device.queue.onSubmittedWorkDone();let S=(performance.now()-q)/i;return this.release(h),p.destroy?.(),this.f16SharedOk=d,this.qSharedOk=f,this.qShared2Ok=g,S}destroy(){try{this.profiler?.destroy()}catch{}this.profiler=null;try{this.device?.destroy?.()}catch{}this.bufferPool.clear(),this.uniformPool.clear()}f16ToF32Gpu(e,r){let t=this.uploadGpuRawF16(e),n=this.device.createBuffer({size:r*4,usage:ee.STORAGE_USAGE}),s=this.uniformOf(16);return this.device.queue.writeBuffer(s,0,new Uint32Array([r])),this.dispatch("f16_to_f32",[s,t,n],this.grid1D(Math.ceil(r/2))),t.destroy?.(),this.release([s]),n}quantizeQ8Gpu(e){let r=e instanceof Float32Array?e.length:e.n;if(r%32!==0)return this.uploadGpu(e);let t=e instanceof Float32Array?this.buf(e,ee.STORAGE_USAGE):this.f16ToF32Gpu(e.f16,r),n=this.f32ToQ8Gpu(t,r);return t.destroy?.(),n}async validateResidentOps(){let e=globalThis,r=y=>Float32Array.from({length:y},()=>(Math.random()*2-1)*.5),t=(y,b,A=.005)=>y.length===b.length&&y.every((x,G)=>Math.abs(x-b[G])<=A*(1+Math.abs(b[G]))),n=4,s=4,a=4,i=4,o=2,u=1e-5,c=i*s*a,d=r(n*s*a),f=r(i*n*9),g=r(i),p=r(i),h=r(i),w=await this.silu(await this.groupNorm(await this.conv2dDirect(d,f,g,n,s,a,i,3,3,1,1),p,h,i,s*a,o,u)),P=[],q=this.device.createCommandEncoder(),S=this.uploadGpu(d),F=this.uploadGpu(f),M=this.uploadGpu(g),z=this.uploadGpu(p),U=this.uploadGpu(h);P.push(S,F,M,z,U);let k=this.recConv2dDirect(q,P,S,F,M,n,s,a,i,3,3,1,1);k=this.recGroupNorm(q,P,k,z,U,i,s*a,o,u),k=this.recUnary(q,P,"silu",k,c);let v=this.device.createBuffer({size:c*4,usage:e.GPUBufferUsage.COPY_DST|e.GPUBufferUsage.MAP_READ});q.copyBufferToBuffer(k,0,v,0,c*4),this.device.queue.submit([q.finish()]),await v.mapAsync(e.GPUMapMode.READ);let m=new Float32Array(v.getMappedRange().slice(0));return v.unmap(),v.destroy(),this.release(P),t(m,w)?null:"resident_ops"}recMatmulQ4(e,r,t,n,s,a,i){let o=this.uniform([s,a,i]),u=this.storage(s*i*4);if(s===1&&this.gemvOk){let c=this.gemvGrid(i);this.recordPass(e,"matmul_t_q4_vec",[this.uniform([s,a,i,c.stride]),t,n.nib,n.sc,n.mn,u],c.grid)}else s>=64&&this.qSharedOk&&this.qShared2Ok?this.recordPass(e,"matmul_t_q4_shared2",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(i/128),Math.ceil(s/64),1]):s>=32&&this.qSharedOk?this.recordPass(e,"matmul_t_q4_shared",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(i/64),Math.ceil(s/32),1]):s>=2?this.recordPass(e,"matmul_t_q4_tiled",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(Math.ceil(s/4)/8),Math.ceil(i/8),1]):this.recordPass(e,"matmul_t_q4",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(s/8),Math.ceil(i/8),1]);return r.push(o,u),u}recMatmulQ8(e,r,t,n,s,a,i){let o=this.uniform([s,a,i]),u=this.storage(s*i*4);if(s===1&&this.gemvOk){let c=this.gemvGrid(i);this.recordPass(e,"matmul_t_q8_vec",[this.uniform([s,a,i,c.stride]),t,n.codes,n.sc,u],c.grid)}else s>=64&&this.qSharedOk&&this.qShared2Ok?this.recordPass(e,"matmul_t_q8_shared2",[o,t,n.codes,n.sc,u],[Math.ceil(i/128),Math.ceil(s/64),1]):s>=32&&this.qSharedOk?this.recordPass(e,"matmul_t_q8_shared",[o,t,n.codes,n.sc,u],[Math.ceil(i/64),Math.ceil(s/32),1]):s>=2?this.recordPass(e,"matmul_t_q8_tiled",[o,t,n.codes,n.sc,u],[Math.ceil(Math.ceil(s/4)/8),Math.ceil(i/8),1]):this.recordPass(e,"matmul_t_q8",[o,t,n.codes,n.sc,u],[Math.ceil(s/8),Math.ceil(i/8),1]);return r.push(o,u),u}gemvGrid(e){return e<=32768?{grid:[e,1,1],stride:32768}:{grid:[32768,Math.ceil(e/32768),1],stride:32768}}async matmulQ4Vec(e,r,t,n,s,a){let i=globalThis,o=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,u=this.gemvGrid(a),c=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([1,s,a,u.stride]));let d=this.device.createBuffer({size:a*4,usage:o|i.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_vec",[c,this.buf(e,o),r,t,n,d],u.grid,d,a*4)}async matmulQ8Vec(e,r,t,n,s){let a=globalThis,i=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,o=this.gemvGrid(s),u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([1,n,s,o.stride]));let c=this.device.createBuffer({size:s*4,usage:i|a.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_vec",[u,this.buf(e,i),r,t,c],o.grid,c,s*4)}recMatmulQ3(e,r,t,n,s,a,i){let o=this.uniform([s,a,i]),u=this.storage(s*i*4);return this.recordPass(e,"matmul_t_q3",[o,t,n.lo,n.hi,n.sc,n.mn,u],[Math.ceil(s/8),Math.ceil(i/8),1]),r.push(o,u),u}recMM(e,r,t,n,s,a,i,o){return n&&n.q3?this.recMatmulQ3(e,r,t,n,s,a,i):n&&n.nib?this.recMatmulQ4(e,r,t,n,s,a,i):n&&n.codes?this.recMatmulQ8(e,r,t,n,s,a,i):this.recMatmulT(e,r,t,n,s,a,i,o)}recRmsnorm(e,r,t,n,s,a,i,o=!1){let u=this.uniform([s,a,0,o?1:0],{offset:8,value:i}),c=this.storage(s*a*4);if(this.rmsVecOk&&s<=65535){let d=this.hasSubgroups&&this.subgroupsOk?"rmsnorm_vec_subgroup":"rmsnorm_vec";this.recordPass(e,d,[u,t,n,c],[s,1,1])}else this.recordPass(e,"rmsnorm",[u,t,n,c],[Math.ceil(s/ie),1,1]);return r.push(u,c),c}recRope(e,r,t,n,s,a,i,o,u=!1){let c=this.uniform([n,s,a,i],{offset:16,value:o});this.device.queue.writeBuffer(c,20,new Uint32Array([u?1:0]));let d=this.storage(n*s*4);return this.recordPass(e,"rope",[c,t,d],[Math.ceil(n/ie),1,1]),r.push(c,d),d}recRopeMrope(e,r,t,n,s,a,i,o,u){let c=u[0],d=u[0]+u[1],f=this.uniform([s,a,i,c,d],{offset:20,value:o}),g=this.storage(s*a*4);return this.recordPass(e,"rope_mrope",[f,t,n,g],[Math.ceil(s/ie),1,1]),r.push(f,g),g}preparePositions(e,r){if(e.positions&&e.mropeSections){let t=this.storage(e.positions.byteLength);this.device.queue.writeBuffer(t,0,e.positions),r.push(t),e._posGpu=t}if(e.ropeFactors){let t=this.storage(e.ropeFactors.byteLength);this.device.queue.writeBuffer(t,0,e.ropeFactors),r.push(t),e._ffGpu=t}}recRope2d(e,r,t,n,s,a,i,o){let u=this.uniform([s,a,i,0],{offset:16,value:o}),c=this.storage(s*a*4);return this.recordPass(e,"rope_2d",[u,t,n,c],[Math.ceil(s/ie),1,1]),r.push(u,c),c}recRopeFactors(e,r,t,n,s,a,i,o,u,c=!1){let d=this.uniform([s,a,i,o],{offset:16,value:u});this.device.queue.writeBuffer(d,20,new Uint32Array([c?1:0]));let f=this.storage(s*a*4);return this.recordPass(e,"rope_factors",[d,t,n,f],[Math.ceil(s/ie),1,1]),r.push(d,f),f}recAttention(e,r,t,n,s,a,i,o,u,c,d,f,g=0,p=0){let h=this.attnUniform(a,i,o,u,c,d,f??1/Math.sqrt(u),g,p),w=this.storage(a*i*u*4);return this.attnDecodeOk&&a*i<256&&u<=128?this.recordPass(e,"attention_decode",[h,t,n,s,w],[a*i,1,1]):this.attnPrefillOk&&u<=128?this.recordPass(e,"attention_prefill",[h,t,n,s,w],[Math.ceil(a/4)*i,1,1]):this.recordPass(e,"attention",[h,t,n,s,w],[Math.ceil(a*i/ie),1,1]),r.push(h,w),w}recQuantizeKv(e,r,t,n,s,a,i,o,u){let c=this.uniform([a,i,o,u]);this.recordPass(e,"quantize_kv",[c,t,n,s],this.grid1D(a*i)),r.push(c)}recAttentionQ8(e,r,t,n,s,a,i,o,u,c,d,f,g,p,h=0,w=0){let P=this.attnUniform(o,u,c,d,f,g,p??1/Math.sqrt(d),h,w),q=this.storage(o*u*d*4);return this.attnDecodeOk&&o*u<256&&d<=128?this.recordPass(e,"attention_decode_q8kv",[P,t,n,s,a,i,q],[o*u,1,1]):this.attnPrefillOk&&d<=128?this.recordPass(e,"attention_prefill_q8kv",[P,t,n,s,a,i,q],[Math.ceil(o/4)*u,1,1]):this.recordPass(e,"attention_q8kv",[P,t,n,s,a,i,q],[Math.ceil(o*u/ie),1,1]),r.push(P,q),q}recAddBias(e,r,t,n,s,a){let i=this.uniform([s,a]),o=this.storage(s*a*4);return this.recordPass(e,"addbias",[i,t,n,o],this.grid1D(s*a)),r.push(i,o),o}recBinary(e,r,t,n,s,a){let i=this.storage(a*4);return this.recordPass(e,t,[n,s,i],this.grid1D(a)),r.push(i),i}recLfm2ShortConv(e,r,t,n,s,a,i){let o=this.uniform([a,i]),u=this.storage(a*4);return this.recordPass(e,"lfm2_shortconv",[o,t,s,n,u],this.grid1D(a)),r.push(o,u),u}recordLayerKV(e,r,t,n,s,a,i){let o=i.k,u=i.v,{seq:c,d,nHeads:f,nKvHeads:g,headDim:p,ffn:h,ropeTheta:w,eps:P}=n,q=g*p,S=a+c,F=s.matF16===!0,M=f*p,z=n.rmsGainOnePlus===!0,U=n.attnLogitSoftcap??0,k=n.act==="gelu"?"geglu":"swiglu",v=this.recRmsnorm(e,r,t,s.attnNorm,c,d,P,z),m=this.recMM(e,r,v,s.wq,c,d,M,F),y=this.recMM(e,r,v,s.wk,c,d,q,F),b=this.recMM(e,r,v,s.wv,c,d,q,F);s.bq&&(m=this.recAddBias(e,r,m,s.bq,c,M)),s.bk&&(y=this.recAddBias(e,r,y,s.bk,c,q)),s.bv&&(b=this.recAddBias(e,r,b,s.bv,c,q)),s.qNorm&&(m=this.recRmsnorm(e,r,m,s.qNorm,c*f,p,P,z)),s.kNorm&&(y=this.recRmsnorm(e,r,y,s.kNorm,c*g,p,P,z));let A=n._posGpu,x=n._ffGpu,G=n.ropeInterleaved===!0,_=(W,O,R)=>n.skipRope?W:A?this.recRopeMrope(e,r,W,A,O,p,R,w,n.mropeSections):x?this.recRopeFactors(e,r,W,x,O,p,R,a,w,G):this.recRope(e,r,W,O,p,R,a,w,G),B=_(m,c*f,f),C=_(y,c*g,g),D;if(i.kScale)this.recQuantizeKv(e,r,C,o,i.kScale,c,g,p,a),this.recQuantizeKv(e,r,b,u,i.vScale,c,g,p,a),D=this.recAttentionQ8(e,r,B,o,i.kScale,u,i.vScale,c,f,g,p,S,a,n.attnScale,U,n.window??0);else{let W=q*4;e.copyBufferToBuffer(C,0,o,a*W,c*W),e.copyBufferToBuffer(b,0,u,a*W,c*W),D=this.recAttention(e,r,B,o,u,c,f,g,p,S,a,n.attnScale,U,n.window??0)}let T=this.recMM(e,r,D,s.wo,c,M,d,F);s.postAttnNorm&&(T=this.recRmsnorm(e,r,T,s.postAttnNorm,c,d,P,z));let L=this.recBinary(e,r,"add",t,T,c*d),N=this.recRmsnorm(e,r,L,s.ffnNorm,c,d,P,z),Q=this.recMM(e,r,N,s.wgate,c,d,h,F),Y=this.recMM(e,r,N,s.wup,c,d,h,F),$=this.recBinary(e,r,k,Q,Y,c*h),J=this.recMM(e,r,$,s.wdown,c,h,d,F);return s.postFfnNorm&&(J=this.recRmsnorm(e,r,J,s.postFfnNorm,c,d,P,z)),this.recBinary(e,r,"add",L,J,c*d)}setKvQuant(e){this.kvQuant!==e&&(this.kvQuant=e,this.resetKvGpu())}resetKvGpu(){for(let e of this.kvGpu.values())e.k.destroy?.(),e.v.destroy?.(),e.kScale?.destroy?.(),e.vScale?.destroy?.();this.kvGpu.clear(),this.kvSession="";for(let e of this.bufferPool.values())for(let r of e)r.destroy?.();this.bufferPool.clear()}clearKvCache(){this.resetKvGpu()}ensureKv(e,r,t,n){let s=this.kvGpu.get(e);if(s&&s.cap>=r)return s;let a=Math.max(r,(s?.cap??0)+1024,1024),i=this.kvQuant,o=this.storage(a*t*(i?1:4)),u=this.storage(a*t*(i?1:4)),c=i?this.storage(a*n*4):void 0,d=i?this.storage(a*n*4):void 0;if(s){let g=this.device.createCommandEncoder();g.copyBufferToBuffer(s.k,0,o,0,s.cap*t*(i?1:4)),g.copyBufferToBuffer(s.v,0,u,0,s.cap*t*(i?1:4)),i&&s.kScale&&(g.copyBufferToBuffer(s.kScale,0,c,0,s.cap*n*4),g.copyBufferToBuffer(s.vScale,0,d,0,s.cap*n*4)),this.device.queue.submit([g.finish()]),s.k.destroy?.(),s.v.destroy?.(),s.kScale?.destroy?.(),s.vScale?.destroy?.()}let f={k:o,v:u,cap:a,kScale:c,vScale:d};return this.kvGpu.set(e,f),f}async runDecodeGpu(e,r,t,n,s,a){let{seq:i,d:o,nKvHeads:u,headDim:c,eps:d}=r,f=u*c,g=n+i;(a!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${a}" inconnue avec pastLen=${n} : cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=a);for(let F=0;F<t.length;F++)this.ensureKv(F,g,f,u);let p=[];this.preparePositions(r,p);let h=this.device.createCommandEncoder(),w=this.storage(e.byteLength);this.device.queue.writeBuffer(w,0,e),p.push(w);for(let F=0;F<t.length;F++){let M=this.kvGpu.get(F);w=this.recordLayerKV(h,p,w,yt(r,i,F,this.swaOk),t[F],n,M)}let P=this.recRmsnorm(h,p,w,s,i,o,d,r.rmsGainOnePlus===!0),q=this.storage(o*4);h.copyBufferToBuffer(P,(i-1)*o*4,q,0,o*4),this.device.queue.submit([h.finish()]);let S=await this.readBack(q,o*4);return p.push(q),this.release(p),S}async decodeLogitsQ8(e,r,t,n,s,a,i,o){let u=globalThis,{seq:c,d,nKvHeads:f,headDim:g,eps:p}=r,h=f*g,w=n+c;(a!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${a}" inconnue avec pastLen=${n} : cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=a);for(let v=0;v<t.length;v++)this.ensureKv(v,w,h,f);let P=[];this.preparePositions(r,P);let q=this.device.createCommandEncoder(),S=this.storage(e.byteLength);this.device.queue.writeBuffer(S,0,e),P.push(S);for(let v=0;v<t.length;v++){let m=this.kvGpu.get(v);S=this.recordLayerKV(q,P,S,yt(r,c,v,this.swaOk),t[v],n,m)}let F=this.recRmsnorm(q,P,S,s,c,d,p,r.rmsGainOnePlus===!0),M=this.storage(d*4);q.copyBufferToBuffer(F,(c-1)*d*4,M,0,d*4),P.push(M);let z=this.storage(o*4);P.push(z);for(let v of i){let m=this.recMM(q,P,M,v.w,1,d,v.rows,!1);q.copyBufferToBuffer(m,0,z,v.r0*4,v.rows*4)}let U=this.device.createBuffer({size:o*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});q.copyBufferToBuffer(z,0,U,0,o*4),this.device.queue.submit([q.finish()]),await U.mapAsync(u.GPUMapMode.READ);let k=new Float32Array(U.getMappedRange().slice(0));return U.unmap(),U.destroy(),this.release(P),k}async decodeTopKQ8(e,r,t,n,s,a,i,o,u,c,d,f=64){let g=globalThis,{seq:p,d:h,nKvHeads:w,headDim:P,eps:q}=r,S=w*P,F=n+p;(a!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${a}" inconnue avec pastLen=${n} : cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=a);for(let _=0;_<t.length;_++)this.ensureKv(_,F,S,w);let M=ee.timingOn?(_,B)=>console.info(`[timing:gpu] ${_} ${(performance.now()-B).toFixed(0)} ms`):null,z=performance.now(),U=[];this.preparePositions(r,U);let k=this.device.createCommandEncoder(),v=this.storage(e.byteLength);this.device.queue.writeBuffer(v,0,e),U.push(v);for(let _=0;_<t.length;_++){let B=this.kvGpu.get(_);v=this.recordLayerKV(k,U,v,yt(r,p,_,this.swaOk),t[_],n,B)}let m=this.recRmsnorm(k,U,v,s,p,h,q,r.rmsGainOnePlus===!0),y=this.storage(h*4);k.copyBufferToBuffer(m,(p-1)*h*4,y,0,h*4),U.push(y);let b=this.storage(o*4);U.push(b);for(let _ of i){let B=this.recMM(k,U,y,_.w,1,h,_.rows,!1);k.copyBufferToBuffer(B,0,b,_.r0*4,_.rows*4)}if(d&&d>0){let _=this.uniform([o],{offset:4,value:d});this.recordPass(k,"softcap_logits",[_,b],this.grid1D(o)),U.push(_)}if(c&&c!==1&&u.length){let _=Uint32Array.from(u),B=this.bufU32(_,g.GPUBufferUsage.STORAGE|g.GPUBufferUsage.COPY_DST),C=this.uniform([_.length],{offset:4,value:c});this.recordPass(k,"penalize_logits",[C,B,b],this.grid1D(_.length)),U.push(C,B)}let A=this.storage(f*2*4);U.push(A);{let _=this.uniform([o,f]);this.recordPass(k,this.topKParOk?"top_k_par":"top_k",[_,b,A],[1,1,1]),U.push(_)}let x=this.device.createBuffer({size:f*2*4,usage:g.GPUBufferUsage.COPY_DST|g.GPUBufferUsage.MAP_READ});k.copyBufferToBuffer(A,0,x,0,f*2*4),M?.("enregistrement des passes (compilation des pipelines incluse)",z),z=performance.now(),this.device.queue.submit([k.finish()]),await x.mapAsync(g.GPUMapMode.READ),M?.("execution GPU (submit + readback)",z);let G=new Uint32Array(x.getMappedRange().slice(0));return x.unmap(),x.destroy(),this.release(U),{ids:G.slice(0,f),vals:new Float32Array(G.buffer,f*4,f)}}resetLfm2State(){for(let e of this.lfm2KvGpu.values())e.k.destroy?.(),e.v.destroy?.();for(let e of this.lfm2ConvGpu.values())e.destroy?.();this.lfm2KvGpu.clear(),this.lfm2ConvGpu.clear(),this.lfm2Session="";for(let e of this.bufferPool.values())for(let r of e)r.destroy?.();this.bufferPool.clear()}clearLfm2State(){this.resetLfm2State()}ensureLfm2Kv(e,r,t){let n=this.lfm2KvGpu.get(e);if(n&&n.cap>=r)return n;let s=Math.max(r,(n?.cap??0)+1024,1024),a=this.storage(s*t*4),i=this.storage(s*t*4);if(n){let u=this.device.createCommandEncoder();u.copyBufferToBuffer(n.k,0,a,0,n.cap*t*4),u.copyBufferToBuffer(n.v,0,i,0,n.cap*t*4),this.device.queue.submit([u.finish()]),n.k.destroy?.(),n.v.destroy?.()}let o={k:a,v:i,cap:s};return this.lfm2KvGpu.set(e,o),o}ensureLfm2Conv(e,r){let t=this.lfm2ConvGpu.get(e);return t||(t=this.storage(r*4),this.device.queue.writeBuffer(t,0,new Float32Array(r)),this.lfm2ConvGpu.set(e,t)),t}recLfm2ShortConvBatch(e,r,t,n,s,a,i,o){let u=this.uniform([a,i,o]),c=this.storage(o*a*4);this.recordPass(e,"lfm2_shortconv_batch",[u,t,s,n,c],this.grid1D(o*a));let d=this.uniform([a,i,o]);return this.recordPass(e,"lfm2_shortconv_state",[d,t,n],this.grid1D((i-1)*a)),r.push(u,d,c),c}recordLfm2(e,r,t,n,s,a,i,o){let{D:u,nHeads:c,nKvHeads:d,headDim:f,ffn:g,eps:p,theta:h,lc:w}=s,P=d*f,q=c*f,S=P*4;for(let M=0;M<a.length;M++)a[M].conv?this.ensureLfm2Conv(M,(w-1)*u):this.ensureLfm2Kv(M,o+n,P);if(n>=w-1&&this.lfm2BatchOk){let M=this.storage(n*u*4);this.device.queue.writeBuffer(M,0,t),r.push(M);for(let U=0;U<a.length;U++){let k=a[U],v=this.recRmsnorm(e,r,M,k.attnNorm,n,u,p),m;if(k.conv){let _=this.recMM(e,r,v,k.inProj,n,u,3*u,!1),B=this.recLfm2ShortConvBatch(e,r,_,this.lfm2ConvGpu.get(U),k.convW,u,w,n);m=this.recMM(e,r,B,k.outProj,n,u,u,!1)}else{let _=this.recMM(e,r,v,k.wq,n,u,q,!1),B=this.recMM(e,r,v,k.wk,n,u,P,!1),C=this.recMM(e,r,v,k.wv,n,u,P,!1);_=this.recRmsnorm(e,r,_,k.qNorm,n*c,f,p),B=this.recRmsnorm(e,r,B,k.kNorm,n*d,f,p),_=this.recRope(e,r,_,n*c,f,c,o,h),B=this.recRope(e,r,B,n*d,f,d,o,h);let D=this.lfm2KvGpu.get(U);e.copyBufferToBuffer(B,0,D.k,o*S,n*S),e.copyBufferToBuffer(C,0,D.v,o*S,n*S);let T=this.recAttention(e,r,_,D.k,D.v,n,c,d,f,o+n,o);m=this.recMM(e,r,T,k.wo,n,q,u,!1)}M=this.recBinary(e,r,"add",M,m,n*u);let y=this.recRmsnorm(e,r,M,k.ffnNorm,n,u,p),b=this.recMM(e,r,y,k.wgate,n,u,g,!1),A=this.recMM(e,r,y,k.wup,n,u,g,!1),x=this.recBinary(e,r,"swiglu",b,A,n*g),G=this.recMM(e,r,x,k.wdown,n,g,u,!1);M=this.recBinary(e,r,"add",M,G,n*u)}let z=this.storage(u*4);return r.push(z),e.copyBufferToBuffer(M,(n-1)*u*4,z,0,u*4),this.recRmsnorm(e,r,z,i,1,u,p)}let F=null;for(let M=0;M<n;M++){let z=o+M,U=this.storage(u*4);this.device.queue.writeBuffer(U,0,t.subarray(M*u,(M+1)*u)),r.push(U);for(let k=0;k<a.length;k++){let v=a[k],m=this.recRmsnorm(e,r,U,v.attnNorm,1,u,p),y;if(v.conv){let B=this.recMM(e,r,m,v.inProj,1,u,3*u,!1),C=this.recLfm2ShortConv(e,r,B,this.lfm2ConvGpu.get(k),v.convW,u,w);y=this.recMM(e,r,C,v.outProj,1,u,u,!1)}else{let B=this.recMM(e,r,m,v.wq,1,u,q,!1),C=this.recMM(e,r,m,v.wk,1,u,P,!1),D=this.recMM(e,r,m,v.wv,1,u,P,!1);B=this.recRmsnorm(e,r,B,v.qNorm,c,f,p),C=this.recRmsnorm(e,r,C,v.kNorm,d,f,p),B=this.recRope(e,r,B,c,f,c,z,h),C=this.recRope(e,r,C,d,f,d,z,h);let T=this.lfm2KvGpu.get(k);e.copyBufferToBuffer(C,0,T.k,z*S,S),e.copyBufferToBuffer(D,0,T.v,z*S,S);let L=this.recAttention(e,r,B,T.k,T.v,1,c,d,f,z+1,z);y=this.recMM(e,r,L,v.wo,1,q,u,!1)}U=this.recBinary(e,r,"add",U,y,u);let b=this.recRmsnorm(e,r,U,v.ffnNorm,1,u,p),A=this.recMM(e,r,b,v.wgate,1,u,g,!1),x=this.recMM(e,r,b,v.wup,1,u,g,!1),G=this.recBinary(e,r,"swiglu",A,x,g),_=this.recMM(e,r,G,v.wdown,1,g,u,!1);U=this.recBinary(e,r,"add",U,_,u)}M===n-1&&(F=this.recRmsnorm(e,r,U,i,1,u,p))}return F}lfm2SessionReset(e,r){(e!==this.lfm2Session||r===0)&&(r>0&&console.error(`[lfm2] session "${e}" inconnue avec pastLen=${r} : \xE9tat perdu, sortie invalide. Repartir de pastLen 0.`),this.resetLfm2State(),this.lfm2Session=e)}async lfm2PrefillGpu(e,r,t,n,s,a,i){this.lfm2SessionReset(i,a);let o=[],u=this.device.createCommandEncoder();this.recordLfm2(u,o,e,r,t,n,s,a),this.device.queue.submit([u.finish()]),await this.device.queue.onSubmittedWorkDone(),this.release(o)}async lfm2LogitsGpu(e,r,t,n,s,a,i,o){let u=globalThis;this.lfm2SessionReset(o,i);let c=[],d=this.device.createCommandEncoder(),f=this.recordLfm2(d,c,e,r,t,n,a,i),g=this.recMM(d,c,f,s,1,t.D,t.vocab,!1),p=this.device.createBuffer({size:t.vocab*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});d.copyBufferToBuffer(g,0,p,0,t.vocab*4),this.device.queue.submit([d.finish()]),await p.mapAsync(u.GPUMapMode.READ);let h=new Float32Array(p.getMappedRange().slice(0));return p.unmap(),p.destroy(),this.release(c),h}async lfm2TopKGpu(e,r,t,n,s,a,i,o,u,c,d=64){let f=globalThis;this.lfm2SessionReset(o,i);let g=[],p=this.device.createCommandEncoder(),h=this.recordLfm2(p,g,e,r,t,n,a,i),w=this.recMM(p,g,h,s,1,t.D,t.vocab,!1);if(c&&c!==1&&u.length){let F=Uint32Array.from(u),M=this.bufU32(F,f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST),z=this.uniform([F.length],{offset:4,value:c});this.recordPass(p,"penalize_logits",[z,M,w],this.grid1D(F.length)),g.push(z,M)}let P=this.storage(d*2*4);g.push(P);{let F=this.uniform([t.vocab,d]);this.recordPass(p,this.topKParOk?"top_k_par":"top_k",[F,w,P],[1,1,1]),g.push(F)}let q=this.device.createBuffer({size:d*2*4,usage:f.GPUBufferUsage.COPY_DST|f.GPUBufferUsage.MAP_READ});p.copyBufferToBuffer(P,0,q,0,d*2*4),this.device.queue.submit([p.finish()]),await q.mapAsync(f.GPUMapMode.READ);let S=new Uint32Array(q.getMappedRange().slice(0));return q.unmap(),q.destroy(),this.release(g),{ids:S.slice(0,d),vals:new Float32Array(S.buffer,d*4,d)}}resetRwkvState(){for(let e of this.rwkvStateGpu.values())e.S.destroy?.(),e.tm.destroy?.(),e.cm.destroy?.();this.rwkvStateGpu.clear(),this.rwkvVFirst?.destroy?.(),this.rwkvVFirst=null,this.rwkvSession="";for(let e of this.bufferPool.values())for(let r of e)r.destroy?.();this.bufferPool.clear()}clearRwkvState(){this.resetRwkvState()}ensureRwkvState(e,r,t,n){let s=this.rwkvStateGpu.get(e);if(!s){let a=this.storage(t*n*n*4),i=this.storage(r*4),o=this.storage(r*4);this.device.queue.writeBuffer(a,0,new Float32Array(t*n*n)),this.device.queue.writeBuffer(i,0,new Float32Array(r)),this.device.queue.writeBuffer(o,0,new Float32Array(r)),s={S:a,tm:i,cm:o},this.rwkvStateGpu.set(e,s)}return s}rwkvSessionReset(e,r){(e!==this.rwkvSession||r===0)&&(r>0&&console.error(`[rwkv] session "${e}" inconnue avec pastLen=${r} : \xE9tat perdu, sortie invalide. Repartir de pastLen 0.`),this.resetRwkvState(),this.rwkvSession=e)}recRwkvToken(e,r,t,n,s,a){let{D:i,H:o,NH:u}=n,c=1e-5,d=64e-5;for(let f=0;f<s.length;f++){let g=s[f],p=this.rwkvStateGpu.get(f),h=this.recLayernorm(e,r,t,g.attnNormW,g.attnNormB,1,i,c),w=this.storage(6*i*4);{let R=this.uniform([i]);this.recordPass(e,"rwkv_token_shift",[R,h,p.tm,g.lerpFused,w],this.grid1D(6*i)),r.push(R,w)}e.copyBufferToBuffer(h,0,p.tm,0,i*4);let P=R=>{let j=this.storage(i*4);return e.copyBufferToBuffer(w,R*i*4,j,0,i*4),r.push(j),j},q=P(0),S=P(1),F=P(2),M=P(3),z=P(4),U=P(5),k=this.recMM(e,r,q,g.R,1,i,i,!1),v=this.recMM(e,r,F,g.K,1,i,i,!1),m=this.recMM(e,r,M,g.V,1,i,i,!1),y=this.recUnary(e,r,"tanh_act",this.recMM(e,r,S,g.w1,1,i,g.rw,!1),g.rw),b=this.recMM(e,r,y,g.w2,1,g.rw,i,!1),A=this.storage(i*4);this.recordPass(e,"rwkv_decay",[g.w0,b,A],this.grid1D(i)),r.push(A);let x=this.recMM(e,r,this.recMM(e,r,z,g.a1,1,i,g.ra,!1),g.a2,1,g.ra,i,!1),G=this.storage(i*4);this.recordPass(e,"rwkv_bias_sigmoid",[g.a0,x,G],this.grid1D(i)),r.push(G);let _=this.recUnary(e,r,"sigmoid",this.recMM(e,r,U,g.g1,1,i,g.rg,!1),g.rg),B=this.recMM(e,r,_,g.g2,1,g.rg,i,!1);if(f===0)e.copyBufferToBuffer(m,0,a,0,i*4);else{let R=this.recMM(e,r,this.recMM(e,r,M,g.v1,1,i,g.rv,!1),g.v2,1,g.rv,i,!1);this.recordPass(e,"rwkv_vresid",[m,a,g.v0,R],this.grid1D(i))}let C=this.storage(i*4),D=this.storage(i*4),T=this.storage(i*4);{let R=this.uniform([u,o]);this.recordPass(e,"rwkv_kprep",[R,v,G,g.kk,g.ka,C,D,T],this.grid1D(u)),r.push(R,C,D,T)}let L=this.storage(i*4);{let R=this.uniform([u,o]);this.recordPass(e,"rwkv_wkv7",[R,k,A,C,m,D,T,p.S,L],this.grid1D(u*o)),r.push(R,L)}let N=this.storage(i*4);{let R=this.uniform([u,o],{offset:8,value:d});this.recordPass(e,"rwkv_out_gn",[R,L,k,C,g.rk,m,g.lnWB,N],this.grid1D(u)),r.push(R,N)}let Q=this.recBinary(e,r,"mul",N,B,i),Y=this.recMM(e,r,Q,g.O,1,i,i,!1);t=this.recBinary(e,r,"add",t,Y,i);let $=this.recLayernorm(e,r,t,g.attnNorm2W,g.attnNorm2B,1,i,c),J=this.storage(i*4);this.recordPass(e,"rwkv_lerp",[$,p.cm,g.lerpK,J],this.grid1D(i)),r.push(J),e.copyBufferToBuffer($,0,p.cm,0,i*4);let W=this.recUnary(e,r,"sqrelu",this.recMM(e,r,J,g.cmK,1,i,g.ffn,!1),g.ffn),O=this.recMM(e,r,W,g.cmV,1,g.ffn,i,!1);t=this.recBinary(e,r,"add",t,O,i)}return t}recordRwkv(e,r,t,n,s,a,i){let{D:o,H:u,NH:c}=s;for(let f=0;f<a.length;f++)this.ensureRwkvState(f,o,c,u);this.rwkvVFirst||(this.rwkvVFirst=this.storage(o*4));let d=null;for(let f=0;f<n;f++){let g=this.storage(o*4);this.device.queue.writeBuffer(g,0,t.subarray(f*o,(f+1)*o)),r.push(g);let p=this.recLayernorm(e,r,g,i.tokW,i.tokB,1,o,1e-5),h=this.recRwkvToken(e,r,p,s,a,this.rwkvVFirst);f===n-1&&(d=this.recLayernorm(e,r,h,i.outW,i.outB,1,o,1e-5))}return d}async rwkvPrefillGpu(e,r,t,n,s,a,i){this.rwkvSessionReset(i,a);let o=[],u=this.device.createCommandEncoder();this.recordRwkv(u,o,e,r,t,n,s),this.device.queue.submit([u.finish()]),await this.device.queue.onSubmittedWorkDone(),this.release(o)}async rwkvLogitsGpu(e,r,t,n,s,a,i,o){let u=globalThis;this.rwkvSessionReset(o,i);let c=[],d=this.device.createCommandEncoder(),f=this.recordRwkv(d,c,e,r,t,n,a),g=this.recMM(d,c,f,s,1,t.D,t.vocab,!1),p=this.device.createBuffer({size:t.vocab*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});d.copyBufferToBuffer(g,0,p,0,t.vocab*4),this.device.queue.submit([d.finish()]),await p.mapAsync(u.GPUMapMode.READ);let h=new Float32Array(p.getMappedRange().slice(0));return p.unmap(),p.destroy(),this.release(c),h}async rwkvTopKGpu(e,r,t,n,s,a,i,o,u,c,d=64){let f=globalThis;this.rwkvSessionReset(o,i);let g=[],p=this.device.createCommandEncoder(),h=this.recordRwkv(p,g,e,r,t,n,a),w=this.recMM(p,g,h,s,1,t.D,t.vocab,!1);if(c&&c!==1&&u.length){let F=Uint32Array.from(u),M=this.bufU32(F,f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST),z=this.uniform([F.length],{offset:4,value:c});this.recordPass(p,"penalize_logits",[z,M,w],this.grid1D(F.length)),g.push(z,M)}let P=this.storage(d*2*4);g.push(P);{let F=this.uniform([t.vocab,d]);this.recordPass(p,this.topKParOk?"top_k_par":"top_k",[F,w,P],[1,1,1]),g.push(F)}let q=this.device.createBuffer({size:d*2*4,usage:f.GPUBufferUsage.COPY_DST|f.GPUBufferUsage.MAP_READ});p.copyBufferToBuffer(P,0,q,0,d*2*4),this.device.queue.submit([p.finish()]),await q.mapAsync(f.GPUMapMode.READ);let S=new Uint32Array(q.getMappedRange().slice(0));return q.unmap(),q.destroy(),this.release(g),{ids:S.slice(0,d),vals:new Float32Array(S.buffer,d*4,d)}}async argmaxProjection(e,r,t,n,s=!1){let a=globalThis,i=[],o=this.device.createCommandEncoder(),u=this.storage(e.byteLength);this.device.queue.writeBuffer(u,0,e),i.push(u);let c=this.storage(n*4);i.push(c);for(let h of r){let w=this.recMatmulT(o,i,u,h.buf,1,t,h.rows,s);o.copyBufferToBuffer(w,0,c,h.r0*4,h.rows*4)}let d=this.storage(4),f=this.uniform([n]);i.push(d,f),this.recordPass(o,"argmax",[f,c,d],[1,1,1]);let g=this.device.createBuffer({size:4,usage:a.GPUBufferUsage.COPY_DST|a.GPUBufferUsage.MAP_READ});o.copyBufferToBuffer(d,0,g,0,4),this.device.queue.submit([o.finish()]),await g.mapAsync(a.GPUMapMode.READ);let p=new Uint32Array(g.getMappedRange().slice(0))[0];return g.unmap(),g.destroy(),this.release(i),p}async projectLogits(e,r,t,n,s=!1){let a=globalThis,i=[],o=this.device.createCommandEncoder(),u=this.storage(e.byteLength);this.device.queue.writeBuffer(u,0,e),i.push(u);let c=this.storage(n*4);i.push(c);for(let g of r){let p=this.recMatmulT(o,i,u,g.buf,1,t,g.rows,s);o.copyBufferToBuffer(p,0,c,g.r0*4,g.rows*4)}let d=this.device.createBuffer({size:n*4,usage:a.GPUBufferUsage.COPY_DST|a.GPUBufferUsage.MAP_READ});o.copyBufferToBuffer(c,0,d,0,n*4),this.device.queue.submit([o.finish()]),await d.mapAsync(a.GPUMapMode.READ);let f=new Float32Array(d.getMappedRange().slice(0));return d.unmap(),d.destroy(),this.release(i),f}async selfValidate(){this.validationFailure=null;let e=U=>(this.validationFailure=U,console.error("[selfValidate] FAILED at:",U,"(hasF16="+this.hasF16+")"),!1),r=(U,k)=>U.length===k.length&&U.every((v,m)=>Math.abs(v-k[m])<.001),t=U=>Float32Array.from({length:U},()=>Math.random()*2-1),n=3,s=4,a=5,i=t(n*s),o=t(s*a),u=new Float32Array(n*a);for(let U=0;U<n;U++)for(let k=0;k<a;k++){let v=0;for(let m=0;m<s;m++)v+=i[U*s+m]*o[m*a+k];u[U*a+k]=v}if(!r(await this.matmul(i,o,n,s,a),u))return e("matmul");{let U=(v,m,y,b,A)=>{let x=new Float32Array(y*A);for(let G=0;G<y;G++)for(let _=0;_<A;_++){let B=0;for(let C=0;C<b;C++)B+=v[G*b+C]*m[_*b+C];x[G*A+_]=B}return x},k=async(v,m,y)=>{let b=t(v*m),A=t(y*m);return r(await this.matmulT(b,A,v,m,y),U(b,A,v,m,y))};if(!await k(3,8,5))return e("matmulT.vec4(3,8,5)");if(!await k(1,16,7))return e("matmulT.vec4(1,16,7)");if(!await k(2,6,4))return e("matmulT.scalar(2,6,4)");if(this.hasF16){let b=t(16),A=t(112),x=this.uploadGpuF16(A),G=await this.matmulT(b,x,1,16,7,!0),_=new Float32Array(7);for(let L=0;L<7;L++){let N=0;for(let Q=0;Q<16;Q++)N+=b[Q]*A[L*16+Q];_[L]=N}x.destroy?.();let B=L=>L.length===_.length&&L.every((N,Q)=>Math.abs(N-_[Q])<=.03*(1+Math.abs(_[Q])));if(!B(G))return e("matmulT.f16");let C=this.uploadGpu(A),D=this.f32ToF16Gpu(C,112),T=await this.matmulT(b,D,1,16,7,!0);if(C.destroy?.(),D.destroy?.(),!B(T))return e("packf16")}if(this.hasF16&&this.f16SharedOk){let v=[{m:20,k:128,n:18},{m:32,k:64,n:64},{m:70,k:40,n:130},{m:33,k:48,n:7}];for(let m of v){let y=t(m.m*m.k),b=t(m.n*m.k),A=this.uploadGpuF16(b),x=await this.matmulT(y,A,m.m,m.k,m.n,!0);this.f16SharedOk=!1;let G=await this.matmulT(y,A,m.m,m.k,m.n,!0);if(this.f16SharedOk=!0,A.destroy?.(),!(x.length===G.length&&x.every((B,C)=>Math.abs(B-G[C])<=.001*(1+Math.abs(G[C]))))){this.f16SharedOk=!1,console.warn(`[selfValidate] matmul_t_f16w_shared KO sur ce GPU (m=${m.m}, k=${m.k}, n=${m.n}) : repli sur matmul_t_f16w (plus lent, m\xEAme r\xE9sultat).`);break}}}}{let m=t(128),y=t(768),b=ke(y),A=this.uploadGpuRaw(b.nibbles),x=this.uploadGpuRaw(new Uint8Array(b.scales.buffer,b.scales.byteOffset,b.scales.byteLength)),G=this.uploadGpuRaw(new Uint8Array(b.mins.buffer,b.mins.byteOffset,b.mins.byteLength)),_=await this.matmulQ4(m,A,x,G,1,128,6),B=pe(b),C=new Float32Array(6);for(let Q=0;Q<6;Q++){let Y=0;for(let $=0;$<128;$++)Y+=m[$]*B[Q*128+$];C[Q]=Y}if(A.destroy?.(),x.destroy?.(),G.destroy?.(),!r(_,C))return e("matmulQ4");let D=this.uploadGpu(y),T=this.f32ToQ4Gpu(D,768),L=await this.matmulQ4(m,T.nib,T.sc,T.mn,1,128,6);if(D.destroy?.(),T.nib.destroy?.(),T.sc.destroy?.(),T.mn.destroy?.(),!(L.length===C.length&&L.every((Q,Y)=>Math.abs(Q-C[Y])<=.06*(1+Math.abs(C[Y]))+.02)))return e("quantize_q4")}{let m=t(640),y=t(768),b=cr(y),A=this.uploadGpuRaw(new Uint8Array(b.lo.buffer,b.lo.byteOffset,b.lo.byteLength)),x=this.uploadGpuRaw(new Uint8Array(b.hi.buffer,b.hi.byteOffset,b.hi.byteLength)),G=this.uploadGpuRaw(new Uint8Array(b.scales.buffer,b.scales.byteOffset,b.scales.byteLength)),_=this.uploadGpuRaw(new Uint8Array(b.mins.buffer,b.mins.byteOffset,b.mins.byteLength)),B=await this.matmulQ3(m,A,x,G,_,5,128,6),C=Le(b),D=new Float32Array(30);for(let T=0;T<5;T++)for(let L=0;L<6;L++){let N=0;for(let Q=0;Q<128;Q++)N+=m[T*128+Q]*C[L*128+Q];D[T*6+L]=N}if(A.destroy?.(),x.destroy?.(),G.destroy?.(),_.destroy?.(),!r(B,D))return e("matmulQ3")}{let m=t(640),y=t(768),b=ke(y),A=this.uploadGpuRaw(b.nibbles),x=this.uploadGpuRaw(new Uint8Array(b.scales.buffer,b.scales.byteOffset,b.scales.byteLength)),G=this.uploadGpuRaw(new Uint8Array(b.mins.buffer,b.mins.byteOffset,b.mins.byteLength)),_=await this.matmulQ4Tiled(m,A,x,G,5,128,6),B=pe(b),C=new Float32Array(30);for(let D=0;D<5;D++)for(let T=0;T<6;T++){let L=0;for(let N=0;N<128;N++)L+=m[D*128+N]*B[T*128+N];C[D*6+T]=L}if(A.destroy?.(),x.destroy?.(),G.destroy?.(),!r(_,C))return e("matmul_q4_tiled")}for(let U of[{m:20,n:18},{m:32,n:64},{m:70,n:130}]){let k=U.m,v=128,m=U.n,y=t(k*v),b=t(m*v),A=ke(b),x=this.uploadGpuRaw(A.nibbles),G=this.uploadGpuRaw(new Uint8Array(A.scales.buffer,A.scales.byteOffset,A.scales.byteLength)),_=this.uploadGpuRaw(new Uint8Array(A.mins.buffer,A.mins.byteOffset,A.mins.byteLength)),B=await this.matmulQ4Shared(y,x,G,_,k,v,m),C=pe(A),D=new Float32Array(k*m);for(let T=0;T<k;T++)for(let L=0;L<m;L++){let N=0;for(let Q=0;Q<v;Q++)N+=y[T*v+Q]*C[L*v+Q];D[T*m+L]=N}if(x.destroy?.(),G.destroy?.(),_.destroy?.(),!r(B,D))return e(`matmul_q4_shared(${k},${m})`)}{let m=t(128),y=t(768),b=Pe(y),A=this.uploadGpuRaw(new Uint8Array(b.codes.buffer,b.codes.byteOffset,b.codes.byteLength)),x=this.uploadGpuRaw(new Uint8Array(b.scales.buffer,b.scales.byteOffset,b.scales.byteLength)),G=await this.matmulQ8(m,A,x,1,128,6),_=me(b),B=new Float32Array(6);for(let L=0;L<6;L++){let N=0;for(let Q=0;Q<128;Q++)N+=m[Q]*_[L*128+Q];B[L]=N}if(A.destroy?.(),x.destroy?.(),!r(G,B))return e("matmulQ8");let C=this.uploadGpu(y),D=this.f32ToQ8Gpu(C,768),T=await this.matmulQ8(m,D.codes,D.sc,1,128,6);if(C.destroy?.(),D.codes.destroy?.(),D.sc.destroy?.(),!r(T,B))return e("quantize_q8")}{let m=t(640),y=t(768),b=Pe(y),A=this.uploadGpuRaw(new Uint8Array(b.codes.buffer,b.codes.byteOffset,b.codes.byteLength)),x=this.uploadGpuRaw(new Uint8Array(b.scales.buffer,b.scales.byteOffset,b.scales.byteLength)),G=await this.matmulQ8Tiled(m,A,x,5,128,6),_=me(b),B=new Float32Array(30);for(let C=0;C<5;C++)for(let D=0;D<6;D++){let T=0;for(let L=0;L<128;L++)T+=m[C*128+L]*_[D*128+L];B[C*6+D]=T}if(A.destroy?.(),x.destroy?.(),!r(G,B))return e("matmul_q8_tiled")}for(let U of[{k:128,n:6},{k:128,n:130},{k:4096,n:17}]){let k=U.k,v=U.n,m=t(k),y=t(v*k),b=ke(y),A=this.uploadGpuRaw(b.nibbles),x=this.uploadGpuRaw(new Uint8Array(b.scales.buffer,b.scales.byteOffset,b.scales.byteLength)),G=this.uploadGpuRaw(new Uint8Array(b.mins.buffer,b.mins.byteOffset,b.mins.byteLength)),_=await this.matmulQ4Vec(m,A,x,G,k,v),B=pe(b),C=new Float32Array(v);for(let $=0;$<v;$++){let J=0;for(let W=0;W<k;W++)J+=m[W]*B[$*k+W];C[$]=J}if(A.destroy?.(),x.destroy?.(),G.destroy?.(),!r(_,C))return e(`matmul_q4_vec(${k},${v})`);let D=Pe(y),T=this.uploadGpuRaw(new Uint8Array(D.codes.buffer,D.codes.byteOffset,D.codes.byteLength)),L=this.uploadGpuRaw(new Uint8Array(D.scales.buffer,D.scales.byteOffset,D.scales.byteLength)),N=await this.matmulQ8Vec(m,T,L,k,v),Q=me(D),Y=new Float32Array(v);for(let $=0;$<v;$++){let J=0;for(let W=0;W<k;W++)J+=m[W]*Q[$*k+W];Y[$]=J}if(T.destroy?.(),L.destroy?.(),!r(N,Y))return e(`matmul_q8_vec(${k},${v})`)}for(let U of[{m:20,n:18},{m:32,n:64},{m:70,n:130}]){let k=U.m,v=128,m=U.n,y=t(k*v),b=t(m*v),A=Pe(b),x=this.uploadGpuRaw(new Uint8Array(A.codes.buffer,A.codes.byteOffset,A.codes.byteLength)),G=this.uploadGpuRaw(new Uint8Array(A.scales.buffer,A.scales.byteOffset,A.scales.byteLength)),_=await this.matmulQ8Shared(y,x,G,k,v,m),B=me(A),C=new Float32Array(k*m);for(let D=0;D<k;D++)for(let T=0;T<m;T++){let L=0;for(let N=0;N<v;N++)L+=y[D*v+N]*B[T*v+N];C[D*m+T]=L}if(x.destroy?.(),G.destroy?.(),!r(_,C))return e(`matmul_q8_shared(${k},${m})`)}if(this.qShared2Ok){let U=[{m:64,k:128,n:128},{m:65,k:128,n:130},{m:100,k:160,n:18},{m:70,k:96,n:200}];for(let k of U){let v=k.m,m=k.k,y=k.n,b=t(v*m),A=t(y*m),x=new Float32Array(v*y),G=Pe(A),_=me(G);for(let W=0;W<v;W++)for(let O=0;O<y;O++){let R=0;for(let j=0;j<m;j++)R+=b[W*m+j]*_[O*m+j];x[W*y+O]=R}let B=this.uploadGpuRaw(new Uint8Array(G.codes.buffer,G.codes.byteOffset,G.codes.byteLength)),C=this.uploadGpuRaw(new Uint8Array(G.scales.buffer,G.scales.byteOffset,G.scales.byteLength)),D=await this.matmulQ8Shared2(b,B,C,v,m,y);B.destroy?.(),C.destroy?.();let T=ke(A),L=pe(T),N=new Float32Array(v*y);for(let W=0;W<v;W++)for(let O=0;O<y;O++){let R=0;for(let j=0;j<m;j++)R+=b[W*m+j]*L[O*m+j];N[W*y+O]=R}let Q=this.uploadGpuRaw(T.nibbles),Y=this.uploadGpuRaw(new Uint8Array(T.scales.buffer,T.scales.byteOffset,T.scales.byteLength)),$=this.uploadGpuRaw(new Uint8Array(T.mins.buffer,T.mins.byteOffset,T.mins.byteLength)),J=await this.matmulQ4Shared2(b,Q,Y,$,v,m,y);if(Q.destroy?.(),Y.destroy?.(),$.destroy?.(),!r(D,x)||!r(J,N)){this.qShared2Ok=!1,console.warn(`[selfValidate] matmul_t_q8/q4_shared2 KO sur ce GPU (m=${v}, k=${m}, n=${y}) : repli sur les tuiles 32\xD764 v1 (plus lentes, m\xEAme r\xE9sultat).`);break}}}{let k=t(1632),v=new Uint8Array(k.buffer,k.byteOffset,k.byteLength),m=(y,b)=>y.length===b.length&&y.every((A,x)=>A===b[x]);if(!m(await this.quantizeToBytes("F32",v,1632,"q8"),await this.quantizeToBytes("F32",v,1632,"q8",256)))return e("quantize_chunk_q8");if(!m(await this.quantizeToBytes("F32",v,1632,"q4"),await this.quantizeToBytes("F32",v,1632,"q4",256)))return e("quantize_chunk_q4")}let c=2,d=8,f=t(c*d),g=t(d),p=new Float32Array(c*d);for(let U=0;U<c;U++){let k=0;for(let m=0;m<d;m++)k+=f[U*d+m]**2;let v=1/Math.sqrt(k/d+1e-5);for(let m=0;m<d;m++)p[U*d+m]=f[U*d+m]*v*g[m]}if(!r(await this.rmsnorm(f,g,c,d),p))return e("rmsnorm");if(!r(await this.rmsnorm(f,g,c,d,1e-5,!0),Fe(f,g,c,d,1e-5,!0)))return e("rmsnorm.onePlus");let h=t(16),w=t(16),P=h.map((U,k)=>U/(1+Math.exp(-U))*w[k]);if(!r(await this.swiglu(h,w),P))return e("swiglu");let q=h.map((U,k)=>mr(U)*w[k]);if(!r(await this.geglu(h,w),q))return e("geglu");let S=h.map((U,k)=>U+w[k]);if(!r(await this.add(h,w),S))return e("add");{let U=ee.MAX_WG_DIM*ie+257,k=new Float32Array(U),v=new Float32Array(U),m=[0,1,ie-1,ie,ee.MAX_WG_DIM*ie-1,ee.MAX_WG_DIM*ie,U-1];for(let A of m)k[A]=A%7-3,v[A]=A%5-2;let y=await this.add(k,v),b=y.length===U;for(let A of m)Math.abs(y[A]-(k[A]+v[A]))>1e-5&&(b=!1);if(!b)return e("grid1D.add(2D)")}let F=(U,k,v=.003)=>U.length===k.length&&U.every((m,y)=>Math.abs(m-k[y])<=v*(1+Math.abs(k[y])));{let b=t(8);if(!F(await this.rope(b,2,4,2,1,1e4),Ke(b,2,4,2,1,1e4)))return e("rope")}{let b=t(384),A=new Float32Array(64/2).fill(1);if(!F(await this.ropeFactors(b,A,6,64,2,7,5e5),Ke(b,6,64,2,7,5e5)))return e("rope_factors.ones");let x=Float32Array.from({length:64/2},(G,_)=>1+_%5*.7);if(!F(await this.ropeFactors(b,x,6,64,2,7,5e5),Bn(b,x,6,64,2,7,5e5)))return e("rope_factors")}{let b=t(384);if(!F(await this.rope(b,6,64,2,7,5e5,!0),Je(b,6,64,2,7,5e5)))return e("rope.interleaved");let A=t(8);if(!F(await this.rope(A,2,4,2,3,1e4,!0),Je(A,2,4,2,3,1e4)))return e("rope.interleaved.hd4");let x=t(384);if(!F(await this.rope(x,6,64,2,0,5e5,!0),Je(x,6,64,2,0,5e5)))return e("rope.interleaved.pos0");let G=64/2,_=new Float32Array(384);for(let L=0;L<6;L++)for(let N=0;N<G;N++)_[L*64+2*N]=b[L*64+N],_[L*64+2*N+1]=b[L*64+N+G];let B=await this.rope(_,6,64,2,7,5e5,!0),C=await this.rope(b,6,64,2,7,5e5,!1),D=new Float32Array(384);for(let L=0;L<6;L++)for(let N=0;N<G;N++)D[L*64+2*N]=C[L*64+N],D[L*64+2*N+1]=C[L*64+N+G];if(!F(B,D))return e("rope.interleaved.equivalence");let T=Float32Array.from({length:G},(L,N)=>1+N%5*.7);if(!F(await this.ropeFactors(b,T,6,64,2,7,5e5,!0),Je(b,6,64,2,7,5e5,T)))return e("rope_factors.interleaved")}{let v=[16,24,24],m=1e6,y=3,b=y*2,A=5,x=t(b*128),G=new Uint32Array(y*3);for(let D=0;D<y;D++){let T=A+D;G.set([T,T,T],D*3)}let _=new Uint32Array([5,5,5,5,6,9,5,7,5]),B=F(await this.ropeMrope(x,G,b,128,2,v,m),Ke(x,b,128,2,A,m)),C=F(await this.ropeMrope(x,_,b,128,2,v,m),Gn(x,_,b,128,2,v,m));(!B||!C)&&(this.mropeOk=!1,console.error(`[selfValidate] rope_mrope KO sur ce GPU (${B?"positions 3D":"d\xE9g\xE9n\xE9r\xE9\u2260rope"}). Vision d\xE9sactiv\xE9e, chat texte intact.`))}{let A=t(32),x=t(32),G=t(32);if(!F(await this.attention(A,x,G,2,4,2,4,2),be(A,x,G,2,4,2,4,2)))return e("attention");let _=.3,B=5;if(!F(await this.attention(A,x,G,2,4,2,4,2,_,B),be(A,x,G,2,4,2,4,2,_,B)))return e("attention.softcap");{let Y=t(24),$=t(48),J=t(48);for(let W of[1,4,8,64]){if(!F(await this.attention(Y,$,J,3,2,1,4,9,void 0,0,W),be(Y,$,J,3,2,1,4,9,void 0,0,W)))return e(`attention.window(${W})`);if(!F(await this.attentionDecode(Y,$,J,3,2,1,4,9,void 0,0,W),be(Y,$,J,3,2,1,4,9,void 0,0,W)))return e(`attention_decode.window(${W})`)}}{let C=await this.quantizeKvReadback(x,4,2,4),D=await this.quantizeKvReadback(G,4,2,4),T=await this.attentionQ8Kv(A,C.codes,C.scales,D.codes,D.scales,2,4,2,4,2),L=(J,W)=>{let O=new Float32Array(32);for(let R=0;R<4;R++)for(let j=0;j<2;j++){let K=W[R*2+j];for(let I=0;I<4;I++){let E=R*2*4+j*4+I,H=J[E>>2]>>(E&3)*8&255;O[E]=(H<128?H:H-256)*K}}return O},N=L(C.codes,C.scales),Q=L(D.codes,D.scales),Y=be(A,N,Q,2,4,2,4,2);if(!F(T,Y,.005))return e("attention.q8kv");let $=0;for(let J=0;J<x.length;J++)$=Math.max($,Math.abs(N[J]-x[J]));if($>.05)return e("quantize_kv.error")}}{let U=v=>{this.attnDecodeOk=!1,console.error("[selfValidate] attention d\xE9codage HS sur ce GPU (\xE9tape :",v,") \u2192 repli kernels classiques (plus lents \xE0 contexte long, corrects)")},k=[{nT:1,nH:14,nKv:2,hd:64,past:300},{nT:10,nH:14,nKv:2,hd:64,past:173}];for(let v of k){if(!this.attnDecodeOk)break;let m=v.past+v.nT,y=t(v.nT*v.nH*v.hd),b=t(m*v.nKv*v.hd),A=t(m*v.nKv*v.hd);if(!F(await this.attentionDecode(y,b,A,v.nT,v.nH,v.nKv,v.hd,v.past),be(y,b,A,v.nT,v.nH,v.nKv,v.hd,v.past))){U(`decode(nT=${v.nT})`);break}let x=await this.quantizeKvReadback(b,m,v.nKv,v.hd),G=await this.quantizeKvReadback(A,m,v.nKv,v.hd),_=await this.attentionQ8KvDecode(y,x.codes,x.scales,G.codes,G.scales,v.nT,v.nH,v.nKv,v.hd,v.past),B=await this.attentionQ8Kv(y,x.codes,x.scales,G.codes,G.scales,v.nT,v.nH,v.nKv,v.hd,v.past);if(!F(_,B,.005)){U(`decode.q8kv(nT=${v.nT})`);break}}if(this.attnDecodeOk){let x=t(64),G=t(350*8),_=t(350*8);F(await this.attentionDecode(x,G,_,2,4,2,8,173,.3,5),be(x,G,_,2,4,2,8,173,.3,5))||U("decode.softcap")}if(this.attnDecodeOk){let x=t(256),G=t(9088),_=t(9088);F(await this.attentionDecode(x,G,_,1,2,1,128,70),be(x,G,_,1,2,1,128,70))||U("decode.hd128")}}{let U=m=>{this.attnPrefillOk=!1,console.error("[selfValidate] attention prefill tuil\xE9e HS sur ce GPU (\xE9tape :",m,") \u2192 repli kernel classique (plus lent en prefill, correct)")},k=[{nT:37,nH:14,nKv:2,hd:64,past:0,sc:void 0,cap:0,win:0},{nT:13,nH:14,nKv:2,hd:64,past:173,sc:void 0,cap:0,win:0},{nT:1,nH:14,nKv:2,hd:64,past:300,sc:void 0,cap:0,win:0},{nT:4,nH:4,nKv:2,hd:32,past:7,sc:void 0,cap:0,win:0},{nT:5,nH:4,nKv:2,hd:32,past:0,sc:void 0,cap:0,win:0},{nT:9,nH:2,nKv:1,hd:128,past:70,sc:void 0,cap:0,win:0},{nT:6,nH:4,nKv:2,hd:8,past:17,sc:.3,cap:5,win:0}];for(let m of k){let y=m.past+m.nT,b=t(m.nT*m.nH*m.hd),A=t(y*m.nKv*m.hd),x=t(y*m.nKv*m.hd);if(!F(await this.attentionPrefill(b,A,x,m.nT,m.nH,m.nKv,m.hd,m.past,m.sc,m.cap,m.win),be(b,A,x,m.nT,m.nH,m.nKv,m.hd,m.past,m.sc,m.cap,m.win))){U(`prefill(nT=${m.nT},hd=${m.hd},past=${m.past}${m.cap>0?",softcap":""})`);break}}if(this.attnPrefillOk){let _=t(80),B=t(76),C=t(76);for(let D of[1,4,8,64])if(!F(await this.attentionPrefill(_,B,C,10,2,1,4,9,void 0,0,D),be(_,B,C,10,2,1,4,9,void 0,0,D))){U(`prefill.window(${D})`);break}}let v=[{nT:37,nH:14,nKv:2,hd:64,past:0,win:0},{nT:13,nH:14,nKv:2,hd:64,past:173,win:0},{nT:10,nH:2,nKv:1,hd:8,past:9,win:4}];for(let m of v){if(!this.attnPrefillOk)break;let y=m.past+m.nT,b=t(m.nT*m.nH*m.hd),A=t(y*m.nKv*m.hd),x=t(y*m.nKv*m.hd),G=await this.quantizeKvReadback(A,y,m.nKv,m.hd),_=await this.quantizeKvReadback(x,y,m.nKv,m.hd),B=await this.attentionQ8KvPrefill(b,G.codes,G.scales,_.codes,_.scales,m.nT,m.nH,m.nKv,m.hd,m.past,void 0,0,m.win),C=await this.attentionQ8Kv(b,G.codes,G.scales,_.codes,_.scales,m.nT,m.nH,m.nKv,m.hd,m.past,void 0,0,m.win);if(!F(B,C,.005)){U(`prefill.q8kv(nT=${m.nT},win=${m.win})`);break}}}{let U=v=>{this.rmsVecOk=!1,console.error("[selfValidate] RMSNorm parall\xE8le HS sur ce GPU (\xE9tape :",v,") \u2192 repli kernel une-ligne-par-thread (correct, plus lent en d\xE9codage)")},k=[{rows:1,dim:1024,onePlus:!1},{rows:1,dim:1536,onePlus:!1},{rows:1,dim:100,onePlus:!1},{rows:14,dim:64,onePlus:!1},{rows:37,dim:2048,onePlus:!1},{rows:3,dim:128,onePlus:!0}];for(let v of k){let m=t(v.rows*v.dim),y=t(v.dim),b=await this.rmsnormVec(m,y,v.rows,v.dim,1e-6,v.onePlus),A=await this.rmsnorm(m,y,v.rows,v.dim,1e-6,v.onePlus);if(!F(b,A,.005)){U(`rmsnorm_vec(${v.rows}\xD7${v.dim}${v.onePlus?",1+w":""})`);break}}}{let U=v=>{this.topKParOk=!1,console.error("[selfValidate] top-K parall\xE8le HS sur ce GPU (\xE9tape :",v,") \u2192 repli s\xE9lection sur un thread (correcte, plus lente)")},k=[{n:151936,k:64,ties:!1,label:"vocab Qwen (151936)"},{n:65536,k:64,ties:!1,label:"vocab World (65536)"},{n:1e3,k:64,ties:!1,label:"n non multiple de 128"},{n:300,k:64,ties:!1,label:"n < 1024 candidats"},{n:4096,k:8,ties:!1,label:"petit K"},{n:8192,k:64,ties:!0,label:"EX \xC6QUO (d\xE9partage)"}];for(let v of k){if(!this.topKParOk)break;let m=v.ties?Float32Array.from({length:v.n},(x,G)=>Math.round(Math.random()*6)+(G%7===0?3:0)):t(v.n),y=await this.topKReadback(m,v.k,"top_k"),b=await this.topKReadback(m,v.k,"top_k_par");if(!(y.length===b.length&&y.every((x,G)=>x===b[G]))){let x=y.findIndex((G,_)=>G!==b[_]);U(`top_k_par(${v.label}). Premier \xE9cart au rang ${x} : ${y[x]} vs ${b[x]}`);break}}}{let x={seq:3,d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},G={attnNorm:t(16),wq:t(256),wk:t(128),wv:t(128),wo:t(256),bq:t(16),bk:t(8),bv:t(8),ffnNorm:t(16),wgate:t(256),wup:t(256),wdown:t(256)},_=t(48);if(!F(await this.layerForward(_,x,G),kt(_,x,G),.005))return e("layerForward")}{let G={seq:3,d:12,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6,attnScale:1/Math.sqrt(4),attnLogitSoftcap:5,act:"gelu",rmsGainOnePlus:!0},_={attnNorm:t(12),wq:t(192),wk:t(96),wv:t(96),wo:t(192),ffnNorm:t(12),wgate:t(192),wup:t(192),wdown:t(192),postAttnNorm:t(12),postFfnNorm:t(12)},B=t(36);if(!F(await this.layerForward(B,G,_),kt(B,G,_),.005))return e("layerForward.gemma2")}{let G={seq:3,d:12,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e6,eps:1e-6},_={attnNorm:t(12),wq:t(192),wk:t(96),wv:t(96),wo:t(192),ffnNorm:t(12),wgate:t(192),wup:t(192),wdown:t(192),qNorm:t(4),kNorm:t(4)},B=t(36);if(!F(await this.layerForward(B,G,_),kt(B,G,_),.005))return e("layerForward.qwen3")}{let k=new Uint8Array(720);for(let m=0;m<5;m++){let y=m*144,b=new DataView(k.buffer);b.setUint16(y,Te(.005+Math.random()*.05),!0),b.setUint16(y+2,Te(.001+Math.random()*.02),!0);for(let A=4;A<144;A++)k[y+A]=Math.random()*256|0}let v=await this.dequantizeQ4K(k,5*256);if(!F(v,kn(k,5),1e-4))return e("dequant.Q4_K")}{let U=_=>{let B=new Uint8Array(_);for(let C=0;C<_;C++)B[C]=Math.random()*256|0;return B},k=(_,B)=>{let C=new DataView(_.buffer),D=T=>B===210?T*210+208:T*B;for(let T=0;T*B<_.length;T++)C.setUint16(D(T),Te(.005+Math.random()*.05),!0);return _},m=k(U(136),34);if(!F(await this.dequantizeByType("Q8_0",m,128),An(m,4),1e-4))return e("dequant.Q8_0");let y=k(U(88),22);if(!F(await this.dequantizeByType("Q5_0",y,128),Pn(y,4),1e-4))return e("dequant.Q5_0");let b=k(U(840),210);if(!F(await this.dequantizeByType("Q6_K",b,4*256),_n(b,4),1e-4))return e("dequant.Q6_K");let A=k(U(72),18);if(!F(await this.dequantizeByType("Q4_0",A,128),Un(A,4),1e-4))return e("dequant.Q4_0");let x=U(704),G=new DataView(x.buffer);for(let _=0;_<4;_++)G.setUint16(_*176,Te(.005+Math.random()*.05),!0),G.setUint16(_*176+2,Te(.001+Math.random()*.02),!0);if(!F(await this.dequantizeByType("Q5_K",x,4*256),xn(x,4),1e-4))return e("dequant.Q5_K")}{let A={d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},x={attnNorm:t(16),wq:t(256),wk:t(128),wv:t(128),wo:t(256),bq:t(16),bk:t(8),bv:t(8),ffnNorm:t(16),wgate:t(256),wup:t(256),wdown:t(256)},G=t(48),B=(await this.layerForward(G,{...A,seq:3},x)).slice(32,48),C=new Float32Array(0),D=await this.layerForwardKV(G.slice(0,32),{...A,seq:2},x,0,C,C),T=await this.layerForwardKV(G.slice(32,48),{...A,seq:1},x,2,D.k,D.v);if(!F(T.out,B,.005))return e("layerForwardKV")}{let v=t(4),m=t(40),y=new Float32Array(10);for(let G=0;G<10;G++){let _=0;for(let B=0;B<4;B++)_+=v[B]*m[G*4+B];y[G]=_}let b=0;for(let G=1;G<10;G++)y[G]>y[b]&&(b=G);let A=this.uploadGpu(m),x=await this.argmaxProjection(v,[{buf:A,rows:10,r0:0}],4,10,!1);if(A.destroy?.(),x!==b)return e("argmaxProjection")}{let A={seq:4,d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},x={attnNorm:t(16),wq:t(256),wk:t(128),wv:t(128),wo:t(256),bq:t(16),bk:t(8),bv:t(8),ffnNorm:t(16),wgate:t(256),wup:t(256),wdown:t(256)},G=t(16),_=t(64),B=new Float32Array(0),C=await this.layerForwardKV(_,{...A,seq:4},x,0,B,B,!0),D=Fe(C.out.slice(48,64),G,1,16,1e-6),T={attnNorm:this.uploadGpu(x.attnNorm),wq:this.uploadGpu(x.wq),wk:this.uploadGpu(x.wk),wv:this.uploadGpu(x.wv),wo:this.uploadGpu(x.wo),ffnNorm:this.uploadGpu(x.ffnNorm),wgate:this.uploadGpu(x.wgate),wup:this.uploadGpu(x.wup),wdown:this.uploadGpu(x.wdown),bq:this.uploadGpu(x.bq),bk:this.uploadGpu(x.bk),bv:this.uploadGpu(x.bv)},L=this.uploadGpu(G),N=this.kvQuant;this.kvQuant=!1,this.resetKvGpu();let Q=await this.runDecodeGpu(_,{...A,seq:4},[T],0,L,"selftest-A");if(!F(Q,D,.008))return this.resetKvGpu(),this.kvQuant=N,e("runDecodeGpu.prefill");await this.runDecodeGpu(_.slice(0,48),{...A,seq:3},[T],0,L,"selftest-B");let Y=await this.runDecodeGpu(_.slice(48,64),{...A,seq:1},[T],3,L,"selftest-B");if(!F(Y,D,.008))return this.resetKvGpu(),this.kvQuant=N,e("runDecodeGpu.decode");this.kvQuant=N,this.resetKvGpu();for(let $ of Object.values(T))$?.destroy?.();L.destroy?.()}{let y=Float32Array.from({length:152064},()=>(Math.random()*2-1)*8),b=[...new Set(Array.from({length:40},()=>Math.floor(Math.random()*152064)))],A=y.slice();for(let O=0;O<152064;O++)A[O]=30*Math.tanh(A[O]/30);for(let O of b)A[O]=A[O]>0?A[O]/1.15:A[O]*1.15;let x=Array.from(A.keys()).sort((O,R)=>A[R]-A[O]).slice(0,64),G=globalThis,_=[],B=this.storage(152064*4);this.device.queue.writeBuffer(B,0,y),_.push(B);let C=this.device.createCommandEncoder(),D=this.uniform([152064],{offset:4,value:30});this.recordPass(C,"softcap_logits",[D,B],this.grid1D(152064));let T=this.bufU32(Uint32Array.from(b),G.GPUBufferUsage.STORAGE|G.GPUBufferUsage.COPY_DST),L=this.uniform([b.length],{offset:4,value:1.15});this.recordPass(C,"penalize_logits",[L,T,B],this.grid1D(b.length));let N=this.storage(512),Q=this.uniform([152064,64]);this.recordPass(C,this.topKParOk?"top_k_par":"top_k",[Q,B,N],[1,1,1]),_.push(D,T,L,Q,N);let Y=this.device.createBuffer({size:512,usage:G.GPUBufferUsage.COPY_DST|G.GPUBufferUsage.MAP_READ});C.copyBufferToBuffer(N,0,Y,0,512),this.device.queue.submit([C.finish()]),await Y.mapAsync(G.GPUMapMode.READ);let $=new Uint32Array(Y.getMappedRange().slice(0));Y.unmap(),Y.destroy(),this.release(_);let J=$.slice(0,64),W=new Float32Array($.buffer,256,64);this.topKOk=!0;for(let O=0;O<64;O++){let R=Math.abs(W[O]-A[x[O]])<=1e-4*(1+Math.abs(A[x[O]])),j=Math.abs(A[J[O]]-W[O])<=1e-4*(1+Math.abs(W[O]));if(!R||!j){this.topKOk=!1,console.error(`[selfValidate] top_k KO sur ce GPU (rang ${O}) : repli sur le sampling CPU plein-vocab (plus lent, m\xEAme r\xE9sultat).`);break}}}if(this.rwkvWkv7Ok){let m=t(128),y=t(16),b=t(16),A=t(16),x=t(16),G=t(16),_=Float32Array.from({length:16},()=>Math.random()*.5+.5),B=m.slice(),C=new Float32Array(16);for(let W=0;W<2;W++){let O=W*8;for(let R=0;R<8;R++){let j=W*8*8+R*8,K=A[O+R],I=0;for(let H=0;H<8;H++)I+=G[O+H]*B[j+H];let E=0;for(let H=0;H<8;H++){let V=_[O+H]*B[j+H]+K*b[O+H]+x[O+H]*I;B[j+H]=V,E+=y[O+H]*V}C[O+R]=E}}let D=await this.rwkvWkv7(m.slice(),y,_,b,A,G,x,2,8),T=(W,O)=>W.length===O.length&&W.every((R,j)=>Math.abs(R-O[j])<=.001*(1+Math.abs(O[j])));!T(D.S,B)||!T(D.y,C)?(this.rwkvWkv7Ok=!1,console.error("[selfValidate] RWKV-7 WKV KO sur ce GPU : une archi RWKV (moteur v2) refuserait de charger (non bloquant pour le chat texte).")):console.log("[selfValidate] RWKV-7 WKV OK (r\xE9currence \xE0 \xE9tat fixe, moteur v2)");let L=16,N=t(L),Q=t(L),Y=t(L*6),$=new Float32Array(L*6);for(let W=0;W<6;W++)for(let O=0;O<L;O++){let R=W*L+O;$[R]=N[O]+(Q[O]-N[O])*Y[R]}let J=await this.rwkvTokenShift(N,Q,Y,L);if(T(J,$)?console.log("[selfValidate] RWKV-7 token-shift OK"):(this.rwkvWkv7Ok=!1,console.error("[selfValidate] RWKV-7 token-shift KO sur ce GPU (non bloquant pour le chat texte).")),this.rwkvResidentOk){let W=globalThis,O=W.GPUBufferUsage.STORAGE|W.GPUBufferUsage.COPY_DST|W.GPUBufferUsage.COPY_SRC,R=2,j=8,K=R*j,I=(H,V)=>{let re=Math.max(16,Math.ceil((H.length*4+(V?4:0))/16)*16),te=this.device.createBuffer({size:re,usage:W.GPUBufferUsage.UNIFORM|W.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(te,0,new Uint32Array(H)),V&&this.device.queue.writeBuffer(te,V.off,new Float32Array([V.val])),te},E=H=>this.device.createBuffer({size:H*4,usage:O});try{let H=t(K),V=t(K),re=t(K),te=Float32Array.from({length:K},()=>Math.random()),ne=new Float32Array(K),ce=new Float32Array(K),de=new Float32Array(K);for(let le=0;le<R;le++){let se=0;for(let ve=0;ve<j;ve++){let fe=H[le*j+ve]*V[le*j+ve];se+=fe*fe}se=Math.sqrt(se)||1e-12;for(let ve=0;ve<j;ve++){let fe=le*j+ve,Ie=H[fe]*V[fe]/se;ce[fe]=-Ie,de[fe]=Ie*te[fe],ne[fe]=H[fe]*(1+(te[fe]-1)*re[fe])}}let X=E(K),_e=E(K),Z=E(K);this.dispatch("rwkv_kprep",[I([R,j]),this.buf(H,O),this.buf(te,O),this.buf(V,O),this.buf(re,O),X,_e,Z],this.grid1D(R));let Ge=T(await this.readBack(X,K*4),ne)&&T(await this.readBack(_e,K*4),ce)&&T(await this.readBack(Z,K*4),de);X.destroy?.(),_e.destroy?.(),Z.destroy?.();let he=t(K),Ct=t(K),Mt=t(K),Rt=t(K),Dt=t(K),Lt=t(K),jt=new Float32Array(K);for(let le=0;le<R;le++){let se=le*j,ve=0;for(let ue=0;ue<j;ue++)ve+=he[se+ue];ve/=j;let fe=0;for(let ue=0;ue<j;ue++){let rr=he[se+ue]-ve;fe+=rr*rr}fe/=j;let Ie=1/Math.sqrt(fe+64e-5),tr=0;for(let ue=0;ue<j;ue++)tr+=Ct[se+ue]*ne[se+ue]*Mt[se+ue];for(let ue=0;ue<j;ue++)jt[se+ue]=(he[se+ue]-ve)*Ie*Dt[se+ue]+Lt[se+ue]+tr*Rt[se+ue]}let ut=new Float32Array(2*K);ut.set(Dt,0),ut.set(Lt,K);let ct=E(K);this.dispatch("rwkv_out_gn",[I([R,j],{off:8,val:64e-5}),this.buf(he,O),this.buf(Ct,O),this.buf(ne,O),this.buf(Mt,O),this.buf(Rt,O),this.buf(ut,O),ct],this.grid1D(R));let Ht=T(await this.readBack(ct,K*4),jt);ct.destroy?.();let Kt=t(K),zt=t(K),un=Float32Array.from(Kt,(le,se)=>Math.exp(-.606531/(1+Math.exp(-(le+zt[se]))))),lt=E(K);this.dispatch("rwkv_decay",[this.buf(Kt,O),this.buf(zt,O),lt],this.grid1D(K));let Et=T(await this.readBack(lt,K*4),un);lt.destroy?.();let Nt=t(K),Wt=t(K),Qt=t(K),$t=t(K),cn=Float32Array.from(Nt,(le,se)=>le+(Wt[se]-le)*(1/(1+Math.exp(-(Qt[se]+$t[se]))))),dt=this.buf(Nt,O);this.dispatch("rwkv_vresid",[dt,this.buf(Wt,O),this.buf(Qt,O),this.buf($t,O)],this.grid1D(K));let It=T(await this.readBack(dt,K*4),cn);dt.destroy?.();let Vt=t(K),Yt=t(K),Xt=t(K),ln=Float32Array.from(Vt,(le,se)=>le+(Yt[se]-le)*Xt[se]),ft=E(K);this.dispatch("rwkv_lerp",[this.buf(Vt,O),this.buf(Yt,O),this.buf(Xt,O),ft],this.grid1D(K));let Jt=T(await this.readBack(ft,K*4),ln);ft.destroy?.();let Zt=t(K),dn=Float32Array.from(Zt,le=>{let se=Math.max(le,0);return se*se}),gt=E(K);this.dispatch("sqrelu",[this.buf(Zt,O),gt],this.grid1D(K));let er=T(await this.readBack(gt,K*4),dn);gt.destroy?.(),!Ge||!Ht||!Et||!It||!Jt||!er?(this.rwkvResidentOk=!1,console.error(`[selfValidate] glu RWKV r\xE9sidente KO sur ce GPU (kprep:${Ge} gn:${Ht} decay:${Et} vresid:${It} lerp:${Jt} sqrelu:${er}). Repli forwardToken JS+readback (correct, lent).`)):console.log("[selfValidate] glu RWKV r\xE9sidente OK (kprep, out_gn, decay, vresid, lerp, sqrelu)")}catch(H){this.rwkvResidentOk=!1,console.error("[selfValidate] glu RWKV r\xE9sidente : erreur d\u2019ex\xE9cution. Repli forwardToken JS+readback.",H)}}}if(this.lfm2ShortConvOk){let U=B=>Float32Array.from({length:B},()=>Math.random()*2-1),k=(B,C)=>B.length===C.length&&B.every((D,T)=>Math.abs(D-C[T])<=.001*(1+Math.abs(C[T]))),y=U(96),b=U(64),A=U(96),x=new Float32Array(32),G=b.slice();for(let B=0;B<32;B++){let C=y[B]*y[64+B],D=A[B*3+2]*C;for(let T=0;T<2;T++)D+=A[B*3+T]*b[T*32+B];for(let T=0;T+2<3;T++)G[T*32+B]=b[(T+1)*32+B];G[32+B]=C,x[B]=D*y[32+B]}let _=await this.lfm2ShortConv(y,b.slice(),A,32,3);!k(_.out,x)||!k(_.state,G)?(this.lfm2ShortConvOk=!1,console.error("[selfValidate] LFM2 shortconv KO sur ce GPU : une archi lfm2 refuserait de charger (non bloquant pour le reste).")):console.log("[selfValidate] LFM2 shortconv OK (conv courte gat\xE9e, moteur v2)")}let M=await this.validateDiffusion();M?console.warn("[selfValidate] image-gen primitive KO:",M,"(non bloquant: chemin texte intact)"):console.log(`[selfValidate] image-gen primitives OK (silu, group_norm, conv2d, conv2d_direct, conv2d_direct_q8/q4, conv 3\xD73 tuil\xE9 q8/q4 ${this.convTiledQOk?"OK":"KO (repli direct)"}, relu, upsample_nearest, layernorm, quick_gelu, attention_full)`);let z=await this.validateVideoResident();return z?(this.videoResidentOk=!1,console.warn("[selfValidate] motion r\xE9sident KO:",z,", repli JS+readback (plus lent, m\xEAme r\xE9sultat).")):console.log("[selfValidate] motion r\xE9sident OK (video_motion_gather, video_motion_scatter, video_add_pe, attn_temporal)"),!0}async validateVideoResident(){let e=o=>Float32Array.from({length:o},()=>Math.random()*2-1),r=(o,u,c=.005)=>o.length===u.length&&o.every((d,f)=>Math.abs(d-u[f])<=c*(1+Math.abs(u[f])));{let o=e(120),u=new Float32Array(120);for(let f=0;f<5;f++)for(let g=0;g<3;g++)for(let p=0;p<8;p++)u[(f*3+g)*8+p]=o[(g*8+p)*5+f];let c=this.recordingSession(),d=await c.finish(c.videoGather(o,3,8,5),120);if(!r(d,u,1e-6))return"video_motion_gather"}{let o=e(120),u=e(120),c=new Float32Array(120);for(let g=0;g<3;g++)for(let p=0;p<8;p++)for(let h=0;h<5;h++)c[(g*8+p)*5+h]=o[(h*3+g)*8+p]+u[(g*8+p)*5+h];let d=this.recordingSession(),f=await d.finish(d.videoScatter(o,u,3,8,5),120);if(!r(f,c,1e-6))return"video_motion_scatter"}{let o=e(120),u=e(24),c=new Float32Array(120);for(let g=0;g<5;g++)for(let p=0;p<3;p++)for(let h=0;h<8;h++)c[(g*3+p)*8+h]=o[(g*3+p)*8+h]+u[p*8+h];let d=this.recordingSession(),f=await d.finish(d.videoAddPe(o,u,3,8,5),120);if(!r(f,c,1e-6))return"video_add_pe"}{let o=e(120),u=e(120),c=e(120),d=1/Math.sqrt(4),f=new Float32Array(120);for(let h=0;h<5;h++)for(let w=0;w<2;w++){let P=w*4,q=h*3;for(let S=0;S<3;S++){let F=(q+S)*8+P,M=new Float32Array(3),z=-1e30;for(let k=0;k<3;k++){let v=0,m=(q+k)*8+P;for(let y=0;y<4;y++)v+=o[F+y]*u[m+y];M[k]=v*d,M[k]>z&&(z=M[k])}let U=0;for(let k=0;k<3;k++)M[k]=Math.exp(M[k]-z),U+=M[k];for(let k=0;k<3;k++){let v=M[k]/U,m=(q+k)*8+P;for(let y=0;y<4;y++)f[F+y]+=v*c[m+y]}}}let g=this.recordingSession(),p=await g.finish(g.attnTemporal(o,u,c,5,3,2,4),120);if(!r(p,f))return"attn_temporal"}return null}async validateDiffusion(){let e=O=>Float32Array.from({length:O},()=>Math.random()*2-1),r=(O,R,j=.005)=>O.length===R.length&&O.every((K,I)=>Math.abs(K-R[I])<=j*(1+Math.abs(R[I]))),t=e(70),n=t.map(O=>O/(1+Math.exp(-O)));if(!r(await this.silu(t),n))return"silu";let s=4,a=5,i=2,o=1e-5,u=e(s*a),c=e(s),d=e(s),f=new Float32Array(s*a),g=s/i;for(let O=0;O<i;O++){let R=O*g*a,j=g*a,K=0;for(let H=0;H<j;H++)K+=u[R+H];K/=j;let I=0;for(let H=0;H<j;H++){let V=u[R+H]-K;I+=V*V}I/=j;let E=1/Math.sqrt(I+o);for(let H=0;H<j;H++){let V=O*g+Math.floor(H/a);f[R+H]=(u[R+H]-K)*E*c[V]+d[V]}}if(!r(await this.groupNorm(u,c,d,s,a,i,o),f))return"group_norm";let p=2,h=4,w=4,P=3,q=3,S=1,F=1,M=4,z=4,U=e(p*h*w),k=e(P*p*q*q),v=e(P),m=new Float32Array(P*M*z);for(let O=0;O<P;O++)for(let R=0;R<M;R++)for(let j=0;j<z;j++){let K=v[O];for(let I=0;I<p;I++)for(let E=0;E<q;E++)for(let H=0;H<q;H++){let V=R*S+E-F,re=j*S+H-F;V>=0&&V<h&&re>=0&&re<w&&(K+=U[I*h*w+V*w+re]*k[((O*p+I)*q+E)*q+H])}m[(O*M+R)*z+j]=K}if(!r(await this.conv2d(U,k,v,p,h,w,P,q,q,S,F),m))return"conv2d";if(!r(await this.conv2dDirect(U,k,v,p,h,w,P,q,q,S,F),m))return"conv2d_direct";{let I=e(1200),E=e(108),H=e(4),V=await this.conv2dDirect(I,E,H,3,20,20,4,3,3,1,1),re=this.convTiledOk;this.convTiledOk=!0;let te=this.recordingSession(),ne=await te.finish(te.conv2d(I,E,H,3,20,20,4,3,3,1,1),1600);this.convTiledOk=re,r(ne,V)||(this.convTiledOk=!1,console.warn("[selfValidate] conv2d_3x3_tiled KO sur ce GPU : repli sur conv2d_direct (plus lent, m\xEAme r\xE9sultat)."))}{let j=e(8*h*w),K=e(32*q*q),I=e(4),E=Pe(K),H=await this.conv2dDirect(j,me(E),I,8,h,w,4,q,q,S,F),V={codes:this.uploadGpuRaw(new Uint8Array(E.codes.buffer,E.codes.byteOffset,E.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(E.scales.buffer,E.scales.byteOffset,E.scales.byteLength))},re=this.convTiledQOk;this.convTiledQOk=!1;let te=this.recordingSession(),ne=await te.finish(te.conv2d(j,V,I,8,h,w,4,q,q,S,F),4*h*w);if(this.convTiledQOk=re,this.releaseGpu([V.codes,V.sc]),!r(ne,H))return"conv2d_direct_q8"}{let j=e(8*h*w),K=e(32*q*q),I=e(4),E=ke(K),H=await this.conv2dDirect(j,pe(E),I,8,h,w,4,q,q,S,F),V={nib:this.uploadGpuRaw(E.nibbles),sc:this.uploadGpuRaw(new Uint8Array(E.scales.buffer,E.scales.byteOffset,E.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(E.mins.buffer,E.mins.byteOffset,E.mins.byteLength))},re=this.convTiledQOk;this.convTiledQOk=!1;let te=this.recordingSession(),ne=await te.finish(te.conv2d(j,V,I,8,h,w,4,q,q,S,F),4*h*w);if(this.convTiledQOk=re,this.releaseGpu([V.nib,V.sc,V.mn]),!r(ne,H))return"conv2d_direct_q4"}{let I=e(16e3),E=e(480),H=e(12),V=this.convTiledQOk;for(let re of["q8","q4"]){let te=re==="q8"?(()=>{let X=Pe(E);return{deq:me(X),gpu:{codes:this.uploadGpuRaw(new Uint8Array(X.codes.buffer,X.codes.byteOffset,X.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(X.scales.buffer,X.scales.byteOffset,X.scales.byteLength))}}})():(()=>{let X=ke(E);return{deq:pe(X),gpu:{nib:this.uploadGpuRaw(X.nibbles),sc:this.uploadGpuRaw(new Uint8Array(X.scales.buffer,X.scales.byteOffset,X.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(X.mins.buffer,X.mins.byteOffset,X.mins.byteLength))}}})(),ne=await this.conv2dDirect(I,te.deq,H,40,20,20,12,1,1,1,0);this.convTiledQOk=!0;let ce=this.recordingSession(),de=await ce.finish(ce.conv2d(I,te.gpu,H,40,20,20,12,1,1,1,0),4800);if(this.releaseGpu(Object.values(te.gpu)),!r(de,ne)){V&&console.warn(`[selfValidate] conv2d_1x1_${re} KO sur ce GPU : repli sur conv2d_direct_${re}.`),this.convTiledQOk=!1;break}}this.convTiledQOk=this.convTiledQOk&&V}{let I=e(3200),E=e(288),H=e(4),V=this.convTiledQOk;for(let re of["q8","q4"]){let te=re==="q8"?(()=>{let X=Pe(E);return{deq:me(X),gpu:{codes:this.uploadGpuRaw(new Uint8Array(X.codes.buffer,X.codes.byteOffset,X.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(X.scales.buffer,X.scales.byteOffset,X.scales.byteLength))}}})():(()=>{let X=ke(E);return{deq:pe(X),gpu:{nib:this.uploadGpuRaw(X.nibbles),sc:this.uploadGpuRaw(new Uint8Array(X.scales.buffer,X.scales.byteOffset,X.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(X.mins.buffer,X.mins.byteOffset,X.mins.byteLength))}}})(),ne=await this.conv2dDirect(I,te.deq,H,8,20,20,4,3,3,1,1);this.convTiledQOk=!0;let ce=this.recordingSession(),de=await ce.finish(ce.conv2d(I,te.gpu,H,8,20,20,4,3,3,1,1),1600);if(this.releaseGpu(Object.values(te.gpu)),!r(de,ne)){V&&console.warn(`[selfValidate] conv2d_3x3_tiled_${re} KO sur ce GPU : repli sur conv2d_direct_${re} (plus lent, m\xEAme r\xE9sultat).`),this.convTiledQOk=!1;break}}this.convTiledQOk=this.convTiledQOk&&V}{let I=e(3200),E=e(288),H=e(4),V=this.convS2Ok,re=Math.floor(19/2)+1,te=Math.floor(19/2)+1;for(let ne of["q8","q4"]){let ce=ne==="q8"?(()=>{let Z=Pe(E);return{deq:me(Z),gpu:{codes:this.uploadGpuRaw(new Uint8Array(Z.codes.buffer,Z.codes.byteOffset,Z.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(Z.scales.buffer,Z.scales.byteOffset,Z.scales.byteLength))}}})():(()=>{let Z=ke(E);return{deq:pe(Z),gpu:{nib:this.uploadGpuRaw(Z.nibbles),sc:this.uploadGpuRaw(new Uint8Array(Z.scales.buffer,Z.scales.byteOffset,Z.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(Z.mins.buffer,Z.mins.byteOffset,Z.mins.byteLength))}}})(),de=await this.conv2dDirect(I,ce.deq,H,8,20,20,4,3,3,2,1);this.convS2Ok=!0;let X=this.recordingSession(),_e=await X.finish(X.conv2d(I,ce.gpu,H,8,20,20,4,3,3,2,1),4*re*te);if(this.releaseGpu(Object.values(ce.gpu)),!r(_e,de)){V&&console.warn(`[selfValidate] conv2d_3x3_s2_tiled_${ne} KO sur ce GPU : repli sur direct.`),this.convS2Ok=!1;break}}this.convS2Ok=this.convS2Ok&&V}if(this.hasSubgroups&&this.subgroupsOk)try{let j=e(1500),K=e(300),I=r(await this.rmsnormVec(j,K,5,300,1e-5,!1,"rmsnorm_vec_subgroup"),await this.rmsnormVec(j,K,5,300,1e-5,!1)),E=8,H=130,V=4,re=e(E*H),te=e(E),ne=e(E),ce=r(await this.groupNorm(re,te,ne,E,H,V,1e-5,"group_norm_subgroup"),await this.groupNorm(re,te,ne,E,H,V));if(!I||!ce){let de=[!I&&"rmsnorm_vec_subgroup",!ce&&"group_norm_subgroup"].filter(Boolean).join(" + ");console.warn(`[selfValidate] ${de} KO sur ce GPU : repli sur la r\xE9duction en m\xE9moire partag\xE9e.`),this.subgroupsOk=!1}}catch(O){console.warn("[selfValidate] subgroups indisponibles \xE0 l'ex\xE9cution : repli sur la m\xE9moire partag\xE9e.",O),this.subgroupsOk=!1}{let R=e(66),j=new Uint16Array(66);for(let H=0;H<66;H++)j[H]=Te(R[H]);let K=new Float32Array(66);for(let H=0;H<66;H++)K[H]=we(j[H]);let I=this.f16ToF32Gpu(new Uint8Array(j.buffer,j.byteOffset,j.byteLength),66),E=await this.readGpu(I,66);if(I.destroy?.(),!r(E,K,1e-6))return"f16_to_f32"}let y=e(70);if(!r(await this.relu(y),y.map(O=>Math.max(O,0))))return"relu";let b=2,A=2,x=2,G=2,_=A*G,B=x*G,C=e(b*A*x),D=new Float32Array(b*_*B);for(let O=0;O<b;O++)for(let R=0;R<_;R++)for(let j=0;j<B;j++)D[O*_*B+R*B+j]=C[O*A*x+Math.floor(R/G)*x+Math.floor(j/G)];if(!r(await this.upsampleNearest(C,b,A,x,G),D))return"upsample_nearest";let T=2,L=8,N=1e-5,Q=e(T*L),Y=e(L),$=e(L),J=new Float32Array(T*L);for(let O=0;O<T;O++){let R=O*L,j=0;for(let E=0;E<L;E++)j+=Q[R+E];j/=L;let K=0;for(let E=0;E<L;E++){let H=Q[R+E]-j;K+=H*H}K/=L;let I=1/Math.sqrt(K+N);for(let E=0;E<L;E++)J[R+E]=(Q[R+E]-j)*I*Y[E]+$[E]}if(!r(await this.layernorm(Q,Y,$,T,L,N),J))return"layernorm";let W=e(70);if(!r(await this.quickGelu(W),W.map(O=>O/(1+Math.exp(-1.702*O)))))return"quick_gelu";{let E=1/Math.sqrt(4),H=e(24),V=e(40),re=e(40),te=new Float32Array(24);for(let ne=0;ne<2;ne++)for(let ce=0;ce<3;ce++){let de=new Float32Array(5),X=-1/0;for(let Z=0;Z<5;Z++){let Ge=0;for(let he=0;he<4;he++)Ge+=H[ce*8+ne*4+he]*V[Z*8+ne*4+he];de[Z]=Ge*E,de[Z]>X&&(X=de[Z])}let _e=0;for(let Z=0;Z<5;Z++)de[Z]=Math.exp(de[Z]-X),_e+=de[Z];for(let Z=0;Z<4;Z++){let Ge=0;for(let he=0;he<5;he++)Ge+=de[he]/_e*re[he*8+ne*4+Z];te[ce*8+ne*4+Z]=Ge}}if(!r(await this.attentionFull(H,V,re,3,2,2,4,5),te))return"attention_full"}if(this.attnFullWgOk){let O=[{nT:70,kvL:70,nH:5,hd:64},{nT:16,kvL:77,nH:5,hd:64},{nT:9,kvL:9,nH:8,hd:160}];for(let R of O){let j=R.nH*R.hd,K=e(R.nT*j),I=e(R.kvL*j),E=e(R.kvL*j),H=await this.attentionFull(K,I,E,R.nT,R.nH,R.nH,R.hd,R.kvL),V=await this.attentionFullWg(K,I,E,R.nT,R.nH,R.nH,R.hd,R.kvL);if(!r(V,H)){this.attnFullWgOk=!1,console.warn(`[selfValidate] attention_full_wg KO sur ce GPU (hd=${R.hd}, kv=${R.kvL}) : repli sur attention_full (plus lent, m\xEAme r\xE9sultat).`);break}}}return null}};ee.timingOn=(()=>{try{return oe("timing")==="1"}catch{return!1}})(),ee.profileOn=(()=>{try{return oe("gpuprofile")==="1"}catch{return!1}})(),ee.MAX_WG_DIM=65535,ee.BLOCK_ELEMS={Q4_K:256,Q5_K:256,Q6_K:256,Q8_0:32,Q5_0:32,Q4_0:32,F32:1,F16:1},ee.DEQUANT_SHADER={Q4_K:"dequant_q4k",Q8_0:"dequant_q8_0",Q5_0:"dequant_q5_0",Q6_K:"dequant_q6k",Q4_0:"dequant_q4_0",Q5_K:"dequant_q5k"},ee.STORAGE_USAGE=140;Ze=ee});function br(l,e){let r=new DataView(l.buffer,l.byteOffset,l.byteLength),t=new Float32Array(e);for(let n=0;n<e;n++)t[n]=ge(r.getUint16(n*2,!0));return t}function wr(l,e){let r=new DataView(l.buffer,l.byteOffset,l.byteLength),t=new Float32Array(e);for(let n=0;n<e;n++)t[n]=r.getFloat32(n*4,!0);return t}function ze(l,e,r,t){let n=0;for(let i=0;i<r;i++)n+=l[i]*l[i];let s=1/Math.sqrt(n/r+t),a=new Float32Array(r);for(let i=0;i<r;i++)a[i]=l[i]*s*e[i];return a}var qn,Me,et,yr=ae(()=>{"use strict";mt();bt();vt();je();qn=l=>l/(1+Math.exp(-l)),Me=class Me{constructor(e,r,t){this.engine=e;this.manifest=r;this.raw=t;this.w=new Map;this.g=new Map;this.pos=0;this.rLayers=[];this.tokNormGpu=null;this.normBufs=[];this.ffn=0}isBigProj(e){return/\.(shortconv\.(in_proj|out_proj)|attn_(q|k|v|output)|ffn_(gate|up|down))\.weight$/.test(e)}async load(e){if(!this.engine.lfm2ShortConvOk)throw new Error("kernel shortconv LFM2 invalid\xE9 sur ce GPU (selfValidate) : archi lfm2 refus\xE9e.");let r=this.manifest.arch;if(this.D=r.d,this.NH=r.nHeads,this.NKV=r.nKvHeads,this.HD=r.headDim,this.NL=r.blockCount,this.vocab=r.vocab,this.EPS=r.rmsEps,this.THETA=r.ropeTheta,!r.lfm2)throw new Error("manifest sans profil lfm2");this.LC=r.lfm2.lCache,this.convLayer=r.lfm2.kvHeadsPerLayer.map(t=>t===0),this.tok=e,this.stops=new Set(this.manifest.chat?.stopTokenIds?.length?this.manifest.chat.stopTokenIds:[7]);for(let[t,n]of Object.entries(this.manifest.tensors)){if(t==="token_embd.weight"){if(this.embedBytes=await this.raw(t),this.embedDtype=n.dtype,n.dtype==="q4"){let a=qe(this.embedBytes,n.nElems);this.g.set("head",{kind:"q4",nib:this.engine.uploadGpuRaw(a.nibbles),sc:this.up(a.scales),mn:this.up(a.mins),IN:this.D,OUT:this.vocab})}else if(n.dtype==="q8"){let a=Oe(this.embedBytes,n.nElems);this.g.set("head",{kind:"q8",codes:this.upI8(a.codes),sc:this.up(a.scales),IN:this.D,OUT:this.vocab})}else if(n.dtype==="q3")throw new Error("LFM2 : t\xEAte li\xE9e en q3 non support\xE9e (le convertisseur garde un plancher q4)");continue}let s=await this.raw(t);if(this.isBigProj(t)&&(n.dtype==="q3"||n.dtype==="q4"||n.dtype==="q8")){let a=n.shape[0],i=n.nElems/a;if(n.dtype==="q8"){let o=Oe(s,n.nElems);this.g.set(t,{kind:"q8",codes:this.upI8(o.codes),sc:this.up(o.scales),IN:a,OUT:i})}else if(n.dtype==="q3"){let o=De(s,n.nElems);this.g.set(t,{kind:"q3",q3:!0,lo:this.up32(o.lo),hi:this.up32(o.hi),sc:this.up(o.scales),mn:this.up(o.mins),IN:a,OUT:i})}else{let o=qe(s,n.nElems);this.g.set(t,{kind:"q4",nib:this.engine.uploadGpuRaw(o.nibbles),sc:this.up(o.scales),mn:this.up(o.mins),IN:a,OUT:i})}}else this.w.set(t,this.decodePetit(t,s,n))}this.buildResidentLayers(),this.reset()}buildResidentLayers(){let e=r=>{let t=this.engine.uploadGpu(this.w.get(r));return this.normBufs.push(t),t};this.tokNormGpu=e("token_embd_norm.weight"),this.ffn=this.g.get("blk.0.ffn_gate.weight")?.OUT??0,this.rLayers=[];for(let r=0;r<this.NL;r++){let t=`blk.${r}.`,n={attnNorm:e(t+"attn_norm.weight"),ffnNorm:e(t+"ffn_norm.weight"),wgate:this.g.get(t+"ffn_gate.weight"),wup:this.g.get(t+"ffn_up.weight"),wdown:this.g.get(t+"ffn_down.weight")};this.convLayer[r]?this.rLayers.push({conv:!0,...n,convW:e(t+"shortconv.conv.weight"),inProj:this.g.get(t+"shortconv.in_proj.weight"),outProj:this.g.get(t+"shortconv.out_proj.weight")}):this.rLayers.push({conv:!1,...n,qNorm:e(t+"attn_q_norm.weight"),kNorm:e(t+"attn_k_norm.weight"),wq:this.g.get(t+"attn_q.weight"),wk:this.g.get(t+"attn_k.weight"),wv:this.g.get(t+"attn_v.weight"),wo:this.g.get(t+"attn_output.weight")})}}residentAvailable(){return this.engine.lfm2ResidentOk!==!1&&!!this.g.get("head")&&this.rLayers.length===this.NL&&this.ffn>0}cfg(){return{D:this.D,nHeads:this.NH,nKvHeads:this.NKV,headDim:this.HD,ffn:this.ffn,eps:this.EPS,theta:this.THETA,lc:this.LC,vocab:this.vocab}}embedsFor(e){let r=this.D,t=new Float32Array(e.length*r);for(let n=0;n<e.length;n++)t.set(this.embedRow(e[n]),n*r);return t}async logitsGpu(e,r,t){return this.pos=r+e.length,this.engine.lfm2LogitsGpu(this.embedsFor(e),e.length,this.cfg(),this.rLayers,this.g.get("head"),this.tokNormGpu,r,t)}async topKGpu(e,r,t,n,s,a=40){return this.pos=r+e.length,this.engine.lfm2TopKGpu(this.embedsFor(e),e.length,this.cfg(),this.rLayers,this.g.get("head"),this.tokNormGpu,r,t,n,s,a)}async prefillGpu(e,r,t){this.pos=r+e.length,await this.engine.lfm2PrefillGpu(this.embedsFor(e),e.length,this.cfg(),this.rLayers,this.tokNormGpu,r,t)}decodePetit(e,r,t){switch(t.dtype){case"f32":return wr(r,t.nElems);case"f16":return br(r,t.nElems);case"q8":return me(Oe(r,t.nElems));case"q4":return pe(qe(r,t.nElems));case"q3":return Le(De(r,t.nElems));default:throw new Error(`LFM2 : dtype \xAB ${t.dtype} \xBB non support\xE9 pour ${e}`)}}up(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}up32(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}upI8(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}unload(){for(let e of this.g.values())for(let r of["nib","sc","mn","codes"])e[r]?.destroy?.();for(let e of this.normBufs)e?.destroy?.();this.normBufs=[],this.rLayers=[],this.tokNormGpu=null,this.engine.clearLfm2State?.(),this.g.clear(),this.w.clear()}reset(){this.pos=0,this.state=Array.from({length:this.NL},(e,r)=>this.convLayer[r]?{conv:new Float32Array((this.LC-1)*this.D)}:{K:[],V:[]})}async gemm(e,r){let t=this.g.get(e);if(!t){let n=this.w.get(e==="head"?"token_embd.weight":e),s=n.length/r.length,a=new Float32Array(s);for(let i=0;i<s;i++){let o=0,u=i*r.length;for(let c=0;c<r.length;c++)o+=n[u+c]*r[c];a[i]=o}return a}return t.kind==="q8"?this.engine.matmulQ8(r,t.codes,t.sc,1,t.IN,t.OUT):t.kind==="q3"?this.engine.matmulQ3(r,t.lo,t.hi,t.sc,t.mn,1,t.IN,t.OUT):this.engine.matmulQ4(r,t.nib,t.sc,t.mn,1,t.IN,t.OUT)}embedRow(e){let r=this.D;if(this.embedDtype==="f16")return br(this.embedBytes.subarray(e*r*2,e*r*2+r*2),r);if(this.embedDtype==="f32")return wr(this.embedBytes.subarray(e*r*4,e*r*4+r*4),r);if(this.embedDtype==="q8"){let o=this.vocab*r,u=r/32,c=new Int8Array(this.embedBytes.buffer,this.embedBytes.byteOffset+e*r,r),d=this.embedBytes.subarray(o+e*u*2,o+e*u*2+u*2),f=new DataView(d.buffer,d.byteOffset,d.byteLength),g=new Float32Array(r);for(let p=0;p<u;p++){let h=ge(f.getUint16(p*2,!0));for(let w=0;w<32;w++)g[p*32+w]=c[p*32+w]*h}return g}let t=this.vocab*r,n=r/32,s=t/2,a=t/2+t/32*2,i=new Uint8Array(r/2+n*2*2);return i.set(this.embedBytes.subarray(e*r/2,e*r/2+r/2),0),i.set(this.embedBytes.subarray(s+e*n*2,s+e*n*2+n*2),r/2),i.set(this.embedBytes.subarray(a+e*n*2,a+e*n*2+n*2),r/2+n*2),pe(qe(i,r))}rope(e,r,t){let n=this.HD,s=e.slice();for(let a=0;a<r;a++){let i=a*n;for(let o=0;o<n/2;o++){let u=Math.pow(this.THETA,-2*o/n),c=Math.cos(t*u),d=Math.sin(t*u),f=e[i+o],g=e[i+o+n/2];s[i+o]=f*c-g*d,s[i+o+n/2]=f*d+g*c}}return s}async forwardToken(e){let r=this.D,t=this.pos++,n=this.embedRow(e);for(let s=0;s<this.NL;s++){let a=`blk.${s}.`,i=this.state[s],o=ze(n,this.w.get(a+"attn_norm.weight"),r,this.EPS),u;if(this.convLayer[s]){let p=await this.gemm(a+"shortconv.in_proj.weight",o),h=await this.engine.lfm2ShortConv(p,i.conv,this.w.get(a+"shortconv.conv.weight"),r,this.LC);i.conv=h.state,u=await this.gemm(a+"shortconv.out_proj.weight",h.out)}else{let p=await this.gemm(a+"attn_q.weight",o),h=await this.gemm(a+"attn_k.weight",o),w=await this.gemm(a+"attn_v.weight",o),P=this.w.get(a+"attn_q_norm.weight"),q=this.w.get(a+"attn_k_norm.weight");for(let U=0;U<this.NH;U++)p.set(ze(p.slice(U*this.HD,(U+1)*this.HD),P,this.HD,this.EPS),U*this.HD);for(let U=0;U<this.NKV;U++)h.set(ze(h.slice(U*this.HD,(U+1)*this.HD),q,this.HD,this.EPS),U*this.HD);p=this.rope(p,this.NH,t),h=this.rope(h,this.NKV,t),i.K.push(h),i.V.push(w);let S=new Float32Array(this.NH*this.HD),F=i.K.length,M=1/Math.sqrt(this.HD),z=this.NH/this.NKV;for(let U=0;U<this.NH;U++){let k=Math.floor(U/z),v=U*this.HD,m=k*this.HD,y=new Float32Array(F),b=-1e30;for(let x=0;x<F;x++){let G=0;for(let _=0;_<this.HD;_++)G+=p[v+_]*i.K[x][m+_];y[x]=G*M,y[x]>b&&(b=y[x])}let A=0;for(let x=0;x<F;x++)y[x]=Math.exp(y[x]-b),A+=y[x];for(let x=0;x<F;x++){let G=y[x]/A;for(let _=0;_<this.HD;_++)S[v+_]+=G*i.V[x][m+_]}}u=await this.gemm(a+"attn_output.weight",S)}for(let p=0;p<r;p++)n[p]+=u[p];let c=ze(n,this.w.get(a+"ffn_norm.weight"),r,this.EPS),d=await this.gemm(a+"ffn_gate.weight",c),f=await this.gemm(a+"ffn_up.weight",c);for(let p=0;p<d.length;p++)d[p]=qn(d[p])*f[p];let g=await this.gemm(a+"ffn_down.weight",d);for(let p=0;p<r;p++)n[p]+=g[p]}return n=ze(n,this.w.get("token_embd_norm.weight"),r,this.EPS),this.gemm("head",n)}async classify(e,r){this.reset();let t;for(let s of this.tok.encode(e))t=await this.forwardToken(s);let n=r.map(s=>{let a=this.tok.encode(s);return{label:s,logit:t[a[1]??a[0]]}}).sort((s,a)=>a.logit-s.logit);return{label:n[0].label,scores:n}}banTools(e){for(let r of Me.TOOL_BAN)r<e.length&&(e[r]=-1e30);return e}sampleTok(e,r,t){let{temperature:n=.8,topK:s=40,repeatPenalty:a=1.3}=t,i=new Set(r),o=[];for(let f=0;f<e.length;f++){let g=e[f];i.has(f)&&(g=g>0?g/a:g*a),o.push({i:f,v:g})}o.sort((f,g)=>g.v-f.v),o.length=s;let u=o[0].v,c=0;for(let f of o)f.p=Math.exp((f.v-u)/n),c+=f.p;let d=Math.random()*c;for(let f of o)if(d-=f.p,d<=0)return f.i;return o[0].i}async generate(e,r,t,n,s){this.reset();let a=this.tok.encode(e),i;for(let u of a)i=await this.forwardToken(u);let o=[];for(let u=0;u<r&&!n?.();u++){this.banTools(i);let c;if(s?.sample)c=this.sampleTok(i,o.slice(-64),s);else{c=0;for(let d=1;d<i.length;d++)i[d]>i[c]&&(c=d)}if(this.stops.has(c))break;o.push(c),t&&t(this.tok.decode(o)),i=await this.forwardToken(c)}return o.length?this.tok.decode(o):""}pickFromTopK(e,r){let t=[],n=[];for(let f=0;f<e.ids.length;f++)if(!Me.TOOL_BAN.includes(e.ids[f])){if(e.vals[f]===-1/0)break;t.push(e.ids[f]),n.push(e.vals[f])}if(!t.length)return e.ids[0];if(!r?.sample)return t[0];let{temperature:s=.8,topK:a=40}=r,i=Math.min(a,t.length),o=n[0],u=0,c=new Array(i);for(let f=0;f<i;f++)c[f]=Math.exp((n[f]-o)/s),u+=c[f];let d=Math.random()*u;for(let f=0;f<i;f++)if(d-=c[f],d<=0)return t[f];return t[0]}async generateResident(e,r,t,n,s){if(!this.residentAvailable())return this.generate(e,r,t,n,s);let a="gen",i=s?.repeatPenalty??(s?.sample?1.3:1),o=this.tok.encode(e),u,c=0;for(;c<o.length;){if(n?.())return"";let g=Math.min(c+Me.PREFILL_CHUNK,o.length),p=o.slice(c,g);g<o.length?await this.prefillGpu(p,c,a):u=await this.topKGpu(p,c,a,[],1,48),c=g}let d=o.length,f=[];for(let g=0;g<r&&!n?.();g++){let p=this.pickFromTopK(u,s);if(this.stops.has(p))break;f.push(p),t&&t(this.tok.decode(f)),u=await this.topKGpu([p],d,a,i!==1?[...new Set(f.slice(-64))]:[],i,48),d++}return f.length?this.tok.decode(f):""}};Me.TOOL_BAN=[8,10,12],Me.PREFILL_CHUNK=128;et=Me});function kr(l){if(!l.length)return null;let e=1/0,r=0,t=0;for(let n of l)e=Math.min(e,n.offset),r=Math.max(r,n.offset+n.bytes),t+=n.bytes;return r-e>64<<20||r-e>t*1.5?null:{start:e,end:r}}function Ar(l,e){let r=new Map;for(let s of Object.keys(l)){let a=s.match(/^blk\.(\d+)\./);if(!a)continue;let i=r.get(a[1]);i||r.set(a[1],i=[]),i.push(s)}let t=new Map,n=new Map;return async s=>{let a=l[s];if(!a)throw new Error(`tenseur absent : ${s}`);let i=s.match(/^blk\.(\d+)\./),o=i?r.get(i[1]):void 0,u=o?kr(o.map(w=>l[w])):null;if(!i||!o||!u)return e.bytes(a.offset,a.bytes);let c=i[1],d=t.get(c);d||(d=e.bytes(u.start,u.end-u.start).then(w=>({start:u.start,bytes:w})),t.set(c,d),n.set(c,o.length));let{start:f,bytes:g}=await d,p=g.subarray(a.offset-f,a.offset-f+a.bytes),h=(n.get(c)??1)-1;return h<=0?(t.delete(c),n.delete(c),new Uint8Array(p)):(n.set(c,h),p)}}var At=ae(()=>{"use strict"});var Pr=ae(()=>{"use strict"});function xr(l,e=16){return Math.ceil(l/e)*e}function Tn(l){if(l.length>128||l.includes(".."))return!1;let e=l.split("/");return e.length<=2&&e.every(r=>On.test(r))}function _r(l){let e=a=>{throw new Error(`BRIK: manifeste invalide \u2014 ${a}`)};(!l||typeof l!="object")&&e("ce n'est pas un objet"),l.format!=="brik"&&e(`champ format \xAB ${String(l.format)} \xBB (attendu \xAB brik \xBB)`),(!Se(l.version,1024)||l.version<1)&&e(`version ${String(l.version)}`),(!l.model||typeof l.model.name!="string"||l.model.name.length>512)&&e("champ model.name");let r=l.arch;(!r||typeof r!="object"||typeof r.arch!="string"||r.arch.length>64)&&e("champ arch.arch");for(let[a,i]of[["d",262144],["nHeads",4096],["nKvHeads",4096],["headDim",4096],["ffn",1048576],["blockCount",1024],["vocab",1e7]])Se(r[a],i)||e(`arch.${a} = ${String(r[a])}`);for(let a of["ropeTheta","rmsEps"])(typeof r[a]!="number"||!Number.isFinite(r[a]))&&e(`arch.${a} = ${String(r[a])}`);l.tokenizer&&(l.tokenizer.kind!=="hf-hub"&&l.tokenizer.kind!=="embedded"&&e(`tokenizer.kind \xAB ${String(l.tokenizer.kind)} \xBB`),l.tokenizer.id&&!Tn(l.tokenizer.id)&&e(`tokenizer.id \xAB ${l.tokenizer.id} \xBB (attendu : \xAB auteur/d\xE9p\xF4t \xBB ou une sentinelle sans barre oblique)`)),(!Array.isArray(l.shards)||l.shards.length===0||l.shards.length>Ur)&&e(`${Array.isArray(l.shards)?l.shards.length:"aucun"} shard`);let t=new Map;for(let a of l.shards)Se(a.id,Ur)||e(`shard.id = ${String(a.id)}`),t.has(a.id)&&e(`shard ${a.id} d\xE9clar\xE9 deux fois`),(typeof a.file!="string"||a.file.length>256)&&e(`shard.file du shard ${a.id}`),Se(a.byteLength,tt)||e(`shard.byteLength du shard ${a.id} = ${String(a.byteLength)}`),t.set(a.id,a.byteLength);(!l.tensors||typeof l.tensors!="object")&&e("champ tensors");let n=Object.keys(l.tensors);(n.length===0||n.length>Fn)&&e(`${n.length} tenseurs`);let s=0;for(let a of n){let i=l.tensors[a];(!i||typeof i!="object")&&e(`tenseur ${a}`),Sn.includes(i.dtype)||e(`dtype \xAB ${String(i.dtype)} \xBB du tenseur ${a}`),(!Array.isArray(i.shape)||i.shape.length>8||!i.shape.every(u=>Se(u,2**32)))&&e(`shape du tenseur ${a}`),Se(i.nElems,2**40)||e(`nElems du tenseur ${a}`),(!Se(i.offset,tt)||!Se(i.byteLength,tt))&&e(`offset/byteLength du tenseur ${a}`);let o=t.get(i.shard);o===void 0&&e(`le tenseur ${a} r\xE9f\xE9rence le shard ${String(i.shard)}, absent du manifeste`),i.offset+i.byteLength>o&&e(`le tenseur ${a} d\xE9passe son shard (${i.offset}+${i.byteLength} > ${o})`),s+=i.byteLength}return s>tt&&e(`${s} octets de tenseurs au total`),l}var Ur,Fn,tt,Sn,On,Se,Gr=ae(()=>{"use strict";Ur=4096,Fn=2e5,tt=64*1024*1024*1024,Sn=["f16","f32","q4","q8","q3"],On=/^[A-Za-z0-9._-]+$/;Se=(l,e)=>typeof l=="number"&&Number.isInteger(l)&&l>=0&&l<=e});function Mn(l){return xr(Ee+l)}function Pt(l){if(l.length<Ee)throw new Error("BRIK: fichier tronqu\xE9 (en-t\xEAte)");let e=String.fromCharCode(l[0],l[1],l[2],l[3]);if(e!==Cn)throw new Error(`BRIK: sceau magique absent (${e})`);let r=new DataView(l.buffer,l.byteOffset,l.byteLength),t=r.getUint32(4,!0),n=r.getUint32(8,!0);if(Ee+n>l.length)throw new Error("BRIK: manifeste tronqu\xE9");return{manifest:_r(JSON.parse(new TextDecoder().decode(l.subarray(Ee,Ee+n)))),version:t,dataStart:Mn(n)}}function Br(l){let{manifest:e,version:r,dataStart:t}=Pt(l);return{manifest:e,version:r,dataStart:t,data:l.subarray(t)}}var Cn,Ee,qr=ae(()=>{"use strict";Gr();Cn="BRIK",Ee=12});function Fr(l){let e=[...l].sort((n,s)=>n.id-s.id),r=[],t=0;for(let n of e)r[n.id]=t,t+=n.byteLength;return r}function Sr(l){let e=Fr(l.shards),r={};for(let[n,s]of Object.entries(l.tensors)){let a=Rn[s.dtype];if(!a)throw new Error(`dtype BRIK inconnu pour ${n} : ${s.dtype}`);if(e[s.shard]===void 0)throw new Error(`shard ${s.shard} absent du manifeste (tenseur ${n})`);r[n]={offset:e[s.shard]+s.offset,bytes:s.byteLength,nElems:s.nElems,type:a,shape:s.shape}}let t=l.arch;return{arch:t.arch,config:{d:t.d,nHeads:t.nHeads,nKvHeads:t.nKvHeads,headDim:t.headDim,ffn:t.ffn,blockCount:t.blockCount,ropeTheta:t.ropeTheta,rmsEps:t.rmsEps,attnLogitSoftcap:t.attnLogitSoftcap,finalLogitSoftcap:t.finalLogitSoftcap,attnScale:t.attnScale,act:t.act,rmsGainOnePlus:t.rmsGainOnePlus,embedScale:t.embedScale,rwkv:t.rwkv,lfm2:t.lfm2},tensors:r}}var Rn,Or=ae(()=>{"use strict";Rn={f16:"F16",f32:"F32",q4:"Q4W",q8:"Q8W",q3:"Q3W"}});function jn(l){return Dn[l]}async function Hn(l){let e=l.slice();return Ln(await crypto.subtle.digest("SHA-256",e.buffer))}async function Ut(l,e){let r=jn(l);if(!r)return;if(typeof crypto>"u"||!crypto.subtle){console.warn("[int\xE9grit\xE9] crypto.subtle indisponible (contexte non s\xE9curis\xE9) : empreinte du manifeste NON v\xE9rifi\xE9e.");return}let t=await Hn(e);if(t!==r)throw console.error(`[int\xE9grit\xE9] manifeste inattendu pour ${l}
  attendu : ${r}
  obtenu  : ${t}`),new Error("Ce mod\xE8le ne correspond pas \xE0 celui que Brimkern publie : son manifeste a une empreinte diff\xE9rente de celle attendue. Chargement refus\xE9. Si tu viens de t\xE9l\xE9verser une nouvelle version, relance `npm run brik:digest`.")}var Dn,Ln,Tr=ae(()=>{"use strict";Dn={"https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik":"aca6214b45c294c1d4c51c46aa23acc22cc53cb95a6894c62d2bd0570ca12afe","https://huggingface.co/romainkh14/Qwen2.5-0.5B-Instruct_BRIK/resolve/main/qwen2.5-0.5b-instruct-mixed.brik":"315d2a1cc17b64b029eb24e9668e5c959fd151ae926c9758bddc6a8193e52f6d","https://huggingface.co/romainkh14/Qwen3-4B_BRIK/resolve/main/qwen3-4b-q4.brik":"23f9c0cc66ec21056e656bdaa5cbfda2e93673718ea3ab0dfad19c6e7f583f7d","https://huggingface.co/romainkh14/RWKV-7-G1-0.1B_BRIK/resolve/main/rwkv7-g1-0.1b-q4.brik":"bb8d211e1f95af415b7dca8b0b074c236ebe9d0844f1f372c11eecbcf15fb372","https://huggingface.co/romainkh14/RWKV-7-G1a-0.4B_BRIK/resolve/main/rwkv7-g1a-0.4b-q4.brik":"47e67144bb9dcd41918f3117aa6ee21420ff94f93289c338d8331620d3153b10","https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main/sd-turbo-clip-mixed.brik":"b873aaad23ca70d4e29c0350d124fd6ee0a18470aaf59719f14c9eb9f227b3ac","https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main/sd-turbo-clip-q8.brik":"b3e05c74f8f0327e878787100224983a454e4228d2ae008902875a6256fb2bae","https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main/sd-turbo-unet-q8.brik":"ca3a5c21512542656a8a736c88f67d37a482cacbf499a080c9bf32ca36bf6b0f","https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main/sdxs-unet-light.brik":"42f7c0e82971a558d56548edec947b1ed7d9c0e509d634b51fc29429177e7654","https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main/video-clip-q8.brik":"e81ca57426716237dce2853703c70172a829f78704b7df77c9ee980534c82a76","https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main/video-motion-q8.brik":"e976e13a5bc0858b8277eefed59cc0d77239b5a30ecae68d483e24eb983ae481","https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main/video-unet-q8.brik":"d112b2884afcd038cdbd90bb62ce6b248b404852fb9ce20003b8585927a362b9"},Ln=l=>[...new Uint8Array(l)].map(e=>e.toString(16).padStart(2,"0")).join("")});function zn(l,e,r){return`${l}${l.includes("?")?"&":"?"}__brik=${e}-${r}`}async function En(){try{return await caches.open(Kn)}catch{return null}}async function xt(l,e,r,t){let n=e+r-1,s=await En(),a=zn(l,e,n);if(s){let o=await s.match(a);if(o)return{bytes:new Uint8Array(await o.arrayBuffer()),ranged:!0}}let i;for(let o=0;o<4;o++)try{let u=await fetch(l,{headers:{Range:`bytes=${e}-${n}`},signal:t});if(!u.ok&&u.status!==206)throw new Error(`range fetch ${e}-${n} \xE9chou\xE9 : HTTP ${u.status}`);let c=u.status===206,d=new Uint8Array(await u.arrayBuffer()),f=c?d:d.subarray(e,e+r);if(s&&c)try{await s.put(a,new Response(f,{headers:{"Content-Length":String(f.byteLength)}}))}catch(g){Lr(g)}return{bytes:f,ranged:c}}catch(u){if(t?.aborted)throw u;i=u,o<3&&await new Promise(c=>setTimeout(c,500*2**o))}throw i instanceof Error?i:new Error(String(i))}function Lr(l){Cr||(Cr=!0,console.warn("[cache] \xE9criture refus\xE9e (quota plein ? navigation priv\xE9e ?) : les t\xE9l\xE9chargements de mod\xE8les ne seront PAS r\xE9utilisables \xE0 la prochaine visite. Lib\xE9rez de l'espace via le panneau Stockage.",l))}async function Nn(l){try{let n=await(await caches.open(Mr)).match(l);if(n)return new Uint8Array(await n.arrayBuffer())}catch{}let e=await fetch(l);if(!e.ok)throw new Error(`HTTP ${e.status}`);let r=new Uint8Array(await e.arrayBuffer());try{await(await caches.open(Mr)).put(l,new Response(r.slice(),{headers:{"Content-Length":String(r.byteLength)}}))}catch(t){Lr(t)}return r}function Wn(l,e){return{bytes:async(r,t)=>(await xt(l,e+r,t)).bytes}}function Qn(l){return{bytes:async(e,r)=>l.subarray(e,e+r)}}async function jr(l){let e=await xt(l,0,12);if(!e.ranged){let a=await Nn(l),{manifest:i,data:o}=Br(a);return await Ut(l,Rr(a)),Dr(i,Qn(o))}let r=new DataView(e.bytes.buffer,e.bytes.byteOffset,12).getUint32(8,!0),t=await xt(l,0,12+r),{manifest:n,dataStart:s}=Pt(t.bytes);return await Ut(l,Rr(t.bytes)),Dr(n,Wn(l,s))}function Rr(l){let e=new DataView(l.buffer,l.byteOffset,12).getUint32(8,!0);return l.subarray(12,12+e)}function Dr(l,e){if(l.model?.uiArch==="image")throw new Error("Ce fichier est un BRIK image (UNet/CLIP) : il se charge via la tuile de g\xE9n\xE9ration d'image, pas comme un LLM.");return{source:e,manifest:Sr(l),tokenizerId:l.tokenizer?.id,tokenizer:l.tokenizer,uiArch:l.model?.uiArch,modelName:l.model.name}}var Kn,Cr,Mr,Hr=ae(()=>{"use strict";"use client";At();Pr();qr();Or();Tr();Kn="brik-range-v1";Cr=!1;Mr="brimkern-model-cache"});function $n(l){let e=l.indexOf("<think>");if(e===-1)return l;let r=l.indexOf("</think>",e);return(r===-1?l.slice(0,e):l.slice(0,e)+l.slice(r+8)).trim()}function Kr(l,e,r){l=l.map(n=>n.role==="assistant"?{...n,content:$n(n.content)}:n);let t="";if(e==="deepseek"){t+="<\uFF5Cbegin\u2581of\u2581sentence\uFF5C>",r.trim()&&(t+=r);for(let n of l)n.role==="user"?t+=`<\uFF5CUser\uFF5C>${n.content}`:n.role==="assistant"&&(t+=`<\uFF5CAssistant\uFF5C>${n.content}<\uFF5Cend\u2581of\u2581sentence\uFF5C>`);return t+="<\uFF5CAssistant\uFF5C>",t}if(e==="rwkv7"){r.trim()&&(t+=`System: ${r.trim()}

`);for(let n of l)n.role==="user"?t+=`User: ${n.content.trim()}

`:n.role==="assistant"&&(t+=`Assistant: ${n.content.trim()}

`);return t+="Assistant:",t}if(e==="qwen"||e==="qwen3"||e==="lfm2"||e==="smollm3"){r.trim()&&(t+=`<|im_start|>system
${r}<|im_end|>
`);for(let n of l)t+=`<|im_start|>${n.role}
${n.content}<|im_end|>
`;t+=`<|im_start|>assistant
`}else if(e==="llama3"){t+="<|begin_of_text|>",r.trim()&&(t+=`<|start_header_id|>system<|end_header_id|>

${r}<|eot_id|>`);for(let n of l)t+=`<|start_header_id|>${n.role}<|end_header_id|>

${n.content}<|eot_id|>`;t+=`<|start_header_id|>assistant<|end_header_id|>

`}else if(e==="mistral3"){t+="<s>",r.trim()&&(t+=`[SYSTEM_PROMPT]${r}[/SYSTEM_PROMPT]`);for(let n of l)n.role==="user"?t+=`[INST]${n.content}[/INST]`:n.role==="assistant"&&(t+=`${n.content}</s>`)}else if(e==="gemma"||e==="gemma3"){r.trim()&&(t+=`<start_of_turn>model
${r}<end_of_turn>
`);for(let n of l)t+=`<start_of_turn>${n.role==="assistant"?"model":"user"}
${n.content}<end_of_turn>
`;t+=`<start_of_turn>model
`}return t}var zr=ae(()=>{"use strict"});function In(){let l=[];for(let s=33;s<=126;s++)l.push(s);for(let s=161;s<=172;s++)l.push(s);for(let s=174;s<=255;s++)l.push(s);let e=l.slice(),r=0;for(let s=0;s<256;s++)l.includes(s)||(l.push(s),e.push(256+r),r++);let t=new Array(256),n=new Map;for(let s=0;s<l.length;s++)t[l[s]]=String.fromCodePoint(e[s]),n.set(String.fromCodePoint(e[s]),l[s]);return{enc:t,dec:n}}var Er,rt,Nr=ae(()=>{"use strict";Er="'(?:[sdmt]|ll|ve|re)| ?\\p{L}+| ?\\p{N}+| ?[^\\s\\p{L}\\p{N}]+|\\s+(?!\\S)|\\s+",rt=class l{constructor(e){this.vocab=new Map;this.idToTok=new Map;this.ranks=new Map;this.added=[];this.specialIds=new Set;this.addedRe=null;this.bosIds=[];this.cache=new Map;let r=typeof e=="string"?JSON.parse(e):e;if(r?.model?.type!=="BPE")throw new Error(`BpeTokenizer : model.type ${r?.model?.type} non couvert (BPE uniquement)`);({enc:this.byteEnc,dec:this.byteDec}=In());for(let[i,o]of Object.entries(r.model.vocab))this.vocab.set(i,o),this.idToTok.set(o,i);(r.model.merges??[]).forEach((i,o)=>this.ranks.set(Array.isArray(i)?`${i[0]} ${i[1]}`:i,o));for(let i of r.added_tokens??[])this.added.push(i),this.vocab.set(i.content,i.id),this.idToTok.set(i.id,i.content),i.special&&this.specialIds.add(i.id);if(this.added.length){let i=this.added.map(o=>o.content.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).sort((o,u)=>u.length-o.length);this.addedRe=new RegExp(`(${i.join("|")})`,"g")}let n=l.findSplitPattern(r.pre_tokenizer)??Er;this.splitRe=new RegExp(n,"gu");let s=i=>{if(!i)return null;if(i.type==="TemplateProcessing")return i.single;if(i.type==="Sequence")for(let o of i.processors??[]){let u=s(o);if(u)return u}return null},a=s(r.post_processor);if(Array.isArray(a))for(let i of a)if(i.SpecialToken){let o=this.vocab.get(i.SpecialToken.id);o!==void 0&&this.bosIds.push(o)}else break}static findSplitPattern(e){if(!e)return null;if(e.type==="Split"&&e.pattern?.Regex)return e.pattern.Regex;if(e.type==="ByteLevel"&&e.use_regex!==!1)return Er;if(e.type==="Sequence")for(let r of e.pretokenizers??[]){let t=l.findSplitPattern(r);if(t)return t}return null}bpe(e){let r=this.cache.get(e);if(r)return r;let t=Array.from(e);for(;t.length>1;){let s=-1,a=1/0;for(let i=0;i<t.length-1;i++){let o=this.ranks.get(`${t[i]} ${t[i+1]}`);o!==void 0&&o<a&&(a=o,s=i)}if(s<0)break;t=[...t.slice(0,s),t[s]+t[s+1],...t.slice(s+2)]}let n=[];for(let s of t){let a=this.vocab.get(s);if(a!==void 0)n.push(a);else for(let i of s){let o=this.vocab.get(i);o!==void 0&&n.push(o)}}return this.cache.set(e,n),n}encodeChunk(e){let r=[];for(let t of e.match(this.splitRe)??[]){let n=new TextEncoder().encode(t),s="";for(let a of n)s+=this.byteEnc[a];r.push(...this.bpe(s))}return r}encode(e){let r=[...this.bosIds];if(this.addedRe)for(let t of e.split(this.addedRe)){if(!t)continue;let n=this.vocab.get(t);n!==void 0&&this.added.some(s=>s.content===t)?r.push(n):r.push(...this.encodeChunk(t))}else r.push(...this.encodeChunk(e));return r}decode(e){let r=[];for(let t of e){if(this.specialIds.has(t))continue;let n=this.idToTok.get(t);if(n!==void 0)for(let s of n){let a=this.byteDec.get(s);if(a!==void 0)r.push(a);else for(let i of new TextEncoder().encode(s))r.push(i)}}return new TextDecoder("utf-8",{fatal:!1}).decode(new Uint8Array(r))}}});async function Jn(l,e){let r=new Ze;if(!await r.init())throw Object.assign(new Error("WebGPU is not available in this browser."),{code:"no-webgpu"});r.onLost=g=>{console.warn("[brimkern] device GPU perdu ("+(g?.reason||"unknown")+"): rechargement au prochain appel"),xe.delete(l)},await r.selfValidate(),e("download");let t=await jr(l),n=t.manifest;if(!n?.config?.lfm2){let g=n?.arch??n?.config?.arch??"unknown";throw new Error(`Brimkern SDK v0 runs LFM2 .brik models only: this file's architecture is "${g}". Use the default model (omit \`model\`), or convert/pick an LFM2 .brik. Full model support lives in the app: https://brimkern.com/chat`)}let s=n.tensors["token_embd.weight"],a={arch:{...n.config,arch:"lfm2",vocab:s?s.nElems/n.config.d:0},tensors:Object.fromEntries(Object.entries(n.tensors).map(([g,p])=>[g,{dtype:Yn[p.type]??p.type,shape:p.shape,nElems:p.nElems,shard:0,offset:p.offset,byteLength:p.bytes}])),shards:[{id:0,file:"",byteLength:0}],chat:{template:"chatml",stopTokenIds:[7,2,8,10,12]}},i=Object.values(n.tensors).reduce((g,p)=>g+p.bytes,0),o=0,u=Ar(n.tensors,t.source),c=async g=>{let p=n.tensors[g];if(!p)throw new Error(`tenseur absent : ${g}`);let h=await u(g);return o+=p.bytes,e("download",{loaded:o,total:i}),h};e("tokenizer");let d;try{let g=new rt(t.tokenizer.json);d={encode:p=>g.encode(p),decode:p=>g.decode(p)}}catch(g){console.warn("[brimkern] tokenizer.json non couvert par le BPE bundl\xE9 : repli transformers.js (CDN)",g);let p=await import(Vn),h=new p.PreTrainedTokenizer(JSON.parse(t.tokenizer.json),JSON.parse(t.tokenizer.config));d={encode:w=>Array.from(h(w).input_ids.data,P=>Number(P)),decode:w=>h.decode(w,{skip_special_tokens:!0})}}let f=new et(r,a,c);return e("gpu"),await f.load(d),{core:f,engine:r}}function Ne(l){return l&&(l.startsWith("https://")||/^http:\/\/(localhost|127\.0\.0\.1)[:/]/.test(l))?l:Wr[l||"lfm2.5-230m"]||Wr["lfm2.5-230m"]}function nt(l,e){let r=xe.get(l);if(!r){let t={status:"init",state:"loading",listeners:new Set,promise:null};t.promise=Jn(l,(n,s)=>{t.status=n,t.progress=s,t.listeners.forEach(a=>a(n,s))}).then(n=>(t.state="ready",n)).catch(n=>{throw t.state="error",xe.delete(l),n}),xe.set(l,t),r=t}return e&&(e(r.status,r.progress),r.listeners.add(e),r.promise.finally(()=>r.listeners.delete(e)).catch(()=>{})),r.promise}async function Qr(l,e){let r=await nt(l,e);return r.engine.lost?(xe.delete(l),(await nt(l,e)).core):r.core}async function $r(l,e){let r=await Qr(l);try{return await e(r)}catch(t){let n=xe.get(l);if(!(!n||await n.promise.then(a=>a.engine.lost).catch(()=>!0)))throw t;return console.warn("[brimkern] g\xE9n\xE9ration interrompue par une perte de device : nouvelle tentative"),xe.delete(l),e(await Qr(l))}}function Zn(l,e){let r=l.replace(/<\|[a-z_]+\|>/g,"");if(r=r.replace(/\s*-{2,}\s*(?:E(?:N(?:D(?:\s*O(?:F(?:\s*N(?:O(?:T(?:E(?:S)?)?)?)?)?)?)?)?)?|N(?:O(?:T(?:E(?:S)?)?)?)?)\s*-*\s*$/i,""),e){let t=r.replace(/^\s*(hello|hi|hey|bonjour|salut)\s*[!,.]\s*/i,"");t.trim()&&(r=t)}return r.trimEnd()}async function Ir(l,e,r,t,n,s,a,i=[]){let o=Kr([...i,...e.slice(-Xn)],"lfm2",r),u=i.some(f=>f.role==="assistant")||e.some(f=>f.role==="assistant"),c="";return await(l.residentAvailable?.()?l.generateResident.bind(l):l.generate.bind(l))(o,t,f=>{c=Zn(f,u),s?.(c)},a,{sample:!0,temperature:n,topK:40,repeatPenalty:1.3}),c}var Vn,Wr,Yn,Xn,xe,_t=ae(()=>{"use strict";vr();yr();Hr();At();zr();Nr();Vn="https://esm.sh/@huggingface/transformers@4.2.0",Wr={"lfm2.5-230m":"https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik"},Yn={F16:"f16",F32:"f32",Q4W:"q4",Q8W:"q8",Q3W:"q3"},Xn=12;xe=new Map});var Vr={};nr(Vr,{LocalBackend:()=>We});var We,Gt=ae(()=>{"use strict";_t();We=class{constructor(){this.kind="main"}async preload(e,r){await nt(e,r)}state(e){return xe.get(e)?.state}turn(e,r,t){return $r(e.url,n=>Ir(n,e.history,e.system,e.maxTokens,e.temperature,r,()=>!!t?.aborted,e.pinned))}dispose(){}}});function es(){try{if(typeof document>"u")return"";let l=document.currentScript;if(l?.src)return new URL(l.src,document.baseURI).href}catch{}return""}function Xr(l){Yr=l}function Jr(){return Yr||ts}var ts,Yr,Bt=ae(()=>{"use strict";ts=es(),Yr=""});var Zr={};nr(Zr,{WorkerBackend:()=>qt});var qt,en=ae(()=>{"use strict";Bt();qt=class{constructor(){this.kind="worker";this.seq=0;this.pending=new Map;this.states=new Map;if(typeof Worker>"u")throw new Error("Worker indisponible");let e=Jr();if(!e)throw new Error("URL du script introuvable (import ESM ?) : passez workerUrl");let r=(()=>{try{return location.search}catch{return""}})(),t=`self.__brimkernSearch=${JSON.stringify(r)};importScripts(${JSON.stringify(e)});`,n=new Blob([t],{type:"text/javascript"});this.url=URL.createObjectURL(n),this.worker=new Worker(this.url);let s,a;this.hello=new Promise((i,o)=>{s=i,a=o}),this.worker.onerror=i=>a(new Error(`worker: ${i.message||"\xE9chec de chargement"}`)),this.worker.onmessage=i=>{let o=i.data;if(o.type==="hello"){s();return}let u=this.pending.get(o.id);if(u){if(o.type==="progress"){u.onProgress?.(o.status,o.progress);return}if(o.type==="token"){u.onToken?.(o.text);return}this.pending.delete(o.id),o.type==="error"?u.reject(new Error(o.message)):o.type==="state"?u.resolve(o.state):u.resolve(o.text??"")}}}ready(){return this.hello}send(e,r={}){let t=++this.seq,n=new Promise((s,a)=>{this.pending.set(t,{resolve:s,reject:a,...r}),this.worker.postMessage({...e,id:t})});return{id:t,done:n}}async preload(e,r){await this.hello,this.states.get(e)!=="ready"&&this.states.set(e,"loading");try{await this.send({type:"preload",url:e},{onProgress:r}).done,this.states.set(e,"ready")}catch(t){throw this.states.set(e,"error"),t}}state(e){return this.states.get(e)}async turn(e,r,t){await this.hello;let{id:n,done:s}=this.send({type:"turn",req:e},{onToken:r}),a=()=>this.worker.postMessage({type:"stop",id:n});t?.aborted?a():t?.addEventListener("abort",a,{once:!0});try{let i=await s;return this.states.set(e.url,"ready"),i}finally{t?.removeEventListener("abort",a)}}dispose(){this.worker.terminate(),URL.revokeObjectURL(this.url);for(let e of this.pending.values())e.reject(new Error("worker arr\xEAt\xE9"));this.pending.clear()}}});var rs={};var Ft,st,Re,rn=ae(()=>{"use strict";Gt();Ft=new We,st=new Set,Re=l=>self.postMessage(l);self.onmessage=async l=>{let e=l.data;if(e.type==="stop"){st.add(e.id);return}if(e.type==="state"){Re({type:"state",id:e.id,state:Ft.state(e.url)});return}try{if(e.type==="preload"){await Ft.preload(e.url,(r,t)=>Re({type:"progress",id:e.id,status:r,progress:t})),Re({type:"done",id:e.id});return}if(e.type==="turn"){let r=new AbortController,t=new Proxy(r.signal,{get:(u,c)=>c==="aborted"?st.has(e.id):Reflect.get(u,c)}),n=16,s=0,a=null,i=()=>{a!==null&&(Re({type:"token",id:e.id,text:a}),a=null,s=Date.now())},o=await Ft.turn(e.req,u=>{a=u,Date.now()-s>=n&&i()},t);i(),Re({type:"done",id:e.id,text:o}),st.delete(e.id);return}}catch(r){st.delete(e.id),Re({type:"error",id:e.id,message:r instanceof Error?r.message:String(r)})}};Re({type:"hello"})});var gn=new Set(["avec","pour","dans","les","des","une","est","sur","par","que","qui","quoi","comment","pourquoi","quand","vous","nous","votre","notre","mais","plus","tout","tous","cette","sont","avez","puis","faire","fait","fais","font","the","and","for","with","what","who","how","why","when","about","your","our","you","are","can","does","did","this","that","from","have","je","tu","il","elle","on","ils","elles","du","de","la","le","un","en","au","aux","ce","ces","cet","se","sa","son","ses","mon","ma","mes","ton","ta","tes","me","te","ne","pas","si","ou","et","ni","car","donc","or","to","in","at","it","is","be","as","an","by","do","no","so","my","he","we","us","me","am","was","were","been","quel","quelle","quels","quelles","which","where","bonjour","salut","hello","merci"]),Ve=new Map,pn=2e4;function pt(l){let e=Ve.get(l);if(e!==void 0)return e;let r=hn(l);return Ve.size>=pn&&Ve.clear(),Ve.set(l,r),r}function hn(l){let e=l.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");return e.length<=3||(e=e.replace(/(?:ments?|ements?|eront|erait|aient|antes?|ances?|euses?|ables?|tions?|sions?|eaux|eurs?|euse|ique|iques|istes?|ings?|ness|able|ible|less|full?)$/,""),e.length>3&&(e=e.replace(/(?:er|ir|ez|ent|ais|ait|ant|ees?|es?|ed|ly|s)$/,""))),e}function Ye(l){let e=(l.toLowerCase().match(/[\p{L}\p{N}]+/gu)??[]).filter(r=>gn.has(r)?!1:/\d/.test(r)?!0:r.length>=2);return[...new Set(e)]}function ar(l,e=600){let r=[];return l.forEach((t,n)=>{let s=(t.title||"").trim(),a=(t.text||"").split(/\n\s*\n+/).map(u=>u.trim()).filter(Boolean),i="",o=()=>{i.trim()&&r.push({title:s,text:i.trim(),doc:n}),i=""};for(let u of a){if(u.length>e*1.6){o();let c=u.split(/(?<=[.!?])\s+/),d="";for(let f of c)d&&(d+" "+f).length>e?(r.push({title:s,text:d.trim(),doc:n}),d=f):d=d?`${d} ${f}`:f;d.trim()&&r.push({title:s,text:d.trim(),doc:n});continue}i&&(i+`

`+u).length>e&&o(),i=i?`${i}

${u}`:u}o()}),r}var sr=new WeakMap;function ir(l){let e=new Set;for(let r of l)r.length>=4&&e.add(r.slice(0,4));return e}function mn(l){let e=sr.get(l);if(e)return e;let r=`${l.title} ${l.text}`.toLowerCase(),t=l.title.toLowerCase(),n=new Set(Ye(r).map(pt)),s=new Set(Ye(t).map(pt)),a={hay:r,titre:t,docStems:n,titreStems:s,docPrefix4:ir(n),titrePrefix4:ir(s)};return sr.set(l,a),a}function vn(l,e,r){if(!l.length)return 0;let t=mn(e),n=0,s=0;for(let a of l){let i=r.get(a)??1;s+=i;let o=pt(a),u=o.length>=4?o.slice(0,4):null;if(t.hay.includes(a)||t.docStems.has(o)||u!==null&&t.docPrefix4.has(u)){let d=t.titre.includes(a)||t.titreStems.has(o)||u!==null&&t.titrePrefix4.has(u);n+=i*(d?2.2:1)}}return s?n/s:0}function bn(l){let e=new Map;for(let n of l)for(let s of Ye(`${n.title} ${n.text}`))e.set(s,(e.get(s)??0)+1);let r=new Map,t=Math.max(1,l.length);for(let[n,s]of e)r.set(n,Math.log(1+t/s));return r}function or(l,e,r=1200,t=3,n=.22,s=.5){let a=Ye(l);if(!a.length||!e.length)return[];let i=bn(e),o=e.map(p=>({c:p,s:vn(a,p,i)})).filter(p=>p.s>=n).sort((p,h)=>h.s-p.s),u=o.length?o[0].s*s:0,c=o.filter(p=>p.s>=u),d=[],f=new Set,g=r;for(let{c:p,s:h}of c)d.length>=t||p.text.length>g||f.has(p.doc)||(d.push({chunk:p,score:h}),f.add(p.doc),g-=p.text.length);for(let{c:p,s:h}of c){if(d.length>=t)break;d.some(w=>w.chunk===p)||p.text.length>g||(d.push({chunk:p,score:h}),g-=p.text.length)}return d}function wn(l){let e=l.trim().toLowerCase().replace(/[!?.,;:\-_]/g,"").trim();return/^(hi|hello|hey|greetings|good\s+(morning|afternoon|evening|day)|bonjour|salut|coucou|bonsoir|how\s+are\s+you|how\s+are\s+you\s+doing|ça\s+va|ca\s+va|comment\s+vas?-tu|comment\s+allez-vous|who\s+are\s+you|qui\s+es-tu|merci|thanks|thank\s+you|what\s+can\s+you\s+do|que\s+peux-tu\s+faire)$/i.test(e)}function ht(l,e,r=!1){if(e&&wn(e))return"";if(!l.length)return r?`

Aucune fiche de r\xE9f\xE9rence ne correspond \xE0 cette question. Dis que tu n\u2019as pas cette information : ne devine pas.`:`

No reference note matches this question. Say that you do not have this information: do not guess.`;let t=l.map((s,a)=>`[${a+1}]${s.title?` ${s.title}`:""}
${s.text}`).join(`

`);return`

${r?"R\xE9ponds UNIQUEMENT \xE0 partir des fiches ci-dessous, en fran\xE7ais. Reprends leurs chiffres exactement. Si la r\xE9ponse n\u2019y est pas, dis que tu n\u2019as pas cette information : n\u2019invente jamais pour combler.":"Answer using ONLY the reference notes below. Copy their figures exactly. If the answer is not in them, say you do not have that information: never fill the gap with what you assume."}

--- NOTES ---
${t}
--- END OF NOTES ---`}function ur(l){let e=Array.isArray(l)?l:[l],r=[];for(let t of e)typeof t=="string"&&t.trim()?r.push({text:t}):t&&typeof t=="object"&&typeof t.text=="string"&&t.text.trim()&&r.push({title:t.title,text:t.text});return r}_t();async function tn(l){let{LocalBackend:e}=await Promise.resolve().then(()=>(Gt(),Vr));if(l!==!0)return new e;try{let{WorkerBackend:r}=await Promise.resolve().then(()=>(en(),Zr)),t=new r;return await t.ready(),t}catch(r){return console.warn("[brimkern] Web Worker indisponible : inf\xE9rence sur le thread principal",r),new e}}Bt();var ns=typeof self<"u"&&typeof self.importScripts=="function"&&typeof document>"u";ns&&Promise.resolve().then(()=>(rn(),rs));var at=null,Ot=null,St;function Qe(){return at||(at=tn(St).then(l=>(Ot=l,l))),at}var ss=()=>Ot?.kind??"pending";function Tt(l){if(l.workerUrl&&Xr(l.workerUrl),l.worker!==void 0){if(at&&St!==l.worker){console.warn("[brimkern] option `worker` ignor\xE9e : le backend est d\xE9j\xE0 d\xE9marr\xE9 et partag\xE9 par la page.");return}St=l.worker}}var is=`
Answer briefly and honestly. If you do not know something, say so: never invent facts or details.
You have no tools and no internet access: never emit tool calls, reply in plain text only.`;function sn(){let l=new Map;return{on(e,r){let t=l.get(e);return t||l.set(e,t=new Set),t.add(r),()=>{t.delete(r)}},emit(e,...r){let t=l.get(e);if(t)for(let n of[...t])try{n(...r)}catch(s){console.error("[brimkern] \xE9couteur `"+e+"` a lev\xE9 :",s)}},clear(){l.clear()}}}function $e(l){if(!Array.isArray(l))return[];let e=[];for(let r of l){let t=r?.role,n=r?.content;(t==="user"||t==="assistant")&&typeof n=="string"&&n.trim()&&e.push({role:t,content:n})}return e}function an(l){return l.lang?l.lang==="fr":l.system?/[àâäéèêëîïôöùûüç]|\b(?:bonjour|salut|vous|tu|réponds|conseiller|boutique|aide|aidez|client|magasin)\b/i.test(l.system):!1}var as={en:{ouvrir:"Open the chat",fermer:"Close",placeholder:"Type a message\u2026",note:"Local AI \u2014 runs on your GPU, nothing is sent anywhere.",erreur:"Error: ",vide:"Sorry, I can only answer in plain text here: could you rephrase?",mo:"MB",sources:"Sources:",phases:{init:"Starting up\u2026",download:"downloading the model\u2026",tokenizer:"tokenizer\u2026",gpu:"weights to the GPU\u2026"},erreurs:{"no-webgpu":"This browser does not support WebGPU: the local assistant cannot run here."}},fr:{ouvrir:"Ouvrir le chat",fermer:"Fermer",placeholder:"\xC9cris un message\u2026",note:"IA locale \u2014 tourne sur votre GPU, aucune donn\xE9e envoy\xE9e.",erreur:"Erreur : ",vide:"D\xE9sol\xE9, je ne peux r\xE9pondre qu\u2019en texte simple ici : pouvez-vous reformuler ?",mo:"Mo",sources:"Sources :",phases:{init:"initialisation\u2026",download:"t\xE9l\xE9chargement du mod\xE8le\u2026",tokenizer:"tokenizer\u2026",gpu:"poids sur le GPU\u2026"},erreurs:{"no-webgpu":"Ce navigateur ne prend pas en charge WebGPU : l\u2019assistant local ne peut pas tourner ici."}}},os=(l,e)=>l.phases[e]??e,nn=(l,e)=>e?.code&&l.erreurs[e.code]||e?.message||String(e);function ot(l){let e=(l.system||"You are a helpful assistant.")+is,r=i=>i.flatMap(o=>[{role:"user",content:o.user},{role:"assistant",content:o.assistant}]);if(!l.knowledge)return{system:()=>e,userTurn:i=>({text:i,sources:[]}),pinned:r(l.examples||[])};let t=ar(ur(l.knowledge)),n=l.knowledgeBudget??1200,s=an(l),a=s?e+`

Le message utilisateur peut inclure des fiches de r\xE9f\xE9rence entre des balises ---. Dans ce cas, r\xE9ponds uniquement \xE0 partir de ces fiches en citant fid\xE8lement leurs informations dans la langue de la question. Si aucune note ne correspond, indique poliment que tu n\u2019as pas cette information.`:e+`

The user message may include reference notes between --- markers. When it does, answer from those notes and quote their figures exactly. When it says no note matches, say you do not have that information.`;return{system:()=>a,userTurn:i=>{let o=or(i,t,n),u=ht(o.map(c=>c.chunk),i,s).trim();return{text:u?`${u}

Question: ${i}`:i,sources:u?o.map(({chunk:c,score:d})=>({title:c.title,text:c.text,score:d,doc:c.doc})):[]}},pinned:r([...us(s),...l.examples||[]])}}function us(l=!1){let e=(t,n)=>({title:t,text:n,doc:0}),r=(t,n)=>`${ht(t,void 0,l).trim()}

Question: ${n}`;return l?[{user:"Bonjour !",assistant:"Bonjour ! Comment puis-je vous aider ?"},{user:r([e("Guide des tailles",`Tableau des correspondances :
- Pointure EU 38 : 24,0 cm (US 6,5)
- Pointure EU 39 : 24,5 cm (US 7,0)
- Pointure EU 41 : 26,0 cm (US 8,0)`)],"Je fais du 41, quelle taille en cm ?"),assistant:"La pointure 41 correspond \xE0 26,0 cm."},{user:r([e("Retours","Les retours sont gratuits sous 14 jours. Le remboursement est effectu\xE9 sous 3 jours ouvr\xE9s.")],"Combien de temps pour retourner un article ?"),assistant:"Vous disposez de 14 jours pour retourner un article."},{user:r([],"Qui a gagn\xE9 la Coupe du Monde 1998 ?"),assistant:"Je n\u2019ai pas cette information dans mes fiches."}]:[{user:"Hello!",assistant:"Hello! How can I help you today?"},{user:r([e("Size guide",`Size conversions:
- Size EU 38: 24.0 cm (US 6.5)
- Size EU 39: 24.5 cm (US 7.0)
- Size EU 41: 26.0 cm (US 8.0)`)],"I wear a 41, what is that in cm?"),assistant:"A size 41 is 26.0 cm."},{user:r([e("Returns","Returns are free within 14 days. Refunds are issued within 3 working days.")],"How long do I have to return an item?"),assistant:"You have 14 days to return an item."},{user:r([],"Who won the 1998 World Cup?"),assistant:"I do not have that information in my notes."}]}function on(l={}){Tt(l);let e=Ne(l.model),r=l.maxTokens||220,t=l.knowledge,n=ot(l),s=$e(l.history),a=[],i=sn(),o=!1,u=!1,c=!1,d=()=>l.temperature??(t?.25:.55),f=g=>{if(o)throw new Error(`brimkern: ${g} impossible pendant une g\xE9n\xE9ration`)};return{async ask(g,p={}){if(u)throw new Error("session d\xE9truite");if(o)throw new Error("g\xE9n\xE9ration d\xE9j\xE0 en cours sur cette session");o=!0,s.push({role:"user",content:g}),i.emit("message",{role:"user",content:g});try{let{text:h,sources:w}=n.userTurn(g);a=w,p.onSources?.(w);let P=[...s.slice(0,-1),{role:"user",content:h}],q=await Qe();await q.preload(e,(M,z)=>i.emit("progress",M,z)),c||(c=!0,i.emit("ready"));let S={url:e,history:P,system:n.system(g),maxTokens:r,temperature:d(),pinned:n.pinned},F=await q.turn(S,p.onToken,p.signal);return p.signal?.aborted?(s.pop(),""):(s.push({role:"assistant",content:F}),i.emit("message",{role:"assistant",content:F,sources:w}),F)}catch(h){throw s.pop(),i.emit("error",h instanceof Error?h:new Error(String(h))),h}finally{o=!1}},reset(){s=[],a=[]},destroy(){u=!0,s=[],a=[],i.clear()},get history(){return s.slice()},get lastSources(){return a.slice()},setHistory(g){f("setHistory"),s=$e(g)},setKnowledge(g){f("setKnowledge"),t=g,n=ot({...l,knowledge:g}),a=[]},on:i.on}}function cs(){if(document.getElementById("bk-style"))return;let l=document.createElement("style");l.id="bk-style",l.textContent=`
  .bk-fab{position:fixed;right:20px;bottom:20px;width:56px;height:56px;border-radius:16px;background:var(--bk-accent);color:#fff;border:none;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.25);font-size:24px;z-index:2147483000;display:flex;align-items:center;justify-content:center;transition:transform .15s}
  .bk-fab:hover{transform:translateY(-2px)}
  .bk-panel{position:fixed;right:20px;bottom:88px;width:360px;max-width:calc(100vw - 40px);height:520px;max-height:calc(100vh - 120px);background:#f2efe8;border:1px solid #e0dccf;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.28);z-index:2147483000;display:none;flex-direction:column;overflow:hidden;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;color:#1a1a1a}
  .bk-panel.bk-open{display:flex}
  .bk-hd{padding:12px 14px;background:#fff;border-bottom:1px solid #ece8dd;display:flex;align-items:center;gap:8px;font-weight:700;font-size:14px}
  .bk-hd .bk-dot{width:8px;height:8px;border-radius:50%;background:var(--bk-accent)}
  .bk-hd .bk-x{margin-left:auto;background:none;border:none;cursor:pointer;color:#8b887f;font-size:18px;line-height:1}
  .bk-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px}
  .bk-m{max-width:82%;padding:8px 12px;border-radius:12px;font-size:14px;line-height:1.45;white-space:pre-wrap;word-wrap:break-word}
  .bk-m.bk-u{align-self:flex-end;background:var(--bk-accent);color:#fff;border-bottom-right-radius:4px}
  .bk-m.bk-a{align-self:flex-start;background:#fff;border:1px solid #ece8dd;border-bottom-left-radius:4px}
  .bk-src{align-self:flex-start;max-width:82%;margin-top:-6px;font-size:10.5px;line-height:1.4;color:#8b887f}
  .bk-src b{font-weight:600;color:#6f6c64}
  .bk-foot{padding:10px;border-top:1px solid #ece8dd;background:#fff;display:flex;gap:8px}
  .bk-in{flex:1;border:1px solid #e0dccf;border-radius:10px;padding:9px 11px;font-size:14px;font-family:inherit;background:#fff;color:#1a1a1a;resize:none;outline:none}
  .bk-in:focus{border-color:var(--bk-accent)}
  .bk-send{background:var(--bk-accent);color:#fff;border:none;border-radius:10px;padding:0 14px;cursor:pointer;font-size:14px}
  .bk-send:disabled{opacity:.5;cursor:default}
  .bk-note{font-size:10.5px;color:#8b887f;text-align:center;padding:4px 8px 8px}
  `,document.head.appendChild(l)}function ls(l){if(!l)return"#c72c1e";if(/^#[0-9a-fA-F]{3,8}$/.test(l))return l;try{if(typeof CSS<"u"&&CSS.supports("color",l)&&!/[{};()]/.test(l))return l}catch{}return"#c72c1e"}function ds(l,e){let r=l.knowledge,t=ot(l),n=as[an(l)?"fr":"en"],s=ls(l.accent),a=l.title||"Assistant",i=l.maxTokens||220;cs();let o=document.createElement("button");o.className="bk-fab",o.setAttribute("aria-label",n.ouvrir),o.textContent="\u{1F4AC}";let u=document.createElement("div");u.className="bk-panel",o.style.setProperty("--bk-accent",s),u.style.setProperty("--bk-accent",s),u.innerHTML=`
    <div class="bk-hd"><span class="bk-dot"></span><span>${it(a)}</span><button class="bk-x" aria-label="${it(n.fermer)}">\xD7</button></div>
    <div class="bk-msgs"></div>
    <div class="bk-foot"><textarea class="bk-in" rows="1" placeholder="${it(n.placeholder)}"></textarea><button class="bk-send">\u2191</button></div>
    <div class="bk-note">${it(n.note)}</div>`,document.body.appendChild(o),document.body.appendChild(u);let c=u.querySelector(".bk-msgs"),d=u.querySelector(".bk-in"),f=u.querySelector(".bk-send"),g=u.querySelector(".bk-x"),p=$e(l.history),h=!1,w=!1,P=!1,q=new AbortController,S=(y,b)=>{let A=document.createElement("div");return A.className=`bk-m ${y==="user"?"bk-u":"bk-a"}`,A.textContent=b,c.appendChild(A),c.scrollTop=c.scrollHeight,A},F=y=>{if(!l.showSources||!y.length)return;let b=document.createElement("div");b.className="bk-src";let A=document.createElement("b");A.textContent=`${n.sources} `,b.appendChild(A),b.appendChild(document.createTextNode(y.map((x,G)=>`[${G+1}] ${x.title||x.text.slice(0,40).replace(/\s+/g," ").trim()+"\u2026"}`).join(" \xB7 "))),c.appendChild(b),c.scrollTop=c.scrollHeight},M=()=>{c.textContent="";for(let y of p)S(y.role,y.content)};p.length?M():l.greeting&&(p.push({role:"assistant",content:l.greeting}),S("assistant",l.greeting));let z=Ne(l.model),U=()=>{if(!w){w=!0;let y=S("assistant",n.phases.init);y.classList.add("bk-status"),Qe().then(b=>b.preload(z,(A,x)=>{e.emit("progress",A,x);let G=os(n,A);y.textContent=x?.total?`${G} ${Math.round(x.loaded/1048576)} / ${Math.round(x.total/1048576)} ${n.mo}`:G})).then(()=>{y.remove(),e.emit("ready")}).catch(b=>{y.textContent=n.erreur+nn(n,b),w=!1,e.emit("error",b instanceof Error?b:new Error(String(b)))})}return Qe()},k=async y=>{h=!0,f.disabled=!0,p.push({role:"user",content:y}),S("user",y),e.emit("message",{role:"user",content:y});let b=S("assistant","\u2026");try{await U();let{text:A,sources:x}=t.userTurn(y),G=[...p.slice(0,-1),{role:"user",content:A}],_={url:z,history:G,system:t.system(y),maxTokens:i,temperature:r?.25:.55,pinned:t.pinned},B=await(await Qe()).turn(_,C=>{b.textContent=C||"\u2026",c.scrollTop=c.scrollHeight},q.signal);return P?"":(B||(B=n.vide),b.textContent=B,p.push({role:"assistant",content:B}),F(x),e.emit("message",{role:"assistant",content:B,sources:x}),B)}catch(A){throw b.textContent=n.erreur+nn(n,A),e.emit("error",A instanceof Error?A:new Error(String(A))),A}finally{h=!1,f.disabled=!1,P||d.focus()}},v=()=>{let y=d.value.trim();!y||h||P||(d.value="",k(y).catch(()=>{}))},m=y=>{P||u.classList.contains("bk-open")!==y&&(u.classList.toggle("bk-open",y),y&&(d.focus(),U()),e.emit(y?"open":"close"))};return o.onclick=()=>m(!u.classList.contains("bk-open")),g.onclick=()=>m(!1),f.onclick=v,d.onkeydown=y=>{y.key==="Enter"&&!y.shiftKey&&(y.preventDefault(),v())},{open:()=>m(!0),close:()=>m(!1),toggle:()=>m(!u.classList.contains("bk-open")),ask(y){if(P)return Promise.reject(new Error("brimkern: widget d\xE9mont\xE9"));let b=String(y??"").trim();return b?h?Promise.reject(new Error("g\xE9n\xE9ration d\xE9j\xE0 en cours sur ce widget")):(m(!0),k(b)):Promise.reject(new Error("brimkern: ask() attend une question non vide"))},destroy(){P||(P=!0,q.abort(),o.onclick=null,g.onclick=null,f.onclick=null,d.onkeydown=null,o.remove(),u.remove(),p=[])},setKnowledge(y){r=y,t=ot({...l,knowledge:y})},setHistory(y){if(h)throw new Error("brimkern: setHistory impossible pendant une g\xE9n\xE9ration");p=$e(y),M()},history:()=>p.slice(),el:u}}function it(l){return l.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}var fs=(l={})=>{let e=sn(),r=null,t=!1,n=!1,s=[],a=o=>{r?o(r):!t&&!n&&s.push(o)},i=()=>{if(!(n||r)){r=ds(l,e);for(let o of s.splice(0))o(r)}};return typeof window>"u"||typeof document>"u"?(t=!0,console.warn("[brimkern] embed() ignor\xE9 : aucun DOM (rendu serveur ?). Appelez-le dans un effet client.")):(Tt(l),document.body?i():window.addEventListener("DOMContentLoaded",i,{once:!0})),{open:()=>a(o=>o.open()),close:()=>a(o=>o.close()),toggle:()=>a(o=>o.toggle()),ask(o){return t?Promise.reject(new Error("brimkern: ask() sans DOM (rendu serveur ?)")):n?Promise.reject(new Error("brimkern: widget d\xE9mont\xE9")):new Promise((u,c)=>a(d=>d.ask(o).then(u,c)))},destroy(){n=!0,s.length=0,r?.destroy(),r=null,e.clear()},setKnowledge:o=>a(u=>u.setKnowledge(o)),setHistory:o=>a(u=>u.setHistory(o)),get history(){return r?r.history():$e(l.history)},get el(){return r?r.el:null},on:e.on}};var gs=async l=>{if(typeof l!="object"||l===null||typeof l.prompt!="string")throw new TypeError(`Brimkern.generate expects a single object: generate({ prompt: "\u2026", model?, system? }). Received ${typeof l}${typeof l=="object"&&l?" without a `prompt` string":""}.`);return on(l).ask(l.prompt,{onToken:l.onToken,signal:l.signal,onSources:l.onSources})},ps=(l={})=>(Tt(l),typeof navigator<"u"&&"gpu"in navigator?Qe().then(e=>e.preload(Ne(l.model),l.onProgress)).then(()=>!0).catch(()=>!1):Promise.resolve(!1)),hs=l=>typeof navigator>"u"||!("gpu"in navigator)?"unavailable":Ot?.state(Ne(l))??"idle";typeof window<"u"&&(window.Brimkern={embed:fs,createSession:on,generate:gs,preload:ps,status:hs,runtime:ss});})();
