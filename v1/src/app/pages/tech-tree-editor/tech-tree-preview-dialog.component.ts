import { CommonModule } from '@angular/common';
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { Component, EventEmitter, HostListener, Input, OnDestroy, Output, signal } from '@angular/core';
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
  imports: [CommonModule, TechTreeConnectionOverlayComponent, CdkTrapFocus],
  templateUrl: './tech-tree-preview-dialog.component.html',
  styleUrls: ['./tech-tree-preview-dialog.component.scss'],
})
export class TechTreePreviewDialogComponent implements OnDestroy {
  @Input() document: EditorTechTree | null = null;
  @Input() nodes: EditorTechNode[] = [];
  @Input() tierBands: number[] = [];
  @Input() cultureTagOptions: CultureTagOption[] = [];
  @Input() effectOptions: EffectOptionSet | null = null;
  @Output() close = new EventEmitter<void>();

  activeNodeId = signal<string | null>(null);
  liveAnnouncement = signal('');
  private previouslyFocused: HTMLElement | null = document.activeElement as HTMLElement | null;

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

  get activeNode(): EditorTechNode | null {
    const activeId = this.activeNodeId();
    return activeId ? this.nodes.find((node) => node.id === activeId) ?? null : null;
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

  describePrerequisites(node: EditorTechNode): string {
    const prereqs = node.prerequisites || [];
    return prereqs.length ? prereqs.map((p) => p.node).join(', ') : 'none';
  }

  setActiveNode(nodeId: string): void {
    this.activeNodeId.set(nodeId);
    this.liveAnnouncement.set(`Focused ${nodeId}. Press escape to close.`);
  }

  clearActiveNode(): void {
    this.activeNodeId.set(null);
  }

  trackTier = (_: number, tier: number) => tier;
  trackNode = (_: number, node: EditorTechNode) => node.id;
  trackEffect = (_: number, effect: string) => effect;
  trackTag = (_: number, tag: CultureTagOption) => tag.id;

  requestClose(): void {
    this.close.emit();
    this.previouslyFocused?.focus({ preventScroll: true });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.requestClose();
  }

  ngOnDestroy(): void {
    this.previouslyFocused?.focus({ preventScroll: true });
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
