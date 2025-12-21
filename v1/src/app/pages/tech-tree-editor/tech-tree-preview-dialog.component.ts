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

    // First pass: distribute nodes to tier buckets
    this.nodes.forEach((node) => {
      const tier = this.clampTier(node.tier || 1);
      const bucket = map.get(tier) ?? [];
      bucket.push(this.normalizeNodeForSort(node));
      map.set(tier, bucket);
    });

    // Second pass: sort each tier using exact export deterministic ordering
    this.tierBands.forEach((tier) => {
      const bucket = map.get(tier) ?? [];
      bucket.sort((left, right) => {
        // Tier delta (should be 0 within same tier)
        const tierDelta = this.clampTier(left.tier) - this.clampTier(right.tier);
        if (tierDelta !== 0) {
          return tierDelta;
        }

        // Display order delta
        const displayOrderDelta = (left.display_order ?? Number.MAX_SAFE_INTEGER)
          - (right.display_order ?? Number.MAX_SAFE_INTEGER);
        if (displayOrderDelta !== 0) {
          return displayOrderDelta;
        }

        // Final tiebreaker: node ID locale comparison
        return left.id.localeCompare(right.id);
      });
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

  /**
   * Normalize node for sorting to match export deterministic ordering
   * Mirrors the normalization logic from TechTreeIoService.sortForDeterminism
   */
  private normalizeNodeForSort(node: EditorTechNode): EditorTechNode {
    return {
      ...node,
      tier: this.clampTier(node.tier || 1),
      culture_tags: this.uniqueAndSort(node.culture_tags),
      prerequisites: this.sortPrerequisites(node.prerequisites),
    };
  }

  /**
   * Sort prerequisites deterministically
   * Mirrors TechTreeIoService.sortPrerequisites logic
   */
  private sortPrerequisites(prerequisites: EditorTechNode['prerequisites']): EditorTechNode['prerequisites'] {
    const deduped = new Map<string, EditorTechNode['prerequisites'][number]>();

    prerequisites.forEach((prerequisite) => {
      if (prerequisite.node) {
        deduped.set(prerequisite.node, {
          node: prerequisite.node,
          relation: 'requires', // Always normalize to 'requires'
        });
      }
    });

    return Array.from(deduped.values()).sort((left, right) => left.node.localeCompare(right.node));
  }

  /**
   * Unique and sort array of strings
   * Mirrors TechTreeIoService.uniqueAndSort logic
   */
  private uniqueAndSort<T extends string>(values: T[]): T[] {
    return Array.from(new Set(values)).sort((left, right) => left.localeCompare(right));
  }

  /**
   * Check if a tier has no nodes
   */
  isEmptyTier(tier: number): boolean {
    const tierNodes = this.bandedNodes.get(tier) || [];
    return tierNodes.length === 0;
  }

  /**
   * Get total node count for performance metrics
   */
  get totalNodeCount(): number {
    return this.nodes.length;
  }

  /**
   * Get max nodes in any single tier for layout optimization
   */
  get maxNodesPerTier(): number {
    let max = 0;
    this.tierBands.forEach((tier) => {
      const count = (this.bandedNodes.get(tier) || []).length;
      if (count > max) max = count;
    });
    return max;
  }

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

  private clampTier(value: number | undefined): number {
    return Math.min(256, Math.max(1, Math.floor(value || 1)));
  }
}
