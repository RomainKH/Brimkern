"use client";

// GGUF → BWP conversion panel (a tab inside the model loader). Converts a GGUF (local file or a
// preset URL) into a BWP package entirely in the browser, then lets the user either load it
// straight into the engine or download it as a single .bwp.zip. A downloaded .bwp.zip can be
// re-imported here to load without re-converting.

import { useRef, useState } from 'react';
import { Package, Upload, Download, Play, Loader2, X, AlertTriangle, FileArchive } from 'lucide-react';
import { WebGpuEngine } from '@/lib/webgpu/kernels';
import { parseGguf } from '@/lib/webgpu/ggufParser';
import { convertModelToBwp, type BwpBuildOutput } from '@/lib/bwp/convert';
import { bwpToLoadable, type BwpLoadable } from '@/lib/bwp/loader';
import { makeZip, readZip } from '@/lib/bwp/zip';
import type { BwpManifest } from '@/lib/bwp/format';

interface TokenizerPreset { name: string; id: string; type: string }
interface PresetModel { name: string; url: string; size: string }

interface Props {
	disabled: boolean;
	tokenizerPresets: TokenizerPreset[];
	presetModels: PresetModel[];
	downloadGguf: (url: string, onProgress: (loaded: number, total: number) => void) => Promise<Blob>;
	onLoadBwp: (loadable: BwpLoadable) => Promise<void> | void;
	formatBytes: (n: number) => string;
}

type Phase = 'idle' | 'downloading' | 'converting' | 'done' | 'error';

const stripGguf = (n: string) => n.replace(/\.gguf$/i, '');
// Best-effort quant tag from a GGUF filename (e.g. "…-Q4_K_M.gguf" → "Q4_K_M"), purely informational.
const guessQuant = (n: string) => n.match(/(Q\d[\w]*|F16|F32|BF16)/i)?.[0]?.toUpperCase();

