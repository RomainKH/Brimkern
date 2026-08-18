"use client";

// GGUF → BRIK conversion panel (a tab inside the model loader). Converts a GGUF (local file or a
// preset URL) into a BRIK package entirely in the browser, then lets the user either load it
// straight into the engine or download it as a single self-contained .brik file (container.ts). A
// downloaded .brik (or a legacy .brik.zip) can be re-imported here to load without re-converting.

import { useRef, useState } from 'react';
import { Package, Upload, Download, Play, Loader2, X, AlertTriangle, FileArchive } from 'lucide-react';
import { WebGpuEngine } from '@/lib/webgpu/kernels';
import { parseGguf } from '@/lib/webgpu/ggufParser';
import { convertModelToBrik, type BrikBuildOutput, type WeightDType } from '@/lib/brik/convert';
import { brikToLoadable, brikFileToLoadable, type BrikLoadable } from '@/lib/brik/loader';
import { serializeBrik, parseBrik } from '@/lib/brik/container';
import { readZip } from '@/lib/brik/zip';
import type { BrikManifest } from '@/lib/brik/format';
import { useT } from '@/lib/i18n';
import { fmtModelSize } from '@/lib/modelCatalog';

interface TokenizerPreset { name: string; id: string; type: string }
// Vue MINIMALE d'un preset (le panneau n'a besoin que de ça) — `sizeBytes` sert à afficher la taille
// dans la langue active plutôt que la chaîne française figée du catalogue.
interface PresetModel { name: string; url: string; size: string; sizeBytes: number }

interface Props {
	disabled: boolean;
	tokenizerPresets: TokenizerPreset[];
	presetModels: PresetModel[];
	downloadGguf: (url: string, onProgress: (loaded: number, total: number) => void) => Promise<Blob>;
	// Load callbacks are optional: the standalone /convert page omits them (convert + download only),
	// the main app supplies them (load into the engine / stream).
	onLoadBrik?: (loadable: BrikLoadable) => Promise<void> | void;
	onLoadBrikUrl?: (url: string) => Promise<void> | void;
	formatBytes: (n: number) => string;
}

type Phase = 'idle' | 'downloading' | 'converting' | 'done' | 'error';

const stripGguf = (n: string) => n.replace(/\.gguf$/i, '');
// Best-effort quant tag from a GGUF filename (e.g. "…-Q4_K_M.gguf" → "Q4_K_M"), purely informational.
const guessQuant = (n: string) => n.match(/(Q\d[\w]*|F16|F32|BF16)/i)?.[0]?.toUpperCase();

