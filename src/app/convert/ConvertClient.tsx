"use client";

// Standalone GGUF → BRIK conversion studio: convert + download .brik packages, and manage the
// IndexedDB cache of auto-converted models (list / delete). Loading into the engine stays in the
// main app — this page is about producing and managing .brik files.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2, RefreshCw, Database } from 'lucide-react';
import BrikConvertPanel from '../BrikConvertPanel';
import { PRESET_MODELS, TOKENIZER_PRESETS } from '@/lib/presets';
import { listBrik, deleteBrik, type BrikCacheMeta } from '@/lib/brikCache';
import { useT, useLocale, useHref } from '@/lib/i18n';
import ByLine from '../ByLine';
import BackLink from '../BackLink';

const formatBytesU = (n: number, u: [string, string, string]): string =>
	n >= 1e9 ? `${(n / 1e9).toFixed(2)} ${u[2]}` : n >= 1e6 ? `${(n / 1e6).toFixed(0)} ${u[1]}` : `${(n / 1e3).toFixed(0)} ${u[0]}`;

// Fetch a GGUF with progress (the convert panel reports download %). Streamed so big files don't
// block; falls back to a plain arrayBuffer if the body isn't streamable. `failMsg` is the localized
// error prefix (this is a module function — no hooks here).
async function downloadGguf(url: string, onProgress: (loaded: number, total: number) => void, failMsg = 'Téléchargement échoué :'): Promise<Blob> {
	const resp = await fetch(url);
	if (!resp.ok) throw new Error(`${failMsg} HTTP ${resp.status}`);
	const total = Number(resp.headers.get('content-length') || 0);
	if (!resp.body || !total) return await resp.blob();
	const reader = resp.body.getReader();
	const chunks: Uint8Array[] = [];
	let loaded = 0;
	for (;;) {
		const { done, value } = await reader.read();
		if (done) break;
		chunks.push(value);
		loaded += value.length;
		onProgress(loaded, total);
	}
	return new Blob(chunks as BlobPart[]);
}

function tierLabel(tier: string, t: (en: string, fr: string) => string): string {
	return tier === 'q8' ? t('Balanced · int8', 'Équilibré · int8') : tier === 'q4' ? t('Light · int4', 'Léger · int4') : tier === 'f16' ? t('Quality · f16', 'Qualité · f16') : tier;
}

