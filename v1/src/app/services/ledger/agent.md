# Merkle-Tree Ledger Blueprint (Trading Sim)

This document is an **instruction set + blueprint** for an automated coding agent ("codex agent") to implement a Merkle-tree-based ledger for a trading simulation game.

Design goals:

* **Deterministic** given a sacred seed + identical event inputs.
* **Immutable, append-only** ledger of economic facts.
* **Auditable** via Merkle inclusion proofs.
* **Domain-friendly**: buildings, fleets, companies, cities, NPC institutions.
* **Event-sourced**: all balances/stock/ownership are derived views.

Non-goals (v1): distributed consensus, PoW/PoS, networking, adversarial Byzantine tolerance.

---

## 0) Terminology

* **Entry**: a single immutable economic event (leaf).
* **Block**: a time-bucketed bundle of entries with a Merkle root.
* **Ledger**: a hash-chain of blocks + APIs to append, query, and verify.
* **View**: derived read model built by folding entries.
* **Proof**: a Merkle path that proves an entry’s inclusion in a block.

---

## 1) Scope

### Must-have (v1)

1. Deterministic hashing and canonical serialization.
2. Append-only ledger entries.
3. Blocks with Merkle root and block hash chain.
4. Inclusion proof generation + verification.
5. Query API: by time range, actor, type, resource, reference.
6. View framework: pluggable derived indexes (inventory, cash, tax, etc.).
7. Persistence (file/DB abstraction) + ability to rebuild views from ledger.

### Nice-to-have (v2)

* Causal reference graph (refs) + provenance queries.
* Partitioned Merkle trees (by domain/type/actor) and/or Merkle Mountain Range.
* Compression / snapshots of views.
* Fraud detection rules (double-spend-like constraints).

---

## 2) Strategy Overview

### Core strategy: Event sourcing + fixed-size tick-window Merkle blocks

* All **game events** become **LedgerEntry** records.
* This includes economic actions *and* non-economic but game-relevant events (contracts signed, wars declared, laws enacted, discoveries made, disasters, etc.).
* Economic state, political state, and narrative state are all derived views over the same immutable event stream.
* Entries are appended to a **pending tick-window block**.
* At the window boundary (every **N ticks**), build the Merkle tree, compute root, and seal the block.
* Link blocks in a hash chain: `blockHash = H(prevBlockHash || headerBytes)`.

**Chosen block boundary policy (v1): per N ticks**

* This is the most robust option for keeping multi-user simulations consistent.
* If you later introduce “sim phases,” keep block boundaries tick-based and store `phaseTag` on entries (or in block metadata) so determinism doesn’t depend on local scheduling.

### Determinism strategy

* Canonical serialization of all data structures.
* Stable sorting when building Merkle trees.
* No random salts in entry IDs.
* Use the same hashing algorithm everywhere.

---

## 3) Canonical Serialization Rules

A codex agent MUST implement **canonical encoding** to avoid hash mismatches.

Rules:

* Use UTF-8.
* Use a canonical JSON-like encoding *or* a custom binary encoding. For v1, canonical JSON is acceptable if strictly controlled.
* Object keys must be sorted lexicographically.
* Arrays must preserve order.
* Floats are forbidden in hashed fields. Use integers (e.g., cents) or rational pairs.
* Timestamps must be normalized to a canonical string or int tuple.
* Optional fields must be either omitted or represented consistently (choose one policy and stick to it).

Recommendation:

* Use a small internal encoder: `stableStringify(value)` that sorts keys recursively.

---

## 4) Hashing Rules

### Algorithm

* Default: SHA-256.
* Represent hashes as lowercase hex strings (64 chars) or Uint8Array (32 bytes). Choose one internally; expose as hex for debugging.

### Hash domains

To avoid collisions between different “kinds” of hash inputs, prefix with domain tags:

* `H("ENTRY|" + entryBytes)`
* `H("LEAF|" + entryHash)`
* `H("NODE|" + leftHash + rightHash)`
* `H("BLOCKHDR|" + headerBytes)`
* `H("BLOCK|" + prevHash + hdrHash)`

(Exact concatenation format must be consistent. Prefer byte concatenation over string concat in production.)

---

## 5) Data Model

### 5.1 Core types

