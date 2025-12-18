import { computed, inject, Injectable, signal } from '@angular/core';
import {
  CultureTagId,
  TECH_PREREQUISITE_RELATION,
  TechNodePrerequisite,
} from '../../models/tech-tree.models';
import { TechEnumAdapterService } from '../../services/tech-enum-adapter.service';
import { TechIconOption, TechIconRegistryService } from '../../services/tech-icon-registry.service';
import { TechTreeIoService } from '../../services/tech-tree-io.service';
import { TECH_TREE_FIXTURE_DOCUMENT } from './tech-tree-editor.fixtures';
import {
  CultureTagOption,
  EditorTechNode,
  EditorTechNodeEffects,
  EditorTechTree,
  EditorTechTreeExport,
  EditorTechTreeImport,
  EditorTechValidationIssue,
  EffectOptionSet,
  TechTreeImportPayload,
} from './tech-tree-editor.types';

@Injectable()
export class TechTreeEditorService {
  private readonly io = inject(TechTreeIoService);
  private readonly enumAdapter = inject(TechEnumAdapterService);
  private readonly iconRegistry = inject(TechIconRegistryService);

  private documentState = signal<EditorTechTree>(TECH_TREE_FIXTURE_DOCUMENT);
  private selectedId = signal<string>(TECH_TREE_FIXTURE_DOCUMENT.nodes[0]?.id ?? '');
  private tierBandLimit = signal<number>(this.deriveMaxTier(TECH_TREE_FIXTURE_DOCUMENT.nodes));

  document = computed(() => this.documentState());
  nodes = computed(() => this.documentState().nodes);
  selectedNode = computed<EditorTechNode | null>(() =>
    this.documentState().nodes.find((node) => node.id === this.selectedId()) ?? null,
  );
  validationIssues = signal<EditorTechValidationIssue[]>([]);
  lastImport = signal<EditorTechTreeImport | null>(null);
  lastExport = signal<EditorTechTreeExport | null>(null);

  cultureTagOptions = computed<CultureTagOption[]>(() =>
    this.io.getCultureTagOptions().map((entry) => ({
      ...entry,
      label: entry.id.replace(/_/g, ' '),
    })),
  );

  effectOptions = computed<EffectOptionSet>(() => ({
    structures: this.enumAdapter.getStructureTypeOptions(this.collectFallbackEffectValues('unlock_structures')),
    goods: this.enumAdapter.getGoodsTypeOptions(this.collectFallbackEffectValues('unlock_goods')),
    settlements: this.enumAdapter.getSettlementTypeOptions(
      this.collectFallbackEffectValues('unlock_settlements'),
    ),
    guilds: this.enumAdapter.getGuildTypeOptions(this.collectFallbackEffectValues('unlock_guilds')),
  }));
  iconOptions = computed<TechIconOption[]>(() => this.iconRegistry.getPickerOptions());

  constructor() {
    this.commitTree(this.documentState());
  }

  selectNode(id: string): void {
    if (this.documentState().nodes.some((node) => node.id === id)) {
      this.selectedId.set(id);
    }
  }

  updateNode(partial: Partial<EditorTechNode>): void {
    const current = this.selectedNode();
    if (!current) return;

    const sanitizedTier = partial.tier
      ? this.clampTier(partial.tier)
      : this.clampTier(current.tier || 1);
    const updated: EditorTechNode = {
      ...current,
      ...partial,
      tier: sanitizedTier,
      culture_tags: partial.culture_tags ?? current.culture_tags,
      prerequisites: partial.prerequisites ?? current.prerequisites,
      effects: partial.effects ?? current.effects,
    };

    this.commitTree({
      ...this.documentState(),
      nodes: this.documentState().nodes.map((node) => (node.id === updated.id ? updated : node)),
    });
    this.selectNode(updated.id);
  }

  updateCultureTags(tags: CultureTagId[]): void {
    const current = this.selectedNode();
    if (!current) return;
    this.updateNode({ culture_tags: tags });
  }

  updateEffects(effects: EditorTechNodeEffects): void {
    const current = this.selectedNode();
    if (!current) return;
    this.updateNode({ effects });
  }

