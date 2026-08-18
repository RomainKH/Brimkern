"use client";

// Page « Diagnostics » : les commutateurs d'URL qui replient chaque optimisation vers son chemin
// simple. Section sortie de l'ancienne page /docs unique (découpage en pages, 2026-08-18).

import { useT } from '@/lib/i18n';
import DocsShell, { Code, P, PageTitle } from '../DocsShell';

export default function DiagnosticsDocClient() {
  const t = useT();

  return (
    <DocsShell>
      <PageTitle title={t('Diagnostics', 'Diagnostics')}>
        {t('Every risky code path has a URL switch that falls back to the slower, simpler one. Handy to check whether an optimization is responsible for something odd: the answer should be identical, only slower.',
           "Chaque chemin de code risqué a un commutateur d'URL qui revient à la version plus lente et plus simple. Pratique pour vérifier si une optimisation est responsable d'un comportement bizarre : la réponse doit être identique, seulement plus lente.")}
      </PageTitle>
      <Code lang="url">{`?gemv=0        ${t('decode matmul → row kernels', 'matmul de décodage → kernels par lignes')}
?f16shared=0   ${t('f16 prefill GEMM → one row per thread', 'GEMM f16 du prefill → une ligne par thread')}
?qshared=0     ${t('q4/q8 prefill GEMM → 4 rows per invocation', 'GEMM q4/q8 du prefill → 4 lignes par invocation')}
?qshared2=0    ${t('q4/q8 prefill GEMM → v1 tiles (32×64)', 'GEMM q4/q8 du prefill → tuiles v1 (32×64)')}
?warmup=0      ${t('no weight warm-up (first message pays it)', 'pas de préchauffe (le 1er message la paye)')}
?ggufstream=0  ${t('GGUF as one download instead of ranges', 'GGUF en un seul téléchargement au lieu de plages')}
?kvq=0         ${t('KV cache in f32 instead of int8', 'cache KV en f32 au lieu de int8')}
?timing=1      ${t('per-stage timing of the forward pass, in the console', 'chronométrage du forward par étape, dans la console')}`}</Code>
      <P>
        {t('Add a switch to the /chat URL, reload, and compare. Several can be combined with &.',
           "Ajoutez un commutateur à l'URL de /chat, rechargez, et comparez. Plusieurs se combinent avec &.")}
      </P>
    </DocsShell>
  );
}
