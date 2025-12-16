import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TileInfo } from '../../../services/mk2/tools/tilemap-analysis.service';

@Component({
  selector: 'app-tile-basic-properties',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './tile-basic-properties.component.html',
  styleUrls: ['./tile-basic-properties.component.scss']
})
export class TileBasicPropertiesComponent {
  @Input() editForm!: Partial<TileInfo>;
  @Input() availableCategories: string[] = [];
  @Input() availableSubcategories: string[] = [];
  @Input() selectedTiles: TileInfo[] = [];

  @Output() formChange = new EventEmitter<void>();
  @Output() categoryChange = new EventEmitter<void>();

  onFormChange(): void {
    this.formChange.emit();
  }

  onCategoryChange(): void {
    this.categoryChange.emit();
    this.formChange.emit();
  }
}
