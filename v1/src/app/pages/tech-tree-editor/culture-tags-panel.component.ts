import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CultureTagId } from '../../models/tech-tree.models';
import { CultureTagComboboxComponent } from './culture-tag-combobox.component';
import { GovernedCultureTagOption } from './tech-tree-editor.types';

@Component({
  selector: 'app-culture-tags-panel',
  standalone: true,
  imports: [CommonModule, CultureTagComboboxComponent],
  templateUrl: './culture-tags-panel.component.html',
  styleUrls: ['./culture-tags-panel.component.scss'],
})
export class CultureTagsPanelComponent {
  @Input() options: GovernedCultureTagOption[] = [];
  @Input() selectedIds: CultureTagId[] = [];
  @Input() defaultTags: CultureTagId[] = [];
  @Output() selectionChange = new EventEmitter<CultureTagId[]>();

  showLegacy = signal(false);

  toggleLegacy(): void {
    this.showLegacy.set(!this.showLegacy());
  }

  onSelectionChange(tags: CultureTagId[]): void {
    this.selectionChange.emit(Array.from(new Set(tags)));
  }

  onCheckboxChange(tagId: CultureTagId, checked: boolean): void {
    const next = new Set(this.selectedIds);
    if (checked) {
      next.add(tagId);
    } else {
      next.delete(tagId);
    }
    this.selectionChange.emit(Array.from(next));
  }

  describeDefaults(): string {
    return this.defaultTags.length ? this.defaultTags.join(', ') : 'none';
  }
}
