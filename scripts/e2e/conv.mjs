// PLAFOND DE LA CONVOLUTION — quelle structure pour le prochain kernel conv2d.
//
// POURQUOI. Le décodage VAE mesuré le 2026-08-19 tourne à 135 GFLOP/s quand nos GEMM tiennent 1 542
// sur la même machine (plafond FMA : 2 825). La voie convolution est donc ~11× moins efficace que la
// voie matmul, et elle porte 68 % du temps d'une génération d'image comme de vidéo.
//
// LE SOUPÇON, à confirmer ici avant d'écrire quoi que ce soit : dans `conv2d_3x3_tiled_q8`, un
// workgroup calcule une tuile 16×16 pour UN SEUL canal de sortie (la grille met Cout en z). Le patch
// d'entrée est donc rechargé depuis la mémoire globale pour CHAQUE canal de sortie — trafic global
// multiplié par Cout — et chaque thread ne fait que 9 FMA pour 18 lectures de mémoire partagée.
// C'est le même défaut que les GEMM avant le § 12 : pas assez de travail par octet lu.
//
// LES VARIANTES MESURÉES, sur les formes RÉELLES du VAE et du UNet :
//   1. cout1  — la structure ACTUELLE : 1 canal de sortie par workgroup.
//   2. cout4  — 4 canaux de sortie par workgroup : le patch est chargé UNE fois pour 4, chaque
//               thread tient 4 accumulateurs et fait 36 FMA par chargement de patch.
//   3. cout8  — 8 canaux : 72 FMA par patch, 8 accumulateurs (le point où les GEMM plafonnaient).
// Les poids sont en f32 ici : la déquantification int8 est un coût CONSTANT commun aux trois, et ce
// qu'on veut isoler c'est le RAPPORT travail/trafic de la structure. Le gain réel se re-mesurera
// bout en bout, comme toujours.
//
//   node scripts/e2e/conv.mjs
//
// Autonome (comme flops.mjs) : sert sa propre page vide, ne touche aucun code de l'app.
import { createServer } from 'node:http';
import { chromium } from 'playwright-core';
import { CHROME as EXE } from './chrome.mjs';

