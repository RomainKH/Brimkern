// Euler discrete scheduler (diffusers EulerDiscreteScheduler), epsilon prediction — the sampler
// SD-Turbo uses for its 1–4 step generation. Pure CPU math (operates on the latent between UNet
// passes). The β schedule + sigmas are the standard SD values; the exact trailing-timestep spacing
// and the VAE latent scaling factor should be reconfirmed against the loaded model.

export interface EulerScheduler {
  sigmas: number[];        // one per step, plus a trailing 0
  timesteps: number[];     // model timestep per step (what the UNet receives)
  initNoiseSigma: number;  // multiply the initial Gaussian latent by this
  scaleModelInput(latent: Float32Array, stepIdx: number): Float32Array;
  step(noisePred: Float32Array, sample: Float32Array, stepIdx: number): Float32Array;
}

export function makeEulerScheduler(numSteps: number, numTrain = 1000, betaStart = 0.00085, betaEnd = 0.012, betaSchedule: 'scaled_linear' | 'linear' = 'scaled_linear'): EulerScheduler {
  // β schedule : scaled_linear (SD, défaut) = (linspace(√βstart, √βend))² ; linear (AnimateDiff /
  // Lightning, cf. l'oracle diffusers du chantier vidéo) = linspace(βstart, βend) direct.
  const bs = Math.sqrt(betaStart), be = Math.sqrt(betaEnd);
  const alphasCumprod: number[] = [];
  let acc = 1;
  for (let i = 0; i < numTrain; i++) {
    const b = betaSchedule === 'linear'
      ? betaStart + (betaEnd - betaStart) * (i / (numTrain - 1))
      : (bs + (be - bs) * (i / (numTrain - 1))) ** 2;
    acc *= 1 - b;
    alphasCumprod.push(acc);
  }
  const allSigmas = alphasCumprod.map((ac) => Math.sqrt((1 - ac) / ac));

  // "trailing" timestep spacing (SD-Turbo default): evenly spaced ending at the last index.
  const stepRatio = numTrain / numSteps;
  const timesteps: number[] = [];
  for (let i = 0; i < numSteps; i++) timesteps.push(Math.max(0, Math.round(numTrain - 1 - i * stepRatio)));
  const sigmas = timesteps.map((t) => allSigmas[t]);
  sigmas.push(0); // final sigma → fully denoised
  const initNoiseSigma = Math.max(...sigmas);

  return {
    sigmas,
    timesteps,
    initNoiseSigma,
    // The UNet sees the latent scaled by 1/√(σ²+1).
    scaleModelInput(latent, i) {
      const d = 1 / Math.sqrt(sigmas[i] * sigmas[i] + 1);
      const o = new Float32Array(latent.length);
      for (let k = 0; k < latent.length; k++) o[k] = latent[k] * d;
      return o;
    },
    // Euler step (epsilon): x0 = sample − σ·ε ; next = sample + ε·(σ_next − σ). For the last step
    // σ_next = 0, so next = x0 (fully denoised).
    step(noisePred, sample, i) {
      const s = sigmas[i], sNext = sigmas[i + 1];
      const o = new Float32Array(sample.length);
      for (let k = 0; k < sample.length; k++) o[k] = sample[k] + noisePred[k] * (sNext - s);
      return o;
    },
  };
}

// Box–Muller Gaussian noise, seeded (mulberry32) so a prompt+seed reproduces the same latent.
export function randnSeeded(n: number, seed: number): Float32Array {
  let a = seed >>> 0;
  const rng = () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const o = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const u1 = Math.max(1e-7, rng()), u2 = rng();
    o[i] = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }
  return o;
}
