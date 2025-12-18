import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TECH_TREE_FIXTURE_DOCUMENT } from './tech-tree-editor.fixtures';
import { TechTreeEditorService } from './tech-tree-editor.service';
import { TechTreeExportPayload, TechTreeNode } from './tech-tree-editor.types';

@Component({
  selector: 'app-tech-tree-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [TechTreeEditorService],
  template: `
    <section class="tech-tree-editor">
      <header class="page-header">
        <div>
          <p class="eyebrow">SDK · Structures</p>
          <h1>Tech Tree Editor</h1>
          <p class="lede">Stable, bottom-anchored shell for reading and adjusting technology entries.</p>
        </div>
        <div class="status">
          <p class="label">Source</p>
          <p class="value">{{ document().lastImportedFrom || 'unlinked (fixtures)' }}</p>
        </div>
      </header>

      <div class="workspace">
        <section class="panel overview">
          <header class="panel-header">
            <p class="eyebrow">Overview</p>
            <h2>Tree Map</h2>
            <p class="hint">Tier-banded list with quick selection.</p>
          </header>
          <div class="tier-bands">
            <div
              class="tier"
              *ngFor="let tier of tierBands()"
              [class.drop-target]="dragOverTier() === tier"
              (dragover)="allowDrop($event)"
              (dragenter)="markTierHover(tier)"
              (drop)="dropOnTier(tier, $event)"
            >
              <p class="tier-label">Tier {{ tier }}</p>
              <div class="node-list">
                <button
                  class="node-chip"
                  type="button"
                  *ngFor="let node of tieredNodes().get(tier) || []"
                  [class.active]="node.id === selectedNode()?.id"
                  [class.dragging]="draggingNodeId() === node.id"
                  (click)="selectNode(node.id)"
                  draggable="true"
                  (dragstart)="startDrag(node.id, $event)"
                  (dragend)="endDrag()"
                >
                  <span class="name">{{ node.name }}</span>
                  <span class="meta">{{ node.category }}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section class="panel detail" *ngIf="selectedNode(); else selectPrompt">
          <header class="panel-header">
            <p class="eyebrow">Node Detail</p>
            <h2>{{ selectedNode()?.name }}</h2>
            <p class="hint">Three-field stub for name, summary, and tier.</p>
          </header>
          <div class="form-grid">
            <label class="field">
              <span class="field-label">Name</span>
              <input
                type="text"
                [ngModel]="selectedNode()?.name"
                (ngModelChange)="updateNode({ name: $event || '' })"
              />
            </label>
            <label class="field">
              <span class="field-label">Tier</span>
              <input
                type="number"
                min="1"
                [ngModel]="selectedNode()?.tier"
                (ngModelChange)="updateNode({ tier: $event ? (Number($event) || 1) : 1 })"
              />
            </label>
            <label class="field field-span">
              <span class="field-label">Summary</span>
              <textarea
                rows="4"
                [ngModel]="selectedNode()?.summary"
                (ngModelChange)="updateNode({ summary: $event || '' })"
              ></textarea>
            </label>
            <label class="field field-span">
              <span class="field-label">Category</span>
              <input
                type="text"
                [ngModel]="selectedNode()?.category"
                (ngModelChange)="updateNode({ category: $event || '' })"
              />
            </label>
          </div>
        </section>

        <ng-template #selectPrompt>
          <section class="panel detail placeholder">
            <p class="hint">Select a node to edit its detail.</p>
          </section>
        </ng-template>

        <section class="panel prerequisites">
          <header class="panel-header">
            <p class="eyebrow">Prerequisites</p>
            <h2>Minimal Tree Diagram</h2>
            <p class="hint">Pixel-grid aligned columns; connectors show upstream unlocks.</p>
          </header>
          <div class="prereq-diagram" [style.gridTemplateColumns]="diagramColumns()">
            <div class="prereq-column" *ngFor="let column of prerequisiteColumns(); let columnIndex = index">
              <div class="prereq-node"
                   *ngFor="let node of column"
                   [class.active]="node.id === selectedNode()?.id"
                   [class.upstream]="isUpstream(node.id)"
                   (click)="selectNode(node.id)">
                <p class="name">{{ node.name }}</p>
                <p class="meta">Tier {{ node.tier }} · {{ node.category }}</p>
                <div class="connectors" *ngIf="node.prerequisites.length && columnIndex > 0">
                  <span *ngFor="let prereq of node.prerequisites" [class.highlight]="prereq === selectedNode()?.id"></span>
                </div>
              </div>
            </div>
          </div>
          <p class="diagram-note">Diagram is intentionally minimal; swap for a richer component after validation.</p>
        </section>
      </div>

      <footer class="action-dock">
        <div>
          <p class="eyebrow">Actions</p>
          <p class="hint">Create, duplicate, delete, and import/export hooks stay structural for SDK integration.</p>
        </div>
        <div class="buttons">
          <button type="button" (click)="createNode()">Create node</button>
          <button type="button" (click)="duplicateNode()" [disabled]="!selectedNode()">Duplicate</button>
          <button type="button" class="danger" (click)="deleteNode()" [disabled]="!selectedNode()">Delete</button>
        </div>
        <div class="buttons">
          <button type="button" (click)="triggerImport()">Import sample</button>
          <button type="button" class="primary" (click)="triggerExport()">Export snapshot</button>
        </div>
      </footer>

      <section class="export-log" *ngIf="lastExport()">
        <p class="eyebrow">Last export</p>
        <div class="log-body">
          <p class="timestamp">{{ lastExport()?.exportedAt }}</p>
          <pre>{{ lastExport() | json }}</pre>
        </div>
      </section>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }

    .tech-tree-editor {
      display: grid;
      grid-template-rows: auto 1fr auto auto;
      gap: 12px;
      padding: 16px;
      box-sizing: border-box;
      color: #e8e0ff;
      background: linear-gradient(180deg, #0c0a12 0%, #0a0716 60%, #06040c 100%);
    }

    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      padding: 12px;
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.02);
    }

    .page-header h1 {
      margin: 0;
      font-size: 22px;
      letter-spacing: 0.02em;
    }

    .lede {
      margin: 4px 0 0;
      opacity: 0.82;
    }

    .eyebrow {
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 11px;
      margin: 0;
      opacity: 0.72;
    }

    .status {
      text-align: right;
      min-width: 200px;
    }

    .status .label {
      margin: 0;
      opacity: 0.72;
    }

    .status .value {
      margin: 4px 0 0;
      font-weight: 600;
    }

    .workspace {
      display: grid;
      grid-template-columns: 1.2fr 1fr 1.1fr;
      gap: 12px;
      min-height: 420px;
    }

    .panel {
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 12px;
      background: rgba(255, 255, 255, 0.03);
      display: grid;
      grid-template-rows: auto 1fr;
      gap: 8px;
    }

    .panel-header h2 {
      margin: 2px 0 0;
      font-size: 18px;
    }

    .hint {
      margin: 2px 0 0;
      opacity: 0.75;
      font-size: 13px;
    }

    .tier-bands {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .tier {
      border: 1px dashed rgba(255, 255, 255, 0.12);
      padding: 8px;
      border-radius: 6px;
      transition: border-color 120ms ease, background 120ms ease;
    }

    .tier.drop-target {
      border-color: #9de5ff;
      background: rgba(157, 229, 255, 0.06);
    }

    .tier-label {
      margin: 0 0 6px;
      opacity: 0.78;
      font-size: 12px;
    }

    .node-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .node-chip {
      padding: 8px 10px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.18);
      background: rgba(255, 255, 255, 0.04);
      color: inherit;
      cursor: pointer;
      text-align: left;
      min-width: 140px;
      display: grid;
      gap: 2px;
    }

    .node-chip .name {
      font-weight: 600;
    }

    .node-chip .meta {
      opacity: 0.7;
      font-size: 12px;
    }

    .node-chip.active {
      border-color: #9de5ff;
      background: rgba(157, 229, 255, 0.12);
      box-shadow: 0 0 0 1px rgba(157, 229, 255, 0.25);
    }

    .node-chip.dragging {
      opacity: 0.7;
      border-style: dashed;
    }

    .detail .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }

    .field {
      display: grid;
      gap: 4px;
    }

    .field-label {
      opacity: 0.8;
      font-size: 13px;
    }

    input,
    textarea {
      width: 100%;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.18);
      padding: 8px;
      background: rgba(0, 0, 0, 0.35);
      color: inherit;
      font-family: inherit;
    }

    .field-span {
      grid-column: span 2;
    }

    .prereq-diagram {
      display: grid;
      gap: 8px;
      align-items: start;
      background: rgba(0, 0, 0, 0.22);
      border-radius: 6px;
      padding: 10px;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .prereq-column {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .prereq-node {
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 6px;
      padding: 8px;
      background: rgba(255, 255, 255, 0.03);
      cursor: pointer;
      display: grid;
      gap: 2px;
    }

    .prereq-node.active {
      border-color: #ffda7b;
      box-shadow: 0 0 0 1px rgba(255, 218, 123, 0.3);
    }

    .prereq-node.upstream {
      border-style: dashed;
      opacity: 0.9;
    }

    .prereq-node .name {
      margin: 0;
      font-weight: 600;
    }

    .prereq-node .meta {
      margin: 0;
      opacity: 0.72;
      font-size: 12px;
    }

    .connectors {
      display: flex;
      gap: 4px;
      margin-top: 4px;
    }

    .connectors span {
      width: 12px;
      height: 12px;
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.05);
    }

    .connectors span.highlight {
      border-color: #9de5ff;
      background: rgba(157, 229, 255, 0.18);
    }

    .diagram-note {
      margin: 8px 0 0;
      opacity: 0.8;
      font-size: 12px;
    }

    .action-dock {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding: 10px 4px 0;
      gap: 12px;
    }

    .buttons {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .buttons button {
      padding: 10px 12px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.16);
      background: rgba(255, 255, 255, 0.08);
      color: inherit;
      cursor: pointer;
      font-weight: 600;
      min-width: 120px;
    }

    .buttons button.primary {
      background: linear-gradient(180deg, #ffd369 0%, #ffaf3a 100%);
      color: #2d1b05;
      border-color: #ffaf3a;
      box-shadow: 0 2px 0 #e19b28;
    }

    .buttons button.danger {
      background: rgba(255, 91, 91, 0.12);
      border-color: rgba(255, 91, 91, 0.4);
      color: #ffdede;
    }

    .export-log {
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 8px;
      padding: 10px;
      background: rgba(0, 0, 0, 0.35);
    }

    .log-body {
      background: rgba(0, 0, 0, 0.4);
      border: 1px dashed rgba(255, 255, 255, 0.18);
      border-radius: 6px;
      padding: 8px;
      overflow: auto;
      max-height: 180px;
    }

    .timestamp {
      margin: 0 0 6px;
      opacity: 0.8;
      font-size: 12px;
    }

    pre {
      margin: 0;
      font-size: 12px;
      line-height: 1.4;
    }

    @media (max-width: 1200px) {
      .workspace {
        grid-template-columns: 1fr;
      }

      .detail .form-grid {
        grid-template-columns: 1fr;
      }

      .field-span {
        grid-column: span 1;
      }
    }
  `],
})
export class TechTreeEditorComponent {
  private service = inject(TechTreeEditorService);