```ts
export type HashHex = string; // 64 hex chars
export type EntityId = string;
export type ResourceId = string;

export interface GameTime {
  // Deterministic game time representation
  day: number;
  tick: number; // tick within day
  // Strongly recommended for fixed-size N-tick windows across users
  globalTick?: number; // monotonically increasing tick since world start
}

export interface ResourceDelta {
  resource: ResourceId;
  amount: bigint; // allow large values, avoid float
  unit?: string; // optional display only; excluded from hashed bytes unless needed
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
  // Hash of the canonical encoded body (not including id)
  id: HashHex;

  type: EntryType;
  time: GameTime;

  // Who caused it (company, building, fleet, institution)
  actor: EntityId;

  // Optional counterparty
  counterparty?: EntityId;

  // Economic deltas: inputs negative, outputs positive OR split into arrays.
  // Prefer split arrays for readability.
  inputs: ResourceDelta[];
  outputs: ResourceDelta[];

  // Causal references: purchase orders, shipments, prior batches, contracts, etc.
  refs: HashHex[];

  // Free-form extension payload for domain-specific data.
  // MUST be either excluded from hashing (v1) or canonical-hashed (v2).
  ext?: TExt;
}
```

Instruction:

* **Chosen policy (v1): include `ext` in the hashed payload** after canonical encoding.
* Therefore, anything in `ext` must follow canonicalization rules (no floats, stable key order, deterministic arrays).

### 5.2 Block header + block

```ts
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
  prevBlockHash: HashHex;  // hash of previous block
  blockHash: HashHex;      // hash of (prevBlockHash + headerHash)
  entries: LedgerEntry[];  // can be omitted from stored block if stored separately
}
```

### 5.3 Proof

```ts
export type MerkleSide = 'L' | 'R';

export interface MerkleStep {
  side: MerkleSide;   // if side == 'L', sibling is on the left of current
  sibling: HashHex;
}

export interface MerkleProof {
  blockHash: HashHex;
  blockIndex: number;
  entryId: HashHex;
  leafIndex: number;
  steps: MerkleStep[];
  merkleRoot: HashHex; // redundancy for convenience
}
```

---

## 6) Merkle Tree Construction

### 6.1 Leaf hashing

* Leaf hash = `H("LEAF|" + entryId)`.

### 6.2 Sorting policy

**Chosen policy (v1): Policy A — preserve append order within a block.**

Determinism requirement:

* If multiple subsystems can emit entries “at the same tick,” impose a deterministic pre-ordering **before** append (e.g., `(globalTick, subsystemPriority, actorId, localSequence)`), then append in that order.

This keeps the ledger readable while staying consistent across users.

### 6.3 Odd leaf handling

* Standard: if odd node count at a level, duplicate last node.

### 6.4 Node hashing

* Node = `H("NODE|" + leftHash + rightHash)`.

### 6.5 Tree API requirements

```ts
export interface MerkleTree {
  root(): HashHex;
  leafCount(): number;
  proofForLeaf(leafIndex: number): MerkleStep[];
}
```

Implementation guidance:

* Build levels as arrays: `levels[0] = leaves`, `levels[i+1] = parents`.
* Proof: at each level, sibling index is `i ^ 1` (with duplicate-last logic).

---

## 7) Ledger APIs

### 7.1 High-level ledger interface

```ts
export interface LedgerAppendOptions {
  // optional: validate invariants at append time
  validate?: boolean;
}

export interface LedgerQuery {
  timeMin?: GameTime;
  timeMax?: GameTime;
  actor?: EntityId;
  counterparty?: EntityId;
  type?: EntryType;
  resource?: ResourceId; // matches any delta in inputs/outputs
  refsAny?: HashHex[];
  limit?: number;
}

export interface Ledger {
  getHeadBlockHash(): Promise<HashHex>;
  getBlockByIndex(index: number): Promise<LedgerBlock | null>;
  getBlockByHash(hash: HashHex): Promise<LedgerBlock | null>;

  appendEntry(entry: Omit<LedgerEntry, 'id'>, opts?: LedgerAppendOptions): Promise<LedgerEntry>;

  // seals the current pending block (if any)
  sealBlock(timeEnd: GameTime): Promise<LedgerBlock | null>;

  // proofs
  getProof(entryId: HashHex): Promise<MerkleProof | null>;
  verifyProof(proof: MerkleProof): Promise<boolean>;

  // queries
  queryEntries(q: LedgerQuery): AsyncIterable<LedgerEntry>;
}
```

### 7.2 Constraints

* `appendEntry()` MUST compute id deterministically from canonical body.
* Ledger MUST not mutate prior blocks.
* `sealBlock()` MUST be idempotent for the same pending content.

---

## 8) Storage and Persistence

Implement storage via adapters.

### 8.1 Storage interfaces

