import { Hasher } from './hash';
import { HashHex, MerkleProof, MerkleStep } from './types';
import { ZERO_HASH } from './stable-stringify';

export interface MerkleTree {
  root(): HashHex;
  leafCount(): number;
  proofForLeaf(leafIndex: number): MerkleStep[];
}

export class MerkleTreeImpl implements MerkleTree {
  private readonly levels: HashHex[][];

  constructor(private readonly hasher: Hasher, leaves: HashHex[]) {
    this.levels = [leaves];
    this.build();
  }

  leafCount(): number {
    return this.levels[0]?.length ?? 0;
  }

  root(): HashHex {
    const top = this.levels[this.levels.length - 1];
    return top && top.length ? top[0] : ZERO_HASH;
  }

  proofForLeaf(leafIndex: number): MerkleStep[] {
    const steps: MerkleStep[] = [];
    let idx = leafIndex;

    for (let level = 0; level < this.levels.length - 1; level++) {
      const nodes = this.levels[level];
      const isRight = idx % 2 === 1;
      const siblingIndex = isRight ? idx - 1 : idx + 1;
      const sibling = nodes[siblingIndex] ?? nodes[idx];
      steps.push({ side: isRight ? 'L' : 'R', sibling });
      idx = Math.floor(idx / 2);
    }

    return steps;
  }

  private build(): void {
    let level = 0;
    while (this.levels[level].length > 1) {
      const nodes = this.levels[level];
      const parents: HashHex[] = [];

      for (let i = 0; i < nodes.length; i += 2) {
        const left = nodes[i];
        const right = nodes[i + 1] ?? nodes[i];
        parents.push(hashNode(this.hasher, left, right));
      }

      this.levels.push(parents);
      level += 1;
    }
  }
}

export function hashLeaf(hasher: Hasher, entryId: HashHex): HashHex {
  const bytes = new TextEncoder().encode(`LEAF|${entryId}`);
  return hasher.toHex(hasher.hash(bytes));
}

export function hashNode(hasher: Hasher, left: HashHex, right: HashHex): HashHex {
  const bytes = new TextEncoder().encode(`NODE|${left}${right}`);
  return hasher.toHex(hasher.hash(bytes));
}

export function verifyMerkleProof(
  hasher: Hasher,
  entryId: HashHex,
  leafIndex: number,
  steps: MerkleStep[],
  expectedRoot: HashHex
): boolean {
  let acc = hashLeaf(hasher, entryId);
  let idx = leafIndex;

  for (const step of steps) {
    const left = step.side === 'L' ? step.sibling : acc;
    const right = step.side === 'L' ? acc : step.sibling;
    acc = hashNode(hasher, left, right);
    idx = Math.floor(idx / 2);
  }

  return acc === expectedRoot;
}

export function toProof(
  hasher: Hasher,
  entryId: HashHex,
  leafIndex: number,
  steps: MerkleStep[],
  merkleRoot: HashHex,
  blockHash: HashHex,
  blockIndex: number
): MerkleProof {
  return { blockHash, blockIndex, entryId, leafIndex, steps, merkleRoot };
}
