// BANC GPU DE LA PAGE /fruit-fly — le seul chiffre que cette page publie, et il est MESURÉ dans
// l'onglet du visiteur, sur sa machine, au moment où il regarde.
//
// POURQUOI UN MODULE À PART. La page compare le GPU du lecteur au connectome de la drosophile
// (166 000 neurones, 125 M de synapses — Janelia/Google, Cell, 03/09/2026). Le chiffre de la
// mouche vient d'une publication ; celui du GPU ne pouvait donc PAS venir d'une table de valeurs
// constructeur ni d'une mesure faite sur le Mac de Romain et recopiée : règle 4 de la maison, on
// n'annonce pas un chiffre qu'on n'a pas mesuré — et « mesuré chez moi » n'est pas « mesuré chez
// vous ». D'où un banc autonome : il ne charge aucun modèle, ne touche pas au moteur, demande son
// propre device, mesure, rend la main et se détruit. Une visite coûte ~1 s et 0 octet de poids.
//
// CE QU'IL MESURE, EXACTEMENT : le débit soutenu d'un matmul f32 tuilé 16×16 — la forme de kernel
// dont vit le prefill du moteur. Ce n'est PAS le pic théorique de la carte (qui suppose f16, des
// tenseurs alignés et une occupation parfaite), et la page le dit. C'est ce que ce GPU tient
// réellement sur du code WGSL écrit à la main, soumission comprise.
//
// ⚠️ RÈGLE 2, APPLIQUÉE ICI COMME AILLEURS. Un kernel WGSL neuf = référence CPU + repli +
// kill-switch, sans exception — et elle mord plus fort ici qu'ailleurs : un kernel qui se compile
// mal sur un GPU exotique ne rendrait pas une erreur, il rendrait un DÉBIT. Faux, publié, et
// crédible. Le gate est donc bloquant pour l'affichage : pas de validation, pas de chiffre.
//   1. `validate()` compare le kernel à une référence CPU sur DEUX formes — une alignée sur la
//      tuile (le chemin du banc) et une qui ne l'est pas (les gardes de bord) ;
//   2. le repli n'est pas un autre kernel (il n'y en a pas de précédent) mais l'ABSENCE de
//      chiffre : la page retombe sur sa comparaison statique et dit pourquoi ;
//   3. `?flybench=0` éteint la mesure — c'est le bras témoin, et c'est aussi ce qu'on donne à
//      quelqu'un dont le GPU plante pour qu'il puisse quand même lire la page.
//
// ⚠️ VARIANCE. Un tir unique de ce banc s'étale ; on en fait donc trois et on rend la MÉDIANE avec
// les extrêmes, que la page affiche. Même leçon que les bancs de `scripts/e2e/` : un chiffre sans
// sa dispersion invite à comparer deux machines à 3 % près, ce qui ne veut rien dire.

import { urlFlag } from './urlFlags';

// Les types WebGPU ne sont pas dans la lib TS du projet — même convention que kernels.ts.
type GPUAny = ReturnType<typeof Object.create>;

export interface FlyBenchResult {
	/** Débit soutenu médian, en GFLOP/s. `null` si rien n'a pu être mesuré. */
	gflops: number | null;
	/** Extrêmes des tirs, pour afficher la dispersion plutôt qu'un chiffre nu. */
	spread: { min: number; max: number } | null;
	/** Nom du GPU quand le navigateur l'expose (il ne le fait pas toujours, et c'est normal). */
	device: string | null;
	/** Pourquoi il n'y a pas de chiffre — la page en fait une phrase, jamais une erreur à l'écran. */
	status: 'ok' | 'no-webgpu' | 'no-adapter' | 'failed-validation' | 'disabled' | 'error';
	/** L'étape de validation qui est tombée, quand c'est le gate qui a parlé. */
	failedAt?: string;
}