export default function BrikConvertPanel({ disabled, tokenizerPresets, presetModels, downloadGguf, onLoadBrik, onLoadBrikUrl, formatBytes }: Props) {
	const t = useT();
	const [mode, setMode] = useState<'file' | 'url'>('file');
	const [file, setFile] = useState<File | null>(null);
	const [url, setUrl] = useState<string>(presetModels[0]?.url ?? '');
	const [tokenizerId, setTokenizerId] = useState<string>(tokenizerPresets[0]?.id ?? '');
	// Target precision for the big layer matrices: f16 (v1, biggest/highest quality), q8 (~half,
	// near-f16 — the "heavy but fast" tier) or q4 (~quarter, biggest models fit).
	const [weightDType, setWeightDType] = useState<WeightDType>('q8');

	const [phase, setPhase] = useState<Phase>('idle');
	const [dlPct, setDlPct] = useState<number>(0);
	const [prog, setProg] = useState<{ done: number; total: number; label: string } | null>(null);
	const [error, setError] = useState<string>('');
	const [result, setResult] = useState<BrikBuildOutput | null>(null);
	const [outName, setOutName] = useState<string>('');

	const [brikUrl, setBrikUrl] = useState<string>('');

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
			if (!ok) throw new Error(t('WebGPU unavailable: enable hardware acceleration or use Chrome.', "WebGPU indisponible : activez l'accélération matérielle ou utilisez Chrome."));

			const gguf = await parseGguf(blob);
			const tok = tokenizerPresets.find((t) => t.id === tokenizerId) ?? tokenizerPresets[0];
			const readRaw = async (offset: number, byteLength: number) =>
				new Uint8Array(await blob.slice(offset, offset + byteLength).arrayBuffer());
			const dequantize = (type: string, bytes: Uint8Array, nElems: number) => engine!.dequantizeByType(type, bytes, nElems);

			const name = stripGguf(srcName);
			const out = await convertModelToBrik(
				gguf,
				readRaw,
				dequantize,
				{
					modelName: name,
					quantSource: guessQuant(srcName),
					uiArch: tok.type,
					tokenizer: { kind: 'hf-hub', id: tokenizerId },
					chat: { template: '', stopTokenIds: [] },
					weightDType,
				},
				(done, total, label) => setProg({ done, total, label }),
				(type, b, n, dt) => engine!.quantizeToBytes(type, b, n, dt), // q8/q4 quantized on the GPU
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

	const totalShardBytes = (out: BrikBuildOutput) => out.shards.reduce((a, s) => a + s.bytes.length, 0);

	const download = () => {
		if (!result) return;
		// One self-contained .brik file (header + manifest + aligned tensor data) — see container.ts.
		const bytes = serializeBrik(result.manifest, result.shards);
		const blob = new Blob([bytes as BlobPart], { type: 'application/octet-stream' });
		const a = document.createElement('a');
		a.href = URL.createObjectURL(blob);
		a.download = `${outName}.brik`;
		a.click();
		URL.revokeObjectURL(a.href);
	};

	const loadNow = async () => {
		if (!result || !onLoadBrik) return;
		await onLoadBrik(brikToLoadable(result.manifest, result.shards));
	};

	// Stream a hosted single-file .brik by URL: only the header is fetched up front, tensors are
	// range-fetched on demand (Cache-API backed). No full download, no local file.
	const loadFromUrl = async () => {
		const u = brikUrl.trim();
		if (!u || blocked || !onLoadBrikUrl) return;
		setError('');
		setPhase('converting');
		try {
			await onLoadBrikUrl(u);
			setPhase('idle');
		} catch (e: unknown) {
			setError(e instanceof Error ? e.message : String(e));
			setPhase('error');
		}
	};

	// Import a previously downloaded package: a single-file .brik (magic "BRIK") OR a legacy .brik.zip.
	// Sniffs the leading bytes so either works regardless of extension.
	const importPackage = async (f: File) => {
		if (!onLoadBrik) return;
		setError('');
		setPhase('converting');
		try {
			const buf = new Uint8Array(await f.arrayBuffer());
			const isContainer = buf.length >= 4 && buf[0] === 0x42 && buf[1] === 0x52 && buf[2] === 0x49 && buf[3] === 0x4B; // "BRIK"
			if (isContainer) {
				const { manifest, data } = parseBrik(buf);
				setPhase('idle');
				await onLoadBrik(brikFileToLoadable(manifest, data));
				return;
			}
			const entries = readZip(buf);
			const mjson = entries.find((e) => e.name === 'manifest.json');
			if (!mjson) throw new Error(t('Unrecognized file: neither .brik (BRIK magic) nor .brik.zip (manifest.json missing)', 'Fichier non reconnu : ni .brik (sceau BRIK) ni .brik.zip (manifest.json absent)'));
			const manifest = JSON.parse(new TextDecoder().decode(mjson.data)) as BrikManifest;
			const shards = entries.filter((e) => e.name.endsWith('.brik')).map((e) => ({ file: e.name, bytes: e.data }));
			setPhase('idle');
			await onLoadBrik(brikToLoadable(manifest, shards));
		} catch (e: unknown) {
			setError(e instanceof Error ? e.message : String(e));
			setPhase('error');
		}
	};

	const labelStyle = { fontSize: '11px', color: 'var(--text-muted)' } as const;

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
			<div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
				{t('Repacks a GGUF as ', 'Repacke un GGUF en ')}<strong>BRIK</strong>{t(' (16-byte-aligned weights, sharded per layer, f16/int8/int4 tier of your choice). 100% in-browser conversion.', ' (poids alignés 16 octets, sharded par couche, tier f16/int8/int4 au choix). Conversion 100% navigateur.')}
			</div>

			{/* Source: local file or preset URL */}
			<div className="tabs-container" style={{ gap: '2px' }}>
				<button className={`tab-btn ${mode === 'file' ? 'active' : ''}`} onClick={() => setMode('file')} disabled={blocked} style={{ fontSize: '11px', padding: '6px 4px' }}>
					<Upload size={12} /> {t('GGUF file', 'Fichier GGUF')}
				</button>
				<button className={`tab-btn ${mode === 'url' ? 'active' : ''}`} onClick={() => setMode('url')} disabled={blocked} style={{ fontSize: '11px', padding: '6px 4px' }}>
					<Download size={12} /> {t('HF preset', 'Preset HF')}
				</button>
			</div>

			{mode === 'file' ? (
				<>
					<div className="file-dropzone" onClick={() => !blocked && ggufInputRef.current?.click()}>
						<Upload className="file-dropzone-icon" size={22} />
						<span className="file-dropzone-text">{t('Choose a GGUF file', 'Choisir un fichier GGUF')}</span>
						<span className="file-dropzone-subtext">{t('to convert to BRIK', 'à convertir en BRIK')}</span>
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
					<span className="input-label">{t('Preset model to download then convert:', 'Modèle preset à télécharger puis convertir :')}</span>
					<select className="input-control" aria-label={t('Preset model to download then convert', 'Modèle preset à télécharger puis convertir')} value={url} onChange={(e) => setUrl(e.target.value)} disabled={blocked}>
						{presetModels.map((m, i) => <option key={i} value={m.url}>{m.name} ({fmtModelSize(m.sizeBytes, t('en', 'fr') === 'fr')})</option>)}
					</select>
				</div>
			)}

			<div className="input-group">
				<span className="input-label">{t('Tokenizer / architecture:', 'Tokenizer / architecture :')}</span>
				<select className="input-control" aria-label={t('Tokenizer / architecture', 'Tokenizer / architecture')} value={tokenizerId} onChange={(e) => setTokenizerId(e.target.value)} disabled={blocked}>
					{tokenizerPresets.map((t, i) => <option key={i} value={t.id}>{t.name}</option>)}
				</select>
			</div>

			<div className="input-group">
				<span className="input-label">{t('Conversion profile:', 'Profil de conversion :')}</span>
				<select className="input-control" aria-label={t('Conversion profile', 'Profil de conversion')} value={weightDType} onChange={(e) => setWeightDType(e.target.value as WeightDType)} disabled={blocked}>
					<option value="f16">{t('Quality: f16 (heavier)', 'Qualité : f16 (plus lourd)')}</option>
					<option value="q8">{t('Balanced ★: int8 (recommended)', 'Équilibré ★ : int8 (recommandé)')}</option>
					<option value="mixed">{t('Mixed: int4 + int8 attention (small models)', 'Mixte : int4 + attention int8 (petits modèles)')}</option>
					<option value="q4">{t('Light: int4 (big models)', 'Léger : int4 (gros modèles)')}</option>
				</select>
				<span style={{ ...labelStyle, marginTop: 2 }}>
					{weightDType === 'f16' && t('Maximum quality: f16 weights, read natively in VRAM. Heaviest file.', 'Qualité maximale : poids en f16, lecture native en VRAM. Fichier le plus lourd.')}
					{weightDType === 'q8' && t('Recommended: near-identical quality to f16 at ~half the size (int8 dequantized on the fly).', 'Recommandé : qualité quasi-identique au f16 pour ~la moitié de la taille (int8 déquant à la volée).')}
					{weightDType === 'mixed' && t('Nearly as small as int4, but the attention stays int8: avoids the incoherence full int4 causes on small models.', "Presque aussi compact que l'int4, mais l'attention reste en int8 : évite l'incohérence que l'int4 intégral cause aux petits modèles.")}
					{weightDType === 'q4' && t('The most compact (~¼ the size) → fits bigger models. Slight quality loss.', 'Le plus compact (~¼ de la taille) → permet de plus gros modèles. Légère perte de qualité.')}
				</span>
			</div>

			{/* Memory caveat — conversion holds ~the f16 model in RAM. */}
			<div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', background: 'rgba(245,158,11,0.08)', border: '1px solid var(--warning)', borderRadius: '8px', padding: '8px 10px' }}>
				<AlertTriangle size={13} style={{ color: 'var(--warning)', flexShrink: 0, marginTop: '1px' }} />
				<span style={{ fontSize: '10.5px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
					{t('Conversion keeps the whole model in f16 in memory: the tab may freeze for a while. Reserved for small/medium models.', "La conversion garde tout le modèle en f16 en mémoire : l'onglet peut se figer un moment. Réservé aux petits/moyens modèles.")}
				</span>
			</div>

			<button className="btn btn-primary btn-block" onClick={runConvert}
				disabled={blocked || (mode === 'file' ? !file : !url)}>
				{busy ? <Loader2 size={14} className="spin" /> : <Package size={14} />}
				{phase === 'downloading' ? `${t('Downloading', 'Téléchargement')} ${dlPct}%` : phase === 'converting' ? t('Converting…', 'Conversion…') : t('Convert to BRIK', 'Convertir en BRIK')}
			</button>

			{phase === 'converting' && prog && (
				<div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
					<div style={{ height: '6px', background: 'var(--bg-card-hover)', borderRadius: '3px', overflow: 'hidden' }}>
						<div style={{ height: '100%', width: `${Math.round((prog.done / prog.total) * 100)}%`, background: 'var(--accent)', transition: 'width .1s' }} />
					</div>
					<span style={labelStyle}>{prog.done}/{prog.total} {t('tensors', 'tenseurs')} — {prog.label}</span>
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
						{t('✦ BRIK ready, ', '✦ BRIK prêt, ')} {result.shards.length} shard(s), {formatBytes(totalShardBytes(result))}
					</div>
					<div style={{ display: 'flex', gap: '6px' }}>
						{onLoadBrik && (
							<button className="btn btn-primary" style={{ flex: 1, fontSize: '11px', padding: '6px 8px' }} onClick={loadNow} disabled={disabled}>
								<Play size={13} /> {t('Load', 'Charger')}
							</button>
						)}
						<button className="btn btn-secondary" style={{ flex: 1, fontSize: '11px', padding: '6px 8px' }} onClick={download}>
							<Download size={13} /> {t('Download .brik', 'Télécharger .brik')}
						</button>
					</div>
				</div>
			)}

			{/* Re-import a previously downloaded package (.brik single-file, or legacy .brik.zip) */}
			{onLoadBrik && (
			<div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
				<span style={labelStyle}>{t('Already have a .brik? Load it without reconverting:', 'Déjà un .brik ? Chargez-le sans reconvertir :')}</span>
				<button className="btn btn-secondary btn-block" style={{ fontSize: '11px' }} onClick={() => !blocked && zipInputRef.current?.click()} disabled={blocked}>
					<FileArchive size={14} /> {t('Import a .brik (or .brik.zip)', 'Importer un .brik (ou .brik.zip)')}
				</button>
				<input ref={zipInputRef} type="file" accept=".brik,.zip,.brik.zip" style={{ display: 'none' }}
					onChange={(e) => { const f = e.target.files?.[0]; if (f) importPackage(f); e.target.value = ''; }} />
			</div>
			)}

			{/* Stream a hosted .brik by URL — header first, tensors range-fetched on demand + cached. */}
			{onLoadBrikUrl && (
			<div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
				<span style={labelStyle}>{t('Or stream a hosted .brik (HTTP ranges, no full download):', 'Ou streamer un .brik hébergé (range HTTP, sans tout télécharger) :')}</span>
				<input
					className="input-control"
					style={{ fontSize: '11px' }}
					placeholder="https://…/model.brik"
					value={brikUrl}
					onChange={(e) => setBrikUrl(e.target.value)}
					disabled={blocked}
				/>
				<button className="btn btn-secondary btn-block" style={{ fontSize: '11px' }} onClick={loadFromUrl} disabled={blocked || !brikUrl.trim()}>
					<Download size={14} /> {t('Stream from the URL', "Streamer depuis l'URL")}
				</button>
			</div>
			)}
		</div>
	);
}
