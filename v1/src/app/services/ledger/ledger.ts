import { EntryFactory } from './entry-factory';
import { Hasher } from './hash';
import { MerkleTreeImpl, hashLeaf, verifyMerkleProof } from './merkle-tree';
import { ZERO_HASH, stableStringify } from './stable-stringify';
import {
  BlockHeader,
  GameTime,
  HashHex,
  Ledger,
  LedgerAppendOptions,
  LedgerBlock,
  LedgerEntry,
  LedgerQuery,
  LedgerStore,
} from './types';

export const TICKS_PER_BLOCK = 100;

export class LedgerImpl implements Ledger {
  private pending: LedgerEntry[] = [];
  private pendingStart: GameTime | null = null;

  constructor(
    private readonly store: LedgerStore,
    private readonly entryFactory: EntryFactory,
    private readonly hasher: Hasher,
    private readonly merkleOrder: 'append' | 'sorted' = 'append'
  ) {}

  async getHeadBlockHash(): Promise<HashHex> {
    return (await this.store.getHead())?.headHash ?? ZERO_HASH;
  }

  async getBlockByIndex(index: number): Promise<LedgerBlock | null> {
    return this.store.getBlockByIndex(index);
  }

  async getBlockByHash(hash: HashHex): Promise<LedgerBlock | null> {
    return this.store.getBlockByHash(hash);
  }

  async appendEntry(entryBody: Omit<LedgerEntry, 'id'>, opts?: LedgerAppendOptions): Promise<LedgerEntry> {
    if (opts?.validate) {
      this.validateEntry(entryBody);
    }

    const entry = this.entryFactory.create(entryBody);
    if (!this.pendingStart) {
      this.pendingStart = entry.time;
    }

    this.pending.push(entry);

    if (entry.time.globalTick !== undefined && this.pendingStart.globalTick !== undefined) {
      const windowSpan = entry.time.globalTick - this.pendingStart.globalTick;
      if (windowSpan >= TICKS_PER_BLOCK) {
        await this.sealBlock(entry.time);
      }
    }

    return entry;
  }

  async sealBlock(timeEnd: GameTime): Promise<LedgerBlock | null> {
    if (!this.pending.length || !this.pendingStart) return null;

    const head = await this.store.getHead();
    const index = head ? head.height + 1 : 0;
    const prevBlockHash = head ? head.headHash : ZERO_HASH;

    const entries =
      this.merkleOrder === 'sorted'
        ? [...this.pending].sort((a, b) => a.id.localeCompare(b.id))
        : [...this.pending];

    const leaves = entries.map((e) => hashLeaf(this.hasher, e.id));
    const tree = new MerkleTreeImpl(this.hasher, leaves);

    const header: BlockHeader = {
      version: 1,
      index,
      timeStart: this.pendingStart,
      timeEnd,
      entryCount: entries.length,
      merkleRoot: tree.root(),
    };

    const headerBytes = new TextEncoder().encode(`BLOCKHDR|${stableStringify(header)}`);
    const headerHash = this.hasher.toHex(this.hasher.hash(headerBytes));

    const blockHashBytes = new TextEncoder().encode(`BLOCK|${prevBlockHash}${headerHash}`);
    const blockHash = this.hasher.toHex(this.hasher.hash(blockHashBytes));

    const block: LedgerBlock = { header, prevBlockHash, blockHash, entries };

    await this.store.putBlock(block);

    for (let leafIndex = 0; leafIndex < entries.length; leafIndex += 1) {
      await this.store.putEntry(entries[leafIndex], index, leafIndex);
    }

    this.pending = [];
    this.pendingStart = null;

    return block;
  }

  async getProof(entryId: HashHex) {
    const meta = await this.store.getEntry(entryId);
    if (!meta) return null;

    const block = await this.store.getBlockByIndex(meta.blockIndex);
    if (!block) return null;

    const leaves = block.entries.map((e) => hashLeaf(this.hasher, e.id));
    const tree = new MerkleTreeImpl(this.hasher, leaves);
    const steps = tree.proofForLeaf(meta.leafIndex);

    return {
      blockHash: block.blockHash,
      blockIndex: block.header.index,
      entryId,
      leafIndex: meta.leafIndex,
      steps,
      merkleRoot: block.header.merkleRoot,
    };
  }

  async verifyProof(proof: Awaited<ReturnType<LedgerImpl['getProof']>>): Promise<boolean> {
    if (!proof) return false;
    return verifyMerkleProof(this.hasher, proof.entryId, proof.leafIndex, proof.steps, proof.merkleRoot);
  }

  async *queryEntries(q: LedgerQuery): AsyncIterable<LedgerEntry> {
    const head = await this.store.getHead();
    if (!head) return;

    for (let i = 0; i <= head.height; i += 1) {
      const block = await this.store.getBlockByIndex(i);
      if (!block) continue;

      for (const e of block.entries) {
        if (q.timeMin && !isAfterOrEqual(e.time, q.timeMin)) continue;
        if (q.timeMax && !isBeforeOrEqual(e.time, q.timeMax)) continue;
        if (q.actor && e.actor !== q.actor) continue;
        if (q.counterparty && e.counterparty !== q.counterparty) continue;
        if (q.type && e.type !== q.type) continue;
        if (q.resource) {
          const match = [...e.inputs, ...e.outputs].some((d) => d.resource === q.resource);
          if (!match) continue;
        }
        if (q.refsAny && q.refsAny.length) {
          const ok = q.refsAny.some((r) => e.refs.includes(r));
          if (!ok) continue;
        }

        yield e;

        if (q.limit && --q.limit <= 0) return;
      }
    }
  }

  private validateEntry(entry: Omit<LedgerEntry, 'id'>): void {
    for (const delta of [...entry.inputs, ...entry.outputs]) {
      if (!delta.resource) throw new Error('Resource ID cannot be empty');
      if (typeof delta.amount !== 'bigint') throw new Error('Amounts must be bigint to avoid float drift');
    }
  }
}

function isAfterOrEqual(value: GameTime, bound: GameTime): boolean {
  if (value.globalTick !== undefined && bound.globalTick !== undefined) {
    return value.globalTick >= bound.globalTick;
  }
  if (value.day !== bound.day) return value.day > bound.day;
  return value.tick >= bound.tick;
}

function isBeforeOrEqual(value: GameTime, bound: GameTime): boolean {
  if (value.globalTick !== undefined && bound.globalTick !== undefined) {
    return value.globalTick <= bound.globalTick;
  }
  if (value.day !== bound.day) return value.day < bound.day;
  return value.tick <= bound.tick;
}
