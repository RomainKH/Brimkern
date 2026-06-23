// Brimkern - GGUF File Parser in TypeScript
// Parses GGUF version 2 or 3 files directly on the client side in the browser.

export interface TensorInfo {
  offset: number;
  bytes: number;
  nElems: number;
  type: string;
  shape: number[];
}

export interface Manifest {
  arch: string;
  config: {
    d: number;
    nHeads: number;
    nKvHeads: number;
    headDim: number;
    ffn: number;
    blockCount: number;
    ropeTheta: number;
    rmsEps: number;
  };
  tensors: Record<string, TensorInfo>;
}

class BinaryReader {
  private view: DataView;
  private offset: number = 0;

  constructor(buffer: ArrayBuffer) {
    this.view = new DataView(buffer);
  }

  getOffset() {
    return this.offset;
  }

  setOffset(off: number) {
    this.offset = off;
  }

  uint8() {
    const val = this.view.getUint8(this.offset);
    this.offset += 1;
    return val;
  }

  int8() {
    const val = this.view.getInt8(this.offset);
    this.offset += 1;
    return val;
  }

  uint16() {
    const val = this.view.getUint16(this.offset, true);
    this.offset += 2;
    return val;
  }

  int16() {
    const val = this.view.getInt16(this.offset, true);
    this.offset += 2;
    return val;
  }

  uint32() {
    const val = this.view.getUint32(this.offset, true);
    this.offset += 4;
    return val;
  }

  int32() {
    const val = this.view.getInt32(this.offset, true);
    this.offset += 4;
    return val;
  }

  float32() {
    const val = this.view.getFloat32(this.offset, true);
    this.offset += 4;
    return val;
  }

  float64() {
    const val = this.view.getFloat64(this.offset, true);
    this.offset += 8;
    return val;
  }

  uint64() {
    // Read 64-bit uint as a safe Javascript number
    const lo = this.view.getUint32(this.offset, true);
    const hi = this.view.getUint32(this.offset + 4, true);
    this.offset += 8;
    return lo + hi * 4294967296;
  }

  int64() {
    const lo = this.view.getUint32(this.offset, true);
    const hi = this.view.getInt32(this.offset + 4, true);
    this.offset += 8;
    return lo + hi * 4294967296;
  }

  string() {
    const len = this.uint64();
    if (this.offset + len > this.view.byteLength) {
      throw new Error(`BinaryReader: string length ${len} exceeds buffer size`);
    }
    const bytes = new Uint8Array(this.view.buffer, this.offset, len);
    this.offset += len;
    return new TextDecoder().decode(bytes);
  }
}

const GGML_TYPE_NAMES = [
  "F32", "F16", "Q4_0", "Q4_1", "Q4_2", "Q4_3", "Q5_0", "Q5_1", 
  "Q8_0", "Q8_1", "Q2_K", "Q3_K", "Q4_K", "Q5_K", "Q6_K", "Q8_K"
];

// Returns size in bytes of a block, and elements in a block
const getGgmlBlockInfo = (typeStr: string) => {
  switch (typeStr) {
    case "F32": return { block: 1, size: 4 };
    case "F16": return { block: 1, size: 2 };
    case "Q4_0": return { block: 32, size: 18 };
    case "Q4_1": return { block: 32, size: 20 };
    case "Q5_0": return { block: 32, size: 22 };
    case "Q5_1": return { block: 32, size: 24 };
    case "Q8_0": return { block: 32, size: 34 };
    case "Q2_K": return { block: 256, size: 66 };
    case "Q3_K": return { block: 256, size: 110 }; // approx
    case "Q4_K": return { block: 256, size: 144 };
    case "Q5_K": return { block: 256, size: 176 };
    case "Q6_K": return { block: 256, size: 210 };
    case "Q8_K": return { block: 256, size: 288 };
    default: return { block: 1, size: 4 }; // fallback
  }
};

