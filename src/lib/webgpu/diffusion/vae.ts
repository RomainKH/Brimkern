// DÉCODEUR VAE COMPLET (AutoencoderKL de Stable Diffusion) — l'alternative de qualité à TAESD.
//
// POURQUOI. TAESD est un décodeur DISTILLÉ minuscule (~2,4 M de paramètres contre ~50 M ici) : il
// rend une image plausible en une fraction du calcul, mais il adoucit tout. Une fois la résolution
// remise à 512 (le 2026-08-19 : sous sa taille d'entraînement le modèle ne compose plus), c'est LUI
// qui plafonne la netteté. Ce module est le vrai décodeur, celui avec lequel les poids ont été
// entraînés.
//
// CE QUI EST NOUVEAU : rien, côté kernels. Tout le décodeur se compose de primitives déjà écrites et
// validées — conv2d 3×3 et 1×1, group_norm, silu, attention_full, upsample_nearest, add. C'est
// exactement ce qui rendait ce chantier moins cher qu'un changement de modèle.
//
// LE COÛT, ET IL EST RÉEL : à 512² les activations montent à 256 canaux × 512 × 512, soit 268 Mo
// pour un seul tenseur (d'où la chaîne d'échange ci-dessous, qui ne garde jamais plus de deux
// activations vivantes) et un besoin de `maxStorageBufferBindingSize` supérieur au défaut WebGPU de
// 128 Mo. Le moteur demande déjà le maximum de l'adaptateur, ce qui passe sur un GPU « high » ; sur
// un GPU modeste, il faut rester sur TAESD.
//
// Poids : safetensors fp16 du dépôt du modèle, quantifiés en int8 SUR LE GPU au chargement (même
// chemin que le UNet safetensors). Les tenseurs dont le nombre d'éléments n'est pas multiple de 32
// (la taille de groupe de q8web) restent en f32 : ce sont les tout petits, leur poids est nul.
import { WebGpuEngine } from '../kernels';
import { paceSleep } from './unet';
import type { SafeTensor } from '../../safetensors';

type GpuBuf = ReturnType<WebGpuEngine['uploadGpu']>;
type Q8 = ReturnType<WebGpuEngine['quantizeQ8Gpu']>;
export interface FMap { data: Float32Array; C: number; H: number; W: number }

// Le facteur d'échelle des latents SD : le UNet travaille sur `z · 0.18215`, le décodeur attend `z`.
// TAESD, lui, prend le latent brut — c'est la différence de convention qui ferait sortir une image
// saturée si on branchait ce module sans diviser.
const LATENT_SCALE = 0.18215;
const GROUPS = 32;
const EPS = 1e-6; // convention diffusers pour le VAE (le UNet est en 1e-5)

export class VaeDecoder {
  private e: WebGpuEngine;
  private w: Map<string, SafeTensor>;
  private q8 = new Map<string, Q8>();
  private f32 = new Map<string, GpuBuf>();

  constructor(engine: WebGpuEngine, weights: Map<string, SafeTensor>) {
    this.e = engine;
    this.w = weights;
  }

  private tensor(name: string): SafeTensor {
    const t = this.w.get(name);
    if (!t) throw new Error(`VAE : poids manquant "${name}". Clés dispo : ${[...this.w.keys()].slice(0, 6).join(', ')}…`);
    return t;
  }
  private has(name: string) { return this.w.has(name); }

  // Poids de convolution / de projection, quantifié int8 une fois pour toutes sur le GPU.
  private wq(name: string): Q8 | GpuBuf {
    const cached = this.q8.get(name);
    if (cached) return cached;
    const t = this.tensor(name);
    const n = (t.shape ?? []).reduce((a, b) => a * b, 1);
    // q8web groupe par 32 : en dessous (ou hors multiple), on garde le f32 — ces tenseurs-là pèsent
    // quelques kilo-octets, les quantifier ne rapporterait rien et compliquerait le dispatch.
    if (n % 32 !== 0) return this.wf(name);
    const q = this.e.quantizeQ8Gpu(t.data as never);
    this.q8.set(name, q);
    return q;
  }
  private wf(name: string): GpuBuf {
    let b = this.f32.get(name);
    if (!b) { b = this.e.uploadGpu(this.tensor(name).data as never); this.f32.set(name, b); }
    return b;
  }