export default function BwpConvertPanel({ disabled, tokenizerPresets, presetModels, downloadGguf, onLoadBwp, formatBytes }: Props) {
	const [mode, setMode] = useState<'file' | 'url'>('file');
	const [file, setFile] = useState<File | null>(null);
	const [url, setUrl] = useState<string>(presetModels[0]?.url ?? '');
	const [tokenizerId, setTokenizerId] = useState<string>(tokenizerPresets[0]?.id ?? '');

	const [phase, setPhase] = useState<Phase>('idle');
	const [dlPct, setDlPct] = useState<number>(0);
	const [prog, setProg] = useState<{ done: number; total: number; label: string } | null>(null);
	const [error, setError] = useState<string>('');
	const [result, setResult] = useState<BwpBuildOutput | null>(null);
	const [outName, setOutName] = useState<string>('');

	const ggufInputRef = useRef<HTMLInputElement | null>(null);
	const zipInputRef = useRef<HTMLInputElement | null>(null);

	const busy = phase === 'downloading' || phase === 'converting';
	const blocked = disabled || busy;

	const runConvert = async () => {
		setError('');
		setResult(null);
		let engine: WebGpuEngine | null = null;
		try {
			let blob: Blob;
			let srcName: string;
			if (mode === 'file') {
				if (!file) return;
				blob = file;
				srcName = file.name;
			} else {
				if (!url) return;
				setPhase('downloading');
				setDlPct(0);
				blob = await downloadGguf(url, (loaded, total) => setDlPct(total ? Math.round((loaded / total) * 100) : 0));
				srcName = url.split('/').pop() || 'model.gguf';
			}

			setPhase('converting');
			setProg(null);
			engine = new WebGpuEngine();
			const ok = await engine.init();
			if (!ok) throw new Error("WebGPU indisponible — activez l'accélération matérielle ou utilisez Chrome.");

			const gguf = await parseGguf(blob);
			const tok = tokenizerPresets.find((t) => t.id === tokenizerId) ?? tokenizerPresets[0];
			const readRaw = async (offset: number, byteLength: number) =>
				new Uint8Array(await blob.slice(offset, offset + byteLength).arrayBuffer());
			const dequantize = (type: string, bytes: Uint8Array, nElems: number) => engine!.dequantizeByType(type, bytes, nElems);

			const name = stripGguf(srcName);
			const out = await convertModelToBwp(
				gguf,
				readRaw,
				dequantize,
				{
					modelName: name,
					quantSource: guessQuant(srcName),
					uiArch: tok.type,
					tokenizer: { kind: 'hf-hub', id: tokenizerId },
					chat: { template: '', stopTokenIds: [] },
				},
				(done, total, label) => setProg({ done, total, label }),
			);

			setResult(out);
			setOutName(name);
			setPhase('done');
		} catch (e: unknown) {
			setError(e instanceof Error ? e.message : String(e));
			setPhase('error');
		} finally {
			// Free the transient conversion device (separate from any loaded model's engine).
			engine?.device?.destroy?.();
		}
	};

	const totalShardBytes = (out: BwpBuildOutput) => out.shards.reduce((a, s) => a + s.bytes.length, 0);

	const download = () => {
		if (!result) return;
		const entries = [
			{ name: 'manifest.json', data: new TextEncoder().encode(JSON.stringify(result.manifest)) },
			...result.shards.map((s) => ({ name: s.file, data: s.bytes })),
		];
		const blob = new Blob(makeZip(entries) as BlobPart[], { type: 'application/zip' });
		const a = document.createElement('a');
		a.href = URL.createObjectURL(blob);
		a.download = `${outName}.bwp.zip`;
		a.click();
		URL.revokeObjectURL(a.href);
	};

	const loadNow = async () => {
		if (!result) return;
		await onLoadBwp(bwpToLoadable(result.manifest, result.shards));
	};

	const importZip = async (f: File) => {
		setError('');
		setPhase('converting');
		try {
			const buf = new Uint8Array(await f.arrayBuffer());
			const entries = readZip(buf);
			const mjson = entries.find((e) => e.name === 'manifest.json');
			if (!mjson) throw new Error('manifest.json absent du .bwp.zip');
			const manifest = JSON.parse(new TextDecoder().decode(mjson.data)) as BwpManifest;
			const shards = entries.filter((e) => e.name.endsWith('.bwp')).map((e) => ({ file: e.name, bytes: e.data }));
			setPhase('idle');
			await onLoadBwp(bwpToLoadable(manifest, shards));
		} catch (e: unknown) {
			setError(e instanceof Error ? e.message : String(e));
			setPhase('error');
		}
	};

	const labelStyle = { fontSize: '11px', color: 'var(--text-muted)' } as const;

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
			<div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
				Repacke un GGUF en <strong>BWP</strong> (poids f16 alignés 16 octets, sharded par couche). Conversion 100% navigateur.
			</div>

			{/* Source: local file or preset URL */}
			<div className="tabs-container" style={{ gap: '2px' }}>
				<button className={`tab-btn ${mode === 'file' ? 'active' : ''}`} onClick={() => setMode('file')} disabled={blocked} style={{ fontSize: '11px', padding: '6px 4px' }}>
					<Upload size={12} /> Fichier GGUF
				</button>
				<button className={`tab-btn ${mode === 'url' ? 'active' : ''}`} onClick={() => setMode('url')} disabled={blocked} style={{ fontSize: '11px', padding: '6px 4px' }}>
					<Download size={12} /> Preset HF
				</button>
			</div>

			{mode === 'file' ? (
				<>
					<div className="file-dropzone" onClick={() => !blocked && ggufInputRef.current?.click()}>
						<Upload className="file-dropzone-icon" size={22} />
						<span className="file-dropzone-text">Choisir un fichier GGUF</span>
						<span className="file-dropzone-subtext">à convertir en BWP</span>
						<input ref={ggufInputRef} type="file" accept=".gguf" style={{ display: 'none' }}
							onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
					</div>
					{file && (
						<div className="selected-files-list">
							<div className="file-item">
								<div className="file-item-info">
									<Upload size={12} style={{ color: 'var(--accent)' }} />
									<span className="file-item-name" title={file.name}>{file.name}</span>
									<span className="file-item-size">({formatBytes(file.size)})</span>
								</div>
								<button className="file-remove-btn" onClick={() => setFile(null)} disabled={blocked}><X size={14} /></button>
							</div>
						</div>
					)}
				</>
			) : (
				<div className="input-group">
					<span className="input-label">Modèle preset à télécharger puis convertir :</span>
					<select className="input-control" value={url} onChange={(e) => setUrl(e.target.value)} disabled={blocked}>
						{presetModels.map((m, i) => <option key={i} value={m.url}>{m.name} ({m.size})</option>)}
					</select>
				</div>
			)}

			<div className="input-group">
				<span className="input-label">Tokenizer / architecture :</span>
				<select className="input-control" value={tokenizerId} onChange={(e) => setTokenizerId(e.target.value)} disabled={blocked}>
					{tokenizerPresets.map((t, i) => <option key={i} value={t.id}>{t.name}</option>)}
				</select>
			</div>

			{/* Memory caveat — conversion holds ~the f16 model in RAM. */}
			<div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', background: 'rgba(245,158,11,0.08)', border: '1px solid var(--warning)', borderRadius: '8px', padding: '8px 10px' }}>
				<AlertTriangle size={13} style={{ color: 'var(--warning)', flexShrink: 0, marginTop: '1px' }} />
				<span style={{ fontSize: '10.5px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
					La conversion garde tout le modèle en f16 en mémoire — l&apos;onglet peut se figer un moment. Réservé aux petits/moyens modèles.
				</span>
			</div>

			<button className="btn btn-primary btn-block" onClick={runConvert}
				disabled={blocked || (mode === 'file' ? !file : !url)}>
				{busy ? <Loader2 size={14} className="spin" /> : <Package size={14} />}
				{phase === 'downloading' ? `Téléchargement ${dlPct}%` : phase === 'converting' ? 'Conversion…' : 'Convertir en BWP'}
			</button>

			{phase === 'converting' && prog && (
				<div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
					<div style={{ height: '6px', background: 'var(--bg-card-hover)', borderRadius: '3px', overflow: 'hidden' }}>
						<div style={{ height: '100%', width: `${Math.round((prog.done / prog.total) * 100)}%`, background: 'var(--accent)', transition: 'width .1s' }} />
					</div>
					<span style={labelStyle}>{prog.done}/{prog.total} tenseurs — {prog.label}</span>
				</div>
			)}

			{error && (
				<div style={{ fontSize: '11px', color: '#ef4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '8px 10px' }}>
					{error}
				</div>
			)}

			{phase === 'done' && result && (
				<div className="card" style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
					<div style={{ fontSize: '11.5px', color: 'var(--text-primary)', fontWeight: 600 }}>
						✦ BWP prêt — {result.shards.length} shard(s), {formatBytes(totalShardBytes(result))}
					</div>
					<div style={{ display: 'flex', gap: '6px' }}>
						<button className="btn btn-primary" style={{ flex: 1, fontSize: '11px', padding: '6px 8px' }} onClick={loadNow} disabled={disabled}>
							<Play size={13} /> Charger
						</button>
						<button className="btn btn-secondary" style={{ flex: 1, fontSize: '11px', padding: '6px 8px' }} onClick={download}>
							<Download size={13} /> .bwp.zip
						</button>
					</div>
				</div>
			)}

			{/* Re-import a previously downloaded .bwp.zip */}
			<div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
				<span style={labelStyle}>Déjà un .bwp.zip ? Chargez-le sans reconvertir :</span>
				<button className="btn btn-secondary btn-block" style={{ fontSize: '11px' }} onClick={() => !blocked && zipInputRef.current?.click()} disabled={blocked}>
					<FileArchive size={14} /> Importer un .bwp.zip
				</button>
				<input ref={zipInputRef} type="file" accept=".zip,.bwp.zip" style={{ display: 'none' }}
					onChange={(e) => { const f = e.target.files?.[0]; if (f) importZip(f); e.target.value = ''; }} />
			</div>
		</div>
	);
}
