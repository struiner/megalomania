import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MerkleProof, MerkleProofStep, MerkleTree, verifyProof } from '../../services/ledger/merkle-primitives';

interface LedgerEntryView {
  id: string;
  payload: unknown;
  leafHash: string;
  timestamp: string;
}

interface LedgerBlockView {
  height: number;
  hash: string;
  merkleRoot: string;
  entries: LedgerEntryView[];
  proofs: Record<string, MerkleProof>;
  status: 'rebuilt' | 'pending';
}

@Component({
  selector: 'app-ledger-verification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ledger-verification.component.html',
  styleUrls: ['./ledger-verification.component.scss']
})
export class LedgerVerificationComponent implements OnInit {
  readonly treeTag = 'ledger_debug_surface_v1';

  blocks: LedgerBlockView[] = [];
  selectedBlock?: LedgerBlockView;
  selectedEntry?: LedgerEntryView;
  proofPath: MerkleProofStep[] = [];
  verificationState: 'idle' | 'verifying' | 'valid' | 'invalid' = 'idle';

  getPayloadType(payload: unknown): string {
    if (payload && typeof payload === 'object' && 'type' in payload) {
      return String((payload as any).type);
    }
    return 'unknown';
  }

  async ngOnInit(): Promise<void> {
    await this.prepareSampleLedger();
  }

  async selectBlock(block: LedgerBlockView): Promise<void> {
    this.selectedBlock = block;
    this.selectedEntry = block.entries[0];
    await this.runVerification();
  }

  async selectEntry(entry: LedgerEntryView): Promise<void> {
    this.selectedEntry = entry;
    await this.runVerification();
  }

  private async prepareSampleLedger(): Promise<void> {
    const sampleBlocks = [
      {
        height: 1,
        entries: [
          { id: 'evt-1', payload: { type: 'trade', value: 42 }, timestamp: '1880-01-01T00:00:00Z' },
          { id: 'evt-2', payload: { type: 'craft', item: 'oak_spear' }, timestamp: '1880-01-01T00:15:00Z' }
        ]
      },
      {
        height: 2,
        entries: [
          { id: 'evt-3', payload: { type: 'harvest', bushels: 12 }, timestamp: '1880-01-01T00:30:00Z' },
          { id: 'evt-4', payload: { type: 'tax', payer: 'guild', amount: 7 }, timestamp: '1880-01-01T00:45:00Z' }
        ]
      }
    ];

    const computedBlocks: LedgerBlockView[] = [];
    for (const block of sampleBlocks) {
      const view = await this.buildBlockView(block.height, block.entries);
      computedBlocks.push(view);
    }

    this.blocks = computedBlocks;
    if (this.blocks.length) {
      await this.selectBlock(this.blocks[0]);
    }
  }

  private async buildBlockView(height: number, entries: Omit<LedgerEntryView, 'leafHash'>[]): Promise<LedgerBlockView> {
    // Simple fix: cast payload to object before spreading
    const tree = await MerkleTree.fromValues(entries.map(e => ({ ...(e.payload as object), timestamp: e.timestamp })), this.treeTag);
    const proofs: Record<string, MerkleProof> = {};

    const entriesWithHashes: LedgerEntryView[] = entries.map((entry, index) => {
      const proof = tree.getProof(index);
      proofs[entry.id] = proof;
      return { ...entry, leafHash: proof.leafHash };
    });

    const merkleRoot = tree.getRoot();

    return {
      height,
      hash: `block_${height}_${merkleRoot.slice(0, 6)}`,
      merkleRoot,
      entries: entriesWithHashes,
      proofs,
      status: 'rebuilt'
    };
  }

  private async runVerification(): Promise<void> {
    if (!this.selectedBlock || !this.selectedEntry) {
      this.verificationState = 'idle';
      return;
    }

    const proof = this.selectedBlock.proofs[this.selectedEntry.id];
    if (!proof) {
      this.verificationState = 'idle';
      return;
    }

    this.verificationState = 'verifying';
    this.proofPath = proof.path;
    const valid = await verifyProof(proof, this.treeTag);
    this.verificationState = valid ? 'valid' : 'invalid';
  }
}