// ── Le kernel ────────────────────────────────────────────────────────────────────────────────────
// Matmul tuilé classique : chaque workgroup 16×16 calcule une tuile 16×16 de C en faisant glisser
// deux tuiles de A et B par la mémoire de groupe. Pas de subgroups, pas de f16 : ce banc doit
// rendre un chiffre sur TOUT GPU qui fait tourner WebGPU, y compris un téléphone, et une
// fonctionnalité optionnelle absente aurait fait une page vide plutôt qu'un chiffre plus petit.
const TILE = 16;

const WGSL = /* wgsl */ `
struct Dims { m: u32, k: u32, n: u32, pad: u32 };
@group(0) @binding(0) var<storage, read>       a : array<f32>;
@group(0) @binding(1) var<storage, read>       b : array<f32>;
@group(0) @binding(2) var<storage, read_write> c : array<f32>;
@group(0) @binding(3) var<uniform>             d : Dims;

var<workgroup> ta : array<f32, ${TILE * TILE}>;
var<workgroup> tb : array<f32, ${TILE * TILE}>;

@compute @workgroup_size(${TILE}, ${TILE})
fn main(@builtin(global_invocation_id) gid : vec3<u32>,
        @builtin(local_invocation_id)  lid : vec3<u32>) {
  let row = gid.y; let col = gid.x;
  let lr  = lid.y; let lc  = lid.x;
  var acc = 0.0;
  let tiles = (d.k + ${TILE}u - 1u) / ${TILE}u;
  for (var t = 0u; t < tiles; t = t + 1u) {
    // Les bords sont gardés par un if qui se REFERME avant la barrière : celle-ci reste donc en
    // flot de contrôle uniforme, condition de validité d'un workgroupBarrier en WGSL.
    let ak = t * ${TILE}u + lc;
    var av = 0.0;
    if (row < d.m && ak < d.k) { av = a[row * d.k + ak]; }
    ta[lr * ${TILE}u + lc] = av;

    let bk = t * ${TILE}u + lr;
    var bv = 0.0;
    if (bk < d.k && col < d.n) { bv = b[bk * d.n + col]; }
    tb[lr * ${TILE}u + lc] = bv;

    workgroupBarrier();
    for (var i = 0u; i < ${TILE}u; i = i + 1u) {
      acc = acc + ta[lr * ${TILE}u + i] * tb[i * ${TILE}u + lc];
    }
    workgroupBarrier();
  }
  if (row < d.m && col < d.n) { c[row * d.n + col] = acc; }
}`;

// ── Plomberie ────────────────────────────────────────────────────────────────────────────────────

function storage(dev: GPUAny, data: Float32Array, dst = false): GPUAny {
	const buf = dev.createBuffer({
		size: Math.max(16, data.byteLength),
		usage: 0x80 | 0x8 | (dst ? 0x4 : 0), // STORAGE | COPY_DST | COPY_SRC
	});
	dev.queue.writeBuffer(buf, 0, data);
	return buf;
}

function dims(dev: GPUAny, m: number, k: number, n: number): GPUAny {
	const buf = dev.createBuffer({ size: 16, usage: 0x40 | 0x8 }); // UNIFORM | COPY_DST
	dev.queue.writeBuffer(buf, 0, new Uint32Array([m, k, n, 0]));
	return buf;
}

/** Encode `iters` dispatches de la même forme dans UNE soumission. */
function submit(dev: GPUAny, pipe: GPUAny, bind: GPUAny, m: number, n: number, iters: number): void {
	const enc = dev.createCommandEncoder();
	const gx = Math.ceil(n / TILE), gy = Math.ceil(m / TILE);
	for (let i = 0; i < iters; i++) {
		const pass = enc.beginComputePass();
		pass.setPipeline(pipe);
		pass.setBindGroup(0, bind);
		pass.dispatchWorkgroups(gx, gy);
		pass.end();
	}
	dev.queue.submit([enc.finish()]);
}

