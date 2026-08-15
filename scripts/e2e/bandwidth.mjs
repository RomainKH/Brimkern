// PLAFOND DE BANDE PASSANTE de la machine — la mesure de référence qui manquait.
//
// Le décodage est memory-bound : il relit TOUS les poids à chaque token. On sait donc qu'il vaut
// « X Go/s effectifs » (77,3 Go/s relevés sur les formes d'un 7B). Mais 77 Go/s, c'est beaucoup ou
// c'est peu ? Sans le plafond de la machine, ce chiffre ne dit rien — et on ne peut pas décider s'il
// reste du travail sur le GEMV ou s'il faut chercher ailleurs. Ce banc mesure ce plafond.
//
// Méthode : un kernel qui ne fait QUE lire (somme de vec4, écriture d'un seul flottant par
// workgroup pour que le compilateur ne supprime pas la boucle). Aucune écriture massive, aucune
// arithmétique lourde : ce qu'on chronomètre est le débit de LECTURE, exactement ce qui borne le
// décodage. Plusieurs tailles pour distinguer ce qui tient en cache de ce qui vient de la mémoire.
//
//   npm run build && npx next start -p 3618
//   node scripts/e2e/bandwidth.mjs
import { chromium } from 'playwright-core';
import { CHROME as EXE } from './chrome.mjs';

const browser = await chromium.launch({
  executablePath: EXE, headless: true,
  args: ['--enable-unsafe-webgpu', '--use-angle=metal'],
});
const page = await browser.newPage();
await page.goto('http://localhost:3618/chat', { waitUntil: 'domcontentloaded' });

const res = await page.evaluate(async () => {
  const gpu = navigator.gpu;
  if (!gpu) return { error: 'WebGPU absent' };
  const adapter = await gpu.requestAdapter({ powerPreference: 'high-performance' });
  if (!adapter) return { error: 'aucun adapter' };
  const device = await adapter.requestDevice({
    requiredLimits: {
      maxStorageBufferBindingSize: adapter.limits.maxStorageBufferBindingSize,
      maxBufferSize: adapter.limits.maxBufferSize,
    },
  });
  const info = adapter.info ?? {};

  // Lecture pure : 256 threads par workgroup, chacun parcourt le buffer par pas de la grille.
  const shader = device.createShaderModule({
    code: `
      @group(0) @binding(0) var<storage, read> src: array<vec4<f32>>;
      @group(0) @binding(1) var<storage, read_write> sink: array<f32>;
      var<workgroup> part: array<f32, 256>;
      @compute @workgroup_size(256)
      fn main(@builtin(global_invocation_id) gid: vec3<u32>,
              @builtin(local_invocation_id) lid: vec3<u32>,
              @builtin(num_workgroups) nwg: vec3<u32>) {
        let stride = nwg.x * 256u;
        let n = arrayLength(&src);
        var acc = vec4<f32>(0.0);
        for (var i = gid.x; i < n; i = i + stride) { acc = acc + src[i]; }
        part[lid.x] = acc.x + acc.y + acc.z + acc.w;
        workgroupBarrier();
        // Réduction minimale : le résultat doit être OBSERVABLE, sinon le compilateur a le droit de
        // supprimer toute la boucle et l'on mesurerait un kernel vide.
        if (lid.x == 0u) {
          var s = 0.0;
          for (var j = 0u; j < 256u; j = j + 1u) { s = s + part[j]; }
          sink[gid.x / 256u] = s;
        }
      }`,
  });
  const pipeline = device.createComputePipeline({ layout: 'auto', compute: { module: shader, entryPoint: 'main' } });

  const run = async (bytes, wg, iters) => {
    const src = device.createBuffer({ size: bytes, usage: GPUBufferUsage.STORAGE });
    const sink = device.createBuffer({ size: wg * 4, usage: GPUBufferUsage.STORAGE });
    const bind = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: src } }, { binding: 1, resource: { buffer: sink } }],
    });
    const once = () => {
      const enc = device.createCommandEncoder();
      const pass = enc.beginComputePass();
      pass.setPipeline(pipeline); pass.setBindGroup(0, bind); pass.dispatchWorkgroups(wg); pass.end();
      device.queue.submit([enc.finish()]);
    };
    once(); await device.queue.onSubmittedWorkDone();          // préchauffe : compilation + résidence
    const t0 = performance.now();
    for (let i = 0; i < iters; i++) once();
    await device.queue.onSubmittedWorkDone();
    const ms = performance.now() - t0;
    src.destroy(); sink.destroy();
    return { bytes, wg, ms, gbps: (bytes * iters) / (ms / 1000) / 1e9 };
  };

  const out = [];
  for (const mb of [16, 64, 256, 512]) {
    const bytes = mb * 1024 * 1024;
    if (bytes > device.limits.maxStorageBufferBindingSize) continue;
    // Assez de workgroups pour saturer, sans excès : ~2048 suffit à occuper tous les cœurs.
    out.push({ mb, ...(await run(bytes, 2048, mb >= 256 ? 20 : 60)) });
  }
  return { info: { vendor: info.vendor, architecture: info.architecture, device: info.device }, out };
});

if (res.error) { console.error('✗', res.error); process.exit(1); }
console.log(`GPU : ${JSON.stringify(res.info)}\n`);
console.log('| taille lue | débit de LECTURE |');
console.log('|---|---|');
for (const r of res.out) console.log(`| ${String(r.mb).padStart(4)} Mo | ${r.gbps.toFixed(1).padStart(6)} Go/s |`);
const peak = Math.max(...res.out.map((r) => r.gbps));
console.log(`\nPlafond observé : ${peak.toFixed(1)} Go/s`);
console.log(`Le GEMV de décodage tient 77,3 Go/s sur les formes d'un 7B (README) → ${(77.3 / peak * 100).toFixed(0)} % du plafond.`);
await browser.close();
