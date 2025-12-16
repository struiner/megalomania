import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EntryFactory } from '../../services/ledger/entry-factory';
import { Sha256Hasher } from '../../services/ledger/hash';
import { LedgerImpl, TICKS_PER_BLOCK } from '../../services/ledger/ledger';
import { InMemoryLedgerStore } from '../../services/ledger/store';
import { JsonCanonicalizer } from '../../services/ledger/stable-stringify';
import {
  EntryType,
  GameTime,
  HashHex,
  LedgerBlock,
  ResourceDelta,
} from '../../services/ledger/types';

interface TimelineRow {
  id: HashHex;
  settlement: string;
  stage: 'Founding' | 'Growth' | 'Development';
  year: number;
  type: EntryType;
  title: string;
  description: string;
  blockIndex?: number;
  merkleRoot?: HashHex;
}

interface ProofDetails {
  entryId: HashHex;
  blockIndex: number;
  blockHash: HashHex;
  merkleRoot: HashHex;
  steps: string;
  verified: boolean;
}

@Component({
  selector: 'app-world-ledger',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page">
      <header class="page__header">
        <p class="eyebrow">World → Ledger</p>
        <h1>NPC-ledgered enclave growth</h1>
        <p class="lede">
          Generate a fully sealed Merkle ledger that chronicles the rise of an
          enclave from a single landing to a cluster of settlements. Use the
          controls below to decide how many settlements appear and preview
          Merkle proofs for any event.
        </p>
      </header>

      <form class="controls" (ngSubmit)="rebuild()">
        <div class="controls__group">
          <label>
            <span>Seed</span>
            <input
              name="seed"
              [(ngModel)]="seed"
              placeholder="Narrative seed"
              required
            />
          </label>
          <label>
            <span>Settlements</span>
            <input
              type="range"
              min="1"
              max="20"
              name="settlementCount"
              [(ngModel)]="settlementCount"
            />
            <small>{{ settlementCount }} planned</small>
          </label>
          <label>
            <span>Ledger horizon (years)</span>
            <input
              type="range"
              min="10"
              max="40"
              name="horizonYears"
              [(ngModel)]="horizonYears"
            />
            <small>{{ horizonYears }} years of NPC history</small>
          </label>
        </div>

        <button type="submit">Generate ledger</button>
      </form>

      <section class="layout">
        <article class="card">
          <header class="card__header">
            <div>
              <p class="eyebrow">Merkle blocks</p>
              <h2>{{ blocks.length }} block(s) · {{ timeline.length }} entries</h2>
              <p class="meta">
                Append-only ledger with {{ sealedNote }}. Blocks seal every
                {{ blockWindow }} ticks; pending entries are flushed at the end
                of the run.
              </p>
            </div>
            <div class="legend legend--compact">
              <div class="legend__item"><span class="pill pill--mint"></span>Founding</div>
              <div class="legend__item"><span class="pill pill--produce"></span>Growth</div>
              <div class="legend__item"><span class="pill pill--trade"></span>Development</div>
            </div>
          </header>

          <div class="block-list" *ngIf="blocks.length; else emptyLedger">
            <div class="block" *ngFor="let block of blocks">
              <div class="block__header">
                <div>
                  <p class="eyebrow">Block {{ block.header.index }}</p>
                  <h3>{{ block.header.entryCount }} entries</h3>
                </div>
                <p class="hash">Merkle: {{ shortHash(block.header.merkleRoot) }}</p>
              </div>
              <p class="meta">
                {{ describeWindow(block.header.timeStart, block.header.timeEnd) }}
                · Prev {{ shortHash(block.prevBlockHash) }} · Hash
                {{ shortHash(block.blockHash) }}
              </p>
            </div>
          </div>
          <ng-template #emptyLedger>
            <p class="muted">No blocks yet—generate the ledger to see them.</p>
          </ng-template>
        </article>

        <article class="card">
          <header class="card__header">
            <div>
              <p class="eyebrow">Ledger timeline</p>
              <h2>Enclave story beats</h2>
              <p class="meta">
                Click “Merkle proof” on any row to reconstruct its path to the
                block root and verify integrity using the on-page hasher.
              </p>
            </div>
          </header>

          <div class="timeline" *ngIf="timeline.length; else emptyTimeline">
            <div
              class="timeline__row"
              *ngFor="let entry of timeline"
              [class.timeline__row--mint]="entry.stage === 'Founding'"
              [class.timeline__row--produce]="entry.stage === 'Growth'"
              [class.timeline__row--trade]="entry.stage === 'Development'"
            >
              <div class="timeline__meta">
                <p class="eyebrow">{{ entry.year }} · {{ entry.stage }}</p>
                <h3>{{ entry.title }}</h3>
                <p class="muted">{{ entry.description }}</p>
                <p class="meta">
                  Type {{ entry.type }}
                  <span *ngIf="entry.blockIndex !== undefined">
                    · Block {{ entry.blockIndex }}
                  </span>
                  <span *ngIf="entry.merkleRoot">· Root {{ shortHash(entry.merkleRoot) }}</span>
                </p>
              </div>
              <div class="timeline__actions">
                <button type="button" (click)="showProof(entry)">Merkle proof</button>
              </div>
            </div>
          </div>
          <ng-template #emptyTimeline>
            <p class="muted">Timeline will appear after generating the ledger.</p>
          </ng-template>
        </article>

        <article class="card" *ngIf="proof">
          <header class="card__header">
            <div>
              <p class="eyebrow">Proof</p>
              <h2>Inclusion proof for entry {{ shortHash(proof.entryId) }}</h2>
              <p class="meta">
                Block {{ proof.blockIndex }} · Root {{ shortHash(proof.merkleRoot) }} ·
                {{ proof.verified ? 'Valid' : 'Failed' }}
              </p>
            </div>
          </header>
          <dl class="proof">
            <div class="proof__row">
              <dt>Block hash</dt>
              <dd>{{ proof.blockHash }}</dd>
            </div>
            <div class="proof__row">
              <dt>Merkle steps</dt>
              <dd>{{ proof.steps }}</dd>
            </div>
            <div class="proof__row">
              <dt>Status</dt>
              <dd [class.text-success]="proof.verified" [class.text-error]="!proof.verified">
                {{ proof.verified ? 'Proof verified against Merkle root' : 'Unable to verify proof' }}
              </dd>
            </div>
          </dl>
        </article>
      </section>
    </section>
  `,
  styles: [
    `
      .controls {
        display: grid;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .controls__group {
        display: grid;
        gap: 0.5rem;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      }

      label {
        display: grid;
        gap: 0.35rem;
        color: var(--muted-color);
      }

      input[type='range'],
      input[type='text'] {
        width: 100%;
      }

      .layout {
        display: grid;
        gap: 1rem;
      }

      .card {
        border: 1px solid var(--border-color, #e3e3e3);
        border-radius: 12px;
        padding: 1.25rem;
        background: var(--card-bg, #fff);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
      }

      .card__header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 0.75rem;
      }

      .legend {
        display: flex;
        gap: 0.75rem;
        align-items: center;
      }

      .legend--compact .legend__item {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        font-size: 0.9rem;
      }

      .pill {
        display: inline-flex;
        width: 0.75rem;
        height: 0.75rem;
        border-radius: 999px;
      }
      .pill--mint {
        background: #e9f5ed;
      }
      .pill--produce {
        background: #eef5ff;
      }
      .pill--trade {
        background: #fff2e6;
      }

      .block-list {
        display: grid;
        gap: 0.75rem;
      }

      .block {
        border: 1px solid var(--border-color, #e3e3e3);
        border-radius: 10px;
        padding: 0.85rem;
      }

      .block__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .hash {
        font-family: var(--mono, 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace);
        color: var(--muted-color);
      }

      .timeline {
        display: grid;
        gap: 0.75rem;
      }

      .timeline__row {
        border: 1px solid var(--border-color, #e3e3e3);
        border-radius: 12px;
        padding: 0.9rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
      }

      .timeline__row--mint {
        border-color: #b8e6c5;
        background: #f4fcf6;
      }

      .timeline__row--produce {
        border-color: #c9dfff;
        background: #f7faff;
      }

      .timeline__row--trade {
        border-color: #ffd7b3;
        background: #fff9f2;
      }

      .timeline__meta h3 {
        margin: 0 0 0.35rem;
      }

      .timeline__meta .muted {
        margin: 0.2rem 0;
      }

      .timeline__actions {
        display: flex;
        align-items: center;
      }

      .proof {
        display: grid;
        gap: 0.5rem;
      }

      .proof__row {
        display: grid;
        gap: 0.25rem;
      }

      dt {
        font-weight: 600;
        color: var(--muted-color);
      }

      dd {
        margin: 0;
        font-family: var(--mono, 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace);
      }

      .muted {
        color: var(--muted-color);
      }

      .meta {
        color: var(--muted-color);
        font-size: 0.95rem;
      }

      .text-success {
        color: #198754;
      }

      .text-error {
        color: #c1121f;
      }
    `,
  ],
})
export class WorldLedgerComponent implements OnInit {
  seed = 'enclave-ledger';
  settlementCount = 15;
  horizonYears = 24;
  timeline: TimelineRow[] = [];
  blocks: LedgerBlock[] = [];
  proof: ProofDetails | null = null;
  sealedNote = 'pending generation';
  readonly blockWindow = `${TICKS_PER_BLOCK}`;

  private ledger: LedgerImpl | null = null;
  private store: InMemoryLedgerStore | null = null;

  ngOnInit(): void {
    void this.rebuild();
  }

  shortHash(hash: string | undefined, head = 8): string {
    if (!hash) return '';
    return `${hash.slice(0, head)}…${hash.slice(-4)}`;
  }

  describeWindow(start: GameTime, end: GameTime): string {
    const startTick = start.globalTick ?? start.tick;
    const endTick = end.globalTick ?? end.tick;
    return `Ticks ${startTick}–${endTick}`;
  }

  async rebuild(): Promise<void> {
    const count = Math.max(1, Math.min(20, Math.round(this.settlementCount)));
    this.timeline = [];
    this.blocks = [];
    this.proof = null;
    this.sealedNote = 'sealing…';

    const canon = new JsonCanonicalizer();
    const hasher = new Sha256Hasher();
    const entryFactory = new EntryFactory(canon, hasher);
    const store = new InMemoryLedgerStore();
    const ledger = new LedgerImpl(store, entryFactory, hasher, 'append');

    this.ledger = ledger;
    this.store = store;

    const rng = this.makeRng(this.seed + count + this.horizonYears);
    const settlementNames = this.buildSettlementNames(count, rng);

    let tick = 0;
    const startYear = 402;

    for (let i = 0; i < settlementNames.length; i += 1) {
      const name = settlementNames[i];
      const foundingYear = startYear + Math.floor((this.horizonYears * i) / settlementNames.length);
      const foundingResources: ResourceDelta[] = [
        { resource: 'favor', amount: BigInt(500 + Math.floor(rng() * 350)) },
        { resource: 'infrastructure', amount: BigInt(200 + Math.floor(rng() * 180)) },
      ];

      const founding = await ledger.appendEntry({
        type: 'MINT',
        actor: `settlement/${name}`,
        time: { day: i, tick: tick % TICKS_PER_BLOCK, globalTick: tick },
        inputs: [],
        outputs: foundingResources,
        refs: [],
        ext: {
          year: foundingYear,
          stage: 'Founding',
          note: `${name} is founded by frontier traders securing a charter.`,
        },
      });

      this.timeline.push({
        id: founding.id,
        settlement: name,
        stage: 'Founding',
        year: foundingYear,
        type: founding.type,
        title: `${name} chartered`,
        description: `${name} appears on the coast with ${this.describeResources(foundingResources)} committed.`,
      });

      tick += 18 + Math.floor(rng() * 12);

      const harvest: ResourceDelta[] = [
        { resource: 'grain', amount: BigInt(800 + Math.floor(rng() * 400)) },
        { resource: 'timber', amount: BigInt(250 + Math.floor(rng() * 120)) },
      ];

      const growth = await ledger.appendEntry({
        type: 'PRODUCE',
        actor: `settlement/${name}`,
        time: { day: i + 1, tick: tick % TICKS_PER_BLOCK, globalTick: tick },
        inputs: [],
        outputs: harvest,
        refs: [founding.id],
        ext: {
          year: foundingYear + 2,
          stage: 'Growth',
          note: `${name} expands cropland and mills.`,
        },
      });

      this.timeline.push({
        id: growth.id,
        settlement: name,
        stage: 'Growth',
        year: foundingYear + 2,
        type: growth.type,
        title: `${name} harvest surge`,
        description: `${name} yields ${this.describeResources(harvest)} after irrigation and lumber mills.`,
      });

      tick += 22 + Math.floor(rng() * 14);

      const peer = settlementNames[Math.max(0, Math.floor(rng() * i))] ?? name;
      const routeTrade: ResourceDelta[] = [
        { resource: 'coin', amount: BigInt(400 + Math.floor(rng() * 260)) },
      ];
      const tariffs: ResourceDelta[] = [
        { resource: 'coin', amount: BigInt(90 + Math.floor(rng() * 70)) },
      ];

      const development = await ledger.appendEntry({
        type: 'TRANSFER',
        actor: `settlement/${name}`,
        counterparty: `settlement/${peer}`,
        time: { day: i + 2, tick: tick % TICKS_PER_BLOCK, globalTick: tick },
        inputs: tariffs,
        outputs: routeTrade,
        refs: [growth.id],
        ext: {
          year: foundingYear + 5,
          stage: 'Development',
          note: `${name} opens a caravan lane to ${peer} and taxes traffic to fund walls.`,
        },
      });

      this.timeline.push({
        id: development.id,
        settlement: name,
        stage: 'Development',
        year: foundingYear + 5,
        type: development.type,
        title: `${name}–${peer} trade lane`,
        description: `${name} moves ${this.describeResources(routeTrade)} while collecting ${this.describeResources(tariffs)} in tolls.`,
      });

      tick += 24 + Math.floor(rng() * 16);
    }

    await ledger.sealBlock({ day: settlementNames.length + 2, tick: tick % TICKS_PER_BLOCK, globalTick: tick });

    const head = await store.getHead();
    if (head) {
      for (let i = 0; i <= head.height; i += 1) {
        const block = await store.getBlockByIndex(i);
        if (block) {
          this.blocks.push(block);
        }
      }
    }

    for (const item of this.timeline) {
      const meta = await store.getEntry(item.id);
      if (meta) {
        item.blockIndex = meta.blockIndex;
        const owningBlock = await store.getBlockByIndex(meta.blockIndex);
        item.merkleRoot = owningBlock?.header.merkleRoot;
      }
    }

    const finalHead = await store.getHead();
    const blockLabel = finalHead ? `${finalHead.height + 1} block(s)` : '0 blocks';
    this.sealedNote = `${blockLabel} sealed with canonical encoding and SHA-256 Merkle roots.`;
  }

  async showProof(entry: TimelineRow): Promise<void> {
    if (!this.ledger) return;
    const proof = await this.ledger.getProof(entry.id);
    if (!proof) {
      this.proof = null;
      return;
    }

    const verified = await this.ledger.verifyProof(proof);
    this.proof = {
      entryId: entry.id,
      blockIndex: proof.blockIndex,
      blockHash: proof.blockHash,
      merkleRoot: proof.merkleRoot,
      steps: proof.steps.map((s, idx) => `${idx + 1}:${s.side}@${this.shortHash(s.sibling, 10)}`).join(' → '),
      verified,
    };
  }

  private describeResources(deltas: ResourceDelta[]): string {
    return deltas
      .map((d) => `${d.resource} ${Number(d.amount).toLocaleString()}`)
      .join(' & ');
  }

  private makeRng(seed: string): () => number {
    let h = 1779033703 ^ seed.length;
    for (let i = 0; i < seed.length; i += 1) {
      h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return () => {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      const t = (h ^= h >>> 16) >>> 0;
      return (t & 0xfffffff) / 0x10000000;
    };
  }

  private buildSettlementNames(count: number, rng: () => number): string[] {
    const bases = [
      'Hearthport',
      'Amberfall',
      'Driftwick',
      'Stonebreach',
      'Juniper Hold',
      'Kestral Reach',
      'Brightmarsh',
      'Cindertrail',
      'Frostwater',
      'Goldhaven',
      'Ashenford',
      'Crystalfen',
      'Hollow Spire',
      'Moonwell',
      'Redrise',
      'Starhollow',
      'Thornmere',
      'Valewood',
      'Wicklowe',
      'Yarrowgate',
    ];

    const names: string[] = [];
    for (let i = 0; i < count; i += 1) {
      const pick = bases[i % bases.length];
      const suffix = i >= bases.length ? ` ${String.fromCharCode(65 + (i % 26))}` : '';
      names.push(`${pick}${suffix}`);
    }

    return names.sort(() => rng() - 0.5);
  }
}
