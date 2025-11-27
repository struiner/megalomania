import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { TileInfo } from '../../services/mk2/tools/tilemap-analysis.service';

@Component({
  selector: 'app-tile-tags-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './tile-tags-editor.component.html',
  styleUrls: ['./tile-tags-editor.component.scss']
})
export class TileTagsEditorComponent {
  @Input() editForm!: Partial<TileInfo>;
  @Input() suggestedTags: string[] = [];
  newTag = '';

  @Output() formChange = new EventEmitter<void>();

  addTag(tag?: string) {
    const tagToAdd = (tag || this.newTag)?.trim();
    if (!tagToAdd) return;
    if (!this.editForm.tags) this.editForm.tags = [];
    if (!this.editForm.tags.includes(tagToAdd)) {
      this.editForm.tags.push(tagToAdd);
      this.formChange.emit();
    }
    if (!tag) this.newTag = '';
  }

  removeTag(tag: string) {
    if (this.editForm.tags) {
      this.editForm.tags = this.editForm.tags.filter(t => t !== tag);
      this.formChange.emit();
    }
  }
}
