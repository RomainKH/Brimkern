"use strict";(()=>{var Mn=Object.defineProperty;var ie=(l,e,r)=>()=>{if(r)throw r[0];try{return l&&(e=l(l=0)),e}catch(t){throw r=[t],t}};var br=(l,e)=>{for(var r in e)Mn(l,r,{get:e[r],enumerable:!0})};function Te(l){let e=new Float32Array(1),r=new Uint32Array(e.buffer);e[0]=l;let t=r[0],n=t>>16&32768,s=(t>>23&255)-127+15,i=t&8388607;return s<=0?n:s>=31?n|31743:(i=(i>>13)+(i>>12&1),i===1024&&(i=0,s+=1),n|s<<10|i&1023)}function de(l){let e=l>>15&1,r=l>>10&31,t=l&1023,n;return r===0?n=t*59604645e-15:r===31?n=t?NaN:1/0:n=(1+t/1024)*2**(r-15),e===1?-n:n}var He=ie(()=>{"use strict"});function xe(l){let e=l.length;if(e%Ae!==0)throw new Error(`q4web: length ${e} not a multiple of ${Ae}`);let r=e/Ae,t=new Uint8Array(e/2),n=new Uint16Array(r),s=new Uint16Array(r);for(let i=0;i<r;i++){let a=i*Ae,o=1/0,u=-1/0;for(let h=0;h<Ae;h++){let b=l[a+h];b<o&&(o=b),b>u&&(u=b)}let c=(u-o)/15||1e-8,d=Te(c),f=Te(o);n[i]=d,s[i]=f;let g=de(d)||1e-8,p=de(f);for(let h=0;h<Ae;h++){let b=Math.round((l[a+h]-p)/g);b=b<0?0:b>15?15:b;let k=a+h;(h&1)===0?t[k>>1]=b:t[k>>1]|=b<<4}}return{nibbles:t,scales:n,mins:s,nElems:e}}function be(l,e){let r=e/Ae,t=e/2,n=l.slice(0,t),s=new Uint16Array(r),i=new Uint16Array(r),a=new DataView(l.buffer,l.byteOffset);for(let o=0;o<r;o++)s[o]=a.getUint16(t+o*2,!0);for(let o=0;o<r;o++)i[o]=a.getUint16(t+r*2+o*2,!0);return{nibbles:n,scales:s,mins:i,nElems:e}}function ge(l){let e=new Float32Array(l.nElems),r=l.nElems/Ae;for(let t=0;t<r;t++){let n=de(l.scales[t]),s=de(l.mins[t]),i=t*Ae;for(let a=0;a<Ae;a++){let o=i+a,u=l.nibbles[o>>1],c=(a&1)===0?u&15:u>>4;e[o]=c*n+s}}return e}var Ae,it=ie(()=>{"use strict";He();Ae=32});function Ue(l){let e=l.length;if(e%Pe!==0)throw new Error(`q8web: length ${e} not a multiple of ${Pe}`);let r=e/Pe,t=new Int8Array(e),n=new Uint16Array(r);for(let s=0;s<r;s++){let i=s*Pe,a=0;for(let d=0;d<Pe;d++){let f=Math.abs(l[i+d]);f>a&&(a=f)}let o=a/127||1e-8,u=Te(o);n[s]=u;let c=de(u)||1e-8;for(let d=0;d<Pe;d++){let f=Math.round(l[i+d]/c);f=f<-127?-127:f>127?127:f,t[i+d]=f}}return{codes:t,scales:n,nElems:e}}function we(l,e){let r=e/Pe,t=new Int8Array(l.buffer.slice(l.byteOffset,l.byteOffset+e)),n=new Uint16Array(r),s=new DataView(l.buffer,l.byteOffset);for(let i=0;i<r;i++)n[i]=s.getUint16(e+i*2,!0);return{codes:t,scales:n,nElems:e}}function he(l){let e=new Float32Array(l.nElems),r=l.nElems/Pe;for(let t=0;t<r;t++){let n=de(l.scales[t]),s=t*Pe;for(let i=0;i<Pe;i++)e[s+i]=l.codes[s+i]*n}return e}var Pe,at=ie(()=>{"use strict";He();Pe=32});function Br(l){let e=l.length;if(e%_e!==0)throw new Error(`q3web: length ${e} not a multiple of ${_e}`);let r=e/_e,t=new Uint32Array(e/16),n=new Uint32Array(e/32),s=new Uint16Array(r),i=new Uint16Array(r);for(let a=0;a<r;a++){let o=a*_e,u=1/0,c=-1/0;for(let b=0;b<_e;b++){let k=l[o+b];k<u&&(u=k),k>c&&(c=k)}let d=(c-u)/7||1e-8,f=Te(d),g=Te(u);s[a]=f,i[a]=g;let p=de(f)||1e-8,h=de(g);for(let b=0;b<_e;b++){let k=Math.round((l[o+b]-h)/p);k=k<0?0:k>7?7:k;let F=o+b;t[F>>4]|=(k&3)<<(F&15)*2,n[F>>5]|=k>>2<<(F&31)}}return{lo:t,hi:n,scales:s,mins:i,nElems:e}}function Ge(l,e){let r=e/_e,t=e/16,n=e/32,s=t*4,i=n*4,a=new DataView(l.buffer,l.byteOffset),o=new Uint32Array(t),u=new Uint32Array(n),c=new Uint16Array(r),d=new Uint16Array(r);for(let p=0;p<t;p++)o[p]=a.getUint32(p*4,!0);for(let p=0;p<n;p++)u[p]=a.getUint32(s+p*4,!0);let f=s+i,g=f+r*2;for(let p=0;p<r;p++)c[p]=a.getUint16(f+p*2,!0);for(let p=0;p<r;p++)d[p]=a.getUint16(g+p*2,!0);return{lo:o,hi:u,scales:c,mins:d,nElems:e}}function Oe(l){let e=new Float32Array(l.nElems),r=l.nElems/_e;for(let t=0;t<r;t++){let n=de(l.scales[t]),s=de(l.mins[t]),i=t*_e;for(let a=0;a<_e;a++){let o=i+a,u=l.lo[o>>4]>>(o&15)*2&3|(l.hi[o>>5]>>(o&31)&1)<<2;e[o]=u*n+s}}return e}var _e,ot=ie(()=>{"use strict";He();_e=32});var qr,Fr,Sr=ie(()=>{"use strict";qr={matmul:`
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
		}`},Fr=`
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
	}`});var ut,Tr=ie(()=>{"use strict";ut=class{constructor(e){this.sets=[];this.cur=0;this.next=0;this.names=[];this.acc=new Map;this.dropped=0;this.pending=[];this.fenetre=0;this.device=e;let r=globalThis;for(let t=0;t<2;t++)this.sets.push({qs:e.createQuerySet({type:"timestamp",count:4096}),resolve:e.createBuffer({size:4096*8,usage:r.GPUBufferUsage.QUERY_RESOLVE|r.GPUBufferUsage.COPY_SRC}),read:e.createBuffer({size:4096*8,usage:r.GPUBufferUsage.COPY_DST|r.GPUBufferUsage.MAP_READ}),busy:!1})}slot(e){if(this.next+2>4096&&(this.rotate(),this.next+2>4096))return this.dropped++,null;let r=this.sets[this.cur];if(r.busy)return this.dropped++,null;let t=this.next;return this.next+=2,this.names.push(e),{querySet:r.qs,beginningOfPassWriteIndex:t,endOfPassWriteIndex:t+1}}rotate(){let e=this.cur,r=this.sets[e],t=this.names,n=this.next;if(this.cur=(this.cur+1)%2,this.next=0,this.names=[],!n||r.busy)return;r.busy=!0;let s=this.fenetre,i=this.device.createCommandEncoder();i.resolveQuerySet(r.qs,0,n,r.resolve,0),i.copyBufferToBuffer(r.resolve,0,r.read,0,n*8),this.device.queue.submit([i.finish()]);let a=globalThis,o=r.read.mapAsync(a.GPUMapMode.READ,0,n*8).then(()=>{let u=new BigUint64Array(r.read.getMappedRange(0,n*8).slice(0));if(r.read.unmap(),s===this.fenetre)for(let c=0;c<t.length;c++){let d=u[c*2],f=u[c*2+1];if(!d||!f||f<=d)continue;let g=Number(f-d),p=this.acc.get(t[c]);p?(p.calls++,p.ns+=g):this.acc.set(t[c],{calls:1,ns:g})}}).catch(()=>{}).finally(()=>{r.busy=!1});this.pending.push(o)}async report(){this.rotate();let e=this.pending;this.pending=[],await Promise.all(e);let r=0,t=0;for(let s of this.acc.values())r+=s.ns,t+=s.calls;return{passes:[...this.acc.entries()].map(([s,i])=>({name:s,calls:i.calls,totalMs:i.ns/1e6,meanUs:i.ns/i.calls/1e3,share:r?i.ns/r:0,reliable:i.calls>=50})).sort((s,i)=>i.totalMs-s.totalMs),totalMs:r/1e6,samples:t,dropped:this.dropped,quantumUs:100}}reset(){this.fenetre++,this.acc.clear(),this.dropped=0}destroy(){for(let e of this.sets)try{e.qs.destroy(),e.resolve.destroy(),e.read.destroy()}catch{}this.sets=[]}}});function $n(){if(Or!==null)return Or;try{let l=globalThis.__brimkernSearch;if(typeof l=="string")return l}catch{}try{return typeof location<"u"?location.search:""}catch{return""}}function oe(l){try{return new URLSearchParams($n()).get(l)}catch{return null}}var Or,Mr=ie(()=>{"use strict";Or=null});function ke(l){let e=l>>15&1,r=l>>10&31,t=l&1023,n;return r===0?n=t*59604645e-15:r===31?n=65504:n=(1+t/1024)*2**(r-15),e===1?-n:n}function Re(l){let e=new Float32Array(1),r=new Uint32Array(e.buffer);e[0]=l;let t=r[0],n=t>>16&32768,s=(t>>23&255)-127+15,i=t&8388607;return s<=0?n:s>=31?n|31743:(i=(i>>13)+(i>>12&1),i===1024&&(i=0,s+=1),n|s<<10|i&1023)}function In(l,e){let r=new Float32Array(e*256),t=new DataView(l.buffer,l.byteOffset);for(let n=0;n<e;n++){let s=n*144,i=ke(t.getUint16(s,!0)),a=ke(t.getUint16(s+2,!0)),o=f=>{let g=p=>l[s+4+p];return f<4?[g(f)&63,g(f+4)&63]:[g(f+4)&15|g(f-4)>>6<<4,g(f+4)>>4|g(f)>>6<<4]},u=n*256,c=0,d=0;for(let f=0;f<256;f+=64){let[g,p]=o(c),h=i*g,b=a*p,[k,F]=o(c+1),M=i*k,S=a*F;for(let j=0;j<32;j++){let z=l[s+16+d+j];r[u+f+j]=h*(z&15)-b,r[u+f+32+j]=M*(z>>4)-S}d+=32,c+=2}}return r}function ze(l){return l>127?l-256:l}function Vn(l,e){let r=new Float32Array(e*32),t=new DataView(l.buffer,l.byteOffset);for(let n=0;n<e;n++){let s=n*34,i=ke(t.getUint16(s,!0));for(let a=0;a<32;a++)r[n*32+a]=i*ze(l[s+2+a])}return r}function Yn(l,e){let r=new Float32Array(e*32),t=new DataView(l.buffer,l.byteOffset);for(let n=0;n<e;n++){let s=n*22,i=ke(t.getUint16(s,!0)),a=t.getUint32(s+2,!0);for(let o=0;o<16;o++){let u=l[s+6+o],c=a>>>o<<4&16,d=a>>>o+12&16;r[n*32+o]=i*((u&15|c)-16),r[n*32+o+16]=i*((u>>4|d)-16)}}return r}function Xn(l,e){let r=new Float32Array(e*32),t=new DataView(l.buffer,l.byteOffset);for(let n=0;n<e;n++){let s=n*18,i=ke(t.getUint16(s,!0));for(let a=0;a<16;a++){let o=l[s+2+a];r[n*32+a]=i*((o&15)-8),r[n*32+a+16]=i*((o>>4)-8)}}return r}function Jn(l,e){let r=new Float32Array(e*256),t=new DataView(l.buffer,l.byteOffset);for(let n=0;n<e;n++){let s=n*176,i=ke(t.getUint16(s,!0)),a=ke(t.getUint16(s+2,!0)),o=p=>{let h=b=>l[s+4+b];return p<4?[h(p)&63,h(p+4)&63]:[h(p+4)&15|h(p-4)>>6<<4,h(p+4)>>4|h(p)>>6<<4]},u=n*256,c=0,d=0,f=1,g=2;for(let p=0;p<256;p+=64){let[h,b]=o(c),k=i*h,F=a*b,[M,S]=o(c+1),j=i*M,z=a*S;for(let A=0;A<32;A++){let w=l[s+48+d+A],v=l[s+16+A];r[u+p+A]=k*((w&15)+(v&f?16:0))-F,r[u+p+32+A]=j*((w>>4)+(v&g?16:0))-z}d+=32,c+=2,f<<=2,g<<=2}}return r}function Zn(l,e){let r=new Float32Array(e*256),t=new DataView(l.buffer,l.byteOffset);for(let n=0;n<e;n++){let s=n*210,i=ke(t.getUint16(s+208,!0)),a=n*256;for(let o=0;o<2;o++){let u=s+o*64,c=s+128+o*32,d=s+192+o*8,f=a+o*128;for(let g=0;g<32;g++){let p=g/16|0,h=l[u+g],b=l[u+g+32],k=l[c+g],F=(h&15|(k>>0&3)<<4)-32,M=(b&15|(k>>2&3)<<4)-32,S=(h>>4|(k>>4&3)<<4)-32,j=(b>>4|(k>>6&3)<<4)-32;r[f+g]=i*ze(l[d+p])*F,r[f+g+32]=i*ze(l[d+p+2])*M,r[f+g+64]=i*ze(l[d+p+4])*S,r[f+g+96]=i*ze(l[d+p+6])*j}}}return r}function Le(l,e,r,t,n){let s=new Float32Array(r*n);for(let i=0;i<r;i++)for(let a=0;a<n;a++){let o=0;for(let u=0;u<t;u++)o+=l[i*t+u]*e[u*n+a];s[i*n+a]=o}return s}function Me(l,e,r,t,n=1e-5,s=!1){let i=new Float32Array(r*t);for(let a=0;a<r;a++){let o=0;for(let c=0;c<t;c++)o+=l[a*t+c]**2;let u=1/Math.sqrt(o/t+n);for(let c=0;c<t;c++)i[a*t+c]=l[a*t+c]*u*(s?1+e[c]:e[c])}return i}function es(l,e,r,t,n,s,i){let a=new Float32Array(l.length),o=t/2,u=s[0],c=s[0]+s[1];for(let d=0;d<r;d++){let f=Math.floor(d/n),g=d*t;for(let p=0;p<o;p++){let h=p<u?0:p<c?1:2,k=e[f*3+h]/i**(2*p/t),F=Math.cos(k),M=Math.sin(k),S=l[g+p],j=l[g+p+o];a[g+p]=S*F-j*M,a[g+p+o]=j*F+S*M}}return a}function ct(l,e,r,t,n=0,s=1e4,i){let a=new Float32Array(l.length),o=r/2;for(let u=0;u<e;u++){let c=n+Math.floor(u/t),d=u*r;for(let f=0;f<o;f++){let g=c/(s**(2*f/r)*(i?i[f]:1)),p=Math.cos(g),h=Math.sin(g),b=l[d+2*f],k=l[d+2*f+1];a[d+2*f]=b*p-k*h,a[d+2*f+1]=k*p+b*h}}return a}function ts(l,e,r,t,n,s=0,i=1e4){let a=new Float32Array(l.length),o=t/2;for(let u=0;u<r;u++){let c=s+Math.floor(u/n),d=u*t;for(let f=0;f<o;f++){let g=c/(i**(2*f/t)*e[f]),p=Math.cos(g),h=Math.sin(g),b=l[d+f],k=l[d+f+o];a[d+f]=b*p-k*h,a[d+f+o]=k*p+b*h}}return a}function Ne(l,e,r,t,n=0,s=1e4){let i=new Float32Array(l.length),a=r/2;for(let o=0;o<e;o++){let u=n+Math.floor(o/t),c=o*r;for(let d=0;d<a;d++){let f=u/s**(2*d/r),g=Math.cos(f),p=Math.sin(f),h=l[c+d],b=l[c+d+a];i[c+d]=h*g-b*p,i[c+d+a]=b*g+h*p}}return i}function Tt(l,e,r){return l.map((t,n)=>t+e[n%r])}function Ot(l,e,r,t=!0){let n=t?l.windowPerLayer?.[r]??l.window??0:0,s=l.ropeThetaPerLayer?.[r]??l.ropeTheta,i=l.skipRopePerLayer?.[r]??l.skipRope??!1;return{...l,seq:e,window:n,ropeTheta:s,skipRope:i}}function ye(l,e,r,t,n,s,i,a=0,o,u=0,c=0){let d=new Float32Array(t*n*i),f=o??1/Math.sqrt(i),g=h=>u>0?u*Math.tanh(h/u):h,p=n/s;for(let h=0;h<t;h++)for(let b=0;b<n;b++){let k=Math.floor(b/p),F=(h*n+b)*i,M=a+h,S=c>0?Math.max(0,M+1-c):0,j=[],z=-1/0;for(let w=S;w<=M;w++){let v=(w*s+k)*i,m=0;for(let y=0;y<i;y++)m+=l[F+y]*e[v+y];let _=g(m*f);j[w]=_,_>z&&(z=_)}let A=0;for(let w=S;w<=M;w++)j[w]=Math.exp(j[w]-z),A+=j[w];for(let w=S;w<=M;w++){let v=j[w]/A,m=(w*s+k)*i;for(let _=0;_<i;_++)d[F+_]+=v*r[m+_]}}return d}function Cr(l){return .5*l*(1+Math.tanh(.7978845608*(l+.044715*l*l*l)))}function Mt(l,e,r){let{seq:t,d:n,nHeads:s,nKvHeads:i,headDim:a,ffn:o,ropeTheta:u,eps:c}=e,d=i*a,f=s*a,g=e.rmsGainOnePlus===!0,p=e.attnLogitSoftcap??0,h=Me(l,r.attnNorm,t,n,c,g),b=Le(h,r.wq,t,n,f),k=Le(h,r.wk,t,n,d),F=Le(h,r.wv,t,n,d);r.bq&&(b=Tt(b,r.bq,f)),r.bk&&(k=Tt(k,r.bk,d)),r.bv&&(F=Tt(F,r.bv,d)),r.qNorm&&(b=Me(b,r.qNorm,t*s,a,c,g)),r.kNorm&&(k=Me(k,r.kNorm,t*i,a,c,g));let M=Ne(b,t*s,a,s,0,u),S=Ne(k,t*i,a,i,0,u),j=ye(M,S,F,t,s,i,a,0,e.attnScale,p),z=Le(j,r.wo,t,f,n);r.postAttnNorm&&(z=Me(z,r.postAttnNorm,t,n,c,g));let A=l.map((x,P)=>x+z[P]),w=Me(A,r.ffnNorm,t,n,c,g),v=Le(w,r.wgate,t,n,o),m=Le(w,r.wup,t,n,o),_=e.act==="gelu"?v.map((x,P)=>Cr(x)*m[P]):v.map((x,P)=>x/(1+Math.exp(-x))*m[P]),y=Le(_,r.wdown,t,o,n);return r.postFfnNorm&&(y=Me(y,r.postFfnNorm,t,n,c,g)),A.map((x,P)=>x+y[P])}var ae,ee,lt,Rr=ie(()=>{"use strict";it();at();ot();Sr();Tr();Mr();ae=64,ee=class ee{constructor(){this.device=null;this.modules={};this.pipelines={};this.maxStorageBufferBindingSize=0;this.hasF16=!1;this.validationFailure=null;this.lost=!1;this.onLost=null;this.attnDecodeOk=!0;this.attnPrefillOk=!0;this.attnFullWgOk=!0;this.mropeOk=!0;this.rwkvWkv7Ok=!0;this.lfm2ShortConvOk=!0;this.lfm2ResidentOk=!0;this.lfm2BatchOk=!0;this.swaOk=!0;this.rwkvResidentOk=!0;this.videoOk=!0;this.videoResidentOk=!0;this.f16SharedOk=!0;this.qSharedOk=!0;this.qShared2Ok=!0;this.gemvOk=!0;this.rmsVecOk=!0;this.convS2Ok=!0;this.hasSubgroups=!1;this.subgroupsOk=!0;this.topKParOk=!0;this.profiler=null;this.bufferPool=new Map;this.poolSize=new WeakMap;this.pooled=new WeakSet;this.uniformPool=new Map;this.uniformSize=new WeakMap;this.convTiledOk=!0;this.convTiledQOk=!0;this.kvGpu=new Map;this.topKOk=!0;this.kvSession="";this.kvQuant=!1;this.lfm2KvGpu=new Map;this.lfm2ConvGpu=new Map;this.lfm2Session="";this.rwkvStateGpu=new Map;this.rwkvVFirst=null;this.rwkvSession=""}async init(){let e=navigator.gpu;if(!e)return!1;let r=await e.requestAdapter();if(!r)return!1;let t=r.limits,n={maxStorageBufferBindingSize:t.maxStorageBufferBindingSize,maxBufferSize:t.maxBufferSize},s=[];try{r.features?.has("shader-f16")&&s.push("shader-f16")}catch{}try{r.features?.has("subgroups")&&s.push("subgroups")}catch{}try{ee.profileOn&&r.features?.has("timestamp-query")&&s.push("timestamp-query")}catch{}try{this.device=await r.requestDevice({requiredLimits:n,requiredFeatures:s})}catch{try{this.device=await r.requestDevice({requiredLimits:n})}catch{this.device=await r.requestDevice()}}this.maxStorageBufferBindingSize=this.device.limits?.maxStorageBufferBindingSize??134217728,this.hasF16=!!this.device.features?.has?.("shader-f16"),this.hasSubgroups=!!this.device.features?.has?.("subgroups"),ee.profileOn&&(this.device.features?.has?.("timestamp-query")?(this.profiler=new ut(this.device),console.info("[webgpu] profilage par passe ACTIF (?gpuprofile=1) : __gpuProfile() pour le rapport")):console.warn("[webgpu] ?gpuprofile=1 demand\xE9 mais la feature timestamp-query est ABSENTE de cet adapter : aucune mesure ne sera prise."));try{oe("attndecode")==="0"&&(this.attnDecodeOk=!1,console.warn("[webgpu] attention d\xE9codage COUP\xC9E par ?attndecode=0 : kernels classiques")),oe("attnfullwg")==="0"&&(this.attnFullWgOk=!1,console.warn("[webgpu] attention_full workgroup COUP\xC9E par ?attnfullwg=0 : kernel classique")),oe("attnprefill")==="0"&&(this.attnPrefillOk=!1,console.warn("[webgpu] attention prefill tuil\xE9e COUP\xC9E par ?attnprefill=0 : kernel classique")),oe("rmsvec")==="0"&&(this.rmsVecOk=!1,console.warn("[webgpu] RMSNorm parall\xE8le COUP\xC9E par ?rmsvec=0 : kernel une-ligne-par-thread")),oe("topkpar")==="0"&&(this.topKParOk=!1,console.warn("[webgpu] top-K parall\xE8le COUP\xC9E par ?topkpar=0 : s\xE9lection finale sur un seul thread")),oe("rwkv")==="0"&&(this.rwkvWkv7Ok=!1,console.warn("[webgpu] kernel RWKV-7 WKV COUP\xC9 par ?rwkv=0")),oe("lfm2")==="0"&&(this.lfm2ShortConvOk=!1,console.warn("[webgpu] kernel shortconv LFM2 COUP\xC9 par ?lfm2=0")),oe("lfm2resident")==="0"&&(this.lfm2ResidentOk=!1,console.warn("[webgpu] LFM2 r\xE9sident COUP\xC9 par ?lfm2resident=0 : forwardToken JS+readback")),oe("lfm2batch")==="0"&&(this.lfm2BatchOk=!1,console.warn("[webgpu] prefill LFM2 batch\xE9 COUP\xC9 par ?lfm2batch=0 : token par token")),oe("convs2")==="0"&&(this.convS2Ok=!1,console.warn("[webgpu] conv2d 3\xD73 stride-2 tuil\xE9 COUP\xC9 par ?convs2=0 : repli sur direct")),oe("subgroups")==="0"&&(this.subgroupsOk=!1,console.warn("[webgpu] subgroups COUP\xC9 par ?subgroups=0 : repli sur shared memory")),oe("swa")==="0"&&(this.swaOk=!1,console.warn("[webgpu] fen\xEAtre glissante COUP\xC9E par ?swa=0 : attention causale pleine sur toutes les couches")),oe("rwkvresident")==="0"&&(this.rwkvResidentOk=!1,console.warn("[webgpu] RWKV r\xE9sident COUP\xC9 par ?rwkvresident=0 : forwardToken JS+readback")),oe("video")==="0"&&(this.videoOk=!1,console.warn("[webgpu] chemin vid\xE9o (module motion) COUP\xC9 par ?video=0")),oe("f16shared")==="0"&&(this.f16SharedOk=!1,console.warn("[webgpu] GEMM f16 tuil\xE9 COUP\xC9 par ?f16shared=0 : matmul_t_f16w pour tous les m")),oe("gemv")==="0"&&(this.gemvOk=!1,console.warn("[webgpu] GEMV de d\xE9codage COUP\xC9 par ?gemv=0 : kernels par lignes")),oe("qshared")==="0"&&(this.qSharedOk=!1,console.warn("[webgpu] GEMM q8/q4 tuil\xE9s COUP\xC9S par ?qshared=0 : kernels 4 lignes/invocation")),oe("qshared2")==="0"&&(this.qShared2Ok=!1,console.warn("[webgpu] GEMM q8/q4 v2 (bloc 4\xD78 vec4) COUP\xC9S par ?qshared2=0 : tuile 32\xD764 v1")),oe("convtq")==="0"&&(this.convTiledQOk=!1,console.warn("[webgpu] conv 3\xD73 tuil\xE9 q8/q4 COUP\xC9 par ?convtq=0 : conv2d_direct_q8/q4 (plus lent, m\xEAme r\xE9sultat)")),oe("videoresident")==="0"&&(this.videoResidentOk=!1,console.warn("[webgpu] motion r\xE9sident COUP\xC9 par ?videoresident=0 : chemin JS+readback"))}catch{}this.device.lost?.then?.(i=>{this.lost=!0,console.warn("[webgpu] device GPU perdu :",i?.reason||"unknown",i?.message||""),this.onLost?.(i)});for(let[i,a]of Object.entries(qr))this.modules[i]=this.device.createShaderModule({code:a});return this.hasF16&&(this.modules.matmul_t_f16w=this.device.createShaderModule({code:Fr})),!0}buf(e,r){let t=this.device.createBuffer({size:e.byteLength,usage:r});return this.device.queue.writeBuffer(t,0,e),t}bufU32(e,r){let t=this.device.createBuffer({size:e.byteLength,usage:r});return this.device.queue.writeBuffer(t,0,e),t}async readBack(e,r){let t=globalThis,n=this.device.createBuffer({size:r,usage:t.GPUBufferUsage.COPY_DST|t.GPUBufferUsage.MAP_READ}),s=this.device.createCommandEncoder();s.copyBufferToBuffer(e,0,n,0,r),this.device.queue.submit([s.finish()]),await n.mapAsync(t.GPUMapMode.READ);let i=new Float32Array(n.getMappedRange().slice(0));return n.unmap(),n.destroy(),i}async readBackBytes(e,r){let t=globalThis,n=Math.ceil(r/4)*4,s=this.device.createBuffer({size:n,usage:t.GPUBufferUsage.COPY_DST|t.GPUBufferUsage.MAP_READ}),i=this.device.createCommandEncoder();i.copyBufferToBuffer(e,0,s,0,n),this.device.queue.submit([i.finish()]),await s.mapAsync(t.GPUMapMode.READ);let a=new Uint8Array(s.getMappedRange().slice(0,r));return s.unmap(),s.destroy(),a}async quantizeToBytes(e,r,t,n,s){let i=t/32,a=n==="q8"?new Uint8Array(t+i*2):new Uint8Array(t/2+i*4),o=ee.BLOCK_ELEMS[e]??1,u=t/o,c=r.byteLength/u,d=(h,b)=>b===0?h:d(b,h%b),f=o*32/d(o,32),g=Math.floor(this.maxStorageBufferBindingSize*.9/4),p=s??g;p=Math.max(f,Math.floor(p/f)*f);for(let h=0;h<t;h+=p){let b=Math.min(p,t-h),k=r.slice(h/o*c,(h+b)/o*c),F=this.dequantizeToGpu(e,k,b);try{if(n==="q8"){let{codes:M,sc:S}=this.f32ToQ8Gpu(F,b),j=await this.readBackBytes(M,b),z=await this.readBackBytes(S,b/32*2);M.destroy?.(),S.destroy?.(),a.set(j,h),a.set(z,t+h/32*2)}else{let{nib:M,sc:S,mn:j}=this.f32ToQ4Gpu(F,b),z=await this.readBackBytes(M,b/2),A=await this.readBackBytes(S,b/32*2),w=await this.readBackBytes(j,b/32*2);M.destroy?.(),S.destroy?.(),j.destroy?.(),a.set(z,h/2),a.set(A,t/2+h/32*2),a.set(w,t/2+i*2+h/32*2)}}finally{F.destroy?.()}}return a}pipeline(e){let r=this.pipelines[e];return r||(r=this.device.createComputePipeline({layout:"auto",compute:{module:this.modules[e],entryPoint:"main"}}),this.pipelines[e]=r),r}grid1D(e){let r=Math.ceil(e/ae);if(r<=ee.MAX_WG_DIM)return[r,1,1];let t=ee.MAX_WG_DIM;return[t,Math.ceil(r/t),1]}recordPass(e,r,t,n){let s=this.pipeline(r),i=this.device.createBindGroup({layout:s.getBindGroupLayout(0),entries:t.map((u,c)=>({binding:c,resource:{buffer:u}}))}),a=this.profiler?.slot(r),o=e.beginComputePass(a?{timestampWrites:a}:void 0);o.setPipeline(s),o.setBindGroup(0,i),o.dispatchWorkgroups(...n),o.end()}dispatch(e,r,t){let n=this.device.createCommandEncoder();this.recordPass(n,e,r,t),this.device.queue.submit([n.finish()])}async run(e,r,t,n,s){return this.dispatch(e,r,t),this.readBack(n,s)}isF32(e){return e instanceof Float32Array}async matmul(e,r,t,n,s){let i=globalThis,a=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([t,n,s]));let u=this.isF32(r)?this.buf(r,a):r,c=this.device.createBuffer({size:t*s*4,usage:a|i.GPUBufferUsage.COPY_SRC});return this.run("matmul",[o,this.buf(e,a),u,c],[Math.ceil(t/8),Math.ceil(s/8),1],c,t*s*4)}async matmulT(e,r,t,n,s,i=!1){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([t,n,s]));let c=this.isF32(r)?this.buf(r,o):r,d=this.device.createBuffer({size:t*s*4,usage:o|a.GPUBufferUsage.COPY_SRC}),f=this.matmulTPlan(t,n,s,i);return this.run(f.shader,[u,this.buf(e,o),c,d],f.grid,d,t*s*4)}matmulTPlan(e,r,t,n){return n&&this.hasF16?this.f16SharedOk&&e>=32&&r%4===0?{shader:"matmul_t_f16w_shared",grid:[Math.ceil(t/64),Math.ceil(e/32),1]}:{shader:"matmul_t_f16w",grid:[Math.ceil(e/8),Math.ceil(t/8),1]}:{shader:r%4===0?"matmul_t_vec4":"matmul_t",grid:[Math.ceil(e/8),Math.ceil(t/8),1]}}async rmsnorm(e,r,t,n,s=1e-5,i=!1){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([t,n])),this.device.queue.writeBuffer(u,8,new Float32Array([s])),this.device.queue.writeBuffer(u,12,new Uint32Array([i?1:0]));let c=this.device.createBuffer({size:e.byteLength,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("rmsnorm",[u,this.buf(e,o),this.buf(r,o),c],[Math.ceil(t/ae),1,1],c,e.byteLength)}async topKReadback(e,r,t){let n=globalThis,s=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST,i=this.device.createBuffer({size:8,usage:n.GPUBufferUsage.UNIFORM|n.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(i,0,new Uint32Array([e.length,r]));let a=this.device.createBuffer({size:r*2*4,usage:s|n.GPUBufferUsage.COPY_SRC}),o=this.device.createBuffer({size:r*2*4,usage:n.GPUBufferUsage.COPY_DST|n.GPUBufferUsage.MAP_READ}),u=this.device.createCommandEncoder(),c=this.buf(e,s);this.recordPass(u,t,[i,c,a],[1,1,1]),u.copyBufferToBuffer(a,0,o,0,r*2*4),this.device.queue.submit([u.finish()]),await o.mapAsync(n.GPUMapMode.READ);let d=new Uint32Array(o.getMappedRange().slice(0));return o.unmap(),o.destroy(),a.destroy?.(),i.destroy?.(),c.destroy?.(),d}async rmsnormVec(e,r,t,n,s=1e-5,i=!1,a="rmsnorm_vec"){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([t,n])),this.device.queue.writeBuffer(c,8,new Float32Array([s])),this.device.queue.writeBuffer(c,12,new Uint32Array([i?1:0]));let d=this.device.createBuffer({size:e.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run(a,[c,this.buf(e,u),this.buf(r,u),d],[t,1,1],d,e.byteLength)}async binary(e,r,t){let n=globalThis,s=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST,i=this.device.createBuffer({size:r.byteLength,usage:s|n.GPUBufferUsage.COPY_SRC});return this.run(e,[this.buf(r,s),this.buf(t,s),i],this.grid1D(r.length),i,r.byteLength)}swiglu(e,r){return this.binary("swiglu",e,r)}geglu(e,r){return this.binary("geglu",e,r)}add(e,r){return this.binary("add",e,r)}async silu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("silu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async groupNorm(e,r,t,n,s,i,a=1e-5,o="group_norm"){let u=globalThis,c=u.GPUBufferUsage.STORAGE|u.GPUBufferUsage.COPY_DST,d=this.device.createBuffer({size:16,usage:u.GPUBufferUsage.UNIFORM|u.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(d,0,new Uint32Array([n,s,i])),this.device.queue.writeBuffer(d,12,new Float32Array([a]));let f=this.device.createBuffer({size:e.byteLength,usage:c|u.GPUBufferUsage.COPY_SRC});return this.run(o,[d,this.buf(e,c),this.buf(r,c),this.buf(t,c),f],[i,1,1],f,e.byteLength)}async conv2d(e,r,t,n,s,i,a,o,u,c=1,d=0){let f=globalThis,g=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,p=Math.floor((s+2*d-o)/c)+1,h=Math.floor((i+2*d-u)/c)+1,b=n*o*u,k=p*h;if(b*k*4>this.maxStorageBufferBindingSize*.9)return this.conv2dDirect(e,r,t,n,s,i,a,o,u,c,d);let F=this.device.createBuffer({size:48,usage:f.GPUBufferUsage.UNIFORM|f.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(F,0,new Uint32Array([n,s,i,o,u,c,d,p,h]));let M=this.device.createBuffer({size:b*k*4,usage:g|f.GPUBufferUsage.COPY_SRC});this.dispatch("im2col",[F,this.buf(e,g),M],this.grid1D(b*k));let S=await this.matmul(r,M,a,b,k);if(M.destroy?.(),F.destroy?.(),t)for(let j=0;j<a;j++){let z=t[j];for(let A=0;A<k;A++)S[j*k+A]+=z}return S}async conv2dDirect(e,r,t,n,s,i,a,o,u,c=1,d=0){let f=globalThis,g=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,p=Math.floor((s+2*d-o)/c)+1,h=Math.floor((i+2*d-u)/c)+1,b=a*p*h,k=this.device.createBuffer({size:48,usage:f.GPUBufferUsage.UNIFORM|f.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(k,0,new Uint32Array([n,s,i,a,o,u,c,d,p,h]));let F=t??new Float32Array(a),M=this.device.createBuffer({size:b*4,usage:g|f.GPUBufferUsage.COPY_SRC});return this.run("conv2d_direct",[k,this.buf(e,g),this.buf(r,g),this.buf(F,g),M],this.grid1D(b),M,b*4)}async layernorm(e,r,t,n,s,i=1e-5){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s])),this.device.queue.writeBuffer(u,8,new Float32Array([i]));let c=this.device.createBuffer({size:e.byteLength,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("layernorm",[u,this.buf(e,o),this.buf(r,o),this.buf(t,o),c],[Math.ceil(n/ae),1,1],c,e.byteLength)}async quickGelu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("quick_gelu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async gelu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("gelu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async relu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("relu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async upsampleNearest(e,r,t,n,s=2){let i=globalThis,a=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=t*s,u=n*s,c=r*o*u,d=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(d,0,new Uint32Array([r,t,n,s]));let f=this.device.createBuffer({size:c*4,usage:a|i.GPUBufferUsage.COPY_SRC});return this.run("upsample_nearest",[d,this.buf(e,a),f],this.grid1D(c),f,c*4)}async upscale2x(e,r,t,n,s=.5){let i=t*2,a=n*2,o=this.recordingSession(),u=this.uploadGpu(e),c=o.upscale2x(u,r,t,n,s),d=await o.finish(c,r*i*a);return this.releaseGpu([u]),d}async rope(e,r,t,n,s=0,i=1e4,a=!1){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:32,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([r,t,n,s])),this.device.queue.writeBuffer(c,16,new Float32Array([i]));let d=this.device.createBuffer({size:e.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.device.queue.writeBuffer(c,20,new Uint32Array([a?1:0])),this.run("rope",[c,this.buf(e,u),d],[Math.ceil(r/ae),1,1],d,e.byteLength)}async ropeFactors(e,r,t,n,s,i=0,a=1e4,o=!1){let u=globalThis,c=u.GPUBufferUsage.STORAGE|u.GPUBufferUsage.COPY_DST,d=this.device.createBuffer({size:32,usage:u.GPUBufferUsage.UNIFORM|u.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(d,0,new Uint32Array([t,n,s,i])),this.device.queue.writeBuffer(d,16,new Float32Array([a]));let f=this.device.createBuffer({size:r.byteLength,usage:c});this.device.queue.writeBuffer(f,0,r);let g=this.device.createBuffer({size:e.byteLength,usage:c|u.GPUBufferUsage.COPY_SRC});return this.device.queue.writeBuffer(d,20,new Uint32Array([o?1:0])),this.run("rope_factors",[d,this.buf(e,c),f,g],[Math.ceil(t/ae),1,1],g,e.byteLength)}async ropeMrope(e,r,t,n,s,i,a=1e4){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:32,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([t,n,s,i[0],i[0]+i[1]])),this.device.queue.writeBuffer(c,20,new Float32Array([a]));let d=this.device.createBuffer({size:r.byteLength,usage:u});this.device.queue.writeBuffer(d,0,r);let f=this.device.createBuffer({size:e.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("rope_mrope",[c,this.buf(e,u),d,f],[Math.ceil(t/ae),1,1],f,e.byteLength)}async rope2d(e,r,t,n,s,i=1e4){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:32,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([t,n,s,0])),this.device.queue.writeBuffer(u,16,new Float32Array([i]));let c=this.device.createBuffer({size:r.byteLength,usage:o});this.device.queue.writeBuffer(c,0,r);let d=this.device.createBuffer({size:e.byteLength,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("rope_2d",[u,this.buf(e,o),c,d],[Math.ceil(t/ae),1,1],d,e.byteLength)}async attention(e,r,t,n,s,i,a,o=0,u,c=0,d=0){let f=globalThis,g=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,p=o+n,h=this.attnUniform(n,s,i,a,p,o,u??1/Math.sqrt(a),c,d),b=n*s*a*4,k=this.device.createBuffer({size:b,usage:g|f.GPUBufferUsage.COPY_SRC});return this.run("attention",[h,this.buf(e,g),this.buf(r,g),this.buf(t,g),k],[Math.ceil(n*s/ae),1,1],k,b)}async attentionDecode(e,r,t,n,s,i,a,o=0,u,c=0,d=0){let f=globalThis,g=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,p=o+n,h=this.attnUniform(n,s,i,a,p,o,u??1/Math.sqrt(a),c,d),b=n*s*a*4,k=this.device.createBuffer({size:b,usage:g|f.GPUBufferUsage.COPY_SRC});return this.run("attention_decode",[h,this.buf(e,g),this.buf(r,g),this.buf(t,g),k],[n*s,1,1],k,b)}async attentionPrefill(e,r,t,n,s,i,a,o=0,u,c=0,d=0){let f=globalThis,g=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,p=o+n,h=this.attnUniform(n,s,i,a,p,o,u??1/Math.sqrt(a),c,d),b=n*s*a*4,k=this.device.createBuffer({size:b,usage:g|f.GPUBufferUsage.COPY_SRC});return this.run("attention_prefill",[h,this.buf(e,g),this.buf(r,g),this.buf(t,g),k],[Math.ceil(n/4)*s,1,1],k,b)}async attentionFull(e,r,t,n,s,i,a,o,u,c=0){let d=globalThis,f=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,g=this.device.createBuffer({size:32,usage:d.GPUBufferUsage.UNIFORM|d.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(g,0,new Uint32Array([n,s,i,a,o,0])),this.device.queue.writeBuffer(g,24,new Float32Array([u??1/Math.sqrt(a),c]));let p=n*s*a*4,h=this.device.createBuffer({size:p,usage:f|d.GPUBufferUsage.COPY_SRC});return this.run("attention_full",[g,this.buf(e,f),this.buf(r,f),this.buf(t,f),h],[Math.ceil(n*s/ae),1,1],h,p)}async attentionFullWg(e,r,t,n,s,i,a,o,u,c=0){let d=globalThis,f=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,g=this.device.createBuffer({size:32,usage:d.GPUBufferUsage.UNIFORM|d.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(g,0,new Uint32Array([n,s,i,a,o,0])),this.device.queue.writeBuffer(g,24,new Float32Array([u??1/Math.sqrt(a),c]));let p=n*s*a*4,h=this.device.createBuffer({size:p,usage:f|d.GPUBufferUsage.COPY_SRC});return this.run("attention_full_wg",[g,this.buf(e,f),this.buf(r,f),this.buf(t,f),h],[n*s,1,1],h,p)}async quantizeKvReadback(e,r,t,n){let s=globalThis,i=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST|s.GPUBufferUsage.COPY_SRC,a=t*n,o=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([r,t,n,0]));let u=this.device.createBuffer({size:r*a,usage:i}),c=this.device.createBuffer({size:r*t*4,usage:i});this.dispatch("quantize_kv",[o,this.buf(e,i),u,c],this.grid1D(r*t));let d=await this.readBack(u,r*a),f=new Uint32Array(d.buffer,0,r*a/4),g=await this.readBack(c,r*t*4);return u.destroy?.(),c.destroy?.(),{codes:f,scales:g}}async attentionQ8Kv(e,r,t,n,s,i,a,o,u,c=0,d,f=0,g=0){let p=globalThis,h=p.GPUBufferUsage.STORAGE|p.GPUBufferUsage.COPY_DST,b=c+i,k=this.attnUniform(i,a,o,u,b,c,d??1/Math.sqrt(u),f,g),F=i*a*u*4,M=this.device.createBuffer({size:F,usage:h|p.GPUBufferUsage.COPY_SRC});return this.run("attention_q8kv",[k,this.buf(e,h),this.bufU32(r,h),this.buf(t,h),this.bufU32(n,h),this.buf(s,h),M],[Math.ceil(i*a/ae),1,1],M,F)}async attentionQ8KvDecode(e,r,t,n,s,i,a,o,u,c=0,d,f=0,g=0){let p=globalThis,h=p.GPUBufferUsage.STORAGE|p.GPUBufferUsage.COPY_DST,b=c+i,k=this.attnUniform(i,a,o,u,b,c,d??1/Math.sqrt(u),f,g),F=i*a*u*4,M=this.device.createBuffer({size:F,usage:h|p.GPUBufferUsage.COPY_SRC});return this.run("attention_decode_q8kv",[k,this.buf(e,h),this.bufU32(r,h),this.buf(t,h),this.bufU32(n,h),this.buf(s,h),M],[i*a,1,1],M,F)}async attentionQ8KvPrefill(e,r,t,n,s,i,a,o,u,c=0,d,f=0,g=0){let p=globalThis,h=p.GPUBufferUsage.STORAGE|p.GPUBufferUsage.COPY_DST,b=c+i,k=this.attnUniform(i,a,o,u,b,c,d??1/Math.sqrt(u),f,g),F=i*a*u*4,M=this.device.createBuffer({size:F,usage:h|p.GPUBufferUsage.COPY_SRC});return this.run("attention_prefill_q8kv",[k,this.buf(e,h),this.bufU32(r,h),this.buf(t,h),this.bufU32(n,h),this.buf(s,h),M],[Math.ceil(i/4)*a,1,1],M,F)}async addBias(e,r,t,n){let s=globalThis,i=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,a=this.device.createBuffer({size:8,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(a,0,new Uint32Array([t,n]));let o=this.device.createBuffer({size:e.byteLength,usage:i|s.GPUBufferUsage.COPY_SRC});return this.run("addbias",[a,this.buf(e,i),this.buf(r,i),o],this.grid1D(e.length),o,e.byteLength)}async dequantBlocked(e,r,t,n){let s=globalThis,i=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,a=t/n;if(!Number.isInteger(a))throw new Error(`${e}: nElems ${t} not a multiple of ${n}`);let o=r.byteLength%4===0?r:(()=>{let f=new Uint8Array(Math.ceil(r.byteLength/4)*4);return f.set(r),f})(),u=new Uint32Array(o.buffer,o.byteOffset,o.byteLength/4),c=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([a]));let d=this.device.createBuffer({size:t*4,usage:i|s.GPUBufferUsage.COPY_SRC});return this.run(e,[c,this.bufU32(u,i),d],this.grid1D(a),d,t*4)}async dequantizeQ4K(e,r){return this.dequantBlocked("dequant_q4k",e,r,256)}async dequantizeByType(e,r,t){if(e==="F32")return new Float32Array(r.buffer,r.byteOffset,t);if(e==="F16"){let i=new DataView(r.buffer,r.byteOffset),a=new Float32Array(t);for(let o=0;o<t;o++)a[o]=ke(i.getUint16(o*2,!0));return a}if(e==="Q4W")return ge(be(r,t));if(e==="Q8W")return he(we(r,t));if(e==="Q3W")return Oe(Ge(r,t));let n=ee.DEQUANT_SHADER[e],s=ee.BLOCK_ELEMS[e];if(!n||!s)throw new Error(`dequant: unsupported GGML type ${e}`);return this.dequantBlocked(n,r,t,s)}dequantBlockedGpu(e,r,t,n){let s=globalThis,i=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,a=t/n;if(!Number.isInteger(a))throw new Error(`${e}: nElems ${t} not a multiple of ${n}`);let o=r.byteLength%4===0?r:(()=>{let f=new Uint8Array(Math.ceil(r.byteLength/4)*4);return f.set(r),f})(),u=new Uint32Array(o.buffer,o.byteOffset,o.byteLength/4),c=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([a]));let d=this.device.createBuffer({size:t*4,usage:i});return this.dispatch(e,[c,this.bufU32(u,i),d],this.grid1D(a)),d}dequantizeToGpu(e,r,t){let n=globalThis,s=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST;if(e==="F32")return this.buf(new Float32Array(r.buffer,r.byteOffset,t),s);if(e==="F16"){let o=new DataView(r.buffer,r.byteOffset),u=new Float32Array(t);for(let c=0;c<t;c++)u[c]=ke(o.getUint16(c*2,!0));return this.buf(u,s)}if(e==="Q4W")return this.buf(ge(be(r,t)),s);if(e==="Q8W")return this.buf(he(we(r,t)),s);if(e==="Q3W")return this.buf(Oe(Ge(r,t)),s);let i=ee.DEQUANT_SHADER[e],a=ee.BLOCK_ELEMS[e];if(!i||!a)throw new Error(`dequant: unsupported GGML type ${e}`);return this.dequantBlockedGpu(i,r,t,a)}async layerForward(e,r,t,n=!1){let{seq:s,d:i,nHeads:a,nKvHeads:o,headDim:u,ffn:c,ropeTheta:d,eps:f}=r,g=o*u,p=n?(T,D,E,U,R)=>this.matmulT(T,D,E,U,R):(T,D,E,U,R)=>this.matmul(T,D,E,U,R),h=a*u,b=r.rmsGainOnePlus===!0,k=r.attnLogitSoftcap??0,F=(T,D)=>r.act==="gelu"?this.geglu(T,D):this.swiglu(T,D),M=await this.rmsnorm(e,t.attnNorm,s,i,f,b),S=await p(M,t.wq,s,i,h),j=await p(M,t.wk,s,i,g),z=await p(M,t.wv,s,i,g);t.bq&&(S=await this.addBias(S,t.bq,s,h)),t.bk&&(j=await this.addBias(j,t.bk,s,g)),t.bv&&(z=await this.addBias(z,t.bv,s,g)),t.qNorm&&(S=await this.rmsnorm(S,t.qNorm,s*a,u,f,b)),t.kNorm&&(j=await this.rmsnorm(j,t.kNorm,s*o,u,f,b));let A=await this.rope(S,s*a,u,a,0,d),w=await this.rope(j,s*o,u,o,0,d),v=await this.attention(A,w,z,s,a,o,u,0,r.attnScale,k),m=await p(v,t.wo,s,h,i);t.postAttnNorm&&(m=await this.rmsnorm(m,t.postAttnNorm,s,i,f,b));let _=await this.add(e,m),y=await this.rmsnorm(_,t.ffnNorm,s,i,f,b),x=await p(y,t.wgate,s,i,c),P=await p(y,t.wup,s,i,c),q=await F(x,P),B=await p(q,t.wdown,s,c,i);return t.postFfnNorm&&(B=await this.rmsnorm(B,t.postFfnNorm,s,i,f,b)),this.add(_,B)}async layerForwardKV(e,r,t,n,s,i,a=!1){let{seq:o,d:u,nHeads:c,nKvHeads:d,headDim:f,ffn:g,ropeTheta:p,eps:h}=r,b=d*f,k=a?(V,I,X,O,G)=>this.matmulT(V,I,X,O,G):(V,I,X,O,G)=>this.matmul(V,I,X,O,G),F=(V,I)=>{let X=new Float32Array(V.length+I.length);return X.set(V),X.set(I,V.length),X},M=c*f,S=r.rmsGainOnePlus===!0,j=r.attnLogitSoftcap??0,z=(V,I)=>r.act==="gelu"?this.geglu(V,I):this.swiglu(V,I),A=await this.rmsnorm(e,t.attnNorm,o,u,h,S),w=await k(A,t.wq,o,u,M),v=await k(A,t.wk,o,u,b),m=await k(A,t.wv,o,u,b);t.bq&&(w=await this.addBias(w,t.bq,o,M)),t.bk&&(v=await this.addBias(v,t.bk,o,b)),t.bv&&(m=await this.addBias(m,t.bv,o,b)),t.qNorm&&(w=await this.rmsnorm(w,t.qNorm,o*c,f,h,S)),t.kNorm&&(v=await this.rmsnorm(v,t.kNorm,o*d,f,h,S));let _=await this.rope(w,o*c,f,c,n,p),y=await this.rope(v,o*d,f,d,n,p),x=F(s,y),P=F(i,m),q=await this.attention(_,x,P,o,c,d,f,n,r.attnScale,j),B=await k(q,t.wo,o,M,u);t.postAttnNorm&&(B=await this.rmsnorm(B,t.postAttnNorm,o,u,h,S));let T=await this.add(e,B),D=await this.rmsnorm(T,t.ffnNorm,o,u,h,S),E=await k(D,t.wgate,o,u,g),U=await k(D,t.wup,o,u,g),R=await z(E,U),H=await k(R,t.wdown,o,g,u);return t.postFfnNorm&&(H=await this.rmsnorm(H,t.postFfnNorm,o,u,h,S)),{out:await this.add(T,H),k:x,v:P}}storage(e){let r=this.bufferPool.get(e);if(r&&r.length){let n=r.pop();return this.pooled.delete(n),n}let t=this.device.createBuffer({size:e,usage:ee.STORAGE_USAGE});return this.poolSize.set(t,e),t}release(e){for(let r of e){if(!r)continue;let t=this.poolSize.get(r);if(t!==void 0){if(this.pooled.has(r))continue;this.pooled.add(r);let s=this.bufferPool.get(t);s||(s=[],this.bufferPool.set(t,s)),s.push(r);continue}let n=this.uniformSize.get(r);if(n!==void 0){if(this.pooled.has(r))continue;this.pooled.add(r);let s=this.uniformPool.get(n);s||(s=[],this.uniformPool.set(n,s)),s.push(r);continue}r.destroy?.()}}uploadGpu(e){return e instanceof Float32Array?this.buf(e,ee.STORAGE_USAGE):this.f16ToF32Gpu(e.f16,e.n)}uploadGpuF16(e){let r=new Uint16Array(e.length);for(let t=0;t<e.length;t++)r[t]=Re(e[t]);return this.bufU16(r)}f32ToF16Gpu(e,r){let t=globalThis,n=Math.ceil(r/2),s=this.device.createBuffer({size:n*4,usage:ee.STORAGE_USAGE}),i=this.device.createBuffer({size:16,usage:t.GPUBufferUsage.UNIFORM|t.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(i,0,new Uint32Array([n])),this.dispatch("packf16",[i,e,s],this.grid1D(n)),s}f32ToQ8Gpu(e,r){let t=globalThis,n=r/32,s=this.device.createBuffer({size:r,usage:ee.STORAGE_USAGE}),i=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:ee.STORAGE_USAGE}),a=this.device.createBuffer({size:16,usage:t.GPUBufferUsage.UNIFORM|t.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(a,0,new Uint32Array([n])),this.dispatch("quantize_q8",[a,e,s,i],this.grid1D(n)),{codes:s,sc:i}}f32ToQ4Gpu(e,r){let t=globalThis,n=r/32,s=this.device.createBuffer({size:r/2,usage:ee.STORAGE_USAGE}),i=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:ee.STORAGE_USAGE}),a=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:ee.STORAGE_USAGE}),o=this.device.createBuffer({size:16,usage:t.GPUBufferUsage.UNIFORM|t.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(o,0,new Uint32Array([n])),this.dispatch("quantize_q4",[o,e,s,i,a],this.grid1D(n)),{nib:s,sc:i,mn:a}}uploadGpuRawF16(e){let r=Math.ceil(e.byteLength/4)*4,t=this.device.createBuffer({size:r,usage:ee.STORAGE_USAGE});if(this.device.queue.writeBuffer(t,0,e,0,e.byteLength-e.byteLength%4),e.byteLength%4){let n=new Uint8Array(4);n.set(e.subarray(e.byteLength-e.byteLength%4)),this.device.queue.writeBuffer(t,e.byteLength-e.byteLength%4,n)}return t}bufU16(e){let r=this.device.createBuffer({size:e.byteLength,usage:ee.STORAGE_USAGE});return this.device.queue.writeBuffer(r,0,e),r}uploadGpuRaw(e){let r=Math.ceil(e.byteLength/4)*4,t=this.device.createBuffer({size:r,usage:ee.STORAGE_USAGE}),n=e.byteLength-e.byteLength%4;if(this.device.queue.writeBuffer(t,0,e,0,n),e.byteLength%4){let s=new Uint8Array(4);s.set(e.subarray(n)),this.device.queue.writeBuffer(t,n,s)}return t}async matmulQ4(e,r,t,n,s,i,a){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s,i,a]));let d=this.device.createBuffer({size:s*a*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4",[c,this.buf(e,u),r,t,n,d],[Math.ceil(s/8),Math.ceil(a/8),1],d,s*a*4)}async matmulQ4Tiled(e,r,t,n,s,i,a){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s,i,a]));let d=this.device.createBuffer({size:s*a*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_tiled",[c,this.buf(e,u),r,t,n,d],[Math.ceil(Math.ceil(s/4)/8),Math.ceil(a/8),1],d,s*a*4)}async matmulQ4Shared(e,r,t,n,s,i,a){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s,i,a]));let d=this.device.createBuffer({size:s*a*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_shared",[c,this.buf(e,u),r,t,n,d],[Math.ceil(a/64),Math.ceil(s/32),1],d,s*a*4)}async matmulQ3(e,r,t,n,s,i,a,o){let u=globalThis,c=u.GPUBufferUsage.STORAGE|u.GPUBufferUsage.COPY_DST,d=this.device.createBuffer({size:16,usage:u.GPUBufferUsage.UNIFORM|u.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(d,0,new Uint32Array([i,a,o]));let f=this.device.createBuffer({size:i*o*4,usage:c|u.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q3",[d,this.buf(e,c),r,t,n,s,f],[Math.ceil(i/8),Math.ceil(o/8),1],f,i*o*4)}async rwkvWkv7(e,r,t,n,s,i,a,o,u){let c=globalThis,d=c.GPUBufferUsage.STORAGE|c.GPUBufferUsage.COPY_DST,f=this.device.createBuffer({size:8,usage:c.GPUBufferUsage.UNIFORM|c.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(f,0,new Uint32Array([o,u]));let g=this.device.createBuffer({size:e.byteLength,usage:d|c.GPUBufferUsage.COPY_SRC});this.device.queue.writeBuffer(g,0,e);let p=this.device.createBuffer({size:o*u*4,usage:d|c.GPUBufferUsage.COPY_SRC});this.dispatch("rwkv_wkv7",[f,this.buf(r,d),this.buf(t,d),this.buf(n,d),this.buf(s,d),this.buf(i,d),this.buf(a,d),g,p],this.grid1D(o*u));let h=await this.readBack(g,e.byteLength),b=await this.readBack(p,o*u*4);return g.destroy?.(),p.destroy?.(),{S:h,y:b}}async rwkvTokenShift(e,r,t,n){let s=globalThis,i=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,a=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(a,0,new Uint32Array([n]));let o=this.device.createBuffer({size:6*n*4,usage:i|s.GPUBufferUsage.COPY_SRC});this.dispatch("rwkv_token_shift",[a,this.buf(e,i),this.buf(r,i),this.buf(t,i),o],this.grid1D(n*6));let u=await this.readBack(o,6*n*4);return o.destroy?.(),u}async lfm2ShortConv(e,r,t,n,s){let i=globalThis,a=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([n,s]));let u=this.buf(r,a|i.GPUBufferUsage.COPY_SRC),c=this.device.createBuffer({size:n*4,usage:a|i.GPUBufferUsage.COPY_SRC});this.dispatch("lfm2_shortconv",[o,this.buf(e,a),this.buf(t,a),u,c],this.grid1D(n));let d=await this.readBack(c,n*4),f=await this.readBack(u,(s-1)*n*4);return c.destroy?.(),u.destroy?.(),{out:d,state:f}}async matmulQ8(e,r,t,n,s,i){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s,i]));let c=this.device.createBuffer({size:n*i*4,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8",[u,this.buf(e,o),r,t,c],[Math.ceil(n/8),Math.ceil(i/8),1],c,n*i*4)}async matmulQ8Tiled(e,r,t,n,s,i){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s,i]));let c=this.device.createBuffer({size:n*i*4,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_tiled",[u,this.buf(e,o),r,t,c],[Math.ceil(Math.ceil(n/4)/8),Math.ceil(i/8),1],c,n*i*4)}async matmulQ8Shared(e,r,t,n,s,i){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s,i]));let c=this.device.createBuffer({size:n*i*4,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_shared",[u,this.buf(e,o),r,t,c],[Math.ceil(i/64),Math.ceil(n/32),1],c,n*i*4)}async matmulQ8Shared2(e,r,t,n,s,i){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s,i]));let c=this.device.createBuffer({size:n*i*4,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_shared2",[u,this.buf(e,o),r,t,c],[Math.ceil(i/128),Math.ceil(n/64),1],c,n*i*4)}async matmulQ4Shared2(e,r,t,n,s,i,a){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s,i,a]));let d=this.device.createBuffer({size:s*a*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_shared2",[c,this.buf(e,u),r,t,n,d],[Math.ceil(a/128),Math.ceil(s/64),1],d,s*a*4)}uniformOf(e){let r=globalThis,t=this.uniformPool.get(e);if(t&&t.length){let s=t.pop();return this.pooled.delete(s),s}let n=this.device.createBuffer({size:e,usage:r.GPUBufferUsage.UNIFORM|r.GPUBufferUsage.COPY_DST});return this.uniformSize.set(n,e),n}uniform(e,r){let t=this.uniformOf(32);if(this.device.queue.writeBuffer(t,0,new Uint32Array(e)),r){let n=Array.isArray(r.value)?r.value:[r.value];this.device.queue.writeBuffer(t,r.offset,new Float32Array(n))}return t}attnUniform(e,r,t,n,s,i,a,o,u){let c=this.uniformOf(48);return this.device.queue.writeBuffer(c,0,new Uint32Array([e,r,t,n,s,i])),this.device.queue.writeBuffer(c,24,new Float32Array([a,o])),this.device.queue.writeBuffer(c,32,new Uint32Array([u])),c}recMatmulT(e,r,t,n,s,i,a,o=!1){let u=this.uniform([s,i,a]),c=this.storage(s*a*4),d=this.matmulTPlan(s,i,a,o);return this.recordPass(e,d.shader,[u,t,n,c],d.grid),r.push(u,c),c}recConv2dDirect(e,r,t,n,s,i,a,o,u,c,d,f,g){let p=Math.floor((a+2*g-c)/f)+1,h=Math.floor((o+2*g-d)/f)+1,b=u*p*h,k=this.uniformOf(48);if(this.device.queue.writeBuffer(k,0,new Uint32Array([i,a,o,u,c,d,f,g,p,h])),c===3&&d===3&&f===1&&g===1&&this.convTiledOk){let M=this.storage(b*4);return this.recordPass(e,"conv2d_3x3_tiled",[k,t,n,s,M],[Math.ceil(h/16),Math.ceil(p/16),u]),r.push(k,M),M}let F=this.storage(b*4);return this.recordPass(e,"conv2d_direct",[k,t,n,s,F],this.grid1D(b)),r.push(k,F),F}recConv2dDirectQ8(e,r,t,n,s,i,a,o,u,c,d,f,g){let p=Math.floor((a+2*g-c)/f)+1,h=Math.floor((o+2*g-d)/f)+1,b=u*p*h,k=this.uniformOf(48);if(this.device.queue.writeBuffer(k,0,new Uint32Array([i,a,o,u,c,d,f,g,p,h])),c===3&&d===3&&f===1&&g===1&&this.convTiledQOk){let M=this.storage(b*4);return this.recordPass(e,"conv2d_3x3_tiled_q8",[k,t,n.codes,n.sc,s,M],[Math.ceil(h/16),Math.ceil(p/16),Math.ceil(u/8)]),r.push(k,M),M}if(c===1&&d===1&&f===1&&g===0&&this.convTiledQOk){let M=this.storage(b*4);return this.recordPass(e,"conv2d_1x1_q8",[k,t,n.codes,n.sc,s,M],[Math.ceil(h/16),Math.ceil(p/16),Math.ceil(u/8)]),r.push(k,M),M}if(c===3&&d===3&&f===2&&g===1&&this.convTiledQOk&&this.convS2Ok){let M=this.storage(b*4);return this.recordPass(e,"conv2d_3x3_s2_tiled_q8",[k,t,n.codes,n.sc,s,M],[Math.ceil(h/16),Math.ceil(p/8),Math.ceil(u/8)]),r.push(k,M),M}let F=this.storage(b*4);return this.recordPass(e,"conv2d_direct_q8",[k,t,n.codes,n.sc,s,F],this.grid1D(b)),r.push(k,F),F}recConv2dDirectQ4(e,r,t,n,s,i,a,o,u,c,d,f,g){let p=Math.floor((a+2*g-c)/f)+1,h=Math.floor((o+2*g-d)/f)+1,b=u*p*h,k=this.uniformOf(48);if(this.device.queue.writeBuffer(k,0,new Uint32Array([i,a,o,u,c,d,f,g,p,h])),c===3&&d===3&&f===1&&g===1&&this.convTiledQOk){let M=this.storage(b*4);return this.recordPass(e,"conv2d_3x3_tiled_q4",[k,t,n.nib,n.sc,n.mn,s,M],[Math.ceil(h/16),Math.ceil(p/16),Math.ceil(u/8)]),r.push(k,M),M}if(c===1&&d===1&&f===1&&g===0&&this.convTiledQOk){let M=this.storage(b*4);return this.recordPass(e,"conv2d_1x1_q4",[k,t,n.nib,n.sc,n.mn,s,M],[Math.ceil(h/16),Math.ceil(p/16),Math.ceil(u/8)]),r.push(k,M),M}if(c===3&&d===3&&f===2&&g===1&&this.convTiledQOk&&this.convS2Ok){let M=this.storage(b*4);return this.recordPass(e,"conv2d_3x3_s2_tiled_q4",[k,t,n.nib,n.sc,n.mn,s,M],[Math.ceil(h/16),Math.ceil(p/8),Math.ceil(u/8)]),r.push(k,M),M}let F=this.storage(b*4);return this.recordPass(e,"conv2d_direct_q4",[k,t,n.nib,n.sc,n.mn,s,F],this.grid1D(b)),r.push(k,F),F}recGroupNorm(e,r,t,n,s,i,a,o,u){let c=this.uniform([i,a,o],{offset:12,value:u}),d=this.storage(i*a*4),f=this.hasSubgroups&&this.subgroupsOk?"group_norm_subgroup":"group_norm";return this.recordPass(e,f,[c,t,n,s,d],[o,1,1]),r.push(c,d),d}recUnary(e,r,t,n,s){let i=this.storage(s*4);return this.recordPass(e,t,[n,i],this.grid1D(s)),r.push(i),i}recLayernorm(e,r,t,n,s,i,a,o){let u=this.uniform([i,a],{offset:8,value:o}),c=this.storage(i*a*4);return this.recordPass(e,"layernorm",[u,t,n,s,c],[Math.ceil(i/ae),1,1]),r.push(u,c),c}recAttentionFull(e,r,t,n,s,i,a,o,u,c,d){let f=this.uniform([i,a,o,u,c,0],{offset:24,value:[d??1/Math.sqrt(u),0]}),g=this.storage(i*a*u*4),p=i*a;return this.attnFullWgOk&&u<=192&&p<=65535?this.recordPass(e,"attention_full_wg",[f,t,n,s,g],[p,1,1]):this.recordPass(e,"attention_full",[f,t,n,s,g],[Math.ceil(p/ae),1,1]),r.push(f,g),g}recUpsample(e,r,t,n,s,i,a){let o=this.uniform([n,s,i,a]),u=n*(s*a)*(i*a),c=this.storage(u*4);return this.recordPass(e,"upsample_nearest",[o,t,c],this.grid1D(u)),r.push(o,c),c}recConcat(e,r,t,n,s,i,a){let o=this.storage((s+i)*a*4);return e.copyBufferToBuffer(t,0,o,0,s*a*4),e.copyBufferToBuffer(n,0,o,s*a*4,i*a*4),r.push(o),o}recAddChannelBias(e,r,t,n,s,i){let a=this.uniform([s,i]),o=this.storage(s*i*4);return this.recordPass(e,"add_channel_bias",[a,t,n,o],this.grid1D(s*i)),r.push(a,o),o}recTranspose(e,r,t,n,s){let i=this.uniform([n,s]),a=this.storage(n*s*4);return this.recordPass(e,"transpose2d",[i,t,a],this.grid1D(n*s)),r.push(i,a),a}recGegluSplit(e,r,t,n,s){let i=this.uniform([n,s]),a=this.storage(n*s*4);return this.recordPass(e,"geglu_split",[i,t,a],this.grid1D(n*s)),r.push(i,a),a}recUpscale2x(e,r,t,n,s,i,a=.5){let o=this.uniform([n,s,i],{offset:12,value:a}),u=i*2,c=s*2,d=this.storage(n*c*u*4);return this.recordPass(e,"upscale2x_enhanced",[o,t,d],[Math.ceil(u/16),Math.ceil(c/16),n]),r.push(o,d),d}recVideoGather(e,r,t,n,s,i){let a=this.uniform([n,s,i]),o=this.storage(i*n*s*4);return this.recordPass(e,"video_motion_gather",[a,t,o],this.grid1D(i*n*s)),r.push(a,o),o}recVideoScatter(e,r,t,n,s,i,a){let o=this.uniform([s,i,a]),u=this.storage(s*i*a*4);return this.recordPass(e,"video_motion_scatter",[o,t,n,u],this.grid1D(s*i*a)),r.push(o,u),u}recVideoAddPe(e,r,t,n,s,i,a){let o=this.uniform([s,i,a]),u=this.storage(a*s*i*4);return this.recordPass(e,"video_add_pe",[o,t,n,u],this.grid1D(a*s*i)),r.push(o,u),u}recAttnTemporal(e,r,t,n,s,i,a,o,u){let c=this.uniform([i,a,o,u],{offset:16,value:1/Math.sqrt(u)}),d=this.storage(i*a*o*u*4);return this.recordPass(e,"attn_temporal",[c,t,n,s,d],this.grid1D(i*a*o)),r.push(c,d),d}recordingSession(){let e=this.device.createCommandEncoder(),r=[],t=n=>{if(n instanceof Float32Array){let s=this.uploadGpu(n);return r.push(s),s}return n};return{conv2d:(n,s,i,a,o,u,c,d,f,g,p)=>s&&s.nib?this.recConv2dDirectQ4(e,r,t(n),s,t(i),a,o,u,c,d,f,g,p):s&&s.codes?this.recConv2dDirectQ8(e,r,t(n),s,t(i),a,o,u,c,d,f,g,p):this.recConv2dDirect(e,r,t(n),t(s),t(i),a,o,u,c,d,f,g,p),groupNorm:(n,s,i,a,o,u,c)=>this.recGroupNorm(e,r,t(n),t(s),t(i),a,o,u,c),silu:(n,s)=>this.recUnary(e,r,"silu",t(n),s),quickGelu:(n,s)=>this.recUnary(e,r,"quick_gelu",t(n),s),gelu:(n,s)=>this.recUnary(e,r,"gelu",t(n),s),relu:(n,s)=>this.recUnary(e,r,"relu",t(n),s),add:(n,s,i)=>this.recBinary(e,r,"add",t(n),t(s),i),geglu:(n,s,i)=>this.recBinary(e,r,"geglu",t(n),t(s),i),matmulT:(n,s,i,a,o)=>this.recMM(e,r,t(n),s instanceof Float32Array?t(s):s,i,a,o,!1),addBias:(n,s,i,a)=>this.recAddBias(e,r,t(n),t(s),i,a),addChannelBias:(n,s,i,a)=>this.recAddChannelBias(e,r,t(n),t(s),i,a),attentionFull:(n,s,i,a,o,u,c,d)=>this.recAttentionFull(e,r,t(n),t(s),t(i),a,o,u,c,d),rope2d:(n,s,i,a,o,u)=>{let c=s instanceof Uint32Array?(()=>{let d=this.uploadGpuRaw(new Uint8Array(s.buffer,s.byteOffset,s.byteLength));return r.push(d),d})():s;return this.recRope2d(e,r,t(n),c,i,a,o,u)},attention:(n,s,i,a,o,u,c,d,f)=>this.recAttention(e,r,t(n),t(s),t(i),a,o,u,c,d,f),upsample:(n,s,i,a,o)=>this.recUpsample(e,r,t(n),s,i,a,o),upscale2x:(n,s,i,a,o=.5)=>this.recUpscale2x(e,r,t(n),s,i,a,o),layernorm:(n,s,i,a,o,u)=>this.recLayernorm(e,r,t(n),t(s),t(i),a,o,u),concat:(n,s,i,a,o)=>this.recConcat(e,r,t(n),t(s),i,a,o),transpose:(n,s,i)=>this.recTranspose(e,r,t(n),s,i),gegluSplit:(n,s,i)=>this.recGegluSplit(e,r,t(n),s,i),videoGather:(n,s,i,a)=>this.recVideoGather(e,r,t(n),s,i,a),videoScatter:(n,s,i,a,o)=>this.recVideoScatter(e,r,t(n),t(s),i,a,o),videoAddPe:(n,s,i,a,o)=>this.recVideoAddPe(e,r,t(n),t(s),i,a,o),attnTemporal:(n,s,i,a,o,u,c)=>this.recAttnTemporal(e,r,t(n),t(s),t(i),a,o,u,c),alloc:n=>{let s=this.storage(n);return r.push(s),s},copy:(n,s,i,a,o)=>{e.copyBufferToBuffer(i,a,n,s,o)},finish:async(n,s)=>{this.device.queue.submit([e.finish()]);let i=await this.readBack(n,s*4);return this.release(r),i},finishKeep:n=>{this.device.queue.submit([e.finish()]);let s=r.indexOf(n);return s>=0&&r.splice(s,1),this.release(r),n},finishKeepMany:n=>{this.device.queue.submit([e.finish()]);for(let s of n){let i=r.indexOf(s);i>=0&&r.splice(i,1)}return this.release(r),n}}}readGpu(e,r){return this.readBack(e,r*4)}trimPool(e=64<<20){let r=[...this.bufferPool.keys()].sort((n,s)=>s-n),t=0;for(let n of this.bufferPool.values())for(let s of n)t+=this.poolSize.get(s)??0;for(let n of r){let s=this.bufferPool.get(n);for(;s.length&&t>e;){let i=s.pop();this.pooled.delete(i),this.poolSize.delete(i),i.destroy?.(),t-=n}}}releaseGpu(e){this.release(e)}waitGpu(){return this.device.queue.onSubmittedWorkDone()}async benchMatmul(e,r,t,n,s,i={}){let{iters:a=10,shared:o=!0,shared2:u=!0,wF16:c=!1}=i,d=this.f16SharedOk,f=this.qSharedOk,g=this.qShared2Ok;this.f16SharedOk=o,this.qSharedOk=o,this.qShared2Ok=o&&u;let p=this.uploadGpu(e),h=[],b=this.device.createCommandEncoder();this.recMM(b,h,p,r,t,n,s,c),this.device.queue.submit([b.finish()]),await this.device.queue.onSubmittedWorkDone();let k=this.device.createCommandEncoder();for(let S=0;S<a;S++)this.recMM(k,h,p,r,t,n,s,c);let F=performance.now();this.device.queue.submit([k.finish()]),await this.device.queue.onSubmittedWorkDone();let M=(performance.now()-F)/a;return this.release(h),p.destroy?.(),this.f16SharedOk=d,this.qSharedOk=f,this.qShared2Ok=g,M}destroy(){try{this.profiler?.destroy()}catch{}this.profiler=null;try{this.device?.destroy?.()}catch{}this.bufferPool.clear(),this.uniformPool.clear()}f16ToF32Gpu(e,r){let t=this.uploadGpuRawF16(e),n=this.device.createBuffer({size:r*4,usage:ee.STORAGE_USAGE}),s=this.uniformOf(16);return this.device.queue.writeBuffer(s,0,new Uint32Array([r])),this.dispatch("f16_to_f32",[s,t,n],this.grid1D(Math.ceil(r/2))),t.destroy?.(),this.release([s]),n}quantizeQ8Gpu(e){let r=e instanceof Float32Array?e.length:e.n;if(r%32!==0)return this.uploadGpu(e);let t=e instanceof Float32Array?this.buf(e,ee.STORAGE_USAGE):this.f16ToF32Gpu(e.f16,r),n=this.f32ToQ8Gpu(t,r);return t.destroy?.(),n}async validateResidentOps(){let e=globalThis,r=_=>Float32Array.from({length:_},()=>(Math.random()*2-1)*.5),t=(_,y,x=.005)=>_.length===y.length&&_.every((P,q)=>Math.abs(P-y[q])<=x*(1+Math.abs(y[q]))),n=4,s=4,i=4,a=4,o=2,u=1e-5,c=a*s*i,d=r(n*s*i),f=r(a*n*9),g=r(a),p=r(a),h=r(a),b=await this.silu(await this.groupNorm(await this.conv2dDirect(d,f,g,n,s,i,a,3,3,1,1),p,h,a,s*i,o,u)),k=[],F=this.device.createCommandEncoder(),M=this.uploadGpu(d),S=this.uploadGpu(f),j=this.uploadGpu(g),z=this.uploadGpu(p),A=this.uploadGpu(h);k.push(M,S,j,z,A);let w=this.recConv2dDirect(F,k,M,S,j,n,s,i,a,3,3,1,1);w=this.recGroupNorm(F,k,w,z,A,a,s*i,o,u),w=this.recUnary(F,k,"silu",w,c);let v=this.device.createBuffer({size:c*4,usage:e.GPUBufferUsage.COPY_DST|e.GPUBufferUsage.MAP_READ});F.copyBufferToBuffer(w,0,v,0,c*4),this.device.queue.submit([F.finish()]),await v.mapAsync(e.GPUMapMode.READ);let m=new Float32Array(v.getMappedRange().slice(0));return v.unmap(),v.destroy(),this.release(k),t(m,b)?null:"resident_ops"}recMatmulQ4(e,r,t,n,s,i,a){let o=this.uniform([s,i,a]),u=this.storage(s*a*4);if(s===1&&this.gemvOk){let c=this.gemvGrid(a);this.recordPass(e,"matmul_t_q4_vec",[this.uniform([s,i,a,c.stride]),t,n.nib,n.sc,n.mn,u],c.grid)}else s>=64&&this.qSharedOk&&this.qShared2Ok?this.recordPass(e,"matmul_t_q4_shared2",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(a/128),Math.ceil(s/64),1]):s>=32&&this.qSharedOk?this.recordPass(e,"matmul_t_q4_shared",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(a/64),Math.ceil(s/32),1]):s>=2?this.recordPass(e,"matmul_t_q4_tiled",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(Math.ceil(s/4)/8),Math.ceil(a/8),1]):this.recordPass(e,"matmul_t_q4",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(s/8),Math.ceil(a/8),1]);return r.push(o,u),u}recMatmulQ8(e,r,t,n,s,i,a){let o=this.uniform([s,i,a]),u=this.storage(s*a*4);if(s===1&&this.gemvOk){let c=this.gemvGrid(a);this.recordPass(e,"matmul_t_q8_vec",[this.uniform([s,i,a,c.stride]),t,n.codes,n.sc,u],c.grid)}else s>=64&&this.qSharedOk&&this.qShared2Ok?this.recordPass(e,"matmul_t_q8_shared2",[o,t,n.codes,n.sc,u],[Math.ceil(a/128),Math.ceil(s/64),1]):s>=32&&this.qSharedOk?this.recordPass(e,"matmul_t_q8_shared",[o,t,n.codes,n.sc,u],[Math.ceil(a/64),Math.ceil(s/32),1]):s>=2?this.recordPass(e,"matmul_t_q8_tiled",[o,t,n.codes,n.sc,u],[Math.ceil(Math.ceil(s/4)/8),Math.ceil(a/8),1]):this.recordPass(e,"matmul_t_q8",[o,t,n.codes,n.sc,u],[Math.ceil(s/8),Math.ceil(a/8),1]);return r.push(o,u),u}gemvGrid(e){return e<=32768?{grid:[e,1,1],stride:32768}:{grid:[32768,Math.ceil(e/32768),1],stride:32768}}async matmulQ4Vec(e,r,t,n,s,i){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.gemvGrid(i),c=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([1,s,i,u.stride]));let d=this.device.createBuffer({size:i*4,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_vec",[c,this.buf(e,o),r,t,n,d],u.grid,d,i*4)}async matmulQ8Vec(e,r,t,n,s){let i=globalThis,a=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=this.gemvGrid(s),u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([1,n,s,o.stride]));let c=this.device.createBuffer({size:s*4,usage:a|i.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_vec",[u,this.buf(e,a),r,t,c],o.grid,c,s*4)}recMatmulQ3(e,r,t,n,s,i,a){let o=this.uniform([s,i,a]),u=this.storage(s*a*4);return this.recordPass(e,"matmul_t_q3",[o,t,n.lo,n.hi,n.sc,n.mn,u],[Math.ceil(s/8),Math.ceil(a/8),1]),r.push(o,u),u}recMM(e,r,t,n,s,i,a,o){return n&&n.q3?this.recMatmulQ3(e,r,t,n,s,i,a):n&&n.nib?this.recMatmulQ4(e,r,t,n,s,i,a):n&&n.codes?this.recMatmulQ8(e,r,t,n,s,i,a):this.recMatmulT(e,r,t,n,s,i,a,o)}recRmsnorm(e,r,t,n,s,i,a,o=!1){let u=this.uniform([s,i,0,o?1:0],{offset:8,value:a}),c=this.storage(s*i*4);if(this.rmsVecOk&&s<=65535){let d=this.hasSubgroups&&this.subgroupsOk?"rmsnorm_vec_subgroup":"rmsnorm_vec";this.recordPass(e,d,[u,t,n,c],[s,1,1])}else this.recordPass(e,"rmsnorm",[u,t,n,c],[Math.ceil(s/ae),1,1]);return r.push(u,c),c}recRope(e,r,t,n,s,i,a,o,u=!1){let c=this.uniform([n,s,i,a],{offset:16,value:o});this.device.queue.writeBuffer(c,20,new Uint32Array([u?1:0]));let d=this.storage(n*s*4);return this.recordPass(e,"rope",[c,t,d],[Math.ceil(n/ae),1,1]),r.push(c,d),d}recRopeMrope(e,r,t,n,s,i,a,o,u){let c=u[0],d=u[0]+u[1],f=this.uniform([s,i,a,c,d],{offset:20,value:o}),g=this.storage(s*i*4);return this.recordPass(e,"rope_mrope",[f,t,n,g],[Math.ceil(s/ae),1,1]),r.push(f,g),g}preparePositions(e,r){if(e.positions&&e.mropeSections){let t=this.storage(e.positions.byteLength);this.device.queue.writeBuffer(t,0,e.positions),r.push(t),e._posGpu=t}if(e.ropeFactors){let t=this.storage(e.ropeFactors.byteLength);this.device.queue.writeBuffer(t,0,e.ropeFactors),r.push(t),e._ffGpu=t}}recRope2d(e,r,t,n,s,i,a,o){let u=this.uniform([s,i,a,0],{offset:16,value:o}),c=this.storage(s*i*4);return this.recordPass(e,"rope_2d",[u,t,n,c],[Math.ceil(s/ae),1,1]),r.push(u,c),c}recRopeFactors(e,r,t,n,s,i,a,o,u,c=!1){let d=this.uniform([s,i,a,o],{offset:16,value:u});this.device.queue.writeBuffer(d,20,new Uint32Array([c?1:0]));let f=this.storage(s*i*4);return this.recordPass(e,"rope_factors",[d,t,n,f],[Math.ceil(s/ae),1,1]),r.push(d,f),f}recAttention(e,r,t,n,s,i,a,o,u,c,d,f,g=0,p=0){let h=this.attnUniform(i,a,o,u,c,d,f??1/Math.sqrt(u),g,p),b=this.storage(i*a*u*4);return this.attnDecodeOk&&i*a<256&&u<=128?this.recordPass(e,"attention_decode",[h,t,n,s,b],[i*a,1,1]):this.attnPrefillOk&&u<=128?this.recordPass(e,"attention_prefill",[h,t,n,s,b],[Math.ceil(i/4)*a,1,1]):this.recordPass(e,"attention",[h,t,n,s,b],[Math.ceil(i*a/ae),1,1]),r.push(h,b),b}recQuantizeKv(e,r,t,n,s,i,a,o,u){let c=this.uniform([i,a,o,u]);this.recordPass(e,"quantize_kv",[c,t,n,s],this.grid1D(i*a)),r.push(c)}recAttentionQ8(e,r,t,n,s,i,a,o,u,c,d,f,g,p,h=0,b=0){let k=this.attnUniform(o,u,c,d,f,g,p??1/Math.sqrt(d),h,b),F=this.storage(o*u*d*4);return this.attnDecodeOk&&o*u<256&&d<=128?this.recordPass(e,"attention_decode_q8kv",[k,t,n,s,i,a,F],[o*u,1,1]):this.attnPrefillOk&&d<=128?this.recordPass(e,"attention_prefill_q8kv",[k,t,n,s,i,a,F],[Math.ceil(o/4)*u,1,1]):this.recordPass(e,"attention_q8kv",[k,t,n,s,i,a,F],[Math.ceil(o*u/ae),1,1]),r.push(k,F),F}recAddBias(e,r,t,n,s,i){let a=this.uniform([s,i]),o=this.storage(s*i*4);return this.recordPass(e,"addbias",[a,t,n,o],this.grid1D(s*i)),r.push(a,o),o}recBinary(e,r,t,n,s,i){let a=this.storage(i*4);return this.recordPass(e,t,[n,s,a],this.grid1D(i)),r.push(a),a}recLfm2ShortConv(e,r,t,n,s,i,a){let o=this.uniform([i,a]),u=this.storage(i*4);return this.recordPass(e,"lfm2_shortconv",[o,t,s,n,u],this.grid1D(i)),r.push(o,u),u}recordLayerKV(e,r,t,n,s,i,a){let o=a.k,u=a.v,{seq:c,d,nHeads:f,nKvHeads:g,headDim:p,ffn:h,ropeTheta:b,eps:k}=n,F=g*p,M=i+c,S=s.matF16===!0,j=f*p,z=n.rmsGainOnePlus===!0,A=n.attnLogitSoftcap??0,w=n.act==="gelu"?"geglu":"swiglu",v=this.recRmsnorm(e,r,t,s.attnNorm,c,d,k,z),m=this.recMM(e,r,v,s.wq,c,d,j,S),_=this.recMM(e,r,v,s.wk,c,d,F,S),y=this.recMM(e,r,v,s.wv,c,d,F,S);s.bq&&(m=this.recAddBias(e,r,m,s.bq,c,j)),s.bk&&(_=this.recAddBias(e,r,_,s.bk,c,F)),s.bv&&(y=this.recAddBias(e,r,y,s.bv,c,F)),s.qNorm&&(m=this.recRmsnorm(e,r,m,s.qNorm,c*f,p,k,z)),s.kNorm&&(_=this.recRmsnorm(e,r,_,s.kNorm,c*g,p,k,z));let x=n._posGpu,P=n._ffGpu,q=n.ropeInterleaved===!0,B=(O,G,C)=>n.skipRope?O:x?this.recRopeMrope(e,r,O,x,G,p,C,b,n.mropeSections):P?this.recRopeFactors(e,r,O,P,G,p,C,i,b,q):this.recRope(e,r,O,G,p,C,i,b,q),T=B(m,c*f,f),D=B(_,c*g,g),E;if(a.kScale)this.recQuantizeKv(e,r,D,o,a.kScale,c,g,p,i),this.recQuantizeKv(e,r,y,u,a.vScale,c,g,p,i),E=this.recAttentionQ8(e,r,T,o,a.kScale,u,a.vScale,c,f,g,p,M,i,n.attnScale,A,n.window??0);else{let O=F*4;e.copyBufferToBuffer(D,0,o,i*O,c*O),e.copyBufferToBuffer(y,0,u,i*O,c*O),E=this.recAttention(e,r,T,o,u,c,f,g,p,M,i,n.attnScale,A,n.window??0)}let U=this.recMM(e,r,E,s.wo,c,j,d,S);s.postAttnNorm&&(U=this.recRmsnorm(e,r,U,s.postAttnNorm,c,d,k,z));let R=this.recBinary(e,r,"add",t,U,c*d),H=this.recRmsnorm(e,r,R,s.ffnNorm,c,d,k,z),Q=this.recMM(e,r,H,s.wgate,c,d,h,S),V=this.recMM(e,r,H,s.wup,c,d,h,S),I=this.recBinary(e,r,w,Q,V,c*h),X=this.recMM(e,r,I,s.wdown,c,h,d,S);return s.postFfnNorm&&(X=this.recRmsnorm(e,r,X,s.postFfnNorm,c,d,k,z)),this.recBinary(e,r,"add",R,X,c*d)}setKvQuant(e){this.kvQuant!==e&&(this.kvQuant=e,this.resetKvGpu())}resetKvGpu(){for(let e of this.kvGpu.values())e.k.destroy?.(),e.v.destroy?.(),e.kScale?.destroy?.(),e.vScale?.destroy?.();this.kvGpu.clear(),this.kvSession="";for(let e of this.bufferPool.values())for(let r of e)r.destroy?.();this.bufferPool.clear()}clearKvCache(){this.resetKvGpu()}ensureKv(e,r,t,n){let s=this.kvGpu.get(e);if(s&&s.cap>=r)return s;let i=Math.max(r,(s?.cap??0)+1024,1024),a=this.kvQuant,o=this.storage(i*t*(a?1:4)),u=this.storage(i*t*(a?1:4)),c=a?this.storage(i*n*4):void 0,d=a?this.storage(i*n*4):void 0;if(s){let g=this.device.createCommandEncoder();g.copyBufferToBuffer(s.k,0,o,0,s.cap*t*(a?1:4)),g.copyBufferToBuffer(s.v,0,u,0,s.cap*t*(a?1:4)),a&&s.kScale&&(g.copyBufferToBuffer(s.kScale,0,c,0,s.cap*n*4),g.copyBufferToBuffer(s.vScale,0,d,0,s.cap*n*4)),this.device.queue.submit([g.finish()]),s.k.destroy?.(),s.v.destroy?.(),s.kScale?.destroy?.(),s.vScale?.destroy?.()}let f={k:o,v:u,cap:i,kScale:c,vScale:d};return this.kvGpu.set(e,f),f}async runDecodeGpu(e,r,t,n,s,i){let{seq:a,d:o,nKvHeads:u,headDim:c,eps:d}=r,f=u*c,g=n+a;(i!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${i}" inconnue avec pastLen=${n} : cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=i);for(let S=0;S<t.length;S++)this.ensureKv(S,g,f,u);let p=[];this.preparePositions(r,p);let h=this.device.createCommandEncoder(),b=this.storage(e.byteLength);this.device.queue.writeBuffer(b,0,e),p.push(b);for(let S=0;S<t.length;S++){let j=this.kvGpu.get(S);b=this.recordLayerKV(h,p,b,Ot(r,a,S,this.swaOk),t[S],n,j)}let k=this.recRmsnorm(h,p,b,s,a,o,d,r.rmsGainOnePlus===!0),F=this.storage(o*4);h.copyBufferToBuffer(k,(a-1)*o*4,F,0,o*4),this.device.queue.submit([h.finish()]);let M=await this.readBack(F,o*4);return p.push(F),this.release(p),M}async decodeLogitsQ8(e,r,t,n,s,i,a,o){let u=globalThis,{seq:c,d,nKvHeads:f,headDim:g,eps:p}=r,h=f*g,b=n+c;(i!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${i}" inconnue avec pastLen=${n} : cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=i);for(let v=0;v<t.length;v++)this.ensureKv(v,b,h,f);let k=[];this.preparePositions(r,k);let F=this.device.createCommandEncoder(),M=this.storage(e.byteLength);this.device.queue.writeBuffer(M,0,e),k.push(M);for(let v=0;v<t.length;v++){let m=this.kvGpu.get(v);M=this.recordLayerKV(F,k,M,Ot(r,c,v,this.swaOk),t[v],n,m)}let S=this.recRmsnorm(F,k,M,s,c,d,p,r.rmsGainOnePlus===!0),j=this.storage(d*4);F.copyBufferToBuffer(S,(c-1)*d*4,j,0,d*4),k.push(j);let z=this.storage(o*4);k.push(z);for(let v of a){let m=this.recMM(F,k,j,v.w,1,d,v.rows,!1);F.copyBufferToBuffer(m,0,z,v.r0*4,v.rows*4)}let A=this.device.createBuffer({size:o*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});F.copyBufferToBuffer(z,0,A,0,o*4),this.device.queue.submit([F.finish()]),await A.mapAsync(u.GPUMapMode.READ);let w=new Float32Array(A.getMappedRange().slice(0));return A.unmap(),A.destroy(),this.release(k),w}async decodeTopKQ8(e,r,t,n,s,i,a,o,u,c,d,f=64){let g=globalThis,{seq:p,d:h,nKvHeads:b,headDim:k,eps:F}=r,M=b*k,S=n+p;(i!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${i}" inconnue avec pastLen=${n} : cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=i);for(let B=0;B<t.length;B++)this.ensureKv(B,S,M,b);let j=ee.timingOn?(B,T)=>console.info(`[timing:gpu] ${B} ${(performance.now()-T).toFixed(0)} ms`):null,z=performance.now(),A=[];this.preparePositions(r,A);let w=this.device.createCommandEncoder(),v=this.storage(e.byteLength);this.device.queue.writeBuffer(v,0,e),A.push(v);for(let B=0;B<t.length;B++){let T=this.kvGpu.get(B);v=this.recordLayerKV(w,A,v,Ot(r,p,B,this.swaOk),t[B],n,T)}let m=this.recRmsnorm(w,A,v,s,p,h,F,r.rmsGainOnePlus===!0),_=this.storage(h*4);w.copyBufferToBuffer(m,(p-1)*h*4,_,0,h*4),A.push(_);let y=this.storage(o*4);A.push(y);for(let B of a){let T=this.recMM(w,A,_,B.w,1,h,B.rows,!1);w.copyBufferToBuffer(T,0,y,B.r0*4,B.rows*4)}if(d&&d>0){let B=this.uniform([o],{offset:4,value:d});this.recordPass(w,"softcap_logits",[B,y],this.grid1D(o)),A.push(B)}if(c&&c!==1&&u.length){let B=Uint32Array.from(u),T=this.bufU32(B,g.GPUBufferUsage.STORAGE|g.GPUBufferUsage.COPY_DST),D=this.uniform([B.length],{offset:4,value:c});this.recordPass(w,"penalize_logits",[D,T,y],this.grid1D(B.length)),A.push(D,T)}let x=this.storage(f*2*4);A.push(x);{let B=this.uniform([o,f]);this.recordPass(w,this.topKParOk?"top_k_par":"top_k",[B,y,x],[1,1,1]),A.push(B)}let P=this.device.createBuffer({size:f*2*4,usage:g.GPUBufferUsage.COPY_DST|g.GPUBufferUsage.MAP_READ});w.copyBufferToBuffer(x,0,P,0,f*2*4),j?.("enregistrement des passes (compilation des pipelines incluse)",z),z=performance.now(),this.device.queue.submit([w.finish()]),await P.mapAsync(g.GPUMapMode.READ),j?.("execution GPU (submit + readback)",z);let q=new Uint32Array(P.getMappedRange().slice(0));return P.unmap(),P.destroy(),this.release(A),{ids:q.slice(0,f),vals:new Float32Array(q.buffer,f*4,f)}}resetLfm2State(){for(let e of this.lfm2KvGpu.values())e.k.destroy?.(),e.v.destroy?.();for(let e of this.lfm2ConvGpu.values())e.destroy?.();this.lfm2KvGpu.clear(),this.lfm2ConvGpu.clear(),this.lfm2Session="";for(let e of this.bufferPool.values())for(let r of e)r.destroy?.();this.bufferPool.clear()}clearLfm2State(){this.resetLfm2State()}ensureLfm2Kv(e,r,t){let n=this.lfm2KvGpu.get(e);if(n&&n.cap>=r)return n;let s=Math.max(r,(n?.cap??0)+1024,1024),i=this.storage(s*t*4),a=this.storage(s*t*4);if(n){let u=this.device.createCommandEncoder();u.copyBufferToBuffer(n.k,0,i,0,n.cap*t*4),u.copyBufferToBuffer(n.v,0,a,0,n.cap*t*4),this.device.queue.submit([u.finish()]),n.k.destroy?.(),n.v.destroy?.()}let o={k:i,v:a,cap:s};return this.lfm2KvGpu.set(e,o),o}ensureLfm2Conv(e,r){let t=this.lfm2ConvGpu.get(e);return t||(t=this.storage(r*4),this.device.queue.writeBuffer(t,0,new Float32Array(r)),this.lfm2ConvGpu.set(e,t)),t}recLfm2ShortConvBatch(e,r,t,n,s,i,a,o){let u=this.uniform([i,a,o]),c=this.storage(o*i*4);this.recordPass(e,"lfm2_shortconv_batch",[u,t,s,n,c],this.grid1D(o*i));let d=this.uniform([i,a,o]);return this.recordPass(e,"lfm2_shortconv_state",[d,t,n],this.grid1D((a-1)*i)),r.push(u,d,c),c}recordLfm2(e,r,t,n,s,i,a,o){let{D:u,nHeads:c,nKvHeads:d,headDim:f,ffn:g,eps:p,theta:h,lc:b}=s,k=d*f,F=c*f,M=k*4;for(let j=0;j<i.length;j++)i[j].conv?this.ensureLfm2Conv(j,(b-1)*u):this.ensureLfm2Kv(j,o+n,k);if(n>=b-1&&this.lfm2BatchOk){let j=this.storage(n*u*4);this.device.queue.writeBuffer(j,0,t),r.push(j);for(let A=0;A<i.length;A++){let w=i[A],v=this.recRmsnorm(e,r,j,w.attnNorm,n,u,p),m;if(w.conv){let B=this.recMM(e,r,v,w.inProj,n,u,3*u,!1),T=this.recLfm2ShortConvBatch(e,r,B,this.lfm2ConvGpu.get(A),w.convW,u,b,n);m=this.recMM(e,r,T,w.outProj,n,u,u,!1)}else{let B=this.recMM(e,r,v,w.wq,n,u,F,!1),T=this.recMM(e,r,v,w.wk,n,u,k,!1),D=this.recMM(e,r,v,w.wv,n,u,k,!1);B=this.recRmsnorm(e,r,B,w.qNorm,n*c,f,p),T=this.recRmsnorm(e,r,T,w.kNorm,n*d,f,p),B=this.recRope(e,r,B,n*c,f,c,o,h),T=this.recRope(e,r,T,n*d,f,d,o,h);let E=this.lfm2KvGpu.get(A);e.copyBufferToBuffer(T,0,E.k,o*M,n*M),e.copyBufferToBuffer(D,0,E.v,o*M,n*M);let U=this.recAttention(e,r,B,E.k,E.v,n,c,d,f,o+n,o);m=this.recMM(e,r,U,w.wo,n,F,u,!1)}j=this.recBinary(e,r,"add",j,m,n*u);let _=this.recRmsnorm(e,r,j,w.ffnNorm,n,u,p),y=this.recMM(e,r,_,w.wgate,n,u,g,!1),x=this.recMM(e,r,_,w.wup,n,u,g,!1),P=this.recBinary(e,r,"swiglu",y,x,n*g),q=this.recMM(e,r,P,w.wdown,n,g,u,!1);j=this.recBinary(e,r,"add",j,q,n*u)}let z=this.storage(u*4);return r.push(z),e.copyBufferToBuffer(j,(n-1)*u*4,z,0,u*4),this.recRmsnorm(e,r,z,a,1,u,p)}let S=null;for(let j=0;j<n;j++){let z=o+j,A=this.storage(u*4);this.device.queue.writeBuffer(A,0,t.subarray(j*u,(j+1)*u)),r.push(A);for(let w=0;w<i.length;w++){let v=i[w],m=this.recRmsnorm(e,r,A,v.attnNorm,1,u,p),_;if(v.conv){let T=this.recMM(e,r,m,v.inProj,1,u,3*u,!1),D=this.recLfm2ShortConv(e,r,T,this.lfm2ConvGpu.get(w),v.convW,u,b);_=this.recMM(e,r,D,v.outProj,1,u,u,!1)}else{let T=this.recMM(e,r,m,v.wq,1,u,F,!1),D=this.recMM(e,r,m,v.wk,1,u,k,!1),E=this.recMM(e,r,m,v.wv,1,u,k,!1);T=this.recRmsnorm(e,r,T,v.qNorm,c,f,p),D=this.recRmsnorm(e,r,D,v.kNorm,d,f,p),T=this.recRope(e,r,T,c,f,c,z,h),D=this.recRope(e,r,D,d,f,d,z,h);let U=this.lfm2KvGpu.get(w);e.copyBufferToBuffer(D,0,U.k,z*M,M),e.copyBufferToBuffer(E,0,U.v,z*M,M);let R=this.recAttention(e,r,T,U.k,U.v,1,c,d,f,z+1,z);_=this.recMM(e,r,R,v.wo,1,F,u,!1)}A=this.recBinary(e,r,"add",A,_,u);let y=this.recRmsnorm(e,r,A,v.ffnNorm,1,u,p),x=this.recMM(e,r,y,v.wgate,1,u,g,!1),P=this.recMM(e,r,y,v.wup,1,u,g,!1),q=this.recBinary(e,r,"swiglu",x,P,g),B=this.recMM(e,r,q,v.wdown,1,g,u,!1);A=this.recBinary(e,r,"add",A,B,u)}j===n-1&&(S=this.recRmsnorm(e,r,A,a,1,u,p))}return S}lfm2SessionReset(e,r){(e!==this.lfm2Session||r===0)&&(r>0&&console.error(`[lfm2] session "${e}" inconnue avec pastLen=${r} : \xE9tat perdu, sortie invalide. Repartir de pastLen 0.`),this.resetLfm2State(),this.lfm2Session=e)}async lfm2PrefillGpu(e,r,t,n,s,i,a){this.lfm2SessionReset(a,i);let o=[],u=this.device.createCommandEncoder();this.recordLfm2(u,o,e,r,t,n,s,i),this.device.queue.submit([u.finish()]),await this.device.queue.onSubmittedWorkDone(),this.release(o)}async lfm2LogitsGpu(e,r,t,n,s,i,a,o){let u=globalThis;this.lfm2SessionReset(o,a);let c=[],d=this.device.createCommandEncoder(),f=this.recordLfm2(d,c,e,r,t,n,i,a),g=this.recMM(d,c,f,s,1,t.D,t.vocab,!1),p=this.device.createBuffer({size:t.vocab*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});d.copyBufferToBuffer(g,0,p,0,t.vocab*4),this.device.queue.submit([d.finish()]),await p.mapAsync(u.GPUMapMode.READ);let h=new Float32Array(p.getMappedRange().slice(0));return p.unmap(),p.destroy(),this.release(c),h}async lfm2TopKGpu(e,r,t,n,s,i,a,o,u,c,d=64){let f=globalThis;this.lfm2SessionReset(o,a);let g=[],p=this.device.createCommandEncoder(),h=this.recordLfm2(p,g,e,r,t,n,i,a),b=this.recMM(p,g,h,s,1,t.D,t.vocab,!1);if(c&&c!==1&&u.length){let S=Uint32Array.from(u),j=this.bufU32(S,f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST),z=this.uniform([S.length],{offset:4,value:c});this.recordPass(p,"penalize_logits",[z,j,b],this.grid1D(S.length)),g.push(z,j)}let k=this.storage(d*2*4);g.push(k);{let S=this.uniform([t.vocab,d]);this.recordPass(p,this.topKParOk?"top_k_par":"top_k",[S,b,k],[1,1,1]),g.push(S)}let F=this.device.createBuffer({size:d*2*4,usage:f.GPUBufferUsage.COPY_DST|f.GPUBufferUsage.MAP_READ});p.copyBufferToBuffer(k,0,F,0,d*2*4),this.device.queue.submit([p.finish()]),await F.mapAsync(f.GPUMapMode.READ);let M=new Uint32Array(F.getMappedRange().slice(0));return F.unmap(),F.destroy(),this.release(g),{ids:M.slice(0,d),vals:new Float32Array(M.buffer,d*4,d)}}resetRwkvState(){for(let e of this.rwkvStateGpu.values())e.S.destroy?.(),e.tm.destroy?.(),e.cm.destroy?.();this.rwkvStateGpu.clear(),this.rwkvVFirst?.destroy?.(),this.rwkvVFirst=null,this.rwkvSession="";for(let e of this.bufferPool.values())for(let r of e)r.destroy?.();this.bufferPool.clear()}clearRwkvState(){this.resetRwkvState()}ensureRwkvState(e,r,t,n){let s=this.rwkvStateGpu.get(e);if(!s){let i=this.storage(t*n*n*4),a=this.storage(r*4),o=this.storage(r*4);this.device.queue.writeBuffer(i,0,new Float32Array(t*n*n)),this.device.queue.writeBuffer(a,0,new Float32Array(r)),this.device.queue.writeBuffer(o,0,new Float32Array(r)),s={S:i,tm:a,cm:o},this.rwkvStateGpu.set(e,s)}return s}rwkvSessionReset(e,r){(e!==this.rwkvSession||r===0)&&(r>0&&console.error(`[rwkv] session "${e}" inconnue avec pastLen=${r} : \xE9tat perdu, sortie invalide. Repartir de pastLen 0.`),this.resetRwkvState(),this.rwkvSession=e)}recRwkvToken(e,r,t,n,s,i){let{D:a,H:o,NH:u}=n,c=1e-5,d=64e-5;for(let f=0;f<s.length;f++){let g=s[f],p=this.rwkvStateGpu.get(f),h=this.recLayernorm(e,r,t,g.attnNormW,g.attnNormB,1,a,c),b=this.storage(6*a*4);{let C=this.uniform([a]);this.recordPass(e,"rwkv_token_shift",[C,h,p.tm,g.lerpFused,b],this.grid1D(6*a)),r.push(C,b)}e.copyBufferToBuffer(h,0,p.tm,0,a*4);let k=C=>{let L=this.storage(a*4);return e.copyBufferToBuffer(b,C*a*4,L,0,a*4),r.push(L),L},F=k(0),M=k(1),S=k(2),j=k(3),z=k(4),A=k(5),w=this.recMM(e,r,F,g.R,1,a,a,!1),v=this.recMM(e,r,S,g.K,1,a,a,!1),m=this.recMM(e,r,j,g.V,1,a,a,!1),_=this.recUnary(e,r,"tanh_act",this.recMM(e,r,M,g.w1,1,a,g.rw,!1),g.rw),y=this.recMM(e,r,_,g.w2,1,g.rw,a,!1),x=this.storage(a*4);this.recordPass(e,"rwkv_decay",[g.w0,y,x],this.grid1D(a)),r.push(x);let P=this.recMM(e,r,this.recMM(e,r,z,g.a1,1,a,g.ra,!1),g.a2,1,g.ra,a,!1),q=this.storage(a*4);this.recordPass(e,"rwkv_bias_sigmoid",[g.a0,P,q],this.grid1D(a)),r.push(q);let B=this.recUnary(e,r,"sigmoid",this.recMM(e,r,A,g.g1,1,a,g.rg,!1),g.rg),T=this.recMM(e,r,B,g.g2,1,g.rg,a,!1);if(f===0)e.copyBufferToBuffer(m,0,i,0,a*4);else{let C=this.recMM(e,r,this.recMM(e,r,j,g.v1,1,a,g.rv,!1),g.v2,1,g.rv,a,!1);this.recordPass(e,"rwkv_vresid",[m,i,g.v0,C],this.grid1D(a))}let D=this.storage(a*4),E=this.storage(a*4),U=this.storage(a*4);{let C=this.uniform([u,o]);this.recordPass(e,"rwkv_kprep",[C,v,q,g.kk,g.ka,D,E,U],this.grid1D(u)),r.push(C,D,E,U)}let R=this.storage(a*4);{let C=this.uniform([u,o]);this.recordPass(e,"rwkv_wkv7",[C,w,x,D,m,E,U,p.S,R],this.grid1D(u*o)),r.push(C,R)}let H=this.storage(a*4);{let C=this.uniform([u,o],{offset:8,value:d});this.recordPass(e,"rwkv_out_gn",[C,R,w,D,g.rk,m,g.lnWB,H],this.grid1D(u)),r.push(C,H)}let Q=this.recBinary(e,r,"mul",H,T,a),V=this.recMM(e,r,Q,g.O,1,a,a,!1);t=this.recBinary(e,r,"add",t,V,a);let I=this.recLayernorm(e,r,t,g.attnNorm2W,g.attnNorm2B,1,a,c),X=this.storage(a*4);this.recordPass(e,"rwkv_lerp",[I,p.cm,g.lerpK,X],this.grid1D(a)),r.push(X),e.copyBufferToBuffer(I,0,p.cm,0,a*4);let O=this.recUnary(e,r,"sqrelu",this.recMM(e,r,X,g.cmK,1,a,g.ffn,!1),g.ffn),G=this.recMM(e,r,O,g.cmV,1,g.ffn,a,!1);t=this.recBinary(e,r,"add",t,G,a)}return t}recordRwkv(e,r,t,n,s,i,a){let{D:o,H:u,NH:c}=s;for(let f=0;f<i.length;f++)this.ensureRwkvState(f,o,c,u);this.rwkvVFirst||(this.rwkvVFirst=this.storage(o*4));let d=null;for(let f=0;f<n;f++){let g=this.storage(o*4);this.device.queue.writeBuffer(g,0,t.subarray(f*o,(f+1)*o)),r.push(g);let p=this.recLayernorm(e,r,g,a.tokW,a.tokB,1,o,1e-5),h=this.recRwkvToken(e,r,p,s,i,this.rwkvVFirst);f===n-1&&(d=this.recLayernorm(e,r,h,a.outW,a.outB,1,o,1e-5))}return d}async rwkvPrefillGpu(e,r,t,n,s,i,a){this.rwkvSessionReset(a,i);let o=[],u=this.device.createCommandEncoder();this.recordRwkv(u,o,e,r,t,n,s),this.device.queue.submit([u.finish()]),await this.device.queue.onSubmittedWorkDone(),this.release(o)}async rwkvLogitsGpu(e,r,t,n,s,i,a,o){let u=globalThis;this.rwkvSessionReset(o,a);let c=[],d=this.device.createCommandEncoder(),f=this.recordRwkv(d,c,e,r,t,n,i),g=this.recMM(d,c,f,s,1,t.D,t.vocab,!1),p=this.device.createBuffer({size:t.vocab*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});d.copyBufferToBuffer(g,0,p,0,t.vocab*4),this.device.queue.submit([d.finish()]),await p.mapAsync(u.GPUMapMode.READ);let h=new Float32Array(p.getMappedRange().slice(0));return p.unmap(),p.destroy(),this.release(c),h}async rwkvTopKGpu(e,r,t,n,s,i,a,o,u,c,d=64){let f=globalThis;this.rwkvSessionReset(o,a);let g=[],p=this.device.createCommandEncoder(),h=this.recordRwkv(p,g,e,r,t,n,i),b=this.recMM(p,g,h,s,1,t.D,t.vocab,!1);if(c&&c!==1&&u.length){let S=Uint32Array.from(u),j=this.bufU32(S,f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST),z=this.uniform([S.length],{offset:4,value:c});this.recordPass(p,"penalize_logits",[z,j,b],this.grid1D(S.length)),g.push(z,j)}let k=this.storage(d*2*4);g.push(k);{let S=this.uniform([t.vocab,d]);this.recordPass(p,this.topKParOk?"top_k_par":"top_k",[S,b,k],[1,1,1]),g.push(S)}let F=this.device.createBuffer({size:d*2*4,usage:f.GPUBufferUsage.COPY_DST|f.GPUBufferUsage.MAP_READ});p.copyBufferToBuffer(k,0,F,0,d*2*4),this.device.queue.submit([p.finish()]),await F.mapAsync(f.GPUMapMode.READ);let M=new Uint32Array(F.getMappedRange().slice(0));return F.unmap(),F.destroy(),this.release(g),{ids:M.slice(0,d),vals:new Float32Array(M.buffer,d*4,d)}}async argmaxProjection(e,r,t,n,s=!1){let i=globalThis,a=[],o=this.device.createCommandEncoder(),u=this.storage(e.byteLength);this.device.queue.writeBuffer(u,0,e),a.push(u);let c=this.storage(n*4);a.push(c);for(let h of r){let b=this.recMatmulT(o,a,u,h.buf,1,t,h.rows,s);o.copyBufferToBuffer(b,0,c,h.r0*4,h.rows*4)}let d=this.storage(4),f=this.uniform([n]);a.push(d,f),this.recordPass(o,"argmax",[f,c,d],[1,1,1]);let g=this.device.createBuffer({size:4,usage:i.GPUBufferUsage.COPY_DST|i.GPUBufferUsage.MAP_READ});o.copyBufferToBuffer(d,0,g,0,4),this.device.queue.submit([o.finish()]),await g.mapAsync(i.GPUMapMode.READ);let p=new Uint32Array(g.getMappedRange().slice(0))[0];return g.unmap(),g.destroy(),this.release(a),p}async projectLogits(e,r,t,n,s=!1){let i=globalThis,a=[],o=this.device.createCommandEncoder(),u=this.storage(e.byteLength);this.device.queue.writeBuffer(u,0,e),a.push(u);let c=this.storage(n*4);a.push(c);for(let g of r){let p=this.recMatmulT(o,a,u,g.buf,1,t,g.rows,s);o.copyBufferToBuffer(p,0,c,g.r0*4,g.rows*4)}let d=this.device.createBuffer({size:n*4,usage:i.GPUBufferUsage.COPY_DST|i.GPUBufferUsage.MAP_READ});o.copyBufferToBuffer(c,0,d,0,n*4),this.device.queue.submit([o.finish()]),await d.mapAsync(i.GPUMapMode.READ);let f=new Float32Array(d.getMappedRange().slice(0));return d.unmap(),d.destroy(),this.release(a),f}async selfValidate(){this.validationFailure=null;let e=A=>(this.validationFailure=A,console.error("[selfValidate] FAILED at:",A,"(hasF16="+this.hasF16+")"),!1),r=(A,w)=>A.length===w.length&&A.every((v,m)=>Math.abs(v-w[m])<.001),t=A=>Float32Array.from({length:A},()=>Math.random()*2-1),n=3,s=4,i=5,a=t(n*s),o=t(s*i),u=new Float32Array(n*i);for(let A=0;A<n;A++)for(let w=0;w<i;w++){let v=0;for(let m=0;m<s;m++)v+=a[A*s+m]*o[m*i+w];u[A*i+w]=v}if(!r(await this.matmul(a,o,n,s,i),u))return e("matmul");{let A=(v,m,_,y,x)=>{let P=new Float32Array(_*x);for(let q=0;q<_;q++)for(let B=0;B<x;B++){let T=0;for(let D=0;D<y;D++)T+=v[q*y+D]*m[B*y+D];P[q*x+B]=T}return P},w=async(v,m,_)=>{let y=t(v*m),x=t(_*m);return r(await this.matmulT(y,x,v,m,_),A(y,x,v,m,_))};if(!await w(3,8,5))return e("matmulT.vec4(3,8,5)");if(!await w(1,16,7))return e("matmulT.vec4(1,16,7)");if(!await w(2,6,4))return e("matmulT.scalar(2,6,4)");if(this.hasF16){let y=t(16),x=t(112),P=this.uploadGpuF16(x),q=await this.matmulT(y,P,1,16,7,!0),B=new Float32Array(7);for(let R=0;R<7;R++){let H=0;for(let Q=0;Q<16;Q++)H+=y[Q]*x[R*16+Q];B[R]=H}P.destroy?.();let T=R=>R.length===B.length&&R.every((H,Q)=>Math.abs(H-B[Q])<=.03*(1+Math.abs(B[Q])));if(!T(q))return e("matmulT.f16");let D=this.uploadGpu(x),E=this.f32ToF16Gpu(D,112),U=await this.matmulT(y,E,1,16,7,!0);if(D.destroy?.(),E.destroy?.(),!T(U))return e("packf16")}if(this.hasF16&&this.f16SharedOk){let v=[{m:20,k:128,n:18},{m:32,k:64,n:64},{m:70,k:40,n:130},{m:33,k:48,n:7}];for(let m of v){let _=t(m.m*m.k),y=t(m.n*m.k),x=this.uploadGpuF16(y),P=await this.matmulT(_,x,m.m,m.k,m.n,!0);this.f16SharedOk=!1;let q=await this.matmulT(_,x,m.m,m.k,m.n,!0);if(this.f16SharedOk=!0,x.destroy?.(),!(P.length===q.length&&P.every((T,D)=>Math.abs(T-q[D])<=.001*(1+Math.abs(q[D]))))){this.f16SharedOk=!1,console.warn(`[selfValidate] matmul_t_f16w_shared KO sur ce GPU (m=${m.m}, k=${m.k}, n=${m.n}) : repli sur matmul_t_f16w (plus lent, m\xEAme r\xE9sultat).`);break}}}}{let m=t(128),_=t(768),y=xe(_),x=this.uploadGpuRaw(y.nibbles),P=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),q=this.uploadGpuRaw(new Uint8Array(y.mins.buffer,y.mins.byteOffset,y.mins.byteLength)),B=await this.matmulQ4(m,x,P,q,1,128,6),T=ge(y),D=new Float32Array(6);for(let Q=0;Q<6;Q++){let V=0;for(let I=0;I<128;I++)V+=m[I]*T[Q*128+I];D[Q]=V}if(x.destroy?.(),P.destroy?.(),q.destroy?.(),!r(B,D))return e("matmulQ4");let E=this.uploadGpu(_),U=this.f32ToQ4Gpu(E,768),R=await this.matmulQ4(m,U.nib,U.sc,U.mn,1,128,6);if(E.destroy?.(),U.nib.destroy?.(),U.sc.destroy?.(),U.mn.destroy?.(),!(R.length===D.length&&R.every((Q,V)=>Math.abs(Q-D[V])<=.06*(1+Math.abs(D[V]))+.02)))return e("quantize_q4")}{let m=t(640),_=t(768),y=Br(_),x=this.uploadGpuRaw(new Uint8Array(y.lo.buffer,y.lo.byteOffset,y.lo.byteLength)),P=this.uploadGpuRaw(new Uint8Array(y.hi.buffer,y.hi.byteOffset,y.hi.byteLength)),q=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),B=this.uploadGpuRaw(new Uint8Array(y.mins.buffer,y.mins.byteOffset,y.mins.byteLength)),T=await this.matmulQ3(m,x,P,q,B,5,128,6),D=Oe(y),E=new Float32Array(30);for(let U=0;U<5;U++)for(let R=0;R<6;R++){let H=0;for(let Q=0;Q<128;Q++)H+=m[U*128+Q]*D[R*128+Q];E[U*6+R]=H}if(x.destroy?.(),P.destroy?.(),q.destroy?.(),B.destroy?.(),!r(T,E))return e("matmulQ3")}{let m=t(640),_=t(768),y=xe(_),x=this.uploadGpuRaw(y.nibbles),P=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),q=this.uploadGpuRaw(new Uint8Array(y.mins.buffer,y.mins.byteOffset,y.mins.byteLength)),B=await this.matmulQ4Tiled(m,x,P,q,5,128,6),T=ge(y),D=new Float32Array(30);for(let E=0;E<5;E++)for(let U=0;U<6;U++){let R=0;for(let H=0;H<128;H++)R+=m[E*128+H]*T[U*128+H];D[E*6+U]=R}if(x.destroy?.(),P.destroy?.(),q.destroy?.(),!r(B,D))return e("matmul_q4_tiled")}for(let A of[{m:20,n:18},{m:32,n:64},{m:70,n:130}]){let w=A.m,v=128,m=A.n,_=t(w*v),y=t(m*v),x=xe(y),P=this.uploadGpuRaw(x.nibbles),q=this.uploadGpuRaw(new Uint8Array(x.scales.buffer,x.scales.byteOffset,x.scales.byteLength)),B=this.uploadGpuRaw(new Uint8Array(x.mins.buffer,x.mins.byteOffset,x.mins.byteLength)),T=await this.matmulQ4Shared(_,P,q,B,w,v,m),D=ge(x),E=new Float32Array(w*m);for(let U=0;U<w;U++)for(let R=0;R<m;R++){let H=0;for(let Q=0;Q<v;Q++)H+=_[U*v+Q]*D[R*v+Q];E[U*m+R]=H}if(P.destroy?.(),q.destroy?.(),B.destroy?.(),!r(T,E))return e(`matmul_q4_shared(${w},${m})`)}{let m=t(128),_=t(768),y=Ue(_),x=this.uploadGpuRaw(new Uint8Array(y.codes.buffer,y.codes.byteOffset,y.codes.byteLength)),P=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),q=await this.matmulQ8(m,x,P,1,128,6),B=he(y),T=new Float32Array(6);for(let R=0;R<6;R++){let H=0;for(let Q=0;Q<128;Q++)H+=m[Q]*B[R*128+Q];T[R]=H}if(x.destroy?.(),P.destroy?.(),!r(q,T))return e("matmulQ8");let D=this.uploadGpu(_),E=this.f32ToQ8Gpu(D,768),U=await this.matmulQ8(m,E.codes,E.sc,1,128,6);if(D.destroy?.(),E.codes.destroy?.(),E.sc.destroy?.(),!r(U,T))return e("quantize_q8")}{let m=t(640),_=t(768),y=Ue(_),x=this.uploadGpuRaw(new Uint8Array(y.codes.buffer,y.codes.byteOffset,y.codes.byteLength)),P=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),q=await this.matmulQ8Tiled(m,x,P,5,128,6),B=he(y),T=new Float32Array(30);for(let D=0;D<5;D++)for(let E=0;E<6;E++){let U=0;for(let R=0;R<128;R++)U+=m[D*128+R]*B[E*128+R];T[D*6+E]=U}if(x.destroy?.(),P.destroy?.(),!r(q,T))return e("matmul_q8_tiled")}for(let A of[{k:128,n:6},{k:128,n:130},{k:4096,n:17}]){let w=A.k,v=A.n,m=t(w),_=t(v*w),y=xe(_),x=this.uploadGpuRaw(y.nibbles),P=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),q=this.uploadGpuRaw(new Uint8Array(y.mins.buffer,y.mins.byteOffset,y.mins.byteLength)),B=await this.matmulQ4Vec(m,x,P,q,w,v),T=ge(y),D=new Float32Array(v);for(let I=0;I<v;I++){let X=0;for(let O=0;O<w;O++)X+=m[O]*T[I*w+O];D[I]=X}if(x.destroy?.(),P.destroy?.(),q.destroy?.(),!r(B,D))return e(`matmul_q4_vec(${w},${v})`);let E=Ue(_),U=this.uploadGpuRaw(new Uint8Array(E.codes.buffer,E.codes.byteOffset,E.codes.byteLength)),R=this.uploadGpuRaw(new Uint8Array(E.scales.buffer,E.scales.byteOffset,E.scales.byteLength)),H=await this.matmulQ8Vec(m,U,R,w,v),Q=he(E),V=new Float32Array(v);for(let I=0;I<v;I++){let X=0;for(let O=0;O<w;O++)X+=m[O]*Q[I*w+O];V[I]=X}if(U.destroy?.(),R.destroy?.(),!r(H,V))return e(`matmul_q8_vec(${w},${v})`)}for(let A of[{m:20,n:18},{m:32,n:64},{m:70,n:130}]){let w=A.m,v=128,m=A.n,_=t(w*v),y=t(m*v),x=Ue(y),P=this.uploadGpuRaw(new Uint8Array(x.codes.buffer,x.codes.byteOffset,x.codes.byteLength)),q=this.uploadGpuRaw(new Uint8Array(x.scales.buffer,x.scales.byteOffset,x.scales.byteLength)),B=await this.matmulQ8Shared(_,P,q,w,v,m),T=he(x),D=new Float32Array(w*m);for(let E=0;E<w;E++)for(let U=0;U<m;U++){let R=0;for(let H=0;H<v;H++)R+=_[E*v+H]*T[U*v+H];D[E*m+U]=R}if(P.destroy?.(),q.destroy?.(),!r(B,D))return e(`matmul_q8_shared(${w},${m})`)}if(this.qShared2Ok){let A=[{m:64,k:128,n:128},{m:65,k:128,n:130},{m:100,k:160,n:18},{m:70,k:96,n:200}];for(let w of A){let v=w.m,m=w.k,_=w.n,y=t(v*m),x=t(_*m),P=new Float32Array(v*_),q=Ue(x),B=he(q);for(let O=0;O<v;O++)for(let G=0;G<_;G++){let C=0;for(let L=0;L<m;L++)C+=y[O*m+L]*B[G*m+L];P[O*_+G]=C}let T=this.uploadGpuRaw(new Uint8Array(q.codes.buffer,q.codes.byteOffset,q.codes.byteLength)),D=this.uploadGpuRaw(new Uint8Array(q.scales.buffer,q.scales.byteOffset,q.scales.byteLength)),E=await this.matmulQ8Shared2(y,T,D,v,m,_);T.destroy?.(),D.destroy?.();let U=xe(x),R=ge(U),H=new Float32Array(v*_);for(let O=0;O<v;O++)for(let G=0;G<_;G++){let C=0;for(let L=0;L<m;L++)C+=y[O*m+L]*R[G*m+L];H[O*_+G]=C}let Q=this.uploadGpuRaw(U.nibbles),V=this.uploadGpuRaw(new Uint8Array(U.scales.buffer,U.scales.byteOffset,U.scales.byteLength)),I=this.uploadGpuRaw(new Uint8Array(U.mins.buffer,U.mins.byteOffset,U.mins.byteLength)),X=await this.matmulQ4Shared2(y,Q,V,I,v,m,_);if(Q.destroy?.(),V.destroy?.(),I.destroy?.(),!r(E,P)||!r(X,H)){this.qShared2Ok=!1,console.warn(`[selfValidate] matmul_t_q8/q4_shared2 KO sur ce GPU (m=${v}, k=${m}, n=${_}) : repli sur les tuiles 32\xD764 v1 (plus lentes, m\xEAme r\xE9sultat).`);break}}}{let w=t(1632),v=new Uint8Array(w.buffer,w.byteOffset,w.byteLength),m=(_,y)=>_.length===y.length&&_.every((x,P)=>x===y[P]);if(!m(await this.quantizeToBytes("F32",v,1632,"q8"),await this.quantizeToBytes("F32",v,1632,"q8",256)))return e("quantize_chunk_q8");if(!m(await this.quantizeToBytes("F32",v,1632,"q4"),await this.quantizeToBytes("F32",v,1632,"q4",256)))return e("quantize_chunk_q4")}let c=2,d=8,f=t(c*d),g=t(d),p=new Float32Array(c*d);for(let A=0;A<c;A++){let w=0;for(let m=0;m<d;m++)w+=f[A*d+m]**2;let v=1/Math.sqrt(w/d+1e-5);for(let m=0;m<d;m++)p[A*d+m]=f[A*d+m]*v*g[m]}if(!r(await this.rmsnorm(f,g,c,d),p))return e("rmsnorm");if(!r(await this.rmsnorm(f,g,c,d,1e-5,!0),Me(f,g,c,d,1e-5,!0)))return e("rmsnorm.onePlus");let h=t(16),b=t(16),k=h.map((A,w)=>A/(1+Math.exp(-A))*b[w]);if(!r(await this.swiglu(h,b),k))return e("swiglu");let F=h.map((A,w)=>Cr(A)*b[w]);if(!r(await this.geglu(h,b),F))return e("geglu");let M=h.map((A,w)=>A+b[w]);if(!r(await this.add(h,b),M))return e("add");{let A=ee.MAX_WG_DIM*ae+257,w=new Float32Array(A),v=new Float32Array(A),m=[0,1,ae-1,ae,ee.MAX_WG_DIM*ae-1,ee.MAX_WG_DIM*ae,A-1];for(let x of m)w[x]=x%7-3,v[x]=x%5-2;let _=await this.add(w,v),y=_.length===A;for(let x of m)Math.abs(_[x]-(w[x]+v[x]))>1e-5&&(y=!1);if(!y)return e("grid1D.add(2D)")}let S=(A,w,v=.003)=>A.length===w.length&&A.every((m,_)=>Math.abs(m-w[_])<=v*(1+Math.abs(w[_])));{let y=t(8);if(!S(await this.rope(y,2,4,2,1,1e4),Ne(y,2,4,2,1,1e4)))return e("rope")}{let y=t(384),x=new Float32Array(64/2).fill(1);if(!S(await this.ropeFactors(y,x,6,64,2,7,5e5),Ne(y,6,64,2,7,5e5)))return e("rope_factors.ones");let P=Float32Array.from({length:64/2},(q,B)=>1+B%5*.7);if(!S(await this.ropeFactors(y,P,6,64,2,7,5e5),ts(y,P,6,64,2,7,5e5)))return e("rope_factors")}{let y=t(384);if(!S(await this.rope(y,6,64,2,7,5e5,!0),ct(y,6,64,2,7,5e5)))return e("rope.interleaved");let x=t(8);if(!S(await this.rope(x,2,4,2,3,1e4,!0),ct(x,2,4,2,3,1e4)))return e("rope.interleaved.hd4");let P=t(384);if(!S(await this.rope(P,6,64,2,0,5e5,!0),ct(P,6,64,2,0,5e5)))return e("rope.interleaved.pos0");let q=64/2,B=new Float32Array(384);for(let R=0;R<6;R++)for(let H=0;H<q;H++)B[R*64+2*H]=y[R*64+H],B[R*64+2*H+1]=y[R*64+H+q];let T=await this.rope(B,6,64,2,7,5e5,!0),D=await this.rope(y,6,64,2,7,5e5,!1),E=new Float32Array(384);for(let R=0;R<6;R++)for(let H=0;H<q;H++)E[R*64+2*H]=D[R*64+H],E[R*64+2*H+1]=D[R*64+H+q];if(!S(T,E))return e("rope.interleaved.equivalence");let U=Float32Array.from({length:q},(R,H)=>1+H%5*.7);if(!S(await this.ropeFactors(y,U,6,64,2,7,5e5,!0),ct(y,6,64,2,7,5e5,U)))return e("rope_factors.interleaved")}{let v=[16,24,24],m=1e6,_=3,y=_*2,x=5,P=t(y*128),q=new Uint32Array(_*3);for(let E=0;E<_;E++){let U=x+E;q.set([U,U,U],E*3)}let B=new Uint32Array([5,5,5,5,6,9,5,7,5]),T=S(await this.ropeMrope(P,q,y,128,2,v,m),Ne(P,y,128,2,x,m)),D=S(await this.ropeMrope(P,B,y,128,2,v,m),es(P,B,y,128,2,v,m));(!T||!D)&&(this.mropeOk=!1,console.error(`[selfValidate] rope_mrope KO sur ce GPU (${T?"positions 3D":"d\xE9g\xE9n\xE9r\xE9\u2260rope"}). Vision d\xE9sactiv\xE9e, chat texte intact.`))}{let x=t(32),P=t(32),q=t(32);if(!S(await this.attention(x,P,q,2,4,2,4,2),ye(x,P,q,2,4,2,4,2)))return e("attention");let B=.3,T=5;if(!S(await this.attention(x,P,q,2,4,2,4,2,B,T),ye(x,P,q,2,4,2,4,2,B,T)))return e("attention.softcap");{let V=t(24),I=t(48),X=t(48);for(let O of[1,4,8,64]){if(!S(await this.attention(V,I,X,3,2,1,4,9,void 0,0,O),ye(V,I,X,3,2,1,4,9,void 0,0,O)))return e(`attention.window(${O})`);if(!S(await this.attentionDecode(V,I,X,3,2,1,4,9,void 0,0,O),ye(V,I,X,3,2,1,4,9,void 0,0,O)))return e(`attention_decode.window(${O})`)}}{let D=await this.quantizeKvReadback(P,4,2,4),E=await this.quantizeKvReadback(q,4,2,4),U=await this.attentionQ8Kv(x,D.codes,D.scales,E.codes,E.scales,2,4,2,4,2),R=(X,O)=>{let G=new Float32Array(32);for(let C=0;C<4;C++)for(let L=0;L<2;L++){let N=O[C*2+L];for(let $=0;$<4;$++){let W=C*2*4+L*4+$,K=X[W>>2]>>(W&3)*8&255;G[W]=(K<128?K:K-256)*N}}return G},H=R(D.codes,D.scales),Q=R(E.codes,E.scales),V=ye(x,H,Q,2,4,2,4,2);if(!S(U,V,.005))return e("attention.q8kv");let I=0;for(let X=0;X<P.length;X++)I=Math.max(I,Math.abs(H[X]-P[X]));if(I>.05)return e("quantize_kv.error")}}{let A=v=>{this.attnDecodeOk=!1,console.error("[selfValidate] attention d\xE9codage HS sur ce GPU (\xE9tape :",v,") \u2192 repli kernels classiques (plus lents \xE0 contexte long, corrects)")},w=[{nT:1,nH:14,nKv:2,hd:64,past:300},{nT:10,nH:14,nKv:2,hd:64,past:173}];for(let v of w){if(!this.attnDecodeOk)break;let m=v.past+v.nT,_=t(v.nT*v.nH*v.hd),y=t(m*v.nKv*v.hd),x=t(m*v.nKv*v.hd);if(!S(await this.attentionDecode(_,y,x,v.nT,v.nH,v.nKv,v.hd,v.past),ye(_,y,x,v.nT,v.nH,v.nKv,v.hd,v.past))){A(`decode(nT=${v.nT})`);break}let P=await this.quantizeKvReadback(y,m,v.nKv,v.hd),q=await this.quantizeKvReadback(x,m,v.nKv,v.hd),B=await this.attentionQ8KvDecode(_,P.codes,P.scales,q.codes,q.scales,v.nT,v.nH,v.nKv,v.hd,v.past),T=await this.attentionQ8Kv(_,P.codes,P.scales,q.codes,q.scales,v.nT,v.nH,v.nKv,v.hd,v.past);if(!S(B,T,.005)){A(`decode.q8kv(nT=${v.nT})`);break}}if(this.attnDecodeOk){let P=t(64),q=t(350*8),B=t(350*8);S(await this.attentionDecode(P,q,B,2,4,2,8,173,.3,5),ye(P,q,B,2,4,2,8,173,.3,5))||A("decode.softcap")}if(this.attnDecodeOk){let P=t(256),q=t(9088),B=t(9088);S(await this.attentionDecode(P,q,B,1,2,1,128,70),ye(P,q,B,1,2,1,128,70))||A("decode.hd128")}}{let A=m=>{this.attnPrefillOk=!1,console.error("[selfValidate] attention prefill tuil\xE9e HS sur ce GPU (\xE9tape :",m,") \u2192 repli kernel classique (plus lent en prefill, correct)")},w=[{nT:37,nH:14,nKv:2,hd:64,past:0,sc:void 0,cap:0,win:0},{nT:13,nH:14,nKv:2,hd:64,past:173,sc:void 0,cap:0,win:0},{nT:1,nH:14,nKv:2,hd:64,past:300,sc:void 0,cap:0,win:0},{nT:4,nH:4,nKv:2,hd:32,past:7,sc:void 0,cap:0,win:0},{nT:5,nH:4,nKv:2,hd:32,past:0,sc:void 0,cap:0,win:0},{nT:9,nH:2,nKv:1,hd:128,past:70,sc:void 0,cap:0,win:0},{nT:6,nH:4,nKv:2,hd:8,past:17,sc:.3,cap:5,win:0}];for(let m of w){let _=m.past+m.nT,y=t(m.nT*m.nH*m.hd),x=t(_*m.nKv*m.hd),P=t(_*m.nKv*m.hd);if(!S(await this.attentionPrefill(y,x,P,m.nT,m.nH,m.nKv,m.hd,m.past,m.sc,m.cap,m.win),ye(y,x,P,m.nT,m.nH,m.nKv,m.hd,m.past,m.sc,m.cap,m.win))){A(`prefill(nT=${m.nT},hd=${m.hd},past=${m.past}${m.cap>0?",softcap":""})`);break}}if(this.attnPrefillOk){let B=t(80),T=t(76),D=t(76);for(let E of[1,4,8,64])if(!S(await this.attentionPrefill(B,T,D,10,2,1,4,9,void 0,0,E),ye(B,T,D,10,2,1,4,9,void 0,0,E))){A(`prefill.window(${E})`);break}}let v=[{nT:37,nH:14,nKv:2,hd:64,past:0,win:0},{nT:13,nH:14,nKv:2,hd:64,past:173,win:0},{nT:10,nH:2,nKv:1,hd:8,past:9,win:4}];for(let m of v){if(!this.attnPrefillOk)break;let _=m.past+m.nT,y=t(m.nT*m.nH*m.hd),x=t(_*m.nKv*m.hd),P=t(_*m.nKv*m.hd),q=await this.quantizeKvReadback(x,_,m.nKv,m.hd),B=await this.quantizeKvReadback(P,_,m.nKv,m.hd),T=await this.attentionQ8KvPrefill(y,q.codes,q.scales,B.codes,B.scales,m.nT,m.nH,m.nKv,m.hd,m.past,void 0,0,m.win),D=await this.attentionQ8Kv(y,q.codes,q.scales,B.codes,B.scales,m.nT,m.nH,m.nKv,m.hd,m.past,void 0,0,m.win);if(!S(T,D,.005)){A(`prefill.q8kv(nT=${m.nT},win=${m.win})`);break}}}{let A=v=>{this.rmsVecOk=!1,console.error("[selfValidate] RMSNorm parall\xE8le HS sur ce GPU (\xE9tape :",v,") \u2192 repli kernel une-ligne-par-thread (correct, plus lent en d\xE9codage)")},w=[{rows:1,dim:1024,onePlus:!1},{rows:1,dim:1536,onePlus:!1},{rows:1,dim:100,onePlus:!1},{rows:14,dim:64,onePlus:!1},{rows:37,dim:2048,onePlus:!1},{rows:3,dim:128,onePlus:!0}];for(let v of w){let m=t(v.rows*v.dim),_=t(v.dim),y=await this.rmsnormVec(m,_,v.rows,v.dim,1e-6,v.onePlus),x=await this.rmsnorm(m,_,v.rows,v.dim,1e-6,v.onePlus);if(!S(y,x,.005)){A(`rmsnorm_vec(${v.rows}\xD7${v.dim}${v.onePlus?",1+w":""})`);break}}}{let A=v=>{this.topKParOk=!1,console.error("[selfValidate] top-K parall\xE8le HS sur ce GPU (\xE9tape :",v,") \u2192 repli s\xE9lection sur un thread (correcte, plus lente)")},w=[{n:151936,k:64,ties:!1,label:"vocab Qwen (151936)"},{n:65536,k:64,ties:!1,label:"vocab World (65536)"},{n:1e3,k:64,ties:!1,label:"n non multiple de 128"},{n:300,k:64,ties:!1,label:"n < 1024 candidats"},{n:4096,k:8,ties:!1,label:"petit K"},{n:8192,k:64,ties:!0,label:"EX \xC6QUO (d\xE9partage)"}];for(let v of w){if(!this.topKParOk)break;let m=v.ties?Float32Array.from({length:v.n},(P,q)=>Math.round(Math.random()*6)+(q%7===0?3:0)):t(v.n),_=await this.topKReadback(m,v.k,"top_k"),y=await this.topKReadback(m,v.k,"top_k_par");if(!(_.length===y.length&&_.every((P,q)=>P===y[q]))){let P=_.findIndex((q,B)=>q!==y[B]);A(`top_k_par(${v.label}). Premier \xE9cart au rang ${P} : ${_[P]} vs ${y[P]}`);break}}}{let P={seq:3,d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},q={attnNorm:t(16),wq:t(256),wk:t(128),wv:t(128),wo:t(256),bq:t(16),bk:t(8),bv:t(8),ffnNorm:t(16),wgate:t(256),wup:t(256),wdown:t(256)},B=t(48);if(!S(await this.layerForward(B,P,q),Mt(B,P,q),.005))return e("layerForward")}{let q={seq:3,d:12,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6,attnScale:1/Math.sqrt(4),attnLogitSoftcap:5,act:"gelu",rmsGainOnePlus:!0},B={attnNorm:t(12),wq:t(192),wk:t(96),wv:t(96),wo:t(192),ffnNorm:t(12),wgate:t(192),wup:t(192),wdown:t(192),postAttnNorm:t(12),postFfnNorm:t(12)},T=t(36);if(!S(await this.layerForward(T,q,B),Mt(T,q,B),.005))return e("layerForward.gemma2")}{let q={seq:3,d:12,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e6,eps:1e-6},B={attnNorm:t(12),wq:t(192),wk:t(96),wv:t(96),wo:t(192),ffnNorm:t(12),wgate:t(192),wup:t(192),wdown:t(192),qNorm:t(4),kNorm:t(4)},T=t(36);if(!S(await this.layerForward(T,q,B),Mt(T,q,B),.005))return e("layerForward.qwen3")}{let w=new Uint8Array(720);for(let m=0;m<5;m++){let _=m*144,y=new DataView(w.buffer);y.setUint16(_,Re(.005+Math.random()*.05),!0),y.setUint16(_+2,Re(.001+Math.random()*.02),!0);for(let x=4;x<144;x++)w[_+x]=Math.random()*256|0}let v=await this.dequantizeQ4K(w,5*256);if(!S(v,In(w,5),1e-4))return e("dequant.Q4_K")}{let A=B=>{let T=new Uint8Array(B);for(let D=0;D<B;D++)T[D]=Math.random()*256|0;return T},w=(B,T)=>{let D=new DataView(B.buffer),E=U=>T===210?U*210+208:U*T;for(let U=0;U*T<B.length;U++)D.setUint16(E(U),Re(.005+Math.random()*.05),!0);return B},m=w(A(136),34);if(!S(await this.dequantizeByType("Q8_0",m,128),Vn(m,4),1e-4))return e("dequant.Q8_0");let _=w(A(88),22);if(!S(await this.dequantizeByType("Q5_0",_,128),Yn(_,4),1e-4))return e("dequant.Q5_0");let y=w(A(840),210);if(!S(await this.dequantizeByType("Q6_K",y,4*256),Zn(y,4),1e-4))return e("dequant.Q6_K");let x=w(A(72),18);if(!S(await this.dequantizeByType("Q4_0",x,128),Xn(x,4),1e-4))return e("dequant.Q4_0");let P=A(704),q=new DataView(P.buffer);for(let B=0;B<4;B++)q.setUint16(B*176,Re(.005+Math.random()*.05),!0),q.setUint16(B*176+2,Re(.001+Math.random()*.02),!0);if(!S(await this.dequantizeByType("Q5_K",P,4*256),Jn(P,4),1e-4))return e("dequant.Q5_K")}{let x={d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},P={attnNorm:t(16),wq:t(256),wk:t(128),wv:t(128),wo:t(256),bq:t(16),bk:t(8),bv:t(8),ffnNorm:t(16),wgate:t(256),wup:t(256),wdown:t(256)},q=t(48),T=(await this.layerForward(q,{...x,seq:3},P)).slice(32,48),D=new Float32Array(0),E=await this.layerForwardKV(q.slice(0,32),{...x,seq:2},P,0,D,D),U=await this.layerForwardKV(q.slice(32,48),{...x,seq:1},P,2,E.k,E.v);if(!S(U.out,T,.005))return e("layerForwardKV")}{let v=t(4),m=t(40),_=new Float32Array(10);for(let q=0;q<10;q++){let B=0;for(let T=0;T<4;T++)B+=v[T]*m[q*4+T];_[q]=B}let y=0;for(let q=1;q<10;q++)_[q]>_[y]&&(y=q);let x=this.uploadGpu(m),P=await this.argmaxProjection(v,[{buf:x,rows:10,r0:0}],4,10,!1);if(x.destroy?.(),P!==y)return e("argmaxProjection")}{let x={seq:4,d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},P={attnNorm:t(16),wq:t(256),wk:t(128),wv:t(128),wo:t(256),bq:t(16),bk:t(8),bv:t(8),ffnNorm:t(16),wgate:t(256),wup:t(256),wdown:t(256)},q=t(16),B=t(64),T=new Float32Array(0),D=await this.layerForwardKV(B,{...x,seq:4},P,0,T,T,!0),E=Me(D.out.slice(48,64),q,1,16,1e-6),U={attnNorm:this.uploadGpu(P.attnNorm),wq:this.uploadGpu(P.wq),wk:this.uploadGpu(P.wk),wv:this.uploadGpu(P.wv),wo:this.uploadGpu(P.wo),ffnNorm:this.uploadGpu(P.ffnNorm),wgate:this.uploadGpu(P.wgate),wup:this.uploadGpu(P.wup),wdown:this.uploadGpu(P.wdown),bq:this.uploadGpu(P.bq),bk:this.uploadGpu(P.bk),bv:this.uploadGpu(P.bv)},R=this.uploadGpu(q),H=this.kvQuant;this.kvQuant=!1,this.resetKvGpu();let Q=await this.runDecodeGpu(B,{...x,seq:4},[U],0,R,"selftest-A");if(!S(Q,E,.008))return this.resetKvGpu(),this.kvQuant=H,e("runDecodeGpu.prefill");await this.runDecodeGpu(B.slice(0,48),{...x,seq:3},[U],0,R,"selftest-B");let V=await this.runDecodeGpu(B.slice(48,64),{...x,seq:1},[U],3,R,"selftest-B");if(!S(V,E,.008))return this.resetKvGpu(),this.kvQuant=H,e("runDecodeGpu.decode");this.kvQuant=H,this.resetKvGpu();for(let I of Object.values(U))I?.destroy?.();R.destroy?.()}{let _=Float32Array.from({length:152064},()=>(Math.random()*2-1)*8),y=[...new Set(Array.from({length:40},()=>Math.floor(Math.random()*152064)))],x=_.slice();for(let G=0;G<152064;G++)x[G]=30*Math.tanh(x[G]/30);for(let G of y)x[G]=x[G]>0?x[G]/1.15:x[G]*1.15;let P=Array.from(x.keys()).sort((G,C)=>x[C]-x[G]).slice(0,64),q=globalThis,B=[],T=this.storage(152064*4);this.device.queue.writeBuffer(T,0,_),B.push(T);let D=this.device.createCommandEncoder(),E=this.uniform([152064],{offset:4,value:30});this.recordPass(D,"softcap_logits",[E,T],this.grid1D(152064));let U=this.bufU32(Uint32Array.from(y),q.GPUBufferUsage.STORAGE|q.GPUBufferUsage.COPY_DST),R=this.uniform([y.length],{offset:4,value:1.15});this.recordPass(D,"penalize_logits",[R,U,T],this.grid1D(y.length));let H=this.storage(512),Q=this.uniform([152064,64]);this.recordPass(D,this.topKParOk?"top_k_par":"top_k",[Q,T,H],[1,1,1]),B.push(E,U,R,Q,H);let V=this.device.createBuffer({size:512,usage:q.GPUBufferUsage.COPY_DST|q.GPUBufferUsage.MAP_READ});D.copyBufferToBuffer(H,0,V,0,512),this.device.queue.submit([D.finish()]),await V.mapAsync(q.GPUMapMode.READ);let I=new Uint32Array(V.getMappedRange().slice(0));V.unmap(),V.destroy(),this.release(B);let X=I.slice(0,64),O=new Float32Array(I.buffer,256,64);this.topKOk=!0;for(let G=0;G<64;G++){let C=Math.abs(O[G]-x[P[G]])<=1e-4*(1+Math.abs(x[P[G]])),L=Math.abs(x[X[G]]-O[G])<=1e-4*(1+Math.abs(O[G]));if(!C||!L){this.topKOk=!1,console.error(`[selfValidate] top_k KO sur ce GPU (rang ${G}) : repli sur le sampling CPU plein-vocab (plus lent, m\xEAme r\xE9sultat).`);break}}}if(this.rwkvWkv7Ok){let m=t(128),_=t(16),y=t(16),x=t(16),P=t(16),q=t(16),B=Float32Array.from({length:16},()=>Math.random()*.5+.5),T=m.slice(),D=new Float32Array(16);for(let O=0;O<2;O++){let G=O*8;for(let C=0;C<8;C++){let L=O*8*8+C*8,N=x[G+C],$=0;for(let K=0;K<8;K++)$+=q[G+K]*T[L+K];let W=0;for(let K=0;K<8;K++){let Y=B[G+K]*T[L+K]+N*y[G+K]+P[G+K]*$;T[L+K]=Y,W+=_[G+K]*Y}D[G+C]=W}}let E=await this.rwkvWkv7(m.slice(),_,B,y,x,q,P,2,8),U=(O,G)=>O.length===G.length&&O.every((C,L)=>Math.abs(C-G[L])<=.001*(1+Math.abs(G[L])));!U(E.S,T)||!U(E.y,D)?(this.rwkvWkv7Ok=!1,console.error("[selfValidate] RWKV-7 WKV KO sur ce GPU : une archi RWKV (moteur v2) refuserait de charger (non bloquant pour le chat texte).")):console.log("[selfValidate] RWKV-7 WKV OK (r\xE9currence \xE0 \xE9tat fixe, moteur v2)");let R=16,H=t(R),Q=t(R),V=t(R*6),I=new Float32Array(R*6);for(let O=0;O<6;O++)for(let G=0;G<R;G++){let C=O*R+G;I[C]=H[G]+(Q[G]-H[G])*V[C]}let X=await this.rwkvTokenShift(H,Q,V,R);if(U(X,I)?console.log("[selfValidate] RWKV-7 token-shift OK"):(this.rwkvWkv7Ok=!1,console.error("[selfValidate] RWKV-7 token-shift KO sur ce GPU (non bloquant pour le chat texte).")),this.rwkvResidentOk){let O=globalThis,G=O.GPUBufferUsage.STORAGE|O.GPUBufferUsage.COPY_DST|O.GPUBufferUsage.COPY_SRC,C=2,L=8,N=C*L,$=(K,Y)=>{let re=Math.max(16,Math.ceil((K.length*4+(Y?4:0))/16)*16),te=this.device.createBuffer({size:re,usage:O.GPUBufferUsage.UNIFORM|O.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(te,0,new Uint32Array(K)),Y&&this.device.queue.writeBuffer(te,Y.off,new Float32Array([Y.val])),te},W=K=>this.device.createBuffer({size:K*4,usage:G});try{let K=t(N),Y=t(N),re=t(N),te=Float32Array.from({length:N},()=>Math.random()),ne=new Float32Array(N),ce=new Float32Array(N),fe=new Float32Array(N);for(let le=0;le<C;le++){let se=0;for(let ve=0;ve<L;ve++){let pe=K[le*L+ve]*Y[le*L+ve];se+=pe*pe}se=Math.sqrt(se)||1e-12;for(let ve=0;ve<L;ve++){let pe=le*L+ve,Ze=K[pe]*Y[pe]/se;ce[pe]=-Ze,fe[pe]=Ze*te[pe],ne[pe]=K[pe]*(1+(te[pe]-1)*re[pe])}}let J=W(N),Fe=W(N),Z=W(N);this.dispatch("rwkv_kprep",[$([C,L]),this.buf(K,G),this.buf(te,G),this.buf(Y,G),this.buf(re,G),J,Fe,Z],this.grid1D(C));let Se=U(await this.readBack(J,N*4),ne)&&U(await this.readBack(Fe,N*4),ce)&&U(await this.readBack(Z,N*4),fe);J.destroy?.(),Fe.destroy?.(),Z.destroy?.();let me=t(N),Vt=t(N),Yt=t(N),Xt=t(N),Jt=t(N),Zt=t(N),er=new Float32Array(N);for(let le=0;le<C;le++){let se=le*L,ve=0;for(let ue=0;ue<L;ue++)ve+=me[se+ue];ve/=L;let pe=0;for(let ue=0;ue<L;ue++){let vr=me[se+ue]-ve;pe+=vr*vr}pe/=L;let Ze=1/Math.sqrt(pe+64e-5),mr=0;for(let ue=0;ue<L;ue++)mr+=Vt[se+ue]*ne[se+ue]*Yt[se+ue];for(let ue=0;ue<L;ue++)er[se+ue]=(me[se+ue]-ve)*Ze*Jt[se+ue]+Zt[se+ue]+mr*Xt[se+ue]}let At=new Float32Array(2*N);At.set(Jt,0),At.set(Zt,N);let xt=W(N);this.dispatch("rwkv_out_gn",[$([C,L],{off:8,val:64e-5}),this.buf(me,G),this.buf(Vt,G),this.buf(ne,G),this.buf(Yt,G),this.buf(Xt,G),this.buf(At,G),xt],this.grid1D(C));let tr=U(await this.readBack(xt,N*4),er);xt.destroy?.();let rr=t(N),nr=t(N),Fn=Float32Array.from(rr,(le,se)=>Math.exp(-.606531/(1+Math.exp(-(le+nr[se]))))),Pt=W(N);this.dispatch("rwkv_decay",[this.buf(rr,G),this.buf(nr,G),Pt],this.grid1D(N));let sr=U(await this.readBack(Pt,N*4),Fn);Pt.destroy?.();let ir=t(N),ar=t(N),or=t(N),ur=t(N),Sn=Float32Array.from(ir,(le,se)=>le+(ar[se]-le)*(1/(1+Math.exp(-(or[se]+ur[se]))))),Ut=this.buf(ir,G);this.dispatch("rwkv_vresid",[Ut,this.buf(ar,G),this.buf(or,G),this.buf(ur,G)],this.grid1D(N));let cr=U(await this.readBack(Ut,N*4),Sn);Ut.destroy?.();let lr=t(N),dr=t(N),fr=t(N),Tn=Float32Array.from(lr,(le,se)=>le+(dr[se]-le)*fr[se]),_t=W(N);this.dispatch("rwkv_lerp",[this.buf(lr,G),this.buf(dr,G),this.buf(fr,G),_t],this.grid1D(N));let gr=U(await this.readBack(_t,N*4),Tn);_t.destroy?.();let pr=t(N),On=Float32Array.from(pr,le=>{let se=Math.max(le,0);return se*se}),Gt=W(N);this.dispatch("sqrelu",[this.buf(pr,G),Gt],this.grid1D(N));let hr=U(await this.readBack(Gt,N*4),On);Gt.destroy?.(),!Se||!tr||!sr||!cr||!gr||!hr?(this.rwkvResidentOk=!1,console.error(`[selfValidate] glu RWKV r\xE9sidente KO sur ce GPU (kprep:${Se} gn:${tr} decay:${sr} vresid:${cr} lerp:${gr} sqrelu:${hr}). Repli forwardToken JS+readback (correct, lent).`)):console.log("[selfValidate] glu RWKV r\xE9sidente OK (kprep, out_gn, decay, vresid, lerp, sqrelu)")}catch(K){this.rwkvResidentOk=!1,console.error("[selfValidate] glu RWKV r\xE9sidente : erreur d\u2019ex\xE9cution. Repli forwardToken JS+readback.",K)}}}if(this.lfm2ShortConvOk){let A=T=>Float32Array.from({length:T},()=>Math.random()*2-1),w=(T,D)=>T.length===D.length&&T.every((E,U)=>Math.abs(E-D[U])<=.001*(1+Math.abs(D[U]))),_=A(96),y=A(64),x=A(96),P=new Float32Array(32),q=y.slice();for(let T=0;T<32;T++){let D=_[T]*_[64+T],E=x[T*3+2]*D;for(let U=0;U<2;U++)E+=x[T*3+U]*y[U*32+T];for(let U=0;U+2<3;U++)q[U*32+T]=y[(U+1)*32+T];q[32+T]=D,P[T]=E*_[32+T]}let B=await this.lfm2ShortConv(_,y.slice(),x,32,3);!w(B.out,P)||!w(B.state,q)?(this.lfm2ShortConvOk=!1,console.error("[selfValidate] LFM2 shortconv KO sur ce GPU : une archi lfm2 refuserait de charger (non bloquant pour le reste).")):console.log("[selfValidate] LFM2 shortconv OK (conv courte gat\xE9e, moteur v2)")}let j=await this.validateDiffusion();j?console.warn("[selfValidate] image-gen primitive KO:",j,"(non bloquant: chemin texte intact)"):console.log(`[selfValidate] image-gen primitives OK (silu, group_norm, conv2d, conv2d_direct, conv2d_direct_q8/q4, conv 3\xD73 tuil\xE9 q8/q4 ${this.convTiledQOk?"OK":"KO (repli direct)"}, relu, upsample_nearest, layernorm, quick_gelu, attention_full)`);let z=await this.validateVideoResident();return z?(this.videoResidentOk=!1,console.warn("[selfValidate] motion r\xE9sident KO:",z,", repli JS+readback (plus lent, m\xEAme r\xE9sultat).")):console.log("[selfValidate] motion r\xE9sident OK (video_motion_gather, video_motion_scatter, video_add_pe, attn_temporal)"),!0}async validateVideoResident(){let e=o=>Float32Array.from({length:o},()=>Math.random()*2-1),r=(o,u,c=.005)=>o.length===u.length&&o.every((d,f)=>Math.abs(d-u[f])<=c*(1+Math.abs(u[f])));{let o=e(120),u=new Float32Array(120);for(let f=0;f<5;f++)for(let g=0;g<3;g++)for(let p=0;p<8;p++)u[(f*3+g)*8+p]=o[(g*8+p)*5+f];let c=this.recordingSession(),d=await c.finish(c.videoGather(o,3,8,5),120);if(!r(d,u,1e-6))return"video_motion_gather"}{let o=e(120),u=e(120),c=new Float32Array(120);for(let g=0;g<3;g++)for(let p=0;p<8;p++)for(let h=0;h<5;h++)c[(g*8+p)*5+h]=o[(h*3+g)*8+p]+u[(g*8+p)*5+h];let d=this.recordingSession(),f=await d.finish(d.videoScatter(o,u,3,8,5),120);if(!r(f,c,1e-6))return"video_motion_scatter"}{let o=e(120),u=e(24),c=new Float32Array(120);for(let g=0;g<5;g++)for(let p=0;p<3;p++)for(let h=0;h<8;h++)c[(g*3+p)*8+h]=o[(g*3+p)*8+h]+u[p*8+h];let d=this.recordingSession(),f=await d.finish(d.videoAddPe(o,u,3,8,5),120);if(!r(f,c,1e-6))return"video_add_pe"}{let o=e(120),u=e(120),c=e(120),d=1/Math.sqrt(4),f=new Float32Array(120);for(let h=0;h<5;h++)for(let b=0;b<2;b++){let k=b*4,F=h*3;for(let M=0;M<3;M++){let S=(F+M)*8+k,j=new Float32Array(3),z=-1e30;for(let w=0;w<3;w++){let v=0,m=(F+w)*8+k;for(let _=0;_<4;_++)v+=o[S+_]*u[m+_];j[w]=v*d,j[w]>z&&(z=j[w])}let A=0;for(let w=0;w<3;w++)j[w]=Math.exp(j[w]-z),A+=j[w];for(let w=0;w<3;w++){let v=j[w]/A,m=(F+w)*8+k;for(let _=0;_<4;_++)f[S+_]+=v*c[m+_]}}}let g=this.recordingSession(),p=await g.finish(g.attnTemporal(o,u,c,5,3,2,4),120);if(!r(p,f))return"attn_temporal"}return null}async validateDiffusion(){let e=G=>Float32Array.from({length:G},()=>Math.random()*2-1),r=(G,C,L=.005)=>G.length===C.length&&G.every((N,$)=>Math.abs(N-C[$])<=L*(1+Math.abs(C[$]))),t=e(70),n=t.map(G=>G/(1+Math.exp(-G)));if(!r(await this.silu(t),n))return"silu";let s=4,i=5,a=2,o=1e-5,u=e(s*i),c=e(s),d=e(s),f=new Float32Array(s*i),g=s/a;for(let G=0;G<a;G++){let C=G*g*i,L=g*i,N=0;for(let K=0;K<L;K++)N+=u[C+K];N/=L;let $=0;for(let K=0;K<L;K++){let Y=u[C+K]-N;$+=Y*Y}$/=L;let W=1/Math.sqrt($+o);for(let K=0;K<L;K++){let Y=G*g+Math.floor(K/i);f[C+K]=(u[C+K]-N)*W*c[Y]+d[Y]}}if(!r(await this.groupNorm(u,c,d,s,i,a,o),f))return"group_norm";let p=2,h=4,b=4,k=3,F=3,M=1,S=1,j=4,z=4,A=e(p*h*b),w=e(k*p*F*F),v=e(k),m=new Float32Array(k*j*z);for(let G=0;G<k;G++)for(let C=0;C<j;C++)for(let L=0;L<z;L++){let N=v[G];for(let $=0;$<p;$++)for(let W=0;W<F;W++)for(let K=0;K<F;K++){let Y=C*M+W-S,re=L*M+K-S;Y>=0&&Y<h&&re>=0&&re<b&&(N+=A[$*h*b+Y*b+re]*w[((G*p+$)*F+W)*F+K])}m[(G*j+C)*z+L]=N}if(!r(await this.conv2d(A,w,v,p,h,b,k,F,F,M,S),m))return"conv2d";if(!r(await this.conv2dDirect(A,w,v,p,h,b,k,F,F,M,S),m))return"conv2d_direct";{let $=e(1200),W=e(108),K=e(4),Y=await this.conv2dDirect($,W,K,3,20,20,4,3,3,1,1),re=this.convTiledOk;this.convTiledOk=!0;let te=this.recordingSession(),ne=await te.finish(te.conv2d($,W,K,3,20,20,4,3,3,1,1),1600);this.convTiledOk=re,r(ne,Y)||(this.convTiledOk=!1,console.warn("[selfValidate] conv2d_3x3_tiled KO sur ce GPU : repli sur conv2d_direct (plus lent, m\xEAme r\xE9sultat)."))}{let L=e(8*h*b),N=e(32*F*F),$=e(4),W=Ue(N),K=await this.conv2dDirect(L,he(W),$,8,h,b,4,F,F,M,S),Y={codes:this.uploadGpuRaw(new Uint8Array(W.codes.buffer,W.codes.byteOffset,W.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(W.scales.buffer,W.scales.byteOffset,W.scales.byteLength))},re=this.convTiledQOk;this.convTiledQOk=!1;let te=this.recordingSession(),ne=await te.finish(te.conv2d(L,Y,$,8,h,b,4,F,F,M,S),4*h*b);if(this.convTiledQOk=re,this.releaseGpu([Y.codes,Y.sc]),!r(ne,K))return"conv2d_direct_q8"}{let L=e(8*h*b),N=e(32*F*F),$=e(4),W=xe(N),K=await this.conv2dDirect(L,ge(W),$,8,h,b,4,F,F,M,S),Y={nib:this.uploadGpuRaw(W.nibbles),sc:this.uploadGpuRaw(new Uint8Array(W.scales.buffer,W.scales.byteOffset,W.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(W.mins.buffer,W.mins.byteOffset,W.mins.byteLength))},re=this.convTiledQOk;this.convTiledQOk=!1;let te=this.recordingSession(),ne=await te.finish(te.conv2d(L,Y,$,8,h,b,4,F,F,M,S),4*h*b);if(this.convTiledQOk=re,this.releaseGpu([Y.nib,Y.sc,Y.mn]),!r(ne,K))return"conv2d_direct_q4"}{let $=e(16e3),W=e(480),K=e(12),Y=this.convTiledQOk;for(let re of["q8","q4"]){let te=re==="q8"?(()=>{let J=Ue(W);return{deq:he(J),gpu:{codes:this.uploadGpuRaw(new Uint8Array(J.codes.buffer,J.codes.byteOffset,J.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(J.scales.buffer,J.scales.byteOffset,J.scales.byteLength))}}})():(()=>{let J=xe(W);return{deq:ge(J),gpu:{nib:this.uploadGpuRaw(J.nibbles),sc:this.uploadGpuRaw(new Uint8Array(J.scales.buffer,J.scales.byteOffset,J.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(J.mins.buffer,J.mins.byteOffset,J.mins.byteLength))}}})(),ne=await this.conv2dDirect($,te.deq,K,40,20,20,12,1,1,1,0);this.convTiledQOk=!0;let ce=this.recordingSession(),fe=await ce.finish(ce.conv2d($,te.gpu,K,40,20,20,12,1,1,1,0),4800);if(this.releaseGpu(Object.values(te.gpu)),!r(fe,ne)){Y&&console.warn(`[selfValidate] conv2d_1x1_${re} KO sur ce GPU : repli sur conv2d_direct_${re}.`),this.convTiledQOk=!1;break}}this.convTiledQOk=this.convTiledQOk&&Y}{let $=e(3200),W=e(288),K=e(4),Y=this.convTiledQOk;for(let re of["q8","q4"]){let te=re==="q8"?(()=>{let J=Ue(W);return{deq:he(J),gpu:{codes:this.uploadGpuRaw(new Uint8Array(J.codes.buffer,J.codes.byteOffset,J.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(J.scales.buffer,J.scales.byteOffset,J.scales.byteLength))}}})():(()=>{let J=xe(W);return{deq:ge(J),gpu:{nib:this.uploadGpuRaw(J.nibbles),sc:this.uploadGpuRaw(new Uint8Array(J.scales.buffer,J.scales.byteOffset,J.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(J.mins.buffer,J.mins.byteOffset,J.mins.byteLength))}}})(),ne=await this.conv2dDirect($,te.deq,K,8,20,20,4,3,3,1,1);this.convTiledQOk=!0;let ce=this.recordingSession(),fe=await ce.finish(ce.conv2d($,te.gpu,K,8,20,20,4,3,3,1,1),1600);if(this.releaseGpu(Object.values(te.gpu)),!r(fe,ne)){Y&&console.warn(`[selfValidate] conv2d_3x3_tiled_${re} KO sur ce GPU : repli sur conv2d_direct_${re} (plus lent, m\xEAme r\xE9sultat).`),this.convTiledQOk=!1;break}}this.convTiledQOk=this.convTiledQOk&&Y}{let $=e(3200),W=e(288),K=e(4),Y=this.convS2Ok,re=Math.floor(19/2)+1,te=Math.floor(19/2)+1;for(let ne of["q8","q4"]){let ce=ne==="q8"?(()=>{let Z=Ue(W);return{deq:he(Z),gpu:{codes:this.uploadGpuRaw(new Uint8Array(Z.codes.buffer,Z.codes.byteOffset,Z.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(Z.scales.buffer,Z.scales.byteOffset,Z.scales.byteLength))}}})():(()=>{let Z=xe(W);return{deq:ge(Z),gpu:{nib:this.uploadGpuRaw(Z.nibbles),sc:this.uploadGpuRaw(new Uint8Array(Z.scales.buffer,Z.scales.byteOffset,Z.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(Z.mins.buffer,Z.mins.byteOffset,Z.mins.byteLength))}}})(),fe=await this.conv2dDirect($,ce.deq,K,8,20,20,4,3,3,2,1);this.convS2Ok=!0;let J=this.recordingSession(),Fe=await J.finish(J.conv2d($,ce.gpu,K,8,20,20,4,3,3,2,1),4*re*te);if(this.releaseGpu(Object.values(ce.gpu)),!r(Fe,fe)){Y&&console.warn(`[selfValidate] conv2d_3x3_s2_tiled_${ne} KO sur ce GPU : repli sur direct.`),this.convS2Ok=!1;break}}this.convS2Ok=this.convS2Ok&&Y}if(this.hasSubgroups&&this.subgroupsOk)try{let L=e(1500),N=e(300),$=r(await this.rmsnormVec(L,N,5,300,1e-5,!1,"rmsnorm_vec_subgroup"),await this.rmsnormVec(L,N,5,300,1e-5,!1)),W=8,K=130,Y=4,re=e(W*K),te=e(W),ne=e(W),ce=r(await this.groupNorm(re,te,ne,W,K,Y,1e-5,"group_norm_subgroup"),await this.groupNorm(re,te,ne,W,K,Y));if(!$||!ce){let fe=[!$&&"rmsnorm_vec_subgroup",!ce&&"group_norm_subgroup"].filter(Boolean).join(" + ");console.warn(`[selfValidate] ${fe} KO sur ce GPU : repli sur la r\xE9duction en m\xE9moire partag\xE9e.`),this.subgroupsOk=!1}}catch(G){console.warn("[selfValidate] subgroups indisponibles \xE0 l'ex\xE9cution : repli sur la m\xE9moire partag\xE9e.",G),this.subgroupsOk=!1}{let C=e(66),L=new Uint16Array(66);for(let K=0;K<66;K++)L[K]=Re(C[K]);let N=new Float32Array(66);for(let K=0;K<66;K++)N[K]=ke(L[K]);let $=this.f16ToF32Gpu(new Uint8Array(L.buffer,L.byteOffset,L.byteLength),66),W=await this.readGpu($,66);if($.destroy?.(),!r(W,N,1e-6))return"f16_to_f32"}let _=e(70);if(!r(await this.relu(_),_.map(G=>Math.max(G,0))))return"relu";let y=2,x=2,P=2,q=2,B=x*q,T=P*q,D=e(y*x*P),E=new Float32Array(y*B*T);for(let G=0;G<y;G++)for(let C=0;C<B;C++)for(let L=0;L<T;L++)E[G*B*T+C*T+L]=D[G*x*P+Math.floor(C/q)*P+Math.floor(L/q)];if(!r(await this.upsampleNearest(D,y,x,P,q),E))return"upsample_nearest";let U=2,R=8,H=1e-5,Q=e(U*R),V=e(R),I=e(R),X=new Float32Array(U*R);for(let G=0;G<U;G++){let C=G*R,L=0;for(let W=0;W<R;W++)L+=Q[C+W];L/=R;let N=0;for(let W=0;W<R;W++){let K=Q[C+W]-L;N+=K*K}N/=R;let $=1/Math.sqrt(N+H);for(let W=0;W<R;W++)X[C+W]=(Q[C+W]-L)*$*V[W]+I[W]}if(!r(await this.layernorm(Q,V,I,U,R,H),X))return"layernorm";let O=e(70);if(!r(await this.quickGelu(O),O.map(G=>G/(1+Math.exp(-1.702*G)))))return"quick_gelu";{let W=1/Math.sqrt(4),K=e(24),Y=e(40),re=e(40),te=new Float32Array(24);for(let ne=0;ne<2;ne++)for(let ce=0;ce<3;ce++){let fe=new Float32Array(5),J=-1/0;for(let Z=0;Z<5;Z++){let Se=0;for(let me=0;me<4;me++)Se+=K[ce*8+ne*4+me]*Y[Z*8+ne*4+me];fe[Z]=Se*W,fe[Z]>J&&(J=fe[Z])}let Fe=0;for(let Z=0;Z<5;Z++)fe[Z]=Math.exp(fe[Z]-J),Fe+=fe[Z];for(let Z=0;Z<4;Z++){let Se=0;for(let me=0;me<5;me++)Se+=fe[me]/Fe*re[me*8+ne*4+Z];te[ce*8+ne*4+Z]=Se}}if(!r(await this.attentionFull(K,Y,re,3,2,2,4,5),te))return"attention_full"}if(this.attnFullWgOk){let G=[{nT:70,kvL:70,nH:5,hd:64},{nT:16,kvL:77,nH:5,hd:64},{nT:9,kvL:9,nH:8,hd:160}];for(let C of G){let L=C.nH*C.hd,N=e(C.nT*L),$=e(C.kvL*L),W=e(C.kvL*L),K=await this.attentionFull(N,$,W,C.nT,C.nH,C.nH,C.hd,C.kvL),Y=await this.attentionFullWg(N,$,W,C.nT,C.nH,C.nH,C.hd,C.kvL);if(!r(Y,K)){this.attnFullWgOk=!1,console.warn(`[selfValidate] attention_full_wg KO sur ce GPU (hd=${C.hd}, kv=${C.kvL}) : repli sur attention_full (plus lent, m\xEAme r\xE9sultat).`);break}}}return null}};ee.timingOn=(()=>{try{return oe("timing")==="1"}catch{return!1}})(),ee.profileOn=(()=>{try{return oe("gpuprofile")==="1"}catch{return!1}})(),ee.MAX_WG_DIM=65535,ee.BLOCK_ELEMS={Q4_K:256,Q5_K:256,Q6_K:256,Q8_0:32,Q5_0:32,Q4_0:32,F32:1,F16:1},ee.DEQUANT_SHADER={Q4_K:"dequant_q4k",Q8_0:"dequant_q8_0",Q5_0:"dequant_q5_0",Q6_K:"dequant_q6k",Q4_0:"dequant_q4_0",Q5_K:"dequant_q5k"},ee.STORAGE_USAGE=140;lt=ee});function Lr(l,e){let r=new DataView(l.buffer,l.byteOffset,l.byteLength),t=new Float32Array(e);for(let n=0;n<e;n++)t[n]=de(r.getUint16(n*2,!0));return t}function Dr(l,e){let r=new DataView(l.buffer,l.byteOffset,l.byteLength),t=new Float32Array(e);for(let n=0;n<e;n++)t[n]=r.getFloat32(n*4,!0);return t}function We(l,e,r,t){let n=0;for(let a=0;a<r;a++)n+=l[a]*l[a];let s=1/Math.sqrt(n/r+t),i=new Float32Array(r);for(let a=0;a<r;a++)i[a]=l[a]*s*e[a];return i}var rs,De,dt,jr=ie(()=>{"use strict";it();ot();at();He();rs=l=>l/(1+Math.exp(-l)),De=class De{constructor(e,r,t){this.engine=e;this.manifest=r;this.raw=t;this.w=new Map;this.g=new Map;this.pos=0;this.rLayers=[];this.tokNormGpu=null;this.normBufs=[];this.ffn=0;this.residentLock=Promise.resolve()}isBigProj(e){return/\.(shortconv\.(in_proj|out_proj)|attn_(q|k|v|output)|ffn_(gate|up|down))\.weight$/.test(e)}async load(e){if(!this.engine.lfm2ShortConvOk)throw new Error("kernel shortconv LFM2 invalid\xE9 sur ce GPU (selfValidate) : archi lfm2 refus\xE9e.");let r=this.manifest.arch;if(this.D=r.d,this.NH=r.nHeads,this.NKV=r.nKvHeads,this.HD=r.headDim,this.NL=r.blockCount,this.vocab=r.vocab,this.EPS=r.rmsEps,this.THETA=r.ropeTheta,!r.lfm2)throw new Error("manifest sans profil lfm2");this.LC=r.lfm2.lCache,this.convLayer=r.lfm2.kvHeadsPerLayer.map(t=>t===0),this.tok=e,this.stops=new Set(this.manifest.chat?.stopTokenIds?.length?this.manifest.chat.stopTokenIds:[7]);for(let[t,n]of Object.entries(this.manifest.tensors)){if(t==="token_embd.weight"){if(this.embedBytes=await this.raw(t),this.embedDtype=n.dtype,n.dtype==="q4"){let i=be(this.embedBytes,n.nElems);this.g.set("head",{kind:"q4",nib:this.engine.uploadGpuRaw(i.nibbles),sc:this.up(i.scales),mn:this.up(i.mins),IN:this.D,OUT:this.vocab})}else if(n.dtype==="q8"){let i=we(this.embedBytes,n.nElems);this.g.set("head",{kind:"q8",codes:this.upI8(i.codes),sc:this.up(i.scales),IN:this.D,OUT:this.vocab})}else if(n.dtype==="q3")throw new Error("LFM2 : t\xEAte li\xE9e en q3 non support\xE9e (le convertisseur garde un plancher q4)");continue}let s=await this.raw(t);if(this.isBigProj(t)&&(n.dtype==="q3"||n.dtype==="q4"||n.dtype==="q8")){let i=n.shape[0],a=n.nElems/i;if(n.dtype==="q8"){let o=we(s,n.nElems);this.g.set(t,{kind:"q8",codes:this.upI8(o.codes),sc:this.up(o.scales),IN:i,OUT:a})}else if(n.dtype==="q3"){let o=Ge(s,n.nElems);this.g.set(t,{kind:"q3",q3:!0,lo:this.up32(o.lo),hi:this.up32(o.hi),sc:this.up(o.scales),mn:this.up(o.mins),IN:i,OUT:a})}else{let o=be(s,n.nElems);this.g.set(t,{kind:"q4",nib:this.engine.uploadGpuRaw(o.nibbles),sc:this.up(o.scales),mn:this.up(o.mins),IN:i,OUT:a})}}else this.w.set(t,this.decodePetit(t,s,n))}this.buildResidentLayers(),this.reset()}buildResidentLayers(){let e=r=>{let t=this.engine.uploadGpu(this.w.get(r));return this.normBufs.push(t),t};this.tokNormGpu=e("token_embd_norm.weight"),this.ffn=this.g.get("blk.0.ffn_gate.weight")?.OUT??0,this.rLayers=[];for(let r=0;r<this.NL;r++){let t=`blk.${r}.`,n={attnNorm:e(t+"attn_norm.weight"),ffnNorm:e(t+"ffn_norm.weight"),wgate:this.g.get(t+"ffn_gate.weight"),wup:this.g.get(t+"ffn_up.weight"),wdown:this.g.get(t+"ffn_down.weight")};this.convLayer[r]?this.rLayers.push({conv:!0,...n,convW:e(t+"shortconv.conv.weight"),inProj:this.g.get(t+"shortconv.in_proj.weight"),outProj:this.g.get(t+"shortconv.out_proj.weight")}):this.rLayers.push({conv:!1,...n,qNorm:e(t+"attn_q_norm.weight"),kNorm:e(t+"attn_k_norm.weight"),wq:this.g.get(t+"attn_q.weight"),wk:this.g.get(t+"attn_k.weight"),wv:this.g.get(t+"attn_v.weight"),wo:this.g.get(t+"attn_output.weight")})}}residentAvailable(){return this.engine.lfm2ResidentOk!==!1&&!!this.g.get("head")&&this.rLayers.length===this.NL&&this.ffn>0}cfg(){return{D:this.D,nHeads:this.NH,nKvHeads:this.NKV,headDim:this.HD,ffn:this.ffn,eps:this.EPS,theta:this.THETA,lc:this.LC,vocab:this.vocab}}embedsFor(e){let r=this.D,t=new Float32Array(e.length*r);for(let n=0;n<e.length;n++)t.set(this.embedRow(e[n]),n*r);return t}async logitsGpu(e,r,t){return this.pos=r+e.length,this.engine.lfm2LogitsGpu(this.embedsFor(e),e.length,this.cfg(),this.rLayers,this.g.get("head"),this.tokNormGpu,r,t)}async topKGpu(e,r,t,n,s,i=40){return this.pos=r+e.length,this.engine.lfm2TopKGpu(this.embedsFor(e),e.length,this.cfg(),this.rLayers,this.g.get("head"),this.tokNormGpu,r,t,n,s,i)}async prefillGpu(e,r,t){this.pos=r+e.length,await this.engine.lfm2PrefillGpu(this.embedsFor(e),e.length,this.cfg(),this.rLayers,this.tokNormGpu,r,t)}decodePetit(e,r,t){switch(t.dtype){case"f32":return Dr(r,t.nElems);case"f16":return Lr(r,t.nElems);case"q8":return he(we(r,t.nElems));case"q4":return ge(be(r,t.nElems));case"q3":return Oe(Ge(r,t.nElems));default:throw new Error(`LFM2 : dtype \xAB ${t.dtype} \xBB non support\xE9 pour ${e}`)}}up(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}up32(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}upI8(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}unload(){for(let e of this.g.values())for(let r of["nib","sc","mn","codes"])e[r]?.destroy?.();for(let e of this.normBufs)e?.destroy?.();this.normBufs=[],this.rLayers=[],this.tokNormGpu=null,this.engine.clearLfm2State?.(),this.g.clear(),this.w.clear()}reset(){this.pos=0,this.state=Array.from({length:this.NL},(e,r)=>this.convLayer[r]?{conv:new Float32Array((this.LC-1)*this.D)}:{K:[],V:[]})}async gemm(e,r){let t=this.g.get(e);if(!t){let n=this.w.get(e==="head"?"token_embd.weight":e),s=n.length/r.length,i=new Float32Array(s);for(let a=0;a<s;a++){let o=0,u=a*r.length;for(let c=0;c<r.length;c++)o+=n[u+c]*r[c];i[a]=o}return i}return t.kind==="q8"?this.engine.matmulQ8(r,t.codes,t.sc,1,t.IN,t.OUT):t.kind==="q3"?this.engine.matmulQ3(r,t.lo,t.hi,t.sc,t.mn,1,t.IN,t.OUT):this.engine.matmulQ4(r,t.nib,t.sc,t.mn,1,t.IN,t.OUT)}embedRow(e){let r=this.D;if(this.embedDtype==="f16")return Lr(this.embedBytes.subarray(e*r*2,e*r*2+r*2),r);if(this.embedDtype==="f32")return Dr(this.embedBytes.subarray(e*r*4,e*r*4+r*4),r);if(this.embedDtype==="q8"){let o=this.vocab*r,u=r/32,c=new Int8Array(this.embedBytes.buffer,this.embedBytes.byteOffset+e*r,r),d=this.embedBytes.subarray(o+e*u*2,o+e*u*2+u*2),f=new DataView(d.buffer,d.byteOffset,d.byteLength),g=new Float32Array(r);for(let p=0;p<u;p++){let h=de(f.getUint16(p*2,!0));for(let b=0;b<32;b++)g[p*32+b]=c[p*32+b]*h}return g}let t=this.vocab*r,n=r/32,s=t/2,i=t/2+t/32*2,a=new Uint8Array(r/2+n*2*2);return a.set(this.embedBytes.subarray(e*r/2,e*r/2+r/2),0),a.set(this.embedBytes.subarray(s+e*n*2,s+e*n*2+n*2),r/2),a.set(this.embedBytes.subarray(i+e*n*2,i+e*n*2+n*2),r/2+n*2),ge(be(a,r))}rope(e,r,t){let n=this.HD,s=e.slice();for(let i=0;i<r;i++){let a=i*n;for(let o=0;o<n/2;o++){let u=Math.pow(this.THETA,-2*o/n),c=Math.cos(t*u),d=Math.sin(t*u),f=e[a+o],g=e[a+o+n/2];s[a+o]=f*c-g*d,s[a+o+n/2]=f*d+g*c}}return s}async forwardToken(e){let r=this.D,t=this.pos++,n=this.embedRow(e);for(let s=0;s<this.NL;s++){let i=`blk.${s}.`,a=this.state[s],o=We(n,this.w.get(i+"attn_norm.weight"),r,this.EPS),u;if(this.convLayer[s]){let p=await this.gemm(i+"shortconv.in_proj.weight",o),h=await this.engine.lfm2ShortConv(p,a.conv,this.w.get(i+"shortconv.conv.weight"),r,this.LC);a.conv=h.state,u=await this.gemm(i+"shortconv.out_proj.weight",h.out)}else{let p=await this.gemm(i+"attn_q.weight",o),h=await this.gemm(i+"attn_k.weight",o),b=await this.gemm(i+"attn_v.weight",o),k=this.w.get(i+"attn_q_norm.weight"),F=this.w.get(i+"attn_k_norm.weight");for(let A=0;A<this.NH;A++)p.set(We(p.slice(A*this.HD,(A+1)*this.HD),k,this.HD,this.EPS),A*this.HD);for(let A=0;A<this.NKV;A++)h.set(We(h.slice(A*this.HD,(A+1)*this.HD),F,this.HD,this.EPS),A*this.HD);p=this.rope(p,this.NH,t),h=this.rope(h,this.NKV,t),a.K.push(h),a.V.push(b);let M=new Float32Array(this.NH*this.HD),S=a.K.length,j=1/Math.sqrt(this.HD),z=this.NH/this.NKV;for(let A=0;A<this.NH;A++){let w=Math.floor(A/z),v=A*this.HD,m=w*this.HD,_=new Float32Array(S),y=-1e30;for(let P=0;P<S;P++){let q=0;for(let B=0;B<this.HD;B++)q+=p[v+B]*a.K[P][m+B];_[P]=q*j,_[P]>y&&(y=_[P])}let x=0;for(let P=0;P<S;P++)_[P]=Math.exp(_[P]-y),x+=_[P];for(let P=0;P<S;P++){let q=_[P]/x;for(let B=0;B<this.HD;B++)M[v+B]+=q*a.V[P][m+B]}}u=await this.gemm(i+"attn_output.weight",M)}for(let p=0;p<r;p++)n[p]+=u[p];let c=We(n,this.w.get(i+"ffn_norm.weight"),r,this.EPS),d=await this.gemm(i+"ffn_gate.weight",c),f=await this.gemm(i+"ffn_up.weight",c);for(let p=0;p<d.length;p++)d[p]=rs(d[p])*f[p];let g=await this.gemm(i+"ffn_down.weight",d);for(let p=0;p<r;p++)n[p]+=g[p]}return n=We(n,this.w.get("token_embd_norm.weight"),r,this.EPS),this.gemm("head",n)}async classify(e,r){let t=this.tok.encode(e),n;if(this.residentAvailable())n=await this.locked(()=>this.feedThen(t,0,"cls",(i,a)=>this.logitsGpu(i,a,"cls")));else{this.reset();for(let i of t)n=await this.forwardToken(i)}let s=r.map(i=>{let a=this.tok.encode(i);return{label:i,logit:n[a[1]??a[0]]}}).sort((i,a)=>a.logit-i.logit);return{label:s[0].label,scores:s}}banTools(e){for(let r of De.TOOL_BAN)r<e.length&&(e[r]=-1e30);return e}sampleTok(e,r,t){let{temperature:n=.8,topK:s=40,repeatPenalty:i=1.3}=t,a=new Set(r),o=[];for(let f=0;f<e.length;f++){let g=e[f];a.has(f)&&(g=g>0?g/i:g*i),o.push({i:f,v:g})}o.sort((f,g)=>g.v-f.v),o.length=s;let u=o[0].v,c=0;for(let f of o)f.p=Math.exp((f.v-u)/n),c+=f.p;let d=Math.random()*c;for(let f of o)if(d-=f.p,d<=0)return f.i;return o[0].i}async generate(e,r,t,n,s){this.reset();let i=this.tok.encode(e),a;for(let u of i)a=await this.forwardToken(u);let o=[];for(let u=0;u<r&&!n?.();u++){this.banTools(a);let c;if(s?.sample)c=this.sampleTok(a,o.slice(-64),s);else{c=0;for(let d=1;d<a.length;d++)a[d]>a[c]&&(c=d)}if(this.stops.has(c))break;o.push(c),t&&t(this.tok.decode(o)),a=await this.forwardToken(c)}return o.length?this.tok.decode(o):""}locked(e){let r=this.residentLock.then(e,e);return this.residentLock=r.catch(()=>{}),r}async feedThen(e,r,t,n,s){let i=0;for(;;){if(s?.())return null;let a=Math.min(i+De.PREFILL_CHUNK,e.length),o=e.slice(i,a);if(a<e.length)await this.prefillGpu(o,r+i,t);else return n(o,r+i);i=a}}pickFromTopK(e,r){let t=[],n=[];for(let f=0;f<e.ids.length;f++)if(!De.TOOL_BAN.includes(e.ids[f])){if(e.vals[f]<=-3e38)break;t.push(e.ids[f]),n.push(e.vals[f])}if(!t.length)return e.ids[0];if(!r?.sample)return t[0];let{temperature:s=.8,topK:i=40}=r,a=Math.min(i,t.length),o=n[0],u=0,c=new Array(a);for(let f=0;f<a;f++)c[f]=Math.exp((n[f]-o)/s),u+=c[f];let d=Math.random()*u;for(let f=0;f<a;f++)if(d-=c[f],d<=0)return t[f];return t[0]}async generateResident(e,r,t,n,s){return this.residentAvailable()?this.locked(async()=>{let a=s?.repeatPenalty??(s?.sample?1.3:1),o=this.tok.encode(e),u=await this.feedThen(o,0,"gen",(f,g)=>this.topKGpu(f,g,"gen",[],1,48),n);if(!u)return"";let c=o.length,d=[];for(let f=0;f<r&&!n?.();f++){let g=this.pickFromTopK(u,s);if(this.stops.has(g))break;d.push(g),t&&t(this.tok.decode(d)),u=await this.topKGpu([g],c,"gen",a!==1?[...new Set(d.slice(-64))]:[],a,48),c++}return d.length?this.tok.decode(d):""}):this.generate(e,r,t,n,s)}};De.TOOL_BAN=[8,10,12],De.PREFILL_CHUNK=128;dt=De});function ns(l){let e=[];for(let r=0;r<l.length;r++){let t=l[r];if(t==="\\"&&r+1<l.length){let s=l[r+1];if(s==="x"){e.push(parseInt(l.substr(r+2,2),16)&255),r+=3;continue}if(s==="t"){e.push(9),r++;continue}if(s==="n"){e.push(10),r++;continue}if(s==="r"){e.push(13),r++;continue}if(s==="0"){e.push(0),r++;continue}if(s==="\\"){e.push(92),r++;continue}if(s==="'"){e.push(39),r++;continue}if(s==='"'){e.push(34),r++;continue}e.push(92);continue}let n=t.codePointAt(0);if(n<128)e.push(n);else for(let s of new TextEncoder().encode(t))e.push(s)}return new Uint8Array(e)}var ft,Er=ie(()=>{"use strict";ft=class{constructor(e,r=0){this.root={next:new Map};this.idToBytes=[];this.vocabSize=e.length,this.eosId=r;for(let t=0;t<e.length;t++){let n=ns(e[t]);if(this.idToBytes[t]=n,t===0||n.length===0)continue;let s=this.root;for(let i of n){let a=s.next.get(i);a||(a={next:new Map},s.next.set(i,a)),s=a}s.id=t}}encode(e){let r=new TextEncoder().encode(e),t=[],n=0;for(;n<r.length;){let s=this.root,i=-1,a=0,o=0;for(let u=n;u<r.length;u++){let c=s.next.get(r[u]);if(!c)break;s=c,o++,c.id!==void 0&&(i=c.id,a=o)}i<0&&(i=r[n]+1,a=1),t.push(i),n+=a}return t}decode(e){let r=[];for(let t of e){if(t===this.eosId)continue;let n=this.idToBytes[t];if(n)for(let s of n)r.push(s)}return new TextDecoder("utf-8",{fatal:!1}).decode(new Uint8Array(r))}}});function Ct(l,e){let r=new DataView(l.buffer,l.byteOffset,l.byteLength),t=new Float32Array(e);for(let n=0;n<e;n++)t[n]=de(r.getUint16(n*2,!0));return t}function Rt(l,e){let r=new DataView(l.buffer,l.byteOffset,l.byteLength),t=new Float32Array(e);for(let n=0;n<e;n++)t[n]=r.getFloat32(n*4,!0);return t}function Be(l,e,r,t){let n=new Float32Array(t);for(let s=0;s<t;s++){let i=0,a=s*r;for(let o=0;o<r;o++)i+=l[a+o]*e[o];n[s]=i}return n}function pt(l,e,r,t,n=1e-5){let s=0;for(let u=0;u<t;u++)s+=l[u];s/=t;let i=0;for(let u=0;u<t;u++){let c=l[u]-s;i+=c*c}i/=t;let a=1/Math.sqrt(i+n),o=new Float32Array(t);for(let u=0;u<t;u++)o[u]=(l[u]-s)*a*e[u]+r[u];return o}var gt,je,Qe,Hr=ie(()=>{"use strict";ot();it();at();He();Er();gt=l=>1/(1+Math.exp(-l));je=class je{constructor(e,r,t){this.engine=e;this.manifest=r;this.raw=t;this.w=new Map;this.g=new Map;this.rLayers=[];this.rNorms=null;this.normBufs=[];this.residentLock=Promise.resolve()}isBigProj(e){return/\.(time_mix_(receptance|key|value|output)|channel_mix_(key|value))\.weight$/.test(e)}async load(e){let r=this.manifest.arch;this.D=r.d,this.H=r.rwkv.headSize,this.NH=this.D/this.H,this.NL=r.blockCount,this.vocab=r.vocab,this.tok=new ft(e,0);for(let[t,n]of Object.entries(this.manifest.tensors)){if(t==="token_embd.weight"){this.embedBytes=await this.raw(t),this.embedDtype=n.dtype;continue}let s=await this.raw(t);if(t==="output.weight"){if(n.dtype==="q4"){let i=be(s,n.nElems);this.g.set(t,{kind:"q4",nib:this.engine.uploadGpuRaw(i.nibbles),sc:this.up(i.scales),mn:this.up(i.mins),IN:this.D,OUT:this.vocab})}else if(n.dtype==="q3"){let i=Ge(s,n.nElems);this.g.set(t,{kind:"q3",q3:!0,lo:this.up32(i.lo),hi:this.up32(i.hi),sc:this.up(i.scales),mn:this.up(i.mins),IN:this.D,OUT:this.vocab})}else if(n.dtype==="q8"){let i=we(s,n.nElems);this.g.set(t,{kind:"q8",codes:this.upI8(i.codes),sc:this.up(i.scales),IN:this.D,OUT:this.vocab})}else this.w.set(t,n.dtype==="f32"?Rt(s,n.nElems):Ct(s,n.nElems));continue}if(this.isBigProj(t)&&(n.dtype==="q3"||n.dtype==="q4"||n.dtype==="q8")){let i=n.shape[0],a=n.nElems/i;if(n.dtype==="q3"){let o=Ge(s,n.nElems);this.g.set(t,{kind:"q3",q3:!0,lo:this.up32(o.lo),hi:this.up32(o.hi),sc:this.up(o.scales),mn:this.up(o.mins),IN:i,OUT:a})}else if(n.dtype==="q8"){let o=we(s,n.nElems);this.g.set(t,{kind:"q8",codes:this.upI8(o.codes),sc:this.up(o.scales),IN:i,OUT:a})}else{let o=be(s,n.nElems);this.g.set(t,{kind:"q4",nib:this.engine.uploadGpuRaw(o.nibbles),sc:this.up(o.scales),mn:this.up(o.mins),IN:i,OUT:a})}}else this.w.set(t,n.dtype==="f32"?Rt(s,n.nElems):n.dtype==="f16"?Ct(s,n.nElems):n.dtype==="q3"?Oe(Ge(s,n.nElems)):n.dtype==="q8"?he(we(s,n.nElems)):ge(be(s,n.nElems)))}this.buildResidentLayers(),this.reset()}buildResidentLayers(){try{let e=t=>{let n=this.w.get(t);if(!n)throw new Error(`r\xE9sident : tenseur manquant ${t}`);let s=this.engine.uploadGpu(n);return this.normBufs.push(s),s};this.rNorms={tokW:e("token_embd_norm.weight"),tokB:e("token_embd_norm.bias"),outW:e("output_norm.weight"),outB:e("output_norm.bias")};let r=[];for(let t=0;t<this.NL;t++){let n=`blk.${t}.`,s=(h,b)=>{let k=this.w.get(n+h);if(!k)throw new Error(`r\xE9sident : ${n}${h} manquant`);return k.length/b},i=this.w.get(n+"time_mix_ln.weight"),a=this.w.get(n+"time_mix_ln.bias");if(!i||!a)throw new Error(`r\xE9sident : ${n}time_mix_ln manquant`);let o=new Float32Array(2*this.D);o.set(i,0),o.set(a,this.D);let u=this.engine.uploadGpu(o);this.normBufs.push(u);let c=h=>{let b=this.g.get(n+h);if(!b)throw new Error(`r\xE9sident : ${n}${h} non quantifi\xE9e GPU`);return b},d=s("time_mix_w1.weight",this.D),f=s("time_mix_a1.weight",this.D),g=s("time_mix_g1.weight",this.D),p={attnNormW:e(n+"attn_norm.weight"),attnNormB:e(n+"attn_norm.bias"),attnNorm2W:e(n+"attn_norm_2.weight"),attnNorm2B:e(n+"attn_norm_2.bias"),lerpFused:e(n+"time_mix_lerp_fused.weight"),lerpK:e(n+"channel_mix_lerp_k.weight"),w0:e(n+"time_mix_w0.weight"),w1:e(n+"time_mix_w1.weight"),w2:e(n+"time_mix_w2.weight"),rw:d,a0:e(n+"time_mix_a0.weight"),a1:e(n+"time_mix_a1.weight"),a2:e(n+"time_mix_a2.weight"),ra:f,g1:e(n+"time_mix_g1.weight"),g2:e(n+"time_mix_g2.weight"),rg:g,kk:e(n+"time_mix_k_k.weight"),ka:e(n+"time_mix_k_a.weight"),rk:e(n+"time_mix_r_k.weight"),lnWB:u,R:c("time_mix_receptance.weight"),K:c("time_mix_key.weight"),V:c("time_mix_value.weight"),O:c("time_mix_output.weight"),cmK:c("channel_mix_key.weight"),cmV:c("channel_mix_value.weight"),ffn:this.g.get(n+"channel_mix_key.weight").OUT};t>0&&(p.rv=s("time_mix_v1.weight",this.D),p.v0=e(n+"time_mix_v0.weight"),p.v1=e(n+"time_mix_v1.weight"),p.v2=e(n+"time_mix_v2.weight")),r.push(p)}this.rLayers=r}catch(e){console.warn("[rwkv] chemin r\xE9sident indisponible (montage) : repli forwardToken JS+readback.",e),this.rLayers=[],this.rNorms=null}}residentAvailable(){let e=this.engine;return e.rwkvResidentOk!==!1&&e.rwkvWkv7Ok!==!1&&!!this.g.get("output.weight")&&this.rLayers.length===this.NL&&!!this.rNorms}cfg(){return{D:this.D,H:this.H,NH:this.NH,vocab:this.vocab}}embedsFor(e){let r=this.D,t=new Float32Array(e.length*r);for(let n=0;n<e.length;n++)t.set(this.embedRow(e[n]),n*r);return t}async prefillGpu(e,r,t){for(let n=0;n<e.length;n+=je.PREFILL_CHUNK){let s=e.slice(n,n+je.PREFILL_CHUNK);await this.engine.rwkvPrefillGpu(this.embedsFor(s),s.length,this.cfg(),this.rLayers,this.rNorms,r+n,t)}}locked(e){let r=this.residentLock.then(e,e);return this.residentLock=r.catch(()=>{}),r}async feedThen(e,r,t,n){let s=e.length>je.PREFILL_CHUNK?e.slice(0,e.length-je.PREFILL_CHUNK):[];return s.length&&await this.prefillGpu(s,r,t),n(e.slice(s.length),r+s.length)}async logitsGpu(e,r,t){return this.feedThen(e,r,t,(n,s)=>this.engine.rwkvLogitsGpu(this.embedsFor(n),n.length,this.cfg(),this.rLayers,this.g.get("output.weight"),this.rNorms,s,t))}async topKGpu(e,r,t,n,s,i=40){return this.feedThen(e,r,t,(a,o)=>this.engine.rwkvTopKGpu(this.embedsFor(a),a.length,this.cfg(),this.rLayers,this.g.get("output.weight"),this.rNorms,o,t,n,s,i))}up(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}up32(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}upI8(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}reset(){this.state=Array.from({length:this.NL},()=>({S:Array.from({length:this.NH},()=>new Float32Array(this.H*this.H)),tm:new Float32Array(this.D),cm:new Float32Array(this.D)}))}unload(){for(let e of this.g.values())for(let r of["nib","sc","mn","codes","lo","hi"])e[r]?.destroy?.();for(let e of this.normBufs)e?.destroy?.();this.normBufs=[],this.rLayers=[],this.rNorms=null,this.engine.clearRwkvState?.(),this.g.clear(),this.w.clear()}async gemm(e,r){let t=this.g.get(e);if(!t){let n=this.w.get(e);return Be(n,r,r.length,n.length/r.length)}return t.kind==="q3"?this.engine.matmulQ3(r,t.lo,t.hi,t.sc,t.mn,1,t.IN,t.OUT):t.kind==="q8"?this.engine.matmulQ8(r,t.codes,t.sc,1,t.IN,t.OUT):this.engine.matmulQ4(r,t.nib,t.sc,t.mn,1,t.IN,t.OUT)}embedRow(e){let r=this.D;if(this.embedDtype==="f16")return Ct(this.embedBytes.subarray(e*r*2,e*r*2+r*2),r);if(this.embedDtype==="f32")return Rt(this.embedBytes.subarray(e*r*4,e*r*4+r*4),r);if(this.embedDtype==="q8"){let u=this.vocab*r,c=r/32,d=new Int8Array(this.embedBytes.buffer,this.embedBytes.byteOffset+e*r,r),f=this.embedBytes.subarray(u+e*c*2,u+e*c*2+c*2),g=new DataView(f.buffer,f.byteOffset,f.byteLength),p=new Float32Array(r);for(let h=0;h<c;h++){let b=de(g.getUint16(h*2,!0));for(let k=0;k<32;k++)p[h*32+k]=d[h*32+k]*b}return p}let t=this.vocab*r,n=r/32,s=0,i=t/2,a=t/2+t/32*2,o=new Uint8Array(r/2+n*2*2);return o.set(this.embedBytes.subarray(s+e*r/2,s+e*r/2+r/2),0),o.set(this.embedBytes.subarray(i+e*n*2,i+e*n*2+n*2),r/2),o.set(this.embedBytes.subarray(a+e*n*2,a+e*n*2+n*2),r/2+n*2),ge(be(o,r))}async timeMix(e,r,t,n){let s=this.D,i=this.H,a=this.NH,o=`blk.${e}.`,u=O=>this.w.get(o+O),c=new Float32Array(s);for(let O=0;O<s;O++)c[O]=t.tm[O]-r[O];t.tm=r.slice();let d=u("time_mix_lerp_fused.weight"),f=O=>{let G=new Float32Array(s);for(let C=0;C<s;C++)G[C]=r[C]+c[C]*d[O*s+C];return G},[g,p,h,b,k,F]=[f(0),f(1),f(2),f(3),f(4),f(5)],M=await this.gemm(o+"time_mix_receptance.weight",g),S=await this.gemm(o+"time_mix_key.weight",h),j=await this.gemm(o+"time_mix_value.weight",b),z=Be(u("time_mix_w1.weight"),p,s,u("time_mix_w1.weight").length/s);for(let O=0;O<z.length;O++)z[O]=Math.tanh(z[O]);let A=Be(u("time_mix_w2.weight"),z,z.length,s),w=u("time_mix_w0.weight"),v=new Float32Array(s);for(let O=0;O<s;O++)v[O]=Math.exp(-.606531*gt(w[O]+A[O]));let m=u("time_mix_a1.weight"),_=Be(u("time_mix_a2.weight"),Be(m,k,s,m.length/s),m.length/s,s),y=u("time_mix_a0.weight"),x=new Float32Array(s);for(let O=0;O<s;O++)x[O]=gt(y[O]+_[O]);let P=u("time_mix_g1.weight"),q=Be(P,F,s,P.length/s);for(let O=0;O<q.length;O++)q[O]=gt(q[O]);let B=Be(u("time_mix_g2.weight"),q,q.length,s);if(e===0)n.vFirst=j.slice();else{let O=u("time_mix_v1.weight"),G=Be(u("time_mix_v2.weight"),Be(O,b,s,O.length/s),O.length/s,s),C=u("time_mix_v0.weight");for(let L=0;L<s;L++)j[L]=j[L]+(n.vFirst[L]-j[L])*gt(C[L]+G[L])}let T=u("time_mix_k_k.weight"),D=u("time_mix_k_a.weight"),E=new Float32Array(s);for(let O=0;O<s;O++)E[O]=S[O]*T[O];for(let O=0;O<a;O++){let G=0;for(let C=0;C<i;C++){let L=E[O*i+C];G+=L*L}G=Math.sqrt(G)||1e-12;for(let C=0;C<i;C++)E[O*i+C]/=G}let U=new Float32Array(s);for(let O=0;O<s;O++)U[O]=S[O]*(1+(x[O]-1)*D[O]);let R=new Float32Array(s);for(let O=0;O<a;O++){let G=O*i,C=t.S[O];for(let L=0;L<i;L++){let N=0;for(let K=0;K<i;K++)N+=-E[G+K]*C[L*i+K];let $=0,W=j[G+L];for(let K=0;K<i;K++){let Y=v[G+K]*C[L*i+K]+W*U[G+K]+E[G+K]*x[G+K]*N;C[L*i+K]=Y,$+=M[G+K]*Y}R[G+L]=$}}let H=u("time_mix_ln.weight"),Q=u("time_mix_ln.bias"),V=u("time_mix_r_k.weight"),I=new Float32Array(s);for(let O=0;O<a;O++){let G=O*i,C=0;for(let $=0;$<i;$++)C+=R[G+$];C/=i;let L=0;for(let $=0;$<i;$++){let W=R[G+$]-C;L+=W*W}L/=i;let N=1/Math.sqrt(L+64e-5);for(let $=0;$<i;$++)I[G+$]=(R[G+$]-C)*N*H[G+$]+Q[G+$]}for(let O=0;O<a;O++){let G=O*i,C=0;for(let L=0;L<i;L++)C+=M[G+L]*U[G+L]*V[G+L];for(let L=0;L<i;L++)I[G+L]+=C*j[G+L]}let X=new Float32Array(s);for(let O=0;O<s;O++)X[O]=I[O]*B[O];return this.gemm(o+"time_mix_output.weight",X)}async channelMix(e,r,t){let n=this.D,s=`blk.${e}.`,i=this.w.get(s+"channel_mix_lerp_k.weight"),a=new Float32Array(n);for(let c=0;c<n;c++)a[c]=t.cm[c]-r[c];t.cm=r.slice();let o=new Float32Array(n);for(let c=0;c<n;c++)o[c]=r[c]+a[c]*i[c];let u=await this.gemm(s+"channel_mix_key.weight",o);for(let c=0;c<u.length;c++)u[c]=u[c]>0?u[c]*u[c]:0;return this.gemm(s+"channel_mix_value.weight",u)}async forwardToken(e){let r=this.D,t={vFirst:null},n=this.embedRow(e);n=pt(n,this.w.get("token_embd_norm.weight"),this.w.get("token_embd_norm.bias"),r);for(let s=0;s<this.NL;s++){let i=this.state[s],a=`blk.${s}.`,o=await this.timeMix(s,pt(n,this.w.get(a+"attn_norm.weight"),this.w.get(a+"attn_norm.bias"),r),i,t);for(let c=0;c<r;c++)n[c]+=o[c];let u=await this.channelMix(s,pt(n,this.w.get(a+"attn_norm_2.weight"),this.w.get(a+"attn_norm_2.bias"),r),i);for(let c=0;c<r;c++)n[c]+=u[c]}return n=pt(n,this.w.get("output_norm.weight"),this.w.get("output_norm.bias"),r),this.gemm("output.weight",n)}async classify(e,r){let t=this.tok.encode(e),n;if(this.residentAvailable())n=await this.locked(()=>this.logitsGpu(t,0,"cls"));else{this.reset();for(let i of t)n=await this.forwardToken(i)}let s=r.map(i=>({label:i,logit:n[this.tok.encode(" "+i)[0]]})).sort((i,a)=>a.logit-i.logit);return{label:s[0].label,scores:s}}sampleTok(e,r,t){let{temperature:n=.8,topK:s=40,repeatPenalty:i=1.3}=t,a=new Set(r),o=[];for(let f=0;f<e.length;f++){let g=e[f];a.has(f)&&(g=g>0?g/i:g*i),o.push({i:f,v:g})}o.sort((f,g)=>g.v-f.v),o.length=s;let u=o[0].v,c=0;for(let f of o)f.p=Math.exp((f.v-u)/n),c+=f.p;let d=Math.random()*c;for(let f of o)if(d-=f.p,d<=0)return f.i;return o[0].i}async generate(e,r,t,n,s){this.reset();let i=this.tok.encode(e),a;for(let u of i)a=await this.forwardToken(u);let o=[];for(let u=0;u<r&&!n?.();u++){let c;if(s?.sample)c=this.sampleTok(a,o.slice(-64),s);else{c=0;for(let d=1;d<a.length;d++)a[d]>a[c]&&(c=d)}if(c===0)break;o.push(c),t&&t(this.tok.decode(o)),a=await this.forwardToken(c)}return this.tok.decode(o)}pickFromTopK(e,r){if(!r?.sample)return e.ids[0];let{temperature:t=.8,topK:n=40}=r,s=Math.min(n,e.ids.length);for(;s>1&&e.vals[s-1]<=-3e38;)s--;let i=e.vals[0],a=0,o=new Array(s);for(let c=0;c<s;c++)o[c]=Math.exp((e.vals[c]-i)/t),a+=o[c];let u=Math.random()*a;for(let c=0;c<s;c++)if(u-=o[c],u<=0)return e.ids[c];return e.ids[0]}async generateResident(e,r,t,n,s){return this.residentAvailable()?this.locked(async()=>{let a=s?.repeatPenalty??(s?.sample?1.3:1),o=this.tok.encode(e),u=await this.topKGpu(o,0,"gen",[],1,48),c=o.length,d=[];for(let f=0;f<r&&!n?.();f++){let g=this.pickFromTopK(u,s);if(g===0)break;d.push(g),t&&t(this.tok.decode(d)),u=await this.topKGpu([g],c,"gen",a!==1?[...new Set(d.slice(-64))]:[],a,48),c++}return this.tok.decode(d)}):this.generate(e,r,t,n,s)}};je.PREFILL_CHUNK=32;Qe=je});function Kr(l){if(!l.length)return null;let e=1/0,r=0,t=0;for(let n of l)e=Math.min(e,n.offset),r=Math.max(r,n.offset+n.bytes),t+=n.bytes;return r-e>64<<20||r-e>t*1.5?null:{start:e,end:r}}function zr(l,e){let r=new Map;for(let s of Object.keys(l)){let i=s.match(/^blk\.(\d+)\./);if(!i)continue;let a=r.get(i[1]);a||r.set(i[1],a=[]),a.push(s)}let t=new Map,n=new Map;return async s=>{let i=l[s];if(!i)throw new Error(`tenseur absent : ${s}`);let a=s.match(/^blk\.(\d+)\./),o=a?r.get(a[1]):void 0,u=o?Kr(o.map(b=>l[b])):null;if(!a||!o||!u)return e.bytes(i.offset,i.bytes);let c=a[1],d=t.get(c);d||(d=e.bytes(u.start,u.end-u.start).then(b=>({start:u.start,bytes:b})),t.set(c,d),n.set(c,o.length));let{start:f,bytes:g}=await d,p=g.subarray(i.offset-f,i.offset-f+i.bytes),h=(n.get(c)??1)-1;return h<=0?(t.delete(c),n.delete(c),new Uint8Array(p)):(n.set(c,h),p)}}var Lt=ie(()=>{"use strict"});var Nr=ie(()=>{"use strict"});function Qr(l,e=16){return Math.ceil(l/e)*e}function os(l){if(l.length>128||l.includes(".."))return!1;let e=l.split("/");return e.length<=2&&e.every(r=>as.test(r))}function $r(l){let e=i=>{throw new Error(`BRIK: manifeste invalide \u2014 ${i}`)};(!l||typeof l!="object")&&e("ce n'est pas un objet"),l.format!=="brik"&&e(`champ format \xAB ${String(l.format)} \xBB (attendu \xAB brik \xBB)`),(!Ce(l.version,1024)||l.version<1)&&e(`version ${String(l.version)}`),(!l.model||typeof l.model.name!="string"||l.model.name.length>512)&&e("champ model.name");let r=l.arch;(!r||typeof r!="object"||typeof r.arch!="string"||r.arch.length>64)&&e("champ arch.arch");for(let[i,a]of[["d",262144],["nHeads",4096],["nKvHeads",4096],["headDim",4096],["ffn",1048576],["blockCount",1024],["vocab",1e7]])Ce(r[i],a)||e(`arch.${i} = ${String(r[i])}`);for(let i of["ropeTheta","rmsEps"])(typeof r[i]!="number"||!Number.isFinite(r[i]))&&e(`arch.${i} = ${String(r[i])}`);l.tokenizer&&(l.tokenizer.kind!=="hf-hub"&&l.tokenizer.kind!=="embedded"&&e(`tokenizer.kind \xAB ${String(l.tokenizer.kind)} \xBB`),l.tokenizer.id&&!os(l.tokenizer.id)&&e(`tokenizer.id \xAB ${l.tokenizer.id} \xBB (attendu : \xAB auteur/d\xE9p\xF4t \xBB ou une sentinelle sans barre oblique)`)),(!Array.isArray(l.shards)||l.shards.length===0||l.shards.length>Wr)&&e(`${Array.isArray(l.shards)?l.shards.length:"aucun"} shard`);let t=new Map;for(let i of l.shards)Ce(i.id,Wr)||e(`shard.id = ${String(i.id)}`),t.has(i.id)&&e(`shard ${i.id} d\xE9clar\xE9 deux fois`),(typeof i.file!="string"||i.file.length>256)&&e(`shard.file du shard ${i.id}`),Ce(i.byteLength,ht)||e(`shard.byteLength du shard ${i.id} = ${String(i.byteLength)}`),t.set(i.id,i.byteLength);(!l.tensors||typeof l.tensors!="object")&&e("champ tensors");let n=Object.keys(l.tensors);(n.length===0||n.length>ss)&&e(`${n.length} tenseurs`);let s=0;for(let i of n){let a=l.tensors[i];(!a||typeof a!="object")&&e(`tenseur ${i}`),is.includes(a.dtype)||e(`dtype \xAB ${String(a.dtype)} \xBB du tenseur ${i}`),(!Array.isArray(a.shape)||a.shape.length>8||!a.shape.every(u=>Ce(u,2**32)))&&e(`shape du tenseur ${i}`),Ce(a.nElems,2**40)||e(`nElems du tenseur ${i}`),(!Ce(a.offset,ht)||!Ce(a.byteLength,ht))&&e(`offset/byteLength du tenseur ${i}`);let o=t.get(a.shard);o===void 0&&e(`le tenseur ${i} r\xE9f\xE9rence le shard ${String(a.shard)}, absent du manifeste`),a.offset+a.byteLength>o&&e(`le tenseur ${i} d\xE9passe son shard (${a.offset}+${a.byteLength} > ${o})`),s+=a.byteLength}return s>ht&&e(`${s} octets de tenseurs au total`),l}var Wr,ss,ht,is,as,Ce,Ir=ie(()=>{"use strict";Wr=4096,ss=2e5,ht=64*1024*1024*1024,is=["f16","f32","q4","q8","q3"],as=/^[A-Za-z0-9._-]+$/;Ce=(l,e)=>typeof l=="number"&&Number.isInteger(l)&&l>=0&&l<=e});function cs(l){return Qr($e+l)}function Dt(l){if(l.length<$e)throw new Error("BRIK: fichier tronqu\xE9 (en-t\xEAte)");let e=String.fromCharCode(l[0],l[1],l[2],l[3]);if(e!==us)throw new Error(`BRIK: sceau magique absent (${e})`);let r=new DataView(l.buffer,l.byteOffset,l.byteLength),t=r.getUint32(4,!0),n=r.getUint32(8,!0);if($e+n>l.length)throw new Error("BRIK: manifeste tronqu\xE9");return{manifest:$r(JSON.parse(new TextDecoder().decode(l.subarray($e,$e+n)))),version:t,dataStart:cs(n)}}function Vr(l){let{manifest:e,version:r,dataStart:t}=Dt(l);return{manifest:e,version:r,dataStart:t,data:l.subarray(t)}}var us,$e,Yr=ie(()=>{"use strict";Ir();us="BRIK",$e=12});function Xr(l){let e=[...l].sort((n,s)=>n.id-s.id),r=[],t=0;for(let n of e)r[n.id]=t,t+=n.byteLength;return r}function Jr(l){let e=Xr(l.shards),r={};for(let[n,s]of Object.entries(l.tensors)){let i=ls[s.dtype];if(!i)throw new Error(`dtype BRIK inconnu pour ${n} : ${s.dtype}`);if(e[s.shard]===void 0)throw new Error(`shard ${s.shard} absent du manifeste (tenseur ${n})`);r[n]={offset:e[s.shard]+s.offset,bytes:s.byteLength,nElems:s.nElems,type:i,shape:s.shape}}let t=l.arch;return{arch:t.arch,config:{d:t.d,nHeads:t.nHeads,nKvHeads:t.nKvHeads,headDim:t.headDim,ffn:t.ffn,blockCount:t.blockCount,ropeTheta:t.ropeTheta,rmsEps:t.rmsEps,attnLogitSoftcap:t.attnLogitSoftcap,finalLogitSoftcap:t.finalLogitSoftcap,attnScale:t.attnScale,act:t.act,rmsGainOnePlus:t.rmsGainOnePlus,embedScale:t.embedScale,rwkv:t.rwkv,lfm2:t.lfm2},tensors:r}}var ls,Zr=ie(()=>{"use strict";ls={f16:"F16",f32:"F32",q4:"Q4W",q8:"Q8W",q3:"Q3W"}});function gs(l){return ds[l]}async function ps(l){let e=l.slice();return fs(await crypto.subtle.digest("SHA-256",e.buffer))}async function jt(l,e){let r=gs(l);if(!r)return;if(typeof crypto>"u"||!crypto.subtle){console.warn("[int\xE9grit\xE9] crypto.subtle indisponible (contexte non s\xE9curis\xE9) : empreinte du manifeste NON v\xE9rifi\xE9e.");return}let t=await ps(e);if(t!==r)throw console.error(`[int\xE9grit\xE9] manifeste inattendu pour ${l}
  attendu : ${r}
  obtenu  : ${t}`),new Error("Ce mod\xE8le ne correspond pas \xE0 celui que Brimkern publie : son manifeste a une empreinte diff\xE9rente de celle attendue. Chargement refus\xE9. Si tu viens de t\xE9l\xE9verser une nouvelle version, relance `npm run brik:digest`.")}var ds,fs,en=ie(()=>{"use strict";ds={"https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik":"aca6214b45c294c1d4c51c46aa23acc22cc53cb95a6894c62d2bd0570ca12afe","https://huggingface.co/romainkh14/Qwen2.5-0.5B-Instruct_BRIK/resolve/main/qwen2.5-0.5b-instruct-mixed.brik":"315d2a1cc17b64b029eb24e9668e5c959fd151ae926c9758bddc6a8193e52f6d","https://huggingface.co/romainkh14/Qwen3-4B_BRIK/resolve/main/qwen3-4b-q4.brik":"23f9c0cc66ec21056e656bdaa5cbfda2e93673718ea3ab0dfad19c6e7f583f7d","https://huggingface.co/romainkh14/RWKV-7-G1-0.1B_BRIK/resolve/main/rwkv7-g1-0.1b-q4.brik":"bb8d211e1f95af415b7dca8b0b074c236ebe9d0844f1f372c11eecbcf15fb372","https://huggingface.co/romainkh14/RWKV-7-G1a-0.4B_BRIK/resolve/main/rwkv7-g1a-0.4b-q4.brik":"47e67144bb9dcd41918f3117aa6ee21420ff94f93289c338d8331620d3153b10","https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main/sd-turbo-clip-mixed.brik":"b873aaad23ca70d4e29c0350d124fd6ee0a18470aaf59719f14c9eb9f227b3ac","https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main/sd-turbo-clip-q8.brik":"b3e05c74f8f0327e878787100224983a454e4228d2ae008902875a6256fb2bae","https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main/sd-turbo-unet-q8.brik":"ca3a5c21512542656a8a736c88f67d37a482cacbf499a080c9bf32ca36bf6b0f","https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main/sdxs-unet-light.brik":"42f7c0e82971a558d56548edec947b1ed7d9c0e509d634b51fc29429177e7654","https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main/video-clip-q8.brik":"e81ca57426716237dce2853703c70172a829f78704b7df77c9ee980534c82a76","https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main/video-motion-q8.brik":"e976e13a5bc0858b8277eefed59cc0d77239b5a30ecae68d483e24eb983ae481","https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main/video-unet-q8.brik":"d112b2884afcd038cdbd90bb62ce6b248b404852fb9ce20003b8585927a362b9"},fs=l=>[...new Uint8Array(l)].map(e=>e.toString(16).padStart(2,"0")).join("")});function ms(l,e,r){return`${l}${l.includes("?")?"&":"?"}__brik=${e}-${r}`}async function vs(){try{return await caches.open(hs)}catch{return null}}async function Et(l,e,r,t){let n=e+r-1,s=await vs(),i=ms(l,e,n);if(s){let o=await s.match(i);if(o)return{bytes:new Uint8Array(await o.arrayBuffer()),ranged:!0}}let a;for(let o=0;o<4;o++)try{let u=await fetch(l,{headers:{Range:`bytes=${e}-${n}`},signal:t});if(!u.ok&&u.status!==206)throw new Error(`range fetch ${e}-${n} \xE9chou\xE9 : HTTP ${u.status}`);let c=u.status===206,d=new Uint8Array(await u.arrayBuffer()),f=c?d:d.subarray(e,e+r);if(s&&c)try{await s.put(i,new Response(f,{headers:{"Content-Length":String(f.byteLength)}}))}catch(g){an(g)}return{bytes:f,ranged:c}}catch(u){if(t?.aborted)throw u;a=u,o<3&&await new Promise(c=>setTimeout(c,500*2**o))}throw a instanceof Error?a:new Error(String(a))}function an(l){tn||(tn=!0,console.warn("[cache] \xE9criture refus\xE9e (quota plein ? navigation priv\xE9e ?) : les t\xE9l\xE9chargements de mod\xE8les ne seront PAS r\xE9utilisables \xE0 la prochaine visite. Lib\xE9rez de l'espace via le panneau Stockage.",l))}async function bs(l){try{let n=await(await caches.open(rn)).match(l);if(n)return new Uint8Array(await n.arrayBuffer())}catch{}let e=await fetch(l);if(!e.ok)throw new Error(`HTTP ${e.status}`);let r=new Uint8Array(await e.arrayBuffer());try{await(await caches.open(rn)).put(l,new Response(r.slice(),{headers:{"Content-Length":String(r.byteLength)}}))}catch(t){an(t)}return r}function ws(l,e){return{bytes:async(r,t)=>(await Et(l,e+r,t)).bytes}}function ys(l){return{bytes:async(e,r)=>l.subarray(e,e+r)}}async function on(l){let e=await Et(l,0,12);if(!e.ranged){let i=await bs(l),{manifest:a,data:o}=Vr(i);return await jt(l,nn(i)),sn(a,ys(o))}let r=new DataView(e.bytes.buffer,e.bytes.byteOffset,12).getUint32(8,!0),t=await Et(l,0,12+r),{manifest:n,dataStart:s}=Dt(t.bytes);return await jt(l,nn(t.bytes)),sn(n,ws(l,s))}function nn(l){let e=new DataView(l.buffer,l.byteOffset,12).getUint32(8,!0);return l.subarray(12,12+e)}function sn(l,e){if(l.model?.uiArch==="image")throw new Error("Ce fichier est un BRIK image (UNet/CLIP) : il se charge via la tuile de g\xE9n\xE9ration d'image, pas comme un LLM.");return{source:e,manifest:Jr(l),tokenizerId:l.tokenizer?.id,tokenizer:l.tokenizer,uiArch:l.model?.uiArch,modelName:l.model.name}}var hs,tn,rn,un=ie(()=>{"use strict";"use client";Lt();Nr();Yr();Zr();en();hs="brik-range-v1";tn=!1;rn="brimkern-model-cache"});function ks(l){let e=l.indexOf("<think>");if(e===-1)return l;let r=l.indexOf("</think>",e);return(r===-1?l.slice(0,e):l.slice(0,e)+l.slice(r+8)).trim()}function ln(l,e,r){l=l.map(n=>n.role==="assistant"?{...n,content:ks(n.content)}:n);let t="";if(e==="deepseek"){t+="<\uFF5Cbegin\u2581of\u2581sentence\uFF5C>",r.trim()&&(t+=r);for(let n of l)n.role==="user"?t+=`<\uFF5CUser\uFF5C>${n.content}`:n.role==="assistant"&&(t+=`<\uFF5CAssistant\uFF5C>${n.content}<\uFF5Cend\u2581of\u2581sentence\uFF5C>`);return t+="<\uFF5CAssistant\uFF5C>",t}if(e==="rwkv7"){r.trim()&&(t+=`System: ${r.trim()}

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
`}return t}var cn,dn=ie(()=>{"use strict";cn=["<\uFF5Cend\u2581of\u2581sentence\uFF5C>","<\uFF5CAssistant\uFF5C>","<\uFF5CUser\uFF5C>","<\uFF5Cbegin\u2581of\u2581sentence\uFF5C>","<|im_end|>","<|im_start|>","<|eot_id|>","<|begin_of_text|>","<|start_header_id|>","<|end_header_id|>","</s>","<s>","<end_of_turn>","<start_of_turn>","[INST]","[/INST]","[SYSTEM_PROMPT]","</model>","</assistant>","</user>","<|assistant|>","<|user|>",`
User:`]});function As(){let l=[];for(let s=33;s<=126;s++)l.push(s);for(let s=161;s<=172;s++)l.push(s);for(let s=174;s<=255;s++)l.push(s);let e=l.slice(),r=0;for(let s=0;s<256;s++)l.includes(s)||(l.push(s),e.push(256+r),r++);let t=new Array(256),n=new Map;for(let s=0;s<l.length;s++)t[l[s]]=String.fromCodePoint(e[s]),n.set(String.fromCodePoint(e[s]),l[s]);return{enc:t,dec:n}}var fn,mt,gn=ie(()=>{"use strict";fn="'(?:[sdmt]|ll|ve|re)| ?\\p{L}+| ?\\p{N}+| ?[^\\s\\p{L}\\p{N}]+|\\s+(?!\\S)|\\s+",mt=class l{constructor(e){this.vocab=new Map;this.idToTok=new Map;this.ranks=new Map;this.added=[];this.specialIds=new Set;this.addedRe=null;this.bosIds=[];this.cache=new Map;let r=typeof e=="string"?JSON.parse(e):e;if(r?.model?.type!=="BPE")throw new Error(`BpeTokenizer : model.type ${r?.model?.type} non couvert (BPE uniquement)`);({enc:this.byteEnc,dec:this.byteDec}=As());for(let[a,o]of Object.entries(r.model.vocab))this.vocab.set(a,o),this.idToTok.set(o,a);(r.model.merges??[]).forEach((a,o)=>this.ranks.set(Array.isArray(a)?`${a[0]} ${a[1]}`:a,o));for(let a of r.added_tokens??[])this.added.push(a),this.vocab.set(a.content,a.id),this.idToTok.set(a.id,a.content),a.special&&this.specialIds.add(a.id);if(this.added.length){let a=this.added.map(o=>o.content.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).sort((o,u)=>u.length-o.length);this.addedRe=new RegExp(`(${a.join("|")})`,"g")}let n=l.findSplitPattern(r.pre_tokenizer)??fn;this.splitRe=new RegExp(n,"gu");let s=a=>{if(!a)return null;if(a.type==="TemplateProcessing")return a.single;if(a.type==="Sequence")for(let o of a.processors??[]){let u=s(o);if(u)return u}return null},i=s(r.post_processor);if(Array.isArray(i))for(let a of i)if(a.SpecialToken){let o=this.vocab.get(a.SpecialToken.id);o!==void 0&&this.bosIds.push(o)}else break}static findSplitPattern(e){if(!e)return null;if(e.type==="Split"&&e.pattern?.Regex)return e.pattern.Regex;if(e.type==="ByteLevel"&&e.use_regex!==!1)return fn;if(e.type==="Sequence")for(let r of e.pretokenizers??[]){let t=l.findSplitPattern(r);if(t)return t}return null}bpe(e){let r=this.cache.get(e);if(r)return r;let t=Array.from(e);for(;t.length>1;){let s=-1,i=1/0;for(let a=0;a<t.length-1;a++){let o=this.ranks.get(`${t[a]} ${t[a+1]}`);o!==void 0&&o<i&&(i=o,s=a)}if(s<0)break;t=[...t.slice(0,s),t[s]+t[s+1],...t.slice(s+2)]}let n=[];for(let s of t){let i=this.vocab.get(s);if(i!==void 0)n.push(i);else for(let a of s){let o=this.vocab.get(a);o!==void 0&&n.push(o)}}return this.cache.set(e,n),n}encodeChunk(e){let r=[];for(let t of e.match(this.splitRe)??[]){let n=new TextEncoder().encode(t),s="";for(let i of n)s+=this.byteEnc[i];r.push(...this.bpe(s))}return r}encode(e){let r=[...this.bosIds];if(this.addedRe)for(let t of e.split(this.addedRe)){if(!t)continue;let n=this.vocab.get(t);n!==void 0&&this.added.some(s=>s.content===t)?r.push(n):r.push(...this.encodeChunk(t))}else r.push(...this.encodeChunk(e));return r}decode(e){let r=[];for(let t of e){if(this.specialIds.has(t))continue;let n=this.idToTok.get(t);if(n!==void 0)for(let s of n){let i=this.byteDec.get(s);if(i!==void 0)r.push(i);else for(let a of new TextEncoder().encode(s))r.push(a)}}return new TextDecoder("utf-8",{fatal:!1}).decode(new Uint8Array(r))}}});async function _s(l,e){let r=new lt;if(!await r.init())throw Object.assign(new Error("WebGPU is not available in this browser."),{code:"no-webgpu"});r.onLost=p=>{console.warn("[brimkern] device GPU perdu ("+(p?.reason||"unknown")+"): rechargement au prochain appel"),qe.delete(l)},await r.selfValidate(),e("download");let t=await on(l),n=t.manifest,s=n?.config?.lfm2?"lfm2":n?.config?.rwkv?"rwkv7":null;if(!s){let p=n?.arch??n?.config?.arch??"unknown";throw new Error(`Brimkern SDK runs LFM2 and RWKV-7 .brik models only: this file's architecture is "${p}". Use the default model (omit \`model\`), or convert/pick an LFM2 or RWKV-7 .brik. Full model support lives in the app: https://brimkern.com/chat`)}let i=n.tensors["token_embd.weight"],a={arch:{...n.config,arch:s,vocab:i?i.nElems/n.config.d:0},tensors:Object.fromEntries(Object.entries(n.tensors).map(([p,h])=>[p,{dtype:Ps[h.type]??h.type,shape:h.shape,nElems:h.nElems,shard:0,offset:h.offset,byteLength:h.bytes}])),shards:[{id:0,file:"",byteLength:0}],chat:s==="lfm2"?{template:"chatml",stopTokenIds:[7,2,8,10,12]}:{template:"rwkv",stopTokenIds:[0]}},o=Object.values(n.tensors).reduce((p,h)=>p+h.bytes,0),u=0,c=zr(n.tensors,t.source),d=async p=>{let h=n.tensors[p];if(!h)throw new Error(`tenseur absent : ${p}`);let b=await c(p);return u+=h.bytes,e("download",{loaded:u,total:o}),b};if(e("tokenizer"),s==="rwkv7"){let p=t.tokenizer?.json?JSON.parse(t.tokenizer.json):null;if(!p?.tokens)throw new Error("RWKV .brik without its embedded World vocab (rebuild the BRIK).");let h=new Qe(r,a,d);return e("gpu"),await h.load(p.tokens),{core:h,engine:r}}let f;try{let p=new mt(t.tokenizer.json);f={encode:h=>p.encode(h),decode:h=>p.decode(h)}}catch(p){console.warn("[brimkern] tokenizer.json non couvert par le BPE bundl\xE9 : repli transformers.js (CDN)",p);let h=await import(xs),b=new h.PreTrainedTokenizer(JSON.parse(t.tokenizer.json),JSON.parse(t.tokenizer.config));f={encode:k=>Array.from(b(k).input_ids.data,F=>Number(F)),decode:k=>b.decode(k,{skip_special_tokens:!0})}}let g=new dt(r,a,d);return e("gpu"),await g.load(f),{core:g,engine:r}}function Ie(l){return l&&(l.startsWith("https://")||/^http:\/\/(localhost|127\.0\.0\.1)[:/]/.test(l))?l:pn[l||"lfm2.5-230m"]||pn["lfm2.5-230m"]}function vt(l,e){let r=qe.get(l);if(!r){let t={status:"init",state:"loading",listeners:new Set,promise:null};t.promise=_s(l,(n,s)=>{t.status=n,t.progress=s,t.listeners.forEach(i=>i(n,s))}).then(n=>(t.state="ready",n)).catch(n=>{throw t.state="error",qe.delete(l),n}),qe.set(l,t),r=t}return e&&(e(r.status,r.progress),r.listeners.add(e),r.promise.finally(()=>r.listeners.delete(e)).catch(()=>{})),r.promise}async function hn(l,e){let r=await vt(l,e);return r.engine.lost?(qe.delete(l),(await vt(l,e)).core):r.core}async function mn(l,e){let r=await hn(l);try{return await e(r)}catch(t){let n=qe.get(l);if(!(!n||await n.promise.then(i=>i.engine.lost).catch(()=>!0)))throw t;return console.warn("[brimkern] g\xE9n\xE9ration interrompue par une perte de device : nouvelle tentative"),qe.delete(l),e(await hn(l))}}function Gs(l,e){let r=l.replace(/<\|[a-z_]+\|>/g,"");if(r=r.replace(/\s*-{2,}\s*(?:E(?:N(?:D(?:\s*O(?:F(?:\s*N(?:O(?:T(?:E(?:S)?)?)?)?)?)?)?)?)?|N(?:O(?:T(?:E(?:S)?)?)?)?)\s*-*\s*$/i,""),e){let t=r.replace(/^\s*(hello|hi|hey|bonjour|salut)\s*[!,.]\s*/i,"");t.trim()&&(r=t)}return r.trimEnd()}function Bs(l){let e=-1;for(let r of cn){let t=l.indexOf(r);t!==-1&&(e===-1||t<e)&&(e=t)}return e===-1?{text:l,hit:!1}:{text:l.slice(0,e),hit:!0}}async function vn(l,e,r,t,n,s,i,a=[]){let o=l instanceof Qe?"rwkv7":"lfm2",u=ln([...a,...e.slice(-Us)],o,r),c=a.some(p=>p.role==="assistant")||e.some(p=>p.role==="assistant"),d="",f=!1;return await(l.residentAvailable?.()?l.generateResident.bind(l):l.generate.bind(l))(u,t,p=>{let h=Bs(p);h.hit&&(f=!0),d=Gs(h.text,c),s?.(d)},()=>f||!!i?.(),{sample:!0,temperature:n,topK:40,repeatPenalty:1.3}),d}var xs,pn,Ps,Us,qe,Ht=ie(()=>{"use strict";Rr();jr();Hr();un();Lt();dn();gn();xs="https://esm.sh/@huggingface/transformers@4.2.0",pn={"lfm2.5-230m":"https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik"},Ps={F16:"f16",F32:"f32",Q4W:"q4",Q8W:"q8",Q3W:"q3"},Us=12;qe=new Map});var bn={};br(bn,{LocalBackend:()=>Ve});var Ve,Kt=ie(()=>{"use strict";Ht();Ve=class{constructor(){this.kind="main"}async preload(e,r){await vt(e,r)}state(e){return qe.get(e)?.state}turn(e,r,t){return mn(e.url,n=>vn(n,e.history,e.system,e.maxTokens,e.temperature,r,()=>!!t?.aborted,e.pinned))}dispose(){}}});function qs(){try{if(typeof document>"u")return"";let l=document.currentScript;if(l?.src)return new URL(l.src,document.baseURI).href}catch{}return""}function yn(l){wn=l}function kn(){return wn||Fs}var Fs,wn,zt=ie(()=>{"use strict";Fs=qs(),wn=""});var An={};br(An,{WorkerBackend:()=>Nt});var Nt,xn=ie(()=>{"use strict";zt();Nt=class{constructor(){this.kind="worker";this.seq=0;this.pending=new Map;this.states=new Map;if(typeof Worker>"u")throw new Error("Worker indisponible");let e=kn();if(!e)throw new Error("URL du script introuvable (import ESM ?) : passez workerUrl");let r=(()=>{try{return location.search}catch{return""}})(),t=`self.__brimkernSearch=${JSON.stringify(r)};importScripts(${JSON.stringify(e)});`,n=new Blob([t],{type:"text/javascript"});this.url=URL.createObjectURL(n),this.worker=new Worker(this.url);let s,i;this.hello=new Promise((a,o)=>{s=a,i=o}),this.worker.onerror=a=>i(new Error(`worker: ${a.message||"\xE9chec de chargement"}`)),this.worker.onmessage=a=>{let o=a.data;if(o.type==="hello"){s();return}let u=this.pending.get(o.id);if(u){if(o.type==="progress"){u.onProgress?.(o.status,o.progress);return}if(o.type==="token"){u.onToken?.(o.text);return}this.pending.delete(o.id),o.type==="error"?u.reject(new Error(o.message)):o.type==="state"?u.resolve(o.state):u.resolve(o.text??"")}}}ready(){return this.hello}send(e,r={}){let t=++this.seq,n=new Promise((s,i)=>{this.pending.set(t,{resolve:s,reject:i,...r}),this.worker.postMessage({...e,id:t})});return{id:t,done:n}}async preload(e,r){await this.hello,this.states.get(e)!=="ready"&&this.states.set(e,"loading");try{await this.send({type:"preload",url:e},{onProgress:r}).done,this.states.set(e,"ready")}catch(t){throw this.states.set(e,"error"),t}}state(e){return this.states.get(e)}async turn(e,r,t){await this.hello;let{id:n,done:s}=this.send({type:"turn",req:e},{onToken:r}),i=()=>this.worker.postMessage({type:"stop",id:n});t?.aborted?i():t?.addEventListener("abort",i,{once:!0});try{let a=await s;return this.states.set(e.url,"ready"),a}finally{t?.removeEventListener("abort",i)}}dispose(){this.worker.terminate(),URL.revokeObjectURL(this.url);for(let e of this.pending.values())e.reject(new Error("worker arr\xEAt\xE9"));this.pending.clear()}}});var Ss={};var Wt,bt,Ee,Un=ie(()=>{"use strict";Kt();Wt=new Ve,bt=new Set,Ee=l=>self.postMessage(l);self.onmessage=async l=>{let e=l.data;if(e.type==="stop"){bt.add(e.id);return}if(e.type==="state"){Ee({type:"state",id:e.id,state:Wt.state(e.url)});return}try{if(e.type==="preload"){await Wt.preload(e.url,(r,t)=>Ee({type:"progress",id:e.id,status:r,progress:t})),Ee({type:"done",id:e.id});return}if(e.type==="turn"){let r=new AbortController,t=new Proxy(r.signal,{get:(u,c)=>c==="aborted"?bt.has(e.id):Reflect.get(u,c)}),n=16,s=0,i=null,a=()=>{i!==null&&(Ee({type:"token",id:e.id,text:i}),i=null,s=Date.now())},o=await Wt.turn(e.req,u=>{i=u,Date.now()-s>=n&&a()},t);a(),Ee({type:"done",id:e.id,text:o}),bt.delete(e.id);return}}catch(r){bt.delete(e.id),Ee({type:"error",id:e.id,message:r instanceof Error?r.message:String(r)})}};Ee({type:"hello"})});var Cn=new Set(["avec","pour","dans","les","des","une","est","sur","par","que","qui","quoi","comment","pourquoi","quand","vous","nous","votre","notre","mais","plus","tout","tous","cette","sont","avez","puis","faire","fait","fais","font","the","and","for","with","what","who","how","why","when","about","your","our","you","are","can","does","did","this","that","from","have","je","tu","il","elle","on","ils","elles","du","de","la","le","un","en","au","aux","ce","ces","cet","se","sa","son","ses","mon","ma","mes","ton","ta","tes","me","te","ne","pas","si","ou","et","ni","car","donc","or","to","in","at","it","is","be","as","an","by","do","no","so","my","he","we","us","me","am","was","were","been","quel","quelle","quels","quelles","which","where","bonjour","salut","hello","merci"]),et=new Map,Rn=2e4;function Bt(l){let e=et.get(l);if(e!==void 0)return e;let r=Ln(l);return et.size>=Rn&&et.clear(),et.set(l,r),r}function Ln(l){let e=l.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");return e.length<=3||(e=e.replace(/(?:ments?|ements?|eront|erait|aient|antes?|ances?|euses?|ables?|tions?|sions?|eaux|eurs?|euse|ique|iques|istes?|ings?|ness|able|ible|less|full?)$/,""),e.length>3&&(e=e.replace(/(?:er|ir|ez|ent|ais|ait|ant|ees?|es?|ed|ly|s)$/,""))),e}function Ke(l){let e=(l.toLowerCase().match(/[\p{L}\p{N}]+/gu)??[]).filter(r=>Cn.has(r)?!1:/\d/.test(r)?!0:r.length>=2);return[...new Set(e)]}function kr(l,e=600){let r=[];return l.forEach((t,n)=>{let s=(t.title||"").trim(),i=(t.text||"").split(/\n\s*\n+/).map(u=>u.trim()).filter(Boolean),a="",o=()=>{a.trim()&&r.push({title:s,text:a.trim(),doc:n}),a=""};for(let u of i){if(u.length>e*1.6){o();let c=u.split(/(?<=[.!?])\s+/),d="";for(let f of c)d&&(d+" "+f).length>e?(r.push({title:s,text:d.trim(),doc:n}),d=f):d=d?`${d} ${f}`:f;d.trim()&&r.push({title:s,text:d.trim(),doc:n});continue}a&&(a+`

`+u).length>e&&o(),a=a?`${a}

${u}`:u}o()}),r}var wr=new WeakMap;function yr(l){let e=new Set;for(let r of l)r.length>=4&&e.add(r.slice(0,4));return e}function Dn(l){let e=wr.get(l);if(e)return e;let r=`${l.title} ${l.text}`.toLowerCase(),t=l.title.toLowerCase(),n=new Set(Ke(r).map(Bt)),s=new Set(Ke(t).map(Bt)),i={hay:r,titre:t,docStems:n,titreStems:s,docPrefix4:yr(n),titrePrefix4:yr(s)};return wr.set(l,i),i}function jn(l,e,r){if(!l.length)return 0;let t=Dn(e),n=0,s=0;for(let i of l){let a=r.get(i)??1;s+=a;let o=Bt(i),u=o.length>=4?o.slice(0,4):null;if(t.hay.includes(i)||t.docStems.has(o)||u!==null&&t.docPrefix4.has(u)){let d=t.titre.includes(i)||t.titreStems.has(o)||u!==null&&t.titrePrefix4.has(u);n+=a*(d?2.2:1)}}return s?n/s:0}function En(l){let e=new Map;for(let n of l)for(let s of Ke(`${n.title} ${n.text}`))e.set(s,(e.get(s)??0)+1);let r=new Map,t=Math.max(1,l.length);for(let[n,s]of e)r.set(n,Math.log(1+t/s));return r}function Ar(l,e,r=1200,t=3,n=.22,s=.5){let i=Ke(l);if(!i.length||!e.length)return[];let a=En(e),o=e.map(p=>({c:p,s:jn(i,p,a)})).filter(p=>p.s>=n).sort((p,h)=>h.s-p.s),u=o.length?o[0].s*s:0,c=o.filter(p=>p.s>=u),d=[],f=new Set,g=r;for(let{c:p,s:h}of c)d.length>=t||p.text.length>g||f.has(p.doc)||(d.push({chunk:p,score:h}),f.add(p.doc),g-=p.text.length);for(let{c:p,s:h}of c){if(d.length>=t)break;d.some(b=>b.chunk===p)||p.text.length>g||(d.push({chunk:p,score:h}),g-=p.text.length)}return d}function qt(l){if(Ke(l).length<2)return!1;let e=l.trim().toLowerCase();return/\?\s*$/.test(e)?!0:/^(?:who|what|when|where|why|how|which|whose|is|are|was|were|do|does|did|can|could|will|would|should|may|have|has|qui|que|quoi|quand|où|pourquoi|comment|combien|quel|quelles?|quels|est|sont|était|avez|peux|pouvez|puis|vous|y a-t-il|est-ce)\b/.test(e)}function Ft(l,e=!1){let r=l.trim();return r?e?/pas cette information|n[’']ai pas (?:cette|ces|d[’']information)|ne (?:sais|dispose) pas|pas en mesure de (?:vous )?(?:aider|répondre|renseigner|fournir)|ne peux pas (?:vous )?(?:aider|fournir|renseigner|répondre)/i.test(r):/do not have (?:that|this|any) information|don[’']t have (?:that|this|any) information|no information (?:about|on)|(?:can[’']t|cannot|not able to|unable to) (?:assist|provide|answer|access|help you with that)/i.test(r):!1}function Hn(l){let e=l.trim().toLowerCase().replace(/[!?.,;:\-_]/g,"").trim();return/^(hi|hello|hey|greetings|good\s+(morning|afternoon|evening|day)|bonjour|salut|coucou|bonsoir|how\s+are\s+you|how\s+are\s+you\s+doing|ça\s+va|ca\s+va|comment\s+vas?-tu|comment\s+allez-vous|who\s+are\s+you|qui\s+es-tu|merci|thanks|thank\s+you|what\s+can\s+you\s+do|que\s+peux-tu\s+faire)$/i.test(e)}function tt(l,e,r=!1){if(e&&Hn(e))return"";if(!l.length)return e&&!qt(e)?r?`

Ce message n\u2019appelle aucune fiche : r\xE9ponds en une phrase courte et aimable.`:`

This message needs no reference note: reply in one short, friendly sentence.`:r?`

Aucune fiche de r\xE9f\xE9rence ne correspond \xE0 cette question. Dis que tu n\u2019as pas cette information : ne devine pas.`:`

No reference note matches this question. Say that you do not have this information: do not guess.`;let t=l.map((s,i)=>`[${i+1}]${s.title?` ${s.title}`:""}
${s.text}`).join(`

`);return`

${r?"R\xE9ponds UNIQUEMENT \xE0 partir des fiches ci-dessous, en fran\xE7ais. Reprends leurs chiffres exactement. Si la r\xE9ponse n\u2019y est pas, dis que tu n\u2019as pas cette information : n\u2019invente jamais pour combler.":"Answer using ONLY the reference notes below. Copy their figures exactly. If the answer is not in them, say you do not have that information: never fill the gap with what you assume."}

--- NOTES ---
${t}
--- END OF NOTES ---`}function xr(l){let e=Array.isArray(l)?l:[l],r=[];for(let t of e)typeof t=="string"&&t.trim()?r.push({text:t}):t&&typeof t=="object"&&typeof t.text=="string"&&t.text.trim()&&r.push({title:t.title,text:t.text});return r}function Kn(l){let e=l.replace(/×/g,"*").replace(/÷/g,"/").replace(/,/g,".").replace(/[\s  ]/g,"").replace(/=+$/,"");if(!e||e.length>200)return null;let r=0,t=()=>e[r],n=()=>{let d=/^\d+(\.\d+)?/.exec(e.slice(r));return d?(r+=d[0].length,parseFloat(d[0])):null},s=()=>{if(t()==="("){r++;let d=u();return d===null||t()!==")"?null:(r++,d)}return n()},i=()=>{if(t()==="-"){r++;let d=i();return d===null?null:-d}return s()},a=()=>{let d=i();if(d===null)return null;if(t()==="^"){r++;let f=a();return f===null?null:Math.pow(d,f)}return d},o=()=>{let d=a();for(;d!==null&&(t()==="*"||t()==="/"||t()==="%");){let f=e[r++],g=a();if(g===null)return null;d=f==="*"?d*g:f==="/"?d/g:d%g}return d},u=()=>{let d=o();for(;d!==null&&(t()==="+"||t()==="-");){let f=e[r++],g=o();if(g===null)return null;d=f==="+"?d+g:d-g}return d},c=u();return r===e.length&&c!==null&&Number.isFinite(c)?c:null}function Pr(l,e=3){let r=[],t=new Set,n=/[\d(][\d\s  .,+\-*/×÷%^()]*[\d)]\s*=?/g;for(let s of l.matchAll(n)){let i=s[0].trim();if(r.length>=e)break;if(t.has(i)||/\d{1,2}[/.]\d{1,2}[/.]\d{2,4}/.test(i)||/\d+:\d+/.test(l.slice(Math.max(0,s.index-1),s.index+i.length+1)))continue;let a=(i.match(/[+\-*/×÷%^]/g)||[]).length,o=/[*×÷%^(]/.test(i)||/=$/.test(i)||a>=2;if(a===0||!o)continue;let u=Kn(i);if(u===null)continue;let c=i.replace(/=+$/,"").trim();/[+\-*/×÷%^]/.test(c)&&(t.add(i),r.push({expr:c,value:u}))}return r}function Ur(l){let e=Math.round(l*1e9)/1e9;return Number.isInteger(e),String(e)}function rt(l){return new Date().toLocaleDateString(l==="fr"?"fr-FR":"en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}var zn=1e4,Nn=600;function nt(l){if(!Array.isArray(l))return[];let e=[];for(let r of l){if(r==="calc"||r==="date"){e.push(r);continue}let t=r;if(t&&typeof t=="object"&&typeof t.name=="string"&&t.name.trim()&&typeof t.run=="function"&&(t.match instanceof RegExp||typeof t.match=="function")){e.push(t);continue}console.warn("[brimkern] outil ignor\xE9 (attendu : 'calc', 'date', ou { name, match, run }) :",r)}return e}var _r=l=>l.includes("date");function Gr(l){return l?`
(Date du jour : ${rt("fr")}.)`:`
(Today's date: ${rt("en")}.)`}var Wn=/\b(?:today|tonight|what\s+day|which\s+day|what\s+date|what\s+year|what\s+month|current\s+(?:date|day|year)|aujourd(?:'|’)hui|quel\s+jour|quelle\s+date|quelle\s+ann[ée]e|quel\s+mois|on\s+est\s+quel)\b/i,Qn=(l,e)=>new Promise((r,t)=>{let n=setTimeout(()=>t(new Error(`outil sans r\xE9ponse apr\xE8s ${e} ms`)),e);l.then(s=>{clearTimeout(n),r(s)},s=>{clearTimeout(n),t(s)})});async function St(l,e,r){let t=[];for(let n of l){if(n==="date"){Wn.test(e)&&t.push({name:"date",result:rt(r?"fr":"en")});continue}if(n==="calc"){let s=Pr(e);s.length&&t.push({name:r?"calculatrice":"calculator",result:s.map(i=>`${i.expr} = ${Ur(i.value)}`).join(" ; ")});continue}try{if(!(n.match instanceof RegExp?n.match.test(e):n.match(e)))continue;let i=await Qn(Promise.resolve(n.run(e)),zn),a=String(i??"").replace(/\s+/g," ").trim().slice(0,Nn);a&&t.push({name:n.name.replace(/\s+/g," ").trim().slice(0,40),result:a})}catch(s){console.error(`[brimkern] outil \xAB ${n.name} \xBB a \xE9chou\xE9 :`,s)}}return t}function st(l,e){if(!l.length)return"";let r=l.map(t=>e?`${t.name} : ${t.result}`:`${t.name}: ${t.result}`).join(" \xB7 ");return e?`[R\xE9sultats d\u2019outils locaux. Exacts, utilise-les tels quels : ${r}]`:`[Local tool results. Exact values, use them as-is: ${r}]`}Ht();async function Pn(l){let{LocalBackend:e}=await Promise.resolve().then(()=>(Kt(),bn));if(l!==!0)return new e;try{let{WorkerBackend:r}=await Promise.resolve().then(()=>(xn(),An)),t=new r;return await t.ready(),t}catch(r){return console.warn("[brimkern] Web Worker indisponible : inf\xE9rence sur le thread principal",r),new e}}zt();var Ts=typeof self<"u"&&typeof self.importScripts=="function"&&typeof document>"u";Ts&&Promise.resolve().then(()=>(Un(),Ss));var yt=null,$t=null,Qt;function Ye(){return yt||(yt=Pn(Qt).then(l=>($t=l,l))),yt}var Os=()=>$t?.kind??"pending";function It(l){if(l.workerUrl&&yn(l.workerUrl),l.worker!==void 0){if(yt&&Qt!==l.worker){console.warn("[brimkern] option `worker` ignor\xE9e : le backend est d\xE9j\xE0 d\xE9marr\xE9 et partag\xE9 par la page.");return}Qt=l.worker}}var Ms=`
Answer briefly and honestly. If you do not know something, say so: never invent facts or details.
You have no tools and no internet access: never emit tool calls, reply in plain text only.`,Cs=`
Answer briefly and honestly. If you do not know something, say so: never invent facts or details.
Bracketed tool results in the message are exact facts: use them as-is. Never emit tool calls yourself, reply in plain text only.`;function Gn(){let l=new Map;return{on(e,r){let t=l.get(e);return t||l.set(e,t=new Set),t.add(r),()=>{t.delete(r)}},emit(e,...r){let t=l.get(e);if(t)for(let n of[...t])try{n(...r)}catch(s){console.error("[brimkern] \xE9couteur `"+e+"` a lev\xE9 :",s)}},clear(){l.clear()}}}function Je(l){if(!Array.isArray(l))return[];let e=[];for(let r of l){let t=r?.role,n=r?.content;(t==="user"||t==="assistant")&&typeof n=="string"&&n.trim()&&e.push({role:t,content:n})}return e}function Xe(l){return l.lang?l.lang==="fr":l.system?/[àâäéèêëîïôöùûüç]|\b(?:bonjour|salut|vous|tu|réponds|conseiller|boutique|aide|aidez|client|magasin)\b/i.test(l.system):!!(typeof document<"u"&&/^fr\b/i.test(document.documentElement.lang||"")||typeof navigator<"u"&&/^fr\b/i.test(navigator.language||""))}var Bn={en:{ouvrir:"Open the chat",fermer:"Close",placeholder:"Type a message\u2026",note:"Local AI \u2014 runs on your GPU, nothing is sent anywhere.",erreur:"Error: ",vide:"Sorry, I can only answer in plain text here: could you rephrase?",aide:"I\u2019m here to help \u2014 what would you like to know?",mo:"MB",sources:"Sources:",phases:{init:"Starting up\u2026",download:"downloading the model\u2026",tokenizer:"tokenizer\u2026",gpu:"weights to the GPU\u2026"},erreurs:{"no-webgpu":"This browser does not support WebGPU: the local assistant cannot run here."}},fr:{ouvrir:"Ouvrir le chat",fermer:"Fermer",placeholder:"\xC9cris un message\u2026",note:"IA locale \u2014 tourne sur votre GPU, aucune donn\xE9e envoy\xE9e.",erreur:"Erreur : ",vide:"D\xE9sol\xE9, je ne peux r\xE9pondre qu\u2019en texte simple ici : pouvez-vous reformuler ?",aide:"Je suis l\xE0 pour vous aider \u2014 que voulez-vous savoir ?",mo:"Mo",sources:"Sources :",phases:{init:"initialisation\u2026",download:"t\xE9l\xE9chargement du mod\xE8le\u2026",tokenizer:"tokenizer\u2026",gpu:"poids sur le GPU\u2026"},erreurs:{"no-webgpu":"Ce navigateur ne prend pas en charge WebGPU : l\u2019assistant local ne peut pas tourner ici."}}};function Rs(l,e){if(!e)return l;let r=n=>typeof n=="string"&&!!n.trim(),t={...l.phases};if(e.phases&&typeof e.phases=="object")for(let[n,s]of Object.entries(e.phases))r(s)&&(t[n]=s);return{...l,...r(e.open)?{ouvrir:e.open}:null,...r(e.close)?{fermer:e.close}:null,...r(e.placeholder)?{placeholder:e.placeholder}:null,...r(e.note)?{note:e.note}:null,...r(e.error)?{erreur:e.error}:null,...r(e.empty)?{vide:e.empty}:null,...r(e.help)?{aide:e.help}:null,...r(e.sources)?{sources:e.sources}:null,...r(e.mb)?{mo:e.mb}:null,phases:t}}var Ls=(l,e)=>l.phases[e]??e,_n=(l,e)=>e?.code&&l.erreurs[e.code]||e?.message||String(e);function kt(l){let e=nt(l.tools),r=_r(e)?Gr(Xe(l)):"",t=(l.system||"You are a helpful assistant.")+(e.length?Cs:Ms)+r,n=c=>c.flatMap(d=>[{role:"user",content:d.user},{role:"assistant",content:d.assistant}]),s=e.length?Ds(Xe(l)):[];if(!l.knowledge)return{system:()=>t,userTurn:(c,d)=>({text:d?`${c}

${d}`:c,sources:[],conversationnel:!1}),pinned:n([...s,...l.examples||[]])};let i=kr(xr(l.knowledge)),a=l.knowledgeBudget??1200,o=Xe(l),u=o?t+`

Le message utilisateur peut inclure des fiches de r\xE9f\xE9rence entre des balises ---. Dans ce cas, r\xE9ponds uniquement \xE0 partir de ces fiches en citant fid\xE8lement leurs informations dans la langue de la question. Si aucune note ne correspond, indique poliment que tu n\u2019as pas cette information.`:t+`

The user message may include reference notes between --- markers. When it does, answer from those notes and quote their figures exactly. When it says no note matches, say you do not have that information.`;return{system:()=>u,userTurn:(c,d)=>{let f=Ar(c,i,a);if(d&&!f.length)return{text:`${c}

${d}`,sources:[],conversationnel:!1};let g=tt(f.map(h=>h.chunk),c,o).trim(),p=h=>d?`${h}

${d}`:h;return{text:g?`${p(g)}

Question: ${c}`:p(c),sources:g?f.map(({chunk:h,score:b})=>({title:h.title,text:h.text,score:b,doc:h.doc})):[],conversationnel:!f.length&&!qt(c)}},pinned:n([...js(o),...s,...l.examples||[]])}}function Ds(l=!1){let e=(r,t)=>`${r}

${st(t,l)}`;return l?[{user:e("Combien font 45*3 ?",[{name:"calculatrice",result:"45*3 = 135"}]),assistant:"45*3 = 135."},{user:e("Il vous en reste en rayon ?",[{name:"rayon",result:"3 exemplaires en rayon"}]),assistant:"Oui \u2014 il en reste 3 exemplaires en rayon."}]:[{user:e("What is 45*3?",[{name:"calculator",result:"45*3 = 135"}]),assistant:"45*3 = 135."},{user:e("Do you still have some on the shelf?",[{name:"shelf",result:"3 items on the shelf"}]),assistant:"Yes \u2014 3 items are on the shelf."}]}function js(l=!1){let e=(n,s)=>({title:n,text:s,doc:0}),r=(n,s)=>`${tt(n,void 0,l).trim()}

Question: ${s}`,t=(n,s)=>`${tt(n,s,l).trim()}

Question: ${s}`;return l?[{user:"Bonjour !",assistant:"Bonjour ! Comment puis-je vous aider ?"},{user:r([e("Guide des tailles",`Tableau des correspondances :
- Pointure EU 38 : 24,0 cm (US 6,5)
- Pointure EU 39 : 24,5 cm (US 7,0)
- Pointure EU 41 : 26,0 cm (US 8,0)`)],"Je fais du 41, quelle taille en cm ?"),assistant:"La pointure 41 correspond \xE0 26,0 cm."},{user:r([e("Retours","Les retours sont gratuits sous 14 jours. Le remboursement est effectu\xE9 sous 3 jours ouvr\xE9s.")],"Combien de temps pour retourner un article ?"),assistant:"Vous disposez de 14 jours pour retourner un article."},{user:r([],"Qui a gagn\xE9 la Coupe du Monde 1998 ?"),assistant:"Je n\u2019ai pas cette information dans mes fiches."},{user:t([],"Tu es un robot ?"),assistant:"Je suis un assistant automatique, oui. Comment puis-je vous aider ?"}]:[{user:"Hello!",assistant:"Hello! How can I help you today?"},{user:r([e("Size guide",`Size conversions:
- Size EU 38: 24.0 cm (US 6.5)
- Size EU 39: 24.5 cm (US 7.0)
- Size EU 41: 26.0 cm (US 8.0)`)],"I wear a 41, what is that in cm?"),assistant:"A size 41 is 26.0 cm."},{user:r([e("Returns","Returns are free within 14 days. Refunds are issued within 3 working days.")],"How long do I have to return an item?"),assistant:"You have 14 days to return an item."},{user:r([],"Who won the 1998 World Cup?"),assistant:"I do not have that information in my notes."},{user:t([],"Are you a robot?"),assistant:"I am an automated assistant, yes. How can I help?"}]}function qn(l={}){It(l);let e=Ie(l.model),r=l.maxTokens||220,t=l.knowledge,n=kt(l),s=Xe(l),i=Je(l.history),a=[],o=Gn(),u=!1,c=!1,d=!1,f=()=>l.temperature??(t?.25:.55),g=nt(l.tools),p=h=>{if(u)throw new Error(`brimkern: ${h} impossible pendant une g\xE9n\xE9ration`)};return{async ask(h,b={}){if(c)throw new Error("session d\xE9truite");if(u)throw new Error("g\xE9n\xE9ration d\xE9j\xE0 en cours sur cette session");u=!0,i.push({role:"user",content:h}),o.emit("message",{role:"user",content:h});try{let k=await St(g,h,s);for(let v of k)o.emit("tool",v);let{text:F,sources:M,conversationnel:S}=n.userTurn(h,st(k,s));a=M,b.onSources?.(M);let j=[...i.slice(0,-1),{role:"user",content:F}],z=await Ye();await z.preload(e,(v,m)=>o.emit("progress",v,m)),d||(d=!0,o.emit("ready"));let A={url:e,history:j,system:n.system(h),maxTokens:r,temperature:f(),pinned:n.pinned},w=await z.turn(A,b.onToken,b.signal);return b.signal?.aborted?(i.pop(),""):(S&&Ft(w,s)&&(w=Bn[s?"fr":"en"].aide),i.push({role:"assistant",content:w}),o.emit("message",{role:"assistant",content:w,sources:M}),w)}catch(k){throw i.pop(),o.emit("error",k instanceof Error?k:new Error(String(k))),k}finally{u=!1}},reset(){i=[],a=[]},destroy(){c=!0,i=[],a=[],o.clear()},get history(){return i.slice()},get lastSources(){return a.slice()},setHistory(h){p("setHistory"),i=Je(h)},setKnowledge(h){p("setKnowledge"),t=h,n=kt({...l,knowledge:h}),a=[]},on:o.on}}function Es(){if(document.getElementById("bk-style"))return;let l=document.createElement("style");l.id="bk-style",l.textContent=`
  .bk-fab{position:fixed;right:20px;bottom:20px;width:56px;height:56px;border-radius:16px;background:var(--bk-accent);color:#fff;border:none;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.25);font-size:24px;z-index:2147483000;display:flex;align-items:center;justify-content:center;transition:transform .15s}
  .bk-fab:hover{transform:translateY(-2px)}
  .bk-panel{position:fixed;right:20px;bottom:88px;width:360px;max-width:calc(100vw - 40px);height:520px;max-height:calc(100vh - 120px);background:var(--bk-bg,#f2efe8);border:1px solid var(--bk-border,#e0dccf);border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.28);z-index:2147483000;display:none;flex-direction:column;overflow:hidden;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;color:var(--bk-text,#1a1a1a)}
  .bk-panel.bk-open{display:flex}
  .bk-hd{padding:12px 14px;background:var(--bk-surface,#fff);border-bottom:1px solid var(--bk-border2,#ece8dd);display:flex;align-items:center;gap:8px;font-weight:700;font-size:14px}
  .bk-hd .bk-dot{width:8px;height:8px;border-radius:50%;background:var(--bk-accent)}
  .bk-hd .bk-x{margin-left:auto;background:none;border:none;cursor:pointer;color:var(--bk-muted,#8b887f);font-size:18px;line-height:1}
  .bk-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px}
  .bk-m{max-width:82%;padding:8px 12px;border-radius:12px;font-size:14px;line-height:1.45;white-space:pre-wrap;word-wrap:break-word}
  .bk-m.bk-u{align-self:flex-end;background:var(--bk-accent);color:#fff;border-bottom-right-radius:4px}
  .bk-m.bk-a{align-self:flex-start;background:var(--bk-surface,#fff);border:1px solid var(--bk-border2,#ece8dd);border-bottom-left-radius:4px}
  .bk-src{align-self:flex-start;max-width:82%;margin-top:-6px;font-size:10.5px;line-height:1.4;color:var(--bk-muted,#8b887f)}
  .bk-src b{font-weight:600;color:var(--bk-muted2,#6f6c64)}
  .bk-foot{padding:10px;border-top:1px solid var(--bk-border2,#ece8dd);background:var(--bk-surface,#fff);display:flex;gap:8px}
  .bk-in{flex:1;border:1px solid var(--bk-border,#e0dccf);border-radius:10px;padding:9px 11px;font-size:14px;font-family:inherit;background:var(--bk-surface,#fff);color:var(--bk-text,#1a1a1a);resize:none;outline:none}
  .bk-in:focus{border-color:var(--bk-accent)}
  .bk-send{background:var(--bk-accent);color:#fff;border:none;border-radius:10px;padding:0 14px;cursor:pointer;font-size:14px}
  .bk-send:disabled{opacity:.5;cursor:default}
  .bk-note{font-size:10.5px;color:var(--bk-muted,#8b887f);text-align:center;padding:4px 8px 8px}
  `,document.head.appendChild(l)}function Hs(l){if(!l)return"#c72c1e";if(/^#[0-9a-fA-F]{3,8}$/.test(l))return l;try{if(typeof CSS<"u"&&CSS.supports("color",l)&&!/[{};()]/.test(l))return l}catch{}return"#c72c1e"}function Ks(l,e){let r=l.knowledge,t=kt(l),n=Xe(l),s=Rs(Bn[n?"fr":"en"],l.labels),i=Hs(l.accent),a=l.title||"Assistant",o=l.maxTokens||220,u=nt(l.tools);Es();let c=document.createElement("button");c.className="bk-fab",c.setAttribute("aria-label",s.ouvrir),c.textContent="\u{1F4AC}";let d=document.createElement("div");if(d.className="bk-panel",c.style.setProperty("--bk-accent",i),d.style.setProperty("--bk-accent",i),l.position==="bottom-left")for(let U of[c,d])U.style.left="20px",U.style.right="auto";let f=(U,R,H)=>typeof U=="number"&&Number.isFinite(U)?Math.min(H,Math.max(R,Math.round(U))):null,g=f(l.width,300,480),p=f(l.height,380,720);g&&(d.style.width=`${g}px`),p&&(d.style.height=`${p}px`);let h={"--bk-bg":"#211f1c","--bk-surface":"#2c2a26","--bk-border":"#413e38","--bk-border2":"#3a3733","--bk-text":"#f0eee8","--bk-muted":"#a29e93","--bk-muted2":"#c6c2b8"},b=U=>{for(let R of[c,d])for(let[H,Q]of Object.entries(h))U?R.style.setProperty(H,Q):R.style.removeProperty(H)},k=null,F=null;l.theme==="dark"?b(!0):l.theme==="auto"&&typeof matchMedia=="function"&&(k=matchMedia("(prefers-color-scheme: dark)"),b(k.matches),F=U=>b(U.matches),k.addEventListener("change",F)),d.innerHTML=`
    <div class="bk-hd"><span class="bk-dot"></span><span>${wt(a)}</span><button class="bk-x" aria-label="${wt(s.fermer)}">\xD7</button></div>
    <div class="bk-msgs"></div>
    <div class="bk-foot"><textarea class="bk-in" rows="1" placeholder="${wt(s.placeholder)}"></textarea><button class="bk-send">\u2191</button></div>
    <div class="bk-note">${wt(s.note)}</div>`,document.body.appendChild(c),document.body.appendChild(d);let M=d.querySelector(".bk-msgs"),S=d.querySelector(".bk-in"),j=d.querySelector(".bk-send"),z=d.querySelector(".bk-x"),A=Je(l.history),w=!1,v=!1,m=!1,_=new AbortController,y=(U,R)=>{let H=document.createElement("div");return H.className=`bk-m ${U==="user"?"bk-u":"bk-a"}`,H.textContent=R,M.appendChild(H),M.scrollTop=M.scrollHeight,H},x=U=>{if(!l.showSources||!U.length)return;let R=document.createElement("div");R.className="bk-src";let H=document.createElement("b");H.textContent=`${s.sources} `,R.appendChild(H),R.appendChild(document.createTextNode(U.map((Q,V)=>`[${V+1}] ${Q.title||Q.text.slice(0,40).replace(/\s+/g," ").trim()+"\u2026"}`).join(" \xB7 "))),M.appendChild(R),M.scrollTop=M.scrollHeight},P=()=>{M.textContent="";for(let U of A)y(U.role,U.content)};A.length?P():l.greeting&&(A.push({role:"assistant",content:l.greeting}),y("assistant",l.greeting));let q=Ie(l.model),B=()=>{if(!v){v=!0;let U=y("assistant",s.phases.init);U.classList.add("bk-status"),Ye().then(R=>R.preload(q,(H,Q)=>{e.emit("progress",H,Q);let V=Ls(s,H);U.textContent=Q?.total?`${V} ${Math.round(Q.loaded/1048576)} / ${Math.round(Q.total/1048576)} ${s.mo}`:V})).then(()=>{U.remove(),e.emit("ready")}).catch(R=>{U.textContent=s.erreur+_n(s,R),v=!1,e.emit("error",R instanceof Error?R:new Error(String(R)))})}return Ye()},T=async U=>{w=!0,j.disabled=!0,A.push({role:"user",content:U}),y("user",U),e.emit("message",{role:"user",content:U});let R=y("assistant","\u2026");try{await B();let H=await St(u,U,n);for(let C of H)e.emit("tool",C);let{text:Q,sources:V,conversationnel:I}=t.userTurn(U,st(H,n)),X=[...A.slice(0,-1),{role:"user",content:Q}],O={url:q,history:X,system:t.system(U),maxTokens:o,temperature:r?.25:.55,pinned:t.pinned},G=await(await Ye()).turn(O,C=>{R.textContent=C||"\u2026",M.scrollTop=M.scrollHeight},_.signal);return m?"":(G?I&&Ft(G,n)&&(G=s.aide):G=s.vide,R.textContent=G,A.push({role:"assistant",content:G}),x(V),e.emit("message",{role:"assistant",content:G,sources:V}),G)}catch(H){throw R.textContent=s.erreur+_n(s,H),e.emit("error",H instanceof Error?H:new Error(String(H))),H}finally{w=!1,j.disabled=!1,m||S.focus()}},D=()=>{let U=S.value.trim();!U||w||m||(S.value="",T(U).catch(()=>{}))},E=U=>{m||d.classList.contains("bk-open")!==U&&(d.classList.toggle("bk-open",U),U&&(S.focus(),B()),e.emit(U?"open":"close"))};return c.onclick=()=>E(!d.classList.contains("bk-open")),z.onclick=()=>E(!1),j.onclick=D,S.onkeydown=U=>{U.key==="Enter"&&!U.shiftKey&&(U.preventDefault(),D())},{open:()=>E(!0),close:()=>E(!1),toggle:()=>E(!d.classList.contains("bk-open")),ask(U){if(m)return Promise.reject(new Error("brimkern: widget d\xE9mont\xE9"));let R=String(U??"").trim();return R?w?Promise.reject(new Error("g\xE9n\xE9ration d\xE9j\xE0 en cours sur ce widget")):(E(!0),T(R)):Promise.reject(new Error("brimkern: ask() attend une question non vide"))},destroy(){m||(m=!0,_.abort(),k&&F&&k.removeEventListener("change",F),c.onclick=null,z.onclick=null,j.onclick=null,S.onkeydown=null,c.remove(),d.remove(),A=[])},setKnowledge(U){r=U,t=kt({...l,knowledge:U})},setHistory(U){if(w)throw new Error("brimkern: setHistory impossible pendant une g\xE9n\xE9ration");A=Je(U),P()},history:()=>A.slice(),el:d}}function wt(l){return l.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}var zs=(l={})=>{let e=Gn(),r=null,t=!1,n=!1,s=[],i=o=>{r?o(r):!t&&!n&&s.push(o)},a=()=>{if(!(n||r)){r=Ks(l,e);for(let o of s.splice(0))o(r)}};return typeof window>"u"||typeof document>"u"?(t=!0,console.warn("[brimkern] embed() ignor\xE9 : aucun DOM (rendu serveur ?). Appelez-le dans un effet client.")):(It(l),document.body?a():window.addEventListener("DOMContentLoaded",a,{once:!0})),{open:()=>i(o=>o.open()),close:()=>i(o=>o.close()),toggle:()=>i(o=>o.toggle()),ask(o){return t?Promise.reject(new Error("brimkern: ask() sans DOM (rendu serveur ?)")):n?Promise.reject(new Error("brimkern: widget d\xE9mont\xE9")):new Promise((u,c)=>i(d=>d.ask(o).then(u,c)))},destroy(){n=!0,s.length=0,r?.destroy(),r=null,e.clear()},setKnowledge:o=>i(u=>u.setKnowledge(o)),setHistory:o=>i(u=>u.setHistory(o)),get history(){return r?r.history():Je(l.history)},get el(){return r?r.el:null},on:e.on}};var Ns=async l=>{if(typeof l!="object"||l===null||typeof l.prompt!="string")throw new TypeError(`Brimkern.generate expects a single object: generate({ prompt: "\u2026", model?, system? }). Received ${typeof l}${typeof l=="object"&&l?" without a `prompt` string":""}.`);return qn(l).ask(l.prompt,{onToken:l.onToken,signal:l.signal,onSources:l.onSources})},Ws=(l={})=>(It(l),typeof navigator<"u"&&"gpu"in navigator?Ye().then(e=>e.preload(Ie(l.model),l.onProgress)).then(()=>!0).catch(()=>!1):Promise.resolve(!1)),Qs=l=>typeof navigator>"u"||!("gpu"in navigator)?"unavailable":$t?.state(Ie(l))??"idle";typeof window<"u"&&(window.Brimkern={embed:zs,createSession:qn,generate:Ns,preload:Ws,status:Qs,runtime:Os});})();
