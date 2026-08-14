"use client";

// Banc de test VIDÉO (étape 3b, dev) : charge le module motion 0 depuis le BRIK q8, le fait tourner
// via MotionModule (matmuls q8 GPU + glu validée) et compare au dump de l'oracle diffusers
// (public/models/video-oracle/, gitignoré — généré par scripts/video-oracle.py). C'est le
// selfValidate du chemin vidéo : cible ≈ cosine ≥ 0,999 / relMAE ≤ ~4 % (bruit q8 vs oracle f16).
// Hook Playwright : window.__videoTest → { cosine, relMAE, ms }.

import { useEffect, useRef, useState } from 'react';
import { WebGpuEngine } from '@/lib/webgpu/kernels';
import { parseBrik } from '@/lib/brik/container';
import { computeShardBases } from '@/lib/brik/loader';
import { decodeTensor } from '@/lib/brik/codec';
import { MotionModule } from '@/lib/webgpu/video/motionModule';
import type { VideoGenerator } from '@/lib/webgpu/video/videoGen';

export default function VideoTestPage() {
  const [status, setStatus] = useState('init');
  const [frames, setFrames] = useState<ImageData[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [prompt, setPrompt] = useState('a red fox running through a snowy forest, cinematic');
  const [nFrames, setNFrames] = useState(16); // 32 max : le pos_embed temporel du module motion est [1,32,C]
  const [enrichOn, setEnrichOn] = useState(true); // LFM enrichit le prompt (moins statique)
  const [enriched, setEnriched] = useState<string | null>(null);
  const genRef = useRef<VideoGenerator | null>(null);
  // `location` n'existe qu'au client → on le lit APRÈS montage (sinon le 1er rendu client diffère du
  // HTML serveur = erreur d'hydratation). `mounted` garantit un 1er rendu identique des deux côtés.
  const [mounted, setMounted] = useState(false);
  // Microtask : cf. BackLink — un setState synchrone dans un effet cascade les rendus. Le premier
  // rendu client reste identique au HTML serveur, ce qui est le but de ce drapeau.
  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => { if (active) setMounted(true); });
    return () => { active = false; };
  }, []);
  const isGenMode = mounted && new URLSearchParams(location.search).get('gen') === '1';

  // Générateur chargé UNE fois (1,5 Go streamés) puis réutilisé pour chaque clip.
  const ensureGen = async (): Promise<VideoGenerator> => {
    if (genRef.current) return genRef.current;
    const { loadVideoGenerator } = await import('@/lib/webgpu/video/videoGen');
    const { VIDEO_BRIK } = await import('@/lib/modelCatalog');
    // ?local=1 → BRIK locaux (dev sans réseau) ; défaut = HF (les URLs du futur onglet produit).
    const local = new URLSearchParams(location.search).get('local') === '1';
    const { MOBILE_BRIK_URL } = await import('@/lib/modelCatalog');
    const gen = await loadVideoGenerator({
      unet: local ? '/models/video-unet-q8.brik' : VIDEO_BRIK.unet,
      clip: local ? '/models/video-clip-q8.brik' : VIDEO_BRIK.clip,
      motion: local ? '/models/video-motion-q8.brik' : VIDEO_BRIK.motion,
      taesd: VIDEO_BRIK.taesd,
      lfm: local ? '/models/lfm25-230m-q4.brik' : MOBILE_BRIK_URL, // enrichissement de prompt
    }, (s) => setStatus(s));
    genRef.current = gen;
    return gen;
  };

  const runGen = async (p: string, nf: number) => {
    if (busy) return;
    setBusy(true); setVideoUrl(null); setFrames([]); setEnriched(null);
    try {
      const gen = await ensureGen();
      let finalPrompt = p;
      if (enrichOn) {
        setStatus('Enrichissement du prompt (LFM)…');
        finalPrompt = await gen.enrich(p, (s) => setStatus(s));
        setEnriched(finalPrompt);
      }
      const res = await gen.generate(finalPrompt, { seed: 42, frames: nf, size: 256, onProgress: (s) => setStatus(s) });
      setFrames(res.frames);
      setStatus('Compilation de la vidéo (WebM)…');
      const { framesToWebm } = await import('@/lib/webgpu/video/videoGen');
      const url = await framesToWebm(res.frames); // 12 fps, boucle ×2 (pacing borné — cf. framesToWebm)
      if (url) setVideoUrl(url);
      (window as unknown as { __videoGen?: { n: number; ms: number; webm: boolean } }).__videoGen = { n: res.frames.length, ms: res.ms, webm: !!url };
      setStatus(`OK — ${res.frames.length} frames en ${(res.ms / 1000).toFixed(1)} s${url ? '' : ' (WebM non supporté — frames seules)'}`);
    } catch (e) {
      setStatus('ERREUR: ' + ((e as Error)?.message || String(e)));
    } finally { setBusy(false); }
  };

  useEffect(() => {
    if (!mounted) return; // attend la lecture de location (post-montage) avant de brancher gen/non-gen
    let disposed = false;
    (async () => {
      try {
        // Mode GÉNÉRATION (?gen=1) : formulaire prompt + nombre de frames ; ?auto=1 lance direct
        // (harnais Playwright). Sinon : selfValidate du module motion seul (dump oracle).
        if (isGenMode) {
          setStatus('Prêt — choisis un prompt et un nombre de frames, puis Générer. (~15 s de calcul par frame, 1,5 Go au premier chargement)');
          if (new URLSearchParams(location.search).get('auto') === '1') void runGen(prompt, nFrames);
          return;
        }
        setStatus('moteur WebGPU…');
        const engine = new WebGpuEngine();
        if (!(await engine.init())) { setStatus('WebGPU indisponible'); return; }
        await engine.selfValidate();
        setStatus('téléchargement du BRIK motion…');
        const buf = new Uint8Array(await (await fetch('/models/video-motion-q8.brik')).arrayBuffer());
        const parsed = parseBrik(buf);
        const bases = computeShardBases(parsed.manifest.shards);
        const PREFIX = 'down_blocks.0.motion_modules.0.';
        const tensors: { name: string; dtype: string; f32?: Float32Array; q8?: { codes: Uint8Array; scales: Uint8Array }; shape: number[] }[] = [];
        for (const [name, t] of Object.entries(parsed.manifest.tensors)) {
          if (!name.startsWith(PREFIX)) continue;
          const bytes = parsed.data.subarray(bases[t.shard] + t.offset, bases[t.shard] + t.offset + t.byteLength);
          if (t.dtype === 'q8') { // blob = [codes nElems | scales u16/32] — découpé tel quel pour le GPU
            tensors.push({ name: name.slice(PREFIX.length), dtype: 'q8', shape: t.shape, q8: { codes: bytes.subarray(0, t.nElems), scales: bytes.subarray(t.nElems) } });
          } else {
            tensors.push({ name: name.slice(PREFIX.length), dtype: t.dtype, shape: t.shape, f32: decodeTensor(bytes, t.nElems, t.dtype) });
          }
        }
        setStatus(`module chargé (${tensors.length} tenseurs) — dump oracle…`);
        const [inB, outB] = await Promise.all([
          fetch('/models/video-oracle/io_in.bin').then((r) => r.arrayBuffer()),
          fetch('/models/video-oracle/io_out.bin').then((r) => r.arrayBuffer()),
        ]);
        const IN = new Float32Array(inB), REF = new Float32Array(outB);
        const mod = new MotionModule(engine);
        mod.load(320, tensors);
        setStatus('forward GPU (JS)…');
        const F = 16, C = 320, S = 32 * 32, CS = C * S;
        const t0 = performance.now();
        const OUT = await mod.forward(IN, F, 32, 32);
        const ms = performance.now() - t0;
        if (disposed) return;
        const metrics = (o: Float32Array) => {
          let dot = 0, na = 0, nb = 0, mae = 0, mref = 0;
          for (let i = 0; i < o.length; i++) { dot += o[i] * REF[i]; na += o[i] ** 2; nb += REF[i] ** 2; mae += Math.abs(o[i] - REF[i]); mref += Math.abs(REF[i]); }
          return { cosine: dot / Math.sqrt(na * nb), relMAE: mae / mref };
        };
        const m1 = metrics(OUT);
        // Chemin RÉSIDENT : mêmes entrées uploadées en F buffers GPU (C,S) → forwardResident → readback.
        setStatus('forward GPU (résident)…');
        const inBufs = Array.from({ length: F }, (_, f) => engine.uploadGpu(IN.subarray(f * CS, (f + 1) * CS) as Float32Array));
        const tR = performance.now();
        const outBufs = await (mod as unknown as { forwardResident(b: unknown[], F: number, H: number, W: number): Promise<unknown[]> }).forwardResident(inBufs, F, 32, 32);
        const OUTR = new Float32Array(F * CS);
        for (let f = 0; f < F; f++) OUTR.set(await engine.readGpu(outBufs[f], CS), f * CS);
        const msR = performance.now() - tR;
        engine.releaseGpu([...inBufs, ...outBufs]);
        const m2 = metrics(OUTR);
        const res = { cosine: m1.cosine, relMAE: m1.relMAE, ms: Math.round(ms), residentCosine: m2.cosine, residentRelMAE: m2.relMAE, residentMs: Math.round(msR), videoResidentOk: engine.videoResidentOk };
        (window as unknown as { __videoTest?: typeof res }).__videoTest = res;
        const ok = m1.cosine >= 0.999 && m1.relMAE <= 0.04 && m2.cosine >= 0.999 && m2.relMAE <= 0.04;
        setStatus(`${ok ? 'OK' : 'ÉCART'} — JS cosine=${m1.cosine.toFixed(6)} (${res.ms}ms) · résident cosine=${m2.cosine.toFixed(6)} relMAE=${(m2.relMAE * 100).toFixed(2)}% (${res.residentMs}ms, ok=${engine.videoResidentOk})`);
      } catch (e) {
        setStatus('ERREUR: ' + ((e as Error)?.message || String(e)));
      }
    })();
    return () => { disposed = true; };
  }, [mounted]);

  // Banc : colonne centrée (vignettes 128px) sur fond NOIR plein écran (esthétique labo, demande
  // Romain) ; les contrôles, la pulsation et le lecteur restent.
  return (
    // Encre chaude (identité de la marque, pas du noir pur) + filet rouge — texte clair, champs sombres.
    <div style={{ minHeight: '100vh', background: '#1a1815', color: '#ece9e1', fontFamily: 'var(--font-mono, monospace)' }}>
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', color: '#e8e6df', fontWeight: 800, margin: '0 0 4px' }}>Vidéo · banc moteur <span style={{ color: '#d9463a' }}>(labo)</span></h1>
      <div style={{ width: 44, height: 2, background: '#d9463a', margin: '0 0 20px', borderRadius: 2 }} />
      {isGenMode && (
        // Contrôles : prompt + nombre de frames (8 → aperçu 1 s, 32 = max du pos_embed du modèle).
        <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <input value={prompt} onChange={(e) => setPrompt(e.target.value)} disabled={busy}
            style={{ flex: '1 1 320px', fontSize: 13, padding: '7px 10px', borderRadius: 6, border: '1px solid #34302a', background: '#242019', color: '#ece9e1' }} />
          <select value={nFrames} onChange={(e) => setNFrames(Number(e.target.value))} disabled={busy}
            style={{ fontSize: 13, padding: '7px 8px', borderRadius: 6, border: '1px solid #34302a', background: '#242019', color: '#ece9e1' }}>
            <option value={8}>8 frames (~1 s · rapide)</option>
            <option value={16}>16 frames (~2 s)</option>
            <option value={24}>24 frames (~3 s)</option>
            <option value={32}>32 frames (~4 s · max)</option>
          </select>
          <label style={{ fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 5, cursor: 'pointer', color: '#cfcfcf' }} title="LFM réécrit ton prompt en une scène plus dynamique (moins statique) avant génération.">
            <input type="checkbox" checked={enrichOn} onChange={(e) => setEnrichOn(e.target.checked)} disabled={busy} /> ✨ enrichir (LFM)
          </label>
          <button className="btn btn-primary" onClick={() => void runGen(prompt, nFrames)} disabled={busy || !prompt.trim()} style={{ fontSize: 13, padding: '7px 14px' }}>
            {busy ? 'Génération…' : 'Générer'}
          </button>
        </div>
      )}
      {enriched && (
        <p style={{ color: '#7fd18b', fontSize: 12, margin: '0 0 10px', lineHeight: 1.4 }}>✨ Prompt enrichi : <em>{enriched}</em></p>
      )}
      <p style={{ color: '#b5b1a6', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Pulsation tant que ça travaille : à ~50 s par pas, un texte seul semble figé. */}
        {(busy || (!isGenMode && !/^(OK|ÉCART|ERREUR)/.test(status) && !status.includes('indisponible'))) && (
          <span aria-hidden style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, animation: 'videoPulse 1.2s ease-in-out infinite' }} />
        )}
        <span>État : <strong data-testid="status">{status}</strong></span>
        <style>{`@keyframes videoPulse { 0%,100%{opacity:.25;transform:scale(.8)} 50%{opacity:1;transform:scale(1.15)} }`}</style>
      </p>
      {videoUrl && (
        // Lecteur simple : la vidéo compilée (WebM 8 fps, en boucle) au-dessus des frames.
        <video data-testid="player" src={videoUrl} controls autoPlay loop muted playsInline
          style={{ width: 288, borderRadius: 8, border: '1px solid var(--border-color)', marginBottom: 12, display: 'block' }} />
      )}
      <div data-testid="frames" style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {frames.map((f, i) => (
          <canvas key={i} width={f.width} height={f.height} style={{ width: 128, height: 128, borderRadius: 4 }}
            ref={(c) => { if (c) c.getContext('2d')?.putImageData(f, 0, 0); }} />
        ))}
      </div>
    </div>
    </div>
  );
}
