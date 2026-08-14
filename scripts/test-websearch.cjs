#!/usr/bin/env node
// Déclenchement de la recherche web + pertinence des résultats (src/lib/webSearch.ts) — parties
// PURES, sans réseau. Usage : npm run test:websearch
//
// Le cas fondateur : « sinon ça va ? » lançait une recherche Wikipédia, qui renvoyait un article
// arbitraire (Mark Ruffalo) ensuite injecté dans le prompt — un petit modèle recopiait alors
// « Source : … » en boucle. Deux verrous à tenir : ne pas chercher sur du bavardage, et jeter un
// résultat qui ne recoupe pas la question.
const path = require('path');
const { buildSync } = require('esbuild');

const out = path.join(__dirname, '..', '.brik-build', 'websearch-test.cjs');
buildSync({
  entryPoints: [path.join(__dirname, '..', 'src', 'lib', 'webSearch.ts')],
  bundle: true, format: 'cjs', platform: 'node', outfile: out, logLevel: 'silent',
});
const { shouldSearchWeb, isRelevant } = require(out);

let pass = 0, fail = 0;
const check = (label, got, want) => {
  if (got === want) pass++;
  else { fail++; console.log(`✗ ${label} — attendu ${want}, obtenu ${got}`); }
};

// ── Ne PAS chercher : bavardage, politesses, méta-questions sur l'assistant ──
for (const q of [
  'sinon ça va ?', 'Sinon ça va ?', 'salut', 'Bonjour !', 'coucou toi', 'ça va ?',
  'comment vas-tu ?', 'merci beaucoup', 'ok super', 'au revoir', 'bonne journée',
  'qui es-tu ?', 'que sais-tu faire ?', 'tu es là ?', 'hello', 'thanks a lot', 'test',
]) check(`pas de recherche : ${JSON.stringify(q)}`, shouldSearchWeb(q).search, false);

// Trop court pour porter une question.
check('trop court', shouldSearchWeb('quoi').search, false);
check('vide', shouldSearchWeb('   ').search, false);

// ── Chercher : vraies demandes de connaissance ──
for (const q of [
  'qui a créé Minecraft ?',
  'Quelle est la capitale de l’Australie ?',
  "c'est quoi la photosynthèse",
  'explique la relativité générale',
  'parle-moi de la bataille de Verdun',
  'combien de lunes a Jupiter ?',
  'who invented the telephone?',
  'tell me about the Apollo program',
  'population de Lyon en 2020',
]) check(`recherche : ${JSON.stringify(q)}`, shouldSearchWeb(q).search, true);

// ── Pertinence : le résultat doit recouper la question ──
const ruffalo = { title: 'Mark Ruffalo', url: 'x', extract: "Mark Ruffalo est un acteur américain né en 1967." };
const minecraft = { title: 'Minecraft', url: 'x', extract: 'Minecraft est un jeu vidéo de type bac à sable créé par Markus Persson.' };
check('hors sujet rejeté', isRelevant('qui a créé Minecraft ?', ruffalo), false);
check('sujet accepté', isRelevant('qui a créé Minecraft ?', minecraft), true);
check('accent/casse tolérés', isRelevant('parle-moi de MINECRAFT', minecraft), true);
check('question sans mot porteur rejetée', isRelevant('sinon ça va ?', ruffalo), false);
// Un mot porteur commun suffit, même si le titre diffère.
check('mot porteur suffisant', isRelevant('histoire de la photosynthèse', { title: 'Photosynthèse', url: 'x', extract: 'Processus bioénergétique…' }), true);

console.log(`\n${pass}/${pass + fail} assertions OK${fail ? ' — ÉCHEC' : ''}`);
process.exit(fail ? 1 : 0);
