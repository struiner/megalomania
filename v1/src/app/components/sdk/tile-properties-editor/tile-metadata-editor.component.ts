import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TileInfo } from '../../services/mk2/tools/tilemap-analysis.service';

@Component({
  selector: 'app-tile-metadata-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './tile-metadata-editor.component.html',
  styleUrls: ['./tile-metadata-editor.component.scss']
})
export class TileMetadataEditorComponent {
  @Input() editForm!: Partial<TileInfo>;

  @Output() formChange = new EventEmitter<void>();

  get metadata() {
    if (!this.editForm.metadata) this.editForm.metadata = {} as any;
    return this.editForm.metadata;
  }
  set metadata(val: any) {
    this.editForm.metadata = val;
  }

  onFormChange(): void {
    this.formChange.emit();
  }
}