  document = this.service.document;
  tierBands = computed(() => this.service.getTierBands());

  selectedNode = this.service.selectedNode;
  nodes = this.service.nodes;
  draggingNodeId = signal<string | null>(null);
  dragOverTier = signal<number | null>(null);

  lastExport = signal<TechTreeExportPayload | null>(null);

  tieredNodes = computed(() => {
    const bandMap = new Map<number, TechTreeNode[]>();
    this.nodes().forEach((node) => {
      const bucket = bandMap.get(node.tier) ?? [];
      bucket.push(node);
      bandMap.set(node.tier, bucket);
    });
    return bandMap;
  });

  prerequisiteColumns = computed(() => {
    const pending = [...this.nodes()];
    const placed = new Set<string>();
    const columns: TechTreeNode[][] = [];

    while (pending.length) {
      const column: TechTreeNode[] = [];
      for (let index = pending.length - 1; index >= 0; index -= 1) {
        const node = pending[index];
        if (node.prerequisites.every((pr) => placed.has(pr))) {
          column.unshift(node);
          pending.splice(index, 1);
        }
      }

      if (!column.length) {
        const fallback = pending.shift();
        if (fallback) {
          column.push(fallback);
        }
      }

      column.forEach((node) => placed.add(node.id));
      columns.push(column);
    }

    return columns;
  });

