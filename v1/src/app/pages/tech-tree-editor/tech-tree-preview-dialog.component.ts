import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CultureTagId } from '../../models/tech-tree.models';
import {
  CultureTagOption,
  EditorTechNode,
  EditorTechTree,
  EffectOptionSet,
  PrerequisiteOverlayEdge,
  PrerequisiteOverlayNode,
} from './tech-tree-editor.types';
import { TechTreeConnectionOverlayComponent } from './tech-tree-connection-overlay.component';

@Component({
  selector: 'app-tech-tree-preview-dialog',
  standalone: true,
  imports: [CommonModule, TechTreeConnectionOverlayComponent],
  template: `
    <section class="preview-backdrop" role="presentation" (click)="requestClose()">
      <div
        class="preview-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Tech tree preview"
        (click)="$event.stopPropagation()"
      >
        <header class="dialog-header">
          <div>
            <p class="eyebrow">Preview</p>
            <h2>{{ document?.tech_tree_id }} · v{{ document?.version }}</h2>
            <p class="lede">Tier-banded, read-only view with deterministic ordering.</p>
          </div>
          <button type="button" class="close-button" (click)="requestClose()" aria-label="Close preview dialog">
            Close
          </button>
        </header>

        <div class="dialog-body">
          <div class="preview-grid" [style.--tier-count]="tierBands.length || 1">
            <app-tech-tree-connection-overlay
              class="connection-overlay"
              [nodes]="overlayNodes"
              [edges]="overlayEdges"
              [columns]="tierBands.length || 1"
            ></app-tech-tree-connection-overlay>
            <div class="tier-column" *ngFor="let tier of tierBands; trackBy: trackTier">
              <p class="tier-label">Tier {{ tier }}</p>
              <div class="node-card" *ngFor="let node of bandedNodes.get(tier) || []; trackBy: trackNode">
                <div class="node-header">
                  <div class="marker" [class.has-icon]="node.metadata?.icon_id"></div>
                  <div>
                    <p class="name">{{ node.title }}</p>
                    <p class="meta">{{ node.category || 'Unsorted' }}</p>
                  </div>
                </div>
                <p class="summary">{{ node.summary }}</p>
                <p class="tags" *ngIf="node.culture_tags?.length">
                  {{ describeTags(node.culture_tags) }}
                </p>
                <ul class="effect-list" *ngIf="effectLines(node).length">
                  <li *ngFor="let line of effectLines(node); trackBy: trackEffect">{{ line }}</li>
                </ul>
              </div>
            </div>
          </div>

          <footer class="legend">
            <div>
              <p class="eyebrow">Culture tags</p>
              <div class="tag-row">
                <span class="tag" *ngFor="let tag of cultureTagOptions; trackBy: trackTag">{{ tag.label }}</span>
              </div>
            </div>
            <p class="note">Passive dialog; no edits are applied from this surface.</p>
          </footer>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      position: fixed;
      inset: 0;
      z-index: 8;
      display: block;
    }

    .preview-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(5, 3, 12, 0.78);
      display: grid;
      place-items: center;
      padding: 16px;
      box-sizing: border-box;
    }

    .preview-dialog {
      width: min(1280px, 100%);
      max-height: 90vh;
      background: #0d0a15;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 10px;
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.45);
      display: grid;
      grid-template-rows: auto 1fr;
      overflow: hidden;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      gap: 12px;
    }

    h2 {
      margin: 2px 0;
      font-size: 20px;
      letter-spacing: 0.02em;
    }

    .lede {
      margin: 2px 0 0;
      opacity: 0.78;
      font-size: 13px;
    }

    .close-button {
      border: 1px solid rgba(255, 255, 255, 0.16);
      background: rgba(255, 255, 255, 0.06);
      color: #f3ecff;
      border-radius: 6px;
      padding: 8px 10px;
      cursor: pointer;
      font-weight: 600;
      min-width: 96px;
    }

    .dialog-body {
      padding: 12px 14px 14px;
      overflow: auto;
      display: grid;
      gap: 12px;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.01) 0%, rgba(255, 255, 255, 0.03) 100%);
    }

    .preview-grid {
      position: relative;
      display: grid;
      grid-template-columns: repeat(var(--tier-count), 220px);
      gap: 10px;
      padding: 12px 12px 16px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      overflow: auto;
      isolation: isolate;
    }

    .tier-column {
      display: grid;
      grid-auto-rows: 96px;
      gap: 8px;
      position: relative;
      z-index: 1;
    }

    .tier-label {
      margin: 0;
      font-size: 12px;
      opacity: 0.78;
      letter-spacing: 0.04em;
    }

    .node-card {
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      padding: 8px;
      background: rgba(255, 255, 255, 0.04);
      display: grid;
      gap: 4px;
      min-height: 84px;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.18) inset;
    }

    .node-header {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 6px;
      align-items: center;
    }

    .marker {
      width: 14px;
      height: 14px;
      border-radius: 4px;
      background: rgba(157, 229, 255, 0.22);
      border: 1px solid rgba(157, 229, 255, 0.5);
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.32) inset;
    }

    .marker.has-icon {
      background: linear-gradient(180deg, #ffd369 0%, #ffaf3a 100%);
      border-color: #f1a132;
    }

    .name {
      margin: 0;
      font-weight: 700;
      font-size: 14px;
    }

    .meta {
      margin: 0;
      font-size: 12px;
      opacity: 0.75;
    }

    .summary {
      margin: 0;
      opacity: 0.88;
      font-size: 13px;
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .tags {
      margin: 0;
      font-size: 12px;
      opacity: 0.78;
    }

    .effect-list {
      margin: 0;
      padding-left: 16px;
      display: grid;
      gap: 2px;
      font-size: 12px;
      opacity: 0.92;
    }

    .connection-overlay {
      z-index: 0;
      pointer-events: none;
    }

    .legend {
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 8px;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 10px;
    }

    .tag-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 6px;
    }

    .tag {
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 6px;
      padding: 4px 6px;
      font-size: 12px;
      background: rgba(255, 255, 255, 0.05);
    }

    .note {
      margin: 0;
      opacity: 0.78;
      font-size: 12px;
      text-align: right;
    }

    @media (max-width: 720px) {
      .preview-dialog {
        height: 100%;
        max-height: none;
      }

      .preview-backdrop {
        padding: 10px;
      }
    }
  `],
})
export class TechTreePreviewDialogComponent {
  @Input() document: EditorTechTree | null = null;
  @Input() nodes: EditorTechNode[] = [];
  @Input() tierBands: number[] = [];
  @Input() cultureTagOptions: CultureTagOption[] = [];
  @Input() effectOptions: EffectOptionSet | null = null;
  @Output() close = new EventEmitter<void>();

