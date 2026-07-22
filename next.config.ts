import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Badge « N » Next.js en bas de l'écran en mode dev : masqué (il n'apparaît jamais en prod,
  // mais pas de marque tierce à l'écran, même en dev). Les erreurs de compil restent affichées.
  devIndicators: false,
  async headers() {
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
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
