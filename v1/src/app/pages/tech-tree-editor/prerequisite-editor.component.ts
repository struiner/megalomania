import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TECH_PREREQUISITE_RELATION, TechNodePrerequisite } from '../../models/tech-tree.models';
import { EditorTechNode } from './tech-tree-editor.types';

@Component({
  selector: 'app-prerequisite-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prerequisite-editor.component.html',
  styleUrls: ['./prerequisite-editor.component.scss'],
})
export class PrerequisiteEditorComponent {
  @Input() node: EditorTechNode | null = null;
  @Input() nodes: EditorTechNode[] = [];
  @Output() update = new EventEmitter<TechNodePrerequisite[]>();

  candidateId: string | null = null;
  candidateRelation: TechNodePrerequisite['relation'] = TECH_PREREQUISITE_RELATION.Requires;

  get availableNodes(): EditorTechNode[] {
    return this.nodes.filter((n) => n.id !== this.node?.id);
  }

  addPrerequisite(): void {
    if (!this.node || !this.candidateId) return;
    const next: TechNodePrerequisite = {
      node: this.candidateId,
      relation: this.candidateRelation,
    };
    const current = this.node.prerequisites || [];
    const filtered = current.filter((entry) => entry.node !== next.node);
    this.update.emit([...filtered, next]);
    this.candidateId = null;
  }

  removePrerequisite(id: string): void {
    if (!this.node) return;
    const filtered = (this.node.prerequisites || []).filter((entry) => entry.node !== id);
    this.update.emit(filtered);
  }

  trackNode(_index: number, node: EditorTechNode): string {
    return node.id;
  }

  trackPrereq(_index: number, prereq: TechNodePrerequisite): string {
    return prereq.node;
  }

  resolveLabel(id: string): string {
    const match = this.nodes.find((node) => node.id === id);
    return match ? `${match.title} (Tier ${match.tier || 1})` : id;
  }
}
