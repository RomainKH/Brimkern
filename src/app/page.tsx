import LandingClient from './LandingClient';

// La RACINE = la landing (2026-08-13). Elle servait l'application jusqu'ici : voir l'en-tête de
// LandingClient pour le pourquoi, et src/app/ChatApp.tsx pour l'app, désormais montée par /chat.
// Pas de bloc `metadata` ici : la racine hérite de celui du layout (canonical, hreflang, OpenGraph),
// et /fr de celui du layout français — une seule déclaration par langue.
export default function HomePage() {
  return <LandingClient />;
}
