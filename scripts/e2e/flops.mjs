// PLAFOND DE CALCUL de la machine — le pendant de bandwidth.mjs pour le PREFILL.
//
// Le décodage est memory-bound et bandwidth.mjs a donné son plafond (106,9 Go/s) : le GEMV est à
// 79-92 %, chantier clos. Le prefill est l'inverse : compute-bound (ROADMAP §11 — à d=3584 les
// matmuls font 6,4 s sur 7,5 s de prefill), et nos GEMM tiennent ~950-1000 GFLOP/s sur toutes les
// formes. Mais 1000 GFLOP/s, c'est beaucoup ou c'est peu ? Sans le plafond FMA de la machine, ce
// chiffre ne dit rien — exactement le trou que bandwidth.mjs a comblé pour l'autre phase.
//
// Ce banc mesure QUATRE kernels, du plus abstrait au plus proche du GEMM réel :
//   1. fma_pure        — des chaînes FMA en registres, rien d'autre : le plafond absolu.
//   2. inner_2x4       — la boucle interne EXACTE de matmul_t_*_shared aujourd'hui :
//                        6 lectures de mémoire partagée pour 8 FMA scalaires (bloc 2 lignes × 4 col).
//   3. inner_4x4       — la même boucle avec un bloc 4×4 : 8 lectures pour 16 FMA.
//   4. inner_4x4_vec4  — le bloc 4×4 en vec4 (produit extérieur) : 2 lectures vec4 pour 4 FMA vec4.
// Les maquettes 2-4 ne calculent pas un vrai GEMM (pas de chargement de tuile, pas de déquant) :
// elles isolent le RAPPORT lectures-partagées/FMA, pour choisir la structure du prochain kernel
// AVANT de l'écrire — le premier essai de tuilage f16 (16×16, 1 accumulateur) avait été plus LENT
// que le kernel naïf précisément parce que ce rapport était mauvais (ROADMAP §1).
//
//   node scripts/e2e/flops.mjs
//
// Autonome : ce banc ne touche AUCUN code de l'app — il n'a besoin que d'un contexte sécurisé pour
// WebGPU. Il sert donc lui-même une page vide sur 127.0.0.1 au lieu d'exiger `next start` (que la
// pression mémoire de cette machine tue volontiers au milieu d'un banc, cf. ROADMAP §11).
import { createServer } from 'node:http';
import { chromium } from 'playwright-core';
import { CHROME as EXE } from './chrome.mjs';

const server = createServer((_, res) => {
  res.writeHead(200, { 'content-type': 'text/html' });
  res.end('<!doctype html><title>flops</title>');
});
await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
const port = server.address().port;

const browser = await chromium.launch({
  executablePath: EXE, headless: true,
  args: ['--enable-unsafe-webgpu', '--use-angle=metal'],
});
const page = await browser.newPage();
await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'domcontentloaded' });

