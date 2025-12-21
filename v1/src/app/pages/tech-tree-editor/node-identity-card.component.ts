import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FieldValidationIssue } from './tech-tree-editor.orchestrator';
import { EditorTechNode } from './tech-tree-editor.types';

@Component({
  selector: 'app-node-identity-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './node-identity-card.component.html',
  styleUrls: ['./node-identity-card.component.scss'],
})
export class NodeIdentityCardComponent {
  @Input() node: EditorTechNode | null = null;
  @Input() tierBands: number[] = [];
  @Input() validation: Record<string, FieldValidationIssue[]> = {};
  @Output() update = new EventEmitter<Partial<EditorTechNode>>();

  onChange(partial: Partial<EditorTechNode>): void {
    this.update.emit(partial);
  }

  trackIssue(_index: number, issue: FieldValidationIssue): string {
    return `${issue.field}-${issue.message}`;
  }
}
