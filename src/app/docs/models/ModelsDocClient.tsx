"use client";

// Page « Modèles & format .brik » : tout ce qui concerne CE QU'ON CHARGE — n'importe quel GGUF de
// Hugging Face, les liens de test instantané, et le format .brik avec son convertisseur. Sections
// sorties de l'ancienne page /docs unique (découpage en pages, retour Romain du 2026-08-18).

import Link from 'next/link';
import { useT, useHref } from '@/lib/i18n';
import DocsShell, { Code, P, PageTitle, Section } from '../DocsShell';
import { SITE_URL } from '@/lib/site';

export default function ModelsDocClient() {
  const t = useT();
  const href = useHref();

  const toc: { id: string; label: string }[] = [
    { id: 'any-model', label: t('Run any Hugging Face model', "N'importe quel modèle Hugging Face") },
    { id: 'links', label: t('Instant test links', 'Liens de test instantané') },
    { id: 'brik', label: t('The .brik format & converter', 'Le format .brik & le convertisseur') },
  ];

  return (
    <DocsShell toc={toc}>
      <PageTitle title={t('Models & the .brik format', 'Modèles & format .brik')}>
        {t('What the engine loads and how: single-file GGUF straight from Hugging Face, shareable test links, and the .brik streaming format with its in-browser converter.',
           "Ce que le moteur charge et comment : les GGUF mono-fichier directement depuis Hugging Face, les liens de test partageables, et le format streamé .brik avec son convertisseur intégré.")}
      </PageTitle>

      <Section id="any-model" title={t('Run any Hugging Face model', "N'importe quel modèle Hugging Face")}>
        <P>
          {t('Brimkern reads single-file GGUF directly: the format the Hub already hosts, with no conversion or compilation step. Paste any of these into the field on the home screen (or in the model browser):',
             "Brimkern lit directement les GGUF mono-fichier : le format que le Hub héberge déjà, sans étape de conversion ni de compilation. Collez n'importe laquelle de ces formes dans le champ de l'accueil (ou du navigateur de modèles) :")}
        </P>
        <Code>{`Qwen/Qwen3-0.6B-GGUF
https://huggingface.co/Qwen/Qwen3-0.6B-GGUF
https://huggingface.co/Qwen/Qwen3-0.6B-GGUF/blob/main/Qwen3-0.6B-Q8_0.gguf
https://example.com/my-model.gguf`}</Code>
        <P>
          {t('The best quantization is picked for you (Q4_K_M first, then Q4_K_S, Q5, Q8…), and the tokenizer follows the file: nothing to configure. Sharded GGUFs (-00001-of-0000N) and vision projectors (mmproj) are refused with an explicit message rather than half-loaded.',
             "La meilleure quantification est choisie pour vous (Q4_K_M d'abord, puis Q4_K_S, Q5, Q8…), et le tokenizer suit le fichier : rien à régler. Les GGUF shardés (-00001-of-0000N) et les projecteurs vision (mmproj) sont refusés avec un message explicite plutôt que chargés à moitié.")}
        </P>
      </Section>

      <Section id="links" title={t('Instant test links', 'Liens de test instantané')}>
        <P>
          {t('Any model can be turned into a link that loads it directly: handy to share a demo, to file a bug report, or to point a colleague at an exact quantization.',
             "N'importe quel modèle peut devenir un lien qui le charge directement : pratique pour partager une démo, joindre un rapport de bug, ou renvoyer un collègue vers une quantification précise.")}
        </P>
        <Code>{`${SITE_URL}/chat?model=Qwen/Qwen3-0.6B-GGUF
${SITE_URL}/chat?model=Qwen/Qwen3-0.6B-GGUF&file=Qwen3-0.6B-Q8_0.gguf
${SITE_URL}/chat?gguf=https://example.com/model.gguf
${SITE_URL}/chat?brik=https://example.com/model.brik`}</Code>
        <P>
          <code>?model=</code>{t(' resolves the repository through the Hub API and picks the best loadable file (a .brik wins over a GGUF). ', " interroge l'API du Hub et choisit le meilleur fichier chargeable (un .brik gagne sur un GGUF). ")}
          <code>?file=</code>{t(' forces one exact quantization. ', ' force une quantification précise. ')}
          <code>?gguf=</code>{t(' and ', ' et ')}<code>?brik=</code>{t(' take a direct URL, for models you host yourself.',
            " prennent une URL directe, pour les modèles que vous hébergez vous-même.")}
        </P>
      </Section>

      <Section id="brik" title={t('The .brik format & converter', 'Le format .brik & le convertisseur')}>
        <P>
          {t('A .brik is a GGUF re-packaged for the browser: weights already quantized to int4/int8, laid out so each layer is one contiguous HTTP range, with the tokenizer embedded. The practical effect: the model loads by ranges (resumable, partially, genuinely offline afterwards) instead of as one multi-gigabyte download.',
             "Un .brik est un GGUF ré-empaqueté pour le navigateur : poids déjà quantifiés en int4/int8, disposés pour qu'une couche soit une seule plage HTTP contiguë, tokenizer embarqué. Effet concret : le modèle se charge par plages (reprise possible, partiellement, vraiment hors-ligne ensuite) au lieu d'un téléchargement de plusieurs gigaoctets.")}
        </P>
        <P>
          {t('You can convert a GGUF yourself, in the browser. The file never leaves your machine: ', "Vous pouvez convertir un GGUF vous-même, dans le navigateur. Le fichier ne quitte jamais votre machine : ")}
          <Link href={href('/convert')} style={{ color: 'var(--accent-text)' }}>{t('open the converter', 'ouvrir le convertisseur')}</Link>.
        </P>
      </Section>
    </DocsShell>
  );
}
