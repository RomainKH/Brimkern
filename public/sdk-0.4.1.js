"use strict";(()=>{var fs=Object.defineProperty;var se=(l,e,r)=>()=>{if(r)throw r[0];try{return l&&(e=l(l=0)),e}catch(t){throw r=[t],t}};var jr=(l,e)=>{for(var r in e)fs(l,r,{get:e[r],enumerable:!0})};function Ce(l){let e=new Float32Array(1),r=new Uint32Array(e.buffer);e[0]=l;let t=r[0],n=t>>16&32768,s=(t>>23&255)-127+15,i=t&8388607;return s<=0?n:s>=31?n|31743:(i=(i>>13)+(i>>12&1),i===1024&&(i=0,s+=1),n|s<<10|i&1023)}function de(l){let e=l>>15&1,r=l>>10&31,t=l&1023,n;return r===0?n=t*59604645e-15:r===31?n=t?NaN:1/0:n=(1+t/1024)*2**(r-15),e===1?-n:n}var Qe=se(()=>{"use strict"});function _e(l){let e=l.length;if(e%Pe!==0)throw new Error(`q4web: length ${e} not a multiple of ${Pe}`);let r=e/Pe,t=new Uint8Array(e/2),n=new Uint16Array(r),s=new Uint16Array(r);for(let i=0;i<r;i++){let a=i*Pe,o=1/0,u=-1/0;for(let m=0;m<Pe;m++){let b=l[a+m];b<o&&(o=b),b>u&&(u=b)}let c=(u-o)/15||1e-8,f=Ce(c),d=Ce(o);n[i]=f,s[i]=d;let p=de(f)||1e-8,g=de(d);for(let m=0;m<Pe;m++){let b=Math.round((l[a+m]-g)/p);b=b<0?0:b>15?15:b;let v=a+m;(m&1)===0?t[v>>1]=b:t[v>>1]|=b<<4}}return{nibbles:t,scales:n,mins:s,nElems:e}}function be(l,e){let r=e/Pe,t=e/2,n=l.slice(0,t),s=new Uint16Array(r),i=new Uint16Array(r),a=new DataView(l.buffer,l.byteOffset);for(let o=0;o<r;o++)s[o]=a.getUint16(t+o*2,!0);for(let o=0;o<r;o++)i[o]=a.getUint16(t+r*2+o*2,!0);return{nibbles:n,scales:s,mins:i,nElems:e}}function ge(l){let e=new Float32Array(l.nElems),r=l.nElems/Pe;for(let t=0;t<r;t++){let n=de(l.scales[t]),s=de(l.mins[t]),i=t*Pe;for(let a=0;a<Pe;a++){let o=i+a,u=l.nibbles[o>>1],c=(a&1)===0?u&15:u>>4;e[o]=c*n+s}}return e}var Pe,$e=se(()=>{"use strict";Qe();Pe=32});function Ge(l){let e=l.length;if(e%Ue!==0)throw new Error(`q8web: length ${e} not a multiple of ${Ue}`);let r=e/Ue,t=new Int8Array(e),n=new Uint16Array(r);for(let s=0;s<r;s++){let i=s*Ue,a=0;for(let f=0;f<Ue;f++){let d=Math.abs(l[i+f]);d>a&&(a=d)}let o=a/127||1e-8,u=Ce(o);n[s]=u;let c=de(u)||1e-8;for(let f=0;f<Ue;f++){let d=Math.round(l[i+f]/c);d=d<-127?-127:d>127?127:d,t[i+f]=d}}return{codes:t,scales:n,nElems:e}}function ke(l,e){let r=e/Ue,t=new Int8Array(l.buffer.slice(l.byteOffset,l.byteOffset+e)),n=new Uint16Array(r),s=new DataView(l.buffer,l.byteOffset);for(let i=0;i<r;i++)n[i]=s.getUint16(e+i*2,!0);return{codes:t,scales:n,nElems:e}}function he(l){let e=new Float32Array(l.nElems),r=l.nElems/Ue;for(let t=0;t<r;t++){let n=de(l.scales[t]),s=t*Ue;for(let i=0;i<Ue;i++)e[s+i]=l.codes[s+i]*n}return e}var Ue,Ve=se(()=>{"use strict";Qe();Ue=32});function Vr(l){let e=l.length;if(e%Be!==0)throw new Error(`q3web: length ${e} not a multiple of ${Be}`);let r=e/Be,t=new Uint32Array(e/16),n=new Uint32Array(e/32),s=new Uint16Array(r),i=new Uint16Array(r);for(let a=0;a<r;a++){let o=a*Be,u=1/0,c=-1/0;for(let b=0;b<Be;b++){let v=l[o+b];v<u&&(u=v),v>c&&(c=v)}let f=(c-u)/7||1e-8,d=Ce(f),p=Ce(u);s[a]=d,i[a]=p;let g=de(d)||1e-8,m=de(p);for(let b=0;b<Be;b++){let v=Math.round((l[o+b]-m)/g);v=v<0?0:v>7?7:v;let _=o+b;t[_>>4]|=(v&3)<<(_&15)*2,n[_>>5]|=v>>2<<(_&31)}}return{lo:t,hi:n,scales:s,mins:i,nElems:e}}function xe(l,e){let r=e/Be,t=e/16,n=e/32,s=t*4,i=n*4,a=new DataView(l.buffer,l.byteOffset),o=new Uint32Array(t),u=new Uint32Array(n),c=new Uint16Array(r),f=new Uint16Array(r);for(let g=0;g<t;g++)o[g]=a.getUint32(g*4,!0);for(let g=0;g<n;g++)u[g]=a.getUint32(s+g*4,!0);let d=s+i,p=d+r*2;for(let g=0;g<r;g++)c[g]=a.getUint16(d+g*2,!0);for(let g=0;g<r;g++)f[g]=a.getUint16(p+g*2,!0);return{lo:o,hi:u,scales:c,mins:f,nElems:e}}function Me(l){let e=new Float32Array(l.nElems),r=l.nElems/Be;for(let t=0;t<r;t++){let n=de(l.scales[t]),s=de(l.mins[t]),i=t*Be;for(let a=0;a<Be;a++){let o=i+a,u=l.lo[o>>4]>>(o&15)*2&3|(l.hi[o>>5]>>(o&31)&1)<<2;e[o]=u*n+s}}return e}var Be,Ye=se(()=>{"use strict";Qe();Be=32});var Yr,Xr,Jr=se(()=>{"use strict";Yr={matmul:`
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
		}`,dequant_q3k:`
		struct DQ { nBlocks: u32 };
		@group(0) @binding(0) var<uniform> p: DQ;
		@group(0) @binding(1) var<storage, read> q: array<u32>;
		@group(0) @binding(2) var<storage, read_write> o: array<f32>;
		fn gb(i: u32) -> u32 { return (q[i >> 2u] >> ((i & 3u) * 8u)) & 0xFFu; }
		fn f16(h: u32) -> f32 {
			let s = (h >> 15u) & 1u;
			let e = (h >> 10u) & 0x1Fu;
			let m = h & 0x3FFu;
			var v: f32;
			if (e == 0u) { v = f32(m) * 5.9604645e-8; }
			else if (e == 31u) { v = 65504.0; }
			else { v = (1.0 + f32(m) / 1024.0) * pow(2.0, f32(e) - 15.0); }
			return select(v, -v, s == 1u);
		}
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let blk = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (blk >= p.nBlocks) { return; }
			let base = blk * 110u;
			let d = f16(gb(base + 108u) | (gb(base + 109u) << 8u));

			let aux0 = gb(base + 96u)  | (gb(base + 97u) << 8u)  | (gb(base + 98u) << 16u)  | (gb(base + 99u) << 24u);
			let aux1 = gb(base + 100u) | (gb(base + 101u) << 8u) | (gb(base + 102u) << 16u) | (gb(base + 103u) << 24u);
			let aux2 = gb(base + 104u) | (gb(base + 105u) << 8u) | (gb(base + 106u) << 16u) | (gb(base + 107u) << 24u);

			let kmask1 = 0x03030303u;
			let kmask2 = 0x0f0f0f0fu;

			let tmp = aux2;
			let a2 = ((aux0 >> 4u) & kmask2) | (((tmp >> 4u) & kmask1) << 4u);
			let a3 = ((aux1 >> 4u) & kmask2) | (((tmp >> 6u) & kmask1) << 4u);
			let a0 = (aux0 & kmask2) | (((tmp >> 0u) & kmask1) << 4u);
			let a1 = (aux1 & kmask2) | (((tmp >> 2u) & kmask1) << 4u);

			let outBase = blk * 256u;
			var is = 0u;
			var qOffset = base + 32u;
			let hmOffset = base;
			var m = 1u;

			for (var n = 0u; n < 256u; n = n + 128u) {
				var shift = 0u;
				for (var j = 0u; j < 4u; j = j + 1u) {
					var w0: u32;
					if (is < 4u) { w0 = a0; }
					else if (is < 8u) { w0 = a1; }
					else if (is < 12u) { w0 = a2; }
					else { w0 = a3; }
					let sc0 = f32(i32((w0 >> ((is & 3u) * 8u)) & 0xFFu) - 32);
					let dl0 = d * sc0;
					is = is + 1u;

					for (var l = 0u; l < 16u; l = l + 1u) {
						let qval = (gb(qOffset + l) >> shift) & 3u;
						let hmBit = gb(hmOffset + l) & m;
						let hSub = select(4.0, 0.0, hmBit != 0u);
						o[outBase + n + j * 32u + l] = dl0 * (f32(qval) - hSub);
					}

					var w1: u32;
					if (is < 4u) { w1 = a0; }
					else if (is < 8u) { w1 = a1; }
					else if (is < 12u) { w1 = a2; }
					else { w1 = a3; }
					let sc1 = f32(i32((w1 >> ((is & 3u) * 8u)) & 0xFFu) - 32);
					let dl1 = d * sc1;
					is = is + 1u;

					for (var l = 0u; l < 16u; l = l + 1u) {
						let qval = (gb(qOffset + 16u + l) >> shift) & 3u;
						let hmBit = gb(hmOffset + 16u + l) & m;
						let hSub = select(4.0, 0.0, hmBit != 0u);
						o[outBase + n + j * 32u + 16u + l] = dl1 * (f32(qval) - hSub);
					}

					shift = shift + 2u;
					m = m << 1u;
				}
				qOffset = qOffset + 32u;
			}
		}`,dequant_q4_1:`
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
			let base=blk*20u;
			let d=f16(gb(base)|(gb(base+1u)<<8u));
			let m=f16(gb(base+2u)|(gb(base+3u)<<8u));
			let ob=blk*32u;
			for(var j=0u;j<16u;j=j+1u){
				let qsj=gb(base+4u+j);
				o[ob+j]     = d*f32(qsj&0xFu) + m;
				o[ob+j+16u] = d*f32(qsj>>4u) + m;
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
		}`,qwen35_ssm_conv:`
		struct ConvParams { D: u32, kernelSize: u32 };
		@group(0) @binding(0) var<uniform> p: ConvParams;
		@group(0) @binding(1) var<storage, read> x: array<f32>;
		@group(0) @binding(2) var<storage, read> w: array<f32>;
		@group(0) @binding(3) var<storage, read_write> convState: array<f32>;
		@group(0) @binding(4) var<storage, read_write> out: array<f32>;
		@compute @workgroup_size(64, 1, 1)
		fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
			let d = gid.x;
			if (d >= p.D) { return; }
			var acc: f32 = 0.0;
			acc = acc + convState[0u * p.D + d] * w[0u * p.D + d];
			acc = acc + convState[1u * p.D + d] * w[1u * p.D + d];
			acc = acc + convState[2u * p.D + d] * w[2u * p.D + d];
			acc = acc + x[d] * w[3u * p.D + d];
			convState[0u * p.D + d] = convState[1u * p.D + d];
			convState[1u * p.D + d] = convState[2u * p.D + d];
			convState[2u * p.D + d] = x[d];
			out[d] = acc / (1.0 + exp(-acc));
		}`,qwen35_deltanet_step:`
		struct DeltaParams { Sk: u32, Sv: u32, numHeads: u32 };
		@group(0) @binding(0) var<uniform> p: DeltaParams;
		@group(0) @binding(1) var<storage, read> q: array<f32>;
		@group(0) @binding(2) var<storage, read> k: array<f32>;
		@group(0) @binding(3) var<storage, read> v: array<f32>;
		@group(0) @binding(4) var<storage, read> decay: array<f32>;
		@group(0) @binding(5) var<storage, read> beta: array<f32>;
		@group(0) @binding(6) var<storage, read_write> S: array<f32>;
		@group(0) @binding(7) var<storage, read_write> out: array<f32>;
		@compute @workgroup_size(64, 1, 1)
		fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
			let j = gid.x;
			let h = gid.y;
			if (j >= p.Sv || h >= p.numHeads) { return; }
			let g = exp(decay[h]);
			let b = beta[h];
			let headStateOffset = h * (p.Sk * p.Sv);
			let headKOffset = h * p.Sk;
			let headVOffset = h * p.Sv;

			var sk: f32 = 0.0;
			for (var i: u32 = 0u; i < p.Sk; i = i + 1u) {
				let sIdx = headStateOffset + i * p.Sv + j;
				sk = sk + (S[sIdx] * g) * k[headKOffset + i];
			}

			let d = (v[headVOffset + j] - sk) * b;

			var o: f32 = 0.0;
			for (var i: u32 = 0u; i < p.Sk; i = i + 1u) {
				let sIdx = headStateOffset + i * p.Sv + j;
				let sNew = S[sIdx] * g + k[headKOffset + i] * d;
				S[sIdx] = sNew;
				o = o + sNew * q[headKOffset + i];
			}
			out[headVOffset + j] = o;
		}`},Xr=`
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
	}`});var mt,Zr=se(()=>{"use strict";mt=class{constructor(e){this.sets=[];this.cur=0;this.next=0;this.names=[];this.acc=new Map;this.dropped=0;this.pending=[];this.fenetre=0;this.device=e;let r=globalThis;for(let t=0;t<2;t++)this.sets.push({qs:e.createQuerySet({type:"timestamp",count:4096}),resolve:e.createBuffer({size:4096*8,usage:r.GPUBufferUsage.QUERY_RESOLVE|r.GPUBufferUsage.COPY_SRC}),read:e.createBuffer({size:4096*8,usage:r.GPUBufferUsage.COPY_DST|r.GPUBufferUsage.MAP_READ}),busy:!1})}slot(e){if(this.next+2>4096&&(this.rotate(),this.next+2>4096))return this.dropped++,null;let r=this.sets[this.cur];if(r.busy)return this.dropped++,null;let t=this.next;return this.next+=2,this.names.push(e),{querySet:r.qs,beginningOfPassWriteIndex:t,endOfPassWriteIndex:t+1}}rotate(){let e=this.cur,r=this.sets[e],t=this.names,n=this.next;if(this.cur=(this.cur+1)%2,this.next=0,this.names=[],!n||r.busy)return;r.busy=!0;let s=this.fenetre,i=this.device.createCommandEncoder();i.resolveQuerySet(r.qs,0,n,r.resolve,0),i.copyBufferToBuffer(r.resolve,0,r.read,0,n*8),this.device.queue.submit([i.finish()]);let a=globalThis,o=r.read.mapAsync(a.GPUMapMode.READ,0,n*8).then(()=>{let u=new BigUint64Array(r.read.getMappedRange(0,n*8).slice(0));if(r.read.unmap(),s===this.fenetre)for(let c=0;c<t.length;c++){let f=u[c*2],d=u[c*2+1];if(!f||!d||d<=f)continue;let p=Number(d-f),g=this.acc.get(t[c]);g?(g.calls++,g.ns+=p):this.acc.set(t[c],{calls:1,ns:p})}}).catch(()=>{}).finally(()=>{r.busy=!1});this.pending.push(o)}async report(){this.rotate();let e=this.pending;this.pending=[],await Promise.all(e);let r=0,t=0;for(let s of this.acc.values())r+=s.ns,t+=s.calls;return{passes:[...this.acc.entries()].map(([s,i])=>({name:s,calls:i.calls,totalMs:i.ns/1e6,meanUs:i.ns/i.calls/1e3,share:r?i.ns/r:0,reliable:i.calls>=50})).sort((s,i)=>i.totalMs-s.totalMs),totalMs:r/1e6,samples:t,dropped:this.dropped,quantumUs:100}}reset(){this.fenetre++,this.acc.clear(),this.dropped=0}destroy(){for(let e of this.sets)try{e.qs.destroy(),e.resolve.destroy(),e.read.destroy()}catch{}this.sets=[]}}});function Ps(){if(en!==null)return en;try{let l=globalThis.__brimkernSearch;if(typeof l=="string")return l}catch{}try{return typeof location<"u"?location.search:""}catch{return""}}function re(l){try{return new URLSearchParams(Ps()).get(l)}catch{return null}}var en,Kt=se(()=>{"use strict";en=null});function we(l){let e=l>>15&1,r=l>>10&31,t=l&1023,n;return r===0?n=t*59604645e-15:r===31?n=65504:n=(1+t/1024)*2**(r-15),e===1?-n:n}function qe(l){let e=new Float32Array(1),r=new Uint32Array(e.buffer);e[0]=l;let t=r[0],n=t>>16&32768,s=(t>>23&255)-127+15,i=t&8388607;return s<=0?n:s>=31?n|31743:(i=(i>>13)+(i>>12&1),i===1024&&(i=0,s+=1),n|s<<10|i&1023)}function _s(l,e){let r=new Float32Array(e*256),t=new DataView(l.buffer,l.byteOffset);for(let n=0;n<e;n++){let s=n*144,i=we(t.getUint16(s,!0)),a=we(t.getUint16(s+2,!0)),o=d=>{let p=g=>l[s+4+g];return d<4?[p(d)&63,p(d+4)&63]:[p(d+4)&15|p(d-4)>>6<<4,p(d+4)>>4|p(d)>>6<<4]},u=n*256,c=0,f=0;for(let d=0;d<256;d+=64){let[p,g]=o(c),m=i*p,b=a*g,[v,_]=o(c+1),B=i*v,q=a*_;for(let C=0;C<32;C++){let j=l[s+16+f+C];r[u+d+C]=m*(j&15)-b,r[u+d+32+C]=B*(j>>4)-q}f+=32,c+=2}}return r}function Xe(l){return l>127?l-256:l}function Us(l,e){let r=new Float32Array(e*32),t=new DataView(l.buffer,l.byteOffset);for(let n=0;n<e;n++){let s=n*34,i=we(t.getUint16(s,!0));for(let a=0;a<32;a++)r[n*32+a]=i*Xe(l[s+2+a])}return r}function Gs(l,e){let r=new Float32Array(e*32),t=new DataView(l.buffer,l.byteOffset);for(let n=0;n<e;n++){let s=n*22,i=we(t.getUint16(s,!0)),a=t.getUint32(s+2,!0);for(let o=0;o<16;o++){let u=l[s+6+o],c=a>>>o<<4&16,f=a>>>o+12&16;r[n*32+o]=i*((u&15|c)-16),r[n*32+o+16]=i*((u>>4|f)-16)}}return r}function Bs(l,e){let r=new Float32Array(e*32),t=new DataView(l.buffer,l.byteOffset);for(let n=0;n<e;n++){let s=n*18,i=we(t.getUint16(s,!0));for(let a=0;a<16;a++){let o=l[s+2+a];r[n*32+a]=i*((o&15)-8),r[n*32+a+16]=i*((o>>4)-8)}}return r}function qs(l,e){let r=new Float32Array(e*256),t=new DataView(l.buffer,l.byteOffset);for(let n=0;n<e;n++){let s=n*176,i=we(t.getUint16(s,!0)),a=we(t.getUint16(s+2,!0)),o=g=>{let m=b=>l[s+4+b];return g<4?[m(g)&63,m(g+4)&63]:[m(g+4)&15|m(g-4)>>6<<4,m(g+4)>>4|m(g)>>6<<4]},u=n*256,c=0,f=0,d=1,p=2;for(let g=0;g<256;g+=64){let[m,b]=o(c),v=i*m,_=a*b,[B,q]=o(c+1),C=i*B,j=a*q;for(let x=0;x<32;x++){let k=l[s+48+f+x],w=l[s+16+x];r[u+g+x]=v*((k&15)+(w&d?16:0))-_,r[u+g+32+x]=C*((k>>4)+(w&p?16:0))-j}f+=32,c+=2,d<<=2,p<<=2}}return r}function Fs(l,e){let r=new Float32Array(e*256),t=new DataView(l.buffer,l.byteOffset);for(let n=0;n<e;n++){let s=n*210,i=we(t.getUint16(s+208,!0)),a=n*256;for(let o=0;o<2;o++){let u=s+o*64,c=s+128+o*32,f=s+192+o*8,d=a+o*128;for(let p=0;p<32;p++){let g=p/16|0,m=l[u+p],b=l[u+p+32],v=l[c+p],_=(m&15|(v>>0&3)<<4)-32,B=(b&15|(v>>2&3)<<4)-32,q=(m>>4|(v>>4&3)<<4)-32,C=(b>>4|(v>>6&3)<<4)-32;r[d+p]=i*Xe(l[f+g])*_,r[d+p+32]=i*Xe(l[f+g+2])*B,r[d+p+64]=i*Xe(l[f+g+4])*q,r[d+p+96]=i*Xe(l[f+g+6])*C}}}return r}function zt(l,e){let n=new Float32Array(e*256),s=0,i=new DataView(l.buffer,l.byteOffset);for(let a=0;a<e;a++){let o=a*110,u=we(i.getUint16(o+108,!0)),c=new Int32Array(4);for(let v=0;v<3;v++)c[v]=l[o+96+v*4]|l[o+96+v*4+1]<<8|l[o+96+v*4+2]<<16|l[o+96+v*4+3]<<24;let f=c[2];c[2]=c[0]>>>4&252645135|(f>>>4&50529027)<<4,c[3]=c[1]>>>4&252645135|(f>>>6&50529027)<<4,c[0]=c[0]&252645135|(f>>>0&50529027)<<4,c[1]=c[1]&252645135|(f>>>2&50529027)<<4;let d=new Int8Array(c.buffer),p=0,g=o+32,m=o,b=1;for(let v=0;v<256;v+=128){let _=0;for(let B=0;B<4;B++){let q=u*(d[p++]-32);for(let j=0;j<16;j++){let x=l[g+j]>>>_&3,k=l[m+j]&b?0:4;n[s++]=q*(x-k)}let C=u*(d[p++]-32);for(let j=0;j<16;j++){let x=l[g+16+j]>>>_&3,k=l[m+16+j]&b?0:4;n[s++]=C*(x-k)}_+=2,b=b<<1&255}g+=32}}return n}function Ht(l,e){let r=new Float32Array(e*32),t=new DataView(l.buffer,l.byteOffset);for(let n=0;n<e;n++){let s=n*20,i=we(t.getUint16(s,!0)),a=we(t.getUint16(s+2,!0)),o=n*32;for(let u=0;u<16;u++){let c=l[s+4+u];r[o+u]=(c&15)*i+a,r[o+u+16]=(c>>4)*i+a}}return r}function Ee(l,e,r,t,n){let s=new Float32Array(r*n);for(let i=0;i<r;i++)for(let a=0;a<n;a++){let o=0;for(let u=0;u<t;u++)o+=l[i*t+u]*e[u*n+a];s[i*n+a]=o}return s}function Re(l,e,r,t,n=1e-5,s=!1){let i=new Float32Array(r*t);for(let a=0;a<r;a++){let o=0;for(let c=0;c<t;c++)o+=l[a*t+c]**2;let u=1/Math.sqrt(o/t+n);for(let c=0;c<t;c++)i[a*t+c]=l[a*t+c]*u*(s?1+e[c]:e[c])}return i}function Ss(l,e,r,t,n,s,i){let a=new Float32Array(l.length),o=t/2,u=s[0],c=s[0]+s[1];for(let f=0;f<r;f++){let d=Math.floor(f/n),p=f*t;for(let g=0;g<o;g++){let m=g<u?0:g<c?1:2,v=e[d*3+m]/i**(2*g/t),_=Math.cos(v),B=Math.sin(v),q=l[p+g],C=l[p+g+o];a[p+g]=q*_-C*B,a[p+g+o]=C*_+q*B}}return a}function ht(l,e,r,t,n=0,s=1e4,i){let a=new Float32Array(l.length),o=r/2;for(let u=0;u<e;u++){let c=n+Math.floor(u/t),f=u*r;for(let d=0;d<o;d++){let p=c/(s**(2*d/r)*(i?i[d]:1)),g=Math.cos(p),m=Math.sin(p),b=l[f+2*d],v=l[f+2*d+1];a[f+2*d]=b*g-v*m,a[f+2*d+1]=v*g+b*m}}return a}function Ts(l,e,r,t,n,s=0,i=1e4){let a=new Float32Array(l.length),o=t/2;for(let u=0;u<r;u++){let c=s+Math.floor(u/n),f=u*t;for(let d=0;d<o;d++){let p=c/(i**(2*d/t)*e[d]),g=Math.cos(p),m=Math.sin(p),b=l[f+d],v=l[f+d+o];a[f+d]=b*g-v*m,a[f+d+o]=v*g+b*m}}return a}function Je(l,e,r,t,n=0,s=1e4){let i=new Float32Array(l.length),a=r/2;for(let o=0;o<e;o++){let u=n+Math.floor(o/t),c=o*r;for(let f=0;f<a;f++){let d=u/s**(2*f/r),p=Math.cos(d),g=Math.sin(d),m=l[c+f],b=l[c+f+a];i[c+f]=m*p-b*g,i[c+f+a]=b*p+m*g}}return i}function Nt(l,e,r){return l.map((t,n)=>t+e[n%r])}function Qt(l,e,r,t=!0){let n=t?l.windowPerLayer?.[r]??l.window??0:0,s=l.ropeThetaPerLayer?.[r]??l.ropeTheta,i=l.skipRopePerLayer?.[r]??l.skipRope??!1;return{...l,seq:e,window:n,ropeTheta:s,skipRope:i}}function Ae(l,e,r,t,n,s,i,a=0,o,u=0,c=0){let f=new Float32Array(t*n*i),d=o??1/Math.sqrt(i),p=m=>u>0?u*Math.tanh(m/u):m,g=n/s;for(let m=0;m<t;m++)for(let b=0;b<n;b++){let v=Math.floor(b/g),_=(m*n+b)*i,B=a+m,q=c>0?Math.max(0,B+1-c):0,C=[],j=-1/0;for(let k=q;k<=B;k++){let w=(k*s+v)*i,h=0;for(let y=0;y<i;y++)h+=l[_+y]*e[w+y];let A=p(h*d);C[k]=A,A>j&&(j=A)}let x=0;for(let k=q;k<=B;k++)C[k]=Math.exp(C[k]-j),x+=C[k];for(let k=q;k<=B;k++){let w=C[k]/x,h=(k*s+v)*i;for(let A=0;A<i;A++)f[_+A]+=w*r[h+A]}}return f}function tn(l){return .5*l*(1+Math.tanh(.7978845608*(l+.044715*l*l*l)))}function Wt(l,e,r){let{seq:t,d:n,nHeads:s,nKvHeads:i,headDim:a,ffn:o,ropeTheta:u,eps:c}=e,f=i*a,d=s*a,p=e.rmsGainOnePlus===!0,g=e.attnLogitSoftcap??0,m=Re(l,r.attnNorm,t,n,c,p),b=Ee(m,r.wq,t,n,d),v=Ee(m,r.wk,t,n,f),_=Ee(m,r.wv,t,n,f);r.bq&&(b=Nt(b,r.bq,d)),r.bk&&(v=Nt(v,r.bk,f)),r.bv&&(_=Nt(_,r.bv,f)),r.qNorm&&(b=Re(b,r.qNorm,t*s,a,c,p)),r.kNorm&&(v=Re(v,r.kNorm,t*i,a,c,p));let B=Je(b,t*s,a,s,0,u),q=Je(v,t*i,a,i,0,u),C=Ae(B,q,_,t,s,i,a,0,e.attnScale,g),j=Ee(C,r.wo,t,d,n);r.postAttnNorm&&(j=Re(j,r.postAttnNorm,t,n,c,p));let x=l.map((P,U)=>P+j[U]),k=Re(x,r.ffnNorm,t,n,c,p),w=Ee(k,r.wgate,t,n,o),h=Ee(k,r.wup,t,n,o),A=e.act==="gelu"?w.map((P,U)=>tn(P)*h[U]):w.map((P,U)=>P/(1+Math.exp(-P))*h[U]),y=Ee(A,r.wdown,t,o,n);return r.postFfnNorm&&(y=Re(y,r.postFfnNorm,t,n,c,p)),x.map((P,U)=>P+y[U])}var ue,ee,bt,rn=se(()=>{"use strict";$e();Ve();Ye();Jr();Zr();Kt();ue=64,ee=class ee{constructor(){this.device=null;this.modules={};this.pipelines={};this.maxStorageBufferBindingSize=0;this.hasF16=!1;this.validationFailure=null;this.lost=!1;this.onLost=null;this.attnDecodeOk=!0;this.attnPrefillOk=!0;this.attnFullWgOk=!0;this.mropeOk=!0;this.rwkvWkv7Ok=!0;this.lfm2ShortConvOk=!0;this.qwen35SsmOk=!0;this.lfm2ResidentOk=!0;this.lfm2BatchOk=!0;this.swaOk=!0;this.rwkvResidentOk=!0;this.videoOk=!0;this.videoResidentOk=!0;this.f16SharedOk=!0;this.qSharedOk=!0;this.qShared2Ok=!0;this.gemvOk=!0;this.rmsVecOk=!0;this.convS2Ok=!0;this.hasSubgroups=!1;this.subgroupsOk=!0;this.topKParOk=!0;this.dequantQ3kOk=!0;this.dequantQ41Ok=!0;this.profiler=null;this.bufferPool=new Map;this.poolSize=new WeakMap;this.pooled=new WeakSet;this.uniformPool=new Map;this.uniformSize=new WeakMap;this.convTiledOk=!0;this.convTiledQOk=!0;this.kvGpu=new Map;this.topKOk=!0;this.kvSession="";this.kvQuant=!1;this.lfm2KvGpu=new Map;this.lfm2ConvGpu=new Map;this.lfm2Session="";this.rwkvStateGpu=new Map;this.rwkvVFirst=null;this.rwkvSession=""}async init(){let e=navigator.gpu;if(!e)return!1;let r=await e.requestAdapter();if(!r)return!1;let t=r.limits,n={maxStorageBufferBindingSize:t.maxStorageBufferBindingSize,maxBufferSize:t.maxBufferSize},s=[];try{r.features?.has("shader-f16")&&s.push("shader-f16")}catch{}try{r.features?.has("subgroups")&&s.push("subgroups")}catch{}try{ee.profileOn&&r.features?.has("timestamp-query")&&s.push("timestamp-query")}catch{}try{this.device=await r.requestDevice({requiredLimits:n,requiredFeatures:s})}catch{try{this.device=await r.requestDevice({requiredLimits:n})}catch{this.device=await r.requestDevice()}}this.maxStorageBufferBindingSize=this.device.limits?.maxStorageBufferBindingSize??134217728,this.hasF16=!!this.device.features?.has?.("shader-f16"),this.hasSubgroups=!!this.device.features?.has?.("subgroups"),ee.profileOn&&(this.device.features?.has?.("timestamp-query")?(this.profiler=new mt(this.device),console.info("[webgpu] profilage par passe ACTIF (?gpuprofile=1) : __gpuProfile() pour le rapport")):console.warn("[webgpu] ?gpuprofile=1 demand\xE9 mais la feature timestamp-query est ABSENTE de cet adapter : aucune mesure ne sera prise."));try{re("attndecode")==="0"&&(this.attnDecodeOk=!1,console.warn("[webgpu] attention d\xE9codage COUP\xC9E par ?attndecode=0 : kernels classiques")),re("attnfullwg")==="0"&&(this.attnFullWgOk=!1,console.warn("[webgpu] attention_full workgroup COUP\xC9E par ?attnfullwg=0 : kernel classique")),re("attnprefill")==="0"&&(this.attnPrefillOk=!1,console.warn("[webgpu] attention prefill tuil\xE9e COUP\xC9E par ?attnprefill=0 : kernel classique")),re("rmsvec")==="0"&&(this.rmsVecOk=!1,console.warn("[webgpu] RMSNorm parall\xE8le COUP\xC9E par ?rmsvec=0 : kernel une-ligne-par-thread")),re("topkpar")==="0"&&(this.topKParOk=!1,console.warn("[webgpu] top-K parall\xE8le COUP\xC9E par ?topkpar=0 : s\xE9lection finale sur un seul thread")),re("rwkv")==="0"&&(this.rwkvWkv7Ok=!1,console.warn("[webgpu] kernel RWKV-7 WKV COUP\xC9 par ?rwkv=0")),re("lfm2")==="0"&&(this.lfm2ShortConvOk=!1,console.warn("[webgpu] kernel shortconv LFM2 COUP\xC9 par ?lfm2=0")),re("lfm2resident")==="0"&&(this.lfm2ResidentOk=!1,console.warn("[webgpu] LFM2 r\xE9sident COUP\xC9 par ?lfm2resident=0 : forwardToken JS+readback")),re("lfm2batch")==="0"&&(this.lfm2BatchOk=!1,console.warn("[webgpu] prefill LFM2 batch\xE9 COUP\xC9 par ?lfm2batch=0 : token par token")),re("convs2")==="0"&&(this.convS2Ok=!1,console.warn("[webgpu] conv2d 3\xD73 stride-2 tuil\xE9 COUP\xC9 par ?convs2=0 : repli sur direct")),re("subgroups")==="0"&&(this.subgroupsOk=!1,console.warn("[webgpu] subgroups COUP\xC9 par ?subgroups=0 : repli sur shared memory")),re("swa")==="0"&&(this.swaOk=!1,console.warn("[webgpu] fen\xEAtre glissante COUP\xC9E par ?swa=0 : attention causale pleine sur toutes les couches")),re("rwkvresident")==="0"&&(this.rwkvResidentOk=!1,console.warn("[webgpu] RWKV r\xE9sident COUP\xC9 par ?rwkvresident=0 : forwardToken JS+readback")),re("video")==="0"&&(this.videoOk=!1,console.warn("[webgpu] chemin vid\xE9o (module motion) COUP\xC9 par ?video=0")),re("qwen35ssm")==="0"&&(this.qwen35SsmOk=!1,console.warn("[webgpu] kernel Qwen 3.5 SSM COUP\xC9 par ?qwen35ssm=0")),re("f16shared")==="0"&&(this.f16SharedOk=!1,console.warn("[webgpu] GEMM f16 tuil\xE9 COUP\xC9 par ?f16shared=0 : matmul_t_f16w pour tous les m")),re("gemv")==="0"&&(this.gemvOk=!1,console.warn("[webgpu] GEMV de d\xE9codage COUP\xC9 par ?gemv=0 : kernels par lignes")),re("qshared")==="0"&&(this.qSharedOk=!1,console.warn("[webgpu] GEMM q8/q4 tuil\xE9s COUP\xC9S par ?qshared=0 : kernels 4 lignes/invocation")),re("qshared2")==="0"&&(this.qShared2Ok=!1,console.warn("[webgpu] GEMM q8/q4 v2 (bloc 4\xD78 vec4) COUP\xC9S par ?qshared2=0 : tuile 32\xD764 v1")),re("convtq")==="0"&&(this.convTiledQOk=!1,console.warn("[webgpu] conv 3\xD73 tuil\xE9 q8/q4 COUP\xC9 par ?convtq=0 : conv2d_direct_q8/q4 (plus lent, m\xEAme r\xE9sultat)")),re("videoresident")==="0"&&(this.videoResidentOk=!1,console.warn("[webgpu] motion r\xE9sident COUP\xC9 par ?videoresident=0 : chemin JS+readback")),re("dequantq3k")==="0"&&(this.dequantQ3kOk=!1,console.warn("[webgpu] d\xE9quantification GPU Q3_K COUP\xC9E par ?dequantq3k=0 : repli CPU")),re("dequantq41")==="0"&&(this.dequantQ41Ok=!1,console.warn("[webgpu] d\xE9quantification GPU Q4_1 COUP\xC9E par ?dequantq41=0 : repli CPU"))}catch{}this.device.lost?.then?.(i=>{this.lost=!0,console.warn("[webgpu] device GPU perdu :",i?.reason||"unknown",i?.message||""),this.onLost?.(i)});for(let[i,a]of Object.entries(Yr))this.modules[i]=this.device.createShaderModule({code:a});return this.hasF16&&(this.modules.matmul_t_f16w=this.device.createShaderModule({code:Xr})),!0}buf(e,r){let t=this.device.createBuffer({size:e.byteLength,usage:r});return this.device.queue.writeBuffer(t,0,e),t}bufU32(e,r){let t=this.device.createBuffer({size:e.byteLength,usage:r});return this.device.queue.writeBuffer(t,0,e),t}async readBack(e,r){let t=globalThis,n=this.device.createBuffer({size:r,usage:t.GPUBufferUsage.COPY_DST|t.GPUBufferUsage.MAP_READ}),s=this.device.createCommandEncoder();s.copyBufferToBuffer(e,0,n,0,r),this.device.queue.submit([s.finish()]),await n.mapAsync(t.GPUMapMode.READ);let i=new Float32Array(n.getMappedRange().slice(0));return n.unmap(),n.destroy(),i}async readBackBytes(e,r){let t=globalThis,n=Math.ceil(r/4)*4,s=this.device.createBuffer({size:n,usage:t.GPUBufferUsage.COPY_DST|t.GPUBufferUsage.MAP_READ}),i=this.device.createCommandEncoder();i.copyBufferToBuffer(e,0,s,0,n),this.device.queue.submit([i.finish()]),await s.mapAsync(t.GPUMapMode.READ);let a=new Uint8Array(s.getMappedRange().slice(0,r));return s.unmap(),s.destroy(),a}async quantizeToBytes(e,r,t,n,s){let i=t/32,a=n==="q8"?new Uint8Array(t+i*2):new Uint8Array(t/2+i*4),o=ee.BLOCK_ELEMS[e]??1,u=t/o,c=r.byteLength/u,f=(m,b)=>b===0?m:f(b,m%b),d=o*32/f(o,32),p=Math.floor(this.maxStorageBufferBindingSize*.9/4),g=s??p;g=Math.max(d,Math.floor(g/d)*d);for(let m=0;m<t;m+=g){let b=Math.min(g,t-m),v=r.slice(m/o*c,(m+b)/o*c),_=this.dequantizeToGpu(e,v,b);try{if(n==="q8"){let{codes:B,sc:q}=this.f32ToQ8Gpu(_,b),C=await this.readBackBytes(B,b),j=await this.readBackBytes(q,b/32*2);B.destroy?.(),q.destroy?.(),a.set(C,m),a.set(j,t+m/32*2)}else{let{nib:B,sc:q,mn:C}=this.f32ToQ4Gpu(_,b),j=await this.readBackBytes(B,b/2),x=await this.readBackBytes(q,b/32*2),k=await this.readBackBytes(C,b/32*2);B.destroy?.(),q.destroy?.(),C.destroy?.(),a.set(j,m/2),a.set(x,t/2+m/32*2),a.set(k,t/2+i*2+m/32*2)}}finally{_.destroy?.()}}return a}pipeline(e){let r=this.pipelines[e];return r||(r=this.device.createComputePipeline({layout:"auto",compute:{module:this.modules[e],entryPoint:"main"}}),this.pipelines[e]=r),r}grid1D(e){let r=Math.ceil(e/ue);if(r<=ee.MAX_WG_DIM)return[r,1,1];let t=ee.MAX_WG_DIM;return[t,Math.ceil(r/t),1]}recordPass(e,r,t,n){let s=this.pipeline(r),i=this.device.createBindGroup({layout:s.getBindGroupLayout(0),entries:t.map((u,c)=>({binding:c,resource:{buffer:u}}))}),a=this.profiler?.slot(r),o=e.beginComputePass(a?{timestampWrites:a}:void 0);o.setPipeline(s),o.setBindGroup(0,i),o.dispatchWorkgroups(...n),o.end()}dispatch(e,r,t){let n=this.device.createCommandEncoder();this.recordPass(n,e,r,t),this.device.queue.submit([n.finish()])}async run(e,r,t,n,s){return this.dispatch(e,r,t),this.readBack(n,s)}isF32(e){return e instanceof Float32Array}async matmul(e,r,t,n,s){let i=globalThis,a=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([t,n,s]));let u=this.isF32(r)?this.buf(r,a):r,c=this.device.createBuffer({size:t*s*4,usage:a|i.GPUBufferUsage.COPY_SRC});return this.run("matmul",[o,this.buf(e,a),u,c],[Math.ceil(t/8),Math.ceil(s/8),1],c,t*s*4)}async matmulT(e,r,t,n,s,i=!1){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([t,n,s]));let c=this.isF32(r)?this.buf(r,o):r,f=this.device.createBuffer({size:t*s*4,usage:o|a.GPUBufferUsage.COPY_SRC}),d=this.matmulTPlan(t,n,s,i);return this.run(d.shader,[u,this.buf(e,o),c,f],d.grid,f,t*s*4)}matmulTPlan(e,r,t,n){return n&&this.hasF16?this.f16SharedOk&&e>=32&&r%4===0?{shader:"matmul_t_f16w_shared",grid:[Math.ceil(t/64),Math.ceil(e/32),1]}:{shader:"matmul_t_f16w",grid:[Math.ceil(e/8),Math.ceil(t/8),1]}:{shader:r%4===0?"matmul_t_vec4":"matmul_t",grid:[Math.ceil(e/8),Math.ceil(t/8),1]}}async rmsnorm(e,r,t,n,s=1e-5,i=!1){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([t,n])),this.device.queue.writeBuffer(u,8,new Float32Array([s])),this.device.queue.writeBuffer(u,12,new Uint32Array([i?1:0]));let c=this.device.createBuffer({size:e.byteLength,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("rmsnorm",[u,this.buf(e,o),this.buf(r,o),c],[Math.ceil(t/ue),1,1],c,e.byteLength)}async topKReadback(e,r,t){let n=globalThis,s=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST,i=this.device.createBuffer({size:8,usage:n.GPUBufferUsage.UNIFORM|n.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(i,0,new Uint32Array([e.length,r]));let a=this.device.createBuffer({size:r*2*4,usage:s|n.GPUBufferUsage.COPY_SRC}),o=this.device.createBuffer({size:r*2*4,usage:n.GPUBufferUsage.COPY_DST|n.GPUBufferUsage.MAP_READ}),u=this.device.createCommandEncoder(),c=this.buf(e,s);this.recordPass(u,t,[i,c,a],[1,1,1]),u.copyBufferToBuffer(a,0,o,0,r*2*4),this.device.queue.submit([u.finish()]),await o.mapAsync(n.GPUMapMode.READ);let f=new Uint32Array(o.getMappedRange().slice(0));return o.unmap(),o.destroy(),a.destroy?.(),i.destroy?.(),c.destroy?.(),f}async rmsnormVec(e,r,t,n,s=1e-5,i=!1,a="rmsnorm_vec"){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([t,n])),this.device.queue.writeBuffer(c,8,new Float32Array([s])),this.device.queue.writeBuffer(c,12,new Uint32Array([i?1:0]));let f=this.device.createBuffer({size:e.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run(a,[c,this.buf(e,u),this.buf(r,u),f],[t,1,1],f,e.byteLength)}async binary(e,r,t){let n=globalThis,s=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST,i=this.device.createBuffer({size:r.byteLength,usage:s|n.GPUBufferUsage.COPY_SRC});return this.run(e,[this.buf(r,s),this.buf(t,s),i],this.grid1D(r.length),i,r.byteLength)}swiglu(e,r){return this.binary("swiglu",e,r)}geglu(e,r){return this.binary("geglu",e,r)}add(e,r){return this.binary("add",e,r)}async silu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("silu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async groupNorm(e,r,t,n,s,i,a=1e-5,o="group_norm"){let u=globalThis,c=u.GPUBufferUsage.STORAGE|u.GPUBufferUsage.COPY_DST,f=this.device.createBuffer({size:16,usage:u.GPUBufferUsage.UNIFORM|u.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(f,0,new Uint32Array([n,s,i])),this.device.queue.writeBuffer(f,12,new Float32Array([a]));let d=this.device.createBuffer({size:e.byteLength,usage:c|u.GPUBufferUsage.COPY_SRC});return this.run(o,[f,this.buf(e,c),this.buf(r,c),this.buf(t,c),d],[i,1,1],d,e.byteLength)}async conv2d(e,r,t,n,s,i,a,o,u,c=1,f=0){let d=globalThis,p=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,g=Math.floor((s+2*f-o)/c)+1,m=Math.floor((i+2*f-u)/c)+1,b=n*o*u,v=g*m;if(b*v*4>this.maxStorageBufferBindingSize*.9)return this.conv2dDirect(e,r,t,n,s,i,a,o,u,c,f);let _=this.device.createBuffer({size:48,usage:d.GPUBufferUsage.UNIFORM|d.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(_,0,new Uint32Array([n,s,i,o,u,c,f,g,m]));let B=this.device.createBuffer({size:b*v*4,usage:p|d.GPUBufferUsage.COPY_SRC});this.dispatch("im2col",[_,this.buf(e,p),B],this.grid1D(b*v));let q=await this.matmul(r,B,a,b,v);if(B.destroy?.(),_.destroy?.(),t)for(let C=0;C<a;C++){let j=t[C];for(let x=0;x<v;x++)q[C*v+x]+=j}return q}async conv2dDirect(e,r,t,n,s,i,a,o,u,c=1,f=0){let d=globalThis,p=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,g=Math.floor((s+2*f-o)/c)+1,m=Math.floor((i+2*f-u)/c)+1,b=a*g*m,v=this.device.createBuffer({size:48,usage:d.GPUBufferUsage.UNIFORM|d.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(v,0,new Uint32Array([n,s,i,a,o,u,c,f,g,m]));let _=t??new Float32Array(a),B=this.device.createBuffer({size:b*4,usage:p|d.GPUBufferUsage.COPY_SRC});return this.run("conv2d_direct",[v,this.buf(e,p),this.buf(r,p),this.buf(_,p),B],this.grid1D(b),B,b*4)}async layernorm(e,r,t,n,s,i=1e-5){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s])),this.device.queue.writeBuffer(u,8,new Float32Array([i]));let c=this.device.createBuffer({size:e.byteLength,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("layernorm",[u,this.buf(e,o),this.buf(r,o),this.buf(t,o),c],[Math.ceil(n/ue),1,1],c,e.byteLength)}async quickGelu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("quick_gelu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async gelu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("gelu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async relu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("relu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async upsampleNearest(e,r,t,n,s=2){let i=globalThis,a=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=t*s,u=n*s,c=r*o*u,f=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(f,0,new Uint32Array([r,t,n,s]));let d=this.device.createBuffer({size:c*4,usage:a|i.GPUBufferUsage.COPY_SRC});return this.run("upsample_nearest",[f,this.buf(e,a),d],this.grid1D(c),d,c*4)}async upscale2x(e,r,t,n,s=.5){let i=t*2,a=n*2,o=this.recordingSession(),u=this.uploadGpu(e),c=o.upscale2x(u,r,t,n,s),f=await o.finish(c,r*i*a);return this.releaseGpu([u]),f}async rope(e,r,t,n,s=0,i=1e4,a=!1){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:32,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([r,t,n,s])),this.device.queue.writeBuffer(c,16,new Float32Array([i]));let f=this.device.createBuffer({size:e.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.device.queue.writeBuffer(c,20,new Uint32Array([a?1:0])),this.run("rope",[c,this.buf(e,u),f],[Math.ceil(r/ue),1,1],f,e.byteLength)}async ropeFactors(e,r,t,n,s,i=0,a=1e4,o=!1){let u=globalThis,c=u.GPUBufferUsage.STORAGE|u.GPUBufferUsage.COPY_DST,f=this.device.createBuffer({size:32,usage:u.GPUBufferUsage.UNIFORM|u.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(f,0,new Uint32Array([t,n,s,i])),this.device.queue.writeBuffer(f,16,new Float32Array([a]));let d=this.device.createBuffer({size:r.byteLength,usage:c});this.device.queue.writeBuffer(d,0,r);let p=this.device.createBuffer({size:e.byteLength,usage:c|u.GPUBufferUsage.COPY_SRC});return this.device.queue.writeBuffer(f,20,new Uint32Array([o?1:0])),this.run("rope_factors",[f,this.buf(e,c),d,p],[Math.ceil(t/ue),1,1],p,e.byteLength)}async ropeMrope(e,r,t,n,s,i,a=1e4){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:32,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([t,n,s,i[0],i[0]+i[1]])),this.device.queue.writeBuffer(c,20,new Float32Array([a]));let f=this.device.createBuffer({size:r.byteLength,usage:u});this.device.queue.writeBuffer(f,0,r);let d=this.device.createBuffer({size:e.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("rope_mrope",[c,this.buf(e,u),f,d],[Math.ceil(t/ue),1,1],d,e.byteLength)}async rope2d(e,r,t,n,s,i=1e4){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:32,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([t,n,s,0])),this.device.queue.writeBuffer(u,16,new Float32Array([i]));let c=this.device.createBuffer({size:r.byteLength,usage:o});this.device.queue.writeBuffer(c,0,r);let f=this.device.createBuffer({size:e.byteLength,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("rope_2d",[u,this.buf(e,o),c,f],[Math.ceil(t/ue),1,1],f,e.byteLength)}async attention(e,r,t,n,s,i,a,o=0,u,c=0,f=0){let d=globalThis,p=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,g=o+n,m=this.attnUniform(n,s,i,a,g,o,u??1/Math.sqrt(a),c,f),b=n*s*a*4,v=this.device.createBuffer({size:b,usage:p|d.GPUBufferUsage.COPY_SRC});return this.run("attention",[m,this.buf(e,p),this.buf(r,p),this.buf(t,p),v],[Math.ceil(n*s/ue),1,1],v,b)}async attentionDecode(e,r,t,n,s,i,a,o=0,u,c=0,f=0){let d=globalThis,p=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,g=o+n,m=this.attnUniform(n,s,i,a,g,o,u??1/Math.sqrt(a),c,f),b=n*s*a*4,v=this.device.createBuffer({size:b,usage:p|d.GPUBufferUsage.COPY_SRC});return this.run("attention_decode",[m,this.buf(e,p),this.buf(r,p),this.buf(t,p),v],[n*s,1,1],v,b)}async attentionPrefill(e,r,t,n,s,i,a,o=0,u,c=0,f=0){let d=globalThis,p=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,g=o+n,m=this.attnUniform(n,s,i,a,g,o,u??1/Math.sqrt(a),c,f),b=n*s*a*4,v=this.device.createBuffer({size:b,usage:p|d.GPUBufferUsage.COPY_SRC});return this.run("attention_prefill",[m,this.buf(e,p),this.buf(r,p),this.buf(t,p),v],[Math.ceil(n/4)*s,1,1],v,b)}async attentionFull(e,r,t,n,s,i,a,o,u,c=0){let f=globalThis,d=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,p=this.device.createBuffer({size:32,usage:f.GPUBufferUsage.UNIFORM|f.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(p,0,new Uint32Array([n,s,i,a,o,0])),this.device.queue.writeBuffer(p,24,new Float32Array([u??1/Math.sqrt(a),c]));let g=n*s*a*4,m=this.device.createBuffer({size:g,usage:d|f.GPUBufferUsage.COPY_SRC});return this.run("attention_full",[p,this.buf(e,d),this.buf(r,d),this.buf(t,d),m],[Math.ceil(n*s/ue),1,1],m,g)}async attentionFullWg(e,r,t,n,s,i,a,o,u,c=0){let f=globalThis,d=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,p=this.device.createBuffer({size:32,usage:f.GPUBufferUsage.UNIFORM|f.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(p,0,new Uint32Array([n,s,i,a,o,0])),this.device.queue.writeBuffer(p,24,new Float32Array([u??1/Math.sqrt(a),c]));let g=n*s*a*4,m=this.device.createBuffer({size:g,usage:d|f.GPUBufferUsage.COPY_SRC});return this.run("attention_full_wg",[p,this.buf(e,d),this.buf(r,d),this.buf(t,d),m],[n*s,1,1],m,g)}async quantizeKvReadback(e,r,t,n){let s=globalThis,i=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST|s.GPUBufferUsage.COPY_SRC,a=t*n,o=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([r,t,n,0]));let u=this.device.createBuffer({size:r*a,usage:i}),c=this.device.createBuffer({size:r*t*4,usage:i});this.dispatch("quantize_kv",[o,this.buf(e,i),u,c],this.grid1D(r*t));let f=await this.readBack(u,r*a),d=new Uint32Array(f.buffer,0,r*a/4),p=await this.readBack(c,r*t*4);return u.destroy?.(),c.destroy?.(),{codes:d,scales:p}}async attentionQ8Kv(e,r,t,n,s,i,a,o,u,c=0,f,d=0,p=0){let g=globalThis,m=g.GPUBufferUsage.STORAGE|g.GPUBufferUsage.COPY_DST,b=c+i,v=this.attnUniform(i,a,o,u,b,c,f??1/Math.sqrt(u),d,p),_=i*a*u*4,B=this.device.createBuffer({size:_,usage:m|g.GPUBufferUsage.COPY_SRC});return this.run("attention_q8kv",[v,this.buf(e,m),this.bufU32(r,m),this.buf(t,m),this.bufU32(n,m),this.buf(s,m),B],[Math.ceil(i*a/ue),1,1],B,_)}async attentionQ8KvDecode(e,r,t,n,s,i,a,o,u,c=0,f,d=0,p=0){let g=globalThis,m=g.GPUBufferUsage.STORAGE|g.GPUBufferUsage.COPY_DST,b=c+i,v=this.attnUniform(i,a,o,u,b,c,f??1/Math.sqrt(u),d,p),_=i*a*u*4,B=this.device.createBuffer({size:_,usage:m|g.GPUBufferUsage.COPY_SRC});return this.run("attention_decode_q8kv",[v,this.buf(e,m),this.bufU32(r,m),this.buf(t,m),this.bufU32(n,m),this.buf(s,m),B],[i*a,1,1],B,_)}async attentionQ8KvPrefill(e,r,t,n,s,i,a,o,u,c=0,f,d=0,p=0){let g=globalThis,m=g.GPUBufferUsage.STORAGE|g.GPUBufferUsage.COPY_DST,b=c+i,v=this.attnUniform(i,a,o,u,b,c,f??1/Math.sqrt(u),d,p),_=i*a*u*4,B=this.device.createBuffer({size:_,usage:m|g.GPUBufferUsage.COPY_SRC});return this.run("attention_prefill_q8kv",[v,this.buf(e,m),this.bufU32(r,m),this.buf(t,m),this.bufU32(n,m),this.buf(s,m),B],[Math.ceil(i/4)*a,1,1],B,_)}async addBias(e,r,t,n){let s=globalThis,i=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,a=this.device.createBuffer({size:8,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(a,0,new Uint32Array([t,n]));let o=this.device.createBuffer({size:e.byteLength,usage:i|s.GPUBufferUsage.COPY_SRC});return this.run("addbias",[a,this.buf(e,i),this.buf(r,i),o],this.grid1D(e.length),o,e.byteLength)}async dequantBlocked(e,r,t,n){let s=globalThis,i=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,a=t/n;if(!Number.isInteger(a))throw new Error(`${e}: nElems ${t} not a multiple of ${n}`);let o=r.byteLength%4===0?r:(()=>{let d=new Uint8Array(Math.ceil(r.byteLength/4)*4);return d.set(r),d})(),u=new Uint32Array(o.buffer,o.byteOffset,o.byteLength/4),c=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([a]));let f=this.device.createBuffer({size:t*4,usage:i|s.GPUBufferUsage.COPY_SRC});return this.run(e,[c,this.bufU32(u,i),f],this.grid1D(a),f,t*4)}async dequantizeQ4K(e,r){return this.dequantBlocked("dequant_q4k",e,r,256)}async dequantizeByType(e,r,t){if(e==="F32")return new Float32Array(r.buffer,r.byteOffset,t);if(e==="F16"){let i=new DataView(r.buffer,r.byteOffset),a=new Float32Array(t);for(let o=0;o<t;o++)a[o]=we(i.getUint16(o*2,!0));return a}if(e==="Q4W")return ge(be(r,t));if(e==="Q8W")return he(ke(r,t));if(e==="Q3W")return Me(xe(r,t));if(e==="Q3_K"&&!this.dequantQ3kOk)return zt(r,Math.floor(t/256));if(e==="Q4_1"&&!this.dequantQ41Ok)return Ht(r,Math.floor(t/32));let n=ee.DEQUANT_SHADER[e],s=ee.BLOCK_ELEMS[e];if(!n||!s)throw new Error(`dequant: unsupported GGML type ${e}`);return this.dequantBlocked(n,r,t,s)}dequantBlockedGpu(e,r,t,n){let s=globalThis,i=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,a=t/n;if(!Number.isInteger(a))throw new Error(`${e}: nElems ${t} not a multiple of ${n}`);let o=r.byteLength%4===0?r:(()=>{let d=new Uint8Array(Math.ceil(r.byteLength/4)*4);return d.set(r),d})(),u=new Uint32Array(o.buffer,o.byteOffset,o.byteLength/4),c=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([a]));let f=this.device.createBuffer({size:t*4,usage:i});return this.dispatch(e,[c,this.bufU32(u,i),f],this.grid1D(a)),f}dequantizeToGpu(e,r,t){let n=globalThis,s=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST;if(e==="F32")return this.buf(new Float32Array(r.buffer,r.byteOffset,t),s);if(e==="F16"){let o=new DataView(r.buffer,r.byteOffset),u=new Float32Array(t);for(let c=0;c<t;c++)u[c]=we(o.getUint16(c*2,!0));return this.buf(u,s)}if(e==="Q4W")return this.buf(ge(be(r,t)),s);if(e==="Q8W")return this.buf(he(ke(r,t)),s);if(e==="Q3W")return this.buf(Me(xe(r,t)),s);if(e==="Q3_K"&&!this.dequantQ3kOk)return this.buf(zt(r,Math.floor(t/256)),s);if(e==="Q4_1"&&!this.dequantQ41Ok)return this.buf(Ht(r,Math.floor(t/32)),s);let i=ee.DEQUANT_SHADER[e],a=ee.BLOCK_ELEMS[e];if(!i||!a)throw new Error(`dequant: unsupported GGML type ${e}`);return this.dequantBlockedGpu(i,r,t,a)}async layerForward(e,r,t,n=!1){let{seq:s,d:i,nHeads:a,nKvHeads:o,headDim:u,ffn:c,ropeTheta:f,eps:d}=r,p=o*u,g=n?(O,D,E,S,L)=>this.matmulT(O,D,E,S,L):(O,D,E,S,L)=>this.matmul(O,D,E,S,L),m=a*u,b=r.rmsGainOnePlus===!0,v=r.attnLogitSoftcap??0,_=(O,D)=>r.act==="gelu"?this.geglu(O,D):this.swiglu(O,D),B=await this.rmsnorm(e,t.attnNorm,s,i,d,b),q=await g(B,t.wq,s,i,m),C=await g(B,t.wk,s,i,p),j=await g(B,t.wv,s,i,p);t.bq&&(q=await this.addBias(q,t.bq,s,m)),t.bk&&(C=await this.addBias(C,t.bk,s,p)),t.bv&&(j=await this.addBias(j,t.bv,s,p)),t.qNorm&&(q=await this.rmsnorm(q,t.qNorm,s*a,u,d,b)),t.kNorm&&(C=await this.rmsnorm(C,t.kNorm,s*o,u,d,b));let x=await this.rope(q,s*a,u,a,0,f),k=await this.rope(C,s*o,u,o,0,f),w=await this.attention(x,k,j,s,a,o,u,0,r.attnScale,v),h=await g(w,t.wo,s,m,i);t.postAttnNorm&&(h=await this.rmsnorm(h,t.postAttnNorm,s,i,d,b));let A=await this.add(e,h),y=await this.rmsnorm(A,t.ffnNorm,s,i,d,b),P=await g(y,t.wgate,s,i,c),U=await g(y,t.wup,s,i,c),F=await _(P,U),G=await g(F,t.wdown,s,c,i);return t.postFfnNorm&&(G=await this.rmsnorm(G,t.postFfnNorm,s,i,d,b)),this.add(A,G)}async layerForwardKV(e,r,t,n,s,i,a=!1){let{seq:o,d:u,nHeads:c,nKvHeads:f,headDim:d,ffn:p,ropeTheta:g,eps:m}=r,b=f*d,v=a?(V,$,X,M,T)=>this.matmulT(V,$,X,M,T):(V,$,X,M,T)=>this.matmul(V,$,X,M,T),_=(V,$)=>{let X=new Float32Array(V.length+$.length);return X.set(V),X.set($,V.length),X},B=c*d,q=r.rmsGainOnePlus===!0,C=r.attnLogitSoftcap??0,j=(V,$)=>r.act==="gelu"?this.geglu(V,$):this.swiglu(V,$),x=await this.rmsnorm(e,t.attnNorm,o,u,m,q),k=await v(x,t.wq,o,u,B),w=await v(x,t.wk,o,u,b),h=await v(x,t.wv,o,u,b);t.bq&&(k=await this.addBias(k,t.bq,o,B)),t.bk&&(w=await this.addBias(w,t.bk,o,b)),t.bv&&(h=await this.addBias(h,t.bv,o,b)),t.qNorm&&(k=await this.rmsnorm(k,t.qNorm,o*c,d,m,q)),t.kNorm&&(w=await this.rmsnorm(w,t.kNorm,o*f,d,m,q));let A=await this.rope(k,o*c,d,c,n,g),y=await this.rope(w,o*f,d,f,n,g),P=_(s,y),U=_(i,h),F=await this.attention(A,P,U,o,c,f,d,n,r.attnScale,C),G=await v(F,t.wo,o,B,u);t.postAttnNorm&&(G=await this.rmsnorm(G,t.postAttnNorm,o,u,m,q));let O=await this.add(e,G),D=await this.rmsnorm(O,t.ffnNorm,o,u,m,q),E=await v(D,t.wgate,o,u,p),S=await v(D,t.wup,o,u,p),L=await j(E,S),z=await v(L,t.wdown,o,p,u);return t.postFfnNorm&&(z=await this.rmsnorm(z,t.postFfnNorm,o,u,m,q)),{out:await this.add(O,z),k:P,v:U}}storage(e){let r=this.bufferPool.get(e);if(r&&r.length){let n=r.pop();return this.pooled.delete(n),n}let t=this.device.createBuffer({size:e,usage:ee.STORAGE_USAGE});return this.poolSize.set(t,e),t}release(e){for(let r of e){if(!r)continue;let t=this.poolSize.get(r);if(t!==void 0){if(this.pooled.has(r))continue;this.pooled.add(r);let s=this.bufferPool.get(t);s||(s=[],this.bufferPool.set(t,s)),s.push(r);continue}let n=this.uniformSize.get(r);if(n!==void 0){if(this.pooled.has(r))continue;this.pooled.add(r);let s=this.uniformPool.get(n);s||(s=[],this.uniformPool.set(n,s)),s.push(r);continue}r.destroy?.()}}uploadGpu(e){return e instanceof Float32Array?this.buf(e,ee.STORAGE_USAGE):this.f16ToF32Gpu(e.f16,e.n)}uploadGpuF16(e){let r=new Uint16Array(e.length);for(let t=0;t<e.length;t++)r[t]=qe(e[t]);return this.bufU16(r)}f32ToF16Gpu(e,r){let t=globalThis,n=Math.ceil(r/2),s=this.device.createBuffer({size:n*4,usage:ee.STORAGE_USAGE}),i=this.device.createBuffer({size:16,usage:t.GPUBufferUsage.UNIFORM|t.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(i,0,new Uint32Array([n])),this.dispatch("packf16",[i,e,s],this.grid1D(n)),s}f32ToQ8Gpu(e,r){let t=globalThis,n=r/32,s=this.device.createBuffer({size:r,usage:ee.STORAGE_USAGE}),i=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:ee.STORAGE_USAGE}),a=this.device.createBuffer({size:16,usage:t.GPUBufferUsage.UNIFORM|t.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(a,0,new Uint32Array([n])),this.dispatch("quantize_q8",[a,e,s,i],this.grid1D(n)),{codes:s,sc:i}}f32ToQ4Gpu(e,r){let t=globalThis,n=r/32,s=this.device.createBuffer({size:r/2,usage:ee.STORAGE_USAGE}),i=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:ee.STORAGE_USAGE}),a=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:ee.STORAGE_USAGE}),o=this.device.createBuffer({size:16,usage:t.GPUBufferUsage.UNIFORM|t.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(o,0,new Uint32Array([n])),this.dispatch("quantize_q4",[o,e,s,i,a],this.grid1D(n)),{nib:s,sc:i,mn:a}}uploadGpuRawF16(e){let r=Math.ceil(e.byteLength/4)*4,t=this.device.createBuffer({size:r,usage:ee.STORAGE_USAGE});if(this.device.queue.writeBuffer(t,0,e,0,e.byteLength-e.byteLength%4),e.byteLength%4){let n=new Uint8Array(4);n.set(e.subarray(e.byteLength-e.byteLength%4)),this.device.queue.writeBuffer(t,e.byteLength-e.byteLength%4,n)}return t}bufU16(e){let r=this.device.createBuffer({size:e.byteLength,usage:ee.STORAGE_USAGE});return this.device.queue.writeBuffer(r,0,e),r}uploadGpuRaw(e){let r=Math.ceil(e.byteLength/4)*4,t=this.device.createBuffer({size:r,usage:ee.STORAGE_USAGE}),n=e.byteLength-e.byteLength%4;if(this.device.queue.writeBuffer(t,0,e,0,n),e.byteLength%4){let s=new Uint8Array(4);s.set(e.subarray(n)),this.device.queue.writeBuffer(t,n,s)}return t}async matmulQ4(e,r,t,n,s,i,a){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s,i,a]));let f=this.device.createBuffer({size:s*a*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4",[c,this.buf(e,u),r,t,n,f],[Math.ceil(s/8),Math.ceil(a/8),1],f,s*a*4)}async matmulQ4Tiled(e,r,t,n,s,i,a){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s,i,a]));let f=this.device.createBuffer({size:s*a*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_tiled",[c,this.buf(e,u),r,t,n,f],[Math.ceil(Math.ceil(s/4)/8),Math.ceil(a/8),1],f,s*a*4)}async matmulQ4Shared(e,r,t,n,s,i,a){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s,i,a]));let f=this.device.createBuffer({size:s*a*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_shared",[c,this.buf(e,u),r,t,n,f],[Math.ceil(a/64),Math.ceil(s/32),1],f,s*a*4)}async matmulQ3(e,r,t,n,s,i,a,o){let u=globalThis,c=u.GPUBufferUsage.STORAGE|u.GPUBufferUsage.COPY_DST,f=this.device.createBuffer({size:16,usage:u.GPUBufferUsage.UNIFORM|u.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(f,0,new Uint32Array([i,a,o]));let d=this.device.createBuffer({size:i*o*4,usage:c|u.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q3",[f,this.buf(e,c),r,t,n,s,d],[Math.ceil(i/8),Math.ceil(o/8),1],d,i*o*4)}async rwkvWkv7(e,r,t,n,s,i,a,o,u){let c=globalThis,f=c.GPUBufferUsage.STORAGE|c.GPUBufferUsage.COPY_DST,d=this.device.createBuffer({size:8,usage:c.GPUBufferUsage.UNIFORM|c.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(d,0,new Uint32Array([o,u]));let p=this.device.createBuffer({size:e.byteLength,usage:f|c.GPUBufferUsage.COPY_SRC});this.device.queue.writeBuffer(p,0,e);let g=this.device.createBuffer({size:o*u*4,usage:f|c.GPUBufferUsage.COPY_SRC});this.dispatch("rwkv_wkv7",[d,this.buf(r,f),this.buf(t,f),this.buf(n,f),this.buf(s,f),this.buf(i,f),this.buf(a,f),p,g],this.grid1D(o*u));let m=await this.readBack(p,e.byteLength),b=await this.readBack(g,o*u*4);return p.destroy?.(),g.destroy?.(),{S:m,y:b}}async rwkvTokenShift(e,r,t,n){let s=globalThis,i=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,a=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(a,0,new Uint32Array([n]));let o=this.device.createBuffer({size:6*n*4,usage:i|s.GPUBufferUsage.COPY_SRC});this.dispatch("rwkv_token_shift",[a,this.buf(e,i),this.buf(r,i),this.buf(t,i),o],this.grid1D(n*6));let u=await this.readBack(o,6*n*4);return o.destroy?.(),u}async lfm2ShortConv(e,r,t,n,s){let i=globalThis,a=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([n,s]));let u=this.buf(r,a|i.GPUBufferUsage.COPY_SRC),c=this.device.createBuffer({size:n*4,usage:a|i.GPUBufferUsage.COPY_SRC});this.dispatch("lfm2_shortconv",[o,this.buf(e,a),this.buf(t,a),u,c],this.grid1D(n));let f=await this.readBack(c,n*4),d=await this.readBack(u,(s-1)*n*4);return c.destroy?.(),u.destroy?.(),{out:f,state:d}}async qwen35Conv1d(e,r,t,n,s=4){let i=globalThis,a=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([n,s]));let u=this.buf(r,a|i.GPUBufferUsage.COPY_SRC),c=this.device.createBuffer({size:n*4,usage:a|i.GPUBufferUsage.COPY_SRC});this.dispatch("qwen35_ssm_conv",[o,this.buf(e,a),this.buf(t,a),u,c],this.grid1D(n));let f=await this.readBack(c,n*4),d=await this.readBack(u,(s-1)*n*4);return c.destroy?.(),u.destroy?.(),o.destroy?.(),{out:f,state:d}}async qwen35DeltaNetStep(e,r,t,n,s,i,a,o,u){let c=globalThis,f=c.GPUBufferUsage.STORAGE|c.GPUBufferUsage.COPY_DST,d=this.device.createBuffer({size:16,usage:c.GPUBufferUsage.UNIFORM|c.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(d,0,new Uint32Array([a,o,u]));let p=this.buf(i,f|c.GPUBufferUsage.COPY_SRC),g=this.device.createBuffer({size:u*o*4,usage:f|c.GPUBufferUsage.COPY_SRC});this.dispatch("qwen35_deltanet_step",[d,this.buf(e,f),this.buf(r,f),this.buf(t,f),this.buf(n,f),this.buf(s,f),p,g],[Math.ceil(o/64),u,1]);let m=await this.readBack(g,u*o*4),b=await this.readBack(p,u*a*o*4);return g.destroy?.(),p.destroy?.(),d.destroy?.(),{out:m,S:b}}async matmulQ8(e,r,t,n,s,i){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s,i]));let c=this.device.createBuffer({size:n*i*4,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8",[u,this.buf(e,o),r,t,c],[Math.ceil(n/8),Math.ceil(i/8),1],c,n*i*4)}async matmulQ8Tiled(e,r,t,n,s,i){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s,i]));let c=this.device.createBuffer({size:n*i*4,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_tiled",[u,this.buf(e,o),r,t,c],[Math.ceil(Math.ceil(n/4)/8),Math.ceil(i/8),1],c,n*i*4)}async matmulQ8Shared(e,r,t,n,s,i){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s,i]));let c=this.device.createBuffer({size:n*i*4,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_shared",[u,this.buf(e,o),r,t,c],[Math.ceil(i/64),Math.ceil(n/32),1],c,n*i*4)}async matmulQ8Shared2(e,r,t,n,s,i){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s,i]));let c=this.device.createBuffer({size:n*i*4,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_shared2",[u,this.buf(e,o),r,t,c],[Math.ceil(i/128),Math.ceil(n/64),1],c,n*i*4)}async matmulQ4Shared2(e,r,t,n,s,i,a){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s,i,a]));let f=this.device.createBuffer({size:s*a*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_shared2",[c,this.buf(e,u),r,t,n,f],[Math.ceil(a/128),Math.ceil(s/64),1],f,s*a*4)}uniformOf(e){let r=globalThis,t=this.uniformPool.get(e);if(t&&t.length){let s=t.pop();return this.pooled.delete(s),s}let n=this.device.createBuffer({size:e,usage:r.GPUBufferUsage.UNIFORM|r.GPUBufferUsage.COPY_DST});return this.uniformSize.set(n,e),n}uniform(e,r){let t=this.uniformOf(32);if(this.device.queue.writeBuffer(t,0,new Uint32Array(e)),r){let n=Array.isArray(r.value)?r.value:[r.value];this.device.queue.writeBuffer(t,r.offset,new Float32Array(n))}return t}attnUniform(e,r,t,n,s,i,a,o,u){let c=this.uniformOf(48);return this.device.queue.writeBuffer(c,0,new Uint32Array([e,r,t,n,s,i])),this.device.queue.writeBuffer(c,24,new Float32Array([a,o])),this.device.queue.writeBuffer(c,32,new Uint32Array([u])),c}recMatmulT(e,r,t,n,s,i,a,o=!1){let u=this.uniform([s,i,a]),c=this.storage(s*a*4),f=this.matmulTPlan(s,i,a,o);return this.recordPass(e,f.shader,[u,t,n,c],f.grid),r.push(u,c),c}recConv2dDirect(e,r,t,n,s,i,a,o,u,c,f,d,p){let g=Math.floor((a+2*p-c)/d)+1,m=Math.floor((o+2*p-f)/d)+1,b=u*g*m,v=this.uniformOf(48);if(this.device.queue.writeBuffer(v,0,new Uint32Array([i,a,o,u,c,f,d,p,g,m])),c===3&&f===3&&d===1&&p===1&&this.convTiledOk){let B=this.storage(b*4);return this.recordPass(e,"conv2d_3x3_tiled",[v,t,n,s,B],[Math.ceil(m/16),Math.ceil(g/16),u]),r.push(v,B),B}let _=this.storage(b*4);return this.recordPass(e,"conv2d_direct",[v,t,n,s,_],this.grid1D(b)),r.push(v,_),_}recConv2dDirectQ8(e,r,t,n,s,i,a,o,u,c,f,d,p){let g=Math.floor((a+2*p-c)/d)+1,m=Math.floor((o+2*p-f)/d)+1,b=u*g*m,v=this.uniformOf(48);if(this.device.queue.writeBuffer(v,0,new Uint32Array([i,a,o,u,c,f,d,p,g,m])),c===3&&f===3&&d===1&&p===1&&this.convTiledQOk){let B=this.storage(b*4);return this.recordPass(e,"conv2d_3x3_tiled_q8",[v,t,n.codes,n.sc,s,B],[Math.ceil(m/16),Math.ceil(g/16),Math.ceil(u/8)]),r.push(v,B),B}if(c===1&&f===1&&d===1&&p===0&&this.convTiledQOk){let B=this.storage(b*4);return this.recordPass(e,"conv2d_1x1_q8",[v,t,n.codes,n.sc,s,B],[Math.ceil(m/16),Math.ceil(g/16),Math.ceil(u/8)]),r.push(v,B),B}if(c===3&&f===3&&d===2&&p===1&&this.convTiledQOk&&this.convS2Ok){let B=this.storage(b*4);return this.recordPass(e,"conv2d_3x3_s2_tiled_q8",[v,t,n.codes,n.sc,s,B],[Math.ceil(m/16),Math.ceil(g/8),Math.ceil(u/8)]),r.push(v,B),B}let _=this.storage(b*4);return this.recordPass(e,"conv2d_direct_q8",[v,t,n.codes,n.sc,s,_],this.grid1D(b)),r.push(v,_),_}recConv2dDirectQ4(e,r,t,n,s,i,a,o,u,c,f,d,p){let g=Math.floor((a+2*p-c)/d)+1,m=Math.floor((o+2*p-f)/d)+1,b=u*g*m,v=this.uniformOf(48);if(this.device.queue.writeBuffer(v,0,new Uint32Array([i,a,o,u,c,f,d,p,g,m])),c===3&&f===3&&d===1&&p===1&&this.convTiledQOk){let B=this.storage(b*4);return this.recordPass(e,"conv2d_3x3_tiled_q4",[v,t,n.nib,n.sc,n.mn,s,B],[Math.ceil(m/16),Math.ceil(g/16),Math.ceil(u/8)]),r.push(v,B),B}if(c===1&&f===1&&d===1&&p===0&&this.convTiledQOk){let B=this.storage(b*4);return this.recordPass(e,"conv2d_1x1_q4",[v,t,n.nib,n.sc,n.mn,s,B],[Math.ceil(m/16),Math.ceil(g/16),Math.ceil(u/8)]),r.push(v,B),B}if(c===3&&f===3&&d===2&&p===1&&this.convTiledQOk&&this.convS2Ok){let B=this.storage(b*4);return this.recordPass(e,"conv2d_3x3_s2_tiled_q4",[v,t,n.nib,n.sc,n.mn,s,B],[Math.ceil(m/16),Math.ceil(g/8),Math.ceil(u/8)]),r.push(v,B),B}let _=this.storage(b*4);return this.recordPass(e,"conv2d_direct_q4",[v,t,n.nib,n.sc,n.mn,s,_],this.grid1D(b)),r.push(v,_),_}recGroupNorm(e,r,t,n,s,i,a,o,u){let c=this.uniform([i,a,o],{offset:12,value:u}),f=this.storage(i*a*4),d=this.hasSubgroups&&this.subgroupsOk?"group_norm_subgroup":"group_norm";return this.recordPass(e,d,[c,t,n,s,f],[o,1,1]),r.push(c,f),f}recUnary(e,r,t,n,s){let i=this.storage(s*4);return this.recordPass(e,t,[n,i],this.grid1D(s)),r.push(i),i}recLayernorm(e,r,t,n,s,i,a,o){let u=this.uniform([i,a],{offset:8,value:o}),c=this.storage(i*a*4);return this.recordPass(e,"layernorm",[u,t,n,s,c],[Math.ceil(i/ue),1,1]),r.push(u,c),c}recAttentionFull(e,r,t,n,s,i,a,o,u,c,f){let d=this.uniform([i,a,o,u,c,0],{offset:24,value:[f??1/Math.sqrt(u),0]}),p=this.storage(i*a*u*4),g=i*a;return this.attnFullWgOk&&u<=192&&g<=65535?this.recordPass(e,"attention_full_wg",[d,t,n,s,p],[g,1,1]):this.recordPass(e,"attention_full",[d,t,n,s,p],[Math.ceil(g/ue),1,1]),r.push(d,p),p}recUpsample(e,r,t,n,s,i,a){let o=this.uniform([n,s,i,a]),u=n*(s*a)*(i*a),c=this.storage(u*4);return this.recordPass(e,"upsample_nearest",[o,t,c],this.grid1D(u)),r.push(o,c),c}recConcat(e,r,t,n,s,i,a){let o=this.storage((s+i)*a*4);return e.copyBufferToBuffer(t,0,o,0,s*a*4),e.copyBufferToBuffer(n,0,o,s*a*4,i*a*4),r.push(o),o}recAddChannelBias(e,r,t,n,s,i){let a=this.uniform([s,i]),o=this.storage(s*i*4);return this.recordPass(e,"add_channel_bias",[a,t,n,o],this.grid1D(s*i)),r.push(a,o),o}recTranspose(e,r,t,n,s){let i=this.uniform([n,s]),a=this.storage(n*s*4);return this.recordPass(e,"transpose2d",[i,t,a],this.grid1D(n*s)),r.push(i,a),a}recGegluSplit(e,r,t,n,s){let i=this.uniform([n,s]),a=this.storage(n*s*4);return this.recordPass(e,"geglu_split",[i,t,a],this.grid1D(n*s)),r.push(i,a),a}recUpscale2x(e,r,t,n,s,i,a=.5){let o=this.uniform([n,s,i],{offset:12,value:a}),u=i*2,c=s*2,f=this.storage(n*c*u*4);return this.recordPass(e,"upscale2x_enhanced",[o,t,f],[Math.ceil(u/16),Math.ceil(c/16),n]),r.push(o,f),f}recVideoGather(e,r,t,n,s,i){let a=this.uniform([n,s,i]),o=this.storage(i*n*s*4);return this.recordPass(e,"video_motion_gather",[a,t,o],this.grid1D(i*n*s)),r.push(a,o),o}recVideoScatter(e,r,t,n,s,i,a){let o=this.uniform([s,i,a]),u=this.storage(s*i*a*4);return this.recordPass(e,"video_motion_scatter",[o,t,n,u],this.grid1D(s*i*a)),r.push(o,u),u}recVideoAddPe(e,r,t,n,s,i,a){let o=this.uniform([s,i,a]),u=this.storage(a*s*i*4);return this.recordPass(e,"video_add_pe",[o,t,n,u],this.grid1D(a*s*i)),r.push(o,u),u}recAttnTemporal(e,r,t,n,s,i,a,o,u){let c=this.uniform([i,a,o,u],{offset:16,value:1/Math.sqrt(u)}),f=this.storage(i*a*o*u*4);return this.recordPass(e,"attn_temporal",[c,t,n,s,f],this.grid1D(i*a*o)),r.push(c,f),f}recordingSession(){let e=this.device.createCommandEncoder(),r=[],t=n=>{if(n instanceof Float32Array){let s=this.uploadGpu(n);return r.push(s),s}return n};return{conv2d:(n,s,i,a,o,u,c,f,d,p,g)=>s&&s.nib?this.recConv2dDirectQ4(e,r,t(n),s,t(i),a,o,u,c,f,d,p,g):s&&s.codes?this.recConv2dDirectQ8(e,r,t(n),s,t(i),a,o,u,c,f,d,p,g):this.recConv2dDirect(e,r,t(n),t(s),t(i),a,o,u,c,f,d,p,g),groupNorm:(n,s,i,a,o,u,c)=>this.recGroupNorm(e,r,t(n),t(s),t(i),a,o,u,c),silu:(n,s)=>this.recUnary(e,r,"silu",t(n),s),quickGelu:(n,s)=>this.recUnary(e,r,"quick_gelu",t(n),s),gelu:(n,s)=>this.recUnary(e,r,"gelu",t(n),s),relu:(n,s)=>this.recUnary(e,r,"relu",t(n),s),add:(n,s,i)=>this.recBinary(e,r,"add",t(n),t(s),i),geglu:(n,s,i)=>this.recBinary(e,r,"geglu",t(n),t(s),i),matmulT:(n,s,i,a,o)=>this.recMM(e,r,t(n),s instanceof Float32Array?t(s):s,i,a,o,!1),addBias:(n,s,i,a)=>this.recAddBias(e,r,t(n),t(s),i,a),addChannelBias:(n,s,i,a)=>this.recAddChannelBias(e,r,t(n),t(s),i,a),attentionFull:(n,s,i,a,o,u,c,f)=>this.recAttentionFull(e,r,t(n),t(s),t(i),a,o,u,c,f),rope2d:(n,s,i,a,o,u)=>{let c=s instanceof Uint32Array?(()=>{let f=this.uploadGpuRaw(new Uint8Array(s.buffer,s.byteOffset,s.byteLength));return r.push(f),f})():s;return this.recRope2d(e,r,t(n),c,i,a,o,u)},attention:(n,s,i,a,o,u,c,f,d)=>this.recAttention(e,r,t(n),t(s),t(i),a,o,u,c,f,d),upsample:(n,s,i,a,o)=>this.recUpsample(e,r,t(n),s,i,a,o),upscale2x:(n,s,i,a,o=.5)=>this.recUpscale2x(e,r,t(n),s,i,a,o),layernorm:(n,s,i,a,o,u)=>this.recLayernorm(e,r,t(n),t(s),t(i),a,o,u),concat:(n,s,i,a,o)=>this.recConcat(e,r,t(n),t(s),i,a,o),transpose:(n,s,i)=>this.recTranspose(e,r,t(n),s,i),gegluSplit:(n,s,i)=>this.recGegluSplit(e,r,t(n),s,i),videoGather:(n,s,i,a)=>this.recVideoGather(e,r,t(n),s,i,a),videoScatter:(n,s,i,a,o)=>this.recVideoScatter(e,r,t(n),t(s),i,a,o),videoAddPe:(n,s,i,a,o)=>this.recVideoAddPe(e,r,t(n),t(s),i,a,o),attnTemporal:(n,s,i,a,o,u,c)=>this.recAttnTemporal(e,r,t(n),t(s),t(i),a,o,u,c),alloc:n=>{let s=this.storage(n);return r.push(s),s},copy:(n,s,i,a,o)=>{e.copyBufferToBuffer(i,a,n,s,o)},finish:async(n,s)=>{this.device.queue.submit([e.finish()]);let i=await this.readBack(n,s*4);return this.release(r),i},finishKeep:n=>{this.device.queue.submit([e.finish()]);let s=r.indexOf(n);return s>=0&&r.splice(s,1),this.release(r),n},finishKeepMany:n=>{this.device.queue.submit([e.finish()]);for(let s of n){let i=r.indexOf(s);i>=0&&r.splice(i,1)}return this.release(r),n}}}readGpu(e,r){return this.readBack(e,r*4)}trimPool(e=64<<20){let r=[...this.bufferPool.keys()].sort((n,s)=>s-n),t=0;for(let n of this.bufferPool.values())for(let s of n)t+=this.poolSize.get(s)??0;for(let n of r){let s=this.bufferPool.get(n);for(;s.length&&t>e;){let i=s.pop();this.pooled.delete(i),this.poolSize.delete(i),i.destroy?.(),t-=n}}}releaseGpu(e){this.release(e)}waitGpu(){return this.device.queue.onSubmittedWorkDone()}async benchMatmul(e,r,t,n,s,i={}){let{iters:a=10,shared:o=!0,shared2:u=!0,wF16:c=!1}=i,f=this.f16SharedOk,d=this.qSharedOk,p=this.qShared2Ok;this.f16SharedOk=o,this.qSharedOk=o,this.qShared2Ok=o&&u;let g=this.uploadGpu(e),m=[],b=this.device.createCommandEncoder();this.recMM(b,m,g,r,t,n,s,c),this.device.queue.submit([b.finish()]),await this.device.queue.onSubmittedWorkDone();let v=this.device.createCommandEncoder();for(let q=0;q<a;q++)this.recMM(v,m,g,r,t,n,s,c);let _=performance.now();this.device.queue.submit([v.finish()]),await this.device.queue.onSubmittedWorkDone();let B=(performance.now()-_)/a;return this.release(m),g.destroy?.(),this.f16SharedOk=f,this.qSharedOk=d,this.qShared2Ok=p,B}destroy(){try{this.profiler?.destroy()}catch{}this.profiler=null;try{this.device?.destroy?.()}catch{}this.bufferPool.clear(),this.uniformPool.clear()}f16ToF32Gpu(e,r){let t=this.uploadGpuRawF16(e),n=this.device.createBuffer({size:r*4,usage:ee.STORAGE_USAGE}),s=this.uniformOf(16);return this.device.queue.writeBuffer(s,0,new Uint32Array([r])),this.dispatch("f16_to_f32",[s,t,n],this.grid1D(Math.ceil(r/2))),t.destroy?.(),this.release([s]),n}quantizeQ8Gpu(e){let r=e instanceof Float32Array?e.length:e.n;if(r%32!==0)return this.uploadGpu(e);let t=e instanceof Float32Array?this.buf(e,ee.STORAGE_USAGE):this.f16ToF32Gpu(e.f16,r),n=this.f32ToQ8Gpu(t,r);return t.destroy?.(),n}async validateResidentOps(){let e=globalThis,r=A=>Float32Array.from({length:A},()=>(Math.random()*2-1)*.5),t=(A,y,P=.005)=>A.length===y.length&&A.every((U,F)=>Math.abs(U-y[F])<=P*(1+Math.abs(y[F]))),n=4,s=4,i=4,a=4,o=2,u=1e-5,c=a*s*i,f=r(n*s*i),d=r(a*n*9),p=r(a),g=r(a),m=r(a),b=await this.silu(await this.groupNorm(await this.conv2dDirect(f,d,p,n,s,i,a,3,3,1,1),g,m,a,s*i,o,u)),v=[],_=this.device.createCommandEncoder(),B=this.uploadGpu(f),q=this.uploadGpu(d),C=this.uploadGpu(p),j=this.uploadGpu(g),x=this.uploadGpu(m);v.push(B,q,C,j,x);let k=this.recConv2dDirect(_,v,B,q,C,n,s,i,a,3,3,1,1);k=this.recGroupNorm(_,v,k,j,x,a,s*i,o,u),k=this.recUnary(_,v,"silu",k,c);let w=this.device.createBuffer({size:c*4,usage:e.GPUBufferUsage.COPY_DST|e.GPUBufferUsage.MAP_READ});_.copyBufferToBuffer(k,0,w,0,c*4),this.device.queue.submit([_.finish()]),await w.mapAsync(e.GPUMapMode.READ);let h=new Float32Array(w.getMappedRange().slice(0));return w.unmap(),w.destroy(),this.release(v),t(h,b)?null:"resident_ops"}recMatmulQ4(e,r,t,n,s,i,a){let o=this.uniform([s,i,a]),u=this.storage(s*a*4);if(s===1&&this.gemvOk){let c=this.gemvGrid(a);this.recordPass(e,"matmul_t_q4_vec",[this.uniform([s,i,a,c.stride]),t,n.nib,n.sc,n.mn,u],c.grid)}else s>=64&&this.qSharedOk&&this.qShared2Ok?this.recordPass(e,"matmul_t_q4_shared2",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(a/128),Math.ceil(s/64),1]):s>=32&&this.qSharedOk?this.recordPass(e,"matmul_t_q4_shared",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(a/64),Math.ceil(s/32),1]):s>=2?this.recordPass(e,"matmul_t_q4_tiled",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(Math.ceil(s/4)/8),Math.ceil(a/8),1]):this.recordPass(e,"matmul_t_q4",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(s/8),Math.ceil(a/8),1]);return r.push(o,u),u}recMatmulQ8(e,r,t,n,s,i,a){let o=this.uniform([s,i,a]),u=this.storage(s*a*4);if(s===1&&this.gemvOk){let c=this.gemvGrid(a);this.recordPass(e,"matmul_t_q8_vec",[this.uniform([s,i,a,c.stride]),t,n.codes,n.sc,u],c.grid)}else s>=64&&this.qSharedOk&&this.qShared2Ok?this.recordPass(e,"matmul_t_q8_shared2",[o,t,n.codes,n.sc,u],[Math.ceil(a/128),Math.ceil(s/64),1]):s>=32&&this.qSharedOk?this.recordPass(e,"matmul_t_q8_shared",[o,t,n.codes,n.sc,u],[Math.ceil(a/64),Math.ceil(s/32),1]):s>=2?this.recordPass(e,"matmul_t_q8_tiled",[o,t,n.codes,n.sc,u],[Math.ceil(Math.ceil(s/4)/8),Math.ceil(a/8),1]):this.recordPass(e,"matmul_t_q8",[o,t,n.codes,n.sc,u],[Math.ceil(s/8),Math.ceil(a/8),1]);return r.push(o,u),u}gemvGrid(e){return e<=32768?{grid:[e,1,1],stride:32768}:{grid:[32768,Math.ceil(e/32768),1],stride:32768}}async matmulQ4Vec(e,r,t,n,s,i){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.gemvGrid(i),c=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([1,s,i,u.stride]));let f=this.device.createBuffer({size:i*4,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_vec",[c,this.buf(e,o),r,t,n,f],u.grid,f,i*4)}async matmulQ8Vec(e,r,t,n,s){let i=globalThis,a=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=this.gemvGrid(s),u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([1,n,s,o.stride]));let c=this.device.createBuffer({size:s*4,usage:a|i.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_vec",[u,this.buf(e,a),r,t,c],o.grid,c,s*4)}recMatmulQ3(e,r,t,n,s,i,a){let o=this.uniform([s,i,a]),u=this.storage(s*a*4);return this.recordPass(e,"matmul_t_q3",[o,t,n.lo,n.hi,n.sc,n.mn,u],[Math.ceil(s/8),Math.ceil(a/8),1]),r.push(o,u),u}recMM(e,r,t,n,s,i,a,o){return n&&n.q3?this.recMatmulQ3(e,r,t,n,s,i,a):n&&n.nib?this.recMatmulQ4(e,r,t,n,s,i,a):n&&n.codes?this.recMatmulQ8(e,r,t,n,s,i,a):this.recMatmulT(e,r,t,n,s,i,a,o)}recRmsnorm(e,r,t,n,s,i,a,o=!1){let u=this.uniform([s,i,0,o?1:0],{offset:8,value:a}),c=this.storage(s*i*4);if(this.rmsVecOk&&s<=65535){let f=this.hasSubgroups&&this.subgroupsOk?"rmsnorm_vec_subgroup":"rmsnorm_vec";this.recordPass(e,f,[u,t,n,c],[s,1,1])}else this.recordPass(e,"rmsnorm",[u,t,n,c],[Math.ceil(s/ue),1,1]);return r.push(u,c),c}recRope(e,r,t,n,s,i,a,o,u=!1){let c=this.uniform([n,s,i,a],{offset:16,value:o});this.device.queue.writeBuffer(c,20,new Uint32Array([u?1:0]));let f=this.storage(n*s*4);return this.recordPass(e,"rope",[c,t,f],[Math.ceil(n/ue),1,1]),r.push(c,f),f}recRopeMrope(e,r,t,n,s,i,a,o,u){let c=u[0],f=u[0]+u[1],d=this.uniform([s,i,a,c,f],{offset:20,value:o}),p=this.storage(s*i*4);return this.recordPass(e,"rope_mrope",[d,t,n,p],[Math.ceil(s/ue),1,1]),r.push(d,p),p}preparePositions(e,r){if(e.positions&&e.mropeSections){let t=this.storage(e.positions.byteLength);this.device.queue.writeBuffer(t,0,e.positions),r.push(t),e._posGpu=t}if(e.ropeFactors){let t=this.storage(e.ropeFactors.byteLength);this.device.queue.writeBuffer(t,0,e.ropeFactors),r.push(t),e._ffGpu=t}}recRope2d(e,r,t,n,s,i,a,o){let u=this.uniform([s,i,a,0],{offset:16,value:o}),c=this.storage(s*i*4);return this.recordPass(e,"rope_2d",[u,t,n,c],[Math.ceil(s/ue),1,1]),r.push(u,c),c}recRopeFactors(e,r,t,n,s,i,a,o,u,c=!1){let f=this.uniform([s,i,a,o],{offset:16,value:u});this.device.queue.writeBuffer(f,20,new Uint32Array([c?1:0]));let d=this.storage(s*i*4);return this.recordPass(e,"rope_factors",[f,t,n,d],[Math.ceil(s/ue),1,1]),r.push(f,d),d}recAttention(e,r,t,n,s,i,a,o,u,c,f,d,p=0,g=0){let m=this.attnUniform(i,a,o,u,c,f,d??1/Math.sqrt(u),p,g),b=this.storage(i*a*u*4);return this.attnDecodeOk&&i*a<256&&u<=128?this.recordPass(e,"attention_decode",[m,t,n,s,b],[i*a,1,1]):this.attnPrefillOk&&u<=128?this.recordPass(e,"attention_prefill",[m,t,n,s,b],[Math.ceil(i/4)*a,1,1]):this.recordPass(e,"attention",[m,t,n,s,b],[Math.ceil(i*a/ue),1,1]),r.push(m,b),b}recQuantizeKv(e,r,t,n,s,i,a,o,u){let c=this.uniform([i,a,o,u]);this.recordPass(e,"quantize_kv",[c,t,n,s],this.grid1D(i*a)),r.push(c)}recAttentionQ8(e,r,t,n,s,i,a,o,u,c,f,d,p,g,m=0,b=0){let v=this.attnUniform(o,u,c,f,d,p,g??1/Math.sqrt(f),m,b),_=this.storage(o*u*f*4);return this.attnDecodeOk&&o*u<256&&f<=128?this.recordPass(e,"attention_decode_q8kv",[v,t,n,s,i,a,_],[o*u,1,1]):this.attnPrefillOk&&f<=128?this.recordPass(e,"attention_prefill_q8kv",[v,t,n,s,i,a,_],[Math.ceil(o/4)*u,1,1]):this.recordPass(e,"attention_q8kv",[v,t,n,s,i,a,_],[Math.ceil(o*u/ue),1,1]),r.push(v,_),_}recAddBias(e,r,t,n,s,i){let a=this.uniform([s,i]),o=this.storage(s*i*4);return this.recordPass(e,"addbias",[a,t,n,o],this.grid1D(s*i)),r.push(a,o),o}recBinary(e,r,t,n,s,i){let a=this.storage(i*4);return this.recordPass(e,t,[n,s,a],this.grid1D(i)),r.push(a),a}recLfm2ShortConv(e,r,t,n,s,i,a){let o=this.uniform([i,a]),u=this.storage(i*4);return this.recordPass(e,"lfm2_shortconv",[o,t,s,n,u],this.grid1D(i)),r.push(o,u),u}recordLayerKV(e,r,t,n,s,i,a){let o=a.k,u=a.v,{seq:c,d:f,nHeads:d,nKvHeads:p,headDim:g,ffn:m,ropeTheta:b,eps:v}=n,_=p*g,B=i+c,q=s.matF16===!0,C=d*g,j=n.rmsGainOnePlus===!0,x=n.attnLogitSoftcap??0,k=n.act==="gelu"?"geglu":"swiglu",w=this.recRmsnorm(e,r,t,s.attnNorm,c,f,v,j),h=this.recMM(e,r,w,s.wq,c,f,C,q),A=this.recMM(e,r,w,s.wk,c,f,_,q),y=this.recMM(e,r,w,s.wv,c,f,_,q);s.bq&&(h=this.recAddBias(e,r,h,s.bq,c,C)),s.bk&&(A=this.recAddBias(e,r,A,s.bk,c,_)),s.bv&&(y=this.recAddBias(e,r,y,s.bv,c,_)),s.qNorm&&(h=this.recRmsnorm(e,r,h,s.qNorm,c*d,g,v,j)),s.kNorm&&(A=this.recRmsnorm(e,r,A,s.kNorm,c*p,g,v,j));let P=n._posGpu,U=n._ffGpu,F=n.ropeInterleaved===!0,G=(M,T,R)=>n.skipRope?M:P?this.recRopeMrope(e,r,M,P,T,g,R,b,n.mropeSections):U?this.recRopeFactors(e,r,M,U,T,g,R,i,b,F):this.recRope(e,r,M,T,g,R,i,b,F),O=G(h,c*d,d),D=G(A,c*p,p),E;if(a.kScale)this.recQuantizeKv(e,r,D,o,a.kScale,c,p,g,i),this.recQuantizeKv(e,r,y,u,a.vScale,c,p,g,i),E=this.recAttentionQ8(e,r,O,o,a.kScale,u,a.vScale,c,d,p,g,B,i,n.attnScale,x,n.window??0);else{let M=_*4;e.copyBufferToBuffer(D,0,o,i*M,c*M),e.copyBufferToBuffer(y,0,u,i*M,c*M),E=this.recAttention(e,r,O,o,u,c,d,p,g,B,i,n.attnScale,x,n.window??0)}let S=this.recMM(e,r,E,s.wo,c,C,f,q);s.postAttnNorm&&(S=this.recRmsnorm(e,r,S,s.postAttnNorm,c,f,v,j));let L=this.recBinary(e,r,"add",t,S,c*f),z=this.recRmsnorm(e,r,L,s.ffnNorm,c,f,v,j),W=this.recMM(e,r,z,s.wgate,c,f,m,q),V=this.recMM(e,r,z,s.wup,c,f,m,q),$=this.recBinary(e,r,k,W,V,c*m),X=this.recMM(e,r,$,s.wdown,c,m,f,q);return s.postFfnNorm&&(X=this.recRmsnorm(e,r,X,s.postFfnNorm,c,f,v,j)),this.recBinary(e,r,"add",L,X,c*f)}setKvQuant(e){this.kvQuant!==e&&(this.kvQuant=e,this.resetKvGpu())}resetKvGpu(){for(let e of this.kvGpu.values())e.k.destroy?.(),e.v.destroy?.(),e.kScale?.destroy?.(),e.vScale?.destroy?.();this.kvGpu.clear(),this.kvSession="";for(let e of this.bufferPool.values())for(let r of e)r.destroy?.();this.bufferPool.clear()}clearKvCache(){this.resetKvGpu()}ensureKv(e,r,t,n){let s=this.kvGpu.get(e);if(s&&s.cap>=r)return s;let i=Math.max(r,(s?.cap??0)+1024,1024),a=this.kvQuant,o=this.storage(i*t*(a?1:4)),u=this.storage(i*t*(a?1:4)),c=a?this.storage(i*n*4):void 0,f=a?this.storage(i*n*4):void 0;if(s){let p=this.device.createCommandEncoder();p.copyBufferToBuffer(s.k,0,o,0,s.cap*t*(a?1:4)),p.copyBufferToBuffer(s.v,0,u,0,s.cap*t*(a?1:4)),a&&s.kScale&&(p.copyBufferToBuffer(s.kScale,0,c,0,s.cap*n*4),p.copyBufferToBuffer(s.vScale,0,f,0,s.cap*n*4)),this.device.queue.submit([p.finish()]),s.k.destroy?.(),s.v.destroy?.(),s.kScale?.destroy?.(),s.vScale?.destroy?.()}let d={k:o,v:u,cap:i,kScale:c,vScale:f};return this.kvGpu.set(e,d),d}async runDecodeGpu(e,r,t,n,s,i){let{seq:a,d:o,nKvHeads:u,headDim:c,eps:f}=r,d=u*c,p=n+a;(i!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${i}" inconnue avec pastLen=${n} : cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=i);for(let q=0;q<t.length;q++)this.ensureKv(q,p,d,u);let g=[];this.preparePositions(r,g);let m=this.device.createCommandEncoder(),b=this.storage(e.byteLength);this.device.queue.writeBuffer(b,0,e),g.push(b);for(let q=0;q<t.length;q++){let C=this.kvGpu.get(q);b=this.recordLayerKV(m,g,b,Qt(r,a,q,this.swaOk),t[q],n,C)}let v=this.recRmsnorm(m,g,b,s,a,o,f,r.rmsGainOnePlus===!0),_=this.storage(o*4);m.copyBufferToBuffer(v,(a-1)*o*4,_,0,o*4),this.device.queue.submit([m.finish()]);let B=await this.readBack(_,o*4);return g.push(_),this.release(g),B}async decodeLogitsQ8(e,r,t,n,s,i,a,o){let u=globalThis,{seq:c,d:f,nKvHeads:d,headDim:p,eps:g}=r,m=d*p,b=n+c;(i!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${i}" inconnue avec pastLen=${n} : cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=i);for(let w=0;w<t.length;w++)this.ensureKv(w,b,m,d);let v=[];this.preparePositions(r,v);let _=this.device.createCommandEncoder(),B=this.storage(e.byteLength);this.device.queue.writeBuffer(B,0,e),v.push(B);for(let w=0;w<t.length;w++){let h=this.kvGpu.get(w);B=this.recordLayerKV(_,v,B,Qt(r,c,w,this.swaOk),t[w],n,h)}let q=this.recRmsnorm(_,v,B,s,c,f,g,r.rmsGainOnePlus===!0),C=this.storage(f*4);_.copyBufferToBuffer(q,(c-1)*f*4,C,0,f*4),v.push(C);let j=this.storage(o*4);v.push(j);for(let w of a){let h=this.recMM(_,v,C,w.w,1,f,w.rows,!1);_.copyBufferToBuffer(h,0,j,w.r0*4,w.rows*4)}let x=this.device.createBuffer({size:o*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});_.copyBufferToBuffer(j,0,x,0,o*4),this.device.queue.submit([_.finish()]),await x.mapAsync(u.GPUMapMode.READ);let k=new Float32Array(x.getMappedRange().slice(0));return x.unmap(),x.destroy(),this.release(v),k}async decodeTopKQ8(e,r,t,n,s,i,a,o,u,c,f,d=64){let p=globalThis,{seq:g,d:m,nKvHeads:b,headDim:v,eps:_}=r,B=b*v,q=n+g;(i!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${i}" inconnue avec pastLen=${n} : cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=i);for(let G=0;G<t.length;G++)this.ensureKv(G,q,B,b);let C=ee.timingOn?(G,O)=>console.info(`[timing:gpu] ${G} ${(performance.now()-O).toFixed(0)} ms`):null,j=performance.now(),x=[];this.preparePositions(r,x);let k=this.device.createCommandEncoder(),w=this.storage(e.byteLength);this.device.queue.writeBuffer(w,0,e),x.push(w);for(let G=0;G<t.length;G++){let O=this.kvGpu.get(G);w=this.recordLayerKV(k,x,w,Qt(r,g,G,this.swaOk),t[G],n,O)}let h=this.recRmsnorm(k,x,w,s,g,m,_,r.rmsGainOnePlus===!0),A=this.storage(m*4);k.copyBufferToBuffer(h,(g-1)*m*4,A,0,m*4),x.push(A);let y=this.storage(o*4);x.push(y);for(let G of a){let O=this.recMM(k,x,A,G.w,1,m,G.rows,!1);k.copyBufferToBuffer(O,0,y,G.r0*4,G.rows*4)}if(f&&f>0){let G=this.uniform([o],{offset:4,value:f});this.recordPass(k,"softcap_logits",[G,y],this.grid1D(o)),x.push(G)}if(c&&c!==1&&u.length){let G=Uint32Array.from(u),O=this.bufU32(G,p.GPUBufferUsage.STORAGE|p.GPUBufferUsage.COPY_DST),D=this.uniform([G.length],{offset:4,value:c});this.recordPass(k,"penalize_logits",[D,O,y],this.grid1D(G.length)),x.push(D,O)}let P=this.storage(d*2*4);x.push(P);{let G=this.uniform([o,d]);this.recordPass(k,this.topKParOk?"top_k_par":"top_k",[G,y,P],[1,1,1]),x.push(G)}let U=this.device.createBuffer({size:d*2*4,usage:p.GPUBufferUsage.COPY_DST|p.GPUBufferUsage.MAP_READ});k.copyBufferToBuffer(P,0,U,0,d*2*4),C?.("enregistrement des passes (compilation des pipelines incluse)",j),j=performance.now(),this.device.queue.submit([k.finish()]),await U.mapAsync(p.GPUMapMode.READ),C?.("execution GPU (submit + readback)",j);let F=new Uint32Array(U.getMappedRange().slice(0));return U.unmap(),U.destroy(),this.release(x),{ids:F.slice(0,d),vals:new Float32Array(F.buffer,d*4,d)}}resetLfm2State(){for(let e of this.lfm2KvGpu.values())e.k.destroy?.(),e.v.destroy?.();for(let e of this.lfm2ConvGpu.values())e.destroy?.();this.lfm2KvGpu.clear(),this.lfm2ConvGpu.clear(),this.lfm2Session="";for(let e of this.bufferPool.values())for(let r of e)r.destroy?.();this.bufferPool.clear()}clearLfm2State(){this.resetLfm2State()}ensureLfm2Kv(e,r,t){let n=this.lfm2KvGpu.get(e);if(n&&n.cap>=r)return n;let s=Math.max(r,(n?.cap??0)+1024,1024),i=this.storage(s*t*4),a=this.storage(s*t*4);if(n){let u=this.device.createCommandEncoder();u.copyBufferToBuffer(n.k,0,i,0,n.cap*t*4),u.copyBufferToBuffer(n.v,0,a,0,n.cap*t*4),this.device.queue.submit([u.finish()]),n.k.destroy?.(),n.v.destroy?.()}let o={k:i,v:a,cap:s};return this.lfm2KvGpu.set(e,o),o}ensureLfm2Conv(e,r){let t=this.lfm2ConvGpu.get(e);return t||(t=this.storage(r*4),this.device.queue.writeBuffer(t,0,new Float32Array(r)),this.lfm2ConvGpu.set(e,t)),t}recLfm2ShortConvBatch(e,r,t,n,s,i,a,o){let u=this.uniform([i,a,o]),c=this.storage(o*i*4);this.recordPass(e,"lfm2_shortconv_batch",[u,t,s,n,c],this.grid1D(o*i));let f=this.uniform([i,a,o]);return this.recordPass(e,"lfm2_shortconv_state",[f,t,n],this.grid1D((a-1)*i)),r.push(u,f,c),c}recordLfm2(e,r,t,n,s,i,a,o){let{D:u,nHeads:c,nKvHeads:f,headDim:d,ffn:p,eps:g,theta:m,lc:b}=s,v=f*d,_=c*d,B=v*4;for(let C=0;C<i.length;C++)i[C].conv?this.ensureLfm2Conv(C,(b-1)*u):this.ensureLfm2Kv(C,o+n,v);if(n>=b-1&&this.lfm2BatchOk){let C=this.storage(n*u*4);this.device.queue.writeBuffer(C,0,t),r.push(C);for(let x=0;x<i.length;x++){let k=i[x],w=this.recRmsnorm(e,r,C,k.attnNorm,n,u,g),h;if(k.conv){let G=this.recMM(e,r,w,k.inProj,n,u,3*u,!1),O=this.recLfm2ShortConvBatch(e,r,G,this.lfm2ConvGpu.get(x),k.convW,u,b,n);h=this.recMM(e,r,O,k.outProj,n,u,u,!1)}else{let G=this.recMM(e,r,w,k.wq,n,u,_,!1),O=this.recMM(e,r,w,k.wk,n,u,v,!1),D=this.recMM(e,r,w,k.wv,n,u,v,!1);G=this.recRmsnorm(e,r,G,k.qNorm,n*c,d,g),O=this.recRmsnorm(e,r,O,k.kNorm,n*f,d,g),G=this.recRope(e,r,G,n*c,d,c,o,m),O=this.recRope(e,r,O,n*f,d,f,o,m);let E=this.lfm2KvGpu.get(x);e.copyBufferToBuffer(O,0,E.k,o*B,n*B),e.copyBufferToBuffer(D,0,E.v,o*B,n*B);let S=this.recAttention(e,r,G,E.k,E.v,n,c,f,d,o+n,o);h=this.recMM(e,r,S,k.wo,n,_,u,!1)}C=this.recBinary(e,r,"add",C,h,n*u);let A=this.recRmsnorm(e,r,C,k.ffnNorm,n,u,g),y=this.recMM(e,r,A,k.wgate,n,u,p,!1),P=this.recMM(e,r,A,k.wup,n,u,p,!1),U=this.recBinary(e,r,"swiglu",y,P,n*p),F=this.recMM(e,r,U,k.wdown,n,p,u,!1);C=this.recBinary(e,r,"add",C,F,n*u)}let j=this.storage(u*4);return r.push(j),e.copyBufferToBuffer(C,(n-1)*u*4,j,0,u*4),this.recRmsnorm(e,r,j,a,1,u,g)}let q=null;for(let C=0;C<n;C++){let j=o+C,x=this.storage(u*4);this.device.queue.writeBuffer(x,0,t.subarray(C*u,(C+1)*u)),r.push(x);for(let k=0;k<i.length;k++){let w=i[k],h=this.recRmsnorm(e,r,x,w.attnNorm,1,u,g),A;if(w.conv){let O=this.recMM(e,r,h,w.inProj,1,u,3*u,!1),D=this.recLfm2ShortConv(e,r,O,this.lfm2ConvGpu.get(k),w.convW,u,b);A=this.recMM(e,r,D,w.outProj,1,u,u,!1)}else{let O=this.recMM(e,r,h,w.wq,1,u,_,!1),D=this.recMM(e,r,h,w.wk,1,u,v,!1),E=this.recMM(e,r,h,w.wv,1,u,v,!1);O=this.recRmsnorm(e,r,O,w.qNorm,c,d,g),D=this.recRmsnorm(e,r,D,w.kNorm,f,d,g),O=this.recRope(e,r,O,c,d,c,j,m),D=this.recRope(e,r,D,f,d,f,j,m);let S=this.lfm2KvGpu.get(k);e.copyBufferToBuffer(D,0,S.k,j*B,B),e.copyBufferToBuffer(E,0,S.v,j*B,B);let L=this.recAttention(e,r,O,S.k,S.v,1,c,f,d,j+1,j);A=this.recMM(e,r,L,w.wo,1,_,u,!1)}x=this.recBinary(e,r,"add",x,A,u);let y=this.recRmsnorm(e,r,x,w.ffnNorm,1,u,g),P=this.recMM(e,r,y,w.wgate,1,u,p,!1),U=this.recMM(e,r,y,w.wup,1,u,p,!1),F=this.recBinary(e,r,"swiglu",P,U,p),G=this.recMM(e,r,F,w.wdown,1,p,u,!1);x=this.recBinary(e,r,"add",x,G,u)}C===n-1&&(q=this.recRmsnorm(e,r,x,a,1,u,g))}return q}lfm2SessionReset(e,r){(e!==this.lfm2Session||r===0)&&(r>0&&console.error(`[lfm2] session "${e}" inconnue avec pastLen=${r} : \xE9tat perdu, sortie invalide. Repartir de pastLen 0.`),this.resetLfm2State(),this.lfm2Session=e)}async lfm2PrefillGpu(e,r,t,n,s,i,a){this.lfm2SessionReset(a,i);let o=[],u=this.device.createCommandEncoder();this.recordLfm2(u,o,e,r,t,n,s,i),this.device.queue.submit([u.finish()]),await this.device.queue.onSubmittedWorkDone(),this.release(o)}async lfm2LogitsGpu(e,r,t,n,s,i,a,o){let u=globalThis;this.lfm2SessionReset(o,a);let c=[],f=this.device.createCommandEncoder(),d=this.recordLfm2(f,c,e,r,t,n,i,a),p=this.recMM(f,c,d,s,1,t.D,t.vocab,!1),g=this.device.createBuffer({size:t.vocab*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});f.copyBufferToBuffer(p,0,g,0,t.vocab*4),this.device.queue.submit([f.finish()]),await g.mapAsync(u.GPUMapMode.READ);let m=new Float32Array(g.getMappedRange().slice(0));return g.unmap(),g.destroy(),this.release(c),m}async lfm2TopKGpu(e,r,t,n,s,i,a,o,u,c,f=64){let d=globalThis;this.lfm2SessionReset(o,a);let p=[],g=this.device.createCommandEncoder(),m=this.recordLfm2(g,p,e,r,t,n,i,a),b=this.recMM(g,p,m,s,1,t.D,t.vocab,!1);if(c&&c!==1&&u.length){let q=Uint32Array.from(u),C=this.bufU32(q,d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST),j=this.uniform([q.length],{offset:4,value:c});this.recordPass(g,"penalize_logits",[j,C,b],this.grid1D(q.length)),p.push(j,C)}let v=this.storage(f*2*4);p.push(v);{let q=this.uniform([t.vocab,f]);this.recordPass(g,this.topKParOk?"top_k_par":"top_k",[q,b,v],[1,1,1]),p.push(q)}let _=this.device.createBuffer({size:f*2*4,usage:d.GPUBufferUsage.COPY_DST|d.GPUBufferUsage.MAP_READ});g.copyBufferToBuffer(v,0,_,0,f*2*4),this.device.queue.submit([g.finish()]),await _.mapAsync(d.GPUMapMode.READ);let B=new Uint32Array(_.getMappedRange().slice(0));return _.unmap(),_.destroy(),this.release(p),{ids:B.slice(0,f),vals:new Float32Array(B.buffer,f*4,f)}}resetRwkvState(){for(let e of this.rwkvStateGpu.values())e.S.destroy?.(),e.tm.destroy?.(),e.cm.destroy?.();this.rwkvStateGpu.clear(),this.rwkvVFirst?.destroy?.(),this.rwkvVFirst=null,this.rwkvSession="";for(let e of this.bufferPool.values())for(let r of e)r.destroy?.();this.bufferPool.clear()}clearRwkvState(){this.resetRwkvState()}ensureRwkvState(e,r,t,n){let s=this.rwkvStateGpu.get(e);if(!s){let i=this.storage(t*n*n*4),a=this.storage(r*4),o=this.storage(r*4);this.device.queue.writeBuffer(i,0,new Float32Array(t*n*n)),this.device.queue.writeBuffer(a,0,new Float32Array(r)),this.device.queue.writeBuffer(o,0,new Float32Array(r)),s={S:i,tm:a,cm:o},this.rwkvStateGpu.set(e,s)}return s}rwkvSessionReset(e,r){(e!==this.rwkvSession||r===0)&&(r>0&&console.error(`[rwkv] session "${e}" inconnue avec pastLen=${r} : \xE9tat perdu, sortie invalide. Repartir de pastLen 0.`),this.resetRwkvState(),this.rwkvSession=e)}recRwkvToken(e,r,t,n,s,i){let{D:a,H:o,NH:u}=n,c=1e-5,f=64e-5;for(let d=0;d<s.length;d++){let p=s[d],g=this.rwkvStateGpu.get(d),m=this.recLayernorm(e,r,t,p.attnNormW,p.attnNormB,1,a,c),b=this.storage(6*a*4);{let R=this.uniform([a]);this.recordPass(e,"rwkv_token_shift",[R,m,g.tm,p.lerpFused,b],this.grid1D(6*a)),r.push(R,b)}e.copyBufferToBuffer(m,0,g.tm,0,a*4);let v=R=>{let K=this.storage(a*4);return e.copyBufferToBuffer(b,R*a*4,K,0,a*4),r.push(K),K},_=v(0),B=v(1),q=v(2),C=v(3),j=v(4),x=v(5),k=this.recMM(e,r,_,p.R,1,a,a,!1),w=this.recMM(e,r,q,p.K,1,a,a,!1),h=this.recMM(e,r,C,p.V,1,a,a,!1),A=this.recUnary(e,r,"tanh_act",this.recMM(e,r,B,p.w1,1,a,p.rw,!1),p.rw),y=this.recMM(e,r,A,p.w2,1,p.rw,a,!1),P=this.storage(a*4);this.recordPass(e,"rwkv_decay",[p.w0,y,P],this.grid1D(a)),r.push(P);let U=this.recMM(e,r,this.recMM(e,r,j,p.a1,1,a,p.ra,!1),p.a2,1,p.ra,a,!1),F=this.storage(a*4);this.recordPass(e,"rwkv_bias_sigmoid",[p.a0,U,F],this.grid1D(a)),r.push(F);let G=this.recUnary(e,r,"sigmoid",this.recMM(e,r,x,p.g1,1,a,p.rg,!1),p.rg),O=this.recMM(e,r,G,p.g2,1,p.rg,a,!1);if(d===0)e.copyBufferToBuffer(h,0,i,0,a*4);else{let R=this.recMM(e,r,this.recMM(e,r,C,p.v1,1,a,p.rv,!1),p.v2,1,p.rv,a,!1);this.recordPass(e,"rwkv_vresid",[h,i,p.v0,R],this.grid1D(a))}let D=this.storage(a*4),E=this.storage(a*4),S=this.storage(a*4);{let R=this.uniform([u,o]);this.recordPass(e,"rwkv_kprep",[R,w,F,p.kk,p.ka,D,E,S],this.grid1D(u)),r.push(R,D,E,S)}let L=this.storage(a*4);{let R=this.uniform([u,o]);this.recordPass(e,"rwkv_wkv7",[R,k,P,D,h,E,S,g.S,L],this.grid1D(u*o)),r.push(R,L)}let z=this.storage(a*4);{let R=this.uniform([u,o],{offset:8,value:f});this.recordPass(e,"rwkv_out_gn",[R,L,k,D,p.rk,h,p.lnWB,z],this.grid1D(u)),r.push(R,z)}let W=this.recBinary(e,r,"mul",z,O,a),V=this.recMM(e,r,W,p.O,1,a,a,!1);t=this.recBinary(e,r,"add",t,V,a);let $=this.recLayernorm(e,r,t,p.attnNorm2W,p.attnNorm2B,1,a,c),X=this.storage(a*4);this.recordPass(e,"rwkv_lerp",[$,g.cm,p.lerpK,X],this.grid1D(a)),r.push(X),e.copyBufferToBuffer($,0,g.cm,0,a*4);let M=this.recUnary(e,r,"sqrelu",this.recMM(e,r,X,p.cmK,1,a,p.ffn,!1),p.ffn),T=this.recMM(e,r,M,p.cmV,1,p.ffn,a,!1);t=this.recBinary(e,r,"add",t,T,a)}return t}recordRwkv(e,r,t,n,s,i,a){let{D:o,H:u,NH:c}=s;for(let d=0;d<i.length;d++)this.ensureRwkvState(d,o,c,u);this.rwkvVFirst||(this.rwkvVFirst=this.storage(o*4));let f=null;for(let d=0;d<n;d++){let p=this.storage(o*4);this.device.queue.writeBuffer(p,0,t.subarray(d*o,(d+1)*o)),r.push(p);let g=this.recLayernorm(e,r,p,a.tokW,a.tokB,1,o,1e-5),m=this.recRwkvToken(e,r,g,s,i,this.rwkvVFirst);d===n-1&&(f=this.recLayernorm(e,r,m,a.outW,a.outB,1,o,1e-5))}return f}async rwkvPrefillGpu(e,r,t,n,s,i,a){this.rwkvSessionReset(a,i);let o=[],u=this.device.createCommandEncoder();this.recordRwkv(u,o,e,r,t,n,s),this.device.queue.submit([u.finish()]),await this.device.queue.onSubmittedWorkDone(),this.release(o)}async rwkvLogitsGpu(e,r,t,n,s,i,a,o){let u=globalThis;this.rwkvSessionReset(o,a);let c=[],f=this.device.createCommandEncoder(),d=this.recordRwkv(f,c,e,r,t,n,i),p=this.recMM(f,c,d,s,1,t.D,t.vocab,!1),g=this.device.createBuffer({size:t.vocab*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});f.copyBufferToBuffer(p,0,g,0,t.vocab*4),this.device.queue.submit([f.finish()]),await g.mapAsync(u.GPUMapMode.READ);let m=new Float32Array(g.getMappedRange().slice(0));return g.unmap(),g.destroy(),this.release(c),m}async rwkvTopKGpu(e,r,t,n,s,i,a,o,u,c,f=64){let d=globalThis;this.rwkvSessionReset(o,a);let p=[],g=this.device.createCommandEncoder(),m=this.recordRwkv(g,p,e,r,t,n,i),b=this.recMM(g,p,m,s,1,t.D,t.vocab,!1);if(c&&c!==1&&u.length){let q=Uint32Array.from(u),C=this.bufU32(q,d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST),j=this.uniform([q.length],{offset:4,value:c});this.recordPass(g,"penalize_logits",[j,C,b],this.grid1D(q.length)),p.push(j,C)}let v=this.storage(f*2*4);p.push(v);{let q=this.uniform([t.vocab,f]);this.recordPass(g,this.topKParOk?"top_k_par":"top_k",[q,b,v],[1,1,1]),p.push(q)}let _=this.device.createBuffer({size:f*2*4,usage:d.GPUBufferUsage.COPY_DST|d.GPUBufferUsage.MAP_READ});g.copyBufferToBuffer(v,0,_,0,f*2*4),this.device.queue.submit([g.finish()]),await _.mapAsync(d.GPUMapMode.READ);let B=new Uint32Array(_.getMappedRange().slice(0));return _.unmap(),_.destroy(),this.release(p),{ids:B.slice(0,f),vals:new Float32Array(B.buffer,f*4,f)}}async argmaxProjection(e,r,t,n,s=!1){let i=globalThis,a=[],o=this.device.createCommandEncoder(),u=this.storage(e.byteLength);this.device.queue.writeBuffer(u,0,e),a.push(u);let c=this.storage(n*4);a.push(c);for(let m of r){let b=this.recMatmulT(o,a,u,m.buf,1,t,m.rows,s);o.copyBufferToBuffer(b,0,c,m.r0*4,m.rows*4)}let f=this.storage(4),d=this.uniform([n]);a.push(f,d),this.recordPass(o,"argmax",[d,c,f],[1,1,1]);let p=this.device.createBuffer({size:4,usage:i.GPUBufferUsage.COPY_DST|i.GPUBufferUsage.MAP_READ});o.copyBufferToBuffer(f,0,p,0,4),this.device.queue.submit([o.finish()]),await p.mapAsync(i.GPUMapMode.READ);let g=new Uint32Array(p.getMappedRange().slice(0))[0];return p.unmap(),p.destroy(),this.release(a),g}async projectLogits(e,r,t,n,s=!1){let i=globalThis,a=[],o=this.device.createCommandEncoder(),u=this.storage(e.byteLength);this.device.queue.writeBuffer(u,0,e),a.push(u);let c=this.storage(n*4);a.push(c);for(let p of r){let g=this.recMatmulT(o,a,u,p.buf,1,t,p.rows,s);o.copyBufferToBuffer(g,0,c,p.r0*4,p.rows*4)}let f=this.device.createBuffer({size:n*4,usage:i.GPUBufferUsage.COPY_DST|i.GPUBufferUsage.MAP_READ});o.copyBufferToBuffer(c,0,f,0,n*4),this.device.queue.submit([o.finish()]),await f.mapAsync(i.GPUMapMode.READ);let d=new Float32Array(f.getMappedRange().slice(0));return f.unmap(),f.destroy(),this.release(a),d}async selfValidate(){this.validationFailure=null;let e=x=>(this.validationFailure=x,console.error("[selfValidate] FAILED at:",x,"(hasF16="+this.hasF16+")"),!1),r=(x,k)=>x.length===k.length&&x.every((w,h)=>Math.abs(w-k[h])<.001),t=x=>Float32Array.from({length:x},()=>Math.random()*2-1),n=3,s=4,i=5,a=t(n*s),o=t(s*i),u=new Float32Array(n*i);for(let x=0;x<n;x++)for(let k=0;k<i;k++){let w=0;for(let h=0;h<s;h++)w+=a[x*s+h]*o[h*i+k];u[x*i+k]=w}if(!r(await this.matmul(a,o,n,s,i),u))return e("matmul");{let x=(w,h,A,y,P)=>{let U=new Float32Array(A*P);for(let F=0;F<A;F++)for(let G=0;G<P;G++){let O=0;for(let D=0;D<y;D++)O+=w[F*y+D]*h[G*y+D];U[F*P+G]=O}return U},k=async(w,h,A)=>{let y=t(w*h),P=t(A*h);return r(await this.matmulT(y,P,w,h,A),x(y,P,w,h,A))};if(!await k(3,8,5))return e("matmulT.vec4(3,8,5)");if(!await k(1,16,7))return e("matmulT.vec4(1,16,7)");if(!await k(2,6,4))return e("matmulT.scalar(2,6,4)");if(this.hasF16){let y=t(16),P=t(112),U=this.uploadGpuF16(P),F=await this.matmulT(y,U,1,16,7,!0),G=new Float32Array(7);for(let L=0;L<7;L++){let z=0;for(let W=0;W<16;W++)z+=y[W]*P[L*16+W];G[L]=z}U.destroy?.();let O=L=>L.length===G.length&&L.every((z,W)=>Math.abs(z-G[W])<=.03*(1+Math.abs(G[W])));if(!O(F))return e("matmulT.f16");let D=this.uploadGpu(P),E=this.f32ToF16Gpu(D,112),S=await this.matmulT(y,E,1,16,7,!0);if(D.destroy?.(),E.destroy?.(),!O(S))return e("packf16")}if(this.hasF16&&this.f16SharedOk){let w=[{m:20,k:128,n:18},{m:32,k:64,n:64},{m:70,k:40,n:130},{m:33,k:48,n:7}];for(let h of w){let A=t(h.m*h.k),y=t(h.n*h.k),P=this.uploadGpuF16(y),U=await this.matmulT(A,P,h.m,h.k,h.n,!0);this.f16SharedOk=!1;let F=await this.matmulT(A,P,h.m,h.k,h.n,!0);if(this.f16SharedOk=!0,P.destroy?.(),!(U.length===F.length&&U.every((O,D)=>Math.abs(O-F[D])<=.001*(1+Math.abs(F[D]))))){this.f16SharedOk=!1,console.warn(`[selfValidate] matmul_t_f16w_shared KO sur ce GPU (m=${h.m}, k=${h.k}, n=${h.n}) : repli sur matmul_t_f16w (plus lent, m\xEAme r\xE9sultat).`);break}}}}{let h=t(128),A=t(768),y=_e(A),P=this.uploadGpuRaw(y.nibbles),U=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),F=this.uploadGpuRaw(new Uint8Array(y.mins.buffer,y.mins.byteOffset,y.mins.byteLength)),G=await this.matmulQ4(h,P,U,F,1,128,6),O=ge(y),D=new Float32Array(6);for(let W=0;W<6;W++){let V=0;for(let $=0;$<128;$++)V+=h[$]*O[W*128+$];D[W]=V}if(P.destroy?.(),U.destroy?.(),F.destroy?.(),!r(G,D))return e("matmulQ4");let E=this.uploadGpu(A),S=this.f32ToQ4Gpu(E,768),L=await this.matmulQ4(h,S.nib,S.sc,S.mn,1,128,6);if(E.destroy?.(),S.nib.destroy?.(),S.sc.destroy?.(),S.mn.destroy?.(),!(L.length===D.length&&L.every((W,V)=>Math.abs(W-D[V])<=.06*(1+Math.abs(D[V]))+.02)))return e("quantize_q4")}{let h=t(640),A=t(768),y=Vr(A),P=this.uploadGpuRaw(new Uint8Array(y.lo.buffer,y.lo.byteOffset,y.lo.byteLength)),U=this.uploadGpuRaw(new Uint8Array(y.hi.buffer,y.hi.byteOffset,y.hi.byteLength)),F=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),G=this.uploadGpuRaw(new Uint8Array(y.mins.buffer,y.mins.byteOffset,y.mins.byteLength)),O=await this.matmulQ3(h,P,U,F,G,5,128,6),D=Me(y),E=new Float32Array(30);for(let S=0;S<5;S++)for(let L=0;L<6;L++){let z=0;for(let W=0;W<128;W++)z+=h[S*128+W]*D[L*128+W];E[S*6+L]=z}if(P.destroy?.(),U.destroy?.(),F.destroy?.(),G.destroy?.(),!r(O,E))return e("matmulQ3")}{let h=t(640),A=t(768),y=_e(A),P=this.uploadGpuRaw(y.nibbles),U=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),F=this.uploadGpuRaw(new Uint8Array(y.mins.buffer,y.mins.byteOffset,y.mins.byteLength)),G=await this.matmulQ4Tiled(h,P,U,F,5,128,6),O=ge(y),D=new Float32Array(30);for(let E=0;E<5;E++)for(let S=0;S<6;S++){let L=0;for(let z=0;z<128;z++)L+=h[E*128+z]*O[S*128+z];D[E*6+S]=L}if(P.destroy?.(),U.destroy?.(),F.destroy?.(),!r(G,D))return e("matmul_q4_tiled")}for(let x of[{m:20,n:18},{m:32,n:64},{m:70,n:130}]){let k=x.m,w=128,h=x.n,A=t(k*w),y=t(h*w),P=_e(y),U=this.uploadGpuRaw(P.nibbles),F=this.uploadGpuRaw(new Uint8Array(P.scales.buffer,P.scales.byteOffset,P.scales.byteLength)),G=this.uploadGpuRaw(new Uint8Array(P.mins.buffer,P.mins.byteOffset,P.mins.byteLength)),O=await this.matmulQ4Shared(A,U,F,G,k,w,h),D=ge(P),E=new Float32Array(k*h);for(let S=0;S<k;S++)for(let L=0;L<h;L++){let z=0;for(let W=0;W<w;W++)z+=A[S*w+W]*D[L*w+W];E[S*h+L]=z}if(U.destroy?.(),F.destroy?.(),G.destroy?.(),!r(O,E))return e(`matmul_q4_shared(${k},${h})`)}{let h=t(128),A=t(768),y=Ge(A),P=this.uploadGpuRaw(new Uint8Array(y.codes.buffer,y.codes.byteOffset,y.codes.byteLength)),U=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),F=await this.matmulQ8(h,P,U,1,128,6),G=he(y),O=new Float32Array(6);for(let L=0;L<6;L++){let z=0;for(let W=0;W<128;W++)z+=h[W]*G[L*128+W];O[L]=z}if(P.destroy?.(),U.destroy?.(),!r(F,O))return e("matmulQ8");let D=this.uploadGpu(A),E=this.f32ToQ8Gpu(D,768),S=await this.matmulQ8(h,E.codes,E.sc,1,128,6);if(D.destroy?.(),E.codes.destroy?.(),E.sc.destroy?.(),!r(S,O))return e("quantize_q8")}{let h=t(640),A=t(768),y=Ge(A),P=this.uploadGpuRaw(new Uint8Array(y.codes.buffer,y.codes.byteOffset,y.codes.byteLength)),U=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),F=await this.matmulQ8Tiled(h,P,U,5,128,6),G=he(y),O=new Float32Array(30);for(let D=0;D<5;D++)for(let E=0;E<6;E++){let S=0;for(let L=0;L<128;L++)S+=h[D*128+L]*G[E*128+L];O[D*6+E]=S}if(P.destroy?.(),U.destroy?.(),!r(F,O))return e("matmul_q8_tiled")}for(let x of[{k:128,n:6},{k:128,n:130},{k:4096,n:17}]){let k=x.k,w=x.n,h=t(k),A=t(w*k),y=_e(A),P=this.uploadGpuRaw(y.nibbles),U=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),F=this.uploadGpuRaw(new Uint8Array(y.mins.buffer,y.mins.byteOffset,y.mins.byteLength)),G=await this.matmulQ4Vec(h,P,U,F,k,w),O=ge(y),D=new Float32Array(w);for(let $=0;$<w;$++){let X=0;for(let M=0;M<k;M++)X+=h[M]*O[$*k+M];D[$]=X}if(P.destroy?.(),U.destroy?.(),F.destroy?.(),!r(G,D))return e(`matmul_q4_vec(${k},${w})`);let E=Ge(A),S=this.uploadGpuRaw(new Uint8Array(E.codes.buffer,E.codes.byteOffset,E.codes.byteLength)),L=this.uploadGpuRaw(new Uint8Array(E.scales.buffer,E.scales.byteOffset,E.scales.byteLength)),z=await this.matmulQ8Vec(h,S,L,k,w),W=he(E),V=new Float32Array(w);for(let $=0;$<w;$++){let X=0;for(let M=0;M<k;M++)X+=h[M]*W[$*k+M];V[$]=X}if(S.destroy?.(),L.destroy?.(),!r(z,V))return e(`matmul_q8_vec(${k},${w})`)}for(let x of[{m:20,n:18},{m:32,n:64},{m:70,n:130}]){let k=x.m,w=128,h=x.n,A=t(k*w),y=t(h*w),P=Ge(y),U=this.uploadGpuRaw(new Uint8Array(P.codes.buffer,P.codes.byteOffset,P.codes.byteLength)),F=this.uploadGpuRaw(new Uint8Array(P.scales.buffer,P.scales.byteOffset,P.scales.byteLength)),G=await this.matmulQ8Shared(A,U,F,k,w,h),O=he(P),D=new Float32Array(k*h);for(let E=0;E<k;E++)for(let S=0;S<h;S++){let L=0;for(let z=0;z<w;z++)L+=A[E*w+z]*O[S*w+z];D[E*h+S]=L}if(U.destroy?.(),F.destroy?.(),!r(G,D))return e(`matmul_q8_shared(${k},${h})`)}if(this.qShared2Ok){let x=[{m:64,k:128,n:128},{m:65,k:128,n:130},{m:100,k:160,n:18},{m:70,k:96,n:200}];for(let k of x){let w=k.m,h=k.k,A=k.n,y=t(w*h),P=t(A*h),U=new Float32Array(w*A),F=Ge(P),G=he(F);for(let M=0;M<w;M++)for(let T=0;T<A;T++){let R=0;for(let K=0;K<h;K++)R+=y[M*h+K]*G[T*h+K];U[M*A+T]=R}let O=this.uploadGpuRaw(new Uint8Array(F.codes.buffer,F.codes.byteOffset,F.codes.byteLength)),D=this.uploadGpuRaw(new Uint8Array(F.scales.buffer,F.scales.byteOffset,F.scales.byteLength)),E=await this.matmulQ8Shared2(y,O,D,w,h,A);O.destroy?.(),D.destroy?.();let S=_e(P),L=ge(S),z=new Float32Array(w*A);for(let M=0;M<w;M++)for(let T=0;T<A;T++){let R=0;for(let K=0;K<h;K++)R+=y[M*h+K]*L[T*h+K];z[M*A+T]=R}let W=this.uploadGpuRaw(S.nibbles),V=this.uploadGpuRaw(new Uint8Array(S.scales.buffer,S.scales.byteOffset,S.scales.byteLength)),$=this.uploadGpuRaw(new Uint8Array(S.mins.buffer,S.mins.byteOffset,S.mins.byteLength)),X=await this.matmulQ4Shared2(y,W,V,$,w,h,A);if(W.destroy?.(),V.destroy?.(),$.destroy?.(),!r(E,U)||!r(X,z)){this.qShared2Ok=!1,console.warn(`[selfValidate] matmul_t_q8/q4_shared2 KO sur ce GPU (m=${w}, k=${h}, n=${A}) : repli sur les tuiles 32\xD764 v1 (plus lentes, m\xEAme r\xE9sultat).`);break}}}{let k=t(1632),w=new Uint8Array(k.buffer,k.byteOffset,k.byteLength),h=(A,y)=>A.length===y.length&&A.every((P,U)=>P===y[U]);if(!h(await this.quantizeToBytes("F32",w,1632,"q8"),await this.quantizeToBytes("F32",w,1632,"q8",256)))return e("quantize_chunk_q8");if(!h(await this.quantizeToBytes("F32",w,1632,"q4"),await this.quantizeToBytes("F32",w,1632,"q4",256)))return e("quantize_chunk_q4")}let c=2,f=8,d=t(c*f),p=t(f),g=new Float32Array(c*f);for(let x=0;x<c;x++){let k=0;for(let h=0;h<f;h++)k+=d[x*f+h]**2;let w=1/Math.sqrt(k/f+1e-5);for(let h=0;h<f;h++)g[x*f+h]=d[x*f+h]*w*p[h]}if(!r(await this.rmsnorm(d,p,c,f),g))return e("rmsnorm");if(!r(await this.rmsnorm(d,p,c,f,1e-5,!0),Re(d,p,c,f,1e-5,!0)))return e("rmsnorm.onePlus");let m=t(16),b=t(16),v=m.map((x,k)=>x/(1+Math.exp(-x))*b[k]);if(!r(await this.swiglu(m,b),v))return e("swiglu");let _=m.map((x,k)=>tn(x)*b[k]);if(!r(await this.geglu(m,b),_))return e("geglu");let B=m.map((x,k)=>x+b[k]);if(!r(await this.add(m,b),B))return e("add");{let x=ee.MAX_WG_DIM*ue+257,k=new Float32Array(x),w=new Float32Array(x),h=[0,1,ue-1,ue,ee.MAX_WG_DIM*ue-1,ee.MAX_WG_DIM*ue,x-1];for(let P of h)k[P]=P%7-3,w[P]=P%5-2;let A=await this.add(k,w),y=A.length===x;for(let P of h)Math.abs(A[P]-(k[P]+w[P]))>1e-5&&(y=!1);if(!y)return e("grid1D.add(2D)")}let q=(x,k,w=.003)=>x.length===k.length&&x.every((h,A)=>Math.abs(h-k[A])<=w*(1+Math.abs(k[A])));{let y=t(8);if(!q(await this.rope(y,2,4,2,1,1e4),Je(y,2,4,2,1,1e4)))return e("rope")}{let y=t(384),P=new Float32Array(64/2).fill(1);if(!q(await this.ropeFactors(y,P,6,64,2,7,5e5),Je(y,6,64,2,7,5e5)))return e("rope_factors.ones");let U=Float32Array.from({length:64/2},(F,G)=>1+G%5*.7);if(!q(await this.ropeFactors(y,U,6,64,2,7,5e5),Ts(y,U,6,64,2,7,5e5)))return e("rope_factors")}{let y=t(384);if(!q(await this.rope(y,6,64,2,7,5e5,!0),ht(y,6,64,2,7,5e5)))return e("rope.interleaved");let P=t(8);if(!q(await this.rope(P,2,4,2,3,1e4,!0),ht(P,2,4,2,3,1e4)))return e("rope.interleaved.hd4");let U=t(384);if(!q(await this.rope(U,6,64,2,0,5e5,!0),ht(U,6,64,2,0,5e5)))return e("rope.interleaved.pos0");let F=64/2,G=new Float32Array(384);for(let L=0;L<6;L++)for(let z=0;z<F;z++)G[L*64+2*z]=y[L*64+z],G[L*64+2*z+1]=y[L*64+z+F];let O=await this.rope(G,6,64,2,7,5e5,!0),D=await this.rope(y,6,64,2,7,5e5,!1),E=new Float32Array(384);for(let L=0;L<6;L++)for(let z=0;z<F;z++)E[L*64+2*z]=D[L*64+z],E[L*64+2*z+1]=D[L*64+z+F];if(!q(O,E))return e("rope.interleaved.equivalence");let S=Float32Array.from({length:F},(L,z)=>1+z%5*.7);if(!q(await this.ropeFactors(y,S,6,64,2,7,5e5,!0),ht(y,6,64,2,7,5e5,S)))return e("rope_factors.interleaved")}{let w=[16,24,24],h=1e6,A=3,y=A*2,P=5,U=t(y*128),F=new Uint32Array(A*3);for(let E=0;E<A;E++){let S=P+E;F.set([S,S,S],E*3)}let G=new Uint32Array([5,5,5,5,6,9,5,7,5]),O=q(await this.ropeMrope(U,F,y,128,2,w,h),Je(U,y,128,2,P,h)),D=q(await this.ropeMrope(U,G,y,128,2,w,h),Ss(U,G,y,128,2,w,h));(!O||!D)&&(this.mropeOk=!1,console.error(`[selfValidate] rope_mrope KO sur ce GPU (${O?"positions 3D":"d\xE9g\xE9n\xE9r\xE9\u2260rope"}). Vision d\xE9sactiv\xE9e, chat texte intact.`))}{let P=t(32),U=t(32),F=t(32);if(!q(await this.attention(P,U,F,2,4,2,4,2),Ae(P,U,F,2,4,2,4,2)))return e("attention");let G=.3,O=5;if(!q(await this.attention(P,U,F,2,4,2,4,2,G,O),Ae(P,U,F,2,4,2,4,2,G,O)))return e("attention.softcap");{let V=t(24),$=t(48),X=t(48);for(let M of[1,4,8,64]){if(!q(await this.attention(V,$,X,3,2,1,4,9,void 0,0,M),Ae(V,$,X,3,2,1,4,9,void 0,0,M)))return e(`attention.window(${M})`);if(!q(await this.attentionDecode(V,$,X,3,2,1,4,9,void 0,0,M),Ae(V,$,X,3,2,1,4,9,void 0,0,M)))return e(`attention_decode.window(${M})`)}}{let D=await this.quantizeKvReadback(U,4,2,4),E=await this.quantizeKvReadback(F,4,2,4),S=await this.attentionQ8Kv(P,D.codes,D.scales,E.codes,E.scales,2,4,2,4,2),L=(X,M)=>{let T=new Float32Array(32);for(let R=0;R<4;R++)for(let K=0;K<2;K++){let N=M[R*2+K];for(let I=0;I<4;I++){let Q=R*2*4+K*4+I,H=X[Q>>2]>>(Q&3)*8&255;T[Q]=(H<128?H:H-256)*N}}return T},z=L(D.codes,D.scales),W=L(E.codes,E.scales),V=Ae(P,z,W,2,4,2,4,2);if(!q(S,V,.005))return e("attention.q8kv");let $=0;for(let X=0;X<U.length;X++)$=Math.max($,Math.abs(z[X]-U[X]));if($>.05)return e("quantize_kv.error")}}{let x=w=>{this.attnDecodeOk=!1,console.error("[selfValidate] attention d\xE9codage HS sur ce GPU (\xE9tape :",w,") \u2192 repli kernels classiques (plus lents \xE0 contexte long, corrects)")},k=[{nT:1,nH:14,nKv:2,hd:64,past:300},{nT:10,nH:14,nKv:2,hd:64,past:173}];for(let w of k){if(!this.attnDecodeOk)break;let h=w.past+w.nT,A=t(w.nT*w.nH*w.hd),y=t(h*w.nKv*w.hd),P=t(h*w.nKv*w.hd);if(!q(await this.attentionDecode(A,y,P,w.nT,w.nH,w.nKv,w.hd,w.past),Ae(A,y,P,w.nT,w.nH,w.nKv,w.hd,w.past))){x(`decode(nT=${w.nT})`);break}let U=await this.quantizeKvReadback(y,h,w.nKv,w.hd),F=await this.quantizeKvReadback(P,h,w.nKv,w.hd),G=await this.attentionQ8KvDecode(A,U.codes,U.scales,F.codes,F.scales,w.nT,w.nH,w.nKv,w.hd,w.past),O=await this.attentionQ8Kv(A,U.codes,U.scales,F.codes,F.scales,w.nT,w.nH,w.nKv,w.hd,w.past);if(!q(G,O,.005)){x(`decode.q8kv(nT=${w.nT})`);break}}if(this.attnDecodeOk){let U=t(64),F=t(350*8),G=t(350*8);q(await this.attentionDecode(U,F,G,2,4,2,8,173,.3,5),Ae(U,F,G,2,4,2,8,173,.3,5))||x("decode.softcap")}if(this.attnDecodeOk){let U=t(256),F=t(9088),G=t(9088);q(await this.attentionDecode(U,F,G,1,2,1,128,70),Ae(U,F,G,1,2,1,128,70))||x("decode.hd128")}}{let x=h=>{this.attnPrefillOk=!1,console.error("[selfValidate] attention prefill tuil\xE9e HS sur ce GPU (\xE9tape :",h,") \u2192 repli kernel classique (plus lent en prefill, correct)")},k=[{nT:37,nH:14,nKv:2,hd:64,past:0,sc:void 0,cap:0,win:0},{nT:13,nH:14,nKv:2,hd:64,past:173,sc:void 0,cap:0,win:0},{nT:1,nH:14,nKv:2,hd:64,past:300,sc:void 0,cap:0,win:0},{nT:4,nH:4,nKv:2,hd:32,past:7,sc:void 0,cap:0,win:0},{nT:5,nH:4,nKv:2,hd:32,past:0,sc:void 0,cap:0,win:0},{nT:9,nH:2,nKv:1,hd:128,past:70,sc:void 0,cap:0,win:0},{nT:6,nH:4,nKv:2,hd:8,past:17,sc:.3,cap:5,win:0}];for(let h of k){let A=h.past+h.nT,y=t(h.nT*h.nH*h.hd),P=t(A*h.nKv*h.hd),U=t(A*h.nKv*h.hd);if(!q(await this.attentionPrefill(y,P,U,h.nT,h.nH,h.nKv,h.hd,h.past,h.sc,h.cap,h.win),Ae(y,P,U,h.nT,h.nH,h.nKv,h.hd,h.past,h.sc,h.cap,h.win))){x(`prefill(nT=${h.nT},hd=${h.hd},past=${h.past}${h.cap>0?",softcap":""})`);break}}if(this.attnPrefillOk){let G=t(80),O=t(76),D=t(76);for(let E of[1,4,8,64])if(!q(await this.attentionPrefill(G,O,D,10,2,1,4,9,void 0,0,E),Ae(G,O,D,10,2,1,4,9,void 0,0,E))){x(`prefill.window(${E})`);break}}let w=[{nT:37,nH:14,nKv:2,hd:64,past:0,win:0},{nT:13,nH:14,nKv:2,hd:64,past:173,win:0},{nT:10,nH:2,nKv:1,hd:8,past:9,win:4}];for(let h of w){if(!this.attnPrefillOk)break;let A=h.past+h.nT,y=t(h.nT*h.nH*h.hd),P=t(A*h.nKv*h.hd),U=t(A*h.nKv*h.hd),F=await this.quantizeKvReadback(P,A,h.nKv,h.hd),G=await this.quantizeKvReadback(U,A,h.nKv,h.hd),O=await this.attentionQ8KvPrefill(y,F.codes,F.scales,G.codes,G.scales,h.nT,h.nH,h.nKv,h.hd,h.past,void 0,0,h.win),D=await this.attentionQ8Kv(y,F.codes,F.scales,G.codes,G.scales,h.nT,h.nH,h.nKv,h.hd,h.past,void 0,0,h.win);if(!q(O,D,.005)){x(`prefill.q8kv(nT=${h.nT},win=${h.win})`);break}}}{let x=w=>{this.rmsVecOk=!1,console.error("[selfValidate] RMSNorm parall\xE8le HS sur ce GPU (\xE9tape :",w,") \u2192 repli kernel une-ligne-par-thread (correct, plus lent en d\xE9codage)")},k=[{rows:1,dim:1024,onePlus:!1},{rows:1,dim:1536,onePlus:!1},{rows:1,dim:100,onePlus:!1},{rows:14,dim:64,onePlus:!1},{rows:37,dim:2048,onePlus:!1},{rows:3,dim:128,onePlus:!0}];for(let w of k){let h=t(w.rows*w.dim),A=t(w.dim),y=await this.rmsnormVec(h,A,w.rows,w.dim,1e-6,w.onePlus),P=await this.rmsnorm(h,A,w.rows,w.dim,1e-6,w.onePlus);if(!q(y,P,.005)){x(`rmsnorm_vec(${w.rows}\xD7${w.dim}${w.onePlus?",1+w":""})`);break}}}{let x=w=>{this.topKParOk=!1,console.error("[selfValidate] top-K parall\xE8le HS sur ce GPU (\xE9tape :",w,") \u2192 repli s\xE9lection sur un thread (correcte, plus lente)")},k=[{n:151936,k:64,ties:!1,label:"vocab Qwen (151936)"},{n:65536,k:64,ties:!1,label:"vocab World (65536)"},{n:1e3,k:64,ties:!1,label:"n non multiple de 128"},{n:300,k:64,ties:!1,label:"n < 1024 candidats"},{n:4096,k:8,ties:!1,label:"petit K"},{n:8192,k:64,ties:!0,label:"EX \xC6QUO (d\xE9partage)"}];for(let w of k){if(!this.topKParOk)break;let h=w.ties?Float32Array.from({length:w.n},(U,F)=>Math.round(Math.random()*6)+(F%7===0?3:0)):t(w.n),A=await this.topKReadback(h,w.k,"top_k"),y=await this.topKReadback(h,w.k,"top_k_par");if(!(A.length===y.length&&A.every((U,F)=>U===y[F]))){let U=A.findIndex((F,G)=>F!==y[G]);x(`top_k_par(${w.label}). Premier \xE9cart au rang ${U} : ${A[U]} vs ${y[U]}`);break}}}{let U={seq:3,d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},F={attnNorm:t(16),wq:t(256),wk:t(128),wv:t(128),wo:t(256),bq:t(16),bk:t(8),bv:t(8),ffnNorm:t(16),wgate:t(256),wup:t(256),wdown:t(256)},G=t(48);if(!q(await this.layerForward(G,U,F),Wt(G,U,F),.005))return e("layerForward")}{let F={seq:3,d:12,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6,attnScale:1/Math.sqrt(4),attnLogitSoftcap:5,act:"gelu",rmsGainOnePlus:!0},G={attnNorm:t(12),wq:t(192),wk:t(96),wv:t(96),wo:t(192),ffnNorm:t(12),wgate:t(192),wup:t(192),wdown:t(192),postAttnNorm:t(12),postFfnNorm:t(12)},O=t(36);if(!q(await this.layerForward(O,F,G),Wt(O,F,G),.005))return e("layerForward.gemma2")}{let F={seq:3,d:12,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e6,eps:1e-6},G={attnNorm:t(12),wq:t(192),wk:t(96),wv:t(96),wo:t(192),ffnNorm:t(12),wgate:t(192),wup:t(192),wdown:t(192),qNorm:t(4),kNorm:t(4)},O=t(36);if(!q(await this.layerForward(O,F,G),Wt(O,F,G),.005))return e("layerForward.qwen3")}{let k=new Uint8Array(720);for(let h=0;h<5;h++){let A=h*144,y=new DataView(k.buffer);y.setUint16(A,qe(.005+Math.random()*.05),!0),y.setUint16(A+2,qe(.001+Math.random()*.02),!0);for(let P=4;P<144;P++)k[A+P]=Math.random()*256|0}let w=await this.dequantizeQ4K(k,5*256);if(!q(w,_s(k,5),1e-4))return e("dequant.Q4_K")}{let x=G=>{let O=new Uint8Array(G);for(let D=0;D<G;D++)O[D]=Math.random()*256|0;return O},k=(G,O)=>{let D=new DataView(G.buffer),E=S=>O===210?S*210+208:S*O;for(let S=0;S*O<G.length;S++)D.setUint16(E(S),qe(.005+Math.random()*.05),!0);return G},h=k(x(136),34);if(!q(await this.dequantizeByType("Q8_0",h,128),Us(h,4),1e-4))return e("dequant.Q8_0");let A=k(x(88),22);if(!q(await this.dequantizeByType("Q5_0",A,128),Gs(A,4),1e-4))return e("dequant.Q5_0");let y=k(x(840),210);if(!q(await this.dequantizeByType("Q6_K",y,4*256),Fs(y,4),1e-4))return e("dequant.Q6_K");let P=k(x(72),18);if(!q(await this.dequantizeByType("Q4_0",P,128),Bs(P,4),1e-4))return e("dequant.Q4_0");let U=x(704),F=new DataView(U.buffer);for(let G=0;G<4;G++)F.setUint16(G*176,qe(.005+Math.random()*.05),!0),F.setUint16(G*176+2,qe(.001+Math.random()*.02),!0);if(!q(await this.dequantizeByType("Q5_K",U,4*256),qs(U,4),1e-4))return e("dequant.Q5_K");if(this.dequantQ3kOk){let G=x(440),O=new DataView(G.buffer);for(let E=0;E<4;E++)O.setUint16(E*110+108,qe(.005+Math.random()*.05),!0);let D=await this.dequantizeByType("Q3_K",G,4*256);q(D,zt(G,4),1e-4)||(this.dequantQ3kOk=!1,console.warn("[selfValidate] dequant.Q3_K en \xE9chec, repli sur CPU"))}if(this.dequantQ41Ok){let G=x(80),O=new DataView(G.buffer);for(let E=0;E<4;E++)O.setUint16(E*20,qe(.005+Math.random()*.05),!0),O.setUint16(E*20+2,qe(.001+Math.random()*.02),!0);let D=await this.dequantizeByType("Q4_1",G,128);q(D,Ht(G,4),1e-4)||(this.dequantQ41Ok=!1,console.warn("[selfValidate] dequant.Q4_1 en \xE9chec, repli sur CPU"))}}{let P={d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},U={attnNorm:t(16),wq:t(256),wk:t(128),wv:t(128),wo:t(256),bq:t(16),bk:t(8),bv:t(8),ffnNorm:t(16),wgate:t(256),wup:t(256),wdown:t(256)},F=t(48),O=(await this.layerForward(F,{...P,seq:3},U)).slice(32,48),D=new Float32Array(0),E=await this.layerForwardKV(F.slice(0,32),{...P,seq:2},U,0,D,D),S=await this.layerForwardKV(F.slice(32,48),{...P,seq:1},U,2,E.k,E.v);if(!q(S.out,O,.005))return e("layerForwardKV")}{let w=t(4),h=t(40),A=new Float32Array(10);for(let F=0;F<10;F++){let G=0;for(let O=0;O<4;O++)G+=w[O]*h[F*4+O];A[F]=G}let y=0;for(let F=1;F<10;F++)A[F]>A[y]&&(y=F);let P=this.uploadGpu(h),U=await this.argmaxProjection(w,[{buf:P,rows:10,r0:0}],4,10,!1);if(P.destroy?.(),U!==y)return e("argmaxProjection")}{let P={seq:4,d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},U={attnNorm:t(16),wq:t(256),wk:t(128),wv:t(128),wo:t(256),bq:t(16),bk:t(8),bv:t(8),ffnNorm:t(16),wgate:t(256),wup:t(256),wdown:t(256)},F=t(16),G=t(64),O=new Float32Array(0),D=await this.layerForwardKV(G,{...P,seq:4},U,0,O,O,!0),E=Re(D.out.slice(48,64),F,1,16,1e-6),S={attnNorm:this.uploadGpu(U.attnNorm),wq:this.uploadGpu(U.wq),wk:this.uploadGpu(U.wk),wv:this.uploadGpu(U.wv),wo:this.uploadGpu(U.wo),ffnNorm:this.uploadGpu(U.ffnNorm),wgate:this.uploadGpu(U.wgate),wup:this.uploadGpu(U.wup),wdown:this.uploadGpu(U.wdown),bq:this.uploadGpu(U.bq),bk:this.uploadGpu(U.bk),bv:this.uploadGpu(U.bv)},L=this.uploadGpu(F),z=this.kvQuant;this.kvQuant=!1,this.resetKvGpu();let W=await this.runDecodeGpu(G,{...P,seq:4},[S],0,L,"selftest-A");if(!q(W,E,.008))return this.resetKvGpu(),this.kvQuant=z,e("runDecodeGpu.prefill");await this.runDecodeGpu(G.slice(0,48),{...P,seq:3},[S],0,L,"selftest-B");let V=await this.runDecodeGpu(G.slice(48,64),{...P,seq:1},[S],3,L,"selftest-B");if(!q(V,E,.008))return this.resetKvGpu(),this.kvQuant=z,e("runDecodeGpu.decode");this.kvQuant=z,this.resetKvGpu();for(let $ of Object.values(S))$?.destroy?.();L.destroy?.()}{let A=Float32Array.from({length:152064},()=>(Math.random()*2-1)*8),y=[...new Set(Array.from({length:40},()=>Math.floor(Math.random()*152064)))],P=A.slice();for(let T=0;T<152064;T++)P[T]=30*Math.tanh(P[T]/30);for(let T of y)P[T]=P[T]>0?P[T]/1.15:P[T]*1.15;let U=Array.from(P.keys()).sort((T,R)=>P[R]-P[T]).slice(0,64),F=globalThis,G=[],O=this.storage(152064*4);this.device.queue.writeBuffer(O,0,A),G.push(O);let D=this.device.createCommandEncoder(),E=this.uniform([152064],{offset:4,value:30});this.recordPass(D,"softcap_logits",[E,O],this.grid1D(152064));let S=this.bufU32(Uint32Array.from(y),F.GPUBufferUsage.STORAGE|F.GPUBufferUsage.COPY_DST),L=this.uniform([y.length],{offset:4,value:1.15});this.recordPass(D,"penalize_logits",[L,S,O],this.grid1D(y.length));let z=this.storage(512),W=this.uniform([152064,64]);this.recordPass(D,this.topKParOk?"top_k_par":"top_k",[W,O,z],[1,1,1]),G.push(E,S,L,W,z);let V=this.device.createBuffer({size:512,usage:F.GPUBufferUsage.COPY_DST|F.GPUBufferUsage.MAP_READ});D.copyBufferToBuffer(z,0,V,0,512),this.device.queue.submit([D.finish()]),await V.mapAsync(F.GPUMapMode.READ);let $=new Uint32Array(V.getMappedRange().slice(0));V.unmap(),V.destroy(),this.release(G);let X=$.slice(0,64),M=new Float32Array($.buffer,256,64);this.topKOk=!0;for(let T=0;T<64;T++){let R=Math.abs(M[T]-P[U[T]])<=1e-4*(1+Math.abs(P[U[T]])),K=Math.abs(P[X[T]]-M[T])<=1e-4*(1+Math.abs(M[T]));if(!R||!K){this.topKOk=!1,console.error(`[selfValidate] top_k KO sur ce GPU (rang ${T}) : repli sur le sampling CPU plein-vocab (plus lent, m\xEAme r\xE9sultat).`);break}}}if(this.rwkvWkv7Ok){let h=t(128),A=t(16),y=t(16),P=t(16),U=t(16),F=t(16),G=Float32Array.from({length:16},()=>Math.random()*.5+.5),O=h.slice(),D=new Float32Array(16);for(let M=0;M<2;M++){let T=M*8;for(let R=0;R<8;R++){let K=M*8*8+R*8,N=P[T+R],I=0;for(let H=0;H<8;H++)I+=F[T+H]*O[K+H];let Q=0;for(let H=0;H<8;H++){let Y=G[T+H]*O[K+H]+N*y[T+H]+U[T+H]*I;O[K+H]=Y,Q+=A[T+H]*Y}D[T+R]=Q}}let E=await this.rwkvWkv7(h.slice(),A,G,y,P,F,U,2,8),S=(M,T)=>M.length===T.length&&M.every((R,K)=>Math.abs(R-T[K])<=.001*(1+Math.abs(T[K])));!S(E.S,O)||!S(E.y,D)?(this.rwkvWkv7Ok=!1,console.error("[selfValidate] RWKV-7 WKV KO sur ce GPU : une archi RWKV (moteur v2) refuserait de charger (non bloquant pour le chat texte).")):console.log("[selfValidate] RWKV-7 WKV OK (r\xE9currence \xE0 \xE9tat fixe, moteur v2)");let L=16,z=t(L),W=t(L),V=t(L*6),$=new Float32Array(L*6);for(let M=0;M<6;M++)for(let T=0;T<L;T++){let R=M*L+T;$[R]=z[T]+(W[T]-z[T])*V[R]}let X=await this.rwkvTokenShift(z,W,V,L);if(S(X,$)?console.log("[selfValidate] RWKV-7 token-shift OK"):(this.rwkvWkv7Ok=!1,console.error("[selfValidate] RWKV-7 token-shift KO sur ce GPU (non bloquant pour le chat texte).")),this.rwkvResidentOk){let M=globalThis,T=M.GPUBufferUsage.STORAGE|M.GPUBufferUsage.COPY_DST|M.GPUBufferUsage.COPY_SRC,R=2,K=8,N=R*K,I=(H,Y)=>{let ne=Math.max(16,Math.ceil((H.length*4+(Y?4:0))/16)*16),te=this.device.createBuffer({size:ne,usage:M.GPUBufferUsage.UNIFORM|M.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(te,0,new Uint32Array(H)),Y&&this.device.queue.writeBuffer(te,Y.off,new Float32Array([Y.val])),te},Q=H=>this.device.createBuffer({size:H*4,usage:T});try{let H=t(N),Y=t(N),ne=t(N),te=Float32Array.from({length:N},()=>Math.random()),ie=new Float32Array(N),le=new Float32Array(N),pe=new Float32Array(N);for(let fe=0;fe<R;fe++){let ae=0;for(let ye=0;ye<K;ye++){let me=H[fe*K+ye]*Y[fe*K+ye];ae+=me*me}ae=Math.sqrt(ae)||1e-12;for(let ye=0;ye<K;ye++){let me=fe*K+ye,ct=H[me]*Y[me]/ae;le[me]=-ct,pe[me]=ct*te[me],ie[me]=H[me]*(1+(te[me]-1)*ne[me])}}let J=Q(N),Te=Q(N),Z=Q(N);this.dispatch("rwkv_kprep",[I([R,K]),this.buf(H,T),this.buf(te,T),this.buf(Y,T),this.buf(ne,T),J,Te,Z],this.grid1D(R));let Oe=S(await this.readBack(J,N*4),ie)&&S(await this.readBack(Te,N*4),le)&&S(await this.readBack(Z,N*4),pe);J.destroy?.(),Te.destroy?.(),Z.destroy?.();let ve=t(N),hr=t(N),br=t(N),vr=t(N),wr=t(N),yr=t(N),kr=new Float32Array(N);for(let fe=0;fe<R;fe++){let ae=fe*K,ye=0;for(let ce=0;ce<K;ce++)ye+=ve[ae+ce];ye/=K;let me=0;for(let ce=0;ce<K;ce++){let Dr=ve[ae+ce]-ye;me+=Dr*Dr}me/=K;let ct=1/Math.sqrt(me+64e-5),Lr=0;for(let ce=0;ce<K;ce++)Lr+=hr[ae+ce]*ie[ae+ce]*br[ae+ce];for(let ce=0;ce<K;ce++)kr[ae+ce]=(ve[ae+ce]-ye)*ct*wr[ae+ce]+yr[ae+ce]+Lr*vr[ae+ce]}let St=new Float32Array(2*N);St.set(wr,0),St.set(yr,N);let Tt=Q(N);this.dispatch("rwkv_out_gn",[I([R,K],{off:8,val:64e-5}),this.buf(ve,T),this.buf(hr,T),this.buf(ie,T),this.buf(br,T),this.buf(vr,T),this.buf(St,T),Tt],this.grid1D(R));let xr=S(await this.readBack(Tt,N*4),kr);Tt.destroy?.();let Ar=t(N),Pr=t(N),os=Float32Array.from(Ar,(fe,ae)=>Math.exp(-.606531/(1+Math.exp(-(fe+Pr[ae]))))),Ot=Q(N);this.dispatch("rwkv_decay",[this.buf(Ar,T),this.buf(Pr,T),Ot],this.grid1D(N));let _r=S(await this.readBack(Ot,N*4),os);Ot.destroy?.();let Ur=t(N),Gr=t(N),Br=t(N),qr=t(N),us=Float32Array.from(Ur,(fe,ae)=>fe+(Gr[ae]-fe)*(1/(1+Math.exp(-(Br[ae]+qr[ae]))))),Ct=this.buf(Ur,T);this.dispatch("rwkv_vresid",[Ct,this.buf(Gr,T),this.buf(Br,T),this.buf(qr,T)],this.grid1D(N));let Fr=S(await this.readBack(Ct,N*4),us);Ct.destroy?.();let Sr=t(N),Tr=t(N),Or=t(N),cs=Float32Array.from(Sr,(fe,ae)=>fe+(Tr[ae]-fe)*Or[ae]),Mt=Q(N);this.dispatch("rwkv_lerp",[this.buf(Sr,T),this.buf(Tr,T),this.buf(Or,T),Mt],this.grid1D(N));let Cr=S(await this.readBack(Mt,N*4),cs);Mt.destroy?.();let Mr=t(N),ls=Float32Array.from(Mr,fe=>{let ae=Math.max(fe,0);return ae*ae}),Rt=Q(N);this.dispatch("sqrelu",[this.buf(Mr,T),Rt],this.grid1D(N));let Rr=S(await this.readBack(Rt,N*4),ls);Rt.destroy?.(),!Oe||!xr||!_r||!Fr||!Cr||!Rr?(this.rwkvResidentOk=!1,console.error(`[selfValidate] glu RWKV r\xE9sidente KO sur ce GPU (kprep:${Oe} gn:${xr} decay:${_r} vresid:${Fr} lerp:${Cr} sqrelu:${Rr}). Repli forwardToken JS+readback (correct, lent).`)):console.log("[selfValidate] glu RWKV r\xE9sidente OK (kprep, out_gn, decay, vresid, lerp, sqrelu)")}catch(H){this.rwkvResidentOk=!1,console.error("[selfValidate] glu RWKV r\xE9sidente : erreur d\u2019ex\xE9cution. Repli forwardToken JS+readback.",H)}}}if(this.lfm2ShortConvOk){let x=O=>Float32Array.from({length:O},()=>Math.random()*2-1),k=(O,D)=>O.length===D.length&&O.every((E,S)=>Math.abs(E-D[S])<=.001*(1+Math.abs(D[S]))),A=x(96),y=x(64),P=x(96),U=new Float32Array(32),F=y.slice();for(let O=0;O<32;O++){let D=A[O]*A[64+O],E=P[O*3+2]*D;for(let S=0;S<2;S++)E+=P[O*3+S]*y[S*32+O];for(let S=0;S+2<3;S++)F[S*32+O]=y[(S+1)*32+O];F[32+O]=D,U[O]=E*A[32+O]}let G=await this.lfm2ShortConv(A,y.slice(),P,32,3);!k(G.out,U)||!k(G.state,F)?(this.lfm2ShortConvOk=!1,console.error("[selfValidate] LFM2 shortconv KO sur ce GPU : une archi lfm2 refuserait de charger (non bloquant pour le reste).")):console.log("[selfValidate] LFM2 shortconv OK (conv courte gat\xE9e, moteur v2)")}if(this.qwen35SsmOk){let A=new Float32Array(128).fill(.05),y=new Float32Array(128).fill(.02),P=new Float32Array(128).fill(.1),U=new Float32Array([-.05,-.02]),F=new Float32Array([.8,.9]),G=new Float32Array(8192),O=new Float32Array(192),D=new Float32Array(64).fill(.3),E=new Float32Array(256).fill(.25);try{let S=await this.qwen35Conv1d(D,O.slice(),E,64,4),L=await this.qwen35DeltaNetStep(A,y,P,U,F,G.slice(),64,64,2);!S.out||S.out.length!==64||!L.out||L.out.length!==128?(this.qwen35SsmOk=!1,console.error("[selfValidate] Qwen 3.5 SSM KO : dimension invalide")):console.log("[selfValidate] Qwen 3.5 SSM OK (conv causale 1D + Gated DeltaNet, moteur v2)")}catch(S){this.qwen35SsmOk=!1,console.error("[selfValidate] Qwen 3.5 SSM KO :",S)}}let C=await this.validateDiffusion();C?console.warn("[selfValidate] image-gen primitive KO:",C,"(non bloquant: chemin texte intact)"):console.log(`[selfValidate] image-gen primitives OK (silu, group_norm, conv2d, conv2d_direct, conv2d_direct_q8/q4, conv 3\xD73 tuil\xE9 q8/q4 ${this.convTiledQOk?"OK":"KO (repli direct)"}, relu, upsample_nearest, layernorm, quick_gelu, attention_full)`);let j=await this.validateVideoResident();return j?(this.videoResidentOk=!1,console.warn("[selfValidate] motion r\xE9sident KO:",j,", repli JS+readback (plus lent, m\xEAme r\xE9sultat).")):console.log("[selfValidate] motion r\xE9sident OK (video_motion_gather, video_motion_scatter, video_add_pe, attn_temporal)"),!0}async validateVideoResident(){let e=o=>Float32Array.from({length:o},()=>Math.random()*2-1),r=(o,u,c=.005)=>o.length===u.length&&o.every((f,d)=>Math.abs(f-u[d])<=c*(1+Math.abs(u[d])));{let o=e(120),u=new Float32Array(120);for(let d=0;d<5;d++)for(let p=0;p<3;p++)for(let g=0;g<8;g++)u[(d*3+p)*8+g]=o[(p*8+g)*5+d];let c=this.recordingSession(),f=await c.finish(c.videoGather(o,3,8,5),120);if(!r(f,u,1e-6))return"video_motion_gather"}{let o=e(120),u=e(120),c=new Float32Array(120);for(let p=0;p<3;p++)for(let g=0;g<8;g++)for(let m=0;m<5;m++)c[(p*8+g)*5+m]=o[(m*3+p)*8+g]+u[(p*8+g)*5+m];let f=this.recordingSession(),d=await f.finish(f.videoScatter(o,u,3,8,5),120);if(!r(d,c,1e-6))return"video_motion_scatter"}{let o=e(120),u=e(24),c=new Float32Array(120);for(let p=0;p<5;p++)for(let g=0;g<3;g++)for(let m=0;m<8;m++)c[(p*3+g)*8+m]=o[(p*3+g)*8+m]+u[g*8+m];let f=this.recordingSession(),d=await f.finish(f.videoAddPe(o,u,3,8,5),120);if(!r(d,c,1e-6))return"video_add_pe"}{let o=e(120),u=e(120),c=e(120),f=1/Math.sqrt(4),d=new Float32Array(120);for(let m=0;m<5;m++)for(let b=0;b<2;b++){let v=b*4,_=m*3;for(let B=0;B<3;B++){let q=(_+B)*8+v,C=new Float32Array(3),j=-1e30;for(let k=0;k<3;k++){let w=0,h=(_+k)*8+v;for(let A=0;A<4;A++)w+=o[q+A]*u[h+A];C[k]=w*f,C[k]>j&&(j=C[k])}let x=0;for(let k=0;k<3;k++)C[k]=Math.exp(C[k]-j),x+=C[k];for(let k=0;k<3;k++){let w=C[k]/x,h=(_+k)*8+v;for(let A=0;A<4;A++)d[q+A]+=w*c[h+A]}}}let p=this.recordingSession(),g=await p.finish(p.attnTemporal(o,u,c,5,3,2,4),120);if(!r(g,d))return"attn_temporal"}return null}async validateDiffusion(){let e=T=>Float32Array.from({length:T},()=>Math.random()*2-1),r=(T,R,K=.005)=>T.length===R.length&&T.every((N,I)=>Math.abs(N-R[I])<=K*(1+Math.abs(R[I]))),t=e(70),n=t.map(T=>T/(1+Math.exp(-T)));if(!r(await this.silu(t),n))return"silu";let s=4,i=5,a=2,o=1e-5,u=e(s*i),c=e(s),f=e(s),d=new Float32Array(s*i),p=s/a;for(let T=0;T<a;T++){let R=T*p*i,K=p*i,N=0;for(let H=0;H<K;H++)N+=u[R+H];N/=K;let I=0;for(let H=0;H<K;H++){let Y=u[R+H]-N;I+=Y*Y}I/=K;let Q=1/Math.sqrt(I+o);for(let H=0;H<K;H++){let Y=T*p+Math.floor(H/i);d[R+H]=(u[R+H]-N)*Q*c[Y]+f[Y]}}if(!r(await this.groupNorm(u,c,f,s,i,a,o),d))return"group_norm";let g=2,m=4,b=4,v=3,_=3,B=1,q=1,C=4,j=4,x=e(g*m*b),k=e(v*g*_*_),w=e(v),h=new Float32Array(v*C*j);for(let T=0;T<v;T++)for(let R=0;R<C;R++)for(let K=0;K<j;K++){let N=w[T];for(let I=0;I<g;I++)for(let Q=0;Q<_;Q++)for(let H=0;H<_;H++){let Y=R*B+Q-q,ne=K*B+H-q;Y>=0&&Y<m&&ne>=0&&ne<b&&(N+=x[I*m*b+Y*b+ne]*k[((T*g+I)*_+Q)*_+H])}h[(T*C+R)*j+K]=N}if(!r(await this.conv2d(x,k,w,g,m,b,v,_,_,B,q),h))return"conv2d";if(!r(await this.conv2dDirect(x,k,w,g,m,b,v,_,_,B,q),h))return"conv2d_direct";{let I=e(1200),Q=e(108),H=e(4),Y=await this.conv2dDirect(I,Q,H,3,20,20,4,3,3,1,1),ne=this.convTiledOk;this.convTiledOk=!0;let te=this.recordingSession(),ie=await te.finish(te.conv2d(I,Q,H,3,20,20,4,3,3,1,1),1600);this.convTiledOk=ne,r(ie,Y)||(this.convTiledOk=!1,console.warn("[selfValidate] conv2d_3x3_tiled KO sur ce GPU : repli sur conv2d_direct (plus lent, m\xEAme r\xE9sultat)."))}{let K=e(8*m*b),N=e(32*_*_),I=e(4),Q=Ge(N),H=await this.conv2dDirect(K,he(Q),I,8,m,b,4,_,_,B,q),Y={codes:this.uploadGpuRaw(new Uint8Array(Q.codes.buffer,Q.codes.byteOffset,Q.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(Q.scales.buffer,Q.scales.byteOffset,Q.scales.byteLength))},ne=this.convTiledQOk;this.convTiledQOk=!1;let te=this.recordingSession(),ie=await te.finish(te.conv2d(K,Y,I,8,m,b,4,_,_,B,q),4*m*b);if(this.convTiledQOk=ne,this.releaseGpu([Y.codes,Y.sc]),!r(ie,H))return"conv2d_direct_q8"}{let K=e(8*m*b),N=e(32*_*_),I=e(4),Q=_e(N),H=await this.conv2dDirect(K,ge(Q),I,8,m,b,4,_,_,B,q),Y={nib:this.uploadGpuRaw(Q.nibbles),sc:this.uploadGpuRaw(new Uint8Array(Q.scales.buffer,Q.scales.byteOffset,Q.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(Q.mins.buffer,Q.mins.byteOffset,Q.mins.byteLength))},ne=this.convTiledQOk;this.convTiledQOk=!1;let te=this.recordingSession(),ie=await te.finish(te.conv2d(K,Y,I,8,m,b,4,_,_,B,q),4*m*b);if(this.convTiledQOk=ne,this.releaseGpu([Y.nib,Y.sc,Y.mn]),!r(ie,H))return"conv2d_direct_q4"}{let I=e(16e3),Q=e(480),H=e(12),Y=this.convTiledQOk;for(let ne of["q8","q4"]){let te=ne==="q8"?(()=>{let J=Ge(Q);return{deq:he(J),gpu:{codes:this.uploadGpuRaw(new Uint8Array(J.codes.buffer,J.codes.byteOffset,J.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(J.scales.buffer,J.scales.byteOffset,J.scales.byteLength))}}})():(()=>{let J=_e(Q);return{deq:ge(J),gpu:{nib:this.uploadGpuRaw(J.nibbles),sc:this.uploadGpuRaw(new Uint8Array(J.scales.buffer,J.scales.byteOffset,J.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(J.mins.buffer,J.mins.byteOffset,J.mins.byteLength))}}})(),ie=await this.conv2dDirect(I,te.deq,H,40,20,20,12,1,1,1,0);this.convTiledQOk=!0;let le=this.recordingSession(),pe=await le.finish(le.conv2d(I,te.gpu,H,40,20,20,12,1,1,1,0),4800);if(this.releaseGpu(Object.values(te.gpu)),!r(pe,ie)){Y&&console.warn(`[selfValidate] conv2d_1x1_${ne} KO sur ce GPU : repli sur conv2d_direct_${ne}.`),this.convTiledQOk=!1;break}}this.convTiledQOk=this.convTiledQOk&&Y}{let I=e(3200),Q=e(288),H=e(4),Y=this.convTiledQOk;for(let ne of["q8","q4"]){let te=ne==="q8"?(()=>{let J=Ge(Q);return{deq:he(J),gpu:{codes:this.uploadGpuRaw(new Uint8Array(J.codes.buffer,J.codes.byteOffset,J.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(J.scales.buffer,J.scales.byteOffset,J.scales.byteLength))}}})():(()=>{let J=_e(Q);return{deq:ge(J),gpu:{nib:this.uploadGpuRaw(J.nibbles),sc:this.uploadGpuRaw(new Uint8Array(J.scales.buffer,J.scales.byteOffset,J.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(J.mins.buffer,J.mins.byteOffset,J.mins.byteLength))}}})(),ie=await this.conv2dDirect(I,te.deq,H,8,20,20,4,3,3,1,1);this.convTiledQOk=!0;let le=this.recordingSession(),pe=await le.finish(le.conv2d(I,te.gpu,H,8,20,20,4,3,3,1,1),1600);if(this.releaseGpu(Object.values(te.gpu)),!r(pe,ie)){Y&&console.warn(`[selfValidate] conv2d_3x3_tiled_${ne} KO sur ce GPU : repli sur conv2d_direct_${ne} (plus lent, m\xEAme r\xE9sultat).`),this.convTiledQOk=!1;break}}this.convTiledQOk=this.convTiledQOk&&Y}{let I=e(3200),Q=e(288),H=e(4),Y=this.convS2Ok,ne=Math.floor(19/2)+1,te=Math.floor(19/2)+1;for(let ie of["q8","q4"]){let le=ie==="q8"?(()=>{let Z=Ge(Q);return{deq:he(Z),gpu:{codes:this.uploadGpuRaw(new Uint8Array(Z.codes.buffer,Z.codes.byteOffset,Z.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(Z.scales.buffer,Z.scales.byteOffset,Z.scales.byteLength))}}})():(()=>{let Z=_e(Q);return{deq:ge(Z),gpu:{nib:this.uploadGpuRaw(Z.nibbles),sc:this.uploadGpuRaw(new Uint8Array(Z.scales.buffer,Z.scales.byteOffset,Z.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(Z.mins.buffer,Z.mins.byteOffset,Z.mins.byteLength))}}})(),pe=await this.conv2dDirect(I,le.deq,H,8,20,20,4,3,3,2,1);this.convS2Ok=!0;let J=this.recordingSession(),Te=await J.finish(J.conv2d(I,le.gpu,H,8,20,20,4,3,3,2,1),4*ne*te);if(this.releaseGpu(Object.values(le.gpu)),!r(Te,pe)){Y&&console.warn(`[selfValidate] conv2d_3x3_s2_tiled_${ie} KO sur ce GPU : repli sur direct.`),this.convS2Ok=!1;break}}this.convS2Ok=this.convS2Ok&&Y}if(this.hasSubgroups&&this.subgroupsOk)try{let K=e(1500),N=e(300),I=r(await this.rmsnormVec(K,N,5,300,1e-5,!1,"rmsnorm_vec_subgroup"),await this.rmsnormVec(K,N,5,300,1e-5,!1)),Q=8,H=130,Y=4,ne=e(Q*H),te=e(Q),ie=e(Q),le=r(await this.groupNorm(ne,te,ie,Q,H,Y,1e-5,"group_norm_subgroup"),await this.groupNorm(ne,te,ie,Q,H,Y));if(!I||!le){let pe=[!I&&"rmsnorm_vec_subgroup",!le&&"group_norm_subgroup"].filter(Boolean).join(" + ");console.warn(`[selfValidate] ${pe} KO sur ce GPU : repli sur la r\xE9duction en m\xE9moire partag\xE9e.`),this.subgroupsOk=!1}}catch(T){console.warn("[selfValidate] subgroups indisponibles \xE0 l'ex\xE9cution : repli sur la m\xE9moire partag\xE9e.",T),this.subgroupsOk=!1}{let R=e(66),K=new Uint16Array(66);for(let H=0;H<66;H++)K[H]=qe(R[H]);let N=new Float32Array(66);for(let H=0;H<66;H++)N[H]=we(K[H]);let I=this.f16ToF32Gpu(new Uint8Array(K.buffer,K.byteOffset,K.byteLength),66),Q=await this.readGpu(I,66);if(I.destroy?.(),!r(Q,N,1e-6))return"f16_to_f32"}let A=e(70);if(!r(await this.relu(A),A.map(T=>Math.max(T,0))))return"relu";let y=2,P=2,U=2,F=2,G=P*F,O=U*F,D=e(y*P*U),E=new Float32Array(y*G*O);for(let T=0;T<y;T++)for(let R=0;R<G;R++)for(let K=0;K<O;K++)E[T*G*O+R*O+K]=D[T*P*U+Math.floor(R/F)*U+Math.floor(K/F)];if(!r(await this.upsampleNearest(D,y,P,U,F),E))return"upsample_nearest";let S=2,L=8,z=1e-5,W=e(S*L),V=e(L),$=e(L),X=new Float32Array(S*L);for(let T=0;T<S;T++){let R=T*L,K=0;for(let Q=0;Q<L;Q++)K+=W[R+Q];K/=L;let N=0;for(let Q=0;Q<L;Q++){let H=W[R+Q]-K;N+=H*H}N/=L;let I=1/Math.sqrt(N+z);for(let Q=0;Q<L;Q++)X[R+Q]=(W[R+Q]-K)*I*V[Q]+$[Q]}if(!r(await this.layernorm(W,V,$,S,L,z),X))return"layernorm";let M=e(70);if(!r(await this.quickGelu(M),M.map(T=>T/(1+Math.exp(-1.702*T)))))return"quick_gelu";{let Q=1/Math.sqrt(4),H=e(24),Y=e(40),ne=e(40),te=new Float32Array(24);for(let ie=0;ie<2;ie++)for(let le=0;le<3;le++){let pe=new Float32Array(5),J=-1/0;for(let Z=0;Z<5;Z++){let Oe=0;for(let ve=0;ve<4;ve++)Oe+=H[le*8+ie*4+ve]*Y[Z*8+ie*4+ve];pe[Z]=Oe*Q,pe[Z]>J&&(J=pe[Z])}let Te=0;for(let Z=0;Z<5;Z++)pe[Z]=Math.exp(pe[Z]-J),Te+=pe[Z];for(let Z=0;Z<4;Z++){let Oe=0;for(let ve=0;ve<5;ve++)Oe+=pe[ve]/Te*ne[ve*8+ie*4+Z];te[le*8+ie*4+Z]=Oe}}if(!r(await this.attentionFull(H,Y,ne,3,2,2,4,5),te))return"attention_full"}if(this.attnFullWgOk){let T=[{nT:70,kvL:70,nH:5,hd:64},{nT:16,kvL:77,nH:5,hd:64},{nT:9,kvL:9,nH:8,hd:160}];for(let R of T){let K=R.nH*R.hd,N=e(R.nT*K),I=e(R.kvL*K),Q=e(R.kvL*K),H=await this.attentionFull(N,I,Q,R.nT,R.nH,R.nH,R.hd,R.kvL),Y=await this.attentionFullWg(N,I,Q,R.nT,R.nH,R.nH,R.hd,R.kvL);if(!r(Y,H)){this.attnFullWgOk=!1,console.warn(`[selfValidate] attention_full_wg KO sur ce GPU (hd=${R.hd}, kv=${R.kvL}) : repli sur attention_full (plus lent, m\xEAme r\xE9sultat).`);break}}}return null}};ee.timingOn=(()=>{try{return re("timing")==="1"}catch{return!1}})(),ee.profileOn=(()=>{try{return re("gpuprofile")==="1"}catch{return!1}})(),ee.MAX_WG_DIM=65535,ee.BLOCK_ELEMS={Q4_K:256,Q5_K:256,Q6_K:256,Q8_0:32,Q5_0:32,Q4_0:32,Q3_K:256,Q4_1:32,F32:1,F16:1},ee.DEQUANT_SHADER={Q4_K:"dequant_q4k",Q8_0:"dequant_q8_0",Q5_0:"dequant_q5_0",Q6_K:"dequant_q6k",Q4_0:"dequant_q4_0",Q5_K:"dequant_q5k",Q3_K:"dequant_q3k",Q4_1:"dequant_q4_1"},ee.STORAGE_USAGE=140;bt=ee});function nn(l,e){let r=new DataView(l.buffer,l.byteOffset,l.byteLength),t=new Float32Array(e);for(let n=0;n<e;n++)t[n]=de(r.getUint16(n*2,!0));return t}function sn(l,e){let r=new DataView(l.buffer,l.byteOffset,l.byteLength),t=new Float32Array(e);for(let n=0;n<e;n++)t[n]=r.getFloat32(n*4,!0);return t}function Ze(l,e,r,t){let n=0;for(let a=0;a<r;a++)n+=l[a]*l[a];let s=1/Math.sqrt(n/r+t),i=new Float32Array(r);for(let a=0;a<r;a++)i[a]=l[a]*s*e[a];return i}var Os,Ke,vt,an=se(()=>{"use strict";$e();Ye();Ve();Qe();Os=l=>l/(1+Math.exp(-l)),Ke=class Ke{constructor(e,r,t){this.engine=e;this.manifest=r;this.raw=t;this.w=new Map;this.g=new Map;this.pos=0;this.rLayers=[];this.tokNormGpu=null;this.normBufs=[];this.ffn=0;this.residentLock=Promise.resolve()}isBigProj(e){return/\.(shortconv\.(in_proj|out_proj)|attn_(q|k|v|output)|ffn_(gate|up|down))\.weight$/.test(e)}async load(e){if(!this.engine.lfm2ShortConvOk)throw new Error("kernel shortconv LFM2 invalid\xE9 sur ce GPU (selfValidate) : archi lfm2 refus\xE9e.");let r=this.manifest.arch;if(this.D=r.d,this.NH=r.nHeads,this.NKV=r.nKvHeads,this.HD=r.headDim,this.NL=r.blockCount,this.vocab=r.vocab,this.EPS=r.rmsEps,this.THETA=r.ropeTheta,!r.lfm2)throw new Error("manifest sans profil lfm2");this.LC=r.lfm2.lCache,this.convLayer=r.lfm2.kvHeadsPerLayer.map(t=>t===0),this.tok=e,this.stops=new Set(this.manifest.chat?.stopTokenIds?.length?this.manifest.chat.stopTokenIds:[7]);for(let[t,n]of Object.entries(this.manifest.tensors)){if(t==="token_embd.weight"){if(this.embedBytes=await this.raw(t),this.embedDtype=n.dtype,n.dtype==="q4"){let i=be(this.embedBytes,n.nElems);this.g.set("head",{kind:"q4",nib:this.engine.uploadGpuRaw(i.nibbles),sc:this.up(i.scales),mn:this.up(i.mins),IN:this.D,OUT:this.vocab})}else if(n.dtype==="q8"){let i=ke(this.embedBytes,n.nElems);this.g.set("head",{kind:"q8",codes:this.upI8(i.codes),sc:this.up(i.scales),IN:this.D,OUT:this.vocab})}else if(n.dtype==="q3")throw new Error("LFM2 : t\xEAte li\xE9e en q3 non support\xE9e (le convertisseur garde un plancher q4)");continue}let s=await this.raw(t);if(this.isBigProj(t)&&(n.dtype==="q3"||n.dtype==="q4"||n.dtype==="q8")){let i=n.shape[0],a=n.nElems/i;if(n.dtype==="q8"){let o=ke(s,n.nElems);this.g.set(t,{kind:"q8",codes:this.upI8(o.codes),sc:this.up(o.scales),IN:i,OUT:a})}else if(n.dtype==="q3"){let o=xe(s,n.nElems);this.g.set(t,{kind:"q3",q3:!0,lo:this.up32(o.lo),hi:this.up32(o.hi),sc:this.up(o.scales),mn:this.up(o.mins),IN:i,OUT:a})}else{let o=be(s,n.nElems);this.g.set(t,{kind:"q4",nib:this.engine.uploadGpuRaw(o.nibbles),sc:this.up(o.scales),mn:this.up(o.mins),IN:i,OUT:a})}}else this.w.set(t,this.decodePetit(t,s,n))}this.buildResidentLayers(),this.reset()}buildResidentLayers(){let e=r=>{let t=this.engine.uploadGpu(this.w.get(r));return this.normBufs.push(t),t};this.tokNormGpu=e("token_embd_norm.weight"),this.ffn=this.g.get("blk.0.ffn_gate.weight")?.OUT??0,this.rLayers=[];for(let r=0;r<this.NL;r++){let t=`blk.${r}.`,n={attnNorm:e(t+"attn_norm.weight"),ffnNorm:e(t+"ffn_norm.weight"),wgate:this.g.get(t+"ffn_gate.weight"),wup:this.g.get(t+"ffn_up.weight"),wdown:this.g.get(t+"ffn_down.weight")};this.convLayer[r]?this.rLayers.push({conv:!0,...n,convW:e(t+"shortconv.conv.weight"),inProj:this.g.get(t+"shortconv.in_proj.weight"),outProj:this.g.get(t+"shortconv.out_proj.weight")}):this.rLayers.push({conv:!1,...n,qNorm:e(t+"attn_q_norm.weight"),kNorm:e(t+"attn_k_norm.weight"),wq:this.g.get(t+"attn_q.weight"),wk:this.g.get(t+"attn_k.weight"),wv:this.g.get(t+"attn_v.weight"),wo:this.g.get(t+"attn_output.weight")})}}residentAvailable(){return this.engine.lfm2ResidentOk!==!1&&!!this.g.get("head")&&this.rLayers.length===this.NL&&this.ffn>0}cfg(){return{D:this.D,nHeads:this.NH,nKvHeads:this.NKV,headDim:this.HD,ffn:this.ffn,eps:this.EPS,theta:this.THETA,lc:this.LC,vocab:this.vocab}}embedsFor(e){let r=this.D,t=new Float32Array(e.length*r);for(let n=0;n<e.length;n++)t.set(this.embedRow(e[n]),n*r);return t}async logitsGpu(e,r,t){return this.pos=r+e.length,this.engine.lfm2LogitsGpu(this.embedsFor(e),e.length,this.cfg(),this.rLayers,this.g.get("head"),this.tokNormGpu,r,t)}async topKGpu(e,r,t,n,s,i=40){return this.pos=r+e.length,this.engine.lfm2TopKGpu(this.embedsFor(e),e.length,this.cfg(),this.rLayers,this.g.get("head"),this.tokNormGpu,r,t,n,s,i)}async prefillGpu(e,r,t){this.pos=r+e.length,await this.engine.lfm2PrefillGpu(this.embedsFor(e),e.length,this.cfg(),this.rLayers,this.tokNormGpu,r,t)}decodePetit(e,r,t){switch(t.dtype){case"f32":return sn(r,t.nElems);case"f16":return nn(r,t.nElems);case"q8":return he(ke(r,t.nElems));case"q4":return ge(be(r,t.nElems));case"q3":return Me(xe(r,t.nElems));default:throw new Error(`LFM2 : dtype \xAB ${t.dtype} \xBB non support\xE9 pour ${e}`)}}up(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}up32(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}upI8(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}unload(){for(let e of this.g.values())for(let r of["nib","sc","mn","codes"])e[r]?.destroy?.();for(let e of this.normBufs)e?.destroy?.();this.normBufs=[],this.rLayers=[],this.tokNormGpu=null,this.engine.clearLfm2State?.(),this.g.clear(),this.w.clear()}reset(){this.pos=0,this.state=Array.from({length:this.NL},(e,r)=>this.convLayer[r]?{conv:new Float32Array((this.LC-1)*this.D)}:{K:[],V:[]})}async gemm(e,r){let t=this.g.get(e);if(!t){let n=this.w.get(e==="head"?"token_embd.weight":e),s=n.length/r.length,i=new Float32Array(s);for(let a=0;a<s;a++){let o=0,u=a*r.length;for(let c=0;c<r.length;c++)o+=n[u+c]*r[c];i[a]=o}return i}return t.kind==="q8"?this.engine.matmulQ8(r,t.codes,t.sc,1,t.IN,t.OUT):t.kind==="q3"?this.engine.matmulQ3(r,t.lo,t.hi,t.sc,t.mn,1,t.IN,t.OUT):this.engine.matmulQ4(r,t.nib,t.sc,t.mn,1,t.IN,t.OUT)}embedRow(e){let r=this.D;if(this.embedDtype==="f16")return nn(this.embedBytes.subarray(e*r*2,e*r*2+r*2),r);if(this.embedDtype==="f32")return sn(this.embedBytes.subarray(e*r*4,e*r*4+r*4),r);if(this.embedDtype==="q8"){let o=this.vocab*r,u=r/32,c=new Int8Array(this.embedBytes.buffer,this.embedBytes.byteOffset+e*r,r),f=this.embedBytes.subarray(o+e*u*2,o+e*u*2+u*2),d=new DataView(f.buffer,f.byteOffset,f.byteLength),p=new Float32Array(r);for(let g=0;g<u;g++){let m=de(d.getUint16(g*2,!0));for(let b=0;b<32;b++)p[g*32+b]=c[g*32+b]*m}return p}let t=this.vocab*r,n=r/32,s=t/2,i=t/2+t/32*2,a=new Uint8Array(r/2+n*2*2);return a.set(this.embedBytes.subarray(e*r/2,e*r/2+r/2),0),a.set(this.embedBytes.subarray(s+e*n*2,s+e*n*2+n*2),r/2),a.set(this.embedBytes.subarray(i+e*n*2,i+e*n*2+n*2),r/2+n*2),ge(be(a,r))}rope(e,r,t){let n=this.HD,s=e.slice();for(let i=0;i<r;i++){let a=i*n;for(let o=0;o<n/2;o++){let u=Math.pow(this.THETA,-2*o/n),c=Math.cos(t*u),f=Math.sin(t*u),d=e[a+o],p=e[a+o+n/2];s[a+o]=d*c-p*f,s[a+o+n/2]=d*f+p*c}}return s}async forwardToken(e){let r=this.D,t=this.pos++,n=this.embedRow(e);for(let s=0;s<this.NL;s++){let i=`blk.${s}.`,a=this.state[s],o=Ze(n,this.w.get(i+"attn_norm.weight"),r,this.EPS),u;if(this.convLayer[s]){let g=await this.gemm(i+"shortconv.in_proj.weight",o),m=await this.engine.lfm2ShortConv(g,a.conv,this.w.get(i+"shortconv.conv.weight"),r,this.LC);a.conv=m.state,u=await this.gemm(i+"shortconv.out_proj.weight",m.out)}else{let g=await this.gemm(i+"attn_q.weight",o),m=await this.gemm(i+"attn_k.weight",o),b=await this.gemm(i+"attn_v.weight",o),v=this.w.get(i+"attn_q_norm.weight"),_=this.w.get(i+"attn_k_norm.weight");for(let x=0;x<this.NH;x++)g.set(Ze(g.slice(x*this.HD,(x+1)*this.HD),v,this.HD,this.EPS),x*this.HD);for(let x=0;x<this.NKV;x++)m.set(Ze(m.slice(x*this.HD,(x+1)*this.HD),_,this.HD,this.EPS),x*this.HD);g=this.rope(g,this.NH,t),m=this.rope(m,this.NKV,t),a.K.push(m),a.V.push(b);let B=new Float32Array(this.NH*this.HD),q=a.K.length,C=1/Math.sqrt(this.HD),j=this.NH/this.NKV;for(let x=0;x<this.NH;x++){let k=Math.floor(x/j),w=x*this.HD,h=k*this.HD,A=new Float32Array(q),y=-1e30;for(let U=0;U<q;U++){let F=0;for(let G=0;G<this.HD;G++)F+=g[w+G]*a.K[U][h+G];A[U]=F*C,A[U]>y&&(y=A[U])}let P=0;for(let U=0;U<q;U++)A[U]=Math.exp(A[U]-y),P+=A[U];for(let U=0;U<q;U++){let F=A[U]/P;for(let G=0;G<this.HD;G++)B[w+G]+=F*a.V[U][h+G]}}u=await this.gemm(i+"attn_output.weight",B)}for(let g=0;g<r;g++)n[g]+=u[g];let c=Ze(n,this.w.get(i+"ffn_norm.weight"),r,this.EPS),f=await this.gemm(i+"ffn_gate.weight",c),d=await this.gemm(i+"ffn_up.weight",c);for(let g=0;g<f.length;g++)f[g]=Os(f[g])*d[g];let p=await this.gemm(i+"ffn_down.weight",f);for(let g=0;g<r;g++)n[g]+=p[g]}return n=Ze(n,this.w.get("token_embd_norm.weight"),r,this.EPS),this.gemm("head",n)}async classify(e,r){let t=this.tok.encode(e),n;if(this.residentAvailable())n=await this.locked(()=>this.feedThen(t,0,"cls",(i,a)=>this.logitsGpu(i,a,"cls")));else{this.reset();for(let i of t)n=await this.forwardToken(i)}let s=r.map(i=>{let a=this.tok.encode(i);return{label:i,logit:n[a[1]??a[0]]}}).sort((i,a)=>a.logit-i.logit);return{label:s[0].label,scores:s}}banTools(e){for(let r of Ke.TOOL_BAN)r<e.length&&(e[r]=-1e30);return e}sampleTok(e,r,t){let{temperature:n=.8,topK:s=40,repeatPenalty:i=1.3}=t,a=new Set(r),o=[];for(let d=0;d<e.length;d++){let p=e[d];a.has(d)&&(p=p>0?p/i:p*i),o.push({i:d,v:p})}o.sort((d,p)=>p.v-d.v),o.length=s;let u=o[0].v,c=0;for(let d of o)d.p=Math.exp((d.v-u)/n),c+=d.p;let f=Math.random()*c;for(let d of o)if(f-=d.p,f<=0)return d.i;return o[0].i}async generate(e,r,t,n,s){this.reset();let i=this.tok.encode(e),a;for(let u of i)a=await this.forwardToken(u);let o=[];for(let u=0;u<r&&!n?.();u++){this.banTools(a);let c;if(s?.sample)c=this.sampleTok(a,o.slice(-64),s);else{c=0;for(let f=1;f<a.length;f++)a[f]>a[c]&&(c=f)}if(this.stops.has(c))break;o.push(c),t&&t(this.tok.decode(o)),a=await this.forwardToken(c)}return o.length?this.tok.decode(o):""}locked(e){let r=this.residentLock.then(e,e);return this.residentLock=r.catch(()=>{}),r}async feedThen(e,r,t,n,s){let i=0;for(;;){if(s?.())return null;let a=Math.min(i+Ke.PREFILL_CHUNK,e.length),o=e.slice(i,a);if(a<e.length)await this.prefillGpu(o,r+i,t);else return n(o,r+i);i=a}}pickFromTopK(e,r){let t=[],n=[];for(let d=0;d<e.ids.length;d++)if(!Ke.TOOL_BAN.includes(e.ids[d])){if(e.vals[d]<=-3e38)break;t.push(e.ids[d]),n.push(e.vals[d])}if(!t.length)return e.ids[0];if(!r?.sample)return t[0];let{temperature:s=.8,topK:i=40}=r,a=Math.min(i,t.length),o=n[0],u=0,c=new Array(a);for(let d=0;d<a;d++)c[d]=Math.exp((n[d]-o)/s),u+=c[d];let f=Math.random()*u;for(let d=0;d<a;d++)if(f-=c[d],f<=0)return t[d];return t[0]}async generateResident(e,r,t,n,s){return this.residentAvailable()?this.locked(async()=>{let a=s?.repeatPenalty??(s?.sample?1.3:1),o=this.tok.encode(e),u=await this.feedThen(o,0,"gen",(d,p)=>this.topKGpu(d,p,"gen",[],1,48),n);if(!u)return"";let c=o.length,f=[];for(let d=0;d<r&&!n?.();d++){let p=this.pickFromTopK(u,s);if(this.stops.has(p))break;f.push(p),t&&t(this.tok.decode(f)),u=await this.topKGpu([p],c,"gen",a!==1?[...new Set(f.slice(-64))]:[],a,48),c++}return f.length?this.tok.decode(f):""}):this.generate(e,r,t,n,s)}};Ke.TOOL_BAN=[8,10,12],Ke.PREFILL_CHUNK=128;vt=Ke});function Cs(l){let e=[];for(let r=0;r<l.length;r++){let t=l[r];if(t==="\\"&&r+1<l.length){let s=l[r+1];if(s==="x"){e.push(parseInt(l.substr(r+2,2),16)&255),r+=3;continue}if(s==="t"){e.push(9),r++;continue}if(s==="n"){e.push(10),r++;continue}if(s==="r"){e.push(13),r++;continue}if(s==="0"){e.push(0),r++;continue}if(s==="\\"){e.push(92),r++;continue}if(s==="'"){e.push(39),r++;continue}if(s==='"'){e.push(34),r++;continue}e.push(92);continue}let n=t.codePointAt(0);if(n<128)e.push(n);else for(let s of new TextEncoder().encode(t))e.push(s)}return new Uint8Array(e)}var wt,on=se(()=>{"use strict";wt=class{constructor(e,r=0){this.root={next:new Map};this.idToBytes=[];this.vocabSize=e.length,this.eosId=r;for(let t=0;t<e.length;t++){let n=Cs(e[t]);if(this.idToBytes[t]=n,t===0||n.length===0)continue;let s=this.root;for(let i of n){let a=s.next.get(i);a||(a={next:new Map},s.next.set(i,a)),s=a}s.id=t}}encode(e){let r=new TextEncoder().encode(e),t=[],n=0;for(;n<r.length;){let s=this.root,i=-1,a=0,o=0;for(let u=n;u<r.length;u++){let c=s.next.get(r[u]);if(!c)break;s=c,o++,c.id!==void 0&&(i=c.id,a=o)}i<0&&(i=r[n]+1,a=1),t.push(i),n+=a}return t}decode(e){let r=[];for(let t of e){if(t===this.eosId)continue;let n=this.idToBytes[t];if(n)for(let s of n)r.push(s)}return new TextDecoder("utf-8",{fatal:!1}).decode(new Uint8Array(r))}}});function It(l,e){let r=new DataView(l.buffer,l.byteOffset,l.byteLength),t=new Float32Array(e);for(let n=0;n<e;n++)t[n]=de(r.getUint16(n*2,!0));return t}function $t(l,e){let r=new DataView(l.buffer,l.byteOffset,l.byteLength),t=new Float32Array(e);for(let n=0;n<e;n++)t[n]=r.getFloat32(n*4,!0);return t}function Fe(l,e,r,t){let n=new Float32Array(t);for(let s=0;s<t;s++){let i=0,a=s*r;for(let o=0;o<r;o++)i+=l[a+o]*e[o];n[s]=i}return n}function kt(l,e,r,t,n=1e-5){let s=0;for(let u=0;u<t;u++)s+=l[u];s/=t;let i=0;for(let u=0;u<t;u++){let c=l[u]-s;i+=c*c}i/=t;let a=1/Math.sqrt(i+n),o=new Float32Array(t);for(let u=0;u<t;u++)o[u]=(l[u]-s)*a*e[u]+r[u];return o}var yt,ze,et,un=se(()=>{"use strict";Ye();$e();Ve();Qe();on();yt=l=>1/(1+Math.exp(-l));ze=class ze{constructor(e,r,t){this.engine=e;this.manifest=r;this.raw=t;this.w=new Map;this.g=new Map;this.rLayers=[];this.rNorms=null;this.normBufs=[];this.residentLock=Promise.resolve()}isBigProj(e){return/\.(time_mix_(receptance|key|value|output)|channel_mix_(key|value))\.weight$/.test(e)}async load(e){let r=this.manifest.arch;this.D=r.d,this.H=r.rwkv.headSize,this.NH=this.D/this.H,this.NL=r.blockCount,this.vocab=r.vocab,this.tok=new wt(e,0);for(let[t,n]of Object.entries(this.manifest.tensors)){if(t==="token_embd.weight"){this.embedBytes=await this.raw(t),this.embedDtype=n.dtype;continue}let s=await this.raw(t);if(t==="output.weight"){if(n.dtype==="q4"){let i=be(s,n.nElems);this.g.set(t,{kind:"q4",nib:this.engine.uploadGpuRaw(i.nibbles),sc:this.up(i.scales),mn:this.up(i.mins),IN:this.D,OUT:this.vocab})}else if(n.dtype==="q3"){let i=xe(s,n.nElems);this.g.set(t,{kind:"q3",q3:!0,lo:this.up32(i.lo),hi:this.up32(i.hi),sc:this.up(i.scales),mn:this.up(i.mins),IN:this.D,OUT:this.vocab})}else if(n.dtype==="q8"){let i=ke(s,n.nElems);this.g.set(t,{kind:"q8",codes:this.upI8(i.codes),sc:this.up(i.scales),IN:this.D,OUT:this.vocab})}else this.w.set(t,n.dtype==="f32"?$t(s,n.nElems):It(s,n.nElems));continue}if(this.isBigProj(t)&&(n.dtype==="q3"||n.dtype==="q4"||n.dtype==="q8")){let i=n.shape[0],a=n.nElems/i;if(n.dtype==="q3"){let o=xe(s,n.nElems);this.g.set(t,{kind:"q3",q3:!0,lo:this.up32(o.lo),hi:this.up32(o.hi),sc:this.up(o.scales),mn:this.up(o.mins),IN:i,OUT:a})}else if(n.dtype==="q8"){let o=ke(s,n.nElems);this.g.set(t,{kind:"q8",codes:this.upI8(o.codes),sc:this.up(o.scales),IN:i,OUT:a})}else{let o=be(s,n.nElems);this.g.set(t,{kind:"q4",nib:this.engine.uploadGpuRaw(o.nibbles),sc:this.up(o.scales),mn:this.up(o.mins),IN:i,OUT:a})}}else this.w.set(t,n.dtype==="f32"?$t(s,n.nElems):n.dtype==="f16"?It(s,n.nElems):n.dtype==="q3"?Me(xe(s,n.nElems)):n.dtype==="q8"?he(ke(s,n.nElems)):ge(be(s,n.nElems)))}this.buildResidentLayers(),this.reset()}buildResidentLayers(){try{let e=t=>{let n=this.w.get(t);if(!n)throw new Error(`r\xE9sident : tenseur manquant ${t}`);let s=this.engine.uploadGpu(n);return this.normBufs.push(s),s};this.rNorms={tokW:e("token_embd_norm.weight"),tokB:e("token_embd_norm.bias"),outW:e("output_norm.weight"),outB:e("output_norm.bias")};let r=[];for(let t=0;t<this.NL;t++){let n=`blk.${t}.`,s=(m,b)=>{let v=this.w.get(n+m);if(!v)throw new Error(`r\xE9sident : ${n}${m} manquant`);return v.length/b},i=this.w.get(n+"time_mix_ln.weight"),a=this.w.get(n+"time_mix_ln.bias");if(!i||!a)throw new Error(`r\xE9sident : ${n}time_mix_ln manquant`);let o=new Float32Array(2*this.D);o.set(i,0),o.set(a,this.D);let u=this.engine.uploadGpu(o);this.normBufs.push(u);let c=m=>{let b=this.g.get(n+m);if(!b)throw new Error(`r\xE9sident : ${n}${m} non quantifi\xE9e GPU`);return b},f=s("time_mix_w1.weight",this.D),d=s("time_mix_a1.weight",this.D),p=s("time_mix_g1.weight",this.D),g={attnNormW:e(n+"attn_norm.weight"),attnNormB:e(n+"attn_norm.bias"),attnNorm2W:e(n+"attn_norm_2.weight"),attnNorm2B:e(n+"attn_norm_2.bias"),lerpFused:e(n+"time_mix_lerp_fused.weight"),lerpK:e(n+"channel_mix_lerp_k.weight"),w0:e(n+"time_mix_w0.weight"),w1:e(n+"time_mix_w1.weight"),w2:e(n+"time_mix_w2.weight"),rw:f,a0:e(n+"time_mix_a0.weight"),a1:e(n+"time_mix_a1.weight"),a2:e(n+"time_mix_a2.weight"),ra:d,g1:e(n+"time_mix_g1.weight"),g2:e(n+"time_mix_g2.weight"),rg:p,kk:e(n+"time_mix_k_k.weight"),ka:e(n+"time_mix_k_a.weight"),rk:e(n+"time_mix_r_k.weight"),lnWB:u,R:c("time_mix_receptance.weight"),K:c("time_mix_key.weight"),V:c("time_mix_value.weight"),O:c("time_mix_output.weight"),cmK:c("channel_mix_key.weight"),cmV:c("channel_mix_value.weight"),ffn:this.g.get(n+"channel_mix_key.weight").OUT};t>0&&(g.rv=s("time_mix_v1.weight",this.D),g.v0=e(n+"time_mix_v0.weight"),g.v1=e(n+"time_mix_v1.weight"),g.v2=e(n+"time_mix_v2.weight")),r.push(g)}this.rLayers=r}catch(e){console.warn("[rwkv] chemin r\xE9sident indisponible (montage) : repli forwardToken JS+readback.",e),this.rLayers=[],this.rNorms=null}}residentAvailable(){let e=this.engine;return e.rwkvResidentOk!==!1&&e.rwkvWkv7Ok!==!1&&!!this.g.get("output.weight")&&this.rLayers.length===this.NL&&!!this.rNorms}cfg(){return{D:this.D,H:this.H,NH:this.NH,vocab:this.vocab}}embedsFor(e){let r=this.D,t=new Float32Array(e.length*r);for(let n=0;n<e.length;n++)t.set(this.embedRow(e[n]),n*r);return t}async prefillGpu(e,r,t){for(let n=0;n<e.length;n+=ze.PREFILL_CHUNK){let s=e.slice(n,n+ze.PREFILL_CHUNK);await this.engine.rwkvPrefillGpu(this.embedsFor(s),s.length,this.cfg(),this.rLayers,this.rNorms,r+n,t)}}locked(e){let r=this.residentLock.then(e,e);return this.residentLock=r.catch(()=>{}),r}async feedThen(e,r,t,n){let s=e.length>ze.PREFILL_CHUNK?e.slice(0,e.length-ze.PREFILL_CHUNK):[];return s.length&&await this.prefillGpu(s,r,t),n(e.slice(s.length),r+s.length)}async logitsGpu(e,r,t){return this.feedThen(e,r,t,(n,s)=>this.engine.rwkvLogitsGpu(this.embedsFor(n),n.length,this.cfg(),this.rLayers,this.g.get("output.weight"),this.rNorms,s,t))}async topKGpu(e,r,t,n,s,i=40){return this.feedThen(e,r,t,(a,o)=>this.engine.rwkvTopKGpu(this.embedsFor(a),a.length,this.cfg(),this.rLayers,this.g.get("output.weight"),this.rNorms,o,t,n,s,i))}up(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}up32(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}upI8(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}reset(){this.state=Array.from({length:this.NL},()=>({S:Array.from({length:this.NH},()=>new Float32Array(this.H*this.H)),tm:new Float32Array(this.D),cm:new Float32Array(this.D)}))}unload(){for(let e of this.g.values())for(let r of["nib","sc","mn","codes","lo","hi"])e[r]?.destroy?.();for(let e of this.normBufs)e?.destroy?.();this.normBufs=[],this.rLayers=[],this.rNorms=null,this.engine.clearRwkvState?.(),this.g.clear(),this.w.clear()}async gemm(e,r){let t=this.g.get(e);if(!t){let n=this.w.get(e);return Fe(n,r,r.length,n.length/r.length)}return t.kind==="q3"?this.engine.matmulQ3(r,t.lo,t.hi,t.sc,t.mn,1,t.IN,t.OUT):t.kind==="q8"?this.engine.matmulQ8(r,t.codes,t.sc,1,t.IN,t.OUT):this.engine.matmulQ4(r,t.nib,t.sc,t.mn,1,t.IN,t.OUT)}embedRow(e){let r=this.D;if(this.embedDtype==="f16")return It(this.embedBytes.subarray(e*r*2,e*r*2+r*2),r);if(this.embedDtype==="f32")return $t(this.embedBytes.subarray(e*r*4,e*r*4+r*4),r);if(this.embedDtype==="q8"){let u=this.vocab*r,c=r/32,f=new Int8Array(this.embedBytes.buffer,this.embedBytes.byteOffset+e*r,r),d=this.embedBytes.subarray(u+e*c*2,u+e*c*2+c*2),p=new DataView(d.buffer,d.byteOffset,d.byteLength),g=new Float32Array(r);for(let m=0;m<c;m++){let b=de(p.getUint16(m*2,!0));for(let v=0;v<32;v++)g[m*32+v]=f[m*32+v]*b}return g}let t=this.vocab*r,n=r/32,s=0,i=t/2,a=t/2+t/32*2,o=new Uint8Array(r/2+n*2*2);return o.set(this.embedBytes.subarray(s+e*r/2,s+e*r/2+r/2),0),o.set(this.embedBytes.subarray(i+e*n*2,i+e*n*2+n*2),r/2),o.set(this.embedBytes.subarray(a+e*n*2,a+e*n*2+n*2),r/2+n*2),ge(be(o,r))}async timeMix(e,r,t,n){let s=this.D,i=this.H,a=this.NH,o=`blk.${e}.`,u=M=>this.w.get(o+M),c=new Float32Array(s);for(let M=0;M<s;M++)c[M]=t.tm[M]-r[M];t.tm=r.slice();let f=u("time_mix_lerp_fused.weight"),d=M=>{let T=new Float32Array(s);for(let R=0;R<s;R++)T[R]=r[R]+c[R]*f[M*s+R];return T},[p,g,m,b,v,_]=[d(0),d(1),d(2),d(3),d(4),d(5)],B=await this.gemm(o+"time_mix_receptance.weight",p),q=await this.gemm(o+"time_mix_key.weight",m),C=await this.gemm(o+"time_mix_value.weight",b),j=Fe(u("time_mix_w1.weight"),g,s,u("time_mix_w1.weight").length/s);for(let M=0;M<j.length;M++)j[M]=Math.tanh(j[M]);let x=Fe(u("time_mix_w2.weight"),j,j.length,s),k=u("time_mix_w0.weight"),w=new Float32Array(s);for(let M=0;M<s;M++)w[M]=Math.exp(-.606531*yt(k[M]+x[M]));let h=u("time_mix_a1.weight"),A=Fe(u("time_mix_a2.weight"),Fe(h,v,s,h.length/s),h.length/s,s),y=u("time_mix_a0.weight"),P=new Float32Array(s);for(let M=0;M<s;M++)P[M]=yt(y[M]+A[M]);let U=u("time_mix_g1.weight"),F=Fe(U,_,s,U.length/s);for(let M=0;M<F.length;M++)F[M]=yt(F[M]);let G=Fe(u("time_mix_g2.weight"),F,F.length,s);if(e===0)n.vFirst=C.slice();else{let M=u("time_mix_v1.weight"),T=Fe(u("time_mix_v2.weight"),Fe(M,b,s,M.length/s),M.length/s,s),R=u("time_mix_v0.weight");for(let K=0;K<s;K++)C[K]=C[K]+(n.vFirst[K]-C[K])*yt(R[K]+T[K])}let O=u("time_mix_k_k.weight"),D=u("time_mix_k_a.weight"),E=new Float32Array(s);for(let M=0;M<s;M++)E[M]=q[M]*O[M];for(let M=0;M<a;M++){let T=0;for(let R=0;R<i;R++){let K=E[M*i+R];T+=K*K}T=Math.sqrt(T)||1e-12;for(let R=0;R<i;R++)E[M*i+R]/=T}let S=new Float32Array(s);for(let M=0;M<s;M++)S[M]=q[M]*(1+(P[M]-1)*D[M]);let L=new Float32Array(s);for(let M=0;M<a;M++){let T=M*i,R=t.S[M];for(let K=0;K<i;K++){let N=0;for(let H=0;H<i;H++)N+=-E[T+H]*R[K*i+H];let I=0,Q=C[T+K];for(let H=0;H<i;H++){let Y=w[T+H]*R[K*i+H]+Q*S[T+H]+E[T+H]*P[T+H]*N;R[K*i+H]=Y,I+=B[T+H]*Y}L[T+K]=I}}let z=u("time_mix_ln.weight"),W=u("time_mix_ln.bias"),V=u("time_mix_r_k.weight"),$=new Float32Array(s);for(let M=0;M<a;M++){let T=M*i,R=0;for(let I=0;I<i;I++)R+=L[T+I];R/=i;let K=0;for(let I=0;I<i;I++){let Q=L[T+I]-R;K+=Q*Q}K/=i;let N=1/Math.sqrt(K+64e-5);for(let I=0;I<i;I++)$[T+I]=(L[T+I]-R)*N*z[T+I]+W[T+I]}for(let M=0;M<a;M++){let T=M*i,R=0;for(let K=0;K<i;K++)R+=B[T+K]*S[T+K]*V[T+K];for(let K=0;K<i;K++)$[T+K]+=R*C[T+K]}let X=new Float32Array(s);for(let M=0;M<s;M++)X[M]=$[M]*G[M];return this.gemm(o+"time_mix_output.weight",X)}async channelMix(e,r,t){let n=this.D,s=`blk.${e}.`,i=this.w.get(s+"channel_mix_lerp_k.weight"),a=new Float32Array(n);for(let c=0;c<n;c++)a[c]=t.cm[c]-r[c];t.cm=r.slice();let o=new Float32Array(n);for(let c=0;c<n;c++)o[c]=r[c]+a[c]*i[c];let u=await this.gemm(s+"channel_mix_key.weight",o);for(let c=0;c<u.length;c++)u[c]=u[c]>0?u[c]*u[c]:0;return this.gemm(s+"channel_mix_value.weight",u)}async forwardToken(e){let r=this.D,t={vFirst:null},n=this.embedRow(e);n=kt(n,this.w.get("token_embd_norm.weight"),this.w.get("token_embd_norm.bias"),r);for(let s=0;s<this.NL;s++){let i=this.state[s],a=`blk.${s}.`,o=await this.timeMix(s,kt(n,this.w.get(a+"attn_norm.weight"),this.w.get(a+"attn_norm.bias"),r),i,t);for(let c=0;c<r;c++)n[c]+=o[c];let u=await this.channelMix(s,kt(n,this.w.get(a+"attn_norm_2.weight"),this.w.get(a+"attn_norm_2.bias"),r),i);for(let c=0;c<r;c++)n[c]+=u[c]}return n=kt(n,this.w.get("output_norm.weight"),this.w.get("output_norm.bias"),r),this.gemm("output.weight",n)}async classify(e,r){let t=this.tok.encode(e),n;if(this.residentAvailable())n=await this.locked(()=>this.logitsGpu(t,0,"cls"));else{this.reset();for(let i of t)n=await this.forwardToken(i)}let s=r.map(i=>({label:i,logit:n[this.tok.encode(" "+i)[0]]})).sort((i,a)=>a.logit-i.logit);return{label:s[0].label,scores:s}}sampleTok(e,r,t){let{temperature:n=.8,topK:s=40,repeatPenalty:i=1.3}=t,a=new Set(r),o=[];for(let d=0;d<e.length;d++){let p=e[d];a.has(d)&&(p=p>0?p/i:p*i),o.push({i:d,v:p})}o.sort((d,p)=>p.v-d.v),o.length=s;let u=o[0].v,c=0;for(let d of o)d.p=Math.exp((d.v-u)/n),c+=d.p;let f=Math.random()*c;for(let d of o)if(f-=d.p,f<=0)return d.i;return o[0].i}async generate(e,r,t,n,s){this.reset();let i=this.tok.encode(e),a;for(let u of i)a=await this.forwardToken(u);let o=[];for(let u=0;u<r&&!n?.();u++){let c;if(s?.sample)c=this.sampleTok(a,o.slice(-64),s);else{c=0;for(let f=1;f<a.length;f++)a[f]>a[c]&&(c=f)}if(c===0)break;o.push(c),t&&t(this.tok.decode(o)),a=await this.forwardToken(c)}return this.tok.decode(o)}pickFromTopK(e,r){if(!r?.sample)return e.ids[0];let{temperature:t=.8,topK:n=40}=r,s=Math.min(n,e.ids.length);for(;s>1&&e.vals[s-1]<=-3e38;)s--;let i=e.vals[0],a=0,o=new Array(s);for(let c=0;c<s;c++)o[c]=Math.exp((e.vals[c]-i)/t),a+=o[c];let u=Math.random()*a;for(let c=0;c<s;c++)if(u-=o[c],u<=0)return e.ids[c];return e.ids[0]}async generateResident(e,r,t,n,s){return this.residentAvailable()?this.locked(async()=>{let a=s?.repeatPenalty??(s?.sample?1.3:1),o=this.tok.encode(e),u=await this.topKGpu(o,0,"gen",[],1,48),c=o.length,f=[];for(let d=0;d<r&&!n?.();d++){let p=this.pickFromTopK(u,s);if(p===0)break;f.push(p),t&&t(this.tok.decode(f)),u=await this.topKGpu([p],c,"gen",a!==1?[...new Set(f.slice(-64))]:[],a,48),c++}return this.tok.decode(f)}):this.generate(e,r,t,n,s)}};ze.PREFILL_CHUNK=32;et=ze});function We(l){if(!l.length)return null;let e=1/0,r=0,t=0;for(let n of l)e=Math.min(e,n.offset),r=Math.max(r,n.offset+n.bytes),t+=n.bytes;return r-e>64<<20||r-e>t*1.5?null:{start:e,end:r}}function Vt(l,e){let r=new Map;for(let s of Object.keys(l)){let i=s.match(/^blk\.(\d+)\./);if(!i)continue;let a=r.get(i[1]);a||r.set(i[1],a=[]),a.push(s)}let t=new Map,n=new Map;return async s=>{let i=l[s];if(!i)throw new Error(`tenseur absent : ${s}`);let a=s.match(/^blk\.(\d+)\./),o=a?r.get(a[1]):void 0,u=o?We(o.map(b=>l[b])):null;if(!a||!o||!u)return e.bytes(i.offset,i.bytes);let c=a[1],f=t.get(c);f||(f=e.bytes(u.start,u.end-u.start).then(b=>({start:u.start,bytes:b})),t.set(c,f),n.set(c,o.length));let{start:d,bytes:p}=await f,g=p.subarray(i.offset-d,i.offset-d+i.bytes),m=(n.get(c)??1)-1;return m<=0?(t.delete(c),n.delete(c),new Uint8Array(g)):(n.set(c,m),g)}}var tt=se(()=>{"use strict"});function Yt(l){return l==="llama"||l==="mistral3"||l==="smollm3"}var cn=se(()=>{"use strict"});function Ms(l){return l instanceof Blob?{bytes:async(e,r)=>new Uint8Array(await l.slice(e,e+r).arrayBuffer())}:l}var oe,rt,ln=se(()=>{"use strict";tt();cn();$e();Ve();Ye();Kt();tt();oe=class oe{constructor(e,r,t){this.rawCache=new Map;this.layerSpan=new Map;this.weightPrecision="f32";this.precOverrides=null;this.layerCache=new Map;this.layerGpuCache=new Map;this.finalNormGpu=null;this.projQ8=null;this.projVocab=0;this.visionSegments=[];this.engine=e,this.source=Ms(r),this.manifest=t,this.weightPrecision=this.nativePrecision}get nativePrecision(){let e=this.manifest.tensors["blk.0.attn_q.weight"];return e?.type==="Q4W"?"q4":e?.type==="Q8W"?"q8":e?.type==="Q3W"?"q3":this.supportsQ8?"q8":this.engine?.hasF16?"f16":"f32"}get isMixedNative(){let e=this.manifest.tensors["blk.0.attn_q.weight"]?.type,r=this.manifest.tensors["blk.0.ffn_gate.weight"]?.type;return(e==="Q4W"||e==="Q8W")&&(r==="Q4W"||r==="Q8W")&&e!==r}get loaded(){return this.manifest!==null}async loadManifest(){return this.manifest}async rawTensor(e){let r=this.rawCache.get(e);if(r)return r;let t=this.manifest.tensors[e];if(!t)throw new Error("tensor absent du manifeste: "+e);let n=await this.source.bytes(t.offset,t.bytes);return this.cacheRaw(e,n)}cacheRaw(e,r){let t=this.maybeUnpermuteLlamaQk(e,r);return this.rawCache.set(e,t),t}maybeUnpermuteLlamaQk(e,r){if(!oe.unpermOn||oe.ropeNormOn&&Yt(this.manifest.arch)||!["llama","mistral3","smollm3"].includes(this.manifest.arch))return r;let t=e.endsWith(".attn_q.weight"),n=e.endsWith(".attn_k.weight");if(!t&&!n)return r;let{nHeads:s,nKvHeads:i,headDim:a}=this.manifest.config,o=this.manifest.tensors[e];if(o.type==="Q8W"||o.type==="Q4W"||o.type==="Q3W")throw new Error("BRIK d\u2019un mod\xE8le llama non support\xE9 (lignes Q/K permut\xE9es) : charger le GGUF directement.");let u=t?s:i,c=u*a,f=o.bytes/c;if(!Number.isInteger(f))throw new Error(`${e} : lignes non uniformes (${o.bytes} o / ${c} lignes). D\xE9-permutation impossible.`);let d=a/2,p=new Uint8Array(r.byteLength);for(let g=0;g<u;g++){let m=g*a;for(let b=0;b<d;b++)p.set(r.subarray((m+2*b)*f,(m+2*b+1)*f),(m+b)*f),p.set(r.subarray((m+2*b+1)*f,(m+2*b+2)*f),(m+d+b)*f)}return p}ensureLayerSpan(e){let r=this.layerSpan.get(e);return r||(r=this.fetchLayerSpan(e).catch(()=>{this.layerSpan.delete(e)}),this.layerSpan.set(e,r)),r}async fetchLayerSpan(e){let r=`blk.${e}.`,t=Object.entries(this.manifest.tensors).filter(([i])=>i.startsWith(r)),n=We(t.map(([,i])=>i));if(!n)return;let s=await this.source.bytes(n.start,n.end-n.start);for(let[i,a]of t)this.rawCache.has(i)||this.cacheRaw(i,s.subarray(a.offset-n.start,a.offset-n.start+a.bytes))}async debugTensorF32(e,r=!1){if(!r)return this.dequant(e);let t=oe.unpermOn,n=this.rawCache.has(e),s=this.rawCache.get(e);try{return oe.unpermOn=!1,this.rawCache.delete(e),await this.dequant(e)}finally{oe.unpermOn=t,this.rawCache.delete(e),n&&s&&this.rawCache.set(e,s)}}async dequant(e){let r=this.manifest.tensors[e],t=await this.rawTensor(e);return this.engine.dequantizeByType(r.type,t,r.nElems)}async dequantGpu(e){let r=this.manifest.tensors[e],t=await this.rawTensor(e);return this.engine.dequantizeToGpu(r.type,t,r.nElems)}async dequantGpuF16(e){let r=this.manifest.tensors[e],t=await this.rawTensor(e);if(r.type==="F16")return this.engine.uploadGpuRawF16(t);let n=this.engine.dequantizeToGpu(r.type,t,r.nElems),s=this.engine.f32ToF16Gpu(n,r.nElems);return n.destroy?.(),s}async dequantGpuQ4(e){let r=this.manifest.tensors[e],t=await this.rawTensor(e);if(r.type!=="Q4W"){let s=this.engine.dequantizeToGpu(r.type,t,r.nElems),i=this.engine.f32ToQ4Gpu(s,r.nElems);return s.destroy?.(),i}let n=be(t,r.nElems);return{nib:this.engine.uploadGpuRaw(n.nibbles),sc:this.engine.uploadGpuRaw(new Uint8Array(n.scales.buffer,n.scales.byteOffset,n.scales.byteLength)),mn:this.engine.uploadGpuRaw(new Uint8Array(n.mins.buffer,n.mins.byteOffset,n.mins.byteLength))}}async dequantGpuQ3(e){let r=this.manifest.tensors[e],t=await this.rawTensor(e);if(r.type!=="Q3W")return this.engine.dequantizeToGpu(r.type,t,r.nElems);let n=xe(t,r.nElems);return{q3:!0,lo:this.engine.uploadGpuRaw(new Uint8Array(n.lo.buffer,n.lo.byteOffset,n.lo.byteLength)),hi:this.engine.uploadGpuRaw(new Uint8Array(n.hi.buffer,n.hi.byteOffset,n.hi.byteLength)),sc:this.engine.uploadGpuRaw(new Uint8Array(n.scales.buffer,n.scales.byteOffset,n.scales.byteLength)),mn:this.engine.uploadGpuRaw(new Uint8Array(n.mins.buffer,n.mins.byteOffset,n.mins.byteLength))}}async dequantGpuQ8(e){let r=this.manifest.tensors[e],t=await this.rawTensor(e);if(r.type!=="Q8W"){let s=this.engine.dequantizeToGpu(r.type,t,r.nElems),i=this.engine.f32ToQ8Gpu(s,r.nElems);return s.destroy?.(),i}let n=ke(t,r.nElems);return{codes:this.engine.uploadGpuRaw(new Uint8Array(n.codes.buffer,n.codes.byteOffset,n.codes.byteLength)),sc:this.engine.uploadGpuRaw(new Uint8Array(n.scales.buffer,n.scales.byteOffset,n.scales.byteLength))}}static destroyWeight(e){e&&(e.q3?(e.lo?.destroy?.(),e.hi?.destroy?.(),e.sc?.destroy?.(),e.mn?.destroy?.()):e.nib?(e.nib?.destroy?.(),e.sc?.destroy?.(),e.mn?.destroy?.()):e.codes?(e.codes?.destroy?.(),e.sc?.destroy?.()):e.destroy?.())}get precision(){return this.weightPrecision}get supportsQ4(){let{d:e,ffn:r}=this.manifest.config;return e%32===0&&r%32===0}get supportsQ8(){return this.supportsQ4}get supportsQ3(){return this.supportsQ4}matPrecision(e){let r=this.weightPrecision;if((r==="q4"||r==="q8")&&this.precOverrides){for(let[t,n]of this.precOverrides)if(e.includes(t))return n}if(r===this.nativePrecision){let t=this.manifest.tensors[e]?.type;if(t==="Q4W")return"q4";if(t==="Q8W")return"q8";if(t==="Q3W")return"q3"}return r}setWeightPrecision(e){if(e!==this.weightPrecision){if((e==="q4"||e==="q8")&&!this.supportsQ4)throw new Error(`${e} indisponible : d ou ffn non multiple de 32`);for(let r of this.layerGpuCache.values())for(let t of Object.values(r))oe.destroyWeight(t);this.layerGpuCache.clear(),this.weightPrecision=e}}async layerWeights(e){let r=this.layerCache.get(e);if(r)return r;let t=`blk.${e}`,[n,s,i,a,o,u,c,f,d,p,g,m]=await Promise.all([this.dequant(`${t}.attn_norm.weight`),this.dequantGpu(`${t}.attn_q.weight`),this.dequantGpu(`${t}.attn_k.weight`),this.dequantGpu(`${t}.attn_v.weight`),this.dequantGpu(`${t}.attn_output.weight`),this.dequant(`${t}.ffn_norm.weight`),this.dequantGpu(`${t}.ffn_gate.weight`),this.dequantGpu(`${t}.ffn_up.weight`),this.dequantGpu(`${t}.ffn_down.weight`),this.dequant(`${t}.attn_q.bias`).catch(()=>{}),this.dequant(`${t}.attn_k.bias`).catch(()=>{}),this.dequant(`${t}.attn_v.bias`).catch(()=>{})]),[b,v,_,B]=await Promise.all([this.dequant(`${t}.post_attention_norm.weight`).catch(()=>{}),this.dequant(`${t}.post_ffw_norm.weight`).catch(()=>{}),this.dequant(`${t}.attn_q_norm.weight`).catch(()=>{}),this.dequant(`${t}.attn_k_norm.weight`).catch(()=>{})]),q={attnNorm:n,wq:s,wk:i,wv:a,wo:o,ffnNorm:u,wgate:c,wup:f,wdown:d,bq:p,bk:g,bv:m,postAttnNorm:b,postFfnNorm:v,qNorm:_,kNorm:B};return this.layerCache.set(e,q),q}async warmup(e){let{blockCount:r,d:t}=this.manifest.config,n=r+1;for(let s=0;s<r;s++)await this.layerWeightsGpu(s),e?.(s+1,n);await this.getFinalNormGpu(),await this.getRopeFactors(),await this.getProjectionQ8(t);try{await this.topKKV([0],0,"brimkern-warmup",[],1),this.reset()}catch(s){console.warn("[warmup] passe \xE0 blanc impossible. Le premier message paiera le transfert :",s)}e?.(n,n)}async layerWeightsGpu(e){let r=this.layerGpuCache.get(e);if(r)return r;await this.ensureLayerSpan(e);let t=`blk.${e}`,n=h=>this.engine.uploadGpu(h),i=this.weightPrecision==="f16",a=h=>{let A=this.matPrecision(h);return A==="q3"?this.dequantGpuQ3(h):A==="q4"?this.dequantGpuQ4(h):A==="q8"?this.dequantGpuQ8(h):A==="f16"?this.dequantGpuF16(h):this.dequantGpu(h)},[o,u,c,f,d,p,g,m,b,v,_,B]=await Promise.all([this.dequant(`${t}.attn_norm.weight`).then(n),a(`${t}.attn_q.weight`),a(`${t}.attn_k.weight`),a(`${t}.attn_v.weight`),a(`${t}.attn_output.weight`),this.dequant(`${t}.ffn_norm.weight`).then(n),a(`${t}.ffn_gate.weight`),a(`${t}.ffn_up.weight`),a(`${t}.ffn_down.weight`),this.dequant(`${t}.attn_q.bias`).then(n).catch(()=>{}),this.dequant(`${t}.attn_k.bias`).then(n).catch(()=>{}),this.dequant(`${t}.attn_v.bias`).then(n).catch(()=>{})]),[q,C,j,x]=await Promise.all([this.dequant(`${t}.post_attention_norm.weight`).then(n).catch(()=>{}),this.dequant(`${t}.post_ffw_norm.weight`).then(n).catch(()=>{}),this.dequant(`${t}.attn_q_norm.weight`).then(n).catch(()=>{}),this.dequant(`${t}.attn_k_norm.weight`).then(n).catch(()=>{})]),k={attnNorm:o,wq:u,wk:c,wv:f,wo:d,ffnNorm:p,wgate:g,wup:m,wdown:b,bq:v,bk:_,bv:B,postAttnNorm:q,postFfnNorm:C,qNorm:j,kNorm:x,matF16:i};this.layerGpuCache.set(e,k);let w=`blk.${e}.`;for(let h of this.rawCache.keys())h.startsWith(w)&&this.rawCache.delete(h);return this.layerSpan.delete(e),k}async getFinalNormGpu(){return this.finalNormGpu||(this.finalNormGpu=this.engine.uploadGpu(await this.dequant("output_norm.weight"))),this.finalNormGpu}async prewarmGpu(e){let{blockCount:r,d:t}=this.manifest.config,n=new Array(r).fill(0);for(let[o,u]of Object.entries(this.manifest.tensors)){let c=o.match(/^blk\.(\d+)\./);c&&(n[Number(c[1])]+=u.bytes)}let s=n.reduce((o,u)=>o+u,0),i=0,a=4;for(let o=0;o<r;o+=a){let u=Math.min(a,r-o);await Promise.all(Array.from({length:u},(c,f)=>this.layerWeightsGpu(o+f)));for(let c=0;c<u;c++)i+=n[o+c];e?.(i,s)}await this.getFinalNormGpu(),await this.getProjectionQ8(t)}static q8RowsBlob(e,r,t,n,s){let i=s/32,a=t*s,o=n*s,u=r+t*i*2,c=n*i*2,f=new Uint8Array(o+c);return f.set(e.subarray(a,a+o),0),f.set(e.subarray(u,u+c),o),f}static q4RowsBlob(e,r,t,n,s){let i=s/32,a=0,o=r/2,u=r/2+r/32*2,c=n*s/2,f=n*i*2,d=new Uint8Array(c+f*2);return d.set(e.subarray(a+t*s/2,a+t*s/2+c),0),d.set(e.subarray(o+t*i*2,o+t*i*2+f),c),d.set(e.subarray(u+t*i*2,u+t*i*2+f),c+f),d}async embed(e,r){let t=this.manifest.tensors["token_embd.weight"],n=t.nElems/r,s=t.type==="Q8W",i=t.type==="Q4W",a=t.bytes/n;if(!s&&!i&&!Number.isInteger(a))throw new Error("token_embd: lignes non uniformes");let o=await this.rawTensor("token_embd.weight"),u=this.manifest.config.embedScale??1,c=new Float32Array(e.length*r);for(let f=0;f<e.length;f++){let d=e[f],p=s?oe.q8RowsBlob(o,t.nElems,d,1,r):i?oe.q4RowsBlob(o,t.nElems,d,1,r):o.subarray(d*a,(d+1)*a),g=await this.engine.dequantizeByType(t.type,p,r);if(u!==1)for(let m=0;m<r;m++)g[m]*=u;c.set(g,f*r)}return c}async getProjectionQ8(e){if(this.projQ8)return this.projQ8;let r=this.manifest.tensors["output.weight"]?"output.weight":"token_embd.weight",t=this.manifest.tensors[r];if(!t)throw new Error("Logits projection tensor not found (output.weight / token_embd.weight)");let n=t.nElems/e;this.projVocab=n;let s=await this.rawTensor(r),i=Math.max(1,Math.floor(this.engine.maxStorageBufferBindingSize*.9/e)),a=[];if(t.type==="Q4W"){for(let u=0;u<n;u+=i){let c=Math.min(i,n-u),f=oe.q4RowsBlob(s,t.nElems,u,c,e),d=c*e/2,p=c*(e/32)*2;a.push({w:{nib:this.engine.uploadGpuRaw(f.subarray(0,d)),sc:this.engine.uploadGpuRaw(f.subarray(d,d+p)),mn:this.engine.uploadGpuRaw(f.subarray(d+p))},rows:c,r0:u})}return this.projQ8=a,a}let o=t.type==="Q8W"?s:await this.engine.quantizeToBytes(t.type,s,t.nElems,"q8");for(let u=0;u<n;u+=i){let c=Math.min(i,n-u),f=oe.q8RowsBlob(o,t.nElems,u,c,e),d=c*e;a.push({w:{codes:this.engine.uploadGpuRaw(f.subarray(0,d)),sc:this.engine.uploadGpuRaw(f.subarray(d))},rows:c,r0:u})}return this.projQ8=a,a}async argmaxLogits(e,r){let t=await this.getProjectionQ8(r),n=0,s=-1/0;for(let i of t){let a=i.w.nib?await this.engine.matmulQ4(e,i.w.nib,i.w.sc,i.w.mn,1,r,i.rows):await this.engine.matmulQ8(e,i.w.codes,i.w.sc,1,r,i.rows);for(let o=0;o<a.length;o++)a[o]>s&&(s=a[o],n=i.r0+o)}return n}archFlags(){let e=this.manifest.config;return{attnScale:e.attnScale,attnLogitSoftcap:e.attnLogitSoftcap,act:e.act,rmsGainOnePlus:e.rmsGainOnePlus,windowPerLayer:e.windowPerLayer,ropeThetaPerLayer:e.ropeThetaPerLayer,skipRopePerLayer:e.skipRopePerLayer,ropeInterleaved:oe.ropeNormOn?e.ropeInterleaved??(Yt(this.manifest.arch)||void 0):void 0}}mropePositions(e,r){let t=e+r,n=new Uint32Array(r*3),s=[...this.visionSegments].sort((c,f)=>c.at-f.at),i=(c,f,d,p)=>{c>=e&&c<t&&(n[(c-e)*3]=f,n[(c-e)*3+1]=d,n[(c-e)*3+2]=p)},a=0,o=0,u=0;for(;a<t;){let c=u<s.length?s[u]:null;if(c&&a===c.at){let f=o,d=c.gh*c.gw;for(let p=0;p<d;p++)i(a+p,f,f+Math.floor(p/c.gw),f+p%c.gw);o=f+Math.max(c.gh,c.gw),a+=d,u++}else i(a,o,o,o),o++,a++}return n}async getRopeFactors(){if(this.ropeFactorsCache!==void 0)return this.ropeFactorsCache;if(!oe.ropeFactorsOn)return console.warn("[model] facteurs RoPE COUP\xC9S par ?ropefactors=0 : RoPE standard"),this.ropeFactorsCache=null,null;if(this.manifest.tensors["rope_freqs.weight"])this.ropeFactorsCache=await this.dequant("rope_freqs.weight"),console.log("[model] rope_freqs.weight pr\xE9sent : RoPE \xE0 facteurs (scaling llama3) actif");else if(this.manifest.config.yarn){let{factor:e,betaFast:r,betaSlow:t,origCtx:n}=this.manifest.config.yarn,{headDim:s,ropeTheta:i}=this.manifest.config,a=s/2,o=d=>s*Math.log(n/(d*2*Math.PI))/(2*Math.log(i)),u=o(r),c=o(t),f=new Float32Array(a);for(let d=0;d<a;d++){let p=1-Math.min(1,Math.max(0,(d-u)/Math.max(.001,c-u)));f[d]=1/(1/e*(1-p)+p)}this.ropeFactorsCache=f,console.log(`[model] YaRN statique actif (factor ${e}, dims corr ${u.toFixed(1)}\u2013${c.toFixed(1)})`)}else this.ropeFactorsCache=null;return this.ropeFactorsCache}applyMrope(e,r,t){let n=this.manifest.config.mropeSections;if(n){if(!this.engine.mropeOk)throw new Error("M-RoPE indisponible sur ce GPU (selfValidate) : vision d\xE9sactiv\xE9e.");e.mropeSections=n,e.positions=this.mropePositions(r,t)}}static applyInjections(e,r,t,n,s){if(s)for(let i of s){let a=i.rows.length/r;for(let o=0;o<a;o++){let u=i.at+o-t;u>=0&&u<n&&e.set(i.rows.subarray(o*r,(o+1)*r),u*r)}}}get kvQuant(){return this.engine.kvQuant===!0}setKvQuant(e){this.engine.setKvQuant(e)}reset(){this.engine.clearKvCache(),this.visionSegments=[]}unload(){this.reset();for(let e of this.layerGpuCache.values())for(let r of Object.values(e))oe.destroyWeight(r);this.layerGpuCache.clear(),this.finalNormGpu?.destroy?.(),this.finalNormGpu=null;for(let e of this.projQ8??[])oe.destroyWeight(e.w);this.projQ8=null,this.layerCache.clear(),this.rawCache.clear(),this.layerSpan.clear()}async hiddenKV(e,r,t,n){let s=this.manifest,{d:i,nHeads:a,nKvHeads:o,headDim:u,ffn:c,blockCount:f,ropeTheta:d,rmsEps:p}=s.config,g={seq:e.length,d:i,nHeads:a,nKvHeads:o,headDim:u,ffn:c,ropeTheta:d,eps:p,...this.archFlags()};this.applyMrope(g,r,e.length),g.ropeFactors=await this.getRopeFactors()??void 0;let m=await this.embed(e,i);oe.applyInjections(m,i,r,e.length,n);let b=await Promise.all(Array.from({length:f},(_,B)=>this.layerWeightsGpu(B))),v=await this.getFinalNormGpu();return this.engine.runDecodeGpu(m,g,b,r,v,t)}async generateNextKV(e,r,t,n){let s=await this.hiddenKV(e,r,t,n);return this.argmaxLogits(s,this.manifest.config.d)}async logitsKV(e,r,t,n){let s=this.manifest,{d:i,nHeads:a,nKvHeads:o,headDim:u,ffn:c,blockCount:f,ropeTheta:d,rmsEps:p}=s.config,g={seq:e.length,d:i,nHeads:a,nKvHeads:o,headDim:u,ffn:c,ropeTheta:d,eps:p,...this.archFlags()};this.applyMrope(g,r,e.length),g.ropeFactors=await this.getRopeFactors()??void 0;let m=oe.timingOn?(x,k)=>console.info(`[timing] ${x} ${(performance.now()-k).toFixed(0)} ms`):null,b=performance.now(),v=await this.embed(e,i);m?.("embed",b),b=performance.now(),oe.applyInjections(v,i,r,e.length,n);let _=await Promise.all(Array.from({length:f},(x,k)=>this.layerWeightsGpu(k)));m?.("poids des couches",b),b=performance.now();let B=await this.getFinalNormGpu(),q=await this.getProjectionQ8(i);m?.("norme finale + t\xEAte de projection",b),b=performance.now();let C=await this.engine.decodeLogitsQ8(v,g,_,r,B,t,q,this.projVocab);m?.("forward + logits",b);let j=s.config.finalLogitSoftcap;if(j&&j>0)for(let x=0;x<C.length;x++)C[x]=j*Math.tanh(C[x]/j);return C}async topKKV(e,r,t,n,s,i){let a=this.manifest,{d:o,nHeads:u,nKvHeads:c,headDim:f,ffn:d,blockCount:p,ropeTheta:g,rmsEps:m}=a.config,b={seq:e.length,d:o,nHeads:u,nKvHeads:c,headDim:f,ffn:d,ropeTheta:g,eps:m,...this.archFlags()};this.applyMrope(b,r,e.length),b.ropeFactors=await this.getRopeFactors()??void 0;let v=oe.timingOn?(k,w)=>console.info(`[timing] ${k} ${(performance.now()-w).toFixed(0)} ms`):null,_=performance.now(),B=await this.embed(e,o);v?.("embed",_),_=performance.now(),oe.applyInjections(B,o,r,e.length,i);let q=await Promise.all(Array.from({length:p},(k,w)=>this.layerWeightsGpu(w)));v?.("poids des couches",_),_=performance.now();let C=await this.getFinalNormGpu(),j=await this.getProjectionQ8(o);v?.("norme finale + tete de projection",_),_=performance.now();let x=await this.engine.decodeTopKQ8(B,b,q,r,C,t,j,this.projVocab,n,s,a.config.finalLogitSoftcap??0);return v?.("forward + top-k",_),x}async debugHiddenPerLayer(e){let r=this.manifest,{d:t,nHeads:n,nKvHeads:s,headDim:i,ffn:a,blockCount:o,ropeTheta:u,rmsEps:c}=r.config,d={seq:e.length,d:t,nHeads:n,nKvHeads:s,headDim:i,ffn:a,ropeTheta:u,eps:c,...this.archFlags()};d.ropeFactors=await this.getRopeFactors()??void 0;let p=await this.embed(e,t),g=[];for(let m=0;m<o;m++)p=await this.engine.layerForward(p,d,await this.layerWeights(m),!0),g.push(Float32Array.from(p));return g}};oe.timingOn=(()=>{try{return re("timing")==="1"}catch{return!1}})(),oe.ropeNormOn=(()=>{try{return re("ropenorm")!=="0"}catch{return!0}})(),oe.unpermOn=(()=>{try{return re("unperm")!=="0"}catch{return!0}})(),oe.ropeFactorsOn=(()=>{try{return re("ropefactors")!=="0"}catch{return!0}})();rt=oe});async function xt(l){let e=Math.min(l.size,104857600),t=await l.slice(0,e).arrayBuffer(),n=new Xt(t),s=[String.fromCharCode(n.uint8()),String.fromCharCode(n.uint8()),String.fromCharCode(n.uint8()),String.fromCharCode(n.uint8())].join("");if(s!=="GGUF")throw new Error(`Fichier GGUF invalide. Sceau magique absent : ${s}`);let i=n.uint32();if(i!==2&&i!==3)throw new Error(`Version GGUF non support\xE9e : ${i}`);let a=n.uint64(),o=n.uint64(),u=y=>{switch(y){case 0:return n.uint8();case 1:return n.int8();case 2:return n.uint16();case 3:return n.int16();case 4:return n.uint32();case 5:return n.int32();case 6:return n.float32();case 7:return n.uint8()!==0;case 8:return n.string();case 9:{let P=n.uint32(),U=n.uint64(),F=[];for(let G=0;G<U;G++)F.push(u(P));return F}case 10:return n.uint64();case 11:return n.int64();case 12:return n.float64();default:throw new Error(`Type de m\xE9tadonn\xE9es non support\xE9 : ${y}`)}},c={};for(let y=0;y<o;y++){let P=n.string(),U=n.uint32(),F=u(U);c[P]=F}let f=c["general.alignment"]??32,d=c["general.architecture"]??"llama",p=[];for(let y=0;y<a;y++){let P=n.string(),U=n.uint32(),F=[];for(let D=0;D<U;D++)F.push(n.uint64());let G=n.uint32(),O=n.uint64();p.push({name:P,shape:F,typeIdx:G,relativeOffset:O})}let g=n.getOffset(),m=Math.ceil(g/f)*f,b={};for(let y=0;y<p.length;y++){let P=p[y],U=Rs[P.typeIdx]||"UNKNOWN",F=P.shape.reduce((O,D)=>O*D,1),G=0;if(y<p.length-1)G=p[y+1].relativeOffset-P.relativeOffset;else{let{block:O,size:D}=Ls(U);G=F/O*D}b[P.name]={offset:m+P.relativeOffset,bytes:G,nElems:F,type:U,shape:P.shape}}let v=(y,P)=>{let U=c[`${d}.${y}`];return U!==void 0?Number(U):P},_=(y,P)=>{let U=c[`${d}.${y}`];return U!==void 0?Number(U):P},B=v("embedding_length",0),q=v("attention.head_count",0),C=v("attention.head_count_kv",q),j=v("block_count",0),x=_("rope.freq_base",1e4),k=_("attention.layer_norm_rms_epsilon",1e-5),w=v("attention.key_length",0)||(q>0?B/q:0),h=v("feed_forward_length",0),A={d:B,nHeads:q,nKvHeads:C,headDim:w,ffn:h,blockCount:j,ropeTheta:x,rmsEps:k};if(d==="rwkv7"||d==="rwkv6"){let y=v("wkv.head_size",64);A.headDim=y,A.nHeads=y>0?Math.floor(B/y):0,A.nKvHeads=A.nHeads,A.rwkv={headSize:y,decayLoraRank:v("attention.decay_lora_rank",64),iclrLoraRank:v("attention.iclr_lora_rank",64),valueLoraRank:v("attention.value_residual_mix_lora_rank",32),gateLoraRank:v("attention.gate_lora_rank",128)}}if(d==="lfm2"){let y=c["lfm2.attention.head_count_kv"],P=Array.isArray(y)?y.map(Number):[];A.nKvHeads=P.length?Math.max(...P):q,A.headDim=w||64,A.lfm2={lCache:v("shortconv.l_cache",3),kvHeadsPerLayer:P.length?P:Array(j).fill(A.nKvHeads)}}if(d==="qwen35"||d==="qwen3_5"){let y=v("full_attention_interval",4);A.qwen35={fullAttnInterval:y,dConv:v("ssm.d_conv",4),dInner:v("ssm.d_inner",B),dState:v("ssm.d_state",128),dtRank:v("ssm.dt_rank",32),nGroup:v("ssm.n_group",16)}}if((d==="gemma"||d==="gemma2")&&(A.act="gelu",A.embedScale=Math.sqrt(B)),d==="gemma2"){A.attnLogitSoftcap=_("attn_logit_softcapping",50),A.finalLogitSoftcap=_("final_logit_softcapping",30);let y=v("attention.query_pre_attn_scalar",0);A.attnScale=y>0?1/Math.sqrt(y):w>0?1/Math.sqrt(w):void 0}{let y=c[`${d}.rope.scaling.type`],P=_("rope.scaling.factor",1);if(y==="yarn"&&P>1&&w>0){A.yarn={factor:P,betaFast:_("rope.scaling.yarn_beta_fast",32),betaSlow:_("rope.scaling.yarn_beta_slow",1),origCtx:v("rope.scaling.original_context_length",0)};let U=1+.1*Math.log(P);A.attnScale=U*U/Math.sqrt(w)}}if(d==="gemma3"){A.act="gelu",A.embedScale=Math.sqrt(B);let y=v("attention.sliding_window",512),P=v("attention.sliding_window_pattern",6)||6,U=_("rope.local_freq_base",1e4),F=G=>(G+1)%P===0;A.windowPerLayer=Array.from({length:j},(G,O)=>F(O)?0:y),A.ropeThetaPerLayer=Array.from({length:j},(G,O)=>F(O)?x:U)}if(d==="smollm3"){let y=c[`${d}.no_rope_layers`],P=Array.isArray(y)?y.map(Number):[];A.skipRopePerLayer=P.length===j?P.map(U=>U===0):Array.from({length:j},(U,F)=>(F+1)%4===0)}if((d==="llama"||d==="mistral3"||d==="smollm3")&&(A.ropeInterleaved=!0),d==="qwen2vl"){let y=c["qwen2vl.rope.dimension_sections"],P=Array.isArray(y)?y.map(Number).filter(U=>U>0):[];A.mropeSections=P.length===3?P:[16,24,24]}return{arch:d,config:A,tensors:b,metadata:c}}var Xt,Rs,Ls,Jt=se(()=>{"use strict";Xt=class{constructor(e){this.offset=0;this.view=new DataView(e)}getOffset(){return this.offset}setOffset(e){this.offset=e}uint8(){let e=this.view.getUint8(this.offset);return this.offset+=1,e}int8(){let e=this.view.getInt8(this.offset);return this.offset+=1,e}uint16(){let e=this.view.getUint16(this.offset,!0);return this.offset+=2,e}int16(){let e=this.view.getInt16(this.offset,!0);return this.offset+=2,e}uint32(){let e=this.view.getUint32(this.offset,!0);return this.offset+=4,e}int32(){let e=this.view.getInt32(this.offset,!0);return this.offset+=4,e}float32(){let e=this.view.getFloat32(this.offset,!0);return this.offset+=4,e}float64(){let e=this.view.getFloat64(this.offset,!0);return this.offset+=8,e}uint64(){let e=this.view.getUint32(this.offset,!0),r=this.view.getUint32(this.offset+4,!0);return this.offset+=8,e+r*4294967296}int64(){let e=this.view.getUint32(this.offset,!0),r=this.view.getInt32(this.offset+4,!0);return this.offset+=8,e+r*4294967296}string(){let e=this.uint64();if(this.offset+e>this.view.byteLength)throw new Error(`BinaryReader: string length ${e} exceeds buffer size`);let r=new Uint8Array(this.view.buffer,this.offset,e);return this.offset+=e,new TextDecoder().decode(r)}},Rs=["F32","F16","Q4_0","Q4_1","Q4_2","Q4_3","Q5_0","Q5_1","Q8_0","Q8_1","Q2_K","Q3_K","Q4_K","Q5_K","Q6_K","Q8_K","IQ2_XXS","IQ2_XS","IQ3_XXS","IQ1_S","IQ4_NL","IQ3_S","IQ2_S","IQ4_XS","I8","I16","I32","I64","F64","IQ1_M","BF16","Q4_0_4_4","Q4_0_4_8","Q4_0_8_8","TQ1_0","TQ2_0"],Ls=l=>{switch(l){case"F32":return{block:1,size:4};case"F16":return{block:1,size:2};case"Q4_0":return{block:32,size:18};case"Q4_1":return{block:32,size:20};case"Q5_0":return{block:32,size:22};case"Q5_1":return{block:32,size:24};case"Q8_0":return{block:32,size:34};case"Q2_K":return{block:256,size:66};case"Q3_K":return{block:256,size:110};case"Q4_K":return{block:256,size:144};case"Q5_K":return{block:256,size:176};case"Q6_K":return{block:256,size:210};case"Q8_K":return{block:256,size:288};default:throw new Error(`Type GGML non support\xE9 : ${l}. Types lus : F32, F16, Q4_0/1, Q5_0/1, Q8_0, Q2_K\u2026Q8_K.`)}}});function dn(l,e=16){return Math.ceil(l/e)*e}function Ks(l){if(l.length>128||l.includes(".."))return!1;let e=l.split("/");return e.length<=2&&e.every(r=>Es.test(r))}function pn(l){let e=i=>{throw new Error(`BRIK: manifeste invalide \u2014 ${i}`)};(!l||typeof l!="object")&&e("ce n'est pas un objet"),l.format!=="brik"&&e(`champ format \xAB ${String(l.format)} \xBB (attendu \xAB brik \xBB)`),(!Le(l.version,1024)||l.version<1)&&e(`version ${String(l.version)}`),(!l.model||typeof l.model.name!="string"||l.model.name.length>512)&&e("champ model.name");let r=l.arch;(!r||typeof r!="object"||typeof r.arch!="string"||r.arch.length>64)&&e("champ arch.arch");for(let[i,a]of[["d",262144],["nHeads",4096],["nKvHeads",4096],["headDim",4096],["ffn",1048576],["blockCount",1024],["vocab",1e7]])Le(r[i],a)||e(`arch.${i} = ${String(r[i])}`);for(let i of["ropeTheta","rmsEps"])(typeof r[i]!="number"||!Number.isFinite(r[i]))&&e(`arch.${i} = ${String(r[i])}`);l.tokenizer&&(l.tokenizer.kind!=="hf-hub"&&l.tokenizer.kind!=="embedded"&&e(`tokenizer.kind \xAB ${String(l.tokenizer.kind)} \xBB`),l.tokenizer.id&&!Ks(l.tokenizer.id)&&e(`tokenizer.id \xAB ${l.tokenizer.id} \xBB (attendu : \xAB auteur/d\xE9p\xF4t \xBB ou une sentinelle sans barre oblique)`)),(!Array.isArray(l.shards)||l.shards.length===0||l.shards.length>fn)&&e(`${Array.isArray(l.shards)?l.shards.length:"aucun"} shard`);let t=new Map;for(let i of l.shards)Le(i.id,fn)||e(`shard.id = ${String(i.id)}`),t.has(i.id)&&e(`shard ${i.id} d\xE9clar\xE9 deux fois`),(typeof i.file!="string"||i.file.length>256)&&e(`shard.file du shard ${i.id}`),Le(i.byteLength,At)||e(`shard.byteLength du shard ${i.id} = ${String(i.byteLength)}`),t.set(i.id,i.byteLength);(!l.tensors||typeof l.tensors!="object")&&e("champ tensors");let n=Object.keys(l.tensors);(n.length===0||n.length>Ds)&&e(`${n.length} tenseurs`);let s=0;for(let i of n){let a=l.tensors[i];(!a||typeof a!="object")&&e(`tenseur ${i}`),js.includes(a.dtype)||e(`dtype \xAB ${String(a.dtype)} \xBB du tenseur ${i}`),(!Array.isArray(a.shape)||a.shape.length>8||!a.shape.every(u=>Le(u,2**32)))&&e(`shape du tenseur ${i}`),Le(a.nElems,2**40)||e(`nElems du tenseur ${i}`),(!Le(a.offset,At)||!Le(a.byteLength,At))&&e(`offset/byteLength du tenseur ${i}`);let o=t.get(a.shard);o===void 0&&e(`le tenseur ${i} r\xE9f\xE9rence le shard ${String(a.shard)}, absent du manifeste`),a.offset+a.byteLength>o&&e(`le tenseur ${i} d\xE9passe son shard (${a.offset}+${a.byteLength} > ${o})`),s+=a.byteLength}return s>At&&e(`${s} octets de tenseurs au total`),l}var fn,Ds,At,js,Es,Le,gn=se(()=>{"use strict";fn=4096,Ds=2e5,At=64*1024*1024*1024,js=["f16","f32","q4","q8","q3"],Es=/^[A-Za-z0-9._-]+$/;Le=(l,e)=>typeof l=="number"&&Number.isInteger(l)&&l>=0&&l<=e});function Hs(l){return dn(nt+l)}function Zt(l){if(l.length<nt)throw new Error("BRIK: fichier tronqu\xE9 (en-t\xEAte)");let e=String.fromCharCode(l[0],l[1],l[2],l[3]);if(e!==zs)throw new Error(`BRIK: sceau magique absent (${e})`);let r=new DataView(l.buffer,l.byteOffset,l.byteLength),t=r.getUint32(4,!0),n=r.getUint32(8,!0);if(nt+n>l.length)throw new Error("BRIK: manifeste tronqu\xE9");return{manifest:pn(JSON.parse(new TextDecoder().decode(l.subarray(nt,nt+n)))),version:t,dataStart:Hs(n)}}function mn(l){let{manifest:e,version:r,dataStart:t}=Zt(l);return{manifest:e,version:r,dataStart:t,data:l.subarray(t)}}var zs,nt,hn=se(()=>{"use strict";gn();zs="BRIK",nt=12});function bn(l){let e=[...l].sort((n,s)=>n.id-s.id),r=[],t=0;for(let n of e)r[n.id]=t,t+=n.byteLength;return r}function vn(l){let e=bn(l.shards),r={};for(let[n,s]of Object.entries(l.tensors)){let i=Ns[s.dtype];if(!i)throw new Error(`dtype BRIK inconnu pour ${n} : ${s.dtype}`);if(e[s.shard]===void 0)throw new Error(`shard ${s.shard} absent du manifeste (tenseur ${n})`);r[n]={offset:e[s.shard]+s.offset,bytes:s.byteLength,nElems:s.nElems,type:i,shape:s.shape}}let t=l.arch;return{arch:t.arch,config:{d:t.d,nHeads:t.nHeads,nKvHeads:t.nKvHeads,headDim:t.headDim,ffn:t.ffn,blockCount:t.blockCount,ropeTheta:t.ropeTheta,rmsEps:t.rmsEps,attnLogitSoftcap:t.attnLogitSoftcap,finalLogitSoftcap:t.finalLogitSoftcap,attnScale:t.attnScale,act:t.act,rmsGainOnePlus:t.rmsGainOnePlus,embedScale:t.embedScale,rwkv:t.rwkv,lfm2:t.lfm2},tensors:r}}var Ns,wn=se(()=>{"use strict";Ns={f16:"F16",f32:"F32",q4:"Q4W",q8:"Q8W",q3:"Q3W"}});function Is(l){return Qs[l]}async function $s(l){let e=l.slice();return Ws(await crypto.subtle.digest("SHA-256",e.buffer))}async function er(l,e){let r=Is(l);if(!r)return;if(typeof crypto>"u"||!crypto.subtle){console.warn("[int\xE9grit\xE9] crypto.subtle indisponible (contexte non s\xE9curis\xE9) : empreinte du manifeste NON v\xE9rifi\xE9e.");return}let t=await $s(e);if(t!==r)throw console.error(`[int\xE9grit\xE9] manifeste inattendu pour ${l}
  attendu : ${r}
  obtenu  : ${t}`),new Error("Ce mod\xE8le ne correspond pas \xE0 celui que Brimkern publie : son manifeste a une empreinte diff\xE9rente de celle attendue. Chargement refus\xE9. Si tu viens de t\xE9l\xE9verser une nouvelle version, relance `npm run brik:digest`.")}var Qs,Ws,yn=se(()=>{"use strict";Qs={"https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik":"aca6214b45c294c1d4c51c46aa23acc22cc53cb95a6894c62d2bd0570ca12afe","https://huggingface.co/romainkh14/Qwen2.5-0.5B-Instruct_BRIK/resolve/main/qwen2.5-0.5b-instruct-mixed.brik":"315d2a1cc17b64b029eb24e9668e5c959fd151ae926c9758bddc6a8193e52f6d","https://huggingface.co/romainkh14/Qwen3-4B_BRIK/resolve/main/qwen3-4b-q4.brik":"23f9c0cc66ec21056e656bdaa5cbfda2e93673718ea3ab0dfad19c6e7f583f7d","https://huggingface.co/romainkh14/RWKV-7-G1-0.1B_BRIK/resolve/main/rwkv7-g1-0.1b-q4.brik":"bb8d211e1f95af415b7dca8b0b074c236ebe9d0844f1f372c11eecbcf15fb372","https://huggingface.co/romainkh14/RWKV-7-G1a-0.4B_BRIK/resolve/main/rwkv7-g1a-0.4b-q4.brik":"47e67144bb9dcd41918f3117aa6ee21420ff94f93289c338d8331620d3153b10","https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main/sd-turbo-clip-mixed.brik":"b873aaad23ca70d4e29c0350d124fd6ee0a18470aaf59719f14c9eb9f227b3ac","https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main/sd-turbo-clip-q8.brik":"b3e05c74f8f0327e878787100224983a454e4228d2ae008902875a6256fb2bae","https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main/sd-turbo-unet-q8.brik":"ca3a5c21512542656a8a736c88f67d37a482cacbf499a080c9bf32ca36bf6b0f","https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main/sdxs-unet-light.brik":"42f7c0e82971a558d56548edec947b1ed7d9c0e509d634b51fc29429177e7654","https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main/video-clip-q8.brik":"e81ca57426716237dce2853703c70172a829f78704b7df77c9ee980534c82a76","https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main/video-motion-q8.brik":"e976e13a5bc0858b8277eefed59cc0d77239b5a30ecae68d483e24eb983ae481","https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main/video-unet-q8.brik":"d112b2884afcd038cdbd90bb62ce6b248b404852fb9ce20003b8585927a362b9"},Ws=l=>[...new Uint8Array(l)].map(e=>e.toString(16).padStart(2,"0")).join("")});function tr(l,e,r){return`${l}${l.includes("?")?"&":"?"}__brik=${e}-${r}`}async function Pn(){try{return await caches.open(Vs)}catch{return null}}async function De(l,e,r,t){let n=e+r-1,s=await Pn(),i=tr(l,e,n);if(s){let o=await s.match(i);if(o)return{bytes:new Uint8Array(await o.arrayBuffer()),ranged:!0}}let a;for(let o=0;o<4;o++)try{let u=await fetch(l,{headers:{Range:`bytes=${e}-${n}`},signal:t});if(!u.ok&&u.status!==206)throw new Error(`range fetch ${e}-${n} \xE9chou\xE9 : HTTP ${u.status}`);let c=u.status===206,f=new Uint8Array(await u.arrayBuffer()),d=c?f:f.subarray(e,e+r);if(s&&c)try{await s.put(i,new Response(d,{headers:{"Content-Length":String(d.byteLength)}}))}catch(p){_n(p)}return{bytes:d,ranged:c}}catch(u){if(t?.aborted)throw u;a=u,o<3&&await new Promise(c=>setTimeout(c,500*2**o))}throw a instanceof Error?a:new Error(String(a))}function _n(l){kn||(kn=!0,console.warn("[cache] \xE9criture refus\xE9e (quota plein ? navigation priv\xE9e ?) : les t\xE9l\xE9chargements de mod\xE8les ne seront PAS r\xE9utilisables \xE0 la prochaine visite. Lib\xE9rez de l'espace via le panneau Stockage.",l))}async function nr(l){try{let n=await(await caches.open(rr)).match(l);if(n)return new Uint8Array(await n.arrayBuffer())}catch{}let e=await fetch(l);if(!e.ok)throw new Error(`HTTP ${e.status}`);let r=new Uint8Array(await e.arrayBuffer());try{await(await caches.open(rr)).put(l,new Response(r.slice(),{headers:{"Content-Length":String(r.byteLength)}}))}catch(t){_n(t)}return r}function sr(l,e){return{bytes:async(r,t)=>(await De(l,e+r,t)).bytes}}function Ys(l){return{bytes:async(e,r)=>l.subarray(e,e+r)}}async function Un(l){let e=await De(l,0,12);if(!e.ranged){let i=await nr(l),{manifest:a,data:o}=mn(i);return await er(l,xn(i)),An(a,Ys(o))}let r=new DataView(e.bytes.buffer,e.bytes.byteOffset,12).getUint32(8,!0),t=await De(l,0,12+r),{manifest:n,dataStart:s}=Zt(t.bytes);return await er(l,xn(t.bytes)),An(n,sr(l,s))}function xn(l){let e=new DataView(l.buffer,l.byteOffset,12).getUint32(8,!0);return l.subarray(12,12+e)}function An(l,e){if(l.model?.uiArch==="image")throw new Error("Ce fichier est un BRIK image (UNet/CLIP) : il se charge via la tuile de g\xE9n\xE9ration d'image, pas comme un LLM.");return{source:e,manifest:vn(l),tokenizerId:l.tokenizer?.id,tokenizer:l.tokenizer,uiArch:l.model?.uiArch,modelName:l.model.name}}async function Gn(l,e){return await Xs(l)||!(await De(l,0,12,e)).ranged?null:{manifest:await Bn(l,e),source:sr(l,0)}}async function Xs(l){try{return!!await(await caches.open(rr)).match(l)}catch{return!1}}async function Bn(l,e){let r=sr(l,0),t;for(let n=8*1024*1024;n<=128*1024*1024;n*=2)try{let s=await r.bytes(0,n);return await xt(new Blob([s.slice()]))}catch(s){if(e?.aborted)throw s;t=s}throw t instanceof Error?t:new Error("en-t\xEAte GGUF illisible par plages")}function Js(l,e){let r=new Map,t=[];for(let[n,s]of Object.entries(l.tensors)){let i=n.match(/^blk\.(\d+)\./);if(i){let a=r.get(i[1]);a||r.set(i[1],a=[]),a.push(s)}else t.push({off:e+s.offset,len:s.bytes})}for(let n of r.values()){let s=We(n);if(s)t.push({off:e+s.start,len:s.end-s.start});else for(let i of n)t.push({off:e+i.offset,len:i.bytes})}return t}async function Zs(l,e){let r=await Pn();return!r||!(await De(l,0,12,e)).ranged?null:{cache:r,ranges:Js(await Bn(l,e),0)}}async function qn(l,e,r){return ei(l,await Zs(l,r),e,r)}async function ei(l,e,r,t){if(!e)return"unstorable";let{cache:n,ranges:s}=e;s.sort((g,m)=>g.off-m.off);let i=s.reduce((g,m)=>g+m.len,0),a=await Promise.all(s.map(g=>n.match(tr(l,g.off,g.off+g.len-1)))),o=0,u=[];s.forEach((g,m)=>{a[m]?o+=g.len:u.push(g)}),r?.({doneBytes:o,totalBytes:i});let c=0,f=!1,d=null,p=async()=>{for(;!f&&d===null;){let g=c++;if(g>=u.length)return;let m=u[g];if(t?.aborted)return;try{await De(l,m.off,m.len,t)}catch(b){d=b;return}if(!await n.match(tr(l,m.off,m.off+m.len-1))){f=!0;return}o+=m.len,r?.({doneBytes:o,totalBytes:i})}};if(await Promise.all(Array.from({length:Math.min(4,u.length)},p)),t?.aborted)return"aborted";if(d!==null)throw d instanceof Error?d:new Error(String(d));return f?"unstorable":"done"}var Vs,kn,rr,Fn=se(()=>{"use strict";"use client";tt();Jt();hn();wn();yn();Vs="brik-range-v1";kn=!1;rr="brimkern-model-cache"});function ti(l){let e=l.indexOf("<think>");if(e===-1)return l;let r=l.indexOf("</think>",e);return(r===-1?l.slice(0,e):l.slice(0,e)+l.slice(r+8)).trim()}function Tn(l,e,r){l=l.map(n=>n.role==="assistant"?{...n,content:ti(n.content)}:n);let t="";if(e==="deepseek"){t+="<\uFF5Cbegin\u2581of\u2581sentence\uFF5C>",r.trim()&&(t+=r);for(let n of l)n.role==="user"?t+=`<\uFF5CUser\uFF5C>${n.content}`:n.role==="assistant"&&(t+=`<\uFF5CAssistant\uFF5C>${n.content}<\uFF5Cend\u2581of\u2581sentence\uFF5C>`);return t+="<\uFF5CAssistant\uFF5C>",t}if(e==="rwkv7"){r.trim()&&(t+=`System: ${r.trim()}

`);for(let n of l)n.role==="user"?t+=`User: ${n.content.trim()}

`:n.role==="assistant"&&(t+=`Assistant: ${n.content.trim()}

`);return t+="Assistant:",t}if(e==="qwen"||e==="qwen3"||e==="qwen35"||e==="lfm2"||e==="smollm3"){r.trim()&&(t+=`<|im_start|>system
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
`}return t}function On(l){let e=new Set;for(let r of["tokenizer.ggml.eos_token_id","tokenizer.ggml.eot_token_id","tokenizer.ggml.eom_token_id"]){let t=l?.[r],n=typeof t=="number"?t:Number(t);Number.isFinite(n)&&n>=0&&e.add(n)}return[...e]}var Sn,Cn=se(()=>{"use strict";Sn=["<\uFF5Cend\u2581of\u2581sentence\uFF5C>","<\uFF5CAssistant\uFF5C>","<\uFF5CUser\uFF5C>","<\uFF5Cbegin\u2581of\u2581sentence\uFF5C>","<|im_end|>","<|im_start|>","<|eot_id|>","<|begin_of_text|>","<|start_header_id|>","<|end_header_id|>","</s>","<s>","<end_of_turn>","<start_of_turn>","[INST]","[/INST]","[SYSTEM_PROMPT]","</model>","</assistant>","</user>","<|assistant|>","<|user|>",`
User:`]});function ri(){let l=[];for(let s=33;s<=126;s++)l.push(s);for(let s=161;s<=172;s++)l.push(s);for(let s=174;s<=255;s++)l.push(s);let e=l.slice(),r=0;for(let s=0;s<256;s++)l.includes(s)||(l.push(s),e.push(256+r),r++);let t=new Array(256),n=new Map;for(let s=0;s<l.length;s++)t[l[s]]=String.fromCodePoint(e[s]),n.set(String.fromCodePoint(e[s]),l[s]);return{enc:t,dec:n}}var Mn,He,ir=se(()=>{"use strict";Mn="'(?:[sdmt]|ll|ve|re)| ?\\p{L}+| ?\\p{N}+| ?[^\\s\\p{L}\\p{N}]+|\\s+(?!\\S)|\\s+",He=class l{constructor(e){this.vocab=new Map;this.idToTok=new Map;this.ranks=new Map;this.added=[];this.specialIds=new Set;this.addedRe=null;this.bosIds=[];this.cache=new Map;let r=typeof e=="string"?JSON.parse(e):e;if(r?.model?.type!=="BPE")throw new Error(`BpeTokenizer : model.type ${r?.model?.type} non couvert (BPE uniquement)`);({enc:this.byteEnc,dec:this.byteDec}=ri());for(let[a,o]of Object.entries(r.model.vocab))this.vocab.set(a,o),this.idToTok.set(o,a);(r.model.merges??[]).forEach((a,o)=>this.ranks.set(Array.isArray(a)?`${a[0]} ${a[1]}`:a,o));for(let a of r.added_tokens??[])this.added.push(a),this.vocab.set(a.content,a.id),this.idToTok.set(a.id,a.content),a.special&&this.specialIds.add(a.id);if(this.added.length){let a=this.added.map(o=>o.content.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).sort((o,u)=>u.length-o.length);this.addedRe=new RegExp(`(${a.join("|")})`,"g")}let n=l.findSplitPattern(r.pre_tokenizer)??Mn;this.splitRe=new RegExp(n,"gu");let s=a=>{if(!a)return null;if(a.type==="TemplateProcessing")return a.single;if(a.type==="Sequence")for(let o of a.processors??[]){let u=s(o);if(u)return u}return null},i=s(r.post_processor);if(Array.isArray(i))for(let a of i)if(a.SpecialToken){let o=this.vocab.get(a.SpecialToken.id);o!==void 0&&this.bosIds.push(o)}else break}static findSplitPattern(e){if(!e)return null;if(e.type==="Split"&&e.pattern?.Regex)return e.pattern.Regex;if(e.type==="ByteLevel"&&e.use_regex!==!1)return Mn;if(e.type==="Sequence")for(let r of e.pretokenizers??[]){let t=l.findSplitPattern(r);if(t)return t}return null}bpe(e){let r=this.cache.get(e);if(r)return r;let t=Array.from(e);for(;t.length>1;){let s=-1,i=1/0;for(let a=0;a<t.length-1;a++){let o=this.ranks.get(`${t[a]} ${t[a+1]}`);o!==void 0&&o<i&&(i=o,s=a)}if(s<0)break;t=[...t.slice(0,s),t[s]+t[s+1],...t.slice(s+2)]}let n=[];for(let s of t){let i=this.vocab.get(s);if(i!==void 0)n.push(i);else for(let a of s){let o=this.vocab.get(a);o!==void 0&&n.push(o)}}return this.cache.set(e,n),n}encodeChunk(e){let r=[];for(let t of e.match(this.splitRe)??[]){let n=new TextEncoder().encode(t),s="";for(let i of n)s+=this.byteEnc[i];r.push(...this.bpe(s))}return r}encode(e){let r=[...this.bosIds];if(this.addedRe)for(let t of e.split(this.addedRe)){if(!t)continue;let n=this.vocab.get(t);n!==void 0&&this.added.some(s=>s.content===t)?r.push(n):r.push(...this.encodeChunk(t))}else r.push(...this.encodeChunk(e));return r}decode(e){let r=[];for(let t of e){if(this.specialIds.has(t))continue;let n=this.idToTok.get(t);if(n!==void 0)for(let s of n){let i=this.byteDec.get(s);if(i!==void 0)r.push(i);else for(let a of new TextEncoder().encode(s))r.push(a)}}return new TextDecoder("utf-8",{fatal:!1}).decode(new Uint8Array(r))}}});function Dn(l){let e=l.metadata,r=String(e["tokenizer.ggml.model"]??""),t=e["tokenizer.ggml.tokens"],n=e["tokenizer.ggml.merges"];if(!Array.isArray(t)||!t.length||!Array.isArray(n)||!n.length||r!=="gpt2"&&r!=="llama")return null;let s=String(e["tokenizer.ggml.pre"]??"gpt2"),i=e["tokenizer.ggml.token_type"]??[],a=Ln(e["tokenizer.ggml.bos_token_id"]),o=Ln(e["tokenizer.ggml.eos_token_id"]),u=e["tokenizer.ggml.add_bos_token"]===!0,c={},f=[],d=[];for(let g=0;g<t.length;g++){let m=t[g],b=i[g]??1;b===3||b===4?(f.push({id:g,content:m,special:b===3}),b===3&&d.push(g)):c[m]=g}let p={version:"1.0",added_tokens:f,pre_tokenizer:{type:"Split",pattern:{Regex:Rn[s]??Rn.gpt2}},post_processor:u&&a!=null?{type:"TemplateProcessing",single:[{SpecialToken:{id:t[a],type_id:0}},{Sequence:{id:"A",type_id:0}}]}:void 0,model:{type:"BPE",vocab:c,merges:n}};try{return{tokenizer:new He(p),nVocab:t.length,pre:s,bosId:a,eosId:o,controlIds:d}}catch(g){return console.warn("[gguf-tok] vocabulaire non consommable par BpeTokenizer. Repli sur le tokenizer HF :",g),null}}function Ln(l){let e=Number(l);return Number.isFinite(e)?e:null}var Rn,jn=se(()=>{"use strict";ir();Rn={"llama-bpe":"(?:'[sS]|'[tT]|'[rR][eE]|'[vV][eE]|'[mM]|'[lL][lL]|'[dD])|[^\\r\\n\\p{L}\\p{N}]?\\p{L}+|\\p{N}{1,3}| ?[^\\s\\p{L}\\p{N}]+[\\r\\n]*|\\s*[\\r\\n]+|\\s+(?!\\S)|\\s+",qwen2:"(?:'[sS]|'[tT]|'[rR][eE]|'[vV][eE]|'[mM]|'[lL][lL]|'[dD])|[^\\r\\n\\p{L}\\p{N}]?\\p{L}+|\\p{N}| ?[^\\s\\p{L}\\p{N}]+[\\r\\n]*|\\s*[\\r\\n]+|\\s+(?!\\S)|\\s+",gpt2:"'(?:[sdmt]|ll|ve|re)| ?\\p{L}+| ?\\p{N}+| ?[^\\s\\p{L}\\p{N}]+|\\s+(?!\\S)|\\s+"}});function ar(l,e,r={}){let{temperature:t=.7,topK:n=40,topP:s=.9,rng:i=Math.random}=r;if(!t||t<=0)return l[0];let a=n&&n>0?Math.min(n,l.length):l.length,o=1/t,u=e[0],c=new Float64Array(a),f=0;for(let m=0;m<a;m++){let b=Math.exp((e[m]-u)*o);c[m]=b,f+=b}for(let m=0;m<a;m++)c[m]/=f;let d=a;if(s&&s<1){let m=0;for(let b=0;b<a;b++)if(m+=c[b],m>=s){d=b+1;break}}let p=0;for(let m=0;m<d;m++)p+=c[m];let g=i()*p;for(let m=0;m<d;m++)if(g-=c[m],g<=0)return l[m];return l[d-1]}var En=se(()=>{"use strict"});function zn(l,e){if(l==="llama"){if(e&&e>=1e5)return Kn.llama;if(e&&e<1e5){console.warn(`[brimkern] GGUF arch="llama" avec un vocab de ${e} \u2192 famille Llama 2 / Mistral / TinyLlama : pas de tokenizer par d\xE9faut pour celle-ci, la s\xE9lection actuelle est conserv\xE9e (une r\xE9ponse incoh\xE9rente = mauvais tokenizer).`);return}return}return Kn[l]}var ni,si,je,or,Ra,La,Kn,Hn=se(()=>{"use strict";ni="https://huggingface.co/madebyollin/taesd/resolve/614f76814bbe30edbe2e627ace1c2234c81a2c0e",si=`${ni}/taesd_decoder.safetensors`,je="https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main",or="https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main",Ra={unet:`${or}/video-unet-q8.brik`,motion:`${or}/video-motion-q8.brik`,clip:`${or}/video-clip-q8.brik`,taesd:si},La={sdturbo:{unet:`${je}/sd-turbo-unet-q8.brik`,clip:`${je}/sd-turbo-clip-q8.brik`},sdxs:{unet:`${je}/sdxs-unet-light.brik`,clip:`${je}/sd-turbo-clip-mixed.brik`},realvisxl:{unet:`${je}/realvisxl-unet-mixed.brik`,clip:`${je}/realvisxl-clip2-q8.brik`,clip1:`${je}/realvisxl-clip1-q8.brik`,vae:`${je}/realvisxl-vae-q8.brik`}},Kn={gemma:{archType:"gemma",tokenizerId:"Xenova/gemma-tokenizer"},gemma2:{archType:"gemma",tokenizerId:"Xenova/gemma-tokenizer"},gemma3:{archType:"gemma3",tokenizerId:"unsloth/gemma-3-270m-it"},smollm3:{archType:"smollm3",tokenizerId:"HuggingFaceTB/SmolLM3-3B"},qwen3:{archType:"qwen3",tokenizerId:"Qwen/Qwen3-0.6B"},qwen35:{archType:"qwen35",tokenizerId:"Qwen/Qwen2.5-Coder-3B-Instruct"},qwen3_5:{archType:"qwen35",tokenizerId:"Qwen/Qwen2.5-Coder-3B-Instruct"},mistral3:{archType:"mistral3",tokenizerId:"unsloth/Ministral-3-3B-Instruct-2512"},llama:{archType:"llama3",tokenizerId:"unsloth/Llama-3.2-1B-Instruct"}}});function Nn(l){let e=l.arch||"";if(e==="lfm2"||l.config?.lfm2)return"lfm2";if(e==="rwkv7"||l.config?.rwkv)return"rwkv7";if(e==="qwen2"||e.includes("qwen2"))return"qwen";if(e==="qwen3"||e.includes("qwen3"))return"qwen3";if(e==="smollm3"||e.includes("smollm"))return"smollm3";if(e==="mistral3"||e.includes("mistral"))return"mistral3";if(e==="gemma3")return"gemma3";if(e==="gemma"||e==="gemma2")return"gemma";if(e==="deepseek")return"deepseek";if(e==="llama"){let r=l.tensors?.["token_embd.weight"],t=l.config?.d,n=r&&t?r.nElems/t:null;return n&&n<1e5?"llama2":"llama3"}return"qwen"}async function oi(l,e){let r=new bt;if(!await r.init())throw Object.assign(new Error("WebGPU is not available in this browser."),{code:"no-webgpu"});r.onLost=v=>{console.warn("[brimkern] device GPU perdu ("+(v?.reason||"unknown")+"): rechargement au prochain appel"),Se.delete(l)},await r.selfValidate(),e("download");let t=await De(l,0,12).catch(()=>null);if((t?.bytes&&t.bytes.length>=4?String.fromCharCode(...t.bytes.subarray(0,4)):"")==="GGUF"||l.toLowerCase().includes(".gguf")){await qn(l,h=>{e("download",{loaded:h.doneBytes,total:h.totalBytes})}).catch(h=>{console.warn("[gguf] pr\xE9chargement par plages indisponible :",h)});let v=await Gn(l).catch(h=>(console.warn("[gguf] streaming par plages \xE9chou\xE9, repli complet :",h),null)),_,B;if(v)_=v.manifest,B=v.source;else{let h=await nr(l);_=await xt(new Blob([h.buffer])),B={bytes:async(A,y)=>h.subarray(A,A+y)}}let q=Nn(_);e("tokenizer");let C=Dn(_),j,x=On(_.metadata);if(C)j=C.tokenizer,C.eosId!=null&&x.push(C.eosId),C.controlIds?.length&&x.push(...C.controlIds);else{console.warn("[brimkern] tokenizer GGUF non-BPE : repli transformers.js (CDN)");let h=await import(Pt),A=_.tensors?.["token_embd.weight"],y=A&&_.config?.d?A.nElems/_.config.d:null,U=zn(String(_.arch||""),y)?.tokenizerId||_.metadata?.["tokenizer.ggml.id"]||(q==="llama3"?"unsloth/Llama-3.2-1B-Instruct":"Qwen/Qwen2.5-Coder-0.5B-Instruct"),F=await h.AutoTokenizer.from_pretrained(U);j={encode:G=>Array.from(F(G).input_ids.data,O=>Number(O)),decode:G=>F.decode(G,{skip_special_tokens:!0})}}q==="gemma3"&&x.push(106,1),q==="gemma"&&x.push(107,1);let k=new rt(r,B,_);return e("gpu"),await k.prewarmGpu((h,A)=>{e("gpu",{loaded:h,total:A})}),{core:new _t(r,k,j,q,x),engine:r}}let i=await Un(l),a=i.manifest,o=a?.config?.lfm2?"lfm2":a?.config?.rwkv?"rwkv7":"transformer";if(o==="transformer"){e("tokenizer");let v;if(i.tokenizer?.json)try{let j=new He(i.tokenizer.json);v={encode:x=>j.encode(x),decode:x=>j.decode(x)}}catch(j){console.warn("[brimkern] tokenizer.json non couvert par le BPE bundl\xE9 : repli transformers.js (CDN)",j);let x=await import(Pt),k=new x.PreTrainedTokenizer(JSON.parse(i.tokenizer.json),JSON.parse(i.tokenizer.config));v={encode:w=>Array.from(k(w).input_ids.data,h=>Number(h)),decode:w=>k.decode(w,{skip_special_tokens:!0})}}else{let j=await import(Pt),x=i.tokenizerId||"Qwen/Qwen2.5-0.5B-Instruct",k=await j.AutoTokenizer.from_pretrained(x);v={encode:w=>Array.from(k(w).input_ids.data,h=>Number(h)),decode:w=>k.decode(w,{skip_special_tokens:!0})}}let _=new rt(r,i.source,a);e("gpu"),await _.prewarmGpu((j,x)=>{e("gpu",{loaded:j,total:x})});let B=Nn(a),q=a.chat?.stopTokenIds||[151645,151643];return{core:new _t(r,_,v,B,q),engine:r}}let u=a.tensors["token_embd.weight"],c={arch:{...a.config,arch:o,vocab:u?u.nElems/a.config.d:0},tensors:Object.fromEntries(Object.entries(a.tensors).map(([v,_])=>[v,{dtype:ii[_.type]??_.type,shape:_.shape,nElems:_.nElems,shard:0,offset:_.offset,byteLength:_.bytes}])),shards:[{id:0,file:"",byteLength:0}],chat:o==="lfm2"?{template:"chatml",stopTokenIds:[7,2,8,10,12]}:{template:"rwkv",stopTokenIds:[0]}},f=Object.values(a.tensors).reduce((v,_)=>v+_.bytes,0),d=0,p=Vt(a.tensors,i.source),g=async v=>{let _=a.tensors[v];if(!_)throw new Error(`tenseur absent : ${v}`);let B=await p(v);return d+=_.bytes,e("download",{loaded:d,total:f}),B};if(e("tokenizer"),o==="rwkv7"){let v=i.tokenizer?.json?JSON.parse(i.tokenizer.json):null;if(!v?.tokens)throw new Error("RWKV .brik without its embedded World vocab (rebuild the BRIK).");let _=new et(r,c,g);return e("gpu"),await _.load(v.tokens),{core:_,engine:r}}let m;try{let v=new He(i.tokenizer.json);m={encode:_=>v.encode(_),decode:_=>v.decode(_)}}catch(v){console.warn("[brimkern] tokenizer.json non couvert par le BPE bundl\xE9 : repli transformers.js (CDN)",v);let _=await import(Pt),B=new _.PreTrainedTokenizer(JSON.parse(i.tokenizer.json),JSON.parse(i.tokenizer.config));m={encode:q=>Array.from(B(q).input_ids.data,C=>Number(C)),decode:q=>B.decode(q,{skip_special_tokens:!0})}}let b=new vt(r,c,g);return e("gpu"),await b.load(m),{core:b,engine:r}}function st(l){return l&&(l.startsWith("https://")||/^http:\/\/(localhost|127\.0\.0\.1)[:/]/.test(l))?l:Qn[l||"lfm2.5-230m"]||Qn["lfm2.5-230m"]}function Ut(l,e){let r=Se.get(l);if(!r){let t={status:"init",state:"loading",listeners:new Set,promise:null};t.promise=oi(l,(n,s)=>{t.status=n,t.progress=s,t.listeners.forEach(i=>i(n,s))}).then(n=>(t.state="ready",n)).catch(n=>{throw t.state="error",Se.delete(l),n}),Se.set(l,t),r=t}return e&&(r.state!=="ready"&&e(r.status,r.progress),r.listeners.add(e),r.promise.finally(()=>r.listeners.delete(e)).catch(()=>{})),r.promise}async function Wn(l,e){let r=await Ut(l,e);return r.engine.lost?(Se.delete(l),(await Ut(l,e)).core):r.core}async function In(l,e){let r=await Wn(l);try{return await e(r)}catch(t){let n=Se.get(l);if(!(!n||await n.promise.then(i=>i.engine.lost).catch(()=>!0)))throw t;return console.warn("[brimkern] g\xE9n\xE9ration interrompue par une perte de device : nouvelle tentative"),Se.delete(l),e(await Wn(l))}}function ui(l,e){let r=l.replace(/<\|[a-z_]+\|>/g,"");if(r=r.replace(/\s*-{2,}\s*(?:E(?:N(?:D(?:\s*O(?:F(?:\s*N(?:O(?:T(?:E(?:S)?)?)?)?)?)?)?)?)?|N(?:O(?:T(?:E(?:S)?)?)?)?)\s*-*\s*$/i,""),e){let t=r.replace(/^\s*(hello|hi|hey|bonjour|salut)\s*[!,.]\s*/i,"");t.trim()&&(r=t)}return r.trimEnd()}function ci(l){let e=-1;for(let r of Sn){let t=l.indexOf(r);t!==-1&&(e===-1||t<e)&&(e=t)}return e===-1?{text:l,hit:!1}:{text:l.slice(0,e),hit:!0}}async function $n(l,e,r,t,n,s,i,a=[]){let o=l.arch||(l instanceof et?"rwkv7":"lfm2"),u=Tn([...a,...e.slice(-ai)],o,r),c=a.some(g=>g.role==="assistant")||e.some(g=>g.role==="assistant"),f="",d=!1;return await(l.residentAvailable?.()?l.generateResident.bind(l):l.generate.bind(l))(u,t,g=>{let m=ci(g);m.hit&&(d=!0),f=ui(m.text,c),s?.(f)},()=>d||!!i?.(),{sample:!0,temperature:n,topK:40,repeatPenalty:1.3}),f}var _t,Pt,Qn,ii,ai,Se,ur=se(()=>{"use strict";rn();an();un();ln();Fn();tt();Cn();ir();jn();En();Jt();Hn();_t=class{constructor(e,r,t,n,s){this.engine=e;this.model=r;this.tok=t;this.arch=n,this.stops=new Set(s||[])}residentAvailable(){return!0}reset(){this.model.reset()}unload(){this.model.unload()}async generate(e,r,t,n,s){return this.generateResident(e,r,t,n,s)}async generateResident(e,r,t,n,s){let i="sdk-gen",a=s?.repeatPenalty??(s?.sample?1.3:1),o=s?.temperature??.55,u=s?.topK??40,c=64;this.model.reset();let f=this.tok.encode(e);if(!f.length)return"";let d=256,p=0,g=0;for(let B=0;B<f.length;B+=d){if(n?.())return"";let q=f.slice(B,B+d);if(B+d>=f.length){let j=await this.model.topKKV(q,p,i,f.slice(-c),a);g=ar(j.ids,j.vals,{temperature:s?.sample===!1?0:o,topK:u})}else await this.model.topKKV(q,p,i,[],1);p+=q.length}if(!Number.isInteger(g)||g<0||this.stops.has(g))return"";let m=[g],b=[...f.slice(-c),g].slice(-c),v=new Map;for(let B of b)v.set(B,(v.get(B)??0)+1);let _=B=>{if(b.push(B),v.set(B,(v.get(B)??0)+1),b.length>c){let q=b.shift(),C=v.get(q)-1;C===0?v.delete(q):v.set(q,C)}};t&&t(this.tok.decode(m));for(let B=1;B<r&&!n?.();B++){let q=f.length+B-1,C=await this.model.topKKV([g],q,i,[...v.keys()],a);if(!C.ids||!C.ids.length)break;let j=ar(C.ids,C.vals,{temperature:s?.sample===!1?0:o,topK:u});if(!Number.isInteger(j)||j<0||this.stops.has(j))break;g=j,m.push(g),_(g),t&&t(this.tok.decode(m))}return this.tok.decode(m)}},Pt="https://esm.sh/@huggingface/transformers@4.2.0",Qn={"lfm2.5-230m":"https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik","qwen-0.5b":"https://huggingface.co/romainkh14/Qwen2.5-0.5B-Instruct_BRIK/resolve/main/qwen2.5-0.5b-instruct-mixed.brik","coder-0.5b":"https://huggingface.co/Qwen/Qwen2.5-Coder-0.5B-Instruct-GGUF/resolve/main/qwen2.5-coder-0.5b-instruct-q4_k_m.gguf","coder-1.5b":"https://huggingface.co/Qwen/Qwen2.5-Coder-1.5B-Instruct-GGUF/resolve/main/qwen2.5-coder-1.5b-instruct-q4_k_m.gguf","rwkv-0.4b":"https://huggingface.co/romainkh14/RWKV-7-G1a-0.4B_BRIK/resolve/main/rwkv7-g1a-0.4b-q4.brik","rwkv-0.1b":"https://huggingface.co/romainkh14/RWKV-7-G1-0.1B_BRIK/resolve/main/rwkv7-g1-0.1b-q4.brik"},ii={F16:"f16",F32:"f32",Q4W:"q4",Q8W:"q8",Q3W:"q3"},ai=12;Se=new Map});var Vn={};jr(Vn,{LocalBackend:()=>it});var it,cr=se(()=>{"use strict";ur();it=class{constructor(){this.kind="main"}async preload(e,r){await Ut(e,r)}state(e){return Se.get(e)?.state}turn(e,r,t){return In(e.url,n=>$n(n,e.history,e.system,e.maxTokens,e.temperature,r,()=>!!t?.aborted,e.pinned))}dispose(){}}});function li(){try{if(typeof document>"u")return"";let l=document.currentScript;if(l?.src)return new URL(l.src,document.baseURI).href}catch{}return""}function Xn(l){Yn=l}function Jn(){return Yn||fi}var fi,Yn,lr=se(()=>{"use strict";fi=li(),Yn=""});var Zn={};jr(Zn,{WorkerBackend:()=>fr});var fr,es=se(()=>{"use strict";lr();fr=class{constructor(){this.kind="worker";this.seq=0;this.pending=new Map;this.states=new Map;if(typeof Worker>"u")throw new Error("Worker indisponible");let e=Jn();if(!e)throw new Error("URL du script introuvable (import ESM ?) : passez workerUrl");let r=(()=>{try{return location.search}catch{return""}})(),t=`self.__brimkernSearch=${JSON.stringify(r)};importScripts(${JSON.stringify(e)});`,n=new Blob([t],{type:"text/javascript"});this.url=URL.createObjectURL(n),this.worker=new Worker(this.url);let s,i;this.hello=new Promise((a,o)=>{s=a,i=o}),this.worker.onerror=a=>i(new Error(`worker: ${a.message||"\xE9chec de chargement"}`)),this.worker.onmessage=a=>{let o=a.data;if(o.type==="hello"){s();return}let u=this.pending.get(o.id);if(u){if(o.type==="progress"){u.onProgress?.(o.status,o.progress);return}if(o.type==="token"){u.onToken?.(o.text);return}this.pending.delete(o.id),o.type==="error"?u.reject(new Error(o.message)):o.type==="state"?u.resolve(o.state):u.resolve(o.text??"")}}}ready(){return this.hello}send(e,r={}){let t=++this.seq,n=new Promise((s,i)=>{this.pending.set(t,{resolve:s,reject:i,...r}),this.worker.postMessage({...e,id:t})});return{id:t,done:n}}async preload(e,r){await this.hello,this.states.get(e)!=="ready"&&this.states.set(e,"loading");try{await this.send({type:"preload",url:e},{onProgress:r}).done,this.states.set(e,"ready")}catch(t){throw this.states.set(e,"error"),t}}state(e){return this.states.get(e)}async turn(e,r,t){await this.hello;let{id:n,done:s}=this.send({type:"turn",req:e},{onToken:r}),i=()=>this.worker.postMessage({type:"stop",id:n});t?.aborted?i():t?.addEventListener("abort",i,{once:!0});try{let a=await s;return this.states.set(e.url,"ready"),a}finally{t?.removeEventListener("abort",i)}}dispose(){this.worker.terminate(),URL.revokeObjectURL(this.url);for(let e of this.pending.values())e.reject(new Error("worker arr\xEAt\xE9"));this.pending.clear()}}});var di={};var dr,Gt,Ne,rs=se(()=>{"use strict";cr();dr=new it,Gt=new Set,Ne=l=>self.postMessage(l);self.onmessage=async l=>{let e=l.data;if(e.type==="stop"){Gt.add(e.id);return}if(e.type==="state"){Ne({type:"state",id:e.id,state:dr.state(e.url)});return}try{if(e.type==="preload"){await dr.preload(e.url,(r,t)=>Ne({type:"progress",id:e.id,status:r,progress:t})),Ne({type:"done",id:e.id});return}if(e.type==="turn"){let r=new AbortController,t=new Proxy(r.signal,{get:(u,c)=>c==="aborted"?Gt.has(e.id):Reflect.get(u,c)}),n=16,s=0,i=null,a=()=>{i!==null&&(Ne({type:"token",id:e.id,text:i}),i=null,s=Date.now())},o=await dr.turn(e.req,u=>{i=u,Date.now()-s>=n&&a()},t);a(),Ne({type:"done",id:e.id,text:o}),Gt.delete(e.id);return}}catch(r){Gt.delete(e.id),Ne({type:"error",id:e.id,message:r instanceof Error?r.message:String(r)})}};Ne({type:"hello"})});var ds=new Set(["avec","pour","dans","les","des","une","est","sur","par","que","qui","quoi","comment","pourquoi","quand","vous","nous","votre","notre","mais","plus","tout","tous","cette","sont","avez","puis","faire","fait","fais","font","the","and","for","with","what","who","how","why","when","about","your","our","you","are","can","does","did","this","that","from","have","je","tu","il","elle","on","ils","elles","du","de","la","le","un","en","au","aux","ce","ces","cet","se","sa","son","ses","mon","ma","mes","ton","ta","tes","me","te","ne","pas","si","ou","et","ni","car","donc","or","to","in","at","it","is","be","as","an","by","do","no","so","my","he","we","us","me","am","was","were","been","quel","quelle","quels","quelles","which","where","bonjour","salut","hello","merci"]),lt=new Map,ps=2e4;function Lt(l){let e=lt.get(l);if(e!==void 0)return e;let r=gs(l);return lt.size>=ps&&lt.clear(),lt.set(l,r),r}function gs(l){let e=l.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");return e.length<=3||(e=e.replace(/(?:ments?|ements?|eront|erait|aient|antes?|ances?|euses?|ables?|tions?|sions?|eaux|eurs?|euse|ique|iques|istes?|ings?|ness|able|ible|less|full?)$/,""),e.length>3&&(e=e.replace(/(?:er|ir|ez|ent|ais|ait|ant|ees?|es?|ed|ly|s)$/,""))),e}function Ie(l){let e=(l.toLowerCase().match(/[\p{L}\p{N}]+/gu)??[]).filter(r=>ds.has(r)?!1:/\d/.test(r)?!0:r.length>=2);return[...new Set(e)]}function zr(l,e=600){let r=[];return l.forEach((t,n)=>{let s=(t.title||"").trim(),i=(t.text||"").split(/\n\s*\n+/).map(u=>u.trim()).filter(Boolean),a="",o=()=>{a.trim()&&r.push({title:s,text:a.trim(),doc:n}),a=""};for(let u of i){if(u.length>e*1.6){o();let c=u.split(/(?<=[.!?])\s+/),f="";for(let d of c)f&&(f+" "+d).length>e?(r.push({title:s,text:f.trim(),doc:n}),f=d):f=f?`${f} ${d}`:d;f.trim()&&r.push({title:s,text:f.trim(),doc:n});continue}a&&(a+`

`+u).length>e&&o(),a=a?`${a}

${u}`:u}o()}),r}var Er=new WeakMap;function Kr(l){let e=new Set;for(let r of l)r.length>=4&&e.add(r.slice(0,4));return e}function ms(l){let e=Er.get(l);if(e)return e;let r=`${l.title} ${l.text}`.toLowerCase(),t=l.title.toLowerCase(),n=new Set(Ie(r).map(Lt)),s=new Set(Ie(t).map(Lt)),i={hay:r,titre:t,docStems:n,titreStems:s,docPrefix4:Kr(n),titrePrefix4:Kr(s)};return Er.set(l,i),i}function hs(l,e,r){if(!l.length)return 0;let t=ms(e),n=0,s=0;for(let i of l){let a=r.get(i)??1;s+=a;let o=Lt(i),u=o.length>=4?o.slice(0,4):null;if(t.hay.includes(i)||t.docStems.has(o)||u!==null&&t.docPrefix4.has(u)){let f=t.titre.includes(i)||t.titreStems.has(o)||u!==null&&t.titrePrefix4.has(u);n+=a*(f?2.2:1)}}return s?n/s:0}function bs(l){let e=new Map;for(let n of l)for(let s of Ie(`${n.title} ${n.text}`))e.set(s,(e.get(s)??0)+1);let r=new Map,t=Math.max(1,l.length);for(let[n,s]of e)r.set(n,Math.log(1+t/s));return r}function Hr(l,e,r=1200,t=3,n=.22,s=.5){let i=Ie(l);if(!i.length||!e.length)return[];let a=bs(e),o=e.map(g=>({c:g,s:hs(i,g,a)})).filter(g=>g.s>=n).sort((g,m)=>m.s-g.s),u=o.length?o[0].s*s:0,c=o.filter(g=>g.s>=u),f=[],d=new Set,p=r;for(let{c:g,s:m}of c)f.length>=t||g.text.length>p||d.has(g.doc)||(f.push({chunk:g,score:m}),d.add(g.doc),p-=g.text.length);for(let{c:g,s:m}of c){if(f.length>=t)break;f.some(b=>b.chunk===g)||g.text.length>p||(f.push({chunk:g,score:m}),p-=g.text.length)}return f}function Dt(l){if(Ie(l).length<2)return!1;let e=l.trim().toLowerCase();return/\?\s*$/.test(e)?!0:/^(?:who|what|when|where|why|how|which|whose|is|are|was|were|do|does|did|can|could|will|would|should|may|have|has|qui|que|quoi|quand|où|pourquoi|comment|combien|quel|quelles?|quels|est|sont|était|avez|peux|pouvez|puis|vous|y a-t-il|est-ce)\b/.test(e)}function jt(l,e=!1){let r=l.trim();return r?e?/pas cette information|n[’']ai pas (?:cette|ces|d[’']information)|ne (?:sais|dispose) pas|pas en mesure de (?:vous )?(?:aider|répondre|renseigner|fournir)|ne peux pas (?:vous )?(?:aider|fournir|renseigner|répondre)/i.test(r):/do not have (?:that|this|any) information|don[’']t have (?:that|this|any) information|no information (?:about|on)|(?:can[’']t|cannot|not able to|unable to) (?:assist|provide|answer|access|help you with that)/i.test(r):!1}function vs(l){let e=l.trim().toLowerCase().replace(/[!?.,;:\-_]/g,"").trim();return/^(hi|hello|hey|greetings|good\s+(morning|afternoon|evening|day)|bonjour|salut|coucou|bonsoir|how\s+are\s+you|how\s+are\s+you\s+doing|ça\s+va|ca\s+va|comment\s+vas?-tu|comment\s+allez-vous|who\s+are\s+you|qui\s+es-tu|merci|thanks|thank\s+you|what\s+can\s+you\s+do|que\s+peux-tu\s+faire)$/i.test(e)}function ft(l,e,r=!1){if(e&&vs(e))return"";if(!l.length)return e&&!Dt(e)?r?`

Ce message n\u2019appelle aucune fiche : r\xE9ponds en une phrase courte et aimable.`:`

This message needs no reference note: reply in one short, friendly sentence.`:r?`

Aucune fiche de r\xE9f\xE9rence ne correspond \xE0 cette question. Dis que tu n\u2019as pas cette information : ne devine pas.`:`

No reference note matches this question. Say that you do not have this information: do not guess.`;let t=l.map((s,i)=>`[${i+1}]${s.title?` ${s.title}`:""}
${s.text}`).join(`

`);return`

${r?"R\xE9ponds UNIQUEMENT \xE0 partir des fiches ci-dessous, en fran\xE7ais. Reprends leurs chiffres exactement. Si la r\xE9ponse n\u2019y est pas, dis que tu n\u2019as pas cette information : n\u2019invente jamais pour combler.":"Answer using ONLY the reference notes below. Copy their figures exactly. If the answer is not in them, say you do not have that information: never fill the gap with what you assume."}

--- NOTES ---
${t}
--- END OF NOTES ---`}function Nr(l){let e=Array.isArray(l)?l:[l],r=[];for(let t of e)typeof t=="string"&&t.trim()?r.push({text:t}):t&&typeof t=="object"&&typeof t.text=="string"&&t.text.trim()&&r.push({title:t.title,text:t.text});return r}function ws(l){let e=l.replace(/×/g,"*").replace(/÷/g,"/").replace(/,/g,".").replace(/[\s  ]/g,"").replace(/=+$/,"");if(!e||e.length>200)return null;let r=0,t=()=>e[r],n=()=>{let f=/^\d+(\.\d+)?/.exec(e.slice(r));return f?(r+=f[0].length,parseFloat(f[0])):null},s=()=>{if(t()==="("){r++;let f=u();return f===null||t()!==")"?null:(r++,f)}return n()},i=()=>{if(t()==="-"){r++;let f=i();return f===null?null:-f}return s()},a=()=>{let f=i();if(f===null)return null;if(t()==="^"){r++;let d=a();return d===null?null:Math.pow(f,d)}return f},o=()=>{let f=a();for(;f!==null&&(t()==="*"||t()==="/"||t()==="%");){let d=e[r++],p=a();if(p===null)return null;f=d==="*"?f*p:d==="/"?f/p:f%p}return f},u=()=>{let f=o();for(;f!==null&&(t()==="+"||t()==="-");){let d=e[r++],p=o();if(p===null)return null;f=d==="+"?f+p:f-p}return f},c=u();return r===e.length&&c!==null&&Number.isFinite(c)?c:null}function Qr(l,e=3){let r=[],t=new Set,n=/[\d(][\d\s  .,+\-*/×÷%^()]*[\d)]\s*=?/g;for(let s of l.matchAll(n)){let i=s[0].trim();if(r.length>=e)break;if(t.has(i)||/\d{1,2}[/.]\d{1,2}[/.]\d{2,4}/.test(i)||/\d+:\d+/.test(l.slice(Math.max(0,s.index-1),s.index+i.length+1)))continue;let a=(i.match(/[+\-*/×÷%^]/g)||[]).length,o=/[*×÷%^(]/.test(i)||/=$/.test(i)||a>=2;if(a===0||!o)continue;let u=ws(i);if(u===null)continue;let c=i.replace(/=+$/,"").trim();/[+\-*/×÷%^]/.test(c)&&(t.add(i),r.push({expr:c,value:u}))}return r}function Wr(l){let e=Math.round(l*1e9)/1e9;return Number.isInteger(e),String(e)}function dt(l){return new Date().toLocaleDateString(l==="fr"?"fr-FR":"en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}var ys=1e4,ks=600;function pt(l){if(!Array.isArray(l))return[];let e=[];for(let r of l){if(r==="calc"||r==="date"){e.push(r);continue}let t=r;if(t&&typeof t=="object"&&typeof t.name=="string"&&t.name.trim()&&typeof t.run=="function"&&(t.match instanceof RegExp||typeof t.match=="function")){e.push(t);continue}console.warn("[brimkern] outil ignor\xE9 (attendu : 'calc', 'date', ou { name, match, run }) :",r)}return e}var Ir=l=>l.includes("date");function $r(l){return l?`
(Date du jour : ${dt("fr")}.)`:`
(Today's date: ${dt("en")}.)`}var xs=/\b(?:today|tonight|what\s+day|which\s+day|what\s+date|what\s+year|what\s+month|current\s+(?:date|day|year)|aujourd(?:'|’)hui|quel\s+jour|quelle\s+date|quelle\s+ann[ée]e|quel\s+mois|on\s+est\s+quel)\b/i,As=(l,e)=>new Promise((r,t)=>{let n=setTimeout(()=>t(new Error(`outil sans r\xE9ponse apr\xE8s ${e} ms`)),e);l.then(s=>{clearTimeout(n),r(s)},s=>{clearTimeout(n),t(s)})});async function Et(l,e,r){let t=[];for(let n of l){if(n==="date"){xs.test(e)&&t.push({name:"date",result:dt(r?"fr":"en")});continue}if(n==="calc"){let s=Qr(e);s.length&&t.push({name:r?"calculatrice":"calculator",result:s.map(i=>`${i.expr} = ${Wr(i.value)}`).join(" ; ")});continue}try{if(!(n.match instanceof RegExp?n.match.test(e):n.match(e)))continue;let i=await As(Promise.resolve(n.run(e)),ys),a=String(i??"").replace(/\s+/g," ").trim().slice(0,ks);a&&t.push({name:n.name.replace(/\s+/g," ").trim().slice(0,40),result:a})}catch(s){console.error(`[brimkern] outil \xAB ${n.name} \xBB a \xE9chou\xE9 :`,s)}}return t}function gt(l,e){if(!l.length)return"";let r=l.map(t=>e?`${t.name} : ${t.result}`:`${t.name}: ${t.result}`).join(" \xB7 ");return e?`[R\xE9sultats d\u2019outils locaux. Exacts, utilise-les tels quels : ${r}]`:`[Local tool results. Exact values, use them as-is: ${r}]`}ur();async function ts(l){let{LocalBackend:e}=await Promise.resolve().then(()=>(cr(),Vn));if(l!==!0)return new e;try{let{WorkerBackend:r}=await Promise.resolve().then(()=>(es(),Zn)),t=new r;return await t.ready(),t}catch(r){return console.warn("[brimkern] Web Worker indisponible : inf\xE9rence sur le thread principal",r),new e}}lr();var pi=typeof self<"u"&&typeof self.importScripts=="function"&&typeof document>"u";pi&&Promise.resolve().then(()=>(rs(),di));var qt=null,gr=null,pr;function at(){return qt||(qt=ts(pr).then(l=>(gr=l,l))),qt}var gi=()=>gr?.kind??"pending";function mr(l){if(l.workerUrl&&Xn(l.workerUrl),l.worker!==void 0){if(qt&&pr!==l.worker){console.warn("[brimkern] option `worker` ignor\xE9e : le backend est d\xE9j\xE0 d\xE9marr\xE9 et partag\xE9 par la page.");return}pr=l.worker}}var mi=`
Answer briefly and honestly. If you do not know something, say so: never invent facts or details.
You have no tools and no internet access: never emit tool calls, reply in plain text only.`,hi=`
Answer briefly and honestly. If you do not know something, say so: never invent facts or details.
Bracketed tool results in the message are exact facts: use them as-is. Never emit tool calls yourself, reply in plain text only.`;function ss(){let l=new Map;return{on(e,r){let t=l.get(e);return t||l.set(e,t=new Set),t.add(r),()=>{t.delete(r)}},emit(e,...r){let t=l.get(e);if(t)for(let n of[...t])try{n(...r)}catch(s){console.error("[brimkern] \xE9couteur `"+e+"` a lev\xE9 :",s)}},clear(){l.clear()}}}function ut(l){if(!Array.isArray(l))return[];let e=[];for(let r of l){let t=r?.role,n=r?.content;(t==="user"||t==="assistant")&&typeof n=="string"&&n.trim()&&e.push({role:t,content:n})}return e}function ot(l){return l.lang?l.lang==="fr":l.system?/[àâäéèêëîïôöùûüç]|\b(?:bonjour|salut|vous|tu|réponds|conseiller|boutique|aide|aidez|client|magasin)\b/i.test(l.system):!!(typeof document<"u"&&/^fr\b/i.test(document.documentElement.lang||"")||typeof navigator<"u"&&/^fr\b/i.test(navigator.language||""))}var is={en:{ouvrir:"Open the chat",fermer:"Close",placeholder:"Type a message\u2026",note:"Local AI \u2014 runs on your GPU, nothing is sent anywhere.",erreur:"Error: ",vide:"Sorry, I can only answer in plain text here: could you rephrase?",aide:"I\u2019m here to help \u2014 what would you like to know?",mo:"MB",sources:"Sources:",phases:{init:"Starting up\u2026",download:"downloading the model\u2026",tokenizer:"tokenizer\u2026",gpu:"weights to the GPU\u2026"},erreurs:{"no-webgpu":"This browser does not support WebGPU: the local assistant cannot run here."}},fr:{ouvrir:"Ouvrir le chat",fermer:"Fermer",placeholder:"\xC9cris un message\u2026",note:"IA locale \u2014 tourne sur votre GPU, aucune donn\xE9e envoy\xE9e.",erreur:"Erreur : ",vide:"D\xE9sol\xE9, je ne peux r\xE9pondre qu\u2019en texte simple ici : pouvez-vous reformuler ?",aide:"Je suis l\xE0 pour vous aider \u2014 que voulez-vous savoir ?",mo:"Mo",sources:"Sources :",phases:{init:"initialisation\u2026",download:"t\xE9l\xE9chargement du mod\xE8le\u2026",tokenizer:"tokenizer\u2026",gpu:"poids sur le GPU\u2026"},erreurs:{"no-webgpu":"Ce navigateur ne prend pas en charge WebGPU : l\u2019assistant local ne peut pas tourner ici."}}};function bi(l,e){if(!e)return l;let r=n=>typeof n=="string"&&!!n.trim(),t={...l.phases};if(e.phases&&typeof e.phases=="object")for(let[n,s]of Object.entries(e.phases))r(s)&&(t[n]=s);return{...l,...r(e.open)?{ouvrir:e.open}:null,...r(e.close)?{fermer:e.close}:null,...r(e.placeholder)?{placeholder:e.placeholder}:null,...r(e.note)?{note:e.note}:null,...r(e.error)?{erreur:e.error}:null,...r(e.empty)?{vide:e.empty}:null,...r(e.help)?{aide:e.help}:null,...r(e.sources)?{sources:e.sources}:null,...r(e.mb)?{mo:e.mb}:null,phases:t}}var vi=(l,e)=>l.phases[e]??e,ns=(l,e)=>e?.code&&l.erreurs[e.code]||e?.message||String(e);function Ft(l){let e=pt(l.tools),r=Ir(e)?$r(ot(l)):"",t=(l.system||"You are a helpful assistant.")+(e.length?hi:mi)+r,n=c=>c.flatMap(f=>[{role:"user",content:f.user},{role:"assistant",content:f.assistant}]),s=e.length?wi(ot(l)):[];if(!l.knowledge)return{system:()=>t,userTurn:(c,f)=>({text:f?`${c}

${f}`:c,sources:[],conversationnel:!1}),pinned:n([...s,...l.examples||[]])};let i=zr(Nr(l.knowledge)),a=l.knowledgeBudget??1200,o=ot(l),u=o?t+`

Le message utilisateur peut inclure des fiches de r\xE9f\xE9rence entre des balises ---. Dans ce cas, r\xE9ponds uniquement \xE0 partir de ces fiches en citant fid\xE8lement leurs informations dans la langue de la question. Si aucune note ne correspond, indique poliment que tu n\u2019as pas cette information.`:t+`

The user message may include reference notes between --- markers. When it does, answer from those notes and quote their figures exactly. When it says no note matches, say you do not have that information.`;return{system:()=>u,userTurn:(c,f)=>{let d=Hr(c,i,a);if(f&&!d.length)return{text:`${c}

${f}`,sources:[],conversationnel:!1};let p=ft(d.map(m=>m.chunk),c,o).trim(),g=m=>f?`${m}

${f}`:m;return{text:p?`${g(p)}

Question: ${c}`:g(c),sources:p?d.map(({chunk:m,score:b})=>({title:m.title,text:m.text,score:b,doc:m.doc})):[],conversationnel:!d.length&&!Dt(c)}},pinned:n([...yi(o),...s,...l.examples||[]])}}function wi(l=!1){let e=(r,t)=>`${r}

${gt(t,l)}`;return l?[{user:e("Combien font 45*3 ?",[{name:"calculatrice",result:"45*3 = 135"}]),assistant:"45*3 = 135."},{user:e("Il vous en reste en rayon ?",[{name:"rayon",result:"3 exemplaires en rayon"}]),assistant:"Oui \u2014 il en reste 3 exemplaires en rayon."}]:[{user:e("What is 45*3?",[{name:"calculator",result:"45*3 = 135"}]),assistant:"45*3 = 135."},{user:e("Do you still have some on the shelf?",[{name:"shelf",result:"3 items on the shelf"}]),assistant:"Yes \u2014 3 items are on the shelf."}]}function yi(l=!1){let e=(n,s)=>({title:n,text:s,doc:0}),r=(n,s)=>`${ft(n,void 0,l).trim()}

Question: ${s}`,t=(n,s)=>`${ft(n,s,l).trim()}

Question: ${s}`;return l?[{user:"Bonjour !",assistant:"Bonjour ! Comment puis-je vous aider ?"},{user:r([e("Guide des tailles",`Tableau des correspondances :
- Pointure EU 38 : 24,0 cm (US 6,5)
- Pointure EU 39 : 24,5 cm (US 7,0)
- Pointure EU 41 : 26,0 cm (US 8,0)`)],"Je fais du 41, quelle taille en cm ?"),assistant:"La pointure 41 correspond \xE0 26,0 cm."},{user:r([e("Retours","Les retours sont gratuits sous 14 jours. Le remboursement est effectu\xE9 sous 3 jours ouvr\xE9s.")],"Combien de temps pour retourner un article ?"),assistant:"Vous disposez de 14 jours pour retourner un article."},{user:r([],"Qui a gagn\xE9 la Coupe du Monde 1998 ?"),assistant:"Je n\u2019ai pas cette information dans mes fiches."},{user:t([],"Tu es un robot ?"),assistant:"Je suis un assistant automatique, oui. Comment puis-je vous aider ?"}]:[{user:"Hello!",assistant:"Hello! How can I help you today?"},{user:r([e("Size guide",`Size conversions:
- Size EU 38: 24.0 cm (US 6.5)
- Size EU 39: 24.5 cm (US 7.0)
- Size EU 41: 26.0 cm (US 8.0)`)],"I wear a 41, what is that in cm?"),assistant:"A size 41 is 26.0 cm."},{user:r([e("Returns","Returns are free within 14 days. Refunds are issued within 3 working days.")],"How long do I have to return an item?"),assistant:"You have 14 days to return an item."},{user:r([],"Who won the 1998 World Cup?"),assistant:"I do not have that information in my notes."},{user:t([],"Are you a robot?"),assistant:"I am an automated assistant, yes. How can I help?"}]}function as(l={}){mr(l);let e=st(l.model),r=l.maxTokens||220,t=l.knowledge,n=Ft(l),s=ot(l),i=ut(l.history),a=[],o=ss(),u=!1,c=!1,f=!1,d=()=>l.temperature??(t?.25:.55),p=pt(l.tools),g=m=>{if(u)throw new Error(`brimkern: ${m} impossible pendant une g\xE9n\xE9ration`)};return{async ask(m,b={}){if(c)throw new Error("session d\xE9truite");if(u)throw new Error("g\xE9n\xE9ration d\xE9j\xE0 en cours sur cette session");u=!0,i.push({role:"user",content:m}),o.emit("message",{role:"user",content:m});try{let v=await Et(p,m,s);for(let w of v)o.emit("tool",w);let{text:_,sources:B,conversationnel:q}=n.userTurn(m,gt(v,s));a=B,b.onSources?.(B);let C=[...i.slice(0,-1),{role:"user",content:_}],j=await at();await j.preload(e,(w,h)=>o.emit("progress",w,h)),f||(f=!0,o.emit("ready"));let x={url:e,history:C,system:n.system(m),maxTokens:r,temperature:d(),pinned:n.pinned},k=await j.turn(x,b.onToken,b.signal);return b.signal?.aborted?(i.pop(),""):(q&&jt(k,s)&&(k=is[s?"fr":"en"].aide),i.push({role:"assistant",content:k}),o.emit("message",{role:"assistant",content:k,sources:B}),k)}catch(v){throw i.pop(),o.emit("error",v instanceof Error?v:new Error(String(v))),v}finally{u=!1}},reset(){i=[],a=[]},destroy(){c=!0,i=[],a=[],o.clear()},get history(){return i.slice()},get lastSources(){return a.slice()},setHistory(m){g("setHistory"),i=ut(m)},setKnowledge(m){g("setKnowledge"),t=m,n=Ft({...l,knowledge:m}),a=[]},on:o.on}}function ki(){if(document.getElementById("bk-style"))return;let l=document.createElement("style");l.id="bk-style",l.textContent=`
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
  `,document.head.appendChild(l)}function xi(l){if(!l)return"#c72c1e";if(/^#[0-9a-fA-F]{3,8}$/.test(l))return l;try{if(typeof CSS<"u"&&CSS.supports("color",l)&&!/[{};()]/.test(l))return l}catch{}return"#c72c1e"}function Ai(l,e){let r=l.knowledge,t=Ft(l),n=ot(l),s=bi(is[n?"fr":"en"],l.labels),i=xi(l.accent),a=l.title||"Assistant",o=l.maxTokens||220,u=pt(l.tools);ki();let c=document.createElement("button");c.className="bk-fab",c.setAttribute("aria-label",s.ouvrir),c.textContent="\u{1F4AC}";let f=document.createElement("div");if(f.className="bk-panel",c.style.setProperty("--bk-accent",i),f.style.setProperty("--bk-accent",i),l.position==="bottom-left")for(let S of[c,f])S.style.left="20px",S.style.right="auto";let d=(S,L,z)=>typeof S=="number"&&Number.isFinite(S)?Math.min(z,Math.max(L,Math.round(S))):null,p=d(l.width,300,480),g=d(l.height,380,720);p&&(f.style.width=`${p}px`),g&&(f.style.height=`${g}px`);let m={"--bk-bg":"#211f1c","--bk-surface":"#2c2a26","--bk-border":"#413e38","--bk-border2":"#3a3733","--bk-text":"#f0eee8","--bk-muted":"#a29e93","--bk-muted2":"#c6c2b8"},b=S=>{for(let L of[c,f])for(let[z,W]of Object.entries(m))S?L.style.setProperty(z,W):L.style.removeProperty(z)},v=null,_=null;l.theme==="dark"?b(!0):l.theme==="auto"&&typeof matchMedia=="function"&&(v=matchMedia("(prefers-color-scheme: dark)"),b(v.matches),_=S=>b(S.matches),v.addEventListener("change",_)),f.innerHTML=`
    <div class="bk-hd"><span class="bk-dot"></span><span>${Bt(a)}</span><button class="bk-x" aria-label="${Bt(s.fermer)}">\xD7</button></div>
    <div class="bk-msgs"></div>
    <div class="bk-foot"><textarea class="bk-in" rows="1" placeholder="${Bt(s.placeholder)}"></textarea><button class="bk-send">\u2191</button></div>
    <div class="bk-note">${Bt(s.note)}</div>`,document.body.appendChild(c),document.body.appendChild(f);let B=f.querySelector(".bk-msgs"),q=f.querySelector(".bk-in"),C=f.querySelector(".bk-send"),j=f.querySelector(".bk-x"),x=ut(l.history),k=!1,w=!1,h=!1,A=new AbortController,y=(S,L)=>{let z=document.createElement("div");return z.className=`bk-m ${S==="user"?"bk-u":"bk-a"}`,z.textContent=L,B.appendChild(z),B.scrollTop=B.scrollHeight,z},P=S=>{if(!l.showSources||!S.length)return;let L=document.createElement("div");L.className="bk-src";let z=document.createElement("b");z.textContent=`${s.sources} `,L.appendChild(z),L.appendChild(document.createTextNode(S.map((W,V)=>`[${V+1}] ${W.title||W.text.slice(0,40).replace(/\s+/g," ").trim()+"\u2026"}`).join(" \xB7 "))),B.appendChild(L),B.scrollTop=B.scrollHeight},U=()=>{B.textContent="";for(let S of x)y(S.role,S.content)};x.length?U():l.greeting&&(x.push({role:"assistant",content:l.greeting}),y("assistant",l.greeting));let F=st(l.model),G=()=>{if(!w){w=!0;let S=y("assistant",s.phases.init);S.classList.add("bk-status"),at().then(L=>L.preload(F,(z,W)=>{e.emit("progress",z,W);let V=vi(s,z);S.textContent=W?.total?`${V} ${Math.round(W.loaded/1048576)} / ${Math.round(W.total/1048576)} ${s.mo}`:V})).then(()=>{S.remove(),e.emit("ready")}).catch(L=>{S.textContent=s.erreur+ns(s,L),w=!1,e.emit("error",L instanceof Error?L:new Error(String(L)))})}return at()},O=async S=>{k=!0,C.disabled=!0,x.push({role:"user",content:S}),y("user",S),e.emit("message",{role:"user",content:S});let L=y("assistant","\u2026");try{await G();let z=await Et(u,S,n);for(let R of z)e.emit("tool",R);let{text:W,sources:V,conversationnel:$}=t.userTurn(S,gt(z,n)),X=[...x.slice(0,-1),{role:"user",content:W}],M={url:F,history:X,system:t.system(S),maxTokens:o,temperature:r?.25:.55,pinned:t.pinned},T=await(await at()).turn(M,R=>{L.textContent=R||"\u2026",B.scrollTop=B.scrollHeight},A.signal);return h?"":(T?$&&jt(T,n)&&(T=s.aide):T=s.vide,L.textContent=T,x.push({role:"assistant",content:T}),P(V),e.emit("message",{role:"assistant",content:T,sources:V}),T)}catch(z){throw L.textContent=s.erreur+ns(s,z),e.emit("error",z instanceof Error?z:new Error(String(z))),z}finally{k=!1,C.disabled=!1,h||q.focus()}},D=()=>{let S=q.value.trim();!S||k||h||(q.value="",O(S).catch(()=>{}))},E=S=>{h||f.classList.contains("bk-open")!==S&&(f.classList.toggle("bk-open",S),S&&(q.focus(),G()),e.emit(S?"open":"close"))};return c.onclick=()=>E(!f.classList.contains("bk-open")),j.onclick=()=>E(!1),C.onclick=D,q.onkeydown=S=>{S.key==="Enter"&&!S.shiftKey&&(S.preventDefault(),D())},{open:()=>E(!0),close:()=>E(!1),toggle:()=>E(!f.classList.contains("bk-open")),ask(S){if(h)return Promise.reject(new Error("brimkern: widget d\xE9mont\xE9"));let L=String(S??"").trim();return L?k?Promise.reject(new Error("g\xE9n\xE9ration d\xE9j\xE0 en cours sur ce widget")):(E(!0),O(L)):Promise.reject(new Error("brimkern: ask() attend une question non vide"))},destroy(){h||(h=!0,A.abort(),v&&_&&v.removeEventListener("change",_),c.onclick=null,j.onclick=null,C.onclick=null,q.onkeydown=null,c.remove(),f.remove(),x=[])},setKnowledge(S){r=S,t=Ft({...l,knowledge:S})},setHistory(S){if(k)throw new Error("brimkern: setHistory impossible pendant une g\xE9n\xE9ration");x=ut(S),U()},history:()=>x.slice(),el:f}}function Bt(l){return l.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}var Pi=(l={})=>{let e=ss(),r=null,t=!1,n=!1,s=[],i=o=>{r?o(r):!t&&!n&&s.push(o)},a=()=>{if(!(n||r)){r=Ai(l,e);for(let o of s.splice(0))o(r)}};return typeof window>"u"||typeof document>"u"?(t=!0,console.warn("[brimkern] embed() ignor\xE9 : aucun DOM (rendu serveur ?). Appelez-le dans un effet client.")):(mr(l),document.body?a():window.addEventListener("DOMContentLoaded",a,{once:!0})),{open:()=>i(o=>o.open()),close:()=>i(o=>o.close()),toggle:()=>i(o=>o.toggle()),ask(o){return t?Promise.reject(new Error("brimkern: ask() sans DOM (rendu serveur ?)")):n?Promise.reject(new Error("brimkern: widget d\xE9mont\xE9")):new Promise((u,c)=>i(f=>f.ask(o).then(u,c)))},destroy(){n=!0,s.length=0,r?.destroy(),r=null,e.clear()},setKnowledge:o=>i(u=>u.setKnowledge(o)),setHistory:o=>i(u=>u.setHistory(o)),get history(){return r?r.history():ut(l.history)},get el(){return r?r.el:null},on:e.on}};var _i=async l=>{if(typeof l!="object"||l===null||typeof l.prompt!="string")throw new TypeError(`Brimkern.generate expects a single object: generate({ prompt: "\u2026", model?, system? }). Received ${typeof l}${typeof l=="object"&&l?" without a `prompt` string":""}.`);return as(l).ask(l.prompt,{onToken:l.onToken,signal:l.signal,onSources:l.onSources})},Ui=(l={})=>(mr(l),typeof navigator<"u"&&"gpu"in navigator?at().then(e=>e.preload(st(l.model),l.onProgress)).then(()=>!0).catch(()=>!1):Promise.resolve(!1)),Gi=l=>typeof navigator>"u"||!("gpu"in navigator)?"unavailable":gr?.state(st(l))??"idle";typeof window<"u"&&(window.Brimkern={embed:Pi,createSession:as,generate:_i,preload:Ui,status:Gi,runtime:gi});})();