export async function parseGguf(file: Blob | File): Promise<Manifest> {
  // ponytail: 100MB chunk sufficient for large GGUF headers/vocabularies. No dynamic chunking needed.
  const HEADER_CHUNK_SIZE = Math.min(file.size, 100 * 1024 * 1024);
  const chunk = file.slice(0, HEADER_CHUNK_SIZE);
  const buffer = await chunk.arrayBuffer();
  const reader = new BinaryReader(buffer);

  // 1. Magic
  const magicChars = [
    String.fromCharCode(reader.uint8()),
    String.fromCharCode(reader.uint8()),
    String.fromCharCode(reader.uint8()),
    String.fromCharCode(reader.uint8()),
  ].join('');

  if (magicChars !== 'GGUF') {
    throw new Error(`Fichier GGUF invalide. Sceau magique absent : ${magicChars}`);
  }

  // 2. Version
  const version = reader.uint32();
  if (version !== 2 && version !== 3) {
    throw new Error(`Version GGUF non supportée : ${version}`);
  }

  // 3. Header counts
  const tensorCount = reader.uint64();
  const metadataCount = reader.uint64();

  // Helper to read metadata value recursively
  const readMetadataVal = (type: number): any => {
    switch (type) {
      case 0: return reader.uint8();
      case 1: return reader.int8();
      case 2: return reader.uint16();
      case 3: return reader.int16();
      case 4: return reader.uint32();
      case 5: return reader.int32();
      case 6: return reader.float32();
      case 7: return reader.uint8() !== 0;
      case 8: return reader.string();
      case 9: { // array
        const itemType = reader.uint32();
        const len = reader.uint64();
        const arr = [];
        for (let i = 0; i < len; i++) {
          arr.push(readMetadataVal(itemType));
        }
        return arr;
      }
      case 10: return reader.uint64();
      case 11: return reader.int64();
      case 12: return reader.float64();
      default:
        throw new Error(`Type de métadonnées non supporté : ${type}`);
    }
  };

  // 4. Parse Metadata
  const metadata: Record<string, any> = {};
  for (let i = 0; i < metadataCount; i++) {
    const key = reader.string();
    const valType = reader.uint32();
    const val = readMetadataVal(valType);
    metadata[key] = val;
  }

  const alignment = (metadata['general.alignment'] as number) ?? 32;
  const arch = (metadata['general.architecture'] as string) ?? 'llama';

  // 5. Parse Tensor Info
  interface RawTensorInfo {
    name: string;
    shape: number[];
    typeIdx: number;
    relativeOffset: number;
  }
  
  const rawTensors: RawTensorInfo[] = [];
  for (let i = 0; i < tensorCount; i++) {
    const name = reader.string();
    const nDims = reader.uint32();
    const shape: number[] = [];
    for (let d = 0; d < nDims; d++) {
      shape.push(reader.uint64());
    }
    const typeIdx = reader.uint32();
    const relativeOffset = reader.uint64();
    rawTensors.push({ name, shape, typeIdx, relativeOffset });
  }

  // Calculate the starting position of the raw tensor data in the GGUF file
  // It is aligned to the metadata alignment boundary
  const currentOffset = reader.getOffset();
  const tensorDataOffset = Math.ceil(currentOffset / alignment) * alignment;

  // Build the final tensors manifest
  const tensors: Record<string, TensorInfo> = {};
  for (let i = 0; i < rawTensors.length; i++) {
    const t = rawTensors[i];
    const typeName = GGML_TYPE_NAMES[t.typeIdx] || "UNKNOWN";
    
    // Total elements in tensor
    const nElems = t.shape.reduce((a, b) => a * b, 1);
    
    // Compute byte length using relative offset of next tensor if available, 
    // or block size math as fallback
    let bytes = 0;
    if (i < rawTensors.length - 1) {
      bytes = rawTensors[i + 1].relativeOffset - t.relativeOffset;
    } else {
      // Last tensor goes to the end of file (or we calculate it using blocks)
      const { block, size } = getGgmlBlockInfo(typeName);
      bytes = (nElems / block) * size;
    }

    tensors[t.name] = {
      offset: tensorDataOffset + t.relativeOffset,
      bytes: bytes,
      nElems: nElems,
      type: typeName,
      shape: t.shape,
    };
  }

  // Retrieve model hyperparameters
  const getMetaU32 = (k: string, def: number) => {
    const val = metadata[`${arch}.${k}`];
    return val !== undefined ? Number(val) : def;
  };

  const getMetaF32 = (k: string, def: number) => {
    const val = metadata[`${arch}.${k}`];
    return val !== undefined ? Number(val) : def;
  };

  const d = getMetaU32('embedding_length', 0);
  const nHeads = getMetaU32('attention.head_count', 0);
  const nKvHeads = getMetaU32('attention.head_count_kv', nHeads);
  const blockCount = getMetaU32('block_count', 0);
  const ropeTheta = getMetaF32('rope.freq_base', 10000.0);
  const rmsEps = getMetaF32('attention.layer_norm_rms_epsilon', 1e-5);
  const headDim = nHeads > 0 ? d / nHeads : 0;
  const ffn = getMetaU32('feed_forward_length', 0);

  return {
    arch,
    config: {
      d,
      nHeads,
      nKvHeads,
      headDim,
      ffn,
      blockCount,
      ropeTheta,
      rmsEps,
    },
    tensors,
  };
}
