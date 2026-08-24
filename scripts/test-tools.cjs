// Tests des outils du SDK — détection, exécution, garde-fous, sans navigateur ni modèle.
// Ces fonctions décident CE QUE LE MODÈLE REÇOIT en plus de la question : un outil qui se déclenche
// à tort pollue le prompt d'un 230M, un outil qui casse le tour casse le widget.
// npm run test:tools
const { execFileSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

const OUT = path.join(__dirname, '..', '.brik-build', 'tools');
fs.mkdirSync(OUT, { recursive: true });
// tools.ts importe ../lib/localTools : tsc conserve l'arborescence sous la racine commune (src/).
execFileSync('npx', ['tsc', path.join(__dirname, '..', 'src', 'sdk', 'tools.ts'),
  '--outDir', OUT, '--module', 'commonjs', '--target', 'es2022', '--moduleResolution', 'node', '--skipLibCheck'],
  { stdio: 'inherit' });
const T = require(path.join(OUT, 'sdk', 'tools.js'));

let ok = 0, ko = 0;
const check = (c, m) => { if (c) ok++; else ko++; console.log(`${c ? '  ok  ' : '  FAIL'} ${m}`); };
const run = (fn) => fn().catch((e) => { ko++; console.log(`  FAIL exception : ${e.message}`); });

(async () => {
  // ── normalizeTools : ce que l'intégrateur passe n'est pas notre code ──────────────────────────
  const outil = { name: 'stock', match: /stock/i, run: () => '4 en stock' };
  check(T.normalizeTools(['calc', 'date', outil]).length === 3, 'les deux intégrés + un ToolSpec valide passent');
  check(T.normalizeTools(undefined).length === 0, 'tools absent → aucune erreur, aucun outil');
  check(T.normalizeTools('calc').length === 0, 'une chaîne nue (pas un tableau) est écartée');
  check(T.normalizeTools([{ name: 'x' }, { run: () => '' }, 42, null, 'inconnu']).length === 0,
    'entrées sans match/run, sans name, ou inconnues → écartées sans lever');
  check(T.normalizeTools([{ name: 'f', match: (q) => q.includes('a'), run: () => 'r' }]).length === 1,
    'match peut être un prédicat, pas seulement une regex');

  // ── 'calc' : la détection vient de localTools (déjà testée côté app), on vérifie le câblage ────
  await run(async () => {
    const notes = await T.runTools(['calc'], 'Combien font 12*7 ?', true);
    check(notes.length === 1 && notes[0].name === 'calculatrice' && /12\*7 = 84/.test(notes[0].result),
      `calc fr : « 12*7 » → ${JSON.stringify(notes[0] || null)}`);
  });
  await run(async () => {
    const notes = await T.runTools(['calc'], 'what is (3 + 4) * 2?', false);
    check(notes.length === 1 && notes[0].name === 'calculator' && /= 14/.test(notes[0].result),
      `calc en : « (3 + 4) * 2 » → ${JSON.stringify(notes[0] || null)}`);
  });
  await run(async () => {
    const notes = await T.runTools(['calc'], 'On se voit le 06/07/2026 vers 12:30, ok ?', true);
    check(notes.length === 0, `pas de faux positif sur une date/heure → ${notes.length} note(s)`);
  });

  // ── 'date' : dans le prompt SYSTÈME, pas dans le tour ──────────────────────────────────────────
  check(T.hasDateTool(['calc', 'date']) === true && T.hasDateTool(['calc']) === false, 'hasDateTool');
  const annee = String(new Date().getFullYear());
  check(T.dateSystemLine(true).includes('Date du jour') && T.dateSystemLine(true).includes(annee),
    `dateSystemLine fr porte l'année : ${T.dateSystemLine(true).trim()}`);
  check(T.dateSystemLine(false).includes("Today's date") && T.dateSystemLine(false).includes(annee),
    'dateSystemLine en');
  await run(async () => {
    const notes = await T.runTools(['date'], 'Quel jour sommes-nous ?', true);
    check(notes.length === 1 && notes[0].name === 'date' && notes[0].result.includes(annee),
      `'date' + question de date → note de tour : ${JSON.stringify(notes[0] || null)}`);
  });
  await run(async () => {
    const notes = await T.runTools(['date'], 'What year is it?', false);
    check(notes.length === 1 && notes[0].result.includes(annee), "'date' en : « what year » déclenche la note");
  });
  await run(async () => {
    const notes = await T.runTools(['date'], 'Vous livrez en Suisse ?', true);
    check(notes.length === 0, "'date' + message sans rapport → aucune note (le système suffit)");
  });

  // ── Outils custom : match, exécution asynchrone, et les trois garde-fous ──────────────────────
  await run(async () => {
    const notes = await T.runTools([outil], 'Vous avez du stock ?', true);
    check(notes.length === 1 && notes[0].name === 'stock' && notes[0].result === '4 en stock',
      `outil regex déclenché : ${JSON.stringify(notes[0] || null)}`);
  });
  await run(async () => {
    const notes = await T.runTools([outil], 'Bonjour !', true);
    check(notes.length === 0, 'outil non concerné → non exécuté');
  });
  await run(async () => {
    const async_ = { name: 'commande', match: /commande/i, run: async () => 1234 };
    const notes = await T.runTools([async_], 'Où en est ma commande ?', true);
    check(notes.length === 1 && notes[0].result === '1234', 'run asynchrone + résultat numérique → chaîne');
  });
  await run(async () => {
    const casse = { name: 'boum', match: /.*/, run: () => { throw new Error('panne hôte'); } };
    const suit = { name: 'ok', match: /.*/, run: () => 'présent' };
    const notes = await T.runTools([casse, suit], 'test', true);
    check(notes.length === 1 && notes[0].name === 'ok', 'un outil qui lève est absent, les suivants tournent');
  });
  await run(async () => {
    const vide = { name: 'vide', match: /.*/, run: () => '   ' };
    const notes = await T.runTools([vide], 'test', true);
    check(notes.length === 0, 'résultat vide → aucune note (rien à injecter)');
  });
  await run(async () => {
    const bavard = { name: 'bavard'.repeat(20), match: /.*/, run: () => 'x'.repeat(5000) };
    const notes = await T.runTools([bavard], 'test', true);
    check(notes.length === 1 && notes[0].result.length <= 600 && notes[0].name.length <= 40,
      `résultat borné à 600 car. (${notes[0].result.length}) et nom à 40 (${notes[0].name.length})`);
  });
  await run(async () => {
    const matchCasse = { name: 'm', match: () => { throw new Error('prédicat cassé'); }, run: () => 'r' };
    const notes = await T.runTools([matchCasse], 'test', true);
    check(notes.length === 0, 'un prédicat match qui lève est traité comme une panne d’outil');
  });

  // ── Le bloc injecté : même forme que la calculatrice de l'app (crochets + « tels quels ») ─────
  const bloc = T.formatToolBlock([{ name: 'calculatrice', result: '12*7 = 84' }], true);
  check(/^\[.*tels quels.*12\*7 = 84\]$/.test(bloc), `bloc fr : ${bloc}`);
  const blocEn = T.formatToolBlock([{ name: 'calculator', result: '2+2 = 4' }, { name: 'stock', result: '4 left' }], false);
  check(/^\[.*as-is.*2\+2 = 4.*stock.*4 left\]$/.test(blocEn), `bloc en, deux notes : ${blocEn}`);
  check(T.formatToolBlock([], true) === '', 'aucune note → bloc vide (rien n’entre dans le prompt)');

  console.log(`\n${ok}/${ok + ko} assertions OK`);
  process.exit(ko ? 1 : 0);
})();
