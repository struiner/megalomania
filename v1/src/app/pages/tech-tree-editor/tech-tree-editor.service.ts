import { Injectable, computed, signal } from '@angular/core';
import { TECH_TREE_FIXTURE_DOCUMENT } from './tech-tree-editor.fixtures';
import {
  TechTreeDocument,
  TechTreeExportPayload,
  TechTreeImportPayload,
  TechTreeNode,
} from './tech-tree-editor.types';

@Injectable()
export class TechTreeEditorService {
  private documentState = signal<TechTreeDocument>(TECH_TREE_FIXTURE_DOCUMENT);
  private selectedId = signal<string>(TECH_TREE_FIXTURE_DOCUMENT.nodes[0]?.id ?? '');

  document = computed(() => this.documentState());
  nodes = computed(() => this.documentState().nodes);
  selectedNode = computed<TechTreeNode | null>(() =>
    this.documentState().nodes.find((node) => node.id === this.selectedId()) ?? null,
  );

  selectNode(id: string): void {
    if (this.documentState().nodes.some((node) => node.id === id)) {
      this.selectedId.set(id);
    }
  }

  updateNode(partial: Partial<TechTreeNode>): void {
    const current = this.selectedNode();
    if (!current) return;

    const updated = { ...current, ...partial } satisfies TechTreeNode;
    const nextNodes = this.documentState().nodes.map((node) => (node.id === updated.id ? updated : node));
    this.commitNodes(nextNodes);
    this.selectNode(updated.id);
  }

  createNode(): void {
    const newId = this.generateId('new_tech');
    const newNode: TechTreeNode = {
      id: newId,
      name: 'New Technology',
      summary: 'Describe what this unlocks and who it belongs to.',
      tier: 1,
      category: 'Unsorted',
      prerequisites: [],
    };

    this.commitNodes([...this.documentState().nodes, newNode]);
    this.selectedId.set(newId);
  }

  duplicateSelected(): void {
    const current = this.selectedNode();
    if (!current) return;

    const duplicateId = this.generateId(`${current.id}_copy`);
    const duplicate: TechTreeNode = {
      ...current,
      id: duplicateId,
      name: `${current.name} (Copy)`,
    };

    this.commitNodes([...this.documentState().nodes, duplicate]);
    this.selectedId.set(duplicateId);
  }

  deleteSelected(): void {
    const current = this.selectedNode();
    if (!current) return;

    const remaining = this.documentState().nodes.filter((node) => node.id !== current.id);
    this.commitNodes(remaining);
    this.selectedId.set(remaining[0]?.id ?? '');
  }

  moveNodeToTier(nodeId: string, tier: number): void {
    const nextTier = Math.max(1, tier);
    const nextNodes = this.documentState().nodes.map((node) =>
      node.id === nodeId
        ? {
            ...node,
            tier: nextTier,
          }
        : node,
    );
    this.commitNodes(nextNodes);
    this.selectNode(nodeId);
  }

  requestImport(payload: TechTreeImportPayload): void {
    const baseDocument: TechTreeDocument = { ...payload.document, lastImportedFrom: payload.sourceLabel };
    this.commitNodes(payload.document.nodes, baseDocument);
    this.selectedId.set(payload.document.nodes[0]?.id ?? '');
  }

  requestExport(): TechTreeExportPayload {
    const exportedAt = new Date().toISOString();
    return {
      exportedAt,
      document: this.documentState(),
    };
  }

  getTierBands(): number[] {
    const maxTier = this.documentState().nodes.reduce((max, node) => Math.max(max, node.tier || 1), 1);
    return Array.from({ length: maxTier }, (_, index) => index + 1);
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

  private commitNodes(nodes: TechTreeNode[], baseDocument?: TechTreeDocument): void {
    const sorted = [...nodes].sort((left, right) => {
      if ((left.tier || 1) !== (right.tier || 1)) {
        return (left.tier || 1) - (right.tier || 1);
      }
      return left.name.localeCompare(right.name);
    });

    const document = baseDocument ?? this.documentState();
    this.documentState.set({
      ...document,
      nodes: sorted,
    });
  }
}