const server = createServer((_, res) => {
  res.writeHead(200, { 'content-type': 'text/html' });
  res.end('<!doctype html><title>conv</title>');
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
  const device = await adapter.requestDevice({
    requiredLimits: { maxStorageBufferBindingSize: adapter.limits.maxStorageBufferBindingSize, maxBufferSize: adapter.limits.maxBufferSize },
  });
  const info = adapter.info ?? {};

  const ENTETE = `
    struct P { Cin: u32, H: u32, W: u32, Cout: u32, kh: u32, kw: u32, stride: u32, pad: u32, OH: u32, OW: u32 };
    @group(0) @binding(0) var<uniform> p: P;
    @group(0) @binding(1) var<storage, read> inp: array<f32>;
    @group(0) @binding(2) var<storage, read> wt: array<f32>;
    @group(0) @binding(3) var<storage, read> bias: array<f32>;
    @group(0) @binding(4) var<storage, read_write> o: array<f32>;`;

  // La structure ACTUELLE, copiée de conv2d_3x3_tiled (un canal de sortie par workgroup).
  const COUT1 = `${ENTETE}
    var<workgroup> tile: array<f32, 324>;
    var<workgroup> wloc: array<f32, 9>;
    @compute @workgroup_size(16, 16)
    fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
      let co = wid.z;
      let oy0 = wid.y * 16u; let ox0 = wid.x * 16u;
      let oy = oy0 + lid.y; let ox = ox0 + lid.x;
      let dedans = oy < p.OH && ox < p.OW;
      let tid = lid.y * 16u + lid.x;
      var acc = 0.0;
      for (var ci = 0u; ci < p.Cin; ci = ci + 1u) {
        let base = ci * p.H * p.W;
        for (var t = tid; t < 324u; t = t + 256u) {
          let iy = i32(oy0 + t / 18u) - 1; let ix = i32(ox0 + t % 18u) - 1;
          var v = 0.0;
          if (iy >= 0 && iy < i32(p.H) && ix >= 0 && ix < i32(p.W)) { v = inp[base + u32(iy) * p.W + u32(ix)]; }
          tile[t] = v;
        }
        if (tid < 9u) { wloc[tid] = wt[(co * p.Cin + ci) * 9u + tid]; }
        workgroupBarrier();
        if (dedans) {
          let r0 = lid.y * 18u + lid.x;
          acc = acc
            + tile[r0]       * wloc[0u] + tile[r0 + 1u]  * wloc[1u] + tile[r0 + 2u]  * wloc[2u]
            + tile[r0 + 18u] * wloc[3u] + tile[r0 + 19u] * wloc[4u] + tile[r0 + 20u] * wloc[5u]
            + tile[r0 + 36u] * wloc[6u] + tile[r0 + 37u] * wloc[7u] + tile[r0 + 38u] * wloc[8u];
        }
        workgroupBarrier();
      }
      if (dedans) { o[(co * p.OH + oy) * p.OW + ox] = acc + bias[co]; }
    }`;

  // N canaux de sortie par workgroup : le patch d'entrée est chargé UNE fois pour les N, et chaque
  // thread tient N accumulateurs. Le trafic global d'entrée est divisé par N, et le rapport
  // FMA/lecture partagée passe de 9/18 à 9N/(18+9N).
  const coutN = (N) => `${ENTETE}
    var<workgroup> tile: array<f32, 324>;
    var<workgroup> wloc: array<f32, ${9 * N}>;
    @compute @workgroup_size(16, 16)
    fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
      let co0 = wid.z * ${N}u;
      let oy0 = wid.y * 16u; let ox0 = wid.x * 16u;
      let oy = oy0 + lid.y; let ox = ox0 + lid.x;
      let dedans = oy < p.OH && ox < p.OW;
      let tid = lid.y * 16u + lid.x;
      var acc: array<f32, ${N}>;
      for (var j = 0u; j < ${N}u; j = j + 1u) { acc[j] = 0.0; }
      for (var ci = 0u; ci < p.Cin; ci = ci + 1u) {
        let base = ci * p.H * p.W;
        for (var t = tid; t < 324u; t = t + 256u) {
          let iy = i32(oy0 + t / 18u) - 1; let ix = i32(ox0 + t % 18u) - 1;
          var v = 0.0;
          if (iy >= 0 && iy < i32(p.H) && ix >= 0 && ix < i32(p.W)) { v = inp[base + u32(iy) * p.W + u32(ix)]; }
          tile[t] = v;
        }
        // Les ${9 * N} poids du bloc de canaux, chargés coopérativement.
        for (var t = tid; t < ${9 * N}u; t = t + 256u) {
          let j = t / 9u; let k = t % 9u;
          let co = co0 + j;
          wloc[t] = select(0.0, wt[(co * p.Cin + ci) * 9u + k], co < p.Cout);
        }
        workgroupBarrier();
        if (dedans) {
          let r0 = lid.y * 18u + lid.x;
          // Les 9 valeurs du patch sont lues UNE fois et réutilisées pour les ${N} canaux : c'est là
          // que le rapport travail/trafic se joue.
          let v0 = tile[r0];       let v1 = tile[r0 + 1u];  let v2 = tile[r0 + 2u];
          let v3 = tile[r0 + 18u]; let v4 = tile[r0 + 19u]; let v5 = tile[r0 + 20u];
          let v6 = tile[r0 + 36u]; let v7 = tile[r0 + 37u]; let v8 = tile[r0 + 38u];
          for (var j = 0u; j < ${N}u; j = j + 1u) {
            let b = j * 9u;
            acc[j] = acc[j]
              + v0 * wloc[b] + v1 * wloc[b + 1u] + v2 * wloc[b + 2u]
              + v3 * wloc[b + 3u] + v4 * wloc[b + 4u] + v5 * wloc[b + 5u]
              + v6 * wloc[b + 6u] + v7 * wloc[b + 7u] + v8 * wloc[b + 8u];
          }
        }
        workgroupBarrier();
      }
      if (dedans) {
        for (var j = 0u; j < ${N}u; j = j + 1u) {
          let co = co0 + j;
          if (co < p.Cout) { o[(co * p.OH + oy) * p.OW + ox] = acc[j] + bias[co]; }
        }
      }
    }`;

  // Les formes RÉELLES : bloc central et niveaux montants du VAE, plus une forme de UNet.
  const FORMES = [
    { Cin: 512, Cout: 512, H: 64,  W: 64,  label: '512→512 @ 64²   (VAE mid)' },
    { Cin: 512, Cout: 512, H: 128, W: 128, label: '512→512 @ 128²  (VAE up1)' },
    { Cin: 256, Cout: 256, H: 256, W: 256, label: '256→256 @ 256²  (VAE up2)' },
    { Cin: 128, Cout: 128, H: 512, W: 512, label: '128→128 @ 512²  (VAE up3)' },
    { Cin: 320, Cout: 320, H: 64,  W: 64,  label: '320→320 @ 64²   (UNet niv.0)' },
  ];
  const VARIANTES = [
    { nom: 'cout1 (actuel)', code: COUT1, n: 1 },
    { nom: 'cout4', code: coutN(4), n: 4 },
    { nom: 'cout8', code: coutN(8), n: 8 },
  ];

  const out = [];
  for (const f of FORMES) {
    const nIn = f.Cin * f.H * f.W, nOut = f.Cout * f.H * f.W, nW = f.Cout * f.Cin * 9;
    // Garde-fou : au-delà de la limite de binding, la forme est ignorée plutôt que de faire planter
    // tout le banc (le 128→128 @ 512² fait déjà 134 Mo par tenseur).
    const maxB = device.limits.maxStorageBufferBindingSize;
    if (Math.max(nIn, nOut, nW) * 4 > maxB) { out.push({ shape: f.label, nom: '—', gflops: 0, note: 'trop gros' }); continue; }
    const inp = device.createBuffer({ size: nIn * 4, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST });
    const wt = device.createBuffer({ size: nW * 4, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST });
    const bias = device.createBuffer({ size: f.Cout * 4, usage: GPUBufferUsage.STORAGE });
    const o = device.createBuffer({ size: nOut * 4, usage: GPUBufferUsage.STORAGE });
    const uni = device.createBuffer({ size: 48, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
    device.queue.writeBuffer(uni, 0, new Uint32Array([f.Cin, f.H, f.W, f.Cout, 3, 3, 1, 1, f.H, f.W]));
    device.queue.writeBuffer(inp, 0, new Float32Array(Math.min(nIn, 1 << 20)).fill(0.21));
    device.queue.writeBuffer(wt, 0, new Float32Array(Math.min(nW, 1 << 20)).fill(0.03));

    const flop = 2 * f.Cin * f.Cout * 9 * f.H * f.W;
    for (const v of VARIANTES) {
      const mod = device.createShaderModule({ code: v.code });
      const pipeline = device.createComputePipeline({ layout: 'auto', compute: { module: mod, entryPoint: 'main' } });
      const bind = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { buffer: uni } }, { binding: 1, resource: { buffer: inp } },
          { binding: 2, resource: { buffer: wt } }, { binding: 3, resource: { buffer: bias } },
          { binding: 4, resource: { buffer: o } },
        ],
      });
      const gz = Math.ceil(f.Cout / v.n);
      const once = () => {
        const enc = device.createCommandEncoder();
        const pass = enc.beginComputePass();
        pass.setPipeline(pipeline); pass.setBindGroup(0, bind);
        pass.dispatchWorkgroups(Math.ceil(f.W / 16), Math.ceil(f.H / 16), gz);
        pass.end();
        device.queue.submit([enc.finish()]);
      };
      once(); await device.queue.onSubmittedWorkDone();
      const tirs = [];
      for (let s = 0; s < 3; s++) {
        const t0 = performance.now();
        for (let i = 0; i < 3; i++) once();
        await device.queue.onSubmittedWorkDone();
        tirs.push((flop * 3) / ((performance.now() - t0) / 1000) / 1e9);
      }
      tirs.sort((a, b) => a - b);
      out.push({ shape: f.label, nom: v.nom, gflops: tirs[1] });
    }
    for (const b of [inp, wt, bias, o, uni]) b.destroy();
  }
  return { info: { vendor: info.vendor, architecture: info.architecture }, out };
});

if (res.error) { console.error('✗', res.error); process.exit(1); }
console.log(`GPU : ${JSON.stringify(res.info)}\n`);
console.log('| forme'.padEnd(32) + '| variante'.padEnd(18) + '| GFLOP/s | gain |');
console.log('|' + '-'.repeat(31) + '|' + '-'.repeat(17) + '|---------|------|');
let base = 0;
for (const r of res.out) {
  if (r.note) { console.log(('| ' + r.shape).padEnd(32) + '| ' + r.note); continue; }
  if (r.nom.startsWith('cout1')) base = r.gflops;
  const gain = base ? (r.gflops / base).toFixed(2) + '×' : '';
  console.log(('| ' + r.shape).padEnd(32) + ('| ' + r.nom).padEnd(18) + '| ' + r.gflops.toFixed(0).padStart(7) + ' | ' + gain.padStart(5) + ' |');
}
console.log('\nRepère : GEMM v2 = 1 542 GFLOP/s, plafond FMA de la machine = 2 825.');
console.log('Le décodage VAE réel tourne à 135 GFLOP/s — c\'est l\'écart que ce banc doit expliquer.');
await browser.close();
server.close();
