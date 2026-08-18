// PLAFOND DES OPS POINT À POINT (silu & compagnie) — pourquoi une activation coûte 5,4 ms.
//
// Le profil d'une génération d'image (profile-image.mjs, 2026-08-18) place `silu` à 19 % du GPU,
// 5 393 µs le tir, sur des tenseurs de 320×32×32 = 327 680 éléments. Lire 1,3 Mo et en réécrire
// 1,3 Mo à 5,4 ms fait ~480 Mo/s, soit deux ordres de grandeur sous la bande passante de la machine
// (106,9 Go/s mesurés par bandwidth.mjs). Le chiffre est donc soit faux, soit le kernel a un
// problème de structure — et on ne réécrit rien avant de savoir lequel.
//
// Quatre kernels sur la MÊME taille, du plancher au candidat :
//   1. copy         — lecture + écriture, rien d'autre : le plancher de bande passante de la forme.
//   2. silu         — le kernel ACTUEL, tel qu'il est dans shaders.ts (scalaire, workgroup 64).
//   3. silu_wg256   — le même, en workgroups de 256 : isole l'effet de la LARGEUR du groupe.
//   4. silu_vec4    — 4 éléments par thread en vec4 : isole l'effet de la VECTORISATION.
// Si `silu` colle à `copy`, il est déjà au plafond de sa forme et les 5,4 ms viennent d'ailleurs
// (pacing, barrières entre passes, attribution du profileur) : le chantier n'est PAS le kernel.
//
//   node scripts/e2e/unary.mjs
//
// Autonome comme flops.mjs : sert sa propre page vide, ne touche aucun code de l'app.
import { createServer } from 'node:http';
import { chromium } from 'playwright-core';
import { CHROME as EXE } from './chrome.mjs';

const server = createServer((_, res) => {
  res.writeHead(200, { 'content-type': 'text/html' });
  res.end('<!doctype html><title>unary</title>');
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

  const IO = `
    @group(0) @binding(0) var<storage, read> x: array<f32>;
    @group(0) @binding(1) var<storage, read_write> o: array<f32>;`;
  const IO4 = `
    @group(0) @binding(0) var<storage, read> x: array<vec4<f32>>;
    @group(0) @binding(1) var<storage, read_write> o: array<vec4<f32>>;`;

  const COPY = `${IO}
    @compute @workgroup_size(64)
    fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
      let i = (wid.y * nwg.x + wid.x) * 64u + lid.x;
      if (i >= arrayLength(&o)) { return; }
      o[i] = x[i];
    }`;

  // Le kernel ACTUEL, copié mot pour mot de src/lib/webgpu/shaders.ts.
  const SILU = `${IO}
    @compute @workgroup_size(64)
    fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
      let i = (wid.y * nwg.x + wid.x) * 64u + lid.x;
      if (i >= arrayLength(&o)) { return; }
      let v = x[i];
      o[i] = v / (1.0 + exp(-v));
    }`;

  const SILU_WG256 = `${IO}
    @compute @workgroup_size(256)
    fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
      let i = (wid.y * nwg.x + wid.x) * 256u + lid.x;
      if (i >= arrayLength(&o)) { return; }
      let v = x[i];
      o[i] = v / (1.0 + exp(-v));
    }`;

  // 4 éléments par thread : une lecture et une écriture de 16 octets au lieu de 4, et exp() vectorisé.
  const SILU_VEC4 = `${IO4}
    @compute @workgroup_size(64)
    fn main(@builtin(workgroup_id) wid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>, @builtin(local_invocation_id) lid: vec3<u32>) {
      let i = (wid.y * nwg.x + wid.x) * 64u + lid.x;
      if (i >= arrayLength(&o)) { return; }
      let v = x[i];
      o[i] = v / (vec4<f32>(1.0) + exp(-v));
    }`;

  // Les tailles RÉELLES de l'UNet à 256px : C × H × W des trois premiers niveaux.
  const SHAPES = [
    { n: 320 * 32 * 32, label: '320×32×32 (niveau 0)' },
    { n: 640 * 16 * 16, label: '640×16×16 (niveau 1)' },
    { n: 1280 * 8 * 8, label: '1280×8×8 (niveau 2)' },
  ];
  const KERNELS = [
    { name: 'copy (plancher)', code: COPY, wg: 64, per: 1 },
    { name: 'silu (actuel)', code: SILU, wg: 64, per: 1 },
    { name: 'silu_wg256', code: SILU_WG256, wg: 256, per: 1 },
    { name: 'silu_vec4', code: SILU_VEC4, wg: 64, per: 4 },
  ];

  const REPS = 32;
  const out = [];
  for (const shape of SHAPES) {
    const bytes = shape.n * 4;
    const xb = device.createBuffer({ size: bytes, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST });
    const ob = device.createBuffer({ size: bytes, usage: GPUBufferUsage.STORAGE });
    device.queue.writeBuffer(xb, 0, new Float32Array(shape.n).fill(0.37));
    for (const k of KERNELS) {
      const mod = device.createShaderModule({ code: k.code });
      const pipeline = device.createComputePipeline({ layout: 'auto', compute: { module: mod, entryPoint: 'main' } });
      const bind = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [{ binding: 0, resource: { buffer: xb } }, { binding: 1, resource: { buffer: ob } }],
      });
      // Grille : même calcul que grid1D côté app (repli 2D au-delà de 65535 groupes).
      const units = Math.ceil(shape.n / k.per);
      const wgs = Math.ceil(units / k.wg);
      const gx = Math.min(wgs, 65535), gy = Math.ceil(wgs / 65535);
      const once = () => {
        const enc = device.createCommandEncoder();
        const pass = enc.beginComputePass();
        pass.setPipeline(pipeline); pass.setBindGroup(0, bind); pass.dispatchWorkgroups(gx, gy, 1); pass.end();
        device.queue.submit([enc.finish()]);
      };
      once(); await device.queue.onSubmittedWorkDone();
      const shots = [];
      for (let s = 0; s < 5; s++) {
        const t0 = performance.now();
        for (let i = 0; i < REPS; i++) once();
        await device.queue.onSubmittedWorkDone();
        const ms = performance.now() - t0;
        shots.push({ us: (ms * 1000) / REPS, gbs: (2 * bytes * REPS) / (ms / 1000) / 1e9 });
      }
      shots.sort((a, b) => a.us - b.us);
      out.push({ shape: shape.label, name: k.name, us: shots[2].us, gbs: shots[2].gbs });
    }
    xb.destroy(); ob.destroy();
  }
  return { info: { vendor: info.vendor, architecture: info.architecture, device: info.device }, out };
});

if (res.error) { console.error('✗', res.error); process.exit(1); }
console.log(`GPU : ${JSON.stringify(res.info)}\n`);
console.log('| forme'.padEnd(26) + '| kernel'.padEnd(20) + '| µs/tir  | Go/s  |');
console.log('|' + '-'.repeat(25) + '|' + '-'.repeat(19) + '|---------|-------|');
for (const r of res.out) {
  console.log(('| ' + r.shape).padEnd(26) + ('| ' + r.name).padEnd(20) + '| ' + r.us.toFixed(1).padStart(7) + ' | ' + r.gbs.toFixed(1).padStart(5) + ' |');
}
console.log('\nLecture : le profil de la vraie génération donne silu à 5 393 µs le tir.');
console.log('Si silu tient ici quelques dizaines de µs, le kernel n\'est PAS le problème et le temps');
console.log('vient d\'ailleurs (pacing, barrières, attribution) — c\'est là qu\'il faudra chercher.');
await browser.close();
server.close();
