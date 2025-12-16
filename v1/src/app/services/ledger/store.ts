import { LedgerBlock, LedgerEntry, LedgerStore, HashHex } from './types';

interface EntryMeta {
  entry: LedgerEntry;
  blockIndex: number;
  leafIndex: number;
}

export class InMemoryLedgerStore implements LedgerStore {
  private readonly blocksByIndex = new Map<number, LedgerBlock>();
  private readonly blocksByHash = new Map<HashHex, LedgerBlock>();
  private readonly entries = new Map<HashHex, EntryMeta>();
  private head: { headHash: HashHex; height: number } | null = null;

  async putBlock(block: LedgerBlock): Promise<void> {
    this.blocksByIndex.set(block.header.index, block);
    this.blocksByHash.set(block.blockHash, block);
    this.head = { headHash: block.blockHash, height: block.header.index };
  }

  async getBlockByIndex(index: number): Promise<LedgerBlock | null> {
    return this.blocksByIndex.get(index) ?? null;
  }

  async getBlockByHash(hash: HashHex): Promise<LedgerBlock | null> {
    return this.blocksByHash.get(hash) ?? null;
  }

  async getHead(): Promise<{ headHash: HashHex; height: number } | null> {
    return this.head;
  }

  async putEntry(entry: LedgerEntry, blockIndex: number, leafIndex: number): Promise<void> {
    this.entries.set(entry.id, { entry, blockIndex, leafIndex });
  }

  async getEntry(entryId: HashHex): Promise<EntryMeta | null> {
    return this.entries.get(entryId) ?? null;
  }
}
