import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HazardType } from '../../enums/HazardType';
import { RoomBlueprintEditorService } from './room-blueprint-editor.service';
import { SdkValidationSummaryComponent } from '../sdk/sdk-validation-summary.component';

@Component({
  selector: 'app-room-blueprint-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, SdkValidationSummaryComponent],
  providers: [RoomBlueprintEditorService],
  template: `
    <section class="room-blueprint-editor">
      <header class="page-header">
        <div>
          <p class="eyebrow">SDK · Rooms</p>
          <h1>Room Blueprint Editor</h1>
          <p class="lede">Header/list/detail/action shell consuming fixtures and validation notices.</p>
        </div>
        <div class="status">
          <div class="stat">
            <p class="label">Blueprints</p>
            <p class="value">{{ blueprints().length }}</p>
          </div>
          <div class="stat">
            <p class="label">Hazards</p>
            <p class="value">{{ hazardOptions().length }}</p>
          </div>
          <div class="stat">
            <p class="label">Validation</p>
            <p class="value">{{ noticeCounts().error }}E · {{ noticeCounts().warning }}W</p>
          </div>
        </div>
      </header>

      <div class="workspace">
        <section class="panel list">
          <header class="panel-header">
            <div>
              <p class="eyebrow">Blueprints</p>
              <h2>Catalog</h2>
              <p class="hint">Ordered list pulling from fixtures/service adapters.</p>
            </div>
            <div class="counts">
              <span class="pill">{{ blueprints().length }} saved</span>
            </div>
          </header>
          <div class="blueprint-list">
            <button
              type="button"
              class="blueprint-chip"
              *ngFor="let blueprint of blueprints(); trackBy: trackById"
              [class.active]="blueprint.id === selectedBlueprint()?.id"
              (click)="selectBlueprint(blueprint.id)"
            >
              <div class="title-row">
                <span class="name">{{ blueprint.name }}</span>
                <span class="meta">{{ blueprint.area }} m²</span>
              </div>
              <p class="purpose">{{ blueprint.purpose }}</p>
              <div class="hazard-tags">
                <span class="tag" *ngFor="let hazard of blueprint.hazards">{{ hazardLabel(hazard) }}</span>
              </div>
              <div class="tag" *ngIf="blueprint.tags?.length">{{ blueprint.tags.join(' · ') }}</div>
            </button>
          </div>
        </section>

        <section class="panel detail" *ngIf="selectedBlueprint(); else selectPrompt">
          <header class="panel-header">
            <div>
              <p class="eyebrow">Detail</p>
              <h2>{{ selectedBlueprint()?.name }}</h2>
              <p class="hint">Editable fields remain structural; rely on services for truth.</p>
            </div>
          </header>

          <div class="form-grid">
            <label class="field">
              <span class="field-label">Name</span>
              <input
                type="text"
                [ngModel]="selectedBlueprint()?.name"
                (ngModelChange)="service.updateBlueprint({ name: $event || 'Untitled room' })"
              />
            </label>
            <label class="field">
              <span class="field-label">Purpose</span>
              <input
                type="text"
                [ngModel]="selectedBlueprint()?.purpose"
                (ngModelChange)="service.updateBlueprint({ purpose: $event || 'Unspecified' })"
              />
            </label>

            <div class="field dimension-field">
              <div class="field">
                <span class="field-label">Width (m)</span>
                <input
                  type="number"
                  min="1"
                  [ngModel]="selectedBlueprint()?.dimensions?.width"
                  (ngModelChange)="service.updateDimensions({ width: $event ? +$event : 1 })"
                />
              </div>
              <div class="field">
                <span class="field-label">Height (m)</span>
                <input
                  type="number"
                  min="1"
                  [ngModel]="selectedBlueprint()?.dimensions?.height"
                  (ngModelChange)="service.updateDimensions({ height: $event ? +$event : 1 })"
                />
              </div>
            </div>

            <div class="field field-span hazard-picker">
              <div class="field-label-row">
                <span class="field-label">Hazards</span>
                <span class="hint">Multi-select chips derived from HazardType enum.</span>
              </div>
              <div class="chip-grid">
                <button
                  type="button"
                  class="chip"
                  *ngFor="let option of hazardOptions()"
                  [class.active]="selectedBlueprint()?.hazards?.includes(option.id)"
                  (click)="toggleHazard(option.id)"
                >
                  <span>{{ option.label }}</span>
                  <small *ngIf="option.tags.length">{{ option.tags.join(' • ') }}</small>
                </button>
              </div>
            </div>

            <div class="field field-span feature-stack">
              <div class="field-label-row">
                <span class="field-label">Features</span>
                <button type="button" class="ghost" (click)="addFeature()">Add feature</button>
              </div>
              <div class="feature-row" *ngFor="let feature of selectedBlueprint()?.features; let i = index; trackBy: trackByFeature">
                <input
                  type="text"
                  [ngModel]="feature.label"
                  (ngModelChange)="service.updateFeature(i, { label: $event || 'Feature' })"
                  placeholder="Label"
                />
                <textarea
                  rows="2"
                  [ngModel]="feature.detail"
                  (ngModelChange)="service.updateFeature(i, { detail: $event })"
                  placeholder="Detail or structured note"
                ></textarea>
                <button type="button" class="ghost" (click)="service.removeFeature(i)">Remove</button>
              </div>
            </div>

            <label class="field field-span">
              <span class="field-label">Notes</span>
              <textarea
                rows="3"
                [ngModel]="selectedBlueprint()?.notes"
                (ngModelChange)="service.updateBlueprint({ notes: $event || '' })"
              ></textarea>
            </label>
          </div>
        </section>

        <ng-template #selectPrompt>
          <section class="panel detail placeholder">
            <p class="hint">Select a blueprint to view detail.</p>
          </section>
        </ng-template>

        <section class="panel sidebar">
          <header class="panel-header">
            <div>
              <p class="eyebrow">Metrics</p>
              <h2>Derived</h2>
              <p class="hint">Dimensions feed deterministic area and aspect values.</p>
            </div>
          </header>
          <div class="metric-grid" *ngIf="selectedMetrics(); else metricPlaceholder">
            <div class="metric">
              <p class="label">Area</p>
              <p class="value">{{ selectedMetrics()?.area }} m²</p>
            </div>
            <div class="metric">
              <p class="label">Aspect</p>
              <p class="value">{{ selectedMetrics()?.aspectRatio }} : 1</p>
            </div>
            <div class="metric">
              <p class="label">Hazards</p>
              <p class="value">{{ selectedBlueprint()?.hazards?.length ?? 0 }}</p>
            </div>
            <div class="metric">
              <p class="label">Feature count</p>
              <p class="value">{{ selectedBlueprint()?.features?.length ?? 0 }}</p>
            </div>
          </div>
          <ng-template #metricPlaceholder>
            <p class="hint">Metrics appear once a blueprint is selected.</p>
          </ng-template>

          <div class="metadata" *ngIf="selectedBlueprint()?.metadata as metadata">
            <div>
              <p class="label">Source</p>
              <p class="value">{{ metadata.source }}</p>
            </div>
            <div *ngIf="metadata.author">
              <p class="label">Author</p>
              <p class="value">{{ metadata.author }}</p>
            </div>
            <div *ngIf="metadata.tags?.length">
              <p class="label">Tags</p>
              <p class="value">{{ metadata.tags?.join(' · ') }}</p>
            </div>
            <div *ngIf="metadata.lastValidated">
              <p class="label">Validated</p>
              <p class="value">{{ metadata.lastValidated }}</p>
            </div>
          </div>

          <div class="io">
            <div>
              <p class="label">Last import</p>
              <p class="value">{{ lastImportLabel() || 'None' }}</p>
            </div>
            <div>
              <p class="label">Export snapshot</p>
              <p class="value" *ngIf="lastExport(); else missingExport">Ready</p>
              <ng-template #missingExport>
                <p class="value muted">Pending</p>
              </ng-template>
            </div>
          </div>

          <app-sdk-validation-summary [notices]="selectedNotices()"></app-sdk-validation-summary>
        </section>
      </div>

      <footer class="action-row">
        <div class="buttons">
          <button type="button" (click)="service.createBlueprint()">New blueprint</button>
          <button type="button" (click)="service.duplicateSelected()" [disabled]="!selectedBlueprint()">Duplicate</button>
          <button type="button" class="danger" (click)="service.deleteSelected()" [disabled]="!selectedBlueprint()">Delete</button>
        </div>
        <div class="buttons">
          <button type="button" (click)="service.requestImport('fixture-import')">Import fixtures</button>
          <button type="button" class="primary" (click)="service.requestExport()" [disabled]="!selectedBlueprint()">Export selection</button>
        </div>
      </footer>

      <section class="export-log" *ngIf="lastExport()">
        <p class="eyebrow">Last export (deterministic ordering)</p>
        <pre>{{ lastExport() }}</pre>
      </section>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }

    .room-blueprint-editor {
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
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 10px;
      min-width: 260px;
    }

    .stat {
      text-align: right;
      padding: 6px 8px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(255, 255, 255, 0.02);
    }

    .stat .label {
      margin: 0;
      opacity: 0.72;
      font-size: 12px;
    }

    .stat .value {
      margin: 4px 0 0;
      font-weight: 600;
    }

    .workspace {
      display: grid;
      grid-template-columns: 1fr 1.2fr 0.9fr;
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
      gap: 10px;
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

    .counts {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .pill {
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-size: 11px;
      padding: 4px 6px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(255, 255, 255, 0.05);
    }

    .blueprint-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 8px;
      align-items: start;
    }

    .blueprint-chip {
      border: 1px solid rgba(255, 255, 255, 0.16);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.04);
      color: inherit;
      text-align: left;
      padding: 8px;
      display: grid;
      gap: 4px;
      cursor: pointer;
    }

    .blueprint-chip.active {
      border-color: #9de5ff;
      background: rgba(157, 229, 255, 0.1);
      box-shadow: 0 0 0 1px rgba(157, 229, 255, 0.2);
    }

    .title-row {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      align-items: center;
    }

    .name {
      font-weight: 700;
    }

    .meta {
      opacity: 0.7;
      font-size: 12px;
    }

    .purpose {
      margin: 0;
      opacity: 0.82;
    }

    .hazard-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .tag {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      padding: 4px 6px;
      border-radius: 999px;
      font-size: 12px;
      color: inherit;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      align-content: start;
    }

    .field {
      display: grid;
      gap: 4px;
    }

    .field-label {
      opacity: 0.8;
      font-size: 13px;
    }

    .field-label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
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

    textarea {
      resize: vertical;
    }

    .field-span {
      grid-column: span 2;
    }

    .dimension-field {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }

    .hazard-picker .chip-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 6px;
    }

    .chip {
      padding: 8px 10px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.16);
      background: rgba(255, 255, 255, 0.04);
      color: inherit;
      text-align: left;
      cursor: pointer;
      display: grid;
      gap: 2px;
    }

    .chip.active {
      border-color: #ffda7b;
      background: rgba(255, 218, 123, 0.1);
      box-shadow: 0 0 0 1px rgba(255, 218, 123, 0.2);
      color: #ffe6b0;
    }

    .chip small {
      opacity: 0.7;
    }

    .feature-stack {
      gap: 6px;
    }

    .feature-row {
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      padding: 8px;
      display: grid;
      gap: 6px;
      background: rgba(255, 255, 255, 0.02);
    }

    .feature-row button.ghost {
      justify-self: flex-start;
    }

    button.ghost {
      background: transparent;
      border: 1px dashed rgba(255, 255, 255, 0.3);
      color: inherit;
      border-radius: 6px;
      padding: 6px 8px;
      cursor: pointer;
    }

    .sidebar {
      grid-template-rows: auto auto auto 1fr;
      gap: 10px;
    }

    .metric-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }

    .metric {
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      padding: 8px;
      background: rgba(255, 255, 255, 0.02);
      display: grid;
      gap: 4px;
    }

    .metric .label {
      margin: 0;
      opacity: 0.76;
      font-size: 12px;
    }

    .metric .value {
      margin: 0;
      font-weight: 700;
    }

    .metadata,
    .io {
      display: grid;
      gap: 6px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 6px;
      padding: 8px;
      background: rgba(255, 255, 255, 0.02);
    }

    .metadata .label,
    .io .label {
      margin: 0;
      opacity: 0.76;
      font-size: 12px;
    }

    .metadata .value,
    .io .value {
      margin: 2px 0 0;
      font-weight: 600;
    }

    .io .value.muted {
      opacity: 0.6;
      font-weight: 500;
    }

    .action-row {
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

    pre {
      margin: 6px 0 0;
      font-size: 12px;
      line-height: 1.4;
      white-space: pre-wrap;
      max-height: 240px;
      overflow: auto;
      background: rgba(0, 0, 0, 0.4);
      border: 1px dashed rgba(255, 255, 255, 0.18);
      border-radius: 6px;
      padding: 8px;
    }

    @media (max-width: 1200px) {
      .workspace {
        grid-template-columns: 1fr;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .field-span {
        grid-column: span 1;
      }

      .dimension-field {
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      }
    }
  `],
})
export class RoomBlueprintEditorComponent {
  protected service = inject(RoomBlueprintEditorService);

  blueprints = this.service.blueprintSummaries;
  selectedBlueprint = this.service.selectedBlueprint;
  hazardOptions = this.service.hazardOptions;
  selectedMetrics = this.service.selectedMetrics;
  noticeCounts = this.service.noticeCounts;
  selectedNotices = this.service.selectedNotices;
  lastExport = this.service.lastExport;
  lastImportLabel = this.service.lastImportLabel;

  selectBlueprint(id: string): void {
    this.service.selectBlueprint(id);
  }

  toggleHazard(hazard: HazardType): void {
    this.service.toggleHazard(hazard);
  }

  addFeature(): void {
    this.service.addFeature();
  }

  hazardLabel(hazard: HazardType): string {
    return this.service.hazardLabel(hazard);
  }

  trackById = (_: number, item: { id: string }) => item.id;
  trackByFeature = (_: number, item: { id: string }) => item.id;
}
