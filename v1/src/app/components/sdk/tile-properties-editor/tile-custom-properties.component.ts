import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TileInfo } from '../../../services/mk2/tools/tilemap-analysis.service';

@Component({
  selector: 'app-tile-custom-properties',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './tile-custom-properties.component.html',
  styleUrls: ['./tile-custom-properties.component.scss']
})
export class TileCustomPropertiesComponent {
  @Input() editForm!: Partial<TileInfo>;
  newPropertyKey = '';
  newPropertyValue = '';

  get customProperties(): { key: string; value: string }[] {
    // @ts-ignore: fallback for missing property
    return (this.editForm as any).customProperties ?? [];
  }
  set customProperties(val: { key: string; value: string }[]) {
    // @ts-ignore: fallback for missing property
    (this.editForm as any).customProperties = val;
  }

  addProperty() {
    const key = this.newPropertyKey.trim();
    const value = this.newPropertyValue.trim();
    if (!key) return;
    const props = this.customProperties;
    props.push({ key, value });
    this.customProperties = props;
    this.newPropertyKey = '';
    this.newPropertyValue = '';
  }

  removeProperty(index: number) {
    const props = this.customProperties;
    props.splice(index, 1);
    this.customProperties = props;
  }
}
