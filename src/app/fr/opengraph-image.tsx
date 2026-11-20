import { ogCard } from '../og-card';

// La carte de partage des routes /fr : sans elle, un partage de /fr serait annoncé en anglais.
// Même composition que la racine, et le titre de la landing française, mot pour mot.
export const alt = 'Brimkern : des modèles d’IA puissants, directement dans votre navigateur, sur votre GPU';
export { size, contentType } from '../og-card';

export default function OpengraphImageFr() {
  return ogCard({
    h1: 'Des modèles d’IA puissants.',
    h1Accent: 'Directement dans votre navigateur.',
    lede: 'Des modèles open source de Hugging Face, sur votre GPU. Sans serveur, sans abonnement.',
    h1Size: 58,
  });
}
