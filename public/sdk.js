"use strict";(()=>{var ri=Object.defineProperty;var ce=(f,t,r)=>()=>{if(r)throw r[0];try{return f&&(t=f(f=0)),t}catch(e){throw r=[e],e}};var bn=(f,t)=>{for(var r in t)ri(f,r,{get:t[r],enumerable:!0})};function Qe(f){let t=new Float32Array(1),r=new Uint32Array(t.buffer);t[0]=f;let e=r[0],n=e>>16&32768,s=(e>>23&255)-127+15,i=e&8388607;if(s<=0){if(s<-10)return n;let o=(i|8388608)>>>0,u=14-s,c=o>>>u,l=o&(1<<u)-1,d=1<<u-1;return(l>d||l===d&&c&1)&&c++,n|c}return s>=31?n|31743:(i=(i>>13)+(i>>12&1),i===1024&&(i=0,s+=1),n|s<<10|i&1023)}function we(f){let t=f>>15&1,r=f>>10&31,e=f&1023,n;return r===0?n=e*59604645e-15:r===31?n=e?NaN:1/0:n=(1+e/1024)*2**(r-15),t===1?-n:n}var ot=ce(()=>{"use strict"});function Te(f){let t=f.length;if(t%Le!==0)throw new Error(`q4web: length ${t} not a multiple of ${Le}`);let r=t/Le,e=new Uint8Array(t/2),n=new Uint16Array(r),s=new Uint16Array(r);for(let i=0;i<r;i++){let a=i*Le,o=1/0,u=-1/0;for(let m=0;m<Le;m++){let b=f[a+m];b<o&&(o=b),b>u&&(u=b)}let c=(u-o)/15||1e-8,l=Qe(c),d=Qe(o);n[i]=l,s[i]=d;let p=we(l)||1e-8,g=we(d);for(let m=0;m<Le;m++){let b=Math.round((f[a+m]-g)/p);b=b<0?0:b>15?15:b;let v=a+m;(m&1)===0?e[v>>1]=b:e[v>>1]|=b<<4}}return{nibbles:e,scales:n,mins:s,nElems:t}}function Ae(f,t){let r=t/Le,e=t/2,n=f.slice(0,e),s=new Uint16Array(r),i=new Uint16Array(r),a=new DataView(f.buffer,f.byteOffset);for(let o=0;o<r;o++)s[o]=a.getUint16(e+o*2,!0);for(let o=0;o<r;o++)i[o]=a.getUint16(e+r*2+o*2,!0);return{nibbles:n,scales:s,mins:i,nElems:t}}function ye(f){let t=new Float32Array(f.nElems),r=f.nElems/Le;for(let e=0;e<r;e++){let n=we(f.scales[e]),s=we(f.mins[e]),i=e*Le;for(let a=0;a<Le;a++){let o=i+a,u=f.nibbles[o>>1],c=(a&1)===0?u&15:u>>4;t[o]=c*n+s}}return t}var Le,wt=ce(()=>{"use strict";ot();Le=32});function qe(f){let t=f.length;if(t%De!==0)throw new Error(`q8web: length ${t} not a multiple of ${De}`);let r=t/De,e=new Int8Array(t),n=new Uint16Array(r);for(let s=0;s<r;s++){let i=s*De,a=0;for(let l=0;l<De;l++){let d=Math.abs(f[i+l]);d>a&&(a=d)}let o=a/127||1e-8,u=Qe(o);n[s]=u;let c=we(u)||1e-8;for(let l=0;l<De;l++){let d=Math.round(f[i+l]/c);d=d<-127?-127:d>127?127:d,e[i+l]=d}}return{codes:e,scales:n,nElems:t}}function Fe(f,t){let r=t/De,e=new Int8Array(f.buffer.slice(f.byteOffset,f.byteOffset+t)),n=new Uint16Array(r),s=new DataView(f.buffer,f.byteOffset);for(let i=0;i<r;i++)n[i]=s.getUint16(t+i*2,!0);return{codes:e,scales:n,nElems:t}}function ke(f){let t=new Float32Array(f.nElems),r=f.nElems/De;for(let e=0;e<r;e++){let n=we(f.scales[e]),s=e*De;for(let i=0;i<De;i++)t[s+i]=f.codes[s+i]*n}return t}var De,yt=ce(()=>{"use strict";ot();De=32});function Un(f){let t=f.length;if(t%je!==0)throw new Error(`q3web: length ${t} not a multiple of ${je}`);let r=t/je,e=new Uint32Array(t/16),n=new Uint32Array(t/32),s=new Uint16Array(r),i=new Uint16Array(r);for(let a=0;a<r;a++){let o=a*je,u=1/0,c=-1/0;for(let b=0;b<je;b++){let v=f[o+b];v<u&&(u=v),v>c&&(c=v)}let l=(c-u)/7||1e-8,d=Qe(l),p=Qe(u);s[a]=d,i[a]=p;let g=we(d)||1e-8,m=we(p);for(let b=0;b<je;b++){let v=Math.round((f[o+b]-m)/g);v=v<0?0:v>7?7:v;let U=o+b;e[U>>4]|=(v&3)<<(U&15)*2,n[U>>5]|=v>>2<<(U&31)}}return{lo:e,hi:n,scales:s,mins:i,nElems:t}}function Me(f,t){let r=t/je,e=t/16,n=t/32,s=e*4,i=n*4,a=new DataView(f.buffer,f.byteOffset),o=new Uint32Array(e),u=new Uint32Array(n),c=new Uint16Array(r),l=new Uint16Array(r);for(let g=0;g<e;g++)o[g]=a.getUint32(g*4,!0);for(let g=0;g<n;g++)u[g]=a.getUint32(s+g*4,!0);let d=s+i,p=d+r*2;for(let g=0;g<r;g++)c[g]=a.getUint16(d+g*2,!0);for(let g=0;g<r;g++)l[g]=a.getUint16(p+g*2,!0);return{lo:o,hi:u,scales:c,mins:l,nElems:t}}function $e(f){let t=new Float32Array(f.nElems),r=f.nElems/je;for(let e=0;e<r;e++){let n=we(f.scales[e]),s=we(f.mins[e]),i=e*je;for(let a=0;a<je;a++){let o=i+a,u=f.lo[o>>4]>>(o&15)*2&3|(f.hi[o>>5]>>(o&31)&1)<<2;t[o]=u*n+s}}return t}var je,kt=ce(()=>{"use strict";ot();je=32});function qn(f,t,r,e,n){let s=(a,o,u)=>{if(!a.includes(o))throw new Error(`moeGemv : motif absent \xAB ${o} \xBB`);return a.replace(o,u)},i=s(f,"@group(0) @binding(3) var<storage, read_write> c: array<f32>;",`@group(0) @binding(3) var<storage, read_write> c: array<f32>;
		@group(0) @binding(4) var<storage, read> ids: array<u32>;`);return i=s(i,"let col = wid.y * d.stride + wid.x;",`let col = wid.y * d.stride + wid.x;
			let slot = wid.z; let ex = ids[slot]; let arow = slot / d.m;`),i=s(i,t,r),i=s(i,e,n),s(i,"if (tid == 0u && col < d.n) { c[col] = part[0]; }","if (tid == 0u && col < d.n) { c[slot * d.n + col] = part[0]; }")}function Fn(f,t){return`
	struct Dims { S: u32, k: u32, n: u32, aDiv: u32 };
	@group(0) @binding(0) var<uniform> d: Dims;
	@group(0) @binding(1) var<storage, read> a: array<f32>;
	@group(0) @binding(2) var<storage, read> q: array<u32>;
	@group(0) @binding(3) var<storage, read_write> c: array<f32>;
	@group(0) @binding(4) var<storage, read> perm: array<u32>;
	@group(0) @binding(5) var<storage, read> off: array<u32>;
	var<workgroup> As: array<f32, 512>;   // [16 k][32 cases]
	var<workgroup> Ws: array<f32, 1024>;  // [16 k][64 colonnes]
	var<workgroup> mOff: u32;
	var<workgroup> mEnd: u32;
	fn f16d(h: u32) -> f32 {
		let s = (h >> 15u) & 1u; let e = (h >> 10u) & 0x1Fu; let mm = h & 0x3FFu; var v: f32;
		if (e == 0u) { v = f32(mm) * 5.9604645e-8; } else if (e == 31u) { v = 65504.0; }
		else { v = (1.0 + f32(mm) / 1024.0) * pow(2.0, f32(e) - 15.0); }
		return select(v, -v, s == 1u);
	}
	${t}
	@compute @workgroup_size(256)
	fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_index) tid: u32) {
		let ex = wid.z;
		// Bornes lues par un thread puis diffus\xE9es par workgroupUniformLoad : la sortie anticip\xE9e qui
		// suit doit \xEAtre UNIFORME (les barri\xE8res de la boucle l'exigent \u2014 analyse d'uniformit\xE9 WGSL).
		if (tid == 0u) { mOff = off[ex]; mEnd = off[ex + 1u]; }
		let o0 = workgroupUniformLoad(&mOff);
		let cnt = workgroupUniformLoad(&mEnd) - o0;
		let row0 = wid.y * 32u;
		if (row0 >= cnt) { return; }
		let k = d.k; let n = d.n;
		let col0 = wid.x * 64u;
		let aRow = tid >> 3u; let aK = (tid & 7u) * 2u;
		let aOk = row0 + aRow < cnt;
		var aBase = 0u;
		if (aOk) { aBase = (perm[o0 + row0 + aRow] / d.aDiv) * k; }
		let wCol = tid >> 2u; let wK = (tid & 3u) * 4u;
		let wGCol = col0 + wCol;
		let tr = (tid >> 4u) * 2u; let tc = (tid & 15u) * 4u;
		var acc0 = 0.0; var acc1 = 0.0; var acc2 = 0.0; var acc3 = 0.0;
		var acc4 = 0.0; var acc5 = 0.0; var acc6 = 0.0; var acc7 = 0.0;
		for (var kk = 0u; kk < k; kk = kk + 16u) {
			As[aK * 32u + aRow] = select(0.0, a[aBase + kk + aK], aOk);
			As[(aK + 1u) * 32u + aRow] = select(0.0, a[aBase + kk + aK + 1u], aOk);
			var v = vec4<f32>(0.0);
			if (wGCol < n) { v = ${f}(ex * n + wGCol, kk + wK); }
			Ws[wK * 64u + wCol] = v.x;
			Ws[(wK + 1u) * 64u + wCol] = v.y;
			Ws[(wK + 2u) * 64u + wCol] = v.z;
			Ws[(wK + 3u) * 64u + wCol] = v.w;
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
		let gc = col0 + tc;
		if (row0 + tr < cnt) {
			let s = perm[o0 + row0 + tr];
			if (gc < n) { c[s * n + gc] = acc0; }
			if (gc + 1u < n) { c[s * n + gc + 1u] = acc1; }
			if (gc + 2u < n) { c[s * n + gc + 2u] = acc2; }
			if (gc + 3u < n) { c[s * n + gc + 3u] = acc3; }
		}
		if (row0 + tr + 1u < cnt) {
			let s = perm[o0 + row0 + tr + 1u];
			if (gc < n) { c[s * n + gc] = acc4; }
			if (gc + 1u < n) { c[s * n + gc + 1u] = acc5; }
			if (gc + 2u < n) { c[s * n + gc + 2u] = acc6; }
			if (gc + 3u < n) { c[s * n + gc + 3u] = acc7; }
		}
	}`}var Ke,Bn,Sn=ce(()=>{"use strict";Ke={matmul:`
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
		}`,rife_act:`
		struct P { n: u32, leaky: u32, mul: f32, slope: f32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> x: array<f32>;
		@group(0) @binding(2) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let i = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (i >= p.n) { return; }
			let v = x[i] * p.mul;
			o[i] = select(v, v * p.slope, p.leaky == 1u && v < 0.0);
		}`,rife_resconv:`
		struct P { C: u32, HW: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> cv: array<f32>;
		@group(0) @binding(2) var<storage, read> x: array<f32>;
		@group(0) @binding(3) var<storage, read> beta: array<f32>;
		@group(0) @binding(4) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let i = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (i >= p.C * p.HW) { return; }
			let v = cv[i] * beta[i / p.HW] + x[i];
			o[i] = select(v, v * 0.2, v < 0.0);
		}`,conv_transpose2d:`
		struct P { Cin: u32, H: u32, W: u32, Cout: u32, k: u32, s: u32, pad: u32, OH: u32, OW: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> inp: array<f32>;
		@group(0) @binding(2) var<storage, read> w: array<f32>;
		@group(0) @binding(3) var<storage, read> bias: array<f32>;
		@group(0) @binding(4) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let i = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (i >= p.Cout * p.OH * p.OW) { return; }
			let ox = i32(i % p.OW); let oy = i32((i / p.OW) % p.OH); let co = i / (p.OW * p.OH);
			let s = i32(p.s); let pd = i32(p.pad); let k = i32(p.k);
			var acc = bias[co];
			for (var ky = 0; ky < k; ky = ky + 1) {
				let ty = oy + pd - ky;
				if (ty < 0 || ty % s != 0) { continue; }
				let iy = ty / s;
				if (iy >= i32(p.H)) { continue; }
				for (var kx = 0; kx < k; kx = kx + 1) {
					let tx = ox + pd - kx;
					if (tx < 0 || tx % s != 0) { continue; }
					let ix = tx / s;
					if (ix >= i32(p.W)) { continue; }
					for (var ci = 0u; ci < p.Cin; ci = ci + 1u) {
						acc = acc + inp[(ci * p.H + u32(iy)) * p.W + u32(ix)] * w[((ci * p.Cout + co) * p.k + u32(ky)) * p.k + u32(kx)];
					}
				}
			}
			o[i] = acc;
		}`,pixel_shuffle2:`
		struct P { C: u32, H: u32, W: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> x: array<f32>;
		@group(0) @binding(2) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let i = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			let OW = p.W * 2u; let OH = p.H * 2u;
			if (i >= p.C * OH * OW) { return; }
			let ox = i % OW; let oy = (i / OW) % OH; let c = i / (OW * OH);
			let ic = c * 4u + (oy % 2u) * 2u + (ox % 2u);
			o[i] = x[(ic * p.H + oy / 2u) * p.W + ox / 2u];
		}`,resize_bilinear:`
		struct P { C: u32, H: u32, W: u32, OH: u32, OW: u32, ry: f32, rx: f32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> x: array<f32>;
		@group(0) @binding(2) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let i = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (i >= p.C * p.OH * p.OW) { return; }
			let ox = i % p.OW; let oy = (i / p.OW) % p.OH; let c = i / (p.OW * p.OH);
			let sy = max((f32(oy) + 0.5) * p.ry - 0.5, 0.0);
			let sx = max((f32(ox) + 0.5) * p.rx - 0.5, 0.0);
			let y0 = min(u32(sy), p.H - 1u); let x0 = min(u32(sx), p.W - 1u);
			let y1 = min(y0 + 1u, p.H - 1u); let x1 = min(x0 + 1u, p.W - 1u);
			let ly = sy - f32(y0); let lx = sx - f32(x0);
			let b = c * p.H * p.W;
			let top = x[b + y0 * p.W + x0] * (1.0 - lx) + x[b + y0 * p.W + x1] * lx;
			let bot = x[b + y1 * p.W + x0] * (1.0 - lx) + x[b + y1 * p.W + x1] * lx;
			o[i] = top * (1.0 - ly) + bot * ly;
		}`,warp_bilinear:`
		struct P { C: u32, H: u32, W: u32, fc: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> x: array<f32>;
		@group(0) @binding(2) var<storage, read> flow: array<f32>;
		@group(0) @binding(3) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let i = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			let HW = p.H * p.W;
			if (i >= p.C * HW) { return; }
			let px = i % HW; let c = i / HW;
			let xx = f32(px % p.W); let yy = f32(px / p.W);
			let sx = clamp(xx + flow[p.fc * HW + px], 0.0, f32(p.W - 1u));
			let sy = clamp(yy + flow[(p.fc + 1u) * HW + px], 0.0, f32(p.H - 1u));
			let x0 = u32(floor(sx)); let y0 = u32(floor(sy));
			let x1 = min(x0 + 1u, p.W - 1u); let y1 = min(y0 + 1u, p.H - 1u);
			let lx = sx - f32(x0); let ly = sy - f32(y0);
			let b = c * HW;
			let top = x[b + y0 * p.W + x0] * (1.0 - lx) + x[b + y0 * p.W + x1] * lx;
			let bot = x[b + y1 * p.W + x0] * (1.0 - lx) + x[b + y1 * p.W + x1] * lx;
			o[i] = top * (1.0 - ly) + bot * ly;
		}`,rife_blend:`
		struct P { C: u32, HW: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> w0: array<f32>;
		@group(0) @binding(2) var<storage, read> w1: array<f32>;
		@group(0) @binding(3) var<storage, read> m: array<f32>;
		@group(0) @binding(4) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let i = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (i >= p.C * p.HW) { return; }
			let sg = 1.0 / (1.0 + exp(-m[i % p.HW]));
			o[i] = w0[i] * sg + w1[i] * (1.0 - sg);
		}`,conv3d_igemm_q8:`
		struct P { Cin: u32, T: u32, H: u32, W: u32, Cout: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> inp: array<f32>;
		@group(0) @binding(2) var<storage, read> codes: array<u32>;
		@group(0) @binding(3) var<storage, read> sc: array<u32>;
		@group(0) @binding(4) var<storage, read> bias: array<f32>;
		@group(0) @binding(5) var<storage, read_write> o: array<f32>;
		var<workgroup> Asv: array<vec4<f32>, 256>;
		var<workgroup> Wsv: array<vec4<f32>, 512>;
		fn f16d(h: u32) -> f32 {
			let s = (h >> 15u) & 1u; let e = (h >> 10u) & 0x1Fu; let mm = h & 0x3FFu; var v: f32;
			if (e == 0u) { v = f32(mm) * 5.9604645e-8; } else if (e == 31u) { v = 65504.0; }
			else { v = (1.0 + f32(mm) / 1024.0) * pow(2.0, f32(e) - 15.0); }
			return select(v, -v, s == 1u);
		}
		fn q8x4(word: u32, s: f32) -> vec4<f32> {
			return vec4<f32>(f32(i32(word << 24u) >> 24u), f32(i32(word << 16u) >> 24u), f32(i32(word << 8u) >> 24u), f32(i32(word) >> 24u)) * s;
		}
		fn wvec(col: u32, kp: u32, k: u32) -> vec4<f32> {
			if (col >= p.Cout) { return vec4<f32>(0.0); }
			let idx = col * k + kp;
			let si = idx >> 5u;
			let sw = sc[si >> 1u];
			return q8x4(codes[idx >> 2u], f16d(select(sw & 0xFFFFu, sw >> 16u, (si & 1u) == 1u)));
		}
		fn px(r: u32, m: u32, ci: u32, kt: u32, kh: u32, kw: u32) -> f32 {
			if (r >= m) { return 0.0; }
			let HW = p.H * p.W;
			let t = r / HW; let rem = r - t * HW; let y = rem / p.W; let x = rem - y * p.W;
			let it = clamp(i32(t) + i32(kt) - 1, 0, i32(p.T) - 1);
			let iy = i32(y) + i32(kh) - 1; let ix = i32(x) + i32(kw) - 1;
			if (iy < 0 || ix < 0 || iy >= i32(p.H) || ix >= i32(p.W)) { return 0.0; }
			return inp[((ci * p.T + u32(it)) * p.H + u32(iy)) * p.W + u32(ix)];
		}
		fn st(r: u32, col: u32, m: u32, v: f32) {
			if (r < m && col < p.Cout) { o[col * m + r] = v + bias[col]; }
		}
		fn st4(r: u32, c0: u32, m: u32, v: vec4<f32>) {
			st(r, c0, m, v.x); st(r, c0 + 1u, m, v.y); st(r, c0 + 2u, m, v.z); st(r, c0 + 3u, m, v.w);
		}
		@compute @workgroup_size(256)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_index) tid: u32) {
			let m = p.T * p.H * p.W;
			let k = p.Cin * 27u;
			let row0 = wid.y * 64u;
			let col0 = wid.x * 128u;
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
						v0 = wvec(cBase, kp, k); v1 = wvec(cBase + 1u, kp, k);
						v2 = wvec(cBase + 2u, kp, k); v3 = wvec(cBase + 3u, kp, k);
					}
					let wb = (wKq * 4u) * 32u + wCG;
					Wsv[wb] = vec4<f32>(v0.x, v1.x, v2.x, v3.x);
					Wsv[wb + 32u] = vec4<f32>(v0.y, v1.y, v2.y, v3.y);
					Wsv[wb + 64u] = vec4<f32>(v0.z, v1.z, v2.z, v3.z);
					Wsv[wb + 96u] = vec4<f32>(v0.w, v1.w, v2.w, v3.w);
				} else {
					for (var q = 0u; q < 2u; q = q + 1u) {
						let slot = tA * 2u + q;
						let aK = slot >> 4u; let aRG = slot & 15u;
						let kp = kk + aK;
						let ar = row0 + aRG * 4u;
						var av = vec4<f32>(0.0);
						if (kp < k) {
							let ci = kp / 27u; let rr = kp - ci * 27u;
							let kt = rr / 9u; let kh = (rr / 3u) % 3u; let kw = rr % 3u;
							av = vec4<f32>(px(ar, m, ci, kt, kh, kw), px(ar + 1u, m, ci, kt, kh, kw), px(ar + 2u, m, ci, kt, kh, kw), px(ar + 3u, m, ci, kt, kh, kw));
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
			let gr = row0 + tr; let gc = col0 + tc;
			st4(gr, gc, m, r00); st4(gr, gc + 4u, m, r01);
			st4(gr + 1u, gc, m, r10); st4(gr + 1u, gc + 4u, m, r11);
			st4(gr + 2u, gc, m, r20); st4(gr + 2u, gc + 4u, m, r21);
			st4(gr + 3u, gc, m, r30); st4(gr + 3u, gc + 4u, m, r31);
		}`,attention_bias:`
		struct P { L: u32, H: u32, DK: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> q: array<f32>;
		@group(0) @binding(2) var<storage, read> k: array<f32>;
		@group(0) @binding(3) var<storage, read> v: array<f32>;
		@group(0) @binding(4) var<storage, read> bias: array<f32>;
		@group(0) @binding(5) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let idx = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (idx >= p.L * p.H) { return; }
			let i = idx / p.H; let h = idx % p.H;
			let D = p.H * p.DK;
			var sc: array<f32, 256>;
			var mx = -3.0e38;
			for (var j = 0u; j < p.L; j = j + 1u) {
				var acc = 0.0;
				for (var d = 0u; d < p.DK; d = d + 1u) { acc = acc + q[i * D + h * p.DK + d] * k[j * D + h * p.DK + d]; }
				let sv = acc + bias[(h * p.L + i) * p.L + j];
				sc[j] = sv; mx = max(mx, sv);
			}
			var den = 0.0;
			for (var j = 0u; j < p.L; j = j + 1u) { let e = exp(sc[j] - mx); sc[j] = e; den = den + e; }
			let inv = 1.0 / den;
			for (var d = 0u; d < p.DK; d = d + 1u) {
				var acc = 0.0;
				for (var j = 0u; j < p.L; j = j + 1u) { acc = acc + sc[j] * v[j * D + h * p.DK + d]; }
				o[i * D + h * p.DK + d] = acc * inv;
			}
		}`,rope_ltx:`
		struct P { rows: u32, half: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> x: array<f32>;
		@group(0) @binding(2) var<storage, read> cs: array<f32>;
		@group(0) @binding(3) var<storage, read> sn: array<f32>;
		@group(0) @binding(4) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let i = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (i >= p.rows * p.half) { return; }
			let x0 = x[2u * i]; let x1 = x[2u * i + 1u]; let c = cs[i]; let s = sn[i];
			o[2u * i] = x0 * c - x1 * s;
			o[2u * i + 1u] = x1 * c + x0 * s;
		}`,ltx_modulate:`
		struct P { rows: u32, dim: u32, shiftOff: u32, scaleOff: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> x: array<f32>;
		@group(0) @binding(2) var<storage, read> ada: array<f32>;
		@group(0) @binding(3) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let i = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (i >= p.rows * p.dim) { return; }
			let c = i % p.dim;
			o[i] = x[i] * (1.0 + ada[p.scaleOff + c]) + ada[p.shiftOff + c];
		}`,ltx_gated_add:`
		struct P { rows: u32, dim: u32, gateOff: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> x: array<f32>;
		@group(0) @binding(2) var<storage, read> y: array<f32>;
		@group(0) @binding(3) var<storage, read> ada: array<f32>;
		@group(0) @binding(4) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let i = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (i >= p.rows * p.dim) { return; }
			o[i] = x[i] + ada[p.gateOff + (i % p.dim)] * y[i];
		}`,ltx_norm_act:`
		struct P { C: u32, S: u32, shiftOff: u32, scaleOff: u32, eps: f32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> x: array<f32>;
		@group(0) @binding(2) var<storage, read> ada: array<f32>;
		@group(0) @binding(3) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let s = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (s >= p.S) { return; }
			var ss = 0.0;
			for (var c = 0u; c < p.C; c = c + 1u) { let v = x[c * p.S + s]; ss = ss + v * v; }
			let inv = inverseSqrt(ss / f32(p.C) + p.eps);
			for (var c = 0u; c < p.C; c = c + 1u) {
				let v = x[c * p.S + s] * inv * (1.0 + ada[p.scaleOff + c]) + ada[p.shiftOff + c];
				o[c * p.S + s] = v / (1.0 + exp(-v));
			}
		}`,ltx_d2s:`
		struct P { C: u32, T: u32, H: u32, W: u32, Cres: u32, hasRes: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> cv: array<f32>;
		@group(0) @binding(2) var<storage, read> res: array<f32>;
		@group(0) @binding(3) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let idx = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			let OT = 2u * p.T - 1u; let OH = 2u * p.H; let OW = 2u * p.W;
			if (idx >= p.C * OT * OH * OW) { return; }
			let ox = idx % OW; let oy = (idx / OW) % OH; let ot = (idx / (OW * OH)) % OT; let c = idx / (OW * OH * OT);
			let f = ot + 1u; let t = f / 2u; let stt = f % 2u;
			let h = oy / 2u; let sh = oy % 2u; let w = ox / 2u; let sw = ox % 2u;
			let HW = p.H * p.W;
			let cin = ((c * 2u + stt) * 2u + sh) * 2u + sw;
			var v = cv[(cin * p.T + t) * HW + h * p.W + w];
			if (p.hasRes == 1u) {
				let cr = c % (p.Cres / 8u);
				let rin = ((cr * 2u + stt) * 2u + sh) * 2u + sw;
				v = v + res[(rin * p.T + t) * HW + h * p.W + w];
			}
			o[idx] = v;
		}`,ltx_unpatchify:`
		struct P { C: u32, T: u32, H: u32, W: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> x: array<f32>;
		@group(0) @binding(2) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let idx = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			let OH = 4u * p.H; let OW = 4u * p.W;
			if (idx >= p.C * p.T * OH * OW) { return; }
			let ox = idx % OW; let oy = (idx / OW) % OH; let t = (idx / (OW * OH)) % p.T; let c = idx / (OW * OH * p.T);
			let h = oy / 4u; let pb = oy % 4u; let w = ox / 4u; let pa = ox % 4u;
			let cin = (c * 4u + pa) * 4u + pb;
			o[idx] = x[(cin * p.T + t) * p.H * p.W + h * p.W + w];
		}`,conv2d_igemm_q8:`
		struct P { Cin: u32, H: u32, W: u32, Cout: u32, kh: u32, kw: u32, stride: u32, pad: u32, OH: u32, OW: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> inp: array<f32>;
		@group(0) @binding(2) var<storage, read> codes: array<u32>;
		@group(0) @binding(3) var<storage, read> sc: array<u32>;
		@group(0) @binding(4) var<storage, read> bias: array<f32>;
		@group(0) @binding(5) var<storage, read_write> o: array<f32>;
		var<workgroup> Asv: array<vec4<f32>, 256>;  // [16 k][16 groupes de 4 pixels]
		var<workgroup> Wsv: array<vec4<f32>, 512>;  // [16 k][32 groupes de 4 canaux]
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
		fn wvec(col: u32, kp: u32, k: u32) -> vec4<f32> {
			if (col >= p.Cout) { return vec4<f32>(0.0); }
			let idx = col * k + kp;
			let si = idx >> 5u;
			let sw = sc[si >> 1u];
			return q8x4(codes[idx >> 2u], f16d(select(sw & 0xFFFFu, sw >> 16u, (si & 1u) == 1u)));
		}
		fn px(r: u32, m: u32, ci: u32, ky: u32, kx: u32) -> f32 {
			if (r >= m) { return 0.0; }
			let oy = r / p.OW; let ox = r - oy * p.OW;
			let iy = i32(oy * p.stride + ky) - i32(p.pad);
			let ix = i32(ox * p.stride + kx) - i32(p.pad);
			if (iy < 0 || ix < 0 || iy >= i32(p.H) || ix >= i32(p.W)) { return 0.0; }
			return inp[(ci * p.H + u32(iy)) * p.W + u32(ix)];
		}
		fn st(r: u32, col: u32, m: u32, v: f32) {
			if (r < m && col < p.Cout) { o[col * m + r] = v + bias[col]; }
		}
		fn st4(r: u32, c0: u32, m: u32, v: vec4<f32>) {
			st(r, c0, m, v.x); st(r, c0 + 1u, m, v.y); st(r, c0 + 2u, m, v.z); st(r, c0 + 3u, m, v.w);
		}
		@compute @workgroup_size(256)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_index) tid: u32) {
			let m = p.OH * p.OW;
			let khw = p.kh * p.kw;
			let k = p.Cin * khw;
			let row0 = wid.y * 64u;
			let col0 = wid.x * 128u;
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
						v0 = wvec(cBase, kp, k); v1 = wvec(cBase + 1u, kp, k);
						v2 = wvec(cBase + 2u, kp, k); v3 = wvec(cBase + 3u, kp, k);
					}
					// Transposition 4\xD74 en registres : composantes STATIQUES uniquement (le\xE7on Metal du GEMM v2).
					let wb = (wKq * 4u) * 32u + wCG;
					Wsv[wb] = vec4<f32>(v0.x, v1.x, v2.x, v3.x);
					Wsv[wb + 32u] = vec4<f32>(v0.y, v1.y, v2.y, v3.y);
					Wsv[wb + 64u] = vec4<f32>(v0.z, v1.z, v2.z, v3.z);
					Wsv[wb + 96u] = vec4<f32>(v0.w, v1.w, v2.w, v3.w);
				} else {
					for (var q = 0u; q < 2u; q = q + 1u) {
						let slot = tA * 2u + q;
						let aK = slot >> 4u; let aRG = slot & 15u;
						let kp = kk + aK;
						let ar = row0 + aRG * 4u;
						var av = vec4<f32>(0.0);
						if (kp < k) {
							let ci = kp / khw; let rr = kp - ci * khw;
							let ky = rr / p.kw; let kx = rr - ky * p.kw;
							av = vec4<f32>(px(ar, m, ci, ky, kx), px(ar + 1u, m, ci, ky, kx), px(ar + 2u, m, ci, ky, kx), px(ar + 3u, m, ci, ky, kx));
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
			let gr = row0 + tr; let gc = col0 + tc;
			st4(gr, gc, m, r00); st4(gr, gc + 4u, m, r01);
			st4(gr + 1u, gc, m, r10); st4(gr + 1u, gc + 4u, m, r11);
			st4(gr + 2u, gc, m, r20); st4(gr + 2u, gc + 4u, m, r21);
			st4(gr + 3u, gc, m, r30); st4(gr + 3u, gc + 4u, m, r31);
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
		}`,matmul_t_q8_vec2:`
		struct Dims { m: u32, k: u32, n: u32, stride: u32 };
		@group(0) @binding(0) var<uniform> d: Dims;
		@group(0) @binding(1) var<storage, read> a: array<vec4<f32>>;
		@group(0) @binding(2) var<storage, read> codes: array<u32>;
		@group(0) @binding(3) var<storage, read> sc: array<u32>;
		@group(0) @binding(4) var<storage, read_write> c: array<f32>;
		var<workgroup> p0: array<f32, 64>;
		var<workgroup> p1: array<f32, 64>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let col = wid.y * d.stride + wid.x;
			let tid = lid.x;
			let kv = d.k / 4u;
			let nGroups = d.k / 32u;
			var a0 = 0.0; var a1 = 0.0;
			if (col < d.n) {
				let wordCol = col * kv; let gBase = col * nGroups;
				for (var g = tid; g < nGroups; g = g + 64u) {
					let si = gBase + g;
					let s = unpack2x16float(sc[si >> 1u])[si & 1u];
					let w0 = wordCol + g * 8u; let aBase = g * 8u;
					var s0 = 0.0; var s1 = 0.0;
					for (var j = 0u; j < 8u; j = j + 1u) {
						let word = codes[w0 + j];
						let q = vec4<f32>(f32(i32(word << 24u) >> 24u), f32(i32(word << 16u) >> 24u), f32(i32(word << 8u) >> 24u), f32(i32(word) >> 24u));
						s0 = s0 + dot(a[aBase + j], q);
						s1 = s1 + dot(a[kv + aBase + j], q);
					}
					a0 = a0 + s0 * s; a1 = a1 + s1 * s;
				}
			}
			p0[tid] = a0; p1[tid] = a1;
			workgroupBarrier();
			for (var st = 32u; st > 0u; st = st >> 1u) {
				if (tid < st) { p0[tid] = p0[tid] + p0[tid + st]; p1[tid] = p1[tid] + p1[tid + st]; }
				workgroupBarrier();
			}
			if (tid == 0u && col < d.n) { c[col] = p0[0]; c[d.n + col] = p1[0]; }
		}`,matmul_t_q4k_vec2:`
		struct Dims { m: u32, k: u32, n: u32, stride: u32 };
		@group(0) @binding(0) var<uniform> d: Dims;
		@group(0) @binding(1) var<storage, read> a: array<vec4<f32>>;
		@group(0) @binding(2) var<storage, read> q: array<u32>;
		@group(0) @binding(3) var<storage, read_write> c: array<f32>;
		var<workgroup> p0: array<f32, 64>;
		var<workgroup> p1: array<f32, 64>;
		fn byteAt(base: u32, k: u32) -> u32 { return (q[base + (k >> 2u)] >> ((k & 3u) * 8u)) & 0xFFu; }
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let col = wid.y * d.stride + wid.x;
			let tid = lid.x;
			let kv = d.k / 4u;
			let nSub = d.k / 32u;
			var a0 = 0.0; var a1 = 0.0;
			if (col < d.n) {
				let rowBase = col * (d.k / 256u) * 36u;
				for (var g = tid; g < nSub; g = g + 64u) {
					let base = rowBase + (g >> 3u) * 36u;
					let j = g & 7u;
					var sc6: u32; var mn6: u32;
					if (j < 4u) {
						sc6 = byteAt(base, 4u + j) & 63u;
						mn6 = byteAt(base, 8u + j) & 63u;
					} else {
						sc6 = (byteAt(base, 8u + j) & 0xFu) | ((byteAt(base, j) >> 6u) << 4u);
						mn6 = (byteAt(base, 8u + j) >> 4u) | ((byteAt(base, 4u + j) >> 6u) << 4u);
					}
					let dm = unpack2x16float(q[base]);
					let w0 = base + 4u + (j >> 1u) * 8u;
					let sh = (j & 1u) * 4u;
					let aBase = g * 8u;
					var s0 = 0.0; var t0 = 0.0; var s1 = 0.0; var t1 = 0.0;
					for (var w = 0u; w < 8u; w = w + 1u) {
						let word = q[w0 + w] >> sh;
						let v = vec4<f32>(f32(word & 0xFu), f32((word >> 8u) & 0xFu), f32((word >> 16u) & 0xFu), f32((word >> 24u) & 0xFu));
						let x0 = a[aBase + w]; let x1 = a[kv + aBase + w];
						s0 = s0 + dot(x0, v); t0 = t0 + x0.x + x0.y + x0.z + x0.w;
						s1 = s1 + dot(x1, v); t1 = t1 + x1.x + x1.y + x1.z + x1.w;
					}
					let dd = dm.x * f32(sc6); let mm = dm.y * f32(mn6);
					a0 = a0 + dd * s0 - mm * t0; a1 = a1 + dd * s1 - mm * t1;
				}
			}
			p0[tid] = a0; p1[tid] = a1;
			workgroupBarrier();
			for (var st = 32u; st > 0u; st = st >> 1u) {
				if (tid < st) { p0[tid] = p0[tid] + p0[tid + st]; p1[tid] = p1[tid] + p1[tid + st]; }
				workgroupBarrier();
			}
			if (tid == 0u && col < d.n) { c[col] = p0[0]; c[d.n + col] = p1[0]; }
		}`,matmul_t_q8_vecm:`
		struct Dims { m: u32, k: u32, n: u32, stride: u32 };
		@group(0) @binding(0) var<uniform> d: Dims;
		@group(0) @binding(1) var<storage, read> a: array<vec4<f32>>;
		@group(0) @binding(2) var<storage, read> codes: array<u32>;
		@group(0) @binding(3) var<storage, read> sc: array<u32>;
		@group(0) @binding(4) var<storage, read_write> c: array<f32>;
		var<workgroup> part: array<f32, 1024>;
		@compute @workgroup_size(128)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let lane = lid.x & 31u;
			let col = (wid.y * d.stride + wid.x) * 4u + (lid.x >> 5u);
			let kv = d.k / 4u;
			var a0 = 0.0; var a1 = 0.0; var a2 = 0.0; var a3 = 0.0;
			var a4 = 0.0; var a5 = 0.0; var a6 = 0.0; var a7 = 0.0;
			if (col < d.n) {
				let nGroups = d.k / 32u;
				let wordCol = col * kv; let gBase = col * nGroups;
				for (var g = lane; g < nGroups; g = g + 32u) {
					let si = gBase + g;
					let s = unpack2x16float(sc[si >> 1u])[si & 1u];
					let w0 = wordCol + g * 8u; let aBase = g * 8u;
					for (var j = 0u; j < 8u; j = j + 1u) {
						let word = codes[w0 + j];
						let v = vec4<f32>(f32(i32(word << 24u) >> 24u), f32(i32(word << 16u) >> 24u), f32(i32(word << 8u) >> 24u), f32(i32(word) >> 24u)) * s;
						let o = aBase + j;
						a0 = a0 + dot(a[o], v);
						if (d.m > 1u) { a1 = a1 + dot(a[kv + o], v); }
						if (d.m > 2u) { a2 = a2 + dot(a[2u * kv + o], v); }
						if (d.m > 3u) { a3 = a3 + dot(a[3u * kv + o], v); }
						if (d.m > 4u) { a4 = a4 + dot(a[4u * kv + o], v); }
						if (d.m > 5u) { a5 = a5 + dot(a[5u * kv + o], v); }
						if (d.m > 6u) { a6 = a6 + dot(a[6u * kv + o], v); }
						if (d.m > 7u) { a7 = a7 + dot(a[7u * kv + o], v); }
					}
				}
			}
			// R\xE9duction : les 32 voies de CHAQUE colonne, lignes < m seulement.
			part[lid.x] = a0; part[128u + lid.x] = a1; part[256u + lid.x] = a2; part[384u + lid.x] = a3;
			part[512u + lid.x] = a4; part[640u + lid.x] = a5; part[768u + lid.x] = a6; part[896u + lid.x] = a7;
			workgroupBarrier();
			for (var st = 16u; st > 0u; st = st >> 1u) {
				if (lane < st) {
					for (var r = 0u; r < d.m; r = r + 1u) { part[r * 128u + lid.x] = part[r * 128u + lid.x] + part[r * 128u + lid.x + st]; }
				}
				workgroupBarrier();
			}
			if (lane < d.m && col < d.n) { c[lane * d.n + col] = part[lane * 128u + (lid.x & ~31u)]; }
		}`,matmul_t_q4_vecm:`
		struct Dims { m: u32, k: u32, n: u32, stride: u32 };
		@group(0) @binding(0) var<uniform> d: Dims;
		@group(0) @binding(1) var<storage, read> a: array<vec4<f32>>;
		@group(0) @binding(2) var<storage, read> nib: array<u32>;
		@group(0) @binding(3) var<storage, read> sc: array<u32>;
		@group(0) @binding(4) var<storage, read> mn: array<u32>;
		@group(0) @binding(5) var<storage, read_write> c: array<f32>;
		var<workgroup> part: array<f32, 1024>;
		@compute @workgroup_size(128)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let lane = lid.x & 31u;
			let col = (wid.y * d.stride + wid.x) * 4u + (lid.x >> 5u);
			let kv = d.k / 4u;
			var a0 = 0.0; var a1 = 0.0; var a2 = 0.0; var a3 = 0.0;
			var a4 = 0.0; var a5 = 0.0; var a6 = 0.0; var a7 = 0.0;
			if (col < d.n) {
				let nGroups = d.k / 32u;
				let wordCol = col * (d.k / 8u); let gBase = col * nGroups;
				for (var g = lane; g < nGroups; g = g + 32u) {
					let si = gBase + g;
					let s = unpack2x16float(sc[si >> 1u])[si & 1u];
					let mnv = unpack2x16float(mn[si >> 1u])[si & 1u];
					let w0 = wordCol + g * 4u; let aBase = g * 8u;
					for (var j = 0u; j < 8u; j = j + 1u) {
						let word = nib[w0 + (j >> 1u)] >> ((j & 1u) * 16u);
						let v = vec4<f32>(f32(word & 0xFu), f32((word >> 4u) & 0xFu), f32((word >> 8u) & 0xFu), f32((word >> 12u) & 0xFu)) * s + vec4<f32>(mnv);
						let o = aBase + j;
						a0 = a0 + dot(a[o], v);
						if (d.m > 1u) { a1 = a1 + dot(a[kv + o], v); }
						if (d.m > 2u) { a2 = a2 + dot(a[2u * kv + o], v); }
						if (d.m > 3u) { a3 = a3 + dot(a[3u * kv + o], v); }
						if (d.m > 4u) { a4 = a4 + dot(a[4u * kv + o], v); }
						if (d.m > 5u) { a5 = a5 + dot(a[5u * kv + o], v); }
						if (d.m > 6u) { a6 = a6 + dot(a[6u * kv + o], v); }
						if (d.m > 7u) { a7 = a7 + dot(a[7u * kv + o], v); }
					}
				}
			}
			// R\xE9duction : les 32 voies de CHAQUE colonne, lignes < m seulement.
			part[lid.x] = a0; part[128u + lid.x] = a1; part[256u + lid.x] = a2; part[384u + lid.x] = a3;
			part[512u + lid.x] = a4; part[640u + lid.x] = a5; part[768u + lid.x] = a6; part[896u + lid.x] = a7;
			workgroupBarrier();
			for (var st = 16u; st > 0u; st = st >> 1u) {
				if (lane < st) {
					for (var r = 0u; r < d.m; r = r + 1u) { part[r * 128u + lid.x] = part[r * 128u + lid.x] + part[r * 128u + lid.x + st]; }
				}
				workgroupBarrier();
			}
			if (lane < d.m && col < d.n) { c[lane * d.n + col] = part[lane * 128u + (lid.x & ~31u)]; }
		}`,matmul_t_q4k_vecm:`
		struct Dims { m: u32, k: u32, n: u32, stride: u32 };
		@group(0) @binding(0) var<uniform> d: Dims;
		@group(0) @binding(1) var<storage, read> a: array<vec4<f32>>;
		@group(0) @binding(2) var<storage, read> q: array<u32>;
		@group(0) @binding(3) var<storage, read_write> c: array<f32>;
		fn byteAt(base: u32, k: u32) -> u32 { return (q[base + (k >> 2u)] >> ((k & 3u) * 8u)) & 0xFFu; }
		var<workgroup> part: array<f32, 1024>;
		@compute @workgroup_size(128)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let lane = lid.x & 31u;
			let col = (wid.y * d.stride + wid.x) * 4u + (lid.x >> 5u);
			let kv = d.k / 4u;
			var a0 = 0.0; var a1 = 0.0; var a2 = 0.0; var a3 = 0.0;
			var a4 = 0.0; var a5 = 0.0; var a6 = 0.0; var a7 = 0.0;
			if (col < d.n) {
				let nSub = d.k / 32u;
				let rowBase = col * (d.k / 256u) * 36u;
				for (var g = lane; g < nSub; g = g + 32u) {
					let base = rowBase + (g >> 3u) * 36u;
					let j8 = g & 7u;
					var sc6: u32; var mn6: u32;
					if (j8 < 4u) {
						sc6 = byteAt(base, 4u + j8) & 63u;
						mn6 = byteAt(base, 8u + j8) & 63u;
					} else {
						sc6 = (byteAt(base, 8u + j8) & 0xFu) | ((byteAt(base, j8) >> 6u) << 4u);
						mn6 = (byteAt(base, 8u + j8) >> 4u) | ((byteAt(base, 4u + j8) >> 6u) << 4u);
					}
					let dm = unpack2x16float(q[base]);
					let dd = dm.x * f32(sc6);
					let mm = dm.y * f32(mn6);
					let w0 = base + 4u + (j8 >> 1u) * 8u;
					let sh = (j8 & 1u) * 4u;
					let aBase = g * 8u;
					for (var w = 0u; w < 8u; w = w + 1u) {
						let word = q[w0 + w] >> sh;
						let v = vec4<f32>(f32(word & 0xFu), f32((word >> 8u) & 0xFu), f32((word >> 16u) & 0xFu), f32((word >> 24u) & 0xFu)) * dd - vec4<f32>(mm);
						let o = aBase + w;
						a0 = a0 + dot(a[o], v);
						if (d.m > 1u) { a1 = a1 + dot(a[kv + o], v); }
						if (d.m > 2u) { a2 = a2 + dot(a[2u * kv + o], v); }
						if (d.m > 3u) { a3 = a3 + dot(a[3u * kv + o], v); }
						if (d.m > 4u) { a4 = a4 + dot(a[4u * kv + o], v); }
						if (d.m > 5u) { a5 = a5 + dot(a[5u * kv + o], v); }
						if (d.m > 6u) { a6 = a6 + dot(a[6u * kv + o], v); }
						if (d.m > 7u) { a7 = a7 + dot(a[7u * kv + o], v); }
					}
				}
			}
			// R\xE9duction : les 32 voies de CHAQUE colonne, lignes < m seulement.
			part[lid.x] = a0; part[128u + lid.x] = a1; part[256u + lid.x] = a2; part[384u + lid.x] = a3;
			part[512u + lid.x] = a4; part[640u + lid.x] = a5; part[768u + lid.x] = a6; part[896u + lid.x] = a7;
			workgroupBarrier();
			for (var st = 16u; st > 0u; st = st >> 1u) {
				if (lane < st) {
					for (var r = 0u; r < d.m; r = r + 1u) { part[r * 128u + lid.x] = part[r * 128u + lid.x] + part[r * 128u + lid.x + st]; }
				}
				workgroupBarrier();
			}
			if (lane < d.m && col < d.n) { c[lane * d.n + col] = part[lane * 128u + (lid.x & ~31u)]; }
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
		}`,matmul_t_pq2_vec:`
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
		fn word2(b: u32) -> u32 {
			let i = b >> 2u;
			if ((b & 3u) == 0u) { return q[i]; }
			return (q[i] >> 16u) | (q[i + 1u] << 16u);
		}
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let col = wid.y * d.stride + wid.x;
			let tid = lid.x;
			let nU = d.k / 16u;
			var acc = 0.0;
			if (col < d.n) {
				let rowBase = col * (d.k / 128u) * 34u;
				for (var u = tid; u < nU; u = u + 64u) {
					let base = rowBase + (u >> 3u) * 34u;
					let dw = q[base >> 2u];
					let dh = select(dw & 0xFFFFu, dw >> 16u, (base & 2u) != 0u);
					let w = word2(base + 2u + (u & 7u) * 4u);
					let aBase = u * 4u;
					var s = 0.0; var sa = 0.0;
					for (var v = 0u; v < 4u; v = v + 1u) {
						let x = w >> (v * 8u);
						let qv = vec4<f32>(f32(x & 3u), f32((x >> 2u) & 3u), f32((x >> 4u) & 3u), f32((x >> 6u) & 3u));
						let av = a[aBase + v];
						s = s + dot(av, qv);
						sa = sa + av.x + av.y + av.z + av.w;
					}
					acc = acc + f16d(dh) * (s - sa);
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
		}`,moe_route:`
		struct P { T: u32, E: u32, K: u32, scale: f32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> lg: array<f32>;
		@group(0) @binding(2) var<storage, read_write> ids: array<u32>;
		@group(0) @binding(3) var<storage, read_write> w: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
			let t = gid.x;
			if (t >= p.T) { return; }
			var sel: array<u32, 16>;
			var val: array<f32, 16>;
			for (var j = 0u; j < p.K; j = j + 1u) {
				var best = 0xFFFFFFFFu; var bv = -3.4e38;
				for (var i = 0u; i < p.E; i = i + 1u) {
					var taken = false;
					for (var q = 0u; q < j; q = q + 1u) { if (sel[q] == i) { taken = true; } }
					let v = lg[t * p.E + i];
					if (!taken && (best == 0xFFFFFFFFu || v > bv)) { best = i; bv = v; }
				}
				sel[j] = best; val[j] = bv;
			}
			var sum = 0.0;
			let mx = val[0];
			for (var j = 0u; j < p.K; j = j + 1u) { val[j] = exp(val[j] - mx); sum = sum + val[j]; }
			for (var j = 0u; j < p.K; j = j + 1u) {
				ids[t * p.K + j] = sel[j];
				w[t * p.K + j] = val[j] / sum * p.scale;
			}
		}`,moe_sum:`
		struct P { T: u32, K: u32, d: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> y: array<f32>;
		@group(0) @binding(2) var<storage, read> w: array<f32>;
		@group(0) @binding(3) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let idx = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (idx >= p.T * p.d) { return; }
			let t = idx / p.d; let i = idx % p.d;
			var acc = 0.0;
			for (var j = 0u; j < p.K; j = j + 1u) { acc = acc + y[(t * p.K + j) * p.d + i] * w[t * p.K + j]; }
			o[idx] = acc;
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
		}`,head_gate:`
		struct HG { n: u32, hd: u32 };
		@group(0) @binding(0) var<uniform> p: HG;
		@group(0) @binding(1) var<storage, read> x: array<f32>;
		@group(0) @binding(2) var<storage, read> g: array<f32>;
		@group(0) @binding(3) var<storage, read_write> o: array<f32>;
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let i = (wid.y * nwg.x + wid.x) * 64u + lid.x;
			if (i >= p.n) { return; }
			o[i] = x[i] / (1.0 + exp(-g[i / p.hd]));
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
		}`,attention_flash64:`
		struct AP { nTokens: u32, nHeads: u32, nKvHeads: u32, headDim: u32, kvLen: u32, pastLen: u32, scale: f32, softcap: f32 };
		@group(0) @binding(0) var<uniform> p: AP;
		@group(0) @binding(1) var<storage, read> q: array<vec4<f32>>;
		@group(0) @binding(2) var<storage, read> k: array<vec4<f32>>;
		@group(0) @binding(3) var<storage, read> v: array<vec4<f32>>;
		@group(0) @binding(4) var<storage, read_write> o: array<vec4<f32>>;
		var<workgroup> Ks: array<vec4<f32>, 512>; // 32 cl\xE9s \xD7 16 vec4
		var<workgroup> Vs: array<vec4<f32>, 512>;
		fn score(dot: f32) -> f32 {
			let s = dot * p.scale;
			return select(s, p.softcap * tanh(s / p.softcap), p.softcap > 0.0);
		}
		@compute @workgroup_size(64)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let h = wid.y;
			let t = wid.x * 64u + lid.x;
			let live = t < p.nTokens;
			let kvh = h / (p.nHeads / p.nKvHeads);
			let qBase = (min(t, p.nTokens - 1u) * p.nHeads + h) * 16u;
			// q et l'accumulateur en 16 vec4 CHACUN, index\xE9s STATIQUEMENT (d\xE9roulage g\xE9n\xE9r\xE9) : un tableau local
			// index\xE9 dynamiquement part en m\xE9moire locale sur Metal \u2014 la v1 plafonnait \xE0 ~330 GFLOP/s.
${Array.from({length:16},(f,t)=>`			let q${t} = q[qBase + ${t}u]; var a${t} = vec4<f32>(0.0);`).join(`
`)}
			var m = -3.0e38; var l = 0.0;
			let nTiles = (p.kvLen + 31u) / 32u;
			for (var tile = 0u; tile < nTiles; tile = tile + 1u) {
				let j0 = tile * 32u;
				for (var r = 0u; r < 8u; r = r + 1u) {
					let i = lid.x + r * 64u;
					let jj = i >> 4u; let c = i & 15u;
					let src = (min(j0 + jj, p.kvLen - 1u) * p.nKvHeads + kvh) * 16u + c;
					Ks[i] = k[src]; Vs[i] = v[src];
				}
				workgroupBarrier();
				if (live) {
					let nj = min(32u, p.kvLen - j0);
					for (var jj = 0u; jj < nj; jj = jj + 1u) {
						let kb = jj * 16u;
						let d = ${Array.from({length:16},(f,t)=>`dot(q${t}, Ks[kb + ${t}u])`).join(" + ")};
						let sc = score(d);
						let mNew = max(m, sc);
						let corr = exp(m - mNew);
						let pw = exp(sc - mNew);
						l = l * corr + pw;
${Array.from({length:16},(f,t)=>`						a${t} = fma(vec4<f32>(pw), Vs[kb + ${t}u], a${t} * corr);`).join(`
`)}
						m = mNew;
					}
				}
				workgroupBarrier();
			}
			if (live) {
				let inv = 1.0 / l;
				let oBase = (t * p.nHeads + h) * 16u;
${Array.from({length:16},(f,t)=>`				o[oBase + ${t}u] = a${t} * inv;`).join(`
`)}
			}
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
		}`,dequant_pq2_0:`
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
			let base=blk*34u;
			let d=f16(gb(base)|(gb(base+1u)<<8u));
			let ob=blk*128u;
			for(var b=0u;b<32u;b=b+1u){
				let qb=gb(base+2u+b);
				for(var k=0u;k<4u;k=k+1u){ o[ob+b*4u+k]=d*f32(i32((qb>>(k*2u))&3u)-1); }
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
		struct P { T: u32, C: u32, snapT: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> x: array<f32>;
		@group(0) @binding(2) var<storage, read> w: array<f32>;
		@group(0) @binding(3) var<storage, read_write> st: array<f32>;
		@group(0) @binding(4) var<storage, read_write> o: array<f32>;
		@group(0) @binding(5) var<storage, read_write> snap: array<f32>;
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
				if (t == p.snapT) { snap[c] = s0; snap[p.C + c] = s1; snap[2u * p.C + c] = s2; }
			}
			st[c] = s0; st[p.C + c] = s1; st[2u * p.C + c] = s2;
		}`,hadamard_rows:`
		struct P { T: u32, W: u32, hd: u32, nk: u32, rep: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> x: array<f32>;
		@group(0) @binding(2) var<storage, read> sgn: array<f32>;
		@group(0) @binding(3) var<storage, read_write> y: array<f32>;
		var<workgroup> buf: array<f32, 1024>;
		fn src(j: u32) -> u32 {
			if (p.rep <= 1u) { return j; }
			let hd = j % p.hd;
			let q = j / p.hd;
			return hd + p.hd * (q / p.rep + p.nk * (q % p.rep));
		}
		@compute @workgroup_size(256)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
			let b = wid.x;
			let t = wid.y;
			for (var r = 0u; r < 4u; r++) {
				let i = lid.x + r * 256u;
				let j = b * 1024u + i;
				buf[i] = x[t * p.W + src(j)] * sgn[j];
			}
			workgroupBarrier();
			for (var h = 1u; h < 1024u; h = h * 2u) {
				for (var r = 0u; r < 2u; r++) {
					let k = lid.x + r * 256u;
					let lo = (k / h) * 2u * h + (k % h);
					let a = buf[lo];
					let c = buf[lo + h];
					buf[lo] = a + c;
					buf[lo + h] = a - c;
				}
				workgroupBarrier();
			}
			for (var r = 0u; r < 4u; r++) {
				let i = lid.x + r * 256u;
				y[t * p.W + b * 1024u + i] = buf[i] * 0.03125;
			}
		}
	`,hadamard_rows_naive:`
		struct P { T: u32, W: u32, hd: u32, nk: u32, rep: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> x: array<f32>;
		@group(0) @binding(2) var<storage, read> sgn: array<f32>;
		@group(0) @binding(3) var<storage, read_write> y: array<f32>;
		fn src(j: u32) -> u32 {
			if (p.rep <= 1u) { return j; }
			let hd = j % p.hd;
			let q = j / p.hd;
			return hd + p.hd * (q / p.rep + p.nk * (q % p.rep));
		}
		@compute @workgroup_size(256)
		fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>) {
			let idx = (wid.y * nwg.x + wid.x) * 256u + lid.x;
			if (idx >= p.T * p.W) { return; }
			let t = idx / p.W;
			let j = idx % p.W;
			let b = j / 1024u;
			let r = j % 1024u;
			var acc = 0.0;
			for (var c = 0u; c < 1024u; c++) {
				let jc = b * 1024u + c;
				let v = x[t * p.W + src(jc)] * sgn[jc];
				acc = acc + select(v, -v, (countOneBits(r & c) & 1u) == 1u);
			}
			y[idx] = acc * 0.03125;
		}
	`,qwen35_gdn_batch:`
		struct P { T: u32, Hv: u32, Hk: u32, S: u32, convStride: u32, kOff: u32, vOff: u32, eps: f32, snapT: u32 };
		@group(0) @binding(0) var<uniform> p: P;
		@group(0) @binding(1) var<storage, read> conv: array<f32>;
		@group(0) @binding(2) var<storage, read> alpha: array<f32>;
		@group(0) @binding(3) var<storage, read> braw: array<f32>;
		@group(0) @binding(4) var<storage, read> dt: array<f32>;
		@group(0) @binding(5) var<storage, read> A: array<f32>;
		@group(0) @binding(6) var<storage, read_write> S: array<f32>;
		@group(0) @binding(7) var<storage, read_write> o: array<f32>;
		@group(0) @binding(8) var<storage, read_write> snap: array<f32>;
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
				// Instantan\xE9 apr\xE8s le token snapT (la colonne j de la lane : aucune course).
				if (t == p.snapT) { for (var i = 0u; i < p.S; i = i + 1u) { snap[sOff + i * p.S + j] = S[sOff + i * p.S + j]; } }
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
		}`},Bn=`
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
	}`;Ke.moe_q4k_vec=qn(Ke.matmul_t_q4k_vec,"let rowBase = col * (d.k / 256u) * 36u;","let rowBase = (ex * d.n + col) * (d.k / 256u) * 36u;","let aBase = g * 8u;","let aBase = arow * (d.k / 4u) + g * 8u;");Ke.moe_q6k_vec=qn(Ke.matmul_t_q6k_vec,"let rowBase = col * nBlk * 210u;","let rowBase = (ex * d.n + col) * nBlk * 210u;","let aB = b * 256u + half * 128u;","let aB = arow * d.k + b * 256u + half * 128u;");Ke.moe_group=`
	struct P { S: u32, E: u32 };
	@group(0) @binding(0) var<uniform> p: P;
	@group(0) @binding(1) var<storage, read> ids: array<u32>;
	@group(0) @binding(2) var<storage, read_write> perm: array<u32>;
	@group(0) @binding(3) var<storage, read_write> off: array<u32>;
	var<workgroup> cnt: array<u32, 512>;
	@compute @workgroup_size(256)
	fn main(@builtin(local_invocation_index) tid: u32) {
		for (var e = tid; e < p.E; e = e + 256u) {
			var c = 0u;
			for (var s = 0u; s < p.S; s = s + 1u) { if (ids[s] == e) { c = c + 1u; } }
			cnt[e] = c;
		}
		workgroupBarrier();
		if (tid == 0u) {
			var acc = 0u;
			for (var e = 0u; e < p.E; e = e + 1u) { off[e] = acc; acc = acc + cnt[e]; }
			off[p.E] = acc;
		}
		workgroupBarrier();
		for (var e = tid; e < p.E; e = e + 256u) {
			var o = off[e];
			for (var s = 0u; s < p.S; s = s + 1u) { if (ids[s] == e) { perm[o] = s; o = o + 1u; } }
		}
	}`;Ke.moe_q4k_grouped=Fn("dq4",`
	fn byteAt(base: u32, i: u32) -> u32 { return (q[base + (i >> 2u)] >> ((i & 3u) * 8u)) & 0xFFu; }
	fn dq4(row: u32, kidx: u32) -> vec4<f32> {
		let base = row * (d.k / 256u) * 36u + (kidx / 256u) * 36u;
		let j = (kidx % 256u) / 32u; let l = kidx % 32u;
		let dm = q[base];
		var sc6: u32; var mn6: u32;
		if (j < 4u) { sc6 = byteAt(base, 4u + j) & 63u; mn6 = byteAt(base, 8u + j) & 63u; }
		else {
			sc6 = (byteAt(base, 8u + j) & 0xFu) | ((byteAt(base, j) >> 6u) << 4u);
			mn6 = (byteAt(base, 8u + j) >> 4u) | ((byteAt(base, 4u + j) >> 6u) << 4u);
		}
		let word = q[base + 4u + (j >> 1u) * 8u + (l >> 2u)] >> ((j & 1u) * 4u);
		let nib = vec4<f32>(f32(word & 0xFu), f32((word >> 8u) & 0xFu), f32((word >> 16u) & 0xFu), f32((word >> 24u) & 0xFu));
		return f16d(dm & 0xFFFFu) * f32(sc6) * nib - vec4<f32>(f16d(dm >> 16u) * f32(mn6));
	}`);Ke.moe_q6k_grouped=Fn("dq6",`
	fn gb(i: u32) -> u32 { return (q[i >> 2u] >> ((i & 3u) * 8u)) & 0xFFu; }
	fn si8(b: u32) -> f32 { let s = i32(b); return f32(select(s, s - 256, s > 127)); }
	fn dq6one(base: u32, t: u32) -> f32 {
		let half = t / 128u; let tt = t % 128u; let qd = tt / 32u; let l = tt % 32u;
		let qlb = gb(base + half * 64u + l + (qd & 1u) * 32u);
		let lo = select(qlb & 0xFu, qlb >> 4u, qd >= 2u);
		let hi = (gb(base + 128u + half * 32u + l) >> (2u * qd)) & 3u;
		let sc = si8(gb(base + 192u + half * 8u + l / 16u + 2u * qd));
		return sc * f32(i32(lo | (hi << 4u)) - 32);
	}
	fn dq6(row: u32, kidx: u32) -> vec4<f32> {
		let base = row * (d.k / 256u) * 210u + (kidx / 256u) * 210u;
		let t = kidx % 256u;
		let dd = f16d(gb(base + 208u) | (gb(base + 209u) << 8u));
		return dd * vec4<f32>(dq6one(base, t), dq6one(base, t + 1u), dq6one(base, t + 2u), dq6one(base, t + 3u));
	}`);Ke.rmsnorm_grouped=`
	struct P { rows: u32, dim: u32, groups: u32, eps: f32 };
	@group(0) @binding(0) var<uniform> p: P;
	@group(0) @binding(1) var<storage, read> x: array<f32>;
	@group(0) @binding(2) var<storage, read> w: array<f32>;
	@group(0) @binding(3) var<storage, read_write> o: array<f32>;
	var<workgroup> part: array<f32, 64>;
	@compute @workgroup_size(64)
	fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
		let seg = wid.x;
		let r = seg / p.groups; let g = seg % p.groups;
		let gs = p.dim / p.groups;
		let base = r * p.dim + g * gs;
		var ss = 0.0;
		for (var i = lid.x; i < gs; i = i + 64u) { let v = x[base + i]; ss = ss + v * v; }
		part[lid.x] = ss;
		workgroupBarrier();
		for (var s = 32u; s > 0u; s = s >> 1u) {
			if (lid.x < s) { part[lid.x] = part[lid.x] + part[lid.x + s]; }
			workgroupBarrier();
		}
		let inv = 1.0 / sqrt(part[0] / f32(gs) + p.eps);
		for (var i = lid.x; i < gs; i = i + 64u) { o[base + i] = x[base + i] * inv * w[g * gs + i]; }
	}`});var zt,Mn=ce(()=>{"use strict";zt=class{constructor(t){this.sets=[];this.cur=0;this.next=0;this.names=[];this.acc=new Map;this.dropped=0;this.pending=[];this.fenetre=0;this.device=t;let r=globalThis;for(let e=0;e<2;e++)this.sets.push({qs:t.createQuerySet({type:"timestamp",count:4096}),resolve:t.createBuffer({size:4096*8,usage:r.GPUBufferUsage.QUERY_RESOLVE|r.GPUBufferUsage.COPY_SRC}),read:t.createBuffer({size:4096*8,usage:r.GPUBufferUsage.COPY_DST|r.GPUBufferUsage.MAP_READ}),busy:!1})}slot(t){if(this.next+2>4096&&(this.rotate(),this.next+2>4096))return this.dropped++,null;let r=this.sets[this.cur];if(r.busy)return this.dropped++,null;let e=this.next;return this.next+=2,this.names.push(t),{querySet:r.qs,beginningOfPassWriteIndex:e,endOfPassWriteIndex:e+1}}rotate(){let t=this.cur,r=this.sets[t],e=this.names,n=this.next;if(this.cur=(this.cur+1)%2,this.next=0,this.names=[],!n||r.busy)return;r.busy=!0;let s=this.fenetre,i=this.device.createCommandEncoder();i.resolveQuerySet(r.qs,0,n,r.resolve,0),i.copyBufferToBuffer(r.resolve,0,r.read,0,n*8),this.device.queue.submit([i.finish()]);let a=globalThis,o=r.read.mapAsync(a.GPUMapMode.READ,0,n*8).then(()=>{let u=new BigUint64Array(r.read.getMappedRange(0,n*8).slice(0));if(r.read.unmap(),s===this.fenetre)for(let c=0;c<e.length;c++){let l=u[c*2],d=u[c*2+1];if(!l||!d||d<=l)continue;let p=Number(d-l),g=this.acc.get(e[c]);g?(g.calls++,g.ns+=p):this.acc.set(e[c],{calls:1,ns:p})}}).catch(()=>{}).finally(()=>{r.busy=!1});this.pending.push(o)}async report(){this.rotate();let t=this.pending;this.pending=[],await Promise.all(t);let r=0,e=0;for(let s of this.acc.values())r+=s.ns,e+=s.calls;return{passes:[...this.acc.entries()].map(([s,i])=>({name:s,calls:i.calls,totalMs:i.ns/1e6,meanUs:i.ns/i.calls/1e3,share:r?i.ns/r:0,reliable:i.calls>=50})).sort((s,i)=>i.totalMs-s.totalMs),totalMs:r/1e6,samples:e,dropped:this.dropped,quantumUs:100}}reset(){this.fenetre++,this.acc.clear(),this.dropped=0}destroy(){for(let t of this.sets)try{t.qs.destroy(),t.resolve.destroy(),t.read.destroy()}catch{}this.sets=[]}}});function mi(){if(On!==null)return On;try{let f=globalThis.__brimkernSearch;if(typeof f=="string")return f}catch{}try{return typeof location<"u"?location.search:""}catch{return""}}function ie(f){try{return new URLSearchParams(mi()).get(f)}catch{return null}}var On,xt=ce(()=>{"use strict";On=null});function Pe(f){let t=f>>15&1,r=f>>10&31,e=f&1023,n;return r===0?n=e*59604645e-15:r===31?n=65504:n=(1+e/1024)*2**(r-15),t===1?-n:n}function me(f){let t=new Float32Array(1),r=new Uint32Array(t.buffer);t[0]=f;let e=r[0],n=e>>16&32768,s=(e>>23&255)-127+15,i=e&8388607;return s<=0?n:s>=31?n|31743:(i=(i>>13)+(i>>12&1),i===1024&&(i=0,s+=1),n|s<<10|i&1023)}function et(f,t){let r=new Float32Array(t*256),e=new DataView(f.buffer,f.byteOffset);for(let n=0;n<t;n++){let s=n*144,i=Pe(e.getUint16(s,!0)),a=Pe(e.getUint16(s+2,!0)),o=d=>{let p=g=>f[s+4+g];return d<4?[p(d)&63,p(d+4)&63]:[p(d+4)&15|p(d-4)>>6<<4,p(d+4)>>4|p(d)>>6<<4]},u=n*256,c=0,l=0;for(let d=0;d<256;d+=64){let[p,g]=o(c),m=i*p,b=a*g,[v,U]=o(c+1),A=i*v,F=a*U;for(let T=0;T<32;T++){let K=f[s+16+l+T];r[u+d+T]=m*(K&15)-b,r[u+d+32+T]=A*(K>>4)-F}l+=32,c+=2}}return r}function _t(f){return f>127?f-256:f}function hi(f,t){let r=new Float32Array(t*32),e=new DataView(f.buffer,f.byteOffset);for(let n=0;n<t;n++){let s=n*34,i=Pe(e.getUint16(s,!0));for(let a=0;a<32;a++)r[n*32+a]=i*_t(f[s+2+a])}return r}function bi(f,t){let r=new Float32Array(t*32),e=new DataView(f.buffer,f.byteOffset);for(let n=0;n<t;n++){let s=n*22,i=Pe(e.getUint16(s,!0)),a=e.getUint32(s+2,!0);for(let o=0;o<16;o++){let u=f[s+6+o],c=a>>>o<<4&16,l=a>>>o+12&16;r[n*32+o]=i*((u&15|c)-16),r[n*32+o+16]=i*((u>>4|l)-16)}}return r}function vi(f,t){let r=new Float32Array(t*32),e=new DataView(f.buffer,f.byteOffset);for(let n=0;n<t;n++){let s=n*18,i=Pe(e.getUint16(s,!0));for(let a=0;a<16;a++){let o=f[s+2+a];r[n*32+a]=i*((o&15)-8),r[n*32+a+16]=i*((o>>4)-8)}}return r}function wi(f,t){let r=new Float32Array(t*256),e=new DataView(f.buffer,f.byteOffset);for(let n=0;n<t;n++){let s=n*176,i=Pe(e.getUint16(s,!0)),a=Pe(e.getUint16(s+2,!0)),o=g=>{let m=b=>f[s+4+b];return g<4?[m(g)&63,m(g+4)&63]:[m(g+4)&15|m(g-4)>>6<<4,m(g+4)>>4|m(g)>>6<<4]},u=n*256,c=0,l=0,d=1,p=2;for(let g=0;g<256;g+=64){let[m,b]=o(c),v=i*m,U=a*b,[A,F]=o(c+1),T=i*A,K=a*F;for(let P=0;P<32;P++){let G=f[s+48+l+P],_=f[s+16+P];r[u+g+P]=v*((G&15)+(_&d?16:0))-U,r[u+g+32+P]=T*((G>>4)+(_&p?16:0))-K}l+=32,c+=2,d<<=2,p<<=2}}return r}function yi(f){f&&(f.kq?f.buf?.destroy?.():f.codes?(f.codes.destroy?.(),f.sc?.destroy?.()):f.nib?(f.nib.destroy?.(),f.sc?.destroy?.(),f.mn?.destroy?.()):f.destroy?.())}function Ve(f,t){let r=new Float32Array(t*256),e=new DataView(f.buffer,f.byteOffset);for(let n=0;n<t;n++){let s=n*210,i=Pe(e.getUint16(s+208,!0)),a=n*256;for(let o=0;o<2;o++){let u=s+o*64,c=s+128+o*32,l=s+192+o*8,d=a+o*128;for(let p=0;p<32;p++){let g=p/16|0,m=f[u+p],b=f[u+p+32],v=f[c+p],U=(m&15|(v>>0&3)<<4)-32,A=(b&15|(v>>2&3)<<4)-32,F=(m>>4|(v>>4&3)<<4)-32,T=(b>>4|(v>>6&3)<<4)-32;r[d+p]=i*_t(f[l+g])*U,r[d+p+32]=i*_t(f[l+g+2])*A,r[d+p+64]=i*_t(f[l+g+4])*F,r[d+p+96]=i*_t(f[l+g+6])*T}}}return r}function _r(f,t){let n=new Float32Array(t*256),s=0,i=new DataView(f.buffer,f.byteOffset);for(let a=0;a<t;a++){let o=a*110,u=Pe(i.getUint16(o+108,!0)),c=new Int32Array(4);for(let v=0;v<3;v++)c[v]=f[o+96+v*4]|f[o+96+v*4+1]<<8|f[o+96+v*4+2]<<16|f[o+96+v*4+3]<<24;let l=c[2];c[2]=c[0]>>>4&252645135|(l>>>4&50529027)<<4,c[3]=c[1]>>>4&252645135|(l>>>6&50529027)<<4,c[0]=c[0]&252645135|(l>>>0&50529027)<<4,c[1]=c[1]&252645135|(l>>>2&50529027)<<4;let d=new Int8Array(c.buffer),p=0,g=o+32,m=o,b=1;for(let v=0;v<256;v+=128){let U=0;for(let A=0;A<4;A++){let F=u*(d[p++]-32);for(let K=0;K<16;K++){let P=f[g+K]>>>U&3,G=f[m+K]&b?0:4;n[s++]=F*(P-G)}let T=u*(d[p++]-32);for(let K=0;K<16;K++){let P=f[g+16+K]>>>U&3,G=f[m+16+K]&b?0:4;n[s++]=T*(P-G)}U+=2,b=b<<1&255}g+=32}}return n}function Ar(f,t){let r=new Float32Array(t*32),e=new DataView(f.buffer,f.byteOffset);for(let n=0;n<t;n++){let s=n*20,i=Pe(e.getUint16(s,!0)),a=Pe(e.getUint16(s+2,!0)),o=n*32;for(let u=0;u<16;u++){let c=f[s+4+u];r[o+u]=(c&15)*i+a,r[o+u+16]=(c>>4)*i+a}}return r}function Ln(f,t,r=1024){for(let n=1;n<r;n*=2)for(let s=0;s<r;s+=2*n)for(let i=s;i<s+n;i++){let a=f[t+i],o=f[t+i+n];f[t+i]=a+o,f[t+i+n]=a-o}let e=1/Math.sqrt(r);for(let n=0;n<r;n++)f[t+n]*=e}function ki(f,t,r,e,n){let s=new Float32Array(t*r);for(let i=0;i<t;i++){for(let a=0;a<r;a++){let o=a;if(n&&n.rep>1){let u=a%n.hd,c=Math.floor(a/n.hd);o=u+n.hd*(Math.floor(c/n.rep)+n.nk*(c%n.rep))}s[i*r+a]=f[i*r+o]*e[a]}for(let a=0;a<r;a+=1024)Ln(s,i*r+a)}return s}function Dn(f,t){let r=Float32Array.from(f);for(let e=0;e<r.length;e+=1024)Ln(r,e);for(let e=0;e<r.length;e++)r[e]*=t[e];return r}function Cn(f,t){let r=new Float32Array(t),e=new Uint32Array(r.buffer),n=new DataView(f.buffer,f.byteOffset,t*2);for(let s=0;s<t;s++)e[s]=n.getUint16(s*2,!0)<<16;return r}function We(f,t){let r=new Float32Array(t*128),e=new DataView(f.buffer,f.byteOffset);for(let n=0;n<t;n++){let s=n*34,i=Pe(e.getUint16(s,!0)),a=n*128;for(let o=0;o<128;o++)r[a+o]=((f[s+2+(o>>2)]>>(o&3)*2&3)-1)*i}return r}function xi(f,t,r,e,n,s,i,a){let o=s*i,u=n*o,c=new Float32Array(a*u);for(let l=0;l<a;l++)for(let d=0;d<n;d++)for(let p=0;p<s;p++)for(let g=0;g<i;g++){let m=r[l];for(let b=0;b<e;b++)for(let v=0;v<3;v++){let U=Math.min(Math.max(d+v-1,0),n-1);for(let A=0;A<3;A++){let F=p+A-1;if(!(F<0||F>=s))for(let T=0;T<3;T++){let K=g+T-1;K<0||K>=i||(m+=f[((b*n+U)*s+F)*i+K]*t[(((l*e+b)*3+v)*3+A)*3+T])}}}c[l*u+d*o+p*i+g]=m}return c}function _i(f,t,r,e,n,s,i){let a=new Float32Array(r*e);for(let o=0;o<e;o++){let u=0;for(let l=0;l<r;l++){let d=f[l*e+o];u+=d*d}let c=1/Math.sqrt(u/r+i);for(let l=0;l<r;l++){let d=f[l*e+o]*c*(1+t[s+l])+t[n+l];a[l*e+o]=d/(1+Math.exp(-d))}}return a}function Tn(f,t,r,e,n,s,i){let a=2*e-1,o=2*n,u=2*s,c=n*s,l=new Float32Array(r*a*o*u);for(let d=0;d<r;d++)for(let p=0;p<a;p++)for(let g=0;g<o;g++)for(let m=0;m<u;m++){let b=p+1,v=b>>1,U=b&1,A=g>>1,F=g&1,T=m>>1,K=m&1,P=f[((((d*2+U)*2+F)*2+K)*e+v)*c+A*s+T];if(t){let G=d%(i/8);P+=t[((((G*2+U)*2+F)*2+K)*e+v)*c+A*s+T]}l[((d*a+p)*o+g)*u+m]=P}return l}function Ai(f,t,r,e,n){let s=4*e,i=4*n,a=e*n,o=new Float32Array(t*r*s*i);for(let u=0;u<t;u++)for(let c=0;c<r;c++)for(let l=0;l<s;l++)for(let d=0;d<i;d++){let p=(u*4+(d&3))*4+(l&3);o[((u*r+c)*s+l)*i+d]=f[(p*r+c)*a+(l>>2)*n+(d>>2)]}return o}function Pi(f,t,r,e,n,s,i,a,o,u){let c=(n-1)*o-2*u+a,l=(s-1)*o-2*u+a,d=new Float32Array(i*c*l);for(let p=0;p<i;p++)d.fill(r[p],p*c*l,(p+1)*c*l);for(let p=0;p<e;p++)for(let g=0;g<n;g++)for(let m=0;m<s;m++){let b=f[(p*n+g)*s+m];for(let v=0;v<i;v++)for(let U=0;U<a;U++)for(let A=0;A<a;A++){let F=g*o-u+U,T=m*o-u+A;F<0||T<0||F>=c||T>=l||(d[(v*c+F)*l+T]+=b*t[((p*i+v)*a+U)*a+A])}}return d}function Gi(f,t,r,e){let n=new Float32Array(t*4*r*e),s=2*r,i=2*e;for(let a=0;a<t;a++)for(let o=0;o<s;o++)for(let u=0;u<i;u++)n[(a*s+o)*i+u]=f[((a*4+o%2*2+u%2)*r+(o>>1))*e+(u>>1)];return n}function Rn(f,t,r,e,n,s){let i=new Float32Array(t*n*s),a=r/n,o=e/s;for(let u=0;u<t;u++)for(let c=0;c<n;c++)for(let l=0;l<s;l++){let d=Math.max((c+.5)*a-.5,0),p=Math.max((l+.5)*o-.5,0),g=Math.min(Math.floor(d),r-1),m=Math.min(Math.floor(p),e-1),b=Math.min(g+1,r-1),v=Math.min(m+1,e-1),U=d-g,A=p-m,F=u*r*e,T=f[F+g*e+m]*(1-A)+f[F+g*e+v]*A,K=f[F+b*e+m]*(1-A)+f[F+b*e+v]*A;i[(u*n+c)*s+l]=T*(1-U)+K*U}return i}function Ui(f,t,r,e,n,s){let i=e*n,a=new Float32Array(r*i);for(let o=0;o<i;o++){let u=Math.min(Math.max(o%n+t[s*i+o],0),n-1),c=Math.min(Math.max(Math.floor(o/n)+t[(s+1)*i+o],0),e-1),l=Math.floor(u),d=Math.floor(c),p=Math.min(l+1,n-1),g=Math.min(d+1,e-1),m=u-l,b=c-d;for(let v=0;v<r;v++){let U=v*i,A=f[U+d*n+l]*(1-m)+f[U+d*n+p]*m,F=f[U+g*n+l]*(1-m)+f[U+g*n+p]*m;a[U+o]=A*(1-b)+F*b}}return a}function Ze(f,t,r,e,n){let s=new Float32Array(r*n);for(let i=0;i<r;i++)for(let a=0;a<n;a++){let o=0;for(let u=0;u<e;u++)o+=f[i*e+u]*t[u*n+a];s[i*n+a]=o}return s}function Ie(f,t,r,e,n=1e-5,s=!1){let i=new Float32Array(r*e);for(let a=0;a<r;a++){let o=0;for(let c=0;c<e;c++)o+=f[a*e+c]**2;let u=1/Math.sqrt(o/e+n);for(let c=0;c<e;c++)i[a*e+c]=f[a*e+c]*u*(s?1+t[c]:t[c])}return i}function Bi(f,t,r,e,n,s,i){let a=new Float32Array(f.length),o=e/2,u=s[0],c=s[0]+s[1];for(let l=0;l<r;l++){let d=Math.floor(l/n),p=l*e;for(let g=0;g<o;g++){let m=g<u?0:g<c?1:2,v=t[d*3+m]/i**(2*g/e),U=Math.cos(v),A=Math.sin(v),F=f[p+g],T=f[p+g+o];a[p+g]=F*U-T*A,a[p+g+o]=T*U+F*A}}return a}function Nt(f,t,r,e,n=0,s=1e4,i){let a=new Float32Array(f.length),o=r/2;for(let u=0;u<t;u++){let c=n+Math.floor(u/e),l=u*r;for(let d=0;d<o;d++){let p=c/(s**(2*d/r)*(i?i[d]:1)),g=Math.cos(p),m=Math.sin(p),b=f[l+2*d],v=f[l+2*d+1];a[l+2*d]=b*g-v*m,a[l+2*d+1]=v*g+b*m}}return a}function qi(f,t,r,e,n,s=0,i=1e4){let a=new Float32Array(f.length),o=e/2;for(let u=0;u<r;u++){let c=s+Math.floor(u/n),l=u*e;for(let d=0;d<o;d++){let p=c/(i**(2*d/e)*t[d]),g=Math.cos(p),m=Math.sin(p),b=f[l+d],v=f[l+d+o];a[l+d]=b*g-v*m,a[l+d+o]=v*g+b*m}}return a}function At(f,t,r,e,n=0,s=1e4){let i=new Float32Array(f.length),a=r/2;for(let o=0;o<t;o++){let u=n+Math.floor(o/e),c=o*r;for(let l=0;l<a;l++){let d=u/s**(2*l/r),p=Math.cos(d),g=Math.sin(d),m=f[c+l],b=f[c+l+a];i[c+l]=m*p-b*g,i[c+l+a]=b*p+m*g}}return i}function Pr(f,t,r){return f.map((e,n)=>e+t[n%r])}function Qt(f,t,r,e=!0){let n=e?f.windowPerLayer?.[r]??f.window??0:0,s=f.ropeThetaPerLayer?.[r]??f.ropeTheta,i=f.skipRopePerLayer?.[r]??f.skipRope??!1;return{...f,seq:t,window:n,ropeTheta:s,skipRope:i}}function Se(f,t,r,e,n,s,i,a=0,o,u=0,c=0){let l=new Float32Array(e*n*i),d=o??1/Math.sqrt(i),p=m=>u>0?u*Math.tanh(m/u):m,g=n/s;for(let m=0;m<e;m++)for(let b=0;b<n;b++){let v=Math.floor(b/g),U=(m*n+b)*i,A=a+m,F=c>0?Math.max(0,A+1-c):0,T=[],K=-1/0;for(let G=F;G<=A;G++){let _=(G*s+v)*i,h=0;for(let k=0;k<i;k++)h+=f[U+k]*t[_+k];let y=p(h*d);T[G]=y,y>K&&(K=y)}let P=0;for(let G=F;G<=A;G++)T[G]=Math.exp(T[G]-K),P+=T[G];for(let G=F;G<=A;G++){let _=T[G]/P,h=(G*s+v)*i;for(let y=0;y<i;y++)l[U+y]+=_*r[h+y]}}return l}function jn(f){return .5*f*(1+Math.tanh(.7978845608*(f+.044715*f*f*f)))}function Gr(f,t,r){let{seq:e,d:n,nHeads:s,nKvHeads:i,headDim:a,ffn:o,ropeTheta:u,eps:c}=t,l=i*a,d=s*a,p=t.rmsGainOnePlus===!0,g=t.attnLogitSoftcap??0,m=Ie(f,r.attnNorm,e,n,c,p),b=Ze(m,r.wq,e,n,d),v=Ze(m,r.wk,e,n,l),U=Ze(m,r.wv,e,n,l);r.bq&&(b=Pr(b,r.bq,d)),r.bk&&(v=Pr(v,r.bk,l)),r.bv&&(U=Pr(U,r.bv,l)),r.qNorm&&(b=Ie(b,r.qNorm,e*s,a,c,p)),r.kNorm&&(v=Ie(v,r.kNorm,e*i,a,c,p));let A=At(b,e*s,a,s,0,u),F=At(v,e*i,a,i,0,u),T=Se(A,F,U,e,s,i,a,0,t.attnScale,g),K=Ze(T,r.wo,e,d,n);r.postAttnNorm&&(K=Ie(K,r.postAttnNorm,e,n,c,p));let P=f.map((w,x)=>w+K[x]),G=Ie(P,r.ffnNorm,e,n,c,p),_=Ze(G,r.wgate,e,n,o),h=Ze(G,r.wup,e,n,o),y=t.act==="gelu"?_.map((w,x)=>jn(w)*h[x]):_.map((w,x)=>w/(1+Math.exp(-w))*h[x]),k=Ze(y,r.wdown,e,o,n);return r.postFfnNorm&&(k=Ie(k,r.postFfnNorm,e,n,c,p)),P.map((w,x)=>w+k[x])}var ge,ue,$t,Pt=ce(()=>{"use strict";wt();yt();kt();Sn();Mn();xt();ge=64,ue=class ue{constructor(){this.device=null;this.modules={};this.pipelines={};this.maxStorageBufferBindingSize=0;this.hasF16=!1;this.validationFailure=null;this.lost=!1;this.onLost=null;this.attnDecodeOk=!0;this.attnPrefillOk=!0;this.attnFullWgOk=!0;this.attnFlashOk=!0;this.mropeOk=!0;this.rwkvWkv7Ok=!0;this.lfm2ShortConvOk=!0;this.qwen35SsmOk=!0;this.fwhtOk=!0;this.hadamardOk=!0;this.gemma4Ok=!0;this.sparkOk=!0;this.moeOk=!0;this.moeGemmOk=!0;this.k2hOk=!0;this.attnWideOk=!0;this.kqOk=!0;this.pq2NativeOk=!0;this.pq2HeadOk=!0;this.rifeOk=!0;this.ltxOk=!0;this.gemvMOk=!0;this.lfm2ResidentOk=!0;this.lfm2BatchOk=!0;this.swaOk=!0;this.rwkvResidentOk=!0;this.videoOk=!0;this.videoResidentOk=!0;this.f16SharedOk=!0;this.qSharedOk=!0;this.qShared2Ok=!0;this.gemvOk=!0;this.rmsVecOk=!0;this.convS2Ok=!0;this.hasSubgroups=!1;this.subgroupsOk=!0;this.topKParOk=!0;this.dequantQ3kOk=!0;this.dequantQ41Ok=!0;this.dequantPq2Ok=!0;this.profiler=null;this.bufferPool=new Map;this.poolSize=new WeakMap;this.pooled=new WeakSet;this.uniformPool=new Map;this.uniformSize=new WeakMap;this.convTiledOk=!0;this.convTiledQOk=!0;this.convGemmOk=!0;this.gpuMem={live:0,peak:0,buffers:0,instrumented:!1};this.kqScratch=null;this.dummySnap=null;this.kvGpu=new Map;this.topKOk=!0;this.kvSession="";this.kvQuant=!1;this.kvStore=new Map;this.kvCtxId="";this.lfm2KvGpu=new Map;this.lfm2ConvGpu=new Map;this.lfm2Session="";this.rwkvStateGpu=new Map;this.rwkvVFirst=null;this.rwkvSession=""}async init(){let t=navigator.gpu;if(!t)return!1;let r=await t.requestAdapter();if(!r)return!1;let e=r.limits,n={maxStorageBufferBindingSize:e.maxStorageBufferBindingSize,maxBufferSize:e.maxBufferSize},s=[];try{r.features?.has("shader-f16")&&s.push("shader-f16")}catch{}try{r.features?.has("subgroups")&&s.push("subgroups")}catch{}try{ue.profileOn&&r.features?.has("timestamp-query")&&s.push("timestamp-query")}catch{}try{this.device=await r.requestDevice({requiredLimits:n,requiredFeatures:s})}catch{try{this.device=await r.requestDevice({requiredLimits:n})}catch{this.device=await r.requestDevice()}}this.instrumentMemory(),this.maxStorageBufferBindingSize=this.device.limits?.maxStorageBufferBindingSize??134217728,this.hasF16=!!this.device.features?.has?.("shader-f16"),this.hasSubgroups=!!this.device.features?.has?.("subgroups"),ue.profileOn&&(this.device.features?.has?.("timestamp-query")?(this.profiler=new zt(this.device),console.info("[webgpu] profilage par passe ACTIF (?gpuprofile=1) : __gpuProfile() pour le rapport")):console.warn("[webgpu] ?gpuprofile=1 demand\xE9 mais la feature timestamp-query est ABSENTE de cet adapter : aucune mesure ne sera prise."));try{ie("attndecode")==="0"&&(this.attnDecodeOk=!1,console.warn("[webgpu] attention d\xE9codage COUP\xC9E par ?attndecode=0 : kernels classiques")),ie("attnfullwg")==="0"&&(this.attnFullWgOk=!1,console.warn("[webgpu] attention_full workgroup COUP\xC9E par ?attnfullwg=0 : kernel classique")),ie("attnprefill")==="0"&&(this.attnPrefillOk=!1,console.warn("[webgpu] attention prefill tuil\xE9e COUP\xC9E par ?attnprefill=0 : kernel classique")),ie("rmsvec")==="0"&&(this.rmsVecOk=!1,console.warn("[webgpu] RMSNorm parall\xE8le COUP\xC9E par ?rmsvec=0 : kernel une-ligne-par-thread")),ie("topkpar")==="0"&&(this.topKParOk=!1,console.warn("[webgpu] top-K parall\xE8le COUP\xC9E par ?topkpar=0 : s\xE9lection finale sur un seul thread")),ie("rwkv")==="0"&&(this.rwkvWkv7Ok=!1,console.warn("[webgpu] kernel RWKV-7 WKV COUP\xC9 par ?rwkv=0")),ie("lfm2")==="0"&&(this.lfm2ShortConvOk=!1,console.warn("[webgpu] kernel shortconv LFM2 COUP\xC9 par ?lfm2=0")),ie("lfm2resident")==="0"&&(this.lfm2ResidentOk=!1,console.warn("[webgpu] LFM2 r\xE9sident COUP\xC9 par ?lfm2resident=0 : forwardToken JS+readback")),ie("lfm2batch")==="0"&&(this.lfm2BatchOk=!1,console.warn("[webgpu] prefill LFM2 batch\xE9 COUP\xC9 par ?lfm2batch=0 : token par token")),ie("convs2")==="0"&&(this.convS2Ok=!1,console.warn("[webgpu] conv2d 3\xD73 stride-2 tuil\xE9 COUP\xC9 par ?convs2=0 : repli sur direct")),ie("subgroups")==="0"&&(this.subgroupsOk=!1,console.warn("[webgpu] subgroups COUP\xC9 par ?subgroups=0 : repli sur shared memory")),ie("swa")==="0"&&(this.swaOk=!1,console.warn("[webgpu] fen\xEAtre glissante COUP\xC9E par ?swa=0 : attention causale pleine sur toutes les couches")),ie("rwkvresident")==="0"&&(this.rwkvResidentOk=!1,console.warn("[webgpu] RWKV r\xE9sident COUP\xC9 par ?rwkvresident=0 : forwardToken JS+readback")),ie("video")==="0"&&(this.videoOk=!1,console.warn("[webgpu] chemin vid\xE9o (module motion) COUP\xC9 par ?video=0")),ie("qwen35ssm")==="0"&&(this.qwen35SsmOk=!1,console.warn("[webgpu] kernel Qwen 3.5 SSM COUP\xC9 par ?qwen35ssm=0")),ie("attnflash")==="0"&&(this.attnFlashOk=!1,console.warn("[webgpu] attention tuil\xE9e flash COUP\xC9E par ?attnflash=0 : attention_full_wg (K/V relus par jeton)")),ie("attnwide")==="0"&&(this.attnWideOk=!1,console.warn("[webgpu] attention large COUP\xC9E par ?attnwide=0 : t\xEAtes > 128 sur le kernel un-thread-par-t\xEAte")),ie("gemvm")==="0"&&(this.gemvMOk=!1,console.warn("[webgpu] GEMV multi-lignes COUP\xC9 par ?gemvm=0 : kernels de prefill d\xE8s m \u2265 2")),ie("kq")==="0"&&(this.kqOk=!1,console.warn("[webgpu] poids K-quant natifs COUP\xC9S par ?kq=0 : requantification int8")),ie("ltx")==="0"&&(this.ltxOk=!1,console.warn("[webgpu] briques du d\xE9codeur LTX COUP\xC9ES par ?ltx=0")),ie("rife")==="0"&&(this.rifeOk=!1,console.warn("[webgpu] interpolation RIFE COUP\xC9E par ?rife=0 : clips sans images interm\xE9diaires")),ie("pq2native")==="0"&&(this.pq2NativeOk=!1,console.warn("[webgpu] poids PQ2_0 natifs COUP\xC9S par ?pq2native=0 : requantification int8")),ie("fwht")==="0"&&(this.fwhtOk=!1,console.warn("[webgpu] FWHT COUP\xC9E par ?fwht=0 : rotation de Hadamard par le kernel na\xEFf")),ie("pq2head")==="0"&&(this.pq2HeadOk=!1,console.warn("[webgpu] t\xEAte PQ2_0 native COUP\xC9E par ?pq2head=0 : t\xEAte requantifi\xE9e en int8")),ie("gemma4")==="0"&&(this.gemma4Ok=!1,console.warn("[webgpu] chemin Gemma 4 COUP\xC9 par ?gemma4=0 : un mod\xE8le gemma4 refusera de charger")),ie("moe")==="0"&&(this.moeOk=!1,console.warn("[webgpu] chemin MoE COUP\xC9 par ?moe=0 : un mod\xE8le \xE0 experts refusera de charger")),ie("moegemm")==="0"&&(this.moeGemmOk=!1,console.warn("[webgpu] GEMM MoE group\xE9 COUP\xC9 par ?moegemm=0 : prefill MoE par GEMV par case")),ie("k2h")==="0"&&(this.k2hOk=!1,console.warn("[webgpu] chemin K2-Horizon COUP\xC9 par ?k2h=0 : un mod\xE8le k2-horizon refusera de charger")),ie("spark")==="0"&&(this.sparkOk=!1,console.warn("[webgpu] chemin Spark-X2.5 COUP\xC9 par ?spark=0 : un mod\xE8le spark2_5 refusera de charger")),ie("f16shared")==="0"&&(this.f16SharedOk=!1,console.warn("[webgpu] GEMM f16 tuil\xE9 COUP\xC9 par ?f16shared=0 : matmul_t_f16w pour tous les m")),ie("gemv")==="0"&&(this.gemvOk=!1,console.warn("[webgpu] GEMV de d\xE9codage COUP\xC9 par ?gemv=0 : kernels par lignes")),ie("qshared")==="0"&&(this.qSharedOk=!1,console.warn("[webgpu] GEMM q8/q4 tuil\xE9s COUP\xC9S par ?qshared=0 : kernels 4 lignes/invocation")),ie("qshared2")==="0"&&(this.qShared2Ok=!1,console.warn("[webgpu] GEMM q8/q4 v2 (bloc 4\xD78 vec4) COUP\xC9S par ?qshared2=0 : tuile 32\xD764 v1")),ie("convtq")==="0"&&(this.convTiledQOk=!1,console.warn("[webgpu] conv 3\xD73 tuil\xE9 q8/q4 COUP\xC9 par ?convtq=0 : conv2d_direct_q8/q4 (plus lent, m\xEAme r\xE9sultat)")),ie("videoresident")==="0"&&(this.videoResidentOk=!1,console.warn("[webgpu] motion r\xE9sident COUP\xC9 par ?videoresident=0 : chemin JS+readback")),ie("dequantq3k")==="0"&&(this.dequantQ3kOk=!1,console.warn("[webgpu] d\xE9quantification GPU Q3_K COUP\xC9E par ?dequantq3k=0 : repli CPU")),ie("dequantq41")==="0"&&(this.dequantQ41Ok=!1,console.warn("[webgpu] d\xE9quantification GPU Q4_1 COUP\xC9E par ?dequantq41=0 : repli CPU")),ie("convgemm")==="0"&&(this.convGemmOk=!1,console.warn("[webgpu] convolution q8 en GEMM implicite COUP\xC9E par ?convgemm=0 : kernels tuil\xE9s par forme")),ie("dequantpq2")==="0"&&(this.dequantPq2Ok=!1,console.warn("[webgpu] d\xE9quantification GPU PQ2_0 COUP\xC9E par ?dequantpq2=0 : repli CPU"))}catch{}this.device.lost?.then?.(i=>{this.lost=!0,console.warn("[webgpu] device GPU perdu :",i?.reason||"unknown",i?.message||""),this.onLost?.(i)});for(let[i,a]of Object.entries(Ke))this.modules[i]=this.device.createShaderModule({code:a});return this.hasF16&&(this.modules.matmul_t_f16w=this.device.createShaderModule({code:Bn})),!0}buf(t,r){let e=this.device.createBuffer({size:t.byteLength,usage:r});return this.device.queue.writeBuffer(e,0,t),e}bufU32(t,r){let e=this.device.createBuffer({size:t.byteLength,usage:r});return this.device.queue.writeBuffer(e,0,t),e}async readBack(t,r){let e=globalThis,n=this.device.createBuffer({size:r,usage:e.GPUBufferUsage.COPY_DST|e.GPUBufferUsage.MAP_READ}),s=this.device.createCommandEncoder();s.copyBufferToBuffer(t,0,n,0,r),this.device.queue.submit([s.finish()]),await n.mapAsync(e.GPUMapMode.READ);let i=new Float32Array(n.getMappedRange().slice(0));return n.unmap(),n.destroy(),i}async readBackBytes(t,r){let e=globalThis,n=Math.ceil(r/4)*4,s=this.device.createBuffer({size:n,usage:e.GPUBufferUsage.COPY_DST|e.GPUBufferUsage.MAP_READ}),i=this.device.createCommandEncoder();i.copyBufferToBuffer(t,0,s,0,n),this.device.queue.submit([i.finish()]),await s.mapAsync(e.GPUMapMode.READ);let a=new Uint8Array(s.getMappedRange().slice(0,r));return s.unmap(),s.destroy(),a}async quantizeToBytes(t,r,e,n,s){let i=e/32,a=n==="q8"?new Uint8Array(e+i*2):new Uint8Array(e/2+i*4),o=ue.BLOCK_ELEMS[t]??1,u=e/o,c=r.byteLength/u,l=(m,b)=>b===0?m:l(b,m%b),d=o*32/l(o,32),p=Math.floor(this.maxStorageBufferBindingSize*.9/4),g=s??p;g=Math.max(d,Math.floor(g/d)*d);for(let m=0;m<e;m+=g){let b=Math.min(g,e-m),v=r.slice(m/o*c,(m+b)/o*c),U=this.dequantizeToGpu(t,v,b);try{if(n==="q8"){let{codes:A,sc:F}=this.f32ToQ8Gpu(U,b),T=await this.readBackBytes(A,b),K=await this.readBackBytes(F,b/32*2);A.destroy?.(),F.destroy?.(),a.set(T,m),a.set(K,e+m/32*2)}else{let{nib:A,sc:F,mn:T}=this.f32ToQ4Gpu(U,b),K=await this.readBackBytes(A,b/2),P=await this.readBackBytes(F,b/32*2),G=await this.readBackBytes(T,b/32*2);A.destroy?.(),F.destroy?.(),T.destroy?.(),a.set(K,m/2),a.set(P,e/2+m/32*2),a.set(G,e/2+i*2+m/32*2)}}finally{U.destroy?.()}}return a}pipeline(t){let r=this.pipelines[t];return r||(r=this.device.createComputePipeline({layout:"auto",compute:{module:this.modules[t],entryPoint:"main"}}),this.pipelines[t]=r),r}grid1D(t){let r=Math.ceil(t/ge);if(r<=ue.MAX_WG_DIM)return[r,1,1];let e=ue.MAX_WG_DIM;return[e,Math.ceil(r/e),1]}recordPass(t,r,e,n){let s=this.pipeline(r),i=this.device.createBindGroup({layout:s.getBindGroupLayout(0),entries:e.map((u,c)=>({binding:c,resource:{buffer:u}}))}),a=this.profiler?.slot(r),o=t.beginComputePass(a?{timestampWrites:a}:void 0);o.setPipeline(s),o.setBindGroup(0,i),o.dispatchWorkgroups(...n),o.end()}dispatch(t,r,e){let n=this.device.createCommandEncoder();this.recordPass(n,t,r,e),this.device.queue.submit([n.finish()])}async run(t,r,e,n,s){return this.dispatch(t,r,e),this.readBack(n,s)}isF32(t){return t instanceof Float32Array}async matmul(t,r,e,n,s){let i=globalThis,a=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([e,n,s]));let u=this.isF32(r)?this.buf(r,a):r,c=this.device.createBuffer({size:e*s*4,usage:a|i.GPUBufferUsage.COPY_SRC});return this.run("matmul",[o,this.buf(t,a),u,c],[Math.ceil(e/8),Math.ceil(s/8),1],c,e*s*4)}async matmulT(t,r,e,n,s,i=!1){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([e,n,s]));let c=this.isF32(r)?this.buf(r,o):r,l=this.device.createBuffer({size:e*s*4,usage:o|a.GPUBufferUsage.COPY_SRC}),d=this.matmulTPlan(e,n,s,i);return this.run(d.shader,[u,this.buf(t,o),c,l],d.grid,l,e*s*4)}matmulTPlan(t,r,e,n){return n&&this.hasF16?this.f16SharedOk&&t>=32&&r%4===0?{shader:"matmul_t_f16w_shared",grid:[Math.ceil(e/64),Math.ceil(t/32),1]}:{shader:"matmul_t_f16w",grid:[Math.ceil(t/8),Math.ceil(e/8),1]}:{shader:r%4===0?"matmul_t_vec4":"matmul_t",grid:[Math.ceil(t/8),Math.ceil(e/8),1]}}async rmsnorm(t,r,e,n,s=1e-5,i=!1){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([e,n])),this.device.queue.writeBuffer(u,8,new Float32Array([s])),this.device.queue.writeBuffer(u,12,new Uint32Array([i?1:0]));let c=this.device.createBuffer({size:t.byteLength,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("rmsnorm",[u,this.buf(t,o),this.buf(r,o),c],[Math.ceil(e/ge),1,1],c,t.byteLength)}async topKReadback(t,r,e){let n=globalThis,s=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST,i=this.device.createBuffer({size:8,usage:n.GPUBufferUsage.UNIFORM|n.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(i,0,new Uint32Array([t.length,r]));let a=this.device.createBuffer({size:r*2*4,usage:s|n.GPUBufferUsage.COPY_SRC}),o=this.device.createBuffer({size:r*2*4,usage:n.GPUBufferUsage.COPY_DST|n.GPUBufferUsage.MAP_READ}),u=this.device.createCommandEncoder(),c=this.buf(t,s);this.recordPass(u,e,[i,c,a],[1,1,1]),u.copyBufferToBuffer(a,0,o,0,r*2*4),this.device.queue.submit([u.finish()]),await o.mapAsync(n.GPUMapMode.READ);let l=new Uint32Array(o.getMappedRange().slice(0));return o.unmap(),o.destroy(),a.destroy?.(),i.destroy?.(),c.destroy?.(),l}async rmsnormVec(t,r,e,n,s=1e-5,i=!1,a="rmsnorm_vec"){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([e,n])),this.device.queue.writeBuffer(c,8,new Float32Array([s])),this.device.queue.writeBuffer(c,12,new Uint32Array([i?1:0]));let l=this.device.createBuffer({size:t.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run(a,[c,this.buf(t,u),this.buf(r,u),l],[e,1,1],l,t.byteLength)}async binary(t,r,e){let n=globalThis,s=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST,i=this.device.createBuffer({size:r.byteLength,usage:s|n.GPUBufferUsage.COPY_SRC});return this.run(t,[this.buf(r,s),this.buf(e,s),i],this.grid1D(r.length),i,r.byteLength)}swiglu(t,r){return this.binary("swiglu",t,r)}geglu(t,r){return this.binary("geglu",t,r)}add(t,r){return this.binary("add",t,r)}async silu(t){let r=globalThis,e=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:t.byteLength,usage:e|r.GPUBufferUsage.COPY_SRC});return this.run("silu",[this.buf(t,e),n],this.grid1D(t.length),n,t.byteLength)}async groupNorm(t,r,e,n,s,i,a=1e-5,o="group_norm"){let u=globalThis,c=u.GPUBufferUsage.STORAGE|u.GPUBufferUsage.COPY_DST,l=this.device.createBuffer({size:16,usage:u.GPUBufferUsage.UNIFORM|u.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(l,0,new Uint32Array([n,s,i])),this.device.queue.writeBuffer(l,12,new Float32Array([a]));let d=this.device.createBuffer({size:t.byteLength,usage:c|u.GPUBufferUsage.COPY_SRC});return this.run(o,[l,this.buf(t,c),this.buf(r,c),this.buf(e,c),d],[i,1,1],d,t.byteLength)}async conv2d(t,r,e,n,s,i,a,o,u,c=1,l=0){let d=globalThis,p=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,g=Math.floor((s+2*l-o)/c)+1,m=Math.floor((i+2*l-u)/c)+1,b=n*o*u,v=g*m;if(b*v*4>this.maxStorageBufferBindingSize*.9)return this.conv2dDirect(t,r,e,n,s,i,a,o,u,c,l);let U=this.device.createBuffer({size:48,usage:d.GPUBufferUsage.UNIFORM|d.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(U,0,new Uint32Array([n,s,i,o,u,c,l,g,m]));let A=this.device.createBuffer({size:b*v*4,usage:p|d.GPUBufferUsage.COPY_SRC});this.dispatch("im2col",[U,this.buf(t,p),A],this.grid1D(b*v));let F=await this.matmul(r,A,a,b,v);if(A.destroy?.(),U.destroy?.(),e)for(let T=0;T<a;T++){let K=e[T];for(let P=0;P<v;P++)F[T*v+P]+=K}return F}async conv2dDirect(t,r,e,n,s,i,a,o,u,c=1,l=0){let d=globalThis,p=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,g=Math.floor((s+2*l-o)/c)+1,m=Math.floor((i+2*l-u)/c)+1,b=a*g*m,v=this.device.createBuffer({size:48,usage:d.GPUBufferUsage.UNIFORM|d.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(v,0,new Uint32Array([n,s,i,a,o,u,c,l,g,m]));let U=e??new Float32Array(a),A=this.device.createBuffer({size:b*4,usage:p|d.GPUBufferUsage.COPY_SRC});return this.run("conv2d_direct",[v,this.buf(t,p),this.buf(r,p),this.buf(U,p),A],this.grid1D(b),A,b*4)}async layernorm(t,r,e,n,s,i=1e-5){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s])),this.device.queue.writeBuffer(u,8,new Float32Array([i]));let c=this.device.createBuffer({size:t.byteLength,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("layernorm",[u,this.buf(t,o),this.buf(r,o),this.buf(e,o),c],[Math.ceil(n/ge),1,1],c,t.byteLength)}async quickGelu(t){let r=globalThis,e=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:t.byteLength,usage:e|r.GPUBufferUsage.COPY_SRC});return this.run("quick_gelu",[this.buf(t,e),n],this.grid1D(t.length),n,t.byteLength)}async gelu(t){let r=globalThis,e=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:t.byteLength,usage:e|r.GPUBufferUsage.COPY_SRC});return this.run("gelu",[this.buf(t,e),n],this.grid1D(t.length),n,t.byteLength)}async relu(t){let r=globalThis,e=r.GPUBufferUsage.STORAGE|r.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:t.byteLength,usage:e|r.GPUBufferUsage.COPY_SRC});return this.run("relu",[this.buf(t,e),n],this.grid1D(t.length),n,t.byteLength)}async upsampleNearest(t,r,e,n,s=2){let i=globalThis,a=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=e*s,u=n*s,c=r*o*u,l=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(l,0,new Uint32Array([r,e,n,s]));let d=this.device.createBuffer({size:c*4,usage:a|i.GPUBufferUsage.COPY_SRC});return this.run("upsample_nearest",[l,this.buf(t,a),d],this.grid1D(c),d,c*4)}async upscale2x(t,r,e,n,s=.5){let i=e*2,a=n*2,o=this.recordingSession(),u=this.uploadGpu(t),c=o.upscale2x(u,r,e,n,s),l=await o.finish(c,r*i*a);return this.releaseGpu([u]),l}async rope(t,r,e,n,s=0,i=1e4,a=!1){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:32,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([r,e,n,s])),this.device.queue.writeBuffer(c,16,new Float32Array([i]));let l=this.device.createBuffer({size:t.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.device.queue.writeBuffer(c,20,new Uint32Array([a?1:0])),this.run("rope",[c,this.buf(t,u),l],[Math.ceil(r/ge),1,1],l,t.byteLength)}async ropeFactors(t,r,e,n,s,i=0,a=1e4,o=!1){let u=globalThis,c=u.GPUBufferUsage.STORAGE|u.GPUBufferUsage.COPY_DST,l=this.device.createBuffer({size:32,usage:u.GPUBufferUsage.UNIFORM|u.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(l,0,new Uint32Array([e,n,s,i])),this.device.queue.writeBuffer(l,16,new Float32Array([a]));let d=this.device.createBuffer({size:r.byteLength,usage:c});this.device.queue.writeBuffer(d,0,r);let p=this.device.createBuffer({size:t.byteLength,usage:c|u.GPUBufferUsage.COPY_SRC});return this.device.queue.writeBuffer(l,20,new Uint32Array([o?1:0])),this.run("rope_factors",[l,this.buf(t,c),d,p],[Math.ceil(e/ge),1,1],p,t.byteLength)}async ropeMrope(t,r,e,n,s,i,a=1e4){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:32,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([e,n,s,i[0],i[0]+i[1]])),this.device.queue.writeBuffer(c,20,new Float32Array([a]));let l=this.device.createBuffer({size:r.byteLength,usage:u});this.device.queue.writeBuffer(l,0,r);let d=this.device.createBuffer({size:t.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("rope_mrope",[c,this.buf(t,u),l,d],[Math.ceil(e/ge),1,1],d,t.byteLength)}async rope2d(t,r,e,n,s,i=1e4){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:32,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([e,n,s,0])),this.device.queue.writeBuffer(u,16,new Float32Array([i]));let c=this.device.createBuffer({size:r.byteLength,usage:o});this.device.queue.writeBuffer(c,0,r);let l=this.device.createBuffer({size:t.byteLength,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("rope_2d",[u,this.buf(t,o),c,l],[Math.ceil(e/ge),1,1],l,t.byteLength)}async attention(t,r,e,n,s,i,a,o=0,u,c=0,l=0){let d=globalThis,p=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,g=o+n,m=this.attnUniform(n,s,i,a,g,o,u??1/Math.sqrt(a),c,l),b=n*s*a*4,v=this.device.createBuffer({size:b,usage:p|d.GPUBufferUsage.COPY_SRC});return this.run("attention",[m,this.buf(t,p),this.buf(r,p),this.buf(e,p),v],[Math.ceil(n*s/ge),1,1],v,b)}async attentionDecode(t,r,e,n,s,i,a,o=0,u,c=0,l=0){let d=globalThis,p=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,g=o+n,m=this.attnUniform(n,s,i,a,g,o,u??1/Math.sqrt(a),c,l),b=n*s*a*4,v=this.device.createBuffer({size:b,usage:p|d.GPUBufferUsage.COPY_SRC});return this.run("attention_decode",[m,this.buf(t,p),this.buf(r,p),this.buf(e,p),v],[n*s,1,1],v,b)}async attentionPrefill(t,r,e,n,s,i,a,o=0,u,c=0,l=0){let d=globalThis,p=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,g=o+n,m=this.attnUniform(n,s,i,a,g,o,u??1/Math.sqrt(a),c,l),b=n*s*a*4,v=this.device.createBuffer({size:b,usage:p|d.GPUBufferUsage.COPY_SRC});return this.run("attention_prefill",[m,this.buf(t,p),this.buf(r,p),this.buf(e,p),v],[Math.ceil(n/4)*s,1,1],v,b)}async attentionFull(t,r,e,n,s,i,a,o,u,c=0){let l=globalThis,d=l.GPUBufferUsage.STORAGE|l.GPUBufferUsage.COPY_DST,p=this.device.createBuffer({size:32,usage:l.GPUBufferUsage.UNIFORM|l.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(p,0,new Uint32Array([n,s,i,a,o,0])),this.device.queue.writeBuffer(p,24,new Float32Array([u??1/Math.sqrt(a),c]));let g=n*s*a*4,m=this.device.createBuffer({size:g,usage:d|l.GPUBufferUsage.COPY_SRC});return this.run("attention_full",[p,this.buf(t,d),this.buf(r,d),this.buf(e,d),m],[Math.ceil(n*s/ge),1,1],m,g)}async attentionFullWg(t,r,e,n,s,i,a,o,u,c=0){let l=globalThis,d=l.GPUBufferUsage.STORAGE|l.GPUBufferUsage.COPY_DST,p=this.device.createBuffer({size:32,usage:l.GPUBufferUsage.UNIFORM|l.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(p,0,new Uint32Array([n,s,i,a,o,0])),this.device.queue.writeBuffer(p,24,new Float32Array([u??1/Math.sqrt(a),c]));let g=n*s*a*4,m=this.device.createBuffer({size:g,usage:d|l.GPUBufferUsage.COPY_SRC});return this.run("attention_full_wg",[p,this.buf(t,d),this.buf(r,d),this.buf(e,d),m],[n*s,1,1],m,g)}async quantizeKvReadback(t,r,e,n){let s=globalThis,i=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST|s.GPUBufferUsage.COPY_SRC,a=e*n,o=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([r,e,n,0]));let u=this.device.createBuffer({size:r*a,usage:i}),c=this.device.createBuffer({size:r*e*4,usage:i});this.dispatch("quantize_kv",[o,this.buf(t,i),u,c],this.grid1D(r*e));let l=await this.readBack(u,r*a),d=new Uint32Array(l.buffer,0,r*a/4),p=await this.readBack(c,r*e*4);return u.destroy?.(),c.destroy?.(),{codes:d,scales:p}}async attentionQ8Kv(t,r,e,n,s,i,a,o,u,c=0,l,d=0,p=0){let g=globalThis,m=g.GPUBufferUsage.STORAGE|g.GPUBufferUsage.COPY_DST,b=c+i,v=this.attnUniform(i,a,o,u,b,c,l??1/Math.sqrt(u),d,p),U=i*a*u*4,A=this.device.createBuffer({size:U,usage:m|g.GPUBufferUsage.COPY_SRC});return this.run("attention_q8kv",[v,this.buf(t,m),this.bufU32(r,m),this.buf(e,m),this.bufU32(n,m),this.buf(s,m),A],[Math.ceil(i*a/ge),1,1],A,U)}async attentionQ8KvDecode(t,r,e,n,s,i,a,o,u,c=0,l,d=0,p=0){let g=globalThis,m=g.GPUBufferUsage.STORAGE|g.GPUBufferUsage.COPY_DST,b=c+i,v=this.attnUniform(i,a,o,u,b,c,l??1/Math.sqrt(u),d,p),U=i*a*u*4,A=this.device.createBuffer({size:U,usage:m|g.GPUBufferUsage.COPY_SRC});return this.run("attention_decode_q8kv",[v,this.buf(t,m),this.bufU32(r,m),this.buf(e,m),this.bufU32(n,m),this.buf(s,m),A],[i*a,1,1],A,U)}async attentionQ8KvPrefill(t,r,e,n,s,i,a,o,u,c=0,l,d=0,p=0){let g=globalThis,m=g.GPUBufferUsage.STORAGE|g.GPUBufferUsage.COPY_DST,b=c+i,v=this.attnUniform(i,a,o,u,b,c,l??1/Math.sqrt(u),d,p),U=i*a*u*4,A=this.device.createBuffer({size:U,usage:m|g.GPUBufferUsage.COPY_SRC});return this.run("attention_prefill_q8kv",[v,this.buf(t,m),this.bufU32(r,m),this.buf(e,m),this.bufU32(n,m),this.buf(s,m),A],[Math.ceil(i/4)*a,1,1],A,U)}async addBias(t,r,e,n){let s=globalThis,i=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,a=this.device.createBuffer({size:8,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(a,0,new Uint32Array([e,n]));let o=this.device.createBuffer({size:t.byteLength,usage:i|s.GPUBufferUsage.COPY_SRC});return this.run("addbias",[a,this.buf(t,i),this.buf(r,i),o],this.grid1D(t.length),o,t.byteLength)}async dequantBlocked(t,r,e,n){let s=globalThis,i=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,a=e/n;if(!Number.isInteger(a))throw new Error(`${t}: nElems ${e} not a multiple of ${n}`);let o=r.byteLength%4===0?r:(()=>{let d=new Uint8Array(Math.ceil(r.byteLength/4)*4);return d.set(r),d})(),u=new Uint32Array(o.buffer,o.byteOffset,o.byteLength/4),c=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([a]));let l=this.device.createBuffer({size:e*4,usage:i|s.GPUBufferUsage.COPY_SRC});return this.run(t,[c,this.bufU32(u,i),l],this.grid1D(a),l,e*4)}async dequantizeQ4K(t,r){return this.dequantBlocked("dequant_q4k",t,r,256)}async dequantizeByType(t,r,e){if(t==="F32")return new Float32Array(r.buffer,r.byteOffset,e);if(t==="BF16")return Cn(r,e);if(t==="F16"){let i=new DataView(r.buffer,r.byteOffset),a=new Float32Array(e);for(let o=0;o<e;o++)a[o]=Pe(i.getUint16(o*2,!0));return a}if(t==="Q4W")return ye(Ae(r,e));if(t==="Q8W")return ke(Fe(r,e));if(t==="Q3W")return $e(Me(r,e));if(t==="Q3_K"&&!this.dequantQ3kOk)return _r(r,Math.floor(e/256));if(t==="Q4_1"&&!this.dequantQ41Ok)return Ar(r,Math.floor(e/32));if(t==="PQ2_0"&&!this.dequantPq2Ok)return We(r,Math.floor(e/128));let n=ue.DEQUANT_SHADER[t],s=ue.BLOCK_ELEMS[t];if(!n||!s)throw new Error(`dequant: unsupported GGML type ${t}`);return this.dequantBlocked(n,r,e,s)}dequantBlockedGpu(t,r,e,n,s){let i=globalThis,a=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=e/n;if(!Number.isInteger(o))throw new Error(`${t}: nElems ${e} not a multiple of ${n}`);let u=r.byteLength%4===0?r:(()=>{let g=new Uint8Array(Math.ceil(r.byteLength/4)*4);return g.set(r),g})(),c=new Uint32Array(u.buffer,u.byteOffset,u.byteLength/4),l=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(l,0,new Uint32Array([o]));let d=s??this.device.createBuffer({size:e*4,usage:a}),p=this.bufU32(c,a);return this.dispatch(t,[l,p,d],this.grid1D(o)),p.destroy(),l.destroy(),d}dequantizeToGpu(t,r,e){let n=globalThis,s=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST;if(t==="F32")return this.buf(new Float32Array(r.buffer,r.byteOffset,e),s);if(t==="F16"){let o=new DataView(r.buffer,r.byteOffset),u=new Float32Array(e);for(let c=0;c<e;c++)u[c]=Pe(o.getUint16(c*2,!0));return this.buf(u,s)}if(t==="BF16")return this.buf(Cn(r,e),s);if(t==="Q4W")return this.buf(ye(Ae(r,e)),s);if(t==="Q8W")return this.buf(ke(Fe(r,e)),s);if(t==="Q3W")return this.buf($e(Me(r,e)),s);if(t==="Q3_K"&&!this.dequantQ3kOk)return this.buf(_r(r,Math.floor(e/256)),s);if(t==="Q4_1"&&!this.dequantQ41Ok)return this.buf(Ar(r,Math.floor(e/32)),s);if(t==="PQ2_0"&&!this.dequantPq2Ok)return this.buf(We(r,Math.floor(e/128)),s);let i=ue.DEQUANT_SHADER[t],a=ue.BLOCK_ELEMS[t];if(!i||!a)throw new Error(`dequant: unsupported GGML type ${t}`);return this.dequantBlockedGpu(i,r,e,a)}dequantizeIntoGpu(t,r,e,n){if(t==="PQ2_0"&&!this.dequantPq2Ok){this.device.queue.writeBuffer(n,0,We(r,Math.floor(e/128)));return}let s=ue.DEQUANT_SHADER[t],i=ue.BLOCK_ELEMS[t];if(!s||!i)throw new Error(`dequantizeIntoGpu : type ${t} non g\xE9r\xE9`);this.dequantBlockedGpu(s,r,e,i,n)}async layerForward(t,r,e,n=!1){let{seq:s,d:i,nHeads:a,nKvHeads:o,headDim:u,ffn:c,ropeTheta:l,eps:d}=r,p=o*u,g=n?(M,O,C,S,R)=>this.matmulT(M,O,C,S,R):(M,O,C,S,R)=>this.matmul(M,O,C,S,R),m=a*u,b=r.rmsGainOnePlus===!0,v=r.attnLogitSoftcap??0,U=(M,O)=>r.act==="gelu"?this.geglu(M,O):this.swiglu(M,O),A=await this.rmsnorm(t,e.attnNorm,s,i,d,b),F=await g(A,e.wq,s,i,m),T=await g(A,e.wk,s,i,p),K=await g(A,e.wv,s,i,p);e.bq&&(F=await this.addBias(F,e.bq,s,m)),e.bk&&(T=await this.addBias(T,e.bk,s,p)),e.bv&&(K=await this.addBias(K,e.bv,s,p)),e.qNorm&&(F=await this.rmsnorm(F,e.qNorm,s*a,u,d,b)),e.kNorm&&(T=await this.rmsnorm(T,e.kNorm,s*o,u,d,b));let P=await this.rope(F,s*a,u,a,0,l),G=await this.rope(T,s*o,u,o,0,l),_=await this.attention(P,G,K,s,a,o,u,0,r.attnScale,v),h=await g(_,e.wo,s,m,i);e.postAttnNorm&&(h=await this.rmsnorm(h,e.postAttnNorm,s,i,d,b));let y=await this.add(t,h),k=await this.rmsnorm(y,e.ffnNorm,s,i,d,b),w=await g(k,e.wgate,s,i,c),x=await g(k,e.wup,s,i,c),B=await U(w,x),q=await g(B,e.wdown,s,c,i);return e.postFfnNorm&&(q=await this.rmsnorm(q,e.postFfnNorm,s,i,d,b)),this.add(y,q)}async layerForwardKV(t,r,e,n,s,i,a=!1){let{seq:o,d:u,nHeads:c,nKvHeads:l,headDim:d,ffn:p,ropeTheta:g,eps:m}=r,b=l*d,v=a?(N,I,$,D,z)=>this.matmulT(N,I,$,D,z):(N,I,$,D,z)=>this.matmul(N,I,$,D,z),U=(N,I)=>{let $=new Float32Array(N.length+I.length);return $.set(N),$.set(I,N.length),$},A=c*d,F=r.rmsGainOnePlus===!0,T=r.attnLogitSoftcap??0,K=(N,I)=>r.act==="gelu"?this.geglu(N,I):this.swiglu(N,I),P=await this.rmsnorm(t,e.attnNorm,o,u,m,F),G=await v(P,e.wq,o,u,A),_=await v(P,e.wk,o,u,b),h=await v(P,e.wv,o,u,b);e.bq&&(G=await this.addBias(G,e.bq,o,A)),e.bk&&(_=await this.addBias(_,e.bk,o,b)),e.bv&&(h=await this.addBias(h,e.bv,o,b)),e.qNorm&&(G=await this.rmsnorm(G,e.qNorm,o*c,d,m,F)),e.kNorm&&(_=await this.rmsnorm(_,e.kNorm,o*l,d,m,F));let y=await this.rope(G,o*c,d,c,n,g),k=await this.rope(_,o*l,d,l,n,g),w=U(s,k),x=U(i,h),B=await this.attention(y,w,x,o,c,l,d,n,r.attnScale,T),q=await v(B,e.wo,o,A,u);e.postAttnNorm&&(q=await this.rmsnorm(q,e.postAttnNorm,o,u,m,F));let M=await this.add(t,q),O=await this.rmsnorm(M,e.ffnNorm,o,u,m,F),C=await v(O,e.wgate,o,u,p),S=await v(O,e.wup,o,u,p),R=await K(C,S),E=await v(R,e.wdown,o,p,u);return e.postFfnNorm&&(E=await this.rmsnorm(E,e.postFfnNorm,o,u,m,F)),{out:await this.add(M,E),k:w,v:x}}storage(t){let r=this.bufferPool.get(t);if(r&&r.length){let n=r.pop();return this.pooled.delete(n),n}let e=this.device.createBuffer({size:t,usage:ue.STORAGE_USAGE});return this.poolSize.set(e,t),e}release(t){for(let r of t){if(!r)continue;let e=this.poolSize.get(r);if(e!==void 0){if(this.pooled.has(r))continue;this.pooled.add(r);let s=this.bufferPool.get(e);s||(s=[],this.bufferPool.set(e,s)),s.push(r);continue}let n=this.uniformSize.get(r);if(n!==void 0){if(this.pooled.has(r))continue;this.pooled.add(r);let s=this.uniformPool.get(n);s||(s=[],this.uniformPool.set(n,s)),s.push(r);continue}r.destroy?.()}}recycleStorage(t){this.release(t.filter(r=>r&&this.poolSize.has(r)))}uploadGpu(t){return t instanceof Float32Array?this.buf(t,ue.STORAGE_USAGE):this.f16ToF32Gpu(t.f16,t.n)}uploadGpuF16(t){let r=new Uint16Array(t.length);for(let e=0;e<t.length;e++)r[e]=me(t[e]);return this.bufU16(r)}f32ToF16Gpu(t,r){let e=globalThis,n=Math.ceil(r/2),s=this.device.createBuffer({size:n*4,usage:ue.STORAGE_USAGE}),i=this.device.createBuffer({size:16,usage:e.GPUBufferUsage.UNIFORM|e.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(i,0,new Uint32Array([n])),this.dispatch("packf16",[i,t,s],this.grid1D(n)),s}f32ToQ8Gpu(t,r){let e=globalThis,n=r/32,s=this.device.createBuffer({size:r,usage:ue.STORAGE_USAGE}),i=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:ue.STORAGE_USAGE}),a=this.device.createBuffer({size:16,usage:e.GPUBufferUsage.UNIFORM|e.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(a,0,new Uint32Array([n])),this.dispatch("quantize_q8",[a,t,s,i],this.grid1D(n)),a.destroy(),{codes:s,sc:i}}f32ToQ4Gpu(t,r){let e=globalThis,n=r/32,s=this.device.createBuffer({size:r/2,usage:ue.STORAGE_USAGE}),i=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:ue.STORAGE_USAGE}),a=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:ue.STORAGE_USAGE}),o=this.device.createBuffer({size:16,usage:e.GPUBufferUsage.UNIFORM|e.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(o,0,new Uint32Array([n])),this.dispatch("quantize_q4",[o,t,s,i,a],this.grid1D(n)),o.destroy(),{nib:s,sc:i,mn:a}}uploadGpuRawF16(t){let r=Math.ceil(t.byteLength/4)*4,e=this.device.createBuffer({size:r,usage:ue.STORAGE_USAGE});if(this.device.queue.writeBuffer(e,0,t,0,t.byteLength-t.byteLength%4),t.byteLength%4){let n=new Uint8Array(4);n.set(t.subarray(t.byteLength-t.byteLength%4)),this.device.queue.writeBuffer(e,t.byteLength-t.byteLength%4,n)}return e}bufU16(t){let r=this.device.createBuffer({size:t.byteLength,usage:ue.STORAGE_USAGE});return this.device.queue.writeBuffer(r,0,t),r}uploadGpuRaw(t){let r=Math.ceil(t.byteLength/4)*4,e=this.device.createBuffer({size:r,usage:ue.STORAGE_USAGE}),n=t.byteLength-t.byteLength%4;if(this.device.queue.writeBuffer(e,0,t,0,n),t.byteLength%4){let s=new Uint8Array(4);s.set(t.subarray(n)),this.device.queue.writeBuffer(e,n,s)}return e}async matmulQ4(t,r,e,n,s,i,a){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s,i,a]));let l=this.device.createBuffer({size:s*a*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4",[c,this.buf(t,u),r,e,n,l],[Math.ceil(s/8),Math.ceil(a/8),1],l,s*a*4)}async matmulQ4Tiled(t,r,e,n,s,i,a){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s,i,a]));let l=this.device.createBuffer({size:s*a*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_tiled",[c,this.buf(t,u),r,e,n,l],[Math.ceil(Math.ceil(s/4)/8),Math.ceil(a/8),1],l,s*a*4)}async matmulQ4Shared(t,r,e,n,s,i,a){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s,i,a]));let l=this.device.createBuffer({size:s*a*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_shared",[c,this.buf(t,u),r,e,n,l],[Math.ceil(a/64),Math.ceil(s/32),1],l,s*a*4)}async matmulQ3(t,r,e,n,s,i,a,o){let u=globalThis,c=u.GPUBufferUsage.STORAGE|u.GPUBufferUsage.COPY_DST,l=this.device.createBuffer({size:16,usage:u.GPUBufferUsage.UNIFORM|u.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(l,0,new Uint32Array([i,a,o]));let d=this.device.createBuffer({size:i*o*4,usage:c|u.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q3",[l,this.buf(t,c),r,e,n,s,d],[Math.ceil(i/8),Math.ceil(o/8),1],d,i*o*4)}async rwkvWkv7(t,r,e,n,s,i,a,o,u){let c=globalThis,l=c.GPUBufferUsage.STORAGE|c.GPUBufferUsage.COPY_DST,d=this.device.createBuffer({size:8,usage:c.GPUBufferUsage.UNIFORM|c.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(d,0,new Uint32Array([o,u]));let p=this.device.createBuffer({size:t.byteLength,usage:l|c.GPUBufferUsage.COPY_SRC});this.device.queue.writeBuffer(p,0,t);let g=this.device.createBuffer({size:o*u*4,usage:l|c.GPUBufferUsage.COPY_SRC});this.dispatch("rwkv_wkv7",[d,this.buf(r,l),this.buf(e,l),this.buf(n,l),this.buf(s,l),this.buf(i,l),this.buf(a,l),p,g],this.grid1D(o*u));let m=await this.readBack(p,t.byteLength),b=await this.readBack(g,o*u*4);return p.destroy?.(),g.destroy?.(),{S:m,y:b}}async rwkvTokenShift(t,r,e,n){let s=globalThis,i=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,a=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(a,0,new Uint32Array([n]));let o=this.device.createBuffer({size:6*n*4,usage:i|s.GPUBufferUsage.COPY_SRC});this.dispatch("rwkv_token_shift",[a,this.buf(t,i),this.buf(r,i),this.buf(e,i),o],this.grid1D(n*6));let u=await this.readBack(o,6*n*4);return o.destroy?.(),u}async lfm2ShortConv(t,r,e,n,s){let i=globalThis,a=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([n,s]));let u=this.buf(r,a|i.GPUBufferUsage.COPY_SRC),c=this.device.createBuffer({size:n*4,usage:a|i.GPUBufferUsage.COPY_SRC});this.dispatch("lfm2_shortconv",[o,this.buf(t,a),this.buf(e,a),u,c],this.grid1D(n));let l=await this.readBack(c,n*4),d=await this.readBack(u,(s-1)*n*4);return c.destroy?.(),u.destroy?.(),{out:l,state:d}}async qwen35Conv1d(t,r,e,n,s=4){let i=globalThis,a=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([n,s]));let u=this.buf(r,a|i.GPUBufferUsage.COPY_SRC),c=this.device.createBuffer({size:n*4,usage:a|i.GPUBufferUsage.COPY_SRC});this.dispatch("qwen35_ssm_conv",[o,this.buf(t,a),this.buf(e,a),u,c],this.grid1D(n));let l=await this.readBack(c,n*4),d=await this.readBack(u,(s-1)*n*4);return c.destroy?.(),u.destroy?.(),o.destroy?.(),{out:l,state:d}}async qwen35DeltaNetStep(t,r,e,n,s,i,a,o,u){let c=globalThis,l=c.GPUBufferUsage.STORAGE|c.GPUBufferUsage.COPY_DST,d=this.device.createBuffer({size:16,usage:c.GPUBufferUsage.UNIFORM|c.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(d,0,new Uint32Array([a,o,u]));let p=this.buf(i,l|c.GPUBufferUsage.COPY_SRC),g=this.device.createBuffer({size:u*o*4,usage:l|c.GPUBufferUsage.COPY_SRC});this.dispatch("qwen35_deltanet_step",[d,this.buf(t,l),this.buf(r,l),this.buf(e,l),this.buf(n,l),this.buf(s,l),p,g],[Math.ceil(o/64),u,1]);let m=await this.readBack(g,u*o*4),b=await this.readBack(p,u*a*o*4);return g.destroy?.(),p.destroy?.(),d.destroy?.(),{out:m,S:b}}async matmulQ8(t,r,e,n,s,i){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s,i]));let c=this.device.createBuffer({size:n*i*4,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8",[u,this.buf(t,o),r,e,c],[Math.ceil(n/8),Math.ceil(i/8),1],c,n*i*4)}async matmulQ8Tiled(t,r,e,n,s,i){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s,i]));let c=this.device.createBuffer({size:n*i*4,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_tiled",[u,this.buf(t,o),r,e,c],[Math.ceil(Math.ceil(n/4)/8),Math.ceil(i/8),1],c,n*i*4)}async matmulQ8Shared(t,r,e,n,s,i){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s,i]));let c=this.device.createBuffer({size:n*i*4,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_shared",[u,this.buf(t,o),r,e,c],[Math.ceil(i/64),Math.ceil(n/32),1],c,n*i*4)}async matmulQ8Shared2(t,r,e,n,s,i){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s,i]));let c=this.device.createBuffer({size:n*i*4,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_shared2",[u,this.buf(t,o),r,e,c],[Math.ceil(i/128),Math.ceil(n/64),1],c,n*i*4)}async matmulQ4Shared2(t,r,e,n,s,i,a){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s,i,a]));let l=this.device.createBuffer({size:s*a*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_shared2",[c,this.buf(t,u),r,e,n,l],[Math.ceil(a/128),Math.ceil(s/64),1],l,s*a*4)}uniformOf(t){let r=globalThis,e=this.uniformPool.get(t);if(e&&e.length){let s=e.pop();return this.pooled.delete(s),s}let n=this.device.createBuffer({size:t,usage:r.GPUBufferUsage.UNIFORM|r.GPUBufferUsage.COPY_DST});return this.uniformSize.set(n,t),n}uniform(t,r){let e=this.uniformOf(32);if(this.device.queue.writeBuffer(e,0,new Uint32Array(t)),r){let n=Array.isArray(r.value)?r.value:[r.value];this.device.queue.writeBuffer(e,r.offset,new Float32Array(n))}return e}attnUniform(t,r,e,n,s,i,a,o,u){let c=this.uniformOf(48);return this.device.queue.writeBuffer(c,0,new Uint32Array([t,r,e,n,s,i])),this.device.queue.writeBuffer(c,24,new Float32Array([a,o])),this.device.queue.writeBuffer(c,32,new Uint32Array([u])),c}recMatmulT(t,r,e,n,s,i,a,o=!1){let u=this.uniform([s,i,a]),c=this.storage(s*a*4),l=this.matmulTPlan(s,i,a,o);return this.recordPass(t,l.shader,[u,e,n,c],l.grid),r.push(u,c),c}recConv2dDirect(t,r,e,n,s,i,a,o,u,c,l,d,p){let g=Math.floor((a+2*p-c)/d)+1,m=Math.floor((o+2*p-l)/d)+1,b=u*g*m,v=this.uniformOf(48);if(this.device.queue.writeBuffer(v,0,new Uint32Array([i,a,o,u,c,l,d,p,g,m])),c===3&&l===3&&d===1&&p===1&&this.convTiledOk){let A=this.storage(b*4);return this.recordPass(t,"conv2d_3x3_tiled",[v,e,n,s,A],[Math.ceil(m/16),Math.ceil(g/16),u]),r.push(v,A),A}let U=this.storage(b*4);return this.recordPass(t,"conv2d_direct",[v,e,n,s,U],this.grid1D(b)),r.push(v,U),U}recConv2dDirectQ8(t,r,e,n,s,i,a,o,u,c,l,d,p){let g=Math.floor((a+2*p-c)/d)+1,m=Math.floor((o+2*p-l)/d)+1,b=u*g*m,v=this.uniformOf(48);if(this.device.queue.writeBuffer(v,0,new Uint32Array([i,a,o,u,c,l,d,p,g,m])),this.convGemmOk&&i*c*l%4===0){let A=this.storage(b*4);return this.recordPass(t,"conv2d_igemm_q8",[v,e,n.codes,n.sc,s,A],[Math.ceil(u/128),Math.ceil(g*m/64),1]),r.push(v,A),A}if(c===3&&l===3&&d===1&&p===1&&this.convTiledQOk){let A=this.storage(b*4);return this.recordPass(t,"conv2d_3x3_tiled_q8",[v,e,n.codes,n.sc,s,A],[Math.ceil(m/16),Math.ceil(g/16),Math.ceil(u/8)]),r.push(v,A),A}if(c===1&&l===1&&d===1&&p===0&&this.convTiledQOk){let A=this.storage(b*4);return this.recordPass(t,"conv2d_1x1_q8",[v,e,n.codes,n.sc,s,A],[Math.ceil(m/16),Math.ceil(g/16),Math.ceil(u/8)]),r.push(v,A),A}if(c===3&&l===3&&d===2&&p===1&&this.convTiledQOk&&this.convS2Ok){let A=this.storage(b*4);return this.recordPass(t,"conv2d_3x3_s2_tiled_q8",[v,e,n.codes,n.sc,s,A],[Math.ceil(m/16),Math.ceil(g/8),Math.ceil(u/8)]),r.push(v,A),A}let U=this.storage(b*4);return this.recordPass(t,"conv2d_direct_q8",[v,e,n.codes,n.sc,s,U],this.grid1D(b)),r.push(v,U),U}recConv2dDirectQ4(t,r,e,n,s,i,a,o,u,c,l,d,p){let g=Math.floor((a+2*p-c)/d)+1,m=Math.floor((o+2*p-l)/d)+1,b=u*g*m,v=this.uniformOf(48);if(this.device.queue.writeBuffer(v,0,new Uint32Array([i,a,o,u,c,l,d,p,g,m])),c===3&&l===3&&d===1&&p===1&&this.convTiledQOk){let A=this.storage(b*4);return this.recordPass(t,"conv2d_3x3_tiled_q4",[v,e,n.nib,n.sc,n.mn,s,A],[Math.ceil(m/16),Math.ceil(g/16),Math.ceil(u/8)]),r.push(v,A),A}if(c===1&&l===1&&d===1&&p===0&&this.convTiledQOk){let A=this.storage(b*4);return this.recordPass(t,"conv2d_1x1_q4",[v,e,n.nib,n.sc,n.mn,s,A],[Math.ceil(m/16),Math.ceil(g/16),Math.ceil(u/8)]),r.push(v,A),A}if(c===3&&l===3&&d===2&&p===1&&this.convTiledQOk&&this.convS2Ok){let A=this.storage(b*4);return this.recordPass(t,"conv2d_3x3_s2_tiled_q4",[v,e,n.nib,n.sc,n.mn,s,A],[Math.ceil(m/16),Math.ceil(g/8),Math.ceil(u/8)]),r.push(v,A),A}let U=this.storage(b*4);return this.recordPass(t,"conv2d_direct_q4",[v,e,n.nib,n.sc,n.mn,s,U],this.grid1D(b)),r.push(v,U),U}recGroupNorm(t,r,e,n,s,i,a,o,u){let c=this.uniform([i,a,o],{offset:12,value:u}),l=this.storage(i*a*4),d=this.hasSubgroups&&this.subgroupsOk?"group_norm_subgroup":"group_norm";return this.recordPass(t,d,[c,e,n,s,l],[o,1,1]),r.push(c,l),l}recUnary(t,r,e,n,s){let i=this.storage(s*4);return this.recordPass(t,e,[n,i],this.grid1D(s)),r.push(i),i}recLayernorm(t,r,e,n,s,i,a,o){let u=this.uniform([i,a],{offset:8,value:o}),c=this.storage(i*a*4);return this.recordPass(t,"layernorm",[u,e,n,s,c],[Math.ceil(i/ge),1,1]),r.push(u,c),c}recAttentionFull(t,r,e,n,s,i,a,o,u,c,l){let d=this.uniform([i,a,o,u,c,0],{offset:24,value:[l??1/Math.sqrt(u),0]}),p=this.storage(i*a*u*4),g=i*a;return this.attnFlashOk&&u===64&&i>=64&&a<=65535?this.recordPass(t,"attention_flash64",[d,e,n,s,p],[Math.ceil(i/64),a,1]):this.attnFullWgOk&&u<=192&&g<=65535?this.recordPass(t,"attention_full_wg",[d,e,n,s,p],[g,1,1]):this.recordPass(t,"attention_full",[d,e,n,s,p],[Math.ceil(g/ge),1,1]),r.push(d,p),p}recAttentionBias(t,r,e,n,s,i,a,o,u){if(a>256)throw new Error(`attention_bias : L = ${a} > 256`);let c=this.uniform([a,o,u]),l=this.storage(a*o*u*4);return this.recordPass(t,"attention_bias",[c,e,n,s,i,l],this.grid1D(a*o)),r.push(c,l),l}recRopeLtx(t,r,e,n,s,i,a){let o=a/2,u=this.uniform([i,o]),c=this.storage(i*a*4);return this.recordPass(t,"rope_ltx",[u,e,n,s,c],this.grid1D(i*o)),r.push(u,c),c}recLtxModulate(t,r,e,n,s,i,a,o){let u=this.uniform([s,i,a,o]),c=this.storage(s*i*4);return this.recordPass(t,"ltx_modulate",[u,e,n,c],this.grid1D(s*i)),r.push(u,c),c}recLtxGatedAdd(t,r,e,n,s,i,a,o){let u=this.uniform([i,a,o]),c=this.storage(i*a*4);return this.recordPass(t,"ltx_gated_add",[u,e,n,s,c],this.grid1D(i*a)),r.push(u,c),c}recConv3dQ8(t,r,e,n,s,i,a,o,u,c){let l=a*o*u,d=this.uniform([i,a,o,u,c]),p=this.storage(c*l*4);return this.recordPass(t,"conv3d_igemm_q8",[d,e,n.codes,n.sc,s,p],[Math.ceil(c/128),Math.ceil(l/64),1]),r.push(d,p),p}recLtxNormAct(t,r,e,n,s,i,a,o,u){let c=this.uniform([s,i,a,o],{offset:16,value:u}),l=this.storage(s*i*4);return this.recordPass(t,"ltx_norm_act",[c,e,n,l],this.grid1D(i)),r.push(c,l),l}recLtxD2s(t,r,e,n,s,i,a,o,u){let c=s*(2*i-1)*4*a*o,l=this.uniform([s,i,a,o,u,n?1:0]),d=this.storage(c*4);return this.recordPass(t,"ltx_d2s",[l,e,n??e,d],this.grid1D(c)),r.push(l,d),d}recLtxUnpatchify(t,r,e,n,s,i,a){let o=n*s*16*i*a,u=this.uniform([n,s,i,a]),c=this.storage(o*4);return this.recordPass(t,"ltx_unpatchify",[u,e,c],this.grid1D(o)),r.push(u,c),c}recRifeAct(t,r,e,n,s,i){let a=this.uniform([n,i?1:0],{offset:8,value:[s,.2]}),o=this.storage(n*4);return this.recordPass(t,"rife_act",[a,e,o],this.grid1D(n)),r.push(a,o),o}recRifeResconv(t,r,e,n,s,i,a){let o=this.uniform([i,a]),u=this.storage(i*a*4);return this.recordPass(t,"rife_resconv",[o,e,n,s,u],this.grid1D(i*a)),r.push(o,u),u}recConvTranspose2d(t,r,e,n,s,i,a,o,u,c,l,d){let p=(a-1)*l-2*d+c,g=(o-1)*l-2*d+c,m=this.uniformOf(48);this.device.queue.writeBuffer(m,0,new Uint32Array([i,a,o,u,c,l,d,p,g]));let b=this.storage(u*p*g*4);return this.recordPass(t,"conv_transpose2d",[m,e,n,s,b],this.grid1D(u*p*g)),r.push(m,b),b}recPixelShuffle2(t,r,e,n,s,i){let a=this.uniform([n,s,i]),o=this.storage(n*4*s*i*4);return this.recordPass(t,"pixel_shuffle2",[a,e,o],this.grid1D(n*4*s*i)),r.push(a,o),o}recResizeBilinear(t,r,e,n,s,i,a,o){let u=this.uniform([n,s,i,a,o],{offset:20,value:[s/a,i/o]}),c=this.storage(n*a*o*4);return this.recordPass(t,"resize_bilinear",[u,e,c],this.grid1D(n*a*o)),r.push(u,c),c}recWarp(t,r,e,n,s,i,a,o){let u=this.uniform([s,i,a,o]),c=this.storage(s*i*a*4);return this.recordPass(t,"warp_bilinear",[u,e,n,c],this.grid1D(s*i*a)),r.push(u,c),c}recRifeBlend(t,r,e,n,s,i,a){let o=this.uniform([i,a]),u=this.storage(i*a*4);return this.recordPass(t,"rife_blend",[o,e,n,s,u],this.grid1D(i*a)),r.push(o,u),u}recUpsample(t,r,e,n,s,i,a){let o=this.uniform([n,s,i,a]),u=n*(s*a)*(i*a),c=this.storage(u*4);return this.recordPass(t,"upsample_nearest",[o,e,c],this.grid1D(u)),r.push(o,c),c}recConcat(t,r,e,n,s,i,a){let o=this.storage((s+i)*a*4);return t.copyBufferToBuffer(e,0,o,0,s*a*4),t.copyBufferToBuffer(n,0,o,s*a*4,i*a*4),r.push(o),o}recAddChannelBias(t,r,e,n,s,i){let a=this.uniform([s,i]),o=this.storage(s*i*4);return this.recordPass(t,"add_channel_bias",[a,e,n,o],this.grid1D(s*i)),r.push(a,o),o}recTranspose(t,r,e,n,s){let i=this.uniform([n,s]),a=this.storage(n*s*4);return this.recordPass(t,"transpose2d",[i,e,a],this.grid1D(n*s)),r.push(i,a),a}recGegluSplit(t,r,e,n,s){let i=this.uniform([n,s]),a=this.storage(n*s*4);return this.recordPass(t,"geglu_split",[i,e,a],this.grid1D(n*s)),r.push(i,a),a}recUpscale2x(t,r,e,n,s,i,a=.5){let o=this.uniform([n,s,i],{offset:12,value:a}),u=i*2,c=s*2,l=this.storage(n*c*u*4);return this.recordPass(t,"upscale2x_enhanced",[o,e,l],[Math.ceil(u/16),Math.ceil(c/16),n]),r.push(o,l),l}recVideoGather(t,r,e,n,s,i){let a=this.uniform([n,s,i]),o=this.storage(i*n*s*4);return this.recordPass(t,"video_motion_gather",[a,e,o],this.grid1D(i*n*s)),r.push(a,o),o}recVideoScatter(t,r,e,n,s,i,a){let o=this.uniform([s,i,a]),u=this.storage(s*i*a*4);return this.recordPass(t,"video_motion_scatter",[o,e,n,u],this.grid1D(s*i*a)),r.push(o,u),u}recVideoAddPe(t,r,e,n,s,i,a){let o=this.uniform([s,i,a]),u=this.storage(a*s*i*4);return this.recordPass(t,"video_add_pe",[o,e,n,u],this.grid1D(a*s*i)),r.push(o,u),u}recAttnTemporal(t,r,e,n,s,i,a,o,u){let c=this.uniform([i,a,o,u],{offset:16,value:1/Math.sqrt(u)}),l=this.storage(i*a*o*u*4);return this.recordPass(t,"attn_temporal",[c,e,n,s,l],this.grid1D(i*a*o)),r.push(c,l),l}recordingSession(){let t=this.device.createCommandEncoder(),r=[],e=n=>{if(n instanceof Float32Array){let s=this.uploadGpu(n);return r.push(s),s}return n};return{conv2d:(n,s,i,a,o,u,c,l,d,p,g)=>s&&s.nib?this.recConv2dDirectQ4(t,r,e(n),s,e(i),a,o,u,c,l,d,p,g):s&&s.codes?this.recConv2dDirectQ8(t,r,e(n),s,e(i),a,o,u,c,l,d,p,g):this.recConv2dDirect(t,r,e(n),e(s),e(i),a,o,u,c,l,d,p,g),groupNorm:(n,s,i,a,o,u,c)=>this.recGroupNorm(t,r,e(n),e(s),e(i),a,o,u,c),silu:(n,s)=>this.recUnary(t,r,"silu",e(n),s),quickGelu:(n,s)=>this.recUnary(t,r,"quick_gelu",e(n),s),gelu:(n,s)=>this.recUnary(t,r,"gelu",e(n),s),relu:(n,s)=>this.recUnary(t,r,"relu",e(n),s),add:(n,s,i)=>this.recBinary(t,r,"add",e(n),e(s),i),geglu:(n,s,i)=>this.recBinary(t,r,"geglu",e(n),e(s),i),matmulT:(n,s,i,a,o)=>this.recMM(t,r,e(n),s instanceof Float32Array?e(s):s,i,a,o,!1),addBias:(n,s,i,a)=>this.recAddBias(t,r,e(n),e(s),i,a),addChannelBias:(n,s,i,a)=>this.recAddChannelBias(t,r,e(n),e(s),i,a),attentionFull:(n,s,i,a,o,u,c,l)=>this.recAttentionFull(t,r,e(n),e(s),e(i),a,o,u,c,l),rope2d:(n,s,i,a,o,u)=>{let c=s instanceof Uint32Array?(()=>{let l=this.uploadGpuRaw(new Uint8Array(s.buffer,s.byteOffset,s.byteLength));return r.push(l),l})():s;return this.recRope2d(t,r,e(n),c,i,a,o,u)},attention:(n,s,i,a,o,u,c,l,d)=>this.recAttention(t,r,e(n),e(s),e(i),a,o,u,c,l,d),upsample:(n,s,i,a,o)=>this.recUpsample(t,r,e(n),s,i,a,o),attentionBias:(n,s,i,a,o,u,c)=>this.recAttentionBias(t,r,e(n),e(s),e(i),e(a),o,u,c),ropeLtx:(n,s,i,a,o)=>this.recRopeLtx(t,r,e(n),e(s),e(i),a,o),ltxModulate:(n,s,i,a,o,u)=>this.recLtxModulate(t,r,e(n),e(s),i,a,o,u),ltxGatedAdd:(n,s,i,a,o,u)=>this.recLtxGatedAdd(t,r,e(n),e(s),e(i),a,o,u),rmsnorm:(n,s,i,a,o)=>this.recRmsnorm(t,r,e(n),e(s),i,a,o),conv3d:(n,s,i,a,o,u,c,l)=>this.recConv3dQ8(t,r,e(n),s,e(i),a,o,u,c,l),ltxNormAct:(n,s,i,a,o,u,c=1e-8)=>this.recLtxNormAct(t,r,e(n),e(s),i,a,o,u,c),ltxD2s:(n,s,i,a,o,u,c)=>this.recLtxD2s(t,r,e(n),s?e(s):null,i,a,o,u,c),ltxUnpatchify:(n,s,i,a,o)=>this.recLtxUnpatchify(t,r,e(n),s,i,a,o),rifeAct:(n,s,i,a)=>this.recRifeAct(t,r,e(n),s,i,a),rifeResconv:(n,s,i,a,o)=>this.recRifeResconv(t,r,e(n),e(s),e(i),a,o),convTranspose2d:(n,s,i,a,o,u,c,l,d,p)=>this.recConvTranspose2d(t,r,e(n),e(s),e(i),a,o,u,c,l,d,p),pixelShuffle2:(n,s,i,a)=>this.recPixelShuffle2(t,r,e(n),s,i,a),resizeBilinear:(n,s,i,a,o,u)=>this.recResizeBilinear(t,r,e(n),s,i,a,o,u),warp:(n,s,i,a,o,u)=>this.recWarp(t,r,e(n),e(s),i,a,o,u),rifeBlend:(n,s,i,a,o)=>this.recRifeBlend(t,r,e(n),e(s),e(i),a,o),upscale2x:(n,s,i,a,o=.5)=>this.recUpscale2x(t,r,e(n),s,i,a,o),layernorm:(n,s,i,a,o,u)=>this.recLayernorm(t,r,e(n),e(s),e(i),a,o,u),concat:(n,s,i,a,o)=>this.recConcat(t,r,e(n),e(s),i,a,o),transpose:(n,s,i)=>this.recTranspose(t,r,e(n),s,i),gegluSplit:(n,s,i)=>this.recGegluSplit(t,r,e(n),s,i),videoGather:(n,s,i,a)=>this.recVideoGather(t,r,e(n),s,i,a),videoScatter:(n,s,i,a,o)=>this.recVideoScatter(t,r,e(n),e(s),i,a,o),videoAddPe:(n,s,i,a,o)=>this.recVideoAddPe(t,r,e(n),e(s),i,a,o),attnTemporal:(n,s,i,a,o,u,c)=>this.recAttnTemporal(t,r,e(n),e(s),e(i),a,o,u,c),alloc:n=>{let s=this.storage(n);return r.push(s),s},copy:(n,s,i,a,o)=>{t.copyBufferToBuffer(i,a,n,s,o)},finish:async(n,s)=>{this.device.queue.submit([t.finish()]);let i=await this.readBack(n,s*4);return this.release(r),i},finishKeep:n=>{this.device.queue.submit([t.finish()]);let s=r.indexOf(n);return s>=0&&r.splice(s,1),this.release(r),n},finishKeepMany:n=>{this.device.queue.submit([t.finish()]);for(let s of n){let i=r.indexOf(s);i>=0&&r.splice(i,1)}return this.release(r),n}}}async attentionFullDirect(t,r,e,n,s,i,a,o,u,c){let l=this.attnFlashOk;this.attnFlashOk=c;try{let d=this.device.createCommandEncoder(),p=[],g=this.uploadGpu(t),m=this.uploadGpu(r),b=this.uploadGpu(e),v=this.uniform([n,s,i,a,o,0],{offset:24,value:[1/Math.sqrt(a),u]}),U=this.storage(n*s*a*4),A=n*s;this.attnFlashOk&&a===64&&n>=64?this.recordPass(d,"attention_flash64",[v,g,m,b,U],[Math.ceil(n/64),s,1]):this.recordPass(d,"attention_full_wg",[v,g,m,b,U],[A,1,1]),p.push(v,U),this.device.queue.submit([d.finish()]);let F=await this.readBack(U,n*s*a*4);return this.release(p),this.releaseGpu([g,m,b]),F}finally{this.attnFlashOk=l}}readGpu(t,r){return this.readBack(t,r*4)}trimPool(t=64<<20){let r=[...this.bufferPool.keys()].sort((n,s)=>s-n),e=0;for(let n of this.bufferPool.values())for(let s of n)e+=this.poolSize.get(s)??0;for(let n of r){let s=this.bufferPool.get(n);for(;s.length&&e>t;){let i=s.pop();this.pooled.delete(i),this.poolSize.delete(i),i.destroy?.(),e-=n}}}releaseGpu(t){this.release(t)}waitGpu(){return this.device.queue.onSubmittedWorkDone()}async settleGpu(){this.device.queue.submit([]),await this.device.queue.onSubmittedWorkDone(),await new Promise(t=>setTimeout(t,0))}async benchMatmul(t,r,e,n,s,i={}){let{iters:a=10,shared:o=!0,shared2:u=!0,wF16:c=!1}=i,l=this.f16SharedOk,d=this.qSharedOk,p=this.qShared2Ok;this.f16SharedOk=o,this.qSharedOk=o,this.qShared2Ok=o&&u;let g=this.uploadGpu(t),m=[],b=this.device.createCommandEncoder();this.recMM(b,m,g,r,e,n,s,c),this.device.queue.submit([b.finish()]),await this.device.queue.onSubmittedWorkDone();let v=this.device.createCommandEncoder();for(let F=0;F<a;F++)this.recMM(v,m,g,r,e,n,s,c);let U=performance.now();this.device.queue.submit([v.finish()]),await this.device.queue.onSubmittedWorkDone();let A=(performance.now()-U)/a;return this.release(m),g.destroy?.(),this.f16SharedOk=l,this.qSharedOk=d,this.qShared2Ok=p,A}destroy(){try{this.profiler?.destroy()}catch{}this.profiler=null;try{this.device?.destroy?.()}catch{}this.bufferPool.clear(),this.uniformPool.clear()}f16ToF32Gpu(t,r){let e=this.uploadGpuRawF16(t),n=this.device.createBuffer({size:r*4,usage:ue.STORAGE_USAGE}),s=this.uniformOf(16);return this.device.queue.writeBuffer(s,0,new Uint32Array([r])),this.dispatch("f16_to_f32",[s,e,n],this.grid1D(Math.ceil(r/2))),e.destroy?.(),this.release([s]),n}quantizeQ8Gpu(t){let r=t instanceof Float32Array?t.length:t.n;if(r%32!==0)return this.uploadGpu(t);let e=t instanceof Float32Array?this.buf(t,ue.STORAGE_USAGE):this.f16ToF32Gpu(t.f16,r),n=this.f32ToQ8Gpu(e,r);return e.destroy?.(),n}async validateResidentOps(){let t=globalThis,r=y=>Float32Array.from({length:y},()=>(Math.random()*2-1)*.5),e=(y,k,w=.005)=>y.length===k.length&&y.every((x,B)=>Math.abs(x-k[B])<=w*(1+Math.abs(k[B]))),n=4,s=4,i=4,a=4,o=2,u=1e-5,c=a*s*i,l=r(n*s*i),d=r(a*n*9),p=r(a),g=r(a),m=r(a),b=await this.silu(await this.groupNorm(await this.conv2dDirect(l,d,p,n,s,i,a,3,3,1,1),g,m,a,s*i,o,u)),v=[],U=this.device.createCommandEncoder(),A=this.uploadGpu(l),F=this.uploadGpu(d),T=this.uploadGpu(p),K=this.uploadGpu(g),P=this.uploadGpu(m);v.push(A,F,T,K,P);let G=this.recConv2dDirect(U,v,A,F,T,n,s,i,a,3,3,1,1);G=this.recGroupNorm(U,v,G,K,P,a,s*i,o,u),G=this.recUnary(U,v,"silu",G,c);let _=this.device.createBuffer({size:c*4,usage:t.GPUBufferUsage.COPY_DST|t.GPUBufferUsage.MAP_READ});U.copyBufferToBuffer(G,0,_,0,c*4),this.device.queue.submit([U.finish()]),await _.mapAsync(t.GPUMapMode.READ);let h=new Float32Array(_.getMappedRange().slice(0));return _.unmap(),_.destroy(),this.release(v),e(h,b)?null:"resident_ops"}recMatmulQ4(t,r,e,n,s,i,a){let o=this.uniform([s,i,a]),u=this.storage(s*a*4);if(s===1&&this.gemvOk){let c=this.gemvGrid(a);this.recordPass(t,"matmul_t_q4_vec",[this.uniform([s,i,a,c.stride]),e,n.nib,n.sc,n.mn,u],c.grid)}else if(s<=8&&this.gemvMOk&&i%32===0){let c=this.gemv4Grid(a);this.recordPass(t,"matmul_t_q4_vecm",[this.uniform([s,i,a,c.stride]),e,n.nib,n.sc,n.mn,u],c.grid)}else s>=64&&this.qSharedOk&&this.qShared2Ok?this.recordPass(t,"matmul_t_q4_shared2",[o,e,n.nib,n.sc,n.mn,u],[Math.ceil(a/128),Math.ceil(s/64),1]):s>=32&&this.qSharedOk?this.recordPass(t,"matmul_t_q4_shared",[o,e,n.nib,n.sc,n.mn,u],[Math.ceil(a/64),Math.ceil(s/32),1]):s>=2?this.recordPass(t,"matmul_t_q4_tiled",[o,e,n.nib,n.sc,n.mn,u],[Math.ceil(Math.ceil(s/4)/8),Math.ceil(a/8),1]):this.recordPass(t,"matmul_t_q4",[o,e,n.nib,n.sc,n.mn,u],[Math.ceil(s/8),Math.ceil(a/8),1]);return r.push(o,u),u}recMatmulQ8(t,r,e,n,s,i,a){let o=this.uniform([s,i,a]),u=this.storage(s*a*4);if(s===1&&this.gemvOk){let c=this.gemvGrid(a);this.recordPass(t,"matmul_t_q8_vec",[this.uniform([s,i,a,c.stride]),e,n.codes,n.sc,u],c.grid)}else if(s===2&&this.gemvMOk&&i%32===0){let c=this.gemvGrid(a);this.recordPass(t,"matmul_t_q8_vec2",[this.uniform([s,i,a,c.stride]),e,n.codes,n.sc,u],c.grid)}else if(s<=8&&this.gemvMOk&&i%32===0){let c=this.gemv4Grid(a);this.recordPass(t,"matmul_t_q8_vecm",[this.uniform([s,i,a,c.stride]),e,n.codes,n.sc,u],c.grid)}else s>=64&&this.qSharedOk&&this.qShared2Ok?this.recordPass(t,"matmul_t_q8_shared2",[o,e,n.codes,n.sc,u],[Math.ceil(a/128),Math.ceil(s/64),1]):s>=32&&this.qSharedOk?this.recordPass(t,"matmul_t_q8_shared",[o,e,n.codes,n.sc,u],[Math.ceil(a/64),Math.ceil(s/32),1]):s>=2?this.recordPass(t,"matmul_t_q8_tiled",[o,e,n.codes,n.sc,u],[Math.ceil(Math.ceil(s/4)/8),Math.ceil(a/8),1]):this.recordPass(t,"matmul_t_q8",[o,e,n.codes,n.sc,u],[Math.ceil(s/8),Math.ceil(a/8),1]);return r.push(o,u),u}instrumentMemory(){let t=this.device,r=this.gpuMem;try{let e=t.createBuffer.bind(t);t.createBuffer=n=>{let s=e(n),i=Number(n?.size)||0;r.live+=i,r.buffers++,r.live>r.peak&&(r.peak=r.live);try{let a=s.destroy.bind(s),o=!1;s.destroy=()=>(o||(o=!0,r.live-=i,r.buffers--),a())}catch{}return s},r.instrumented=!0}catch{}}resetGpuMemPeak(){this.gpuMem.peak=this.gpuMem.live}async matmulHandle(t,r,e,n,s){let i=globalThis,a=this.storage(t.byteLength);this.device.queue.writeBuffer(a,0,t);let o=[],u=this.device.createCommandEncoder(),c=this.recMM(u,o,a,r,e,n,s,!1),l=this.device.createBuffer({size:e*s*4,usage:i.GPUBufferUsage.COPY_DST|i.GPUBufferUsage.MAP_READ});u.copyBufferToBuffer(c,0,l,0,e*s*4),this.device.queue.submit([u.finish()]),await l.mapAsync(i.GPUMapMode.READ);let d=new Float32Array(l.getMappedRange().slice(0));return l.unmap(),l.destroy(),this.release([...o,a]),d}async checkPq2Matrix(t,r,e,n){let s=Float32Array.from({length:e},()=>Math.random()*2-1),i=await this.matmulHandle(s,t,1,e,n),a=e/128*34,o=new Set([0,n-1,Math.min(n-1,65535),Math.min(n-1,65536)]);for(let l=0;l<44;l++)o.add(Math.floor(Math.random()*n));let u=new Map,c=0;for(let l of o){let d=We(r.subarray(l*a,(l+1)*a),e/128),p=0;for(let g=0;g<e;g++)p+=s[g]*d[g];u.set(l,p),c=Math.max(c,Math.abs(p))}for(let[l,d]of u)if(!(Math.abs(i[l]-d)<=.002*(c+1)))return`ligne ${l} : ${i[l]} au lieu de ${d}`;return null}uploadKq(t,r){let e=Math.ceil(r.byteLength/4)*4,n=this.device.createBuffer({size:e,usage:ue.STORAGE_USAGE});if(e===r.byteLength)this.device.queue.writeBuffer(n,0,r);else{let s=new Uint8Array(e);s.set(r),this.device.queue.writeBuffer(n,0,s)}return{kq:t,buf:n}}recMatmulKq(t,r,e,n,s,i,a){if(s===1){let b=this.gemvGrid(a),v=this.storage(a*4),U=this.uniform([1,i,a,b.stride]);return this.recordPass(t,n.kq==="Q4_K"?"matmul_t_q4k_vec":n.kq==="Q6_K"?"matmul_t_q6k_vec":"matmul_t_pq2_vec",[U,e,n.buf,v],b.grid),r.push(U,v),v}if(s===2&&n.kq==="Q4_K"&&this.gemvMOk){let b=this.gemvGrid(a),v=this.storage(2*a*4),U=this.uniform([2,i,a,b.stride]);return this.recordPass(t,"matmul_t_q4k_vec2",[U,e,n.buf,v],b.grid),r.push(U,v),v}if(s<=8&&n.kq==="Q4_K"&&this.gemvMOk){let b=this.gemv4Grid(a),v=this.storage(s*a*4),U=this.uniform([s,i,a,b.stride]);return this.recordPass(t,"matmul_t_q4k_vecm",[U,e,n.buf,v],b.grid),r.push(U,v),v}let o=i*a,u=o/ue.BLOCK_ELEMS[n.kq],c=o/32,{f32:l,codes:d,sc:p}=this.kqScratchFor(o,r),g=this.uniform([u]);this.recordPass(t,ue.DEQUANT_SHADER[n.kq],[g,n.buf,l],this.grid1D(u)),t.clearBuffer(p,0,Math.ceil(c/2)*4);let m=this.uniform([c]);return this.recordPass(t,"quantize_q8",[m,l,d,p],this.grid1D(c)),r.push(g,m),this.recMatmulQ8(t,r,e,{codes:d,sc:p},s,i,a)}kqScratchFor(t,r){if(this.kqScratch&&this.kqScratch.cap>=t)return this.kqScratch;this.kqScratch&&r.push(this.kqScratch.f32,this.kqScratch.codes,this.kqScratch.sc);let e=n=>this.device.createBuffer({size:n,usage:ue.STORAGE_USAGE});return this.kqScratch={f32:e(t*4),codes:e(t),sc:e(Math.ceil(t/64)*4),cap:t},this.kqScratch}gemv4Grid(t){return this.gemvGrid(Math.ceil(t/4))}gemvGrid(t){return t<=32768?{grid:[t,1,1],stride:32768}:{grid:[32768,Math.ceil(t/32768),1],stride:32768}}async matmulQ4Vec(t,r,e,n,s,i){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.gemvGrid(i),c=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([1,s,i,u.stride]));let l=this.device.createBuffer({size:i*4,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_vec",[c,this.buf(t,o),r,e,n,l],u.grid,l,i*4)}async matmulQ8Vec(t,r,e,n,s){let i=globalThis,a=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=this.gemvGrid(s),u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([1,n,s,o.stride]));let c=this.device.createBuffer({size:s*4,usage:a|i.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_vec",[u,this.buf(t,a),r,e,c],o.grid,c,s*4)}recMatmulQ3(t,r,e,n,s,i,a){let o=this.uniform([s,i,a]),u=this.storage(s*a*4);return this.recordPass(t,"matmul_t_q3",[o,e,n.lo,n.hi,n.sc,n.mn,u],[Math.ceil(s/8),Math.ceil(a/8),1]),r.push(o,u),u}recMM(t,r,e,n,s,i,a,o){return n&&n.kq?this.recMatmulKq(t,r,e,n,s,i,a):n&&n.q3?this.recMatmulQ3(t,r,e,n,s,i,a):n&&n.nib?this.recMatmulQ4(t,r,e,n,s,i,a):n&&n.codes?this.recMatmulQ8(t,r,e,n,s,i,a):this.recMatmulT(t,r,e,n,s,i,a,o)}recRmsnorm(t,r,e,n,s,i,a,o=!1){let u=this.uniform([s,i,0,o?1:0],{offset:8,value:a}),c=this.storage(s*i*4);if(this.rmsVecOk&&s<=65535){let l=this.hasSubgroups&&this.subgroupsOk?"rmsnorm_vec_subgroup":"rmsnorm_vec";this.recordPass(t,l,[u,e,n,c],[s,1,1])}else this.recordPass(t,"rmsnorm",[u,e,n,c],[Math.ceil(s/ge),1,1]);return r.push(u,c),c}recRope(t,r,e,n,s,i,a,o,u=!1){let c=this.uniform([n,s,i,a],{offset:16,value:o});this.device.queue.writeBuffer(c,20,new Uint32Array([u?1:0]));let l=this.storage(n*s*4);return this.recordPass(t,"rope",[c,e,l],[Math.ceil(n/ge),1,1]),r.push(c,l),l}recRopeMrope(t,r,e,n,s,i,a,o,u){let c=u[0],l=u[0]+u[1],d=this.uniform([s,i,a,c,l],{offset:20,value:o}),p=this.storage(s*i*4);return this.recordPass(t,"rope_mrope",[d,e,n,p],[Math.ceil(s/ge),1,1]),r.push(d,p),p}preparePositions(t,r){if(t.positions&&t.mropeSections){let e=this.storage(t.positions.byteLength);this.device.queue.writeBuffer(e,0,t.positions),r.push(e),t._posGpu=e}if(t.ropeFactors){let e=this.storage(t.ropeFactors.byteLength);this.device.queue.writeBuffer(e,0,t.ropeFactors),r.push(e),t._ffGpu=e}}recRope2d(t,r,e,n,s,i,a,o){let u=this.uniform([s,i,a,0],{offset:16,value:o}),c=this.storage(s*i*4);return this.recordPass(t,"rope_2d",[u,e,n,c],[Math.ceil(s/ge),1,1]),r.push(u,c),c}recRopeFactors(t,r,e,n,s,i,a,o,u,c=!1){let l=this.uniform([s,i,a,o],{offset:16,value:u});this.device.queue.writeBuffer(l,20,new Uint32Array([c?1:0]));let d=this.storage(s*i*4);return this.recordPass(t,"rope_factors",[l,e,n,d],[Math.ceil(s/ge),1,1]),r.push(l,d),d}recAttention(t,r,e,n,s,i,a,o,u,c,l,d,p=0,g=0){let m=this.attnUniform(i,a,o,u,c,l,d??1/Math.sqrt(u),p,g),b=this.storage(i*a*u*4);return this.attnDecodeOk&&i*a<256&&u<=128?this.recordPass(t,"attention_decode",[m,e,n,s,b],[i*a,1,1]):this.attnPrefillOk&&u<=128?this.recordPass(t,"attention_prefill",[m,e,n,s,b],[Math.ceil(i/4)*a,1,1]):this.attnWideOk&&u>128&&u<=512&&u%4===0&&i*a<=ue.MAX_WG_DIM?this.recordPass(t,"attention_wide",[m,e,n,s,b],[i*a,1,1]):this.recordPass(t,"attention",[m,e,n,s,b],[Math.ceil(i*a/ge),1,1]),r.push(m,b),b}recQuantizeKv(t,r,e,n,s,i,a,o,u){let c=this.uniform([i,a,o,u]);this.recordPass(t,"quantize_kv",[c,e,n,s],this.grid1D(i*a)),r.push(c)}recAttentionQ8(t,r,e,n,s,i,a,o,u,c,l,d,p,g,m=0,b=0){let v=this.attnUniform(o,u,c,l,d,p,g??1/Math.sqrt(l),m,b),U=this.storage(o*u*l*4);return this.attnDecodeOk&&o*u<256&&l<=128?this.recordPass(t,"attention_decode_q8kv",[v,e,n,s,i,a,U],[o*u,1,1]):this.attnPrefillOk&&l<=128?this.recordPass(t,"attention_prefill_q8kv",[v,e,n,s,i,a,U],[Math.ceil(o/4)*u,1,1]):this.recordPass(t,"attention_q8kv",[v,e,n,s,i,a,U],[Math.ceil(o*u/ge),1,1]),r.push(v,U),U}recAddBias(t,r,e,n,s,i){let a=this.uniform([s,i]),o=this.storage(s*i*4);return this.recordPass(t,"addbias",[a,e,n,o],this.grid1D(s*i)),r.push(a,o),o}recBinary(t,r,e,n,s,i){let a=this.storage(i*4);return this.recordPass(t,e,[n,s,a],this.grid1D(i)),r.push(a),a}snapOrDummy(t){return t||(this.dummySnap||(this.dummySnap=this.device.createBuffer({size:16,usage:ue.STORAGE_USAGE})),this.dummySnap)}recQwen35Conv(t,r,e,n,s,i,a,o,u=4294967295){let c=this.uniform([i,a,o?u:4294967295]),l=this.storage(i*a*4);return this.recordPass(t,"qwen35_conv_batch",[c,e,n,s,l,this.snapOrDummy(o)],this.grid1D(a)),r.push(c,l),l}recQwen35Gdn(t,r,e,n,s,i,a,o,u,c,l,d,p,g,m,b,v,U=4294967295){let A=this.uniformOf(48);this.device.queue.writeBuffer(A,0,new Uint32Array([u,c,l,d,p,g,m])),this.device.queue.writeBuffer(A,28,new Float32Array([b])),this.device.queue.writeBuffer(A,32,new Uint32Array([v?U:4294967295]));let F=this.storage(u*c*d*4);return this.recordPass(t,"qwen35_gdn_batch",[A,e,n,s,i,a,o,F,this.snapOrDummy(v)],[c,1,1]),r.push(A,F),F}recHadamard(t,r,e,n,s,i,a){if(s%1024!==0)throw new Error(`Hadamard : largeur ${s} non multiple de 1 024`);let o=this.uniform([n,s,a?.hd??1,a?.nk??1,a?.rep??1]),u=this.storage(n*s*4);return this.fwhtOk?this.recordPass(t,"hadamard_rows",[o,e,i,u],[s/1024,n,1]):this.recordPass(t,"hadamard_rows_naive",[o,e,i,u],this.grid1D(n*s)),r.push(o,u),u}recRopePartial(t,r,e,n,s,i,a,o,u){let c=this.uniform([n,s,i,a],{offset:16,value:o});this.device.queue.writeBuffer(c,20,new Uint32Array([u]));let l=this.storage(n*s*4);return this.recordPass(t,"rope_partial",[c,e,l],[Math.ceil(n/ge),1,1]),r.push(c,l),l}recRmsnormGrouped(t,r,e,n,s,i,a,o){let u=this.uniform([s,i,a],{offset:12,value:o}),c=this.storage(s*i*4);return this.recordPass(t,"rmsnorm_grouped",[u,e,n,c],[s*a,1,1]),r.push(u,c),c}recMoeRoute(t,r,e,n,s,i,a=1){if(i>16)throw new Error(`MoE : K = ${i} > 16 non g\xE9r\xE9 par moe_route`);let o=this.uniform([n,s,i],{offset:12,value:a}),u=this.storage(n*i*4),c=this.storage(n*i*4);return this.recordPass(t,"moe_route",[o,e,u,c],[Math.ceil(n/64),1,1]),r.push(o,u,c),{ids:u,w:c}}recMoeGemv(t,r,e,n,s,i,a,o,u){let c=this.gemvGrid(u),l=this.storage(i*u*4),d=this.uniform([a,o,u,c.stride]);return this.recordPass(t,n.kq==="Q4_K"?"moe_q4k_vec":"moe_q6k_vec",[d,e,n.buf,l,s],[c.grid[0],c.grid[1],i]),r.push(d,l),l}recMoeGroup(t,r,e,n,s){if(s>512)throw new Error(`MoE : E = ${s} > 512 non g\xE9r\xE9 par moe_group`);let i=this.uniform([n,s]),a=this.storage(n*4),o=this.storage((s+1)*4);return this.recordPass(t,"moe_group",[i,e,a,o],[1,1,1]),r.push(i,a,o),{perm:a,off:o}}recMoeGemm(t,r,e,n,s,i,a,o,u,c,l){let d=this.storage(i*l*4),p=this.uniform([i,c,l,u]);return this.recordPass(t,n.kq==="Q4_K"?"moe_q4k_grouped":"moe_q6k_grouped",[p,e,n.buf,d,s.perm,s.off],[Math.ceil(l/64),Math.ceil(o/32),a]),r.push(p,d),d}recMoeSum(t,r,e,n,s,i,a){let o=this.uniform([s,i,a]),u=this.storage(s*a*4);return this.recordPass(t,"moe_sum",[o,e,n,u],this.grid1D(s*a)),r.push(o,u),u}recHeadGate(t,r,e,n,s,i){let a=this.uniform([s,i]),o=this.storage(s*4);return this.recordPass(t,"head_gate",[a,e,n,o],this.grid1D(s)),r.push(a,o),o}recScale(t,r,e,n,s){let i=this.uniform([s],{offset:4,value:n}),a=this.storage(s*4);return this.recordPass(t,"scale",[i,e,a],this.grid1D(s)),r.push(i,a),a}recLfm2ShortConv(t,r,e,n,s,i,a){let o=this.uniform([i,a]),u=this.storage(i*4);return this.recordPass(t,"lfm2_shortconv",[o,e,s,n,u],this.grid1D(i)),r.push(o,u),u}recordLayerKV(t,r,e,n,s,i,a){let o=a.k,u=a.v,{seq:c,d:l,nHeads:d,nKvHeads:p,headDim:g,ffn:m,ropeTheta:b,eps:v}=n,U=p*g,A=i+c,F=s.matF16===!0,T=d*g,K=n.rmsGainOnePlus===!0,P=n.attnLogitSoftcap??0,G=n.act==="gelu"?"geglu":"swiglu",_=this.recRmsnorm(t,r,e,s.attnNorm,c,l,v,K),h=this.recMM(t,r,_,s.wq,c,l,T,F),y=this.recMM(t,r,_,s.wk,c,l,U,F),k=this.recMM(t,r,_,s.wv,c,l,U,F);s.bq&&(h=this.recAddBias(t,r,h,s.bq,c,T)),s.bk&&(y=this.recAddBias(t,r,y,s.bk,c,U)),s.bv&&(k=this.recAddBias(t,r,k,s.bv,c,U)),s.qNorm&&(h=this.recRmsnorm(t,r,h,s.qNorm,c*d,g,v,K)),s.kNorm&&(y=this.recRmsnorm(t,r,y,s.kNorm,c*p,g,v,K));let w=n._posGpu,x=n._ffGpu,B=n.ropeInterleaved===!0,q=(D,z,L)=>n.skipRope?D:w?this.recRopeMrope(t,r,D,w,z,g,L,b,n.mropeSections):x?this.recRopeFactors(t,r,D,x,z,g,L,i,b,B):this.recRope(t,r,D,z,g,L,i,b,B),M=q(h,c*d,d),O=q(y,c*p,p),C;if(a.kScale)this.recQuantizeKv(t,r,O,o,a.kScale,c,p,g,i),this.recQuantizeKv(t,r,k,u,a.vScale,c,p,g,i),C=this.recAttentionQ8(t,r,M,o,a.kScale,u,a.vScale,c,d,p,g,A,i,n.attnScale,P,n.window??0);else{let D=U*4;t.copyBufferToBuffer(O,0,o,i*D,c*D),t.copyBufferToBuffer(k,0,u,i*D,c*D),C=this.recAttention(t,r,M,o,u,c,d,p,g,A,i,n.attnScale,P,n.window??0)}let S=this.recMM(t,r,C,s.wo,c,T,l,F);s.postAttnNorm&&(S=this.recRmsnorm(t,r,S,s.postAttnNorm,c,l,v,K));let R=this.recBinary(t,r,"add",e,S,c*l),E=this.recRmsnorm(t,r,R,s.ffnNorm,c,l,v,K),W=this.recMM(t,r,E,s.wgate,c,l,m,F),N=this.recMM(t,r,E,s.wup,c,l,m,F),I=this.recBinary(t,r,G,W,N,c*m),$=this.recMM(t,r,I,s.wdown,c,m,l,F);return s.postFfnNorm&&($=this.recRmsnorm(t,r,$,s.postFfnNorm,c,l,v,K)),this.recBinary(t,r,"add",R,$,c*l)}setKvQuant(t){this.kvQuant!==t&&(this.kvQuant=t,this.resetKvGpu())}resetKvGpu(){for(let t of this.kvGpu.values())t.k.destroy?.(),t.v.destroy?.(),t.kScale?.destroy?.(),t.vScale?.destroy?.();this.kvGpu.clear(),this.kvSession="";for(let t of this.bufferPool.values())for(let r of t)r.destroy?.();this.bufferPool.clear()}clearKvCache(){this.resetKvGpu()}ensureKv(t,r,e,n){let s=this.kvGpu.get(t);if(s&&s.cap>=r)return s;let i=Math.max(r,(s?.cap??0)+1024,1024),a=this.kvQuant,o=this.storage(i*e*(a?1:4)),u=this.storage(i*e*(a?1:4)),c=a?this.storage(i*n*4):void 0,l=a?this.storage(i*n*4):void 0;if(s){let p=this.device.createCommandEncoder();p.copyBufferToBuffer(s.k,0,o,0,s.cap*e*(a?1:4)),p.copyBufferToBuffer(s.v,0,u,0,s.cap*e*(a?1:4)),a&&s.kScale&&(p.copyBufferToBuffer(s.kScale,0,c,0,s.cap*n*4),p.copyBufferToBuffer(s.vScale,0,l,0,s.cap*n*4)),this.device.queue.submit([p.finish()]),s.k.destroy?.(),s.v.destroy?.(),s.kScale?.destroy?.(),s.vScale?.destroy?.()}let d={k:o,v:u,cap:i,kScale:c,vScale:l};return this.kvGpu.set(t,d),d}async runDecodeGpu(t,r,e,n,s,i){let{seq:a,d:o,nKvHeads:u,headDim:c,eps:l}=r,d=u*c,p=n+a;(i!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${i}" inconnue avec pastLen=${n} : cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=i);for(let F=0;F<e.length;F++)this.ensureKv(F,p,d,u);let g=[];this.preparePositions(r,g);let m=this.device.createCommandEncoder(),b=this.storage(t.byteLength);this.device.queue.writeBuffer(b,0,t),g.push(b);for(let F=0;F<e.length;F++){let T=this.kvGpu.get(F);b=this.recordLayerKV(m,g,b,Qt(r,a,F,this.swaOk),e[F],n,T)}let v=this.recRmsnorm(m,g,b,s,a,o,l,r.rmsGainOnePlus===!0),U=this.storage(o*4);m.copyBufferToBuffer(v,(a-1)*o*4,U,0,o*4),this.device.queue.submit([m.finish()]);let A=await this.readBack(U,o*4);return g.push(U),this.release(g),A}async decodeLogitsQ8(t,r,e,n,s,i,a,o){let u=globalThis,{seq:c,d:l,nKvHeads:d,headDim:p,eps:g}=r,m=d*p,b=n+c;(i!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${i}" inconnue avec pastLen=${n} : cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=i);for(let _=0;_<e.length;_++)this.ensureKv(_,b,m,d);let v=[];this.preparePositions(r,v);let U=this.device.createCommandEncoder(),A=this.storage(t.byteLength);this.device.queue.writeBuffer(A,0,t),v.push(A);for(let _=0;_<e.length;_++){let h=this.kvGpu.get(_);A=this.recordLayerKV(U,v,A,Qt(r,c,_,this.swaOk),e[_],n,h)}let F=this.recRmsnorm(U,v,A,s,c,l,g,r.rmsGainOnePlus===!0),T=this.storage(l*4);U.copyBufferToBuffer(F,(c-1)*l*4,T,0,l*4),v.push(T);let K=this.storage(o*4);v.push(K);for(let _ of a){let h=this.recMM(U,v,T,_.w,1,l,_.rows,!1);U.copyBufferToBuffer(h,0,K,_.r0*4,_.rows*4)}let P=this.device.createBuffer({size:o*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});U.copyBufferToBuffer(K,0,P,0,o*4),this.device.queue.submit([U.finish()]),await P.mapAsync(u.GPUMapMode.READ);let G=new Float32Array(P.getMappedRange().slice(0));return P.unmap(),P.destroy(),this.release(v),G}async decodeTopKQ8(t,r,e,n,s,i,a,o,u,c,l,d=64){let p=globalThis,{seq:g,d:m,nKvHeads:b,headDim:v,eps:U}=r,A=b*v,F=n+g;(i!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${i}" inconnue avec pastLen=${n} : cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=i);for(let q=0;q<e.length;q++)this.ensureKv(q,F,A,b);let T=ue.timingOn?(q,M)=>console.info(`[timing:gpu] ${q} ${(performance.now()-M).toFixed(0)} ms`):null,K=performance.now(),P=[];this.preparePositions(r,P);let G=this.device.createCommandEncoder(),_=this.storage(t.byteLength);this.device.queue.writeBuffer(_,0,t),P.push(_);for(let q=0;q<e.length;q++){let M=this.kvGpu.get(q);_=this.recordLayerKV(G,P,_,Qt(r,g,q,this.swaOk),e[q],n,M)}let h=this.recRmsnorm(G,P,_,s,g,m,U,r.rmsGainOnePlus===!0),y=this.storage(m*4);G.copyBufferToBuffer(h,(g-1)*m*4,y,0,m*4),P.push(y);let k=this.storage(o*4);P.push(k);for(let q of a){let M=this.recMM(G,P,y,q.w,1,m,q.rows,!1);G.copyBufferToBuffer(M,0,k,q.r0*4,q.rows*4)}if(l&&l>0){let q=this.uniform([o],{offset:4,value:l});this.recordPass(G,"softcap_logits",[q,k],this.grid1D(o)),P.push(q)}if(c&&c!==1&&u.length){let q=Uint32Array.from(u),M=this.bufU32(q,p.GPUBufferUsage.STORAGE|p.GPUBufferUsage.COPY_DST),O=this.uniform([q.length],{offset:4,value:c});this.recordPass(G,"penalize_logits",[O,M,k],this.grid1D(q.length)),P.push(O,M)}let w=this.storage(d*2*4);P.push(w);{let q=this.uniform([o,d]);this.recordPass(G,this.topKParOk?"top_k_par":"top_k",[q,k,w],[1,1,1]),P.push(q)}let x=this.device.createBuffer({size:d*2*4,usage:p.GPUBufferUsage.COPY_DST|p.GPUBufferUsage.MAP_READ});G.copyBufferToBuffer(w,0,x,0,d*2*4),T?.("enregistrement des passes (compilation des pipelines incluse)",K),K=performance.now(),this.device.queue.submit([G.finish()]),await x.mapAsync(p.GPUMapMode.READ),T?.("execution GPU (submit + readback)",K);let B=new Uint32Array(x.getMappedRange().slice(0));return x.unmap(),x.destroy(),this.release(P),{ids:B.slice(0,d),vals:new Float32Array(B.buffer,d*4,d)}}useKvContext(t){t!==this.kvCtxId&&(this.kvStore.set(this.kvCtxId,this.kvGpu),this.kvGpu=this.kvStore.get(t)??new Map,this.kvStore.delete(t),this.kvCtxId=t,this.kvSession=t)}dropKvContexts(){this.useKvContext("");for(let t of this.kvStore.values())for(let r of t.values())r.k.destroy?.(),r.v.destroy?.(),r.kScale?.destroy?.(),r.vScale?.destroy?.();this.kvStore.clear()}kvMapFor(t){if(t===this.kvCtxId)return this.kvGpu;let r=this.kvStore.get(t);return r||(r=new Map,this.kvStore.set(t,r)),r}ensureKvIn(t,r,e,n){let s=t.get(r);if(s&&s.cap>=e)return s;let i=Math.max(e,(s?.cap??0)+1024,1024),a=this.storage(i*n*4),o=this.storage(i*n*4);if(s){let c=this.device.createCommandEncoder();c.copyBufferToBuffer(s.k,0,a,0,s.cap*n*4),c.copyBufferToBuffer(s.v,0,o,0,s.cap*n*4),this.device.queue.submit([c.finish()]),s.k.destroy?.(),s.v.destroy?.()}let u={k:a,v:o,cap:i};return t.set(r,u),u}recordLayerBatch(t,r,e,n,s,i,a){let o=a.length,{d:u,nHeads:c,nKvHeads:l,headDim:d,ffn:p,ropeTheta:g,eps:m}=n,b=l*d,v=c*d,U=s.matF16===!0,A=n.rmsGainOnePlus===!0,F=n.attnLogitSoftcap??0,T=n.act==="gelu"?"geglu":"swiglu",K=this.recRmsnorm(t,r,e,s.attnNorm,o,u,m,A),P=this.recMM(t,r,K,s.wq,o,u,v,U),G=this.recMM(t,r,K,s.wk,o,u,b,U),_=this.recMM(t,r,K,s.wv,o,u,b,U);s.bq&&(P=this.recAddBias(t,r,P,s.bq,o,v)),s.bk&&(G=this.recAddBias(t,r,G,s.bk,o,b)),s.bv&&(_=this.recAddBias(t,r,_,s.bv,o,b)),s.qNorm&&(P=this.recRmsnorm(t,r,P,s.qNorm,o*c,d,m,A)),s.kNorm&&(G=this.recRmsnorm(t,r,G,s.kNorm,o*l,d,m,A));let h=n._ffGpu,y=n.ropeInterleaved===!0,k=(C,S,R)=>n.skipRope?C:h?this.recRopeFactors(t,r,C,h,S,d,S,R,g,y):this.recRope(t,r,C,S,d,S,R,g,y),w=this.storage(o*v*4);r.push(w);for(let C=0;C<o;C++){let S=a[C].pastLen,R=this.ensureKvIn(a[C].kv,i,S+1,b),E=this.storage(v*4),W=this.storage(b*4);r.push(E,W),t.copyBufferToBuffer(P,C*v*4,E,0,v*4),t.copyBufferToBuffer(G,C*b*4,W,0,b*4);let N=k(E,c,S);t.copyBufferToBuffer(k(W,l,S),0,R.k,S*b*4,b*4),t.copyBufferToBuffer(_,C*b*4,R.v,S*b*4,b*4);let I=this.recAttention(t,r,N,R.k,R.v,1,c,l,d,S+1,S,n.attnScale,F,n.window??0);t.copyBufferToBuffer(I,0,w,C*v*4,v*4)}let x=this.recMM(t,r,w,s.wo,o,v,u,U);s.postAttnNorm&&(x=this.recRmsnorm(t,r,x,s.postAttnNorm,o,u,m,A));let B=this.recBinary(t,r,"add",e,x,o*u),q=this.recRmsnorm(t,r,B,s.ffnNorm,o,u,m,A),M=this.recBinary(t,r,T,this.recMM(t,r,q,s.wgate,o,u,p,U),this.recMM(t,r,q,s.wup,o,u,p,U),o*p),O=this.recMM(t,r,M,s.wdown,o,p,u,U);return s.postFfnNorm&&(O=this.recRmsnorm(t,r,O,s.postFfnNorm,o,u,m,A)),this.recBinary(t,r,"add",B,O,o*u)}async decodeTopKBatch(t,r,e,n,s,i,a,o,u,c,l,d=64){let p=globalThis,g=n.length,{d:m,eps:b}=r;if(r.mropeSections)throw new Error("decodeTopKBatch : M-RoPE non g\xE9r\xE9 (vision)");let v=n.map((h,y)=>({kv:this.kvMapFor(h),pastLen:s[y]})),U=[];this.preparePositions(r,U);let A=this.device.createCommandEncoder(),F=this.storage(t.byteLength);U.push(F),this.device.queue.writeBuffer(F,0,t);for(let h=0;h<e.length;h++)F=this.recordLayerBatch(A,U,F,Qt(r,g,h,this.swaOk),e[h],h,v);let T=this.recRmsnorm(A,U,F,i,g,m,b,r.rmsGainOnePlus===!0),K=this.storage(g*o*4);U.push(K);for(let h of a){let y=this.recMM(A,U,T,h.w,g,m,h.rows,!1);for(let k=0;k<g;k++)A.copyBufferToBuffer(y,k*h.rows*4,K,(k*o+h.r0)*4,h.rows*4)}let P=[];for(let h=0;h<g;h++){let y=this.storage(o*4);if(U.push(y),A.copyBufferToBuffer(K,h*o*4,y,0,o*4),l&&l>0){let x=this.uniform([o],{offset:4,value:l});this.recordPass(A,"softcap_logits",[x,y],this.grid1D(o)),U.push(x)}if(c&&c!==1&&u[h]?.length){let x=Uint32Array.from(u[h]),B=this.bufU32(x,p.GPUBufferUsage.STORAGE|p.GPUBufferUsage.COPY_DST),q=this.uniform([x.length],{offset:4,value:c});this.recordPass(A,"penalize_logits",[q,B,y],this.grid1D(x.length)),U.push(q,B)}let k=this.storage(d*8);U.push(k);let w=this.uniform([o,d]);U.push(w),this.recordPass(A,this.topKParOk?"top_k_par":"top_k",[w,y,k],[1,1,1]),P.push(k)}let G=this.device.createBuffer({size:g*d*8,usage:p.GPUBufferUsage.COPY_DST|p.GPUBufferUsage.MAP_READ});P.forEach((h,y)=>A.copyBufferToBuffer(h,0,G,y*d*8,d*8)),this.device.queue.submit([A.finish()]),await G.mapAsync(p.GPUMapMode.READ);let _=new Uint32Array(G.getMappedRange().slice(0));return G.unmap(),G.destroy(),this.release(U),P.map((h,y)=>({ids:_.slice(y*2*d,y*2*d+d),vals:new Float32Array(_.buffer,(y*2*d+d)*4,d)}))}resetLfm2State(){for(let t of this.lfm2KvGpu.values())t.k.destroy?.(),t.v.destroy?.();for(let t of this.lfm2ConvGpu.values())t.destroy?.();this.lfm2KvGpu.clear(),this.lfm2ConvGpu.clear(),this.lfm2Session="";for(let t of this.bufferPool.values())for(let r of t)r.destroy?.();this.bufferPool.clear()}clearLfm2State(){this.resetLfm2State()}ensureLfm2Kv(t,r,e){let n=this.lfm2KvGpu.get(t);if(n&&n.cap>=r)return n;let s=Math.max(r,(n?.cap??0)+1024,1024),i=this.storage(s*e*4),a=this.storage(s*e*4);if(n){let u=this.device.createCommandEncoder();u.copyBufferToBuffer(n.k,0,i,0,n.cap*e*4),u.copyBufferToBuffer(n.v,0,a,0,n.cap*e*4),this.device.queue.submit([u.finish()]),n.k.destroy?.(),n.v.destroy?.()}let o={k:i,v:a,cap:s};return this.lfm2KvGpu.set(t,o),o}ensureLfm2Conv(t,r){let e=this.lfm2ConvGpu.get(t);return e||(e=this.storage(r*4),this.device.queue.writeBuffer(e,0,new Float32Array(r)),this.lfm2ConvGpu.set(t,e)),e}recLfm2ShortConvBatch(t,r,e,n,s,i,a,o){let u=this.uniform([i,a,o]),c=this.storage(o*i*4);this.recordPass(t,"lfm2_shortconv_batch",[u,e,s,n,c],this.grid1D(o*i));let l=this.uniform([i,a,o]);return this.recordPass(t,"lfm2_shortconv_state",[l,e,n],this.grid1D((a-1)*i)),r.push(u,l,c),c}recordLfm2(t,r,e,n,s,i,a,o){let{D:u,nHeads:c,nKvHeads:l,headDim:d,ffn:p,eps:g,theta:m,lc:b}=s,v=l*d,U=c*d,A=v*4;for(let T=0;T<i.length;T++)i[T].conv?this.ensureLfm2Conv(T,(b-1)*u):this.ensureLfm2Kv(T,o+n,v);if(n>=b-1&&this.lfm2BatchOk){let T=this.storage(n*u*4);this.device.queue.writeBuffer(T,0,e),r.push(T);for(let P=0;P<i.length;P++){let G=i[P],_=this.recRmsnorm(t,r,T,G.attnNorm,n,u,g),h;if(G.conv){let q=this.recMM(t,r,_,G.inProj,n,u,3*u,!1),M=this.recLfm2ShortConvBatch(t,r,q,this.lfm2ConvGpu.get(P),G.convW,u,b,n);h=this.recMM(t,r,M,G.outProj,n,u,u,!1)}else{let q=this.recMM(t,r,_,G.wq,n,u,U,!1),M=this.recMM(t,r,_,G.wk,n,u,v,!1),O=this.recMM(t,r,_,G.wv,n,u,v,!1);q=this.recRmsnorm(t,r,q,G.qNorm,n*c,d,g),M=this.recRmsnorm(t,r,M,G.kNorm,n*l,d,g),q=this.recRope(t,r,q,n*c,d,c,o,m),M=this.recRope(t,r,M,n*l,d,l,o,m);let C=this.lfm2KvGpu.get(P);t.copyBufferToBuffer(M,0,C.k,o*A,n*A),t.copyBufferToBuffer(O,0,C.v,o*A,n*A);let S=this.recAttention(t,r,q,C.k,C.v,n,c,l,d,o+n,o);h=this.recMM(t,r,S,G.wo,n,U,u,!1)}T=this.recBinary(t,r,"add",T,h,n*u);let y=this.recRmsnorm(t,r,T,G.ffnNorm,n,u,g),k=this.recMM(t,r,y,G.wgate,n,u,p,!1),w=this.recMM(t,r,y,G.wup,n,u,p,!1),x=this.recBinary(t,r,"swiglu",k,w,n*p),B=this.recMM(t,r,x,G.wdown,n,p,u,!1);T=this.recBinary(t,r,"add",T,B,n*u)}let K=this.storage(u*4);return r.push(K),t.copyBufferToBuffer(T,(n-1)*u*4,K,0,u*4),this.recRmsnorm(t,r,K,a,1,u,g)}let F=null;for(let T=0;T<n;T++){let K=o+T,P=this.storage(u*4);this.device.queue.writeBuffer(P,0,e.subarray(T*u,(T+1)*u)),r.push(P);for(let G=0;G<i.length;G++){let _=i[G],h=this.recRmsnorm(t,r,P,_.attnNorm,1,u,g),y;if(_.conv){let M=this.recMM(t,r,h,_.inProj,1,u,3*u,!1),O=this.recLfm2ShortConv(t,r,M,this.lfm2ConvGpu.get(G),_.convW,u,b);y=this.recMM(t,r,O,_.outProj,1,u,u,!1)}else{let M=this.recMM(t,r,h,_.wq,1,u,U,!1),O=this.recMM(t,r,h,_.wk,1,u,v,!1),C=this.recMM(t,r,h,_.wv,1,u,v,!1);M=this.recRmsnorm(t,r,M,_.qNorm,c,d,g),O=this.recRmsnorm(t,r,O,_.kNorm,l,d,g),M=this.recRope(t,r,M,c,d,c,K,m),O=this.recRope(t,r,O,l,d,l,K,m);let S=this.lfm2KvGpu.get(G);t.copyBufferToBuffer(O,0,S.k,K*A,A),t.copyBufferToBuffer(C,0,S.v,K*A,A);let R=this.recAttention(t,r,M,S.k,S.v,1,c,l,d,K+1,K);y=this.recMM(t,r,R,_.wo,1,U,u,!1)}P=this.recBinary(t,r,"add",P,y,u);let k=this.recRmsnorm(t,r,P,_.ffnNorm,1,u,g),w=this.recMM(t,r,k,_.wgate,1,u,p,!1),x=this.recMM(t,r,k,_.wup,1,u,p,!1),B=this.recBinary(t,r,"swiglu",w,x,p),q=this.recMM(t,r,B,_.wdown,1,p,u,!1);P=this.recBinary(t,r,"add",P,q,u)}T===n-1&&(F=this.recRmsnorm(t,r,P,a,1,u,g))}return F}lfm2SessionReset(t,r){(t!==this.lfm2Session||r===0)&&(r>0&&console.error(`[lfm2] session "${t}" inconnue avec pastLen=${r} : \xE9tat perdu, sortie invalide. Repartir de pastLen 0.`),this.resetLfm2State(),this.lfm2Session=t)}async lfm2PrefillGpu(t,r,e,n,s,i,a){this.lfm2SessionReset(a,i);let o=[],u=this.device.createCommandEncoder();this.recordLfm2(u,o,t,r,e,n,s,i),this.device.queue.submit([u.finish()]),await this.device.queue.onSubmittedWorkDone(),this.release(o)}async lfm2LogitsGpu(t,r,e,n,s,i,a,o){let u=globalThis;this.lfm2SessionReset(o,a);let c=[],l=this.device.createCommandEncoder(),d=this.recordLfm2(l,c,t,r,e,n,i,a),p=this.recMM(l,c,d,s,1,e.D,e.vocab,!1),g=this.device.createBuffer({size:e.vocab*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});l.copyBufferToBuffer(p,0,g,0,e.vocab*4),this.device.queue.submit([l.finish()]),await g.mapAsync(u.GPUMapMode.READ);let m=new Float32Array(g.getMappedRange().slice(0));return g.unmap(),g.destroy(),this.release(c),m}async lfm2TopKGpu(t,r,e,n,s,i,a,o,u,c,l=64){let d=globalThis;this.lfm2SessionReset(o,a);let p=[],g=this.device.createCommandEncoder(),m=this.recordLfm2(g,p,t,r,e,n,i,a),b=this.recMM(g,p,m,s,1,e.D,e.vocab,!1);if(c&&c!==1&&u.length){let F=Uint32Array.from(u),T=this.bufU32(F,d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST),K=this.uniform([F.length],{offset:4,value:c});this.recordPass(g,"penalize_logits",[K,T,b],this.grid1D(F.length)),p.push(K,T)}let v=this.storage(l*2*4);p.push(v);{let F=this.uniform([e.vocab,l]);this.recordPass(g,this.topKParOk?"top_k_par":"top_k",[F,b,v],[1,1,1]),p.push(F)}let U=this.device.createBuffer({size:l*2*4,usage:d.GPUBufferUsage.COPY_DST|d.GPUBufferUsage.MAP_READ});g.copyBufferToBuffer(v,0,U,0,l*2*4),this.device.queue.submit([g.finish()]),await U.mapAsync(d.GPUMapMode.READ);let A=new Uint32Array(U.getMappedRange().slice(0));return U.unmap(),U.destroy(),this.release(p),{ids:A.slice(0,l),vals:new Float32Array(A.buffer,l*4,l)}}resetRwkvState(){for(let t of this.rwkvStateGpu.values())t.S.destroy?.(),t.tm.destroy?.(),t.cm.destroy?.();this.rwkvStateGpu.clear(),this.rwkvVFirst?.destroy?.(),this.rwkvVFirst=null,this.rwkvSession="";for(let t of this.bufferPool.values())for(let r of t)r.destroy?.();this.bufferPool.clear()}clearRwkvState(){this.resetRwkvState()}ensureRwkvState(t,r,e,n){let s=this.rwkvStateGpu.get(t);if(!s){let i=this.storage(e*n*n*4),a=this.storage(r*4),o=this.storage(r*4);this.device.queue.writeBuffer(i,0,new Float32Array(e*n*n)),this.device.queue.writeBuffer(a,0,new Float32Array(r)),this.device.queue.writeBuffer(o,0,new Float32Array(r)),s={S:i,tm:a,cm:o},this.rwkvStateGpu.set(t,s)}return s}rwkvSessionReset(t,r){(t!==this.rwkvSession||r===0)&&(r>0&&console.error(`[rwkv] session "${t}" inconnue avec pastLen=${r} : \xE9tat perdu, sortie invalide. Repartir de pastLen 0.`),this.resetRwkvState(),this.rwkvSession=t)}recRwkvToken(t,r,e,n,s,i){let{D:a,H:o,NH:u}=n,c=1e-5,l=64e-5;for(let d=0;d<s.length;d++){let p=s[d],g=this.rwkvStateGpu.get(d),m=this.recLayernorm(t,r,e,p.attnNormW,p.attnNormB,1,a,c),b=this.storage(6*a*4);{let L=this.uniform([a]);this.recordPass(t,"rwkv_token_shift",[L,m,g.tm,p.lerpFused,b],this.grid1D(6*a)),r.push(L,b)}t.copyBufferToBuffer(m,0,g.tm,0,a*4);let v=L=>{let j=this.storage(a*4);return t.copyBufferToBuffer(b,L*a*4,j,0,a*4),r.push(j),j},U=v(0),A=v(1),F=v(2),T=v(3),K=v(4),P=v(5),G=this.recMM(t,r,U,p.R,1,a,a,!1),_=this.recMM(t,r,F,p.K,1,a,a,!1),h=this.recMM(t,r,T,p.V,1,a,a,!1),y=this.recUnary(t,r,"tanh_act",this.recMM(t,r,A,p.w1,1,a,p.rw,!1),p.rw),k=this.recMM(t,r,y,p.w2,1,p.rw,a,!1),w=this.storage(a*4);this.recordPass(t,"rwkv_decay",[p.w0,k,w],this.grid1D(a)),r.push(w);let x=this.recMM(t,r,this.recMM(t,r,K,p.a1,1,a,p.ra,!1),p.a2,1,p.ra,a,!1),B=this.storage(a*4);this.recordPass(t,"rwkv_bias_sigmoid",[p.a0,x,B],this.grid1D(a)),r.push(B);let q=this.recUnary(t,r,"sigmoid",this.recMM(t,r,P,p.g1,1,a,p.rg,!1),p.rg),M=this.recMM(t,r,q,p.g2,1,p.rg,a,!1);if(d===0)t.copyBufferToBuffer(h,0,i,0,a*4);else{let L=this.recMM(t,r,this.recMM(t,r,T,p.v1,1,a,p.rv,!1),p.v2,1,p.rv,a,!1);this.recordPass(t,"rwkv_vresid",[h,i,p.v0,L],this.grid1D(a))}let O=this.storage(a*4),C=this.storage(a*4),S=this.storage(a*4);{let L=this.uniform([u,o]);this.recordPass(t,"rwkv_kprep",[L,_,B,p.kk,p.ka,O,C,S],this.grid1D(u)),r.push(L,O,C,S)}let R=this.storage(a*4);{let L=this.uniform([u,o]);this.recordPass(t,"rwkv_wkv7",[L,G,w,O,h,C,S,g.S,R],this.grid1D(u*o)),r.push(L,R)}let E=this.storage(a*4);{let L=this.uniform([u,o],{offset:8,value:l});this.recordPass(t,"rwkv_out_gn",[L,R,G,O,p.rk,h,p.lnWB,E],this.grid1D(u)),r.push(L,E)}let W=this.recBinary(t,r,"mul",E,M,a),N=this.recMM(t,r,W,p.O,1,a,a,!1);e=this.recBinary(t,r,"add",e,N,a);let I=this.recLayernorm(t,r,e,p.attnNorm2W,p.attnNorm2B,1,a,c),$=this.storage(a*4);this.recordPass(t,"rwkv_lerp",[I,g.cm,p.lerpK,$],this.grid1D(a)),r.push($),t.copyBufferToBuffer(I,0,g.cm,0,a*4);let D=this.recUnary(t,r,"sqrelu",this.recMM(t,r,$,p.cmK,1,a,p.ffn,!1),p.ffn),z=this.recMM(t,r,D,p.cmV,1,p.ffn,a,!1);e=this.recBinary(t,r,"add",e,z,a)}return e}recordRwkv(t,r,e,n,s,i,a){let{D:o,H:u,NH:c}=s;for(let d=0;d<i.length;d++)this.ensureRwkvState(d,o,c,u);this.rwkvVFirst||(this.rwkvVFirst=this.storage(o*4));let l=null;for(let d=0;d<n;d++){let p=this.storage(o*4);this.device.queue.writeBuffer(p,0,e.subarray(d*o,(d+1)*o)),r.push(p);let g=this.recLayernorm(t,r,p,a.tokW,a.tokB,1,o,1e-5),m=this.recRwkvToken(t,r,g,s,i,this.rwkvVFirst);d===n-1&&(l=this.recLayernorm(t,r,m,a.outW,a.outB,1,o,1e-5))}return l}async rwkvPrefillGpu(t,r,e,n,s,i,a){this.rwkvSessionReset(a,i);let o=[],u=this.device.createCommandEncoder();this.recordRwkv(u,o,t,r,e,n,s),this.device.queue.submit([u.finish()]),await this.device.queue.onSubmittedWorkDone(),this.release(o)}async rwkvLogitsGpu(t,r,e,n,s,i,a,o){let u=globalThis;this.rwkvSessionReset(o,a);let c=[],l=this.device.createCommandEncoder(),d=this.recordRwkv(l,c,t,r,e,n,i),p=this.recMM(l,c,d,s,1,e.D,e.vocab,!1),g=this.device.createBuffer({size:e.vocab*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});l.copyBufferToBuffer(p,0,g,0,e.vocab*4),this.device.queue.submit([l.finish()]),await g.mapAsync(u.GPUMapMode.READ);let m=new Float32Array(g.getMappedRange().slice(0));return g.unmap(),g.destroy(),this.release(c),m}async rwkvTopKGpu(t,r,e,n,s,i,a,o,u,c,l=64){let d=globalThis;this.rwkvSessionReset(o,a);let p=[],g=this.device.createCommandEncoder(),m=this.recordRwkv(g,p,t,r,e,n,i),b=this.recMM(g,p,m,s,1,e.D,e.vocab,!1);if(c&&c!==1&&u.length){let F=Uint32Array.from(u),T=this.bufU32(F,d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST),K=this.uniform([F.length],{offset:4,value:c});this.recordPass(g,"penalize_logits",[K,T,b],this.grid1D(F.length)),p.push(K,T)}let v=this.storage(l*2*4);p.push(v);{let F=this.uniform([e.vocab,l]);this.recordPass(g,this.topKParOk?"top_k_par":"top_k",[F,b,v],[1,1,1]),p.push(F)}let U=this.device.createBuffer({size:l*2*4,usage:d.GPUBufferUsage.COPY_DST|d.GPUBufferUsage.MAP_READ});g.copyBufferToBuffer(v,0,U,0,l*2*4),this.device.queue.submit([g.finish()]),await U.mapAsync(d.GPUMapMode.READ);let A=new Uint32Array(U.getMappedRange().slice(0));return U.unmap(),U.destroy(),this.release(p),{ids:A.slice(0,l),vals:new Float32Array(A.buffer,l*4,l)}}async argmaxProjection(t,r,e,n,s=!1){let i=globalThis,a=[],o=this.device.createCommandEncoder(),u=this.storage(t.byteLength);this.device.queue.writeBuffer(u,0,t),a.push(u);let c=this.storage(n*4);a.push(c);for(let m of r){let b=this.recMatmulT(o,a,u,m.buf,1,e,m.rows,s);o.copyBufferToBuffer(b,0,c,m.r0*4,m.rows*4)}let l=this.storage(4),d=this.uniform([n]);a.push(l,d),this.recordPass(o,"argmax",[d,c,l],[1,1,1]);let p=this.device.createBuffer({size:4,usage:i.GPUBufferUsage.COPY_DST|i.GPUBufferUsage.MAP_READ});o.copyBufferToBuffer(l,0,p,0,4),this.device.queue.submit([o.finish()]),await p.mapAsync(i.GPUMapMode.READ);let g=new Uint32Array(p.getMappedRange().slice(0))[0];return p.unmap(),p.destroy(),this.release(a),g}async projectLogits(t,r,e,n,s=!1){let i=globalThis,a=[],o=this.device.createCommandEncoder(),u=this.storage(t.byteLength);this.device.queue.writeBuffer(u,0,t),a.push(u);let c=this.storage(n*4);a.push(c);for(let p of r){let g=this.recMatmulT(o,a,u,p.buf,1,e,p.rows,s);o.copyBufferToBuffer(g,0,c,p.r0*4,p.rows*4)}let l=this.device.createBuffer({size:n*4,usage:i.GPUBufferUsage.COPY_DST|i.GPUBufferUsage.MAP_READ});o.copyBufferToBuffer(c,0,l,0,n*4),this.device.queue.submit([o.finish()]),await l.mapAsync(i.GPUMapMode.READ);let d=new Float32Array(l.getMappedRange().slice(0));return l.unmap(),l.destroy(),this.release(a),d}async selfValidate(){this.validationFailure=null;let t=P=>(this.validationFailure=P,console.error("[selfValidate] FAILED at:",P,"(hasF16="+this.hasF16+")"),!1),r=(P,G)=>P.length===G.length&&P.every((_,h)=>Math.abs(_-G[h])<.001),e=P=>Float32Array.from({length:P},()=>Math.random()*2-1),n=3,s=4,i=5,a=e(n*s),o=e(s*i),u=new Float32Array(n*i);for(let P=0;P<n;P++)for(let G=0;G<i;G++){let _=0;for(let h=0;h<s;h++)_+=a[P*s+h]*o[h*i+G];u[P*i+G]=_}if(!r(await this.matmul(a,o,n,s,i),u))return t("matmul");{let P=(_,h,y,k,w)=>{let x=new Float32Array(y*w);for(let B=0;B<y;B++)for(let q=0;q<w;q++){let M=0;for(let O=0;O<k;O++)M+=_[B*k+O]*h[q*k+O];x[B*w+q]=M}return x},G=async(_,h,y)=>{let k=e(_*h),w=e(y*h);return r(await this.matmulT(k,w,_,h,y),P(k,w,_,h,y))};if(!await G(3,8,5))return t("matmulT.vec4(3,8,5)");if(!await G(1,16,7))return t("matmulT.vec4(1,16,7)");if(!await G(2,6,4))return t("matmulT.scalar(2,6,4)");if(this.hasF16){let k=e(16),w=e(112),x=this.uploadGpuF16(w),B=await this.matmulT(k,x,1,16,7,!0),q=new Float32Array(7);for(let R=0;R<7;R++){let E=0;for(let W=0;W<16;W++)E+=k[W]*w[R*16+W];q[R]=E}x.destroy?.();let M=R=>R.length===q.length&&R.every((E,W)=>Math.abs(E-q[W])<=.03*(1+Math.abs(q[W])));if(!M(B))return t("matmulT.f16");let O=this.uploadGpu(w),C=this.f32ToF16Gpu(O,112),S=await this.matmulT(k,C,1,16,7,!0);if(O.destroy?.(),C.destroy?.(),!M(S))return t("packf16")}if(this.hasF16&&this.f16SharedOk){let _=[{m:20,k:128,n:18},{m:32,k:64,n:64},{m:70,k:40,n:130},{m:33,k:48,n:7}];for(let h of _){let y=e(h.m*h.k),k=e(h.n*h.k),w=this.uploadGpuF16(k),x=await this.matmulT(y,w,h.m,h.k,h.n,!0);this.f16SharedOk=!1;let B=await this.matmulT(y,w,h.m,h.k,h.n,!0);if(this.f16SharedOk=!0,w.destroy?.(),!(x.length===B.length&&x.every((M,O)=>Math.abs(M-B[O])<=.001*(1+Math.abs(B[O]))))){this.f16SharedOk=!1,console.warn(`[selfValidate] matmul_t_f16w_shared KO sur ce GPU (m=${h.m}, k=${h.k}, n=${h.n}) : repli sur matmul_t_f16w (plus lent, m\xEAme r\xE9sultat).`);break}}}}{let h=e(128),y=e(768),k=Te(y),w=this.uploadGpuRaw(k.nibbles),x=this.uploadGpuRaw(new Uint8Array(k.scales.buffer,k.scales.byteOffset,k.scales.byteLength)),B=this.uploadGpuRaw(new Uint8Array(k.mins.buffer,k.mins.byteOffset,k.mins.byteLength)),q=await this.matmulQ4(h,w,x,B,1,128,6),M=ye(k),O=new Float32Array(6);for(let W=0;W<6;W++){let N=0;for(let I=0;I<128;I++)N+=h[I]*M[W*128+I];O[W]=N}if(w.destroy?.(),x.destroy?.(),B.destroy?.(),!r(q,O))return t("matmulQ4");let C=this.uploadGpu(y),S=this.f32ToQ4Gpu(C,768),R=await this.matmulQ4(h,S.nib,S.sc,S.mn,1,128,6);if(C.destroy?.(),S.nib.destroy?.(),S.sc.destroy?.(),S.mn.destroy?.(),!(R.length===O.length&&R.every((W,N)=>Math.abs(W-O[N])<=.06*(1+Math.abs(O[N]))+.02)))return t("quantize_q4")}{let h=e(640),y=e(768),k=Un(y),w=this.uploadGpuRaw(new Uint8Array(k.lo.buffer,k.lo.byteOffset,k.lo.byteLength)),x=this.uploadGpuRaw(new Uint8Array(k.hi.buffer,k.hi.byteOffset,k.hi.byteLength)),B=this.uploadGpuRaw(new Uint8Array(k.scales.buffer,k.scales.byteOffset,k.scales.byteLength)),q=this.uploadGpuRaw(new Uint8Array(k.mins.buffer,k.mins.byteOffset,k.mins.byteLength)),M=await this.matmulQ3(h,w,x,B,q,5,128,6),O=$e(k),C=new Float32Array(30);for(let S=0;S<5;S++)for(let R=0;R<6;R++){let E=0;for(let W=0;W<128;W++)E+=h[S*128+W]*O[R*128+W];C[S*6+R]=E}if(w.destroy?.(),x.destroy?.(),B.destroy?.(),q.destroy?.(),!r(M,C))return t("matmulQ3")}{let h=e(640),y=e(768),k=Te(y),w=this.uploadGpuRaw(k.nibbles),x=this.uploadGpuRaw(new Uint8Array(k.scales.buffer,k.scales.byteOffset,k.scales.byteLength)),B=this.uploadGpuRaw(new Uint8Array(k.mins.buffer,k.mins.byteOffset,k.mins.byteLength)),q=await this.matmulQ4Tiled(h,w,x,B,5,128,6),M=ye(k),O=new Float32Array(30);for(let C=0;C<5;C++)for(let S=0;S<6;S++){let R=0;for(let E=0;E<128;E++)R+=h[C*128+E]*M[S*128+E];O[C*6+S]=R}if(w.destroy?.(),x.destroy?.(),B.destroy?.(),!r(q,O))return t("matmul_q4_tiled")}for(let P of[{m:20,n:18},{m:32,n:64},{m:70,n:130}]){let G=P.m,_=128,h=P.n,y=e(G*_),k=e(h*_),w=Te(k),x=this.uploadGpuRaw(w.nibbles),B=this.uploadGpuRaw(new Uint8Array(w.scales.buffer,w.scales.byteOffset,w.scales.byteLength)),q=this.uploadGpuRaw(new Uint8Array(w.mins.buffer,w.mins.byteOffset,w.mins.byteLength)),M=await this.matmulQ4Shared(y,x,B,q,G,_,h),O=ye(w),C=new Float32Array(G*h);for(let S=0;S<G;S++)for(let R=0;R<h;R++){let E=0;for(let W=0;W<_;W++)E+=y[S*_+W]*O[R*_+W];C[S*h+R]=E}if(x.destroy?.(),B.destroy?.(),q.destroy?.(),!r(M,C))return t(`matmul_q4_shared(${G},${h})`)}{let h=e(128),y=e(768),k=qe(y),w=this.uploadGpuRaw(new Uint8Array(k.codes.buffer,k.codes.byteOffset,k.codes.byteLength)),x=this.uploadGpuRaw(new Uint8Array(k.scales.buffer,k.scales.byteOffset,k.scales.byteLength)),B=await this.matmulQ8(h,w,x,1,128,6),q=ke(k),M=new Float32Array(6);for(let R=0;R<6;R++){let E=0;for(let W=0;W<128;W++)E+=h[W]*q[R*128+W];M[R]=E}if(w.destroy?.(),x.destroy?.(),!r(B,M))return t("matmulQ8");let O=this.uploadGpu(y),C=this.f32ToQ8Gpu(O,768),S=await this.matmulQ8(h,C.codes,C.sc,1,128,6);if(O.destroy?.(),C.codes.destroy?.(),C.sc.destroy?.(),!r(S,M))return t("quantize_q8")}{let h=e(640),y=e(768),k=qe(y),w=this.uploadGpuRaw(new Uint8Array(k.codes.buffer,k.codes.byteOffset,k.codes.byteLength)),x=this.uploadGpuRaw(new Uint8Array(k.scales.buffer,k.scales.byteOffset,k.scales.byteLength)),B=await this.matmulQ8Tiled(h,w,x,5,128,6),q=ke(k),M=new Float32Array(30);for(let O=0;O<5;O++)for(let C=0;C<6;C++){let S=0;for(let R=0;R<128;R++)S+=h[O*128+R]*q[C*128+R];M[O*6+C]=S}if(w.destroy?.(),x.destroy?.(),!r(B,M))return t("matmul_q8_tiled")}for(let P of[{k:128,n:6},{k:128,n:130},{k:4096,n:17}]){let G=P.k,_=P.n,h=e(G),y=e(_*G),k=Te(y),w=this.uploadGpuRaw(k.nibbles),x=this.uploadGpuRaw(new Uint8Array(k.scales.buffer,k.scales.byteOffset,k.scales.byteLength)),B=this.uploadGpuRaw(new Uint8Array(k.mins.buffer,k.mins.byteOffset,k.mins.byteLength)),q=await this.matmulQ4Vec(h,w,x,B,G,_),M=ye(k),O=new Float32Array(_);for(let I=0;I<_;I++){let $=0;for(let D=0;D<G;D++)$+=h[D]*M[I*G+D];O[I]=$}if(w.destroy?.(),x.destroy?.(),B.destroy?.(),!r(q,O))return t(`matmul_q4_vec(${G},${_})`);let C=qe(y),S=this.uploadGpuRaw(new Uint8Array(C.codes.buffer,C.codes.byteOffset,C.codes.byteLength)),R=this.uploadGpuRaw(new Uint8Array(C.scales.buffer,C.scales.byteOffset,C.scales.byteLength)),E=await this.matmulQ8Vec(h,S,R,G,_),W=ke(C),N=new Float32Array(_);for(let I=0;I<_;I++){let $=0;for(let D=0;D<G;D++)$+=h[D]*W[I*G+D];N[I]=$}if(S.destroy?.(),R.destroy?.(),!r(E,N))return t(`matmul_q8_vec(${G},${_})`)}for(let P of[{m:20,n:18},{m:32,n:64},{m:70,n:130}]){let G=P.m,_=128,h=P.n,y=e(G*_),k=e(h*_),w=qe(k),x=this.uploadGpuRaw(new Uint8Array(w.codes.buffer,w.codes.byteOffset,w.codes.byteLength)),B=this.uploadGpuRaw(new Uint8Array(w.scales.buffer,w.scales.byteOffset,w.scales.byteLength)),q=await this.matmulQ8Shared(y,x,B,G,_,h),M=ke(w),O=new Float32Array(G*h);for(let C=0;C<G;C++)for(let S=0;S<h;S++){let R=0;for(let E=0;E<_;E++)R+=y[C*_+E]*M[S*_+E];O[C*h+S]=R}if(x.destroy?.(),B.destroy?.(),!r(q,O))return t(`matmul_q8_shared(${G},${h})`)}if(this.qShared2Ok){let P=[{m:64,k:128,n:128},{m:65,k:128,n:130},{m:100,k:160,n:18},{m:70,k:96,n:200}];for(let G of P){let _=G.m,h=G.k,y=G.n,k=e(_*h),w=e(y*h),x=new Float32Array(_*y),B=qe(w),q=ke(B);for(let D=0;D<_;D++)for(let z=0;z<y;z++){let L=0;for(let j=0;j<h;j++)L+=k[D*h+j]*q[z*h+j];x[D*y+z]=L}let M=this.uploadGpuRaw(new Uint8Array(B.codes.buffer,B.codes.byteOffset,B.codes.byteLength)),O=this.uploadGpuRaw(new Uint8Array(B.scales.buffer,B.scales.byteOffset,B.scales.byteLength)),C=await this.matmulQ8Shared2(k,M,O,_,h,y);M.destroy?.(),O.destroy?.();let S=Te(w),R=ye(S),E=new Float32Array(_*y);for(let D=0;D<_;D++)for(let z=0;z<y;z++){let L=0;for(let j=0;j<h;j++)L+=k[D*h+j]*R[z*h+j];E[D*y+z]=L}let W=this.uploadGpuRaw(S.nibbles),N=this.uploadGpuRaw(new Uint8Array(S.scales.buffer,S.scales.byteOffset,S.scales.byteLength)),I=this.uploadGpuRaw(new Uint8Array(S.mins.buffer,S.mins.byteOffset,S.mins.byteLength)),$=await this.matmulQ4Shared2(k,W,N,I,_,h,y);if(W.destroy?.(),N.destroy?.(),I.destroy?.(),!r(C,x)||!r($,E)){this.qShared2Ok=!1,console.warn(`[selfValidate] matmul_t_q8/q4_shared2 KO sur ce GPU (m=${_}, k=${h}, n=${y}) : repli sur les tuiles 32\xD764 v1 (plus lentes, m\xEAme r\xE9sultat).`);break}}}{let G=e(1632),_=new Uint8Array(G.buffer,G.byteOffset,G.byteLength),h=(y,k)=>y.length===k.length&&y.every((w,x)=>w===k[x]);if(!h(await this.quantizeToBytes("F32",_,1632,"q8"),await this.quantizeToBytes("F32",_,1632,"q8",256)))return t("quantize_chunk_q8");if(!h(await this.quantizeToBytes("F32",_,1632,"q4"),await this.quantizeToBytes("F32",_,1632,"q4",256)))return t("quantize_chunk_q4")}let c=2,l=8,d=e(c*l),p=e(l),g=new Float32Array(c*l);for(let P=0;P<c;P++){let G=0;for(let h=0;h<l;h++)G+=d[P*l+h]**2;let _=1/Math.sqrt(G/l+1e-5);for(let h=0;h<l;h++)g[P*l+h]=d[P*l+h]*_*p[h]}if(!r(await this.rmsnorm(d,p,c,l),g))return t("rmsnorm");if(!r(await this.rmsnorm(d,p,c,l,1e-5,!0),Ie(d,p,c,l,1e-5,!0)))return t("rmsnorm.onePlus");let m=e(16),b=e(16),v=m.map((P,G)=>P/(1+Math.exp(-P))*b[G]);if(!r(await this.swiglu(m,b),v))return t("swiglu");let U=m.map((P,G)=>jn(P)*b[G]);if(!r(await this.geglu(m,b),U))return t("geglu");let A=m.map((P,G)=>P+b[G]);if(!r(await this.add(m,b),A))return t("add");{let P=ue.MAX_WG_DIM*ge+257,G=new Float32Array(P),_=new Float32Array(P),h=[0,1,ge-1,ge,ue.MAX_WG_DIM*ge-1,ue.MAX_WG_DIM*ge,P-1];for(let w of h)G[w]=w%7-3,_[w]=w%5-2;let y=await this.add(G,_),k=y.length===P;for(let w of h)Math.abs(y[w]-(G[w]+_[w]))>1e-5&&(k=!1);if(!k)return t("grid1D.add(2D)")}let F=(P,G,_=.003)=>P.length===G.length&&P.every((h,y)=>Math.abs(h-G[y])<=_*(1+Math.abs(G[y])));{let k=e(8);if(!F(await this.rope(k,2,4,2,1,1e4),At(k,2,4,2,1,1e4)))return t("rope")}{let k=e(384),w=new Float32Array(64/2).fill(1);if(!F(await this.ropeFactors(k,w,6,64,2,7,5e5),At(k,6,64,2,7,5e5)))return t("rope_factors.ones");let x=Float32Array.from({length:64/2},(B,q)=>1+q%5*.7);if(!F(await this.ropeFactors(k,x,6,64,2,7,5e5),qi(k,x,6,64,2,7,5e5)))return t("rope_factors")}{let k=e(384);if(!F(await this.rope(k,6,64,2,7,5e5,!0),Nt(k,6,64,2,7,5e5)))return t("rope.interleaved");let w=e(8);if(!F(await this.rope(w,2,4,2,3,1e4,!0),Nt(w,2,4,2,3,1e4)))return t("rope.interleaved.hd4");let x=e(384);if(!F(await this.rope(x,6,64,2,0,5e5,!0),Nt(x,6,64,2,0,5e5)))return t("rope.interleaved.pos0");let B=64/2,q=new Float32Array(384);for(let R=0;R<6;R++)for(let E=0;E<B;E++)q[R*64+2*E]=k[R*64+E],q[R*64+2*E+1]=k[R*64+E+B];let M=await this.rope(q,6,64,2,7,5e5,!0),O=await this.rope(k,6,64,2,7,5e5,!1),C=new Float32Array(384);for(let R=0;R<6;R++)for(let E=0;E<B;E++)C[R*64+2*E]=O[R*64+E],C[R*64+2*E+1]=O[R*64+E+B];if(!F(M,C))return t("rope.interleaved.equivalence");let S=Float32Array.from({length:B},(R,E)=>1+E%5*.7);if(!F(await this.ropeFactors(k,S,6,64,2,7,5e5,!0),Nt(k,6,64,2,7,5e5,S)))return t("rope_factors.interleaved")}{let _=[16,24,24],h=1e6,y=3,k=y*2,w=5,x=e(k*128),B=new Uint32Array(y*3);for(let C=0;C<y;C++){let S=w+C;B.set([S,S,S],C*3)}let q=new Uint32Array([5,5,5,5,6,9,5,7,5]),M=F(await this.ropeMrope(x,B,k,128,2,_,h),At(x,k,128,2,w,h)),O=F(await this.ropeMrope(x,q,k,128,2,_,h),Bi(x,q,k,128,2,_,h));(!M||!O)&&(this.mropeOk=!1,console.error(`[selfValidate] rope_mrope KO sur ce GPU (${M?"positions 3D":"d\xE9g\xE9n\xE9r\xE9\u2260rope"}). Vision d\xE9sactiv\xE9e, chat texte intact.`))}{let w=e(32),x=e(32),B=e(32);if(!F(await this.attention(w,x,B,2,4,2,4,2),Se(w,x,B,2,4,2,4,2)))return t("attention");let q=.3,M=5;if(!F(await this.attention(w,x,B,2,4,2,4,2,q,M),Se(w,x,B,2,4,2,4,2,q,M)))return t("attention.softcap");{let N=e(24),I=e(48),$=e(48);for(let D of[1,4,8,64]){if(!F(await this.attention(N,I,$,3,2,1,4,9,void 0,0,D),Se(N,I,$,3,2,1,4,9,void 0,0,D)))return t(`attention.window(${D})`);if(!F(await this.attentionDecode(N,I,$,3,2,1,4,9,void 0,0,D),Se(N,I,$,3,2,1,4,9,void 0,0,D)))return t(`attention_decode.window(${D})`)}}{let O=await this.quantizeKvReadback(x,4,2,4),C=await this.quantizeKvReadback(B,4,2,4),S=await this.attentionQ8Kv(w,O.codes,O.scales,C.codes,C.scales,2,4,2,4,2),R=($,D)=>{let z=new Float32Array(32);for(let L=0;L<4;L++)for(let j=0;j<2;j++){let Q=D[L*2+j];for(let X=0;X<4;X++){let V=L*2*4+j*4+X,H=$[V>>2]>>(V&3)*8&255;z[V]=(H<128?H:H-256)*Q}}return z},E=R(O.codes,O.scales),W=R(C.codes,C.scales),N=Se(w,E,W,2,4,2,4,2);if(!F(S,N,.005))return t("attention.q8kv");let I=0;for(let $=0;$<x.length;$++)I=Math.max(I,Math.abs(E[$]-x[$]));if(I>.05)return t("quantize_kv.error")}}{let P=_=>{this.attnDecodeOk=!1,console.error("[selfValidate] attention d\xE9codage HS sur ce GPU (\xE9tape :",_,") \u2192 repli kernels classiques (plus lents \xE0 contexte long, corrects)")},G=[{nT:1,nH:14,nKv:2,hd:64,past:300},{nT:10,nH:14,nKv:2,hd:64,past:173}];for(let _ of G){if(!this.attnDecodeOk)break;let h=_.past+_.nT,y=e(_.nT*_.nH*_.hd),k=e(h*_.nKv*_.hd),w=e(h*_.nKv*_.hd);if(!F(await this.attentionDecode(y,k,w,_.nT,_.nH,_.nKv,_.hd,_.past),Se(y,k,w,_.nT,_.nH,_.nKv,_.hd,_.past))){P(`decode(nT=${_.nT})`);break}let x=await this.quantizeKvReadback(k,h,_.nKv,_.hd),B=await this.quantizeKvReadback(w,h,_.nKv,_.hd),q=await this.attentionQ8KvDecode(y,x.codes,x.scales,B.codes,B.scales,_.nT,_.nH,_.nKv,_.hd,_.past),M=await this.attentionQ8Kv(y,x.codes,x.scales,B.codes,B.scales,_.nT,_.nH,_.nKv,_.hd,_.past);if(!F(q,M,.005)){P(`decode.q8kv(nT=${_.nT})`);break}}if(this.attnDecodeOk){let x=e(64),B=e(350*8),q=e(350*8);F(await this.attentionDecode(x,B,q,2,4,2,8,173,.3,5),Se(x,B,q,2,4,2,8,173,.3,5))||P("decode.softcap")}if(this.attnDecodeOk){let x=e(256),B=e(9088),q=e(9088);F(await this.attentionDecode(x,B,q,1,2,1,128,70),Se(x,B,q,1,2,1,128,70))||P("decode.hd128")}}{let P=h=>{this.attnPrefillOk=!1,console.error("[selfValidate] attention prefill tuil\xE9e HS sur ce GPU (\xE9tape :",h,") \u2192 repli kernel classique (plus lent en prefill, correct)")},G=[{nT:37,nH:14,nKv:2,hd:64,past:0,sc:void 0,cap:0,win:0},{nT:13,nH:14,nKv:2,hd:64,past:173,sc:void 0,cap:0,win:0},{nT:1,nH:14,nKv:2,hd:64,past:300,sc:void 0,cap:0,win:0},{nT:4,nH:4,nKv:2,hd:32,past:7,sc:void 0,cap:0,win:0},{nT:5,nH:4,nKv:2,hd:32,past:0,sc:void 0,cap:0,win:0},{nT:9,nH:2,nKv:1,hd:128,past:70,sc:void 0,cap:0,win:0},{nT:6,nH:4,nKv:2,hd:8,past:17,sc:.3,cap:5,win:0}];for(let h of G){let y=h.past+h.nT,k=e(h.nT*h.nH*h.hd),w=e(y*h.nKv*h.hd),x=e(y*h.nKv*h.hd);if(!F(await this.attentionPrefill(k,w,x,h.nT,h.nH,h.nKv,h.hd,h.past,h.sc,h.cap,h.win),Se(k,w,x,h.nT,h.nH,h.nKv,h.hd,h.past,h.sc,h.cap,h.win))){P(`prefill(nT=${h.nT},hd=${h.hd},past=${h.past}${h.cap>0?",softcap":""})`);break}}if(this.attnPrefillOk){let q=e(80),M=e(76),O=e(76);for(let C of[1,4,8,64])if(!F(await this.attentionPrefill(q,M,O,10,2,1,4,9,void 0,0,C),Se(q,M,O,10,2,1,4,9,void 0,0,C))){P(`prefill.window(${C})`);break}}let _=[{nT:37,nH:14,nKv:2,hd:64,past:0,win:0},{nT:13,nH:14,nKv:2,hd:64,past:173,win:0},{nT:10,nH:2,nKv:1,hd:8,past:9,win:4}];for(let h of _){if(!this.attnPrefillOk)break;let y=h.past+h.nT,k=e(h.nT*h.nH*h.hd),w=e(y*h.nKv*h.hd),x=e(y*h.nKv*h.hd),B=await this.quantizeKvReadback(w,y,h.nKv,h.hd),q=await this.quantizeKvReadback(x,y,h.nKv,h.hd),M=await this.attentionQ8KvPrefill(k,B.codes,B.scales,q.codes,q.scales,h.nT,h.nH,h.nKv,h.hd,h.past,void 0,0,h.win),O=await this.attentionQ8Kv(k,B.codes,B.scales,q.codes,q.scales,h.nT,h.nH,h.nKv,h.hd,h.past,void 0,0,h.win);if(!F(M,O,.005)){P(`prefill.q8kv(nT=${h.nT},win=${h.win})`);break}}}{let P=_=>{this.rmsVecOk=!1,console.error("[selfValidate] RMSNorm parall\xE8le HS sur ce GPU (\xE9tape :",_,") \u2192 repli kernel une-ligne-par-thread (correct, plus lent en d\xE9codage)")},G=[{rows:1,dim:1024,onePlus:!1},{rows:1,dim:1536,onePlus:!1},{rows:1,dim:100,onePlus:!1},{rows:14,dim:64,onePlus:!1},{rows:37,dim:2048,onePlus:!1},{rows:3,dim:128,onePlus:!0}];for(let _ of G){let h=e(_.rows*_.dim),y=e(_.dim),k=await this.rmsnormVec(h,y,_.rows,_.dim,1e-6,_.onePlus),w=await this.rmsnorm(h,y,_.rows,_.dim,1e-6,_.onePlus);if(!F(k,w,.005)){P(`rmsnorm_vec(${_.rows}\xD7${_.dim}${_.onePlus?",1+w":""})`);break}}}{let P=_=>{this.topKParOk=!1,console.error("[selfValidate] top-K parall\xE8le HS sur ce GPU (\xE9tape :",_,") \u2192 repli s\xE9lection sur un thread (correcte, plus lente)")},G=[{n:151936,k:64,ties:!1,label:"vocab Qwen (151936)"},{n:65536,k:64,ties:!1,label:"vocab World (65536)"},{n:1e3,k:64,ties:!1,label:"n non multiple de 128"},{n:300,k:64,ties:!1,label:"n < 1024 candidats"},{n:4096,k:8,ties:!1,label:"petit K"},{n:8192,k:64,ties:!0,label:"EX \xC6QUO (d\xE9partage)"}];for(let _ of G){if(!this.topKParOk)break;let h=_.ties?Float32Array.from({length:_.n},(x,B)=>Math.round(Math.random()*6)+(B%7===0?3:0)):e(_.n),y=await this.topKReadback(h,_.k,"top_k"),k=await this.topKReadback(h,_.k,"top_k_par");if(!(y.length===k.length&&y.every((x,B)=>x===k[B]))){let x=y.findIndex((B,q)=>B!==k[q]);P(`top_k_par(${_.label}). Premier \xE9cart au rang ${x} : ${y[x]} vs ${k[x]}`);break}}}{let x={seq:3,d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},B={attnNorm:e(16),wq:e(256),wk:e(128),wv:e(128),wo:e(256),bq:e(16),bk:e(8),bv:e(8),ffnNorm:e(16),wgate:e(256),wup:e(256),wdown:e(256)},q=e(48);if(!F(await this.layerForward(q,x,B),Gr(q,x,B),.005))return t("layerForward")}{let B={seq:3,d:12,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6,attnScale:1/Math.sqrt(4),attnLogitSoftcap:5,act:"gelu",rmsGainOnePlus:!0},q={attnNorm:e(12),wq:e(192),wk:e(96),wv:e(96),wo:e(192),ffnNorm:e(12),wgate:e(192),wup:e(192),wdown:e(192),postAttnNorm:e(12),postFfnNorm:e(12)},M=e(36);if(!F(await this.layerForward(M,B,q),Gr(M,B,q),.005))return t("layerForward.gemma2")}{let B={seq:3,d:12,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e6,eps:1e-6},q={attnNorm:e(12),wq:e(192),wk:e(96),wv:e(96),wo:e(192),ffnNorm:e(12),wgate:e(192),wup:e(192),wdown:e(192),qNorm:e(4),kNorm:e(4)},M=e(36);if(!F(await this.layerForward(M,B,q),Gr(M,B,q),.005))return t("layerForward.qwen3")}{let G=new Uint8Array(720);for(let h=0;h<5;h++){let y=h*144,k=new DataView(G.buffer);k.setUint16(y,me(.005+Math.random()*.05),!0),k.setUint16(y+2,me(.001+Math.random()*.02),!0);for(let w=4;w<144;w++)G[y+w]=Math.random()*256|0}let _=await this.dequantizeQ4K(G,5*256);if(!F(_,et(G,5),1e-4))return t("dequant.Q4_K")}{let P=q=>{let M=new Uint8Array(q);for(let O=0;O<q;O++)M[O]=Math.random()*256|0;return M},G=(q,M)=>{let O=new DataView(q.buffer),C=S=>M===210?S*210+208:S*M;for(let S=0;S*M<q.length;S++)O.setUint16(C(S),me(.005+Math.random()*.05),!0);return q},h=G(P(136),34);if(!F(await this.dequantizeByType("Q8_0",h,128),hi(h,4),1e-4))return t("dequant.Q8_0");let y=G(P(88),22);if(!F(await this.dequantizeByType("Q5_0",y,128),bi(y,4),1e-4))return t("dequant.Q5_0");let k=G(P(840),210);if(!F(await this.dequantizeByType("Q6_K",k,4*256),Ve(k,4),1e-4))return t("dequant.Q6_K");let w=G(P(72),18);if(!F(await this.dequantizeByType("Q4_0",w,128),vi(w,4),1e-4))return t("dequant.Q4_0");let x=P(704),B=new DataView(x.buffer);for(let q=0;q<4;q++)B.setUint16(q*176,me(.005+Math.random()*.05),!0),B.setUint16(q*176+2,me(.001+Math.random()*.02),!0);if(!F(await this.dequantizeByType("Q5_K",x,4*256),wi(x,4),1e-4))return t("dequant.Q5_K");if(this.dequantQ3kOk){let q=P(440),M=new DataView(q.buffer);for(let C=0;C<4;C++)M.setUint16(C*110+108,me(.005+Math.random()*.05),!0);let O=await this.dequantizeByType("Q3_K",q,4*256);F(O,_r(q,4),1e-4)||(this.dequantQ3kOk=!1,console.warn("[selfValidate] dequant.Q3_K en \xE9chec, repli sur CPU"))}if(this.dequantQ41Ok){let q=P(80),M=new DataView(q.buffer);for(let C=0;C<4;C++)M.setUint16(C*20,me(.005+Math.random()*.05),!0),M.setUint16(C*20+2,me(.001+Math.random()*.02),!0);let O=await this.dequantizeByType("Q4_1",q,128);F(O,Ar(q,4),1e-4)||(this.dequantQ41Ok=!1,console.warn("[selfValidate] dequant.Q4_1 en \xE9chec, repli sur CPU"))}if(this.dequantPq2Ok){let q=P(136),M=new DataView(q.buffer);for(let C=0;C<4;C++)M.setUint16(C*34,me(.005+Math.random()*.05),!0);let O=await this.dequantizeByType("PQ2_0",q,512);F(O,We(q,4),1e-4)||(this.dequantPq2Ok=!1,console.warn("[selfValidate] dequant.PQ2_0 en \xE9chec, repli sur CPU"))}}{let w={d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},x={attnNorm:e(16),wq:e(256),wk:e(128),wv:e(128),wo:e(256),bq:e(16),bk:e(8),bv:e(8),ffnNorm:e(16),wgate:e(256),wup:e(256),wdown:e(256)},B=e(48),M=(await this.layerForward(B,{...w,seq:3},x)).slice(32,48),O=new Float32Array(0),C=await this.layerForwardKV(B.slice(0,32),{...w,seq:2},x,0,O,O),S=await this.layerForwardKV(B.slice(32,48),{...w,seq:1},x,2,C.k,C.v);if(!F(S.out,M,.005))return t("layerForwardKV")}{let _=e(4),h=e(40),y=new Float32Array(10);for(let B=0;B<10;B++){let q=0;for(let M=0;M<4;M++)q+=_[M]*h[B*4+M];y[B]=q}let k=0;for(let B=1;B<10;B++)y[B]>y[k]&&(k=B);let w=this.uploadGpu(h),x=await this.argmaxProjection(_,[{buf:w,rows:10,r0:0}],4,10,!1);if(w.destroy?.(),x!==k)return t("argmaxProjection")}{let w={seq:4,d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},x={attnNorm:e(16),wq:e(256),wk:e(128),wv:e(128),wo:e(256),bq:e(16),bk:e(8),bv:e(8),ffnNorm:e(16),wgate:e(256),wup:e(256),wdown:e(256)},B=e(16),q=e(64),M=new Float32Array(0),O=await this.layerForwardKV(q,{...w,seq:4},x,0,M,M,!0),C=Ie(O.out.slice(48,64),B,1,16,1e-6),S={attnNorm:this.uploadGpu(x.attnNorm),wq:this.uploadGpu(x.wq),wk:this.uploadGpu(x.wk),wv:this.uploadGpu(x.wv),wo:this.uploadGpu(x.wo),ffnNorm:this.uploadGpu(x.ffnNorm),wgate:this.uploadGpu(x.wgate),wup:this.uploadGpu(x.wup),wdown:this.uploadGpu(x.wdown),bq:this.uploadGpu(x.bq),bk:this.uploadGpu(x.bk),bv:this.uploadGpu(x.bv)},R=this.uploadGpu(B),E=this.kvQuant;this.kvQuant=!1,this.resetKvGpu();let W=await this.runDecodeGpu(q,{...w,seq:4},[S],0,R,"selftest-A");if(!F(W,C,.008))return this.resetKvGpu(),this.kvQuant=E,t("runDecodeGpu.prefill");await this.runDecodeGpu(q.slice(0,48),{...w,seq:3},[S],0,R,"selftest-B");let N=await this.runDecodeGpu(q.slice(48,64),{...w,seq:1},[S],3,R,"selftest-B");if(!F(N,C,.008))return this.resetKvGpu(),this.kvQuant=E,t("runDecodeGpu.decode");this.kvQuant=E,this.resetKvGpu();for(let I of Object.values(S))I?.destroy?.();R.destroy?.()}{let y=Float32Array.from({length:152064},()=>(Math.random()*2-1)*8),k=[...new Set(Array.from({length:40},()=>Math.floor(Math.random()*152064)))],w=y.slice();for(let z=0;z<152064;z++)w[z]=30*Math.tanh(w[z]/30);for(let z of k)w[z]=w[z]>0?w[z]/1.15:w[z]*1.15;let x=Array.from(w.keys()).sort((z,L)=>w[L]-w[z]).slice(0,64),B=globalThis,q=[],M=this.storage(152064*4);this.device.queue.writeBuffer(M,0,y),q.push(M);let O=this.device.createCommandEncoder(),C=this.uniform([152064],{offset:4,value:30});this.recordPass(O,"softcap_logits",[C,M],this.grid1D(152064));let S=this.bufU32(Uint32Array.from(k),B.GPUBufferUsage.STORAGE|B.GPUBufferUsage.COPY_DST),R=this.uniform([k.length],{offset:4,value:1.15});this.recordPass(O,"penalize_logits",[R,S,M],this.grid1D(k.length));let E=this.storage(512),W=this.uniform([152064,64]);this.recordPass(O,this.topKParOk?"top_k_par":"top_k",[W,M,E],[1,1,1]),q.push(C,S,R,W,E);let N=this.device.createBuffer({size:512,usage:B.GPUBufferUsage.COPY_DST|B.GPUBufferUsage.MAP_READ});O.copyBufferToBuffer(E,0,N,0,512),this.device.queue.submit([O.finish()]),await N.mapAsync(B.GPUMapMode.READ);let I=new Uint32Array(N.getMappedRange().slice(0));N.unmap(),N.destroy(),this.release(q);let $=I.slice(0,64),D=new Float32Array(I.buffer,256,64);this.topKOk=!0;for(let z=0;z<64;z++){let L=Math.abs(D[z]-w[x[z]])<=1e-4*(1+Math.abs(w[x[z]])),j=Math.abs(w[$[z]]-D[z])<=1e-4*(1+Math.abs(D[z]));if(!L||!j){this.topKOk=!1,console.error(`[selfValidate] top_k KO sur ce GPU (rang ${z}) : repli sur le sampling CPU plein-vocab (plus lent, m\xEAme r\xE9sultat).`);break}}}if(this.rwkvWkv7Ok){let h=e(128),y=e(16),k=e(16),w=e(16),x=e(16),B=e(16),q=Float32Array.from({length:16},()=>Math.random()*.5+.5),M=h.slice(),O=new Float32Array(16);for(let D=0;D<2;D++){let z=D*8;for(let L=0;L<8;L++){let j=D*8*8+L*8,Q=w[z+L],X=0;for(let H=0;H<8;H++)X+=B[z+H]*M[j+H];let V=0;for(let H=0;H<8;H++){let Y=q[z+H]*M[j+H]+Q*k[z+H]+x[z+H]*X;M[j+H]=Y,V+=y[z+H]*Y}O[z+L]=V}}let C=await this.rwkvWkv7(h.slice(),y,q,k,w,B,x,2,8),S=(D,z)=>D.length===z.length&&D.every((L,j)=>Math.abs(L-z[j])<=.001*(1+Math.abs(z[j])));!S(C.S,M)||!S(C.y,O)?(this.rwkvWkv7Ok=!1,console.error("[selfValidate] RWKV-7 WKV KO sur ce GPU : une archi RWKV (moteur v2) refuserait de charger (non bloquant pour le chat texte).")):console.log("[selfValidate] RWKV-7 WKV OK (r\xE9currence \xE0 \xE9tat fixe, moteur v2)");let R=16,E=e(R),W=e(R),N=e(R*6),I=new Float32Array(R*6);for(let D=0;D<6;D++)for(let z=0;z<R;z++){let L=D*R+z;I[L]=E[z]+(W[z]-E[z])*N[L]}let $=await this.rwkvTokenShift(E,W,N,R);if(S($,I)?console.log("[selfValidate] RWKV-7 token-shift OK"):(this.rwkvWkv7Ok=!1,console.error("[selfValidate] RWKV-7 token-shift KO sur ce GPU (non bloquant pour le chat texte).")),this.rwkvResidentOk){let D=globalThis,z=D.GPUBufferUsage.STORAGE|D.GPUBufferUsage.COPY_DST|D.GPUBufferUsage.COPY_SRC,L=2,j=8,Q=L*j,X=(H,Y)=>{let J=Math.max(16,Math.ceil((H.length*4+(Y?4:0))/16)*16),te=this.device.createBuffer({size:J,usage:D.GPUBufferUsage.UNIFORM|D.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(te,0,new Uint32Array(H)),Y&&this.device.queue.writeBuffer(te,Y.off,new Float32Array([Y.val])),te},V=H=>this.device.createBuffer({size:H*4,usage:z});try{let H=e(Q),Y=e(Q),J=e(Q),te=Float32Array.from({length:Q},()=>Math.random()),re=new Float32Array(Q),Z=new Float32Array(Q),oe=new Float32Array(Q);for(let ve=0;ve<L;ve++){let de=0;for(let Be=0;Be<j;Be++){let xe=H[ve*j+Be]*Y[ve*j+Be];de+=xe*xe}de=Math.sqrt(de)||1e-12;for(let Be=0;Be<j;Be++){let xe=ve*j+Be,jt=H[xe]*Y[xe]/de;Z[xe]=-jt,oe[xe]=jt*te[xe],re[xe]=H[xe]*(1+(te[xe]-1)*J[xe])}}let ne=V(Q),ee=V(Q),le=V(Q);this.dispatch("rwkv_kprep",[X([L,j]),this.buf(H,z),this.buf(te,z),this.buf(Y,z),this.buf(J,z),ne,ee,le],this.grid1D(L));let se=S(await this.readBack(ne,Q*4),re)&&S(await this.readBack(ee,Q*4),Z)&&S(await this.readBack(le,Q*4),oe);ne.destroy?.(),ee.destroy?.(),le.destroy?.();let fe=e(Q),ae=e(Q),Oe=e(Q),Ge=e(Q),at=e(Q),Rt=e(Q),Lt=new Float32Array(Q);for(let ve=0;ve<L;ve++){let de=ve*j,Be=0;for(let be=0;be<j;be++)Be+=fe[de+be];Be/=j;let xe=0;for(let be=0;be<j;be++){let hn=fe[de+be]-Be;xe+=hn*hn}xe/=j;let jt=1/Math.sqrt(xe+64e-5),mn=0;for(let be=0;be<j;be++)mn+=ae[de+be]*re[de+be]*Oe[de+be];for(let be=0;be<j;be++)Lt[de+be]=(fe[de+be]-Be)*jt*at[de+be]+Rt[de+be]+mn*Ge[de+be]}let Ce=new Float32Array(2*Q);Ce.set(at,0),Ce.set(Rt,Q);let he=V(Q);this.dispatch("rwkv_out_gn",[X([L,j],{off:8,val:64e-5}),this.buf(fe,z),this.buf(ae,z),this.buf(re,z),this.buf(Oe,z),this.buf(Ge,z),this.buf(Ce,z),he],this.grid1D(L));let gt=S(await this.readBack(he,Q*4),Lt);he.destroy?.();let Dt=e(Q),mt=e(Q),Ue=Float32Array.from(Dt,(ve,de)=>Math.exp(-.606531/(1+Math.exp(-(ve+mt[de]))))),mr=V(Q);this.dispatch("rwkv_decay",[this.buf(Dt,z),this.buf(mt,z),mr],this.grid1D(Q));let rn=S(await this.readBack(mr,Q*4),Ue);mr.destroy?.();let nn=e(Q),sn=e(Q),an=e(Q),on=e(Q),Zs=Float32Array.from(nn,(ve,de)=>ve+(sn[de]-ve)*(1/(1+Math.exp(-(an[de]+on[de]))))),hr=this.buf(nn,z);this.dispatch("rwkv_vresid",[hr,this.buf(sn,z),this.buf(an,z),this.buf(on,z)],this.grid1D(Q));let un=S(await this.readBack(hr,Q*4),Zs);hr.destroy?.();let cn=e(Q),ln=e(Q),fn=e(Q),ei=Float32Array.from(cn,(ve,de)=>ve+(ln[de]-ve)*fn[de]),br=V(Q);this.dispatch("rwkv_lerp",[this.buf(cn,z),this.buf(ln,z),this.buf(fn,z),br],this.grid1D(Q));let dn=S(await this.readBack(br,Q*4),ei);br.destroy?.();let pn=e(Q),ti=Float32Array.from(pn,ve=>{let de=Math.max(ve,0);return de*de}),vr=V(Q);this.dispatch("sqrelu",[this.buf(pn,z),vr],this.grid1D(Q));let gn=S(await this.readBack(vr,Q*4),ti);vr.destroy?.(),!se||!gt||!rn||!un||!dn||!gn?(this.rwkvResidentOk=!1,console.error(`[selfValidate] glu RWKV r\xE9sidente KO sur ce GPU (kprep:${se} gn:${gt} decay:${rn} vresid:${un} lerp:${dn} sqrelu:${gn}). Repli forwardToken JS+readback (correct, lent).`)):console.log("[selfValidate] glu RWKV r\xE9sidente OK (kprep, out_gn, decay, vresid, lerp, sqrelu)")}catch(H){this.rwkvResidentOk=!1,console.error("[selfValidate] glu RWKV r\xE9sidente : erreur d\u2019ex\xE9cution. Repli forwardToken JS+readback.",H)}}}if(this.lfm2ShortConvOk){let P=M=>Float32Array.from({length:M},()=>Math.random()*2-1),G=(M,O)=>M.length===O.length&&M.every((C,S)=>Math.abs(C-O[S])<=.001*(1+Math.abs(O[S]))),y=P(96),k=P(64),w=P(96),x=new Float32Array(32),B=k.slice();for(let M=0;M<32;M++){let O=y[M]*y[64+M],C=w[M*3+2]*O;for(let S=0;S<2;S++)C+=w[M*3+S]*k[S*32+M];for(let S=0;S+2<3;S++)B[S*32+M]=k[(S+1)*32+M];B[32+M]=O,x[M]=C*y[32+M]}let q=await this.lfm2ShortConv(y,k.slice(),w,32,3);!G(q.out,x)||!G(q.state,B)?(this.lfm2ShortConvOk=!1,console.error("[selfValidate] LFM2 shortconv KO sur ce GPU : une archi lfm2 refuserait de charger (non bloquant pour le reste).")):console.log("[selfValidate] LFM2 shortconv OK (conv courte gat\xE9e, moteur v2)")}if(this.qwen35SsmOk){let P=(y,k,w=.001)=>y.length===k.length&&y.every((x,B)=>Math.abs(x-k[B])<=w*(1+Math.abs(k[B]))),G=y=>{let k=this.storage(y.byteLength);return this.device.queue.writeBuffer(k,0,y),k},_=async(y,k)=>this.readBack(y,k*4),h=null;try{{let k=[3,2],w=e(8192*4),x=new Float32Array(3*8192),B=new Float32Array(3*8192),q=G(x),M=G(w),O=new Float32Array(3*8192),C=G(new Float32Array(3*8192));for(let S of k){let R=e(S*8192),E=new Float32Array(S*8192);for(let z=0;z<8192;z++){let L=B[z],j=B[8192+z],Q=B[2*8192+z];for(let X=0;X<S;X++){let V=R[X*8192+z],H=L*w[z*4]+j*w[z*4+1]+Q*w[z*4+2]+V*w[z*4+3];E[X*8192+z]=H/(1+Math.exp(-H)),L=j,j=Q,Q=V,S===3&&X===0&&(O[z]=L,O[8192+z]=j,O[2*8192+z]=Q)}B[z]=L,B[8192+z]=j,B[2*8192+z]=Q}let W=G(R),N=[],I=this.device.createCommandEncoder(),$=S===3?this.recQwen35Conv(I,N,W,M,q,S,8192,C,0):this.recQwen35Conv(I,N,W,M,q,S,8192);this.device.queue.submit([I.finish()]);let D=await _($,S*8192);if(this.release([...N,W]),!P(D,E)){h=`conv(T=${S})`;break}}!h&&!P(await _(C,3*8192),O)&&(h="conv.instantan\xE9"),this.release([C]),!h&&!P(await _(q,3*8192),B)&&(h="conv.\xE9tat"),this.release([q,M])}if(!h){let O=e(32),C=Float32Array.from({length:32},()=>-.05-Math.random()*.3),S=new Float32Array(4096*128),R=G(new Float32Array(4096*128)),E=G(O),W=G(C),N=new Float32Array(4096*128),I=G(new Float32Array(4096*128));for(let $ of[3,1]){let D=e($*8192),z=e($*32),L=e($*32),j=new Float32Array($*32*128);for(let re=0;re<$;re++)for(let Z=0;Z<32;Z++){let oe=Z%16,ne=re*8192,ee=D.subarray(ne+2048+oe*128,ne+2048+oe*128+128),le=D.subarray(ne+oe*128,ne+oe*128+128),se=D.subarray(ne+4096+Z*128,ne+4096+Z*128+128),fe=0,ae=0;for(let he=0;he<128;he++)fe+=ee[he]*ee[he],ae+=le[he]*le[he];let Oe=1/Math.sqrt(fe+1e-6),Ge=1/Math.sqrt(ae+1e-6)/Math.sqrt(128),at=z[re*32+Z]+O[Z],Rt=Math.exp((at>20?at:Math.log(1+Math.exp(at)))*C[Z]),Lt=1/(1+Math.exp(-L[re*32+Z])),Ce=Z*128*128;for(let he=0;he<16384;he++)S[Ce+he]*=Rt;for(let he=0;he<128;he++){let gt=0;for(let Ue=0;Ue<128;Ue++)gt+=S[Ce+Ue*128+he]*ee[Ue]*Oe;let Dt=(se[he]-gt)*Lt,mt=0;for(let Ue=0;Ue<128;Ue++)S[Ce+Ue*128+he]+=ee[Ue]*Oe*Dt,mt+=S[Ce+Ue*128+he]*le[Ue]*Ge;j[(re*32+Z)*128+he]=mt}$===3&&re===0&&N.set(S.subarray(Ce,Ce+16384),Ce)}let Q=G(D),X=G(z),V=G(L),H=[],Y=this.device.createCommandEncoder(),J=$===3?this.recQwen35Gdn(Y,H,Q,X,V,E,W,R,$,32,16,128,8192,2048,4096,1e-6,I,0):this.recQwen35Gdn(Y,H,Q,X,V,E,W,R,$,32,16,128,8192,2048,4096,1e-6);this.device.queue.submit([Y.finish()]);let te=await _(J,$*32*128);if(this.release([...H,Q,X,V]),!P(te,j,.002)){h=`gdn(T=${$})`;break}}!h&&!P(await _(R,4096*128),S,.002)&&(h="gdn.\xE9tat"),!h&&!P(await _(I,4096*128),N,.002)&&(h="gdn.instantan\xE9"),this.release([I]),this.release([R,E,W])}if(!h){let M=e(3072),O=Float32Array.from(M);for(let N=0;N<12;N++){let I=17+Math.floor(N/4);for(let $=0;$<64/2;$++){let D=I/Math.pow(1e7,2*$/64),z=Math.cos(D),L=Math.sin(D),j=M[N*256+$],Q=M[N*256+$+64/2];O[N*256+$]=j*z-Q*L,O[N*256+$+64/2]=Q*z+j*L}}let C=G(M),S=[],R=this.device.createCommandEncoder(),E=this.recRopePartial(R,S,C,12,256,4,17,1e7,64);this.device.queue.submit([R.finish()]);let W=await _(E,12*256);this.release([...S,C]),P(W,O)||(h="rope_partial")}}catch(y){h=String(y)}h?(this.qwen35SsmOk=!1,console.error(`[selfValidate] Qwen 3.5 (lot) KO (${h}) : un mod\xE8le qwen35 refuserait de charger (non bloquant pour le reste).`)):console.log("[selfValidate] Qwen 3.5 OK (conv k=4 par lot, Gated DeltaNet par lot, instantan\xE9s, RoPE partiel)")}if(this.qwen35SsmOk){let y=new Float32Array(128).fill(.05),k=new Float32Array(128).fill(.02),w=new Float32Array(128).fill(.1),x=new Float32Array([-.05,-.02]),B=new Float32Array([.8,.9]),q=new Float32Array(8192),M=new Float32Array(192),O=new Float32Array(64).fill(.3),C=new Float32Array(256).fill(.25);try{let S=await this.qwen35Conv1d(O,M.slice(),C,64,4),R=await this.qwen35DeltaNetStep(y,k,w,x,B,q.slice(),64,64,2);!S.out||S.out.length!==64||!R.out||R.out.length!==128?(this.qwen35SsmOk=!1,console.error("[selfValidate] Qwen 3.5 SSM KO : dimension invalide")):console.log("[selfValidate] Qwen 3.5 SSM OK (conv causale 1D + Gated DeltaNet, moteur v2)")}catch(S){this.qwen35SsmOk=!1,console.error("[selfValidate] Qwen 3.5 SSM KO :",S)}}if(this.gemma4Ok){let P=(_,h)=>_.length===h.length&&_.every((y,k)=>Math.abs(y-h[k])<=.001*(1+Math.abs(h[k]))),G=async()=>{let _=globalThis,h=async(w,x)=>{let B=[],q=this.device.createCommandEncoder(),M=x(q,B),O=this.device.createBuffer({size:w*4,usage:_.GPUBufferUsage.COPY_DST|_.GPUBufferUsage.MAP_READ});q.copyBufferToBuffer(M,0,O,0,w*4),this.device.queue.submit([q.finish()]),await O.mapAsync(_.GPUMapMode.READ);let C=new Float32Array(O.getMappedRange().slice(0));return O.unmap(),O.destroy(),this.release(B),C},y=w=>{let x=this.storage(w.byteLength);return this.device.queue.writeBuffer(x,0,w),x};{let x=e(5120),B=.4453125,q=y(x),M=await h(5120,(O,C)=>this.recScale(O,C,q,B,5120));if(this.release([q]),!P(M,x.map(O=>O*B)))return"scale"}{let B=e(12288),q=new Float32Array(512).fill(1),M=y(B),O=y(q),C=await h(24*512,(R,E)=>this.recRmsnorm(R,E,M,O,24,512,1e-6));this.release([M,O]);let S=new Float32Array(24*512);for(let R=0;R<24;R++){let E=0;for(let N=0;N<512;N++)E+=B[R*512+N]**2;let W=1/Math.sqrt(E/512+1e-6);for(let N=0;N<512;N++)S[R*512+N]=B[R*512+N]*W}if(!P(C,S))return"rmsnorm(hd=512, poids 1)"}let k=this.attnWideOk;this.attnWideOk=!1;try{for(let w of[{hd:256,win:4,nT:3,past:5},{hd:512,win:0,nT:2,past:4},{hd:512,win:0,nT:1,past:9}]){let q=w.past+w.nT,M=e(w.nT*8*w.hd),O=e(q*2*w.hd),C=e(q*2*w.hd),S=y(M),R=y(O),E=y(C),W=await h(w.nT*8*w.hd,(N,I)=>this.recAttention(N,I,S,R,E,w.nT,8,2,w.hd,q,w.past,1,0,w.win));if(this.release([S,R,E]),!P(W,Se(M,O,C,w.nT,8,2,w.hd,w.past,1,0,w.win)))return`attention(hd=${w.hd}, fen\xEAtre=${w.win}, nT=${w.nT})`}}finally{this.attnWideOk=k}return null};try{let _=await G();_?(this.gemma4Ok=!1,console.error(`[selfValidate] Gemma 4 KO (${_}) : un mod\xE8le gemma4 refuserait de charger (non bloquant pour le reste).`)):console.log("[selfValidate] Gemma 4 OK (scale, rmsnorm hd 512, attention hd 256/512 fen\xEAtr\xE9e)")}catch(_){this.gemma4Ok=!1,console.error("[selfValidate] Gemma 4 KO :",_)}}if(this.moeOk){let P=globalThis,G=async(w,x,B)=>{let q=this.device.createBuffer({size:B*4,usage:P.GPUBufferUsage.COPY_DST|P.GPUBufferUsage.MAP_READ});w.copyBufferToBuffer(x,0,q,0,B*4),this.device.queue.submit([w.finish()]),await q.mapAsync(P.GPUMapMode.READ);let M=new Float32Array(q.getMappedRange().slice(0));return q.unmap(),q.destroy(),M},_=w=>{let x=this.storage(w.byteLength);return this.device.queue.writeBuffer(x,0,w),x},h=(w,x,B)=>{let q=w==="Q4_K"?144:210,M=x*B/256,O=new Uint8Array(M*q);for(let C=0;C<O.length;C++)O[C]=Math.random()*256|0;for(let C=0;C<M;C++){let S=new DataView(O.buffer,C*q);w==="Q4_K"?(S.setUint16(0,me(.01+Math.random()*.02),!0),S.setUint16(2,me(.005+Math.random()*.01),!0)):S.setUint16(208,me(.002+Math.random()*.004),!0)}return O},y=(w,x,B)=>{let q=0;for(let M of x)q=Math.max(q,Math.abs(M));return w.length===x.length&&w.every((M,O)=>Math.abs(M-x[O])<=B*(q+1))},k=async()=>{{let M=e(384).map(N=>N*4),O=_(M),C=[],S=this.device.createCommandEncoder(),R=this.recMoeRoute(S,C,O,3,128,8,1.5),E=await G(S,R.w,24);S=this.device.createCommandEncoder();let W=new Uint32Array((await G(S,R.ids,24)).buffer);this.release([...C,O]);for(let N=0;N<3;N++){let I=Array.from({length:128},(L,j)=>j).sort((L,j)=>M[N*128+j]-M[N*128+L]).slice(0,8),$=M[N*128+I[0]],D=I.map(L=>Math.exp(M[N*128+L]-$)),z=D.reduce((L,j)=>L+j,0);for(let L=0;L<8;L++){if(W[N*8+L]!==I[L])return`moe_route ids (t=${N}, j=${L})`;if(Math.abs(E[N*8+L]-D[L]/z*1.5)>1e-4)return`moe_route poids (t=${N}, j=${L})`}}}for(let[w,x,B,q,M]of[["Q4_K",1,2048,512,!0],["Q4_K",3,2048,512,!0],["Q6_K",1,512,2048,!1],["Q6_K",3,512,2048,!1]]){let S=x*4,R=h(w,12*q,B),E=w==="Q4_K"?et(R,12*q*B/256):Ve(R,12*q*B/256),W=new Uint32Array(S);for(let H=0;H<x;H++){let Y=Array.from({length:12},(J,te)=>te).sort(()=>Math.random()-.5);for(let J=0;J<4;J++)W[H*4+J]=Y[J]}let I=e((M?x:S)*B),$=new Float32Array(S*q);for(let H=0;H<S;H++){let Y=M?Math.floor(H/4):H,J=W[H];for(let te=0;te<q;te++){let re=0;for(let Z=0;Z<B;Z++)re+=I[Y*B+Z]*E[(J*q+te)*B+Z];$[H*q+te]=re}}let D=this.uploadKq(w,R),z=_(I),L=_(W),j=[],Q=this.device.createCommandEncoder(),X=this.recMoeGemv(Q,j,z,D,L,S,M?4:1,B,q),V=await G(Q,X,S*q);if(D.buf.destroy(),this.release([...j,z,L]),!y(V,$,.002))return`moe gemv ${w} T=${x} k=${B} n=${q}`}{let q=e(49152),M=e(24),O=_(q),C=_(M),S=[],R=this.device.createCommandEncoder(),E=await G(R,this.recMoeSum(R,S,O,C,3,8,2048),3*2048);this.release([...S,O,C]);let W=new Float32Array(3*2048);for(let N=0;N<3;N++)for(let I=0;I<2048;I++){let $=0;for(let D=0;D<8;D++)$+=q[(N*8+D)*2048+I]*M[N*8+D];W[N*2048+I]=$}if(!y(E,W,1e-4))return"moe_sum"}return null};try{let w=await k();w?(this.moeOk=!1,console.error(`[selfValidate] MoE KO (${w}) : un mod\xE8le \xE0 experts refuserait de charger (non bloquant pour le reste).`)):console.log("[selfValidate] MoE OK (routage top-K, GEMV d'experts Q4_K/Q6_K, somme pond\xE9r\xE9e)")}catch(w){this.moeOk=!1,console.error("[selfValidate] MoE KO :",w)}}if(this.moeOk&&this.moeGemmOk){let P=globalThis,G=k=>{let w=this.storage(k.byteLength);return this.device.queue.writeBuffer(w,0,k),w},_=(k,w,x)=>{let B=k==="Q4_K"?144:210,q=w*x/256,M=new Uint8Array(q*B);for(let O=0;O<M.length;O++)M[O]=Math.random()*256|0;for(let O=0;O<q;O++){let C=new DataView(M.buffer,O*B);k==="Q4_K"?(C.setUint16(0,me(.01+Math.random()*.02),!0),C.setUint16(2,me(.005+Math.random()*.01),!0)):C.setUint16(208,me(.002+Math.random()*.004),!0)}return M},h=(k,w,x)=>{let B=0;for(let q of w)B=Math.max(B,Math.abs(q));return k.length===w.length&&k.every((q,M)=>Math.abs(q-w[M])<=x*(B+1))},y=null;try{for(let[k,w,x,B]of[["Q4_K",2048,512,!0],["Q6_K",512,2048,!1],["Q4_K",512,130,!1]]){let S=_(k,16*x,w),R=k==="Q4_K"?et(S,16*x*w/256):Ve(S,16*x*w/256),E=new Uint32Array(160);for(let H=0;H<40;H++){let Y=Array.from({length:12},(J,te)=>te+1).sort(()=>Math.random()-.5);E[H*4]=0;for(let J=1;J<4;J++)E[H*4+J]=Y[J]}let W=e((B?40:160)*w),N=new Float32Array(160*x);for(let H=0;H<160;H++){let Y=B?Math.floor(H/4):H,J=E[H];for(let te=0;te<x;te++){let re=0;for(let Z=0;Z<w;Z++)re+=W[Y*w+Z]*R[(J*x+te)*w+Z];N[H*x+te]=re}}let I=this.uploadKq(k,S),$=G(W),D=G(E),z=[],L=this.device.createCommandEncoder(),j=this.recMoeGroup(L,z,D,160,16),Q=this.recMoeGemm(L,z,$,I,j,160,16,40,B?4:1,w,x),X=this.device.createBuffer({size:160*x*4,usage:P.GPUBufferUsage.COPY_DST|P.GPUBufferUsage.MAP_READ});L.copyBufferToBuffer(Q,0,X,0,160*x*4),this.device.queue.submit([L.finish()]),await X.mapAsync(P.GPUMapMode.READ);let V=new Float32Array(X.getMappedRange().slice(0));if(X.unmap(),X.destroy(),I.buf.destroy(),this.release([...z,$,D]),!h(V,N,.002)){y=`${k} k=${w} n=${x}`;break}}}catch(k){y=String(k)}y?(this.moeGemmOk=!1,console.error(`[selfValidate] GEMM MoE group\xE9 KO (${y}) : prefill MoE par GEMV par case.`)):console.log("[selfValidate] GEMM MoE group\xE9 OK (Q4_K/Q6_K, expert chaud sur deux tuiles, experts absents)")}if(this.k2hOk){let P=globalThis;try{for(let G of[1,3]){let w=e(G*4096),x=e(4096).map(E=>1+E),B=this.storage(w.byteLength),q=this.storage(x.byteLength);this.device.queue.writeBuffer(B,0,w),this.device.queue.writeBuffer(q,0,x);let M=[],O=this.device.createCommandEncoder(),C=this.recRmsnormGrouped(O,M,B,q,G,4096,4,1e-6),S=this.device.createBuffer({size:G*4096*4,usage:P.GPUBufferUsage.COPY_DST|P.GPUBufferUsage.MAP_READ});O.copyBufferToBuffer(C,0,S,0,G*4096*4),this.device.queue.submit([O.finish()]),await S.mapAsync(P.GPUMapMode.READ);let R=new Float32Array(S.getMappedRange().slice(0));S.unmap(),S.destroy(),this.release([...M,B,q]);for(let E=0;E<G&&this.k2hOk;E++)for(let W=0;W<4&&this.k2hOk;W++){let N=0;for(let $=0;$<1024;$++)N+=w[E*4096+W*1024+$]**2;let I=1/Math.sqrt(N/1024+1e-6);for(let $=0;$<1024;$++){let D=w[E*4096+W*1024+$]*I*x[W*1024+$];if(Math.abs(R[E*4096+W*1024+$]-D)>.001*(1+Math.abs(D))){this.k2hOk=!1;break}}}}this.k2hOk?console.log("[selfValidate] K2-Horizon OK (RMSNorm group\xE9e)"):console.error("[selfValidate] K2-Horizon KO (RMSNorm group\xE9e) : un mod\xE8le k2-horizon refuserait de charger.")}catch(G){this.k2hOk=!1,console.error("[selfValidate] K2-Horizon KO :",G)}}if(this.sparkOk){let P=(k,w)=>k.length===w.length&&k.every((x,B)=>Math.abs(x-w[B])<=.001*(1+Math.abs(w[B]))),G=globalThis,_=async(k,w)=>{let x=[],B=this.device.createCommandEncoder(),q=w(B,x),M=this.device.createBuffer({size:k*4,usage:G.GPUBufferUsage.COPY_DST|G.GPUBufferUsage.MAP_READ});B.copyBufferToBuffer(q,0,M,0,k*4),this.device.queue.submit([B.finish()]),await M.mapAsync(G.GPUMapMode.READ);let O=new Float32Array(M.getMappedRange().slice(0));return M.unmap(),M.destroy(),this.release(x),O},h=k=>{let w=this.storage(k.byteLength);return this.device.queue.writeBuffer(w,0,k),w},y=async()=>{{let q=e(12288),M=e(48),O=h(q),C=h(M),S=await _(12288,(R,E)=>this.recHeadGate(R,E,O,C,12288,256));if(this.release([O,C]),!P(S,q.map((R,E)=>R/(1+Math.exp(-M[Math.floor(E/256)])))))return"head_gate"}{let C=e(2048),S=h(C),R=await _(8*256,(N,I)=>this.recRopePartial(N,I,S,8,256,4,37,5e6,64));this.release([S]);let E=C.slice(),W=64/2;for(let N=0;N<8;N++){let I=37+Math.floor(N/4),$=N*256;for(let D=0;D<W;D++){let z=I/Math.pow(5e6,2*D/64),L=Math.cos(z),j=Math.sin(z);E[$+D]=C[$+D]*L-C[$+D+W]*j,E[$+D+W]=C[$+D+W]*L+C[$+D]*j}}if(!P(R,E))return"rope_partial(hd=256, nRot=64)"}return null};try{let k=await y();k?(this.sparkOk=!1,console.error(`[selfValidate] Spark-X2.5 KO (${k}) : un mod\xE8le spark2_5 refuserait de charger (non bloquant pour le reste).`)):console.log("[selfValidate] Spark-X2.5 OK (porte par t\xEAte, RoPE partiel 64/256)")}catch(k){this.sparkOk=!1,console.error("[selfValidate] Spark-X2.5 KO :",k)}}if(this.attnWideOk){let P=(y,k)=>y.length===k.length&&y.every((w,x)=>Math.abs(w-k[x])<=.001*(1+Math.abs(k[x]))),G=globalThis,_=y=>{let k=this.storage(y.byteLength);return this.device.queue.writeBuffer(k,0,y),k},h=null;try{for(let y of[{hd:256,nH:8,nKv:2,win:512,nT:1,past:700,sc:1,cap:0},{hd:512,nH:8,nKv:2,win:0,nT:1,past:130,sc:1,cap:0},{hd:512,nH:8,nKv:2,win:0,nT:5,past:70,sc:1,cap:0},{hd:256,nH:8,nKv:2,win:40,nT:7,past:90,sc:1,cap:0},{hd:256,nH:16,nKv:4,win:0,nT:3,past:66,sc:1/16,cap:0},{hd:256,nH:4,nKv:1,win:0,nT:2,past:10,sc:1/16,cap:5}]){let k=y.past+y.nT,w=e(y.nT*y.nH*y.hd),x=e(k*y.nKv*y.hd),B=e(k*y.nKv*y.hd),q=_(w),M=_(x),O=_(B),C=[],S=this.device.createCommandEncoder(),R=this.recAttention(S,C,q,M,O,y.nT,y.nH,y.nKv,y.hd,k,y.past,y.sc,y.cap,y.win),E=y.nT*y.nH*y.hd,W=this.device.createBuffer({size:E*4,usage:G.GPUBufferUsage.COPY_DST|G.GPUBufferUsage.MAP_READ});S.copyBufferToBuffer(R,0,W,0,E*4),this.device.queue.submit([S.finish()]),await W.mapAsync(G.GPUMapMode.READ);let N=new Float32Array(W.getMappedRange().slice(0));if(W.unmap(),W.destroy(),this.release([...C,q,M,O]),!P(N,Se(w,x,B,y.nT,y.nH,y.nKv,y.hd,y.past,y.sc,y.cap,y.win))){h=`hd=${y.hd} nT=${y.nT} past=${y.past} fen\xEAtre=${y.win}`;break}}}catch(y){h=String(y)}h?(this.attnWideOk=!1,console.error(`[selfValidate] attention large KO (${h}) : repli sur le kernel un-thread-par-t\xEAte.`)):console.log("[selfValidate] attention large OK (t\xEAtes 256/512, fen\xEAtre, GQA, softcap, d\xE9codage + prefill)")}if(this.kqOk){let P=globalThis,G=(y,k,w)=>{let x=y==="Q4_K"?144:210,B=k*w/256,q=new Uint8Array(B*x);for(let M=0;M<q.length;M++)q[M]=Math.random()*256|0;for(let M=0;M<B;M++){let O=new DataView(q.buffer,M*x);y==="Q4_K"?(O.setUint16(0,me(.01+Math.random()*.02),!0),O.setUint16(2,me(.005+Math.random()*.01),!0)):O.setUint16(208,me(.002+Math.random()*.004),!0)}return q},_=(y,k,w)=>{let x=0;for(let B of k)x=Math.max(x,Math.abs(B));return y.length===k.length&&y.every((B,q)=>Math.abs(B-k[q])<=w*(x+1))},h=null;try{for(let[y,k,w,x]of[["Q4_K",1,2560,37],["Q4_K",1,10240,5],["Q6_K",1,2560,37],["Q6_K",1,10240,5],["Q4_K",3,2560,9],["Q6_K",70,512,20]]){let B=G(y,x,w),q=y==="Q4_K"?et(B,x*w/256):Ve(B,x*w/256),M=e(k*w),O=new Float32Array(k*x);for(let $=0;$<k;$++)for(let D=0;D<x;D++){let z=0;for(let L=0;L<w;L++)z+=M[$*w+L]*q[D*w+L];O[$*x+D]=z}let C=this.uploadKq(y,B),S=this.storage(M.byteLength);this.device.queue.writeBuffer(S,0,M);let R=[],E=this.device.createCommandEncoder(),W=this.recMM(E,R,S,C,k,w,x,!1),N=this.device.createBuffer({size:k*x*4,usage:P.GPUBufferUsage.COPY_DST|P.GPUBufferUsage.MAP_READ});E.copyBufferToBuffer(W,0,N,0,k*x*4),this.device.queue.submit([E.finish()]),await N.mapAsync(P.GPUMapMode.READ);let I=new Float32Array(N.getMappedRange().slice(0));if(N.unmap(),N.destroy(),C.buf.destroy(),this.release([...R,S]),!_(I,O,k===1?.002:.02)){h=`${y} m=${k} k=${w} n=${x}`;break}}}catch(y){h=String(y)}h?(this.kqOk=!1,console.error(`[selfValidate] poids K-quant natifs KO (${h}) : requantification int8.`)):console.log("[selfValidate] poids K-quant natifs OK (GEMV Q4_K/Q6_K, prefill via int8)")}{let P=globalThis,G=async(h,y,k,w,x,B)=>{let q=this.storage(y.byteLength);this.device.queue.writeBuffer(q,0,y);let M=this.storage(k.byteLength);this.device.queue.writeBuffer(M,0,k);let O=this.uniform([w,x,B?.hd??1,B?.nk??1,B?.rep??1]),C=this.storage(w*x*4),S=this.device.createCommandEncoder();this.recordPass(S,h,[O,q,M,C],h==="hadamard_rows"?[x/1024,w,1]:this.grid1D(w*x));let R=this.device.createBuffer({size:w*x*4,usage:P.GPUBufferUsage.COPY_DST|P.GPUBufferUsage.MAP_READ});S.copyBufferToBuffer(C,0,R,0,w*x*4),this.device.queue.submit([S.finish()]),await R.mapAsync(P.GPUMapMode.READ);let E=new Float32Array(R.getMappedRange().slice(0));return R.unmap(),R.destroy(),this.release([q,M,O,C]),E},_=async h=>{for(let[y,k,w]of[[1,5120,void 0],[3,6144,{hd:128,nk:16,rep:3}],[2,17408,void 0]]){let x=Float32Array.from({length:y*k},()=>Math.random()*2-1),B=Float32Array.from({length:k},()=>Math.random()<.5?-1:1),q=ki(x,y,k,B,w),M=await G(h,x,B,y,k,w);for(let O=0;O<q.length;O++)if(!(Math.abs(M[O]-q[O])<=1e-4*(1+Math.abs(q[O]))))return`T=${y} W=${k}${w?" (perm)":""} : [${O}] ${M[O]} au lieu de ${q[O]}`}return null};try{let h=await _("hadamard_rows_naive");if(h)this.hadamardOk=!1,this.fwhtOk=!1,console.error(`[selfValidate] rotation de Hadamard KO (${h}) : un mod\xE8le \xE0 poids repli\xE9s refusera de charger.`);else if(this.fwhtOk){let y=await _("hadamard_rows");y?(this.fwhtOk=!1,console.error(`[selfValidate] FWHT KO (${y}) : repli sur le kernel na\xEFf.`)):console.log("[selfValidate] rotation de Hadamard OK (FWHT, 5 120 / 6 144 permut\xE9e / 17 408)")}}catch(h){this.hadamardOk=!1,this.fwhtOk=!1,console.error("[selfValidate] rotation de Hadamard KO :",h)}}if(this.pq2NativeOk){let P=globalThis,G=(h,y,k)=>{let w=0;for(let x of y)w=Math.max(w,Math.abs(x));return h.length===y.length&&h.every((x,B)=>Math.abs(x-y[B])<=k*(w+1))},_=null;try{for(let[h,y,k]of[[1,2560,37],[1,9728,5],[1,2048,13],[1,384,7],[3,2560,9]]){let w=k*y/128,x=new Uint8Array(w*34);for(let $=0;$<x.length;$++)x[$]=Math.random()*256|0;let B=new DataView(x.buffer);for(let $=0;$<w;$++)B.setUint16($*34,me(.01+Math.random()*.02),!0);let q=We(x,w),M=e(h*y),O=new Float32Array(h*k);for(let $=0;$<h;$++)for(let D=0;D<k;D++){let z=0;for(let L=0;L<y;L++)z+=M[$*y+L]*q[D*y+L];O[$*k+D]=z}let C=this.uploadKq("PQ2_0",x),S=this.storage(M.byteLength);this.device.queue.writeBuffer(S,0,M);let R=[],E=this.device.createCommandEncoder(),W=this.recMM(E,R,S,C,h,y,k,!1),N=this.device.createBuffer({size:h*k*4,usage:P.GPUBufferUsage.COPY_DST|P.GPUBufferUsage.MAP_READ});E.copyBufferToBuffer(W,0,N,0,h*k*4),this.device.queue.submit([E.finish()]),await N.mapAsync(P.GPUMapMode.READ);let I=new Float32Array(N.getMappedRange().slice(0));if(N.unmap(),N.destroy(),C.buf.destroy(),this.release([...R,S]),!G(I,O,h===1?.002:.02)){_=`m=${h} k=${y} n=${k}`;break}}}catch(h){_=String(h)}_?(this.pq2NativeOk=!1,console.error(`[selfValidate] poids PQ2_0 natifs KO (${_}) : requantification int8.`)):console.log("[selfValidate] poids PQ2_0 natifs OK (GEMV ternaire, prefill via int8)")}if(this.gemvMOk){let P=globalThis,G=null;try{for(let[_,h,y,k]of[["q8",1,2560,37],["q8",2,2560,37],["q4k",2,10240,7],["q8",2,10240,7],["q8",8,10240,5],["q4k",1,2560,29],["q4k",3,2560,29],["q4k",8,10240,5],["q8",5,2560,11],["q4",1,2560,33],["q4",4,10240,6]]){let w,x;if(_==="q4"){x=e(k*y);let N=this.uploadGpu(x);w=this.f32ToQ4Gpu(N,k*y),N.destroy?.(),x=ye(Te(x))}else if(_==="q8"){x=e(k*y);let N=this.uploadGpu(x);w=this.f32ToQ8Gpu(N,k*y),N.destroy?.(),x=ke(qe(x))}else{let N=k*y/256,I=new Uint8Array(N*144);for(let $=0;$<I.length;$++)I[$]=Math.random()*256|0;for(let $=0;$<N;$++){let D=new DataView(I.buffer,$*144);D.setUint16(0,me(.01+Math.random()*.02),!0),D.setUint16(2,me(.005+Math.random()*.01),!0)}x=et(I,N),w=this.uploadKq("Q4_K",I)}let B=e(h*y),q=new Float32Array(h*k);for(let N=0;N<h;N++)for(let I=0;I<k;I++){let $=0;for(let D=0;D<y;D++)$+=B[N*y+D]*x[I*y+D];q[N*k+I]=$}let M=this.storage(B.byteLength);this.device.queue.writeBuffer(M,0,B);let O=[],C=this.device.createCommandEncoder(),S=this.recMM(C,O,M,w,h,y,k,!1),R=this.device.createBuffer({size:h*k*4,usage:P.GPUBufferUsage.COPY_DST|P.GPUBufferUsage.MAP_READ});C.copyBufferToBuffer(S,0,R,0,h*k*4),this.device.queue.submit([C.finish()]),await R.mapAsync(P.GPUMapMode.READ);let E=new Float32Array(R.getMappedRange().slice(0));R.unmap(),R.destroy(),yi(w),this.release([...O,M]);let W=0;for(let N of q)W=Math.max(W,Math.abs(N));if(!E.every((N,I)=>Math.abs(N-q[I])<=.002*(W+1))){G=`${_} m=${h} k=${y} n=${k}`;break}}}catch(_){G=String(_)}G?(this.gemvMOk=!1,console.error(`[selfValidate] GEMV 4 colonnes KO (${G}) : repli sur matmul_t_*_vec (m = 1) et les kernels de prefill (m \u2265 2).`)):console.log("[selfValidate] GEMV 4 colonnes OK (int8, q4, Q4_K natif, m = 1 \xE0 8)")}let T=await this.validateDiffusion();T?console.warn("[selfValidate] image-gen primitive KO:",T,"(non bloquant: chemin texte intact)"):console.log(`[selfValidate] image-gen primitives OK (silu, group_norm, conv2d, conv2d_direct, conv2d_direct_q8/q4, conv 3\xD73 tuil\xE9 q8/q4 ${this.convTiledQOk?"OK":"KO (repli direct)"}, relu, upsample_nearest, layernorm, quick_gelu, attention_full)`);let K=await this.validateVideoResident();return K?(this.videoResidentOk=!1,console.warn("[selfValidate] motion r\xE9sident KO:",K,", repli JS+readback (plus lent, m\xEAme r\xE9sultat).")):console.log("[selfValidate] motion r\xE9sident OK (video_motion_gather, video_motion_scatter, video_add_pe, attn_temporal)"),!0}async validateVideoResident(){let t=o=>Float32Array.from({length:o},()=>Math.random()*2-1),r=(o,u,c=.005)=>o.length===u.length&&o.every((l,d)=>Math.abs(l-u[d])<=c*(1+Math.abs(u[d])));{let o=t(120),u=new Float32Array(120);for(let d=0;d<5;d++)for(let p=0;p<3;p++)for(let g=0;g<8;g++)u[(d*3+p)*8+g]=o[(p*8+g)*5+d];let c=this.recordingSession(),l=await c.finish(c.videoGather(o,3,8,5),120);if(!r(l,u,1e-6))return"video_motion_gather"}{let o=t(120),u=t(120),c=new Float32Array(120);for(let p=0;p<3;p++)for(let g=0;g<8;g++)for(let m=0;m<5;m++)c[(p*8+g)*5+m]=o[(m*3+p)*8+g]+u[(p*8+g)*5+m];let l=this.recordingSession(),d=await l.finish(l.videoScatter(o,u,3,8,5),120);if(!r(d,c,1e-6))return"video_motion_scatter"}{let o=t(120),u=t(24),c=new Float32Array(120);for(let p=0;p<5;p++)for(let g=0;g<3;g++)for(let m=0;m<8;m++)c[(p*3+g)*8+m]=o[(p*3+g)*8+m]+u[g*8+m];let l=this.recordingSession(),d=await l.finish(l.videoAddPe(o,u,3,8,5),120);if(!r(d,c,1e-6))return"video_add_pe"}{let o=t(120),u=t(120),c=t(120),l=1/Math.sqrt(4),d=new Float32Array(120);for(let m=0;m<5;m++)for(let b=0;b<2;b++){let v=b*4,U=m*3;for(let A=0;A<3;A++){let F=(U+A)*8+v,T=new Float32Array(3),K=-1e30;for(let G=0;G<3;G++){let _=0,h=(U+G)*8+v;for(let y=0;y<4;y++)_+=o[F+y]*u[h+y];T[G]=_*l,T[G]>K&&(K=T[G])}let P=0;for(let G=0;G<3;G++)T[G]=Math.exp(T[G]-K),P+=T[G];for(let G=0;G<3;G++){let _=T[G]/P,h=(U+G)*8+v;for(let y=0;y<4;y++)d[F+y]+=_*c[h+y]}}}let p=this.recordingSession(),g=await p.finish(p.attnTemporal(o,u,c,5,3,2,4),120);if(!r(g,d))return"attn_temporal"}return null}async validateDiffusion(){let t=L=>Float32Array.from({length:L},()=>Math.random()*2-1),r=(L,j,Q=.005)=>L.length===j.length&&L.every((X,V)=>Math.abs(X-j[V])<=Q*(1+Math.abs(j[V]))),e=t(70),n=e.map(L=>L/(1+Math.exp(-L)));if(!r(await this.silu(e),n))return"silu";let s=4,i=5,a=2,o=1e-5,u=t(s*i),c=t(s),l=t(s),d=new Float32Array(s*i),p=s/a;for(let L=0;L<a;L++){let j=L*p*i,Q=p*i,X=0;for(let Y=0;Y<Q;Y++)X+=u[j+Y];X/=Q;let V=0;for(let Y=0;Y<Q;Y++){let J=u[j+Y]-X;V+=J*J}V/=Q;let H=1/Math.sqrt(V+o);for(let Y=0;Y<Q;Y++){let J=L*p+Math.floor(Y/i);d[j+Y]=(u[j+Y]-X)*H*c[J]+l[J]}}if(!r(await this.groupNorm(u,c,l,s,i,a,o),d))return"group_norm";let g=2,m=4,b=4,v=3,U=3,A=1,F=1,T=4,K=4,P=t(g*m*b),G=t(v*g*U*U),_=t(v),h=new Float32Array(v*T*K);for(let L=0;L<v;L++)for(let j=0;j<T;j++)for(let Q=0;Q<K;Q++){let X=_[L];for(let V=0;V<g;V++)for(let H=0;H<U;H++)for(let Y=0;Y<U;Y++){let J=j*A+H-F,te=Q*A+Y-F;J>=0&&J<m&&te>=0&&te<b&&(X+=P[V*m*b+J*b+te]*G[((L*g+V)*U+H)*U+Y])}h[(L*T+j)*K+Q]=X}if(!r(await this.conv2d(P,G,_,g,m,b,v,U,U,A,F),h))return"conv2d";if(!r(await this.conv2dDirect(P,G,_,g,m,b,v,U,U,A,F),h))return"conv2d_direct";{let V=t(1200),H=t(108),Y=t(4),J=await this.conv2dDirect(V,H,Y,3,20,20,4,3,3,1,1),te=this.convTiledOk;this.convTiledOk=!0;let re=this.recordingSession(),Z=await re.finish(re.conv2d(V,H,Y,3,20,20,4,3,3,1,1),1600);this.convTiledOk=te,r(Z,J)||(this.convTiledOk=!1,console.warn("[selfValidate] conv2d_3x3_tiled KO sur ce GPU : repli sur conv2d_direct (plus lent, m\xEAme r\xE9sultat)."))}let y=this.convGemmOk;this.convGemmOk=!1;{let Q=t(8*m*b),X=t(32*U*U),V=t(4),H=qe(X),Y=await this.conv2dDirect(Q,ke(H),V,8,m,b,4,U,U,A,F),J={codes:this.uploadGpuRaw(new Uint8Array(H.codes.buffer,H.codes.byteOffset,H.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(H.scales.buffer,H.scales.byteOffset,H.scales.byteLength))},te=this.convTiledQOk;this.convTiledQOk=!1;let re=this.recordingSession(),Z=await re.finish(re.conv2d(Q,J,V,8,m,b,4,U,U,A,F),4*m*b);if(this.convTiledQOk=te,this.releaseGpu([J.codes,J.sc]),!r(Z,Y))return"conv2d_direct_q8"}{let Q=t(8*m*b),X=t(32*U*U),V=t(4),H=Te(X),Y=await this.conv2dDirect(Q,ye(H),V,8,m,b,4,U,U,A,F),J={nib:this.uploadGpuRaw(H.nibbles),sc:this.uploadGpuRaw(new Uint8Array(H.scales.buffer,H.scales.byteOffset,H.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(H.mins.buffer,H.mins.byteOffset,H.mins.byteLength))},te=this.convTiledQOk;this.convTiledQOk=!1;let re=this.recordingSession(),Z=await re.finish(re.conv2d(Q,J,V,8,m,b,4,U,U,A,F),4*m*b);if(this.convTiledQOk=te,this.releaseGpu([J.nib,J.sc,J.mn]),!r(Z,Y))return"conv2d_direct_q4"}{let V=t(16e3),H=t(480),Y=t(12),J=this.convTiledQOk;for(let te of["q8","q4"]){let re=te==="q8"?(()=>{let ee=qe(H);return{deq:ke(ee),gpu:{codes:this.uploadGpuRaw(new Uint8Array(ee.codes.buffer,ee.codes.byteOffset,ee.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(ee.scales.buffer,ee.scales.byteOffset,ee.scales.byteLength))}}})():(()=>{let ee=Te(H);return{deq:ye(ee),gpu:{nib:this.uploadGpuRaw(ee.nibbles),sc:this.uploadGpuRaw(new Uint8Array(ee.scales.buffer,ee.scales.byteOffset,ee.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(ee.mins.buffer,ee.mins.byteOffset,ee.mins.byteLength))}}})(),Z=await this.conv2dDirect(V,re.deq,Y,40,20,20,12,1,1,1,0);this.convTiledQOk=!0;let oe=this.recordingSession(),ne=await oe.finish(oe.conv2d(V,re.gpu,Y,40,20,20,12,1,1,1,0),4800);if(this.releaseGpu(Object.values(re.gpu)),!r(ne,Z)){J&&console.warn(`[selfValidate] conv2d_1x1_${te} KO sur ce GPU : repli sur conv2d_direct_${te}.`),this.convTiledQOk=!1;break}}this.convTiledQOk=this.convTiledQOk&&J}{let V=t(3200),H=t(288),Y=t(4),J=this.convTiledQOk;for(let te of["q8","q4"]){let re=te==="q8"?(()=>{let ee=qe(H);return{deq:ke(ee),gpu:{codes:this.uploadGpuRaw(new Uint8Array(ee.codes.buffer,ee.codes.byteOffset,ee.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(ee.scales.buffer,ee.scales.byteOffset,ee.scales.byteLength))}}})():(()=>{let ee=Te(H);return{deq:ye(ee),gpu:{nib:this.uploadGpuRaw(ee.nibbles),sc:this.uploadGpuRaw(new Uint8Array(ee.scales.buffer,ee.scales.byteOffset,ee.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(ee.mins.buffer,ee.mins.byteOffset,ee.mins.byteLength))}}})(),Z=await this.conv2dDirect(V,re.deq,Y,8,20,20,4,3,3,1,1);this.convTiledQOk=!0;let oe=this.recordingSession(),ne=await oe.finish(oe.conv2d(V,re.gpu,Y,8,20,20,4,3,3,1,1),1600);if(this.releaseGpu(Object.values(re.gpu)),!r(ne,Z)){J&&console.warn(`[selfValidate] conv2d_3x3_tiled_${te} KO sur ce GPU : repli sur conv2d_direct_${te} (plus lent, m\xEAme r\xE9sultat).`),this.convTiledQOk=!1;break}}this.convTiledQOk=this.convTiledQOk&&J}{let V=t(3200),H=t(288),Y=t(4),J=this.convS2Ok,te=Math.floor(19/2)+1,re=Math.floor(19/2)+1;for(let Z of["q8","q4"]){let oe=Z==="q8"?(()=>{let se=qe(H);return{deq:ke(se),gpu:{codes:this.uploadGpuRaw(new Uint8Array(se.codes.buffer,se.codes.byteOffset,se.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(se.scales.buffer,se.scales.byteOffset,se.scales.byteLength))}}})():(()=>{let se=Te(H);return{deq:ye(se),gpu:{nib:this.uploadGpuRaw(se.nibbles),sc:this.uploadGpuRaw(new Uint8Array(se.scales.buffer,se.scales.byteOffset,se.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(se.mins.buffer,se.mins.byteOffset,se.mins.byteLength))}}})(),ne=await this.conv2dDirect(V,oe.deq,Y,8,20,20,4,3,3,2,1);this.convS2Ok=!0;let ee=this.recordingSession(),le=await ee.finish(ee.conv2d(V,oe.gpu,Y,8,20,20,4,3,3,2,1),4*te*re);if(this.releaseGpu(Object.values(oe.gpu)),!r(le,ne)){J&&console.warn(`[selfValidate] conv2d_3x3_s2_tiled_${Z} KO sur ce GPU : repli sur direct.`),this.convS2Ok=!1;break}}this.convS2Ok=this.convS2Ok&&J}if(this.convGemmOk=y,this.convGemmOk){for(let[L,j,Q,X,V,H,Y]of[[8,20,20,12,3,1,1],[8,20,20,12,3,2,1],[40,20,20,12,1,1,0],[32,18,18,136,3,1,1],[4,12,12,8,3,1,1]]){let J=t(L*j*Q),te=t(X*L*V*V),re=t(X),Z=qe(te),oe=Math.floor((j+2*Y-V)/H)+1,ne=Math.floor((Q+2*Y-V)/H)+1,ee=await this.conv2dDirect(J,ke(Z),re,L,j,Q,X,V,V,H,Y),le={codes:this.uploadGpuRaw(new Uint8Array(Z.codes.buffer,Z.codes.byteOffset,Z.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(Z.scales.buffer,Z.scales.byteOffset,Z.scales.byteLength))},se=this.recordingSession(),fe=await se.finish(se.conv2d(J,le,re,L,j,Q,X,V,V,H,Y),X*oe*ne);if(this.releaseGpu([le.codes,le.sc]),!r(fe,ee)){console.warn(`[selfValidate] conv2d_igemm_q8 KO (${L}\u2192${X}, ${V}\xD7${V}/${H}) : repli sur les kernels tuil\xE9s.`),this.convGemmOk=!1;break}}this.convGemmOk&&console.log("[selfValidate] convolution q8 en GEMM implicite OK (3\xD73, stride 2, 1\xD71, Cin = 4)")}if(this.ltxOk){let L=null;try{let H=t(84),Y=t(84),J=t(84),te=t(147),re=new Float32Array(84);for(let ne=0;ne<3;ne++)for(let ee=0;ee<7;ee++){let le=new Float32Array(7),se=-1/0;for(let ae=0;ae<7;ae++){let Oe=0;for(let Ge=0;Ge<4;Ge++)Oe+=H[ee*12+ne*4+Ge]*Y[ae*12+ne*4+Ge];le[ae]=Oe+te[(ne*7+ee)*7+ae],se=Math.max(se,le[ae])}let fe=0;for(let ae=0;ae<7;ae++)le[ae]=Math.exp(le[ae]-se),fe+=le[ae];for(let ae=0;ae<4;ae++){let Oe=0;for(let Ge=0;Ge<7;Ge++)Oe+=le[Ge]*J[Ge*12+ne*4+ae];re[ee*12+ne*4+ae]=Oe/fe}}let Z=this.recordingSession(),oe=await Z.finish(Z.attentionBias(H,Y,J,te,7,3,4),84);r(oe,re)||(L="attention_bias")}catch(j){L=String(j)}L&&(this.ltxOk=!1,console.warn(`[selfValidate] attention T5 KO (${L}) : briques LTX coup\xE9es.`))}if(this.ltxOk){let L=null;try{let V=t(60),H=t(60),Y=t(72),J=t(30),te=t(30),re=async(ne,ee)=>{let le=this.recordingSession();return le.finish(ne(le),ee)},Z=new Float32Array(60);for(let ne=0;ne<30;ne++)Z[2*ne]=V[2*ne]*J[ne]-V[2*ne+1]*te[ne],Z[2*ne+1]=V[2*ne+1]*J[ne]+V[2*ne]*te[ne];let oe=[["rope_ltx",re(ne=>ne.ropeLtx(V,J,te,5,12),60),Z],["modulate",re(ne=>ne.ltxModulate(V,Y,5,12,12,24),60),V.map((ne,ee)=>ne*(1+Y[24+ee%12])+Y[12+ee%12])],["gated_add",re(ne=>ne.ltxGatedAdd(V,H,Y,5,12,60),60),V.map((ne,ee)=>ne+Y[60+ee%12]*H[ee])]];for(let[ne,ee,le]of oe)if(!r(await ee,le)){L=ne;break}}catch(j){L=String(j)}L&&(this.ltxOk=!1,console.warn(`[selfValidate] transformeur LTX KO (${L}) : briques coup\xE9es.`))}if(this.ltxOk){let L=null;try{let j=async(Q,X)=>{let V=this.recordingSession();return V.finish(Q(V),X)};for(let[Q,X,V,H,Y]of[[32,3,5,6,12],[64,2,4,4,136]]){let J=t(Q*X*V*H),te=t(Y*Q*27),re=t(Y),Z=qe(te),oe={codes:this.uploadGpuRaw(new Uint8Array(Z.codes.buffer,Z.codes.byteOffset,Z.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(Z.scales.buffer,Z.scales.byteOffset,Z.scales.byteLength))},ne=await j(ee=>ee.conv3d(J,oe,re,Q,X,V,H,Y),Y*X*V*H);if(this.releaseGpu([oe.codes,oe.sc]),!r(ne,xi(J,ke(Z),re,Q,X,V,H,Y))){L=`conv3d ${Q}\u2192${Y}`;break}}if(!L){let J=t(480),te=t(32),re=t(3840),Z=t(960),oe=[["norm_act",j(ne=>ne.ltxNormAct(J,te,8,60,16,24,1e-8),480),_i(J,te,8,60,16,24,1e-8)],["d2s+res",j(ne=>ne.ltxD2s(re,Z,8,3,4,5,16),640*5),Tn(re,Z,8,3,4,5,16)],["d2s",j(ne=>ne.ltxD2s(re,null,8,3,4,5,0),640*5),Tn(re,null,8,3,4,5,0)],["unpatchify",j(ne=>ne.ltxUnpatchify(re.subarray(0,2880),3,3,4,5),576*5),Ai(re.subarray(0,2880),3,3,4,5)]];for(let[ne,ee,le]of oe)if(!r(await ee,le)){L=ne;break}}}catch(j){L=String(j)}L?(this.ltxOk=!1,console.warn(`[selfValidate] d\xE9codeur LTX KO (${L}) : briques coup\xE9es.`)):console.log("[selfValidate] briques du d\xE9codeur LTX OK (conv3d GEMM implicite q8, norme+AdaLN+SiLU, depth-to-space \xD72 avec r\xE9sidu, d\xE9patchification)")}if(this.rifeOk){let L=null;try{let H=t(90),Y=t(90),J=t(3),te=t(384),re=t(6),Z=new Float32Array(120).map(()=>(Math.random()-.5)*8),oe=t(30),ne=se=>1/(1+Math.exp(-se)),ee=async(se,fe)=>{let ae=this.recordingSession();return ae.finish(se(ae),fe)},le=[["act",ee(se=>se.rifeAct(H,90,1.7,!0),90),H.map(se=>{let fe=se*1.7;return fe<0?fe*.2:fe})],["resconv",ee(se=>se.rifeResconv(H,Y,J,3,30),90),H.map((se,fe)=>{let ae=se*J[Math.floor(fe/30)]+Y[fe];return ae<0?ae*.2:ae})],["convT",ee(se=>se.convTranspose2d(H.subarray(0,24),te,re,4,2,3,6,4,2,1),144),Pi(H.subarray(0,24),te,re,4,2,3,6,4,2,1)],["pixelShuffle",ee(se=>se.pixelShuffle2(H.subarray(0,24),2,3,1),24),Gi(H.subarray(0,24),2,3,1)],["resize\xD74",ee(se=>se.resizeBilinear(H,3,6,5,24,20),1440),Rn(H,3,6,5,24,20)],["resize\xF72",ee(se=>se.resizeBilinear(H,3,6,5,6/2,Math.floor(5/2)),3*(6/2)*Math.floor(5/2)),Rn(H,3,6,5,6/2,Math.floor(5/2))],["warp",ee(se=>se.warp(H,Z,3,6,5,2),90),Ui(H,Z,3,6,5,2)],["blend",ee(se=>se.rifeBlend(H,Y,oe,3,30),90),H.map((se,fe)=>{let ae=ne(oe[fe%30]);return se*ae+Y[fe]*(1-ae)})]];for(let[se,fe,ae]of le)if(!r(await fe,ae)){L=se;break}}catch(j){L=String(j)}L?(this.rifeOk=!1,console.warn(`[selfValidate] RIFE KO (${L}) : clips sans interpolation.`)):console.log("[selfValidate] briques RIFE OK (convT, pixel shuffle, resize bilin\xE9aire \xD74/\xF72, warp border, resconv, blend)")}if(this.hasSubgroups&&this.subgroupsOk)try{let Q=t(1500),X=t(300),V=r(await this.rmsnormVec(Q,X,5,300,1e-5,!1,"rmsnorm_vec_subgroup"),await this.rmsnormVec(Q,X,5,300,1e-5,!1)),H=8,Y=130,J=4,te=t(H*Y),re=t(H),Z=t(H),oe=r(await this.groupNorm(te,re,Z,H,Y,J,1e-5,"group_norm_subgroup"),await this.groupNorm(te,re,Z,H,Y,J));if(!V||!oe){let ne=[!V&&"rmsnorm_vec_subgroup",!oe&&"group_norm_subgroup"].filter(Boolean).join(" + ");console.warn(`[selfValidate] ${ne} KO sur ce GPU : repli sur la r\xE9duction en m\xE9moire partag\xE9e.`),this.subgroupsOk=!1}}catch(L){console.warn("[selfValidate] subgroups indisponibles \xE0 l'ex\xE9cution : repli sur la m\xE9moire partag\xE9e.",L),this.subgroupsOk=!1}{let j=t(66),Q=new Uint16Array(66);for(let Y=0;Y<66;Y++)Q[Y]=me(j[Y]);let X=new Float32Array(66);for(let Y=0;Y<66;Y++)X[Y]=Pe(Q[Y]);let V=this.f16ToF32Gpu(new Uint8Array(Q.buffer,Q.byteOffset,Q.byteLength),66),H=await this.readGpu(V,66);if(V.destroy?.(),!r(H,X,1e-6))return"f16_to_f32"}let k=t(70);if(!r(await this.relu(k),k.map(L=>Math.max(L,0))))return"relu";let w=2,x=2,B=2,q=2,M=x*q,O=B*q,C=t(w*x*B),S=new Float32Array(w*M*O);for(let L=0;L<w;L++)for(let j=0;j<M;j++)for(let Q=0;Q<O;Q++)S[L*M*O+j*O+Q]=C[L*x*B+Math.floor(j/q)*B+Math.floor(Q/q)];if(!r(await this.upsampleNearest(C,w,x,B,q),S))return"upsample_nearest";let R=2,E=8,W=1e-5,N=t(R*E),I=t(E),$=t(E),D=new Float32Array(R*E);for(let L=0;L<R;L++){let j=L*E,Q=0;for(let H=0;H<E;H++)Q+=N[j+H];Q/=E;let X=0;for(let H=0;H<E;H++){let Y=N[j+H]-Q;X+=Y*Y}X/=E;let V=1/Math.sqrt(X+W);for(let H=0;H<E;H++)D[j+H]=(N[j+H]-Q)*V*I[H]+$[H]}if(!r(await this.layernorm(N,I,$,R,E,W),D))return"layernorm";let z=t(70);if(!r(await this.quickGelu(z),z.map(L=>L/(1+Math.exp(-1.702*L)))))return"quick_gelu";{let H=1/Math.sqrt(4),Y=t(24),J=t(40),te=t(40),re=new Float32Array(24);for(let Z=0;Z<2;Z++)for(let oe=0;oe<3;oe++){let ne=new Float32Array(5),ee=-1/0;for(let se=0;se<5;se++){let fe=0;for(let ae=0;ae<4;ae++)fe+=Y[oe*8+Z*4+ae]*J[se*8+Z*4+ae];ne[se]=fe*H,ne[se]>ee&&(ee=ne[se])}let le=0;for(let se=0;se<5;se++)ne[se]=Math.exp(ne[se]-ee),le+=ne[se];for(let se=0;se<4;se++){let fe=0;for(let ae=0;ae<5;ae++)fe+=ne[ae]/le*te[ae*8+Z*4+se];re[oe*8+Z*4+se]=fe}}if(!r(await this.attentionFull(Y,J,te,3,2,2,4,5),re))return"attention_full"}if(this.attnFlashOk&&this.attnFullWgOk){let L=null;try{for(let[j,Q,X,V,H]of[[130,130,3,3,0],[70,37,4,2,0],[64,200,2,2,30]]){let J=t(j*X*64),te=t(Q*V*64),re=t(Q*V*64),Z=await this.attentionFullDirect(J,te,re,j,X,V,64,Q,H,!0),oe=await this.attentionFullDirect(J,te,re,j,X,V,64,Q,H,!1);if(!r(Z,oe)){L=`nT=${j} kv=${Q} nH=${X}/${V} softcap=${H}`;break}}}catch(j){L=String(j)}L?(this.attnFlashOk=!1,console.warn(`[selfValidate] attention flash KO (${L}) : repli attention_full_wg.`)):console.log("[selfValidate] attention tuil\xE9e flash OK (headDim 64, bords, crois\xE9e, GQA, softcap)")}if(this.attnFullWgOk){let L=[{nT:70,kvL:70,nH:5,hd:64},{nT:16,kvL:77,nH:5,hd:64},{nT:9,kvL:9,nH:8,hd:160}];for(let j of L){let Q=j.nH*j.hd,X=t(j.nT*Q),V=t(j.kvL*Q),H=t(j.kvL*Q),Y=await this.attentionFull(X,V,H,j.nT,j.nH,j.nH,j.hd,j.kvL),J=await this.attentionFullWg(X,V,H,j.nT,j.nH,j.nH,j.hd,j.kvL);if(!r(J,Y)){this.attnFullWgOk=!1,console.warn(`[selfValidate] attention_full_wg KO sur ce GPU (hd=${j.hd}, kv=${j.kvL}) : repli sur attention_full (plus lent, m\xEAme r\xE9sultat).`);break}}}return null}};ue.timingOn=(()=>{try{return ie("timing")==="1"}catch{return!1}})(),ue.profileOn=(()=>{try{return ie("gpuprofile")==="1"}catch{return!1}})(),ue.MAX_WG_DIM=65535,ue.BLOCK_ELEMS={Q4_K:256,Q5_K:256,Q6_K:256,Q8_0:32,Q5_0:32,Q4_0:32,Q3_K:256,Q4_1:32,PQ2_0:128,F32:1,F16:1},ue.DEQUANT_SHADER={Q4_K:"dequant_q4k",Q8_0:"dequant_q8_0",Q5_0:"dequant_q5_0",Q6_K:"dequant_q6k",Q4_0:"dequant_q4_0",Q5_K:"dequant_q5k",Q3_K:"dequant_q3k",Q4_1:"dequant_q4_1",PQ2_0:"dequant_pq2_0"},ue.STORAGE_USAGE=140;$t=ue});function Kn(f,t){let r=new DataView(f.buffer,f.byteOffset,f.byteLength),e=new Float32Array(t);for(let n=0;n<t;n++)e[n]=we(r.getUint16(n*2,!0));return e}function En(f,t){let r=new DataView(f.buffer,f.byteOffset,f.byteLength),e=new Float32Array(t);for(let n=0;n<t;n++)e[n]=r.getFloat32(n*4,!0);return e}function Gt(f,t,r,e){let n=0;for(let a=0;a<r;a++)n+=f[a]*f[a];let s=1/Math.sqrt(n/r+e),i=new Float32Array(r);for(let a=0;a<r;a++)i[a]=f[a]*s*t[a];return i}var Fi,tt,Wt,Hn=ce(()=>{"use strict";wt();kt();yt();ot();Fi=f=>f/(1+Math.exp(-f)),tt=class tt{constructor(t,r,e){this.engine=t;this.manifest=r;this.raw=e;this.w=new Map;this.g=new Map;this.pos=0;this.rLayers=[];this.tokNormGpu=null;this.normBufs=[];this.ffn=0;this.residentLock=Promise.resolve()}isBigProj(t){return/\.(shortconv\.(in_proj|out_proj)|attn_(q|k|v|output)|ffn_(gate|up|down))\.weight$/.test(t)}async load(t){if(!this.engine.lfm2ShortConvOk)throw new Error("kernel shortconv LFM2 invalid\xE9 sur ce GPU (selfValidate) : archi lfm2 refus\xE9e.");let r=this.manifest.arch;if(this.D=r.d,this.NH=r.nHeads,this.NKV=r.nKvHeads,this.HD=r.headDim,this.NL=r.blockCount,this.vocab=r.vocab,this.EPS=r.rmsEps,this.THETA=r.ropeTheta,!r.lfm2)throw new Error("manifest sans profil lfm2");this.LC=r.lfm2.lCache,this.convLayer=r.lfm2.kvHeadsPerLayer.map(e=>e===0),this.tok=t,this.stops=new Set(this.manifest.chat?.stopTokenIds?.length?this.manifest.chat.stopTokenIds:[7]);for(let[e,n]of Object.entries(this.manifest.tensors)){if(e==="token_embd.weight"){if(this.embedBytes=await this.raw(e),this.embedDtype=n.dtype,n.dtype==="q4"){let i=Ae(this.embedBytes,n.nElems);this.g.set("head",{kind:"q4",nib:this.engine.uploadGpuRaw(i.nibbles),sc:this.up(i.scales),mn:this.up(i.mins),IN:this.D,OUT:this.vocab})}else if(n.dtype==="q8"){let i=Fe(this.embedBytes,n.nElems);this.g.set("head",{kind:"q8",codes:this.upI8(i.codes),sc:this.up(i.scales),IN:this.D,OUT:this.vocab})}else if(n.dtype==="q3")throw new Error("LFM2 : t\xEAte li\xE9e en q3 non support\xE9e (le convertisseur garde un plancher q4)");continue}let s=await this.raw(e);if(this.isBigProj(e)&&(n.dtype==="q3"||n.dtype==="q4"||n.dtype==="q8")){let i=n.shape[0],a=n.nElems/i;if(n.dtype==="q8"){let o=Fe(s,n.nElems);this.g.set(e,{kind:"q8",codes:this.upI8(o.codes),sc:this.up(o.scales),IN:i,OUT:a})}else if(n.dtype==="q3"){let o=Me(s,n.nElems);this.g.set(e,{kind:"q3",q3:!0,lo:this.up32(o.lo),hi:this.up32(o.hi),sc:this.up(o.scales),mn:this.up(o.mins),IN:i,OUT:a})}else{let o=Ae(s,n.nElems);this.g.set(e,{kind:"q4",nib:this.engine.uploadGpuRaw(o.nibbles),sc:this.up(o.scales),mn:this.up(o.mins),IN:i,OUT:a})}}else this.w.set(e,this.decodePetit(e,s,n))}this.buildResidentLayers(),this.reset()}buildResidentLayers(){let t=r=>{let e=this.engine.uploadGpu(this.w.get(r));return this.normBufs.push(e),e};this.tokNormGpu=t("token_embd_norm.weight"),this.ffn=this.g.get("blk.0.ffn_gate.weight")?.OUT??0,this.rLayers=[];for(let r=0;r<this.NL;r++){let e=`blk.${r}.`,n={attnNorm:t(e+"attn_norm.weight"),ffnNorm:t(e+"ffn_norm.weight"),wgate:this.g.get(e+"ffn_gate.weight"),wup:this.g.get(e+"ffn_up.weight"),wdown:this.g.get(e+"ffn_down.weight")};this.convLayer[r]?this.rLayers.push({conv:!0,...n,convW:t(e+"shortconv.conv.weight"),inProj:this.g.get(e+"shortconv.in_proj.weight"),outProj:this.g.get(e+"shortconv.out_proj.weight")}):this.rLayers.push({conv:!1,...n,qNorm:t(e+"attn_q_norm.weight"),kNorm:t(e+"attn_k_norm.weight"),wq:this.g.get(e+"attn_q.weight"),wk:this.g.get(e+"attn_k.weight"),wv:this.g.get(e+"attn_v.weight"),wo:this.g.get(e+"attn_output.weight")})}}residentAvailable(){return this.engine.lfm2ResidentOk!==!1&&!!this.g.get("head")&&this.rLayers.length===this.NL&&this.ffn>0}cfg(){return{D:this.D,nHeads:this.NH,nKvHeads:this.NKV,headDim:this.HD,ffn:this.ffn,eps:this.EPS,theta:this.THETA,lc:this.LC,vocab:this.vocab}}embedsFor(t){let r=this.D,e=new Float32Array(t.length*r);for(let n=0;n<t.length;n++)e.set(this.embedRow(t[n]),n*r);return e}async logitsGpu(t,r,e){return this.pos=r+t.length,this.engine.lfm2LogitsGpu(this.embedsFor(t),t.length,this.cfg(),this.rLayers,this.g.get("head"),this.tokNormGpu,r,e)}async topKGpu(t,r,e,n,s,i=40){return this.pos=r+t.length,this.engine.lfm2TopKGpu(this.embedsFor(t),t.length,this.cfg(),this.rLayers,this.g.get("head"),this.tokNormGpu,r,e,n,s,i)}async prefillGpu(t,r,e){this.pos=r+t.length,await this.engine.lfm2PrefillGpu(this.embedsFor(t),t.length,this.cfg(),this.rLayers,this.tokNormGpu,r,e)}decodePetit(t,r,e){switch(e.dtype){case"f32":return En(r,e.nElems);case"f16":return Kn(r,e.nElems);case"q8":return ke(Fe(r,e.nElems));case"q4":return ye(Ae(r,e.nElems));case"q3":return $e(Me(r,e.nElems));default:throw new Error(`LFM2 : dtype \xAB ${e.dtype} \xBB non support\xE9 pour ${t}`)}}up(t){return this.engine.uploadGpuRaw(new Uint8Array(t.buffer,t.byteOffset,t.byteLength))}up32(t){return this.engine.uploadGpuRaw(new Uint8Array(t.buffer,t.byteOffset,t.byteLength))}upI8(t){return this.engine.uploadGpuRaw(new Uint8Array(t.buffer,t.byteOffset,t.byteLength))}unload(){for(let t of this.g.values())for(let r of["nib","sc","mn","codes"])t[r]?.destroy?.();for(let t of this.normBufs)t?.destroy?.();this.normBufs=[],this.rLayers=[],this.tokNormGpu=null,this.engine.clearLfm2State?.(),this.g.clear(),this.w.clear()}reset(){this.pos=0,this.state=Array.from({length:this.NL},(t,r)=>this.convLayer[r]?{conv:new Float32Array((this.LC-1)*this.D)}:{K:[],V:[]})}async gemm(t,r){let e=this.g.get(t);if(!e){let n=this.w.get(t==="head"?"token_embd.weight":t),s=n.length/r.length,i=new Float32Array(s);for(let a=0;a<s;a++){let o=0,u=a*r.length;for(let c=0;c<r.length;c++)o+=n[u+c]*r[c];i[a]=o}return i}return e.kind==="q8"?this.engine.matmulQ8(r,e.codes,e.sc,1,e.IN,e.OUT):e.kind==="q3"?this.engine.matmulQ3(r,e.lo,e.hi,e.sc,e.mn,1,e.IN,e.OUT):this.engine.matmulQ4(r,e.nib,e.sc,e.mn,1,e.IN,e.OUT)}embedRow(t){let r=this.D;if(this.embedDtype==="f16")return Kn(this.embedBytes.subarray(t*r*2,t*r*2+r*2),r);if(this.embedDtype==="f32")return En(this.embedBytes.subarray(t*r*4,t*r*4+r*4),r);if(this.embedDtype==="q8"){let o=this.vocab*r,u=r/32,c=new Int8Array(this.embedBytes.buffer,this.embedBytes.byteOffset+t*r,r),l=this.embedBytes.subarray(o+t*u*2,o+t*u*2+u*2),d=new DataView(l.buffer,l.byteOffset,l.byteLength),p=new Float32Array(r);for(let g=0;g<u;g++){let m=we(d.getUint16(g*2,!0));for(let b=0;b<32;b++)p[g*32+b]=c[g*32+b]*m}return p}let e=this.vocab*r,n=r/32,s=e/2,i=e/2+e/32*2,a=new Uint8Array(r/2+n*2*2);return a.set(this.embedBytes.subarray(t*r/2,t*r/2+r/2),0),a.set(this.embedBytes.subarray(s+t*n*2,s+t*n*2+n*2),r/2),a.set(this.embedBytes.subarray(i+t*n*2,i+t*n*2+n*2),r/2+n*2),ye(Ae(a,r))}rope(t,r,e){let n=this.HD,s=t.slice();for(let i=0;i<r;i++){let a=i*n;for(let o=0;o<n/2;o++){let u=Math.pow(this.THETA,-2*o/n),c=Math.cos(e*u),l=Math.sin(e*u),d=t[a+o],p=t[a+o+n/2];s[a+o]=d*c-p*l,s[a+o+n/2]=d*l+p*c}}return s}async forwardToken(t){let r=this.D,e=this.pos++,n=this.embedRow(t);for(let s=0;s<this.NL;s++){let i=`blk.${s}.`,a=this.state[s],o=Gt(n,this.w.get(i+"attn_norm.weight"),r,this.EPS),u;if(this.convLayer[s]){let g=await this.gemm(i+"shortconv.in_proj.weight",o),m=await this.engine.lfm2ShortConv(g,a.conv,this.w.get(i+"shortconv.conv.weight"),r,this.LC);a.conv=m.state,u=await this.gemm(i+"shortconv.out_proj.weight",m.out)}else{let g=await this.gemm(i+"attn_q.weight",o),m=await this.gemm(i+"attn_k.weight",o),b=await this.gemm(i+"attn_v.weight",o),v=this.w.get(i+"attn_q_norm.weight"),U=this.w.get(i+"attn_k_norm.weight");for(let P=0;P<this.NH;P++)g.set(Gt(g.slice(P*this.HD,(P+1)*this.HD),v,this.HD,this.EPS),P*this.HD);for(let P=0;P<this.NKV;P++)m.set(Gt(m.slice(P*this.HD,(P+1)*this.HD),U,this.HD,this.EPS),P*this.HD);g=this.rope(g,this.NH,e),m=this.rope(m,this.NKV,e),a.K.push(m),a.V.push(b);let A=new Float32Array(this.NH*this.HD),F=a.K.length,T=1/Math.sqrt(this.HD),K=this.NH/this.NKV;for(let P=0;P<this.NH;P++){let G=Math.floor(P/K),_=P*this.HD,h=G*this.HD,y=new Float32Array(F),k=-1e30;for(let x=0;x<F;x++){let B=0;for(let q=0;q<this.HD;q++)B+=g[_+q]*a.K[x][h+q];y[x]=B*T,y[x]>k&&(k=y[x])}let w=0;for(let x=0;x<F;x++)y[x]=Math.exp(y[x]-k),w+=y[x];for(let x=0;x<F;x++){let B=y[x]/w;for(let q=0;q<this.HD;q++)A[_+q]+=B*a.V[x][h+q]}}u=await this.gemm(i+"attn_output.weight",A)}for(let g=0;g<r;g++)n[g]+=u[g];let c=Gt(n,this.w.get(i+"ffn_norm.weight"),r,this.EPS),l=await this.gemm(i+"ffn_gate.weight",c),d=await this.gemm(i+"ffn_up.weight",c);for(let g=0;g<l.length;g++)l[g]=Fi(l[g])*d[g];let p=await this.gemm(i+"ffn_down.weight",l);for(let g=0;g<r;g++)n[g]+=p[g]}return n=Gt(n,this.w.get("token_embd_norm.weight"),r,this.EPS),this.gemm("head",n)}async classify(t,r){let e=this.tok.encode(t),n;if(this.residentAvailable())n=await this.locked(()=>this.feedThen(e,0,"cls",(i,a)=>this.logitsGpu(i,a,"cls")));else{this.reset();for(let i of e)n=await this.forwardToken(i)}let s=r.map(i=>{let a=this.tok.encode(i);return{label:i,logit:n[a[1]??a[0]]}}).sort((i,a)=>a.logit-i.logit);return{label:s[0].label,scores:s}}banTools(t){for(let r of tt.TOOL_BAN)r<t.length&&(t[r]=-1e30);return t}sampleTok(t,r,e){let{temperature:n=.8,topK:s=40,repeatPenalty:i=1.3}=e,a=new Set(r),o=[];for(let d=0;d<t.length;d++){let p=t[d];a.has(d)&&(p=p>0?p/i:p*i),o.push({i:d,v:p})}o.sort((d,p)=>p.v-d.v),o.length=s;let u=o[0].v,c=0;for(let d of o)d.p=Math.exp((d.v-u)/n),c+=d.p;let l=Math.random()*c;for(let d of o)if(l-=d.p,l<=0)return d.i;return o[0].i}async generate(t,r,e,n,s){this.reset();let i=this.tok.encode(t),a;for(let u of i)a=await this.forwardToken(u);let o=[];for(let u=0;u<r&&!n?.();u++){this.banTools(a);let c;if(s?.sample)c=this.sampleTok(a,o.slice(-64),s);else{c=0;for(let l=1;l<a.length;l++)a[l]>a[c]&&(c=l)}if(this.stops.has(c))break;o.push(c),e&&e(this.tok.decode(o)),a=await this.forwardToken(c)}return o.length?this.tok.decode(o):""}locked(t){let r=this.residentLock.then(t,t);return this.residentLock=r.catch(()=>{}),r}async feedThen(t,r,e,n,s){let i=0;for(;;){if(s?.())return null;let a=Math.min(i+tt.PREFILL_CHUNK,t.length),o=t.slice(i,a);if(a<t.length)await this.prefillGpu(o,r+i,e);else return n(o,r+i);i=a}}pickFromTopK(t,r){let e=[],n=[];for(let d=0;d<t.ids.length;d++)if(!tt.TOOL_BAN.includes(t.ids[d])){if(t.vals[d]<=-3e38)break;e.push(t.ids[d]),n.push(t.vals[d])}if(!e.length)return t.ids[0];if(!r?.sample)return e[0];let{temperature:s=.8,topK:i=40}=r,a=Math.min(i,e.length),o=n[0],u=0,c=new Array(a);for(let d=0;d<a;d++)c[d]=Math.exp((n[d]-o)/s),u+=c[d];let l=Math.random()*u;for(let d=0;d<a;d++)if(l-=c[d],l<=0)return e[d];return e[0]}async generateResident(t,r,e,n,s){return this.residentAvailable()?this.locked(async()=>{let a=s?.repeatPenalty??(s?.sample?1.3:1),o=this.tok.encode(t),u=await this.feedThen(o,0,"gen",(d,p)=>this.topKGpu(d,p,"gen",[],1,48),n);if(!u)return"";let c=o.length,l=[];for(let d=0;d<r&&!n?.();d++){let p=this.pickFromTopK(u,s);if(this.stops.has(p))break;l.push(p),e&&e(this.tok.decode(l)),u=await this.topKGpu([p],c,"gen",a!==1?[...new Set(l.slice(-64))]:[],a,48),c++}return l.length?this.tok.decode(l):""}):this.generate(t,r,e,n,s)}};tt.TOOL_BAN=[8,10,12],tt.PREFILL_CHUNK=128;Wt=tt});function Si(f){let t=[];for(let r=0;r<f.length;r++){let e=f[r];if(e==="\\"&&r+1<f.length){let s=f[r+1];if(s==="x"){t.push(parseInt(f.substr(r+2,2),16)&255),r+=3;continue}if(s==="t"){t.push(9),r++;continue}if(s==="n"){t.push(10),r++;continue}if(s==="r"){t.push(13),r++;continue}if(s==="0"){t.push(0),r++;continue}if(s==="\\"){t.push(92),r++;continue}if(s==="'"){t.push(39),r++;continue}if(s==='"'){t.push(34),r++;continue}t.push(92);continue}let n=e.codePointAt(0);if(n<128)t.push(n);else for(let s of new TextEncoder().encode(e))t.push(s)}return new Uint8Array(t)}var It,zn=ce(()=>{"use strict";It=class{constructor(t,r=0){this.root={next:new Map};this.idToBytes=[];this.vocabSize=t.length,this.eosId=r;for(let e=0;e<t.length;e++){let n=Si(t[e]);if(this.idToBytes[e]=n,e===0||n.length===0)continue;let s=this.root;for(let i of n){let a=s.next.get(i);a||(a={next:new Map},s.next.set(i,a)),s=a}s.id=e}}encode(t){let r=new TextEncoder().encode(t),e=[],n=0;for(;n<r.length;){let s=this.root,i=-1,a=0,o=0;for(let u=n;u<r.length;u++){let c=s.next.get(r[u]);if(!c)break;s=c,o++,c.id!==void 0&&(i=c.id,a=o)}i<0&&(i=r[n]+1,a=1),e.push(i),n+=a}return e}decode(t){let r=[];for(let e of t){if(e===this.eosId)continue;let n=this.idToBytes[e];if(n)for(let s of n)r.push(s)}return new TextDecoder("utf-8",{fatal:!1}).decode(new Uint8Array(r))}}});function Ur(f,t){let r=new DataView(f.buffer,f.byteOffset,f.byteLength),e=new Float32Array(t);for(let n=0;n<t;n++)e[n]=we(r.getUint16(n*2,!0));return e}function Br(f,t){let r=new DataView(f.buffer,f.byteOffset,f.byteLength),e=new Float32Array(t);for(let n=0;n<t;n++)e[n]=r.getFloat32(n*4,!0);return e}function He(f,t,r,e){let n=new Float32Array(e);for(let s=0;s<e;s++){let i=0,a=s*r;for(let o=0;o<r;o++)i+=f[a+o]*t[o];n[s]=i}return n}function Yt(f,t,r,e,n=1e-5){let s=0;for(let u=0;u<e;u++)s+=f[u];s/=e;let i=0;for(let u=0;u<e;u++){let c=f[u]-s;i+=c*c}i/=e;let a=1/Math.sqrt(i+n),o=new Float32Array(e);for(let u=0;u<e;u++)o[u]=(f[u]-s)*a*t[u]+r[u];return o}var Vt,rt,Ut,Nn=ce(()=>{"use strict";kt();wt();yt();ot();zn();Vt=f=>1/(1+Math.exp(-f));rt=class rt{constructor(t,r,e){this.engine=t;this.manifest=r;this.raw=e;this.w=new Map;this.g=new Map;this.rLayers=[];this.rNorms=null;this.normBufs=[];this.residentLock=Promise.resolve()}isBigProj(t){return/\.(time_mix_(receptance|key|value|output)|channel_mix_(key|value))\.weight$/.test(t)}async load(t){let r=this.manifest.arch;this.D=r.d,this.H=r.rwkv.headSize,this.NH=this.D/this.H,this.NL=r.blockCount,this.vocab=r.vocab,this.tok=new It(t,0);for(let[e,n]of Object.entries(this.manifest.tensors)){if(e==="token_embd.weight"){this.embedBytes=await this.raw(e),this.embedDtype=n.dtype;continue}let s=await this.raw(e);if(e==="output.weight"){if(n.dtype==="q4"){let i=Ae(s,n.nElems);this.g.set(e,{kind:"q4",nib:this.engine.uploadGpuRaw(i.nibbles),sc:this.up(i.scales),mn:this.up(i.mins),IN:this.D,OUT:this.vocab})}else if(n.dtype==="q3"){let i=Me(s,n.nElems);this.g.set(e,{kind:"q3",q3:!0,lo:this.up32(i.lo),hi:this.up32(i.hi),sc:this.up(i.scales),mn:this.up(i.mins),IN:this.D,OUT:this.vocab})}else if(n.dtype==="q8"){let i=Fe(s,n.nElems);this.g.set(e,{kind:"q8",codes:this.upI8(i.codes),sc:this.up(i.scales),IN:this.D,OUT:this.vocab})}else this.w.set(e,n.dtype==="f32"?Br(s,n.nElems):Ur(s,n.nElems));continue}if(this.isBigProj(e)&&(n.dtype==="q3"||n.dtype==="q4"||n.dtype==="q8")){let i=n.shape[0],a=n.nElems/i;if(n.dtype==="q3"){let o=Me(s,n.nElems);this.g.set(e,{kind:"q3",q3:!0,lo:this.up32(o.lo),hi:this.up32(o.hi),sc:this.up(o.scales),mn:this.up(o.mins),IN:i,OUT:a})}else if(n.dtype==="q8"){let o=Fe(s,n.nElems);this.g.set(e,{kind:"q8",codes:this.upI8(o.codes),sc:this.up(o.scales),IN:i,OUT:a})}else{let o=Ae(s,n.nElems);this.g.set(e,{kind:"q4",nib:this.engine.uploadGpuRaw(o.nibbles),sc:this.up(o.scales),mn:this.up(o.mins),IN:i,OUT:a})}}else this.w.set(e,n.dtype==="f32"?Br(s,n.nElems):n.dtype==="f16"?Ur(s,n.nElems):n.dtype==="q3"?$e(Me(s,n.nElems)):n.dtype==="q8"?ke(Fe(s,n.nElems)):ye(Ae(s,n.nElems)))}this.buildResidentLayers(),this.reset()}buildResidentLayers(){try{let t=e=>{let n=this.w.get(e);if(!n)throw new Error(`r\xE9sident : tenseur manquant ${e}`);let s=this.engine.uploadGpu(n);return this.normBufs.push(s),s};this.rNorms={tokW:t("token_embd_norm.weight"),tokB:t("token_embd_norm.bias"),outW:t("output_norm.weight"),outB:t("output_norm.bias")};let r=[];for(let e=0;e<this.NL;e++){let n=`blk.${e}.`,s=(m,b)=>{let v=this.w.get(n+m);if(!v)throw new Error(`r\xE9sident : ${n}${m} manquant`);return v.length/b},i=this.w.get(n+"time_mix_ln.weight"),a=this.w.get(n+"time_mix_ln.bias");if(!i||!a)throw new Error(`r\xE9sident : ${n}time_mix_ln manquant`);let o=new Float32Array(2*this.D);o.set(i,0),o.set(a,this.D);let u=this.engine.uploadGpu(o);this.normBufs.push(u);let c=m=>{let b=this.g.get(n+m);if(!b)throw new Error(`r\xE9sident : ${n}${m} non quantifi\xE9e GPU`);return b},l=s("time_mix_w1.weight",this.D),d=s("time_mix_a1.weight",this.D),p=s("time_mix_g1.weight",this.D),g={attnNormW:t(n+"attn_norm.weight"),attnNormB:t(n+"attn_norm.bias"),attnNorm2W:t(n+"attn_norm_2.weight"),attnNorm2B:t(n+"attn_norm_2.bias"),lerpFused:t(n+"time_mix_lerp_fused.weight"),lerpK:t(n+"channel_mix_lerp_k.weight"),w0:t(n+"time_mix_w0.weight"),w1:t(n+"time_mix_w1.weight"),w2:t(n+"time_mix_w2.weight"),rw:l,a0:t(n+"time_mix_a0.weight"),a1:t(n+"time_mix_a1.weight"),a2:t(n+"time_mix_a2.weight"),ra:d,g1:t(n+"time_mix_g1.weight"),g2:t(n+"time_mix_g2.weight"),rg:p,kk:t(n+"time_mix_k_k.weight"),ka:t(n+"time_mix_k_a.weight"),rk:t(n+"time_mix_r_k.weight"),lnWB:u,R:c("time_mix_receptance.weight"),K:c("time_mix_key.weight"),V:c("time_mix_value.weight"),O:c("time_mix_output.weight"),cmK:c("channel_mix_key.weight"),cmV:c("channel_mix_value.weight"),ffn:this.g.get(n+"channel_mix_key.weight").OUT};e>0&&(g.rv=s("time_mix_v1.weight",this.D),g.v0=t(n+"time_mix_v0.weight"),g.v1=t(n+"time_mix_v1.weight"),g.v2=t(n+"time_mix_v2.weight")),r.push(g)}this.rLayers=r}catch(t){console.warn("[rwkv] chemin r\xE9sident indisponible (montage) : repli forwardToken JS+readback.",t),this.rLayers=[],this.rNorms=null}}residentAvailable(){let t=this.engine;return t.rwkvResidentOk!==!1&&t.rwkvWkv7Ok!==!1&&!!this.g.get("output.weight")&&this.rLayers.length===this.NL&&!!this.rNorms}cfg(){return{D:this.D,H:this.H,NH:this.NH,vocab:this.vocab}}embedsFor(t){let r=this.D,e=new Float32Array(t.length*r);for(let n=0;n<t.length;n++)e.set(this.embedRow(t[n]),n*r);return e}async prefillGpu(t,r,e){for(let n=0;n<t.length;n+=rt.PREFILL_CHUNK){let s=t.slice(n,n+rt.PREFILL_CHUNK);await this.engine.rwkvPrefillGpu(this.embedsFor(s),s.length,this.cfg(),this.rLayers,this.rNorms,r+n,e)}}locked(t){let r=this.residentLock.then(t,t);return this.residentLock=r.catch(()=>{}),r}async feedThen(t,r,e,n){let s=t.length>rt.PREFILL_CHUNK?t.slice(0,t.length-rt.PREFILL_CHUNK):[];return s.length&&await this.prefillGpu(s,r,e),n(t.slice(s.length),r+s.length)}async logitsGpu(t,r,e){return this.feedThen(t,r,e,(n,s)=>this.engine.rwkvLogitsGpu(this.embedsFor(n),n.length,this.cfg(),this.rLayers,this.g.get("output.weight"),this.rNorms,s,e))}async topKGpu(t,r,e,n,s,i=40){return this.feedThen(t,r,e,(a,o)=>this.engine.rwkvTopKGpu(this.embedsFor(a),a.length,this.cfg(),this.rLayers,this.g.get("output.weight"),this.rNorms,o,e,n,s,i))}up(t){return this.engine.uploadGpuRaw(new Uint8Array(t.buffer,t.byteOffset,t.byteLength))}up32(t){return this.engine.uploadGpuRaw(new Uint8Array(t.buffer,t.byteOffset,t.byteLength))}upI8(t){return this.engine.uploadGpuRaw(new Uint8Array(t.buffer,t.byteOffset,t.byteLength))}reset(){this.state=Array.from({length:this.NL},()=>({S:Array.from({length:this.NH},()=>new Float32Array(this.H*this.H)),tm:new Float32Array(this.D),cm:new Float32Array(this.D)}))}unload(){for(let t of this.g.values())for(let r of["nib","sc","mn","codes","lo","hi"])t[r]?.destroy?.();for(let t of this.normBufs)t?.destroy?.();this.normBufs=[],this.rLayers=[],this.rNorms=null,this.engine.clearRwkvState?.(),this.g.clear(),this.w.clear()}async gemm(t,r){let e=this.g.get(t);if(!e){let n=this.w.get(t);return He(n,r,r.length,n.length/r.length)}return e.kind==="q3"?this.engine.matmulQ3(r,e.lo,e.hi,e.sc,e.mn,1,e.IN,e.OUT):e.kind==="q8"?this.engine.matmulQ8(r,e.codes,e.sc,1,e.IN,e.OUT):this.engine.matmulQ4(r,e.nib,e.sc,e.mn,1,e.IN,e.OUT)}embedRow(t){let r=this.D;if(this.embedDtype==="f16")return Ur(this.embedBytes.subarray(t*r*2,t*r*2+r*2),r);if(this.embedDtype==="f32")return Br(this.embedBytes.subarray(t*r*4,t*r*4+r*4),r);if(this.embedDtype==="q8"){let u=this.vocab*r,c=r/32,l=new Int8Array(this.embedBytes.buffer,this.embedBytes.byteOffset+t*r,r),d=this.embedBytes.subarray(u+t*c*2,u+t*c*2+c*2),p=new DataView(d.buffer,d.byteOffset,d.byteLength),g=new Float32Array(r);for(let m=0;m<c;m++){let b=we(p.getUint16(m*2,!0));for(let v=0;v<32;v++)g[m*32+v]=l[m*32+v]*b}return g}let e=this.vocab*r,n=r/32,s=0,i=e/2,a=e/2+e/32*2,o=new Uint8Array(r/2+n*2*2);return o.set(this.embedBytes.subarray(s+t*r/2,s+t*r/2+r/2),0),o.set(this.embedBytes.subarray(i+t*n*2,i+t*n*2+n*2),r/2),o.set(this.embedBytes.subarray(a+t*n*2,a+t*n*2+n*2),r/2+n*2),ye(Ae(o,r))}async timeMix(t,r,e,n){let s=this.D,i=this.H,a=this.NH,o=`blk.${t}.`,u=D=>this.w.get(o+D),c=new Float32Array(s);for(let D=0;D<s;D++)c[D]=e.tm[D]-r[D];e.tm=r.slice();let l=u("time_mix_lerp_fused.weight"),d=D=>{let z=new Float32Array(s);for(let L=0;L<s;L++)z[L]=r[L]+c[L]*l[D*s+L];return z},[p,g,m,b,v,U]=[d(0),d(1),d(2),d(3),d(4),d(5)],A=await this.gemm(o+"time_mix_receptance.weight",p),F=await this.gemm(o+"time_mix_key.weight",m),T=await this.gemm(o+"time_mix_value.weight",b),K=He(u("time_mix_w1.weight"),g,s,u("time_mix_w1.weight").length/s);for(let D=0;D<K.length;D++)K[D]=Math.tanh(K[D]);let P=He(u("time_mix_w2.weight"),K,K.length,s),G=u("time_mix_w0.weight"),_=new Float32Array(s);for(let D=0;D<s;D++)_[D]=Math.exp(-.606531*Vt(G[D]+P[D]));let h=u("time_mix_a1.weight"),y=He(u("time_mix_a2.weight"),He(h,v,s,h.length/s),h.length/s,s),k=u("time_mix_a0.weight"),w=new Float32Array(s);for(let D=0;D<s;D++)w[D]=Vt(k[D]+y[D]);let x=u("time_mix_g1.weight"),B=He(x,U,s,x.length/s);for(let D=0;D<B.length;D++)B[D]=Vt(B[D]);let q=He(u("time_mix_g2.weight"),B,B.length,s);if(t===0)n.vFirst=T.slice();else{let D=u("time_mix_v1.weight"),z=He(u("time_mix_v2.weight"),He(D,b,s,D.length/s),D.length/s,s),L=u("time_mix_v0.weight");for(let j=0;j<s;j++)T[j]=T[j]+(n.vFirst[j]-T[j])*Vt(L[j]+z[j])}let M=u("time_mix_k_k.weight"),O=u("time_mix_k_a.weight"),C=new Float32Array(s);for(let D=0;D<s;D++)C[D]=F[D]*M[D];for(let D=0;D<a;D++){let z=0;for(let L=0;L<i;L++){let j=C[D*i+L];z+=j*j}z=Math.sqrt(z)||1e-12;for(let L=0;L<i;L++)C[D*i+L]/=z}let S=new Float32Array(s);for(let D=0;D<s;D++)S[D]=F[D]*(1+(w[D]-1)*O[D]);let R=new Float32Array(s);for(let D=0;D<a;D++){let z=D*i,L=e.S[D];for(let j=0;j<i;j++){let Q=0;for(let H=0;H<i;H++)Q+=-C[z+H]*L[j*i+H];let X=0,V=T[z+j];for(let H=0;H<i;H++){let Y=_[z+H]*L[j*i+H]+V*S[z+H]+C[z+H]*w[z+H]*Q;L[j*i+H]=Y,X+=A[z+H]*Y}R[z+j]=X}}let E=u("time_mix_ln.weight"),W=u("time_mix_ln.bias"),N=u("time_mix_r_k.weight"),I=new Float32Array(s);for(let D=0;D<a;D++){let z=D*i,L=0;for(let X=0;X<i;X++)L+=R[z+X];L/=i;let j=0;for(let X=0;X<i;X++){let V=R[z+X]-L;j+=V*V}j/=i;let Q=1/Math.sqrt(j+64e-5);for(let X=0;X<i;X++)I[z+X]=(R[z+X]-L)*Q*E[z+X]+W[z+X]}for(let D=0;D<a;D++){let z=D*i,L=0;for(let j=0;j<i;j++)L+=A[z+j]*S[z+j]*N[z+j];for(let j=0;j<i;j++)I[z+j]+=L*T[z+j]}let $=new Float32Array(s);for(let D=0;D<s;D++)$[D]=I[D]*q[D];return this.gemm(o+"time_mix_output.weight",$)}async channelMix(t,r,e){let n=this.D,s=`blk.${t}.`,i=this.w.get(s+"channel_mix_lerp_k.weight"),a=new Float32Array(n);for(let c=0;c<n;c++)a[c]=e.cm[c]-r[c];e.cm=r.slice();let o=new Float32Array(n);for(let c=0;c<n;c++)o[c]=r[c]+a[c]*i[c];let u=await this.gemm(s+"channel_mix_key.weight",o);for(let c=0;c<u.length;c++)u[c]=u[c]>0?u[c]*u[c]:0;return this.gemm(s+"channel_mix_value.weight",u)}async forwardToken(t){let r=this.D,e={vFirst:null},n=this.embedRow(t);n=Yt(n,this.w.get("token_embd_norm.weight"),this.w.get("token_embd_norm.bias"),r);for(let s=0;s<this.NL;s++){let i=this.state[s],a=`blk.${s}.`,o=await this.timeMix(s,Yt(n,this.w.get(a+"attn_norm.weight"),this.w.get(a+"attn_norm.bias"),r),i,e);for(let c=0;c<r;c++)n[c]+=o[c];let u=await this.channelMix(s,Yt(n,this.w.get(a+"attn_norm_2.weight"),this.w.get(a+"attn_norm_2.bias"),r),i);for(let c=0;c<r;c++)n[c]+=u[c]}return n=Yt(n,this.w.get("output_norm.weight"),this.w.get("output_norm.bias"),r),this.gemm("output.weight",n)}async classify(t,r){let e=this.tok.encode(t),n;if(this.residentAvailable())n=await this.locked(()=>this.logitsGpu(e,0,"cls"));else{this.reset();for(let i of e)n=await this.forwardToken(i)}let s=r.map(i=>({label:i,logit:n[this.tok.encode(" "+i)[0]]})).sort((i,a)=>a.logit-i.logit);return{label:s[0].label,scores:s}}sampleTok(t,r,e){let{temperature:n=.8,topK:s=40,repeatPenalty:i=1.3}=e,a=new Set(r),o=[];for(let d=0;d<t.length;d++){let p=t[d];a.has(d)&&(p=p>0?p/i:p*i),o.push({i:d,v:p})}o.sort((d,p)=>p.v-d.v),o.length=s;let u=o[0].v,c=0;for(let d of o)d.p=Math.exp((d.v-u)/n),c+=d.p;let l=Math.random()*c;for(let d of o)if(l-=d.p,l<=0)return d.i;return o[0].i}async generate(t,r,e,n,s){this.reset();let i=this.tok.encode(t),a;for(let u of i)a=await this.forwardToken(u);let o=[];for(let u=0;u<r&&!n?.();u++){let c;if(s?.sample)c=this.sampleTok(a,o.slice(-64),s);else{c=0;for(let l=1;l<a.length;l++)a[l]>a[c]&&(c=l)}if(c===0)break;o.push(c),e&&e(this.tok.decode(o)),a=await this.forwardToken(c)}return this.tok.decode(o)}pickFromTopK(t,r){if(!r?.sample)return t.ids[0];let{temperature:e=.8,topK:n=40}=r,s=Math.min(n,t.ids.length);for(;s>1&&t.vals[s-1]<=-3e38;)s--;let i=t.vals[0],a=0,o=new Array(s);for(let c=0;c<s;c++)o[c]=Math.exp((t.vals[c]-i)/e),a+=o[c];let u=Math.random()*a;for(let c=0;c<s;c++)if(u-=o[c],u<=0)return t.ids[c];return t.ids[0]}async generateResident(t,r,e,n,s){return this.residentAvailable()?this.locked(async()=>{let a=s?.repeatPenalty??(s?.sample?1.3:1),o=this.tok.encode(t),u=await this.topKGpu(o,0,"gen",[],1,48),c=o.length,l=[];for(let d=0;d<r&&!n?.();d++){let p=this.pickFromTopK(u,s);if(p===0)break;l.push(p),e&&e(this.tok.decode(l)),u=await this.topKGpu([p],c,"gen",a!==1?[...new Set(l.slice(-64))]:[],a,48),c++}return this.tok.decode(l)}):this.generate(t,r,e,n,s)}};rt.PREFILL_CHUNK=32;Ut=rt});function ut(f){if(!f.length)return null;let t=1/0,r=0,e=0;for(let n of f)t=Math.min(t,n.offset),r=Math.max(r,n.offset+n.bytes),e+=n.bytes;return r-t>64<<20||r-t>e*1.5?null:{start:t,end:r}}function $n(f){let t=[];for(let r=0;r<f.bytes;r+=Re)t.push({off:f.offset+r,len:Math.min(Re,f.bytes-r)});return t}function qr(f,t){let r=new Map;for(let s of Object.keys(f)){let i=s.match(/^blk\.(\d+)\./);if(!i)continue;let a=r.get(i[1]);a||r.set(i[1],a=[]),a.push(s)}let e=new Map,n=new Map;return async s=>{let i=f[s];if(!i)throw new Error(`tenseur absent : ${s}`);let a=s.match(/^blk\.(\d+)\./),o=a?r.get(a[1]):void 0,u=o?ut(o.map(b=>f[b])):null;if(!a||!o||!u)return t.bytes(i.offset,i.bytes);let c=a[1],l=e.get(c);l||(l=t.bytes(u.start,u.end-u.start).then(b=>({start:u.start,bytes:b})),e.set(c,l),n.set(c,o.length));let{start:d,bytes:p}=await l,g=p.subarray(i.offset-d,i.offset-d+i.bytes),m=(n.get(c)??1)-1;return m<=0?(e.delete(c),n.delete(c),new Uint8Array(g)):(n.set(c,m),g)}}var Qn,Re,ct=ce(()=>{"use strict";Qn=new Set(["per_layer_token_embd.weight"]),Re=4<<20});function Fr(f){return f==="llama"||f==="mistral3"||f==="smollm3"}var Wn=ce(()=>{"use strict"});function Mi(f){return f instanceof Blob?{bytes:async(t,r)=>new Uint8Array(await f.slice(t,t+r).arrayBuffer())}:f}var pe,_e,nt=ce(()=>{"use strict";ct();Wn();wt();yt();kt();xt();ct();pe=class pe{constructor(t,r,e){this.rawCache=new Map;this.layerSpan=new Map;this.weightPrecision="f32";this.precOverrides=null;this.layerCache=new Map;this.layerGpuCache=new Map;this.finalNormGpu=null;this.projQ8=null;this.projVocab=0;this.visionSegments=[];this.engine=t,this.source=Mi(r),this.manifest=e,this.weightPrecision=this.nativePrecision}get nativePrecision(){let t=this.manifest.tensors["blk.0.attn_q.weight"];return t?.type==="Q4W"?"q4":t?.type==="Q8W"?"q8":t?.type==="Q3W"?"q3":this.supportsQ8?"q8":this.engine?.hasF16?"f16":"f32"}get isMixedNative(){let t=this.manifest.tensors["blk.0.attn_q.weight"]?.type,r=this.manifest.tensors["blk.0.ffn_gate.weight"]?.type;return(t==="Q4W"||t==="Q8W")&&(r==="Q4W"||r==="Q8W")&&t!==r}get loaded(){return this.manifest!==null}async loadManifest(){return this.manifest}async rawTensor(t){let r=this.rawCache.get(t);if(r)return r;let e=this.manifest.tensors[t];if(!e)throw new Error("tensor absent du manifeste: "+t);let n=await this.source.bytes(e.offset,e.bytes);return this.cacheRaw(t,n)}cacheRaw(t,r){let e=this.maybeUnpermuteLlamaQk(t,r);return this.rawCache.set(t,e),e}maybeUnpermuteLlamaQk(t,r){if(!pe.unpermOn||pe.ropeNormOn&&Fr(this.manifest.arch)||!["llama","mistral3","smollm3"].includes(this.manifest.arch))return r;let e=t.endsWith(".attn_q.weight"),n=t.endsWith(".attn_k.weight");if(!e&&!n)return r;let{nHeads:s,nKvHeads:i,headDim:a}=this.manifest.config,o=this.manifest.tensors[t];if(o.type==="Q8W"||o.type==="Q4W"||o.type==="Q3W")throw new Error("BRIK d\u2019un mod\xE8le llama non support\xE9 (lignes Q/K permut\xE9es) : charger le GGUF directement.");let u=e?s:i,c=u*a,l=o.bytes/c;if(!Number.isInteger(l))throw new Error(`${t} : lignes non uniformes (${o.bytes} o / ${c} lignes). D\xE9-permutation impossible.`);let d=a/2,p=new Uint8Array(r.byteLength);for(let g=0;g<u;g++){let m=g*a;for(let b=0;b<d;b++)p.set(r.subarray((m+2*b)*l,(m+2*b+1)*l),(m+b)*l),p.set(r.subarray((m+2*b+1)*l,(m+2*b+2)*l),(m+d+b)*l)}return p}ensureLayerSpan(t){let r=this.layerSpan.get(t);return r||(r=this.fetchLayerSpan(t).catch(()=>{this.layerSpan.delete(t)}),this.layerSpan.set(t,r)),r}async fetchLayerSpan(t){let r=`blk.${t}.`,e=Object.entries(this.manifest.tensors).filter(([i])=>i.startsWith(r)),n=ut(e.map(([,i])=>i));if(!n)return;let s=await this.source.bytes(n.start,n.end-n.start);for(let[i,a]of e)this.rawCache.has(i)||this.cacheRaw(i,s.subarray(a.offset-n.start,a.offset-n.start+a.bytes))}async debugTensorF32(t,r=!1){if(!r)return this.dequant(t);let e=pe.unpermOn,n=this.rawCache.has(t),s=this.rawCache.get(t);try{return pe.unpermOn=!1,this.rawCache.delete(t),await this.dequant(t)}finally{pe.unpermOn=e,this.rawCache.delete(t),n&&s&&this.rawCache.set(t,s)}}async dequant(t){let r=this.manifest.tensors[t],e=await this.rawTensor(t);return this.engine.dequantizeByType(r.type,e,r.nElems)}async dequantGpu(t){let r=this.manifest.tensors[t],e=await this.rawTensor(t);return this.engine.dequantizeToGpu(r.type,e,r.nElems)}async dequantGpuF16(t){let r=this.manifest.tensors[t],e=await this.rawTensor(t);if(r.type==="F16")return this.engine.uploadGpuRawF16(e);let n=this.engine.dequantizeToGpu(r.type,e,r.nElems),s=this.engine.f32ToF16Gpu(n,r.nElems);return n.destroy?.(),s}async dequantGpuQ4(t){let r=this.manifest.tensors[t],e=await this.rawTensor(t);if(r.type!=="Q4W"){let s=this.engine.dequantizeToGpu(r.type,e,r.nElems),i=this.engine.f32ToQ4Gpu(s,r.nElems);return s.destroy?.(),i}let n=Ae(e,r.nElems);return{nib:this.engine.uploadGpuRaw(n.nibbles),sc:this.engine.uploadGpuRaw(new Uint8Array(n.scales.buffer,n.scales.byteOffset,n.scales.byteLength)),mn:this.engine.uploadGpuRaw(new Uint8Array(n.mins.buffer,n.mins.byteOffset,n.mins.byteLength))}}async dequantGpuQ3(t){let r=this.manifest.tensors[t],e=await this.rawTensor(t);if(r.type!=="Q3W")return this.engine.dequantizeToGpu(r.type,e,r.nElems);let n=Me(e,r.nElems);return{q3:!0,lo:this.engine.uploadGpuRaw(new Uint8Array(n.lo.buffer,n.lo.byteOffset,n.lo.byteLength)),hi:this.engine.uploadGpuRaw(new Uint8Array(n.hi.buffer,n.hi.byteOffset,n.hi.byteLength)),sc:this.engine.uploadGpuRaw(new Uint8Array(n.scales.buffer,n.scales.byteOffset,n.scales.byteLength)),mn:this.engine.uploadGpuRaw(new Uint8Array(n.mins.buffer,n.mins.byteOffset,n.mins.byteLength))}}async dequantGpuQ8(t){let r=this.manifest.tensors[t],e=await this.rawTensor(t);if(r.type==="Q4_K"&&this.engine.kqOk&&r.shape[0]%256===0)return this.engine.uploadKq("Q4_K",e);if(r.type==="PQ2_0"&&this.engine.pq2NativeOk&&r.shape[0]%128===0)return this.engine.uploadKq("PQ2_0",e);if(r.type!=="Q8W"){let s=this.engine.dequantizeToGpu(r.type,e,r.nElems),i=this.engine.f32ToQ8Gpu(s,r.nElems);return s.destroy?.(),i}let n=Fe(e,r.nElems);return{codes:this.engine.uploadGpuRaw(new Uint8Array(n.codes.buffer,n.codes.byteOffset,n.codes.byteLength)),sc:this.engine.uploadGpuRaw(new Uint8Array(n.scales.buffer,n.scales.byteOffset,n.scales.byteLength))}}static destroyWeight(t){if(t){if(t.kq){t.buf?.destroy?.();return}t.q3?(t.lo?.destroy?.(),t.hi?.destroy?.(),t.sc?.destroy?.(),t.mn?.destroy?.()):t.nib?(t.nib?.destroy?.(),t.sc?.destroy?.(),t.mn?.destroy?.()):t.codes?(t.codes?.destroy?.(),t.sc?.destroy?.()):t.destroy?.()}}get precision(){return this.weightPrecision}get supportsQ4(){let{d:t,ffn:r}=this.manifest.config;return t%32===0&&r%32===0}get supportsQ8(){return this.supportsQ4}get supportsQ3(){return this.supportsQ4}matPrecision(t){let r=this.weightPrecision;if((r==="q4"||r==="q8")&&this.precOverrides){for(let[e,n]of this.precOverrides)if(t.includes(e))return n}if(r===this.nativePrecision){let e=this.manifest.tensors[t]?.type;if(e==="Q4W")return"q4";if(e==="Q8W")return"q8";if(e==="Q3W")return"q3"}return r}setWeightPrecision(t){if(t!==this.weightPrecision){if((t==="q4"||t==="q8")&&!this.supportsQ4)throw new Error(`${t} indisponible : d ou ffn non multiple de 32`);for(let r of this.layerGpuCache.values())for(let e of Object.values(r))pe.destroyWeight(e);this.layerGpuCache.clear(),this.weightPrecision=t}}async layerWeights(t){let r=this.layerCache.get(t);if(r)return r;let e=`blk.${t}`,[n,s,i,a,o,u,c,l,d,p,g,m]=await Promise.all([this.dequant(`${e}.attn_norm.weight`),this.dequantGpu(`${e}.attn_q.weight`),this.dequantGpu(`${e}.attn_k.weight`),this.dequantGpu(`${e}.attn_v.weight`),this.dequantGpu(`${e}.attn_output.weight`),this.dequant(`${e}.ffn_norm.weight`),this.dequantGpu(`${e}.ffn_gate.weight`),this.dequantGpu(`${e}.ffn_up.weight`),this.dequantGpu(`${e}.ffn_down.weight`),this.dequant(`${e}.attn_q.bias`).catch(()=>{}),this.dequant(`${e}.attn_k.bias`).catch(()=>{}),this.dequant(`${e}.attn_v.bias`).catch(()=>{})]),[b,v,U,A]=await Promise.all([this.dequant(`${e}.post_attention_norm.weight`).catch(()=>{}),this.dequant(`${e}.post_ffw_norm.weight`).catch(()=>{}),this.dequant(`${e}.attn_q_norm.weight`).catch(()=>{}),this.dequant(`${e}.attn_k_norm.weight`).catch(()=>{})]),F={attnNorm:n,wq:s,wk:i,wv:a,wo:o,ffnNorm:u,wgate:c,wup:l,wdown:d,bq:p,bk:g,bv:m,postAttnNorm:b,postFfnNorm:v,qNorm:U,kNorm:A};return this.layerCache.set(t,F),F}async warmup(t){let{blockCount:r,d:e}=this.manifest.config,n=r+1;for(let s=0;s<r;s++)await this.layerWeightsGpu(s),t?.(s+1,n);await this.getFinalNormGpu(),await this.getRopeFactors(),await this.getProjectionQ8(e);try{await this.topKKV([0],0,"brimkern-warmup",[],1),this.reset()}catch(s){console.warn("[warmup] passe \xE0 blanc impossible. Le premier message paiera le transfert :",s)}t?.(n,n)}async layerWeightsGpu(t){let r=this.layerGpuCache.get(t);if(r)return r;await this.ensureLayerSpan(t);let e=`blk.${t}`,n=h=>this.engine.uploadGpu(h),i=this.weightPrecision==="f16",a=h=>{let y=this.matPrecision(h);return y==="q3"?this.dequantGpuQ3(h):y==="q4"?this.dequantGpuQ4(h):y==="q8"?this.dequantGpuQ8(h):y==="f16"?this.dequantGpuF16(h):this.dequantGpu(h)},[o,u,c,l,d,p,g,m,b,v,U,A]=await Promise.all([this.dequant(`${e}.attn_norm.weight`).then(n),a(`${e}.attn_q.weight`),a(`${e}.attn_k.weight`),a(`${e}.attn_v.weight`),a(`${e}.attn_output.weight`),this.dequant(`${e}.ffn_norm.weight`).then(n),a(`${e}.ffn_gate.weight`),a(`${e}.ffn_up.weight`),a(`${e}.ffn_down.weight`),this.dequant(`${e}.attn_q.bias`).then(n).catch(()=>{}),this.dequant(`${e}.attn_k.bias`).then(n).catch(()=>{}),this.dequant(`${e}.attn_v.bias`).then(n).catch(()=>{})]),[F,T,K,P]=await Promise.all([this.dequant(`${e}.post_attention_norm.weight`).then(n).catch(()=>{}),this.dequant(`${e}.post_ffw_norm.weight`).then(n).catch(()=>{}),this.dequant(`${e}.attn_q_norm.weight`).then(n).catch(()=>{}),this.dequant(`${e}.attn_k_norm.weight`).then(n).catch(()=>{})]),G={attnNorm:o,wq:u,wk:c,wv:l,wo:d,ffnNorm:p,wgate:g,wup:m,wdown:b,bq:v,bk:U,bv:A,postAttnNorm:F,postFfnNorm:T,qNorm:K,kNorm:P,matF16:i};this.layerGpuCache.set(t,G);let _=`blk.${t}.`;for(let h of this.rawCache.keys())h.startsWith(_)&&this.rawCache.delete(h);return this.layerSpan.delete(t),G}async getFinalNormGpu(){return this.finalNormGpu||(this.finalNormGpu=this.engine.uploadGpu(await this.dequant("output_norm.weight"))),this.finalNormGpu}async prewarmGpu(t){let{blockCount:r,d:e}=this.manifest.config,n=new Array(r).fill(0);for(let[o,u]of Object.entries(this.manifest.tensors)){let c=o.match(/^blk\.(\d+)\./);c&&(n[Number(c[1])]+=u.bytes)}let s=n.reduce((o,u)=>o+u,0),i=0,a=4;for(let o=0;o<r;o+=a){let u=Math.min(a,r-o);await Promise.all(Array.from({length:u},(c,l)=>this.layerWeightsGpu(o+l))),await this.engine.settleGpu();for(let c=0;c<u;c++)i+=n[o+c];t?.(i,s)}await this.getFinalNormGpu(),await this.getProjectionQ8(e)}static q8RowsBlob(t,r,e,n,s){let i=s/32,a=e*s,o=n*s,u=r+e*i*2,c=n*i*2,l=new Uint8Array(o+c);return l.set(t.subarray(a,a+o),0),l.set(t.subarray(u,u+c),o),l}static q4RowsBlob(t,r,e,n,s){let i=s/32,a=0,o=r/2,u=r/2+r/32*2,c=n*s/2,l=n*i*2,d=new Uint8Array(c+l*2);return d.set(t.subarray(a+e*s/2,a+e*s/2+c),0),d.set(t.subarray(o+e*i*2,o+e*i*2+l),c),d.set(t.subarray(u+e*i*2,u+e*i*2+l),c+l),d}async embed(t,r){let e=this.manifest.tensors["token_embd.weight"],n=e.nElems/r,s=e.type==="Q8W",i=e.type==="Q4W",a=e.bytes/n;if(!s&&!i&&!Number.isInteger(a))throw new Error("token_embd: lignes non uniformes");let o=await this.rawTensor("token_embd.weight"),u=this.manifest.config.embedScale??1,c=new Float32Array(t.length*r);for(let l=0;l<t.length;l++){let d=t[l],p=s?pe.q8RowsBlob(o,e.nElems,d,1,r):i?pe.q4RowsBlob(o,e.nElems,d,1,r):o.subarray(d*a,(d+1)*a),g=await this.engine.dequantizeByType(e.type,p,r);if(u!==1)for(let m=0;m<r;m++)g[m]*=u;c.set(g,l*r)}return c}async getProjectionQ8(t){if(this.projQ8)return this.projQ8;let r=this.manifest.tensors["output.weight"]?"output.weight":"token_embd.weight",e=this.manifest.tensors[r];if(!e)throw new Error("Logits projection tensor not found (output.weight / token_embd.weight)");let n=e.nElems/t;this.projVocab=n;let s=await this.rawTensor(r),i=Math.max(1,Math.floor(this.engine.maxStorageBufferBindingSize*.9/t)),a=[];if(e.type==="Q4W"){for(let u=0;u<n;u+=i){let c=Math.min(i,n-u),l=pe.q4RowsBlob(s,e.nElems,u,c,t),d=c*t/2,p=c*(t/32)*2;a.push({w:{nib:this.engine.uploadGpuRaw(l.subarray(0,d)),sc:this.engine.uploadGpuRaw(l.subarray(d,d+p)),mn:this.engine.uploadGpuRaw(l.subarray(d+p))},rows:c,r0:u})}return this.projQ8=a,a}if(e.type==="PQ2_0"&&this.engine.pq2NativeOk&&this.engine.pq2HeadOk&&t%128===0&&e.bytes%n===0){let u=e.bytes/n,c=Math.max(1,Math.floor(this.engine.maxStorageBufferBindingSize*.9/u)),l=[];for(let p=0;p<n;p+=c){let g=Math.min(c,n-p);l.push({w:this.engine.uploadKq("PQ2_0",s.subarray(p*u,(p+g)*u)),rows:g,r0:p})}let d=null;for(let p of l)if(d=await this.engine.checkPq2Matrix(p.w,s.subarray(p.r0*u,(p.r0+p.rows)*u),t,p.rows),d)break;if(!d)return r==="output.weight"&&this.rawCache.delete(r),this.projQ8=l,l;for(let p of l)pe.destroyWeight(p.w);console.error(`[pq2head] t\xEAte PQ2_0 native KO (${d}) : repli int8`)}if(["Q6_K","Q4_K","Q5_K","Q8_0","Q4_0","Q5_0","PQ2_0"].includes(e.type)&&e.bytes%n===0){let u=e.bytes/n,c=Math.max(1,Math.floor(Math.min(this.engine.maxStorageBufferBindingSize*.9,256<<20)/(t*4))),l=globalThis,d=this.engine.device.createBuffer({size:c*t*4,usage:l.GPUBufferUsage.STORAGE|l.GPUBufferUsage.COPY_DST|l.GPUBufferUsage.COPY_SRC});for(let p=0;p<n;p+=c){let g=Math.min(c,n-p);this.engine.dequantizeIntoGpu(e.type,s.subarray(p*u,(p+g)*u),g*t,d),a.push({w:this.engine.f32ToQ8Gpu(d,g*t),rows:g,r0:p}),await this.engine.settleGpu()}return d.destroy(),r==="output.weight"&&this.rawCache.delete(r),this.projQ8=a,a}let o=e.type==="Q8W"?s:await this.engine.quantizeToBytes(e.type,s,e.nElems,"q8");for(let u=0;u<n;u+=i){let c=Math.min(i,n-u),l=pe.q8RowsBlob(o,e.nElems,u,c,t),d=c*t;a.push({w:{codes:this.engine.uploadGpuRaw(l.subarray(0,d)),sc:this.engine.uploadGpuRaw(l.subarray(d))},rows:c,r0:u})}return this.projQ8=a,a}async argmaxLogits(t,r){let e=await this.getProjectionQ8(r),n=0,s=-1/0;for(let i of e){let a=i.w.kq?await this.engine.matmulHandle(t,i.w,1,r,i.rows):i.w.nib?await this.engine.matmulQ4(t,i.w.nib,i.w.sc,i.w.mn,1,r,i.rows):await this.engine.matmulQ8(t,i.w.codes,i.w.sc,1,r,i.rows);for(let o=0;o<a.length;o++)a[o]>s&&(s=a[o],n=i.r0+o)}return n}archFlags(){let t=this.manifest.config;return{attnScale:t.attnScale,attnLogitSoftcap:t.attnLogitSoftcap,act:t.act,rmsGainOnePlus:t.rmsGainOnePlus,windowPerLayer:t.windowPerLayer,ropeThetaPerLayer:t.ropeThetaPerLayer,skipRopePerLayer:t.skipRopePerLayer,ropeInterleaved:pe.ropeNormOn?t.ropeInterleaved??(Fr(this.manifest.arch)||void 0):void 0}}mropePositions(t,r){let e=t+r,n=new Uint32Array(r*3),s=[...this.visionSegments].sort((c,l)=>c.at-l.at),i=(c,l,d,p)=>{c>=t&&c<e&&(n[(c-t)*3]=l,n[(c-t)*3+1]=d,n[(c-t)*3+2]=p)},a=0,o=0,u=0;for(;a<e;){let c=u<s.length?s[u]:null;if(c&&a===c.at){let l=o,d=c.gh*c.gw;for(let p=0;p<d;p++)i(a+p,l,l+Math.floor(p/c.gw),l+p%c.gw);o=l+Math.max(c.gh,c.gw),a+=d,u++}else i(a,o,o,o),o++,a++}return n}async getRopeFactors(){if(this.ropeFactorsCache!==void 0)return this.ropeFactorsCache;if(!pe.ropeFactorsOn)return console.warn("[model] facteurs RoPE COUP\xC9S par ?ropefactors=0 : RoPE standard"),this.ropeFactorsCache=null,null;if(this.manifest.tensors["rope_freqs.weight"])this.ropeFactorsCache=await this.dequant("rope_freqs.weight"),console.log("[model] rope_freqs.weight pr\xE9sent : RoPE \xE0 facteurs (scaling llama3) actif");else if(this.manifest.config.yarn){let{factor:t,betaFast:r,betaSlow:e,origCtx:n}=this.manifest.config.yarn,{headDim:s,ropeTheta:i}=this.manifest.config,a=s/2,o=d=>s*Math.log(n/(d*2*Math.PI))/(2*Math.log(i)),u=o(r),c=o(e),l=new Float32Array(a);for(let d=0;d<a;d++){let p=1-Math.min(1,Math.max(0,(d-u)/Math.max(.001,c-u)));l[d]=1/(1/t*(1-p)+p)}this.ropeFactorsCache=l,console.log(`[model] YaRN statique actif (factor ${t}, dims corr ${u.toFixed(1)}\u2013${c.toFixed(1)})`)}else this.ropeFactorsCache=null;return this.ropeFactorsCache}applyMrope(t,r,e){let n=this.manifest.config.mropeSections;if(n){if(!this.engine.mropeOk)throw new Error("M-RoPE indisponible sur ce GPU (selfValidate) : vision d\xE9sactiv\xE9e.");t.mropeSections=n,t.positions=this.mropePositions(r,e)}}static applyInjections(t,r,e,n,s){if(s)for(let i of s){let a=i.rows.length/r;for(let o=0;o<a;o++){let u=i.at+o-e;u>=0&&u<n&&t.set(i.rows.subarray(o*r,(o+1)*r),u*r)}}}get kvQuant(){return this.engine.kvQuant===!0}setKvQuant(t){this.engine.setKvQuant(t)}reset(){this.engine.clearKvCache(),this.visionSegments=[]}unload(){this.reset();for(let t of this.layerGpuCache.values())for(let r of Object.values(t))pe.destroyWeight(r);this.layerGpuCache.clear(),this.finalNormGpu?.destroy?.(),this.finalNormGpu=null;for(let t of this.projQ8??[])pe.destroyWeight(t.w);this.projQ8=null,this.layerCache.clear(),this.rawCache.clear(),this.layerSpan.clear()}async hiddenKV(t,r,e,n){let s=this.manifest,{d:i,nHeads:a,nKvHeads:o,headDim:u,ffn:c,blockCount:l,ropeTheta:d,rmsEps:p}=s.config,g={seq:t.length,d:i,nHeads:a,nKvHeads:o,headDim:u,ffn:c,ropeTheta:d,eps:p,...this.archFlags()};this.applyMrope(g,r,t.length),g.ropeFactors=await this.getRopeFactors()??void 0;let m=await this.embed(t,i);pe.applyInjections(m,i,r,t.length,n);let b=await Promise.all(Array.from({length:l},(U,A)=>this.layerWeightsGpu(A))),v=await this.getFinalNormGpu();return this.engine.runDecodeGpu(m,g,b,r,v,e)}async generateNextKV(t,r,e,n){let s=await this.hiddenKV(t,r,e,n);return this.argmaxLogits(s,this.manifest.config.d)}async logitsKV(t,r,e,n){let s=this.manifest,{d:i,nHeads:a,nKvHeads:o,headDim:u,ffn:c,blockCount:l,ropeTheta:d,rmsEps:p}=s.config,g={seq:t.length,d:i,nHeads:a,nKvHeads:o,headDim:u,ffn:c,ropeTheta:d,eps:p,...this.archFlags()};this.applyMrope(g,r,t.length),g.ropeFactors=await this.getRopeFactors()??void 0;let m=pe.timingOn?(P,G)=>console.info(`[timing] ${P} ${(performance.now()-G).toFixed(0)} ms`):null,b=performance.now(),v=await this.embed(t,i);m?.("embed",b),b=performance.now(),pe.applyInjections(v,i,r,t.length,n);let U=await Promise.all(Array.from({length:l},(P,G)=>this.layerWeightsGpu(G)));m?.("poids des couches",b),b=performance.now();let A=await this.getFinalNormGpu(),F=await this.getProjectionQ8(i);m?.("norme finale + t\xEAte de projection",b),b=performance.now();let T=await this.engine.decodeLogitsQ8(v,g,U,r,A,e,F,this.projVocab);m?.("forward + logits",b);let K=s.config.finalLogitSoftcap;if(K&&K>0)for(let P=0;P<T.length;P++)T[P]=K*Math.tanh(T[P]/K);return T}async topKKV(t,r,e,n,s,i){let a=this.manifest,{d:o,nHeads:u,nKvHeads:c,headDim:l,ffn:d,blockCount:p,ropeTheta:g,rmsEps:m}=a.config,b={seq:t.length,d:o,nHeads:u,nKvHeads:c,headDim:l,ffn:d,ropeTheta:g,eps:m,...this.archFlags()};this.applyMrope(b,r,t.length),b.ropeFactors=await this.getRopeFactors()??void 0;let v=pe.timingOn?(G,_)=>console.info(`[timing] ${G} ${(performance.now()-_).toFixed(0)} ms`):null,U=performance.now(),A=await this.embed(t,o);v?.("embed",U),U=performance.now(),pe.applyInjections(A,o,r,t.length,i);let F=await Promise.all(Array.from({length:p},(G,_)=>this.layerWeightsGpu(_)));v?.("poids des couches",U),U=performance.now();let T=await this.getFinalNormGpu(),K=await this.getProjectionQ8(o);v?.("norme finale + tete de projection",U),U=performance.now();let P=await this.engine.decodeTopKQ8(A,b,F,r,T,e,K,this.projVocab,n,s,a.config.finalLogitSoftcap??0);return v?.("forward + top-k",U),P}get batchAvailable(){return!this.engine.kvQuant&&!this.manifest.config.mropeSections&&this.engine.gemvMOk}async topKBatch(t,r,e,n,s){let i=this.manifest,{d:a,nHeads:o,nKvHeads:u,headDim:c,ffn:l,blockCount:d,ropeTheta:p,rmsEps:g}=i.config,m={seq:t.length,d:a,nHeads:o,nKvHeads:u,headDim:c,ffn:l,ropeTheta:p,eps:g,...this.archFlags()};m.ropeFactors=await this.getRopeFactors()??void 0;let b=await this.embed(t,a),v=await Promise.all(Array.from({length:d},(F,T)=>this.layerWeightsGpu(T))),U=await this.getFinalNormGpu(),A=await this.getProjectionQ8(a);return this.engine.decodeTopKBatch(b,m,v,r,e,U,A,this.projVocab,n,s,i.config.finalLogitSoftcap??0)}async debugHiddenPerLayer(t){let r=this.manifest,{d:e,nHeads:n,nKvHeads:s,headDim:i,ffn:a,blockCount:o,ropeTheta:u,rmsEps:c}=r.config,d={seq:t.length,d:e,nHeads:n,nKvHeads:s,headDim:i,ffn:a,ropeTheta:u,eps:c,...this.archFlags()};d.ropeFactors=await this.getRopeFactors()??void 0;let p=await this.embed(t,e),g=[];for(let m=0;m<o;m++)p=await this.engine.layerForward(p,d,await this.layerWeights(m),!0),g.push(Float32Array.from(p));return g}};pe.timingOn=(()=>{try{return ie("timing")==="1"}catch{return!1}})(),pe.ropeNormOn=(()=>{try{return ie("ropenorm")!=="0"}catch{return!0}})(),pe.unpermOn=(()=>{try{return ie("unperm")!=="0"}catch{return!0}})(),pe.ropeFactorsOn=(()=>{try{return ie("ropefactors")!=="0"}catch{return!0}})();_e=pe});var ze,Ee,Bt=ce(()=>{"use strict";nt();Pt();xt();ze=class ze extends _e{constructor(r,e,n){super(r,e,n);this.kv=new Map;this.kvSession=""}async mat(r,e,n){let s=this.manifest.tensors[r],i=e??await this.rawTensor(r),a=n??s.nElems;if(this.engine.kqOk&&!ze.q4Requant&&s.shape[0]%256===0&&(s.type==="Q4_K"||s.type==="Q6_K"&&ze.q6Native))return this.engine.uploadKq(s.type,i);if(s.type==="PQ2_0"&&this.engine.pq2NativeOk&&s.shape[0]%128===0)return this.engine.uploadKq("PQ2_0",i);let u=this.engine.dequantizeToGpu(s.type,i,a),c=ze.q4Requant&&(s.type==="Q4_K"||s.type==="Q4_0"||s.type==="Q4_1")?this.engine.f32ToQ4Gpu(u,a):this.engine.f32ToQ8Gpu(u,a);return u.destroy?.(),c}up(r){return this.engine.uploadGpu(r)}layerBytes(r){let e=new Array(r).fill(0);for(let[n,s]of Object.entries(this.manifest.tensors)){let i=n.match(/^blk\.(\d+)\./);i&&Number(i[1])<r&&(e[Number(i[1])]+=s.bytes)}return e}dropLayerBytes(r){for(let e of this.rawCache.keys())e.startsWith(`blk.${r}.`)&&this.rawCache.delete(e);this.layerSpan.delete(r)}async embed(r,e){let n=this.manifest.tensors["token_embd.weight"],s=n.type==="Q6_K"?Ve:n.type==="Q4_K"?et:n.type==="PQ2_0"?(c,l)=>We(c,l*2):null;if(!s)return super.embed(r,e);let i=await this.rawTensor("token_embd.weight"),a=e/256*(n.type==="Q6_K"?210:n.type==="PQ2_0"?68:144),o=this.manifest.config.embedScale??1,u=new Float32Array(r.length*e);for(let c=0;c<r.length;c++){let l=s(i.subarray(r[c]*a,(r[c]+1)*a),e/256);for(let d=0;d<e;d++)u[c*e+d]=l[d]*o}return u}async getProjectionQ8(r){if(this.projQ8)return this.projQ8;let e=this.manifest.tensors["output.weight"]?"output.weight":"token_embd.weight",n=this.manifest.tensors[e];if(!["Q6_K","Q4_K","Q5_K","Q8_0","Q4_0","Q5_0"].includes(n.type))return super.getProjectionQ8(r);let i=n.nElems/r;this.projVocab=i;let a=await this.rawTensor(e),o=n.bytes/i;if(n.type==="Q6_K"&&this.engine.kqOk&&!ze.q4Requant&&ze.q6Native){let p=Math.max(1,Math.floor(this.engine.maxStorageBufferBindingSize*.9/o)),g=[];for(let m=0;m<i;m+=p){let b=Math.min(p,i-m);g.push({w:this.engine.uploadKq("Q6_K",a.subarray(m*o,(m+b)*o)),rows:b,r0:m})}return this.projQ8=g,g}let u=Math.max(1,Math.floor(Math.min(this.engine.maxStorageBufferBindingSize*.9,256<<20)/(r*4))),c=[],l=globalThis,d=this.engine.device.createBuffer({size:u*r*4,usage:l.GPUBufferUsage.STORAGE|l.GPUBufferUsage.COPY_DST|l.GPUBufferUsage.COPY_SRC});for(let p=0;p<i;p+=u){let g=Math.min(u,i-p);this.engine.dequantizeIntoGpu(n.type,a.subarray(p*o,(p+g)*o),g*r,d),c.push({w:this.engine.f32ToQ8Gpu(d,g*r),rows:g,r0:p}),await this.engine.settleGpu()}return d.destroy(),e==="output.weight"&&this.rawCache.delete(e),this.projQ8=c,c}ensureKv(r,e,n){let s=this.kv.get(r);if(s&&s.cap>=e)return s;let i=Math.max(e,(s?.cap??0)+1024,1024),a=globalThis,o=()=>this.engine.device.createBuffer({size:i*n*4,usage:a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST|a.GPUBufferUsage.COPY_SRC}),u=o(),c=o();if(s){let d=this.engine.device.createCommandEncoder();d.copyBufferToBuffer(s.k,0,u,0,s.cap*n*4),d.copyBufferToBuffer(s.v,0,c,0,s.cap*n*4),this.engine.device.queue.submit([d.finish()]),s.k.destroy?.(),s.v.destroy?.()}let l={k:u,v:c,cap:i};return this.kv.set(r,l),l}resetState(){for(let r of this.kv.values())r.k.destroy?.(),r.v.destroy?.();this.kv.clear(),this.kvSession=""}reset(){this.resetState(),super.reset()}async prepare(r,e,n){(n!==this.kvSession||e===0)&&(this.resetState(),this.kvSession=n);let{d:s}=this.manifest.config,[i,a,o]=await Promise.all([this.embed(r,s),this.prepareInputs(r),this.getProjectionQ8(s)]);return await this.getFinalNormGpu(),{embeds:i,extra:a,tiles:o}}recordTopK(r,e,n,s,i,a,o=64){let u=this.engine,c=this.manifest.config.finalLogitSoftcap??0;if(c>0){let p=u.uniform([s],{offset:4,value:c});u.recordPass(r,"softcap_logits",[p,n],u.grid1D(s)),e.push(p)}if(a&&a!==1&&i.length){let p=Uint32Array.from(i),g=u.storage(Math.max(16,p.byteLength));e.push(g),u.device.queue.writeBuffer(g,0,p);let m=u.uniform([p.length],{offset:4,value:a});u.recordPass(r,"penalize_logits",[m,g,n],u.grid1D(p.length)),e.push(m)}let l=u.storage(o*2*4);e.push(l);let d=u.uniform([s,o]);return e.push(d),u.recordPass(r,u.topKParOk?"top_k_par":"top_k",[d,n,l],[1,1,1]),l}recordHead(r,e,n,s,i){let a=this.engine,{d:o}=this.manifest.config,u=this.projVocab,c=a.storage(s*u*4);e.push(c);for(let l of i){let d=a.recMM(r,e,n,l.w,s,o,l.rows,!1);for(let p=0;p<s;p++)r.copyBufferToBuffer(d,p*l.rows*4,c,(p*u+l.r0)*4,l.rows*4)}return c}async readTopKs(r,e,n=64){let s=this.engine,i=globalThis,a=s.device.createBuffer({size:e.length*n*8,usage:i.GPUBufferUsage.COPY_DST|i.GPUBufferUsage.MAP_READ});e.forEach((u,c)=>r.copyBufferToBuffer(u,0,a,c*n*8,n*8)),s.device.queue.submit([r.finish()]),await a.mapAsync(i.GPUMapMode.READ);let o=new Uint32Array(a.getMappedRange().slice(0));return a.unmap(),a.destroy(),e.map((u,c)=>({ids:o.slice(c*2*n,c*2*n+n),vals:new Float32Array(o.buffer,(c*2*n+n)*4,n)}))}async topKKV(r,e,n,s,i){let a=this.engine,{embeds:o,extra:u,tiles:c}=await this.prepare(r,e,n),l=[],d=a.device.createCommandEncoder(),p=this.recordForward(d,l,o,u,r.length,e),g=this.recordHead(d,l,p,1,c),m=this.recordTopK(d,l,g,this.projVocab,s,i),[b]=await this.readTopKs(d,[m]);return a.release(l),b}async logitsKV(r,e,n){let s=this.engine,i=_e.timingOn?(A,F)=>console.info(`[timing:graph] ${A} ${(performance.now()-F).toFixed(1)} ms`):null,a=performance.now(),{embeds:o,extra:u,tiles:c}=await this.prepare(r,e,n);i?.("pr\xE9paration CPU",a),a=performance.now();let{d:l}=this.manifest.config,d=this.projVocab,p=[],g=s.device.createCommandEncoder(),m=this.recordForward(g,p,o,u,r.length,e),b=s.storage(d*4);p.push(b);for(let A of c){let F=s.recMM(g,p,m,A.w,1,l,A.rows,!1);g.copyBufferToBuffer(F,0,b,A.r0*4,A.rows*4)}i?.(`enregistrement (${p.length} buffers)`,a),a=performance.now(),s.device.queue.submit([g.finish()]);let v=await s.readBack(b,d*4);i?.("GPU (submit \u2192 readback)",a),s.release(p);let U=this.manifest.config.finalLogitSoftcap??0;if(U>0)for(let A=0;A<v.length;A++)v[A]=U*Math.tanh(v[A]/U);return v}};ze.q4Requant=(()=>{try{return ie("q4req")==="1"}catch{return!1}})(),ze.q6Native=(()=>{try{return ie("q6k")==="1"}catch{return!1}})();Ee=ze});var In,Xt,Vn=ce(()=>{"use strict";nt();Pt();ct();Bt();In="per_layer_token_embd.weight",Xt=class extends Ee{constructor(r,e,n){super(r,e,n);this.layers=[];this.ones256=null;this.ones512=null;this.ropeFf=null;this.pleNormW=null;this.pleChunks=new Map;this.pleProjCache=null;if(!n.config.gemma4)throw new Error("Gemma4Model : manifeste sans config gemma4")}get g4(){return this.manifest.config.gemma4}async loadLayer(r){await this.ensureLayerSpan(r);let e=`blk.${r}`,n=r<this.g4.nLayerKv,s=async G=>this.up(await this.dequant(`${e}.${G}.weight`)),[i,a,o,u,c,l,d]=await Promise.all([s("attn_norm"),s("attn_q_norm"),n?s("attn_k_norm"):Promise.resolve(void 0),s("post_attention_norm"),s("ffn_norm"),s("post_ffw_norm"),s("post_norm")]),p=this.manifest.tensors[`${e}.layer_output_scale.weight`]?(await this.dequant(`${e}.layer_output_scale.weight`))[0]:1,g=await this.mat(`${e}.attn_q.weight`),m=n?await this.mat(`${e}.attn_k.weight`):void 0,b=n&&this.manifest.tensors[`${e}.attn_v.weight`]?await this.mat(`${e}.attn_v.weight`):void 0,v=await this.mat(`${e}.attn_output.weight`),U=await this.mat(`${e}.ffn_gate.weight`),A=await this.mat(`${e}.ffn_up.weight`),F=await this.mat(`${e}.ffn_down.weight`),T=await this.mat(`${e}.inp_gate.weight`),K=await this.mat(`${e}.proj.weight`),P=await this.pleProjection(r);return this.dropLayerBytes(r),{attnNorm:i,qNorm:a,kNorm:o,postAttnNorm:u,ffnNorm:c,postFfnNorm:l,postNorm:d,wq:g,wk:m,wv:b,wo:v,wgate:U,wup:A,wdown:F,inpGate:T,proj:K,wPle:P,outScale:p}}async pleProjection(r){let e="per_layer_model_proj.weight",n=this.manifest.tensors[e],{d:s}=this.manifest.config,i=this.g4.perLayer;this.pleProjCache||(this.pleProjCache=await this.rawTensor(e));let a=this.pleProjCache,o=i*s,u=new Float32Array(o),c=1/Math.sqrt(s);if(n.type==="BF16"){let p=new Uint16Array(a.buffer,a.byteOffset+r*o*2,o),g=new Uint32Array(u.buffer);for(let m=0;m<o;m++)g[m]=p[m]<<16;for(let m=0;m<o;m++)u[m]*=c}else if(n.type==="F32"){u.set(new Float32Array(a.buffer.slice(a.byteOffset+r*o*4,a.byteOffset+(r+1)*o*4)));for(let p=0;p<o;p++)u[p]*=c}else throw new Error(`Gemma 4 : per_layer_model_proj en ${n.type} non g\xE9r\xE9 (BF16/F32 attendus)`);let l=this.up(u),d=this.engine.f32ToQ8Gpu(l,o);return l.destroy?.(),d}async prewarmGpu(r){if(!this.engine.gemma4Ok)throw new Error("Gemma 4 indisponible sur ce GPU (selfValidate, ou ?gemma4=0).");let{blockCount:e,d:n}=this.manifest.config,s=this.layerBytes(e),i=s.reduce((c,l)=>c+l,0),a=0;this.ones256=this.up(new Float32Array(this.g4.headDimSwa).fill(1)),this.ones512=this.up(new Float32Array(this.manifest.config.headDim).fill(1));let o=this.manifest.tensors["rope_freqs.weight"]?await this.dequant("rope_freqs.weight"):new Float32Array(this.manifest.config.headDim/2).fill(1);this.ropeFf=this.up(o);let u=await this.dequant("per_layer_proj_norm.weight");this.pleNormW=this.up(u.map(c=>c*Math.SQRT1_2));for(let c=0;c<e;c++)this.layers[c]=await this.loadLayer(c),await this.engine.settleGpu(),a+=s[c],r?.(a,i);this.pleProjCache=null,this.rawCache.delete("per_layer_model_proj.weight"),await this.getFinalNormGpu(),await this.getProjectionQ8(n),await this.engine.settleGpu()}async pleChunk(r){let e=this.pleChunks.get(r);if(e)return this.pleChunks.delete(r),this.pleChunks.set(r,e),e;let n=this.manifest.tensors[In],s=r*Re,i=await this.source.bytes(n.offset+s,Math.min(Re,n.bytes-s));return this.pleChunks.set(r,i),this.pleChunks.size>32&&this.pleChunks.delete(this.pleChunks.keys().next().value),i}async pleRow(r){let e=this.manifest.tensors[In],n=e.shape[0];if(e.type!=="Q6_K")throw new Error(`Gemma 4 : table PLE en ${e.type} non g\xE9r\xE9e (Q6_K attendu)`);let s=n/256*210,i=r*s,a=Math.floor(i/Re),o=Math.floor((i+s-1)/Re),u;if(a===o)u=(await this.pleChunk(a)).subarray(i-a*Re,i-a*Re+s);else{let d=await this.pleChunk(a),p=await this.pleChunk(o);u=new Uint8Array(s);let g=o*Re-i;u.set(d.subarray(i-a*Re),0),u.set(p.subarray(0,s-g),g)}let c=Ve(u,n/256),l=Math.sqrt(this.g4.perLayer)*Math.SQRT1_2;for(let d=0;d<c.length;d++)c[d]*=l;return c}async pleInputs(r){let e=this.manifest.config.blockCount,n=this.g4.perLayer,s=r.length,i=new Float32Array(e*s*n);for(let a=0;a<s;a++){let o=await this.pleRow(r[a]);for(let u=0;u<e;u++)i.set(o.subarray(u*n,(u+1)*n),(u*s+a)*n)}return i}prepareInputs(r){return this.pleInputs(r)}unload(){this.resetState();for(let r of this.layers)for(let e of Object.values(r))typeof e!="number"&&_e.destroyWeight(e);this.layers=[];for(let r of[this.ones256,this.ones512,this.ropeFf,this.pleNormW])r?.destroy?.();this.pleChunks.clear(),super.unload()}recordForward(r,e,n,s,i,a,o,u){let c=this.engine,l=this.manifest.config,d=this.g4,{d:p,nHeads:g,nKvHeads:m,ffn:b,rmsEps:v}=l,U=d.perLayer,A=a+i,F=h=>{let y=c.storage(h.byteLength);return c.device.queue.writeBuffer(y,0,h),e.push(y),y},T=F(n),K=T,P=F(s);for(let h=0;h<l.blockCount;h++){let y=e.length,k=this.layers[h],w=(te,re,Z)=>(u&&u.layer===h&&u.out.set(te,{buf:re,cols:Z}),re),x=d.swa[h],B=x?d.headDimSwa:l.headDim,q=x?d.ropeThetaSwa:l.ropeTheta,M=g*B,O=m*B,C=(te,re,Z)=>x?c.recRope(r,e,te,re,B,Z,a,q,!1):c.recRopeFactors(r,e,te,this.ropeFf,re,B,Z,a,q,!1),S=c.storage(i*U*4);e.push(S),r.copyBufferToBuffer(P,h*i*U*4,S,0,i*U*4);let R=c.recRmsnorm(r,e,c.recMM(r,e,K,k.wPle,i,p,U,!1),this.pleNormW,i,U,v),E=w("inp_per_layer (permuted) (cont) (view)",c.recBinary(r,e,"add",R,S,i*U),U);h===0&&w("inp_scaled",T,p);let W=w(`attn_norm-${h}`,c.recRmsnorm(r,e,T,k.attnNorm,i,p,v),p),N=c.recMM(r,e,W,k.wq,i,p,M,!1);N=C(c.recRmsnorm(r,e,N,k.qNorm,i*g,B,v),i*g,g);let I=d.kvSrc[h],$=this.ensureKv(I,A,O);if(I===h){let te=c.recMM(r,e,W,k.wk,i,p,O,!1),re=k.wv?c.recMM(r,e,W,k.wv,i,p,O,!1):te,Z=C(c.recRmsnorm(r,e,te,k.kNorm,i*m,B,v),i*m,m),oe=c.recRmsnorm(r,e,re,x?this.ones256:this.ones512,i*m,B,v);r.copyBufferToBuffer(Z,0,$.k,a*O*4,i*O*4),r.copyBufferToBuffer(oe,0,$.v,a*O*4,i*O*4)}let D=w(`kqv_out-${h}`,c.recAttention(r,e,N,$.k,$.v,i,g,m,B,A,a,1,0,x?d.window:0),M),z=c.recRmsnorm(r,e,c.recMM(r,e,D,k.wo,i,M,p,!1),k.postAttnNorm,i,p,v),L=w(`attn_out-${h}`,c.recBinary(r,e,"add",z,T,i*p),p),j=c.recRmsnorm(r,e,L,k.ffnNorm,i,p,v),Q=c.recBinary(r,e,"geglu",c.recMM(r,e,j,k.wgate,i,p,b,!1),c.recMM(r,e,j,k.wup,i,p,b,!1),i*b),X=c.recRmsnorm(r,e,w(`ffn_out-${h}`,c.recMM(r,e,Q,k.wdown,i,b,p,!1),p),k.postFfnNorm,i,p,v),V=w(`pe_in-${h}`,c.recBinary(r,e,"add",X,L,i*p),p),H=c.recBinary(r,e,"geglu",c.recMM(r,e,V,k.inpGate,i,p,U,!1),E,i*U),Y=w(`per_layer_embd_out-${h}`,c.recRmsnorm(r,e,c.recMM(r,e,H,k.proj,i,U,p,!1),k.postNorm,i,p,v),p),J=c.recBinary(r,e,"add",V,Y,i*p);T=k.outScale!==1?c.recScale(r,e,J,k.outScale,i*p):J,w(`l_out-${h}`,T,p),o?.push(T),!o&&!u&&c.recycleStorage(e.slice(y).filter(te=>te!==T))}let G=c.recRmsnorm(r,e,T,this.finalNormGpu,i,p,v),_=c.storage(p*4);return e.push(_),r.copyBufferToBuffer(G,(i-1)*p*4,_,0,p*4),_}async debugLayerOutputs(r){let e=this.engine,{embeds:n,extra:s}=await this.prepare(r,0,"debug-layers"),{d:i}=this.manifest.config,a=[],o=[],u=e.device.createCommandEncoder();this.recordForward(u,a,n,s,r.length,0,o),e.device.queue.submit([u.finish()]);let c=[];for(let l of o)c.push(await e.readBack(l,r.length*i*4));return e.release(a),c}async debugLayerSteps(r,e){let n=this.engine,{embeds:s,extra:i}=await this.prepare(r,0,"debug-steps"),a=[],o={layer:e,out:new Map},u=n.device.createCommandEncoder();this.recordForward(u,a,s,i,r.length,0,void 0,o),n.device.queue.submit([u.finish()]);let c=new Map;for(let[l,{buf:d,cols:p}]of o.out)c.set(l,{data:await n.readBack(d,r.length*p*4),cols:p});return n.release(a),c}}});function Oi(f,t){let r={Q4_K:144,Q5_K:176,Q6_K:210,Q8_K:292},e={Q8_0:34,Q4_0:18,Q4_1:20,Q5_0:22,Q5_1:24};if(r[f])return t/256*r[f];if(e[f])return t/32*e[f];if(f==="F16"||f==="BF16")return t*2;if(f==="F32")return t*4;throw new Error(`Spark : type ${f} non g\xE9r\xE9 pour attn_qkv`)}var Jt,Yn=ce(()=>{"use strict";nt();Bt();Jt=class extends Ee{constructor(r,e,n){super(r,e,n);this.layers=[];if(!n.config.spark)throw new Error("SparkModel : manifeste sans config spark")}get sp(){return this.manifest.config.spark}async loadLayer(r){await this.ensureLayerSpan(r);let e=`blk.${r}`,{d:n,nHeads:s,nKvHeads:i,headDim:a}=this.manifest.config,[o,u]=await Promise.all([this.dequant(`${e}.attn_norm.weight`).then(_=>this.up(_)),this.dequant(`${e}.ffn_norm.weight`).then(_=>this.up(_))]),c=`${e}.attn_qkv.weight`,l=this.manifest.tensors[c],d=await this.rawTensor(c),p=Oi(l.type,n),g=s*a,m=i*a,b=(_,h)=>this.mat(c,d.subarray(_*p,(_+h)*p),h*n),v=await b(0,g),U=await b(g,m),A=await b(g+m,m),F=await this.mat(`${e}.attn_gate.weight`),T=await this.mat(`${e}.attn_output.weight`),K=await this.mat(`${e}.ffn_gate.weight`),P=await this.mat(`${e}.ffn_up.weight`),G=await this.mat(`${e}.ffn_down.weight`);return this.dropLayerBytes(r),{attnNorm:o,ffnNorm:u,wq:v,wk:U,wv:A,wg:F,wo:T,wgate:K,wup:P,wdown:G}}async prewarmGpu(r){if(!this.engine.sparkOk)throw new Error("Spark-X2.5 indisponible sur ce GPU (selfValidate, ou ?spark=0).");let{blockCount:e,d:n}=this.manifest.config,s=this.layerBytes(e),i=s.reduce((o,u)=>o+u,0),a=0;for(let o=0;o<e;o++)this.layers[o]=await this.loadLayer(o),await this.engine.settleGpu(),a+=s[o],r?.(a,i);await this.getFinalNormGpu(),await this.getProjectionQ8(n),await this.engine.settleGpu()}prepareInputs(){return Promise.resolve(null)}unload(){this.resetState();for(let r of this.layers)for(let e of Object.values(r))_e.destroyWeight(e);this.layers=[],super.unload()}recordForward(r,e,n,s,i,a,o){let u=this.engine,c=this.manifest.config,l=this.sp,{d,nHeads:p,nKvHeads:g,headDim:m,ffn:b,rmsEps:v}=c,U=p*m,A=g*m,F=a+i,T=u.storage(n.byteLength);e.push(T),u.device.queue.writeBuffer(T,0,n);let K=T;for(let _=0;_<c.blockCount;_++){let h=e.length,y=this.layers[_],k=l.swa[_],w=k?l.ropeThetaSwa:c.ropeTheta,x=k?l.nRotSwa:l.nRot,B=(D,z)=>x>=m?u.recRope(r,e,D,i*z,m,z,a,w,!1):u.recRopePartial(r,e,D,i*z,m,z,a,w,x),q=u.recRmsnorm(r,e,K,y.attnNorm,i,d,v),M=B(u.recMM(r,e,q,y.wq,i,d,U,!1),p),O=B(u.recMM(r,e,q,y.wk,i,d,A,!1),g),C=u.recMM(r,e,q,y.wv,i,d,A,!1),S=this.ensureKv(_,F,A);r.copyBufferToBuffer(O,0,S.k,a*A*4,i*A*4),r.copyBufferToBuffer(C,0,S.v,a*A*4,i*A*4);let R=u.recAttention(r,e,M,S.k,S.v,i,p,g,m,F,a,1/Math.sqrt(m),0,k?l.window:0),E=u.recMM(r,e,q,y.wg,i,d,p,!1),W=u.recHeadGate(r,e,R,E,i*U,m),N=u.recBinary(r,e,"add",u.recMM(r,e,W,y.wo,i,U,d,!1),K,i*d),I=u.recRmsnorm(r,e,N,y.ffnNorm,i,d,v),$=u.recBinary(r,e,"geglu",u.recMM(r,e,I,y.wgate,i,d,b,!1),u.recMM(r,e,I,y.wup,i,d,b,!1),i*b);K=u.recBinary(r,e,"add",u.recMM(r,e,$,y.wdown,i,b,d,!1),N,i*d),o?.push(K),o||u.recycleStorage(e.slice(h).filter(D=>D!==K))}let P=u.recRmsnorm(r,e,K,this.finalNormGpu,i,d,v),G=u.storage(d*4);return e.push(G),r.copyBufferToBuffer(P,(i-1)*d*4,G,0,d*4),G}async debugLayerOutputs(r){let e=this.engine,{embeds:n}=await this.prepare(r,0,"debug-layers"),{d:s}=this.manifest.config,i=[],a=[],o=e.device.createCommandEncoder();this.recordForward(o,i,n,null,r.length,0,a),e.device.queue.submit([o.finish()]);let u=[];for(let c of a)u.push(await e.readBack(c,r.length*s*4));return e.release(i),u}}});var Zt,Xn=ce(()=>{"use strict";nt();Bt();Zt=class extends Ee{constructor(r,e,n){super(r,e,n);this.layers=[];this.finalNormW=null;let s=n.config.k2h;if(!s)throw new Error("K2hModel : manifeste sans config k2h");if(s.nExpert>0)throw new Error("K2-Horizon : variante \xE0 experts (MoE/MoVA) non g\xE9r\xE9e \u2014 seul le mod\xE8le dense l'est");if(n.tensors["blk.0.attn_q_norm.weight"]||n.tensors["blk.0.attn_gate.weight"])throw new Error("K2-Horizon : q/k norm ou porte d'attention non g\xE9r\xE9es")}get groups(){return this.manifest.config.k2h.normGroups}async loadLayer(r){await this.ensureLayerSpan(r);let e=`blk.${r}`,n=async i=>this.up(await this.dequant(`${e}.${i}.weight`)),s={attnNorm:await n("attn_norm"),ffnNorm:await n("ffn_norm"),wq:await this.mat(`${e}.attn_q.weight`),wk:await this.mat(`${e}.attn_k.weight`),wv:await this.mat(`${e}.attn_v.weight`),wo:await this.mat(`${e}.attn_output.weight`),wgate:await this.mat(`${e}.ffn_gate.weight`),wup:await this.mat(`${e}.ffn_up.weight`),wdown:await this.mat(`${e}.ffn_down.weight`)};return this.dropLayerBytes(r),s}async prewarmGpu(r){if(!this.engine.k2hOk)throw new Error("K2-Horizon indisponible sur ce GPU (selfValidate, ou ?k2h=0).");let{blockCount:e,d:n}=this.manifest.config,s=this.layerBytes(e),i=s.reduce((o,u)=>o+u,0),a=0;for(let o=0;o<e;o++)this.layers[o]=await this.loadLayer(o),await this.engine.settleGpu(),a+=s[o],r?.(a,i);this.finalNormW=this.up(await this.dequant("output_norm.weight")),await this.getProjectionQ8(n),await this.engine.settleGpu()}prepareInputs(){return Promise.resolve(null)}unload(){this.resetState();for(let r of this.layers)for(let e of Object.values(r))_e.destroyWeight(e);this.layers=[],this.finalNormW?.destroy?.(),super.unload()}recordForward(r,e,n,s,i,a){let o=this.engine,u=this.manifest.config,{d:c,nHeads:l,nKvHeads:d,headDim:p,ffn:g,rmsEps:m,ropeTheta:b}=u,v=this.groups,U=l*p,A=d*p,F=a+i,T=o.storage(n.byteLength);e.push(T),o.device.queue.writeBuffer(T,0,n);let K=T;for(let _=0;_<u.blockCount;_++){let h=e.length,y=this.layers[_],k=o.recRmsnormGrouped(r,e,K,y.attnNorm,i,c,v,m),w=o.recRope(r,e,o.recMM(r,e,k,y.wq,i,c,U,!1),i*l,p,l,a,b,!1),x=o.recRope(r,e,o.recMM(r,e,k,y.wk,i,c,A,!1),i*d,p,d,a,b,!1),B=o.recMM(r,e,k,y.wv,i,c,A,!1),q=this.ensureKv(_,F,A);r.copyBufferToBuffer(x,0,q.k,a*A*4,i*A*4),r.copyBufferToBuffer(B,0,q.v,a*A*4,i*A*4);let M=o.recAttention(r,e,w,q.k,q.v,i,l,d,p,F,a,1/Math.sqrt(p),0,0),O=o.recBinary(r,e,"add",o.recMM(r,e,M,y.wo,i,U,c,!1),K,i*c),C=o.recRmsnormGrouped(r,e,O,y.ffnNorm,i,c,v,m),S=o.recBinary(r,e,"swiglu",o.recMM(r,e,C,y.wgate,i,c,g,!1),o.recMM(r,e,C,y.wup,i,c,g,!1),i*g);K=o.recBinary(r,e,"add",o.recMM(r,e,S,y.wdown,i,g,c,!1),O,i*c),o.recycleStorage(e.slice(h).filter(R=>R!==K))}let P=o.recRmsnormGrouped(r,e,K,this.finalNormW,i,c,v,m),G=o.storage(c*4);return e.push(G),r.copyBufferToBuffer(P,(i-1)*c*4,G,0,c*4),G}}});var tr,er,Jn=ce(()=>{"use strict";nt();Pt();Bt();xt();tr=class tr extends Ee{constructor(r,e,n){super(r,e,n);this.layers=[];this.hd=null;this.mtp=null;this.convState=new Map;this.ssmState=new Map;this.convSnap=new Map;this.ssmSnap=new Map;this.hLast=null;this.hVerify=null;if(!n.config.qwen35)throw new Error("Qwen35Model : manifeste sans config qwen35")}get q(){return this.manifest.config.qwen35}get nLayer(){return this.q.nLayer}isRecurrent(r){return(r+1)%this.q.fullAttnInterval!==0}get ssm(){let r=this.q.dState,e=this.q.nGroup,n=this.q.dtRank;return{S:r,Hk:e,Hv:n,kOff:e*r,vOff:2*e*r,C:2*e*r+n*r,dInner:n*r}}async splitQGate(r){let e=await this.rawTensor(r),{nHeads:n,headDim:s,d:i}=this.manifest.config,a=2*n*s,o=e.byteLength/a;if(!Number.isInteger(o))throw new Error(`${r} : lignes non uniformes`);let u=new Uint8Array(n*s*o),c=new Uint8Array(n*s*o);for(let d=0;d<n;d++){let p=d*2*s*o,g=d*s*o,m=s*o;u.set(e.subarray(p,p+m),g),c.set(e.subarray(p+m,p+2*m),g)}let l=n*s*i;return[await this.mat(r,u,l),await this.mat(r,c,l)]}async splitEh(r){let e=await this.rawTensor(r),{d:n}=this.manifest.config,s=e.byteLength/n,i=s/2;if(!Number.isInteger(i))throw new Error(`${r} : lignes non coupables en deux`);let a=new Uint8Array(n*i),o=new Uint8Array(n*i);for(let u=0;u<n;u++)a.set(e.subarray(u*s,u*s+i),u*i),o.set(e.subarray(u*s+i,(u+1)*s),u*i);return[await this.mat(r,a,n*n),await this.mat(r,o,n*n)]}async loadAttn(r){let e=async i=>this.up(await this.dequant(`${r}.${i}`)),[n,s]=await this.splitQGate(`${r}.attn_q.weight`);return{wq:n,wqGate:s,wk:await this.mat(`${r}.attn_k.weight`),wv:await this.mat(`${r}.attn_v.weight`),wo:await this.mat(`${r}.attn_output.weight`),qNorm:await e("attn_q_norm.weight"),kNorm:await e("attn_k_norm.weight")}}async loadLayer(r){await this.ensureLayerSpan(r);let e=`blk.${r}`,n=async a=>this.up(await this.dequant(`${e}.${a}`)),s=this.isRecurrent(r),i={recurrent:s,attnNorm:await n("attn_norm.weight"),ffnNorm:await n("post_attention_norm.weight")};return this.q.moe?i.moe={router:await n("ffn_gate_inp.weight"),gateExps:await this.experts(`${e}.ffn_gate_exps.weight`),upExps:await this.experts(`${e}.ffn_up_exps.weight`),downExps:await this.experts(`${e}.ffn_down_exps.weight`),shGate:await this.mat(`${e}.ffn_gate_shexp.weight`),shUp:await this.mat(`${e}.ffn_up_shexp.weight`),shDown:await this.mat(`${e}.ffn_down_shexp.weight`),shInp:await n("ffn_gate_inp_shexp.weight")}:(i.wgate=await this.mat(`${e}.ffn_gate.weight`),i.wup=await this.mat(`${e}.ffn_up.weight`),i.wdown=await this.mat(`${e}.ffn_down.weight`)),s?(i.wqkv=await this.mat(`${e}.attn_qkv.weight`),i.wz=await this.mat(`${e}.attn_gate.weight`),i.walpha=await this.mat(`${e}.ssm_alpha.weight`),i.wbeta=await this.mat(`${e}.ssm_beta.weight`),i.conv=await n("ssm_conv1d.weight"),i.dt=await n("ssm_dt.bias"),i.A=await n("ssm_a"),i.ssmNorm=await n("ssm_norm.weight"),i.wout=await this.mat(`${e}.ssm_out.weight`)):i.attn=await this.loadAttn(e),this.dropLayerBytes(r),i}async experts(r){let e=this.manifest.tensors[r];if(e.type!=="Q4_K"&&e.type!=="Q6_K"||e.shape[0]%256!==0)throw new Error(`MoE : ${r} en ${e.type} (k = ${e.shape[0]}) non g\xE9r\xE9 \u2014 Q4_K/Q6_K, k multiple de 256`);return this.engine.uploadKq(e.type,await this.rawTensor(r))}async loadMtp(){let r=this.nLayer,e=`blk.${r}`;if(!this.manifest.tensors[`${e}.nextn.eh_proj.weight`]||!this.manifest.tensors[`${e}.attn_q.weight`])return null;await this.ensureLayerSpan(r);let n=async u=>this.up(await this.dequant(u)),[s,i]=await this.splitEh(`${e}.nextn.eh_proj.weight`),a=this.manifest.tensors[`${e}.nextn.shared_head_norm.weight`]?`${e}.nextn.shared_head_norm.weight`:"output_norm.weight",o={we:s,wh:i,enorm:await n(`${e}.nextn.enorm.weight`),hnorm:await n(`${e}.nextn.hnorm.weight`),headNorm:await n(a),attnNorm:await n(`${e}.attn_norm.weight`),attn:await this.loadAttn(e),ffnNorm:await n(`${e}.post_attention_norm.weight`),wgate:await this.mat(`${e}.ffn_gate.weight`),wup:await this.mat(`${e}.ffn_up.weight`),wdown:await this.mat(`${e}.ffn_down.weight`)};return this.dropLayerBytes(r),o}async prewarmGpu(r){if(!this.engine.qwen35SsmOk)throw new Error("Qwen 3.5 indisponible sur ce GPU (selfValidate, ou ?qwen35ssm=0).");if(this.q.moe&&!this.engine.moeOk)throw new Error("Mod\xE8le \xE0 experts indisponible sur ce GPU (selfValidate MoE, ou ?moe=0).");this.loadHadamard();let{d:e}=this.manifest.config,n=this.layerBytes(this.nLayer),s=n.reduce((u,c)=>u+c,0),i=0;for(let u=0;u<this.nLayer;u++)this.layers[u]=await this.loadLayer(u),await this.engine.settleGpu(),i+=n[u],r?.(i,s);tr.mtpOn&&this.engine.gemvMOk&&!this.q.moe&&!this.hd&&(this.mtp=await this.loadMtp().catch(u=>(console.warn("[qwen35] couche MTP illisible, d\xE9codage classique :",u),null)),await this.engine.settleGpu()),await this.getFinalNormGpu(),await this.getProjectionQ8(e);let a=globalThis,o=u=>this.engine.device.createBuffer({size:u,usage:a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST|a.GPUBufferUsage.COPY_SRC});this.hLast=o(e*4),this.hVerify=o(2*e*4),await this.engine.settleGpu()}resetState(){super.resetState();for(let r of[this.convState,this.ssmState,this.convSnap,this.ssmSnap]){for(let e of r.values())e.destroy?.();r.clear()}}zeroed(r){let e=globalThis;return this.engine.device.createBuffer({size:r,usage:e.GPUBufferUsage.STORAGE|e.GPUBufferUsage.COPY_DST|e.GPUBufferUsage.COPY_SRC})}stateFor(r,e,n){let s=r.get(e);return s||(s=this.zeroed(n),r.set(e,s)),s}prepareInputs(){return Promise.resolve(null)}loadHadamard(){let r=this.manifest.metadata,e=r["prism.hadamard.version"];if(e===void 0)return;let n=d=>{throw new Error(`prism.hadamard : ${d} \u2014 ce mod\xE8le ne peut pas tourner correctement ici.`)};Number(e)!==1&&n(`version ${String(e)} non g\xE9r\xE9e (1 seulement : t\xEAte explicite, pas de t\xEAte latente partag\xE9e)`),Number(r["prism.hadamard.block_size"])!==1024&&n(`bloc de ${String(r["prism.hadamard.block_size"])} (1 024 seulement)`),r["prism.hadamard.transform"]!=="normalized-sylvester-walsh-hadamard"&&n(`transform\xE9e \xAB ${String(r["prism.hadamard.transform"])} \xBB`),r["prism.hadamard.axis"]!=="input-last-dimension"&&n(`axe \xAB ${String(r["prism.hadamard.axis"])} \xBB`),this.q.moe&&n("mod\xE8le \xE0 experts"),this.engine.hadamardOk||n("rotation de Hadamard indisponible sur ce GPU (selfValidate)");let s=r["prism.hadamard.sign_widths"]??[],i=r["prism.hadamard.sign_values"]??[],a=new Map,o=0;for(let d of s){let p=Float32Array.from(i.slice(o,o+d));(p.length!==d||p.some(g=>g!==1&&g!==-1))&&n(`signes de largeur ${d} invalides`),a.set(d,p),o+=d}o!==i.length&&n("longueur des signes incoh\xE9rente");let{S:u,Hk:c,Hv:l}=this.ssm;this.hd={rot:new Set(r["prism.hadamard.weight_names"]??[]),inv:new Set(r["prism.hadamard.inverse_weight_names"]??[]),signsCpu:a,signs:new Map([...a].map(([d,p])=>[d,this.up(p)])),perm:r["prism.hadamard.gdn_v_grouped"]?{hd:u,nk:c,rep:l/c}:null},console.info(`[qwen35] prism.hadamard : ${this.hd.rot.size} poids repli\xE9s, ${this.hd.inv.size} table(s) latente(s), FWHT ${this.engine.fwhtOk?"rapide":"na\xEFve"}`)}rotIn(r,e,n,s,i,a,o=!1){if(!this.hd)return n;let u=a.filter(l=>this.hd.rot.has(l)).length;if(u===0)return n;if(u!==a.length)throw new Error(`prism.hadamard : ${a.join(", ")} partagent une entr\xE9e mais pas leur repliement`);let c=this.hd.signs.get(i);if(!c)throw new Error(`prism.hadamard : pas de signes pour la largeur ${i}`);return this.engine.recHadamard(r,e,n,s,i,c,o?this.hd.perm??void 0:void 0)}async embed(r,e){let n=await super.embed(r,e);if(!this.hd?.inv.has("token_embd.weight"))return n;let s=this.hd.signsCpu.get(e);if(!s)throw new Error(`prism.hadamard : pas de signes pour l'embedding (largeur ${e})`);for(let i=0;i<r.length;i++)n.set(Dn(n.subarray(i*e,(i+1)*e),s),i*e);return n}recordHead(r,e,n,s,i){let a=this.rotIn(r,e,n,s,this.manifest.config.d,["output.weight"]);return super.recordHead(r,e,a,s,i)}unload(){this.resetState();let r=n=>"destroy"in n||"codes"in n||"nib"in n||"kq"in n,e=n=>{for(let[s,i]of Object.entries(n))s==="recurrent"||!i||typeof i!="object"||(r(i)?_e.destroyWeight(i):e(i))};for(let n of this.layers)e(n);this.mtp&&e(this.mtp),this.layers=[],this.mtp=null,this.hLast?.destroy?.(),this.hVerify?.destroy?.(),super.unload()}recordAttn(r,e,n,s,i,a,o){let u=this.engine,{d:c,nHeads:l,nKvHeads:d,headDim:p,rmsEps:g,ropeTheta:m}=this.manifest.config,b=o+a,v=d*p,U=l*p,A=`blk.${i}`,F=this.rotIn(r,e,n,a,c,[`${A}.attn_q.weight`,`${A}.attn_k.weight`,`${A}.attn_v.weight`]),T=u.recMM(r,e,F,s.wq,a,c,U,!1),K=u.recMM(r,e,F,s.wqGate,a,c,U,!1),P=u.recMM(r,e,F,s.wk,a,c,v,!1),G=u.recMM(r,e,F,s.wv,a,c,v,!1);T=u.recRopePartial(r,e,u.recRmsnorm(r,e,T,s.qNorm,a*l,p,g),a*l,p,l,o,m,this.q.nRot);let _=u.recRopePartial(r,e,u.recRmsnorm(r,e,P,s.kNorm,a*d,p,g),a*d,p,d,o,m,this.q.nRot),h=this.ensureKv(i,b,v);r.copyBufferToBuffer(_,0,h.k,o*v*4,a*v*4),r.copyBufferToBuffer(G,0,h.v,o*v*4,a*v*4);let y=u.recAttention(r,e,T,h.k,h.v,a,l,d,p,b,o,1/Math.sqrt(p),0,0),k=u.storage(a*U*4);e.push(k),u.recordPass(r,"sigmoid",[K,k],u.grid1D(a*U));let w=this.rotIn(r,e,u.recBinary(r,e,"mul",y,k,a*U),a,U,[`${A}.attn_output.weight`]);return u.recMM(r,e,w,s.wo,a,U,c,!1)}recordLayers(r,e,n,s,i,a=!1){let o=this.engine,u=this.manifest.config,{d:c,ffn:l,rmsEps:d}=u,{S:p,Hk:g,Hv:m,kOff:b,vOff:v,C:U,dInner:A}=this.ssm,F=o.storage(n.byteLength);e.push(F),o.device.queue.writeBuffer(F,0,n);for(let T=0;T<this.nLayer;T++){let K=e.length,P=this.layers[T],G=`blk.${T}`,_=o.recRmsnorm(r,e,F,P.attnNorm,s,c,d),h;if(P.recurrent){let w=this.stateFor(this.convState,T,3*U*4),x=this.stateFor(this.ssmState,T,m*p*p*4),B=a?this.stateFor(this.convSnap,T,3*U*4):void 0,q=a?this.stateFor(this.ssmSnap,T,m*p*p*4):void 0,M=this.rotIn(r,e,_,s,c,[`${G}.attn_qkv.weight`,`${G}.attn_gate.weight`]),O=o.recMM(r,e,M,P.wqkv,s,c,U,!1),C=o.recMM(r,e,M,P.wz,s,c,A,!1),S=o.recMM(r,e,this.rotIn(r,e,_,s,c,[`${G}.ssm_alpha.weight`]),P.walpha,s,c,m,!1),R=o.recMM(r,e,this.rotIn(r,e,_,s,c,[`${G}.ssm_beta.weight`]),P.wbeta,s,c,m,!1),E=o.recQwen35Conv(r,e,O,P.conv,w,s,U,B,0),W=o.recQwen35Gdn(r,e,E,S,R,P.dt,P.A,x,s,m,g,p,U,b,v,d,q,0),N=o.recRmsnorm(r,e,W,P.ssmNorm,s*m,p,d),I=o.recBinary(r,e,"swiglu",C,N,s*A);h=o.recMM(r,e,this.rotIn(r,e,I,s,A,[`${G}.ssm_out.weight`],!0),P.wout,s,A,c,!1)}else h=this.recordAttn(r,e,_,P.attn,T,s,i);let y=o.recBinary(r,e,"add",F,h,s*c),k=o.recRmsnorm(r,e,y,P.ffnNorm,s,c,d);if(P.moe)F=o.recBinary(r,e,"add",y,this.recordMoe(r,e,k,P.moe,s),s*c);else{let w=this.rotIn(r,e,k,s,c,[`${G}.ffn_gate.weight`,`${G}.ffn_up.weight`]),x=o.recBinary(r,e,"swiglu",o.recMM(r,e,w,P.wgate,s,c,l,!1),o.recMM(r,e,w,P.wup,s,c,l,!1),s*l);F=o.recBinary(r,e,"add",y,o.recMM(r,e,this.rotIn(r,e,x,s,l,[`${G}.ffn_down.weight`]),P.wdown,s,l,c,!1),s*c)}o.recycleStorage(e.slice(K).filter(w=>w!==F))}return o.recRmsnorm(r,e,F,this.finalNormGpu,s,c,d)}recordMoe(r,e,n,s,i){let a=this.engine,{d:o}=this.manifest.config,{nExpert:u,nUsed:c,ffExp:l,ffShexp:d,scale:p}=this.q.moe,g=a.recMM(r,e,n,s.router,i,o,u,!1),m=a.recMoeRoute(r,e,g,i,u,c,p),b=i>=8&&a.moeGemmOk?a.recMoeGroup(r,e,m.ids,i*c,u):null,v=(_,h,y,k,w)=>b?a.recMoeGemm(r,e,_,h,b,i*c,u,i,y,k,w):a.recMoeGemv(r,e,_,h,m.ids,i*c,y,k,w),U=v(n,s.gateExps,c,o,l),A=v(n,s.upExps,c,o,l),F=a.recBinary(r,e,"swiglu",U,A,i*c*l),T=v(F,s.downExps,1,l,o),K=a.recMoeSum(r,e,T,m.w,i,c,o),P=a.recMM(r,e,a.recBinary(r,e,"swiglu",a.recMM(r,e,n,s.shGate,i,o,d,!1),a.recMM(r,e,n,s.shUp,i,o,d,!1),i*d),s.shDown,i,d,o,!1),G=a.recMM(r,e,n,s.shInp,i,o,1,!1);return a.recBinary(r,e,"add",K,a.recHeadGate(r,e,P,G,i*o,o),i*o)}recordForward(r,e,n,s,i,a){let{d:o}=this.manifest.config,u=this.recordLayers(r,e,n,i,a),c=this.engine.storage(o*4);return e.push(c),r.copyBufferToBuffer(u,(i-1)*o*4,c,0,o*4),c}recordMtp(r,e,n,s,i,a){let o=this.engine,u=this.mtp,{d:c,ffn:l,rmsEps:d}=this.manifest.config,p=o.storage(s.byteLength);e.push(p),o.device.queue.writeBuffer(p,0,s);let g=o.recRmsnorm(r,e,p,u.enorm,i,c,d),m=o.recRmsnorm(r,e,n,u.hnorm,i,c,d),b=o.recBinary(r,e,"add",o.recMM(r,e,g,u.we,i,c,c,!1),o.recMM(r,e,m,u.wh,i,c,c,!1),i*c),v=o.recRmsnorm(r,e,b,u.attnNorm,i,c,d),U=o.recBinary(r,e,"add",b,this.recordAttn(r,e,v,u.attn,this.nLayer,i,a),i*c),A=o.recRmsnorm(r,e,U,u.ffnNorm,i,c,d),F=o.recBinary(r,e,"swiglu",o.recMM(r,e,A,u.wgate,i,c,l,!1),o.recMM(r,e,A,u.wup,i,c,l,!1),i*l),T=o.recBinary(r,e,"add",U,o.recMM(r,e,F,u.wdown,i,l,c,!1),i*c);return o.recRmsnorm(r,e,T,u.headNorm,i,c,d)}speculativeReady(){return!!this.mtp}async specPrefill(r,e,n,s,i){let a=this.engine,{d:o}=this.manifest.config,u=r.length,{embeds:c,tiles:l}=await this.prepare(r,e,n),d=[],p=a.device.createCommandEncoder(),g=this.recordLayers(p,d,c,u,e),m=a.storage(o*4);d.push(m),p.copyBufferToBuffer(g,(u-1)*o*4,m,0,o*4);let b=e===0?1:0,v=u-b;if(v>0){let F=a.storage(v*o*4);d.push(F),b===0&&p.copyBufferToBuffer(this.hLast,0,F,0,o*4),u>1&&p.copyBufferToBuffer(g,0,F,(1-b)*o*4,(u-1)*o*4),this.recordMtp(p,d,F,c.subarray(b*o),v,e+b)}p.copyBufferToBuffer(m,0,this.hLast,0,o*4);let U=this.recordTopK(p,d,this.recordHead(p,d,m,1,l),this.projVocab,s,i),[A]=await this.readTopKs(p,[U]);return a.release(d),A}async specDraft(r,e,n){let s=this.engine,{d:i}=this.manifest.config,a=r.length,o=await this.embed(r,i),u=await this.getProjectionQ8(i),c=[],l=s.device.createCommandEncoder(),d=n==="last"?this.hLast:this.hVerify,p=this.recordMtp(l,c,d,o,a,e),g=s.storage(i*4);c.push(g),l.copyBufferToBuffer(p,(a-1)*i*4,g,0,i*4);let m=this.recordTopK(l,c,this.recordHead(l,c,g,1,u),this.projVocab,[],1,64),[b]=await this.readTopKs(l,[m]);return s.release(c),b.ids[0]}async specVerify(r,e,n,s,i,a,o){let u=this.engine,{d:c}=this.manifest.config,l=this.projVocab,{embeds:d,tiles:p}=await this.prepare([r,e],n,s),g=[],m=u.device.createCommandEncoder(),b=this.recordLayers(m,g,d,2,n,!0);m.copyBufferToBuffer(b,0,this.hVerify,0,2*c*4);let v=this.recordHead(m,g,b,2,p),U=u.storage(l*4);g.push(U),m.copyBufferToBuffer(v,l*4,U,0,l*4);let A=this.recordTopK(m,g,v,l,i,o),F=this.recordTopK(m,g,U,l,a,o),[T,K]=await this.readTopKs(m,[A,F]);return u.release(g),[T,K]}specRollback(){let r=this.engine.device.createCommandEncoder();for(let[e,n]of this.convSnap)r.copyBufferToBuffer(n,0,this.convState.get(e),0,n.size);for(let[e,n]of this.ssmSnap)r.copyBufferToBuffer(n,0,this.ssmState.get(e),0,n.size);this.engine.device.queue.submit([r.finish()])}};tr.mtpOn=(()=>{try{return ie("mtp")!=="0"}catch{return!0}})();er=tr});function Zn(f){let t=f.metadata;if(String(t["tokenizer.ggml.model"]??"")!=="gemma4")return null;let r=t["tokenizer.ggml.tokens"],e=t["tokenizer.ggml.merges"];if(!Array.isArray(r)||!Array.isArray(e))return null;let n=t["tokenizer.ggml.token_type"]??[],s=c=>Number.isFinite(Number(c))&&c!==void 0?Number(c):null,i=s(t["tokenizer.ggml.bos_token_id"]),a=s(t["tokenizer.ggml.eos_token_id"]),o=new Sr(r,n,e,i,!0),u=n.flatMap((c,l)=>c===3?[l]:[]);return{tokenizer:o,bosId:i,eosId:a,controlIds:u}}var Sr,es=ce(()=>{"use strict";Sr=class{constructor(t,r,e,n,s){this.bosId=n;this.addBos=s;this.vocab=new Map;this.ranks=new Map;this.byteIds=new Int32Array(256).fill(-1);this.cache=new Map;this.pieces=t,this.types=r;for(let a=0;a<t.length;a++)this.vocab.set(t[a],a);e.forEach((a,o)=>{let u=a.indexOf(" ",1);u>0&&this.ranks.set(a.slice(0,u)+"\0"+a.slice(u+1),o)});for(let a=0;a<256;a++){let o=this.vocab.get(`<0x${a.toString(16).toUpperCase().padStart(2,"0")}>`);o!==void 0&&(this.byteIds[a]=o)}let i=t.filter((a,o)=>r[o]===3||r[o]===4).sort((a,o)=>o.length-a.length).map(a=>a.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"));this.specialRe=i.length?new RegExp(i.join("|"),"g"):null}encode(t){let r=[];this.addBos&&this.bosId!=null&&r.push(this.bosId);let e=0;if(this.specialRe){this.specialRe.lastIndex=0;for(let n=this.specialRe.exec(t);n;n=this.specialRe.exec(t))n.index>e&&this.encodeSegment(t.slice(e,n.index),r),r.push(this.vocab.get(n[0])),e=n.index+n[0].length}return e<t.length&&this.encodeSegment(t.slice(e),r),r}encodeSegment(t,r){let e=t.replace(/ /g,"\u2581");for(let n of e.match(/[^\n]+|\n+/g)??[]){let s=this.cache.get(n);if(s){r.push(...s);continue}let i=this.encodeWord(n);this.cache.size<2e4&&this.cache.set(n,i),r.push(...i)}}encodeWord(t){if(t[0]===`
`){let n=this.vocab.get(t);if(n!==void 0)return[n]}let r=Array.from(t);for(;r.length>1;){let n=-1,s=1/0;for(let i=0;i<r.length-1;i++){let a=this.ranks.get(r[i]+"\0"+r[i+1]);a!==void 0&&a<s&&(s=a,n=i)}if(n<0)break;r.splice(n,2,r[n]+r[n+1])}let e=[];for(let n of r){let s=this.vocab.get(n);if(s!==void 0){e.push(s);continue}for(let i of new TextEncoder().encode(n))this.byteIds[i]>=0&&e.push(this.byteIds[i])}return e}decode(t){let r=[],e=new TextEncoder;for(let n of t){let s=this.types[n]??1;if(s===3)continue;let i=this.pieces[n];if(i!==void 0){if(s===6){r.push(parseInt(i.slice(3,5),16));continue}for(let a of e.encode(s===4?i:i.replace(/▁/g," ")))r.push(a)}}return new TextDecoder("utf-8",{ignoreBOM:!0}).decode(new Uint8Array(r))}}});async function rr(f){let t=Math.min(f.size,104857600),e=await f.slice(0,t).arrayBuffer(),n=new Mr(e),s=[String.fromCharCode(n.uint8()),String.fromCharCode(n.uint8()),String.fromCharCode(n.uint8()),String.fromCharCode(n.uint8())].join("");if(s!=="GGUF")throw new Error(`Fichier GGUF invalide. Sceau magique absent : ${s}`);let i=n.uint32();if(i!==2&&i!==3)throw new Error(`Version GGUF non support\xE9e : ${i}`);let a=n.uint64(),o=n.uint64();if(!Number.isSafeInteger(a)||a<0||a>1e5)throw new Error(`GGUF invalide : nombre de tenseurs hors bornes (${a})`);if(!Number.isSafeInteger(o)||o<0||o>1e5)throw new Error(`GGUF invalide : nombre de m\xE9tadonn\xE9es hors bornes (${o})`);let u=2e6,c=(x,B=0)=>{if(B>8)throw new Error("GGUF invalide : imbrication de m\xE9tadonn\xE9es excessive");switch(x){case 0:return n.uint8();case 1:return n.int8();case 2:return n.uint16();case 3:return n.int16();case 4:return n.uint32();case 5:return n.int32();case 6:return n.float32();case 7:return n.uint8()!==0;case 8:return n.string();case 9:{let q=n.uint32(),M=n.uint64();if(!Number.isSafeInteger(M)||M<0||M>u)throw new Error(`GGUF invalide : longueur de tableau de m\xE9tadonn\xE9es hors bornes (${M})`);let O=[];for(let C=0;C<M;C++)O.push(c(q,B+1));return O}case 10:return n.uint64();case 11:return n.int64();case 12:return n.float64();default:throw new Error(`Type de m\xE9tadonn\xE9es non support\xE9 : ${x}`)}},l={};for(let x=0;x<o;x++){let B=n.string(),q=n.uint32(),M=c(q);B!=="__proto__"&&B!=="constructor"&&B!=="prototype"&&(l[B]=M)}let d=Number(l["general.alignment"]??32),p=Number.isSafeInteger(d)&&d>0&&d<=4096&&(d&d-1)===0?d:32,g=typeof l["general.architecture"]=="string"?l["general.architecture"]:"llama",m=[];for(let x=0;x<a;x++){let B=n.string(),q=n.uint32();if(q>8)throw new Error(`GGUF invalide : nombre de dimensions hors bornes (${q}) pour ${B}`);let M=[];for(let S=0;S<q;S++){let R=n.uint64();if(!Number.isSafeInteger(R)||R<0||R>1e9)throw new Error(`GGUF invalide : dimension hors bornes (${R}) pour ${B}`);M.push(R)}let O=n.uint32(),C=n.uint64();if(!Number.isSafeInteger(C)||C<0)throw new Error(`GGUF invalide : offset n\xE9gatif ou hors bornes (${C}) pour ${B}`);m.push({name:B,shape:M,typeIdx:O,relativeOffset:C})}let b=n.getOffset(),v=Math.ceil(b/p)*p,U={};for(let x=0;x<m.length;x++){let B=m[x];if(B.name==="__proto__"||B.name==="constructor"||B.name==="prototype")continue;let q=Ti[B.typeIdx]||Ri[B.typeIdx]||"UNKNOWN",M=B.shape.reduce((C,S)=>C*S,1);if(!Number.isSafeInteger(M)||M<0)throw new Error(`GGUF invalide : nombre d'\xE9l\xE9ments hors bornes pour ${B.name}`);let O=0;if(x<m.length-1){O=m[x+1].relativeOffset-B.relativeOffset;try{let{block:C,size:S}=ts(q),R=M/C*S;Number.isInteger(R)&&(O<0||R<=O)&&(O=R)}catch{}}else{let{block:C,size:S}=ts(q);O=M/C*S}if(!Number.isSafeInteger(O)||O<0)throw new Error(`GGUF invalide : taille d'octets invalide (${O}) pour ${B.name}`);U[B.name]={offset:v+B.relativeOffset,bytes:O,nElems:M,type:q,shape:B.shape}}let A=(x,B)=>{let q=l[`${g}.${x}`];return q!==void 0?Number(q):B},F=(x,B)=>{let q=l[`${g}.${x}`];return q!==void 0?Number(q):B},T=A("embedding_length",0),K=A("attention.head_count",0),P=A("attention.head_count_kv",K),G=A("block_count",0),_=F("rope.freq_base",1e4),h=F("attention.layer_norm_rms_epsilon",1e-5),y=A("attention.key_length",0)||(K>0?T/K:0),k=A("feed_forward_length",0),w={d:T,nHeads:K,nKvHeads:P,headDim:y,ffn:k,blockCount:G,ropeTheta:_,rmsEps:h};if(g==="rwkv7"||g==="rwkv6"){let x=A("wkv.head_size",64);w.headDim=x,w.nHeads=x>0?Math.floor(T/x):0,w.nKvHeads=w.nHeads,w.rwkv={headSize:x,decayLoraRank:A("attention.decay_lora_rank",64),iclrLoraRank:A("attention.iclr_lora_rank",64),valueLoraRank:A("attention.value_residual_mix_lora_rank",32),gateLoraRank:A("attention.gate_lora_rank",128)}}if(g==="lfm2"){let x=l["lfm2.attention.head_count_kv"],B=Array.isArray(x)?x.map(Number):[];w.nKvHeads=B.length?Math.max(...B):K,w.headDim=y||64,w.lfm2={lCache:A("shortconv.l_cache",3),kvHeadsPerLayer:B.length?B:Array(G).fill(w.nKvHeads)}}if(g==="qwen35"||g==="qwen3_5"||g==="qwen35moe"){let x=A("full_attention_interval",4);w.qwen35={fullAttnInterval:x,dConv:A("ssm.conv_kernel",4),dInner:A("ssm.inner_size",2*T),dState:A("ssm.state_size",128),dtRank:A("ssm.time_step_rank",32),nGroup:A("ssm.group_count",16),nRot:A("rope.dimension_count",y),nLayer:G-A("nextn_predict_layers",0),moe:g==="qwen35moe"?{nExpert:A("expert_count",0),nUsed:A("expert_used_count",8),ffExp:A("expert_feed_forward_length",0),ffShexp:A("expert_shared_feed_forward_length",0),scale:F("expert_weights_scale",1)||1}:void 0}}if((g==="gemma"||g==="gemma2")&&(w.act="gelu",w.embedScale=Math.sqrt(T)),g==="gemma2"){w.attnLogitSoftcap=F("attn_logit_softcapping",50),w.finalLogitSoftcap=F("final_logit_softcapping",30);let x=A("attention.query_pre_attn_scalar",0);w.attnScale=x>0?1/Math.sqrt(x):y>0?1/Math.sqrt(y):void 0}{let x=l[`${g}.rope.scaling.type`],B=F("rope.scaling.factor",1);if(x==="yarn"&&B>1&&y>0){w.yarn={factor:B,betaFast:F("rope.scaling.yarn_beta_fast",32),betaSlow:F("rope.scaling.yarn_beta_slow",1),origCtx:A("rope.scaling.original_context_length",0)};let q=1+.1*Math.log(B);w.attnScale=q*q/Math.sqrt(y)}}if(g==="gemma3"){w.act="gelu",w.embedScale=Math.sqrt(T);let x=A("attention.sliding_window",512),B=A("attention.sliding_window_pattern",6)||6,q=F("rope.local_freq_base",1e4),M=O=>(O+1)%B===0;w.windowPerLayer=Array.from({length:G},(O,C)=>M(C)?0:x),w.ropeThetaPerLayer=Array.from({length:G},(O,C)=>M(C)?_:q)}if(g==="gemma4"){let x=l["gemma4.attention.sliding_window_pattern"],B=Array.isArray(x)&&x.length===G?x.map(O=>O===!0||O===1):Array.from({length:G},(O,C)=>(C+1)%6!==0),q=G-A("attention.shared_kv_layers",0),M=O=>{for(let C=q-1;C>=0;C--)if(B[C]===O)return C;return-1};w.act="gelu",w.embedScale=Math.sqrt(T),w.attnScale=1,w.finalLogitSoftcap=F("final_logit_softcapping",0)||void 0,w.gemma4={swa:B,headDimSwa:A("attention.key_length_swa",256),ropeThetaSwa:F("rope.freq_base_swa",1e4),window:A("attention.sliding_window",512),perLayer:A("embedding_length_per_layer_input",0),nLayerKv:q,kvSrc:Array.from({length:G},(O,C)=>C<q?C:M(B[C]))}}if(g==="k2-horizon"&&(w.k2h={normGroups:A("attention.group_norm_groups",1)||1,nExpert:A("expert_count",0)}),g==="spark2_5"){let x=l["spark2_5.attention.sliding_window_pattern"],B=Array.isArray(x)&&x.length===G?x.map(q=>q===!0||q===1):Array.from({length:G},(q,M)=>(M+1)%4!==0);w.act="gelu",w.spark={swa:B,window:A("attention.sliding_window",512),ropeThetaSwa:F("rope.freq_base_swa",_),nRot:A("rope.dimension_count",y),nRotSwa:A("rope.dimension_count_swa",y)}}if(g==="smollm3"){let x=l[`${g}.no_rope_layers`],B=Array.isArray(x)?x.map(Number):[];w.skipRopePerLayer=B.length===G?B.map(q=>q===0):Array.from({length:G},(q,M)=>(M+1)%4===0)}if((g==="llama"||g==="mistral3"||g==="smollm3")&&(w.ropeInterleaved=!0),g==="qwen2vl"){let x=l["qwen2vl.rope.dimension_sections"],B=Array.isArray(x)?x.map(Number).filter(q=>q>0):[];w.mropeSections=B.length===3?B:[16,24,24]}return{arch:g,config:w,tensors:U,metadata:l}}var Mr,Ci,Ti,Ri,ts,Or=ce(()=>{"use strict";Mr=class{constructor(t){this.offset=0;this.view=new DataView(t)}getOffset(){return this.offset}setOffset(t){this.offset=t}uint8(){let t=this.view.getUint8(this.offset);return this.offset+=1,t}int8(){let t=this.view.getInt8(this.offset);return this.offset+=1,t}uint16(){let t=this.view.getUint16(this.offset,!0);return this.offset+=2,t}int16(){let t=this.view.getInt16(this.offset,!0);return this.offset+=2,t}uint32(){let t=this.view.getUint32(this.offset,!0);return this.offset+=4,t}int32(){let t=this.view.getInt32(this.offset,!0);return this.offset+=4,t}float32(){let t=this.view.getFloat32(this.offset,!0);return this.offset+=4,t}float64(){let t=this.view.getFloat64(this.offset,!0);return this.offset+=8,t}uint64(){let t=this.view.getUint32(this.offset,!0),r=this.view.getUint32(this.offset+4,!0);return this.offset+=8,t+r*4294967296}int64(){let t=this.view.getUint32(this.offset,!0),r=this.view.getInt32(this.offset+4,!0);return this.offset+=8,t+r*4294967296}string(){let t=this.uint64();if(this.offset+t>this.view.byteLength)throw new Error(`BinaryReader: string length ${t} exceeds buffer size`);let r=new Uint8Array(this.view.buffer,this.offset,t);return this.offset+=t,Ci.decode(r)}},Ci=new TextDecoder("utf-8",{ignoreBOM:!0}),Ti=["F32","F16","Q4_0","Q4_1","Q4_2","Q4_3","Q5_0","Q5_1","Q8_0","Q8_1","Q2_K","Q3_K","Q4_K","Q5_K","Q6_K","Q8_K","IQ2_XXS","IQ2_XS","IQ3_XXS","IQ1_S","IQ4_NL","IQ3_S","IQ2_S","IQ4_XS","I8","I16","I32","I64","F64","IQ1_M","BF16","Q4_0_4_4","Q4_0_4_8","Q4_0_8_8","TQ1_0","TQ2_0"],Ri={142:"PQ2_0",143:"PTQ1_0"},ts=f=>{switch(f){case"F32":return{block:1,size:4};case"F16":return{block:1,size:2};case"Q4_0":return{block:32,size:18};case"Q4_1":return{block:32,size:20};case"Q5_0":return{block:32,size:22};case"Q5_1":return{block:32,size:24};case"Q8_0":return{block:32,size:34};case"Q2_K":return{block:256,size:66};case"Q3_K":return{block:256,size:110};case"Q4_K":return{block:256,size:144};case"Q5_K":return{block:256,size:176};case"Q6_K":return{block:256,size:210};case"Q8_K":return{block:256,size:288};case"PQ2_0":return{block:128,size:34};case"BF16":return{block:1,size:2};default:throw new Error(`Type GGML non support\xE9 : ${f}. Types lus : F32, F16, Q4_0/1, Q5_0/1, Q8_0, Q2_K\u2026Q8_K, PQ2_0.`)}}});function sr(f,t=16){return Math.ceil(f/t)*t}function qt(f){if(f.length>128||f.includes(".."))return!1;let t=f.split("/");return t.length<=2&&t.every(r=>ji.test(r))}function ns(f){let t=i=>{throw new Error(`BRIK: manifeste invalide \u2014 ${i}`)};(!f||typeof f!="object")&&t("ce n'est pas un objet"),f.format!=="brik"&&t(`champ format \xAB ${String(f.format)} \xBB (attendu \xAB brik \xBB)`),(!Ye(f.version,1024)||f.version<1)&&t(`version ${String(f.version)}`),(!f.model||typeof f.model.name!="string"||f.model.name.length>512)&&t("champ model.name");let r=f.arch;(!r||typeof r!="object"||typeof r.arch!="string"||r.arch.length>64)&&t("champ arch.arch");for(let[i,a]of[["d",262144],["nHeads",4096],["nKvHeads",4096],["headDim",4096],["ffn",1048576],["blockCount",1024],["vocab",1e7]])Ye(r[i],a)||t(`arch.${i} = ${String(r[i])}`);for(let i of["ropeTheta","rmsEps"])(typeof r[i]!="number"||!Number.isFinite(r[i]))&&t(`arch.${i} = ${String(r[i])}`);f.tokenizer&&(f.tokenizer.kind!=="hf-hub"&&f.tokenizer.kind!=="embedded"&&t(`tokenizer.kind \xAB ${String(f.tokenizer.kind)} \xBB`),f.tokenizer.id&&!qt(f.tokenizer.id)&&t(`tokenizer.id \xAB ${f.tokenizer.id} \xBB (attendu : \xAB auteur/d\xE9p\xF4t \xBB ou une sentinelle sans barre oblique)`)),(!Array.isArray(f.shards)||f.shards.length===0||f.shards.length>rs)&&t(`${Array.isArray(f.shards)?f.shards.length:"aucun"} shard`);let e=new Map;for(let i of f.shards)Ye(i.id,rs)||t(`shard.id = ${String(i.id)}`),e.has(i.id)&&t(`shard ${i.id} d\xE9clar\xE9 deux fois`),(typeof i.file!="string"||i.file.length>256)&&t(`shard.file du shard ${i.id}`),Ye(i.byteLength,nr)||t(`shard.byteLength du shard ${i.id} = ${String(i.byteLength)}`),i.sha256!==void 0&&(typeof i.sha256!="string"||!Ki.test(i.sha256))&&t(`shard.sha256 du shard ${i.id}`),e.set(i.id,i.byteLength);(!f.tensors||typeof f.tensors!="object")&&t("champ tensors");let n=Object.keys(f.tensors);(n.length===0||n.length>Li)&&t(`${n.length} tenseurs`);let s=0;for(let i of n){let a=f.tensors[i];(!a||typeof a!="object")&&t(`tenseur ${i}`),Di.includes(a.dtype)||t(`dtype \xAB ${String(a.dtype)} \xBB du tenseur ${i}`),(!Array.isArray(a.shape)||a.shape.length>8||!a.shape.every(u=>Ye(u,2**32)))&&t(`shape du tenseur ${i}`),Ye(a.nElems,2**40)||t(`nElems du tenseur ${i}`),(!Ye(a.offset,nr)||!Ye(a.byteLength,nr))&&t(`offset/byteLength du tenseur ${i}`);let o=e.get(a.shard);o===void 0&&t(`le tenseur ${i} r\xE9f\xE9rence le shard ${String(a.shard)}, absent du manifeste`),a.offset+a.byteLength>o&&t(`le tenseur ${i} d\xE9passe son shard (${a.offset}+${a.byteLength} > ${o})`),s+=a.byteLength}return s>nr&&t(`${s} octets de tenseurs au total`),f}var rs,Li,nr,Di,ji,Ye,Ki,ir=ce(()=>{"use strict";rs=4096,Li=2e5,nr=64*1024*1024*1024,Di=["f16","f32","q4","q8","q3"],ji=/^[A-Za-z0-9._-]+$/;Ye=(f,t)=>typeof f=="number"&&Number.isInteger(f)&&f>=0&&f<=t,Ki=/^[0-9a-f]{64}$/i});function ar(f){if(f.length<Ft)throw new Error("BRIK: fichier tronqu\xE9 (en-t\xEAte)");let t=String.fromCharCode(f[0],f[1],f[2],f[3]);if(t!==Ei)throw new Error(`BRIK: sceau magique absent (${t})`);let r=new DataView(f.buffer,f.byteOffset,f.byteLength),e=r.getUint32(4,!0);if(e!==1)throw new Error(`BRIK: version non support\xE9e (${e})`);let n=r.getUint32(8,!0);if(n===0||n>Hi)throw new Error(`BRIK: taille de manifeste invalide (${n} o)`);return n}function zi(f){return sr(Ft+f)}function Cr(f){let t=ar(f);if(Ft+t>f.length)throw new Error("BRIK: manifeste tronqu\xE9");return{manifest:ns(JSON.parse(new TextDecoder().decode(f.subarray(Ft,Ft+t)))),version:1,dataStart:zi(t)}}function is(f){let{manifest:t,version:r,dataStart:e}=Cr(f),n=f.subarray(e),s=[...t.shards].sort((a,o)=>a.id-o.id),i=0;for(let a of s){if(i+a.byteLength>n.byteLength)throw new Error(`BRIK: section de donn\xE9es tronqu\xE9e au shard ${a.id} (${n.byteLength} < ${i+a.byteLength})`);i+=a.byteLength}return{manifest:t,version:r,dataStart:e,data:n}}var Ei,Ft,Hi,as=ce(()=>{"use strict";ir();Ei="BRIK",Ft=12,Hi=64*1024*1024});function Tr(f){let t=[...f].sort((n,s)=>n.id-s.id),r=[],e=0;for(let n of t)r[n.id]=e,e+=n.byteLength;return r}function os(f){let t=Tr(f.shards),r={};for(let[n,s]of Object.entries(f.tensors)){let i=Ni[s.dtype];if(!i)throw new Error(`dtype BRIK inconnu pour ${n} : ${s.dtype}`);if(t[s.shard]===void 0)throw new Error(`shard ${s.shard} absent du manifeste (tenseur ${n})`);r[n]={offset:t[s.shard]+s.offset,bytes:s.byteLength,nElems:s.nElems,type:i,shape:s.shape}}let e=f.arch;return{arch:e.arch,config:{d:e.d,nHeads:e.nHeads,nKvHeads:e.nKvHeads,headDim:e.headDim,ffn:e.ffn,blockCount:e.blockCount,ropeTheta:e.ropeTheta,rmsEps:e.rmsEps,attnLogitSoftcap:e.attnLogitSoftcap,finalLogitSoftcap:e.finalLogitSoftcap,attnScale:e.attnScale,act:e.act,rmsGainOnePlus:e.rmsGainOnePlus,embedScale:e.embedScale,rwkv:e.rwkv,lfm2:e.lfm2},tensors:r}}var Ni,us=ce(()=>{"use strict";Ni={f16:"F16",f32:"F32",q4:"Q4W",q8:"Q8W",q3:"Q3W"}});function Wi(){return globalThis.process?.getBuiltinModule?.("node:crypto")?.createHash??null}function Ii(f){let t=Wi();return t?t("sha256").update(f).digest("hex"):Vi(f)}function Vi(f){let t=f.byteLength,r=new DataView(f.buffer,f.byteOffset,t),e=Math.floor(t/64),n=t-e*64,s=new Uint8Array(n+9>64?128:64);s.set(f.subarray(e*64)),s[n]=128;let i=new DataView(s.buffer);i.setUint32(s.length-8,Math.floor(t/536870912),!1),i.setUint32(s.length-4,t%536870912*8,!1);let a=1779033703,o=3144134277,u=1013904242,c=2773480762,l=1359893119,d=2600822924,p=528734635,g=1541459225,m=new Uint32Array(64),b=(v,U)=>{for(let y=0;y<16;y++)m[y]=v.getUint32(U+y*4,!1);for(let y=16;y<64;y++){let k=m[y-15],w=m[y-2],x=(k>>>7|k<<25)^(k>>>18|k<<14)^k>>>3,B=(w>>>17|w<<15)^(w>>>19|w<<13)^w>>>10;m[y]=m[y-16]+x+m[y-7]+B>>>0}let A=a,F=o,T=u,K=c,P=l,G=d,_=p,h=g;for(let y=0;y<64;y++){let k=(P>>>6|P<<26)^(P>>>11|P<<21)^(P>>>25|P<<7),w=P&G^~P&_,x=h+k+w+$i[y]+m[y]>>>0,B=(A>>>2|A<<30)^(A>>>13|A<<19)^(A>>>22|A<<10),q=A&F^A&T^F&T,M=B+q>>>0;h=_,_=G,G=P,P=K+x>>>0,K=T,T=F,F=A,A=x+M>>>0}a=a+A>>>0,o=o+F>>>0,u=u+T>>>0,c=c+K>>>0,l=l+P>>>0,d=d+G>>>0,p=p+_>>>0,g=g+h>>>0};for(let v=0;v<e;v++)b(r,v*64);for(let v=0;v<s.length;v+=64)b(i,v);return[a,o,u,c,l,d,p,g].map(v=>v.toString(16).padStart(8,"0")).join("")}function Xi(f){return Qi[f]}async function cs(f){return typeof crypto<"u"&&crypto.subtle?Yi(await crypto.subtle.digest("SHA-256",f)):Ii(f)}async function Rr(f,t){let r=Xi(f);if(!r)return;let e=await cs(t);if(e!==r)throw console.error(`[int\xE9grit\xE9] manifeste inattendu pour ${f}
  attendu : ${r}
  obtenu  : ${e}`),new Error("Ce mod\xE8le ne correspond pas \xE0 celui que Brimkern publie : son manifeste a une empreinte diff\xE9rente de celle attendue. Chargement refus\xE9. Si tu viens de t\xE9l\xE9verser une nouvelle version, relance `npm run brik:digest`.")}async function Lr(f,t,r){if(!t)return;let e=await cs(r);if(e!==t.toLowerCase())throw new Error(`BRIK: int\xE9grit\xE9 du shard ${f} compromise (SHA-256 attendu ${t.slice(0,12)}\u2026, obtenu ${e.slice(0,12)}\u2026)`)}async function ls(f,t){let r=0;for(let e of[...f.shards].sort((n,s)=>n.id-s.id)){if(r+e.byteLength>t.byteLength)throw new Error(`BRIK: section de donn\xE9es tronqu\xE9e au shard ${e.id} (${t.byteLength} < ${r+e.byteLength})`);await Lr(e.id,e.sha256,t.subarray(r,r+e.byteLength)),r+=e.byteLength}}var Qi,$i,Yi,fs=ce(()=>{"use strict";Qi={"https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik":"aca6214b45c294c1d4c51c46aa23acc22cc53cb95a6894c62d2bd0570ca12afe","https://huggingface.co/romainkh14/Qwen2.5-0.5B-Instruct_BRIK/resolve/main/qwen2.5-0.5b-instruct-mixed.brik":"315d2a1cc17b64b029eb24e9668e5c959fd151ae926c9758bddc6a8193e52f6d","https://huggingface.co/romainkh14/Qwen3-0.6B-Shop-ENFR_BRIK/resolve/main/qwen3-0.6b-shop-enfr-q4.brik":"f45dc8b089e66d8a3ed53902a788aa2c86bc26f1fa286a32bee426c07a264272","https://huggingface.co/romainkh14/Qwen3-4B_BRIK/resolve/main/qwen3-4b-q4.brik":"23f9c0cc66ec21056e656bdaa5cbfda2e93673718ea3ab0dfad19c6e7f583f7d","https://huggingface.co/romainkh14/RWKV-7-G1-0.1B_BRIK/resolve/main/rwkv7-g1-0.1b-q4.brik":"bb8d211e1f95af415b7dca8b0b074c236ebe9d0844f1f372c11eecbcf15fb372","https://huggingface.co/romainkh14/RWKV-7-G1a-0.4B_BRIK/resolve/main/rwkv7-g1a-0.4b-q4.brik":"47e67144bb9dcd41918f3117aa6ee21420ff94f93289c338d8331620d3153b10","https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main/sd-turbo-clip-mixed.brik":"b873aaad23ca70d4e29c0350d124fd6ee0a18470aaf59719f14c9eb9f227b3ac","https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main/sd-turbo-clip-q8.brik":"b3e05c74f8f0327e878787100224983a454e4228d2ae008902875a6256fb2bae","https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main/sd-turbo-unet-q8.brik":"ca3a5c21512542656a8a736c88f67d37a482cacbf499a080c9bf32ca36bf6b0f","https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main/sdxs-unet-light.brik":"42f7c0e82971a558d56548edec947b1ed7d9c0e509d634b51fc29429177e7654","https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main/video-clip-q8.brik":"e81ca57426716237dce2853703c70172a829f78704b7df77c9ee980534c82a76","https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main/video-motion-1step-q8.brik":"68ed19de02fc8380ab49d03b623664f9b77d2dc20b4174117ed12b17515fcf4c","https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main/video-motion-2step-q8.brik":"33200f99849dcc116e06432550561cbad4118d831bf3dbe8fadab7ff692c0fe1","https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main/video-motion-q8.brik":"e976e13a5bc0858b8277eefed59cc0d77239b5a30ecae68d483e24eb983ae481","https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main/video-unet-q8.brik":"d112b2884afcd038cdbd90bb62ce6b248b404852fb9ce20003b8585927a362b9"},$i=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]);Yi=f=>[...new Uint8Array(f)].map(t=>t.toString(16).padStart(2,"0")).join("")});function or(f){let t=Zi.exec(f);return t&&Ji.has(t[2])?`${t[1]}main/${f.slice(t[0].length)}`:f}var Ji,Zi,ds=ce(()=>{"use strict";Ji=new Set(["067b946cf014b7c697f3654f621d577a3e3afd1c","0a9035302dea19872c96076896304552890a73c2","1f2362bff662708edca4836deda762da0c046dd0","23749fefcc72300e3a2ad315e1317431b06b590a","260dffbddaba1f7edb30f823118247e477fc8877","361004151d4f4f6b446dc5e6d46fbf4422a80d5f","855f67caed130e1befc571b52bd181be2e858883","86b3536ed1ca0dcb4716745642db4e6804bf3d32","91cad51170dc346986eccefdc2dd33a9da36ead9","9217f5db79a29953eb74d5343926648285ec7e67","9cc28b17e86fa2415fcb070f8ee5ec27c965aa61","c90975dbd40c0c7b275fefaae758c3415c906238","d342b33b2ce2f54e9a24cd062bcc9ff37326c4db","ebb2015119c907b064c512bf053e945850b5875f","f86cb2c1fa58255f8052cc32aeede1b7482d4361"]),Zi=/^(https:\/\/huggingface\.co\/[^/]+\/[^/]+\/resolve\/)([0-9a-f]{40})\//});function ur(f,t,r){let e=or(f);return`${e}${e.includes("?")?"&":"?"}__brik=${t}-${r}`}async function jr(){try{return await caches.open(ea)}catch{return null}}async function ta(f,t,r){let e=await jr();e&&await e.delete(ur(f,t,t+r-1)).catch(()=>{})}async function Xe(f,t,r,e){if(!Number.isSafeInteger(t)||t<0||!Number.isSafeInteger(r)||r<=0)throw new Error(`range fetch invalide : offset=${t} length=${r}`);let n=t+r-1,s=await jr(),i=ur(f,t,n);if(s){let o=await s.match(i);if(o){let u=new Uint8Array(await o.arrayBuffer());if(u.byteLength===r)return{bytes:u,ranged:!0};await s.delete(i).catch(()=>{})}}let a;for(let o=0;o<4;o++)try{let u=await fetch(f,{headers:{Range:`bytes=${t}-${n}`},signal:e});if(!u.ok&&u.status!==206)throw new Error(`range fetch ${t}-${n} \xE9chou\xE9 : HTTP ${u.status}`);let c=u.status===206,l=u.headers.get("Content-Length"),d=l?parseInt(l,10):0,p=new Uint8Array(await u.arrayBuffer());if(d>0&&p.byteLength!==d)throw new Error(`range fetch ${t}-${n} tronqu\xE9 : re\xE7u ${p.byteLength} o sur ${d} annonc\xE9s`);let g=c?p:p.subarray(t,t+r);if(s&&c&&g.byteLength===r)try{await s.put(i,new Response(g,{headers:{"Content-Length":String(g.byteLength)}}))}catch(m){hs(m)}return{bytes:g,ranged:c}}catch(u){if(e?.aborted)throw u;a=u,o<3&&await new Promise(c=>setTimeout(c,500*2**o))}throw a instanceof Error?a:new Error(String(a))}function hs(f){ps||(ps=!0,console.warn("[cache] \xE9criture refus\xE9e (quota plein ? navigation priv\xE9e ?) : les t\xE9l\xE9chargements de mod\xE8les ne seront PAS r\xE9utilisables \xE0 la prochaine visite. Lib\xE9rez de l'espace via le panneau Stockage.",f))}async function Kr(f){let t=or(f);try{let s=await(await caches.open(Dr)).match(t);if(s)return new Uint8Array(await s.arrayBuffer())}catch{}let r=await fetch(f);if(!r.ok)throw new Error(`HTTP ${r.status}`);let e=new Uint8Array(await r.arrayBuffer());try{await(await caches.open(Dr)).put(t,new Response(e.slice(),{headers:{"Content-Length":String(e.byteLength)}}))}catch(n){hs(n)}return e}function Er(f,t,r){return ra({bytes:async(n,s)=>(await Xe(f,t+n,s)).bytes},r,(n,s)=>ta(f,t+n,s))}function ra(f,t,r){let e=new Map;if(t&&t.some(n=>n.sha256)){let n=Tr(t);for(let s of t)s.sha256&&n[s.id]!==void 0&&e.set(n[s.id],s)}return e.size===0?f:{...f,bytes:async(n,s)=>{let i=await f.bytes(n,s),a=e.get(n);if(a&&a.sha256&&(s===a.byteLength||sr(s)===a.byteLength)){let o=s===a.byteLength?i:(()=>{let u=new Uint8Array(a.byteLength);return u.set(i),u})();try{await Lr(a.id,a.sha256,o)}catch(u){throw await r?.(n,s),u}}return i}}}function na(f){return{bytes:async(t,r)=>f.subarray(t,t+r)}}async function bs(f){let t=await Xe(f,0,12);if(!t.ranged){let i=await Kr(f);await Rr(f,gs(i));let{manifest:a,data:o}=is(i);return await ls(a,o),ms(a,na(o))}let r=ar(t.bytes),e=await Xe(f,0,12+r);await Rr(f,gs(e.bytes));let{manifest:n,dataStart:s}=Cr(e.bytes);return ms(n,Er(f,s,n.shards))}function gs(f){let t=ar(f);if(12+t>f.byteLength)throw new Error("BRIK: manifeste tronqu\xE9");return f.subarray(12,12+t)}function ms(f,t){if(f.model?.uiArch==="image")throw new Error("Ce fichier est un BRIK image (UNet/CLIP) : il se charge via la tuile de g\xE9n\xE9ration d'image, pas comme un LLM.");return{source:t,manifest:os(f),tokenizerId:f.tokenizer?.id,tokenizer:f.tokenizer,uiArch:f.model?.uiArch,modelName:f.model.name,stopTokenIds:f.chat?.stopTokenIds}}async function vs(f,t){return await sa(f)||!(await Xe(f,0,12,t)).ranged?null:{manifest:await ws(f,t),source:Er(f,0)}}async function sa(f){try{return!!await(await caches.open(Dr)).match(or(f))}catch{return!1}}async function ws(f,t){let r=Er(f,0),e;for(let n=8*1024*1024;n<=128*1024*1024;n*=2)try{let s=await r.bytes(0,n);return await rr(new Blob([s.slice()]))}catch(s){if(t?.aborted)throw s;e=s}throw e instanceof Error?e:new Error("en-t\xEAte GGUF illisible par plages")}function ia(f,t){let r=new Map,e=[];for(let[n,s]of Object.entries(f.tensors)){let i=n.match(/^blk\.(\d+)\./);if(i){let a=r.get(i[1]);a||r.set(i[1],a=[]),a.push(s)}else if(Qn.has(n))for(let a of $n(s))e.push({off:t+a.off,len:a.len});else e.push({off:t+s.offset,len:s.bytes})}for(let n of r.values()){let s=ut(n);if(s)e.push({off:t+s.start,len:s.end-s.start});else for(let i of n)e.push({off:t+i.offset,len:i.bytes})}return e}async function aa(f,t){let r=await jr();return!r||!(await Xe(f,0,12,t)).ranged?null:{cache:r,ranges:ia(await ws(f,t),0)}}async function ys(f,t,r){return oa(f,await aa(f,r),t,r)}async function oa(f,t,r,e){if(!t)return"unstorable";let{cache:n,ranges:s}=t;s.sort((g,m)=>g.off-m.off);let i=s.reduce((g,m)=>g+m.len,0),a=await Promise.all(s.map(g=>n.match(ur(f,g.off,g.off+g.len-1)))),o=0,u=[];s.forEach((g,m)=>{a[m]?o+=g.len:u.push(g)}),r?.({doneBytes:o,totalBytes:i});let c=0,l=!1,d=null,p=async()=>{for(;!l&&d===null;){let g=c++;if(g>=u.length)return;let m=u[g];if(e?.aborted)return;try{await Xe(f,m.off,m.len,e)}catch(b){d=b;return}if(!await n.match(ur(f,m.off,m.off+m.len-1))){l=!0;return}o+=m.len,r?.({doneBytes:o,totalBytes:i})}};if(await Promise.all(Array.from({length:Math.min(4,u.length)},p)),e?.aborted)return"aborted";if(d!==null)throw d instanceof Error?d:new Error(String(d));return l?"unstorable":"done"}var ea,ps,Dr,ks=ce(()=>{"use strict";"use client";ct();Or();as();us();fs();ds();ir();ea="brik-range-v1";ps=!1;Dr="brimkern-model-cache"});function ua(f){f=f.replace(/<(\/?)ifm\|think(?:_fast|_faster)?>/g,"<$1think>");let t=f.indexOf("<think>");if(t===-1)return f;let r=f.indexOf("</think>",t);return(r===-1?f.slice(0,t):f.slice(0,t)+f.slice(r+8)).trim()}function Hr(f,t){if(!ca.has(t))return f;let r=f.length-1;return r<0||f[r].role!=="user"||/\/no_think\s*$/.test(f[r].content)?f:[...f.slice(0,r),{...f[r],content:`${f[r].content} /no_think`}]}function zr(f){let t=f.replace(/<(\/?)ifm\|think(?:_fast|_faster)?>/g,"<$1think>").replace(/<think>[\s\S]*?<\/think>/g,""),r=t.indexOf("<think>");r!==-1&&(t=t.slice(0,r));let e=t.lastIndexOf("</think>");return e!==-1&&(t=t.slice(e+8)),t.replace(/^\s+/,"")}function Nr(f,t,r){f=f.map(n=>n.role==="assistant"?{...n,content:ua(n.content)}:n);let e="";if(t==="deepseek"){e+="<\uFF5Cbegin\u2581of\u2581sentence\uFF5C>",r.trim()&&(e+=r);for(let n of f)n.role==="user"?e+=`<\uFF5CUser\uFF5C>${n.content}`:n.role==="assistant"&&(e+=`<\uFF5CAssistant\uFF5C>${n.content}<\uFF5Cend\u2581of\u2581sentence\uFF5C>`);return e+="<\uFF5CAssistant\uFF5C>",e}if(t==="k2h"){let n=!0;return r.trim()&&(e+=`<|ifm|im_start|>system
${r.trim()}<|ifm|im_end|>`),f.forEach((s,i)=>{let a=s.content;s.role==="user"&&i===f.length-1&&/\s*\/no_think\s*$/.test(a)&&(a=a.replace(/\s*\/no_think\s*$/,""),n=!1),e+=`<|ifm|im_start|>${s.role}
${a}<|ifm|im_end|>`}),e+=`<|ifm|im_start|>assistant
<ifm|think>
${n?"":`</ifm|think>
`}`,e}if(t==="spark"){let n="<\uFF5Cstart\u2581of\u2581sentence\uFF5C>",s="<\uFF5Cend\u2581of\u2581sentence\uFF5C>",i=!0;return e+=`${n}<|System|>
you are a helpful assistant.${r.trim()?`

${r.trim()}`:""}${s}`,f.forEach((a,o)=>{let u=a.content;a.role==="user"&&o===f.length-1&&/\s*\/no_think\s*$/.test(u)&&(u=u.replace(/\s*\/no_think\s*$/,""),i=!1),a.role==="user"?e+=`${n}<|User|>${u}${s}`:a.role==="assistant"&&(e+=`${n}<|Bot|></think>${u}${s}`)}),e+=`${n}<|Bot|>${i?"<think>":"</think>"}`,e}if(t==="rwkv7"){r.trim()&&(e+=`System: ${r.trim()}

`);for(let n of f)n.role==="user"?e+=`User: ${n.content.trim()}

`:n.role==="assistant"&&(e+=`Assistant: ${n.content.trim()}

`);return e+="Assistant:",e}if(t==="qwen"||t==="qwen3"||t==="qwen35"||t==="lfm2"||t==="smollm3"||t==="minicpm"){let n=!0;(t==="qwen35"||t==="minicpm")&&f.length&&f[f.length-1].role==="user"&&/\s*\/no_think\s*$/.test(f[f.length-1].content)&&(n=!1,f=[...f.slice(0,-1),{...f[f.length-1],content:f[f.length-1].content.replace(/\s*\/no_think\s*$/,"")}]),t==="minicpm"&&(e+="<s>"),r.trim()&&(e+=`<|im_start|>system
${r}<|im_end|>
`);for(let s of f)e+=`<|im_start|>${s.role}
${s.content}<|im_end|>
`;e+=`<|im_start|>assistant
`,t==="qwen35"?e+=n?`<think>
`:`<think>

</think>

`:t==="minicpm"&&!n&&(e+=`<think>

</think>

`)}else if(t==="llama3"){e+="<|begin_of_text|>",r.trim()&&(e+=`<|start_header_id|>system<|end_header_id|>

${r}<|eot_id|>`);for(let n of f)e+=`<|start_header_id|>${n.role}<|end_header_id|>

${n.content}<|eot_id|>`;e+=`<|start_header_id|>assistant<|end_header_id|>

`}else if(t==="mistral3"){e+="<s>",r.trim()&&(e+=`[SYSTEM_PROMPT]${r}[/SYSTEM_PROMPT]`);for(let n of f)n.role==="user"?e+=`[INST]${n.content}[/INST]`:n.role==="assistant"&&(e+=`${n.content}</s>`)}else if(t==="gemma4"){r.trim()&&(e+=`<|turn>system
${r.trim()}<turn|>
`);for(let n of f)e+=`<|turn>${n.role==="assistant"?"model":"user"}
${n.content.trim()}<turn|>
`;e+=`<|turn>model
`}else if(t==="gemma"||t==="gemma3"){r.trim()&&(e+=`<start_of_turn>model
${r}<end_of_turn>
`);for(let n of f)e+=`<start_of_turn>${n.role==="assistant"?"model":"user"}
${n.content}<end_of_turn>
`;e+=`<start_of_turn>model
`}return e}function _s(f){let t=new Set;for(let r of["tokenizer.ggml.eos_token_id","tokenizer.ggml.eot_token_id","tokenizer.ggml.eom_token_id"]){let e=f?.[r],n=typeof e=="number"?e:Number(e);Number.isFinite(n)&&n>=0&&t.add(n)}return[...t]}var xs,ca,As=ce(()=>{"use strict";xs=["<\uFF5Cend\u2581of\u2581sentence\uFF5C>","<\uFF5CAssistant\uFF5C>","<\uFF5CUser\uFF5C>","<\uFF5Cbegin\u2581of\u2581sentence\uFF5C>","<\uFF5Cstart\u2581of\u2581sentence\uFF5C>","<|ifm|im_end|>","<|ifm|im_start|>","<|im_end|>","<|im_start|>","<|eot_id|>","<|begin_of_text|>","<|start_header_id|>","<|end_header_id|>","</s>","<s>","<end_of_turn>","<start_of_turn>","[INST]","[/INST]","[SYSTEM_PROMPT]","</model>","</assistant>","</user>","<|assistant|>","<|user|>",`
User:`];ca=new Set(["qwen3","qwen35","spark","k2h","minicpm"])});function la(){let f=[];for(let s=33;s<=126;s++)f.push(s);for(let s=161;s<=172;s++)f.push(s);for(let s=174;s<=255;s++)f.push(s);let t=f.slice(),r=0;for(let s=0;s<256;s++)f.includes(s)||(f.push(s),t.push(256+r),r++);let e=new Array(256),n=new Map;for(let s=0;s<f.length;s++)e[f[s]]=String.fromCodePoint(t[s]),n.set(String.fromCodePoint(t[s]),f[s]);return{enc:e,dec:n}}var Ps,st,Qr=ce(()=>{"use strict";Ps="'(?:[sdmt]|ll|ve|re)| ?\\p{L}+| ?\\p{N}+| ?[^\\s\\p{L}\\p{N}]+|\\s+(?!\\S)|\\s+",st=class f{constructor(t){this.vocab=new Map;this.idToTok=new Map;this.ranks=new Map;this.added=[];this.specialIds=new Set;this.addedRe=null;this.bosIds=[];this.cache=new Map;let r=typeof t=="string"?JSON.parse(t):t;if(r?.model?.type!=="BPE")throw new Error(`BpeTokenizer : model.type ${r?.model?.type} non couvert (BPE uniquement)`);({enc:this.byteEnc,dec:this.byteDec}=la());for(let[a,o]of Object.entries(r.model.vocab))this.vocab.set(a,o),this.idToTok.set(o,a);(r.model.merges??[]).forEach((a,o)=>this.ranks.set(Array.isArray(a)?`${a[0]} ${a[1]}`:a,o));for(let a of r.added_tokens??[])this.added.push(a),this.vocab.set(a.content,a.id),this.idToTok.set(a.id,a.content),a.special&&this.specialIds.add(a.id);if(this.added.length){let a=this.added.map(o=>o.content.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).sort((o,u)=>u.length-o.length);this.addedRe=new RegExp(`(${a.join("|")})`,"g")}let n=f.findSplitPattern(r.pre_tokenizer)??Ps;this.splitRe=new RegExp(n,"gu");let s=a=>{if(!a)return null;if(a.type==="TemplateProcessing")return a.single;if(a.type==="Sequence")for(let o of a.processors??[]){let u=s(o);if(u)return u}return null},i=s(r.post_processor);if(Array.isArray(i))for(let a of i)if(a.SpecialToken){let o=this.vocab.get(a.SpecialToken.id);o!==void 0&&this.bosIds.push(o)}else break}static findSplitPattern(t){if(!t)return null;if(t.type==="Split"&&t.pattern?.Regex)return t.pattern.Regex;if(t.type==="ByteLevel"&&t.use_regex!==!1)return Ps;if(t.type==="Sequence")for(let r of t.pretokenizers??[]){let e=f.findSplitPattern(r);if(e)return e}return null}bpe(t){let r=this.cache.get(t);if(r)return r;let e=Array.from(t);for(;e.length>1;){let s=-1,i=1/0;for(let a=0;a<e.length-1;a++){let o=this.ranks.get(`${e[a]} ${e[a+1]}`);o!==void 0&&o<i&&(i=o,s=a)}if(s<0)break;e=[...e.slice(0,s),e[s]+e[s+1],...e.slice(s+2)]}let n=[];for(let s of e){let i=this.vocab.get(s);if(i!==void 0)n.push(i);else for(let a of s){let o=this.vocab.get(a);o!==void 0&&n.push(o)}}return this.cache.set(t,n),n}encodeChunk(t){let r=[];for(let e of t.match(this.splitRe)??[]){let n=new TextEncoder().encode(e),s="";for(let i of n)s+=this.byteEnc[i];r.push(...this.bpe(s))}return r}encode(t){let r=[...this.bosIds];if(this.addedRe)for(let e of t.split(this.addedRe)){if(!e)continue;let n=this.vocab.get(e);n!==void 0&&this.added.some(s=>s.content===e)?r.push(n):r.push(...this.encodeChunk(e))}else r.push(...this.encodeChunk(t));return r}decode(t){let r=[];for(let e of t){if(this.specialIds.has(e))continue;let n=this.idToTok.get(e);if(n!==void 0)for(let s of n){let i=this.byteDec.get(s);if(i!==void 0)r.push(i);else for(let a of new TextEncoder().encode(s))r.push(a)}}return new TextDecoder("utf-8",{fatal:!1}).decode(new Uint8Array(r))}}});function Bs(f){let t=f.metadata,r=String(t["tokenizer.ggml.model"]??""),e=t["tokenizer.ggml.tokens"],n=t["tokenizer.ggml.merges"];if(!Array.isArray(e)||!e.length||!Array.isArray(n)||!n.length||r!=="gpt2"&&r!=="llama")return null;let s=String(t["tokenizer.ggml.pre"]??"gpt2"),i=t["tokenizer.ggml.token_type"]??[],a=Us(t["tokenizer.ggml.bos_token_id"]),o=Us(t["tokenizer.ggml.eos_token_id"]),u=t["tokenizer.ggml.add_bos_token"]===!0,c={},l=[],d=[];for(let g=0;g<e.length;g++){let m=e[g],b=i[g]??1;b===3||b===4?(l.push({id:g,content:m,special:b===3}),b===3&&d.push(g)):c[m]=g}let p={version:"1.0",added_tokens:l,pre_tokenizer:{type:"Split",pattern:{Regex:Gs[s]??Gs.gpt2}},post_processor:u&&a!=null?{type:"TemplateProcessing",single:[{SpecialToken:{id:e[a],type_id:0}},{Sequence:{id:"A",type_id:0}}]}:void 0,model:{type:"BPE",vocab:c,merges:n}};try{return{tokenizer:new st(p),nVocab:e.length,pre:s,bosId:a,eosId:o,controlIds:d}}catch(g){return console.warn("[gguf-tok] vocabulaire non consommable par BpeTokenizer. Repli sur le tokenizer HF :",g),null}}function Us(f){let t=Number(f);return Number.isFinite(t)?t:null}var Gs,qs=ce(()=>{"use strict";Qr();Gs={"llama-bpe":"(?:'[sS]|'[tT]|'[rR][eE]|'[vV][eE]|'[mM]|'[lL][lL]|'[dD])|[^\\r\\n\\p{L}\\p{N}]?\\p{L}+|\\p{N}{1,3}| ?[^\\s\\p{L}\\p{N}]+[\\r\\n]*|\\s*[\\r\\n]+|\\s+(?!\\S)|\\s+",qwen2:"(?:'[sS]|'[tT]|'[rR][eE]|'[vV][eE]|'[mM]|'[lL][lL]|'[dD])|[^\\r\\n\\p{L}\\p{N}]?\\p{L}+|\\p{N}| ?[^\\s\\p{L}\\p{N}]+[\\r\\n]*|\\s*[\\r\\n]+|\\s+(?!\\S)|\\s+",gpt2:"'(?:[sdmt]|ll|ve|re)| ?\\p{L}+| ?\\p{N}+| ?[^\\s\\p{L}\\p{N}]+|\\s+(?!\\S)|\\s+",spark2_5:"\\p{N}|[\u4E00-\u9FA5\u3040-\u309F\u30A0-\u30FF]+|[!\"#$%&'()*+,\\-./:;<=>?@\\[\\\\\\]^_`{|}~][A-Za-z]+|[^\\r\\n\\p{L}\\p{P}\\p{S}\\p{N}]?(?:(?![\u4E00-\u9FA5\u3040-\u309F\u30A0-\u30FF])[\\p{L}\\p{M}])+| ?(?:(?![\u4E00-\u9FA5\u3040-\u309F\u30A0-\u30FF])[\\p{P}\\p{S}])+|[\\r\\n]|\\s+(?![^\\s\\p{N}\u4E00-\u9FA5\u3040-\u309F\u30A0-\u30FF])|\\s+|[^\\s\\p{L}\\p{M}\\p{P}\\p{S}\\p{N}]+","k2-horizon":"(?:'[sS]|'[tT]|'[rR][eE]|'[vV][eE]|'[mM]|'[lL][lL]|'[dD])|[^\\r\\n\\p{L}\\p{N}]?(?:\\p{L}|\\p{M}|\\u200C|\\u200D)+|\\p{N}{1,3}| ?[^\\s\\p{L}\\p{N}]+[\\r\\n]*|\\s*[\\r\\n]+|\\s+(?!\\S)|\\s+",qwen35:"(?:'[sS]|'[tT]|'[rR][eE]|'[vV][eE]|'[mM]|'[lL][lL]|'[dD])|[^\\r\\n\\p{L}\\p{N}]?[\\p{L}\\p{M}]+|\\p{N}| ?[^\\s\\p{L}\\p{M}\\p{N}]+[\\r\\n]*|\\s*[\\r\\n]+|\\s+(?!\\S)|\\s+"}});function lt(f,t,r={}){let{temperature:e=.7,topK:n=40,topP:s=.9,rng:i=Math.random}=r;if(!e||e<=0)return f[0];let a=n&&n>0?Math.min(n,f.length):f.length,o=1/e,u=t[0],c=new Float64Array(a),l=0;for(let m=0;m<a;m++){let b=Math.exp((t[m]-u)*o);c[m]=b,l+=b}for(let m=0;m<a;m++)c[m]/=l;let d=a;if(s&&s<1){let m=0;for(let b=0;b<a;b++)if(m+=c[b],m>=s){d=b+1;break}}let p=0;for(let m=0;m<d;m++)p+=c[m];let g=i()*p;for(let m=0;m<d;m++)if(g-=c[m],g<=0)return f[m];return f[d-1]}var Fs=ce(()=>{"use strict"});function Os(f,t){if(f==="llama"){if(t&&t>=1e5)return Ss.llama;if(t&&t<1e5){console.warn(`[brimkern] GGUF arch="llama" avec un vocab de ${t} \u2192 famille Llama 2 / Mistral / TinyLlama : pas de tokenizer par d\xE9faut pour celle-ci, la s\xE9lection actuelle est conserv\xE9e (une r\xE9ponse incoh\xE9rente = mauvais tokenizer).`);return}return}return Ss[f]}var Ms,fa,da,Je,ft,pa,ga,pu,gu,Ss,Cs=ce(()=>{"use strict";Ms="https://huggingface.co/romainkh14/Qwen3-0.6B-Shop-ENFR_BRIK/resolve/main/qwen3-0.6b-shop-enfr-q4.brik",fa="https://huggingface.co/madebyollin/taesd/resolve/614f76814bbe30edbe2e627ace1c2234c81a2c0e",da=`${fa}/taesd_decoder.safetensors`,Je="https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main",ft="https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main",pa={4:`${ft}/video-motion-q8.brik`,2:`${ft}/video-motion-2step-q8.brik`,1:`${ft}/video-motion-1step-q8.brik`},ga=1,pu={unet:`${ft}/video-unet-q8.brik`,motion:pa[ga],clip:`${ft}/video-clip-q8.brik`,taesd:da,rife:`${ft}/rife-4.26-f16.safetensors`},gu={sdturbo:{unet:`${Je}/sd-turbo-unet-q8.brik`,clip:`${Je}/sd-turbo-clip-q8.brik`},sdxs:{unet:`${Je}/sdxs-unet-light.brik`,clip:`${Je}/sd-turbo-clip-mixed.brik`},realvisxl:{unet:`${Je}/realvisxl-unet-mixed.brik`,clip:`${Je}/realvisxl-clip2-q8.brik`,clip1:`${Je}/realvisxl-clip1-q8.brik`,vae:`${Je}/realvisxl-vae-q8.brik`}},Ss={gemma:{archType:"gemma",tokenizerId:"Xenova/gemma-tokenizer"},gemma2:{archType:"gemma",tokenizerId:"Xenova/gemma-tokenizer"},gemma3:{archType:"gemma3",tokenizerId:"unsloth/gemma-3-270m-it"},gemma4:{archType:"gemma4",tokenizerId:"google/gemma-4-E4B-it"},smollm3:{archType:"smollm3",tokenizerId:"HuggingFaceTB/SmolLM3-3B"},qwen3:{archType:"qwen3",tokenizerId:"Qwen/Qwen3-0.6B"},qwen35:{archType:"qwen35",tokenizerId:"Qwen/Qwen2.5-Coder-3B-Instruct"},qwen3_5:{archType:"qwen35",tokenizerId:"Qwen/Qwen2.5-Coder-3B-Instruct"},mistral3:{archType:"mistral3",tokenizerId:"unsloth/Ministral-3-3B-Instruct-2512"},llama:{archType:"llama3",tokenizerId:"unsloth/Llama-3.2-1B-Instruct"}}});function Ts(f){let t=f.arch||"";if(t==="lfm2"||f.config?.lfm2)return"lfm2";if(t==="rwkv7"||f.config?.rwkv)return"rwkv7";if(t==="qwen2"||t.includes("qwen2"))return"qwen";if(t==="qwen35"||t==="qwen3_5"||t==="qwen35moe")return"qwen35";if(t==="qwen3"||t.includes("qwen3"))return"qwen3";if(t==="smollm3"||t.includes("smollm"))return"smollm3";if(t==="mistral3"||t.includes("mistral"))return"mistral3";if(t==="gemma4")return"gemma4";if(t==="spark2_5")return"spark";if(t==="k2-horizon")return"k2h";if(t==="gemma3")return"gemma3";if(t==="gemma"||t==="gemma2")return"gemma";if(t==="deepseek")return"deepseek";if(t==="llama"){let r=f.metadata?.["tokenizer.chat_template"];if(typeof r=="string"&&r.includes("<|im_start|>"))return"minicpm";let e=f.tensors?.["token_embd.weight"],n=f.config?.d,s=e&&n?e.nElems/n:null;return s&&s<1e5?"llama2":"llama3"}return"qwen"}async function ha(f,t){let r=new $t;if(!await r.init())throw Object.assign(new Error("WebGPU is not available in this browser."),{code:"no-webgpu"});r.onLost=v=>{console.warn("[brimkern] device GPU perdu ("+(v?.reason||"unknown")+"): rechargement au prochain appel"),Ne.delete(f)},await r.selfValidate(),t("download");let e=await Xe(f,0,12).catch(()=>null);if((e?.bytes&&e.bytes.length>=4?String.fromCharCode(...e.bytes.subarray(0,4)):"")==="GGUF"||f.toLowerCase().includes(".gguf")){await ys(f,h=>{t("download",{loaded:h.doneBytes,total:h.totalBytes})}).catch(h=>{console.warn("[gguf] pr\xE9chargement par plages indisponible :",h)});let v=await vs(f).catch(h=>(console.warn("[gguf] streaming par plages \xE9chou\xE9, repli complet :",h),null)),U,A;if(v)U=v.manifest,A=v.source;else{let h=await Kr(f);U=await rr(new Blob([h.buffer])),A={bytes:async(y,k)=>h.subarray(y,y+k)}}let F=Ts(U);t("tokenizer");let T=F==="gemma4"?Zn(U):Bs(U),K,P=_s(U.metadata);if(T)K=T.tokenizer,T.eosId!=null&&P.push(T.eosId),T.controlIds?.length&&P.push(...T.controlIds);else{console.warn("[brimkern] tokenizer GGUF non-BPE : repli transformers.js (CDN)");let h=await import(cr),y=U.tensors?.["token_embd.weight"],k=y&&U.config?.d?y.nElems/U.config.d:null,w=Os(String(U.arch||""),k),x=U.metadata?.["tokenizer.ggml.id"]||"",B=F==="llama3"?"unsloth/Llama-3.2-1B-Instruct":"Qwen/Qwen2.5-Coder-0.5B-Instruct",q=w?.tokenizerId||(qt(x)?x:B);if(!qt(q))throw new Error(`[brimkern] identifiant de tokenizer refus\xE9 : "${q}"`);let M=await h.AutoTokenizer.from_pretrained(q);K={encode:O=>Array.from(M(O).input_ids.data,C=>Number(C)),decode:O=>M.decode(O,{skip_special_tokens:!0})}}F==="gemma3"&&P.push(106,1),F==="gemma4"&&P.push(106,1,50),F==="gemma"&&P.push(107,1);let G=F==="gemma4"?new Xt(r,A,U):F==="qwen35"?new er(r,A,U):F==="spark"?new Jt(r,A,U):F==="k2h"?new Zt(r,A,U):new _e(r,A,U);return t("gpu"),await G.prewarmGpu((h,y)=>{t("gpu",{loaded:h,total:y})}),{core:new St(r,G,K,F,P),engine:r}}let i=await bs(f),a=i.manifest,o=a?.config?.lfm2?"lfm2":a?.config?.rwkv?"rwkv7":"transformer";if(o==="transformer"){t("tokenizer");let v;if(i.tokenizer?.json)try{let K=new st(i.tokenizer.json);v={encode:P=>K.encode(P),decode:P=>K.decode(P)}}catch(K){console.warn("[brimkern] tokenizer.json non couvert par le BPE bundl\xE9 : repli transformers.js (CDN)",K);let P=await import(cr),G=new P.PreTrainedTokenizer(JSON.parse(i.tokenizer.json),JSON.parse(i.tokenizer.config));v={encode:_=>Array.from(G(_).input_ids.data,h=>Number(h)),decode:_=>G.decode(_,{skip_special_tokens:!0})}}else{let K=await import(cr),P=i.tokenizerId||"Qwen/Qwen2.5-0.5B-Instruct";if(!qt(P))throw new Error(`[brimkern] identifiant de tokenizer refus\xE9 : "${P}"`);let G=await K.AutoTokenizer.from_pretrained(P);v={encode:_=>Array.from(G(_).input_ids.data,h=>Number(h)),decode:_=>G.decode(_,{skip_special_tokens:!0})}}let U=new _e(r,i.source,a);t("gpu"),await U.prewarmGpu((K,P)=>{t("gpu",{loaded:K,total:P})});let A=Ts(a),F=i.stopTokenIds?.length?i.stopTokenIds:[151645,151643];return{core:new St(r,U,v,A,F),engine:r}}let u=a.tensors["token_embd.weight"],c={arch:{...a.config,arch:o,vocab:u?u.nElems/a.config.d:0},tensors:Object.fromEntries(Object.entries(a.tensors).map(([v,U])=>[v,{dtype:ma[U.type]??U.type,shape:U.shape,nElems:U.nElems,shard:0,offset:U.offset,byteLength:U.bytes}])),shards:[{id:0,file:"",byteLength:0}],chat:o==="lfm2"?{template:"chatml",stopTokenIds:[7,2,8,10,12]}:{template:"rwkv",stopTokenIds:[0]}},l=Object.values(a.tensors).reduce((v,U)=>v+U.bytes,0),d=0,p=qr(a.tensors,i.source),g=async v=>{let U=a.tensors[v];if(!U)throw new Error(`tenseur absent : ${v}`);let A=await p(v);return d+=U.bytes,t("download",{loaded:d,total:l}),A};if(t("tokenizer"),o==="rwkv7"){let v=i.tokenizer?.json?JSON.parse(i.tokenizer.json):null;if(!v?.tokens)throw new Error("RWKV .brik without its embedded World vocab (rebuild the BRIK).");let U=new Ut(r,c,g);return t("gpu"),await U.load(v.tokens),{core:U,engine:r}}let m;try{let v=new st(i.tokenizer.json);m={encode:U=>v.encode(U),decode:U=>v.decode(U)}}catch(v){console.warn("[brimkern] tokenizer.json non couvert par le BPE bundl\xE9 : repli transformers.js (CDN)",v);let U=await import(cr),A=new U.PreTrainedTokenizer(JSON.parse(i.tokenizer.json),JSON.parse(i.tokenizer.config));m={encode:F=>Array.from(A(F).input_ids.data,T=>Number(T)),decode:F=>A.decode(F,{skip_special_tokens:!0})}}let b=new Wt(r,c,g);return t("gpu"),await b.load(m),{core:b,engine:r}}function Mt(f){if(!f)return lr["qwen3-0.6b-shop"];if(f.startsWith("https://")||/^http:\/\/(localhost|127\.0\.0\.1)[:/]/.test(f))return f;if(lr[f])return lr[f];let t=/^http:\/\//.test(f)?"plain http is only allowed for localhost (use https)":/^file:\/\//.test(f)?"file:// URLs are not supported (serve the file over http://localhost)":`unknown model key (known: ${Object.keys(lr).join(", ")})`;throw new Error(`[brimkern] model "${f}" cannot be loaded: ${t}`)}function fr(f,t){let r=Ne.get(f);if(!r){let e={status:"init",state:"loading",listeners:new Set,promise:null};e.promise=ha(f,(n,s)=>{e.status=n,e.progress=s,e.listeners.forEach(i=>i(n,s))}).then(n=>(e.state="ready",n)).catch(n=>{throw e.state="error",Ne.delete(f),n}),Ne.set(f,e),r=e}return t&&(r.state!=="ready"&&t(r.status,r.progress),r.listeners.add(t),r.promise.finally(()=>r.listeners.delete(t)).catch(()=>{})),r.promise}async function Rs(f,t){let r=await fr(f,t);return r.engine.lost?(Ne.delete(f),(await fr(f,t)).core):r.core}async function $r(f,t){let r=await Rs(f);try{return await t(r)}catch(e){let n=Ne.get(f);if(!(!n||await n.promise.then(i=>i.engine.lost).catch(()=>!0)))throw e;return console.warn("[brimkern] g\xE9n\xE9ration interrompue par une perte de device : nouvelle tentative"),Ne.delete(f),t(await Rs(f))}}function Ds(f,t){let r=f.replace(/<\|[a-z_]+\|>/g,"");if(r=r.replace(/\s*-{2,}\s*(?:E(?:N(?:D(?:\s*O(?:F(?:\s*N(?:O(?:T(?:E(?:S)?)?)?)?)?)?)?)?)?|N(?:O(?:T(?:E(?:S)?)?)?)?)\s*-*\s*$/i,""),t){let e=r.replace(/^\s*(hello|hi|hey|bonjour|salut)\s*[!,.]\s*/i,"");e.trim()&&(r=e)}return r.trimEnd()}function js(f){let t=-1;for(let r of xs){let e=f.indexOf(r);e!==-1&&(t===-1||e<t)&&(t=e)}return t===-1?{text:f,hit:!1}:{text:f.slice(0,t),hit:!0}}async function Wr(f,t,r,e,n,s,i,a=[],o=1.3,u=!1){let c=f.arch||(f instanceof Ut?"rwkv7":"lfm2"),l=[...a,...t.slice(-Ls)],d=Nr(u?l:Hr(l,c),c,r),p=a.some(v=>v.role==="assistant")||t.some(v=>v.role==="assistant"),g="",m=!1;return await(f.residentAvailable?.()?f.generateResident.bind(f):f.generate.bind(f))(d,e,v=>{let U=js(v);U.hit&&(m=!0),g=Ds(u?U.text:zr(U.text),p),s?.(g)},()=>m||!!i?.(),{sample:n>0,temperature:n,topK:40,repeatPenalty:o}),g}async function Ks(f,t,r,e,n=1.3,s=!1){let i=f;if(!(f instanceof St)||!i.batchAvailable()||t.length<2){let u=[];for(let c of t)u.push(await Wr(f,c.history,c.system,r,e,void 0,void 0,c.pinned??[],n,s));return u}let a=t.map(u=>{let c=[...u.pinned??[],...u.history.slice(-Ls)];return Nr(s?c:Hr(c,i.arch),i.arch,u.system)});return(await i.generateBatch(a,r,{sample:e>0,temperature:e,topK:40,repeatPenalty:n})).map((u,c)=>{let l=js(u).text;return Ds(s?l:zr(l),t[c].history.some(d=>d.role==="assistant"))})}var St,cr,lr,ma,Ls,Ne,Ir=ce(()=>{"use strict";Pt();Hn();Nn();nt();Vn();Yn();Xn();Jn();es();ks();ct();As();Qr();qs();Fs();Or();ir();Cs();St=class{constructor(t,r,e,n,s){this.engine=t;this.model=r;this.tok=e;this.lastSpecStats=null;this.arch=n,this.stops=new Set(s||[])}residentAvailable(){return!0}reset(){this.model.reset()}unload(){this.model.unload()}async generate(t,r,e,n,s){return this.generateResident(t,r,e,n,s)}async generateResident(t,r,e,n,s){let i="sdk-gen",a=s?.repeatPenalty??(s?.sample?1.3:1),o=s?.temperature??.55,u=s?.topK??40,c=64,l=this.model;if(typeof l.speculativeReady=="function"&&l.speculativeReady())return this.generateSpeculative(l,t,r,e,n,{sid:i,penalty:a,temp:o,topK:u,sample:s?.sample!==!1,window:c});this.model.reset();let d=this.tok.encode(t);if(!d.length)return"";let p=256,g=0,m=0;for(let F=0;F<d.length;F+=p){if(n?.())return"";let T=d.slice(F,F+p);if(F+p>=d.length){let P=await this.model.topKKV(T,g,i,d.slice(-c),a);m=lt(P.ids,P.vals,{temperature:s?.sample===!1?0:o,topK:u})}else await this.model.topKKV(T,g,i,[],1);g+=T.length}if(!Number.isInteger(m)||m<0||this.stops.has(m))return"";let b=[m],v=[...d.slice(-c),m].slice(-c),U=new Map;for(let F of v)U.set(F,(U.get(F)??0)+1);let A=F=>{if(v.push(F),U.set(F,(U.get(F)??0)+1),v.length>c){let T=v.shift(),K=U.get(T)-1;K===0?U.delete(T):U.set(T,K)}};e&&e(this.tok.decode(b));for(let F=1;F<r&&!n?.();F++){let T=d.length+F-1,K=await this.model.topKKV([m],T,i,[...U.keys()],a);if(!K.ids||!K.ids.length)break;let P=lt(K.ids,K.vals,{temperature:s?.sample===!1?0:o,topK:u});if(!Number.isInteger(P)||P<0||this.stops.has(P))break;m=P,b.push(m),A(m),e&&e(this.tok.decode(b))}return this.tok.decode(b)}batchAvailable(){return this.model.batchAvailable===!0&&typeof this.model.topKBatch=="function"}async generateBatch(t,r,e,n){if(!this.batchAvailable()||t.length<2){let p=[];for(let g=0;g<t.length;g++)p.push(await this.generateResident(t[g],r,m=>n?.(g,m),void 0,e));return p}let s=this.engine,i=this.model,a=e?.repeatPenalty??(e?.sample?1.3:1),o=e?.sample===!1?0:e?.temperature??.55,u=e?.topK??40,c=64,l=256,d=[];try{this.model.reset();for(let p=0;p<t.length;p++){let g=`batch-${p}`;s.useKvContext(g);let m=this.tok.encode(t[p]),b=null;for(let A=0;A<m.length;A+=l){let F=m.slice(A,A+l),T=A+l>=m.length;b=await this.model.topKKV(F,A,g,T?m.slice(-c):[],T?a:1)}let v=b?lt(b.ids,b.vals,{temperature:o,topK:u}):-1,U=!m.length||!Number.isInteger(v)||v<0||this.stops.has(v);d.push({i:p,ctx:g,pos:m.length,last:v,out:U?[]:[v],win:[...m.slice(-c),v].slice(-c),done:U}),U||n?.(p,this.tok.decode([v]))}for(let p=1;p<r;p++){let g=d.filter(b=>!b.done);if(!g.length)break;let m=await i.topKBatch(g.map(b=>b.last),g.map(b=>b.ctx),g.map(b=>b.pos),g.map(b=>[...new Set(b.win)]),a);g.forEach((b,v)=>{b.pos++;let U=lt(m[v].ids,m[v].vals,{temperature:o,topK:u});if(!Number.isInteger(U)||U<0||this.stops.has(U)){b.done=!0;return}b.out.push(U),b.last=U,b.win.push(U),b.win.length>c&&b.win.shift(),n?.(b.i,this.tok.decode(b.out))})}}finally{s.dropKvContexts()}return d.map(p=>this.tok.decode(p.out))}async generateSpeculative(t,r,e,n,s,i){this.model.reset();let a=this.tok.encode(r);if(!a.length)return"";let o=A=>lt(A.ids,A.vals,{temperature:i.sample?i.temp:0,topK:i.topK}),u=256,c=null;for(let A=0;A<a.length;A+=u){if(s?.())return"";let F=a.slice(A,A+u),T=A+u>=a.length;c=await t.specPrefill(F,A,i.sid,T?a.slice(-i.window):[],T?i.penalty:1)}let l=o(c);if(!Number.isInteger(l)||l<0||this.stops.has(l))return"";let d=[l],p=[...a.slice(-i.window),l].slice(-i.window),g=new Map;for(let A of p)g.set(A,(g.get(A)??0)+1);let m=A=>{if(d.push(A),p.push(A),g.set(A,(g.get(A)??0)+1),p.length>i.window){let F=p.shift(),T=g.get(F)-1;T===0?g.delete(F):g.set(F,T)}n?.(this.tok.decode(d))};n?.(this.tok.decode(d));let b=a.length,v=await t.specDraft([l],b,"last"),U={drafts:0,accepted:0};for(;d.length<e&&!s?.();){let A=[...g.keys()],F=g.has(v)?A:[...A,v],[T,K]=await t.specVerify(l,v,b,i.sid,A,F,i.penalty);U.drafts++;let P=o(T);if(!Number.isInteger(P)||P<0||this.stops.has(P))break;if(P===v){if(U.accepted++,m(v),d.length>=e||s?.())break;let G=o(K);if(!Number.isInteger(G)||G<0||this.stops.has(G))break;m(G),v=await t.specDraft([P,G],b+1,"verify"),l=G,b+=2}else t.specRollback(),m(P),v=await t.specDraft([P],b+1,"verify0"),l=P,b+=1}return this.lastSpecStats=U,this.tok.decode(d)}},cr="https://esm.sh/@huggingface/transformers@4.2.0",lr={"qwen3-0.6b-shop":Ms,"lfm2.5-230m":"https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik","qwen-0.5b":"https://huggingface.co/romainkh14/Qwen2.5-0.5B-Instruct_BRIK/resolve/main/qwen2.5-0.5b-instruct-mixed.brik","coder-0.5b":"https://huggingface.co/Qwen/Qwen2.5-Coder-0.5B-Instruct-GGUF/resolve/ebb2015119c907b064c512bf053e945850b5875f/qwen2.5-coder-0.5b-instruct-q4_k_m.gguf","coder-1.5b":"https://huggingface.co/Qwen/Qwen2.5-Coder-1.5B-Instruct-GGUF/resolve/f86cb2c1fa58255f8052cc32aeede1b7482d4361/qwen2.5-coder-1.5b-instruct-q4_k_m.gguf","rwkv-0.4b":"https://huggingface.co/romainkh14/RWKV-7-G1a-0.4B_BRIK/resolve/main/rwkv7-g1a-0.4b-q4.brik","rwkv-0.1b":"https://huggingface.co/romainkh14/RWKV-7-G1-0.1B_BRIK/resolve/main/rwkv7-g1-0.1b-q4.brik"},ma={F16:"f16",F32:"f32",Q4W:"q4",Q8W:"q8",Q3W:"q3"},Ls=12;Ne=new Map});var Es={};bn(Es,{LocalBackend:()=>Ot});var Ot,Vr=ce(()=>{"use strict";Ir();Ot=class{constructor(){this.kind="main"}async preload(t,r){await fr(t,r)}state(t){return Ne.get(t)?.state}turn(t,r,e){return $r(t.url,n=>Wr(n,t.history,t.system,t.maxTokens,t.temperature,r,()=>!!e?.aborted,t.pinned,t.repeatPenalty,t.reasoning))}turnBatch(t){let r=t[0];return $r(r.url,e=>Ks(e,t,r.maxTokens,r.temperature,r.repeatPenalty,r.reasoning))}dispose(){}}});function ba(){try{if(typeof document>"u")return"";let f=document.currentScript;if(f?.src)return new URL(f.src,document.baseURI).href}catch{}return""}function zs(f){Hs=f}function Ns(){return Hs||va}var va,Hs,Yr=ce(()=>{"use strict";va=ba(),Hs=""});var Qs={};bn(Qs,{WorkerBackend:()=>Xr});var Xr,$s=ce(()=>{"use strict";Yr();Xr=class{constructor(){this.kind="worker";this.seq=0;this.pending=new Map;this.states=new Map;if(typeof Worker>"u")throw new Error("Worker indisponible");let t=Ns();if(!t)throw new Error("URL du script introuvable (import ESM ?) : passez workerUrl");let r=(()=>{try{return location.search}catch{return""}})(),e=`self.__brimkernSearch=${JSON.stringify(r)};importScripts(${JSON.stringify(t)});`,n=new Blob([e],{type:"text/javascript"});this.url=URL.createObjectURL(n),this.worker=new Worker(this.url);let s,i;this.hello=new Promise((a,o)=>{s=a,i=o}),this.worker.onerror=a=>i(new Error(`worker: ${a.message||"\xE9chec de chargement"}`)),this.worker.onmessage=a=>{let o=a.data;if(o.type==="hello"){s();return}let u=this.pending.get(o.id);if(u){if(o.type==="progress"){u.onProgress?.(o.status,o.progress);return}if(o.type==="token"){u.onToken?.(o.text);return}this.pending.delete(o.id),o.type==="error"?u.reject(new Error(o.message)):o.type==="state"?u.resolve(o.state):u.resolve(o.text??"")}}}ready(){return this.hello}send(t,r={}){let e=++this.seq,n=new Promise((s,i)=>{this.pending.set(e,{resolve:s,reject:i,...r}),this.worker.postMessage({...t,id:e})});return{id:e,done:n}}async preload(t,r){await this.hello,this.states.get(t)!=="ready"&&this.states.set(t,"loading");try{await this.send({type:"preload",url:t},{onProgress:r}).done,this.states.set(t,"ready")}catch(e){throw this.states.set(t,"error"),e}}state(t){return this.states.get(t)}async turn(t,r,e){await this.hello;let{id:n,done:s}=this.send({type:"turn",req:t},{onToken:r}),i=()=>this.worker.postMessage({type:"stop",id:n});e?.aborted?i():e?.addEventListener("abort",i,{once:!0});try{let a=await s;return this.states.set(t.url,"ready"),a}finally{e?.removeEventListener("abort",i)}}dispose(){this.worker.terminate(),URL.revokeObjectURL(this.url);for(let t of this.pending.values())t.reject(new Error("worker arr\xEAt\xE9"));this.pending.clear()}}});var _a={};var Jr,dr,it,Is=ce(()=>{"use strict";Vr();Jr=new Ot,dr=new Set,it=f=>self.postMessage(f);self.onmessage=async f=>{let t=f.data;if(t.type==="stop"){dr.add(t.id);return}if(t.type==="state"){it({type:"state",id:t.id,state:Jr.state(t.url)});return}try{if(t.type==="preload"){await Jr.preload(t.url,(r,e)=>it({type:"progress",id:t.id,status:r,progress:e})),it({type:"done",id:t.id});return}if(t.type==="turn"){let r=new AbortController,e=new Proxy(r.signal,{get:(u,c)=>c==="aborted"?dr.has(t.id):Reflect.get(u,c)}),n=16,s=0,i=null,a=()=>{i!==null&&(it({type:"token",id:t.id,text:i}),i=null,s=Date.now())},o=await Jr.turn(t.req,u=>{i=u,Date.now()-s>=n&&a()},e);a(),it({type:"done",id:t.id,text:o}),dr.delete(t.id);return}}catch(r){dr.delete(t.id),it({type:"error",id:t.id,message:r instanceof Error?r.message:String(r)})}};it({type:"hello"})});var ni=new Set(["avec","pour","dans","les","des","une","est","sur","par","que","qui","quoi","comment","pourquoi","quand","vous","nous","votre","notre","mais","plus","tout","tous","cette","sont","avez","puis","faire","fait","fais","font","the","and","for","with","what","who","how","why","when","about","your","our","you","are","can","does","did","this","that","from","have","je","tu","il","elle","on","ils","elles","du","de","la","le","un","en","au","aux","ce","ces","cet","se","sa","son","ses","mon","ma","mes","ton","ta","tes","me","te","ne","pas","si","ou","et","ni","car","donc","or","to","in","at","it","is","be","as","an","by","do","no","so","my","he","we","us","me","am","was","were","been","quel","quelle","quels","quelles","which","where","bonjour","salut","hello","merci"]),Kt=new Map,si=2e4;function wr(f){let t=Kt.get(f);if(t!==void 0)return t;let r=ii(f);return Kt.size>=si&&Kt.clear(),Kt.set(f,r),r}function ii(f){let t=f.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");return t.length<=3||(t=t.replace(/(?:ments?|ements?|eront|erait|aient|antes?|ances?|euses?|ables?|tions?|sions?|eaux|eurs?|euse|ique|iques|istes?|ings?|ness|able|ible|less|full?)$/,""),t.length>3&&(t=t.replace(/(?:er|ir|ez|ent|ais|ait|ant|ees?|es?|ed|ly|s)$/,""))),t}function ht(f){let t=(f.toLowerCase().match(/[\p{L}\p{N}]+/gu)??[]).filter(r=>ni.has(r)?!1:/\d/.test(r)?!0:r.length>=2);return[...new Set(t)]}function yn(f,t=600){let r=[];return f.forEach((e,n)=>{let s=(e.title||"").trim(),i=(e.text||"").split(/\n\s*\n+/).map(u=>u.trim()).filter(Boolean),a="",o=()=>{a.trim()&&r.push({title:s,text:a.trim(),doc:n}),a=""};for(let u of i){if(u.length>t*1.6){o();let c=u.split(/(?<=[.!?])\s+/),l="";for(let d of c)l&&(l+" "+d).length>t?(r.push({title:s,text:l.trim(),doc:n}),l=d):l=l?`${l} ${d}`:d;l.trim()&&r.push({title:s,text:l.trim(),doc:n});continue}a&&(a+`

`+u).length>t&&o(),a=a?`${a}

${u}`:u}o()}),r}var vn=new WeakMap;function wn(f){let t=new Set;for(let r of f)r.length>=4&&t.add(r.slice(0,4));return t}function ai(f){let t=vn.get(f);if(t)return t;let r=`${f.title} ${f.text}`.toLowerCase(),e=f.title.toLowerCase(),n=new Set(ht(r).map(wr)),s=new Set(ht(e).map(wr)),i={hay:r,titre:e,docStems:n,titreStems:s,docPrefix4:wn(n),titrePrefix4:wn(s)};return vn.set(f,i),i}function oi(f,t,r){if(!f.length)return 0;let e=ai(t),n=0,s=0;for(let i of f){let a=r.get(i)??1;s+=a;let o=wr(i),u=o.length>=4?o.slice(0,4):null;if(e.hay.includes(i)||e.docStems.has(o)||u!==null&&e.docPrefix4.has(u)){let l=e.titre.includes(i)||e.titreStems.has(o)||u!==null&&e.titrePrefix4.has(u);n+=a*(l?2.2:1)}}return s?n/s:0}function ui(f){let t=new Map;for(let n of f)for(let s of ht(`${n.title} ${n.text}`))t.set(s,(t.get(s)??0)+1);let r=new Map,e=Math.max(1,f.length);for(let[n,s]of t)r.set(n,Math.log(1+e/s));return r}function kn(f,t,r=1200,e=3,n=.22,s=.5){let i=ht(f);if(!i.length||!t.length)return[];let a=ui(t),o=t.map(g=>({c:g,s:oi(i,g,a)})).filter(g=>g.s>=n).sort((g,m)=>m.s-g.s),u=o.length?o[0].s*s:0,c=o.filter(g=>g.s>=u),l=[],d=new Set,p=r;for(let{c:g,s:m}of c)l.length>=e||g.text.length>p||d.has(g.doc)||(l.push({chunk:g,score:m}),d.add(g.doc),p-=g.text.length);for(let{c:g,s:m}of c){if(l.length>=e)break;l.some(b=>b.chunk===g)||g.text.length>p||(l.push({chunk:g,score:m}),p-=g.text.length)}return l}function yr(f){if(ht(f).length<2)return!1;let t=f.trim().toLowerCase();return/\?\s*$/.test(t)?!0:/^(?:who|what|when|where|why|how|which|whose|is|are|was|were|do|does|did|can|could|will|would|should|may|have|has|qui|que|quoi|quand|où|pourquoi|comment|combien|quel|quelles?|quels|est|sont|était|avez|peux|pouvez|puis|vous|y a-t-il|est-ce)\b/.test(t)}function kr(f,t=!1){let r=f.trim();return r?t?/pas cette information|n[’']ai pas (?:cette|ces|d[’']information)|ne (?:sais|dispose) pas|pas en mesure de (?:vous )?(?:aider|répondre|renseigner|fournir)|ne peux pas (?:vous )?(?:aider|fournir|renseigner|répondre)/i.test(r):/do not have (?:that|this|any) information|don[’']t have (?:that|this|any) information|no information (?:about|on)|(?:can[’']t|cannot|not able to|unable to) (?:assist|provide|answer|access|help you with that)/i.test(r):!1}function ci(f){let t=f.trim().toLowerCase().replace(/[!?.,;:\-_]/g,"").trim();return/^(hi|hello|hey|greetings|good\s+(morning|afternoon|evening|day)|bonjour|salut|coucou|bonsoir|how\s+are\s+you|how\s+are\s+you\s+doing|ça\s+va|ca\s+va|comment\s+vas?-tu|comment\s+allez-vous|who\s+are\s+you|qui\s+es-tu|merci|thanks|thank\s+you|what\s+can\s+you\s+do|que\s+peux-tu\s+faire)$/i.test(t)}function Et(f,t,r=!1){if(t&&ci(t))return"";if(!f.length)return t&&!yr(t)?r?`

Ce message n\u2019appelle aucune fiche : r\xE9ponds en une phrase courte et aimable.`:`

This message needs no reference note: reply in one short, friendly sentence.`:r?`

Aucune fiche de r\xE9f\xE9rence ne correspond \xE0 cette question. Dis que tu n\u2019as pas cette information : ne devine pas.`:`

No reference note matches this question. Say that you do not have this information: do not guess.`;let e=f.map((s,i)=>`[${i+1}]${s.title?` ${s.title}`:""}
${s.text}`).join(`

`);return`

${r?"R\xE9ponds UNIQUEMENT \xE0 partir des fiches ci-dessous, en fran\xE7ais. Reprends leurs chiffres exactement. Si la r\xE9ponse n\u2019y est pas, dis que tu n\u2019as pas cette information : n\u2019invente jamais pour combler.":"Answer using ONLY the reference notes below. Copy their figures exactly. If the answer is not in them, say you do not have that information: never fill the gap with what you assume."}

--- NOTES ---
${e}
--- END OF NOTES ---`}function xn(f){let t=Array.isArray(f)?f:[f],r=[];for(let e of t)typeof e=="string"&&e.trim()?r.push({text:e}):e&&typeof e=="object"&&typeof e.text=="string"&&e.text.trim()&&r.push({title:e.title,text:e.text});return r}function li(f){let t=f.replace(/×/g,"*").replace(/÷/g,"/").replace(/,/g,".").replace(/[\s  ]/g,"").replace(/=+$/,"");if(!t||t.length>200)return null;let r=0,e=()=>t[r],n=()=>{let l=/^\d+(\.\d+)?/.exec(t.slice(r));return l?(r+=l[0].length,parseFloat(l[0])):null},s=()=>{if(e()==="("){r++;let l=u();return l===null||e()!==")"?null:(r++,l)}return n()},i=()=>{if(e()==="-"){r++;let l=i();return l===null?null:-l}return s()},a=()=>{let l=i();if(l===null)return null;if(e()==="^"){r++;let d=a();return d===null?null:Math.pow(l,d)}return l},o=()=>{let l=a();for(;l!==null&&(e()==="*"||e()==="/"||e()==="%");){let d=t[r++],p=a();if(p===null)return null;l=d==="*"?l*p:d==="/"?l/p:l%p}return l},u=()=>{let l=o();for(;l!==null&&(e()==="+"||e()==="-");){let d=t[r++],p=o();if(p===null)return null;l=d==="+"?l+p:l-p}return l},c=u();return r===t.length&&c!==null&&Number.isFinite(c)?c:null}function _n(f,t=3){let r=[],e=new Set,n=/[\d(][\d\s  .,+\-*/×÷%^()]*[\d)]\s*=?/g;for(let s of f.matchAll(n)){let i=s[0].trim();if(r.length>=t)break;if(e.has(i)||/\d{1,2}[/.]\d{1,2}[/.]\d{2,4}/.test(i)||/\d+:\d+/.test(f.slice(Math.max(0,s.index-1),s.index+i.length+1)))continue;let a=(i.match(/[+\-*/×÷%^]/g)||[]).length,o=/[*×÷%^(]/.test(i)||/=$/.test(i)||a>=2;if(a===0||!o)continue;let u=li(i);if(u===null)continue;let c=i.replace(/=+$/,"").trim();/[+\-*/×÷%^]/.test(c)&&(e.add(i),r.push({expr:c,value:u}))}return r}function An(f){let t=Math.round(f*1e9)/1e9;return Number.isInteger(t),String(t)}function Ht(f){return new Date().toLocaleDateString(f==="fr"?"fr-FR":"en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}var fi=1e4,di=600;function bt(f){if(!Array.isArray(f))return[];let t=[];for(let r of f){if(r==="calc"||r==="date"){t.push(r);continue}let e=r;if(e&&typeof e=="object"&&typeof e.name=="string"&&e.name.trim()&&typeof e.run=="function"&&(e.match instanceof RegExp||typeof e.match=="function")){t.push(e);continue}console.warn("[brimkern] outil ignor\xE9 (attendu : 'calc', 'date', ou { name, match, run }) :",r)}return t}var Pn=f=>f.includes("date");function Gn(f){return f?`
(Date du jour : ${Ht("fr")}.)`:`
(Today's date: ${Ht("en")}.)`}var pi=/\b(?:today|tonight|what\s+day|which\s+day|what\s+date|what\s+year|what\s+month|current\s+(?:date|day|year)|aujourd(?:'|’)hui|quel\s+jour|quelle\s+date|quelle\s+ann[ée]e|quel\s+mois|on\s+est\s+quel)\b/i,gi=(f,t)=>new Promise((r,e)=>{let n=setTimeout(()=>e(new Error(`outil sans r\xE9ponse apr\xE8s ${t} ms`)),t);f.then(s=>{clearTimeout(n),r(s)},s=>{clearTimeout(n),e(s)})});async function xr(f,t,r){let e=[];for(let n of f){if(n==="date"){pi.test(t)&&e.push({name:"date",result:Ht(r?"fr":"en")});continue}if(n==="calc"){let s=_n(t);s.length&&e.push({name:r?"calculatrice":"calculator",result:s.map(i=>`${i.expr} = ${An(i.value)}`).join(" ; ")});continue}try{if(!(n.match instanceof RegExp?n.match.test(t):n.match(t)))continue;let i=await gi(Promise.resolve(n.run(t)),fi),a=String(i??"").replace(/\s+/g," ").trim().slice(0,di);a&&e.push({name:n.name.replace(/\s+/g," ").trim().slice(0,40),result:a})}catch(s){console.error(`[brimkern] outil \xAB ${n.name} \xBB a \xE9chou\xE9 :`,s)}}return e}function vt(f,t){if(!f.length)return"";let r=f.map(e=>t?`${e.name} : ${e.result}`:`${e.name}: ${e.result}`).join(" \xB7 ");return t?`[R\xE9sultats d\u2019outils locaux. Exacts, utilise-les tels quels : ${r}]`:`[Local tool results. Exact values, use them as-is: ${r}]`}Ir();async function Ws(f){let{LocalBackend:t}=await Promise.resolve().then(()=>(Vr(),Es));if(f!==!0)return new t;try{let{WorkerBackend:r}=await Promise.resolve().then(()=>($s(),Qs)),e=new r;return await e.ready(),e}catch(r){return console.warn("[brimkern] Web Worker indisponible : inf\xE9rence sur le thread principal",r),new t}}Yr();var wa=`
Answer briefly and honestly. If you do not know something, say so: never invent facts or details.
You have no tools and no internet access: never emit tool calls, reply in plain text only.`,ya=`
Answer briefly and honestly. If you do not know something, say so: never invent facts or details.
Bracketed tool results in the message are exact facts: use them as-is. Never emit tool calls yourself, reply in plain text only.`;function dt(f){return f.lang?f.lang==="fr":f.system?/[àâäéèêëîïôöùûüç]|\b(?:bonjour|salut|vous|tu|réponds|conseiller|boutique|aide|aidez|client|magasin)\b/i.test(f.system):!!(typeof document<"u"&&/^fr\b/i.test(document.documentElement.lang||"")||typeof navigator<"u"&&/^fr\b/i.test(navigator.language||""))}function Ct(f){let t=bt(f.tools),r=Pn(t)?Gn(dt(f)):"",e=(f.system||"You are a helpful assistant.")+(t.length?ya:wa)+r,n=c=>c.flatMap(l=>[{role:"user",content:l.user},{role:"assistant",content:l.assistant}]),s=t.length?ka(dt(f)):[];if(!f.knowledge)return{system:()=>e,userTurn:(c,l)=>({text:l?`${c}

${l}`:c,sources:[],conversationnel:!1}),pinned:n([...s,...f.examples||[]])};let i=yn(xn(f.knowledge)),a=f.knowledgeBudget??1200,o=dt(f),u=o?e+`

Le message utilisateur peut inclure des fiches de r\xE9f\xE9rence entre des balises ---. Dans ce cas, r\xE9ponds uniquement \xE0 partir de ces fiches en citant fid\xE8lement leurs informations dans la langue de la question. Si aucune note ne correspond, indique poliment que tu n\u2019as pas cette information.`:e+`

The user message may include reference notes between --- markers. When it does, answer from those notes and quote their figures exactly. When it says no note matches, say you do not have that information.`;return{system:()=>u,userTurn:(c,l)=>{let d=kn(c,i,a);if(l&&!d.length)return{text:`${c}

${l}`,sources:[],conversationnel:!1};let p=Et(d.map(m=>m.chunk),c,o).trim(),g=m=>l?`${m}

${l}`:m;return{text:p?`${g(p)}

Question: ${c}`:g(c),sources:p?d.map(({chunk:m,score:b})=>({title:m.title,text:m.text,score:b,doc:m.doc})):[],conversationnel:!d.length&&!yr(c)}},pinned:n([...xa(o),...s,...f.examples||[]])}}function ka(f=!1){let t=(r,e)=>`${r}

${vt(e,f)}`;return f?[{user:t("Combien font 45*3 ?",[{name:"calculatrice",result:"45*3 = 135"}]),assistant:"45*3 = 135."},{user:t("Il vous en reste en rayon ?",[{name:"rayon",result:"3 exemplaires en rayon"}]),assistant:"Oui \u2014 il en reste 3 exemplaires en rayon."}]:[{user:t("What is 45*3?",[{name:"calculator",result:"45*3 = 135"}]),assistant:"45*3 = 135."},{user:t("Do you still have some on the shelf?",[{name:"shelf",result:"3 items on the shelf"}]),assistant:"Yes \u2014 3 items are on the shelf."}]}function xa(f=!1){let t=(n,s)=>({title:n,text:s,doc:0}),r=(n,s)=>`${Et(n,void 0,f).trim()}

Question: ${s}`,e=(n,s)=>`${Et(n,s,f).trim()}

Question: ${s}`;return f?[{user:"Bonjour !",assistant:"Bonjour ! Comment puis-je vous aider ?"},{user:r([t("Guide des tailles",`Tableau des correspondances :
- Pointure EU 38 : 24,0 cm (US 6,5)
- Pointure EU 39 : 24,5 cm (US 7,0)
- Pointure EU 41 : 26,0 cm (US 8,0)`)],"Je fais du 41, quelle taille en cm ?"),assistant:"La pointure 41 correspond \xE0 26,0 cm."},{user:r([t("Retours","Les retours sont gratuits sous 14 jours. Le remboursement est effectu\xE9 sous 3 jours ouvr\xE9s.")],"Combien de temps pour retourner un article ?"),assistant:"Vous disposez de 14 jours pour retourner un article."},{user:r([],"Qui a gagn\xE9 la Coupe du Monde 1998 ?"),assistant:"Je n\u2019ai pas cette information dans mes fiches."},{user:e([],"Tu es un robot ?"),assistant:"Je suis un assistant automatique, oui. Comment puis-je vous aider ?"}]:[{user:"Hello!",assistant:"Hello! How can I help you today?"},{user:r([t("Size guide",`Size conversions:
- Size EU 38: 24.0 cm (US 6.5)
- Size EU 39: 24.5 cm (US 7.0)
- Size EU 41: 26.0 cm (US 8.0)`)],"I wear a 41, what is that in cm?"),assistant:"A size 41 is 26.0 cm."},{user:r([t("Returns","Returns are free within 14 days. Refunds are issued within 3 working days.")],"How long do I have to return an item?"),assistant:"You have 14 days to return an item."},{user:r([],"Who won the 1998 World Cup?"),assistant:"I do not have that information in my notes."},{user:e([],"Are you a robot?"),assistant:"I am an automated assistant, yes. How can I help?"}]}var Aa=typeof self<"u"&&typeof self.importScripts=="function"&&typeof document>"u";Aa&&Promise.resolve().then(()=>(Is(),_a));var gr=null,en=null,Zr;function pt(){return gr||(gr=Ws(Zr).then(f=>(en=f,f))),gr}var Pa=()=>en?.kind??"pending";function tn(f){if(f.workerUrl&&zs(f.workerUrl),f.worker!==void 0){if(gr&&Zr!==f.worker){console.warn("[brimkern] option `worker` ignor\xE9e : le backend est d\xE9j\xE0 d\xE9marr\xE9 et partag\xE9 par la page.");return}Zr=f.worker}}function Ys(){let f=new Map;return{on(t,r){let e=f.get(t);return e||f.set(t,e=new Set),e.add(r),()=>{e.delete(r)}},emit(t,...r){let e=f.get(t);if(e)for(let n of[...e])try{n(...r)}catch(s){console.error("[brimkern] \xE9couteur `"+t+"` a lev\xE9 :",s)}},clear(){f.clear()}}}function Tt(f){if(!Array.isArray(f))return[];let t=[];for(let r of f){let e=r?.role,n=r?.content;(e==="user"||e==="assistant")&&typeof n=="string"&&n.trim()&&t.push({role:e,content:n})}return t}var Xs={en:{ouvrir:"Open the chat",fermer:"Close",placeholder:"Type a message\u2026",note:"Local AI \u2014 runs on your GPU, nothing is sent anywhere.",erreur:"Error: ",vide:"Sorry, I can only answer in plain text here: could you rephrase?",aide:"I\u2019m here to help \u2014 what would you like to know?",mo:"MB",sources:"Sources:",phases:{init:"Starting up\u2026",download:"downloading the model\u2026",tokenizer:"tokenizer\u2026",gpu:"weights to the GPU\u2026"},erreurs:{"no-webgpu":"This browser does not support WebGPU: the local assistant cannot run here."}},fr:{ouvrir:"Ouvrir le chat",fermer:"Fermer",placeholder:"\xC9cris un message\u2026",note:"IA locale \u2014 tourne sur votre GPU, aucune donn\xE9e envoy\xE9e.",erreur:"Erreur : ",vide:"D\xE9sol\xE9, je ne peux r\xE9pondre qu\u2019en texte simple ici : pouvez-vous reformuler ?",aide:"Je suis l\xE0 pour vous aider \u2014 que voulez-vous savoir ?",mo:"Mo",sources:"Sources :",phases:{init:"initialisation\u2026",download:"t\xE9l\xE9chargement du mod\xE8le\u2026",tokenizer:"tokenizer\u2026",gpu:"poids sur le GPU\u2026"},erreurs:{"no-webgpu":"Ce navigateur ne prend pas en charge WebGPU : l\u2019assistant local ne peut pas tourner ici."}}};function Ga(f,t){if(!t)return f;let r=n=>typeof n=="string"&&!!n.trim(),e={...f.phases};if(t.phases&&typeof t.phases=="object")for(let[n,s]of Object.entries(t.phases))r(s)&&(e[n]=s);return{...f,...r(t.open)?{ouvrir:t.open}:null,...r(t.close)?{fermer:t.close}:null,...r(t.placeholder)?{placeholder:t.placeholder}:null,...r(t.note)?{note:t.note}:null,...r(t.error)?{erreur:t.error}:null,...r(t.empty)?{vide:t.empty}:null,...r(t.help)?{aide:t.help}:null,...r(t.sources)?{sources:t.sources}:null,...r(t.mb)?{mo:t.mb}:null,phases:e}}var Ua=(f,t)=>f.phases[t]??t,Vs=(f,t)=>t?.code&&f.erreurs[t.code]||t?.message||String(t);function Js(f={}){tn(f);let t=Mt(f.model),r=f.maxTokens||220,e=f.knowledge,n=Ct(f),s=dt(f),i=Tt(f.history),a=[],o=Ys(),u=!1,c=!1,l=!1,d=()=>f.temperature??(e?.25:.55),p=bt(f.tools),g=m=>{if(u)throw new Error(`brimkern: ${m} impossible pendant une g\xE9n\xE9ration`)};return{async ask(m,b={}){if(c)throw new Error("session d\xE9truite");if(u)throw new Error("g\xE9n\xE9ration d\xE9j\xE0 en cours sur cette session");u=!0,i.push({role:"user",content:m}),o.emit("message",{role:"user",content:m});try{let v=await xr(p,m,s);for(let _ of v)o.emit("tool",_);let{text:U,sources:A,conversationnel:F}=n.userTurn(m,vt(v,s));a=A,b.onSources?.(A);let T=[...i.slice(0,-1),{role:"user",content:U}],K=await pt();await K.preload(t,(_,h)=>o.emit("progress",_,h)),l||(l=!0,o.emit("ready"));let P={url:t,history:T,system:n.system(m),maxTokens:r,temperature:d(),pinned:n.pinned,repeatPenalty:f.repeatPenalty,reasoning:f.reasoning},G=await K.turn(P,b.onToken,b.signal);return b.signal?.aborted?(i.pop(),""):(F&&kr(G,s)&&(G=Xs[s?"fr":"en"].aide),i.push({role:"assistant",content:G}),o.emit("message",{role:"assistant",content:G,sources:A}),G)}catch(v){throw i.pop(),o.emit("error",v instanceof Error?v:new Error(String(v))),v}finally{u=!1}},async askBatch(m,b={}){if(c)throw new Error("session d\xE9truite");if(u)throw new Error("g\xE9n\xE9ration d\xE9j\xE0 en cours sur cette session");if(!m.length)return[];u=!0;try{let v=await pt();await v.preload(t,(F,T)=>o.emit("progress",F,T)),l||(l=!0,o.emit("ready"));let U=m.map(F=>({url:t,history:[{role:"user",content:n.userTurn(F,"").text}],system:n.system(F),maxTokens:b.maxTokens??r,temperature:d(),pinned:n.pinned,repeatPenalty:f.repeatPenalty,reasoning:f.reasoning}));if(v.turnBatch)return await v.turnBatch(U);let A=[];for(let F of U)A.push(await v.turn(F));return A}catch(v){throw o.emit("error",v instanceof Error?v:new Error(String(v))),v}finally{u=!1}},reset(){i=[],a=[]},destroy(){c=!0,i=[],a=[],o.clear()},get history(){return i.slice()},get lastSources(){return a.slice()},setHistory(m){g("setHistory"),i=Tt(m)},setKnowledge(m){g("setKnowledge"),e=m,n=Ct({...f,knowledge:m}),a=[]},on:o.on}}function Ba(){if(document.getElementById("bk-style"))return;let f=document.createElement("style");f.id="bk-style",f.textContent=`
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
  `,document.head.appendChild(f)}function qa(f){if(!f)return"#c72c1e";if(/^#[0-9a-fA-F]{3,8}$/.test(f))return f;try{if(typeof CSS<"u"&&CSS.supports("color",f)&&!/[{};()]/.test(f))return f}catch{}return"#c72c1e"}function Fa(f,t){let r=f.knowledge,e=Ct(f),n=dt(f),s=Ga(Xs[n?"fr":"en"],f.labels),i=qa(f.accent),a=f.title||"Assistant",o=f.maxTokens||220,u=bt(f.tools);Ba();let c=document.createElement("button");c.className="bk-fab",c.setAttribute("aria-label",s.ouvrir),c.textContent="\u{1F4AC}";let l=document.createElement("div");if(l.className="bk-panel",c.style.setProperty("--bk-accent",i),l.style.setProperty("--bk-accent",i),f.position==="bottom-left")for(let S of[c,l])S.style.left="20px",S.style.right="auto";let d=(S,R,E)=>typeof S=="number"&&Number.isFinite(S)?Math.min(E,Math.max(R,Math.round(S))):null,p=d(f.width,300,480),g=d(f.height,380,720);p&&(l.style.width=`${p}px`),g&&(l.style.height=`${g}px`);let m={"--bk-bg":"#211f1c","--bk-surface":"#2c2a26","--bk-border":"#413e38","--bk-border2":"#3a3733","--bk-text":"#f0eee8","--bk-muted":"#a29e93","--bk-muted2":"#c6c2b8"},b=S=>{for(let R of[c,l])for(let[E,W]of Object.entries(m))S?R.style.setProperty(E,W):R.style.removeProperty(E)},v=null,U=null;f.theme==="dark"?b(!0):f.theme==="auto"&&typeof matchMedia=="function"&&(v=matchMedia("(prefers-color-scheme: dark)"),b(v.matches),U=S=>b(S.matches),v.addEventListener("change",U)),l.innerHTML=`
    <div class="bk-hd"><span class="bk-dot"></span><span>${pr(a)}</span><button class="bk-x" aria-label="${pr(s.fermer)}">\xD7</button></div>
    <div class="bk-msgs"></div>
    <div class="bk-foot"><textarea class="bk-in" rows="1" placeholder="${pr(s.placeholder)}"></textarea><button class="bk-send">\u2191</button></div>
    <div class="bk-note">${pr(s.note)}</div>`,document.body.appendChild(c),document.body.appendChild(l);let A=l.querySelector(".bk-msgs"),F=l.querySelector(".bk-in"),T=l.querySelector(".bk-send"),K=l.querySelector(".bk-x"),P=Tt(f.history),G=!1,_=!1,h=!1,y=new AbortController,k=(S,R)=>{let E=document.createElement("div");return E.className=`bk-m ${S==="user"?"bk-u":"bk-a"}`,E.textContent=R,A.appendChild(E),A.scrollTop=A.scrollHeight,E},w=S=>{if(!f.showSources||!S.length)return;let R=document.createElement("div");R.className="bk-src";let E=document.createElement("b");E.textContent=`${s.sources} `,R.appendChild(E),R.appendChild(document.createTextNode(S.map((W,N)=>`[${N+1}] ${W.title||W.text.slice(0,40).replace(/\s+/g," ").trim()+"\u2026"}`).join(" \xB7 "))),A.appendChild(R),A.scrollTop=A.scrollHeight},x=()=>{A.textContent="";for(let S of P)k(S.role,S.content)};P.length?x():f.greeting&&(P.push({role:"assistant",content:f.greeting}),k("assistant",f.greeting));let B=Mt(f.model),q=()=>{if(!_){_=!0;let S=k("assistant",s.phases.init);S.classList.add("bk-status"),pt().then(R=>R.preload(B,(E,W)=>{t.emit("progress",E,W);let N=Ua(s,E);S.textContent=W?.total?`${N} ${Math.round(W.loaded/1048576)} / ${Math.round(W.total/1048576)} ${s.mo}`:N})).then(()=>{S.remove(),t.emit("ready")}).catch(R=>{S.textContent=s.erreur+Vs(s,R),_=!1,t.emit("error",R instanceof Error?R:new Error(String(R)))})}return pt()},M=async S=>{G=!0,T.disabled=!0,P.push({role:"user",content:S}),k("user",S),t.emit("message",{role:"user",content:S});let R=k("assistant","\u2026");try{await q();let E=await xr(u,S,n);for(let L of E)t.emit("tool",L);let{text:W,sources:N,conversationnel:I}=e.userTurn(S,vt(E,n)),$=[...P.slice(0,-1),{role:"user",content:W}],D={url:B,history:$,system:e.system(S),maxTokens:o,temperature:r?.25:.55,pinned:e.pinned},z=await(await pt()).turn(D,L=>{R.textContent=L||"\u2026",A.scrollTop=A.scrollHeight},y.signal);return h?"":(z?I&&kr(z,n)&&(z=s.aide):z=s.vide,R.textContent=z,P.push({role:"assistant",content:z}),w(N),t.emit("message",{role:"assistant",content:z,sources:N}),z)}catch(E){throw R.textContent=s.erreur+Vs(s,E),t.emit("error",E instanceof Error?E:new Error(String(E))),E}finally{G=!1,T.disabled=!1,h||F.focus()}},O=()=>{let S=F.value.trim();!S||G||h||(F.value="",M(S).catch(()=>{}))},C=S=>{h||l.classList.contains("bk-open")!==S&&(l.classList.toggle("bk-open",S),S&&(F.focus(),q()),t.emit(S?"open":"close"))};return c.onclick=()=>C(!l.classList.contains("bk-open")),K.onclick=()=>C(!1),T.onclick=O,F.onkeydown=S=>{S.key==="Enter"&&!S.shiftKey&&(S.preventDefault(),O())},{open:()=>C(!0),close:()=>C(!1),toggle:()=>C(!l.classList.contains("bk-open")),ask(S){if(h)return Promise.reject(new Error("brimkern: widget d\xE9mont\xE9"));let R=String(S??"").trim();return R?G?Promise.reject(new Error("g\xE9n\xE9ration d\xE9j\xE0 en cours sur ce widget")):(C(!0),M(R)):Promise.reject(new Error("brimkern: ask() attend une question non vide"))},destroy(){h||(h=!0,y.abort(),v&&U&&v.removeEventListener("change",U),c.onclick=null,K.onclick=null,T.onclick=null,F.onkeydown=null,c.remove(),l.remove(),P=[])},setKnowledge(S){r=S,e=Ct({...f,knowledge:S})},setHistory(S){if(G)throw new Error("brimkern: setHistory impossible pendant une g\xE9n\xE9ration");P=Tt(S),x()},history:()=>P.slice(),el:l}}function pr(f){return f.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}var Sa=(f={})=>{let t=Ys(),r=null,e=!1,n=!1,s=[],i=o=>{r?o(r):!e&&!n&&s.push(o)},a=()=>{if(!(n||r)){r=Fa(f,t);for(let o of s.splice(0))o(r)}};return typeof window>"u"||typeof document>"u"?(e=!0,console.warn("[brimkern] embed() ignor\xE9 : aucun DOM (rendu serveur ?). Appelez-le dans un effet client.")):(tn(f),document.body?a():window.addEventListener("DOMContentLoaded",a,{once:!0})),{open:()=>i(o=>o.open()),close:()=>i(o=>o.close()),toggle:()=>i(o=>o.toggle()),ask(o){return e?Promise.reject(new Error("brimkern: ask() sans DOM (rendu serveur ?)")):n?Promise.reject(new Error("brimkern: widget d\xE9mont\xE9")):new Promise((u,c)=>i(l=>l.ask(o).then(u,c)))},destroy(){n=!0,s.length=0,r?.destroy(),r=null,t.clear()},setKnowledge:o=>i(u=>u.setKnowledge(o)),setHistory:o=>i(u=>u.setHistory(o)),get history(){return r?r.history():Tt(f.history)},get el(){return r?r.el:null},on:t.on}};var Ma=async f=>{if(typeof f!="object"||f===null||typeof f.prompt!="string")throw new TypeError(`Brimkern.generate expects a single object: generate({ prompt: "\u2026", model?, system? }). Received ${typeof f}${typeof f=="object"&&f?" without a `prompt` string":""}.`);return Js(f).ask(f.prompt,{onToken:f.onToken,signal:f.signal,onSources:f.onSources})},Oa=(f={})=>(tn(f),typeof navigator<"u"&&"gpu"in navigator?pt().then(t=>t.preload(Mt(f.model),f.onProgress)).then(()=>!0).catch(()=>!1):Promise.resolve(!1)),Ca=f=>{if(typeof navigator>"u"||!("gpu"in navigator))return"unavailable";let t;try{t=Mt(f)}catch{return"error"}return en?.state(t)??"idle"};typeof window<"u"&&(window.Brimkern={embed:Sa,createSession:Js,generate:Ma,preload:Oa,status:Ca,runtime:Pa});})();
