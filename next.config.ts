import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Badge « N » Next.js en bas de l'écran en mode dev : masqué (il n'apparaît jamais en prod,
  // mais pas de marque tierce à l'écran, même en dev). Les erreurs de compil restent affichées.
  devIndicators: false,
  // URL propres : la démo du SDK est un fichier STATIQUE (public/sdk-demo.html) — elle doit
  // s'ouvrir sur /sdk-demo, sans extension. Une réécriture sert le fichier tel quel (rien à
  // dupliquer en route React), et /sdk-demo.html redirige en 308 vers l'URL canonique pour que les
  // liens déjà publiés continuent de marcher sans créer deux URL pour la même page (SEO).
  //
  // La démo est BILINGUE et suit la convention du site (cf. src/lib/i18n.tsx) : `/sdk-demo` sert
  // l'anglais canonique, `/fr/sdk-demo` le français. Comme le fichier est statique, il ne peut pas
  // hériter du segment `/fr` d'une route React : les deux URL pointent sur LE MÊME fichier, qui
  // choisit sa langue depuis son URL (chemin `/fr`, ou `?lang=` en surcharge explicite). Le tableau
  // retourné est vérifié APRÈS le système de fichiers (« afterFiles »), donc aucune route de
  // src/app/fr n'est masquée par cette entrée.
  async rewrites() {
    return [
      { source: '/sdk-demo', destination: '/sdk-demo.html' },
      { source: '/fr/sdk-demo', destination: '/sdk-demo.html' },
    ];
  },
  async redirects() {
    return [
      { source: '/sdk-demo.html', destination: '/sdk-demo', permanent: true },
      { source: '/fr/sdk-demo.html', destination: '/fr/sdk-demo', permanent: true },
    ];
  },
  async headers() {
    // CORS ouvert (*) réservé aux assets faits pour être consommés par d'autres origines
    // (SDK embarquable, modèles, wasm) — plus de wildcard global : une future route API ne
    // deviendrait pas lisible par n'importe quel site par accident. CORP `cross-origin` sur ces
    // mêmes assets pour rester chargeables depuis un site hôte qui active COEP.
    const sharedAsset = [
      { key: "Access-Control-Allow-Origin", value: "*" },
      { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
    ];
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          // Anti-clickjacking : aucune page du site n'a besoin d'être iframée (le SDK est une
          // balise <script> chez l'hôte, pas une iframe).
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'none'",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },
      { source: "/sdk.js", headers: sharedAsset },
      { source: "/models/:path*", headers: sharedAsset },
      { source: "/wasm/:path*", headers: sharedAsset },
    ];
  },
};

export default nextConfig;
