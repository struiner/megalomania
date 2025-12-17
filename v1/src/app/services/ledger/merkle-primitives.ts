export interface MerkleProofStep {
  siblingHash?: string;
  side?: 'left' | 'right';
}

export interface MerkleProof {
  leafHash: string;
  path: MerkleProofStep[];
  root: string;
  leafIndex: number;
}

const encoder = new TextEncoder();

export function stableStringify(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'number' && !Number.isFinite(value)) return `"${value.toString()}"`;
  if (typeof value !== 'object') return JSON.stringify(value);

  if (Array.isArray(value)) {
    return `[${value.map(item => stableStringify(item)).join(',')}]`;
  }

  if (value instanceof Date) {
    return `"${value.toISOString()}"`;
  }

  const entries = Object.keys(value as Record<string, unknown>)
    .sort()
    .map(key => `${JSON.stringify(key)}:${stableStringify((value as Record<string, unknown>)[key])}`);

  return `{${entries.join(',')}}`;
}

export function canonicalEncode(value: unknown): Uint8Array {
  return encoder.encode(stableStringify(value));
}

export async function hashBytes(payload: Uint8Array, algorithm: AlgorithmIdentifier = 'SHA-256'): Promise<string> {
  if (!globalThis.crypto?.subtle) {
    throw new Error('WebCrypto API is required for hashing');
  }

  const hashBuffer = await globalThis.crypto.subtle.digest(algorithm, payload);
  return bytesToHex(new Uint8Array(hashBuffer));
}

export async function hashLeaf(treeTag: string, value: unknown): Promise<string> {
  const tagBytes = encoder.encode(treeTag);
  const prefix = Uint8Array.from([0x00]);
  const payload = canonicalEncode(value);
  return hashBytes(concatBytes(prefix, tagBytes, payload));
}

export async function hashNode(treeTag: string, leftHash: string, rightHash: string): Promise<string> {
  const tagBytes = encoder.encode(treeTag);
  const prefix = Uint8Array.from([0x01]);
  const leftBytes = hexToBytes(leftHash);
  const rightBytes = hexToBytes(rightHash);
  return hashBytes(concatBytes(prefix, tagBytes, leftBytes, rightBytes));
}

export class MerkleTree {
  private layers: string[][] = [];

  private constructor(private readonly treeTag: string) {}

  static async fromValues(values: unknown[], treeTag: string): Promise<MerkleTree> {
    const tree = new MerkleTree(treeTag);
    await tree.build(values);
    return tree;
  }

  getRoot(): string {
    const lastLayer = this.layers[this.layers.length - 1];
    return lastLayer?.[0] ?? '';
  }

  getLeaves(): string[] {
    return this.layers[0] ?? [];
  }

  getProof(index: number): MerkleProof {
    if (!this.layers.length) {
      throw new Error('Tree not built');
    }

    if (index < 0 || index >= this.layers[0].length) {
      throw new Error(`Leaf index ${index} is out of bounds`);
    }

    const path: MerkleProofStep[] = [];
    let position = index;

    for (let level = 0; level < this.layers.length - 1; level++) {
      const currentLayer = this.layers[level];
      const isOddPromotion = currentLayer.length % 2 === 1 && position === currentLayer.length - 1;

      if (isOddPromotion) {
        path.push({});
        position = Math.floor(position / 2);
        continue;
      }

      const isRightNode = position % 2 === 1;
      const siblingIndex = isRightNode ? position - 1 : position + 1;
      const siblingHash = currentLayer[siblingIndex];

      path.push({
        siblingHash,
        side: isRightNode ? 'left' : 'right',
      });

      position = Math.floor(position / 2);
    }

    return {
      leafHash: this.layers[0][index],
      path,
      root: this.getRoot(),
      leafIndex: index,
    };
  }

  private async build(values: unknown[]): Promise<void> {
    const leaves = await Promise.all(values.map(value => hashLeaf(this.treeTag, value)));
    this.layers = [leaves];
    let currentLayer = leaves;

    while (currentLayer.length > 1) {
      const nextLayer: string[] = [];

      for (let i = 0; i < currentLayer.length; i += 2) {
        const left = currentLayer[i];
        const right = currentLayer[i + 1];

        if (right === undefined) {
          nextLayer.push(left);
          continue;
        }

        const nodeHash = await hashNode(this.treeTag, left, right);
        nextLayer.push(nodeHash);
      }

      this.layers.push(nextLayer);
      currentLayer = nextLayer;
    }
  }
}

export async function verifyProof(proof: MerkleProof, treeTag: string): Promise<boolean> {
  let currentHash = proof.leafHash;

  for (const step of proof.path) {
    if (!step.siblingHash) {
      continue;
    }

    if (step.side === 'left') {
      currentHash = await hashNode(treeTag, step.siblingHash, currentHash);
    } else {
      currentHash = await hashNode(treeTag, currentHash, step.siblingHash);
    }
  }

  return currentHash === proof.root;
}

function concatBytes(...arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const merged = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    merged.set(arr, offset);
    offset += arr.length;
  }
  return merged;
}

function hexToBytes(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) {
    throw new Error('Hex string must have an even length');
  }

  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