  diagramColumns = computed(() => `repeat(${this.prerequisiteColumns().length}, minmax(160px, 1fr))`);

  selectNode(id: string): void {
    this.service.selectNode(id);
  }

  createNode(): void {
    this.service.createNode();
  }

  duplicateNode(): void {
    this.service.duplicateSelected();
  }

  deleteNode(): void {
    this.service.deleteSelected();
  }

  updateNode(partial: Partial<TechTreeNode>): void {
    this.service.updateNode(partial);
  }

  startDrag(nodeId: string, event: DragEvent): void {
    this.draggingNodeId.set(nodeId);
    event.dataTransfer?.setData('text/plain', nodeId);
  }

  endDrag(): void {
    this.draggingNodeId.set(null);
    this.dragOverTier.set(null);
  }

  allowDrop(event: DragEvent): void {
    event.preventDefault();
  }

  markTierHover(tier: number): void {
    this.dragOverTier.set(tier);
  }

  dropOnTier(tier: number, event: DragEvent): void {
    event.preventDefault();
    const nodeId = event.dataTransfer?.getData('text/plain') || this.draggingNodeId();
    if (nodeId) {
      this.service.moveNodeToTier(nodeId, tier);
      this.selectNode(nodeId);
    }
    this.endDrag();
  }

  isUpstream(nodeId: string): boolean {
    const selected = this.selectedNode();
    return selected?.prerequisites.includes(nodeId) ?? false;
  }

  triggerImport(): void {
    this.service.requestImport({
      sourceLabel: 'fixture-import',
      document: TECH_TREE_FIXTURE_DOCUMENT,
    });
  }

  triggerExport(): void {
    this.lastExport.set(this.service.requestExport());
  }
}
