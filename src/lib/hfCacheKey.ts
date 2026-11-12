// Clé de cache d'une URL de modèle du Hub — module SANS dépendance (importé par le moteur, le SDK,
// l'éviction et l'UI ; bin/brimkern.mjs en garde une copie, cf. SAME_AS_MAIN_2026_11_12 là-bas).
//
// Le 2026-11-12, les presets GGUF tiers sont passés de `/resolve/main/` à un SHA de commit (intégrité :
// un dépôt tiers ne peut plus changer le fichier sous nos pieds). Mais le cache par plages est indexé
// par l'URL : sans alias, chaque preset déjà téléchargé serait devenu « absent » — retéléchargé, et
// l'ancienne copie laissée en orphelin jusqu'à l'éviction à 30 jours.
//
// Les révisions ci-dessous servaient, le jour de l'épinglage, EXACTEMENT le même fichier que `main`
// (etag comparé pour chacune) : leurs plages restent donc rangées sous l'ancienne clé `/resolve/main/`.
// ⚠️ Liste FIGÉE, à ne jamais compléter. Un ré-épinglage ultérieur porte un SHA neuf, absent d'ici :
// il télécharge sous sa propre clé, et aucune plage d'une autre révision n'est servie en silence.
// C'est aussi pourquoi l'alias ne vaut pas pour une URL `/resolve/<rev>/` collée par l'utilisateur.
const SAME_AS_MAIN_2026_11_12 = new Set([
	'067b946cf014b7c697f3654f621d577a3e3afd1c', // bartowski/Llama-3.2-1B-Instruct-GGUF
	'0a9035302dea19872c96076896304552890a73c2', // bartowski/mistralai_Ministral-3-3B-Instruct-2512-GGUF
	'1f2362bff662708edca4836deda762da0c046dd0', // jica98/qwen3.5-4B-super-coder
	'23749fefcc72300e3a2ad315e1317431b06b590a', // Qwen/Qwen3-0.6B-GGUF
	'260dffbddaba1f7edb30f823118247e477fc8877', // anik-jha/Qwen3.6-35B-A3B-coding-reap50-GGUF
	'361004151d4f4f6b446dc5e6d46fbf4422a80d5f', // bartowski/DeepSeek-R1-Distill-Qwen-7B-GGUF
	'855f67caed130e1befc571b52bd181be2e858883', // bartowski/gemma-2-2b-it-GGUF
	'86b3536ed1ca0dcb4716745642db4e6804bf3d32', // bartowski/HuggingFaceTB_SmolLM3-3B-GGUF
	'91cad51170dc346986eccefdc2dd33a9da36ead9', // Qwen/Qwen2.5-1.5B-Instruct-GGUF
	'9217f5db79a29953eb74d5343926648285ec7e67', // Qwen/Qwen2.5-0.5B-Instruct-GGUF
	'9cc28b17e86fa2415fcb070f8ee5ec27c965aa61', // bartowski/DeepSeek-R1-Distill-Qwen-1.5B-GGUF
	'c90975dbd40c0c7b275fefaae758c3415c906238', // unsloth/gemma-3-270m-it-GGUF
	'd342b33b2ce2f54e9a24cd062bcc9ff37326c4db', // ryzdfm/qwen2.5-coder-3b-claude_opus_4.6-distilled
	'ebb2015119c907b064c512bf053e945850b5875f', // Qwen/Qwen2.5-Coder-0.5B-Instruct-GGUF
	'f86cb2c1fa58255f8052cc32aeede1b7482d4361', // Qwen/Qwen2.5-Coder-1.5B-Instruct-GGUF
]);

const HF_REV = /^(https:\/\/huggingface\.co\/[^/]+\/[^/]+\/resolve\/)([0-9a-f]{40})\//;

/** L'URL sous laquelle les octets d'un modèle sont rangés en cache (identité hors révisions figées). */
export function cacheUrl(url: string): string {
	const m = HF_REV.exec(url);
	return m && SAME_AS_MAIN_2026_11_12.has(m[2]) ? `${m[1]}main/${url.slice(m[0].length)}` : url;
}