export default function ConvertClient() {
	const t = useT();
	// Liens internes préfixés par la locale (voir useHref) : rester dans sa langue en naviguant.
	const href = useHref();
	const { locale } = useLocale();
	const formatBytes = (n: number) => formatBytesU(n, locale === 'fr' ? ['Ko', 'Mo', 'Go'] : ['KB', 'MB', 'GB']);
	const [cache, setCache] = useState<BrikCacheMeta[]>([]);
	const [loadingCache, setLoadingCache] = useState(true);

	// Load the cache list from IndexedDB (an external system) — setState only in the promise
	// callback, never synchronously in the effect body.
	useEffect(() => {
		let active = true;
		listBrik().then((l) => { if (active) { setCache(l); setLoadingCache(false); } }).catch(() => { if (active) setLoadingCache(false); });
		return () => { active = false; };
	}, []);

	// Manual refresh (event handler).
	const refresh = () => {
		setLoadingCache(true);
		listBrik().then(setCache).catch(() => setCache([])).finally(() => setLoadingCache(false));
	};

	const remove = async (key: string) => {
		await deleteBrik(key).catch(() => {});
		refresh();
	};

	const totalBytes = cache.reduce((a, c) => a + c.byteLength, 0);

	return (
		<main style={{ maxWidth: 820, margin: '0 auto', padding: '48px 24px 80px' }}>
			{/* BackLink et non un lien vers `/` : la racine sert la LANDING depuis le 2026-08-13, donc
			    « retour à l'application » renvoyait sur la page de présentation — signalé par Romain.
			    BackLink revient par l'historique quand on vient du site (donc dans le chat si c'est de
			    là qu'on est parti) et retombe sur /chat pour une arrivée directe. */}
			<BackLink />

			<h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 34, fontWeight: 800, margin: '20px 0 8px', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
				{t('BRIK conversion', 'Conversion BRIK')}
			</h1>
			<p style={{ color: 'var(--text-secondary)', fontSize: 15, margin: '0 0 32px' }}>
				{t('Repacks a GGUF as ', 'Repacke un GGUF en ')}<strong>BRIK</strong>{t(' — our web format (single file, aligned tensors, int8/int4 quants dequantized on the GPU). Lighter to download, faster to run, and above all', ' — notre format web (fichier unique, tenseurs alignés, quants int8/int4 déquantifiés dans le GPU). Plus léger à télécharger, plus rapide à exécuter, et surtout')}
				<strong>{t(' instant loading', ' chargement instantané')}</strong>{t(': already quantized on disk, a BRIK goes straight to VRAM, skipping the conversion a GGUF redoes on every open.', " : déjà quantifié sur le disque, le BRIK monte direct en VRAM, sans la conversion qu'un GGUF refait à chaque ouverture.")}
			</p>

			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, alignItems: 'start' }}>
				{/* Conversion */}
				<div className="card" style={{ padding: 18 }}>
					<h2 className="section-title" style={{ fontSize: 12, margin: '0 0 12px', color: 'var(--accent)' }}>{t('Convert a model', 'Convertir un modèle')}</h2>
					<BrikConvertPanel
						disabled={false}
						tokenizerPresets={TOKENIZER_PRESETS}
						presetModels={PRESET_MODELS}
						downloadGguf={(url, onProgress) => downloadGguf(url, onProgress, t('Download failed:', 'Téléchargement échoué :'))}
						formatBytes={formatBytes}
					/>
				</div>

				{/* Cache management */}
				<div className="card" style={{ padding: 18 }}>
					<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
						<h2 className="section-title" style={{ fontSize: 12, margin: 0, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 6 }}>
							<Database size={13} /> {t('Cached BRIK models', 'Modèles BRIK en cache')}
						</h2>
						<button className="btn btn-secondary" style={{ fontSize: 11, padding: '4px 8px' }} onClick={refresh}>
							<RefreshCw size={12} /> {t('Refresh', 'Actualiser')}
						</button>
					</div>
					<p style={{ fontSize: 11.5, color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 12px' }}>
						{t('Automatic conversions (the "Convert to BRIK at load time" option in the app) are stored here for instant opens. ', "Les conversions automatiques (option « Convertir en BRIK au chargement » dans l'app) sont stockées ici pour des ouvertures instantanées. ")}{cache.length > 0 && <>{t('Total:', 'Total :')} <strong>{formatBytes(totalBytes)}</strong> · {cache.length} {t('model(s)', 'modèle(s)')}.</>}
					</p>

					{loadingCache ? (
						<p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t('Loading…', 'Chargement…')}</p>
					) : cache.length === 0 ? (
						<p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t('No BRIK model cached yet.', 'Aucun modèle BRIK en cache pour le moment.')}</p>
					) : (
						<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
							{cache.map((c) => (
								<div key={c.key} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, background: 'var(--bg-elevated)', border: '1px solid var(--border-color)' }}>
									<div style={{ flex: 1, minWidth: 0 }}>
										<div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.modelName}</div>
										<div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{tierLabel(c.tier, t)} · {formatBytes(c.byteLength)}</div>
									</div>
									<button className="btn btn-danger" style={{ fontSize: 11, padding: '4px 8px', flexShrink: 0 }} onClick={() => remove(c.key)} title={t('Remove from cache', 'Supprimer du cache')}>
										<Trash2 size={12} />
									</button>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
			<ByLine />
		</main>
	);
}
