"use strict";(()=>{var un=Object.defineProperty;var ae=(l,e,r)=>()=>{if(r)throw r[0];try{return l&&(e=l(l=0)),e}catch(t){throw r=[t],t}};var er=(l,e)=>{for(var r in e)un(l,r,{get:e[r],enumerable:!0})};function Be(l){let e=new Float32Array(1),r=new Uint32Array(e.buffer);e[0]=l;let t=r[0],n=t>>16&32768,i=(t>>23&255)-127+15,a=t&8388607;return i<=0?n:i>=31?n|31743:(a=(a>>13)+(a>>12&1),a===1024&&(a=0,i+=1),n|i<<10|a&1023)}function pe(l){let e=l>>15&1,r=l>>10&31,t=l&1023,n;return r===0?n=t*59604645e-15:r===31?n=t?NaN:1/0:n=(1+t/1024)*2**(r-15),e===1?-n:n}var je=ae(()=>{"use strict"});function ke(l){let e=l.length;if(e%ye!==0)throw new Error(`q4web: length ${e} not a multiple of ${ye}`);let r=e/ye,t=new Uint8Array(e/2),n=new Uint16Array(r),i=new Uint16Array(r);for(let a=0;a<r;a++){let s=a*ye,o=1/0,u=-1/0;for(let m=0;m<ye;m++){let b=l[s+m];b<o&&(o=b),b>u&&(u=b)}let c=(u-o)/15||1e-8,d=Be(c),f=Be(o);n[a]=d,i[a]=f;let p=pe(d)||1e-8,g=pe(f);for(let m=0;m<ye;m++){let b=Math.round((l[s+m]-g)/p);b=b<0?0:b>15?15:b;let k=s+m;(m&1)===0?t[k>>1]=b:t[k>>1]|=b<<4}}return{nibbles:t,scales:n,mins:i,nElems:e}}function qe(l,e){let r=e/ye,t=e/2,n=l.slice(0,t),i=new Uint16Array(r),a=new Uint16Array(r),s=new DataView(l.buffer,l.byteOffset);for(let o=0;o<r;o++)i[o]=s.getUint16(t+o*2,!0);for(let o=0;o<r;o++)a[o]=s.getUint16(t+r*2+o*2,!0);return{nibbles:n,scales:i,mins:a,nElems:e}}function ge(l){let e=new Float32Array(l.nElems),r=l.nElems/ye;for(let t=0;t<r;t++){let n=pe(l.scales[t]),i=pe(l.mins[t]),a=t*ye;for(let s=0;s<ye;s++){let o=a+s,u=l.nibbles[o>>1],c=(s&1)===0?u&15:u>>4;e[o]=c*n+i}}return e}var ye,pt=ae(()=>{"use strict";je();ye=32});function Pe(l){let e=l.length;if(e%Ae!==0)throw new Error(`q8web: length ${e} not a multiple of ${Ae}`);let r=e/Ae,t=new Int8Array(e),n=new Uint16Array(r);for(let i=0;i<r;i++){let a=i*Ae,s=0;for(let d=0;d<Ae;d++){let f=Math.abs(l[a+d]);f>s&&(s=f)}let o=s/127||1e-8,u=Be(o);n[i]=u;let c=pe(u)||1e-8;for(let d=0;d<Ae;d++){let f=Math.round(l[a+d]/c);f=f<-127?-127:f>127?127:f,t[a+d]=f}}return{codes:t,scales:n,nElems:e}}function Oe(l,e){let r=e/Ae,t=new Int8Array(l.buffer.slice(l.byteOffset,l.byteOffset+e)),n=new Uint16Array(r),i=new DataView(l.buffer,l.byteOffset);for(let a=0;a<r;a++)n[a]=i.getUint16(e+a*2,!0);return{codes:t,scales:n,nElems:e}}function me(l){let e=new Float32Array(l.nElems),r=l.nElems/Ae;for(let t=0;t<r;t++){let n=pe(l.scales[t]),i=t*Ae;for(let a=0;a<Ae;a++)e[i+a]=l.codes[i+a]*n}return e}var Ae,gt=ae(()=>{"use strict";je();Ae=32});function ar(l){let e=l.length;if(e%Ue!==0)throw new Error(`q3web: length ${e} not a multiple of ${Ue}`);let r=e/Ue,t=new Uint32Array(e/16),n=new Uint32Array(e/32),i=new Uint16Array(r),a=new Uint16Array(r);for(let s=0;s<r;s++){let o=s*Ue,u=1/0,c=-1/0;for(let b=0;b<Ue;b++){let k=l[o+b];k<u&&(u=k),k>c&&(c=k)}let d=(c-u)/7||1e-8,f=Be(d),p=Be(u);i[s]=f,a[s]=p;let g=pe(f)||1e-8,m=pe(p);for(let b=0;b<Ue;b++){let k=Math.round((l[o+b]-m)/g);k=k<0?0:k>7?7:k;let B=o+b;t[B>>4]|=(k&3)<<(B&15)*2,n[B>>5]|=k>>2<<(B&31)}}return{lo:t,hi:n,scales:i,mins:a,nElems:e}}function De(l,e){let r=e/Ue,t=e/16,n=e/32,i=t*4,a=n*4,s=new DataView(l.buffer,l.byteOffset),o=new Uint32Array(t),u=new Uint32Array(n),c=new Uint16Array(r),d=new Uint16Array(r);for(let g=0;g<t;g++)o[g]=s.getUint32(g*4,!0);for(let g=0;g<n;g++)u[g]=s.getUint32(i+g*4,!0);let f=i+a,p=f+r*2;for(let g=0;g<r;g++)c[g]=s.getUint16(f+g*2,!0);for(let g=0;g<r;g++)d[g]=s.getUint16(p+g*2,!0);return{lo:o,hi:u,scales:c,mins:d,nElems:e}}function Le(l){let e=new Float32Array(l.nElems),r=l.nElems/Ue;for(let t=0;t<r;t++){let n=pe(l.scales[t]),i=pe(l.mins[t]),a=t*Ue;for(let s=0;s<Ue;s++){let o=a+s,u=l.lo[o>>4]>>(o&15)*2&3|(l.hi[o>>5]>>(o&31)&1)<<2;e[o]=u*n+i}}return e}var Ue,ht=ae(()=>{"use strict";je();Ue=32});var or,ur,cr=ae(()=>{"use strict";or={matmul:`
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
		}`},ur=`
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
	}`});var Ye,lr=ae(()=>{"use strict";Ye=class{constructor(e){this.sets=[];this.cur=0;this.next=0;this.names=[];this.acc=new Map;this.dropped=0;this.pending=[];this.fenetre=0;this.device=e;let r=globalThis;for(let t=0;t<2;t++)this.sets.push({qs:e.createQuerySet({type:"timestamp",count:4096}),resolve:e.createBuffer({size:4096*8,usage:r.GPUBufferUsage.QUERY_RESOLVE|r.GPUBufferUsage.COPY_SRC}),read:e.createBuffer({size:4096*8,usage:r.GPUBufferUsage.COPY_DST|r.GPUBufferUsage.MAP_READ}),busy:!1})}slot(e){if(this.next+2>4096&&(this.rotate(),this.next+2>4096))return this.dropped++,null;let r=this.sets[this.cur];if(r.busy)return this.dropped++,null;let t=this.next;return this.next+=2,this.names.push(e),{querySet:r.qs,beginningOfPassWriteIndex:t,endOfPassWriteIndex:t+1}}rotate(){let e=this.cur,r=this.sets[e],t=this.names,n=this.next;if(this.cur=(this.cur+1)%2,this.next=0,this.names=[],!n||r.busy)return;r.busy=!0;let i=this.fenetre,a=this.device.createCommandEncoder();a.resolveQuerySet(r.qs,0,n,r.resolve,0),a.copyBufferToBuffer(r.resolve,0,r.read,0,n*8),this.device.queue.submit([a.finish()]);let s=globalThis,o=r.read.mapAsync(s.GPUMapMode.READ,0,n*8).then(()=>{let u=new BigUint64Array(r.read.getMappedRange(0,n*8).slice(0));if(r.read.unmap(),i===this.fenetre)for(let c=0;c<t.length;c++){let d=u[c*2],f=u[c*2+1];if(!d||!f||f<=d)continue;let p=Number(f-d),g=this.acc.get(t[c]);g?(g.calls++,g.ns+=p):this.acc.set(t[c],{calls:1,ns:p})}}).catch(()=>{}).finally(()=>{r.busy=!1});this.pending.push(o)}async report(){this.rotate();let e=this.pending;this.pending=[],await Promise.all(e);let r=0,t=0;for(let i of this.acc.values())r+=i.ns,t+=i.calls;return{passes:[...this.acc.entries()].map(([i,a])=>({name:i,calls:a.calls,totalMs:a.ns/1e6,meanUs:a.ns/a.calls/1e3,share:r?a.ns/r:0,reliable:a.calls>=50})).sort((i,a)=>a.totalMs-i.totalMs),totalMs:r/1e6,samples:t,dropped:this.dropped,quantumUs:100}}reset(){this.fenetre++,this.acc.clear(),this.dropped=0}destroy(){for(let e of this.sets)try{e.qs.destroy(),e.resolve.destroy(),e.read.destroy()}catch{}this.sets=[]}}});function mn(){if(dr!==null)return dr;try{let l=globalThis.__brimkernSearch;if(typeof l=="string")return l}catch{}try{return typeof location<"u"?location.search:""}catch{return""}}function oe(l){try{return new URLSearchParams(mn()).get(l)}catch{return null}}var dr,fr=ae(()=>{"use strict";dr=null});function we(l){let e=l>>15&1,r=l>>10&31,t=l&1023,n;return r===0?n=t*59604645e-15:r===31?n=65504:n=(1+t/1024)*2**(r-15),e===1?-n:n}function Te(l){let e=new Float32Array(1),r=new Uint32Array(e.buffer);e[0]=l;let t=r[0],n=t>>16&32768,i=(t>>23&255)-127+15,a=t&8388607;return i<=0?n:i>=31?n|31743:(a=(a>>13)+(a>>12&1),a===1024&&(a=0,i+=1),n|i<<10|a&1023)}function vn(l,e){let r=new Float32Array(e*256),t=new DataView(l.buffer,l.byteOffset);for(let n=0;n<e;n++){let i=n*144,a=we(t.getUint16(i,!0)),s=we(t.getUint16(i+2,!0)),o=f=>{let p=g=>l[i+4+g];return f<4?[p(f)&63,p(f+4)&63]:[p(f+4)&15|p(f-4)>>6<<4,p(f+4)>>4|p(f)>>6<<4]},u=n*256,c=0,d=0;for(let f=0;f<256;f+=64){let[p,g]=o(c),m=a*p,b=s*g,[k,B]=o(c+1),S=a*k,q=s*B;for(let M=0;M<32;M++){let E=l[i+16+d+M];r[u+f+M]=m*(E&15)-b,r[u+f+32+M]=S*(E>>4)-q}d+=32,c+=2}}return r}function He(l){return l>127?l-256:l}function bn(l,e){let r=new Float32Array(e*32),t=new DataView(l.buffer,l.byteOffset);for(let n=0;n<e;n++){let i=n*34,a=we(t.getUint16(i,!0));for(let s=0;s<32;s++)r[n*32+s]=a*He(l[i+2+s])}return r}function wn(l,e){let r=new Float32Array(e*32),t=new DataView(l.buffer,l.byteOffset);for(let n=0;n<e;n++){let i=n*22,a=we(t.getUint16(i,!0)),s=t.getUint32(i+2,!0);for(let o=0;o<16;o++){let u=l[i+6+o],c=s>>>o<<4&16,d=s>>>o+12&16;r[n*32+o]=a*((u&15|c)-16),r[n*32+o+16]=a*((u>>4|d)-16)}}return r}function yn(l,e){let r=new Float32Array(e*32),t=new DataView(l.buffer,l.byteOffset);for(let n=0;n<e;n++){let i=n*18,a=we(t.getUint16(i,!0));for(let s=0;s<16;s++){let o=l[i+2+s];r[n*32+s]=a*((o&15)-8),r[n*32+s+16]=a*((o>>4)-8)}}return r}function kn(l,e){let r=new Float32Array(e*256),t=new DataView(l.buffer,l.byteOffset);for(let n=0;n<e;n++){let i=n*176,a=we(t.getUint16(i,!0)),s=we(t.getUint16(i+2,!0)),o=g=>{let m=b=>l[i+4+b];return g<4?[m(g)&63,m(g+4)&63]:[m(g+4)&15|m(g-4)>>6<<4,m(g+4)>>4|m(g)>>6<<4]},u=n*256,c=0,d=0,f=1,p=2;for(let g=0;g<256;g+=64){let[m,b]=o(c),k=a*m,B=s*b,[S,q]=o(c+1),M=a*S,E=s*q;for(let A=0;A<32;A++){let w=l[i+48+d+A],v=l[i+16+A];r[u+g+A]=k*((w&15)+(v&f?16:0))-B,r[u+g+32+A]=M*((w>>4)+(v&p?16:0))-E}d+=32,c+=2,f<<=2,p<<=2}}return r}function An(l,e){let r=new Float32Array(e*256),t=new DataView(l.buffer,l.byteOffset);for(let n=0;n<e;n++){let i=n*210,a=we(t.getUint16(i+208,!0)),s=n*256;for(let o=0;o<2;o++){let u=i+o*64,c=i+128+o*32,d=i+192+o*8,f=s+o*128;for(let p=0;p<32;p++){let g=p/16|0,m=l[u+p],b=l[u+p+32],k=l[c+p],B=(m&15|(k>>0&3)<<4)-32,S=(b&15|(k>>2&3)<<4)-32,q=(m>>4|(k>>4&3)<<4)-32,M=(b>>4|(k>>6&3)<<4)-32;r[f+p]=a*He(l[d+g])*B,r[f+p+32]=a*He(l[d+g+2])*S,r[f+p+64]=a*He(l[d+g+4])*q,r[f+p+96]=a*He(l[d+g+6])*M}}}return r}function Ce(l,e,r,t,n){let i=new Float32Array(r*n);for(let a=0;a<r;a++)for(let s=0;s<n;s++){let o=0;for(let u=0;u<t;u++)o+=l[a*t+u]*e[u*n+s];i[a*n+s]=o}return i}function Fe(l,e,r,t,n=1e-5,i=!1){let a=new Float32Array(r*t);for(let s=0;s<r;s++){let o=0;for(let c=0;c<t;c++)o+=l[s*t+c]**2;let u=1/Math.sqrt(o/t+n);for(let c=0;c<t;c++)a[s*t+c]=l[s*t+c]*u*(i?1+e[c]:e[c])}return a}function Pn(l,e,r,t,n,i,a){let s=new Float32Array(l.length),o=t/2,u=i[0],c=i[0]+i[1];for(let d=0;d<r;d++){let f=Math.floor(d/n),p=d*t;for(let g=0;g<o;g++){let m=g<u?0:g<c?1:2,k=e[f*3+m]/a**(2*g/t),B=Math.cos(k),S=Math.sin(k),q=l[p+g],M=l[p+g+o];s[p+g]=q*B-M*S,s[p+g+o]=M*B+q*S}}return s}function Xe(l,e,r,t,n=0,i=1e4,a){let s=new Float32Array(l.length),o=r/2;for(let u=0;u<e;u++){let c=n+Math.floor(u/t),d=u*r;for(let f=0;f<o;f++){let p=c/(i**(2*f/r)*(a?a[f]:1)),g=Math.cos(p),m=Math.sin(p),b=l[d+2*f],k=l[d+2*f+1];s[d+2*f]=b*g-k*m,s[d+2*f+1]=k*g+b*m}}return s}function Un(l,e,r,t,n,i=0,a=1e4){let s=new Float32Array(l.length),o=t/2;for(let u=0;u<r;u++){let c=i+Math.floor(u/n),d=u*t;for(let f=0;f<o;f++){let p=c/(a**(2*f/t)*e[f]),g=Math.cos(p),m=Math.sin(p),b=l[d+f],k=l[d+f+o];s[d+f]=b*g-k*m,s[d+f+o]=k*g+b*m}}return s}function ze(l,e,r,t,n=0,i=1e4){let a=new Float32Array(l.length),s=r/2;for(let o=0;o<e;o++){let u=n+Math.floor(o/t),c=o*r;for(let d=0;d<s;d++){let f=u/i**(2*d/r),p=Math.cos(f),g=Math.sin(f),m=l[c+d],b=l[c+d+s];a[c+d]=m*p-b*g,a[c+d+s]=b*p+m*g}}return a}function mt(l,e,r){return l.map((t,n)=>t+e[n%r])}function vt(l,e,r,t=!0){let n=t?l.windowPerLayer?.[r]??l.window??0:0,i=l.ropeThetaPerLayer?.[r]??l.ropeTheta,a=l.skipRopePerLayer?.[r]??l.skipRope??!1;return{...l,seq:e,window:n,ropeTheta:i,skipRope:a}}function be(l,e,r,t,n,i,a,s=0,o,u=0,c=0){let d=new Float32Array(t*n*a),f=o??1/Math.sqrt(a),p=m=>u>0?u*Math.tanh(m/u):m,g=n/i;for(let m=0;m<t;m++)for(let b=0;b<n;b++){let k=Math.floor(b/g),B=(m*n+b)*a,S=s+m,q=c>0?Math.max(0,S+1-c):0,M=[],E=-1/0;for(let w=q;w<=S;w++){let v=(w*i+k)*a,h=0;for(let y=0;y<a;y++)h+=l[B+y]*e[v+y];let x=p(h*f);M[w]=x,x>E&&(E=x)}let A=0;for(let w=q;w<=S;w++)M[w]=Math.exp(M[w]-E),A+=M[w];for(let w=q;w<=S;w++){let v=M[w]/A,h=(w*i+k)*a;for(let x=0;x<a;x++)d[B+x]+=v*r[h+x]}}return d}function pr(l){return .5*l*(1+Math.tanh(.7978845608*(l+.044715*l*l*l)))}function bt(l,e,r){let{seq:t,d:n,nHeads:i,nKvHeads:a,headDim:s,ffn:o,ropeTheta:u,eps:c}=e,d=a*s,f=i*s,p=e.rmsGainOnePlus===!0,g=e.attnLogitSoftcap??0,m=Fe(l,r.attnNorm,t,n,c,p),b=Ce(m,r.wq,t,n,f),k=Ce(m,r.wk,t,n,d),B=Ce(m,r.wv,t,n,d);r.bq&&(b=mt(b,r.bq,f)),r.bk&&(k=mt(k,r.bk,d)),r.bv&&(B=mt(B,r.bv,d)),r.qNorm&&(b=Fe(b,r.qNorm,t*i,s,c,p)),r.kNorm&&(k=Fe(k,r.kNorm,t*a,s,c,p));let S=ze(b,t*i,s,i,0,u),q=ze(k,t*a,s,a,0,u),M=be(S,q,B,t,i,a,s,0,e.attnScale,g),E=Ce(M,r.wo,t,f,n);r.postAttnNorm&&(E=Fe(E,r.postAttnNorm,t,n,c,p));let A=l.map((P,U)=>P+E[U]),w=Fe(A,r.ffnNorm,t,n,c,p),v=Ce(w,r.wgate,t,n,o),h=Ce(w,r.wup,t,n,o),x=e.act==="gelu"?v.map((P,U)=>pr(P)*h[U]):v.map((P,U)=>P/(1+Math.exp(-P))*h[U]),y=Ce(x,r.wdown,t,o,n);return r.postFfnNorm&&(y=Fe(y,r.postFfnNorm,t,n,c,p)),A.map((P,U)=>P+y[U])}var se,ee,Je,gr=ae(()=>{"use strict";pt();gt();ht();cr();lr();fr();se=64,ee=class ee{constructor(){this.device=null;this.modules={};this.pipelines={};this.maxStorageBufferBindingSize=0;this.hasF16=!1;this.validationFailure=null;this.lost=!1;this.onLost=null;this.attnDecodeOk=!0;this.attnPrefillOk=!0;this.attnFullWgOk=!0;this.mropeOk=!0;this.rwkvWkv7Ok=!0;this.lfm2ShortConvOk=!0;this.lfm2ResidentOk=!0;this.lfm2BatchOk=!0;this.swaOk=!0;this.rwkvResidentOk=!0;this.videoOk=!0;this.videoResidentOk=!0;this.f16SharedOk=!0;this.qSharedOk=!0;this.qShared2Ok=!0;this.gemvOk=!0;this.rmsVecOk=!0;this.convS2Ok=!0;this.hasSubgroups=!1;this.subgroupsOk=!0;this.topKParOk=!0;this.profiler=null;this.bufferPool=new Map;this.poolSize=new WeakMap;this.pooled=new WeakSet;this.uniformPool=new Map;this.uniformSize=new WeakMap;this.convTiledOk=!0;this.convTiledQOk=!0;this.kvGpu=new Map;this.topKOk=!0;this.kvSession="";this.kvQuant=!1;this.lfm2KvGpu=new Map;this.lfm2ConvGpu=new Map;this.lfm2Session="";this.rwkvStateGpu=new Map;this.rwkvVFirst=null;this.rwkvSession=""}async init(){let e=navigator.gpu;if(!e)return!1;let r=await e.requestAdapter();if(!r)return!1;let t=r.limits,n={maxStorageBufferBindingSize:t.maxStorageBufferBindingSize,maxBufferSize:t.maxBufferSize},i=[];try{r.features?.has("shader-f16")&&i.push("shader-f16")}catch{}try{r.features?.has("subgroups")&&i.push("subgroups")}catch{}try{ee.profileOn&&r.features?.has("timestamp-query")&&i.push("timestamp-query")}catch{}try{this.device=await r.requestDevice({requiredLimits:n,requiredFeatures:i})}catch{try{this.device=await r.requestDevice({requiredLimits:n})}catch{this.device=await r.requestDevice()}}this.maxStorageBufferBindingSize=this.device.limits?.maxStorageBufferBindingSize??134217728,this.hasF16=!!this.device.features?.has?.("shader-f16"),this.hasSubgroups=!!this.device.features?.has?.("subgroups"),ee.profileOn&&(this.device.features?.has?.("timestamp-query")?(this.profiler=new Ye(this.device),console.info("[webgpu] profilage par passe ACTIF (?gpuprofile=1) : __gpuProfile() pour le rapport")):console.warn("[webgpu] ?gpuprofile=1 demand\xE9 mais la feature timestamp-query est ABSENTE de cet adapter : aucune mesure ne sera prise."));try{oe("attndecode")==="0"&&(this.attnDecodeOk=!1,console.warn("[webgpu] attention d\xE9codage COUP\xC9E par ?attndecode=0 : kernels classiques")),oe("attnfullwg")==="0"&&(this.attnFullWgOk=!1,console.warn("[webgpu] attention_full workgroup COUP\xC9E par ?attnfullwg=0 : kernel classique")),oe("attnprefill")==="0"&&(this.attnPrefillOk=!1,console.warn("[webgpu] attention prefill tuil\xE9e COUP\xC9E par ?attnprefill=0 : kernel classique")),oe("rmsvec")==="0"&&(this.rmsVecOk=!1,console.warn("[webgpu] RMSNorm parall\xE8le COUP\xC9E par ?rmsvec=0 : kernel une-ligne-par-thread")),oe("topkpar")==="0"&&(this.topKParOk=!1,console.warn("[webgpu] top-K parall\xE8le COUP\xC9E par ?topkpar=0 : s\xE9lection finale sur un seul thread")),oe("rwkv")==="0"&&(this.rwkvWkv7Ok=!1,console.warn("[webgpu] kernel RWKV-7 WKV COUP\xC9 par ?rwkv=0")),oe("lfm2")==="0"&&(this.lfm2ShortConvOk=!1,console.warn("[webgpu] kernel shortconv LFM2 COUP\xC9 par ?lfm2=0")),oe("lfm2resident")==="0"&&(this.lfm2ResidentOk=!1,console.warn("[webgpu] LFM2 r\xE9sident COUP\xC9 par ?lfm2resident=0 : forwardToken JS+readback")),oe("lfm2batch")==="0"&&(this.lfm2BatchOk=!1,console.warn("[webgpu] prefill LFM2 batch\xE9 COUP\xC9 par ?lfm2batch=0 : token par token")),oe("convs2")==="0"&&(this.convS2Ok=!1,console.warn("[webgpu] conv2d 3\xD73 stride-2 tuil\xE9 COUP\xC9 par ?convs2=0 : repli sur direct")),oe("subgroups")==="0"&&(this.subgroupsOk=!1,console.warn("[webgpu] subgroups COUP\xC9 par ?subgroups=0 : repli sur shared memory")),oe("swa")==="0"&&(this.swaOk=!1,console.warn("[webgpu] fen\xEAtre glissante COUP\xC9E par ?swa=0 : attention causale pleine sur toutes les couches")),oe("rwkvresident")==="0"&&(this.rwkvResidentOk=!1,console.warn("[webgpu] RWKV r\xE9sident COUP\xC9 par ?rwkvresident=0 : forwardToken JS+readback")),oe("video")==="0"&&(this.videoOk=!1,console.warn("[webgpu] chemin vid\xE9o (module motion) COUP\xC9 par ?video=0")),oe("f16shared")==="0"&&(this.f16SharedOk=!1,console.warn("[webgpu] GEMM f16 tuil\xE9 COUP\xC9 par ?f16shared=0 : matmul_t_f16w pour tous les m")),oe("gemv")==="0"&&(this.gemvOk=!1,console.warn("[webgpu] GEMV de d\xE9codage COUP\xC9 par ?gemv=0 : kernels par lignes")),oe("qshared")==="0"&&(this.qSharedOk=!1,console.warn("[webgpu] GEMM q8/q4 tuil\xE9s COUP\xC9S par ?qshared=0 : kernels 4 lignes/invocation")),oe("qshared2")==="0"&&(this.qShared2Ok=!1,console.warn("[webgpu] GEMM q8/q4 v2 (bloc 4\xD78 vec4) COUP\xC9S par ?qshared2=0 : tuile 32\xD764 v1")),oe("convtq")==="0"&&(this.convTiledQOk=!1,console.warn("[webgpu] conv 3\xD73 tuil\xE9 q8/q4 COUP\xC9 par ?convtq=0 : conv2d_direct_q8/q4 (plus lent, m\xEAme r\xE9sultat)")),oe("videoresident")==="0"&&(this.videoResidentOk=!1,console.warn("[webgpu] motion r\xE9sident COUP\xC9 par ?videoresident=0 : chemin JS+readback"))}catch{}this.device.lost?.then?.(a=>{this.lost=!0,console.warn("[webgpu] device GPU perdu :",a?.reason||"unknown",a?.message||""),this.onLost?.(a)});for(let[a,s]of Object.entries(or))this.modules[a]=this.device.createShaderModule({code:s});return this.hasF16&&(this.modules.matmul_t_f16w=this.device.createShaderModule({code:ur})),!0}buf(e,r){let t=this.device.createBuffer({size:e.byteLength,usage:r});return this.device.queue.writeBuffer(t,0,e),t}bufU32(e,r){let t=this.device.createBuffer({size:e.byteLength,usage:r});return this.device.queue.writeBuffer(t,0,e),t}async readBack(e,r){let t=globalThis,n=this.device.createBuffer({size:r,usage:t.GPUBufferUsage.COPY_DST|t.GPUBufferUsage.MAP_READ}),i=this.device.createCommandEncoder();i.copyBufferToBuffer(e,0,n,0,r),this.device.queue.submit([i.finish()]),await n.mapAsync(t.GPUMapMode.READ);let a=new Float32Array(n.getMappedRange().slice(0));return n.unmap(),n.destroy(),a}async readBackBytes(e,r){let t=globalThis,n=Math.ceil(r/4)*4,i=this.device.createBuffer({size:n,usage:t.GPUBufferUsage.COPY_DST|t.GPUBufferUsage.MAP_READ}),a=this.device.createCommandEncoder();a.copyBufferToBuffer(e,0,i,0,n),this.device.queue.submit([a.finish()]),await i.mapAsync(t.GPUMapMode.READ);let s=new Uint8Array(i.getMappedRange().slice(0,r));return i.unmap(),i.destroy(),s}async quantizeToBytes(e,r,t,n,i){let a=t/32,s=n==="q8"?new Uint8Array(t+a*2):new Uint8Array(t/2+a*4),o=ee.BLOCK_ELEMS[e]??1,u=t/o,c=r.byteLength/u,d=(m,b)=>b===0?m:d(b,m%b),f=o*32/d(o,32),p=Math.floor(this.maxStorageBufferBindingSize*.9/4),g=i??p;g=Math.max(f,Math.floor(g/f)*f);for(let m=0;m<t;m+=g){let b=Math.min(g,t-m),k=r.slice(m/o*c,(m+b)/o*c),B=this.dequantizeToGpu(e,k,b);try{if(n==="q8"){let{codes:S,sc:q}=this.f32ToQ8Gpu(B,b),M=await this.readBackBytes(S,b),E=await this.readBackBytes(q,b/32*2);S.destroy?.(),q.destroy?.(),s.set(M,m),s.set(E,t+m/32*2)}else{let{nib:S,sc:q,mn:M}=this.f32ToQ4Gpu(B,b),E=await this.readBackBytes(S,b/2),A=await this.readBackBytes(q,b/32*2),w=await this.readBackBytes(M,b/32*2);S.destroy?.(),q.destroy?.(),M.destroy?.(),s.set(E,m/2),s.set(A,t/2+m/32*2),s.set(w,t/2+a*2+m/32*2)}}finally{B.destroy?.()}}return s}pipeline(e){let r=this.pipelines[e];return r||(r=this.device.createComputePipeline({layout:"auto",compute:{module:this.modules[e],entryPoint:"main"}}),this.pipelines[e]=r),r}grid1D(e){let r=Math.ceil(e/se);if(r<=ee.MAX_WG_DIM)return[r,1,1];let t=ee.MAX_WG_DIM;return[t,Math.ceil(r/t),1]}recordPass(e,r,t,n){let i=this.pipeline(r),a=this.device.createBindGroup({layout:i.getBindGroupLayout(0),entries:t.map((u,c)=>({binding:c,resource:{buffer:u}}))}),s=this.profiler?.slot(r),o=e.beginComputePass(s?{timestampWrites:s}:void 0);o.setPipeline(i),o.setBindGroup(0,a),o.dispatchWorkgroups(...n),o.end()}dispatch(e,r,t){let n=this.device.createCommandEncoder();this.recordPass(n,e,r,t),this.device.queue.submit([n.finish()])}async run(e,r,t,n,i){return this.dispatch(e,r,t),this.readBack(n,i)}isF32(e){return e instanceof Float32Array}async matmul(e,r,t,n,i){let a=globalThis,s=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,o=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([t,n,i]));let u=this.isF32(r)?this.buf(r,s):r,c=this.device.createBuffer({size:t*i*4,usage:s|a.GPUBufferUsage.COPY_SRC});return this.run("matmul",[o,this.buf(e,s),u,c],[Math.ceil(t/8),Math.ceil(i/8),1],c,t*i*4)}async matmulT(e,r,t,n,i,a=!1){let s=globalThis,o=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([t,n,i]));let c=this.isF32(r)?this.buf(r,o):r,d=this.device.createBuffer({size:t*i*4,usage:o|s.GPUBufferUsage.COPY_SRC}),f=this.matmulTPlan(t,n,i,a);return this.run(f.shader,[u,this.buf(e,o),c,d],f.grid,d,t*i*4)}matmulTPlan(e,r,t,n){return n&&this.hasF16?this.f16SharedOk&&e>=32&&r%4===0?{shader:"matmul_t_f16w_shared",grid:[Math.ceil(t/64),Math.ceil(e/32),1]}:{shader:"matmul_t_f16w",grid:[Math.ceil(e/8),Math.ceil(t/8),1]}:{shader:r%4===0?"matmul_t_vec4":"matmul_t",grid:[Math.ceil(e/8),Math.ceil(t/8),1]}}async rmsnorm(e,r,t,n,i=1e-5,a=!1){let s=globalThis,o=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([t,n])),this.device.queue.writeBuffer(u,8,new Float32Array([i])),this.device.queue.writeBuffer(u,12,new Uint32Array([a?1:0]));let c=this.device.createBuffer({size:e.byteLength,usage:o|s.GPUBufferUsage.COPY_SRC});return this.run("rmsnorm",[u,this.buf(e,o),this.buf(r,o),c],[Math.ceil(t/se),1,1],c,e.byteLength)}async topKReadback(e,r,t){let n=globalThis,i=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST,a=this.device.createBuffer({size:8,usage:n.GPUBufferUsage.UNIFORM|n.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(a,0,new Uint32Array([e.length,r]));let s=this.device.createBuffer({size:r*2*4,usage:i|n.GPUBufferUsage.COPY_SRC}),o=this.device.createBuffer({size:r*2*4,usage:n.GPUBufferUsage.COPY_DST|n.GPUBufferUsage.MAP_READ}),u=this.device.createCommandEncoder(),c=this.buf(e,i);this.recordPass(u,t,[a,c,s],[1,1,1]),u.copyBufferToBuffer(s,0,o,0,r*2*4),this.device.queue.submit([u.finish()]),await o.mapAsync(n.GPUMapMode.READ);let d=new Uint32Array(o.getMappedRange().slice(0));return o.unmap(),o.destroy(),s.destroy?.(),a.destroy?.(),c.destroy?.(),d}async rmsnormVec(e,r,t,n,i=1e-5,a=!1,s="rmsnorm_vec"){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([t,n])),this.device.queue.writeBuffer(c,8,new Float32Array([i])),this.device.queue.writeBuffer(c,12,new Uint32Array([a?1:0]));let d=this.device.createBuffer({size:e.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run(s,[c,this.buf(e,u),this.buf(r,u),d],[t,1,1],d,e.byteLength)}async binary(e,r,t){let n=globalThis,i=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST,a=this.device.createBuffer({size:r.byteLength,usage:i|n.GPUBufferUsage.COPY_SRC});return this.run(e,[this.buf(r,i),this.buf(t,i),a],this.grid1D(r.length),a,r.byteLength)}swiglu(e,r){return this.binary("swiglu",e,r)}geglu(e,r){return this.binary("geglu",e,r)}add(e,r){return this.binary("add",e,r)}async silu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("silu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async groupNorm(e,r,t,n,i,a,s=1e-5,o="group_norm"){let u=globalThis,c=u.GPUBufferUsage.STORAGE|u.GPUBufferUsage.COPY_DST,d=this.device.createBuffer({size:16,usage:u.GPUBufferUsage.UNIFORM|u.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(d,0,new Uint32Array([n,i,a])),this.device.queue.writeBuffer(d,12,new Float32Array([s]));let f=this.device.createBuffer({size:e.byteLength,usage:c|u.GPUBufferUsage.COPY_SRC});return this.run(o,[d,this.buf(e,c),this.buf(r,c),this.buf(t,c),f],[a,1,1],f,e.byteLength)}async conv2d(e,r,t,n,i,a,s,o,u,c=1,d=0){let f=globalThis,p=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,g=Math.floor((i+2*d-o)/c)+1,m=Math.floor((a+2*d-u)/c)+1,b=n*o*u,k=g*m;if(b*k*4>this.maxStorageBufferBindingSize*.9)return this.conv2dDirect(e,r,t,n,i,a,s,o,u,c,d);let B=this.device.createBuffer({size:48,usage:f.GPUBufferUsage.UNIFORM|f.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(B,0,new Uint32Array([n,i,a,o,u,c,d,g,m]));let S=this.device.createBuffer({size:b*k*4,usage:p|f.GPUBufferUsage.COPY_SRC});this.dispatch("im2col",[B,this.buf(e,p),S],this.grid1D(b*k));let q=await this.matmul(r,S,s,b,k);if(S.destroy?.(),B.destroy?.(),t)for(let M=0;M<s;M++){let E=t[M];for(let A=0;A<k;A++)q[M*k+A]+=E}return q}async conv2dDirect(e,r,t,n,i,a,s,o,u,c=1,d=0){let f=globalThis,p=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,g=Math.floor((i+2*d-o)/c)+1,m=Math.floor((a+2*d-u)/c)+1,b=s*g*m,k=this.device.createBuffer({size:48,usage:f.GPUBufferUsage.UNIFORM|f.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(k,0,new Uint32Array([n,i,a,s,o,u,c,d,g,m]));let B=t??new Float32Array(s),S=this.device.createBuffer({size:b*4,usage:p|f.GPUBufferUsage.COPY_SRC});return this.run("conv2d_direct",[k,this.buf(e,p),this.buf(r,p),this.buf(B,p),S],this.grid1D(b),S,b*4)}async layernorm(e,r,t,n,i,a=1e-5){let s=globalThis,o=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,i])),this.device.queue.writeBuffer(u,8,new Float32Array([a]));let c=this.device.createBuffer({size:e.byteLength,usage:o|s.GPUBufferUsage.COPY_SRC});return this.run("layernorm",[u,this.buf(e,o),this.buf(r,o),this.buf(t,o),c],[Math.ceil(n/se),1,1],c,e.byteLength)}async quickGelu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("quick_gelu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async gelu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("gelu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async relu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("relu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async upsampleNearest(e,r,t,n,i=2){let a=globalThis,s=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,o=t*i,u=n*i,c=r*o*u,d=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(d,0,new Uint32Array([r,t,n,i]));let f=this.device.createBuffer({size:c*4,usage:s|a.GPUBufferUsage.COPY_SRC});return this.run("upsample_nearest",[d,this.buf(e,s),f],this.grid1D(c),f,c*4)}async upscale2x(e,r,t,n,i=.5){let a=t*2,s=n*2,o=this.recordingSession(),u=this.uploadGpu(e),c=o.upscale2x(u,r,t,n,i),d=await o.finish(c,r*a*s);return this.releaseGpu([u]),d}async rope(e,r,t,n,i=0,a=1e4,s=!1){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:32,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([r,t,n,i])),this.device.queue.writeBuffer(c,16,new Float32Array([a]));let d=this.device.createBuffer({size:e.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.device.queue.writeBuffer(c,20,new Uint32Array([s?1:0])),this.run("rope",[c,this.buf(e,u),d],[Math.ceil(r/se),1,1],d,e.byteLength)}async ropeFactors(e,r,t,n,i,a=0,s=1e4,o=!1){let u=globalThis,c=u.GPUBufferUsage.STORAGE|u.GPUBufferUsage.COPY_DST,d=this.device.createBuffer({size:32,usage:u.GPUBufferUsage.UNIFORM|u.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(d,0,new Uint32Array([t,n,i,a])),this.device.queue.writeBuffer(d,16,new Float32Array([s]));let f=this.device.createBuffer({size:r.byteLength,usage:c});this.device.queue.writeBuffer(f,0,r);let p=this.device.createBuffer({size:e.byteLength,usage:c|u.GPUBufferUsage.COPY_SRC});return this.device.queue.writeBuffer(d,20,new Uint32Array([o?1:0])),this.run("rope_factors",[d,this.buf(e,c),f,p],[Math.ceil(t/se),1,1],p,e.byteLength)}async ropeMrope(e,r,t,n,i,a,s=1e4){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:32,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([t,n,i,a[0],a[0]+a[1]])),this.device.queue.writeBuffer(c,20,new Float32Array([s]));let d=this.device.createBuffer({size:r.byteLength,usage:u});this.device.queue.writeBuffer(d,0,r);let f=this.device.createBuffer({size:e.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("rope_mrope",[c,this.buf(e,u),d,f],[Math.ceil(t/se),1,1],f,e.byteLength)}async rope2d(e,r,t,n,i,a=1e4){let s=globalThis,o=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:32,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([t,n,i,0])),this.device.queue.writeBuffer(u,16,new Float32Array([a]));let c=this.device.createBuffer({size:r.byteLength,usage:o});this.device.queue.writeBuffer(c,0,r);let d=this.device.createBuffer({size:e.byteLength,usage:o|s.GPUBufferUsage.COPY_SRC});return this.run("rope_2d",[u,this.buf(e,o),c,d],[Math.ceil(t/se),1,1],d,e.byteLength)}async attention(e,r,t,n,i,a,s,o=0,u,c=0,d=0){let f=globalThis,p=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,g=o+n,m=this.attnUniform(n,i,a,s,g,o,u??1/Math.sqrt(s),c,d),b=n*i*s*4,k=this.device.createBuffer({size:b,usage:p|f.GPUBufferUsage.COPY_SRC});return this.run("attention",[m,this.buf(e,p),this.buf(r,p),this.buf(t,p),k],[Math.ceil(n*i/se),1,1],k,b)}async attentionDecode(e,r,t,n,i,a,s,o=0,u,c=0,d=0){let f=globalThis,p=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,g=o+n,m=this.attnUniform(n,i,a,s,g,o,u??1/Math.sqrt(s),c,d),b=n*i*s*4,k=this.device.createBuffer({size:b,usage:p|f.GPUBufferUsage.COPY_SRC});return this.run("attention_decode",[m,this.buf(e,p),this.buf(r,p),this.buf(t,p),k],[n*i,1,1],k,b)}async attentionPrefill(e,r,t,n,i,a,s,o=0,u,c=0,d=0){let f=globalThis,p=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,g=o+n,m=this.attnUniform(n,i,a,s,g,o,u??1/Math.sqrt(s),c,d),b=n*i*s*4,k=this.device.createBuffer({size:b,usage:p|f.GPUBufferUsage.COPY_SRC});return this.run("attention_prefill",[m,this.buf(e,p),this.buf(r,p),this.buf(t,p),k],[Math.ceil(n/4)*i,1,1],k,b)}async attentionFull(e,r,t,n,i,a,s,o,u,c=0){let d=globalThis,f=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,p=this.device.createBuffer({size:32,usage:d.GPUBufferUsage.UNIFORM|d.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(p,0,new Uint32Array([n,i,a,s,o,0])),this.device.queue.writeBuffer(p,24,new Float32Array([u??1/Math.sqrt(s),c]));let g=n*i*s*4,m=this.device.createBuffer({size:g,usage:f|d.GPUBufferUsage.COPY_SRC});return this.run("attention_full",[p,this.buf(e,f),this.buf(r,f),this.buf(t,f),m],[Math.ceil(n*i/se),1,1],m,g)}async attentionFullWg(e,r,t,n,i,a,s,o,u,c=0){let d=globalThis,f=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,p=this.device.createBuffer({size:32,usage:d.GPUBufferUsage.UNIFORM|d.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(p,0,new Uint32Array([n,i,a,s,o,0])),this.device.queue.writeBuffer(p,24,new Float32Array([u??1/Math.sqrt(s),c]));let g=n*i*s*4,m=this.device.createBuffer({size:g,usage:f|d.GPUBufferUsage.COPY_SRC});return this.run("attention_full_wg",[p,this.buf(e,f),this.buf(r,f),this.buf(t,f),m],[n*i,1,1],m,g)}async quantizeKvReadback(e,r,t,n){let i=globalThis,a=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST|i.GPUBufferUsage.COPY_SRC,s=t*n,o=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([r,t,n,0]));let u=this.device.createBuffer({size:r*s,usage:a}),c=this.device.createBuffer({size:r*t*4,usage:a});this.dispatch("quantize_kv",[o,this.buf(e,a),u,c],this.grid1D(r*t));let d=await this.readBack(u,r*s),f=new Uint32Array(d.buffer,0,r*s/4),p=await this.readBack(c,r*t*4);return u.destroy?.(),c.destroy?.(),{codes:f,scales:p}}async attentionQ8Kv(e,r,t,n,i,a,s,o,u,c=0,d,f=0,p=0){let g=globalThis,m=g.GPUBufferUsage.STORAGE|g.GPUBufferUsage.COPY_DST,b=c+a,k=this.attnUniform(a,s,o,u,b,c,d??1/Math.sqrt(u),f,p),B=a*s*u*4,S=this.device.createBuffer({size:B,usage:m|g.GPUBufferUsage.COPY_SRC});return this.run("attention_q8kv",[k,this.buf(e,m),this.bufU32(r,m),this.buf(t,m),this.bufU32(n,m),this.buf(i,m),S],[Math.ceil(a*s/se),1,1],S,B)}async attentionQ8KvDecode(e,r,t,n,i,a,s,o,u,c=0,d,f=0,p=0){let g=globalThis,m=g.GPUBufferUsage.STORAGE|g.GPUBufferUsage.COPY_DST,b=c+a,k=this.attnUniform(a,s,o,u,b,c,d??1/Math.sqrt(u),f,p),B=a*s*u*4,S=this.device.createBuffer({size:B,usage:m|g.GPUBufferUsage.COPY_SRC});return this.run("attention_decode_q8kv",[k,this.buf(e,m),this.bufU32(r,m),this.buf(t,m),this.bufU32(n,m),this.buf(i,m),S],[a*s,1,1],S,B)}async attentionQ8KvPrefill(e,r,t,n,i,a,s,o,u,c=0,d,f=0,p=0){let g=globalThis,m=g.GPUBufferUsage.STORAGE|g.GPUBufferUsage.COPY_DST,b=c+a,k=this.attnUniform(a,s,o,u,b,c,d??1/Math.sqrt(u),f,p),B=a*s*u*4,S=this.device.createBuffer({size:B,usage:m|g.GPUBufferUsage.COPY_SRC});return this.run("attention_prefill_q8kv",[k,this.buf(e,m),this.bufU32(r,m),this.buf(t,m),this.bufU32(n,m),this.buf(i,m),S],[Math.ceil(a/4)*s,1,1],S,B)}async addBias(e,r,t,n){let i=globalThis,a=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,s=this.device.createBuffer({size:8,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(s,0,new Uint32Array([t,n]));let o=this.device.createBuffer({size:e.byteLength,usage:a|i.GPUBufferUsage.COPY_SRC});return this.run("addbias",[s,this.buf(e,a),this.buf(r,a),o],this.grid1D(e.length),o,e.byteLength)}async dequantBlocked(e,r,t,n){let i=globalThis,a=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,s=t/n;if(!Number.isInteger(s))throw new Error(`${e}: nElems ${t} not a multiple of ${n}`);let o=r.byteLength%4===0?r:(()=>{let f=new Uint8Array(Math.ceil(r.byteLength/4)*4);return f.set(r),f})(),u=new Uint32Array(o.buffer,o.byteOffset,o.byteLength/4),c=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s]));let d=this.device.createBuffer({size:t*4,usage:a|i.GPUBufferUsage.COPY_SRC});return this.run(e,[c,this.bufU32(u,a),d],this.grid1D(s),d,t*4)}async dequantizeQ4K(e,r){return this.dequantBlocked("dequant_q4k",e,r,256)}async dequantizeByType(e,r,t){if(e==="F32")return new Float32Array(r.buffer,r.byteOffset,t);if(e==="F16"){let a=new DataView(r.buffer,r.byteOffset),s=new Float32Array(t);for(let o=0;o<t;o++)s[o]=we(a.getUint16(o*2,!0));return s}if(e==="Q4W")return ge(qe(r,t));if(e==="Q8W")return me(Oe(r,t));if(e==="Q3W")return Le(De(r,t));let n=ee.DEQUANT_SHADER[e],i=ee.BLOCK_ELEMS[e];if(!n||!i)throw new Error(`dequant: unsupported GGML type ${e}`);return this.dequantBlocked(n,r,t,i)}dequantBlockedGpu(e,r,t,n){let i=globalThis,a=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,s=t/n;if(!Number.isInteger(s))throw new Error(`${e}: nElems ${t} not a multiple of ${n}`);let o=r.byteLength%4===0?r:(()=>{let f=new Uint8Array(Math.ceil(r.byteLength/4)*4);return f.set(r),f})(),u=new Uint32Array(o.buffer,o.byteOffset,o.byteLength/4),c=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s]));let d=this.device.createBuffer({size:t*4,usage:a});return this.dispatch(e,[c,this.bufU32(u,a),d],this.grid1D(s)),d}dequantizeToGpu(e,r,t){let n=globalThis,i=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST;if(e==="F32")return this.buf(new Float32Array(r.buffer,r.byteOffset,t),i);if(e==="F16"){let o=new DataView(r.buffer,r.byteOffset),u=new Float32Array(t);for(let c=0;c<t;c++)u[c]=we(o.getUint16(c*2,!0));return this.buf(u,i)}if(e==="Q4W")return this.buf(ge(qe(r,t)),i);if(e==="Q8W")return this.buf(me(Oe(r,t)),i);if(e==="Q3W")return this.buf(Le(De(r,t)),i);let a=ee.DEQUANT_SHADER[e],s=ee.BLOCK_ELEMS[e];if(!a||!s)throw new Error(`dequant: unsupported GGML type ${e}`);return this.dequantBlockedGpu(a,r,t,s)}async layerForward(e,r,t,n=!1){let{seq:i,d:a,nHeads:s,nKvHeads:o,headDim:u,ffn:c,ropeTheta:d,eps:f}=r,p=o*u,g=n?(F,C,D,T,L)=>this.matmulT(F,C,D,T,L):(F,C,D,T,L)=>this.matmul(F,C,D,T,L),m=s*u,b=r.rmsGainOnePlus===!0,k=r.attnLogitSoftcap??0,B=(F,C)=>r.act==="gelu"?this.geglu(F,C):this.swiglu(F,C),S=await this.rmsnorm(e,t.attnNorm,i,a,f,b),q=await g(S,t.wq,i,a,m),M=await g(S,t.wk,i,a,p),E=await g(S,t.wv,i,a,p);t.bq&&(q=await this.addBias(q,t.bq,i,m)),t.bk&&(M=await this.addBias(M,t.bk,i,p)),t.bv&&(E=await this.addBias(E,t.bv,i,p)),t.qNorm&&(q=await this.rmsnorm(q,t.qNorm,i*s,u,f,b)),t.kNorm&&(M=await this.rmsnorm(M,t.kNorm,i*o,u,f,b));let A=await this.rope(q,i*s,u,s,0,d),w=await this.rope(M,i*o,u,o,0,d),v=await this.attention(A,w,E,i,s,o,u,0,r.attnScale,k),h=await g(v,t.wo,i,m,a);t.postAttnNorm&&(h=await this.rmsnorm(h,t.postAttnNorm,i,a,f,b));let x=await this.add(e,h),y=await this.rmsnorm(x,t.ffnNorm,i,a,f,b),P=await g(y,t.wgate,i,a,c),U=await g(y,t.wup,i,a,c),G=await B(P,U),_=await g(G,t.wdown,i,c,a);return t.postFfnNorm&&(_=await this.rmsnorm(_,t.postFfnNorm,i,a,f,b)),this.add(x,_)}async layerForwardKV(e,r,t,n,i,a,s=!1){let{seq:o,d:u,nHeads:c,nKvHeads:d,headDim:f,ffn:p,ropeTheta:g,eps:m}=r,b=d*f,k=s?(Y,$,J,W,O)=>this.matmulT(Y,$,J,W,O):(Y,$,J,W,O)=>this.matmul(Y,$,J,W,O),B=(Y,$)=>{let J=new Float32Array(Y.length+$.length);return J.set(Y),J.set($,Y.length),J},S=c*f,q=r.rmsGainOnePlus===!0,M=r.attnLogitSoftcap??0,E=(Y,$)=>r.act==="gelu"?this.geglu(Y,$):this.swiglu(Y,$),A=await this.rmsnorm(e,t.attnNorm,o,u,m,q),w=await k(A,t.wq,o,u,S),v=await k(A,t.wk,o,u,b),h=await k(A,t.wv,o,u,b);t.bq&&(w=await this.addBias(w,t.bq,o,S)),t.bk&&(v=await this.addBias(v,t.bk,o,b)),t.bv&&(h=await this.addBias(h,t.bv,o,b)),t.qNorm&&(w=await this.rmsnorm(w,t.qNorm,o*c,f,m,q)),t.kNorm&&(v=await this.rmsnorm(v,t.kNorm,o*d,f,m,q));let x=await this.rope(w,o*c,f,c,n,g),y=await this.rope(v,o*d,f,d,n,g),P=B(i,y),U=B(a,h),G=await this.attention(x,P,U,o,c,d,f,n,r.attnScale,M),_=await k(G,t.wo,o,S,u);t.postAttnNorm&&(_=await this.rmsnorm(_,t.postAttnNorm,o,u,m,q));let F=await this.add(e,_),C=await this.rmsnorm(F,t.ffnNorm,o,u,m,q),D=await k(C,t.wgate,o,u,p),T=await k(C,t.wup,o,u,p),L=await E(D,T),N=await k(L,t.wdown,o,p,u);return t.postFfnNorm&&(N=await this.rmsnorm(N,t.postFfnNorm,o,u,m,q)),{out:await this.add(F,N),k:P,v:U}}storage(e){let r=this.bufferPool.get(e);if(r&&r.length){let n=r.pop();return this.pooled.delete(n),n}let t=this.device.createBuffer({size:e,usage:ee.STORAGE_USAGE});return this.poolSize.set(t,e),t}release(e){for(let r of e){if(!r)continue;let t=this.poolSize.get(r);if(t!==void 0){if(this.pooled.has(r))continue;this.pooled.add(r);let i=this.bufferPool.get(t);i||(i=[],this.bufferPool.set(t,i)),i.push(r);continue}let n=this.uniformSize.get(r);if(n!==void 0){if(this.pooled.has(r))continue;this.pooled.add(r);let i=this.uniformPool.get(n);i||(i=[],this.uniformPool.set(n,i)),i.push(r);continue}r.destroy?.()}}uploadGpu(e){return e instanceof Float32Array?this.buf(e,ee.STORAGE_USAGE):this.f16ToF32Gpu(e.f16,e.n)}uploadGpuF16(e){let r=new Uint16Array(e.length);for(let t=0;t<e.length;t++)r[t]=Te(e[t]);return this.bufU16(r)}f32ToF16Gpu(e,r){let t=globalThis,n=Math.ceil(r/2),i=this.device.createBuffer({size:n*4,usage:ee.STORAGE_USAGE}),a=this.device.createBuffer({size:16,usage:t.GPUBufferUsage.UNIFORM|t.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(a,0,new Uint32Array([n])),this.dispatch("packf16",[a,e,i],this.grid1D(n)),i}f32ToQ8Gpu(e,r){let t=globalThis,n=r/32,i=this.device.createBuffer({size:r,usage:ee.STORAGE_USAGE}),a=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:ee.STORAGE_USAGE}),s=this.device.createBuffer({size:16,usage:t.GPUBufferUsage.UNIFORM|t.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(s,0,new Uint32Array([n])),this.dispatch("quantize_q8",[s,e,i,a],this.grid1D(n)),{codes:i,sc:a}}f32ToQ4Gpu(e,r){let t=globalThis,n=r/32,i=this.device.createBuffer({size:r/2,usage:ee.STORAGE_USAGE}),a=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:ee.STORAGE_USAGE}),s=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:ee.STORAGE_USAGE}),o=this.device.createBuffer({size:16,usage:t.GPUBufferUsage.UNIFORM|t.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(o,0,new Uint32Array([n])),this.dispatch("quantize_q4",[o,e,i,a,s],this.grid1D(n)),{nib:i,sc:a,mn:s}}uploadGpuRawF16(e){let r=Math.ceil(e.byteLength/4)*4,t=this.device.createBuffer({size:r,usage:ee.STORAGE_USAGE});if(this.device.queue.writeBuffer(t,0,e,0,e.byteLength-e.byteLength%4),e.byteLength%4){let n=new Uint8Array(4);n.set(e.subarray(e.byteLength-e.byteLength%4)),this.device.queue.writeBuffer(t,e.byteLength-e.byteLength%4,n)}return t}bufU16(e){let r=this.device.createBuffer({size:e.byteLength,usage:ee.STORAGE_USAGE});return this.device.queue.writeBuffer(r,0,e),r}uploadGpuRaw(e){let r=Math.ceil(e.byteLength/4)*4,t=this.device.createBuffer({size:r,usage:ee.STORAGE_USAGE}),n=e.byteLength-e.byteLength%4;if(this.device.queue.writeBuffer(t,0,e,0,n),e.byteLength%4){let i=new Uint8Array(4);i.set(e.subarray(n)),this.device.queue.writeBuffer(t,n,i)}return t}async matmulQ4(e,r,t,n,i,a,s){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([i,a,s]));let d=this.device.createBuffer({size:i*s*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4",[c,this.buf(e,u),r,t,n,d],[Math.ceil(i/8),Math.ceil(s/8),1],d,i*s*4)}async matmulQ4Tiled(e,r,t,n,i,a,s){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([i,a,s]));let d=this.device.createBuffer({size:i*s*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_tiled",[c,this.buf(e,u),r,t,n,d],[Math.ceil(Math.ceil(i/4)/8),Math.ceil(s/8),1],d,i*s*4)}async matmulQ4Shared(e,r,t,n,i,a,s){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([i,a,s]));let d=this.device.createBuffer({size:i*s*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_shared",[c,this.buf(e,u),r,t,n,d],[Math.ceil(s/64),Math.ceil(i/32),1],d,i*s*4)}async matmulQ3(e,r,t,n,i,a,s,o){let u=globalThis,c=u.GPUBufferUsage.STORAGE|u.GPUBufferUsage.COPY_DST,d=this.device.createBuffer({size:16,usage:u.GPUBufferUsage.UNIFORM|u.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(d,0,new Uint32Array([a,s,o]));let f=this.device.createBuffer({size:a*o*4,usage:c|u.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q3",[d,this.buf(e,c),r,t,n,i,f],[Math.ceil(a/8),Math.ceil(o/8),1],f,a*o*4)}async rwkvWkv7(e,r,t,n,i,a,s,o,u){let c=globalThis,d=c.GPUBufferUsage.STORAGE|c.GPUBufferUsage.COPY_DST,f=this.device.createBuffer({size:8,usage:c.GPUBufferUsage.UNIFORM|c.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(f,0,new Uint32Array([o,u]));let p=this.device.createBuffer({size:e.byteLength,usage:d|c.GPUBufferUsage.COPY_SRC});this.device.queue.writeBuffer(p,0,e);let g=this.device.createBuffer({size:o*u*4,usage:d|c.GPUBufferUsage.COPY_SRC});this.dispatch("rwkv_wkv7",[f,this.buf(r,d),this.buf(t,d),this.buf(n,d),this.buf(i,d),this.buf(a,d),this.buf(s,d),p,g],this.grid1D(o*u));let m=await this.readBack(p,e.byteLength),b=await this.readBack(g,o*u*4);return p.destroy?.(),g.destroy?.(),{S:m,y:b}}async rwkvTokenShift(e,r,t,n){let i=globalThis,a=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,s=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(s,0,new Uint32Array([n]));let o=this.device.createBuffer({size:6*n*4,usage:a|i.GPUBufferUsage.COPY_SRC});this.dispatch("rwkv_token_shift",[s,this.buf(e,a),this.buf(r,a),this.buf(t,a),o],this.grid1D(n*6));let u=await this.readBack(o,6*n*4);return o.destroy?.(),u}async lfm2ShortConv(e,r,t,n,i){let a=globalThis,s=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,o=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([n,i]));let u=this.buf(r,s|a.GPUBufferUsage.COPY_SRC),c=this.device.createBuffer({size:n*4,usage:s|a.GPUBufferUsage.COPY_SRC});this.dispatch("lfm2_shortconv",[o,this.buf(e,s),this.buf(t,s),u,c],this.grid1D(n));let d=await this.readBack(c,n*4),f=await this.readBack(u,(i-1)*n*4);return c.destroy?.(),u.destroy?.(),{out:d,state:f}}async matmulQ8(e,r,t,n,i,a){let s=globalThis,o=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,i,a]));let c=this.device.createBuffer({size:n*a*4,usage:o|s.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8",[u,this.buf(e,o),r,t,c],[Math.ceil(n/8),Math.ceil(a/8),1],c,n*a*4)}async matmulQ8Tiled(e,r,t,n,i,a){let s=globalThis,o=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,i,a]));let c=this.device.createBuffer({size:n*a*4,usage:o|s.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_tiled",[u,this.buf(e,o),r,t,c],[Math.ceil(Math.ceil(n/4)/8),Math.ceil(a/8),1],c,n*a*4)}async matmulQ8Shared(e,r,t,n,i,a){let s=globalThis,o=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,i,a]));let c=this.device.createBuffer({size:n*a*4,usage:o|s.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_shared",[u,this.buf(e,o),r,t,c],[Math.ceil(a/64),Math.ceil(n/32),1],c,n*a*4)}async matmulQ8Shared2(e,r,t,n,i,a){let s=globalThis,o=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,i,a]));let c=this.device.createBuffer({size:n*a*4,usage:o|s.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_shared2",[u,this.buf(e,o),r,t,c],[Math.ceil(a/128),Math.ceil(n/64),1],c,n*a*4)}async matmulQ4Shared2(e,r,t,n,i,a,s){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([i,a,s]));let d=this.device.createBuffer({size:i*s*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_shared2",[c,this.buf(e,u),r,t,n,d],[Math.ceil(s/128),Math.ceil(i/64),1],d,i*s*4)}uniformOf(e){let r=globalThis,t=this.uniformPool.get(e);if(t&&t.length){let i=t.pop();return this.pooled.delete(i),i}let n=this.device.createBuffer({size:e,usage:r.GPUBufferUsage.UNIFORM|r.GPUBufferUsage.COPY_DST});return this.uniformSize.set(n,e),n}uniform(e,r){let t=this.uniformOf(32);if(this.device.queue.writeBuffer(t,0,new Uint32Array(e)),r){let n=Array.isArray(r.value)?r.value:[r.value];this.device.queue.writeBuffer(t,r.offset,new Float32Array(n))}return t}attnUniform(e,r,t,n,i,a,s,o,u){let c=this.uniformOf(48);return this.device.queue.writeBuffer(c,0,new Uint32Array([e,r,t,n,i,a])),this.device.queue.writeBuffer(c,24,new Float32Array([s,o])),this.device.queue.writeBuffer(c,32,new Uint32Array([u])),c}recMatmulT(e,r,t,n,i,a,s,o=!1){let u=this.uniform([i,a,s]),c=this.storage(i*s*4),d=this.matmulTPlan(i,a,s,o);return this.recordPass(e,d.shader,[u,t,n,c],d.grid),r.push(u,c),c}recConv2dDirect(e,r,t,n,i,a,s,o,u,c,d,f,p){let g=Math.floor((s+2*p-c)/f)+1,m=Math.floor((o+2*p-d)/f)+1,b=u*g*m,k=this.uniformOf(48);if(this.device.queue.writeBuffer(k,0,new Uint32Array([a,s,o,u,c,d,f,p,g,m])),c===3&&d===3&&f===1&&p===1&&this.convTiledOk){let S=this.storage(b*4);return this.recordPass(e,"conv2d_3x3_tiled",[k,t,n,i,S],[Math.ceil(m/16),Math.ceil(g/16),u]),r.push(k,S),S}let B=this.storage(b*4);return this.recordPass(e,"conv2d_direct",[k,t,n,i,B],this.grid1D(b)),r.push(k,B),B}recConv2dDirectQ8(e,r,t,n,i,a,s,o,u,c,d,f,p){let g=Math.floor((s+2*p-c)/f)+1,m=Math.floor((o+2*p-d)/f)+1,b=u*g*m,k=this.uniformOf(48);if(this.device.queue.writeBuffer(k,0,new Uint32Array([a,s,o,u,c,d,f,p,g,m])),c===3&&d===3&&f===1&&p===1&&this.convTiledQOk){let S=this.storage(b*4);return this.recordPass(e,"conv2d_3x3_tiled_q8",[k,t,n.codes,n.sc,i,S],[Math.ceil(m/16),Math.ceil(g/16),Math.ceil(u/8)]),r.push(k,S),S}if(c===1&&d===1&&f===1&&p===0&&this.convTiledQOk){let S=this.storage(b*4);return this.recordPass(e,"conv2d_1x1_q8",[k,t,n.codes,n.sc,i,S],[Math.ceil(m/16),Math.ceil(g/16),Math.ceil(u/8)]),r.push(k,S),S}if(c===3&&d===3&&f===2&&p===1&&this.convTiledQOk&&this.convS2Ok){let S=this.storage(b*4);return this.recordPass(e,"conv2d_3x3_s2_tiled_q8",[k,t,n.codes,n.sc,i,S],[Math.ceil(m/16),Math.ceil(g/8),Math.ceil(u/8)]),r.push(k,S),S}let B=this.storage(b*4);return this.recordPass(e,"conv2d_direct_q8",[k,t,n.codes,n.sc,i,B],this.grid1D(b)),r.push(k,B),B}recConv2dDirectQ4(e,r,t,n,i,a,s,o,u,c,d,f,p){let g=Math.floor((s+2*p-c)/f)+1,m=Math.floor((o+2*p-d)/f)+1,b=u*g*m,k=this.uniformOf(48);if(this.device.queue.writeBuffer(k,0,new Uint32Array([a,s,o,u,c,d,f,p,g,m])),c===3&&d===3&&f===1&&p===1&&this.convTiledQOk){let S=this.storage(b*4);return this.recordPass(e,"conv2d_3x3_tiled_q4",[k,t,n.nib,n.sc,n.mn,i,S],[Math.ceil(m/16),Math.ceil(g/16),Math.ceil(u/8)]),r.push(k,S),S}if(c===1&&d===1&&f===1&&p===0&&this.convTiledQOk){let S=this.storage(b*4);return this.recordPass(e,"conv2d_1x1_q4",[k,t,n.nib,n.sc,n.mn,i,S],[Math.ceil(m/16),Math.ceil(g/16),Math.ceil(u/8)]),r.push(k,S),S}if(c===3&&d===3&&f===2&&p===1&&this.convTiledQOk&&this.convS2Ok){let S=this.storage(b*4);return this.recordPass(e,"conv2d_3x3_s2_tiled_q4",[k,t,n.nib,n.sc,n.mn,i,S],[Math.ceil(m/16),Math.ceil(g/8),Math.ceil(u/8)]),r.push(k,S),S}let B=this.storage(b*4);return this.recordPass(e,"conv2d_direct_q4",[k,t,n.nib,n.sc,n.mn,i,B],this.grid1D(b)),r.push(k,B),B}recGroupNorm(e,r,t,n,i,a,s,o,u){let c=this.uniform([a,s,o],{offset:12,value:u}),d=this.storage(a*s*4),f=this.hasSubgroups&&this.subgroupsOk?"group_norm_subgroup":"group_norm";return this.recordPass(e,f,[c,t,n,i,d],[o,1,1]),r.push(c,d),d}recUnary(e,r,t,n,i){let a=this.storage(i*4);return this.recordPass(e,t,[n,a],this.grid1D(i)),r.push(a),a}recLayernorm(e,r,t,n,i,a,s,o){let u=this.uniform([a,s],{offset:8,value:o}),c=this.storage(a*s*4);return this.recordPass(e,"layernorm",[u,t,n,i,c],[Math.ceil(a/se),1,1]),r.push(u,c),c}recAttentionFull(e,r,t,n,i,a,s,o,u,c,d){let f=this.uniform([a,s,o,u,c,0],{offset:24,value:[d??1/Math.sqrt(u),0]}),p=this.storage(a*s*u*4),g=a*s;return this.attnFullWgOk&&u<=192&&g<=65535?this.recordPass(e,"attention_full_wg",[f,t,n,i,p],[g,1,1]):this.recordPass(e,"attention_full",[f,t,n,i,p],[Math.ceil(g/se),1,1]),r.push(f,p),p}recUpsample(e,r,t,n,i,a,s){let o=this.uniform([n,i,a,s]),u=n*(i*s)*(a*s),c=this.storage(u*4);return this.recordPass(e,"upsample_nearest",[o,t,c],this.grid1D(u)),r.push(o,c),c}recConcat(e,r,t,n,i,a,s){let o=this.storage((i+a)*s*4);return e.copyBufferToBuffer(t,0,o,0,i*s*4),e.copyBufferToBuffer(n,0,o,i*s*4,a*s*4),r.push(o),o}recAddChannelBias(e,r,t,n,i,a){let s=this.uniform([i,a]),o=this.storage(i*a*4);return this.recordPass(e,"add_channel_bias",[s,t,n,o],this.grid1D(i*a)),r.push(s,o),o}recTranspose(e,r,t,n,i){let a=this.uniform([n,i]),s=this.storage(n*i*4);return this.recordPass(e,"transpose2d",[a,t,s],this.grid1D(n*i)),r.push(a,s),s}recGegluSplit(e,r,t,n,i){let a=this.uniform([n,i]),s=this.storage(n*i*4);return this.recordPass(e,"geglu_split",[a,t,s],this.grid1D(n*i)),r.push(a,s),s}recUpscale2x(e,r,t,n,i,a,s=.5){let o=this.uniform([n,i,a],{offset:12,value:s}),u=a*2,c=i*2,d=this.storage(n*c*u*4);return this.recordPass(e,"upscale2x_enhanced",[o,t,d],[Math.ceil(u/16),Math.ceil(c/16),n]),r.push(o,d),d}recVideoGather(e,r,t,n,i,a){let s=this.uniform([n,i,a]),o=this.storage(a*n*i*4);return this.recordPass(e,"video_motion_gather",[s,t,o],this.grid1D(a*n*i)),r.push(s,o),o}recVideoScatter(e,r,t,n,i,a,s){let o=this.uniform([i,a,s]),u=this.storage(i*a*s*4);return this.recordPass(e,"video_motion_scatter",[o,t,n,u],this.grid1D(i*a*s)),r.push(o,u),u}recVideoAddPe(e,r,t,n,i,a,s){let o=this.uniform([i,a,s]),u=this.storage(s*i*a*4);return this.recordPass(e,"video_add_pe",[o,t,n,u],this.grid1D(s*i*a)),r.push(o,u),u}recAttnTemporal(e,r,t,n,i,a,s,o,u){let c=this.uniform([a,s,o,u],{offset:16,value:1/Math.sqrt(u)}),d=this.storage(a*s*o*u*4);return this.recordPass(e,"attn_temporal",[c,t,n,i,d],this.grid1D(a*s*o)),r.push(c,d),d}recordingSession(){let e=this.device.createCommandEncoder(),r=[],t=n=>{if(n instanceof Float32Array){let i=this.uploadGpu(n);return r.push(i),i}return n};return{conv2d:(n,i,a,s,o,u,c,d,f,p,g)=>i&&i.nib?this.recConv2dDirectQ4(e,r,t(n),i,t(a),s,o,u,c,d,f,p,g):i&&i.codes?this.recConv2dDirectQ8(e,r,t(n),i,t(a),s,o,u,c,d,f,p,g):this.recConv2dDirect(e,r,t(n),t(i),t(a),s,o,u,c,d,f,p,g),groupNorm:(n,i,a,s,o,u,c)=>this.recGroupNorm(e,r,t(n),t(i),t(a),s,o,u,c),silu:(n,i)=>this.recUnary(e,r,"silu",t(n),i),quickGelu:(n,i)=>this.recUnary(e,r,"quick_gelu",t(n),i),gelu:(n,i)=>this.recUnary(e,r,"gelu",t(n),i),relu:(n,i)=>this.recUnary(e,r,"relu",t(n),i),add:(n,i,a)=>this.recBinary(e,r,"add",t(n),t(i),a),geglu:(n,i,a)=>this.recBinary(e,r,"geglu",t(n),t(i),a),matmulT:(n,i,a,s,o)=>this.recMM(e,r,t(n),i instanceof Float32Array?t(i):i,a,s,o,!1),addBias:(n,i,a,s)=>this.recAddBias(e,r,t(n),t(i),a,s),addChannelBias:(n,i,a,s)=>this.recAddChannelBias(e,r,t(n),t(i),a,s),attentionFull:(n,i,a,s,o,u,c,d)=>this.recAttentionFull(e,r,t(n),t(i),t(a),s,o,u,c,d),rope2d:(n,i,a,s,o,u)=>{let c=i instanceof Uint32Array?(()=>{let d=this.uploadGpuRaw(new Uint8Array(i.buffer,i.byteOffset,i.byteLength));return r.push(d),d})():i;return this.recRope2d(e,r,t(n),c,a,s,o,u)},attention:(n,i,a,s,o,u,c,d,f)=>this.recAttention(e,r,t(n),t(i),t(a),s,o,u,c,d,f),upsample:(n,i,a,s,o)=>this.recUpsample(e,r,t(n),i,a,s,o),upscale2x:(n,i,a,s,o=.5)=>this.recUpscale2x(e,r,t(n),i,a,s,o),layernorm:(n,i,a,s,o,u)=>this.recLayernorm(e,r,t(n),t(i),t(a),s,o,u),concat:(n,i,a,s,o)=>this.recConcat(e,r,t(n),t(i),a,s,o),transpose:(n,i,a)=>this.recTranspose(e,r,t(n),i,a),gegluSplit:(n,i,a)=>this.recGegluSplit(e,r,t(n),i,a),videoGather:(n,i,a,s)=>this.recVideoGather(e,r,t(n),i,a,s),videoScatter:(n,i,a,s,o)=>this.recVideoScatter(e,r,t(n),t(i),a,s,o),videoAddPe:(n,i,a,s,o)=>this.recVideoAddPe(e,r,t(n),t(i),a,s,o),attnTemporal:(n,i,a,s,o,u,c)=>this.recAttnTemporal(e,r,t(n),t(i),t(a),s,o,u,c),alloc:n=>{let i=this.storage(n);return r.push(i),i},copy:(n,i,a,s,o)=>{e.copyBufferToBuffer(a,s,n,i,o)},finish:async(n,i)=>{this.device.queue.submit([e.finish()]);let a=await this.readBack(n,i*4);return this.release(r),a},finishKeep:n=>{this.device.queue.submit([e.finish()]);let i=r.indexOf(n);return i>=0&&r.splice(i,1),this.release(r),n},finishKeepMany:n=>{this.device.queue.submit([e.finish()]);for(let i of n){let a=r.indexOf(i);a>=0&&r.splice(a,1)}return this.release(r),n}}}readGpu(e,r){return this.readBack(e,r*4)}trimPool(e=64<<20){let r=[...this.bufferPool.keys()].sort((n,i)=>i-n),t=0;for(let n of this.bufferPool.values())for(let i of n)t+=this.poolSize.get(i)??0;for(let n of r){let i=this.bufferPool.get(n);for(;i.length&&t>e;){let a=i.pop();this.pooled.delete(a),this.poolSize.delete(a),a.destroy?.(),t-=n}}}releaseGpu(e){this.release(e)}waitGpu(){return this.device.queue.onSubmittedWorkDone()}async benchMatmul(e,r,t,n,i,a={}){let{iters:s=10,shared:o=!0,shared2:u=!0,wF16:c=!1}=a,d=this.f16SharedOk,f=this.qSharedOk,p=this.qShared2Ok;this.f16SharedOk=o,this.qSharedOk=o,this.qShared2Ok=o&&u;let g=this.uploadGpu(e),m=[],b=this.device.createCommandEncoder();this.recMM(b,m,g,r,t,n,i,c),this.device.queue.submit([b.finish()]),await this.device.queue.onSubmittedWorkDone();let k=this.device.createCommandEncoder();for(let q=0;q<s;q++)this.recMM(k,m,g,r,t,n,i,c);let B=performance.now();this.device.queue.submit([k.finish()]),await this.device.queue.onSubmittedWorkDone();let S=(performance.now()-B)/s;return this.release(m),g.destroy?.(),this.f16SharedOk=d,this.qSharedOk=f,this.qShared2Ok=p,S}destroy(){try{this.profiler?.destroy()}catch{}this.profiler=null;try{this.device?.destroy?.()}catch{}this.bufferPool.clear(),this.uniformPool.clear()}f16ToF32Gpu(e,r){let t=this.uploadGpuRawF16(e),n=this.device.createBuffer({size:r*4,usage:ee.STORAGE_USAGE}),i=this.uniformOf(16);return this.device.queue.writeBuffer(i,0,new Uint32Array([r])),this.dispatch("f16_to_f32",[i,t,n],this.grid1D(Math.ceil(r/2))),t.destroy?.(),this.release([i]),n}quantizeQ8Gpu(e){let r=e instanceof Float32Array?e.length:e.n;if(r%32!==0)return this.uploadGpu(e);let t=e instanceof Float32Array?this.buf(e,ee.STORAGE_USAGE):this.f16ToF32Gpu(e.f16,r),n=this.f32ToQ8Gpu(t,r);return t.destroy?.(),n}async validateResidentOps(){let e=globalThis,r=x=>Float32Array.from({length:x},()=>(Math.random()*2-1)*.5),t=(x,y,P=.005)=>x.length===y.length&&x.every((U,G)=>Math.abs(U-y[G])<=P*(1+Math.abs(y[G]))),n=4,i=4,a=4,s=4,o=2,u=1e-5,c=s*i*a,d=r(n*i*a),f=r(s*n*9),p=r(s),g=r(s),m=r(s),b=await this.silu(await this.groupNorm(await this.conv2dDirect(d,f,p,n,i,a,s,3,3,1,1),g,m,s,i*a,o,u)),k=[],B=this.device.createCommandEncoder(),S=this.uploadGpu(d),q=this.uploadGpu(f),M=this.uploadGpu(p),E=this.uploadGpu(g),A=this.uploadGpu(m);k.push(S,q,M,E,A);let w=this.recConv2dDirect(B,k,S,q,M,n,i,a,s,3,3,1,1);w=this.recGroupNorm(B,k,w,E,A,s,i*a,o,u),w=this.recUnary(B,k,"silu",w,c);let v=this.device.createBuffer({size:c*4,usage:e.GPUBufferUsage.COPY_DST|e.GPUBufferUsage.MAP_READ});B.copyBufferToBuffer(w,0,v,0,c*4),this.device.queue.submit([B.finish()]),await v.mapAsync(e.GPUMapMode.READ);let h=new Float32Array(v.getMappedRange().slice(0));return v.unmap(),v.destroy(),this.release(k),t(h,b)?null:"resident_ops"}recMatmulQ4(e,r,t,n,i,a,s){let o=this.uniform([i,a,s]),u=this.storage(i*s*4);if(i===1&&this.gemvOk){let c=this.gemvGrid(s);this.recordPass(e,"matmul_t_q4_vec",[this.uniform([i,a,s,c.stride]),t,n.nib,n.sc,n.mn,u],c.grid)}else i>=64&&this.qSharedOk&&this.qShared2Ok?this.recordPass(e,"matmul_t_q4_shared2",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(s/128),Math.ceil(i/64),1]):i>=32&&this.qSharedOk?this.recordPass(e,"matmul_t_q4_shared",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(s/64),Math.ceil(i/32),1]):i>=2?this.recordPass(e,"matmul_t_q4_tiled",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(Math.ceil(i/4)/8),Math.ceil(s/8),1]):this.recordPass(e,"matmul_t_q4",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(i/8),Math.ceil(s/8),1]);return r.push(o,u),u}recMatmulQ8(e,r,t,n,i,a,s){let o=this.uniform([i,a,s]),u=this.storage(i*s*4);if(i===1&&this.gemvOk){let c=this.gemvGrid(s);this.recordPass(e,"matmul_t_q8_vec",[this.uniform([i,a,s,c.stride]),t,n.codes,n.sc,u],c.grid)}else i>=64&&this.qSharedOk&&this.qShared2Ok?this.recordPass(e,"matmul_t_q8_shared2",[o,t,n.codes,n.sc,u],[Math.ceil(s/128),Math.ceil(i/64),1]):i>=32&&this.qSharedOk?this.recordPass(e,"matmul_t_q8_shared",[o,t,n.codes,n.sc,u],[Math.ceil(s/64),Math.ceil(i/32),1]):i>=2?this.recordPass(e,"matmul_t_q8_tiled",[o,t,n.codes,n.sc,u],[Math.ceil(Math.ceil(i/4)/8),Math.ceil(s/8),1]):this.recordPass(e,"matmul_t_q8",[o,t,n.codes,n.sc,u],[Math.ceil(i/8),Math.ceil(s/8),1]);return r.push(o,u),u}gemvGrid(e){return e<=32768?{grid:[e,1,1],stride:32768}:{grid:[32768,Math.ceil(e/32768),1],stride:32768}}async matmulQ4Vec(e,r,t,n,i,a){let s=globalThis,o=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,u=this.gemvGrid(a),c=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([1,i,a,u.stride]));let d=this.device.createBuffer({size:a*4,usage:o|s.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_vec",[c,this.buf(e,o),r,t,n,d],u.grid,d,a*4)}async matmulQ8Vec(e,r,t,n,i){let a=globalThis,s=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,o=this.gemvGrid(i),u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([1,n,i,o.stride]));let c=this.device.createBuffer({size:i*4,usage:s|a.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_vec",[u,this.buf(e,s),r,t,c],o.grid,c,i*4)}recMatmulQ3(e,r,t,n,i,a,s){let o=this.uniform([i,a,s]),u=this.storage(i*s*4);return this.recordPass(e,"matmul_t_q3",[o,t,n.lo,n.hi,n.sc,n.mn,u],[Math.ceil(i/8),Math.ceil(s/8),1]),r.push(o,u),u}recMM(e,r,t,n,i,a,s,o){return n&&n.q3?this.recMatmulQ3(e,r,t,n,i,a,s):n&&n.nib?this.recMatmulQ4(e,r,t,n,i,a,s):n&&n.codes?this.recMatmulQ8(e,r,t,n,i,a,s):this.recMatmulT(e,r,t,n,i,a,s,o)}recRmsnorm(e,r,t,n,i,a,s,o=!1){let u=this.uniform([i,a,0,o?1:0],{offset:8,value:s}),c=this.storage(i*a*4);if(this.rmsVecOk&&i<=65535){let d=this.hasSubgroups&&this.subgroupsOk?"rmsnorm_vec_subgroup":"rmsnorm_vec";this.recordPass(e,d,[u,t,n,c],[i,1,1])}else this.recordPass(e,"rmsnorm",[u,t,n,c],[Math.ceil(i/se),1,1]);return r.push(u,c),c}recRope(e,r,t,n,i,a,s,o,u=!1){let c=this.uniform([n,i,a,s],{offset:16,value:o});this.device.queue.writeBuffer(c,20,new Uint32Array([u?1:0]));let d=this.storage(n*i*4);return this.recordPass(e,"rope",[c,t,d],[Math.ceil(n/se),1,1]),r.push(c,d),d}recRopeMrope(e,r,t,n,i,a,s,o,u){let c=u[0],d=u[0]+u[1],f=this.uniform([i,a,s,c,d],{offset:20,value:o}),p=this.storage(i*a*4);return this.recordPass(e,"rope_mrope",[f,t,n,p],[Math.ceil(i/se),1,1]),r.push(f,p),p}preparePositions(e,r){if(e.positions&&e.mropeSections){let t=this.storage(e.positions.byteLength);this.device.queue.writeBuffer(t,0,e.positions),r.push(t),e._posGpu=t}if(e.ropeFactors){let t=this.storage(e.ropeFactors.byteLength);this.device.queue.writeBuffer(t,0,e.ropeFactors),r.push(t),e._ffGpu=t}}recRope2d(e,r,t,n,i,a,s,o){let u=this.uniform([i,a,s,0],{offset:16,value:o}),c=this.storage(i*a*4);return this.recordPass(e,"rope_2d",[u,t,n,c],[Math.ceil(i/se),1,1]),r.push(u,c),c}recRopeFactors(e,r,t,n,i,a,s,o,u,c=!1){let d=this.uniform([i,a,s,o],{offset:16,value:u});this.device.queue.writeBuffer(d,20,new Uint32Array([c?1:0]));let f=this.storage(i*a*4);return this.recordPass(e,"rope_factors",[d,t,n,f],[Math.ceil(i/se),1,1]),r.push(d,f),f}recAttention(e,r,t,n,i,a,s,o,u,c,d,f,p=0,g=0){let m=this.attnUniform(a,s,o,u,c,d,f??1/Math.sqrt(u),p,g),b=this.storage(a*s*u*4);return this.attnDecodeOk&&a*s<256&&u<=128?this.recordPass(e,"attention_decode",[m,t,n,i,b],[a*s,1,1]):this.attnPrefillOk&&u<=128?this.recordPass(e,"attention_prefill",[m,t,n,i,b],[Math.ceil(a/4)*s,1,1]):this.recordPass(e,"attention",[m,t,n,i,b],[Math.ceil(a*s/se),1,1]),r.push(m,b),b}recQuantizeKv(e,r,t,n,i,a,s,o,u){let c=this.uniform([a,s,o,u]);this.recordPass(e,"quantize_kv",[c,t,n,i],this.grid1D(a*s)),r.push(c)}recAttentionQ8(e,r,t,n,i,a,s,o,u,c,d,f,p,g,m=0,b=0){let k=this.attnUniform(o,u,c,d,f,p,g??1/Math.sqrt(d),m,b),B=this.storage(o*u*d*4);return this.attnDecodeOk&&o*u<256&&d<=128?this.recordPass(e,"attention_decode_q8kv",[k,t,n,i,a,s,B],[o*u,1,1]):this.attnPrefillOk&&d<=128?this.recordPass(e,"attention_prefill_q8kv",[k,t,n,i,a,s,B],[Math.ceil(o/4)*u,1,1]):this.recordPass(e,"attention_q8kv",[k,t,n,i,a,s,B],[Math.ceil(o*u/se),1,1]),r.push(k,B),B}recAddBias(e,r,t,n,i,a){let s=this.uniform([i,a]),o=this.storage(i*a*4);return this.recordPass(e,"addbias",[s,t,n,o],this.grid1D(i*a)),r.push(s,o),o}recBinary(e,r,t,n,i,a){let s=this.storage(a*4);return this.recordPass(e,t,[n,i,s],this.grid1D(a)),r.push(s),s}recLfm2ShortConv(e,r,t,n,i,a,s){let o=this.uniform([a,s]),u=this.storage(a*4);return this.recordPass(e,"lfm2_shortconv",[o,t,i,n,u],this.grid1D(a)),r.push(o,u),u}recordLayerKV(e,r,t,n,i,a,s){let o=s.k,u=s.v,{seq:c,d,nHeads:f,nKvHeads:p,headDim:g,ffn:m,ropeTheta:b,eps:k}=n,B=p*g,S=a+c,q=i.matF16===!0,M=f*g,E=n.rmsGainOnePlus===!0,A=n.attnLogitSoftcap??0,w=n.act==="gelu"?"geglu":"swiglu",v=this.recRmsnorm(e,r,t,i.attnNorm,c,d,k,E),h=this.recMM(e,r,v,i.wq,c,d,M,q),x=this.recMM(e,r,v,i.wk,c,d,B,q),y=this.recMM(e,r,v,i.wv,c,d,B,q);i.bq&&(h=this.recAddBias(e,r,h,i.bq,c,M)),i.bk&&(x=this.recAddBias(e,r,x,i.bk,c,B)),i.bv&&(y=this.recAddBias(e,r,y,i.bv,c,B)),i.qNorm&&(h=this.recRmsnorm(e,r,h,i.qNorm,c*f,g,k,E)),i.kNorm&&(x=this.recRmsnorm(e,r,x,i.kNorm,c*p,g,k,E));let P=n._posGpu,U=n._ffGpu,G=n.ropeInterleaved===!0,_=(W,O,R)=>n.skipRope?W:P?this.recRopeMrope(e,r,W,P,O,g,R,b,n.mropeSections):U?this.recRopeFactors(e,r,W,U,O,g,R,a,b,G):this.recRope(e,r,W,O,g,R,a,b,G),F=_(h,c*f,f),C=_(x,c*p,p),D;if(s.kScale)this.recQuantizeKv(e,r,C,o,s.kScale,c,p,g,a),this.recQuantizeKv(e,r,y,u,s.vScale,c,p,g,a),D=this.recAttentionQ8(e,r,F,o,s.kScale,u,s.vScale,c,f,p,g,S,a,n.attnScale,A,n.window??0);else{let W=B*4;e.copyBufferToBuffer(C,0,o,a*W,c*W),e.copyBufferToBuffer(y,0,u,a*W,c*W),D=this.recAttention(e,r,F,o,u,c,f,p,g,S,a,n.attnScale,A,n.window??0)}let T=this.recMM(e,r,D,i.wo,c,M,d,q);i.postAttnNorm&&(T=this.recRmsnorm(e,r,T,i.postAttnNorm,c,d,k,E));let L=this.recBinary(e,r,"add",t,T,c*d),N=this.recRmsnorm(e,r,L,i.ffnNorm,c,d,k,E),Q=this.recMM(e,r,N,i.wgate,c,d,m,q),Y=this.recMM(e,r,N,i.wup,c,d,m,q),$=this.recBinary(e,r,w,Q,Y,c*m),J=this.recMM(e,r,$,i.wdown,c,m,d,q);return i.postFfnNorm&&(J=this.recRmsnorm(e,r,J,i.postFfnNorm,c,d,k,E)),this.recBinary(e,r,"add",L,J,c*d)}setKvQuant(e){this.kvQuant!==e&&(this.kvQuant=e,this.resetKvGpu())}resetKvGpu(){for(let e of this.kvGpu.values())e.k.destroy?.(),e.v.destroy?.(),e.kScale?.destroy?.(),e.vScale?.destroy?.();this.kvGpu.clear(),this.kvSession="";for(let e of this.bufferPool.values())for(let r of e)r.destroy?.();this.bufferPool.clear()}clearKvCache(){this.resetKvGpu()}ensureKv(e,r,t,n){let i=this.kvGpu.get(e);if(i&&i.cap>=r)return i;let a=Math.max(r,(i?.cap??0)+1024,1024),s=this.kvQuant,o=this.storage(a*t*(s?1:4)),u=this.storage(a*t*(s?1:4)),c=s?this.storage(a*n*4):void 0,d=s?this.storage(a*n*4):void 0;if(i){let p=this.device.createCommandEncoder();p.copyBufferToBuffer(i.k,0,o,0,i.cap*t*(s?1:4)),p.copyBufferToBuffer(i.v,0,u,0,i.cap*t*(s?1:4)),s&&i.kScale&&(p.copyBufferToBuffer(i.kScale,0,c,0,i.cap*n*4),p.copyBufferToBuffer(i.vScale,0,d,0,i.cap*n*4)),this.device.queue.submit([p.finish()]),i.k.destroy?.(),i.v.destroy?.(),i.kScale?.destroy?.(),i.vScale?.destroy?.()}let f={k:o,v:u,cap:a,kScale:c,vScale:d};return this.kvGpu.set(e,f),f}async runDecodeGpu(e,r,t,n,i,a){let{seq:s,d:o,nKvHeads:u,headDim:c,eps:d}=r,f=u*c,p=n+s;(a!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${a}" inconnue avec pastLen=${n} : cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=a);for(let q=0;q<t.length;q++)this.ensureKv(q,p,f,u);let g=[];this.preparePositions(r,g);let m=this.device.createCommandEncoder(),b=this.storage(e.byteLength);this.device.queue.writeBuffer(b,0,e),g.push(b);for(let q=0;q<t.length;q++){let M=this.kvGpu.get(q);b=this.recordLayerKV(m,g,b,vt(r,s,q,this.swaOk),t[q],n,M)}let k=this.recRmsnorm(m,g,b,i,s,o,d,r.rmsGainOnePlus===!0),B=this.storage(o*4);m.copyBufferToBuffer(k,(s-1)*o*4,B,0,o*4),this.device.queue.submit([m.finish()]);let S=await this.readBack(B,o*4);return g.push(B),this.release(g),S}async decodeLogitsQ8(e,r,t,n,i,a,s,o){let u=globalThis,{seq:c,d,nKvHeads:f,headDim:p,eps:g}=r,m=f*p,b=n+c;(a!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${a}" inconnue avec pastLen=${n} : cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=a);for(let v=0;v<t.length;v++)this.ensureKv(v,b,m,f);let k=[];this.preparePositions(r,k);let B=this.device.createCommandEncoder(),S=this.storage(e.byteLength);this.device.queue.writeBuffer(S,0,e),k.push(S);for(let v=0;v<t.length;v++){let h=this.kvGpu.get(v);S=this.recordLayerKV(B,k,S,vt(r,c,v,this.swaOk),t[v],n,h)}let q=this.recRmsnorm(B,k,S,i,c,d,g,r.rmsGainOnePlus===!0),M=this.storage(d*4);B.copyBufferToBuffer(q,(c-1)*d*4,M,0,d*4),k.push(M);let E=this.storage(o*4);k.push(E);for(let v of s){let h=this.recMM(B,k,M,v.w,1,d,v.rows,!1);B.copyBufferToBuffer(h,0,E,v.r0*4,v.rows*4)}let A=this.device.createBuffer({size:o*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});B.copyBufferToBuffer(E,0,A,0,o*4),this.device.queue.submit([B.finish()]),await A.mapAsync(u.GPUMapMode.READ);let w=new Float32Array(A.getMappedRange().slice(0));return A.unmap(),A.destroy(),this.release(k),w}async decodeTopKQ8(e,r,t,n,i,a,s,o,u,c,d,f=64){let p=globalThis,{seq:g,d:m,nKvHeads:b,headDim:k,eps:B}=r,S=b*k,q=n+g;(a!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${a}" inconnue avec pastLen=${n} : cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=a);for(let _=0;_<t.length;_++)this.ensureKv(_,q,S,b);let M=ee.timingOn?(_,F)=>console.info(`[timing:gpu] ${_} ${(performance.now()-F).toFixed(0)} ms`):null,E=performance.now(),A=[];this.preparePositions(r,A);let w=this.device.createCommandEncoder(),v=this.storage(e.byteLength);this.device.queue.writeBuffer(v,0,e),A.push(v);for(let _=0;_<t.length;_++){let F=this.kvGpu.get(_);v=this.recordLayerKV(w,A,v,vt(r,g,_,this.swaOk),t[_],n,F)}let h=this.recRmsnorm(w,A,v,i,g,m,B,r.rmsGainOnePlus===!0),x=this.storage(m*4);w.copyBufferToBuffer(h,(g-1)*m*4,x,0,m*4),A.push(x);let y=this.storage(o*4);A.push(y);for(let _ of s){let F=this.recMM(w,A,x,_.w,1,m,_.rows,!1);w.copyBufferToBuffer(F,0,y,_.r0*4,_.rows*4)}if(d&&d>0){let _=this.uniform([o],{offset:4,value:d});this.recordPass(w,"softcap_logits",[_,y],this.grid1D(o)),A.push(_)}if(c&&c!==1&&u.length){let _=Uint32Array.from(u),F=this.bufU32(_,p.GPUBufferUsage.STORAGE|p.GPUBufferUsage.COPY_DST),C=this.uniform([_.length],{offset:4,value:c});this.recordPass(w,"penalize_logits",[C,F,y],this.grid1D(_.length)),A.push(C,F)}let P=this.storage(f*2*4);A.push(P);{let _=this.uniform([o,f]);this.recordPass(w,this.topKParOk?"top_k_par":"top_k",[_,y,P],[1,1,1]),A.push(_)}let U=this.device.createBuffer({size:f*2*4,usage:p.GPUBufferUsage.COPY_DST|p.GPUBufferUsage.MAP_READ});w.copyBufferToBuffer(P,0,U,0,f*2*4),M?.("enregistrement des passes (compilation des pipelines incluse)",E),E=performance.now(),this.device.queue.submit([w.finish()]),await U.mapAsync(p.GPUMapMode.READ),M?.("execution GPU (submit + readback)",E);let G=new Uint32Array(U.getMappedRange().slice(0));return U.unmap(),U.destroy(),this.release(A),{ids:G.slice(0,f),vals:new Float32Array(G.buffer,f*4,f)}}resetLfm2State(){for(let e of this.lfm2KvGpu.values())e.k.destroy?.(),e.v.destroy?.();for(let e of this.lfm2ConvGpu.values())e.destroy?.();this.lfm2KvGpu.clear(),this.lfm2ConvGpu.clear(),this.lfm2Session="";for(let e of this.bufferPool.values())for(let r of e)r.destroy?.();this.bufferPool.clear()}clearLfm2State(){this.resetLfm2State()}ensureLfm2Kv(e,r,t){let n=this.lfm2KvGpu.get(e);if(n&&n.cap>=r)return n;let i=Math.max(r,(n?.cap??0)+1024,1024),a=this.storage(i*t*4),s=this.storage(i*t*4);if(n){let u=this.device.createCommandEncoder();u.copyBufferToBuffer(n.k,0,a,0,n.cap*t*4),u.copyBufferToBuffer(n.v,0,s,0,n.cap*t*4),this.device.queue.submit([u.finish()]),n.k.destroy?.(),n.v.destroy?.()}let o={k:a,v:s,cap:i};return this.lfm2KvGpu.set(e,o),o}ensureLfm2Conv(e,r){let t=this.lfm2ConvGpu.get(e);return t||(t=this.storage(r*4),this.device.queue.writeBuffer(t,0,new Float32Array(r)),this.lfm2ConvGpu.set(e,t)),t}recLfm2ShortConvBatch(e,r,t,n,i,a,s,o){let u=this.uniform([a,s,o]),c=this.storage(o*a*4);this.recordPass(e,"lfm2_shortconv_batch",[u,t,i,n,c],this.grid1D(o*a));let d=this.uniform([a,s,o]);return this.recordPass(e,"lfm2_shortconv_state",[d,t,n],this.grid1D((s-1)*a)),r.push(u,d,c),c}recordLfm2(e,r,t,n,i,a,s,o){let{D:u,nHeads:c,nKvHeads:d,headDim:f,ffn:p,eps:g,theta:m,lc:b}=i,k=d*f,B=c*f,S=k*4;for(let M=0;M<a.length;M++)a[M].conv?this.ensureLfm2Conv(M,(b-1)*u):this.ensureLfm2Kv(M,o+n,k);if(n>=b-1&&this.lfm2BatchOk){let M=this.storage(n*u*4);this.device.queue.writeBuffer(M,0,t),r.push(M);for(let A=0;A<a.length;A++){let w=a[A],v=this.recRmsnorm(e,r,M,w.attnNorm,n,u,g),h;if(w.conv){let _=this.recMM(e,r,v,w.inProj,n,u,3*u,!1),F=this.recLfm2ShortConvBatch(e,r,_,this.lfm2ConvGpu.get(A),w.convW,u,b,n);h=this.recMM(e,r,F,w.outProj,n,u,u,!1)}else{let _=this.recMM(e,r,v,w.wq,n,u,B,!1),F=this.recMM(e,r,v,w.wk,n,u,k,!1),C=this.recMM(e,r,v,w.wv,n,u,k,!1);_=this.recRmsnorm(e,r,_,w.qNorm,n*c,f,g),F=this.recRmsnorm(e,r,F,w.kNorm,n*d,f,g),_=this.recRope(e,r,_,n*c,f,c,o,m),F=this.recRope(e,r,F,n*d,f,d,o,m);let D=this.lfm2KvGpu.get(A);e.copyBufferToBuffer(F,0,D.k,o*S,n*S),e.copyBufferToBuffer(C,0,D.v,o*S,n*S);let T=this.recAttention(e,r,_,D.k,D.v,n,c,d,f,o+n,o);h=this.recMM(e,r,T,w.wo,n,B,u,!1)}M=this.recBinary(e,r,"add",M,h,n*u);let x=this.recRmsnorm(e,r,M,w.ffnNorm,n,u,g),y=this.recMM(e,r,x,w.wgate,n,u,p,!1),P=this.recMM(e,r,x,w.wup,n,u,p,!1),U=this.recBinary(e,r,"swiglu",y,P,n*p),G=this.recMM(e,r,U,w.wdown,n,p,u,!1);M=this.recBinary(e,r,"add",M,G,n*u)}let E=this.storage(u*4);return r.push(E),e.copyBufferToBuffer(M,(n-1)*u*4,E,0,u*4),this.recRmsnorm(e,r,E,s,1,u,g)}let q=null;for(let M=0;M<n;M++){let E=o+M,A=this.storage(u*4);this.device.queue.writeBuffer(A,0,t.subarray(M*u,(M+1)*u)),r.push(A);for(let w=0;w<a.length;w++){let v=a[w],h=this.recRmsnorm(e,r,A,v.attnNorm,1,u,g),x;if(v.conv){let F=this.recMM(e,r,h,v.inProj,1,u,3*u,!1),C=this.recLfm2ShortConv(e,r,F,this.lfm2ConvGpu.get(w),v.convW,u,b);x=this.recMM(e,r,C,v.outProj,1,u,u,!1)}else{let F=this.recMM(e,r,h,v.wq,1,u,B,!1),C=this.recMM(e,r,h,v.wk,1,u,k,!1),D=this.recMM(e,r,h,v.wv,1,u,k,!1);F=this.recRmsnorm(e,r,F,v.qNorm,c,f,g),C=this.recRmsnorm(e,r,C,v.kNorm,d,f,g),F=this.recRope(e,r,F,c,f,c,E,m),C=this.recRope(e,r,C,d,f,d,E,m);let T=this.lfm2KvGpu.get(w);e.copyBufferToBuffer(C,0,T.k,E*S,S),e.copyBufferToBuffer(D,0,T.v,E*S,S);let L=this.recAttention(e,r,F,T.k,T.v,1,c,d,f,E+1,E);x=this.recMM(e,r,L,v.wo,1,B,u,!1)}A=this.recBinary(e,r,"add",A,x,u);let y=this.recRmsnorm(e,r,A,v.ffnNorm,1,u,g),P=this.recMM(e,r,y,v.wgate,1,u,p,!1),U=this.recMM(e,r,y,v.wup,1,u,p,!1),G=this.recBinary(e,r,"swiglu",P,U,p),_=this.recMM(e,r,G,v.wdown,1,p,u,!1);A=this.recBinary(e,r,"add",A,_,u)}M===n-1&&(q=this.recRmsnorm(e,r,A,s,1,u,g))}return q}lfm2SessionReset(e,r){(e!==this.lfm2Session||r===0)&&(r>0&&console.error(`[lfm2] session "${e}" inconnue avec pastLen=${r} : \xE9tat perdu, sortie invalide. Repartir de pastLen 0.`),this.resetLfm2State(),this.lfm2Session=e)}async lfm2PrefillGpu(e,r,t,n,i,a,s){this.lfm2SessionReset(s,a);let o=[],u=this.device.createCommandEncoder();this.recordLfm2(u,o,e,r,t,n,i,a),this.device.queue.submit([u.finish()]),await this.device.queue.onSubmittedWorkDone(),this.release(o)}async lfm2LogitsGpu(e,r,t,n,i,a,s,o){let u=globalThis;this.lfm2SessionReset(o,s);let c=[],d=this.device.createCommandEncoder(),f=this.recordLfm2(d,c,e,r,t,n,a,s),p=this.recMM(d,c,f,i,1,t.D,t.vocab,!1),g=this.device.createBuffer({size:t.vocab*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});d.copyBufferToBuffer(p,0,g,0,t.vocab*4),this.device.queue.submit([d.finish()]),await g.mapAsync(u.GPUMapMode.READ);let m=new Float32Array(g.getMappedRange().slice(0));return g.unmap(),g.destroy(),this.release(c),m}async lfm2TopKGpu(e,r,t,n,i,a,s,o,u,c,d=64){let f=globalThis;this.lfm2SessionReset(o,s);let p=[],g=this.device.createCommandEncoder(),m=this.recordLfm2(g,p,e,r,t,n,a,s),b=this.recMM(g,p,m,i,1,t.D,t.vocab,!1);if(c&&c!==1&&u.length){let q=Uint32Array.from(u),M=this.bufU32(q,f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST),E=this.uniform([q.length],{offset:4,value:c});this.recordPass(g,"penalize_logits",[E,M,b],this.grid1D(q.length)),p.push(E,M)}let k=this.storage(d*2*4);p.push(k);{let q=this.uniform([t.vocab,d]);this.recordPass(g,this.topKParOk?"top_k_par":"top_k",[q,b,k],[1,1,1]),p.push(q)}let B=this.device.createBuffer({size:d*2*4,usage:f.GPUBufferUsage.COPY_DST|f.GPUBufferUsage.MAP_READ});g.copyBufferToBuffer(k,0,B,0,d*2*4),this.device.queue.submit([g.finish()]),await B.mapAsync(f.GPUMapMode.READ);let S=new Uint32Array(B.getMappedRange().slice(0));return B.unmap(),B.destroy(),this.release(p),{ids:S.slice(0,d),vals:new Float32Array(S.buffer,d*4,d)}}resetRwkvState(){for(let e of this.rwkvStateGpu.values())e.S.destroy?.(),e.tm.destroy?.(),e.cm.destroy?.();this.rwkvStateGpu.clear(),this.rwkvVFirst?.destroy?.(),this.rwkvVFirst=null,this.rwkvSession="";for(let e of this.bufferPool.values())for(let r of e)r.destroy?.();this.bufferPool.clear()}clearRwkvState(){this.resetRwkvState()}ensureRwkvState(e,r,t,n){let i=this.rwkvStateGpu.get(e);if(!i){let a=this.storage(t*n*n*4),s=this.storage(r*4),o=this.storage(r*4);this.device.queue.writeBuffer(a,0,new Float32Array(t*n*n)),this.device.queue.writeBuffer(s,0,new Float32Array(r)),this.device.queue.writeBuffer(o,0,new Float32Array(r)),i={S:a,tm:s,cm:o},this.rwkvStateGpu.set(e,i)}return i}rwkvSessionReset(e,r){(e!==this.rwkvSession||r===0)&&(r>0&&console.error(`[rwkv] session "${e}" inconnue avec pastLen=${r} : \xE9tat perdu, sortie invalide. Repartir de pastLen 0.`),this.resetRwkvState(),this.rwkvSession=e)}recRwkvToken(e,r,t,n,i,a){let{D:s,H:o,NH:u}=n,c=1e-5,d=64e-5;for(let f=0;f<i.length;f++){let p=i[f],g=this.rwkvStateGpu.get(f),m=this.recLayernorm(e,r,t,p.attnNormW,p.attnNormB,1,s,c),b=this.storage(6*s*4);{let R=this.uniform([s]);this.recordPass(e,"rwkv_token_shift",[R,m,g.tm,p.lerpFused,b],this.grid1D(6*s)),r.push(R,b)}e.copyBufferToBuffer(m,0,g.tm,0,s*4);let k=R=>{let j=this.storage(s*4);return e.copyBufferToBuffer(b,R*s*4,j,0,s*4),r.push(j),j},B=k(0),S=k(1),q=k(2),M=k(3),E=k(4),A=k(5),w=this.recMM(e,r,B,p.R,1,s,s,!1),v=this.recMM(e,r,q,p.K,1,s,s,!1),h=this.recMM(e,r,M,p.V,1,s,s,!1),x=this.recUnary(e,r,"tanh_act",this.recMM(e,r,S,p.w1,1,s,p.rw,!1),p.rw),y=this.recMM(e,r,x,p.w2,1,p.rw,s,!1),P=this.storage(s*4);this.recordPass(e,"rwkv_decay",[p.w0,y,P],this.grid1D(s)),r.push(P);let U=this.recMM(e,r,this.recMM(e,r,E,p.a1,1,s,p.ra,!1),p.a2,1,p.ra,s,!1),G=this.storage(s*4);this.recordPass(e,"rwkv_bias_sigmoid",[p.a0,U,G],this.grid1D(s)),r.push(G);let _=this.recUnary(e,r,"sigmoid",this.recMM(e,r,A,p.g1,1,s,p.rg,!1),p.rg),F=this.recMM(e,r,_,p.g2,1,p.rg,s,!1);if(f===0)e.copyBufferToBuffer(h,0,a,0,s*4);else{let R=this.recMM(e,r,this.recMM(e,r,M,p.v1,1,s,p.rv,!1),p.v2,1,p.rv,s,!1);this.recordPass(e,"rwkv_vresid",[h,a,p.v0,R],this.grid1D(s))}let C=this.storage(s*4),D=this.storage(s*4),T=this.storage(s*4);{let R=this.uniform([u,o]);this.recordPass(e,"rwkv_kprep",[R,v,G,p.kk,p.ka,C,D,T],this.grid1D(u)),r.push(R,C,D,T)}let L=this.storage(s*4);{let R=this.uniform([u,o]);this.recordPass(e,"rwkv_wkv7",[R,w,P,C,h,D,T,g.S,L],this.grid1D(u*o)),r.push(R,L)}let N=this.storage(s*4);{let R=this.uniform([u,o],{offset:8,value:d});this.recordPass(e,"rwkv_out_gn",[R,L,w,C,p.rk,h,p.lnWB,N],this.grid1D(u)),r.push(R,N)}let Q=this.recBinary(e,r,"mul",N,F,s),Y=this.recMM(e,r,Q,p.O,1,s,s,!1);t=this.recBinary(e,r,"add",t,Y,s);let $=this.recLayernorm(e,r,t,p.attnNorm2W,p.attnNorm2B,1,s,c),J=this.storage(s*4);this.recordPass(e,"rwkv_lerp",[$,g.cm,p.lerpK,J],this.grid1D(s)),r.push(J),e.copyBufferToBuffer($,0,g.cm,0,s*4);let W=this.recUnary(e,r,"sqrelu",this.recMM(e,r,J,p.cmK,1,s,p.ffn,!1),p.ffn),O=this.recMM(e,r,W,p.cmV,1,p.ffn,s,!1);t=this.recBinary(e,r,"add",t,O,s)}return t}recordRwkv(e,r,t,n,i,a,s){let{D:o,H:u,NH:c}=i;for(let f=0;f<a.length;f++)this.ensureRwkvState(f,o,c,u);this.rwkvVFirst||(this.rwkvVFirst=this.storage(o*4));let d=null;for(let f=0;f<n;f++){let p=this.storage(o*4);this.device.queue.writeBuffer(p,0,t.subarray(f*o,(f+1)*o)),r.push(p);let g=this.recLayernorm(e,r,p,s.tokW,s.tokB,1,o,1e-5),m=this.recRwkvToken(e,r,g,i,a,this.rwkvVFirst);f===n-1&&(d=this.recLayernorm(e,r,m,s.outW,s.outB,1,o,1e-5))}return d}async rwkvPrefillGpu(e,r,t,n,i,a,s){this.rwkvSessionReset(s,a);let o=[],u=this.device.createCommandEncoder();this.recordRwkv(u,o,e,r,t,n,i),this.device.queue.submit([u.finish()]),await this.device.queue.onSubmittedWorkDone(),this.release(o)}async rwkvLogitsGpu(e,r,t,n,i,a,s,o){let u=globalThis;this.rwkvSessionReset(o,s);let c=[],d=this.device.createCommandEncoder(),f=this.recordRwkv(d,c,e,r,t,n,a),p=this.recMM(d,c,f,i,1,t.D,t.vocab,!1),g=this.device.createBuffer({size:t.vocab*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});d.copyBufferToBuffer(p,0,g,0,t.vocab*4),this.device.queue.submit([d.finish()]),await g.mapAsync(u.GPUMapMode.READ);let m=new Float32Array(g.getMappedRange().slice(0));return g.unmap(),g.destroy(),this.release(c),m}async rwkvTopKGpu(e,r,t,n,i,a,s,o,u,c,d=64){let f=globalThis;this.rwkvSessionReset(o,s);let p=[],g=this.device.createCommandEncoder(),m=this.recordRwkv(g,p,e,r,t,n,a),b=this.recMM(g,p,m,i,1,t.D,t.vocab,!1);if(c&&c!==1&&u.length){let q=Uint32Array.from(u),M=this.bufU32(q,f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST),E=this.uniform([q.length],{offset:4,value:c});this.recordPass(g,"penalize_logits",[E,M,b],this.grid1D(q.length)),p.push(E,M)}let k=this.storage(d*2*4);p.push(k);{let q=this.uniform([t.vocab,d]);this.recordPass(g,this.topKParOk?"top_k_par":"top_k",[q,b,k],[1,1,1]),p.push(q)}let B=this.device.createBuffer({size:d*2*4,usage:f.GPUBufferUsage.COPY_DST|f.GPUBufferUsage.MAP_READ});g.copyBufferToBuffer(k,0,B,0,d*2*4),this.device.queue.submit([g.finish()]),await B.mapAsync(f.GPUMapMode.READ);let S=new Uint32Array(B.getMappedRange().slice(0));return B.unmap(),B.destroy(),this.release(p),{ids:S.slice(0,d),vals:new Float32Array(S.buffer,d*4,d)}}async argmaxProjection(e,r,t,n,i=!1){let a=globalThis,s=[],o=this.device.createCommandEncoder(),u=this.storage(e.byteLength);this.device.queue.writeBuffer(u,0,e),s.push(u);let c=this.storage(n*4);s.push(c);for(let m of r){let b=this.recMatmulT(o,s,u,m.buf,1,t,m.rows,i);o.copyBufferToBuffer(b,0,c,m.r0*4,m.rows*4)}let d=this.storage(4),f=this.uniform([n]);s.push(d,f),this.recordPass(o,"argmax",[f,c,d],[1,1,1]);let p=this.device.createBuffer({size:4,usage:a.GPUBufferUsage.COPY_DST|a.GPUBufferUsage.MAP_READ});o.copyBufferToBuffer(d,0,p,0,4),this.device.queue.submit([o.finish()]),await p.mapAsync(a.GPUMapMode.READ);let g=new Uint32Array(p.getMappedRange().slice(0))[0];return p.unmap(),p.destroy(),this.release(s),g}async projectLogits(e,r,t,n,i=!1){let a=globalThis,s=[],o=this.device.createCommandEncoder(),u=this.storage(e.byteLength);this.device.queue.writeBuffer(u,0,e),s.push(u);let c=this.storage(n*4);s.push(c);for(let p of r){let g=this.recMatmulT(o,s,u,p.buf,1,t,p.rows,i);o.copyBufferToBuffer(g,0,c,p.r0*4,p.rows*4)}let d=this.device.createBuffer({size:n*4,usage:a.GPUBufferUsage.COPY_DST|a.GPUBufferUsage.MAP_READ});o.copyBufferToBuffer(c,0,d,0,n*4),this.device.queue.submit([o.finish()]),await d.mapAsync(a.GPUMapMode.READ);let f=new Float32Array(d.getMappedRange().slice(0));return d.unmap(),d.destroy(),this.release(s),f}async selfValidate(){this.validationFailure=null;let e=A=>(this.validationFailure=A,console.error("[selfValidate] FAILED at:",A,"(hasF16="+this.hasF16+")"),!1),r=(A,w)=>A.length===w.length&&A.every((v,h)=>Math.abs(v-w[h])<.001),t=A=>Float32Array.from({length:A},()=>Math.random()*2-1),n=3,i=4,a=5,s=t(n*i),o=t(i*a),u=new Float32Array(n*a);for(let A=0;A<n;A++)for(let w=0;w<a;w++){let v=0;for(let h=0;h<i;h++)v+=s[A*i+h]*o[h*a+w];u[A*a+w]=v}if(!r(await this.matmul(s,o,n,i,a),u))return e("matmul");{let A=(v,h,x,y,P)=>{let U=new Float32Array(x*P);for(let G=0;G<x;G++)for(let _=0;_<P;_++){let F=0;for(let C=0;C<y;C++)F+=v[G*y+C]*h[_*y+C];U[G*P+_]=F}return U},w=async(v,h,x)=>{let y=t(v*h),P=t(x*h);return r(await this.matmulT(y,P,v,h,x),A(y,P,v,h,x))};if(!await w(3,8,5))return e("matmulT.vec4(3,8,5)");if(!await w(1,16,7))return e("matmulT.vec4(1,16,7)");if(!await w(2,6,4))return e("matmulT.scalar(2,6,4)");if(this.hasF16){let y=t(16),P=t(112),U=this.uploadGpuF16(P),G=await this.matmulT(y,U,1,16,7,!0),_=new Float32Array(7);for(let L=0;L<7;L++){let N=0;for(let Q=0;Q<16;Q++)N+=y[Q]*P[L*16+Q];_[L]=N}U.destroy?.();let F=L=>L.length===_.length&&L.every((N,Q)=>Math.abs(N-_[Q])<=.03*(1+Math.abs(_[Q])));if(!F(G))return e("matmulT.f16");let C=this.uploadGpu(P),D=this.f32ToF16Gpu(C,112),T=await this.matmulT(y,D,1,16,7,!0);if(C.destroy?.(),D.destroy?.(),!F(T))return e("packf16")}if(this.hasF16&&this.f16SharedOk){let v=[{m:20,k:128,n:18},{m:32,k:64,n:64},{m:70,k:40,n:130},{m:33,k:48,n:7}];for(let h of v){let x=t(h.m*h.k),y=t(h.n*h.k),P=this.uploadGpuF16(y),U=await this.matmulT(x,P,h.m,h.k,h.n,!0);this.f16SharedOk=!1;let G=await this.matmulT(x,P,h.m,h.k,h.n,!0);if(this.f16SharedOk=!0,P.destroy?.(),!(U.length===G.length&&U.every((F,C)=>Math.abs(F-G[C])<=.001*(1+Math.abs(G[C]))))){this.f16SharedOk=!1,console.warn(`[selfValidate] matmul_t_f16w_shared KO sur ce GPU (m=${h.m}, k=${h.k}, n=${h.n}) : repli sur matmul_t_f16w (plus lent, m\xEAme r\xE9sultat).`);break}}}}{let h=t(128),x=t(768),y=ke(x),P=this.uploadGpuRaw(y.nibbles),U=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),G=this.uploadGpuRaw(new Uint8Array(y.mins.buffer,y.mins.byteOffset,y.mins.byteLength)),_=await this.matmulQ4(h,P,U,G,1,128,6),F=ge(y),C=new Float32Array(6);for(let Q=0;Q<6;Q++){let Y=0;for(let $=0;$<128;$++)Y+=h[$]*F[Q*128+$];C[Q]=Y}if(P.destroy?.(),U.destroy?.(),G.destroy?.(),!r(_,C))return e("matmulQ4");let D=this.uploadGpu(x),T=this.f32ToQ4Gpu(D,768),L=await this.matmulQ4(h,T.nib,T.sc,T.mn,1,128,6);if(D.destroy?.(),T.nib.destroy?.(),T.sc.destroy?.(),T.mn.destroy?.(),!(L.length===C.length&&L.every((Q,Y)=>Math.abs(Q-C[Y])<=.06*(1+Math.abs(C[Y]))+.02)))return e("quantize_q4")}{let h=t(640),x=t(768),y=ar(x),P=this.uploadGpuRaw(new Uint8Array(y.lo.buffer,y.lo.byteOffset,y.lo.byteLength)),U=this.uploadGpuRaw(new Uint8Array(y.hi.buffer,y.hi.byteOffset,y.hi.byteLength)),G=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),_=this.uploadGpuRaw(new Uint8Array(y.mins.buffer,y.mins.byteOffset,y.mins.byteLength)),F=await this.matmulQ3(h,P,U,G,_,5,128,6),C=Le(y),D=new Float32Array(30);for(let T=0;T<5;T++)for(let L=0;L<6;L++){let N=0;for(let Q=0;Q<128;Q++)N+=h[T*128+Q]*C[L*128+Q];D[T*6+L]=N}if(P.destroy?.(),U.destroy?.(),G.destroy?.(),_.destroy?.(),!r(F,D))return e("matmulQ3")}{let h=t(640),x=t(768),y=ke(x),P=this.uploadGpuRaw(y.nibbles),U=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),G=this.uploadGpuRaw(new Uint8Array(y.mins.buffer,y.mins.byteOffset,y.mins.byteLength)),_=await this.matmulQ4Tiled(h,P,U,G,5,128,6),F=ge(y),C=new Float32Array(30);for(let D=0;D<5;D++)for(let T=0;T<6;T++){let L=0;for(let N=0;N<128;N++)L+=h[D*128+N]*F[T*128+N];C[D*6+T]=L}if(P.destroy?.(),U.destroy?.(),G.destroy?.(),!r(_,C))return e("matmul_q4_tiled")}for(let A of[{m:20,n:18},{m:32,n:64},{m:70,n:130}]){let w=A.m,v=128,h=A.n,x=t(w*v),y=t(h*v),P=ke(y),U=this.uploadGpuRaw(P.nibbles),G=this.uploadGpuRaw(new Uint8Array(P.scales.buffer,P.scales.byteOffset,P.scales.byteLength)),_=this.uploadGpuRaw(new Uint8Array(P.mins.buffer,P.mins.byteOffset,P.mins.byteLength)),F=await this.matmulQ4Shared(x,U,G,_,w,v,h),C=ge(P),D=new Float32Array(w*h);for(let T=0;T<w;T++)for(let L=0;L<h;L++){let N=0;for(let Q=0;Q<v;Q++)N+=x[T*v+Q]*C[L*v+Q];D[T*h+L]=N}if(U.destroy?.(),G.destroy?.(),_.destroy?.(),!r(F,D))return e(`matmul_q4_shared(${w},${h})`)}{let h=t(128),x=t(768),y=Pe(x),P=this.uploadGpuRaw(new Uint8Array(y.codes.buffer,y.codes.byteOffset,y.codes.byteLength)),U=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),G=await this.matmulQ8(h,P,U,1,128,6),_=me(y),F=new Float32Array(6);for(let L=0;L<6;L++){let N=0;for(let Q=0;Q<128;Q++)N+=h[Q]*_[L*128+Q];F[L]=N}if(P.destroy?.(),U.destroy?.(),!r(G,F))return e("matmulQ8");let C=this.uploadGpu(x),D=this.f32ToQ8Gpu(C,768),T=await this.matmulQ8(h,D.codes,D.sc,1,128,6);if(C.destroy?.(),D.codes.destroy?.(),D.sc.destroy?.(),!r(T,F))return e("quantize_q8")}{let h=t(640),x=t(768),y=Pe(x),P=this.uploadGpuRaw(new Uint8Array(y.codes.buffer,y.codes.byteOffset,y.codes.byteLength)),U=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),G=await this.matmulQ8Tiled(h,P,U,5,128,6),_=me(y),F=new Float32Array(30);for(let C=0;C<5;C++)for(let D=0;D<6;D++){let T=0;for(let L=0;L<128;L++)T+=h[C*128+L]*_[D*128+L];F[C*6+D]=T}if(P.destroy?.(),U.destroy?.(),!r(G,F))return e("matmul_q8_tiled")}for(let A of[{k:128,n:6},{k:128,n:130},{k:4096,n:17}]){let w=A.k,v=A.n,h=t(w),x=t(v*w),y=ke(x),P=this.uploadGpuRaw(y.nibbles),U=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),G=this.uploadGpuRaw(new Uint8Array(y.mins.buffer,y.mins.byteOffset,y.mins.byteLength)),_=await this.matmulQ4Vec(h,P,U,G,w,v),F=ge(y),C=new Float32Array(v);for(let $=0;$<v;$++){let J=0;for(let W=0;W<w;W++)J+=h[W]*F[$*w+W];C[$]=J}if(P.destroy?.(),U.destroy?.(),G.destroy?.(),!r(_,C))return e(`matmul_q4_vec(${w},${v})`);let D=Pe(x),T=this.uploadGpuRaw(new Uint8Array(D.codes.buffer,D.codes.byteOffset,D.codes.byteLength)),L=this.uploadGpuRaw(new Uint8Array(D.scales.buffer,D.scales.byteOffset,D.scales.byteLength)),N=await this.matmulQ8Vec(h,T,L,w,v),Q=me(D),Y=new Float32Array(v);for(let $=0;$<v;$++){let J=0;for(let W=0;W<w;W++)J+=h[W]*Q[$*w+W];Y[$]=J}if(T.destroy?.(),L.destroy?.(),!r(N,Y))return e(`matmul_q8_vec(${w},${v})`)}for(let A of[{m:20,n:18},{m:32,n:64},{m:70,n:130}]){let w=A.m,v=128,h=A.n,x=t(w*v),y=t(h*v),P=Pe(y),U=this.uploadGpuRaw(new Uint8Array(P.codes.buffer,P.codes.byteOffset,P.codes.byteLength)),G=this.uploadGpuRaw(new Uint8Array(P.scales.buffer,P.scales.byteOffset,P.scales.byteLength)),_=await this.matmulQ8Shared(x,U,G,w,v,h),F=me(P),C=new Float32Array(w*h);for(let D=0;D<w;D++)for(let T=0;T<h;T++){let L=0;for(let N=0;N<v;N++)L+=x[D*v+N]*F[T*v+N];C[D*h+T]=L}if(U.destroy?.(),G.destroy?.(),!r(_,C))return e(`matmul_q8_shared(${w},${h})`)}if(this.qShared2Ok){let A=[{m:64,k:128,n:128},{m:65,k:128,n:130},{m:100,k:160,n:18},{m:70,k:96,n:200}];for(let w of A){let v=w.m,h=w.k,x=w.n,y=t(v*h),P=t(x*h),U=new Float32Array(v*x),G=Pe(P),_=me(G);for(let W=0;W<v;W++)for(let O=0;O<x;O++){let R=0;for(let j=0;j<h;j++)R+=y[W*h+j]*_[O*h+j];U[W*x+O]=R}let F=this.uploadGpuRaw(new Uint8Array(G.codes.buffer,G.codes.byteOffset,G.codes.byteLength)),C=this.uploadGpuRaw(new Uint8Array(G.scales.buffer,G.scales.byteOffset,G.scales.byteLength)),D=await this.matmulQ8Shared2(y,F,C,v,h,x);F.destroy?.(),C.destroy?.();let T=ke(P),L=ge(T),N=new Float32Array(v*x);for(let W=0;W<v;W++)for(let O=0;O<x;O++){let R=0;for(let j=0;j<h;j++)R+=y[W*h+j]*L[O*h+j];N[W*x+O]=R}let Q=this.uploadGpuRaw(T.nibbles),Y=this.uploadGpuRaw(new Uint8Array(T.scales.buffer,T.scales.byteOffset,T.scales.byteLength)),$=this.uploadGpuRaw(new Uint8Array(T.mins.buffer,T.mins.byteOffset,T.mins.byteLength)),J=await this.matmulQ4Shared2(y,Q,Y,$,v,h,x);if(Q.destroy?.(),Y.destroy?.(),$.destroy?.(),!r(D,U)||!r(J,N)){this.qShared2Ok=!1,console.warn(`[selfValidate] matmul_t_q8/q4_shared2 KO sur ce GPU (m=${v}, k=${h}, n=${x}) : repli sur les tuiles 32\xD764 v1 (plus lentes, m\xEAme r\xE9sultat).`);break}}}{let w=t(1632),v=new Uint8Array(w.buffer,w.byteOffset,w.byteLength),h=(x,y)=>x.length===y.length&&x.every((P,U)=>P===y[U]);if(!h(await this.quantizeToBytes("F32",v,1632,"q8"),await this.quantizeToBytes("F32",v,1632,"q8",256)))return e("quantize_chunk_q8");if(!h(await this.quantizeToBytes("F32",v,1632,"q4"),await this.quantizeToBytes("F32",v,1632,"q4",256)))return e("quantize_chunk_q4")}let c=2,d=8,f=t(c*d),p=t(d),g=new Float32Array(c*d);for(let A=0;A<c;A++){let w=0;for(let h=0;h<d;h++)w+=f[A*d+h]**2;let v=1/Math.sqrt(w/d+1e-5);for(let h=0;h<d;h++)g[A*d+h]=f[A*d+h]*v*p[h]}if(!r(await this.rmsnorm(f,p,c,d),g))return e("rmsnorm");if(!r(await this.rmsnorm(f,p,c,d,1e-5,!0),Fe(f,p,c,d,1e-5,!0)))return e("rmsnorm.onePlus");let m=t(16),b=t(16),k=m.map((A,w)=>A/(1+Math.exp(-A))*b[w]);if(!r(await this.swiglu(m,b),k))return e("swiglu");let B=m.map((A,w)=>pr(A)*b[w]);if(!r(await this.geglu(m,b),B))return e("geglu");let S=m.map((A,w)=>A+b[w]);if(!r(await this.add(m,b),S))return e("add");{let A=ee.MAX_WG_DIM*se+257,w=new Float32Array(A),v=new Float32Array(A),h=[0,1,se-1,se,ee.MAX_WG_DIM*se-1,ee.MAX_WG_DIM*se,A-1];for(let P of h)w[P]=P%7-3,v[P]=P%5-2;let x=await this.add(w,v),y=x.length===A;for(let P of h)Math.abs(x[P]-(w[P]+v[P]))>1e-5&&(y=!1);if(!y)return e("grid1D.add(2D)")}let q=(A,w,v=.003)=>A.length===w.length&&A.every((h,x)=>Math.abs(h-w[x])<=v*(1+Math.abs(w[x])));{let y=t(8);if(!q(await this.rope(y,2,4,2,1,1e4),ze(y,2,4,2,1,1e4)))return e("rope")}{let y=t(384),P=new Float32Array(64/2).fill(1);if(!q(await this.ropeFactors(y,P,6,64,2,7,5e5),ze(y,6,64,2,7,5e5)))return e("rope_factors.ones");let U=Float32Array.from({length:64/2},(G,_)=>1+_%5*.7);if(!q(await this.ropeFactors(y,U,6,64,2,7,5e5),Un(y,U,6,64,2,7,5e5)))return e("rope_factors")}{let y=t(384);if(!q(await this.rope(y,6,64,2,7,5e5,!0),Xe(y,6,64,2,7,5e5)))return e("rope.interleaved");let P=t(8);if(!q(await this.rope(P,2,4,2,3,1e4,!0),Xe(P,2,4,2,3,1e4)))return e("rope.interleaved.hd4");let U=t(384);if(!q(await this.rope(U,6,64,2,0,5e5,!0),Xe(U,6,64,2,0,5e5)))return e("rope.interleaved.pos0");let G=64/2,_=new Float32Array(384);for(let L=0;L<6;L++)for(let N=0;N<G;N++)_[L*64+2*N]=y[L*64+N],_[L*64+2*N+1]=y[L*64+N+G];let F=await this.rope(_,6,64,2,7,5e5,!0),C=await this.rope(y,6,64,2,7,5e5,!1),D=new Float32Array(384);for(let L=0;L<6;L++)for(let N=0;N<G;N++)D[L*64+2*N]=C[L*64+N],D[L*64+2*N+1]=C[L*64+N+G];if(!q(F,D))return e("rope.interleaved.equivalence");let T=Float32Array.from({length:G},(L,N)=>1+N%5*.7);if(!q(await this.ropeFactors(y,T,6,64,2,7,5e5,!0),Xe(y,6,64,2,7,5e5,T)))return e("rope_factors.interleaved")}{let v=[16,24,24],h=1e6,x=3,y=x*2,P=5,U=t(y*128),G=new Uint32Array(x*3);for(let D=0;D<x;D++){let T=P+D;G.set([T,T,T],D*3)}let _=new Uint32Array([5,5,5,5,6,9,5,7,5]),F=q(await this.ropeMrope(U,G,y,128,2,v,h),ze(U,y,128,2,P,h)),C=q(await this.ropeMrope(U,_,y,128,2,v,h),Pn(U,_,y,128,2,v,h));(!F||!C)&&(this.mropeOk=!1,console.error(`[selfValidate] rope_mrope KO sur ce GPU (${F?"positions 3D":"d\xE9g\xE9n\xE9r\xE9\u2260rope"}). Vision d\xE9sactiv\xE9e, chat texte intact.`))}{let P=t(32),U=t(32),G=t(32);if(!q(await this.attention(P,U,G,2,4,2,4,2),be(P,U,G,2,4,2,4,2)))return e("attention");let _=.3,F=5;if(!q(await this.attention(P,U,G,2,4,2,4,2,_,F),be(P,U,G,2,4,2,4,2,_,F)))return e("attention.softcap");{let Y=t(24),$=t(48),J=t(48);for(let W of[1,4,8,64]){if(!q(await this.attention(Y,$,J,3,2,1,4,9,void 0,0,W),be(Y,$,J,3,2,1,4,9,void 0,0,W)))return e(`attention.window(${W})`);if(!q(await this.attentionDecode(Y,$,J,3,2,1,4,9,void 0,0,W),be(Y,$,J,3,2,1,4,9,void 0,0,W)))return e(`attention_decode.window(${W})`)}}{let C=await this.quantizeKvReadback(U,4,2,4),D=await this.quantizeKvReadback(G,4,2,4),T=await this.attentionQ8Kv(P,C.codes,C.scales,D.codes,D.scales,2,4,2,4,2),L=(J,W)=>{let O=new Float32Array(32);for(let R=0;R<4;R++)for(let j=0;j<2;j++){let z=W[R*2+j];for(let I=0;I<4;I++){let K=R*2*4+j*4+I,H=J[K>>2]>>(K&3)*8&255;O[K]=(H<128?H:H-256)*z}}return O},N=L(C.codes,C.scales),Q=L(D.codes,D.scales),Y=be(P,N,Q,2,4,2,4,2);if(!q(T,Y,.005))return e("attention.q8kv");let $=0;for(let J=0;J<U.length;J++)$=Math.max($,Math.abs(N[J]-U[J]));if($>.05)return e("quantize_kv.error")}}{let A=v=>{this.attnDecodeOk=!1,console.error("[selfValidate] attention d\xE9codage HS sur ce GPU (\xE9tape :",v,") \u2192 repli kernels classiques (plus lents \xE0 contexte long, corrects)")},w=[{nT:1,nH:14,nKv:2,hd:64,past:300},{nT:10,nH:14,nKv:2,hd:64,past:173}];for(let v of w){if(!this.attnDecodeOk)break;let h=v.past+v.nT,x=t(v.nT*v.nH*v.hd),y=t(h*v.nKv*v.hd),P=t(h*v.nKv*v.hd);if(!q(await this.attentionDecode(x,y,P,v.nT,v.nH,v.nKv,v.hd,v.past),be(x,y,P,v.nT,v.nH,v.nKv,v.hd,v.past))){A(`decode(nT=${v.nT})`);break}let U=await this.quantizeKvReadback(y,h,v.nKv,v.hd),G=await this.quantizeKvReadback(P,h,v.nKv,v.hd),_=await this.attentionQ8KvDecode(x,U.codes,U.scales,G.codes,G.scales,v.nT,v.nH,v.nKv,v.hd,v.past),F=await this.attentionQ8Kv(x,U.codes,U.scales,G.codes,G.scales,v.nT,v.nH,v.nKv,v.hd,v.past);if(!q(_,F,.005)){A(`decode.q8kv(nT=${v.nT})`);break}}if(this.attnDecodeOk){let U=t(64),G=t(350*8),_=t(350*8);q(await this.attentionDecode(U,G,_,2,4,2,8,173,.3,5),be(U,G,_,2,4,2,8,173,.3,5))||A("decode.softcap")}if(this.attnDecodeOk){let U=t(256),G=t(9088),_=t(9088);q(await this.attentionDecode(U,G,_,1,2,1,128,70),be(U,G,_,1,2,1,128,70))||A("decode.hd128")}}{let A=h=>{this.attnPrefillOk=!1,console.error("[selfValidate] attention prefill tuil\xE9e HS sur ce GPU (\xE9tape :",h,") \u2192 repli kernel classique (plus lent en prefill, correct)")},w=[{nT:37,nH:14,nKv:2,hd:64,past:0,sc:void 0,cap:0,win:0},{nT:13,nH:14,nKv:2,hd:64,past:173,sc:void 0,cap:0,win:0},{nT:1,nH:14,nKv:2,hd:64,past:300,sc:void 0,cap:0,win:0},{nT:4,nH:4,nKv:2,hd:32,past:7,sc:void 0,cap:0,win:0},{nT:5,nH:4,nKv:2,hd:32,past:0,sc:void 0,cap:0,win:0},{nT:9,nH:2,nKv:1,hd:128,past:70,sc:void 0,cap:0,win:0},{nT:6,nH:4,nKv:2,hd:8,past:17,sc:.3,cap:5,win:0}];for(let h of w){let x=h.past+h.nT,y=t(h.nT*h.nH*h.hd),P=t(x*h.nKv*h.hd),U=t(x*h.nKv*h.hd);if(!q(await this.attentionPrefill(y,P,U,h.nT,h.nH,h.nKv,h.hd,h.past,h.sc,h.cap,h.win),be(y,P,U,h.nT,h.nH,h.nKv,h.hd,h.past,h.sc,h.cap,h.win))){A(`prefill(nT=${h.nT},hd=${h.hd},past=${h.past}${h.cap>0?",softcap":""})`);break}}if(this.attnPrefillOk){let _=t(80),F=t(76),C=t(76);for(let D of[1,4,8,64])if(!q(await this.attentionPrefill(_,F,C,10,2,1,4,9,void 0,0,D),be(_,F,C,10,2,1,4,9,void 0,0,D))){A(`prefill.window(${D})`);break}}let v=[{nT:37,nH:14,nKv:2,hd:64,past:0,win:0},{nT:13,nH:14,nKv:2,hd:64,past:173,win:0},{nT:10,nH:2,nKv:1,hd:8,past:9,win:4}];for(let h of v){if(!this.attnPrefillOk)break;let x=h.past+h.nT,y=t(h.nT*h.nH*h.hd),P=t(x*h.nKv*h.hd),U=t(x*h.nKv*h.hd),G=await this.quantizeKvReadback(P,x,h.nKv,h.hd),_=await this.quantizeKvReadback(U,x,h.nKv,h.hd),F=await this.attentionQ8KvPrefill(y,G.codes,G.scales,_.codes,_.scales,h.nT,h.nH,h.nKv,h.hd,h.past,void 0,0,h.win),C=await this.attentionQ8Kv(y,G.codes,G.scales,_.codes,_.scales,h.nT,h.nH,h.nKv,h.hd,h.past,void 0,0,h.win);if(!q(F,C,.005)){A(`prefill.q8kv(nT=${h.nT},win=${h.win})`);break}}}{let A=v=>{this.rmsVecOk=!1,console.error("[selfValidate] RMSNorm parall\xE8le HS sur ce GPU (\xE9tape :",v,") \u2192 repli kernel une-ligne-par-thread (correct, plus lent en d\xE9codage)")},w=[{rows:1,dim:1024,onePlus:!1},{rows:1,dim:1536,onePlus:!1},{rows:1,dim:100,onePlus:!1},{rows:14,dim:64,onePlus:!1},{rows:37,dim:2048,onePlus:!1},{rows:3,dim:128,onePlus:!0}];for(let v of w){let h=t(v.rows*v.dim),x=t(v.dim),y=await this.rmsnormVec(h,x,v.rows,v.dim,1e-6,v.onePlus),P=await this.rmsnorm(h,x,v.rows,v.dim,1e-6,v.onePlus);if(!q(y,P,.005)){A(`rmsnorm_vec(${v.rows}\xD7${v.dim}${v.onePlus?",1+w":""})`);break}}}{let A=v=>{this.topKParOk=!1,console.error("[selfValidate] top-K parall\xE8le HS sur ce GPU (\xE9tape :",v,") \u2192 repli s\xE9lection sur un thread (correcte, plus lente)")},w=[{n:151936,k:64,ties:!1,label:"vocab Qwen (151936)"},{n:65536,k:64,ties:!1,label:"vocab World (65536)"},{n:1e3,k:64,ties:!1,label:"n non multiple de 128"},{n:300,k:64,ties:!1,label:"n < 1024 candidats"},{n:4096,k:8,ties:!1,label:"petit K"},{n:8192,k:64,ties:!0,label:"EX \xC6QUO (d\xE9partage)"}];for(let v of w){if(!this.topKParOk)break;let h=v.ties?Float32Array.from({length:v.n},(U,G)=>Math.round(Math.random()*6)+(G%7===0?3:0)):t(v.n),x=await this.topKReadback(h,v.k,"top_k"),y=await this.topKReadback(h,v.k,"top_k_par");if(!(x.length===y.length&&x.every((U,G)=>U===y[G]))){let U=x.findIndex((G,_)=>G!==y[_]);A(`top_k_par(${v.label}). Premier \xE9cart au rang ${U} : ${x[U]} vs ${y[U]}`);break}}}{let U={seq:3,d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},G={attnNorm:t(16),wq:t(256),wk:t(128),wv:t(128),wo:t(256),bq:t(16),bk:t(8),bv:t(8),ffnNorm:t(16),wgate:t(256),wup:t(256),wdown:t(256)},_=t(48);if(!q(await this.layerForward(_,U,G),bt(_,U,G),.005))return e("layerForward")}{let G={seq:3,d:12,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6,attnScale:1/Math.sqrt(4),attnLogitSoftcap:5,act:"gelu",rmsGainOnePlus:!0},_={attnNorm:t(12),wq:t(192),wk:t(96),wv:t(96),wo:t(192),ffnNorm:t(12),wgate:t(192),wup:t(192),wdown:t(192),postAttnNorm:t(12),postFfnNorm:t(12)},F=t(36);if(!q(await this.layerForward(F,G,_),bt(F,G,_),.005))return e("layerForward.gemma2")}{let G={seq:3,d:12,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e6,eps:1e-6},_={attnNorm:t(12),wq:t(192),wk:t(96),wv:t(96),wo:t(192),ffnNorm:t(12),wgate:t(192),wup:t(192),wdown:t(192),qNorm:t(4),kNorm:t(4)},F=t(36);if(!q(await this.layerForward(F,G,_),bt(F,G,_),.005))return e("layerForward.qwen3")}{let w=new Uint8Array(720);for(let h=0;h<5;h++){let x=h*144,y=new DataView(w.buffer);y.setUint16(x,Te(.005+Math.random()*.05),!0),y.setUint16(x+2,Te(.001+Math.random()*.02),!0);for(let P=4;P<144;P++)w[x+P]=Math.random()*256|0}let v=await this.dequantizeQ4K(w,5*256);if(!q(v,vn(w,5),1e-4))return e("dequant.Q4_K")}{let A=_=>{let F=new Uint8Array(_);for(let C=0;C<_;C++)F[C]=Math.random()*256|0;return F},w=(_,F)=>{let C=new DataView(_.buffer),D=T=>F===210?T*210+208:T*F;for(let T=0;T*F<_.length;T++)C.setUint16(D(T),Te(.005+Math.random()*.05),!0);return _},h=w(A(136),34);if(!q(await this.dequantizeByType("Q8_0",h,128),bn(h,4),1e-4))return e("dequant.Q8_0");let x=w(A(88),22);if(!q(await this.dequantizeByType("Q5_0",x,128),wn(x,4),1e-4))return e("dequant.Q5_0");let y=w(A(840),210);if(!q(await this.dequantizeByType("Q6_K",y,4*256),An(y,4),1e-4))return e("dequant.Q6_K");let P=w(A(72),18);if(!q(await this.dequantizeByType("Q4_0",P,128),yn(P,4),1e-4))return e("dequant.Q4_0");let U=A(704),G=new DataView(U.buffer);for(let _=0;_<4;_++)G.setUint16(_*176,Te(.005+Math.random()*.05),!0),G.setUint16(_*176+2,Te(.001+Math.random()*.02),!0);if(!q(await this.dequantizeByType("Q5_K",U,4*256),kn(U,4),1e-4))return e("dequant.Q5_K")}{let P={d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},U={attnNorm:t(16),wq:t(256),wk:t(128),wv:t(128),wo:t(256),bq:t(16),bk:t(8),bv:t(8),ffnNorm:t(16),wgate:t(256),wup:t(256),wdown:t(256)},G=t(48),F=(await this.layerForward(G,{...P,seq:3},U)).slice(32,48),C=new Float32Array(0),D=await this.layerForwardKV(G.slice(0,32),{...P,seq:2},U,0,C,C),T=await this.layerForwardKV(G.slice(32,48),{...P,seq:1},U,2,D.k,D.v);if(!q(T.out,F,.005))return e("layerForwardKV")}{let v=t(4),h=t(40),x=new Float32Array(10);for(let G=0;G<10;G++){let _=0;for(let F=0;F<4;F++)_+=v[F]*h[G*4+F];x[G]=_}let y=0;for(let G=1;G<10;G++)x[G]>x[y]&&(y=G);let P=this.uploadGpu(h),U=await this.argmaxProjection(v,[{buf:P,rows:10,r0:0}],4,10,!1);if(P.destroy?.(),U!==y)return e("argmaxProjection")}{let P={seq:4,d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},U={attnNorm:t(16),wq:t(256),wk:t(128),wv:t(128),wo:t(256),bq:t(16),bk:t(8),bv:t(8),ffnNorm:t(16),wgate:t(256),wup:t(256),wdown:t(256)},G=t(16),_=t(64),F=new Float32Array(0),C=await this.layerForwardKV(_,{...P,seq:4},U,0,F,F,!0),D=Fe(C.out.slice(48,64),G,1,16,1e-6),T={attnNorm:this.uploadGpu(U.attnNorm),wq:this.uploadGpu(U.wq),wk:this.uploadGpu(U.wk),wv:this.uploadGpu(U.wv),wo:this.uploadGpu(U.wo),ffnNorm:this.uploadGpu(U.ffnNorm),wgate:this.uploadGpu(U.wgate),wup:this.uploadGpu(U.wup),wdown:this.uploadGpu(U.wdown),bq:this.uploadGpu(U.bq),bk:this.uploadGpu(U.bk),bv:this.uploadGpu(U.bv)},L=this.uploadGpu(G),N=this.kvQuant;this.kvQuant=!1,this.resetKvGpu();let Q=await this.runDecodeGpu(_,{...P,seq:4},[T],0,L,"selftest-A");if(!q(Q,D,.008))return this.resetKvGpu(),this.kvQuant=N,e("runDecodeGpu.prefill");await this.runDecodeGpu(_.slice(0,48),{...P,seq:3},[T],0,L,"selftest-B");let Y=await this.runDecodeGpu(_.slice(48,64),{...P,seq:1},[T],3,L,"selftest-B");if(!q(Y,D,.008))return this.resetKvGpu(),this.kvQuant=N,e("runDecodeGpu.decode");this.kvQuant=N,this.resetKvGpu();for(let $ of Object.values(T))$?.destroy?.();L.destroy?.()}{let x=Float32Array.from({length:152064},()=>(Math.random()*2-1)*8),y=[...new Set(Array.from({length:40},()=>Math.floor(Math.random()*152064)))],P=x.slice();for(let O=0;O<152064;O++)P[O]=30*Math.tanh(P[O]/30);for(let O of y)P[O]=P[O]>0?P[O]/1.15:P[O]*1.15;let U=Array.from(P.keys()).sort((O,R)=>P[R]-P[O]).slice(0,64),G=globalThis,_=[],F=this.storage(152064*4);this.device.queue.writeBuffer(F,0,x),_.push(F);let C=this.device.createCommandEncoder(),D=this.uniform([152064],{offset:4,value:30});this.recordPass(C,"softcap_logits",[D,F],this.grid1D(152064));let T=this.bufU32(Uint32Array.from(y),G.GPUBufferUsage.STORAGE|G.GPUBufferUsage.COPY_DST),L=this.uniform([y.length],{offset:4,value:1.15});this.recordPass(C,"penalize_logits",[L,T,F],this.grid1D(y.length));let N=this.storage(512),Q=this.uniform([152064,64]);this.recordPass(C,this.topKParOk?"top_k_par":"top_k",[Q,F,N],[1,1,1]),_.push(D,T,L,Q,N);let Y=this.device.createBuffer({size:512,usage:G.GPUBufferUsage.COPY_DST|G.GPUBufferUsage.MAP_READ});C.copyBufferToBuffer(N,0,Y,0,512),this.device.queue.submit([C.finish()]),await Y.mapAsync(G.GPUMapMode.READ);let $=new Uint32Array(Y.getMappedRange().slice(0));Y.unmap(),Y.destroy(),this.release(_);let J=$.slice(0,64),W=new Float32Array($.buffer,256,64);this.topKOk=!0;for(let O=0;O<64;O++){let R=Math.abs(W[O]-P[U[O]])<=1e-4*(1+Math.abs(P[U[O]])),j=Math.abs(P[J[O]]-W[O])<=1e-4*(1+Math.abs(W[O]));if(!R||!j){this.topKOk=!1,console.error(`[selfValidate] top_k KO sur ce GPU (rang ${O}) : repli sur le sampling CPU plein-vocab (plus lent, m\xEAme r\xE9sultat).`);break}}}if(this.rwkvWkv7Ok){let h=t(128),x=t(16),y=t(16),P=t(16),U=t(16),G=t(16),_=Float32Array.from({length:16},()=>Math.random()*.5+.5),F=h.slice(),C=new Float32Array(16);for(let W=0;W<2;W++){let O=W*8;for(let R=0;R<8;R++){let j=W*8*8+R*8,z=P[O+R],I=0;for(let H=0;H<8;H++)I+=G[O+H]*F[j+H];let K=0;for(let H=0;H<8;H++){let V=_[O+H]*F[j+H]+z*y[O+H]+U[O+H]*I;F[j+H]=V,K+=x[O+H]*V}C[O+R]=K}}let D=await this.rwkvWkv7(h.slice(),x,_,y,P,G,U,2,8),T=(W,O)=>W.length===O.length&&W.every((R,j)=>Math.abs(R-O[j])<=.001*(1+Math.abs(O[j])));!T(D.S,F)||!T(D.y,C)?(this.rwkvWkv7Ok=!1,console.error("[selfValidate] RWKV-7 WKV KO sur ce GPU : une archi RWKV (moteur v2) refuserait de charger (non bloquant pour le chat texte).")):console.log("[selfValidate] RWKV-7 WKV OK (r\xE9currence \xE0 \xE9tat fixe, moteur v2)");let L=16,N=t(L),Q=t(L),Y=t(L*6),$=new Float32Array(L*6);for(let W=0;W<6;W++)for(let O=0;O<L;O++){let R=W*L+O;$[R]=N[O]+(Q[O]-N[O])*Y[R]}let J=await this.rwkvTokenShift(N,Q,Y,L);if(T(J,$)?console.log("[selfValidate] RWKV-7 token-shift OK"):(this.rwkvWkv7Ok=!1,console.error("[selfValidate] RWKV-7 token-shift KO sur ce GPU (non bloquant pour le chat texte).")),this.rwkvResidentOk){let W=globalThis,O=W.GPUBufferUsage.STORAGE|W.GPUBufferUsage.COPY_DST|W.GPUBufferUsage.COPY_SRC,R=2,j=8,z=R*j,I=(H,V)=>{let re=Math.max(16,Math.ceil((H.length*4+(V?4:0))/16)*16),te=this.device.createBuffer({size:re,usage:W.GPUBufferUsage.UNIFORM|W.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(te,0,new Uint32Array(H)),V&&this.device.queue.writeBuffer(te,V.off,new Float32Array([V.val])),te},K=H=>this.device.createBuffer({size:H*4,usage:O});try{let H=t(z),V=t(z),re=t(z),te=Float32Array.from({length:z},()=>Math.random()),ne=new Float32Array(z),ce=new Float32Array(z),de=new Float32Array(z);for(let le=0;le<R;le++){let ie=0;for(let ve=0;ve<j;ve++){let fe=H[le*j+ve]*V[le*j+ve];ie+=fe*fe}ie=Math.sqrt(ie)||1e-12;for(let ve=0;ve<j;ve++){let fe=le*j+ve,$e=H[fe]*V[fe]/ie;ce[fe]=-$e,de[fe]=$e*te[fe],ne[fe]=H[fe]*(1+(te[fe]-1)*re[fe])}}let X=K(z),_e=K(z),Z=K(z);this.dispatch("rwkv_kprep",[I([R,j]),this.buf(H,O),this.buf(te,O),this.buf(V,O),this.buf(re,O),X,_e,Z],this.grid1D(R));let Ge=T(await this.readBack(X,z*4),ne)&&T(await this.readBack(_e,z*4),ce)&&T(await this.readBack(Z,z*4),de);X.destroy?.(),_e.destroy?.(),Z.destroy?.();let he=t(z),St=t(z),Ot=t(z),Tt=t(z),Ct=t(z),Mt=t(z),Rt=new Float32Array(z);for(let le=0;le<R;le++){let ie=le*j,ve=0;for(let ue=0;ue<j;ue++)ve+=he[ie+ue];ve/=j;let fe=0;for(let ue=0;ue<j;ue++){let Zt=he[ie+ue]-ve;fe+=Zt*Zt}fe/=j;let $e=1/Math.sqrt(fe+64e-5),Jt=0;for(let ue=0;ue<j;ue++)Jt+=St[ie+ue]*ne[ie+ue]*Ot[ie+ue];for(let ue=0;ue<j;ue++)Rt[ie+ue]=(he[ie+ue]-ve)*$e*Ct[ie+ue]+Mt[ie+ue]+Jt*Tt[ie+ue]}let st=new Float32Array(2*z);st.set(Ct,0),st.set(Mt,z);let at=K(z);this.dispatch("rwkv_out_gn",[I([R,j],{off:8,val:64e-5}),this.buf(he,O),this.buf(St,O),this.buf(ne,O),this.buf(Ot,O),this.buf(Tt,O),this.buf(st,O),at],this.grid1D(R));let Dt=T(await this.readBack(at,z*4),Rt);at.destroy?.();let Lt=t(z),jt=t(z),nn=Float32Array.from(Lt,(le,ie)=>Math.exp(-.606531/(1+Math.exp(-(le+jt[ie]))))),ot=K(z);this.dispatch("rwkv_decay",[this.buf(Lt,O),this.buf(jt,O),ot],this.grid1D(z));let Ht=T(await this.readBack(ot,z*4),nn);ot.destroy?.();let zt=t(z),Kt=t(z),Et=t(z),Nt=t(z),sn=Float32Array.from(zt,(le,ie)=>le+(Kt[ie]-le)*(1/(1+Math.exp(-(Et[ie]+Nt[ie]))))),ut=this.buf(zt,O);this.dispatch("rwkv_vresid",[ut,this.buf(Kt,O),this.buf(Et,O),this.buf(Nt,O)],this.grid1D(z));let Wt=T(await this.readBack(ut,z*4),sn);ut.destroy?.();let Qt=t(z),$t=t(z),It=t(z),an=Float32Array.from(Qt,(le,ie)=>le+($t[ie]-le)*It[ie]),ct=K(z);this.dispatch("rwkv_lerp",[this.buf(Qt,O),this.buf($t,O),this.buf(It,O),ct],this.grid1D(z));let Vt=T(await this.readBack(ct,z*4),an);ct.destroy?.();let Yt=t(z),on=Float32Array.from(Yt,le=>{let ie=Math.max(le,0);return ie*ie}),lt=K(z);this.dispatch("sqrelu",[this.buf(Yt,O),lt],this.grid1D(z));let Xt=T(await this.readBack(lt,z*4),on);lt.destroy?.(),!Ge||!Dt||!Ht||!Wt||!Vt||!Xt?(this.rwkvResidentOk=!1,console.error(`[selfValidate] glu RWKV r\xE9sidente KO sur ce GPU (kprep:${Ge} gn:${Dt} decay:${Ht} vresid:${Wt} lerp:${Vt} sqrelu:${Xt}). Repli forwardToken JS+readback (correct, lent).`)):console.log("[selfValidate] glu RWKV r\xE9sidente OK (kprep, out_gn, decay, vresid, lerp, sqrelu)")}catch(H){this.rwkvResidentOk=!1,console.error("[selfValidate] glu RWKV r\xE9sidente : erreur d\u2019ex\xE9cution. Repli forwardToken JS+readback.",H)}}}if(this.lfm2ShortConvOk){let A=F=>Float32Array.from({length:F},()=>Math.random()*2-1),w=(F,C)=>F.length===C.length&&F.every((D,T)=>Math.abs(D-C[T])<=.001*(1+Math.abs(C[T]))),x=A(96),y=A(64),P=A(96),U=new Float32Array(32),G=y.slice();for(let F=0;F<32;F++){let C=x[F]*x[64+F],D=P[F*3+2]*C;for(let T=0;T<2;T++)D+=P[F*3+T]*y[T*32+F];for(let T=0;T+2<3;T++)G[T*32+F]=y[(T+1)*32+F];G[32+F]=C,U[F]=D*x[32+F]}let _=await this.lfm2ShortConv(x,y.slice(),P,32,3);!w(_.out,U)||!w(_.state,G)?(this.lfm2ShortConvOk=!1,console.error("[selfValidate] LFM2 shortconv KO sur ce GPU : une archi lfm2 refuserait de charger (non bloquant pour le reste).")):console.log("[selfValidate] LFM2 shortconv OK (conv courte gat\xE9e, moteur v2)")}let M=await this.validateDiffusion();M?console.warn("[selfValidate] image-gen primitive KO:",M,"(non bloquant: chemin texte intact)"):console.log(`[selfValidate] image-gen primitives OK (silu, group_norm, conv2d, conv2d_direct, conv2d_direct_q8/q4, conv 3\xD73 tuil\xE9 q8/q4 ${this.convTiledQOk?"OK":"KO (repli direct)"}, relu, upsample_nearest, layernorm, quick_gelu, attention_full)`);let E=await this.validateVideoResident();return E?(this.videoResidentOk=!1,console.warn("[selfValidate] motion r\xE9sident KO:",E,", repli JS+readback (plus lent, m\xEAme r\xE9sultat).")):console.log("[selfValidate] motion r\xE9sident OK (video_motion_gather, video_motion_scatter, video_add_pe, attn_temporal)"),!0}async validateVideoResident(){let e=o=>Float32Array.from({length:o},()=>Math.random()*2-1),r=(o,u,c=.005)=>o.length===u.length&&o.every((d,f)=>Math.abs(d-u[f])<=c*(1+Math.abs(u[f])));{let o=e(120),u=new Float32Array(120);for(let f=0;f<5;f++)for(let p=0;p<3;p++)for(let g=0;g<8;g++)u[(f*3+p)*8+g]=o[(p*8+g)*5+f];let c=this.recordingSession(),d=await c.finish(c.videoGather(o,3,8,5),120);if(!r(d,u,1e-6))return"video_motion_gather"}{let o=e(120),u=e(120),c=new Float32Array(120);for(let p=0;p<3;p++)for(let g=0;g<8;g++)for(let m=0;m<5;m++)c[(p*8+g)*5+m]=o[(m*3+p)*8+g]+u[(p*8+g)*5+m];let d=this.recordingSession(),f=await d.finish(d.videoScatter(o,u,3,8,5),120);if(!r(f,c,1e-6))return"video_motion_scatter"}{let o=e(120),u=e(24),c=new Float32Array(120);for(let p=0;p<5;p++)for(let g=0;g<3;g++)for(let m=0;m<8;m++)c[(p*3+g)*8+m]=o[(p*3+g)*8+m]+u[g*8+m];let d=this.recordingSession(),f=await d.finish(d.videoAddPe(o,u,3,8,5),120);if(!r(f,c,1e-6))return"video_add_pe"}{let o=e(120),u=e(120),c=e(120),d=1/Math.sqrt(4),f=new Float32Array(120);for(let m=0;m<5;m++)for(let b=0;b<2;b++){let k=b*4,B=m*3;for(let S=0;S<3;S++){let q=(B+S)*8+k,M=new Float32Array(3),E=-1e30;for(let w=0;w<3;w++){let v=0,h=(B+w)*8+k;for(let x=0;x<4;x++)v+=o[q+x]*u[h+x];M[w]=v*d,M[w]>E&&(E=M[w])}let A=0;for(let w=0;w<3;w++)M[w]=Math.exp(M[w]-E),A+=M[w];for(let w=0;w<3;w++){let v=M[w]/A,h=(B+w)*8+k;for(let x=0;x<4;x++)f[q+x]+=v*c[h+x]}}}let p=this.recordingSession(),g=await p.finish(p.attnTemporal(o,u,c,5,3,2,4),120);if(!r(g,f))return"attn_temporal"}return null}async validateDiffusion(){let e=O=>Float32Array.from({length:O},()=>Math.random()*2-1),r=(O,R,j=.005)=>O.length===R.length&&O.every((z,I)=>Math.abs(z-R[I])<=j*(1+Math.abs(R[I]))),t=e(70),n=t.map(O=>O/(1+Math.exp(-O)));if(!r(await this.silu(t),n))return"silu";let i=4,a=5,s=2,o=1e-5,u=e(i*a),c=e(i),d=e(i),f=new Float32Array(i*a),p=i/s;for(let O=0;O<s;O++){let R=O*p*a,j=p*a,z=0;for(let H=0;H<j;H++)z+=u[R+H];z/=j;let I=0;for(let H=0;H<j;H++){let V=u[R+H]-z;I+=V*V}I/=j;let K=1/Math.sqrt(I+o);for(let H=0;H<j;H++){let V=O*p+Math.floor(H/a);f[R+H]=(u[R+H]-z)*K*c[V]+d[V]}}if(!r(await this.groupNorm(u,c,d,i,a,s,o),f))return"group_norm";let g=2,m=4,b=4,k=3,B=3,S=1,q=1,M=4,E=4,A=e(g*m*b),w=e(k*g*B*B),v=e(k),h=new Float32Array(k*M*E);for(let O=0;O<k;O++)for(let R=0;R<M;R++)for(let j=0;j<E;j++){let z=v[O];for(let I=0;I<g;I++)for(let K=0;K<B;K++)for(let H=0;H<B;H++){let V=R*S+K-q,re=j*S+H-q;V>=0&&V<m&&re>=0&&re<b&&(z+=A[I*m*b+V*b+re]*w[((O*g+I)*B+K)*B+H])}h[(O*M+R)*E+j]=z}if(!r(await this.conv2d(A,w,v,g,m,b,k,B,B,S,q),h))return"conv2d";if(!r(await this.conv2dDirect(A,w,v,g,m,b,k,B,B,S,q),h))return"conv2d_direct";{let I=e(1200),K=e(108),H=e(4),V=await this.conv2dDirect(I,K,H,3,20,20,4,3,3,1,1),re=this.convTiledOk;this.convTiledOk=!0;let te=this.recordingSession(),ne=await te.finish(te.conv2d(I,K,H,3,20,20,4,3,3,1,1),1600);this.convTiledOk=re,r(ne,V)||(this.convTiledOk=!1,console.warn("[selfValidate] conv2d_3x3_tiled KO sur ce GPU : repli sur conv2d_direct (plus lent, m\xEAme r\xE9sultat)."))}{let j=e(8*m*b),z=e(32*B*B),I=e(4),K=Pe(z),H=await this.conv2dDirect(j,me(K),I,8,m,b,4,B,B,S,q),V={codes:this.uploadGpuRaw(new Uint8Array(K.codes.buffer,K.codes.byteOffset,K.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(K.scales.buffer,K.scales.byteOffset,K.scales.byteLength))},re=this.convTiledQOk;this.convTiledQOk=!1;let te=this.recordingSession(),ne=await te.finish(te.conv2d(j,V,I,8,m,b,4,B,B,S,q),4*m*b);if(this.convTiledQOk=re,this.releaseGpu([V.codes,V.sc]),!r(ne,H))return"conv2d_direct_q8"}{let j=e(8*m*b),z=e(32*B*B),I=e(4),K=ke(z),H=await this.conv2dDirect(j,ge(K),I,8,m,b,4,B,B,S,q),V={nib:this.uploadGpuRaw(K.nibbles),sc:this.uploadGpuRaw(new Uint8Array(K.scales.buffer,K.scales.byteOffset,K.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(K.mins.buffer,K.mins.byteOffset,K.mins.byteLength))},re=this.convTiledQOk;this.convTiledQOk=!1;let te=this.recordingSession(),ne=await te.finish(te.conv2d(j,V,I,8,m,b,4,B,B,S,q),4*m*b);if(this.convTiledQOk=re,this.releaseGpu([V.nib,V.sc,V.mn]),!r(ne,H))return"conv2d_direct_q4"}{let I=e(16e3),K=e(480),H=e(12),V=this.convTiledQOk;for(let re of["q8","q4"]){let te=re==="q8"?(()=>{let X=Pe(K);return{deq:me(X),gpu:{codes:this.uploadGpuRaw(new Uint8Array(X.codes.buffer,X.codes.byteOffset,X.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(X.scales.buffer,X.scales.byteOffset,X.scales.byteLength))}}})():(()=>{let X=ke(K);return{deq:ge(X),gpu:{nib:this.uploadGpuRaw(X.nibbles),sc:this.uploadGpuRaw(new Uint8Array(X.scales.buffer,X.scales.byteOffset,X.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(X.mins.buffer,X.mins.byteOffset,X.mins.byteLength))}}})(),ne=await this.conv2dDirect(I,te.deq,H,40,20,20,12,1,1,1,0);this.convTiledQOk=!0;let ce=this.recordingSession(),de=await ce.finish(ce.conv2d(I,te.gpu,H,40,20,20,12,1,1,1,0),4800);if(this.releaseGpu(Object.values(te.gpu)),!r(de,ne)){V&&console.warn(`[selfValidate] conv2d_1x1_${re} KO sur ce GPU : repli sur conv2d_direct_${re}.`),this.convTiledQOk=!1;break}}this.convTiledQOk=this.convTiledQOk&&V}{let I=e(3200),K=e(288),H=e(4),V=this.convTiledQOk;for(let re of["q8","q4"]){let te=re==="q8"?(()=>{let X=Pe(K);return{deq:me(X),gpu:{codes:this.uploadGpuRaw(new Uint8Array(X.codes.buffer,X.codes.byteOffset,X.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(X.scales.buffer,X.scales.byteOffset,X.scales.byteLength))}}})():(()=>{let X=ke(K);return{deq:ge(X),gpu:{nib:this.uploadGpuRaw(X.nibbles),sc:this.uploadGpuRaw(new Uint8Array(X.scales.buffer,X.scales.byteOffset,X.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(X.mins.buffer,X.mins.byteOffset,X.mins.byteLength))}}})(),ne=await this.conv2dDirect(I,te.deq,H,8,20,20,4,3,3,1,1);this.convTiledQOk=!0;let ce=this.recordingSession(),de=await ce.finish(ce.conv2d(I,te.gpu,H,8,20,20,4,3,3,1,1),1600);if(this.releaseGpu(Object.values(te.gpu)),!r(de,ne)){V&&console.warn(`[selfValidate] conv2d_3x3_tiled_${re} KO sur ce GPU : repli sur conv2d_direct_${re} (plus lent, m\xEAme r\xE9sultat).`),this.convTiledQOk=!1;break}}this.convTiledQOk=this.convTiledQOk&&V}{let I=e(3200),K=e(288),H=e(4),V=this.convS2Ok,re=Math.floor(19/2)+1,te=Math.floor(19/2)+1;for(let ne of["q8","q4"]){let ce=ne==="q8"?(()=>{let Z=Pe(K);return{deq:me(Z),gpu:{codes:this.uploadGpuRaw(new Uint8Array(Z.codes.buffer,Z.codes.byteOffset,Z.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(Z.scales.buffer,Z.scales.byteOffset,Z.scales.byteLength))}}})():(()=>{let Z=ke(K);return{deq:ge(Z),gpu:{nib:this.uploadGpuRaw(Z.nibbles),sc:this.uploadGpuRaw(new Uint8Array(Z.scales.buffer,Z.scales.byteOffset,Z.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(Z.mins.buffer,Z.mins.byteOffset,Z.mins.byteLength))}}})(),de=await this.conv2dDirect(I,ce.deq,H,8,20,20,4,3,3,2,1);this.convS2Ok=!0;let X=this.recordingSession(),_e=await X.finish(X.conv2d(I,ce.gpu,H,8,20,20,4,3,3,2,1),4*re*te);if(this.releaseGpu(Object.values(ce.gpu)),!r(_e,de)){V&&console.warn(`[selfValidate] conv2d_3x3_s2_tiled_${ne} KO sur ce GPU : repli sur direct.`),this.convS2Ok=!1;break}}this.convS2Ok=this.convS2Ok&&V}if(this.hasSubgroups&&this.subgroupsOk)try{let j=e(1500),z=e(300),I=r(await this.rmsnormVec(j,z,5,300,1e-5,!1,"rmsnorm_vec_subgroup"),await this.rmsnormVec(j,z,5,300,1e-5,!1)),K=8,H=130,V=4,re=e(K*H),te=e(K),ne=e(K),ce=r(await this.groupNorm(re,te,ne,K,H,V,1e-5,"group_norm_subgroup"),await this.groupNorm(re,te,ne,K,H,V));if(!I||!ce){let de=[!I&&"rmsnorm_vec_subgroup",!ce&&"group_norm_subgroup"].filter(Boolean).join(" + ");console.warn(`[selfValidate] ${de} KO sur ce GPU : repli sur la r\xE9duction en m\xE9moire partag\xE9e.`),this.subgroupsOk=!1}}catch(O){console.warn("[selfValidate] subgroups indisponibles \xE0 l'ex\xE9cution : repli sur la m\xE9moire partag\xE9e.",O),this.subgroupsOk=!1}{let R=e(66),j=new Uint16Array(66);for(let H=0;H<66;H++)j[H]=Te(R[H]);let z=new Float32Array(66);for(let H=0;H<66;H++)z[H]=we(j[H]);let I=this.f16ToF32Gpu(new Uint8Array(j.buffer,j.byteOffset,j.byteLength),66),K=await this.readGpu(I,66);if(I.destroy?.(),!r(K,z,1e-6))return"f16_to_f32"}let x=e(70);if(!r(await this.relu(x),x.map(O=>Math.max(O,0))))return"relu";let y=2,P=2,U=2,G=2,_=P*G,F=U*G,C=e(y*P*U),D=new Float32Array(y*_*F);for(let O=0;O<y;O++)for(let R=0;R<_;R++)for(let j=0;j<F;j++)D[O*_*F+R*F+j]=C[O*P*U+Math.floor(R/G)*U+Math.floor(j/G)];if(!r(await this.upsampleNearest(C,y,P,U,G),D))return"upsample_nearest";let T=2,L=8,N=1e-5,Q=e(T*L),Y=e(L),$=e(L),J=new Float32Array(T*L);for(let O=0;O<T;O++){let R=O*L,j=0;for(let K=0;K<L;K++)j+=Q[R+K];j/=L;let z=0;for(let K=0;K<L;K++){let H=Q[R+K]-j;z+=H*H}z/=L;let I=1/Math.sqrt(z+N);for(let K=0;K<L;K++)J[R+K]=(Q[R+K]-j)*I*Y[K]+$[K]}if(!r(await this.layernorm(Q,Y,$,T,L,N),J))return"layernorm";let W=e(70);if(!r(await this.quickGelu(W),W.map(O=>O/(1+Math.exp(-1.702*O)))))return"quick_gelu";{let K=1/Math.sqrt(4),H=e(24),V=e(40),re=e(40),te=new Float32Array(24);for(let ne=0;ne<2;ne++)for(let ce=0;ce<3;ce++){let de=new Float32Array(5),X=-1/0;for(let Z=0;Z<5;Z++){let Ge=0;for(let he=0;he<4;he++)Ge+=H[ce*8+ne*4+he]*V[Z*8+ne*4+he];de[Z]=Ge*K,de[Z]>X&&(X=de[Z])}let _e=0;for(let Z=0;Z<5;Z++)de[Z]=Math.exp(de[Z]-X),_e+=de[Z];for(let Z=0;Z<4;Z++){let Ge=0;for(let he=0;he<5;he++)Ge+=de[he]/_e*re[he*8+ne*4+Z];te[ce*8+ne*4+Z]=Ge}}if(!r(await this.attentionFull(H,V,re,3,2,2,4,5),te))return"attention_full"}if(this.attnFullWgOk){let O=[{nT:70,kvL:70,nH:5,hd:64},{nT:16,kvL:77,nH:5,hd:64},{nT:9,kvL:9,nH:8,hd:160}];for(let R of O){let j=R.nH*R.hd,z=e(R.nT*j),I=e(R.kvL*j),K=e(R.kvL*j),H=await this.attentionFull(z,I,K,R.nT,R.nH,R.nH,R.hd,R.kvL),V=await this.attentionFullWg(z,I,K,R.nT,R.nH,R.nH,R.hd,R.kvL);if(!r(V,H)){this.attnFullWgOk=!1,console.warn(`[selfValidate] attention_full_wg KO sur ce GPU (hd=${R.hd}, kv=${R.kvL}) : repli sur attention_full (plus lent, m\xEAme r\xE9sultat).`);break}}}return null}};ee.timingOn=(()=>{try{return oe("timing")==="1"}catch{return!1}})(),ee.profileOn=(()=>{try{return oe("gpuprofile")==="1"}catch{return!1}})(),ee.MAX_WG_DIM=65535,ee.BLOCK_ELEMS={Q4_K:256,Q5_K:256,Q6_K:256,Q8_0:32,Q5_0:32,Q4_0:32,F32:1,F16:1},ee.DEQUANT_SHADER={Q4_K:"dequant_q4k",Q8_0:"dequant_q8_0",Q5_0:"dequant_q5_0",Q6_K:"dequant_q6k",Q4_0:"dequant_q4_0",Q5_K:"dequant_q5k"},ee.STORAGE_USAGE=140;Je=ee});function hr(l,e){let r=new DataView(l.buffer,l.byteOffset,l.byteLength),t=new Float32Array(e);for(let n=0;n<e;n++)t[n]=pe(r.getUint16(n*2,!0));return t}function mr(l,e){let r=new DataView(l.buffer,l.byteOffset,l.byteLength),t=new Float32Array(e);for(let n=0;n<e;n++)t[n]=r.getFloat32(n*4,!0);return t}function Ke(l,e,r,t){let n=0;for(let s=0;s<r;s++)n+=l[s]*l[s];let i=1/Math.sqrt(n/r+t),a=new Float32Array(r);for(let s=0;s<r;s++)a[s]=l[s]*i*e[s];return a}var xn,Me,Ze,vr=ae(()=>{"use strict";pt();ht();gt();je();xn=l=>l/(1+Math.exp(-l)),Me=class Me{constructor(e,r,t){this.engine=e;this.manifest=r;this.raw=t;this.w=new Map;this.g=new Map;this.pos=0;this.rLayers=[];this.tokNormGpu=null;this.normBufs=[];this.ffn=0}isBigProj(e){return/\.(shortconv\.(in_proj|out_proj)|attn_(q|k|v|output)|ffn_(gate|up|down))\.weight$/.test(e)}async load(e){if(!this.engine.lfm2ShortConvOk)throw new Error("kernel shortconv LFM2 invalid\xE9 sur ce GPU (selfValidate) : archi lfm2 refus\xE9e.");let r=this.manifest.arch;if(this.D=r.d,this.NH=r.nHeads,this.NKV=r.nKvHeads,this.HD=r.headDim,this.NL=r.blockCount,this.vocab=r.vocab,this.EPS=r.rmsEps,this.THETA=r.ropeTheta,!r.lfm2)throw new Error("manifest sans profil lfm2");this.LC=r.lfm2.lCache,this.convLayer=r.lfm2.kvHeadsPerLayer.map(t=>t===0),this.tok=e,this.stops=new Set(this.manifest.chat?.stopTokenIds?.length?this.manifest.chat.stopTokenIds:[7]);for(let[t,n]of Object.entries(this.manifest.tensors)){if(t==="token_embd.weight"){if(this.embedBytes=await this.raw(t),this.embedDtype=n.dtype,n.dtype==="q4"){let a=qe(this.embedBytes,n.nElems);this.g.set("head",{kind:"q4",nib:this.engine.uploadGpuRaw(a.nibbles),sc:this.up(a.scales),mn:this.up(a.mins),IN:this.D,OUT:this.vocab})}else if(n.dtype==="q8"){let a=Oe(this.embedBytes,n.nElems);this.g.set("head",{kind:"q8",codes:this.upI8(a.codes),sc:this.up(a.scales),IN:this.D,OUT:this.vocab})}else if(n.dtype==="q3")throw new Error("LFM2 : t\xEAte li\xE9e en q3 non support\xE9e (le convertisseur garde un plancher q4)");continue}let i=await this.raw(t);if(this.isBigProj(t)&&(n.dtype==="q3"||n.dtype==="q4"||n.dtype==="q8")){let a=n.shape[0],s=n.nElems/a;if(n.dtype==="q8"){let o=Oe(i,n.nElems);this.g.set(t,{kind:"q8",codes:this.upI8(o.codes),sc:this.up(o.scales),IN:a,OUT:s})}else if(n.dtype==="q3"){let o=De(i,n.nElems);this.g.set(t,{kind:"q3",q3:!0,lo:this.up32(o.lo),hi:this.up32(o.hi),sc:this.up(o.scales),mn:this.up(o.mins),IN:a,OUT:s})}else{let o=qe(i,n.nElems);this.g.set(t,{kind:"q4",nib:this.engine.uploadGpuRaw(o.nibbles),sc:this.up(o.scales),mn:this.up(o.mins),IN:a,OUT:s})}}else this.w.set(t,this.decodePetit(t,i,n))}this.buildResidentLayers(),this.reset()}buildResidentLayers(){let e=r=>{let t=this.engine.uploadGpu(this.w.get(r));return this.normBufs.push(t),t};this.tokNormGpu=e("token_embd_norm.weight"),this.ffn=this.g.get("blk.0.ffn_gate.weight")?.OUT??0,this.rLayers=[];for(let r=0;r<this.NL;r++){let t=`blk.${r}.`,n={attnNorm:e(t+"attn_norm.weight"),ffnNorm:e(t+"ffn_norm.weight"),wgate:this.g.get(t+"ffn_gate.weight"),wup:this.g.get(t+"ffn_up.weight"),wdown:this.g.get(t+"ffn_down.weight")};this.convLayer[r]?this.rLayers.push({conv:!0,...n,convW:e(t+"shortconv.conv.weight"),inProj:this.g.get(t+"shortconv.in_proj.weight"),outProj:this.g.get(t+"shortconv.out_proj.weight")}):this.rLayers.push({conv:!1,...n,qNorm:e(t+"attn_q_norm.weight"),kNorm:e(t+"attn_k_norm.weight"),wq:this.g.get(t+"attn_q.weight"),wk:this.g.get(t+"attn_k.weight"),wv:this.g.get(t+"attn_v.weight"),wo:this.g.get(t+"attn_output.weight")})}}residentAvailable(){return this.engine.lfm2ResidentOk!==!1&&!!this.g.get("head")&&this.rLayers.length===this.NL&&this.ffn>0}cfg(){return{D:this.D,nHeads:this.NH,nKvHeads:this.NKV,headDim:this.HD,ffn:this.ffn,eps:this.EPS,theta:this.THETA,lc:this.LC,vocab:this.vocab}}embedsFor(e){let r=this.D,t=new Float32Array(e.length*r);for(let n=0;n<e.length;n++)t.set(this.embedRow(e[n]),n*r);return t}async logitsGpu(e,r,t){return this.pos=r+e.length,this.engine.lfm2LogitsGpu(this.embedsFor(e),e.length,this.cfg(),this.rLayers,this.g.get("head"),this.tokNormGpu,r,t)}async topKGpu(e,r,t,n,i,a=40){return this.pos=r+e.length,this.engine.lfm2TopKGpu(this.embedsFor(e),e.length,this.cfg(),this.rLayers,this.g.get("head"),this.tokNormGpu,r,t,n,i,a)}async prefillGpu(e,r,t){this.pos=r+e.length,await this.engine.lfm2PrefillGpu(this.embedsFor(e),e.length,this.cfg(),this.rLayers,this.tokNormGpu,r,t)}decodePetit(e,r,t){switch(t.dtype){case"f32":return mr(r,t.nElems);case"f16":return hr(r,t.nElems);case"q8":return me(Oe(r,t.nElems));case"q4":return ge(qe(r,t.nElems));case"q3":return Le(De(r,t.nElems));default:throw new Error(`LFM2 : dtype \xAB ${t.dtype} \xBB non support\xE9 pour ${e}`)}}up(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}up32(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}upI8(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}unload(){for(let e of this.g.values())for(let r of["nib","sc","mn","codes"])e[r]?.destroy?.();for(let e of this.normBufs)e?.destroy?.();this.normBufs=[],this.rLayers=[],this.tokNormGpu=null,this.engine.clearLfm2State?.(),this.g.clear(),this.w.clear()}reset(){this.pos=0,this.state=Array.from({length:this.NL},(e,r)=>this.convLayer[r]?{conv:new Float32Array((this.LC-1)*this.D)}:{K:[],V:[]})}async gemm(e,r){let t=this.g.get(e);if(!t){let n=this.w.get(e==="head"?"token_embd.weight":e),i=n.length/r.length,a=new Float32Array(i);for(let s=0;s<i;s++){let o=0,u=s*r.length;for(let c=0;c<r.length;c++)o+=n[u+c]*r[c];a[s]=o}return a}return t.kind==="q8"?this.engine.matmulQ8(r,t.codes,t.sc,1,t.IN,t.OUT):t.kind==="q3"?this.engine.matmulQ3(r,t.lo,t.hi,t.sc,t.mn,1,t.IN,t.OUT):this.engine.matmulQ4(r,t.nib,t.sc,t.mn,1,t.IN,t.OUT)}embedRow(e){let r=this.D;if(this.embedDtype==="f16")return hr(this.embedBytes.subarray(e*r*2,e*r*2+r*2),r);if(this.embedDtype==="f32")return mr(this.embedBytes.subarray(e*r*4,e*r*4+r*4),r);if(this.embedDtype==="q8"){let o=this.vocab*r,u=r/32,c=new Int8Array(this.embedBytes.buffer,this.embedBytes.byteOffset+e*r,r),d=this.embedBytes.subarray(o+e*u*2,o+e*u*2+u*2),f=new DataView(d.buffer,d.byteOffset,d.byteLength),p=new Float32Array(r);for(let g=0;g<u;g++){let m=pe(f.getUint16(g*2,!0));for(let b=0;b<32;b++)p[g*32+b]=c[g*32+b]*m}return p}let t=this.vocab*r,n=r/32,i=t/2,a=t/2+t/32*2,s=new Uint8Array(r/2+n*2*2);return s.set(this.embedBytes.subarray(e*r/2,e*r/2+r/2),0),s.set(this.embedBytes.subarray(i+e*n*2,i+e*n*2+n*2),r/2),s.set(this.embedBytes.subarray(a+e*n*2,a+e*n*2+n*2),r/2+n*2),ge(qe(s,r))}rope(e,r,t){let n=this.HD,i=e.slice();for(let a=0;a<r;a++){let s=a*n;for(let o=0;o<n/2;o++){let u=Math.pow(this.THETA,-2*o/n),c=Math.cos(t*u),d=Math.sin(t*u),f=e[s+o],p=e[s+o+n/2];i[s+o]=f*c-p*d,i[s+o+n/2]=f*d+p*c}}return i}async forwardToken(e){let r=this.D,t=this.pos++,n=this.embedRow(e);for(let i=0;i<this.NL;i++){let a=`blk.${i}.`,s=this.state[i],o=Ke(n,this.w.get(a+"attn_norm.weight"),r,this.EPS),u;if(this.convLayer[i]){let g=await this.gemm(a+"shortconv.in_proj.weight",o),m=await this.engine.lfm2ShortConv(g,s.conv,this.w.get(a+"shortconv.conv.weight"),r,this.LC);s.conv=m.state,u=await this.gemm(a+"shortconv.out_proj.weight",m.out)}else{let g=await this.gemm(a+"attn_q.weight",o),m=await this.gemm(a+"attn_k.weight",o),b=await this.gemm(a+"attn_v.weight",o),k=this.w.get(a+"attn_q_norm.weight"),B=this.w.get(a+"attn_k_norm.weight");for(let A=0;A<this.NH;A++)g.set(Ke(g.slice(A*this.HD,(A+1)*this.HD),k,this.HD,this.EPS),A*this.HD);for(let A=0;A<this.NKV;A++)m.set(Ke(m.slice(A*this.HD,(A+1)*this.HD),B,this.HD,this.EPS),A*this.HD);g=this.rope(g,this.NH,t),m=this.rope(m,this.NKV,t),s.K.push(m),s.V.push(b);let S=new Float32Array(this.NH*this.HD),q=s.K.length,M=1/Math.sqrt(this.HD),E=this.NH/this.NKV;for(let A=0;A<this.NH;A++){let w=Math.floor(A/E),v=A*this.HD,h=w*this.HD,x=new Float32Array(q),y=-1e30;for(let U=0;U<q;U++){let G=0;for(let _=0;_<this.HD;_++)G+=g[v+_]*s.K[U][h+_];x[U]=G*M,x[U]>y&&(y=x[U])}let P=0;for(let U=0;U<q;U++)x[U]=Math.exp(x[U]-y),P+=x[U];for(let U=0;U<q;U++){let G=x[U]/P;for(let _=0;_<this.HD;_++)S[v+_]+=G*s.V[U][h+_]}}u=await this.gemm(a+"attn_output.weight",S)}for(let g=0;g<r;g++)n[g]+=u[g];let c=Ke(n,this.w.get(a+"ffn_norm.weight"),r,this.EPS),d=await this.gemm(a+"ffn_gate.weight",c),f=await this.gemm(a+"ffn_up.weight",c);for(let g=0;g<d.length;g++)d[g]=xn(d[g])*f[g];let p=await this.gemm(a+"ffn_down.weight",d);for(let g=0;g<r;g++)n[g]+=p[g]}return n=Ke(n,this.w.get("token_embd_norm.weight"),r,this.EPS),this.gemm("head",n)}async classify(e,r){this.reset();let t;for(let i of this.tok.encode(e))t=await this.forwardToken(i);let n=r.map(i=>{let a=this.tok.encode(i);return{label:i,logit:t[a[1]??a[0]]}}).sort((i,a)=>a.logit-i.logit);return{label:n[0].label,scores:n}}banTools(e){for(let r of Me.TOOL_BAN)r<e.length&&(e[r]=-1e30);return e}sampleTok(e,r,t){let{temperature:n=.8,topK:i=40,repeatPenalty:a=1.3}=t,s=new Set(r),o=[];for(let f=0;f<e.length;f++){let p=e[f];s.has(f)&&(p=p>0?p/a:p*a),o.push({i:f,v:p})}o.sort((f,p)=>p.v-f.v),o.length=i;let u=o[0].v,c=0;for(let f of o)f.p=Math.exp((f.v-u)/n),c+=f.p;let d=Math.random()*c;for(let f of o)if(d-=f.p,d<=0)return f.i;return o[0].i}async generate(e,r,t,n,i){this.reset();let a=this.tok.encode(e),s;for(let u of a)s=await this.forwardToken(u);let o=[];for(let u=0;u<r&&!n?.();u++){this.banTools(s);let c;if(i?.sample)c=this.sampleTok(s,o.slice(-64),i);else{c=0;for(let d=1;d<s.length;d++)s[d]>s[c]&&(c=d)}if(this.stops.has(c))break;o.push(c),t&&t(this.tok.decode(o)),s=await this.forwardToken(c)}return o.length?this.tok.decode(o):""}pickFromTopK(e,r){let t=[],n=[];for(let f=0;f<e.ids.length;f++)if(!Me.TOOL_BAN.includes(e.ids[f])){if(e.vals[f]===-1/0)break;t.push(e.ids[f]),n.push(e.vals[f])}if(!t.length)return e.ids[0];if(!r?.sample)return t[0];let{temperature:i=.8,topK:a=40}=r,s=Math.min(a,t.length),o=n[0],u=0,c=new Array(s);for(let f=0;f<s;f++)c[f]=Math.exp((n[f]-o)/i),u+=c[f];let d=Math.random()*u;for(let f=0;f<s;f++)if(d-=c[f],d<=0)return t[f];return t[0]}async generateResident(e,r,t,n,i){if(!this.residentAvailable())return this.generate(e,r,t,n,i);let a="gen",s=i?.repeatPenalty??(i?.sample?1.3:1),o=this.tok.encode(e),u,c=0;for(;c<o.length;){if(n?.())return"";let p=Math.min(c+Me.PREFILL_CHUNK,o.length),g=o.slice(c,p);p<o.length?await this.prefillGpu(g,c,a):u=await this.topKGpu(g,c,a,[],1,48),c=p}let d=o.length,f=[];for(let p=0;p<r&&!n?.();p++){let g=this.pickFromTopK(u,i);if(this.stops.has(g))break;f.push(g),t&&t(this.tok.decode(f)),u=await this.topKGpu([g],d,a,s!==1?[...new Set(f.slice(-64))]:[],s,48),d++}return f.length?this.tok.decode(f):""}};Me.TOOL_BAN=[8,10,12],Me.PREFILL_CHUNK=128;Ze=Me});function br(l){if(!l.length)return null;let e=1/0,r=0,t=0;for(let n of l)e=Math.min(e,n.offset),r=Math.max(r,n.offset+n.bytes),t+=n.bytes;return r-e>64<<20||r-e>t*1.5?null:{start:e,end:r}}function wr(l,e){let r=new Map;for(let i of Object.keys(l)){let a=i.match(/^blk\.(\d+)\./);if(!a)continue;let s=r.get(a[1]);s||r.set(a[1],s=[]),s.push(i)}let t=new Map,n=new Map;return async i=>{let a=l[i];if(!a)throw new Error(`tenseur absent : ${i}`);let s=i.match(/^blk\.(\d+)\./),o=s?r.get(s[1]):void 0,u=o?br(o.map(b=>l[b])):null;if(!s||!o||!u)return e.bytes(a.offset,a.bytes);let c=s[1],d=t.get(c);d||(d=e.bytes(u.start,u.end-u.start).then(b=>({start:u.start,bytes:b})),t.set(c,d),n.set(c,o.length));let{start:f,bytes:p}=await d,g=p.subarray(a.offset-f,a.offset-f+a.bytes),m=(n.get(c)??1)-1;return m<=0?(t.delete(c),n.delete(c),new Uint8Array(g)):(n.set(c,m),g)}}var wt=ae(()=>{"use strict"});var yr=ae(()=>{"use strict"});function Ar(l,e=16){return Math.ceil(l/e)*e}function qn(l){if(l.length>128||l.includes(".."))return!1;let e=l.split("/");return e.length<=2&&e.every(r=>Bn.test(r))}function Pr(l){let e=a=>{throw new Error(`BRIK: manifeste invalide \u2014 ${a}`)};(!l||typeof l!="object")&&e("ce n'est pas un objet"),l.format!=="brik"&&e(`champ format \xAB ${String(l.format)} \xBB (attendu \xAB brik \xBB)`),(!Se(l.version,1024)||l.version<1)&&e(`version ${String(l.version)}`),(!l.model||typeof l.model.name!="string"||l.model.name.length>512)&&e("champ model.name");let r=l.arch;(!r||typeof r!="object"||typeof r.arch!="string"||r.arch.length>64)&&e("champ arch.arch");for(let[a,s]of[["d",262144],["nHeads",4096],["nKvHeads",4096],["headDim",4096],["ffn",1048576],["blockCount",1024],["vocab",1e7]])Se(r[a],s)||e(`arch.${a} = ${String(r[a])}`);for(let a of["ropeTheta","rmsEps"])(typeof r[a]!="number"||!Number.isFinite(r[a]))&&e(`arch.${a} = ${String(r[a])}`);l.tokenizer&&(l.tokenizer.kind!=="hf-hub"&&l.tokenizer.kind!=="embedded"&&e(`tokenizer.kind \xAB ${String(l.tokenizer.kind)} \xBB`),l.tokenizer.id&&!qn(l.tokenizer.id)&&e(`tokenizer.id \xAB ${l.tokenizer.id} \xBB (attendu : \xAB auteur/d\xE9p\xF4t \xBB ou une sentinelle sans barre oblique)`)),(!Array.isArray(l.shards)||l.shards.length===0||l.shards.length>kr)&&e(`${Array.isArray(l.shards)?l.shards.length:"aucun"} shard`);let t=new Map;for(let a of l.shards)Se(a.id,kr)||e(`shard.id = ${String(a.id)}`),t.has(a.id)&&e(`shard ${a.id} d\xE9clar\xE9 deux fois`),(typeof a.file!="string"||a.file.length>256)&&e(`shard.file du shard ${a.id}`),Se(a.byteLength,et)||e(`shard.byteLength du shard ${a.id} = ${String(a.byteLength)}`),t.set(a.id,a.byteLength);(!l.tensors||typeof l.tensors!="object")&&e("champ tensors");let n=Object.keys(l.tensors);(n.length===0||n.length>_n)&&e(`${n.length} tenseurs`);let i=0;for(let a of n){let s=l.tensors[a];(!s||typeof s!="object")&&e(`tenseur ${a}`),Gn.includes(s.dtype)||e(`dtype \xAB ${String(s.dtype)} \xBB du tenseur ${a}`),(!Array.isArray(s.shape)||s.shape.length>8||!s.shape.every(u=>Se(u,2**32)))&&e(`shape du tenseur ${a}`),Se(s.nElems,2**40)||e(`nElems du tenseur ${a}`),(!Se(s.offset,et)||!Se(s.byteLength,et))&&e(`offset/byteLength du tenseur ${a}`);let o=t.get(s.shard);o===void 0&&e(`le tenseur ${a} r\xE9f\xE9rence le shard ${String(s.shard)}, absent du manifeste`),s.offset+s.byteLength>o&&e(`le tenseur ${a} d\xE9passe son shard (${s.offset}+${s.byteLength} > ${o})`),i+=s.byteLength}return i>et&&e(`${i} octets de tenseurs au total`),l}var kr,_n,et,Gn,Bn,Se,Ur=ae(()=>{"use strict";kr=4096,_n=2e5,et=64*1024*1024*1024,Gn=["f16","f32","q4","q8","q3"],Bn=/^[A-Za-z0-9._-]+$/;Se=(l,e)=>typeof l=="number"&&Number.isInteger(l)&&l>=0&&l<=e});function Sn(l){return Ar(Ee+l)}function yt(l){if(l.length<Ee)throw new Error("BRIK: fichier tronqu\xE9 (en-t\xEAte)");let e=String.fromCharCode(l[0],l[1],l[2],l[3]);if(e!==Fn)throw new Error(`BRIK: sceau magique absent (${e})`);let r=new DataView(l.buffer,l.byteOffset,l.byteLength),t=r.getUint32(4,!0),n=r.getUint32(8,!0);if(Ee+n>l.length)throw new Error("BRIK: manifeste tronqu\xE9");return{manifest:Pr(JSON.parse(new TextDecoder().decode(l.subarray(Ee,Ee+n)))),version:t,dataStart:Sn(n)}}function xr(l){let{manifest:e,version:r,dataStart:t}=yt(l);return{manifest:e,version:r,dataStart:t,data:l.subarray(t)}}var Fn,Ee,_r=ae(()=>{"use strict";Ur();Fn="BRIK",Ee=12});function Gr(l){let e=[...l].sort((n,i)=>n.id-i.id),r=[],t=0;for(let n of e)r[n.id]=t,t+=n.byteLength;return r}function Br(l){let e=Gr(l.shards),r={};for(let[n,i]of Object.entries(l.tensors)){let a=On[i.dtype];if(!a)throw new Error(`dtype BRIK inconnu pour ${n} : ${i.dtype}`);if(e[i.shard]===void 0)throw new Error(`shard ${i.shard} absent du manifeste (tenseur ${n})`);r[n]={offset:e[i.shard]+i.offset,bytes:i.byteLength,nElems:i.nElems,type:a,shape:i.shape}}let t=l.arch;return{arch:t.arch,config:{d:t.d,nHeads:t.nHeads,nKvHeads:t.nKvHeads,headDim:t.headDim,ffn:t.ffn,blockCount:t.blockCount,ropeTheta:t.ropeTheta,rmsEps:t.rmsEps,attnLogitSoftcap:t.attnLogitSoftcap,finalLogitSoftcap:t.finalLogitSoftcap,attnScale:t.attnScale,act:t.act,rmsGainOnePlus:t.rmsGainOnePlus,embedScale:t.embedScale,rwkv:t.rwkv,lfm2:t.lfm2},tensors:r}}var On,qr=ae(()=>{"use strict";On={f16:"F16",f32:"F32",q4:"Q4W",q8:"Q8W",q3:"Q3W"}});function Mn(l){return Tn[l]}async function Rn(l){let e=l.slice();return Cn(await crypto.subtle.digest("SHA-256",e.buffer))}async function kt(l,e){let r=Mn(l);if(!r)return;if(typeof crypto>"u"||!crypto.subtle){console.warn("[int\xE9grit\xE9] crypto.subtle indisponible (contexte non s\xE9curis\xE9) : empreinte du manifeste NON v\xE9rifi\xE9e.");return}let t=await Rn(e);if(t!==r)throw console.error(`[int\xE9grit\xE9] manifeste inattendu pour ${l}
  attendu : ${r}
  obtenu  : ${t}`),new Error("Ce mod\xE8le ne correspond pas \xE0 celui que Brimkern publie : son manifeste a une empreinte diff\xE9rente de celle attendue. Chargement refus\xE9. Si tu viens de t\xE9l\xE9verser une nouvelle version, relance `npm run brik:digest`.")}var Tn,Cn,Fr=ae(()=>{"use strict";Tn={"https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik":"aca6214b45c294c1d4c51c46aa23acc22cc53cb95a6894c62d2bd0570ca12afe","https://huggingface.co/romainkh14/Qwen2.5-0.5B-Instruct_BRIK/resolve/main/qwen2.5-0.5b-instruct-mixed.brik":"315d2a1cc17b64b029eb24e9668e5c959fd151ae926c9758bddc6a8193e52f6d","https://huggingface.co/romainkh14/Qwen3-4B_BRIK/resolve/main/qwen3-4b-q4.brik":"23f9c0cc66ec21056e656bdaa5cbfda2e93673718ea3ab0dfad19c6e7f583f7d","https://huggingface.co/romainkh14/RWKV-7-G1-0.1B_BRIK/resolve/main/rwkv7-g1-0.1b-q4.brik":"bb8d211e1f95af415b7dca8b0b074c236ebe9d0844f1f372c11eecbcf15fb372","https://huggingface.co/romainkh14/RWKV-7-G1a-0.4B_BRIK/resolve/main/rwkv7-g1a-0.4b-q4.brik":"47e67144bb9dcd41918f3117aa6ee21420ff94f93289c338d8331620d3153b10","https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main/sd-turbo-clip-mixed.brik":"b873aaad23ca70d4e29c0350d124fd6ee0a18470aaf59719f14c9eb9f227b3ac","https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main/sd-turbo-clip-q8.brik":"b3e05c74f8f0327e878787100224983a454e4228d2ae008902875a6256fb2bae","https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main/sd-turbo-unet-q8.brik":"ca3a5c21512542656a8a736c88f67d37a482cacbf499a080c9bf32ca36bf6b0f","https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main/sdxs-unet-light.brik":"42f7c0e82971a558d56548edec947b1ed7d9c0e509d634b51fc29429177e7654","https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main/video-clip-q8.brik":"e81ca57426716237dce2853703c70172a829f78704b7df77c9ee980534c82a76","https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main/video-motion-q8.brik":"e976e13a5bc0858b8277eefed59cc0d77239b5a30ecae68d483e24eb983ae481","https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main/video-unet-q8.brik":"d112b2884afcd038cdbd90bb62ce6b248b404852fb9ce20003b8585927a362b9"},Cn=l=>[...new Uint8Array(l)].map(e=>e.toString(16).padStart(2,"0")).join("")});function Ln(l,e,r){return`${l}${l.includes("?")?"&":"?"}__brik=${e}-${r}`}async function jn(){try{return await caches.open(Dn)}catch{return null}}async function At(l,e,r,t){let n=e+r-1,i=await jn(),a=Ln(l,e,n);if(i){let o=await i.match(a);if(o)return{bytes:new Uint8Array(await o.arrayBuffer()),ranged:!0}}let s;for(let o=0;o<4;o++)try{let u=await fetch(l,{headers:{Range:`bytes=${e}-${n}`},signal:t});if(!u.ok&&u.status!==206)throw new Error(`range fetch ${e}-${n} \xE9chou\xE9 : HTTP ${u.status}`);let c=u.status===206,d=new Uint8Array(await u.arrayBuffer()),f=c?d:d.subarray(e,e+r);if(i&&c)try{await i.put(a,new Response(f,{headers:{"Content-Length":String(f.byteLength)}}))}catch(p){Mr(p)}return{bytes:f,ranged:c}}catch(u){if(t?.aborted)throw u;s=u,o<3&&await new Promise(c=>setTimeout(c,500*2**o))}throw s instanceof Error?s:new Error(String(s))}function Mr(l){Sr||(Sr=!0,console.warn("[cache] \xE9criture refus\xE9e (quota plein ? navigation priv\xE9e ?) : les t\xE9l\xE9chargements de mod\xE8les ne seront PAS r\xE9utilisables \xE0 la prochaine visite. Lib\xE9rez de l'espace via le panneau Stockage.",l))}async function Hn(l){try{let n=await(await caches.open(Or)).match(l);if(n)return new Uint8Array(await n.arrayBuffer())}catch{}let e=await fetch(l);if(!e.ok)throw new Error(`HTTP ${e.status}`);let r=new Uint8Array(await e.arrayBuffer());try{await(await caches.open(Or)).put(l,new Response(r.slice(),{headers:{"Content-Length":String(r.byteLength)}}))}catch(t){Mr(t)}return r}function zn(l,e){return{bytes:async(r,t)=>(await At(l,e+r,t)).bytes}}function Kn(l){return{bytes:async(e,r)=>l.subarray(e,e+r)}}async function Rr(l){let e=await At(l,0,12);if(!e.ranged){let a=await Hn(l),{manifest:s,data:o}=xr(a);return await kt(l,Tr(a)),Cr(s,Kn(o))}let r=new DataView(e.bytes.buffer,e.bytes.byteOffset,12).getUint32(8,!0),t=await At(l,0,12+r),{manifest:n,dataStart:i}=yt(t.bytes);return await kt(l,Tr(t.bytes)),Cr(n,zn(l,i))}function Tr(l){let e=new DataView(l.buffer,l.byteOffset,12).getUint32(8,!0);return l.subarray(12,12+e)}function Cr(l,e){if(l.model?.uiArch==="image")throw new Error("Ce fichier est un BRIK image (UNet/CLIP) : il se charge via la tuile de g\xE9n\xE9ration d'image, pas comme un LLM.");return{source:e,manifest:Br(l),tokenizerId:l.tokenizer?.id,tokenizer:l.tokenizer,uiArch:l.model?.uiArch,modelName:l.model.name}}var Dn,Sr,Or,Dr=ae(()=>{"use strict";"use client";wt();yr();_r();qr();Fr();Dn="brik-range-v1";Sr=!1;Or="brimkern-model-cache"});function En(l){let e=l.indexOf("<think>");if(e===-1)return l;let r=l.indexOf("</think>",e);return(r===-1?l.slice(0,e):l.slice(0,e)+l.slice(r+8)).trim()}function Lr(l,e,r){l=l.map(n=>n.role==="assistant"?{...n,content:En(n.content)}:n);let t="";if(e==="deepseek"){t+="<\uFF5Cbegin\u2581of\u2581sentence\uFF5C>",r.trim()&&(t+=r);for(let n of l)n.role==="user"?t+=`<\uFF5CUser\uFF5C>${n.content}`:n.role==="assistant"&&(t+=`<\uFF5CAssistant\uFF5C>${n.content}<\uFF5Cend\u2581of\u2581sentence\uFF5C>`);return t+="<\uFF5CAssistant\uFF5C>",t}if(e==="rwkv7"){r.trim()&&(t+=`System: ${r.trim()}

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
`}return t}var jr=ae(()=>{"use strict"});function Nn(){let l=[];for(let i=33;i<=126;i++)l.push(i);for(let i=161;i<=172;i++)l.push(i);for(let i=174;i<=255;i++)l.push(i);let e=l.slice(),r=0;for(let i=0;i<256;i++)l.includes(i)||(l.push(i),e.push(256+r),r++);let t=new Array(256),n=new Map;for(let i=0;i<l.length;i++)t[l[i]]=String.fromCodePoint(e[i]),n.set(String.fromCodePoint(e[i]),l[i]);return{enc:t,dec:n}}var Hr,tt,zr=ae(()=>{"use strict";Hr="'(?:[sdmt]|ll|ve|re)| ?\\p{L}+| ?\\p{N}+| ?[^\\s\\p{L}\\p{N}]+|\\s+(?!\\S)|\\s+",tt=class l{constructor(e){this.vocab=new Map;this.idToTok=new Map;this.ranks=new Map;this.added=[];this.specialIds=new Set;this.addedRe=null;this.bosIds=[];this.cache=new Map;let r=typeof e=="string"?JSON.parse(e):e;if(r?.model?.type!=="BPE")throw new Error(`BpeTokenizer : model.type ${r?.model?.type} non couvert (BPE uniquement)`);({enc:this.byteEnc,dec:this.byteDec}=Nn());for(let[s,o]of Object.entries(r.model.vocab))this.vocab.set(s,o),this.idToTok.set(o,s);(r.model.merges??[]).forEach((s,o)=>this.ranks.set(Array.isArray(s)?`${s[0]} ${s[1]}`:s,o));for(let s of r.added_tokens??[])this.added.push(s),this.vocab.set(s.content,s.id),this.idToTok.set(s.id,s.content),s.special&&this.specialIds.add(s.id);if(this.added.length){let s=this.added.map(o=>o.content.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).sort((o,u)=>u.length-o.length);this.addedRe=new RegExp(`(${s.join("|")})`,"g")}let n=l.findSplitPattern(r.pre_tokenizer)??Hr;this.splitRe=new RegExp(n,"gu");let i=s=>{if(!s)return null;if(s.type==="TemplateProcessing")return s.single;if(s.type==="Sequence")for(let o of s.processors??[]){let u=i(o);if(u)return u}return null},a=i(r.post_processor);if(Array.isArray(a))for(let s of a)if(s.SpecialToken){let o=this.vocab.get(s.SpecialToken.id);o!==void 0&&this.bosIds.push(o)}else break}static findSplitPattern(e){if(!e)return null;if(e.type==="Split"&&e.pattern?.Regex)return e.pattern.Regex;if(e.type==="ByteLevel"&&e.use_regex!==!1)return Hr;if(e.type==="Sequence")for(let r of e.pretokenizers??[]){let t=l.findSplitPattern(r);if(t)return t}return null}bpe(e){let r=this.cache.get(e);if(r)return r;let t=Array.from(e);for(;t.length>1;){let i=-1,a=1/0;for(let s=0;s<t.length-1;s++){let o=this.ranks.get(`${t[s]} ${t[s+1]}`);o!==void 0&&o<a&&(a=o,i=s)}if(i<0)break;t=[...t.slice(0,i),t[i]+t[i+1],...t.slice(i+2)]}let n=[];for(let i of t){let a=this.vocab.get(i);if(a!==void 0)n.push(a);else for(let s of i){let o=this.vocab.get(s);o!==void 0&&n.push(o)}}return this.cache.set(e,n),n}encodeChunk(e){let r=[];for(let t of e.match(this.splitRe)??[]){let n=new TextEncoder().encode(t),i="";for(let a of n)i+=this.byteEnc[a];r.push(...this.bpe(i))}return r}encode(e){let r=[...this.bosIds];if(this.addedRe)for(let t of e.split(this.addedRe)){if(!t)continue;let n=this.vocab.get(t);n!==void 0&&this.added.some(i=>i.content===t)?r.push(n):r.push(...this.encodeChunk(t))}else r.push(...this.encodeChunk(e));return r}decode(e){let r=[];for(let t of e){if(this.specialIds.has(t))continue;let n=this.idToTok.get(t);if(n!==void 0)for(let i of n){let a=this.byteDec.get(i);if(a!==void 0)r.push(a);else for(let s of new TextEncoder().encode(i))r.push(s)}}return new TextDecoder("utf-8",{fatal:!1}).decode(new Uint8Array(r))}}});async function In(l,e){let r=new Je;if(!await r.init())throw new Error("WebGPU indisponible sur ce navigateur.");r.onLost=p=>{console.warn("[brimkern] device GPU perdu ("+(p?.reason||"unknown")+"): rechargement au prochain appel"),xe.delete(l)},await r.selfValidate(),e("t\xE9l\xE9chargement du mod\xE8le\u2026");let t=await Rr(l),n=t.manifest;if(!n?.config?.lfm2){let p=n?.arch??n?.config?.arch??"unknown";throw new Error(`Brimkern SDK v0 runs LFM2 .brik models only: this file's architecture is "${p}". Use the default model (omit \`model\`), or convert/pick an LFM2 .brik. Full model support lives in the app: https://brimkern.com/chat`)}let i=n.tensors["token_embd.weight"],a={arch:{...n.config,arch:"lfm2",vocab:i?i.nElems/n.config.d:0},tensors:Object.fromEntries(Object.entries(n.tensors).map(([p,g])=>[p,{dtype:Qn[g.type]??g.type,shape:g.shape,nElems:g.nElems,shard:0,offset:g.offset,byteLength:g.bytes}])),shards:[{id:0,file:"",byteLength:0}],chat:{template:"chatml",stopTokenIds:[7,2,8,10,12]}},s=Object.values(n.tensors).reduce((p,g)=>p+g.bytes,0),o=0,u=wr(n.tensors,t.source),c=async p=>{let g=n.tensors[p];if(!g)throw new Error(`tenseur absent : ${p}`);let m=await u(p);return o+=g.bytes,e("t\xE9l\xE9chargement du mod\xE8le\u2026",{loaded:o,total:s}),m};e("tokenizer\u2026");let d;try{let p=new tt(t.tokenizer.json);d={encode:g=>p.encode(g),decode:g=>p.decode(g)}}catch(p){console.warn("[brimkern] tokenizer.json non couvert par le BPE bundl\xE9 : repli transformers.js (CDN)",p);let g=await import(Wn),m=new g.PreTrainedTokenizer(JSON.parse(t.tokenizer.json),JSON.parse(t.tokenizer.config));d={encode:b=>Array.from(m(b).input_ids.data,k=>Number(k)),decode:b=>m.decode(b,{skip_special_tokens:!0})}}let f=new Ze(r,a,c);return e("poids sur le GPU\u2026"),await f.load(d),{core:f,engine:r}}function Ne(l){return l&&(l.startsWith("https://")||/^http:\/\/(localhost|127\.0\.0\.1)[:/]/.test(l))?l:Kr[l||"lfm2.5-230m"]||Kr["lfm2.5-230m"]}function rt(l,e){let r=xe.get(l);if(!r){let t={status:"initialisation\u2026",state:"loading",listeners:new Set,promise:null};t.promise=In(l,(n,i)=>{t.status=n,t.progress=i,t.listeners.forEach(a=>a(n,i))}).then(n=>(t.state="ready",n)).catch(n=>{throw t.state="error",xe.delete(l),n}),xe.set(l,t),r=t}return e&&(e(r.status,r.progress),r.listeners.add(e),r.promise.finally(()=>r.listeners.delete(e)).catch(()=>{})),r.promise}async function Er(l,e){let r=await rt(l,e);return r.engine.lost?(xe.delete(l),(await rt(l,e)).core):r.core}async function Nr(l,e){let r=await Er(l);try{return await e(r)}catch(t){let n=xe.get(l);if(!(!n||await n.promise.then(a=>a.engine.lost).catch(()=>!0)))throw t;return console.warn("[brimkern] g\xE9n\xE9ration interrompue par une perte de device : nouvelle tentative"),xe.delete(l),e(await Er(l))}}function Vn(l,e){let r=l.replace(/<\|[a-z_]+\|>/g,"");if(e){let t=r.replace(/^\s*(hello|hi|hey|bonjour|salut)\s*[!,.]\s*/i,"");t.trim()&&(r=t)}return r.trimEnd()}async function Wr(l,e,r,t,n,i,a,s=[]){let o=Lr([...s,...e.slice(-$n)],"lfm2",r),u=s.some(f=>f.role==="assistant")||e.some(f=>f.role==="assistant"),c="";return await(l.residentAvailable?.()?l.generateResident.bind(l):l.generate.bind(l))(o,t,f=>{c=Vn(f,u),i?.(c)},a,{sample:!0,temperature:n,topK:40,repeatPenalty:1.3}),c}var Wn,Kr,Qn,$n,xe,Pt=ae(()=>{"use strict";gr();vr();Dr();wt();jr();zr();Wn="https://esm.sh/@huggingface/transformers@4.2.0",Kr={"lfm2.5-230m":"https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik"},Qn={F16:"f16",F32:"f32",Q4W:"q4",Q8W:"q8",Q3W:"q3"},$n=12;xe=new Map});var Qr={};er(Qr,{LocalBackend:()=>We});var We,Ut=ae(()=>{"use strict";Pt();We=class{constructor(){this.kind="main"}async preload(e,r){await rt(e,r)}state(e){return xe.get(e)?.state}turn(e,r,t){return Nr(e.url,n=>Wr(n,e.history,e.system,e.maxTokens,e.temperature,r,()=>!!t?.aborted,e.pinned))}dispose(){}}});function Yn(){try{if(typeof document>"u")return"";let l=document.currentScript;if(l?.src)return new URL(l.src,document.baseURI).href}catch{}return""}function Ir(l){$r=l}function Vr(){return $r||Xn}var Xn,$r,xt=ae(()=>{"use strict";Xn=Yn(),$r=""});var Yr={};er(Yr,{WorkerBackend:()=>_t});var _t,Xr=ae(()=>{"use strict";xt();_t=class{constructor(){this.kind="worker";this.seq=0;this.pending=new Map;this.states=new Map;if(typeof Worker>"u")throw new Error("Worker indisponible");let e=Vr();if(!e)throw new Error("URL du script introuvable (import ESM ?) : passez workerUrl");let r=(()=>{try{return location.search}catch{return""}})(),t=`self.__brimkernSearch=${JSON.stringify(r)};importScripts(${JSON.stringify(e)});`,n=new Blob([t],{type:"text/javascript"});this.url=URL.createObjectURL(n),this.worker=new Worker(this.url);let i,a;this.hello=new Promise((s,o)=>{i=s,a=o}),this.worker.onerror=s=>a(new Error(`worker: ${s.message||"\xE9chec de chargement"}`)),this.worker.onmessage=s=>{let o=s.data;if(o.type==="hello"){i();return}let u=this.pending.get(o.id);if(u){if(o.type==="progress"){u.onProgress?.(o.status,o.progress);return}if(o.type==="token"){u.onToken?.(o.text);return}this.pending.delete(o.id),o.type==="error"?u.reject(new Error(o.message)):o.type==="state"?u.resolve(o.state):u.resolve(o.text??"")}}}ready(){return this.hello}send(e,r={}){let t=++this.seq,n=new Promise((i,a)=>{this.pending.set(t,{resolve:i,reject:a,...r}),this.worker.postMessage({...e,id:t})});return{id:t,done:n}}async preload(e,r){await this.hello,this.states.get(e)!=="ready"&&this.states.set(e,"loading");try{await this.send({type:"preload",url:e},{onProgress:r}).done,this.states.set(e,"ready")}catch(t){throw this.states.set(e,"error"),t}}state(e){return this.states.get(e)}async turn(e,r,t){await this.hello;let{id:n,done:i}=this.send({type:"turn",req:e},{onToken:r}),a=()=>this.worker.postMessage({type:"stop",id:n});t?.aborted?a():t?.addEventListener("abort",a,{once:!0});try{let s=await i;return this.states.set(e.url,"ready"),s}finally{t?.removeEventListener("abort",a)}}dispose(){this.worker.terminate(),URL.revokeObjectURL(this.url);for(let e of this.pending.values())e.reject(new Error("worker arr\xEAt\xE9"));this.pending.clear()}}});var Jn={};var Gt,nt,Re,Zr=ae(()=>{"use strict";Ut();Gt=new We,nt=new Set,Re=l=>self.postMessage(l);self.onmessage=async l=>{let e=l.data;if(e.type==="stop"){nt.add(e.id);return}if(e.type==="state"){Re({type:"state",id:e.id,state:Gt.state(e.url)});return}try{if(e.type==="preload"){await Gt.preload(e.url,(r,t)=>Re({type:"progress",id:e.id,status:r,progress:t})),Re({type:"done",id:e.id});return}if(e.type==="turn"){let r=new AbortController,t=new Proxy(r.signal,{get:(u,c)=>c==="aborted"?nt.has(e.id):Reflect.get(u,c)}),n=16,i=0,a=null,s=()=>{a!==null&&(Re({type:"token",id:e.id,text:a}),a=null,i=Date.now())},o=await Gt.turn(e.req,u=>{a=u,Date.now()-i>=n&&s()},t);s(),Re({type:"done",id:e.id,text:o}),nt.delete(e.id);return}}catch(r){nt.delete(e.id),Re({type:"error",id:e.id,message:r instanceof Error?r.message:String(r)})}};Re({type:"hello"})});var cn=new Set(["avec","pour","dans","les","des","une","est","sur","par","que","qui","quoi","comment","pourquoi","quand","vous","nous","votre","notre","mais","plus","tout","tous","cette","sont","avez","puis","faire","fait","fais","font","the","and","for","with","what","who","how","why","when","about","your","our","you","are","can","does","did","this","that","from","have","je","tu","il","elle","on","ils","elles","du","de","la","le","un","en","au","aux","ce","ces","cet","se","sa","son","ses","mon","ma","mes","ton","ta","tes","me","te","ne","pas","si","ou","et","ni","car","donc","or","to","in","at","it","is","be","as","an","by","do","no","so","my","he","we","us","me","am","was","were","been","quel","quelle","quels","quelles","which","where","bonjour","salut","hello","merci"]),Ie=new Map,ln=2e4;function dt(l){let e=Ie.get(l);if(e!==void 0)return e;let r=dn(l);return Ie.size>=ln&&Ie.clear(),Ie.set(l,r),r}function dn(l){let e=l.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");return e.length<=3||(e=e.replace(/(?:ments?|ements?|eront|erait|aient|antes?|ances?|euses?|ables?|tions?|sions?|eaux|eurs?|euse|ique|iques|istes?|ings?|ness|able|ible|less|full?)$/,""),e.length>3&&(e=e.replace(/(?:er|ir|ez|ent|ais|ait|ant|ees?|es?|ed|ly|s)$/,""))),e}function Ve(l){let e=(l.toLowerCase().match(/[\p{L}\p{N}]+/gu)??[]).filter(r=>cn.has(r)?!1:/\d/.test(r)?!0:r.length>=2);return[...new Set(e)]}function nr(l,e=600){let r=[];return l.forEach((t,n)=>{let i=(t.title||"").trim(),a=(t.text||"").split(/\n\s*\n+/).map(u=>u.trim()).filter(Boolean),s="",o=()=>{s.trim()&&r.push({title:i,text:s.trim(),doc:n}),s=""};for(let u of a){if(u.length>e*1.6){o();let c=u.split(/(?<=[.!?])\s+/),d="";for(let f of c)d&&(d+" "+f).length>e?(r.push({title:i,text:d.trim(),doc:n}),d=f):d=d?`${d} ${f}`:f;d.trim()&&r.push({title:i,text:d.trim(),doc:n});continue}s&&(s+`

`+u).length>e&&o(),s=s?`${s}

${u}`:u}o()}),r}var tr=new WeakMap;function rr(l){let e=new Set;for(let r of l)r.length>=4&&e.add(r.slice(0,4));return e}function fn(l){let e=tr.get(l);if(e)return e;let r=`${l.title} ${l.text}`.toLowerCase(),t=l.title.toLowerCase(),n=new Set(Ve(r).map(dt)),i=new Set(Ve(t).map(dt)),a={hay:r,titre:t,docStems:n,titreStems:i,docPrefix4:rr(n),titrePrefix4:rr(i)};return tr.set(l,a),a}function pn(l,e,r){if(!l.length)return 0;let t=fn(e),n=0,i=0;for(let a of l){let s=r.get(a)??1;i+=s;let o=dt(a),u=o.length>=4?o.slice(0,4):null;if(t.hay.includes(a)||t.docStems.has(o)||u!==null&&t.docPrefix4.has(u)){let d=t.titre.includes(a)||t.titreStems.has(o)||u!==null&&t.titrePrefix4.has(u);n+=s*(d?2.2:1)}}return i?n/i:0}function gn(l){let e=new Map;for(let n of l)for(let i of Ve(`${n.title} ${n.text}`))e.set(i,(e.get(i)??0)+1);let r=new Map,t=Math.max(1,l.length);for(let[n,i]of e)r.set(n,Math.log(1+t/i));return r}function ir(l,e,r=1200,t=3,n=.22,i=.5){let a=Ve(l);if(!a.length||!e.length)return[];let s=gn(e),o=e.map(g=>({c:g,s:pn(a,g,s)})).filter(g=>g.s>=n).sort((g,m)=>m.s-g.s),u=o.length?o[0].s*i:0,c=o.filter(g=>g.s>=u),d=[],f=new Set,p=r;for(let{c:g}of c)d.length>=t||g.text.length>p||f.has(g.doc)||(d.push(g),f.add(g.doc),p-=g.text.length);for(let{c:g}of c){if(d.length>=t)break;d.includes(g)||g.text.length>p||(d.push(g),p-=g.text.length)}return d}function hn(l){let e=l.trim().toLowerCase().replace(/[!?.,;:\-_]/g,"").trim();return/^(hi|hello|hey|greetings|good\s+(morning|afternoon|evening|day)|bonjour|salut|coucou|bonsoir|how\s+are\s+you|how\s+are\s+you\s+doing|ça\s+va|ca\s+va|comment\s+vas?-tu|comment\s+allez-vous|who\s+are\s+you|qui\s+es-tu|merci|thanks|thank\s+you|what\s+can\s+you\s+do|que\s+peux-tu\s+faire)$/i.test(e)}function ft(l,e,r=!1){if(e&&hn(e))return"";if(!l.length)return r?`

Aucune fiche de r\xE9f\xE9rence ne correspond \xE0 cette question. Dis que tu n\u2019as pas cette information : ne devine pas.`:`

No reference note matches this question. Say that you do not have this information: do not guess.`;let t=l.map((i,a)=>`[${a+1}]${i.title?` ${i.title}`:""}
${i.text}`).join(`

`);return`

${r?"R\xE9ponds UNIQUEMENT \xE0 partir des fiches ci-dessous, en fran\xE7ais. Reprends leurs chiffres exactement. Si la r\xE9ponse n\u2019y est pas, dis que tu n\u2019as pas cette information : n\u2019invente jamais pour combler.":"Answer using ONLY the reference notes below. If the answer is not in them, say you do not have that information: never fill the gap with what you assume."}

--- NOTES ---
${t}
--- END OF NOTES ---`}function sr(l){let e=Array.isArray(l)?l:[l],r=[];for(let t of e)typeof t=="string"&&t.trim()?r.push({text:t}):t&&typeof t=="object"&&typeof t.text=="string"&&t.text.trim()&&r.push({title:t.title,text:t.text});return r}Pt();async function Jr(l){let{LocalBackend:e}=await Promise.resolve().then(()=>(Ut(),Qr));if(l!==!0)return new e;try{let{WorkerBackend:r}=await Promise.resolve().then(()=>(Xr(),Yr)),t=new r;return await t.ready(),t}catch(r){return console.warn("[brimkern] Web Worker indisponible : inf\xE9rence sur le thread principal",r),new e}}xt();var Zn=typeof self<"u"&&typeof self.importScripts=="function"&&typeof document>"u";Zn&&Promise.resolve().then(()=>(Zr(),Jn));var it=null,qt=null,Bt;function Qe(){return it||(it=Jr(Bt).then(l=>(qt=l,l))),it}var ei=()=>qt?.kind??"pending";function Ft(l){if(l.workerUrl&&Ir(l.workerUrl),l.worker!==void 0){if(it&&Bt!==l.worker){console.warn("[brimkern] option `worker` ignor\xE9e : le backend est d\xE9j\xE0 d\xE9marr\xE9 et partag\xE9 par la page.");return}Bt=l.worker}}var ti=`
Answer briefly and honestly. If you do not know something, say so: never invent facts or details.
You have no tools and no internet access: never emit tool calls, reply in plain text only.`;function tn(l){let e=(l.system||"You are a helpful assistant.")+ti,r=s=>s.flatMap(o=>[{role:"user",content:o.user},{role:"assistant",content:o.assistant}]);if(!l.knowledge)return{system:()=>e,userTurn:s=>s,pinned:r(l.examples||[])};let t=nr(sr(l.knowledge)),n=l.knowledgeBudget??1200,i=l.lang?l.lang==="fr":l.system?/[àâäéèêëîïôöùûüç]|\b(?:bonjour|salut|vous|tu|réponds|conseiller|boutique|aide|aidez|client|magasin)\b/i.test(l.system):!1,a=i?e+`

Le message utilisateur peut inclure des fiches de r\xE9f\xE9rence entre des balises ---. Dans ce cas, r\xE9ponds uniquement \xE0 partir de ces fiches en citant fid\xE8lement leurs informations dans la langue de la question. Si aucune note ne correspond, indique poliment que tu n\u2019as pas cette information.`:e+`

The user message may include reference notes between --- markers. When it does, answer from those notes and quote their figures exactly. When it says no note matches, say you do not have that information.`;return{system:()=>a,userTurn:s=>{let o=ft(ir(s,t,n),s,i).trim();return o?`${o}

Question: ${s}`:s},pinned:r([...ri(i),...l.examples||[]])}}function ri(l=!1){let e=(t,n)=>({title:t,text:n,doc:0}),r=(t,n)=>`${ft(t,void 0,l).trim()}

Question: ${n}`;return l?[{user:"Bonjour !",assistant:"Bonjour ! Comment puis-je vous aider ?"},{user:r([e("Guide des tailles",`Tableau des correspondances :
- Pointure EU 38 : 24,0 cm (US 6,5)
- Pointure EU 39 : 24,5 cm (US 7,0)
- Pointure EU 41 : 26,0 cm (US 8,0)`)],"Je fais du 41, quelle taille en cm ?"),assistant:"La pointure 41 correspond \xE0 26,0 cm."},{user:r([e("Retours","Les retours sont gratuits sous 14 jours. Le remboursement est effectu\xE9 sous 3 jours ouvr\xE9s.")],"Combien de temps pour retourner un article ?"),assistant:"Vous disposez de 14 jours pour retourner un article."},{user:r([],"Qui a gagn\xE9 la Coupe du Monde 1998 ?"),assistant:"Je n\u2019ai pas cette information dans mes fiches."}]:[{user:"Hello!",assistant:"Hello! How can I help you today?"},{user:r([e("Size guide",`Size conversions:
- Size EU 38: 24.0 cm (US 6.5)
- Size EU 39: 24.5 cm (US 7.0)
- Size EU 41: 26.0 cm (US 8.0)`)],"I wear a 41, what is that in cm?"),assistant:"A size 41 is 26.0 cm."},{user:r([e("Returns","Returns are free within 14 days. Refunds are issued within 3 working days.")],"How long do I have to return an item?"),assistant:"You have 14 days to return an item."},{user:r([],"Who won the 1998 World Cup?"),assistant:"I do not have that information in my notes."}]}function rn(l={}){Ft(l);let e=Ne(l.model),r=l.maxTokens||220,t=l.temperature??.55,n=tn(l),i=n.pinned,a=[],s=!1,o=!1;return{async ask(u,c={}){if(o)throw new Error("session d\xE9truite");if(s)throw new Error("g\xE9n\xE9ration d\xE9j\xE0 en cours sur cette session");s=!0,a.push({role:"user",content:u});try{let d=[...a.slice(0,-1),{role:"user",content:n.userTurn(u)}],f={url:e,history:d,system:n.system(u),maxTokens:r,temperature:t,pinned:i},p=await(await Qe()).turn(f,c.onToken,c.signal);return c.signal?.aborted?(a.pop(),""):(a.push({role:"assistant",content:p}),p)}catch(d){throw a.pop(),d}finally{s=!1}},reset(){a=[]},destroy(){o=!0,a=[]},get history(){return a.slice()}}}function ni(l){if(document.getElementById("bk-style"))return;let e=document.createElement("style");e.id="bk-style",e.textContent=`
  .bk-fab{position:fixed;right:20px;bottom:20px;width:56px;height:56px;border-radius:16px;background:${l};color:#fff;border:none;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.25);font-size:24px;z-index:2147483000;display:flex;align-items:center;justify-content:center;transition:transform .15s}
  .bk-fab:hover{transform:translateY(-2px)}
  .bk-panel{position:fixed;right:20px;bottom:88px;width:360px;max-width:calc(100vw - 40px);height:520px;max-height:calc(100vh - 120px);background:#f2efe8;border:1px solid #e0dccf;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.28);z-index:2147483000;display:none;flex-direction:column;overflow:hidden;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;color:#1a1a1a}
  .bk-panel.bk-open{display:flex}
  .bk-hd{padding:12px 14px;background:#fff;border-bottom:1px solid #ece8dd;display:flex;align-items:center;gap:8px;font-weight:700;font-size:14px}
  .bk-hd .bk-dot{width:8px;height:8px;border-radius:50%;background:${l}}
  .bk-hd .bk-x{margin-left:auto;background:none;border:none;cursor:pointer;color:#8b887f;font-size:18px;line-height:1}
  .bk-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px}
  .bk-m{max-width:82%;padding:8px 12px;border-radius:12px;font-size:14px;line-height:1.45;white-space:pre-wrap;word-wrap:break-word}
  .bk-m.bk-u{align-self:flex-end;background:${l};color:#fff;border-bottom-right-radius:4px}
  .bk-m.bk-a{align-self:flex-start;background:#fff;border:1px solid #ece8dd;border-bottom-left-radius:4px}
  .bk-foot{padding:10px;border-top:1px solid #ece8dd;background:#fff;display:flex;gap:8px}
  .bk-in{flex:1;border:1px solid #e0dccf;border-radius:10px;padding:9px 11px;font-size:14px;font-family:inherit;background:#fff;color:#1a1a1a;resize:none;outline:none}
  .bk-in:focus{border-color:${l}}
  .bk-send{background:${l};color:#fff;border:none;border-radius:10px;padding:0 14px;cursor:pointer;font-size:14px}
  .bk-send:disabled{opacity:.5;cursor:default}
  .bk-note{font-size:10.5px;color:#8b887f;text-align:center;padding:4px 8px 8px}
  `,document.head.appendChild(e)}function ii(l){if(!l)return"#c72c1e";if(/^#[0-9a-fA-F]{3,8}$/.test(l))return l;try{if(typeof CSS<"u"&&CSS.supports("color",l)&&!/[{};()]/.test(l))return l}catch{}return"#c72c1e"}function en(l){let e=tn(l),r=ii(l.accent),t=l.title||"Assistant",n=l.maxTokens||220;ni(r);let i=document.createElement("button");i.className="bk-fab",i.setAttribute("aria-label","Ouvrir le chat"),i.textContent="\u{1F4AC}";let a=document.createElement("div");a.className="bk-panel",a.innerHTML=`
    <div class="bk-hd"><span class="bk-dot"></span><span>${si(t)}</span><button class="bk-x" aria-label="Fermer">\xD7</button></div>
    <div class="bk-msgs"></div>
    <div class="bk-foot"><textarea class="bk-in" rows="1" placeholder="\xC9cris un message\u2026"></textarea><button class="bk-send">\u2191</button></div>
    <div class="bk-note">IA locale \u2014 tourne sur votre GPU, aucune donn\xE9e envoy\xE9e.</div>`,document.body.appendChild(i),document.body.appendChild(a);let s=a.querySelector(".bk-msgs"),o=a.querySelector(".bk-in"),u=a.querySelector(".bk-send"),c=[],d=!1,f=!1,p=(k,B)=>{let S=document.createElement("div");return S.className=`bk-m ${k==="user"?"bk-u":"bk-a"}`,S.textContent=B,s.appendChild(S),s.scrollTop=s.scrollHeight,S};l.greeting&&(c.push({role:"assistant",content:l.greeting}),p("assistant",l.greeting));let g=Ne(l.model),m=()=>{if(!f){f=!0;let k=p("assistant","Initialisation\u2026");k.classList.add("bk-status"),Qe().then(B=>B.preload(g,(S,q)=>{k.textContent=q?.total?`${S} ${Math.round(q.loaded/1048576)} / ${Math.round(q.total/1048576)} Mo`:S})).then(()=>k.remove()).catch(B=>{k.textContent="Erreur : "+(B?.message||B),f=!1})}return Qe()},b=async()=>{let k=o.value.trim();if(!k||d)return;d=!0,u.disabled=!0,o.value="",c.push({role:"user",content:k}),p("user",k);let B=p("assistant","\u2026");try{await m();let S=[...c.slice(0,-1),{role:"user",content:e.userTurn(k)}],q={url:g,history:S,system:e.system(k),maxTokens:n,temperature:l.knowledge?.25:.55,pinned:e.pinned},M=await(await Qe()).turn(q,E=>{B.textContent=E||"\u2026",s.scrollTop=s.scrollHeight});M||(M="Sorry, I can only answer in plain text here: could you rephrase?"),B.textContent=M,c.push({role:"assistant",content:M})}catch(S){B.textContent="Erreur : "+(S?.message||String(S))}finally{d=!1,u.disabled=!1,o.focus()}};i.onclick=()=>{a.classList.toggle("bk-open")&&(o.focus(),m())},a.querySelector(".bk-x").onclick=()=>a.classList.remove("bk-open"),u.onclick=()=>{b()},o.onkeydown=k=>{k.key==="Enter"&&!k.shiftKey&&(k.preventDefault(),b())}}function si(l){return l.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}var ai=(l={})=>{if(typeof window>"u"||typeof document>"u"){console.warn("[brimkern] embed() ignor\xE9 : aucun DOM (rendu serveur ?). Appelez-le dans un effet client.");return}Ft(l),document.body?en(l):window.addEventListener("DOMContentLoaded",()=>en(l))};var oi=async l=>{if(typeof l!="object"||l===null||typeof l.prompt!="string")throw new TypeError(`Brimkern.generate expects a single object: generate({ prompt: "\u2026", model?, system? }). Received ${typeof l}${typeof l=="object"&&l?" without a `prompt` string":""}.`);return rn(l).ask(l.prompt,{onToken:l.onToken,signal:l.signal})},ui=(l={})=>(Ft(l),typeof navigator<"u"&&"gpu"in navigator?Qe().then(e=>e.preload(Ne(l.model),l.onProgress)).then(()=>!0).catch(()=>!1):Promise.resolve(!1)),ci=l=>typeof navigator>"u"||!("gpu"in navigator)?"unavailable":qt?.state(Ne(l))??"idle";typeof window<"u"&&(window.Brimkern={embed:ai,createSession:rn,generate:oi,preload:ui,status:ci,runtime:ei});})();
