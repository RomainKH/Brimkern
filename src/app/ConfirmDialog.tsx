"use client";

// Confirmation d'une action DESTRUCTRICE, au style du projet — en remplacement de `confirm()`.
//
// Pourquoi ne pas garder `confirm()` : il sort du produit. Le dialogue natif s'affiche avec les
// polices et les couleurs du navigateur, épinglé en haut de la fenêtre, préfixé du nom de domaine —
// au milieu d'une interface qui a un thème sombre, une police de titrage et un seul rouge. Et il
// impose UNE ligne de texte : c'est ce qui avait produit la phrase de « Tout supprimer », où la
// liste de ce qui part, l'irréversibilité et la nuance sur le modèle en mémoire étaient empilées
// dans une seule chaîne. Un vrai dialogue peut les SÉPARER — titre, liste, note — donc dire la même
// chose en se lisant.
//
// Ce que `confirm()` donnait gratuitement et qu'il faut donc réimplémenter, sinon on régresse :
//  * Échap annule, et le clic hors du cadre aussi ;
//  * le focus entre dans le dialogue à l'ouverture et REVIENT à son point de départ à la fermeture ;
//  * la tabulation reste PIÉGÉE dedans (sans quoi on tabule dans la page derrière, qu'un lecteur
//    d'écran continue d'annoncer alors qu'elle est inerte) ;
//  * le bouton par défaut est ANNULER, jamais l'action destructrice — une entrée pressée par réflexe
//    ne doit pas effacer des gigaoctets.

import { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useT } from '@/lib/i18n';

export default function ConfirmDialog({
	title, children, confirmLabel, onConfirm, onCancel,
}: {
	title: string;
	children: React.ReactNode;
	confirmLabel: string;
	onConfirm: () => void;
	onCancel: () => void;
}) {
	const t = useT();
	const carte = useRef<HTMLDivElement | null>(null);
	const annuler = useRef<HTMLButtonElement | null>(null);

	useEffect(() => {
		// Rendre le focus à son point de départ : sans ça, fermer le dialogue laisse le focus sur
		// <body> et la tabulation suivante repart du haut de la page.
		const avant = document.activeElement as HTMLElement | null;
		annuler.current?.focus();
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') { e.stopPropagation(); onCancel(); return; }
			if (e.key !== 'Tab') return;
			const cibles = carte.current?.querySelectorAll<HTMLElement>('button');
			if (!cibles?.length) return;
			const premier = cibles[0], dernier = cibles[cibles.length - 1];
			// Le piège se referme aux deux bords, pas seulement en avant.
			if (e.shiftKey && document.activeElement === premier) { e.preventDefault(); dernier.focus(); }
			else if (!e.shiftKey && document.activeElement === dernier) { e.preventDefault(); premier.focus(); }
		};
		// En phase de CAPTURE : le panneau qui nous contient écoute peut-être Échap pour se fermer
		// lui-même, et annuler une confirmation ne doit pas refermer le panneau au passage.
		document.addEventListener('keydown', onKey, true);
		return () => { document.removeEventListener('keydown', onKey, true); avant?.focus?.(); };
	}, [onCancel]);

	return (
		// zIndex au-dessus du panneau (50) qui nous monte, et `stopPropagation` sur le clic : sans lui,
		// annuler fermerait AUSSI le panneau de stockage, dont le fond écoute le clic pour se fermer.
		<div
			onClick={(e) => { e.stopPropagation(); onCancel(); }}
			style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
		>
			<div
				ref={carte}
				onClick={(e) => e.stopPropagation()}
				className="card"
				role="dialog"
				aria-modal="true"
				aria-labelledby="confirm-titre"
				aria-describedby="confirm-corps"
				style={{ width: '100%', maxWidth: 440, padding: 22 }}
			>
				<div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
					<AlertTriangle size={20} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} aria-hidden />
					<h2 id="confirm-titre" style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 18, lineHeight: 1.25 }}>{title}</h2>
				</div>
				<div id="confirm-corps" style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--text-secondary)' }}>{children}</div>
				<div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
					<button ref={annuler} className="btn" onClick={onCancel}>{t('Cancel', 'Annuler')}</button>
					<button className="btn btn-danger" onClick={onConfirm}>{confirmLabel}</button>
				</div>
			</div>
		</div>
	);
}
