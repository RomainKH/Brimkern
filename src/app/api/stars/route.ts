import { NextResponse } from 'next/server';

// Proxy même-origine pour le compteur d'étoiles GitHub : le navigateur du visiteur n'appelle
// jamais api.github.com directement (zéro fuite d'IP vers un tiers, pas de rate-limit par client).
export const revalidate = 3600;

export async function GET() {
  try {
    const res = await fetch('https://api.github.com/repos/RomainKH/Brimkern', {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'brimkern-site',
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return NextResponse.json({ stars: null }, { status: 200 });
    const data = await res.json();
    const stars = typeof data?.stargazers_count === 'number' ? data.stargazers_count : null;
    return NextResponse.json(
      { stars },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      },
    );
  } catch {
    return NextResponse.json({ stars: null }, { status: 200 });
  }
}
