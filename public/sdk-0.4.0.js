"use strict";(()=>{var ss=Object.defineProperty;var ne=(l,e,r)=>()=>{if(r)throw r[0];try{return l&&(e=l(l=0)),e}catch(t){throw r=[t],t}};var Mr=(l,e)=>{for(var r in e)ss(l,r,{get:e[r],enumerable:!0})};function Oe(l){let e=new Float32Array(1),r=new Uint32Array(e.buffer);e[0]=l;let t=r[0],n=t>>16&32768,s=(t>>23&255)-127+15,i=t&8388607;return s<=0?n:s>=31?n|31743:(i=(i>>13)+(i>>12&1),i===1024&&(i=0,s+=1),n|s<<10|i&1023)}function fe(l){let e=l>>15&1,r=l>>10&31,t=l&1023,n;return r===0?n=t*59604645e-15:r===31?n=t?NaN:1/0:n=(1+t/1024)*2**(r-15),e===1?-n:n}var Ne=ne(()=>{"use strict"});function _e(l){let e=l.length;if(e%xe!==0)throw new Error(`q4web: length ${e} not a multiple of ${xe}`);let r=e/xe,t=new Uint8Array(e/2),n=new Uint16Array(r),s=new Uint16Array(r);for(let i=0;i<r;i++){let a=i*xe,o=1/0,u=-1/0;for(let h=0;h<xe;h++){let b=l[a+h];b<o&&(o=b),b>u&&(u=b)}let c=(u-o)/15||1e-8,d=Oe(c),f=Oe(o);n[i]=d,s[i]=f;let p=fe(d)||1e-8,g=fe(f);for(let h=0;h<xe;h++){let b=Math.round((l[a+h]-g)/p);b=b<0?0:b>15?15:b;let w=a+h;(h&1)===0?t[w>>1]=b:t[w>>1]|=b<<4}}return{nibbles:t,scales:n,mins:s,nElems:e}}function be(l,e){let r=e/xe,t=e/2,n=l.slice(0,t),s=new Uint16Array(r),i=new Uint16Array(r),a=new DataView(l.buffer,l.byteOffset);for(let o=0;o<r;o++)s[o]=a.getUint16(t+o*2,!0);for(let o=0;o<r;o++)i[o]=a.getUint16(t+r*2+o*2,!0);return{nibbles:n,scales:s,mins:i,nElems:e}}function ge(l){let e=new Float32Array(l.nElems),r=l.nElems/xe;for(let t=0;t<r;t++){let n=fe(l.scales[t]),s=fe(l.mins[t]),i=t*xe;for(let a=0;a<xe;a++){let o=i+a,u=l.nibbles[o>>1],c=(a&1)===0?u&15:u>>4;e[o]=c*n+s}}return e}var xe,$e=ne(()=>{"use strict";Ne();xe=32});function Ge(l){let e=l.length;if(e%Ue!==0)throw new Error(`q8web: length ${e} not a multiple of ${Ue}`);let r=e/Ue,t=new Int8Array(e),n=new Uint16Array(r);for(let s=0;s<r;s++){let i=s*Ue,a=0;for(let d=0;d<Ue;d++){let f=Math.abs(l[i+d]);f>a&&(a=f)}let o=a/127||1e-8,u=Oe(o);n[s]=u;let c=fe(u)||1e-8;for(let d=0;d<Ue;d++){let f=Math.round(l[i+d]/c);f=f<-127?-127:f>127?127:f,t[i+d]=f}}return{codes:t,scales:n,nElems:e}}function ye(l,e){let r=e/Ue,t=new Int8Array(l.buffer.slice(l.byteOffset,l.byteOffset+e)),n=new Uint16Array(r),s=new DataView(l.buffer,l.byteOffset);for(let i=0;i<r;i++)n[i]=s.getUint16(e+i*2,!0);return{codes:t,scales:n,nElems:e}}function me(l){let e=new Float32Array(l.nElems),r=l.nElems/Ue;for(let t=0;t<r;t++){let n=fe(l.scales[t]),s=t*Ue;for(let i=0;i<Ue;i++)e[s+i]=l.codes[s+i]*n}return e}var Ue,Ie=ne(()=>{"use strict";Ne();Ue=32});function Wr(l){let e=l.length;if(e%Be!==0)throw new Error(`q3web: length ${e} not a multiple of ${Be}`);let r=e/Be,t=new Uint32Array(e/16),n=new Uint32Array(e/32),s=new Uint16Array(r),i=new Uint16Array(r);for(let a=0;a<r;a++){let o=a*Be,u=1/0,c=-1/0;for(let b=0;b<Be;b++){let w=l[o+b];w<u&&(u=w),w>c&&(c=w)}let d=(c-u)/7||1e-8,f=Oe(d),p=Oe(u);s[a]=f,i[a]=p;let g=fe(f)||1e-8,h=fe(p);for(let b=0;b<Be;b++){let w=Math.round((l[o+b]-h)/g);w=w<0?0:w>7?7:w;let _=o+b;t[_>>4]|=(w&3)<<(_&15)*2,n[_>>5]|=w>>2<<(_&31)}}return{lo:t,hi:n,scales:s,mins:i,nElems:e}}function ke(l,e){let r=e/Be,t=e/16,n=e/32,s=t*4,i=n*4,a=new DataView(l.buffer,l.byteOffset),o=new Uint32Array(t),u=new Uint32Array(n),c=new Uint16Array(r),d=new Uint16Array(r);for(let g=0;g<t;g++)o[g]=a.getUint32(g*4,!0);for(let g=0;g<n;g++)u[g]=a.getUint32(s+g*4,!0);let f=s+i,p=f+r*2;for(let g=0;g<r;g++)c[g]=a.getUint16(f+g*2,!0);for(let g=0;g<r;g++)d[g]=a.getUint16(p+g*2,!0);return{lo:o,hi:u,scales:c,mins:d,nElems:e}}function Ce(l){let e=new Float32Array(l.nElems),r=l.nElems/Be;for(let t=0;t<r;t++){let n=fe(l.scales[t]),s=fe(l.mins[t]),i=t*Be;for(let a=0;a<Be;a++){let o=i+a,u=l.lo[o>>4]>>(o&15)*2&3|(l.hi[o>>5]>>(o&31)&1)<<2;e[o]=u*n+s}}return e}var Be,Ve=ne(()=>{"use strict";Ne();Be=32});var Qr,$r,Ir=ne(()=>{"use strict";Qr={matmul:`
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
		}`},$r=`
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
	}`});var gt,Vr=ne(()=>{"use strict";gt=class{constructor(e){this.sets=[];this.cur=0;this.next=0;this.names=[];this.acc=new Map;this.dropped=0;this.pending=[];this.fenetre=0;this.device=e;let r=globalThis;for(let t=0;t<2;t++)this.sets.push({qs:e.createQuerySet({type:"timestamp",count:4096}),resolve:e.createBuffer({size:4096*8,usage:r.GPUBufferUsage.QUERY_RESOLVE|r.GPUBufferUsage.COPY_SRC}),read:e.createBuffer({size:4096*8,usage:r.GPUBufferUsage.COPY_DST|r.GPUBufferUsage.MAP_READ}),busy:!1})}slot(e){if(this.next+2>4096&&(this.rotate(),this.next+2>4096))return this.dropped++,null;let r=this.sets[this.cur];if(r.busy)return this.dropped++,null;let t=this.next;return this.next+=2,this.names.push(e),{querySet:r.qs,beginningOfPassWriteIndex:t,endOfPassWriteIndex:t+1}}rotate(){let e=this.cur,r=this.sets[e],t=this.names,n=this.next;if(this.cur=(this.cur+1)%2,this.next=0,this.names=[],!n||r.busy)return;r.busy=!0;let s=this.fenetre,i=this.device.createCommandEncoder();i.resolveQuerySet(r.qs,0,n,r.resolve,0),i.copyBufferToBuffer(r.resolve,0,r.read,0,n*8),this.device.queue.submit([i.finish()]);let a=globalThis,o=r.read.mapAsync(a.GPUMapMode.READ,0,n*8).then(()=>{let u=new BigUint64Array(r.read.getMappedRange(0,n*8).slice(0));if(r.read.unmap(),s===this.fenetre)for(let c=0;c<t.length;c++){let d=u[c*2],f=u[c*2+1];if(!d||!f||f<=d)continue;let p=Number(f-d),g=this.acc.get(t[c]);g?(g.calls++,g.ns+=p):this.acc.set(t[c],{calls:1,ns:p})}}).catch(()=>{}).finally(()=>{r.busy=!1});this.pending.push(o)}async report(){this.rotate();let e=this.pending;this.pending=[],await Promise.all(e);let r=0,t=0;for(let s of this.acc.values())r+=s.ns,t+=s.calls;return{passes:[...this.acc.entries()].map(([s,i])=>({name:s,calls:i.calls,totalMs:i.ns/1e6,meanUs:i.ns/i.calls/1e3,share:r?i.ns/r:0,reliable:i.calls>=50})).sort((s,i)=>i.totalMs-s.totalMs),totalMs:r/1e6,samples:t,dropped:this.dropped,quantumUs:100}}reset(){this.fenetre++,this.acc.clear(),this.dropped=0}destroy(){for(let e of this.sets)try{e.qs.destroy(),e.resolve.destroy(),e.read.destroy()}catch{}this.sets=[]}}});function bs(){if(Yr!==null)return Yr;try{let l=globalThis.__brimkernSearch;if(typeof l=="string")return l}catch{}try{return typeof location<"u"?location.search:""}catch{return""}}function se(l){try{return new URLSearchParams(bs()).get(l)}catch{return null}}var Yr,Et=ne(()=>{"use strict";Yr=null});function Pe(l){let e=l>>15&1,r=l>>10&31,t=l&1023,n;return r===0?n=t*59604645e-15:r===31?n=65504:n=(1+t/1024)*2**(r-15),e===1?-n:n}function De(l){let e=new Float32Array(1),r=new Uint32Array(e.buffer);e[0]=l;let t=r[0],n=t>>16&32768,s=(t>>23&255)-127+15,i=t&8388607;return s<=0?n:s>=31?n|31743:(i=(i>>13)+(i>>12&1),i===1024&&(i=0,s+=1),n|s<<10|i&1023)}function vs(l,e){let r=new Float32Array(e*256),t=new DataView(l.buffer,l.byteOffset);for(let n=0;n<e;n++){let s=n*144,i=Pe(t.getUint16(s,!0)),a=Pe(t.getUint16(s+2,!0)),o=f=>{let p=g=>l[s+4+g];return f<4?[p(f)&63,p(f+4)&63]:[p(f+4)&15|p(f-4)>>6<<4,p(f+4)>>4|p(f)>>6<<4]},u=n*256,c=0,d=0;for(let f=0;f<256;f+=64){let[p,g]=o(c),h=i*p,b=a*g,[w,_]=o(c+1),G=i*w,B=a*_;for(let C=0;C<32;C++){let E=l[s+16+d+C];r[u+f+C]=h*(E&15)-b,r[u+f+32+C]=G*(E>>4)-B}d+=32,c+=2}}return r}function Ye(l){return l>127?l-256:l}function ws(l,e){let r=new Float32Array(e*32),t=new DataView(l.buffer,l.byteOffset);for(let n=0;n<e;n++){let s=n*34,i=Pe(t.getUint16(s,!0));for(let a=0;a<32;a++)r[n*32+a]=i*Ye(l[s+2+a])}return r}function ys(l,e){let r=new Float32Array(e*32),t=new DataView(l.buffer,l.byteOffset);for(let n=0;n<e;n++){let s=n*22,i=Pe(t.getUint16(s,!0)),a=t.getUint32(s+2,!0);for(let o=0;o<16;o++){let u=l[s+6+o],c=a>>>o<<4&16,d=a>>>o+12&16;r[n*32+o]=i*((u&15|c)-16),r[n*32+o+16]=i*((u>>4|d)-16)}}return r}function ks(l,e){let r=new Float32Array(e*32),t=new DataView(l.buffer,l.byteOffset);for(let n=0;n<e;n++){let s=n*18,i=Pe(t.getUint16(s,!0));for(let a=0;a<16;a++){let o=l[s+2+a];r[n*32+a]=i*((o&15)-8),r[n*32+a+16]=i*((o>>4)-8)}}return r}function As(l,e){let r=new Float32Array(e*256),t=new DataView(l.buffer,l.byteOffset);for(let n=0;n<e;n++){let s=n*176,i=Pe(t.getUint16(s,!0)),a=Pe(t.getUint16(s+2,!0)),o=g=>{let h=b=>l[s+4+b];return g<4?[h(g)&63,h(g+4)&63]:[h(g+4)&15|h(g-4)>>6<<4,h(g+4)>>4|h(g)>>6<<4]},u=n*256,c=0,d=0,f=1,p=2;for(let g=0;g<256;g+=64){let[h,b]=o(c),w=i*h,_=a*b,[G,B]=o(c+1),C=i*G,E=a*B;for(let A=0;A<32;A++){let k=l[s+48+d+A],v=l[s+16+A];r[u+g+A]=w*((k&15)+(v&f?16:0))-_,r[u+g+32+A]=C*((k>>4)+(v&p?16:0))-E}d+=32,c+=2,f<<=2,p<<=2}}return r}function Ps(l,e){let r=new Float32Array(e*256),t=new DataView(l.buffer,l.byteOffset);for(let n=0;n<e;n++){let s=n*210,i=Pe(t.getUint16(s+208,!0)),a=n*256;for(let o=0;o<2;o++){let u=s+o*64,c=s+128+o*32,d=s+192+o*8,f=a+o*128;for(let p=0;p<32;p++){let g=p/16|0,h=l[u+p],b=l[u+p+32],w=l[c+p],_=(h&15|(w>>0&3)<<4)-32,G=(b&15|(w>>2&3)<<4)-32,B=(h>>4|(w>>4&3)<<4)-32,C=(b>>4|(w>>6&3)<<4)-32;r[f+p]=i*Ye(l[d+g])*_,r[f+p+32]=i*Ye(l[d+g+2])*G,r[f+p+64]=i*Ye(l[d+g+4])*B,r[f+p+96]=i*Ye(l[d+g+6])*C}}}return r}function je(l,e,r,t,n){let s=new Float32Array(r*n);for(let i=0;i<r;i++)for(let a=0;a<n;a++){let o=0;for(let u=0;u<t;u++)o+=l[i*t+u]*e[u*n+a];s[i*n+a]=o}return s}function Me(l,e,r,t,n=1e-5,s=!1){let i=new Float32Array(r*t);for(let a=0;a<r;a++){let o=0;for(let c=0;c<t;c++)o+=l[a*t+c]**2;let u=1/Math.sqrt(o/t+n);for(let c=0;c<t;c++)i[a*t+c]=l[a*t+c]*u*(s?1+e[c]:e[c])}return i}function xs(l,e,r,t,n,s,i){let a=new Float32Array(l.length),o=t/2,u=s[0],c=s[0]+s[1];for(let d=0;d<r;d++){let f=Math.floor(d/n),p=d*t;for(let g=0;g<o;g++){let h=g<u?0:g<c?1:2,w=e[f*3+h]/i**(2*g/t),_=Math.cos(w),G=Math.sin(w),B=l[p+g],C=l[p+g+o];a[p+g]=B*_-C*G,a[p+g+o]=C*_+B*G}}return a}function ht(l,e,r,t,n=0,s=1e4,i){let a=new Float32Array(l.length),o=r/2;for(let u=0;u<e;u++){let c=n+Math.floor(u/t),d=u*r;for(let f=0;f<o;f++){let p=c/(s**(2*f/r)*(i?i[f]:1)),g=Math.cos(p),h=Math.sin(p),b=l[d+2*f],w=l[d+2*f+1];a[d+2*f]=b*g-w*h,a[d+2*f+1]=w*g+b*h}}return a}function _s(l,e,r,t,n,s=0,i=1e4){let a=new Float32Array(l.length),o=t/2;for(let u=0;u<r;u++){let c=s+Math.floor(u/n),d=u*t;for(let f=0;f<o;f++){let p=c/(i**(2*f/t)*e[f]),g=Math.cos(p),h=Math.sin(p),b=l[d+f],w=l[d+f+o];a[d+f]=b*g-w*h,a[d+f+o]=w*g+b*h}}return a}function Xe(l,e,r,t,n=0,s=1e4){let i=new Float32Array(l.length),a=r/2;for(let o=0;o<e;o++){let u=n+Math.floor(o/t),c=o*r;for(let d=0;d<a;d++){let f=u/s**(2*d/r),p=Math.cos(f),g=Math.sin(f),h=l[c+d],b=l[c+d+a];i[c+d]=h*p-b*g,i[c+d+a]=b*p+h*g}}return i}function Kt(l,e,r){return l.map((t,n)=>t+e[n%r])}function zt(l,e,r,t=!0){let n=t?l.windowPerLayer?.[r]??l.window??0:0,s=l.ropeThetaPerLayer?.[r]??l.ropeTheta,i=l.skipRopePerLayer?.[r]??l.skipRope??!1;return{...l,seq:e,window:n,ropeTheta:s,skipRope:i}}function Ae(l,e,r,t,n,s,i,a=0,o,u=0,c=0){let d=new Float32Array(t*n*i),f=o??1/Math.sqrt(i),p=h=>u>0?u*Math.tanh(h/u):h,g=n/s;for(let h=0;h<t;h++)for(let b=0;b<n;b++){let w=Math.floor(b/g),_=(h*n+b)*i,G=a+h,B=c>0?Math.max(0,G+1-c):0,C=[],E=-1/0;for(let k=B;k<=G;k++){let v=(k*s+w)*i,m=0;for(let y=0;y<i;y++)m+=l[_+y]*e[v+y];let x=p(m*f);C[k]=x,x>E&&(E=x)}let A=0;for(let k=B;k<=G;k++)C[k]=Math.exp(C[k]-E),A+=C[k];for(let k=B;k<=G;k++){let v=C[k]/A,m=(k*s+w)*i;for(let x=0;x<i;x++)d[_+x]+=v*r[m+x]}}return d}function Xr(l){return .5*l*(1+Math.tanh(.7978845608*(l+.044715*l*l*l)))}function Ht(l,e,r){let{seq:t,d:n,nHeads:s,nKvHeads:i,headDim:a,ffn:o,ropeTheta:u,eps:c}=e,d=i*a,f=s*a,p=e.rmsGainOnePlus===!0,g=e.attnLogitSoftcap??0,h=Me(l,r.attnNorm,t,n,c,p),b=je(h,r.wq,t,n,f),w=je(h,r.wk,t,n,d),_=je(h,r.wv,t,n,d);r.bq&&(b=Kt(b,r.bq,f)),r.bk&&(w=Kt(w,r.bk,d)),r.bv&&(_=Kt(_,r.bv,d)),r.qNorm&&(b=Me(b,r.qNorm,t*s,a,c,p)),r.kNorm&&(w=Me(w,r.kNorm,t*i,a,c,p));let G=Xe(b,t*s,a,s,0,u),B=Xe(w,t*i,a,i,0,u),C=Ae(G,B,_,t,s,i,a,0,e.attnScale,g),E=je(C,r.wo,t,f,n);r.postAttnNorm&&(E=Me(E,r.postAttnNorm,t,n,c,p));let A=l.map((P,U)=>P+E[U]),k=Me(A,r.ffnNorm,t,n,c,p),v=je(k,r.wgate,t,n,o),m=je(k,r.wup,t,n,o),x=e.act==="gelu"?v.map((P,U)=>Xr(P)*m[U]):v.map((P,U)=>P/(1+Math.exp(-P))*m[U]),y=je(x,r.wdown,t,o,n);return r.postFfnNorm&&(y=Me(y,r.postFfnNorm,t,n,c,p)),A.map((P,U)=>P+y[U])}var ue,ee,mt,Jr=ne(()=>{"use strict";$e();Ie();Ve();Ir();Vr();Et();ue=64,ee=class ee{constructor(){this.device=null;this.modules={};this.pipelines={};this.maxStorageBufferBindingSize=0;this.hasF16=!1;this.validationFailure=null;this.lost=!1;this.onLost=null;this.attnDecodeOk=!0;this.attnPrefillOk=!0;this.attnFullWgOk=!0;this.mropeOk=!0;this.rwkvWkv7Ok=!0;this.lfm2ShortConvOk=!0;this.lfm2ResidentOk=!0;this.lfm2BatchOk=!0;this.swaOk=!0;this.rwkvResidentOk=!0;this.videoOk=!0;this.videoResidentOk=!0;this.f16SharedOk=!0;this.qSharedOk=!0;this.qShared2Ok=!0;this.gemvOk=!0;this.rmsVecOk=!0;this.convS2Ok=!0;this.hasSubgroups=!1;this.subgroupsOk=!0;this.topKParOk=!0;this.profiler=null;this.bufferPool=new Map;this.poolSize=new WeakMap;this.pooled=new WeakSet;this.uniformPool=new Map;this.uniformSize=new WeakMap;this.convTiledOk=!0;this.convTiledQOk=!0;this.kvGpu=new Map;this.topKOk=!0;this.kvSession="";this.kvQuant=!1;this.lfm2KvGpu=new Map;this.lfm2ConvGpu=new Map;this.lfm2Session="";this.rwkvStateGpu=new Map;this.rwkvVFirst=null;this.rwkvSession=""}async init(){let e=navigator.gpu;if(!e)return!1;let r=await e.requestAdapter();if(!r)return!1;let t=r.limits,n={maxStorageBufferBindingSize:t.maxStorageBufferBindingSize,maxBufferSize:t.maxBufferSize},s=[];try{r.features?.has("shader-f16")&&s.push("shader-f16")}catch{}try{r.features?.has("subgroups")&&s.push("subgroups")}catch{}try{ee.profileOn&&r.features?.has("timestamp-query")&&s.push("timestamp-query")}catch{}try{this.device=await r.requestDevice({requiredLimits:n,requiredFeatures:s})}catch{try{this.device=await r.requestDevice({requiredLimits:n})}catch{this.device=await r.requestDevice()}}this.maxStorageBufferBindingSize=this.device.limits?.maxStorageBufferBindingSize??134217728,this.hasF16=!!this.device.features?.has?.("shader-f16"),this.hasSubgroups=!!this.device.features?.has?.("subgroups"),ee.profileOn&&(this.device.features?.has?.("timestamp-query")?(this.profiler=new gt(this.device),console.info("[webgpu] profilage par passe ACTIF (?gpuprofile=1) : __gpuProfile() pour le rapport")):console.warn("[webgpu] ?gpuprofile=1 demand\xE9 mais la feature timestamp-query est ABSENTE de cet adapter : aucune mesure ne sera prise."));try{se("attndecode")==="0"&&(this.attnDecodeOk=!1,console.warn("[webgpu] attention d\xE9codage COUP\xC9E par ?attndecode=0 : kernels classiques")),se("attnfullwg")==="0"&&(this.attnFullWgOk=!1,console.warn("[webgpu] attention_full workgroup COUP\xC9E par ?attnfullwg=0 : kernel classique")),se("attnprefill")==="0"&&(this.attnPrefillOk=!1,console.warn("[webgpu] attention prefill tuil\xE9e COUP\xC9E par ?attnprefill=0 : kernel classique")),se("rmsvec")==="0"&&(this.rmsVecOk=!1,console.warn("[webgpu] RMSNorm parall\xE8le COUP\xC9E par ?rmsvec=0 : kernel une-ligne-par-thread")),se("topkpar")==="0"&&(this.topKParOk=!1,console.warn("[webgpu] top-K parall\xE8le COUP\xC9E par ?topkpar=0 : s\xE9lection finale sur un seul thread")),se("rwkv")==="0"&&(this.rwkvWkv7Ok=!1,console.warn("[webgpu] kernel RWKV-7 WKV COUP\xC9 par ?rwkv=0")),se("lfm2")==="0"&&(this.lfm2ShortConvOk=!1,console.warn("[webgpu] kernel shortconv LFM2 COUP\xC9 par ?lfm2=0")),se("lfm2resident")==="0"&&(this.lfm2ResidentOk=!1,console.warn("[webgpu] LFM2 r\xE9sident COUP\xC9 par ?lfm2resident=0 : forwardToken JS+readback")),se("lfm2batch")==="0"&&(this.lfm2BatchOk=!1,console.warn("[webgpu] prefill LFM2 batch\xE9 COUP\xC9 par ?lfm2batch=0 : token par token")),se("convs2")==="0"&&(this.convS2Ok=!1,console.warn("[webgpu] conv2d 3\xD73 stride-2 tuil\xE9 COUP\xC9 par ?convs2=0 : repli sur direct")),se("subgroups")==="0"&&(this.subgroupsOk=!1,console.warn("[webgpu] subgroups COUP\xC9 par ?subgroups=0 : repli sur shared memory")),se("swa")==="0"&&(this.swaOk=!1,console.warn("[webgpu] fen\xEAtre glissante COUP\xC9E par ?swa=0 : attention causale pleine sur toutes les couches")),se("rwkvresident")==="0"&&(this.rwkvResidentOk=!1,console.warn("[webgpu] RWKV r\xE9sident COUP\xC9 par ?rwkvresident=0 : forwardToken JS+readback")),se("video")==="0"&&(this.videoOk=!1,console.warn("[webgpu] chemin vid\xE9o (module motion) COUP\xC9 par ?video=0")),se("f16shared")==="0"&&(this.f16SharedOk=!1,console.warn("[webgpu] GEMM f16 tuil\xE9 COUP\xC9 par ?f16shared=0 : matmul_t_f16w pour tous les m")),se("gemv")==="0"&&(this.gemvOk=!1,console.warn("[webgpu] GEMV de d\xE9codage COUP\xC9 par ?gemv=0 : kernels par lignes")),se("qshared")==="0"&&(this.qSharedOk=!1,console.warn("[webgpu] GEMM q8/q4 tuil\xE9s COUP\xC9S par ?qshared=0 : kernels 4 lignes/invocation")),se("qshared2")==="0"&&(this.qShared2Ok=!1,console.warn("[webgpu] GEMM q8/q4 v2 (bloc 4\xD78 vec4) COUP\xC9S par ?qshared2=0 : tuile 32\xD764 v1")),se("convtq")==="0"&&(this.convTiledQOk=!1,console.warn("[webgpu] conv 3\xD73 tuil\xE9 q8/q4 COUP\xC9 par ?convtq=0 : conv2d_direct_q8/q4 (plus lent, m\xEAme r\xE9sultat)")),se("videoresident")==="0"&&(this.videoResidentOk=!1,console.warn("[webgpu] motion r\xE9sident COUP\xC9 par ?videoresident=0 : chemin JS+readback"))}catch{}this.device.lost?.then?.(i=>{this.lost=!0,console.warn("[webgpu] device GPU perdu :",i?.reason||"unknown",i?.message||""),this.onLost?.(i)});for(let[i,a]of Object.entries(Qr))this.modules[i]=this.device.createShaderModule({code:a});return this.hasF16&&(this.modules.matmul_t_f16w=this.device.createShaderModule({code:$r})),!0}buf(e,r){let t=this.device.createBuffer({size:e.byteLength,usage:r});return this.device.queue.writeBuffer(t,0,e),t}bufU32(e,r){let t=this.device.createBuffer({size:e.byteLength,usage:r});return this.device.queue.writeBuffer(t,0,e),t}async readBack(e,r){let t=globalThis,n=this.device.createBuffer({size:r,usage:t.GPUBufferUsage.COPY_DST|t.GPUBufferUsage.MAP_READ}),s=this.device.createCommandEncoder();s.copyBufferToBuffer(e,0,n,0,r),this.device.queue.submit([s.finish()]),await n.mapAsync(t.GPUMapMode.READ);let i=new Float32Array(n.getMappedRange().slice(0));return n.unmap(),n.destroy(),i}async readBackBytes(e,r){let t=globalThis,n=Math.ceil(r/4)*4,s=this.device.createBuffer({size:n,usage:t.GPUBufferUsage.COPY_DST|t.GPUBufferUsage.MAP_READ}),i=this.device.createCommandEncoder();i.copyBufferToBuffer(e,0,s,0,n),this.device.queue.submit([i.finish()]),await s.mapAsync(t.GPUMapMode.READ);let a=new Uint8Array(s.getMappedRange().slice(0,r));return s.unmap(),s.destroy(),a}async quantizeToBytes(e,r,t,n,s){let i=t/32,a=n==="q8"?new Uint8Array(t+i*2):new Uint8Array(t/2+i*4),o=ee.BLOCK_ELEMS[e]??1,u=t/o,c=r.byteLength/u,d=(h,b)=>b===0?h:d(b,h%b),f=o*32/d(o,32),p=Math.floor(this.maxStorageBufferBindingSize*.9/4),g=s??p;g=Math.max(f,Math.floor(g/f)*f);for(let h=0;h<t;h+=g){let b=Math.min(g,t-h),w=r.slice(h/o*c,(h+b)/o*c),_=this.dequantizeToGpu(e,w,b);try{if(n==="q8"){let{codes:G,sc:B}=this.f32ToQ8Gpu(_,b),C=await this.readBackBytes(G,b),E=await this.readBackBytes(B,b/32*2);G.destroy?.(),B.destroy?.(),a.set(C,h),a.set(E,t+h/32*2)}else{let{nib:G,sc:B,mn:C}=this.f32ToQ4Gpu(_,b),E=await this.readBackBytes(G,b/2),A=await this.readBackBytes(B,b/32*2),k=await this.readBackBytes(C,b/32*2);G.destroy?.(),B.destroy?.(),C.destroy?.(),a.set(E,h/2),a.set(A,t/2+h/32*2),a.set(k,t/2+i*2+h/32*2)}}finally{_.destroy?.()}}return a}pipeline(e){let r=this.pipelines[e];return r||(r=this.device.createComputePipeline({layout:"auto",compute:{module:this.modules[e],entryPoint:"main"}}),this.pipelines[e]=r),r}grid1D(e){let r=Math.ceil(e/ue);if(r<=ee.MAX_WG_DIM)return[r,1,1];let t=ee.MAX_WG_DIM;return[t,Math.ceil(r/t),1]}recordPass(e,r,t,n){let s=this.pipeline(r),i=this.device.createBindGroup({layout:s.getBindGroupLayout(0),entries:t.map((u,c)=>({binding:c,resource:{buffer:u}}))}),a=this.profiler?.slot(r),o=e.beginComputePass(a?{timestampWrites:a}:void 0);o.setPipeline(s),o.setBindGroup(0,i),o.dispatchWorkgroups(...n),o.end()}dispatch(e,r,t){let n=this.device.createCommandEncoder();this.recordPass(n,e,r,t),this.device.queue.submit([n.finish()])}async run(e,r,t,n,s){return this.dispatch(e,r,t),this.readBack(n,s)}isF32(e){return e instanceof Float32Array}async matmul(e,r,t,n,s){let i=globalThis,a=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([t,n,s]));let u=this.isF32(r)?this.buf(r,a):r,c=this.device.createBuffer({size:t*s*4,usage:a|i.GPUBufferUsage.COPY_SRC});return this.run("matmul",[o,this.buf(e,a),u,c],[Math.ceil(t/8),Math.ceil(s/8),1],c,t*s*4)}async matmulT(e,r,t,n,s,i=!1){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([t,n,s]));let c=this.isF32(r)?this.buf(r,o):r,d=this.device.createBuffer({size:t*s*4,usage:o|a.GPUBufferUsage.COPY_SRC}),f=this.matmulTPlan(t,n,s,i);return this.run(f.shader,[u,this.buf(e,o),c,d],f.grid,d,t*s*4)}matmulTPlan(e,r,t,n){return n&&this.hasF16?this.f16SharedOk&&e>=32&&r%4===0?{shader:"matmul_t_f16w_shared",grid:[Math.ceil(t/64),Math.ceil(e/32),1]}:{shader:"matmul_t_f16w",grid:[Math.ceil(e/8),Math.ceil(t/8),1]}:{shader:r%4===0?"matmul_t_vec4":"matmul_t",grid:[Math.ceil(e/8),Math.ceil(t/8),1]}}async rmsnorm(e,r,t,n,s=1e-5,i=!1){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([t,n])),this.device.queue.writeBuffer(u,8,new Float32Array([s])),this.device.queue.writeBuffer(u,12,new Uint32Array([i?1:0]));let c=this.device.createBuffer({size:e.byteLength,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("rmsnorm",[u,this.buf(e,o),this.buf(r,o),c],[Math.ceil(t/ue),1,1],c,e.byteLength)}async topKReadback(e,r,t){let n=globalThis,s=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST,i=this.device.createBuffer({size:8,usage:n.GPUBufferUsage.UNIFORM|n.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(i,0,new Uint32Array([e.length,r]));let a=this.device.createBuffer({size:r*2*4,usage:s|n.GPUBufferUsage.COPY_SRC}),o=this.device.createBuffer({size:r*2*4,usage:n.GPUBufferUsage.COPY_DST|n.GPUBufferUsage.MAP_READ}),u=this.device.createCommandEncoder(),c=this.buf(e,s);this.recordPass(u,t,[i,c,a],[1,1,1]),u.copyBufferToBuffer(a,0,o,0,r*2*4),this.device.queue.submit([u.finish()]),await o.mapAsync(n.GPUMapMode.READ);let d=new Uint32Array(o.getMappedRange().slice(0));return o.unmap(),o.destroy(),a.destroy?.(),i.destroy?.(),c.destroy?.(),d}async rmsnormVec(e,r,t,n,s=1e-5,i=!1,a="rmsnorm_vec"){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([t,n])),this.device.queue.writeBuffer(c,8,new Float32Array([s])),this.device.queue.writeBuffer(c,12,new Uint32Array([i?1:0]));let d=this.device.createBuffer({size:e.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run(a,[c,this.buf(e,u),this.buf(r,u),d],[t,1,1],d,e.byteLength)}async binary(e,r,t){let n=globalThis,s=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST,i=this.device.createBuffer({size:r.byteLength,usage:s|n.GPUBufferUsage.COPY_SRC});return this.run(e,[this.buf(r,s),this.buf(t,s),i],this.grid1D(r.length),i,r.byteLength)}swiglu(e,r){return this.binary("swiglu",e,r)}geglu(e,r){return this.binary("geglu",e,r)}add(e,r){return this.binary("add",e,r)}async silu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("silu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async groupNorm(e,r,t,n,s,i,a=1e-5,o="group_norm"){let u=globalThis,c=u.GPUBufferUsage.STORAGE|u.GPUBufferUsage.COPY_DST,d=this.device.createBuffer({size:16,usage:u.GPUBufferUsage.UNIFORM|u.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(d,0,new Uint32Array([n,s,i])),this.device.queue.writeBuffer(d,12,new Float32Array([a]));let f=this.device.createBuffer({size:e.byteLength,usage:c|u.GPUBufferUsage.COPY_SRC});return this.run(o,[d,this.buf(e,c),this.buf(r,c),this.buf(t,c),f],[i,1,1],f,e.byteLength)}async conv2d(e,r,t,n,s,i,a,o,u,c=1,d=0){let f=globalThis,p=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,g=Math.floor((s+2*d-o)/c)+1,h=Math.floor((i+2*d-u)/c)+1,b=n*o*u,w=g*h;if(b*w*4>this.maxStorageBufferBindingSize*.9)return this.conv2dDirect(e,r,t,n,s,i,a,o,u,c,d);let _=this.device.createBuffer({size:48,usage:f.GPUBufferUsage.UNIFORM|f.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(_,0,new Uint32Array([n,s,i,o,u,c,d,g,h]));let G=this.device.createBuffer({size:b*w*4,usage:p|f.GPUBufferUsage.COPY_SRC});this.dispatch("im2col",[_,this.buf(e,p),G],this.grid1D(b*w));let B=await this.matmul(r,G,a,b,w);if(G.destroy?.(),_.destroy?.(),t)for(let C=0;C<a;C++){let E=t[C];for(let A=0;A<w;A++)B[C*w+A]+=E}return B}async conv2dDirect(e,r,t,n,s,i,a,o,u,c=1,d=0){let f=globalThis,p=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,g=Math.floor((s+2*d-o)/c)+1,h=Math.floor((i+2*d-u)/c)+1,b=a*g*h,w=this.device.createBuffer({size:48,usage:f.GPUBufferUsage.UNIFORM|f.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(w,0,new Uint32Array([n,s,i,a,o,u,c,d,g,h]));let _=t??new Float32Array(a),G=this.device.createBuffer({size:b*4,usage:p|f.GPUBufferUsage.COPY_SRC});return this.run("conv2d_direct",[w,this.buf(e,p),this.buf(r,p),this.buf(_,p),G],this.grid1D(b),G,b*4)}async layernorm(e,r,t,n,s,i=1e-5){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s])),this.device.queue.writeBuffer(u,8,new Float32Array([i]));let c=this.device.createBuffer({size:e.byteLength,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("layernorm",[u,this.buf(e,o),this.buf(r,o),this.buf(t,o),c],[Math.ceil(n/ue),1,1],c,e.byteLength)}async quickGelu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("quick_gelu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async gelu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("gelu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async relu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("relu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async upsampleNearest(e,r,t,n,s=2){let i=globalThis,a=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=t*s,u=n*s,c=r*o*u,d=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(d,0,new Uint32Array([r,t,n,s]));let f=this.device.createBuffer({size:c*4,usage:a|i.GPUBufferUsage.COPY_SRC});return this.run("upsample_nearest",[d,this.buf(e,a),f],this.grid1D(c),f,c*4)}async upscale2x(e,r,t,n,s=.5){let i=t*2,a=n*2,o=this.recordingSession(),u=this.uploadGpu(e),c=o.upscale2x(u,r,t,n,s),d=await o.finish(c,r*i*a);return this.releaseGpu([u]),d}async rope(e,r,t,n,s=0,i=1e4,a=!1){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:32,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([r,t,n,s])),this.device.queue.writeBuffer(c,16,new Float32Array([i]));let d=this.device.createBuffer({size:e.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.device.queue.writeBuffer(c,20,new Uint32Array([a?1:0])),this.run("rope",[c,this.buf(e,u),d],[Math.ceil(r/ue),1,1],d,e.byteLength)}async ropeFactors(e,r,t,n,s,i=0,a=1e4,o=!1){let u=globalThis,c=u.GPUBufferUsage.STORAGE|u.GPUBufferUsage.COPY_DST,d=this.device.createBuffer({size:32,usage:u.GPUBufferUsage.UNIFORM|u.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(d,0,new Uint32Array([t,n,s,i])),this.device.queue.writeBuffer(d,16,new Float32Array([a]));let f=this.device.createBuffer({size:r.byteLength,usage:c});this.device.queue.writeBuffer(f,0,r);let p=this.device.createBuffer({size:e.byteLength,usage:c|u.GPUBufferUsage.COPY_SRC});return this.device.queue.writeBuffer(d,20,new Uint32Array([o?1:0])),this.run("rope_factors",[d,this.buf(e,c),f,p],[Math.ceil(t/ue),1,1],p,e.byteLength)}async ropeMrope(e,r,t,n,s,i,a=1e4){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:32,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([t,n,s,i[0],i[0]+i[1]])),this.device.queue.writeBuffer(c,20,new Float32Array([a]));let d=this.device.createBuffer({size:r.byteLength,usage:u});this.device.queue.writeBuffer(d,0,r);let f=this.device.createBuffer({size:e.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("rope_mrope",[c,this.buf(e,u),d,f],[Math.ceil(t/ue),1,1],f,e.byteLength)}async rope2d(e,r,t,n,s,i=1e4){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:32,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([t,n,s,0])),this.device.queue.writeBuffer(u,16,new Float32Array([i]));let c=this.device.createBuffer({size:r.byteLength,usage:o});this.device.queue.writeBuffer(c,0,r);let d=this.device.createBuffer({size:e.byteLength,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("rope_2d",[u,this.buf(e,o),c,d],[Math.ceil(t/ue),1,1],d,e.byteLength)}async attention(e,r,t,n,s,i,a,o=0,u,c=0,d=0){let f=globalThis,p=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,g=o+n,h=this.attnUniform(n,s,i,a,g,o,u??1/Math.sqrt(a),c,d),b=n*s*a*4,w=this.device.createBuffer({size:b,usage:p|f.GPUBufferUsage.COPY_SRC});return this.run("attention",[h,this.buf(e,p),this.buf(r,p),this.buf(t,p),w],[Math.ceil(n*s/ue),1,1],w,b)}async attentionDecode(e,r,t,n,s,i,a,o=0,u,c=0,d=0){let f=globalThis,p=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,g=o+n,h=this.attnUniform(n,s,i,a,g,o,u??1/Math.sqrt(a),c,d),b=n*s*a*4,w=this.device.createBuffer({size:b,usage:p|f.GPUBufferUsage.COPY_SRC});return this.run("attention_decode",[h,this.buf(e,p),this.buf(r,p),this.buf(t,p),w],[n*s,1,1],w,b)}async attentionPrefill(e,r,t,n,s,i,a,o=0,u,c=0,d=0){let f=globalThis,p=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,g=o+n,h=this.attnUniform(n,s,i,a,g,o,u??1/Math.sqrt(a),c,d),b=n*s*a*4,w=this.device.createBuffer({size:b,usage:p|f.GPUBufferUsage.COPY_SRC});return this.run("attention_prefill",[h,this.buf(e,p),this.buf(r,p),this.buf(t,p),w],[Math.ceil(n/4)*s,1,1],w,b)}async attentionFull(e,r,t,n,s,i,a,o,u,c=0){let d=globalThis,f=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,p=this.device.createBuffer({size:32,usage:d.GPUBufferUsage.UNIFORM|d.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(p,0,new Uint32Array([n,s,i,a,o,0])),this.device.queue.writeBuffer(p,24,new Float32Array([u??1/Math.sqrt(a),c]));let g=n*s*a*4,h=this.device.createBuffer({size:g,usage:f|d.GPUBufferUsage.COPY_SRC});return this.run("attention_full",[p,this.buf(e,f),this.buf(r,f),this.buf(t,f),h],[Math.ceil(n*s/ue),1,1],h,g)}async attentionFullWg(e,r,t,n,s,i,a,o,u,c=0){let d=globalThis,f=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,p=this.device.createBuffer({size:32,usage:d.GPUBufferUsage.UNIFORM|d.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(p,0,new Uint32Array([n,s,i,a,o,0])),this.device.queue.writeBuffer(p,24,new Float32Array([u??1/Math.sqrt(a),c]));let g=n*s*a*4,h=this.device.createBuffer({size:g,usage:f|d.GPUBufferUsage.COPY_SRC});return this.run("attention_full_wg",[p,this.buf(e,f),this.buf(r,f),this.buf(t,f),h],[n*s,1,1],h,g)}async quantizeKvReadback(e,r,t,n){let s=globalThis,i=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST|s.GPUBufferUsage.COPY_SRC,a=t*n,o=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([r,t,n,0]));let u=this.device.createBuffer({size:r*a,usage:i}),c=this.device.createBuffer({size:r*t*4,usage:i});this.dispatch("quantize_kv",[o,this.buf(e,i),u,c],this.grid1D(r*t));let d=await this.readBack(u,r*a),f=new Uint32Array(d.buffer,0,r*a/4),p=await this.readBack(c,r*t*4);return u.destroy?.(),c.destroy?.(),{codes:f,scales:p}}async attentionQ8Kv(e,r,t,n,s,i,a,o,u,c=0,d,f=0,p=0){let g=globalThis,h=g.GPUBufferUsage.STORAGE|g.GPUBufferUsage.COPY_DST,b=c+i,w=this.attnUniform(i,a,o,u,b,c,d??1/Math.sqrt(u),f,p),_=i*a*u*4,G=this.device.createBuffer({size:_,usage:h|g.GPUBufferUsage.COPY_SRC});return this.run("attention_q8kv",[w,this.buf(e,h),this.bufU32(r,h),this.buf(t,h),this.bufU32(n,h),this.buf(s,h),G],[Math.ceil(i*a/ue),1,1],G,_)}async attentionQ8KvDecode(e,r,t,n,s,i,a,o,u,c=0,d,f=0,p=0){let g=globalThis,h=g.GPUBufferUsage.STORAGE|g.GPUBufferUsage.COPY_DST,b=c+i,w=this.attnUniform(i,a,o,u,b,c,d??1/Math.sqrt(u),f,p),_=i*a*u*4,G=this.device.createBuffer({size:_,usage:h|g.GPUBufferUsage.COPY_SRC});return this.run("attention_decode_q8kv",[w,this.buf(e,h),this.bufU32(r,h),this.buf(t,h),this.bufU32(n,h),this.buf(s,h),G],[i*a,1,1],G,_)}async attentionQ8KvPrefill(e,r,t,n,s,i,a,o,u,c=0,d,f=0,p=0){let g=globalThis,h=g.GPUBufferUsage.STORAGE|g.GPUBufferUsage.COPY_DST,b=c+i,w=this.attnUniform(i,a,o,u,b,c,d??1/Math.sqrt(u),f,p),_=i*a*u*4,G=this.device.createBuffer({size:_,usage:h|g.GPUBufferUsage.COPY_SRC});return this.run("attention_prefill_q8kv",[w,this.buf(e,h),this.bufU32(r,h),this.buf(t,h),this.bufU32(n,h),this.buf(s,h),G],[Math.ceil(i/4)*a,1,1],G,_)}async addBias(e,r,t,n){let s=globalThis,i=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,a=this.device.createBuffer({size:8,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(a,0,new Uint32Array([t,n]));let o=this.device.createBuffer({size:e.byteLength,usage:i|s.GPUBufferUsage.COPY_SRC});return this.run("addbias",[a,this.buf(e,i),this.buf(r,i),o],this.grid1D(e.length),o,e.byteLength)}async dequantBlocked(e,r,t,n){let s=globalThis,i=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,a=t/n;if(!Number.isInteger(a))throw new Error(`${e}: nElems ${t} not a multiple of ${n}`);let o=r.byteLength%4===0?r:(()=>{let f=new Uint8Array(Math.ceil(r.byteLength/4)*4);return f.set(r),f})(),u=new Uint32Array(o.buffer,o.byteOffset,o.byteLength/4),c=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([a]));let d=this.device.createBuffer({size:t*4,usage:i|s.GPUBufferUsage.COPY_SRC});return this.run(e,[c,this.bufU32(u,i),d],this.grid1D(a),d,t*4)}async dequantizeQ4K(e,r){return this.dequantBlocked("dequant_q4k",e,r,256)}async dequantizeByType(e,r,t){if(e==="F32")return new Float32Array(r.buffer,r.byteOffset,t);if(e==="F16"){let i=new DataView(r.buffer,r.byteOffset),a=new Float32Array(t);for(let o=0;o<t;o++)a[o]=Pe(i.getUint16(o*2,!0));return a}if(e==="Q4W")return ge(be(r,t));if(e==="Q8W")return me(ye(r,t));if(e==="Q3W")return Ce(ke(r,t));let n=ee.DEQUANT_SHADER[e],s=ee.BLOCK_ELEMS[e];if(!n||!s)throw new Error(`dequant: unsupported GGML type ${e}`);return this.dequantBlocked(n,r,t,s)}dequantBlockedGpu(e,r,t,n){let s=globalThis,i=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,a=t/n;if(!Number.isInteger(a))throw new Error(`${e}: nElems ${t} not a multiple of ${n}`);let o=r.byteLength%4===0?r:(()=>{let f=new Uint8Array(Math.ceil(r.byteLength/4)*4);return f.set(r),f})(),u=new Uint32Array(o.buffer,o.byteOffset,o.byteLength/4),c=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([a]));let d=this.device.createBuffer({size:t*4,usage:i});return this.dispatch(e,[c,this.bufU32(u,i),d],this.grid1D(a)),d}dequantizeToGpu(e,r,t){let n=globalThis,s=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST;if(e==="F32")return this.buf(new Float32Array(r.buffer,r.byteOffset,t),s);if(e==="F16"){let o=new DataView(r.buffer,r.byteOffset),u=new Float32Array(t);for(let c=0;c<t;c++)u[c]=Pe(o.getUint16(c*2,!0));return this.buf(u,s)}if(e==="Q4W")return this.buf(ge(be(r,t)),s);if(e==="Q8W")return this.buf(me(ye(r,t)),s);if(e==="Q3W")return this.buf(Ce(ke(r,t)),s);let i=ee.DEQUANT_SHADER[e],a=ee.BLOCK_ELEMS[e];if(!i||!a)throw new Error(`dequant: unsupported GGML type ${e}`);return this.dequantBlockedGpu(i,r,t,a)}async layerForward(e,r,t,n=!1){let{seq:s,d:i,nHeads:a,nKvHeads:o,headDim:u,ffn:c,ropeTheta:d,eps:f}=r,p=o*u,g=n?(O,D,K,S,L)=>this.matmulT(O,D,K,S,L):(O,D,K,S,L)=>this.matmul(O,D,K,S,L),h=a*u,b=r.rmsGainOnePlus===!0,w=r.attnLogitSoftcap??0,_=(O,D)=>r.act==="gelu"?this.geglu(O,D):this.swiglu(O,D),G=await this.rmsnorm(e,t.attnNorm,s,i,f,b),B=await g(G,t.wq,s,i,h),C=await g(G,t.wk,s,i,p),E=await g(G,t.wv,s,i,p);t.bq&&(B=await this.addBias(B,t.bq,s,h)),t.bk&&(C=await this.addBias(C,t.bk,s,p)),t.bv&&(E=await this.addBias(E,t.bv,s,p)),t.qNorm&&(B=await this.rmsnorm(B,t.qNorm,s*a,u,f,b)),t.kNorm&&(C=await this.rmsnorm(C,t.kNorm,s*o,u,f,b));let A=await this.rope(B,s*a,u,a,0,d),k=await this.rope(C,s*o,u,o,0,d),v=await this.attention(A,k,E,s,a,o,u,0,r.attnScale,w),m=await g(v,t.wo,s,h,i);t.postAttnNorm&&(m=await this.rmsnorm(m,t.postAttnNorm,s,i,f,b));let x=await this.add(e,m),y=await this.rmsnorm(x,t.ffnNorm,s,i,f,b),P=await g(y,t.wgate,s,i,c),U=await g(y,t.wup,s,i,c),F=await _(P,U),q=await g(F,t.wdown,s,c,i);return t.postFfnNorm&&(q=await this.rmsnorm(q,t.postFfnNorm,s,i,f,b)),this.add(x,q)}async layerForwardKV(e,r,t,n,s,i,a=!1){let{seq:o,d:u,nHeads:c,nKvHeads:d,headDim:f,ffn:p,ropeTheta:g,eps:h}=r,b=d*f,w=a?(V,I,X,M,T)=>this.matmulT(V,I,X,M,T):(V,I,X,M,T)=>this.matmul(V,I,X,M,T),_=(V,I)=>{let X=new Float32Array(V.length+I.length);return X.set(V),X.set(I,V.length),X},G=c*f,B=r.rmsGainOnePlus===!0,C=r.attnLogitSoftcap??0,E=(V,I)=>r.act==="gelu"?this.geglu(V,I):this.swiglu(V,I),A=await this.rmsnorm(e,t.attnNorm,o,u,h,B),k=await w(A,t.wq,o,u,G),v=await w(A,t.wk,o,u,b),m=await w(A,t.wv,o,u,b);t.bq&&(k=await this.addBias(k,t.bq,o,G)),t.bk&&(v=await this.addBias(v,t.bk,o,b)),t.bv&&(m=await this.addBias(m,t.bv,o,b)),t.qNorm&&(k=await this.rmsnorm(k,t.qNorm,o*c,f,h,B)),t.kNorm&&(v=await this.rmsnorm(v,t.kNorm,o*d,f,h,B));let x=await this.rope(k,o*c,f,c,n,g),y=await this.rope(v,o*d,f,d,n,g),P=_(s,y),U=_(i,m),F=await this.attention(x,P,U,o,c,d,f,n,r.attnScale,C),q=await w(F,t.wo,o,G,u);t.postAttnNorm&&(q=await this.rmsnorm(q,t.postAttnNorm,o,u,h,B));let O=await this.add(e,q),D=await this.rmsnorm(O,t.ffnNorm,o,u,h,B),K=await w(D,t.wgate,o,u,p),S=await w(D,t.wup,o,u,p),L=await E(K,S),z=await w(L,t.wdown,o,p,u);return t.postFfnNorm&&(z=await this.rmsnorm(z,t.postFfnNorm,o,u,h,B)),{out:await this.add(O,z),k:P,v:U}}storage(e){let r=this.bufferPool.get(e);if(r&&r.length){let n=r.pop();return this.pooled.delete(n),n}let t=this.device.createBuffer({size:e,usage:ee.STORAGE_USAGE});return this.poolSize.set(t,e),t}release(e){for(let r of e){if(!r)continue;let t=this.poolSize.get(r);if(t!==void 0){if(this.pooled.has(r))continue;this.pooled.add(r);let s=this.bufferPool.get(t);s||(s=[],this.bufferPool.set(t,s)),s.push(r);continue}let n=this.uniformSize.get(r);if(n!==void 0){if(this.pooled.has(r))continue;this.pooled.add(r);let s=this.uniformPool.get(n);s||(s=[],this.uniformPool.set(n,s)),s.push(r);continue}r.destroy?.()}}uploadGpu(e){return e instanceof Float32Array?this.buf(e,ee.STORAGE_USAGE):this.f16ToF32Gpu(e.f16,e.n)}uploadGpuF16(e){let r=new Uint16Array(e.length);for(let t=0;t<e.length;t++)r[t]=De(e[t]);return this.bufU16(r)}f32ToF16Gpu(e,r){let t=globalThis,n=Math.ceil(r/2),s=this.device.createBuffer({size:n*4,usage:ee.STORAGE_USAGE}),i=this.device.createBuffer({size:16,usage:t.GPUBufferUsage.UNIFORM|t.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(i,0,new Uint32Array([n])),this.dispatch("packf16",[i,e,s],this.grid1D(n)),s}f32ToQ8Gpu(e,r){let t=globalThis,n=r/32,s=this.device.createBuffer({size:r,usage:ee.STORAGE_USAGE}),i=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:ee.STORAGE_USAGE}),a=this.device.createBuffer({size:16,usage:t.GPUBufferUsage.UNIFORM|t.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(a,0,new Uint32Array([n])),this.dispatch("quantize_q8",[a,e,s,i],this.grid1D(n)),{codes:s,sc:i}}f32ToQ4Gpu(e,r){let t=globalThis,n=r/32,s=this.device.createBuffer({size:r/2,usage:ee.STORAGE_USAGE}),i=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:ee.STORAGE_USAGE}),a=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:ee.STORAGE_USAGE}),o=this.device.createBuffer({size:16,usage:t.GPUBufferUsage.UNIFORM|t.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(o,0,new Uint32Array([n])),this.dispatch("quantize_q4",[o,e,s,i,a],this.grid1D(n)),{nib:s,sc:i,mn:a}}uploadGpuRawF16(e){let r=Math.ceil(e.byteLength/4)*4,t=this.device.createBuffer({size:r,usage:ee.STORAGE_USAGE});if(this.device.queue.writeBuffer(t,0,e,0,e.byteLength-e.byteLength%4),e.byteLength%4){let n=new Uint8Array(4);n.set(e.subarray(e.byteLength-e.byteLength%4)),this.device.queue.writeBuffer(t,e.byteLength-e.byteLength%4,n)}return t}bufU16(e){let r=this.device.createBuffer({size:e.byteLength,usage:ee.STORAGE_USAGE});return this.device.queue.writeBuffer(r,0,e),r}uploadGpuRaw(e){let r=Math.ceil(e.byteLength/4)*4,t=this.device.createBuffer({size:r,usage:ee.STORAGE_USAGE}),n=e.byteLength-e.byteLength%4;if(this.device.queue.writeBuffer(t,0,e,0,n),e.byteLength%4){let s=new Uint8Array(4);s.set(e.subarray(n)),this.device.queue.writeBuffer(t,n,s)}return t}async matmulQ4(e,r,t,n,s,i,a){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s,i,a]));let d=this.device.createBuffer({size:s*a*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4",[c,this.buf(e,u),r,t,n,d],[Math.ceil(s/8),Math.ceil(a/8),1],d,s*a*4)}async matmulQ4Tiled(e,r,t,n,s,i,a){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s,i,a]));let d=this.device.createBuffer({size:s*a*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_tiled",[c,this.buf(e,u),r,t,n,d],[Math.ceil(Math.ceil(s/4)/8),Math.ceil(a/8),1],d,s*a*4)}async matmulQ4Shared(e,r,t,n,s,i,a){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s,i,a]));let d=this.device.createBuffer({size:s*a*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_shared",[c,this.buf(e,u),r,t,n,d],[Math.ceil(a/64),Math.ceil(s/32),1],d,s*a*4)}async matmulQ3(e,r,t,n,s,i,a,o){let u=globalThis,c=u.GPUBufferUsage.STORAGE|u.GPUBufferUsage.COPY_DST,d=this.device.createBuffer({size:16,usage:u.GPUBufferUsage.UNIFORM|u.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(d,0,new Uint32Array([i,a,o]));let f=this.device.createBuffer({size:i*o*4,usage:c|u.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q3",[d,this.buf(e,c),r,t,n,s,f],[Math.ceil(i/8),Math.ceil(o/8),1],f,i*o*4)}async rwkvWkv7(e,r,t,n,s,i,a,o,u){let c=globalThis,d=c.GPUBufferUsage.STORAGE|c.GPUBufferUsage.COPY_DST,f=this.device.createBuffer({size:8,usage:c.GPUBufferUsage.UNIFORM|c.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(f,0,new Uint32Array([o,u]));let p=this.device.createBuffer({size:e.byteLength,usage:d|c.GPUBufferUsage.COPY_SRC});this.device.queue.writeBuffer(p,0,e);let g=this.device.createBuffer({size:o*u*4,usage:d|c.GPUBufferUsage.COPY_SRC});this.dispatch("rwkv_wkv7",[f,this.buf(r,d),this.buf(t,d),this.buf(n,d),this.buf(s,d),this.buf(i,d),this.buf(a,d),p,g],this.grid1D(o*u));let h=await this.readBack(p,e.byteLength),b=await this.readBack(g,o*u*4);return p.destroy?.(),g.destroy?.(),{S:h,y:b}}async rwkvTokenShift(e,r,t,n){let s=globalThis,i=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,a=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(a,0,new Uint32Array([n]));let o=this.device.createBuffer({size:6*n*4,usage:i|s.GPUBufferUsage.COPY_SRC});this.dispatch("rwkv_token_shift",[a,this.buf(e,i),this.buf(r,i),this.buf(t,i),o],this.grid1D(n*6));let u=await this.readBack(o,6*n*4);return o.destroy?.(),u}async lfm2ShortConv(e,r,t,n,s){let i=globalThis,a=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([n,s]));let u=this.buf(r,a|i.GPUBufferUsage.COPY_SRC),c=this.device.createBuffer({size:n*4,usage:a|i.GPUBufferUsage.COPY_SRC});this.dispatch("lfm2_shortconv",[o,this.buf(e,a),this.buf(t,a),u,c],this.grid1D(n));let d=await this.readBack(c,n*4),f=await this.readBack(u,(s-1)*n*4);return c.destroy?.(),u.destroy?.(),{out:d,state:f}}async matmulQ8(e,r,t,n,s,i){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s,i]));let c=this.device.createBuffer({size:n*i*4,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8",[u,this.buf(e,o),r,t,c],[Math.ceil(n/8),Math.ceil(i/8),1],c,n*i*4)}async matmulQ8Tiled(e,r,t,n,s,i){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s,i]));let c=this.device.createBuffer({size:n*i*4,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_tiled",[u,this.buf(e,o),r,t,c],[Math.ceil(Math.ceil(n/4)/8),Math.ceil(i/8),1],c,n*i*4)}async matmulQ8Shared(e,r,t,n,s,i){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s,i]));let c=this.device.createBuffer({size:n*i*4,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_shared",[u,this.buf(e,o),r,t,c],[Math.ceil(i/64),Math.ceil(n/32),1],c,n*i*4)}async matmulQ8Shared2(e,r,t,n,s,i){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s,i]));let c=this.device.createBuffer({size:n*i*4,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_shared2",[u,this.buf(e,o),r,t,c],[Math.ceil(i/128),Math.ceil(n/64),1],c,n*i*4)}async matmulQ4Shared2(e,r,t,n,s,i,a){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s,i,a]));let d=this.device.createBuffer({size:s*a*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_shared2",[c,this.buf(e,u),r,t,n,d],[Math.ceil(a/128),Math.ceil(s/64),1],d,s*a*4)}uniformOf(e){let r=globalThis,t=this.uniformPool.get(e);if(t&&t.length){let s=t.pop();return this.pooled.delete(s),s}let n=this.device.createBuffer({size:e,usage:r.GPUBufferUsage.UNIFORM|r.GPUBufferUsage.COPY_DST});return this.uniformSize.set(n,e),n}uniform(e,r){let t=this.uniformOf(32);if(this.device.queue.writeBuffer(t,0,new Uint32Array(e)),r){let n=Array.isArray(r.value)?r.value:[r.value];this.device.queue.writeBuffer(t,r.offset,new Float32Array(n))}return t}attnUniform(e,r,t,n,s,i,a,o,u){let c=this.uniformOf(48);return this.device.queue.writeBuffer(c,0,new Uint32Array([e,r,t,n,s,i])),this.device.queue.writeBuffer(c,24,new Float32Array([a,o])),this.device.queue.writeBuffer(c,32,new Uint32Array([u])),c}recMatmulT(e,r,t,n,s,i,a,o=!1){let u=this.uniform([s,i,a]),c=this.storage(s*a*4),d=this.matmulTPlan(s,i,a,o);return this.recordPass(e,d.shader,[u,t,n,c],d.grid),r.push(u,c),c}recConv2dDirect(e,r,t,n,s,i,a,o,u,c,d,f,p){let g=Math.floor((a+2*p-c)/f)+1,h=Math.floor((o+2*p-d)/f)+1,b=u*g*h,w=this.uniformOf(48);if(this.device.queue.writeBuffer(w,0,new Uint32Array([i,a,o,u,c,d,f,p,g,h])),c===3&&d===3&&f===1&&p===1&&this.convTiledOk){let G=this.storage(b*4);return this.recordPass(e,"conv2d_3x3_tiled",[w,t,n,s,G],[Math.ceil(h/16),Math.ceil(g/16),u]),r.push(w,G),G}let _=this.storage(b*4);return this.recordPass(e,"conv2d_direct",[w,t,n,s,_],this.grid1D(b)),r.push(w,_),_}recConv2dDirectQ8(e,r,t,n,s,i,a,o,u,c,d,f,p){let g=Math.floor((a+2*p-c)/f)+1,h=Math.floor((o+2*p-d)/f)+1,b=u*g*h,w=this.uniformOf(48);if(this.device.queue.writeBuffer(w,0,new Uint32Array([i,a,o,u,c,d,f,p,g,h])),c===3&&d===3&&f===1&&p===1&&this.convTiledQOk){let G=this.storage(b*4);return this.recordPass(e,"conv2d_3x3_tiled_q8",[w,t,n.codes,n.sc,s,G],[Math.ceil(h/16),Math.ceil(g/16),Math.ceil(u/8)]),r.push(w,G),G}if(c===1&&d===1&&f===1&&p===0&&this.convTiledQOk){let G=this.storage(b*4);return this.recordPass(e,"conv2d_1x1_q8",[w,t,n.codes,n.sc,s,G],[Math.ceil(h/16),Math.ceil(g/16),Math.ceil(u/8)]),r.push(w,G),G}if(c===3&&d===3&&f===2&&p===1&&this.convTiledQOk&&this.convS2Ok){let G=this.storage(b*4);return this.recordPass(e,"conv2d_3x3_s2_tiled_q8",[w,t,n.codes,n.sc,s,G],[Math.ceil(h/16),Math.ceil(g/8),Math.ceil(u/8)]),r.push(w,G),G}let _=this.storage(b*4);return this.recordPass(e,"conv2d_direct_q8",[w,t,n.codes,n.sc,s,_],this.grid1D(b)),r.push(w,_),_}recConv2dDirectQ4(e,r,t,n,s,i,a,o,u,c,d,f,p){let g=Math.floor((a+2*p-c)/f)+1,h=Math.floor((o+2*p-d)/f)+1,b=u*g*h,w=this.uniformOf(48);if(this.device.queue.writeBuffer(w,0,new Uint32Array([i,a,o,u,c,d,f,p,g,h])),c===3&&d===3&&f===1&&p===1&&this.convTiledQOk){let G=this.storage(b*4);return this.recordPass(e,"conv2d_3x3_tiled_q4",[w,t,n.nib,n.sc,n.mn,s,G],[Math.ceil(h/16),Math.ceil(g/16),Math.ceil(u/8)]),r.push(w,G),G}if(c===1&&d===1&&f===1&&p===0&&this.convTiledQOk){let G=this.storage(b*4);return this.recordPass(e,"conv2d_1x1_q4",[w,t,n.nib,n.sc,n.mn,s,G],[Math.ceil(h/16),Math.ceil(g/16),Math.ceil(u/8)]),r.push(w,G),G}if(c===3&&d===3&&f===2&&p===1&&this.convTiledQOk&&this.convS2Ok){let G=this.storage(b*4);return this.recordPass(e,"conv2d_3x3_s2_tiled_q4",[w,t,n.nib,n.sc,n.mn,s,G],[Math.ceil(h/16),Math.ceil(g/8),Math.ceil(u/8)]),r.push(w,G),G}let _=this.storage(b*4);return this.recordPass(e,"conv2d_direct_q4",[w,t,n.nib,n.sc,n.mn,s,_],this.grid1D(b)),r.push(w,_),_}recGroupNorm(e,r,t,n,s,i,a,o,u){let c=this.uniform([i,a,o],{offset:12,value:u}),d=this.storage(i*a*4),f=this.hasSubgroups&&this.subgroupsOk?"group_norm_subgroup":"group_norm";return this.recordPass(e,f,[c,t,n,s,d],[o,1,1]),r.push(c,d),d}recUnary(e,r,t,n,s){let i=this.storage(s*4);return this.recordPass(e,t,[n,i],this.grid1D(s)),r.push(i),i}recLayernorm(e,r,t,n,s,i,a,o){let u=this.uniform([i,a],{offset:8,value:o}),c=this.storage(i*a*4);return this.recordPass(e,"layernorm",[u,t,n,s,c],[Math.ceil(i/ue),1,1]),r.push(u,c),c}recAttentionFull(e,r,t,n,s,i,a,o,u,c,d){let f=this.uniform([i,a,o,u,c,0],{offset:24,value:[d??1/Math.sqrt(u),0]}),p=this.storage(i*a*u*4),g=i*a;return this.attnFullWgOk&&u<=192&&g<=65535?this.recordPass(e,"attention_full_wg",[f,t,n,s,p],[g,1,1]):this.recordPass(e,"attention_full",[f,t,n,s,p],[Math.ceil(g/ue),1,1]),r.push(f,p),p}recUpsample(e,r,t,n,s,i,a){let o=this.uniform([n,s,i,a]),u=n*(s*a)*(i*a),c=this.storage(u*4);return this.recordPass(e,"upsample_nearest",[o,t,c],this.grid1D(u)),r.push(o,c),c}recConcat(e,r,t,n,s,i,a){let o=this.storage((s+i)*a*4);return e.copyBufferToBuffer(t,0,o,0,s*a*4),e.copyBufferToBuffer(n,0,o,s*a*4,i*a*4),r.push(o),o}recAddChannelBias(e,r,t,n,s,i){let a=this.uniform([s,i]),o=this.storage(s*i*4);return this.recordPass(e,"add_channel_bias",[a,t,n,o],this.grid1D(s*i)),r.push(a,o),o}recTranspose(e,r,t,n,s){let i=this.uniform([n,s]),a=this.storage(n*s*4);return this.recordPass(e,"transpose2d",[i,t,a],this.grid1D(n*s)),r.push(i,a),a}recGegluSplit(e,r,t,n,s){let i=this.uniform([n,s]),a=this.storage(n*s*4);return this.recordPass(e,"geglu_split",[i,t,a],this.grid1D(n*s)),r.push(i,a),a}recUpscale2x(e,r,t,n,s,i,a=.5){let o=this.uniform([n,s,i],{offset:12,value:a}),u=i*2,c=s*2,d=this.storage(n*c*u*4);return this.recordPass(e,"upscale2x_enhanced",[o,t,d],[Math.ceil(u/16),Math.ceil(c/16),n]),r.push(o,d),d}recVideoGather(e,r,t,n,s,i){let a=this.uniform([n,s,i]),o=this.storage(i*n*s*4);return this.recordPass(e,"video_motion_gather",[a,t,o],this.grid1D(i*n*s)),r.push(a,o),o}recVideoScatter(e,r,t,n,s,i,a){let o=this.uniform([s,i,a]),u=this.storage(s*i*a*4);return this.recordPass(e,"video_motion_scatter",[o,t,n,u],this.grid1D(s*i*a)),r.push(o,u),u}recVideoAddPe(e,r,t,n,s,i,a){let o=this.uniform([s,i,a]),u=this.storage(a*s*i*4);return this.recordPass(e,"video_add_pe",[o,t,n,u],this.grid1D(a*s*i)),r.push(o,u),u}recAttnTemporal(e,r,t,n,s,i,a,o,u){let c=this.uniform([i,a,o,u],{offset:16,value:1/Math.sqrt(u)}),d=this.storage(i*a*o*u*4);return this.recordPass(e,"attn_temporal",[c,t,n,s,d],this.grid1D(i*a*o)),r.push(c,d),d}recordingSession(){let e=this.device.createCommandEncoder(),r=[],t=n=>{if(n instanceof Float32Array){let s=this.uploadGpu(n);return r.push(s),s}return n};return{conv2d:(n,s,i,a,o,u,c,d,f,p,g)=>s&&s.nib?this.recConv2dDirectQ4(e,r,t(n),s,t(i),a,o,u,c,d,f,p,g):s&&s.codes?this.recConv2dDirectQ8(e,r,t(n),s,t(i),a,o,u,c,d,f,p,g):this.recConv2dDirect(e,r,t(n),t(s),t(i),a,o,u,c,d,f,p,g),groupNorm:(n,s,i,a,o,u,c)=>this.recGroupNorm(e,r,t(n),t(s),t(i),a,o,u,c),silu:(n,s)=>this.recUnary(e,r,"silu",t(n),s),quickGelu:(n,s)=>this.recUnary(e,r,"quick_gelu",t(n),s),gelu:(n,s)=>this.recUnary(e,r,"gelu",t(n),s),relu:(n,s)=>this.recUnary(e,r,"relu",t(n),s),add:(n,s,i)=>this.recBinary(e,r,"add",t(n),t(s),i),geglu:(n,s,i)=>this.recBinary(e,r,"geglu",t(n),t(s),i),matmulT:(n,s,i,a,o)=>this.recMM(e,r,t(n),s instanceof Float32Array?t(s):s,i,a,o,!1),addBias:(n,s,i,a)=>this.recAddBias(e,r,t(n),t(s),i,a),addChannelBias:(n,s,i,a)=>this.recAddChannelBias(e,r,t(n),t(s),i,a),attentionFull:(n,s,i,a,o,u,c,d)=>this.recAttentionFull(e,r,t(n),t(s),t(i),a,o,u,c,d),rope2d:(n,s,i,a,o,u)=>{let c=s instanceof Uint32Array?(()=>{let d=this.uploadGpuRaw(new Uint8Array(s.buffer,s.byteOffset,s.byteLength));return r.push(d),d})():s;return this.recRope2d(e,r,t(n),c,i,a,o,u)},attention:(n,s,i,a,o,u,c,d,f)=>this.recAttention(e,r,t(n),t(s),t(i),a,o,u,c,d,f),upsample:(n,s,i,a,o)=>this.recUpsample(e,r,t(n),s,i,a,o),upscale2x:(n,s,i,a,o=.5)=>this.recUpscale2x(e,r,t(n),s,i,a,o),layernorm:(n,s,i,a,o,u)=>this.recLayernorm(e,r,t(n),t(s),t(i),a,o,u),concat:(n,s,i,a,o)=>this.recConcat(e,r,t(n),t(s),i,a,o),transpose:(n,s,i)=>this.recTranspose(e,r,t(n),s,i),gegluSplit:(n,s,i)=>this.recGegluSplit(e,r,t(n),s,i),videoGather:(n,s,i,a)=>this.recVideoGather(e,r,t(n),s,i,a),videoScatter:(n,s,i,a,o)=>this.recVideoScatter(e,r,t(n),t(s),i,a,o),videoAddPe:(n,s,i,a,o)=>this.recVideoAddPe(e,r,t(n),t(s),i,a,o),attnTemporal:(n,s,i,a,o,u,c)=>this.recAttnTemporal(e,r,t(n),t(s),t(i),a,o,u,c),alloc:n=>{let s=this.storage(n);return r.push(s),s},copy:(n,s,i,a,o)=>{e.copyBufferToBuffer(i,a,n,s,o)},finish:async(n,s)=>{this.device.queue.submit([e.finish()]);let i=await this.readBack(n,s*4);return this.release(r),i},finishKeep:n=>{this.device.queue.submit([e.finish()]);let s=r.indexOf(n);return s>=0&&r.splice(s,1),this.release(r),n},finishKeepMany:n=>{this.device.queue.submit([e.finish()]);for(let s of n){let i=r.indexOf(s);i>=0&&r.splice(i,1)}return this.release(r),n}}}readGpu(e,r){return this.readBack(e,r*4)}trimPool(e=64<<20){let r=[...this.bufferPool.keys()].sort((n,s)=>s-n),t=0;for(let n of this.bufferPool.values())for(let s of n)t+=this.poolSize.get(s)??0;for(let n of r){let s=this.bufferPool.get(n);for(;s.length&&t>e;){let i=s.pop();this.pooled.delete(i),this.poolSize.delete(i),i.destroy?.(),t-=n}}}releaseGpu(e){this.release(e)}waitGpu(){return this.device.queue.onSubmittedWorkDone()}async benchMatmul(e,r,t,n,s,i={}){let{iters:a=10,shared:o=!0,shared2:u=!0,wF16:c=!1}=i,d=this.f16SharedOk,f=this.qSharedOk,p=this.qShared2Ok;this.f16SharedOk=o,this.qSharedOk=o,this.qShared2Ok=o&&u;let g=this.uploadGpu(e),h=[],b=this.device.createCommandEncoder();this.recMM(b,h,g,r,t,n,s,c),this.device.queue.submit([b.finish()]),await this.device.queue.onSubmittedWorkDone();let w=this.device.createCommandEncoder();for(let B=0;B<a;B++)this.recMM(w,h,g,r,t,n,s,c);let _=performance.now();this.device.queue.submit([w.finish()]),await this.device.queue.onSubmittedWorkDone();let G=(performance.now()-_)/a;return this.release(h),g.destroy?.(),this.f16SharedOk=d,this.qSharedOk=f,this.qShared2Ok=p,G}destroy(){try{this.profiler?.destroy()}catch{}this.profiler=null;try{this.device?.destroy?.()}catch{}this.bufferPool.clear(),this.uniformPool.clear()}f16ToF32Gpu(e,r){let t=this.uploadGpuRawF16(e),n=this.device.createBuffer({size:r*4,usage:ee.STORAGE_USAGE}),s=this.uniformOf(16);return this.device.queue.writeBuffer(s,0,new Uint32Array([r])),this.dispatch("f16_to_f32",[s,t,n],this.grid1D(Math.ceil(r/2))),t.destroy?.(),this.release([s]),n}quantizeQ8Gpu(e){let r=e instanceof Float32Array?e.length:e.n;if(r%32!==0)return this.uploadGpu(e);let t=e instanceof Float32Array?this.buf(e,ee.STORAGE_USAGE):this.f16ToF32Gpu(e.f16,r),n=this.f32ToQ8Gpu(t,r);return t.destroy?.(),n}async validateResidentOps(){let e=globalThis,r=x=>Float32Array.from({length:x},()=>(Math.random()*2-1)*.5),t=(x,y,P=.005)=>x.length===y.length&&x.every((U,F)=>Math.abs(U-y[F])<=P*(1+Math.abs(y[F]))),n=4,s=4,i=4,a=4,o=2,u=1e-5,c=a*s*i,d=r(n*s*i),f=r(a*n*9),p=r(a),g=r(a),h=r(a),b=await this.silu(await this.groupNorm(await this.conv2dDirect(d,f,p,n,s,i,a,3,3,1,1),g,h,a,s*i,o,u)),w=[],_=this.device.createCommandEncoder(),G=this.uploadGpu(d),B=this.uploadGpu(f),C=this.uploadGpu(p),E=this.uploadGpu(g),A=this.uploadGpu(h);w.push(G,B,C,E,A);let k=this.recConv2dDirect(_,w,G,B,C,n,s,i,a,3,3,1,1);k=this.recGroupNorm(_,w,k,E,A,a,s*i,o,u),k=this.recUnary(_,w,"silu",k,c);let v=this.device.createBuffer({size:c*4,usage:e.GPUBufferUsage.COPY_DST|e.GPUBufferUsage.MAP_READ});_.copyBufferToBuffer(k,0,v,0,c*4),this.device.queue.submit([_.finish()]),await v.mapAsync(e.GPUMapMode.READ);let m=new Float32Array(v.getMappedRange().slice(0));return v.unmap(),v.destroy(),this.release(w),t(m,b)?null:"resident_ops"}recMatmulQ4(e,r,t,n,s,i,a){let o=this.uniform([s,i,a]),u=this.storage(s*a*4);if(s===1&&this.gemvOk){let c=this.gemvGrid(a);this.recordPass(e,"matmul_t_q4_vec",[this.uniform([s,i,a,c.stride]),t,n.nib,n.sc,n.mn,u],c.grid)}else s>=64&&this.qSharedOk&&this.qShared2Ok?this.recordPass(e,"matmul_t_q4_shared2",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(a/128),Math.ceil(s/64),1]):s>=32&&this.qSharedOk?this.recordPass(e,"matmul_t_q4_shared",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(a/64),Math.ceil(s/32),1]):s>=2?this.recordPass(e,"matmul_t_q4_tiled",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(Math.ceil(s/4)/8),Math.ceil(a/8),1]):this.recordPass(e,"matmul_t_q4",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(s/8),Math.ceil(a/8),1]);return r.push(o,u),u}recMatmulQ8(e,r,t,n,s,i,a){let o=this.uniform([s,i,a]),u=this.storage(s*a*4);if(s===1&&this.gemvOk){let c=this.gemvGrid(a);this.recordPass(e,"matmul_t_q8_vec",[this.uniform([s,i,a,c.stride]),t,n.codes,n.sc,u],c.grid)}else s>=64&&this.qSharedOk&&this.qShared2Ok?this.recordPass(e,"matmul_t_q8_shared2",[o,t,n.codes,n.sc,u],[Math.ceil(a/128),Math.ceil(s/64),1]):s>=32&&this.qSharedOk?this.recordPass(e,"matmul_t_q8_shared",[o,t,n.codes,n.sc,u],[Math.ceil(a/64),Math.ceil(s/32),1]):s>=2?this.recordPass(e,"matmul_t_q8_tiled",[o,t,n.codes,n.sc,u],[Math.ceil(Math.ceil(s/4)/8),Math.ceil(a/8),1]):this.recordPass(e,"matmul_t_q8",[o,t,n.codes,n.sc,u],[Math.ceil(s/8),Math.ceil(a/8),1]);return r.push(o,u),u}gemvGrid(e){return e<=32768?{grid:[e,1,1],stride:32768}:{grid:[32768,Math.ceil(e/32768),1],stride:32768}}async matmulQ4Vec(e,r,t,n,s,i){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.gemvGrid(i),c=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([1,s,i,u.stride]));let d=this.device.createBuffer({size:i*4,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_vec",[c,this.buf(e,o),r,t,n,d],u.grid,d,i*4)}async matmulQ8Vec(e,r,t,n,s){let i=globalThis,a=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=this.gemvGrid(s),u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([1,n,s,o.stride]));let c=this.device.createBuffer({size:s*4,usage:a|i.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_vec",[u,this.buf(e,a),r,t,c],o.grid,c,s*4)}recMatmulQ3(e,r,t,n,s,i,a){let o=this.uniform([s,i,a]),u=this.storage(s*a*4);return this.recordPass(e,"matmul_t_q3",[o,t,n.lo,n.hi,n.sc,n.mn,u],[Math.ceil(s/8),Math.ceil(a/8),1]),r.push(o,u),u}recMM(e,r,t,n,s,i,a,o){return n&&n.q3?this.recMatmulQ3(e,r,t,n,s,i,a):n&&n.nib?this.recMatmulQ4(e,r,t,n,s,i,a):n&&n.codes?this.recMatmulQ8(e,r,t,n,s,i,a):this.recMatmulT(e,r,t,n,s,i,a,o)}recRmsnorm(e,r,t,n,s,i,a,o=!1){let u=this.uniform([s,i,0,o?1:0],{offset:8,value:a}),c=this.storage(s*i*4);if(this.rmsVecOk&&s<=65535){let d=this.hasSubgroups&&this.subgroupsOk?"rmsnorm_vec_subgroup":"rmsnorm_vec";this.recordPass(e,d,[u,t,n,c],[s,1,1])}else this.recordPass(e,"rmsnorm",[u,t,n,c],[Math.ceil(s/ue),1,1]);return r.push(u,c),c}recRope(e,r,t,n,s,i,a,o,u=!1){let c=this.uniform([n,s,i,a],{offset:16,value:o});this.device.queue.writeBuffer(c,20,new Uint32Array([u?1:0]));let d=this.storage(n*s*4);return this.recordPass(e,"rope",[c,t,d],[Math.ceil(n/ue),1,1]),r.push(c,d),d}recRopeMrope(e,r,t,n,s,i,a,o,u){let c=u[0],d=u[0]+u[1],f=this.uniform([s,i,a,c,d],{offset:20,value:o}),p=this.storage(s*i*4);return this.recordPass(e,"rope_mrope",[f,t,n,p],[Math.ceil(s/ue),1,1]),r.push(f,p),p}preparePositions(e,r){if(e.positions&&e.mropeSections){let t=this.storage(e.positions.byteLength);this.device.queue.writeBuffer(t,0,e.positions),r.push(t),e._posGpu=t}if(e.ropeFactors){let t=this.storage(e.ropeFactors.byteLength);this.device.queue.writeBuffer(t,0,e.ropeFactors),r.push(t),e._ffGpu=t}}recRope2d(e,r,t,n,s,i,a,o){let u=this.uniform([s,i,a,0],{offset:16,value:o}),c=this.storage(s*i*4);return this.recordPass(e,"rope_2d",[u,t,n,c],[Math.ceil(s/ue),1,1]),r.push(u,c),c}recRopeFactors(e,r,t,n,s,i,a,o,u,c=!1){let d=this.uniform([s,i,a,o],{offset:16,value:u});this.device.queue.writeBuffer(d,20,new Uint32Array([c?1:0]));let f=this.storage(s*i*4);return this.recordPass(e,"rope_factors",[d,t,n,f],[Math.ceil(s/ue),1,1]),r.push(d,f),f}recAttention(e,r,t,n,s,i,a,o,u,c,d,f,p=0,g=0){let h=this.attnUniform(i,a,o,u,c,d,f??1/Math.sqrt(u),p,g),b=this.storage(i*a*u*4);return this.attnDecodeOk&&i*a<256&&u<=128?this.recordPass(e,"attention_decode",[h,t,n,s,b],[i*a,1,1]):this.attnPrefillOk&&u<=128?this.recordPass(e,"attention_prefill",[h,t,n,s,b],[Math.ceil(i/4)*a,1,1]):this.recordPass(e,"attention",[h,t,n,s,b],[Math.ceil(i*a/ue),1,1]),r.push(h,b),b}recQuantizeKv(e,r,t,n,s,i,a,o,u){let c=this.uniform([i,a,o,u]);this.recordPass(e,"quantize_kv",[c,t,n,s],this.grid1D(i*a)),r.push(c)}recAttentionQ8(e,r,t,n,s,i,a,o,u,c,d,f,p,g,h=0,b=0){let w=this.attnUniform(o,u,c,d,f,p,g??1/Math.sqrt(d),h,b),_=this.storage(o*u*d*4);return this.attnDecodeOk&&o*u<256&&d<=128?this.recordPass(e,"attention_decode_q8kv",[w,t,n,s,i,a,_],[o*u,1,1]):this.attnPrefillOk&&d<=128?this.recordPass(e,"attention_prefill_q8kv",[w,t,n,s,i,a,_],[Math.ceil(o/4)*u,1,1]):this.recordPass(e,"attention_q8kv",[w,t,n,s,i,a,_],[Math.ceil(o*u/ue),1,1]),r.push(w,_),_}recAddBias(e,r,t,n,s,i){let a=this.uniform([s,i]),o=this.storage(s*i*4);return this.recordPass(e,"addbias",[a,t,n,o],this.grid1D(s*i)),r.push(a,o),o}recBinary(e,r,t,n,s,i){let a=this.storage(i*4);return this.recordPass(e,t,[n,s,a],this.grid1D(i)),r.push(a),a}recLfm2ShortConv(e,r,t,n,s,i,a){let o=this.uniform([i,a]),u=this.storage(i*4);return this.recordPass(e,"lfm2_shortconv",[o,t,s,n,u],this.grid1D(i)),r.push(o,u),u}recordLayerKV(e,r,t,n,s,i,a){let o=a.k,u=a.v,{seq:c,d,nHeads:f,nKvHeads:p,headDim:g,ffn:h,ropeTheta:b,eps:w}=n,_=p*g,G=i+c,B=s.matF16===!0,C=f*g,E=n.rmsGainOnePlus===!0,A=n.attnLogitSoftcap??0,k=n.act==="gelu"?"geglu":"swiglu",v=this.recRmsnorm(e,r,t,s.attnNorm,c,d,w,E),m=this.recMM(e,r,v,s.wq,c,d,C,B),x=this.recMM(e,r,v,s.wk,c,d,_,B),y=this.recMM(e,r,v,s.wv,c,d,_,B);s.bq&&(m=this.recAddBias(e,r,m,s.bq,c,C)),s.bk&&(x=this.recAddBias(e,r,x,s.bk,c,_)),s.bv&&(y=this.recAddBias(e,r,y,s.bv,c,_)),s.qNorm&&(m=this.recRmsnorm(e,r,m,s.qNorm,c*f,g,w,E)),s.kNorm&&(x=this.recRmsnorm(e,r,x,s.kNorm,c*p,g,w,E));let P=n._posGpu,U=n._ffGpu,F=n.ropeInterleaved===!0,q=(M,T,R)=>n.skipRope?M:P?this.recRopeMrope(e,r,M,P,T,g,R,b,n.mropeSections):U?this.recRopeFactors(e,r,M,U,T,g,R,i,b,F):this.recRope(e,r,M,T,g,R,i,b,F),O=q(m,c*f,f),D=q(x,c*p,p),K;if(a.kScale)this.recQuantizeKv(e,r,D,o,a.kScale,c,p,g,i),this.recQuantizeKv(e,r,y,u,a.vScale,c,p,g,i),K=this.recAttentionQ8(e,r,O,o,a.kScale,u,a.vScale,c,f,p,g,G,i,n.attnScale,A,n.window??0);else{let M=_*4;e.copyBufferToBuffer(D,0,o,i*M,c*M),e.copyBufferToBuffer(y,0,u,i*M,c*M),K=this.recAttention(e,r,O,o,u,c,f,p,g,G,i,n.attnScale,A,n.window??0)}let S=this.recMM(e,r,K,s.wo,c,C,d,B);s.postAttnNorm&&(S=this.recRmsnorm(e,r,S,s.postAttnNorm,c,d,w,E));let L=this.recBinary(e,r,"add",t,S,c*d),z=this.recRmsnorm(e,r,L,s.ffnNorm,c,d,w,E),Q=this.recMM(e,r,z,s.wgate,c,d,h,B),V=this.recMM(e,r,z,s.wup,c,d,h,B),I=this.recBinary(e,r,k,Q,V,c*h),X=this.recMM(e,r,I,s.wdown,c,h,d,B);return s.postFfnNorm&&(X=this.recRmsnorm(e,r,X,s.postFfnNorm,c,d,w,E)),this.recBinary(e,r,"add",L,X,c*d)}setKvQuant(e){this.kvQuant!==e&&(this.kvQuant=e,this.resetKvGpu())}resetKvGpu(){for(let e of this.kvGpu.values())e.k.destroy?.(),e.v.destroy?.(),e.kScale?.destroy?.(),e.vScale?.destroy?.();this.kvGpu.clear(),this.kvSession="";for(let e of this.bufferPool.values())for(let r of e)r.destroy?.();this.bufferPool.clear()}clearKvCache(){this.resetKvGpu()}ensureKv(e,r,t,n){let s=this.kvGpu.get(e);if(s&&s.cap>=r)return s;let i=Math.max(r,(s?.cap??0)+1024,1024),a=this.kvQuant,o=this.storage(i*t*(a?1:4)),u=this.storage(i*t*(a?1:4)),c=a?this.storage(i*n*4):void 0,d=a?this.storage(i*n*4):void 0;if(s){let p=this.device.createCommandEncoder();p.copyBufferToBuffer(s.k,0,o,0,s.cap*t*(a?1:4)),p.copyBufferToBuffer(s.v,0,u,0,s.cap*t*(a?1:4)),a&&s.kScale&&(p.copyBufferToBuffer(s.kScale,0,c,0,s.cap*n*4),p.copyBufferToBuffer(s.vScale,0,d,0,s.cap*n*4)),this.device.queue.submit([p.finish()]),s.k.destroy?.(),s.v.destroy?.(),s.kScale?.destroy?.(),s.vScale?.destroy?.()}let f={k:o,v:u,cap:i,kScale:c,vScale:d};return this.kvGpu.set(e,f),f}async runDecodeGpu(e,r,t,n,s,i){let{seq:a,d:o,nKvHeads:u,headDim:c,eps:d}=r,f=u*c,p=n+a;(i!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${i}" inconnue avec pastLen=${n} : cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=i);for(let B=0;B<t.length;B++)this.ensureKv(B,p,f,u);let g=[];this.preparePositions(r,g);let h=this.device.createCommandEncoder(),b=this.storage(e.byteLength);this.device.queue.writeBuffer(b,0,e),g.push(b);for(let B=0;B<t.length;B++){let C=this.kvGpu.get(B);b=this.recordLayerKV(h,g,b,zt(r,a,B,this.swaOk),t[B],n,C)}let w=this.recRmsnorm(h,g,b,s,a,o,d,r.rmsGainOnePlus===!0),_=this.storage(o*4);h.copyBufferToBuffer(w,(a-1)*o*4,_,0,o*4),this.device.queue.submit([h.finish()]);let G=await this.readBack(_,o*4);return g.push(_),this.release(g),G}async decodeLogitsQ8(e,r,t,n,s,i,a,o){let u=globalThis,{seq:c,d,nKvHeads:f,headDim:p,eps:g}=r,h=f*p,b=n+c;(i!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${i}" inconnue avec pastLen=${n} : cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=i);for(let v=0;v<t.length;v++)this.ensureKv(v,b,h,f);let w=[];this.preparePositions(r,w);let _=this.device.createCommandEncoder(),G=this.storage(e.byteLength);this.device.queue.writeBuffer(G,0,e),w.push(G);for(let v=0;v<t.length;v++){let m=this.kvGpu.get(v);G=this.recordLayerKV(_,w,G,zt(r,c,v,this.swaOk),t[v],n,m)}let B=this.recRmsnorm(_,w,G,s,c,d,g,r.rmsGainOnePlus===!0),C=this.storage(d*4);_.copyBufferToBuffer(B,(c-1)*d*4,C,0,d*4),w.push(C);let E=this.storage(o*4);w.push(E);for(let v of a){let m=this.recMM(_,w,C,v.w,1,d,v.rows,!1);_.copyBufferToBuffer(m,0,E,v.r0*4,v.rows*4)}let A=this.device.createBuffer({size:o*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});_.copyBufferToBuffer(E,0,A,0,o*4),this.device.queue.submit([_.finish()]),await A.mapAsync(u.GPUMapMode.READ);let k=new Float32Array(A.getMappedRange().slice(0));return A.unmap(),A.destroy(),this.release(w),k}async decodeTopKQ8(e,r,t,n,s,i,a,o,u,c,d,f=64){let p=globalThis,{seq:g,d:h,nKvHeads:b,headDim:w,eps:_}=r,G=b*w,B=n+g;(i!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${i}" inconnue avec pastLen=${n} : cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=i);for(let q=0;q<t.length;q++)this.ensureKv(q,B,G,b);let C=ee.timingOn?(q,O)=>console.info(`[timing:gpu] ${q} ${(performance.now()-O).toFixed(0)} ms`):null,E=performance.now(),A=[];this.preparePositions(r,A);let k=this.device.createCommandEncoder(),v=this.storage(e.byteLength);this.device.queue.writeBuffer(v,0,e),A.push(v);for(let q=0;q<t.length;q++){let O=this.kvGpu.get(q);v=this.recordLayerKV(k,A,v,zt(r,g,q,this.swaOk),t[q],n,O)}let m=this.recRmsnorm(k,A,v,s,g,h,_,r.rmsGainOnePlus===!0),x=this.storage(h*4);k.copyBufferToBuffer(m,(g-1)*h*4,x,0,h*4),A.push(x);let y=this.storage(o*4);A.push(y);for(let q of a){let O=this.recMM(k,A,x,q.w,1,h,q.rows,!1);k.copyBufferToBuffer(O,0,y,q.r0*4,q.rows*4)}if(d&&d>0){let q=this.uniform([o],{offset:4,value:d});this.recordPass(k,"softcap_logits",[q,y],this.grid1D(o)),A.push(q)}if(c&&c!==1&&u.length){let q=Uint32Array.from(u),O=this.bufU32(q,p.GPUBufferUsage.STORAGE|p.GPUBufferUsage.COPY_DST),D=this.uniform([q.length],{offset:4,value:c});this.recordPass(k,"penalize_logits",[D,O,y],this.grid1D(q.length)),A.push(D,O)}let P=this.storage(f*2*4);A.push(P);{let q=this.uniform([o,f]);this.recordPass(k,this.topKParOk?"top_k_par":"top_k",[q,y,P],[1,1,1]),A.push(q)}let U=this.device.createBuffer({size:f*2*4,usage:p.GPUBufferUsage.COPY_DST|p.GPUBufferUsage.MAP_READ});k.copyBufferToBuffer(P,0,U,0,f*2*4),C?.("enregistrement des passes (compilation des pipelines incluse)",E),E=performance.now(),this.device.queue.submit([k.finish()]),await U.mapAsync(p.GPUMapMode.READ),C?.("execution GPU (submit + readback)",E);let F=new Uint32Array(U.getMappedRange().slice(0));return U.unmap(),U.destroy(),this.release(A),{ids:F.slice(0,f),vals:new Float32Array(F.buffer,f*4,f)}}resetLfm2State(){for(let e of this.lfm2KvGpu.values())e.k.destroy?.(),e.v.destroy?.();for(let e of this.lfm2ConvGpu.values())e.destroy?.();this.lfm2KvGpu.clear(),this.lfm2ConvGpu.clear(),this.lfm2Session="";for(let e of this.bufferPool.values())for(let r of e)r.destroy?.();this.bufferPool.clear()}clearLfm2State(){this.resetLfm2State()}ensureLfm2Kv(e,r,t){let n=this.lfm2KvGpu.get(e);if(n&&n.cap>=r)return n;let s=Math.max(r,(n?.cap??0)+1024,1024),i=this.storage(s*t*4),a=this.storage(s*t*4);if(n){let u=this.device.createCommandEncoder();u.copyBufferToBuffer(n.k,0,i,0,n.cap*t*4),u.copyBufferToBuffer(n.v,0,a,0,n.cap*t*4),this.device.queue.submit([u.finish()]),n.k.destroy?.(),n.v.destroy?.()}let o={k:i,v:a,cap:s};return this.lfm2KvGpu.set(e,o),o}ensureLfm2Conv(e,r){let t=this.lfm2ConvGpu.get(e);return t||(t=this.storage(r*4),this.device.queue.writeBuffer(t,0,new Float32Array(r)),this.lfm2ConvGpu.set(e,t)),t}recLfm2ShortConvBatch(e,r,t,n,s,i,a,o){let u=this.uniform([i,a,o]),c=this.storage(o*i*4);this.recordPass(e,"lfm2_shortconv_batch",[u,t,s,n,c],this.grid1D(o*i));let d=this.uniform([i,a,o]);return this.recordPass(e,"lfm2_shortconv_state",[d,t,n],this.grid1D((a-1)*i)),r.push(u,d,c),c}recordLfm2(e,r,t,n,s,i,a,o){let{D:u,nHeads:c,nKvHeads:d,headDim:f,ffn:p,eps:g,theta:h,lc:b}=s,w=d*f,_=c*f,G=w*4;for(let C=0;C<i.length;C++)i[C].conv?this.ensureLfm2Conv(C,(b-1)*u):this.ensureLfm2Kv(C,o+n,w);if(n>=b-1&&this.lfm2BatchOk){let C=this.storage(n*u*4);this.device.queue.writeBuffer(C,0,t),r.push(C);for(let A=0;A<i.length;A++){let k=i[A],v=this.recRmsnorm(e,r,C,k.attnNorm,n,u,g),m;if(k.conv){let q=this.recMM(e,r,v,k.inProj,n,u,3*u,!1),O=this.recLfm2ShortConvBatch(e,r,q,this.lfm2ConvGpu.get(A),k.convW,u,b,n);m=this.recMM(e,r,O,k.outProj,n,u,u,!1)}else{let q=this.recMM(e,r,v,k.wq,n,u,_,!1),O=this.recMM(e,r,v,k.wk,n,u,w,!1),D=this.recMM(e,r,v,k.wv,n,u,w,!1);q=this.recRmsnorm(e,r,q,k.qNorm,n*c,f,g),O=this.recRmsnorm(e,r,O,k.kNorm,n*d,f,g),q=this.recRope(e,r,q,n*c,f,c,o,h),O=this.recRope(e,r,O,n*d,f,d,o,h);let K=this.lfm2KvGpu.get(A);e.copyBufferToBuffer(O,0,K.k,o*G,n*G),e.copyBufferToBuffer(D,0,K.v,o*G,n*G);let S=this.recAttention(e,r,q,K.k,K.v,n,c,d,f,o+n,o);m=this.recMM(e,r,S,k.wo,n,_,u,!1)}C=this.recBinary(e,r,"add",C,m,n*u);let x=this.recRmsnorm(e,r,C,k.ffnNorm,n,u,g),y=this.recMM(e,r,x,k.wgate,n,u,p,!1),P=this.recMM(e,r,x,k.wup,n,u,p,!1),U=this.recBinary(e,r,"swiglu",y,P,n*p),F=this.recMM(e,r,U,k.wdown,n,p,u,!1);C=this.recBinary(e,r,"add",C,F,n*u)}let E=this.storage(u*4);return r.push(E),e.copyBufferToBuffer(C,(n-1)*u*4,E,0,u*4),this.recRmsnorm(e,r,E,a,1,u,g)}let B=null;for(let C=0;C<n;C++){let E=o+C,A=this.storage(u*4);this.device.queue.writeBuffer(A,0,t.subarray(C*u,(C+1)*u)),r.push(A);for(let k=0;k<i.length;k++){let v=i[k],m=this.recRmsnorm(e,r,A,v.attnNorm,1,u,g),x;if(v.conv){let O=this.recMM(e,r,m,v.inProj,1,u,3*u,!1),D=this.recLfm2ShortConv(e,r,O,this.lfm2ConvGpu.get(k),v.convW,u,b);x=this.recMM(e,r,D,v.outProj,1,u,u,!1)}else{let O=this.recMM(e,r,m,v.wq,1,u,_,!1),D=this.recMM(e,r,m,v.wk,1,u,w,!1),K=this.recMM(e,r,m,v.wv,1,u,w,!1);O=this.recRmsnorm(e,r,O,v.qNorm,c,f,g),D=this.recRmsnorm(e,r,D,v.kNorm,d,f,g),O=this.recRope(e,r,O,c,f,c,E,h),D=this.recRope(e,r,D,d,f,d,E,h);let S=this.lfm2KvGpu.get(k);e.copyBufferToBuffer(D,0,S.k,E*G,G),e.copyBufferToBuffer(K,0,S.v,E*G,G);let L=this.recAttention(e,r,O,S.k,S.v,1,c,d,f,E+1,E);x=this.recMM(e,r,L,v.wo,1,_,u,!1)}A=this.recBinary(e,r,"add",A,x,u);let y=this.recRmsnorm(e,r,A,v.ffnNorm,1,u,g),P=this.recMM(e,r,y,v.wgate,1,u,p,!1),U=this.recMM(e,r,y,v.wup,1,u,p,!1),F=this.recBinary(e,r,"swiglu",P,U,p),q=this.recMM(e,r,F,v.wdown,1,p,u,!1);A=this.recBinary(e,r,"add",A,q,u)}C===n-1&&(B=this.recRmsnorm(e,r,A,a,1,u,g))}return B}lfm2SessionReset(e,r){(e!==this.lfm2Session||r===0)&&(r>0&&console.error(`[lfm2] session "${e}" inconnue avec pastLen=${r} : \xE9tat perdu, sortie invalide. Repartir de pastLen 0.`),this.resetLfm2State(),this.lfm2Session=e)}async lfm2PrefillGpu(e,r,t,n,s,i,a){this.lfm2SessionReset(a,i);let o=[],u=this.device.createCommandEncoder();this.recordLfm2(u,o,e,r,t,n,s,i),this.device.queue.submit([u.finish()]),await this.device.queue.onSubmittedWorkDone(),this.release(o)}async lfm2LogitsGpu(e,r,t,n,s,i,a,o){let u=globalThis;this.lfm2SessionReset(o,a);let c=[],d=this.device.createCommandEncoder(),f=this.recordLfm2(d,c,e,r,t,n,i,a),p=this.recMM(d,c,f,s,1,t.D,t.vocab,!1),g=this.device.createBuffer({size:t.vocab*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});d.copyBufferToBuffer(p,0,g,0,t.vocab*4),this.device.queue.submit([d.finish()]),await g.mapAsync(u.GPUMapMode.READ);let h=new Float32Array(g.getMappedRange().slice(0));return g.unmap(),g.destroy(),this.release(c),h}async lfm2TopKGpu(e,r,t,n,s,i,a,o,u,c,d=64){let f=globalThis;this.lfm2SessionReset(o,a);let p=[],g=this.device.createCommandEncoder(),h=this.recordLfm2(g,p,e,r,t,n,i,a),b=this.recMM(g,p,h,s,1,t.D,t.vocab,!1);if(c&&c!==1&&u.length){let B=Uint32Array.from(u),C=this.bufU32(B,f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST),E=this.uniform([B.length],{offset:4,value:c});this.recordPass(g,"penalize_logits",[E,C,b],this.grid1D(B.length)),p.push(E,C)}let w=this.storage(d*2*4);p.push(w);{let B=this.uniform([t.vocab,d]);this.recordPass(g,this.topKParOk?"top_k_par":"top_k",[B,b,w],[1,1,1]),p.push(B)}let _=this.device.createBuffer({size:d*2*4,usage:f.GPUBufferUsage.COPY_DST|f.GPUBufferUsage.MAP_READ});g.copyBufferToBuffer(w,0,_,0,d*2*4),this.device.queue.submit([g.finish()]),await _.mapAsync(f.GPUMapMode.READ);let G=new Uint32Array(_.getMappedRange().slice(0));return _.unmap(),_.destroy(),this.release(p),{ids:G.slice(0,d),vals:new Float32Array(G.buffer,d*4,d)}}resetRwkvState(){for(let e of this.rwkvStateGpu.values())e.S.destroy?.(),e.tm.destroy?.(),e.cm.destroy?.();this.rwkvStateGpu.clear(),this.rwkvVFirst?.destroy?.(),this.rwkvVFirst=null,this.rwkvSession="";for(let e of this.bufferPool.values())for(let r of e)r.destroy?.();this.bufferPool.clear()}clearRwkvState(){this.resetRwkvState()}ensureRwkvState(e,r,t,n){let s=this.rwkvStateGpu.get(e);if(!s){let i=this.storage(t*n*n*4),a=this.storage(r*4),o=this.storage(r*4);this.device.queue.writeBuffer(i,0,new Float32Array(t*n*n)),this.device.queue.writeBuffer(a,0,new Float32Array(r)),this.device.queue.writeBuffer(o,0,new Float32Array(r)),s={S:i,tm:a,cm:o},this.rwkvStateGpu.set(e,s)}return s}rwkvSessionReset(e,r){(e!==this.rwkvSession||r===0)&&(r>0&&console.error(`[rwkv] session "${e}" inconnue avec pastLen=${r} : \xE9tat perdu, sortie invalide. Repartir de pastLen 0.`),this.resetRwkvState(),this.rwkvSession=e)}recRwkvToken(e,r,t,n,s,i){let{D:a,H:o,NH:u}=n,c=1e-5,d=64e-5;for(let f=0;f<s.length;f++){let p=s[f],g=this.rwkvStateGpu.get(f),h=this.recLayernorm(e,r,t,p.attnNormW,p.attnNormB,1,a,c),b=this.storage(6*a*4);{let R=this.uniform([a]);this.recordPass(e,"rwkv_token_shift",[R,h,g.tm,p.lerpFused,b],this.grid1D(6*a)),r.push(R,b)}e.copyBufferToBuffer(h,0,g.tm,0,a*4);let w=R=>{let j=this.storage(a*4);return e.copyBufferToBuffer(b,R*a*4,j,0,a*4),r.push(j),j},_=w(0),G=w(1),B=w(2),C=w(3),E=w(4),A=w(5),k=this.recMM(e,r,_,p.R,1,a,a,!1),v=this.recMM(e,r,B,p.K,1,a,a,!1),m=this.recMM(e,r,C,p.V,1,a,a,!1),x=this.recUnary(e,r,"tanh_act",this.recMM(e,r,G,p.w1,1,a,p.rw,!1),p.rw),y=this.recMM(e,r,x,p.w2,1,p.rw,a,!1),P=this.storage(a*4);this.recordPass(e,"rwkv_decay",[p.w0,y,P],this.grid1D(a)),r.push(P);let U=this.recMM(e,r,this.recMM(e,r,E,p.a1,1,a,p.ra,!1),p.a2,1,p.ra,a,!1),F=this.storage(a*4);this.recordPass(e,"rwkv_bias_sigmoid",[p.a0,U,F],this.grid1D(a)),r.push(F);let q=this.recUnary(e,r,"sigmoid",this.recMM(e,r,A,p.g1,1,a,p.rg,!1),p.rg),O=this.recMM(e,r,q,p.g2,1,p.rg,a,!1);if(f===0)e.copyBufferToBuffer(m,0,i,0,a*4);else{let R=this.recMM(e,r,this.recMM(e,r,C,p.v1,1,a,p.rv,!1),p.v2,1,p.rv,a,!1);this.recordPass(e,"rwkv_vresid",[m,i,p.v0,R],this.grid1D(a))}let D=this.storage(a*4),K=this.storage(a*4),S=this.storage(a*4);{let R=this.uniform([u,o]);this.recordPass(e,"rwkv_kprep",[R,v,F,p.kk,p.ka,D,K,S],this.grid1D(u)),r.push(R,D,K,S)}let L=this.storage(a*4);{let R=this.uniform([u,o]);this.recordPass(e,"rwkv_wkv7",[R,k,P,D,m,K,S,g.S,L],this.grid1D(u*o)),r.push(R,L)}let z=this.storage(a*4);{let R=this.uniform([u,o],{offset:8,value:d});this.recordPass(e,"rwkv_out_gn",[R,L,k,D,p.rk,m,p.lnWB,z],this.grid1D(u)),r.push(R,z)}let Q=this.recBinary(e,r,"mul",z,O,a),V=this.recMM(e,r,Q,p.O,1,a,a,!1);t=this.recBinary(e,r,"add",t,V,a);let I=this.recLayernorm(e,r,t,p.attnNorm2W,p.attnNorm2B,1,a,c),X=this.storage(a*4);this.recordPass(e,"rwkv_lerp",[I,g.cm,p.lerpK,X],this.grid1D(a)),r.push(X),e.copyBufferToBuffer(I,0,g.cm,0,a*4);let M=this.recUnary(e,r,"sqrelu",this.recMM(e,r,X,p.cmK,1,a,p.ffn,!1),p.ffn),T=this.recMM(e,r,M,p.cmV,1,p.ffn,a,!1);t=this.recBinary(e,r,"add",t,T,a)}return t}recordRwkv(e,r,t,n,s,i,a){let{D:o,H:u,NH:c}=s;for(let f=0;f<i.length;f++)this.ensureRwkvState(f,o,c,u);this.rwkvVFirst||(this.rwkvVFirst=this.storage(o*4));let d=null;for(let f=0;f<n;f++){let p=this.storage(o*4);this.device.queue.writeBuffer(p,0,t.subarray(f*o,(f+1)*o)),r.push(p);let g=this.recLayernorm(e,r,p,a.tokW,a.tokB,1,o,1e-5),h=this.recRwkvToken(e,r,g,s,i,this.rwkvVFirst);f===n-1&&(d=this.recLayernorm(e,r,h,a.outW,a.outB,1,o,1e-5))}return d}async rwkvPrefillGpu(e,r,t,n,s,i,a){this.rwkvSessionReset(a,i);let o=[],u=this.device.createCommandEncoder();this.recordRwkv(u,o,e,r,t,n,s),this.device.queue.submit([u.finish()]),await this.device.queue.onSubmittedWorkDone(),this.release(o)}async rwkvLogitsGpu(e,r,t,n,s,i,a,o){let u=globalThis;this.rwkvSessionReset(o,a);let c=[],d=this.device.createCommandEncoder(),f=this.recordRwkv(d,c,e,r,t,n,i),p=this.recMM(d,c,f,s,1,t.D,t.vocab,!1),g=this.device.createBuffer({size:t.vocab*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});d.copyBufferToBuffer(p,0,g,0,t.vocab*4),this.device.queue.submit([d.finish()]),await g.mapAsync(u.GPUMapMode.READ);let h=new Float32Array(g.getMappedRange().slice(0));return g.unmap(),g.destroy(),this.release(c),h}async rwkvTopKGpu(e,r,t,n,s,i,a,o,u,c,d=64){let f=globalThis;this.rwkvSessionReset(o,a);let p=[],g=this.device.createCommandEncoder(),h=this.recordRwkv(g,p,e,r,t,n,i),b=this.recMM(g,p,h,s,1,t.D,t.vocab,!1);if(c&&c!==1&&u.length){let B=Uint32Array.from(u),C=this.bufU32(B,f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST),E=this.uniform([B.length],{offset:4,value:c});this.recordPass(g,"penalize_logits",[E,C,b],this.grid1D(B.length)),p.push(E,C)}let w=this.storage(d*2*4);p.push(w);{let B=this.uniform([t.vocab,d]);this.recordPass(g,this.topKParOk?"top_k_par":"top_k",[B,b,w],[1,1,1]),p.push(B)}let _=this.device.createBuffer({size:d*2*4,usage:f.GPUBufferUsage.COPY_DST|f.GPUBufferUsage.MAP_READ});g.copyBufferToBuffer(w,0,_,0,d*2*4),this.device.queue.submit([g.finish()]),await _.mapAsync(f.GPUMapMode.READ);let G=new Uint32Array(_.getMappedRange().slice(0));return _.unmap(),_.destroy(),this.release(p),{ids:G.slice(0,d),vals:new Float32Array(G.buffer,d*4,d)}}async argmaxProjection(e,r,t,n,s=!1){let i=globalThis,a=[],o=this.device.createCommandEncoder(),u=this.storage(e.byteLength);this.device.queue.writeBuffer(u,0,e),a.push(u);let c=this.storage(n*4);a.push(c);for(let h of r){let b=this.recMatmulT(o,a,u,h.buf,1,t,h.rows,s);o.copyBufferToBuffer(b,0,c,h.r0*4,h.rows*4)}let d=this.storage(4),f=this.uniform([n]);a.push(d,f),this.recordPass(o,"argmax",[f,c,d],[1,1,1]);let p=this.device.createBuffer({size:4,usage:i.GPUBufferUsage.COPY_DST|i.GPUBufferUsage.MAP_READ});o.copyBufferToBuffer(d,0,p,0,4),this.device.queue.submit([o.finish()]),await p.mapAsync(i.GPUMapMode.READ);let g=new Uint32Array(p.getMappedRange().slice(0))[0];return p.unmap(),p.destroy(),this.release(a),g}async projectLogits(e,r,t,n,s=!1){let i=globalThis,a=[],o=this.device.createCommandEncoder(),u=this.storage(e.byteLength);this.device.queue.writeBuffer(u,0,e),a.push(u);let c=this.storage(n*4);a.push(c);for(let p of r){let g=this.recMatmulT(o,a,u,p.buf,1,t,p.rows,s);o.copyBufferToBuffer(g,0,c,p.r0*4,p.rows*4)}let d=this.device.createBuffer({size:n*4,usage:i.GPUBufferUsage.COPY_DST|i.GPUBufferUsage.MAP_READ});o.copyBufferToBuffer(c,0,d,0,n*4),this.device.queue.submit([o.finish()]),await d.mapAsync(i.GPUMapMode.READ);let f=new Float32Array(d.getMappedRange().slice(0));return d.unmap(),d.destroy(),this.release(a),f}async selfValidate(){this.validationFailure=null;let e=A=>(this.validationFailure=A,console.error("[selfValidate] FAILED at:",A,"(hasF16="+this.hasF16+")"),!1),r=(A,k)=>A.length===k.length&&A.every((v,m)=>Math.abs(v-k[m])<.001),t=A=>Float32Array.from({length:A},()=>Math.random()*2-1),n=3,s=4,i=5,a=t(n*s),o=t(s*i),u=new Float32Array(n*i);for(let A=0;A<n;A++)for(let k=0;k<i;k++){let v=0;for(let m=0;m<s;m++)v+=a[A*s+m]*o[m*i+k];u[A*i+k]=v}if(!r(await this.matmul(a,o,n,s,i),u))return e("matmul");{let A=(v,m,x,y,P)=>{let U=new Float32Array(x*P);for(let F=0;F<x;F++)for(let q=0;q<P;q++){let O=0;for(let D=0;D<y;D++)O+=v[F*y+D]*m[q*y+D];U[F*P+q]=O}return U},k=async(v,m,x)=>{let y=t(v*m),P=t(x*m);return r(await this.matmulT(y,P,v,m,x),A(y,P,v,m,x))};if(!await k(3,8,5))return e("matmulT.vec4(3,8,5)");if(!await k(1,16,7))return e("matmulT.vec4(1,16,7)");if(!await k(2,6,4))return e("matmulT.scalar(2,6,4)");if(this.hasF16){let y=t(16),P=t(112),U=this.uploadGpuF16(P),F=await this.matmulT(y,U,1,16,7,!0),q=new Float32Array(7);for(let L=0;L<7;L++){let z=0;for(let Q=0;Q<16;Q++)z+=y[Q]*P[L*16+Q];q[L]=z}U.destroy?.();let O=L=>L.length===q.length&&L.every((z,Q)=>Math.abs(z-q[Q])<=.03*(1+Math.abs(q[Q])));if(!O(F))return e("matmulT.f16");let D=this.uploadGpu(P),K=this.f32ToF16Gpu(D,112),S=await this.matmulT(y,K,1,16,7,!0);if(D.destroy?.(),K.destroy?.(),!O(S))return e("packf16")}if(this.hasF16&&this.f16SharedOk){let v=[{m:20,k:128,n:18},{m:32,k:64,n:64},{m:70,k:40,n:130},{m:33,k:48,n:7}];for(let m of v){let x=t(m.m*m.k),y=t(m.n*m.k),P=this.uploadGpuF16(y),U=await this.matmulT(x,P,m.m,m.k,m.n,!0);this.f16SharedOk=!1;let F=await this.matmulT(x,P,m.m,m.k,m.n,!0);if(this.f16SharedOk=!0,P.destroy?.(),!(U.length===F.length&&U.every((O,D)=>Math.abs(O-F[D])<=.001*(1+Math.abs(F[D]))))){this.f16SharedOk=!1,console.warn(`[selfValidate] matmul_t_f16w_shared KO sur ce GPU (m=${m.m}, k=${m.k}, n=${m.n}) : repli sur matmul_t_f16w (plus lent, m\xEAme r\xE9sultat).`);break}}}}{let m=t(128),x=t(768),y=_e(x),P=this.uploadGpuRaw(y.nibbles),U=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),F=this.uploadGpuRaw(new Uint8Array(y.mins.buffer,y.mins.byteOffset,y.mins.byteLength)),q=await this.matmulQ4(m,P,U,F,1,128,6),O=ge(y),D=new Float32Array(6);for(let Q=0;Q<6;Q++){let V=0;for(let I=0;I<128;I++)V+=m[I]*O[Q*128+I];D[Q]=V}if(P.destroy?.(),U.destroy?.(),F.destroy?.(),!r(q,D))return e("matmulQ4");let K=this.uploadGpu(x),S=this.f32ToQ4Gpu(K,768),L=await this.matmulQ4(m,S.nib,S.sc,S.mn,1,128,6);if(K.destroy?.(),S.nib.destroy?.(),S.sc.destroy?.(),S.mn.destroy?.(),!(L.length===D.length&&L.every((Q,V)=>Math.abs(Q-D[V])<=.06*(1+Math.abs(D[V]))+.02)))return e("quantize_q4")}{let m=t(640),x=t(768),y=Wr(x),P=this.uploadGpuRaw(new Uint8Array(y.lo.buffer,y.lo.byteOffset,y.lo.byteLength)),U=this.uploadGpuRaw(new Uint8Array(y.hi.buffer,y.hi.byteOffset,y.hi.byteLength)),F=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),q=this.uploadGpuRaw(new Uint8Array(y.mins.buffer,y.mins.byteOffset,y.mins.byteLength)),O=await this.matmulQ3(m,P,U,F,q,5,128,6),D=Ce(y),K=new Float32Array(30);for(let S=0;S<5;S++)for(let L=0;L<6;L++){let z=0;for(let Q=0;Q<128;Q++)z+=m[S*128+Q]*D[L*128+Q];K[S*6+L]=z}if(P.destroy?.(),U.destroy?.(),F.destroy?.(),q.destroy?.(),!r(O,K))return e("matmulQ3")}{let m=t(640),x=t(768),y=_e(x),P=this.uploadGpuRaw(y.nibbles),U=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),F=this.uploadGpuRaw(new Uint8Array(y.mins.buffer,y.mins.byteOffset,y.mins.byteLength)),q=await this.matmulQ4Tiled(m,P,U,F,5,128,6),O=ge(y),D=new Float32Array(30);for(let K=0;K<5;K++)for(let S=0;S<6;S++){let L=0;for(let z=0;z<128;z++)L+=m[K*128+z]*O[S*128+z];D[K*6+S]=L}if(P.destroy?.(),U.destroy?.(),F.destroy?.(),!r(q,D))return e("matmul_q4_tiled")}for(let A of[{m:20,n:18},{m:32,n:64},{m:70,n:130}]){let k=A.m,v=128,m=A.n,x=t(k*v),y=t(m*v),P=_e(y),U=this.uploadGpuRaw(P.nibbles),F=this.uploadGpuRaw(new Uint8Array(P.scales.buffer,P.scales.byteOffset,P.scales.byteLength)),q=this.uploadGpuRaw(new Uint8Array(P.mins.buffer,P.mins.byteOffset,P.mins.byteLength)),O=await this.matmulQ4Shared(x,U,F,q,k,v,m),D=ge(P),K=new Float32Array(k*m);for(let S=0;S<k;S++)for(let L=0;L<m;L++){let z=0;for(let Q=0;Q<v;Q++)z+=x[S*v+Q]*D[L*v+Q];K[S*m+L]=z}if(U.destroy?.(),F.destroy?.(),q.destroy?.(),!r(O,K))return e(`matmul_q4_shared(${k},${m})`)}{let m=t(128),x=t(768),y=Ge(x),P=this.uploadGpuRaw(new Uint8Array(y.codes.buffer,y.codes.byteOffset,y.codes.byteLength)),U=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),F=await this.matmulQ8(m,P,U,1,128,6),q=me(y),O=new Float32Array(6);for(let L=0;L<6;L++){let z=0;for(let Q=0;Q<128;Q++)z+=m[Q]*q[L*128+Q];O[L]=z}if(P.destroy?.(),U.destroy?.(),!r(F,O))return e("matmulQ8");let D=this.uploadGpu(x),K=this.f32ToQ8Gpu(D,768),S=await this.matmulQ8(m,K.codes,K.sc,1,128,6);if(D.destroy?.(),K.codes.destroy?.(),K.sc.destroy?.(),!r(S,O))return e("quantize_q8")}{let m=t(640),x=t(768),y=Ge(x),P=this.uploadGpuRaw(new Uint8Array(y.codes.buffer,y.codes.byteOffset,y.codes.byteLength)),U=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),F=await this.matmulQ8Tiled(m,P,U,5,128,6),q=me(y),O=new Float32Array(30);for(let D=0;D<5;D++)for(let K=0;K<6;K++){let S=0;for(let L=0;L<128;L++)S+=m[D*128+L]*q[K*128+L];O[D*6+K]=S}if(P.destroy?.(),U.destroy?.(),!r(F,O))return e("matmul_q8_tiled")}for(let A of[{k:128,n:6},{k:128,n:130},{k:4096,n:17}]){let k=A.k,v=A.n,m=t(k),x=t(v*k),y=_e(x),P=this.uploadGpuRaw(y.nibbles),U=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),F=this.uploadGpuRaw(new Uint8Array(y.mins.buffer,y.mins.byteOffset,y.mins.byteLength)),q=await this.matmulQ4Vec(m,P,U,F,k,v),O=ge(y),D=new Float32Array(v);for(let I=0;I<v;I++){let X=0;for(let M=0;M<k;M++)X+=m[M]*O[I*k+M];D[I]=X}if(P.destroy?.(),U.destroy?.(),F.destroy?.(),!r(q,D))return e(`matmul_q4_vec(${k},${v})`);let K=Ge(x),S=this.uploadGpuRaw(new Uint8Array(K.codes.buffer,K.codes.byteOffset,K.codes.byteLength)),L=this.uploadGpuRaw(new Uint8Array(K.scales.buffer,K.scales.byteOffset,K.scales.byteLength)),z=await this.matmulQ8Vec(m,S,L,k,v),Q=me(K),V=new Float32Array(v);for(let I=0;I<v;I++){let X=0;for(let M=0;M<k;M++)X+=m[M]*Q[I*k+M];V[I]=X}if(S.destroy?.(),L.destroy?.(),!r(z,V))return e(`matmul_q8_vec(${k},${v})`)}for(let A of[{m:20,n:18},{m:32,n:64},{m:70,n:130}]){let k=A.m,v=128,m=A.n,x=t(k*v),y=t(m*v),P=Ge(y),U=this.uploadGpuRaw(new Uint8Array(P.codes.buffer,P.codes.byteOffset,P.codes.byteLength)),F=this.uploadGpuRaw(new Uint8Array(P.scales.buffer,P.scales.byteOffset,P.scales.byteLength)),q=await this.matmulQ8Shared(x,U,F,k,v,m),O=me(P),D=new Float32Array(k*m);for(let K=0;K<k;K++)for(let S=0;S<m;S++){let L=0;for(let z=0;z<v;z++)L+=x[K*v+z]*O[S*v+z];D[K*m+S]=L}if(U.destroy?.(),F.destroy?.(),!r(q,D))return e(`matmul_q8_shared(${k},${m})`)}if(this.qShared2Ok){let A=[{m:64,k:128,n:128},{m:65,k:128,n:130},{m:100,k:160,n:18},{m:70,k:96,n:200}];for(let k of A){let v=k.m,m=k.k,x=k.n,y=t(v*m),P=t(x*m),U=new Float32Array(v*x),F=Ge(P),q=me(F);for(let M=0;M<v;M++)for(let T=0;T<x;T++){let R=0;for(let j=0;j<m;j++)R+=y[M*m+j]*q[T*m+j];U[M*x+T]=R}let O=this.uploadGpuRaw(new Uint8Array(F.codes.buffer,F.codes.byteOffset,F.codes.byteLength)),D=this.uploadGpuRaw(new Uint8Array(F.scales.buffer,F.scales.byteOffset,F.scales.byteLength)),K=await this.matmulQ8Shared2(y,O,D,v,m,x);O.destroy?.(),D.destroy?.();let S=_e(P),L=ge(S),z=new Float32Array(v*x);for(let M=0;M<v;M++)for(let T=0;T<x;T++){let R=0;for(let j=0;j<m;j++)R+=y[M*m+j]*L[T*m+j];z[M*x+T]=R}let Q=this.uploadGpuRaw(S.nibbles),V=this.uploadGpuRaw(new Uint8Array(S.scales.buffer,S.scales.byteOffset,S.scales.byteLength)),I=this.uploadGpuRaw(new Uint8Array(S.mins.buffer,S.mins.byteOffset,S.mins.byteLength)),X=await this.matmulQ4Shared2(y,Q,V,I,v,m,x);if(Q.destroy?.(),V.destroy?.(),I.destroy?.(),!r(K,U)||!r(X,z)){this.qShared2Ok=!1,console.warn(`[selfValidate] matmul_t_q8/q4_shared2 KO sur ce GPU (m=${v}, k=${m}, n=${x}) : repli sur les tuiles 32\xD764 v1 (plus lentes, m\xEAme r\xE9sultat).`);break}}}{let k=t(1632),v=new Uint8Array(k.buffer,k.byteOffset,k.byteLength),m=(x,y)=>x.length===y.length&&x.every((P,U)=>P===y[U]);if(!m(await this.quantizeToBytes("F32",v,1632,"q8"),await this.quantizeToBytes("F32",v,1632,"q8",256)))return e("quantize_chunk_q8");if(!m(await this.quantizeToBytes("F32",v,1632,"q4"),await this.quantizeToBytes("F32",v,1632,"q4",256)))return e("quantize_chunk_q4")}let c=2,d=8,f=t(c*d),p=t(d),g=new Float32Array(c*d);for(let A=0;A<c;A++){let k=0;for(let m=0;m<d;m++)k+=f[A*d+m]**2;let v=1/Math.sqrt(k/d+1e-5);for(let m=0;m<d;m++)g[A*d+m]=f[A*d+m]*v*p[m]}if(!r(await this.rmsnorm(f,p,c,d),g))return e("rmsnorm");if(!r(await this.rmsnorm(f,p,c,d,1e-5,!0),Me(f,p,c,d,1e-5,!0)))return e("rmsnorm.onePlus");let h=t(16),b=t(16),w=h.map((A,k)=>A/(1+Math.exp(-A))*b[k]);if(!r(await this.swiglu(h,b),w))return e("swiglu");let _=h.map((A,k)=>Xr(A)*b[k]);if(!r(await this.geglu(h,b),_))return e("geglu");let G=h.map((A,k)=>A+b[k]);if(!r(await this.add(h,b),G))return e("add");{let A=ee.MAX_WG_DIM*ue+257,k=new Float32Array(A),v=new Float32Array(A),m=[0,1,ue-1,ue,ee.MAX_WG_DIM*ue-1,ee.MAX_WG_DIM*ue,A-1];for(let P of m)k[P]=P%7-3,v[P]=P%5-2;let x=await this.add(k,v),y=x.length===A;for(let P of m)Math.abs(x[P]-(k[P]+v[P]))>1e-5&&(y=!1);if(!y)return e("grid1D.add(2D)")}let B=(A,k,v=.003)=>A.length===k.length&&A.every((m,x)=>Math.abs(m-k[x])<=v*(1+Math.abs(k[x])));{let y=t(8);if(!B(await this.rope(y,2,4,2,1,1e4),Xe(y,2,4,2,1,1e4)))return e("rope")}{let y=t(384),P=new Float32Array(64/2).fill(1);if(!B(await this.ropeFactors(y,P,6,64,2,7,5e5),Xe(y,6,64,2,7,5e5)))return e("rope_factors.ones");let U=Float32Array.from({length:64/2},(F,q)=>1+q%5*.7);if(!B(await this.ropeFactors(y,U,6,64,2,7,5e5),_s(y,U,6,64,2,7,5e5)))return e("rope_factors")}{let y=t(384);if(!B(await this.rope(y,6,64,2,7,5e5,!0),ht(y,6,64,2,7,5e5)))return e("rope.interleaved");let P=t(8);if(!B(await this.rope(P,2,4,2,3,1e4,!0),ht(P,2,4,2,3,1e4)))return e("rope.interleaved.hd4");let U=t(384);if(!B(await this.rope(U,6,64,2,0,5e5,!0),ht(U,6,64,2,0,5e5)))return e("rope.interleaved.pos0");let F=64/2,q=new Float32Array(384);for(let L=0;L<6;L++)for(let z=0;z<F;z++)q[L*64+2*z]=y[L*64+z],q[L*64+2*z+1]=y[L*64+z+F];let O=await this.rope(q,6,64,2,7,5e5,!0),D=await this.rope(y,6,64,2,7,5e5,!1),K=new Float32Array(384);for(let L=0;L<6;L++)for(let z=0;z<F;z++)K[L*64+2*z]=D[L*64+z],K[L*64+2*z+1]=D[L*64+z+F];if(!B(O,K))return e("rope.interleaved.equivalence");let S=Float32Array.from({length:F},(L,z)=>1+z%5*.7);if(!B(await this.ropeFactors(y,S,6,64,2,7,5e5,!0),ht(y,6,64,2,7,5e5,S)))return e("rope_factors.interleaved")}{let v=[16,24,24],m=1e6,x=3,y=x*2,P=5,U=t(y*128),F=new Uint32Array(x*3);for(let K=0;K<x;K++){let S=P+K;F.set([S,S,S],K*3)}let q=new Uint32Array([5,5,5,5,6,9,5,7,5]),O=B(await this.ropeMrope(U,F,y,128,2,v,m),Xe(U,y,128,2,P,m)),D=B(await this.ropeMrope(U,q,y,128,2,v,m),xs(U,q,y,128,2,v,m));(!O||!D)&&(this.mropeOk=!1,console.error(`[selfValidate] rope_mrope KO sur ce GPU (${O?"positions 3D":"d\xE9g\xE9n\xE9r\xE9\u2260rope"}). Vision d\xE9sactiv\xE9e, chat texte intact.`))}{let P=t(32),U=t(32),F=t(32);if(!B(await this.attention(P,U,F,2,4,2,4,2),Ae(P,U,F,2,4,2,4,2)))return e("attention");let q=.3,O=5;if(!B(await this.attention(P,U,F,2,4,2,4,2,q,O),Ae(P,U,F,2,4,2,4,2,q,O)))return e("attention.softcap");{let V=t(24),I=t(48),X=t(48);for(let M of[1,4,8,64]){if(!B(await this.attention(V,I,X,3,2,1,4,9,void 0,0,M),Ae(V,I,X,3,2,1,4,9,void 0,0,M)))return e(`attention.window(${M})`);if(!B(await this.attentionDecode(V,I,X,3,2,1,4,9,void 0,0,M),Ae(V,I,X,3,2,1,4,9,void 0,0,M)))return e(`attention_decode.window(${M})`)}}{let D=await this.quantizeKvReadback(U,4,2,4),K=await this.quantizeKvReadback(F,4,2,4),S=await this.attentionQ8Kv(P,D.codes,D.scales,K.codes,K.scales,2,4,2,4,2),L=(X,M)=>{let T=new Float32Array(32);for(let R=0;R<4;R++)for(let j=0;j<2;j++){let N=M[R*2+j];for(let $=0;$<4;$++){let W=R*2*4+j*4+$,H=X[W>>2]>>(W&3)*8&255;T[W]=(H<128?H:H-256)*N}}return T},z=L(D.codes,D.scales),Q=L(K.codes,K.scales),V=Ae(P,z,Q,2,4,2,4,2);if(!B(S,V,.005))return e("attention.q8kv");let I=0;for(let X=0;X<U.length;X++)I=Math.max(I,Math.abs(z[X]-U[X]));if(I>.05)return e("quantize_kv.error")}}{let A=v=>{this.attnDecodeOk=!1,console.error("[selfValidate] attention d\xE9codage HS sur ce GPU (\xE9tape :",v,") \u2192 repli kernels classiques (plus lents \xE0 contexte long, corrects)")},k=[{nT:1,nH:14,nKv:2,hd:64,past:300},{nT:10,nH:14,nKv:2,hd:64,past:173}];for(let v of k){if(!this.attnDecodeOk)break;let m=v.past+v.nT,x=t(v.nT*v.nH*v.hd),y=t(m*v.nKv*v.hd),P=t(m*v.nKv*v.hd);if(!B(await this.attentionDecode(x,y,P,v.nT,v.nH,v.nKv,v.hd,v.past),Ae(x,y,P,v.nT,v.nH,v.nKv,v.hd,v.past))){A(`decode(nT=${v.nT})`);break}let U=await this.quantizeKvReadback(y,m,v.nKv,v.hd),F=await this.quantizeKvReadback(P,m,v.nKv,v.hd),q=await this.attentionQ8KvDecode(x,U.codes,U.scales,F.codes,F.scales,v.nT,v.nH,v.nKv,v.hd,v.past),O=await this.attentionQ8Kv(x,U.codes,U.scales,F.codes,F.scales,v.nT,v.nH,v.nKv,v.hd,v.past);if(!B(q,O,.005)){A(`decode.q8kv(nT=${v.nT})`);break}}if(this.attnDecodeOk){let U=t(64),F=t(350*8),q=t(350*8);B(await this.attentionDecode(U,F,q,2,4,2,8,173,.3,5),Ae(U,F,q,2,4,2,8,173,.3,5))||A("decode.softcap")}if(this.attnDecodeOk){let U=t(256),F=t(9088),q=t(9088);B(await this.attentionDecode(U,F,q,1,2,1,128,70),Ae(U,F,q,1,2,1,128,70))||A("decode.hd128")}}{let A=m=>{this.attnPrefillOk=!1,console.error("[selfValidate] attention prefill tuil\xE9e HS sur ce GPU (\xE9tape :",m,") \u2192 repli kernel classique (plus lent en prefill, correct)")},k=[{nT:37,nH:14,nKv:2,hd:64,past:0,sc:void 0,cap:0,win:0},{nT:13,nH:14,nKv:2,hd:64,past:173,sc:void 0,cap:0,win:0},{nT:1,nH:14,nKv:2,hd:64,past:300,sc:void 0,cap:0,win:0},{nT:4,nH:4,nKv:2,hd:32,past:7,sc:void 0,cap:0,win:0},{nT:5,nH:4,nKv:2,hd:32,past:0,sc:void 0,cap:0,win:0},{nT:9,nH:2,nKv:1,hd:128,past:70,sc:void 0,cap:0,win:0},{nT:6,nH:4,nKv:2,hd:8,past:17,sc:.3,cap:5,win:0}];for(let m of k){let x=m.past+m.nT,y=t(m.nT*m.nH*m.hd),P=t(x*m.nKv*m.hd),U=t(x*m.nKv*m.hd);if(!B(await this.attentionPrefill(y,P,U,m.nT,m.nH,m.nKv,m.hd,m.past,m.sc,m.cap,m.win),Ae(y,P,U,m.nT,m.nH,m.nKv,m.hd,m.past,m.sc,m.cap,m.win))){A(`prefill(nT=${m.nT},hd=${m.hd},past=${m.past}${m.cap>0?",softcap":""})`);break}}if(this.attnPrefillOk){let q=t(80),O=t(76),D=t(76);for(let K of[1,4,8,64])if(!B(await this.attentionPrefill(q,O,D,10,2,1,4,9,void 0,0,K),Ae(q,O,D,10,2,1,4,9,void 0,0,K))){A(`prefill.window(${K})`);break}}let v=[{nT:37,nH:14,nKv:2,hd:64,past:0,win:0},{nT:13,nH:14,nKv:2,hd:64,past:173,win:0},{nT:10,nH:2,nKv:1,hd:8,past:9,win:4}];for(let m of v){if(!this.attnPrefillOk)break;let x=m.past+m.nT,y=t(m.nT*m.nH*m.hd),P=t(x*m.nKv*m.hd),U=t(x*m.nKv*m.hd),F=await this.quantizeKvReadback(P,x,m.nKv,m.hd),q=await this.quantizeKvReadback(U,x,m.nKv,m.hd),O=await this.attentionQ8KvPrefill(y,F.codes,F.scales,q.codes,q.scales,m.nT,m.nH,m.nKv,m.hd,m.past,void 0,0,m.win),D=await this.attentionQ8Kv(y,F.codes,F.scales,q.codes,q.scales,m.nT,m.nH,m.nKv,m.hd,m.past,void 0,0,m.win);if(!B(O,D,.005)){A(`prefill.q8kv(nT=${m.nT},win=${m.win})`);break}}}{let A=v=>{this.rmsVecOk=!1,console.error("[selfValidate] RMSNorm parall\xE8le HS sur ce GPU (\xE9tape :",v,") \u2192 repli kernel une-ligne-par-thread (correct, plus lent en d\xE9codage)")},k=[{rows:1,dim:1024,onePlus:!1},{rows:1,dim:1536,onePlus:!1},{rows:1,dim:100,onePlus:!1},{rows:14,dim:64,onePlus:!1},{rows:37,dim:2048,onePlus:!1},{rows:3,dim:128,onePlus:!0}];for(let v of k){let m=t(v.rows*v.dim),x=t(v.dim),y=await this.rmsnormVec(m,x,v.rows,v.dim,1e-6,v.onePlus),P=await this.rmsnorm(m,x,v.rows,v.dim,1e-6,v.onePlus);if(!B(y,P,.005)){A(`rmsnorm_vec(${v.rows}\xD7${v.dim}${v.onePlus?",1+w":""})`);break}}}{let A=v=>{this.topKParOk=!1,console.error("[selfValidate] top-K parall\xE8le HS sur ce GPU (\xE9tape :",v,") \u2192 repli s\xE9lection sur un thread (correcte, plus lente)")},k=[{n:151936,k:64,ties:!1,label:"vocab Qwen (151936)"},{n:65536,k:64,ties:!1,label:"vocab World (65536)"},{n:1e3,k:64,ties:!1,label:"n non multiple de 128"},{n:300,k:64,ties:!1,label:"n < 1024 candidats"},{n:4096,k:8,ties:!1,label:"petit K"},{n:8192,k:64,ties:!0,label:"EX \xC6QUO (d\xE9partage)"}];for(let v of k){if(!this.topKParOk)break;let m=v.ties?Float32Array.from({length:v.n},(U,F)=>Math.round(Math.random()*6)+(F%7===0?3:0)):t(v.n),x=await this.topKReadback(m,v.k,"top_k"),y=await this.topKReadback(m,v.k,"top_k_par");if(!(x.length===y.length&&x.every((U,F)=>U===y[F]))){let U=x.findIndex((F,q)=>F!==y[q]);A(`top_k_par(${v.label}). Premier \xE9cart au rang ${U} : ${x[U]} vs ${y[U]}`);break}}}{let U={seq:3,d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},F={attnNorm:t(16),wq:t(256),wk:t(128),wv:t(128),wo:t(256),bq:t(16),bk:t(8),bv:t(8),ffnNorm:t(16),wgate:t(256),wup:t(256),wdown:t(256)},q=t(48);if(!B(await this.layerForward(q,U,F),Ht(q,U,F),.005))return e("layerForward")}{let F={seq:3,d:12,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6,attnScale:1/Math.sqrt(4),attnLogitSoftcap:5,act:"gelu",rmsGainOnePlus:!0},q={attnNorm:t(12),wq:t(192),wk:t(96),wv:t(96),wo:t(192),ffnNorm:t(12),wgate:t(192),wup:t(192),wdown:t(192),postAttnNorm:t(12),postFfnNorm:t(12)},O=t(36);if(!B(await this.layerForward(O,F,q),Ht(O,F,q),.005))return e("layerForward.gemma2")}{let F={seq:3,d:12,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e6,eps:1e-6},q={attnNorm:t(12),wq:t(192),wk:t(96),wv:t(96),wo:t(192),ffnNorm:t(12),wgate:t(192),wup:t(192),wdown:t(192),qNorm:t(4),kNorm:t(4)},O=t(36);if(!B(await this.layerForward(O,F,q),Ht(O,F,q),.005))return e("layerForward.qwen3")}{let k=new Uint8Array(720);for(let m=0;m<5;m++){let x=m*144,y=new DataView(k.buffer);y.setUint16(x,De(.005+Math.random()*.05),!0),y.setUint16(x+2,De(.001+Math.random()*.02),!0);for(let P=4;P<144;P++)k[x+P]=Math.random()*256|0}let v=await this.dequantizeQ4K(k,5*256);if(!B(v,vs(k,5),1e-4))return e("dequant.Q4_K")}{let A=q=>{let O=new Uint8Array(q);for(let D=0;D<q;D++)O[D]=Math.random()*256|0;return O},k=(q,O)=>{let D=new DataView(q.buffer),K=S=>O===210?S*210+208:S*O;for(let S=0;S*O<q.length;S++)D.setUint16(K(S),De(.005+Math.random()*.05),!0);return q},m=k(A(136),34);if(!B(await this.dequantizeByType("Q8_0",m,128),ws(m,4),1e-4))return e("dequant.Q8_0");let x=k(A(88),22);if(!B(await this.dequantizeByType("Q5_0",x,128),ys(x,4),1e-4))return e("dequant.Q5_0");let y=k(A(840),210);if(!B(await this.dequantizeByType("Q6_K",y,4*256),Ps(y,4),1e-4))return e("dequant.Q6_K");let P=k(A(72),18);if(!B(await this.dequantizeByType("Q4_0",P,128),ks(P,4),1e-4))return e("dequant.Q4_0");let U=A(704),F=new DataView(U.buffer);for(let q=0;q<4;q++)F.setUint16(q*176,De(.005+Math.random()*.05),!0),F.setUint16(q*176+2,De(.001+Math.random()*.02),!0);if(!B(await this.dequantizeByType("Q5_K",U,4*256),As(U,4),1e-4))return e("dequant.Q5_K")}{let P={d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},U={attnNorm:t(16),wq:t(256),wk:t(128),wv:t(128),wo:t(256),bq:t(16),bk:t(8),bv:t(8),ffnNorm:t(16),wgate:t(256),wup:t(256),wdown:t(256)},F=t(48),O=(await this.layerForward(F,{...P,seq:3},U)).slice(32,48),D=new Float32Array(0),K=await this.layerForwardKV(F.slice(0,32),{...P,seq:2},U,0,D,D),S=await this.layerForwardKV(F.slice(32,48),{...P,seq:1},U,2,K.k,K.v);if(!B(S.out,O,.005))return e("layerForwardKV")}{let v=t(4),m=t(40),x=new Float32Array(10);for(let F=0;F<10;F++){let q=0;for(let O=0;O<4;O++)q+=v[O]*m[F*4+O];x[F]=q}let y=0;for(let F=1;F<10;F++)x[F]>x[y]&&(y=F);let P=this.uploadGpu(m),U=await this.argmaxProjection(v,[{buf:P,rows:10,r0:0}],4,10,!1);if(P.destroy?.(),U!==y)return e("argmaxProjection")}{let P={seq:4,d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},U={attnNorm:t(16),wq:t(256),wk:t(128),wv:t(128),wo:t(256),bq:t(16),bk:t(8),bv:t(8),ffnNorm:t(16),wgate:t(256),wup:t(256),wdown:t(256)},F=t(16),q=t(64),O=new Float32Array(0),D=await this.layerForwardKV(q,{...P,seq:4},U,0,O,O,!0),K=Me(D.out.slice(48,64),F,1,16,1e-6),S={attnNorm:this.uploadGpu(U.attnNorm),wq:this.uploadGpu(U.wq),wk:this.uploadGpu(U.wk),wv:this.uploadGpu(U.wv),wo:this.uploadGpu(U.wo),ffnNorm:this.uploadGpu(U.ffnNorm),wgate:this.uploadGpu(U.wgate),wup:this.uploadGpu(U.wup),wdown:this.uploadGpu(U.wdown),bq:this.uploadGpu(U.bq),bk:this.uploadGpu(U.bk),bv:this.uploadGpu(U.bv)},L=this.uploadGpu(F),z=this.kvQuant;this.kvQuant=!1,this.resetKvGpu();let Q=await this.runDecodeGpu(q,{...P,seq:4},[S],0,L,"selftest-A");if(!B(Q,K,.008))return this.resetKvGpu(),this.kvQuant=z,e("runDecodeGpu.prefill");await this.runDecodeGpu(q.slice(0,48),{...P,seq:3},[S],0,L,"selftest-B");let V=await this.runDecodeGpu(q.slice(48,64),{...P,seq:1},[S],3,L,"selftest-B");if(!B(V,K,.008))return this.resetKvGpu(),this.kvQuant=z,e("runDecodeGpu.decode");this.kvQuant=z,this.resetKvGpu();for(let I of Object.values(S))I?.destroy?.();L.destroy?.()}{let x=Float32Array.from({length:152064},()=>(Math.random()*2-1)*8),y=[...new Set(Array.from({length:40},()=>Math.floor(Math.random()*152064)))],P=x.slice();for(let T=0;T<152064;T++)P[T]=30*Math.tanh(P[T]/30);for(let T of y)P[T]=P[T]>0?P[T]/1.15:P[T]*1.15;let U=Array.from(P.keys()).sort((T,R)=>P[R]-P[T]).slice(0,64),F=globalThis,q=[],O=this.storage(152064*4);this.device.queue.writeBuffer(O,0,x),q.push(O);let D=this.device.createCommandEncoder(),K=this.uniform([152064],{offset:4,value:30});this.recordPass(D,"softcap_logits",[K,O],this.grid1D(152064));let S=this.bufU32(Uint32Array.from(y),F.GPUBufferUsage.STORAGE|F.GPUBufferUsage.COPY_DST),L=this.uniform([y.length],{offset:4,value:1.15});this.recordPass(D,"penalize_logits",[L,S,O],this.grid1D(y.length));let z=this.storage(512),Q=this.uniform([152064,64]);this.recordPass(D,this.topKParOk?"top_k_par":"top_k",[Q,O,z],[1,1,1]),q.push(K,S,L,Q,z);let V=this.device.createBuffer({size:512,usage:F.GPUBufferUsage.COPY_DST|F.GPUBufferUsage.MAP_READ});D.copyBufferToBuffer(z,0,V,0,512),this.device.queue.submit([D.finish()]),await V.mapAsync(F.GPUMapMode.READ);let I=new Uint32Array(V.getMappedRange().slice(0));V.unmap(),V.destroy(),this.release(q);let X=I.slice(0,64),M=new Float32Array(I.buffer,256,64);this.topKOk=!0;for(let T=0;T<64;T++){let R=Math.abs(M[T]-P[U[T]])<=1e-4*(1+Math.abs(P[U[T]])),j=Math.abs(P[X[T]]-M[T])<=1e-4*(1+Math.abs(M[T]));if(!R||!j){this.topKOk=!1,console.error(`[selfValidate] top_k KO sur ce GPU (rang ${T}) : repli sur le sampling CPU plein-vocab (plus lent, m\xEAme r\xE9sultat).`);break}}}if(this.rwkvWkv7Ok){let m=t(128),x=t(16),y=t(16),P=t(16),U=t(16),F=t(16),q=Float32Array.from({length:16},()=>Math.random()*.5+.5),O=m.slice(),D=new Float32Array(16);for(let M=0;M<2;M++){let T=M*8;for(let R=0;R<8;R++){let j=M*8*8+R*8,N=P[T+R],$=0;for(let H=0;H<8;H++)$+=F[T+H]*O[j+H];let W=0;for(let H=0;H<8;H++){let Y=q[T+H]*O[j+H]+N*y[T+H]+U[T+H]*$;O[j+H]=Y,W+=x[T+H]*Y}D[T+R]=W}}let K=await this.rwkvWkv7(m.slice(),x,q,y,P,F,U,2,8),S=(M,T)=>M.length===T.length&&M.every((R,j)=>Math.abs(R-T[j])<=.001*(1+Math.abs(T[j])));!S(K.S,O)||!S(K.y,D)?(this.rwkvWkv7Ok=!1,console.error("[selfValidate] RWKV-7 WKV KO sur ce GPU : une archi RWKV (moteur v2) refuserait de charger (non bloquant pour le chat texte).")):console.log("[selfValidate] RWKV-7 WKV OK (r\xE9currence \xE0 \xE9tat fixe, moteur v2)");let L=16,z=t(L),Q=t(L),V=t(L*6),I=new Float32Array(L*6);for(let M=0;M<6;M++)for(let T=0;T<L;T++){let R=M*L+T;I[R]=z[T]+(Q[T]-z[T])*V[R]}let X=await this.rwkvTokenShift(z,Q,V,L);if(S(X,I)?console.log("[selfValidate] RWKV-7 token-shift OK"):(this.rwkvWkv7Ok=!1,console.error("[selfValidate] RWKV-7 token-shift KO sur ce GPU (non bloquant pour le chat texte).")),this.rwkvResidentOk){let M=globalThis,T=M.GPUBufferUsage.STORAGE|M.GPUBufferUsage.COPY_DST|M.GPUBufferUsage.COPY_SRC,R=2,j=8,N=R*j,$=(H,Y)=>{let re=Math.max(16,Math.ceil((H.length*4+(Y?4:0))/16)*16),te=this.device.createBuffer({size:re,usage:M.GPUBufferUsage.UNIFORM|M.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(te,0,new Uint32Array(H)),Y&&this.device.queue.writeBuffer(te,Y.off,new Float32Array([Y.val])),te},W=H=>this.device.createBuffer({size:H*4,usage:T});try{let H=t(N),Y=t(N),re=t(N),te=Float32Array.from({length:N},()=>Math.random()),ie=new Float32Array(N),le=new Float32Array(N),pe=new Float32Array(N);for(let de=0;de<R;de++){let ae=0;for(let we=0;we<j;we++){let he=H[de*j+we]*Y[de*j+we];ae+=he*he}ae=Math.sqrt(ae)||1e-12;for(let we=0;we<j;we++){let he=de*j+we,ut=H[he]*Y[he]/ae;le[he]=-ut,pe[he]=ut*te[he],ie[he]=H[he]*(1+(te[he]-1)*re[he])}}let J=W(N),Se=W(N),Z=W(N);this.dispatch("rwkv_kprep",[$([R,j]),this.buf(H,T),this.buf(te,T),this.buf(Y,T),this.buf(re,T),J,Se,Z],this.grid1D(R));let Te=S(await this.readBack(J,N*4),ie)&&S(await this.readBack(Se,N*4),le)&&S(await this.readBack(Z,N*4),pe);J.destroy?.(),Se.destroy?.(),Z.destroy?.();let ve=t(N),fr=t(N),pr=t(N),gr=t(N),hr=t(N),mr=t(N),br=new Float32Array(N);for(let de=0;de<R;de++){let ae=de*j,we=0;for(let ce=0;ce<j;ce++)we+=ve[ae+ce];we/=j;let he=0;for(let ce=0;ce<j;ce++){let Cr=ve[ae+ce]-we;he+=Cr*Cr}he/=j;let ut=1/Math.sqrt(he+64e-5),Or=0;for(let ce=0;ce<j;ce++)Or+=fr[ae+ce]*ie[ae+ce]*pr[ae+ce];for(let ce=0;ce<j;ce++)br[ae+ce]=(ve[ae+ce]-we)*ut*hr[ae+ce]+mr[ae+ce]+Or*gr[ae+ce]}let Ft=new Float32Array(2*N);Ft.set(hr,0),Ft.set(mr,N);let St=W(N);this.dispatch("rwkv_out_gn",[$([R,j],{off:8,val:64e-5}),this.buf(ve,T),this.buf(fr,T),this.buf(ie,T),this.buf(pr,T),this.buf(gr,T),this.buf(Ft,T),St],this.grid1D(R));let vr=S(await this.readBack(St,N*4),br);St.destroy?.();let wr=t(N),yr=t(N),es=Float32Array.from(wr,(de,ae)=>Math.exp(-.606531/(1+Math.exp(-(de+yr[ae]))))),Tt=W(N);this.dispatch("rwkv_decay",[this.buf(wr,T),this.buf(yr,T),Tt],this.grid1D(N));let kr=S(await this.readBack(Tt,N*4),es);Tt.destroy?.();let Ar=t(N),Pr=t(N),xr=t(N),_r=t(N),ts=Float32Array.from(Ar,(de,ae)=>de+(Pr[ae]-de)*(1/(1+Math.exp(-(xr[ae]+_r[ae]))))),Ot=this.buf(Ar,T);this.dispatch("rwkv_vresid",[Ot,this.buf(Pr,T),this.buf(xr,T),this.buf(_r,T)],this.grid1D(N));let Ur=S(await this.readBack(Ot,N*4),ts);Ot.destroy?.();let Gr=t(N),Br=t(N),qr=t(N),rs=Float32Array.from(Gr,(de,ae)=>de+(Br[ae]-de)*qr[ae]),Ct=W(N);this.dispatch("rwkv_lerp",[this.buf(Gr,T),this.buf(Br,T),this.buf(qr,T),Ct],this.grid1D(N));let Fr=S(await this.readBack(Ct,N*4),rs);Ct.destroy?.();let Sr=t(N),ns=Float32Array.from(Sr,de=>{let ae=Math.max(de,0);return ae*ae}),Mt=W(N);this.dispatch("sqrelu",[this.buf(Sr,T),Mt],this.grid1D(N));let Tr=S(await this.readBack(Mt,N*4),ns);Mt.destroy?.(),!Te||!vr||!kr||!Ur||!Fr||!Tr?(this.rwkvResidentOk=!1,console.error(`[selfValidate] glu RWKV r\xE9sidente KO sur ce GPU (kprep:${Te} gn:${vr} decay:${kr} vresid:${Ur} lerp:${Fr} sqrelu:${Tr}). Repli forwardToken JS+readback (correct, lent).`)):console.log("[selfValidate] glu RWKV r\xE9sidente OK (kprep, out_gn, decay, vresid, lerp, sqrelu)")}catch(H){this.rwkvResidentOk=!1,console.error("[selfValidate] glu RWKV r\xE9sidente : erreur d\u2019ex\xE9cution. Repli forwardToken JS+readback.",H)}}}if(this.lfm2ShortConvOk){let A=O=>Float32Array.from({length:O},()=>Math.random()*2-1),k=(O,D)=>O.length===D.length&&O.every((K,S)=>Math.abs(K-D[S])<=.001*(1+Math.abs(D[S]))),x=A(96),y=A(64),P=A(96),U=new Float32Array(32),F=y.slice();for(let O=0;O<32;O++){let D=x[O]*x[64+O],K=P[O*3+2]*D;for(let S=0;S<2;S++)K+=P[O*3+S]*y[S*32+O];for(let S=0;S+2<3;S++)F[S*32+O]=y[(S+1)*32+O];F[32+O]=D,U[O]=K*x[32+O]}let q=await this.lfm2ShortConv(x,y.slice(),P,32,3);!k(q.out,U)||!k(q.state,F)?(this.lfm2ShortConvOk=!1,console.error("[selfValidate] LFM2 shortconv KO sur ce GPU : une archi lfm2 refuserait de charger (non bloquant pour le reste).")):console.log("[selfValidate] LFM2 shortconv OK (conv courte gat\xE9e, moteur v2)")}let C=await this.validateDiffusion();C?console.warn("[selfValidate] image-gen primitive KO:",C,"(non bloquant: chemin texte intact)"):console.log(`[selfValidate] image-gen primitives OK (silu, group_norm, conv2d, conv2d_direct, conv2d_direct_q8/q4, conv 3\xD73 tuil\xE9 q8/q4 ${this.convTiledQOk?"OK":"KO (repli direct)"}, relu, upsample_nearest, layernorm, quick_gelu, attention_full)`);let E=await this.validateVideoResident();return E?(this.videoResidentOk=!1,console.warn("[selfValidate] motion r\xE9sident KO:",E,", repli JS+readback (plus lent, m\xEAme r\xE9sultat).")):console.log("[selfValidate] motion r\xE9sident OK (video_motion_gather, video_motion_scatter, video_add_pe, attn_temporal)"),!0}async validateVideoResident(){let e=o=>Float32Array.from({length:o},()=>Math.random()*2-1),r=(o,u,c=.005)=>o.length===u.length&&o.every((d,f)=>Math.abs(d-u[f])<=c*(1+Math.abs(u[f])));{let o=e(120),u=new Float32Array(120);for(let f=0;f<5;f++)for(let p=0;p<3;p++)for(let g=0;g<8;g++)u[(f*3+p)*8+g]=o[(p*8+g)*5+f];let c=this.recordingSession(),d=await c.finish(c.videoGather(o,3,8,5),120);if(!r(d,u,1e-6))return"video_motion_gather"}{let o=e(120),u=e(120),c=new Float32Array(120);for(let p=0;p<3;p++)for(let g=0;g<8;g++)for(let h=0;h<5;h++)c[(p*8+g)*5+h]=o[(h*3+p)*8+g]+u[(p*8+g)*5+h];let d=this.recordingSession(),f=await d.finish(d.videoScatter(o,u,3,8,5),120);if(!r(f,c,1e-6))return"video_motion_scatter"}{let o=e(120),u=e(24),c=new Float32Array(120);for(let p=0;p<5;p++)for(let g=0;g<3;g++)for(let h=0;h<8;h++)c[(p*3+g)*8+h]=o[(p*3+g)*8+h]+u[g*8+h];let d=this.recordingSession(),f=await d.finish(d.videoAddPe(o,u,3,8,5),120);if(!r(f,c,1e-6))return"video_add_pe"}{let o=e(120),u=e(120),c=e(120),d=1/Math.sqrt(4),f=new Float32Array(120);for(let h=0;h<5;h++)for(let b=0;b<2;b++){let w=b*4,_=h*3;for(let G=0;G<3;G++){let B=(_+G)*8+w,C=new Float32Array(3),E=-1e30;for(let k=0;k<3;k++){let v=0,m=(_+k)*8+w;for(let x=0;x<4;x++)v+=o[B+x]*u[m+x];C[k]=v*d,C[k]>E&&(E=C[k])}let A=0;for(let k=0;k<3;k++)C[k]=Math.exp(C[k]-E),A+=C[k];for(let k=0;k<3;k++){let v=C[k]/A,m=(_+k)*8+w;for(let x=0;x<4;x++)f[B+x]+=v*c[m+x]}}}let p=this.recordingSession(),g=await p.finish(p.attnTemporal(o,u,c,5,3,2,4),120);if(!r(g,f))return"attn_temporal"}return null}async validateDiffusion(){let e=T=>Float32Array.from({length:T},()=>Math.random()*2-1),r=(T,R,j=.005)=>T.length===R.length&&T.every((N,$)=>Math.abs(N-R[$])<=j*(1+Math.abs(R[$]))),t=e(70),n=t.map(T=>T/(1+Math.exp(-T)));if(!r(await this.silu(t),n))return"silu";let s=4,i=5,a=2,o=1e-5,u=e(s*i),c=e(s),d=e(s),f=new Float32Array(s*i),p=s/a;for(let T=0;T<a;T++){let R=T*p*i,j=p*i,N=0;for(let H=0;H<j;H++)N+=u[R+H];N/=j;let $=0;for(let H=0;H<j;H++){let Y=u[R+H]-N;$+=Y*Y}$/=j;let W=1/Math.sqrt($+o);for(let H=0;H<j;H++){let Y=T*p+Math.floor(H/i);f[R+H]=(u[R+H]-N)*W*c[Y]+d[Y]}}if(!r(await this.groupNorm(u,c,d,s,i,a,o),f))return"group_norm";let g=2,h=4,b=4,w=3,_=3,G=1,B=1,C=4,E=4,A=e(g*h*b),k=e(w*g*_*_),v=e(w),m=new Float32Array(w*C*E);for(let T=0;T<w;T++)for(let R=0;R<C;R++)for(let j=0;j<E;j++){let N=v[T];for(let $=0;$<g;$++)for(let W=0;W<_;W++)for(let H=0;H<_;H++){let Y=R*G+W-B,re=j*G+H-B;Y>=0&&Y<h&&re>=0&&re<b&&(N+=A[$*h*b+Y*b+re]*k[((T*g+$)*_+W)*_+H])}m[(T*C+R)*E+j]=N}if(!r(await this.conv2d(A,k,v,g,h,b,w,_,_,G,B),m))return"conv2d";if(!r(await this.conv2dDirect(A,k,v,g,h,b,w,_,_,G,B),m))return"conv2d_direct";{let $=e(1200),W=e(108),H=e(4),Y=await this.conv2dDirect($,W,H,3,20,20,4,3,3,1,1),re=this.convTiledOk;this.convTiledOk=!0;let te=this.recordingSession(),ie=await te.finish(te.conv2d($,W,H,3,20,20,4,3,3,1,1),1600);this.convTiledOk=re,r(ie,Y)||(this.convTiledOk=!1,console.warn("[selfValidate] conv2d_3x3_tiled KO sur ce GPU : repli sur conv2d_direct (plus lent, m\xEAme r\xE9sultat)."))}{let j=e(8*h*b),N=e(32*_*_),$=e(4),W=Ge(N),H=await this.conv2dDirect(j,me(W),$,8,h,b,4,_,_,G,B),Y={codes:this.uploadGpuRaw(new Uint8Array(W.codes.buffer,W.codes.byteOffset,W.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(W.scales.buffer,W.scales.byteOffset,W.scales.byteLength))},re=this.convTiledQOk;this.convTiledQOk=!1;let te=this.recordingSession(),ie=await te.finish(te.conv2d(j,Y,$,8,h,b,4,_,_,G,B),4*h*b);if(this.convTiledQOk=re,this.releaseGpu([Y.codes,Y.sc]),!r(ie,H))return"conv2d_direct_q8"}{let j=e(8*h*b),N=e(32*_*_),$=e(4),W=_e(N),H=await this.conv2dDirect(j,ge(W),$,8,h,b,4,_,_,G,B),Y={nib:this.uploadGpuRaw(W.nibbles),sc:this.uploadGpuRaw(new Uint8Array(W.scales.buffer,W.scales.byteOffset,W.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(W.mins.buffer,W.mins.byteOffset,W.mins.byteLength))},re=this.convTiledQOk;this.convTiledQOk=!1;let te=this.recordingSession(),ie=await te.finish(te.conv2d(j,Y,$,8,h,b,4,_,_,G,B),4*h*b);if(this.convTiledQOk=re,this.releaseGpu([Y.nib,Y.sc,Y.mn]),!r(ie,H))return"conv2d_direct_q4"}{let $=e(16e3),W=e(480),H=e(12),Y=this.convTiledQOk;for(let re of["q8","q4"]){let te=re==="q8"?(()=>{let J=Ge(W);return{deq:me(J),gpu:{codes:this.uploadGpuRaw(new Uint8Array(J.codes.buffer,J.codes.byteOffset,J.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(J.scales.buffer,J.scales.byteOffset,J.scales.byteLength))}}})():(()=>{let J=_e(W);return{deq:ge(J),gpu:{nib:this.uploadGpuRaw(J.nibbles),sc:this.uploadGpuRaw(new Uint8Array(J.scales.buffer,J.scales.byteOffset,J.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(J.mins.buffer,J.mins.byteOffset,J.mins.byteLength))}}})(),ie=await this.conv2dDirect($,te.deq,H,40,20,20,12,1,1,1,0);this.convTiledQOk=!0;let le=this.recordingSession(),pe=await le.finish(le.conv2d($,te.gpu,H,40,20,20,12,1,1,1,0),4800);if(this.releaseGpu(Object.values(te.gpu)),!r(pe,ie)){Y&&console.warn(`[selfValidate] conv2d_1x1_${re} KO sur ce GPU : repli sur conv2d_direct_${re}.`),this.convTiledQOk=!1;break}}this.convTiledQOk=this.convTiledQOk&&Y}{let $=e(3200),W=e(288),H=e(4),Y=this.convTiledQOk;for(let re of["q8","q4"]){let te=re==="q8"?(()=>{let J=Ge(W);return{deq:me(J),gpu:{codes:this.uploadGpuRaw(new Uint8Array(J.codes.buffer,J.codes.byteOffset,J.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(J.scales.buffer,J.scales.byteOffset,J.scales.byteLength))}}})():(()=>{let J=_e(W);return{deq:ge(J),gpu:{nib:this.uploadGpuRaw(J.nibbles),sc:this.uploadGpuRaw(new Uint8Array(J.scales.buffer,J.scales.byteOffset,J.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(J.mins.buffer,J.mins.byteOffset,J.mins.byteLength))}}})(),ie=await this.conv2dDirect($,te.deq,H,8,20,20,4,3,3,1,1);this.convTiledQOk=!0;let le=this.recordingSession(),pe=await le.finish(le.conv2d($,te.gpu,H,8,20,20,4,3,3,1,1),1600);if(this.releaseGpu(Object.values(te.gpu)),!r(pe,ie)){Y&&console.warn(`[selfValidate] conv2d_3x3_tiled_${re} KO sur ce GPU : repli sur conv2d_direct_${re} (plus lent, m\xEAme r\xE9sultat).`),this.convTiledQOk=!1;break}}this.convTiledQOk=this.convTiledQOk&&Y}{let $=e(3200),W=e(288),H=e(4),Y=this.convS2Ok,re=Math.floor(19/2)+1,te=Math.floor(19/2)+1;for(let ie of["q8","q4"]){let le=ie==="q8"?(()=>{let Z=Ge(W);return{deq:me(Z),gpu:{codes:this.uploadGpuRaw(new Uint8Array(Z.codes.buffer,Z.codes.byteOffset,Z.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(Z.scales.buffer,Z.scales.byteOffset,Z.scales.byteLength))}}})():(()=>{let Z=_e(W);return{deq:ge(Z),gpu:{nib:this.uploadGpuRaw(Z.nibbles),sc:this.uploadGpuRaw(new Uint8Array(Z.scales.buffer,Z.scales.byteOffset,Z.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(Z.mins.buffer,Z.mins.byteOffset,Z.mins.byteLength))}}})(),pe=await this.conv2dDirect($,le.deq,H,8,20,20,4,3,3,2,1);this.convS2Ok=!0;let J=this.recordingSession(),Se=await J.finish(J.conv2d($,le.gpu,H,8,20,20,4,3,3,2,1),4*re*te);if(this.releaseGpu(Object.values(le.gpu)),!r(Se,pe)){Y&&console.warn(`[selfValidate] conv2d_3x3_s2_tiled_${ie} KO sur ce GPU : repli sur direct.`),this.convS2Ok=!1;break}}this.convS2Ok=this.convS2Ok&&Y}if(this.hasSubgroups&&this.subgroupsOk)try{let j=e(1500),N=e(300),$=r(await this.rmsnormVec(j,N,5,300,1e-5,!1,"rmsnorm_vec_subgroup"),await this.rmsnormVec(j,N,5,300,1e-5,!1)),W=8,H=130,Y=4,re=e(W*H),te=e(W),ie=e(W),le=r(await this.groupNorm(re,te,ie,W,H,Y,1e-5,"group_norm_subgroup"),await this.groupNorm(re,te,ie,W,H,Y));if(!$||!le){let pe=[!$&&"rmsnorm_vec_subgroup",!le&&"group_norm_subgroup"].filter(Boolean).join(" + ");console.warn(`[selfValidate] ${pe} KO sur ce GPU : repli sur la r\xE9duction en m\xE9moire partag\xE9e.`),this.subgroupsOk=!1}}catch(T){console.warn("[selfValidate] subgroups indisponibles \xE0 l'ex\xE9cution : repli sur la m\xE9moire partag\xE9e.",T),this.subgroupsOk=!1}{let R=e(66),j=new Uint16Array(66);for(let H=0;H<66;H++)j[H]=De(R[H]);let N=new Float32Array(66);for(let H=0;H<66;H++)N[H]=Pe(j[H]);let $=this.f16ToF32Gpu(new Uint8Array(j.buffer,j.byteOffset,j.byteLength),66),W=await this.readGpu($,66);if($.destroy?.(),!r(W,N,1e-6))return"f16_to_f32"}let x=e(70);if(!r(await this.relu(x),x.map(T=>Math.max(T,0))))return"relu";let y=2,P=2,U=2,F=2,q=P*F,O=U*F,D=e(y*P*U),K=new Float32Array(y*q*O);for(let T=0;T<y;T++)for(let R=0;R<q;R++)for(let j=0;j<O;j++)K[T*q*O+R*O+j]=D[T*P*U+Math.floor(R/F)*U+Math.floor(j/F)];if(!r(await this.upsampleNearest(D,y,P,U,F),K))return"upsample_nearest";let S=2,L=8,z=1e-5,Q=e(S*L),V=e(L),I=e(L),X=new Float32Array(S*L);for(let T=0;T<S;T++){let R=T*L,j=0;for(let W=0;W<L;W++)j+=Q[R+W];j/=L;let N=0;for(let W=0;W<L;W++){let H=Q[R+W]-j;N+=H*H}N/=L;let $=1/Math.sqrt(N+z);for(let W=0;W<L;W++)X[R+W]=(Q[R+W]-j)*$*V[W]+I[W]}if(!r(await this.layernorm(Q,V,I,S,L,z),X))return"layernorm";let M=e(70);if(!r(await this.quickGelu(M),M.map(T=>T/(1+Math.exp(-1.702*T)))))return"quick_gelu";{let W=1/Math.sqrt(4),H=e(24),Y=e(40),re=e(40),te=new Float32Array(24);for(let ie=0;ie<2;ie++)for(let le=0;le<3;le++){let pe=new Float32Array(5),J=-1/0;for(let Z=0;Z<5;Z++){let Te=0;for(let ve=0;ve<4;ve++)Te+=H[le*8+ie*4+ve]*Y[Z*8+ie*4+ve];pe[Z]=Te*W,pe[Z]>J&&(J=pe[Z])}let Se=0;for(let Z=0;Z<5;Z++)pe[Z]=Math.exp(pe[Z]-J),Se+=pe[Z];for(let Z=0;Z<4;Z++){let Te=0;for(let ve=0;ve<5;ve++)Te+=pe[ve]/Se*re[ve*8+ie*4+Z];te[le*8+ie*4+Z]=Te}}if(!r(await this.attentionFull(H,Y,re,3,2,2,4,5),te))return"attention_full"}if(this.attnFullWgOk){let T=[{nT:70,kvL:70,nH:5,hd:64},{nT:16,kvL:77,nH:5,hd:64},{nT:9,kvL:9,nH:8,hd:160}];for(let R of T){let j=R.nH*R.hd,N=e(R.nT*j),$=e(R.kvL*j),W=e(R.kvL*j),H=await this.attentionFull(N,$,W,R.nT,R.nH,R.nH,R.hd,R.kvL),Y=await this.attentionFullWg(N,$,W,R.nT,R.nH,R.nH,R.hd,R.kvL);if(!r(Y,H)){this.attnFullWgOk=!1,console.warn(`[selfValidate] attention_full_wg KO sur ce GPU (hd=${R.hd}, kv=${R.kvL}) : repli sur attention_full (plus lent, m\xEAme r\xE9sultat).`);break}}}return null}};ee.timingOn=(()=>{try{return se("timing")==="1"}catch{return!1}})(),ee.profileOn=(()=>{try{return se("gpuprofile")==="1"}catch{return!1}})(),ee.MAX_WG_DIM=65535,ee.BLOCK_ELEMS={Q4_K:256,Q5_K:256,Q6_K:256,Q8_0:32,Q5_0:32,Q4_0:32,F32:1,F16:1},ee.DEQUANT_SHADER={Q4_K:"dequant_q4k",Q8_0:"dequant_q8_0",Q5_0:"dequant_q5_0",Q6_K:"dequant_q6k",Q4_0:"dequant_q4_0",Q5_K:"dequant_q5k"},ee.STORAGE_USAGE=140;mt=ee});function Zr(l,e){let r=new DataView(l.buffer,l.byteOffset,l.byteLength),t=new Float32Array(e);for(let n=0;n<e;n++)t[n]=fe(r.getUint16(n*2,!0));return t}function en(l,e){let r=new DataView(l.buffer,l.byteOffset,l.byteLength),t=new Float32Array(e);for(let n=0;n<e;n++)t[n]=r.getFloat32(n*4,!0);return t}function Je(l,e,r,t){let n=0;for(let a=0;a<r;a++)n+=l[a]*l[a];let s=1/Math.sqrt(n/r+t),i=new Float32Array(r);for(let a=0;a<r;a++)i[a]=l[a]*s*e[a];return i}var Us,Ee,bt,tn=ne(()=>{"use strict";$e();Ve();Ie();Ne();Us=l=>l/(1+Math.exp(-l)),Ee=class Ee{constructor(e,r,t){this.engine=e;this.manifest=r;this.raw=t;this.w=new Map;this.g=new Map;this.pos=0;this.rLayers=[];this.tokNormGpu=null;this.normBufs=[];this.ffn=0;this.residentLock=Promise.resolve()}isBigProj(e){return/\.(shortconv\.(in_proj|out_proj)|attn_(q|k|v|output)|ffn_(gate|up|down))\.weight$/.test(e)}async load(e){if(!this.engine.lfm2ShortConvOk)throw new Error("kernel shortconv LFM2 invalid\xE9 sur ce GPU (selfValidate) : archi lfm2 refus\xE9e.");let r=this.manifest.arch;if(this.D=r.d,this.NH=r.nHeads,this.NKV=r.nKvHeads,this.HD=r.headDim,this.NL=r.blockCount,this.vocab=r.vocab,this.EPS=r.rmsEps,this.THETA=r.ropeTheta,!r.lfm2)throw new Error("manifest sans profil lfm2");this.LC=r.lfm2.lCache,this.convLayer=r.lfm2.kvHeadsPerLayer.map(t=>t===0),this.tok=e,this.stops=new Set(this.manifest.chat?.stopTokenIds?.length?this.manifest.chat.stopTokenIds:[7]);for(let[t,n]of Object.entries(this.manifest.tensors)){if(t==="token_embd.weight"){if(this.embedBytes=await this.raw(t),this.embedDtype=n.dtype,n.dtype==="q4"){let i=be(this.embedBytes,n.nElems);this.g.set("head",{kind:"q4",nib:this.engine.uploadGpuRaw(i.nibbles),sc:this.up(i.scales),mn:this.up(i.mins),IN:this.D,OUT:this.vocab})}else if(n.dtype==="q8"){let i=ye(this.embedBytes,n.nElems);this.g.set("head",{kind:"q8",codes:this.upI8(i.codes),sc:this.up(i.scales),IN:this.D,OUT:this.vocab})}else if(n.dtype==="q3")throw new Error("LFM2 : t\xEAte li\xE9e en q3 non support\xE9e (le convertisseur garde un plancher q4)");continue}let s=await this.raw(t);if(this.isBigProj(t)&&(n.dtype==="q3"||n.dtype==="q4"||n.dtype==="q8")){let i=n.shape[0],a=n.nElems/i;if(n.dtype==="q8"){let o=ye(s,n.nElems);this.g.set(t,{kind:"q8",codes:this.upI8(o.codes),sc:this.up(o.scales),IN:i,OUT:a})}else if(n.dtype==="q3"){let o=ke(s,n.nElems);this.g.set(t,{kind:"q3",q3:!0,lo:this.up32(o.lo),hi:this.up32(o.hi),sc:this.up(o.scales),mn:this.up(o.mins),IN:i,OUT:a})}else{let o=be(s,n.nElems);this.g.set(t,{kind:"q4",nib:this.engine.uploadGpuRaw(o.nibbles),sc:this.up(o.scales),mn:this.up(o.mins),IN:i,OUT:a})}}else this.w.set(t,this.decodePetit(t,s,n))}this.buildResidentLayers(),this.reset()}buildResidentLayers(){let e=r=>{let t=this.engine.uploadGpu(this.w.get(r));return this.normBufs.push(t),t};this.tokNormGpu=e("token_embd_norm.weight"),this.ffn=this.g.get("blk.0.ffn_gate.weight")?.OUT??0,this.rLayers=[];for(let r=0;r<this.NL;r++){let t=`blk.${r}.`,n={attnNorm:e(t+"attn_norm.weight"),ffnNorm:e(t+"ffn_norm.weight"),wgate:this.g.get(t+"ffn_gate.weight"),wup:this.g.get(t+"ffn_up.weight"),wdown:this.g.get(t+"ffn_down.weight")};this.convLayer[r]?this.rLayers.push({conv:!0,...n,convW:e(t+"shortconv.conv.weight"),inProj:this.g.get(t+"shortconv.in_proj.weight"),outProj:this.g.get(t+"shortconv.out_proj.weight")}):this.rLayers.push({conv:!1,...n,qNorm:e(t+"attn_q_norm.weight"),kNorm:e(t+"attn_k_norm.weight"),wq:this.g.get(t+"attn_q.weight"),wk:this.g.get(t+"attn_k.weight"),wv:this.g.get(t+"attn_v.weight"),wo:this.g.get(t+"attn_output.weight")})}}residentAvailable(){return this.engine.lfm2ResidentOk!==!1&&!!this.g.get("head")&&this.rLayers.length===this.NL&&this.ffn>0}cfg(){return{D:this.D,nHeads:this.NH,nKvHeads:this.NKV,headDim:this.HD,ffn:this.ffn,eps:this.EPS,theta:this.THETA,lc:this.LC,vocab:this.vocab}}embedsFor(e){let r=this.D,t=new Float32Array(e.length*r);for(let n=0;n<e.length;n++)t.set(this.embedRow(e[n]),n*r);return t}async logitsGpu(e,r,t){return this.pos=r+e.length,this.engine.lfm2LogitsGpu(this.embedsFor(e),e.length,this.cfg(),this.rLayers,this.g.get("head"),this.tokNormGpu,r,t)}async topKGpu(e,r,t,n,s,i=40){return this.pos=r+e.length,this.engine.lfm2TopKGpu(this.embedsFor(e),e.length,this.cfg(),this.rLayers,this.g.get("head"),this.tokNormGpu,r,t,n,s,i)}async prefillGpu(e,r,t){this.pos=r+e.length,await this.engine.lfm2PrefillGpu(this.embedsFor(e),e.length,this.cfg(),this.rLayers,this.tokNormGpu,r,t)}decodePetit(e,r,t){switch(t.dtype){case"f32":return en(r,t.nElems);case"f16":return Zr(r,t.nElems);case"q8":return me(ye(r,t.nElems));case"q4":return ge(be(r,t.nElems));case"q3":return Ce(ke(r,t.nElems));default:throw new Error(`LFM2 : dtype \xAB ${t.dtype} \xBB non support\xE9 pour ${e}`)}}up(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}up32(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}upI8(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}unload(){for(let e of this.g.values())for(let r of["nib","sc","mn","codes"])e[r]?.destroy?.();for(let e of this.normBufs)e?.destroy?.();this.normBufs=[],this.rLayers=[],this.tokNormGpu=null,this.engine.clearLfm2State?.(),this.g.clear(),this.w.clear()}reset(){this.pos=0,this.state=Array.from({length:this.NL},(e,r)=>this.convLayer[r]?{conv:new Float32Array((this.LC-1)*this.D)}:{K:[],V:[]})}async gemm(e,r){let t=this.g.get(e);if(!t){let n=this.w.get(e==="head"?"token_embd.weight":e),s=n.length/r.length,i=new Float32Array(s);for(let a=0;a<s;a++){let o=0,u=a*r.length;for(let c=0;c<r.length;c++)o+=n[u+c]*r[c];i[a]=o}return i}return t.kind==="q8"?this.engine.matmulQ8(r,t.codes,t.sc,1,t.IN,t.OUT):t.kind==="q3"?this.engine.matmulQ3(r,t.lo,t.hi,t.sc,t.mn,1,t.IN,t.OUT):this.engine.matmulQ4(r,t.nib,t.sc,t.mn,1,t.IN,t.OUT)}embedRow(e){let r=this.D;if(this.embedDtype==="f16")return Zr(this.embedBytes.subarray(e*r*2,e*r*2+r*2),r);if(this.embedDtype==="f32")return en(this.embedBytes.subarray(e*r*4,e*r*4+r*4),r);if(this.embedDtype==="q8"){let o=this.vocab*r,u=r/32,c=new Int8Array(this.embedBytes.buffer,this.embedBytes.byteOffset+e*r,r),d=this.embedBytes.subarray(o+e*u*2,o+e*u*2+u*2),f=new DataView(d.buffer,d.byteOffset,d.byteLength),p=new Float32Array(r);for(let g=0;g<u;g++){let h=fe(f.getUint16(g*2,!0));for(let b=0;b<32;b++)p[g*32+b]=c[g*32+b]*h}return p}let t=this.vocab*r,n=r/32,s=t/2,i=t/2+t/32*2,a=new Uint8Array(r/2+n*2*2);return a.set(this.embedBytes.subarray(e*r/2,e*r/2+r/2),0),a.set(this.embedBytes.subarray(s+e*n*2,s+e*n*2+n*2),r/2),a.set(this.embedBytes.subarray(i+e*n*2,i+e*n*2+n*2),r/2+n*2),ge(be(a,r))}rope(e,r,t){let n=this.HD,s=e.slice();for(let i=0;i<r;i++){let a=i*n;for(let o=0;o<n/2;o++){let u=Math.pow(this.THETA,-2*o/n),c=Math.cos(t*u),d=Math.sin(t*u),f=e[a+o],p=e[a+o+n/2];s[a+o]=f*c-p*d,s[a+o+n/2]=f*d+p*c}}return s}async forwardToken(e){let r=this.D,t=this.pos++,n=this.embedRow(e);for(let s=0;s<this.NL;s++){let i=`blk.${s}.`,a=this.state[s],o=Je(n,this.w.get(i+"attn_norm.weight"),r,this.EPS),u;if(this.convLayer[s]){let g=await this.gemm(i+"shortconv.in_proj.weight",o),h=await this.engine.lfm2ShortConv(g,a.conv,this.w.get(i+"shortconv.conv.weight"),r,this.LC);a.conv=h.state,u=await this.gemm(i+"shortconv.out_proj.weight",h.out)}else{let g=await this.gemm(i+"attn_q.weight",o),h=await this.gemm(i+"attn_k.weight",o),b=await this.gemm(i+"attn_v.weight",o),w=this.w.get(i+"attn_q_norm.weight"),_=this.w.get(i+"attn_k_norm.weight");for(let A=0;A<this.NH;A++)g.set(Je(g.slice(A*this.HD,(A+1)*this.HD),w,this.HD,this.EPS),A*this.HD);for(let A=0;A<this.NKV;A++)h.set(Je(h.slice(A*this.HD,(A+1)*this.HD),_,this.HD,this.EPS),A*this.HD);g=this.rope(g,this.NH,t),h=this.rope(h,this.NKV,t),a.K.push(h),a.V.push(b);let G=new Float32Array(this.NH*this.HD),B=a.K.length,C=1/Math.sqrt(this.HD),E=this.NH/this.NKV;for(let A=0;A<this.NH;A++){let k=Math.floor(A/E),v=A*this.HD,m=k*this.HD,x=new Float32Array(B),y=-1e30;for(let U=0;U<B;U++){let F=0;for(let q=0;q<this.HD;q++)F+=g[v+q]*a.K[U][m+q];x[U]=F*C,x[U]>y&&(y=x[U])}let P=0;for(let U=0;U<B;U++)x[U]=Math.exp(x[U]-y),P+=x[U];for(let U=0;U<B;U++){let F=x[U]/P;for(let q=0;q<this.HD;q++)G[v+q]+=F*a.V[U][m+q]}}u=await this.gemm(i+"attn_output.weight",G)}for(let g=0;g<r;g++)n[g]+=u[g];let c=Je(n,this.w.get(i+"ffn_norm.weight"),r,this.EPS),d=await this.gemm(i+"ffn_gate.weight",c),f=await this.gemm(i+"ffn_up.weight",c);for(let g=0;g<d.length;g++)d[g]=Us(d[g])*f[g];let p=await this.gemm(i+"ffn_down.weight",d);for(let g=0;g<r;g++)n[g]+=p[g]}return n=Je(n,this.w.get("token_embd_norm.weight"),r,this.EPS),this.gemm("head",n)}async classify(e,r){let t=this.tok.encode(e),n;if(this.residentAvailable())n=await this.locked(()=>this.feedThen(t,0,"cls",(i,a)=>this.logitsGpu(i,a,"cls")));else{this.reset();for(let i of t)n=await this.forwardToken(i)}let s=r.map(i=>{let a=this.tok.encode(i);return{label:i,logit:n[a[1]??a[0]]}}).sort((i,a)=>a.logit-i.logit);return{label:s[0].label,scores:s}}banTools(e){for(let r of Ee.TOOL_BAN)r<e.length&&(e[r]=-1e30);return e}sampleTok(e,r,t){let{temperature:n=.8,topK:s=40,repeatPenalty:i=1.3}=t,a=new Set(r),o=[];for(let f=0;f<e.length;f++){let p=e[f];a.has(f)&&(p=p>0?p/i:p*i),o.push({i:f,v:p})}o.sort((f,p)=>p.v-f.v),o.length=s;let u=o[0].v,c=0;for(let f of o)f.p=Math.exp((f.v-u)/n),c+=f.p;let d=Math.random()*c;for(let f of o)if(d-=f.p,d<=0)return f.i;return o[0].i}async generate(e,r,t,n,s){this.reset();let i=this.tok.encode(e),a;for(let u of i)a=await this.forwardToken(u);let o=[];for(let u=0;u<r&&!n?.();u++){this.banTools(a);let c;if(s?.sample)c=this.sampleTok(a,o.slice(-64),s);else{c=0;for(let d=1;d<a.length;d++)a[d]>a[c]&&(c=d)}if(this.stops.has(c))break;o.push(c),t&&t(this.tok.decode(o)),a=await this.forwardToken(c)}return o.length?this.tok.decode(o):""}locked(e){let r=this.residentLock.then(e,e);return this.residentLock=r.catch(()=>{}),r}async feedThen(e,r,t,n,s){let i=0;for(;;){if(s?.())return null;let a=Math.min(i+Ee.PREFILL_CHUNK,e.length),o=e.slice(i,a);if(a<e.length)await this.prefillGpu(o,r+i,t);else return n(o,r+i);i=a}}pickFromTopK(e,r){let t=[],n=[];for(let f=0;f<e.ids.length;f++)if(!Ee.TOOL_BAN.includes(e.ids[f])){if(e.vals[f]<=-3e38)break;t.push(e.ids[f]),n.push(e.vals[f])}if(!t.length)return e.ids[0];if(!r?.sample)return t[0];let{temperature:s=.8,topK:i=40}=r,a=Math.min(i,t.length),o=n[0],u=0,c=new Array(a);for(let f=0;f<a;f++)c[f]=Math.exp((n[f]-o)/s),u+=c[f];let d=Math.random()*u;for(let f=0;f<a;f++)if(d-=c[f],d<=0)return t[f];return t[0]}async generateResident(e,r,t,n,s){return this.residentAvailable()?this.locked(async()=>{let a=s?.repeatPenalty??(s?.sample?1.3:1),o=this.tok.encode(e),u=await this.feedThen(o,0,"gen",(f,p)=>this.topKGpu(f,p,"gen",[],1,48),n);if(!u)return"";let c=o.length,d=[];for(let f=0;f<r&&!n?.();f++){let p=this.pickFromTopK(u,s);if(this.stops.has(p))break;d.push(p),t&&t(this.tok.decode(d)),u=await this.topKGpu([p],c,"gen",a!==1?[...new Set(d.slice(-64))]:[],a,48),c++}return d.length?this.tok.decode(d):""}):this.generate(e,r,t,n,s)}};Ee.TOOL_BAN=[8,10,12],Ee.PREFILL_CHUNK=128;bt=Ee});function Gs(l){let e=[];for(let r=0;r<l.length;r++){let t=l[r];if(t==="\\"&&r+1<l.length){let s=l[r+1];if(s==="x"){e.push(parseInt(l.substr(r+2,2),16)&255),r+=3;continue}if(s==="t"){e.push(9),r++;continue}if(s==="n"){e.push(10),r++;continue}if(s==="r"){e.push(13),r++;continue}if(s==="0"){e.push(0),r++;continue}if(s==="\\"){e.push(92),r++;continue}if(s==="'"){e.push(39),r++;continue}if(s==='"'){e.push(34),r++;continue}e.push(92);continue}let n=t.codePointAt(0);if(n<128)e.push(n);else for(let s of new TextEncoder().encode(t))e.push(s)}return new Uint8Array(e)}var vt,rn=ne(()=>{"use strict";vt=class{constructor(e,r=0){this.root={next:new Map};this.idToBytes=[];this.vocabSize=e.length,this.eosId=r;for(let t=0;t<e.length;t++){let n=Gs(e[t]);if(this.idToBytes[t]=n,t===0||n.length===0)continue;let s=this.root;for(let i of n){let a=s.next.get(i);a||(a={next:new Map},s.next.set(i,a)),s=a}s.id=t}}encode(e){let r=new TextEncoder().encode(e),t=[],n=0;for(;n<r.length;){let s=this.root,i=-1,a=0,o=0;for(let u=n;u<r.length;u++){let c=s.next.get(r[u]);if(!c)break;s=c,o++,c.id!==void 0&&(i=c.id,a=o)}i<0&&(i=r[n]+1,a=1),t.push(i),n+=a}return t}decode(e){let r=[];for(let t of e){if(t===this.eosId)continue;let n=this.idToBytes[t];if(n)for(let s of n)r.push(s)}return new TextDecoder("utf-8",{fatal:!1}).decode(new Uint8Array(r))}}});function Nt(l,e){let r=new DataView(l.buffer,l.byteOffset,l.byteLength),t=new Float32Array(e);for(let n=0;n<e;n++)t[n]=fe(r.getUint16(n*2,!0));return t}function Wt(l,e){let r=new DataView(l.buffer,l.byteOffset,l.byteLength),t=new Float32Array(e);for(let n=0;n<e;n++)t[n]=r.getFloat32(n*4,!0);return t}function qe(l,e,r,t){let n=new Float32Array(t);for(let s=0;s<t;s++){let i=0,a=s*r;for(let o=0;o<r;o++)i+=l[a+o]*e[o];n[s]=i}return n}function yt(l,e,r,t,n=1e-5){let s=0;for(let u=0;u<t;u++)s+=l[u];s/=t;let i=0;for(let u=0;u<t;u++){let c=l[u]-s;i+=c*c}i/=t;let a=1/Math.sqrt(i+n),o=new Float32Array(t);for(let u=0;u<t;u++)o[u]=(l[u]-s)*a*e[u]+r[u];return o}var wt,Ke,Ze,nn=ne(()=>{"use strict";Ve();$e();Ie();Ne();rn();wt=l=>1/(1+Math.exp(-l));Ke=class Ke{constructor(e,r,t){this.engine=e;this.manifest=r;this.raw=t;this.w=new Map;this.g=new Map;this.rLayers=[];this.rNorms=null;this.normBufs=[];this.residentLock=Promise.resolve()}isBigProj(e){return/\.(time_mix_(receptance|key|value|output)|channel_mix_(key|value))\.weight$/.test(e)}async load(e){let r=this.manifest.arch;this.D=r.d,this.H=r.rwkv.headSize,this.NH=this.D/this.H,this.NL=r.blockCount,this.vocab=r.vocab,this.tok=new vt(e,0);for(let[t,n]of Object.entries(this.manifest.tensors)){if(t==="token_embd.weight"){this.embedBytes=await this.raw(t),this.embedDtype=n.dtype;continue}let s=await this.raw(t);if(t==="output.weight"){if(n.dtype==="q4"){let i=be(s,n.nElems);this.g.set(t,{kind:"q4",nib:this.engine.uploadGpuRaw(i.nibbles),sc:this.up(i.scales),mn:this.up(i.mins),IN:this.D,OUT:this.vocab})}else if(n.dtype==="q3"){let i=ke(s,n.nElems);this.g.set(t,{kind:"q3",q3:!0,lo:this.up32(i.lo),hi:this.up32(i.hi),sc:this.up(i.scales),mn:this.up(i.mins),IN:this.D,OUT:this.vocab})}else if(n.dtype==="q8"){let i=ye(s,n.nElems);this.g.set(t,{kind:"q8",codes:this.upI8(i.codes),sc:this.up(i.scales),IN:this.D,OUT:this.vocab})}else this.w.set(t,n.dtype==="f32"?Wt(s,n.nElems):Nt(s,n.nElems));continue}if(this.isBigProj(t)&&(n.dtype==="q3"||n.dtype==="q4"||n.dtype==="q8")){let i=n.shape[0],a=n.nElems/i;if(n.dtype==="q3"){let o=ke(s,n.nElems);this.g.set(t,{kind:"q3",q3:!0,lo:this.up32(o.lo),hi:this.up32(o.hi),sc:this.up(o.scales),mn:this.up(o.mins),IN:i,OUT:a})}else if(n.dtype==="q8"){let o=ye(s,n.nElems);this.g.set(t,{kind:"q8",codes:this.upI8(o.codes),sc:this.up(o.scales),IN:i,OUT:a})}else{let o=be(s,n.nElems);this.g.set(t,{kind:"q4",nib:this.engine.uploadGpuRaw(o.nibbles),sc:this.up(o.scales),mn:this.up(o.mins),IN:i,OUT:a})}}else this.w.set(t,n.dtype==="f32"?Wt(s,n.nElems):n.dtype==="f16"?Nt(s,n.nElems):n.dtype==="q3"?Ce(ke(s,n.nElems)):n.dtype==="q8"?me(ye(s,n.nElems)):ge(be(s,n.nElems)))}this.buildResidentLayers(),this.reset()}buildResidentLayers(){try{let e=t=>{let n=this.w.get(t);if(!n)throw new Error(`r\xE9sident : tenseur manquant ${t}`);let s=this.engine.uploadGpu(n);return this.normBufs.push(s),s};this.rNorms={tokW:e("token_embd_norm.weight"),tokB:e("token_embd_norm.bias"),outW:e("output_norm.weight"),outB:e("output_norm.bias")};let r=[];for(let t=0;t<this.NL;t++){let n=`blk.${t}.`,s=(h,b)=>{let w=this.w.get(n+h);if(!w)throw new Error(`r\xE9sident : ${n}${h} manquant`);return w.length/b},i=this.w.get(n+"time_mix_ln.weight"),a=this.w.get(n+"time_mix_ln.bias");if(!i||!a)throw new Error(`r\xE9sident : ${n}time_mix_ln manquant`);let o=new Float32Array(2*this.D);o.set(i,0),o.set(a,this.D);let u=this.engine.uploadGpu(o);this.normBufs.push(u);let c=h=>{let b=this.g.get(n+h);if(!b)throw new Error(`r\xE9sident : ${n}${h} non quantifi\xE9e GPU`);return b},d=s("time_mix_w1.weight",this.D),f=s("time_mix_a1.weight",this.D),p=s("time_mix_g1.weight",this.D),g={attnNormW:e(n+"attn_norm.weight"),attnNormB:e(n+"attn_norm.bias"),attnNorm2W:e(n+"attn_norm_2.weight"),attnNorm2B:e(n+"attn_norm_2.bias"),lerpFused:e(n+"time_mix_lerp_fused.weight"),lerpK:e(n+"channel_mix_lerp_k.weight"),w0:e(n+"time_mix_w0.weight"),w1:e(n+"time_mix_w1.weight"),w2:e(n+"time_mix_w2.weight"),rw:d,a0:e(n+"time_mix_a0.weight"),a1:e(n+"time_mix_a1.weight"),a2:e(n+"time_mix_a2.weight"),ra:f,g1:e(n+"time_mix_g1.weight"),g2:e(n+"time_mix_g2.weight"),rg:p,kk:e(n+"time_mix_k_k.weight"),ka:e(n+"time_mix_k_a.weight"),rk:e(n+"time_mix_r_k.weight"),lnWB:u,R:c("time_mix_receptance.weight"),K:c("time_mix_key.weight"),V:c("time_mix_value.weight"),O:c("time_mix_output.weight"),cmK:c("channel_mix_key.weight"),cmV:c("channel_mix_value.weight"),ffn:this.g.get(n+"channel_mix_key.weight").OUT};t>0&&(g.rv=s("time_mix_v1.weight",this.D),g.v0=e(n+"time_mix_v0.weight"),g.v1=e(n+"time_mix_v1.weight"),g.v2=e(n+"time_mix_v2.weight")),r.push(g)}this.rLayers=r}catch(e){console.warn("[rwkv] chemin r\xE9sident indisponible (montage) : repli forwardToken JS+readback.",e),this.rLayers=[],this.rNorms=null}}residentAvailable(){let e=this.engine;return e.rwkvResidentOk!==!1&&e.rwkvWkv7Ok!==!1&&!!this.g.get("output.weight")&&this.rLayers.length===this.NL&&!!this.rNorms}cfg(){return{D:this.D,H:this.H,NH:this.NH,vocab:this.vocab}}embedsFor(e){let r=this.D,t=new Float32Array(e.length*r);for(let n=0;n<e.length;n++)t.set(this.embedRow(e[n]),n*r);return t}async prefillGpu(e,r,t){for(let n=0;n<e.length;n+=Ke.PREFILL_CHUNK){let s=e.slice(n,n+Ke.PREFILL_CHUNK);await this.engine.rwkvPrefillGpu(this.embedsFor(s),s.length,this.cfg(),this.rLayers,this.rNorms,r+n,t)}}locked(e){let r=this.residentLock.then(e,e);return this.residentLock=r.catch(()=>{}),r}async feedThen(e,r,t,n){let s=e.length>Ke.PREFILL_CHUNK?e.slice(0,e.length-Ke.PREFILL_CHUNK):[];return s.length&&await this.prefillGpu(s,r,t),n(e.slice(s.length),r+s.length)}async logitsGpu(e,r,t){return this.feedThen(e,r,t,(n,s)=>this.engine.rwkvLogitsGpu(this.embedsFor(n),n.length,this.cfg(),this.rLayers,this.g.get("output.weight"),this.rNorms,s,t))}async topKGpu(e,r,t,n,s,i=40){return this.feedThen(e,r,t,(a,o)=>this.engine.rwkvTopKGpu(this.embedsFor(a),a.length,this.cfg(),this.rLayers,this.g.get("output.weight"),this.rNorms,o,t,n,s,i))}up(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}up32(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}upI8(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}reset(){this.state=Array.from({length:this.NL},()=>({S:Array.from({length:this.NH},()=>new Float32Array(this.H*this.H)),tm:new Float32Array(this.D),cm:new Float32Array(this.D)}))}unload(){for(let e of this.g.values())for(let r of["nib","sc","mn","codes","lo","hi"])e[r]?.destroy?.();for(let e of this.normBufs)e?.destroy?.();this.normBufs=[],this.rLayers=[],this.rNorms=null,this.engine.clearRwkvState?.(),this.g.clear(),this.w.clear()}async gemm(e,r){let t=this.g.get(e);if(!t){let n=this.w.get(e);return qe(n,r,r.length,n.length/r.length)}return t.kind==="q3"?this.engine.matmulQ3(r,t.lo,t.hi,t.sc,t.mn,1,t.IN,t.OUT):t.kind==="q8"?this.engine.matmulQ8(r,t.codes,t.sc,1,t.IN,t.OUT):this.engine.matmulQ4(r,t.nib,t.sc,t.mn,1,t.IN,t.OUT)}embedRow(e){let r=this.D;if(this.embedDtype==="f16")return Nt(this.embedBytes.subarray(e*r*2,e*r*2+r*2),r);if(this.embedDtype==="f32")return Wt(this.embedBytes.subarray(e*r*4,e*r*4+r*4),r);if(this.embedDtype==="q8"){let u=this.vocab*r,c=r/32,d=new Int8Array(this.embedBytes.buffer,this.embedBytes.byteOffset+e*r,r),f=this.embedBytes.subarray(u+e*c*2,u+e*c*2+c*2),p=new DataView(f.buffer,f.byteOffset,f.byteLength),g=new Float32Array(r);for(let h=0;h<c;h++){let b=fe(p.getUint16(h*2,!0));for(let w=0;w<32;w++)g[h*32+w]=d[h*32+w]*b}return g}let t=this.vocab*r,n=r/32,s=0,i=t/2,a=t/2+t/32*2,o=new Uint8Array(r/2+n*2*2);return o.set(this.embedBytes.subarray(s+e*r/2,s+e*r/2+r/2),0),o.set(this.embedBytes.subarray(i+e*n*2,i+e*n*2+n*2),r/2),o.set(this.embedBytes.subarray(a+e*n*2,a+e*n*2+n*2),r/2+n*2),ge(be(o,r))}async timeMix(e,r,t,n){let s=this.D,i=this.H,a=this.NH,o=`blk.${e}.`,u=M=>this.w.get(o+M),c=new Float32Array(s);for(let M=0;M<s;M++)c[M]=t.tm[M]-r[M];t.tm=r.slice();let d=u("time_mix_lerp_fused.weight"),f=M=>{let T=new Float32Array(s);for(let R=0;R<s;R++)T[R]=r[R]+c[R]*d[M*s+R];return T},[p,g,h,b,w,_]=[f(0),f(1),f(2),f(3),f(4),f(5)],G=await this.gemm(o+"time_mix_receptance.weight",p),B=await this.gemm(o+"time_mix_key.weight",h),C=await this.gemm(o+"time_mix_value.weight",b),E=qe(u("time_mix_w1.weight"),g,s,u("time_mix_w1.weight").length/s);for(let M=0;M<E.length;M++)E[M]=Math.tanh(E[M]);let A=qe(u("time_mix_w2.weight"),E,E.length,s),k=u("time_mix_w0.weight"),v=new Float32Array(s);for(let M=0;M<s;M++)v[M]=Math.exp(-.606531*wt(k[M]+A[M]));let m=u("time_mix_a1.weight"),x=qe(u("time_mix_a2.weight"),qe(m,w,s,m.length/s),m.length/s,s),y=u("time_mix_a0.weight"),P=new Float32Array(s);for(let M=0;M<s;M++)P[M]=wt(y[M]+x[M]);let U=u("time_mix_g1.weight"),F=qe(U,_,s,U.length/s);for(let M=0;M<F.length;M++)F[M]=wt(F[M]);let q=qe(u("time_mix_g2.weight"),F,F.length,s);if(e===0)n.vFirst=C.slice();else{let M=u("time_mix_v1.weight"),T=qe(u("time_mix_v2.weight"),qe(M,b,s,M.length/s),M.length/s,s),R=u("time_mix_v0.weight");for(let j=0;j<s;j++)C[j]=C[j]+(n.vFirst[j]-C[j])*wt(R[j]+T[j])}let O=u("time_mix_k_k.weight"),D=u("time_mix_k_a.weight"),K=new Float32Array(s);for(let M=0;M<s;M++)K[M]=B[M]*O[M];for(let M=0;M<a;M++){let T=0;for(let R=0;R<i;R++){let j=K[M*i+R];T+=j*j}T=Math.sqrt(T)||1e-12;for(let R=0;R<i;R++)K[M*i+R]/=T}let S=new Float32Array(s);for(let M=0;M<s;M++)S[M]=B[M]*(1+(P[M]-1)*D[M]);let L=new Float32Array(s);for(let M=0;M<a;M++){let T=M*i,R=t.S[M];for(let j=0;j<i;j++){let N=0;for(let H=0;H<i;H++)N+=-K[T+H]*R[j*i+H];let $=0,W=C[T+j];for(let H=0;H<i;H++){let Y=v[T+H]*R[j*i+H]+W*S[T+H]+K[T+H]*P[T+H]*N;R[j*i+H]=Y,$+=G[T+H]*Y}L[T+j]=$}}let z=u("time_mix_ln.weight"),Q=u("time_mix_ln.bias"),V=u("time_mix_r_k.weight"),I=new Float32Array(s);for(let M=0;M<a;M++){let T=M*i,R=0;for(let $=0;$<i;$++)R+=L[T+$];R/=i;let j=0;for(let $=0;$<i;$++){let W=L[T+$]-R;j+=W*W}j/=i;let N=1/Math.sqrt(j+64e-5);for(let $=0;$<i;$++)I[T+$]=(L[T+$]-R)*N*z[T+$]+Q[T+$]}for(let M=0;M<a;M++){let T=M*i,R=0;for(let j=0;j<i;j++)R+=G[T+j]*S[T+j]*V[T+j];for(let j=0;j<i;j++)I[T+j]+=R*C[T+j]}let X=new Float32Array(s);for(let M=0;M<s;M++)X[M]=I[M]*q[M];return this.gemm(o+"time_mix_output.weight",X)}async channelMix(e,r,t){let n=this.D,s=`blk.${e}.`,i=this.w.get(s+"channel_mix_lerp_k.weight"),a=new Float32Array(n);for(let c=0;c<n;c++)a[c]=t.cm[c]-r[c];t.cm=r.slice();let o=new Float32Array(n);for(let c=0;c<n;c++)o[c]=r[c]+a[c]*i[c];let u=await this.gemm(s+"channel_mix_key.weight",o);for(let c=0;c<u.length;c++)u[c]=u[c]>0?u[c]*u[c]:0;return this.gemm(s+"channel_mix_value.weight",u)}async forwardToken(e){let r=this.D,t={vFirst:null},n=this.embedRow(e);n=yt(n,this.w.get("token_embd_norm.weight"),this.w.get("token_embd_norm.bias"),r);for(let s=0;s<this.NL;s++){let i=this.state[s],a=`blk.${s}.`,o=await this.timeMix(s,yt(n,this.w.get(a+"attn_norm.weight"),this.w.get(a+"attn_norm.bias"),r),i,t);for(let c=0;c<r;c++)n[c]+=o[c];let u=await this.channelMix(s,yt(n,this.w.get(a+"attn_norm_2.weight"),this.w.get(a+"attn_norm_2.bias"),r),i);for(let c=0;c<r;c++)n[c]+=u[c]}return n=yt(n,this.w.get("output_norm.weight"),this.w.get("output_norm.bias"),r),this.gemm("output.weight",n)}async classify(e,r){let t=this.tok.encode(e),n;if(this.residentAvailable())n=await this.locked(()=>this.logitsGpu(t,0,"cls"));else{this.reset();for(let i of t)n=await this.forwardToken(i)}let s=r.map(i=>({label:i,logit:n[this.tok.encode(" "+i)[0]]})).sort((i,a)=>a.logit-i.logit);return{label:s[0].label,scores:s}}sampleTok(e,r,t){let{temperature:n=.8,topK:s=40,repeatPenalty:i=1.3}=t,a=new Set(r),o=[];for(let f=0;f<e.length;f++){let p=e[f];a.has(f)&&(p=p>0?p/i:p*i),o.push({i:f,v:p})}o.sort((f,p)=>p.v-f.v),o.length=s;let u=o[0].v,c=0;for(let f of o)f.p=Math.exp((f.v-u)/n),c+=f.p;let d=Math.random()*c;for(let f of o)if(d-=f.p,d<=0)return f.i;return o[0].i}async generate(e,r,t,n,s){this.reset();let i=this.tok.encode(e),a;for(let u of i)a=await this.forwardToken(u);let o=[];for(let u=0;u<r&&!n?.();u++){let c;if(s?.sample)c=this.sampleTok(a,o.slice(-64),s);else{c=0;for(let d=1;d<a.length;d++)a[d]>a[c]&&(c=d)}if(c===0)break;o.push(c),t&&t(this.tok.decode(o)),a=await this.forwardToken(c)}return this.tok.decode(o)}pickFromTopK(e,r){if(!r?.sample)return e.ids[0];let{temperature:t=.8,topK:n=40}=r,s=Math.min(n,e.ids.length);for(;s>1&&e.vals[s-1]<=-3e38;)s--;let i=e.vals[0],a=0,o=new Array(s);for(let c=0;c<s;c++)o[c]=Math.exp((e.vals[c]-i)/t),a+=o[c];let u=Math.random()*a;for(let c=0;c<s;c++)if(u-=o[c],u<=0)return e.ids[c];return e.ids[0]}async generateResident(e,r,t,n,s){return this.residentAvailable()?this.locked(async()=>{let a=s?.repeatPenalty??(s?.sample?1.3:1),o=this.tok.encode(e),u=await this.topKGpu(o,0,"gen",[],1,48),c=o.length,d=[];for(let f=0;f<r&&!n?.();f++){let p=this.pickFromTopK(u,s);if(p===0)break;d.push(p),t&&t(this.tok.decode(d)),u=await this.topKGpu([p],c,"gen",a!==1?[...new Set(d.slice(-64))]:[],a,48),c++}return this.tok.decode(d)}):this.generate(e,r,t,n,s)}};Ke.PREFILL_CHUNK=32;Ze=Ke});function We(l){if(!l.length)return null;let e=1/0,r=0,t=0;for(let n of l)e=Math.min(e,n.offset),r=Math.max(r,n.offset+n.bytes),t+=n.bytes;return r-e>64<<20||r-e>t*1.5?null:{start:e,end:r}}function Qt(l,e){let r=new Map;for(let s of Object.keys(l)){let i=s.match(/^blk\.(\d+)\./);if(!i)continue;let a=r.get(i[1]);a||r.set(i[1],a=[]),a.push(s)}let t=new Map,n=new Map;return async s=>{let i=l[s];if(!i)throw new Error(`tenseur absent : ${s}`);let a=s.match(/^blk\.(\d+)\./),o=a?r.get(a[1]):void 0,u=o?We(o.map(b=>l[b])):null;if(!a||!o||!u)return e.bytes(i.offset,i.bytes);let c=a[1],d=t.get(c);d||(d=e.bytes(u.start,u.end-u.start).then(b=>({start:u.start,bytes:b})),t.set(c,d),n.set(c,o.length));let{start:f,bytes:p}=await d,g=p.subarray(i.offset-f,i.offset-f+i.bytes),h=(n.get(c)??1)-1;return h<=0?(t.delete(c),n.delete(c),new Uint8Array(g)):(n.set(c,h),g)}}var et=ne(()=>{"use strict"});function $t(l){return l==="llama"||l==="mistral3"||l==="smollm3"}var sn=ne(()=>{"use strict"});function Bs(l){return l instanceof Blob?{bytes:async(e,r)=>new Uint8Array(await l.slice(e,e+r).arrayBuffer())}:l}var oe,tt,an=ne(()=>{"use strict";et();sn();$e();Ie();Ve();Et();et();oe=class oe{constructor(e,r,t){this.rawCache=new Map;this.layerSpan=new Map;this.weightPrecision="f32";this.precOverrides=null;this.layerCache=new Map;this.layerGpuCache=new Map;this.finalNormGpu=null;this.projQ8=null;this.projVocab=0;this.visionSegments=[];this.engine=e,this.source=Bs(r),this.manifest=t,this.weightPrecision=this.nativePrecision}get nativePrecision(){let e=this.manifest.tensors["blk.0.attn_q.weight"];return e?.type==="Q4W"?"q4":e?.type==="Q8W"?"q8":e?.type==="Q3W"?"q3":this.supportsQ8?"q8":this.engine?.hasF16?"f16":"f32"}get isMixedNative(){let e=this.manifest.tensors["blk.0.attn_q.weight"]?.type,r=this.manifest.tensors["blk.0.ffn_gate.weight"]?.type;return(e==="Q4W"||e==="Q8W")&&(r==="Q4W"||r==="Q8W")&&e!==r}get loaded(){return this.manifest!==null}async loadManifest(){return this.manifest}async rawTensor(e){let r=this.rawCache.get(e);if(r)return r;let t=this.manifest.tensors[e];if(!t)throw new Error("tensor absent du manifeste: "+e);let n=await this.source.bytes(t.offset,t.bytes);return this.cacheRaw(e,n)}cacheRaw(e,r){let t=this.maybeUnpermuteLlamaQk(e,r);return this.rawCache.set(e,t),t}maybeUnpermuteLlamaQk(e,r){if(!oe.unpermOn||oe.ropeNormOn&&$t(this.manifest.arch)||!["llama","mistral3","smollm3"].includes(this.manifest.arch))return r;let t=e.endsWith(".attn_q.weight"),n=e.endsWith(".attn_k.weight");if(!t&&!n)return r;let{nHeads:s,nKvHeads:i,headDim:a}=this.manifest.config,o=this.manifest.tensors[e];if(o.type==="Q8W"||o.type==="Q4W"||o.type==="Q3W")throw new Error("BRIK d\u2019un mod\xE8le llama non support\xE9 (lignes Q/K permut\xE9es) : charger le GGUF directement.");let u=t?s:i,c=u*a,d=o.bytes/c;if(!Number.isInteger(d))throw new Error(`${e} : lignes non uniformes (${o.bytes} o / ${c} lignes). D\xE9-permutation impossible.`);let f=a/2,p=new Uint8Array(r.byteLength);for(let g=0;g<u;g++){let h=g*a;for(let b=0;b<f;b++)p.set(r.subarray((h+2*b)*d,(h+2*b+1)*d),(h+b)*d),p.set(r.subarray((h+2*b+1)*d,(h+2*b+2)*d),(h+f+b)*d)}return p}ensureLayerSpan(e){let r=this.layerSpan.get(e);return r||(r=this.fetchLayerSpan(e).catch(()=>{this.layerSpan.delete(e)}),this.layerSpan.set(e,r)),r}async fetchLayerSpan(e){let r=`blk.${e}.`,t=Object.entries(this.manifest.tensors).filter(([i])=>i.startsWith(r)),n=We(t.map(([,i])=>i));if(!n)return;let s=await this.source.bytes(n.start,n.end-n.start);for(let[i,a]of t)this.rawCache.has(i)||this.cacheRaw(i,s.subarray(a.offset-n.start,a.offset-n.start+a.bytes))}async debugTensorF32(e,r=!1){if(!r)return this.dequant(e);let t=oe.unpermOn,n=this.rawCache.has(e),s=this.rawCache.get(e);try{return oe.unpermOn=!1,this.rawCache.delete(e),await this.dequant(e)}finally{oe.unpermOn=t,this.rawCache.delete(e),n&&s&&this.rawCache.set(e,s)}}async dequant(e){let r=this.manifest.tensors[e],t=await this.rawTensor(e);return this.engine.dequantizeByType(r.type,t,r.nElems)}async dequantGpu(e){let r=this.manifest.tensors[e],t=await this.rawTensor(e);return this.engine.dequantizeToGpu(r.type,t,r.nElems)}async dequantGpuF16(e){let r=this.manifest.tensors[e],t=await this.rawTensor(e);if(r.type==="F16")return this.engine.uploadGpuRawF16(t);let n=this.engine.dequantizeToGpu(r.type,t,r.nElems),s=this.engine.f32ToF16Gpu(n,r.nElems);return n.destroy?.(),s}async dequantGpuQ4(e){let r=this.manifest.tensors[e],t=await this.rawTensor(e);if(r.type!=="Q4W"){let s=this.engine.dequantizeToGpu(r.type,t,r.nElems),i=this.engine.f32ToQ4Gpu(s,r.nElems);return s.destroy?.(),i}let n=be(t,r.nElems);return{nib:this.engine.uploadGpuRaw(n.nibbles),sc:this.engine.uploadGpuRaw(new Uint8Array(n.scales.buffer,n.scales.byteOffset,n.scales.byteLength)),mn:this.engine.uploadGpuRaw(new Uint8Array(n.mins.buffer,n.mins.byteOffset,n.mins.byteLength))}}async dequantGpuQ3(e){let r=this.manifest.tensors[e],t=await this.rawTensor(e);if(r.type!=="Q3W")return this.engine.dequantizeToGpu(r.type,t,r.nElems);let n=ke(t,r.nElems);return{q3:!0,lo:this.engine.uploadGpuRaw(new Uint8Array(n.lo.buffer,n.lo.byteOffset,n.lo.byteLength)),hi:this.engine.uploadGpuRaw(new Uint8Array(n.hi.buffer,n.hi.byteOffset,n.hi.byteLength)),sc:this.engine.uploadGpuRaw(new Uint8Array(n.scales.buffer,n.scales.byteOffset,n.scales.byteLength)),mn:this.engine.uploadGpuRaw(new Uint8Array(n.mins.buffer,n.mins.byteOffset,n.mins.byteLength))}}async dequantGpuQ8(e){let r=this.manifest.tensors[e],t=await this.rawTensor(e);if(r.type!=="Q8W"){let s=this.engine.dequantizeToGpu(r.type,t,r.nElems),i=this.engine.f32ToQ8Gpu(s,r.nElems);return s.destroy?.(),i}let n=ye(t,r.nElems);return{codes:this.engine.uploadGpuRaw(new Uint8Array(n.codes.buffer,n.codes.byteOffset,n.codes.byteLength)),sc:this.engine.uploadGpuRaw(new Uint8Array(n.scales.buffer,n.scales.byteOffset,n.scales.byteLength))}}static destroyWeight(e){e&&(e.q3?(e.lo?.destroy?.(),e.hi?.destroy?.(),e.sc?.destroy?.(),e.mn?.destroy?.()):e.nib?(e.nib?.destroy?.(),e.sc?.destroy?.(),e.mn?.destroy?.()):e.codes?(e.codes?.destroy?.(),e.sc?.destroy?.()):e.destroy?.())}get precision(){return this.weightPrecision}get supportsQ4(){let{d:e,ffn:r}=this.manifest.config;return e%32===0&&r%32===0}get supportsQ8(){return this.supportsQ4}get supportsQ3(){return this.supportsQ4}matPrecision(e){let r=this.weightPrecision;if((r==="q4"||r==="q8")&&this.precOverrides){for(let[t,n]of this.precOverrides)if(e.includes(t))return n}if(r===this.nativePrecision){let t=this.manifest.tensors[e]?.type;if(t==="Q4W")return"q4";if(t==="Q8W")return"q8";if(t==="Q3W")return"q3"}return r}setWeightPrecision(e){if(e!==this.weightPrecision){if((e==="q4"||e==="q8")&&!this.supportsQ4)throw new Error(`${e} indisponible : d ou ffn non multiple de 32`);for(let r of this.layerGpuCache.values())for(let t of Object.values(r))oe.destroyWeight(t);this.layerGpuCache.clear(),this.weightPrecision=e}}async layerWeights(e){let r=this.layerCache.get(e);if(r)return r;let t=`blk.${e}`,[n,s,i,a,o,u,c,d,f,p,g,h]=await Promise.all([this.dequant(`${t}.attn_norm.weight`),this.dequantGpu(`${t}.attn_q.weight`),this.dequantGpu(`${t}.attn_k.weight`),this.dequantGpu(`${t}.attn_v.weight`),this.dequantGpu(`${t}.attn_output.weight`),this.dequant(`${t}.ffn_norm.weight`),this.dequantGpu(`${t}.ffn_gate.weight`),this.dequantGpu(`${t}.ffn_up.weight`),this.dequantGpu(`${t}.ffn_down.weight`),this.dequant(`${t}.attn_q.bias`).catch(()=>{}),this.dequant(`${t}.attn_k.bias`).catch(()=>{}),this.dequant(`${t}.attn_v.bias`).catch(()=>{})]),[b,w,_,G]=await Promise.all([this.dequant(`${t}.post_attention_norm.weight`).catch(()=>{}),this.dequant(`${t}.post_ffw_norm.weight`).catch(()=>{}),this.dequant(`${t}.attn_q_norm.weight`).catch(()=>{}),this.dequant(`${t}.attn_k_norm.weight`).catch(()=>{})]),B={attnNorm:n,wq:s,wk:i,wv:a,wo:o,ffnNorm:u,wgate:c,wup:d,wdown:f,bq:p,bk:g,bv:h,postAttnNorm:b,postFfnNorm:w,qNorm:_,kNorm:G};return this.layerCache.set(e,B),B}async warmup(e){let{blockCount:r,d:t}=this.manifest.config,n=r+1;for(let s=0;s<r;s++)await this.layerWeightsGpu(s),e?.(s+1,n);await this.getFinalNormGpu(),await this.getRopeFactors(),await this.getProjectionQ8(t);try{await this.topKKV([0],0,"brimkern-warmup",[],1),this.reset()}catch(s){console.warn("[warmup] passe \xE0 blanc impossible. Le premier message paiera le transfert :",s)}e?.(n,n)}async layerWeightsGpu(e){let r=this.layerGpuCache.get(e);if(r)return r;await this.ensureLayerSpan(e);let t=`blk.${e}`,n=m=>this.engine.uploadGpu(m),i=this.weightPrecision==="f16",a=m=>{let x=this.matPrecision(m);return x==="q3"?this.dequantGpuQ3(m):x==="q4"?this.dequantGpuQ4(m):x==="q8"?this.dequantGpuQ8(m):x==="f16"?this.dequantGpuF16(m):this.dequantGpu(m)},[o,u,c,d,f,p,g,h,b,w,_,G]=await Promise.all([this.dequant(`${t}.attn_norm.weight`).then(n),a(`${t}.attn_q.weight`),a(`${t}.attn_k.weight`),a(`${t}.attn_v.weight`),a(`${t}.attn_output.weight`),this.dequant(`${t}.ffn_norm.weight`).then(n),a(`${t}.ffn_gate.weight`),a(`${t}.ffn_up.weight`),a(`${t}.ffn_down.weight`),this.dequant(`${t}.attn_q.bias`).then(n).catch(()=>{}),this.dequant(`${t}.attn_k.bias`).then(n).catch(()=>{}),this.dequant(`${t}.attn_v.bias`).then(n).catch(()=>{})]),[B,C,E,A]=await Promise.all([this.dequant(`${t}.post_attention_norm.weight`).then(n).catch(()=>{}),this.dequant(`${t}.post_ffw_norm.weight`).then(n).catch(()=>{}),this.dequant(`${t}.attn_q_norm.weight`).then(n).catch(()=>{}),this.dequant(`${t}.attn_k_norm.weight`).then(n).catch(()=>{})]),k={attnNorm:o,wq:u,wk:c,wv:d,wo:f,ffnNorm:p,wgate:g,wup:h,wdown:b,bq:w,bk:_,bv:G,postAttnNorm:B,postFfnNorm:C,qNorm:E,kNorm:A,matF16:i};this.layerGpuCache.set(e,k);let v=`blk.${e}.`;for(let m of this.rawCache.keys())m.startsWith(v)&&this.rawCache.delete(m);return this.layerSpan.delete(e),k}async getFinalNormGpu(){return this.finalNormGpu||(this.finalNormGpu=this.engine.uploadGpu(await this.dequant("output_norm.weight"))),this.finalNormGpu}async prewarmGpu(e){let{blockCount:r,d:t}=this.manifest.config,n=new Array(r).fill(0);for(let[o,u]of Object.entries(this.manifest.tensors)){let c=o.match(/^blk\.(\d+)\./);c&&(n[Number(c[1])]+=u.bytes)}let s=n.reduce((o,u)=>o+u,0),i=0,a=4;for(let o=0;o<r;o+=a){let u=Math.min(a,r-o);await Promise.all(Array.from({length:u},(c,d)=>this.layerWeightsGpu(o+d)));for(let c=0;c<u;c++)i+=n[o+c];e?.(i,s)}await this.getFinalNormGpu(),await this.getProjectionQ8(t)}static q8RowsBlob(e,r,t,n,s){let i=s/32,a=t*s,o=n*s,u=r+t*i*2,c=n*i*2,d=new Uint8Array(o+c);return d.set(e.subarray(a,a+o),0),d.set(e.subarray(u,u+c),o),d}static q4RowsBlob(e,r,t,n,s){let i=s/32,a=0,o=r/2,u=r/2+r/32*2,c=n*s/2,d=n*i*2,f=new Uint8Array(c+d*2);return f.set(e.subarray(a+t*s/2,a+t*s/2+c),0),f.set(e.subarray(o+t*i*2,o+t*i*2+d),c),f.set(e.subarray(u+t*i*2,u+t*i*2+d),c+d),f}async embed(e,r){let t=this.manifest.tensors["token_embd.weight"],n=t.nElems/r,s=t.type==="Q8W",i=t.type==="Q4W",a=t.bytes/n;if(!s&&!i&&!Number.isInteger(a))throw new Error("token_embd: lignes non uniformes");let o=await this.rawTensor("token_embd.weight"),u=this.manifest.config.embedScale??1,c=new Float32Array(e.length*r);for(let d=0;d<e.length;d++){let f=e[d],p=s?oe.q8RowsBlob(o,t.nElems,f,1,r):i?oe.q4RowsBlob(o,t.nElems,f,1,r):o.subarray(f*a,(f+1)*a),g=await this.engine.dequantizeByType(t.type,p,r);if(u!==1)for(let h=0;h<r;h++)g[h]*=u;c.set(g,d*r)}return c}async getProjectionQ8(e){if(this.projQ8)return this.projQ8;let r=this.manifest.tensors["output.weight"]?"output.weight":"token_embd.weight",t=this.manifest.tensors[r];if(!t)throw new Error("Logits projection tensor not found (output.weight / token_embd.weight)");let n=t.nElems/e;this.projVocab=n;let s=await this.rawTensor(r),i=Math.max(1,Math.floor(this.engine.maxStorageBufferBindingSize*.9/e)),a=[];if(t.type==="Q4W"){for(let u=0;u<n;u+=i){let c=Math.min(i,n-u),d=oe.q4RowsBlob(s,t.nElems,u,c,e),f=c*e/2,p=c*(e/32)*2;a.push({w:{nib:this.engine.uploadGpuRaw(d.subarray(0,f)),sc:this.engine.uploadGpuRaw(d.subarray(f,f+p)),mn:this.engine.uploadGpuRaw(d.subarray(f+p))},rows:c,r0:u})}return this.projQ8=a,a}let o=t.type==="Q8W"?s:await this.engine.quantizeToBytes(t.type,s,t.nElems,"q8");for(let u=0;u<n;u+=i){let c=Math.min(i,n-u),d=oe.q8RowsBlob(o,t.nElems,u,c,e),f=c*e;a.push({w:{codes:this.engine.uploadGpuRaw(d.subarray(0,f)),sc:this.engine.uploadGpuRaw(d.subarray(f))},rows:c,r0:u})}return this.projQ8=a,a}async argmaxLogits(e,r){let t=await this.getProjectionQ8(r),n=0,s=-1/0;for(let i of t){let a=i.w.nib?await this.engine.matmulQ4(e,i.w.nib,i.w.sc,i.w.mn,1,r,i.rows):await this.engine.matmulQ8(e,i.w.codes,i.w.sc,1,r,i.rows);for(let o=0;o<a.length;o++)a[o]>s&&(s=a[o],n=i.r0+o)}return n}archFlags(){let e=this.manifest.config;return{attnScale:e.attnScale,attnLogitSoftcap:e.attnLogitSoftcap,act:e.act,rmsGainOnePlus:e.rmsGainOnePlus,windowPerLayer:e.windowPerLayer,ropeThetaPerLayer:e.ropeThetaPerLayer,skipRopePerLayer:e.skipRopePerLayer,ropeInterleaved:oe.ropeNormOn?e.ropeInterleaved??($t(this.manifest.arch)||void 0):void 0}}mropePositions(e,r){let t=e+r,n=new Uint32Array(r*3),s=[...this.visionSegments].sort((c,d)=>c.at-d.at),i=(c,d,f,p)=>{c>=e&&c<t&&(n[(c-e)*3]=d,n[(c-e)*3+1]=f,n[(c-e)*3+2]=p)},a=0,o=0,u=0;for(;a<t;){let c=u<s.length?s[u]:null;if(c&&a===c.at){let d=o,f=c.gh*c.gw;for(let p=0;p<f;p++)i(a+p,d,d+Math.floor(p/c.gw),d+p%c.gw);o=d+Math.max(c.gh,c.gw),a+=f,u++}else i(a,o,o,o),o++,a++}return n}async getRopeFactors(){if(this.ropeFactorsCache!==void 0)return this.ropeFactorsCache;if(!oe.ropeFactorsOn)return console.warn("[model] facteurs RoPE COUP\xC9S par ?ropefactors=0 : RoPE standard"),this.ropeFactorsCache=null,null;if(this.manifest.tensors["rope_freqs.weight"])this.ropeFactorsCache=await this.dequant("rope_freqs.weight"),console.log("[model] rope_freqs.weight pr\xE9sent : RoPE \xE0 facteurs (scaling llama3) actif");else if(this.manifest.config.yarn){let{factor:e,betaFast:r,betaSlow:t,origCtx:n}=this.manifest.config.yarn,{headDim:s,ropeTheta:i}=this.manifest.config,a=s/2,o=f=>s*Math.log(n/(f*2*Math.PI))/(2*Math.log(i)),u=o(r),c=o(t),d=new Float32Array(a);for(let f=0;f<a;f++){let p=1-Math.min(1,Math.max(0,(f-u)/Math.max(.001,c-u)));d[f]=1/(1/e*(1-p)+p)}this.ropeFactorsCache=d,console.log(`[model] YaRN statique actif (factor ${e}, dims corr ${u.toFixed(1)}\u2013${c.toFixed(1)})`)}else this.ropeFactorsCache=null;return this.ropeFactorsCache}applyMrope(e,r,t){let n=this.manifest.config.mropeSections;if(n){if(!this.engine.mropeOk)throw new Error("M-RoPE indisponible sur ce GPU (selfValidate) : vision d\xE9sactiv\xE9e.");e.mropeSections=n,e.positions=this.mropePositions(r,t)}}static applyInjections(e,r,t,n,s){if(s)for(let i of s){let a=i.rows.length/r;for(let o=0;o<a;o++){let u=i.at+o-t;u>=0&&u<n&&e.set(i.rows.subarray(o*r,(o+1)*r),u*r)}}}get kvQuant(){return this.engine.kvQuant===!0}setKvQuant(e){this.engine.setKvQuant(e)}reset(){this.engine.clearKvCache(),this.visionSegments=[]}unload(){this.reset();for(let e of this.layerGpuCache.values())for(let r of Object.values(e))oe.destroyWeight(r);this.layerGpuCache.clear(),this.finalNormGpu?.destroy?.(),this.finalNormGpu=null;for(let e of this.projQ8??[])oe.destroyWeight(e.w);this.projQ8=null,this.layerCache.clear(),this.rawCache.clear(),this.layerSpan.clear()}async hiddenKV(e,r,t,n){let s=this.manifest,{d:i,nHeads:a,nKvHeads:o,headDim:u,ffn:c,blockCount:d,ropeTheta:f,rmsEps:p}=s.config,g={seq:e.length,d:i,nHeads:a,nKvHeads:o,headDim:u,ffn:c,ropeTheta:f,eps:p,...this.archFlags()};this.applyMrope(g,r,e.length),g.ropeFactors=await this.getRopeFactors()??void 0;let h=await this.embed(e,i);oe.applyInjections(h,i,r,e.length,n);let b=await Promise.all(Array.from({length:d},(_,G)=>this.layerWeightsGpu(G))),w=await this.getFinalNormGpu();return this.engine.runDecodeGpu(h,g,b,r,w,t)}async generateNextKV(e,r,t,n){let s=await this.hiddenKV(e,r,t,n);return this.argmaxLogits(s,this.manifest.config.d)}async logitsKV(e,r,t,n){let s=this.manifest,{d:i,nHeads:a,nKvHeads:o,headDim:u,ffn:c,blockCount:d,ropeTheta:f,rmsEps:p}=s.config,g={seq:e.length,d:i,nHeads:a,nKvHeads:o,headDim:u,ffn:c,ropeTheta:f,eps:p,...this.archFlags()};this.applyMrope(g,r,e.length),g.ropeFactors=await this.getRopeFactors()??void 0;let h=oe.timingOn?(A,k)=>console.info(`[timing] ${A} ${(performance.now()-k).toFixed(0)} ms`):null,b=performance.now(),w=await this.embed(e,i);h?.("embed",b),b=performance.now(),oe.applyInjections(w,i,r,e.length,n);let _=await Promise.all(Array.from({length:d},(A,k)=>this.layerWeightsGpu(k)));h?.("poids des couches",b),b=performance.now();let G=await this.getFinalNormGpu(),B=await this.getProjectionQ8(i);h?.("norme finale + t\xEAte de projection",b),b=performance.now();let C=await this.engine.decodeLogitsQ8(w,g,_,r,G,t,B,this.projVocab);h?.("forward + logits",b);let E=s.config.finalLogitSoftcap;if(E&&E>0)for(let A=0;A<C.length;A++)C[A]=E*Math.tanh(C[A]/E);return C}async topKKV(e,r,t,n,s,i){let a=this.manifest,{d:o,nHeads:u,nKvHeads:c,headDim:d,ffn:f,blockCount:p,ropeTheta:g,rmsEps:h}=a.config,b={seq:e.length,d:o,nHeads:u,nKvHeads:c,headDim:d,ffn:f,ropeTheta:g,eps:h,...this.archFlags()};this.applyMrope(b,r,e.length),b.ropeFactors=await this.getRopeFactors()??void 0;let w=oe.timingOn?(k,v)=>console.info(`[timing] ${k} ${(performance.now()-v).toFixed(0)} ms`):null,_=performance.now(),G=await this.embed(e,o);w?.("embed",_),_=performance.now(),oe.applyInjections(G,o,r,e.length,i);let B=await Promise.all(Array.from({length:p},(k,v)=>this.layerWeightsGpu(v)));w?.("poids des couches",_),_=performance.now();let C=await this.getFinalNormGpu(),E=await this.getProjectionQ8(o);w?.("norme finale + tete de projection",_),_=performance.now();let A=await this.engine.decodeTopKQ8(G,b,B,r,C,t,E,this.projVocab,n,s,a.config.finalLogitSoftcap??0);return w?.("forward + top-k",_),A}async debugHiddenPerLayer(e){let r=this.manifest,{d:t,nHeads:n,nKvHeads:s,headDim:i,ffn:a,blockCount:o,ropeTheta:u,rmsEps:c}=r.config,f={seq:e.length,d:t,nHeads:n,nKvHeads:s,headDim:i,ffn:a,ropeTheta:u,eps:c,...this.archFlags()};f.ropeFactors=await this.getRopeFactors()??void 0;let p=await this.embed(e,t),g=[];for(let h=0;h<o;h++)p=await this.engine.layerForward(p,f,await this.layerWeights(h),!0),g.push(Float32Array.from(p));return g}};oe.timingOn=(()=>{try{return se("timing")==="1"}catch{return!1}})(),oe.ropeNormOn=(()=>{try{return se("ropenorm")!=="0"}catch{return!0}})(),oe.unpermOn=(()=>{try{return se("unperm")!=="0"}catch{return!0}})(),oe.ropeFactorsOn=(()=>{try{return se("ropefactors")!=="0"}catch{return!0}})();tt=oe});async function kt(l){let e=Math.min(l.size,104857600),t=await l.slice(0,e).arrayBuffer(),n=new It(t),s=[String.fromCharCode(n.uint8()),String.fromCharCode(n.uint8()),String.fromCharCode(n.uint8()),String.fromCharCode(n.uint8())].join("");if(s!=="GGUF")throw new Error(`Fichier GGUF invalide. Sceau magique absent : ${s}`);let i=n.uint32();if(i!==2&&i!==3)throw new Error(`Version GGUF non support\xE9e : ${i}`);let a=n.uint64(),o=n.uint64(),u=y=>{switch(y){case 0:return n.uint8();case 1:return n.int8();case 2:return n.uint16();case 3:return n.int16();case 4:return n.uint32();case 5:return n.int32();case 6:return n.float32();case 7:return n.uint8()!==0;case 8:return n.string();case 9:{let P=n.uint32(),U=n.uint64(),F=[];for(let q=0;q<U;q++)F.push(u(P));return F}case 10:return n.uint64();case 11:return n.int64();case 12:return n.float64();default:throw new Error(`Type de m\xE9tadonn\xE9es non support\xE9 : ${y}`)}},c={};for(let y=0;y<o;y++){let P=n.string(),U=n.uint32(),F=u(U);c[P]=F}let d=c["general.alignment"]??32,f=c["general.architecture"]??"llama",p=[];for(let y=0;y<a;y++){let P=n.string(),U=n.uint32(),F=[];for(let D=0;D<U;D++)F.push(n.uint64());let q=n.uint32(),O=n.uint64();p.push({name:P,shape:F,typeIdx:q,relativeOffset:O})}let g=n.getOffset(),h=Math.ceil(g/d)*d,b={};for(let y=0;y<p.length;y++){let P=p[y],U=qs[P.typeIdx]||"UNKNOWN",F=P.shape.reduce((O,D)=>O*D,1),q=0;if(y<p.length-1)q=p[y+1].relativeOffset-P.relativeOffset;else{let{block:O,size:D}=Fs(U);q=F/O*D}b[P.name]={offset:h+P.relativeOffset,bytes:q,nElems:F,type:U,shape:P.shape}}let w=(y,P)=>{let U=c[`${f}.${y}`];return U!==void 0?Number(U):P},_=(y,P)=>{let U=c[`${f}.${y}`];return U!==void 0?Number(U):P},G=w("embedding_length",0),B=w("attention.head_count",0),C=w("attention.head_count_kv",B),E=w("block_count",0),A=_("rope.freq_base",1e4),k=_("attention.layer_norm_rms_epsilon",1e-5),v=w("attention.key_length",0)||(B>0?G/B:0),m=w("feed_forward_length",0),x={d:G,nHeads:B,nKvHeads:C,headDim:v,ffn:m,blockCount:E,ropeTheta:A,rmsEps:k};if(f==="rwkv7"||f==="rwkv6"){let y=w("wkv.head_size",64);x.headDim=y,x.nHeads=y>0?Math.floor(G/y):0,x.nKvHeads=x.nHeads,x.rwkv={headSize:y,decayLoraRank:w("attention.decay_lora_rank",64),iclrLoraRank:w("attention.iclr_lora_rank",64),valueLoraRank:w("attention.value_residual_mix_lora_rank",32),gateLoraRank:w("attention.gate_lora_rank",128)}}if(f==="lfm2"){let y=c["lfm2.attention.head_count_kv"],P=Array.isArray(y)?y.map(Number):[];x.nKvHeads=P.length?Math.max(...P):B,x.headDim=v||64,x.lfm2={lCache:w("shortconv.l_cache",3),kvHeadsPerLayer:P.length?P:Array(E).fill(x.nKvHeads)}}if((f==="gemma"||f==="gemma2")&&(x.act="gelu",x.embedScale=Math.sqrt(G)),f==="gemma2"){x.attnLogitSoftcap=_("attn_logit_softcapping",50),x.finalLogitSoftcap=_("final_logit_softcapping",30);let y=w("attention.query_pre_attn_scalar",0);x.attnScale=y>0?1/Math.sqrt(y):v>0?1/Math.sqrt(v):void 0}{let y=c[`${f}.rope.scaling.type`],P=_("rope.scaling.factor",1);if(y==="yarn"&&P>1&&v>0){x.yarn={factor:P,betaFast:_("rope.scaling.yarn_beta_fast",32),betaSlow:_("rope.scaling.yarn_beta_slow",1),origCtx:w("rope.scaling.original_context_length",0)};let U=1+.1*Math.log(P);x.attnScale=U*U/Math.sqrt(v)}}if(f==="gemma3"){x.act="gelu",x.embedScale=Math.sqrt(G);let y=w("attention.sliding_window",512),P=w("attention.sliding_window_pattern",6)||6,U=_("rope.local_freq_base",1e4),F=q=>(q+1)%P===0;x.windowPerLayer=Array.from({length:E},(q,O)=>F(O)?0:y),x.ropeThetaPerLayer=Array.from({length:E},(q,O)=>F(O)?A:U)}if(f==="smollm3"){let y=c[`${f}.no_rope_layers`],P=Array.isArray(y)?y.map(Number):[];x.skipRopePerLayer=P.length===E?P.map(U=>U===0):Array.from({length:E},(U,F)=>(F+1)%4===0)}if((f==="llama"||f==="mistral3"||f==="smollm3")&&(x.ropeInterleaved=!0),f==="qwen2vl"){let y=c["qwen2vl.rope.dimension_sections"],P=Array.isArray(y)?y.map(Number).filter(U=>U>0):[];x.mropeSections=P.length===3?P:[16,24,24]}return{arch:f,config:x,tensors:b,metadata:c}}var It,qs,Fs,Vt=ne(()=>{"use strict";It=class{constructor(e){this.offset=0;this.view=new DataView(e)}getOffset(){return this.offset}setOffset(e){this.offset=e}uint8(){let e=this.view.getUint8(this.offset);return this.offset+=1,e}int8(){let e=this.view.getInt8(this.offset);return this.offset+=1,e}uint16(){let e=this.view.getUint16(this.offset,!0);return this.offset+=2,e}int16(){let e=this.view.getInt16(this.offset,!0);return this.offset+=2,e}uint32(){let e=this.view.getUint32(this.offset,!0);return this.offset+=4,e}int32(){let e=this.view.getInt32(this.offset,!0);return this.offset+=4,e}float32(){let e=this.view.getFloat32(this.offset,!0);return this.offset+=4,e}float64(){let e=this.view.getFloat64(this.offset,!0);return this.offset+=8,e}uint64(){let e=this.view.getUint32(this.offset,!0),r=this.view.getUint32(this.offset+4,!0);return this.offset+=8,e+r*4294967296}int64(){let e=this.view.getUint32(this.offset,!0),r=this.view.getInt32(this.offset+4,!0);return this.offset+=8,e+r*4294967296}string(){let e=this.uint64();if(this.offset+e>this.view.byteLength)throw new Error(`BinaryReader: string length ${e} exceeds buffer size`);let r=new Uint8Array(this.view.buffer,this.offset,e);return this.offset+=e,new TextDecoder().decode(r)}},qs=["F32","F16","Q4_0","Q4_1","Q4_2","Q4_3","Q5_0","Q5_1","Q8_0","Q8_1","Q2_K","Q3_K","Q4_K","Q5_K","Q6_K","Q8_K","IQ2_XXS","IQ2_XS","IQ3_XXS","IQ1_S","IQ4_NL","IQ3_S","IQ2_S","IQ4_XS","I8","I16","I32","I64","F64","IQ1_M","BF16","Q4_0_4_4","Q4_0_4_8","Q4_0_8_8","TQ1_0","TQ2_0"],Fs=l=>{switch(l){case"F32":return{block:1,size:4};case"F16":return{block:1,size:2};case"Q4_0":return{block:32,size:18};case"Q4_1":return{block:32,size:20};case"Q5_0":return{block:32,size:22};case"Q5_1":return{block:32,size:24};case"Q8_0":return{block:32,size:34};case"Q2_K":return{block:256,size:66};case"Q3_K":return{block:256,size:110};case"Q4_K":return{block:256,size:144};case"Q5_K":return{block:256,size:176};case"Q6_K":return{block:256,size:210};case"Q8_K":return{block:256,size:288};default:throw new Error(`Type GGML non support\xE9 : ${l}. Types lus : F32, F16, Q4_0/1, Q5_0/1, Q8_0, Q2_K\u2026Q8_K.`)}}});function un(l,e=16){return Math.ceil(l/e)*e}function Cs(l){if(l.length>128||l.includes(".."))return!1;let e=l.split("/");return e.length<=2&&e.every(r=>Os.test(r))}function cn(l){let e=i=>{throw new Error(`BRIK: manifeste invalide \u2014 ${i}`)};(!l||typeof l!="object")&&e("ce n'est pas un objet"),l.format!=="brik"&&e(`champ format \xAB ${String(l.format)} \xBB (attendu \xAB brik \xBB)`),(!Re(l.version,1024)||l.version<1)&&e(`version ${String(l.version)}`),(!l.model||typeof l.model.name!="string"||l.model.name.length>512)&&e("champ model.name");let r=l.arch;(!r||typeof r!="object"||typeof r.arch!="string"||r.arch.length>64)&&e("champ arch.arch");for(let[i,a]of[["d",262144],["nHeads",4096],["nKvHeads",4096],["headDim",4096],["ffn",1048576],["blockCount",1024],["vocab",1e7]])Re(r[i],a)||e(`arch.${i} = ${String(r[i])}`);for(let i of["ropeTheta","rmsEps"])(typeof r[i]!="number"||!Number.isFinite(r[i]))&&e(`arch.${i} = ${String(r[i])}`);l.tokenizer&&(l.tokenizer.kind!=="hf-hub"&&l.tokenizer.kind!=="embedded"&&e(`tokenizer.kind \xAB ${String(l.tokenizer.kind)} \xBB`),l.tokenizer.id&&!Cs(l.tokenizer.id)&&e(`tokenizer.id \xAB ${l.tokenizer.id} \xBB (attendu : \xAB auteur/d\xE9p\xF4t \xBB ou une sentinelle sans barre oblique)`)),(!Array.isArray(l.shards)||l.shards.length===0||l.shards.length>on)&&e(`${Array.isArray(l.shards)?l.shards.length:"aucun"} shard`);let t=new Map;for(let i of l.shards)Re(i.id,on)||e(`shard.id = ${String(i.id)}`),t.has(i.id)&&e(`shard ${i.id} d\xE9clar\xE9 deux fois`),(typeof i.file!="string"||i.file.length>256)&&e(`shard.file du shard ${i.id}`),Re(i.byteLength,At)||e(`shard.byteLength du shard ${i.id} = ${String(i.byteLength)}`),t.set(i.id,i.byteLength);(!l.tensors||typeof l.tensors!="object")&&e("champ tensors");let n=Object.keys(l.tensors);(n.length===0||n.length>Ss)&&e(`${n.length} tenseurs`);let s=0;for(let i of n){let a=l.tensors[i];(!a||typeof a!="object")&&e(`tenseur ${i}`),Ts.includes(a.dtype)||e(`dtype \xAB ${String(a.dtype)} \xBB du tenseur ${i}`),(!Array.isArray(a.shape)||a.shape.length>8||!a.shape.every(u=>Re(u,2**32)))&&e(`shape du tenseur ${i}`),Re(a.nElems,2**40)||e(`nElems du tenseur ${i}`),(!Re(a.offset,At)||!Re(a.byteLength,At))&&e(`offset/byteLength du tenseur ${i}`);let o=t.get(a.shard);o===void 0&&e(`le tenseur ${i} r\xE9f\xE9rence le shard ${String(a.shard)}, absent du manifeste`),a.offset+a.byteLength>o&&e(`le tenseur ${i} d\xE9passe son shard (${a.offset}+${a.byteLength} > ${o})`),s+=a.byteLength}return s>At&&e(`${s} octets de tenseurs au total`),l}var on,Ss,At,Ts,Os,Re,ln=ne(()=>{"use strict";on=4096,Ss=2e5,At=64*1024*1024*1024,Ts=["f16","f32","q4","q8","q3"],Os=/^[A-Za-z0-9._-]+$/;Re=(l,e)=>typeof l=="number"&&Number.isInteger(l)&&l>=0&&l<=e});function Rs(l){return un(rt+l)}function Yt(l){if(l.length<rt)throw new Error("BRIK: fichier tronqu\xE9 (en-t\xEAte)");let e=String.fromCharCode(l[0],l[1],l[2],l[3]);if(e!==Ms)throw new Error(`BRIK: sceau magique absent (${e})`);let r=new DataView(l.buffer,l.byteOffset,l.byteLength),t=r.getUint32(4,!0),n=r.getUint32(8,!0);if(rt+n>l.length)throw new Error("BRIK: manifeste tronqu\xE9");return{manifest:cn(JSON.parse(new TextDecoder().decode(l.subarray(rt,rt+n)))),version:t,dataStart:Rs(n)}}function dn(l){let{manifest:e,version:r,dataStart:t}=Yt(l);return{manifest:e,version:r,dataStart:t,data:l.subarray(t)}}var Ms,rt,fn=ne(()=>{"use strict";ln();Ms="BRIK",rt=12});function pn(l){let e=[...l].sort((n,s)=>n.id-s.id),r=[],t=0;for(let n of e)r[n.id]=t,t+=n.byteLength;return r}function gn(l){let e=pn(l.shards),r={};for(let[n,s]of Object.entries(l.tensors)){let i=Ls[s.dtype];if(!i)throw new Error(`dtype BRIK inconnu pour ${n} : ${s.dtype}`);if(e[s.shard]===void 0)throw new Error(`shard ${s.shard} absent du manifeste (tenseur ${n})`);r[n]={offset:e[s.shard]+s.offset,bytes:s.byteLength,nElems:s.nElems,type:i,shape:s.shape}}let t=l.arch;return{arch:t.arch,config:{d:t.d,nHeads:t.nHeads,nKvHeads:t.nKvHeads,headDim:t.headDim,ffn:t.ffn,blockCount:t.blockCount,ropeTheta:t.ropeTheta,rmsEps:t.rmsEps,attnLogitSoftcap:t.attnLogitSoftcap,finalLogitSoftcap:t.finalLogitSoftcap,attnScale:t.attnScale,act:t.act,rmsGainOnePlus:t.rmsGainOnePlus,embedScale:t.embedScale,rwkv:t.rwkv,lfm2:t.lfm2},tensors:r}}var Ls,hn=ne(()=>{"use strict";Ls={f16:"F16",f32:"F32",q4:"Q4W",q8:"Q8W",q3:"Q3W"}});function Es(l){return Ds[l]}async function Ks(l){let e=l.slice();return js(await crypto.subtle.digest("SHA-256",e.buffer))}async function Xt(l,e){let r=Es(l);if(!r)return;if(typeof crypto>"u"||!crypto.subtle){console.warn("[int\xE9grit\xE9] crypto.subtle indisponible (contexte non s\xE9curis\xE9) : empreinte du manifeste NON v\xE9rifi\xE9e.");return}let t=await Ks(e);if(t!==r)throw console.error(`[int\xE9grit\xE9] manifeste inattendu pour ${l}
  attendu : ${r}
  obtenu  : ${t}`),new Error("Ce mod\xE8le ne correspond pas \xE0 celui que Brimkern publie : son manifeste a une empreinte diff\xE9rente de celle attendue. Chargement refus\xE9. Si tu viens de t\xE9l\xE9verser une nouvelle version, relance `npm run brik:digest`.")}var Ds,js,mn=ne(()=>{"use strict";Ds={"https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik":"aca6214b45c294c1d4c51c46aa23acc22cc53cb95a6894c62d2bd0570ca12afe","https://huggingface.co/romainkh14/Qwen2.5-0.5B-Instruct_BRIK/resolve/main/qwen2.5-0.5b-instruct-mixed.brik":"315d2a1cc17b64b029eb24e9668e5c959fd151ae926c9758bddc6a8193e52f6d","https://huggingface.co/romainkh14/Qwen3-4B_BRIK/resolve/main/qwen3-4b-q4.brik":"23f9c0cc66ec21056e656bdaa5cbfda2e93673718ea3ab0dfad19c6e7f583f7d","https://huggingface.co/romainkh14/RWKV-7-G1-0.1B_BRIK/resolve/main/rwkv7-g1-0.1b-q4.brik":"bb8d211e1f95af415b7dca8b0b074c236ebe9d0844f1f372c11eecbcf15fb372","https://huggingface.co/romainkh14/RWKV-7-G1a-0.4B_BRIK/resolve/main/rwkv7-g1a-0.4b-q4.brik":"47e67144bb9dcd41918f3117aa6ee21420ff94f93289c338d8331620d3153b10","https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main/sd-turbo-clip-mixed.brik":"b873aaad23ca70d4e29c0350d124fd6ee0a18470aaf59719f14c9eb9f227b3ac","https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main/sd-turbo-clip-q8.brik":"b3e05c74f8f0327e878787100224983a454e4228d2ae008902875a6256fb2bae","https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main/sd-turbo-unet-q8.brik":"ca3a5c21512542656a8a736c88f67d37a482cacbf499a080c9bf32ca36bf6b0f","https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main/sdxs-unet-light.brik":"42f7c0e82971a558d56548edec947b1ed7d9c0e509d634b51fc29429177e7654","https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main/video-clip-q8.brik":"e81ca57426716237dce2853703c70172a829f78704b7df77c9ee980534c82a76","https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main/video-motion-q8.brik":"e976e13a5bc0858b8277eefed59cc0d77239b5a30ecae68d483e24eb983ae481","https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main/video-unet-q8.brik":"d112b2884afcd038cdbd90bb62ce6b248b404852fb9ce20003b8585927a362b9"},js=l=>[...new Uint8Array(l)].map(e=>e.toString(16).padStart(2,"0")).join("")});function Jt(l,e,r){return`${l}${l.includes("?")?"&":"?"}__brik=${e}-${r}`}async function yn(){try{return await caches.open(zs)}catch{return null}}async function Le(l,e,r,t){let n=e+r-1,s=await yn(),i=Jt(l,e,n);if(s){let o=await s.match(i);if(o)return{bytes:new Uint8Array(await o.arrayBuffer()),ranged:!0}}let a;for(let o=0;o<4;o++)try{let u=await fetch(l,{headers:{Range:`bytes=${e}-${n}`},signal:t});if(!u.ok&&u.status!==206)throw new Error(`range fetch ${e}-${n} \xE9chou\xE9 : HTTP ${u.status}`);let c=u.status===206,d=new Uint8Array(await u.arrayBuffer()),f=c?d:d.subarray(e,e+r);if(s&&c)try{await s.put(i,new Response(f,{headers:{"Content-Length":String(f.byteLength)}}))}catch(p){kn(p)}return{bytes:f,ranged:c}}catch(u){if(t?.aborted)throw u;a=u,o<3&&await new Promise(c=>setTimeout(c,500*2**o))}throw a instanceof Error?a:new Error(String(a))}function kn(l){bn||(bn=!0,console.warn("[cache] \xE9criture refus\xE9e (quota plein ? navigation priv\xE9e ?) : les t\xE9l\xE9chargements de mod\xE8les ne seront PAS r\xE9utilisables \xE0 la prochaine visite. Lib\xE9rez de l'espace via le panneau Stockage.",l))}async function er(l){try{let n=await(await caches.open(Zt)).match(l);if(n)return new Uint8Array(await n.arrayBuffer())}catch{}let e=await fetch(l);if(!e.ok)throw new Error(`HTTP ${e.status}`);let r=new Uint8Array(await e.arrayBuffer());try{await(await caches.open(Zt)).put(l,new Response(r.slice(),{headers:{"Content-Length":String(r.byteLength)}}))}catch(t){kn(t)}return r}function tr(l,e){return{bytes:async(r,t)=>(await Le(l,e+r,t)).bytes}}function Hs(l){return{bytes:async(e,r)=>l.subarray(e,e+r)}}async function An(l){let e=await Le(l,0,12);if(!e.ranged){let i=await er(l),{manifest:a,data:o}=dn(i);return await Xt(l,vn(i)),wn(a,Hs(o))}let r=new DataView(e.bytes.buffer,e.bytes.byteOffset,12).getUint32(8,!0),t=await Le(l,0,12+r),{manifest:n,dataStart:s}=Yt(t.bytes);return await Xt(l,vn(t.bytes)),wn(n,tr(l,s))}function vn(l){let e=new DataView(l.buffer,l.byteOffset,12).getUint32(8,!0);return l.subarray(12,12+e)}function wn(l,e){if(l.model?.uiArch==="image")throw new Error("Ce fichier est un BRIK image (UNet/CLIP) : il se charge via la tuile de g\xE9n\xE9ration d'image, pas comme un LLM.");return{source:e,manifest:gn(l),tokenizerId:l.tokenizer?.id,tokenizer:l.tokenizer,uiArch:l.model?.uiArch,modelName:l.model.name}}async function Pn(l,e){return await Ns(l)||!(await Le(l,0,12,e)).ranged?null:{manifest:await xn(l,e),source:tr(l,0)}}async function Ns(l){try{return!!await(await caches.open(Zt)).match(l)}catch{return!1}}async function xn(l,e){let r=tr(l,0),t;for(let n=8*1024*1024;n<=128*1024*1024;n*=2)try{let s=await r.bytes(0,n);return await kt(new Blob([s.slice()]))}catch(s){if(e?.aborted)throw s;t=s}throw t instanceof Error?t:new Error("en-t\xEAte GGUF illisible par plages")}function Ws(l,e){let r=new Map,t=[];for(let[n,s]of Object.entries(l.tensors)){let i=n.match(/^blk\.(\d+)\./);if(i){let a=r.get(i[1]);a||r.set(i[1],a=[]),a.push(s)}else t.push({off:e+s.offset,len:s.bytes})}for(let n of r.values()){let s=We(n);if(s)t.push({off:e+s.start,len:s.end-s.start});else for(let i of n)t.push({off:e+i.offset,len:i.bytes})}return t}async function Qs(l,e){let r=await yn();return!r||!(await Le(l,0,12,e)).ranged?null:{cache:r,ranges:Ws(await xn(l,e),0)}}async function _n(l,e,r){return $s(l,await Qs(l,r),e,r)}async function $s(l,e,r,t){if(!e)return"unstorable";let{cache:n,ranges:s}=e;s.sort((g,h)=>g.off-h.off);let i=s.reduce((g,h)=>g+h.len,0),a=await Promise.all(s.map(g=>n.match(Jt(l,g.off,g.off+g.len-1)))),o=0,u=[];s.forEach((g,h)=>{a[h]?o+=g.len:u.push(g)}),r?.({doneBytes:o,totalBytes:i});let c=0,d=!1,f=null,p=async()=>{for(;!d&&f===null;){let g=c++;if(g>=u.length)return;let h=u[g];if(t?.aborted)return;try{await Le(l,h.off,h.len,t)}catch(b){f=b;return}if(!await n.match(Jt(l,h.off,h.off+h.len-1))){d=!0;return}o+=h.len,r?.({doneBytes:o,totalBytes:i})}};if(await Promise.all(Array.from({length:Math.min(4,u.length)},p)),t?.aborted)return"aborted";if(f!==null)throw f instanceof Error?f:new Error(String(f));return d?"unstorable":"done"}var zs,bn,Zt,Un=ne(()=>{"use strict";"use client";et();Vt();fn();hn();mn();zs="brik-range-v1";bn=!1;Zt="brimkern-model-cache"});function Is(l){let e=l.indexOf("<think>");if(e===-1)return l;let r=l.indexOf("</think>",e);return(r===-1?l.slice(0,e):l.slice(0,e)+l.slice(r+8)).trim()}function Bn(l,e,r){l=l.map(n=>n.role==="assistant"?{...n,content:Is(n.content)}:n);let t="";if(e==="deepseek"){t+="<\uFF5Cbegin\u2581of\u2581sentence\uFF5C>",r.trim()&&(t+=r);for(let n of l)n.role==="user"?t+=`<\uFF5CUser\uFF5C>${n.content}`:n.role==="assistant"&&(t+=`<\uFF5CAssistant\uFF5C>${n.content}<\uFF5Cend\u2581of\u2581sentence\uFF5C>`);return t+="<\uFF5CAssistant\uFF5C>",t}if(e==="rwkv7"){r.trim()&&(t+=`System: ${r.trim()}

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
`}return t}function qn(l){let e=new Set;for(let r of["tokenizer.ggml.eos_token_id","tokenizer.ggml.eot_token_id","tokenizer.ggml.eom_token_id"]){let t=l?.[r],n=typeof t=="number"?t:Number(t);Number.isFinite(n)&&n>=0&&e.add(n)}return[...e]}var Gn,Fn=ne(()=>{"use strict";Gn=["<\uFF5Cend\u2581of\u2581sentence\uFF5C>","<\uFF5CAssistant\uFF5C>","<\uFF5CUser\uFF5C>","<\uFF5Cbegin\u2581of\u2581sentence\uFF5C>","<|im_end|>","<|im_start|>","<|eot_id|>","<|begin_of_text|>","<|start_header_id|>","<|end_header_id|>","</s>","<s>","<end_of_turn>","<start_of_turn>","[INST]","[/INST]","[SYSTEM_PROMPT]","</model>","</assistant>","</user>","<|assistant|>","<|user|>",`
User:`]});function Vs(){let l=[];for(let s=33;s<=126;s++)l.push(s);for(let s=161;s<=172;s++)l.push(s);for(let s=174;s<=255;s++)l.push(s);let e=l.slice(),r=0;for(let s=0;s<256;s++)l.includes(s)||(l.push(s),e.push(256+r),r++);let t=new Array(256),n=new Map;for(let s=0;s<l.length;s++)t[l[s]]=String.fromCodePoint(e[s]),n.set(String.fromCodePoint(e[s]),l[s]);return{enc:t,dec:n}}var Sn,ze,rr=ne(()=>{"use strict";Sn="'(?:[sdmt]|ll|ve|re)| ?\\p{L}+| ?\\p{N}+| ?[^\\s\\p{L}\\p{N}]+|\\s+(?!\\S)|\\s+",ze=class l{constructor(e){this.vocab=new Map;this.idToTok=new Map;this.ranks=new Map;this.added=[];this.specialIds=new Set;this.addedRe=null;this.bosIds=[];this.cache=new Map;let r=typeof e=="string"?JSON.parse(e):e;if(r?.model?.type!=="BPE")throw new Error(`BpeTokenizer : model.type ${r?.model?.type} non couvert (BPE uniquement)`);({enc:this.byteEnc,dec:this.byteDec}=Vs());for(let[a,o]of Object.entries(r.model.vocab))this.vocab.set(a,o),this.idToTok.set(o,a);(r.model.merges??[]).forEach((a,o)=>this.ranks.set(Array.isArray(a)?`${a[0]} ${a[1]}`:a,o));for(let a of r.added_tokens??[])this.added.push(a),this.vocab.set(a.content,a.id),this.idToTok.set(a.id,a.content),a.special&&this.specialIds.add(a.id);if(this.added.length){let a=this.added.map(o=>o.content.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).sort((o,u)=>u.length-o.length);this.addedRe=new RegExp(`(${a.join("|")})`,"g")}let n=l.findSplitPattern(r.pre_tokenizer)??Sn;this.splitRe=new RegExp(n,"gu");let s=a=>{if(!a)return null;if(a.type==="TemplateProcessing")return a.single;if(a.type==="Sequence")for(let o of a.processors??[]){let u=s(o);if(u)return u}return null},i=s(r.post_processor);if(Array.isArray(i))for(let a of i)if(a.SpecialToken){let o=this.vocab.get(a.SpecialToken.id);o!==void 0&&this.bosIds.push(o)}else break}static findSplitPattern(e){if(!e)return null;if(e.type==="Split"&&e.pattern?.Regex)return e.pattern.Regex;if(e.type==="ByteLevel"&&e.use_regex!==!1)return Sn;if(e.type==="Sequence")for(let r of e.pretokenizers??[]){let t=l.findSplitPattern(r);if(t)return t}return null}bpe(e){let r=this.cache.get(e);if(r)return r;let t=Array.from(e);for(;t.length>1;){let s=-1,i=1/0;for(let a=0;a<t.length-1;a++){let o=this.ranks.get(`${t[a]} ${t[a+1]}`);o!==void 0&&o<i&&(i=o,s=a)}if(s<0)break;t=[...t.slice(0,s),t[s]+t[s+1],...t.slice(s+2)]}let n=[];for(let s of t){let i=this.vocab.get(s);if(i!==void 0)n.push(i);else for(let a of s){let o=this.vocab.get(a);o!==void 0&&n.push(o)}}return this.cache.set(e,n),n}encodeChunk(e){let r=[];for(let t of e.match(this.splitRe)??[]){let n=new TextEncoder().encode(t),s="";for(let i of n)s+=this.byteEnc[i];r.push(...this.bpe(s))}return r}encode(e){let r=[...this.bosIds];if(this.addedRe)for(let t of e.split(this.addedRe)){if(!t)continue;let n=this.vocab.get(t);n!==void 0&&this.added.some(s=>s.content===t)?r.push(n):r.push(...this.encodeChunk(t))}else r.push(...this.encodeChunk(e));return r}decode(e){let r=[];for(let t of e){if(this.specialIds.has(t))continue;let n=this.idToTok.get(t);if(n!==void 0)for(let s of n){let i=this.byteDec.get(s);if(i!==void 0)r.push(i);else for(let a of new TextEncoder().encode(s))r.push(a)}}return new TextDecoder("utf-8",{fatal:!1}).decode(new Uint8Array(r))}}});function Cn(l){let e=l.metadata,r=String(e["tokenizer.ggml.model"]??""),t=e["tokenizer.ggml.tokens"],n=e["tokenizer.ggml.merges"];if(!Array.isArray(t)||!t.length||!Array.isArray(n)||!n.length||r!=="gpt2"&&r!=="llama")return null;let s=String(e["tokenizer.ggml.pre"]??"gpt2"),i=e["tokenizer.ggml.token_type"]??[],a=On(e["tokenizer.ggml.bos_token_id"]),o=On(e["tokenizer.ggml.eos_token_id"]),u=e["tokenizer.ggml.add_bos_token"]===!0,c={},d=[],f=[];for(let g=0;g<t.length;g++){let h=t[g],b=i[g]??1;b===3||b===4?(d.push({id:g,content:h,special:b===3}),b===3&&f.push(g)):c[h]=g}let p={version:"1.0",added_tokens:d,pre_tokenizer:{type:"Split",pattern:{Regex:Tn[s]??Tn.gpt2}},post_processor:u&&a!=null?{type:"TemplateProcessing",single:[{SpecialToken:{id:t[a],type_id:0}},{Sequence:{id:"A",type_id:0}}]}:void 0,model:{type:"BPE",vocab:c,merges:n}};try{return{tokenizer:new ze(p),nVocab:t.length,pre:s,bosId:a,eosId:o,controlIds:f}}catch(g){return console.warn("[gguf-tok] vocabulaire non consommable par BpeTokenizer. Repli sur le tokenizer HF :",g),null}}function On(l){let e=Number(l);return Number.isFinite(e)?e:null}var Tn,Mn=ne(()=>{"use strict";rr();Tn={"llama-bpe":"(?:'[sS]|'[tT]|'[rR][eE]|'[vV][eE]|'[mM]|'[lL][lL]|'[dD])|[^\\r\\n\\p{L}\\p{N}]?\\p{L}+|\\p{N}{1,3}| ?[^\\s\\p{L}\\p{N}]+[\\r\\n]*|\\s*[\\r\\n]+|\\s+(?!\\S)|\\s+",qwen2:"(?:'[sS]|'[tT]|'[rR][eE]|'[vV][eE]|'[mM]|'[lL][lL]|'[dD])|[^\\r\\n\\p{L}\\p{N}]?\\p{L}+|\\p{N}| ?[^\\s\\p{L}\\p{N}]+[\\r\\n]*|\\s*[\\r\\n]+|\\s+(?!\\S)|\\s+",gpt2:"'(?:[sdmt]|ll|ve|re)| ?\\p{L}+| ?\\p{N}+| ?[^\\s\\p{L}\\p{N}]+|\\s+(?!\\S)|\\s+"}});function nr(l,e,r={}){let{temperature:t=.7,topK:n=40,topP:s=.9,rng:i=Math.random}=r;if(!t||t<=0)return l[0];let a=n&&n>0?Math.min(n,l.length):l.length,o=1/t,u=e[0],c=new Float64Array(a),d=0;for(let h=0;h<a;h++){let b=Math.exp((e[h]-u)*o);c[h]=b,d+=b}for(let h=0;h<a;h++)c[h]/=d;let f=a;if(s&&s<1){let h=0;for(let b=0;b<a;b++)if(h+=c[b],h>=s){f=b+1;break}}let p=0;for(let h=0;h<f;h++)p+=c[h];let g=i()*p;for(let h=0;h<f;h++)if(g-=c[h],g<=0)return l[h];return l[f-1]}var Rn=ne(()=>{"use strict"});function Ln(l){let e=l.arch||"";if(e==="lfm2"||l.config?.lfm2)return"lfm2";if(e==="rwkv7"||l.config?.rwkv)return"rwkv7";if(e==="qwen2"||e.includes("qwen2"))return"qwen";if(e==="qwen3"||e.includes("qwen3"))return"qwen3";if(e==="smollm3"||e.includes("smollm"))return"smollm3";if(e==="mistral3"||e.includes("mistral"))return"mistral3";if(e==="gemma3")return"gemma3";if(e==="gemma"||e==="gemma2")return"gemma";if(e==="deepseek")return"deepseek";if(e==="llama"){let r=l.tensors?.["token_embd.weight"],t=l.config?.d,n=r&&t?r.nElems/t:null;return n&&n<1e5?"llama2":"llama3"}return"qwen"}async function Js(l,e){let r=new mt;if(!await r.init())throw Object.assign(new Error("WebGPU is not available in this browser."),{code:"no-webgpu"});r.onLost=w=>{console.warn("[brimkern] device GPU perdu ("+(w?.reason||"unknown")+"): rechargement au prochain appel"),Fe.delete(l)},await r.selfValidate(),e("download");let t=await Le(l,0,12).catch(()=>null);if((t?.bytes&&t.bytes.length>=4?String.fromCharCode(...t.bytes.subarray(0,4)):"")==="GGUF"||l.toLowerCase().includes(".gguf")){await _n(l,m=>{e("download",{loaded:m.doneBytes,total:m.totalBytes})}).catch(m=>{console.warn("[gguf] pr\xE9chargement par plages indisponible :",m)});let w=await Pn(l).catch(m=>(console.warn("[gguf] streaming par plages \xE9chou\xE9, repli complet :",m),null)),_,G;if(w)_=w.manifest,G=w.source;else{let m=await er(l);_=await kt(new Blob([m.buffer])),G={bytes:async(x,y)=>m.subarray(x,x+y)}}let B=Ln(_);e("tokenizer");let C=Cn(_),E,A=qn(_.metadata);if(C)E=C.tokenizer,C.eosId!=null&&A.push(C.eosId),C.controlIds?.length&&A.push(...C.controlIds);else{console.warn("[brimkern] tokenizer GGUF non-BPE : repli transformers.js (CDN)");let m=await import(Pt),x=_.metadata?.["tokenizer.ggml.id"]||(B==="llama3"?"unsloth/Llama-3.2-1B-Instruct":"Qwen/Qwen2.5-Coder-0.5B-Instruct"),y=await m.AutoTokenizer.from_pretrained(x);E={encode:P=>Array.from(y(P).input_ids.data,U=>Number(U)),decode:P=>y.decode(P,{skip_special_tokens:!0})}}let k=new tt(r,G,_);return e("gpu"),await k.prewarmGpu((m,x)=>{e("gpu",{loaded:m,total:x})}),{core:new xt(r,k,E,B,A),engine:r}}let i=await An(l),a=i.manifest,o=a?.config?.lfm2?"lfm2":a?.config?.rwkv?"rwkv7":"transformer";if(o==="transformer"){e("tokenizer");let w;if(i.tokenizer?.json)try{let E=new ze(i.tokenizer.json);w={encode:A=>E.encode(A),decode:A=>E.decode(A)}}catch(E){console.warn("[brimkern] tokenizer.json non couvert par le BPE bundl\xE9 : repli transformers.js (CDN)",E);let A=await import(Pt),k=new A.PreTrainedTokenizer(JSON.parse(i.tokenizer.json),JSON.parse(i.tokenizer.config));w={encode:v=>Array.from(k(v).input_ids.data,m=>Number(m)),decode:v=>k.decode(v,{skip_special_tokens:!0})}}else{let E=await import(Pt),A=i.tokenizerId||"Qwen/Qwen2.5-0.5B-Instruct",k=await E.AutoTokenizer.from_pretrained(A);w={encode:v=>Array.from(k(v).input_ids.data,m=>Number(m)),decode:v=>k.decode(v,{skip_special_tokens:!0})}}let _=new tt(r,i.source,a);e("gpu"),await _.prewarmGpu((E,A)=>{e("gpu",{loaded:E,total:A})});let G=Ln(a),B=a.chat?.stopTokenIds||[151645,151643];return{core:new xt(r,_,w,G,B),engine:r}}let u=a.tensors["token_embd.weight"],c={arch:{...a.config,arch:o,vocab:u?u.nElems/a.config.d:0},tensors:Object.fromEntries(Object.entries(a.tensors).map(([w,_])=>[w,{dtype:Ys[_.type]??_.type,shape:_.shape,nElems:_.nElems,shard:0,offset:_.offset,byteLength:_.bytes}])),shards:[{id:0,file:"",byteLength:0}],chat:o==="lfm2"?{template:"chatml",stopTokenIds:[7,2,8,10,12]}:{template:"rwkv",stopTokenIds:[0]}},d=Object.values(a.tensors).reduce((w,_)=>w+_.bytes,0),f=0,p=Qt(a.tensors,i.source),g=async w=>{let _=a.tensors[w];if(!_)throw new Error(`tenseur absent : ${w}`);let G=await p(w);return f+=_.bytes,e("download",{loaded:f,total:d}),G};if(e("tokenizer"),o==="rwkv7"){let w=i.tokenizer?.json?JSON.parse(i.tokenizer.json):null;if(!w?.tokens)throw new Error("RWKV .brik without its embedded World vocab (rebuild the BRIK).");let _=new Ze(r,c,g);return e("gpu"),await _.load(w.tokens),{core:_,engine:r}}let h;try{let w=new ze(i.tokenizer.json);h={encode:_=>w.encode(_),decode:_=>w.decode(_)}}catch(w){console.warn("[brimkern] tokenizer.json non couvert par le BPE bundl\xE9 : repli transformers.js (CDN)",w);let _=await import(Pt),G=new _.PreTrainedTokenizer(JSON.parse(i.tokenizer.json),JSON.parse(i.tokenizer.config));h={encode:B=>Array.from(G(B).input_ids.data,C=>Number(C)),decode:B=>G.decode(B,{skip_special_tokens:!0})}}let b=new bt(r,c,g);return e("gpu"),await b.load(h),{core:b,engine:r}}function nt(l){return l&&(l.startsWith("https://")||/^http:\/\/(localhost|127\.0\.0\.1)[:/]/.test(l))?l:Dn[l||"lfm2.5-230m"]||Dn["lfm2.5-230m"]}function _t(l,e){let r=Fe.get(l);if(!r){let t={status:"init",state:"loading",listeners:new Set,promise:null};t.promise=Js(l,(n,s)=>{t.status=n,t.progress=s,t.listeners.forEach(i=>i(n,s))}).then(n=>(t.state="ready",n)).catch(n=>{throw t.state="error",Fe.delete(l),n}),Fe.set(l,t),r=t}return e&&(e(r.status,r.progress),r.listeners.add(e),r.promise.finally(()=>r.listeners.delete(e)).catch(()=>{})),r.promise}async function jn(l,e){let r=await _t(l,e);return r.engine.lost?(Fe.delete(l),(await _t(l,e)).core):r.core}async function En(l,e){let r=await jn(l);try{return await e(r)}catch(t){let n=Fe.get(l);if(!(!n||await n.promise.then(i=>i.engine.lost).catch(()=>!0)))throw t;return console.warn("[brimkern] g\xE9n\xE9ration interrompue par une perte de device : nouvelle tentative"),Fe.delete(l),e(await jn(l))}}function Zs(l,e){let r=l.replace(/<\|[a-z_]+\|>/g,"");if(r=r.replace(/\s*-{2,}\s*(?:E(?:N(?:D(?:\s*O(?:F(?:\s*N(?:O(?:T(?:E(?:S)?)?)?)?)?)?)?)?)?|N(?:O(?:T(?:E(?:S)?)?)?)?)\s*-*\s*$/i,""),e){let t=r.replace(/^\s*(hello|hi|hey|bonjour|salut)\s*[!,.]\s*/i,"");t.trim()&&(r=t)}return r.trimEnd()}function ei(l){let e=-1;for(let r of Gn){let t=l.indexOf(r);t!==-1&&(e===-1||t<e)&&(e=t)}return e===-1?{text:l,hit:!1}:{text:l.slice(0,e),hit:!0}}async function Kn(l,e,r,t,n,s,i,a=[]){let o=l.arch||(l instanceof Ze?"rwkv7":"lfm2"),u=Bn([...a,...e.slice(-Xs)],o,r),c=a.some(g=>g.role==="assistant")||e.some(g=>g.role==="assistant"),d="",f=!1;return await(l.residentAvailable?.()?l.generateResident.bind(l):l.generate.bind(l))(u,t,g=>{let h=ei(g);h.hit&&(f=!0),d=Zs(h.text,c),s?.(d)},()=>f||!!i?.(),{sample:!0,temperature:n,topK:40,repeatPenalty:1.3}),d}var xt,Pt,Dn,Ys,Xs,Fe,sr=ne(()=>{"use strict";Jr();tn();nn();an();Un();et();Fn();rr();Mn();Rn();Vt();xt=class{constructor(e,r,t,n,s){this.engine=e;this.model=r;this.tok=t;this.arch=n,this.stops=new Set(s||[])}residentAvailable(){return!0}reset(){this.model.reset()}unload(){this.model.unload()}async generate(e,r,t,n,s){return this.generateResident(e,r,t,n,s)}async generateResident(e,r,t,n,s){let i="sdk-gen",a=s?.repeatPenalty??(s?.sample?1.3:1),o=s?.temperature??.55,u=s?.topK??40,c=64;this.model.reset();let d=this.tok.encode(e);if(!d.length)return"";let f=256,p=0,g=0;for(let G=0;G<d.length;G+=f){if(n?.())return"";let B=d.slice(G,G+f);if(G+f>=d.length){let E=await this.model.topKKV(B,p,i,d.slice(-c),a);g=nr(E.ids,E.vals,{temperature:s?.sample===!1?0:o,topK:u})}else await this.model.topKKV(B,p,i,[],1);p+=B.length}if(!Number.isInteger(g)||g<0||this.stops.has(g))return"";let h=[g],b=[...d.slice(-c),g].slice(-c),w=new Map;for(let G of b)w.set(G,(w.get(G)??0)+1);let _=G=>{if(b.push(G),w.set(G,(w.get(G)??0)+1),b.length>c){let B=b.shift(),C=w.get(B)-1;C===0?w.delete(B):w.set(B,C)}};t&&t(this.tok.decode(h));for(let G=1;G<r&&!n?.();G++){let B=d.length+G-1,C=await this.model.topKKV([g],B,i,[...w.keys()],a);if(!C.ids||!C.ids.length)break;let E=nr(C.ids,C.vals,{temperature:s?.sample===!1?0:o,topK:u});if(!Number.isInteger(E)||E<0||this.stops.has(E))break;g=E,h.push(g),_(g),t&&t(this.tok.decode(h))}return this.tok.decode(h)}},Pt="https://esm.sh/@huggingface/transformers@4.2.0",Dn={"lfm2.5-230m":"https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik","qwen-0.5b":"https://huggingface.co/romainkh14/Qwen2.5-0.5B-Instruct_BRIK/resolve/main/qwen2.5-0.5b-instruct-mixed.brik","coder-0.5b":"https://huggingface.co/Qwen/Qwen2.5-Coder-0.5B-Instruct-GGUF/resolve/main/qwen2.5-coder-0.5b-instruct-q4_k_m.gguf","coder-1.5b":"https://huggingface.co/Qwen/Qwen2.5-Coder-1.5B-Instruct-GGUF/resolve/main/qwen2.5-coder-1.5b-instruct-q4_k_m.gguf","rwkv-0.4b":"https://huggingface.co/romainkh14/RWKV-7-G1a-0.4B_BRIK/resolve/main/rwkv7-g1a-0.4b-q4.brik","rwkv-0.1b":"https://huggingface.co/romainkh14/RWKV-7-G1-0.1B_BRIK/resolve/main/rwkv7-g1-0.1b-q4.brik"},Ys={F16:"f16",F32:"f32",Q4W:"q4",Q8W:"q8",Q3W:"q3"},Xs=12;Fe=new Map});var zn={};Mr(zn,{LocalBackend:()=>st});var st,ir=ne(()=>{"use strict";sr();st=class{constructor(){this.kind="main"}async preload(e,r){await _t(e,r)}state(e){return Fe.get(e)?.state}turn(e,r,t){return En(e.url,n=>Kn(n,e.history,e.system,e.maxTokens,e.temperature,r,()=>!!t?.aborted,e.pinned))}dispose(){}}});function ti(){try{if(typeof document>"u")return"";let l=document.currentScript;if(l?.src)return new URL(l.src,document.baseURI).href}catch{}return""}function Nn(l){Hn=l}function Wn(){return Hn||ri}var ri,Hn,ar=ne(()=>{"use strict";ri=ti(),Hn=""});var Qn={};Mr(Qn,{WorkerBackend:()=>or});var or,$n=ne(()=>{"use strict";ar();or=class{constructor(){this.kind="worker";this.seq=0;this.pending=new Map;this.states=new Map;if(typeof Worker>"u")throw new Error("Worker indisponible");let e=Wn();if(!e)throw new Error("URL du script introuvable (import ESM ?) : passez workerUrl");let r=(()=>{try{return location.search}catch{return""}})(),t=`self.__brimkernSearch=${JSON.stringify(r)};importScripts(${JSON.stringify(e)});`,n=new Blob([t],{type:"text/javascript"});this.url=URL.createObjectURL(n),this.worker=new Worker(this.url);let s,i;this.hello=new Promise((a,o)=>{s=a,i=o}),this.worker.onerror=a=>i(new Error(`worker: ${a.message||"\xE9chec de chargement"}`)),this.worker.onmessage=a=>{let o=a.data;if(o.type==="hello"){s();return}let u=this.pending.get(o.id);if(u){if(o.type==="progress"){u.onProgress?.(o.status,o.progress);return}if(o.type==="token"){u.onToken?.(o.text);return}this.pending.delete(o.id),o.type==="error"?u.reject(new Error(o.message)):o.type==="state"?u.resolve(o.state):u.resolve(o.text??"")}}}ready(){return this.hello}send(e,r={}){let t=++this.seq,n=new Promise((s,i)=>{this.pending.set(t,{resolve:s,reject:i,...r}),this.worker.postMessage({...e,id:t})});return{id:t,done:n}}async preload(e,r){await this.hello,this.states.get(e)!=="ready"&&this.states.set(e,"loading");try{await this.send({type:"preload",url:e},{onProgress:r}).done,this.states.set(e,"ready")}catch(t){throw this.states.set(e,"error"),t}}state(e){return this.states.get(e)}async turn(e,r,t){await this.hello;let{id:n,done:s}=this.send({type:"turn",req:e},{onToken:r}),i=()=>this.worker.postMessage({type:"stop",id:n});t?.aborted?i():t?.addEventListener("abort",i,{once:!0});try{let a=await s;return this.states.set(e.url,"ready"),a}finally{t?.removeEventListener("abort",i)}}dispose(){this.worker.terminate(),URL.revokeObjectURL(this.url);for(let e of this.pending.values())e.reject(new Error("worker arr\xEAt\xE9"));this.pending.clear()}}});var ni={};var ur,Ut,He,Vn=ne(()=>{"use strict";ir();ur=new st,Ut=new Set,He=l=>self.postMessage(l);self.onmessage=async l=>{let e=l.data;if(e.type==="stop"){Ut.add(e.id);return}if(e.type==="state"){He({type:"state",id:e.id,state:ur.state(e.url)});return}try{if(e.type==="preload"){await ur.preload(e.url,(r,t)=>He({type:"progress",id:e.id,status:r,progress:t})),He({type:"done",id:e.id});return}if(e.type==="turn"){let r=new AbortController,t=new Proxy(r.signal,{get:(u,c)=>c==="aborted"?Ut.has(e.id):Reflect.get(u,c)}),n=16,s=0,i=null,a=()=>{i!==null&&(He({type:"token",id:e.id,text:i}),i=null,s=Date.now())},o=await ur.turn(e.req,u=>{i=u,Date.now()-s>=n&&a()},t);a(),He({type:"done",id:e.id,text:o}),Ut.delete(e.id);return}}catch(r){Ut.delete(e.id),He({type:"error",id:e.id,message:r instanceof Error?r.message:String(r)})}};He({type:"hello"})});var is=new Set(["avec","pour","dans","les","des","une","est","sur","par","que","qui","quoi","comment","pourquoi","quand","vous","nous","votre","notre","mais","plus","tout","tous","cette","sont","avez","puis","faire","fait","fais","font","the","and","for","with","what","who","how","why","when","about","your","our","you","are","can","does","did","this","that","from","have","je","tu","il","elle","on","ils","elles","du","de","la","le","un","en","au","aux","ce","ces","cet","se","sa","son","ses","mon","ma","mes","ton","ta","tes","me","te","ne","pas","si","ou","et","ni","car","donc","or","to","in","at","it","is","be","as","an","by","do","no","so","my","he","we","us","me","am","was","were","been","quel","quelle","quels","quelles","which","where","bonjour","salut","hello","merci"]),ct=new Map,as=2e4;function Rt(l){let e=ct.get(l);if(e!==void 0)return e;let r=os(l);return ct.size>=as&&ct.clear(),ct.set(l,r),r}function os(l){let e=l.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");return e.length<=3||(e=e.replace(/(?:ments?|ements?|eront|erait|aient|antes?|ances?|euses?|ables?|tions?|sions?|eaux|eurs?|euse|ique|iques|istes?|ings?|ness|able|ible|less|full?)$/,""),e.length>3&&(e=e.replace(/(?:er|ir|ez|ent|ais|ait|ant|ees?|es?|ed|ly|s)$/,""))),e}function Qe(l){let e=(l.toLowerCase().match(/[\p{L}\p{N}]+/gu)??[]).filter(r=>is.has(r)?!1:/\d/.test(r)?!0:r.length>=2);return[...new Set(e)]}function Dr(l,e=600){let r=[];return l.forEach((t,n)=>{let s=(t.title||"").trim(),i=(t.text||"").split(/\n\s*\n+/).map(u=>u.trim()).filter(Boolean),a="",o=()=>{a.trim()&&r.push({title:s,text:a.trim(),doc:n}),a=""};for(let u of i){if(u.length>e*1.6){o();let c=u.split(/(?<=[.!?])\s+/),d="";for(let f of c)d&&(d+" "+f).length>e?(r.push({title:s,text:d.trim(),doc:n}),d=f):d=d?`${d} ${f}`:f;d.trim()&&r.push({title:s,text:d.trim(),doc:n});continue}a&&(a+`

`+u).length>e&&o(),a=a?`${a}

${u}`:u}o()}),r}var Rr=new WeakMap;function Lr(l){let e=new Set;for(let r of l)r.length>=4&&e.add(r.slice(0,4));return e}function us(l){let e=Rr.get(l);if(e)return e;let r=`${l.title} ${l.text}`.toLowerCase(),t=l.title.toLowerCase(),n=new Set(Qe(r).map(Rt)),s=new Set(Qe(t).map(Rt)),i={hay:r,titre:t,docStems:n,titreStems:s,docPrefix4:Lr(n),titrePrefix4:Lr(s)};return Rr.set(l,i),i}function cs(l,e,r){if(!l.length)return 0;let t=us(e),n=0,s=0;for(let i of l){let a=r.get(i)??1;s+=a;let o=Rt(i),u=o.length>=4?o.slice(0,4):null;if(t.hay.includes(i)||t.docStems.has(o)||u!==null&&t.docPrefix4.has(u)){let d=t.titre.includes(i)||t.titreStems.has(o)||u!==null&&t.titrePrefix4.has(u);n+=a*(d?2.2:1)}}return s?n/s:0}function ls(l){let e=new Map;for(let n of l)for(let s of Qe(`${n.title} ${n.text}`))e.set(s,(e.get(s)??0)+1);let r=new Map,t=Math.max(1,l.length);for(let[n,s]of e)r.set(n,Math.log(1+t/s));return r}function jr(l,e,r=1200,t=3,n=.22,s=.5){let i=Qe(l);if(!i.length||!e.length)return[];let a=ls(e),o=e.map(g=>({c:g,s:cs(i,g,a)})).filter(g=>g.s>=n).sort((g,h)=>h.s-g.s),u=o.length?o[0].s*s:0,c=o.filter(g=>g.s>=u),d=[],f=new Set,p=r;for(let{c:g,s:h}of c)d.length>=t||g.text.length>p||f.has(g.doc)||(d.push({chunk:g,score:h}),f.add(g.doc),p-=g.text.length);for(let{c:g,s:h}of c){if(d.length>=t)break;d.some(b=>b.chunk===g)||g.text.length>p||(d.push({chunk:g,score:h}),p-=g.text.length)}return d}function Lt(l){if(Qe(l).length<2)return!1;let e=l.trim().toLowerCase();return/\?\s*$/.test(e)?!0:/^(?:who|what|when|where|why|how|which|whose|is|are|was|were|do|does|did|can|could|will|would|should|may|have|has|qui|que|quoi|quand|où|pourquoi|comment|combien|quel|quelles?|quels|est|sont|était|avez|peux|pouvez|puis|vous|y a-t-il|est-ce)\b/.test(e)}function Dt(l,e=!1){let r=l.trim();return r?e?/pas cette information|n[’']ai pas (?:cette|ces|d[’']information)|ne (?:sais|dispose) pas|pas en mesure de (?:vous )?(?:aider|répondre|renseigner|fournir)|ne peux pas (?:vous )?(?:aider|fournir|renseigner|répondre)/i.test(r):/do not have (?:that|this|any) information|don[’']t have (?:that|this|any) information|no information (?:about|on)|(?:can[’']t|cannot|not able to|unable to) (?:assist|provide|answer|access|help you with that)/i.test(r):!1}function ds(l){let e=l.trim().toLowerCase().replace(/[!?.,;:\-_]/g,"").trim();return/^(hi|hello|hey|greetings|good\s+(morning|afternoon|evening|day)|bonjour|salut|coucou|bonsoir|how\s+are\s+you|how\s+are\s+you\s+doing|ça\s+va|ca\s+va|comment\s+vas?-tu|comment\s+allez-vous|who\s+are\s+you|qui\s+es-tu|merci|thanks|thank\s+you|what\s+can\s+you\s+do|que\s+peux-tu\s+faire)$/i.test(e)}function lt(l,e,r=!1){if(e&&ds(e))return"";if(!l.length)return e&&!Lt(e)?r?`

Ce message n\u2019appelle aucune fiche : r\xE9ponds en une phrase courte et aimable.`:`

This message needs no reference note: reply in one short, friendly sentence.`:r?`

Aucune fiche de r\xE9f\xE9rence ne correspond \xE0 cette question. Dis que tu n\u2019as pas cette information : ne devine pas.`:`

No reference note matches this question. Say that you do not have this information: do not guess.`;let t=l.map((s,i)=>`[${i+1}]${s.title?` ${s.title}`:""}
${s.text}`).join(`

`);return`

${r?"R\xE9ponds UNIQUEMENT \xE0 partir des fiches ci-dessous, en fran\xE7ais. Reprends leurs chiffres exactement. Si la r\xE9ponse n\u2019y est pas, dis que tu n\u2019as pas cette information : n\u2019invente jamais pour combler.":"Answer using ONLY the reference notes below. Copy their figures exactly. If the answer is not in them, say you do not have that information: never fill the gap with what you assume."}

--- NOTES ---
${t}
--- END OF NOTES ---`}function Er(l){let e=Array.isArray(l)?l:[l],r=[];for(let t of e)typeof t=="string"&&t.trim()?r.push({text:t}):t&&typeof t=="object"&&typeof t.text=="string"&&t.text.trim()&&r.push({title:t.title,text:t.text});return r}function fs(l){let e=l.replace(/×/g,"*").replace(/÷/g,"/").replace(/,/g,".").replace(/[\s  ]/g,"").replace(/=+$/,"");if(!e||e.length>200)return null;let r=0,t=()=>e[r],n=()=>{let d=/^\d+(\.\d+)?/.exec(e.slice(r));return d?(r+=d[0].length,parseFloat(d[0])):null},s=()=>{if(t()==="("){r++;let d=u();return d===null||t()!==")"?null:(r++,d)}return n()},i=()=>{if(t()==="-"){r++;let d=i();return d===null?null:-d}return s()},a=()=>{let d=i();if(d===null)return null;if(t()==="^"){r++;let f=a();return f===null?null:Math.pow(d,f)}return d},o=()=>{let d=a();for(;d!==null&&(t()==="*"||t()==="/"||t()==="%");){let f=e[r++],p=a();if(p===null)return null;d=f==="*"?d*p:f==="/"?d/p:d%p}return d},u=()=>{let d=o();for(;d!==null&&(t()==="+"||t()==="-");){let f=e[r++],p=o();if(p===null)return null;d=f==="+"?d+p:d-p}return d},c=u();return r===e.length&&c!==null&&Number.isFinite(c)?c:null}function Kr(l,e=3){let r=[],t=new Set,n=/[\d(][\d\s  .,+\-*/×÷%^()]*[\d)]\s*=?/g;for(let s of l.matchAll(n)){let i=s[0].trim();if(r.length>=e)break;if(t.has(i)||/\d{1,2}[/.]\d{1,2}[/.]\d{2,4}/.test(i)||/\d+:\d+/.test(l.slice(Math.max(0,s.index-1),s.index+i.length+1)))continue;let a=(i.match(/[+\-*/×÷%^]/g)||[]).length,o=/[*×÷%^(]/.test(i)||/=$/.test(i)||a>=2;if(a===0||!o)continue;let u=fs(i);if(u===null)continue;let c=i.replace(/=+$/,"").trim();/[+\-*/×÷%^]/.test(c)&&(t.add(i),r.push({expr:c,value:u}))}return r}function zr(l){let e=Math.round(l*1e9)/1e9;return Number.isInteger(e),String(e)}function dt(l){return new Date().toLocaleDateString(l==="fr"?"fr-FR":"en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}var ps=1e4,gs=600;function ft(l){if(!Array.isArray(l))return[];let e=[];for(let r of l){if(r==="calc"||r==="date"){e.push(r);continue}let t=r;if(t&&typeof t=="object"&&typeof t.name=="string"&&t.name.trim()&&typeof t.run=="function"&&(t.match instanceof RegExp||typeof t.match=="function")){e.push(t);continue}console.warn("[brimkern] outil ignor\xE9 (attendu : 'calc', 'date', ou { name, match, run }) :",r)}return e}var Hr=l=>l.includes("date");function Nr(l){return l?`
(Date du jour : ${dt("fr")}.)`:`
(Today's date: ${dt("en")}.)`}var hs=/\b(?:today|tonight|what\s+day|which\s+day|what\s+date|what\s+year|what\s+month|current\s+(?:date|day|year)|aujourd(?:'|’)hui|quel\s+jour|quelle\s+date|quelle\s+ann[ée]e|quel\s+mois|on\s+est\s+quel)\b/i,ms=(l,e)=>new Promise((r,t)=>{let n=setTimeout(()=>t(new Error(`outil sans r\xE9ponse apr\xE8s ${e} ms`)),e);l.then(s=>{clearTimeout(n),r(s)},s=>{clearTimeout(n),t(s)})});async function jt(l,e,r){let t=[];for(let n of l){if(n==="date"){hs.test(e)&&t.push({name:"date",result:dt(r?"fr":"en")});continue}if(n==="calc"){let s=Kr(e);s.length&&t.push({name:r?"calculatrice":"calculator",result:s.map(i=>`${i.expr} = ${zr(i.value)}`).join(" ; ")});continue}try{if(!(n.match instanceof RegExp?n.match.test(e):n.match(e)))continue;let i=await ms(Promise.resolve(n.run(e)),ps),a=String(i??"").replace(/\s+/g," ").trim().slice(0,gs);a&&t.push({name:n.name.replace(/\s+/g," ").trim().slice(0,40),result:a})}catch(s){console.error(`[brimkern] outil \xAB ${n.name} \xBB a \xE9chou\xE9 :`,s)}}return t}function pt(l,e){if(!l.length)return"";let r=l.map(t=>e?`${t.name} : ${t.result}`:`${t.name}: ${t.result}`).join(" \xB7 ");return e?`[R\xE9sultats d\u2019outils locaux. Exacts, utilise-les tels quels : ${r}]`:`[Local tool results. Exact values, use them as-is: ${r}]`}sr();async function In(l){let{LocalBackend:e}=await Promise.resolve().then(()=>(ir(),zn));if(l!==!0)return new e;try{let{WorkerBackend:r}=await Promise.resolve().then(()=>($n(),Qn)),t=new r;return await t.ready(),t}catch(r){return console.warn("[brimkern] Web Worker indisponible : inf\xE9rence sur le thread principal",r),new e}}ar();var si=typeof self<"u"&&typeof self.importScripts=="function"&&typeof document>"u";si&&Promise.resolve().then(()=>(Vn(),ni));var Bt=null,lr=null,cr;function it(){return Bt||(Bt=In(cr).then(l=>(lr=l,l))),Bt}var ii=()=>lr?.kind??"pending";function dr(l){if(l.workerUrl&&Nn(l.workerUrl),l.worker!==void 0){if(Bt&&cr!==l.worker){console.warn("[brimkern] option `worker` ignor\xE9e : le backend est d\xE9j\xE0 d\xE9marr\xE9 et partag\xE9 par la page.");return}cr=l.worker}}var ai=`
Answer briefly and honestly. If you do not know something, say so: never invent facts or details.
You have no tools and no internet access: never emit tool calls, reply in plain text only.`,oi=`
Answer briefly and honestly. If you do not know something, say so: never invent facts or details.
Bracketed tool results in the message are exact facts: use them as-is. Never emit tool calls yourself, reply in plain text only.`;function Xn(){let l=new Map;return{on(e,r){let t=l.get(e);return t||l.set(e,t=new Set),t.add(r),()=>{t.delete(r)}},emit(e,...r){let t=l.get(e);if(t)for(let n of[...t])try{n(...r)}catch(s){console.error("[brimkern] \xE9couteur `"+e+"` a lev\xE9 :",s)}},clear(){l.clear()}}}function ot(l){if(!Array.isArray(l))return[];let e=[];for(let r of l){let t=r?.role,n=r?.content;(t==="user"||t==="assistant")&&typeof n=="string"&&n.trim()&&e.push({role:t,content:n})}return e}function at(l){return l.lang?l.lang==="fr":l.system?/[àâäéèêëîïôöùûüç]|\b(?:bonjour|salut|vous|tu|réponds|conseiller|boutique|aide|aidez|client|magasin)\b/i.test(l.system):!!(typeof document<"u"&&/^fr\b/i.test(document.documentElement.lang||"")||typeof navigator<"u"&&/^fr\b/i.test(navigator.language||""))}var Jn={en:{ouvrir:"Open the chat",fermer:"Close",placeholder:"Type a message\u2026",note:"Local AI \u2014 runs on your GPU, nothing is sent anywhere.",erreur:"Error: ",vide:"Sorry, I can only answer in plain text here: could you rephrase?",aide:"I\u2019m here to help \u2014 what would you like to know?",mo:"MB",sources:"Sources:",phases:{init:"Starting up\u2026",download:"downloading the model\u2026",tokenizer:"tokenizer\u2026",gpu:"weights to the GPU\u2026"},erreurs:{"no-webgpu":"This browser does not support WebGPU: the local assistant cannot run here."}},fr:{ouvrir:"Ouvrir le chat",fermer:"Fermer",placeholder:"\xC9cris un message\u2026",note:"IA locale \u2014 tourne sur votre GPU, aucune donn\xE9e envoy\xE9e.",erreur:"Erreur : ",vide:"D\xE9sol\xE9, je ne peux r\xE9pondre qu\u2019en texte simple ici : pouvez-vous reformuler ?",aide:"Je suis l\xE0 pour vous aider \u2014 que voulez-vous savoir ?",mo:"Mo",sources:"Sources :",phases:{init:"initialisation\u2026",download:"t\xE9l\xE9chargement du mod\xE8le\u2026",tokenizer:"tokenizer\u2026",gpu:"poids sur le GPU\u2026"},erreurs:{"no-webgpu":"Ce navigateur ne prend pas en charge WebGPU : l\u2019assistant local ne peut pas tourner ici."}}};function ui(l,e){if(!e)return l;let r=n=>typeof n=="string"&&!!n.trim(),t={...l.phases};if(e.phases&&typeof e.phases=="object")for(let[n,s]of Object.entries(e.phases))r(s)&&(t[n]=s);return{...l,...r(e.open)?{ouvrir:e.open}:null,...r(e.close)?{fermer:e.close}:null,...r(e.placeholder)?{placeholder:e.placeholder}:null,...r(e.note)?{note:e.note}:null,...r(e.error)?{erreur:e.error}:null,...r(e.empty)?{vide:e.empty}:null,...r(e.help)?{aide:e.help}:null,...r(e.sources)?{sources:e.sources}:null,...r(e.mb)?{mo:e.mb}:null,phases:t}}var ci=(l,e)=>l.phases[e]??e,Yn=(l,e)=>e?.code&&l.erreurs[e.code]||e?.message||String(e);function qt(l){let e=ft(l.tools),r=Hr(e)?Nr(at(l)):"",t=(l.system||"You are a helpful assistant.")+(e.length?oi:ai)+r,n=c=>c.flatMap(d=>[{role:"user",content:d.user},{role:"assistant",content:d.assistant}]),s=e.length?li(at(l)):[];if(!l.knowledge)return{system:()=>t,userTurn:(c,d)=>({text:d?`${c}

${d}`:c,sources:[],conversationnel:!1}),pinned:n([...s,...l.examples||[]])};let i=Dr(Er(l.knowledge)),a=l.knowledgeBudget??1200,o=at(l),u=o?t+`

Le message utilisateur peut inclure des fiches de r\xE9f\xE9rence entre des balises ---. Dans ce cas, r\xE9ponds uniquement \xE0 partir de ces fiches en citant fid\xE8lement leurs informations dans la langue de la question. Si aucune note ne correspond, indique poliment que tu n\u2019as pas cette information.`:t+`

The user message may include reference notes between --- markers. When it does, answer from those notes and quote their figures exactly. When it says no note matches, say you do not have that information.`;return{system:()=>u,userTurn:(c,d)=>{let f=jr(c,i,a);if(d&&!f.length)return{text:`${c}

${d}`,sources:[],conversationnel:!1};let p=lt(f.map(h=>h.chunk),c,o).trim(),g=h=>d?`${h}

${d}`:h;return{text:p?`${g(p)}

Question: ${c}`:g(c),sources:p?f.map(({chunk:h,score:b})=>({title:h.title,text:h.text,score:b,doc:h.doc})):[],conversationnel:!f.length&&!Lt(c)}},pinned:n([...di(o),...s,...l.examples||[]])}}function li(l=!1){let e=(r,t)=>`${r}

${pt(t,l)}`;return l?[{user:e("Combien font 45*3 ?",[{name:"calculatrice",result:"45*3 = 135"}]),assistant:"45*3 = 135."},{user:e("Il vous en reste en rayon ?",[{name:"rayon",result:"3 exemplaires en rayon"}]),assistant:"Oui \u2014 il en reste 3 exemplaires en rayon."}]:[{user:e("What is 45*3?",[{name:"calculator",result:"45*3 = 135"}]),assistant:"45*3 = 135."},{user:e("Do you still have some on the shelf?",[{name:"shelf",result:"3 items on the shelf"}]),assistant:"Yes \u2014 3 items are on the shelf."}]}function di(l=!1){let e=(n,s)=>({title:n,text:s,doc:0}),r=(n,s)=>`${lt(n,void 0,l).trim()}

Question: ${s}`,t=(n,s)=>`${lt(n,s,l).trim()}

Question: ${s}`;return l?[{user:"Bonjour !",assistant:"Bonjour ! Comment puis-je vous aider ?"},{user:r([e("Guide des tailles",`Tableau des correspondances :
- Pointure EU 38 : 24,0 cm (US 6,5)
- Pointure EU 39 : 24,5 cm (US 7,0)
- Pointure EU 41 : 26,0 cm (US 8,0)`)],"Je fais du 41, quelle taille en cm ?"),assistant:"La pointure 41 correspond \xE0 26,0 cm."},{user:r([e("Retours","Les retours sont gratuits sous 14 jours. Le remboursement est effectu\xE9 sous 3 jours ouvr\xE9s.")],"Combien de temps pour retourner un article ?"),assistant:"Vous disposez de 14 jours pour retourner un article."},{user:r([],"Qui a gagn\xE9 la Coupe du Monde 1998 ?"),assistant:"Je n\u2019ai pas cette information dans mes fiches."},{user:t([],"Tu es un robot ?"),assistant:"Je suis un assistant automatique, oui. Comment puis-je vous aider ?"}]:[{user:"Hello!",assistant:"Hello! How can I help you today?"},{user:r([e("Size guide",`Size conversions:
- Size EU 38: 24.0 cm (US 6.5)
- Size EU 39: 24.5 cm (US 7.0)
- Size EU 41: 26.0 cm (US 8.0)`)],"I wear a 41, what is that in cm?"),assistant:"A size 41 is 26.0 cm."},{user:r([e("Returns","Returns are free within 14 days. Refunds are issued within 3 working days.")],"How long do I have to return an item?"),assistant:"You have 14 days to return an item."},{user:r([],"Who won the 1998 World Cup?"),assistant:"I do not have that information in my notes."},{user:t([],"Are you a robot?"),assistant:"I am an automated assistant, yes. How can I help?"}]}function Zn(l={}){dr(l);let e=nt(l.model),r=l.maxTokens||220,t=l.knowledge,n=qt(l),s=at(l),i=ot(l.history),a=[],o=Xn(),u=!1,c=!1,d=!1,f=()=>l.temperature??(t?.25:.55),p=ft(l.tools),g=h=>{if(u)throw new Error(`brimkern: ${h} impossible pendant une g\xE9n\xE9ration`)};return{async ask(h,b={}){if(c)throw new Error("session d\xE9truite");if(u)throw new Error("g\xE9n\xE9ration d\xE9j\xE0 en cours sur cette session");u=!0,i.push({role:"user",content:h}),o.emit("message",{role:"user",content:h});try{let w=await jt(p,h,s);for(let v of w)o.emit("tool",v);let{text:_,sources:G,conversationnel:B}=n.userTurn(h,pt(w,s));a=G,b.onSources?.(G);let C=[...i.slice(0,-1),{role:"user",content:_}],E=await it();await E.preload(e,(v,m)=>o.emit("progress",v,m)),d||(d=!0,o.emit("ready"));let A={url:e,history:C,system:n.system(h),maxTokens:r,temperature:f(),pinned:n.pinned},k=await E.turn(A,b.onToken,b.signal);return b.signal?.aborted?(i.pop(),""):(B&&Dt(k,s)&&(k=Jn[s?"fr":"en"].aide),i.push({role:"assistant",content:k}),o.emit("message",{role:"assistant",content:k,sources:G}),k)}catch(w){throw i.pop(),o.emit("error",w instanceof Error?w:new Error(String(w))),w}finally{u=!1}},reset(){i=[],a=[]},destroy(){c=!0,i=[],a=[],o.clear()},get history(){return i.slice()},get lastSources(){return a.slice()},setHistory(h){g("setHistory"),i=ot(h)},setKnowledge(h){g("setKnowledge"),t=h,n=qt({...l,knowledge:h}),a=[]},on:o.on}}function fi(){if(document.getElementById("bk-style"))return;let l=document.createElement("style");l.id="bk-style",l.textContent=`
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
  `,document.head.appendChild(l)}function pi(l){if(!l)return"#c72c1e";if(/^#[0-9a-fA-F]{3,8}$/.test(l))return l;try{if(typeof CSS<"u"&&CSS.supports("color",l)&&!/[{};()]/.test(l))return l}catch{}return"#c72c1e"}function gi(l,e){let r=l.knowledge,t=qt(l),n=at(l),s=ui(Jn[n?"fr":"en"],l.labels),i=pi(l.accent),a=l.title||"Assistant",o=l.maxTokens||220,u=ft(l.tools);fi();let c=document.createElement("button");c.className="bk-fab",c.setAttribute("aria-label",s.ouvrir),c.textContent="\u{1F4AC}";let d=document.createElement("div");if(d.className="bk-panel",c.style.setProperty("--bk-accent",i),d.style.setProperty("--bk-accent",i),l.position==="bottom-left")for(let S of[c,d])S.style.left="20px",S.style.right="auto";let f=(S,L,z)=>typeof S=="number"&&Number.isFinite(S)?Math.min(z,Math.max(L,Math.round(S))):null,p=f(l.width,300,480),g=f(l.height,380,720);p&&(d.style.width=`${p}px`),g&&(d.style.height=`${g}px`);let h={"--bk-bg":"#211f1c","--bk-surface":"#2c2a26","--bk-border":"#413e38","--bk-border2":"#3a3733","--bk-text":"#f0eee8","--bk-muted":"#a29e93","--bk-muted2":"#c6c2b8"},b=S=>{for(let L of[c,d])for(let[z,Q]of Object.entries(h))S?L.style.setProperty(z,Q):L.style.removeProperty(z)},w=null,_=null;l.theme==="dark"?b(!0):l.theme==="auto"&&typeof matchMedia=="function"&&(w=matchMedia("(prefers-color-scheme: dark)"),b(w.matches),_=S=>b(S.matches),w.addEventListener("change",_)),d.innerHTML=`
    <div class="bk-hd"><span class="bk-dot"></span><span>${Gt(a)}</span><button class="bk-x" aria-label="${Gt(s.fermer)}">\xD7</button></div>
    <div class="bk-msgs"></div>
    <div class="bk-foot"><textarea class="bk-in" rows="1" placeholder="${Gt(s.placeholder)}"></textarea><button class="bk-send">\u2191</button></div>
    <div class="bk-note">${Gt(s.note)}</div>`,document.body.appendChild(c),document.body.appendChild(d);let G=d.querySelector(".bk-msgs"),B=d.querySelector(".bk-in"),C=d.querySelector(".bk-send"),E=d.querySelector(".bk-x"),A=ot(l.history),k=!1,v=!1,m=!1,x=new AbortController,y=(S,L)=>{let z=document.createElement("div");return z.className=`bk-m ${S==="user"?"bk-u":"bk-a"}`,z.textContent=L,G.appendChild(z),G.scrollTop=G.scrollHeight,z},P=S=>{if(!l.showSources||!S.length)return;let L=document.createElement("div");L.className="bk-src";let z=document.createElement("b");z.textContent=`${s.sources} `,L.appendChild(z),L.appendChild(document.createTextNode(S.map((Q,V)=>`[${V+1}] ${Q.title||Q.text.slice(0,40).replace(/\s+/g," ").trim()+"\u2026"}`).join(" \xB7 "))),G.appendChild(L),G.scrollTop=G.scrollHeight},U=()=>{G.textContent="";for(let S of A)y(S.role,S.content)};A.length?U():l.greeting&&(A.push({role:"assistant",content:l.greeting}),y("assistant",l.greeting));let F=nt(l.model),q=()=>{if(!v){v=!0;let S=y("assistant",s.phases.init);S.classList.add("bk-status"),it().then(L=>L.preload(F,(z,Q)=>{e.emit("progress",z,Q);let V=ci(s,z);S.textContent=Q?.total?`${V} ${Math.round(Q.loaded/1048576)} / ${Math.round(Q.total/1048576)} ${s.mo}`:V})).then(()=>{S.remove(),e.emit("ready")}).catch(L=>{S.textContent=s.erreur+Yn(s,L),v=!1,e.emit("error",L instanceof Error?L:new Error(String(L)))})}return it()},O=async S=>{k=!0,C.disabled=!0,A.push({role:"user",content:S}),y("user",S),e.emit("message",{role:"user",content:S});let L=y("assistant","\u2026");try{await q();let z=await jt(u,S,n);for(let R of z)e.emit("tool",R);let{text:Q,sources:V,conversationnel:I}=t.userTurn(S,pt(z,n)),X=[...A.slice(0,-1),{role:"user",content:Q}],M={url:F,history:X,system:t.system(S),maxTokens:o,temperature:r?.25:.55,pinned:t.pinned},T=await(await it()).turn(M,R=>{L.textContent=R||"\u2026",G.scrollTop=G.scrollHeight},x.signal);return m?"":(T?I&&Dt(T,n)&&(T=s.aide):T=s.vide,L.textContent=T,A.push({role:"assistant",content:T}),P(V),e.emit("message",{role:"assistant",content:T,sources:V}),T)}catch(z){throw L.textContent=s.erreur+Yn(s,z),e.emit("error",z instanceof Error?z:new Error(String(z))),z}finally{k=!1,C.disabled=!1,m||B.focus()}},D=()=>{let S=B.value.trim();!S||k||m||(B.value="",O(S).catch(()=>{}))},K=S=>{m||d.classList.contains("bk-open")!==S&&(d.classList.toggle("bk-open",S),S&&(B.focus(),q()),e.emit(S?"open":"close"))};return c.onclick=()=>K(!d.classList.contains("bk-open")),E.onclick=()=>K(!1),C.onclick=D,B.onkeydown=S=>{S.key==="Enter"&&!S.shiftKey&&(S.preventDefault(),D())},{open:()=>K(!0),close:()=>K(!1),toggle:()=>K(!d.classList.contains("bk-open")),ask(S){if(m)return Promise.reject(new Error("brimkern: widget d\xE9mont\xE9"));let L=String(S??"").trim();return L?k?Promise.reject(new Error("g\xE9n\xE9ration d\xE9j\xE0 en cours sur ce widget")):(K(!0),O(L)):Promise.reject(new Error("brimkern: ask() attend une question non vide"))},destroy(){m||(m=!0,x.abort(),w&&_&&w.removeEventListener("change",_),c.onclick=null,E.onclick=null,C.onclick=null,B.onkeydown=null,c.remove(),d.remove(),A=[])},setKnowledge(S){r=S,t=qt({...l,knowledge:S})},setHistory(S){if(k)throw new Error("brimkern: setHistory impossible pendant une g\xE9n\xE9ration");A=ot(S),U()},history:()=>A.slice(),el:d}}function Gt(l){return l.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}var hi=(l={})=>{let e=Xn(),r=null,t=!1,n=!1,s=[],i=o=>{r?o(r):!t&&!n&&s.push(o)},a=()=>{if(!(n||r)){r=gi(l,e);for(let o of s.splice(0))o(r)}};return typeof window>"u"||typeof document>"u"?(t=!0,console.warn("[brimkern] embed() ignor\xE9 : aucun DOM (rendu serveur ?). Appelez-le dans un effet client.")):(dr(l),document.body?a():window.addEventListener("DOMContentLoaded",a,{once:!0})),{open:()=>i(o=>o.open()),close:()=>i(o=>o.close()),toggle:()=>i(o=>o.toggle()),ask(o){return t?Promise.reject(new Error("brimkern: ask() sans DOM (rendu serveur ?)")):n?Promise.reject(new Error("brimkern: widget d\xE9mont\xE9")):new Promise((u,c)=>i(d=>d.ask(o).then(u,c)))},destroy(){n=!0,s.length=0,r?.destroy(),r=null,e.clear()},setKnowledge:o=>i(u=>u.setKnowledge(o)),setHistory:o=>i(u=>u.setHistory(o)),get history(){return r?r.history():ot(l.history)},get el(){return r?r.el:null},on:e.on}};var mi=async l=>{if(typeof l!="object"||l===null||typeof l.prompt!="string")throw new TypeError(`Brimkern.generate expects a single object: generate({ prompt: "\u2026", model?, system? }). Received ${typeof l}${typeof l=="object"&&l?" without a `prompt` string":""}.`);return Zn(l).ask(l.prompt,{onToken:l.onToken,signal:l.signal,onSources:l.onSources})},bi=(l={})=>(dr(l),typeof navigator<"u"&&"gpu"in navigator?it().then(e=>e.preload(nt(l.model),l.onProgress)).then(()=>!0).catch(()=>!1):Promise.resolve(!1)),vi=l=>typeof navigator>"u"||!("gpu"in navigator)?"unavailable":lr?.state(nt(l))??"idle";typeof window<"u"&&(window.Brimkern={embed:hi,createSession:Zn,generate:mi,preload:bi,status:vi,runtime:ii});})();