```ts
export interface LedgerStore {
  // blocks
  putBlock(block: LedgerBlock): Promise<void>;
  getBlockByIndex(index: number): Promise<LedgerBlock | null>;
  getBlockByHash(hash: HashHex): Promise<LedgerBlock | null>;
  getHead(): Promise<{ headHash: HashHex; height: number } | null>;

  // entries
  putEntry(entry: LedgerEntry, blockIndex: number, leafIndex: number): Promise<void>;
  getEntry(entryId: HashHex): Promise<{ entry: LedgerEntry; blockIndex: number; leafIndex: number } | null>;

  // optional indices for performance
  addIndexRecord?(kind: string, key: string, entryId: HashHex): Promise<void>;
  scanIndex?(kind: string, key: string): AsyncIterable<HashHex>;
}
```

### 8.2 Minimal persistence options

* In-memory store (tests).
* File-based store (JSON lines per block).
* Embedded DB store (SQLite/IndexedDB) adapter.

Instruction:

* Storage must preserve **append order** inside blocks if Policy A is used.

---

## 9) Validation and Invariants

### 9.1 Entry-level validation (cheap)

* `inputs.amount <= 0` and `outputs.amount >= 0` OR enforce that `inputs` are positive but interpreted as consumed.
* No empty resource IDs.
* No NaN (floats forbidden).
* `refs` are valid hash strings.

### 9.2 Ledger-level validation (optional / configurable)

* Conservation rules per entry type (e.g. TRANSFER: net sum of deltas should equal 0 across actor/counterparty if modeled as two-sided).
* No negative inventory if the sim requires it (often a rule, but may be allowed with debt/backorder mechanics).
* Tax rules: if TAX entries exist, validate against taxable bases (expensive; likely done in views).

### 9.3 Block validation

* Merkle root matches entries.
* Block hash matches header + prev.
* Index increments by 1.

---

## 10) Views (Derived Read Models)

### 10.1 View framework

```ts
export interface ViewCheckpoint {
  lastBlockIndex: number;
  lastBlockHash: HashHex;
}

export interface LedgerView {
  name: string;

  // called when rebuilding from scratch
  reset(): Promise<void>;

  // fold entries in order (block index, leaf index)
  applyEntry(entry: LedgerEntry, meta: { blockIndex: number; leafIndex: number }): Promise<void>;

  // checkpointing
  getCheckpoint(): Promise<ViewCheckpoint | null>;
  setCheckpoint(cp: ViewCheckpoint): Promise<void>;
}

export interface ViewManager {
  register(view: LedgerView): void;
  rebuildAll(): Promise<void>;
  catchUpAll(): Promise<void>; // apply new blocks since checkpoints
}
```

### 10.2 Mandatory views (suggested)

* **InventoryView**: (entityId, resourceId) -> quantity
* **CashView**: (entityId) -> money
* **OwnershipView** (optional): assetId -> owner
* **TradeStatsView**: aggregations by day, route, company

### 10.3 View rebuild strategy

* On startup: read checkpoints; verify lastBlockHash; if mismatch, rebuild.
* If store supports it, snapshot views every N blocks.

---

## 11) Query and Indexing Strategy

### 11.1 Baseline

* Scan blocks in time range and filter entries.

### 11.2 Optional indices

If performance needs:

* Index by actor: `actor:<id> -> [entryIds...]`
* Index by resource: `res:<resourceId> -> [entryIds...]`
* Index by type.
* Index by ref.

Indexing rules:

* Indices are **derived**. They can be rebuilt from blocks.
* Never rely on an index for correctness.

---

## 12) Causality Graph (refs) (v2-ready)

Purpose:

* Provenance: “which ore became this steel?”
* Legal: contracts, fraud disputes.

Minimum requirements:

* `refs` is an array of entry IDs and/or external document IDs (if included, must be domain-tagged).
* Provide query:

  * `getAncestors(entryId, depth)`
  * `getDescendants(entryId, depth)`

---

## 13) Security / Anti-cheat Posture

In a single-player sim, security is mostly “integrity against bugs and save corruption.”

Recommended:

* Store the head block hash in save metadata.
* On load, verify block chain up to head.
* Optionally sign ledger roots with a game key (offline) if you want tamper evidence.

---

## 14) Implementation Plan (Codex Agent Checklist)

### Step A — Utilities

* Implement `stableStringify()`.
* Implement `hashBytes()` + helpers.
* Implement `parseHashHex()` validation.

### Step B — Merkle