const res = await page.evaluate(async () => {
  const gpu = navigator.gpu;
  if (!gpu) return { error: 'WebGPU absent' };
  const adapter = await gpu.requestAdapter({ powerPreference: 'high-performance' });
  if (!adapter) return { error: 'aucun adapter' };
  const device = await adapter.requestDevice();
  const info = adapter.info ?? {};

  const HEADER = `
    @group(0) @binding(0) var<uniform> p: vec4<u32>;
    @group(0) @binding(1) var<storage, read_write> sink: array<f32>;`;

  // 1. Plafond FMA : 8 accumulateurs vec4 par thread (assez d'ILP pour couvrir la latence des
  // unités), b/c dépendent du thread pour que rien ne se replie en constante à la compilation.
  const FMA_PURE = `${HEADER}
    @compute @workgroup_size(256)
    fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
      let seed = f32(gid.x & 1023u) * 1e-6 + 0.5;
      var a0 = vec4<f32>(seed, seed + 0.1, seed + 0.2, seed + 0.3);
      var a1 = a0 * 1.01; var a2 = a0 * 1.02; var a3 = a0 * 1.03;
      var a4 = a0 * 1.04; var a5 = a0 * 1.05; var a6 = a0 * 1.06; var a7 = a0 * 1.07;
      let b = vec4<f32>(0.9999 + seed * 1e-4);
      let c = vec4<f32>(1e-7 * seed);
      for (var i = 0u; i < p.x; i = i + 1u) {
        a0 = fma(a0, b, c); a1 = fma(a1, b, c); a2 = fma(a2, b, c); a3 = fma(a3, b, c);
        a4 = fma(a4, b, c); a5 = fma(a5, b, c); a6 = fma(a6, b, c); a7 = fma(a7, b, c);
      }
      let s = a0 + a1 + a2 + a3 + a4 + a5 + a6 + a7;
      sink[gid.x & 8191u] = s.x + s.y + s.z + s.w;
    }`;

  // Les maquettes partagent l'init : chaque thread sème sa part des tuiles, une barrière, puis la
  // boucle ne fait QUE lire la mémoire partagée et accumuler — le rapport lectures/FMA du vrai GEMM,
  // sans son trafic mémoire globale (les poids d'une tuile 16k sont lus une fois pour 32-64 lignes,
  // ce trafic est négligeable devant le calcul dès m ≥ 256 : cf. __prefillBench, compute-bound).
  const SHARED_INIT = (asN, wsN) => `
    var<workgroup> As: array<f32, ${asN}>;
    var<workgroup> Ws: array<f32, ${wsN}>;
    ${HEADER}
    fn seedAt(i: u32, gx: u32) -> f32 { return f32((i * 1664525u + gx * 1013904223u) & 65535u) * 3e-7 - 0.01; }`;

  // 2. La boucle interne ACTUELLE de matmul_t_q8_shared : bloc 2 lignes × 4 colonnes,
  // 2 + 4 = 6 lectures partagées pour 8 FMA scalaires (16 FLOP).
  const INNER_2X4 = `${SHARED_INIT(512, 1024)}
    @compute @workgroup_size(256)
    fn main(@builtin(global_invocation_id) gid: vec3<u32>, @builtin(local_invocation_index) tid: u32) {
      for (var j = tid; j < 512u; j = j + 256u) { As[j] = seedAt(j, gid.x); }
      for (var j = tid; j < 1024u; j = j + 256u) { Ws[j] = seedAt(j + 7u, gid.x); }
      workgroupBarrier();
      let tr = (tid >> 4u) * 2u; let tc = (tid & 15u) * 4u;
      var acc0 = 0.0; var acc1 = 0.0; var acc2 = 0.0; var acc3 = 0.0;
      var acc4 = 0.0; var acc5 = 0.0; var acc6 = 0.0; var acc7 = 0.0;
      for (var i = 0u; i < p.x; i = i + 1u) {
        let kk = i & 15u;
        let ab = kk * 32u + tr; let wb = kk * 64u + tc;
        let av0 = As[ab]; let av1 = As[ab + 1u];
        let wv0 = Ws[wb]; let wv1 = Ws[wb + 1u]; let wv2 = Ws[wb + 2u]; let wv3 = Ws[wb + 3u];
        acc0 = acc0 + av0 * wv0; acc1 = acc1 + av0 * wv1; acc2 = acc2 + av0 * wv2; acc3 = acc3 + av0 * wv3;
        acc4 = acc4 + av1 * wv0; acc5 = acc5 + av1 * wv1; acc6 = acc6 + av1 * wv2; acc7 = acc7 + av1 * wv3;
      }
      sink[gid.x & 8191u] = acc0 + acc1 + acc2 + acc3 + acc4 + acc5 + acc6 + acc7;
    }`;

  // 3. Bloc 4×4 scalaire : 4 + 4 = 8 lectures pour 16 FMA (32 FLOP) — le rapport double.
  // Tuile 64 lignes × 64 colonnes (16 groupes de rangées × 16 colonnes de threads).
  const INNER_4X4 = `${SHARED_INIT(1024, 1024)}
    @compute @workgroup_size(256)
    fn main(@builtin(global_invocation_id) gid: vec3<u32>, @builtin(local_invocation_index) tid: u32) {
      for (var j = tid; j < 1024u; j = j + 256u) { As[j] = seedAt(j, gid.x); Ws[j] = seedAt(j + 7u, gid.x); }
      workgroupBarrier();
      let tr = (tid >> 4u) * 4u; let tc = (tid & 15u) * 4u;
      var r0 = vec4<f32>(0.0); var r1 = vec4<f32>(0.0); var r2 = vec4<f32>(0.0); var r3 = vec4<f32>(0.0);
      for (var i = 0u; i < p.x; i = i + 1u) {
        let kk = i & 15u;
        let ab = kk * 64u + tr; let wb = kk * 64u + tc;
        let av0 = As[ab]; let av1 = As[ab + 1u]; let av2 = As[ab + 2u]; let av3 = As[ab + 3u];
        let wv = vec4<f32>(Ws[wb], Ws[wb + 1u], Ws[wb + 2u], Ws[wb + 3u]);
        r0 = fma(vec4<f32>(av0), wv, r0); r1 = fma(vec4<f32>(av1), wv, r1);
        r2 = fma(vec4<f32>(av2), wv, r2); r3 = fma(vec4<f32>(av3), wv, r3);
      }
      let s = r0 + r1 + r2 + r3;
      sink[gid.x & 8191u] = s.x + s.y + s.z + s.w;
    }`;

  // 4. Bloc 4×4 en PRODUIT EXTÉRIEUR vec4 : la mémoire partagée est rangée en vec4, donc
  // 2 lectures vec4 pour 4 FMA vec4 (32 FLOP) — le rapport quadruple par rapport à l'actuel.
  const INNER_4X4_VEC4 = `
    var<workgroup> Asv: array<vec4<f32>, 256>;
    var<workgroup> Wsv: array<vec4<f32>, 256>;
    ${HEADER}
    fn seedAt(i: u32, gx: u32) -> f32 { return f32((i * 1664525u + gx * 1013904223u) & 65535u) * 3e-7 - 0.01; }
    @compute @workgroup_size(256)
    fn main(@builtin(global_invocation_id) gid: vec3<u32>, @builtin(local_invocation_index) tid: u32) {
      Asv[tid] = vec4<f32>(seedAt(tid * 4u, gid.x), seedAt(tid * 4u + 1u, gid.x), seedAt(tid * 4u + 2u, gid.x), seedAt(tid * 4u + 3u, gid.x));
      Wsv[tid] = vec4<f32>(seedAt(tid * 4u + 7u, gid.x), seedAt(tid * 4u + 8u, gid.x), seedAt(tid * 4u + 9u, gid.x), seedAt(tid * 4u + 10u, gid.x));
      workgroupBarrier();
      let tr = tid >> 4u; let tc = tid & 15u;
      var r0 = vec4<f32>(0.0); var r1 = vec4<f32>(0.0); var r2 = vec4<f32>(0.0); var r3 = vec4<f32>(0.0);
      for (var i = 0u; i < p.x; i = i + 1u) {
        let kk = i & 15u;
        let av = Asv[kk * 16u + tr];
        let wv = Wsv[kk * 16u + tc];
        r0 = fma(vec4<f32>(av.x), wv, r0); r1 = fma(vec4<f32>(av.y), wv, r1);
        r2 = fma(vec4<f32>(av.z), wv, r2); r3 = fma(vec4<f32>(av.w), wv, r3);
      }
      let s = r0 + r1 + r2 + r3;
      sink[gid.x & 8191u] = s.x + s.y + s.z + s.w;
    }`;

  // 5-6. Blocs plus larges en vec4 : 4×8 (3 lectures / 8 FMA vec4) et 8×8 (4 lectures / 16 FMA
  // vec4) — pour trouver où les REGISTRES saturent (8×8 = 64 accumulateurs scalaires par thread).
  const innerWide = (rows, cols) => `
    var<workgroup> Asv: array<vec4<f32>, ${16 * (rows * 16) / 4}>;
    var<workgroup> Wsv: array<vec4<f32>, ${16 * (cols * 16) / 4}>;
    ${HEADER}
    fn seedAt(i: u32, gx: u32) -> f32 { return f32((i * 1664525u + gx * 1013904223u) & 65535u) * 3e-7 - 0.01; }
    @compute @workgroup_size(256)
    fn main(@builtin(global_invocation_id) gid: vec3<u32>, @builtin(local_invocation_index) tid: u32) {
      for (var j = tid; j < ${16 * (rows * 16) / 4}u; j = j + 256u) {
        Asv[j] = vec4<f32>(seedAt(j * 4u, gid.x), seedAt(j * 4u + 1u, gid.x), seedAt(j * 4u + 2u, gid.x), seedAt(j * 4u + 3u, gid.x));
      }
      for (var j = tid; j < ${16 * (cols * 16) / 4}u; j = j + 256u) {
        Wsv[j] = vec4<f32>(seedAt(j * 4u + 7u, gid.x), seedAt(j * 4u + 8u, gid.x), seedAt(j * 4u + 9u, gid.x), seedAt(j * 4u + 10u, gid.x));
      }
      workgroupBarrier();
      let tr = tid >> 4u; let tc = tid & 15u;
      ${Array.from({ length: (rows / 4) * cols }, (_, i) => `var r${i} = vec4<f32>(0.0);`).join(' ')}
      for (var i = 0u; i < p.x; i = i + 1u) {
        let kk = i & 15u;
        ${Array.from({ length: rows / 4 }, (_, a) => `let av${a} = Asv[kk * ${(rows * 16) / 4}u + tr * ${rows / 4}u + ${a}u];`).join(' ')}
        ${Array.from({ length: cols / 4 }, (_, w) => `let wv${w} = Wsv[kk * ${(cols * 16) / 4}u + tc * ${cols / 4}u + ${w}u];`).join(' ')}
        ${Array.from({ length: rows / 4 }, (_, a) =>
          Array.from({ length: cols / 4 }, (_, w) =>
            ['x', 'y', 'z', 'w'].map((c, ci) =>
              `r${(a * 4 + ci) * (cols / 4) + w} = fma(vec4<f32>(av${a}.${c}), wv${w}, r${(a * 4 + ci) * (cols / 4) + w});`
            ).join(' ')
          ).join(' ')
        ).join('\n        ')}
      }
      var s = vec4<f32>(0.0);
      ${Array.from({ length: (rows / 4) * cols }, (_, i) => `s = s + r${i};`).join(' ')}
      sink[gid.x & 8191u] = s.x + s.y + s.z + s.w;
    }`;

  // FLOP par thread et par itération de boucle : 1 FMA = 2 FLOP, 1 FMA vec4 = 8 FLOP.
  const KERNELS = [
    { name: 'fma_pure (plafond)', code: FMA_PURE, flopPerIter: 64, iters: 2048 },
    { name: 'inner_2x4 (actuel : 6 lect / 8 FMA)', code: INNER_2X4, flopPerIter: 16, iters: 8192 },
    { name: 'inner_4x4 (8 lect / 16 FMA)', code: INNER_4X4, flopPerIter: 32, iters: 4096 },
    { name: 'inner_4x4_vec4 (2 lect vec4 / 4 FMA vec4)', code: INNER_4X4_VEC4, flopPerIter: 32, iters: 4096 },
    { name: 'inner_4x8_vec4 (3 lect vec4 / 8 FMA vec4)', code: innerWide(4, 8), flopPerIter: 64, iters: 2048 },
    { name: 'inner_8x8_vec4 (4 lect vec4 / 16 FMA vec4)', code: innerWide(8, 8), flopPerIter: 128, iters: 1024 },
  ];

  const WG = 1024, THREADS = WG * 256, REPS = 8;
  const sink = device.createBuffer({ size: 8192 * 4, usage: GPUBufferUsage.STORAGE });
  const out = [];
  for (const kdef of KERNELS) {
    const mod = device.createShaderModule({ code: kdef.code });
    const pipeline = device.createComputePipeline({ layout: 'auto', compute: { module: mod, entryPoint: 'main' } });
    const uni = device.createBuffer({ size: 16, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
    device.queue.writeBuffer(uni, 0, new Uint32Array([kdef.iters, 0, 0, 0]));
    const bind = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: uni } }, { binding: 1, resource: { buffer: sink } }],
    });
    const once = () => {
      const enc = device.createCommandEncoder();
      const pass = enc.beginComputePass();
      pass.setPipeline(pipeline); pass.setBindGroup(0, bind); pass.dispatchWorkgroups(WG); pass.end();
      device.queue.submit([enc.finish()]);
    };
    once(); await device.queue.onSubmittedWorkDone(); // préchauffe : compilation
    // Médiane sur 5 séries — la leçon de bandwidth.mjs : un tir ne vaut rien sur cette machine.
    const shots = [];
    for (let s = 0; s < 5; s++) {
      const t0 = performance.now();
      for (let i = 0; i < REPS; i++) once();
      await device.queue.onSubmittedWorkDone();
      const ms = performance.now() - t0;
      shots.push((THREADS * kdef.iters * kdef.flopPerIter * REPS) / (ms / 1000) / 1e9);
    }
    shots.sort((a, b) => a - b);
    out.push({ name: kdef.name, gflops: shots[2], min: shots[0], max: shots[4] });
    uni.destroy();
  }
  return { info: { vendor: info.vendor, architecture: info.architecture, device: info.device }, out };
});

if (res.error) { console.error('✗', res.error); process.exit(1); }
console.log(`GPU : ${JSON.stringify(res.info)}\n`);
console.log('| kernel | médiane | min-max (5 tirs) |');
console.log('|---|---|---|');
for (const r of res.out) {
  console.log(`| ${r.name} | ${r.gflops.toFixed(0).padStart(5)} GFLOP/s | ${r.min.toFixed(0)}-${r.max.toFixed(0)} |`);
}
const peak = res.out[0].gflops;
console.log(`\nPlafond FMA observé : ${peak.toFixed(0)} GFLOP/s`);
console.log(`Le GEMM de prefill tient ~971-1003 GFLOP/s sur les formes 7B (ROADMAP §1) → ${(1000 / peak * 100).toFixed(0)} % du plafond.`);
console.log('Lecture : si inner_4x4* dépasse nettement inner_2x4, le prochain kernel est un blocage 4×4 —');
console.log('sinon la boucle interne actuelle n\'est pas le goulot et il faut chercher ailleurs (déquant, tuile).');
await browser.close();
server.close();
