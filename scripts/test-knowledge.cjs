// Tests des documents de connaissance du SDK — découpage et sélection, sans navigateur.
// Ces fonctions décident CE QUE LE MODÈLE VOIT : une sélection qui rate le bon passage produit un
// « je ne sais pas » sur une information pourtant fournie, et une sélection trop large noie un 230M.
// npm run test:knowledge
const { execFileSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

const OUT = path.join(__dirname, '..', '.brik-build', 'kn');
fs.mkdirSync(OUT, { recursive: true });
execFileSync('npx', ['tsc', path.join(__dirname, '..', 'src', 'sdk', 'knowledge.ts'),
  '--outDir', OUT, '--module', 'commonjs', '--target', 'es2022', '--moduleResolution', 'node', '--skipLibCheck'],
  { stdio: 'inherit' });
const K = require(path.join(OUT, 'knowledge.js'));

let ok = 0, ko = 0;
const check = (c, m) => { c ? ok++ : ko++; console.log(`${c ? '  ok  ' : '  FAIL'} ${m}`); };

// ── Le corpus d'une vraie boutique : c'est le cas d'usage du widget. ──────────────────────────
const DOCS = [
  { title: 'Horaires', text: 'La boutique est ouverte du mardi au samedi, de 10h à 19h.\n\nNous sommes fermés le dimanche et le lundi, ainsi que les jours fériés.' },
  { title: 'Livraison', text: 'La livraison est gratuite en France dès 60 euros d’achat.\n\nComptez 2 à 4 jours ouvrés. Nous expédions aussi en Belgique et en Suisse, avec un supplément de 8 euros.' },
  { title: 'Retours', text: 'Vous disposez de 30 jours pour retourner un article non porté, dans son emballage d’origine. Le remboursement intervient sous 5 jours après réception.' },
];

// ── Découpage ─────────────────────────────────────────────────────────────────────────────────
const chunks = K.chunkDocuments(DOCS, 200);
// À 200 caractères, chaque document tient en UN passage (ses paragraphes sont courts) : c'est le
// comportement voulu — on ne découpe pas pour découper, un document court reste entier.
check(chunks.length === 3, `découpage à 200 car. : ${chunks.length} passages (1 par document, ils sont courts)`);
const fins = K.chunkDocuments(DOCS, 80);
check(fins.length > chunks.length, `découpage à 80 car. : ${fins.length} passages — le seuil coupe bien aux paragraphes`);
check(fins.every((c) => !/^\s*[a-zà-ÿ]/.test(c.text)), 'aucun passage ne commence au milieu d’une phrase');
check(chunks.every((c) => c.text.length <= 400), 'aucun passage démesuré');
check(chunks.every((c) => c.title), 'chaque passage garde le titre de son document');
check(new Set(chunks.map((c) => c.doc)).size === 3, 'les trois documents sont représentés');

// Un paragraphe très long doit être coupé aux FINS DE PHRASE, pas au milieu d'un mot.
const long = K.chunkDocuments([{ title: 'Long', text: 'Phrase une. '.repeat(60) }], 200);
check(long.length > 1, `paragraphe long découpé en ${long.length} passages`);
check(long.every((c) => /[.!?]$/.test(c.text.trim())), 'chaque passage se termine sur une fin de phrase');

// ── Sélection ─────────────────────────────────────────────────────────────────────────────────
const cas = [
  ['Quels sont vos horaires le dimanche ?', 'Horaires', /dimanche|ferm/i],
  ['Est-ce que la livraison est gratuite ?', 'Livraison', /gratuite|60/i],
  ['Combien de jours pour retourner un article ?', 'Retours', /30 jours/i],
  ['Vous livrez en Suisse ?', 'Livraison', /suisse/i],
];
for (const [q, titreAttendu, motif] of cas) {
  const sel = K.selectChunks(q, chunks);
  const bon = sel.length > 0 && sel[0].title === titreAttendu && motif.test(sel[0].text);
  check(bon, `« ${q} » → ${sel.length ? `[${sel[0].title}] ${sel[0].text.slice(0, 44)}…` : 'AUCUN passage'}`);
}

// Hors sujet : mieux vaut ZÉRO passage qu'un passage au hasard (le modèle dira qu'il ne sait pas).
for (const q of ['Quelle est la capitale du Pérou ?', 'Raconte-moi une blague']) {
  const sel = K.selectChunks(q, chunks);
  check(sel.length === 0, `hors sujet « ${q} » → ${sel.length} passage(s) retenu(s)`);
}

// Budget : la sélection ne doit jamais dépasser ce qu'on lui accorde.
const gros = K.chunkDocuments([{ title: 'Gros', text: Array.from({ length: 30 }, (_, i) => `Paragraphe ${i} sur la livraison gratuite en France.`).join('\n\n') }], 300);
const selBudget = K.selectChunks('livraison gratuite France', gros, 400);
check(selBudget.reduce((s, c) => s + c.text.length, 0) <= 400, `budget respecté : ${selBudget.reduce((s, c) => s + c.text.length, 0)} caractères sur 400`);

// Diversité : deux documents pertinents doivent tous deux être représentés.
const mix = K.selectChunks('livraison et retours', chunks, 2000, 3, 0.2);
check(new Set(mix.map((c) => c.doc)).size >= 2, `diversité : ${new Set(mix.map((c) => c.doc)).size} documents distincts dans la sélection`);

// ── Le bloc injecté ───────────────────────────────────────────────────────────────────────────
const bloc = K.buildKnowledgeBlock(K.selectChunks('horaires le dimanche', chunks));
check(/ONLY the reference notes/.test(bloc), 'la consigne « uniquement à partir des notes » est présente');
check(/dimanche/i.test(bloc), 'le passage pertinent est bien dans le bloc');
const vide = K.buildKnowledgeBlock([]);
check(/do not have this information/i.test(vide), 'aucun passage → consigne de dire qu’on ne sait pas');

// ── Entrées mal formées : un intégrateur passe ce qu'il veut. ─────────────────────────────────
check(K.normalizeDocs('texte simple').length === 1, 'une chaîne devient un document');
check(K.normalizeDocs(['a', { title: 'T', text: 'b' }, null, 42, { text: '  ' }]).length === 2, 'les entrées vides ou invalides sont ignorées');

console.log(`\n${ok}/${ok + ko} assertions OK`);
process.exit(ko ? 1 : 0);
