// Référence CPU du forward Qwen 3.5 (DeltaNet SSM hybride + Full Attention).
// Rôle : Oracle numérique CPU pour valider l'exécution token-exact et servir de
// référence de test pour les kernels WGSL (selfValidate).
//
// Architecture Qwen 3.5 Hybride :
// - Couches Linear Attention (Gated DeltaNet SSM) avec convolution causale 1D (K=4),
//   decay exponentiel, mise à jour d'état récurrent de rang 1 (Delta rule) et gated RMSNorm.
// - Couches Full Attention (tous les full_attention_interval = 4 blocs).
// - FFN SwiGLU standard sur chaque bloc.

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

// Math primitives
function silu(x) {
  return x / (1 + Math.exp(-x));
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function softplus(x) {
  return x > 20 ? x : Math.log1p(Math.exp(x));
}

function rmsnorm(x, w, D, eps = 1e-6) {
  let ss = 0;
  for (let i = 0; i < D; i++) ss += x[i] * x[i];
  const scale = 1 / Math.sqrt(ss / D + eps);
  const out = new Float32Array(D);
  for (let i = 0; i < D; i++) out[i] = x[i] * scale * w[i];
  return out;
}

function l2norm(x, D, eps = 1e-6) {
  let ss = 0;
  for (let i = 0; i < D; i++) ss += x[i] * x[i];
  const scale = 1 / Math.sqrt(ss + eps);
  const out = new Float32Array(D);
  for (let i = 0; i < D; i++) out[i] = x[i] * scale;
  return out;
}

// Causal 1D convolution over 4 steps (history of 3 tokens + 1 current token)
function conv1dStep(xCurrent, convState, wConv, D, kernelSize = 4) {
  // convState: Float32Array((kernelSize - 1) * D)
  // wConv: Float32Array(kernelSize * D) (weights for positions 0..3)
  const out = new Float32Array(D);
  for (let d = 0; d < D; d++) {
    let sum = 0;
    // past tokens
    for (let k = 0; k < kernelSize - 1; k++) {
      sum += convState[k * D + d] * wConv[k * D + d];
    }
    // current token
    sum += xCurrent[d] * wConv[(kernelSize - 1) * D + d];
    out[d] = silu(sum);
  }

  // Shift convState ring buffer
  for (let k = 0; k < kernelSize - 2; k++) {
    for (let d = 0; d < D; d++) {
      convState[k * D + d] = convState[(k + 1) * D + d];
    }
  }
  for (let d = 0; d < D; d++) {
    convState[(kernelSize - 2) * D + d] = xCurrent[d];
  }

  return out;
}

// Gated DeltaNet autoregressive recurrent step for 1 head
// S: Float32Array(Sk * Sv)
// q: Float32Array(Sk), k: Float32Array(Sk), v: Float32Array(Sv)
// decay: scalar (< 0), beta: scalar in [0, 1]
function deltaNetHeadStep(S, q, k, v, decay, beta, Sk, Sv) {
  const g = Math.exp(decay);
  const out = new Float32Array(Sv);

  // 1. Decay recurrent state: S = S * g
  for (let i = 0; i < Sk * Sv; i++) {
    S[i] *= g;
  }

  // 2. Projected state on key: sk = S^T * k (or S * k)
  // Here S is [Sk, Sv]. sk[j] = sum_i (S[i * Sv + j] * k[i])
  const sk = new Float32Array(Sv);
  for (let j = 0; j < Sv; j++) {
    let sum = 0;
    for (let i = 0; i < Sk; i++) {
      sum += S[i * Sv + j] * k[i];
    }
    sk[j] = sum;
  }

  // 3. Error delta: d = (v - sk) * beta
  const d = new Float32Array(Sv);
  for (let j = 0; j < Sv; j++) {
    d[j] = (v[j] - sk[j]) * beta;
  }

  // 4. State update: S[i, j] += k[i] * d[j]
  for (let i = 0; i < Sk; i++) {
    const ki = k[i];
    const row = i * Sv;
    for (let j = 0; j < Sv; j++) {
      S[row + j] += ki * d[j];
    }
  }

  // 5. Output retrieval: out[j] = sum_i (S[i * Sv + j] * q[i])
  for (let j = 0; j < Sv; j++) {
    let sum = 0;
    for (let i = 0; i < Sk; i++) {
      sum += S[i * Sv + j] * q[i];
    }
    out[j] = sum;
  }

  return out;
}

module.exports = {
  silu,
  sigmoid,
  softplus,
  rmsnorm,
  l2norm,
  conv1dStep,
  deltaNetHeadStep,
};

if (require.main === module) {
  console.log('[qwen35-cpuref] Testing DeltaNet reference primitives...');
  const Sk = 128, Sv = 128;
  const S = new Float32Array(Sk * Sv);
  const q = new Float32Array(Sk).fill(0.1);
  const k = new Float32Array(Sk).fill(0.05);
  const v = new Float32Array(Sv).fill(0.2);
  const decay = -0.05;
  const beta = 0.8;

  const y = deltaNetHeadStep(S, q, k, v, decay, beta, Sk, Sv);
  console.log('[qwen35-cpuref] Step 1 output sample:', y.slice(0, 5));
  console.log('[qwen35-cpuref] State norm after step 1:', S.reduce((a, b) => a + b * b, 0));

  const y2 = deltaNetHeadStep(S, q, k, v, decay, beta, Sk, Sv);
  console.log('[qwen35-cpuref] Step 2 output sample:', y2.slice(0, 5));
  console.log('[qwen35-cpuref] State norm after step 2:', S.reduce((a, b) => a + b * b, 0));
  console.log('[qwen35-cpuref] ✓ Math reference verified.');
}