  // ── Briques du décodeur ────────────────────────────────────────────────────────────────────────

  // ResnetBlock2D : norm → silu → conv3×3 → norm → silu → conv3×3, plus le raccourci (conv 1×1
  // seulement quand le nombre de canaux change).
  private resnet(s: any, x: any, p: string, Cin: number, Cout: number, H: number, W: number) {
    const HW = H * W;
    let h = s.silu(s.groupNorm(x, this.wf(`${p}.norm1.weight`), this.wf(`${p}.norm1.bias`), Cin, HW, GROUPS, EPS), Cin * HW);
    h = s.conv2d(h, this.wq(`${p}.conv1.weight`), this.wf(`${p}.conv1.bias`), Cin, H, W, Cout, 3, 3, 1, 1);
    h = s.silu(s.groupNorm(h, this.wf(`${p}.norm2.weight`), this.wf(`${p}.norm2.bias`), Cout, HW, GROUPS, EPS), Cout * HW);
    h = s.conv2d(h, this.wq(`${p}.conv2.weight`), this.wf(`${p}.conv2.bias`), Cout, H, W, Cout, 3, 3, 1, 1);
    const skip = Cin === Cout
      ? x
      : s.conv2d(x, this.wq(`${p}.conv_shortcut.weight`), this.wf(`${p}.conv_shortcut.bias`), Cin, H, W, Cout, 1, 1, 1, 0);
    return s.add(skip, h, Cout * HW);
  }

  // Auto-attention spatiale du bloc central. Les projections sont des Linear dans les exports
  // diffusers récents (`to_q`) et des convs 1×1 dans les anciens (`query`) : on accepte les deux,
  // parce qu'un poids manquant ici ne se verrait qu'à l'exécution, sur un fichier tiers.
  private attention(s: any, x: any, p: string, C: number, H: number, W: number) {
    const HW = H * W;
    const nom = (moderne: string, ancien: string) => (this.has(`${p}.${moderne}.weight`) ? `${p}.${moderne}` : `${p}.${ancien}`);
    const q_ = nom('to_q', 'query'), k_ = nom('to_k', 'key'), v_ = nom('to_v', 'value'), o_ = nom('to_out.0', 'proj_attn');
    const h = s.groupNorm(x, this.wf(`${p}.group_norm.weight`), this.wf(`${p}.group_norm.bias`), C, HW, GROUPS, EPS);
    // [C, HW] → [HW, C] : l'attention et les projections travaillent par POSITION, la convolution
    // par canal. C'est la seule transposition du décodeur.
    const t = s.transpose(h, C, HW);
    const proj = (nom2: string) => s.addBias(s.matmulT(t, this.wq(`${nom2}.weight`), HW, C, C), this.wf(`${nom2}.bias`), HW, C);
    const a = s.attentionFull(proj(q_), proj(k_), proj(v_), HW, 1, 1, C, HW);
    const o = s.addBias(s.matmulT(a, this.wq(`${o_}.weight`), HW, C, C), this.wf(`${o_}.bias`), HW, C);
    return s.add(x, s.transpose(o, HW, C), C * HW);
  }

