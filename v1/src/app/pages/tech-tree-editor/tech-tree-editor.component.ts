import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CultureTagId, CultureTagNamespace } from '../../models/tech-tree.models';
import { TechIconPickerComponent } from './tech-icon-picker.component';
import { TechTreeConnectionOverlayComponent } from './tech-tree-connection-overlay.component';
import { TechTreePreviewDialogComponent } from './tech-tree-preview-dialog.component';
import { TECH_TREE_FIXTURE_DOCUMENT } from './tech-tree-editor.fixtures';
import { TechTreeEditorService } from './tech-tree-editor.service';
import { EditorTechNode, EditorTechNodeEffects, PrerequisiteOverlayEdge, PrerequisiteOverlayNode } from './tech-tree-editor.types';

@Component({
  selector: 'app-tech-tree-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TechIconPickerComponent,
    TechTreeConnectionOverlayComponent,
    TechTreePreviewDialogComponent,
  ],
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
          <p class="label">Tree</p>
          <p class="value">{{ document().tech_tree_id }} · v{{ document().version }}</p>
          <p class="label">Source</p>
          <p class="value">{{ document().metadata?.source_label || 'unlinked (fixtures)' }}</p>
        </div>
      </header>

      <div class="workspace">
        <section class="panel overview">
          <header class="panel-header">
            <div>
              <p class="eyebrow">Overview</p>
              <h2>Tree Map</h2>
              <p class="hint">Grid rows map tiers; columns map deterministic display order.</p>
            </div>
            <div class="tier-controls">
              <button type="button" class="pill" (click)="addTierBand()">+ Tier</button>
              <button type="button" class="pill" (click)="trimTierBands()" [disabled]="!canTrimTierBands()">
                Trim empty
              </button>
            </div>
          </header>
          <div class="grid-meta">
            <p class="hint">Drag nodes into cells; rows clamp to tier, columns clamp to display_order.</p>
            <p class="hint">Empty bands are allowed for planning, but exports stay deterministic.</p>
          </div>
          <div class="tier-grid" [style.gridTemplateColumns]="gridTemplateColumns()">
            <div class="column-label spacer">Tiers ▼ / Order →</div>
            <div class="column-label" *ngFor="let column of gridColumnLabels()">Order {{ column }}</div>
            <ng-container *ngFor="let tier of tierBands()">
              <div class="row-label">Tier {{ tier }}</div>
              <div
                class="grid-cell"
                *ngFor="let column of gridColumnLabels()"
                [class.drop-target]="isGridHover(tier, column)"
                (dragover)="allowDrop($event)"
                (dragenter)="markGridHover(tier, column)"
                (dragleave)="clearGridHover(tier, column)"
                (drop)="dropOnGrid(tier, column, $event)"
              >
                <button
                  class="node-chip"
                  type="button"
                  *ngIf="nodeAt(tier, column) as node"
                  [class.active]="node.id === selectedNode()?.id"
                  [class.dragging]="draggingNodeId() === node.id"
                  draggable="true"
                  (dragstart)="startDrag(node.id, $event)"
                  (dragend)="endDrag()"
                  (click)="selectNode(node.id)"
                >
                  <span class="name">{{ node.title }}</span>
                  <span class="meta">{{ node.category || 'Unsorted' }}</span>
                  <span class="meta tags">{{ describeTags(node.culture_tags) }}</span>
                </button>
              </div>
            </ng-container>
          </div>
        </section>

        <section class="panel detail" *ngIf="selectedNode(); else selectPrompt">
          <header class="panel-header">
            <p class="eyebrow">Node Detail</p>
            <h2>{{ selectedNode()?.title }}</h2>
            <p class="hint">Structured fields plus culture tags and enum-bound effects.</p>
          </header>
          <div class="form-grid">
            <label class="field">
              <span class="field-label">Title</span>
              <input
                type="text"
                [ngModel]="selectedNode()?.title"
                (ngModelChange)="updateNode({ title: $event || '' })"
              />
            </label>
            <label class="field">
              <span class="field-label">Tier</span>
              <input
                type="number"
                min="1"
                [ngModel]="selectedNode()?.tier"
                (ngModelChange)="updateNode({ tier: $event ? ($event || 1) : 1 })"
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
            <div class="field field-span icon-field">
              <span class="field-label">Tech icon</span>
              <app-tech-icon-picker
                [icons]="iconOptions()"
                [value]="selectedNode()?.metadata?.icon_id || null"
                (valueChange)="updateIcon($event)"
              ></app-tech-icon-picker>
              <p class="hint">Shared frame with culture overlays; deterministic ordering.</p>
            </div>
            <div class="field field-span tag-picker">
              <span class="field-label">Culture tags</span>
              <div class="tag-grid">
                <label class="tag-option" *ngFor="let tag of cultureTagOptions()">
                  <input type="checkbox" [checked]="selectedCultureTagSet().has(tag.id)" (change)="toggleCultureTag(tag.id)" />
                  <div class="tag-label">
                    <span class="name">{{ tag.label }}</span>
                    <span class="status-badge" *ngIf="tag.status !== 'authoritative'">{{ tag.status }}</span>
                  </div>
                  <span class="meta">v{{ tag.version }}</span>
                </label>
              </div>
              <div class="tag-actions">
                <button type="button" class="ghost" (click)="openTagDialog('create')">Govern culture tags</button>
                <p class="hint">Defaults: {{ describeTags(document().default_culture_tags) || 'none' }} · Governance emits notices without owning truth.</p>
              </div>
            </div>
            <div class="field field-span effect-grid">
              <span class="field-label">Effects (enum aligned)</span>
              <div class="effect-row">
                <label class="effect-field">
                  <span>Unlock structures</span>
                  <select
                    multiple
                    [ngModel]="selectedNode()?.effects?.unlock_structures || []"
                    (ngModelChange)="updateEffectsList('unlock_structures', $event || [])"
                  >
                    <option *ngFor="let option of effectOptions().structures" [ngValue]="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </label>
                <label class="effect-field">
                  <span>Unlock goods</span>
                  <select
                    multiple
                    [ngModel]="selectedNode()?.effects?.unlock_goods || []"
                    (ngModelChange)="updateEffectsList('unlock_goods', $event || [])"
                  >
                    <option *ngFor="let option of effectOptions().goods" [ngValue]="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </label>
                <label class="effect-field">
                  <span>Settlement unlocks</span>
                  <select
                    multiple
                    [ngModel]="selectedNode()?.effects?.unlock_settlements || []"
                    (ngModelChange)="updateEffectsList('unlock_settlements', $event || [])"
                  >
                    <option *ngFor="let option of effectOptions().settlements" [ngValue]="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </label>
                <label class="effect-field">
                  <span>Guild unlocks</span>
                  <select
                    multiple
                    [ngModel]="selectedNode()?.effects?.unlock_guilds || []"
                    (ngModelChange)="updateEffectsList('unlock_guilds', $event || [])"
                  >
                    <option *ngFor="let option of effectOptions().guilds" [ngValue]="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </label>
              </div>
            </div>
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
            <app-tech-tree-connection-overlay
              class="connection-overlay"
              [nodes]="overlayGraph().nodes"
              [edges]="overlayGraph().edges"
              [columns]="overlayGraph().columns"
              [selectedId]="selectedNode()?.id || null"
            ></app-tech-tree-connection-overlay>
            <div class="prereq-column" *ngFor="let column of prerequisiteColumns(); let columnIndex = index">
                <div class="prereq-node"
                   *ngFor="let node of column"
                   [class.active]="node.id === selectedNode()?.id"
                   [class.upstream]="isUpstream(node.id)"
                   (click)="selectNode(node.id)">
                <p class="name">{{ node.title }}</p>
                <p class="meta">Tier {{ node.tier }} · {{ node.category || 'Unsorted' }}</p>
                <div class="connectors" *ngIf="node.prerequisites.length && columnIndex > 0">
                  <span
                    *ngFor="let prereq of node.prerequisites"
                    [class.highlight]="prereq.node === selectedNode()?.id"
                  ></span>
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
          <button type="button" class="primary ghost" (click)="openPreview()">Preview dialog</button>
          <button type="button" class="primary" (click)="triggerExport()">Export snapshot</button>
        </div>
      </footer>

      <section class="export-log" *ngIf="lastExport()">
        <p class="eyebrow">Last export (deterministic)</p>
        <div class="log-body">
          <p class="timestamp">Issues: {{ lastExport()?.issues?.length }}</p>
          <pre>{{ lastExport()?.json }}</pre>
        </div>
      </section>

      <section class="issue-list" *ngIf="validationIssues().length">
        <p class="eyebrow">Validation</p>
        <ul>
          <li *ngFor="let issue of validationIssues()">
            <span class="severity" [class.error]="issue.severity === 'error'">{{ issue.severity }}</span>
            <span class="path">{{ issue.path }}</span>
            <span class="message">{{ issue.message }}</span>
          </li>
        </ul>
      </section>

      <section class="issue-list" *ngIf="governanceIssues().length">
        <p class="eyebrow">Governance notices</p>
        <ul>
          <li *ngFor="let issue of governanceIssues()">
            <span class="severity" [class.error]="issue.severity === 'error'">{{ issue.severity }}</span>
            <span class="path">{{ issue.path }}</span>
            <span class="message">{{ issue.message }}</span>
          </li>
        </ul>
      </section>

      <div class="modal-backdrop" *ngIf="tagDialogMode() !== 'closed'">
        <div class="modal">
          <header class="modal-header">
            <div>
              <p class="eyebrow">Culture tag governance</p>
              <h3>Adapter-backed proposals</h3>
              <p class="hint">Operations route through the governance adapter with deterministic ordering and audit hooks.</p>
            </div>
            <button type="button" class="ghost" (click)="closeTagDialog()">Close</button>
          </header>

          <div class="tab-row">
            <button type="button" [class.active]="tagDialogMode() === 'create'" (click)="switchTagMode('create')">Create</button>
            <button
              type="button"
              [class.active]="tagDialogMode() === 'edit'"
              [disabled]="!cultureTagOptions().length"
              (click)="switchTagMode('edit')"
            >
              Edit
            </button>
            <button
              type="button"
              [class.active]="tagDialogMode() === 'delete'"
              [disabled]="!cultureTagOptions().length"
              (click)="switchTagMode('delete')"
            >
              Delete
            </button>
          </div>

          <div class="modal-body" *ngIf="tagDialogMode() === 'create'">
            <div class="modal-grid">
              <label class="field">
                <span class="field-label">Namespace</span>
                <select [ngModel]="tagNamespace()" (ngModelChange)="tagNamespace.set($event)">
                  <option value="biome">Biome</option>
                  <option value="settlement">Settlement</option>
                  <option value="guild">Guild</option>
                </select>
              </label>
              <label class="field">
                <span class="field-label">Slug (snake_case)</span>
                <input type="text" [ngModel]="tagSlug()" (ngModelChange)="tagSlug.set($event || '')" />
              </label>
              <label class="field">
                <span class="field-label">Version</span>
                <input type="number" min="1" [ngModel]="tagVersion()" (ngModelChange)="tagVersion.set($event ? ($event || 1) : 1)" />
              </label>
              <label class="field field-span">
                <span class="field-label">Note</span>
                <textarea rows="3" [ngModel]="tagNote()" (ngModelChange)="tagNote.set($event || '')"></textarea>
              </label>
            </div>
            <div class="modal-actions">
              <button type="button" class="primary" (click)="submitTagCreate()">Propose create</button>
            </div>
          </div>

          <div class="modal-body" *ngIf="tagDialogMode() === 'edit'">
            <div class="modal-grid">
              <label class="field">
                <span class="field-label">Tag</span>
                <select [ngModel]="tagTarget()" (ngModelChange)="setTagTarget($event)">
                  <option *ngFor="let tag of cultureTagOptions()" [ngValue]="tag.id">
                    {{ tag.label }} · v{{ tag.version }} ({{ tag.status }})
                  </option>
                </select>
              </label>
              <label class="field">
                <span class="field-label">Version</span>
                <input type="number" min="1" [ngModel]="tagVersion()" (ngModelChange)="tagVersion.set($event ? ($event || 1) : 1)" />
              </label>
              <label class="field field-span">
                <span class="field-label">Note</span>
                <textarea rows="3" [ngModel]="tagNote()" (ngModelChange)="tagNote.set($event || '')"></textarea>
              </label>
            </div>
            <div class="modal-actions">
              <button type="button" class="primary" (click)="submitTagEdit()" [disabled]="!tagTarget()">Propose edit</button>
            </div>
          </div>

          <div class="modal-body" *ngIf="tagDialogMode() === 'delete'">
            <div class="modal-grid">
              <label class="field">
                <span class="field-label">Tag</span>
                <select [ngModel]="tagTarget()" (ngModelChange)="setTagTarget($event)">
                  <option *ngFor="let tag of cultureTagOptions()" [ngValue]="tag.id">
                    {{ tag.label }} · v{{ tag.version }} ({{ tag.status }})
                  </option>
                </select>
              </label>
              <div class="field field-span">
                <span class="field-label">Usage</span>
                <p class="hint" *ngIf="selectedTagUsage().length; else unusedTag">
                  {{ selectedTagUsage().join(', ') }}
                </p>
                <ng-template #unusedTag>
                  <p class="hint">No references detected in current tree.</p>
                </ng-template>
              </div>
            </div>
            <div class="modal-actions">
              <button type="button" class="danger" (click)="submitTagDelete()" [disabled]="!tagTarget()">Request delete</button>
            </div>
          </div>

          <div class="issue-list slim" *ngIf="governanceIssues().length">
            <p class="eyebrow">Adapter notices</p>
            <ul>
              <li *ngFor="let issue of governanceIssues()">
                <span class="severity" [class.error]="issue.severity === 'error'">{{ issue.severity }}</span>
                <span class="path">{{ issue.path }}</span>
                <span class="message">{{ issue.message }}</span>
              </li>
            </ul>
          </div>

          <div class="audit-log" *ngIf="cultureTagAuditTrail().length">
            <p class="eyebrow">Audit trail</p>
            <ul>
              <li *ngFor="let entry of cultureTagAuditTrail()">{{ entry }}</li>
            </ul>
          </div>
        </div>
      </div>
      <app-tech-tree-preview-dialog
        *ngIf="isPreviewOpen()"
        [document]="document()"
        [nodes]="nodes()"
        [tierBands]="tierBands()"
        [cultureTagOptions]="cultureTagOptions()"
        [effectOptions]="effectOptions()"
        (close)="closePreview()"
      ></app-tech-tree-preview-dialog>
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
      display: grid;
      gap: 2px;
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

    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }

    .tier-controls {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .pill {
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.18);
      background: rgba(255, 255, 255, 0.06);
      color: inherit;
      padding: 6px 10px;
      cursor: pointer;
      font-weight: 600;
    }

    .pill:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .hint {
      margin: 2px 0 0;
      opacity: 0.75;
      font-size: 13px;
    }

    .grid-meta {
      display: grid;
      gap: 2px;
    }

    .tier-grid {
      display: grid;
      gap: 8px;
      align-items: stretch;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 6px;
      padding: 8px;
      border: 1px dashed rgba(255, 255, 255, 0.12);
    }

    .column-label,
    .row-label {
      font-size: 12px;
      opacity: 0.78;
      padding: 6px 8px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.06);
      align-self: stretch;
      display: flex;
      align-items: center;
    }

    .column-label {
      justify-content: center;
      text-align: center;
    }

    .column-label.spacer {
      justify-content: flex-start;
      text-align: left;
      background: transparent;
      border-style: dashed;
      border-color: rgba(255, 255, 255, 0.08);
    }

    .grid-cell {
      min-height: 78px;
      border-radius: 6px;
      border: 1px dashed rgba(255, 255, 255, 0.08);
      background: rgba(255, 255, 255, 0.02);
      padding: 4px;
      transition: border-color 120ms ease, background 120ms ease;
      display: flex;
      align-items: stretch;
    }

    .grid-cell.drop-target {
      border-color: #9de5ff;
      background: rgba(157, 229, 255, 0.08);
      box-shadow: inset 0 0 0 1px rgba(157, 229, 255, 0.14);
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

    .node-chip .meta.tags {
      display: block;
      opacity: 0.6;
      font-size: 11px;
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

    .tag-picker {
      gap: 6px;
    }

    .tag-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 6px;
    }

    .tag-option {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.02);
    }

    .tag-label {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .status-badge {
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.16);
      background: rgba(255, 255, 255, 0.06);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .tag-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
    }

    .effect-grid {
      display: grid;
      gap: 6px;
    }

    .effect-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 8px;
    }

    .effect-field {
      display: grid;
      gap: 4px;
    }

    select[multiple] {
      min-height: 72px;
      padding: 6px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.18);
      background: rgba(0, 0, 0, 0.35);
      color: inherit;
    }

    .prereq-diagram {
      display: grid;
      gap: 8px;
      align-items: start;
      background: rgba(0, 0, 0, 0.22);
      border-radius: 6px;
      padding: 10px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      position: relative;
      overflow: hidden;
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
      position: relative;
      z-index: 1;
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

    .connection-overlay {
      z-index: 0;
    }

    .icon-field .hint {
      margin-top: 4px;
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

    button.ghost {
      background: transparent;
      border-style: dashed;
      min-width: auto;
    }

    .buttons button.primary {
      background: linear-gradient(180deg, #ffd369 0%, #ffaf3a 100%);
      color: #2d1b05;
      border-color: #ffaf3a;
      box-shadow: 0 2px 0 #e19b28;
    }

    .buttons button.primary.ghost {
      background: rgba(255, 255, 255, 0.08);
      color: #ffe7be;
      border-color: rgba(255, 255, 255, 0.22);
      box-shadow: none;
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

    .issue-list {
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 10px;
      background: rgba(0, 0, 0, 0.28);
    }

    .issue-list ul {
      list-style: none;
      padding: 0;
      margin: 8px 0 0;
      display: grid;
      gap: 6px;
    }

    .issue-list li {
      display: grid;
      grid-template-columns: auto auto 1fr;
      gap: 8px;
      align-items: center;
      font-size: 12px;
    }

    .issue-list .severity {
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 2px 6px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.08);
    }

    .issue-list .severity.error {
      background: rgba(255, 102, 102, 0.18);
      border: 1px solid rgba(255, 102, 102, 0.4);
    }

    .issue-list .path {
      opacity: 0.8;
      font-family: 'Fira Code', monospace;
    }

    .issue-list .message {
      opacity: 0.9;
    }

    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      box-sizing: border-box;
      z-index: 10;
    }

    .modal {
      width: min(920px, 100%);
      background: #0f0c18;
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 10px;
      padding: 12px;
      display: grid;
      gap: 12px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
    }

    .modal-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }

    .tab-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .tab-row button {
      padding: 8px 10px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.18);
      background: rgba(255, 255, 255, 0.05);
      color: inherit;
      min-width: 100px;
      cursor: pointer;
    }

    .tab-row button.active {
      background: rgba(157, 229, 255, 0.12);
      border-color: rgba(157, 229, 255, 0.35);
      box-shadow: 0 0 0 1px rgba(157, 229, 255, 0.12);
    }

    .modal-body {
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 10px;
      background: rgba(255, 255, 255, 0.02);
      display: grid;
      gap: 10px;
    }

    .modal-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 8px;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      flex-wrap: wrap;
    }

    .audit-log {
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 6px;
      padding: 8px;
      background: rgba(255, 255, 255, 0.02);
    }

    .audit-log ul {
      list-style: none;
      padding: 0;
      margin: 6px 0 0;
      display: grid;
      gap: 4px;
      font-size: 12px;
    }

    .issue-list.slim {
      margin-top: 0;
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
  cultureTagOptions = this.service.cultureTagOptions;
  effectOptions = this.service.effectOptions;
  iconOptions = this.service.iconOptions;
  tierBands = computed(() => this.service.getTierBands());
  gridColumns = computed(() => this.service.getGridColumnCount());
  gridColumnLabels = computed(() => Array.from({ length: this.gridColumns() }, (_, index) => index + 1));
  gridTemplateColumns = computed(() => `120px repeat(${this.gridColumns()}, minmax(160px, 1fr))`);

  selectedNode = this.service.selectedNode;
  nodes = this.service.nodes;
  draggingNodeId = signal<string | null>(null);
  dragOverSlot = signal<{ tier: number; column: number } | null>(null);
  validationIssues = this.service.validationIssues;
  lastExport = this.service.lastExport;
  governanceIssues = this.service.governanceIssues;
  cultureTagAuditTrail = this.service.cultureTagAuditTrail;
  cultureTagUsage = this.service.cultureTagUsage;

  tagDialogMode = signal<'closed' | 'create' | 'edit' | 'delete'>('closed');
  tagNamespace = signal<CultureTagNamespace>('biome');
  tagSlug = signal('');
  tagNote = signal('');
  tagVersion = signal(1);
  tagTarget = signal<CultureTagId | null>(null);

  selectedCultureTagSet = computed(() => new Set(this.selectedNode()?.culture_tags?.length
    ? this.selectedNode()?.culture_tags
    : this.document().default_culture_tags));

  prerequisiteColumns = computed(() => {
    const pending = [...this.nodes()];
    const placed = new Set<string>();
    const columns: EditorTechNode[][] = [];

    while (pending.length) {
      const column: EditorTechNode[] = [];
      for (let index = pending.length - 1; index >= 0; index -= 1) {
        const node = pending[index];
        const prerequisites = node.prerequisites || [];
        if (prerequisites.every((prerequisite) => placed.has(prerequisite.node))) {
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
  overlayGraph = computed(() => {
    const columns = this.prerequisiteColumns();
    const positions = new Map<string, { column: number; row: number; tier: number }>();

    columns.forEach((column, columnIndex) => {
      column.forEach((node, rowIndex) => {
        positions.set(node.id, {
          column: columnIndex,
          row: rowIndex,
          tier: node.tier || 1,
        });
      });
    });

    const nodes: PrerequisiteOverlayNode[] = Array.from(positions.entries()).map(([id, position]) => ({
      id,
      ...position,
    }));

    const edges: PrerequisiteOverlayEdge[] = [];
    columns.forEach((column) =>
      column.forEach((node) =>
        node.prerequisites.forEach((prerequisite) => {
          const from = positions.get(prerequisite.node);
          const to = positions.get(node.id);

          if (from && to) {
            edges.push({
              from: { id: prerequisite.node, ...from },
              to: { id: node.id, ...to },
              relation: prerequisite.relation,
            });
          }
        }),
      ),
    );

    edges.sort(
      (left, right) => left.from.id.localeCompare(right.from.id) || left.to.id.localeCompare(right.to.id),
    );

    return { nodes, edges, columns: columns.length };
  });

  selectedTagUsage = computed(() => {
    const target = this.tagTarget();
    const usage = this.cultureTagUsage();
    return target ? usage[target] || [] : [];
  });

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

  updateNode(partial: Partial<EditorTechNode>): void {
    this.service.updateNode(partial);
  }

  startDrag(nodeId: string, event: DragEvent): void {
    this.draggingNodeId.set(nodeId);
    event.dataTransfer?.setData('text/plain', nodeId);
  }

  endDrag(): void {
    this.draggingNodeId.set(null);
    this.dragOverSlot.set(null);
  }

  allowDrop(event: DragEvent): void {
    event.preventDefault();
  }

  markGridHover(tier: number, column: number): void {
    this.dragOverSlot.set({ tier, column });
  }

  clearGridHover(tier: number, column: number): void {
    const hover = this.dragOverSlot();
    if (hover?.tier === tier && hover.column === column) {
      this.dragOverSlot.set(null);
    }
  }

  isGridHover(tier: number, column: number): boolean {
    const hover = this.dragOverSlot();
    return hover?.tier === tier && hover.column === column;
  }

  dropOnGrid(tier: number, column: number, event: DragEvent): void {
    event.preventDefault();
    const nodeId = event.dataTransfer?.getData('text/plain') || this.draggingNodeId();
    if (nodeId) {
      this.service.moveNodeToPosition(nodeId, tier, column);
      this.selectNode(nodeId);
    }
    this.endDrag();
  }

  addTierBand(): void {
    this.service.addTierBand();
  }

  trimTierBands(): void {
    this.service.trimTierBands();
  }

  canTrimTierBands(): boolean {
    return this.service.canTrimTierBands();
  }

  nodeAt(tier: number, displayOrder: number): EditorTechNode | undefined {
    return this.nodes().find(
      (node) => (node.tier || 1) === tier && (node.display_order || 1) === displayOrder,
    );
  }

  isUpstream(nodeId: string): boolean {
    const selected = this.selectedNode();
    return selected?.prerequisites.some((prerequisite) => prerequisite.node === nodeId) ?? false;
  }

  triggerImport(): void {
    this.service.requestImport({
      sourceLabel: 'fixture-import',
      raw: TECH_TREE_FIXTURE_DOCUMENT,
    });
  }

  triggerExport(): void {
    this.service.requestExport();
  }

  toggleCultureTag(tagId: CultureTagId): void {
    this.service.toggleCultureTag(tagId);
  }

  updateEffectsList(key: keyof EditorTechNodeEffects, values: string[]): void {
    this.service.updateEffectsList(key, values);
  }

  updateIcon(iconId: string | null): void {
    this.service.updateIconSelection(iconId);
  }

  openTagDialog(mode: 'create' | 'edit' | 'delete'): void {
    this.prepareTagDialog(mode);
    this.tagDialogMode.set(mode);
  }

  switchTagMode(mode: 'create' | 'edit' | 'delete'): void {
    this.prepareTagDialog(mode);
    this.tagDialogMode.set(mode);
  }

  closeTagDialog(): void {
    this.tagDialogMode.set('closed');
  }

  setTagTarget(tagId: CultureTagId | null): void {
    this.tagTarget.set(tagId);
    if (!tagId) return;

    const tag = this.cultureTagOptions().find((entry) => entry.id === tagId);
    if (tag) {
      this.tagNamespace.set(tag.source);
      this.tagVersion.set(tag.version);
      this.tagNote.set(tag.governanceNote || '');
    }
  }

  submitTagCreate(): void {
    this.service.proposeCultureTag({
      namespace: this.tagNamespace(),
      slug: this.tagSlug(),
      note: this.tagNote(),
      version: this.tagVersion(),
      auditRef: 'tech-tree-editor',
    });
  }

  submitTagEdit(): void {
    const target = this.tagTarget();
    if (!target) return;
    this.service.updateCultureTagProposal({
      id: target,
      note: this.tagNote(),
      version: this.tagVersion(),
      auditRef: 'tech-tree-editor',
    });
  }

  submitTagDelete(): void {
    const target = this.tagTarget();
    if (!target) return;
    this.service.requestCultureTagDeletion({
      id: target,
      auditRef: 'tech-tree-editor',
    });
  }

  describeTags(tags: string[] = []): string {
    return tags.length ? tags.join(', ') : 'inherits defaults';
  }

  private prepareTagDialog(mode: 'create' | 'edit' | 'delete'): void {
    if (mode === 'create') {
      this.tagNamespace.set('biome');
      this.tagSlug.set('');
      this.tagVersion.set(1);
      this.tagNote.set('');
      this.tagTarget.set(null);
      return;
    }

    const existingTags = this.cultureTagOptions();
    if (!existingTags.length) {
      return;
    }

    const resolved =
      (this.tagTarget() && existingTags.find((tag) => tag.id === this.tagTarget())) || existingTags[0];

    if (resolved) {
      this.tagTarget.set(resolved.id);
      this.tagNamespace.set(resolved.source);
      this.tagVersion.set(resolved.version);
      this.tagNote.set(resolved.governanceNote || '');
    }
  openPreview(): void {
    this.isPreviewOpen.set(true);
  }

  closePreview(): void {
    this.isPreviewOpen.set(false);
  }
}
