"use client";

// Comptage des PAGES VUES, sans script tiers.
//
// GoatCounter fournit un `count.js` à coller dans le HTML ; on ne le colle pas. Il n'exécute rien
// d'autre qu'un GET d'image vers le même point de collecte — mais il ferait de chaque page une
// requête vers un domaine tiers, sur un produit dont l'argument central est « rien ne sort de votre
// navigateur ». On envoie donc le même signal depuis notre propre code (cf. src/lib/metrics.ts).
//
// Pourquoi un composant : l'App Router ne recharge pas le document à la navigation. Sans effet sur
// le pathname, une visite de cinq pages ne compterait qu'une seule vue — celle du chargement initial.

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageview } from '@/lib/metrics';
import { bumpNavDepth } from '@/lib/navDepth';

export default function PageViews() {
  const pathname = usePathname();
  const params = useSearchParams();

  useEffect(() => {
    // La query fait partie de l'adresse : `/chat?model=…` est une visite différente de `/chat`, et
    // c'est justement celle qui dit qu'un lien Hugging Face a été suivi.
    const q = params?.toString();
    pageview(pathname + (q ? `?${q}` : ''));
    // Ce composant est le seul endroit qui voit TOUS les changements d'URL : il sert donc aussi de
    // compteur de profondeur pour BackLink (cf. src/lib/navDepth.ts), qui ne peut pas se fier au
    // référent dans une SPA.
    bumpNavDepth();
  }, [pathname, params]);

  return null;
}