async function readBack(dev: GPUAny, src: GPUAny, bytes: number): Promise<Float32Array> {
	const staging = dev.createBuffer({ size: bytes, usage: 0x1 | 0x8 }); // MAP_READ | COPY_DST
	const enc = dev.createCommandEncoder();
	enc.copyBufferToBuffer(src, 0, staging, 0, bytes);
	dev.queue.submit([enc.finish()]);
	await staging.mapAsync(0x1);
	const out = new Float32Array(staging.getMappedRange().slice(0));
	staging.unmap();
	staging.destroy?.();
	return out;
}

// ── Le gate ──────────────────────────────────────────────────────────────────────────────────────
// Deux formes, et les deux comptent. (24,40,19) n'est multiple de la tuile sur AUCUN axe : c'est le
// seul test qui exerce les trois gardes de bord. (32,32,32) est aligné — c'est la géométrie exacte
// du banc, et un kernel juste aux bords mais faux au centre serait passé sans elle.
async function validate(dev: GPUAny, pipe: GPUAny, layout: GPUAny): Promise<string | null> {
	const rand = (n: number) => Float32Array.from({ length: n }, () => Math.random() * 2 - 1);

	for (const [m, k, n] of [[24, 40, 19], [32, 32, 32]] as const) {
		const A = rand(m * k), B = rand(k * n);
		const ref = new Float32Array(m * n);
		for (let r = 0; r < m; r++)
			for (let c = 0; c < n; c++) {
				let s = 0;
				for (let i = 0; i < k; i++) s += A[r * k + i] * B[i * n + c];
				ref[r * n + c] = s;
			}

		const bufA = storage(dev, A), bufB = storage(dev, B);
		const bufC = storage(dev, new Float32Array(m * n), true), bufD = dims(dev, m, k, n);
		const bind = dev.createBindGroup({
			layout,
			entries: [bufA, bufB, bufC, bufD].map((buffer, binding) => ({ binding, resource: { buffer } })),
		});
		submit(dev, pipe, bind, m, n, 1);
		const got = await readBack(dev, bufC, m * n * 4);
		for (const b of [bufA, bufB, bufC, bufD]) b.destroy?.();

		// Tolérance RELATIVE : l'accumulation f32 sur k termes dérive avec k, un seuil absolu
		// aurait donc été trop lâche sur les petites formes et trop serré sur les grandes.
		const bad = got.length !== ref.length
			|| got.some((v, i) => Math.abs(v - ref[i]) > 1e-3 * (1 + Math.abs(ref[i])));
		if (bad) return `matmul(${m},${k},${n})`;
	}
	return null;
}

// ── La mesure ────────────────────────────────────────────────────────────────────────────────────
// 512³ : ~268 MFLOP par dispatch. Assez gros pour que le GPU travaille vraiment (une forme trop
// petite ne mesure que la latence de lancement), assez petit pour tenir en 3 Mo de VRAM et ne pas
// faire ramer un téléphone.
const N = 512;
const FLOP_PAR_DISPATCH = 2 * N * N * N;
const CIBLE_MS = 250;   // durée visée d'un tir : au-dessus du bruit d'ordonnancement, sous le seuil d'attente ressentie
const TIRS = 3;

