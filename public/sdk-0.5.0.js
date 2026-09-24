"use strict";(()=>{var Gs=Object.defineProperty;var ae=(f,e,r)=>()=>{if(r)throw r[0];try{return f&&(e=f(f=0)),e}catch(t){throw r=[t],t}};var Vr=(f,e)=>{for(var r in e)Gs(f,r,{get:e[r],enumerable:!0})};function je(f){let e=new Float32Array(1),r=new Uint32Array(e.buffer);e[0]=f;let t=r[0],n=t>>16&32768,s=(t>>23&255)-127+15,i=t&8388607;return s<=0?n:s>=31?n|31743:(i=(i>>13)+(i>>12&1),i===1024&&(i=0,s+=1),n|s<<10|i&1023)}function ge(f){let e=f>>15&1,r=f>>10&31,t=f&1023,n;return r===0?n=t*59604645e-15:r===31?n=t?NaN:1/0:n=(1+t/1024)*2**(r-15),e===1?-n:n}var Ze=ae(()=>{"use strict"});function Oe(f){let e=f.length;if(e%Fe!==0)throw new Error(`q4web: length ${e} not a multiple of ${Fe}`);let r=e/Fe,t=new Uint8Array(e/2),n=new Uint16Array(r),s=new Uint16Array(r);for(let i=0;i<r;i++){let a=i*Fe,o=1/0,u=-1/0;for(let m=0;m<Fe;m++){let w=f[a+m];w<o&&(o=w),w>u&&(u=w)}let c=(u-o)/15||1e-8,l=je(c),d=je(o);n[i]=l,s[i]=d;let p=ge(l)||1e-8,g=ge(d);for(let m=0;m<Fe;m++){let w=Math.round((f[a+m]-g)/p);w=w<0?0:w>15?15:w;let v=a+m;(m&1)===0?t[v>>1]=w:t[v>>1]|=w<<4}}return{nibbles:t,scales:n,mins:s,nElems:e}}function we(f,e){let r=e/Fe,t=e/2,n=f.slice(0,t),s=new Uint16Array(r),i=new Uint16Array(r),a=new DataView(f.buffer,f.byteOffset);for(let o=0;o<r;o++)s[o]=a.getUint16(t+o*2,!0);for(let o=0;o<r;o++)i[o]=a.getUint16(t+r*2+o*2,!0);return{nibbles:n,scales:s,mins:i,nElems:e}}function me(f){let e=new Float32Array(f.nElems),r=f.nElems/Fe;for(let t=0;t<r;t++){let n=ge(f.scales[t]),s=ge(f.mins[t]),i=t*Fe;for(let a=0;a<Fe;a++){let o=i+a,u=f.nibbles[o>>1],c=(a&1)===0?u&15:u>>4;e[o]=c*n+s}}return e}var Fe,ot=ae(()=>{"use strict";Ze();Fe=32});function Te(f){let e=f.length;if(e%Me!==0)throw new Error(`q8web: length ${e} not a multiple of ${Me}`);let r=e/Me,t=new Int8Array(e),n=new Uint16Array(r);for(let s=0;s<r;s++){let i=s*Me,a=0;for(let l=0;l<Me;l++){let d=Math.abs(f[i+l]);d>a&&(a=d)}let o=a/127||1e-8,u=je(o);n[s]=u;let c=ge(u)||1e-8;for(let l=0;l<Me;l++){let d=Math.round(f[i+l]/c);d=d<-127?-127:d>127?127:d,t[i+l]=d}}return{codes:t,scales:n,nElems:e}}function _e(f,e){let r=e/Me,t=new Int8Array(f.buffer.slice(f.byteOffset,f.byteOffset+e)),n=new Uint16Array(r),s=new DataView(f.buffer,f.byteOffset);for(let i=0;i<r;i++)n[i]=s.getUint16(e+i*2,!0);return{codes:t,scales:n,nElems:e}}function ve(f){let e=new Float32Array(f.nElems),r=f.nElems/Me;for(let t=0;t<r;t++){let n=ge(f.scales[t]),s=t*Me;for(let i=0;i<Me;i++)e[s+i]=f.codes[s+i]*n}return e}var Me,ut=ae(()=>{"use strict";Ze();Me=32});function an(f){let e=f.length;if(e%Ce!==0)throw new Error(`q3web: length ${e} not a multiple of ${Ce}`);let r=e/Ce,t=new Uint32Array(e/16),n=new Uint32Array(e/32),s=new Uint16Array(r),i=new Uint16Array(r);for(let a=0;a<r;a++){let o=a*Ce,u=1/0,c=-1/0;for(let w=0;w<Ce;w++){let v=f[o+w];v<u&&(u=v),v>c&&(c=v)}let l=(c-u)/7||1e-8,d=je(l),p=je(u);s[a]=d,i[a]=p;let g=ge(d)||1e-8,m=ge(p);for(let w=0;w<Ce;w++){let v=Math.round((f[o+w]-m)/g);v=v<0?0:v>7?7:v;let G=o+w;t[G>>4]|=(v&3)<<(G&15)*2,n[G>>5]|=v>>2<<(G&31)}}return{lo:t,hi:n,scales:s,mins:i,nElems:e}}function Ue(f,e){let r=e/Ce,t=e/16,n=e/32,s=t*4,i=n*4,a=new DataView(f.buffer,f.byteOffset),o=new Uint32Array(t),u=new Uint32Array(n),c=new Uint16Array(r),l=new Uint16Array(r);for(let g=0;g<t;g++)o[g]=a.getUint32(g*4,!0);for(let g=0;g<n;g++)u[g]=a.getUint32(s+g*4,!0);let d=s+i,p=d+r*2;for(let g=0;g<r;g++)c[g]=a.getUint16(d+g*2,!0);for(let g=0;g<r;g++)l[g]=a.getUint16(p+g*2,!0);return{lo:o,hi:u,scales:c,mins:l,nElems:e}}function Ke(f){let e=new Float32Array(f.nElems),r=f.nElems/Ce;for(let t=0;t<r;t++){let n=ge(f.scales[t]),s=ge(f.mins[t]),i=t*Ce;for(let a=0;a<Ce;a++){let o=i+a,u=f.lo[o>>4]>>(o&15)*2&3|(f.hi[o>>5]>>(o&31)&1)<<2;e[o]=u*n+s}}return e}var Ce,ct=ae(()=>{"use strict";Ze();Ce=32});var on,un,cn=ae(()=>{"use strict";on={matmul:`
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
		}`,matmul_t_q4k_vec:`
		struct Dims { m: u32, k: u32, n: u32, stride: u32 };
		@group(0) @binding(0) var<uniform> d: Dims;
		@group(0) @binding(1) var<storage, read> a: array<vec4<f32>>;
		@group(0) @binding(2) var<storage, read> q: array<u32>;
		@group(0) @binding(3) var<storage, read_write> c: array<f32>;
		var<workgroup> part: array<f32, 64>;
		fn f16d(h: u32) -> f32 {
			let s = (h >> 15u) & 1u; let e = (h >> 10u) & 0x1Fu; let m = h & 0x3FFu; var v: f32;
			if (e == 0u) { v = f32(m) * 5.9604645e-8; } else if (e == 31u) { v = 65504.0; }
			else { v = (1.0 + f32(m) / 1024.0) * pow(2.0, f32(e) - 15.0); }
			return select(v, -v, s == 1u);
		}
		fn byteAt(base: u32, k: u32) -> u32 { return (q[base + (k >> 2u)] >> ((k & 3u) * 8u)) & 0xFFu; }
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let col = wid.y * d.stride + wid.x;
			let tid = lid.x;
			let nSub = d.k / 32u;
			var acc = 0.0;
			if (col < d.n) {
				let rowBase = col * (d.k / 256u) * 36u;
				for (var g = tid; g < nSub; g = g + 64u) {
					let base = rowBase + (g >> 3u) * 36u;
					let j = g & 7u;
					let dm = q[base];
					var sc6: u32; var mn6: u32;
					if (j < 4u) {
						sc6 = byteAt(base, 4u + j) & 63u;
						mn6 = byteAt(base, 8u + j) & 63u;
					} else {
						sc6 = (byteAt(base, 8u + j) & 0xFu) | ((byteAt(base, j) >> 6u) << 4u);
						mn6 = (byteAt(base, 8u + j) >> 4u) | ((byteAt(base, 4u + j) >> 6u) << 4u);
					}
					let w0 = base + 4u + (j >> 1u) * 8u;
					let sh = (j & 1u) * 4u;
					let aBase = g * 8u;
					var s = 0.0; var sa = 0.0;
					for (var w = 0u; w < 8u; w = w + 1u) {
						let word = q[w0 + w] >> sh;
						let v = vec4<f32>(f32(word & 0xFu), f32((word >> 8u) & 0xFu), f32((word >> 16u) & 0xFu), f32((word >> 24u) & 0xFu));
						let av = a[aBase + w];
						s = s + dot(av, v);
						sa = sa + av.x + av.y + av.z + av.w;
					}
					acc = acc + f16d(dm & 0xFFFFu) * f32(sc6) * s - f16d(dm >> 16u) * f32(mn6) * sa;
				}
			}
			part[tid] = acc;
			workgroupBarrier();
			for (var stride = 32u; stride > 0u; stride = stride >> 1u) {
				if (tid < stride) { part[tid] = part[tid] + part[tid + stride]; }
				workgroupBarrier();
			}
			if (tid == 0u && col < d.n) { c[col] = part[0]; }
		}`,matmul_t_q6k_vec:`
		struct Dims { m: u32, k: u32, n: u32, stride: u32 };
		@group(0) @binding(0) var<uniform> d: Dims;
		@group(0) @binding(1) var<storage, read> a: array<f32>;
		@group(0) @binding(2) var<storage, read> q: array<u32>;
		@group(0) @binding(3) var<storage, read_write> c: array<f32>;
		var<workgroup> part: array<f32, 64>;
		fn gb(i: u32) -> u32 { return (q[i >> 2u] >> ((i & 3u) * 8u)) & 0xFFu; }
		fn f16d(h: u32) -> f32 {
			let s = (h >> 15u) & 1u; let e = (h >> 10u) & 0x1Fu; let m = h & 0x3FFu; var v: f32;
			if (e == 0u) { v = f32(m) * 5.9604645e-8; } else if (e == 31u) { v = 65504.0; }
			else { v = (1.0 + f32(m) / 1024.0) * pow(2.0, f32(e) - 15.0); }
			return select(v, -v, s == 1u);
		}
		fn si8(b: u32) -> f32 { let s = i32(b); return f32(select(s, s - 256, s > 127)); }
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let col = wid.y * d.stride + wid.x;
			let tid = lid.x;
			let nBlk = d.k / 256u;
			var acc = 0.0;
			if (col < d.n) {
				let rowBase = col * nBlk * 210u;
				for (var u = tid; u < nBlk * 4u; u = u + 64u) {
					let b = u >> 2u;
					let half = (u >> 1u) & 1u;
					let lh = u & 1u;
					let base = rowBase + b * 210u;
					let qlB = base + half * 64u;
					let qhB = base + 128u + half * 32u;
					let scB = base + 192u + half * 8u;
					let aB = b * 256u + half * 128u;
					var s1 = 0.0; var s2 = 0.0; var s3 = 0.0; var s4 = 0.0;
					for (var i = 0u; i < 16u; i = i + 1u) {
						let l = lh * 16u + i;
						let qll = gb(qlB + l); let qll32 = gb(qlB + l + 32u); let qhl = gb(qhB + l);
						s1 = s1 + a[aB + l] * f32(i32((qll & 0xFu) | ((qhl & 3u) << 4u)) - 32);
						s2 = s2 + a[aB + l + 32u] * f32(i32((qll32 & 0xFu) | (((qhl >> 2u) & 3u) << 4u)) - 32);
						s3 = s3 + a[aB + l + 64u] * f32(i32((qll >> 4u) | (((qhl >> 4u) & 3u) << 4u)) - 32);
						s4 = s4 + a[aB + l + 96u] * f32(i32((qll32 >> 4u) | (((qhl >> 6u) & 3u) << 4u)) - 32);
					}
					let dd = f16d(gb(base + 208u) | (gb(base + 209u) << 8u));
					acc = acc + dd * (si8(gb(scB + lh)) * s1 + si8(gb(scB + lh + 2u)) * s2 + si8(gb(scB + lh + 4u)) * s3 + si8(gb(scB + lh + 6u)) * s4);
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
		}`,scale:`
		struct SP { n: u32, s: f32 };
		@group(0) @binding(0) var<uniform> p: SP;
		@group(0) @binding(1) var<storage, read> x: array<f32>;
		@group(0) @binding(2) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let i = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (i >= p.n) { return; }
			o[i] = x[i] * p.s;
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
		}`,attention_wide:`
		struct AP { nTokens: u32, nHeads: u32, nKvHeads: u32, headDim: u32, kvLen: u32, pastLen: u32, scale: f32, softcap: f32, window: u32 };
		@group(0) @binding(0) var<uniform> p: AP;
		@group(0) @binding(1) var<storage, read> q: array<f32>;
		@group(0) @binding(2) var<storage, read> k: array<f32>;
		@group(0) @binding(3) var<storage, read> v: array<f32>;
		@group(0) @binding(4) var<storage, read_write> o: array<f32>;
		var<workgroup> qs: array<f32, 512>;
		var<workgroup> sc: array<f32, 64>;
		var<workgroup> red: array<f32, 64>;
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
			let last = p.pastLen + t;
			var jStart = 0u;
			if (p.window > 0u && last + 1u > p.window) { jStart = last + 1u - p.window; }
			for (var d = lane; d < hd; d = d + 64u) { qs[d] = q[qBase + d]; }
			workgroupBarrier();
			var m = -3.0e38;
			var denom = 0.0;
			var a0 = 0.0; var a1 = 0.0; var a2 = 0.0; var a3 = 0.0;
			var a4 = 0.0; var a5 = 0.0; var a6 = 0.0; var a7 = 0.0;
			let vStride = p.nKvHeads * hd;
			let nChunks = (last - jStart + 64u) / 64u;
			for (var c = 0u; c < nChunks; c = c + 1u) {
				let j = jStart + c * 64u + lane;
				var s = -3.0e38;
				if (j <= last) {
					let kB = (j * p.nKvHeads + kvh) * hd;
					var qk = 0.0;
					for (var d = 0u; d < hd; d = d + 4u) {
						qk = qk + dot(vec4<f32>(qs[d], qs[d + 1u], qs[d + 2u], qs[d + 3u]), vec4<f32>(k[kB + d], k[kB + d + 1u], k[kB + d + 2u], k[kB + d + 3u]));
					}
					s = score(qk);
				}
				red[lane] = s;
				workgroupBarrier();
				for (var off = 32u; off > 0u; off = off >> 1u) {
					if (lane < off) { red[lane] = max(red[lane], red[lane + off]); }
					workgroupBarrier();
				}
				let newM = max(m, red[0]);
				workgroupBarrier();
				let e = select(0.0, exp(s - newM), j <= last);
				sc[lane] = e;
				red[lane] = e;
				workgroupBarrier();
				for (var off = 32u; off > 0u; off = off >> 1u) {
					if (lane < off) { red[lane] = red[lane] + red[lane + off]; }
					workgroupBarrier();
				}
				let alpha = exp(m - newM);
				denom = denom * alpha + red[0];
				m = newM;
				let nValid = min(64u, last + 1u - jStart - c * 64u);
				let vRow0 = ((jStart + c * 64u) * p.nKvHeads + kvh) * hd + lane;
				a0 = a0 * alpha; a1 = a1 * alpha; a2 = a2 * alpha; a3 = a3 * alpha;
				a4 = a4 * alpha; a5 = a5 * alpha; a6 = a6 * alpha; a7 = a7 * alpha;
				for (var i = 0u; i < nValid; i = i + 1u) {
					let w = sc[i];
					let b = vRow0 + i * vStride;
					if (lane < hd) { a0 = a0 + w * v[b]; }
					if (lane + 64u < hd) { a1 = a1 + w * v[b + 64u]; }
					if (lane + 128u < hd) { a2 = a2 + w * v[b + 128u]; }
					if (lane + 192u < hd) { a3 = a3 + w * v[b + 192u]; }
					if (lane + 256u < hd) { a4 = a4 + w * v[b + 256u]; }
					if (lane + 320u < hd) { a5 = a5 + w * v[b + 320u]; }
					if (lane + 384u < hd) { a6 = a6 + w * v[b + 384u]; }
					if (lane + 448u < hd) { a7 = a7 + w * v[b + 448u]; }
				}
				workgroupBarrier();
			}
			let inv = 1.0 / denom;
			if (lane < hd) { o[qBase + lane] = a0 * inv; }
			if (lane + 64u < hd) { o[qBase + lane + 64u] = a1 * inv; }
			if (lane + 128u < hd) { o[qBase + lane + 128u] = a2 * inv; }
			if (lane + 192u < hd) { o[qBase + lane + 192u] = a3 * inv; }
			if (lane + 256u < hd) { o[qBase + lane + 256u] = a4 * inv; }
			if (lane + 320u < hd) { o[qBase + lane + 320u] = a5 * inv; }
			if (lane + 384u < hd) { o[qBase + lane + 384u] = a6 * inv; }
			if (lane + 448u < hd) { o[qBase + lane + 448u] = a7 * inv; }
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
		}`,qwen35_conv_batch:`
		struct P { T: u32, C: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> x: array<f32>;
		@group(0) @binding(2) var<storage, read> w: array<f32>;
		@group(0) @binding(3) var<storage, read_write> st: array<f32>;
		@group(0) @binding(4) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let c = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (c >= p.C) { return; }
			var s0 = st[c]; var s1 = st[p.C + c]; var s2 = st[2u * p.C + c];
			let w0 = w[c * 4u]; let w1 = w[c * 4u + 1u]; let w2 = w[c * 4u + 2u]; let w3 = w[c * 4u + 3u];
			for (var t = 0u; t < p.T; t = t + 1u) {
				let xt = x[t * p.C + c];
				let acc = s0 * w0 + s1 * w1 + s2 * w2 + xt * w3;
				o[t * p.C + c] = acc / (1.0 + exp(-acc));
				s0 = s1; s1 = s2; s2 = xt;
			}
			st[c] = s0; st[p.C + c] = s1; st[2u * p.C + c] = s2;
		}`,qwen35_gdn_batch:`
		struct P { T: u32, Hv: u32, Hk: u32, S: u32, convStride: u32, kOff: u32, vOff: u32, eps: f32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> conv: array<f32>;
		@group(0) @binding(2) var<storage, read> alpha: array<f32>;
		@group(0) @binding(3) var<storage, read> braw: array<f32>;
		@group(0) @binding(4) var<storage, read> dt: array<f32>;
		@group(0) @binding(5) var<storage, read> A: array<f32>;
		@group(0) @binding(6) var<storage, read_write> S: array<f32>;
		@group(0) @binding(7) var<storage, read_write> o: array<f32>;
		var<workgroup> ks: array<f32, 128>;
		var<workgroup> qs: array<f32, 128>;
		var<workgroup> rk: array<f32, 128>;
		var<workgroup> rq: array<f32, 128>;
		@compute @workgroup_size(128)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let h = wid.x;
			let j = lid.x;
			let kh = h % p.Hk;
			let sOff = h * p.S * p.S;
			let qScale = 1.0 / sqrt(f32(p.S));
			for (var t = 0u; t < p.T; t = t + 1u) {
				let base = t * p.convStride;
				let kv = conv[base + p.kOff + kh * p.S + j];
				let qv = conv[base + kh * p.S + j];
				rk[j] = kv * kv;
				rq[j] = qv * qv;
				workgroupBarrier();
				for (var off = 64u; off > 0u; off = off >> 1u) {
					if (j < off) { rk[j] = rk[j] + rk[j + off]; rq[j] = rq[j] + rq[j + off]; }
					workgroupBarrier();
				}
				ks[j] = kv / sqrt(rk[0] + p.eps);
				qs[j] = qv / sqrt(rq[0] + p.eps) * qScale;
				workgroupBarrier();
				let a = alpha[t * p.Hv + h] + dt[h];
				let sp = select(log(1.0 + exp(a)), a, a > 20.0);
				let g = exp(sp * A[h]);
				let beta = 1.0 / (1.0 + exp(-braw[t * p.Hv + h]));
				var sk = 0.0;
				for (var i = 0u; i < p.S; i = i + 1u) { sk = sk + S[sOff + i * p.S + j] * ks[i]; }
				let dlt = (conv[base + p.vOff + h * p.S + j] - g * sk) * beta;
				var acc = 0.0;
				for (var i = 0u; i < p.S; i = i + 1u) {
					let idx = sOff + i * p.S + j;
					let sNew = S[idx] * g + ks[i] * dlt;
					S[idx] = sNew;
					acc = acc + sNew * qs[i];
				}
				o[(t * p.Hv + h) * p.S + j] = acc;
				workgroupBarrier(); // ks/qs/rk/rq r\xE9\xE9crits au token suivant
			}
		}`,rope_partial:`
		struct RP { rows: u32, headDim: u32, nHeads: u32, pastLen: u32, base: f32, nRot: u32 };
		@group(0) @binding(0) var<uniform> p: RP;
		@group(0) @binding(1) var<storage, read> x: array<f32>;
		@group(0) @binding(2) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
			let r = gid.x;
			if (r >= p.rows) { return; }
			let half = p.nRot / 2u;
			let pos = f32(p.pastLen + r / p.nHeads);
			let base = r * p.headDim;
			for (var i = 0u; i < half; i = i + 1u) {
				let freq = pos / pow(p.base, (2.0 * f32(i)) / f32(p.nRot));
				let c = cos(freq); let s = sin(freq);
				let x0 = x[base + i]; let x1 = x[base + i + half];
				o[base + i] = x0 * c - x1 * s;
				o[base + i + half] = x1 * c + x0 * s;
			}
			for (var i = p.nRot; i < p.headDim; i = i + 1u) { o[base + i] = x[base + i]; }
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
		}`},un=`
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
	}`});var St,ln=ae(()=>{"use strict";St=class{constructor(e){this.sets=[];this.cur=0;this.next=0;this.names=[];this.acc=new Map;this.dropped=0;this.pending=[];this.fenetre=0;this.device=e;let r=globalThis;for(let t=0;t<2;t++)this.sets.push({qs:e.createQuerySet({type:"timestamp",count:4096}),resolve:e.createBuffer({size:4096*8,usage:r.GPUBufferUsage.QUERY_RESOLVE|r.GPUBufferUsage.COPY_SRC}),read:e.createBuffer({size:4096*8,usage:r.GPUBufferUsage.COPY_DST|r.GPUBufferUsage.MAP_READ}),busy:!1})}slot(e){if(this.next+2>4096&&(this.rotate(),this.next+2>4096))return this.dropped++,null;let r=this.sets[this.cur];if(r.busy)return this.dropped++,null;let t=this.next;return this.next+=2,this.names.push(e),{querySet:r.qs,beginningOfPassWriteIndex:t,endOfPassWriteIndex:t+1}}rotate(){let e=this.cur,r=this.sets[e],t=this.names,n=this.next;if(this.cur=(this.cur+1)%2,this.next=0,this.names=[],!n||r.busy)return;r.busy=!0;let s=this.fenetre,i=this.device.createCommandEncoder();i.resolveQuerySet(r.qs,0,n,r.resolve,0),i.copyBufferToBuffer(r.resolve,0,r.read,0,n*8),this.device.queue.submit([i.finish()]);let a=globalThis,o=r.read.mapAsync(a.GPUMapMode.READ,0,n*8).then(()=>{let u=new BigUint64Array(r.read.getMappedRange(0,n*8).slice(0));if(r.read.unmap(),s===this.fenetre)for(let c=0;c<t.length;c++){let l=u[c*2],d=u[c*2+1];if(!l||!d||d<=l)continue;let p=Number(d-l),g=this.acc.get(t[c]);g?(g.calls++,g.ns+=p):this.acc.set(t[c],{calls:1,ns:p})}}).catch(()=>{}).finally(()=>{r.busy=!1});this.pending.push(o)}async report(){this.rotate();let e=this.pending;this.pending=[],await Promise.all(e);let r=0,t=0;for(let s of this.acc.values())r+=s.ns,t+=s.calls;return{passes:[...this.acc.entries()].map(([s,i])=>({name:s,calls:i.calls,totalMs:i.ns/1e6,meanUs:i.ns/i.calls/1e3,share:r?i.ns/r:0,reliable:i.calls>=50})).sort((s,i)=>i.totalMs-s.totalMs),totalMs:r/1e6,samples:t,dropped:this.dropped,quantumUs:100}}reset(){this.fenetre++,this.acc.clear(),this.dropped=0}destroy(){for(let e of this.sets)try{e.qs.destroy(),e.resolve.destroy(),e.read.destroy()}catch{}this.sets=[]}}});function Ks(){if(fn!==null)return fn;try{let f=globalThis.__brimkernSearch;if(typeof f=="string")return f}catch{}try{return typeof location<"u"?location.search:""}catch{return""}}function se(f){try{return new URLSearchParams(Ks()).get(f)}catch{return null}}var fn,Ft=ae(()=>{"use strict";fn=null});function ke(f){let e=f>>15&1,r=f>>10&31,t=f&1023,n;return r===0?n=t*59604645e-15:r===31?n=65504:n=(1+t/1024)*2**(r-15),e===1?-n:n}function Pe(f){let e=new Float32Array(1),r=new Uint32Array(e.buffer);e[0]=f;let t=r[0],n=t>>16&32768,s=(t>>23&255)-127+15,i=t&8388607;return s<=0?n:s>=31?n|31743:(i=(i>>13)+(i>>12&1),i===1024&&(i=0,s+=1),n|s<<10|i&1023)}function dn(f,e){let r=new Float32Array(e*256),t=new DataView(f.buffer,f.byteOffset);for(let n=0;n<e;n++){let s=n*144,i=ke(t.getUint16(s,!0)),a=ke(t.getUint16(s+2,!0)),o=d=>{let p=g=>f[s+4+g];return d<4?[p(d)&63,p(d+4)&63]:[p(d+4)&15|p(d-4)>>6<<4,p(d+4)>>4|p(d)>>6<<4]},u=n*256,c=0,l=0;for(let d=0;d<256;d+=64){let[p,g]=o(c),m=i*p,w=a*g,[v,G]=o(c+1),S=i*v,O=a*G;for(let L=0;L<32;L++){let K=f[s+16+l+L];r[u+d+L]=m*(K&15)-w,r[u+d+32+L]=S*(K>>4)-O}l+=32,c+=2}}return r}function lt(f){return f>127?f-256:f}function Es(f,e){let r=new Float32Array(e*32),t=new DataView(f.buffer,f.byteOffset);for(let n=0;n<e;n++){let s=n*34,i=ke(t.getUint16(s,!0));for(let a=0;a<32;a++)r[n*32+a]=i*lt(f[s+2+a])}return r}function Hs(f,e){let r=new Float32Array(e*32),t=new DataView(f.buffer,f.byteOffset);for(let n=0;n<e;n++){let s=n*22,i=ke(t.getUint16(s,!0)),a=t.getUint32(s+2,!0);for(let o=0;o<16;o++){let u=f[s+6+o],c=a>>>o<<4&16,l=a>>>o+12&16;r[n*32+o]=i*((u&15|c)-16),r[n*32+o+16]=i*((u>>4|l)-16)}}return r}function zs(f,e){let r=new Float32Array(e*32),t=new DataView(f.buffer,f.byteOffset);for(let n=0;n<e;n++){let s=n*18,i=ke(t.getUint16(s,!0));for(let a=0;a<16;a++){let o=f[s+2+a];r[n*32+a]=i*((o&15)-8),r[n*32+a+16]=i*((o>>4)-8)}}return r}function Ns(f,e){let r=new Float32Array(e*256),t=new DataView(f.buffer,f.byteOffset);for(let n=0;n<e;n++){let s=n*176,i=ke(t.getUint16(s,!0)),a=ke(t.getUint16(s+2,!0)),o=g=>{let m=w=>f[s+4+w];return g<4?[m(g)&63,m(g+4)&63]:[m(g+4)&15|m(g-4)>>6<<4,m(g+4)>>4|m(g)>>6<<4]},u=n*256,c=0,l=0,d=1,p=2;for(let g=0;g<256;g+=64){let[m,w]=o(c),v=i*m,G=a*w,[S,O]=o(c+1),L=i*S,K=a*O;for(let x=0;x<32;x++){let _=f[s+48+l+x],y=f[s+16+x];r[u+g+x]=v*((_&15)+(y&d?16:0))-G,r[u+g+32+x]=L*((_>>4)+(y&p?16:0))-K}l+=32,c+=2,d<<=2,p<<=2}}return r}function et(f,e){let r=new Float32Array(e*256),t=new DataView(f.buffer,f.byteOffset);for(let n=0;n<e;n++){let s=n*210,i=ke(t.getUint16(s+208,!0)),a=n*256;for(let o=0;o<2;o++){let u=s+o*64,c=s+128+o*32,l=s+192+o*8,d=a+o*128;for(let p=0;p<32;p++){let g=p/16|0,m=f[u+p],w=f[u+p+32],v=f[c+p],G=(m&15|(v>>0&3)<<4)-32,S=(w&15|(v>>2&3)<<4)-32,O=(m>>4|(v>>4&3)<<4)-32,L=(w>>4|(v>>6&3)<<4)-32;r[d+p]=i*lt(f[l+g])*G,r[d+p+32]=i*lt(f[l+g+2])*S,r[d+p+64]=i*lt(f[l+g+4])*O,r[d+p+96]=i*lt(f[l+g+6])*L}}}return r}function sr(f,e){let n=new Float32Array(e*256),s=0,i=new DataView(f.buffer,f.byteOffset);for(let a=0;a<e;a++){let o=a*110,u=ke(i.getUint16(o+108,!0)),c=new Int32Array(4);for(let v=0;v<3;v++)c[v]=f[o+96+v*4]|f[o+96+v*4+1]<<8|f[o+96+v*4+2]<<16|f[o+96+v*4+3]<<24;let l=c[2];c[2]=c[0]>>>4&252645135|(l>>>4&50529027)<<4,c[3]=c[1]>>>4&252645135|(l>>>6&50529027)<<4,c[0]=c[0]&252645135|(l>>>0&50529027)<<4,c[1]=c[1]&252645135|(l>>>2&50529027)<<4;let d=new Int8Array(c.buffer),p=0,g=o+32,m=o,w=1;for(let v=0;v<256;v+=128){let G=0;for(let S=0;S<4;S++){let O=u*(d[p++]-32);for(let K=0;K<16;K++){let x=f[g+K]>>>G&3,_=f[m+K]&w?0:4;n[s++]=O*(x-_)}let L=u*(d[p++]-32);for(let K=0;K<16;K++){let x=f[g+16+K]>>>G&3,_=f[m+16+K]&w?0:4;n[s++]=L*(x-_)}G+=2,w=w<<1&255}g+=32}}return n}function ir(f,e){let r=new Float32Array(e*32),t=new DataView(f.buffer,f.byteOffset);for(let n=0;n<e;n++){let s=n*20,i=ke(t.getUint16(s,!0)),a=ke(t.getUint16(s+2,!0)),o=n*32;for(let u=0;u<16;u++){let c=f[s+4+u];r[o+u]=(c&15)*i+a,r[o+u+16]=(c>>4)*i+a}}return r}function We(f,e,r,t,n){let s=new Float32Array(r*n);for(let i=0;i<r;i++)for(let a=0;a<n;a++){let o=0;for(let u=0;u<t;u++)o+=f[i*t+u]*e[u*n+a];s[i*n+a]=o}return s}function Ee(f,e,r,t,n=1e-5,s=!1){let i=new Float32Array(r*t);for(let a=0;a<r;a++){let o=0;for(let c=0;c<t;c++)o+=f[a*t+c]**2;let u=1/Math.sqrt(o/t+n);for(let c=0;c<t;c++)i[a*t+c]=f[a*t+c]*u*(s?1+e[c]:e[c])}return i}function Qs(f,e,r,t,n,s,i){let a=new Float32Array(f.length),o=t/2,u=s[0],c=s[0]+s[1];for(let l=0;l<r;l++){let d=Math.floor(l/n),p=l*t;for(let g=0;g<o;g++){let m=g<u?0:g<c?1:2,v=e[d*3+m]/i**(2*g/t),G=Math.cos(v),S=Math.sin(v),O=f[p+g],L=f[p+g+o];a[p+g]=O*G-L*S,a[p+g+o]=L*G+O*S}}return a}function Ot(f,e,r,t,n=0,s=1e4,i){let a=new Float32Array(f.length),o=r/2;for(let u=0;u<e;u++){let c=n+Math.floor(u/t),l=u*r;for(let d=0;d<o;d++){let p=c/(s**(2*d/r)*(i?i[d]:1)),g=Math.cos(p),m=Math.sin(p),w=f[l+2*d],v=f[l+2*d+1];a[l+2*d]=w*g-v*m,a[l+2*d+1]=v*g+w*m}}return a}function Ws(f,e,r,t,n,s=0,i=1e4){let a=new Float32Array(f.length),o=t/2;for(let u=0;u<r;u++){let c=s+Math.floor(u/n),l=u*t;for(let d=0;d<o;d++){let p=c/(i**(2*d/t)*e[d]),g=Math.cos(p),m=Math.sin(p),w=f[l+d],v=f[l+d+o];a[l+d]=w*g-v*m,a[l+d+o]=v*g+w*m}}return a}function ft(f,e,r,t,n=0,s=1e4){let i=new Float32Array(f.length),a=r/2;for(let o=0;o<e;o++){let u=n+Math.floor(o/t),c=o*r;for(let l=0;l<a;l++){let d=u/s**(2*l/r),p=Math.cos(d),g=Math.sin(d),m=f[c+l],w=f[c+l+a];i[c+l]=m*p-w*g,i[c+l+a]=w*p+m*g}}return i}function ar(f,e,r){return f.map((t,n)=>t+e[n%r])}function or(f,e,r,t=!0){let n=t?f.windowPerLayer?.[r]??f.window??0:0,s=f.ropeThetaPerLayer?.[r]??f.ropeTheta,i=f.skipRopePerLayer?.[r]??f.skipRope??!1;return{...f,seq:e,window:n,ropeTheta:s,skipRope:i}}function xe(f,e,r,t,n,s,i,a=0,o,u=0,c=0){let l=new Float32Array(t*n*i),d=o??1/Math.sqrt(i),p=m=>u>0?u*Math.tanh(m/u):m,g=n/s;for(let m=0;m<t;m++)for(let w=0;w<n;w++){let v=Math.floor(w/g),G=(m*n+w)*i,S=a+m,O=c>0?Math.max(0,S+1-c):0,L=[],K=-1/0;for(let _=O;_<=S;_++){let y=(_*s+v)*i,h=0;for(let b=0;b<i;b++)h+=f[G+b]*e[y+b];let k=p(h*d);L[_]=k,k>K&&(K=k)}let x=0;for(let _=O;_<=S;_++)L[_]=Math.exp(L[_]-K),x+=L[_];for(let _=O;_<=S;_++){let y=L[_]/x,h=(_*s+v)*i;for(let k=0;k<i;k++)l[G+k]+=y*r[h+k]}}return l}function pn(f){return .5*f*(1+Math.tanh(.7978845608*(f+.044715*f*f*f)))}function ur(f,e,r){let{seq:t,d:n,nHeads:s,nKvHeads:i,headDim:a,ffn:o,ropeTheta:u,eps:c}=e,l=i*a,d=s*a,p=e.rmsGainOnePlus===!0,g=e.attnLogitSoftcap??0,m=Ee(f,r.attnNorm,t,n,c,p),w=We(m,r.wq,t,n,d),v=We(m,r.wk,t,n,l),G=We(m,r.wv,t,n,l);r.bq&&(w=ar(w,r.bq,d)),r.bk&&(v=ar(v,r.bk,l)),r.bv&&(G=ar(G,r.bv,l)),r.qNorm&&(w=Ee(w,r.qNorm,t*s,a,c,p)),r.kNorm&&(v=Ee(v,r.kNorm,t*i,a,c,p));let S=ft(w,t*s,a,s,0,u),O=ft(v,t*i,a,i,0,u),L=xe(S,O,G,t,s,i,a,0,e.attnScale,g),K=We(L,r.wo,t,d,n);r.postAttnNorm&&(K=Ee(K,r.postAttnNorm,t,n,c,p));let x=f.map((A,P)=>A+K[P]),_=Ee(x,r.ffnNorm,t,n,c,p),y=We(_,r.wgate,t,n,o),h=We(_,r.wup,t,n,o),k=e.act==="gelu"?y.map((A,P)=>pn(A)*h[P]):y.map((A,P)=>A/(1+Math.exp(-A))*h[P]),b=We(k,r.wdown,t,o,n);return r.postFfnNorm&&(b=Ee(b,r.postFfnNorm,t,n,c,p)),x.map((A,P)=>A+b[P])}var ce,ne,Mt,Tt=ae(()=>{"use strict";ot();ut();ct();cn();ln();Ft();ce=64,ne=class ne{constructor(){this.device=null;this.modules={};this.pipelines={};this.maxStorageBufferBindingSize=0;this.hasF16=!1;this.validationFailure=null;this.lost=!1;this.onLost=null;this.attnDecodeOk=!0;this.attnPrefillOk=!0;this.attnFullWgOk=!0;this.mropeOk=!0;this.rwkvWkv7Ok=!0;this.lfm2ShortConvOk=!0;this.qwen35SsmOk=!0;this.gemma4Ok=!0;this.attnWideOk=!0;this.kqOk=!0;this.lfm2ResidentOk=!0;this.lfm2BatchOk=!0;this.swaOk=!0;this.rwkvResidentOk=!0;this.videoOk=!0;this.videoResidentOk=!0;this.f16SharedOk=!0;this.qSharedOk=!0;this.qShared2Ok=!0;this.gemvOk=!0;this.rmsVecOk=!0;this.convS2Ok=!0;this.hasSubgroups=!1;this.subgroupsOk=!0;this.topKParOk=!0;this.dequantQ3kOk=!0;this.dequantQ41Ok=!0;this.profiler=null;this.bufferPool=new Map;this.poolSize=new WeakMap;this.pooled=new WeakSet;this.uniformPool=new Map;this.uniformSize=new WeakMap;this.convTiledOk=!0;this.convTiledQOk=!0;this.kqScratch=null;this.kvGpu=new Map;this.topKOk=!0;this.kvSession="";this.kvQuant=!1;this.lfm2KvGpu=new Map;this.lfm2ConvGpu=new Map;this.lfm2Session="";this.rwkvStateGpu=new Map;this.rwkvVFirst=null;this.rwkvSession=""}async init(){let e=navigator.gpu;if(!e)return!1;let r=await e.requestAdapter();if(!r)return!1;let t=r.limits,n={maxStorageBufferBindingSize:t.maxStorageBufferBindingSize,maxBufferSize:t.maxBufferSize},s=[];try{r.features?.has("shader-f16")&&s.push("shader-f16")}catch{}try{r.features?.has("subgroups")&&s.push("subgroups")}catch{}try{ne.profileOn&&r.features?.has("timestamp-query")&&s.push("timestamp-query")}catch{}try{this.device=await r.requestDevice({requiredLimits:n,requiredFeatures:s})}catch{try{this.device=await r.requestDevice({requiredLimits:n})}catch{this.device=await r.requestDevice()}}this.maxStorageBufferBindingSize=this.device.limits?.maxStorageBufferBindingSize??134217728,this.hasF16=!!this.device.features?.has?.("shader-f16"),this.hasSubgroups=!!this.device.features?.has?.("subgroups"),ne.profileOn&&(this.device.features?.has?.("timestamp-query")?(this.profiler=new St(this.device),console.info("[webgpu] profilage par passe ACTIF (?gpuprofile=1) : __gpuProfile() pour le rapport")):console.warn("[webgpu] ?gpuprofile=1 demand\xE9 mais la feature timestamp-query est ABSENTE de cet adapter : aucune mesure ne sera prise."));try{se("attndecode")==="0"&&(this.attnDecodeOk=!1,console.warn("[webgpu] attention d\xE9codage COUP\xC9E par ?attndecode=0 : kernels classiques")),se("attnfullwg")==="0"&&(this.attnFullWgOk=!1,console.warn("[webgpu] attention_full workgroup COUP\xC9E par ?attnfullwg=0 : kernel classique")),se("attnprefill")==="0"&&(this.attnPrefillOk=!1,console.warn("[webgpu] attention prefill tuil\xE9e COUP\xC9E par ?attnprefill=0 : kernel classique")),se("rmsvec")==="0"&&(this.rmsVecOk=!1,console.warn("[webgpu] RMSNorm parall\xE8le COUP\xC9E par ?rmsvec=0 : kernel une-ligne-par-thread")),se("topkpar")==="0"&&(this.topKParOk=!1,console.warn("[webgpu] top-K parall\xE8le COUP\xC9E par ?topkpar=0 : s\xE9lection finale sur un seul thread")),se("rwkv")==="0"&&(this.rwkvWkv7Ok=!1,console.warn("[webgpu] kernel RWKV-7 WKV COUP\xC9 par ?rwkv=0")),se("lfm2")==="0"&&(this.lfm2ShortConvOk=!1,console.warn("[webgpu] kernel shortconv LFM2 COUP\xC9 par ?lfm2=0")),se("lfm2resident")==="0"&&(this.lfm2ResidentOk=!1,console.warn("[webgpu] LFM2 r\xE9sident COUP\xC9 par ?lfm2resident=0 : forwardToken JS+readback")),se("lfm2batch")==="0"&&(this.lfm2BatchOk=!1,console.warn("[webgpu] prefill LFM2 batch\xE9 COUP\xC9 par ?lfm2batch=0 : token par token")),se("convs2")==="0"&&(this.convS2Ok=!1,console.warn("[webgpu] conv2d 3\xD73 stride-2 tuil\xE9 COUP\xC9 par ?convs2=0 : repli sur direct")),se("subgroups")==="0"&&(this.subgroupsOk=!1,console.warn("[webgpu] subgroups COUP\xC9 par ?subgroups=0 : repli sur shared memory")),se("swa")==="0"&&(this.swaOk=!1,console.warn("[webgpu] fen\xEAtre glissante COUP\xC9E par ?swa=0 : attention causale pleine sur toutes les couches")),se("rwkvresident")==="0"&&(this.rwkvResidentOk=!1,console.warn("[webgpu] RWKV r\xE9sident COUP\xC9 par ?rwkvresident=0 : forwardToken JS+readback")),se("video")==="0"&&(this.videoOk=!1,console.warn("[webgpu] chemin vid\xE9o (module motion) COUP\xC9 par ?video=0")),se("qwen35ssm")==="0"&&(this.qwen35SsmOk=!1,console.warn("[webgpu] kernel Qwen 3.5 SSM COUP\xC9 par ?qwen35ssm=0")),se("attnwide")==="0"&&(this.attnWideOk=!1,console.warn("[webgpu] attention large COUP\xC9E par ?attnwide=0 : t\xEAtes > 128 sur le kernel un-thread-par-t\xEAte")),se("kq")==="0"&&(this.kqOk=!1,console.warn("[webgpu] poids K-quant natifs COUP\xC9S par ?kq=0 : requantification int8")),se("gemma4")==="0"&&(this.gemma4Ok=!1,console.warn("[webgpu] chemin Gemma 4 COUP\xC9 par ?gemma4=0 : un mod\xE8le gemma4 refusera de charger")),se("f16shared")==="0"&&(this.f16SharedOk=!1,console.warn("[webgpu] GEMM f16 tuil\xE9 COUP\xC9 par ?f16shared=0 : matmul_t_f16w pour tous les m")),se("gemv")==="0"&&(this.gemvOk=!1,console.warn("[webgpu] GEMV de d\xE9codage COUP\xC9 par ?gemv=0 : kernels par lignes")),se("qshared")==="0"&&(this.qSharedOk=!1,console.warn("[webgpu] GEMM q8/q4 tuil\xE9s COUP\xC9S par ?qshared=0 : kernels 4 lignes/invocation")),se("qshared2")==="0"&&(this.qShared2Ok=!1,console.warn("[webgpu] GEMM q8/q4 v2 (bloc 4\xD78 vec4) COUP\xC9S par ?qshared2=0 : tuile 32\xD764 v1")),se("convtq")==="0"&&(this.convTiledQOk=!1,console.warn("[webgpu] conv 3\xD73 tuil\xE9 q8/q4 COUP\xC9 par ?convtq=0 : conv2d_direct_q8/q4 (plus lent, m\xEAme r\xE9sultat)")),se("videoresident")==="0"&&(this.videoResidentOk=!1,console.warn("[webgpu] motion r\xE9sident COUP\xC9 par ?videoresident=0 : chemin JS+readback")),se("dequantq3k")==="0"&&(this.dequantQ3kOk=!1,console.warn("[webgpu] d\xE9quantification GPU Q3_K COUP\xC9E par ?dequantq3k=0 : repli CPU")),se("dequantq41")==="0"&&(this.dequantQ41Ok=!1,console.warn("[webgpu] d\xE9quantification GPU Q4_1 COUP\xC9E par ?dequantq41=0 : repli CPU"))}catch{}this.device.lost?.then?.(i=>{this.lost=!0,console.warn("[webgpu] device GPU perdu :",i?.reason||"unknown",i?.message||""),this.onLost?.(i)});for(let[i,a]of Object.entries(on))this.modules[i]=this.device.createShaderModule({code:a});return this.hasF16&&(this.modules.matmul_t_f16w=this.device.createShaderModule({code:un})),!0}buf(e,r){let t=this.device.createBuffer({size:e.byteLength,usage:r});return this.device.queue.writeBuffer(t,0,e),t}bufU32(e,r){let t=this.device.createBuffer({size:e.byteLength,usage:r});return this.device.queue.writeBuffer(t,0,e),t}async readBack(e,r){let t=globalThis,n=this.device.createBuffer({size:r,usage:t.GPUBufferUsage.COPY_DST|t.GPUBufferUsage.MAP_READ}),s=this.device.createCommandEncoder();s.copyBufferToBuffer(e,0,n,0,r),this.device.queue.submit([s.finish()]),await n.mapAsync(t.GPUMapMode.READ);let i=new Float32Array(n.getMappedRange().slice(0));return n.unmap(),n.destroy(),i}async readBackBytes(e,r){let t=globalThis,n=Math.ceil(r/4)*4,s=this.device.createBuffer({size:n,usage:t.GPUBufferUsage.COPY_DST|t.GPUBufferUsage.MAP_READ}),i=this.device.createCommandEncoder();i.copyBufferToBuffer(e,0,s,0,n),this.device.queue.submit([i.finish()]),await s.mapAsync(t.GPUMapMode.READ);let a=new Uint8Array(s.getMappedRange().slice(0,r));return s.unmap(),s.destroy(),a}async quantizeToBytes(e,r,t,n,s){let i=t/32,a=n==="q8"?new Uint8Array(t+i*2):new Uint8Array(t/2+i*4),o=ne.BLOCK_ELEMS[e]??1,u=t/o,c=r.byteLength/u,l=(m,w)=>w===0?m:l(w,m%w),d=o*32/l(o,32),p=Math.floor(this.maxStorageBufferBindingSize*.9/4),g=s??p;g=Math.max(d,Math.floor(g/d)*d);for(let m=0;m<t;m+=g){let w=Math.min(g,t-m),v=r.slice(m/o*c,(m+w)/o*c),G=this.dequantizeToGpu(e,v,w);try{if(n==="q8"){let{codes:S,sc:O}=this.f32ToQ8Gpu(G,w),L=await this.readBackBytes(S,w),K=await this.readBackBytes(O,w/32*2);S.destroy?.(),O.destroy?.(),a.set(L,m),a.set(K,t+m/32*2)}else{let{nib:S,sc:O,mn:L}=this.f32ToQ4Gpu(G,w),K=await this.readBackBytes(S,w/2),x=await this.readBackBytes(O,w/32*2),_=await this.readBackBytes(L,w/32*2);S.destroy?.(),O.destroy?.(),L.destroy?.(),a.set(K,m/2),a.set(x,t/2+m/32*2),a.set(_,t/2+i*2+m/32*2)}}finally{G.destroy?.()}}return a}pipeline(e){let r=this.pipelines[e];return r||(r=this.device.createComputePipeline({layout:"auto",compute:{module:this.modules[e],entryPoint:"main"}}),this.pipelines[e]=r),r}grid1D(e){let r=Math.ceil(e/ce);if(r<=ne.MAX_WG_DIM)return[r,1,1];let t=ne.MAX_WG_DIM;return[t,Math.ceil(r/t),1]}recordPass(e,r,t,n){let s=this.pipeline(r),i=this.device.createBindGroup({layout:s.getBindGroupLayout(0),entries:t.map((u,c)=>({binding:c,resource:{buffer:u}}))}),a=this.profiler?.slot(r),o=e.beginComputePass(a?{timestampWrites:a}:void 0);o.setPipeline(s),o.setBindGroup(0,i),o.dispatchWorkgroups(...n),o.end()}dispatch(e,r,t){let n=this.device.createCommandEncoder();this.recordPass(n,e,r,t),this.device.queue.submit([n.finish()])}async run(e,r,t,n,s){return this.dispatch(e,r,t),this.readBack(n,s)}isF32(e){return e instanceof Float32Array}async matmul(e,r,t,n,s){let i=globalThis,a=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([t,n,s]));let u=this.isF32(r)?this.buf(r,a):r,c=this.device.createBuffer({size:t*s*4,usage:a|i.GPUBufferUsage.COPY_SRC});return this.run("matmul",[o,this.buf(e,a),u,c],[Math.ceil(t/8),Math.ceil(s/8),1],c,t*s*4)}async matmulT(e,r,t,n,s,i=!1){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([t,n,s]));let c=this.isF32(r)?this.buf(r,o):r,l=this.device.createBuffer({size:t*s*4,usage:o|a.GPUBufferUsage.COPY_SRC}),d=this.matmulTPlan(t,n,s,i);return this.run(d.shader,[u,this.buf(e,o),c,l],d.grid,l,t*s*4)}matmulTPlan(e,r,t,n){return n&&this.hasF16?this.f16SharedOk&&e>=32&&r%4===0?{shader:"matmul_t_f16w_shared",grid:[Math.ceil(t/64),Math.ceil(e/32),1]}:{shader:"matmul_t_f16w",grid:[Math.ceil(e/8),Math.ceil(t/8),1]}:{shader:r%4===0?"matmul_t_vec4":"matmul_t",grid:[Math.ceil(e/8),Math.ceil(t/8),1]}}async rmsnorm(e,r,t,n,s=1e-5,i=!1){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([t,n])),this.device.queue.writeBuffer(u,8,new Float32Array([s])),this.device.queue.writeBuffer(u,12,new Uint32Array([i?1:0]));let c=this.device.createBuffer({size:e.byteLength,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("rmsnorm",[u,this.buf(e,o),this.buf(r,o),c],[Math.ceil(t/ce),1,1],c,e.byteLength)}async topKReadback(e,r,t){let n=globalThis,s=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST,i=this.device.createBuffer({size:8,usage:n.GPUBufferUsage.UNIFORM|n.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(i,0,new Uint32Array([e.length,r]));let a=this.device.createBuffer({size:r*2*4,usage:s|n.GPUBufferUsage.COPY_SRC}),o=this.device.createBuffer({size:r*2*4,usage:n.GPUBufferUsage.COPY_DST|n.GPUBufferUsage.MAP_READ}),u=this.device.createCommandEncoder(),c=this.buf(e,s);this.recordPass(u,t,[i,c,a],[1,1,1]),u.copyBufferToBuffer(a,0,o,0,r*2*4),this.device.queue.submit([u.finish()]),await o.mapAsync(n.GPUMapMode.READ);let l=new Uint32Array(o.getMappedRange().slice(0));return o.unmap(),o.destroy(),a.destroy?.(),i.destroy?.(),c.destroy?.(),l}async rmsnormVec(e,r,t,n,s=1e-5,i=!1,a="rmsnorm_vec"){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([t,n])),this.device.queue.writeBuffer(c,8,new Float32Array([s])),this.device.queue.writeBuffer(c,12,new Uint32Array([i?1:0]));let l=this.device.createBuffer({size:e.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run(a,[c,this.buf(e,u),this.buf(r,u),l],[t,1,1],l,e.byteLength)}async binary(e,r,t){let n=globalThis,s=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST,i=this.device.createBuffer({size:r.byteLength,usage:s|n.GPUBufferUsage.COPY_SRC});return this.run(e,[this.buf(r,s),this.buf(t,s),i],this.grid1D(r.length),i,r.byteLength)}swiglu(e,r){return this.binary("swiglu",e,r)}geglu(e,r){return this.binary("geglu",e,r)}add(e,r){return this.binary("add",e,r)}async silu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("silu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async groupNorm(e,r,t,n,s,i,a=1e-5,o="group_norm"){let u=globalThis,c=u.GPUBufferUsage.STORAGE|u.GPUBufferUsage.COPY_DST,l=this.device.createBuffer({size:16,usage:u.GPUBufferUsage.UNIFORM|u.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(l,0,new Uint32Array([n,s,i])),this.device.queue.writeBuffer(l,12,new Float32Array([a]));let d=this.device.createBuffer({size:e.byteLength,usage:c|u.GPUBufferUsage.COPY_SRC});return this.run(o,[l,this.buf(e,c),this.buf(r,c),this.buf(t,c),d],[i,1,1],d,e.byteLength)}async conv2d(e,r,t,n,s,i,a,o,u,c=1,l=0){let d=globalThis,p=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,g=Math.floor((s+2*l-o)/c)+1,m=Math.floor((i+2*l-u)/c)+1,w=n*o*u,v=g*m;if(w*v*4>this.maxStorageBufferBindingSize*.9)return this.conv2dDirect(e,r,t,n,s,i,a,o,u,c,l);let G=this.device.createBuffer({size:48,usage:d.GPUBufferUsage.UNIFORM|d.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(G,0,new Uint32Array([n,s,i,o,u,c,l,g,m]));let S=this.device.createBuffer({size:w*v*4,usage:p|d.GPUBufferUsage.COPY_SRC});this.dispatch("im2col",[G,this.buf(e,p),S],this.grid1D(w*v));let O=await this.matmul(r,S,a,w,v);if(S.destroy?.(),G.destroy?.(),t)for(let L=0;L<a;L++){let K=t[L];for(let x=0;x<v;x++)O[L*v+x]+=K}return O}async conv2dDirect(e,r,t,n,s,i,a,o,u,c=1,l=0){let d=globalThis,p=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,g=Math.floor((s+2*l-o)/c)+1,m=Math.floor((i+2*l-u)/c)+1,w=a*g*m,v=this.device.createBuffer({size:48,usage:d.GPUBufferUsage.UNIFORM|d.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(v,0,new Uint32Array([n,s,i,a,o,u,c,l,g,m]));let G=t??new Float32Array(a),S=this.device.createBuffer({size:w*4,usage:p|d.GPUBufferUsage.COPY_SRC});return this.run("conv2d_direct",[v,this.buf(e,p),this.buf(r,p),this.buf(G,p),S],this.grid1D(w),S,w*4)}async layernorm(e,r,t,n,s,i=1e-5){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s])),this.device.queue.writeBuffer(u,8,new Float32Array([i]));let c=this.device.createBuffer({size:e.byteLength,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("layernorm",[u,this.buf(e,o),this.buf(r,o),this.buf(t,o),c],[Math.ceil(n/ce),1,1],c,e.byteLength)}async quickGelu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("quick_gelu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async gelu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("gelu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async relu(e){let r=globalThis,t=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:e.byteLength,usage:t|r.GPUBufferUsage.COPY_SRC});return this.run("relu",[this.buf(e,t),n],this.grid1D(e.length),n,e.byteLength)}async upsampleNearest(e,r,t,n,s=2){let i=globalThis,a=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=t*s,u=n*s,c=r*o*u,l=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(l,0,new Uint32Array([r,t,n,s]));let d=this.device.createBuffer({size:c*4,usage:a|i.GPUBufferUsage.COPY_SRC});return this.run("upsample_nearest",[l,this.buf(e,a),d],this.grid1D(c),d,c*4)}async upscale2x(e,r,t,n,s=.5){let i=t*2,a=n*2,o=this.recordingSession(),u=this.uploadGpu(e),c=o.upscale2x(u,r,t,n,s),l=await o.finish(c,r*i*a);return this.releaseGpu([u]),l}async rope(e,r,t,n,s=0,i=1e4,a=!1){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:32,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([r,t,n,s])),this.device.queue.writeBuffer(c,16,new Float32Array([i]));let l=this.device.createBuffer({size:e.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.device.queue.writeBuffer(c,20,new Uint32Array([a?1:0])),this.run("rope",[c,this.buf(e,u),l],[Math.ceil(r/ce),1,1],l,e.byteLength)}async ropeFactors(e,r,t,n,s,i=0,a=1e4,o=!1){let u=globalThis,c=u.GPUBufferUsage.STORAGE|u.GPUBufferUsage.COPY_DST,l=this.device.createBuffer({size:32,usage:u.GPUBufferUsage.UNIFORM|u.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(l,0,new Uint32Array([t,n,s,i])),this.device.queue.writeBuffer(l,16,new Float32Array([a]));let d=this.device.createBuffer({size:r.byteLength,usage:c});this.device.queue.writeBuffer(d,0,r);let p=this.device.createBuffer({size:e.byteLength,usage:c|u.GPUBufferUsage.COPY_SRC});return this.device.queue.writeBuffer(l,20,new Uint32Array([o?1:0])),this.run("rope_factors",[l,this.buf(e,c),d,p],[Math.ceil(t/ce),1,1],p,e.byteLength)}async ropeMrope(e,r,t,n,s,i,a=1e4){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:32,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([t,n,s,i[0],i[0]+i[1]])),this.device.queue.writeBuffer(c,20,new Float32Array([a]));let l=this.device.createBuffer({size:r.byteLength,usage:u});this.device.queue.writeBuffer(l,0,r);let d=this.device.createBuffer({size:e.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("rope_mrope",[c,this.buf(e,u),l,d],[Math.ceil(t/ce),1,1],d,e.byteLength)}async rope2d(e,r,t,n,s,i=1e4){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:32,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([t,n,s,0])),this.device.queue.writeBuffer(u,16,new Float32Array([i]));let c=this.device.createBuffer({size:r.byteLength,usage:o});this.device.queue.writeBuffer(c,0,r);let l=this.device.createBuffer({size:e.byteLength,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("rope_2d",[u,this.buf(e,o),c,l],[Math.ceil(t/ce),1,1],l,e.byteLength)}async attention(e,r,t,n,s,i,a,o=0,u,c=0,l=0){let d=globalThis,p=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,g=o+n,m=this.attnUniform(n,s,i,a,g,o,u??1/Math.sqrt(a),c,l),w=n*s*a*4,v=this.device.createBuffer({size:w,usage:p|d.GPUBufferUsage.COPY_SRC});return this.run("attention",[m,this.buf(e,p),this.buf(r,p),this.buf(t,p),v],[Math.ceil(n*s/ce),1,1],v,w)}async attentionDecode(e,r,t,n,s,i,a,o=0,u,c=0,l=0){let d=globalThis,p=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,g=o+n,m=this.attnUniform(n,s,i,a,g,o,u??1/Math.sqrt(a),c,l),w=n*s*a*4,v=this.device.createBuffer({size:w,usage:p|d.GPUBufferUsage.COPY_SRC});return this.run("attention_decode",[m,this.buf(e,p),this.buf(r,p),this.buf(t,p),v],[n*s,1,1],v,w)}async attentionPrefill(e,r,t,n,s,i,a,o=0,u,c=0,l=0){let d=globalThis,p=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,g=o+n,m=this.attnUniform(n,s,i,a,g,o,u??1/Math.sqrt(a),c,l),w=n*s*a*4,v=this.device.createBuffer({size:w,usage:p|d.GPUBufferUsage.COPY_SRC});return this.run("attention_prefill",[m,this.buf(e,p),this.buf(r,p),this.buf(t,p),v],[Math.ceil(n/4)*s,1,1],v,w)}async attentionFull(e,r,t,n,s,i,a,o,u,c=0){let l=globalThis,d=l.GPUBufferUsage.STORAGE|l.GPUBufferUsage.COPY_DST,p=this.device.createBuffer({size:32,usage:l.GPUBufferUsage.UNIFORM|l.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(p,0,new Uint32Array([n,s,i,a,o,0])),this.device.queue.writeBuffer(p,24,new Float32Array([u??1/Math.sqrt(a),c]));let g=n*s*a*4,m=this.device.createBuffer({size:g,usage:d|l.GPUBufferUsage.COPY_SRC});return this.run("attention_full",[p,this.buf(e,d),this.buf(r,d),this.buf(t,d),m],[Math.ceil(n*s/ce),1,1],m,g)}async attentionFullWg(e,r,t,n,s,i,a,o,u,c=0){let l=globalThis,d=l.GPUBufferUsage.STORAGE|l.GPUBufferUsage.COPY_DST,p=this.device.createBuffer({size:32,usage:l.GPUBufferUsage.UNIFORM|l.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(p,0,new Uint32Array([n,s,i,a,o,0])),this.device.queue.writeBuffer(p,24,new Float32Array([u??1/Math.sqrt(a),c]));let g=n*s*a*4,m=this.device.createBuffer({size:g,usage:d|l.GPUBufferUsage.COPY_SRC});return this.run("attention_full_wg",[p,this.buf(e,d),this.buf(r,d),this.buf(t,d),m],[n*s,1,1],m,g)}async quantizeKvReadback(e,r,t,n){let s=globalThis,i=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST|s.GPUBufferUsage.COPY_SRC,a=t*n,o=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([r,t,n,0]));let u=this.device.createBuffer({size:r*a,usage:i}),c=this.device.createBuffer({size:r*t*4,usage:i});this.dispatch("quantize_kv",[o,this.buf(e,i),u,c],this.grid1D(r*t));let l=await this.readBack(u,r*a),d=new Uint32Array(l.buffer,0,r*a/4),p=await this.readBack(c,r*t*4);return u.destroy?.(),c.destroy?.(),{codes:d,scales:p}}async attentionQ8Kv(e,r,t,n,s,i,a,o,u,c=0,l,d=0,p=0){let g=globalThis,m=g.GPUBufferUsage.STORAGE|g.GPUBufferUsage.COPY_DST,w=c+i,v=this.attnUniform(i,a,o,u,w,c,l??1/Math.sqrt(u),d,p),G=i*a*u*4,S=this.device.createBuffer({size:G,usage:m|g.GPUBufferUsage.COPY_SRC});return this.run("attention_q8kv",[v,this.buf(e,m),this.bufU32(r,m),this.buf(t,m),this.bufU32(n,m),this.buf(s,m),S],[Math.ceil(i*a/ce),1,1],S,G)}async attentionQ8KvDecode(e,r,t,n,s,i,a,o,u,c=0,l,d=0,p=0){let g=globalThis,m=g.GPUBufferUsage.STORAGE|g.GPUBufferUsage.COPY_DST,w=c+i,v=this.attnUniform(i,a,o,u,w,c,l??1/Math.sqrt(u),d,p),G=i*a*u*4,S=this.device.createBuffer({size:G,usage:m|g.GPUBufferUsage.COPY_SRC});return this.run("attention_decode_q8kv",[v,this.buf(e,m),this.bufU32(r,m),this.buf(t,m),this.bufU32(n,m),this.buf(s,m),S],[i*a,1,1],S,G)}async attentionQ8KvPrefill(e,r,t,n,s,i,a,o,u,c=0,l,d=0,p=0){let g=globalThis,m=g.GPUBufferUsage.STORAGE|g.GPUBufferUsage.COPY_DST,w=c+i,v=this.attnUniform(i,a,o,u,w,c,l??1/Math.sqrt(u),d,p),G=i*a*u*4,S=this.device.createBuffer({size:G,usage:m|g.GPUBufferUsage.COPY_SRC});return this.run("attention_prefill_q8kv",[v,this.buf(e,m),this.bufU32(r,m),this.buf(t,m),this.bufU32(n,m),this.buf(s,m),S],[Math.ceil(i/4)*a,1,1],S,G)}async addBias(e,r,t,n){let s=globalThis,i=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,a=this.device.createBuffer({size:8,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(a,0,new Uint32Array([t,n]));let o=this.device.createBuffer({size:e.byteLength,usage:i|s.GPUBufferUsage.COPY_SRC});return this.run("addbias",[a,this.buf(e,i),this.buf(r,i),o],this.grid1D(e.length),o,e.byteLength)}async dequantBlocked(e,r,t,n){let s=globalThis,i=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,a=t/n;if(!Number.isInteger(a))throw new Error(`${e}: nElems ${t} not a multiple of ${n}`);let o=r.byteLength%4===0?r:(()=>{let d=new Uint8Array(Math.ceil(r.byteLength/4)*4);return d.set(r),d})(),u=new Uint32Array(o.buffer,o.byteOffset,o.byteLength/4),c=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([a]));let l=this.device.createBuffer({size:t*4,usage:i|s.GPUBufferUsage.COPY_SRC});return this.run(e,[c,this.bufU32(u,i),l],this.grid1D(a),l,t*4)}async dequantizeQ4K(e,r){return this.dequantBlocked("dequant_q4k",e,r,256)}async dequantizeByType(e,r,t){if(e==="F32")return new Float32Array(r.buffer,r.byteOffset,t);if(e==="F16"){let i=new DataView(r.buffer,r.byteOffset),a=new Float32Array(t);for(let o=0;o<t;o++)a[o]=ke(i.getUint16(o*2,!0));return a}if(e==="Q4W")return me(we(r,t));if(e==="Q8W")return ve(_e(r,t));if(e==="Q3W")return Ke(Ue(r,t));if(e==="Q3_K"&&!this.dequantQ3kOk)return sr(r,Math.floor(t/256));if(e==="Q4_1"&&!this.dequantQ41Ok)return ir(r,Math.floor(t/32));let n=ne.DEQUANT_SHADER[e],s=ne.BLOCK_ELEMS[e];if(!n||!s)throw new Error(`dequant: unsupported GGML type ${e}`);return this.dequantBlocked(n,r,t,s)}dequantBlockedGpu(e,r,t,n){let s=globalThis,i=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,a=t/n;if(!Number.isInteger(a))throw new Error(`${e}: nElems ${t} not a multiple of ${n}`);let o=r.byteLength%4===0?r:(()=>{let d=new Uint8Array(Math.ceil(r.byteLength/4)*4);return d.set(r),d})(),u=new Uint32Array(o.buffer,o.byteOffset,o.byteLength/4),c=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([a]));let l=this.device.createBuffer({size:t*4,usage:i});return this.dispatch(e,[c,this.bufU32(u,i),l],this.grid1D(a)),l}dequantizeToGpu(e,r,t){let n=globalThis,s=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST;if(e==="F32")return this.buf(new Float32Array(r.buffer,r.byteOffset,t),s);if(e==="F16"){let o=new DataView(r.buffer,r.byteOffset),u=new Float32Array(t);for(let c=0;c<t;c++)u[c]=ke(o.getUint16(c*2,!0));return this.buf(u,s)}if(e==="Q4W")return this.buf(me(we(r,t)),s);if(e==="Q8W")return this.buf(ve(_e(r,t)),s);if(e==="Q3W")return this.buf(Ke(Ue(r,t)),s);if(e==="Q3_K"&&!this.dequantQ3kOk)return this.buf(sr(r,Math.floor(t/256)),s);if(e==="Q4_1"&&!this.dequantQ41Ok)return this.buf(ir(r,Math.floor(t/32)),s);let i=ne.DEQUANT_SHADER[e],a=ne.BLOCK_ELEMS[e];if(!i||!a)throw new Error(`dequant: unsupported GGML type ${e}`);return this.dequantBlockedGpu(i,r,t,a)}async layerForward(e,r,t,n=!1){let{seq:s,d:i,nHeads:a,nKvHeads:o,headDim:u,ffn:c,ropeTheta:l,eps:d}=r,p=o*u,g=n?(q,T,j,F,R)=>this.matmulT(q,T,j,F,R):(q,T,j,F,R)=>this.matmul(q,T,j,F,R),m=a*u,w=r.rmsGainOnePlus===!0,v=r.attnLogitSoftcap??0,G=(q,T)=>r.act==="gelu"?this.geglu(q,T):this.swiglu(q,T),S=await this.rmsnorm(e,t.attnNorm,s,i,d,w),O=await g(S,t.wq,s,i,m),L=await g(S,t.wk,s,i,p),K=await g(S,t.wv,s,i,p);t.bq&&(O=await this.addBias(O,t.bq,s,m)),t.bk&&(L=await this.addBias(L,t.bk,s,p)),t.bv&&(K=await this.addBias(K,t.bv,s,p)),t.qNorm&&(O=await this.rmsnorm(O,t.qNorm,s*a,u,d,w)),t.kNorm&&(L=await this.rmsnorm(L,t.kNorm,s*o,u,d,w));let x=await this.rope(O,s*a,u,a,0,l),_=await this.rope(L,s*o,u,o,0,l),y=await this.attention(x,_,K,s,a,o,u,0,r.attnScale,v),h=await g(y,t.wo,s,m,i);t.postAttnNorm&&(h=await this.rmsnorm(h,t.postAttnNorm,s,i,d,w));let k=await this.add(e,h),b=await this.rmsnorm(k,t.ffnNorm,s,i,d,w),A=await g(b,t.wgate,s,i,c),P=await g(b,t.wup,s,i,c),B=await G(A,P),U=await g(B,t.wdown,s,c,i);return t.postFfnNorm&&(U=await this.rmsnorm(U,t.postFfnNorm,s,i,d,w)),this.add(k,U)}async layerForwardKV(e,r,t,n,s,i,a=!1){let{seq:o,d:u,nHeads:c,nKvHeads:l,headDim:d,ffn:p,ropeTheta:g,eps:m}=r,w=l*d,v=a?(N,V,$,C,M)=>this.matmulT(N,V,$,C,M):(N,V,$,C,M)=>this.matmul(N,V,$,C,M),G=(N,V)=>{let $=new Float32Array(N.length+V.length);return $.set(N),$.set(V,N.length),$},S=c*d,O=r.rmsGainOnePlus===!0,L=r.attnLogitSoftcap??0,K=(N,V)=>r.act==="gelu"?this.geglu(N,V):this.swiglu(N,V),x=await this.rmsnorm(e,t.attnNorm,o,u,m,O),_=await v(x,t.wq,o,u,S),y=await v(x,t.wk,o,u,w),h=await v(x,t.wv,o,u,w);t.bq&&(_=await this.addBias(_,t.bq,o,S)),t.bk&&(y=await this.addBias(y,t.bk,o,w)),t.bv&&(h=await this.addBias(h,t.bv,o,w)),t.qNorm&&(_=await this.rmsnorm(_,t.qNorm,o*c,d,m,O)),t.kNorm&&(y=await this.rmsnorm(y,t.kNorm,o*l,d,m,O));let k=await this.rope(_,o*c,d,c,n,g),b=await this.rope(y,o*l,d,l,n,g),A=G(s,b),P=G(i,h),B=await this.attention(k,A,P,o,c,l,d,n,r.attnScale,L),U=await v(B,t.wo,o,S,u);t.postAttnNorm&&(U=await this.rmsnorm(U,t.postAttnNorm,o,u,m,O));let q=await this.add(e,U),T=await this.rmsnorm(q,t.ffnNorm,o,u,m,O),j=await v(T,t.wgate,o,u,p),F=await v(T,t.wup,o,u,p),R=await K(j,F),H=await v(R,t.wdown,o,p,u);return t.postFfnNorm&&(H=await this.rmsnorm(H,t.postFfnNorm,o,u,m,O)),{out:await this.add(q,H),k:A,v:P}}storage(e){let r=this.bufferPool.get(e);if(r&&r.length){let n=r.pop();return this.pooled.delete(n),n}let t=this.device.createBuffer({size:e,usage:ne.STORAGE_USAGE});return this.poolSize.set(t,e),t}release(e){for(let r of e){if(!r)continue;let t=this.poolSize.get(r);if(t!==void 0){if(this.pooled.has(r))continue;this.pooled.add(r);let s=this.bufferPool.get(t);s||(s=[],this.bufferPool.set(t,s)),s.push(r);continue}let n=this.uniformSize.get(r);if(n!==void 0){if(this.pooled.has(r))continue;this.pooled.add(r);let s=this.uniformPool.get(n);s||(s=[],this.uniformPool.set(n,s)),s.push(r);continue}r.destroy?.()}}recycleStorage(e){this.release(e.filter(r=>r&&this.poolSize.has(r)))}uploadGpu(e){return e instanceof Float32Array?this.buf(e,ne.STORAGE_USAGE):this.f16ToF32Gpu(e.f16,e.n)}uploadGpuF16(e){let r=new Uint16Array(e.length);for(let t=0;t<e.length;t++)r[t]=Pe(e[t]);return this.bufU16(r)}f32ToF16Gpu(e,r){let t=globalThis,n=Math.ceil(r/2),s=this.device.createBuffer({size:n*4,usage:ne.STORAGE_USAGE}),i=this.device.createBuffer({size:16,usage:t.GPUBufferUsage.UNIFORM|t.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(i,0,new Uint32Array([n])),this.dispatch("packf16",[i,e,s],this.grid1D(n)),s}f32ToQ8Gpu(e,r){let t=globalThis,n=r/32,s=this.device.createBuffer({size:r,usage:ne.STORAGE_USAGE}),i=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:ne.STORAGE_USAGE}),a=this.device.createBuffer({size:16,usage:t.GPUBufferUsage.UNIFORM|t.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(a,0,new Uint32Array([n])),this.dispatch("quantize_q8",[a,e,s,i],this.grid1D(n)),{codes:s,sc:i}}f32ToQ4Gpu(e,r){let t=globalThis,n=r/32,s=this.device.createBuffer({size:r/2,usage:ne.STORAGE_USAGE}),i=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:ne.STORAGE_USAGE}),a=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:ne.STORAGE_USAGE}),o=this.device.createBuffer({size:16,usage:t.GPUBufferUsage.UNIFORM|t.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(o,0,new Uint32Array([n])),this.dispatch("quantize_q4",[o,e,s,i,a],this.grid1D(n)),{nib:s,sc:i,mn:a}}uploadGpuRawF16(e){let r=Math.ceil(e.byteLength/4)*4,t=this.device.createBuffer({size:r,usage:ne.STORAGE_USAGE});if(this.device.queue.writeBuffer(t,0,e,0,e.byteLength-e.byteLength%4),e.byteLength%4){let n=new Uint8Array(4);n.set(e.subarray(e.byteLength-e.byteLength%4)),this.device.queue.writeBuffer(t,e.byteLength-e.byteLength%4,n)}return t}bufU16(e){let r=this.device.createBuffer({size:e.byteLength,usage:ne.STORAGE_USAGE});return this.device.queue.writeBuffer(r,0,e),r}uploadGpuRaw(e){let r=Math.ceil(e.byteLength/4)*4,t=this.device.createBuffer({size:r,usage:ne.STORAGE_USAGE}),n=e.byteLength-e.byteLength%4;if(this.device.queue.writeBuffer(t,0,e,0,n),e.byteLength%4){let s=new Uint8Array(4);s.set(e.subarray(n)),this.device.queue.writeBuffer(t,n,s)}return t}async matmulQ4(e,r,t,n,s,i,a){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s,i,a]));let l=this.device.createBuffer({size:s*a*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4",[c,this.buf(e,u),r,t,n,l],[Math.ceil(s/8),Math.ceil(a/8),1],l,s*a*4)}async matmulQ4Tiled(e,r,t,n,s,i,a){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s,i,a]));let l=this.device.createBuffer({size:s*a*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_tiled",[c,this.buf(e,u),r,t,n,l],[Math.ceil(Math.ceil(s/4)/8),Math.ceil(a/8),1],l,s*a*4)}async matmulQ4Shared(e,r,t,n,s,i,a){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s,i,a]));let l=this.device.createBuffer({size:s*a*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_shared",[c,this.buf(e,u),r,t,n,l],[Math.ceil(a/64),Math.ceil(s/32),1],l,s*a*4)}async matmulQ3(e,r,t,n,s,i,a,o){let u=globalThis,c=u.GPUBufferUsage.STORAGE|u.GPUBufferUsage.COPY_DST,l=this.device.createBuffer({size:16,usage:u.GPUBufferUsage.UNIFORM|u.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(l,0,new Uint32Array([i,a,o]));let d=this.device.createBuffer({size:i*o*4,usage:c|u.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q3",[l,this.buf(e,c),r,t,n,s,d],[Math.ceil(i/8),Math.ceil(o/8),1],d,i*o*4)}async rwkvWkv7(e,r,t,n,s,i,a,o,u){let c=globalThis,l=c.GPUBufferUsage.STORAGE|c.GPUBufferUsage.COPY_DST,d=this.device.createBuffer({size:8,usage:c.GPUBufferUsage.UNIFORM|c.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(d,0,new Uint32Array([o,u]));let p=this.device.createBuffer({size:e.byteLength,usage:l|c.GPUBufferUsage.COPY_SRC});this.device.queue.writeBuffer(p,0,e);let g=this.device.createBuffer({size:o*u*4,usage:l|c.GPUBufferUsage.COPY_SRC});this.dispatch("rwkv_wkv7",[d,this.buf(r,l),this.buf(t,l),this.buf(n,l),this.buf(s,l),this.buf(i,l),this.buf(a,l),p,g],this.grid1D(o*u));let m=await this.readBack(p,e.byteLength),w=await this.readBack(g,o*u*4);return p.destroy?.(),g.destroy?.(),{S:m,y:w}}async rwkvTokenShift(e,r,t,n){let s=globalThis,i=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,a=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(a,0,new Uint32Array([n]));let o=this.device.createBuffer({size:6*n*4,usage:i|s.GPUBufferUsage.COPY_SRC});this.dispatch("rwkv_token_shift",[a,this.buf(e,i),this.buf(r,i),this.buf(t,i),o],this.grid1D(n*6));let u=await this.readBack(o,6*n*4);return o.destroy?.(),u}async lfm2ShortConv(e,r,t,n,s){let i=globalThis,a=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([n,s]));let u=this.buf(r,a|i.GPUBufferUsage.COPY_SRC),c=this.device.createBuffer({size:n*4,usage:a|i.GPUBufferUsage.COPY_SRC});this.dispatch("lfm2_shortconv",[o,this.buf(e,a),this.buf(t,a),u,c],this.grid1D(n));let l=await this.readBack(c,n*4),d=await this.readBack(u,(s-1)*n*4);return c.destroy?.(),u.destroy?.(),{out:l,state:d}}async qwen35Conv1d(e,r,t,n,s=4){let i=globalThis,a=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([n,s]));let u=this.buf(r,a|i.GPUBufferUsage.COPY_SRC),c=this.device.createBuffer({size:n*4,usage:a|i.GPUBufferUsage.COPY_SRC});this.dispatch("qwen35_ssm_conv",[o,this.buf(e,a),this.buf(t,a),u,c],this.grid1D(n));let l=await this.readBack(c,n*4),d=await this.readBack(u,(s-1)*n*4);return c.destroy?.(),u.destroy?.(),o.destroy?.(),{out:l,state:d}}async qwen35DeltaNetStep(e,r,t,n,s,i,a,o,u){let c=globalThis,l=c.GPUBufferUsage.STORAGE|c.GPUBufferUsage.COPY_DST,d=this.device.createBuffer({size:16,usage:c.GPUBufferUsage.UNIFORM|c.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(d,0,new Uint32Array([a,o,u]));let p=this.buf(i,l|c.GPUBufferUsage.COPY_SRC),g=this.device.createBuffer({size:u*o*4,usage:l|c.GPUBufferUsage.COPY_SRC});this.dispatch("qwen35_deltanet_step",[d,this.buf(e,l),this.buf(r,l),this.buf(t,l),this.buf(n,l),this.buf(s,l),p,g],[Math.ceil(o/64),u,1]);let m=await this.readBack(g,u*o*4),w=await this.readBack(p,u*a*o*4);return g.destroy?.(),p.destroy?.(),d.destroy?.(),{out:m,S:w}}async matmulQ8(e,r,t,n,s,i){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s,i]));let c=this.device.createBuffer({size:n*i*4,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8",[u,this.buf(e,o),r,t,c],[Math.ceil(n/8),Math.ceil(i/8),1],c,n*i*4)}async matmulQ8Tiled(e,r,t,n,s,i){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s,i]));let c=this.device.createBuffer({size:n*i*4,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_tiled",[u,this.buf(e,o),r,t,c],[Math.ceil(Math.ceil(n/4)/8),Math.ceil(i/8),1],c,n*i*4)}async matmulQ8Shared(e,r,t,n,s,i){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s,i]));let c=this.device.createBuffer({size:n*i*4,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_shared",[u,this.buf(e,o),r,t,c],[Math.ceil(i/64),Math.ceil(n/32),1],c,n*i*4)}async matmulQ8Shared2(e,r,t,n,s,i){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s,i]));let c=this.device.createBuffer({size:n*i*4,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_shared2",[u,this.buf(e,o),r,t,c],[Math.ceil(i/128),Math.ceil(n/64),1],c,n*i*4)}async matmulQ4Shared2(e,r,t,n,s,i,a){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s,i,a]));let l=this.device.createBuffer({size:s*a*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_shared2",[c,this.buf(e,u),r,t,n,l],[Math.ceil(a/128),Math.ceil(s/64),1],l,s*a*4)}uniformOf(e){let r=globalThis,t=this.uniformPool.get(e);if(t&&t.length){let s=t.pop();return this.pooled.delete(s),s}let n=this.device.createBuffer({size:e,usage:r.GPUBufferUsage.UNIFORM|r.GPUBufferUsage.COPY_DST});return this.uniformSize.set(n,e),n}uniform(e,r){let t=this.uniformOf(32);if(this.device.queue.writeBuffer(t,0,new Uint32Array(e)),r){let n=Array.isArray(r.value)?r.value:[r.value];this.device.queue.writeBuffer(t,r.offset,new Float32Array(n))}return t}attnUniform(e,r,t,n,s,i,a,o,u){let c=this.uniformOf(48);return this.device.queue.writeBuffer(c,0,new Uint32Array([e,r,t,n,s,i])),this.device.queue.writeBuffer(c,24,new Float32Array([a,o])),this.device.queue.writeBuffer(c,32,new Uint32Array([u])),c}recMatmulT(e,r,t,n,s,i,a,o=!1){let u=this.uniform([s,i,a]),c=this.storage(s*a*4),l=this.matmulTPlan(s,i,a,o);return this.recordPass(e,l.shader,[u,t,n,c],l.grid),r.push(u,c),c}recConv2dDirect(e,r,t,n,s,i,a,o,u,c,l,d,p){let g=Math.floor((a+2*p-c)/d)+1,m=Math.floor((o+2*p-l)/d)+1,w=u*g*m,v=this.uniformOf(48);if(this.device.queue.writeBuffer(v,0,new Uint32Array([i,a,o,u,c,l,d,p,g,m])),c===3&&l===3&&d===1&&p===1&&this.convTiledOk){let S=this.storage(w*4);return this.recordPass(e,"conv2d_3x3_tiled",[v,t,n,s,S],[Math.ceil(m/16),Math.ceil(g/16),u]),r.push(v,S),S}let G=this.storage(w*4);return this.recordPass(e,"conv2d_direct",[v,t,n,s,G],this.grid1D(w)),r.push(v,G),G}recConv2dDirectQ8(e,r,t,n,s,i,a,o,u,c,l,d,p){let g=Math.floor((a+2*p-c)/d)+1,m=Math.floor((o+2*p-l)/d)+1,w=u*g*m,v=this.uniformOf(48);if(this.device.queue.writeBuffer(v,0,new Uint32Array([i,a,o,u,c,l,d,p,g,m])),c===3&&l===3&&d===1&&p===1&&this.convTiledQOk){let S=this.storage(w*4);return this.recordPass(e,"conv2d_3x3_tiled_q8",[v,t,n.codes,n.sc,s,S],[Math.ceil(m/16),Math.ceil(g/16),Math.ceil(u/8)]),r.push(v,S),S}if(c===1&&l===1&&d===1&&p===0&&this.convTiledQOk){let S=this.storage(w*4);return this.recordPass(e,"conv2d_1x1_q8",[v,t,n.codes,n.sc,s,S],[Math.ceil(m/16),Math.ceil(g/16),Math.ceil(u/8)]),r.push(v,S),S}if(c===3&&l===3&&d===2&&p===1&&this.convTiledQOk&&this.convS2Ok){let S=this.storage(w*4);return this.recordPass(e,"conv2d_3x3_s2_tiled_q8",[v,t,n.codes,n.sc,s,S],[Math.ceil(m/16),Math.ceil(g/8),Math.ceil(u/8)]),r.push(v,S),S}let G=this.storage(w*4);return this.recordPass(e,"conv2d_direct_q8",[v,t,n.codes,n.sc,s,G],this.grid1D(w)),r.push(v,G),G}recConv2dDirectQ4(e,r,t,n,s,i,a,o,u,c,l,d,p){let g=Math.floor((a+2*p-c)/d)+1,m=Math.floor((o+2*p-l)/d)+1,w=u*g*m,v=this.uniformOf(48);if(this.device.queue.writeBuffer(v,0,new Uint32Array([i,a,o,u,c,l,d,p,g,m])),c===3&&l===3&&d===1&&p===1&&this.convTiledQOk){let S=this.storage(w*4);return this.recordPass(e,"conv2d_3x3_tiled_q4",[v,t,n.nib,n.sc,n.mn,s,S],[Math.ceil(m/16),Math.ceil(g/16),Math.ceil(u/8)]),r.push(v,S),S}if(c===1&&l===1&&d===1&&p===0&&this.convTiledQOk){let S=this.storage(w*4);return this.recordPass(e,"conv2d_1x1_q4",[v,t,n.nib,n.sc,n.mn,s,S],[Math.ceil(m/16),Math.ceil(g/16),Math.ceil(u/8)]),r.push(v,S),S}if(c===3&&l===3&&d===2&&p===1&&this.convTiledQOk&&this.convS2Ok){let S=this.storage(w*4);return this.recordPass(e,"conv2d_3x3_s2_tiled_q4",[v,t,n.nib,n.sc,n.mn,s,S],[Math.ceil(m/16),Math.ceil(g/8),Math.ceil(u/8)]),r.push(v,S),S}let G=this.storage(w*4);return this.recordPass(e,"conv2d_direct_q4",[v,t,n.nib,n.sc,n.mn,s,G],this.grid1D(w)),r.push(v,G),G}recGroupNorm(e,r,t,n,s,i,a,o,u){let c=this.uniform([i,a,o],{offset:12,value:u}),l=this.storage(i*a*4),d=this.hasSubgroups&&this.subgroupsOk?"group_norm_subgroup":"group_norm";return this.recordPass(e,d,[c,t,n,s,l],[o,1,1]),r.push(c,l),l}recUnary(e,r,t,n,s){let i=this.storage(s*4);return this.recordPass(e,t,[n,i],this.grid1D(s)),r.push(i),i}recLayernorm(e,r,t,n,s,i,a,o){let u=this.uniform([i,a],{offset:8,value:o}),c=this.storage(i*a*4);return this.recordPass(e,"layernorm",[u,t,n,s,c],[Math.ceil(i/ce),1,1]),r.push(u,c),c}recAttentionFull(e,r,t,n,s,i,a,o,u,c,l){let d=this.uniform([i,a,o,u,c,0],{offset:24,value:[l??1/Math.sqrt(u),0]}),p=this.storage(i*a*u*4),g=i*a;return this.attnFullWgOk&&u<=192&&g<=65535?this.recordPass(e,"attention_full_wg",[d,t,n,s,p],[g,1,1]):this.recordPass(e,"attention_full",[d,t,n,s,p],[Math.ceil(g/ce),1,1]),r.push(d,p),p}recUpsample(e,r,t,n,s,i,a){let o=this.uniform([n,s,i,a]),u=n*(s*a)*(i*a),c=this.storage(u*4);return this.recordPass(e,"upsample_nearest",[o,t,c],this.grid1D(u)),r.push(o,c),c}recConcat(e,r,t,n,s,i,a){let o=this.storage((s+i)*a*4);return e.copyBufferToBuffer(t,0,o,0,s*a*4),e.copyBufferToBuffer(n,0,o,s*a*4,i*a*4),r.push(o),o}recAddChannelBias(e,r,t,n,s,i){let a=this.uniform([s,i]),o=this.storage(s*i*4);return this.recordPass(e,"add_channel_bias",[a,t,n,o],this.grid1D(s*i)),r.push(a,o),o}recTranspose(e,r,t,n,s){let i=this.uniform([n,s]),a=this.storage(n*s*4);return this.recordPass(e,"transpose2d",[i,t,a],this.grid1D(n*s)),r.push(i,a),a}recGegluSplit(e,r,t,n,s){let i=this.uniform([n,s]),a=this.storage(n*s*4);return this.recordPass(e,"geglu_split",[i,t,a],this.grid1D(n*s)),r.push(i,a),a}recUpscale2x(e,r,t,n,s,i,a=.5){let o=this.uniform([n,s,i],{offset:12,value:a}),u=i*2,c=s*2,l=this.storage(n*c*u*4);return this.recordPass(e,"upscale2x_enhanced",[o,t,l],[Math.ceil(u/16),Math.ceil(c/16),n]),r.push(o,l),l}recVideoGather(e,r,t,n,s,i){let a=this.uniform([n,s,i]),o=this.storage(i*n*s*4);return this.recordPass(e,"video_motion_gather",[a,t,o],this.grid1D(i*n*s)),r.push(a,o),o}recVideoScatter(e,r,t,n,s,i,a){let o=this.uniform([s,i,a]),u=this.storage(s*i*a*4);return this.recordPass(e,"video_motion_scatter",[o,t,n,u],this.grid1D(s*i*a)),r.push(o,u),u}recVideoAddPe(e,r,t,n,s,i,a){let o=this.uniform([s,i,a]),u=this.storage(a*s*i*4);return this.recordPass(e,"video_add_pe",[o,t,n,u],this.grid1D(a*s*i)),r.push(o,u),u}recAttnTemporal(e,r,t,n,s,i,a,o,u){let c=this.uniform([i,a,o,u],{offset:16,value:1/Math.sqrt(u)}),l=this.storage(i*a*o*u*4);return this.recordPass(e,"attn_temporal",[c,t,n,s,l],this.grid1D(i*a*o)),r.push(c,l),l}recordingSession(){let e=this.device.createCommandEncoder(),r=[],t=n=>{if(n instanceof Float32Array){let s=this.uploadGpu(n);return r.push(s),s}return n};return{conv2d:(n,s,i,a,o,u,c,l,d,p,g)=>s&&s.nib?this.recConv2dDirectQ4(e,r,t(n),s,t(i),a,o,u,c,l,d,p,g):s&&s.codes?this.recConv2dDirectQ8(e,r,t(n),s,t(i),a,o,u,c,l,d,p,g):this.recConv2dDirect(e,r,t(n),t(s),t(i),a,o,u,c,l,d,p,g),groupNorm:(n,s,i,a,o,u,c)=>this.recGroupNorm(e,r,t(n),t(s),t(i),a,o,u,c),silu:(n,s)=>this.recUnary(e,r,"silu",t(n),s),quickGelu:(n,s)=>this.recUnary(e,r,"quick_gelu",t(n),s),gelu:(n,s)=>this.recUnary(e,r,"gelu",t(n),s),relu:(n,s)=>this.recUnary(e,r,"relu",t(n),s),add:(n,s,i)=>this.recBinary(e,r,"add",t(n),t(s),i),geglu:(n,s,i)=>this.recBinary(e,r,"geglu",t(n),t(s),i),matmulT:(n,s,i,a,o)=>this.recMM(e,r,t(n),s instanceof Float32Array?t(s):s,i,a,o,!1),addBias:(n,s,i,a)=>this.recAddBias(e,r,t(n),t(s),i,a),addChannelBias:(n,s,i,a)=>this.recAddChannelBias(e,r,t(n),t(s),i,a),attentionFull:(n,s,i,a,o,u,c,l)=>this.recAttentionFull(e,r,t(n),t(s),t(i),a,o,u,c,l),rope2d:(n,s,i,a,o,u)=>{let c=s instanceof Uint32Array?(()=>{let l=this.uploadGpuRaw(new Uint8Array(s.buffer,s.byteOffset,s.byteLength));return r.push(l),l})():s;return this.recRope2d(e,r,t(n),c,i,a,o,u)},attention:(n,s,i,a,o,u,c,l,d)=>this.recAttention(e,r,t(n),t(s),t(i),a,o,u,c,l,d),upsample:(n,s,i,a,o)=>this.recUpsample(e,r,t(n),s,i,a,o),upscale2x:(n,s,i,a,o=.5)=>this.recUpscale2x(e,r,t(n),s,i,a,o),layernorm:(n,s,i,a,o,u)=>this.recLayernorm(e,r,t(n),t(s),t(i),a,o,u),concat:(n,s,i,a,o)=>this.recConcat(e,r,t(n),t(s),i,a,o),transpose:(n,s,i)=>this.recTranspose(e,r,t(n),s,i),gegluSplit:(n,s,i)=>this.recGegluSplit(e,r,t(n),s,i),videoGather:(n,s,i,a)=>this.recVideoGather(e,r,t(n),s,i,a),videoScatter:(n,s,i,a,o)=>this.recVideoScatter(e,r,t(n),t(s),i,a,o),videoAddPe:(n,s,i,a,o)=>this.recVideoAddPe(e,r,t(n),t(s),i,a,o),attnTemporal:(n,s,i,a,o,u,c)=>this.recAttnTemporal(e,r,t(n),t(s),t(i),a,o,u,c),alloc:n=>{let s=this.storage(n);return r.push(s),s},copy:(n,s,i,a,o)=>{e.copyBufferToBuffer(i,a,n,s,o)},finish:async(n,s)=>{this.device.queue.submit([e.finish()]);let i=await this.readBack(n,s*4);return this.release(r),i},finishKeep:n=>{this.device.queue.submit([e.finish()]);let s=r.indexOf(n);return s>=0&&r.splice(s,1),this.release(r),n},finishKeepMany:n=>{this.device.queue.submit([e.finish()]);for(let s of n){let i=r.indexOf(s);i>=0&&r.splice(i,1)}return this.release(r),n}}}readGpu(e,r){return this.readBack(e,r*4)}trimPool(e=64<<20){let r=[...this.bufferPool.keys()].sort((n,s)=>s-n),t=0;for(let n of this.bufferPool.values())for(let s of n)t+=this.poolSize.get(s)??0;for(let n of r){let s=this.bufferPool.get(n);for(;s.length&&t>e;){let i=s.pop();this.pooled.delete(i),this.poolSize.delete(i),i.destroy?.(),t-=n}}}releaseGpu(e){this.release(e)}waitGpu(){return this.device.queue.onSubmittedWorkDone()}async settleGpu(){this.device.queue.submit([]),await this.device.queue.onSubmittedWorkDone(),await new Promise(e=>setTimeout(e,0))}async benchMatmul(e,r,t,n,s,i={}){let{iters:a=10,shared:o=!0,shared2:u=!0,wF16:c=!1}=i,l=this.f16SharedOk,d=this.qSharedOk,p=this.qShared2Ok;this.f16SharedOk=o,this.qSharedOk=o,this.qShared2Ok=o&&u;let g=this.uploadGpu(e),m=[],w=this.device.createCommandEncoder();this.recMM(w,m,g,r,t,n,s,c),this.device.queue.submit([w.finish()]),await this.device.queue.onSubmittedWorkDone();let v=this.device.createCommandEncoder();for(let O=0;O<a;O++)this.recMM(v,m,g,r,t,n,s,c);let G=performance.now();this.device.queue.submit([v.finish()]),await this.device.queue.onSubmittedWorkDone();let S=(performance.now()-G)/a;return this.release(m),g.destroy?.(),this.f16SharedOk=l,this.qSharedOk=d,this.qShared2Ok=p,S}destroy(){try{this.profiler?.destroy()}catch{}this.profiler=null;try{this.device?.destroy?.()}catch{}this.bufferPool.clear(),this.uniformPool.clear()}f16ToF32Gpu(e,r){let t=this.uploadGpuRawF16(e),n=this.device.createBuffer({size:r*4,usage:ne.STORAGE_USAGE}),s=this.uniformOf(16);return this.device.queue.writeBuffer(s,0,new Uint32Array([r])),this.dispatch("f16_to_f32",[s,t,n],this.grid1D(Math.ceil(r/2))),t.destroy?.(),this.release([s]),n}quantizeQ8Gpu(e){let r=e instanceof Float32Array?e.length:e.n;if(r%32!==0)return this.uploadGpu(e);let t=e instanceof Float32Array?this.buf(e,ne.STORAGE_USAGE):this.f16ToF32Gpu(e.f16,r),n=this.f32ToQ8Gpu(t,r);return t.destroy?.(),n}async validateResidentOps(){let e=globalThis,r=k=>Float32Array.from({length:k},()=>(Math.random()*2-1)*.5),t=(k,b,A=.005)=>k.length===b.length&&k.every((P,B)=>Math.abs(P-b[B])<=A*(1+Math.abs(b[B]))),n=4,s=4,i=4,a=4,o=2,u=1e-5,c=a*s*i,l=r(n*s*i),d=r(a*n*9),p=r(a),g=r(a),m=r(a),w=await this.silu(await this.groupNorm(await this.conv2dDirect(l,d,p,n,s,i,a,3,3,1,1),g,m,a,s*i,o,u)),v=[],G=this.device.createCommandEncoder(),S=this.uploadGpu(l),O=this.uploadGpu(d),L=this.uploadGpu(p),K=this.uploadGpu(g),x=this.uploadGpu(m);v.push(S,O,L,K,x);let _=this.recConv2dDirect(G,v,S,O,L,n,s,i,a,3,3,1,1);_=this.recGroupNorm(G,v,_,K,x,a,s*i,o,u),_=this.recUnary(G,v,"silu",_,c);let y=this.device.createBuffer({size:c*4,usage:e.GPUBufferUsage.COPY_DST|e.GPUBufferUsage.MAP_READ});G.copyBufferToBuffer(_,0,y,0,c*4),this.device.queue.submit([G.finish()]),await y.mapAsync(e.GPUMapMode.READ);let h=new Float32Array(y.getMappedRange().slice(0));return y.unmap(),y.destroy(),this.release(v),t(h,w)?null:"resident_ops"}recMatmulQ4(e,r,t,n,s,i,a){let o=this.uniform([s,i,a]),u=this.storage(s*a*4);if(s===1&&this.gemvOk){let c=this.gemvGrid(a);this.recordPass(e,"matmul_t_q4_vec",[this.uniform([s,i,a,c.stride]),t,n.nib,n.sc,n.mn,u],c.grid)}else s>=64&&this.qSharedOk&&this.qShared2Ok?this.recordPass(e,"matmul_t_q4_shared2",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(a/128),Math.ceil(s/64),1]):s>=32&&this.qSharedOk?this.recordPass(e,"matmul_t_q4_shared",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(a/64),Math.ceil(s/32),1]):s>=2?this.recordPass(e,"matmul_t_q4_tiled",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(Math.ceil(s/4)/8),Math.ceil(a/8),1]):this.recordPass(e,"matmul_t_q4",[o,t,n.nib,n.sc,n.mn,u],[Math.ceil(s/8),Math.ceil(a/8),1]);return r.push(o,u),u}recMatmulQ8(e,r,t,n,s,i,a){let o=this.uniform([s,i,a]),u=this.storage(s*a*4);if(s===1&&this.gemvOk){let c=this.gemvGrid(a);this.recordPass(e,"matmul_t_q8_vec",[this.uniform([s,i,a,c.stride]),t,n.codes,n.sc,u],c.grid)}else s>=64&&this.qSharedOk&&this.qShared2Ok?this.recordPass(e,"matmul_t_q8_shared2",[o,t,n.codes,n.sc,u],[Math.ceil(a/128),Math.ceil(s/64),1]):s>=32&&this.qSharedOk?this.recordPass(e,"matmul_t_q8_shared",[o,t,n.codes,n.sc,u],[Math.ceil(a/64),Math.ceil(s/32),1]):s>=2?this.recordPass(e,"matmul_t_q8_tiled",[o,t,n.codes,n.sc,u],[Math.ceil(Math.ceil(s/4)/8),Math.ceil(a/8),1]):this.recordPass(e,"matmul_t_q8",[o,t,n.codes,n.sc,u],[Math.ceil(s/8),Math.ceil(a/8),1]);return r.push(o,u),u}uploadKq(e,r){let t=Math.ceil(r.byteLength/4)*4,n=this.device.createBuffer({size:t,usage:ne.STORAGE_USAGE});if(t===r.byteLength)this.device.queue.writeBuffer(n,0,r);else{let s=new Uint8Array(t);s.set(r),this.device.queue.writeBuffer(n,0,s)}return{kq:e,buf:n}}recMatmulKq(e,r,t,n,s,i,a){if(s===1){let w=this.gemvGrid(a),v=this.storage(a*4),G=this.uniform([1,i,a,w.stride]);return this.recordPass(e,n.kq==="Q4_K"?"matmul_t_q4k_vec":"matmul_t_q6k_vec",[G,t,n.buf,v],w.grid),r.push(G,v),v}let o=i*a,u=o/256,c=o/32,{f32:l,codes:d,sc:p}=this.kqScratchFor(o,r),g=this.uniform([u]);this.recordPass(e,ne.DEQUANT_SHADER[n.kq],[g,n.buf,l],this.grid1D(u)),e.clearBuffer(p,0,Math.ceil(c/2)*4);let m=this.uniform([c]);return this.recordPass(e,"quantize_q8",[m,l,d,p],this.grid1D(c)),r.push(g,m),this.recMatmulQ8(e,r,t,{codes:d,sc:p},s,i,a)}kqScratchFor(e,r){if(this.kqScratch&&this.kqScratch.cap>=e)return this.kqScratch;this.kqScratch&&r.push(this.kqScratch.f32,this.kqScratch.codes,this.kqScratch.sc);let t=n=>this.device.createBuffer({size:n,usage:ne.STORAGE_USAGE});return this.kqScratch={f32:t(e*4),codes:t(e),sc:t(Math.ceil(e/64)*4),cap:e},this.kqScratch}gemvGrid(e){return e<=32768?{grid:[e,1,1],stride:32768}:{grid:[32768,Math.ceil(e/32768),1],stride:32768}}async matmulQ4Vec(e,r,t,n,s,i){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.gemvGrid(i),c=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([1,s,i,u.stride]));let l=this.device.createBuffer({size:i*4,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_vec",[c,this.buf(e,o),r,t,n,l],u.grid,l,i*4)}async matmulQ8Vec(e,r,t,n,s){let i=globalThis,a=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=this.gemvGrid(s),u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([1,n,s,o.stride]));let c=this.device.createBuffer({size:s*4,usage:a|i.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_vec",[u,this.buf(e,a),r,t,c],o.grid,c,s*4)}recMatmulQ3(e,r,t,n,s,i,a){let o=this.uniform([s,i,a]),u=this.storage(s*a*4);return this.recordPass(e,"matmul_t_q3",[o,t,n.lo,n.hi,n.sc,n.mn,u],[Math.ceil(s/8),Math.ceil(a/8),1]),r.push(o,u),u}recMM(e,r,t,n,s,i,a,o){return n&&n.kq?this.recMatmulKq(e,r,t,n,s,i,a):n&&n.q3?this.recMatmulQ3(e,r,t,n,s,i,a):n&&n.nib?this.recMatmulQ4(e,r,t,n,s,i,a):n&&n.codes?this.recMatmulQ8(e,r,t,n,s,i,a):this.recMatmulT(e,r,t,n,s,i,a,o)}recRmsnorm(e,r,t,n,s,i,a,o=!1){let u=this.uniform([s,i,0,o?1:0],{offset:8,value:a}),c=this.storage(s*i*4);if(this.rmsVecOk&&s<=65535){let l=this.hasSubgroups&&this.subgroupsOk?"rmsnorm_vec_subgroup":"rmsnorm_vec";this.recordPass(e,l,[u,t,n,c],[s,1,1])}else this.recordPass(e,"rmsnorm",[u,t,n,c],[Math.ceil(s/ce),1,1]);return r.push(u,c),c}recRope(e,r,t,n,s,i,a,o,u=!1){let c=this.uniform([n,s,i,a],{offset:16,value:o});this.device.queue.writeBuffer(c,20,new Uint32Array([u?1:0]));let l=this.storage(n*s*4);return this.recordPass(e,"rope",[c,t,l],[Math.ceil(n/ce),1,1]),r.push(c,l),l}recRopeMrope(e,r,t,n,s,i,a,o,u){let c=u[0],l=u[0]+u[1],d=this.uniform([s,i,a,c,l],{offset:20,value:o}),p=this.storage(s*i*4);return this.recordPass(e,"rope_mrope",[d,t,n,p],[Math.ceil(s/ce),1,1]),r.push(d,p),p}preparePositions(e,r){if(e.positions&&e.mropeSections){let t=this.storage(e.positions.byteLength);this.device.queue.writeBuffer(t,0,e.positions),r.push(t),e._posGpu=t}if(e.ropeFactors){let t=this.storage(e.ropeFactors.byteLength);this.device.queue.writeBuffer(t,0,e.ropeFactors),r.push(t),e._ffGpu=t}}recRope2d(e,r,t,n,s,i,a,o){let u=this.uniform([s,i,a,0],{offset:16,value:o}),c=this.storage(s*i*4);return this.recordPass(e,"rope_2d",[u,t,n,c],[Math.ceil(s/ce),1,1]),r.push(u,c),c}recRopeFactors(e,r,t,n,s,i,a,o,u,c=!1){let l=this.uniform([s,i,a,o],{offset:16,value:u});this.device.queue.writeBuffer(l,20,new Uint32Array([c?1:0]));let d=this.storage(s*i*4);return this.recordPass(e,"rope_factors",[l,t,n,d],[Math.ceil(s/ce),1,1]),r.push(l,d),d}recAttention(e,r,t,n,s,i,a,o,u,c,l,d,p=0,g=0){let m=this.attnUniform(i,a,o,u,c,l,d??1/Math.sqrt(u),p,g),w=this.storage(i*a*u*4);return this.attnDecodeOk&&i*a<256&&u<=128?this.recordPass(e,"attention_decode",[m,t,n,s,w],[i*a,1,1]):this.attnPrefillOk&&u<=128?this.recordPass(e,"attention_prefill",[m,t,n,s,w],[Math.ceil(i/4)*a,1,1]):this.attnWideOk&&u>128&&u<=512&&u%4===0&&i*a<=ne.MAX_WG_DIM?this.recordPass(e,"attention_wide",[m,t,n,s,w],[i*a,1,1]):this.recordPass(e,"attention",[m,t,n,s,w],[Math.ceil(i*a/ce),1,1]),r.push(m,w),w}recQuantizeKv(e,r,t,n,s,i,a,o,u){let c=this.uniform([i,a,o,u]);this.recordPass(e,"quantize_kv",[c,t,n,s],this.grid1D(i*a)),r.push(c)}recAttentionQ8(e,r,t,n,s,i,a,o,u,c,l,d,p,g,m=0,w=0){let v=this.attnUniform(o,u,c,l,d,p,g??1/Math.sqrt(l),m,w),G=this.storage(o*u*l*4);return this.attnDecodeOk&&o*u<256&&l<=128?this.recordPass(e,"attention_decode_q8kv",[v,t,n,s,i,a,G],[o*u,1,1]):this.attnPrefillOk&&l<=128?this.recordPass(e,"attention_prefill_q8kv",[v,t,n,s,i,a,G],[Math.ceil(o/4)*u,1,1]):this.recordPass(e,"attention_q8kv",[v,t,n,s,i,a,G],[Math.ceil(o*u/ce),1,1]),r.push(v,G),G}recAddBias(e,r,t,n,s,i){let a=this.uniform([s,i]),o=this.storage(s*i*4);return this.recordPass(e,"addbias",[a,t,n,o],this.grid1D(s*i)),r.push(a,o),o}recBinary(e,r,t,n,s,i){let a=this.storage(i*4);return this.recordPass(e,t,[n,s,a],this.grid1D(i)),r.push(a),a}recQwen35Conv(e,r,t,n,s,i,a){let o=this.uniform([i,a]),u=this.storage(i*a*4);return this.recordPass(e,"qwen35_conv_batch",[o,t,n,s,u],this.grid1D(a)),r.push(o,u),u}recQwen35Gdn(e,r,t,n,s,i,a,o,u,c,l,d,p,g,m,w){let v=this.uniform([u,c,l,d,p,g,m],{offset:28,value:w}),G=this.storage(u*c*d*4);return this.recordPass(e,"qwen35_gdn_batch",[v,t,n,s,i,a,o,G],[c,1,1]),r.push(v,G),G}recRopePartial(e,r,t,n,s,i,a,o,u){let c=this.uniform([n,s,i,a],{offset:16,value:o});this.device.queue.writeBuffer(c,20,new Uint32Array([u]));let l=this.storage(n*s*4);return this.recordPass(e,"rope_partial",[c,t,l],[Math.ceil(n/ce),1,1]),r.push(c,l),l}recScale(e,r,t,n,s){let i=this.uniform([s],{offset:4,value:n}),a=this.storage(s*4);return this.recordPass(e,"scale",[i,t,a],this.grid1D(s)),r.push(i,a),a}recLfm2ShortConv(e,r,t,n,s,i,a){let o=this.uniform([i,a]),u=this.storage(i*4);return this.recordPass(e,"lfm2_shortconv",[o,t,s,n,u],this.grid1D(i)),r.push(o,u),u}recordLayerKV(e,r,t,n,s,i,a){let o=a.k,u=a.v,{seq:c,d:l,nHeads:d,nKvHeads:p,headDim:g,ffn:m,ropeTheta:w,eps:v}=n,G=p*g,S=i+c,O=s.matF16===!0,L=d*g,K=n.rmsGainOnePlus===!0,x=n.attnLogitSoftcap??0,_=n.act==="gelu"?"geglu":"swiglu",y=this.recRmsnorm(e,r,t,s.attnNorm,c,l,v,K),h=this.recMM(e,r,y,s.wq,c,l,L,O),k=this.recMM(e,r,y,s.wk,c,l,G,O),b=this.recMM(e,r,y,s.wv,c,l,G,O);s.bq&&(h=this.recAddBias(e,r,h,s.bq,c,L)),s.bk&&(k=this.recAddBias(e,r,k,s.bk,c,G)),s.bv&&(b=this.recAddBias(e,r,b,s.bv,c,G)),s.qNorm&&(h=this.recRmsnorm(e,r,h,s.qNorm,c*d,g,v,K)),s.kNorm&&(k=this.recRmsnorm(e,r,k,s.kNorm,c*p,g,v,K));let A=n._posGpu,P=n._ffGpu,B=n.ropeInterleaved===!0,U=(C,M,D)=>n.skipRope?C:A?this.recRopeMrope(e,r,C,A,M,g,D,w,n.mropeSections):P?this.recRopeFactors(e,r,C,P,M,g,D,i,w,B):this.recRope(e,r,C,M,g,D,i,w,B),q=U(h,c*d,d),T=U(k,c*p,p),j;if(a.kScale)this.recQuantizeKv(e,r,T,o,a.kScale,c,p,g,i),this.recQuantizeKv(e,r,b,u,a.vScale,c,p,g,i),j=this.recAttentionQ8(e,r,q,o,a.kScale,u,a.vScale,c,d,p,g,S,i,n.attnScale,x,n.window??0);else{let C=G*4;e.copyBufferToBuffer(T,0,o,i*C,c*C),e.copyBufferToBuffer(b,0,u,i*C,c*C),j=this.recAttention(e,r,q,o,u,c,d,p,g,S,i,n.attnScale,x,n.window??0)}let F=this.recMM(e,r,j,s.wo,c,L,l,O);s.postAttnNorm&&(F=this.recRmsnorm(e,r,F,s.postAttnNorm,c,l,v,K));let R=this.recBinary(e,r,"add",t,F,c*l),H=this.recRmsnorm(e,r,R,s.ffnNorm,c,l,v,K),Q=this.recMM(e,r,H,s.wgate,c,l,m,O),N=this.recMM(e,r,H,s.wup,c,l,m,O),V=this.recBinary(e,r,_,Q,N,c*m),$=this.recMM(e,r,V,s.wdown,c,m,l,O);return s.postFfnNorm&&($=this.recRmsnorm(e,r,$,s.postFfnNorm,c,l,v,K)),this.recBinary(e,r,"add",R,$,c*l)}setKvQuant(e){this.kvQuant!==e&&(this.kvQuant=e,this.resetKvGpu())}resetKvGpu(){for(let e of this.kvGpu.values())e.k.destroy?.(),e.v.destroy?.(),e.kScale?.destroy?.(),e.vScale?.destroy?.();this.kvGpu.clear(),this.kvSession="";for(let e of this.bufferPool.values())for(let r of e)r.destroy?.();this.bufferPool.clear()}clearKvCache(){this.resetKvGpu()}ensureKv(e,r,t,n){let s=this.kvGpu.get(e);if(s&&s.cap>=r)return s;let i=Math.max(r,(s?.cap??0)+1024,1024),a=this.kvQuant,o=this.storage(i*t*(a?1:4)),u=this.storage(i*t*(a?1:4)),c=a?this.storage(i*n*4):void 0,l=a?this.storage(i*n*4):void 0;if(s){let p=this.device.createCommandEncoder();p.copyBufferToBuffer(s.k,0,o,0,s.cap*t*(a?1:4)),p.copyBufferToBuffer(s.v,0,u,0,s.cap*t*(a?1:4)),a&&s.kScale&&(p.copyBufferToBuffer(s.kScale,0,c,0,s.cap*n*4),p.copyBufferToBuffer(s.vScale,0,l,0,s.cap*n*4)),this.device.queue.submit([p.finish()]),s.k.destroy?.(),s.v.destroy?.(),s.kScale?.destroy?.(),s.vScale?.destroy?.()}let d={k:o,v:u,cap:i,kScale:c,vScale:l};return this.kvGpu.set(e,d),d}async runDecodeGpu(e,r,t,n,s,i){let{seq:a,d:o,nKvHeads:u,headDim:c,eps:l}=r,d=u*c,p=n+a;(i!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${i}" inconnue avec pastLen=${n} : cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=i);for(let O=0;O<t.length;O++)this.ensureKv(O,p,d,u);let g=[];this.preparePositions(r,g);let m=this.device.createCommandEncoder(),w=this.storage(e.byteLength);this.device.queue.writeBuffer(w,0,e),g.push(w);for(let O=0;O<t.length;O++){let L=this.kvGpu.get(O);w=this.recordLayerKV(m,g,w,or(r,a,O,this.swaOk),t[O],n,L)}let v=this.recRmsnorm(m,g,w,s,a,o,l,r.rmsGainOnePlus===!0),G=this.storage(o*4);m.copyBufferToBuffer(v,(a-1)*o*4,G,0,o*4),this.device.queue.submit([m.finish()]);let S=await this.readBack(G,o*4);return g.push(G),this.release(g),S}async decodeLogitsQ8(e,r,t,n,s,i,a,o){let u=globalThis,{seq:c,d:l,nKvHeads:d,headDim:p,eps:g}=r,m=d*p,w=n+c;(i!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${i}" inconnue avec pastLen=${n} : cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=i);for(let y=0;y<t.length;y++)this.ensureKv(y,w,m,d);let v=[];this.preparePositions(r,v);let G=this.device.createCommandEncoder(),S=this.storage(e.byteLength);this.device.queue.writeBuffer(S,0,e),v.push(S);for(let y=0;y<t.length;y++){let h=this.kvGpu.get(y);S=this.recordLayerKV(G,v,S,or(r,c,y,this.swaOk),t[y],n,h)}let O=this.recRmsnorm(G,v,S,s,c,l,g,r.rmsGainOnePlus===!0),L=this.storage(l*4);G.copyBufferToBuffer(O,(c-1)*l*4,L,0,l*4),v.push(L);let K=this.storage(o*4);v.push(K);for(let y of a){let h=this.recMM(G,v,L,y.w,1,l,y.rows,!1);G.copyBufferToBuffer(h,0,K,y.r0*4,y.rows*4)}let x=this.device.createBuffer({size:o*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});G.copyBufferToBuffer(K,0,x,0,o*4),this.device.queue.submit([G.finish()]),await x.mapAsync(u.GPUMapMode.READ);let _=new Float32Array(x.getMappedRange().slice(0));return x.unmap(),x.destroy(),this.release(v),_}async decodeTopKQ8(e,r,t,n,s,i,a,o,u,c,l,d=64){let p=globalThis,{seq:g,d:m,nKvHeads:w,headDim:v,eps:G}=r,S=w*v,O=n+g;(i!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${i}" inconnue avec pastLen=${n} : cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=i);for(let U=0;U<t.length;U++)this.ensureKv(U,O,S,w);let L=ne.timingOn?(U,q)=>console.info(`[timing:gpu] ${U} ${(performance.now()-q).toFixed(0)} ms`):null,K=performance.now(),x=[];this.preparePositions(r,x);let _=this.device.createCommandEncoder(),y=this.storage(e.byteLength);this.device.queue.writeBuffer(y,0,e),x.push(y);for(let U=0;U<t.length;U++){let q=this.kvGpu.get(U);y=this.recordLayerKV(_,x,y,or(r,g,U,this.swaOk),t[U],n,q)}let h=this.recRmsnorm(_,x,y,s,g,m,G,r.rmsGainOnePlus===!0),k=this.storage(m*4);_.copyBufferToBuffer(h,(g-1)*m*4,k,0,m*4),x.push(k);let b=this.storage(o*4);x.push(b);for(let U of a){let q=this.recMM(_,x,k,U.w,1,m,U.rows,!1);_.copyBufferToBuffer(q,0,b,U.r0*4,U.rows*4)}if(l&&l>0){let U=this.uniform([o],{offset:4,value:l});this.recordPass(_,"softcap_logits",[U,b],this.grid1D(o)),x.push(U)}if(c&&c!==1&&u.length){let U=Uint32Array.from(u),q=this.bufU32(U,p.GPUBufferUsage.STORAGE|p.GPUBufferUsage.COPY_DST),T=this.uniform([U.length],{offset:4,value:c});this.recordPass(_,"penalize_logits",[T,q,b],this.grid1D(U.length)),x.push(T,q)}let A=this.storage(d*2*4);x.push(A);{let U=this.uniform([o,d]);this.recordPass(_,this.topKParOk?"top_k_par":"top_k",[U,b,A],[1,1,1]),x.push(U)}let P=this.device.createBuffer({size:d*2*4,usage:p.GPUBufferUsage.COPY_DST|p.GPUBufferUsage.MAP_READ});_.copyBufferToBuffer(A,0,P,0,d*2*4),L?.("enregistrement des passes (compilation des pipelines incluse)",K),K=performance.now(),this.device.queue.submit([_.finish()]),await P.mapAsync(p.GPUMapMode.READ),L?.("execution GPU (submit + readback)",K);let B=new Uint32Array(P.getMappedRange().slice(0));return P.unmap(),P.destroy(),this.release(x),{ids:B.slice(0,d),vals:new Float32Array(B.buffer,d*4,d)}}resetLfm2State(){for(let e of this.lfm2KvGpu.values())e.k.destroy?.(),e.v.destroy?.();for(let e of this.lfm2ConvGpu.values())e.destroy?.();this.lfm2KvGpu.clear(),this.lfm2ConvGpu.clear(),this.lfm2Session="";for(let e of this.bufferPool.values())for(let r of e)r.destroy?.();this.bufferPool.clear()}clearLfm2State(){this.resetLfm2State()}ensureLfm2Kv(e,r,t){let n=this.lfm2KvGpu.get(e);if(n&&n.cap>=r)return n;let s=Math.max(r,(n?.cap??0)+1024,1024),i=this.storage(s*t*4),a=this.storage(s*t*4);if(n){let u=this.device.createCommandEncoder();u.copyBufferToBuffer(n.k,0,i,0,n.cap*t*4),u.copyBufferToBuffer(n.v,0,a,0,n.cap*t*4),this.device.queue.submit([u.finish()]),n.k.destroy?.(),n.v.destroy?.()}let o={k:i,v:a,cap:s};return this.lfm2KvGpu.set(e,o),o}ensureLfm2Conv(e,r){let t=this.lfm2ConvGpu.get(e);return t||(t=this.storage(r*4),this.device.queue.writeBuffer(t,0,new Float32Array(r)),this.lfm2ConvGpu.set(e,t)),t}recLfm2ShortConvBatch(e,r,t,n,s,i,a,o){let u=this.uniform([i,a,o]),c=this.storage(o*i*4);this.recordPass(e,"lfm2_shortconv_batch",[u,t,s,n,c],this.grid1D(o*i));let l=this.uniform([i,a,o]);return this.recordPass(e,"lfm2_shortconv_state",[l,t,n],this.grid1D((a-1)*i)),r.push(u,l,c),c}recordLfm2(e,r,t,n,s,i,a,o){let{D:u,nHeads:c,nKvHeads:l,headDim:d,ffn:p,eps:g,theta:m,lc:w}=s,v=l*d,G=c*d,S=v*4;for(let L=0;L<i.length;L++)i[L].conv?this.ensureLfm2Conv(L,(w-1)*u):this.ensureLfm2Kv(L,o+n,v);if(n>=w-1&&this.lfm2BatchOk){let L=this.storage(n*u*4);this.device.queue.writeBuffer(L,0,t),r.push(L);for(let x=0;x<i.length;x++){let _=i[x],y=this.recRmsnorm(e,r,L,_.attnNorm,n,u,g),h;if(_.conv){let U=this.recMM(e,r,y,_.inProj,n,u,3*u,!1),q=this.recLfm2ShortConvBatch(e,r,U,this.lfm2ConvGpu.get(x),_.convW,u,w,n);h=this.recMM(e,r,q,_.outProj,n,u,u,!1)}else{let U=this.recMM(e,r,y,_.wq,n,u,G,!1),q=this.recMM(e,r,y,_.wk,n,u,v,!1),T=this.recMM(e,r,y,_.wv,n,u,v,!1);U=this.recRmsnorm(e,r,U,_.qNorm,n*c,d,g),q=this.recRmsnorm(e,r,q,_.kNorm,n*l,d,g),U=this.recRope(e,r,U,n*c,d,c,o,m),q=this.recRope(e,r,q,n*l,d,l,o,m);let j=this.lfm2KvGpu.get(x);e.copyBufferToBuffer(q,0,j.k,o*S,n*S),e.copyBufferToBuffer(T,0,j.v,o*S,n*S);let F=this.recAttention(e,r,U,j.k,j.v,n,c,l,d,o+n,o);h=this.recMM(e,r,F,_.wo,n,G,u,!1)}L=this.recBinary(e,r,"add",L,h,n*u);let k=this.recRmsnorm(e,r,L,_.ffnNorm,n,u,g),b=this.recMM(e,r,k,_.wgate,n,u,p,!1),A=this.recMM(e,r,k,_.wup,n,u,p,!1),P=this.recBinary(e,r,"swiglu",b,A,n*p),B=this.recMM(e,r,P,_.wdown,n,p,u,!1);L=this.recBinary(e,r,"add",L,B,n*u)}let K=this.storage(u*4);return r.push(K),e.copyBufferToBuffer(L,(n-1)*u*4,K,0,u*4),this.recRmsnorm(e,r,K,a,1,u,g)}let O=null;for(let L=0;L<n;L++){let K=o+L,x=this.storage(u*4);this.device.queue.writeBuffer(x,0,t.subarray(L*u,(L+1)*u)),r.push(x);for(let _=0;_<i.length;_++){let y=i[_],h=this.recRmsnorm(e,r,x,y.attnNorm,1,u,g),k;if(y.conv){let q=this.recMM(e,r,h,y.inProj,1,u,3*u,!1),T=this.recLfm2ShortConv(e,r,q,this.lfm2ConvGpu.get(_),y.convW,u,w);k=this.recMM(e,r,T,y.outProj,1,u,u,!1)}else{let q=this.recMM(e,r,h,y.wq,1,u,G,!1),T=this.recMM(e,r,h,y.wk,1,u,v,!1),j=this.recMM(e,r,h,y.wv,1,u,v,!1);q=this.recRmsnorm(e,r,q,y.qNorm,c,d,g),T=this.recRmsnorm(e,r,T,y.kNorm,l,d,g),q=this.recRope(e,r,q,c,d,c,K,m),T=this.recRope(e,r,T,l,d,l,K,m);let F=this.lfm2KvGpu.get(_);e.copyBufferToBuffer(T,0,F.k,K*S,S),e.copyBufferToBuffer(j,0,F.v,K*S,S);let R=this.recAttention(e,r,q,F.k,F.v,1,c,l,d,K+1,K);k=this.recMM(e,r,R,y.wo,1,G,u,!1)}x=this.recBinary(e,r,"add",x,k,u);let b=this.recRmsnorm(e,r,x,y.ffnNorm,1,u,g),A=this.recMM(e,r,b,y.wgate,1,u,p,!1),P=this.recMM(e,r,b,y.wup,1,u,p,!1),B=this.recBinary(e,r,"swiglu",A,P,p),U=this.recMM(e,r,B,y.wdown,1,p,u,!1);x=this.recBinary(e,r,"add",x,U,u)}L===n-1&&(O=this.recRmsnorm(e,r,x,a,1,u,g))}return O}lfm2SessionReset(e,r){(e!==this.lfm2Session||r===0)&&(r>0&&console.error(`[lfm2] session "${e}" inconnue avec pastLen=${r} : \xE9tat perdu, sortie invalide. Repartir de pastLen 0.`),this.resetLfm2State(),this.lfm2Session=e)}async lfm2PrefillGpu(e,r,t,n,s,i,a){this.lfm2SessionReset(a,i);let o=[],u=this.device.createCommandEncoder();this.recordLfm2(u,o,e,r,t,n,s,i),this.device.queue.submit([u.finish()]),await this.device.queue.onSubmittedWorkDone(),this.release(o)}async lfm2LogitsGpu(e,r,t,n,s,i,a,o){let u=globalThis;this.lfm2SessionReset(o,a);let c=[],l=this.device.createCommandEncoder(),d=this.recordLfm2(l,c,e,r,t,n,i,a),p=this.recMM(l,c,d,s,1,t.D,t.vocab,!1),g=this.device.createBuffer({size:t.vocab*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});l.copyBufferToBuffer(p,0,g,0,t.vocab*4),this.device.queue.submit([l.finish()]),await g.mapAsync(u.GPUMapMode.READ);let m=new Float32Array(g.getMappedRange().slice(0));return g.unmap(),g.destroy(),this.release(c),m}async lfm2TopKGpu(e,r,t,n,s,i,a,o,u,c,l=64){let d=globalThis;this.lfm2SessionReset(o,a);let p=[],g=this.device.createCommandEncoder(),m=this.recordLfm2(g,p,e,r,t,n,i,a),w=this.recMM(g,p,m,s,1,t.D,t.vocab,!1);if(c&&c!==1&&u.length){let O=Uint32Array.from(u),L=this.bufU32(O,d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST),K=this.uniform([O.length],{offset:4,value:c});this.recordPass(g,"penalize_logits",[K,L,w],this.grid1D(O.length)),p.push(K,L)}let v=this.storage(l*2*4);p.push(v);{let O=this.uniform([t.vocab,l]);this.recordPass(g,this.topKParOk?"top_k_par":"top_k",[O,w,v],[1,1,1]),p.push(O)}let G=this.device.createBuffer({size:l*2*4,usage:d.GPUBufferUsage.COPY_DST|d.GPUBufferUsage.MAP_READ});g.copyBufferToBuffer(v,0,G,0,l*2*4),this.device.queue.submit([g.finish()]),await G.mapAsync(d.GPUMapMode.READ);let S=new Uint32Array(G.getMappedRange().slice(0));return G.unmap(),G.destroy(),this.release(p),{ids:S.slice(0,l),vals:new Float32Array(S.buffer,l*4,l)}}resetRwkvState(){for(let e of this.rwkvStateGpu.values())e.S.destroy?.(),e.tm.destroy?.(),e.cm.destroy?.();this.rwkvStateGpu.clear(),this.rwkvVFirst?.destroy?.(),this.rwkvVFirst=null,this.rwkvSession="";for(let e of this.bufferPool.values())for(let r of e)r.destroy?.();this.bufferPool.clear()}clearRwkvState(){this.resetRwkvState()}ensureRwkvState(e,r,t,n){let s=this.rwkvStateGpu.get(e);if(!s){let i=this.storage(t*n*n*4),a=this.storage(r*4),o=this.storage(r*4);this.device.queue.writeBuffer(i,0,new Float32Array(t*n*n)),this.device.queue.writeBuffer(a,0,new Float32Array(r)),this.device.queue.writeBuffer(o,0,new Float32Array(r)),s={S:i,tm:a,cm:o},this.rwkvStateGpu.set(e,s)}return s}rwkvSessionReset(e,r){(e!==this.rwkvSession||r===0)&&(r>0&&console.error(`[rwkv] session "${e}" inconnue avec pastLen=${r} : \xE9tat perdu, sortie invalide. Repartir de pastLen 0.`),this.resetRwkvState(),this.rwkvSession=e)}recRwkvToken(e,r,t,n,s,i){let{D:a,H:o,NH:u}=n,c=1e-5,l=64e-5;for(let d=0;d<s.length;d++){let p=s[d],g=this.rwkvStateGpu.get(d),m=this.recLayernorm(e,r,t,p.attnNormW,p.attnNormB,1,a,c),w=this.storage(6*a*4);{let D=this.uniform([a]);this.recordPass(e,"rwkv_token_shift",[D,m,g.tm,p.lerpFused,w],this.grid1D(6*a)),r.push(D,w)}e.copyBufferToBuffer(m,0,g.tm,0,a*4);let v=D=>{let E=this.storage(a*4);return e.copyBufferToBuffer(w,D*a*4,E,0,a*4),r.push(E),E},G=v(0),S=v(1),O=v(2),L=v(3),K=v(4),x=v(5),_=this.recMM(e,r,G,p.R,1,a,a,!1),y=this.recMM(e,r,O,p.K,1,a,a,!1),h=this.recMM(e,r,L,p.V,1,a,a,!1),k=this.recUnary(e,r,"tanh_act",this.recMM(e,r,S,p.w1,1,a,p.rw,!1),p.rw),b=this.recMM(e,r,k,p.w2,1,p.rw,a,!1),A=this.storage(a*4);this.recordPass(e,"rwkv_decay",[p.w0,b,A],this.grid1D(a)),r.push(A);let P=this.recMM(e,r,this.recMM(e,r,K,p.a1,1,a,p.ra,!1),p.a2,1,p.ra,a,!1),B=this.storage(a*4);this.recordPass(e,"rwkv_bias_sigmoid",[p.a0,P,B],this.grid1D(a)),r.push(B);let U=this.recUnary(e,r,"sigmoid",this.recMM(e,r,x,p.g1,1,a,p.rg,!1),p.rg),q=this.recMM(e,r,U,p.g2,1,p.rg,a,!1);if(d===0)e.copyBufferToBuffer(h,0,i,0,a*4);else{let D=this.recMM(e,r,this.recMM(e,r,L,p.v1,1,a,p.rv,!1),p.v2,1,p.rv,a,!1);this.recordPass(e,"rwkv_vresid",[h,i,p.v0,D],this.grid1D(a))}let T=this.storage(a*4),j=this.storage(a*4),F=this.storage(a*4);{let D=this.uniform([u,o]);this.recordPass(e,"rwkv_kprep",[D,y,B,p.kk,p.ka,T,j,F],this.grid1D(u)),r.push(D,T,j,F)}let R=this.storage(a*4);{let D=this.uniform([u,o]);this.recordPass(e,"rwkv_wkv7",[D,_,A,T,h,j,F,g.S,R],this.grid1D(u*o)),r.push(D,R)}let H=this.storage(a*4);{let D=this.uniform([u,o],{offset:8,value:l});this.recordPass(e,"rwkv_out_gn",[D,R,_,T,p.rk,h,p.lnWB,H],this.grid1D(u)),r.push(D,H)}let Q=this.recBinary(e,r,"mul",H,q,a),N=this.recMM(e,r,Q,p.O,1,a,a,!1);t=this.recBinary(e,r,"add",t,N,a);let V=this.recLayernorm(e,r,t,p.attnNorm2W,p.attnNorm2B,1,a,c),$=this.storage(a*4);this.recordPass(e,"rwkv_lerp",[V,g.cm,p.lerpK,$],this.grid1D(a)),r.push($),e.copyBufferToBuffer(V,0,g.cm,0,a*4);let C=this.recUnary(e,r,"sqrelu",this.recMM(e,r,$,p.cmK,1,a,p.ffn,!1),p.ffn),M=this.recMM(e,r,C,p.cmV,1,p.ffn,a,!1);t=this.recBinary(e,r,"add",t,M,a)}return t}recordRwkv(e,r,t,n,s,i,a){let{D:o,H:u,NH:c}=s;for(let d=0;d<i.length;d++)this.ensureRwkvState(d,o,c,u);this.rwkvVFirst||(this.rwkvVFirst=this.storage(o*4));let l=null;for(let d=0;d<n;d++){let p=this.storage(o*4);this.device.queue.writeBuffer(p,0,t.subarray(d*o,(d+1)*o)),r.push(p);let g=this.recLayernorm(e,r,p,a.tokW,a.tokB,1,o,1e-5),m=this.recRwkvToken(e,r,g,s,i,this.rwkvVFirst);d===n-1&&(l=this.recLayernorm(e,r,m,a.outW,a.outB,1,o,1e-5))}return l}async rwkvPrefillGpu(e,r,t,n,s,i,a){this.rwkvSessionReset(a,i);let o=[],u=this.device.createCommandEncoder();this.recordRwkv(u,o,e,r,t,n,s),this.device.queue.submit([u.finish()]),await this.device.queue.onSubmittedWorkDone(),this.release(o)}async rwkvLogitsGpu(e,r,t,n,s,i,a,o){let u=globalThis;this.rwkvSessionReset(o,a);let c=[],l=this.device.createCommandEncoder(),d=this.recordRwkv(l,c,e,r,t,n,i),p=this.recMM(l,c,d,s,1,t.D,t.vocab,!1),g=this.device.createBuffer({size:t.vocab*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});l.copyBufferToBuffer(p,0,g,0,t.vocab*4),this.device.queue.submit([l.finish()]),await g.mapAsync(u.GPUMapMode.READ);let m=new Float32Array(g.getMappedRange().slice(0));return g.unmap(),g.destroy(),this.release(c),m}async rwkvTopKGpu(e,r,t,n,s,i,a,o,u,c,l=64){let d=globalThis;this.rwkvSessionReset(o,a);let p=[],g=this.device.createCommandEncoder(),m=this.recordRwkv(g,p,e,r,t,n,i),w=this.recMM(g,p,m,s,1,t.D,t.vocab,!1);if(c&&c!==1&&u.length){let O=Uint32Array.from(u),L=this.bufU32(O,d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST),K=this.uniform([O.length],{offset:4,value:c});this.recordPass(g,"penalize_logits",[K,L,w],this.grid1D(O.length)),p.push(K,L)}let v=this.storage(l*2*4);p.push(v);{let O=this.uniform([t.vocab,l]);this.recordPass(g,this.topKParOk?"top_k_par":"top_k",[O,w,v],[1,1,1]),p.push(O)}let G=this.device.createBuffer({size:l*2*4,usage:d.GPUBufferUsage.COPY_DST|d.GPUBufferUsage.MAP_READ});g.copyBufferToBuffer(v,0,G,0,l*2*4),this.device.queue.submit([g.finish()]),await G.mapAsync(d.GPUMapMode.READ);let S=new Uint32Array(G.getMappedRange().slice(0));return G.unmap(),G.destroy(),this.release(p),{ids:S.slice(0,l),vals:new Float32Array(S.buffer,l*4,l)}}async argmaxProjection(e,r,t,n,s=!1){let i=globalThis,a=[],o=this.device.createCommandEncoder(),u=this.storage(e.byteLength);this.device.queue.writeBuffer(u,0,e),a.push(u);let c=this.storage(n*4);a.push(c);for(let m of r){let w=this.recMatmulT(o,a,u,m.buf,1,t,m.rows,s);o.copyBufferToBuffer(w,0,c,m.r0*4,m.rows*4)}let l=this.storage(4),d=this.uniform([n]);a.push(l,d),this.recordPass(o,"argmax",[d,c,l],[1,1,1]);let p=this.device.createBuffer({size:4,usage:i.GPUBufferUsage.COPY_DST|i.GPUBufferUsage.MAP_READ});o.copyBufferToBuffer(l,0,p,0,4),this.device.queue.submit([o.finish()]),await p.mapAsync(i.GPUMapMode.READ);let g=new Uint32Array(p.getMappedRange().slice(0))[0];return p.unmap(),p.destroy(),this.release(a),g}async projectLogits(e,r,t,n,s=!1){let i=globalThis,a=[],o=this.device.createCommandEncoder(),u=this.storage(e.byteLength);this.device.queue.writeBuffer(u,0,e),a.push(u);let c=this.storage(n*4);a.push(c);for(let p of r){let g=this.recMatmulT(o,a,u,p.buf,1,t,p.rows,s);o.copyBufferToBuffer(g,0,c,p.r0*4,p.rows*4)}let l=this.device.createBuffer({size:n*4,usage:i.GPUBufferUsage.COPY_DST|i.GPUBufferUsage.MAP_READ});o.copyBufferToBuffer(c,0,l,0,n*4),this.device.queue.submit([o.finish()]),await l.mapAsync(i.GPUMapMode.READ);let d=new Float32Array(l.getMappedRange().slice(0));return l.unmap(),l.destroy(),this.release(a),d}async selfValidate(){this.validationFailure=null;let e=x=>(this.validationFailure=x,console.error("[selfValidate] FAILED at:",x,"(hasF16="+this.hasF16+")"),!1),r=(x,_)=>x.length===_.length&&x.every((y,h)=>Math.abs(y-_[h])<.001),t=x=>Float32Array.from({length:x},()=>Math.random()*2-1),n=3,s=4,i=5,a=t(n*s),o=t(s*i),u=new Float32Array(n*i);for(let x=0;x<n;x++)for(let _=0;_<i;_++){let y=0;for(let h=0;h<s;h++)y+=a[x*s+h]*o[h*i+_];u[x*i+_]=y}if(!r(await this.matmul(a,o,n,s,i),u))return e("matmul");{let x=(y,h,k,b,A)=>{let P=new Float32Array(k*A);for(let B=0;B<k;B++)for(let U=0;U<A;U++){let q=0;for(let T=0;T<b;T++)q+=y[B*b+T]*h[U*b+T];P[B*A+U]=q}return P},_=async(y,h,k)=>{let b=t(y*h),A=t(k*h);return r(await this.matmulT(b,A,y,h,k),x(b,A,y,h,k))};if(!await _(3,8,5))return e("matmulT.vec4(3,8,5)");if(!await _(1,16,7))return e("matmulT.vec4(1,16,7)");if(!await _(2,6,4))return e("matmulT.scalar(2,6,4)");if(this.hasF16){let b=t(16),A=t(112),P=this.uploadGpuF16(A),B=await this.matmulT(b,P,1,16,7,!0),U=new Float32Array(7);for(let R=0;R<7;R++){let H=0;for(let Q=0;Q<16;Q++)H+=b[Q]*A[R*16+Q];U[R]=H}P.destroy?.();let q=R=>R.length===U.length&&R.every((H,Q)=>Math.abs(H-U[Q])<=.03*(1+Math.abs(U[Q])));if(!q(B))return e("matmulT.f16");let T=this.uploadGpu(A),j=this.f32ToF16Gpu(T,112),F=await this.matmulT(b,j,1,16,7,!0);if(T.destroy?.(),j.destroy?.(),!q(F))return e("packf16")}if(this.hasF16&&this.f16SharedOk){let y=[{m:20,k:128,n:18},{m:32,k:64,n:64},{m:70,k:40,n:130},{m:33,k:48,n:7}];for(let h of y){let k=t(h.m*h.k),b=t(h.n*h.k),A=this.uploadGpuF16(b),P=await this.matmulT(k,A,h.m,h.k,h.n,!0);this.f16SharedOk=!1;let B=await this.matmulT(k,A,h.m,h.k,h.n,!0);if(this.f16SharedOk=!0,A.destroy?.(),!(P.length===B.length&&P.every((q,T)=>Math.abs(q-B[T])<=.001*(1+Math.abs(B[T]))))){this.f16SharedOk=!1,console.warn(`[selfValidate] matmul_t_f16w_shared KO sur ce GPU (m=${h.m}, k=${h.k}, n=${h.n}) : repli sur matmul_t_f16w (plus lent, m\xEAme r\xE9sultat).`);break}}}}{let h=t(128),k=t(768),b=Oe(k),A=this.uploadGpuRaw(b.nibbles),P=this.uploadGpuRaw(new Uint8Array(b.scales.buffer,b.scales.byteOffset,b.scales.byteLength)),B=this.uploadGpuRaw(new Uint8Array(b.mins.buffer,b.mins.byteOffset,b.mins.byteLength)),U=await this.matmulQ4(h,A,P,B,1,128,6),q=me(b),T=new Float32Array(6);for(let Q=0;Q<6;Q++){let N=0;for(let V=0;V<128;V++)N+=h[V]*q[Q*128+V];T[Q]=N}if(A.destroy?.(),P.destroy?.(),B.destroy?.(),!r(U,T))return e("matmulQ4");let j=this.uploadGpu(k),F=this.f32ToQ4Gpu(j,768),R=await this.matmulQ4(h,F.nib,F.sc,F.mn,1,128,6);if(j.destroy?.(),F.nib.destroy?.(),F.sc.destroy?.(),F.mn.destroy?.(),!(R.length===T.length&&R.every((Q,N)=>Math.abs(Q-T[N])<=.06*(1+Math.abs(T[N]))+.02)))return e("quantize_q4")}{let h=t(640),k=t(768),b=an(k),A=this.uploadGpuRaw(new Uint8Array(b.lo.buffer,b.lo.byteOffset,b.lo.byteLength)),P=this.uploadGpuRaw(new Uint8Array(b.hi.buffer,b.hi.byteOffset,b.hi.byteLength)),B=this.uploadGpuRaw(new Uint8Array(b.scales.buffer,b.scales.byteOffset,b.scales.byteLength)),U=this.uploadGpuRaw(new Uint8Array(b.mins.buffer,b.mins.byteOffset,b.mins.byteLength)),q=await this.matmulQ3(h,A,P,B,U,5,128,6),T=Ke(b),j=new Float32Array(30);for(let F=0;F<5;F++)for(let R=0;R<6;R++){let H=0;for(let Q=0;Q<128;Q++)H+=h[F*128+Q]*T[R*128+Q];j[F*6+R]=H}if(A.destroy?.(),P.destroy?.(),B.destroy?.(),U.destroy?.(),!r(q,j))return e("matmulQ3")}{let h=t(640),k=t(768),b=Oe(k),A=this.uploadGpuRaw(b.nibbles),P=this.uploadGpuRaw(new Uint8Array(b.scales.buffer,b.scales.byteOffset,b.scales.byteLength)),B=this.uploadGpuRaw(new Uint8Array(b.mins.buffer,b.mins.byteOffset,b.mins.byteLength)),U=await this.matmulQ4Tiled(h,A,P,B,5,128,6),q=me(b),T=new Float32Array(30);for(let j=0;j<5;j++)for(let F=0;F<6;F++){let R=0;for(let H=0;H<128;H++)R+=h[j*128+H]*q[F*128+H];T[j*6+F]=R}if(A.destroy?.(),P.destroy?.(),B.destroy?.(),!r(U,T))return e("matmul_q4_tiled")}for(let x of[{m:20,n:18},{m:32,n:64},{m:70,n:130}]){let _=x.m,y=128,h=x.n,k=t(_*y),b=t(h*y),A=Oe(b),P=this.uploadGpuRaw(A.nibbles),B=this.uploadGpuRaw(new Uint8Array(A.scales.buffer,A.scales.byteOffset,A.scales.byteLength)),U=this.uploadGpuRaw(new Uint8Array(A.mins.buffer,A.mins.byteOffset,A.mins.byteLength)),q=await this.matmulQ4Shared(k,P,B,U,_,y,h),T=me(A),j=new Float32Array(_*h);for(let F=0;F<_;F++)for(let R=0;R<h;R++){let H=0;for(let Q=0;Q<y;Q++)H+=k[F*y+Q]*T[R*y+Q];j[F*h+R]=H}if(P.destroy?.(),B.destroy?.(),U.destroy?.(),!r(q,j))return e(`matmul_q4_shared(${_},${h})`)}{let h=t(128),k=t(768),b=Te(k),A=this.uploadGpuRaw(new Uint8Array(b.codes.buffer,b.codes.byteOffset,b.codes.byteLength)),P=this.uploadGpuRaw(new Uint8Array(b.scales.buffer,b.scales.byteOffset,b.scales.byteLength)),B=await this.matmulQ8(h,A,P,1,128,6),U=ve(b),q=new Float32Array(6);for(let R=0;R<6;R++){let H=0;for(let Q=0;Q<128;Q++)H+=h[Q]*U[R*128+Q];q[R]=H}if(A.destroy?.(),P.destroy?.(),!r(B,q))return e("matmulQ8");let T=this.uploadGpu(k),j=this.f32ToQ8Gpu(T,768),F=await this.matmulQ8(h,j.codes,j.sc,1,128,6);if(T.destroy?.(),j.codes.destroy?.(),j.sc.destroy?.(),!r(F,q))return e("quantize_q8")}{let h=t(640),k=t(768),b=Te(k),A=this.uploadGpuRaw(new Uint8Array(b.codes.buffer,b.codes.byteOffset,b.codes.byteLength)),P=this.uploadGpuRaw(new Uint8Array(b.scales.buffer,b.scales.byteOffset,b.scales.byteLength)),B=await this.matmulQ8Tiled(h,A,P,5,128,6),U=ve(b),q=new Float32Array(30);for(let T=0;T<5;T++)for(let j=0;j<6;j++){let F=0;for(let R=0;R<128;R++)F+=h[T*128+R]*U[j*128+R];q[T*6+j]=F}if(A.destroy?.(),P.destroy?.(),!r(B,q))return e("matmul_q8_tiled")}for(let x of[{k:128,n:6},{k:128,n:130},{k:4096,n:17}]){let _=x.k,y=x.n,h=t(_),k=t(y*_),b=Oe(k),A=this.uploadGpuRaw(b.nibbles),P=this.uploadGpuRaw(new Uint8Array(b.scales.buffer,b.scales.byteOffset,b.scales.byteLength)),B=this.uploadGpuRaw(new Uint8Array(b.mins.buffer,b.mins.byteOffset,b.mins.byteLength)),U=await this.matmulQ4Vec(h,A,P,B,_,y),q=me(b),T=new Float32Array(y);for(let V=0;V<y;V++){let $=0;for(let C=0;C<_;C++)$+=h[C]*q[V*_+C];T[V]=$}if(A.destroy?.(),P.destroy?.(),B.destroy?.(),!r(U,T))return e(`matmul_q4_vec(${_},${y})`);let j=Te(k),F=this.uploadGpuRaw(new Uint8Array(j.codes.buffer,j.codes.byteOffset,j.codes.byteLength)),R=this.uploadGpuRaw(new Uint8Array(j.scales.buffer,j.scales.byteOffset,j.scales.byteLength)),H=await this.matmulQ8Vec(h,F,R,_,y),Q=ve(j),N=new Float32Array(y);for(let V=0;V<y;V++){let $=0;for(let C=0;C<_;C++)$+=h[C]*Q[V*_+C];N[V]=$}if(F.destroy?.(),R.destroy?.(),!r(H,N))return e(`matmul_q8_vec(${_},${y})`)}for(let x of[{m:20,n:18},{m:32,n:64},{m:70,n:130}]){let _=x.m,y=128,h=x.n,k=t(_*y),b=t(h*y),A=Te(b),P=this.uploadGpuRaw(new Uint8Array(A.codes.buffer,A.codes.byteOffset,A.codes.byteLength)),B=this.uploadGpuRaw(new Uint8Array(A.scales.buffer,A.scales.byteOffset,A.scales.byteLength)),U=await this.matmulQ8Shared(k,P,B,_,y,h),q=ve(A),T=new Float32Array(_*h);for(let j=0;j<_;j++)for(let F=0;F<h;F++){let R=0;for(let H=0;H<y;H++)R+=k[j*y+H]*q[F*y+H];T[j*h+F]=R}if(P.destroy?.(),B.destroy?.(),!r(U,T))return e(`matmul_q8_shared(${_},${h})`)}if(this.qShared2Ok){let x=[{m:64,k:128,n:128},{m:65,k:128,n:130},{m:100,k:160,n:18},{m:70,k:96,n:200}];for(let _ of x){let y=_.m,h=_.k,k=_.n,b=t(y*h),A=t(k*h),P=new Float32Array(y*k),B=Te(A),U=ve(B);for(let C=0;C<y;C++)for(let M=0;M<k;M++){let D=0;for(let E=0;E<h;E++)D+=b[C*h+E]*U[M*h+E];P[C*k+M]=D}let q=this.uploadGpuRaw(new Uint8Array(B.codes.buffer,B.codes.byteOffset,B.codes.byteLength)),T=this.uploadGpuRaw(new Uint8Array(B.scales.buffer,B.scales.byteOffset,B.scales.byteLength)),j=await this.matmulQ8Shared2(b,q,T,y,h,k);q.destroy?.(),T.destroy?.();let F=Oe(A),R=me(F),H=new Float32Array(y*k);for(let C=0;C<y;C++)for(let M=0;M<k;M++){let D=0;for(let E=0;E<h;E++)D+=b[C*h+E]*R[M*h+E];H[C*k+M]=D}let Q=this.uploadGpuRaw(F.nibbles),N=this.uploadGpuRaw(new Uint8Array(F.scales.buffer,F.scales.byteOffset,F.scales.byteLength)),V=this.uploadGpuRaw(new Uint8Array(F.mins.buffer,F.mins.byteOffset,F.mins.byteLength)),$=await this.matmulQ4Shared2(b,Q,N,V,y,h,k);if(Q.destroy?.(),N.destroy?.(),V.destroy?.(),!r(j,P)||!r($,H)){this.qShared2Ok=!1,console.warn(`[selfValidate] matmul_t_q8/q4_shared2 KO sur ce GPU (m=${y}, k=${h}, n=${k}) : repli sur les tuiles 32\xD764 v1 (plus lentes, m\xEAme r\xE9sultat).`);break}}}{let _=t(1632),y=new Uint8Array(_.buffer,_.byteOffset,_.byteLength),h=(k,b)=>k.length===b.length&&k.every((A,P)=>A===b[P]);if(!h(await this.quantizeToBytes("F32",y,1632,"q8"),await this.quantizeToBytes("F32",y,1632,"q8",256)))return e("quantize_chunk_q8");if(!h(await this.quantizeToBytes("F32",y,1632,"q4"),await this.quantizeToBytes("F32",y,1632,"q4",256)))return e("quantize_chunk_q4")}let c=2,l=8,d=t(c*l),p=t(l),g=new Float32Array(c*l);for(let x=0;x<c;x++){let _=0;for(let h=0;h<l;h++)_+=d[x*l+h]**2;let y=1/Math.sqrt(_/l+1e-5);for(let h=0;h<l;h++)g[x*l+h]=d[x*l+h]*y*p[h]}if(!r(await this.rmsnorm(d,p,c,l),g))return e("rmsnorm");if(!r(await this.rmsnorm(d,p,c,l,1e-5,!0),Ee(d,p,c,l,1e-5,!0)))return e("rmsnorm.onePlus");let m=t(16),w=t(16),v=m.map((x,_)=>x/(1+Math.exp(-x))*w[_]);if(!r(await this.swiglu(m,w),v))return e("swiglu");let G=m.map((x,_)=>pn(x)*w[_]);if(!r(await this.geglu(m,w),G))return e("geglu");let S=m.map((x,_)=>x+w[_]);if(!r(await this.add(m,w),S))return e("add");{let x=ne.MAX_WG_DIM*ce+257,_=new Float32Array(x),y=new Float32Array(x),h=[0,1,ce-1,ce,ne.MAX_WG_DIM*ce-1,ne.MAX_WG_DIM*ce,x-1];for(let A of h)_[A]=A%7-3,y[A]=A%5-2;let k=await this.add(_,y),b=k.length===x;for(let A of h)Math.abs(k[A]-(_[A]+y[A]))>1e-5&&(b=!1);if(!b)return e("grid1D.add(2D)")}let O=(x,_,y=.003)=>x.length===_.length&&x.every((h,k)=>Math.abs(h-_[k])<=y*(1+Math.abs(_[k])));{let b=t(8);if(!O(await this.rope(b,2,4,2,1,1e4),ft(b,2,4,2,1,1e4)))return e("rope")}{let b=t(384),A=new Float32Array(64/2).fill(1);if(!O(await this.ropeFactors(b,A,6,64,2,7,5e5),ft(b,6,64,2,7,5e5)))return e("rope_factors.ones");let P=Float32Array.from({length:64/2},(B,U)=>1+U%5*.7);if(!O(await this.ropeFactors(b,P,6,64,2,7,5e5),Ws(b,P,6,64,2,7,5e5)))return e("rope_factors")}{let b=t(384);if(!O(await this.rope(b,6,64,2,7,5e5,!0),Ot(b,6,64,2,7,5e5)))return e("rope.interleaved");let A=t(8);if(!O(await this.rope(A,2,4,2,3,1e4,!0),Ot(A,2,4,2,3,1e4)))return e("rope.interleaved.hd4");let P=t(384);if(!O(await this.rope(P,6,64,2,0,5e5,!0),Ot(P,6,64,2,0,5e5)))return e("rope.interleaved.pos0");let B=64/2,U=new Float32Array(384);for(let R=0;R<6;R++)for(let H=0;H<B;H++)U[R*64+2*H]=b[R*64+H],U[R*64+2*H+1]=b[R*64+H+B];let q=await this.rope(U,6,64,2,7,5e5,!0),T=await this.rope(b,6,64,2,7,5e5,!1),j=new Float32Array(384);for(let R=0;R<6;R++)for(let H=0;H<B;H++)j[R*64+2*H]=T[R*64+H],j[R*64+2*H+1]=T[R*64+H+B];if(!O(q,j))return e("rope.interleaved.equivalence");let F=Float32Array.from({length:B},(R,H)=>1+H%5*.7);if(!O(await this.ropeFactors(b,F,6,64,2,7,5e5,!0),Ot(b,6,64,2,7,5e5,F)))return e("rope_factors.interleaved")}{let y=[16,24,24],h=1e6,k=3,b=k*2,A=5,P=t(b*128),B=new Uint32Array(k*3);for(let j=0;j<k;j++){let F=A+j;B.set([F,F,F],j*3)}let U=new Uint32Array([5,5,5,5,6,9,5,7,5]),q=O(await this.ropeMrope(P,B,b,128,2,y,h),ft(P,b,128,2,A,h)),T=O(await this.ropeMrope(P,U,b,128,2,y,h),Qs(P,U,b,128,2,y,h));(!q||!T)&&(this.mropeOk=!1,console.error(`[selfValidate] rope_mrope KO sur ce GPU (${q?"positions 3D":"d\xE9g\xE9n\xE9r\xE9\u2260rope"}). Vision d\xE9sactiv\xE9e, chat texte intact.`))}{let A=t(32),P=t(32),B=t(32);if(!O(await this.attention(A,P,B,2,4,2,4,2),xe(A,P,B,2,4,2,4,2)))return e("attention");let U=.3,q=5;if(!O(await this.attention(A,P,B,2,4,2,4,2,U,q),xe(A,P,B,2,4,2,4,2,U,q)))return e("attention.softcap");{let N=t(24),V=t(48),$=t(48);for(let C of[1,4,8,64]){if(!O(await this.attention(N,V,$,3,2,1,4,9,void 0,0,C),xe(N,V,$,3,2,1,4,9,void 0,0,C)))return e(`attention.window(${C})`);if(!O(await this.attentionDecode(N,V,$,3,2,1,4,9,void 0,0,C),xe(N,V,$,3,2,1,4,9,void 0,0,C)))return e(`attention_decode.window(${C})`)}}{let T=await this.quantizeKvReadback(P,4,2,4),j=await this.quantizeKvReadback(B,4,2,4),F=await this.attentionQ8Kv(A,T.codes,T.scales,j.codes,j.scales,2,4,2,4,2),R=($,C)=>{let M=new Float32Array(32);for(let D=0;D<4;D++)for(let E=0;E<2;E++){let W=C[D*2+E];for(let Y=0;Y<4;Y++){let I=D*2*4+E*4+Y,z=$[I>>2]>>(I&3)*8&255;M[I]=(z<128?z:z-256)*W}}return M},H=R(T.codes,T.scales),Q=R(j.codes,j.scales),N=xe(A,H,Q,2,4,2,4,2);if(!O(F,N,.005))return e("attention.q8kv");let V=0;for(let $=0;$<P.length;$++)V=Math.max(V,Math.abs(H[$]-P[$]));if(V>.05)return e("quantize_kv.error")}}{let x=y=>{this.attnDecodeOk=!1,console.error("[selfValidate] attention d\xE9codage HS sur ce GPU (\xE9tape :",y,") \u2192 repli kernels classiques (plus lents \xE0 contexte long, corrects)")},_=[{nT:1,nH:14,nKv:2,hd:64,past:300},{nT:10,nH:14,nKv:2,hd:64,past:173}];for(let y of _){if(!this.attnDecodeOk)break;let h=y.past+y.nT,k=t(y.nT*y.nH*y.hd),b=t(h*y.nKv*y.hd),A=t(h*y.nKv*y.hd);if(!O(await this.attentionDecode(k,b,A,y.nT,y.nH,y.nKv,y.hd,y.past),xe(k,b,A,y.nT,y.nH,y.nKv,y.hd,y.past))){x(`decode(nT=${y.nT})`);break}let P=await this.quantizeKvReadback(b,h,y.nKv,y.hd),B=await this.quantizeKvReadback(A,h,y.nKv,y.hd),U=await this.attentionQ8KvDecode(k,P.codes,P.scales,B.codes,B.scales,y.nT,y.nH,y.nKv,y.hd,y.past),q=await this.attentionQ8Kv(k,P.codes,P.scales,B.codes,B.scales,y.nT,y.nH,y.nKv,y.hd,y.past);if(!O(U,q,.005)){x(`decode.q8kv(nT=${y.nT})`);break}}if(this.attnDecodeOk){let P=t(64),B=t(350*8),U=t(350*8);O(await this.attentionDecode(P,B,U,2,4,2,8,173,.3,5),xe(P,B,U,2,4,2,8,173,.3,5))||x("decode.softcap")}if(this.attnDecodeOk){let P=t(256),B=t(9088),U=t(9088);O(await this.attentionDecode(P,B,U,1,2,1,128,70),xe(P,B,U,1,2,1,128,70))||x("decode.hd128")}}{let x=h=>{this.attnPrefillOk=!1,console.error("[selfValidate] attention prefill tuil\xE9e HS sur ce GPU (\xE9tape :",h,") \u2192 repli kernel classique (plus lent en prefill, correct)")},_=[{nT:37,nH:14,nKv:2,hd:64,past:0,sc:void 0,cap:0,win:0},{nT:13,nH:14,nKv:2,hd:64,past:173,sc:void 0,cap:0,win:0},{nT:1,nH:14,nKv:2,hd:64,past:300,sc:void 0,cap:0,win:0},{nT:4,nH:4,nKv:2,hd:32,past:7,sc:void 0,cap:0,win:0},{nT:5,nH:4,nKv:2,hd:32,past:0,sc:void 0,cap:0,win:0},{nT:9,nH:2,nKv:1,hd:128,past:70,sc:void 0,cap:0,win:0},{nT:6,nH:4,nKv:2,hd:8,past:17,sc:.3,cap:5,win:0}];for(let h of _){let k=h.past+h.nT,b=t(h.nT*h.nH*h.hd),A=t(k*h.nKv*h.hd),P=t(k*h.nKv*h.hd);if(!O(await this.attentionPrefill(b,A,P,h.nT,h.nH,h.nKv,h.hd,h.past,h.sc,h.cap,h.win),xe(b,A,P,h.nT,h.nH,h.nKv,h.hd,h.past,h.sc,h.cap,h.win))){x(`prefill(nT=${h.nT},hd=${h.hd},past=${h.past}${h.cap>0?",softcap":""})`);break}}if(this.attnPrefillOk){let U=t(80),q=t(76),T=t(76);for(let j of[1,4,8,64])if(!O(await this.attentionPrefill(U,q,T,10,2,1,4,9,void 0,0,j),xe(U,q,T,10,2,1,4,9,void 0,0,j))){x(`prefill.window(${j})`);break}}let y=[{nT:37,nH:14,nKv:2,hd:64,past:0,win:0},{nT:13,nH:14,nKv:2,hd:64,past:173,win:0},{nT:10,nH:2,nKv:1,hd:8,past:9,win:4}];for(let h of y){if(!this.attnPrefillOk)break;let k=h.past+h.nT,b=t(h.nT*h.nH*h.hd),A=t(k*h.nKv*h.hd),P=t(k*h.nKv*h.hd),B=await this.quantizeKvReadback(A,k,h.nKv,h.hd),U=await this.quantizeKvReadback(P,k,h.nKv,h.hd),q=await this.attentionQ8KvPrefill(b,B.codes,B.scales,U.codes,U.scales,h.nT,h.nH,h.nKv,h.hd,h.past,void 0,0,h.win),T=await this.attentionQ8Kv(b,B.codes,B.scales,U.codes,U.scales,h.nT,h.nH,h.nKv,h.hd,h.past,void 0,0,h.win);if(!O(q,T,.005)){x(`prefill.q8kv(nT=${h.nT},win=${h.win})`);break}}}{let x=y=>{this.rmsVecOk=!1,console.error("[selfValidate] RMSNorm parall\xE8le HS sur ce GPU (\xE9tape :",y,") \u2192 repli kernel une-ligne-par-thread (correct, plus lent en d\xE9codage)")},_=[{rows:1,dim:1024,onePlus:!1},{rows:1,dim:1536,onePlus:!1},{rows:1,dim:100,onePlus:!1},{rows:14,dim:64,onePlus:!1},{rows:37,dim:2048,onePlus:!1},{rows:3,dim:128,onePlus:!0}];for(let y of _){let h=t(y.rows*y.dim),k=t(y.dim),b=await this.rmsnormVec(h,k,y.rows,y.dim,1e-6,y.onePlus),A=await this.rmsnorm(h,k,y.rows,y.dim,1e-6,y.onePlus);if(!O(b,A,.005)){x(`rmsnorm_vec(${y.rows}\xD7${y.dim}${y.onePlus?",1+w":""})`);break}}}{let x=y=>{this.topKParOk=!1,console.error("[selfValidate] top-K parall\xE8le HS sur ce GPU (\xE9tape :",y,") \u2192 repli s\xE9lection sur un thread (correcte, plus lente)")},_=[{n:151936,k:64,ties:!1,label:"vocab Qwen (151936)"},{n:65536,k:64,ties:!1,label:"vocab World (65536)"},{n:1e3,k:64,ties:!1,label:"n non multiple de 128"},{n:300,k:64,ties:!1,label:"n < 1024 candidats"},{n:4096,k:8,ties:!1,label:"petit K"},{n:8192,k:64,ties:!0,label:"EX \xC6QUO (d\xE9partage)"}];for(let y of _){if(!this.topKParOk)break;let h=y.ties?Float32Array.from({length:y.n},(P,B)=>Math.round(Math.random()*6)+(B%7===0?3:0)):t(y.n),k=await this.topKReadback(h,y.k,"top_k"),b=await this.topKReadback(h,y.k,"top_k_par");if(!(k.length===b.length&&k.every((P,B)=>P===b[B]))){let P=k.findIndex((B,U)=>B!==b[U]);x(`top_k_par(${y.label}). Premier \xE9cart au rang ${P} : ${k[P]} vs ${b[P]}`);break}}}{let P={seq:3,d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},B={attnNorm:t(16),wq:t(256),wk:t(128),wv:t(128),wo:t(256),bq:t(16),bk:t(8),bv:t(8),ffnNorm:t(16),wgate:t(256),wup:t(256),wdown:t(256)},U=t(48);if(!O(await this.layerForward(U,P,B),ur(U,P,B),.005))return e("layerForward")}{let B={seq:3,d:12,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6,attnScale:1/Math.sqrt(4),attnLogitSoftcap:5,act:"gelu",rmsGainOnePlus:!0},U={attnNorm:t(12),wq:t(192),wk:t(96),wv:t(96),wo:t(192),ffnNorm:t(12),wgate:t(192),wup:t(192),wdown:t(192),postAttnNorm:t(12),postFfnNorm:t(12)},q=t(36);if(!O(await this.layerForward(q,B,U),ur(q,B,U),.005))return e("layerForward.gemma2")}{let B={seq:3,d:12,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e6,eps:1e-6},U={attnNorm:t(12),wq:t(192),wk:t(96),wv:t(96),wo:t(192),ffnNorm:t(12),wgate:t(192),wup:t(192),wdown:t(192),qNorm:t(4),kNorm:t(4)},q=t(36);if(!O(await this.layerForward(q,B,U),ur(q,B,U),.005))return e("layerForward.qwen3")}{let _=new Uint8Array(720);for(let h=0;h<5;h++){let k=h*144,b=new DataView(_.buffer);b.setUint16(k,Pe(.005+Math.random()*.05),!0),b.setUint16(k+2,Pe(.001+Math.random()*.02),!0);for(let A=4;A<144;A++)_[k+A]=Math.random()*256|0}let y=await this.dequantizeQ4K(_,5*256);if(!O(y,dn(_,5),1e-4))return e("dequant.Q4_K")}{let x=U=>{let q=new Uint8Array(U);for(let T=0;T<U;T++)q[T]=Math.random()*256|0;return q},_=(U,q)=>{let T=new DataView(U.buffer),j=F=>q===210?F*210+208:F*q;for(let F=0;F*q<U.length;F++)T.setUint16(j(F),Pe(.005+Math.random()*.05),!0);return U},h=_(x(136),34);if(!O(await this.dequantizeByType("Q8_0",h,128),Es(h,4),1e-4))return e("dequant.Q8_0");let k=_(x(88),22);if(!O(await this.dequantizeByType("Q5_0",k,128),Hs(k,4),1e-4))return e("dequant.Q5_0");let b=_(x(840),210);if(!O(await this.dequantizeByType("Q6_K",b,4*256),et(b,4),1e-4))return e("dequant.Q6_K");let A=_(x(72),18);if(!O(await this.dequantizeByType("Q4_0",A,128),zs(A,4),1e-4))return e("dequant.Q4_0");let P=x(704),B=new DataView(P.buffer);for(let U=0;U<4;U++)B.setUint16(U*176,Pe(.005+Math.random()*.05),!0),B.setUint16(U*176+2,Pe(.001+Math.random()*.02),!0);if(!O(await this.dequantizeByType("Q5_K",P,4*256),Ns(P,4),1e-4))return e("dequant.Q5_K");if(this.dequantQ3kOk){let U=x(440),q=new DataView(U.buffer);for(let j=0;j<4;j++)q.setUint16(j*110+108,Pe(.005+Math.random()*.05),!0);let T=await this.dequantizeByType("Q3_K",U,4*256);O(T,sr(U,4),1e-4)||(this.dequantQ3kOk=!1,console.warn("[selfValidate] dequant.Q3_K en \xE9chec, repli sur CPU"))}if(this.dequantQ41Ok){let U=x(80),q=new DataView(U.buffer);for(let j=0;j<4;j++)q.setUint16(j*20,Pe(.005+Math.random()*.05),!0),q.setUint16(j*20+2,Pe(.001+Math.random()*.02),!0);let T=await this.dequantizeByType("Q4_1",U,128);O(T,ir(U,4),1e-4)||(this.dequantQ41Ok=!1,console.warn("[selfValidate] dequant.Q4_1 en \xE9chec, repli sur CPU"))}}{let A={d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},P={attnNorm:t(16),wq:t(256),wk:t(128),wv:t(128),wo:t(256),bq:t(16),bk:t(8),bv:t(8),ffnNorm:t(16),wgate:t(256),wup:t(256),wdown:t(256)},B=t(48),q=(await this.layerForward(B,{...A,seq:3},P)).slice(32,48),T=new Float32Array(0),j=await this.layerForwardKV(B.slice(0,32),{...A,seq:2},P,0,T,T),F=await this.layerForwardKV(B.slice(32,48),{...A,seq:1},P,2,j.k,j.v);if(!O(F.out,q,.005))return e("layerForwardKV")}{let y=t(4),h=t(40),k=new Float32Array(10);for(let B=0;B<10;B++){let U=0;for(let q=0;q<4;q++)U+=y[q]*h[B*4+q];k[B]=U}let b=0;for(let B=1;B<10;B++)k[B]>k[b]&&(b=B);let A=this.uploadGpu(h),P=await this.argmaxProjection(y,[{buf:A,rows:10,r0:0}],4,10,!1);if(A.destroy?.(),P!==b)return e("argmaxProjection")}{let A={seq:4,d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},P={attnNorm:t(16),wq:t(256),wk:t(128),wv:t(128),wo:t(256),bq:t(16),bk:t(8),bv:t(8),ffnNorm:t(16),wgate:t(256),wup:t(256),wdown:t(256)},B=t(16),U=t(64),q=new Float32Array(0),T=await this.layerForwardKV(U,{...A,seq:4},P,0,q,q,!0),j=Ee(T.out.slice(48,64),B,1,16,1e-6),F={attnNorm:this.uploadGpu(P.attnNorm),wq:this.uploadGpu(P.wq),wk:this.uploadGpu(P.wk),wv:this.uploadGpu(P.wv),wo:this.uploadGpu(P.wo),ffnNorm:this.uploadGpu(P.ffnNorm),wgate:this.uploadGpu(P.wgate),wup:this.uploadGpu(P.wup),wdown:this.uploadGpu(P.wdown),bq:this.uploadGpu(P.bq),bk:this.uploadGpu(P.bk),bv:this.uploadGpu(P.bv)},R=this.uploadGpu(B),H=this.kvQuant;this.kvQuant=!1,this.resetKvGpu();let Q=await this.runDecodeGpu(U,{...A,seq:4},[F],0,R,"selftest-A");if(!O(Q,j,.008))return this.resetKvGpu(),this.kvQuant=H,e("runDecodeGpu.prefill");await this.runDecodeGpu(U.slice(0,48),{...A,seq:3},[F],0,R,"selftest-B");let N=await this.runDecodeGpu(U.slice(48,64),{...A,seq:1},[F],3,R,"selftest-B");if(!O(N,j,.008))return this.resetKvGpu(),this.kvQuant=H,e("runDecodeGpu.decode");this.kvQuant=H,this.resetKvGpu();for(let V of Object.values(F))V?.destroy?.();R.destroy?.()}{let k=Float32Array.from({length:152064},()=>(Math.random()*2-1)*8),b=[...new Set(Array.from({length:40},()=>Math.floor(Math.random()*152064)))],A=k.slice();for(let M=0;M<152064;M++)A[M]=30*Math.tanh(A[M]/30);for(let M of b)A[M]=A[M]>0?A[M]/1.15:A[M]*1.15;let P=Array.from(A.keys()).sort((M,D)=>A[D]-A[M]).slice(0,64),B=globalThis,U=[],q=this.storage(152064*4);this.device.queue.writeBuffer(q,0,k),U.push(q);let T=this.device.createCommandEncoder(),j=this.uniform([152064],{offset:4,value:30});this.recordPass(T,"softcap_logits",[j,q],this.grid1D(152064));let F=this.bufU32(Uint32Array.from(b),B.GPUBufferUsage.STORAGE|B.GPUBufferUsage.COPY_DST),R=this.uniform([b.length],{offset:4,value:1.15});this.recordPass(T,"penalize_logits",[R,F,q],this.grid1D(b.length));let H=this.storage(512),Q=this.uniform([152064,64]);this.recordPass(T,this.topKParOk?"top_k_par":"top_k",[Q,q,H],[1,1,1]),U.push(j,F,R,Q,H);let N=this.device.createBuffer({size:512,usage:B.GPUBufferUsage.COPY_DST|B.GPUBufferUsage.MAP_READ});T.copyBufferToBuffer(H,0,N,0,512),this.device.queue.submit([T.finish()]),await N.mapAsync(B.GPUMapMode.READ);let V=new Uint32Array(N.getMappedRange().slice(0));N.unmap(),N.destroy(),this.release(U);let $=V.slice(0,64),C=new Float32Array(V.buffer,256,64);this.topKOk=!0;for(let M=0;M<64;M++){let D=Math.abs(C[M]-A[P[M]])<=1e-4*(1+Math.abs(A[P[M]])),E=Math.abs(A[$[M]]-C[M])<=1e-4*(1+Math.abs(C[M]));if(!D||!E){this.topKOk=!1,console.error(`[selfValidate] top_k KO sur ce GPU (rang ${M}) : repli sur le sampling CPU plein-vocab (plus lent, m\xEAme r\xE9sultat).`);break}}}if(this.rwkvWkv7Ok){let h=t(128),k=t(16),b=t(16),A=t(16),P=t(16),B=t(16),U=Float32Array.from({length:16},()=>Math.random()*.5+.5),q=h.slice(),T=new Float32Array(16);for(let C=0;C<2;C++){let M=C*8;for(let D=0;D<8;D++){let E=C*8*8+D*8,W=A[M+D],Y=0;for(let z=0;z<8;z++)Y+=B[M+z]*q[E+z];let I=0;for(let z=0;z<8;z++){let X=U[M+z]*q[E+z]+W*b[M+z]+P[M+z]*Y;q[E+z]=X,I+=k[M+z]*X}T[M+D]=I}}let j=await this.rwkvWkv7(h.slice(),k,U,b,A,B,P,2,8),F=(C,M)=>C.length===M.length&&C.every((D,E)=>Math.abs(D-M[E])<=.001*(1+Math.abs(M[E])));!F(j.S,q)||!F(j.y,T)?(this.rwkvWkv7Ok=!1,console.error("[selfValidate] RWKV-7 WKV KO sur ce GPU : une archi RWKV (moteur v2) refuserait de charger (non bloquant pour le chat texte).")):console.log("[selfValidate] RWKV-7 WKV OK (r\xE9currence \xE0 \xE9tat fixe, moteur v2)");let R=16,H=t(R),Q=t(R),N=t(R*6),V=new Float32Array(R*6);for(let C=0;C<6;C++)for(let M=0;M<R;M++){let D=C*R+M;V[D]=H[M]+(Q[M]-H[M])*N[D]}let $=await this.rwkvTokenShift(H,Q,N,R);if(F($,V)?console.log("[selfValidate] RWKV-7 token-shift OK"):(this.rwkvWkv7Ok=!1,console.error("[selfValidate] RWKV-7 token-shift KO sur ce GPU (non bloquant pour le chat texte).")),this.rwkvResidentOk){let C=globalThis,M=C.GPUBufferUsage.STORAGE|C.GPUBufferUsage.COPY_DST|C.GPUBufferUsage.COPY_SRC,D=2,E=8,W=D*E,Y=(z,X)=>{let te=Math.max(16,Math.ceil((z.length*4+(X?4:0))/16)*16),J=this.device.createBuffer({size:te,usage:C.GPUBufferUsage.UNIFORM|C.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(J,0,new Uint32Array(z)),X&&this.device.queue.writeBuffer(J,X.off,new Float32Array([X.val])),J},I=z=>this.device.createBuffer({size:z*4,usage:M});try{let z=t(W),X=t(W),te=t(W),J=Float32Array.from({length:W},()=>Math.random()),re=new Float32Array(W),ie=new Float32Array(W),ue=new Float32Array(W);for(let pe=0;pe<D;pe++){let oe=0;for(let Ae=0;Ae<E;Ae++){let be=z[pe*E+Ae]*X[pe*E+Ae];oe+=be*be}oe=Math.sqrt(oe)||1e-12;for(let Ae=0;Ae<E;Ae++){let be=pe*E+Ae,Pt=z[be]*X[be]/oe;ie[be]=-Pt,ue[be]=Pt*J[be],re[be]=z[be]*(1+(J[be]-1)*te[be])}}let Z=I(W),Se=I(W),ee=I(W);this.dispatch("rwkv_kprep",[Y([D,E]),this.buf(z,M),this.buf(J,M),this.buf(X,M),this.buf(te,M),Z,Se,ee],this.grid1D(D));let Be=F(await this.readBack(Z,W*4),re)&&F(await this.readBack(Se,W*4),ie)&&F(await this.readBack(ee,W*4),ue);Z.destroy?.(),Se.destroy?.(),ee.destroy?.();let he=t(W),kt=t(W),Xe=t(W),At=t(W),_t=t(W),Qe=t(W),fe=new Float32Array(W);for(let pe=0;pe<D;pe++){let oe=pe*E,Ae=0;for(let de=0;de<E;de++)Ae+=he[oe+de];Ae/=E;let be=0;for(let de=0;de<E;de++){let $r=he[oe+de]-Ae;be+=$r*$r}be/=E;let Pt=1/Math.sqrt(be+64e-5),Ir=0;for(let de=0;de<E;de++)Ir+=kt[oe+de]*re[oe+de]*Xe[oe+de];for(let de=0;de<E;de++)fe[oe+de]=(he[oe+de]-Ae)*Pt*_t[oe+de]+Qe[oe+de]+Ir*At[oe+de]}let Je=new Float32Array(2*W);Je.set(_t,0),Je.set(Qe,W);let st=I(W);this.dispatch("rwkv_out_gn",[Y([D,E],{off:8,val:64e-5}),this.buf(he,M),this.buf(kt,M),this.buf(re,M),this.buf(Xe,M),this.buf(At,M),this.buf(Je,M),st],this.grid1D(D));let it=F(await this.readBack(st,W*4),fe);st.destroy?.();let ye=t(W),Tr=t(W),_s=Float32Array.from(ye,(pe,oe)=>Math.exp(-.606531/(1+Math.exp(-(pe+Tr[oe]))))),Yt=I(W);this.dispatch("rwkv_decay",[this.buf(ye,M),this.buf(Tr,M),Yt],this.grid1D(W));let Cr=F(await this.readBack(Yt,W*4),_s);Yt.destroy?.();let Rr=t(W),Lr=t(W),Dr=t(W),jr=t(W),Ps=Float32Array.from(Rr,(pe,oe)=>pe+(Lr[oe]-pe)*(1/(1+Math.exp(-(Dr[oe]+jr[oe]))))),Xt=this.buf(Rr,M);this.dispatch("rwkv_vresid",[Xt,this.buf(Lr,M),this.buf(Dr,M),this.buf(jr,M)],this.grid1D(W));let Kr=F(await this.readBack(Xt,W*4),Ps);Xt.destroy?.();let Er=t(W),Hr=t(W),zr=t(W),xs=Float32Array.from(Er,(pe,oe)=>pe+(Hr[oe]-pe)*zr[oe]),Jt=I(W);this.dispatch("rwkv_lerp",[this.buf(Er,M),this.buf(Hr,M),this.buf(zr,M),Jt],this.grid1D(W));let Nr=F(await this.readBack(Jt,W*4),xs);Jt.destroy?.();let Qr=t(W),Us=Float32Array.from(Qr,pe=>{let oe=Math.max(pe,0);return oe*oe}),Zt=I(W);this.dispatch("sqrelu",[this.buf(Qr,M),Zt],this.grid1D(W));let Wr=F(await this.readBack(Zt,W*4),Us);Zt.destroy?.(),!Be||!it||!Cr||!Kr||!Nr||!Wr?(this.rwkvResidentOk=!1,console.error(`[selfValidate] glu RWKV r\xE9sidente KO sur ce GPU (kprep:${Be} gn:${it} decay:${Cr} vresid:${Kr} lerp:${Nr} sqrelu:${Wr}). Repli forwardToken JS+readback (correct, lent).`)):console.log("[selfValidate] glu RWKV r\xE9sidente OK (kprep, out_gn, decay, vresid, lerp, sqrelu)")}catch(z){this.rwkvResidentOk=!1,console.error("[selfValidate] glu RWKV r\xE9sidente : erreur d\u2019ex\xE9cution. Repli forwardToken JS+readback.",z)}}}if(this.lfm2ShortConvOk){let x=q=>Float32Array.from({length:q},()=>Math.random()*2-1),_=(q,T)=>q.length===T.length&&q.every((j,F)=>Math.abs(j-T[F])<=.001*(1+Math.abs(T[F]))),k=x(96),b=x(64),A=x(96),P=new Float32Array(32),B=b.slice();for(let q=0;q<32;q++){let T=k[q]*k[64+q],j=A[q*3+2]*T;for(let F=0;F<2;F++)j+=A[q*3+F]*b[F*32+q];for(let F=0;F+2<3;F++)B[F*32+q]=b[(F+1)*32+q];B[32+q]=T,P[q]=j*k[32+q]}let U=await this.lfm2ShortConv(k,b.slice(),A,32,3);!_(U.out,P)||!_(U.state,B)?(this.lfm2ShortConvOk=!1,console.error("[selfValidate] LFM2 shortconv KO sur ce GPU : une archi lfm2 refuserait de charger (non bloquant pour le reste).")):console.log("[selfValidate] LFM2 shortconv OK (conv courte gat\xE9e, moteur v2)")}if(this.qwen35SsmOk){let x=(k,b,A=.001)=>k.length===b.length&&k.every((P,B)=>Math.abs(P-b[B])<=A*(1+Math.abs(b[B]))),_=k=>{let b=this.storage(k.byteLength);return this.device.queue.writeBuffer(b,0,k),b},y=async(k,b)=>this.readBack(k,b*4),h=null;try{{let b=[3,2],A=t(8192*4),P=new Float32Array(3*8192),B=new Float32Array(3*8192),U=_(P),q=_(A);for(let T of b){let j=t(T*8192),F=new Float32Array(T*8192);for(let $=0;$<8192;$++){let C=B[$],M=B[8192+$],D=B[2*8192+$];for(let E=0;E<T;E++){let W=j[E*8192+$],Y=C*A[$*4]+M*A[$*4+1]+D*A[$*4+2]+W*A[$*4+3];F[E*8192+$]=Y/(1+Math.exp(-Y)),C=M,M=D,D=W}B[$]=C,B[8192+$]=M,B[2*8192+$]=D}let R=_(j),H=[],Q=this.device.createCommandEncoder(),N=this.recQwen35Conv(Q,H,R,q,U,T,8192);this.device.queue.submit([Q.finish()]);let V=await y(N,T*8192);if(this.release([...H,R]),!x(V,F)){h=`conv(T=${T})`;break}}!h&&!x(await y(U,3*8192),B)&&(h="conv.\xE9tat"),this.release([U,q])}if(!h){let T=t(32),j=Float32Array.from({length:32},()=>-.05-Math.random()*.3),F=new Float32Array(4096*128),R=_(new Float32Array(4096*128)),H=_(T),Q=_(j);for(let N of[3,1]){let V=t(N*8192),$=t(N*32),C=t(N*32),M=new Float32Array(N*32*128);for(let te=0;te<N;te++)for(let J=0;J<32;J++){let re=J%16,ie=te*8192,ue=V.subarray(ie+2048+re*128,ie+2048+re*128+128),Z=V.subarray(ie+re*128,ie+re*128+128),Se=V.subarray(ie+4096+J*128,ie+4096+J*128+128),ee=0,Be=0;for(let fe=0;fe<128;fe++)ee+=ue[fe]*ue[fe],Be+=Z[fe]*Z[fe];let he=1/Math.sqrt(ee+1e-6),kt=1/Math.sqrt(Be+1e-6)/Math.sqrt(128),Xe=$[te*32+J]+T[J],At=Math.exp((Xe>20?Xe:Math.log(1+Math.exp(Xe)))*j[J]),_t=1/(1+Math.exp(-C[te*32+J])),Qe=J*128*128;for(let fe=0;fe<16384;fe++)F[Qe+fe]*=At;for(let fe=0;fe<128;fe++){let Je=0;for(let ye=0;ye<128;ye++)Je+=F[Qe+ye*128+fe]*ue[ye]*he;let st=(Se[fe]-Je)*_t,it=0;for(let ye=0;ye<128;ye++)F[Qe+ye*128+fe]+=ue[ye]*he*st,it+=F[Qe+ye*128+fe]*Z[ye]*kt;M[(te*32+J)*128+fe]=it}}let D=_(V),E=_($),W=_(C),Y=[],I=this.device.createCommandEncoder(),z=this.recQwen35Gdn(I,Y,D,E,W,H,Q,R,N,32,16,128,8192,2048,4096,1e-6);this.device.queue.submit([I.finish()]);let X=await y(z,N*32*128);if(this.release([...Y,D,E,W]),!x(X,M,.002)){h=`gdn(T=${N})`;break}}!h&&!x(await y(R,4096*128),F,.002)&&(h="gdn.\xE9tat"),this.release([R,H,Q])}if(!h){let q=t(3072),T=Float32Array.from(q);for(let N=0;N<12;N++){let V=17+Math.floor(N/4);for(let $=0;$<64/2;$++){let C=V/Math.pow(1e7,2*$/64),M=Math.cos(C),D=Math.sin(C),E=q[N*256+$],W=q[N*256+$+64/2];T[N*256+$]=E*M-W*D,T[N*256+$+64/2]=W*M+E*D}}let j=_(q),F=[],R=this.device.createCommandEncoder(),H=this.recRopePartial(R,F,j,12,256,4,17,1e7,64);this.device.queue.submit([R.finish()]);let Q=await y(H,12*256);this.release([...F,j]),x(Q,T)||(h="rope_partial")}}catch(k){h=String(k)}h?(this.qwen35SsmOk=!1,console.error(`[selfValidate] Qwen 3.5 (lot) KO (${h}) : un mod\xE8le qwen35 refuserait de charger (non bloquant pour le reste).`)):console.log("[selfValidate] Qwen 3.5 OK (conv k=4 par lot, Gated DeltaNet par lot, RoPE partiel)")}if(this.qwen35SsmOk){let k=new Float32Array(128).fill(.05),b=new Float32Array(128).fill(.02),A=new Float32Array(128).fill(.1),P=new Float32Array([-.05,-.02]),B=new Float32Array([.8,.9]),U=new Float32Array(8192),q=new Float32Array(192),T=new Float32Array(64).fill(.3),j=new Float32Array(256).fill(.25);try{let F=await this.qwen35Conv1d(T,q.slice(),j,64,4),R=await this.qwen35DeltaNetStep(k,b,A,P,B,U.slice(),64,64,2);!F.out||F.out.length!==64||!R.out||R.out.length!==128?(this.qwen35SsmOk=!1,console.error("[selfValidate] Qwen 3.5 SSM KO : dimension invalide")):console.log("[selfValidate] Qwen 3.5 SSM OK (conv causale 1D + Gated DeltaNet, moteur v2)")}catch(F){this.qwen35SsmOk=!1,console.error("[selfValidate] Qwen 3.5 SSM KO :",F)}}if(this.gemma4Ok){let x=(y,h)=>y.length===h.length&&y.every((k,b)=>Math.abs(k-h[b])<=.001*(1+Math.abs(h[b]))),_=async()=>{let y=globalThis,h=async(A,P)=>{let B=[],U=this.device.createCommandEncoder(),q=P(U,B),T=this.device.createBuffer({size:A*4,usage:y.GPUBufferUsage.COPY_DST|y.GPUBufferUsage.MAP_READ});U.copyBufferToBuffer(q,0,T,0,A*4),this.device.queue.submit([U.finish()]),await T.mapAsync(y.GPUMapMode.READ);let j=new Float32Array(T.getMappedRange().slice(0));return T.unmap(),T.destroy(),this.release(B),j},k=A=>{let P=this.storage(A.byteLength);return this.device.queue.writeBuffer(P,0,A),P};{let P=t(5120),B=.4453125,U=k(P),q=await h(5120,(T,j)=>this.recScale(T,j,U,B,5120));if(this.release([U]),!x(q,P.map(T=>T*B)))return"scale"}{let B=t(12288),U=new Float32Array(512).fill(1),q=k(B),T=k(U),j=await h(24*512,(R,H)=>this.recRmsnorm(R,H,q,T,24,512,1e-6));this.release([q,T]);let F=new Float32Array(24*512);for(let R=0;R<24;R++){let H=0;for(let N=0;N<512;N++)H+=B[R*512+N]**2;let Q=1/Math.sqrt(H/512+1e-6);for(let N=0;N<512;N++)F[R*512+N]=B[R*512+N]*Q}if(!x(j,F))return"rmsnorm(hd=512, poids 1)"}let b=this.attnWideOk;this.attnWideOk=!1;try{for(let A of[{hd:256,win:4,nT:3,past:5},{hd:512,win:0,nT:2,past:4},{hd:512,win:0,nT:1,past:9}]){let U=A.past+A.nT,q=t(A.nT*8*A.hd),T=t(U*2*A.hd),j=t(U*2*A.hd),F=k(q),R=k(T),H=k(j),Q=await h(A.nT*8*A.hd,(N,V)=>this.recAttention(N,V,F,R,H,A.nT,8,2,A.hd,U,A.past,1,0,A.win));if(this.release([F,R,H]),!x(Q,xe(q,T,j,A.nT,8,2,A.hd,A.past,1,0,A.win)))return`attention(hd=${A.hd}, fen\xEAtre=${A.win}, nT=${A.nT})`}}finally{this.attnWideOk=b}return null};try{let y=await _();y?(this.gemma4Ok=!1,console.error(`[selfValidate] Gemma 4 KO (${y}) : un mod\xE8le gemma4 refuserait de charger (non bloquant pour le reste).`)):console.log("[selfValidate] Gemma 4 OK (scale, rmsnorm hd 512, attention hd 256/512 fen\xEAtr\xE9e)")}catch(y){this.gemma4Ok=!1,console.error("[selfValidate] Gemma 4 KO :",y)}}if(this.attnWideOk){let x=(k,b)=>k.length===b.length&&k.every((A,P)=>Math.abs(A-b[P])<=.001*(1+Math.abs(b[P]))),_=globalThis,y=k=>{let b=this.storage(k.byteLength);return this.device.queue.writeBuffer(b,0,k),b},h=null;try{for(let k of[{hd:256,nH:8,nKv:2,win:512,nT:1,past:700,sc:1,cap:0},{hd:512,nH:8,nKv:2,win:0,nT:1,past:130,sc:1,cap:0},{hd:512,nH:8,nKv:2,win:0,nT:5,past:70,sc:1,cap:0},{hd:256,nH:8,nKv:2,win:40,nT:7,past:90,sc:1,cap:0},{hd:256,nH:16,nKv:4,win:0,nT:3,past:66,sc:1/16,cap:0},{hd:256,nH:4,nKv:1,win:0,nT:2,past:10,sc:1/16,cap:5}]){let b=k.past+k.nT,A=t(k.nT*k.nH*k.hd),P=t(b*k.nKv*k.hd),B=t(b*k.nKv*k.hd),U=y(A),q=y(P),T=y(B),j=[],F=this.device.createCommandEncoder(),R=this.recAttention(F,j,U,q,T,k.nT,k.nH,k.nKv,k.hd,b,k.past,k.sc,k.cap,k.win),H=k.nT*k.nH*k.hd,Q=this.device.createBuffer({size:H*4,usage:_.GPUBufferUsage.COPY_DST|_.GPUBufferUsage.MAP_READ});F.copyBufferToBuffer(R,0,Q,0,H*4),this.device.queue.submit([F.finish()]),await Q.mapAsync(_.GPUMapMode.READ);let N=new Float32Array(Q.getMappedRange().slice(0));if(Q.unmap(),Q.destroy(),this.release([...j,U,q,T]),!x(N,xe(A,P,B,k.nT,k.nH,k.nKv,k.hd,k.past,k.sc,k.cap,k.win))){h=`hd=${k.hd} nT=${k.nT} past=${k.past} fen\xEAtre=${k.win}`;break}}}catch(k){h=String(k)}h?(this.attnWideOk=!1,console.error(`[selfValidate] attention large KO (${h}) : repli sur le kernel un-thread-par-t\xEAte.`)):console.log("[selfValidate] attention large OK (t\xEAtes 256/512, fen\xEAtre, GQA, softcap, d\xE9codage + prefill)")}if(this.kqOk){let x=globalThis,_=(k,b,A)=>{let P=k==="Q4_K"?144:210,B=b*A/256,U=new Uint8Array(B*P);for(let q=0;q<U.length;q++)U[q]=Math.random()*256|0;for(let q=0;q<B;q++){let T=new DataView(U.buffer,q*P);k==="Q4_K"?(T.setUint16(0,Pe(.01+Math.random()*.02),!0),T.setUint16(2,Pe(.005+Math.random()*.01),!0)):T.setUint16(208,Pe(.002+Math.random()*.004),!0)}return U},y=(k,b,A)=>{let P=0;for(let B of b)P=Math.max(P,Math.abs(B));return k.length===b.length&&k.every((B,U)=>Math.abs(B-b[U])<=A*(P+1))},h=null;try{for(let[k,b,A,P]of[["Q4_K",1,2560,37],["Q4_K",1,10240,5],["Q6_K",1,2560,37],["Q6_K",1,10240,5],["Q4_K",3,2560,9],["Q6_K",70,512,20]]){let B=_(k,P,A),U=k==="Q4_K"?dn(B,P*A/256):et(B,P*A/256),q=t(b*A),T=new Float32Array(b*P);for(let $=0;$<b;$++)for(let C=0;C<P;C++){let M=0;for(let D=0;D<A;D++)M+=q[$*A+D]*U[C*A+D];T[$*P+C]=M}let j=this.uploadKq(k,B),F=this.storage(q.byteLength);this.device.queue.writeBuffer(F,0,q);let R=[],H=this.device.createCommandEncoder(),Q=this.recMM(H,R,F,j,b,A,P,!1),N=this.device.createBuffer({size:b*P*4,usage:x.GPUBufferUsage.COPY_DST|x.GPUBufferUsage.MAP_READ});H.copyBufferToBuffer(Q,0,N,0,b*P*4),this.device.queue.submit([H.finish()]),await N.mapAsync(x.GPUMapMode.READ);let V=new Float32Array(N.getMappedRange().slice(0));if(N.unmap(),N.destroy(),j.buf.destroy(),this.release([...R,F]),!y(V,T,b===1?.002:.02)){h=`${k} m=${b} k=${A} n=${P}`;break}}}catch(k){h=String(k)}h?(this.kqOk=!1,console.error(`[selfValidate] poids K-quant natifs KO (${h}) : requantification int8.`)):console.log("[selfValidate] poids K-quant natifs OK (GEMV Q4_K/Q6_K, prefill via int8)")}let L=await this.validateDiffusion();L?console.warn("[selfValidate] image-gen primitive KO:",L,"(non bloquant: chemin texte intact)"):console.log(`[selfValidate] image-gen primitives OK (silu, group_norm, conv2d, conv2d_direct, conv2d_direct_q8/q4, conv 3\xD73 tuil\xE9 q8/q4 ${this.convTiledQOk?"OK":"KO (repli direct)"}, relu, upsample_nearest, layernorm, quick_gelu, attention_full)`);let K=await this.validateVideoResident();return K?(this.videoResidentOk=!1,console.warn("[selfValidate] motion r\xE9sident KO:",K,", repli JS+readback (plus lent, m\xEAme r\xE9sultat).")):console.log("[selfValidate] motion r\xE9sident OK (video_motion_gather, video_motion_scatter, video_add_pe, attn_temporal)"),!0}async validateVideoResident(){let e=o=>Float32Array.from({length:o},()=>Math.random()*2-1),r=(o,u,c=.005)=>o.length===u.length&&o.every((l,d)=>Math.abs(l-u[d])<=c*(1+Math.abs(u[d])));{let o=e(120),u=new Float32Array(120);for(let d=0;d<5;d++)for(let p=0;p<3;p++)for(let g=0;g<8;g++)u[(d*3+p)*8+g]=o[(p*8+g)*5+d];let c=this.recordingSession(),l=await c.finish(c.videoGather(o,3,8,5),120);if(!r(l,u,1e-6))return"video_motion_gather"}{let o=e(120),u=e(120),c=new Float32Array(120);for(let p=0;p<3;p++)for(let g=0;g<8;g++)for(let m=0;m<5;m++)c[(p*8+g)*5+m]=o[(m*3+p)*8+g]+u[(p*8+g)*5+m];let l=this.recordingSession(),d=await l.finish(l.videoScatter(o,u,3,8,5),120);if(!r(d,c,1e-6))return"video_motion_scatter"}{let o=e(120),u=e(24),c=new Float32Array(120);for(let p=0;p<5;p++)for(let g=0;g<3;g++)for(let m=0;m<8;m++)c[(p*3+g)*8+m]=o[(p*3+g)*8+m]+u[g*8+m];let l=this.recordingSession(),d=await l.finish(l.videoAddPe(o,u,3,8,5),120);if(!r(d,c,1e-6))return"video_add_pe"}{let o=e(120),u=e(120),c=e(120),l=1/Math.sqrt(4),d=new Float32Array(120);for(let m=0;m<5;m++)for(let w=0;w<2;w++){let v=w*4,G=m*3;for(let S=0;S<3;S++){let O=(G+S)*8+v,L=new Float32Array(3),K=-1e30;for(let _=0;_<3;_++){let y=0,h=(G+_)*8+v;for(let k=0;k<4;k++)y+=o[O+k]*u[h+k];L[_]=y*l,L[_]>K&&(K=L[_])}let x=0;for(let _=0;_<3;_++)L[_]=Math.exp(L[_]-K),x+=L[_];for(let _=0;_<3;_++){let y=L[_]/x,h=(G+_)*8+v;for(let k=0;k<4;k++)d[O+k]+=y*c[h+k]}}}let p=this.recordingSession(),g=await p.finish(p.attnTemporal(o,u,c,5,3,2,4),120);if(!r(g,d))return"attn_temporal"}return null}async validateDiffusion(){let e=M=>Float32Array.from({length:M},()=>Math.random()*2-1),r=(M,D,E=.005)=>M.length===D.length&&M.every((W,Y)=>Math.abs(W-D[Y])<=E*(1+Math.abs(D[Y]))),t=e(70),n=t.map(M=>M/(1+Math.exp(-M)));if(!r(await this.silu(t),n))return"silu";let s=4,i=5,a=2,o=1e-5,u=e(s*i),c=e(s),l=e(s),d=new Float32Array(s*i),p=s/a;for(let M=0;M<a;M++){let D=M*p*i,E=p*i,W=0;for(let z=0;z<E;z++)W+=u[D+z];W/=E;let Y=0;for(let z=0;z<E;z++){let X=u[D+z]-W;Y+=X*X}Y/=E;let I=1/Math.sqrt(Y+o);for(let z=0;z<E;z++){let X=M*p+Math.floor(z/i);d[D+z]=(u[D+z]-W)*I*c[X]+l[X]}}if(!r(await this.groupNorm(u,c,l,s,i,a,o),d))return"group_norm";let g=2,m=4,w=4,v=3,G=3,S=1,O=1,L=4,K=4,x=e(g*m*w),_=e(v*g*G*G),y=e(v),h=new Float32Array(v*L*K);for(let M=0;M<v;M++)for(let D=0;D<L;D++)for(let E=0;E<K;E++){let W=y[M];for(let Y=0;Y<g;Y++)for(let I=0;I<G;I++)for(let z=0;z<G;z++){let X=D*S+I-O,te=E*S+z-O;X>=0&&X<m&&te>=0&&te<w&&(W+=x[Y*m*w+X*w+te]*_[((M*g+Y)*G+I)*G+z])}h[(M*L+D)*K+E]=W}if(!r(await this.conv2d(x,_,y,g,m,w,v,G,G,S,O),h))return"conv2d";if(!r(await this.conv2dDirect(x,_,y,g,m,w,v,G,G,S,O),h))return"conv2d_direct";{let Y=e(1200),I=e(108),z=e(4),X=await this.conv2dDirect(Y,I,z,3,20,20,4,3,3,1,1),te=this.convTiledOk;this.convTiledOk=!0;let J=this.recordingSession(),re=await J.finish(J.conv2d(Y,I,z,3,20,20,4,3,3,1,1),1600);this.convTiledOk=te,r(re,X)||(this.convTiledOk=!1,console.warn("[selfValidate] conv2d_3x3_tiled KO sur ce GPU : repli sur conv2d_direct (plus lent, m\xEAme r\xE9sultat)."))}{let E=e(8*m*w),W=e(32*G*G),Y=e(4),I=Te(W),z=await this.conv2dDirect(E,ve(I),Y,8,m,w,4,G,G,S,O),X={codes:this.uploadGpuRaw(new Uint8Array(I.codes.buffer,I.codes.byteOffset,I.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(I.scales.buffer,I.scales.byteOffset,I.scales.byteLength))},te=this.convTiledQOk;this.convTiledQOk=!1;let J=this.recordingSession(),re=await J.finish(J.conv2d(E,X,Y,8,m,w,4,G,G,S,O),4*m*w);if(this.convTiledQOk=te,this.releaseGpu([X.codes,X.sc]),!r(re,z))return"conv2d_direct_q8"}{let E=e(8*m*w),W=e(32*G*G),Y=e(4),I=Oe(W),z=await this.conv2dDirect(E,me(I),Y,8,m,w,4,G,G,S,O),X={nib:this.uploadGpuRaw(I.nibbles),sc:this.uploadGpuRaw(new Uint8Array(I.scales.buffer,I.scales.byteOffset,I.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(I.mins.buffer,I.mins.byteOffset,I.mins.byteLength))},te=this.convTiledQOk;this.convTiledQOk=!1;let J=this.recordingSession(),re=await J.finish(J.conv2d(E,X,Y,8,m,w,4,G,G,S,O),4*m*w);if(this.convTiledQOk=te,this.releaseGpu([X.nib,X.sc,X.mn]),!r(re,z))return"conv2d_direct_q4"}{let Y=e(16e3),I=e(480),z=e(12),X=this.convTiledQOk;for(let te of["q8","q4"]){let J=te==="q8"?(()=>{let Z=Te(I);return{deq:ve(Z),gpu:{codes:this.uploadGpuRaw(new Uint8Array(Z.codes.buffer,Z.codes.byteOffset,Z.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(Z.scales.buffer,Z.scales.byteOffset,Z.scales.byteLength))}}})():(()=>{let Z=Oe(I);return{deq:me(Z),gpu:{nib:this.uploadGpuRaw(Z.nibbles),sc:this.uploadGpuRaw(new Uint8Array(Z.scales.buffer,Z.scales.byteOffset,Z.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(Z.mins.buffer,Z.mins.byteOffset,Z.mins.byteLength))}}})(),re=await this.conv2dDirect(Y,J.deq,z,40,20,20,12,1,1,1,0);this.convTiledQOk=!0;let ie=this.recordingSession(),ue=await ie.finish(ie.conv2d(Y,J.gpu,z,40,20,20,12,1,1,1,0),4800);if(this.releaseGpu(Object.values(J.gpu)),!r(ue,re)){X&&console.warn(`[selfValidate] conv2d_1x1_${te} KO sur ce GPU : repli sur conv2d_direct_${te}.`),this.convTiledQOk=!1;break}}this.convTiledQOk=this.convTiledQOk&&X}{let Y=e(3200),I=e(288),z=e(4),X=this.convTiledQOk;for(let te of["q8","q4"]){let J=te==="q8"?(()=>{let Z=Te(I);return{deq:ve(Z),gpu:{codes:this.uploadGpuRaw(new Uint8Array(Z.codes.buffer,Z.codes.byteOffset,Z.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(Z.scales.buffer,Z.scales.byteOffset,Z.scales.byteLength))}}})():(()=>{let Z=Oe(I);return{deq:me(Z),gpu:{nib:this.uploadGpuRaw(Z.nibbles),sc:this.uploadGpuRaw(new Uint8Array(Z.scales.buffer,Z.scales.byteOffset,Z.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(Z.mins.buffer,Z.mins.byteOffset,Z.mins.byteLength))}}})(),re=await this.conv2dDirect(Y,J.deq,z,8,20,20,4,3,3,1,1);this.convTiledQOk=!0;let ie=this.recordingSession(),ue=await ie.finish(ie.conv2d(Y,J.gpu,z,8,20,20,4,3,3,1,1),1600);if(this.releaseGpu(Object.values(J.gpu)),!r(ue,re)){X&&console.warn(`[selfValidate] conv2d_3x3_tiled_${te} KO sur ce GPU : repli sur conv2d_direct_${te} (plus lent, m\xEAme r\xE9sultat).`),this.convTiledQOk=!1;break}}this.convTiledQOk=this.convTiledQOk&&X}{let Y=e(3200),I=e(288),z=e(4),X=this.convS2Ok,te=Math.floor(19/2)+1,J=Math.floor(19/2)+1;for(let re of["q8","q4"]){let ie=re==="q8"?(()=>{let ee=Te(I);return{deq:ve(ee),gpu:{codes:this.uploadGpuRaw(new Uint8Array(ee.codes.buffer,ee.codes.byteOffset,ee.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(ee.scales.buffer,ee.scales.byteOffset,ee.scales.byteLength))}}})():(()=>{let ee=Oe(I);return{deq:me(ee),gpu:{nib:this.uploadGpuRaw(ee.nibbles),sc:this.uploadGpuRaw(new Uint8Array(ee.scales.buffer,ee.scales.byteOffset,ee.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(ee.mins.buffer,ee.mins.byteOffset,ee.mins.byteLength))}}})(),ue=await this.conv2dDirect(Y,ie.deq,z,8,20,20,4,3,3,2,1);this.convS2Ok=!0;let Z=this.recordingSession(),Se=await Z.finish(Z.conv2d(Y,ie.gpu,z,8,20,20,4,3,3,2,1),4*te*J);if(this.releaseGpu(Object.values(ie.gpu)),!r(Se,ue)){X&&console.warn(`[selfValidate] conv2d_3x3_s2_tiled_${re} KO sur ce GPU : repli sur direct.`),this.convS2Ok=!1;break}}this.convS2Ok=this.convS2Ok&&X}if(this.hasSubgroups&&this.subgroupsOk)try{let E=e(1500),W=e(300),Y=r(await this.rmsnormVec(E,W,5,300,1e-5,!1,"rmsnorm_vec_subgroup"),await this.rmsnormVec(E,W,5,300,1e-5,!1)),I=8,z=130,X=4,te=e(I*z),J=e(I),re=e(I),ie=r(await this.groupNorm(te,J,re,I,z,X,1e-5,"group_norm_subgroup"),await this.groupNorm(te,J,re,I,z,X));if(!Y||!ie){let ue=[!Y&&"rmsnorm_vec_subgroup",!ie&&"group_norm_subgroup"].filter(Boolean).join(" + ");console.warn(`[selfValidate] ${ue} KO sur ce GPU : repli sur la r\xE9duction en m\xE9moire partag\xE9e.`),this.subgroupsOk=!1}}catch(M){console.warn("[selfValidate] subgroups indisponibles \xE0 l'ex\xE9cution : repli sur la m\xE9moire partag\xE9e.",M),this.subgroupsOk=!1}{let D=e(66),E=new Uint16Array(66);for(let z=0;z<66;z++)E[z]=Pe(D[z]);let W=new Float32Array(66);for(let z=0;z<66;z++)W[z]=ke(E[z]);let Y=this.f16ToF32Gpu(new Uint8Array(E.buffer,E.byteOffset,E.byteLength),66),I=await this.readGpu(Y,66);if(Y.destroy?.(),!r(I,W,1e-6))return"f16_to_f32"}let k=e(70);if(!r(await this.relu(k),k.map(M=>Math.max(M,0))))return"relu";let b=2,A=2,P=2,B=2,U=A*B,q=P*B,T=e(b*A*P),j=new Float32Array(b*U*q);for(let M=0;M<b;M++)for(let D=0;D<U;D++)for(let E=0;E<q;E++)j[M*U*q+D*q+E]=T[M*A*P+Math.floor(D/B)*P+Math.floor(E/B)];if(!r(await this.upsampleNearest(T,b,A,P,B),j))return"upsample_nearest";let F=2,R=8,H=1e-5,Q=e(F*R),N=e(R),V=e(R),$=new Float32Array(F*R);for(let M=0;M<F;M++){let D=M*R,E=0;for(let I=0;I<R;I++)E+=Q[D+I];E/=R;let W=0;for(let I=0;I<R;I++){let z=Q[D+I]-E;W+=z*z}W/=R;let Y=1/Math.sqrt(W+H);for(let I=0;I<R;I++)$[D+I]=(Q[D+I]-E)*Y*N[I]+V[I]}if(!r(await this.layernorm(Q,N,V,F,R,H),$))return"layernorm";let C=e(70);if(!r(await this.quickGelu(C),C.map(M=>M/(1+Math.exp(-1.702*M)))))return"quick_gelu";{let I=1/Math.sqrt(4),z=e(24),X=e(40),te=e(40),J=new Float32Array(24);for(let re=0;re<2;re++)for(let ie=0;ie<3;ie++){let ue=new Float32Array(5),Z=-1/0;for(let ee=0;ee<5;ee++){let Be=0;for(let he=0;he<4;he++)Be+=z[ie*8+re*4+he]*X[ee*8+re*4+he];ue[ee]=Be*I,ue[ee]>Z&&(Z=ue[ee])}let Se=0;for(let ee=0;ee<5;ee++)ue[ee]=Math.exp(ue[ee]-Z),Se+=ue[ee];for(let ee=0;ee<4;ee++){let Be=0;for(let he=0;he<5;he++)Be+=ue[he]/Se*te[he*8+re*4+ee];J[ie*8+re*4+ee]=Be}}if(!r(await this.attentionFull(z,X,te,3,2,2,4,5),J))return"attention_full"}if(this.attnFullWgOk){let M=[{nT:70,kvL:70,nH:5,hd:64},{nT:16,kvL:77,nH:5,hd:64},{nT:9,kvL:9,nH:8,hd:160}];for(let D of M){let E=D.nH*D.hd,W=e(D.nT*E),Y=e(D.kvL*E),I=e(D.kvL*E),z=await this.attentionFull(W,Y,I,D.nT,D.nH,D.nH,D.hd,D.kvL),X=await this.attentionFullWg(W,Y,I,D.nT,D.nH,D.nH,D.hd,D.kvL);if(!r(X,z)){this.attnFullWgOk=!1,console.warn(`[selfValidate] attention_full_wg KO sur ce GPU (hd=${D.hd}, kv=${D.kvL}) : repli sur attention_full (plus lent, m\xEAme r\xE9sultat).`);break}}}return null}};ne.timingOn=(()=>{try{return se("timing")==="1"}catch{return!1}})(),ne.profileOn=(()=>{try{return se("gpuprofile")==="1"}catch{return!1}})(),ne.MAX_WG_DIM=65535,ne.BLOCK_ELEMS={Q4_K:256,Q5_K:256,Q6_K:256,Q8_0:32,Q5_0:32,Q4_0:32,Q3_K:256,Q4_1:32,F32:1,F16:1},ne.DEQUANT_SHADER={Q4_K:"dequant_q4k",Q8_0:"dequant_q8_0",Q5_0:"dequant_q5_0",Q6_K:"dequant_q6k",Q4_0:"dequant_q4_0",Q5_K:"dequant_q5k",Q3_K:"dequant_q3k",Q4_1:"dequant_q4_1"},ne.STORAGE_USAGE=140;Mt=ne});function gn(f,e){let r=new DataView(f.buffer,f.byteOffset,f.byteLength),t=new Float32Array(e);for(let n=0;n<e;n++)t[n]=ge(r.getUint16(n*2,!0));return t}function mn(f,e){let r=new DataView(f.buffer,f.byteOffset,f.byteLength),t=new Float32Array(e);for(let n=0;n<e;n++)t[n]=r.getFloat32(n*4,!0);return t}function dt(f,e,r,t){let n=0;for(let a=0;a<r;a++)n+=f[a]*f[a];let s=1/Math.sqrt(n/r+t),i=new Float32Array(r);for(let a=0;a<r;a++)i[a]=f[a]*s*e[a];return i}var Is,Ie,Ct,hn=ae(()=>{"use strict";ot();ct();ut();Ze();Is=f=>f/(1+Math.exp(-f)),Ie=class Ie{constructor(e,r,t){this.engine=e;this.manifest=r;this.raw=t;this.w=new Map;this.g=new Map;this.pos=0;this.rLayers=[];this.tokNormGpu=null;this.normBufs=[];this.ffn=0;this.residentLock=Promise.resolve()}isBigProj(e){return/\.(shortconv\.(in_proj|out_proj)|attn_(q|k|v|output)|ffn_(gate|up|down))\.weight$/.test(e)}async load(e){if(!this.engine.lfm2ShortConvOk)throw new Error("kernel shortconv LFM2 invalid\xE9 sur ce GPU (selfValidate) : archi lfm2 refus\xE9e.");let r=this.manifest.arch;if(this.D=r.d,this.NH=r.nHeads,this.NKV=r.nKvHeads,this.HD=r.headDim,this.NL=r.blockCount,this.vocab=r.vocab,this.EPS=r.rmsEps,this.THETA=r.ropeTheta,!r.lfm2)throw new Error("manifest sans profil lfm2");this.LC=r.lfm2.lCache,this.convLayer=r.lfm2.kvHeadsPerLayer.map(t=>t===0),this.tok=e,this.stops=new Set(this.manifest.chat?.stopTokenIds?.length?this.manifest.chat.stopTokenIds:[7]);for(let[t,n]of Object.entries(this.manifest.tensors)){if(t==="token_embd.weight"){if(this.embedBytes=await this.raw(t),this.embedDtype=n.dtype,n.dtype==="q4"){let i=we(this.embedBytes,n.nElems);this.g.set("head",{kind:"q4",nib:this.engine.uploadGpuRaw(i.nibbles),sc:this.up(i.scales),mn:this.up(i.mins),IN:this.D,OUT:this.vocab})}else if(n.dtype==="q8"){let i=_e(this.embedBytes,n.nElems);this.g.set("head",{kind:"q8",codes:this.upI8(i.codes),sc:this.up(i.scales),IN:this.D,OUT:this.vocab})}else if(n.dtype==="q3")throw new Error("LFM2 : t\xEAte li\xE9e en q3 non support\xE9e (le convertisseur garde un plancher q4)");continue}let s=await this.raw(t);if(this.isBigProj(t)&&(n.dtype==="q3"||n.dtype==="q4"||n.dtype==="q8")){let i=n.shape[0],a=n.nElems/i;if(n.dtype==="q8"){let o=_e(s,n.nElems);this.g.set(t,{kind:"q8",codes:this.upI8(o.codes),sc:this.up(o.scales),IN:i,OUT:a})}else if(n.dtype==="q3"){let o=Ue(s,n.nElems);this.g.set(t,{kind:"q3",q3:!0,lo:this.up32(o.lo),hi:this.up32(o.hi),sc:this.up(o.scales),mn:this.up(o.mins),IN:i,OUT:a})}else{let o=we(s,n.nElems);this.g.set(t,{kind:"q4",nib:this.engine.uploadGpuRaw(o.nibbles),sc:this.up(o.scales),mn:this.up(o.mins),IN:i,OUT:a})}}else this.w.set(t,this.decodePetit(t,s,n))}this.buildResidentLayers(),this.reset()}buildResidentLayers(){let e=r=>{let t=this.engine.uploadGpu(this.w.get(r));return this.normBufs.push(t),t};this.tokNormGpu=e("token_embd_norm.weight"),this.ffn=this.g.get("blk.0.ffn_gate.weight")?.OUT??0,this.rLayers=[];for(let r=0;r<this.NL;r++){let t=`blk.${r}.`,n={attnNorm:e(t+"attn_norm.weight"),ffnNorm:e(t+"ffn_norm.weight"),wgate:this.g.get(t+"ffn_gate.weight"),wup:this.g.get(t+"ffn_up.weight"),wdown:this.g.get(t+"ffn_down.weight")};this.convLayer[r]?this.rLayers.push({conv:!0,...n,convW:e(t+"shortconv.conv.weight"),inProj:this.g.get(t+"shortconv.in_proj.weight"),outProj:this.g.get(t+"shortconv.out_proj.weight")}):this.rLayers.push({conv:!1,...n,qNorm:e(t+"attn_q_norm.weight"),kNorm:e(t+"attn_k_norm.weight"),wq:this.g.get(t+"attn_q.weight"),wk:this.g.get(t+"attn_k.weight"),wv:this.g.get(t+"attn_v.weight"),wo:this.g.get(t+"attn_output.weight")})}}residentAvailable(){return this.engine.lfm2ResidentOk!==!1&&!!this.g.get("head")&&this.rLayers.length===this.NL&&this.ffn>0}cfg(){return{D:this.D,nHeads:this.NH,nKvHeads:this.NKV,headDim:this.HD,ffn:this.ffn,eps:this.EPS,theta:this.THETA,lc:this.LC,vocab:this.vocab}}embedsFor(e){let r=this.D,t=new Float32Array(e.length*r);for(let n=0;n<e.length;n++)t.set(this.embedRow(e[n]),n*r);return t}async logitsGpu(e,r,t){return this.pos=r+e.length,this.engine.lfm2LogitsGpu(this.embedsFor(e),e.length,this.cfg(),this.rLayers,this.g.get("head"),this.tokNormGpu,r,t)}async topKGpu(e,r,t,n,s,i=40){return this.pos=r+e.length,this.engine.lfm2TopKGpu(this.embedsFor(e),e.length,this.cfg(),this.rLayers,this.g.get("head"),this.tokNormGpu,r,t,n,s,i)}async prefillGpu(e,r,t){this.pos=r+e.length,await this.engine.lfm2PrefillGpu(this.embedsFor(e),e.length,this.cfg(),this.rLayers,this.tokNormGpu,r,t)}decodePetit(e,r,t){switch(t.dtype){case"f32":return mn(r,t.nElems);case"f16":return gn(r,t.nElems);case"q8":return ve(_e(r,t.nElems));case"q4":return me(we(r,t.nElems));case"q3":return Ke(Ue(r,t.nElems));default:throw new Error(`LFM2 : dtype \xAB ${t.dtype} \xBB non support\xE9 pour ${e}`)}}up(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}up32(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}upI8(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}unload(){for(let e of this.g.values())for(let r of["nib","sc","mn","codes"])e[r]?.destroy?.();for(let e of this.normBufs)e?.destroy?.();this.normBufs=[],this.rLayers=[],this.tokNormGpu=null,this.engine.clearLfm2State?.(),this.g.clear(),this.w.clear()}reset(){this.pos=0,this.state=Array.from({length:this.NL},(e,r)=>this.convLayer[r]?{conv:new Float32Array((this.LC-1)*this.D)}:{K:[],V:[]})}async gemm(e,r){let t=this.g.get(e);if(!t){let n=this.w.get(e==="head"?"token_embd.weight":e),s=n.length/r.length,i=new Float32Array(s);for(let a=0;a<s;a++){let o=0,u=a*r.length;for(let c=0;c<r.length;c++)o+=n[u+c]*r[c];i[a]=o}return i}return t.kind==="q8"?this.engine.matmulQ8(r,t.codes,t.sc,1,t.IN,t.OUT):t.kind==="q3"?this.engine.matmulQ3(r,t.lo,t.hi,t.sc,t.mn,1,t.IN,t.OUT):this.engine.matmulQ4(r,t.nib,t.sc,t.mn,1,t.IN,t.OUT)}embedRow(e){let r=this.D;if(this.embedDtype==="f16")return gn(this.embedBytes.subarray(e*r*2,e*r*2+r*2),r);if(this.embedDtype==="f32")return mn(this.embedBytes.subarray(e*r*4,e*r*4+r*4),r);if(this.embedDtype==="q8"){let o=this.vocab*r,u=r/32,c=new Int8Array(this.embedBytes.buffer,this.embedBytes.byteOffset+e*r,r),l=this.embedBytes.subarray(o+e*u*2,o+e*u*2+u*2),d=new DataView(l.buffer,l.byteOffset,l.byteLength),p=new Float32Array(r);for(let g=0;g<u;g++){let m=ge(d.getUint16(g*2,!0));for(let w=0;w<32;w++)p[g*32+w]=c[g*32+w]*m}return p}let t=this.vocab*r,n=r/32,s=t/2,i=t/2+t/32*2,a=new Uint8Array(r/2+n*2*2);return a.set(this.embedBytes.subarray(e*r/2,e*r/2+r/2),0),a.set(this.embedBytes.subarray(s+e*n*2,s+e*n*2+n*2),r/2),a.set(this.embedBytes.subarray(i+e*n*2,i+e*n*2+n*2),r/2+n*2),me(we(a,r))}rope(e,r,t){let n=this.HD,s=e.slice();for(let i=0;i<r;i++){let a=i*n;for(let o=0;o<n/2;o++){let u=Math.pow(this.THETA,-2*o/n),c=Math.cos(t*u),l=Math.sin(t*u),d=e[a+o],p=e[a+o+n/2];s[a+o]=d*c-p*l,s[a+o+n/2]=d*l+p*c}}return s}async forwardToken(e){let r=this.D,t=this.pos++,n=this.embedRow(e);for(let s=0;s<this.NL;s++){let i=`blk.${s}.`,a=this.state[s],o=dt(n,this.w.get(i+"attn_norm.weight"),r,this.EPS),u;if(this.convLayer[s]){let g=await this.gemm(i+"shortconv.in_proj.weight",o),m=await this.engine.lfm2ShortConv(g,a.conv,this.w.get(i+"shortconv.conv.weight"),r,this.LC);a.conv=m.state,u=await this.gemm(i+"shortconv.out_proj.weight",m.out)}else{let g=await this.gemm(i+"attn_q.weight",o),m=await this.gemm(i+"attn_k.weight",o),w=await this.gemm(i+"attn_v.weight",o),v=this.w.get(i+"attn_q_norm.weight"),G=this.w.get(i+"attn_k_norm.weight");for(let x=0;x<this.NH;x++)g.set(dt(g.slice(x*this.HD,(x+1)*this.HD),v,this.HD,this.EPS),x*this.HD);for(let x=0;x<this.NKV;x++)m.set(dt(m.slice(x*this.HD,(x+1)*this.HD),G,this.HD,this.EPS),x*this.HD);g=this.rope(g,this.NH,t),m=this.rope(m,this.NKV,t),a.K.push(m),a.V.push(w);let S=new Float32Array(this.NH*this.HD),O=a.K.length,L=1/Math.sqrt(this.HD),K=this.NH/this.NKV;for(let x=0;x<this.NH;x++){let _=Math.floor(x/K),y=x*this.HD,h=_*this.HD,k=new Float32Array(O),b=-1e30;for(let P=0;P<O;P++){let B=0;for(let U=0;U<this.HD;U++)B+=g[y+U]*a.K[P][h+U];k[P]=B*L,k[P]>b&&(b=k[P])}let A=0;for(let P=0;P<O;P++)k[P]=Math.exp(k[P]-b),A+=k[P];for(let P=0;P<O;P++){let B=k[P]/A;for(let U=0;U<this.HD;U++)S[y+U]+=B*a.V[P][h+U]}}u=await this.gemm(i+"attn_output.weight",S)}for(let g=0;g<r;g++)n[g]+=u[g];let c=dt(n,this.w.get(i+"ffn_norm.weight"),r,this.EPS),l=await this.gemm(i+"ffn_gate.weight",c),d=await this.gemm(i+"ffn_up.weight",c);for(let g=0;g<l.length;g++)l[g]=Is(l[g])*d[g];let p=await this.gemm(i+"ffn_down.weight",l);for(let g=0;g<r;g++)n[g]+=p[g]}return n=dt(n,this.w.get("token_embd_norm.weight"),r,this.EPS),this.gemm("head",n)}async classify(e,r){let t=this.tok.encode(e),n;if(this.residentAvailable())n=await this.locked(()=>this.feedThen(t,0,"cls",(i,a)=>this.logitsGpu(i,a,"cls")));else{this.reset();for(let i of t)n=await this.forwardToken(i)}let s=r.map(i=>{let a=this.tok.encode(i);return{label:i,logit:n[a[1]??a[0]]}}).sort((i,a)=>a.logit-i.logit);return{label:s[0].label,scores:s}}banTools(e){for(let r of Ie.TOOL_BAN)r<e.length&&(e[r]=-1e30);return e}sampleTok(e,r,t){let{temperature:n=.8,topK:s=40,repeatPenalty:i=1.3}=t,a=new Set(r),o=[];for(let d=0;d<e.length;d++){let p=e[d];a.has(d)&&(p=p>0?p/i:p*i),o.push({i:d,v:p})}o.sort((d,p)=>p.v-d.v),o.length=s;let u=o[0].v,c=0;for(let d of o)d.p=Math.exp((d.v-u)/n),c+=d.p;let l=Math.random()*c;for(let d of o)if(l-=d.p,l<=0)return d.i;return o[0].i}async generate(e,r,t,n,s){this.reset();let i=this.tok.encode(e),a;for(let u of i)a=await this.forwardToken(u);let o=[];for(let u=0;u<r&&!n?.();u++){this.banTools(a);let c;if(s?.sample)c=this.sampleTok(a,o.slice(-64),s);else{c=0;for(let l=1;l<a.length;l++)a[l]>a[c]&&(c=l)}if(this.stops.has(c))break;o.push(c),t&&t(this.tok.decode(o)),a=await this.forwardToken(c)}return o.length?this.tok.decode(o):""}locked(e){let r=this.residentLock.then(e,e);return this.residentLock=r.catch(()=>{}),r}async feedThen(e,r,t,n,s){let i=0;for(;;){if(s?.())return null;let a=Math.min(i+Ie.PREFILL_CHUNK,e.length),o=e.slice(i,a);if(a<e.length)await this.prefillGpu(o,r+i,t);else return n(o,r+i);i=a}}pickFromTopK(e,r){let t=[],n=[];for(let d=0;d<e.ids.length;d++)if(!Ie.TOOL_BAN.includes(e.ids[d])){if(e.vals[d]<=-3e38)break;t.push(e.ids[d]),n.push(e.vals[d])}if(!t.length)return e.ids[0];if(!r?.sample)return t[0];let{temperature:s=.8,topK:i=40}=r,a=Math.min(i,t.length),o=n[0],u=0,c=new Array(a);for(let d=0;d<a;d++)c[d]=Math.exp((n[d]-o)/s),u+=c[d];let l=Math.random()*u;for(let d=0;d<a;d++)if(l-=c[d],l<=0)return t[d];return t[0]}async generateResident(e,r,t,n,s){return this.residentAvailable()?this.locked(async()=>{let a=s?.repeatPenalty??(s?.sample?1.3:1),o=this.tok.encode(e),u=await this.feedThen(o,0,"gen",(d,p)=>this.topKGpu(d,p,"gen",[],1,48),n);if(!u)return"";let c=o.length,l=[];for(let d=0;d<r&&!n?.();d++){let p=this.pickFromTopK(u,s);if(this.stops.has(p))break;l.push(p),t&&t(this.tok.decode(l)),u=await this.topKGpu([p],c,"gen",a!==1?[...new Set(l.slice(-64))]:[],a,48),c++}return l.length?this.tok.decode(l):""}):this.generate(e,r,t,n,s)}};Ie.TOOL_BAN=[8,10,12],Ie.PREFILL_CHUNK=128;Ct=Ie});function $s(f){let e=[];for(let r=0;r<f.length;r++){let t=f[r];if(t==="\\"&&r+1<f.length){let s=f[r+1];if(s==="x"){e.push(parseInt(f.substr(r+2,2),16)&255),r+=3;continue}if(s==="t"){e.push(9),r++;continue}if(s==="n"){e.push(10),r++;continue}if(s==="r"){e.push(13),r++;continue}if(s==="0"){e.push(0),r++;continue}if(s==="\\"){e.push(92),r++;continue}if(s==="'"){e.push(39),r++;continue}if(s==='"'){e.push(34),r++;continue}e.push(92);continue}let n=t.codePointAt(0);if(n<128)e.push(n);else for(let s of new TextEncoder().encode(t))e.push(s)}return new Uint8Array(e)}var Rt,bn=ae(()=>{"use strict";Rt=class{constructor(e,r=0){this.root={next:new Map};this.idToBytes=[];this.vocabSize=e.length,this.eosId=r;for(let t=0;t<e.length;t++){let n=$s(e[t]);if(this.idToBytes[t]=n,t===0||n.length===0)continue;let s=this.root;for(let i of n){let a=s.next.get(i);a||(a={next:new Map},s.next.set(i,a)),s=a}s.id=t}}encode(e){let r=new TextEncoder().encode(e),t=[],n=0;for(;n<r.length;){let s=this.root,i=-1,a=0,o=0;for(let u=n;u<r.length;u++){let c=s.next.get(r[u]);if(!c)break;s=c,o++,c.id!==void 0&&(i=c.id,a=o)}i<0&&(i=r[n]+1,a=1),t.push(i),n+=a}return t}decode(e){let r=[];for(let t of e){if(t===this.eosId)continue;let n=this.idToBytes[t];if(n)for(let s of n)r.push(s)}return new TextDecoder("utf-8",{fatal:!1}).decode(new Uint8Array(r))}}});function cr(f,e){let r=new DataView(f.buffer,f.byteOffset,f.byteLength),t=new Float32Array(e);for(let n=0;n<e;n++)t[n]=ge(r.getUint16(n*2,!0));return t}function lr(f,e){let r=new DataView(f.buffer,f.byteOffset,f.byteLength),t=new Float32Array(e);for(let n=0;n<e;n++)t[n]=r.getFloat32(n*4,!0);return t}function Re(f,e,r,t){let n=new Float32Array(t);for(let s=0;s<t;s++){let i=0,a=s*r;for(let o=0;o<r;o++)i+=f[a+o]*e[o];n[s]=i}return n}function Dt(f,e,r,t,n=1e-5){let s=0;for(let u=0;u<t;u++)s+=f[u];s/=t;let i=0;for(let u=0;u<t;u++){let c=f[u]-s;i+=c*c}i/=t;let a=1/Math.sqrt(i+n),o=new Float32Array(t);for(let u=0;u<t;u++)o[u]=(f[u]-s)*a*e[u]+r[u];return o}var Lt,$e,pt,vn=ae(()=>{"use strict";ct();ot();ut();Ze();bn();Lt=f=>1/(1+Math.exp(-f));$e=class $e{constructor(e,r,t){this.engine=e;this.manifest=r;this.raw=t;this.w=new Map;this.g=new Map;this.rLayers=[];this.rNorms=null;this.normBufs=[];this.residentLock=Promise.resolve()}isBigProj(e){return/\.(time_mix_(receptance|key|value|output)|channel_mix_(key|value))\.weight$/.test(e)}async load(e){let r=this.manifest.arch;this.D=r.d,this.H=r.rwkv.headSize,this.NH=this.D/this.H,this.NL=r.blockCount,this.vocab=r.vocab,this.tok=new Rt(e,0);for(let[t,n]of Object.entries(this.manifest.tensors)){if(t==="token_embd.weight"){this.embedBytes=await this.raw(t),this.embedDtype=n.dtype;continue}let s=await this.raw(t);if(t==="output.weight"){if(n.dtype==="q4"){let i=we(s,n.nElems);this.g.set(t,{kind:"q4",nib:this.engine.uploadGpuRaw(i.nibbles),sc:this.up(i.scales),mn:this.up(i.mins),IN:this.D,OUT:this.vocab})}else if(n.dtype==="q3"){let i=Ue(s,n.nElems);this.g.set(t,{kind:"q3",q3:!0,lo:this.up32(i.lo),hi:this.up32(i.hi),sc:this.up(i.scales),mn:this.up(i.mins),IN:this.D,OUT:this.vocab})}else if(n.dtype==="q8"){let i=_e(s,n.nElems);this.g.set(t,{kind:"q8",codes:this.upI8(i.codes),sc:this.up(i.scales),IN:this.D,OUT:this.vocab})}else this.w.set(t,n.dtype==="f32"?lr(s,n.nElems):cr(s,n.nElems));continue}if(this.isBigProj(t)&&(n.dtype==="q3"||n.dtype==="q4"||n.dtype==="q8")){let i=n.shape[0],a=n.nElems/i;if(n.dtype==="q3"){let o=Ue(s,n.nElems);this.g.set(t,{kind:"q3",q3:!0,lo:this.up32(o.lo),hi:this.up32(o.hi),sc:this.up(o.scales),mn:this.up(o.mins),IN:i,OUT:a})}else if(n.dtype==="q8"){let o=_e(s,n.nElems);this.g.set(t,{kind:"q8",codes:this.upI8(o.codes),sc:this.up(o.scales),IN:i,OUT:a})}else{let o=we(s,n.nElems);this.g.set(t,{kind:"q4",nib:this.engine.uploadGpuRaw(o.nibbles),sc:this.up(o.scales),mn:this.up(o.mins),IN:i,OUT:a})}}else this.w.set(t,n.dtype==="f32"?lr(s,n.nElems):n.dtype==="f16"?cr(s,n.nElems):n.dtype==="q3"?Ke(Ue(s,n.nElems)):n.dtype==="q8"?ve(_e(s,n.nElems)):me(we(s,n.nElems)))}this.buildResidentLayers(),this.reset()}buildResidentLayers(){try{let e=t=>{let n=this.w.get(t);if(!n)throw new Error(`r\xE9sident : tenseur manquant ${t}`);let s=this.engine.uploadGpu(n);return this.normBufs.push(s),s};this.rNorms={tokW:e("token_embd_norm.weight"),tokB:e("token_embd_norm.bias"),outW:e("output_norm.weight"),outB:e("output_norm.bias")};let r=[];for(let t=0;t<this.NL;t++){let n=`blk.${t}.`,s=(m,w)=>{let v=this.w.get(n+m);if(!v)throw new Error(`r\xE9sident : ${n}${m} manquant`);return v.length/w},i=this.w.get(n+"time_mix_ln.weight"),a=this.w.get(n+"time_mix_ln.bias");if(!i||!a)throw new Error(`r\xE9sident : ${n}time_mix_ln manquant`);let o=new Float32Array(2*this.D);o.set(i,0),o.set(a,this.D);let u=this.engine.uploadGpu(o);this.normBufs.push(u);let c=m=>{let w=this.g.get(n+m);if(!w)throw new Error(`r\xE9sident : ${n}${m} non quantifi\xE9e GPU`);return w},l=s("time_mix_w1.weight",this.D),d=s("time_mix_a1.weight",this.D),p=s("time_mix_g1.weight",this.D),g={attnNormW:e(n+"attn_norm.weight"),attnNormB:e(n+"attn_norm.bias"),attnNorm2W:e(n+"attn_norm_2.weight"),attnNorm2B:e(n+"attn_norm_2.bias"),lerpFused:e(n+"time_mix_lerp_fused.weight"),lerpK:e(n+"channel_mix_lerp_k.weight"),w0:e(n+"time_mix_w0.weight"),w1:e(n+"time_mix_w1.weight"),w2:e(n+"time_mix_w2.weight"),rw:l,a0:e(n+"time_mix_a0.weight"),a1:e(n+"time_mix_a1.weight"),a2:e(n+"time_mix_a2.weight"),ra:d,g1:e(n+"time_mix_g1.weight"),g2:e(n+"time_mix_g2.weight"),rg:p,kk:e(n+"time_mix_k_k.weight"),ka:e(n+"time_mix_k_a.weight"),rk:e(n+"time_mix_r_k.weight"),lnWB:u,R:c("time_mix_receptance.weight"),K:c("time_mix_key.weight"),V:c("time_mix_value.weight"),O:c("time_mix_output.weight"),cmK:c("channel_mix_key.weight"),cmV:c("channel_mix_value.weight"),ffn:this.g.get(n+"channel_mix_key.weight").OUT};t>0&&(g.rv=s("time_mix_v1.weight",this.D),g.v0=e(n+"time_mix_v0.weight"),g.v1=e(n+"time_mix_v1.weight"),g.v2=e(n+"time_mix_v2.weight")),r.push(g)}this.rLayers=r}catch(e){console.warn("[rwkv] chemin r\xE9sident indisponible (montage) : repli forwardToken JS+readback.",e),this.rLayers=[],this.rNorms=null}}residentAvailable(){let e=this.engine;return e.rwkvResidentOk!==!1&&e.rwkvWkv7Ok!==!1&&!!this.g.get("output.weight")&&this.rLayers.length===this.NL&&!!this.rNorms}cfg(){return{D:this.D,H:this.H,NH:this.NH,vocab:this.vocab}}embedsFor(e){let r=this.D,t=new Float32Array(e.length*r);for(let n=0;n<e.length;n++)t.set(this.embedRow(e[n]),n*r);return t}async prefillGpu(e,r,t){for(let n=0;n<e.length;n+=$e.PREFILL_CHUNK){let s=e.slice(n,n+$e.PREFILL_CHUNK);await this.engine.rwkvPrefillGpu(this.embedsFor(s),s.length,this.cfg(),this.rLayers,this.rNorms,r+n,t)}}locked(e){let r=this.residentLock.then(e,e);return this.residentLock=r.catch(()=>{}),r}async feedThen(e,r,t,n){let s=e.length>$e.PREFILL_CHUNK?e.slice(0,e.length-$e.PREFILL_CHUNK):[];return s.length&&await this.prefillGpu(s,r,t),n(e.slice(s.length),r+s.length)}async logitsGpu(e,r,t){return this.feedThen(e,r,t,(n,s)=>this.engine.rwkvLogitsGpu(this.embedsFor(n),n.length,this.cfg(),this.rLayers,this.g.get("output.weight"),this.rNorms,s,t))}async topKGpu(e,r,t,n,s,i=40){return this.feedThen(e,r,t,(a,o)=>this.engine.rwkvTopKGpu(this.embedsFor(a),a.length,this.cfg(),this.rLayers,this.g.get("output.weight"),this.rNorms,o,t,n,s,i))}up(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}up32(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}upI8(e){return this.engine.uploadGpuRaw(new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}reset(){this.state=Array.from({length:this.NL},()=>({S:Array.from({length:this.NH},()=>new Float32Array(this.H*this.H)),tm:new Float32Array(this.D),cm:new Float32Array(this.D)}))}unload(){for(let e of this.g.values())for(let r of["nib","sc","mn","codes","lo","hi"])e[r]?.destroy?.();for(let e of this.normBufs)e?.destroy?.();this.normBufs=[],this.rLayers=[],this.rNorms=null,this.engine.clearRwkvState?.(),this.g.clear(),this.w.clear()}async gemm(e,r){let t=this.g.get(e);if(!t){let n=this.w.get(e);return Re(n,r,r.length,n.length/r.length)}return t.kind==="q3"?this.engine.matmulQ3(r,t.lo,t.hi,t.sc,t.mn,1,t.IN,t.OUT):t.kind==="q8"?this.engine.matmulQ8(r,t.codes,t.sc,1,t.IN,t.OUT):this.engine.matmulQ4(r,t.nib,t.sc,t.mn,1,t.IN,t.OUT)}embedRow(e){let r=this.D;if(this.embedDtype==="f16")return cr(this.embedBytes.subarray(e*r*2,e*r*2+r*2),r);if(this.embedDtype==="f32")return lr(this.embedBytes.subarray(e*r*4,e*r*4+r*4),r);if(this.embedDtype==="q8"){let u=this.vocab*r,c=r/32,l=new Int8Array(this.embedBytes.buffer,this.embedBytes.byteOffset+e*r,r),d=this.embedBytes.subarray(u+e*c*2,u+e*c*2+c*2),p=new DataView(d.buffer,d.byteOffset,d.byteLength),g=new Float32Array(r);for(let m=0;m<c;m++){let w=ge(p.getUint16(m*2,!0));for(let v=0;v<32;v++)g[m*32+v]=l[m*32+v]*w}return g}let t=this.vocab*r,n=r/32,s=0,i=t/2,a=t/2+t/32*2,o=new Uint8Array(r/2+n*2*2);return o.set(this.embedBytes.subarray(s+e*r/2,s+e*r/2+r/2),0),o.set(this.embedBytes.subarray(i+e*n*2,i+e*n*2+n*2),r/2),o.set(this.embedBytes.subarray(a+e*n*2,a+e*n*2+n*2),r/2+n*2),me(we(o,r))}async timeMix(e,r,t,n){let s=this.D,i=this.H,a=this.NH,o=`blk.${e}.`,u=C=>this.w.get(o+C),c=new Float32Array(s);for(let C=0;C<s;C++)c[C]=t.tm[C]-r[C];t.tm=r.slice();let l=u("time_mix_lerp_fused.weight"),d=C=>{let M=new Float32Array(s);for(let D=0;D<s;D++)M[D]=r[D]+c[D]*l[C*s+D];return M},[p,g,m,w,v,G]=[d(0),d(1),d(2),d(3),d(4),d(5)],S=await this.gemm(o+"time_mix_receptance.weight",p),O=await this.gemm(o+"time_mix_key.weight",m),L=await this.gemm(o+"time_mix_value.weight",w),K=Re(u("time_mix_w1.weight"),g,s,u("time_mix_w1.weight").length/s);for(let C=0;C<K.length;C++)K[C]=Math.tanh(K[C]);let x=Re(u("time_mix_w2.weight"),K,K.length,s),_=u("time_mix_w0.weight"),y=new Float32Array(s);for(let C=0;C<s;C++)y[C]=Math.exp(-.606531*Lt(_[C]+x[C]));let h=u("time_mix_a1.weight"),k=Re(u("time_mix_a2.weight"),Re(h,v,s,h.length/s),h.length/s,s),b=u("time_mix_a0.weight"),A=new Float32Array(s);for(let C=0;C<s;C++)A[C]=Lt(b[C]+k[C]);let P=u("time_mix_g1.weight"),B=Re(P,G,s,P.length/s);for(let C=0;C<B.length;C++)B[C]=Lt(B[C]);let U=Re(u("time_mix_g2.weight"),B,B.length,s);if(e===0)n.vFirst=L.slice();else{let C=u("time_mix_v1.weight"),M=Re(u("time_mix_v2.weight"),Re(C,w,s,C.length/s),C.length/s,s),D=u("time_mix_v0.weight");for(let E=0;E<s;E++)L[E]=L[E]+(n.vFirst[E]-L[E])*Lt(D[E]+M[E])}let q=u("time_mix_k_k.weight"),T=u("time_mix_k_a.weight"),j=new Float32Array(s);for(let C=0;C<s;C++)j[C]=O[C]*q[C];for(let C=0;C<a;C++){let M=0;for(let D=0;D<i;D++){let E=j[C*i+D];M+=E*E}M=Math.sqrt(M)||1e-12;for(let D=0;D<i;D++)j[C*i+D]/=M}let F=new Float32Array(s);for(let C=0;C<s;C++)F[C]=O[C]*(1+(A[C]-1)*T[C]);let R=new Float32Array(s);for(let C=0;C<a;C++){let M=C*i,D=t.S[C];for(let E=0;E<i;E++){let W=0;for(let z=0;z<i;z++)W+=-j[M+z]*D[E*i+z];let Y=0,I=L[M+E];for(let z=0;z<i;z++){let X=y[M+z]*D[E*i+z]+I*F[M+z]+j[M+z]*A[M+z]*W;D[E*i+z]=X,Y+=S[M+z]*X}R[M+E]=Y}}let H=u("time_mix_ln.weight"),Q=u("time_mix_ln.bias"),N=u("time_mix_r_k.weight"),V=new Float32Array(s);for(let C=0;C<a;C++){let M=C*i,D=0;for(let Y=0;Y<i;Y++)D+=R[M+Y];D/=i;let E=0;for(let Y=0;Y<i;Y++){let I=R[M+Y]-D;E+=I*I}E/=i;let W=1/Math.sqrt(E+64e-5);for(let Y=0;Y<i;Y++)V[M+Y]=(R[M+Y]-D)*W*H[M+Y]+Q[M+Y]}for(let C=0;C<a;C++){let M=C*i,D=0;for(let E=0;E<i;E++)D+=S[M+E]*F[M+E]*N[M+E];for(let E=0;E<i;E++)V[M+E]+=D*L[M+E]}let $=new Float32Array(s);for(let C=0;C<s;C++)$[C]=V[C]*U[C];return this.gemm(o+"time_mix_output.weight",$)}async channelMix(e,r,t){let n=this.D,s=`blk.${e}.`,i=this.w.get(s+"channel_mix_lerp_k.weight"),a=new Float32Array(n);for(let c=0;c<n;c++)a[c]=t.cm[c]-r[c];t.cm=r.slice();let o=new Float32Array(n);for(let c=0;c<n;c++)o[c]=r[c]+a[c]*i[c];let u=await this.gemm(s+"channel_mix_key.weight",o);for(let c=0;c<u.length;c++)u[c]=u[c]>0?u[c]*u[c]:0;return this.gemm(s+"channel_mix_value.weight",u)}async forwardToken(e){let r=this.D,t={vFirst:null},n=this.embedRow(e);n=Dt(n,this.w.get("token_embd_norm.weight"),this.w.get("token_embd_norm.bias"),r);for(let s=0;s<this.NL;s++){let i=this.state[s],a=`blk.${s}.`,o=await this.timeMix(s,Dt(n,this.w.get(a+"attn_norm.weight"),this.w.get(a+"attn_norm.bias"),r),i,t);for(let c=0;c<r;c++)n[c]+=o[c];let u=await this.channelMix(s,Dt(n,this.w.get(a+"attn_norm_2.weight"),this.w.get(a+"attn_norm_2.bias"),r),i);for(let c=0;c<r;c++)n[c]+=u[c]}return n=Dt(n,this.w.get("output_norm.weight"),this.w.get("output_norm.bias"),r),this.gemm("output.weight",n)}async classify(e,r){let t=this.tok.encode(e),n;if(this.residentAvailable())n=await this.locked(()=>this.logitsGpu(t,0,"cls"));else{this.reset();for(let i of t)n=await this.forwardToken(i)}let s=r.map(i=>({label:i,logit:n[this.tok.encode(" "+i)[0]]})).sort((i,a)=>a.logit-i.logit);return{label:s[0].label,scores:s}}sampleTok(e,r,t){let{temperature:n=.8,topK:s=40,repeatPenalty:i=1.3}=t,a=new Set(r),o=[];for(let d=0;d<e.length;d++){let p=e[d];a.has(d)&&(p=p>0?p/i:p*i),o.push({i:d,v:p})}o.sort((d,p)=>p.v-d.v),o.length=s;let u=o[0].v,c=0;for(let d of o)d.p=Math.exp((d.v-u)/n),c+=d.p;let l=Math.random()*c;for(let d of o)if(l-=d.p,l<=0)return d.i;return o[0].i}async generate(e,r,t,n,s){this.reset();let i=this.tok.encode(e),a;for(let u of i)a=await this.forwardToken(u);let o=[];for(let u=0;u<r&&!n?.();u++){let c;if(s?.sample)c=this.sampleTok(a,o.slice(-64),s);else{c=0;for(let l=1;l<a.length;l++)a[l]>a[c]&&(c=l)}if(c===0)break;o.push(c),t&&t(this.tok.decode(o)),a=await this.forwardToken(c)}return this.tok.decode(o)}pickFromTopK(e,r){if(!r?.sample)return e.ids[0];let{temperature:t=.8,topK:n=40}=r,s=Math.min(n,e.ids.length);for(;s>1&&e.vals[s-1]<=-3e38;)s--;let i=e.vals[0],a=0,o=new Array(s);for(let c=0;c<s;c++)o[c]=Math.exp((e.vals[c]-i)/t),a+=o[c];let u=Math.random()*a;for(let c=0;c<s;c++)if(u-=o[c],u<=0)return e.ids[c];return e.ids[0]}async generateResident(e,r,t,n,s){return this.residentAvailable()?this.locked(async()=>{let a=s?.repeatPenalty??(s?.sample?1.3:1),o=this.tok.encode(e),u=await this.topKGpu(o,0,"gen",[],1,48),c=o.length,l=[];for(let d=0;d<r&&!n?.();d++){let p=this.pickFromTopK(u,s);if(p===0)break;l.push(p),t&&t(this.tok.decode(l)),u=await this.topKGpu([p],c,"gen",a!==1?[...new Set(l.slice(-64))]:[],a,48),c++}return this.tok.decode(l)}):this.generate(e,r,t,n,s)}};$e.PREFILL_CHUNK=32;pt=$e});function tt(f){if(!f.length)return null;let e=1/0,r=0,t=0;for(let n of f)e=Math.min(e,n.offset),r=Math.max(r,n.offset+n.bytes),t+=n.bytes;return r-e>64<<20||r-e>t*1.5?null:{start:e,end:r}}function yn(f){let e=[];for(let r=0;r<f.bytes;r+=qe)e.push({off:f.offset+r,len:Math.min(qe,f.bytes-r)});return e}function fr(f,e){let r=new Map;for(let s of Object.keys(f)){let i=s.match(/^blk\.(\d+)\./);if(!i)continue;let a=r.get(i[1]);a||r.set(i[1],a=[]),a.push(s)}let t=new Map,n=new Map;return async s=>{let i=f[s];if(!i)throw new Error(`tenseur absent : ${s}`);let a=s.match(/^blk\.(\d+)\./),o=a?r.get(a[1]):void 0,u=o?tt(o.map(w=>f[w])):null;if(!a||!o||!u)return e.bytes(i.offset,i.bytes);let c=a[1],l=t.get(c);l||(l=e.bytes(u.start,u.end-u.start).then(w=>({start:u.start,bytes:w})),t.set(c,l),n.set(c,o.length));let{start:d,bytes:p}=await l,g=p.subarray(i.offset-d,i.offset-d+i.bytes),m=(n.get(c)??1)-1;return m<=0?(t.delete(c),n.delete(c),new Uint8Array(g)):(n.set(c,m),g)}}var wn,qe,rt=ae(()=>{"use strict";wn=new Set(["per_layer_token_embd.weight"]),qe=4<<20});function dr(f){return f==="llama"||f==="mistral3"||f==="smollm3"}var kn=ae(()=>{"use strict"});function Vs(f){return f instanceof Blob?{bytes:async(e,r)=>new Uint8Array(await f.slice(e,e+r).arrayBuffer())}:f}var le,Ge,gt=ae(()=>{"use strict";rt();kn();ot();ut();ct();Ft();rt();le=class le{constructor(e,r,t){this.rawCache=new Map;this.layerSpan=new Map;this.weightPrecision="f32";this.precOverrides=null;this.layerCache=new Map;this.layerGpuCache=new Map;this.finalNormGpu=null;this.projQ8=null;this.projVocab=0;this.visionSegments=[];this.engine=e,this.source=Vs(r),this.manifest=t,this.weightPrecision=this.nativePrecision}get nativePrecision(){let e=this.manifest.tensors["blk.0.attn_q.weight"];return e?.type==="Q4W"?"q4":e?.type==="Q8W"?"q8":e?.type==="Q3W"?"q3":this.supportsQ8?"q8":this.engine?.hasF16?"f16":"f32"}get isMixedNative(){let e=this.manifest.tensors["blk.0.attn_q.weight"]?.type,r=this.manifest.tensors["blk.0.ffn_gate.weight"]?.type;return(e==="Q4W"||e==="Q8W")&&(r==="Q4W"||r==="Q8W")&&e!==r}get loaded(){return this.manifest!==null}async loadManifest(){return this.manifest}async rawTensor(e){let r=this.rawCache.get(e);if(r)return r;let t=this.manifest.tensors[e];if(!t)throw new Error("tensor absent du manifeste: "+e);let n=await this.source.bytes(t.offset,t.bytes);return this.cacheRaw(e,n)}cacheRaw(e,r){let t=this.maybeUnpermuteLlamaQk(e,r);return this.rawCache.set(e,t),t}maybeUnpermuteLlamaQk(e,r){if(!le.unpermOn||le.ropeNormOn&&dr(this.manifest.arch)||!["llama","mistral3","smollm3"].includes(this.manifest.arch))return r;let t=e.endsWith(".attn_q.weight"),n=e.endsWith(".attn_k.weight");if(!t&&!n)return r;let{nHeads:s,nKvHeads:i,headDim:a}=this.manifest.config,o=this.manifest.tensors[e];if(o.type==="Q8W"||o.type==="Q4W"||o.type==="Q3W")throw new Error("BRIK d\u2019un mod\xE8le llama non support\xE9 (lignes Q/K permut\xE9es) : charger le GGUF directement.");let u=t?s:i,c=u*a,l=o.bytes/c;if(!Number.isInteger(l))throw new Error(`${e} : lignes non uniformes (${o.bytes} o / ${c} lignes). D\xE9-permutation impossible.`);let d=a/2,p=new Uint8Array(r.byteLength);for(let g=0;g<u;g++){let m=g*a;for(let w=0;w<d;w++)p.set(r.subarray((m+2*w)*l,(m+2*w+1)*l),(m+w)*l),p.set(r.subarray((m+2*w+1)*l,(m+2*w+2)*l),(m+d+w)*l)}return p}ensureLayerSpan(e){let r=this.layerSpan.get(e);return r||(r=this.fetchLayerSpan(e).catch(()=>{this.layerSpan.delete(e)}),this.layerSpan.set(e,r)),r}async fetchLayerSpan(e){let r=`blk.${e}.`,t=Object.entries(this.manifest.tensors).filter(([i])=>i.startsWith(r)),n=tt(t.map(([,i])=>i));if(!n)return;let s=await this.source.bytes(n.start,n.end-n.start);for(let[i,a]of t)this.rawCache.has(i)||this.cacheRaw(i,s.subarray(a.offset-n.start,a.offset-n.start+a.bytes))}async debugTensorF32(e,r=!1){if(!r)return this.dequant(e);let t=le.unpermOn,n=this.rawCache.has(e),s=this.rawCache.get(e);try{return le.unpermOn=!1,this.rawCache.delete(e),await this.dequant(e)}finally{le.unpermOn=t,this.rawCache.delete(e),n&&s&&this.rawCache.set(e,s)}}async dequant(e){let r=this.manifest.tensors[e],t=await this.rawTensor(e);return this.engine.dequantizeByType(r.type,t,r.nElems)}async dequantGpu(e){let r=this.manifest.tensors[e],t=await this.rawTensor(e);return this.engine.dequantizeToGpu(r.type,t,r.nElems)}async dequantGpuF16(e){let r=this.manifest.tensors[e],t=await this.rawTensor(e);if(r.type==="F16")return this.engine.uploadGpuRawF16(t);let n=this.engine.dequantizeToGpu(r.type,t,r.nElems),s=this.engine.f32ToF16Gpu(n,r.nElems);return n.destroy?.(),s}async dequantGpuQ4(e){let r=this.manifest.tensors[e],t=await this.rawTensor(e);if(r.type!=="Q4W"){let s=this.engine.dequantizeToGpu(r.type,t,r.nElems),i=this.engine.f32ToQ4Gpu(s,r.nElems);return s.destroy?.(),i}let n=we(t,r.nElems);return{nib:this.engine.uploadGpuRaw(n.nibbles),sc:this.engine.uploadGpuRaw(new Uint8Array(n.scales.buffer,n.scales.byteOffset,n.scales.byteLength)),mn:this.engine.uploadGpuRaw(new Uint8Array(n.mins.buffer,n.mins.byteOffset,n.mins.byteLength))}}async dequantGpuQ3(e){let r=this.manifest.tensors[e],t=await this.rawTensor(e);if(r.type!=="Q3W")return this.engine.dequantizeToGpu(r.type,t,r.nElems);let n=Ue(t,r.nElems);return{q3:!0,lo:this.engine.uploadGpuRaw(new Uint8Array(n.lo.buffer,n.lo.byteOffset,n.lo.byteLength)),hi:this.engine.uploadGpuRaw(new Uint8Array(n.hi.buffer,n.hi.byteOffset,n.hi.byteLength)),sc:this.engine.uploadGpuRaw(new Uint8Array(n.scales.buffer,n.scales.byteOffset,n.scales.byteLength)),mn:this.engine.uploadGpuRaw(new Uint8Array(n.mins.buffer,n.mins.byteOffset,n.mins.byteLength))}}async dequantGpuQ8(e){let r=this.manifest.tensors[e],t=await this.rawTensor(e);if(r.type!=="Q8W"){let s=this.engine.dequantizeToGpu(r.type,t,r.nElems),i=this.engine.f32ToQ8Gpu(s,r.nElems);return s.destroy?.(),i}let n=_e(t,r.nElems);return{codes:this.engine.uploadGpuRaw(new Uint8Array(n.codes.buffer,n.codes.byteOffset,n.codes.byteLength)),sc:this.engine.uploadGpuRaw(new Uint8Array(n.scales.buffer,n.scales.byteOffset,n.scales.byteLength))}}static destroyWeight(e){if(e){if(e.kq){e.buf?.destroy?.();return}e.q3?(e.lo?.destroy?.(),e.hi?.destroy?.(),e.sc?.destroy?.(),e.mn?.destroy?.()):e.nib?(e.nib?.destroy?.(),e.sc?.destroy?.(),e.mn?.destroy?.()):e.codes?(e.codes?.destroy?.(),e.sc?.destroy?.()):e.destroy?.()}}get precision(){return this.weightPrecision}get supportsQ4(){let{d:e,ffn:r}=this.manifest.config;return e%32===0&&r%32===0}get supportsQ8(){return this.supportsQ4}get supportsQ3(){return this.supportsQ4}matPrecision(e){let r=this.weightPrecision;if((r==="q4"||r==="q8")&&this.precOverrides){for(let[t,n]of this.precOverrides)if(e.includes(t))return n}if(r===this.nativePrecision){let t=this.manifest.tensors[e]?.type;if(t==="Q4W")return"q4";if(t==="Q8W")return"q8";if(t==="Q3W")return"q3"}return r}setWeightPrecision(e){if(e!==this.weightPrecision){if((e==="q4"||e==="q8")&&!this.supportsQ4)throw new Error(`${e} indisponible : d ou ffn non multiple de 32`);for(let r of this.layerGpuCache.values())for(let t of Object.values(r))le.destroyWeight(t);this.layerGpuCache.clear(),this.weightPrecision=e}}async layerWeights(e){let r=this.layerCache.get(e);if(r)return r;let t=`blk.${e}`,[n,s,i,a,o,u,c,l,d,p,g,m]=await Promise.all([this.dequant(`${t}.attn_norm.weight`),this.dequantGpu(`${t}.attn_q.weight`),this.dequantGpu(`${t}.attn_k.weight`),this.dequantGpu(`${t}.attn_v.weight`),this.dequantGpu(`${t}.attn_output.weight`),this.dequant(`${t}.ffn_norm.weight`),this.dequantGpu(`${t}.ffn_gate.weight`),this.dequantGpu(`${t}.ffn_up.weight`),this.dequantGpu(`${t}.ffn_down.weight`),this.dequant(`${t}.attn_q.bias`).catch(()=>{}),this.dequant(`${t}.attn_k.bias`).catch(()=>{}),this.dequant(`${t}.attn_v.bias`).catch(()=>{})]),[w,v,G,S]=await Promise.all([this.dequant(`${t}.post_attention_norm.weight`).catch(()=>{}),this.dequant(`${t}.post_ffw_norm.weight`).catch(()=>{}),this.dequant(`${t}.attn_q_norm.weight`).catch(()=>{}),this.dequant(`${t}.attn_k_norm.weight`).catch(()=>{})]),O={attnNorm:n,wq:s,wk:i,wv:a,wo:o,ffnNorm:u,wgate:c,wup:l,wdown:d,bq:p,bk:g,bv:m,postAttnNorm:w,postFfnNorm:v,qNorm:G,kNorm:S};return this.layerCache.set(e,O),O}async warmup(e){let{blockCount:r,d:t}=this.manifest.config,n=r+1;for(let s=0;s<r;s++)await this.layerWeightsGpu(s),e?.(s+1,n);await this.getFinalNormGpu(),await this.getRopeFactors(),await this.getProjectionQ8(t);try{await this.topKKV([0],0,"brimkern-warmup",[],1),this.reset()}catch(s){console.warn("[warmup] passe \xE0 blanc impossible. Le premier message paiera le transfert :",s)}e?.(n,n)}async layerWeightsGpu(e){let r=this.layerGpuCache.get(e);if(r)return r;await this.ensureLayerSpan(e);let t=`blk.${e}`,n=h=>this.engine.uploadGpu(h),i=this.weightPrecision==="f16",a=h=>{let k=this.matPrecision(h);return k==="q3"?this.dequantGpuQ3(h):k==="q4"?this.dequantGpuQ4(h):k==="q8"?this.dequantGpuQ8(h):k==="f16"?this.dequantGpuF16(h):this.dequantGpu(h)},[o,u,c,l,d,p,g,m,w,v,G,S]=await Promise.all([this.dequant(`${t}.attn_norm.weight`).then(n),a(`${t}.attn_q.weight`),a(`${t}.attn_k.weight`),a(`${t}.attn_v.weight`),a(`${t}.attn_output.weight`),this.dequant(`${t}.ffn_norm.weight`).then(n),a(`${t}.ffn_gate.weight`),a(`${t}.ffn_up.weight`),a(`${t}.ffn_down.weight`),this.dequant(`${t}.attn_q.bias`).then(n).catch(()=>{}),this.dequant(`${t}.attn_k.bias`).then(n).catch(()=>{}),this.dequant(`${t}.attn_v.bias`).then(n).catch(()=>{})]),[O,L,K,x]=await Promise.all([this.dequant(`${t}.post_attention_norm.weight`).then(n).catch(()=>{}),this.dequant(`${t}.post_ffw_norm.weight`).then(n).catch(()=>{}),this.dequant(`${t}.attn_q_norm.weight`).then(n).catch(()=>{}),this.dequant(`${t}.attn_k_norm.weight`).then(n).catch(()=>{})]),_={attnNorm:o,wq:u,wk:c,wv:l,wo:d,ffnNorm:p,wgate:g,wup:m,wdown:w,bq:v,bk:G,bv:S,postAttnNorm:O,postFfnNorm:L,qNorm:K,kNorm:x,matF16:i};this.layerGpuCache.set(e,_);let y=`blk.${e}.`;for(let h of this.rawCache.keys())h.startsWith(y)&&this.rawCache.delete(h);return this.layerSpan.delete(e),_}async getFinalNormGpu(){return this.finalNormGpu||(this.finalNormGpu=this.engine.uploadGpu(await this.dequant("output_norm.weight"))),this.finalNormGpu}async prewarmGpu(e){let{blockCount:r,d:t}=this.manifest.config,n=new Array(r).fill(0);for(let[o,u]of Object.entries(this.manifest.tensors)){let c=o.match(/^blk\.(\d+)\./);c&&(n[Number(c[1])]+=u.bytes)}let s=n.reduce((o,u)=>o+u,0),i=0,a=4;for(let o=0;o<r;o+=a){let u=Math.min(a,r-o);await Promise.all(Array.from({length:u},(c,l)=>this.layerWeightsGpu(o+l)));for(let c=0;c<u;c++)i+=n[o+c];e?.(i,s)}await this.getFinalNormGpu(),await this.getProjectionQ8(t)}static q8RowsBlob(e,r,t,n,s){let i=s/32,a=t*s,o=n*s,u=r+t*i*2,c=n*i*2,l=new Uint8Array(o+c);return l.set(e.subarray(a,a+o),0),l.set(e.subarray(u,u+c),o),l}static q4RowsBlob(e,r,t,n,s){let i=s/32,a=0,o=r/2,u=r/2+r/32*2,c=n*s/2,l=n*i*2,d=new Uint8Array(c+l*2);return d.set(e.subarray(a+t*s/2,a+t*s/2+c),0),d.set(e.subarray(o+t*i*2,o+t*i*2+l),c),d.set(e.subarray(u+t*i*2,u+t*i*2+l),c+l),d}async embed(e,r){let t=this.manifest.tensors["token_embd.weight"],n=t.nElems/r,s=t.type==="Q8W",i=t.type==="Q4W",a=t.bytes/n;if(!s&&!i&&!Number.isInteger(a))throw new Error("token_embd: lignes non uniformes");let o=await this.rawTensor("token_embd.weight"),u=this.manifest.config.embedScale??1,c=new Float32Array(e.length*r);for(let l=0;l<e.length;l++){let d=e[l],p=s?le.q8RowsBlob(o,t.nElems,d,1,r):i?le.q4RowsBlob(o,t.nElems,d,1,r):o.subarray(d*a,(d+1)*a),g=await this.engine.dequantizeByType(t.type,p,r);if(u!==1)for(let m=0;m<r;m++)g[m]*=u;c.set(g,l*r)}return c}async getProjectionQ8(e){if(this.projQ8)return this.projQ8;let r=this.manifest.tensors["output.weight"]?"output.weight":"token_embd.weight",t=this.manifest.tensors[r];if(!t)throw new Error("Logits projection tensor not found (output.weight / token_embd.weight)");let n=t.nElems/e;this.projVocab=n;let s=await this.rawTensor(r),i=Math.max(1,Math.floor(this.engine.maxStorageBufferBindingSize*.9/e)),a=[];if(t.type==="Q4W"){for(let u=0;u<n;u+=i){let c=Math.min(i,n-u),l=le.q4RowsBlob(s,t.nElems,u,c,e),d=c*e/2,p=c*(e/32)*2;a.push({w:{nib:this.engine.uploadGpuRaw(l.subarray(0,d)),sc:this.engine.uploadGpuRaw(l.subarray(d,d+p)),mn:this.engine.uploadGpuRaw(l.subarray(d+p))},rows:c,r0:u})}return this.projQ8=a,a}let o=t.type==="Q8W"?s:await this.engine.quantizeToBytes(t.type,s,t.nElems,"q8");for(let u=0;u<n;u+=i){let c=Math.min(i,n-u),l=le.q8RowsBlob(o,t.nElems,u,c,e),d=c*e;a.push({w:{codes:this.engine.uploadGpuRaw(l.subarray(0,d)),sc:this.engine.uploadGpuRaw(l.subarray(d))},rows:c,r0:u})}return this.projQ8=a,a}async argmaxLogits(e,r){let t=await this.getProjectionQ8(r),n=0,s=-1/0;for(let i of t){let a=i.w.nib?await this.engine.matmulQ4(e,i.w.nib,i.w.sc,i.w.mn,1,r,i.rows):await this.engine.matmulQ8(e,i.w.codes,i.w.sc,1,r,i.rows);for(let o=0;o<a.length;o++)a[o]>s&&(s=a[o],n=i.r0+o)}return n}archFlags(){let e=this.manifest.config;return{attnScale:e.attnScale,attnLogitSoftcap:e.attnLogitSoftcap,act:e.act,rmsGainOnePlus:e.rmsGainOnePlus,windowPerLayer:e.windowPerLayer,ropeThetaPerLayer:e.ropeThetaPerLayer,skipRopePerLayer:e.skipRopePerLayer,ropeInterleaved:le.ropeNormOn?e.ropeInterleaved??(dr(this.manifest.arch)||void 0):void 0}}mropePositions(e,r){let t=e+r,n=new Uint32Array(r*3),s=[...this.visionSegments].sort((c,l)=>c.at-l.at),i=(c,l,d,p)=>{c>=e&&c<t&&(n[(c-e)*3]=l,n[(c-e)*3+1]=d,n[(c-e)*3+2]=p)},a=0,o=0,u=0;for(;a<t;){let c=u<s.length?s[u]:null;if(c&&a===c.at){let l=o,d=c.gh*c.gw;for(let p=0;p<d;p++)i(a+p,l,l+Math.floor(p/c.gw),l+p%c.gw);o=l+Math.max(c.gh,c.gw),a+=d,u++}else i(a,o,o,o),o++,a++}return n}async getRopeFactors(){if(this.ropeFactorsCache!==void 0)return this.ropeFactorsCache;if(!le.ropeFactorsOn)return console.warn("[model] facteurs RoPE COUP\xC9S par ?ropefactors=0 : RoPE standard"),this.ropeFactorsCache=null,null;if(this.manifest.tensors["rope_freqs.weight"])this.ropeFactorsCache=await this.dequant("rope_freqs.weight"),console.log("[model] rope_freqs.weight pr\xE9sent : RoPE \xE0 facteurs (scaling llama3) actif");else if(this.manifest.config.yarn){let{factor:e,betaFast:r,betaSlow:t,origCtx:n}=this.manifest.config.yarn,{headDim:s,ropeTheta:i}=this.manifest.config,a=s/2,o=d=>s*Math.log(n/(d*2*Math.PI))/(2*Math.log(i)),u=o(r),c=o(t),l=new Float32Array(a);for(let d=0;d<a;d++){let p=1-Math.min(1,Math.max(0,(d-u)/Math.max(.001,c-u)));l[d]=1/(1/e*(1-p)+p)}this.ropeFactorsCache=l,console.log(`[model] YaRN statique actif (factor ${e}, dims corr ${u.toFixed(1)}\u2013${c.toFixed(1)})`)}else this.ropeFactorsCache=null;return this.ropeFactorsCache}applyMrope(e,r,t){let n=this.manifest.config.mropeSections;if(n){if(!this.engine.mropeOk)throw new Error("M-RoPE indisponible sur ce GPU (selfValidate) : vision d\xE9sactiv\xE9e.");e.mropeSections=n,e.positions=this.mropePositions(r,t)}}static applyInjections(e,r,t,n,s){if(s)for(let i of s){let a=i.rows.length/r;for(let o=0;o<a;o++){let u=i.at+o-t;u>=0&&u<n&&e.set(i.rows.subarray(o*r,(o+1)*r),u*r)}}}get kvQuant(){return this.engine.kvQuant===!0}setKvQuant(e){this.engine.setKvQuant(e)}reset(){this.engine.clearKvCache(),this.visionSegments=[]}unload(){this.reset();for(let e of this.layerGpuCache.values())for(let r of Object.values(e))le.destroyWeight(r);this.layerGpuCache.clear(),this.finalNormGpu?.destroy?.(),this.finalNormGpu=null;for(let e of this.projQ8??[])le.destroyWeight(e.w);this.projQ8=null,this.layerCache.clear(),this.rawCache.clear(),this.layerSpan.clear()}async hiddenKV(e,r,t,n){let s=this.manifest,{d:i,nHeads:a,nKvHeads:o,headDim:u,ffn:c,blockCount:l,ropeTheta:d,rmsEps:p}=s.config,g={seq:e.length,d:i,nHeads:a,nKvHeads:o,headDim:u,ffn:c,ropeTheta:d,eps:p,...this.archFlags()};this.applyMrope(g,r,e.length),g.ropeFactors=await this.getRopeFactors()??void 0;let m=await this.embed(e,i);le.applyInjections(m,i,r,e.length,n);let w=await Promise.all(Array.from({length:l},(G,S)=>this.layerWeightsGpu(S))),v=await this.getFinalNormGpu();return this.engine.runDecodeGpu(m,g,w,r,v,t)}async generateNextKV(e,r,t,n){let s=await this.hiddenKV(e,r,t,n);return this.argmaxLogits(s,this.manifest.config.d)}async logitsKV(e,r,t,n){let s=this.manifest,{d:i,nHeads:a,nKvHeads:o,headDim:u,ffn:c,blockCount:l,ropeTheta:d,rmsEps:p}=s.config,g={seq:e.length,d:i,nHeads:a,nKvHeads:o,headDim:u,ffn:c,ropeTheta:d,eps:p,...this.archFlags()};this.applyMrope(g,r,e.length),g.ropeFactors=await this.getRopeFactors()??void 0;let m=le.timingOn?(x,_)=>console.info(`[timing] ${x} ${(performance.now()-_).toFixed(0)} ms`):null,w=performance.now(),v=await this.embed(e,i);m?.("embed",w),w=performance.now(),le.applyInjections(v,i,r,e.length,n);let G=await Promise.all(Array.from({length:l},(x,_)=>this.layerWeightsGpu(_)));m?.("poids des couches",w),w=performance.now();let S=await this.getFinalNormGpu(),O=await this.getProjectionQ8(i);m?.("norme finale + t\xEAte de projection",w),w=performance.now();let L=await this.engine.decodeLogitsQ8(v,g,G,r,S,t,O,this.projVocab);m?.("forward + logits",w);let K=s.config.finalLogitSoftcap;if(K&&K>0)for(let x=0;x<L.length;x++)L[x]=K*Math.tanh(L[x]/K);return L}async topKKV(e,r,t,n,s,i){let a=this.manifest,{d:o,nHeads:u,nKvHeads:c,headDim:l,ffn:d,blockCount:p,ropeTheta:g,rmsEps:m}=a.config,w={seq:e.length,d:o,nHeads:u,nKvHeads:c,headDim:l,ffn:d,ropeTheta:g,eps:m,...this.archFlags()};this.applyMrope(w,r,e.length),w.ropeFactors=await this.getRopeFactors()??void 0;let v=le.timingOn?(_,y)=>console.info(`[timing] ${_} ${(performance.now()-y).toFixed(0)} ms`):null,G=performance.now(),S=await this.embed(e,o);v?.("embed",G),G=performance.now(),le.applyInjections(S,o,r,e.length,i);let O=await Promise.all(Array.from({length:p},(_,y)=>this.layerWeightsGpu(y)));v?.("poids des couches",G),G=performance.now();let L=await this.getFinalNormGpu(),K=await this.getProjectionQ8(o);v?.("norme finale + tete de projection",G),G=performance.now();let x=await this.engine.decodeTopKQ8(S,w,O,r,L,t,K,this.projVocab,n,s,a.config.finalLogitSoftcap??0);return v?.("forward + top-k",G),x}async debugHiddenPerLayer(e){let r=this.manifest,{d:t,nHeads:n,nKvHeads:s,headDim:i,ffn:a,blockCount:o,ropeTheta:u,rmsEps:c}=r.config,d={seq:e.length,d:t,nHeads:n,nKvHeads:s,headDim:i,ffn:a,ropeTheta:u,eps:c,...this.archFlags()};d.ropeFactors=await this.getRopeFactors()??void 0;let p=await this.embed(e,t),g=[];for(let m=0;m<o;m++)p=await this.engine.layerForward(p,d,await this.layerWeights(m),!0),g.push(Float32Array.from(p));return g}};le.timingOn=(()=>{try{return se("timing")==="1"}catch{return!1}})(),le.ropeNormOn=(()=>{try{return se("ropenorm")!=="0"}catch{return!0}})(),le.unpermOn=(()=>{try{return se("unperm")!=="0"}catch{return!0}})(),le.ropeFactorsOn=(()=>{try{return se("ropefactors")!=="0"}catch{return!0}})();Ge=le});var Le,nt,pr=ae(()=>{"use strict";gt();Tt();Ft();Le=class Le extends Ge{constructor(r,t,n){super(r,t,n);this.kv=new Map;this.kvSession=""}async mat(r,t,n){let s=this.manifest.tensors[r],i=t??await this.rawTensor(r),a=n??s.nElems;if(this.engine.kqOk&&!Le.q4Requant&&s.shape[0]%256===0&&(s.type==="Q4_K"||s.type==="Q6_K"&&Le.q6Native))return this.engine.uploadKq(s.type,i);let u=this.engine.dequantizeToGpu(s.type,i,a),c=Le.q4Requant&&(s.type==="Q4_K"||s.type==="Q4_0"||s.type==="Q4_1")?this.engine.f32ToQ4Gpu(u,a):this.engine.f32ToQ8Gpu(u,a);return u.destroy?.(),c}up(r){return this.engine.uploadGpu(r)}layerBytes(r){let t=new Array(r).fill(0);for(let[n,s]of Object.entries(this.manifest.tensors)){let i=n.match(/^blk\.(\d+)\./);i&&Number(i[1])<r&&(t[Number(i[1])]+=s.bytes)}return t}dropLayerBytes(r){for(let t of this.rawCache.keys())t.startsWith(`blk.${r}.`)&&this.rawCache.delete(t);this.layerSpan.delete(r)}async embed(r,t){if(this.manifest.tensors["token_embd.weight"].type!=="Q6_K")return super.embed(r,t);let s=await this.rawTensor("token_embd.weight"),i=t/256*210,a=this.manifest.config.embedScale??1,o=new Float32Array(r.length*t);for(let u=0;u<r.length;u++){let c=et(s.subarray(r[u]*i,(r[u]+1)*i),t/256);for(let l=0;l<t;l++)o[u*t+l]=c[l]*a}return o}async getProjectionQ8(r){if(this.projQ8)return this.projQ8;let t=this.manifest.tensors["token_embd.weight"];if(t.type!=="Q6_K"||this.manifest.tensors["output.weight"])return super.getProjectionQ8(r);let n=t.nElems/r;this.projVocab=n;let s=await this.rawTensor("token_embd.weight"),i=r/256*210;if(this.engine.kqOk&&!Le.q4Requant&&Le.q6Native){let u=Math.max(1,Math.floor(this.engine.maxStorageBufferBindingSize*.9/i)),c=[];for(let l=0;l<n;l+=u){let d=Math.min(u,n-l);c.push({w:this.engine.uploadKq("Q6_K",s.subarray(l*i,(l+d)*i)),rows:d,r0:l})}return this.projQ8=c,c}let a=Math.max(1,Math.floor(Math.min(this.engine.maxStorageBufferBindingSize*.9,256<<20)/(r*4))),o=[];for(let u=0;u<n;u+=a){let c=Math.min(a,n-u),l=this.engine.dequantizeToGpu("Q6_K",s.subarray(u*i,(u+c)*i),c*r);o.push({w:this.engine.f32ToQ8Gpu(l,c*r),rows:c,r0:u}),l.destroy?.(),await this.engine.settleGpu()}return this.projQ8=o,o}ensureKv(r,t,n){let s=this.kv.get(r);if(s&&s.cap>=t)return s;let i=Math.max(t,(s?.cap??0)+1024,1024),a=globalThis,o=()=>this.engine.device.createBuffer({size:i*n*4,usage:a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST|a.GPUBufferUsage.COPY_SRC}),u=o(),c=o();if(s){let d=this.engine.device.createCommandEncoder();d.copyBufferToBuffer(s.k,0,u,0,s.cap*n*4),d.copyBufferToBuffer(s.v,0,c,0,s.cap*n*4),this.engine.device.queue.submit([d.finish()]),s.k.destroy?.(),s.v.destroy?.()}let l={k:u,v:c,cap:i};return this.kv.set(r,l),l}resetState(){for(let r of this.kv.values())r.k.destroy?.(),r.v.destroy?.();this.kv.clear(),this.kvSession=""}reset(){this.resetState(),super.reset()}async prepare(r,t,n){(n!==this.kvSession||t===0)&&(this.resetState(),this.kvSession=n);let{d:s}=this.manifest.config,[i,a,o]=await Promise.all([this.embed(r,s),this.prepareInputs(r),this.getProjectionQ8(s)]);return await this.getFinalNormGpu(),{embeds:i,extra:a,tiles:o}}async topKKV(r,t,n,s,i){let a=this.engine,o=globalThis,u=64,{embeds:c,extra:l,tiles:d}=await this.prepare(r,t,n),{d:p}=this.manifest.config,g=this.projVocab,m=[],w=a.device.createCommandEncoder(),v=this.recordForward(w,m,c,l,r.length,t),G=a.storage(g*4);m.push(G);for(let _ of d){let y=a.recMM(w,m,v,_.w,1,p,_.rows,!1);w.copyBufferToBuffer(y,0,G,_.r0*4,_.rows*4)}let S=this.manifest.config.finalLogitSoftcap??0;if(S>0){let _=a.uniform([g],{offset:4,value:S});a.recordPass(w,"softcap_logits",[_,G],a.grid1D(g)),m.push(_)}if(i&&i!==1&&s.length){let _=Uint32Array.from(s),y=a.storage(Math.max(16,_.byteLength));m.push(y),a.device.queue.writeBuffer(y,0,_);let h=a.uniform([_.length],{offset:4,value:i});a.recordPass(w,"penalize_logits",[h,y,G],a.grid1D(_.length)),m.push(h)}let O=a.storage(u*2*4);m.push(O);let L=a.uniform([g,u]);m.push(L),a.recordPass(w,a.topKParOk?"top_k_par":"top_k",[L,G,O],[1,1,1]);let K=a.device.createBuffer({size:u*2*4,usage:o.GPUBufferUsage.COPY_DST|o.GPUBufferUsage.MAP_READ});w.copyBufferToBuffer(O,0,K,0,u*2*4),a.device.queue.submit([w.finish()]),await K.mapAsync(o.GPUMapMode.READ);let x=new Uint32Array(K.getMappedRange().slice(0));return K.unmap(),K.destroy(),a.release(m),{ids:x.slice(0,u),vals:new Float32Array(x.buffer,u*4,u)}}async logitsKV(r,t,n){let s=this.engine,i=Ge.timingOn?(S,O)=>console.info(`[timing:graph] ${S} ${(performance.now()-O).toFixed(1)} ms`):null,a=performance.now(),{embeds:o,extra:u,tiles:c}=await this.prepare(r,t,n);i?.("pr\xE9paration CPU",a),a=performance.now();let{d:l}=this.manifest.config,d=this.projVocab,p=[],g=s.device.createCommandEncoder(),m=this.recordForward(g,p,o,u,r.length,t),w=s.storage(d*4);p.push(w);for(let S of c){let O=s.recMM(g,p,m,S.w,1,l,S.rows,!1);g.copyBufferToBuffer(O,0,w,S.r0*4,S.rows*4)}i?.(`enregistrement (${p.length} buffers)`,a),a=performance.now(),s.device.queue.submit([g.finish()]);let v=await s.readBack(w,d*4);i?.("GPU (submit \u2192 readback)",a),s.release(p);let G=this.manifest.config.finalLogitSoftcap??0;if(G>0)for(let S=0;S<v.length;S++)v[S]=G*Math.tanh(v[S]/G);return v}};Le.q4Requant=(()=>{try{return se("q4req")==="1"}catch{return!1}})(),Le.q6Native=(()=>{try{return se("q6k")==="1"}catch{return!1}})();nt=Le});var An,jt,_n=ae(()=>{"use strict";gt();Tt();rt();pr();An="per_layer_token_embd.weight",jt=class extends nt{constructor(r,t,n){super(r,t,n);this.layers=[];this.ones256=null;this.ones512=null;this.ropeFf=null;this.pleNormW=null;this.pleChunks=new Map;this.pleProjCache=null;if(!n.config.gemma4)throw new Error("Gemma4Model : manifeste sans config gemma4")}get g4(){return this.manifest.config.gemma4}async loadLayer(r){await this.ensureLayerSpan(r);let t=`blk.${r}`,n=r<this.g4.nLayerKv,s=async _=>this.up(await this.dequant(`${t}.${_}.weight`)),[i,a,o,u,c,l,d]=await Promise.all([s("attn_norm"),s("attn_q_norm"),n?s("attn_k_norm"):Promise.resolve(void 0),s("post_attention_norm"),s("ffn_norm"),s("post_ffw_norm"),s("post_norm")]),p=this.manifest.tensors[`${t}.layer_output_scale.weight`]?(await this.dequant(`${t}.layer_output_scale.weight`))[0]:1,g=await this.mat(`${t}.attn_q.weight`),m=n?await this.mat(`${t}.attn_k.weight`):void 0,w=n&&this.manifest.tensors[`${t}.attn_v.weight`]?await this.mat(`${t}.attn_v.weight`):void 0,v=await this.mat(`${t}.attn_output.weight`),G=await this.mat(`${t}.ffn_gate.weight`),S=await this.mat(`${t}.ffn_up.weight`),O=await this.mat(`${t}.ffn_down.weight`),L=await this.mat(`${t}.inp_gate.weight`),K=await this.mat(`${t}.proj.weight`),x=await this.pleProjection(r);return this.dropLayerBytes(r),{attnNorm:i,qNorm:a,kNorm:o,postAttnNorm:u,ffnNorm:c,postFfnNorm:l,postNorm:d,wq:g,wk:m,wv:w,wo:v,wgate:G,wup:S,wdown:O,inpGate:L,proj:K,wPle:x,outScale:p}}async pleProjection(r){let t="per_layer_model_proj.weight",n=this.manifest.tensors[t],{d:s}=this.manifest.config,i=this.g4.perLayer;this.pleProjCache||(this.pleProjCache=await this.rawTensor(t));let a=this.pleProjCache,o=i*s,u=new Float32Array(o),c=1/Math.sqrt(s);if(n.type==="BF16"){let p=new Uint16Array(a.buffer,a.byteOffset+r*o*2,o),g=new Uint32Array(u.buffer);for(let m=0;m<o;m++)g[m]=p[m]<<16;for(let m=0;m<o;m++)u[m]*=c}else if(n.type==="F32"){u.set(new Float32Array(a.buffer.slice(a.byteOffset+r*o*4,a.byteOffset+(r+1)*o*4)));for(let p=0;p<o;p++)u[p]*=c}else throw new Error(`Gemma 4 : per_layer_model_proj en ${n.type} non g\xE9r\xE9 (BF16/F32 attendus)`);let l=this.up(u),d=this.engine.f32ToQ8Gpu(l,o);return l.destroy?.(),d}async prewarmGpu(r){if(!this.engine.gemma4Ok)throw new Error("Gemma 4 indisponible sur ce GPU (selfValidate, ou ?gemma4=0).");let{blockCount:t,d:n}=this.manifest.config,s=this.layerBytes(t),i=s.reduce((c,l)=>c+l,0),a=0;this.ones256=this.up(new Float32Array(this.g4.headDimSwa).fill(1)),this.ones512=this.up(new Float32Array(this.manifest.config.headDim).fill(1));let o=this.manifest.tensors["rope_freqs.weight"]?await this.dequant("rope_freqs.weight"):new Float32Array(this.manifest.config.headDim/2).fill(1);this.ropeFf=this.up(o);let u=await this.dequant("per_layer_proj_norm.weight");this.pleNormW=this.up(u.map(c=>c*Math.SQRT1_2));for(let c=0;c<t;c++)this.layers[c]=await this.loadLayer(c),await this.engine.settleGpu(),a+=s[c],r?.(a,i);this.pleProjCache=null,this.rawCache.delete("per_layer_model_proj.weight"),await this.getFinalNormGpu(),await this.getProjectionQ8(n),await this.engine.settleGpu()}async pleChunk(r){let t=this.pleChunks.get(r);if(t)return this.pleChunks.delete(r),this.pleChunks.set(r,t),t;let n=this.manifest.tensors[An],s=r*qe,i=await this.source.bytes(n.offset+s,Math.min(qe,n.bytes-s));return this.pleChunks.set(r,i),this.pleChunks.size>32&&this.pleChunks.delete(this.pleChunks.keys().next().value),i}async pleRow(r){let t=this.manifest.tensors[An],n=t.shape[0];if(t.type!=="Q6_K")throw new Error(`Gemma 4 : table PLE en ${t.type} non g\xE9r\xE9e (Q6_K attendu)`);let s=n/256*210,i=r*s,a=Math.floor(i/qe),o=Math.floor((i+s-1)/qe),u;if(a===o)u=(await this.pleChunk(a)).subarray(i-a*qe,i-a*qe+s);else{let d=await this.pleChunk(a),p=await this.pleChunk(o);u=new Uint8Array(s);let g=o*qe-i;u.set(d.subarray(i-a*qe),0),u.set(p.subarray(0,s-g),g)}let c=et(u,n/256),l=Math.sqrt(this.g4.perLayer)*Math.SQRT1_2;for(let d=0;d<c.length;d++)c[d]*=l;return c}async pleInputs(r){let t=this.manifest.config.blockCount,n=this.g4.perLayer,s=r.length,i=new Float32Array(t*s*n);for(let a=0;a<s;a++){let o=await this.pleRow(r[a]);for(let u=0;u<t;u++)i.set(o.subarray(u*n,(u+1)*n),(u*s+a)*n)}return i}prepareInputs(r){return this.pleInputs(r)}unload(){this.resetState();for(let r of this.layers)for(let t of Object.values(r))typeof t!="number"&&Ge.destroyWeight(t);this.layers=[];for(let r of[this.ones256,this.ones512,this.ropeFf,this.pleNormW])r?.destroy?.();this.pleChunks.clear(),super.unload()}recordForward(r,t,n,s,i,a,o,u){let c=this.engine,l=this.manifest.config,d=this.g4,{d:p,nHeads:g,nKvHeads:m,ffn:w,rmsEps:v}=l,G=d.perLayer,S=a+i,O=h=>{let k=c.storage(h.byteLength);return c.device.queue.writeBuffer(k,0,h),t.push(k),k},L=O(n),K=L,x=O(s);for(let h=0;h<l.blockCount;h++){let k=t.length,b=this.layers[h],A=(J,re,ie)=>(u&&u.layer===h&&u.out.set(J,{buf:re,cols:ie}),re),P=d.swa[h],B=P?d.headDimSwa:l.headDim,U=P?d.ropeThetaSwa:l.ropeTheta,q=g*B,T=m*B,j=(J,re,ie)=>P?c.recRope(r,t,J,re,B,ie,a,U,!1):c.recRopeFactors(r,t,J,this.ropeFf,re,B,ie,a,U,!1),F=c.storage(i*G*4);t.push(F),r.copyBufferToBuffer(x,h*i*G*4,F,0,i*G*4);let R=c.recRmsnorm(r,t,c.recMM(r,t,K,b.wPle,i,p,G,!1),this.pleNormW,i,G,v),H=A("inp_per_layer (permuted) (cont) (view)",c.recBinary(r,t,"add",R,F,i*G),G);h===0&&A("inp_scaled",L,p);let Q=A(`attn_norm-${h}`,c.recRmsnorm(r,t,L,b.attnNorm,i,p,v),p),N=c.recMM(r,t,Q,b.wq,i,p,q,!1);N=j(c.recRmsnorm(r,t,N,b.qNorm,i*g,B,v),i*g,g);let V=d.kvSrc[h],$=this.ensureKv(V,S,T);if(V===h){let J=c.recMM(r,t,Q,b.wk,i,p,T,!1),re=b.wv?c.recMM(r,t,Q,b.wv,i,p,T,!1):J,ie=j(c.recRmsnorm(r,t,J,b.kNorm,i*m,B,v),i*m,m),ue=c.recRmsnorm(r,t,re,P?this.ones256:this.ones512,i*m,B,v);r.copyBufferToBuffer(ie,0,$.k,a*T*4,i*T*4),r.copyBufferToBuffer(ue,0,$.v,a*T*4,i*T*4)}let C=A(`kqv_out-${h}`,c.recAttention(r,t,N,$.k,$.v,i,g,m,B,S,a,1,0,P?d.window:0),q),M=c.recRmsnorm(r,t,c.recMM(r,t,C,b.wo,i,q,p,!1),b.postAttnNorm,i,p,v),D=A(`attn_out-${h}`,c.recBinary(r,t,"add",M,L,i*p),p),E=c.recRmsnorm(r,t,D,b.ffnNorm,i,p,v),W=c.recBinary(r,t,"geglu",c.recMM(r,t,E,b.wgate,i,p,w,!1),c.recMM(r,t,E,b.wup,i,p,w,!1),i*w),Y=c.recRmsnorm(r,t,A(`ffn_out-${h}`,c.recMM(r,t,W,b.wdown,i,w,p,!1),p),b.postFfnNorm,i,p,v),I=A(`pe_in-${h}`,c.recBinary(r,t,"add",Y,D,i*p),p),z=c.recBinary(r,t,"geglu",c.recMM(r,t,I,b.inpGate,i,p,G,!1),H,i*G),X=A(`per_layer_embd_out-${h}`,c.recRmsnorm(r,t,c.recMM(r,t,z,b.proj,i,G,p,!1),b.postNorm,i,p,v),p),te=c.recBinary(r,t,"add",I,X,i*p);L=b.outScale!==1?c.recScale(r,t,te,b.outScale,i*p):te,A(`l_out-${h}`,L,p),o?.push(L),!o&&!u&&c.recycleStorage(t.slice(k).filter(J=>J!==L))}let _=c.recRmsnorm(r,t,L,this.finalNormGpu,i,p,v),y=c.storage(p*4);return t.push(y),r.copyBufferToBuffer(_,(i-1)*p*4,y,0,p*4),y}async debugLayerOutputs(r){let t=this.engine,{embeds:n,extra:s}=await this.prepare(r,0,"debug-layers"),{d:i}=this.manifest.config,a=[],o=[],u=t.device.createCommandEncoder();this.recordForward(u,a,n,s,r.length,0,o),t.device.queue.submit([u.finish()]);let c=[];for(let l of o)c.push(await t.readBack(l,r.length*i*4));return t.release(a),c}async debugLayerSteps(r,t){let n=this.engine,{embeds:s,extra:i}=await this.prepare(r,0,"debug-steps"),a=[],o={layer:t,out:new Map},u=n.device.createCommandEncoder();this.recordForward(u,a,s,i,r.length,0,void 0,o),n.device.queue.submit([u.finish()]);let c=new Map;for(let[l,{buf:d,cols:p}]of o.out)c.set(l,{data:await n.readBack(d,r.length*p*4),cols:p});return n.release(a),c}}});var Kt,Pn=ae(()=>{"use strict";gt();pr();Kt=class extends nt{constructor(r,t,n){super(r,t,n);this.layers=[];this.convState=new Map;this.ssmState=new Map;if(!n.config.qwen35)throw new Error("Qwen35Model : manifeste sans config qwen35")}get q(){return this.manifest.config.qwen35}get nLayer(){return this.q.nLayer}isRecurrent(r){return(r+1)%this.q.fullAttnInterval!==0}get ssm(){let r=this.q.dState,t=this.q.nGroup,n=this.q.dtRank;return{S:r,Hk:t,Hv:n,kOff:t*r,vOff:2*t*r,C:2*t*r+n*r,dInner:n*r}}async splitQGate(r){let t=this.manifest.tensors[r],n=await this.rawTensor(r),{nHeads:s,headDim:i,d:a}=this.manifest.config,o=2*s*i,u=n.byteLength/o;if(!Number.isInteger(u))throw new Error(`${r} : lignes non uniformes`);let c=new Uint8Array(s*i*u),l=new Uint8Array(s*i*u);for(let p=0;p<s;p++){let g=p*2*i*u,m=p*i*u,w=i*u;c.set(n.subarray(g,g+w),m),l.set(n.subarray(g+w,g+2*w),m)}let d=s*i*a;return[await this.mat(r,c,d),await this.mat(r,l,d)]}async loadLayer(r){await this.ensureLayerSpan(r);let t=`blk.${r}`,n=async a=>this.up(await this.dequant(`${t}.${a}`)),s=this.isRecurrent(r),i={recurrent:s,attnNorm:await n("attn_norm.weight"),ffnNorm:await n("post_attention_norm.weight"),wgate:await this.mat(`${t}.ffn_gate.weight`),wup:await this.mat(`${t}.ffn_up.weight`),wdown:await this.mat(`${t}.ffn_down.weight`)};return s?(i.wqkv=await this.mat(`${t}.attn_qkv.weight`),i.wz=await this.mat(`${t}.attn_gate.weight`),i.walpha=await this.mat(`${t}.ssm_alpha.weight`),i.wbeta=await this.mat(`${t}.ssm_beta.weight`),i.conv=await n("ssm_conv1d.weight"),i.dt=await n("ssm_dt.bias"),i.A=await n("ssm_a"),i.ssmNorm=await n("ssm_norm.weight"),i.wout=await this.mat(`${t}.ssm_out.weight`)):([i.wq,i.wqGate]=await this.splitQGate(`${t}.attn_q.weight`),i.wk=await this.mat(`${t}.attn_k.weight`),i.wv=await this.mat(`${t}.attn_v.weight`),i.wo=await this.mat(`${t}.attn_output.weight`),i.qNorm=await n("attn_q_norm.weight"),i.kNorm=await n("attn_k_norm.weight")),this.dropLayerBytes(r),i}async prewarmGpu(r){if(!this.engine.qwen35SsmOk)throw new Error("Qwen 3.5 indisponible sur ce GPU (selfValidate, ou ?qwen35ssm=0).");let{d:t}=this.manifest.config,n=this.layerBytes(this.nLayer),s=n.reduce((a,o)=>a+o,0),i=0;for(let a=0;a<this.nLayer;a++)this.layers[a]=await this.loadLayer(a),await this.engine.settleGpu(),i+=n[a],r?.(i,s);await this.getFinalNormGpu(),await this.getProjectionQ8(t),await this.engine.settleGpu()}resetState(){super.resetState();for(let r of this.convState.values())r.destroy?.();for(let r of this.ssmState.values())r.destroy?.();this.convState.clear(),this.ssmState.clear()}zeroed(r){let t=globalThis;return this.engine.device.createBuffer({size:r,usage:t.GPUBufferUsage.STORAGE|t.GPUBufferUsage.COPY_DST|t.GPUBufferUsage.COPY_SRC})}prepareInputs(){return Promise.resolve(null)}unload(){this.resetState();for(let r of this.layers)for(let[t,n]of Object.entries(r))t!=="recurrent"&&Ge.destroyWeight(n);this.layers=[],super.unload()}recordForward(r,t,n,s,i,a){let o=this.engine,u=this.manifest.config,{d:c,nHeads:l,nKvHeads:d,headDim:p,ffn:g,rmsEps:m,ropeTheta:w}=u,{S:v,Hk:G,Hv:S,kOff:O,vOff:L,C:K,dInner:x}=this.ssm,_=a+i,y=d*p,h=l*p,k=o.storage(n.byteLength);t.push(k),o.device.queue.writeBuffer(k,0,n);for(let P=0;P<this.nLayer;P++){let B=t.length,U=this.layers[P],q=o.recRmsnorm(r,t,k,U.attnNorm,i,c,m),T;if(U.recurrent){let H=this.convState.get(P);H||(H=this.zeroed(3*K*4),this.convState.set(P,H));let Q=this.ssmState.get(P);Q||(Q=this.zeroed(S*v*v*4),this.ssmState.set(P,Q));let N=o.recMM(r,t,q,U.wqkv,i,c,K,!1),V=o.recMM(r,t,q,U.wz,i,c,x,!1),$=o.recMM(r,t,q,U.walpha,i,c,S,!1),C=o.recMM(r,t,q,U.wbeta,i,c,S,!1),M=o.recQwen35Conv(r,t,N,U.conv,H,i,K),D=o.recQwen35Gdn(r,t,M,$,C,U.dt,U.A,Q,i,S,G,v,K,O,L,m),E=o.recRmsnorm(r,t,D,U.ssmNorm,i*S,v,m),W=o.recBinary(r,t,"swiglu",V,E,i*x);T=o.recMM(r,t,W,U.wout,i,x,c,!1)}else{let H=o.recMM(r,t,q,U.wq,i,c,h,!1),Q=o.recMM(r,t,q,U.wqGate,i,c,h,!1),N=o.recMM(r,t,q,U.wk,i,c,y,!1),V=o.recMM(r,t,q,U.wv,i,c,y,!1);H=o.recRopePartial(r,t,o.recRmsnorm(r,t,H,U.qNorm,i*l,p,m),i*l,p,l,a,w,this.q.nRot);let $=o.recRopePartial(r,t,o.recRmsnorm(r,t,N,U.kNorm,i*d,p,m),i*d,p,d,a,w,this.q.nRot),C=this.ensureKv(P,_,y);r.copyBufferToBuffer($,0,C.k,a*y*4,i*y*4),r.copyBufferToBuffer(V,0,C.v,a*y*4,i*y*4);let M=o.recAttention(r,t,H,C.k,C.v,i,l,d,p,_,a,1/Math.sqrt(p),0,0),D=o.storage(i*h*4);t.push(D),o.recordPass(r,"sigmoid",[Q,D],o.grid1D(i*h)),T=o.recMM(r,t,o.recBinary(r,t,"mul",M,D,i*h),U.wo,i,h,c,!1)}let j=o.recBinary(r,t,"add",k,T,i*c),F=o.recRmsnorm(r,t,j,U.ffnNorm,i,c,m),R=o.recBinary(r,t,"swiglu",o.recMM(r,t,F,U.wgate,i,c,g,!1),o.recMM(r,t,F,U.wup,i,c,g,!1),i*g);k=o.recBinary(r,t,"add",j,o.recMM(r,t,R,U.wdown,i,g,c,!1),i*c),o.recycleStorage(t.slice(B).filter(H=>H!==k))}let b=o.recRmsnorm(r,t,k,this.finalNormGpu,i,c,m),A=o.storage(c*4);return t.push(A),r.copyBufferToBuffer(b,(i-1)*c*4,A,0,c*4),A}}});function xn(f){let e=f.metadata;if(String(e["tokenizer.ggml.model"]??"")!=="gemma4")return null;let r=e["tokenizer.ggml.tokens"],t=e["tokenizer.ggml.merges"];if(!Array.isArray(r)||!Array.isArray(t))return null;let n=e["tokenizer.ggml.token_type"]??[],s=c=>Number.isFinite(Number(c))&&c!==void 0?Number(c):null,i=s(e["tokenizer.ggml.bos_token_id"]),a=s(e["tokenizer.ggml.eos_token_id"]),o=new gr(r,n,t,i,!0),u=n.flatMap((c,l)=>c===3?[l]:[]);return{tokenizer:o,bosId:i,eosId:a,controlIds:u}}var gr,Un=ae(()=>{"use strict";gr=class{constructor(e,r,t,n,s){this.bosId=n;this.addBos=s;this.vocab=new Map;this.ranks=new Map;this.byteIds=new Int32Array(256).fill(-1);this.cache=new Map;this.pieces=e,this.types=r;for(let a=0;a<e.length;a++)this.vocab.set(e[a],a);t.forEach((a,o)=>{let u=a.indexOf(" ",1);u>0&&this.ranks.set(a.slice(0,u)+"\0"+a.slice(u+1),o)});for(let a=0;a<256;a++){let o=this.vocab.get(`<0x${a.toString(16).toUpperCase().padStart(2,"0")}>`);o!==void 0&&(this.byteIds[a]=o)}let i=e.filter((a,o)=>r[o]===3||r[o]===4).sort((a,o)=>o.length-a.length).map(a=>a.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"));this.specialRe=i.length?new RegExp(i.join("|"),"g"):null}encode(e){let r=[];this.addBos&&this.bosId!=null&&r.push(this.bosId);let t=0;if(this.specialRe){this.specialRe.lastIndex=0;for(let n=this.specialRe.exec(e);n;n=this.specialRe.exec(e))n.index>t&&this.encodeSegment(e.slice(t,n.index),r),r.push(this.vocab.get(n[0])),t=n.index+n[0].length}return t<e.length&&this.encodeSegment(e.slice(t),r),r}encodeSegment(e,r){let t=e.replace(/ /g,"\u2581");for(let n of t.match(/[^\n]+|\n+/g)??[]){let s=this.cache.get(n);if(s){r.push(...s);continue}let i=this.encodeWord(n);this.cache.size<2e4&&this.cache.set(n,i),r.push(...i)}}encodeWord(e){if(e[0]===`
`){let n=this.vocab.get(e);if(n!==void 0)return[n]}let r=Array.from(e);for(;r.length>1;){let n=-1,s=1/0;for(let i=0;i<r.length-1;i++){let a=this.ranks.get(r[i]+"\0"+r[i+1]);a!==void 0&&a<s&&(s=a,n=i)}if(n<0)break;r.splice(n,2,r[n]+r[n+1])}let t=[];for(let n of r){let s=this.vocab.get(n);if(s!==void 0){t.push(s);continue}for(let i of new TextEncoder().encode(n))this.byteIds[i]>=0&&t.push(this.byteIds[i])}return t}decode(e){let r=[],t=new TextEncoder;for(let n of e){let s=this.types[n]??1;if(s===3)continue;let i=this.pieces[n];if(i!==void 0){if(s===6){r.push(parseInt(i.slice(3,5),16));continue}for(let a of t.encode(s===4?i:i.replace(/▁/g," ")))r.push(a)}}return new TextDecoder("utf-8",{ignoreBOM:!0}).decode(new Uint8Array(r))}}});async function Et(f){let e=Math.min(f.size,104857600),t=await f.slice(0,e).arrayBuffer(),n=new mr(t),s=[String.fromCharCode(n.uint8()),String.fromCharCode(n.uint8()),String.fromCharCode(n.uint8()),String.fromCharCode(n.uint8())].join("");if(s!=="GGUF")throw new Error(`Fichier GGUF invalide. Sceau magique absent : ${s}`);let i=n.uint32();if(i!==2&&i!==3)throw new Error(`Version GGUF non support\xE9e : ${i}`);let a=n.uint64(),o=n.uint64(),u=b=>{switch(b){case 0:return n.uint8();case 1:return n.int8();case 2:return n.uint16();case 3:return n.int16();case 4:return n.uint32();case 5:return n.int32();case 6:return n.float32();case 7:return n.uint8()!==0;case 8:return n.string();case 9:{let A=n.uint32(),P=n.uint64(),B=[];for(let U=0;U<P;U++)B.push(u(A));return B}case 10:return n.uint64();case 11:return n.int64();case 12:return n.float64();default:throw new Error(`Type de m\xE9tadonn\xE9es non support\xE9 : ${b}`)}},c={};for(let b=0;b<o;b++){let A=n.string(),P=n.uint32(),B=u(P);c[A]=B}let l=c["general.alignment"]??32,d=c["general.architecture"]??"llama",p=[];for(let b=0;b<a;b++){let A=n.string(),P=n.uint32(),B=[];for(let T=0;T<P;T++)B.push(n.uint64());let U=n.uint32(),q=n.uint64();p.push({name:A,shape:B,typeIdx:U,relativeOffset:q})}let g=n.getOffset(),m=Math.ceil(g/l)*l,w={};for(let b=0;b<p.length;b++){let A=p[b],P=Xs[A.typeIdx]||"UNKNOWN",B=A.shape.reduce((q,T)=>q*T,1),U=0;if(b<p.length-1)U=p[b+1].relativeOffset-A.relativeOffset;else{let{block:q,size:T}=Js(P);U=B/q*T}w[A.name]={offset:m+A.relativeOffset,bytes:U,nElems:B,type:P,shape:A.shape}}let v=(b,A)=>{let P=c[`${d}.${b}`];return P!==void 0?Number(P):A},G=(b,A)=>{let P=c[`${d}.${b}`];return P!==void 0?Number(P):A},S=v("embedding_length",0),O=v("attention.head_count",0),L=v("attention.head_count_kv",O),K=v("block_count",0),x=G("rope.freq_base",1e4),_=G("attention.layer_norm_rms_epsilon",1e-5),y=v("attention.key_length",0)||(O>0?S/O:0),h=v("feed_forward_length",0),k={d:S,nHeads:O,nKvHeads:L,headDim:y,ffn:h,blockCount:K,ropeTheta:x,rmsEps:_};if(d==="rwkv7"||d==="rwkv6"){let b=v("wkv.head_size",64);k.headDim=b,k.nHeads=b>0?Math.floor(S/b):0,k.nKvHeads=k.nHeads,k.rwkv={headSize:b,decayLoraRank:v("attention.decay_lora_rank",64),iclrLoraRank:v("attention.iclr_lora_rank",64),valueLoraRank:v("attention.value_residual_mix_lora_rank",32),gateLoraRank:v("attention.gate_lora_rank",128)}}if(d==="lfm2"){let b=c["lfm2.attention.head_count_kv"],A=Array.isArray(b)?b.map(Number):[];k.nKvHeads=A.length?Math.max(...A):O,k.headDim=y||64,k.lfm2={lCache:v("shortconv.l_cache",3),kvHeadsPerLayer:A.length?A:Array(K).fill(k.nKvHeads)}}if(d==="qwen35"||d==="qwen3_5"){let b=v("full_attention_interval",4);k.qwen35={fullAttnInterval:b,dConv:v("ssm.conv_kernel",4),dInner:v("ssm.inner_size",2*S),dState:v("ssm.state_size",128),dtRank:v("ssm.time_step_rank",32),nGroup:v("ssm.group_count",16),nRot:v("rope.dimension_count",y),nLayer:K-v("nextn_predict_layers",0)}}if((d==="gemma"||d==="gemma2")&&(k.act="gelu",k.embedScale=Math.sqrt(S)),d==="gemma2"){k.attnLogitSoftcap=G("attn_logit_softcapping",50),k.finalLogitSoftcap=G("final_logit_softcapping",30);let b=v("attention.query_pre_attn_scalar",0);k.attnScale=b>0?1/Math.sqrt(b):y>0?1/Math.sqrt(y):void 0}{let b=c[`${d}.rope.scaling.type`],A=G("rope.scaling.factor",1);if(b==="yarn"&&A>1&&y>0){k.yarn={factor:A,betaFast:G("rope.scaling.yarn_beta_fast",32),betaSlow:G("rope.scaling.yarn_beta_slow",1),origCtx:v("rope.scaling.original_context_length",0)};let P=1+.1*Math.log(A);k.attnScale=P*P/Math.sqrt(y)}}if(d==="gemma3"){k.act="gelu",k.embedScale=Math.sqrt(S);let b=v("attention.sliding_window",512),A=v("attention.sliding_window_pattern",6)||6,P=G("rope.local_freq_base",1e4),B=U=>(U+1)%A===0;k.windowPerLayer=Array.from({length:K},(U,q)=>B(q)?0:b),k.ropeThetaPerLayer=Array.from({length:K},(U,q)=>B(q)?x:P)}if(d==="gemma4"){let b=c["gemma4.attention.sliding_window_pattern"],A=Array.isArray(b)&&b.length===K?b.map(U=>U===!0||U===1):Array.from({length:K},(U,q)=>(q+1)%6!==0),P=K-v("attention.shared_kv_layers",0),B=U=>{for(let q=P-1;q>=0;q--)if(A[q]===U)return q;return-1};k.act="gelu",k.embedScale=Math.sqrt(S),k.attnScale=1,k.finalLogitSoftcap=G("final_logit_softcapping",0)||void 0,k.gemma4={swa:A,headDimSwa:v("attention.key_length_swa",256),ropeThetaSwa:G("rope.freq_base_swa",1e4),window:v("attention.sliding_window",512),perLayer:v("embedding_length_per_layer_input",0),nLayerKv:P,kvSrc:Array.from({length:K},(U,q)=>q<P?q:B(A[q]))}}if(d==="smollm3"){let b=c[`${d}.no_rope_layers`],A=Array.isArray(b)?b.map(Number):[];k.skipRopePerLayer=A.length===K?A.map(P=>P===0):Array.from({length:K},(P,B)=>(B+1)%4===0)}if((d==="llama"||d==="mistral3"||d==="smollm3")&&(k.ropeInterleaved=!0),d==="qwen2vl"){let b=c["qwen2vl.rope.dimension_sections"],A=Array.isArray(b)?b.map(Number).filter(P=>P>0):[];k.mropeSections=A.length===3?A:[16,24,24]}return{arch:d,config:k,tensors:w,metadata:c}}var mr,Ys,Xs,Js,hr=ae(()=>{"use strict";mr=class{constructor(e){this.offset=0;this.view=new DataView(e)}getOffset(){return this.offset}setOffset(e){this.offset=e}uint8(){let e=this.view.getUint8(this.offset);return this.offset+=1,e}int8(){let e=this.view.getInt8(this.offset);return this.offset+=1,e}uint16(){let e=this.view.getUint16(this.offset,!0);return this.offset+=2,e}int16(){let e=this.view.getInt16(this.offset,!0);return this.offset+=2,e}uint32(){let e=this.view.getUint32(this.offset,!0);return this.offset+=4,e}int32(){let e=this.view.getInt32(this.offset,!0);return this.offset+=4,e}float32(){let e=this.view.getFloat32(this.offset,!0);return this.offset+=4,e}float64(){let e=this.view.getFloat64(this.offset,!0);return this.offset+=8,e}uint64(){let e=this.view.getUint32(this.offset,!0),r=this.view.getUint32(this.offset+4,!0);return this.offset+=8,e+r*4294967296}int64(){let e=this.view.getUint32(this.offset,!0),r=this.view.getInt32(this.offset+4,!0);return this.offset+=8,e+r*4294967296}string(){let e=this.uint64();if(this.offset+e>this.view.byteLength)throw new Error(`BinaryReader: string length ${e} exceeds buffer size`);let r=new Uint8Array(this.view.buffer,this.offset,e);return this.offset+=e,Ys.decode(r)}},Ys=new TextDecoder("utf-8",{ignoreBOM:!0}),Xs=["F32","F16","Q4_0","Q4_1","Q4_2","Q4_3","Q5_0","Q5_1","Q8_0","Q8_1","Q2_K","Q3_K","Q4_K","Q5_K","Q6_K","Q8_K","IQ2_XXS","IQ2_XS","IQ3_XXS","IQ1_S","IQ4_NL","IQ3_S","IQ2_S","IQ4_XS","I8","I16","I32","I64","F64","IQ1_M","BF16","Q4_0_4_4","Q4_0_4_8","Q4_0_8_8","TQ1_0","TQ2_0"],Js=f=>{switch(f){case"F32":return{block:1,size:4};case"F16":return{block:1,size:2};case"Q4_0":return{block:32,size:18};case"Q4_1":return{block:32,size:20};case"Q5_0":return{block:32,size:22};case"Q5_1":return{block:32,size:24};case"Q8_0":return{block:32,size:34};case"Q2_K":return{block:256,size:66};case"Q3_K":return{block:256,size:110};case"Q4_K":return{block:256,size:144};case"Q5_K":return{block:256,size:176};case"Q6_K":return{block:256,size:210};case"Q8_K":return{block:256,size:288};default:throw new Error(`Type GGML non support\xE9 : ${f}. Types lus : F32, F16, Q4_0/1, Q5_0/1, Q8_0, Q2_K\u2026Q8_K.`)}}});function Bn(f,e=16){return Math.ceil(f/e)*e}function ri(f){if(f.length>128||f.includes(".."))return!1;let e=f.split("/");return e.length<=2&&e.every(r=>ti.test(r))}function qn(f){let e=i=>{throw new Error(`BRIK: manifeste invalide \u2014 ${i}`)};(!f||typeof f!="object")&&e("ce n'est pas un objet"),f.format!=="brik"&&e(`champ format \xAB ${String(f.format)} \xBB (attendu \xAB brik \xBB)`),(!He(f.version,1024)||f.version<1)&&e(`version ${String(f.version)}`),(!f.model||typeof f.model.name!="string"||f.model.name.length>512)&&e("champ model.name");let r=f.arch;(!r||typeof r!="object"||typeof r.arch!="string"||r.arch.length>64)&&e("champ arch.arch");for(let[i,a]of[["d",262144],["nHeads",4096],["nKvHeads",4096],["headDim",4096],["ffn",1048576],["blockCount",1024],["vocab",1e7]])He(r[i],a)||e(`arch.${i} = ${String(r[i])}`);for(let i of["ropeTheta","rmsEps"])(typeof r[i]!="number"||!Number.isFinite(r[i]))&&e(`arch.${i} = ${String(r[i])}`);f.tokenizer&&(f.tokenizer.kind!=="hf-hub"&&f.tokenizer.kind!=="embedded"&&e(`tokenizer.kind \xAB ${String(f.tokenizer.kind)} \xBB`),f.tokenizer.id&&!ri(f.tokenizer.id)&&e(`tokenizer.id \xAB ${f.tokenizer.id} \xBB (attendu : \xAB auteur/d\xE9p\xF4t \xBB ou une sentinelle sans barre oblique)`)),(!Array.isArray(f.shards)||f.shards.length===0||f.shards.length>Gn)&&e(`${Array.isArray(f.shards)?f.shards.length:"aucun"} shard`);let t=new Map;for(let i of f.shards)He(i.id,Gn)||e(`shard.id = ${String(i.id)}`),t.has(i.id)&&e(`shard ${i.id} d\xE9clar\xE9 deux fois`),(typeof i.file!="string"||i.file.length>256)&&e(`shard.file du shard ${i.id}`),He(i.byteLength,Ht)||e(`shard.byteLength du shard ${i.id} = ${String(i.byteLength)}`),t.set(i.id,i.byteLength);(!f.tensors||typeof f.tensors!="object")&&e("champ tensors");let n=Object.keys(f.tensors);(n.length===0||n.length>Zs)&&e(`${n.length} tenseurs`);let s=0;for(let i of n){let a=f.tensors[i];(!a||typeof a!="object")&&e(`tenseur ${i}`),ei.includes(a.dtype)||e(`dtype \xAB ${String(a.dtype)} \xBB du tenseur ${i}`),(!Array.isArray(a.shape)||a.shape.length>8||!a.shape.every(u=>He(u,2**32)))&&e(`shape du tenseur ${i}`),He(a.nElems,2**40)||e(`nElems du tenseur ${i}`),(!He(a.offset,Ht)||!He(a.byteLength,Ht))&&e(`offset/byteLength du tenseur ${i}`);let o=t.get(a.shard);o===void 0&&e(`le tenseur ${i} r\xE9f\xE9rence le shard ${String(a.shard)}, absent du manifeste`),a.offset+a.byteLength>o&&e(`le tenseur ${i} d\xE9passe son shard (${a.offset}+${a.byteLength} > ${o})`),s+=a.byteLength}return s>Ht&&e(`${s} octets de tenseurs au total`),f}var Gn,Zs,Ht,ei,ti,He,Sn=ae(()=>{"use strict";Gn=4096,Zs=2e5,Ht=64*1024*1024*1024,ei=["f16","f32","q4","q8","q3"],ti=/^[A-Za-z0-9._-]+$/;He=(f,e)=>typeof f=="number"&&Number.isInteger(f)&&f>=0&&f<=e});function si(f){return Bn(mt+f)}function br(f){if(f.length<mt)throw new Error("BRIK: fichier tronqu\xE9 (en-t\xEAte)");let e=String.fromCharCode(f[0],f[1],f[2],f[3]);if(e!==ni)throw new Error(`BRIK: sceau magique absent (${e})`);let r=new DataView(f.buffer,f.byteOffset,f.byteLength),t=r.getUint32(4,!0),n=r.getUint32(8,!0);if(mt+n>f.length)throw new Error("BRIK: manifeste tronqu\xE9");return{manifest:qn(JSON.parse(new TextDecoder().decode(f.subarray(mt,mt+n)))),version:t,dataStart:si(n)}}function Fn(f){let{manifest:e,version:r,dataStart:t}=br(f);return{manifest:e,version:r,dataStart:t,data:f.subarray(t)}}var ni,mt,On=ae(()=>{"use strict";Sn();ni="BRIK",mt=12});function Mn(f){let e=[...f].sort((n,s)=>n.id-s.id),r=[],t=0;for(let n of e)r[n.id]=t,t+=n.byteLength;return r}function Tn(f){let e=Mn(f.shards),r={};for(let[n,s]of Object.entries(f.tensors)){let i=ii[s.dtype];if(!i)throw new Error(`dtype BRIK inconnu pour ${n} : ${s.dtype}`);if(e[s.shard]===void 0)throw new Error(`shard ${s.shard} absent du manifeste (tenseur ${n})`);r[n]={offset:e[s.shard]+s.offset,bytes:s.byteLength,nElems:s.nElems,type:i,shape:s.shape}}let t=f.arch;return{arch:t.arch,config:{d:t.d,nHeads:t.nHeads,nKvHeads:t.nKvHeads,headDim:t.headDim,ffn:t.ffn,blockCount:t.blockCount,ropeTheta:t.ropeTheta,rmsEps:t.rmsEps,attnLogitSoftcap:t.attnLogitSoftcap,finalLogitSoftcap:t.finalLogitSoftcap,attnScale:t.attnScale,act:t.act,rmsGainOnePlus:t.rmsGainOnePlus,embedScale:t.embedScale,rwkv:t.rwkv,lfm2:t.lfm2},tensors:r}}var ii,Cn=ae(()=>{"use strict";ii={f16:"F16",f32:"F32",q4:"Q4W",q8:"Q8W",q3:"Q3W"}});function ui(f){return ai[f]}async function ci(f){let e=f.slice();return oi(await crypto.subtle.digest("SHA-256",e.buffer))}async function vr(f,e){let r=ui(f);if(!r)return;if(typeof crypto>"u"||!crypto.subtle){console.warn("[int\xE9grit\xE9] crypto.subtle indisponible (contexte non s\xE9curis\xE9) : empreinte du manifeste NON v\xE9rifi\xE9e.");return}let t=await ci(e);if(t!==r)throw console.error(`[int\xE9grit\xE9] manifeste inattendu pour ${f}
  attendu : ${r}
  obtenu  : ${t}`),new Error("Ce mod\xE8le ne correspond pas \xE0 celui que Brimkern publie : son manifeste a une empreinte diff\xE9rente de celle attendue. Chargement refus\xE9. Si tu viens de t\xE9l\xE9verser une nouvelle version, relance `npm run brik:digest`.")}var ai,oi,Rn=ae(()=>{"use strict";ai={"https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik":"aca6214b45c294c1d4c51c46aa23acc22cc53cb95a6894c62d2bd0570ca12afe","https://huggingface.co/romainkh14/Qwen2.5-0.5B-Instruct_BRIK/resolve/main/qwen2.5-0.5b-instruct-mixed.brik":"315d2a1cc17b64b029eb24e9668e5c959fd151ae926c9758bddc6a8193e52f6d","https://huggingface.co/romainkh14/Qwen3-4B_BRIK/resolve/main/qwen3-4b-q4.brik":"23f9c0cc66ec21056e656bdaa5cbfda2e93673718ea3ab0dfad19c6e7f583f7d","https://huggingface.co/romainkh14/RWKV-7-G1-0.1B_BRIK/resolve/main/rwkv7-g1-0.1b-q4.brik":"bb8d211e1f95af415b7dca8b0b074c236ebe9d0844f1f372c11eecbcf15fb372","https://huggingface.co/romainkh14/RWKV-7-G1a-0.4B_BRIK/resolve/main/rwkv7-g1a-0.4b-q4.brik":"47e67144bb9dcd41918f3117aa6ee21420ff94f93289c338d8331620d3153b10","https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main/sd-turbo-clip-mixed.brik":"b873aaad23ca70d4e29c0350d124fd6ee0a18470aaf59719f14c9eb9f227b3ac","https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main/sd-turbo-clip-q8.brik":"b3e05c74f8f0327e878787100224983a454e4228d2ae008902875a6256fb2bae","https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main/sd-turbo-unet-q8.brik":"ca3a5c21512542656a8a736c88f67d37a482cacbf499a080c9bf32ca36bf6b0f","https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main/sdxs-unet-light.brik":"42f7c0e82971a558d56548edec947b1ed7d9c0e509d634b51fc29429177e7654","https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main/video-clip-q8.brik":"e81ca57426716237dce2853703c70172a829f78704b7df77c9ee980534c82a76","https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main/video-motion-q8.brik":"e976e13a5bc0858b8277eefed59cc0d77239b5a30ecae68d483e24eb983ae481","https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main/video-unet-q8.brik":"d112b2884afcd038cdbd90bb62ce6b248b404852fb9ce20003b8585927a362b9"},oi=f=>[...new Uint8Array(f)].map(e=>e.toString(16).padStart(2,"0")).join("")});function wr(f,e,r){return`${f}${f.includes("?")?"&":"?"}__brik=${e}-${r}`}async function Kn(){try{return await caches.open(li)}catch{return null}}async function ze(f,e,r,t){let n=e+r-1,s=await Kn(),i=wr(f,e,n);if(s){let o=await s.match(i);if(o)return{bytes:new Uint8Array(await o.arrayBuffer()),ranged:!0}}let a;for(let o=0;o<4;o++)try{let u=await fetch(f,{headers:{Range:`bytes=${e}-${n}`},signal:t});if(!u.ok&&u.status!==206)throw new Error(`range fetch ${e}-${n} \xE9chou\xE9 : HTTP ${u.status}`);let c=u.status===206,l=new Uint8Array(await u.arrayBuffer()),d=c?l:l.subarray(e,e+r);if(s&&c)try{await s.put(i,new Response(d,{headers:{"Content-Length":String(d.byteLength)}}))}catch(p){En(p)}return{bytes:d,ranged:c}}catch(u){if(t?.aborted)throw u;a=u,o<3&&await new Promise(c=>setTimeout(c,500*2**o))}throw a instanceof Error?a:new Error(String(a))}function En(f){Ln||(Ln=!0,console.warn("[cache] \xE9criture refus\xE9e (quota plein ? navigation priv\xE9e ?) : les t\xE9l\xE9chargements de mod\xE8les ne seront PAS r\xE9utilisables \xE0 la prochaine visite. Lib\xE9rez de l'espace via le panneau Stockage.",f))}async function kr(f){try{let n=await(await caches.open(yr)).match(f);if(n)return new Uint8Array(await n.arrayBuffer())}catch{}let e=await fetch(f);if(!e.ok)throw new Error(`HTTP ${e.status}`);let r=new Uint8Array(await e.arrayBuffer());try{await(await caches.open(yr)).put(f,new Response(r.slice(),{headers:{"Content-Length":String(r.byteLength)}}))}catch(t){En(t)}return r}function Ar(f,e){return{bytes:async(r,t)=>(await ze(f,e+r,t)).bytes}}function fi(f){return{bytes:async(e,r)=>f.subarray(e,e+r)}}async function Hn(f){let e=await ze(f,0,12);if(!e.ranged){let i=await kr(f),{manifest:a,data:o}=Fn(i);return await vr(f,Dn(i)),jn(a,fi(o))}let r=new DataView(e.bytes.buffer,e.bytes.byteOffset,12).getUint32(8,!0),t=await ze(f,0,12+r),{manifest:n,dataStart:s}=br(t.bytes);return await vr(f,Dn(t.bytes)),jn(n,Ar(f,s))}function Dn(f){let e=new DataView(f.buffer,f.byteOffset,12).getUint32(8,!0);return f.subarray(12,12+e)}function jn(f,e){if(f.model?.uiArch==="image")throw new Error("Ce fichier est un BRIK image (UNet/CLIP) : il se charge via la tuile de g\xE9n\xE9ration d'image, pas comme un LLM.");return{source:e,manifest:Tn(f),tokenizerId:f.tokenizer?.id,tokenizer:f.tokenizer,uiArch:f.model?.uiArch,modelName:f.model.name}}async function zn(f,e){return await di(f)||!(await ze(f,0,12,e)).ranged?null:{manifest:await Nn(f,e),source:Ar(f,0)}}async function di(f){try{return!!await(await caches.open(yr)).match(f)}catch{return!1}}async function Nn(f,e){let r=Ar(f,0),t;for(let n=8*1024*1024;n<=128*1024*1024;n*=2)try{let s=await r.bytes(0,n);return await Et(new Blob([s.slice()]))}catch(s){if(e?.aborted)throw s;t=s}throw t instanceof Error?t:new Error("en-t\xEAte GGUF illisible par plages")}function pi(f,e){let r=new Map,t=[];for(let[n,s]of Object.entries(f.tensors)){let i=n.match(/^blk\.(\d+)\./);if(i){let a=r.get(i[1]);a||r.set(i[1],a=[]),a.push(s)}else if(wn.has(n))for(let a of yn(s))t.push({off:e+a.off,len:a.len});else t.push({off:e+s.offset,len:s.bytes})}for(let n of r.values()){let s=tt(n);if(s)t.push({off:e+s.start,len:s.end-s.start});else for(let i of n)t.push({off:e+i.offset,len:i.bytes})}return t}async function gi(f,e){let r=await Kn();return!r||!(await ze(f,0,12,e)).ranged?null:{cache:r,ranges:pi(await Nn(f,e),0)}}async function Qn(f,e,r){return mi(f,await gi(f,r),e,r)}async function mi(f,e,r,t){if(!e)return"unstorable";let{cache:n,ranges:s}=e;s.sort((g,m)=>g.off-m.off);let i=s.reduce((g,m)=>g+m.len,0),a=await Promise.all(s.map(g=>n.match(wr(f,g.off,g.off+g.len-1)))),o=0,u=[];s.forEach((g,m)=>{a[m]?o+=g.len:u.push(g)}),r?.({doneBytes:o,totalBytes:i});let c=0,l=!1,d=null,p=async()=>{for(;!l&&d===null;){let g=c++;if(g>=u.length)return;let m=u[g];if(t?.aborted)return;try{await ze(f,m.off,m.len,t)}catch(w){d=w;return}if(!await n.match(wr(f,m.off,m.off+m.len-1))){l=!0;return}o+=m.len,r?.({doneBytes:o,totalBytes:i})}};if(await Promise.all(Array.from({length:Math.min(4,u.length)},p)),t?.aborted)return"aborted";if(d!==null)throw d instanceof Error?d:new Error(String(d));return l?"unstorable":"done"}var li,Ln,yr,Wn=ae(()=>{"use strict";"use client";rt();hr();On();Cn();Rn();li="brik-range-v1";Ln=!1;yr="brimkern-model-cache"});function hi(f){let e=f.indexOf("<think>");if(e===-1)return f;let r=f.indexOf("</think>",e);return(r===-1?f.slice(0,e):f.slice(0,e)+f.slice(r+8)).trim()}function $n(f,e,r){f=f.map(n=>n.role==="assistant"?{...n,content:hi(n.content)}:n);let t="";if(e==="deepseek"){t+="<\uFF5Cbegin\u2581of\u2581sentence\uFF5C>",r.trim()&&(t+=r);for(let n of f)n.role==="user"?t+=`<\uFF5CUser\uFF5C>${n.content}`:n.role==="assistant"&&(t+=`<\uFF5CAssistant\uFF5C>${n.content}<\uFF5Cend\u2581of\u2581sentence\uFF5C>`);return t+="<\uFF5CAssistant\uFF5C>",t}if(e==="rwkv7"){r.trim()&&(t+=`System: ${r.trim()}

`);for(let n of f)n.role==="user"?t+=`User: ${n.content.trim()}

`:n.role==="assistant"&&(t+=`Assistant: ${n.content.trim()}

`);return t+="Assistant:",t}if(e==="qwen"||e==="qwen3"||e==="qwen35"||e==="lfm2"||e==="smollm3"){r.trim()&&(t+=`<|im_start|>system
${r}<|im_end|>
`);for(let n of f)t+=`<|im_start|>${n.role}
${n.content}<|im_end|>
`;t+=`<|im_start|>assistant
`,e==="qwen35"&&(t+=`<think>
`)}else if(e==="llama3"){t+="<|begin_of_text|>",r.trim()&&(t+=`<|start_header_id|>system<|end_header_id|>

${r}<|eot_id|>`);for(let n of f)t+=`<|start_header_id|>${n.role}<|end_header_id|>

${n.content}<|eot_id|>`;t+=`<|start_header_id|>assistant<|end_header_id|>

`}else if(e==="mistral3"){t+="<s>",r.trim()&&(t+=`[SYSTEM_PROMPT]${r}[/SYSTEM_PROMPT]`);for(let n of f)n.role==="user"?t+=`[INST]${n.content}[/INST]`:n.role==="assistant"&&(t+=`${n.content}</s>`)}else if(e==="gemma4"){r.trim()&&(t+=`<|turn>system
${r.trim()}<turn|>
`);for(let n of f)t+=`<|turn>${n.role==="assistant"?"model":"user"}
${n.content.trim()}<turn|>
`;t+=`<|turn>model
`}else if(e==="gemma"||e==="gemma3"){r.trim()&&(t+=`<start_of_turn>model
${r}<end_of_turn>
`);for(let n of f)t+=`<start_of_turn>${n.role==="assistant"?"model":"user"}
${n.content}<end_of_turn>
`;t+=`<start_of_turn>model
`}return t}function Vn(f){let e=new Set;for(let r of["tokenizer.ggml.eos_token_id","tokenizer.ggml.eot_token_id","tokenizer.ggml.eom_token_id"]){let t=f?.[r],n=typeof t=="number"?t:Number(t);Number.isFinite(n)&&n>=0&&e.add(n)}return[...e]}var In,Yn=ae(()=>{"use strict";In=["<\uFF5Cend\u2581of\u2581sentence\uFF5C>","<\uFF5CAssistant\uFF5C>","<\uFF5CUser\uFF5C>","<\uFF5Cbegin\u2581of\u2581sentence\uFF5C>","<|im_end|>","<|im_start|>","<|eot_id|>","<|begin_of_text|>","<|start_header_id|>","<|end_header_id|>","</s>","<s>","<end_of_turn>","<start_of_turn>","[INST]","[/INST]","[SYSTEM_PROMPT]","</model>","</assistant>","</user>","<|assistant|>","<|user|>",`
User:`]});function bi(){let f=[];for(let s=33;s<=126;s++)f.push(s);for(let s=161;s<=172;s++)f.push(s);for(let s=174;s<=255;s++)f.push(s);let e=f.slice(),r=0;for(let s=0;s<256;s++)f.includes(s)||(f.push(s),e.push(256+r),r++);let t=new Array(256),n=new Map;for(let s=0;s<f.length;s++)t[f[s]]=String.fromCodePoint(e[s]),n.set(String.fromCodePoint(e[s]),f[s]);return{enc:t,dec:n}}var Xn,Ve,_r=ae(()=>{"use strict";Xn="'(?:[sdmt]|ll|ve|re)| ?\\p{L}+| ?\\p{N}+| ?[^\\s\\p{L}\\p{N}]+|\\s+(?!\\S)|\\s+",Ve=class f{constructor(e){this.vocab=new Map;this.idToTok=new Map;this.ranks=new Map;this.added=[];this.specialIds=new Set;this.addedRe=null;this.bosIds=[];this.cache=new Map;let r=typeof e=="string"?JSON.parse(e):e;if(r?.model?.type!=="BPE")throw new Error(`BpeTokenizer : model.type ${r?.model?.type} non couvert (BPE uniquement)`);({enc:this.byteEnc,dec:this.byteDec}=bi());for(let[a,o]of Object.entries(r.model.vocab))this.vocab.set(a,o),this.idToTok.set(o,a);(r.model.merges??[]).forEach((a,o)=>this.ranks.set(Array.isArray(a)?`${a[0]} ${a[1]}`:a,o));for(let a of r.added_tokens??[])this.added.push(a),this.vocab.set(a.content,a.id),this.idToTok.set(a.id,a.content),a.special&&this.specialIds.add(a.id);if(this.added.length){let a=this.added.map(o=>o.content.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).sort((o,u)=>u.length-o.length);this.addedRe=new RegExp(`(${a.join("|")})`,"g")}let n=f.findSplitPattern(r.pre_tokenizer)??Xn;this.splitRe=new RegExp(n,"gu");let s=a=>{if(!a)return null;if(a.type==="TemplateProcessing")return a.single;if(a.type==="Sequence")for(let o of a.processors??[]){let u=s(o);if(u)return u}return null},i=s(r.post_processor);if(Array.isArray(i))for(let a of i)if(a.SpecialToken){let o=this.vocab.get(a.SpecialToken.id);o!==void 0&&this.bosIds.push(o)}else break}static findSplitPattern(e){if(!e)return null;if(e.type==="Split"&&e.pattern?.Regex)return e.pattern.Regex;if(e.type==="ByteLevel"&&e.use_regex!==!1)return Xn;if(e.type==="Sequence")for(let r of e.pretokenizers??[]){let t=f.findSplitPattern(r);if(t)return t}return null}bpe(e){let r=this.cache.get(e);if(r)return r;let t=Array.from(e);for(;t.length>1;){let s=-1,i=1/0;for(let a=0;a<t.length-1;a++){let o=this.ranks.get(`${t[a]} ${t[a+1]}`);o!==void 0&&o<i&&(i=o,s=a)}if(s<0)break;t=[...t.slice(0,s),t[s]+t[s+1],...t.slice(s+2)]}let n=[];for(let s of t){let i=this.vocab.get(s);if(i!==void 0)n.push(i);else for(let a of s){let o=this.vocab.get(a);o!==void 0&&n.push(o)}}return this.cache.set(e,n),n}encodeChunk(e){let r=[];for(let t of e.match(this.splitRe)??[]){let n=new TextEncoder().encode(t),s="";for(let i of n)s+=this.byteEnc[i];r.push(...this.bpe(s))}return r}encode(e){let r=[...this.bosIds];if(this.addedRe)for(let t of e.split(this.addedRe)){if(!t)continue;let n=this.vocab.get(t);n!==void 0&&this.added.some(s=>s.content===t)?r.push(n):r.push(...this.encodeChunk(t))}else r.push(...this.encodeChunk(e));return r}decode(e){let r=[];for(let t of e){if(this.specialIds.has(t))continue;let n=this.idToTok.get(t);if(n!==void 0)for(let s of n){let i=this.byteDec.get(s);if(i!==void 0)r.push(i);else for(let a of new TextEncoder().encode(s))r.push(a)}}return new TextDecoder("utf-8",{fatal:!1}).decode(new Uint8Array(r))}}});function es(f){let e=f.metadata,r=String(e["tokenizer.ggml.model"]??""),t=e["tokenizer.ggml.tokens"],n=e["tokenizer.ggml.merges"];if(!Array.isArray(t)||!t.length||!Array.isArray(n)||!n.length||r!=="gpt2"&&r!=="llama")return null;let s=String(e["tokenizer.ggml.pre"]??"gpt2"),i=e["tokenizer.ggml.token_type"]??[],a=Zn(e["tokenizer.ggml.bos_token_id"]),o=Zn(e["tokenizer.ggml.eos_token_id"]),u=e["tokenizer.ggml.add_bos_token"]===!0,c={},l=[],d=[];for(let g=0;g<t.length;g++){let m=t[g],w=i[g]??1;w===3||w===4?(l.push({id:g,content:m,special:w===3}),w===3&&d.push(g)):c[m]=g}let p={version:"1.0",added_tokens:l,pre_tokenizer:{type:"Split",pattern:{Regex:Jn[s]??Jn.gpt2}},post_processor:u&&a!=null?{type:"TemplateProcessing",single:[{SpecialToken:{id:t[a],type_id:0}},{Sequence:{id:"A",type_id:0}}]}:void 0,model:{type:"BPE",vocab:c,merges:n}};try{return{tokenizer:new Ve(p),nVocab:t.length,pre:s,bosId:a,eosId:o,controlIds:d}}catch(g){return console.warn("[gguf-tok] vocabulaire non consommable par BpeTokenizer. Repli sur le tokenizer HF :",g),null}}function Zn(f){let e=Number(f);return Number.isFinite(e)?e:null}var Jn,ts=ae(()=>{"use strict";_r();Jn={"llama-bpe":"(?:'[sS]|'[tT]|'[rR][eE]|'[vV][eE]|'[mM]|'[lL][lL]|'[dD])|[^\\r\\n\\p{L}\\p{N}]?\\p{L}+|\\p{N}{1,3}| ?[^\\s\\p{L}\\p{N}]+[\\r\\n]*|\\s*[\\r\\n]+|\\s+(?!\\S)|\\s+",qwen2:"(?:'[sS]|'[tT]|'[rR][eE]|'[vV][eE]|'[mM]|'[lL][lL]|'[dD])|[^\\r\\n\\p{L}\\p{N}]?\\p{L}+|\\p{N}| ?[^\\s\\p{L}\\p{N}]+[\\r\\n]*|\\s*[\\r\\n]+|\\s+(?!\\S)|\\s+",gpt2:"'(?:[sdmt]|ll|ve|re)| ?\\p{L}+| ?\\p{N}+| ?[^\\s\\p{L}\\p{N}]+|\\s+(?!\\S)|\\s+",qwen35:"(?:'[sS]|'[tT]|'[rR][eE]|'[vV][eE]|'[mM]|'[lL][lL]|'[dD])|[^\\r\\n\\p{L}\\p{N}]?[\\p{L}\\p{M}]+|\\p{N}| ?[^\\s\\p{L}\\p{M}\\p{N}]+[\\r\\n]*|\\s*[\\r\\n]+|\\s+(?!\\S)|\\s+"}});function Pr(f,e,r={}){let{temperature:t=.7,topK:n=40,topP:s=.9,rng:i=Math.random}=r;if(!t||t<=0)return f[0];let a=n&&n>0?Math.min(n,f.length):f.length,o=1/t,u=e[0],c=new Float64Array(a),l=0;for(let m=0;m<a;m++){let w=Math.exp((e[m]-u)*o);c[m]=w,l+=w}for(let m=0;m<a;m++)c[m]/=l;let d=a;if(s&&s<1){let m=0;for(let w=0;w<a;w++)if(m+=c[w],m>=s){d=w+1;break}}let p=0;for(let m=0;m<d;m++)p+=c[m];let g=i()*p;for(let m=0;m<d;m++)if(g-=c[m],g<=0)return f[m];return f[d-1]}var rs=ae(()=>{"use strict"});function ss(f,e){if(f==="llama"){if(e&&e>=1e5)return ns.llama;if(e&&e<1e5){console.warn(`[brimkern] GGUF arch="llama" avec un vocab de ${e} \u2192 famille Llama 2 / Mistral / TinyLlama : pas de tokenizer par d\xE9faut pour celle-ci, la s\xE9lection actuelle est conserv\xE9e (une r\xE9ponse incoh\xE9rente = mauvais tokenizer).`);return}return}return ns[f]}var vi,wi,Ne,xr,lo,fo,ns,is=ae(()=>{"use strict";vi="https://huggingface.co/madebyollin/taesd/resolve/614f76814bbe30edbe2e627ace1c2234c81a2c0e",wi=`${vi}/taesd_decoder.safetensors`,Ne="https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main",xr="https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main",lo={unet:`${xr}/video-unet-q8.brik`,motion:`${xr}/video-motion-q8.brik`,clip:`${xr}/video-clip-q8.brik`,taesd:wi},fo={sdturbo:{unet:`${Ne}/sd-turbo-unet-q8.brik`,clip:`${Ne}/sd-turbo-clip-q8.brik`},sdxs:{unet:`${Ne}/sdxs-unet-light.brik`,clip:`${Ne}/sd-turbo-clip-mixed.brik`},realvisxl:{unet:`${Ne}/realvisxl-unet-mixed.brik`,clip:`${Ne}/realvisxl-clip2-q8.brik`,clip1:`${Ne}/realvisxl-clip1-q8.brik`,vae:`${Ne}/realvisxl-vae-q8.brik`}},ns={gemma:{archType:"gemma",tokenizerId:"Xenova/gemma-tokenizer"},gemma2:{archType:"gemma",tokenizerId:"Xenova/gemma-tokenizer"},gemma3:{archType:"gemma3",tokenizerId:"unsloth/gemma-3-270m-it"},gemma4:{archType:"gemma4",tokenizerId:"google/gemma-4-E4B-it"},smollm3:{archType:"smollm3",tokenizerId:"HuggingFaceTB/SmolLM3-3B"},qwen3:{archType:"qwen3",tokenizerId:"Qwen/Qwen3-0.6B"},qwen35:{archType:"qwen35",tokenizerId:"Qwen/Qwen2.5-Coder-3B-Instruct"},qwen3_5:{archType:"qwen35",tokenizerId:"Qwen/Qwen2.5-Coder-3B-Instruct"},mistral3:{archType:"mistral3",tokenizerId:"unsloth/Ministral-3-3B-Instruct-2512"},llama:{archType:"llama3",tokenizerId:"unsloth/Llama-3.2-1B-Instruct"}}});function as(f){let e=f.arch||"";if(e==="lfm2"||f.config?.lfm2)return"lfm2";if(e==="rwkv7"||f.config?.rwkv)return"rwkv7";if(e==="qwen2"||e.includes("qwen2"))return"qwen";if(e==="qwen35"||e==="qwen3_5")return"qwen35";if(e==="qwen3"||e.includes("qwen3"))return"qwen3";if(e==="smollm3"||e.includes("smollm"))return"smollm3";if(e==="mistral3"||e.includes("mistral"))return"mistral3";if(e==="gemma4")return"gemma4";if(e==="gemma3")return"gemma3";if(e==="gemma"||e==="gemma2")return"gemma";if(e==="deepseek")return"deepseek";if(e==="llama"){let r=f.tensors?.["token_embd.weight"],t=f.config?.d,n=r&&t?r.nElems/t:null;return n&&n<1e5?"llama2":"llama3"}return"qwen"}async function Ai(f,e){let r=new Mt;if(!await r.init())throw Object.assign(new Error("WebGPU is not available in this browser."),{code:"no-webgpu"});r.onLost=v=>{console.warn("[brimkern] device GPU perdu ("+(v?.reason||"unknown")+"): rechargement au prochain appel"),De.delete(f)},await r.selfValidate(),e("download");let t=await ze(f,0,12).catch(()=>null);if((t?.bytes&&t.bytes.length>=4?String.fromCharCode(...t.bytes.subarray(0,4)):"")==="GGUF"||f.toLowerCase().includes(".gguf")){await Qn(f,h=>{e("download",{loaded:h.doneBytes,total:h.totalBytes})}).catch(h=>{console.warn("[gguf] pr\xE9chargement par plages indisponible :",h)});let v=await zn(f).catch(h=>(console.warn("[gguf] streaming par plages \xE9chou\xE9, repli complet :",h),null)),G,S;if(v)G=v.manifest,S=v.source;else{let h=await kr(f);G=await Et(new Blob([h.buffer])),S={bytes:async(k,b)=>h.subarray(k,k+b)}}let O=as(G);e("tokenizer");let L=O==="gemma4"?xn(G):es(G),K,x=Vn(G.metadata);if(L)K=L.tokenizer,L.eosId!=null&&x.push(L.eosId),L.controlIds?.length&&x.push(...L.controlIds);else{console.warn("[brimkern] tokenizer GGUF non-BPE : repli transformers.js (CDN)");let h=await import(zt),k=G.tensors?.["token_embd.weight"],b=k&&G.config?.d?k.nElems/G.config.d:null,P=ss(String(G.arch||""),b)?.tokenizerId||G.metadata?.["tokenizer.ggml.id"]||(O==="llama3"?"unsloth/Llama-3.2-1B-Instruct":"Qwen/Qwen2.5-Coder-0.5B-Instruct"),B=await h.AutoTokenizer.from_pretrained(P);K={encode:U=>Array.from(B(U).input_ids.data,q=>Number(q)),decode:U=>B.decode(U,{skip_special_tokens:!0})}}O==="gemma3"&&x.push(106,1),O==="gemma4"&&x.push(106,1,50),O==="gemma"&&x.push(107,1);let _=O==="gemma4"?new jt(r,S,G):O==="qwen35"?new Kt(r,S,G):new Ge(r,S,G);return e("gpu"),await _.prewarmGpu((h,k)=>{e("gpu",{loaded:h,total:k})}),{core:new Nt(r,_,K,O,x),engine:r}}let i=await Hn(f),a=i.manifest,o=a?.config?.lfm2?"lfm2":a?.config?.rwkv?"rwkv7":"transformer";if(o==="transformer"){e("tokenizer");let v;if(i.tokenizer?.json)try{let K=new Ve(i.tokenizer.json);v={encode:x=>K.encode(x),decode:x=>K.decode(x)}}catch(K){console.warn("[brimkern] tokenizer.json non couvert par le BPE bundl\xE9 : repli transformers.js (CDN)",K);let x=await import(zt),_=new x.PreTrainedTokenizer(JSON.parse(i.tokenizer.json),JSON.parse(i.tokenizer.config));v={encode:y=>Array.from(_(y).input_ids.data,h=>Number(h)),decode:y=>_.decode(y,{skip_special_tokens:!0})}}else{let K=await import(zt),x=i.tokenizerId||"Qwen/Qwen2.5-0.5B-Instruct",_=await K.AutoTokenizer.from_pretrained(x);v={encode:y=>Array.from(_(y).input_ids.data,h=>Number(h)),decode:y=>_.decode(y,{skip_special_tokens:!0})}}let G=new Ge(r,i.source,a);e("gpu"),await G.prewarmGpu((K,x)=>{e("gpu",{loaded:K,total:x})});let S=as(a),O=a.chat?.stopTokenIds||[151645,151643];return{core:new Nt(r,G,v,S,O),engine:r}}let u=a.tensors["token_embd.weight"],c={arch:{...a.config,arch:o,vocab:u?u.nElems/a.config.d:0},tensors:Object.fromEntries(Object.entries(a.tensors).map(([v,G])=>[v,{dtype:yi[G.type]??G.type,shape:G.shape,nElems:G.nElems,shard:0,offset:G.offset,byteLength:G.bytes}])),shards:[{id:0,file:"",byteLength:0}],chat:o==="lfm2"?{template:"chatml",stopTokenIds:[7,2,8,10,12]}:{template:"rwkv",stopTokenIds:[0]}},l=Object.values(a.tensors).reduce((v,G)=>v+G.bytes,0),d=0,p=fr(a.tensors,i.source),g=async v=>{let G=a.tensors[v];if(!G)throw new Error(`tenseur absent : ${v}`);let S=await p(v);return d+=G.bytes,e("download",{loaded:d,total:l}),S};if(e("tokenizer"),o==="rwkv7"){let v=i.tokenizer?.json?JSON.parse(i.tokenizer.json):null;if(!v?.tokens)throw new Error("RWKV .brik without its embedded World vocab (rebuild the BRIK).");let G=new pt(r,c,g);return e("gpu"),await G.load(v.tokens),{core:G,engine:r}}let m;try{let v=new Ve(i.tokenizer.json);m={encode:G=>v.encode(G),decode:G=>v.decode(G)}}catch(v){console.warn("[brimkern] tokenizer.json non couvert par le BPE bundl\xE9 : repli transformers.js (CDN)",v);let G=await import(zt),S=new G.PreTrainedTokenizer(JSON.parse(i.tokenizer.json),JSON.parse(i.tokenizer.config));m={encode:O=>Array.from(S(O).input_ids.data,L=>Number(L)),decode:O=>S.decode(O,{skip_special_tokens:!0})}}let w=new Ct(r,c,g);return e("gpu"),await w.load(m),{core:w,engine:r}}function ht(f){return f&&(f.startsWith("https://")||/^http:\/\/(localhost|127\.0\.0\.1)[:/]/.test(f))?f:os[f||"lfm2.5-230m"]||os["lfm2.5-230m"]}function Qt(f,e){let r=De.get(f);if(!r){let t={status:"init",state:"loading",listeners:new Set,promise:null};t.promise=Ai(f,(n,s)=>{t.status=n,t.progress=s,t.listeners.forEach(i=>i(n,s))}).then(n=>(t.state="ready",n)).catch(n=>{throw t.state="error",De.delete(f),n}),De.set(f,t),r=t}return e&&(r.state!=="ready"&&e(r.status,r.progress),r.listeners.add(e),r.promise.finally(()=>r.listeners.delete(e)).catch(()=>{})),r.promise}async function us(f,e){let r=await Qt(f,e);return r.engine.lost?(De.delete(f),(await Qt(f,e)).core):r.core}async function cs(f,e){let r=await us(f);try{return await e(r)}catch(t){let n=De.get(f);if(!(!n||await n.promise.then(i=>i.engine.lost).catch(()=>!0)))throw t;return console.warn("[brimkern] g\xE9n\xE9ration interrompue par une perte de device : nouvelle tentative"),De.delete(f),e(await us(f))}}function _i(f,e){let r=f.replace(/<\|[a-z_]+\|>/g,"");if(r=r.replace(/\s*-{2,}\s*(?:E(?:N(?:D(?:\s*O(?:F(?:\s*N(?:O(?:T(?:E(?:S)?)?)?)?)?)?)?)?)?|N(?:O(?:T(?:E(?:S)?)?)?)?)\s*-*\s*$/i,""),e){let t=r.replace(/^\s*(hello|hi|hey|bonjour|salut)\s*[!,.]\s*/i,"");t.trim()&&(r=t)}return r.trimEnd()}function Pi(f){let e=-1;for(let r of In){let t=f.indexOf(r);t!==-1&&(e===-1||t<e)&&(e=t)}return e===-1?{text:f,hit:!1}:{text:f.slice(0,e),hit:!0}}async function ls(f,e,r,t,n,s,i,a=[]){let o=f.arch||(f instanceof pt?"rwkv7":"lfm2"),u=$n([...a,...e.slice(-ki)],o,r),c=a.some(g=>g.role==="assistant")||e.some(g=>g.role==="assistant"),l="",d=!1;return await(f.residentAvailable?.()?f.generateResident.bind(f):f.generate.bind(f))(u,t,g=>{let m=Pi(g);m.hit&&(d=!0),l=_i(m.text,c),s?.(l)},()=>d||!!i?.(),{sample:!0,temperature:n,topK:40,repeatPenalty:1.3}),l}var Nt,zt,os,yi,ki,De,Ur=ae(()=>{"use strict";Tt();hn();vn();gt();_n();Pn();Un();Wn();rt();Yn();_r();ts();rs();hr();is();Nt=class{constructor(e,r,t,n,s){this.engine=e;this.model=r;this.tok=t;this.arch=n,this.stops=new Set(s||[])}residentAvailable(){return!0}reset(){this.model.reset()}unload(){this.model.unload()}async generate(e,r,t,n,s){return this.generateResident(e,r,t,n,s)}async generateResident(e,r,t,n,s){let i="sdk-gen",a=s?.repeatPenalty??(s?.sample?1.3:1),o=s?.temperature??.55,u=s?.topK??40,c=64;this.model.reset();let l=this.tok.encode(e);if(!l.length)return"";let d=256,p=0,g=0;for(let S=0;S<l.length;S+=d){if(n?.())return"";let O=l.slice(S,S+d);if(S+d>=l.length){let K=await this.model.topKKV(O,p,i,l.slice(-c),a);g=Pr(K.ids,K.vals,{temperature:s?.sample===!1?0:o,topK:u})}else await this.model.topKKV(O,p,i,[],1);p+=O.length}if(!Number.isInteger(g)||g<0||this.stops.has(g))return"";let m=[g],w=[...l.slice(-c),g].slice(-c),v=new Map;for(let S of w)v.set(S,(v.get(S)??0)+1);let G=S=>{if(w.push(S),v.set(S,(v.get(S)??0)+1),w.length>c){let O=w.shift(),L=v.get(O)-1;L===0?v.delete(O):v.set(O,L)}};t&&t(this.tok.decode(m));for(let S=1;S<r&&!n?.();S++){let O=l.length+S-1,L=await this.model.topKKV([g],O,i,[...v.keys()],a);if(!L.ids||!L.ids.length)break;let K=Pr(L.ids,L.vals,{temperature:s?.sample===!1?0:o,topK:u});if(!Number.isInteger(K)||K<0||this.stops.has(K))break;g=K,m.push(g),G(g),t&&t(this.tok.decode(m))}return this.tok.decode(m)}},zt="https://esm.sh/@huggingface/transformers@4.2.0",os={"lfm2.5-230m":"https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik","qwen-0.5b":"https://huggingface.co/romainkh14/Qwen2.5-0.5B-Instruct_BRIK/resolve/main/qwen2.5-0.5b-instruct-mixed.brik","coder-0.5b":"https://huggingface.co/Qwen/Qwen2.5-Coder-0.5B-Instruct-GGUF/resolve/main/qwen2.5-coder-0.5b-instruct-q4_k_m.gguf","coder-1.5b":"https://huggingface.co/Qwen/Qwen2.5-Coder-1.5B-Instruct-GGUF/resolve/main/qwen2.5-coder-1.5b-instruct-q4_k_m.gguf","rwkv-0.4b":"https://huggingface.co/romainkh14/RWKV-7-G1a-0.4B_BRIK/resolve/main/rwkv7-g1a-0.4b-q4.brik","rwkv-0.1b":"https://huggingface.co/romainkh14/RWKV-7-G1-0.1B_BRIK/resolve/main/rwkv7-g1-0.1b-q4.brik"},yi={F16:"f16",F32:"f32",Q4W:"q4",Q8W:"q8",Q3W:"q3"},ki=12;De=new Map});var fs={};Vr(fs,{LocalBackend:()=>bt});var bt,Gr=ae(()=>{"use strict";Ur();bt=class{constructor(){this.kind="main"}async preload(e,r){await Qt(e,r)}state(e){return De.get(e)?.state}turn(e,r,t){return cs(e.url,n=>ls(n,e.history,e.system,e.maxTokens,e.temperature,r,()=>!!t?.aborted,e.pinned))}dispose(){}}});function xi(){try{if(typeof document>"u")return"";let f=document.currentScript;if(f?.src)return new URL(f.src,document.baseURI).href}catch{}return""}function ps(f){ds=f}function gs(){return ds||Ui}var Ui,ds,Br=ae(()=>{"use strict";Ui=xi(),ds=""});var ms={};Vr(ms,{WorkerBackend:()=>qr});var qr,hs=ae(()=>{"use strict";Br();qr=class{constructor(){this.kind="worker";this.seq=0;this.pending=new Map;this.states=new Map;if(typeof Worker>"u")throw new Error("Worker indisponible");let e=gs();if(!e)throw new Error("URL du script introuvable (import ESM ?) : passez workerUrl");let r=(()=>{try{return location.search}catch{return""}})(),t=`self.__brimkernSearch=${JSON.stringify(r)};importScripts(${JSON.stringify(e)});`,n=new Blob([t],{type:"text/javascript"});this.url=URL.createObjectURL(n),this.worker=new Worker(this.url);let s,i;this.hello=new Promise((a,o)=>{s=a,i=o}),this.worker.onerror=a=>i(new Error(`worker: ${a.message||"\xE9chec de chargement"}`)),this.worker.onmessage=a=>{let o=a.data;if(o.type==="hello"){s();return}let u=this.pending.get(o.id);if(u){if(o.type==="progress"){u.onProgress?.(o.status,o.progress);return}if(o.type==="token"){u.onToken?.(o.text);return}this.pending.delete(o.id),o.type==="error"?u.reject(new Error(o.message)):o.type==="state"?u.resolve(o.state):u.resolve(o.text??"")}}}ready(){return this.hello}send(e,r={}){let t=++this.seq,n=new Promise((s,i)=>{this.pending.set(t,{resolve:s,reject:i,...r}),this.worker.postMessage({...e,id:t})});return{id:t,done:n}}async preload(e,r){await this.hello,this.states.get(e)!=="ready"&&this.states.set(e,"loading");try{await this.send({type:"preload",url:e},{onProgress:r}).done,this.states.set(e,"ready")}catch(t){throw this.states.set(e,"error"),t}}state(e){return this.states.get(e)}async turn(e,r,t){await this.hello;let{id:n,done:s}=this.send({type:"turn",req:e},{onToken:r}),i=()=>this.worker.postMessage({type:"stop",id:n});t?.aborted?i():t?.addEventListener("abort",i,{once:!0});try{let a=await s;return this.states.set(e.url,"ready"),a}finally{t?.removeEventListener("abort",i)}}dispose(){this.worker.terminate(),URL.revokeObjectURL(this.url);for(let e of this.pending.values())e.reject(new Error("worker arr\xEAt\xE9"));this.pending.clear()}}});var Gi={};var Sr,Wt,Ye,vs=ae(()=>{"use strict";Gr();Sr=new bt,Wt=new Set,Ye=f=>self.postMessage(f);self.onmessage=async f=>{let e=f.data;if(e.type==="stop"){Wt.add(e.id);return}if(e.type==="state"){Ye({type:"state",id:e.id,state:Sr.state(e.url)});return}try{if(e.type==="preload"){await Sr.preload(e.url,(r,t)=>Ye({type:"progress",id:e.id,status:r,progress:t})),Ye({type:"done",id:e.id});return}if(e.type==="turn"){let r=new AbortController,t=new Proxy(r.signal,{get:(u,c)=>c==="aborted"?Wt.has(e.id):Reflect.get(u,c)}),n=16,s=0,i=null,a=()=>{i!==null&&(Ye({type:"token",id:e.id,text:i}),i=null,s=Date.now())},o=await Sr.turn(e.req,u=>{i=u,Date.now()-s>=n&&a()},t);a(),Ye({type:"done",id:e.id,text:o}),Wt.delete(e.id);return}}catch(r){Wt.delete(e.id),Ye({type:"error",id:e.id,message:r instanceof Error?r.message:String(r)})}};Ye({type:"hello"})});var Bs=new Set(["avec","pour","dans","les","des","une","est","sur","par","que","qui","quoi","comment","pourquoi","quand","vous","nous","votre","notre","mais","plus","tout","tous","cette","sont","avez","puis","faire","fait","fais","font","the","and","for","with","what","who","how","why","when","about","your","our","you","are","can","does","did","this","that","from","have","je","tu","il","elle","on","ils","elles","du","de","la","le","un","en","au","aux","ce","ces","cet","se","sa","son","ses","mon","ma","mes","ton","ta","tes","me","te","ne","pas","si","ou","et","ni","car","donc","or","to","in","at","it","is","be","as","an","by","do","no","so","my","he","we","us","me","am","was","were","been","quel","quelle","quels","quelles","which","where","bonjour","salut","hello","merci"]),xt=new Map,qs=2e4;function er(f){let e=xt.get(f);if(e!==void 0)return e;let r=Ss(f);return xt.size>=qs&&xt.clear(),xt.set(f,r),r}function Ss(f){let e=f.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");return e.length<=3||(e=e.replace(/(?:ments?|ements?|eront|erait|aient|antes?|ances?|euses?|ables?|tions?|sions?|eaux|eurs?|euse|ique|iques|istes?|ings?|ness|able|ible|less|full?)$/,""),e.length>3&&(e=e.replace(/(?:er|ir|ez|ent|ais|ait|ant|ees?|es?|ed|ly|s)$/,""))),e}function at(f){let e=(f.toLowerCase().match(/[\p{L}\p{N}]+/gu)??[]).filter(r=>Bs.has(r)?!1:/\d/.test(r)?!0:r.length>=2);return[...new Set(e)]}function Jr(f,e=600){let r=[];return f.forEach((t,n)=>{let s=(t.title||"").trim(),i=(t.text||"").split(/\n\s*\n+/).map(u=>u.trim()).filter(Boolean),a="",o=()=>{a.trim()&&r.push({title:s,text:a.trim(),doc:n}),a=""};for(let u of i){if(u.length>e*1.6){o();let c=u.split(/(?<=[.!?])\s+/),l="";for(let d of c)l&&(l+" "+d).length>e?(r.push({title:s,text:l.trim(),doc:n}),l=d):l=l?`${l} ${d}`:d;l.trim()&&r.push({title:s,text:l.trim(),doc:n});continue}a&&(a+`

`+u).length>e&&o(),a=a?`${a}

${u}`:u}o()}),r}var Yr=new WeakMap;function Xr(f){let e=new Set;for(let r of f)r.length>=4&&e.add(r.slice(0,4));return e}function Fs(f){let e=Yr.get(f);if(e)return e;let r=`${f.title} ${f.text}`.toLowerCase(),t=f.title.toLowerCase(),n=new Set(at(r).map(er)),s=new Set(at(t).map(er)),i={hay:r,titre:t,docStems:n,titreStems:s,docPrefix4:Xr(n),titrePrefix4:Xr(s)};return Yr.set(f,i),i}function Os(f,e,r){if(!f.length)return 0;let t=Fs(e),n=0,s=0;for(let i of f){let a=r.get(i)??1;s+=a;let o=er(i),u=o.length>=4?o.slice(0,4):null;if(t.hay.includes(i)||t.docStems.has(o)||u!==null&&t.docPrefix4.has(u)){let l=t.titre.includes(i)||t.titreStems.has(o)||u!==null&&t.titrePrefix4.has(u);n+=a*(l?2.2:1)}}return s?n/s:0}function Ms(f){let e=new Map;for(let n of f)for(let s of at(`${n.title} ${n.text}`))e.set(s,(e.get(s)??0)+1);let r=new Map,t=Math.max(1,f.length);for(let[n,s]of e)r.set(n,Math.log(1+t/s));return r}function Zr(f,e,r=1200,t=3,n=.22,s=.5){let i=at(f);if(!i.length||!e.length)return[];let a=Ms(e),o=e.map(g=>({c:g,s:Os(i,g,a)})).filter(g=>g.s>=n).sort((g,m)=>m.s-g.s),u=o.length?o[0].s*s:0,c=o.filter(g=>g.s>=u),l=[],d=new Set,p=r;for(let{c:g,s:m}of c)l.length>=t||g.text.length>p||d.has(g.doc)||(l.push({chunk:g,score:m}),d.add(g.doc),p-=g.text.length);for(let{c:g,s:m}of c){if(l.length>=t)break;l.some(w=>w.chunk===g)||g.text.length>p||(l.push({chunk:g,score:m}),p-=g.text.length)}return l}function tr(f){if(at(f).length<2)return!1;let e=f.trim().toLowerCase();return/\?\s*$/.test(e)?!0:/^(?:who|what|when|where|why|how|which|whose|is|are|was|were|do|does|did|can|could|will|would|should|may|have|has|qui|que|quoi|quand|où|pourquoi|comment|combien|quel|quelles?|quels|est|sont|était|avez|peux|pouvez|puis|vous|y a-t-il|est-ce)\b/.test(e)}function rr(f,e=!1){let r=f.trim();return r?e?/pas cette information|n[’']ai pas (?:cette|ces|d[’']information)|ne (?:sais|dispose) pas|pas en mesure de (?:vous )?(?:aider|répondre|renseigner|fournir)|ne peux pas (?:vous )?(?:aider|fournir|renseigner|répondre)/i.test(r):/do not have (?:that|this|any) information|don[’']t have (?:that|this|any) information|no information (?:about|on)|(?:can[’']t|cannot|not able to|unable to) (?:assist|provide|answer|access|help you with that)/i.test(r):!1}function Ts(f){let e=f.trim().toLowerCase().replace(/[!?.,;:\-_]/g,"").trim();return/^(hi|hello|hey|greetings|good\s+(morning|afternoon|evening|day)|bonjour|salut|coucou|bonsoir|how\s+are\s+you|how\s+are\s+you\s+doing|ça\s+va|ca\s+va|comment\s+vas?-tu|comment\s+allez-vous|who\s+are\s+you|qui\s+es-tu|merci|thanks|thank\s+you|what\s+can\s+you\s+do|que\s+peux-tu\s+faire)$/i.test(e)}function Ut(f,e,r=!1){if(e&&Ts(e))return"";if(!f.length)return e&&!tr(e)?r?`

Ce message n\u2019appelle aucune fiche : r\xE9ponds en une phrase courte et aimable.`:`

This message needs no reference note: reply in one short, friendly sentence.`:r?`

Aucune fiche de r\xE9f\xE9rence ne correspond \xE0 cette question. Dis que tu n\u2019as pas cette information : ne devine pas.`:`

No reference note matches this question. Say that you do not have this information: do not guess.`;let t=f.map((s,i)=>`[${i+1}]${s.title?` ${s.title}`:""}
${s.text}`).join(`

`);return`

${r?"R\xE9ponds UNIQUEMENT \xE0 partir des fiches ci-dessous, en fran\xE7ais. Reprends leurs chiffres exactement. Si la r\xE9ponse n\u2019y est pas, dis que tu n\u2019as pas cette information : n\u2019invente jamais pour combler.":"Answer using ONLY the reference notes below. Copy their figures exactly. If the answer is not in them, say you do not have that information: never fill the gap with what you assume."}

--- NOTES ---
${t}
--- END OF NOTES ---`}function en(f){let e=Array.isArray(f)?f:[f],r=[];for(let t of e)typeof t=="string"&&t.trim()?r.push({text:t}):t&&typeof t=="object"&&typeof t.text=="string"&&t.text.trim()&&r.push({title:t.title,text:t.text});return r}function Cs(f){let e=f.replace(/×/g,"*").replace(/÷/g,"/").replace(/,/g,".").replace(/[\s  ]/g,"").replace(/=+$/,"");if(!e||e.length>200)return null;let r=0,t=()=>e[r],n=()=>{let l=/^\d+(\.\d+)?/.exec(e.slice(r));return l?(r+=l[0].length,parseFloat(l[0])):null},s=()=>{if(t()==="("){r++;let l=u();return l===null||t()!==")"?null:(r++,l)}return n()},i=()=>{if(t()==="-"){r++;let l=i();return l===null?null:-l}return s()},a=()=>{let l=i();if(l===null)return null;if(t()==="^"){r++;let d=a();return d===null?null:Math.pow(l,d)}return l},o=()=>{let l=a();for(;l!==null&&(t()==="*"||t()==="/"||t()==="%");){let d=e[r++],p=a();if(p===null)return null;l=d==="*"?l*p:d==="/"?l/p:l%p}return l},u=()=>{let l=o();for(;l!==null&&(t()==="+"||t()==="-");){let d=e[r++],p=o();if(p===null)return null;l=d==="+"?l+p:l-p}return l},c=u();return r===e.length&&c!==null&&Number.isFinite(c)?c:null}function tn(f,e=3){let r=[],t=new Set,n=/[\d(][\d\s  .,+\-*/×÷%^()]*[\d)]\s*=?/g;for(let s of f.matchAll(n)){let i=s[0].trim();if(r.length>=e)break;if(t.has(i)||/\d{1,2}[/.]\d{1,2}[/.]\d{2,4}/.test(i)||/\d+:\d+/.test(f.slice(Math.max(0,s.index-1),s.index+i.length+1)))continue;let a=(i.match(/[+\-*/×÷%^]/g)||[]).length,o=/[*×÷%^(]/.test(i)||/=$/.test(i)||a>=2;if(a===0||!o)continue;let u=Cs(i);if(u===null)continue;let c=i.replace(/=+$/,"").trim();/[+\-*/×÷%^]/.test(c)&&(t.add(i),r.push({expr:c,value:u}))}return r}function rn(f){let e=Math.round(f*1e9)/1e9;return Number.isInteger(e),String(e)}function Gt(f){return new Date().toLocaleDateString(f==="fr"?"fr-FR":"en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}var Rs=1e4,Ls=600;function Bt(f){if(!Array.isArray(f))return[];let e=[];for(let r of f){if(r==="calc"||r==="date"){e.push(r);continue}let t=r;if(t&&typeof t=="object"&&typeof t.name=="string"&&t.name.trim()&&typeof t.run=="function"&&(t.match instanceof RegExp||typeof t.match=="function")){e.push(t);continue}console.warn("[brimkern] outil ignor\xE9 (attendu : 'calc', 'date', ou { name, match, run }) :",r)}return e}var nn=f=>f.includes("date");function sn(f){return f?`
(Date du jour : ${Gt("fr")}.)`:`
(Today's date: ${Gt("en")}.)`}var Ds=/\b(?:today|tonight|what\s+day|which\s+day|what\s+date|what\s+year|what\s+month|current\s+(?:date|day|year)|aujourd(?:'|’)hui|quel\s+jour|quelle\s+date|quelle\s+ann[ée]e|quel\s+mois|on\s+est\s+quel)\b/i,js=(f,e)=>new Promise((r,t)=>{let n=setTimeout(()=>t(new Error(`outil sans r\xE9ponse apr\xE8s ${e} ms`)),e);f.then(s=>{clearTimeout(n),r(s)},s=>{clearTimeout(n),t(s)})});async function nr(f,e,r){let t=[];for(let n of f){if(n==="date"){Ds.test(e)&&t.push({name:"date",result:Gt(r?"fr":"en")});continue}if(n==="calc"){let s=tn(e);s.length&&t.push({name:r?"calculatrice":"calculator",result:s.map(i=>`${i.expr} = ${rn(i.value)}`).join(" ; ")});continue}try{if(!(n.match instanceof RegExp?n.match.test(e):n.match(e)))continue;let i=await js(Promise.resolve(n.run(e)),Rs),a=String(i??"").replace(/\s+/g," ").trim().slice(0,Ls);a&&t.push({name:n.name.replace(/\s+/g," ").trim().slice(0,40),result:a})}catch(s){console.error(`[brimkern] outil \xAB ${n.name} \xBB a \xE9chou\xE9 :`,s)}}return t}function qt(f,e){if(!f.length)return"";let r=f.map(t=>e?`${t.name} : ${t.result}`:`${t.name}: ${t.result}`).join(" \xB7 ");return e?`[R\xE9sultats d\u2019outils locaux. Exacts, utilise-les tels quels : ${r}]`:`[Local tool results. Exact values, use them as-is: ${r}]`}Ur();async function bs(f){let{LocalBackend:e}=await Promise.resolve().then(()=>(Gr(),fs));if(f!==!0)return new e;try{let{WorkerBackend:r}=await Promise.resolve().then(()=>(hs(),ms)),t=new r;return await t.ready(),t}catch(r){return console.warn("[brimkern] Web Worker indisponible : inf\xE9rence sur le thread principal",r),new e}}Br();var Bi=typeof self<"u"&&typeof self.importScripts=="function"&&typeof document>"u";Bi&&Promise.resolve().then(()=>(vs(),Gi));var $t=null,Or=null,Fr;function vt(){return $t||($t=bs(Fr).then(f=>(Or=f,f))),$t}var qi=()=>Or?.kind??"pending";function Mr(f){if(f.workerUrl&&ps(f.workerUrl),f.worker!==void 0){if($t&&Fr!==f.worker){console.warn("[brimkern] option `worker` ignor\xE9e : le backend est d\xE9j\xE0 d\xE9marr\xE9 et partag\xE9 par la page.");return}Fr=f.worker}}var Si=`
Answer briefly and honestly. If you do not know something, say so: never invent facts or details.
You have no tools and no internet access: never emit tool calls, reply in plain text only.`,Fi=`
Answer briefly and honestly. If you do not know something, say so: never invent facts or details.
Bracketed tool results in the message are exact facts: use them as-is. Never emit tool calls yourself, reply in plain text only.`;function ys(){let f=new Map;return{on(e,r){let t=f.get(e);return t||f.set(e,t=new Set),t.add(r),()=>{t.delete(r)}},emit(e,...r){let t=f.get(e);if(t)for(let n of[...t])try{n(...r)}catch(s){console.error("[brimkern] \xE9couteur `"+e+"` a lev\xE9 :",s)}},clear(){f.clear()}}}function yt(f){if(!Array.isArray(f))return[];let e=[];for(let r of f){let t=r?.role,n=r?.content;(t==="user"||t==="assistant")&&typeof n=="string"&&n.trim()&&e.push({role:t,content:n})}return e}function wt(f){return f.lang?f.lang==="fr":f.system?/[àâäéèêëîïôöùûüç]|\b(?:bonjour|salut|vous|tu|réponds|conseiller|boutique|aide|aidez|client|magasin)\b/i.test(f.system):!!(typeof document<"u"&&/^fr\b/i.test(document.documentElement.lang||"")||typeof navigator<"u"&&/^fr\b/i.test(navigator.language||""))}var ks={en:{ouvrir:"Open the chat",fermer:"Close",placeholder:"Type a message\u2026",note:"Local AI \u2014 runs on your GPU, nothing is sent anywhere.",erreur:"Error: ",vide:"Sorry, I can only answer in plain text here: could you rephrase?",aide:"I\u2019m here to help \u2014 what would you like to know?",mo:"MB",sources:"Sources:",phases:{init:"Starting up\u2026",download:"downloading the model\u2026",tokenizer:"tokenizer\u2026",gpu:"weights to the GPU\u2026"},erreurs:{"no-webgpu":"This browser does not support WebGPU: the local assistant cannot run here."}},fr:{ouvrir:"Ouvrir le chat",fermer:"Fermer",placeholder:"\xC9cris un message\u2026",note:"IA locale \u2014 tourne sur votre GPU, aucune donn\xE9e envoy\xE9e.",erreur:"Erreur : ",vide:"D\xE9sol\xE9, je ne peux r\xE9pondre qu\u2019en texte simple ici : pouvez-vous reformuler ?",aide:"Je suis l\xE0 pour vous aider \u2014 que voulez-vous savoir ?",mo:"Mo",sources:"Sources :",phases:{init:"initialisation\u2026",download:"t\xE9l\xE9chargement du mod\xE8le\u2026",tokenizer:"tokenizer\u2026",gpu:"poids sur le GPU\u2026"},erreurs:{"no-webgpu":"Ce navigateur ne prend pas en charge WebGPU : l\u2019assistant local ne peut pas tourner ici."}}};function Oi(f,e){if(!e)return f;let r=n=>typeof n=="string"&&!!n.trim(),t={...f.phases};if(e.phases&&typeof e.phases=="object")for(let[n,s]of Object.entries(e.phases))r(s)&&(t[n]=s);return{...f,...r(e.open)?{ouvrir:e.open}:null,...r(e.close)?{fermer:e.close}:null,...r(e.placeholder)?{placeholder:e.placeholder}:null,...r(e.note)?{note:e.note}:null,...r(e.error)?{erreur:e.error}:null,...r(e.empty)?{vide:e.empty}:null,...r(e.help)?{aide:e.help}:null,...r(e.sources)?{sources:e.sources}:null,...r(e.mb)?{mo:e.mb}:null,phases:t}}var Mi=(f,e)=>f.phases[e]??e,ws=(f,e)=>e?.code&&f.erreurs[e.code]||e?.message||String(e);function Vt(f){let e=Bt(f.tools),r=nn(e)?sn(wt(f)):"",t=(f.system||"You are a helpful assistant.")+(e.length?Fi:Si)+r,n=c=>c.flatMap(l=>[{role:"user",content:l.user},{role:"assistant",content:l.assistant}]),s=e.length?Ti(wt(f)):[];if(!f.knowledge)return{system:()=>t,userTurn:(c,l)=>({text:l?`${c}

${l}`:c,sources:[],conversationnel:!1}),pinned:n([...s,...f.examples||[]])};let i=Jr(en(f.knowledge)),a=f.knowledgeBudget??1200,o=wt(f),u=o?t+`

Le message utilisateur peut inclure des fiches de r\xE9f\xE9rence entre des balises ---. Dans ce cas, r\xE9ponds uniquement \xE0 partir de ces fiches en citant fid\xE8lement leurs informations dans la langue de la question. Si aucune note ne correspond, indique poliment que tu n\u2019as pas cette information.`:t+`

The user message may include reference notes between --- markers. When it does, answer from those notes and quote their figures exactly. When it says no note matches, say you do not have that information.`;return{system:()=>u,userTurn:(c,l)=>{let d=Zr(c,i,a);if(l&&!d.length)return{text:`${c}

${l}`,sources:[],conversationnel:!1};let p=Ut(d.map(m=>m.chunk),c,o).trim(),g=m=>l?`${m}

${l}`:m;return{text:p?`${g(p)}

Question: ${c}`:g(c),sources:p?d.map(({chunk:m,score:w})=>({title:m.title,text:m.text,score:w,doc:m.doc})):[],conversationnel:!d.length&&!tr(c)}},pinned:n([...Ci(o),...s,...f.examples||[]])}}function Ti(f=!1){let e=(r,t)=>`${r}

${qt(t,f)}`;return f?[{user:e("Combien font 45*3 ?",[{name:"calculatrice",result:"45*3 = 135"}]),assistant:"45*3 = 135."},{user:e("Il vous en reste en rayon ?",[{name:"rayon",result:"3 exemplaires en rayon"}]),assistant:"Oui \u2014 il en reste 3 exemplaires en rayon."}]:[{user:e("What is 45*3?",[{name:"calculator",result:"45*3 = 135"}]),assistant:"45*3 = 135."},{user:e("Do you still have some on the shelf?",[{name:"shelf",result:"3 items on the shelf"}]),assistant:"Yes \u2014 3 items are on the shelf."}]}function Ci(f=!1){let e=(n,s)=>({title:n,text:s,doc:0}),r=(n,s)=>`${Ut(n,void 0,f).trim()}

Question: ${s}`,t=(n,s)=>`${Ut(n,s,f).trim()}

Question: ${s}`;return f?[{user:"Bonjour !",assistant:"Bonjour ! Comment puis-je vous aider ?"},{user:r([e("Guide des tailles",`Tableau des correspondances :
- Pointure EU 38 : 24,0 cm (US 6,5)
- Pointure EU 39 : 24,5 cm (US 7,0)
- Pointure EU 41 : 26,0 cm (US 8,0)`)],"Je fais du 41, quelle taille en cm ?"),assistant:"La pointure 41 correspond \xE0 26,0 cm."},{user:r([e("Retours","Les retours sont gratuits sous 14 jours. Le remboursement est effectu\xE9 sous 3 jours ouvr\xE9s.")],"Combien de temps pour retourner un article ?"),assistant:"Vous disposez de 14 jours pour retourner un article."},{user:r([],"Qui a gagn\xE9 la Coupe du Monde 1998 ?"),assistant:"Je n\u2019ai pas cette information dans mes fiches."},{user:t([],"Tu es un robot ?"),assistant:"Je suis un assistant automatique, oui. Comment puis-je vous aider ?"}]:[{user:"Hello!",assistant:"Hello! How can I help you today?"},{user:r([e("Size guide",`Size conversions:
- Size EU 38: 24.0 cm (US 6.5)
- Size EU 39: 24.5 cm (US 7.0)
- Size EU 41: 26.0 cm (US 8.0)`)],"I wear a 41, what is that in cm?"),assistant:"A size 41 is 26.0 cm."},{user:r([e("Returns","Returns are free within 14 days. Refunds are issued within 3 working days.")],"How long do I have to return an item?"),assistant:"You have 14 days to return an item."},{user:r([],"Who won the 1998 World Cup?"),assistant:"I do not have that information in my notes."},{user:t([],"Are you a robot?"),assistant:"I am an automated assistant, yes. How can I help?"}]}function As(f={}){Mr(f);let e=ht(f.model),r=f.maxTokens||220,t=f.knowledge,n=Vt(f),s=wt(f),i=yt(f.history),a=[],o=ys(),u=!1,c=!1,l=!1,d=()=>f.temperature??(t?.25:.55),p=Bt(f.tools),g=m=>{if(u)throw new Error(`brimkern: ${m} impossible pendant une g\xE9n\xE9ration`)};return{async ask(m,w={}){if(c)throw new Error("session d\xE9truite");if(u)throw new Error("g\xE9n\xE9ration d\xE9j\xE0 en cours sur cette session");u=!0,i.push({role:"user",content:m}),o.emit("message",{role:"user",content:m});try{let v=await nr(p,m,s);for(let y of v)o.emit("tool",y);let{text:G,sources:S,conversationnel:O}=n.userTurn(m,qt(v,s));a=S,w.onSources?.(S);let L=[...i.slice(0,-1),{role:"user",content:G}],K=await vt();await K.preload(e,(y,h)=>o.emit("progress",y,h)),l||(l=!0,o.emit("ready"));let x={url:e,history:L,system:n.system(m),maxTokens:r,temperature:d(),pinned:n.pinned},_=await K.turn(x,w.onToken,w.signal);return w.signal?.aborted?(i.pop(),""):(O&&rr(_,s)&&(_=ks[s?"fr":"en"].aide),i.push({role:"assistant",content:_}),o.emit("message",{role:"assistant",content:_,sources:S}),_)}catch(v){throw i.pop(),o.emit("error",v instanceof Error?v:new Error(String(v))),v}finally{u=!1}},reset(){i=[],a=[]},destroy(){c=!0,i=[],a=[],o.clear()},get history(){return i.slice()},get lastSources(){return a.slice()},setHistory(m){g("setHistory"),i=yt(m)},setKnowledge(m){g("setKnowledge"),t=m,n=Vt({...f,knowledge:m}),a=[]},on:o.on}}function Ri(){if(document.getElementById("bk-style"))return;let f=document.createElement("style");f.id="bk-style",f.textContent=`
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
  `,document.head.appendChild(f)}function Li(f){if(!f)return"#c72c1e";if(/^#[0-9a-fA-F]{3,8}$/.test(f))return f;try{if(typeof CSS<"u"&&CSS.supports("color",f)&&!/[{};()]/.test(f))return f}catch{}return"#c72c1e"}function Di(f,e){let r=f.knowledge,t=Vt(f),n=wt(f),s=Oi(ks[n?"fr":"en"],f.labels),i=Li(f.accent),a=f.title||"Assistant",o=f.maxTokens||220,u=Bt(f.tools);Ri();let c=document.createElement("button");c.className="bk-fab",c.setAttribute("aria-label",s.ouvrir),c.textContent="\u{1F4AC}";let l=document.createElement("div");if(l.className="bk-panel",c.style.setProperty("--bk-accent",i),l.style.setProperty("--bk-accent",i),f.position==="bottom-left")for(let F of[c,l])F.style.left="20px",F.style.right="auto";let d=(F,R,H)=>typeof F=="number"&&Number.isFinite(F)?Math.min(H,Math.max(R,Math.round(F))):null,p=d(f.width,300,480),g=d(f.height,380,720);p&&(l.style.width=`${p}px`),g&&(l.style.height=`${g}px`);let m={"--bk-bg":"#211f1c","--bk-surface":"#2c2a26","--bk-border":"#413e38","--bk-border2":"#3a3733","--bk-text":"#f0eee8","--bk-muted":"#a29e93","--bk-muted2":"#c6c2b8"},w=F=>{for(let R of[c,l])for(let[H,Q]of Object.entries(m))F?R.style.setProperty(H,Q):R.style.removeProperty(H)},v=null,G=null;f.theme==="dark"?w(!0):f.theme==="auto"&&typeof matchMedia=="function"&&(v=matchMedia("(prefers-color-scheme: dark)"),w(v.matches),G=F=>w(F.matches),v.addEventListener("change",G)),l.innerHTML=`
    <div class="bk-hd"><span class="bk-dot"></span><span>${It(a)}</span><button class="bk-x" aria-label="${It(s.fermer)}">\xD7</button></div>
    <div class="bk-msgs"></div>
    <div class="bk-foot"><textarea class="bk-in" rows="1" placeholder="${It(s.placeholder)}"></textarea><button class="bk-send">\u2191</button></div>
    <div class="bk-note">${It(s.note)}</div>`,document.body.appendChild(c),document.body.appendChild(l);let S=l.querySelector(".bk-msgs"),O=l.querySelector(".bk-in"),L=l.querySelector(".bk-send"),K=l.querySelector(".bk-x"),x=yt(f.history),_=!1,y=!1,h=!1,k=new AbortController,b=(F,R)=>{let H=document.createElement("div");return H.className=`bk-m ${F==="user"?"bk-u":"bk-a"}`,H.textContent=R,S.appendChild(H),S.scrollTop=S.scrollHeight,H},A=F=>{if(!f.showSources||!F.length)return;let R=document.createElement("div");R.className="bk-src";let H=document.createElement("b");H.textContent=`${s.sources} `,R.appendChild(H),R.appendChild(document.createTextNode(F.map((Q,N)=>`[${N+1}] ${Q.title||Q.text.slice(0,40).replace(/\s+/g," ").trim()+"\u2026"}`).join(" \xB7 "))),S.appendChild(R),S.scrollTop=S.scrollHeight},P=()=>{S.textContent="";for(let F of x)b(F.role,F.content)};x.length?P():f.greeting&&(x.push({role:"assistant",content:f.greeting}),b("assistant",f.greeting));let B=ht(f.model),U=()=>{if(!y){y=!0;let F=b("assistant",s.phases.init);F.classList.add("bk-status"),vt().then(R=>R.preload(B,(H,Q)=>{e.emit("progress",H,Q);let N=Mi(s,H);F.textContent=Q?.total?`${N} ${Math.round(Q.loaded/1048576)} / ${Math.round(Q.total/1048576)} ${s.mo}`:N})).then(()=>{F.remove(),e.emit("ready")}).catch(R=>{F.textContent=s.erreur+ws(s,R),y=!1,e.emit("error",R instanceof Error?R:new Error(String(R)))})}return vt()},q=async F=>{_=!0,L.disabled=!0,x.push({role:"user",content:F}),b("user",F),e.emit("message",{role:"user",content:F});let R=b("assistant","\u2026");try{await U();let H=await nr(u,F,n);for(let D of H)e.emit("tool",D);let{text:Q,sources:N,conversationnel:V}=t.userTurn(F,qt(H,n)),$=[...x.slice(0,-1),{role:"user",content:Q}],C={url:B,history:$,system:t.system(F),maxTokens:o,temperature:r?.25:.55,pinned:t.pinned},M=await(await vt()).turn(C,D=>{R.textContent=D||"\u2026",S.scrollTop=S.scrollHeight},k.signal);return h?"":(M?V&&rr(M,n)&&(M=s.aide):M=s.vide,R.textContent=M,x.push({role:"assistant",content:M}),A(N),e.emit("message",{role:"assistant",content:M,sources:N}),M)}catch(H){throw R.textContent=s.erreur+ws(s,H),e.emit("error",H instanceof Error?H:new Error(String(H))),H}finally{_=!1,L.disabled=!1,h||O.focus()}},T=()=>{let F=O.value.trim();!F||_||h||(O.value="",q(F).catch(()=>{}))},j=F=>{h||l.classList.contains("bk-open")!==F&&(l.classList.toggle("bk-open",F),F&&(O.focus(),U()),e.emit(F?"open":"close"))};return c.onclick=()=>j(!l.classList.contains("bk-open")),K.onclick=()=>j(!1),L.onclick=T,O.onkeydown=F=>{F.key==="Enter"&&!F.shiftKey&&(F.preventDefault(),T())},{open:()=>j(!0),close:()=>j(!1),toggle:()=>j(!l.classList.contains("bk-open")),ask(F){if(h)return Promise.reject(new Error("brimkern: widget d\xE9mont\xE9"));let R=String(F??"").trim();return R?_?Promise.reject(new Error("g\xE9n\xE9ration d\xE9j\xE0 en cours sur ce widget")):(j(!0),q(R)):Promise.reject(new Error("brimkern: ask() attend une question non vide"))},destroy(){h||(h=!0,k.abort(),v&&G&&v.removeEventListener("change",G),c.onclick=null,K.onclick=null,L.onclick=null,O.onkeydown=null,c.remove(),l.remove(),x=[])},setKnowledge(F){r=F,t=Vt({...f,knowledge:F})},setHistory(F){if(_)throw new Error("brimkern: setHistory impossible pendant une g\xE9n\xE9ration");x=yt(F),P()},history:()=>x.slice(),el:l}}function It(f){return f.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}var ji=(f={})=>{let e=ys(),r=null,t=!1,n=!1,s=[],i=o=>{r?o(r):!t&&!n&&s.push(o)},a=()=>{if(!(n||r)){r=Di(f,e);for(let o of s.splice(0))o(r)}};return typeof window>"u"||typeof document>"u"?(t=!0,console.warn("[brimkern] embed() ignor\xE9 : aucun DOM (rendu serveur ?). Appelez-le dans un effet client.")):(Mr(f),document.body?a():window.addEventListener("DOMContentLoaded",a,{once:!0})),{open:()=>i(o=>o.open()),close:()=>i(o=>o.close()),toggle:()=>i(o=>o.toggle()),ask(o){return t?Promise.reject(new Error("brimkern: ask() sans DOM (rendu serveur ?)")):n?Promise.reject(new Error("brimkern: widget d\xE9mont\xE9")):new Promise((u,c)=>i(l=>l.ask(o).then(u,c)))},destroy(){n=!0,s.length=0,r?.destroy(),r=null,e.clear()},setKnowledge:o=>i(u=>u.setKnowledge(o)),setHistory:o=>i(u=>u.setHistory(o)),get history(){return r?r.history():yt(f.history)},get el(){return r?r.el:null},on:e.on}};var Ki=async f=>{if(typeof f!="object"||f===null||typeof f.prompt!="string")throw new TypeError(`Brimkern.generate expects a single object: generate({ prompt: "\u2026", model?, system? }). Received ${typeof f}${typeof f=="object"&&f?" without a `prompt` string":""}.`);return As(f).ask(f.prompt,{onToken:f.onToken,signal:f.signal,onSources:f.onSources})},Ei=(f={})=>(Mr(f),typeof navigator<"u"&&"gpu"in navigator?vt().then(e=>e.preload(ht(f.model),f.onProgress)).then(()=>!0).catch(()=>!1):Promise.resolve(!1)),Hi=f=>typeof navigator>"u"||!("gpu"in navigator)?"unavailable":Or?.state(ht(f))??"idle";typeof window<"u"&&(window.Brimkern={embed:ji,createSession:As,generate:Ki,preload:Ei,status:Hi,runtime:qi});})();
