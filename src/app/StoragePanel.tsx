"use client";

// Storage management modal: shows how much space each persistence bucket uses (every Cache API
// bucket incl. transformers.js's tokenizer cache, converted BRIK packages, chat history), the
// accurate Brimkern total, and the browser's (approximate) overall estimate — with a way to clear
// each. Opened from the sidebar.

import { useState, useEffect, useCallback } from 'react';
import { X, Trash2, HardDrive, Database, Package, MessageSquare, Loader2, ChevronDown, ShieldCheck, Shield } from 'lucide-react';
import { listBrik, deleteBrik, type BrikCacheMeta } from '@/lib/brikCache';
import { clearAllConversations } from '@/lib/chatStore';
import { allCaches, cacheEntries, clearCache, deleteCacheEntriesFor, groupCacheEntries, historyUsage, storageEstimate, isStoragePersisted, requestPersistentStorage, type NamedUsage, type Usage, type CacheEntry } from '@/lib/storage';
import { useT, useLocale } from '@/lib/i18n';
import { getEvictDays, setEvictDays, getLastEvictReport, evictStaleModels, getUsageMap, modelKey } from '@/lib/modelUsage';

const fmtBytes = (n: number, u: string[]): string => {
  if (!n) return `0 ${u[0]}`;
  const k = 1024;
  const i = Math.min(Math.floor(Math.log(n) / Math.log(k)), u.length - 1);
  return `${parseFloat((n / Math.pow(k, i)).toFixed(1))} ${u[i]}`;
};

const tierLabel = (t: string) => (t === 'q4' ? 'int4' : t === 'q8' ? 'int8' : t === 'f16' ? 'f16' : t);