  // ── Le décodeur ───────────────────────────────────────────────────────────────────────────────
  // `latent` : [4, h, w] tel que le scheduler le rend (donc À DIVISER par LATENT_SCALE).
  // Rend [3, 8h, 8w] dans ~[0,1], comme TAESD, pour que l'appelant soit interchangeable.
  async decode(latent: Float32Array, h: number, w: number, duty?: number, onStep?: (frac: number) => void): Promise<FMap> {
    const e = this.e;
    const z = new Float32Array(latent.length);
    for (let i = 0; i < latent.length; i++) z[i] = latent[i] / LATENT_SCALE;

    let H = h, W = w;
    let lastIdle = performance.now();
    const pace = duty !== undefined && duty > 0 && duty < 1;
    // Chaîne d'échange : à 512² une activation pèse jusqu'à 268 Mo, on ne peut pas en accumuler.
    // Chaque étape libère la précédente et paie le duty-cycle thermique, comme TAESD.
    const etape = async (next: any, prev: any): Promise<any> => {
      if (prev) e.releaseGpu([prev]);
      if (pace) lastIdle = await paceSleep(e, lastIdle, { duty });
      return next;
    };

    // Entrée : post_quant_conv (1×1) puis conv_in (3×3) vers 512 canaux.
    let s = e.recordingSession();
    let x = s.conv2d(z, this.wq('post_quant_conv.weight'), this.wf('post_quant_conv.bias'), 4, H, W, 4, 1, 1, 1, 0);
    x = s.conv2d(x, this.wq('decoder.conv_in.weight'), this.wf('decoder.conv_in.bias'), 4, H, W, 512, 3, 3, 1, 1);
    let cur: any = s.finishKeep(x);
    onStep?.(0.05);

    // Bloc central : resnet, attention, resnet — tout à la résolution du latent.
    s = e.recordingSession();
    let m = this.resnet(s, cur, 'decoder.mid_block.resnets.0', 512, 512, H, W);
    m = this.attention(s, m, 'decoder.mid_block.attentions.0', 512, H, W);
    m = this.resnet(s, m, 'decoder.mid_block.resnets.1', 512, 512, H, W);
    cur = await etape(s.finishKeep(m), cur);
    onStep?.(0.2);

    // Les quatre niveaux montants. Canaux : 512, 512, 256, 128 — les trois premiers doublent la
    // résolution après leurs resnets, le dernier ne monte plus (on est déjà en 8×).
    const NIVEAUX: { cin: number; cout: number; up: boolean }[] = [
      { cin: 512, cout: 512, up: true },
      { cin: 512, cout: 512, up: true },
      { cin: 512, cout: 256, up: true },
      { cin: 256, cout: 128, up: false },
    ];
    for (let b = 0; b < NIVEAUX.length; b++) {
      const { cin, cout, up } = NIVEAUX[b];
      for (let r = 0; r < 3; r++) {
        const s2 = e.recordingSession();
        const inC = r === 0 ? cin : cout;
        cur = await etape(s2.finishKeep(this.resnet(s2, cur, `decoder.up_blocks.${b}.resnets.${r}`, inC, cout, H, W)), cur);
      }
      if (up) {
        const s3 = e.recordingSession();
        const u = s3.upsample(cur, cout, H, W, 2);
        H *= 2; W *= 2;
        cur = await etape(s3.finishKeep(s3.conv2d(u, this.wq(`decoder.up_blocks.${b}.upsamplers.0.conv.weight`), this.wf(`decoder.up_blocks.${b}.upsamplers.0.conv.bias`), cout, H, W, cout, 3, 3, 1, 1)), cur);
      }
      onStep?.(0.2 + 0.7 * ((b + 1) / NIVEAUX.length));
    }

    // Sortie : norme, activation, conv 3×3 vers RGB.
    s = e.recordingSession();
    const n = s.silu(s.groupNorm(cur, this.wf('decoder.conv_norm_out.weight'), this.wf('decoder.conv_norm_out.bias'), 128, H * W, GROUPS, EPS), 128 * H * W);
    const rgb = s.conv2d(n, this.wq('decoder.conv_out.weight'), this.wf('decoder.conv_out.bias'), 128, H, W, 3, 3, 3, 1, 1);
    const data = await s.finish(rgb, 3 * H * W);
    e.releaseGpu([cur]);
    onStep?.(1);

    // Le VAE rend [-1, 1] ; TAESD rend [0, 1] et c'est ce qu'attend chwToRGBA. On ramène ici pour
    // que les deux décodeurs soient interchangeables sans que l'appelant ait à le savoir.
    for (let i = 0; i < data.length; i++) data[i] = data[i] * 0.5 + 0.5;
    return { data, C: 3, H, W };
  }

  // Libère les poids résidents (~50 Mo en int8). Le décodeur est mort après.
  unload() {
    const bufs: unknown[] = [];
    for (const q of this.q8.values()) bufs.push(...Object.values(q as Record<string, unknown>));
    for (const b of this.f32.values()) bufs.push(b);
    this.e.releaseGpu(bufs as never);
    this.q8.clear();
    this.f32.clear();
  }
}
