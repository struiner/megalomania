import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EffectOptionSet, EditorTechNode, EditorTechNodeEffects } from './tech-tree-editor.types';

@Component({
  selector: 'app-effects-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './effects-editor.component.html',
  styleUrls: ['./effects-editor.component.scss'],
})
export class EffectsEditorComponent {
  @Input() node: EditorTechNode | null = null;
  @Input() effectOptions: EffectOptionSet | null = null;
  @Output() updateList = new EventEmitter<{ key: keyof EditorTechNodeEffects; values: string[] }>();

  onListChange(key: keyof EditorTechNodeEffects, values: string[]): void {
    this.updateList.emit({ key, values });
  }

  trackOption(_index: number, option: { value: string; label: string }): string {
    return option.value;
  }
}