export async function runFlyBench(): Promise<FlyBenchResult> {
	const vide: FlyBenchResult = { gflops: null, spread: null, device: null, status: 'ok' };

	if (urlFlag('flybench') === '0') return { ...vide, status: 'disabled' };

	const gpu = (navigator as Navigator & { gpu?: GPUAny }).gpu;
	if (!gpu) return { ...vide, status: 'no-webgpu' };

	let dev: GPUAny = null;
	try {
		const adapter = await gpu.requestAdapter({ powerPreference: 'high-performance' });
		if (!adapter) return { ...vide, status: 'no-adapter' };

		const ai = adapter.info ?? (adapter.requestAdapterInfo ? await adapter.requestAdapterInfo().catch(() => undefined) : undefined);
		const device = [ai?.vendor, ai?.architecture, ai?.description].filter(Boolean).join(' ').trim() || null;

		dev = await adapter.requestDevice();
		// Un device perdu en cours de banc ne doit pas remonter en exception non capturée : on laisse
		// le `catch` global rendre un statut, la page dira simplement qu'elle n'a pas pu mesurer.
		dev.lost?.then(() => { /* le finally détruit ce qui reste */ });

		const shaderModule = dev.createShaderModule({ code: WGSL });
		const pipe = dev.createComputePipeline({ layout: 'auto', compute: { module: shaderModule, entryPoint: 'main' } });
		const layout = pipe.getBindGroupLayout(0);

		const failedAt = await validate(dev, pipe, layout);
		if (failedAt) return { ...vide, device, status: 'failed-validation', failedAt };

		const bufA = storage(dev, Float32Array.from({ length: N * N }, () => Math.random() * 2 - 1));
		const bufB = storage(dev, Float32Array.from({ length: N * N }, () => Math.random() * 2 - 1));
		const bufC = storage(dev, new Float32Array(N * N), true);
		const bufD = dims(dev, N, N, N);
		const bind = dev.createBindGroup({
			layout,
			entries: [bufA, bufB, bufC, bufD].map((buffer, binding) => ({ binding, resource: { buffer } })),
		});

		const chrono = async (iters: number) => {
			const t0 = performance.now();
			submit(dev, pipe, bind, N, N, iters);
			await dev.queue.onSubmittedWorkDone();
			return performance.now() - t0;
		};

		// Chauffe. Deux choses à payer AVANT de mesurer, et elles n'ont rien à voir l'une avec l'autre :
		// la compilation du shader (premier dispatch), et la MONTÉE EN FRÉQUENCE du GPU — une puce au
		// repos démarre à sa fréquence basse et met ~100 ms à s'installer — et c'est de LOIN le plus
		// gros des deux. Mesuré le 11/09/2026 (M-series, 6 chargements de page successifs) : sans
		// cette rampe, la page rendait 380 / 486 / 493 GFLOP/s, soit ±13 % autour de la médiane ;
		// avec elle, 490 / 492 / 494 / 494 / 495 / 496, soit ±0,6 %. La différence n'était pas du
		// bruit à moyenner, c'était un biais SYSTÉMATIQUE vers le bas au premier tir — la moyenner
		// aurait publié un GPU plus lent qu'il n'est, et de façon irrégulière selon le visiteur.
		for (let it = 2, t = 0; t < 150 && it <= 512; it *= 2) t += await chrono(it);

		// Calibrage : on ne peut pas fixer le nombre d'itérations à l'avance — entre un GPU discret
		// et un téléphone il y a deux ordres de grandeur, et c'est justement ce qu'on mesure. On
		// chronomètre donc une poignée de dispatches pour dimensionner le vrai tir.
		const sonde = await chrono(4);
		const parDispatch = Math.max(sonde / 4, 0.05);
		const iters = Math.min(2000, Math.max(4, Math.round(CIBLE_MS / parDispatch)));

		const debits: number[] = [];
		for (let i = 0; i < TIRS; i++) {
			const ms = await chrono(iters);
			debits.push((FLOP_PAR_DISPATCH * iters) / (ms / 1000) / 1e9);
		}
		debits.sort((x, y) => x - y);

		for (const b of [bufA, bufB, bufC, bufD]) b.destroy?.();
		return {
			gflops: debits[Math.floor(debits.length / 2)],
			spread: { min: debits[0], max: debits[debits.length - 1] },
			device,
			status: 'ok',
		};
	} catch {
		return { ...vide, status: 'error' };
	} finally {
		// Le banc rend le GPU tout de suite : le visiteur va peut-être charger un modèle juste après,
		// et un device oublié garde de la VRAM réservée.
		try { dev?.destroy?.(); } catch { /* déjà perdu */ }
	}
}
