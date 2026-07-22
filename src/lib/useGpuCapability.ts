"use client";

// Read-only GPU sensor for the model picker: probes the WebGPU adapter (once, without creating a
// device or loading a model) to estimate which models are realistic on THIS machine. WebGPU exposes
// no VRAM API, so we derive a coarse budget from maxStorageBufferBindingSize (the same proxy the
// engine's pickAutoPrecision already uses — a large binding cap ≈ a capable discrete GPU) plus the
// shader-f16 feature. Everything here is an ESTIMATE, surfaced non-intrusively (never blocks a load).

import { useState, useEffect } from 'react';
import { pickAutoPrecision } from './modelCatalog';

export type GpuTier = 'high' | 'modest' | 'unknown';

export interface GpuCapability {
  probed: boolean;            // has the async adapter probe finished?
  supported: boolean;         // navigator.gpu present + an adapter was obtained
  maxBindBytes: number;       // maxStorageBufferBindingSize (VRAM-capability proxy)
  hasF16: boolean;            // 'shader-f16' feature
  budgetGB: number;           // rough usable-VRAM budget (heuristic — see note above)
  tier: GpuTier;
  adapterInfo: string | null; // vendor/architecture/description when the browser exposes it
}

interface AdapterLike {
  limits?: { maxStorageBufferBindingSize?: number; maxBufferSize?: number };
  features?: { has(f: string): boolean };
  info?: { vendor?: string; architecture?: string; description?: string; device?: string };
  requestAdapterInfo?: () => Promise<{ vendor?: string; architecture?: string; description?: string }>;
}

const INITIAL: GpuCapability = {
  probed: false, supported: false, maxBindBytes: 0, hasF16: false, budgetGB: 0, tier: 'unknown', adapterInfo: null,
};

// Heuristic total-VRAM budget from the binding cap (no real VRAM API). Discrete GPUs report a large
// maxStorageBufferBindingSize (up to ~2 GB); integrated/mobile report much less. Deliberately
// conservative so a "runs well" verdict is trustworthy.
function budgetFromCap(maxBind: number, isMobile: boolean): number {
  if (isMobile) return 1.5;
  if (maxBind >= 1.5e9) return 8;
  if (maxBind >= 1e9) return 5;
  return 3;
}

export function useGpuCapability(isMobile: boolean): GpuCapability {
  const [cap, setCap] = useState<GpuCapability>(INITIAL);

  useEffect(() => {
    let active = true;
    const apply = (c: GpuCapability) => { if (active) setCap(c); }; // indirect → no direct setState in effect body
    const gpu = (navigator as Navigator & { gpu?: { requestAdapter(): Promise<AdapterLike | null> } }).gpu;
    if (!gpu) { queueMicrotask(() => apply({ ...INITIAL, probed: true })); return; }
    (async () => {
      try {
        const adapter = await gpu.requestAdapter();
        if (!adapter) { apply({ ...INITIAL, probed: true }); return; }
        const maxBind = adapter.limits?.maxStorageBufferBindingSize ?? 0;
        const hasF16 = !!adapter.features?.has?.('shader-f16');
        let info: string | null = null;
        const ai = adapter.info ?? (adapter.requestAdapterInfo ? await adapter.requestAdapterInfo().catch(() => undefined) : undefined);
        if (ai) info = [ai.vendor, ai.architecture, ai.description].filter(Boolean).join(' ').trim() || null;
        apply({
          probed: true,
          supported: true,
          maxBindBytes: maxBind,
          hasF16,
          budgetGB: budgetFromCap(maxBind, isMobile),
          tier: maxBind >= 1e9 ? 'high' : 'modest',
          adapterInfo: info,
        });
      } catch {
        apply({ ...INITIAL, probed: true });
      }
    })();
    return () => { active = false; };
  }, [isMobile]);

  return cap;
}

// Bytes/param at a resident precision (weights kept quantized in VRAM by the fused matmuls).
const BPP: Record<string, number> = { f32: 4, f16: 2, q8: 1, mixed: 0.6, q4: 0.5, q3: 0.375 };

// The precision a preset will actually run at → its resident bytes/param. A BRIK tile names its tier
// in parentheses (BRIK int4 / int8 / int3 / mixed); a GGUF tile is dequantized then auto-quantized,
// so mirror the engine's pickAutoPrecision (same inputs) to know what it'll pick on this GPU.
export function effectiveBpp(name: string, paramsB: number, gpu: GpuCapability, isMobile: boolean): number {
  const q = (name.match(/\(([^)]+)\)/)?.[1] || '').toLowerCase();
  if (q.includes('int3')) return BPP.q3;
  if (q.includes('mixed')) return BPP.mixed;
  if (q.includes('int4') || q.includes('q4')) return BPP.q4;
  if (q.includes('int8') || q.includes('q8')) return BPP.q8;
  if (q.includes('f16')) return BPP.f16;
  // GGUF / unknown → the engine dequantizes then auto-picks a resident precision.
  const prec = pickAutoPrecision(paramsB * 1e9, true, gpu.hasF16, isMobile, gpu.maxBindBytes || 0);
  return BPP[prec] ?? BPP.f16;
}

export type GpuVerdict = 'good' | 'tight' | 'heavy';

// Estimated resident VRAM (GB) for a model = params × bytes/param × overhead (activations + KV).
export function estimateResidentGB(paramsB: number, name: string, gpu: GpuCapability, isMobile: boolean): number {
  return paramsB * effectiveBpp(name, paramsB, gpu, isMobile) * 1.25;
}

// Verdict vs the GPU budget: comfortably under → good; near the budget → tight; over → heavy.
export function gpuVerdict(paramsB: number, name: string, gpu: GpuCapability, isMobile: boolean): GpuVerdict {
  const need = estimateResidentGB(paramsB, name, gpu, isMobile);
  if (need <= gpu.budgetGB * 0.7) return 'good';
  if (need <= gpu.budgetGB) return 'tight';
  return 'heavy';
}