* Implement `MerkleTreeImpl` building levels.
* Implement `proofForLeaf()`.
* Implement `verifyProof()`.

### Step C — Store

* Implement `InMemoryLedgerStore`.
* Implement `FileLedgerStore` (optional).

### Step D — Ledger core

* Implement `LedgerImpl`:

  * Maintain pending entries buffer.
  * Append entry: compute id, store entry pending.
  * Seal block: build Merkle, write block, write entries with blockIndex+leafIndex.
  * Maintain head.

### Step E — Queries

* Implement `queryEntries()` scanning blocks.
* If store supports index, use it to narrow scans.

### Step F — Views

* Implement `ViewManager`.
* Implement Inventory and Cash views.
* Add rebuild and catch-up.

### Step G — Tests

* Determinism test: same entries -> same root.
* Proof test: generated proofs verify.
* Corruption test: change one entry -> proof fails.
* Rebuild test: delete view state -> rebuild matches.

---

## 15) Reference Implementations (Generic TypeScript Classes)

### 15.1 Hash + canonical encoding

```ts
export interface Canonicalizer {
  encode(value: unknown): Uint8Array;
}

export interface Hasher {
  hash(data: Uint8Array): Uint8Array;
  toHex(bytes: Uint8Array): HashHex;
  fromHex(hex: HashHex): Uint8Array;
}

export class JsonCanonicalizer implements Canonicalizer {
  encode(value: unknown): Uint8Array {
    const s = stableStringify(value);
    return new TextEncoder().encode(s);
  }
}
```

### 15.2 Entry factory

```ts
export class EntryFactory {
  constructor(private canon: Canonicalizer, private hasher: Hasher) {}

  create<TExt>(body: Omit<LedgerEntry<TExt>, 'id'>): LedgerEntry<TExt> {
    // decide ext hashing policy here (include or exclude)
    const bytes = this.canon.encode(body);
    const id = this.hasher.toHex(this.hasher.hash(prefixBytes('ENTRY|', bytes)));
    return { ...body, id };
  }
}

function prefixBytes(prefix: string, bytes: Uint8Array): Uint8Array {
  const p = new TextEncoder().encode(prefix);
  const out = new Uint8Array(p.length + bytes.length);
  out.set(p, 0);
  out.set(bytes, p.length);
  return out;
}
```

### 15.3 Merkle tree

```ts
export class MerkleTreeImpl implements MerkleTree {
  private levels: HashHex[][];

  constructor(private hasher: Hasher, leaves: HashHex[]) {
    this.levels = [leaves];
    this.build();
  }

  leafCount(): number { return this.levels[0].length; }

  root(): HashHex {
    const top = this.levels[this.levels.length - 1];
    return top.length ? top[0] : zeroHash();
  }

  proofForLeaf(leafIndex: number): MerkleStep[] {
    const steps: MerkleStep[] = [];
    let idx = leafIndex;

    for (let level = 0; level < this.levels.length - 1; level++) {
      const nodes = this.levels[level];
      const isRight = (idx % 2) === 1;
      const sibIdx = isRight ? idx - 1 : idx + 1;
      const sibling = nodes[sibIdx] ?? nodes[idx]; // duplicate last
      steps.push({ side: isRight ? 'L' : 'R', sibling });
      idx = Math.floor(idx / 2);
    }

    return steps;
  }

  private build() {
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
      level++;
    }
  }
}

export function hashLeaf(hasher: Hasher, entryId: HashHex): HashHex {
  const bytes = new TextEncoder().encode('LEAF|' + entryId);
  return hasher.toHex(hasher.hash(bytes));
}

export function hashNode(hasher: Hasher, left: HashHex, right: HashHex): HashHex {
  const bytes = new TextEncoder().encode('NODE|' + left + right);
  return hasher.toHex(hasher.hash(bytes));
}

function zeroHash(): HashHex {
  return '0'.repeat(64);
}
```

### 15.4 Proof verification

```ts
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
```

### 15.5 Ledger implementation skeleton

