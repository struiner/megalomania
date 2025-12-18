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
    this.documentState.set({
      ...this.documentState(),
      nodes: this.documentState().nodes.map((node) => (node.id === updated.id ? updated : node)),
    });
    this.selectNode(updated.id);
  }

  requestImport(payload: TechTreeImportPayload): void {
    // Hook point for the import service. For now, we accept the document and record provenance.
    this.documentState.set({ ...payload.document, lastImportedFrom: payload.sourceLabel });
    const newSelectedId = payload.document.nodes[0]?.id ?? '';
    this.selectedId.set(newSelectedId);
  }

  requestExport(): TechTreeExportPayload {
    // Hook point for the export service. Caller can swap this for an API or SDK integration.
    const exportedAt = new Date().toISOString();
    return {
      exportedAt,
      document: this.documentState(),
    };
  }

  getTierBands(): number[] {
    const maxTier = this.documentState().nodes.reduce((max, node) => Math.max(max, node.tier), 1);
    return Array.from({ length: maxTier }, (_, index) => index + 1);
  }
}
