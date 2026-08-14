import type { Metadata } from 'next';
import Script from 'next/script';
import { LocaleProvider } from '@/lib/i18n';
import { SITE_URL } from '@/lib/site';

// Segment FRANÇAIS. Tout ce qui vit sous /fr est rendu en français DÈS LE HTML SERVI — c'est le point
// de tout ce chantier : avant, la langue était un état client, donc les moteurs ne voyaient jamais
// que le français à la racine et la version anglaise n'existait pas pour eux.
// Ce LocaleProvider est imbriqué dans celui du layout racine (anglais) : le contexte le plus PROCHE
// gagne, donc /fr/* est français sans toucher au reste de l'arborescence.
export const metadata: Metadata = {
  title: 'Brimkern — Moteur LLM WebGPU 100 % local dans le navigateur',
  description:
    "Exécutez n'importe quel GGUF mono-fichier de Hugging Face directement dans votre navigateur : accélération WebGPU, kernels WGSL maison, sans serveur, sans clé d'API, hors-ligne après le premier chargement.",
  alternates: {
    canonical: `${SITE_URL}/fr`,
    languages: { en: SITE_URL, fr: `${SITE_URL}/fr`, 'x-default': SITE_URL },
  },
  openGraph: {
    title: 'Brimkern — Moteur LLM WebGPU 100 % local',
    description: "Exécutez des modèles GGUF sur VOTRE GPU, dans un onglet. Aucun serveur, aucun envoi de fichier, aucune clé d'API.",
    url: `${SITE_URL}/fr`,
    siteName: 'Brimkern',
    locale: 'fr_FR',
    alternateLocale: ['en_US'],
    type: 'website',
  },
};

export default function FrLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* `<html lang>` ne peut être posé que par le layout RACINE en App Router. On corrige donc
          l'attribut avant le premier paint sur les pages /fr (même procédé que l'initialisation du
          thème). Le CONTENU, lui, est bien en français dans le HTML servi — c'est ce que les moteurs
          indexent — et hreflang déclare formellement la paire de langues. */}
      <Script id="brimkern-lang-fr" strategy="beforeInteractive" dangerouslySetInnerHTML={{
        __html: `try{document.documentElement.lang='fr'}catch(e){}`,
      }} />
      <LocaleProvider initialLocale="fr">{children}</LocaleProvider>
    </>
  );
}
