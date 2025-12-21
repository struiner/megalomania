import { Injectable, computed, inject, signal } from '@angular/core';
import { CanvasViewport } from '../../components/tech-tree/tech-canvas.component';
import { CultureTagId } from '../../models/tech-tree.models';
import { TechTreeEditorService } from './tech-tree-editor.service';
import { EditorTechNode, EditorTechNodeEffects, EditorTechValidationIssue } from './tech-tree-editor.types';

export interface FieldValidationIssue {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

@Injectable()
export class TechTreeEditorOrchestrator {
  private readonly service = inject(TechTreeEditorService);

  readonly viewport = signal<CanvasViewport>({ panX: 0, panY: 0, scale: 1 });
  readonly previewOpen = signal(false);
  readonly activeCell = signal<{ tier: number; column: number }>({ tier: 1, column: 1 });
  readonly liveAnnouncement = signal('');

  document = this.service.document;
  nodes = this.service.nodes;
  selectedNode = this.service.selectedNode;
  validationIssues = computed(() => [
    ...this.service.validationIssues(),
    ...this.fieldValidationIssues().map((issue) => ({
      path: `node.${issue.field}`,
      message: issue.message,
      severity: issue.severity,
    }) as EditorTechValidationIssue),
  ]);
  cultureTagOptions = this.service.cultureTagOptions;
  effectOptions = this.service.effectOptions;
  iconOptions = this.service.iconOptions;

  tierBands = computed(() => this.service.getTierBands());
  gridColumns = computed(() => this.service.getGridColumnCount());
  columnLabels = computed(() => Array.from({ length: this.gridColumns() }, (_, index) => index + 1));

  fieldValidationIssues = computed<FieldValidationIssue[]>(() => this.resolveFieldValidation());
  fieldValidationByField = computed(() =>
    this.fieldValidationIssues().reduce<Record<string, FieldValidationIssue[]>>((acc, issue) => {
      acc[issue.field] = [...(acc[issue.field] || []), issue];
      return acc;
    }, {}),
  );

  selectNode(id: string): void {
    this.service.selectNode(id);
  }

  moveNode(nodeId: string, tier: number, column: number): void {
    this.service.moveNodeToPosition(nodeId, tier, column);
    this.activeCell.set({ tier, column });
  }

  setViewport(viewport: CanvasViewport): void {
    this.viewport.set(viewport);
  }

  announce(message: string): void {
    this.liveAnnouncement.set(message);
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

  addTierBand(): void {
    this.service.addTierBand();
  }

  trimTierBands(): void {
    this.service.trimTierBands();
  }

  canTrimTierBands(): boolean {
    return this.service.canTrimTierBands();
  }

  updateNode(partial: Partial<EditorTechNode>): void {
    this.service.updateNode(partial);
  }

  updateEffectsList(key: keyof EditorTechNodeEffects, values: string[]): void {
    this.service.updateEffectsList(key, values);
  }

  replaceCultureTags(tags: CultureTagId[]): void {
    this.service.updateCultureTags(tags);
  }

  togglePreview(state: boolean): void {
    this.previewOpen.set(state);
  }

  private resolveFieldValidation(): FieldValidationIssue[] {
    const node = this.selectedNode();
    if (!node) return [];

    const issues: FieldValidationIssue[] = [];

    if (!node.id?.trim()) {
      issues.push({ field: 'id', severity: 'error', message: 'ID is required for export.' });
    }

    if (!node.title?.trim()) {
      issues.push({ field: 'title', severity: 'error', message: 'Title is required.' });
    }

    if (!node.summary?.trim()) {
      issues.push({ field: 'summary', severity: 'warning', message: 'Add a short summary for readability.' });
    } else if (node.summary.length > 240) {
      issues.push({ field: 'summary', severity: 'warning', message: 'Summary should stay under 240 characters.' });
    }

    const maxTier = this.tierBands().at(-1) || 1;
    if ((node.tier || 1) > maxTier) {
      issues.push({ field: 'tier', severity: 'error', message: `Tier exceeds current band (${maxTier}).` });
    }

    const duplicateOrder = this.isDisplayOrderDuplicate(node);
    if (duplicateOrder) {
      issues.push({ field: 'display_order', severity: 'error', message: 'Display order must be unique within a tier.' });
    }

    return issues;
  }

  private isDisplayOrderDuplicate(node: EditorTechNode): boolean {
    const targetTier = node.tier || 1;
    const targetOrder = node.display_order || 1;
    const matches = this.nodes().filter((candidate) => (candidate.tier || 1) === targetTier && (candidate.display_order || 1) === targetOrder);
    return matches.length > 1;
  }
}