  createNode(): void {
    const newId = this.generateId('new_tech');
    const newNode: EditorTechNode = {
      id: newId,
      title: 'New Technology',
      summary: 'Describe what this unlocks and who it belongs to.',
      tier: 1,
      display_order: this.documentState().nodes.length + 1,
      category: 'Unsorted',
      culture_tags: [...(this.documentState().default_culture_tags || [])],
      prerequisites: [],
      effects: {
        unlock_structures: [],
        unlock_goods: [],
      },
    };

    this.commitTree({
      ...this.documentState(),
      nodes: [...this.documentState().nodes, newNode],
    });
    this.selectedId.set(newId);
  }

  duplicateSelected(): void {
    const current = this.selectedNode();
    if (!current) return;

    const duplicateId = this.generateId(`${current.id}_copy`);
    const duplicate: EditorTechNode = {
      ...current,
      id: duplicateId,
      title: `${current.title} (Copy)`,
      display_order: (this.documentState().nodes.length || 0) + 1,
    };

    this.commitTree({
      ...this.documentState(),
      nodes: [...this.documentState().nodes, duplicate],
    });
    this.selectedId.set(duplicateId);
  }

  deleteSelected(): void {
    const current = this.selectedNode();
    if (!current) return;

    const remaining = this.documentState().nodes
      .filter((node) => node.id !== current.id)
      .map((node) => ({
        ...node,
        prerequisites: node.prerequisites.filter((prerequisite) => prerequisite.node !== current.id),
      }));

    this.commitTree({
      ...this.documentState(),
      nodes: remaining,
    });
    this.selectedId.set(remaining[0]?.id ?? '');
  }

  moveNodeToTier(nodeId: string, tier: number): void {
    const targetTier = this.clampTier(tier);
    const tierOccupancy = this.documentState().nodes.filter((node) => (node.tier || 1) === targetTier).length;
    this.moveNodeToPosition(nodeId, targetTier, tierOccupancy + 1);
  }

  moveNodeToPosition(nodeId: string, tier: number, displayOrder: number): void {
    const targetTier = this.clampTier(tier);
    const targetOrder = this.clampDisplayOrder(displayOrder);
    const movingNode = this.documentState().nodes.find((node) => node.id === nodeId);

    if (!movingNode) return;

    const withoutNode = this.documentState().nodes.filter((node) => node.id !== nodeId);
    const normalizedNodes = this.normalizeDisplayOrders([
      ...withoutNode,
      {
        ...movingNode,
        tier: targetTier,
        display_order: targetOrder,
      },
    ]);

    this.commitTree({
      ...this.documentState(),
      nodes: normalizedNodes,
    });
    this.selectNode(nodeId);
  }

  requestImport(payload: TechTreeImportPayload): void {
    try {
      const importResult = this.io.importTechTree(payload.raw);
      const treeWithSource = {
        ...importResult.tree,
        metadata: { ...(importResult.tree.metadata || {}), source_label: payload.sourceLabel },
      };

      this.commitTree(treeWithSource);
      this.tierBandLimit.set(this.deriveMaxTier(treeWithSource.nodes));
      this.lastImport.set(importResult);
      this.selectedId.set(importResult.tree.nodes[0]?.id ?? '');
    } catch (error) {
      this.validationIssues.set([
        {
          path: 'import',
          message: error instanceof Error ? error.message : 'Unknown import error.',
          severity: 'error',
        },
      ]);
      // TODO: route structured import errors to a user-visible surface instead of swallowing them here.
    }
  }

  requestExport(): EditorTechTreeExport {
    const exported = this.io.exportTechTree(this.documentState());
    this.lastExport.set(exported);
    this.validationIssues.set(exported.issues);
    return exported;
  }

  getTierBands(): number[] {
    const maxTier = Math.min(256, Math.max(this.tierBandLimit(), this.deriveMaxTier(this.documentState().nodes)));
    return Array.from({ length: maxTier }, (_, index) => index + 1);
  }

  getGridColumnCount(): number {
    const maxColumn = this.documentState().nodes.reduce(
      (max, node) => Math.max(max, (node.display_order || 0) + 1),
      1,
    );
    return Math.min(24, Math.max(4, maxColumn));
  }

  addTierBand(): void {
    const nextTier = Math.min(32, Math.max(this.getTierBands().length + 1, this.tierBandLimit() + 1));
    this.tierBandLimit.set(nextTier);
  }

