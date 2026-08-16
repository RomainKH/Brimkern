"use strict";(()=>{var Yr=Object.defineProperty;var te=(d,e,r)=>()=>{if(r)throw r[0];try{return d&&(e=d(d=0)),e}catch(t){throw r=[t],t}};var Qt=(d,e)=>{for(var r in e)Yr(d,r,{get:e[r],enumerable:!0})};function Pe(d){let e=new Float32Array(1),r=new Uint32Array(e.buffer);e[0]=d;let t=r[0],n=t>>16&32768,a=(t>>23&255)-127+15,i=t&8388607;return a<=0?n:a>=31?n|31743:(i=(i>>13)+(i>>12&1),i===1024&&(i=0,a+=1),n|a<<10|i&1023)}function ce(d){let e=d>>15&1,r=d>>10&31,t=d&1023,n;return r===0?n=t*59604645e-15:r===31?n=t?NaN:1/0:n=(1+t/1024)*2**(r-15),e===1?-n:n}var De=te(()=>{"use strict"});function Me(d){let e=d.length;if(e%ve!==0)throw new Error(`q4web: length ${e} not a multiple of ${ve}`);let r=e/ve,t=new Uint8Array(e/2),n=new Uint16Array(r),a=new Uint16Array(r);for(let i=0;i<r;i++){let s=i*ve,o=1/0,u=-1/0;for(let m=0;m<ve;m++){let b=d[s+m];b<o&&(o=b),b>u&&(u=b)}let c=(u-o)/15||1e-8,l=Pe(c),f=Pe(o);n[i]=l,a[i]=f;let p=ce(l)||1e-8,g=ce(f);for(let m=0;m<ve;m++){let b=Math.round((d[s+m]-g)/p);b=b<0?0:b>15?15:b;let k=s+m;(m&1)===0?t[k>>1]=b:t[k>>1]|=b<<4}}return{nibbles:t,scales:n,mins:a,nElems:e}}function Ue(d,e){let r=e/ve,t=e/2,n=d.slice(0,t),a=new Uint16Array(r),i=new Uint16Array(r),s=new DataView(d.buffer,d.byteOffset);for(let o=0;o<r;o++)a[o]=s.getUint16(t+o*2,!0);for(let o=0;o<r;o++)i[o]=s.getUint16(t+r*2+o*2,!0);return{nibbles:n,scales:a,mins:i,nElems:e}}function pe(d){let e=new Float32Array(d.nElems),r=d.nElems/ve;for(let t=0;t<r;t++){let n=ce(d.scales[t]),a=ce(d.mins[t]),i=t*ve;for(let s=0;s<ve;s++){let o=i+s,u=d.nibbles[o>>1],c=(s&1)===0?u&15:u>>4;e[o]=c*n+a}}return e}var ve,it=te(()=>{"use strict";De();ve=32});function Ce(d){let e=d.length;if(e%be!==0)throw new Error(`q8web: length ${e} not a multiple of ${be}`);let r=e/be,t=new Int8Array(e),n=new Uint16Array(r);for(let a=0;a<r;a++){let i=a*be,s=0;for(let l=0;l<be;l++){let f=Math.abs(d[i+l]);f>s&&(s=f)}let o=s/127||1e-8,u=Pe(o);n[a]=u;let c=ce(u)||1e-8;for(let l=0;l<be;l++){let f=Math.round(d[i+l]/c);f=f<-127?-127:f>127?127:f,t[i+l]=f}}return{codes:t,scales:n,nElems:e}}function Be(d,e){let r=e/be,t=new Int8Array(d.buffer.slice(d.byteOffset,d.byteOffset+e)),n=new Uint16Array(r),a=new DataView(d.buffer,d.byteOffset);for(let i=0;i<r;i++)n[i]=a.getUint16(e+i*2,!0);return{codes:t,scales:n,nElems:e}}function we(d){let e=new Float32Array(d.nElems),r=d.nElems/be;for(let t=0;t<r;t++){let n=ce(d.scales[t]),a=t*be;for(let i=0;i<be;i++)e[a+i]=d.codes[a+i]*n}return e}var be,ot=te(()=>{"use strict";De();be=32});function Xt(d){let e=d.length;if(e%ye!==0)throw new Error(`q3web: length ${e} not a multiple of ${ye}`);let r=e/ye,t=new Uint32Array(e/16),n=new Uint32Array(e/32),a=new Uint16Array(r),i=new Uint16Array(r);for(let s=0;s<r;s++){let o=s*ye,u=1/0,c=-1/0;for(let b=0;b<ye;b++){let k=d[o+b];k<u&&(u=k),k>c&&(c=k)}let l=(c-u)/7||1e-8,f=Pe(l),p=Pe(u);a[s]=f,i[s]=p;let g=ce(f)||1e-8,m=ce(p);for(let b=0;b<ye;b++){let k=Math.round((d[o+b]-m)/g);k=k<0?0:k>7?7:k;let x=o+b;t[x>>4]|=(k&3)<<(x&15)*2,n[x>>5]|=k>>2<<(x&31)}}return{lo:t,hi:n,scales:a,mins:i,nElems:e}}function ut(d,e){let r=e/ye,t=e/16,n=e/32,a=t*4,i=n*4,s=new DataView(d.buffer,d.byteOffset),o=new Uint32Array(t),u=new Uint32Array(n),c=new Uint16Array(r),l=new Uint16Array(r);for(let g=0;g<t;g++)o[g]=s.getUint32(g*4,!0);for(let g=0;g<n;g++)u[g]=s.getUint32(a+g*4,!0);let f=a+i,p=f+r*2;for(let g=0;g<r;g++)c[g]=s.getUint16(f+g*2,!0);for(let g=0;g<r;g++)l[g]=s.getUint16(p+g*2,!0);return{lo:o,hi:u,scales:c,mins:l,nElems:e}}function We(d){let e=new Float32Array(d.nElems),r=d.nElems/ye;for(let t=0;t<r;t++){let n=ce(d.scales[t]),a=ce(d.mins[t]),i=t*ye;for(let s=0;s<ye;s++){let o=i+s,u=d.lo[o>>4]>>(o&15)*2&3|(d.hi[o>>5]>>(o&31)&1)<<2;e[o]=u*n+a}}return e}var ye,Zt=te(()=>{"use strict";De();ye=32});var er,tr,rr=te(()=>{"use strict";er={matmul:`
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
	}`});var Qe,nr=te(()=>{"use strict";Qe=class{constructor(e){this.sets=[];this.cur=0;this.next=0;this.names=[];this.acc=new Map;this.dropped=0;this.pending=[];this.fenetre=0;this.device=e;let r=globalThis;for(let t=0;t<2;t++)this.sets.push({qs:e.createQuerySet({type:"timestamp",count:4096}),resolve:e.createBuffer({size:4096*8,usage:r.GPUBufferUsage.QUERY_RESOLVE|r.GPUBufferUsage.COPY_SRC}),read:e.createBuffer({size:4096*8,usage:r.GPUBufferUsage.COPY_DST|r.GPUBufferUsage.MAP_READ}),busy:!1})}slot(e){if(this.next+2>4096&&(this.rotate(),this.next+2>4096))return this.dropped++,null;let r=this.sets[this.cur];if(r.busy)return this.dropped++,null;let t=this.next;return this.next+=2,this.names.push(e),{querySet:r.qs,beginningOfPassWriteIndex:t,endOfPassWriteIndex:t+1}}rotate(){let e=this.cur,r=this.sets[e],t=this.names,n=this.next;if(this.cur=(this.cur+1)%2,this.next=0,this.names=[],!n||r.busy)return;r.busy=!0;let a=this.fenetre,i=this.device.createCommandEncoder();i.resolveQuerySet(r.qs,0,n,r.resolve,0),i.copyBufferToBuffer(r.resolve,0,r.read,0,n*8),this.device.queue.submit([i.finish()]);let s=globalThis,o=r.read.mapAsync(s.GPUMapMode.READ,0,n*8).then(()=>{let u=new BigUint64Array(r.read.getMappedRange(0,n*8).slice(0));if(r.read.unmap(),a===this.fenetre)for(let c=0;c<t.length;c++){let l=u[c*2],f=u[c*2+1];if(!l||!f||f<=l)continue;let p=Number(f-l),g=this.acc.get(t[c]);g?(g.calls++,g.ns+=p):this.acc.set(t[c],{calls:1,ns:p})}}).catch(()=>{}).finally(()=>{r.busy=!1});this.pending.push(o)}async report(){this.rotate();let e=this.pending;this.pending=[],await Promise.all(e);let r=0,t=0;for(let a of this.acc.values())r+=a.ns,t+=a.calls;return{passes:[...this.acc.entries()].map(([a,i])=>({name:a,calls:i.calls,totalMs:i.ns/1e6,meanUs:i.ns/i.calls/1e3,share:r?i.ns/r:0,reliable:i.calls>=50})).sort((a,i)=>i.totalMs-a.totalMs),totalMs:r/1e6,samples:t,dropped:this.dropped,quantumUs:100}}reset(){this.fenetre++,this.acc.clear(),this.dropped=0}destroy(){for(let e of this.sets)try{e.qs.destroy(),e.resolve.destroy(),e.read.destroy()}catch{}this.sets=[]}}});function en(){if(ar!==null)return ar;try{let d=globalThis.__brimkernSearch;if(typeof d=="string")return d}catch{}try{return typeof location<"u"?location.search:""}catch{return""}}function ie(d){try{return new URLSearchParams(en()).get(d)}catch{return null}}var ar,sr=te(()=>{"use strict";ar=null});function he(d){let e=d>>15&1,r=d>>10&31,t=d&1023,n;return r===0?n=t*59604645e-15:r===31?n=65504:n=(1+t/1024)*2**(r-15),e===1?-n:n}function qe(d){let e=new Float32Array(1),r=new Uint32Array(e.buffer);e[0]=d;let t=r[0],n=t>>16&32768,a=(t>>23&255)-127+15,i=t&8388607;return a<=0?n:a>=31?n|31743:(i=(i>>13)+(i>>12&1),i===1024&&(i=0,a+=1),n|a<<10|i&1023)}function tn(d,e){let r=new Float32Array(e*256),t=new DataView(d.buffer,d.byteOffset);for(let n=0;n<e;n++){let a=n*144,i=he(t.getUint16(a,!0)),s=he(t.getUint16(a+2,!0)),o=f=>{let p=g=>d[a+4+g];return f<4?[p(f)&63,p(f+4)&63]:[p(f+4)&15|p(f-4)>>6<<4,p(f+4)>>4|p(f)>>6<<4]},u=n*256,c=0,l=0;for(let f=0;f<256;f+=64){let[p,g]=o(c),m=i*p,b=s*g,[k,x]=o(c+1),M=i*k,q=s*x;for(let C=0;C<32;C++){let j=d[a+16+l+C];r[u+f+C]=m*(j&15)-b,r[u+f+32+C]=M*(j>>4)-q}l+=32,c+=2}}return r}function Re(d){return d>127?d-256:d}function rn(d,e){let r=new Float32Array(e*32),t=new DataView(d.buffer,d.byteOffset);for(let n=0;n<e;n++){let a=n*34,i=he(t.getUint16(a,!0));for(let s=0;s<32;s++)r[n*32+s]=i*Re(d[a+2+s])}return r}function nn(d,e){let r=new Float32Array(e*32),t=new DataView(d.buffer,d.byteOffset);for(let n=0;n<e;n++){let a=n*22,i=he(t.getUint16(a,!0)),s=t.getUint32(a+2,!0);for(let o=0;o<16;o++){let u=d[a+6+o],c=s>>>o<<4&16,l=s>>>o+12&16;r[n*32+o]=i*((u&15|c)-16),r[n*32+o+16]=i*((u>>4|l)-16)}}return r}function an(d,e){let r=new Float32Array(e*32),t=new DataView(d.buffer,d.byteOffset);for(let n=0;n<e;n++){let a=n*18,i=he(t.getUint16(a,!0));for(let s=0;s<16;s++){let o=d[a+2+s];r[n*32+s]=i*((o&15)-8),r[n*32+s+16]=i*((o>>4)-8)}}return r}function sn(d,e){let r=new Float32Array(e*256),t=new DataView(d.buffer,d.byteOffset);for(let n=0;n<e;n++){let a=n*176,i=he(t.getUint16(a,!0)),s=he(t.getUint16(a+2,!0)),o=g=>{let m=b=>d[a+4+b];return g<4?[m(g)&63,m(g+4)&63]:[m(g+4)&15|m(g-4)>>6<<4,m(g+4)>>4|m(g)>>6<<4]},u=n*256,c=0,l=0,f=1,p=2;for(let g=0;g<256;g+=64){let[m,b]=o(c),k=i*m,x=s*b,[M,q]=o(c+1),C=i*M,j=s*q;for(let A=0;A<32;A++){let w=d[a+48+l+A],v=d[a+16+A];r[u+g+A]=k*((w&15)+(v&f?16:0))-x,r[u+g+32+A]=C*((w>>4)+(v&p?16:0))-j}l+=32,c+=2,f<<=2,p<<=2}}return r}function on(d,e){let r=new Float32Array(e*256),t=new DataView(d.buffer,d.byteOffset);for(let n=0;n<e;n++){let a=n*210,i=he(t.getUint16(a+208,!0)),s=n*256;for(let o=0;o<2;o++){let u=a+o*64,c=a+128+o*32,l=a+192+o*8,f=s+o*128;for(let p=0;p<32;p++){let g=p/16|0,m=d[u+p],b=d[u+p+32],k=d[c+p],x=(m&15|(k>>0&3)<<4)-32,M=(b&15|(k>>2&3)<<4)-32,q=(m>>4|(k>>4&3)<<4)-32,C=(b>>4|(k>>6&3)<<4)-32;r[f+p]=i*Re(d[l+g])*x,r[f+p+32]=i*Re(d[l+g+2])*M,r[f+p+64]=i*Re(d[l+g+4])*q,r[f+p+96]=i*Re(d[l+g+6])*C}}}return r}function Fe(d,e,r,t,n){let a=new Float32Array(r*n);for(let i=0;i<r;i++)for(let s=0;s<n;s++){let o=0;for(let u=0;u<t;u++)o+=d[i*t+u]*e[u*n+s];a[i*n+s]=o}return a}function Ge(d,e,r,t,n=1e-5,a=!1){let i=new Float32Array(r*t);for(let s=0;s<r;s++){let o=0;for(let c=0;c<t;c++)o+=d[s*t+c]**2;let u=1/Math.sqrt(o/t+n);for(let c=0;c<t;c++)i[s*t+c]=d[s*t+c]*u*(a?1+e[c]:e[c])}return i}function un(d,e,r,t,n,a,i){let s=new Float32Array(d.length),o=t/2,u=a[0],c=a[0]+a[1];for(let l=0;l<r;l++){let f=Math.floor(l/n),p=l*t;for(let g=0;g<o;g++){let m=g<u?0:g<c?1:2,k=e[f*3+m]/i**(2*g/t),x=Math.cos(k),M=Math.sin(k),q=d[p+g],C=d[p+g+o];s[p+g]=q*x-C*M,s[p+g+o]=C*x+q*M}}return s}function Ve(d,e,r,t,n=0,a=1e4,i){let s=new Float32Array(d.length),o=r/2;for(let u=0;u<e;u++){let c=n+Math.floor(u/t),l=u*r;for(let f=0;f<o;f++){let p=c/(a**(2*f/r)*(i?i[f]:1)),g=Math.cos(p),m=Math.sin(p),b=d[l+2*f],k=d[l+2*f+1];s[l+2*f]=b*g-k*m,s[l+2*f+1]=k*g+b*m}}return s}function cn(d,e,r,t,n,a=0,i=1e4){let s=new Float32Array(d.length),o=t/2;for(let u=0;u<r;u++){let c=a+Math.floor(u/n),l=u*t;for(let f=0;f<o;f++){let p=c/(i**(2*f/t)*e[f]),g=Math.cos(p),m=Math.sin(p),b=d[l+f],k=d[l+f+o];s[l+f]=b*g-k*m,s[l+f+o]=k*g+b*m}}return s}function Le(d,e,r,t,n=0,a=1e4){let i=new Float32Array(d.length),s=r/2;for(let o=0;o<e;o++){let u=n+Math.floor(o/t),c=o*r;for(let l=0;l<s;l++){let f=u/a**(2*l/r),p=Math.cos(f),g=Math.sin(f),m=d[c+l],b=d[c+l+s];i[c+l]=m*p-b*g,i[c+l+s]=b*p+m*g}}return i}function ct(d,e,r){return d.map((t,n)=>t+e[n%r])}function lt(d,e,r,t=!0){let n=t?d.windowPerLayer?.[r]??d.window??0:0,a=d.ropeThetaPerLayer?.[r]??d.ropeTheta,i=d.skipRopePerLayer?.[r]??d.skipRope??!1;return{...d,seq:e,window:n,ropeTheta:a,skipRope:i}}function ge(d,e,r,t,n,a,i,s=0,o,u=0,c=0){let l=new Float32Array(t*n*i),f=o??1/Math.sqrt(i),p=m=>u>0?u*Math.tanh(m/u):m,g=n/a;for(let m=0;m<t;m++)for(let b=0;b<n;b++){let k=Math.floor(b/g),x=(m*n+b)*i,M=s+m,q=c>0?Math.max(0,M+1-c):0,C=[],j=-1/0;for(let w=q;w<=M;w++){let v=(w*a+k)*i,h=0;for(let y=0;y<i;y++)h+=d[x+y]*e[v+y];let _=p(h*f);C[w]=_,_>j&&(j=_)}let A=0;for(let w=q;w<=M;w++)C[w]=Math.exp(C[w]-j),A+=C[w];for(let w=q;w<=M;w++){let v=C[w]/A,h=(w*a+k)*i;for(let _=0;_<i;_++)l[x+_]+=v*r[h+_]}}return l}function ir(d){return .5*d*(1+Math.tanh(.7978845608*(d+.044715*d*d*d)))}function dt(d,e,r){let{seq:t,d:n,nHeads:a,nKvHeads:i,headDim:s,ffn:o,ropeTheta:u,eps:c}=e,l=i*s,f=a*s,p=e.rmsGainOnePlus===!0,g=e.attnLogitSoftcap??0,m=Ge(d,r.attnNorm,t,n,c,p),b=Fe(m,r.wq,t,n,f),k=Fe(m,r.wk,t,n,l),x=Fe(m,r.wv,t,n,l);r.bq&&(b=ct(b,r.bq,f)),r.bk&&(k=ct(k,r.bk,l)),r.bv&&(x=ct(x,r.bv,l)),r.qNorm&&(b=Ge(b,r.qNorm,t*a,s,c,p)),r.kNorm&&(k=Ge(k,r.kNorm,t*i,s,c,p));let M=Le(b,t*a,s,a,0,u),q=Le(k,t*i,s,i,0,u),C=ge(M,q,x,t,a,i,s,0,e.attnScale,g),j=Fe(C,r.wo,t,f,n);r.postAttnNorm&&(j=Ge(j,r.postAttnNorm,t,n,c,p));let A=d.map((P,U)=>P+j[U]),w=Ge(A,r.ffnNorm,t,n,c,p),v=Fe(w,r.wgate,t,n,o),h=Fe(w,r.wup,t,n,o),_=e.act==="gelu"?v.map((P,U)=>ir(P)*h[U]):v.map((P,U)=>P/(1+Math.exp(-P))*h[U]),y=Fe(_,r.wdown,t,o,n);return r.postFfnNorm&&(y=Ge(y,r.postFfnNorm,t,n,c,p)),A.map((P,U)=>P+y[U])}var ee,X,$e,or=te(()=>{"use strict";it();ot();Zt();rr();nr();sr();ee=64,X=class X{constructor(){this.device=null;this.modules={};this.pipelines={};this.maxStorageBufferBindingSize=0;this.hasF16=!1;this.validationFailure=null;this.lost=!1;this.onLost=null;this.attnDecodeOk=!0;this.attnPrefillOk=!0;this.attnFullWgOk=!0;this.mropeOk=!0;this.rwkvWkv7Ok=!0;this.lfm2ShortConvOk=!0;this.lfm2ResidentOk=!0;this.lfm2BatchOk=!0;this.swaOk=!0;this.rwkvResidentOk=!0;this.videoOk=!0;this.videoResidentOk=!0;this.f16SharedOk=!0;this.qSharedOk=!0;this.gemvOk=!0;this.rmsVecOk=!0;this.topKParOk=!0;this.profiler=null;this.bufferPool=new Map;this.poolSize=new WeakMap;this.pooled=new WeakSet;this.uniformPool=new Map;this.uniformSize=new WeakMap;this.convTiledOk=!0;this.kvGpu=new Map;this.topKOk=!0;this.kvSession="";this.kvQuant=!1;this.lfm2KvGpu=new Map;this.lfm2ConvGpu=new Map;this.lfm2Session="";this.rwkvStateGpu=new Map;this.rwkvVFirst=null;this.rwkvSession=""}async init(){let e=navigator.gpu;if(!e)return!1;let r=await e.requestAdapter();if(!r)return!1;let t=r.limits,n={maxStorageBufferBindingSize:t.maxStorageBufferBindingSize,maxBufferSize:t.maxBufferSize},a=[];try{r.features?.has("shader-f16")&&a.push("shader-f16")}catch{}try{X.profileOn&&r.features?.has("timestamp-query")&&a.push("timestamp-query")}catch{}try{this.device=await r.requestDevice({requiredLimits:n,requiredFeatures:a})}catch{try{this.device=await r.requestDevice({requiredLimits:n})}catch{this.device=await r.requestDevice()}}this.maxStorageBufferBindingSize=this.device.limits?.maxStorageBufferBindingSize??134217728,this.hasF16=!!this.device.features?.has?.("shader-f16"),X.profileOn&&(this.device.features?.has?.("timestamp-query")?(this.profiler=new Qe(this.device),console.info("[webgpu] profilage par passe ACTIF (?gpuprofile=1) \u2014 __gpuProfile() pour le rapport")):console.warn("[webgpu] ?gpuprofile=1 demand\xE9 mais la feature timestamp-query est ABSENTE de cet adapter \u2014 aucune mesure ne sera prise."));try{ie("attndecode")==="0"&&(this.attnDecodeOk=!1,console.warn("[webgpu] attention d\xE9codage COUP\xC9E par ?attndecode=0 \u2014 kernels classiques")),ie("attnfullwg")==="0"&&(this.attnFullWgOk=!1,console.warn("[webgpu] attention_full workgroup COUP\xC9E par ?attnfullwg=0 \u2014 kernel classique")),ie("attnprefill")==="0"&&(this.attnPrefillOk=!1,console.warn("[webgpu] attention prefill tuil\xE9e COUP\xC9E par ?attnprefill=0 \u2014 kernel classique")),ie("rmsvec")==="0"&&(this.rmsVecOk=!1,console.warn("[webgpu] RMSNorm parall\xE8le COUP\xC9E par ?rmsvec=0 \u2014 kernel une-ligne-par-thread")),ie("topkpar")==="0"&&(this.topKParOk=!1,console.warn("[webgpu] top-K parall\xE8le COUP\xC9E par ?topkpar=0 \u2014 s\xE9lection finale sur un seul thread")),ie("rwkv")==="0"&&(this.rwkvWkv7Ok=!1,console.warn("[webgpu] kernel RWKV-7 WKV COUP\xC9 par ?rwkv=0")),ie("lfm2")==="0"&&(this.lfm2ShortConvOk=!1,console.warn("[webgpu] kernel shortconv LFM2 COUP\xC9 par ?lfm2=0")),ie("lfm2resident")==="0"&&(this.lfm2ResidentOk=!1,console.warn("[webgpu] LFM2 r\xE9sident COUP\xC9 par ?lfm2resident=0 \u2014 forwardToken JS+readback")),ie("lfm2batch")==="0"&&(this.lfm2BatchOk=!1,console.warn("[webgpu] prefill LFM2 batch\xE9 COUP\xC9 par ?lfm2batch=0 \u2014 token par token")),ie("swa")==="0"&&(this.swaOk=!1,console.warn("[webgpu] fen\xEAtre glissante COUP\xC9E par ?swa=0 \u2014 attention causale pleine sur toutes les couches")),ie("rwkvresident")==="0"&&(this.rwkvResidentOk=!1,console.warn("[webgpu] RWKV r\xE9sident COUP\xC9 par ?rwkvresident=0 \u2014 forwardToken JS+readback")),ie("video")==="0"&&(this.videoOk=!1,console.warn("[webgpu] chemin vid\xE9o (module motion) COUP\xC9 par ?video=0")),ie("f16shared")==="0"&&(this.f16SharedOk=!1,console.warn("[webgpu] GEMM f16 tuil\xE9 COUP\xC9 par ?f16shared=0 \u2014 matmul_t_f16w pour tous les m")),ie("gemv")==="0"&&(this.gemvOk=!1,console.warn("[webgpu] GEMV de d\xE9codage COUP\xC9 par ?gemv=0 \u2014 kernels par lignes")),ie("qshared")==="0"&&(this.qSharedOk=!1,console.warn("[webgpu] GEMM q8/q4 tuil\xE9s COUP\xC9S par ?qshared=0 \u2014 kernels 4 lignes/invocation")),ie("videoresident")==="0"&&(this.videoResidentOk=!1,console.warn("[webgpu] motion r\xE9sident COUP\xC9 par ?videoresident=0 \u2014 chemin JS+readback"))}catch{}this.device.lost?.then?.(i=>{this.lost=!0,console.warn("[webgpu] device GPU perdu :",i?.reason||"unknown",i?.message||""),this.onLost?.(i)});for(let[i,s]of Object.entries(er))this.modules[i]=this.device.createShaderModule({code:s});return this.hasF16&&(this.modules.matmul_t_f16w=this.device.createShaderModule({code:tr})),!0}buf(e,r){let t=this.device.createBuffer({size:e.byteLength,usage:r});return this.device.queue.writeBuffer(t,0,e),t}bufU32(e,r){let t=this.device.createBuffer({size:e.byteLength,usage:r});return this.device.queue.writeBuffer(t,0,e),t}async readBack(e,r){let t=globalThis,n=this.device.createBuffer({size:r,usage:t.GPUBufferUsage.COPY_DST|t.GPUBufferUsage.MAP_READ}),a=this.device.createCommandEncoder();a.copyBufferToBuffer(e,0,n,0,r),this.device.queue.submit([a.finish()]),await n.mapAsync(t.GPUMapMode.READ);let i=new Float32Array(n.getMappedRange().slice(0));return n.unmap(),n.destroy(),i}async readBackBytes(e,r){let t=globalThis,n=Math.ceil(r/4)*4,a=this.device.createBuffer({size:n,usage:t.GPUBufferUsage.COPY_DST|t.GPUBufferUsage.MAP_READ}),i=this.device.createCommandEncoder();i.copyBufferToBuffer(e,0,a,0,n),this.device.queue.submit([i.finish()]),await a.mapAsync(t.GPUMapMode.READ);let s=new Uint8Array(a.getMappedRange().slice(0,r));return a.unmap(),a.destroy(),s}async quantizeToBytes(e,r,t,n,a){let i=t/32,s=n==="q8"?new Uint8Array(t+i*2):new Uint8Array(t/2+i*4),o=X.BLOCK_ELEMS[e]??1,u=t/o,c=r.byteLength/u,l=(m,b)=>b===0?m:l(b,m%b),f=o*32/l(o,32),p=Math.floor(this.maxStorageBufferBindingSize*.9/4),g=a??p;g=Math.max(f,Math.floor(g/f)*f);for(let m=0;m<t;m+=g){let b=Math.min(g,t-m),k=r.slice(m/o*c,(m+b)/o*c),x=this.dequantizeToGpu(e,k,b);try{if(n==="q8"){let{codes:M,sc:q}=this.f32ToQ8Gpu(x,b),C=await this.readBackBytes(M,b),j=await this.readBackBytes(q,b/32*2);M.destroy?.(),q.destroy?.(),s.set(C,m),s.set(j,t+m/32*2)}else{let{nib:M,sc:q,mn:C}=this.f32ToQ4Gpu(x,b),j=await this.readBackBytes(M,b/2),A=await this.readBackBytes(q,b/32*2),w=await this.readBackBytes(C,b/32*2);M.destroy?.(),q.destroy?.(),C.destroy?.(),s.set(j,m/2),s.set(A,t/2+m/32*2),s.set(w,t/2+i*2+m/32*2)}}finally{x.destroy?.()}}return s}pipeline(e){let r=this.pipelines[e];return r||(r=this.device.createComputePipeline({layout:"auto",compute:{module:this.modules[e],entryPoint:"main"}}),this.pipelines[e]=r),r}grid1D(e){let r=Math.ceil(e/ee);if(r<=X.MAX_WG_DIM)return[r,1,1];let t=X.MAX_WG_DIM;return[t,Math.ceil(r/t),1]}recordPass(e,r,t,n){let a=this.pipeline(r),i=this.device.createBindGroup({layout:a.getBindGroupLayout(0),entries:t.map((u,c)=>({binding:c,resource:{buffer:u}}))}),s=this.profiler?.slot(r),o=e.beginComputePass(s?{timestampWrites:s}:void 0);o.setPipeline(a),o.setBindGroup(0,i),o.dispatchWorkgroups(...n),o.end()}dispatch(e,r,t){let n=this.device.createCommandEncoder();this.recordPass(n,e,r,t),this.device.queue.submit([n.finish()])}async run(e,r,t,n,a){return this.dispatch(e,r,t),this.readBack(n,a)}isF32(e){return e instanceof Float32Array}async matmul(e,r,t,n,a){let i=globalThis,s=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([t,n,a]));let u=this.isF32(r)?this.buf(r,s):r,c=this.device.createBuffer({size:t*a*4,usage:s|i.GPUBufferUsage.COPY_SRC});return this.run("matmul",[o,this.buf(e,s),u,c],[Math.ceil(t/8),Math.ceil(a/8),1],c,t*a*4)}async matmulT(e,r,t,n,a,i=!1){let s=globalThis,o=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([t,n,a]));let c=this.isF32(r)?this.buf(r,o):r,l=this.device.createBuffer({size:t*a*4,usage:o|s.GPUBufferUsage.COPY_SRC}),f=this.matmulTPlan(t,n,a,i);return this.run(f.shader,[u,this.buf(e,o),c,l],f.grid,l,t*a*4)}matmulTPlan(e,r,t,n){return n&&this.hasF16?this.f16SharedOk&&e>=32&&r%4===0?{shader:"matmul_t_f16w_shared",grid:[Math.ceil(t/64),Math.ceil(e/32),1]}:{shader:"matmul_t_f16w",grid:[Math.ceil(e/8),Math.ceil(t/8),1]}:{shader:r%4===0?"matmul_t_vec4":"matmul_t",grid:[Math.ceil(e/8),Math.ceil(t/8),1]}}async rmsnorm(e,r,t,n,a=1e-5,i=!1){let s=globalThis,o=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([t,n])),this.device.queue.writeBuffer(u,8,new Float32Array([a])),this.device.queue.writeBuffer(u,12,new Uint32Array([i?1:0]));let c=this.device.createBuffer({size:e.byteLength,usage:o|s.GPUBufferUsage.COPY_SRC});return this.run("rmsnorm",[u,this.buf(e,o),this.buf(r,o),c],[Math.ceil(t/ee),1,1],c,e.byteLength)}async topKReadback(e,r,t){let n=globalThis,a=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST,i=this.device.createBuffer({size:8,usage:n.GPUBufferUsage.UNIFORM|n.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(i,0,new Uint32Array([e.length,r]));let s=this.device.createBuffer({size:r*2*4,usage:a|n.GPUBufferUsage.COPY_SRC}),o=this.device.createBuffer({size:r*2*4,usage:n.GPUBufferUsage.COPY_DST|n.GPUBufferUsage.MAP_READ}),u=this.device.createCommandEncoder(),c=this.buf(e,a);this.recordPass(u,t,[i,c,s],[1,1,1]),u.copyBufferToBuffer(s,0,o,0,r*2*4),this.device.queue.submit([u.finish()]),await o.mapAsync(n.GPUMapMode.READ);let l=new Uint32Array(o.getMappedRange().slice(0));return o.unmap(),o.destroy(),s.destroy?.(),i.destroy?.(),c.destroy?.(),l}async rmsnormVec(e,r,t,n,a=1e-5,i=!1){let s=globalThis,o=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([t,n])),this.device.queue.writeBuffer(u,8,new Float32Array([a])),this.device.queue.writeBuffer(u,12,new Uint32Array([i?1:0]));let c=this.device.createBuffer({size:e.byteLength,usage:o|s.GPUBufferUsage.COPY_SRC});return this.run("rmsnorm_vec",[u,this.buf(e,o),this.buf(r,o),c],[t,1,1],c,e.byteLength)}async binary(e,r,t){let n=globalThis,a=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST,i=this.device.createBuffer({size:r.byteLength,usage:a|n.GPUBufferUsage.COPY_SRC});return this.run(e,[this.buf(r,a),this.buf(t,a),i],this.grid1D(r.length),i,r.byteLength)}swiglu(e,r){return this.binary("swiglu",e,r)}geglu(e,r){return this.binary("geglu",e,r)}add(e,r){return this.binary("add",e,r)}async silu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("silu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async groupNorm(e,r,t,n,a,i,s=1e-5){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([n,a,i])),this.device.queue.writeBuffer(c,12,new Float32Array([s]));let l=this.device.createBuffer({size:e.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("group_norm",[c,this.buf(e,u),this.buf(r,u),this.buf(t,u),l],[i,1,1],l,e.byteLength)}async conv2d(e,r,t,n,a,i,s,o,u,c=1,l=0){let f=globalThis,p=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,g=Math.floor((a+2*l-o)/c)+1,m=Math.floor((i+2*l-u)/c)+1,b=n*o*u,k=g*m;if(b*k*4>this.maxStorageBufferBindingSize*.9)return this.conv2dDirect(e,r,t,n,a,i,s,o,u,c,l);let x=this.device.createBuffer({size:48,usage:f.GPUBufferUsage.UNIFORM|f.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(x,0,new Uint32Array([n,a,i,o,u,c,l,g,m]));let M=this.device.createBuffer({size:b*k*4,usage:p|f.GPUBufferUsage.COPY_SRC});this.dispatch("im2col",[x,this.buf(e,p),M],this.grid1D(b*k));let q=await this.matmul(r,M,s,b,k);if(M.destroy?.(),x.destroy?.(),t)for(let C=0;C<s;C++){let j=t[C];for(let A=0;A<k;A++)q[C*k+A]+=j}return q}async conv2dDirect(e,r,t,n,a,i,s,o,u,c=1,l=0){let f=globalThis,p=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,g=Math.floor((a+2*l-o)/c)+1,m=Math.floor((i+2*l-u)/c)+1,b=s*g*m,k=this.device.createBuffer({size:48,usage:f.GPUBufferUsage.UNIFORM|f.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(k,0,new Uint32Array([n,a,i,s,o,u,c,l,g,m]));let x=t??new Float32Array(s),M=this.device.createBuffer({size:b*4,usage:p|f.GPUBufferUsage.COPY_SRC});return this.run("conv2d_direct",[k,this.buf(e,p),this.buf(r,p),this.buf(x,p),M],this.grid1D(b),M,b*4)}async layernorm(e,r,t,n,a,i=1e-5){let s=globalThis,o=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,a])),this.device.queue.writeBuffer(u,8,new Float32Array([i]));let c=this.device.createBuffer({size:e.byteLength,usage:o|s.GPUBufferUsage.COPY_SRC});return this.run("layernorm",[u,this.buf(e,o),this.buf(r,o),this.buf(t,o),c],[Math.ceil(n/ee),1,1],c,e.byteLength)}async quickGelu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("quick_gelu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async gelu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("gelu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async relu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("relu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async upsampleNearest(e,r,t,n,a=2){let i=globalThis,s=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=t*a,u=n*a,c=r*o*u,l=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(l,0,new Uint32Array([r,t,n,a]));let f=this.device.createBuffer({size:c*4,usage:s|i.GPUBufferUsage.COPY_SRC});return this.run("upsample_nearest",[l,this.buf(e,s),f],this.grid1D(c),f,c*4)}async rope(e,r,t,n,a=0,i=1e4,s=!1){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:32,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([r,t,n,a])),this.device.queue.writeBuffer(c,16,new Float32Array([i]));let l=this.device.createBuffer({size:e.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.device.queue.writeBuffer(c,20,new Uint32Array([s?1:0])),this.run("rope",[c,this.buf(e,u),l],[Math.ceil(r/ee),1,1],l,e.byteLength)}async ropeFactors(e,r,t,n,a,i=0,s=1e4,o=!1){let u=globalThis,c=u.GPUBufferUsage.STORAGE|u.GPUBufferUsage.COPY_DST,l=this.device.createBuffer({size:32,usage:u.GPUBufferUsage.UNIFORM|u.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(l,0,new Uint32Array([t,n,a,i])),this.device.queue.writeBuffer(l,16,new Float32Array([s]));let f=this.device.createBuffer({size:r.byteLength,usage:c});this.device.queue.writeBuffer(f,0,r);let p=this.device.createBuffer({size:e.byteLength,usage:c|u.GPUBufferUsage.COPY_SRC});return this.device.queue.writeBuffer(l,20,new Uint32Array([o?1:0])),this.run("rope_factors",[l,this.buf(e,c),f,p],[Math.ceil(t/ee),1,1],p,e.byteLength)}async ropeMrope(e,r,t,n,a,i,s=1e4){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:32,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([t,n,a,i[0],i[0]+i[1]])),this.device.queue.writeBuffer(c,20,new Float32Array([s]));let l=this.device.createBuffer({size:r.byteLength,usage:u});this.device.queue.writeBuffer(l,0,r);let f=this.device.createBuffer({size:e.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("rope_mrope",[c,this.buf(e,u),l,f],[Math.ceil(t/ee),1,1],f,e.byteLength)}async rope2d(e,r,t,n,a,i=1e4){let s=globalThis,o=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:32,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([t,n,a,0])),this.device.queue.writeBuffer(u,16,new Float32Array([i]));let c=this.device.createBuffer({size:r.byteLength,usage:o});this.device.queue.writeBuffer(c,0,r);let l=this.device.createBuffer({size:e.byteLength,usage:o|s.GPUBufferUsage.COPY_SRC});return this.run("rope_2d",[u,this.buf(e,o),c,l],[Math.ceil(t/ee),1,1],l,e.byteLength)}async attention(e,r,t,n,a,i,s,o=0,u,c=0,l=0){let f=globalThis,p=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,g=o+n,m=this.attnUniform(n,a,i,s,g,o,u??1/Math.sqrt(s),c,l),b=n*a*s*4,k=this.device.createBuffer({size:b,usage:p|f.GPUBufferUsage.COPY_SRC});return this.run("attention",[m,this.buf(e,p),this.buf(r,p),this.buf(t,p),k],[Math.ceil(n*a/ee),1,1],k,b)}async attentionDecode(e,r,t,n,a,i,s,o=0,u,c=0,l=0){let f=globalThis,p=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,g=o+n,m=this.attnUniform(n,a,i,s,g,o,u??1/Math.sqrt(s),c,l),b=n*a*s*4,k=this.device.createBuffer({size:b,usage:p|f.GPUBufferUsage.COPY_SRC});return this.run("attention_decode",[m,this.buf(e,p),this.buf(r,p),this.buf(t,p),k],[n*a,1,1],k,b)}async attentionPrefill(e,r,t,n,a,i,s,o=0,u,c=0,l=0){let f=globalThis,p=f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST,g=o+n,m=this.attnUniform(n,a,i,s,g,o,u??1/Math.sqrt(s),c,l),b=n*a*s*4,k=this.device.createBuffer({size:b,usage:p|f.GPUBufferUsage.COPY_SRC});return this.run("attention_prefill",[m,this.buf(e,p),this.buf(r,p),this.buf(t,p),k],[Math.ceil(n/4)*a,1,1],k,b)}async attentionFull(e,r,t,n,a,i,s,o,u,c=0){let l=globalThis,f=l.GPUBufferUsage.STORAGE|l.GPUBufferUsage.COPY_DST,p=this.device.createBuffer({size:32,usage:l.GPUBufferUsage.UNIFORM|l.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(p,0,new Uint32Array([n,a,i,s,o,0])),this.device.queue.writeBuffer(p,24,new Float32Array([u??1/Math.sqrt(s),c]));let g=n*a*s*4,m=this.device.createBuffer({size:g,usage:f|l.GPUBufferUsage.COPY_SRC});return this.run("attention_full",[p,this.buf(e,f),this.buf(r,f),this.buf(t,f),m],[Math.ceil(n*a/ee),1,1],m,g)}async attentionFullWg(e,r,t,n,a,i,s,o,u,c=0){let l=globalThis,f=l.GPUBufferUsage.STORAGE|l.GPUBufferUsage.COPY_DST,p=this.device.createBuffer({size:32,usage:l.GPUBufferUsage.UNIFORM|l.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(p,0,new Uint32Array([n,a,i,s,o,0])),this.device.queue.writeBuffer(p,24,new Float32Array([u??1/Math.sqrt(s),c]));let g=n*a*s*4,m=this.device.createBuffer({size:g,usage:f|l.GPUBufferUsage.COPY_SRC});return this.run("attention_full_wg",[p,this.buf(e,f),this.buf(r,f),this.buf(t,f),m],[n*a,1,1],m,g)}async quantizeKvReadback(e,r,t,n){let a=globalThis,i=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST|a.GPUBufferUsage.COPY_SRC,s=t*n,o=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([r,t,n,0]));let u=this.device.createBuffer({size:r*s,usage:i}),c=this.device.createBuffer({size:r*t*4,usage:i});this.dispatch("quantize_kv",[o,this.buf(e,i),u,c],this.grid1D(r*t));let l=await this.readBack(u,r*s),f=new Uint32Array(l.buffer,0,r*s/4),p=await this.readBack(c,r*t*4);return u.destroy?.(),c.destroy?.(),{codes:f,scales:p}}async attentionQ8Kv(e,r,t,n,a,i,s,o,u,c=0,l,f=0,p=0){let g=globalThis,m=g.GPUBufferUsage.STORAGE|g.GPUBufferUsage.COPY_DST,b=c+i,k=this.attnUniform(i,s,o,u,b,c,l??1/Math.sqrt(u),f,p),x=i*s*u*4,M=this.device.createBuffer({size:x,usage:m|g.GPUBufferUsage.COPY_SRC});return this.run("attention_q8kv",[k,this.buf(e,m),this.bufU32(r,m),this.buf(t,m),this.bufU32(n,m),this.buf(a,m),M],[Math.ceil(i*s/ee),1,1],M,x)}async attentionQ8KvDecode(e,r,t,n,a,i,s,o,u,c=0,l,f=0,p=0){let g=globalThis,m=g.GPUBufferUsage.STORAGE|g.GPUBufferUsage.COPY_DST,b=c+i,k=this.attnUniform(i,s,o,u,b,c,l??1/Math.sqrt(u),f,p),x=i*s*u*4,M=this.device.createBuffer({size:x,usage:m|g.GPUBufferUsage.COPY_SRC});return this.run("attention_decode_q8kv",[k,this.buf(e,m),this.bufU32(r,m),this.buf(t,m),this.bufU32(n,m),this.buf(a,m),M],[i*s,1,1],M,x)}async attentionQ8KvPrefill(e,r,t,n,a,i,s,o,u,c=0,l,f=0,p=0){let g=globalThis,m=g.GPUBufferUsage.STORAGE|g.GPUBufferUsage.COPY_DST,b=c+i,k=this.attnUniform(i,s,o,u,b,c,l??1/Math.sqrt(u),f,p),x=i*s*u*4,M=this.device.createBuffer({size:x,usage:m|g.GPUBufferUsage.COPY_SRC});return this.run("attention_prefill_q8kv",[k,this.buf(e,m),this.bufU32(r,m),this.buf(t,m),this.bufU32(n,m),this.buf(a,m),M],[Math.ceil(i/4)*s,1,1],M,x)}async addBias(e,r,t,n){let a=globalThis,i=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,s=this.device.createBuffer({size:8,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(s,0,new Uint32Array([t,n]));let o=this.device.createBuffer({size:e.byteLength,usage:i|a.GPUBufferUsage.COPY_SRC});return this.run("addbias",[s,this.buf(e,i),this.buf(r,i),o],this.grid1D(e.length),o,e.byteLength)}async dequantBlocked(e,r,t,n){let a=globalThis,i=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,s=t/n;if(!Number.isInteger(s))throw new Error(`${e}: nElems ${t} not a multiple of ${n}`);let o=r.byteLength%4===0?r:(()=>{let f=new Uint8Array(Math.ceil(r.byteLength/4)*4);return f.set(r),f})(),u=new Uint32Array(o.buffer,o.byteOffset,o.byteLength/4),c=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s]));let l=this.device.createBuffer({size:t*4,usage:i|a.GPUBufferUsage.COPY_SRC});return this.run(e,[c,this.bufU32(u,i),l],this.grid1D(s),l,t*4)}async dequantizeQ4K(e,r){return this.dequantBlocked("dequant_q4k",e,r,256)}async dequantizeByType(e,r,t){if(e==="F32")return new Float32Array(r.buffer,r.byteOffset,t);if(e==="F16"){let i=new DataView(r.buffer,r.byteOffset),s=new Float32Array(t);for(let o=0;o<t;o++)s[o]=he(i.getUint16(o*2,!0));return s}if(e==="Q4W")return pe(Ue(r,t));if(e==="Q8W")return we(Be(r,t));if(e==="Q3W")return We(ut(r,t));let n=X.DEQUANT_SHADER[e],a=X.BLOCK_ELEMS[e];if(!n||!a)throw new Error(`dequant: unsupported GGML type ${e}`);return this.dequantBlocked(n,r,t,a)}dequantBlockedGpu(e,r,t,n){let a=globalThis,i=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,s=t/n;if(!Number.isInteger(s))throw new Error(`${e}: nElems ${t} not a multiple of ${n}`);let o=r.byteLength%4===0?r:(()=>{let f=new Uint8Array(Math.ceil(r.byteLength/4)*4);return f.set(r),f})(),u=new Uint32Array(o.buffer,o.byteOffset,o.byteLength/4),c=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s]));let l=this.device.createBuffer({size:t*4,usage:i});return this.dispatch(e,[c,this.bufU32(u,i),l],this.grid1D(s)),l}dequantizeToGpu(e,r,t){let n=globalThis,a=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST;if(e==="F32")return this.buf(new Float32Array(r.buffer,r.byteOffset,t),a);if(e==="F16"){let o=new DataView(r.buffer,r.byteOffset),u=new Float32Array(t);for(let c=0;c<t;c++)u[c]=he(o.getUint16(c*2,!0));return this.buf(u,a)}if(e==="Q4W")return this.buf(pe(Ue(r,t)),a);if(e==="Q8W")return this.buf(we(Be(r,t)),a);if(e==="Q3W")return this.buf(We(ut(r,t)),a);let i=X.DEQUANT_SHADER[e],s=X.BLOCK_ELEMS[e];if(!i||!s)throw new Error(`dequant: unsupported GGML type ${e}`);return this.dequantBlockedGpu(i,r,t,s)}async layerForward(e,r,t,n=!1){let{seq:a,d:i,nHeads:s,nKvHeads:o,headDim:u,ffn:c,ropeTheta:l,eps:f}=r,p=o*u,g=n?(F,T,D,O,R)=>this.matmulT(F,T,D,O,R):(F,T,D,O,R)=>this.matmul(F,T,D,O,R),m=s*u,b=r.rmsGainOnePlus===!0,k=r.attnLogitSoftcap??0,x=(F,T)=>r.act==="gelu"?this.geglu(F,T):this.swiglu(F,T),M=await this.rmsnorm(e,t.attnNorm,a,i,f,b),q=await g(M,t.wq,a,i,m),C=await g(M,t.wk,a,i,p),j=await g(M,t.wv,a,i,p);t.bq&&(q=await this.addBias(q,t.bq,a,m)),t.bk&&(C=await this.addBias(C,t.bk,a,p)),t.bv&&(j=await this.addBias(j,t.bv,a,p)),t.qNorm&&(q=await this.rmsnorm(q,t.qNorm,a*s,u,f,b)),t.kNorm&&(C=await this.rmsnorm(C,t.kNorm,a*o,u,f,b));let A=await this.rope(q,a*s,u,s,0,l),w=await this.rope(C,a*o,u,o,0,l),v=await this.attention(A,w,j,a,s,o,u,0,r.attnScale,k),h=await g(v,t.wo,a,m,i);t.postAttnNorm&&(h=await this.rmsnorm(h,t.postAttnNorm,a,i,f,b));let _=await this.add(e,h),y=await this.rmsnorm(_,t.ffnNorm,a,i,f,b),P=await g(y,t.wgate,a,i,c),U=await g(y,t.wup,a,i,c),B=await x(P,U),G=await g(B,t.wdown,a,c,i);return t.postFfnNorm&&(G=await this.rmsnorm(G,t.postFfnNorm,a,i,f,b)),this.add(_,G)}async layerForwardKV(e,r,t,n,a,i,s=!1){let{seq:o,d:u,nHeads:c,nKvHeads:l,headDim:f,ffn:p,ropeTheta:g,eps:m}=r,b=l*f,k=s?($,V,I,W,S)=>this.matmulT($,V,I,W,S):($,V,I,W,S)=>this.matmul($,V,I,W,S),x=($,V)=>{let I=new Float32Array($.length+V.length);return I.set($),I.set(V,$.length),I},M=c*f,q=r.rmsGainOnePlus===!0,C=r.attnLogitSoftcap??0,j=($,V)=>r.act==="gelu"?this.geglu($,V):this.swiglu($,V),A=await this.rmsnorm(e,t.attnNorm,o,u,m,q),w=await k(A,t.wq,o,u,M),v=await k(A,t.wk,o,u,b),h=await k(A,t.wv,o,u,b);t.bq&&(w=await this.addBias(w,t.bq,o,M)),t.bk&&(v=await this.addBias(v,t.bk,o,b)),t.bv&&(h=await this.addBias(h,t.bv,o,b)),t.qNorm&&(w=await this.rmsnorm(w,t.qNorm,o*c,f,m,q)),t.kNorm&&(v=await this.rmsnorm(v,t.kNorm,o*l,f,m,q));let _=await this.rope(w,o*c,f,c,n,g),y=await this.rope(v,o*l,f,l,n,g),P=x(a,y),U=x(i,h),B=await this.attention(_,P,U,o,c,l,f,n,r.attnScale,C),G=await k(B,t.wo,o,M,u);t.postAttnNorm&&(G=await this.rmsnorm(G,t.postAttnNorm,o,u,m,q));let F=await this.add(e,G),T=await this.rmsnorm(F,t.ffnNorm,o,u,m,q),D=await k(T,t.wgate,o,u,p),O=await k(T,t.wup,o,u,p),R=await j(D,O),E=await k(R,t.wdown,o,p,u);return t.postFfnNorm&&(E=await this.rmsnorm(E,t.postFfnNorm,o,u,m,q)),{out:await this.add(F,E),k:P,v:U}}storage(e){let r=this.bufferPool.get(e);if(r&&r.length){let n=r.pop();return this.pooled.delete(n),n}let t=this.device.createBuffer({size:e,usage:X.STORAGE_USAGE});return this.poolSize.set(t,e),t}release(e){for(let r of e){if(!r)continue;let t=this.poolSize.get(r);if(t!==void 0){if(this.pooled.has(r))continue;this.pooled.add(r);let a=this.bufferPool.get(t);a||(a=[],this.bufferPool.set(t,a)),a.push(r);continue}let n=this.uniformSize.get(r);if(n!==void 0){if(this.pooled.has(r))continue;this.pooled.add(r);let a=this.uniformPool.get(n);a||(a=[],this.uniformPool.set(n,a)),a.push(r);continue}r.destroy?.()}}uploadGpu(e){return e instanceof Float32Array?this.buf(e,X.STORAGE_USAGE):this.f16ToF32Gpu(e.f16,e.n)}uploadGpuF16(e){let r=new Uint16Array(e.length);for(let t=0;t<e.length;t++)r[t]=qe(e[t]);return this.bufU16(r)}f32ToF16Gpu(e,r){let t=globalThis,n=Math.ceil(r/2),a=this.device.createBuffer({size:n*4,usage:X.STORAGE_USAGE}),i=this.device.createBuffer({size:16,usage:t.GPUBufferUsage.UNIFORM|t.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(i,0,new Uint32Array([n])),this.dispatch("packf16",[i,e,a],this.grid1D(n)),a}f32ToQ8Gpu(e,r){let t=globalThis,n=r/32,a=this.device.createBuffer({size:r,usage:X.STORAGE_USAGE}),i=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:X.STORAGE_USAGE}),s=this.device.createBuffer({size:16,usage:t.GPUBufferUsage.UNIFORM|t.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(s,0,new Uint32Array([n])),this.dispatch("quantize_q8",[s,e,a,i],this.grid1D(n)),{codes:a,sc:i}}f32ToQ4Gpu(e,r){let t=globalThis,n=r/32,a=this.device.createBuffer({size:r/2,usage:X.STORAGE_USAGE}),i=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:X.STORAGE_USAGE}),s=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:X.STORAGE_USAGE}),o=this.device.createBuffer({size:16,usage:t.GPUBufferUsage.UNIFORM|t.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(o,0,new Uint32Array([n])),this.dispatch("quantize_q4",[o,e,a,i,s],this.grid1D(n)),{nib:a,sc:i,mn:s}}uploadGpuRawF16(e){let r=Math.ceil(e.byteLength/4)*4,t=this.device.createBuffer({size:r,usage:X.STORAGE_USAGE});if(this.device.queue.writeBuffer(t,0,e,0,e.byteLength-e.byteLength%4),e.byteLength%4){let n=new Uint8Array(4);n.set(e.subarray(e.byteLength-e.byteLength%4)),this.device.queue.writeBuffer(t,e.byteLength-e.byteLength%4,n)}return t}bufU16(e){let r=this.device.createBuffer({size:e.byteLength,usage:X.STORAGE_USAGE});return this.device.queue.writeBuffer(r,0,e),r}uploadGpuRaw(e){let r=Math.ceil(e.byteLength/4)*4,t=this.device.createBuffer({size:r,usage:X.STORAGE_USAGE}),n=e.byteLength-e.byteLength%4;if(this.device.queue.writeBuffer(t,0,e,0,n),e.byteLength%4){let a=new Uint8Array(4);a.set(e.subarray(n)),this.device.queue.writeBuffer(t,n,a)}return t}async matmulQ4(e,r,t,n,a,i,s){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([a,i,s]));let l=this.device.createBuffer({size:a*s*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4",[c,this.buf(e,u),r,t,n,l],[Math.ceil(a/8),Math.ceil(s/8),1],l,a*s*4)}async matmulQ4Tiled(e,r,t,n,a,i,s){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([a,i,s]));let l=this.device.createBuffer({size:a*s*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_tiled",[c,this.buf(e,u),r,t,n,l],[Math.ceil(Math.ceil(a/4)/8),Math.ceil(s/8),1],l,a*s*4)}async matmulQ4Shared(e,r,t,n,a,i,s){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([a,i,s]));let l=this.device.createBuffer({size:a*s*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_shared",[c,this.buf(e,u),r,t,n,l],[Math.ceil(s/64),Math.ceil(a/32),1],l,a*s*4)}async matmulQ3(e,r,t,n,a,i,s,o){let u=globalThis,c=u.GPUBufferUsage.STORAGE|u.GPUBufferUsage.COPY_DST,l=this.device.createBuffer({size:16,usage:u.GPUBufferUsage.UNIFORM|u.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(l,0,new Uint32Array([i,s,o]));let f=this.device.createBuffer({size:i*o*4,usage:c|u.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q3",[l,this.buf(e,c),r,t,n,a,f],[Math.ceil(i/8),Math.ceil(o/8),1],f,i*o*4)}async rwkvWkv7(e,r,t,n,a,i,s,o,u){let c=globalThis,l=c.GPUBufferUsage.STORAGE|c.GPUBufferUsage.COPY_DST,f=this.device.createBuffer({size:8,usage:c.GPUBufferUsage.UNIFORM|c.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(f,0,new Uint32Array([o,u]));let p=this.device.createBuffer({size:e.byteLength,usage:l|c.GPUBufferUsage.COPY_SRC});this.device.queue.writeBuffer(p,0,e);let g=this.device.createBuffer({size:o*u*4,usage:l|c.GPUBufferUsage.COPY_SRC});this.dispatch("rwkv_wkv7",[f,this.buf(r,l),this.buf(t,l),this.buf(n,l),this.buf(a,l),this.buf(i,l),this.buf(s,l),p,g],this.grid1D(o*u));let m=await this.readBack(p,e.byteLength),b=await this.readBack(g,o*u*4);return p.destroy?.(),g.destroy?.(),{S:m,y:b}}async rwkvTokenShift(e,r,t,n){let a=globalThis,i=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,s=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(s,0,new Uint32Array([n]));let o=this.device.createBuffer({size:6*n*4,usage:i|a.GPUBufferUsage.COPY_SRC});this.dispatch("rwkv_token_shift",[s,this.buf(e,i),this.buf(r,i),this.buf(t,i),o],this.grid1D(n*6));let u=await this.readBack(o,6*n*4);return o.destroy?.(),u}async lfm2ShortConv(e,r,t,n,a){let i=globalThis,s=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([n,a]));let u=this.buf(r,s|i.GPUBufferUsage.COPY_SRC),c=this.device.createBuffer({size:n*4,usage:s|i.GPUBufferUsage.COPY_SRC});this.dispatch("lfm2_shortconv",[o,this.buf(e,s),this.buf(t,s),u,c],this.grid1D(n));let l=await this.readBack(c,n*4),f=await this.readBack(u,(a-1)*n*4);return c.destroy?.(),u.destroy?.(),{out:l,state:f}}async matmulQ8(e,r,t,n,a,i){let s=globalThis,o=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,a,i]));let c=this.device.createBuffer({size:n*i*4,usage:o|s.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8",[u,this.buf(e,o),r,t,c],[Math.ceil(n/8),Math.ceil(i/8),1],c,n*i*4)}async matmulQ8Tiled(e,r,t,n,a,i){let s=globalThis,o=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,a,i]));let c=this.device.createBuffer({size:n*i*4,usage:o|s.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_tiled",[u,this.buf(e,o),r,t,c],[Math.ceil(Math.ceil(n/4)/8),Math.ceil(i/8),1],c,n*i*4)}async matmulQ8Shared(e,r,t,n,a,i){let s=globalThis,o=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,a,i]));let c=this.device.createBuffer({size:n*i*4,usage:o|s.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_shared",[u,this.buf(e,o),r,t,c],[Math.ceil(i/64),Math.ceil(n/32),1],c,n*i*4)}uniformOf(e){let r=globalThis,t=this.uniformPool.get(e);if(t&&t.length){let a=t.pop();return this.pooled.delete(a),a}let n=this.device.createBuffer({size:e,usage:r.GPUBufferUsage.UNIFORM|r.GPUBufferUsage.COPY_DST});return this.uniformSize.set(n,e),n}uniform(e,r){let t=this.uniformOf(32);if(this.device.queue.writeBuffer(t,0,new Uint32Array(e)),r){let n=Array.isArray(r.value)?r.value:[r.value];this.device.queue.writeBuffer(t,r.offset,new Float32Array(n))}return t}attnUniform(e,r,t,n,a,i,s,o,u){let c=this.uniformOf(48);return this.device.queue.writeBuffer(c,0,new Uint32Array([e,r,t,n,a,i])),this.device.queue.writeBuffer(c,24,new Float32Array([s,o])),this.device.queue.writeBuffer(c,32,new Uint32Array([u])),c}recMatmulT(e,r,t,n,a,i,s,o=!1){let u=this.uniform([a,i,s]),c=this.storage(a*s*4),l=this.matmulTPlan(a,i,s,o);return this.recordPass(e,l.shader,[u,t,n,c],l.grid),r.push(u,c),c}recConv2dDirect(e,r,t,n,a,i,s,o,u,c,l,f,p){let g=Math.floor((s+2*p-c)/f)+1,m=Math.floor((o+2*p-l)/f)+1,b=u*g*m,k=this.uniformOf(48);if(this.device.queue.writeBuffer(k,0,new Uint32Array([i,s,o,u,c,l,f,p,g,m])),c===3&&l===3&&f===1&&p===1&&this.convTiledOk){let M=this.storage(b*4);return this.recordPass(e,"conv2d_3x3_tiled",[k,t,n,a,M],[Math.ceil(m/16),Math.ceil(g/16),u]),r.push(k,M),M}let x=this.storage(b*4);return this.recordPass(e,"conv2d_direct",[k,t,n,a,x],this.grid1D(b)),r.push(k,x),x}recConv2dDirectQ8(e,r,t,n,a,i,s,o,u,c,l,f,p){let g=Math.floor((s+2*p-c)/f)+1,m=Math.floor((o+2*p-l)/f)+1,b=u*g*m,k=this.uniformOf(48);this.device.queue.writeBuffer(k,0,new Uint32Array([i,s,o,u,c,l,f,p,g,m]));let x=this.storage(b*4);return this.recordPass(e,"conv2d_direct_q8",[k,t,n.codes,n.sc,a,x],this.grid1D(b)),r.push(k,x),x}recConv2dDirectQ4(e,r,t,n,a,i,s,o,u,c,l,f,p){let g=Math.floor((s+2*p-c)/f)+1,m=Math.floor((o+2*p-l)/f)+1,b=u*g*m,k=this.uniformOf(48);this.device.queue.writeBuffer(k,0,new Uint32Array([i,s,o,u,c,l,f,p,g,m]));let x=this.storage(b*4);return this.recordPass(e,"conv2d_direct_q4",[k,t,n.nib,n.sc,n.mn,a,x],this.grid1D(b)),r.push(k,x),x}recGroupNorm(e,r,t,n,a,i,s,o,u){let c=this.uniform([i,s,o],{offset:12,value:u}),l=this.storage(i*s*4);return this.recordPass(e,"group_norm",[c,t,n,a,l],[o,1,1]),r.push(c,l),l}recUnary(e,r,t,n,a){let i=this.storage(a*4);return this.recordPass(e,t,[n,i],this.grid1D(a)),r.push(i),i}recLayernorm(e,r,t,n,a,i,s,o){let u=this.uniform([i,s],{offset:8,value:o}),c=this.storage(i*s*4);return this.recordPass(e,"layernorm",[u,t,n,a,c],[Math.ceil(i/ee),1,1]),r.push(u,c),c}recAttentionFull(e,r,t,n,a,i,s,o,u,c,l){let f=this.uniform([i,s,o,u,c,0],{offset:24,value:[l??1/Math.sqrt(u),0]}),p=this.storage(i*s*u*4),g=i*s;return this.attnFullWgOk&&u<=192&&g<=65535?this.recordPass(e,"attention_full_wg",[f,t,n,a,p],[g,1,1]):this.recordPass(e,"attention_full",[f,t,n,a,p],[Math.ceil(g/ee),1,1]),r.push(f,p),p}recUpsample(e,r,t,n,a,i,s){let o=this.uniform([n,a,i,s]),u=n*(a*s)*(i*s),c=this.storage(u*4);return this.recordPass(e,"upsample_nearest",[o,t,c],this.grid1D(u)),r.push(o,c),c}recConcat(e,r,t,n,a,i,s){let o=this.storage((a+i)*s*4);return e.copyBufferToBuffer(t,0,o,0,a*s*4),e.copyBufferToBuffer(n,0,o,a*s*4,i*s*4),r.push(o),o}recAddChannelBias(e,r,t,n,a,i){let s=this.uniform([a,i]),o=this.storage(a*i*4);return this.recordPass(e,"add_channel_bias",[s,t,n,o],this.grid1D(a*i)),r.push(s,o),o}recTranspose(e,r,t,n,a){let i=this.uniform([n,a]),s=this.storage(n*a*4);return this.recordPass(e,"transpose2d",[i,t,s],this.grid1D(n*a)),r.push(i,s),s}recGegluSplit(e,r,t,n,a){let i=this.uniform([n,a]),s=this.storage(n*a*4);return this.recordPass(e,"geglu_split",[i,t,s],this.grid1D(n*a)),r.push(i,s),s}recVideoGather(e,r,t,n,a,i){let s=this.uniform([n,a,i]),o=this.storage(i*n*a*4);return this.recordPass(e,"video_motion_gather",[s,t,o],this.grid1D(i*n*a)),r.push(s,o),o}recVideoScatter(e,r,t,n,a,i,s){let o=this.uniform([a,i,s]),u=this.storage(a*i*s*4);return this.recordPass(e,"video_motion_scatter",[o,t,n,u],this.grid1D(a*i*s)),r.push(o,u),u}recVideoAddPe(e,r,t,n,a,i,s){let o=this.uniform([a,i,s]),u=this.storage(s*a*i*4);return this.recordPass(e,"video_add_pe",[o,t,n,u],this.grid1D(s*a*i)),r.push(o,u),u}recAttnTemporal(e,r,t,n,a,i,s,o,u){let c=this.uniform([i,s,o,u],{offset:16,value:1/Math.sqrt(u)}),l=this.storage(i*s*o*u*4);return this.recordPass(e,"attn_temporal",[c,t,n,a,l],this.grid1D(i*s*o)),r.push(c,l),l}recordingSession(){let e=this.device.createCommandEncoder(),r=[],t=n=>{if(n instanceof Float32Array){let a=this.uploadGpu(n);return r.push(a),a}return n};return{conv2d:(n,a,i,s,o,u,c,l,f,p,g)=>a&&a.nib?this.recConv2dDirectQ4(e,r,t(n),a,t(i),s,o,u,c,l,f,p,g):a&&a.codes?this.recConv2dDirectQ8(e,r,t(n),a,t(i),s,o,u,c,l,f,p,g):this.recConv2dDirect(e,r,t(n),t(a),t(i),s,o,u,c,l,f,p,g),groupNorm:(n,a,i,s,o,u,c)=>this.recGroupNorm(e,r,t(n),t(a),t(i),s,o,u,c),silu:(n,a)=>this.recUnary(e,r,"silu",t(n),a),quickGelu:(n,a)=>this.recUnary(e,r,"quick_gelu",t(n),a),gelu:(n,a)=>this.recUnary(e,r,"gelu",t(n),a),relu:(n,a)=>this.recUnary(e,r,"relu",t(n),a),add:(n,a,i)=>this.recBinary(e,r,"add",t(n),t(a),i),geglu:(n,a,i)=>this.recBinary(e,r,"geglu",t(n),t(a),i),matmulT:(n,a,i,s,o)=>this.recMM(e,r,t(n),a instanceof Float32Array?t(a):a,i,s,o,!1),addBias:(n,a,i,s)=>this.recAddBias(e,r,t(n),t(a),i,s),addChannelBias:(n,a,i,s)=>this.recAddChannelBias(e,r,t(n),t(a),i,s),attentionFull:(n,a,i,s,o,u,c,l)=>this.recAttentionFull(e,r,t(n),t(a),t(i),s,o,u,c,l),rope2d:(n,a,i,s,o,u)=>{let c=a instanceof Uint32Array?(()=>{let l=this.uploadGpuRaw(new Uint8Array(a.buffer,a.byteOffset,a.byteLength));return r.push(l),l})():a;return this.recRope2d(e,r,t(n),c,i,s,o,u)},attention:(n,a,i,s,o,u,c,l,f)=>this.recAttention(e,r,t(n),t(a),t(i),s,o,u,c,l,f),upsample:(n,a,i,s,o)=>this.recUpsample(e,r,t(n),a,i,s,o),layernorm:(n,a,i,s,o,u)=>this.recLayernorm(e,r,t(n),t(a),t(i),s,o,u),concat:(n,a,i,s,o)=>this.recConcat(e,r,t(n),t(a),i,s,o),transpose:(n,a,i)=>this.recTranspose(e,r,t(n),a,i),gegluSplit:(n,a,i)=>this.recGegluSplit(e,r,t(n),a,i),videoGather:(n,a,i,s)=>this.recVideoGather(e,r,t(n),a,i,s),videoScatter:(n,a,i,s,o)=>this.recVideoScatter(e,r,t(n),t(a),i,s,o),videoAddPe:(n,a,i,s,o)=>this.recVideoAddPe(e,r,t(n),t(a),i,s,o),attnTemporal:(n,a,i,s,o,u,c)=>this.recAttnTemporal(e,r,t(n),t(a),t(i),s,o,u,c),alloc:n=>{let a=this.storage(n);return r.push(a),a},copy:(n,a,i,s,o)=>{e.copyBufferToBuffer(i,s,n,a,o)},finish:async(n,a)=>{this.device.queue.submit([e.finish()]);let i=await this.readBack(n,a*4);return this.release(r),i},finishKeep:n=>{this.device.queue.submit([e.finish()]);let a=r.indexOf(n);return a>=0&&r.splice(a,1),this.release(r),n},finishKeepMany:n=>{this.device.queue.submit([e.finish()]);for(let a of n){let i=r.indexOf(a);i>=0&&r.splice(i,1)}return this.release(r),n}}}readGpu(e,r){return this.readBack(e,r*4)}trimPool(e=64<<20){let r=[...this.bufferPool.keys()].sort((n,a)=>a-n),t=0;for(let n of this.bufferPool.values())for(let a of n)t+=this.poolSize.get(a)??0;for(let n of r){let a=this.bufferPool.get(n);for(;a.length&&t>e;){let i=a.pop();this.pooled.delete(i),this.poolSize.delete(i),i.destroy?.(),t-=n}}}releaseGpu(e){this.release(e)}waitGpu(){return this.device.queue.onSubmittedWorkDone()}async benchMatmul(e,r,t,n,a,i={}){let{iters:s=10,shared:o=!0,wF16:u=!1}=i,c=this.f16SharedOk,l=this.qSharedOk;this.f16SharedOk=o,this.qSharedOk=o;let f=this.uploadGpu(e),p=[],g=this.device.createCommandEncoder();this.recMM(g,p,f,r,t,n,a,u),this.device.queue.submit([g.finish()]),await this.device.queue.onSubmittedWorkDone();let m=this.device.createCommandEncoder();for(let x=0;x<s;x++)this.recMM(m,p,f,r,t,n,a,u);let b=performance.now();this.device.queue.submit([m.finish()]),await this.device.queue.onSubmittedWorkDone();let k=(performance.now()-b)/s;return this.release(p),f.destroy?.(),this.f16SharedOk=c,this.qSharedOk=l,k}destroy(){try{this.profiler?.destroy()}catch{}this.profiler=null;try{this.device?.destroy?.()}catch{}this.bufferPool.clear(),this.uniformPool.clear()}f16ToF32Gpu(e,r){let t=this.uploadGpuRawF16(e),n=this.device.createBuffer({size:r*4,usage:X.STORAGE_USAGE}),a=this.uniformOf(16);return this.device.queue.writeBuffer(a,0,new Uint32Array([r])),this.dispatch("f16_to_f32",[a,t,n],this.grid1D(Math.ceil(r/2))),t.destroy?.(),this.release([a]),n}quantizeQ8Gpu(e){let r=e instanceof Float32Array?e.length:e.n;if(r%32!==0)return this.uploadGpu(e);let t=e instanceof Float32Array?this.buf(e,X.STORAGE_USAGE):this.f16ToF32Gpu(e.f16,r),n=this.f32ToQ8Gpu(t,r);return t.destroy?.(),n}async validateResidentOps(){let e=globalThis,r=_=>Float32Array.from({length:_},()=>(Math.random()*2-1)*.5),t=(_,y,P=.005)=>_.length===y.length&&_.every((U,B)=>Math.abs(U-y[B])<=P*(1+Math.abs(y[B]))),n=4,a=4,i=4,s=4,o=2,u=1e-5,c=s*a*i,l=r(n*a*i),f=r(s*n*9),p=r(s),g=r(s),m=r(s),b=await this.silu(await this.groupNorm(await this.conv2dDirect(l,f,p,n,a,i,s,3,3,1,1),g,m,s,a*i,o,u)),k=[],x=this.device.createCommandEncoder(),M=this.uploadGpu(l),q=this.uploadGpu(f),C=this.uploadGpu(p),j=this.uploadGpu(g),A=this.uploadGpu(m);k.push(M,q,C,j,A);let w=this.recConv2dDirect(x,k,M,q,C,n,a,i,s,3,3,1,1);w=this.recGroupNorm(x,k,w,j,A,s,a*i,o,u),w=this.recUnary(x,k,"silu",w,c);let v=this.device.createBuffer({size:c*4,usage:e.GPUBufferUsage.COPY_DST|e.GPUBufferUsage.MAP_READ});x.copyBufferToBuffer(w,0,v,0,c*4),this.device.queue.submit([x.finish()]),await v.mapAsync(e.GPUMapMode.READ);let h=new Float32Array(v.getMappedRange().slice(0));return v.unmap(),v.destroy(),this.release(k),t(h,b)?null:"resident_ops"}recMatmulQ4(e,r,t,n,a,i,s){let o=this.uniform([a,i,s]),u=this.storage(a*s*4);if(a===1&&this.gemvOk){let c=this.gemvGrid(s);this.recordPass(e,"matmul_t_q4_vec",[this.uniform([a,i,s,c.stride]),t,n.nib,n.sc,n.mn,u],c.grid)}else a>=32&&this.qSharedOk?this.recordPass(e,"matmul_t_q4_shared",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(s/64),Math.ceil(a/32),1]):a>=2?this.recordPass(e,"matmul_t_q4_tiled",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(Math.ceil(a/4)/8),Math.ceil(s/8),1]):this.recordPass(e,"matmul_t_q4",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(a/8),Math.ceil(s/8),1]);return r.push(o,u),u}recMatmulQ8(e,r,t,n,a,i,s){let o=this.uniform([a,i,s]),u=this.storage(a*s*4);if(a===1&&this.gemvOk){let c=this.gemvGrid(s);this.recordPass(e,"matmul_t_q8_vec",[this.uniform([a,i,s,c.stride]),t,n.codes,n.sc,u],c.grid)}else a>=32&&this.qSharedOk?this.recordPass(e,"matmul_t_q8_shared",[o,t,n.codes,n.sc,u],[Math.ceil(s/64),Math.ceil(a/32),1]):a>=2?this.recordPass(e,"matmul_t_q8_tiled",[o,t,n.codes,n.sc,u],[Math.ceil(Math.ceil(a/4)/8),Math.ceil(s/8),1]):this.recordPass(e,"matmul_t_q8",[o,t,n.codes,n.sc,u],[Math.ceil(a/8),Math.ceil(s/8),1]);return r.push(o,u),u}gemvGrid(e){return e<=32768?{grid:[e,1,1],stride:32768}:{grid:[32768,Math.ceil(e/32768),1],stride:32768}}async matmulQ4Vec(e,r,t,n,a,i){let s=globalThis,o=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,u=this.gemvGrid(i),c=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([1,a,i,u.stride]));let l=this.device.createBuffer({size:i*4,usage:o|s.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_vec",[c,this.buf(e,o),r,t,n,l],u.grid,l,i*4)}async matmulQ8Vec(e,r,t,n,a){let i=globalThis,s=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=this.gemvGrid(a),u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([1,n,a,o.stride]));let c=this.device.createBuffer({size:a*4,usage:s|i.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_vec",[u,this.buf(e,s),r,t,c],o.grid,c,a*4)}recMatmulQ3(e,r,t,n,a,i,s){let o=this.uniform([a,i,s]),u=this.storage(a*s*4);return this.recordPass(e,"matmul_t_q3",[o,t,n.lo,n.hi,n.sc,n.mn,u],[Math.ceil(a/8),Math.ceil(s/8),1]),r.push(o,u),u}recMM(e,r,t,n,a,i,s,o){return n&&n.q3?this.recMatmulQ3(e,r,t,n,a,i,s):n&&n.nib?this.recMatmulQ4(e,r,t,n,a,i,s):n&&n.codes?this.recMatmulQ8(e,r,t,n,a,i,s):this.recMatmulT(e,r,t,n,a,i,s,o)}recRmsnorm(e,r,t,n,a,i,s,o=!1){let u=this.uniform([a,i,0,o?1:0],{offset:8,value:s}),c=this.storage(a*i*4);return this.rmsVecOk&&a<=65535?this.recordPass(e,"rmsnorm_vec",[u,t,n,c],[a,1,1]):this.recordPass(e,"rmsnorm",[u,t,n,c],[Math.ceil(a/ee),1,1]),r.push(u,c),c}recRope(e,r,t,n,a,i,s,o,u=!1){let c=this.uniform([n,a,i,s],{offset:16,value:o});this.device.queue.writeBuffer(c,20,new Uint32Array([u?1:0]));let l=this.storage(n*a*4);return this.recordPass(e,"rope",[c,t,l],[Math.ceil(n/ee),1,1]),r.push(c,l),l}recRopeMrope(e,r,t,n,a,i,s,o,u){let c=u[0],l=u[0]+u[1],f=this.uniform([a,i,s,c,l],{offset:20,value:o}),p=this.storage(a*i*4);return this.recordPass(e,"rope_mrope",[f,t,n,p],[Math.ceil(a/ee),1,1]),r.push(f,p),p}preparePositions(e,r){if(e.positions&&e.mropeSections){let t=this.storage(e.positions.byteLength);this.device.queue.writeBuffer(t,0,e.positions),r.push(t),e._posGpu=t}if(e.ropeFactors){let t=this.storage(e.ropeFactors.byteLength);this.device.queue.writeBuffer(t,0,e.ropeFactors),r.push(t),e._ffGpu=t}}recRope2d(e,r,t,n,a,i,s,o){let u=this.uniform([a,i,s,0],{offset:16,value:o}),c=this.storage(a*i*4);return this.recordPass(e,"rope_2d",[u,t,n,c],[Math.ceil(a/ee),1,1]),r.push(u,c),c}recRopeFactors(e,r,t,n,a,i,s,o,u,c=!1){let l=this.uniform([a,i,s,o],{offset:16,value:u});this.device.queue.writeBuffer(l,20,new Uint32Array([c?1:0]));let f=this.storage(a*i*4);return this.recordPass(e,"rope_factors",[l,t,n,f],[Math.ceil(a/ee),1,1]),r.push(l,f),f}recAttention(e,r,t,n,a,i,s,o,u,c,l,f,p=0,g=0){let m=this.attnUniform(i,s,o,u,c,l,f??1/Math.sqrt(u),p,g),b=this.storage(i*s*u*4);return this.attnDecodeOk&&i*s<256&&u<=128?this.recordPass(e,"attention_decode",[m,t,n,a,b],[i*s,1,1]):this.attnPrefillOk&&u<=128?this.recordPass(e,"attention_prefill",[m,t,n,a,b],[Math.ceil(i/4)*s,1,1]):this.recordPass(e,"attention",[m,t,n,a,b],[Math.ceil(i*s/ee),1,1]),r.push(m,b),b}recQuantizeKv(e,r,t,n,a,i,s,o,u){let c=this.uniform([i,s,o,u]);this.recordPass(e,"quantize_kv",[c,t,n,a],this.grid1D(i*s)),r.push(c)}recAttentionQ8(e,r,t,n,a,i,s,o,u,c,l,f,p,g,m=0,b=0){let k=this.attnUniform(o,u,c,l,f,p,g??1/Math.sqrt(l),m,b),x=this.storage(o*u*l*4);return this.attnDecodeOk&&o*u<256&&l<=128?this.recordPass(e,"attention_decode_q8kv",[k,t,n,a,i,s,x],[o*u,1,1]):this.attnPrefillOk&&l<=128?this.recordPass(e,"attention_prefill_q8kv",[k,t,n,a,i,s,x],[Math.ceil(o/4)*u,1,1]):this.recordPass(e,"attention_q8kv",[k,t,n,a,i,s,x],[Math.ceil(o*u/ee),1,1]),r.push(k,x),x}recAddBias(e,r,t,n,a,i){let s=this.uniform([a,i]),o=this.storage(a*i*4);return this.recordPass(e,"addbias",[s,t,n,o],this.grid1D(a*i)),r.push(s,o),o}recBinary(e,r,t,n,a,i){let s=this.storage(i*4);return this.recordPass(e,t,[n,a,s],this.grid1D(i)),r.push(s),s}recLfm2ShortConv(e,r,t,n,a,i,s){let o=this.uniform([i,s]),u=this.storage(i*4);return this.recordPass(e,"lfm2_shortconv",[o,t,a,n,u],this.grid1D(i)),r.push(o,u),u}recordLayerKV(e,r,t,n,a,i,s){let o=s.k,u=s.v,{seq:c,d:l,nHeads:f,nKvHeads:p,headDim:g,ffn:m,ropeTheta:b,eps:k}=n,x=p*g,M=i+c,q=a.matF16===!0,C=f*g,j=n.rmsGainOnePlus===!0,A=n.attnLogitSoftcap??0,w=n.act==="gelu"?"geglu":"swiglu",v=this.recRmsnorm(e,r,t,a.attnNorm,c,l,k,j),h=this.recMM(e,r,v,a.wq,c,l,C,q),_=this.recMM(e,r,v,a.wk,c,l,x,q),y=this.recMM(e,r,v,a.wv,c,l,x,q);a.bq&&(h=this.recAddBias(e,r,h,a.bq,c,C)),a.bk&&(_=this.recAddBias(e,r,_,a.bk,c,x)),a.bv&&(y=this.recAddBias(e,r,y,a.bv,c,x)),a.qNorm&&(h=this.recRmsnorm(e,r,h,a.qNorm,c*f,g,k,j)),a.kNorm&&(_=this.recRmsnorm(e,r,_,a.kNorm,c*p,g,k,j));let P=n._posGpu,U=n._ffGpu,B=n.ropeInterleaved===!0,G=(W,S,L)=>n.skipRope?W:P?this.recRopeMrope(e,r,W,P,S,g,L,b,n.mropeSections):U?this.recRopeFactors(e,r,W,U,S,g,L,i,b,B):this.recRope(e,r,W,S,g,L,i,b,B),F=G(h,c*f,f),T=G(_,c*p,p),D;if(s.kScale)this.recQuantizeKv(e,r,T,o,s.kScale,c,p,g,i),this.recQuantizeKv(e,r,y,u,s.vScale,c,p,g,i),D=this.recAttentionQ8(e,r,F,o,s.kScale,u,s.vScale,c,f,p,g,M,i,n.attnScale,A,n.window??0);else{let W=x*4;e.copyBufferToBuffer(T,0,o,i*W,c*W),e.copyBufferToBuffer(y,0,u,i*W,c*W),D=this.recAttention(e,r,F,o,u,c,f,p,g,M,i,n.attnScale,A,n.window??0)}let O=this.recMM(e,r,D,a.wo,c,C,l,q);a.postAttnNorm&&(O=this.recRmsnorm(e,r,O,a.postAttnNorm,c,l,k,j));let R=this.recBinary(e,r,"add",t,O,c*l),E=this.recRmsnorm(e,r,R,a.ffnNorm,c,l,k,j),Q=this.recMM(e,r,E,a.wgate,c,l,m,q),$=this.recMM(e,r,E,a.wup,c,l,m,q),V=this.recBinary(e,r,w,Q,$,c*m),I=this.recMM(e,r,V,a.wdown,c,m,l,q);return a.postFfnNorm&&(I=this.recRmsnorm(e,r,I,a.postFfnNorm,c,l,k,j)),this.recBinary(e,r,"add",R,I,c*l)}setKvQuant(e){this.kvQuant!==e&&(this.kvQuant=e,this.resetKvGpu())}resetKvGpu(){for(let e of this.kvGpu.values())e.k.destroy?.(),e.v.destroy?.(),e.kScale?.destroy?.(),e.vScale?.destroy?.();this.kvGpu.clear(),this.kvSession="";for(let e of this.bufferPool.values())for(let r of e)r.destroy?.();this.bufferPool.clear()}clearKvCache(){this.resetKvGpu()}ensureKv(e,r,t,n){let a=this.kvGpu.get(e);if(a&&a.cap>=r)return a;let i=Math.max(r,(a?.cap??0)+1024,1024),s=this.kvQuant,o=this.storage(i*t*(s?1:4)),u=this.storage(i*t*(s?1:4)),c=s?this.storage(i*n*4):void 0,l=s?this.storage(i*n*4):void 0;if(a){let p=this.device.createCommandEncoder();p.copyBufferToBuffer(a.k,0,o,0,a.cap*t*(s?1:4)),p.copyBufferToBuffer(a.v,0,u,0,a.cap*t*(s?1:4)),s&&a.kScale&&(p.copyBufferToBuffer(a.kScale,0,c,0,a.cap*n*4),p.copyBufferToBuffer(a.vScale,0,l,0,a.cap*n*4)),this.device.queue.submit([p.finish()]),a.k.destroy?.(),a.v.destroy?.(),a.kScale?.destroy?.(),a.vScale?.destroy?.()}let f={k:o,v:u,cap:i,kScale:c,vScale:l};return this.kvGpu.set(e,f),f}async runDecodeGpu(e,r,t,n,a,i){let{seq:s,d:o,nKvHeads:u,headDim:c,eps:l}=r,f=u*c,p=n+s;(i!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${i}" inconnue avec pastLen=${n} \u2014 cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=i);for(let q=0;q<t.length;q++)this.ensureKv(q,p,f,u);let g=[];this.preparePositions(r,g);let m=this.device.createCommandEncoder(),b=this.storage(e.byteLength);this.device.queue.writeBuffer(b,0,e),g.push(b);for(let q=0;q<t.length;q++){let C=this.kvGpu.get(q);b=this.recordLayerKV(m,g,b,lt(r,s,q,this.swaOk),t[q],n,C)}let k=this.recRmsnorm(m,g,b,a,s,o,l,r.rmsGainOnePlus===!0),x=this.storage(o*4);m.copyBufferToBuffer(k,(s-1)*o*4,x,0,o*4),this.device.queue.submit([m.finish()]);let M=await this.readBack(x,o*4);return g.push(x),this.release(g),M}async decodeLogitsQ8(e,r,t,n,a,i,s,o){let u=globalThis,{seq:c,d:l,nKvHeads:f,headDim:p,eps:g}=r,m=f*p,b=n+c;(i!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${i}" inconnue avec pastLen=${n} \u2014 cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=i);for(let v=0;v<t.length;v++)this.ensureKv(v,b,m,f);let k=[];this.preparePositions(r,k);let x=this.device.createCommandEncoder(),M=this.storage(e.byteLength);this.device.queue.writeBuffer(M,0,e),k.push(M);for(let v=0;v<t.length;v++){let h=this.kvGpu.get(v);M=this.recordLayerKV(x,k,M,lt(r,c,v,this.swaOk),t[v],n,h)}let q=this.recRmsnorm(x,k,M,a,c,l,g,r.rmsGainOnePlus===!0),C=this.storage(l*4);x.copyBufferToBuffer(q,(c-1)*l*4,C,0,l*4),k.push(C);let j=this.storage(o*4);k.push(j);for(let v of s){let h=this.recMM(x,k,C,v.w,1,l,v.rows,!1);x.copyBufferToBuffer(h,0,j,v.r0*4,v.rows*4)}let A=this.device.createBuffer({size:o*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});x.copyBufferToBuffer(j,0,A,0,o*4),this.device.queue.submit([x.finish()]),await A.mapAsync(u.GPUMapMode.READ);let w=new Float32Array(A.getMappedRange().slice(0));return A.unmap(),A.destroy(),this.release(k),w}async decodeTopKQ8(e,r,t,n,a,i,s,o,u,c,l,f=64){let p=globalThis,{seq:g,d:m,nKvHeads:b,headDim:k,eps:x}=r,M=b*k,q=n+g;(i!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${i}" inconnue avec pastLen=${n} \u2014 cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=i);for(let G=0;G<t.length;G++)this.ensureKv(G,q,M,b);let C=X.timingOn?(G,F)=>console.info(`[timing:gpu] ${G} ${(performance.now()-F).toFixed(0)} ms`):null,j=performance.now(),A=[];this.preparePositions(r,A);let w=this.device.createCommandEncoder(),v=this.storage(e.byteLength);this.device.queue.writeBuffer(v,0,e),A.push(v);for(let G=0;G<t.length;G++){let F=this.kvGpu.get(G);v=this.recordLayerKV(w,A,v,lt(r,g,G,this.swaOk),t[G],n,F)}let h=this.recRmsnorm(w,A,v,a,g,m,x,r.rmsGainOnePlus===!0),_=this.storage(m*4);w.copyBufferToBuffer(h,(g-1)*m*4,_,0,m*4),A.push(_);let y=this.storage(o*4);A.push(y);for(let G of s){let F=this.recMM(w,A,_,G.w,1,m,G.rows,!1);w.copyBufferToBuffer(F,0,y,G.r0*4,G.rows*4)}if(l&&l>0){let G=this.uniform([o],{offset:4,value:l});this.recordPass(w,"softcap_logits",[G,y],this.grid1D(o)),A.push(G)}if(c&&c!==1&&u.length){let G=Uint32Array.from(u),F=this.bufU32(G,p.GPUBufferUsage.STORAGE|p.GPUBufferUsage.COPY_DST),T=this.uniform([G.length],{offset:4,value:c});this.recordPass(w,"penalize_logits",[T,F,y],this.grid1D(G.length)),A.push(T,F)}let P=this.storage(f*2*4);A.push(P);{let G=this.uniform([o,f]);this.recordPass(w,this.topKParOk?"top_k_par":"top_k",[G,y,P],[1,1,1]),A.push(G)}let U=this.device.createBuffer({size:f*2*4,usage:p.GPUBufferUsage.COPY_DST|p.GPUBufferUsage.MAP_READ});w.copyBufferToBuffer(P,0,U,0,f*2*4),C?.("enregistrement des passes (compilation des pipelines incluse)",j),j=performance.now(),this.device.queue.submit([w.finish()]),await U.mapAsync(p.GPUMapMode.READ),C?.("execution GPU (submit + readback)",j);let B=new Uint32Array(U.getMappedRange().slice(0));return U.unmap(),U.destroy(),this.release(A),{ids:B.slice(0,f),vals:new Float32Array(B.buffer,f*4,f)}}resetLfm2State(){for(let e of this.lfm2KvGpu.values())e.k.destroy?.(),e.v.destroy?.();for(let e of this.lfm2ConvGpu.values())e.destroy?.();this.lfm2KvGpu.clear(),this.lfm2ConvGpu.clear(),this.lfm2Session="";for(let e of this.bufferPool.values())for(let r of e)r.destroy?.();this.bufferPool.clear()}clearLfm2State(){this.resetLfm2State()}ensureLfm2Kv(e,r,t){let n=this.lfm2KvGpu.get(e);if(n&&n.cap>=r)return n;let a=Math.max(r,(n?.cap??0)+1024,1024),i=this.storage(a*t*4),s=this.storage(a*t*4);if(n){let u=this.device.createCommandEncoder();u.copyBufferToBuffer(n.k,0,i,0,n.cap*t*4),u.copyBufferToBuffer(n.v,0,s,0,n.cap*t*4),this.device.queue.submit([u.finish()]),n.k.destroy?.(),n.v.destroy?.()}let o={k:i,v:s,cap:a};return this.lfm2KvGpu.set(e,o),o}ensureLfm2Conv(e,r){let t=this.lfm2ConvGpu.get(e);return t||(t=this.storage(r*4),this.device.queue.writeBuffer(t,0,new Float32Array(r)),this.lfm2ConvGpu.set(e,t)),t}recLfm2ShortConvBatch(e,r,t,n,a,i,s,o){let u=this.uniform([i,s,o]),c=this.storage(o*i*4);this.recordPass(e,"lfm2_shortconv_batch",[u,t,a,n,c],this.grid1D(o*i));let l=this.uniform([i,s,o]);return this.recordPass(e,"lfm2_shortconv_state",[l,t,n],this.grid1D((s-1)*i)),r.push(u,l,c),c}recordLfm2(e,r,t,n,a,i,s,o){let{D:u,nHeads:c,nKvHeads:l,headDim:f,ffn:p,eps:g,theta:m,lc:b}=a,k=l*f,x=c*f,M=k*4;for(let C=0;C<i.length;C++)i[C].conv?this.ensureLfm2Conv(C,(b-1)*u):this.ensureLfm2Kv(C,o+n,k);if(n>=b-1&&this.lfm2BatchOk){let C=this.storage(n*u*4);this.device.queue.writeBuffer(C,0,t),r.push(C);for(let A=0;A<i.length;A++){let w=i[A],v=this.recRmsnorm(e,r,C,w.attnNorm,n,u,g),h;if(w.conv){let G=this.recMM(e,r,v,w.inProj,n,u,3*u,!1),F=this.recLfm2ShortConvBatch(e,r,G,this.lfm2ConvGpu.get(A),w.convW,u,b,n);h=this.recMM(e,r,F,w.outProj,n,u,u,!1)}else{let G=this.recMM(e,r,v,w.wq,n,u,x,!1),F=this.recMM(e,r,v,w.wk,n,u,k,!1),T=this.recMM(e,r,v,w.wv,n,u,k,!1);G=this.recRmsnorm(e,r,G,w.qNorm,n*c,f,g),F=this.recRmsnorm(e,r,F,w.kNorm,n*l,f,g),G=this.recRope(e,r,G,n*c,f,c,o,m),F=this.recRope(e,r,F,n*l,f,l,o,m);let D=this.lfm2KvGpu.get(A);e.copyBufferToBuffer(F,0,D.k,o*M,n*M),e.copyBufferToBuffer(T,0,D.v,o*M,n*M);let O=this.recAttention(e,r,G,D.k,D.v,n,c,l,f,o+n,o);h=this.recMM(e,r,O,w.wo,n,x,u,!1)}C=this.recBinary(e,r,"add",C,h,n*u);let _=this.recRmsnorm(e,r,C,w.ffnNorm,n,u,g),y=this.recMM(e,r,_,w.wgate,n,u,p,!1),P=this.recMM(e,r,_,w.wup,n,u,p,!1),U=this.recBinary(e,r,"swiglu",y,P,n*p),B=this.recMM(e,r,U,w.wdown,n,p,u,!1);C=this.recBinary(e,r,"add",C,B,n*u)}let j=this.storage(u*4);return r.push(j),e.copyBufferToBuffer(C,(n-1)*u*4,j,0,u*4),this.recRmsnorm(e,r,j,s,1,u,g)}let q=null;for(let C=0;C<n;C++){let j=o+C,A=this.storage(u*4);this.device.queue.writeBuffer(A,0,t.subarray(C*u,(C+1)*u)),r.push(A);for(let w=0;w<i.length;w++){let v=i[w],h=this.recRmsnorm(e,r,A,v.attnNorm,1,u,g),_;if(v.conv){let F=this.recMM(e,r,h,v.inProj,1,u,3*u,!1),T=this.recLfm2ShortConv(e,r,F,this.lfm2ConvGpu.get(w),v.convW,u,b);_=this.recMM(e,r,T,v.outProj,1,u,u,!1)}else{let F=this.recMM(e,r,h,v.wq,1,u,x,!1),T=this.recMM(e,r,h,v.wk,1,u,k,!1),D=this.recMM(e,r,h,v.wv,1,u,k,!1);F=this.recRmsnorm(e,r,F,v.qNorm,c,f,g),T=this.recRmsnorm(e,r,T,v.kNorm,l,f,g),F=this.recRope(e,r,F,c,f,c,j,m),T=this.recRope(e,r,T,l,f,l,j,m);let O=this.lfm2KvGpu.get(w);e.copyBufferToBuffer(T,0,O.k,j*M,M),e.copyBufferToBuffer(D,0,O.v,j*M,M);let R=this.recAttention(e,r,F,O.k,O.v,1,c,l,f,j+1,j);_=this.recMM(e,r,R,v.wo,1,x,u,!1)}A=this.recBinary(e,r,"add",A,_,u);let y=this.recRmsnorm(e,r,A,v.ffnNorm,1,u,g),P=this.recMM(e,r,y,v.wgate,1,u,p,!1),U=this.recMM(e,r,y,v.wup,1,u,p,!1),B=this.recBinary(e,r,"swiglu",P,U,p),G=this.recMM(e,r,B,v.wdown,1,p,u,!1);A=this.recBinary(e,r,"add",A,G,u)}C===n-1&&(q=this.recRmsnorm(e,r,A,s,1,u,g))}return q}lfm2SessionReset(e,r){(e!==this.lfm2Session||r===0)&&(r>0&&console.error(`[lfm2] session "${e}" inconnue avec pastLen=${r} \u2014 \xE9tat perdu, sortie invalide. Repartir de pastLen 0.`),this.resetLfm2State(),this.lfm2Session=e)}async lfm2PrefillGpu(e,r,t,n,a,i,s){this.lfm2SessionReset(s,i);let o=[],u=this.device.createCommandEncoder();this.recordLfm2(u,o,e,r,t,n,a,i),this.device.queue.submit([u.finish()]),await this.device.queue.onSubmittedWorkDone(),this.release(o)}async lfm2LogitsGpu(e,r,t,n,a,i,s,o){let u=globalThis;this.lfm2SessionReset(o,s);let c=[],l=this.device.createCommandEncoder(),f=this.recordLfm2(l,c,e,r,t,n,i,s),p=this.recMM(l,c,f,a,1,t.D,t.vocab,!1),g=this.device.createBuffer({size:t.vocab*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});l.copyBufferToBuffer(p,0,g,0,t.vocab*4),this.device.queue.submit([l.finish()]),await g.mapAsync(u.GPUMapMode.READ);let m=new Float32Array(g.getMappedRange().slice(0));return g.unmap(),g.destroy(),this.release(c),m}async lfm2TopKGpu(e,r,t,n,a,i,s,o,u,c,l=64){let f=globalThis;this.lfm2SessionReset(o,s);let p=[],g=this.device.createCommandEncoder(),m=this.recordLfm2(g,p,e,r,t,n,i,s),b=this.recMM(g,p,m,a,1,t.D,t.vocab,!1);if(c&&c!==1&&u.length){let q=Uint32Array.from(u),C=this.bufU32(q,f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST),j=this.uniform([q.length],{offset:4,value:c});this.recordPass(g,"penalize_logits",[j,C,b],this.grid1D(q.length)),p.push(j,C)}let k=this.storage(l*2*4);p.push(k);{let q=this.uniform([t.vocab,l]);this.recordPass(g,this.topKParOk?"top_k_par":"top_k",[q,b,k],[1,1,1]),p.push(q)}let x=this.device.createBuffer({size:l*2*4,usage:f.GPUBufferUsage.COPY_DST|f.GPUBufferUsage.MAP_READ});g.copyBufferToBuffer(k,0,x,0,l*2*4),this.device.queue.submit([g.finish()]),await x.mapAsync(f.GPUMapMode.READ);let M=new Uint32Array(x.getMappedRange().slice(0));return x.unmap(),x.destroy(),this.release(p),{ids:M.slice(0,l),vals:new Float32Array(M.buffer,l*4,l)}}resetRwkvState(){for(let e of this.rwkvStateGpu.values())e.S.destroy?.(),e.tm.destroy?.(),e.cm.destroy?.();this.rwkvStateGpu.clear(),this.rwkvVFirst?.destroy?.(),this.rwkvVFirst=null,this.rwkvSession="";for(let e of this.bufferPool.values())for(let r of e)r.destroy?.();this.bufferPool.clear()}clearRwkvState(){this.resetRwkvState()}ensureRwkvState(e,r,t,n){let a=this.rwkvStateGpu.get(e);if(!a){let i=this.storage(t*n*n*4),s=this.storage(r*4),o=this.storage(r*4);this.device.queue.writeBuffer(i,0,new Float32Array(t*n*n)),this.device.queue.writeBuffer(s,0,new Float32Array(r)),this.device.queue.writeBuffer(o,0,new Float32Array(r)),a={S:i,tm:s,cm:o},this.rwkvStateGpu.set(e,a)}return a}rwkvSessionReset(e,r){(e!==this.rwkvSession||r===0)&&(r>0&&console.error(`[rwkv] session "${e}" inconnue avec pastLen=${r} \u2014 \xE9tat perdu, sortie invalide. Repartir de pastLen 0.`),this.resetRwkvState(),this.rwkvSession=e)}recRwkvToken(e,r,t,n,a,i){let{D:s,H:o,NH:u}=n,c=1e-5,l=64e-5;for(let f=0;f<a.length;f++){let p=a[f],g=this.rwkvStateGpu.get(f),m=this.recLayernorm(e,r,t,p.attnNormW,p.attnNormB,1,s,c),b=this.storage(6*s*4);{let L=this.uniform([s]);this.recordPass(e,"rwkv_token_shift",[L,m,g.tm,p.lerpFused,b],this.grid1D(6*s)),r.push(L,b)}e.copyBufferToBuffer(m,0,g.tm,0,s*4);let k=L=>{let H=this.storage(s*4);return e.copyBufferToBuffer(b,L*s*4,H,0,s*4),r.push(H),H},x=k(0),M=k(1),q=k(2),C=k(3),j=k(4),A=k(5),w=this.recMM(e,r,x,p.R,1,s,s,!1),v=this.recMM(e,r,q,p.K,1,s,s,!1),h=this.recMM(e,r,C,p.V,1,s,s,!1),_=this.recUnary(e,r,"tanh_act",this.recMM(e,r,M,p.w1,1,s,p.rw,!1),p.rw),y=this.recMM(e,r,_,p.w2,1,p.rw,s,!1),P=this.storage(s*4);this.recordPass(e,"rwkv_decay",[p.w0,y,P],this.grid1D(s)),r.push(P);let U=this.recMM(e,r,this.recMM(e,r,j,p.a1,1,s,p.ra,!1),p.a2,1,p.ra,s,!1),B=this.storage(s*4);this.recordPass(e,"rwkv_bias_sigmoid",[p.a0,U,B],this.grid1D(s)),r.push(B);let G=this.recUnary(e,r,"sigmoid",this.recMM(e,r,A,p.g1,1,s,p.rg,!1),p.rg),F=this.recMM(e,r,G,p.g2,1,p.rg,s,!1);if(f===0)e.copyBufferToBuffer(h,0,i,0,s*4);else{let L=this.recMM(e,r,this.recMM(e,r,C,p.v1,1,s,p.rv,!1),p.v2,1,p.rv,s,!1);this.recordPass(e,"rwkv_vresid",[h,i,p.v0,L],this.grid1D(s))}let T=this.storage(s*4),D=this.storage(s*4),O=this.storage(s*4);{let L=this.uniform([u,o]);this.recordPass(e,"rwkv_kprep",[L,v,B,p.kk,p.ka,T,D,O],this.grid1D(u)),r.push(L,T,D,O)}let R=this.storage(s*4);{let L=this.uniform([u,o]);this.recordPass(e,"rwkv_wkv7",[L,w,P,T,h,D,O,g.S,R],this.grid1D(u*o)),r.push(L,R)}let E=this.storage(s*4);{let L=this.uniform([u,o],{offset:8,value:l});this.recordPass(e,"rwkv_out_gn",[L,R,w,T,p.rk,h,p.lnWB,E],this.grid1D(u)),r.push(L,E)}let Q=this.recBinary(e,r,"mul",E,F,s),$=this.recMM(e,r,Q,p.O,1,s,s,!1);t=this.recBinary(e,r,"add",t,$,s);let V=this.recLayernorm(e,r,t,p.attnNorm2W,p.attnNorm2B,1,s,c),I=this.storage(s*4);this.recordPass(e,"rwkv_lerp",[V,g.cm,p.lerpK,I],this.grid1D(s)),r.push(I),e.copyBufferToBuffer(V,0,g.cm,0,s*4);let W=this.recUnary(e,r,"sqrelu",this.recMM(e,r,I,p.cmK,1,s,p.ffn,!1),p.ffn),S=this.recMM(e,r,W,p.cmV,1,p.ffn,s,!1);t=this.recBinary(e,r,"add",t,S,s)}return t}recordRwkv(e,r,t,n,a,i,s){let{D:o,H:u,NH:c}=a;for(let f=0;f<i.length;f++)this.ensureRwkvState(f,o,c,u);this.rwkvVFirst||(this.rwkvVFirst=this.storage(o*4));let l=null;for(let f=0;f<n;f++){let p=this.storage(o*4);this.device.queue.writeBuffer(p,0,t.subarray(f*o,(f+1)*o)),r.push(p);let g=this.recLayernorm(e,r,p,s.tokW,s.tokB,1,o,1e-5),m=this.recRwkvToken(e,r,g,a,i,this.rwkvVFirst);f===n-1&&(l=this.recLayernorm(e,r,m,s.outW,s.outB,1,o,1e-5))}return l}async rwkvPrefillGpu(e,r,t,n,a,i,s){this.rwkvSessionReset(s,i);let o=[],u=this.device.createCommandEncoder();this.recordRwkv(u,o,e,r,t,n,a),this.device.queue.submit([u.finish()]),await this.device.queue.onSubmittedWorkDone(),this.release(o)}async rwkvLogitsGpu(e,r,t,n,a,i,s,o){let u=globalThis;this.rwkvSessionReset(o,s);let c=[],l=this.device.createCommandEncoder(),f=this.recordRwkv(l,c,e,r,t,n,i),p=this.recMM(l,c,f,a,1,t.D,t.vocab,!1),g=this.device.createBuffer({size:t.vocab*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});l.copyBufferToBuffer(p,0,g,0,t.vocab*4),this.device.queue.submit([l.finish()]),await g.mapAsync(u.GPUMapMode.READ);let m=new Float32Array(g.getMappedRange().slice(0));return g.unmap(),g.destroy(),this.release(c),m}async rwkvTopKGpu(e,r,t,n,a,i,s,o,u,c,l=64){let f=globalThis;this.rwkvSessionReset(o,s);let p=[],g=this.device.createCommandEncoder(),m=this.recordRwkv(g,p,e,r,t,n,i),b=this.recMM(g,p,m,a,1,t.D,t.vocab,!1);if(c&&c!==1&&u.length){let q=Uint32Array.from(u),C=this.bufU32(q,f.GPUBufferUsage.STORAGE|f.GPUBufferUsage.COPY_DST),j=this.uniform([q.length],{offset:4,value:c});this.recordPass(g,"penalize_logits",[j,C,b],this.grid1D(q.length)),p.push(j,C)}let k=this.storage(l*2*4);p.push(k);{let q=this.uniform([t.vocab,l]);this.recordPass(g,this.topKParOk?"top_k_par":"top_k",[q,b,k],[1,1,1]),p.push(q)}let x=this.device.createBuffer({size:l*2*4,usage:f.GPUBufferUsage.COPY_DST|f.GPUBufferUsage.MAP_READ});g.copyBufferToBuffer(k,0,x,0,l*2*4),this.device.queue.submit([g.finish()]),await x.mapAsync(f.GPUMapMode.READ);let M=new Uint32Array(x.getMappedRange().slice(0));return x.unmap(),x.destroy(),this.release(p),{ids:M.slice(0,l),vals:new Float32Array(M.buffer,l*4,l)}}async argmaxProjection(e,r,t,n,a=!1){let i=globalThis,s=[],o=this.device.createCommandEncoder(),u=this.storage(e.byteLength);this.device.queue.writeBuffer(u,0,e),s.push(u);let c=this.storage(n*4);s.push(c);for(let m of r){let b=this.recMatmulT(o,s,u,m.buf,1,t,m.rows,a);o.copyBufferToBuffer(b,0,c,m.r0*4,m.rows*4)}let l=this.storage(4),f=this.uniform([n]);s.push(l,f),this.recordPass(o,"argmax",[f,c,l],[1,1,1]);let p=this.device.createBuffer({size:4,usage:i.GPUBufferUsage.COPY_DST|i.GPUBufferUsage.MAP_READ});o.copyBufferToBuffer(l,0,p,0,4),this.device.queue.submit([o.finish()]),await p.mapAsync(i.GPUMapMode.READ);let g=new Uint32Array(p.getMappedRange().slice(0))[0];return p.unmap(),p.destroy(),this.release(s),g}async projectLogits(e,r,t,n,a=!1){let i=globalThis,s=[],o=this.device.createCommandEncoder(),u=this.storage(e.byteLength);this.device.queue.writeBuffer(u,0,e),s.push(u);let c=this.storage(n*4);s.push(c);for(let p of r){let g=this.recMatmulT(o,s,u,p.buf,1,t,p.rows,a);o.copyBufferToBuffer(g,0,c,p.r0*4,p.rows*4)}let l=this.device.createBuffer({size:n*4,usage:i.GPUBufferUsage.COPY_DST|i.GPUBufferUsage.MAP_READ});o.copyBufferToBuffer(c,0,l,0,n*4),this.device.queue.submit([o.finish()]),await l.mapAsync(i.GPUMapMode.READ);let f=new Float32Array(l.getMappedRange().slice(0));return l.unmap(),l.destroy(),this.release(s),f}async selfValidate(){this.validationFailure=null;let e=A=>(this.validationFailure=A,console.error("[selfValidate] FAILED at:",A,"(hasF16="+this.hasF16+")"),!1),r=(A,w)=>A.length===w.length&&A.every((v,h)=>Math.abs(v-w[h])<.001),t=A=>Float32Array.from({length:A},()=>Math.random()*2-1),n=3,a=4,i=5,s=t(n*a),o=t(a*i),u=new Float32Array(n*i);for(let A=0;A<n;A++)for(let w=0;w<i;w++){let v=0;for(let h=0;h<a;h++)v+=s[A*a+h]*o[h*i+w];u[A*i+w]=v}if(!r(await this.matmul(s,o,n,a,i),u))return e("matmul");{let A=(v,h,_,y,P)=>{let U=new Float32Array(_*P);for(let B=0;B<_;B++)for(let G=0;G<P;G++){let F=0;for(let T=0;T<y;T++)F+=v[B*y+T]*h[G*y+T];U[B*P+G]=F}return U},w=async(v,h,_)=>{let y=t(v*h),P=t(_*h);return r(await this.matmulT(y,P,v,h,_),A(y,P,v,h,_))};if(!await w(3,8,5))return e("matmulT.vec4(3,8,5)");if(!await w(1,16,7))return e("matmulT.vec4(1,16,7)");if(!await w(2,6,4))return e("matmulT.scalar(2,6,4)");if(this.hasF16){let y=t(16),P=t(112),U=this.uploadGpuF16(P),B=await this.matmulT(y,U,1,16,7,!0),G=new Float32Array(7);for(let R=0;R<7;R++){let E=0;for(let Q=0;Q<16;Q++)E+=y[Q]*P[R*16+Q];G[R]=E}U.destroy?.();let F=R=>R.length===G.length&&R.every((E,Q)=>Math.abs(E-G[Q])<=.03*(1+Math.abs(G[Q])));if(!F(B))return e("matmulT.f16");let T=this.uploadGpu(P),D=this.f32ToF16Gpu(T,112),O=await this.matmulT(y,D,1,16,7,!0);if(T.destroy?.(),D.destroy?.(),!F(O))return e("packf16")}if(this.hasF16&&this.f16SharedOk){let v=[{m:20,k:128,n:18},{m:32,k:64,n:64},{m:70,k:40,n:130},{m:33,k:48,n:7}];for(let h of v){let _=t(h.m*h.k),y=t(h.n*h.k),P=this.uploadGpuF16(y),U=await this.matmulT(_,P,h.m,h.k,h.n,!0);this.f16SharedOk=!1;let B=await this.matmulT(_,P,h.m,h.k,h.n,!0);if(this.f16SharedOk=!0,P.destroy?.(),!(U.length===B.length&&U.every((F,T)=>Math.abs(F-B[T])<=.001*(1+Math.abs(B[T]))))){this.f16SharedOk=!1,console.warn(`[selfValidate] matmul_t_f16w_shared KO sur ce GPU (m=${h.m}, k=${h.k}, n=${h.n}) \u2014 repli sur matmul_t_f16w (plus lent, m\xEAme r\xE9sultat).`);break}}}}{let h=t(128),_=t(768),y=Me(_),P=this.uploadGpuRaw(y.nibbles),U=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),B=this.uploadGpuRaw(new Uint8Array(y.mins.buffer,y.mins.byteOffset,y.mins.byteLength)),G=await this.matmulQ4(h,P,U,B,1,128,6),F=pe(y),T=new Float32Array(6);for(let Q=0;Q<6;Q++){let $=0;for(let V=0;V<128;V++)$+=h[V]*F[Q*128+V];T[Q]=$}if(P.destroy?.(),U.destroy?.(),B.destroy?.(),!r(G,T))return e("matmulQ4");let D=this.uploadGpu(_),O=this.f32ToQ4Gpu(D,768),R=await this.matmulQ4(h,O.nib,O.sc,O.mn,1,128,6);if(D.destroy?.(),O.nib.destroy?.(),O.sc.destroy?.(),O.mn.destroy?.(),!(R.length===T.length&&R.every((Q,$)=>Math.abs(Q-T[$])<=.06*(1+Math.abs(T[$]))+.02)))return e("quantize_q4")}{let h=t(640),_=t(768),y=Xt(_),P=this.uploadGpuRaw(new Uint8Array(y.lo.buffer,y.lo.byteOffset,y.lo.byteLength)),U=this.uploadGpuRaw(new Uint8Array(y.hi.buffer,y.hi.byteOffset,y.hi.byteLength)),B=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),G=this.uploadGpuRaw(new Uint8Array(y.mins.buffer,y.mins.byteOffset,y.mins.byteLength)),F=await this.matmulQ3(h,P,U,B,G,5,128,6),T=We(y),D=new Float32Array(30);for(let O=0;O<5;O++)for(let R=0;R<6;R++){let E=0;for(let Q=0;Q<128;Q++)E+=h[O*128+Q]*T[R*128+Q];D[O*6+R]=E}if(P.destroy?.(),U.destroy?.(),B.destroy?.(),G.destroy?.(),!r(F,D))return e("matmulQ3")}{let h=t(640),_=t(768),y=Me(_),P=this.uploadGpuRaw(y.nibbles),U=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),B=this.uploadGpuRaw(new Uint8Array(y.mins.buffer,y.mins.byteOffset,y.mins.byteLength)),G=await this.matmulQ4Tiled(h,P,U,B,5,128,6),F=pe(y),T=new Float32Array(30);for(let D=0;D<5;D++)for(let O=0;O<6;O++){let R=0;for(let E=0;E<128;E++)R+=h[D*128+E]*F[O*128+E];T[D*6+O]=R}if(P.destroy?.(),U.destroy?.(),B.destroy?.(),!r(G,T))return e("matmul_q4_tiled")}for(let A of[{m:20,n:18},{m:32,n:64},{m:70,n:130}]){let w=A.m,v=128,h=A.n,_=t(w*v),y=t(h*v),P=Me(y),U=this.uploadGpuRaw(P.nibbles),B=this.uploadGpuRaw(new Uint8Array(P.scales.buffer,P.scales.byteOffset,P.scales.byteLength)),G=this.uploadGpuRaw(new Uint8Array(P.mins.buffer,P.mins.byteOffset,P.mins.byteLength)),F=await this.matmulQ4Shared(_,U,B,G,w,v,h),T=pe(P),D=new Float32Array(w*h);for(let O=0;O<w;O++)for(let R=0;R<h;R++){let E=0;for(let Q=0;Q<v;Q++)E+=_[O*v+Q]*T[R*v+Q];D[O*h+R]=E}if(U.destroy?.(),B.destroy?.(),G.destroy?.(),!r(F,D))return e(`matmul_q4_shared(${w},${h})`)}{let h=t(128),_=t(768),y=Ce(_),P=this.uploadGpuRaw(new Uint8Array(y.codes.buffer,y.codes.byteOffset,y.codes.byteLength)),U=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),B=await this.matmulQ8(h,P,U,1,128,6),G=we(y),F=new Float32Array(6);for(let R=0;R<6;R++){let E=0;for(let Q=0;Q<128;Q++)E+=h[Q]*G[R*128+Q];F[R]=E}if(P.destroy?.(),U.destroy?.(),!r(B,F))return e("matmulQ8");let T=this.uploadGpu(_),D=this.f32ToQ8Gpu(T,768),O=await this.matmulQ8(h,D.codes,D.sc,1,128,6);if(T.destroy?.(),D.codes.destroy?.(),D.sc.destroy?.(),!r(O,F))return e("quantize_q8")}{let h=t(640),_=t(768),y=Ce(_),P=this.uploadGpuRaw(new Uint8Array(y.codes.buffer,y.codes.byteOffset,y.codes.byteLength)),U=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),B=await this.matmulQ8Tiled(h,P,U,5,128,6),G=we(y),F=new Float32Array(30);for(let T=0;T<5;T++)for(let D=0;D<6;D++){let O=0;for(let R=0;R<128;R++)O+=h[T*128+R]*G[D*128+R];F[T*6+D]=O}if(P.destroy?.(),U.destroy?.(),!r(B,F))return e("matmul_q8_tiled")}for(let A of[{k:128,n:6},{k:128,n:130},{k:4096,n:17}]){let w=A.k,v=A.n,h=t(w),_=t(v*w),y=Me(_),P=this.uploadGpuRaw(y.nibbles),U=this.uploadGpuRaw(new Uint8Array(y.scales.buffer,y.scales.byteOffset,y.scales.byteLength)),B=this.uploadGpuRaw(new Uint8Array(y.mins.buffer,y.mins.byteOffset,y.mins.byteLength)),G=await this.matmulQ4Vec(h,P,U,B,w,v),F=pe(y),T=new Float32Array(v);for(let V=0;V<v;V++){let I=0;for(let W=0;W<w;W++)I+=h[W]*F[V*w+W];T[V]=I}if(P.destroy?.(),U.destroy?.(),B.destroy?.(),!r(G,T))return e(`matmul_q4_vec(${w},${v})`);let D=Ce(_),O=this.uploadGpuRaw(new Uint8Array(D.codes.buffer,D.codes.byteOffset,D.codes.byteLength)),R=this.uploadGpuRaw(new Uint8Array(D.scales.buffer,D.scales.byteOffset,D.scales.byteLength)),E=await this.matmulQ8Vec(h,O,R,w,v),Q=we(D),$=new Float32Array(v);for(let V=0;V<v;V++){let I=0;for(let W=0;W<w;W++)I+=h[W]*Q[V*w+W];$[V]=I}if(O.destroy?.(),R.destroy?.(),!r(E,$))return e(`matmul_q8_vec(${w},${v})`)}for(let A of[{m:20,n:18},{m:32,n:64},{m:70,n:130}]){let w=A.m,v=128,h=A.n,_=t(w*v),y=t(h*v),P=Ce(y),U=this.uploadGpuRaw(new Uint8Array(P.codes.buffer,P.codes.byteOffset,P.codes.byteLength)),B=this.uploadGpuRaw(new Uint8Array(P.scales.buffer,P.scales.byteOffset,P.scales.byteLength)),G=await this.matmulQ8Shared(_,U,B,w,v,h),F=we(P),T=new Float32Array(w*h);for(let D=0;D<w;D++)for(let O=0;O<h;O++){let R=0;for(let E=0;E<v;E++)R+=_[D*v+E]*F[O*v+E];T[D*h+O]=R}if(U.destroy?.(),B.destroy?.(),!r(G,T))return e(`matmul_q8_shared(${w},${h})`)}{let w=t(1632),v=new Uint8Array(w.buffer,w.byteOffset,w.byteLength),h=(_,y)=>_.length===y.length&&_.every((P,U)=>P===y[U]);if(!h(await this.quantizeToBytes("F32",v,1632,"q8"),await this.quantizeToBytes("F32",v,1632,"q8",256)))return e("quantize_chunk_q8");if(!h(await this.quantizeToBytes("F32",v,1632,"q4"),await this.quantizeToBytes("F32",v,1632,"q4",256)))return e("quantize_chunk_q4")}let c=2,l=8,f=t(c*l),p=t(l),g=new Float32Array(c*l);for(let A=0;A<c;A++){let w=0;for(let h=0;h<l;h++)w+=f[A*l+h]**2;let v=1/Math.sqrt(w/l+1e-5);for(let h=0;h<l;h++)g[A*l+h]=f[A*l+h]*v*p[h]}if(!r(await this.rmsnorm(f,p,c,l),g))return e("rmsnorm");if(!r(await this.rmsnorm(f,p,c,l,1e-5,!0),Ge(f,p,c,l,1e-5,!0)))return e("rmsnorm.onePlus");let m=t(16),b=t(16),k=m.map((A,w)=>A/(1+Math.exp(-A))*b[w]);if(!r(await this.swiglu(m,b),k))return e("swiglu");let x=m.map((A,w)=>ir(A)*b[w]);if(!r(await this.geglu(m,b),x))return e("geglu");let M=m.map((A,w)=>A+b[w]);if(!r(await this.add(m,b),M))return e("add");{let A=X.MAX_WG_DIM*ee+257,w=new Float32Array(A),v=new Float32Array(A),h=[0,1,ee-1,ee,X.MAX_WG_DIM*ee-1,X.MAX_WG_DIM*ee,A-1];for(let P of h)w[P]=P%7-3,v[P]=P%5-2;let _=await this.add(w,v),y=_.length===A;for(let P of h)Math.abs(_[P]-(w[P]+v[P]))>1e-5&&(y=!1);if(!y)return e("grid1D.add(2D)")}let q=(A,w,v=.003)=>A.length===w.length&&A.every((h,_)=>Math.abs(h-w[_])<=v*(1+Math.abs(w[_])));{let y=t(8);if(!q(await this.rope(y,2,4,2,1,1e4),Le(y,2,4,2,1,1e4)))return e("rope")}{let y=t(384),P=new Float32Array(64/2).fill(1);if(!q(await this.ropeFactors(y,P,6,64,2,7,5e5),Le(y,6,64,2,7,5e5)))return e("rope_factors.ones");let U=Float32Array.from({length:64/2},(B,G)=>1+G%5*.7);if(!q(await this.ropeFactors(y,U,6,64,2,7,5e5),cn(y,U,6,64,2,7,5e5)))return e("rope_factors")}{let y=t(384);if(!q(await this.rope(y,6,64,2,7,5e5,!0),Ve(y,6,64,2,7,5e5)))return e("rope.interleaved");let P=t(8);if(!q(await this.rope(P,2,4,2,3,1e4,!0),Ve(P,2,4,2,3,1e4)))return e("rope.interleaved.hd4");let U=t(384);if(!q(await this.rope(U,6,64,2,0,5e5,!0),Ve(U,6,64,2,0,5e5)))return e("rope.interleaved.pos0");let B=64/2,G=new Float32Array(384);for(let R=0;R<6;R++)for(let E=0;E<B;E++)G[R*64+2*E]=y[R*64+E],G[R*64+2*E+1]=y[R*64+E+B];let F=await this.rope(G,6,64,2,7,5e5,!0),T=await this.rope(y,6,64,2,7,5e5,!1),D=new Float32Array(384);for(let R=0;R<6;R++)for(let E=0;E<B;E++)D[R*64+2*E]=T[R*64+E],D[R*64+2*E+1]=T[R*64+E+B];if(!q(F,D))return e("rope.interleaved.equivalence");let O=Float32Array.from({length:B},(R,E)=>1+E%5*.7);if(!q(await this.ropeFactors(y,O,6,64,2,7,5e5,!0),Ve(y,6,64,2,7,5e5,O)))return e("rope_factors.interleaved")}{let v=[16,24,24],h=1e6,_=3,y=_*2,P=5,U=t(y*128),B=new Uint32Array(_*3);for(let D=0;D<_;D++){let O=P+D;B.set([O,O,O],D*3)}let G=new Uint32Array([5,5,5,5,6,9,5,7,5]),F=q(await this.ropeMrope(U,B,y,128,2,v,h),Le(U,y,128,2,P,h)),T=q(await this.ropeMrope(U,G,y,128,2,v,h),un(U,G,y,128,2,v,h));(!F||!T)&&(this.mropeOk=!1,console.error(`[selfValidate] rope_mrope KO sur ce GPU (${F?"positions 3D":"d\xE9g\xE9n\xE9r\xE9\u2260rope"}) \u2014 vision d\xE9sactiv\xE9e, chat texte intact.`))}{let P=t(32),U=t(32),B=t(32);if(!q(await this.attention(P,U,B,2,4,2,4,2),ge(P,U,B,2,4,2,4,2)))return e("attention");let G=.3,F=5;if(!q(await this.attention(P,U,B,2,4,2,4,2,G,F),ge(P,U,B,2,4,2,4,2,G,F)))return e("attention.softcap");{let $=t(24),V=t(48),I=t(48);for(let W of[1,4,8,64]){if(!q(await this.attention($,V,I,3,2,1,4,9,void 0,0,W),ge($,V,I,3,2,1,4,9,void 0,0,W)))return e(`attention.window(${W})`);if(!q(await this.attentionDecode($,V,I,3,2,1,4,9,void 0,0,W),ge($,V,I,3,2,1,4,9,void 0,0,W)))return e(`attention_decode.window(${W})`)}}{let T=await this.quantizeKvReadback(U,4,2,4),D=await this.quantizeKvReadback(B,4,2,4),O=await this.attentionQ8Kv(P,T.codes,T.scales,D.codes,D.scales,2,4,2,4,2),R=(I,W)=>{let S=new Float32Array(32);for(let L=0;L<4;L++)for(let H=0;H<2;H++){let K=W[L*2+H];for(let Y=0;Y<4;Y++){let N=L*2*4+H*4+Y,z=I[N>>2]>>(N&3)*8&255;S[N]=(z<128?z:z-256)*K}}return S},E=R(T.codes,T.scales),Q=R(D.codes,D.scales),$=ge(P,E,Q,2,4,2,4,2);if(!q(O,$,.005))return e("attention.q8kv");let V=0;for(let I=0;I<U.length;I++)V=Math.max(V,Math.abs(E[I]-U[I]));if(V>.05)return e("quantize_kv.error")}}{let A=v=>{this.attnDecodeOk=!1,console.error("[selfValidate] attention d\xE9codage HS sur ce GPU (\xE9tape :",v,") \u2192 repli kernels classiques (plus lents \xE0 contexte long, corrects)")},w=[{nT:1,nH:14,nKv:2,hd:64,past:300},{nT:10,nH:14,nKv:2,hd:64,past:173}];for(let v of w){if(!this.attnDecodeOk)break;let h=v.past+v.nT,_=t(v.nT*v.nH*v.hd),y=t(h*v.nKv*v.hd),P=t(h*v.nKv*v.hd);if(!q(await this.attentionDecode(_,y,P,v.nT,v.nH,v.nKv,v.hd,v.past),ge(_,y,P,v.nT,v.nH,v.nKv,v.hd,v.past))){A(`decode(nT=${v.nT})`);break}let U=await this.quantizeKvReadback(y,h,v.nKv,v.hd),B=await this.quantizeKvReadback(P,h,v.nKv,v.hd),G=await this.attentionQ8KvDecode(_,U.codes,U.scales,B.codes,B.scales,v.nT,v.nH,v.nKv,v.hd,v.past),F=await this.attentionQ8Kv(_,U.codes,U.scales,B.codes,B.scales,v.nT,v.nH,v.nKv,v.hd,v.past);if(!q(G,F,.005)){A(`decode.q8kv(nT=${v.nT})`);break}}if(this.attnDecodeOk){let U=t(64),B=t(350*8),G=t(350*8);q(await this.attentionDecode(U,B,G,2,4,2,8,173,.3,5),ge(U,B,G,2,4,2,8,173,.3,5))||A("decode.softcap")}if(this.attnDecodeOk){let U=t(256),B=t(9088),G=t(9088);q(await this.attentionDecode(U,B,G,1,2,1,128,70),ge(U,B,G,1,2,1,128,70))||A("decode.hd128")}}{let A=h=>{this.attnPrefillOk=!1,console.error("[selfValidate] attention prefill tuil\xE9e HS sur ce GPU (\xE9tape :",h,") \u2192 repli kernel classique (plus lent en prefill, correct)")},w=[{nT:37,nH:14,nKv:2,hd:64,past:0,sc:void 0,cap:0,win:0},{nT:13,nH:14,nKv:2,hd:64,past:173,sc:void 0,cap:0,win:0},{nT:1,nH:14,nKv:2,hd:64,past:300,sc:void 0,cap:0,win:0},{nT:4,nH:4,nKv:2,hd:32,past:7,sc:void 0,cap:0,win:0},{nT:5,nH:4,nKv:2,hd:32,past:0,sc:void 0,cap:0,win:0},{nT:9,nH:2,nKv:1,hd:128,past:70,sc:void 0,cap:0,win:0},{nT:6,nH:4,nKv:2,hd:8,past:17,sc:.3,cap:5,win:0}];for(let h of w){let _=h.past+h.nT,y=t(h.nT*h.nH*h.hd),P=t(_*h.nKv*h.hd),U=t(_*h.nKv*h.hd);if(!q(await this.attentionPrefill(y,P,U,h.nT,h.nH,h.nKv,h.hd,h.past,h.sc,h.cap,h.win),ge(y,P,U,h.nT,h.nH,h.nKv,h.hd,h.past,h.sc,h.cap,h.win))){A(`prefill(nT=${h.nT},hd=${h.hd},past=${h.past}${h.cap>0?",softcap":""})`);break}}if(this.attnPrefillOk){let G=t(80),F=t(76),T=t(76);for(let D of[1,4,8,64])if(!q(await this.attentionPrefill(G,F,T,10,2,1,4,9,void 0,0,D),ge(G,F,T,10,2,1,4,9,void 0,0,D))){A(`prefill.window(${D})`);break}}let v=[{nT:37,nH:14,nKv:2,hd:64,past:0,win:0},{nT:13,nH:14,nKv:2,hd:64,past:173,win:0},{nT:10,nH:2,nKv:1,hd:8,past:9,win:4}];for(let h of v){if(!this.attnPrefillOk)break;let _=h.past+h.nT,y=t(h.nT*h.nH*h.hd),P=t(_*h.nKv*h.hd),U=t(_*h.nKv*h.hd),B=await this.quantizeKvReadback(P,_,h.nKv,h.hd),G=await this.quantizeKvReadback(U,_,h.nKv,h.hd),F=await this.attentionQ8KvPrefill(y,B.codes,B.scales,G.codes,G.scales,h.nT,h.nH,h.nKv,h.hd,h.past,void 0,0,h.win),T=await this.attentionQ8Kv(y,B.codes,B.scales,G.codes,G.scales,h.nT,h.nH,h.nKv,h.hd,h.past,void 0,0,h.win);if(!q(F,T,.005)){A(`prefill.q8kv(nT=${h.nT},win=${h.win})`);break}}}{let A=v=>{this.rmsVecOk=!1,console.error("[selfValidate] RMSNorm parall\xE8le HS sur ce GPU (\xE9tape :",v,") \u2192 repli kernel une-ligne-par-thread (correct, plus lent en d\xE9codage)")},w=[{rows:1,dim:1024,onePlus:!1},{rows:1,dim:1536,onePlus:!1},{rows:1,dim:100,onePlus:!1},{rows:14,dim:64,onePlus:!1},{rows:37,dim:2048,onePlus:!1},{rows:3,dim:128,onePlus:!0}];for(let v of w){let h=t(v.rows*v.dim),_=t(v.dim),y=await this.rmsnormVec(h,_,v.rows,v.dim,1e-6,v.onePlus),P=await this.rmsnorm(h,_,v.rows,v.dim,1e-6,v.onePlus);if(!q(y,P,.005)){A(`rmsnorm_vec(${v.rows}\xD7${v.dim}${v.onePlus?",1+w":""})`);break}}}{let A=v=>{this.topKParOk=!1,console.error("[selfValidate] top-K parall\xE8le HS sur ce GPU (\xE9tape :",v,") \u2192 repli s\xE9lection sur un thread (correcte, plus lente)")},w=[{n:151936,k:64,ties:!1,label:"vocab Qwen (151936)"},{n:65536,k:64,ties:!1,label:"vocab World (65536)"},{n:1e3,k:64,ties:!1,label:"n non multiple de 128"},{n:300,k:64,ties:!1,label:"n < 1024 candidats"},{n:4096,k:8,ties:!1,label:"petit K"},{n:8192,k:64,ties:!0,label:"EX \xC6QUO (d\xE9partage)"}];for(let v of w){if(!this.topKParOk)break;let h=v.ties?Float32Array.from({length:v.n},(U,B)=>Math.round(Math.random()*6)+(B%7===0?3:0)):t(v.n),_=await this.topKReadback(h,v.k,"top_k"),y=await this.topKReadback(h,v.k,"top_k_par");if(!(_.length===y.length&&_.every((U,B)=>U===y[B]))){let U=_.findIndex((B,G)=>B!==y[G]);A(`top_k_par(${v.label}) \u2014 premier \xE9cart au rang ${U} : ${_[U]} vs ${y[U]}`);break}}}{let U={seq:3,d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},B={attnNorm:t(16),wq:t(256),wk:t(128),wv:t(128),wo:t(256),bq:t(16),bk:t(8),bv:t(8),ffnNorm:t(16),wgate:t(256),wup:t(256),wdown:t(256)},G=t(48);if(!q(await this.layerForward(G,U,B),dt(G,U,B),.005))return e("layerForward")}{let B={seq:3,d:12,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6,attnScale:1/Math.sqrt(4),attnLogitSoftcap:5,act:"gelu",rmsGainOnePlus:!0},G={attnNorm:t(12),wq:t(192),wk:t(96),wv:t(96),wo:t(192),ffnNorm:t(12),wgate:t(192),wup:t(192),wdown:t(192),postAttnNorm:t(12),postFfnNorm:t(12)},F=t(36);if(!q(await this.layerForward(F,B,G),dt(F,B,G),.005))return e("layerForward.gemma2")}{let B={seq:3,d:12,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e6,eps:1e-6},G={attnNorm:t(12),wq:t(192),wk:t(96),wv:t(96),wo:t(192),ffnNorm:t(12),wgate:t(192),wup:t(192),wdown:t(192),qNorm:t(4),kNorm:t(4)},F=t(36);if(!q(await this.layerForward(F,B,G),dt(F,B,G),.005))return e("layerForward.qwen3")}{let w=new Uint8Array(720);for(let h=0;h<5;h++){let _=h*144,y=new DataView(w.buffer);y.setUint16(_,qe(.005+Math.random()*.05),!0),y.setUint16(_+2,qe(.001+Math.random()*.02),!0);for(let P=4;P<144;P++)w[_+P]=Math.random()*256|0}let v=await this.dequantizeQ4K(w,5*256);if(!q(v,tn(w,5),1e-4))return e("dequant.Q4_K")}{let A=G=>{let F=new Uint8Array(G);for(let T=0;T<G;T++)F[T]=Math.random()*256|0;return F},w=(G,F)=>{let T=new DataView(G.buffer),D=O=>F===210?O*210+208:O*F;for(let O=0;O*F<G.length;O++)T.setUint16(D(O),qe(.005+Math.random()*.05),!0);return G},h=w(A(136),34);if(!q(await this.dequantizeByType("Q8_0",h,128),rn(h,4),1e-4))return e("dequant.Q8_0");let _=w(A(88),22);if(!q(await this.dequantizeByType("Q5_0",_,128),nn(_,4),1e-4))return e("dequant.Q5_0");let y=w(A(840),210);if(!q(await this.dequantizeByType("Q6_K",y,4*256),on(y,4),1e-4))return e("dequant.Q6_K");let P=w(A(72),18);if(!q(await this.dequantizeByType("Q4_0",P,128),an(P,4),1e-4))return e("dequant.Q4_0");let U=A(704),B=new DataView(U.buffer);for(let G=0;G<4;G++)B.setUint16(G*176,qe(.005+Math.random()*.05),!0),B.setUint16(G*176+2,qe(.001+Math.random()*.02),!0);if(!q(await this.dequantizeByType("Q5_K",U,4*256),sn(U,4),1e-4))return e("dequant.Q5_K")}{let P={d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},U={attnNorm:t(16),wq:t(256),wk:t(128),wv:t(128),wo:t(256),bq:t(16),bk:t(8),bv:t(8),ffnNorm:t(16),wgate:t(256),wup:t(256),wdown:t(256)},B=t(48),F=(await this.layerForward(B,{...P,seq:3},U)).slice(32,48),T=new Float32Array(0),D=await this.layerForwardKV(B.slice(0,32),{...P,seq:2},U,0,T,T),O=await this.layerForwardKV(B.slice(32,48),{...P,seq:1},U,2,D.k,D.v);if(!q(O.out,F,.005))return e("layerForwardKV")}{let v=t(4),h=t(40),_=new Float32Array(10);for(let B=0;B<10;B++){let G=0;for(let F=0;F<4;F++)G+=v[F]*h[B*4+F];_[B]=G}let y=0;for(let B=1;B<10;B++)_[B]>_[y]&&(y=B);let P=this.uploadGpu(h),U=await this.argmaxProjection(v,[{buf:P,rows:10,r0:0}],4,10,!1);if(P.destroy?.(),U!==y)return e("argmaxProjection")}{let P={seq:4,d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},U={attnNorm:t(16),wq:t(256),wk:t(128),wv:t(128),wo:t(256),bq:t(16),bk:t(8),bv:t(8),ffnNorm:t(16),wgate:t(256),wup:t(256),wdown:t(256)},B=t(16),G=t(64),F=new Float32Array(0),T=await this.layerForwardKV(G,{...P,seq:4},U,0,F,F,!0),D=Ge(T.out.slice(48,64),B,1,16,1e-6),O={attnNorm:this.uploadGpu(U.attnNorm),wq:this.uploadGpu(U.wq),wk:this.uploadGpu(U.wk),wv:this.uploadGpu(U.wv),wo:this.uploadGpu(U.wo),ffnNorm:this.uploadGpu(U.ffnNorm),wgate:this.uploadGpu(U.wgate),wup:this.uploadGpu(U.wup),wdown:this.uploadGpu(U.wdown),bq:this.uploadGpu(U.bq),bk:this.uploadGpu(U.bk),bv:this.uploadGpu(U.bv)},R=this.uploadGpu(B),E=this.kvQuant;this.kvQuant=!1,this.resetKvGpu();let Q=await this.runDecodeGpu(G,{...P,seq:4},[O],0,R,"selftest-A");if(!q(Q,D,.008))return this.resetKvGpu(),this.kvQuant=E,e("runDecodeGpu.prefill");await this.runDecodeGpu(G.slice(0,48),{...P,seq:3},[O],0,R,"selftest-B");let $=await this.runDecodeGpu(G.slice(48,64),{...P,seq:1},[O],3,R,"selftest-B");if(!q($,D,.008))return this.resetKvGpu(),this.kvQuant=E,e("runDecodeGpu.decode");this.kvQuant=E,this.resetKvGpu();for(let V of Object.values(O))V?.destroy?.();R.destroy?.()}{let _=Float32Array.from({length:152064},()=>(Math.random()*2-1)*8),y=[...new Set(Array.from({length:40},()=>Math.floor(Math.random()*152064)))],P=_.slice();for(let S=0;S<152064;S++)P[S]=30*Math.tanh(P[S]/30);for(let S of y)P[S]=P[S]>0?P[S]/1.15:P[S]*1.15;let U=Array.from(P.keys()).sort((S,L)=>P[L]-P[S]).slice(0,64),B=globalThis,G=[],F=this.storage(152064*4);this.device.queue.writeBuffer(F,0,_),G.push(F);let T=this.device.createCommandEncoder(),D=this.uniform([152064],{offset:4,value:30});this.recordPass(T,"softcap_logits",[D,F],this.grid1D(152064));let O=this.bufU32(Uint32Array.from(y),B.GPUBufferUsage.STORAGE|B.GPUBufferUsage.COPY_DST),R=this.uniform([y.length],{offset:4,value:1.15});this.recordPass(T,"penalize_logits",[R,O,F],this.grid1D(y.length));let E=this.storage(512),Q=this.uniform([152064,64]);this.recordPass(T,this.topKParOk?"top_k_par":"top_k",[Q,F,E],[1,1,1]),G.push(D,O,R,Q,E);let $=this.device.createBuffer({size:512,usage:B.GPUBufferUsage.COPY_DST|B.GPUBufferUsage.MAP_READ});T.copyBufferToBuffer(E,0,$,0,512),this.device.queue.submit([T.finish()]),await $.mapAsync(B.GPUMapMode.READ);let V=new Uint32Array($.getMappedRange().slice(0));$.unmap(),$.destroy(),this.release(G);let I=V.slice(0,64),W=new Float32Array(V.buffer,256,64);this.topKOk=!0;for(let S=0;S<64;S++){let L=Math.abs(W[S]-P[U[S]])<=1e-4*(1+Math.abs(P[U[S]])),H=Math.abs(P[I[S]]-W[S])<=1e-4*(1+Math.abs(W[S]));if(!L||!H){this.topKOk=!1,console.error(`[selfValidate] top_k KO sur ce GPU (rang ${S}) \u2014 repli sur le sampling CPU plein-vocab (plus lent, m\xEAme r\xE9sultat).`);break}}}if(this.rwkvWkv7Ok){let h=t(128),_=t(16),y=t(16),P=t(16),U=t(16),B=t(16),G=Float32Array.from({length:16},()=>Math.random()*.5+.5),F=h.slice(),T=new Float32Array(16);for(let W=0;W<2;W++){let S=W*8;for(let L=0;L<8;L++){let H=W*8*8+L*8,K=P[S+L],Y=0;for(let z=0;z<8;z++)Y+=B[S+z]*F[H+z];let N=0;for(let z=0;z<8;z++){let J=G[S+z]*F[H+z]+K*y[S+z]+U[S+z]*Y;F[H+z]=J,N+=_[S+z]*J}T[S+L]=N}}let D=await this.rwkvWkv7(h.slice(),_,G,y,P,B,U,2,8),O=(W,S)=>W.length===S.length&&W.every((L,H)=>Math.abs(L-S[H])<=.001*(1+Math.abs(S[H])));!O(D.S,F)||!O(D.y,T)?(this.rwkvWkv7Ok=!1,console.error("[selfValidate] RWKV-7 WKV KO sur ce GPU \u2014 une archi RWKV (moteur v2) refuserait de charger (non bloquant pour le chat texte).")):console.log("[selfValidate] RWKV-7 WKV OK (r\xE9currence \xE0 \xE9tat fixe, moteur v2)");let R=16,E=t(R),Q=t(R),$=t(R*6),V=new Float32Array(R*6);for(let W=0;W<6;W++)for(let S=0;S<R;S++){let L=W*R+S;V[L]=E[S]+(Q[S]-E[S])*$[L]}let I=await this.rwkvTokenShift(E,Q,$,R);if(O(I,V)?console.log("[selfValidate] RWKV-7 token-shift OK"):(this.rwkvWkv7Ok=!1,console.error("[selfValidate] RWKV-7 token-shift KO sur ce GPU (non bloquant pour le chat texte).")),this.rwkvResidentOk){let W=globalThis,S=W.GPUBufferUsage.STORAGE|W.GPUBufferUsage.COPY_DST|W.GPUBufferUsage.COPY_SRC,L=2,H=8,K=L*H,Y=(z,J)=>{let ae=Math.max(16,Math.ceil((z.length*4+(J?4:0))/16)*16),oe=this.device.createBuffer({size:ae,usage:W.GPUBufferUsage.UNIFORM|W.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(oe,0,new Uint32Array(z)),J&&this.device.queue.writeBuffer(oe,J.off,new Float32Array([J.val])),oe},N=z=>this.device.createBuffer({size:z*4,usage:S});try{let z=t(K),J=t(K),ae=t(K),oe=Float32Array.from({length:K},()=>Math.random()),de=new Float32Array(K),_e=new Float32Array(K),me=new Float32Array(K);for(let se=0;se<L;se++){let Z=0;for(let fe=0;fe<H;fe++){let ue=z[se*H+fe]*J[se*H+fe];Z+=ue*ue}Z=Math.sqrt(Z)||1e-12;for(let fe=0;fe<H;fe++){let ue=se*H+fe,Ne=z[ue]*J[ue]/Z;_e[ue]=-Ne,me[ue]=Ne*oe[ue],de[ue]=z[ue]*(1+(oe[ue]-1)*ae[ue])}}let xe=N(K),Oe=N(K),re=N(K);this.dispatch("rwkv_kprep",[Y([L,H]),this.buf(z,S),this.buf(oe,S),this.buf(J,S),this.buf(ae,S),xe,Oe,re],this.grid1D(L));let Ae=O(await this.readBack(xe,K*4),de)&&O(await this.readBack(Oe,K*4),_e)&&O(await this.readBack(re,K*4),me);xe.destroy?.(),Oe.destroy?.(),re.destroy?.();let le=t(K),Pt=t(K),Ut=t(K),Gt=t(K),_t=t(K),xt=t(K),Bt=new Float32Array(K);for(let se=0;se<L;se++){let Z=se*H,fe=0;for(let ne=0;ne<H;ne++)fe+=le[Z+ne];fe/=H;let ue=0;for(let ne=0;ne<H;ne++){let Wt=le[Z+ne]-fe;ue+=Wt*Wt}ue/=H;let Ne=1/Math.sqrt(ue+64e-5),Nt=0;for(let ne=0;ne<H;ne++)Nt+=Pt[Z+ne]*de[Z+ne]*Ut[Z+ne];for(let ne=0;ne<H;ne++)Bt[Z+ne]=(le[Z+ne]-fe)*Ne*_t[Z+ne]+xt[Z+ne]+Nt*Gt[Z+ne]}let et=new Float32Array(2*K);et.set(_t,0),et.set(xt,K);let tt=N(K);this.dispatch("rwkv_out_gn",[Y([L,H],{off:8,val:64e-5}),this.buf(le,S),this.buf(Pt,S),this.buf(de,S),this.buf(Ut,S),this.buf(Gt,S),this.buf(et,S),tt],this.grid1D(L));let qt=O(await this.readBack(tt,K*4),Bt);tt.destroy?.();let Ft=t(K),St=t(K),Qr=Float32Array.from(Ft,(se,Z)=>Math.exp(-.606531/(1+Math.exp(-(se+St[Z]))))),rt=N(K);this.dispatch("rwkv_decay",[this.buf(Ft,S),this.buf(St,S),rt],this.grid1D(K));let Tt=O(await this.readBack(rt,K*4),Qr);rt.destroy?.();let Ot=t(K),Mt=t(K),Ct=t(K),Dt=t(K),Vr=Float32Array.from(Ot,(se,Z)=>se+(Mt[Z]-se)*(1/(1+Math.exp(-(Ct[Z]+Dt[Z]))))),nt=this.buf(Ot,S);this.dispatch("rwkv_vresid",[nt,this.buf(Mt,S),this.buf(Ct,S),this.buf(Dt,S)],this.grid1D(K));let Rt=O(await this.readBack(nt,K*4),Vr);nt.destroy?.();let Lt=t(K),jt=t(K),Kt=t(K),$r=Float32Array.from(Lt,(se,Z)=>se+(jt[Z]-se)*Kt[Z]),at=N(K);this.dispatch("rwkv_lerp",[this.buf(Lt,S),this.buf(jt,S),this.buf(Kt,S),at],this.grid1D(K));let Ht=O(await this.readBack(at,K*4),$r);at.destroy?.();let zt=t(K),Ir=Float32Array.from(zt,se=>{let Z=Math.max(se,0);return Z*Z}),st=N(K);this.dispatch("sqrelu",[this.buf(zt,S),st],this.grid1D(K));let Et=O(await this.readBack(st,K*4),Ir);st.destroy?.(),!Ae||!qt||!Tt||!Rt||!Ht||!Et?(this.rwkvResidentOk=!1,console.error(`[selfValidate] glu RWKV r\xE9sidente KO sur ce GPU (kprep:${Ae} gn:${qt} decay:${Tt} vresid:${Rt} lerp:${Ht} sqrelu:${Et}) \u2014 repli forwardToken JS+readback (correct, lent).`)):console.log("[selfValidate] glu RWKV r\xE9sidente OK (kprep, out_gn, decay, vresid, lerp, sqrelu)")}catch(z){this.rwkvResidentOk=!1,console.error("[selfValidate] glu RWKV r\xE9sidente : erreur d\u2019ex\xE9cution \u2014 repli forwardToken JS+readback.",z)}}}if(this.lfm2ShortConvOk){let A=F=>Float32Array.from({length:F},()=>Math.random()*2-1),w=(F,T)=>F.length===T.length&&F.every((D,O)=>Math.abs(D-T[O])<=.001*(1+Math.abs(T[O]))),_=A(96),y=A(64),P=A(96),U=new Float32Array(32),B=y.slice();for(let F=0;F<32;F++){let T=_[F]*_[64+F],D=P[F*3+2]*T;for(let O=0;O<2;O++)D+=P[F*3+O]*y[O*32+F];for(let O=0;O+2<3;O++)B[O*32+F]=y[(O+1)*32+F];B[32+F]=T,U[F]=D*_[32+F]}let G=await this.lfm2ShortConv(_,y.slice(),P,32,3);!w(G.out,U)||!w(G.state,B)?(this.lfm2ShortConvOk=!1,console.error("[selfValidate] LFM2 shortconv KO sur ce GPU \u2014 une archi lfm2 refuserait de charger (non bloquant pour le reste).")):console.log("[selfValidate] LFM2 shortconv OK (conv courte gat\xE9e, moteur v2)")}let C=await this.validateDiffusion();C?console.warn("[selfValidate] image-gen primitive KO:",C,"(non bloquant \u2014 chemin texte intact)"):console.log("[selfValidate] image-gen primitives OK (silu, group_norm, conv2d, conv2d_direct, conv2d_direct_q8, relu, upsample_nearest, layernorm, quick_gelu, attention_full)");let j=await this.validateVideoResident();return j?(this.videoResidentOk=!1,console.warn("[selfValidate] motion r\xE9sident KO:",j,"\u2014 repli JS+readback (plus lent, m\xEAme r\xE9sultat).")):console.log("[selfValidate] motion r\xE9sident OK (video_motion_gather, video_motion_scatter, video_add_pe, attn_temporal)"),!0}async validateVideoResident(){let e=o=>Float32Array.from({length:o},()=>Math.random()*2-1),r=(o,u,c=.005)=>o.length===u.length&&o.every((l,f)=>Math.abs(l-u[f])<=c*(1+Math.abs(u[f])));{let o=e(120),u=new Float32Array(120);for(let f=0;f<5;f++)for(let p=0;p<3;p++)for(let g=0;g<8;g++)u[(f*3+p)*8+g]=o[(p*8+g)*5+f];let c=this.recordingSession(),l=await c.finish(c.videoGather(o,3,8,5),120);if(!r(l,u,1e-6))return"video_motion_gather"}{let o=e(120),u=e(120),c=new Float32Array(120);for(let p=0;p<3;p++)for(let g=0;g<8;g++)for(let m=0;m<5;m++)c[(p*8+g)*5+m]=o[(m*3+p)*8+g]+u[(p*8+g)*5+m];let l=this.recordingSession(),f=await l.finish(l.videoScatter(o,u,3,8,5),120);if(!r(f,c,1e-6))return"video_motion_scatter"}{let o=e(120),u=e(24),c=new Float32Array(120);for(let p=0;p<5;p++)for(let g=0;g<3;g++)for(let m=0;m<8;m++)c[(p*3+g)*8+m]=o[(p*3+g)*8+m]+u[g*8+m];let l=this.recordingSession(),f=await l.finish(l.videoAddPe(o,u,3,8,5),120);if(!r(f,c,1e-6))return"video_add_pe"}{let o=e(120),u=e(120),c=e(120),l=1/Math.sqrt(4),f=new Float32Array(120);for(let m=0;m<5;m++)for(let b=0;b<2;b++){let k=b*4,x=m*3;for(let M=0;M<3;M++){let q=(x+M)*8+k,C=new Float32Array(3),j=-1e30;for(let w=0;w<3;w++){let v=0,h=(x+w)*8+k;for(let _=0;_<4;_++)v+=o[q+_]*u[h+_];C[w]=v*l,C[w]>j&&(j=C[w])}let A=0;for(let w=0;w<3;w++)C[w]=Math.exp(C[w]-j),A+=C[w];for(let w=0;w<3;w++){let v=C[w]/A,h=(x+w)*8+k;for(let _=0;_<4;_++)f[q+_]+=v*c[h+_]}}}let p=this.recordingSession(),g=await p.finish(p.attnTemporal(o,u,c,5,3,2,4),120);if(!r(g,f))return"attn_temporal"}return null}async validateDiffusion(){let e=S=>Float32Array.from({length:S},()=>Math.random()*2-1),r=(S,L,H=.005)=>S.length===L.length&&S.every((K,Y)=>Math.abs(K-L[Y])<=H*(1+Math.abs(L[Y]))),t=e(70),n=t.map(S=>S/(1+Math.exp(-S)));if(!r(await this.silu(t),n))return"silu";let a=4,i=5,s=2,o=1e-5,u=e(a*i),c=e(a),l=e(a),f=new Float32Array(a*i),p=a/s;for(let S=0;S<s;S++){let L=S*p*i,H=p*i,K=0;for(let z=0;z<H;z++)K+=u[L+z];K/=H;let Y=0;for(let z=0;z<H;z++){let J=u[L+z]-K;Y+=J*J}Y/=H;let N=1/Math.sqrt(Y+o);for(let z=0;z<H;z++){let J=S*p+Math.floor(z/i);f[L+z]=(u[L+z]-K)*N*c[J]+l[J]}}if(!r(await this.groupNorm(u,c,l,a,i,s,o),f))return"group_norm";let g=2,m=4,b=4,k=3,x=3,M=1,q=1,C=4,j=4,A=e(g*m*b),w=e(k*g*x*x),v=e(k),h=new Float32Array(k*C*j);for(let S=0;S<k;S++)for(let L=0;L<C;L++)for(let H=0;H<j;H++){let K=v[S];for(let Y=0;Y<g;Y++)for(let N=0;N<x;N++)for(let z=0;z<x;z++){let J=L*M+N-q,ae=H*M+z-q;J>=0&&J<m&&ae>=0&&ae<b&&(K+=A[Y*m*b+J*b+ae]*w[((S*g+Y)*x+N)*x+z])}h[(S*C+L)*j+H]=K}if(!r(await this.conv2d(A,w,v,g,m,b,k,x,x,M,q),h))return"conv2d";if(!r(await this.conv2dDirect(A,w,v,g,m,b,k,x,x,M,q),h))return"conv2d_direct";{let Y=e(1200),N=e(108),z=e(4),J=await this.conv2dDirect(Y,N,z,3,20,20,4,3,3,1,1),ae=this.convTiledOk;this.convTiledOk=!0;let oe=this.recordingSession(),de=await oe.finish(oe.conv2d(Y,N,z,3,20,20,4,3,3,1,1),1600);this.convTiledOk=ae,r(de,J)||(this.convTiledOk=!1,console.warn("[selfValidate] conv2d_3x3_tiled KO sur ce GPU \u2014 repli sur conv2d_direct (plus lent, m\xEAme r\xE9sultat)."))}{let H=e(8*m*b),K=e(32*x*x),Y=e(4),N=Ce(K),z=await this.conv2dDirect(H,we(N),Y,8,m,b,4,x,x,M,q),J={codes:this.uploadGpuRaw(new Uint8Array(N.codes.buffer,N.codes.byteOffset,N.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(N.scales.buffer,N.scales.byteOffset,N.scales.byteLength))},ae=this.recordingSession(),oe=await ae.finish(ae.conv2d(H,J,Y,8,m,b,4,x,x,M,q),4*m*b);if(this.releaseGpu([J.codes,J.sc]),!r(oe,z))return"conv2d_direct_q8"}{let H=e(8*m*b),K=e(32*x*x),Y=e(4),N=Me(K),z=await this.conv2dDirect(H,pe(N),Y,8,m,b,4,x,x,M,q),J={nib:this.uploadGpuRaw(N.nibbles),sc:this.uploadGpuRaw(new Uint8Array(N.scales.buffer,N.scales.byteOffset,N.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(N.mins.buffer,N.mins.byteOffset,N.mins.byteLength))},ae=this.recordingSession(),oe=await ae.finish(ae.conv2d(H,J,Y,8,m,b,4,x,x,M,q),4*m*b);if(this.releaseGpu([J.nib,J.sc,J.mn]),!r(oe,z))return"conv2d_direct_q4"}{let L=e(66),H=new Uint16Array(66);for(let z=0;z<66;z++)H[z]=qe(L[z]);let K=new Float32Array(66);for(let z=0;z<66;z++)K[z]=he(H[z]);let Y=this.f16ToF32Gpu(new Uint8Array(H.buffer,H.byteOffset,H.byteLength),66),N=await this.readGpu(Y,66);if(Y.destroy?.(),!r(N,K,1e-6))return"f16_to_f32"}let _=e(70);if(!r(await this.relu(_),_.map(S=>Math.max(S,0))))return"relu";let y=2,P=2,U=2,B=2,G=P*B,F=U*B,T=e(y*P*U),D=new Float32Array(y*G*F);for(let S=0;S<y;S++)for(let L=0;L<G;L++)for(let H=0;H<F;H++)D[S*G*F+L*F+H]=T[S*P*U+Math.floor(L/B)*U+Math.floor(H/B)];if(!r(await this.upsampleNearest(T,y,P,U,B),D))return"upsample_nearest";let O=2,R=8,E=1e-5,Q=e(O*R),$=e(R),V=e(R),I=new Float32Array(O*R);for(let S=0;S<O;S++){let L=S*R,H=0;for(let N=0;N<R;N++)H+=Q[L+N];H/=R;let K=0;for(let N=0;N<R;N++){let z=Q[L+N]-H;K+=z*z}K/=R;let Y=1/Math.sqrt(K+E);for(let N=0;N<R;N++)I[L+N]=(Q[L+N]-H)*Y*$[N]+V[N]}if(!r(await this.layernorm(Q,$,V,O,R,E),I))return"layernorm";let W=e(70);if(!r(await this.quickGelu(W),W.map(S=>S/(1+Math.exp(-1.702*S)))))return"quick_gelu";{let N=1/Math.sqrt(4),z=e(24),J=e(40),ae=e(40),oe=new Float32Array(24);for(let de=0;de<2;de++)for(let _e=0;_e<3;_e++){let me=new Float32Array(5),xe=-1/0;for(let re=0;re<5;re++){let Ae=0;for(let le=0;le<4;le++)Ae+=z[_e*8+de*4+le]*J[re*8+de*4+le];me[re]=Ae*N,me[re]>xe&&(xe=me[re])}let Oe=0;for(let re=0;re<5;re++)me[re]=Math.exp(me[re]-xe),Oe+=me[re];for(let re=0;re<4;re++){let Ae=0;for(let le=0;le<5;le++)Ae+=me[le]/Oe*ae[le*8+de*4+re];oe[_e*8+de*4+re]=Ae}}if(!r(await this.attentionFull(z,J,ae,3,2,2,4,5),oe))return"attention_full"}if(this.attnFullWgOk){let S=[{nT:70,kvL:70,nH:5,hd:64},{nT:16,kvL:77,nH:5,hd:64},{nT:9,kvL:9,nH:8,hd:160}];for(let L of S){let H=L.nH*L.hd,K=e(L.nT*H),Y=e(L.kvL*H),N=e(L.kvL*H),z=await this.attentionFull(K,Y,N,L.nT,L.nH,L.nH,L.hd,L.kvL),J=await this.attentionFullWg(K,Y,N,L.nT,L.nH,L.nH,L.hd,L.kvL);if(!r(J,z)){this.attnFullWgOk=!1,console.warn(`[selfValidate] attention_full_wg KO sur ce GPU (hd=${L.hd}, kv=${L.kvL}) \u2014 repli sur attention_full (plus lent, m\xEAme r\xE9sultat).`);break}}}return null}};X.timingOn=(()=>{try{return ie("timing")==="1"}catch{return!1}})(),X.profileOn=(()=>{try{return ie("gpuprofile")==="1"}catch{return!1}})(),X.MAX_WG_DIM=65535,X.BLOCK_ELEMS={Q4_K:256,Q5_K:256,Q6_K:256,Q8_0:32,Q5_0:32,Q4_0:32,F32:1,F16:1},X.DEQUANT_SHADER={Q4_K:"dequant_q4k",Q8_0:"dequant_q8_0",Q5_0:"dequant_q5_0",Q6_K:"dequant_q6k",Q4_0:"dequant_q4_0",Q5_K:"dequant_q5k"},X.STORAGE_USAGE=140;$e=X});function ur(d,e){let r=new DataView(d.buffer,d.byteOffset,d.byteLength),t=new Float32Array(e);for(let n=0;n<e;n++)t[n]=ce(r.getUint16(n*2,!0));return t}function cr(d,e){let r=new DataView(d.buffer,d.byteOffset,d.byteLength),t=new Float32Array(e);for(let n=0;n<e;n++)t[n]=r.getFloat32(n*4,!0);return t}function je(d,e,r,t){let n=0;for(let s=0;s<r;s++)n+=d[s]*d[s];let a=1/Math.sqrt(n/r+t),i=new Float32Array(r);for(let s=0;s<r;s++)i[s]=d[s]*a*e[s];return i}var ln,Se,Ie,lr=te(()=>{"use strict";it();ot();De();ln=d=>d/(1+Math.exp(-d)),Se=class Se{constructor(e,r,t){this.engine=e;this.manifest=r;this.raw=t;this.w=new Map;this.g=new Map;this.pos=0;this.rLayers=[];this.tokNormGpu=null;this.normBufs=[];this.ffn=0}isBigProj(e){return/\.(shortconv\.(in_proj|out_proj)|attn_(q|k|v|output)|ffn_(gate|up|down))\.weight$/.test(e)}async load(e){if(!this.engine.lfm2ShortConvOk)throw new Error("kernel shortconv LFM2 invalid\xE9 sur ce GPU (selfValidate) \u2014 archi lfm2 refus\xE9e.");let r=this.manifest.arch;if(this.D=r.d,this.NH=r.nHeads,this.NKV=r.nKvHeads,this.HD=r.headDim,this.NL=r.blockCount,this.vocab=r.vocab,this.EPS=r.rmsEps,this.THETA=r.ropeTheta,!r.lfm2)throw new Error("manifest sans profil lfm2");this.LC=r.lfm2.lCache,this.convLayer=r.lfm2.kvHeadsPerLayer.map(t=>t===0),this.tok=e,this.stops=new Set(this.manifest.chat?.stopTokenIds?.length?this.manifest.chat.stopTokenIds:[7]);for(let[t,n]of Object.entries(this.manifest.tensors)){if(t==="token_embd.weight"){if(this.embedBytes=await this.raw(t),this.embedDtype=n.dtype,n.dtype==="q4"){let i=Ue(this.embedBytes,n.nElems);this.g.set("head",{kind:"q4",nib:this.engine.uploadGpuRaw(i.nibbles),sc:this.up(i.scales),mn:this.up(i.mins),IN:this.D,OUT:this.vocab})}else if(n.dtype==="q8"){let i=Be(this.embedBytes,n.nElems);this.g.set("head",{kind:"q8",codes:this.upI8(i.codes),sc:this.up(i.scales),IN:this.D,OUT:this.vocab})}continue}let a=await this.raw(t);if(this.isBigProj(t)&&(n.dtype==="q4"||n.dtype==="q8")){let i=n.shape[0],s=n.nElems/i;if(n.dtype==="q8"){let o=Be(a,n.nElems);this.g.set(t,{kind:"q8",codes:this.upI8(o.codes),sc:this.up(o.scales),IN:i,OUT:s})}else{let o=Ue(a,n.nElems);this.g.set(t,{kind:"q4",nib:this.engine.uploadGpuRaw(o.nibbles),sc:this.up(o.scales),mn:this.up(o.mins),IN:i,OUT:s})}}else this.w.set(t,n.dtype==="f32"?cr(a,n.nElems):n.dtype==="f16"?ur(a,n.nElems):n.dtype==="q8"?we(Be(a,n.nElems)):pe(Ue(a,n.nElems)))}this.buildResidentLayers(),this.reset()}buildResidentLayers(){let e=r=>{let t=this.engine.uploadGpu(this.w.get(r));return this.normBufs.push(t),t};this.tokNormGpu=e("token_embd_norm.weight"),this.ffn=this.g.get("blk.0.ffn_gate.weight")?.OUT??0,this.rLayers=[];for(let r=0;r<this.NL;r++){let t=`blk.${r}.`,n={attnNorm:e(t+"attn_norm.weight"),ffnNorm:e(t+"ffn_norm.weight"),wgate:this.g.get(t+"ffn_gate.weight"),wup:this.g.get(t+"ffn_up.weight"),wdown:this.g.get(t+"ffn_down.weight")};this.convLayer[r]?this.rLayers.push({conv:!0,...n,convW:e(t+"shortconv.conv.weight"),inProj:this.g.get(t+"shortconv.in_proj.weight"),outProj:this.g.get(t+"shortconv.out_proj.weight")}):this.rLayers.push({conv:!1,...n,qNorm:e(t+"attn_q_norm.weight"),kNorm:e(t+"attn_k_norm.weight"),wq:this.g.get(t+"attn_q.weight"),wk:this.g.get(t+"attn_k.weight"),wv:this.g.get(t+"attn_v.weight"),wo:this.g.get(t+"attn_output.weight")})}}residentAvailable(){return this.engine.lfm2ResidentOk!==!1&&!!this.g.get("head")&&this.rLayers.length===this.NL&&this.ffn>0}cfg(){return{D:this.D,nHeads:this.NH,nKvHeads:this.NKV,headDim:this.HD,ffn:this.ffn,eps:this.EPS,theta:this.THETA,lc:this.LC,vocab:this.vocab}}embedsFor(e){let r=this.D,t=new Float32Array(e.length*r);for(let n=0;n<e.length;n++)t.set(this.embedRow(e[n]),n*r);return t}async logitsGpu(e,r,t){return this.pos=r+e.length,this.engine.lfm2LogitsGpu(this.embedsFor(e),e.length,this.cfg(),this.rLayers,this.g.get("head"),this.tokNormGpu,r,t)}async topKGpu(e,r,t,n,a,i=40){return this.pos=r+e.length,this.engine.lfm2TopKGpu(this.embedsFor(e),e.length,this.cfg(),this.rLayers,this.g.get("head"),this.tokNormGpu,r,t,n,a,i)}async prefillGpu(e,r,t){this.pos=r+e.length,await this.engine.lfm2PrefillGpu(this.embedsFor(e),e.length,this.cfg(),this.rLayers,this.tokNormGpu,r,t)}up(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}upI8(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}unload(){for(let e of this.g.values())for(let r of["nib","sc","mn","codes"])e[r]?.destroy?.();for(let e of this.normBufs)e?.destroy?.();this.normBufs=[],this.rLayers=[],this.tokNormGpu=null,this.engine.clearLfm2State?.(),this.g.clear(),this.w.clear()}reset(){this.pos=0,this.state=Array.from({length:this.NL},(e,r)=>this.convLayer[r]?{conv:new Float32Array((this.LC-1)*this.D)}:{K:[],V:[]})}async gemm(e,r){let t=this.g.get(e);if(!t){let n=this.w.get(e==="head"?"token_embd.weight":e),a=n.length/r.length,i=new Float32Array(a);for(let s=0;s<a;s++){let o=0,u=s*r.length;for(let c=0;c<r.length;c++)o+=n[u+c]*r[c];i[s]=o}return i}return t.kind==="q8"?this.engine.matmulQ8(r,t.codes,t.sc,1,t.IN,t.OUT):this.engine.matmulQ4(r,t.nib,t.sc,t.mn,1,t.IN,t.OUT)}embedRow(e){let r=this.D;if(this.embedDtype==="f16")return ur(this.embedBytes.subarray(e*r*2,e*r*2+r*2),r);if(this.embedDtype==="f32")return cr(this.embedBytes.subarray(e*r*4,e*r*4+r*4),r);if(this.embedDtype==="q8"){let o=this.vocab*r,u=r/32,c=new Int8Array(this.embedBytes.buffer,this.embedBytes.byteOffset+e*r,r),l=this.embedBytes.subarray(o+e*u*2,o+e*u*2+u*2),f=new DataView(l.buffer,l.byteOffset,l.byteLength),p=new Float32Array(r);for(let g=0;g<u;g++){let m=ce(f.getUint16(g*2,!0));for(let b=0;b<32;b++)p[g*32+b]=c[g*32+b]*m}return p}let t=this.vocab*r,n=r/32,a=t/2,i=t/2+t/32*2,s=new Uint8Array(r/2+n*2*2);return s.set(this.embedBytes.subarray(e*r/2,e*r/2+r/2),0),s.set(this.embedBytes.subarray(a+e*n*2,a+e*n*2+n*2),r/2),s.set(this.embedBytes.subarray(i+e*n*2,i+e*n*2+n*2),r/2+n*2),pe(Ue(s,r))}rope(e,r,t){let n=this.HD,a=e.slice();for(let i=0;i<r;i++){let s=i*n;for(let o=0;o<n/2;o++){let u=Math.pow(this.THETA,-2*o/n),c=Math.cos(t*u),l=Math.sin(t*u),f=e[s+o],p=e[s+o+n/2];a[s+o]=f*c-p*l,a[s+o+n/2]=f*l+p*c}}return a}async forwardToken(e){let r=this.D,t=this.pos++,n=this.embedRow(e);for(let a=0;a<this.NL;a++){let i=`blk.${a}.`,s=this.state[a],o=je(n,this.w.get(i+"attn_norm.weight"),r,this.EPS),u;if(this.convLayer[a]){let g=await this.gemm(i+"shortconv.in_proj.weight",o),m=await this.engine.lfm2ShortConv(g,s.conv,this.w.get(i+"shortconv.conv.weight"),r,this.LC);s.conv=m.state,u=await this.gemm(i+"shortconv.out_proj.weight",m.out)}else{let g=await this.gemm(i+"attn_q.weight",o),m=await this.gemm(i+"attn_k.weight",o),b=await this.gemm(i+"attn_v.weight",o),k=this.w.get(i+"attn_q_norm.weight"),x=this.w.get(i+"attn_k_norm.weight");for(let A=0;A<this.NH;A++)g.set(je(g.slice(A*this.HD,(A+1)*this.HD),k,this.HD,this.EPS),A*this.HD);for(let A=0;A<this.NKV;A++)m.set(je(m.slice(A*this.HD,(A+1)*this.HD),x,this.HD,this.EPS),A*this.HD);g=this.rope(g,this.NH,t),m=this.rope(m,this.NKV,t),s.K.push(m),s.V.push(b);let M=new Float32Array(this.NH*this.HD),q=s.K.length,C=1/Math.sqrt(this.HD),j=this.NH/this.NKV;for(let A=0;A<this.NH;A++){let w=Math.floor(A/j),v=A*this.HD,h=w*this.HD,_=new Float32Array(q),y=-1e30;for(let U=0;U<q;U++){let B=0;for(let G=0;G<this.HD;G++)B+=g[v+G]*s.K[U][h+G];_[U]=B*C,_[U]>y&&(y=_[U])}let P=0;for(let U=0;U<q;U++)_[U]=Math.exp(_[U]-y),P+=_[U];for(let U=0;U<q;U++){let B=_[U]/P;for(let G=0;G<this.HD;G++)M[v+G]+=B*s.V[U][h+G]}}u=await this.gemm(i+"attn_output.weight",M)}for(let g=0;g<r;g++)n[g]+=u[g];let c=je(n,this.w.get(i+"ffn_norm.weight"),r,this.EPS),l=await this.gemm(i+"ffn_gate.weight",c),f=await this.gemm(i+"ffn_up.weight",c);for(let g=0;g<l.length;g++)l[g]=ln(l[g])*f[g];let p=await this.gemm(i+"ffn_down.weight",l);for(let g=0;g<r;g++)n[g]+=p[g]}return n=je(n,this.w.get("token_embd_norm.weight"),r,this.EPS),this.gemm("head",n)}async classify(e,r){this.reset();let t;for(let a of this.tok.encode(e))t=await this.forwardToken(a);let n=r.map(a=>{let i=this.tok.encode(a);return{label:a,logit:t[i[1]??i[0]]}}).sort((a,i)=>i.logit-a.logit);return{label:n[0].label,scores:n}}banTools(e){for(let r of Se.TOOL_BAN)r<e.length&&(e[r]=-1e30);return e}sampleTok(e,r,t){let{temperature:n=.8,topK:a=40,repeatPenalty:i=1.3}=t,s=new Set(r),o=[];for(let f=0;f<e.length;f++){let p=e[f];s.has(f)&&(p=p>0?p/i:p*i),o.push({i:f,v:p})}o.sort((f,p)=>p.v-f.v),o.length=a;let u=o[0].v,c=0;for(let f of o)f.p=Math.exp((f.v-u)/n),c+=f.p;let l=Math.random()*c;for(let f of o)if(l-=f.p,l<=0)return f.i;return o[0].i}async generate(e,r,t,n,a){this.reset();let i=this.tok.encode(e),s;for(let u of i)s=await this.forwardToken(u);let o=[];for(let u=0;u<r&&!n?.();u++){this.banTools(s);let c;if(a?.sample)c=this.sampleTok(s,o.slice(-64),a);else{c=0;for(let l=1;l<s.length;l++)s[l]>s[c]&&(c=l)}if(this.stops.has(c))break;o.push(c),t&&t(this.tok.decode(o)),s=await this.forwardToken(c)}return o.length?this.tok.decode(o):""}pickFromTopK(e,r){let t=[],n=[];for(let f=0;f<e.ids.length;f++)if(!Se.TOOL_BAN.includes(e.ids[f])){if(e.vals[f]===-1/0)break;t.push(e.ids[f]),n.push(e.vals[f])}if(!t.length)return e.ids[0];if(!r?.sample)return t[0];let{temperature:a=.8,topK:i=40}=r,s=Math.min(i,t.length),o=n[0],u=0,c=new Array(s);for(let f=0;f<s;f++)c[f]=Math.exp((n[f]-o)/a),u+=c[f];let l=Math.random()*u;for(let f=0;f<s;f++)if(l-=c[f],l<=0)return t[f];return t[0]}async generateResident(e,r,t,n,a){if(!this.residentAvailable())return this.generate(e,r,t,n,a);let i="gen",s=a?.repeatPenalty??(a?.sample?1.3:1),o=this.tok.encode(e),u,c=0;for(;c<o.length;){if(n?.())return"";let p=Math.min(c+Se.PREFILL_CHUNK,o.length),g=o.slice(c,p);p<o.length?await this.prefillGpu(g,c,i):u=await this.topKGpu(g,c,i,[],1,48),c=p}let l=o.length,f=[];for(let p=0;p<r&&!n?.();p++){let g=this.pickFromTopK(u,a);if(this.stops.has(g))break;f.push(g),t&&t(this.tok.decode(f)),u=await this.topKGpu([g],l,i,s!==1?[...new Set(f.slice(-64))]:[],s,48),l++}return f.length?this.tok.decode(f):""}};Se.TOOL_BAN=[8,10,12],Se.PREFILL_CHUNK=128;Ie=Se});function dr(d){if(!d.length)return null;let e=1/0,r=0,t=0;for(let n of d)e=Math.min(e,n.offset),r=Math.max(r,n.offset+n.bytes),t+=n.bytes;return r-e>64<<20||r-e>t*1.5?null:{start:e,end:r}}function fr(d,e){let r=new Map;for(let a of Object.keys(d)){let i=a.match(/^blk\.(\d+)\./);if(!i)continue;let s=r.get(i[1]);s||r.set(i[1],s=[]),s.push(a)}let t=new Map,n=new Map;return async a=>{let i=d[a];if(!i)throw new Error(`tenseur absent : ${a}`);let s=a.match(/^blk\.(\d+)\./),o=s?r.get(s[1]):void 0,u=o?dr(o.map(b=>d[b])):null;if(!s||!o||!u)return e.bytes(i.offset,i.bytes);let c=s[1],l=t.get(c);l||(l=e.bytes(u.start,u.end-u.start).then(b=>({start:u.start,bytes:b})),t.set(c,l),n.set(c,o.length));let{start:f,bytes:p}=await l,g=p.subarray(i.offset-f,i.offset-f+i.bytes),m=(n.get(c)??1)-1;return m<=0?(t.delete(c),n.delete(c),new Uint8Array(g)):(n.set(c,m),g)}}var ft=te(()=>{"use strict"});var pr=te(()=>{"use strict"});function gr(d,e=16){return Math.ceil(d/e)*e}var hr=te(()=>{"use strict"});function fn(d){return gr(Ke+d)}function pt(d){if(d.length<Ke)throw new Error("BRIK: fichier tronqu\xE9 (en-t\xEAte)");let e=String.fromCharCode(d[0],d[1],d[2],d[3]);if(e!==dn)throw new Error(`BRIK: sceau magique absent (${e})`);let r=new DataView(d.buffer,d.byteOffset,d.byteLength),t=r.getUint32(4,!0),n=r.getUint32(8,!0);if(Ke+n>d.length)throw new Error("BRIK: manifeste tronqu\xE9");return{manifest:JSON.parse(new TextDecoder().decode(d.subarray(Ke,Ke+n))),version:t,dataStart:fn(n)}}function mr(d){let{manifest:e,version:r,dataStart:t}=pt(d);return{manifest:e,version:r,dataStart:t,data:d.subarray(t)}}var dn,Ke,vr=te(()=>{"use strict";hr();dn="BRIK",Ke=12});function br(d){let e=[...d].sort((n,a)=>n.id-a.id),r=[],t=0;for(let n of e)r[n.id]=t,t+=n.byteLength;return r}function wr(d){let e=br(d.shards),r={};for(let[n,a]of Object.entries(d.tensors)){let i=pn[a.dtype];if(!i)throw new Error(`dtype BRIK inconnu pour ${n} : ${a.dtype}`);if(e[a.shard]===void 0)throw new Error(`shard ${a.shard} absent du manifeste (tenseur ${n})`);r[n]={offset:e[a.shard]+a.offset,bytes:a.byteLength,nElems:a.nElems,type:i,shape:a.shape}}let t=d.arch;return{arch:t.arch,config:{d:t.d,nHeads:t.nHeads,nKvHeads:t.nKvHeads,headDim:t.headDim,ffn:t.ffn,blockCount:t.blockCount,ropeTheta:t.ropeTheta,rmsEps:t.rmsEps,attnLogitSoftcap:t.attnLogitSoftcap,finalLogitSoftcap:t.finalLogitSoftcap,attnScale:t.attnScale,act:t.act,rmsGainOnePlus:t.rmsGainOnePlus,embedScale:t.embedScale,rwkv:t.rwkv,lfm2:t.lfm2},tensors:r}}var pn,yr=te(()=>{"use strict";pn={f16:"F16",f32:"F32",q4:"Q4W",q8:"Q8W",q3:"Q3W"}});function hn(d,e,r){return`${d}${d.includes("?")?"&":"?"}__brik=${e}-${r}`}async function mn(){try{return await caches.open(gn)}catch{return null}}async function gt(d,e,r,t){let n=e+r-1,a=await mn(),i=hn(d,e,n);if(a){let o=await a.match(i);if(o)return{bytes:new Uint8Array(await o.arrayBuffer()),ranged:!0}}let s;for(let o=0;o<4;o++)try{let u=await fetch(d,{headers:{Range:`bytes=${e}-${n}`},signal:t});if(!u.ok&&u.status!==206)throw new Error(`range fetch ${e}-${n} \xE9chou\xE9 : HTTP ${u.status}`);let c=u.status===206,l=new Uint8Array(await u.arrayBuffer()),f=c?l:l.subarray(e,e+r);if(a&&c)try{await a.put(i,new Response(f,{headers:{"Content-Length":String(f.byteLength)}}))}catch(p){Ur(p)}return{bytes:f,ranged:c}}catch(u){if(t?.aborted)throw u;s=u,o<3&&await new Promise(c=>setTimeout(c,500*2**o))}throw s instanceof Error?s:new Error(String(s))}function Ur(d){kr||(kr=!0,console.warn("[cache] \xE9criture refus\xE9e (quota plein ? navigation priv\xE9e ?) \u2014 les t\xE9l\xE9chargements de mod\xE8les ne seront PAS r\xE9utilisables \xE0 la prochaine visite. Lib\xE9rez de l'espace via le panneau Stockage.",d))}async function vn(d){try{let n=await(await caches.open(Ar)).match(d);if(n)return new Uint8Array(await n.arrayBuffer())}catch{}let e=await fetch(d);if(!e.ok)throw new Error(`HTTP ${e.status}`);let r=new Uint8Array(await e.arrayBuffer());try{await(await caches.open(Ar)).put(d,new Response(r.slice(),{headers:{"Content-Length":String(r.byteLength)}}))}catch(t){Ur(t)}return r}function bn(d,e){return{bytes:async(r,t)=>(await gt(d,e+r,t)).bytes}}function wn(d){return{bytes:async(e,r)=>d.subarray(e,e+r)}}async function Gr(d){let e=await gt(d,0,12);if(!e.ranged){let i=await vn(d),{manifest:s,data:o}=mr(i);return Pr(s,wn(o))}let r=new DataView(e.bytes.buffer,e.bytes.byteOffset,12).getUint32(8,!0),t=await gt(d,0,12+r),{manifest:n,dataStart:a}=pt(t.bytes);return Pr(n,bn(d,a))}function Pr(d,e){if(d.model?.uiArch==="image")throw new Error("Ce fichier est un BRIK image (UNet/CLIP) \u2014 il se charge via la tuile de g\xE9n\xE9ration d'image, pas comme un LLM.");return{source:e,manifest:wr(d),tokenizerId:d.tokenizer?.id,tokenizer:d.tokenizer,uiArch:d.model?.uiArch,modelName:d.model.name}}var gn,kr,Ar,_r=te(()=>{"use strict";"use client";ft();pr();vr();yr();gn="brik-range-v1";kr=!1;Ar="brimkern-model-cache"});function yn(d){let e=d.indexOf("<think>");if(e===-1)return d;let r=d.indexOf("</think>",e);return(r===-1?d.slice(0,e):d.slice(0,e)+d.slice(r+8)).trim()}function xr(d,e,r){d=d.map(n=>n.role==="assistant"?{...n,content:yn(n.content)}:n);let t="";if(e==="deepseek"){t+="<\uFF5Cbegin\u2581of\u2581sentence\uFF5C>",r.trim()&&(t+=r);for(let n of d)n.role==="user"?t+=`<\uFF5CUser\uFF5C>${n.content}`:n.role==="assistant"&&(t+=`<\uFF5CAssistant\uFF5C>${n.content}<\uFF5Cend\u2581of\u2581sentence\uFF5C>`);return t+="<\uFF5CAssistant\uFF5C>",t}if(e==="rwkv7"){r.trim()&&(t+=`System: ${r.trim()}

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
`}return t}var Br=te(()=>{"use strict"});function kn(){let d=[];for(let a=33;a<=126;a++)d.push(a);for(let a=161;a<=172;a++)d.push(a);for(let a=174;a<=255;a++)d.push(a);let e=d.slice(),r=0;for(let a=0;a<256;a++)d.includes(a)||(d.push(a),e.push(256+r),r++);let t=new Array(256),n=new Map;for(let a=0;a<d.length;a++)t[d[a]]=String.fromCodePoint(e[a]),n.set(String.fromCodePoint(e[a]),d[a]);return{enc:t,dec:n}}var qr,Ye,Fr=te(()=>{"use strict";qr="'(?:[sdmt]|ll|ve|re)| ?\\p{L}+| ?\\p{N}+| ?[^\\s\\p{L}\\p{N}]+|\\s+(?!\\S)|\\s+",Ye=class d{constructor(e){this.vocab=new Map;this.idToTok=new Map;this.ranks=new Map;this.added=[];this.specialIds=new Set;this.addedRe=null;this.bosIds=[];this.cache=new Map;let r=typeof e=="string"?JSON.parse(e):e;if(r?.model?.type!=="BPE")throw new Error(`BpeTokenizer : model.type ${r?.model?.type} non couvert (BPE uniquement)`);({enc:this.byteEnc,dec:this.byteDec}=kn());for(let[s,o]of Object.entries(r.model.vocab))this.vocab.set(s,o),this.idToTok.set(o,s);(r.model.merges??[]).forEach((s,o)=>this.ranks.set(Array.isArray(s)?`${s[0]} ${s[1]}`:s,o));for(let s of r.added_tokens??[])this.added.push(s),this.vocab.set(s.content,s.id),this.idToTok.set(s.id,s.content),s.special&&this.specialIds.add(s.id);if(this.added.length){let s=this.added.map(o=>o.content.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).sort((o,u)=>u.length-o.length);this.addedRe=new RegExp(`(${s.join("|")})`,"g")}let n=d.findSplitPattern(r.pre_tokenizer)??qr;this.splitRe=new RegExp(n,"gu");let a=s=>{if(!s)return null;if(s.type==="TemplateProcessing")return s.single;if(s.type==="Sequence")for(let o of s.processors??[]){let u=a(o);if(u)return u}return null},i=a(r.post_processor);if(Array.isArray(i))for(let s of i)if(s.SpecialToken){let o=this.vocab.get(s.SpecialToken.id);o!==void 0&&this.bosIds.push(o)}else break}static findSplitPattern(e){if(!e)return null;if(e.type==="Split"&&e.pattern?.Regex)return e.pattern.Regex;if(e.type==="ByteLevel"&&e.use_regex!==!1)return qr;if(e.type==="Sequence")for(let r of e.pretokenizers??[]){let t=d.findSplitPattern(r);if(t)return t}return null}bpe(e){let r=this.cache.get(e);if(r)return r;let t=Array.from(e);for(;t.length>1;){let a=-1,i=1/0;for(let s=0;s<t.length-1;s++){let o=this.ranks.get(`${t[s]} ${t[s+1]}`);o!==void 0&&o<i&&(i=o,a=s)}if(a<0)break;t=[...t.slice(0,a),t[a]+t[a+1],...t.slice(a+2)]}let n=[];for(let a of t){let i=this.vocab.get(a);if(i!==void 0)n.push(i);else for(let s of a){let o=this.vocab.get(s);o!==void 0&&n.push(o)}}return this.cache.set(e,n),n}encodeChunk(e){let r=[];for(let t of e.match(this.splitRe)??[]){let n=new TextEncoder().encode(t),a="";for(let i of n)a+=this.byteEnc[i];r.push(...this.bpe(a))}return r}encode(e){let r=[...this.bosIds];if(this.addedRe)for(let t of e.split(this.addedRe)){if(!t)continue;let n=this.vocab.get(t);n!==void 0&&this.added.some(a=>a.content===t)?r.push(n):r.push(...this.encodeChunk(t))}else r.push(...this.encodeChunk(e));return r}decode(e){let r=[];for(let t of e){if(this.specialIds.has(t))continue;let n=this.idToTok.get(t);if(n!==void 0)for(let a of n){let i=this.byteDec.get(a);if(i!==void 0)r.push(i);else for(let s of new TextEncoder().encode(a))r.push(s)}}return new TextDecoder("utf-8",{fatal:!1}).decode(new Uint8Array(r))}}});async function Gn(d,e){let r=new $e;if(!await r.init())throw new Error("WebGPU indisponible sur ce navigateur.");r.onLost=p=>{console.warn("[brimkern] device GPU perdu ("+(p?.reason||"unknown")+") \u2014 rechargement au prochain appel"),ke.delete(d)},await r.selfValidate(),e("t\xE9l\xE9chargement du mod\xE8le\u2026");let t=await Gr(d),n=t.manifest;if(!n?.config?.lfm2){let p=n?.arch??n?.config?.arch??"unknown";throw new Error(`Brimkern SDK v0 runs LFM2 .brik models only \u2014 this file's architecture is "${p}". Use the default model (omit \`model\`), or convert/pick an LFM2 .brik. Full model support lives in the app: https://brimkern.com/chat`)}let a=n.tensors["token_embd.weight"],i={arch:{...n.config,arch:"lfm2",vocab:a?a.nElems/n.config.d:0},tensors:Object.fromEntries(Object.entries(n.tensors).map(([p,g])=>[p,{dtype:Pn[g.type]??g.type,shape:g.shape,nElems:g.nElems,shard:0,offset:g.offset,byteLength:g.bytes}])),shards:[{id:0,file:"",byteLength:0}],chat:{template:"chatml",stopTokenIds:[7,2,8,10,12]}},s=Object.values(n.tensors).reduce((p,g)=>p+g.bytes,0),o=0,u=fr(n.tensors,t.source),c=async p=>{let g=n.tensors[p];if(!g)throw new Error(`tenseur absent : ${p}`);let m=await u(p);return o+=g.bytes,e("t\xE9l\xE9chargement du mod\xE8le\u2026",{loaded:o,total:s}),m};e("tokenizer\u2026");let l;try{let p=new Ye(t.tokenizer.json);l={encode:g=>p.encode(g),decode:g=>p.decode(g)}}catch(p){console.warn("[brimkern] tokenizer.json non couvert par le BPE bundl\xE9 \u2014 repli transformers.js (CDN)",p);let g=await import(An),m=new g.PreTrainedTokenizer(JSON.parse(t.tokenizer.json),JSON.parse(t.tokenizer.config));l={encode:b=>Array.from(m(b).input_ids.data,k=>Number(k)),decode:b=>m.decode(b,{skip_special_tokens:!0})}}let f=new Ie(r,i,c);return e("poids sur le GPU\u2026"),await f.load(l),{core:f,engine:r}}function He(d){return d&&(d.startsWith("https://")||/^http:\/\/(localhost|127\.0\.0\.1)[:/]/.test(d))?d:Sr[d||"lfm2.5-230m"]||Sr["lfm2.5-230m"]}function Je(d,e){let r=ke.get(d);if(!r){let t={status:"initialisation\u2026",state:"loading",listeners:new Set,promise:null};t.promise=Gn(d,(n,a)=>{t.status=n,t.progress=a,t.listeners.forEach(i=>i(n,a))}).then(n=>(t.state="ready",n)).catch(n=>{throw t.state="error",ke.delete(d),n}),ke.set(d,t),r=t}return e&&(e(r.status,r.progress),r.listeners.add(e),r.promise.finally(()=>r.listeners.delete(e)).catch(()=>{})),r.promise}async function Tr(d,e){let r=await Je(d,e);return r.engine.lost?(ke.delete(d),(await Je(d,e)).core):r.core}async function Or(d,e){let r=await Tr(d);try{return await e(r)}catch(t){let n=ke.get(d);if(!(!n||await n.promise.then(i=>i.engine.lost).catch(()=>!0)))throw t;return console.warn("[brimkern] g\xE9n\xE9ration interrompue par une perte de device \u2014 nouvelle tentative"),ke.delete(d),e(await Tr(d))}}function _n(d,e){let r=d.replace(/<\|[a-z_]+\|>/g,"");if(e){let t=r.replace(/^\s*(hello|hi|hey|bonjour|salut)\s*[!,.]\s*/i,"");t.trim()&&(r=t)}return r.trimEnd()}async function Mr(d,e,r,t,n,a,i,s=[]){let o=xr([...s,...e.slice(-Un)],"lfm2",r),u=s.some(f=>f.role==="assistant")||e.some(f=>f.role==="assistant"),c="";return await(d.residentAvailable?.()?d.generateResident.bind(d):d.generate.bind(d))(o,t,f=>{c=_n(f,u),a?.(c)},i,{sample:!0,temperature:n,topK:40,repeatPenalty:1.3}),c}var An,Sr,Pn,Un,ke,ht=te(()=>{"use strict";or();lr();_r();ft();Br();Fr();An="https://esm.sh/@huggingface/transformers@4.2.0",Sr={"lfm2.5-230m":"https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik"},Pn={F16:"f16",F32:"f32",Q4W:"q4",Q8W:"q8",Q3W:"q3"},Un=12;ke=new Map});var Cr={};Qt(Cr,{LocalBackend:()=>ze});var ze,mt=te(()=>{"use strict";ht();ze=class{constructor(){this.kind="main"}async preload(e,r){await Je(e,r)}state(e){return ke.get(e)?.state}turn(e,r,t){return Or(e.url,n=>Mr(n,e.history,e.system,e.maxTokens,e.temperature,r,()=>!!t?.aborted,e.pinned))}dispose(){}}});function xn(){try{if(typeof document>"u")return"";let d=document.currentScript;if(d?.src)return new URL(d.src,document.baseURI).href}catch{}return""}function Rr(d){Dr=d}function Lr(){return Dr||Bn}var Bn,Dr,vt=te(()=>{"use strict";Bn=xn(),Dr=""});var jr={};Qt(jr,{WorkerBackend:()=>bt});var bt,Kr=te(()=>{"use strict";vt();bt=class{constructor(){this.kind="worker";this.seq=0;this.pending=new Map;this.states=new Map;if(typeof Worker>"u")throw new Error("Worker indisponible");let e=Lr();if(!e)throw new Error("URL du script introuvable (import ESM ?) \u2014 passez workerUrl");let r=(()=>{try{return location.search}catch{return""}})(),t=`self.__brimkernSearch=${JSON.stringify(r)};importScripts(${JSON.stringify(e)});`,n=new Blob([t],{type:"text/javascript"});this.url=URL.createObjectURL(n),this.worker=new Worker(this.url);let a,i;this.hello=new Promise((s,o)=>{a=s,i=o}),this.worker.onerror=s=>i(new Error(`worker: ${s.message||"\xE9chec de chargement"}`)),this.worker.onmessage=s=>{let o=s.data;if(o.type==="hello"){a();return}let u=this.pending.get(o.id);if(u){if(o.type==="progress"){u.onProgress?.(o.status,o.progress);return}if(o.type==="token"){u.onToken?.(o.text);return}this.pending.delete(o.id),o.type==="error"?u.reject(new Error(o.message)):o.type==="state"?u.resolve(o.state):u.resolve(o.text??"")}}}ready(){return this.hello}send(e,r={}){let t=++this.seq,n=new Promise((a,i)=>{this.pending.set(t,{resolve:a,reject:i,...r}),this.worker.postMessage({...e,id:t})});return{id:t,done:n}}async preload(e,r){await this.hello,this.states.get(e)!=="ready"&&this.states.set(e,"loading");try{await this.send({type:"preload",url:e},{onProgress:r}).done,this.states.set(e,"ready")}catch(t){throw this.states.set(e,"error"),t}}state(e){return this.states.get(e)}async turn(e,r,t){await this.hello;let{id:n,done:a}=this.send({type:"turn",req:e},{onToken:r}),i=()=>this.worker.postMessage({type:"stop",id:n});t?.aborted?i():t?.addEventListener("abort",i,{once:!0});try{let s=await a;return this.states.set(e.url,"ready"),s}finally{t?.removeEventListener("abort",i)}}dispose(){this.worker.terminate(),URL.revokeObjectURL(this.url);for(let e of this.pending.values())e.reject(new Error("worker arr\xEAt\xE9"));this.pending.clear()}}});var qn={};var wt,Xe,Te,zr=te(()=>{"use strict";mt();wt=new ze,Xe=new Set,Te=d=>self.postMessage(d);self.onmessage=async d=>{let e=d.data;if(e.type==="stop"){Xe.add(e.id);return}if(e.type==="state"){Te({type:"state",id:e.id,state:wt.state(e.url)});return}try{if(e.type==="preload"){await wt.preload(e.url,(r,t)=>Te({type:"progress",id:e.id,status:r,progress:t})),Te({type:"done",id:e.id});return}if(e.type==="turn"){let r=new AbortController,t=new Proxy(r.signal,{get:(u,c)=>c==="aborted"?Xe.has(e.id):Reflect.get(u,c)}),n=16,a=0,i=null,s=()=>{i!==null&&(Te({type:"token",id:e.id,text:i}),i=null,a=Date.now())},o=await wt.turn(e.req,u=>{i=u,Date.now()-a>=n&&s()},t);s(),Te({type:"done",id:e.id,text:o}),Xe.delete(e.id);return}}catch(r){Xe.delete(e.id),Te({type:"error",id:e.id,message:r instanceof Error?r.message:String(r)})}};Te({type:"hello"})});var Jr=new Set(["avec","pour","dans","les","des","une","est","sur","par","que","qui","quoi","comment","pourquoi","quand","vous","nous","votre","notre","mais","plus","tout","tous","cette","sont","avez","puis","faire","fait","the","and","for","with","what","who","how","why","when","about","your","our","you","are","can","does","did","this","that","from","have"]);function Vt(d){let e=(d.toLowerCase().match(/[\p{L}\p{N}]{3,}/gu)??[]).filter(r=>!Jr.has(r));return[...new Set(e)]}function $t(d,e=600){let r=[];return d.forEach((t,n)=>{let a=(t.title||"").trim(),i=(t.text||"").split(/\n\s*\n+/).map(u=>u.trim()).filter(Boolean),s="",o=()=>{s.trim()&&r.push({title:a,text:s.trim(),doc:n}),s=""};for(let u of i){if(u.length>e*1.6){o();let c=u.split(/(?<=[.!?])\s+/),l="";for(let f of c)l&&(l+" "+f).length>e?(r.push({title:a,text:l.trim(),doc:n}),l=f):l=l?`${l} ${f}`:f;l.trim()&&r.push({title:a,text:l.trim(),doc:n});continue}s&&(s+`

`+u).length>e&&o(),s=s?`${s}

${u}`:u}o()}),r}function Xr(d,e,r){if(!d.length)return 0;let t=`${e.title} ${e.text}`.toLowerCase(),n=e.title.toLowerCase(),a=0,i=0;for(let s of d){let o=r.get(s)??1;i+=o,t.includes(s)&&(a+=o*(n.includes(s)?1.5:1))}return i?a/i:0}function Zr(d){let e=new Map;for(let n of d)for(let a of Vt(`${n.title} ${n.text}`))e.set(a,(e.get(a)??0)+1);let r=new Map,t=Math.max(1,d.length);for(let[n,a]of e)r.set(n,Math.log(1+t/a));return r}function It(d,e,r=1200,t=3,n=.34){let a=Vt(d);if(!a.length||!e.length)return[];let i=Zr(e),s=e.map(l=>({c:l,s:Xr(a,l,i)})).filter(l=>l.s>=n).sort((l,f)=>f.s-l.s),o=[],u=new Set,c=r;for(let{c:l}of s)o.length>=t||l.text.length>c||u.has(l.doc)||(o.push(l),u.add(l.doc),c-=l.text.length);for(let{c:l}of s){if(o.length>=t)break;o.includes(l)||l.text.length>c||(o.push(l),c-=l.text.length)}return o}function Yt(d){return d.length?`

Answer using ONLY the reference notes below. If the answer is not in them, say you do not have that information \u2014 never fill the gap with what you assume.

--- NOTES ---
${d.map((r,t)=>`[${t+1}]${r.title?` ${r.title}`:""}
${r.text}`).join(`

`)}
--- END OF NOTES ---`:`

No reference note matches this question. Say that you do not have this information \u2014 do not guess.`}function Jt(d){let e=Array.isArray(d)?d:[d],r=[];for(let t of e)typeof t=="string"&&t.trim()?r.push({text:t}):t&&typeof t=="object"&&typeof t.text=="string"&&t.text.trim()&&r.push({title:t.title,text:t.text});return r}ht();async function Hr(d){let{LocalBackend:e}=await Promise.resolve().then(()=>(mt(),Cr));if(d!==!0)return new e;try{let{WorkerBackend:r}=await Promise.resolve().then(()=>(Kr(),jr)),t=new r;return await t.ready(),t}catch(r){return console.warn("[brimkern] Web Worker indisponible \u2014 inf\xE9rence sur le thread principal",r),new e}}vt();var Fn=typeof self<"u"&&typeof self.importScripts=="function"&&typeof document>"u";Fn&&Promise.resolve().then(()=>(zr(),qn));var Ze=null,kt=null,yt;function Ee(){return Ze||(Ze=Hr(yt).then(d=>(kt=d,d))),Ze}var Sn=()=>kt?.kind??"pending";function At(d){if(d.workerUrl&&Rr(d.workerUrl),d.worker!==void 0){if(Ze&&yt!==d.worker){console.warn("[brimkern] option `worker` ignor\xE9e : le backend est d\xE9j\xE0 d\xE9marr\xE9 et partag\xE9 par la page.");return}yt=d.worker}}var Tn=`
Answer briefly and honestly. If you do not know something, say so \u2014 never invent facts or details.
You have no tools and no internet access: never emit tool calls, reply in plain text only.`;function Nr(d){let e=(d.system||"You are a helpful assistant.")+Tn,r=i=>i.flatMap(s=>[{role:"user",content:s.user},{role:"assistant",content:s.assistant}]);if(!d.knowledge)return{system:()=>e,userTurn:i=>i,pinned:r(d.examples||[])};let t=$t(Jt(d.knowledge)),n=d.knowledgeBudget??1200,a=e+`

The user message may include reference notes between --- markers. When it does, answer from those notes and quote their figures exactly. When it says no note matches, say you do not have that information.`;return{system:()=>a,userTurn:i=>Yt(It(i,t,n)).trim()+`

Question: ${i}`,pinned:r([...On(),...d.examples||[]])}}function On(){return[{user:`--- NOTES ---
[1] Opening hours
The workshop is open on Thursday until 8pm.
--- END OF NOTES ---

Question: Are you open on Thursday evening?`,assistant:"Yes \u2014 the workshop is open on Thursday until 8pm."},{user:`No reference note matches this question.

Question: Who won the 1998 World Cup?`,assistant:"I do not have that information in my notes."}]}function Wr(d={}){At(d);let e=He(d.model),r=d.maxTokens||220,t=d.temperature??.55,n=Nr(d),a=n.pinned,i=[],s=!1,o=!1;return{async ask(u,c={}){if(o)throw new Error("session d\xE9truite");if(s)throw new Error("g\xE9n\xE9ration d\xE9j\xE0 en cours sur cette session");s=!0,i.push({role:"user",content:u});try{let l=[...i.slice(0,-1),{role:"user",content:n.userTurn(u)}],f={url:e,history:l,system:n.system(u),maxTokens:r,temperature:t,pinned:a},p=await(await Ee()).turn(f,c.onToken,c.signal);return c.signal?.aborted?(i.pop(),""):(i.push({role:"assistant",content:p}),p)}catch(l){throw i.pop(),l}finally{s=!1}},reset(){i=[]},destroy(){o=!0,i=[]},get history(){return i.slice()}}}function Mn(d){if(document.getElementById("bk-style"))return;let e=document.createElement("style");e.id="bk-style",e.textContent=`
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
  `,document.head.appendChild(e)}function Cn(d){if(!d)return"#c72c1e";if(/^#[0-9a-fA-F]{3,8}$/.test(d))return d;try{if(typeof CSS<"u"&&CSS.supports("color",d)&&!/[{};()]/.test(d))return d}catch{}return"#c72c1e"}function Er(d){let e=Nr(d),r=Cn(d.accent),t=d.title||"Assistant",n=d.maxTokens||220;Mn(r);let a=document.createElement("button");a.className="bk-fab",a.setAttribute("aria-label","Ouvrir le chat"),a.textContent="\u{1F4AC}";let i=document.createElement("div");i.className="bk-panel",i.innerHTML=`
    <div class="bk-hd"><span class="bk-dot"></span><span>${Dn(t)}</span><button class="bk-x" aria-label="Fermer">\xD7</button></div>
    <div class="bk-msgs"></div>
    <div class="bk-foot"><textarea class="bk-in" rows="1" placeholder="\xC9cris un message\u2026"></textarea><button class="bk-send">\u2191</button></div>
    <div class="bk-note">IA locale \u2014 tourne sur votre GPU, aucune donn\xE9e envoy\xE9e.</div>`,document.body.appendChild(a),document.body.appendChild(i);let s=i.querySelector(".bk-msgs"),o=i.querySelector(".bk-in"),u=i.querySelector(".bk-send"),c=[],l=!1,f=!1,p=(k,x)=>{let M=document.createElement("div");return M.className=`bk-m ${k==="user"?"bk-u":"bk-a"}`,M.textContent=x,s.appendChild(M),s.scrollTop=s.scrollHeight,M};d.greeting&&(c.push({role:"assistant",content:d.greeting}),p("assistant",d.greeting));let g=He(d.model),m=()=>{if(!f){f=!0;let k=p("assistant","Initialisation\u2026");k.classList.add("bk-status"),Ee().then(x=>x.preload(g,(M,q)=>{k.textContent=q?.total?`${M} ${Math.round(q.loaded/1048576)} / ${Math.round(q.total/1048576)} Mo`:M})).then(()=>k.remove()).catch(x=>{k.textContent="Erreur : "+(x?.message||x),f=!1})}return Ee()},b=async()=>{let k=o.value.trim();if(!k||l)return;l=!0,u.disabled=!0,o.value="",c.push({role:"user",content:k}),p("user",k);let x=p("assistant","\u2026");try{await m();let M=[...c.slice(0,-1),{role:"user",content:e.userTurn(k)}],q={url:g,history:M,system:e.system(k),maxTokens:n,temperature:.55,pinned:e.pinned},C=await(await Ee()).turn(q,j=>{x.textContent=j||"\u2026",s.scrollTop=s.scrollHeight});C||(C="Sorry, I can only answer in plain text here \u2014 could you rephrase?"),x.textContent=C,c.push({role:"assistant",content:C})}catch(M){x.textContent="Erreur : "+(M?.message||String(M))}finally{l=!1,u.disabled=!1,o.focus()}};a.onclick=()=>{i.classList.toggle("bk-open")&&(o.focus(),m())},i.querySelector(".bk-x").onclick=()=>i.classList.remove("bk-open"),u.onclick=()=>{b()},o.onkeydown=k=>{k.key==="Enter"&&!k.shiftKey&&(k.preventDefault(),b())}}function Dn(d){return d.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}var Rn=(d={})=>{if(typeof window>"u"||typeof document>"u"){console.warn("[brimkern] embed() ignor\xE9 : aucun DOM (rendu serveur ?). Appelez-le dans un effet client.");return}At(d),document.body?Er(d):window.addEventListener("DOMContentLoaded",()=>Er(d))};var Ln=async d=>{if(typeof d!="object"||d===null||typeof d.prompt!="string")throw new TypeError(`Brimkern.generate expects a single object: generate({ prompt: "\u2026", model?, system? }). Received ${typeof d}${typeof d=="object"&&d?" without a `prompt` string":""}.`);return Wr(d).ask(d.prompt,{onToken:d.onToken,signal:d.signal})},jn=(d={})=>(At(d),typeof navigator<"u"&&"gpu"in navigator?Ee().then(e=>e.preload(He(d.model),d.onProgress)).then(()=>!0).catch(()=>!1):Promise.resolve(!1)),Kn=d=>typeof navigator>"u"||!("gpu"in navigator)?"unavailable":kt?.state(He(d))??"idle";typeof window<"u"&&(window.Brimkern={embed:Rn,createSession:Wr,generate:Ln,preload:jn,status:Kn,runtime:Sn});})();
