export type HashHex = string;
export type EntityId = string;
export type ResourceId = string;

export interface GameTime {
  day: number;
  tick: number;
  globalTick?: number;
}

export interface ResourceDelta {
  resource: ResourceId;
  amount: bigint;
  unit?: string;
}

export type EntryType =
  | 'TRANSFER'
  | 'PRODUCE'
  | 'CONSUME'
  | 'MOVE'
  | 'TAX'
  | 'FEE'
  | 'MINT'
  | 'BURN'
  | 'NOTE';

export interface LedgerEntry<TExt = unknown> {
  id: HashHex;
  type: EntryType;
  time: GameTime;
  actor: EntityId;
  counterparty?: EntityId;
  inputs: ResourceDelta[];
  outputs: ResourceDelta[];
  refs: HashHex[];
  ext?: TExt;
}

export interface BlockHeader {
  version: 1;
  index: number;
  timeStart: GameTime;
  timeEnd: GameTime;
  entryCount: number;
  merkleRoot: HashHex;
}

export interface LedgerBlock {
  header: BlockHeader;
  prevBlockHash: HashHex;
  blockHash: HashHex;
  entries: LedgerEntry[];
}

export type MerkleSide = 'L' | 'R';

export interface MerkleStep {
  side: MerkleSide;
  sibling: HashHex;
}

export interface MerkleProof {
  blockHash: HashHex;
  blockIndex: number;
  entryId: HashHex;
  leafIndex: number;
  steps: MerkleStep[];
  merkleRoot: HashHex;
}

export interface LedgerAppendOptions {
  validate?: boolean;
}

export interface LedgerQuery {
  timeMin?: GameTime;
  timeMax?: GameTime;
  actor?: EntityId;
  counterparty?: EntityId;
  type?: EntryType;
  resource?: ResourceId;
  refsAny?: HashHex[];
  limit?: number;
}

export interface Ledger {
  getHeadBlockHash(): Promise<HashHex>;
  getBlockByIndex(index: number): Promise<LedgerBlock | null>;
  getBlockByHash(hash: HashHex): Promise<LedgerBlock | null>;
  appendEntry(entry: Omit<LedgerEntry, 'id'>, opts?: LedgerAppendOptions): Promise<LedgerEntry>;
  sealBlock(timeEnd: GameTime): Promise<LedgerBlock | null>;
  getProof(entryId: HashHex): Promise<MerkleProof | null>;
  verifyProof(proof: MerkleProof): Promise<boolean>;
  queryEntries(q: LedgerQuery): AsyncIterable<LedgerEntry>;
}

export interface LedgerStore {
  putBlock(block: LedgerBlock): Promise<void>;
  getBlockByIndex(index: number): Promise<LedgerBlock | null>;
  getBlockByHash(hash: HashHex): Promise<LedgerBlock | null>;
  getHead(): Promise<{ headHash: HashHex; height: number } | null>;
  putEntry(entry: LedgerEntry, blockIndex: number, leafIndex: number): Promise<void>;
  getEntry(entryId: HashHex): Promise<{ entry: LedgerEntry; blockIndex: number; leafIndex: number } | null>;
  addIndexRecord?(kind: string, key: string, entryId: HashHex): Promise<void>;
  scanIndex?(kind: string, key: string): AsyncIterable<HashHex>;
}