  get bandedNodes(): Map<number, EditorTechNode[]> {
    const map = new Map<number, EditorTechNode[]>();
    this.tierBands.forEach((tier) => map.set(tier, []));

    this.nodes.forEach((node) => {
      const tier = this.clampTier(node.tier || 1);
      const bucket = map.get(tier) ?? [];
      bucket.push(node);
      map.set(tier, bucket);
    });

    this.tierBands.forEach((tier) => {
      const bucket = map.get(tier) ?? [];
      bucket.sort((left, right) => (left.display_order || 0) - (right.display_order || 0)
        || left.title.localeCompare(right.title));
      map.set(tier, bucket);
    });

    return map;
  }

  get overlayNodes(): PrerequisiteOverlayNode[] {
    const nodes: PrerequisiteOverlayNode[] = [];

    this.tierBands.forEach((tier, column) => {
      const entries = this.bandedNodes.get(tier) ?? [];
      entries.forEach((node, row) => {
        nodes.push({
          id: node.id,
          column,
          row,
          tier,
        });
      });
    });

    return nodes;
  }

  get overlayEdges(): PrerequisiteOverlayEdge[] {
    const positionLookup = new Map(this.overlayNodes.map((node) => [node.id, node]));
    const edges: PrerequisiteOverlayEdge[] = [];

    this.nodes.forEach((node) => {
      node.prerequisites.forEach((prerequisite) => {
        const from = positionLookup.get(prerequisite.node);
        const to = positionLookup.get(node.id);
        if (!from || !to) return;

        edges.push({
          from,
          to,
          relation: prerequisite.relation,
        });
      });
    });

    return edges.sort((left, right) => left.from.id.localeCompare(right.from.id)
      || left.to.id.localeCompare(right.to.id));
  }

  describeTags(tags: CultureTagId[]): string {
    const tagMap = new Map(this.cultureTagOptions.map((option) => [option.id, option.label]));
    return tags.map((tag) => tagMap.get(tag) || tag).join(', ');
  }

  effectLines(node: EditorTechNode): string[] {
    const effects = node.effects || {};
    const lines: string[] = [];

    if (effects.unlock_structures?.length) {
      lines.push(`Structures: ${this.mapEffectValues(effects.unlock_structures, this.effectOptions?.structures)}`);
    }

    if (effects.unlock_goods?.length) {
      lines.push(`Goods: ${this.mapEffectValues(effects.unlock_goods, this.effectOptions?.goods)}`);
    }

    if (effects.unlock_settlements?.length) {
      lines.push(`Settlements: ${this.mapEffectValues(effects.unlock_settlements, this.effectOptions?.settlements)}`);
    }

    if (effects.unlock_guilds?.length) {
      lines.push(`Guilds: ${this.mapEffectValues(effects.unlock_guilds, this.effectOptions?.guilds)}`);
    }

    if (effects.grants_settlement_specialization) {
      lines.push(`Settlement specialization: ${this.mapEffectValues(
        [effects.grants_settlement_specialization],
        this.effectOptions?.settlements,
      )}`);
    }

    if (effects.research_rate_modifier !== undefined && effects.research_rate_modifier !== null) {
      const percent = Math.round(effects.research_rate_modifier * 100);
      lines.push(`Research rate: +${percent}%`);
    }

    if (effects.guild_reputation?.length) {
      const guildLines = effects.guild_reputation
        .map((entry) => {
          const label = this.mapEffectValues([entry.guild], this.effectOptions?.guilds);
          return `${label}: ${entry.delta > 0 ? '+' : ''}${entry.delta}`;
        })
        .join(', ');
      lines.push(`Guild reputation: ${guildLines}`);
    }

    return lines;
  }

  trackTier = (_: number, tier: number) => tier;
  trackNode = (_: number, node: EditorTechNode) => node.id;
  trackEffect = (_: number, effect: string) => effect;
  trackTag = (_: number, tag: CultureTagOption) => tag.id;

  requestClose(): void {
    this.close.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.requestClose();
  }

  private mapEffectValues(values: (string | number)[], options: EffectOptionSet['structures'] | undefined | null): string {
    const lookup = new Map(options?.map((option) => [option.value, option.label]));
    return values.map((value) => lookup.get(value as string) || this.fallbackLabel(String(value))).join(', ');
  }

  private fallbackLabel(raw: string): string {
    return raw
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private clampTier(value: number): number {
    return Math.min(256, Math.max(1, Math.floor(value || 1)));
  }
}