export default function StoragePanel({ onClose, onHistoryCleared, onCacheChanged }: { onClose: () => void; onHistoryCleared?: () => void; onCacheChanged?: () => void }) {
  const t = useT();
  const { locale } = useLocale();
  const fmt = (n: number) => fmtBytes(n, locale === 'fr' ? ['o', 'Ko', 'Mo', 'Go'] : ['B', 'KB', 'MB', 'GB']);
  const [loading, setLoading] = useState(true);
  const [estimate, setEstimate] = useState<{ usage: number; quota: number } | null>(null);
  const [persisted, setPersisted] = useState<boolean | null>(null);
  const [cacheList, setCacheList] = useState<NamedUsage[]>([]);
  const [packages, setPackages] = useState<BrikCacheMeta[]>([]);
  const [history, setHistory] = useState<Usage>({ count: 0, bytes: 0 });
  const [busy, setBusy] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null); // which cache bucket is expanded
  const [entries, setEntries] = useState<Record<string, CacheEntry[]>>({}); // lazily-loaded per-bucket detail
  // Politique d'éviction des POIDS inutilisés + bilan de la dernière purge (lus au montage : ce sont
  // des valeurs localStorage, pas un état serveur).
  const [evictDays, setDays] = useState<number>(30);
  const [evictReport, setEvictReport] = useState<ReturnType<typeof getLastEvictReport>>(null);
  const [usage, setUsage] = useState<Record<string, number>>({});
  // Lecture des valeurs localStorage APRÈS le premier paint : trois setState synchrones dans un effet
  // déclenchent une cascade de rendus (règle react-hooks/set-state-in-effect). Un microtask suffit,
  // et l'état initial (30 j) est le défaut réel — aucun scintillement visible.
  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return;
      setDays(getEvictDays());
      setEvictReport(getLastEvictReport());
      setUsage(getUsageMap());
    });
    return () => { active = false; };
  }, []);

  const toggleExpand = async (name: string) => {
    if (expanded === name) { setExpanded(null); return; }
    setExpanded(name);
    if (!entries[name]) { const e = await cacheEntries(name); setEntries((prev) => ({ ...prev, [name]: e })); }
  };

  // No setState here — callers apply it in a promise callback (effect) or after await (handler), to
  // satisfy the "no synchronous setState in an effect" rule.
  // Dépendance sur `locale`, pas sur `t` : useT() rend une nouvelle fonction à chaque rendu, ce qui
  // relancerait l'effet (et le recensement des caches) en boucle.
  const fetchAll = useCallback(() => Promise.all([
    storageEstimate(),
    allCaches(t),
    listBrik().catch(() => [] as BrikCacheMeta[]),
    historyUsage(),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ]), [locale]);

  useEffect(() => {
    let active = true;
    fetchAll()
      .then((r) => { if (!active) return; setEstimate(r[0]); setCacheList(r[1]); setPackages(r[2]); setHistory(r[3]); setLoading(false); })
      .catch(() => { if (active) setLoading(false); });
    // État de persistance : si le navigateur ne l'a pas encore accordée, on la demande UNE fois en
    // silence (aucun dialogue — Chrome tranche seul selon l'engagement). Le résultat n'est
    // qu'affiché : il n'y a rien à cliquer, cf. requestPersistentStorage.
    isStoragePersisted()
      .then((p) => (p ? p : requestPersistentStorage()))
      .then((p) => { if (active) setPersisted(p); })
      .catch(() => { /* ignore */ });
    return () => { active = false; };
  }, [fetchAll]);

  const refresh = async () => {
    const r = await fetchAll();
    setEstimate(r[0]); setCacheList(r[1]); setPackages(r[2]); setHistory(r[3]); setLoading(false);
    setEntries({}); setExpanded(null); // detail is stale after a delete
  };

  const run = async (id: string, fn: () => Promise<void>) => { setBusy(id); try { await fn(); } catch { /* ignore */ } await refresh(); onCacheChanged?.(); setBusy(null); };
  const delCache = (name: string) => run(`c:${name}`, () => clearCache(name));
  const delPackage = (key: string) => run(key, () => deleteBrik(key));
  const clearHistory = () => {
    if (!confirm(t('Delete the entire conversation history? This cannot be undone.', 'Supprimer tout l’historique des conversations ? Cette action est irréversible.'))) return;
    return run('history', async () => { await clearAllConversations(); onHistoryCleared?.(); });
  };
  const clearAll = () => {
    if (!confirm(t('Delete everything: model caches (streamed/GGUF/tokenizers), converted BRIKs AND conversation history? Irreversible. The active model stays loaded in memory until the page is reloaded.', 'Tout supprimer : caches modèles (streamés/GGUF/tokenizers), BRIK convertis ET historique des conversations ? Irréversible. Le modèle actif reste chargé en mémoire jusqu’au rechargement de la page.'))) return;
    return run('all', async () => {
      await Promise.all(cacheList.map((c) => clearCache(c.name)));
      await Promise.all(packages.map((p) => deleteBrik(p.key)));
      await clearAllConversations();
      onHistoryCleared?.();
    });
  };

  const packagesBytes = packages.reduce((a, p) => a + p.byteLength, 0);
  const cachesBytes = cacheList.reduce((a, c) => a + c.bytes, 0);
  const brikkernTotal = cachesBytes + packagesBytes + history.bytes;

  const clearBtn = (id: string, onClick: () => void, disabled: boolean) => (
    <button className="btn btn-danger" style={{ fontSize: 11, padding: '5px 9px' }} onClick={onClick} disabled={disabled || busy !== null} title={t('Clear', 'Vider')}>
      {busy === id ? <Loader2 size={13} className="spin" /> : <Trash2 size={13} />}
    </button>
  );

  const usageRow = (key: string, icon: React.ReactNode, title: string, sub: string, bytes: number, action: React.ReactNode) => (
    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: '1px solid var(--border-color)' }}>
      <div style={{ color: 'var(--accent)', flexShrink: 0, display: 'flex' }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sub}</div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', flexShrink: 0 }}>{fmt(bytes)}</div>
      <div style={{ flexShrink: 0 }}>{action}</div>
    </div>
  );

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} className="card" style={{ width: '100%', maxWidth: 540, maxHeight: '85vh', overflowY: 'auto', padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <HardDrive size={20} style={{ color: 'var(--accent)' }} />
          <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 20, flex: 1 }}>{t('Storage', 'Stockage')}</h2>
          <button onClick={onClose} className="circle-btn" style={{ width: 30, height: 30 }} title={t('Close', 'Fermer')}><X size={16} /></button>
        </div>

        {/* Total Brimkern (somme des rows) + jauge HONNÊTE contre le VRAI quota du navigateur
            (navigator.storage.estimate). C'est le navigateur qui fixe ce plafond, pas l'app — on ne
            peut pas le relever depuis le code ; persist() (« Garder sur l'appareil ») évite juste
            l'éviction. On alerte quand on approche du quota (un gros modèle n'y rentrera pas). */}
        {(() => {
          const quota = estimate?.quota ?? 0;
          const usage = estimate?.usage ?? brikkernTotal;
          const pct = quota > 0 ? Math.min(100, Math.max(usage > 0 ? 2 : 0, (usage / quota) * 100)) : 0;
          const near = quota > 0 && usage / quota > 0.85;
          return (
            <>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>{t('Brimkern data (local)', 'Données Brimkern (local)')}</span>
                <span style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{loading ? '…' : fmt(brikkernTotal)}</span>
              </div>
              {quota > 0 && (
                <>
                  <div style={{ height: 6, borderRadius: 999, background: 'var(--bg-card-hover, rgba(127,127,127,0.15))', overflow: 'hidden', margin: '6px 0 4px' }}>
                    <div style={{ height: '100%', width: `${pct.toFixed(1)}%`, background: near ? 'var(--warning, #f59e0b)' : 'var(--accent)', borderRadius: 999 }} />
                  </div>
                  <div style={{ fontSize: 10.5, color: near ? 'var(--warning, #f59e0b)' : 'var(--text-muted)', lineHeight: 1.4, marginBottom: 4 }}>
                    {t('Browser quota for this site: ', 'Quota du navigateur pour ce site : ')}<strong>{fmt(usage)} / {fmt(quota)}</strong>{' — '}
                    {t('the browser sets this limit (not Brimkern). A model larger than the free space won’t cache.', 'c’est le navigateur qui fixe cette limite (pas Brimkern). Un modèle plus gros que l’espace libre ne pourra pas être mis en cache.')}
                    {near ? ' ' + t('Nearly full — clear a few models below.', 'Presque plein — vide quelques modèles ci-dessous.') : ''}
                  </div>
                </>
              )}
            </>
          );
        })()}

        {/* Persistance : sans elle, un cache multi-Go peut être évincé sous pression disque et le
            modèle se re-télécharge. PUREMENT INFORMATIF — il y avait ici un bouton « Garder sur
            l'appareil » (persist()) : Chrome n'affiche aucune demande et décide seul selon
            l'engagement avec le site, donc le bouton ne faisait rien de visible. La demande est
            désormais faite une fois en silence au montage, et on n'affiche que l'état. */}
        {persisted !== null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', margin: '10px 0 4px', borderRadius: 10, background: persisted ? 'color-mix(in srgb, var(--success) 8%, transparent)' : 'var(--bg-card-hover, rgba(127,127,127,0.08))', border: `1px solid ${persisted ? 'color-mix(in srgb, var(--success) 40%, transparent)' : 'var(--border-color)'}` }}>
            {persisted ? <ShieldCheck size={18} style={{ color: 'var(--success)', flexShrink: 0 }} /> : <Shield size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{persisted ? t('Storage kept on this device', 'Stockage gardé sur cet appareil') : t('Storage not guaranteed', 'Stockage non garanti')}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>{persisted
                ? t('Downloaded models are protected from automatic eviction.', 'Les modèles téléchargés sont protégés de l’éviction automatique.')
                : t('The browser may evict cached models under disk pressure (they’d re-download). The browser decides this on its own, based on how much you use the site — bookmarking it or installing the app makes it likely.', 'Le navigateur peut évincer les modèles en cache sous pression disque (re-téléchargement). Il en décide seul, selon votre usage du site — le mettre en favori ou installer l’app rend la conservation probable.')}</div>
            </div>
          </div>
        )}

        {/* Éviction automatique : un modèle essayé laisse 150 Mo à 2 Go de plages derrière lui et rien
            ne les libérait. On purge les POIDS inutilisés depuis N jours — jamais les conversations,
            jamais les .brik convertis localement, jamais le modèle chargé. Le réglage et le bilan sont
            AFFICHÉS : effacer des centaines de Mo en silence serait pire que le problème. */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', padding: '10px 12px', margin: '4px 0 10px', borderRadius: 10, background: 'var(--bg-card-hover, rgba(127,127,127,0.06))', border: '1px solid var(--border-color)' }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>
              {t('Auto-clean unused models', 'Nettoyage auto des modèles inutilisés')}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>
              {t('Weights only — conversations and locally converted .brik are never touched.',
                 'Les poids seulement — conversations et .brik convertis en local ne sont jamais touchés.')}
            </div>
          </div>
          <select
            className="input-control"
            aria-label={t('Delete weights unused for', 'Supprimer les poids inutilisés depuis')}
            style={{ fontSize: 12, width: 'auto', flexShrink: 0 }}
            value={evictDays}
            onChange={(e) => { const d = Number(e.target.value); setDays(d); setEvictDays(d); }}
          >
            <option value={0}>{t('Never', 'Jamais')}</option>
            <option value={7}>{t('After 7 days', 'Après 7 jours')}</option>
            <option value={30}>{t('After 30 days', 'Après 30 jours')}</option>
            <option value={90}>{t('After 90 days', 'Après 90 jours')}</option>
          </select>
          <button
            className="btn"
            style={{ fontSize: 11, padding: '5px 10px', flexShrink: 0 }}
            disabled={busy !== null || evictDays === 0}
            onClick={() => run('evict', async () => {
              const r = await evictStaleModels([]);
              setEvictReport(r.models.length ? r : getLastEvictReport());
              setUsage(getUsageMap());
            })}
          >
            {busy === 'evict' ? <Loader2 size={12} className="spin" /> : t('Clean now', 'Nettoyer maintenant')}
          </button>
          {evictReport && evictReport.models.length > 0 && (
            <div style={{ flexBasis: '100%', fontSize: 10.5, color: 'var(--text-muted)' }}>
              {t('Last clean:', 'Dernier nettoyage :')} {new Date(evictReport.at).toLocaleDateString()} — {fmt(evictReport.freedBytes)} ({evictReport.models.join(', ')})
            </div>
          )}
        </div>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '20px 0', color: 'var(--text-muted)', fontSize: 13 }}>
            <Loader2 size={15} className="spin" /> {t('Measuring space…', 'Calcul de l’espace…')}
          </div>
        ) : (
          <div style={{ marginTop: 6 }}>
            {/* Every Cache API bucket (streamed models, GGUFs, transformers.js tokenizer cache, …) */}
            {cacheList.length === 0 && packages.length === 0 && history.count === 0 && (
              <div style={{ padding: '14px 0', fontSize: 12, color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)' }}>{t('No cached data.', 'Aucune donnée en cache.')}</div>
            )}
            {cacheList.map((c) => (
              <div key={c.name} style={{ borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0' }}>
                  <button
                    onClick={() => c.count > 0 && toggleExpand(c.name)}
                    style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', cursor: c.count > 0 ? 'pointer' : 'default', padding: 0, textAlign: 'left' }}
                  >
                    <Database size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.count} {t('entry(-ies)', 'entrée(s)')}{c.count > 0 ? t(' · click for details', ' · cliquer pour le détail') : ''}</div>
                    </div>
                    {c.count > 0 && <ChevronDown size={14} style={{ color: 'var(--text-muted)', flexShrink: 0, transform: expanded === c.name ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }} />}
                  </button>
                  <div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', flexShrink: 0 }}>{fmt(c.bytes)}</div>
                  {clearBtn(`c:${c.name}`, () => delCache(c.name), c.count === 0)}
                </div>
                {expanded === c.name && (
                  <div style={{ paddingLeft: 30, paddingBottom: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {!entries[c.name] ? (
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}><Loader2 size={12} className="spin" /> {t('Reading…', 'Lecture…')}</div>
                    ) : entries[c.name].length === 0 ? (
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('Empty.', 'Vide.')}</div>
                    ) : groupCacheEntries(entries[c.name]).map((g) => (
                      // UNE ligne par MODÈLE : les plages d'un même .brik sont sommées (elles
                      // occupaient des centaines de lignes illisibles). Chaque modèle se supprime
                      // seul — auparavant il fallait vider tout le bucket.
                      <div key={g.key} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5 }}>
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }} title={g.key}>{g.label}</span>
                        {g.parts > 1 && (
                          <span style={{ color: 'var(--text-muted)', fontSize: 10.5, flexShrink: 0 }}>
                            {g.parts} {t('parts', 'morceaux')}
                          </span>
                        )}
                        {/* Dernier usage : c'est ce qui décide de l'éviction, donc ça doit être visible. */}
                        {usage[modelKey(g.key)] && (
                          <span style={{ color: 'var(--text-muted)', fontSize: 10.5, flexShrink: 0 }} title={new Date(usage[modelKey(g.key)]).toLocaleString()}>
                            {t('used', 'utilisé')} {new Date(usage[modelKey(g.key)]).toLocaleDateString()}
                          </span>
                        )}
                        <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{fmt(g.bytes)}</span>
                        <button
                          className="btn btn-danger"
                          style={{ fontSize: 10.5, padding: '3px 7px', flexShrink: 0 }}
                          title={t(`Delete ${g.label}`, `Supprimer ${g.label}`)}
                          aria-label={t(`Delete ${g.label}`, `Supprimer ${g.label}`)}
                          disabled={busy === `m:${g.key}`}
                          onClick={() => run(`m:${g.key}`, async () => { await deleteCacheEntriesFor(c.name, g.key); })}
                        >
                          {busy === `m:${g.key}` ? <Loader2 size={11} className="spin" /> : <Trash2 size={11} />}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Converted BRIK packages — itemized */}
            {packages.length > 0 && (
              <div style={{ paddingTop: 12, borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Package size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{t('Converted BRIKs (cache)', 'BRIK convertis (cache)')}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{packages.length} {t('package(s)', 'paquet(s)')}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{fmt(packagesBytes)}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10, paddingLeft: 30 }}>
                  {packages.map((p) => (
                    <div key={p.key} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }} title={p.modelName}>
                        {p.modelName} <span style={{ color: 'var(--text-muted)' }}>· {tierLabel(p.tier)} · {fmt(p.byteLength)}</span>
                      </span>
                      {clearBtn(p.key, () => delPackage(p.key), false)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {usageRow('history', <MessageSquare size={18} />, t('Conversation history', 'Historique des conversations'), `${history.count} conversation(s)`, history.bytes,
              clearBtn('history', clearHistory, history.count === 0))}
          </div>
        )}

        {!loading && brikkernTotal > 0 && (
          <button
            className="btn btn-danger"
            style={{ width: '100%', marginTop: 16, justifyContent: 'center', gap: 8, fontSize: 13, padding: '9px' }}
            onClick={clearAll}
            disabled={busy !== null}
            title={t('Clear all caches, BRIKs and the history', 'Vider tous les caches, BRIK et l’historique')}
          >
            {busy === 'all' ? <Loader2 size={15} className="spin" /> : <Trash2 size={15} />} {t('Delete everything', 'Tout supprimer')}
          </button>
        )}

        <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 16, lineHeight: 1.4 }}>
          {t('Everything is stored ', 'Tout est stocké ')}<strong>{t('locally', 'localement')}</strong>{t(' in your browser. Clearing a cache deletes nothing online — a model just re-downloads on its next load.', ' dans ton navigateur. Vider un cache n’efface rien en ligne — un modèle se re-télécharge au prochain chargement.')}
        </div>
      </div>
    </div>
  );
}