  trimTierBands(): void {
    this.tierBandLimit.set(this.deriveMaxTier(this.documentState().nodes));
  }

  canTrimTierBands(): boolean {
    return this.tierBandLimit() > this.deriveMaxTier(this.documentState().nodes);
  }

  toggleCultureTag(tagId: CultureTagId): void {
    const current = this.selectedNode();
    if (!current) return;

    const nextTags = new Set(current.culture_tags);
    if (nextTags.has(tagId)) {
      nextTags.delete(tagId);
    } else {
      nextTags.add(tagId);
    }

    this.updateCultureTags(Array.from(nextTags));
  }

  upsertPrerequisite(nodeId: string, prerequisite: TechNodePrerequisite): void {
    const node = this.documentState().nodes.find((candidate) => candidate.id === nodeId);
    if (!node) return;

    const filtered = node.prerequisites.filter((entry) => entry.node !== prerequisite.node);
    const nextNode: EditorTechNode = {
      ...node,
      prerequisites: [...filtered, prerequisite],
    };
    this.updateNode(nextNode);
  }

  updateEffectsList(key: keyof EditorTechNodeEffects, values: string[]): void {
    const current = this.selectedNode();
    if (!current) return;

    const nextEffects = {
      ...(current.effects || {}),
      [key]: values,
    } as EditorTechNodeEffects;
    this.updateEffects(nextEffects);
  }

  private generateId(seed: string): string {
    const existing = new Set(this.documentState().nodes.map((node) => node.id));
    let attempt = this.slugify(seed);
    let counter = 1;

    while (existing.has(attempt)) {
      attempt = `${this.slugify(seed)}_${counter}`;
      counter += 1;
    }

    return attempt;
  }

  private slugify(value: string): string {
    const slug = value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^_+|_+$/g, '');

    return slug || 'tech_node';
  }

  private commitTree(tree: EditorTechTree): void {
    const normalizedTree: EditorTechTree = {
      ...tree,
      nodes: this.normalizeDisplayOrders(tree.nodes),
    };

    const exportResult = this.io.exportTechTree(normalizedTree);
    this.documentState.set(exportResult.orderedTree);
    this.validationIssues.set(exportResult.issues);
    this.lastExport.set(exportResult);
    this.tierBandLimit.set(this.deriveMaxTier(exportResult.orderedTree.nodes));
  }

  private collectFallbackEffectValues(key: keyof EditorTechNodeEffects): string[] {
    return this.documentState()
      .nodes.flatMap((node) => ((node.effects || {})[key] as string[] | undefined) || [])
      .filter(Boolean);
  }

  updateIconSelection(iconId: string | null): void {
    const current = this.selectedNode();
    if (!current) return;

    const nextMetadata = {
      ...(current.metadata || {}),
      icon_id: iconId || undefined,
    };

    this.updateNode({ metadata: nextMetadata });
  }

  private clampTier(value: number): number {
    return Math.min(256, Math.max(1, Math.floor(value || 1)));
  }

  private clampDisplayOrder(value: number): number {
    return Math.min(512, Math.max(1, Math.floor(value || 1)));
  }

  private deriveMaxTier(nodes: EditorTechNode[]): number {
    return Math.max(1, ...nodes.map((node) => this.clampTier(node.tier || 1)));
  }

  private normalizeDisplayOrders(nodes: EditorTechNode[]): EditorTechNode[] {
    const buckets = new Map<number, EditorTechNode[]>();

    nodes.forEach((node) => {
      const tier = this.clampTier(node.tier || 1);
      const bucket = buckets.get(tier) ?? [];
      bucket.push({ ...node, tier });
      buckets.set(tier, bucket);
    });

    const normalized: EditorTechNode[] = [];

    buckets.forEach((bucket, tier) => {
      const ordered = bucket
        .sort(
          (left, right) =>
            (left.display_order ?? Number.MAX_SAFE_INTEGER)
              - (right.display_order ?? Number.MAX_SAFE_INTEGER)
            || left.id.localeCompare(right.id),
        )
        .map((node, index) => ({
          ...node,
          display_order: index + 1,
          tier,
        }));

      normalized.push(...ordered);
    });

    return normalized.sort(
      (left, right) =>
        left.tier - right.tier
        || (left.display_order || 0) - (right.display_order || 0)
        || left.id.localeCompare(right.id),
    );
  }
}
