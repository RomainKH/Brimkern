"use client";

// Lien « retour » qui revient VRAIMENT d'où l'on vient.
//
// Les pages secondaires portaient un « ← Brimkern » codé en dur vers la racine : arriver dans la doc
// depuis le convertisseur et cliquer « retour » envoyait dans le chat, pas au convertisseur (retour
// Romain). On utilise donc l'historique quand il y a un antécédent DANS le site, et on retombe sur un
// lien normal sinon — cas d'un visiteur qui atterrit directement sur /docs depuis un moteur, où
// `history.back()` le ferait sortir du site.

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useT, useHref } from '@/lib/i18n';
import { navDepth } from '@/lib/navDepth';

export default function BackLink({ fallback = '/chat' }: { fallback?: string }) {
  const t = useT();
  const href = useHref();
  const router = useRouter();
  // `document.referrer` n'est lisible qu'au montage côté client : rendu identique au serveur d'abord
  // (un simple lien), puis enrichi — pas de désaccord d'hydratation.
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    let active = true;
    // Microtask : un setState synchrone dans le corps d'un effet déclenche une cascade de rendus
    // (règle react-hooks/set-state-in-effect). Le premier rendu reste le lien simple, ce qui est
    // exactement le repli voulu.
    Promise.resolve().then(() => {
      if (!active) return;
      try {
        // Deux signaux, parce qu'aucun ne couvre les deux cas :
        //  • navDepth > 1 → on a navigué DANS l'app (SPA) ; `document.referrer`, lui, n'est jamais
        //    mis à jour par une navigation client, et c'est pourtant le parcours le plus courant
        //    (hub → convertisseur : le retour renvoyait sur /chat au lieu du hub) ;
        //  • référent de même origine → on est arrivé par un vrai chargement depuis le site.
        const interne = navDepth() > 1;
        const sameSite = !!document.referrer && new URL(document.referrer).origin === window.location.origin;
        if ((interne || sameSite) && window.history.length > 1) setCanGoBack(true);
      } catch { /* referrer opaque */ }
    });
    return () => { active = false; };
  }, []);

  // Libellé volontairement SOBRE. /convert et /changelog annonçaient « ← Retour à l'application » :
  // la promesse était fausse dès qu'on arrivait depuis le hub /docs, où le retour ramène — à juste
  // titre — au hub. Un libellé doit décrire ce qui se passe, et la destination dépend d'où l'on vient.
  const texte = `← ${t('Back', 'Retour')}`;
  const style: React.CSSProperties = {
    color: 'var(--accent-text)', textDecoration: 'none', fontSize: 14, fontWeight: 500,
    background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit',
  };

  return canGoBack
    ? <button onClick={() => router.back()} style={style}>{texte}</button>
    : <Link href={href(fallback)} style={style}>{texte}</Link>;
}