```ts
export class LedgerImpl implements Ledger {
  private pending: LedgerEntry[] = [];
  private pendingStart: GameTime | null = null;

  constructor(
    private store: LedgerStore,
    private entryFactory: EntryFactory,
    private hasher: Hasher,
    private merkleOrder: 'append' | 'sorted' = 'append'
  ) {}

  async getHeadBlockHash(): Promise<HashHex> {
    return (await this.store.getHead())?.headHash ?? '0'.repeat(64);
  }

  async getBlockByIndex(index: number) { return this.store.getBlockByIndex(index); }
  async getBlockByHash(hash: HashHex) { return this.store.getBlockByHash(hash); }

  async appendEntry(entryBody: Omit<LedgerEntry, 'id'>, opts?: LedgerAppendOptions): Promise<LedgerEntry> {
    const entry = this.entryFactory.create(entryBody);
    if (!this.pendingStart) this.pendingStart = entry.time;
    this.pending.push(entry);
    return entry;
  }

  async sealBlock(timeEnd: GameTime): Promise<LedgerBlock | null> {
    if (!this.pending.length || !this.pendingStart) return null;

    const head = await this.store.getHead();
    const index = head ? head.height + 1 : 0;
    const prevBlockHash = head ? head.headHash : '0'.repeat(64);

    const entries = this.merkleOrder === 'sorted'
      ? [...this.pending].sort((a, b) => a.id.localeCompare(b.id))
      : [...this.pending];

    const leaves = entries.map(e => hashLeaf(this.hasher, e.id));
    const tree = new MerkleTreeImpl(this.hasher, leaves);

    const header: BlockHeader = {
      version: 1,
      index,
      timeStart: this.pendingStart,
      timeEnd,
      entryCount: entries.length,
      merkleRoot: tree.root(),
    };

    const headerBytes = new TextEncoder().encode('BLOCKHDR|' + stableStringify(header));
    const headerHash = this.hasher.toHex(this.hasher.hash(headerBytes));

    const blockHashBytes = new TextEncoder().encode('BLOCK|' + prevBlockHash + headerHash);
    const blockHash = this.hasher.toHex(this.hasher.hash(blockHashBytes));

    const block: LedgerBlock = { header, prevBlockHash, blockHash, entries };

    await this.store.putBlock(block);

    for (let leafIndex = 0; leafIndex < entries.length; leafIndex++) {
      await this.store.putEntry(entries[leafIndex], index, leafIndex);
    }

    // reset pending
    this.pending = [];
    this.pendingStart = null;

    return block;
  }

  async getProof(entryId: HashHex): Promise<MerkleProof | null> {
    const meta = await this.store.getEntry(entryId);
    if (!meta) return null;

    const block = await this.store.getBlockByIndex(meta.blockIndex);
    if (!block) return null;

    const leaves = block.entries.map(e => hashLeaf(this.hasher, e.id));
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

  async verifyProof(proof: MerkleProof): Promise<boolean> {
    return verifyMerkleProof(this.hasher, proof.entryId, proof.leafIndex, proof.steps, proof.merkleRoot);
  }

  async *queryEntries(q: LedgerQuery): AsyncIterable<LedgerEntry> {
    // baseline: scan blocks; replace with index-assisted lookup if available
    const head = await this.store.getHead();
    if (!head) return;

    for (let i = 0; i <= head.height; i++) {
      const block = await this.store.getBlockByIndex(i);
      if (!block) continue;

      // time filtering at block level if possible
      for (const e of block.entries) {
        if (q.actor && e.actor !== q.actor) continue;
        if (q.counterparty && e.counterparty !== q.counterparty) continue;
        if (q.type && e.type !== q.type) continue;
        if (q.resource) {
          const match = [...e.inputs, ...e.outputs].some(d => d.resource === q.resource);
          if (!match) continue;
        }
        if (q.refsAny && q.refsAny.length) {
          const ok = q.refsAny.some(r => e.refs.includes(r));
          if (!ok) continue;
        }
        yield e;
      }
    }
  }
}
```

---

## 16) Agent Operating Rules (how Codex should work)

When implementing from this blueprint, the codex agent MUST:

1. Keep hashing/serialization deterministic and centralized.
2. Avoid floats in hashed data; use bigint or integer fixed-point.
3. Write unit tests for determinism and proofs before optimizing.
4. Separate ledger truth (entries/blocks) from views (derived state).
5. Ensure indices and views are rebuildable from the ledger.
6. Prefer small, composable interfaces over a monolith.

---

## 17) Locked Design Decisions (v1)

These are fixed for the codex agent implementation:

1. **Block boundary:** per **N ticks** (fixed tick windows) for cross-user consistency.
2. **Merkle ordering:** **append** order.
3. **`ext` policy:** **include** `ext` in the hashed payload.
4. **Money modeling:** currency is a **`ResourceId`**; value is derived via supply/demand views.

Configurable constants (must be explicit config, not ad-hoc):

* `TICKS_PER_BLOCK` (N)
* Deterministic subsystem ordering rules (if needed)
* Validation strictness knobs

---
