"use client";

// Skills popup: pick which skills are active (multi-select — they compose into the system prompt),
// create/edit/delete custom ones, and import a skill straight from a GitHub (or any raw) URL. The
// active selection lives in the parent (activeIds + onToggle); CRUD/import call onChanged to refresh.

import { useState, useEffect, useCallback } from 'react';
import { X, Plus, Trash2, Pencil, Sparkles, Loader2, Download } from 'lucide-react';
import { listCustomSkills, saveSkill, deleteSkill, BUILTIN_SKILLS, type Skill } from '@/lib/skillStore';
import { useT } from '@/lib/i18n';

// A github.com "/blob/" URL points at an HTML page; rewrite to the raw file host. Raw URLs pass through.
function toRawUrl(u: string): string {
  return u.replace('https://github.com/', 'https://raw.githubusercontent.com/').replace('/blob/', '/');
}

export default function SkillsPanel({ onClose, onChanged, activeIds, onToggle }: {
  onClose: () => void;
  onChanged: () => void;
  activeIds: string[];
  onToggle: (id: string) => void;
}) {
  const t = useT();
  const [custom, setCustom] = useState<Skill[]>([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState('');
  const [importing, setImporting] = useState(false);
  const [importErr, setImportErr] = useState('');

  const load = useCallback(() => listCustomSkills(), []);
  useEffect(() => {
    let active = true;
    load().then((s) => { if (active) setCustom(s); }).catch(() => { /* IndexedDB unavailable */ });
    return () => { active = false; };
  }, [load]);

  const refresh = async () => { setCustom(await load().catch(() => [])); onChanged(); };
  const startNew = () => { setEditId(null); setName(''); setContent(''); };
  const startEdit = (s: Skill) => { setEditId(s.id); setName(s.name); setContent(s.content); };

  const save = async () => {
    if (!name.trim() || !content.trim()) return;
    setBusy(true);
    const id = editId ?? `skill-${Date.now()}`;
    await saveSkill({ id, name: name.trim(), content: content.trim(), updatedAt: Date.now() }).catch(() => {});
    await refresh();
    startNew();
    setBusy(false);
  };
  const remove = async (id: string) => {
    setBusy(true);
    await deleteSkill(id).catch(() => {});
    if (activeIds.includes(id)) onToggle(id); // deselect a deleted skill
    await refresh();
    if (editId === id) startNew();
    setBusy(false);
  };

  const importFromUrl = async () => {
    if (!url.trim()) return;
    setImporting(true); setImportErr('');
    try {
      const raw = toRawUrl(url.trim());
      const res = await fetch(raw);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = (await res.text()).trim();
      if (!text) throw new Error(t('empty file', 'fichier vide'));
      const heading = text.match(/^#\s+(.+)$/m)?.[1];
      const fname = decodeURIComponent(raw.split('/').pop() || 'skill').replace(/\.[a-z0-9]+$/i, '');
      const nm = (heading || fname).slice(0, 40);
      await saveSkill({ id: `skill-${Date.now()}`, name: nm, content: text.slice(0, 4000), updatedAt: Date.now() });
      await refresh();
      setUrl('');
    } catch (e) {
      setImportErr(e instanceof Error ? e.message : String(e));
    }
    setImporting(false);
  };

  const skillRow = (s: Skill, actions: React.ReactNode) => {
    const on = activeIds.includes(s.id);
    return (
      <div key={s.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderTop: '1px solid var(--border-color)' }}>
        <input type="checkbox" checked={on} onChange={() => onToggle(s.id)} style={{ marginTop: 3, flexShrink: 0, cursor: 'pointer', accentColor: 'var(--accent)' }} title={on ? t('Active', 'Actif') : t('Enable', 'Activer')} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: on ? 'var(--accent)' : 'var(--text-primary)' }}>{s.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4, marginTop: 2 }}>{s.content}</div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>{actions}</div>
      </div>
    );
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} className="card" style={{ width: '100%', maxWidth: 560, maxHeight: '85vh', overflowY: 'auto', padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <Sparkles size={20} style={{ color: 'var(--accent)' }} />
          <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 20, flex: 1 }}>Skills</h2>
          <button onClick={onClose} className="circle-btn" style={{ width: 30, height: 30 }} title={t('Close', 'Fermer')}><X size={16} /></button>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '0 0 14px', lineHeight: 1.5 }}>
          {t('Check the skills to apply (they ', 'Coche les skills à appliquer (ils se ')}<strong>{t('combine', 'combinent')}</strong>{t(' into the system prompt). Create your own, or import one from a GitHub URL.', ' dans la consigne système). Crée les tiens, ou importe-en depuis une URL GitHub.')}
        </p>

        {/* Import from GitHub / raw URL */}
        <div className="card" style={{ padding: 14, background: 'var(--bg-sidebar)', marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Download size={14} /> {t('Import from a URL (GitHub…)', 'Importer depuis une URL (GitHub…)')}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              className="input-control"
              placeholder="https://github.com/user/repo/blob/main/skill.md"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') importFromUrl(); }}
            />
            <button className="btn btn-secondary" style={{ fontSize: 12, padding: '7px 12px', flexShrink: 0 }} onClick={importFromUrl} disabled={importing || !url.trim()}>
              {importing ? <Loader2 size={13} className="spin" /> : <Plus size={13} />} {t('Import', 'Importer')}
            </button>
          </div>
          {importErr && <div style={{ fontSize: 11, color: 'var(--error)', marginTop: 6 }}>{t('Import failed:', 'Import échoué :')} {importErr}</div>}
          <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.4 }}>
            {t('Fetches the content of a text/markdown file (the ', "Récupère le contenu d'un fichier texte/markdown (le titre ")}<code>#</code>{t(' heading is used as the name). The repository must be public.', ' sert de nom). Le dépôt doit être public.')}
          </div>
        </div>

        {/* Create / edit form */}
        <div className="card" style={{ padding: 14, background: 'var(--bg-sidebar)' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
            {editId ? t('Edit skill', 'Modifier le skill') : t('New skill', 'Nouveau skill')}
          </div>
          <input className="input-control" placeholder={t('Name (e.g. Proofreader, Math teacher…)', 'Nom (ex. : Relecteur, Prof de maths…)')} value={name} maxLength={40} onChange={(e) => setName(e.target.value)} style={{ marginBottom: 8 }} />
          <textarea className="input-control" placeholder={t('System instruction (e.g. You are a demanding proofreader…)', 'Consigne système (ex. : Tu es un relecteur exigeant…)')} value={content} onChange={(e) => setContent(e.target.value)} rows={3} style={{ resize: 'vertical', fontFamily: 'var(--font-sans)' }} />
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button className="btn btn-primary" style={{ fontSize: 12, padding: '7px 12px' }} onClick={save} disabled={busy || !name.trim() || !content.trim()}>
              {busy ? <Loader2 size={13} className="spin" /> : <Plus size={13} />} {editId ? t('Save', 'Enregistrer') : t('Add', 'Ajouter')}
            </button>
            {editId && <button className="btn btn-secondary" style={{ fontSize: 12, padding: '7px 12px' }} onClick={startNew} disabled={busy}>{t('Cancel', 'Annuler')}</button>}
          </div>
        </div>

        {/* Custom skills */}
        {custom.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div className="section-title" style={{ fontSize: 11, marginBottom: 2 }}>{t('My skills', 'Mes skills')}</div>
            {custom.map((s) => skillRow(s,
              <>
                <button className="circle-btn" style={{ width: 28, height: 28 }} title={t('Edit', 'Modifier')} onClick={() => startEdit(s)} disabled={busy}><Pencil size={13} /></button>
                <button className="btn btn-danger" style={{ fontSize: 11, padding: '5px 8px' }} title={t('Delete', 'Supprimer')} onClick={() => remove(s.id)} disabled={busy}><Trash2 size={13} /></button>
              </>,
            ))}
          </div>
        )}

        {/* Built-ins */}
        <div style={{ marginTop: 16 }}>
          <div className="section-title" style={{ fontSize: 11, marginBottom: 2 }}>{t('Built-in', 'Intégrés')}</div>
          {BUILTIN_SKILLS.map((s) => skillRow(s, <span style={{ fontSize: 10.5, color: 'var(--text-muted)', alignSelf: 'center' }}>{t('default', 'par défaut')}</span>))}
        </div>
      </div>
    </div>
  );
}
