import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CanvasViewport, TechCanvasComponent } from '../../components/tech-tree/tech-canvas.component';
import { CultureTagId, CultureTagNamespace, TechNodePrerequisite } from '../../models/tech-tree.models';
import { TechIconPickerComponent } from './tech-icon-picker.component';
import { CultureTagsPanelComponent } from './culture-tags-panel.component';
import { EffectsEditorComponent } from './effects-editor.component';
import { NodeIdentityCardComponent } from './node-identity-card.component';
import { PrerequisiteEditorComponent } from './prerequisite-editor.component';
import { TECH_TREE_FIXTURE_DOCUMENT } from './tech-tree-editor.fixtures';
import { TechTreeEditorOrchestrator } from './tech-tree-editor.orchestrator';
import { TechTreeEditorService } from './tech-tree-editor.service';
import { TechTreePreviewDialogComponent } from './tech-tree-preview-dialog.component';
import { EditorTechNode, EditorTechNodeEffects, TechTreeImportPayload } from './tech-tree-editor.types';

@Component({
  selector: 'app-tech-tree-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TechCanvasComponent,
    NodeIdentityCardComponent,
    CultureTagsPanelComponent,
    EffectsEditorComponent,
    PrerequisiteEditorComponent,
    TechIconPickerComponent,
    TechTreePreviewDialogComponent,
  ],
  providers: [TechTreeEditorService, TechTreeEditorOrchestrator],
  templateUrl: './tech-tree-editor.component.html',
  styleUrls: ['./tech-tree-editor.component.scss'],
})
export class TechTreeEditorComponent {
  private readonly orchestrator = inject(TechTreeEditorOrchestrator);
  private readonly service = inject(TechTreeEditorService);

  document = this.orchestrator.document;
  nodes = this.orchestrator.nodes;
  selectedNode = this.orchestrator.selectedNode;
  validationIssues = this.orchestrator.validationIssues;
  fieldValidationByField = this.orchestrator.fieldValidationByField;
  cultureTagOptions = this.orchestrator.cultureTagOptions;
  effectOptions = this.orchestrator.effectOptions;
  iconOptions = this.orchestrator.iconOptions;
  tierBands = this.orchestrator.tierBands;
  gridColumns = this.orchestrator.gridColumns;
  columnLabels = this.orchestrator.columnLabels;
  viewport = this.orchestrator.viewport;
  previewOpen = this.orchestrator.previewOpen;

  importErrorMessage = this.service.importErrorMessage;
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

  resolvedCultureTags = computed(() => {
    const explicitTags = this.selectedNode()?.culture_tags || [];
    return explicitTags.length ? explicitTags : this.document().default_culture_tags;
  });

  importIssues = computed(() => this.validationIssues().filter((issue) => issue.path.startsWith('import')));

  selectedTagUsage = computed(() => {
    const target = this.tagTarget();
    const usage = this.cultureTagUsage();
    return target ? usage[target] || [] : [];
  });

  private selectedCultureTagSet = computed(
    () =>
      new Set(
        (this.selectedNode()?.culture_tags?.length ? this.selectedNode()?.culture_tags : this.document().default_culture_tags)
          || [],
      ),
  );

  onViewportChange(viewport: CanvasViewport): void {
    this.orchestrator.setViewport(viewport);
  }

  onMoveNode(payload: { nodeId: string; tier: number; column: number }): void {
    this.orchestrator.moveNode(payload.nodeId, payload.tier, payload.column);
  }

  selectNode(id: string): void {
    this.orchestrator.selectNode(id);
  }

  updateNode(partial: Partial<EditorTechNode>): void {
    this.orchestrator.updateNode(partial);
  }

  updateEffectsList(key: keyof EditorTechNodeEffects, values: string[]): void {
    this.orchestrator.updateEffectsList(key, values);
  }

  updatePrerequisites(prerequisites: TechNodePrerequisite[]): void {
    this.orchestrator.updateNode({ prerequisites });
  }

  replaceCultureTags(tagIds: CultureTagId[]): void {
    this.orchestrator.replaceCultureTags(tagIds);
  }

  triggerImport(): void {
    const payload: TechTreeImportPayload = {
      sourceLabel: 'fixture-import',
      raw: TECH_TREE_FIXTURE_DOCUMENT,
    };
    this.service.requestImport(payload);
  }

  triggerExport(): void {
    this.service.requestExport();
  }

  addTierBand(): void {
    this.orchestrator.addTierBand();
  }

  trimTierBands(): void {
    this.orchestrator.trimTierBands();
  }

  canTrimTierBands(): boolean {
    return this.orchestrator.canTrimTierBands();
  }

  createNode(): void {
    this.orchestrator.createNode();
  }

  duplicateNode(): void {
    this.orchestrator.duplicateNode();
  }

  deleteNode(): void {
    this.orchestrator.deleteNode();
  }

  openPreview(): void {
    this.orchestrator.togglePreview(true);
  }

  closePreview(): void {
    this.orchestrator.togglePreview(false);
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

  toggleCultureTag(tagId: CultureTagId): void {
    const currentTags = this.selectedNode()?.culture_tags || [];
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter((id) => id !== tagId)
      : [...currentTags, tagId];
    this.replaceCultureTags(newTags);
  }

  updateIcon(iconId: string | null): void {
    this.service.updateIconSelection(iconId);
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
  }
}
