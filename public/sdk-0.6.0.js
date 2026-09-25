"use strict";(()=>{var Ds=Object.defineProperty;var ae=(f,r,t)=>()=>{if(t)throw t[0];try{return f&&(r=f(f=0)),r}catch(e){throw t=[e],e}};var sn=(f,r)=>{for(var t in r)Ds(f,t,{get:r[t],enumerable:!0})};function Ne(f){let r=new Float32Array(1),t=new Uint32Array(r.buffer);r[0]=f;let e=t[0],n=e>>16&32768,s=(e>>23&255)-127+15,i=e&8388607;return s<=0?n:s>=31?n|31743:(i=(i>>13)+(i>>12&1),i===1024&&(i=0,s+=1),n|s<<10|i&1023)}function me(f){let r=f>>15&1,t=f>>10&31,e=f&1023,n;return t===0?n=e*59604645e-15:t===31?n=e?NaN:1/0:n=(1+e/1024)*2**(t-15),r===1?-n:n}var nt=ae(()=>{"use strict"});function Se(f){let r=f.length;if(r%Ce!==0)throw new Error(`q4web: length ${r} not a multiple of ${Ce}`);let t=r/Ce,e=new Uint8Array(r/2),n=new Uint16Array(t),s=new Uint16Array(t);for(let i=0;i<t;i++){let a=i*Ce,o=1/0,u=-1/0;for(let m=0;m<Ce;m++){let w=f[a+m];w<o&&(o=w),w>u&&(u=w)}let c=(u-o)/15||1e-8,l=Ne(c),d=Ne(o);n[i]=l,s[i]=d;let p=me(l)||1e-8,g=me(d);for(let m=0;m<Ce;m++){let w=Math.round((f[a+m]-g)/p);w=w<0?0:w>15?15:w;let v=a+m;(m&1)===0?e[v>>1]=w:e[v>>1]|=w<<4}}return{nibbles:e,scales:n,mins:s,nElems:r}}function ke(f,r){let t=r/Ce,e=r/2,n=f.slice(0,e),s=new Uint16Array(t),i=new Uint16Array(t),a=new DataView(f.buffer,f.byteOffset);for(let o=0;o<t;o++)s[o]=a.getUint16(e+o*2,!0);for(let o=0;o<t;o++)i[o]=a.getUint16(e+t*2+o*2,!0);return{nibbles:n,scales:s,mins:i,nElems:r}}function he(f){let r=new Float32Array(f.nElems),t=f.nElems/Ce;for(let e=0;e<t;e++){let n=me(f.scales[e]),s=me(f.mins[e]),i=e*Ce;for(let a=0;a<Ce;a++){let o=i+a,u=f.nibbles[o>>1],c=(a&1)===0?u&15:u>>4;r[o]=c*n+s}}return r}var Ce,pt=ae(()=>{"use strict";nt();Ce=32});function Fe(f){let r=f.length;if(r%Te!==0)throw new Error(`q8web: length ${r} not a multiple of ${Te}`);let t=r/Te,e=new Int8Array(r),n=new Uint16Array(t);for(let s=0;s<t;s++){let i=s*Te,a=0;for(let l=0;l<Te;l++){let d=Math.abs(f[i+l]);d>a&&(a=d)}let o=a/127||1e-8,u=Ne(o);n[s]=u;let c=me(u)||1e-8;for(let l=0;l<Te;l++){let d=Math.round(f[i+l]/c);d=d<-127?-127:d>127?127:d,e[i+l]=d}}return{codes:e,scales:n,nElems:r}}function Ge(f,r){let t=r/Te,e=new Int8Array(f.buffer.slice(f.byteOffset,f.byteOffset+r)),n=new Uint16Array(t),s=new DataView(f.buffer,f.byteOffset);for(let i=0;i<t;i++)n[i]=s.getUint16(r+i*2,!0);return{codes:e,scales:n,nElems:r}}function ve(f){let r=new Float32Array(f.nElems),t=f.nElems/Te;for(let e=0;e<t;e++){let n=me(f.scales[e]),s=e*Te;for(let i=0;i<Te;i++)r[s+i]=f.codes[s+i]*n}return r}var Te,gt=ae(()=>{"use strict";nt();Te=32});function mn(f){let r=f.length;if(r%Re!==0)throw new Error(`q3web: length ${r} not a multiple of ${Re}`);let t=r/Re,e=new Uint32Array(r/16),n=new Uint32Array(r/32),s=new Uint16Array(t),i=new Uint16Array(t);for(let a=0;a<t;a++){let o=a*Re,u=1/0,c=-1/0;for(let w=0;w<Re;w++){let v=f[o+w];v<u&&(u=v),v>c&&(c=v)}let l=(c-u)/7||1e-8,d=Ne(l),p=Ne(u);s[a]=d,i[a]=p;let g=me(d)||1e-8,m=me(p);for(let w=0;w<Re;w++){let v=Math.round((f[o+w]-m)/g);v=v<0?0:v>7?7:v;let x=o+w;e[x>>4]|=(v&3)<<(x&15)*2,n[x>>5]|=v>>2<<(x&31)}}return{lo:e,hi:n,scales:s,mins:i,nElems:r}}function Be(f,r){let t=r/Re,e=r/16,n=r/32,s=e*4,i=n*4,a=new DataView(f.buffer,f.byteOffset),o=new Uint32Array(e),u=new Uint32Array(n),c=new Uint16Array(t),l=new Uint16Array(t);for(let g=0;g<e;g++)o[g]=a.getUint32(g*4,!0);for(let g=0;g<n;g++)u[g]=a.getUint32(s+g*4,!0);let d=s+i,p=d+t*2;for(let g=0;g<t;g++)c[g]=a.getUint16(d+g*2,!0);for(let g=0;g<t;g++)l[g]=a.getUint16(p+g*2,!0);return{lo:o,hi:u,scales:c,mins:l,nElems:r}}function He(f){let r=new Float32Array(f.nElems),t=f.nElems/Re;for(let e=0;e<t;e++){let n=me(f.scales[e]),s=me(f.mins[e]),i=e*Re;for(let a=0;a<Re;a++){let o=i+a,u=f.lo[o>>4]>>(o&15)*2&3|(f.hi[o>>5]>>(o&31)&1)<<2;r[o]=u*n+s}}return r}var Re,mt=ae(()=>{"use strict";nt();Re=32});function bn(f,r,t,e,n){let s=(a,o,u)=>{if(!a.includes(o))throw new Error(`moeGemv : motif absent \xAB ${o} \xBB`);return a.replace(o,u)},i=s(f,"@group(0) @binding(3) var<storage, read_write> c: array<f32>;",`@group(0) @binding(3) var<storage, read_write> c: array<f32>;
		@group(0) @binding(4) var<storage, read> ids: array<u32>;`);return i=s(i,"let col = wid.y * d.stride + wid.x;",`let col = wid.y * d.stride + wid.x;
			let slot = wid.z; let ex = ids[slot]; let arow = slot / d.m;`),i=s(i,r,t),i=s(i,e,n),s(i,"if (tid == 0u && col < d.n) { c[col] = part[0]; }","if (tid == 0u && col < d.n) { c[slot * d.n + col] = part[0]; }")}function vn(f,r){return`
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
	${r}
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
	}`}var Le,hn,wn=ae(()=>{"use strict";Le={matmul:`
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
		}`,qwen35_gdn_batch:`
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
		}`},hn=`
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
	}`;Le.moe_q4k_vec=bn(Le.matmul_t_q4k_vec,"let rowBase = col * (d.k / 256u) * 36u;","let rowBase = (ex * d.n + col) * (d.k / 256u) * 36u;","let aBase = g * 8u;","let aBase = arow * (d.k / 4u) + g * 8u;");Le.moe_q6k_vec=bn(Le.matmul_t_q6k_vec,"let rowBase = col * nBlk * 210u;","let rowBase = (ex * d.n + col) * nBlk * 210u;","let aB = b * 256u + half * 128u;","let aB = arow * d.k + b * 256u + half * 128u;");Le.moe_group=`
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
	}`;Le.moe_q4k_grouped=vn("dq4",`
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
	}`);Le.moe_q6k_grouped=vn("dq6",`
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
	}`);Le.rmsnorm_grouped=`
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
	}`});var Dt,yn=ae(()=>{"use strict";Dt=class{constructor(r){this.sets=[];this.cur=0;this.next=0;this.names=[];this.acc=new Map;this.dropped=0;this.pending=[];this.fenetre=0;this.device=r;let t=globalThis;for(let e=0;e<2;e++)this.sets.push({qs:r.createQuerySet({type:"timestamp",count:4096}),resolve:r.createBuffer({size:4096*8,usage:t.GPUBufferUsage.QUERY_RESOLVE|t.GPUBufferUsage.COPY_SRC}),read:r.createBuffer({size:4096*8,usage:t.GPUBufferUsage.COPY_DST|t.GPUBufferUsage.MAP_READ}),busy:!1})}slot(r){if(this.next+2>4096&&(this.rotate(),this.next+2>4096))return this.dropped++,null;let t=this.sets[this.cur];if(t.busy)return this.dropped++,null;let e=this.next;return this.next+=2,this.names.push(r),{querySet:t.qs,beginningOfPassWriteIndex:e,endOfPassWriteIndex:e+1}}rotate(){let r=this.cur,t=this.sets[r],e=this.names,n=this.next;if(this.cur=(this.cur+1)%2,this.next=0,this.names=[],!n||t.busy)return;t.busy=!0;let s=this.fenetre,i=this.device.createCommandEncoder();i.resolveQuerySet(t.qs,0,n,t.resolve,0),i.copyBufferToBuffer(t.resolve,0,t.read,0,n*8),this.device.queue.submit([i.finish()]);let a=globalThis,o=t.read.mapAsync(a.GPUMapMode.READ,0,n*8).then(()=>{let u=new BigUint64Array(t.read.getMappedRange(0,n*8).slice(0));if(t.read.unmap(),s===this.fenetre)for(let c=0;c<e.length;c++){let l=u[c*2],d=u[c*2+1];if(!l||!d||d<=l)continue;let p=Number(d-l),g=this.acc.get(e[c]);g?(g.calls++,g.ns+=p):this.acc.set(e[c],{calls:1,ns:p})}}).catch(()=>{}).finally(()=>{t.busy=!1});this.pending.push(o)}async report(){this.rotate();let r=this.pending;this.pending=[],await Promise.all(r);let t=0,e=0;for(let s of this.acc.values())t+=s.ns,e+=s.calls;return{passes:[...this.acc.entries()].map(([s,i])=>({name:s,calls:i.calls,totalMs:i.ns/1e6,meanUs:i.ns/i.calls/1e3,share:t?i.ns/t:0,reliable:i.calls>=50})).sort((s,i)=>i.totalMs-s.totalMs),totalMs:t/1e6,samples:e,dropped:this.dropped,quantumUs:100}}reset(){this.fenetre++,this.acc.clear(),this.dropped=0}destroy(){for(let r of this.sets)try{r.qs.destroy(),r.resolve.destroy(),r.read.destroy()}catch{}this.sets=[]}}});function Xs(){if(kn!==null)return kn;try{let f=globalThis.__brimkernSearch;if(typeof f=="string")return f}catch{}try{return typeof location<"u"?location.search:""}catch{return""}}function ne(f){try{return new URLSearchParams(Xs()).get(f)}catch{return null}}var kn,ht=ae(()=>{"use strict";kn=null});function _e(f){let r=f>>15&1,t=f>>10&31,e=f&1023,n;return t===0?n=e*59604645e-15:t===31?n=65504:n=(1+e/1024)*2**(t-15),r===1?-n:n}function pe(f){let r=new Float32Array(1),t=new Uint32Array(r.buffer);r[0]=f;let e=t[0],n=e>>16&32768,s=(e>>23&255)-127+15,i=e&8388607;return s<=0?n:s>=31?n|31743:(i=(i>>13)+(i>>12&1),i===1024&&(i=0,s+=1),n|s<<10|i&1023)}function Ye(f,r){let t=new Float32Array(r*256),e=new DataView(f.buffer,f.byteOffset);for(let n=0;n<r;n++){let s=n*144,i=_e(e.getUint16(s,!0)),a=_e(e.getUint16(s+2,!0)),o=d=>{let p=g=>f[s+4+g];return d<4?[p(d)&63,p(d+4)&63]:[p(d+4)&15|p(d-4)>>6<<4,p(d+4)>>4|p(d)>>6<<4]},u=n*256,c=0,l=0;for(let d=0;d<256;d+=64){let[p,g]=o(c),m=i*p,w=a*g,[v,x]=o(c+1),q=i*v,F=a*x;for(let R=0;R<32;R++){let K=f[s+16+l+R];t[u+d+R]=m*(K&15)-w,t[u+d+32+R]=q*(K>>4)-F}l+=32,c+=2}}return t}function bt(f){return f>127?f-256:f}function Js(f,r){let t=new Float32Array(r*32),e=new DataView(f.buffer,f.byteOffset);for(let n=0;n<r;n++){let s=n*34,i=_e(e.getUint16(s,!0));for(let a=0;a<32;a++)t[n*32+a]=i*bt(f[s+2+a])}return t}function Zs(f,r){let t=new Float32Array(r*32),e=new DataView(f.buffer,f.byteOffset);for(let n=0;n<r;n++){let s=n*22,i=_e(e.getUint16(s,!0)),a=e.getUint32(s+2,!0);for(let o=0;o<16;o++){let u=f[s+6+o],c=a>>>o<<4&16,l=a>>>o+12&16;t[n*32+o]=i*((u&15|c)-16),t[n*32+o+16]=i*((u>>4|l)-16)}}return t}function ei(f,r){let t=new Float32Array(r*32),e=new DataView(f.buffer,f.byteOffset);for(let n=0;n<r;n++){let s=n*18,i=_e(e.getUint16(s,!0));for(let a=0;a<16;a++){let o=f[s+2+a];t[n*32+a]=i*((o&15)-8),t[n*32+a+16]=i*((o>>4)-8)}}return t}function ti(f,r){let t=new Float32Array(r*256),e=new DataView(f.buffer,f.byteOffset);for(let n=0;n<r;n++){let s=n*176,i=_e(e.getUint16(s,!0)),a=_e(e.getUint16(s+2,!0)),o=g=>{let m=w=>f[s+4+w];return g<4?[m(g)&63,m(g+4)&63]:[m(g+4)&15|m(g-4)>>6<<4,m(g+4)>>4|m(g)>>6<<4]},u=n*256,c=0,l=0,d=1,p=2;for(let g=0;g<256;g+=64){let[m,w]=o(c),v=i*m,x=a*w,[q,F]=o(c+1),R=i*q,K=a*F;for(let P=0;P<32;P++){let G=f[s+48+l+P],_=f[s+16+P];t[u+g+P]=v*((G&15)+(_&d?16:0))-x,t[u+g+32+P]=R*((G>>4)+(_&p?16:0))-K}l+=32,c+=2,d<<=2,p<<=2}}return t}function ri(f){f&&(f.kq?f.buf?.destroy?.():f.codes?(f.codes.destroy?.(),f.sc?.destroy?.()):f.nib?(f.nib.destroy?.(),f.sc?.destroy?.(),f.mn?.destroy?.()):f.destroy?.())}function Qe(f,r){let t=new Float32Array(r*256),e=new DataView(f.buffer,f.byteOffset);for(let n=0;n<r;n++){let s=n*210,i=_e(e.getUint16(s+208,!0)),a=n*256;for(let o=0;o<2;o++){let u=s+o*64,c=s+128+o*32,l=s+192+o*8,d=a+o*128;for(let p=0;p<32;p++){let g=p/16|0,m=f[u+p],w=f[u+p+32],v=f[c+p],x=(m&15|(v>>0&3)<<4)-32,q=(w&15|(v>>2&3)<<4)-32,F=(m>>4|(v>>4&3)<<4)-32,R=(w>>4|(v>>6&3)<<4)-32;t[d+p]=i*bt(f[l+g])*x,t[d+p+32]=i*bt(f[l+g+2])*q,t[d+p+64]=i*bt(f[l+g+4])*F,t[d+p+96]=i*bt(f[l+g+6])*R}}}return t}function gr(f,r){let n=new Float32Array(r*256),s=0,i=new DataView(f.buffer,f.byteOffset);for(let a=0;a<r;a++){let o=a*110,u=_e(i.getUint16(o+108,!0)),c=new Int32Array(4);for(let v=0;v<3;v++)c[v]=f[o+96+v*4]|f[o+96+v*4+1]<<8|f[o+96+v*4+2]<<16|f[o+96+v*4+3]<<24;let l=c[2];c[2]=c[0]>>>4&252645135|(l>>>4&50529027)<<4,c[3]=c[1]>>>4&252645135|(l>>>6&50529027)<<4,c[0]=c[0]&252645135|(l>>>0&50529027)<<4,c[1]=c[1]&252645135|(l>>>2&50529027)<<4;let d=new Int8Array(c.buffer),p=0,g=o+32,m=o,w=1;for(let v=0;v<256;v+=128){let x=0;for(let q=0;q<4;q++){let F=u*(d[p++]-32);for(let K=0;K<16;K++){let P=f[g+K]>>>x&3,G=f[m+K]&w?0:4;n[s++]=F*(P-G)}let R=u*(d[p++]-32);for(let K=0;K<16;K++){let P=f[g+16+K]>>>x&3,G=f[m+16+K]&w?0:4;n[s++]=R*(P-G)}x+=2,w=w<<1&255}g+=32}}return n}function mr(f,r){let t=new Float32Array(r*32),e=new DataView(f.buffer,f.byteOffset);for(let n=0;n<r;n++){let s=n*20,i=_e(e.getUint16(s,!0)),a=_e(e.getUint16(s+2,!0)),o=n*32;for(let u=0;u<16;u++){let c=f[s+4+u];t[o+u]=(c&15)*i+a,t[o+u+16]=(c>>4)*i+a}}return t}function Ve(f,r,t,e,n){let s=new Float32Array(t*n);for(let i=0;i<t;i++)for(let a=0;a<n;a++){let o=0;for(let u=0;u<e;u++)o+=f[i*e+u]*r[u*n+a];s[i*n+a]=o}return s}function ze(f,r,t,e,n=1e-5,s=!1){let i=new Float32Array(t*e);for(let a=0;a<t;a++){let o=0;for(let c=0;c<e;c++)o+=f[a*e+c]**2;let u=1/Math.sqrt(o/e+n);for(let c=0;c<e;c++)i[a*e+c]=f[a*e+c]*u*(s?1+r[c]:r[c])}return i}function ni(f,r,t,e,n,s,i){let a=new Float32Array(f.length),o=e/2,u=s[0],c=s[0]+s[1];for(let l=0;l<t;l++){let d=Math.floor(l/n),p=l*e;for(let g=0;g<o;g++){let m=g<u?0:g<c?1:2,v=r[d*3+m]/i**(2*g/e),x=Math.cos(v),q=Math.sin(v),F=f[p+g],R=f[p+g+o];a[p+g]=F*x-R*q,a[p+g+o]=R*x+F*q}}return a}function jt(f,r,t,e,n=0,s=1e4,i){let a=new Float32Array(f.length),o=t/2;for(let u=0;u<r;u++){let c=n+Math.floor(u/e),l=u*t;for(let d=0;d<o;d++){let p=c/(s**(2*d/t)*(i?i[d]:1)),g=Math.cos(p),m=Math.sin(p),w=f[l+2*d],v=f[l+2*d+1];a[l+2*d]=w*g-v*m,a[l+2*d+1]=v*g+w*m}}return a}function si(f,r,t,e,n,s=0,i=1e4){let a=new Float32Array(f.length),o=e/2;for(let u=0;u<t;u++){let c=s+Math.floor(u/n),l=u*e;for(let d=0;d<o;d++){let p=c/(i**(2*d/e)*r[d]),g=Math.cos(p),m=Math.sin(p),w=f[l+d],v=f[l+d+o];a[l+d]=w*g-v*m,a[l+d+o]=v*g+w*m}}return a}function vt(f,r,t,e,n=0,s=1e4){let i=new Float32Array(f.length),a=t/2;for(let o=0;o<r;o++){let u=n+Math.floor(o/e),c=o*t;for(let l=0;l<a;l++){let d=u/s**(2*l/t),p=Math.cos(d),g=Math.sin(d),m=f[c+l],w=f[c+l+a];i[c+l]=m*p-w*g,i[c+l+a]=w*p+m*g}}return i}function hr(f,r,t){return f.map((e,n)=>e+r[n%t])}function Kt(f,r,t,e=!0){let n=e?f.windowPerLayer?.[t]??f.window??0:0,s=f.ropeThetaPerLayer?.[t]??f.ropeTheta,i=f.skipRopePerLayer?.[t]??f.skipRope??!1;return{...f,seq:r,window:n,ropeTheta:s,skipRope:i}}function Ue(f,r,t,e,n,s,i,a=0,o,u=0,c=0){let l=new Float32Array(e*n*i),d=o??1/Math.sqrt(i),p=m=>u>0?u*Math.tanh(m/u):m,g=n/s;for(let m=0;m<e;m++)for(let w=0;w<n;w++){let v=Math.floor(w/g),x=(m*n+w)*i,q=a+m,F=c>0?Math.max(0,q+1-c):0,R=[],K=-1/0;for(let G=F;G<=q;G++){let _=(G*s+v)*i,h=0;for(let b=0;b<i;b++)h+=f[x+b]*r[_+b];let y=p(h*d);R[G]=y,y>K&&(K=y)}let P=0;for(let G=F;G<=q;G++)R[G]=Math.exp(R[G]-K),P+=R[G];for(let G=F;G<=q;G++){let _=R[G]/P,h=(G*s+v)*i;for(let y=0;y<i;y++)l[x+y]+=_*t[h+y]}}return l}function _n(f){return .5*f*(1+Math.tanh(.7978845608*(f+.044715*f*f*f)))}function br(f,r,t){let{seq:e,d:n,nHeads:s,nKvHeads:i,headDim:a,ffn:o,ropeTheta:u,eps:c}=r,l=i*a,d=s*a,p=r.rmsGainOnePlus===!0,g=r.attnLogitSoftcap??0,m=ze(f,t.attnNorm,e,n,c,p),w=Ve(m,t.wq,e,n,d),v=Ve(m,t.wk,e,n,l),x=Ve(m,t.wv,e,n,l);t.bq&&(w=hr(w,t.bq,d)),t.bk&&(v=hr(v,t.bk,l)),t.bv&&(x=hr(x,t.bv,l)),t.qNorm&&(w=ze(w,t.qNorm,e*s,a,c,p)),t.kNorm&&(v=ze(v,t.kNorm,e*i,a,c,p));let q=vt(w,e*s,a,s,0,u),F=vt(v,e*i,a,i,0,u),R=Ue(q,F,x,e,s,i,a,0,r.attnScale,g),K=Ve(R,t.wo,e,d,n);t.postAttnNorm&&(K=ze(K,t.postAttnNorm,e,n,c,p));let P=f.map((k,A)=>k+K[A]),G=ze(P,t.ffnNorm,e,n,c,p),_=Ve(G,t.wgate,e,n,o),h=Ve(G,t.wup,e,n,o),y=r.act==="gelu"?_.map((k,A)=>_n(k)*h[A]):_.map((k,A)=>k/(1+Math.exp(-k))*h[A]),b=Ve(y,t.wdown,e,o,n);return t.postFfnNorm&&(b=ze(b,t.postFfnNorm,e,n,c,p)),P.map((k,A)=>k+b[A])}var ce,ie,Et,Nt=ae(()=>{"use strict";pt();gt();mt();wn();yn();ht();ce=64,ie=class ie{constructor(){this.device=null;this.modules={};this.pipelines={};this.maxStorageBufferBindingSize=0;this.hasF16=!1;this.validationFailure=null;this.lost=!1;this.onLost=null;this.attnDecodeOk=!0;this.attnPrefillOk=!0;this.attnFullWgOk=!0;this.mropeOk=!0;this.rwkvWkv7Ok=!0;this.lfm2ShortConvOk=!0;this.qwen35SsmOk=!0;this.gemma4Ok=!0;this.sparkOk=!0;this.moeOk=!0;this.moeGemmOk=!0;this.k2hOk=!0;this.attnWideOk=!0;this.kqOk=!0;this.gemvMOk=!0;this.lfm2ResidentOk=!0;this.lfm2BatchOk=!0;this.swaOk=!0;this.rwkvResidentOk=!0;this.videoOk=!0;this.videoResidentOk=!0;this.f16SharedOk=!0;this.qSharedOk=!0;this.qShared2Ok=!0;this.gemvOk=!0;this.rmsVecOk=!0;this.convS2Ok=!0;this.hasSubgroups=!1;this.subgroupsOk=!0;this.topKParOk=!0;this.dequantQ3kOk=!0;this.dequantQ41Ok=!0;this.profiler=null;this.bufferPool=new Map;this.poolSize=new WeakMap;this.pooled=new WeakSet;this.uniformPool=new Map;this.uniformSize=new WeakMap;this.convTiledOk=!0;this.convTiledQOk=!0;this.kqScratch=null;this.dummySnap=null;this.kvGpu=new Map;this.topKOk=!0;this.kvSession="";this.kvQuant=!1;this.kvStore=new Map;this.kvCtxId="";this.lfm2KvGpu=new Map;this.lfm2ConvGpu=new Map;this.lfm2Session="";this.rwkvStateGpu=new Map;this.rwkvVFirst=null;this.rwkvSession=""}async init(){let r=navigator.gpu;if(!r)return!1;let t=await r.requestAdapter();if(!t)return!1;let e=t.limits,n={maxStorageBufferBindingSize:e.maxStorageBufferBindingSize,maxBufferSize:e.maxBufferSize},s=[];try{t.features?.has("shader-f16")&&s.push("shader-f16")}catch{}try{t.features?.has("subgroups")&&s.push("subgroups")}catch{}try{ie.profileOn&&t.features?.has("timestamp-query")&&s.push("timestamp-query")}catch{}try{this.device=await t.requestDevice({requiredLimits:n,requiredFeatures:s})}catch{try{this.device=await t.requestDevice({requiredLimits:n})}catch{this.device=await t.requestDevice()}}this.maxStorageBufferBindingSize=this.device.limits?.maxStorageBufferBindingSize??134217728,this.hasF16=!!this.device.features?.has?.("shader-f16"),this.hasSubgroups=!!this.device.features?.has?.("subgroups"),ie.profileOn&&(this.device.features?.has?.("timestamp-query")?(this.profiler=new Dt(this.device),console.info("[webgpu] profilage par passe ACTIF (?gpuprofile=1) : __gpuProfile() pour le rapport")):console.warn("[webgpu] ?gpuprofile=1 demand\xE9 mais la feature timestamp-query est ABSENTE de cet adapter : aucune mesure ne sera prise."));try{ne("attndecode")==="0"&&(this.attnDecodeOk=!1,console.warn("[webgpu] attention d\xE9codage COUP\xC9E par ?attndecode=0 : kernels classiques")),ne("attnfullwg")==="0"&&(this.attnFullWgOk=!1,console.warn("[webgpu] attention_full workgroup COUP\xC9E par ?attnfullwg=0 : kernel classique")),ne("attnprefill")==="0"&&(this.attnPrefillOk=!1,console.warn("[webgpu] attention prefill tuil\xE9e COUP\xC9E par ?attnprefill=0 : kernel classique")),ne("rmsvec")==="0"&&(this.rmsVecOk=!1,console.warn("[webgpu] RMSNorm parall\xE8le COUP\xC9E par ?rmsvec=0 : kernel une-ligne-par-thread")),ne("topkpar")==="0"&&(this.topKParOk=!1,console.warn("[webgpu] top-K parall\xE8le COUP\xC9E par ?topkpar=0 : s\xE9lection finale sur un seul thread")),ne("rwkv")==="0"&&(this.rwkvWkv7Ok=!1,console.warn("[webgpu] kernel RWKV-7 WKV COUP\xC9 par ?rwkv=0")),ne("lfm2")==="0"&&(this.lfm2ShortConvOk=!1,console.warn("[webgpu] kernel shortconv LFM2 COUP\xC9 par ?lfm2=0")),ne("lfm2resident")==="0"&&(this.lfm2ResidentOk=!1,console.warn("[webgpu] LFM2 r\xE9sident COUP\xC9 par ?lfm2resident=0 : forwardToken JS+readback")),ne("lfm2batch")==="0"&&(this.lfm2BatchOk=!1,console.warn("[webgpu] prefill LFM2 batch\xE9 COUP\xC9 par ?lfm2batch=0 : token par token")),ne("convs2")==="0"&&(this.convS2Ok=!1,console.warn("[webgpu] conv2d 3\xD73 stride-2 tuil\xE9 COUP\xC9 par ?convs2=0 : repli sur direct")),ne("subgroups")==="0"&&(this.subgroupsOk=!1,console.warn("[webgpu] subgroups COUP\xC9 par ?subgroups=0 : repli sur shared memory")),ne("swa")==="0"&&(this.swaOk=!1,console.warn("[webgpu] fen\xEAtre glissante COUP\xC9E par ?swa=0 : attention causale pleine sur toutes les couches")),ne("rwkvresident")==="0"&&(this.rwkvResidentOk=!1,console.warn("[webgpu] RWKV r\xE9sident COUP\xC9 par ?rwkvresident=0 : forwardToken JS+readback")),ne("video")==="0"&&(this.videoOk=!1,console.warn("[webgpu] chemin vid\xE9o (module motion) COUP\xC9 par ?video=0")),ne("qwen35ssm")==="0"&&(this.qwen35SsmOk=!1,console.warn("[webgpu] kernel Qwen 3.5 SSM COUP\xC9 par ?qwen35ssm=0")),ne("attnwide")==="0"&&(this.attnWideOk=!1,console.warn("[webgpu] attention large COUP\xC9E par ?attnwide=0 : t\xEAtes > 128 sur le kernel un-thread-par-t\xEAte")),ne("gemvm")==="0"&&(this.gemvMOk=!1,console.warn("[webgpu] GEMV multi-lignes COUP\xC9 par ?gemvm=0 : kernels de prefill d\xE8s m \u2265 2")),ne("kq")==="0"&&(this.kqOk=!1,console.warn("[webgpu] poids K-quant natifs COUP\xC9S par ?kq=0 : requantification int8")),ne("gemma4")==="0"&&(this.gemma4Ok=!1,console.warn("[webgpu] chemin Gemma 4 COUP\xC9 par ?gemma4=0 : un mod\xE8le gemma4 refusera de charger")),ne("moe")==="0"&&(this.moeOk=!1,console.warn("[webgpu] chemin MoE COUP\xC9 par ?moe=0 : un mod\xE8le \xE0 experts refusera de charger")),ne("moegemm")==="0"&&(this.moeGemmOk=!1,console.warn("[webgpu] GEMM MoE group\xE9 COUP\xC9 par ?moegemm=0 : prefill MoE par GEMV par case")),ne("k2h")==="0"&&(this.k2hOk=!1,console.warn("[webgpu] chemin K2-Horizon COUP\xC9 par ?k2h=0 : un mod\xE8le k2-horizon refusera de charger")),ne("spark")==="0"&&(this.sparkOk=!1,console.warn("[webgpu] chemin Spark-X2.5 COUP\xC9 par ?spark=0 : un mod\xE8le spark2_5 refusera de charger")),ne("f16shared")==="0"&&(this.f16SharedOk=!1,console.warn("[webgpu] GEMM f16 tuil\xE9 COUP\xC9 par ?f16shared=0 : matmul_t_f16w pour tous les m")),ne("gemv")==="0"&&(this.gemvOk=!1,console.warn("[webgpu] GEMV de d\xE9codage COUP\xC9 par ?gemv=0 : kernels par lignes")),ne("qshared")==="0"&&(this.qSharedOk=!1,console.warn("[webgpu] GEMM q8/q4 tuil\xE9s COUP\xC9S par ?qshared=0 : kernels 4 lignes/invocation")),ne("qshared2")==="0"&&(this.qShared2Ok=!1,console.warn("[webgpu] GEMM q8/q4 v2 (bloc 4\xD78 vec4) COUP\xC9S par ?qshared2=0 : tuile 32\xD764 v1")),ne("convtq")==="0"&&(this.convTiledQOk=!1,console.warn("[webgpu] conv 3\xD73 tuil\xE9 q8/q4 COUP\xC9 par ?convtq=0 : conv2d_direct_q8/q4 (plus lent, m\xEAme r\xE9sultat)")),ne("videoresident")==="0"&&(this.videoResidentOk=!1,console.warn("[webgpu] motion r\xE9sident COUP\xC9 par ?videoresident=0 : chemin JS+readback")),ne("dequantq3k")==="0"&&(this.dequantQ3kOk=!1,console.warn("[webgpu] d\xE9quantification GPU Q3_K COUP\xC9E par ?dequantq3k=0 : repli CPU")),ne("dequantq41")==="0"&&(this.dequantQ41Ok=!1,console.warn("[webgpu] d\xE9quantification GPU Q4_1 COUP\xC9E par ?dequantq41=0 : repli CPU"))}catch{}this.device.lost?.then?.(i=>{this.lost=!0,console.warn("[webgpu] device GPU perdu :",i?.reason||"unknown",i?.message||""),this.onLost?.(i)});for(let[i,a]of Object.entries(Le))this.modules[i]=this.device.createShaderModule({code:a});return this.hasF16&&(this.modules.matmul_t_f16w=this.device.createShaderModule({code:hn})),!0}buf(r,t){let e=this.device.createBuffer({size:r.byteLength,usage:t});return this.device.queue.writeBuffer(e,0,r),e}bufU32(r,t){let e=this.device.createBuffer({size:r.byteLength,usage:t});return this.device.queue.writeBuffer(e,0,r),e}async readBack(r,t){let e=globalThis,n=this.device.createBuffer({size:t,usage:e.GPUBufferUsage.COPY_DST|e.GPUBufferUsage.MAP_READ}),s=this.device.createCommandEncoder();s.copyBufferToBuffer(r,0,n,0,t),this.device.queue.submit([s.finish()]),await n.mapAsync(e.GPUMapMode.READ);let i=new Float32Array(n.getMappedRange().slice(0));return n.unmap(),n.destroy(),i}async readBackBytes(r,t){let e=globalThis,n=Math.ceil(t/4)*4,s=this.device.createBuffer({size:n,usage:e.GPUBufferUsage.COPY_DST|e.GPUBufferUsage.MAP_READ}),i=this.device.createCommandEncoder();i.copyBufferToBuffer(r,0,s,0,n),this.device.queue.submit([i.finish()]),await s.mapAsync(e.GPUMapMode.READ);let a=new Uint8Array(s.getMappedRange().slice(0,t));return s.unmap(),s.destroy(),a}async quantizeToBytes(r,t,e,n,s){let i=e/32,a=n==="q8"?new Uint8Array(e+i*2):new Uint8Array(e/2+i*4),o=ie.BLOCK_ELEMS[r]??1,u=e/o,c=t.byteLength/u,l=(m,w)=>w===0?m:l(w,m%w),d=o*32/l(o,32),p=Math.floor(this.maxStorageBufferBindingSize*.9/4),g=s??p;g=Math.max(d,Math.floor(g/d)*d);for(let m=0;m<e;m+=g){let w=Math.min(g,e-m),v=t.slice(m/o*c,(m+w)/o*c),x=this.dequantizeToGpu(r,v,w);try{if(n==="q8"){let{codes:q,sc:F}=this.f32ToQ8Gpu(x,w),R=await this.readBackBytes(q,w),K=await this.readBackBytes(F,w/32*2);q.destroy?.(),F.destroy?.(),a.set(R,m),a.set(K,e+m/32*2)}else{let{nib:q,sc:F,mn:R}=this.f32ToQ4Gpu(x,w),K=await this.readBackBytes(q,w/2),P=await this.readBackBytes(F,w/32*2),G=await this.readBackBytes(R,w/32*2);q.destroy?.(),F.destroy?.(),R.destroy?.(),a.set(K,m/2),a.set(P,e/2+m/32*2),a.set(G,e/2+i*2+m/32*2)}}finally{x.destroy?.()}}return a}pipeline(r){let t=this.pipelines[r];return t||(t=this.device.createComputePipeline({layout:"auto",compute:{module:this.modules[r],entryPoint:"main"}}),this.pipelines[r]=t),t}grid1D(r){let t=Math.ceil(r/ce);if(t<=ie.MAX_WG_DIM)return[t,1,1];let e=ie.MAX_WG_DIM;return[e,Math.ceil(t/e),1]}recordPass(r,t,e,n){let s=this.pipeline(t),i=this.device.createBindGroup({layout:s.getBindGroupLayout(0),entries:e.map((u,c)=>({binding:c,resource:{buffer:u}}))}),a=this.profiler?.slot(t),o=r.beginComputePass(a?{timestampWrites:a}:void 0);o.setPipeline(s),o.setBindGroup(0,i),o.dispatchWorkgroups(...n),o.end()}dispatch(r,t,e){let n=this.device.createCommandEncoder();this.recordPass(n,r,t,e),this.device.queue.submit([n.finish()])}async run(r,t,e,n,s){return this.dispatch(r,t,e),this.readBack(n,s)}isF32(r){return r instanceof Float32Array}async matmul(r,t,e,n,s){let i=globalThis,a=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([e,n,s]));let u=this.isF32(t)?this.buf(t,a):t,c=this.device.createBuffer({size:e*s*4,usage:a|i.GPUBufferUsage.COPY_SRC});return this.run("matmul",[o,this.buf(r,a),u,c],[Math.ceil(e/8),Math.ceil(s/8),1],c,e*s*4)}async matmulT(r,t,e,n,s,i=!1){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([e,n,s]));let c=this.isF32(t)?this.buf(t,o):t,l=this.device.createBuffer({size:e*s*4,usage:o|a.GPUBufferUsage.COPY_SRC}),d=this.matmulTPlan(e,n,s,i);return this.run(d.shader,[u,this.buf(r,o),c,l],d.grid,l,e*s*4)}matmulTPlan(r,t,e,n){return n&&this.hasF16?this.f16SharedOk&&r>=32&&t%4===0?{shader:"matmul_t_f16w_shared",grid:[Math.ceil(e/64),Math.ceil(r/32),1]}:{shader:"matmul_t_f16w",grid:[Math.ceil(r/8),Math.ceil(e/8),1]}:{shader:t%4===0?"matmul_t_vec4":"matmul_t",grid:[Math.ceil(r/8),Math.ceil(e/8),1]}}async rmsnorm(r,t,e,n,s=1e-5,i=!1){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([e,n])),this.device.queue.writeBuffer(u,8,new Float32Array([s])),this.device.queue.writeBuffer(u,12,new Uint32Array([i?1:0]));let c=this.device.createBuffer({size:r.byteLength,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("rmsnorm",[u,this.buf(r,o),this.buf(t,o),c],[Math.ceil(e/ce),1,1],c,r.byteLength)}async topKReadback(r,t,e){let n=globalThis,s=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST,i=this.device.createBuffer({size:8,usage:n.GPUBufferUsage.UNIFORM|n.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(i,0,new Uint32Array([r.length,t]));let a=this.device.createBuffer({size:t*2*4,usage:s|n.GPUBufferUsage.COPY_SRC}),o=this.device.createBuffer({size:t*2*4,usage:n.GPUBufferUsage.COPY_DST|n.GPUBufferUsage.MAP_READ}),u=this.device.createCommandEncoder(),c=this.buf(r,s);this.recordPass(u,e,[i,c,a],[1,1,1]),u.copyBufferToBuffer(a,0,o,0,t*2*4),this.device.queue.submit([u.finish()]),await o.mapAsync(n.GPUMapMode.READ);let l=new Uint32Array(o.getMappedRange().slice(0));return o.unmap(),o.destroy(),a.destroy?.(),i.destroy?.(),c.destroy?.(),l}async rmsnormVec(r,t,e,n,s=1e-5,i=!1,a="rmsnorm_vec"){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([e,n])),this.device.queue.writeBuffer(c,8,new Float32Array([s])),this.device.queue.writeBuffer(c,12,new Uint32Array([i?1:0]));let l=this.device.createBuffer({size:r.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run(a,[c,this.buf(r,u),this.buf(t,u),l],[e,1,1],l,r.byteLength)}async binary(r,t,e){let n=globalThis,s=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST,i=this.device.createBuffer({size:t.byteLength,usage:s|n.GPUBufferUsage.COPY_SRC});return this.run(r,[this.buf(t,s),this.buf(e,s),i],this.grid1D(t.length),i,t.byteLength)}swiglu(r,t){return this.binary("swiglu",r,t)}geglu(r,t){return this.binary("geglu",r,t)}add(r,t){return this.binary("add",r,t)}async silu(r){let t=globalThis,e=t.GPUBufferUsage.STORAGE|t.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:r.byteLength,usage:e|t.GPUBufferUsage.COPY_SRC});return this.run("silu",[this.buf(r,e),n],this.grid1D(r.length),n,r.byteLength)}async groupNorm(r,t,e,n,s,i,a=1e-5,o="group_norm"){let u=globalThis,c=u.GPUBufferUsage.STORAGE|u.GPUBufferUsage.COPY_DST,l=this.device.createBuffer({size:16,usage:u.GPUBufferUsage.UNIFORM|u.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(l,0,new Uint32Array([n,s,i])),this.device.queue.writeBuffer(l,12,new Float32Array([a]));let d=this.device.createBuffer({size:r.byteLength,usage:c|u.GPUBufferUsage.COPY_SRC});return this.run(o,[l,this.buf(r,c),this.buf(t,c),this.buf(e,c),d],[i,1,1],d,r.byteLength)}async conv2d(r,t,e,n,s,i,a,o,u,c=1,l=0){let d=globalThis,p=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,g=Math.floor((s+2*l-o)/c)+1,m=Math.floor((i+2*l-u)/c)+1,w=n*o*u,v=g*m;if(w*v*4>this.maxStorageBufferBindingSize*.9)return this.conv2dDirect(r,t,e,n,s,i,a,o,u,c,l);let x=this.device.createBuffer({size:48,usage:d.GPUBufferUsage.UNIFORM|d.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(x,0,new Uint32Array([n,s,i,o,u,c,l,g,m]));let q=this.device.createBuffer({size:w*v*4,usage:p|d.GPUBufferUsage.COPY_SRC});this.dispatch("im2col",[x,this.buf(r,p),q],this.grid1D(w*v));let F=await this.matmul(t,q,a,w,v);if(q.destroy?.(),x.destroy?.(),e)for(let R=0;R<a;R++){let K=e[R];for(let P=0;P<v;P++)F[R*v+P]+=K}return F}async conv2dDirect(r,t,e,n,s,i,a,o,u,c=1,l=0){let d=globalThis,p=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,g=Math.floor((s+2*l-o)/c)+1,m=Math.floor((i+2*l-u)/c)+1,w=a*g*m,v=this.device.createBuffer({size:48,usage:d.GPUBufferUsage.UNIFORM|d.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(v,0,new Uint32Array([n,s,i,a,o,u,c,l,g,m]));let x=e??new Float32Array(a),q=this.device.createBuffer({size:w*4,usage:p|d.GPUBufferUsage.COPY_SRC});return this.run("conv2d_direct",[v,this.buf(r,p),this.buf(t,p),this.buf(x,p),q],this.grid1D(w),q,w*4)}async layernorm(r,t,e,n,s,i=1e-5){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s])),this.device.queue.writeBuffer(u,8,new Float32Array([i]));let c=this.device.createBuffer({size:r.byteLength,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("layernorm",[u,this.buf(r,o),this.buf(t,o),this.buf(e,o),c],[Math.ceil(n/ce),1,1],c,r.byteLength)}async quickGelu(r){let t=globalThis,e=t.GPUBufferUsage.STORAGE|t.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:r.byteLength,usage:e|t.GPUBufferUsage.COPY_SRC});return this.run("quick_gelu",[this.buf(r,e),n],this.grid1D(r.length),n,r.byteLength)}async gelu(r){let t=globalThis,e=t.GPUBufferUsage.STORAGE|t.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:r.byteLength,usage:e|t.GPUBufferUsage.COPY_SRC});return this.run("gelu",[this.buf(r,e),n],this.grid1D(r.length),n,r.byteLength)}async relu(r){let t=globalThis,e=t.GPUBufferUsage.STORAGE|t.GPUBufferUsage.COPY_DST,n=this.device.createBuffer({size:r.byteLength,usage:e|t.GPUBufferUsage.COPY_SRC});return this.run("relu",[this.buf(r,e),n],this.grid1D(r.length),n,r.byteLength)}async upsampleNearest(r,t,e,n,s=2){let i=globalThis,a=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=e*s,u=n*s,c=t*o*u,l=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(l,0,new Uint32Array([t,e,n,s]));let d=this.device.createBuffer({size:c*4,usage:a|i.GPUBufferUsage.COPY_SRC});return this.run("upsample_nearest",[l,this.buf(r,a),d],this.grid1D(c),d,c*4)}async upscale2x(r,t,e,n,s=.5){let i=e*2,a=n*2,o=this.recordingSession(),u=this.uploadGpu(r),c=o.upscale2x(u,t,e,n,s),l=await o.finish(c,t*i*a);return this.releaseGpu([u]),l}async rope(r,t,e,n,s=0,i=1e4,a=!1){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:32,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([t,e,n,s])),this.device.queue.writeBuffer(c,16,new Float32Array([i]));let l=this.device.createBuffer({size:r.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.device.queue.writeBuffer(c,20,new Uint32Array([a?1:0])),this.run("rope",[c,this.buf(r,u),l],[Math.ceil(t/ce),1,1],l,r.byteLength)}async ropeFactors(r,t,e,n,s,i=0,a=1e4,o=!1){let u=globalThis,c=u.GPUBufferUsage.STORAGE|u.GPUBufferUsage.COPY_DST,l=this.device.createBuffer({size:32,usage:u.GPUBufferUsage.UNIFORM|u.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(l,0,new Uint32Array([e,n,s,i])),this.device.queue.writeBuffer(l,16,new Float32Array([a]));let d=this.device.createBuffer({size:t.byteLength,usage:c});this.device.queue.writeBuffer(d,0,t);let p=this.device.createBuffer({size:r.byteLength,usage:c|u.GPUBufferUsage.COPY_SRC});return this.device.queue.writeBuffer(l,20,new Uint32Array([o?1:0])),this.run("rope_factors",[l,this.buf(r,c),d,p],[Math.ceil(e/ce),1,1],p,r.byteLength)}async ropeMrope(r,t,e,n,s,i,a=1e4){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:32,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([e,n,s,i[0],i[0]+i[1]])),this.device.queue.writeBuffer(c,20,new Float32Array([a]));let l=this.device.createBuffer({size:t.byteLength,usage:u});this.device.queue.writeBuffer(l,0,t);let d=this.device.createBuffer({size:r.byteLength,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("rope_mrope",[c,this.buf(r,u),l,d],[Math.ceil(e/ce),1,1],d,r.byteLength)}async rope2d(r,t,e,n,s,i=1e4){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:32,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([e,n,s,0])),this.device.queue.writeBuffer(u,16,new Float32Array([i]));let c=this.device.createBuffer({size:t.byteLength,usage:o});this.device.queue.writeBuffer(c,0,t);let l=this.device.createBuffer({size:r.byteLength,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("rope_2d",[u,this.buf(r,o),c,l],[Math.ceil(e/ce),1,1],l,r.byteLength)}async attention(r,t,e,n,s,i,a,o=0,u,c=0,l=0){let d=globalThis,p=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,g=o+n,m=this.attnUniform(n,s,i,a,g,o,u??1/Math.sqrt(a),c,l),w=n*s*a*4,v=this.device.createBuffer({size:w,usage:p|d.GPUBufferUsage.COPY_SRC});return this.run("attention",[m,this.buf(r,p),this.buf(t,p),this.buf(e,p),v],[Math.ceil(n*s/ce),1,1],v,w)}async attentionDecode(r,t,e,n,s,i,a,o=0,u,c=0,l=0){let d=globalThis,p=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,g=o+n,m=this.attnUniform(n,s,i,a,g,o,u??1/Math.sqrt(a),c,l),w=n*s*a*4,v=this.device.createBuffer({size:w,usage:p|d.GPUBufferUsage.COPY_SRC});return this.run("attention_decode",[m,this.buf(r,p),this.buf(t,p),this.buf(e,p),v],[n*s,1,1],v,w)}async attentionPrefill(r,t,e,n,s,i,a,o=0,u,c=0,l=0){let d=globalThis,p=d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST,g=o+n,m=this.attnUniform(n,s,i,a,g,o,u??1/Math.sqrt(a),c,l),w=n*s*a*4,v=this.device.createBuffer({size:w,usage:p|d.GPUBufferUsage.COPY_SRC});return this.run("attention_prefill",[m,this.buf(r,p),this.buf(t,p),this.buf(e,p),v],[Math.ceil(n/4)*s,1,1],v,w)}async attentionFull(r,t,e,n,s,i,a,o,u,c=0){let l=globalThis,d=l.GPUBufferUsage.STORAGE|l.GPUBufferUsage.COPY_DST,p=this.device.createBuffer({size:32,usage:l.GPUBufferUsage.UNIFORM|l.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(p,0,new Uint32Array([n,s,i,a,o,0])),this.device.queue.writeBuffer(p,24,new Float32Array([u??1/Math.sqrt(a),c]));let g=n*s*a*4,m=this.device.createBuffer({size:g,usage:d|l.GPUBufferUsage.COPY_SRC});return this.run("attention_full",[p,this.buf(r,d),this.buf(t,d),this.buf(e,d),m],[Math.ceil(n*s/ce),1,1],m,g)}async attentionFullWg(r,t,e,n,s,i,a,o,u,c=0){let l=globalThis,d=l.GPUBufferUsage.STORAGE|l.GPUBufferUsage.COPY_DST,p=this.device.createBuffer({size:32,usage:l.GPUBufferUsage.UNIFORM|l.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(p,0,new Uint32Array([n,s,i,a,o,0])),this.device.queue.writeBuffer(p,24,new Float32Array([u??1/Math.sqrt(a),c]));let g=n*s*a*4,m=this.device.createBuffer({size:g,usage:d|l.GPUBufferUsage.COPY_SRC});return this.run("attention_full_wg",[p,this.buf(r,d),this.buf(t,d),this.buf(e,d),m],[n*s,1,1],m,g)}async quantizeKvReadback(r,t,e,n){let s=globalThis,i=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST|s.GPUBufferUsage.COPY_SRC,a=e*n,o=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([t,e,n,0]));let u=this.device.createBuffer({size:t*a,usage:i}),c=this.device.createBuffer({size:t*e*4,usage:i});this.dispatch("quantize_kv",[o,this.buf(r,i),u,c],this.grid1D(t*e));let l=await this.readBack(u,t*a),d=new Uint32Array(l.buffer,0,t*a/4),p=await this.readBack(c,t*e*4);return u.destroy?.(),c.destroy?.(),{codes:d,scales:p}}async attentionQ8Kv(r,t,e,n,s,i,a,o,u,c=0,l,d=0,p=0){let g=globalThis,m=g.GPUBufferUsage.STORAGE|g.GPUBufferUsage.COPY_DST,w=c+i,v=this.attnUniform(i,a,o,u,w,c,l??1/Math.sqrt(u),d,p),x=i*a*u*4,q=this.device.createBuffer({size:x,usage:m|g.GPUBufferUsage.COPY_SRC});return this.run("attention_q8kv",[v,this.buf(r,m),this.bufU32(t,m),this.buf(e,m),this.bufU32(n,m),this.buf(s,m),q],[Math.ceil(i*a/ce),1,1],q,x)}async attentionQ8KvDecode(r,t,e,n,s,i,a,o,u,c=0,l,d=0,p=0){let g=globalThis,m=g.GPUBufferUsage.STORAGE|g.GPUBufferUsage.COPY_DST,w=c+i,v=this.attnUniform(i,a,o,u,w,c,l??1/Math.sqrt(u),d,p),x=i*a*u*4,q=this.device.createBuffer({size:x,usage:m|g.GPUBufferUsage.COPY_SRC});return this.run("attention_decode_q8kv",[v,this.buf(r,m),this.bufU32(t,m),this.buf(e,m),this.bufU32(n,m),this.buf(s,m),q],[i*a,1,1],q,x)}async attentionQ8KvPrefill(r,t,e,n,s,i,a,o,u,c=0,l,d=0,p=0){let g=globalThis,m=g.GPUBufferUsage.STORAGE|g.GPUBufferUsage.COPY_DST,w=c+i,v=this.attnUniform(i,a,o,u,w,c,l??1/Math.sqrt(u),d,p),x=i*a*u*4,q=this.device.createBuffer({size:x,usage:m|g.GPUBufferUsage.COPY_SRC});return this.run("attention_prefill_q8kv",[v,this.buf(r,m),this.bufU32(t,m),this.buf(e,m),this.bufU32(n,m),this.buf(s,m),q],[Math.ceil(i/4)*a,1,1],q,x)}async addBias(r,t,e,n){let s=globalThis,i=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,a=this.device.createBuffer({size:8,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(a,0,new Uint32Array([e,n]));let o=this.device.createBuffer({size:r.byteLength,usage:i|s.GPUBufferUsage.COPY_SRC});return this.run("addbias",[a,this.buf(r,i),this.buf(t,i),o],this.grid1D(r.length),o,r.byteLength)}async dequantBlocked(r,t,e,n){let s=globalThis,i=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,a=e/n;if(!Number.isInteger(a))throw new Error(`${r}: nElems ${e} not a multiple of ${n}`);let o=t.byteLength%4===0?t:(()=>{let d=new Uint8Array(Math.ceil(t.byteLength/4)*4);return d.set(t),d})(),u=new Uint32Array(o.buffer,o.byteOffset,o.byteLength/4),c=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([a]));let l=this.device.createBuffer({size:e*4,usage:i|s.GPUBufferUsage.COPY_SRC});return this.run(r,[c,this.bufU32(u,i),l],this.grid1D(a),l,e*4)}async dequantizeQ4K(r,t){return this.dequantBlocked("dequant_q4k",r,t,256)}async dequantizeByType(r,t,e){if(r==="F32")return new Float32Array(t.buffer,t.byteOffset,e);if(r==="F16"){let i=new DataView(t.buffer,t.byteOffset),a=new Float32Array(e);for(let o=0;o<e;o++)a[o]=_e(i.getUint16(o*2,!0));return a}if(r==="Q4W")return he(ke(t,e));if(r==="Q8W")return ve(Ge(t,e));if(r==="Q3W")return He(Be(t,e));if(r==="Q3_K"&&!this.dequantQ3kOk)return gr(t,Math.floor(e/256));if(r==="Q4_1"&&!this.dequantQ41Ok)return mr(t,Math.floor(e/32));let n=ie.DEQUANT_SHADER[r],s=ie.BLOCK_ELEMS[r];if(!n||!s)throw new Error(`dequant: unsupported GGML type ${r}`);return this.dequantBlocked(n,t,e,s)}dequantBlockedGpu(r,t,e,n,s){let i=globalThis,a=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=e/n;if(!Number.isInteger(o))throw new Error(`${r}: nElems ${e} not a multiple of ${n}`);let u=t.byteLength%4===0?t:(()=>{let g=new Uint8Array(Math.ceil(t.byteLength/4)*4);return g.set(t),g})(),c=new Uint32Array(u.buffer,u.byteOffset,u.byteLength/4),l=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(l,0,new Uint32Array([o]));let d=s??this.device.createBuffer({size:e*4,usage:a}),p=this.bufU32(c,a);return this.dispatch(r,[l,p,d],this.grid1D(o)),p.destroy(),l.destroy(),d}dequantizeToGpu(r,t,e){let n=globalThis,s=n.GPUBufferUsage.STORAGE|n.GPUBufferUsage.COPY_DST;if(r==="F32")return this.buf(new Float32Array(t.buffer,t.byteOffset,e),s);if(r==="F16"){let o=new DataView(t.buffer,t.byteOffset),u=new Float32Array(e);for(let c=0;c<e;c++)u[c]=_e(o.getUint16(c*2,!0));return this.buf(u,s)}if(r==="Q4W")return this.buf(he(ke(t,e)),s);if(r==="Q8W")return this.buf(ve(Ge(t,e)),s);if(r==="Q3W")return this.buf(He(Be(t,e)),s);if(r==="Q3_K"&&!this.dequantQ3kOk)return this.buf(gr(t,Math.floor(e/256)),s);if(r==="Q4_1"&&!this.dequantQ41Ok)return this.buf(mr(t,Math.floor(e/32)),s);let i=ie.DEQUANT_SHADER[r],a=ie.BLOCK_ELEMS[r];if(!i||!a)throw new Error(`dequant: unsupported GGML type ${r}`);return this.dequantBlockedGpu(i,t,e,a)}dequantizeIntoGpu(r,t,e,n){let s=ie.DEQUANT_SHADER[r],i=ie.BLOCK_ELEMS[r];if(!s||!i)throw new Error(`dequantizeIntoGpu : type ${r} non g\xE9r\xE9`);this.dequantBlockedGpu(s,t,e,i,n)}async layerForward(r,t,e,n=!1){let{seq:s,d:i,nHeads:a,nKvHeads:o,headDim:u,ffn:c,ropeTheta:l,eps:d}=t,p=o*u,g=n?(M,O,T,S,L)=>this.matmulT(M,O,T,S,L):(M,O,T,S,L)=>this.matmul(M,O,T,S,L),m=a*u,w=t.rmsGainOnePlus===!0,v=t.attnLogitSoftcap??0,x=(M,O)=>t.act==="gelu"?this.geglu(M,O):this.swiglu(M,O),q=await this.rmsnorm(r,e.attnNorm,s,i,d,w),F=await g(q,e.wq,s,i,m),R=await g(q,e.wk,s,i,p),K=await g(q,e.wv,s,i,p);e.bq&&(F=await this.addBias(F,e.bq,s,m)),e.bk&&(R=await this.addBias(R,e.bk,s,p)),e.bv&&(K=await this.addBias(K,e.bv,s,p)),e.qNorm&&(F=await this.rmsnorm(F,e.qNorm,s*a,u,d,w)),e.kNorm&&(R=await this.rmsnorm(R,e.kNorm,s*o,u,d,w));let P=await this.rope(F,s*a,u,a,0,l),G=await this.rope(R,s*o,u,o,0,l),_=await this.attention(P,G,K,s,a,o,u,0,t.attnScale,v),h=await g(_,e.wo,s,m,i);e.postAttnNorm&&(h=await this.rmsnorm(h,e.postAttnNorm,s,i,d,w));let y=await this.add(r,h),b=await this.rmsnorm(y,e.ffnNorm,s,i,d,w),k=await g(b,e.wgate,s,i,c),A=await g(b,e.wup,s,i,c),B=await x(k,A),U=await g(B,e.wdown,s,c,i);return e.postFfnNorm&&(U=await this.rmsnorm(U,e.postFfnNorm,s,i,d,w)),this.add(y,U)}async layerForwardKV(r,t,e,n,s,i,a=!1){let{seq:o,d:u,nHeads:c,nKvHeads:l,headDim:d,ffn:p,ropeTheta:g,eps:m}=t,w=l*d,v=a?(H,W,$,D,C)=>this.matmulT(H,W,$,D,C):(H,W,$,D,C)=>this.matmul(H,W,$,D,C),x=(H,W)=>{let $=new Float32Array(H.length+W.length);return $.set(H),$.set(W,H.length),$},q=c*d,F=t.rmsGainOnePlus===!0,R=t.attnLogitSoftcap??0,K=(H,W)=>t.act==="gelu"?this.geglu(H,W):this.swiglu(H,W),P=await this.rmsnorm(r,e.attnNorm,o,u,m,F),G=await v(P,e.wq,o,u,q),_=await v(P,e.wk,o,u,w),h=await v(P,e.wv,o,u,w);e.bq&&(G=await this.addBias(G,e.bq,o,q)),e.bk&&(_=await this.addBias(_,e.bk,o,w)),e.bv&&(h=await this.addBias(h,e.bv,o,w)),e.qNorm&&(G=await this.rmsnorm(G,e.qNorm,o*c,d,m,F)),e.kNorm&&(_=await this.rmsnorm(_,e.kNorm,o*l,d,m,F));let y=await this.rope(G,o*c,d,c,n,g),b=await this.rope(_,o*l,d,l,n,g),k=x(s,b),A=x(i,h),B=await this.attention(y,k,A,o,c,l,d,n,t.attnScale,R),U=await v(B,e.wo,o,q,u);e.postAttnNorm&&(U=await this.rmsnorm(U,e.postAttnNorm,o,u,m,F));let M=await this.add(r,U),O=await this.rmsnorm(M,e.ffnNorm,o,u,m,F),T=await v(O,e.wgate,o,u,p),S=await v(O,e.wup,o,u,p),L=await K(T,S),E=await v(L,e.wdown,o,p,u);return e.postFfnNorm&&(E=await this.rmsnorm(E,e.postFfnNorm,o,u,m,F)),{out:await this.add(M,E),k,v:A}}storage(r){let t=this.bufferPool.get(r);if(t&&t.length){let n=t.pop();return this.pooled.delete(n),n}let e=this.device.createBuffer({size:r,usage:ie.STORAGE_USAGE});return this.poolSize.set(e,r),e}release(r){for(let t of r){if(!t)continue;let e=this.poolSize.get(t);if(e!==void 0){if(this.pooled.has(t))continue;this.pooled.add(t);let s=this.bufferPool.get(e);s||(s=[],this.bufferPool.set(e,s)),s.push(t);continue}let n=this.uniformSize.get(t);if(n!==void 0){if(this.pooled.has(t))continue;this.pooled.add(t);let s=this.uniformPool.get(n);s||(s=[],this.uniformPool.set(n,s)),s.push(t);continue}t.destroy?.()}}recycleStorage(r){this.release(r.filter(t=>t&&this.poolSize.has(t)))}uploadGpu(r){return r instanceof Float32Array?this.buf(r,ie.STORAGE_USAGE):this.f16ToF32Gpu(r.f16,r.n)}uploadGpuF16(r){let t=new Uint16Array(r.length);for(let e=0;e<r.length;e++)t[e]=pe(r[e]);return this.bufU16(t)}f32ToF16Gpu(r,t){let e=globalThis,n=Math.ceil(t/2),s=this.device.createBuffer({size:n*4,usage:ie.STORAGE_USAGE}),i=this.device.createBuffer({size:16,usage:e.GPUBufferUsage.UNIFORM|e.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(i,0,new Uint32Array([n])),this.dispatch("packf16",[i,r,s],this.grid1D(n)),s}f32ToQ8Gpu(r,t){let e=globalThis,n=t/32,s=this.device.createBuffer({size:t,usage:ie.STORAGE_USAGE}),i=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:ie.STORAGE_USAGE}),a=this.device.createBuffer({size:16,usage:e.GPUBufferUsage.UNIFORM|e.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(a,0,new Uint32Array([n])),this.dispatch("quantize_q8",[a,r,s,i],this.grid1D(n)),a.destroy(),{codes:s,sc:i}}f32ToQ4Gpu(r,t){let e=globalThis,n=t/32,s=this.device.createBuffer({size:t/2,usage:ie.STORAGE_USAGE}),i=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:ie.STORAGE_USAGE}),a=this.device.createBuffer({size:Math.ceil(n/2)*4,usage:ie.STORAGE_USAGE}),o=this.device.createBuffer({size:16,usage:e.GPUBufferUsage.UNIFORM|e.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(o,0,new Uint32Array([n])),this.dispatch("quantize_q4",[o,r,s,i,a],this.grid1D(n)),o.destroy(),{nib:s,sc:i,mn:a}}uploadGpuRawF16(r){let t=Math.ceil(r.byteLength/4)*4,e=this.device.createBuffer({size:t,usage:ie.STORAGE_USAGE});if(this.device.queue.writeBuffer(e,0,r,0,r.byteLength-r.byteLength%4),r.byteLength%4){let n=new Uint8Array(4);n.set(r.subarray(r.byteLength-r.byteLength%4)),this.device.queue.writeBuffer(e,r.byteLength-r.byteLength%4,n)}return e}bufU16(r){let t=this.device.createBuffer({size:r.byteLength,usage:ie.STORAGE_USAGE});return this.device.queue.writeBuffer(t,0,r),t}uploadGpuRaw(r){let t=Math.ceil(r.byteLength/4)*4,e=this.device.createBuffer({size:t,usage:ie.STORAGE_USAGE}),n=r.byteLength-r.byteLength%4;if(this.device.queue.writeBuffer(e,0,r,0,n),r.byteLength%4){let s=new Uint8Array(4);s.set(r.subarray(n)),this.device.queue.writeBuffer(e,n,s)}return e}async matmulQ4(r,t,e,n,s,i,a){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s,i,a]));let l=this.device.createBuffer({size:s*a*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4",[c,this.buf(r,u),t,e,n,l],[Math.ceil(s/8),Math.ceil(a/8),1],l,s*a*4)}async matmulQ4Tiled(r,t,e,n,s,i,a){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s,i,a]));let l=this.device.createBuffer({size:s*a*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_tiled",[c,this.buf(r,u),t,e,n,l],[Math.ceil(Math.ceil(s/4)/8),Math.ceil(a/8),1],l,s*a*4)}async matmulQ4Shared(r,t,e,n,s,i,a){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s,i,a]));let l=this.device.createBuffer({size:s*a*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_shared",[c,this.buf(r,u),t,e,n,l],[Math.ceil(a/64),Math.ceil(s/32),1],l,s*a*4)}async matmulQ3(r,t,e,n,s,i,a,o){let u=globalThis,c=u.GPUBufferUsage.STORAGE|u.GPUBufferUsage.COPY_DST,l=this.device.createBuffer({size:16,usage:u.GPUBufferUsage.UNIFORM|u.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(l,0,new Uint32Array([i,a,o]));let d=this.device.createBuffer({size:i*o*4,usage:c|u.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q3",[l,this.buf(r,c),t,e,n,s,d],[Math.ceil(i/8),Math.ceil(o/8),1],d,i*o*4)}async rwkvWkv7(r,t,e,n,s,i,a,o,u){let c=globalThis,l=c.GPUBufferUsage.STORAGE|c.GPUBufferUsage.COPY_DST,d=this.device.createBuffer({size:8,usage:c.GPUBufferUsage.UNIFORM|c.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(d,0,new Uint32Array([o,u]));let p=this.device.createBuffer({size:r.byteLength,usage:l|c.GPUBufferUsage.COPY_SRC});this.device.queue.writeBuffer(p,0,r);let g=this.device.createBuffer({size:o*u*4,usage:l|c.GPUBufferUsage.COPY_SRC});this.dispatch("rwkv_wkv7",[d,this.buf(t,l),this.buf(e,l),this.buf(n,l),this.buf(s,l),this.buf(i,l),this.buf(a,l),p,g],this.grid1D(o*u));let m=await this.readBack(p,r.byteLength),w=await this.readBack(g,o*u*4);return p.destroy?.(),g.destroy?.(),{S:m,y:w}}async rwkvTokenShift(r,t,e,n){let s=globalThis,i=s.GPUBufferUsage.STORAGE|s.GPUBufferUsage.COPY_DST,a=this.device.createBuffer({size:16,usage:s.GPUBufferUsage.UNIFORM|s.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(a,0,new Uint32Array([n]));let o=this.device.createBuffer({size:6*n*4,usage:i|s.GPUBufferUsage.COPY_SRC});this.dispatch("rwkv_token_shift",[a,this.buf(r,i),this.buf(t,i),this.buf(e,i),o],this.grid1D(n*6));let u=await this.readBack(o,6*n*4);return o.destroy?.(),u}async lfm2ShortConv(r,t,e,n,s){let i=globalThis,a=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([n,s]));let u=this.buf(t,a|i.GPUBufferUsage.COPY_SRC),c=this.device.createBuffer({size:n*4,usage:a|i.GPUBufferUsage.COPY_SRC});this.dispatch("lfm2_shortconv",[o,this.buf(r,a),this.buf(e,a),u,c],this.grid1D(n));let l=await this.readBack(c,n*4),d=await this.readBack(u,(s-1)*n*4);return c.destroy?.(),u.destroy?.(),{out:l,state:d}}async qwen35Conv1d(r,t,e,n,s=4){let i=globalThis,a=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(o,0,new Uint32Array([n,s]));let u=this.buf(t,a|i.GPUBufferUsage.COPY_SRC),c=this.device.createBuffer({size:n*4,usage:a|i.GPUBufferUsage.COPY_SRC});this.dispatch("qwen35_ssm_conv",[o,this.buf(r,a),this.buf(e,a),u,c],this.grid1D(n));let l=await this.readBack(c,n*4),d=await this.readBack(u,(s-1)*n*4);return c.destroy?.(),u.destroy?.(),o.destroy?.(),{out:l,state:d}}async qwen35DeltaNetStep(r,t,e,n,s,i,a,o,u){let c=globalThis,l=c.GPUBufferUsage.STORAGE|c.GPUBufferUsage.COPY_DST,d=this.device.createBuffer({size:16,usage:c.GPUBufferUsage.UNIFORM|c.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(d,0,new Uint32Array([a,o,u]));let p=this.buf(i,l|c.GPUBufferUsage.COPY_SRC),g=this.device.createBuffer({size:u*o*4,usage:l|c.GPUBufferUsage.COPY_SRC});this.dispatch("qwen35_deltanet_step",[d,this.buf(r,l),this.buf(t,l),this.buf(e,l),this.buf(n,l),this.buf(s,l),p,g],[Math.ceil(o/64),u,1]);let m=await this.readBack(g,u*o*4),w=await this.readBack(p,u*a*o*4);return g.destroy?.(),p.destroy?.(),d.destroy?.(),{out:m,S:w}}async matmulQ8(r,t,e,n,s,i){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s,i]));let c=this.device.createBuffer({size:n*i*4,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8",[u,this.buf(r,o),t,e,c],[Math.ceil(n/8),Math.ceil(i/8),1],c,n*i*4)}async matmulQ8Tiled(r,t,e,n,s,i){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s,i]));let c=this.device.createBuffer({size:n*i*4,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_tiled",[u,this.buf(r,o),t,e,c],[Math.ceil(Math.ceil(n/4)/8),Math.ceil(i/8),1],c,n*i*4)}async matmulQ8Shared(r,t,e,n,s,i){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s,i]));let c=this.device.createBuffer({size:n*i*4,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_shared",[u,this.buf(r,o),t,e,c],[Math.ceil(i/64),Math.ceil(n/32),1],c,n*i*4)}async matmulQ8Shared2(r,t,e,n,s,i){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([n,s,i]));let c=this.device.createBuffer({size:n*i*4,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_shared2",[u,this.buf(r,o),t,e,c],[Math.ceil(i/128),Math.ceil(n/64),1],c,n*i*4)}async matmulQ4Shared2(r,t,e,n,s,i,a){let o=globalThis,u=o.GPUBufferUsage.STORAGE|o.GPUBufferUsage.COPY_DST,c=this.device.createBuffer({size:16,usage:o.GPUBufferUsage.UNIFORM|o.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([s,i,a]));let l=this.device.createBuffer({size:s*a*4,usage:u|o.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_shared2",[c,this.buf(r,u),t,e,n,l],[Math.ceil(a/128),Math.ceil(s/64),1],l,s*a*4)}uniformOf(r){let t=globalThis,e=this.uniformPool.get(r);if(e&&e.length){let s=e.pop();return this.pooled.delete(s),s}let n=this.device.createBuffer({size:r,usage:t.GPUBufferUsage.UNIFORM|t.GPUBufferUsage.COPY_DST});return this.uniformSize.set(n,r),n}uniform(r,t){let e=this.uniformOf(32);if(this.device.queue.writeBuffer(e,0,new Uint32Array(r)),t){let n=Array.isArray(t.value)?t.value:[t.value];this.device.queue.writeBuffer(e,t.offset,new Float32Array(n))}return e}attnUniform(r,t,e,n,s,i,a,o,u){let c=this.uniformOf(48);return this.device.queue.writeBuffer(c,0,new Uint32Array([r,t,e,n,s,i])),this.device.queue.writeBuffer(c,24,new Float32Array([a,o])),this.device.queue.writeBuffer(c,32,new Uint32Array([u])),c}recMatmulT(r,t,e,n,s,i,a,o=!1){let u=this.uniform([s,i,a]),c=this.storage(s*a*4),l=this.matmulTPlan(s,i,a,o);return this.recordPass(r,l.shader,[u,e,n,c],l.grid),t.push(u,c),c}recConv2dDirect(r,t,e,n,s,i,a,o,u,c,l,d,p){let g=Math.floor((a+2*p-c)/d)+1,m=Math.floor((o+2*p-l)/d)+1,w=u*g*m,v=this.uniformOf(48);if(this.device.queue.writeBuffer(v,0,new Uint32Array([i,a,o,u,c,l,d,p,g,m])),c===3&&l===3&&d===1&&p===1&&this.convTiledOk){let q=this.storage(w*4);return this.recordPass(r,"conv2d_3x3_tiled",[v,e,n,s,q],[Math.ceil(m/16),Math.ceil(g/16),u]),t.push(v,q),q}let x=this.storage(w*4);return this.recordPass(r,"conv2d_direct",[v,e,n,s,x],this.grid1D(w)),t.push(v,x),x}recConv2dDirectQ8(r,t,e,n,s,i,a,o,u,c,l,d,p){let g=Math.floor((a+2*p-c)/d)+1,m=Math.floor((o+2*p-l)/d)+1,w=u*g*m,v=this.uniformOf(48);if(this.device.queue.writeBuffer(v,0,new Uint32Array([i,a,o,u,c,l,d,p,g,m])),c===3&&l===3&&d===1&&p===1&&this.convTiledQOk){let q=this.storage(w*4);return this.recordPass(r,"conv2d_3x3_tiled_q8",[v,e,n.codes,n.sc,s,q],[Math.ceil(m/16),Math.ceil(g/16),Math.ceil(u/8)]),t.push(v,q),q}if(c===1&&l===1&&d===1&&p===0&&this.convTiledQOk){let q=this.storage(w*4);return this.recordPass(r,"conv2d_1x1_q8",[v,e,n.codes,n.sc,s,q],[Math.ceil(m/16),Math.ceil(g/16),Math.ceil(u/8)]),t.push(v,q),q}if(c===3&&l===3&&d===2&&p===1&&this.convTiledQOk&&this.convS2Ok){let q=this.storage(w*4);return this.recordPass(r,"conv2d_3x3_s2_tiled_q8",[v,e,n.codes,n.sc,s,q],[Math.ceil(m/16),Math.ceil(g/8),Math.ceil(u/8)]),t.push(v,q),q}let x=this.storage(w*4);return this.recordPass(r,"conv2d_direct_q8",[v,e,n.codes,n.sc,s,x],this.grid1D(w)),t.push(v,x),x}recConv2dDirectQ4(r,t,e,n,s,i,a,o,u,c,l,d,p){let g=Math.floor((a+2*p-c)/d)+1,m=Math.floor((o+2*p-l)/d)+1,w=u*g*m,v=this.uniformOf(48);if(this.device.queue.writeBuffer(v,0,new Uint32Array([i,a,o,u,c,l,d,p,g,m])),c===3&&l===3&&d===1&&p===1&&this.convTiledQOk){let q=this.storage(w*4);return this.recordPass(r,"conv2d_3x3_tiled_q4",[v,e,n.nib,n.sc,n.mn,s,q],[Math.ceil(m/16),Math.ceil(g/16),Math.ceil(u/8)]),t.push(v,q),q}if(c===1&&l===1&&d===1&&p===0&&this.convTiledQOk){let q=this.storage(w*4);return this.recordPass(r,"conv2d_1x1_q4",[v,e,n.nib,n.sc,n.mn,s,q],[Math.ceil(m/16),Math.ceil(g/16),Math.ceil(u/8)]),t.push(v,q),q}if(c===3&&l===3&&d===2&&p===1&&this.convTiledQOk&&this.convS2Ok){let q=this.storage(w*4);return this.recordPass(r,"conv2d_3x3_s2_tiled_q4",[v,e,n.nib,n.sc,n.mn,s,q],[Math.ceil(m/16),Math.ceil(g/8),Math.ceil(u/8)]),t.push(v,q),q}let x=this.storage(w*4);return this.recordPass(r,"conv2d_direct_q4",[v,e,n.nib,n.sc,n.mn,s,x],this.grid1D(w)),t.push(v,x),x}recGroupNorm(r,t,e,n,s,i,a,o,u){let c=this.uniform([i,a,o],{offset:12,value:u}),l=this.storage(i*a*4),d=this.hasSubgroups&&this.subgroupsOk?"group_norm_subgroup":"group_norm";return this.recordPass(r,d,[c,e,n,s,l],[o,1,1]),t.push(c,l),l}recUnary(r,t,e,n,s){let i=this.storage(s*4);return this.recordPass(r,e,[n,i],this.grid1D(s)),t.push(i),i}recLayernorm(r,t,e,n,s,i,a,o){let u=this.uniform([i,a],{offset:8,value:o}),c=this.storage(i*a*4);return this.recordPass(r,"layernorm",[u,e,n,s,c],[Math.ceil(i/ce),1,1]),t.push(u,c),c}recAttentionFull(r,t,e,n,s,i,a,o,u,c,l){let d=this.uniform([i,a,o,u,c,0],{offset:24,value:[l??1/Math.sqrt(u),0]}),p=this.storage(i*a*u*4),g=i*a;return this.attnFullWgOk&&u<=192&&g<=65535?this.recordPass(r,"attention_full_wg",[d,e,n,s,p],[g,1,1]):this.recordPass(r,"attention_full",[d,e,n,s,p],[Math.ceil(g/ce),1,1]),t.push(d,p),p}recUpsample(r,t,e,n,s,i,a){let o=this.uniform([n,s,i,a]),u=n*(s*a)*(i*a),c=this.storage(u*4);return this.recordPass(r,"upsample_nearest",[o,e,c],this.grid1D(u)),t.push(o,c),c}recConcat(r,t,e,n,s,i,a){let o=this.storage((s+i)*a*4);return r.copyBufferToBuffer(e,0,o,0,s*a*4),r.copyBufferToBuffer(n,0,o,s*a*4,i*a*4),t.push(o),o}recAddChannelBias(r,t,e,n,s,i){let a=this.uniform([s,i]),o=this.storage(s*i*4);return this.recordPass(r,"add_channel_bias",[a,e,n,o],this.grid1D(s*i)),t.push(a,o),o}recTranspose(r,t,e,n,s){let i=this.uniform([n,s]),a=this.storage(n*s*4);return this.recordPass(r,"transpose2d",[i,e,a],this.grid1D(n*s)),t.push(i,a),a}recGegluSplit(r,t,e,n,s){let i=this.uniform([n,s]),a=this.storage(n*s*4);return this.recordPass(r,"geglu_split",[i,e,a],this.grid1D(n*s)),t.push(i,a),a}recUpscale2x(r,t,e,n,s,i,a=.5){let o=this.uniform([n,s,i],{offset:12,value:a}),u=i*2,c=s*2,l=this.storage(n*c*u*4);return this.recordPass(r,"upscale2x_enhanced",[o,e,l],[Math.ceil(u/16),Math.ceil(c/16),n]),t.push(o,l),l}recVideoGather(r,t,e,n,s,i){let a=this.uniform([n,s,i]),o=this.storage(i*n*s*4);return this.recordPass(r,"video_motion_gather",[a,e,o],this.grid1D(i*n*s)),t.push(a,o),o}recVideoScatter(r,t,e,n,s,i,a){let o=this.uniform([s,i,a]),u=this.storage(s*i*a*4);return this.recordPass(r,"video_motion_scatter",[o,e,n,u],this.grid1D(s*i*a)),t.push(o,u),u}recVideoAddPe(r,t,e,n,s,i,a){let o=this.uniform([s,i,a]),u=this.storage(a*s*i*4);return this.recordPass(r,"video_add_pe",[o,e,n,u],this.grid1D(a*s*i)),t.push(o,u),u}recAttnTemporal(r,t,e,n,s,i,a,o,u){let c=this.uniform([i,a,o,u],{offset:16,value:1/Math.sqrt(u)}),l=this.storage(i*a*o*u*4);return this.recordPass(r,"attn_temporal",[c,e,n,s,l],this.grid1D(i*a*o)),t.push(c,l),l}recordingSession(){let r=this.device.createCommandEncoder(),t=[],e=n=>{if(n instanceof Float32Array){let s=this.uploadGpu(n);return t.push(s),s}return n};return{conv2d:(n,s,i,a,o,u,c,l,d,p,g)=>s&&s.nib?this.recConv2dDirectQ4(r,t,e(n),s,e(i),a,o,u,c,l,d,p,g):s&&s.codes?this.recConv2dDirectQ8(r,t,e(n),s,e(i),a,o,u,c,l,d,p,g):this.recConv2dDirect(r,t,e(n),e(s),e(i),a,o,u,c,l,d,p,g),groupNorm:(n,s,i,a,o,u,c)=>this.recGroupNorm(r,t,e(n),e(s),e(i),a,o,u,c),silu:(n,s)=>this.recUnary(r,t,"silu",e(n),s),quickGelu:(n,s)=>this.recUnary(r,t,"quick_gelu",e(n),s),gelu:(n,s)=>this.recUnary(r,t,"gelu",e(n),s),relu:(n,s)=>this.recUnary(r,t,"relu",e(n),s),add:(n,s,i)=>this.recBinary(r,t,"add",e(n),e(s),i),geglu:(n,s,i)=>this.recBinary(r,t,"geglu",e(n),e(s),i),matmulT:(n,s,i,a,o)=>this.recMM(r,t,e(n),s instanceof Float32Array?e(s):s,i,a,o,!1),addBias:(n,s,i,a)=>this.recAddBias(r,t,e(n),e(s),i,a),addChannelBias:(n,s,i,a)=>this.recAddChannelBias(r,t,e(n),e(s),i,a),attentionFull:(n,s,i,a,o,u,c,l)=>this.recAttentionFull(r,t,e(n),e(s),e(i),a,o,u,c,l),rope2d:(n,s,i,a,o,u)=>{let c=s instanceof Uint32Array?(()=>{let l=this.uploadGpuRaw(new Uint8Array(s.buffer,s.byteOffset,s.byteLength));return t.push(l),l})():s;return this.recRope2d(r,t,e(n),c,i,a,o,u)},attention:(n,s,i,a,o,u,c,l,d)=>this.recAttention(r,t,e(n),e(s),e(i),a,o,u,c,l,d),upsample:(n,s,i,a,o)=>this.recUpsample(r,t,e(n),s,i,a,o),upscale2x:(n,s,i,a,o=.5)=>this.recUpscale2x(r,t,e(n),s,i,a,o),layernorm:(n,s,i,a,o,u)=>this.recLayernorm(r,t,e(n),e(s),e(i),a,o,u),concat:(n,s,i,a,o)=>this.recConcat(r,t,e(n),e(s),i,a,o),transpose:(n,s,i)=>this.recTranspose(r,t,e(n),s,i),gegluSplit:(n,s,i)=>this.recGegluSplit(r,t,e(n),s,i),videoGather:(n,s,i,a)=>this.recVideoGather(r,t,e(n),s,i,a),videoScatter:(n,s,i,a,o)=>this.recVideoScatter(r,t,e(n),e(s),i,a,o),videoAddPe:(n,s,i,a,o)=>this.recVideoAddPe(r,t,e(n),e(s),i,a,o),attnTemporal:(n,s,i,a,o,u,c)=>this.recAttnTemporal(r,t,e(n),e(s),e(i),a,o,u,c),alloc:n=>{let s=this.storage(n);return t.push(s),s},copy:(n,s,i,a,o)=>{r.copyBufferToBuffer(i,a,n,s,o)},finish:async(n,s)=>{this.device.queue.submit([r.finish()]);let i=await this.readBack(n,s*4);return this.release(t),i},finishKeep:n=>{this.device.queue.submit([r.finish()]);let s=t.indexOf(n);return s>=0&&t.splice(s,1),this.release(t),n},finishKeepMany:n=>{this.device.queue.submit([r.finish()]);for(let s of n){let i=t.indexOf(s);i>=0&&t.splice(i,1)}return this.release(t),n}}}readGpu(r,t){return this.readBack(r,t*4)}trimPool(r=64<<20){let t=[...this.bufferPool.keys()].sort((n,s)=>s-n),e=0;for(let n of this.bufferPool.values())for(let s of n)e+=this.poolSize.get(s)??0;for(let n of t){let s=this.bufferPool.get(n);for(;s.length&&e>r;){let i=s.pop();this.pooled.delete(i),this.poolSize.delete(i),i.destroy?.(),e-=n}}}releaseGpu(r){this.release(r)}waitGpu(){return this.device.queue.onSubmittedWorkDone()}async settleGpu(){this.device.queue.submit([]),await this.device.queue.onSubmittedWorkDone(),await new Promise(r=>setTimeout(r,0))}async benchMatmul(r,t,e,n,s,i={}){let{iters:a=10,shared:o=!0,shared2:u=!0,wF16:c=!1}=i,l=this.f16SharedOk,d=this.qSharedOk,p=this.qShared2Ok;this.f16SharedOk=o,this.qSharedOk=o,this.qShared2Ok=o&&u;let g=this.uploadGpu(r),m=[],w=this.device.createCommandEncoder();this.recMM(w,m,g,t,e,n,s,c),this.device.queue.submit([w.finish()]),await this.device.queue.onSubmittedWorkDone();let v=this.device.createCommandEncoder();for(let F=0;F<a;F++)this.recMM(v,m,g,t,e,n,s,c);let x=performance.now();this.device.queue.submit([v.finish()]),await this.device.queue.onSubmittedWorkDone();let q=(performance.now()-x)/a;return this.release(m),g.destroy?.(),this.f16SharedOk=l,this.qSharedOk=d,this.qShared2Ok=p,q}destroy(){try{this.profiler?.destroy()}catch{}this.profiler=null;try{this.device?.destroy?.()}catch{}this.bufferPool.clear(),this.uniformPool.clear()}f16ToF32Gpu(r,t){let e=this.uploadGpuRawF16(r),n=this.device.createBuffer({size:t*4,usage:ie.STORAGE_USAGE}),s=this.uniformOf(16);return this.device.queue.writeBuffer(s,0,new Uint32Array([t])),this.dispatch("f16_to_f32",[s,e,n],this.grid1D(Math.ceil(t/2))),e.destroy?.(),this.release([s]),n}quantizeQ8Gpu(r){let t=r instanceof Float32Array?r.length:r.n;if(t%32!==0)return this.uploadGpu(r);let e=r instanceof Float32Array?this.buf(r,ie.STORAGE_USAGE):this.f16ToF32Gpu(r.f16,t),n=this.f32ToQ8Gpu(e,t);return e.destroy?.(),n}async validateResidentOps(){let r=globalThis,t=y=>Float32Array.from({length:y},()=>(Math.random()*2-1)*.5),e=(y,b,k=.005)=>y.length===b.length&&y.every((A,B)=>Math.abs(A-b[B])<=k*(1+Math.abs(b[B]))),n=4,s=4,i=4,a=4,o=2,u=1e-5,c=a*s*i,l=t(n*s*i),d=t(a*n*9),p=t(a),g=t(a),m=t(a),w=await this.silu(await this.groupNorm(await this.conv2dDirect(l,d,p,n,s,i,a,3,3,1,1),g,m,a,s*i,o,u)),v=[],x=this.device.createCommandEncoder(),q=this.uploadGpu(l),F=this.uploadGpu(d),R=this.uploadGpu(p),K=this.uploadGpu(g),P=this.uploadGpu(m);v.push(q,F,R,K,P);let G=this.recConv2dDirect(x,v,q,F,R,n,s,i,a,3,3,1,1);G=this.recGroupNorm(x,v,G,K,P,a,s*i,o,u),G=this.recUnary(x,v,"silu",G,c);let _=this.device.createBuffer({size:c*4,usage:r.GPUBufferUsage.COPY_DST|r.GPUBufferUsage.MAP_READ});x.copyBufferToBuffer(G,0,_,0,c*4),this.device.queue.submit([x.finish()]),await _.mapAsync(r.GPUMapMode.READ);let h=new Float32Array(_.getMappedRange().slice(0));return _.unmap(),_.destroy(),this.release(v),e(h,w)?null:"resident_ops"}recMatmulQ4(r,t,e,n,s,i,a){let o=this.uniform([s,i,a]),u=this.storage(s*a*4);if(s===1&&this.gemvOk){let c=this.gemvGrid(a);this.recordPass(r,"matmul_t_q4_vec",[this.uniform([s,i,a,c.stride]),e,n.nib,n.sc,n.mn,u],c.grid)}else if(s<=8&&this.gemvMOk&&i%32===0){let c=this.gemv4Grid(a);this.recordPass(r,"matmul_t_q4_vecm",[this.uniform([s,i,a,c.stride]),e,n.nib,n.sc,n.mn,u],c.grid)}else s>=64&&this.qSharedOk&&this.qShared2Ok?this.recordPass(r,"matmul_t_q4_shared2",[o,e,n.nib,n.sc,n.mn,u],[Math.ceil(a/128),Math.ceil(s/64),1]):s>=32&&this.qSharedOk?this.recordPass(r,"matmul_t_q4_shared",[o,e,n.nib,n.sc,n.mn,u],[Math.ceil(a/64),Math.ceil(s/32),1]):s>=2?this.recordPass(r,"matmul_t_q4_tiled",[o,e,n.nib,n.sc,n.mn,u],[Math.ceil(Math.ceil(s/4)/8),Math.ceil(a/8),1]):this.recordPass(r,"matmul_t_q4",[o,e,n.nib,n.sc,n.mn,u],[Math.ceil(s/8),Math.ceil(a/8),1]);return t.push(o,u),u}recMatmulQ8(r,t,e,n,s,i,a){let o=this.uniform([s,i,a]),u=this.storage(s*a*4);if(s===1&&this.gemvOk){let c=this.gemvGrid(a);this.recordPass(r,"matmul_t_q8_vec",[this.uniform([s,i,a,c.stride]),e,n.codes,n.sc,u],c.grid)}else if(s===2&&this.gemvMOk&&i%32===0){let c=this.gemvGrid(a);this.recordPass(r,"matmul_t_q8_vec2",[this.uniform([s,i,a,c.stride]),e,n.codes,n.sc,u],c.grid)}else if(s<=8&&this.gemvMOk&&i%32===0){let c=this.gemv4Grid(a);this.recordPass(r,"matmul_t_q8_vecm",[this.uniform([s,i,a,c.stride]),e,n.codes,n.sc,u],c.grid)}else s>=64&&this.qSharedOk&&this.qShared2Ok?this.recordPass(r,"matmul_t_q8_shared2",[o,e,n.codes,n.sc,u],[Math.ceil(a/128),Math.ceil(s/64),1]):s>=32&&this.qSharedOk?this.recordPass(r,"matmul_t_q8_shared",[o,e,n.codes,n.sc,u],[Math.ceil(a/64),Math.ceil(s/32),1]):s>=2?this.recordPass(r,"matmul_t_q8_tiled",[o,e,n.codes,n.sc,u],[Math.ceil(Math.ceil(s/4)/8),Math.ceil(a/8),1]):this.recordPass(r,"matmul_t_q8",[o,e,n.codes,n.sc,u],[Math.ceil(s/8),Math.ceil(a/8),1]);return t.push(o,u),u}uploadKq(r,t){let e=Math.ceil(t.byteLength/4)*4,n=this.device.createBuffer({size:e,usage:ie.STORAGE_USAGE});if(e===t.byteLength)this.device.queue.writeBuffer(n,0,t);else{let s=new Uint8Array(e);s.set(t),this.device.queue.writeBuffer(n,0,s)}return{kq:r,buf:n}}recMatmulKq(r,t,e,n,s,i,a){if(s===1){let w=this.gemvGrid(a),v=this.storage(a*4),x=this.uniform([1,i,a,w.stride]);return this.recordPass(r,n.kq==="Q4_K"?"matmul_t_q4k_vec":"matmul_t_q6k_vec",[x,e,n.buf,v],w.grid),t.push(x,v),v}if(s===2&&n.kq==="Q4_K"&&this.gemvMOk){let w=this.gemvGrid(a),v=this.storage(2*a*4),x=this.uniform([2,i,a,w.stride]);return this.recordPass(r,"matmul_t_q4k_vec2",[x,e,n.buf,v],w.grid),t.push(x,v),v}if(s<=8&&n.kq==="Q4_K"&&this.gemvMOk){let w=this.gemv4Grid(a),v=this.storage(s*a*4),x=this.uniform([s,i,a,w.stride]);return this.recordPass(r,"matmul_t_q4k_vecm",[x,e,n.buf,v],w.grid),t.push(x,v),v}let o=i*a,u=o/256,c=o/32,{f32:l,codes:d,sc:p}=this.kqScratchFor(o,t),g=this.uniform([u]);this.recordPass(r,ie.DEQUANT_SHADER[n.kq],[g,n.buf,l],this.grid1D(u)),r.clearBuffer(p,0,Math.ceil(c/2)*4);let m=this.uniform([c]);return this.recordPass(r,"quantize_q8",[m,l,d,p],this.grid1D(c)),t.push(g,m),this.recMatmulQ8(r,t,e,{codes:d,sc:p},s,i,a)}kqScratchFor(r,t){if(this.kqScratch&&this.kqScratch.cap>=r)return this.kqScratch;this.kqScratch&&t.push(this.kqScratch.f32,this.kqScratch.codes,this.kqScratch.sc);let e=n=>this.device.createBuffer({size:n,usage:ie.STORAGE_USAGE});return this.kqScratch={f32:e(r*4),codes:e(r),sc:e(Math.ceil(r/64)*4),cap:r},this.kqScratch}gemv4Grid(r){return this.gemvGrid(Math.ceil(r/4))}gemvGrid(r){return r<=32768?{grid:[r,1,1],stride:32768}:{grid:[32768,Math.ceil(r/32768),1],stride:32768}}async matmulQ4Vec(r,t,e,n,s,i){let a=globalThis,o=a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST,u=this.gemvGrid(i),c=this.device.createBuffer({size:16,usage:a.GPUBufferUsage.UNIFORM|a.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(c,0,new Uint32Array([1,s,i,u.stride]));let l=this.device.createBuffer({size:i*4,usage:o|a.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q4_vec",[c,this.buf(r,o),t,e,n,l],u.grid,l,i*4)}async matmulQ8Vec(r,t,e,n,s){let i=globalThis,a=i.GPUBufferUsage.STORAGE|i.GPUBufferUsage.COPY_DST,o=this.gemvGrid(s),u=this.device.createBuffer({size:16,usage:i.GPUBufferUsage.UNIFORM|i.GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([1,n,s,o.stride]));let c=this.device.createBuffer({size:s*4,usage:a|i.GPUBufferUsage.COPY_SRC});return this.run("matmul_t_q8_vec",[u,this.buf(r,a),t,e,c],o.grid,c,s*4)}recMatmulQ3(r,t,e,n,s,i,a){let o=this.uniform([s,i,a]),u=this.storage(s*a*4);return this.recordPass(r,"matmul_t_q3",[o,e,n.lo,n.hi,n.sc,n.mn,u],[Math.ceil(s/8),Math.ceil(a/8),1]),t.push(o,u),u}recMM(r,t,e,n,s,i,a,o){return n&&n.kq?this.recMatmulKq(r,t,e,n,s,i,a):n&&n.q3?this.recMatmulQ3(r,t,e,n,s,i,a):n&&n.nib?this.recMatmulQ4(r,t,e,n,s,i,a):n&&n.codes?this.recMatmulQ8(r,t,e,n,s,i,a):this.recMatmulT(r,t,e,n,s,i,a,o)}recRmsnorm(r,t,e,n,s,i,a,o=!1){let u=this.uniform([s,i,0,o?1:0],{offset:8,value:a}),c=this.storage(s*i*4);if(this.rmsVecOk&&s<=65535){let l=this.hasSubgroups&&this.subgroupsOk?"rmsnorm_vec_subgroup":"rmsnorm_vec";this.recordPass(r,l,[u,e,n,c],[s,1,1])}else this.recordPass(r,"rmsnorm",[u,e,n,c],[Math.ceil(s/ce),1,1]);return t.push(u,c),c}recRope(r,t,e,n,s,i,a,o,u=!1){let c=this.uniform([n,s,i,a],{offset:16,value:o});this.device.queue.writeBuffer(c,20,new Uint32Array([u?1:0]));let l=this.storage(n*s*4);return this.recordPass(r,"rope",[c,e,l],[Math.ceil(n/ce),1,1]),t.push(c,l),l}recRopeMrope(r,t,e,n,s,i,a,o,u){let c=u[0],l=u[0]+u[1],d=this.uniform([s,i,a,c,l],{offset:20,value:o}),p=this.storage(s*i*4);return this.recordPass(r,"rope_mrope",[d,e,n,p],[Math.ceil(s/ce),1,1]),t.push(d,p),p}preparePositions(r,t){if(r.positions&&r.mropeSections){let e=this.storage(r.positions.byteLength);this.device.queue.writeBuffer(e,0,r.positions),t.push(e),r._posGpu=e}if(r.ropeFactors){let e=this.storage(r.ropeFactors.byteLength);this.device.queue.writeBuffer(e,0,r.ropeFactors),t.push(e),r._ffGpu=e}}recRope2d(r,t,e,n,s,i,a,o){let u=this.uniform([s,i,a,0],{offset:16,value:o}),c=this.storage(s*i*4);return this.recordPass(r,"rope_2d",[u,e,n,c],[Math.ceil(s/ce),1,1]),t.push(u,c),c}recRopeFactors(r,t,e,n,s,i,a,o,u,c=!1){let l=this.uniform([s,i,a,o],{offset:16,value:u});this.device.queue.writeBuffer(l,20,new Uint32Array([c?1:0]));let d=this.storage(s*i*4);return this.recordPass(r,"rope_factors",[l,e,n,d],[Math.ceil(s/ce),1,1]),t.push(l,d),d}recAttention(r,t,e,n,s,i,a,o,u,c,l,d,p=0,g=0){let m=this.attnUniform(i,a,o,u,c,l,d??1/Math.sqrt(u),p,g),w=this.storage(i*a*u*4);return this.attnDecodeOk&&i*a<256&&u<=128?this.recordPass(r,"attention_decode",[m,e,n,s,w],[i*a,1,1]):this.attnPrefillOk&&u<=128?this.recordPass(r,"attention_prefill",[m,e,n,s,w],[Math.ceil(i/4)*a,1,1]):this.attnWideOk&&u>128&&u<=512&&u%4===0&&i*a<=ie.MAX_WG_DIM?this.recordPass(r,"attention_wide",[m,e,n,s,w],[i*a,1,1]):this.recordPass(r,"attention",[m,e,n,s,w],[Math.ceil(i*a/ce),1,1]),t.push(m,w),w}recQuantizeKv(r,t,e,n,s,i,a,o,u){let c=this.uniform([i,a,o,u]);this.recordPass(r,"quantize_kv",[c,e,n,s],this.grid1D(i*a)),t.push(c)}recAttentionQ8(r,t,e,n,s,i,a,o,u,c,l,d,p,g,m=0,w=0){let v=this.attnUniform(o,u,c,l,d,p,g??1/Math.sqrt(l),m,w),x=this.storage(o*u*l*4);return this.attnDecodeOk&&o*u<256&&l<=128?this.recordPass(r,"attention_decode_q8kv",[v,e,n,s,i,a,x],[o*u,1,1]):this.attnPrefillOk&&l<=128?this.recordPass(r,"attention_prefill_q8kv",[v,e,n,s,i,a,x],[Math.ceil(o/4)*u,1,1]):this.recordPass(r,"attention_q8kv",[v,e,n,s,i,a,x],[Math.ceil(o*u/ce),1,1]),t.push(v,x),x}recAddBias(r,t,e,n,s,i){let a=this.uniform([s,i]),o=this.storage(s*i*4);return this.recordPass(r,"addbias",[a,e,n,o],this.grid1D(s*i)),t.push(a,o),o}recBinary(r,t,e,n,s,i){let a=this.storage(i*4);return this.recordPass(r,e,[n,s,a],this.grid1D(i)),t.push(a),a}snapOrDummy(r){return r||(this.dummySnap||(this.dummySnap=this.device.createBuffer({size:16,usage:ie.STORAGE_USAGE})),this.dummySnap)}recQwen35Conv(r,t,e,n,s,i,a,o,u=4294967295){let c=this.uniform([i,a,o?u:4294967295]),l=this.storage(i*a*4);return this.recordPass(r,"qwen35_conv_batch",[c,e,n,s,l,this.snapOrDummy(o)],this.grid1D(a)),t.push(c,l),l}recQwen35Gdn(r,t,e,n,s,i,a,o,u,c,l,d,p,g,m,w,v,x=4294967295){let q=this.uniformOf(48);this.device.queue.writeBuffer(q,0,new Uint32Array([u,c,l,d,p,g,m])),this.device.queue.writeBuffer(q,28,new Float32Array([w])),this.device.queue.writeBuffer(q,32,new Uint32Array([v?x:4294967295]));let F=this.storage(u*c*d*4);return this.recordPass(r,"qwen35_gdn_batch",[q,e,n,s,i,a,o,F,this.snapOrDummy(v)],[c,1,1]),t.push(q,F),F}recRopePartial(r,t,e,n,s,i,a,o,u){let c=this.uniform([n,s,i,a],{offset:16,value:o});this.device.queue.writeBuffer(c,20,new Uint32Array([u]));let l=this.storage(n*s*4);return this.recordPass(r,"rope_partial",[c,e,l],[Math.ceil(n/ce),1,1]),t.push(c,l),l}recRmsnormGrouped(r,t,e,n,s,i,a,o){let u=this.uniform([s,i,a],{offset:12,value:o}),c=this.storage(s*i*4);return this.recordPass(r,"rmsnorm_grouped",[u,e,n,c],[s*a,1,1]),t.push(u,c),c}recMoeRoute(r,t,e,n,s,i,a=1){if(i>16)throw new Error(`MoE : K = ${i} > 16 non g\xE9r\xE9 par moe_route`);let o=this.uniform([n,s,i],{offset:12,value:a}),u=this.storage(n*i*4),c=this.storage(n*i*4);return this.recordPass(r,"moe_route",[o,e,u,c],[Math.ceil(n/64),1,1]),t.push(o,u,c),{ids:u,w:c}}recMoeGemv(r,t,e,n,s,i,a,o,u){let c=this.gemvGrid(u),l=this.storage(i*u*4),d=this.uniform([a,o,u,c.stride]);return this.recordPass(r,n.kq==="Q4_K"?"moe_q4k_vec":"moe_q6k_vec",[d,e,n.buf,l,s],[c.grid[0],c.grid[1],i]),t.push(d,l),l}recMoeGroup(r,t,e,n,s){if(s>512)throw new Error(`MoE : E = ${s} > 512 non g\xE9r\xE9 par moe_group`);let i=this.uniform([n,s]),a=this.storage(n*4),o=this.storage((s+1)*4);return this.recordPass(r,"moe_group",[i,e,a,o],[1,1,1]),t.push(i,a,o),{perm:a,off:o}}recMoeGemm(r,t,e,n,s,i,a,o,u,c,l){let d=this.storage(i*l*4),p=this.uniform([i,c,l,u]);return this.recordPass(r,n.kq==="Q4_K"?"moe_q4k_grouped":"moe_q6k_grouped",[p,e,n.buf,d,s.perm,s.off],[Math.ceil(l/64),Math.ceil(o/32),a]),t.push(p,d),d}recMoeSum(r,t,e,n,s,i,a){let o=this.uniform([s,i,a]),u=this.storage(s*a*4);return this.recordPass(r,"moe_sum",[o,e,n,u],this.grid1D(s*a)),t.push(o,u),u}recHeadGate(r,t,e,n,s,i){let a=this.uniform([s,i]),o=this.storage(s*4);return this.recordPass(r,"head_gate",[a,e,n,o],this.grid1D(s)),t.push(a,o),o}recScale(r,t,e,n,s){let i=this.uniform([s],{offset:4,value:n}),a=this.storage(s*4);return this.recordPass(r,"scale",[i,e,a],this.grid1D(s)),t.push(i,a),a}recLfm2ShortConv(r,t,e,n,s,i,a){let o=this.uniform([i,a]),u=this.storage(i*4);return this.recordPass(r,"lfm2_shortconv",[o,e,s,n,u],this.grid1D(i)),t.push(o,u),u}recordLayerKV(r,t,e,n,s,i,a){let o=a.k,u=a.v,{seq:c,d:l,nHeads:d,nKvHeads:p,headDim:g,ffn:m,ropeTheta:w,eps:v}=n,x=p*g,q=i+c,F=s.matF16===!0,R=d*g,K=n.rmsGainOnePlus===!0,P=n.attnLogitSoftcap??0,G=n.act==="gelu"?"geglu":"swiglu",_=this.recRmsnorm(r,t,e,s.attnNorm,c,l,v,K),h=this.recMM(r,t,_,s.wq,c,l,R,F),y=this.recMM(r,t,_,s.wk,c,l,x,F),b=this.recMM(r,t,_,s.wv,c,l,x,F);s.bq&&(h=this.recAddBias(r,t,h,s.bq,c,R)),s.bk&&(y=this.recAddBias(r,t,y,s.bk,c,x)),s.bv&&(b=this.recAddBias(r,t,b,s.bv,c,x)),s.qNorm&&(h=this.recRmsnorm(r,t,h,s.qNorm,c*d,g,v,K)),s.kNorm&&(y=this.recRmsnorm(r,t,y,s.kNorm,c*p,g,v,K));let k=n._posGpu,A=n._ffGpu,B=n.ropeInterleaved===!0,U=(D,C,j)=>n.skipRope?D:k?this.recRopeMrope(r,t,D,k,C,g,j,w,n.mropeSections):A?this.recRopeFactors(r,t,D,A,C,g,j,i,w,B):this.recRope(r,t,D,C,g,j,i,w,B),M=U(h,c*d,d),O=U(y,c*p,p),T;if(a.kScale)this.recQuantizeKv(r,t,O,o,a.kScale,c,p,g,i),this.recQuantizeKv(r,t,b,u,a.vScale,c,p,g,i),T=this.recAttentionQ8(r,t,M,o,a.kScale,u,a.vScale,c,d,p,g,q,i,n.attnScale,P,n.window??0);else{let D=x*4;r.copyBufferToBuffer(O,0,o,i*D,c*D),r.copyBufferToBuffer(b,0,u,i*D,c*D),T=this.recAttention(r,t,M,o,u,c,d,p,g,q,i,n.attnScale,P,n.window??0)}let S=this.recMM(r,t,T,s.wo,c,R,l,F);s.postAttnNorm&&(S=this.recRmsnorm(r,t,S,s.postAttnNorm,c,l,v,K));let L=this.recBinary(r,t,"add",e,S,c*l),E=this.recRmsnorm(r,t,L,s.ffnNorm,c,l,v,K),Q=this.recMM(r,t,E,s.wgate,c,l,m,F),H=this.recMM(r,t,E,s.wup,c,l,m,F),W=this.recBinary(r,t,G,Q,H,c*m),$=this.recMM(r,t,W,s.wdown,c,m,l,F);return s.postFfnNorm&&($=this.recRmsnorm(r,t,$,s.postFfnNorm,c,l,v,K)),this.recBinary(r,t,"add",L,$,c*l)}setKvQuant(r){this.kvQuant!==r&&(this.kvQuant=r,this.resetKvGpu())}resetKvGpu(){for(let r of this.kvGpu.values())r.k.destroy?.(),r.v.destroy?.(),r.kScale?.destroy?.(),r.vScale?.destroy?.();this.kvGpu.clear(),this.kvSession="";for(let r of this.bufferPool.values())for(let t of r)t.destroy?.();this.bufferPool.clear()}clearKvCache(){this.resetKvGpu()}ensureKv(r,t,e,n){let s=this.kvGpu.get(r);if(s&&s.cap>=t)return s;let i=Math.max(t,(s?.cap??0)+1024,1024),a=this.kvQuant,o=this.storage(i*e*(a?1:4)),u=this.storage(i*e*(a?1:4)),c=a?this.storage(i*n*4):void 0,l=a?this.storage(i*n*4):void 0;if(s){let p=this.device.createCommandEncoder();p.copyBufferToBuffer(s.k,0,o,0,s.cap*e*(a?1:4)),p.copyBufferToBuffer(s.v,0,u,0,s.cap*e*(a?1:4)),a&&s.kScale&&(p.copyBufferToBuffer(s.kScale,0,c,0,s.cap*n*4),p.copyBufferToBuffer(s.vScale,0,l,0,s.cap*n*4)),this.device.queue.submit([p.finish()]),s.k.destroy?.(),s.v.destroy?.(),s.kScale?.destroy?.(),s.vScale?.destroy?.()}let d={k:o,v:u,cap:i,kScale:c,vScale:l};return this.kvGpu.set(r,d),d}async runDecodeGpu(r,t,e,n,s,i){let{seq:a,d:o,nKvHeads:u,headDim:c,eps:l}=t,d=u*c,p=n+a;(i!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${i}" inconnue avec pastLen=${n} : cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=i);for(let F=0;F<e.length;F++)this.ensureKv(F,p,d,u);let g=[];this.preparePositions(t,g);let m=this.device.createCommandEncoder(),w=this.storage(r.byteLength);this.device.queue.writeBuffer(w,0,r),g.push(w);for(let F=0;F<e.length;F++){let R=this.kvGpu.get(F);w=this.recordLayerKV(m,g,w,Kt(t,a,F,this.swaOk),e[F],n,R)}let v=this.recRmsnorm(m,g,w,s,a,o,l,t.rmsGainOnePlus===!0),x=this.storage(o*4);m.copyBufferToBuffer(v,(a-1)*o*4,x,0,o*4),this.device.queue.submit([m.finish()]);let q=await this.readBack(x,o*4);return g.push(x),this.release(g),q}async decodeLogitsQ8(r,t,e,n,s,i,a,o){let u=globalThis,{seq:c,d:l,nKvHeads:d,headDim:p,eps:g}=t,m=d*p,w=n+c;(i!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${i}" inconnue avec pastLen=${n} : cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=i);for(let _=0;_<e.length;_++)this.ensureKv(_,w,m,d);let v=[];this.preparePositions(t,v);let x=this.device.createCommandEncoder(),q=this.storage(r.byteLength);this.device.queue.writeBuffer(q,0,r),v.push(q);for(let _=0;_<e.length;_++){let h=this.kvGpu.get(_);q=this.recordLayerKV(x,v,q,Kt(t,c,_,this.swaOk),e[_],n,h)}let F=this.recRmsnorm(x,v,q,s,c,l,g,t.rmsGainOnePlus===!0),R=this.storage(l*4);x.copyBufferToBuffer(F,(c-1)*l*4,R,0,l*4),v.push(R);let K=this.storage(o*4);v.push(K);for(let _ of a){let h=this.recMM(x,v,R,_.w,1,l,_.rows,!1);x.copyBufferToBuffer(h,0,K,_.r0*4,_.rows*4)}let P=this.device.createBuffer({size:o*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});x.copyBufferToBuffer(K,0,P,0,o*4),this.device.queue.submit([x.finish()]),await P.mapAsync(u.GPUMapMode.READ);let G=new Float32Array(P.getMappedRange().slice(0));return P.unmap(),P.destroy(),this.release(v),G}async decodeTopKQ8(r,t,e,n,s,i,a,o,u,c,l,d=64){let p=globalThis,{seq:g,d:m,nKvHeads:w,headDim:v,eps:x}=t,q=w*v,F=n+g;(i!==this.kvSession||n===0)&&(n>0&&console.error(`[kv] session "${i}" inconnue avec pastLen=${n} : cache perdu, sortie invalide. Le caller doit repartir de pastLen 0.`),this.resetKvGpu(),this.kvSession=i);for(let U=0;U<e.length;U++)this.ensureKv(U,F,q,w);let R=ie.timingOn?(U,M)=>console.info(`[timing:gpu] ${U} ${(performance.now()-M).toFixed(0)} ms`):null,K=performance.now(),P=[];this.preparePositions(t,P);let G=this.device.createCommandEncoder(),_=this.storage(r.byteLength);this.device.queue.writeBuffer(_,0,r),P.push(_);for(let U=0;U<e.length;U++){let M=this.kvGpu.get(U);_=this.recordLayerKV(G,P,_,Kt(t,g,U,this.swaOk),e[U],n,M)}let h=this.recRmsnorm(G,P,_,s,g,m,x,t.rmsGainOnePlus===!0),y=this.storage(m*4);G.copyBufferToBuffer(h,(g-1)*m*4,y,0,m*4),P.push(y);let b=this.storage(o*4);P.push(b);for(let U of a){let M=this.recMM(G,P,y,U.w,1,m,U.rows,!1);G.copyBufferToBuffer(M,0,b,U.r0*4,U.rows*4)}if(l&&l>0){let U=this.uniform([o],{offset:4,value:l});this.recordPass(G,"softcap_logits",[U,b],this.grid1D(o)),P.push(U)}if(c&&c!==1&&u.length){let U=Uint32Array.from(u),M=this.bufU32(U,p.GPUBufferUsage.STORAGE|p.GPUBufferUsage.COPY_DST),O=this.uniform([U.length],{offset:4,value:c});this.recordPass(G,"penalize_logits",[O,M,b],this.grid1D(U.length)),P.push(O,M)}let k=this.storage(d*2*4);P.push(k);{let U=this.uniform([o,d]);this.recordPass(G,this.topKParOk?"top_k_par":"top_k",[U,b,k],[1,1,1]),P.push(U)}let A=this.device.createBuffer({size:d*2*4,usage:p.GPUBufferUsage.COPY_DST|p.GPUBufferUsage.MAP_READ});G.copyBufferToBuffer(k,0,A,0,d*2*4),R?.("enregistrement des passes (compilation des pipelines incluse)",K),K=performance.now(),this.device.queue.submit([G.finish()]),await A.mapAsync(p.GPUMapMode.READ),R?.("execution GPU (submit + readback)",K);let B=new Uint32Array(A.getMappedRange().slice(0));return A.unmap(),A.destroy(),this.release(P),{ids:B.slice(0,d),vals:new Float32Array(B.buffer,d*4,d)}}useKvContext(r){r!==this.kvCtxId&&(this.kvStore.set(this.kvCtxId,this.kvGpu),this.kvGpu=this.kvStore.get(r)??new Map,this.kvStore.delete(r),this.kvCtxId=r,this.kvSession=r)}dropKvContexts(){this.useKvContext("");for(let r of this.kvStore.values())for(let t of r.values())t.k.destroy?.(),t.v.destroy?.(),t.kScale?.destroy?.(),t.vScale?.destroy?.();this.kvStore.clear()}kvMapFor(r){if(r===this.kvCtxId)return this.kvGpu;let t=this.kvStore.get(r);return t||(t=new Map,this.kvStore.set(r,t)),t}ensureKvIn(r,t,e,n){let s=r.get(t);if(s&&s.cap>=e)return s;let i=Math.max(e,(s?.cap??0)+1024,1024),a=this.storage(i*n*4),o=this.storage(i*n*4);if(s){let c=this.device.createCommandEncoder();c.copyBufferToBuffer(s.k,0,a,0,s.cap*n*4),c.copyBufferToBuffer(s.v,0,o,0,s.cap*n*4),this.device.queue.submit([c.finish()]),s.k.destroy?.(),s.v.destroy?.()}let u={k:a,v:o,cap:i};return r.set(t,u),u}recordLayerBatch(r,t,e,n,s,i,a){let o=a.length,{d:u,nHeads:c,nKvHeads:l,headDim:d,ffn:p,ropeTheta:g,eps:m}=n,w=l*d,v=c*d,x=s.matF16===!0,q=n.rmsGainOnePlus===!0,F=n.attnLogitSoftcap??0,R=n.act==="gelu"?"geglu":"swiglu",K=this.recRmsnorm(r,t,e,s.attnNorm,o,u,m,q),P=this.recMM(r,t,K,s.wq,o,u,v,x),G=this.recMM(r,t,K,s.wk,o,u,w,x),_=this.recMM(r,t,K,s.wv,o,u,w,x);s.bq&&(P=this.recAddBias(r,t,P,s.bq,o,v)),s.bk&&(G=this.recAddBias(r,t,G,s.bk,o,w)),s.bv&&(_=this.recAddBias(r,t,_,s.bv,o,w)),s.qNorm&&(P=this.recRmsnorm(r,t,P,s.qNorm,o*c,d,m,q)),s.kNorm&&(G=this.recRmsnorm(r,t,G,s.kNorm,o*l,d,m,q));let h=n._ffGpu,y=n.ropeInterleaved===!0,b=(T,S,L)=>n.skipRope?T:h?this.recRopeFactors(r,t,T,h,S,d,S,L,g,y):this.recRope(r,t,T,S,d,S,L,g,y),k=this.storage(o*v*4);t.push(k);for(let T=0;T<o;T++){let S=a[T].pastLen,L=this.ensureKvIn(a[T].kv,i,S+1,w),E=this.storage(v*4),Q=this.storage(w*4);t.push(E,Q),r.copyBufferToBuffer(P,T*v*4,E,0,v*4),r.copyBufferToBuffer(G,T*w*4,Q,0,w*4);let H=b(E,c,S);r.copyBufferToBuffer(b(Q,l,S),0,L.k,S*w*4,w*4),r.copyBufferToBuffer(_,T*w*4,L.v,S*w*4,w*4);let W=this.recAttention(r,t,H,L.k,L.v,1,c,l,d,S+1,S,n.attnScale,F,n.window??0);r.copyBufferToBuffer(W,0,k,T*v*4,v*4)}let A=this.recMM(r,t,k,s.wo,o,v,u,x);s.postAttnNorm&&(A=this.recRmsnorm(r,t,A,s.postAttnNorm,o,u,m,q));let B=this.recBinary(r,t,"add",e,A,o*u),U=this.recRmsnorm(r,t,B,s.ffnNorm,o,u,m,q),M=this.recBinary(r,t,R,this.recMM(r,t,U,s.wgate,o,u,p,x),this.recMM(r,t,U,s.wup,o,u,p,x),o*p),O=this.recMM(r,t,M,s.wdown,o,p,u,x);return s.postFfnNorm&&(O=this.recRmsnorm(r,t,O,s.postFfnNorm,o,u,m,q)),this.recBinary(r,t,"add",B,O,o*u)}async decodeTopKBatch(r,t,e,n,s,i,a,o,u,c,l,d=64){let p=globalThis,g=n.length,{d:m,eps:w}=t;if(t.mropeSections)throw new Error("decodeTopKBatch : M-RoPE non g\xE9r\xE9 (vision)");let v=n.map((h,y)=>({kv:this.kvMapFor(h),pastLen:s[y]})),x=[];this.preparePositions(t,x);let q=this.device.createCommandEncoder(),F=this.storage(r.byteLength);x.push(F),this.device.queue.writeBuffer(F,0,r);for(let h=0;h<e.length;h++)F=this.recordLayerBatch(q,x,F,Kt(t,g,h,this.swaOk),e[h],h,v);let R=this.recRmsnorm(q,x,F,i,g,m,w,t.rmsGainOnePlus===!0),K=this.storage(g*o*4);x.push(K);for(let h of a){let y=this.recMM(q,x,R,h.w,g,m,h.rows,!1);for(let b=0;b<g;b++)q.copyBufferToBuffer(y,b*h.rows*4,K,(b*o+h.r0)*4,h.rows*4)}let P=[];for(let h=0;h<g;h++){let y=this.storage(o*4);if(x.push(y),q.copyBufferToBuffer(K,h*o*4,y,0,o*4),l&&l>0){let A=this.uniform([o],{offset:4,value:l});this.recordPass(q,"softcap_logits",[A,y],this.grid1D(o)),x.push(A)}if(c&&c!==1&&u[h]?.length){let A=Uint32Array.from(u[h]),B=this.bufU32(A,p.GPUBufferUsage.STORAGE|p.GPUBufferUsage.COPY_DST),U=this.uniform([A.length],{offset:4,value:c});this.recordPass(q,"penalize_logits",[U,B,y],this.grid1D(A.length)),x.push(U,B)}let b=this.storage(d*8);x.push(b);let k=this.uniform([o,d]);x.push(k),this.recordPass(q,this.topKParOk?"top_k_par":"top_k",[k,y,b],[1,1,1]),P.push(b)}let G=this.device.createBuffer({size:g*d*8,usage:p.GPUBufferUsage.COPY_DST|p.GPUBufferUsage.MAP_READ});P.forEach((h,y)=>q.copyBufferToBuffer(h,0,G,y*d*8,d*8)),this.device.queue.submit([q.finish()]),await G.mapAsync(p.GPUMapMode.READ);let _=new Uint32Array(G.getMappedRange().slice(0));return G.unmap(),G.destroy(),this.release(x),P.map((h,y)=>({ids:_.slice(y*2*d,y*2*d+d),vals:new Float32Array(_.buffer,(y*2*d+d)*4,d)}))}resetLfm2State(){for(let r of this.lfm2KvGpu.values())r.k.destroy?.(),r.v.destroy?.();for(let r of this.lfm2ConvGpu.values())r.destroy?.();this.lfm2KvGpu.clear(),this.lfm2ConvGpu.clear(),this.lfm2Session="";for(let r of this.bufferPool.values())for(let t of r)t.destroy?.();this.bufferPool.clear()}clearLfm2State(){this.resetLfm2State()}ensureLfm2Kv(r,t,e){let n=this.lfm2KvGpu.get(r);if(n&&n.cap>=t)return n;let s=Math.max(t,(n?.cap??0)+1024,1024),i=this.storage(s*e*4),a=this.storage(s*e*4);if(n){let u=this.device.createCommandEncoder();u.copyBufferToBuffer(n.k,0,i,0,n.cap*e*4),u.copyBufferToBuffer(n.v,0,a,0,n.cap*e*4),this.device.queue.submit([u.finish()]),n.k.destroy?.(),n.v.destroy?.()}let o={k:i,v:a,cap:s};return this.lfm2KvGpu.set(r,o),o}ensureLfm2Conv(r,t){let e=this.lfm2ConvGpu.get(r);return e||(e=this.storage(t*4),this.device.queue.writeBuffer(e,0,new Float32Array(t)),this.lfm2ConvGpu.set(r,e)),e}recLfm2ShortConvBatch(r,t,e,n,s,i,a,o){let u=this.uniform([i,a,o]),c=this.storage(o*i*4);this.recordPass(r,"lfm2_shortconv_batch",[u,e,s,n,c],this.grid1D(o*i));let l=this.uniform([i,a,o]);return this.recordPass(r,"lfm2_shortconv_state",[l,e,n],this.grid1D((a-1)*i)),t.push(u,l,c),c}recordLfm2(r,t,e,n,s,i,a,o){let{D:u,nHeads:c,nKvHeads:l,headDim:d,ffn:p,eps:g,theta:m,lc:w}=s,v=l*d,x=c*d,q=v*4;for(let R=0;R<i.length;R++)i[R].conv?this.ensureLfm2Conv(R,(w-1)*u):this.ensureLfm2Kv(R,o+n,v);if(n>=w-1&&this.lfm2BatchOk){let R=this.storage(n*u*4);this.device.queue.writeBuffer(R,0,e),t.push(R);for(let P=0;P<i.length;P++){let G=i[P],_=this.recRmsnorm(r,t,R,G.attnNorm,n,u,g),h;if(G.conv){let U=this.recMM(r,t,_,G.inProj,n,u,3*u,!1),M=this.recLfm2ShortConvBatch(r,t,U,this.lfm2ConvGpu.get(P),G.convW,u,w,n);h=this.recMM(r,t,M,G.outProj,n,u,u,!1)}else{let U=this.recMM(r,t,_,G.wq,n,u,x,!1),M=this.recMM(r,t,_,G.wk,n,u,v,!1),O=this.recMM(r,t,_,G.wv,n,u,v,!1);U=this.recRmsnorm(r,t,U,G.qNorm,n*c,d,g),M=this.recRmsnorm(r,t,M,G.kNorm,n*l,d,g),U=this.recRope(r,t,U,n*c,d,c,o,m),M=this.recRope(r,t,M,n*l,d,l,o,m);let T=this.lfm2KvGpu.get(P);r.copyBufferToBuffer(M,0,T.k,o*q,n*q),r.copyBufferToBuffer(O,0,T.v,o*q,n*q);let S=this.recAttention(r,t,U,T.k,T.v,n,c,l,d,o+n,o);h=this.recMM(r,t,S,G.wo,n,x,u,!1)}R=this.recBinary(r,t,"add",R,h,n*u);let y=this.recRmsnorm(r,t,R,G.ffnNorm,n,u,g),b=this.recMM(r,t,y,G.wgate,n,u,p,!1),k=this.recMM(r,t,y,G.wup,n,u,p,!1),A=this.recBinary(r,t,"swiglu",b,k,n*p),B=this.recMM(r,t,A,G.wdown,n,p,u,!1);R=this.recBinary(r,t,"add",R,B,n*u)}let K=this.storage(u*4);return t.push(K),r.copyBufferToBuffer(R,(n-1)*u*4,K,0,u*4),this.recRmsnorm(r,t,K,a,1,u,g)}let F=null;for(let R=0;R<n;R++){let K=o+R,P=this.storage(u*4);this.device.queue.writeBuffer(P,0,e.subarray(R*u,(R+1)*u)),t.push(P);for(let G=0;G<i.length;G++){let _=i[G],h=this.recRmsnorm(r,t,P,_.attnNorm,1,u,g),y;if(_.conv){let M=this.recMM(r,t,h,_.inProj,1,u,3*u,!1),O=this.recLfm2ShortConv(r,t,M,this.lfm2ConvGpu.get(G),_.convW,u,w);y=this.recMM(r,t,O,_.outProj,1,u,u,!1)}else{let M=this.recMM(r,t,h,_.wq,1,u,x,!1),O=this.recMM(r,t,h,_.wk,1,u,v,!1),T=this.recMM(r,t,h,_.wv,1,u,v,!1);M=this.recRmsnorm(r,t,M,_.qNorm,c,d,g),O=this.recRmsnorm(r,t,O,_.kNorm,l,d,g),M=this.recRope(r,t,M,c,d,c,K,m),O=this.recRope(r,t,O,l,d,l,K,m);let S=this.lfm2KvGpu.get(G);r.copyBufferToBuffer(O,0,S.k,K*q,q),r.copyBufferToBuffer(T,0,S.v,K*q,q);let L=this.recAttention(r,t,M,S.k,S.v,1,c,l,d,K+1,K);y=this.recMM(r,t,L,_.wo,1,x,u,!1)}P=this.recBinary(r,t,"add",P,y,u);let b=this.recRmsnorm(r,t,P,_.ffnNorm,1,u,g),k=this.recMM(r,t,b,_.wgate,1,u,p,!1),A=this.recMM(r,t,b,_.wup,1,u,p,!1),B=this.recBinary(r,t,"swiglu",k,A,p),U=this.recMM(r,t,B,_.wdown,1,p,u,!1);P=this.recBinary(r,t,"add",P,U,u)}R===n-1&&(F=this.recRmsnorm(r,t,P,a,1,u,g))}return F}lfm2SessionReset(r,t){(r!==this.lfm2Session||t===0)&&(t>0&&console.error(`[lfm2] session "${r}" inconnue avec pastLen=${t} : \xE9tat perdu, sortie invalide. Repartir de pastLen 0.`),this.resetLfm2State(),this.lfm2Session=r)}async lfm2PrefillGpu(r,t,e,n,s,i,a){this.lfm2SessionReset(a,i);let o=[],u=this.device.createCommandEncoder();this.recordLfm2(u,o,r,t,e,n,s,i),this.device.queue.submit([u.finish()]),await this.device.queue.onSubmittedWorkDone(),this.release(o)}async lfm2LogitsGpu(r,t,e,n,s,i,a,o){let u=globalThis;this.lfm2SessionReset(o,a);let c=[],l=this.device.createCommandEncoder(),d=this.recordLfm2(l,c,r,t,e,n,i,a),p=this.recMM(l,c,d,s,1,e.D,e.vocab,!1),g=this.device.createBuffer({size:e.vocab*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});l.copyBufferToBuffer(p,0,g,0,e.vocab*4),this.device.queue.submit([l.finish()]),await g.mapAsync(u.GPUMapMode.READ);let m=new Float32Array(g.getMappedRange().slice(0));return g.unmap(),g.destroy(),this.release(c),m}async lfm2TopKGpu(r,t,e,n,s,i,a,o,u,c,l=64){let d=globalThis;this.lfm2SessionReset(o,a);let p=[],g=this.device.createCommandEncoder(),m=this.recordLfm2(g,p,r,t,e,n,i,a),w=this.recMM(g,p,m,s,1,e.D,e.vocab,!1);if(c&&c!==1&&u.length){let F=Uint32Array.from(u),R=this.bufU32(F,d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST),K=this.uniform([F.length],{offset:4,value:c});this.recordPass(g,"penalize_logits",[K,R,w],this.grid1D(F.length)),p.push(K,R)}let v=this.storage(l*2*4);p.push(v);{let F=this.uniform([e.vocab,l]);this.recordPass(g,this.topKParOk?"top_k_par":"top_k",[F,w,v],[1,1,1]),p.push(F)}let x=this.device.createBuffer({size:l*2*4,usage:d.GPUBufferUsage.COPY_DST|d.GPUBufferUsage.MAP_READ});g.copyBufferToBuffer(v,0,x,0,l*2*4),this.device.queue.submit([g.finish()]),await x.mapAsync(d.GPUMapMode.READ);let q=new Uint32Array(x.getMappedRange().slice(0));return x.unmap(),x.destroy(),this.release(p),{ids:q.slice(0,l),vals:new Float32Array(q.buffer,l*4,l)}}resetRwkvState(){for(let r of this.rwkvStateGpu.values())r.S.destroy?.(),r.tm.destroy?.(),r.cm.destroy?.();this.rwkvStateGpu.clear(),this.rwkvVFirst?.destroy?.(),this.rwkvVFirst=null,this.rwkvSession="";for(let r of this.bufferPool.values())for(let t of r)t.destroy?.();this.bufferPool.clear()}clearRwkvState(){this.resetRwkvState()}ensureRwkvState(r,t,e,n){let s=this.rwkvStateGpu.get(r);if(!s){let i=this.storage(e*n*n*4),a=this.storage(t*4),o=this.storage(t*4);this.device.queue.writeBuffer(i,0,new Float32Array(e*n*n)),this.device.queue.writeBuffer(a,0,new Float32Array(t)),this.device.queue.writeBuffer(o,0,new Float32Array(t)),s={S:i,tm:a,cm:o},this.rwkvStateGpu.set(r,s)}return s}rwkvSessionReset(r,t){(r!==this.rwkvSession||t===0)&&(t>0&&console.error(`[rwkv] session "${r}" inconnue avec pastLen=${t} : \xE9tat perdu, sortie invalide. Repartir de pastLen 0.`),this.resetRwkvState(),this.rwkvSession=r)}recRwkvToken(r,t,e,n,s,i){let{D:a,H:o,NH:u}=n,c=1e-5,l=64e-5;for(let d=0;d<s.length;d++){let p=s[d],g=this.rwkvStateGpu.get(d),m=this.recLayernorm(r,t,e,p.attnNormW,p.attnNormB,1,a,c),w=this.storage(6*a*4);{let j=this.uniform([a]);this.recordPass(r,"rwkv_token_shift",[j,m,g.tm,p.lerpFused,w],this.grid1D(6*a)),t.push(j,w)}r.copyBufferToBuffer(m,0,g.tm,0,a*4);let v=j=>{let N=this.storage(a*4);return r.copyBufferToBuffer(w,j*a*4,N,0,a*4),t.push(N),N},x=v(0),q=v(1),F=v(2),R=v(3),K=v(4),P=v(5),G=this.recMM(r,t,x,p.R,1,a,a,!1),_=this.recMM(r,t,F,p.K,1,a,a,!1),h=this.recMM(r,t,R,p.V,1,a,a,!1),y=this.recUnary(r,t,"tanh_act",this.recMM(r,t,q,p.w1,1,a,p.rw,!1),p.rw),b=this.recMM(r,t,y,p.w2,1,p.rw,a,!1),k=this.storage(a*4);this.recordPass(r,"rwkv_decay",[p.w0,b,k],this.grid1D(a)),t.push(k);let A=this.recMM(r,t,this.recMM(r,t,K,p.a1,1,a,p.ra,!1),p.a2,1,p.ra,a,!1),B=this.storage(a*4);this.recordPass(r,"rwkv_bias_sigmoid",[p.a0,A,B],this.grid1D(a)),t.push(B);let U=this.recUnary(r,t,"sigmoid",this.recMM(r,t,P,p.g1,1,a,p.rg,!1),p.rg),M=this.recMM(r,t,U,p.g2,1,p.rg,a,!1);if(d===0)r.copyBufferToBuffer(h,0,i,0,a*4);else{let j=this.recMM(r,t,this.recMM(r,t,R,p.v1,1,a,p.rv,!1),p.v2,1,p.rv,a,!1);this.recordPass(r,"rwkv_vresid",[h,i,p.v0,j],this.grid1D(a))}let O=this.storage(a*4),T=this.storage(a*4),S=this.storage(a*4);{let j=this.uniform([u,o]);this.recordPass(r,"rwkv_kprep",[j,_,B,p.kk,p.ka,O,T,S],this.grid1D(u)),t.push(j,O,T,S)}let L=this.storage(a*4);{let j=this.uniform([u,o]);this.recordPass(r,"rwkv_wkv7",[j,G,k,O,h,T,S,g.S,L],this.grid1D(u*o)),t.push(j,L)}let E=this.storage(a*4);{let j=this.uniform([u,o],{offset:8,value:l});this.recordPass(r,"rwkv_out_gn",[j,L,G,O,p.rk,h,p.lnWB,E],this.grid1D(u)),t.push(j,E)}let Q=this.recBinary(r,t,"mul",E,M,a),H=this.recMM(r,t,Q,p.O,1,a,a,!1);e=this.recBinary(r,t,"add",e,H,a);let W=this.recLayernorm(r,t,e,p.attnNorm2W,p.attnNorm2B,1,a,c),$=this.storage(a*4);this.recordPass(r,"rwkv_lerp",[W,g.cm,p.lerpK,$],this.grid1D(a)),t.push($),r.copyBufferToBuffer(W,0,g.cm,0,a*4);let D=this.recUnary(r,t,"sqrelu",this.recMM(r,t,$,p.cmK,1,a,p.ffn,!1),p.ffn),C=this.recMM(r,t,D,p.cmV,1,p.ffn,a,!1);e=this.recBinary(r,t,"add",e,C,a)}return e}recordRwkv(r,t,e,n,s,i,a){let{D:o,H:u,NH:c}=s;for(let d=0;d<i.length;d++)this.ensureRwkvState(d,o,c,u);this.rwkvVFirst||(this.rwkvVFirst=this.storage(o*4));let l=null;for(let d=0;d<n;d++){let p=this.storage(o*4);this.device.queue.writeBuffer(p,0,e.subarray(d*o,(d+1)*o)),t.push(p);let g=this.recLayernorm(r,t,p,a.tokW,a.tokB,1,o,1e-5),m=this.recRwkvToken(r,t,g,s,i,this.rwkvVFirst);d===n-1&&(l=this.recLayernorm(r,t,m,a.outW,a.outB,1,o,1e-5))}return l}async rwkvPrefillGpu(r,t,e,n,s,i,a){this.rwkvSessionReset(a,i);let o=[],u=this.device.createCommandEncoder();this.recordRwkv(u,o,r,t,e,n,s),this.device.queue.submit([u.finish()]),await this.device.queue.onSubmittedWorkDone(),this.release(o)}async rwkvLogitsGpu(r,t,e,n,s,i,a,o){let u=globalThis;this.rwkvSessionReset(o,a);let c=[],l=this.device.createCommandEncoder(),d=this.recordRwkv(l,c,r,t,e,n,i),p=this.recMM(l,c,d,s,1,e.D,e.vocab,!1),g=this.device.createBuffer({size:e.vocab*4,usage:u.GPUBufferUsage.COPY_DST|u.GPUBufferUsage.MAP_READ});l.copyBufferToBuffer(p,0,g,0,e.vocab*4),this.device.queue.submit([l.finish()]),await g.mapAsync(u.GPUMapMode.READ);let m=new Float32Array(g.getMappedRange().slice(0));return g.unmap(),g.destroy(),this.release(c),m}async rwkvTopKGpu(r,t,e,n,s,i,a,o,u,c,l=64){let d=globalThis;this.rwkvSessionReset(o,a);let p=[],g=this.device.createCommandEncoder(),m=this.recordRwkv(g,p,r,t,e,n,i),w=this.recMM(g,p,m,s,1,e.D,e.vocab,!1);if(c&&c!==1&&u.length){let F=Uint32Array.from(u),R=this.bufU32(F,d.GPUBufferUsage.STORAGE|d.GPUBufferUsage.COPY_DST),K=this.uniform([F.length],{offset:4,value:c});this.recordPass(g,"penalize_logits",[K,R,w],this.grid1D(F.length)),p.push(K,R)}let v=this.storage(l*2*4);p.push(v);{let F=this.uniform([e.vocab,l]);this.recordPass(g,this.topKParOk?"top_k_par":"top_k",[F,w,v],[1,1,1]),p.push(F)}let x=this.device.createBuffer({size:l*2*4,usage:d.GPUBufferUsage.COPY_DST|d.GPUBufferUsage.MAP_READ});g.copyBufferToBuffer(v,0,x,0,l*2*4),this.device.queue.submit([g.finish()]),await x.mapAsync(d.GPUMapMode.READ);let q=new Uint32Array(x.getMappedRange().slice(0));return x.unmap(),x.destroy(),this.release(p),{ids:q.slice(0,l),vals:new Float32Array(q.buffer,l*4,l)}}async argmaxProjection(r,t,e,n,s=!1){let i=globalThis,a=[],o=this.device.createCommandEncoder(),u=this.storage(r.byteLength);this.device.queue.writeBuffer(u,0,r),a.push(u);let c=this.storage(n*4);a.push(c);for(let m of t){let w=this.recMatmulT(o,a,u,m.buf,1,e,m.rows,s);o.copyBufferToBuffer(w,0,c,m.r0*4,m.rows*4)}let l=this.storage(4),d=this.uniform([n]);a.push(l,d),this.recordPass(o,"argmax",[d,c,l],[1,1,1]);let p=this.device.createBuffer({size:4,usage:i.GPUBufferUsage.COPY_DST|i.GPUBufferUsage.MAP_READ});o.copyBufferToBuffer(l,0,p,0,4),this.device.queue.submit([o.finish()]),await p.mapAsync(i.GPUMapMode.READ);let g=new Uint32Array(p.getMappedRange().slice(0))[0];return p.unmap(),p.destroy(),this.release(a),g}async projectLogits(r,t,e,n,s=!1){let i=globalThis,a=[],o=this.device.createCommandEncoder(),u=this.storage(r.byteLength);this.device.queue.writeBuffer(u,0,r),a.push(u);let c=this.storage(n*4);a.push(c);for(let p of t){let g=this.recMatmulT(o,a,u,p.buf,1,e,p.rows,s);o.copyBufferToBuffer(g,0,c,p.r0*4,p.rows*4)}let l=this.device.createBuffer({size:n*4,usage:i.GPUBufferUsage.COPY_DST|i.GPUBufferUsage.MAP_READ});o.copyBufferToBuffer(c,0,l,0,n*4),this.device.queue.submit([o.finish()]),await l.mapAsync(i.GPUMapMode.READ);let d=new Float32Array(l.getMappedRange().slice(0));return l.unmap(),l.destroy(),this.release(a),d}async selfValidate(){this.validationFailure=null;let r=P=>(this.validationFailure=P,console.error("[selfValidate] FAILED at:",P,"(hasF16="+this.hasF16+")"),!1),t=(P,G)=>P.length===G.length&&P.every((_,h)=>Math.abs(_-G[h])<.001),e=P=>Float32Array.from({length:P},()=>Math.random()*2-1),n=3,s=4,i=5,a=e(n*s),o=e(s*i),u=new Float32Array(n*i);for(let P=0;P<n;P++)for(let G=0;G<i;G++){let _=0;for(let h=0;h<s;h++)_+=a[P*s+h]*o[h*i+G];u[P*i+G]=_}if(!t(await this.matmul(a,o,n,s,i),u))return r("matmul");{let P=(_,h,y,b,k)=>{let A=new Float32Array(y*k);for(let B=0;B<y;B++)for(let U=0;U<k;U++){let M=0;for(let O=0;O<b;O++)M+=_[B*b+O]*h[U*b+O];A[B*k+U]=M}return A},G=async(_,h,y)=>{let b=e(_*h),k=e(y*h);return t(await this.matmulT(b,k,_,h,y),P(b,k,_,h,y))};if(!await G(3,8,5))return r("matmulT.vec4(3,8,5)");if(!await G(1,16,7))return r("matmulT.vec4(1,16,7)");if(!await G(2,6,4))return r("matmulT.scalar(2,6,4)");if(this.hasF16){let b=e(16),k=e(112),A=this.uploadGpuF16(k),B=await this.matmulT(b,A,1,16,7,!0),U=new Float32Array(7);for(let L=0;L<7;L++){let E=0;for(let Q=0;Q<16;Q++)E+=b[Q]*k[L*16+Q];U[L]=E}A.destroy?.();let M=L=>L.length===U.length&&L.every((E,Q)=>Math.abs(E-U[Q])<=.03*(1+Math.abs(U[Q])));if(!M(B))return r("matmulT.f16");let O=this.uploadGpu(k),T=this.f32ToF16Gpu(O,112),S=await this.matmulT(b,T,1,16,7,!0);if(O.destroy?.(),T.destroy?.(),!M(S))return r("packf16")}if(this.hasF16&&this.f16SharedOk){let _=[{m:20,k:128,n:18},{m:32,k:64,n:64},{m:70,k:40,n:130},{m:33,k:48,n:7}];for(let h of _){let y=e(h.m*h.k),b=e(h.n*h.k),k=this.uploadGpuF16(b),A=await this.matmulT(y,k,h.m,h.k,h.n,!0);this.f16SharedOk=!1;let B=await this.matmulT(y,k,h.m,h.k,h.n,!0);if(this.f16SharedOk=!0,k.destroy?.(),!(A.length===B.length&&A.every((M,O)=>Math.abs(M-B[O])<=.001*(1+Math.abs(B[O]))))){this.f16SharedOk=!1,console.warn(`[selfValidate] matmul_t_f16w_shared KO sur ce GPU (m=${h.m}, k=${h.k}, n=${h.n}) : repli sur matmul_t_f16w (plus lent, m\xEAme r\xE9sultat).`);break}}}}{let h=e(128),y=e(768),b=Se(y),k=this.uploadGpuRaw(b.nibbles),A=this.uploadGpuRaw(new Uint8Array(b.scales.buffer,b.scales.byteOffset,b.scales.byteLength)),B=this.uploadGpuRaw(new Uint8Array(b.mins.buffer,b.mins.byteOffset,b.mins.byteLength)),U=await this.matmulQ4(h,k,A,B,1,128,6),M=he(b),O=new Float32Array(6);for(let Q=0;Q<6;Q++){let H=0;for(let W=0;W<128;W++)H+=h[W]*M[Q*128+W];O[Q]=H}if(k.destroy?.(),A.destroy?.(),B.destroy?.(),!t(U,O))return r("matmulQ4");let T=this.uploadGpu(y),S=this.f32ToQ4Gpu(T,768),L=await this.matmulQ4(h,S.nib,S.sc,S.mn,1,128,6);if(T.destroy?.(),S.nib.destroy?.(),S.sc.destroy?.(),S.mn.destroy?.(),!(L.length===O.length&&L.every((Q,H)=>Math.abs(Q-O[H])<=.06*(1+Math.abs(O[H]))+.02)))return r("quantize_q4")}{let h=e(640),y=e(768),b=mn(y),k=this.uploadGpuRaw(new Uint8Array(b.lo.buffer,b.lo.byteOffset,b.lo.byteLength)),A=this.uploadGpuRaw(new Uint8Array(b.hi.buffer,b.hi.byteOffset,b.hi.byteLength)),B=this.uploadGpuRaw(new Uint8Array(b.scales.buffer,b.scales.byteOffset,b.scales.byteLength)),U=this.uploadGpuRaw(new Uint8Array(b.mins.buffer,b.mins.byteOffset,b.mins.byteLength)),M=await this.matmulQ3(h,k,A,B,U,5,128,6),O=He(b),T=new Float32Array(30);for(let S=0;S<5;S++)for(let L=0;L<6;L++){let E=0;for(let Q=0;Q<128;Q++)E+=h[S*128+Q]*O[L*128+Q];T[S*6+L]=E}if(k.destroy?.(),A.destroy?.(),B.destroy?.(),U.destroy?.(),!t(M,T))return r("matmulQ3")}{let h=e(640),y=e(768),b=Se(y),k=this.uploadGpuRaw(b.nibbles),A=this.uploadGpuRaw(new Uint8Array(b.scales.buffer,b.scales.byteOffset,b.scales.byteLength)),B=this.uploadGpuRaw(new Uint8Array(b.mins.buffer,b.mins.byteOffset,b.mins.byteLength)),U=await this.matmulQ4Tiled(h,k,A,B,5,128,6),M=he(b),O=new Float32Array(30);for(let T=0;T<5;T++)for(let S=0;S<6;S++){let L=0;for(let E=0;E<128;E++)L+=h[T*128+E]*M[S*128+E];O[T*6+S]=L}if(k.destroy?.(),A.destroy?.(),B.destroy?.(),!t(U,O))return r("matmul_q4_tiled")}for(let P of[{m:20,n:18},{m:32,n:64},{m:70,n:130}]){let G=P.m,_=128,h=P.n,y=e(G*_),b=e(h*_),k=Se(b),A=this.uploadGpuRaw(k.nibbles),B=this.uploadGpuRaw(new Uint8Array(k.scales.buffer,k.scales.byteOffset,k.scales.byteLength)),U=this.uploadGpuRaw(new Uint8Array(k.mins.buffer,k.mins.byteOffset,k.mins.byteLength)),M=await this.matmulQ4Shared(y,A,B,U,G,_,h),O=he(k),T=new Float32Array(G*h);for(let S=0;S<G;S++)for(let L=0;L<h;L++){let E=0;for(let Q=0;Q<_;Q++)E+=y[S*_+Q]*O[L*_+Q];T[S*h+L]=E}if(A.destroy?.(),B.destroy?.(),U.destroy?.(),!t(M,T))return r(`matmul_q4_shared(${G},${h})`)}{let h=e(128),y=e(768),b=Fe(y),k=this.uploadGpuRaw(new Uint8Array(b.codes.buffer,b.codes.byteOffset,b.codes.byteLength)),A=this.uploadGpuRaw(new Uint8Array(b.scales.buffer,b.scales.byteOffset,b.scales.byteLength)),B=await this.matmulQ8(h,k,A,1,128,6),U=ve(b),M=new Float32Array(6);for(let L=0;L<6;L++){let E=0;for(let Q=0;Q<128;Q++)E+=h[Q]*U[L*128+Q];M[L]=E}if(k.destroy?.(),A.destroy?.(),!t(B,M))return r("matmulQ8");let O=this.uploadGpu(y),T=this.f32ToQ8Gpu(O,768),S=await this.matmulQ8(h,T.codes,T.sc,1,128,6);if(O.destroy?.(),T.codes.destroy?.(),T.sc.destroy?.(),!t(S,M))return r("quantize_q8")}{let h=e(640),y=e(768),b=Fe(y),k=this.uploadGpuRaw(new Uint8Array(b.codes.buffer,b.codes.byteOffset,b.codes.byteLength)),A=this.uploadGpuRaw(new Uint8Array(b.scales.buffer,b.scales.byteOffset,b.scales.byteLength)),B=await this.matmulQ8Tiled(h,k,A,5,128,6),U=ve(b),M=new Float32Array(30);for(let O=0;O<5;O++)for(let T=0;T<6;T++){let S=0;for(let L=0;L<128;L++)S+=h[O*128+L]*U[T*128+L];M[O*6+T]=S}if(k.destroy?.(),A.destroy?.(),!t(B,M))return r("matmul_q8_tiled")}for(let P of[{k:128,n:6},{k:128,n:130},{k:4096,n:17}]){let G=P.k,_=P.n,h=e(G),y=e(_*G),b=Se(y),k=this.uploadGpuRaw(b.nibbles),A=this.uploadGpuRaw(new Uint8Array(b.scales.buffer,b.scales.byteOffset,b.scales.byteLength)),B=this.uploadGpuRaw(new Uint8Array(b.mins.buffer,b.mins.byteOffset,b.mins.byteLength)),U=await this.matmulQ4Vec(h,k,A,B,G,_),M=he(b),O=new Float32Array(_);for(let W=0;W<_;W++){let $=0;for(let D=0;D<G;D++)$+=h[D]*M[W*G+D];O[W]=$}if(k.destroy?.(),A.destroy?.(),B.destroy?.(),!t(U,O))return r(`matmul_q4_vec(${G},${_})`);let T=Fe(y),S=this.uploadGpuRaw(new Uint8Array(T.codes.buffer,T.codes.byteOffset,T.codes.byteLength)),L=this.uploadGpuRaw(new Uint8Array(T.scales.buffer,T.scales.byteOffset,T.scales.byteLength)),E=await this.matmulQ8Vec(h,S,L,G,_),Q=ve(T),H=new Float32Array(_);for(let W=0;W<_;W++){let $=0;for(let D=0;D<G;D++)$+=h[D]*Q[W*G+D];H[W]=$}if(S.destroy?.(),L.destroy?.(),!t(E,H))return r(`matmul_q8_vec(${G},${_})`)}for(let P of[{m:20,n:18},{m:32,n:64},{m:70,n:130}]){let G=P.m,_=128,h=P.n,y=e(G*_),b=e(h*_),k=Fe(b),A=this.uploadGpuRaw(new Uint8Array(k.codes.buffer,k.codes.byteOffset,k.codes.byteLength)),B=this.uploadGpuRaw(new Uint8Array(k.scales.buffer,k.scales.byteOffset,k.scales.byteLength)),U=await this.matmulQ8Shared(y,A,B,G,_,h),M=ve(k),O=new Float32Array(G*h);for(let T=0;T<G;T++)for(let S=0;S<h;S++){let L=0;for(let E=0;E<_;E++)L+=y[T*_+E]*M[S*_+E];O[T*h+S]=L}if(A.destroy?.(),B.destroy?.(),!t(U,O))return r(`matmul_q8_shared(${G},${h})`)}if(this.qShared2Ok){let P=[{m:64,k:128,n:128},{m:65,k:128,n:130},{m:100,k:160,n:18},{m:70,k:96,n:200}];for(let G of P){let _=G.m,h=G.k,y=G.n,b=e(_*h),k=e(y*h),A=new Float32Array(_*y),B=Fe(k),U=ve(B);for(let D=0;D<_;D++)for(let C=0;C<y;C++){let j=0;for(let N=0;N<h;N++)j+=b[D*h+N]*U[C*h+N];A[D*y+C]=j}let M=this.uploadGpuRaw(new Uint8Array(B.codes.buffer,B.codes.byteOffset,B.codes.byteLength)),O=this.uploadGpuRaw(new Uint8Array(B.scales.buffer,B.scales.byteOffset,B.scales.byteLength)),T=await this.matmulQ8Shared2(b,M,O,_,h,y);M.destroy?.(),O.destroy?.();let S=Se(k),L=he(S),E=new Float32Array(_*y);for(let D=0;D<_;D++)for(let C=0;C<y;C++){let j=0;for(let N=0;N<h;N++)j+=b[D*h+N]*L[C*h+N];E[D*y+C]=j}let Q=this.uploadGpuRaw(S.nibbles),H=this.uploadGpuRaw(new Uint8Array(S.scales.buffer,S.scales.byteOffset,S.scales.byteLength)),W=this.uploadGpuRaw(new Uint8Array(S.mins.buffer,S.mins.byteOffset,S.mins.byteLength)),$=await this.matmulQ4Shared2(b,Q,H,W,_,h,y);if(Q.destroy?.(),H.destroy?.(),W.destroy?.(),!t(T,A)||!t($,E)){this.qShared2Ok=!1,console.warn(`[selfValidate] matmul_t_q8/q4_shared2 KO sur ce GPU (m=${_}, k=${h}, n=${y}) : repli sur les tuiles 32\xD764 v1 (plus lentes, m\xEAme r\xE9sultat).`);break}}}{let G=e(1632),_=new Uint8Array(G.buffer,G.byteOffset,G.byteLength),h=(y,b)=>y.length===b.length&&y.every((k,A)=>k===b[A]);if(!h(await this.quantizeToBytes("F32",_,1632,"q8"),await this.quantizeToBytes("F32",_,1632,"q8",256)))return r("quantize_chunk_q8");if(!h(await this.quantizeToBytes("F32",_,1632,"q4"),await this.quantizeToBytes("F32",_,1632,"q4",256)))return r("quantize_chunk_q4")}let c=2,l=8,d=e(c*l),p=e(l),g=new Float32Array(c*l);for(let P=0;P<c;P++){let G=0;for(let h=0;h<l;h++)G+=d[P*l+h]**2;let _=1/Math.sqrt(G/l+1e-5);for(let h=0;h<l;h++)g[P*l+h]=d[P*l+h]*_*p[h]}if(!t(await this.rmsnorm(d,p,c,l),g))return r("rmsnorm");if(!t(await this.rmsnorm(d,p,c,l,1e-5,!0),ze(d,p,c,l,1e-5,!0)))return r("rmsnorm.onePlus");let m=e(16),w=e(16),v=m.map((P,G)=>P/(1+Math.exp(-P))*w[G]);if(!t(await this.swiglu(m,w),v))return r("swiglu");let x=m.map((P,G)=>_n(P)*w[G]);if(!t(await this.geglu(m,w),x))return r("geglu");let q=m.map((P,G)=>P+w[G]);if(!t(await this.add(m,w),q))return r("add");{let P=ie.MAX_WG_DIM*ce+257,G=new Float32Array(P),_=new Float32Array(P),h=[0,1,ce-1,ce,ie.MAX_WG_DIM*ce-1,ie.MAX_WG_DIM*ce,P-1];for(let k of h)G[k]=k%7-3,_[k]=k%5-2;let y=await this.add(G,_),b=y.length===P;for(let k of h)Math.abs(y[k]-(G[k]+_[k]))>1e-5&&(b=!1);if(!b)return r("grid1D.add(2D)")}let F=(P,G,_=.003)=>P.length===G.length&&P.every((h,y)=>Math.abs(h-G[y])<=_*(1+Math.abs(G[y])));{let b=e(8);if(!F(await this.rope(b,2,4,2,1,1e4),vt(b,2,4,2,1,1e4)))return r("rope")}{let b=e(384),k=new Float32Array(64/2).fill(1);if(!F(await this.ropeFactors(b,k,6,64,2,7,5e5),vt(b,6,64,2,7,5e5)))return r("rope_factors.ones");let A=Float32Array.from({length:64/2},(B,U)=>1+U%5*.7);if(!F(await this.ropeFactors(b,A,6,64,2,7,5e5),si(b,A,6,64,2,7,5e5)))return r("rope_factors")}{let b=e(384);if(!F(await this.rope(b,6,64,2,7,5e5,!0),jt(b,6,64,2,7,5e5)))return r("rope.interleaved");let k=e(8);if(!F(await this.rope(k,2,4,2,3,1e4,!0),jt(k,2,4,2,3,1e4)))return r("rope.interleaved.hd4");let A=e(384);if(!F(await this.rope(A,6,64,2,0,5e5,!0),jt(A,6,64,2,0,5e5)))return r("rope.interleaved.pos0");let B=64/2,U=new Float32Array(384);for(let L=0;L<6;L++)for(let E=0;E<B;E++)U[L*64+2*E]=b[L*64+E],U[L*64+2*E+1]=b[L*64+E+B];let M=await this.rope(U,6,64,2,7,5e5,!0),O=await this.rope(b,6,64,2,7,5e5,!1),T=new Float32Array(384);for(let L=0;L<6;L++)for(let E=0;E<B;E++)T[L*64+2*E]=O[L*64+E],T[L*64+2*E+1]=O[L*64+E+B];if(!F(M,T))return r("rope.interleaved.equivalence");let S=Float32Array.from({length:B},(L,E)=>1+E%5*.7);if(!F(await this.ropeFactors(b,S,6,64,2,7,5e5,!0),jt(b,6,64,2,7,5e5,S)))return r("rope_factors.interleaved")}{let _=[16,24,24],h=1e6,y=3,b=y*2,k=5,A=e(b*128),B=new Uint32Array(y*3);for(let T=0;T<y;T++){let S=k+T;B.set([S,S,S],T*3)}let U=new Uint32Array([5,5,5,5,6,9,5,7,5]),M=F(await this.ropeMrope(A,B,b,128,2,_,h),vt(A,b,128,2,k,h)),O=F(await this.ropeMrope(A,U,b,128,2,_,h),ni(A,U,b,128,2,_,h));(!M||!O)&&(this.mropeOk=!1,console.error(`[selfValidate] rope_mrope KO sur ce GPU (${M?"positions 3D":"d\xE9g\xE9n\xE9r\xE9\u2260rope"}). Vision d\xE9sactiv\xE9e, chat texte intact.`))}{let k=e(32),A=e(32),B=e(32);if(!F(await this.attention(k,A,B,2,4,2,4,2),Ue(k,A,B,2,4,2,4,2)))return r("attention");let U=.3,M=5;if(!F(await this.attention(k,A,B,2,4,2,4,2,U,M),Ue(k,A,B,2,4,2,4,2,U,M)))return r("attention.softcap");{let H=e(24),W=e(48),$=e(48);for(let D of[1,4,8,64]){if(!F(await this.attention(H,W,$,3,2,1,4,9,void 0,0,D),Ue(H,W,$,3,2,1,4,9,void 0,0,D)))return r(`attention.window(${D})`);if(!F(await this.attentionDecode(H,W,$,3,2,1,4,9,void 0,0,D),Ue(H,W,$,3,2,1,4,9,void 0,0,D)))return r(`attention_decode.window(${D})`)}}{let O=await this.quantizeKvReadback(A,4,2,4),T=await this.quantizeKvReadback(B,4,2,4),S=await this.attentionQ8Kv(k,O.codes,O.scales,T.codes,T.scales,2,4,2,4,2),L=($,D)=>{let C=new Float32Array(32);for(let j=0;j<4;j++)for(let N=0;N<2;N++){let I=D[j*2+N];for(let Y=0;Y<4;Y++){let V=j*2*4+N*4+Y,z=$[V>>2]>>(V&3)*8&255;C[V]=(z<128?z:z-256)*I}}return C},E=L(O.codes,O.scales),Q=L(T.codes,T.scales),H=Ue(k,E,Q,2,4,2,4,2);if(!F(S,H,.005))return r("attention.q8kv");let W=0;for(let $=0;$<A.length;$++)W=Math.max(W,Math.abs(E[$]-A[$]));if(W>.05)return r("quantize_kv.error")}}{let P=_=>{this.attnDecodeOk=!1,console.error("[selfValidate] attention d\xE9codage HS sur ce GPU (\xE9tape :",_,") \u2192 repli kernels classiques (plus lents \xE0 contexte long, corrects)")},G=[{nT:1,nH:14,nKv:2,hd:64,past:300},{nT:10,nH:14,nKv:2,hd:64,past:173}];for(let _ of G){if(!this.attnDecodeOk)break;let h=_.past+_.nT,y=e(_.nT*_.nH*_.hd),b=e(h*_.nKv*_.hd),k=e(h*_.nKv*_.hd);if(!F(await this.attentionDecode(y,b,k,_.nT,_.nH,_.nKv,_.hd,_.past),Ue(y,b,k,_.nT,_.nH,_.nKv,_.hd,_.past))){P(`decode(nT=${_.nT})`);break}let A=await this.quantizeKvReadback(b,h,_.nKv,_.hd),B=await this.quantizeKvReadback(k,h,_.nKv,_.hd),U=await this.attentionQ8KvDecode(y,A.codes,A.scales,B.codes,B.scales,_.nT,_.nH,_.nKv,_.hd,_.past),M=await this.attentionQ8Kv(y,A.codes,A.scales,B.codes,B.scales,_.nT,_.nH,_.nKv,_.hd,_.past);if(!F(U,M,.005)){P(`decode.q8kv(nT=${_.nT})`);break}}if(this.attnDecodeOk){let A=e(64),B=e(350*8),U=e(350*8);F(await this.attentionDecode(A,B,U,2,4,2,8,173,.3,5),Ue(A,B,U,2,4,2,8,173,.3,5))||P("decode.softcap")}if(this.attnDecodeOk){let A=e(256),B=e(9088),U=e(9088);F(await this.attentionDecode(A,B,U,1,2,1,128,70),Ue(A,B,U,1,2,1,128,70))||P("decode.hd128")}}{let P=h=>{this.attnPrefillOk=!1,console.error("[selfValidate] attention prefill tuil\xE9e HS sur ce GPU (\xE9tape :",h,") \u2192 repli kernel classique (plus lent en prefill, correct)")},G=[{nT:37,nH:14,nKv:2,hd:64,past:0,sc:void 0,cap:0,win:0},{nT:13,nH:14,nKv:2,hd:64,past:173,sc:void 0,cap:0,win:0},{nT:1,nH:14,nKv:2,hd:64,past:300,sc:void 0,cap:0,win:0},{nT:4,nH:4,nKv:2,hd:32,past:7,sc:void 0,cap:0,win:0},{nT:5,nH:4,nKv:2,hd:32,past:0,sc:void 0,cap:0,win:0},{nT:9,nH:2,nKv:1,hd:128,past:70,sc:void 0,cap:0,win:0},{nT:6,nH:4,nKv:2,hd:8,past:17,sc:.3,cap:5,win:0}];for(let h of G){let y=h.past+h.nT,b=e(h.nT*h.nH*h.hd),k=e(y*h.nKv*h.hd),A=e(y*h.nKv*h.hd);if(!F(await this.attentionPrefill(b,k,A,h.nT,h.nH,h.nKv,h.hd,h.past,h.sc,h.cap,h.win),Ue(b,k,A,h.nT,h.nH,h.nKv,h.hd,h.past,h.sc,h.cap,h.win))){P(`prefill(nT=${h.nT},hd=${h.hd},past=${h.past}${h.cap>0?",softcap":""})`);break}}if(this.attnPrefillOk){let U=e(80),M=e(76),O=e(76);for(let T of[1,4,8,64])if(!F(await this.attentionPrefill(U,M,O,10,2,1,4,9,void 0,0,T),Ue(U,M,O,10,2,1,4,9,void 0,0,T))){P(`prefill.window(${T})`);break}}let _=[{nT:37,nH:14,nKv:2,hd:64,past:0,win:0},{nT:13,nH:14,nKv:2,hd:64,past:173,win:0},{nT:10,nH:2,nKv:1,hd:8,past:9,win:4}];for(let h of _){if(!this.attnPrefillOk)break;let y=h.past+h.nT,b=e(h.nT*h.nH*h.hd),k=e(y*h.nKv*h.hd),A=e(y*h.nKv*h.hd),B=await this.quantizeKvReadback(k,y,h.nKv,h.hd),U=await this.quantizeKvReadback(A,y,h.nKv,h.hd),M=await this.attentionQ8KvPrefill(b,B.codes,B.scales,U.codes,U.scales,h.nT,h.nH,h.nKv,h.hd,h.past,void 0,0,h.win),O=await this.attentionQ8Kv(b,B.codes,B.scales,U.codes,U.scales,h.nT,h.nH,h.nKv,h.hd,h.past,void 0,0,h.win);if(!F(M,O,.005)){P(`prefill.q8kv(nT=${h.nT},win=${h.win})`);break}}}{let P=_=>{this.rmsVecOk=!1,console.error("[selfValidate] RMSNorm parall\xE8le HS sur ce GPU (\xE9tape :",_,") \u2192 repli kernel une-ligne-par-thread (correct, plus lent en d\xE9codage)")},G=[{rows:1,dim:1024,onePlus:!1},{rows:1,dim:1536,onePlus:!1},{rows:1,dim:100,onePlus:!1},{rows:14,dim:64,onePlus:!1},{rows:37,dim:2048,onePlus:!1},{rows:3,dim:128,onePlus:!0}];for(let _ of G){let h=e(_.rows*_.dim),y=e(_.dim),b=await this.rmsnormVec(h,y,_.rows,_.dim,1e-6,_.onePlus),k=await this.rmsnorm(h,y,_.rows,_.dim,1e-6,_.onePlus);if(!F(b,k,.005)){P(`rmsnorm_vec(${_.rows}\xD7${_.dim}${_.onePlus?",1+w":""})`);break}}}{let P=_=>{this.topKParOk=!1,console.error("[selfValidate] top-K parall\xE8le HS sur ce GPU (\xE9tape :",_,") \u2192 repli s\xE9lection sur un thread (correcte, plus lente)")},G=[{n:151936,k:64,ties:!1,label:"vocab Qwen (151936)"},{n:65536,k:64,ties:!1,label:"vocab World (65536)"},{n:1e3,k:64,ties:!1,label:"n non multiple de 128"},{n:300,k:64,ties:!1,label:"n < 1024 candidats"},{n:4096,k:8,ties:!1,label:"petit K"},{n:8192,k:64,ties:!0,label:"EX \xC6QUO (d\xE9partage)"}];for(let _ of G){if(!this.topKParOk)break;let h=_.ties?Float32Array.from({length:_.n},(A,B)=>Math.round(Math.random()*6)+(B%7===0?3:0)):e(_.n),y=await this.topKReadback(h,_.k,"top_k"),b=await this.topKReadback(h,_.k,"top_k_par");if(!(y.length===b.length&&y.every((A,B)=>A===b[B]))){let A=y.findIndex((B,U)=>B!==b[U]);P(`top_k_par(${_.label}). Premier \xE9cart au rang ${A} : ${y[A]} vs ${b[A]}`);break}}}{let A={seq:3,d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},B={attnNorm:e(16),wq:e(256),wk:e(128),wv:e(128),wo:e(256),bq:e(16),bk:e(8),bv:e(8),ffnNorm:e(16),wgate:e(256),wup:e(256),wdown:e(256)},U=e(48);if(!F(await this.layerForward(U,A,B),br(U,A,B),.005))return r("layerForward")}{let B={seq:3,d:12,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6,attnScale:1/Math.sqrt(4),attnLogitSoftcap:5,act:"gelu",rmsGainOnePlus:!0},U={attnNorm:e(12),wq:e(192),wk:e(96),wv:e(96),wo:e(192),ffnNorm:e(12),wgate:e(192),wup:e(192),wdown:e(192),postAttnNorm:e(12),postFfnNorm:e(12)},M=e(36);if(!F(await this.layerForward(M,B,U),br(M,B,U),.005))return r("layerForward.gemma2")}{let B={seq:3,d:12,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e6,eps:1e-6},U={attnNorm:e(12),wq:e(192),wk:e(96),wv:e(96),wo:e(192),ffnNorm:e(12),wgate:e(192),wup:e(192),wdown:e(192),qNorm:e(4),kNorm:e(4)},M=e(36);if(!F(await this.layerForward(M,B,U),br(M,B,U),.005))return r("layerForward.qwen3")}{let G=new Uint8Array(720);for(let h=0;h<5;h++){let y=h*144,b=new DataView(G.buffer);b.setUint16(y,pe(.005+Math.random()*.05),!0),b.setUint16(y+2,pe(.001+Math.random()*.02),!0);for(let k=4;k<144;k++)G[y+k]=Math.random()*256|0}let _=await this.dequantizeQ4K(G,5*256);if(!F(_,Ye(G,5),1e-4))return r("dequant.Q4_K")}{let P=U=>{let M=new Uint8Array(U);for(let O=0;O<U;O++)M[O]=Math.random()*256|0;return M},G=(U,M)=>{let O=new DataView(U.buffer),T=S=>M===210?S*210+208:S*M;for(let S=0;S*M<U.length;S++)O.setUint16(T(S),pe(.005+Math.random()*.05),!0);return U},h=G(P(136),34);if(!F(await this.dequantizeByType("Q8_0",h,128),Js(h,4),1e-4))return r("dequant.Q8_0");let y=G(P(88),22);if(!F(await this.dequantizeByType("Q5_0",y,128),Zs(y,4),1e-4))return r("dequant.Q5_0");let b=G(P(840),210);if(!F(await this.dequantizeByType("Q6_K",b,4*256),Qe(b,4),1e-4))return r("dequant.Q6_K");let k=G(P(72),18);if(!F(await this.dequantizeByType("Q4_0",k,128),ei(k,4),1e-4))return r("dequant.Q4_0");let A=P(704),B=new DataView(A.buffer);for(let U=0;U<4;U++)B.setUint16(U*176,pe(.005+Math.random()*.05),!0),B.setUint16(U*176+2,pe(.001+Math.random()*.02),!0);if(!F(await this.dequantizeByType("Q5_K",A,4*256),ti(A,4),1e-4))return r("dequant.Q5_K");if(this.dequantQ3kOk){let U=P(440),M=new DataView(U.buffer);for(let T=0;T<4;T++)M.setUint16(T*110+108,pe(.005+Math.random()*.05),!0);let O=await this.dequantizeByType("Q3_K",U,4*256);F(O,gr(U,4),1e-4)||(this.dequantQ3kOk=!1,console.warn("[selfValidate] dequant.Q3_K en \xE9chec, repli sur CPU"))}if(this.dequantQ41Ok){let U=P(80),M=new DataView(U.buffer);for(let T=0;T<4;T++)M.setUint16(T*20,pe(.005+Math.random()*.05),!0),M.setUint16(T*20+2,pe(.001+Math.random()*.02),!0);let O=await this.dequantizeByType("Q4_1",U,128);F(O,mr(U,4),1e-4)||(this.dequantQ41Ok=!1,console.warn("[selfValidate] dequant.Q4_1 en \xE9chec, repli sur CPU"))}}{let k={d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},A={attnNorm:e(16),wq:e(256),wk:e(128),wv:e(128),wo:e(256),bq:e(16),bk:e(8),bv:e(8),ffnNorm:e(16),wgate:e(256),wup:e(256),wdown:e(256)},B=e(48),M=(await this.layerForward(B,{...k,seq:3},A)).slice(32,48),O=new Float32Array(0),T=await this.layerForwardKV(B.slice(0,32),{...k,seq:2},A,0,O,O),S=await this.layerForwardKV(B.slice(32,48),{...k,seq:1},A,2,T.k,T.v);if(!F(S.out,M,.005))return r("layerForwardKV")}{let _=e(4),h=e(40),y=new Float32Array(10);for(let B=0;B<10;B++){let U=0;for(let M=0;M<4;M++)U+=_[M]*h[B*4+M];y[B]=U}let b=0;for(let B=1;B<10;B++)y[B]>y[b]&&(b=B);let k=this.uploadGpu(h),A=await this.argmaxProjection(_,[{buf:k,rows:10,r0:0}],4,10,!1);if(k.destroy?.(),A!==b)return r("argmaxProjection")}{let k={seq:4,d:16,nHeads:4,nKvHeads:2,headDim:4,ffn:16,ropeTheta:1e4,eps:1e-6},A={attnNorm:e(16),wq:e(256),wk:e(128),wv:e(128),wo:e(256),bq:e(16),bk:e(8),bv:e(8),ffnNorm:e(16),wgate:e(256),wup:e(256),wdown:e(256)},B=e(16),U=e(64),M=new Float32Array(0),O=await this.layerForwardKV(U,{...k,seq:4},A,0,M,M,!0),T=ze(O.out.slice(48,64),B,1,16,1e-6),S={attnNorm:this.uploadGpu(A.attnNorm),wq:this.uploadGpu(A.wq),wk:this.uploadGpu(A.wk),wv:this.uploadGpu(A.wv),wo:this.uploadGpu(A.wo),ffnNorm:this.uploadGpu(A.ffnNorm),wgate:this.uploadGpu(A.wgate),wup:this.uploadGpu(A.wup),wdown:this.uploadGpu(A.wdown),bq:this.uploadGpu(A.bq),bk:this.uploadGpu(A.bk),bv:this.uploadGpu(A.bv)},L=this.uploadGpu(B),E=this.kvQuant;this.kvQuant=!1,this.resetKvGpu();let Q=await this.runDecodeGpu(U,{...k,seq:4},[S],0,L,"selftest-A");if(!F(Q,T,.008))return this.resetKvGpu(),this.kvQuant=E,r("runDecodeGpu.prefill");await this.runDecodeGpu(U.slice(0,48),{...k,seq:3},[S],0,L,"selftest-B");let H=await this.runDecodeGpu(U.slice(48,64),{...k,seq:1},[S],3,L,"selftest-B");if(!F(H,T,.008))return this.resetKvGpu(),this.kvQuant=E,r("runDecodeGpu.decode");this.kvQuant=E,this.resetKvGpu();for(let W of Object.values(S))W?.destroy?.();L.destroy?.()}{let y=Float32Array.from({length:152064},()=>(Math.random()*2-1)*8),b=[...new Set(Array.from({length:40},()=>Math.floor(Math.random()*152064)))],k=y.slice();for(let C=0;C<152064;C++)k[C]=30*Math.tanh(k[C]/30);for(let C of b)k[C]=k[C]>0?k[C]/1.15:k[C]*1.15;let A=Array.from(k.keys()).sort((C,j)=>k[j]-k[C]).slice(0,64),B=globalThis,U=[],M=this.storage(152064*4);this.device.queue.writeBuffer(M,0,y),U.push(M);let O=this.device.createCommandEncoder(),T=this.uniform([152064],{offset:4,value:30});this.recordPass(O,"softcap_logits",[T,M],this.grid1D(152064));let S=this.bufU32(Uint32Array.from(b),B.GPUBufferUsage.STORAGE|B.GPUBufferUsage.COPY_DST),L=this.uniform([b.length],{offset:4,value:1.15});this.recordPass(O,"penalize_logits",[L,S,M],this.grid1D(b.length));let E=this.storage(512),Q=this.uniform([152064,64]);this.recordPass(O,this.topKParOk?"top_k_par":"top_k",[Q,M,E],[1,1,1]),U.push(T,S,L,Q,E);let H=this.device.createBuffer({size:512,usage:B.GPUBufferUsage.COPY_DST|B.GPUBufferUsage.MAP_READ});O.copyBufferToBuffer(E,0,H,0,512),this.device.queue.submit([O.finish()]),await H.mapAsync(B.GPUMapMode.READ);let W=new Uint32Array(H.getMappedRange().slice(0));H.unmap(),H.destroy(),this.release(U);let $=W.slice(0,64),D=new Float32Array(W.buffer,256,64);this.topKOk=!0;for(let C=0;C<64;C++){let j=Math.abs(D[C]-k[A[C]])<=1e-4*(1+Math.abs(k[A[C]])),N=Math.abs(k[$[C]]-D[C])<=1e-4*(1+Math.abs(D[C]));if(!j||!N){this.topKOk=!1,console.error(`[selfValidate] top_k KO sur ce GPU (rang ${C}) : repli sur le sampling CPU plein-vocab (plus lent, m\xEAme r\xE9sultat).`);break}}}if(this.rwkvWkv7Ok){let h=e(128),y=e(16),b=e(16),k=e(16),A=e(16),B=e(16),U=Float32Array.from({length:16},()=>Math.random()*.5+.5),M=h.slice(),O=new Float32Array(16);for(let D=0;D<2;D++){let C=D*8;for(let j=0;j<8;j++){let N=D*8*8+j*8,I=k[C+j],Y=0;for(let z=0;z<8;z++)Y+=B[C+z]*M[N+z];let V=0;for(let z=0;z<8;z++){let X=U[C+z]*M[N+z]+I*b[C+z]+A[C+z]*Y;M[N+z]=X,V+=y[C+z]*X}O[C+j]=V}}let T=await this.rwkvWkv7(h.slice(),y,U,b,k,B,A,2,8),S=(D,C)=>D.length===C.length&&D.every((j,N)=>Math.abs(j-C[N])<=.001*(1+Math.abs(C[N])));!S(T.S,M)||!S(T.y,O)?(this.rwkvWkv7Ok=!1,console.error("[selfValidate] RWKV-7 WKV KO sur ce GPU : une archi RWKV (moteur v2) refuserait de charger (non bloquant pour le chat texte).")):console.log("[selfValidate] RWKV-7 WKV OK (r\xE9currence \xE0 \xE9tat fixe, moteur v2)");let L=16,E=e(L),Q=e(L),H=e(L*6),W=new Float32Array(L*6);for(let D=0;D<6;D++)for(let C=0;C<L;C++){let j=D*L+C;W[j]=E[C]+(Q[C]-E[C])*H[j]}let $=await this.rwkvTokenShift(E,Q,H,L);if(S($,W)?console.log("[selfValidate] RWKV-7 token-shift OK"):(this.rwkvWkv7Ok=!1,console.error("[selfValidate] RWKV-7 token-shift KO sur ce GPU (non bloquant pour le chat texte).")),this.rwkvResidentOk){let D=globalThis,C=D.GPUBufferUsage.STORAGE|D.GPUBufferUsage.COPY_DST|D.GPUBufferUsage.COPY_SRC,j=2,N=8,I=j*N,Y=(z,X)=>{let Z=Math.max(16,Math.ceil((z.length*4+(X?4:0))/16)*16),J=this.device.createBuffer({size:Z,usage:D.GPUBufferUsage.UNIFORM|D.GPUBufferUsage.COPY_DST});return this.device.queue.writeBuffer(J,0,new Uint32Array(z)),X&&this.device.queue.writeBuffer(J,X.off,new Float32Array([X.val])),J},V=z=>this.device.createBuffer({size:z*4,usage:C});try{let z=e(I),X=e(I),Z=e(I),J=Float32Array.from({length:I},()=>Math.random()),te=new Float32Array(I),re=new Float32Array(I),ue=new Float32Array(I);for(let ge=0;ge<j;ge++){let oe=0;for(let Pe=0;Pe<N;Pe++){let we=z[ge*N+Pe]*X[ge*N+Pe];oe+=we*we}oe=Math.sqrt(oe)||1e-12;for(let Pe=0;Pe<N;Pe++){let we=ge*N+Pe,Mt=z[we]*X[we]/oe;re[we]=-Mt,ue[we]=Mt*J[we],te[we]=z[we]*(1+(J[we]-1)*Z[we])}}let ee=V(I),Ae=V(I),se=V(I);this.dispatch("rwkv_kprep",[Y([j,N]),this.buf(z,C),this.buf(J,C),this.buf(X,C),this.buf(Z,C),ee,Ae,se],this.grid1D(j));let Oe=S(await this.readBack(ee,I*4),te)&&S(await this.readBack(Ae,I*4),re)&&S(await this.readBack(se,I*4),ue);ee.destroy?.(),Ae.destroy?.(),se.destroy?.();let be=e(I),ut=e(I),ct=e(I),Bt=e(I),rt=e(I),qt=e(I),St=new Float32Array(I);for(let ge=0;ge<j;ge++){let oe=ge*N,Pe=0;for(let de=0;de<N;de++)Pe+=be[oe+de];Pe/=N;let we=0;for(let de=0;de<N;de++){let nn=be[oe+de]-Pe;we+=nn*nn}we/=N;let Mt=1/Math.sqrt(we+64e-5),rn=0;for(let de=0;de<N;de++)rn+=ut[oe+de]*te[oe+de]*ct[oe+de];for(let de=0;de<N;de++)St[oe+de]=(be[oe+de]-Pe)*Mt*rt[oe+de]+qt[oe+de]+rn*Bt[oe+de]}let qe=new Float32Array(2*I);qe.set(rt,0),qe.set(qt,I);let fe=V(I);this.dispatch("rwkv_out_gn",[Y([j,N],{off:8,val:64e-5}),this.buf(be,C),this.buf(ut,C),this.buf(te,C),this.buf(ct,C),this.buf(Bt,C),this.buf(qe,C),fe],this.grid1D(j));let lt=S(await this.readBack(fe,I*4),St);fe.destroy?.();let Ft=e(I),ft=e(I),xe=Float32Array.from(Ft,(ge,oe)=>Math.exp(-.606531/(1+Math.exp(-(ge+ft[oe]))))),ar=V(I);this.dispatch("rwkv_decay",[this.buf(Ft,C),this.buf(ft,C),ar],this.grid1D(I));let zr=S(await this.readBack(ar,I*4),xe);ar.destroy?.();let Qr=e(I),$r=e(I),Wr=e(I),Ir=e(I),Ts=Float32Array.from(Qr,(ge,oe)=>ge+($r[oe]-ge)*(1/(1+Math.exp(-(Wr[oe]+Ir[oe]))))),or=this.buf(Qr,C);this.dispatch("rwkv_vresid",[or,this.buf($r,C),this.buf(Wr,C),this.buf(Ir,C)],this.grid1D(I));let Vr=S(await this.readBack(or,I*4),Ts);or.destroy?.();let Yr=e(I),Xr=e(I),Jr=e(I),Rs=Float32Array.from(Yr,(ge,oe)=>ge+(Xr[oe]-ge)*Jr[oe]),ur=V(I);this.dispatch("rwkv_lerp",[this.buf(Yr,C),this.buf(Xr,C),this.buf(Jr,C),ur],this.grid1D(I));let Zr=S(await this.readBack(ur,I*4),Rs);ur.destroy?.();let en=e(I),Ls=Float32Array.from(en,ge=>{let oe=Math.max(ge,0);return oe*oe}),cr=V(I);this.dispatch("sqrelu",[this.buf(en,C),cr],this.grid1D(I));let tn=S(await this.readBack(cr,I*4),Ls);cr.destroy?.(),!Oe||!lt||!zr||!Vr||!Zr||!tn?(this.rwkvResidentOk=!1,console.error(`[selfValidate] glu RWKV r\xE9sidente KO sur ce GPU (kprep:${Oe} gn:${lt} decay:${zr} vresid:${Vr} lerp:${Zr} sqrelu:${tn}). Repli forwardToken JS+readback (correct, lent).`)):console.log("[selfValidate] glu RWKV r\xE9sidente OK (kprep, out_gn, decay, vresid, lerp, sqrelu)")}catch(z){this.rwkvResidentOk=!1,console.error("[selfValidate] glu RWKV r\xE9sidente : erreur d\u2019ex\xE9cution. Repli forwardToken JS+readback.",z)}}}if(this.lfm2ShortConvOk){let P=M=>Float32Array.from({length:M},()=>Math.random()*2-1),G=(M,O)=>M.length===O.length&&M.every((T,S)=>Math.abs(T-O[S])<=.001*(1+Math.abs(O[S]))),y=P(96),b=P(64),k=P(96),A=new Float32Array(32),B=b.slice();for(let M=0;M<32;M++){let O=y[M]*y[64+M],T=k[M*3+2]*O;for(let S=0;S<2;S++)T+=k[M*3+S]*b[S*32+M];for(let S=0;S+2<3;S++)B[S*32+M]=b[(S+1)*32+M];B[32+M]=O,A[M]=T*y[32+M]}let U=await this.lfm2ShortConv(y,b.slice(),k,32,3);!G(U.out,A)||!G(U.state,B)?(this.lfm2ShortConvOk=!1,console.error("[selfValidate] LFM2 shortconv KO sur ce GPU : une archi lfm2 refuserait de charger (non bloquant pour le reste).")):console.log("[selfValidate] LFM2 shortconv OK (conv courte gat\xE9e, moteur v2)")}if(this.qwen35SsmOk){let P=(y,b,k=.001)=>y.length===b.length&&y.every((A,B)=>Math.abs(A-b[B])<=k*(1+Math.abs(b[B]))),G=y=>{let b=this.storage(y.byteLength);return this.device.queue.writeBuffer(b,0,y),b},_=async(y,b)=>this.readBack(y,b*4),h=null;try{{let b=[3,2],k=e(8192*4),A=new Float32Array(3*8192),B=new Float32Array(3*8192),U=G(A),M=G(k),O=new Float32Array(3*8192),T=G(new Float32Array(3*8192));for(let S of b){let L=e(S*8192),E=new Float32Array(S*8192);for(let C=0;C<8192;C++){let j=B[C],N=B[8192+C],I=B[2*8192+C];for(let Y=0;Y<S;Y++){let V=L[Y*8192+C],z=j*k[C*4]+N*k[C*4+1]+I*k[C*4+2]+V*k[C*4+3];E[Y*8192+C]=z/(1+Math.exp(-z)),j=N,N=I,I=V,S===3&&Y===0&&(O[C]=j,O[8192+C]=N,O[2*8192+C]=I)}B[C]=j,B[8192+C]=N,B[2*8192+C]=I}let Q=G(L),H=[],W=this.device.createCommandEncoder(),$=S===3?this.recQwen35Conv(W,H,Q,M,U,S,8192,T,0):this.recQwen35Conv(W,H,Q,M,U,S,8192);this.device.queue.submit([W.finish()]);let D=await _($,S*8192);if(this.release([...H,Q]),!P(D,E)){h=`conv(T=${S})`;break}}!h&&!P(await _(T,3*8192),O)&&(h="conv.instantan\xE9"),this.release([T]),!h&&!P(await _(U,3*8192),B)&&(h="conv.\xE9tat"),this.release([U,M])}if(!h){let O=e(32),T=Float32Array.from({length:32},()=>-.05-Math.random()*.3),S=new Float32Array(4096*128),L=G(new Float32Array(4096*128)),E=G(O),Q=G(T),H=new Float32Array(4096*128),W=G(new Float32Array(4096*128));for(let $ of[3,1]){let D=e($*8192),C=e($*32),j=e($*32),N=new Float32Array($*32*128);for(let te=0;te<$;te++)for(let re=0;re<32;re++){let ue=re%16,ee=te*8192,Ae=D.subarray(ee+2048+ue*128,ee+2048+ue*128+128),se=D.subarray(ee+ue*128,ee+ue*128+128),Oe=D.subarray(ee+4096+re*128,ee+4096+re*128+128),be=0,ut=0;for(let fe=0;fe<128;fe++)be+=Ae[fe]*Ae[fe],ut+=se[fe]*se[fe];let ct=1/Math.sqrt(be+1e-6),Bt=1/Math.sqrt(ut+1e-6)/Math.sqrt(128),rt=C[te*32+re]+O[re],qt=Math.exp((rt>20?rt:Math.log(1+Math.exp(rt)))*T[re]),St=1/(1+Math.exp(-j[te*32+re])),qe=re*128*128;for(let fe=0;fe<16384;fe++)S[qe+fe]*=qt;for(let fe=0;fe<128;fe++){let lt=0;for(let xe=0;xe<128;xe++)lt+=S[qe+xe*128+fe]*Ae[xe]*ct;let Ft=(Oe[fe]-lt)*St,ft=0;for(let xe=0;xe<128;xe++)S[qe+xe*128+fe]+=Ae[xe]*ct*Ft,ft+=S[qe+xe*128+fe]*se[xe]*Bt;N[(te*32+re)*128+fe]=ft}$===3&&te===0&&H.set(S.subarray(qe,qe+16384),qe)}let I=G(D),Y=G(C),V=G(j),z=[],X=this.device.createCommandEncoder(),Z=$===3?this.recQwen35Gdn(X,z,I,Y,V,E,Q,L,$,32,16,128,8192,2048,4096,1e-6,W,0):this.recQwen35Gdn(X,z,I,Y,V,E,Q,L,$,32,16,128,8192,2048,4096,1e-6);this.device.queue.submit([X.finish()]);let J=await _(Z,$*32*128);if(this.release([...z,I,Y,V]),!P(J,N,.002)){h=`gdn(T=${$})`;break}}!h&&!P(await _(L,4096*128),S,.002)&&(h="gdn.\xE9tat"),!h&&!P(await _(W,4096*128),H,.002)&&(h="gdn.instantan\xE9"),this.release([W]),this.release([L,E,Q])}if(!h){let M=e(3072),O=Float32Array.from(M);for(let H=0;H<12;H++){let W=17+Math.floor(H/4);for(let $=0;$<64/2;$++){let D=W/Math.pow(1e7,2*$/64),C=Math.cos(D),j=Math.sin(D),N=M[H*256+$],I=M[H*256+$+64/2];O[H*256+$]=N*C-I*j,O[H*256+$+64/2]=I*C+N*j}}let T=G(M),S=[],L=this.device.createCommandEncoder(),E=this.recRopePartial(L,S,T,12,256,4,17,1e7,64);this.device.queue.submit([L.finish()]);let Q=await _(E,12*256);this.release([...S,T]),P(Q,O)||(h="rope_partial")}}catch(y){h=String(y)}h?(this.qwen35SsmOk=!1,console.error(`[selfValidate] Qwen 3.5 (lot) KO (${h}) : un mod\xE8le qwen35 refuserait de charger (non bloquant pour le reste).`)):console.log("[selfValidate] Qwen 3.5 OK (conv k=4 par lot, Gated DeltaNet par lot, instantan\xE9s, RoPE partiel)")}if(this.qwen35SsmOk){let y=new Float32Array(128).fill(.05),b=new Float32Array(128).fill(.02),k=new Float32Array(128).fill(.1),A=new Float32Array([-.05,-.02]),B=new Float32Array([.8,.9]),U=new Float32Array(8192),M=new Float32Array(192),O=new Float32Array(64).fill(.3),T=new Float32Array(256).fill(.25);try{let S=await this.qwen35Conv1d(O,M.slice(),T,64,4),L=await this.qwen35DeltaNetStep(y,b,k,A,B,U.slice(),64,64,2);!S.out||S.out.length!==64||!L.out||L.out.length!==128?(this.qwen35SsmOk=!1,console.error("[selfValidate] Qwen 3.5 SSM KO : dimension invalide")):console.log("[selfValidate] Qwen 3.5 SSM OK (conv causale 1D + Gated DeltaNet, moteur v2)")}catch(S){this.qwen35SsmOk=!1,console.error("[selfValidate] Qwen 3.5 SSM KO :",S)}}if(this.gemma4Ok){let P=(_,h)=>_.length===h.length&&_.every((y,b)=>Math.abs(y-h[b])<=.001*(1+Math.abs(h[b]))),G=async()=>{let _=globalThis,h=async(k,A)=>{let B=[],U=this.device.createCommandEncoder(),M=A(U,B),O=this.device.createBuffer({size:k*4,usage:_.GPUBufferUsage.COPY_DST|_.GPUBufferUsage.MAP_READ});U.copyBufferToBuffer(M,0,O,0,k*4),this.device.queue.submit([U.finish()]),await O.mapAsync(_.GPUMapMode.READ);let T=new Float32Array(O.getMappedRange().slice(0));return O.unmap(),O.destroy(),this.release(B),T},y=k=>{let A=this.storage(k.byteLength);return this.device.queue.writeBuffer(A,0,k),A};{let A=e(5120),B=.4453125,U=y(A),M=await h(5120,(O,T)=>this.recScale(O,T,U,B,5120));if(this.release([U]),!P(M,A.map(O=>O*B)))return"scale"}{let B=e(12288),U=new Float32Array(512).fill(1),M=y(B),O=y(U),T=await h(24*512,(L,E)=>this.recRmsnorm(L,E,M,O,24,512,1e-6));this.release([M,O]);let S=new Float32Array(24*512);for(let L=0;L<24;L++){let E=0;for(let H=0;H<512;H++)E+=B[L*512+H]**2;let Q=1/Math.sqrt(E/512+1e-6);for(let H=0;H<512;H++)S[L*512+H]=B[L*512+H]*Q}if(!P(T,S))return"rmsnorm(hd=512, poids 1)"}let b=this.attnWideOk;this.attnWideOk=!1;try{for(let k of[{hd:256,win:4,nT:3,past:5},{hd:512,win:0,nT:2,past:4},{hd:512,win:0,nT:1,past:9}]){let U=k.past+k.nT,M=e(k.nT*8*k.hd),O=e(U*2*k.hd),T=e(U*2*k.hd),S=y(M),L=y(O),E=y(T),Q=await h(k.nT*8*k.hd,(H,W)=>this.recAttention(H,W,S,L,E,k.nT,8,2,k.hd,U,k.past,1,0,k.win));if(this.release([S,L,E]),!P(Q,Ue(M,O,T,k.nT,8,2,k.hd,k.past,1,0,k.win)))return`attention(hd=${k.hd}, fen\xEAtre=${k.win}, nT=${k.nT})`}}finally{this.attnWideOk=b}return null};try{let _=await G();_?(this.gemma4Ok=!1,console.error(`[selfValidate] Gemma 4 KO (${_}) : un mod\xE8le gemma4 refuserait de charger (non bloquant pour le reste).`)):console.log("[selfValidate] Gemma 4 OK (scale, rmsnorm hd 512, attention hd 256/512 fen\xEAtr\xE9e)")}catch(_){this.gemma4Ok=!1,console.error("[selfValidate] Gemma 4 KO :",_)}}if(this.moeOk){let P=globalThis,G=async(k,A,B)=>{let U=this.device.createBuffer({size:B*4,usage:P.GPUBufferUsage.COPY_DST|P.GPUBufferUsage.MAP_READ});k.copyBufferToBuffer(A,0,U,0,B*4),this.device.queue.submit([k.finish()]),await U.mapAsync(P.GPUMapMode.READ);let M=new Float32Array(U.getMappedRange().slice(0));return U.unmap(),U.destroy(),M},_=k=>{let A=this.storage(k.byteLength);return this.device.queue.writeBuffer(A,0,k),A},h=(k,A,B)=>{let U=k==="Q4_K"?144:210,M=A*B/256,O=new Uint8Array(M*U);for(let T=0;T<O.length;T++)O[T]=Math.random()*256|0;for(let T=0;T<M;T++){let S=new DataView(O.buffer,T*U);k==="Q4_K"?(S.setUint16(0,pe(.01+Math.random()*.02),!0),S.setUint16(2,pe(.005+Math.random()*.01),!0)):S.setUint16(208,pe(.002+Math.random()*.004),!0)}return O},y=(k,A,B)=>{let U=0;for(let M of A)U=Math.max(U,Math.abs(M));return k.length===A.length&&k.every((M,O)=>Math.abs(M-A[O])<=B*(U+1))},b=async()=>{{let M=e(384).map(H=>H*4),O=_(M),T=[],S=this.device.createCommandEncoder(),L=this.recMoeRoute(S,T,O,3,128,8,1.5),E=await G(S,L.w,24);S=this.device.createCommandEncoder();let Q=new Uint32Array((await G(S,L.ids,24)).buffer);this.release([...T,O]);for(let H=0;H<3;H++){let W=Array.from({length:128},(j,N)=>N).sort((j,N)=>M[H*128+N]-M[H*128+j]).slice(0,8),$=M[H*128+W[0]],D=W.map(j=>Math.exp(M[H*128+j]-$)),C=D.reduce((j,N)=>j+N,0);for(let j=0;j<8;j++){if(Q[H*8+j]!==W[j])return`moe_route ids (t=${H}, j=${j})`;if(Math.abs(E[H*8+j]-D[j]/C*1.5)>1e-4)return`moe_route poids (t=${H}, j=${j})`}}}for(let[k,A,B,U,M]of[["Q4_K",1,2048,512,!0],["Q4_K",3,2048,512,!0],["Q6_K",1,512,2048,!1],["Q6_K",3,512,2048,!1]]){let S=A*4,L=h(k,12*U,B),E=k==="Q4_K"?Ye(L,12*U*B/256):Qe(L,12*U*B/256),Q=new Uint32Array(S);for(let z=0;z<A;z++){let X=Array.from({length:12},(Z,J)=>J).sort(()=>Math.random()-.5);for(let Z=0;Z<4;Z++)Q[z*4+Z]=X[Z]}let W=e((M?A:S)*B),$=new Float32Array(S*U);for(let z=0;z<S;z++){let X=M?Math.floor(z/4):z,Z=Q[z];for(let J=0;J<U;J++){let te=0;for(let re=0;re<B;re++)te+=W[X*B+re]*E[(Z*U+J)*B+re];$[z*U+J]=te}}let D=this.uploadKq(k,L),C=_(W),j=_(Q),N=[],I=this.device.createCommandEncoder(),Y=this.recMoeGemv(I,N,C,D,j,S,M?4:1,B,U),V=await G(I,Y,S*U);if(D.buf.destroy(),this.release([...N,C,j]),!y(V,$,.002))return`moe gemv ${k} T=${A} k=${B} n=${U}`}{let U=e(49152),M=e(24),O=_(U),T=_(M),S=[],L=this.device.createCommandEncoder(),E=await G(L,this.recMoeSum(L,S,O,T,3,8,2048),3*2048);this.release([...S,O,T]);let Q=new Float32Array(3*2048);for(let H=0;H<3;H++)for(let W=0;W<2048;W++){let $=0;for(let D=0;D<8;D++)$+=U[(H*8+D)*2048+W]*M[H*8+D];Q[H*2048+W]=$}if(!y(E,Q,1e-4))return"moe_sum"}return null};try{let k=await b();k?(this.moeOk=!1,console.error(`[selfValidate] MoE KO (${k}) : un mod\xE8le \xE0 experts refuserait de charger (non bloquant pour le reste).`)):console.log("[selfValidate] MoE OK (routage top-K, GEMV d'experts Q4_K/Q6_K, somme pond\xE9r\xE9e)")}catch(k){this.moeOk=!1,console.error("[selfValidate] MoE KO :",k)}}if(this.moeOk&&this.moeGemmOk){let P=globalThis,G=b=>{let k=this.storage(b.byteLength);return this.device.queue.writeBuffer(k,0,b),k},_=(b,k,A)=>{let B=b==="Q4_K"?144:210,U=k*A/256,M=new Uint8Array(U*B);for(let O=0;O<M.length;O++)M[O]=Math.random()*256|0;for(let O=0;O<U;O++){let T=new DataView(M.buffer,O*B);b==="Q4_K"?(T.setUint16(0,pe(.01+Math.random()*.02),!0),T.setUint16(2,pe(.005+Math.random()*.01),!0)):T.setUint16(208,pe(.002+Math.random()*.004),!0)}return M},h=(b,k,A)=>{let B=0;for(let U of k)B=Math.max(B,Math.abs(U));return b.length===k.length&&b.every((U,M)=>Math.abs(U-k[M])<=A*(B+1))},y=null;try{for(let[b,k,A,B]of[["Q4_K",2048,512,!0],["Q6_K",512,2048,!1],["Q4_K",512,130,!1]]){let S=_(b,16*A,k),L=b==="Q4_K"?Ye(S,16*A*k/256):Qe(S,16*A*k/256),E=new Uint32Array(160);for(let z=0;z<40;z++){let X=Array.from({length:12},(Z,J)=>J+1).sort(()=>Math.random()-.5);E[z*4]=0;for(let Z=1;Z<4;Z++)E[z*4+Z]=X[Z]}let Q=e((B?40:160)*k),H=new Float32Array(160*A);for(let z=0;z<160;z++){let X=B?Math.floor(z/4):z,Z=E[z];for(let J=0;J<A;J++){let te=0;for(let re=0;re<k;re++)te+=Q[X*k+re]*L[(Z*A+J)*k+re];H[z*A+J]=te}}let W=this.uploadKq(b,S),$=G(Q),D=G(E),C=[],j=this.device.createCommandEncoder(),N=this.recMoeGroup(j,C,D,160,16),I=this.recMoeGemm(j,C,$,W,N,160,16,40,B?4:1,k,A),Y=this.device.createBuffer({size:160*A*4,usage:P.GPUBufferUsage.COPY_DST|P.GPUBufferUsage.MAP_READ});j.copyBufferToBuffer(I,0,Y,0,160*A*4),this.device.queue.submit([j.finish()]),await Y.mapAsync(P.GPUMapMode.READ);let V=new Float32Array(Y.getMappedRange().slice(0));if(Y.unmap(),Y.destroy(),W.buf.destroy(),this.release([...C,$,D]),!h(V,H,.002)){y=`${b} k=${k} n=${A}`;break}}}catch(b){y=String(b)}y?(this.moeGemmOk=!1,console.error(`[selfValidate] GEMM MoE group\xE9 KO (${y}) : prefill MoE par GEMV par case.`)):console.log("[selfValidate] GEMM MoE group\xE9 OK (Q4_K/Q6_K, expert chaud sur deux tuiles, experts absents)")}if(this.k2hOk){let P=globalThis;try{for(let G of[1,3]){let k=e(G*4096),A=e(4096).map(E=>1+E),B=this.storage(k.byteLength),U=this.storage(A.byteLength);this.device.queue.writeBuffer(B,0,k),this.device.queue.writeBuffer(U,0,A);let M=[],O=this.device.createCommandEncoder(),T=this.recRmsnormGrouped(O,M,B,U,G,4096,4,1e-6),S=this.device.createBuffer({size:G*4096*4,usage:P.GPUBufferUsage.COPY_DST|P.GPUBufferUsage.MAP_READ});O.copyBufferToBuffer(T,0,S,0,G*4096*4),this.device.queue.submit([O.finish()]),await S.mapAsync(P.GPUMapMode.READ);let L=new Float32Array(S.getMappedRange().slice(0));S.unmap(),S.destroy(),this.release([...M,B,U]);for(let E=0;E<G&&this.k2hOk;E++)for(let Q=0;Q<4&&this.k2hOk;Q++){let H=0;for(let $=0;$<1024;$++)H+=k[E*4096+Q*1024+$]**2;let W=1/Math.sqrt(H/1024+1e-6);for(let $=0;$<1024;$++){let D=k[E*4096+Q*1024+$]*W*A[Q*1024+$];if(Math.abs(L[E*4096+Q*1024+$]-D)>.001*(1+Math.abs(D))){this.k2hOk=!1;break}}}}this.k2hOk?console.log("[selfValidate] K2-Horizon OK (RMSNorm group\xE9e)"):console.error("[selfValidate] K2-Horizon KO (RMSNorm group\xE9e) : un mod\xE8le k2-horizon refuserait de charger.")}catch(G){this.k2hOk=!1,console.error("[selfValidate] K2-Horizon KO :",G)}}if(this.sparkOk){let P=(b,k)=>b.length===k.length&&b.every((A,B)=>Math.abs(A-k[B])<=.001*(1+Math.abs(k[B]))),G=globalThis,_=async(b,k)=>{let A=[],B=this.device.createCommandEncoder(),U=k(B,A),M=this.device.createBuffer({size:b*4,usage:G.GPUBufferUsage.COPY_DST|G.GPUBufferUsage.MAP_READ});B.copyBufferToBuffer(U,0,M,0,b*4),this.device.queue.submit([B.finish()]),await M.mapAsync(G.GPUMapMode.READ);let O=new Float32Array(M.getMappedRange().slice(0));return M.unmap(),M.destroy(),this.release(A),O},h=b=>{let k=this.storage(b.byteLength);return this.device.queue.writeBuffer(k,0,b),k},y=async()=>{{let U=e(12288),M=e(48),O=h(U),T=h(M),S=await _(12288,(L,E)=>this.recHeadGate(L,E,O,T,12288,256));if(this.release([O,T]),!P(S,U.map((L,E)=>L/(1+Math.exp(-M[Math.floor(E/256)])))))return"head_gate"}{let T=e(2048),S=h(T),L=await _(8*256,(H,W)=>this.recRopePartial(H,W,S,8,256,4,37,5e6,64));this.release([S]);let E=T.slice(),Q=64/2;for(let H=0;H<8;H++){let W=37+Math.floor(H/4),$=H*256;for(let D=0;D<Q;D++){let C=W/Math.pow(5e6,2*D/64),j=Math.cos(C),N=Math.sin(C);E[$+D]=T[$+D]*j-T[$+D+Q]*N,E[$+D+Q]=T[$+D+Q]*j+T[$+D]*N}}if(!P(L,E))return"rope_partial(hd=256, nRot=64)"}return null};try{let b=await y();b?(this.sparkOk=!1,console.error(`[selfValidate] Spark-X2.5 KO (${b}) : un mod\xE8le spark2_5 refuserait de charger (non bloquant pour le reste).`)):console.log("[selfValidate] Spark-X2.5 OK (porte par t\xEAte, RoPE partiel 64/256)")}catch(b){this.sparkOk=!1,console.error("[selfValidate] Spark-X2.5 KO :",b)}}if(this.attnWideOk){let P=(y,b)=>y.length===b.length&&y.every((k,A)=>Math.abs(k-b[A])<=.001*(1+Math.abs(b[A]))),G=globalThis,_=y=>{let b=this.storage(y.byteLength);return this.device.queue.writeBuffer(b,0,y),b},h=null;try{for(let y of[{hd:256,nH:8,nKv:2,win:512,nT:1,past:700,sc:1,cap:0},{hd:512,nH:8,nKv:2,win:0,nT:1,past:130,sc:1,cap:0},{hd:512,nH:8,nKv:2,win:0,nT:5,past:70,sc:1,cap:0},{hd:256,nH:8,nKv:2,win:40,nT:7,past:90,sc:1,cap:0},{hd:256,nH:16,nKv:4,win:0,nT:3,past:66,sc:1/16,cap:0},{hd:256,nH:4,nKv:1,win:0,nT:2,past:10,sc:1/16,cap:5}]){let b=y.past+y.nT,k=e(y.nT*y.nH*y.hd),A=e(b*y.nKv*y.hd),B=e(b*y.nKv*y.hd),U=_(k),M=_(A),O=_(B),T=[],S=this.device.createCommandEncoder(),L=this.recAttention(S,T,U,M,O,y.nT,y.nH,y.nKv,y.hd,b,y.past,y.sc,y.cap,y.win),E=y.nT*y.nH*y.hd,Q=this.device.createBuffer({size:E*4,usage:G.GPUBufferUsage.COPY_DST|G.GPUBufferUsage.MAP_READ});S.copyBufferToBuffer(L,0,Q,0,E*4),this.device.queue.submit([S.finish()]),await Q.mapAsync(G.GPUMapMode.READ);let H=new Float32Array(Q.getMappedRange().slice(0));if(Q.unmap(),Q.destroy(),this.release([...T,U,M,O]),!P(H,Ue(k,A,B,y.nT,y.nH,y.nKv,y.hd,y.past,y.sc,y.cap,y.win))){h=`hd=${y.hd} nT=${y.nT} past=${y.past} fen\xEAtre=${y.win}`;break}}}catch(y){h=String(y)}h?(this.attnWideOk=!1,console.error(`[selfValidate] attention large KO (${h}) : repli sur le kernel un-thread-par-t\xEAte.`)):console.log("[selfValidate] attention large OK (t\xEAtes 256/512, fen\xEAtre, GQA, softcap, d\xE9codage + prefill)")}if(this.kqOk){let P=globalThis,G=(y,b,k)=>{let A=y==="Q4_K"?144:210,B=b*k/256,U=new Uint8Array(B*A);for(let M=0;M<U.length;M++)U[M]=Math.random()*256|0;for(let M=0;M<B;M++){let O=new DataView(U.buffer,M*A);y==="Q4_K"?(O.setUint16(0,pe(.01+Math.random()*.02),!0),O.setUint16(2,pe(.005+Math.random()*.01),!0)):O.setUint16(208,pe(.002+Math.random()*.004),!0)}return U},_=(y,b,k)=>{let A=0;for(let B of b)A=Math.max(A,Math.abs(B));return y.length===b.length&&y.every((B,U)=>Math.abs(B-b[U])<=k*(A+1))},h=null;try{for(let[y,b,k,A]of[["Q4_K",1,2560,37],["Q4_K",1,10240,5],["Q6_K",1,2560,37],["Q6_K",1,10240,5],["Q4_K",3,2560,9],["Q6_K",70,512,20]]){let B=G(y,A,k),U=y==="Q4_K"?Ye(B,A*k/256):Qe(B,A*k/256),M=e(b*k),O=new Float32Array(b*A);for(let $=0;$<b;$++)for(let D=0;D<A;D++){let C=0;for(let j=0;j<k;j++)C+=M[$*k+j]*U[D*k+j];O[$*A+D]=C}let T=this.uploadKq(y,B),S=this.storage(M.byteLength);this.device.queue.writeBuffer(S,0,M);let L=[],E=this.device.createCommandEncoder(),Q=this.recMM(E,L,S,T,b,k,A,!1),H=this.device.createBuffer({size:b*A*4,usage:P.GPUBufferUsage.COPY_DST|P.GPUBufferUsage.MAP_READ});E.copyBufferToBuffer(Q,0,H,0,b*A*4),this.device.queue.submit([E.finish()]),await H.mapAsync(P.GPUMapMode.READ);let W=new Float32Array(H.getMappedRange().slice(0));if(H.unmap(),H.destroy(),T.buf.destroy(),this.release([...L,S]),!_(W,O,b===1?.002:.02)){h=`${y} m=${b} k=${k} n=${A}`;break}}}catch(y){h=String(y)}h?(this.kqOk=!1,console.error(`[selfValidate] poids K-quant natifs KO (${h}) : requantification int8.`)):console.log("[selfValidate] poids K-quant natifs OK (GEMV Q4_K/Q6_K, prefill via int8)")}if(this.gemvMOk){let P=globalThis,G=null;try{for(let[_,h,y,b]of[["q8",1,2560,37],["q8",2,2560,37],["q4k",2,10240,7],["q8",2,10240,7],["q8",8,10240,5],["q4k",1,2560,29],["q4k",3,2560,29],["q4k",8,10240,5],["q8",5,2560,11],["q4",1,2560,33],["q4",4,10240,6]]){let k,A;if(_==="q4"){A=e(b*y);let H=this.uploadGpu(A);k=this.f32ToQ4Gpu(H,b*y),H.destroy?.(),A=he(Se(A))}else if(_==="q8"){A=e(b*y);let H=this.uploadGpu(A);k=this.f32ToQ8Gpu(H,b*y),H.destroy?.(),A=ve(Fe(A))}else{let H=b*y/256,W=new Uint8Array(H*144);for(let $=0;$<W.length;$++)W[$]=Math.random()*256|0;for(let $=0;$<H;$++){let D=new DataView(W.buffer,$*144);D.setUint16(0,pe(.01+Math.random()*.02),!0),D.setUint16(2,pe(.005+Math.random()*.01),!0)}A=Ye(W,H),k=this.uploadKq("Q4_K",W)}let B=e(h*y),U=new Float32Array(h*b);for(let H=0;H<h;H++)for(let W=0;W<b;W++){let $=0;for(let D=0;D<y;D++)$+=B[H*y+D]*A[W*y+D];U[H*b+W]=$}let M=this.storage(B.byteLength);this.device.queue.writeBuffer(M,0,B);let O=[],T=this.device.createCommandEncoder(),S=this.recMM(T,O,M,k,h,y,b,!1),L=this.device.createBuffer({size:h*b*4,usage:P.GPUBufferUsage.COPY_DST|P.GPUBufferUsage.MAP_READ});T.copyBufferToBuffer(S,0,L,0,h*b*4),this.device.queue.submit([T.finish()]),await L.mapAsync(P.GPUMapMode.READ);let E=new Float32Array(L.getMappedRange().slice(0));L.unmap(),L.destroy(),ri(k),this.release([...O,M]);let Q=0;for(let H of U)Q=Math.max(Q,Math.abs(H));if(!E.every((H,W)=>Math.abs(H-U[W])<=.002*(Q+1))){G=`${_} m=${h} k=${y} n=${b}`;break}}}catch(_){G=String(_)}G?(this.gemvMOk=!1,console.error(`[selfValidate] GEMV 4 colonnes KO (${G}) : repli sur matmul_t_*_vec (m = 1) et les kernels de prefill (m \u2265 2).`)):console.log("[selfValidate] GEMV 4 colonnes OK (int8, q4, Q4_K natif, m = 1 \xE0 8)")}let R=await this.validateDiffusion();R?console.warn("[selfValidate] image-gen primitive KO:",R,"(non bloquant: chemin texte intact)"):console.log(`[selfValidate] image-gen primitives OK (silu, group_norm, conv2d, conv2d_direct, conv2d_direct_q8/q4, conv 3\xD73 tuil\xE9 q8/q4 ${this.convTiledQOk?"OK":"KO (repli direct)"}, relu, upsample_nearest, layernorm, quick_gelu, attention_full)`);let K=await this.validateVideoResident();return K?(this.videoResidentOk=!1,console.warn("[selfValidate] motion r\xE9sident KO:",K,", repli JS+readback (plus lent, m\xEAme r\xE9sultat).")):console.log("[selfValidate] motion r\xE9sident OK (video_motion_gather, video_motion_scatter, video_add_pe, attn_temporal)"),!0}async validateVideoResident(){let r=o=>Float32Array.from({length:o},()=>Math.random()*2-1),t=(o,u,c=.005)=>o.length===u.length&&o.every((l,d)=>Math.abs(l-u[d])<=c*(1+Math.abs(u[d])));{let o=r(120),u=new Float32Array(120);for(let d=0;d<5;d++)for(let p=0;p<3;p++)for(let g=0;g<8;g++)u[(d*3+p)*8+g]=o[(p*8+g)*5+d];let c=this.recordingSession(),l=await c.finish(c.videoGather(o,3,8,5),120);if(!t(l,u,1e-6))return"video_motion_gather"}{let o=r(120),u=r(120),c=new Float32Array(120);for(let p=0;p<3;p++)for(let g=0;g<8;g++)for(let m=0;m<5;m++)c[(p*8+g)*5+m]=o[(m*3+p)*8+g]+u[(p*8+g)*5+m];let l=this.recordingSession(),d=await l.finish(l.videoScatter(o,u,3,8,5),120);if(!t(d,c,1e-6))return"video_motion_scatter"}{let o=r(120),u=r(24),c=new Float32Array(120);for(let p=0;p<5;p++)for(let g=0;g<3;g++)for(let m=0;m<8;m++)c[(p*3+g)*8+m]=o[(p*3+g)*8+m]+u[g*8+m];let l=this.recordingSession(),d=await l.finish(l.videoAddPe(o,u,3,8,5),120);if(!t(d,c,1e-6))return"video_add_pe"}{let o=r(120),u=r(120),c=r(120),l=1/Math.sqrt(4),d=new Float32Array(120);for(let m=0;m<5;m++)for(let w=0;w<2;w++){let v=w*4,x=m*3;for(let q=0;q<3;q++){let F=(x+q)*8+v,R=new Float32Array(3),K=-1e30;for(let G=0;G<3;G++){let _=0,h=(x+G)*8+v;for(let y=0;y<4;y++)_+=o[F+y]*u[h+y];R[G]=_*l,R[G]>K&&(K=R[G])}let P=0;for(let G=0;G<3;G++)R[G]=Math.exp(R[G]-K),P+=R[G];for(let G=0;G<3;G++){let _=R[G]/P,h=(x+G)*8+v;for(let y=0;y<4;y++)d[F+y]+=_*c[h+y]}}}let p=this.recordingSession(),g=await p.finish(p.attnTemporal(o,u,c,5,3,2,4),120);if(!t(g,d))return"attn_temporal"}return null}async validateDiffusion(){let r=C=>Float32Array.from({length:C},()=>Math.random()*2-1),t=(C,j,N=.005)=>C.length===j.length&&C.every((I,Y)=>Math.abs(I-j[Y])<=N*(1+Math.abs(j[Y]))),e=r(70),n=e.map(C=>C/(1+Math.exp(-C)));if(!t(await this.silu(e),n))return"silu";let s=4,i=5,a=2,o=1e-5,u=r(s*i),c=r(s),l=r(s),d=new Float32Array(s*i),p=s/a;for(let C=0;C<a;C++){let j=C*p*i,N=p*i,I=0;for(let z=0;z<N;z++)I+=u[j+z];I/=N;let Y=0;for(let z=0;z<N;z++){let X=u[j+z]-I;Y+=X*X}Y/=N;let V=1/Math.sqrt(Y+o);for(let z=0;z<N;z++){let X=C*p+Math.floor(z/i);d[j+z]=(u[j+z]-I)*V*c[X]+l[X]}}if(!t(await this.groupNorm(u,c,l,s,i,a,o),d))return"group_norm";let g=2,m=4,w=4,v=3,x=3,q=1,F=1,R=4,K=4,P=r(g*m*w),G=r(v*g*x*x),_=r(v),h=new Float32Array(v*R*K);for(let C=0;C<v;C++)for(let j=0;j<R;j++)for(let N=0;N<K;N++){let I=_[C];for(let Y=0;Y<g;Y++)for(let V=0;V<x;V++)for(let z=0;z<x;z++){let X=j*q+V-F,Z=N*q+z-F;X>=0&&X<m&&Z>=0&&Z<w&&(I+=P[Y*m*w+X*w+Z]*G[((C*g+Y)*x+V)*x+z])}h[(C*R+j)*K+N]=I}if(!t(await this.conv2d(P,G,_,g,m,w,v,x,x,q,F),h))return"conv2d";if(!t(await this.conv2dDirect(P,G,_,g,m,w,v,x,x,q,F),h))return"conv2d_direct";{let Y=r(1200),V=r(108),z=r(4),X=await this.conv2dDirect(Y,V,z,3,20,20,4,3,3,1,1),Z=this.convTiledOk;this.convTiledOk=!0;let J=this.recordingSession(),te=await J.finish(J.conv2d(Y,V,z,3,20,20,4,3,3,1,1),1600);this.convTiledOk=Z,t(te,X)||(this.convTiledOk=!1,console.warn("[selfValidate] conv2d_3x3_tiled KO sur ce GPU : repli sur conv2d_direct (plus lent, m\xEAme r\xE9sultat)."))}{let N=r(8*m*w),I=r(32*x*x),Y=r(4),V=Fe(I),z=await this.conv2dDirect(N,ve(V),Y,8,m,w,4,x,x,q,F),X={codes:this.uploadGpuRaw(new Uint8Array(V.codes.buffer,V.codes.byteOffset,V.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(V.scales.buffer,V.scales.byteOffset,V.scales.byteLength))},Z=this.convTiledQOk;this.convTiledQOk=!1;let J=this.recordingSession(),te=await J.finish(J.conv2d(N,X,Y,8,m,w,4,x,x,q,F),4*m*w);if(this.convTiledQOk=Z,this.releaseGpu([X.codes,X.sc]),!t(te,z))return"conv2d_direct_q8"}{let N=r(8*m*w),I=r(32*x*x),Y=r(4),V=Se(I),z=await this.conv2dDirect(N,he(V),Y,8,m,w,4,x,x,q,F),X={nib:this.uploadGpuRaw(V.nibbles),sc:this.uploadGpuRaw(new Uint8Array(V.scales.buffer,V.scales.byteOffset,V.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(V.mins.buffer,V.mins.byteOffset,V.mins.byteLength))},Z=this.convTiledQOk;this.convTiledQOk=!1;let J=this.recordingSession(),te=await J.finish(J.conv2d(N,X,Y,8,m,w,4,x,x,q,F),4*m*w);if(this.convTiledQOk=Z,this.releaseGpu([X.nib,X.sc,X.mn]),!t(te,z))return"conv2d_direct_q4"}{let Y=r(16e3),V=r(480),z=r(12),X=this.convTiledQOk;for(let Z of["q8","q4"]){let J=Z==="q8"?(()=>{let ee=Fe(V);return{deq:ve(ee),gpu:{codes:this.uploadGpuRaw(new Uint8Array(ee.codes.buffer,ee.codes.byteOffset,ee.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(ee.scales.buffer,ee.scales.byteOffset,ee.scales.byteLength))}}})():(()=>{let ee=Se(V);return{deq:he(ee),gpu:{nib:this.uploadGpuRaw(ee.nibbles),sc:this.uploadGpuRaw(new Uint8Array(ee.scales.buffer,ee.scales.byteOffset,ee.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(ee.mins.buffer,ee.mins.byteOffset,ee.mins.byteLength))}}})(),te=await this.conv2dDirect(Y,J.deq,z,40,20,20,12,1,1,1,0);this.convTiledQOk=!0;let re=this.recordingSession(),ue=await re.finish(re.conv2d(Y,J.gpu,z,40,20,20,12,1,1,1,0),4800);if(this.releaseGpu(Object.values(J.gpu)),!t(ue,te)){X&&console.warn(`[selfValidate] conv2d_1x1_${Z} KO sur ce GPU : repli sur conv2d_direct_${Z}.`),this.convTiledQOk=!1;break}}this.convTiledQOk=this.convTiledQOk&&X}{let Y=r(3200),V=r(288),z=r(4),X=this.convTiledQOk;for(let Z of["q8","q4"]){let J=Z==="q8"?(()=>{let ee=Fe(V);return{deq:ve(ee),gpu:{codes:this.uploadGpuRaw(new Uint8Array(ee.codes.buffer,ee.codes.byteOffset,ee.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(ee.scales.buffer,ee.scales.byteOffset,ee.scales.byteLength))}}})():(()=>{let ee=Se(V);return{deq:he(ee),gpu:{nib:this.uploadGpuRaw(ee.nibbles),sc:this.uploadGpuRaw(new Uint8Array(ee.scales.buffer,ee.scales.byteOffset,ee.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(ee.mins.buffer,ee.mins.byteOffset,ee.mins.byteLength))}}})(),te=await this.conv2dDirect(Y,J.deq,z,8,20,20,4,3,3,1,1);this.convTiledQOk=!0;let re=this.recordingSession(),ue=await re.finish(re.conv2d(Y,J.gpu,z,8,20,20,4,3,3,1,1),1600);if(this.releaseGpu(Object.values(J.gpu)),!t(ue,te)){X&&console.warn(`[selfValidate] conv2d_3x3_tiled_${Z} KO sur ce GPU : repli sur conv2d_direct_${Z} (plus lent, m\xEAme r\xE9sultat).`),this.convTiledQOk=!1;break}}this.convTiledQOk=this.convTiledQOk&&X}{let Y=r(3200),V=r(288),z=r(4),X=this.convS2Ok,Z=Math.floor(19/2)+1,J=Math.floor(19/2)+1;for(let te of["q8","q4"]){let re=te==="q8"?(()=>{let se=Fe(V);return{deq:ve(se),gpu:{codes:this.uploadGpuRaw(new Uint8Array(se.codes.buffer,se.codes.byteOffset,se.codes.byteLength)),sc:this.uploadGpuRaw(new Uint8Array(se.scales.buffer,se.scales.byteOffset,se.scales.byteLength))}}})():(()=>{let se=Se(V);return{deq:he(se),gpu:{nib:this.uploadGpuRaw(se.nibbles),sc:this.uploadGpuRaw(new Uint8Array(se.scales.buffer,se.scales.byteOffset,se.scales.byteLength)),mn:this.uploadGpuRaw(new Uint8Array(se.mins.buffer,se.mins.byteOffset,se.mins.byteLength))}}})(),ue=await this.conv2dDirect(Y,re.deq,z,8,20,20,4,3,3,2,1);this.convS2Ok=!0;let ee=this.recordingSession(),Ae=await ee.finish(ee.conv2d(Y,re.gpu,z,8,20,20,4,3,3,2,1),4*Z*J);if(this.releaseGpu(Object.values(re.gpu)),!t(Ae,ue)){X&&console.warn(`[selfValidate] conv2d_3x3_s2_tiled_${te} KO sur ce GPU : repli sur direct.`),this.convS2Ok=!1;break}}this.convS2Ok=this.convS2Ok&&X}if(this.hasSubgroups&&this.subgroupsOk)try{let N=r(1500),I=r(300),Y=t(await this.rmsnormVec(N,I,5,300,1e-5,!1,"rmsnorm_vec_subgroup"),await this.rmsnormVec(N,I,5,300,1e-5,!1)),V=8,z=130,X=4,Z=r(V*z),J=r(V),te=r(V),re=t(await this.groupNorm(Z,J,te,V,z,X,1e-5,"group_norm_subgroup"),await this.groupNorm(Z,J,te,V,z,X));if(!Y||!re){let ue=[!Y&&"rmsnorm_vec_subgroup",!re&&"group_norm_subgroup"].filter(Boolean).join(" + ");console.warn(`[selfValidate] ${ue} KO sur ce GPU : repli sur la r\xE9duction en m\xE9moire partag\xE9e.`),this.subgroupsOk=!1}}catch(C){console.warn("[selfValidate] subgroups indisponibles \xE0 l'ex\xE9cution : repli sur la m\xE9moire partag\xE9e.",C),this.subgroupsOk=!1}{let j=r(66),N=new Uint16Array(66);for(let z=0;z<66;z++)N[z]=pe(j[z]);let I=new Float32Array(66);for(let z=0;z<66;z++)I[z]=_e(N[z]);let Y=this.f16ToF32Gpu(new Uint8Array(N.buffer,N.byteOffset,N.byteLength),66),V=await this.readGpu(Y,66);if(Y.destroy?.(),!t(V,I,1e-6))return"f16_to_f32"}let y=r(70);if(!t(await this.relu(y),y.map(C=>Math.max(C,0))))return"relu";let b=2,k=2,A=2,B=2,U=k*B,M=A*B,O=r(b*k*A),T=new Float32Array(b*U*M);for(let C=0;C<b;C++)for(let j=0;j<U;j++)for(let N=0;N<M;N++)T[C*U*M+j*M+N]=O[C*k*A+Math.floor(j/B)*A+Math.floor(N/B)];if(!t(await this.upsampleNearest(O,b,k,A,B),T))return"upsample_nearest";let S=2,L=8,E=1e-5,Q=r(S*L),H=r(L),W=r(L),$=new Float32Array(S*L);for(let C=0;C<S;C++){let j=C*L,N=0;for(let V=0;V<L;V++)N+=Q[j+V];N/=L;let I=0;for(let V=0;V<L;V++){let z=Q[j+V]-N;I+=z*z}I/=L;let Y=1/Math.sqrt(I+E);for(let V=0;V<L;V++)$[j+V]=(Q[j+V]-N)*Y*H[V]+W[V]}if(!t(await this.layernorm(Q,H,W,S,L,E),$))return"layernorm";let D=r(70);if(!t(await this.quickGelu(D),D.map(C=>C/(1+Math.exp(-1.702*C)))))return"quick_gelu";{let V=1/Math.sqrt(4),z=r(24),X=r(40),Z=r(40),J=new Float32Array(24);for(let te=0;te<2;te++)for(let re=0;re<3;re++){let ue=new Float32Array(5),ee=-1/0;for(let se=0;se<5;se++){let Oe=0;for(let be=0;be<4;be++)Oe+=z[re*8+te*4+be]*X[se*8+te*4+be];ue[se]=Oe*V,ue[se]>ee&&(ee=ue[se])}let Ae=0;for(let se=0;se<5;se++)ue[se]=Math.exp(ue[se]-ee),Ae+=ue[se];for(let se=0;se<4;se++){let Oe=0;for(let be=0;be<5;be++)Oe+=ue[be]/Ae*Z[be*8+te*4+se];J[re*8+te*4+se]=Oe}}if(!t(await this.attentionFull(z,X,Z,3,2,2,4,5),J))return"attention_full"}if(this.attnFullWgOk){let C=[{nT:70,kvL:70,nH:5,hd:64},{nT:16,kvL:77,nH:5,hd:64},{nT:9,kvL:9,nH:8,hd:160}];for(let j of C){let N=j.nH*j.hd,I=r(j.nT*N),Y=r(j.kvL*N),V=r(j.kvL*N),z=await this.attentionFull(I,Y,V,j.nT,j.nH,j.nH,j.hd,j.kvL),X=await this.attentionFullWg(I,Y,V,j.nT,j.nH,j.nH,j.hd,j.kvL);if(!t(X,z)){this.attnFullWgOk=!1,console.warn(`[selfValidate] attention_full_wg KO sur ce GPU (hd=${j.hd}, kv=${j.kvL}) : repli sur attention_full (plus lent, m\xEAme r\xE9sultat).`);break}}}return null}};ie.timingOn=(()=>{try{return ne("timing")==="1"}catch{return!1}})(),ie.profileOn=(()=>{try{return ne("gpuprofile")==="1"}catch{return!1}})(),ie.MAX_WG_DIM=65535,ie.BLOCK_ELEMS={Q4_K:256,Q5_K:256,Q6_K:256,Q8_0:32,Q5_0:32,Q4_0:32,Q3_K:256,Q4_1:32,F32:1,F16:1},ie.DEQUANT_SHADER={Q4_K:"dequant_q4k",Q8_0:"dequant_q8_0",Q5_0:"dequant_q5_0",Q6_K:"dequant_q6k",Q4_0:"dequant_q4_0",Q5_K:"dequant_q5k",Q3_K:"dequant_q3k",Q4_1:"dequant_q4_1"},ie.STORAGE_USAGE=140;Et=ie});function An(f,r){let t=new DataView(f.buffer,f.byteOffset,f.byteLength),e=new Float32Array(r);for(let n=0;n<r;n++)e[n]=me(t.getUint16(n*2,!0));return e}function xn(f,r){let t=new DataView(f.buffer,f.byteOffset,f.byteLength),e=new Float32Array(r);for(let n=0;n<r;n++)e[n]=t.getFloat32(n*4,!0);return e}function wt(f,r,t,e){let n=0;for(let a=0;a<t;a++)n+=f[a]*f[a];let s=1/Math.sqrt(n/t+e),i=new Float32Array(t);for(let a=0;a<t;a++)i[a]=f[a]*s*r[a];return i}var ii,Xe,Ht,Pn=ae(()=>{"use strict";pt();mt();gt();nt();ii=f=>f/(1+Math.exp(-f)),Xe=class Xe{constructor(r,t,e){this.engine=r;this.manifest=t;this.raw=e;this.w=new Map;this.g=new Map;this.pos=0;this.rLayers=[];this.tokNormGpu=null;this.normBufs=[];this.ffn=0;this.residentLock=Promise.resolve()}isBigProj(r){return/\.(shortconv\.(in_proj|out_proj)|attn_(q|k|v|output)|ffn_(gate|up|down))\.weight$/.test(r)}async load(r){if(!this.engine.lfm2ShortConvOk)throw new Error("kernel shortconv LFM2 invalid\xE9 sur ce GPU (selfValidate) : archi lfm2 refus\xE9e.");let t=this.manifest.arch;if(this.D=t.d,this.NH=t.nHeads,this.NKV=t.nKvHeads,this.HD=t.headDim,this.NL=t.blockCount,this.vocab=t.vocab,this.EPS=t.rmsEps,this.THETA=t.ropeTheta,!t.lfm2)throw new Error("manifest sans profil lfm2");this.LC=t.lfm2.lCache,this.convLayer=t.lfm2.kvHeadsPerLayer.map(e=>e===0),this.tok=r,this.stops=new Set(this.manifest.chat?.stopTokenIds?.length?this.manifest.chat.stopTokenIds:[7]);for(let[e,n]of Object.entries(this.manifest.tensors)){if(e==="token_embd.weight"){if(this.embedBytes=await this.raw(e),this.embedDtype=n.dtype,n.dtype==="q4"){let i=ke(this.embedBytes,n.nElems);this.g.set("head",{kind:"q4",nib:this.engine.uploadGpuRaw(i.nibbles),sc:this.up(i.scales),mn:this.up(i.mins),IN:this.D,OUT:this.vocab})}else if(n.dtype==="q8"){let i=Ge(this.embedBytes,n.nElems);this.g.set("head",{kind:"q8",codes:this.upI8(i.codes),sc:this.up(i.scales),IN:this.D,OUT:this.vocab})}else if(n.dtype==="q3")throw new Error("LFM2 : t\xEAte li\xE9e en q3 non support\xE9e (le convertisseur garde un plancher q4)");continue}let s=await this.raw(e);if(this.isBigProj(e)&&(n.dtype==="q3"||n.dtype==="q4"||n.dtype==="q8")){let i=n.shape[0],a=n.nElems/i;if(n.dtype==="q8"){let o=Ge(s,n.nElems);this.g.set(e,{kind:"q8",codes:this.upI8(o.codes),sc:this.up(o.scales),IN:i,OUT:a})}else if(n.dtype==="q3"){let o=Be(s,n.nElems);this.g.set(e,{kind:"q3",q3:!0,lo:this.up32(o.lo),hi:this.up32(o.hi),sc:this.up(o.scales),mn:this.up(o.mins),IN:i,OUT:a})}else{let o=ke(s,n.nElems);this.g.set(e,{kind:"q4",nib:this.engine.uploadGpuRaw(o.nibbles),sc:this.up(o.scales),mn:this.up(o.mins),IN:i,OUT:a})}}else this.w.set(e,this.decodePetit(e,s,n))}this.buildResidentLayers(),this.reset()}buildResidentLayers(){let r=t=>{let e=this.engine.uploadGpu(this.w.get(t));return this.normBufs.push(e),e};this.tokNormGpu=r("token_embd_norm.weight"),this.ffn=this.g.get("blk.0.ffn_gate.weight")?.OUT??0,this.rLayers=[];for(let t=0;t<this.NL;t++){let e=`blk.${t}.`,n={attnNorm:r(e+"attn_norm.weight"),ffnNorm:r(e+"ffn_norm.weight"),wgate:this.g.get(e+"ffn_gate.weight"),wup:this.g.get(e+"ffn_up.weight"),wdown:this.g.get(e+"ffn_down.weight")};this.convLayer[t]?this.rLayers.push({conv:!0,...n,convW:r(e+"shortconv.conv.weight"),inProj:this.g.get(e+"shortconv.in_proj.weight"),outProj:this.g.get(e+"shortconv.out_proj.weight")}):this.rLayers.push({conv:!1,...n,qNorm:r(e+"attn_q_norm.weight"),kNorm:r(e+"attn_k_norm.weight"),wq:this.g.get(e+"attn_q.weight"),wk:this.g.get(e+"attn_k.weight"),wv:this.g.get(e+"attn_v.weight"),wo:this.g.get(e+"attn_output.weight")})}}residentAvailable(){return this.engine.lfm2ResidentOk!==!1&&!!this.g.get("head")&&this.rLayers.length===this.NL&&this.ffn>0}cfg(){return{D:this.D,nHeads:this.NH,nKvHeads:this.NKV,headDim:this.HD,ffn:this.ffn,eps:this.EPS,theta:this.THETA,lc:this.LC,vocab:this.vocab}}embedsFor(r){let t=this.D,e=new Float32Array(r.length*t);for(let n=0;n<r.length;n++)e.set(this.embedRow(r[n]),n*t);return e}async logitsGpu(r,t,e){return this.pos=t+r.length,this.engine.lfm2LogitsGpu(this.embedsFor(r),r.length,this.cfg(),this.rLayers,this.g.get("head"),this.tokNormGpu,t,e)}async topKGpu(r,t,e,n,s,i=40){return this.pos=t+r.length,this.engine.lfm2TopKGpu(this.embedsFor(r),r.length,this.cfg(),this.rLayers,this.g.get("head"),this.tokNormGpu,t,e,n,s,i)}async prefillGpu(r,t,e){this.pos=t+r.length,await this.engine.lfm2PrefillGpu(this.embedsFor(r),r.length,this.cfg(),this.rLayers,this.tokNormGpu,t,e)}decodePetit(r,t,e){switch(e.dtype){case"f32":return xn(t,e.nElems);case"f16":return An(t,e.nElems);case"q8":return ve(Ge(t,e.nElems));case"q4":return he(ke(t,e.nElems));case"q3":return He(Be(t,e.nElems));default:throw new Error(`LFM2 : dtype \xAB ${e.dtype} \xBB non support\xE9 pour ${r}`)}}up(r){return this.engine.uploadGpuRaw(new Uint8Array(r.buffer,r.byteOffset,r.byteLength))}up32(r){return this.engine.uploadGpuRaw(new Uint8Array(r.buffer,r.byteOffset,r.byteLength))}upI8(r){return this.engine.uploadGpuRaw(new Uint8Array(r.buffer,r.byteOffset,r.byteLength))}unload(){for(let r of this.g.values())for(let t of["nib","sc","mn","codes"])r[t]?.destroy?.();for(let r of this.normBufs)r?.destroy?.();this.normBufs=[],this.rLayers=[],this.tokNormGpu=null,this.engine.clearLfm2State?.(),this.g.clear(),this.w.clear()}reset(){this.pos=0,this.state=Array.from({length:this.NL},(r,t)=>this.convLayer[t]?{conv:new Float32Array((this.LC-1)*this.D)}:{K:[],V:[]})}async gemm(r,t){let e=this.g.get(r);if(!e){let n=this.w.get(r==="head"?"token_embd.weight":r),s=n.length/t.length,i=new Float32Array(s);for(let a=0;a<s;a++){let o=0,u=a*t.length;for(let c=0;c<t.length;c++)o+=n[u+c]*t[c];i[a]=o}return i}return e.kind==="q8"?this.engine.matmulQ8(t,e.codes,e.sc,1,e.IN,e.OUT):e.kind==="q3"?this.engine.matmulQ3(t,e.lo,e.hi,e.sc,e.mn,1,e.IN,e.OUT):this.engine.matmulQ4(t,e.nib,e.sc,e.mn,1,e.IN,e.OUT)}embedRow(r){let t=this.D;if(this.embedDtype==="f16")return An(this.embedBytes.subarray(r*t*2,r*t*2+t*2),t);if(this.embedDtype==="f32")return xn(this.embedBytes.subarray(r*t*4,r*t*4+t*4),t);if(this.embedDtype==="q8"){let o=this.vocab*t,u=t/32,c=new Int8Array(this.embedBytes.buffer,this.embedBytes.byteOffset+r*t,t),l=this.embedBytes.subarray(o+r*u*2,o+r*u*2+u*2),d=new DataView(l.buffer,l.byteOffset,l.byteLength),p=new Float32Array(t);for(let g=0;g<u;g++){let m=me(d.getUint16(g*2,!0));for(let w=0;w<32;w++)p[g*32+w]=c[g*32+w]*m}return p}let e=this.vocab*t,n=t/32,s=e/2,i=e/2+e/32*2,a=new Uint8Array(t/2+n*2*2);return a.set(this.embedBytes.subarray(r*t/2,r*t/2+t/2),0),a.set(this.embedBytes.subarray(s+r*n*2,s+r*n*2+n*2),t/2),a.set(this.embedBytes.subarray(i+r*n*2,i+r*n*2+n*2),t/2+n*2),he(ke(a,t))}rope(r,t,e){let n=this.HD,s=r.slice();for(let i=0;i<t;i++){let a=i*n;for(let o=0;o<n/2;o++){let u=Math.pow(this.THETA,-2*o/n),c=Math.cos(e*u),l=Math.sin(e*u),d=r[a+o],p=r[a+o+n/2];s[a+o]=d*c-p*l,s[a+o+n/2]=d*l+p*c}}return s}async forwardToken(r){let t=this.D,e=this.pos++,n=this.embedRow(r);for(let s=0;s<this.NL;s++){let i=`blk.${s}.`,a=this.state[s],o=wt(n,this.w.get(i+"attn_norm.weight"),t,this.EPS),u;if(this.convLayer[s]){let g=await this.gemm(i+"shortconv.in_proj.weight",o),m=await this.engine.lfm2ShortConv(g,a.conv,this.w.get(i+"shortconv.conv.weight"),t,this.LC);a.conv=m.state,u=await this.gemm(i+"shortconv.out_proj.weight",m.out)}else{let g=await this.gemm(i+"attn_q.weight",o),m=await this.gemm(i+"attn_k.weight",o),w=await this.gemm(i+"attn_v.weight",o),v=this.w.get(i+"attn_q_norm.weight"),x=this.w.get(i+"attn_k_norm.weight");for(let P=0;P<this.NH;P++)g.set(wt(g.slice(P*this.HD,(P+1)*this.HD),v,this.HD,this.EPS),P*this.HD);for(let P=0;P<this.NKV;P++)m.set(wt(m.slice(P*this.HD,(P+1)*this.HD),x,this.HD,this.EPS),P*this.HD);g=this.rope(g,this.NH,e),m=this.rope(m,this.NKV,e),a.K.push(m),a.V.push(w);let q=new Float32Array(this.NH*this.HD),F=a.K.length,R=1/Math.sqrt(this.HD),K=this.NH/this.NKV;for(let P=0;P<this.NH;P++){let G=Math.floor(P/K),_=P*this.HD,h=G*this.HD,y=new Float32Array(F),b=-1e30;for(let A=0;A<F;A++){let B=0;for(let U=0;U<this.HD;U++)B+=g[_+U]*a.K[A][h+U];y[A]=B*R,y[A]>b&&(b=y[A])}let k=0;for(let A=0;A<F;A++)y[A]=Math.exp(y[A]-b),k+=y[A];for(let A=0;A<F;A++){let B=y[A]/k;for(let U=0;U<this.HD;U++)q[_+U]+=B*a.V[A][h+U]}}u=await this.gemm(i+"attn_output.weight",q)}for(let g=0;g<t;g++)n[g]+=u[g];let c=wt(n,this.w.get(i+"ffn_norm.weight"),t,this.EPS),l=await this.gemm(i+"ffn_gate.weight",c),d=await this.gemm(i+"ffn_up.weight",c);for(let g=0;g<l.length;g++)l[g]=ii(l[g])*d[g];let p=await this.gemm(i+"ffn_down.weight",l);for(let g=0;g<t;g++)n[g]+=p[g]}return n=wt(n,this.w.get("token_embd_norm.weight"),t,this.EPS),this.gemm("head",n)}async classify(r,t){let e=this.tok.encode(r),n;if(this.residentAvailable())n=await this.locked(()=>this.feedThen(e,0,"cls",(i,a)=>this.logitsGpu(i,a,"cls")));else{this.reset();for(let i of e)n=await this.forwardToken(i)}let s=t.map(i=>{let a=this.tok.encode(i);return{label:i,logit:n[a[1]??a[0]]}}).sort((i,a)=>a.logit-i.logit);return{label:s[0].label,scores:s}}banTools(r){for(let t of Xe.TOOL_BAN)t<r.length&&(r[t]=-1e30);return r}sampleTok(r,t,e){let{temperature:n=.8,topK:s=40,repeatPenalty:i=1.3}=e,a=new Set(t),o=[];for(let d=0;d<r.length;d++){let p=r[d];a.has(d)&&(p=p>0?p/i:p*i),o.push({i:d,v:p})}o.sort((d,p)=>p.v-d.v),o.length=s;let u=o[0].v,c=0;for(let d of o)d.p=Math.exp((d.v-u)/n),c+=d.p;let l=Math.random()*c;for(let d of o)if(l-=d.p,l<=0)return d.i;return o[0].i}async generate(r,t,e,n,s){this.reset();let i=this.tok.encode(r),a;for(let u of i)a=await this.forwardToken(u);let o=[];for(let u=0;u<t&&!n?.();u++){this.banTools(a);let c;if(s?.sample)c=this.sampleTok(a,o.slice(-64),s);else{c=0;for(let l=1;l<a.length;l++)a[l]>a[c]&&(c=l)}if(this.stops.has(c))break;o.push(c),e&&e(this.tok.decode(o)),a=await this.forwardToken(c)}return o.length?this.tok.decode(o):""}locked(r){let t=this.residentLock.then(r,r);return this.residentLock=t.catch(()=>{}),t}async feedThen(r,t,e,n,s){let i=0;for(;;){if(s?.())return null;let a=Math.min(i+Xe.PREFILL_CHUNK,r.length),o=r.slice(i,a);if(a<r.length)await this.prefillGpu(o,t+i,e);else return n(o,t+i);i=a}}pickFromTopK(r,t){let e=[],n=[];for(let d=0;d<r.ids.length;d++)if(!Xe.TOOL_BAN.includes(r.ids[d])){if(r.vals[d]<=-3e38)break;e.push(r.ids[d]),n.push(r.vals[d])}if(!e.length)return r.ids[0];if(!t?.sample)return e[0];let{temperature:s=.8,topK:i=40}=t,a=Math.min(i,e.length),o=n[0],u=0,c=new Array(a);for(let d=0;d<a;d++)c[d]=Math.exp((n[d]-o)/s),u+=c[d];let l=Math.random()*u;for(let d=0;d<a;d++)if(l-=c[d],l<=0)return e[d];return e[0]}async generateResident(r,t,e,n,s){return this.residentAvailable()?this.locked(async()=>{let a=s?.repeatPenalty??(s?.sample?1.3:1),o=this.tok.encode(r),u=await this.feedThen(o,0,"gen",(d,p)=>this.topKGpu(d,p,"gen",[],1,48),n);if(!u)return"";let c=o.length,l=[];for(let d=0;d<t&&!n?.();d++){let p=this.pickFromTopK(u,s);if(this.stops.has(p))break;l.push(p),e&&e(this.tok.decode(l)),u=await this.topKGpu([p],c,"gen",a!==1?[...new Set(l.slice(-64))]:[],a,48),c++}return l.length?this.tok.decode(l):""}):this.generate(r,t,e,n,s)}};Xe.TOOL_BAN=[8,10,12],Xe.PREFILL_CHUNK=128;Ht=Xe});function ai(f){let r=[];for(let t=0;t<f.length;t++){let e=f[t];if(e==="\\"&&t+1<f.length){let s=f[t+1];if(s==="x"){r.push(parseInt(f.substr(t+2,2),16)&255),t+=3;continue}if(s==="t"){r.push(9),t++;continue}if(s==="n"){r.push(10),t++;continue}if(s==="r"){r.push(13),t++;continue}if(s==="0"){r.push(0),t++;continue}if(s==="\\"){r.push(92),t++;continue}if(s==="'"){r.push(39),t++;continue}if(s==='"'){r.push(34),t++;continue}r.push(92);continue}let n=e.codePointAt(0);if(n<128)r.push(n);else for(let s of new TextEncoder().encode(e))r.push(s)}return new Uint8Array(r)}var zt,Gn=ae(()=>{"use strict";zt=class{constructor(r,t=0){this.root={next:new Map};this.idToBytes=[];this.vocabSize=r.length,this.eosId=t;for(let e=0;e<r.length;e++){let n=ai(r[e]);if(this.idToBytes[e]=n,e===0||n.length===0)continue;let s=this.root;for(let i of n){let a=s.next.get(i);a||(a={next:new Map},s.next.set(i,a)),s=a}s.id=e}}encode(r){let t=new TextEncoder().encode(r),e=[],n=0;for(;n<t.length;){let s=this.root,i=-1,a=0,o=0;for(let u=n;u<t.length;u++){let c=s.next.get(t[u]);if(!c)break;s=c,o++,c.id!==void 0&&(i=c.id,a=o)}i<0&&(i=t[n]+1,a=1),e.push(i),n+=a}return e}decode(r){let t=[];for(let e of r){if(e===this.eosId)continue;let n=this.idToBytes[e];if(n)for(let s of n)t.push(s)}return new TextDecoder("utf-8",{fatal:!1}).decode(new Uint8Array(t))}}});function vr(f,r){let t=new DataView(f.buffer,f.byteOffset,f.byteLength),e=new Float32Array(r);for(let n=0;n<r;n++)e[n]=me(t.getUint16(n*2,!0));return e}function wr(f,r){let t=new DataView(f.buffer,f.byteOffset,f.byteLength),e=new Float32Array(r);for(let n=0;n<r;n++)e[n]=t.getFloat32(n*4,!0);return e}function je(f,r,t,e){let n=new Float32Array(e);for(let s=0;s<e;s++){let i=0,a=s*t;for(let o=0;o<t;o++)i+=f[a+o]*r[o];n[s]=i}return n}function $t(f,r,t,e,n=1e-5){let s=0;for(let u=0;u<e;u++)s+=f[u];s/=e;let i=0;for(let u=0;u<e;u++){let c=f[u]-s;i+=c*c}i/=e;let a=1/Math.sqrt(i+n),o=new Float32Array(e);for(let u=0;u<e;u++)o[u]=(f[u]-s)*a*r[u]+t[u];return o}var Qt,Je,yt,Un=ae(()=>{"use strict";mt();pt();gt();nt();Gn();Qt=f=>1/(1+Math.exp(-f));Je=class Je{constructor(r,t,e){this.engine=r;this.manifest=t;this.raw=e;this.w=new Map;this.g=new Map;this.rLayers=[];this.rNorms=null;this.normBufs=[];this.residentLock=Promise.resolve()}isBigProj(r){return/\.(time_mix_(receptance|key|value|output)|channel_mix_(key|value))\.weight$/.test(r)}async load(r){let t=this.manifest.arch;this.D=t.d,this.H=t.rwkv.headSize,this.NH=this.D/this.H,this.NL=t.blockCount,this.vocab=t.vocab,this.tok=new zt(r,0);for(let[e,n]of Object.entries(this.manifest.tensors)){if(e==="token_embd.weight"){this.embedBytes=await this.raw(e),this.embedDtype=n.dtype;continue}let s=await this.raw(e);if(e==="output.weight"){if(n.dtype==="q4"){let i=ke(s,n.nElems);this.g.set(e,{kind:"q4",nib:this.engine.uploadGpuRaw(i.nibbles),sc:this.up(i.scales),mn:this.up(i.mins),IN:this.D,OUT:this.vocab})}else if(n.dtype==="q3"){let i=Be(s,n.nElems);this.g.set(e,{kind:"q3",q3:!0,lo:this.up32(i.lo),hi:this.up32(i.hi),sc:this.up(i.scales),mn:this.up(i.mins),IN:this.D,OUT:this.vocab})}else if(n.dtype==="q8"){let i=Ge(s,n.nElems);this.g.set(e,{kind:"q8",codes:this.upI8(i.codes),sc:this.up(i.scales),IN:this.D,OUT:this.vocab})}else this.w.set(e,n.dtype==="f32"?wr(s,n.nElems):vr(s,n.nElems));continue}if(this.isBigProj(e)&&(n.dtype==="q3"||n.dtype==="q4"||n.dtype==="q8")){let i=n.shape[0],a=n.nElems/i;if(n.dtype==="q3"){let o=Be(s,n.nElems);this.g.set(e,{kind:"q3",q3:!0,lo:this.up32(o.lo),hi:this.up32(o.hi),sc:this.up(o.scales),mn:this.up(o.mins),IN:i,OUT:a})}else if(n.dtype==="q8"){let o=Ge(s,n.nElems);this.g.set(e,{kind:"q8",codes:this.upI8(o.codes),sc:this.up(o.scales),IN:i,OUT:a})}else{let o=ke(s,n.nElems);this.g.set(e,{kind:"q4",nib:this.engine.uploadGpuRaw(o.nibbles),sc:this.up(o.scales),mn:this.up(o.mins),IN:i,OUT:a})}}else this.w.set(e,n.dtype==="f32"?wr(s,n.nElems):n.dtype==="f16"?vr(s,n.nElems):n.dtype==="q3"?He(Be(s,n.nElems)):n.dtype==="q8"?ve(Ge(s,n.nElems)):he(ke(s,n.nElems)))}this.buildResidentLayers(),this.reset()}buildResidentLayers(){try{let r=e=>{let n=this.w.get(e);if(!n)throw new Error(`r\xE9sident : tenseur manquant ${e}`);let s=this.engine.uploadGpu(n);return this.normBufs.push(s),s};this.rNorms={tokW:r("token_embd_norm.weight"),tokB:r("token_embd_norm.bias"),outW:r("output_norm.weight"),outB:r("output_norm.bias")};let t=[];for(let e=0;e<this.NL;e++){let n=`blk.${e}.`,s=(m,w)=>{let v=this.w.get(n+m);if(!v)throw new Error(`r\xE9sident : ${n}${m} manquant`);return v.length/w},i=this.w.get(n+"time_mix_ln.weight"),a=this.w.get(n+"time_mix_ln.bias");if(!i||!a)throw new Error(`r\xE9sident : ${n}time_mix_ln manquant`);let o=new Float32Array(2*this.D);o.set(i,0),o.set(a,this.D);let u=this.engine.uploadGpu(o);this.normBufs.push(u);let c=m=>{let w=this.g.get(n+m);if(!w)throw new Error(`r\xE9sident : ${n}${m} non quantifi\xE9e GPU`);return w},l=s("time_mix_w1.weight",this.D),d=s("time_mix_a1.weight",this.D),p=s("time_mix_g1.weight",this.D),g={attnNormW:r(n+"attn_norm.weight"),attnNormB:r(n+"attn_norm.bias"),attnNorm2W:r(n+"attn_norm_2.weight"),attnNorm2B:r(n+"attn_norm_2.bias"),lerpFused:r(n+"time_mix_lerp_fused.weight"),lerpK:r(n+"channel_mix_lerp_k.weight"),w0:r(n+"time_mix_w0.weight"),w1:r(n+"time_mix_w1.weight"),w2:r(n+"time_mix_w2.weight"),rw:l,a0:r(n+"time_mix_a0.weight"),a1:r(n+"time_mix_a1.weight"),a2:r(n+"time_mix_a2.weight"),ra:d,g1:r(n+"time_mix_g1.weight"),g2:r(n+"time_mix_g2.weight"),rg:p,kk:r(n+"time_mix_k_k.weight"),ka:r(n+"time_mix_k_a.weight"),rk:r(n+"time_mix_r_k.weight"),lnWB:u,R:c("time_mix_receptance.weight"),K:c("time_mix_key.weight"),V:c("time_mix_value.weight"),O:c("time_mix_output.weight"),cmK:c("channel_mix_key.weight"),cmV:c("channel_mix_value.weight"),ffn:this.g.get(n+"channel_mix_key.weight").OUT};e>0&&(g.rv=s("time_mix_v1.weight",this.D),g.v0=r(n+"time_mix_v0.weight"),g.v1=r(n+"time_mix_v1.weight"),g.v2=r(n+"time_mix_v2.weight")),t.push(g)}this.rLayers=t}catch(r){console.warn("[rwkv] chemin r\xE9sident indisponible (montage) : repli forwardToken JS+readback.",r),this.rLayers=[],this.rNorms=null}}residentAvailable(){let r=this.engine;return r.rwkvResidentOk!==!1&&r.rwkvWkv7Ok!==!1&&!!this.g.get("output.weight")&&this.rLayers.length===this.NL&&!!this.rNorms}cfg(){return{D:this.D,H:this.H,NH:this.NH,vocab:this.vocab}}embedsFor(r){let t=this.D,e=new Float32Array(r.length*t);for(let n=0;n<r.length;n++)e.set(this.embedRow(r[n]),n*t);return e}async prefillGpu(r,t,e){for(let n=0;n<r.length;n+=Je.PREFILL_CHUNK){let s=r.slice(n,n+Je.PREFILL_CHUNK);await this.engine.rwkvPrefillGpu(this.embedsFor(s),s.length,this.cfg(),this.rLayers,this.rNorms,t+n,e)}}locked(r){let t=this.residentLock.then(r,r);return this.residentLock=t.catch(()=>{}),t}async feedThen(r,t,e,n){let s=r.length>Je.PREFILL_CHUNK?r.slice(0,r.length-Je.PREFILL_CHUNK):[];return s.length&&await this.prefillGpu(s,t,e),n(r.slice(s.length),t+s.length)}async logitsGpu(r,t,e){return this.feedThen(r,t,e,(n,s)=>this.engine.rwkvLogitsGpu(this.embedsFor(n),n.length,this.cfg(),this.rLayers,this.g.get("output.weight"),this.rNorms,s,e))}async topKGpu(r,t,e,n,s,i=40){return this.feedThen(r,t,e,(a,o)=>this.engine.rwkvTopKGpu(this.embedsFor(a),a.length,this.cfg(),this.rLayers,this.g.get("output.weight"),this.rNorms,o,e,n,s,i))}up(r){return this.engine.uploadGpuRaw(new Uint8Array(r.buffer,r.byteOffset,r.byteLength))}up32(r){return this.engine.uploadGpuRaw(new Uint8Array(r.buffer,r.byteOffset,r.byteLength))}upI8(r){return this.engine.uploadGpuRaw(new Uint8Array(r.buffer,r.byteOffset,r.byteLength))}reset(){this.state=Array.from({length:this.NL},()=>({S:Array.from({length:this.NH},()=>new Float32Array(this.H*this.H)),tm:new Float32Array(this.D),cm:new Float32Array(this.D)}))}unload(){for(let r of this.g.values())for(let t of["nib","sc","mn","codes","lo","hi"])r[t]?.destroy?.();for(let r of this.normBufs)r?.destroy?.();this.normBufs=[],this.rLayers=[],this.rNorms=null,this.engine.clearRwkvState?.(),this.g.clear(),this.w.clear()}async gemm(r,t){let e=this.g.get(r);if(!e){let n=this.w.get(r);return je(n,t,t.length,n.length/t.length)}return e.kind==="q3"?this.engine.matmulQ3(t,e.lo,e.hi,e.sc,e.mn,1,e.IN,e.OUT):e.kind==="q8"?this.engine.matmulQ8(t,e.codes,e.sc,1,e.IN,e.OUT):this.engine.matmulQ4(t,e.nib,e.sc,e.mn,1,e.IN,e.OUT)}embedRow(r){let t=this.D;if(this.embedDtype==="f16")return vr(this.embedBytes.subarray(r*t*2,r*t*2+t*2),t);if(this.embedDtype==="f32")return wr(this.embedBytes.subarray(r*t*4,r*t*4+t*4),t);if(this.embedDtype==="q8"){let u=this.vocab*t,c=t/32,l=new Int8Array(this.embedBytes.buffer,this.embedBytes.byteOffset+r*t,t),d=this.embedBytes.subarray(u+r*c*2,u+r*c*2+c*2),p=new DataView(d.buffer,d.byteOffset,d.byteLength),g=new Float32Array(t);for(let m=0;m<c;m++){let w=me(p.getUint16(m*2,!0));for(let v=0;v<32;v++)g[m*32+v]=l[m*32+v]*w}return g}let e=this.vocab*t,n=t/32,s=0,i=e/2,a=e/2+e/32*2,o=new Uint8Array(t/2+n*2*2);return o.set(this.embedBytes.subarray(s+r*t/2,s+r*t/2+t/2),0),o.set(this.embedBytes.subarray(i+r*n*2,i+r*n*2+n*2),t/2),o.set(this.embedBytes.subarray(a+r*n*2,a+r*n*2+n*2),t/2+n*2),he(ke(o,t))}async timeMix(r,t,e,n){let s=this.D,i=this.H,a=this.NH,o=`blk.${r}.`,u=D=>this.w.get(o+D),c=new Float32Array(s);for(let D=0;D<s;D++)c[D]=e.tm[D]-t[D];e.tm=t.slice();let l=u("time_mix_lerp_fused.weight"),d=D=>{let C=new Float32Array(s);for(let j=0;j<s;j++)C[j]=t[j]+c[j]*l[D*s+j];return C},[p,g,m,w,v,x]=[d(0),d(1),d(2),d(3),d(4),d(5)],q=await this.gemm(o+"time_mix_receptance.weight",p),F=await this.gemm(o+"time_mix_key.weight",m),R=await this.gemm(o+"time_mix_value.weight",w),K=je(u("time_mix_w1.weight"),g,s,u("time_mix_w1.weight").length/s);for(let D=0;D<K.length;D++)K[D]=Math.tanh(K[D]);let P=je(u("time_mix_w2.weight"),K,K.length,s),G=u("time_mix_w0.weight"),_=new Float32Array(s);for(let D=0;D<s;D++)_[D]=Math.exp(-.606531*Qt(G[D]+P[D]));let h=u("time_mix_a1.weight"),y=je(u("time_mix_a2.weight"),je(h,v,s,h.length/s),h.length/s,s),b=u("time_mix_a0.weight"),k=new Float32Array(s);for(let D=0;D<s;D++)k[D]=Qt(b[D]+y[D]);let A=u("time_mix_g1.weight"),B=je(A,x,s,A.length/s);for(let D=0;D<B.length;D++)B[D]=Qt(B[D]);let U=je(u("time_mix_g2.weight"),B,B.length,s);if(r===0)n.vFirst=R.slice();else{let D=u("time_mix_v1.weight"),C=je(u("time_mix_v2.weight"),je(D,w,s,D.length/s),D.length/s,s),j=u("time_mix_v0.weight");for(let N=0;N<s;N++)R[N]=R[N]+(n.vFirst[N]-R[N])*Qt(j[N]+C[N])}let M=u("time_mix_k_k.weight"),O=u("time_mix_k_a.weight"),T=new Float32Array(s);for(let D=0;D<s;D++)T[D]=F[D]*M[D];for(let D=0;D<a;D++){let C=0;for(let j=0;j<i;j++){let N=T[D*i+j];C+=N*N}C=Math.sqrt(C)||1e-12;for(let j=0;j<i;j++)T[D*i+j]/=C}let S=new Float32Array(s);for(let D=0;D<s;D++)S[D]=F[D]*(1+(k[D]-1)*O[D]);let L=new Float32Array(s);for(let D=0;D<a;D++){let C=D*i,j=e.S[D];for(let N=0;N<i;N++){let I=0;for(let z=0;z<i;z++)I+=-T[C+z]*j[N*i+z];let Y=0,V=R[C+N];for(let z=0;z<i;z++){let X=_[C+z]*j[N*i+z]+V*S[C+z]+T[C+z]*k[C+z]*I;j[N*i+z]=X,Y+=q[C+z]*X}L[C+N]=Y}}let E=u("time_mix_ln.weight"),Q=u("time_mix_ln.bias"),H=u("time_mix_r_k.weight"),W=new Float32Array(s);for(let D=0;D<a;D++){let C=D*i,j=0;for(let Y=0;Y<i;Y++)j+=L[C+Y];j/=i;let N=0;for(let Y=0;Y<i;Y++){let V=L[C+Y]-j;N+=V*V}N/=i;let I=1/Math.sqrt(N+64e-5);for(let Y=0;Y<i;Y++)W[C+Y]=(L[C+Y]-j)*I*E[C+Y]+Q[C+Y]}for(let D=0;D<a;D++){let C=D*i,j=0;for(let N=0;N<i;N++)j+=q[C+N]*S[C+N]*H[C+N];for(let N=0;N<i;N++)W[C+N]+=j*R[C+N]}let $=new Float32Array(s);for(let D=0;D<s;D++)$[D]=W[D]*U[D];return this.gemm(o+"time_mix_output.weight",$)}async channelMix(r,t,e){let n=this.D,s=`blk.${r}.`,i=this.w.get(s+"channel_mix_lerp_k.weight"),a=new Float32Array(n);for(let c=0;c<n;c++)a[c]=e.cm[c]-t[c];e.cm=t.slice();let o=new Float32Array(n);for(let c=0;c<n;c++)o[c]=t[c]+a[c]*i[c];let u=await this.gemm(s+"channel_mix_key.weight",o);for(let c=0;c<u.length;c++)u[c]=u[c]>0?u[c]*u[c]:0;return this.gemm(s+"channel_mix_value.weight",u)}async forwardToken(r){let t=this.D,e={vFirst:null},n=this.embedRow(r);n=$t(n,this.w.get("token_embd_norm.weight"),this.w.get("token_embd_norm.bias"),t);for(let s=0;s<this.NL;s++){let i=this.state[s],a=`blk.${s}.`,o=await this.timeMix(s,$t(n,this.w.get(a+"attn_norm.weight"),this.w.get(a+"attn_norm.bias"),t),i,e);for(let c=0;c<t;c++)n[c]+=o[c];let u=await this.channelMix(s,$t(n,this.w.get(a+"attn_norm_2.weight"),this.w.get(a+"attn_norm_2.bias"),t),i);for(let c=0;c<t;c++)n[c]+=u[c]}return n=$t(n,this.w.get("output_norm.weight"),this.w.get("output_norm.bias"),t),this.gemm("output.weight",n)}async classify(r,t){let e=this.tok.encode(r),n;if(this.residentAvailable())n=await this.locked(()=>this.logitsGpu(e,0,"cls"));else{this.reset();for(let i of e)n=await this.forwardToken(i)}let s=t.map(i=>({label:i,logit:n[this.tok.encode(" "+i)[0]]})).sort((i,a)=>a.logit-i.logit);return{label:s[0].label,scores:s}}sampleTok(r,t,e){let{temperature:n=.8,topK:s=40,repeatPenalty:i=1.3}=e,a=new Set(t),o=[];for(let d=0;d<r.length;d++){let p=r[d];a.has(d)&&(p=p>0?p/i:p*i),o.push({i:d,v:p})}o.sort((d,p)=>p.v-d.v),o.length=s;let u=o[0].v,c=0;for(let d of o)d.p=Math.exp((d.v-u)/n),c+=d.p;let l=Math.random()*c;for(let d of o)if(l-=d.p,l<=0)return d.i;return o[0].i}async generate(r,t,e,n,s){this.reset();let i=this.tok.encode(r),a;for(let u of i)a=await this.forwardToken(u);let o=[];for(let u=0;u<t&&!n?.();u++){let c;if(s?.sample)c=this.sampleTok(a,o.slice(-64),s);else{c=0;for(let l=1;l<a.length;l++)a[l]>a[c]&&(c=l)}if(c===0)break;o.push(c),e&&e(this.tok.decode(o)),a=await this.forwardToken(c)}return this.tok.decode(o)}pickFromTopK(r,t){if(!t?.sample)return r.ids[0];let{temperature:e=.8,topK:n=40}=t,s=Math.min(n,r.ids.length);for(;s>1&&r.vals[s-1]<=-3e38;)s--;let i=r.vals[0],a=0,o=new Array(s);for(let c=0;c<s;c++)o[c]=Math.exp((r.vals[c]-i)/e),a+=o[c];let u=Math.random()*a;for(let c=0;c<s;c++)if(u-=o[c],u<=0)return r.ids[c];return r.ids[0]}async generateResident(r,t,e,n,s){return this.residentAvailable()?this.locked(async()=>{let a=s?.repeatPenalty??(s?.sample?1.3:1),o=this.tok.encode(r),u=await this.topKGpu(o,0,"gen",[],1,48),c=o.length,l=[];for(let d=0;d<t&&!n?.();d++){let p=this.pickFromTopK(u,s);if(p===0)break;l.push(p),e&&e(this.tok.decode(l)),u=await this.topKGpu([p],c,"gen",a!==1?[...new Set(l.slice(-64))]:[],a,48),c++}return this.tok.decode(l)}):this.generate(r,t,e,n,s)}};Je.PREFILL_CHUNK=32;yt=Je});function st(f){if(!f.length)return null;let r=1/0,t=0,e=0;for(let n of f)r=Math.min(r,n.offset),t=Math.max(t,n.offset+n.bytes),e+=n.bytes;return t-r>64<<20||t-r>e*1.5?null:{start:r,end:t}}function qn(f){let r=[];for(let t=0;t<f.bytes;t+=Me)r.push({off:f.offset+t,len:Math.min(Me,f.bytes-t)});return r}function yr(f,r){let t=new Map;for(let s of Object.keys(f)){let i=s.match(/^blk\.(\d+)\./);if(!i)continue;let a=t.get(i[1]);a||t.set(i[1],a=[]),a.push(s)}let e=new Map,n=new Map;return async s=>{let i=f[s];if(!i)throw new Error(`tenseur absent : ${s}`);let a=s.match(/^blk\.(\d+)\./),o=a?t.get(a[1]):void 0,u=o?st(o.map(w=>f[w])):null;if(!a||!o||!u)return r.bytes(i.offset,i.bytes);let c=a[1],l=e.get(c);l||(l=r.bytes(u.start,u.end-u.start).then(w=>({start:u.start,bytes:w})),e.set(c,l),n.set(c,o.length));let{start:d,bytes:p}=await l,g=p.subarray(i.offset-d,i.offset-d+i.bytes),m=(n.get(c)??1)-1;return m<=0?(e.delete(c),n.delete(c),new Uint8Array(g)):(n.set(c,m),g)}}var Bn,Me,it=ae(()=>{"use strict";Bn=new Set(["per_layer_token_embd.weight"]),Me=4<<20});function kr(f){return f==="llama"||f==="mistral3"||f==="smollm3"}var Sn=ae(()=>{"use strict"});function oi(f){return f instanceof Blob?{bytes:async(r,t)=>new Uint8Array(await f.slice(r,r+t).arrayBuffer())}:f}var le,ye,Ze=ae(()=>{"use strict";it();Sn();pt();gt();mt();ht();it();le=class le{constructor(r,t,e){this.rawCache=new Map;this.layerSpan=new Map;this.weightPrecision="f32";this.precOverrides=null;this.layerCache=new Map;this.layerGpuCache=new Map;this.finalNormGpu=null;this.projQ8=null;this.projVocab=0;this.visionSegments=[];this.engine=r,this.source=oi(t),this.manifest=e,this.weightPrecision=this.nativePrecision}get nativePrecision(){let r=this.manifest.tensors["blk.0.attn_q.weight"];return r?.type==="Q4W"?"q4":r?.type==="Q8W"?"q8":r?.type==="Q3W"?"q3":this.supportsQ8?"q8":this.engine?.hasF16?"f16":"f32"}get isMixedNative(){let r=this.manifest.tensors["blk.0.attn_q.weight"]?.type,t=this.manifest.tensors["blk.0.ffn_gate.weight"]?.type;return(r==="Q4W"||r==="Q8W")&&(t==="Q4W"||t==="Q8W")&&r!==t}get loaded(){return this.manifest!==null}async loadManifest(){return this.manifest}async rawTensor(r){let t=this.rawCache.get(r);if(t)return t;let e=this.manifest.tensors[r];if(!e)throw new Error("tensor absent du manifeste: "+r);let n=await this.source.bytes(e.offset,e.bytes);return this.cacheRaw(r,n)}cacheRaw(r,t){let e=this.maybeUnpermuteLlamaQk(r,t);return this.rawCache.set(r,e),e}maybeUnpermuteLlamaQk(r,t){if(!le.unpermOn||le.ropeNormOn&&kr(this.manifest.arch)||!["llama","mistral3","smollm3"].includes(this.manifest.arch))return t;let e=r.endsWith(".attn_q.weight"),n=r.endsWith(".attn_k.weight");if(!e&&!n)return t;let{nHeads:s,nKvHeads:i,headDim:a}=this.manifest.config,o=this.manifest.tensors[r];if(o.type==="Q8W"||o.type==="Q4W"||o.type==="Q3W")throw new Error("BRIK d\u2019un mod\xE8le llama non support\xE9 (lignes Q/K permut\xE9es) : charger le GGUF directement.");let u=e?s:i,c=u*a,l=o.bytes/c;if(!Number.isInteger(l))throw new Error(`${r} : lignes non uniformes (${o.bytes} o / ${c} lignes). D\xE9-permutation impossible.`);let d=a/2,p=new Uint8Array(t.byteLength);for(let g=0;g<u;g++){let m=g*a;for(let w=0;w<d;w++)p.set(t.subarray((m+2*w)*l,(m+2*w+1)*l),(m+w)*l),p.set(t.subarray((m+2*w+1)*l,(m+2*w+2)*l),(m+d+w)*l)}return p}ensureLayerSpan(r){let t=this.layerSpan.get(r);return t||(t=this.fetchLayerSpan(r).catch(()=>{this.layerSpan.delete(r)}),this.layerSpan.set(r,t)),t}async fetchLayerSpan(r){let t=`blk.${r}.`,e=Object.entries(this.manifest.tensors).filter(([i])=>i.startsWith(t)),n=st(e.map(([,i])=>i));if(!n)return;let s=await this.source.bytes(n.start,n.end-n.start);for(let[i,a]of e)this.rawCache.has(i)||this.cacheRaw(i,s.subarray(a.offset-n.start,a.offset-n.start+a.bytes))}async debugTensorF32(r,t=!1){if(!t)return this.dequant(r);let e=le.unpermOn,n=this.rawCache.has(r),s=this.rawCache.get(r);try{return le.unpermOn=!1,this.rawCache.delete(r),await this.dequant(r)}finally{le.unpermOn=e,this.rawCache.delete(r),n&&s&&this.rawCache.set(r,s)}}async dequant(r){let t=this.manifest.tensors[r],e=await this.rawTensor(r);return this.engine.dequantizeByType(t.type,e,t.nElems)}async dequantGpu(r){let t=this.manifest.tensors[r],e=await this.rawTensor(r);return this.engine.dequantizeToGpu(t.type,e,t.nElems)}async dequantGpuF16(r){let t=this.manifest.tensors[r],e=await this.rawTensor(r);if(t.type==="F16")return this.engine.uploadGpuRawF16(e);let n=this.engine.dequantizeToGpu(t.type,e,t.nElems),s=this.engine.f32ToF16Gpu(n,t.nElems);return n.destroy?.(),s}async dequantGpuQ4(r){let t=this.manifest.tensors[r],e=await this.rawTensor(r);if(t.type!=="Q4W"){let s=this.engine.dequantizeToGpu(t.type,e,t.nElems),i=this.engine.f32ToQ4Gpu(s,t.nElems);return s.destroy?.(),i}let n=ke(e,t.nElems);return{nib:this.engine.uploadGpuRaw(n.nibbles),sc:this.engine.uploadGpuRaw(new Uint8Array(n.scales.buffer,n.scales.byteOffset,n.scales.byteLength)),mn:this.engine.uploadGpuRaw(new Uint8Array(n.mins.buffer,n.mins.byteOffset,n.mins.byteLength))}}async dequantGpuQ3(r){let t=this.manifest.tensors[r],e=await this.rawTensor(r);if(t.type!=="Q3W")return this.engine.dequantizeToGpu(t.type,e,t.nElems);let n=Be(e,t.nElems);return{q3:!0,lo:this.engine.uploadGpuRaw(new Uint8Array(n.lo.buffer,n.lo.byteOffset,n.lo.byteLength)),hi:this.engine.uploadGpuRaw(new Uint8Array(n.hi.buffer,n.hi.byteOffset,n.hi.byteLength)),sc:this.engine.uploadGpuRaw(new Uint8Array(n.scales.buffer,n.scales.byteOffset,n.scales.byteLength)),mn:this.engine.uploadGpuRaw(new Uint8Array(n.mins.buffer,n.mins.byteOffset,n.mins.byteLength))}}async dequantGpuQ8(r){let t=this.manifest.tensors[r],e=await this.rawTensor(r);if(t.type==="Q4_K"&&this.engine.kqOk&&t.shape[0]%256===0)return this.engine.uploadKq("Q4_K",e);if(t.type!=="Q8W"){let s=this.engine.dequantizeToGpu(t.type,e,t.nElems),i=this.engine.f32ToQ8Gpu(s,t.nElems);return s.destroy?.(),i}let n=Ge(e,t.nElems);return{codes:this.engine.uploadGpuRaw(new Uint8Array(n.codes.buffer,n.codes.byteOffset,n.codes.byteLength)),sc:this.engine.uploadGpuRaw(new Uint8Array(n.scales.buffer,n.scales.byteOffset,n.scales.byteLength))}}static destroyWeight(r){if(r){if(r.kq){r.buf?.destroy?.();return}r.q3?(r.lo?.destroy?.(),r.hi?.destroy?.(),r.sc?.destroy?.(),r.mn?.destroy?.()):r.nib?(r.nib?.destroy?.(),r.sc?.destroy?.(),r.mn?.destroy?.()):r.codes?(r.codes?.destroy?.(),r.sc?.destroy?.()):r.destroy?.()}}get precision(){return this.weightPrecision}get supportsQ4(){let{d:r,ffn:t}=this.manifest.config;return r%32===0&&t%32===0}get supportsQ8(){return this.supportsQ4}get supportsQ3(){return this.supportsQ4}matPrecision(r){let t=this.weightPrecision;if((t==="q4"||t==="q8")&&this.precOverrides){for(let[e,n]of this.precOverrides)if(r.includes(e))return n}if(t===this.nativePrecision){let e=this.manifest.tensors[r]?.type;if(e==="Q4W")return"q4";if(e==="Q8W")return"q8";if(e==="Q3W")return"q3"}return t}setWeightPrecision(r){if(r!==this.weightPrecision){if((r==="q4"||r==="q8")&&!this.supportsQ4)throw new Error(`${r} indisponible : d ou ffn non multiple de 32`);for(let t of this.layerGpuCache.values())for(let e of Object.values(t))le.destroyWeight(e);this.layerGpuCache.clear(),this.weightPrecision=r}}async layerWeights(r){let t=this.layerCache.get(r);if(t)return t;let e=`blk.${r}`,[n,s,i,a,o,u,c,l,d,p,g,m]=await Promise.all([this.dequant(`${e}.attn_norm.weight`),this.dequantGpu(`${e}.attn_q.weight`),this.dequantGpu(`${e}.attn_k.weight`),this.dequantGpu(`${e}.attn_v.weight`),this.dequantGpu(`${e}.attn_output.weight`),this.dequant(`${e}.ffn_norm.weight`),this.dequantGpu(`${e}.ffn_gate.weight`),this.dequantGpu(`${e}.ffn_up.weight`),this.dequantGpu(`${e}.ffn_down.weight`),this.dequant(`${e}.attn_q.bias`).catch(()=>{}),this.dequant(`${e}.attn_k.bias`).catch(()=>{}),this.dequant(`${e}.attn_v.bias`).catch(()=>{})]),[w,v,x,q]=await Promise.all([this.dequant(`${e}.post_attention_norm.weight`).catch(()=>{}),this.dequant(`${e}.post_ffw_norm.weight`).catch(()=>{}),this.dequant(`${e}.attn_q_norm.weight`).catch(()=>{}),this.dequant(`${e}.attn_k_norm.weight`).catch(()=>{})]),F={attnNorm:n,wq:s,wk:i,wv:a,wo:o,ffnNorm:u,wgate:c,wup:l,wdown:d,bq:p,bk:g,bv:m,postAttnNorm:w,postFfnNorm:v,qNorm:x,kNorm:q};return this.layerCache.set(r,F),F}async warmup(r){let{blockCount:t,d:e}=this.manifest.config,n=t+1;for(let s=0;s<t;s++)await this.layerWeightsGpu(s),r?.(s+1,n);await this.getFinalNormGpu(),await this.getRopeFactors(),await this.getProjectionQ8(e);try{await this.topKKV([0],0,"brimkern-warmup",[],1),this.reset()}catch(s){console.warn("[warmup] passe \xE0 blanc impossible. Le premier message paiera le transfert :",s)}r?.(n,n)}async layerWeightsGpu(r){let t=this.layerGpuCache.get(r);if(t)return t;await this.ensureLayerSpan(r);let e=`blk.${r}`,n=h=>this.engine.uploadGpu(h),i=this.weightPrecision==="f16",a=h=>{let y=this.matPrecision(h);return y==="q3"?this.dequantGpuQ3(h):y==="q4"?this.dequantGpuQ4(h):y==="q8"?this.dequantGpuQ8(h):y==="f16"?this.dequantGpuF16(h):this.dequantGpu(h)},[o,u,c,l,d,p,g,m,w,v,x,q]=await Promise.all([this.dequant(`${e}.attn_norm.weight`).then(n),a(`${e}.attn_q.weight`),a(`${e}.attn_k.weight`),a(`${e}.attn_v.weight`),a(`${e}.attn_output.weight`),this.dequant(`${e}.ffn_norm.weight`).then(n),a(`${e}.ffn_gate.weight`),a(`${e}.ffn_up.weight`),a(`${e}.ffn_down.weight`),this.dequant(`${e}.attn_q.bias`).then(n).catch(()=>{}),this.dequant(`${e}.attn_k.bias`).then(n).catch(()=>{}),this.dequant(`${e}.attn_v.bias`).then(n).catch(()=>{})]),[F,R,K,P]=await Promise.all([this.dequant(`${e}.post_attention_norm.weight`).then(n).catch(()=>{}),this.dequant(`${e}.post_ffw_norm.weight`).then(n).catch(()=>{}),this.dequant(`${e}.attn_q_norm.weight`).then(n).catch(()=>{}),this.dequant(`${e}.attn_k_norm.weight`).then(n).catch(()=>{})]),G={attnNorm:o,wq:u,wk:c,wv:l,wo:d,ffnNorm:p,wgate:g,wup:m,wdown:w,bq:v,bk:x,bv:q,postAttnNorm:F,postFfnNorm:R,qNorm:K,kNorm:P,matF16:i};this.layerGpuCache.set(r,G);let _=`blk.${r}.`;for(let h of this.rawCache.keys())h.startsWith(_)&&this.rawCache.delete(h);return this.layerSpan.delete(r),G}async getFinalNormGpu(){return this.finalNormGpu||(this.finalNormGpu=this.engine.uploadGpu(await this.dequant("output_norm.weight"))),this.finalNormGpu}async prewarmGpu(r){let{blockCount:t,d:e}=this.manifest.config,n=new Array(t).fill(0);for(let[o,u]of Object.entries(this.manifest.tensors)){let c=o.match(/^blk\.(\d+)\./);c&&(n[Number(c[1])]+=u.bytes)}let s=n.reduce((o,u)=>o+u,0),i=0,a=4;for(let o=0;o<t;o+=a){let u=Math.min(a,t-o);await Promise.all(Array.from({length:u},(c,l)=>this.layerWeightsGpu(o+l))),await this.engine.settleGpu();for(let c=0;c<u;c++)i+=n[o+c];r?.(i,s)}await this.getFinalNormGpu(),await this.getProjectionQ8(e)}static q8RowsBlob(r,t,e,n,s){let i=s/32,a=e*s,o=n*s,u=t+e*i*2,c=n*i*2,l=new Uint8Array(o+c);return l.set(r.subarray(a,a+o),0),l.set(r.subarray(u,u+c),o),l}static q4RowsBlob(r,t,e,n,s){let i=s/32,a=0,o=t/2,u=t/2+t/32*2,c=n*s/2,l=n*i*2,d=new Uint8Array(c+l*2);return d.set(r.subarray(a+e*s/2,a+e*s/2+c),0),d.set(r.subarray(o+e*i*2,o+e*i*2+l),c),d.set(r.subarray(u+e*i*2,u+e*i*2+l),c+l),d}async embed(r,t){let e=this.manifest.tensors["token_embd.weight"],n=e.nElems/t,s=e.type==="Q8W",i=e.type==="Q4W",a=e.bytes/n;if(!s&&!i&&!Number.isInteger(a))throw new Error("token_embd: lignes non uniformes");let o=await this.rawTensor("token_embd.weight"),u=this.manifest.config.embedScale??1,c=new Float32Array(r.length*t);for(let l=0;l<r.length;l++){let d=r[l],p=s?le.q8RowsBlob(o,e.nElems,d,1,t):i?le.q4RowsBlob(o,e.nElems,d,1,t):o.subarray(d*a,(d+1)*a),g=await this.engine.dequantizeByType(e.type,p,t);if(u!==1)for(let m=0;m<t;m++)g[m]*=u;c.set(g,l*t)}return c}async getProjectionQ8(r){if(this.projQ8)return this.projQ8;let t=this.manifest.tensors["output.weight"]?"output.weight":"token_embd.weight",e=this.manifest.tensors[t];if(!e)throw new Error("Logits projection tensor not found (output.weight / token_embd.weight)");let n=e.nElems/r;this.projVocab=n;let s=await this.rawTensor(t),i=Math.max(1,Math.floor(this.engine.maxStorageBufferBindingSize*.9/r)),a=[];if(e.type==="Q4W"){for(let u=0;u<n;u+=i){let c=Math.min(i,n-u),l=le.q4RowsBlob(s,e.nElems,u,c,r),d=c*r/2,p=c*(r/32)*2;a.push({w:{nib:this.engine.uploadGpuRaw(l.subarray(0,d)),sc:this.engine.uploadGpuRaw(l.subarray(d,d+p)),mn:this.engine.uploadGpuRaw(l.subarray(d+p))},rows:c,r0:u})}return this.projQ8=a,a}if(["Q6_K","Q4_K","Q5_K","Q8_0","Q4_0","Q5_0"].includes(e.type)&&e.bytes%n===0){let u=e.bytes/n,c=Math.max(1,Math.floor(Math.min(this.engine.maxStorageBufferBindingSize*.9,256<<20)/(r*4))),l=globalThis,d=this.engine.device.createBuffer({size:c*r*4,usage:l.GPUBufferUsage.STORAGE|l.GPUBufferUsage.COPY_DST|l.GPUBufferUsage.COPY_SRC});for(let p=0;p<n;p+=c){let g=Math.min(c,n-p);this.engine.dequantizeIntoGpu(e.type,s.subarray(p*u,(p+g)*u),g*r,d),a.push({w:this.engine.f32ToQ8Gpu(d,g*r),rows:g,r0:p}),await this.engine.settleGpu()}return d.destroy(),t==="output.weight"&&this.rawCache.delete(t),this.projQ8=a,a}let o=e.type==="Q8W"?s:await this.engine.quantizeToBytes(e.type,s,e.nElems,"q8");for(let u=0;u<n;u+=i){let c=Math.min(i,n-u),l=le.q8RowsBlob(o,e.nElems,u,c,r),d=c*r;a.push({w:{codes:this.engine.uploadGpuRaw(l.subarray(0,d)),sc:this.engine.uploadGpuRaw(l.subarray(d))},rows:c,r0:u})}return this.projQ8=a,a}async argmaxLogits(r,t){let e=await this.getProjectionQ8(t),n=0,s=-1/0;for(let i of e){let a=i.w.nib?await this.engine.matmulQ4(r,i.w.nib,i.w.sc,i.w.mn,1,t,i.rows):await this.engine.matmulQ8(r,i.w.codes,i.w.sc,1,t,i.rows);for(let o=0;o<a.length;o++)a[o]>s&&(s=a[o],n=i.r0+o)}return n}archFlags(){let r=this.manifest.config;return{attnScale:r.attnScale,attnLogitSoftcap:r.attnLogitSoftcap,act:r.act,rmsGainOnePlus:r.rmsGainOnePlus,windowPerLayer:r.windowPerLayer,ropeThetaPerLayer:r.ropeThetaPerLayer,skipRopePerLayer:r.skipRopePerLayer,ropeInterleaved:le.ropeNormOn?r.ropeInterleaved??(kr(this.manifest.arch)||void 0):void 0}}mropePositions(r,t){let e=r+t,n=new Uint32Array(t*3),s=[...this.visionSegments].sort((c,l)=>c.at-l.at),i=(c,l,d,p)=>{c>=r&&c<e&&(n[(c-r)*3]=l,n[(c-r)*3+1]=d,n[(c-r)*3+2]=p)},a=0,o=0,u=0;for(;a<e;){let c=u<s.length?s[u]:null;if(c&&a===c.at){let l=o,d=c.gh*c.gw;for(let p=0;p<d;p++)i(a+p,l,l+Math.floor(p/c.gw),l+p%c.gw);o=l+Math.max(c.gh,c.gw),a+=d,u++}else i(a,o,o,o),o++,a++}return n}async getRopeFactors(){if(this.ropeFactorsCache!==void 0)return this.ropeFactorsCache;if(!le.ropeFactorsOn)return console.warn("[model] facteurs RoPE COUP\xC9S par ?ropefactors=0 : RoPE standard"),this.ropeFactorsCache=null,null;if(this.manifest.tensors["rope_freqs.weight"])this.ropeFactorsCache=await this.dequant("rope_freqs.weight"),console.log("[model] rope_freqs.weight pr\xE9sent : RoPE \xE0 facteurs (scaling llama3) actif");else if(this.manifest.config.yarn){let{factor:r,betaFast:t,betaSlow:e,origCtx:n}=this.manifest.config.yarn,{headDim:s,ropeTheta:i}=this.manifest.config,a=s/2,o=d=>s*Math.log(n/(d*2*Math.PI))/(2*Math.log(i)),u=o(t),c=o(e),l=new Float32Array(a);for(let d=0;d<a;d++){let p=1-Math.min(1,Math.max(0,(d-u)/Math.max(.001,c-u)));l[d]=1/(1/r*(1-p)+p)}this.ropeFactorsCache=l,console.log(`[model] YaRN statique actif (factor ${r}, dims corr ${u.toFixed(1)}\u2013${c.toFixed(1)})`)}else this.ropeFactorsCache=null;return this.ropeFactorsCache}applyMrope(r,t,e){let n=this.manifest.config.mropeSections;if(n){if(!this.engine.mropeOk)throw new Error("M-RoPE indisponible sur ce GPU (selfValidate) : vision d\xE9sactiv\xE9e.");r.mropeSections=n,r.positions=this.mropePositions(t,e)}}static applyInjections(r,t,e,n,s){if(s)for(let i of s){let a=i.rows.length/t;for(let o=0;o<a;o++){let u=i.at+o-e;u>=0&&u<n&&r.set(i.rows.subarray(o*t,(o+1)*t),u*t)}}}get kvQuant(){return this.engine.kvQuant===!0}setKvQuant(r){this.engine.setKvQuant(r)}reset(){this.engine.clearKvCache(),this.visionSegments=[]}unload(){this.reset();for(let r of this.layerGpuCache.values())for(let t of Object.values(r))le.destroyWeight(t);this.layerGpuCache.clear(),this.finalNormGpu?.destroy?.(),this.finalNormGpu=null;for(let r of this.projQ8??[])le.destroyWeight(r.w);this.projQ8=null,this.layerCache.clear(),this.rawCache.clear(),this.layerSpan.clear()}async hiddenKV(r,t,e,n){let s=this.manifest,{d:i,nHeads:a,nKvHeads:o,headDim:u,ffn:c,blockCount:l,ropeTheta:d,rmsEps:p}=s.config,g={seq:r.length,d:i,nHeads:a,nKvHeads:o,headDim:u,ffn:c,ropeTheta:d,eps:p,...this.archFlags()};this.applyMrope(g,t,r.length),g.ropeFactors=await this.getRopeFactors()??void 0;let m=await this.embed(r,i);le.applyInjections(m,i,t,r.length,n);let w=await Promise.all(Array.from({length:l},(x,q)=>this.layerWeightsGpu(q))),v=await this.getFinalNormGpu();return this.engine.runDecodeGpu(m,g,w,t,v,e)}async generateNextKV(r,t,e,n){let s=await this.hiddenKV(r,t,e,n);return this.argmaxLogits(s,this.manifest.config.d)}async logitsKV(r,t,e,n){let s=this.manifest,{d:i,nHeads:a,nKvHeads:o,headDim:u,ffn:c,blockCount:l,ropeTheta:d,rmsEps:p}=s.config,g={seq:r.length,d:i,nHeads:a,nKvHeads:o,headDim:u,ffn:c,ropeTheta:d,eps:p,...this.archFlags()};this.applyMrope(g,t,r.length),g.ropeFactors=await this.getRopeFactors()??void 0;let m=le.timingOn?(P,G)=>console.info(`[timing] ${P} ${(performance.now()-G).toFixed(0)} ms`):null,w=performance.now(),v=await this.embed(r,i);m?.("embed",w),w=performance.now(),le.applyInjections(v,i,t,r.length,n);let x=await Promise.all(Array.from({length:l},(P,G)=>this.layerWeightsGpu(G)));m?.("poids des couches",w),w=performance.now();let q=await this.getFinalNormGpu(),F=await this.getProjectionQ8(i);m?.("norme finale + t\xEAte de projection",w),w=performance.now();let R=await this.engine.decodeLogitsQ8(v,g,x,t,q,e,F,this.projVocab);m?.("forward + logits",w);let K=s.config.finalLogitSoftcap;if(K&&K>0)for(let P=0;P<R.length;P++)R[P]=K*Math.tanh(R[P]/K);return R}async topKKV(r,t,e,n,s,i){let a=this.manifest,{d:o,nHeads:u,nKvHeads:c,headDim:l,ffn:d,blockCount:p,ropeTheta:g,rmsEps:m}=a.config,w={seq:r.length,d:o,nHeads:u,nKvHeads:c,headDim:l,ffn:d,ropeTheta:g,eps:m,...this.archFlags()};this.applyMrope(w,t,r.length),w.ropeFactors=await this.getRopeFactors()??void 0;let v=le.timingOn?(G,_)=>console.info(`[timing] ${G} ${(performance.now()-_).toFixed(0)} ms`):null,x=performance.now(),q=await this.embed(r,o);v?.("embed",x),x=performance.now(),le.applyInjections(q,o,t,r.length,i);let F=await Promise.all(Array.from({length:p},(G,_)=>this.layerWeightsGpu(_)));v?.("poids des couches",x),x=performance.now();let R=await this.getFinalNormGpu(),K=await this.getProjectionQ8(o);v?.("norme finale + tete de projection",x),x=performance.now();let P=await this.engine.decodeTopKQ8(q,w,F,t,R,e,K,this.projVocab,n,s,a.config.finalLogitSoftcap??0);return v?.("forward + top-k",x),P}get batchAvailable(){return!this.engine.kvQuant&&!this.manifest.config.mropeSections&&this.engine.gemvMOk}async topKBatch(r,t,e,n,s){let i=this.manifest,{d:a,nHeads:o,nKvHeads:u,headDim:c,ffn:l,blockCount:d,ropeTheta:p,rmsEps:g}=i.config,m={seq:r.length,d:a,nHeads:o,nKvHeads:u,headDim:c,ffn:l,ropeTheta:p,eps:g,...this.archFlags()};m.ropeFactors=await this.getRopeFactors()??void 0;let w=await this.embed(r,a),v=await Promise.all(Array.from({length:d},(F,R)=>this.layerWeightsGpu(R))),x=await this.getFinalNormGpu(),q=await this.getProjectionQ8(a);return this.engine.decodeTopKBatch(w,m,v,t,e,x,q,this.projVocab,n,s,i.config.finalLogitSoftcap??0)}async debugHiddenPerLayer(r){let t=this.manifest,{d:e,nHeads:n,nKvHeads:s,headDim:i,ffn:a,blockCount:o,ropeTheta:u,rmsEps:c}=t.config,d={seq:r.length,d:e,nHeads:n,nKvHeads:s,headDim:i,ffn:a,ropeTheta:u,eps:c,...this.archFlags()};d.ropeFactors=await this.getRopeFactors()??void 0;let p=await this.embed(r,e),g=[];for(let m=0;m<o;m++)p=await this.engine.layerForward(p,d,await this.layerWeights(m),!0),g.push(Float32Array.from(p));return g}};le.timingOn=(()=>{try{return ne("timing")==="1"}catch{return!1}})(),le.ropeNormOn=(()=>{try{return ne("ropenorm")!=="0"}catch{return!0}})(),le.unpermOn=(()=>{try{return ne("unperm")!=="0"}catch{return!0}})(),le.ropeFactorsOn=(()=>{try{return ne("ropefactors")!=="0"}catch{return!0}})();ye=le});var Ke,De,kt=ae(()=>{"use strict";Ze();Nt();ht();Ke=class Ke extends ye{constructor(t,e,n){super(t,e,n);this.kv=new Map;this.kvSession=""}async mat(t,e,n){let s=this.manifest.tensors[t],i=e??await this.rawTensor(t),a=n??s.nElems;if(this.engine.kqOk&&!Ke.q4Requant&&s.shape[0]%256===0&&(s.type==="Q4_K"||s.type==="Q6_K"&&Ke.q6Native))return this.engine.uploadKq(s.type,i);let u=this.engine.dequantizeToGpu(s.type,i,a),c=Ke.q4Requant&&(s.type==="Q4_K"||s.type==="Q4_0"||s.type==="Q4_1")?this.engine.f32ToQ4Gpu(u,a):this.engine.f32ToQ8Gpu(u,a);return u.destroy?.(),c}up(t){return this.engine.uploadGpu(t)}layerBytes(t){let e=new Array(t).fill(0);for(let[n,s]of Object.entries(this.manifest.tensors)){let i=n.match(/^blk\.(\d+)\./);i&&Number(i[1])<t&&(e[Number(i[1])]+=s.bytes)}return e}dropLayerBytes(t){for(let e of this.rawCache.keys())e.startsWith(`blk.${t}.`)&&this.rawCache.delete(e);this.layerSpan.delete(t)}async embed(t,e){let n=this.manifest.tensors["token_embd.weight"],s=n.type==="Q6_K"?Qe:n.type==="Q4_K"?Ye:null;if(!s)return super.embed(t,e);let i=await this.rawTensor("token_embd.weight"),a=e/256*(n.type==="Q6_K"?210:144),o=this.manifest.config.embedScale??1,u=new Float32Array(t.length*e);for(let c=0;c<t.length;c++){let l=s(i.subarray(t[c]*a,(t[c]+1)*a),e/256);for(let d=0;d<e;d++)u[c*e+d]=l[d]*o}return u}async getProjectionQ8(t){if(this.projQ8)return this.projQ8;let e=this.manifest.tensors["output.weight"]?"output.weight":"token_embd.weight",n=this.manifest.tensors[e];if(!["Q6_K","Q4_K","Q5_K","Q8_0","Q4_0","Q5_0"].includes(n.type))return super.getProjectionQ8(t);let i=n.nElems/t;this.projVocab=i;let a=await this.rawTensor(e),o=n.bytes/i;if(n.type==="Q6_K"&&this.engine.kqOk&&!Ke.q4Requant&&Ke.q6Native){let p=Math.max(1,Math.floor(this.engine.maxStorageBufferBindingSize*.9/o)),g=[];for(let m=0;m<i;m+=p){let w=Math.min(p,i-m);g.push({w:this.engine.uploadKq("Q6_K",a.subarray(m*o,(m+w)*o)),rows:w,r0:m})}return this.projQ8=g,g}let u=Math.max(1,Math.floor(Math.min(this.engine.maxStorageBufferBindingSize*.9,256<<20)/(t*4))),c=[],l=globalThis,d=this.engine.device.createBuffer({size:u*t*4,usage:l.GPUBufferUsage.STORAGE|l.GPUBufferUsage.COPY_DST|l.GPUBufferUsage.COPY_SRC});for(let p=0;p<i;p+=u){let g=Math.min(u,i-p);this.engine.dequantizeIntoGpu(n.type,a.subarray(p*o,(p+g)*o),g*t,d),c.push({w:this.engine.f32ToQ8Gpu(d,g*t),rows:g,r0:p}),await this.engine.settleGpu()}return d.destroy(),e==="output.weight"&&this.rawCache.delete(e),this.projQ8=c,c}ensureKv(t,e,n){let s=this.kv.get(t);if(s&&s.cap>=e)return s;let i=Math.max(e,(s?.cap??0)+1024,1024),a=globalThis,o=()=>this.engine.device.createBuffer({size:i*n*4,usage:a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST|a.GPUBufferUsage.COPY_SRC}),u=o(),c=o();if(s){let d=this.engine.device.createCommandEncoder();d.copyBufferToBuffer(s.k,0,u,0,s.cap*n*4),d.copyBufferToBuffer(s.v,0,c,0,s.cap*n*4),this.engine.device.queue.submit([d.finish()]),s.k.destroy?.(),s.v.destroy?.()}let l={k:u,v:c,cap:i};return this.kv.set(t,l),l}resetState(){for(let t of this.kv.values())t.k.destroy?.(),t.v.destroy?.();this.kv.clear(),this.kvSession=""}reset(){this.resetState(),super.reset()}async prepare(t,e,n){(n!==this.kvSession||e===0)&&(this.resetState(),this.kvSession=n);let{d:s}=this.manifest.config,[i,a,o]=await Promise.all([this.embed(t,s),this.prepareInputs(t),this.getProjectionQ8(s)]);return await this.getFinalNormGpu(),{embeds:i,extra:a,tiles:o}}recordTopK(t,e,n,s,i,a,o=64){let u=this.engine,c=this.manifest.config.finalLogitSoftcap??0;if(c>0){let p=u.uniform([s],{offset:4,value:c});u.recordPass(t,"softcap_logits",[p,n],u.grid1D(s)),e.push(p)}if(a&&a!==1&&i.length){let p=Uint32Array.from(i),g=u.storage(Math.max(16,p.byteLength));e.push(g),u.device.queue.writeBuffer(g,0,p);let m=u.uniform([p.length],{offset:4,value:a});u.recordPass(t,"penalize_logits",[m,g,n],u.grid1D(p.length)),e.push(m)}let l=u.storage(o*2*4);e.push(l);let d=u.uniform([s,o]);return e.push(d),u.recordPass(t,u.topKParOk?"top_k_par":"top_k",[d,n,l],[1,1,1]),l}recordHead(t,e,n,s,i){let a=this.engine,{d:o}=this.manifest.config,u=this.projVocab,c=a.storage(s*u*4);e.push(c);for(let l of i){let d=a.recMM(t,e,n,l.w,s,o,l.rows,!1);for(let p=0;p<s;p++)t.copyBufferToBuffer(d,p*l.rows*4,c,(p*u+l.r0)*4,l.rows*4)}return c}async readTopKs(t,e,n=64){let s=this.engine,i=globalThis,a=s.device.createBuffer({size:e.length*n*8,usage:i.GPUBufferUsage.COPY_DST|i.GPUBufferUsage.MAP_READ});e.forEach((u,c)=>t.copyBufferToBuffer(u,0,a,c*n*8,n*8)),s.device.queue.submit([t.finish()]),await a.mapAsync(i.GPUMapMode.READ);let o=new Uint32Array(a.getMappedRange().slice(0));return a.unmap(),a.destroy(),e.map((u,c)=>({ids:o.slice(c*2*n,c*2*n+n),vals:new Float32Array(o.buffer,(c*2*n+n)*4,n)}))}async topKKV(t,e,n,s,i){let a=this.engine,{embeds:o,extra:u,tiles:c}=await this.prepare(t,e,n),l=[],d=a.device.createCommandEncoder(),p=this.recordForward(d,l,o,u,t.length,e),g=this.recordHead(d,l,p,1,c),m=this.recordTopK(d,l,g,this.projVocab,s,i),[w]=await this.readTopKs(d,[m]);return a.release(l),w}async logitsKV(t,e,n){let s=this.engine,i=ye.timingOn?(q,F)=>console.info(`[timing:graph] ${q} ${(performance.now()-F).toFixed(1)} ms`):null,a=performance.now(),{embeds:o,extra:u,tiles:c}=await this.prepare(t,e,n);i?.("pr\xE9paration CPU",a),a=performance.now();let{d:l}=this.manifest.config,d=this.projVocab,p=[],g=s.device.createCommandEncoder(),m=this.recordForward(g,p,o,u,t.length,e),w=s.storage(d*4);p.push(w);for(let q of c){let F=s.recMM(g,p,m,q.w,1,l,q.rows,!1);g.copyBufferToBuffer(F,0,w,q.r0*4,q.rows*4)}i?.(`enregistrement (${p.length} buffers)`,a),a=performance.now(),s.device.queue.submit([g.finish()]);let v=await s.readBack(w,d*4);i?.("GPU (submit \u2192 readback)",a),s.release(p);let x=this.manifest.config.finalLogitSoftcap??0;if(x>0)for(let q=0;q<v.length;q++)v[q]=x*Math.tanh(v[q]/x);return v}};Ke.q4Requant=(()=>{try{return ne("q4req")==="1"}catch{return!1}})(),Ke.q6Native=(()=>{try{return ne("q6k")==="1"}catch{return!1}})();De=Ke});var Fn,Wt,Mn=ae(()=>{"use strict";Ze();Nt();it();kt();Fn="per_layer_token_embd.weight",Wt=class extends De{constructor(t,e,n){super(t,e,n);this.layers=[];this.ones256=null;this.ones512=null;this.ropeFf=null;this.pleNormW=null;this.pleChunks=new Map;this.pleProjCache=null;if(!n.config.gemma4)throw new Error("Gemma4Model : manifeste sans config gemma4")}get g4(){return this.manifest.config.gemma4}async loadLayer(t){await this.ensureLayerSpan(t);let e=`blk.${t}`,n=t<this.g4.nLayerKv,s=async G=>this.up(await this.dequant(`${e}.${G}.weight`)),[i,a,o,u,c,l,d]=await Promise.all([s("attn_norm"),s("attn_q_norm"),n?s("attn_k_norm"):Promise.resolve(void 0),s("post_attention_norm"),s("ffn_norm"),s("post_ffw_norm"),s("post_norm")]),p=this.manifest.tensors[`${e}.layer_output_scale.weight`]?(await this.dequant(`${e}.layer_output_scale.weight`))[0]:1,g=await this.mat(`${e}.attn_q.weight`),m=n?await this.mat(`${e}.attn_k.weight`):void 0,w=n&&this.manifest.tensors[`${e}.attn_v.weight`]?await this.mat(`${e}.attn_v.weight`):void 0,v=await this.mat(`${e}.attn_output.weight`),x=await this.mat(`${e}.ffn_gate.weight`),q=await this.mat(`${e}.ffn_up.weight`),F=await this.mat(`${e}.ffn_down.weight`),R=await this.mat(`${e}.inp_gate.weight`),K=await this.mat(`${e}.proj.weight`),P=await this.pleProjection(t);return this.dropLayerBytes(t),{attnNorm:i,qNorm:a,kNorm:o,postAttnNorm:u,ffnNorm:c,postFfnNorm:l,postNorm:d,wq:g,wk:m,wv:w,wo:v,wgate:x,wup:q,wdown:F,inpGate:R,proj:K,wPle:P,outScale:p}}async pleProjection(t){let e="per_layer_model_proj.weight",n=this.manifest.tensors[e],{d:s}=this.manifest.config,i=this.g4.perLayer;this.pleProjCache||(this.pleProjCache=await this.rawTensor(e));let a=this.pleProjCache,o=i*s,u=new Float32Array(o),c=1/Math.sqrt(s);if(n.type==="BF16"){let p=new Uint16Array(a.buffer,a.byteOffset+t*o*2,o),g=new Uint32Array(u.buffer);for(let m=0;m<o;m++)g[m]=p[m]<<16;for(let m=0;m<o;m++)u[m]*=c}else if(n.type==="F32"){u.set(new Float32Array(a.buffer.slice(a.byteOffset+t*o*4,a.byteOffset+(t+1)*o*4)));for(let p=0;p<o;p++)u[p]*=c}else throw new Error(`Gemma 4 : per_layer_model_proj en ${n.type} non g\xE9r\xE9 (BF16/F32 attendus)`);let l=this.up(u),d=this.engine.f32ToQ8Gpu(l,o);return l.destroy?.(),d}async prewarmGpu(t){if(!this.engine.gemma4Ok)throw new Error("Gemma 4 indisponible sur ce GPU (selfValidate, ou ?gemma4=0).");let{blockCount:e,d:n}=this.manifest.config,s=this.layerBytes(e),i=s.reduce((c,l)=>c+l,0),a=0;this.ones256=this.up(new Float32Array(this.g4.headDimSwa).fill(1)),this.ones512=this.up(new Float32Array(this.manifest.config.headDim).fill(1));let o=this.manifest.tensors["rope_freqs.weight"]?await this.dequant("rope_freqs.weight"):new Float32Array(this.manifest.config.headDim/2).fill(1);this.ropeFf=this.up(o);let u=await this.dequant("per_layer_proj_norm.weight");this.pleNormW=this.up(u.map(c=>c*Math.SQRT1_2));for(let c=0;c<e;c++)this.layers[c]=await this.loadLayer(c),await this.engine.settleGpu(),a+=s[c],t?.(a,i);this.pleProjCache=null,this.rawCache.delete("per_layer_model_proj.weight"),await this.getFinalNormGpu(),await this.getProjectionQ8(n),await this.engine.settleGpu()}async pleChunk(t){let e=this.pleChunks.get(t);if(e)return this.pleChunks.delete(t),this.pleChunks.set(t,e),e;let n=this.manifest.tensors[Fn],s=t*Me,i=await this.source.bytes(n.offset+s,Math.min(Me,n.bytes-s));return this.pleChunks.set(t,i),this.pleChunks.size>32&&this.pleChunks.delete(this.pleChunks.keys().next().value),i}async pleRow(t){let e=this.manifest.tensors[Fn],n=e.shape[0];if(e.type!=="Q6_K")throw new Error(`Gemma 4 : table PLE en ${e.type} non g\xE9r\xE9e (Q6_K attendu)`);let s=n/256*210,i=t*s,a=Math.floor(i/Me),o=Math.floor((i+s-1)/Me),u;if(a===o)u=(await this.pleChunk(a)).subarray(i-a*Me,i-a*Me+s);else{let d=await this.pleChunk(a),p=await this.pleChunk(o);u=new Uint8Array(s);let g=o*Me-i;u.set(d.subarray(i-a*Me),0),u.set(p.subarray(0,s-g),g)}let c=Qe(u,n/256),l=Math.sqrt(this.g4.perLayer)*Math.SQRT1_2;for(let d=0;d<c.length;d++)c[d]*=l;return c}async pleInputs(t){let e=this.manifest.config.blockCount,n=this.g4.perLayer,s=t.length,i=new Float32Array(e*s*n);for(let a=0;a<s;a++){let o=await this.pleRow(t[a]);for(let u=0;u<e;u++)i.set(o.subarray(u*n,(u+1)*n),(u*s+a)*n)}return i}prepareInputs(t){return this.pleInputs(t)}unload(){this.resetState();for(let t of this.layers)for(let e of Object.values(t))typeof e!="number"&&ye.destroyWeight(e);this.layers=[];for(let t of[this.ones256,this.ones512,this.ropeFf,this.pleNormW])t?.destroy?.();this.pleChunks.clear(),super.unload()}recordForward(t,e,n,s,i,a,o,u){let c=this.engine,l=this.manifest.config,d=this.g4,{d:p,nHeads:g,nKvHeads:m,ffn:w,rmsEps:v}=l,x=d.perLayer,q=a+i,F=h=>{let y=c.storage(h.byteLength);return c.device.queue.writeBuffer(y,0,h),e.push(y),y},R=F(n),K=R,P=F(s);for(let h=0;h<l.blockCount;h++){let y=e.length,b=this.layers[h],k=(J,te,re)=>(u&&u.layer===h&&u.out.set(J,{buf:te,cols:re}),te),A=d.swa[h],B=A?d.headDimSwa:l.headDim,U=A?d.ropeThetaSwa:l.ropeTheta,M=g*B,O=m*B,T=(J,te,re)=>A?c.recRope(t,e,J,te,B,re,a,U,!1):c.recRopeFactors(t,e,J,this.ropeFf,te,B,re,a,U,!1),S=c.storage(i*x*4);e.push(S),t.copyBufferToBuffer(P,h*i*x*4,S,0,i*x*4);let L=c.recRmsnorm(t,e,c.recMM(t,e,K,b.wPle,i,p,x,!1),this.pleNormW,i,x,v),E=k("inp_per_layer (permuted) (cont) (view)",c.recBinary(t,e,"add",L,S,i*x),x);h===0&&k("inp_scaled",R,p);let Q=k(`attn_norm-${h}`,c.recRmsnorm(t,e,R,b.attnNorm,i,p,v),p),H=c.recMM(t,e,Q,b.wq,i,p,M,!1);H=T(c.recRmsnorm(t,e,H,b.qNorm,i*g,B,v),i*g,g);let W=d.kvSrc[h],$=this.ensureKv(W,q,O);if(W===h){let J=c.recMM(t,e,Q,b.wk,i,p,O,!1),te=b.wv?c.recMM(t,e,Q,b.wv,i,p,O,!1):J,re=T(c.recRmsnorm(t,e,J,b.kNorm,i*m,B,v),i*m,m),ue=c.recRmsnorm(t,e,te,A?this.ones256:this.ones512,i*m,B,v);t.copyBufferToBuffer(re,0,$.k,a*O*4,i*O*4),t.copyBufferToBuffer(ue,0,$.v,a*O*4,i*O*4)}let D=k(`kqv_out-${h}`,c.recAttention(t,e,H,$.k,$.v,i,g,m,B,q,a,1,0,A?d.window:0),M),C=c.recRmsnorm(t,e,c.recMM(t,e,D,b.wo,i,M,p,!1),b.postAttnNorm,i,p,v),j=k(`attn_out-${h}`,c.recBinary(t,e,"add",C,R,i*p),p),N=c.recRmsnorm(t,e,j,b.ffnNorm,i,p,v),I=c.recBinary(t,e,"geglu",c.recMM(t,e,N,b.wgate,i,p,w,!1),c.recMM(t,e,N,b.wup,i,p,w,!1),i*w),Y=c.recRmsnorm(t,e,k(`ffn_out-${h}`,c.recMM(t,e,I,b.wdown,i,w,p,!1),p),b.postFfnNorm,i,p,v),V=k(`pe_in-${h}`,c.recBinary(t,e,"add",Y,j,i*p),p),z=c.recBinary(t,e,"geglu",c.recMM(t,e,V,b.inpGate,i,p,x,!1),E,i*x),X=k(`per_layer_embd_out-${h}`,c.recRmsnorm(t,e,c.recMM(t,e,z,b.proj,i,x,p,!1),b.postNorm,i,p,v),p),Z=c.recBinary(t,e,"add",V,X,i*p);R=b.outScale!==1?c.recScale(t,e,Z,b.outScale,i*p):Z,k(`l_out-${h}`,R,p),o?.push(R),!o&&!u&&c.recycleStorage(e.slice(y).filter(J=>J!==R))}let G=c.recRmsnorm(t,e,R,this.finalNormGpu,i,p,v),_=c.storage(p*4);return e.push(_),t.copyBufferToBuffer(G,(i-1)*p*4,_,0,p*4),_}async debugLayerOutputs(t){let e=this.engine,{embeds:n,extra:s}=await this.prepare(t,0,"debug-layers"),{d:i}=this.manifest.config,a=[],o=[],u=e.device.createCommandEncoder();this.recordForward(u,a,n,s,t.length,0,o),e.device.queue.submit([u.finish()]);let c=[];for(let l of o)c.push(await e.readBack(l,t.length*i*4));return e.release(a),c}async debugLayerSteps(t,e){let n=this.engine,{embeds:s,extra:i}=await this.prepare(t,0,"debug-steps"),a=[],o={layer:e,out:new Map},u=n.device.createCommandEncoder();this.recordForward(u,a,s,i,t.length,0,void 0,o),n.device.queue.submit([u.finish()]);let c=new Map;for(let[l,{buf:d,cols:p}]of o.out)c.set(l,{data:await n.readBack(d,t.length*p*4),cols:p});return n.release(a),c}}});function ui(f,r){let t={Q4_K:144,Q5_K:176,Q6_K:210,Q8_K:292},e={Q8_0:34,Q4_0:18,Q4_1:20,Q5_0:22,Q5_1:24};if(t[f])return r/256*t[f];if(e[f])return r/32*e[f];if(f==="F16"||f==="BF16")return r*2;if(f==="F32")return r*4;throw new Error(`Spark : type ${f} non g\xE9r\xE9 pour attn_qkv`)}var It,On=ae(()=>{"use strict";Ze();kt();It=class extends De{constructor(t,e,n){super(t,e,n);this.layers=[];if(!n.config.spark)throw new Error("SparkModel : manifeste sans config spark")}get sp(){return this.manifest.config.spark}async loadLayer(t){await this.ensureLayerSpan(t);let e=`blk.${t}`,{d:n,nHeads:s,nKvHeads:i,headDim:a}=this.manifest.config,[o,u]=await Promise.all([this.dequant(`${e}.attn_norm.weight`).then(_=>this.up(_)),this.dequant(`${e}.ffn_norm.weight`).then(_=>this.up(_))]),c=`${e}.attn_qkv.weight`,l=this.manifest.tensors[c],d=await this.rawTensor(c),p=ui(l.type,n),g=s*a,m=i*a,w=(_,h)=>this.mat(c,d.subarray(_*p,(_+h)*p),h*n),v=await w(0,g),x=await w(g,m),q=await w(g+m,m),F=await this.mat(`${e}.attn_gate.weight`),R=await this.mat(`${e}.attn_output.weight`),K=await this.mat(`${e}.ffn_gate.weight`),P=await this.mat(`${e}.ffn_up.weight`),G=await this.mat(`${e}.ffn_down.weight`);return this.dropLayerBytes(t),{attnNorm:o,ffnNorm:u,wq:v,wk:x,wv:q,wg:F,wo:R,wgate:K,wup:P,wdown:G}}async prewarmGpu(t){if(!this.engine.sparkOk)throw new Error("Spark-X2.5 indisponible sur ce GPU (selfValidate, ou ?spark=0).");let{blockCount:e,d:n}=this.manifest.config,s=this.layerBytes(e),i=s.reduce((o,u)=>o+u,0),a=0;for(let o=0;o<e;o++)this.layers[o]=await this.loadLayer(o),await this.engine.settleGpu(),a+=s[o],t?.(a,i);await this.getFinalNormGpu(),await this.getProjectionQ8(n),await this.engine.settleGpu()}prepareInputs(){return Promise.resolve(null)}unload(){this.resetState();for(let t of this.layers)for(let e of Object.values(t))ye.destroyWeight(e);this.layers=[],super.unload()}recordForward(t,e,n,s,i,a,o){let u=this.engine,c=this.manifest.config,l=this.sp,{d,nHeads:p,nKvHeads:g,headDim:m,ffn:w,rmsEps:v}=c,x=p*m,q=g*m,F=a+i,R=u.storage(n.byteLength);e.push(R),u.device.queue.writeBuffer(R,0,n);let K=R;for(let _=0;_<c.blockCount;_++){let h=e.length,y=this.layers[_],b=l.swa[_],k=b?l.ropeThetaSwa:c.ropeTheta,A=b?l.nRotSwa:l.nRot,B=(D,C)=>A>=m?u.recRope(t,e,D,i*C,m,C,a,k,!1):u.recRopePartial(t,e,D,i*C,m,C,a,k,A),U=u.recRmsnorm(t,e,K,y.attnNorm,i,d,v),M=B(u.recMM(t,e,U,y.wq,i,d,x,!1),p),O=B(u.recMM(t,e,U,y.wk,i,d,q,!1),g),T=u.recMM(t,e,U,y.wv,i,d,q,!1),S=this.ensureKv(_,F,q);t.copyBufferToBuffer(O,0,S.k,a*q*4,i*q*4),t.copyBufferToBuffer(T,0,S.v,a*q*4,i*q*4);let L=u.recAttention(t,e,M,S.k,S.v,i,p,g,m,F,a,1/Math.sqrt(m),0,b?l.window:0),E=u.recMM(t,e,U,y.wg,i,d,p,!1),Q=u.recHeadGate(t,e,L,E,i*x,m),H=u.recBinary(t,e,"add",u.recMM(t,e,Q,y.wo,i,x,d,!1),K,i*d),W=u.recRmsnorm(t,e,H,y.ffnNorm,i,d,v),$=u.recBinary(t,e,"geglu",u.recMM(t,e,W,y.wgate,i,d,w,!1),u.recMM(t,e,W,y.wup,i,d,w,!1),i*w);K=u.recBinary(t,e,"add",u.recMM(t,e,$,y.wdown,i,w,d,!1),H,i*d),o?.push(K),o||u.recycleStorage(e.slice(h).filter(D=>D!==K))}let P=u.recRmsnorm(t,e,K,this.finalNormGpu,i,d,v),G=u.storage(d*4);return e.push(G),t.copyBufferToBuffer(P,(i-1)*d*4,G,0,d*4),G}async debugLayerOutputs(t){let e=this.engine,{embeds:n}=await this.prepare(t,0,"debug-layers"),{d:s}=this.manifest.config,i=[],a=[],o=e.device.createCommandEncoder();this.recordForward(o,i,n,null,t.length,0,a),e.device.queue.submit([o.finish()]);let u=[];for(let c of a)u.push(await e.readBack(c,t.length*s*4));return e.release(i),u}}});var Vt,Cn=ae(()=>{"use strict";Ze();kt();Vt=class extends De{constructor(t,e,n){super(t,e,n);this.layers=[];this.finalNormW=null;let s=n.config.k2h;if(!s)throw new Error("K2hModel : manifeste sans config k2h");if(s.nExpert>0)throw new Error("K2-Horizon : variante \xE0 experts (MoE/MoVA) non g\xE9r\xE9e \u2014 seul le mod\xE8le dense l'est");if(n.tensors["blk.0.attn_q_norm.weight"]||n.tensors["blk.0.attn_gate.weight"])throw new Error("K2-Horizon : q/k norm ou porte d'attention non g\xE9r\xE9es")}get groups(){return this.manifest.config.k2h.normGroups}async loadLayer(t){await this.ensureLayerSpan(t);let e=`blk.${t}`,n=async i=>this.up(await this.dequant(`${e}.${i}.weight`)),s={attnNorm:await n("attn_norm"),ffnNorm:await n("ffn_norm"),wq:await this.mat(`${e}.attn_q.weight`),wk:await this.mat(`${e}.attn_k.weight`),wv:await this.mat(`${e}.attn_v.weight`),wo:await this.mat(`${e}.attn_output.weight`),wgate:await this.mat(`${e}.ffn_gate.weight`),wup:await this.mat(`${e}.ffn_up.weight`),wdown:await this.mat(`${e}.ffn_down.weight`)};return this.dropLayerBytes(t),s}async prewarmGpu(t){if(!this.engine.k2hOk)throw new Error("K2-Horizon indisponible sur ce GPU (selfValidate, ou ?k2h=0).");let{blockCount:e,d:n}=this.manifest.config,s=this.layerBytes(e),i=s.reduce((o,u)=>o+u,0),a=0;for(let o=0;o<e;o++)this.layers[o]=await this.loadLayer(o),await this.engine.settleGpu(),a+=s[o],t?.(a,i);this.finalNormW=this.up(await this.dequant("output_norm.weight")),await this.getProjectionQ8(n),await this.engine.settleGpu()}prepareInputs(){return Promise.resolve(null)}unload(){this.resetState();for(let t of this.layers)for(let e of Object.values(t))ye.destroyWeight(e);this.layers=[],this.finalNormW?.destroy?.(),super.unload()}recordForward(t,e,n,s,i,a){let o=this.engine,u=this.manifest.config,{d:c,nHeads:l,nKvHeads:d,headDim:p,ffn:g,rmsEps:m,ropeTheta:w}=u,v=this.groups,x=l*p,q=d*p,F=a+i,R=o.storage(n.byteLength);e.push(R),o.device.queue.writeBuffer(R,0,n);let K=R;for(let _=0;_<u.blockCount;_++){let h=e.length,y=this.layers[_],b=o.recRmsnormGrouped(t,e,K,y.attnNorm,i,c,v,m),k=o.recRope(t,e,o.recMM(t,e,b,y.wq,i,c,x,!1),i*l,p,l,a,w,!1),A=o.recRope(t,e,o.recMM(t,e,b,y.wk,i,c,q,!1),i*d,p,d,a,w,!1),B=o.recMM(t,e,b,y.wv,i,c,q,!1),U=this.ensureKv(_,F,q);t.copyBufferToBuffer(A,0,U.k,a*q*4,i*q*4),t.copyBufferToBuffer(B,0,U.v,a*q*4,i*q*4);let M=o.recAttention(t,e,k,U.k,U.v,i,l,d,p,F,a,1/Math.sqrt(p),0,0),O=o.recBinary(t,e,"add",o.recMM(t,e,M,y.wo,i,x,c,!1),K,i*c),T=o.recRmsnormGrouped(t,e,O,y.ffnNorm,i,c,v,m),S=o.recBinary(t,e,"swiglu",o.recMM(t,e,T,y.wgate,i,c,g,!1),o.recMM(t,e,T,y.wup,i,c,g,!1),i*g);K=o.recBinary(t,e,"add",o.recMM(t,e,S,y.wdown,i,g,c,!1),O,i*c),o.recycleStorage(e.slice(h).filter(L=>L!==K))}let P=o.recRmsnormGrouped(t,e,K,this.finalNormW,i,c,v,m),G=o.storage(c*4);return e.push(G),t.copyBufferToBuffer(P,(i-1)*c*4,G,0,c*4),G}}});var Xt,Yt,Tn=ae(()=>{"use strict";Ze();kt();ht();Xt=class Xt extends De{constructor(t,e,n){super(t,e,n);this.layers=[];this.mtp=null;this.convState=new Map;this.ssmState=new Map;this.convSnap=new Map;this.ssmSnap=new Map;this.hLast=null;this.hVerify=null;if(!n.config.qwen35)throw new Error("Qwen35Model : manifeste sans config qwen35")}get q(){return this.manifest.config.qwen35}get nLayer(){return this.q.nLayer}isRecurrent(t){return(t+1)%this.q.fullAttnInterval!==0}get ssm(){let t=this.q.dState,e=this.q.nGroup,n=this.q.dtRank;return{S:t,Hk:e,Hv:n,kOff:e*t,vOff:2*e*t,C:2*e*t+n*t,dInner:n*t}}async splitQGate(t){let e=await this.rawTensor(t),{nHeads:n,headDim:s,d:i}=this.manifest.config,a=2*n*s,o=e.byteLength/a;if(!Number.isInteger(o))throw new Error(`${t} : lignes non uniformes`);let u=new Uint8Array(n*s*o),c=new Uint8Array(n*s*o);for(let d=0;d<n;d++){let p=d*2*s*o,g=d*s*o,m=s*o;u.set(e.subarray(p,p+m),g),c.set(e.subarray(p+m,p+2*m),g)}let l=n*s*i;return[await this.mat(t,u,l),await this.mat(t,c,l)]}async splitEh(t){let e=await this.rawTensor(t),{d:n}=this.manifest.config,s=e.byteLength/n,i=s/2;if(!Number.isInteger(i))throw new Error(`${t} : lignes non coupables en deux`);let a=new Uint8Array(n*i),o=new Uint8Array(n*i);for(let u=0;u<n;u++)a.set(e.subarray(u*s,u*s+i),u*i),o.set(e.subarray(u*s+i,(u+1)*s),u*i);return[await this.mat(t,a,n*n),await this.mat(t,o,n*n)]}async loadAttn(t){let e=async i=>this.up(await this.dequant(`${t}.${i}`)),[n,s]=await this.splitQGate(`${t}.attn_q.weight`);return{wq:n,wqGate:s,wk:await this.mat(`${t}.attn_k.weight`),wv:await this.mat(`${t}.attn_v.weight`),wo:await this.mat(`${t}.attn_output.weight`),qNorm:await e("attn_q_norm.weight"),kNorm:await e("attn_k_norm.weight")}}async loadLayer(t){await this.ensureLayerSpan(t);let e=`blk.${t}`,n=async a=>this.up(await this.dequant(`${e}.${a}`)),s=this.isRecurrent(t),i={recurrent:s,attnNorm:await n("attn_norm.weight"),ffnNorm:await n("post_attention_norm.weight")};return this.q.moe?i.moe={router:await n("ffn_gate_inp.weight"),gateExps:await this.experts(`${e}.ffn_gate_exps.weight`),upExps:await this.experts(`${e}.ffn_up_exps.weight`),downExps:await this.experts(`${e}.ffn_down_exps.weight`),shGate:await this.mat(`${e}.ffn_gate_shexp.weight`),shUp:await this.mat(`${e}.ffn_up_shexp.weight`),shDown:await this.mat(`${e}.ffn_down_shexp.weight`),shInp:await n("ffn_gate_inp_shexp.weight")}:(i.wgate=await this.mat(`${e}.ffn_gate.weight`),i.wup=await this.mat(`${e}.ffn_up.weight`),i.wdown=await this.mat(`${e}.ffn_down.weight`)),s?(i.wqkv=await this.mat(`${e}.attn_qkv.weight`),i.wz=await this.mat(`${e}.attn_gate.weight`),i.walpha=await this.mat(`${e}.ssm_alpha.weight`),i.wbeta=await this.mat(`${e}.ssm_beta.weight`),i.conv=await n("ssm_conv1d.weight"),i.dt=await n("ssm_dt.bias"),i.A=await n("ssm_a"),i.ssmNorm=await n("ssm_norm.weight"),i.wout=await this.mat(`${e}.ssm_out.weight`)):i.attn=await this.loadAttn(e),this.dropLayerBytes(t),i}async experts(t){let e=this.manifest.tensors[t];if(e.type!=="Q4_K"&&e.type!=="Q6_K"||e.shape[0]%256!==0)throw new Error(`MoE : ${t} en ${e.type} (k = ${e.shape[0]}) non g\xE9r\xE9 \u2014 Q4_K/Q6_K, k multiple de 256`);return this.engine.uploadKq(e.type,await this.rawTensor(t))}async loadMtp(){let t=this.nLayer,e=`blk.${t}`;if(!this.manifest.tensors[`${e}.nextn.eh_proj.weight`]||!this.manifest.tensors[`${e}.attn_q.weight`])return null;await this.ensureLayerSpan(t);let n=async u=>this.up(await this.dequant(u)),[s,i]=await this.splitEh(`${e}.nextn.eh_proj.weight`),a=this.manifest.tensors[`${e}.nextn.shared_head_norm.weight`]?`${e}.nextn.shared_head_norm.weight`:"output_norm.weight",o={we:s,wh:i,enorm:await n(`${e}.nextn.enorm.weight`),hnorm:await n(`${e}.nextn.hnorm.weight`),headNorm:await n(a),attnNorm:await n(`${e}.attn_norm.weight`),attn:await this.loadAttn(e),ffnNorm:await n(`${e}.post_attention_norm.weight`),wgate:await this.mat(`${e}.ffn_gate.weight`),wup:await this.mat(`${e}.ffn_up.weight`),wdown:await this.mat(`${e}.ffn_down.weight`)};return this.dropLayerBytes(t),o}async prewarmGpu(t){if(!this.engine.qwen35SsmOk)throw new Error("Qwen 3.5 indisponible sur ce GPU (selfValidate, ou ?qwen35ssm=0).");if(this.q.moe&&!this.engine.moeOk)throw new Error("Mod\xE8le \xE0 experts indisponible sur ce GPU (selfValidate MoE, ou ?moe=0).");let{d:e}=this.manifest.config,n=this.layerBytes(this.nLayer),s=n.reduce((u,c)=>u+c,0),i=0;for(let u=0;u<this.nLayer;u++)this.layers[u]=await this.loadLayer(u),await this.engine.settleGpu(),i+=n[u],t?.(i,s);Xt.mtpOn&&this.engine.gemvMOk&&!this.q.moe&&(this.mtp=await this.loadMtp().catch(u=>(console.warn("[qwen35] couche MTP illisible, d\xE9codage classique :",u),null)),await this.engine.settleGpu()),await this.getFinalNormGpu(),await this.getProjectionQ8(e);let a=globalThis,o=u=>this.engine.device.createBuffer({size:u,usage:a.GPUBufferUsage.STORAGE|a.GPUBufferUsage.COPY_DST|a.GPUBufferUsage.COPY_SRC});this.hLast=o(e*4),this.hVerify=o(2*e*4),await this.engine.settleGpu()}resetState(){super.resetState();for(let t of[this.convState,this.ssmState,this.convSnap,this.ssmSnap]){for(let e of t.values())e.destroy?.();t.clear()}}zeroed(t){let e=globalThis;return this.engine.device.createBuffer({size:t,usage:e.GPUBufferUsage.STORAGE|e.GPUBufferUsage.COPY_DST|e.GPUBufferUsage.COPY_SRC})}stateFor(t,e,n){let s=t.get(e);return s||(s=this.zeroed(n),t.set(e,s)),s}prepareInputs(){return Promise.resolve(null)}unload(){this.resetState();let t=n=>"destroy"in n||"codes"in n||"nib"in n||"kq"in n,e=n=>{for(let[s,i]of Object.entries(n))s==="recurrent"||!i||typeof i!="object"||(t(i)?ye.destroyWeight(i):e(i))};for(let n of this.layers)e(n);this.mtp&&e(this.mtp),this.layers=[],this.mtp=null,this.hLast?.destroy?.(),this.hVerify?.destroy?.(),super.unload()}recordAttn(t,e,n,s,i,a,o){let u=this.engine,{d:c,nHeads:l,nKvHeads:d,headDim:p,rmsEps:g,ropeTheta:m}=this.manifest.config,w=o+a,v=d*p,x=l*p,q=u.recMM(t,e,n,s.wq,a,c,x,!1),F=u.recMM(t,e,n,s.wqGate,a,c,x,!1),R=u.recMM(t,e,n,s.wk,a,c,v,!1),K=u.recMM(t,e,n,s.wv,a,c,v,!1);q=u.recRopePartial(t,e,u.recRmsnorm(t,e,q,s.qNorm,a*l,p,g),a*l,p,l,o,m,this.q.nRot);let P=u.recRopePartial(t,e,u.recRmsnorm(t,e,R,s.kNorm,a*d,p,g),a*d,p,d,o,m,this.q.nRot),G=this.ensureKv(i,w,v);t.copyBufferToBuffer(P,0,G.k,o*v*4,a*v*4),t.copyBufferToBuffer(K,0,G.v,o*v*4,a*v*4);let _=u.recAttention(t,e,q,G.k,G.v,a,l,d,p,w,o,1/Math.sqrt(p),0,0),h=u.storage(a*x*4);return e.push(h),u.recordPass(t,"sigmoid",[F,h],u.grid1D(a*x)),u.recMM(t,e,u.recBinary(t,e,"mul",_,h,a*x),s.wo,a,x,c,!1)}recordLayers(t,e,n,s,i,a=!1){let o=this.engine,u=this.manifest.config,{d:c,ffn:l,rmsEps:d}=u,{S:p,Hk:g,Hv:m,kOff:w,vOff:v,C:x,dInner:q}=this.ssm,F=o.storage(n.byteLength);e.push(F),o.device.queue.writeBuffer(F,0,n);for(let R=0;R<this.nLayer;R++){let K=e.length,P=this.layers[R],G=o.recRmsnorm(t,e,F,P.attnNorm,s,c,d),_;if(P.recurrent){let b=this.stateFor(this.convState,R,3*x*4),k=this.stateFor(this.ssmState,R,m*p*p*4),A=a?this.stateFor(this.convSnap,R,3*x*4):void 0,B=a?this.stateFor(this.ssmSnap,R,m*p*p*4):void 0,U=o.recMM(t,e,G,P.wqkv,s,c,x,!1),M=o.recMM(t,e,G,P.wz,s,c,q,!1),O=o.recMM(t,e,G,P.walpha,s,c,m,!1),T=o.recMM(t,e,G,P.wbeta,s,c,m,!1),S=o.recQwen35Conv(t,e,U,P.conv,b,s,x,A,0),L=o.recQwen35Gdn(t,e,S,O,T,P.dt,P.A,k,s,m,g,p,x,w,v,d,B,0),E=o.recRmsnorm(t,e,L,P.ssmNorm,s*m,p,d),Q=o.recBinary(t,e,"swiglu",M,E,s*q);_=o.recMM(t,e,Q,P.wout,s,q,c,!1)}else _=this.recordAttn(t,e,G,P.attn,R,s,i);let h=o.recBinary(t,e,"add",F,_,s*c),y=o.recRmsnorm(t,e,h,P.ffnNorm,s,c,d);if(P.moe)F=o.recBinary(t,e,"add",h,this.recordMoe(t,e,y,P.moe,s),s*c);else{let b=o.recBinary(t,e,"swiglu",o.recMM(t,e,y,P.wgate,s,c,l,!1),o.recMM(t,e,y,P.wup,s,c,l,!1),s*l);F=o.recBinary(t,e,"add",h,o.recMM(t,e,b,P.wdown,s,l,c,!1),s*c)}o.recycleStorage(e.slice(K).filter(b=>b!==F))}return o.recRmsnorm(t,e,F,this.finalNormGpu,s,c,d)}recordMoe(t,e,n,s,i){let a=this.engine,{d:o}=this.manifest.config,{nExpert:u,nUsed:c,ffExp:l,ffShexp:d,scale:p}=this.q.moe,g=a.recMM(t,e,n,s.router,i,o,u,!1),m=a.recMoeRoute(t,e,g,i,u,c,p),w=i>=8&&a.moeGemmOk?a.recMoeGroup(t,e,m.ids,i*c,u):null,v=(_,h,y,b,k)=>w?a.recMoeGemm(t,e,_,h,w,i*c,u,i,y,b,k):a.recMoeGemv(t,e,_,h,m.ids,i*c,y,b,k),x=v(n,s.gateExps,c,o,l),q=v(n,s.upExps,c,o,l),F=a.recBinary(t,e,"swiglu",x,q,i*c*l),R=v(F,s.downExps,1,l,o),K=a.recMoeSum(t,e,R,m.w,i,c,o),P=a.recMM(t,e,a.recBinary(t,e,"swiglu",a.recMM(t,e,n,s.shGate,i,o,d,!1),a.recMM(t,e,n,s.shUp,i,o,d,!1),i*d),s.shDown,i,d,o,!1),G=a.recMM(t,e,n,s.shInp,i,o,1,!1);return a.recBinary(t,e,"add",K,a.recHeadGate(t,e,P,G,i*o,o),i*o)}recordForward(t,e,n,s,i,a){let{d:o}=this.manifest.config,u=this.recordLayers(t,e,n,i,a),c=this.engine.storage(o*4);return e.push(c),t.copyBufferToBuffer(u,(i-1)*o*4,c,0,o*4),c}recordMtp(t,e,n,s,i,a){let o=this.engine,u=this.mtp,{d:c,ffn:l,rmsEps:d}=this.manifest.config,p=o.storage(s.byteLength);e.push(p),o.device.queue.writeBuffer(p,0,s);let g=o.recRmsnorm(t,e,p,u.enorm,i,c,d),m=o.recRmsnorm(t,e,n,u.hnorm,i,c,d),w=o.recBinary(t,e,"add",o.recMM(t,e,g,u.we,i,c,c,!1),o.recMM(t,e,m,u.wh,i,c,c,!1),i*c),v=o.recRmsnorm(t,e,w,u.attnNorm,i,c,d),x=o.recBinary(t,e,"add",w,this.recordAttn(t,e,v,u.attn,this.nLayer,i,a),i*c),q=o.recRmsnorm(t,e,x,u.ffnNorm,i,c,d),F=o.recBinary(t,e,"swiglu",o.recMM(t,e,q,u.wgate,i,c,l,!1),o.recMM(t,e,q,u.wup,i,c,l,!1),i*l),R=o.recBinary(t,e,"add",x,o.recMM(t,e,F,u.wdown,i,l,c,!1),i*c);return o.recRmsnorm(t,e,R,u.headNorm,i,c,d)}speculativeReady(){return!!this.mtp}async specPrefill(t,e,n,s,i){let a=this.engine,{d:o}=this.manifest.config,u=t.length,{embeds:c,tiles:l}=await this.prepare(t,e,n),d=[],p=a.device.createCommandEncoder(),g=this.recordLayers(p,d,c,u,e),m=a.storage(o*4);d.push(m),p.copyBufferToBuffer(g,(u-1)*o*4,m,0,o*4);let w=e===0?1:0,v=u-w;if(v>0){let F=a.storage(v*o*4);d.push(F),w===0&&p.copyBufferToBuffer(this.hLast,0,F,0,o*4),u>1&&p.copyBufferToBuffer(g,0,F,(1-w)*o*4,(u-1)*o*4),this.recordMtp(p,d,F,c.subarray(w*o),v,e+w)}p.copyBufferToBuffer(m,0,this.hLast,0,o*4);let x=this.recordTopK(p,d,this.recordHead(p,d,m,1,l),this.projVocab,s,i),[q]=await this.readTopKs(p,[x]);return a.release(d),q}async specDraft(t,e,n){let s=this.engine,{d:i}=this.manifest.config,a=t.length,o=await this.embed(t,i),u=await this.getProjectionQ8(i),c=[],l=s.device.createCommandEncoder(),d=n==="last"?this.hLast:this.hVerify,p=this.recordMtp(l,c,d,o,a,e),g=s.storage(i*4);c.push(g),l.copyBufferToBuffer(p,(a-1)*i*4,g,0,i*4);let m=this.recordTopK(l,c,this.recordHead(l,c,g,1,u),this.projVocab,[],1,64),[w]=await this.readTopKs(l,[m]);return s.release(c),w.ids[0]}async specVerify(t,e,n,s,i,a,o){let u=this.engine,{d:c}=this.manifest.config,l=this.projVocab,{embeds:d,tiles:p}=await this.prepare([t,e],n,s),g=[],m=u.device.createCommandEncoder(),w=this.recordLayers(m,g,d,2,n,!0);m.copyBufferToBuffer(w,0,this.hVerify,0,2*c*4);let v=this.recordHead(m,g,w,2,p),x=u.storage(l*4);g.push(x),m.copyBufferToBuffer(v,l*4,x,0,l*4);let q=this.recordTopK(m,g,v,l,i,o),F=this.recordTopK(m,g,x,l,a,o),[R,K]=await this.readTopKs(m,[q,F]);return u.release(g),[R,K]}specRollback(){let t=this.engine.device.createCommandEncoder();for(let[e,n]of this.convSnap)t.copyBufferToBuffer(n,0,this.convState.get(e),0,n.size);for(let[e,n]of this.ssmSnap)t.copyBufferToBuffer(n,0,this.ssmState.get(e),0,n.size);this.engine.device.queue.submit([t.finish()])}};Xt.mtpOn=(()=>{try{return ne("mtp")!=="0"}catch{return!0}})();Yt=Xt});function Rn(f){let r=f.metadata;if(String(r["tokenizer.ggml.model"]??"")!=="gemma4")return null;let t=r["tokenizer.ggml.tokens"],e=r["tokenizer.ggml.merges"];if(!Array.isArray(t)||!Array.isArray(e))return null;let n=r["tokenizer.ggml.token_type"]??[],s=c=>Number.isFinite(Number(c))&&c!==void 0?Number(c):null,i=s(r["tokenizer.ggml.bos_token_id"]),a=s(r["tokenizer.ggml.eos_token_id"]),o=new _r(t,n,e,i,!0),u=n.flatMap((c,l)=>c===3?[l]:[]);return{tokenizer:o,bosId:i,eosId:a,controlIds:u}}var _r,Ln=ae(()=>{"use strict";_r=class{constructor(r,t,e,n,s){this.bosId=n;this.addBos=s;this.vocab=new Map;this.ranks=new Map;this.byteIds=new Int32Array(256).fill(-1);this.cache=new Map;this.pieces=r,this.types=t;for(let a=0;a<r.length;a++)this.vocab.set(r[a],a);e.forEach((a,o)=>{let u=a.indexOf(" ",1);u>0&&this.ranks.set(a.slice(0,u)+"\0"+a.slice(u+1),o)});for(let a=0;a<256;a++){let o=this.vocab.get(`<0x${a.toString(16).toUpperCase().padStart(2,"0")}>`);o!==void 0&&(this.byteIds[a]=o)}let i=r.filter((a,o)=>t[o]===3||t[o]===4).sort((a,o)=>o.length-a.length).map(a=>a.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"));this.specialRe=i.length?new RegExp(i.join("|"),"g"):null}encode(r){let t=[];this.addBos&&this.bosId!=null&&t.push(this.bosId);let e=0;if(this.specialRe){this.specialRe.lastIndex=0;for(let n=this.specialRe.exec(r);n;n=this.specialRe.exec(r))n.index>e&&this.encodeSegment(r.slice(e,n.index),t),t.push(this.vocab.get(n[0])),e=n.index+n[0].length}return e<r.length&&this.encodeSegment(r.slice(e),t),t}encodeSegment(r,t){let e=r.replace(/ /g,"\u2581");for(let n of e.match(/[^\n]+|\n+/g)??[]){let s=this.cache.get(n);if(s){t.push(...s);continue}let i=this.encodeWord(n);this.cache.size<2e4&&this.cache.set(n,i),t.push(...i)}}encodeWord(r){if(r[0]===`
`){let n=this.vocab.get(r);if(n!==void 0)return[n]}let t=Array.from(r);for(;t.length>1;){let n=-1,s=1/0;for(let i=0;i<t.length-1;i++){let a=this.ranks.get(t[i]+"\0"+t[i+1]);a!==void 0&&a<s&&(s=a,n=i)}if(n<0)break;t.splice(n,2,t[n]+t[n+1])}let e=[];for(let n of t){let s=this.vocab.get(n);if(s!==void 0){e.push(s);continue}for(let i of new TextEncoder().encode(n))this.byteIds[i]>=0&&e.push(this.byteIds[i])}return e}decode(r){let t=[],e=new TextEncoder;for(let n of r){let s=this.types[n]??1;if(s===3)continue;let i=this.pieces[n];if(i!==void 0){if(s===6){t.push(parseInt(i.slice(3,5),16));continue}for(let a of e.encode(s===4?i:i.replace(/▁/g," ")))t.push(a)}}return new TextDecoder("utf-8",{ignoreBOM:!0}).decode(new Uint8Array(t))}}});async function Jt(f){let r=Math.min(f.size,104857600),e=await f.slice(0,r).arrayBuffer(),n=new Ar(e),s=[String.fromCharCode(n.uint8()),String.fromCharCode(n.uint8()),String.fromCharCode(n.uint8()),String.fromCharCode(n.uint8())].join("");if(s!=="GGUF")throw new Error(`Fichier GGUF invalide. Sceau magique absent : ${s}`);let i=n.uint32();if(i!==2&&i!==3)throw new Error(`Version GGUF non support\xE9e : ${i}`);let a=n.uint64(),o=n.uint64(),u=b=>{switch(b){case 0:return n.uint8();case 1:return n.int8();case 2:return n.uint16();case 3:return n.int16();case 4:return n.uint32();case 5:return n.int32();case 6:return n.float32();case 7:return n.uint8()!==0;case 8:return n.string();case 9:{let k=n.uint32(),A=n.uint64(),B=[];for(let U=0;U<A;U++)B.push(u(k));return B}case 10:return n.uint64();case 11:return n.int64();case 12:return n.float64();default:throw new Error(`Type de m\xE9tadonn\xE9es non support\xE9 : ${b}`)}},c={};for(let b=0;b<o;b++){let k=n.string(),A=n.uint32(),B=u(A);c[k]=B}let l=c["general.alignment"]??32,d=c["general.architecture"]??"llama",p=[];for(let b=0;b<a;b++){let k=n.string(),A=n.uint32(),B=[];for(let O=0;O<A;O++)B.push(n.uint64());let U=n.uint32(),M=n.uint64();p.push({name:k,shape:B,typeIdx:U,relativeOffset:M})}let g=n.getOffset(),m=Math.ceil(g/l)*l,w={};for(let b=0;b<p.length;b++){let k=p[b],A=li[k.typeIdx]||"UNKNOWN",B=k.shape.reduce((M,O)=>M*O,1),U=0;if(b<p.length-1)U=p[b+1].relativeOffset-k.relativeOffset;else{let{block:M,size:O}=fi(A);U=B/M*O}w[k.name]={offset:m+k.relativeOffset,bytes:U,nElems:B,type:A,shape:k.shape}}let v=(b,k)=>{let A=c[`${d}.${b}`];return A!==void 0?Number(A):k},x=(b,k)=>{let A=c[`${d}.${b}`];return A!==void 0?Number(A):k},q=v("embedding_length",0),F=v("attention.head_count",0),R=v("attention.head_count_kv",F),K=v("block_count",0),P=x("rope.freq_base",1e4),G=x("attention.layer_norm_rms_epsilon",1e-5),_=v("attention.key_length",0)||(F>0?q/F:0),h=v("feed_forward_length",0),y={d:q,nHeads:F,nKvHeads:R,headDim:_,ffn:h,blockCount:K,ropeTheta:P,rmsEps:G};if(d==="rwkv7"||d==="rwkv6"){let b=v("wkv.head_size",64);y.headDim=b,y.nHeads=b>0?Math.floor(q/b):0,y.nKvHeads=y.nHeads,y.rwkv={headSize:b,decayLoraRank:v("attention.decay_lora_rank",64),iclrLoraRank:v("attention.iclr_lora_rank",64),valueLoraRank:v("attention.value_residual_mix_lora_rank",32),gateLoraRank:v("attention.gate_lora_rank",128)}}if(d==="lfm2"){let b=c["lfm2.attention.head_count_kv"],k=Array.isArray(b)?b.map(Number):[];y.nKvHeads=k.length?Math.max(...k):F,y.headDim=_||64,y.lfm2={lCache:v("shortconv.l_cache",3),kvHeadsPerLayer:k.length?k:Array(K).fill(y.nKvHeads)}}if(d==="qwen35"||d==="qwen3_5"||d==="qwen35moe"){let b=v("full_attention_interval",4);y.qwen35={fullAttnInterval:b,dConv:v("ssm.conv_kernel",4),dInner:v("ssm.inner_size",2*q),dState:v("ssm.state_size",128),dtRank:v("ssm.time_step_rank",32),nGroup:v("ssm.group_count",16),nRot:v("rope.dimension_count",_),nLayer:K-v("nextn_predict_layers",0),moe:d==="qwen35moe"?{nExpert:v("expert_count",0),nUsed:v("expert_used_count",8),ffExp:v("expert_feed_forward_length",0),ffShexp:v("expert_shared_feed_forward_length",0),scale:x("expert_weights_scale",1)||1}:void 0}}if((d==="gemma"||d==="gemma2")&&(y.act="gelu",y.embedScale=Math.sqrt(q)),d==="gemma2"){y.attnLogitSoftcap=x("attn_logit_softcapping",50),y.finalLogitSoftcap=x("final_logit_softcapping",30);let b=v("attention.query_pre_attn_scalar",0);y.attnScale=b>0?1/Math.sqrt(b):_>0?1/Math.sqrt(_):void 0}{let b=c[`${d}.rope.scaling.type`],k=x("rope.scaling.factor",1);if(b==="yarn"&&k>1&&_>0){y.yarn={factor:k,betaFast:x("rope.scaling.yarn_beta_fast",32),betaSlow:x("rope.scaling.yarn_beta_slow",1),origCtx:v("rope.scaling.original_context_length",0)};let A=1+.1*Math.log(k);y.attnScale=A*A/Math.sqrt(_)}}if(d==="gemma3"){y.act="gelu",y.embedScale=Math.sqrt(q);let b=v("attention.sliding_window",512),k=v("attention.sliding_window_pattern",6)||6,A=x("rope.local_freq_base",1e4),B=U=>(U+1)%k===0;y.windowPerLayer=Array.from({length:K},(U,M)=>B(M)?0:b),y.ropeThetaPerLayer=Array.from({length:K},(U,M)=>B(M)?P:A)}if(d==="gemma4"){let b=c["gemma4.attention.sliding_window_pattern"],k=Array.isArray(b)&&b.length===K?b.map(U=>U===!0||U===1):Array.from({length:K},(U,M)=>(M+1)%6!==0),A=K-v("attention.shared_kv_layers",0),B=U=>{for(let M=A-1;M>=0;M--)if(k[M]===U)return M;return-1};y.act="gelu",y.embedScale=Math.sqrt(q),y.attnScale=1,y.finalLogitSoftcap=x("final_logit_softcapping",0)||void 0,y.gemma4={swa:k,headDimSwa:v("attention.key_length_swa",256),ropeThetaSwa:x("rope.freq_base_swa",1e4),window:v("attention.sliding_window",512),perLayer:v("embedding_length_per_layer_input",0),nLayerKv:A,kvSrc:Array.from({length:K},(U,M)=>M<A?M:B(k[M]))}}if(d==="k2-horizon"&&(y.k2h={normGroups:v("attention.group_norm_groups",1)||1,nExpert:v("expert_count",0)}),d==="spark2_5"){let b=c["spark2_5.attention.sliding_window_pattern"],k=Array.isArray(b)&&b.length===K?b.map(A=>A===!0||A===1):Array.from({length:K},(A,B)=>(B+1)%4!==0);y.act="gelu",y.spark={swa:k,window:v("attention.sliding_window",512),ropeThetaSwa:x("rope.freq_base_swa",P),nRot:v("rope.dimension_count",_),nRotSwa:v("rope.dimension_count_swa",_)}}if(d==="smollm3"){let b=c[`${d}.no_rope_layers`],k=Array.isArray(b)?b.map(Number):[];y.skipRopePerLayer=k.length===K?k.map(A=>A===0):Array.from({length:K},(A,B)=>(B+1)%4===0)}if((d==="llama"||d==="mistral3"||d==="smollm3")&&(y.ropeInterleaved=!0),d==="qwen2vl"){let b=c["qwen2vl.rope.dimension_sections"],k=Array.isArray(b)?b.map(Number).filter(A=>A>0):[];y.mropeSections=k.length===3?k:[16,24,24]}return{arch:d,config:y,tensors:w,metadata:c}}var Ar,ci,li,fi,xr=ae(()=>{"use strict";Ar=class{constructor(r){this.offset=0;this.view=new DataView(r)}getOffset(){return this.offset}setOffset(r){this.offset=r}uint8(){let r=this.view.getUint8(this.offset);return this.offset+=1,r}int8(){let r=this.view.getInt8(this.offset);return this.offset+=1,r}uint16(){let r=this.view.getUint16(this.offset,!0);return this.offset+=2,r}int16(){let r=this.view.getInt16(this.offset,!0);return this.offset+=2,r}uint32(){let r=this.view.getUint32(this.offset,!0);return this.offset+=4,r}int32(){let r=this.view.getInt32(this.offset,!0);return this.offset+=4,r}float32(){let r=this.view.getFloat32(this.offset,!0);return this.offset+=4,r}float64(){let r=this.view.getFloat64(this.offset,!0);return this.offset+=8,r}uint64(){let r=this.view.getUint32(this.offset,!0),t=this.view.getUint32(this.offset+4,!0);return this.offset+=8,r+t*4294967296}int64(){let r=this.view.getUint32(this.offset,!0),t=this.view.getInt32(this.offset+4,!0);return this.offset+=8,r+t*4294967296}string(){let r=this.uint64();if(this.offset+r>this.view.byteLength)throw new Error(`BinaryReader: string length ${r} exceeds buffer size`);let t=new Uint8Array(this.view.buffer,this.offset,r);return this.offset+=r,ci.decode(t)}},ci=new TextDecoder("utf-8",{ignoreBOM:!0}),li=["F32","F16","Q4_0","Q4_1","Q4_2","Q4_3","Q5_0","Q5_1","Q8_0","Q8_1","Q2_K","Q3_K","Q4_K","Q5_K","Q6_K","Q8_K","IQ2_XXS","IQ2_XS","IQ3_XXS","IQ1_S","IQ4_NL","IQ3_S","IQ2_S","IQ4_XS","I8","I16","I32","I64","F64","IQ1_M","BF16","Q4_0_4_4","Q4_0_4_8","Q4_0_8_8","TQ1_0","TQ2_0"],fi=f=>{switch(f){case"F32":return{block:1,size:4};case"F16":return{block:1,size:2};case"Q4_0":return{block:32,size:18};case"Q4_1":return{block:32,size:20};case"Q5_0":return{block:32,size:22};case"Q5_1":return{block:32,size:24};case"Q8_0":return{block:32,size:34};case"Q2_K":return{block:256,size:66};case"Q3_K":return{block:256,size:110};case"Q4_K":return{block:256,size:144};case"Q5_K":return{block:256,size:176};case"Q6_K":return{block:256,size:210};case"Q8_K":return{block:256,size:288};default:throw new Error(`Type GGML non support\xE9 : ${f}. Types lus : F32, F16, Q4_0/1, Q5_0/1, Q8_0, Q2_K\u2026Q8_K.`)}}});function jn(f,r=16){return Math.ceil(f/r)*r}function mi(f){if(f.length>128||f.includes(".."))return!1;let r=f.split("/");return r.length<=2&&r.every(t=>gi.test(t))}function Kn(f){let r=i=>{throw new Error(`BRIK: manifeste invalide \u2014 ${i}`)};(!f||typeof f!="object")&&r("ce n'est pas un objet"),f.format!=="brik"&&r(`champ format \xAB ${String(f.format)} \xBB (attendu \xAB brik \xBB)`),(!$e(f.version,1024)||f.version<1)&&r(`version ${String(f.version)}`),(!f.model||typeof f.model.name!="string"||f.model.name.length>512)&&r("champ model.name");let t=f.arch;(!t||typeof t!="object"||typeof t.arch!="string"||t.arch.length>64)&&r("champ arch.arch");for(let[i,a]of[["d",262144],["nHeads",4096],["nKvHeads",4096],["headDim",4096],["ffn",1048576],["blockCount",1024],["vocab",1e7]])$e(t[i],a)||r(`arch.${i} = ${String(t[i])}`);for(let i of["ropeTheta","rmsEps"])(typeof t[i]!="number"||!Number.isFinite(t[i]))&&r(`arch.${i} = ${String(t[i])}`);f.tokenizer&&(f.tokenizer.kind!=="hf-hub"&&f.tokenizer.kind!=="embedded"&&r(`tokenizer.kind \xAB ${String(f.tokenizer.kind)} \xBB`),f.tokenizer.id&&!mi(f.tokenizer.id)&&r(`tokenizer.id \xAB ${f.tokenizer.id} \xBB (attendu : \xAB auteur/d\xE9p\xF4t \xBB ou une sentinelle sans barre oblique)`)),(!Array.isArray(f.shards)||f.shards.length===0||f.shards.length>Dn)&&r(`${Array.isArray(f.shards)?f.shards.length:"aucun"} shard`);let e=new Map;for(let i of f.shards)$e(i.id,Dn)||r(`shard.id = ${String(i.id)}`),e.has(i.id)&&r(`shard ${i.id} d\xE9clar\xE9 deux fois`),(typeof i.file!="string"||i.file.length>256)&&r(`shard.file du shard ${i.id}`),$e(i.byteLength,Zt)||r(`shard.byteLength du shard ${i.id} = ${String(i.byteLength)}`),e.set(i.id,i.byteLength);(!f.tensors||typeof f.tensors!="object")&&r("champ tensors");let n=Object.keys(f.tensors);(n.length===0||n.length>di)&&r(`${n.length} tenseurs`);let s=0;for(let i of n){let a=f.tensors[i];(!a||typeof a!="object")&&r(`tenseur ${i}`),pi.includes(a.dtype)||r(`dtype \xAB ${String(a.dtype)} \xBB du tenseur ${i}`),(!Array.isArray(a.shape)||a.shape.length>8||!a.shape.every(u=>$e(u,2**32)))&&r(`shape du tenseur ${i}`),$e(a.nElems,2**40)||r(`nElems du tenseur ${i}`),(!$e(a.offset,Zt)||!$e(a.byteLength,Zt))&&r(`offset/byteLength du tenseur ${i}`);let o=e.get(a.shard);o===void 0&&r(`le tenseur ${i} r\xE9f\xE9rence le shard ${String(a.shard)}, absent du manifeste`),a.offset+a.byteLength>o&&r(`le tenseur ${i} d\xE9passe son shard (${a.offset}+${a.byteLength} > ${o})`),s+=a.byteLength}return s>Zt&&r(`${s} octets de tenseurs au total`),f}var Dn,di,Zt,pi,gi,$e,En=ae(()=>{"use strict";Dn=4096,di=2e5,Zt=64*1024*1024*1024,pi=["f16","f32","q4","q8","q3"],gi=/^[A-Za-z0-9._-]+$/;$e=(f,r)=>typeof f=="number"&&Number.isInteger(f)&&f>=0&&f<=r});function bi(f){return jn(_t+f)}function Pr(f){if(f.length<_t)throw new Error("BRIK: fichier tronqu\xE9 (en-t\xEAte)");let r=String.fromCharCode(f[0],f[1],f[2],f[3]);if(r!==hi)throw new Error(`BRIK: sceau magique absent (${r})`);let t=new DataView(f.buffer,f.byteOffset,f.byteLength),e=t.getUint32(4,!0),n=t.getUint32(8,!0);if(_t+n>f.length)throw new Error("BRIK: manifeste tronqu\xE9");return{manifest:Kn(JSON.parse(new TextDecoder().decode(f.subarray(_t,_t+n)))),version:e,dataStart:bi(n)}}function Nn(f){let{manifest:r,version:t,dataStart:e}=Pr(f);return{manifest:r,version:t,dataStart:e,data:f.subarray(e)}}var hi,_t,Hn=ae(()=>{"use strict";En();hi="BRIK",_t=12});function zn(f){let r=[...f].sort((n,s)=>n.id-s.id),t=[],e=0;for(let n of r)t[n.id]=e,e+=n.byteLength;return t}function Qn(f){let r=zn(f.shards),t={};for(let[n,s]of Object.entries(f.tensors)){let i=vi[s.dtype];if(!i)throw new Error(`dtype BRIK inconnu pour ${n} : ${s.dtype}`);if(r[s.shard]===void 0)throw new Error(`shard ${s.shard} absent du manifeste (tenseur ${n})`);t[n]={offset:r[s.shard]+s.offset,bytes:s.byteLength,nElems:s.nElems,type:i,shape:s.shape}}let e=f.arch;return{arch:e.arch,config:{d:e.d,nHeads:e.nHeads,nKvHeads:e.nKvHeads,headDim:e.headDim,ffn:e.ffn,blockCount:e.blockCount,ropeTheta:e.ropeTheta,rmsEps:e.rmsEps,attnLogitSoftcap:e.attnLogitSoftcap,finalLogitSoftcap:e.finalLogitSoftcap,attnScale:e.attnScale,act:e.act,rmsGainOnePlus:e.rmsGainOnePlus,embedScale:e.embedScale,rwkv:e.rwkv,lfm2:e.lfm2},tensors:t}}var vi,$n=ae(()=>{"use strict";vi={f16:"F16",f32:"F32",q4:"Q4W",q8:"Q8W",q3:"Q3W"}});function ki(f){return wi[f]}async function _i(f){let r=f.slice();return yi(await crypto.subtle.digest("SHA-256",r.buffer))}async function Gr(f,r){let t=ki(f);if(!t)return;if(typeof crypto>"u"||!crypto.subtle){console.warn("[int\xE9grit\xE9] crypto.subtle indisponible (contexte non s\xE9curis\xE9) : empreinte du manifeste NON v\xE9rifi\xE9e.");return}let e=await _i(r);if(e!==t)throw console.error(`[int\xE9grit\xE9] manifeste inattendu pour ${f}
  attendu : ${t}
  obtenu  : ${e}`),new Error("Ce mod\xE8le ne correspond pas \xE0 celui que Brimkern publie : son manifeste a une empreinte diff\xE9rente de celle attendue. Chargement refus\xE9. Si tu viens de t\xE9l\xE9verser une nouvelle version, relance `npm run brik:digest`.")}var wi,yi,Wn=ae(()=>{"use strict";wi={"https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik":"aca6214b45c294c1d4c51c46aa23acc22cc53cb95a6894c62d2bd0570ca12afe","https://huggingface.co/romainkh14/Qwen2.5-0.5B-Instruct_BRIK/resolve/main/qwen2.5-0.5b-instruct-mixed.brik":"315d2a1cc17b64b029eb24e9668e5c959fd151ae926c9758bddc6a8193e52f6d","https://huggingface.co/romainkh14/Qwen3-4B_BRIK/resolve/main/qwen3-4b-q4.brik":"23f9c0cc66ec21056e656bdaa5cbfda2e93673718ea3ab0dfad19c6e7f583f7d","https://huggingface.co/romainkh14/RWKV-7-G1-0.1B_BRIK/resolve/main/rwkv7-g1-0.1b-q4.brik":"bb8d211e1f95af415b7dca8b0b074c236ebe9d0844f1f372c11eecbcf15fb372","https://huggingface.co/romainkh14/RWKV-7-G1a-0.4B_BRIK/resolve/main/rwkv7-g1a-0.4b-q4.brik":"47e67144bb9dcd41918f3117aa6ee21420ff94f93289c338d8331620d3153b10","https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main/sd-turbo-clip-mixed.brik":"b873aaad23ca70d4e29c0350d124fd6ee0a18470aaf59719f14c9eb9f227b3ac","https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main/sd-turbo-clip-q8.brik":"b3e05c74f8f0327e878787100224983a454e4228d2ae008902875a6256fb2bae","https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main/sd-turbo-unet-q8.brik":"ca3a5c21512542656a8a736c88f67d37a482cacbf499a080c9bf32ca36bf6b0f","https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main/sdxs-unet-light.brik":"42f7c0e82971a558d56548edec947b1ed7d9c0e509d634b51fc29429177e7654","https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main/video-clip-q8.brik":"e81ca57426716237dce2853703c70172a829f78704b7df77c9ee980534c82a76","https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main/video-motion-q8.brik":"e976e13a5bc0858b8277eefed59cc0d77239b5a30ecae68d483e24eb983ae481","https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main/video-unet-q8.brik":"d112b2884afcd038cdbd90bb62ce6b248b404852fb9ce20003b8585927a362b9"},yi=f=>[...new Uint8Array(f)].map(r=>r.toString(16).padStart(2,"0")).join("")});function Ur(f,r,t){return`${f}${f.includes("?")?"&":"?"}__brik=${r}-${t}`}async function Xn(){try{return await caches.open(Ai)}catch{return null}}async function We(f,r,t,e){let n=r+t-1,s=await Xn(),i=Ur(f,r,n);if(s){let o=await s.match(i);if(o)return{bytes:new Uint8Array(await o.arrayBuffer()),ranged:!0}}let a;for(let o=0;o<4;o++)try{let u=await fetch(f,{headers:{Range:`bytes=${r}-${n}`},signal:e});if(!u.ok&&u.status!==206)throw new Error(`range fetch ${r}-${n} \xE9chou\xE9 : HTTP ${u.status}`);let c=u.status===206,l=new Uint8Array(await u.arrayBuffer()),d=c?l:l.subarray(r,r+t);if(s&&c)try{await s.put(i,new Response(d,{headers:{"Content-Length":String(d.byteLength)}}))}catch(p){Jn(p)}return{bytes:d,ranged:c}}catch(u){if(e?.aborted)throw u;a=u,o<3&&await new Promise(c=>setTimeout(c,500*2**o))}throw a instanceof Error?a:new Error(String(a))}function Jn(f){In||(In=!0,console.warn("[cache] \xE9criture refus\xE9e (quota plein ? navigation priv\xE9e ?) : les t\xE9l\xE9chargements de mod\xE8les ne seront PAS r\xE9utilisables \xE0 la prochaine visite. Lib\xE9rez de l'espace via le panneau Stockage.",f))}async function qr(f){try{let n=await(await caches.open(Br)).match(f);if(n)return new Uint8Array(await n.arrayBuffer())}catch{}let r=await fetch(f);if(!r.ok)throw new Error(`HTTP ${r.status}`);let t=new Uint8Array(await r.arrayBuffer());try{await(await caches.open(Br)).put(f,new Response(t.slice(),{headers:{"Content-Length":String(t.byteLength)}}))}catch(e){Jn(e)}return t}function Sr(f,r){return{bytes:async(t,e)=>(await We(f,r+t,e)).bytes}}function xi(f){return{bytes:async(r,t)=>f.subarray(r,r+t)}}async function Zn(f){let r=await We(f,0,12);if(!r.ranged){let i=await qr(f),{manifest:a,data:o}=Nn(i);return await Gr(f,Vn(i)),Yn(a,xi(o))}let t=new DataView(r.bytes.buffer,r.bytes.byteOffset,12).getUint32(8,!0),e=await We(f,0,12+t),{manifest:n,dataStart:s}=Pr(e.bytes);return await Gr(f,Vn(e.bytes)),Yn(n,Sr(f,s))}function Vn(f){let r=new DataView(f.buffer,f.byteOffset,12).getUint32(8,!0);return f.subarray(12,12+r)}function Yn(f,r){if(f.model?.uiArch==="image")throw new Error("Ce fichier est un BRIK image (UNet/CLIP) : il se charge via la tuile de g\xE9n\xE9ration d'image, pas comme un LLM.");return{source:r,manifest:Qn(f),tokenizerId:f.tokenizer?.id,tokenizer:f.tokenizer,uiArch:f.model?.uiArch,modelName:f.model.name}}async function es(f,r){return await Pi(f)||!(await We(f,0,12,r)).ranged?null:{manifest:await ts(f,r),source:Sr(f,0)}}async function Pi(f){try{return!!await(await caches.open(Br)).match(f)}catch{return!1}}async function ts(f,r){let t=Sr(f,0),e;for(let n=8*1024*1024;n<=128*1024*1024;n*=2)try{let s=await t.bytes(0,n);return await Jt(new Blob([s.slice()]))}catch(s){if(r?.aborted)throw s;e=s}throw e instanceof Error?e:new Error("en-t\xEAte GGUF illisible par plages")}function Gi(f,r){let t=new Map,e=[];for(let[n,s]of Object.entries(f.tensors)){let i=n.match(/^blk\.(\d+)\./);if(i){let a=t.get(i[1]);a||t.set(i[1],a=[]),a.push(s)}else if(Bn.has(n))for(let a of qn(s))e.push({off:r+a.off,len:a.len});else e.push({off:r+s.offset,len:s.bytes})}for(let n of t.values()){let s=st(n);if(s)e.push({off:r+s.start,len:s.end-s.start});else for(let i of n)e.push({off:r+i.offset,len:i.bytes})}return e}async function Ui(f,r){let t=await Xn();return!t||!(await We(f,0,12,r)).ranged?null:{cache:t,ranges:Gi(await ts(f,r),0)}}async function rs(f,r,t){return Bi(f,await Ui(f,t),r,t)}async function Bi(f,r,t,e){if(!r)return"unstorable";let{cache:n,ranges:s}=r;s.sort((g,m)=>g.off-m.off);let i=s.reduce((g,m)=>g+m.len,0),a=await Promise.all(s.map(g=>n.match(Ur(f,g.off,g.off+g.len-1)))),o=0,u=[];s.forEach((g,m)=>{a[m]?o+=g.len:u.push(g)}),t?.({doneBytes:o,totalBytes:i});let c=0,l=!1,d=null,p=async()=>{for(;!l&&d===null;){let g=c++;if(g>=u.length)return;let m=u[g];if(e?.aborted)return;try{await We(f,m.off,m.len,e)}catch(w){d=w;return}if(!await n.match(Ur(f,m.off,m.off+m.len-1))){l=!0;return}o+=m.len,t?.({doneBytes:o,totalBytes:i})}};if(await Promise.all(Array.from({length:Math.min(4,u.length)},p)),e?.aborted)return"aborted";if(d!==null)throw d instanceof Error?d:new Error(String(d));return l?"unstorable":"done"}var Ai,In,Br,ns=ae(()=>{"use strict";"use client";it();xr();Hn();$n();Wn();Ai="brik-range-v1";In=!1;Br="brimkern-model-cache"});function qi(f){f=f.replace(/<(\/?)ifm\|think(?:_fast|_faster)?>/g,"<$1think>");let r=f.indexOf("<think>");if(r===-1)return f;let t=f.indexOf("</think>",r);return(t===-1?f.slice(0,r):f.slice(0,r)+f.slice(t+8)).trim()}function Fr(f,r,t){f=f.map(n=>n.role==="assistant"?{...n,content:qi(n.content)}:n);let e="";if(r==="deepseek"){e+="<\uFF5Cbegin\u2581of\u2581sentence\uFF5C>",t.trim()&&(e+=t);for(let n of f)n.role==="user"?e+=`<\uFF5CUser\uFF5C>${n.content}`:n.role==="assistant"&&(e+=`<\uFF5CAssistant\uFF5C>${n.content}<\uFF5Cend\u2581of\u2581sentence\uFF5C>`);return e+="<\uFF5CAssistant\uFF5C>",e}if(r==="k2h"){let n=!0;return t.trim()&&(e+=`<|ifm|im_start|>system
${t.trim()}<|ifm|im_end|>`),f.forEach((s,i)=>{let a=s.content;s.role==="user"&&i===f.length-1&&/\s*\/no_think\s*$/.test(a)&&(a=a.replace(/\s*\/no_think\s*$/,""),n=!1),e+=`<|ifm|im_start|>${s.role}
${a}<|ifm|im_end|>`}),e+=`<|ifm|im_start|>assistant
<ifm|think>
${n?"":`</ifm|think>
`}`,e}if(r==="spark"){let n="<\uFF5Cstart\u2581of\u2581sentence\uFF5C>",s="<\uFF5Cend\u2581of\u2581sentence\uFF5C>",i=!0;return e+=`${n}<|System|>
you are a helpful assistant.${t.trim()?`

${t.trim()}`:""}${s}`,f.forEach((a,o)=>{let u=a.content;a.role==="user"&&o===f.length-1&&/\s*\/no_think\s*$/.test(u)&&(u=u.replace(/\s*\/no_think\s*$/,""),i=!1),a.role==="user"?e+=`${n}<|User|>${u}${s}`:a.role==="assistant"&&(e+=`${n}<|Bot|></think>${u}${s}`)}),e+=`${n}<|Bot|>${i?"<think>":"</think>"}`,e}if(r==="rwkv7"){t.trim()&&(e+=`System: ${t.trim()}

`);for(let n of f)n.role==="user"?e+=`User: ${n.content.trim()}

`:n.role==="assistant"&&(e+=`Assistant: ${n.content.trim()}

`);return e+="Assistant:",e}if(r==="qwen"||r==="qwen3"||r==="qwen35"||r==="lfm2"||r==="smollm3"){let n=!0;r==="qwen35"&&f.length&&f[f.length-1].role==="user"&&/\s*\/no_think\s*$/.test(f[f.length-1].content)&&(n=!1,f=[...f.slice(0,-1),{...f[f.length-1],content:f[f.length-1].content.replace(/\s*\/no_think\s*$/,"")}]),t.trim()&&(e+=`<|im_start|>system
${t}<|im_end|>
`);for(let s of f)e+=`<|im_start|>${s.role}
${s.content}<|im_end|>
`;e+=`<|im_start|>assistant
`,r==="qwen35"&&(e+=n?`<think>
`:`<think>

</think>

`)}else if(r==="llama3"){e+="<|begin_of_text|>",t.trim()&&(e+=`<|start_header_id|>system<|end_header_id|>

${t}<|eot_id|>`);for(let n of f)e+=`<|start_header_id|>${n.role}<|end_header_id|>

${n.content}<|eot_id|>`;e+=`<|start_header_id|>assistant<|end_header_id|>

`}else if(r==="mistral3"){e+="<s>",t.trim()&&(e+=`[SYSTEM_PROMPT]${t}[/SYSTEM_PROMPT]`);for(let n of f)n.role==="user"?e+=`[INST]${n.content}[/INST]`:n.role==="assistant"&&(e+=`${n.content}</s>`)}else if(r==="gemma4"){t.trim()&&(e+=`<|turn>system
${t.trim()}<turn|>
`);for(let n of f)e+=`<|turn>${n.role==="assistant"?"model":"user"}
${n.content.trim()}<turn|>
`;e+=`<|turn>model
`}else if(r==="gemma"||r==="gemma3"){t.trim()&&(e+=`<start_of_turn>model
${t}<end_of_turn>
`);for(let n of f)e+=`<start_of_turn>${n.role==="assistant"?"model":"user"}
${n.content}<end_of_turn>
`;e+=`<start_of_turn>model
`}return e}function is(f){let r=new Set;for(let t of["tokenizer.ggml.eos_token_id","tokenizer.ggml.eot_token_id","tokenizer.ggml.eom_token_id"]){let e=f?.[t],n=typeof e=="number"?e:Number(e);Number.isFinite(n)&&n>=0&&r.add(n)}return[...r]}var ss,as=ae(()=>{"use strict";ss=["<\uFF5Cend\u2581of\u2581sentence\uFF5C>","<\uFF5CAssistant\uFF5C>","<\uFF5CUser\uFF5C>","<\uFF5Cbegin\u2581of\u2581sentence\uFF5C>","<\uFF5Cstart\u2581of\u2581sentence\uFF5C>","<|ifm|im_end|>","<|ifm|im_start|>","<|im_end|>","<|im_start|>","<|eot_id|>","<|begin_of_text|>","<|start_header_id|>","<|end_header_id|>","</s>","<s>","<end_of_turn>","<start_of_turn>","[INST]","[/INST]","[SYSTEM_PROMPT]","</model>","</assistant>","</user>","<|assistant|>","<|user|>",`
User:`]});function Si(){let f=[];for(let s=33;s<=126;s++)f.push(s);for(let s=161;s<=172;s++)f.push(s);for(let s=174;s<=255;s++)f.push(s);let r=f.slice(),t=0;for(let s=0;s<256;s++)f.includes(s)||(f.push(s),r.push(256+t),t++);let e=new Array(256),n=new Map;for(let s=0;s<f.length;s++)e[f[s]]=String.fromCodePoint(r[s]),n.set(String.fromCodePoint(r[s]),f[s]);return{enc:e,dec:n}}var os,et,Mr=ae(()=>{"use strict";os="'(?:[sdmt]|ll|ve|re)| ?\\p{L}+| ?\\p{N}+| ?[^\\s\\p{L}\\p{N}]+|\\s+(?!\\S)|\\s+",et=class f{constructor(r){this.vocab=new Map;this.idToTok=new Map;this.ranks=new Map;this.added=[];this.specialIds=new Set;this.addedRe=null;this.bosIds=[];this.cache=new Map;let t=typeof r=="string"?JSON.parse(r):r;if(t?.model?.type!=="BPE")throw new Error(`BpeTokenizer : model.type ${t?.model?.type} non couvert (BPE uniquement)`);({enc:this.byteEnc,dec:this.byteDec}=Si());for(let[a,o]of Object.entries(t.model.vocab))this.vocab.set(a,o),this.idToTok.set(o,a);(t.model.merges??[]).forEach((a,o)=>this.ranks.set(Array.isArray(a)?`${a[0]} ${a[1]}`:a,o));for(let a of t.added_tokens??[])this.added.push(a),this.vocab.set(a.content,a.id),this.idToTok.set(a.id,a.content),a.special&&this.specialIds.add(a.id);if(this.added.length){let a=this.added.map(o=>o.content.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).sort((o,u)=>u.length-o.length);this.addedRe=new RegExp(`(${a.join("|")})`,"g")}let n=f.findSplitPattern(t.pre_tokenizer)??os;this.splitRe=new RegExp(n,"gu");let s=a=>{if(!a)return null;if(a.type==="TemplateProcessing")return a.single;if(a.type==="Sequence")for(let o of a.processors??[]){let u=s(o);if(u)return u}return null},i=s(t.post_processor);if(Array.isArray(i))for(let a of i)if(a.SpecialToken){let o=this.vocab.get(a.SpecialToken.id);o!==void 0&&this.bosIds.push(o)}else break}static findSplitPattern(r){if(!r)return null;if(r.type==="Split"&&r.pattern?.Regex)return r.pattern.Regex;if(r.type==="ByteLevel"&&r.use_regex!==!1)return os;if(r.type==="Sequence")for(let t of r.pretokenizers??[]){let e=f.findSplitPattern(t);if(e)return e}return null}bpe(r){let t=this.cache.get(r);if(t)return t;let e=Array.from(r);for(;e.length>1;){let s=-1,i=1/0;for(let a=0;a<e.length-1;a++){let o=this.ranks.get(`${e[a]} ${e[a+1]}`);o!==void 0&&o<i&&(i=o,s=a)}if(s<0)break;e=[...e.slice(0,s),e[s]+e[s+1],...e.slice(s+2)]}let n=[];for(let s of e){let i=this.vocab.get(s);if(i!==void 0)n.push(i);else for(let a of s){let o=this.vocab.get(a);o!==void 0&&n.push(o)}}return this.cache.set(r,n),n}encodeChunk(r){let t=[];for(let e of r.match(this.splitRe)??[]){let n=new TextEncoder().encode(e),s="";for(let i of n)s+=this.byteEnc[i];t.push(...this.bpe(s))}return t}encode(r){let t=[...this.bosIds];if(this.addedRe)for(let e of r.split(this.addedRe)){if(!e)continue;let n=this.vocab.get(e);n!==void 0&&this.added.some(s=>s.content===e)?t.push(n):t.push(...this.encodeChunk(e))}else t.push(...this.encodeChunk(r));return t}decode(r){let t=[];for(let e of r){if(this.specialIds.has(e))continue;let n=this.idToTok.get(e);if(n!==void 0)for(let s of n){let i=this.byteDec.get(s);if(i!==void 0)t.push(i);else for(let a of new TextEncoder().encode(s))t.push(a)}}return new TextDecoder("utf-8",{fatal:!1}).decode(new Uint8Array(t))}}});function ls(f){let r=f.metadata,t=String(r["tokenizer.ggml.model"]??""),e=r["tokenizer.ggml.tokens"],n=r["tokenizer.ggml.merges"];if(!Array.isArray(e)||!e.length||!Array.isArray(n)||!n.length||t!=="gpt2"&&t!=="llama")return null;let s=String(r["tokenizer.ggml.pre"]??"gpt2"),i=r["tokenizer.ggml.token_type"]??[],a=cs(r["tokenizer.ggml.bos_token_id"]),o=cs(r["tokenizer.ggml.eos_token_id"]),u=r["tokenizer.ggml.add_bos_token"]===!0,c={},l=[],d=[];for(let g=0;g<e.length;g++){let m=e[g],w=i[g]??1;w===3||w===4?(l.push({id:g,content:m,special:w===3}),w===3&&d.push(g)):c[m]=g}let p={version:"1.0",added_tokens:l,pre_tokenizer:{type:"Split",pattern:{Regex:us[s]??us.gpt2}},post_processor:u&&a!=null?{type:"TemplateProcessing",single:[{SpecialToken:{id:e[a],type_id:0}},{Sequence:{id:"A",type_id:0}}]}:void 0,model:{type:"BPE",vocab:c,merges:n}};try{return{tokenizer:new et(p),nVocab:e.length,pre:s,bosId:a,eosId:o,controlIds:d}}catch(g){return console.warn("[gguf-tok] vocabulaire non consommable par BpeTokenizer. Repli sur le tokenizer HF :",g),null}}function cs(f){let r=Number(f);return Number.isFinite(r)?r:null}var us,fs=ae(()=>{"use strict";Mr();us={"llama-bpe":"(?:'[sS]|'[tT]|'[rR][eE]|'[vV][eE]|'[mM]|'[lL][lL]|'[dD])|[^\\r\\n\\p{L}\\p{N}]?\\p{L}+|\\p{N}{1,3}| ?[^\\s\\p{L}\\p{N}]+[\\r\\n]*|\\s*[\\r\\n]+|\\s+(?!\\S)|\\s+",qwen2:"(?:'[sS]|'[tT]|'[rR][eE]|'[vV][eE]|'[mM]|'[lL][lL]|'[dD])|[^\\r\\n\\p{L}\\p{N}]?\\p{L}+|\\p{N}| ?[^\\s\\p{L}\\p{N}]+[\\r\\n]*|\\s*[\\r\\n]+|\\s+(?!\\S)|\\s+",gpt2:"'(?:[sdmt]|ll|ve|re)| ?\\p{L}+| ?\\p{N}+| ?[^\\s\\p{L}\\p{N}]+|\\s+(?!\\S)|\\s+",spark2_5:"\\p{N}|[\u4E00-\u9FA5\u3040-\u309F\u30A0-\u30FF]+|[!\"#$%&'()*+,\\-./:;<=>?@\\[\\\\\\]^_`{|}~][A-Za-z]+|[^\\r\\n\\p{L}\\p{P}\\p{S}\\p{N}]?(?:(?![\u4E00-\u9FA5\u3040-\u309F\u30A0-\u30FF])[\\p{L}\\p{M}])+| ?(?:(?![\u4E00-\u9FA5\u3040-\u309F\u30A0-\u30FF])[\\p{P}\\p{S}])+|[\\r\\n]|\\s+(?![^\\s\\p{N}\u4E00-\u9FA5\u3040-\u309F\u30A0-\u30FF])|\\s+|[^\\s\\p{L}\\p{M}\\p{P}\\p{S}\\p{N}]+","k2-horizon":"(?:'[sS]|'[tT]|'[rR][eE]|'[vV][eE]|'[mM]|'[lL][lL]|'[dD])|[^\\r\\n\\p{L}\\p{N}]?(?:\\p{L}|\\p{M}|\\u200C|\\u200D)+|\\p{N}{1,3}| ?[^\\s\\p{L}\\p{N}]+[\\r\\n]*|\\s*[\\r\\n]+|\\s+(?!\\S)|\\s+",qwen35:"(?:'[sS]|'[tT]|'[rR][eE]|'[vV][eE]|'[mM]|'[lL][lL]|'[dD])|[^\\r\\n\\p{L}\\p{N}]?[\\p{L}\\p{M}]+|\\p{N}| ?[^\\s\\p{L}\\p{M}\\p{N}]+[\\r\\n]*|\\s*[\\r\\n]+|\\s+(?!\\S)|\\s+"}});function at(f,r,t={}){let{temperature:e=.7,topK:n=40,topP:s=.9,rng:i=Math.random}=t;if(!e||e<=0)return f[0];let a=n&&n>0?Math.min(n,f.length):f.length,o=1/e,u=r[0],c=new Float64Array(a),l=0;for(let m=0;m<a;m++){let w=Math.exp((r[m]-u)*o);c[m]=w,l+=w}for(let m=0;m<a;m++)c[m]/=l;let d=a;if(s&&s<1){let m=0;for(let w=0;w<a;w++)if(m+=c[w],m>=s){d=w+1;break}}let p=0;for(let m=0;m<d;m++)p+=c[m];let g=i()*p;for(let m=0;m<d;m++)if(g-=c[m],g<=0)return f[m];return f[d-1]}var ds=ae(()=>{"use strict"});function gs(f,r){if(f==="llama"){if(r&&r>=1e5)return ps.llama;if(r&&r<1e5){console.warn(`[brimkern] GGUF arch="llama" avec un vocab de ${r} \u2192 famille Llama 2 / Mistral / TinyLlama : pas de tokenizer par d\xE9faut pour celle-ci, la s\xE9lection actuelle est conserv\xE9e (une r\xE9ponse incoh\xE9rente = mauvais tokenizer).`);return}return}return ps[f]}var Fi,Mi,Ie,Or,Bo,qo,ps,ms=ae(()=>{"use strict";Fi="https://huggingface.co/madebyollin/taesd/resolve/614f76814bbe30edbe2e627ace1c2234c81a2c0e",Mi=`${Fi}/taesd_decoder.safetensors`,Ie="https://huggingface.co/romainkh14/brimkern-image-BRIK/resolve/main",Or="https://huggingface.co/romainkh14/brimkern-video-BRIK/resolve/main",Bo={unet:`${Or}/video-unet-q8.brik`,motion:`${Or}/video-motion-q8.brik`,clip:`${Or}/video-clip-q8.brik`,taesd:Mi},qo={sdturbo:{unet:`${Ie}/sd-turbo-unet-q8.brik`,clip:`${Ie}/sd-turbo-clip-q8.brik`},sdxs:{unet:`${Ie}/sdxs-unet-light.brik`,clip:`${Ie}/sd-turbo-clip-mixed.brik`},realvisxl:{unet:`${Ie}/realvisxl-unet-mixed.brik`,clip:`${Ie}/realvisxl-clip2-q8.brik`,clip1:`${Ie}/realvisxl-clip1-q8.brik`,vae:`${Ie}/realvisxl-vae-q8.brik`}},ps={gemma:{archType:"gemma",tokenizerId:"Xenova/gemma-tokenizer"},gemma2:{archType:"gemma",tokenizerId:"Xenova/gemma-tokenizer"},gemma3:{archType:"gemma3",tokenizerId:"unsloth/gemma-3-270m-it"},gemma4:{archType:"gemma4",tokenizerId:"google/gemma-4-E4B-it"},smollm3:{archType:"smollm3",tokenizerId:"HuggingFaceTB/SmolLM3-3B"},qwen3:{archType:"qwen3",tokenizerId:"Qwen/Qwen3-0.6B"},qwen35:{archType:"qwen35",tokenizerId:"Qwen/Qwen2.5-Coder-3B-Instruct"},qwen3_5:{archType:"qwen35",tokenizerId:"Qwen/Qwen2.5-Coder-3B-Instruct"},mistral3:{archType:"mistral3",tokenizerId:"unsloth/Ministral-3-3B-Instruct-2512"},llama:{archType:"llama3",tokenizerId:"unsloth/Llama-3.2-1B-Instruct"}}});function hs(f){let r=f.arch||"";if(r==="lfm2"||f.config?.lfm2)return"lfm2";if(r==="rwkv7"||f.config?.rwkv)return"rwkv7";if(r==="qwen2"||r.includes("qwen2"))return"qwen";if(r==="qwen35"||r==="qwen3_5"||r==="qwen35moe")return"qwen35";if(r==="qwen3"||r.includes("qwen3"))return"qwen3";if(r==="smollm3"||r.includes("smollm"))return"smollm3";if(r==="mistral3"||r.includes("mistral"))return"mistral3";if(r==="gemma4")return"gemma4";if(r==="spark2_5")return"spark";if(r==="k2-horizon")return"k2h";if(r==="gemma3")return"gemma3";if(r==="gemma"||r==="gemma2")return"gemma";if(r==="deepseek")return"deepseek";if(r==="llama"){let t=f.tensors?.["token_embd.weight"],e=f.config?.d,n=t&&e?t.nElems/e:null;return n&&n<1e5?"llama2":"llama3"}return"qwen"}async function Ci(f,r){let t=new Et;if(!await t.init())throw Object.assign(new Error("WebGPU is not available in this browser."),{code:"no-webgpu"});t.onLost=v=>{console.warn("[brimkern] device GPU perdu ("+(v?.reason||"unknown")+"): rechargement au prochain appel"),Ee.delete(f)},await t.selfValidate(),r("download");let e=await We(f,0,12).catch(()=>null);if((e?.bytes&&e.bytes.length>=4?String.fromCharCode(...e.bytes.subarray(0,4)):"")==="GGUF"||f.toLowerCase().includes(".gguf")){await rs(f,h=>{r("download",{loaded:h.doneBytes,total:h.totalBytes})}).catch(h=>{console.warn("[gguf] pr\xE9chargement par plages indisponible :",h)});let v=await es(f).catch(h=>(console.warn("[gguf] streaming par plages \xE9chou\xE9, repli complet :",h),null)),x,q;if(v)x=v.manifest,q=v.source;else{let h=await qr(f);x=await Jt(new Blob([h.buffer])),q={bytes:async(y,b)=>h.subarray(y,y+b)}}let F=hs(x);r("tokenizer");let R=F==="gemma4"?Rn(x):ls(x),K,P=is(x.metadata);if(R)K=R.tokenizer,R.eosId!=null&&P.push(R.eosId),R.controlIds?.length&&P.push(...R.controlIds);else{console.warn("[brimkern] tokenizer GGUF non-BPE : repli transformers.js (CDN)");let h=await import(er),y=x.tensors?.["token_embd.weight"],b=y&&x.config?.d?y.nElems/x.config.d:null,A=gs(String(x.arch||""),b)?.tokenizerId||x.metadata?.["tokenizer.ggml.id"]||(F==="llama3"?"unsloth/Llama-3.2-1B-Instruct":"Qwen/Qwen2.5-Coder-0.5B-Instruct"),B=await h.AutoTokenizer.from_pretrained(A);K={encode:U=>Array.from(B(U).input_ids.data,M=>Number(M)),decode:U=>B.decode(U,{skip_special_tokens:!0})}}F==="gemma3"&&P.push(106,1),F==="gemma4"&&P.push(106,1,50),F==="gemma"&&P.push(107,1);let G=F==="gemma4"?new Wt(t,q,x):F==="qwen35"?new Yt(t,q,x):F==="spark"?new It(t,q,x):F==="k2h"?new Vt(t,q,x):new ye(t,q,x);return r("gpu"),await G.prewarmGpu((h,y)=>{r("gpu",{loaded:h,total:y})}),{core:new At(t,G,K,F,P),engine:t}}let i=await Zn(f),a=i.manifest,o=a?.config?.lfm2?"lfm2":a?.config?.rwkv?"rwkv7":"transformer";if(o==="transformer"){r("tokenizer");let v;if(i.tokenizer?.json)try{let K=new et(i.tokenizer.json);v={encode:P=>K.encode(P),decode:P=>K.decode(P)}}catch(K){console.warn("[brimkern] tokenizer.json non couvert par le BPE bundl\xE9 : repli transformers.js (CDN)",K);let P=await import(er),G=new P.PreTrainedTokenizer(JSON.parse(i.tokenizer.json),JSON.parse(i.tokenizer.config));v={encode:_=>Array.from(G(_).input_ids.data,h=>Number(h)),decode:_=>G.decode(_,{skip_special_tokens:!0})}}else{let K=await import(er),P=i.tokenizerId||"Qwen/Qwen2.5-0.5B-Instruct",G=await K.AutoTokenizer.from_pretrained(P);v={encode:_=>Array.from(G(_).input_ids.data,h=>Number(h)),decode:_=>G.decode(_,{skip_special_tokens:!0})}}let x=new ye(t,i.source,a);r("gpu"),await x.prewarmGpu((K,P)=>{r("gpu",{loaded:K,total:P})});let q=hs(a),F=a.chat?.stopTokenIds||[151645,151643];return{core:new At(t,x,v,q,F),engine:t}}let u=a.tensors["token_embd.weight"],c={arch:{...a.config,arch:o,vocab:u?u.nElems/a.config.d:0},tensors:Object.fromEntries(Object.entries(a.tensors).map(([v,x])=>[v,{dtype:Oi[x.type]??x.type,shape:x.shape,nElems:x.nElems,shard:0,offset:x.offset,byteLength:x.bytes}])),shards:[{id:0,file:"",byteLength:0}],chat:o==="lfm2"?{template:"chatml",stopTokenIds:[7,2,8,10,12]}:{template:"rwkv",stopTokenIds:[0]}},l=Object.values(a.tensors).reduce((v,x)=>v+x.bytes,0),d=0,p=yr(a.tensors,i.source),g=async v=>{let x=a.tensors[v];if(!x)throw new Error(`tenseur absent : ${v}`);let q=await p(v);return d+=x.bytes,r("download",{loaded:d,total:l}),q};if(r("tokenizer"),o==="rwkv7"){let v=i.tokenizer?.json?JSON.parse(i.tokenizer.json):null;if(!v?.tokens)throw new Error("RWKV .brik without its embedded World vocab (rebuild the BRIK).");let x=new yt(t,c,g);return r("gpu"),await x.load(v.tokens),{core:x,engine:t}}let m;try{let v=new et(i.tokenizer.json);m={encode:x=>v.encode(x),decode:x=>v.decode(x)}}catch(v){console.warn("[brimkern] tokenizer.json non couvert par le BPE bundl\xE9 : repli transformers.js (CDN)",v);let x=await import(er),q=new x.PreTrainedTokenizer(JSON.parse(i.tokenizer.json),JSON.parse(i.tokenizer.config));m={encode:F=>Array.from(q(F).input_ids.data,R=>Number(R)),decode:F=>q.decode(F,{skip_special_tokens:!0})}}let w=new Ht(t,c,g);return r("gpu"),await w.load(m),{core:w,engine:t}}function xt(f){return f&&(f.startsWith("https://")||/^http:\/\/(localhost|127\.0\.0\.1)[:/]/.test(f))?f:bs[f||"lfm2.5-230m"]||bs["lfm2.5-230m"]}function tr(f,r){let t=Ee.get(f);if(!t){let e={status:"init",state:"loading",listeners:new Set,promise:null};e.promise=Ci(f,(n,s)=>{e.status=n,e.progress=s,e.listeners.forEach(i=>i(n,s))}).then(n=>(e.state="ready",n)).catch(n=>{throw e.state="error",Ee.delete(f),n}),Ee.set(f,e),t=e}return r&&(t.state!=="ready"&&r(t.status,t.progress),t.listeners.add(r),t.promise.finally(()=>t.listeners.delete(r)).catch(()=>{})),t.promise}async function vs(f,r){let t=await tr(f,r);return t.engine.lost?(Ee.delete(f),(await tr(f,r)).core):t.core}async function Cr(f,r){let t=await vs(f);try{return await r(t)}catch(e){let n=Ee.get(f);if(!(!n||await n.promise.then(i=>i.engine.lost).catch(()=>!0)))throw e;return console.warn("[brimkern] g\xE9n\xE9ration interrompue par une perte de device : nouvelle tentative"),Ee.delete(f),r(await vs(f))}}function ys(f,r){let t=f.replace(/<\|[a-z_]+\|>/g,"");if(t=t.replace(/\s*-{2,}\s*(?:E(?:N(?:D(?:\s*O(?:F(?:\s*N(?:O(?:T(?:E(?:S)?)?)?)?)?)?)?)?)?|N(?:O(?:T(?:E(?:S)?)?)?)?)\s*-*\s*$/i,""),r){let e=t.replace(/^\s*(hello|hi|hey|bonjour|salut)\s*[!,.]\s*/i,"");e.trim()&&(t=e)}return t.trimEnd()}function ks(f){let r=-1;for(let t of ss){let e=f.indexOf(t);e!==-1&&(r===-1||e<r)&&(r=e)}return r===-1?{text:f,hit:!1}:{text:f.slice(0,r),hit:!0}}async function Tr(f,r,t,e,n,s,i,a=[]){let o=f.arch||(f instanceof yt?"rwkv7":"lfm2"),u=Fr([...a,...r.slice(-ws)],o,t),c=a.some(g=>g.role==="assistant")||r.some(g=>g.role==="assistant"),l="",d=!1;return await(f.residentAvailable?.()?f.generateResident.bind(f):f.generate.bind(f))(u,e,g=>{let m=ks(g);m.hit&&(d=!0),l=ys(m.text,c),s?.(l)},()=>d||!!i?.(),{sample:!0,temperature:n,topK:40,repeatPenalty:1.3}),l}async function _s(f,r,t,e){let n=f;if(!(f instanceof At)||!n.batchAvailable()||r.length<2){let a=[];for(let o of r)a.push(await Tr(f,o.history,o.system,t,e,void 0,void 0,o.pinned??[]));return a}let s=r.map(a=>Fr([...a.pinned??[],...a.history.slice(-ws)],n.arch,a.system));return(await n.generateBatch(s,t,{sample:!0,temperature:e,topK:40,repeatPenalty:1.3})).map((a,o)=>ys(ks(a).text,r[o].history.some(u=>u.role==="assistant")))}var At,er,bs,Oi,ws,Ee,Rr=ae(()=>{"use strict";Nt();Pn();Un();Ze();Mn();On();Cn();Tn();Ln();ns();it();as();Mr();fs();ds();xr();ms();At=class{constructor(r,t,e,n,s){this.engine=r;this.model=t;this.tok=e;this.lastSpecStats=null;this.arch=n,this.stops=new Set(s||[])}residentAvailable(){return!0}reset(){this.model.reset()}unload(){this.model.unload()}async generate(r,t,e,n,s){return this.generateResident(r,t,e,n,s)}async generateResident(r,t,e,n,s){let i="sdk-gen",a=s?.repeatPenalty??(s?.sample?1.3:1),o=s?.temperature??.55,u=s?.topK??40,c=64,l=this.model;if(typeof l.speculativeReady=="function"&&l.speculativeReady())return this.generateSpeculative(l,r,t,e,n,{sid:i,penalty:a,temp:o,topK:u,sample:s?.sample!==!1,window:c});this.model.reset();let d=this.tok.encode(r);if(!d.length)return"";let p=256,g=0,m=0;for(let F=0;F<d.length;F+=p){if(n?.())return"";let R=d.slice(F,F+p);if(F+p>=d.length){let P=await this.model.topKKV(R,g,i,d.slice(-c),a);m=at(P.ids,P.vals,{temperature:s?.sample===!1?0:o,topK:u})}else await this.model.topKKV(R,g,i,[],1);g+=R.length}if(!Number.isInteger(m)||m<0||this.stops.has(m))return"";let w=[m],v=[...d.slice(-c),m].slice(-c),x=new Map;for(let F of v)x.set(F,(x.get(F)??0)+1);let q=F=>{if(v.push(F),x.set(F,(x.get(F)??0)+1),v.length>c){let R=v.shift(),K=x.get(R)-1;K===0?x.delete(R):x.set(R,K)}};e&&e(this.tok.decode(w));for(let F=1;F<t&&!n?.();F++){let R=d.length+F-1,K=await this.model.topKKV([m],R,i,[...x.keys()],a);if(!K.ids||!K.ids.length)break;let P=at(K.ids,K.vals,{temperature:s?.sample===!1?0:o,topK:u});if(!Number.isInteger(P)||P<0||this.stops.has(P))break;m=P,w.push(m),q(m),e&&e(this.tok.decode(w))}return this.tok.decode(w)}batchAvailable(){return this.model.batchAvailable===!0&&typeof this.model.topKBatch=="function"}async generateBatch(r,t,e,n){if(!this.batchAvailable()||r.length<2){let p=[];for(let g=0;g<r.length;g++)p.push(await this.generateResident(r[g],t,m=>n?.(g,m),void 0,e));return p}let s=this.engine,i=this.model,a=e?.repeatPenalty??(e?.sample?1.3:1),o=e?.sample===!1?0:e?.temperature??.55,u=e?.topK??40,c=64,l=256,d=[];try{this.model.reset();for(let p=0;p<r.length;p++){let g=`batch-${p}`;s.useKvContext(g);let m=this.tok.encode(r[p]),w=null;for(let q=0;q<m.length;q+=l){let F=m.slice(q,q+l),R=q+l>=m.length;w=await this.model.topKKV(F,q,g,R?m.slice(-c):[],R?a:1)}let v=w?at(w.ids,w.vals,{temperature:o,topK:u}):-1,x=!m.length||!Number.isInteger(v)||v<0||this.stops.has(v);d.push({i:p,ctx:g,pos:m.length,last:v,out:x?[]:[v],win:[...m.slice(-c),v].slice(-c),done:x}),x||n?.(p,this.tok.decode([v]))}for(let p=1;p<t;p++){let g=d.filter(w=>!w.done);if(!g.length)break;let m=await i.topKBatch(g.map(w=>w.last),g.map(w=>w.ctx),g.map(w=>w.pos),g.map(w=>[...new Set(w.win)]),a);g.forEach((w,v)=>{w.pos++;let x=at(m[v].ids,m[v].vals,{temperature:o,topK:u});if(!Number.isInteger(x)||x<0||this.stops.has(x)){w.done=!0;return}w.out.push(x),w.last=x,w.win.push(x),w.win.length>c&&w.win.shift(),n?.(w.i,this.tok.decode(w.out))})}}finally{s.dropKvContexts()}return d.map(p=>this.tok.decode(p.out))}async generateSpeculative(r,t,e,n,s,i){this.model.reset();let a=this.tok.encode(t);if(!a.length)return"";let o=q=>at(q.ids,q.vals,{temperature:i.sample?i.temp:0,topK:i.topK}),u=256,c=null;for(let q=0;q<a.length;q+=u){if(s?.())return"";let F=a.slice(q,q+u),R=q+u>=a.length;c=await r.specPrefill(F,q,i.sid,R?a.slice(-i.window):[],R?i.penalty:1)}let l=o(c);if(!Number.isInteger(l)||l<0||this.stops.has(l))return"";let d=[l],p=[...a.slice(-i.window),l].slice(-i.window),g=new Map;for(let q of p)g.set(q,(g.get(q)??0)+1);let m=q=>{if(d.push(q),p.push(q),g.set(q,(g.get(q)??0)+1),p.length>i.window){let F=p.shift(),R=g.get(F)-1;R===0?g.delete(F):g.set(F,R)}n?.(this.tok.decode(d))};n?.(this.tok.decode(d));let w=a.length,v=await r.specDraft([l],w,"last"),x={drafts:0,accepted:0};for(;d.length<e&&!s?.();){let q=[...g.keys()],F=g.has(v)?q:[...q,v],[R,K]=await r.specVerify(l,v,w,i.sid,q,F,i.penalty);x.drafts++;let P=o(R);if(!Number.isInteger(P)||P<0||this.stops.has(P))break;if(P===v){if(x.accepted++,m(v),d.length>=e||s?.())break;let G=o(K);if(!Number.isInteger(G)||G<0||this.stops.has(G))break;m(G),v=await r.specDraft([P,G],w+1,"verify"),l=G,w+=2}else r.specRollback(),m(P),v=await r.specDraft([P],w+1,"verify0"),l=P,w+=1}return this.lastSpecStats=x,this.tok.decode(d)}},er="https://esm.sh/@huggingface/transformers@4.2.0",bs={"lfm2.5-230m":"https://huggingface.co/romainkh14/LFM2.5-230M_BRIK/resolve/main/lfm25-230m-q4.brik","qwen-0.5b":"https://huggingface.co/romainkh14/Qwen2.5-0.5B-Instruct_BRIK/resolve/main/qwen2.5-0.5b-instruct-mixed.brik","coder-0.5b":"https://huggingface.co/Qwen/Qwen2.5-Coder-0.5B-Instruct-GGUF/resolve/main/qwen2.5-coder-0.5b-instruct-q4_k_m.gguf","coder-1.5b":"https://huggingface.co/Qwen/Qwen2.5-Coder-1.5B-Instruct-GGUF/resolve/main/qwen2.5-coder-1.5b-instruct-q4_k_m.gguf","rwkv-0.4b":"https://huggingface.co/romainkh14/RWKV-7-G1a-0.4B_BRIK/resolve/main/rwkv7-g1a-0.4b-q4.brik","rwkv-0.1b":"https://huggingface.co/romainkh14/RWKV-7-G1-0.1B_BRIK/resolve/main/rwkv7-g1-0.1b-q4.brik"},Oi={F16:"f16",F32:"f32",Q4W:"q4",Q8W:"q8",Q3W:"q3"},ws=12;Ee=new Map});var As={};sn(As,{LocalBackend:()=>Pt});var Pt,Lr=ae(()=>{"use strict";Rr();Pt=class{constructor(){this.kind="main"}async preload(r,t){await tr(r,t)}state(r){return Ee.get(r)?.state}turn(r,t,e){return Cr(r.url,n=>Tr(n,r.history,r.system,r.maxTokens,r.temperature,t,()=>!!e?.aborted,r.pinned))}turnBatch(r){let t=r[0];return Cr(t.url,e=>_s(e,r,t.maxTokens,t.temperature))}dispose(){}}});function Ti(){try{if(typeof document>"u")return"";let f=document.currentScript;if(f?.src)return new URL(f.src,document.baseURI).href}catch{}return""}function Ps(f){xs=f}function Gs(){return xs||Ri}var Ri,xs,Dr=ae(()=>{"use strict";Ri=Ti(),xs=""});var Us={};sn(Us,{WorkerBackend:()=>jr});var jr,Bs=ae(()=>{"use strict";Dr();jr=class{constructor(){this.kind="worker";this.seq=0;this.pending=new Map;this.states=new Map;if(typeof Worker>"u")throw new Error("Worker indisponible");let r=Gs();if(!r)throw new Error("URL du script introuvable (import ESM ?) : passez workerUrl");let t=(()=>{try{return location.search}catch{return""}})(),e=`self.__brimkernSearch=${JSON.stringify(t)};importScripts(${JSON.stringify(r)});`,n=new Blob([e],{type:"text/javascript"});this.url=URL.createObjectURL(n),this.worker=new Worker(this.url);let s,i;this.hello=new Promise((a,o)=>{s=a,i=o}),this.worker.onerror=a=>i(new Error(`worker: ${a.message||"\xE9chec de chargement"}`)),this.worker.onmessage=a=>{let o=a.data;if(o.type==="hello"){s();return}let u=this.pending.get(o.id);if(u){if(o.type==="progress"){u.onProgress?.(o.status,o.progress);return}if(o.type==="token"){u.onToken?.(o.text);return}this.pending.delete(o.id),o.type==="error"?u.reject(new Error(o.message)):o.type==="state"?u.resolve(o.state):u.resolve(o.text??"")}}}ready(){return this.hello}send(r,t={}){let e=++this.seq,n=new Promise((s,i)=>{this.pending.set(e,{resolve:s,reject:i,...t}),this.worker.postMessage({...r,id:e})});return{id:e,done:n}}async preload(r,t){await this.hello,this.states.get(r)!=="ready"&&this.states.set(r,"loading");try{await this.send({type:"preload",url:r},{onProgress:t}).done,this.states.set(r,"ready")}catch(e){throw this.states.set(r,"error"),e}}state(r){return this.states.get(r)}async turn(r,t,e){await this.hello;let{id:n,done:s}=this.send({type:"turn",req:r},{onToken:t}),i=()=>this.worker.postMessage({type:"stop",id:n});e?.aborted?i():e?.addEventListener("abort",i,{once:!0});try{let a=await s;return this.states.set(r.url,"ready"),a}finally{e?.removeEventListener("abort",i)}}dispose(){this.worker.terminate(),URL.revokeObjectURL(this.url);for(let r of this.pending.values())r.reject(new Error("worker arr\xEAt\xE9"));this.pending.clear()}}});var Li={};var Kr,rr,tt,Ss=ae(()=>{"use strict";Lr();Kr=new Pt,rr=new Set,tt=f=>self.postMessage(f);self.onmessage=async f=>{let r=f.data;if(r.type==="stop"){rr.add(r.id);return}if(r.type==="state"){tt({type:"state",id:r.id,state:Kr.state(r.url)});return}try{if(r.type==="preload"){await Kr.preload(r.url,(t,e)=>tt({type:"progress",id:r.id,status:t,progress:e})),tt({type:"done",id:r.id});return}if(r.type==="turn"){let t=new AbortController,e=new Proxy(t.signal,{get:(u,c)=>c==="aborted"?rr.has(r.id):Reflect.get(u,c)}),n=16,s=0,i=null,a=()=>{i!==null&&(tt({type:"token",id:r.id,text:i}),i=null,s=Date.now())},o=await Kr.turn(r.req,u=>{i=u,Date.now()-s>=n&&a()},e);a(),tt({type:"done",id:r.id,text:o}),rr.delete(r.id);return}}catch(t){rr.delete(r.id),tt({type:"error",id:r.id,message:t instanceof Error?t.message:String(t)})}};tt({type:"hello"})});var js=new Set(["avec","pour","dans","les","des","une","est","sur","par","que","qui","quoi","comment","pourquoi","quand","vous","nous","votre","notre","mais","plus","tout","tous","cette","sont","avez","puis","faire","fait","fais","font","the","and","for","with","what","who","how","why","when","about","your","our","you","are","can","does","did","this","that","from","have","je","tu","il","elle","on","ils","elles","du","de","la","le","un","en","au","aux","ce","ces","cet","se","sa","son","ses","mon","ma","mes","ton","ta","tes","me","te","ne","pas","si","ou","et","ni","car","donc","or","to","in","at","it","is","be","as","an","by","do","no","so","my","he","we","us","me","am","was","were","been","quel","quelle","quels","quelles","which","where","bonjour","salut","hello","merci"]),Ot=new Map,Ks=2e4;function lr(f){let r=Ot.get(f);if(r!==void 0)return r;let t=Es(f);return Ot.size>=Ks&&Ot.clear(),Ot.set(f,t),t}function Es(f){let r=f.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");return r.length<=3||(r=r.replace(/(?:ments?|ements?|eront|erait|aient|antes?|ances?|euses?|ables?|tions?|sions?|eaux|eurs?|euse|ique|iques|istes?|ings?|ness|able|ible|less|full?)$/,""),r.length>3&&(r=r.replace(/(?:er|ir|ez|ent|ais|ait|ant|ees?|es?|ed|ly|s)$/,""))),r}function dt(f){let r=(f.toLowerCase().match(/[\p{L}\p{N}]+/gu)??[]).filter(t=>js.has(t)?!1:/\d/.test(t)?!0:t.length>=2);return[...new Set(r)]}function un(f,r=600){let t=[];return f.forEach((e,n)=>{let s=(e.title||"").trim(),i=(e.text||"").split(/\n\s*\n+/).map(u=>u.trim()).filter(Boolean),a="",o=()=>{a.trim()&&t.push({title:s,text:a.trim(),doc:n}),a=""};for(let u of i){if(u.length>r*1.6){o();let c=u.split(/(?<=[.!?])\s+/),l="";for(let d of c)l&&(l+" "+d).length>r?(t.push({title:s,text:l.trim(),doc:n}),l=d):l=l?`${l} ${d}`:d;l.trim()&&t.push({title:s,text:l.trim(),doc:n});continue}a&&(a+`

`+u).length>r&&o(),a=a?`${a}

${u}`:u}o()}),t}var an=new WeakMap;function on(f){let r=new Set;for(let t of f)t.length>=4&&r.add(t.slice(0,4));return r}function Ns(f){let r=an.get(f);if(r)return r;let t=`${f.title} ${f.text}`.toLowerCase(),e=f.title.toLowerCase(),n=new Set(dt(t).map(lr)),s=new Set(dt(e).map(lr)),i={hay:t,titre:e,docStems:n,titreStems:s,docPrefix4:on(n),titrePrefix4:on(s)};return an.set(f,i),i}function Hs(f,r,t){if(!f.length)return 0;let e=Ns(r),n=0,s=0;for(let i of f){let a=t.get(i)??1;s+=a;let o=lr(i),u=o.length>=4?o.slice(0,4):null;if(e.hay.includes(i)||e.docStems.has(o)||u!==null&&e.docPrefix4.has(u)){let l=e.titre.includes(i)||e.titreStems.has(o)||u!==null&&e.titrePrefix4.has(u);n+=a*(l?2.2:1)}}return s?n/s:0}function zs(f){let r=new Map;for(let n of f)for(let s of dt(`${n.title} ${n.text}`))r.set(s,(r.get(s)??0)+1);let t=new Map,e=Math.max(1,f.length);for(let[n,s]of r)t.set(n,Math.log(1+e/s));return t}function cn(f,r,t=1200,e=3,n=.22,s=.5){let i=dt(f);if(!i.length||!r.length)return[];let a=zs(r),o=r.map(g=>({c:g,s:Hs(i,g,a)})).filter(g=>g.s>=n).sort((g,m)=>m.s-g.s),u=o.length?o[0].s*s:0,c=o.filter(g=>g.s>=u),l=[],d=new Set,p=t;for(let{c:g,s:m}of c)l.length>=e||g.text.length>p||d.has(g.doc)||(l.push({chunk:g,score:m}),d.add(g.doc),p-=g.text.length);for(let{c:g,s:m}of c){if(l.length>=e)break;l.some(w=>w.chunk===g)||g.text.length>p||(l.push({chunk:g,score:m}),p-=g.text.length)}return l}function fr(f){if(dt(f).length<2)return!1;let r=f.trim().toLowerCase();return/\?\s*$/.test(r)?!0:/^(?:who|what|when|where|why|how|which|whose|is|are|was|were|do|does|did|can|could|will|would|should|may|have|has|qui|que|quoi|quand|où|pourquoi|comment|combien|quel|quelles?|quels|est|sont|était|avez|peux|pouvez|puis|vous|y a-t-il|est-ce)\b/.test(r)}function dr(f,r=!1){let t=f.trim();return t?r?/pas cette information|n[’']ai pas (?:cette|ces|d[’']information)|ne (?:sais|dispose) pas|pas en mesure de (?:vous )?(?:aider|répondre|renseigner|fournir)|ne peux pas (?:vous )?(?:aider|fournir|renseigner|répondre)/i.test(t):/do not have (?:that|this|any) information|don[’']t have (?:that|this|any) information|no information (?:about|on)|(?:can[’']t|cannot|not able to|unable to) (?:assist|provide|answer|access|help you with that)/i.test(t):!1}function Qs(f){let r=f.trim().toLowerCase().replace(/[!?.,;:\-_]/g,"").trim();return/^(hi|hello|hey|greetings|good\s+(morning|afternoon|evening|day)|bonjour|salut|coucou|bonsoir|how\s+are\s+you|how\s+are\s+you\s+doing|ça\s+va|ca\s+va|comment\s+vas?-tu|comment\s+allez-vous|who\s+are\s+you|qui\s+es-tu|merci|thanks|thank\s+you|what\s+can\s+you\s+do|que\s+peux-tu\s+faire)$/i.test(r)}function Ct(f,r,t=!1){if(r&&Qs(r))return"";if(!f.length)return r&&!fr(r)?t?`

Ce message n\u2019appelle aucune fiche : r\xE9ponds en une phrase courte et aimable.`:`

This message needs no reference note: reply in one short, friendly sentence.`:t?`

Aucune fiche de r\xE9f\xE9rence ne correspond \xE0 cette question. Dis que tu n\u2019as pas cette information : ne devine pas.`:`

No reference note matches this question. Say that you do not have this information: do not guess.`;let e=f.map((s,i)=>`[${i+1}]${s.title?` ${s.title}`:""}
${s.text}`).join(`

`);return`

${t?"R\xE9ponds UNIQUEMENT \xE0 partir des fiches ci-dessous, en fran\xE7ais. Reprends leurs chiffres exactement. Si la r\xE9ponse n\u2019y est pas, dis que tu n\u2019as pas cette information : n\u2019invente jamais pour combler.":"Answer using ONLY the reference notes below. Copy their figures exactly. If the answer is not in them, say you do not have that information: never fill the gap with what you assume."}

--- NOTES ---
${e}
--- END OF NOTES ---`}function ln(f){let r=Array.isArray(f)?f:[f],t=[];for(let e of r)typeof e=="string"&&e.trim()?t.push({text:e}):e&&typeof e=="object"&&typeof e.text=="string"&&e.text.trim()&&t.push({title:e.title,text:e.text});return t}function $s(f){let r=f.replace(/×/g,"*").replace(/÷/g,"/").replace(/,/g,".").replace(/[\s  ]/g,"").replace(/=+$/,"");if(!r||r.length>200)return null;let t=0,e=()=>r[t],n=()=>{let l=/^\d+(\.\d+)?/.exec(r.slice(t));return l?(t+=l[0].length,parseFloat(l[0])):null},s=()=>{if(e()==="("){t++;let l=u();return l===null||e()!==")"?null:(t++,l)}return n()},i=()=>{if(e()==="-"){t++;let l=i();return l===null?null:-l}return s()},a=()=>{let l=i();if(l===null)return null;if(e()==="^"){t++;let d=a();return d===null?null:Math.pow(l,d)}return l},o=()=>{let l=a();for(;l!==null&&(e()==="*"||e()==="/"||e()==="%");){let d=r[t++],p=a();if(p===null)return null;l=d==="*"?l*p:d==="/"?l/p:l%p}return l},u=()=>{let l=o();for(;l!==null&&(e()==="+"||e()==="-");){let d=r[t++],p=o();if(p===null)return null;l=d==="+"?l+p:l-p}return l},c=u();return t===r.length&&c!==null&&Number.isFinite(c)?c:null}function fn(f,r=3){let t=[],e=new Set,n=/[\d(][\d\s  .,+\-*/×÷%^()]*[\d)]\s*=?/g;for(let s of f.matchAll(n)){let i=s[0].trim();if(t.length>=r)break;if(e.has(i)||/\d{1,2}[/.]\d{1,2}[/.]\d{2,4}/.test(i)||/\d+:\d+/.test(f.slice(Math.max(0,s.index-1),s.index+i.length+1)))continue;let a=(i.match(/[+\-*/×÷%^]/g)||[]).length,o=/[*×÷%^(]/.test(i)||/=$/.test(i)||a>=2;if(a===0||!o)continue;let u=$s(i);if(u===null)continue;let c=i.replace(/=+$/,"").trim();/[+\-*/×÷%^]/.test(c)&&(e.add(i),t.push({expr:c,value:u}))}return t}function dn(f){let r=Math.round(f*1e9)/1e9;return Number.isInteger(r),String(r)}function Tt(f){return new Date().toLocaleDateString(f==="fr"?"fr-FR":"en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}var Ws=1e4,Is=600;function Rt(f){if(!Array.isArray(f))return[];let r=[];for(let t of f){if(t==="calc"||t==="date"){r.push(t);continue}let e=t;if(e&&typeof e=="object"&&typeof e.name=="string"&&e.name.trim()&&typeof e.run=="function"&&(e.match instanceof RegExp||typeof e.match=="function")){r.push(e);continue}console.warn("[brimkern] outil ignor\xE9 (attendu : 'calc', 'date', ou { name, match, run }) :",t)}return r}var pn=f=>f.includes("date");function gn(f){return f?`
(Date du jour : ${Tt("fr")}.)`:`
(Today's date: ${Tt("en")}.)`}var Vs=/\b(?:today|tonight|what\s+day|which\s+day|what\s+date|what\s+year|what\s+month|current\s+(?:date|day|year)|aujourd(?:'|’)hui|quel\s+jour|quelle\s+date|quelle\s+ann[ée]e|quel\s+mois|on\s+est\s+quel)\b/i,Ys=(f,r)=>new Promise((t,e)=>{let n=setTimeout(()=>e(new Error(`outil sans r\xE9ponse apr\xE8s ${r} ms`)),r);f.then(s=>{clearTimeout(n),t(s)},s=>{clearTimeout(n),e(s)})});async function pr(f,r,t){let e=[];for(let n of f){if(n==="date"){Vs.test(r)&&e.push({name:"date",result:Tt(t?"fr":"en")});continue}if(n==="calc"){let s=fn(r);s.length&&e.push({name:t?"calculatrice":"calculator",result:s.map(i=>`${i.expr} = ${dn(i.value)}`).join(" ; ")});continue}try{if(!(n.match instanceof RegExp?n.match.test(r):n.match(r)))continue;let i=await Ys(Promise.resolve(n.run(r)),Ws),a=String(i??"").replace(/\s+/g," ").trim().slice(0,Is);a&&e.push({name:n.name.replace(/\s+/g," ").trim().slice(0,40),result:a})}catch(s){console.error(`[brimkern] outil \xAB ${n.name} \xBB a \xE9chou\xE9 :`,s)}}return e}function Lt(f,r){if(!f.length)return"";let t=f.map(e=>r?`${e.name} : ${e.result}`:`${e.name}: ${e.result}`).join(" \xB7 ");return r?`[R\xE9sultats d\u2019outils locaux. Exacts, utilise-les tels quels : ${t}]`:`[Local tool results. Exact values, use them as-is: ${t}]`}Rr();async function qs(f){let{LocalBackend:r}=await Promise.resolve().then(()=>(Lr(),As));if(f!==!0)return new r;try{let{WorkerBackend:t}=await Promise.resolve().then(()=>(Bs(),Us)),e=new t;return await e.ready(),e}catch(t){return console.warn("[brimkern] Web Worker indisponible : inf\xE9rence sur le thread principal",t),new r}}Dr();var Di=typeof self<"u"&&typeof self.importScripts=="function"&&typeof document>"u";Di&&Promise.resolve().then(()=>(Ss(),Li));var sr=null,Nr=null,Er;function ot(){return sr||(sr=qs(Er).then(f=>(Nr=f,f))),sr}var ji=()=>Nr?.kind??"pending";function Hr(f){if(f.workerUrl&&Ps(f.workerUrl),f.worker!==void 0){if(sr&&Er!==f.worker){console.warn("[brimkern] option `worker` ignor\xE9e : le backend est d\xE9j\xE0 d\xE9marr\xE9 et partag\xE9 par la page.");return}Er=f.worker}}var Ki=`
Answer briefly and honestly. If you do not know something, say so: never invent facts or details.
You have no tools and no internet access: never emit tool calls, reply in plain text only.`,Ei=`
Answer briefly and honestly. If you do not know something, say so: never invent facts or details.
Bracketed tool results in the message are exact facts: use them as-is. Never emit tool calls yourself, reply in plain text only.`;function Ms(){let f=new Map;return{on(r,t){let e=f.get(r);return e||f.set(r,e=new Set),e.add(t),()=>{e.delete(t)}},emit(r,...t){let e=f.get(r);if(e)for(let n of[...e])try{n(...t)}catch(s){console.error("[brimkern] \xE9couteur `"+r+"` a lev\xE9 :",s)}},clear(){f.clear()}}}function Ut(f){if(!Array.isArray(f))return[];let r=[];for(let t of f){let e=t?.role,n=t?.content;(e==="user"||e==="assistant")&&typeof n=="string"&&n.trim()&&r.push({role:e,content:n})}return r}function Gt(f){return f.lang?f.lang==="fr":f.system?/[àâäéèêëîïôöùûüç]|\b(?:bonjour|salut|vous|tu|réponds|conseiller|boutique|aide|aidez|client|magasin)\b/i.test(f.system):!!(typeof document<"u"&&/^fr\b/i.test(document.documentElement.lang||"")||typeof navigator<"u"&&/^fr\b/i.test(navigator.language||""))}var Os={en:{ouvrir:"Open the chat",fermer:"Close",placeholder:"Type a message\u2026",note:"Local AI \u2014 runs on your GPU, nothing is sent anywhere.",erreur:"Error: ",vide:"Sorry, I can only answer in plain text here: could you rephrase?",aide:"I\u2019m here to help \u2014 what would you like to know?",mo:"MB",sources:"Sources:",phases:{init:"Starting up\u2026",download:"downloading the model\u2026",tokenizer:"tokenizer\u2026",gpu:"weights to the GPU\u2026"},erreurs:{"no-webgpu":"This browser does not support WebGPU: the local assistant cannot run here."}},fr:{ouvrir:"Ouvrir le chat",fermer:"Fermer",placeholder:"\xC9cris un message\u2026",note:"IA locale \u2014 tourne sur votre GPU, aucune donn\xE9e envoy\xE9e.",erreur:"Erreur : ",vide:"D\xE9sol\xE9, je ne peux r\xE9pondre qu\u2019en texte simple ici : pouvez-vous reformuler ?",aide:"Je suis l\xE0 pour vous aider \u2014 que voulez-vous savoir ?",mo:"Mo",sources:"Sources :",phases:{init:"initialisation\u2026",download:"t\xE9l\xE9chargement du mod\xE8le\u2026",tokenizer:"tokenizer\u2026",gpu:"poids sur le GPU\u2026"},erreurs:{"no-webgpu":"Ce navigateur ne prend pas en charge WebGPU : l\u2019assistant local ne peut pas tourner ici."}}};function Ni(f,r){if(!r)return f;let t=n=>typeof n=="string"&&!!n.trim(),e={...f.phases};if(r.phases&&typeof r.phases=="object")for(let[n,s]of Object.entries(r.phases))t(s)&&(e[n]=s);return{...f,...t(r.open)?{ouvrir:r.open}:null,...t(r.close)?{fermer:r.close}:null,...t(r.placeholder)?{placeholder:r.placeholder}:null,...t(r.note)?{note:r.note}:null,...t(r.error)?{erreur:r.error}:null,...t(r.empty)?{vide:r.empty}:null,...t(r.help)?{aide:r.help}:null,...t(r.sources)?{sources:r.sources}:null,...t(r.mb)?{mo:r.mb}:null,phases:e}}var Hi=(f,r)=>f.phases[r]??r,Fs=(f,r)=>r?.code&&f.erreurs[r.code]||r?.message||String(r);function ir(f){let r=Rt(f.tools),t=pn(r)?gn(Gt(f)):"",e=(f.system||"You are a helpful assistant.")+(r.length?Ei:Ki)+t,n=c=>c.flatMap(l=>[{role:"user",content:l.user},{role:"assistant",content:l.assistant}]),s=r.length?zi(Gt(f)):[];if(!f.knowledge)return{system:()=>e,userTurn:(c,l)=>({text:l?`${c}

${l}`:c,sources:[],conversationnel:!1}),pinned:n([...s,...f.examples||[]])};let i=un(ln(f.knowledge)),a=f.knowledgeBudget??1200,o=Gt(f),u=o?e+`

Le message utilisateur peut inclure des fiches de r\xE9f\xE9rence entre des balises ---. Dans ce cas, r\xE9ponds uniquement \xE0 partir de ces fiches en citant fid\xE8lement leurs informations dans la langue de la question. Si aucune note ne correspond, indique poliment que tu n\u2019as pas cette information.`:e+`

The user message may include reference notes between --- markers. When it does, answer from those notes and quote their figures exactly. When it says no note matches, say you do not have that information.`;return{system:()=>u,userTurn:(c,l)=>{let d=cn(c,i,a);if(l&&!d.length)return{text:`${c}

${l}`,sources:[],conversationnel:!1};let p=Ct(d.map(m=>m.chunk),c,o).trim(),g=m=>l?`${m}

${l}`:m;return{text:p?`${g(p)}

Question: ${c}`:g(c),sources:p?d.map(({chunk:m,score:w})=>({title:m.title,text:m.text,score:w,doc:m.doc})):[],conversationnel:!d.length&&!fr(c)}},pinned:n([...Qi(o),...s,...f.examples||[]])}}function zi(f=!1){let r=(t,e)=>`${t}

${Lt(e,f)}`;return f?[{user:r("Combien font 45*3 ?",[{name:"calculatrice",result:"45*3 = 135"}]),assistant:"45*3 = 135."},{user:r("Il vous en reste en rayon ?",[{name:"rayon",result:"3 exemplaires en rayon"}]),assistant:"Oui \u2014 il en reste 3 exemplaires en rayon."}]:[{user:r("What is 45*3?",[{name:"calculator",result:"45*3 = 135"}]),assistant:"45*3 = 135."},{user:r("Do you still have some on the shelf?",[{name:"shelf",result:"3 items on the shelf"}]),assistant:"Yes \u2014 3 items are on the shelf."}]}function Qi(f=!1){let r=(n,s)=>({title:n,text:s,doc:0}),t=(n,s)=>`${Ct(n,void 0,f).trim()}

Question: ${s}`,e=(n,s)=>`${Ct(n,s,f).trim()}

Question: ${s}`;return f?[{user:"Bonjour !",assistant:"Bonjour ! Comment puis-je vous aider ?"},{user:t([r("Guide des tailles",`Tableau des correspondances :
- Pointure EU 38 : 24,0 cm (US 6,5)
- Pointure EU 39 : 24,5 cm (US 7,0)
- Pointure EU 41 : 26,0 cm (US 8,0)`)],"Je fais du 41, quelle taille en cm ?"),assistant:"La pointure 41 correspond \xE0 26,0 cm."},{user:t([r("Retours","Les retours sont gratuits sous 14 jours. Le remboursement est effectu\xE9 sous 3 jours ouvr\xE9s.")],"Combien de temps pour retourner un article ?"),assistant:"Vous disposez de 14 jours pour retourner un article."},{user:t([],"Qui a gagn\xE9 la Coupe du Monde 1998 ?"),assistant:"Je n\u2019ai pas cette information dans mes fiches."},{user:e([],"Tu es un robot ?"),assistant:"Je suis un assistant automatique, oui. Comment puis-je vous aider ?"}]:[{user:"Hello!",assistant:"Hello! How can I help you today?"},{user:t([r("Size guide",`Size conversions:
- Size EU 38: 24.0 cm (US 6.5)
- Size EU 39: 24.5 cm (US 7.0)
- Size EU 41: 26.0 cm (US 8.0)`)],"I wear a 41, what is that in cm?"),assistant:"A size 41 is 26.0 cm."},{user:t([r("Returns","Returns are free within 14 days. Refunds are issued within 3 working days.")],"How long do I have to return an item?"),assistant:"You have 14 days to return an item."},{user:t([],"Who won the 1998 World Cup?"),assistant:"I do not have that information in my notes."},{user:e([],"Are you a robot?"),assistant:"I am an automated assistant, yes. How can I help?"}]}function Cs(f={}){Hr(f);let r=xt(f.model),t=f.maxTokens||220,e=f.knowledge,n=ir(f),s=Gt(f),i=Ut(f.history),a=[],o=Ms(),u=!1,c=!1,l=!1,d=()=>f.temperature??(e?.25:.55),p=Rt(f.tools),g=m=>{if(u)throw new Error(`brimkern: ${m} impossible pendant une g\xE9n\xE9ration`)};return{async ask(m,w={}){if(c)throw new Error("session d\xE9truite");if(u)throw new Error("g\xE9n\xE9ration d\xE9j\xE0 en cours sur cette session");u=!0,i.push({role:"user",content:m}),o.emit("message",{role:"user",content:m});try{let v=await pr(p,m,s);for(let _ of v)o.emit("tool",_);let{text:x,sources:q,conversationnel:F}=n.userTurn(m,Lt(v,s));a=q,w.onSources?.(q);let R=[...i.slice(0,-1),{role:"user",content:x}],K=await ot();await K.preload(r,(_,h)=>o.emit("progress",_,h)),l||(l=!0,o.emit("ready"));let P={url:r,history:R,system:n.system(m),maxTokens:t,temperature:d(),pinned:n.pinned},G=await K.turn(P,w.onToken,w.signal);return w.signal?.aborted?(i.pop(),""):(F&&dr(G,s)&&(G=Os[s?"fr":"en"].aide),i.push({role:"assistant",content:G}),o.emit("message",{role:"assistant",content:G,sources:q}),G)}catch(v){throw i.pop(),o.emit("error",v instanceof Error?v:new Error(String(v))),v}finally{u=!1}},async askBatch(m,w={}){if(c)throw new Error("session d\xE9truite");if(u)throw new Error("g\xE9n\xE9ration d\xE9j\xE0 en cours sur cette session");if(!m.length)return[];u=!0;try{let v=await ot();await v.preload(r,(F,R)=>o.emit("progress",F,R)),l||(l=!0,o.emit("ready"));let x=m.map(F=>({url:r,history:[{role:"user",content:n.userTurn(F,"").text}],system:n.system(F),maxTokens:w.maxTokens??t,temperature:d(),pinned:n.pinned}));if(v.turnBatch)return await v.turnBatch(x);let q=[];for(let F of x)q.push(await v.turn(F));return q}catch(v){throw o.emit("error",v instanceof Error?v:new Error(String(v))),v}finally{u=!1}},reset(){i=[],a=[]},destroy(){c=!0,i=[],a=[],o.clear()},get history(){return i.slice()},get lastSources(){return a.slice()},setHistory(m){g("setHistory"),i=Ut(m)},setKnowledge(m){g("setKnowledge"),e=m,n=ir({...f,knowledge:m}),a=[]},on:o.on}}function $i(){if(document.getElementById("bk-style"))return;let f=document.createElement("style");f.id="bk-style",f.textContent=`
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
  `,document.head.appendChild(f)}function Wi(f){if(!f)return"#c72c1e";if(/^#[0-9a-fA-F]{3,8}$/.test(f))return f;try{if(typeof CSS<"u"&&CSS.supports("color",f)&&!/[{};()]/.test(f))return f}catch{}return"#c72c1e"}function Ii(f,r){let t=f.knowledge,e=ir(f),n=Gt(f),s=Ni(Os[n?"fr":"en"],f.labels),i=Wi(f.accent),a=f.title||"Assistant",o=f.maxTokens||220,u=Rt(f.tools);$i();let c=document.createElement("button");c.className="bk-fab",c.setAttribute("aria-label",s.ouvrir),c.textContent="\u{1F4AC}";let l=document.createElement("div");if(l.className="bk-panel",c.style.setProperty("--bk-accent",i),l.style.setProperty("--bk-accent",i),f.position==="bottom-left")for(let S of[c,l])S.style.left="20px",S.style.right="auto";let d=(S,L,E)=>typeof S=="number"&&Number.isFinite(S)?Math.min(E,Math.max(L,Math.round(S))):null,p=d(f.width,300,480),g=d(f.height,380,720);p&&(l.style.width=`${p}px`),g&&(l.style.height=`${g}px`);let m={"--bk-bg":"#211f1c","--bk-surface":"#2c2a26","--bk-border":"#413e38","--bk-border2":"#3a3733","--bk-text":"#f0eee8","--bk-muted":"#a29e93","--bk-muted2":"#c6c2b8"},w=S=>{for(let L of[c,l])for(let[E,Q]of Object.entries(m))S?L.style.setProperty(E,Q):L.style.removeProperty(E)},v=null,x=null;f.theme==="dark"?w(!0):f.theme==="auto"&&typeof matchMedia=="function"&&(v=matchMedia("(prefers-color-scheme: dark)"),w(v.matches),x=S=>w(S.matches),v.addEventListener("change",x)),l.innerHTML=`
    <div class="bk-hd"><span class="bk-dot"></span><span>${nr(a)}</span><button class="bk-x" aria-label="${nr(s.fermer)}">\xD7</button></div>
    <div class="bk-msgs"></div>
    <div class="bk-foot"><textarea class="bk-in" rows="1" placeholder="${nr(s.placeholder)}"></textarea><button class="bk-send">\u2191</button></div>
    <div class="bk-note">${nr(s.note)}</div>`,document.body.appendChild(c),document.body.appendChild(l);let q=l.querySelector(".bk-msgs"),F=l.querySelector(".bk-in"),R=l.querySelector(".bk-send"),K=l.querySelector(".bk-x"),P=Ut(f.history),G=!1,_=!1,h=!1,y=new AbortController,b=(S,L)=>{let E=document.createElement("div");return E.className=`bk-m ${S==="user"?"bk-u":"bk-a"}`,E.textContent=L,q.appendChild(E),q.scrollTop=q.scrollHeight,E},k=S=>{if(!f.showSources||!S.length)return;let L=document.createElement("div");L.className="bk-src";let E=document.createElement("b");E.textContent=`${s.sources} `,L.appendChild(E),L.appendChild(document.createTextNode(S.map((Q,H)=>`[${H+1}] ${Q.title||Q.text.slice(0,40).replace(/\s+/g," ").trim()+"\u2026"}`).join(" \xB7 "))),q.appendChild(L),q.scrollTop=q.scrollHeight},A=()=>{q.textContent="";for(let S of P)b(S.role,S.content)};P.length?A():f.greeting&&(P.push({role:"assistant",content:f.greeting}),b("assistant",f.greeting));let B=xt(f.model),U=()=>{if(!_){_=!0;let S=b("assistant",s.phases.init);S.classList.add("bk-status"),ot().then(L=>L.preload(B,(E,Q)=>{r.emit("progress",E,Q);let H=Hi(s,E);S.textContent=Q?.total?`${H} ${Math.round(Q.loaded/1048576)} / ${Math.round(Q.total/1048576)} ${s.mo}`:H})).then(()=>{S.remove(),r.emit("ready")}).catch(L=>{S.textContent=s.erreur+Fs(s,L),_=!1,r.emit("error",L instanceof Error?L:new Error(String(L)))})}return ot()},M=async S=>{G=!0,R.disabled=!0,P.push({role:"user",content:S}),b("user",S),r.emit("message",{role:"user",content:S});let L=b("assistant","\u2026");try{await U();let E=await pr(u,S,n);for(let j of E)r.emit("tool",j);let{text:Q,sources:H,conversationnel:W}=e.userTurn(S,Lt(E,n)),$=[...P.slice(0,-1),{role:"user",content:Q}],D={url:B,history:$,system:e.system(S),maxTokens:o,temperature:t?.25:.55,pinned:e.pinned},C=await(await ot()).turn(D,j=>{L.textContent=j||"\u2026",q.scrollTop=q.scrollHeight},y.signal);return h?"":(C?W&&dr(C,n)&&(C=s.aide):C=s.vide,L.textContent=C,P.push({role:"assistant",content:C}),k(H),r.emit("message",{role:"assistant",content:C,sources:H}),C)}catch(E){throw L.textContent=s.erreur+Fs(s,E),r.emit("error",E instanceof Error?E:new Error(String(E))),E}finally{G=!1,R.disabled=!1,h||F.focus()}},O=()=>{let S=F.value.trim();!S||G||h||(F.value="",M(S).catch(()=>{}))},T=S=>{h||l.classList.contains("bk-open")!==S&&(l.classList.toggle("bk-open",S),S&&(F.focus(),U()),r.emit(S?"open":"close"))};return c.onclick=()=>T(!l.classList.contains("bk-open")),K.onclick=()=>T(!1),R.onclick=O,F.onkeydown=S=>{S.key==="Enter"&&!S.shiftKey&&(S.preventDefault(),O())},{open:()=>T(!0),close:()=>T(!1),toggle:()=>T(!l.classList.contains("bk-open")),ask(S){if(h)return Promise.reject(new Error("brimkern: widget d\xE9mont\xE9"));let L=String(S??"").trim();return L?G?Promise.reject(new Error("g\xE9n\xE9ration d\xE9j\xE0 en cours sur ce widget")):(T(!0),M(L)):Promise.reject(new Error("brimkern: ask() attend une question non vide"))},destroy(){h||(h=!0,y.abort(),v&&x&&v.removeEventListener("change",x),c.onclick=null,K.onclick=null,R.onclick=null,F.onkeydown=null,c.remove(),l.remove(),P=[])},setKnowledge(S){t=S,e=ir({...f,knowledge:S})},setHistory(S){if(G)throw new Error("brimkern: setHistory impossible pendant une g\xE9n\xE9ration");P=Ut(S),A()},history:()=>P.slice(),el:l}}function nr(f){return f.replace(/[&<>"']/g,r=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[r])}var Vi=(f={})=>{let r=Ms(),t=null,e=!1,n=!1,s=[],i=o=>{t?o(t):!e&&!n&&s.push(o)},a=()=>{if(!(n||t)){t=Ii(f,r);for(let o of s.splice(0))o(t)}};return typeof window>"u"||typeof document>"u"?(e=!0,console.warn("[brimkern] embed() ignor\xE9 : aucun DOM (rendu serveur ?). Appelez-le dans un effet client.")):(Hr(f),document.body?a():window.addEventListener("DOMContentLoaded",a,{once:!0})),{open:()=>i(o=>o.open()),close:()=>i(o=>o.close()),toggle:()=>i(o=>o.toggle()),ask(o){return e?Promise.reject(new Error("brimkern: ask() sans DOM (rendu serveur ?)")):n?Promise.reject(new Error("brimkern: widget d\xE9mont\xE9")):new Promise((u,c)=>i(l=>l.ask(o).then(u,c)))},destroy(){n=!0,s.length=0,t?.destroy(),t=null,r.clear()},setKnowledge:o=>i(u=>u.setKnowledge(o)),setHistory:o=>i(u=>u.setHistory(o)),get history(){return t?t.history():Ut(f.history)},get el(){return t?t.el:null},on:r.on}};var Yi=async f=>{if(typeof f!="object"||f===null||typeof f.prompt!="string")throw new TypeError(`Brimkern.generate expects a single object: generate({ prompt: "\u2026", model?, system? }). Received ${typeof f}${typeof f=="object"&&f?" without a `prompt` string":""}.`);return Cs(f).ask(f.prompt,{onToken:f.onToken,signal:f.signal,onSources:f.onSources})},Xi=(f={})=>(Hr(f),typeof navigator<"u"&&"gpu"in navigator?ot().then(r=>r.preload(xt(f.model),f.onProgress)).then(()=>!0).catch(()=>!1):Promise.resolve(!1)),Ji=f=>typeof navigator>"u"||!("gpu"in navigator)?"unavailable":Nr?.state(xt(f))??"idle";typeof window<"u"&&(window.Brimkern={embed:Vi,createSession:Cs,generate:Yi,preload:Xi,status:Ji,runtime:ji});})();
