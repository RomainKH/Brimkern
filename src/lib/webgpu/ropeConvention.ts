// Quelle CONVENTION D'APPARIEMENT le RoPE d'une architecture utilise — le seul endroit où cette
// règle est écrite.
//
// Deux familles coexistent dans la nature :
//   * rotate_half (Hugging Face) : la dimension i tourne avec i + headDim/2. Qwen, Gemma, Phi…
//   * paires ADJACENTES (ggml, LLAMA_ROPE_TYPE_NORM) : 2i tourne avec 2i+1. llama, mistral, smollm3.
// C'est une propriété de l'ARCHITECTURE, pas du conteneur : le même modèle en GGUF ou en .brik la
// porte à l'identique. D'où ce module feuille (aucune dépendance), importé par le parser GGUF ET par
// le loader BRIK — quand la règle vivait dans le seul parser GGUF, un .brik de ces archs perdait
// l'information en route et retombait sur la dé-permutation des lignes Q/K, qui est justement
// impossible sur un layout quantifié SoA.
export function ropeInterleavedFor(arch: string): boolean {
	return arch === 'llama' || arch === 'mistral3' || arch === 'smollm3';
}
