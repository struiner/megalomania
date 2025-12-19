import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TechIconOption } from '../../services/tech-icon-registry.service';

@Component({
  selector: 'app-tech-icon-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="icon-picker">
      <select [ngModel]="value" (ngModelChange)="onChange($event)">
        <option [ngValue]="null">No icon (use shared frame)</option>
        <ng-container *ngFor="let group of groupedIcons">
          <optgroup [label]="toCategoryLabel(group.category)">
            <option *ngFor="let icon of group.icons" [ngValue]="icon.id">
              {{ icon.label }} · {{ icon.source || 'shared' }}
            </option>
          </optgroup>
        </ng-container>
      </select>

      <div class="icon-preview" *ngIf="selectedIcon">
        <p class="name">{{ selectedIcon.label }}</p>
        <p class="meta">Category: {{ toCategoryLabel(selectedIcon.category || '') }}</p>
        <p class="meta">Frame: {{ selectedIcon.frame || 'shared' }}</p>
        <p class="meta" *ngIf="selectedIcon.overlays && selectedIcon.overlays.length">
          Overlays: {{ selectedIcon.overlays.join(', ') }}
        </p>
        <p class="meta" *ngIf="selectedIcon.notes">{{ selectedIcon.notes }}</p>
      </div>
    </div>
  `,
  styles: [`
    .icon-picker {
      display: grid;
      gap: 6px;
    }

    select {
      width: 100%;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.18);
      padding: 6px;
      background: rgba(0, 0, 0, 0.35);
      color: inherit;
    }

    optgroup {
      color: #e8e0ff;
      background: #0d0a15;
    }

    option {
      color: #0d0a15;
    }

    .icon-preview {
      border: 1px dashed rgba(255, 255, 255, 0.18);
      border-radius: 6px;
      padding: 8px;
      background: rgba(255, 255, 255, 0.02);
      display: grid;
      gap: 2px;
    }

    .name {
      margin: 0;
      font-weight: 600;
    }

    .meta {
      margin: 0;
      opacity: 0.78;
      font-size: 12px;
    }
  `],
})
export class TechIconPickerComponent {
  @Input() icons: TechIconOption[] = [];
  @Input() value: string | null = null;
  @Output() valueChange = new EventEmitter<string | null>();

  get groupedIcons(): Array<{ category: TechIconOption['category']; icons: TechIconOption[] }> {
    const groups: Record<string, TechIconOption[]> = {};
    this.icons.forEach((icon) => {
      const bucket = groups[icon.category] ?? [];
      bucket.push(icon);
      groups[icon.category] = bucket;
    });

    return Object.entries(groups)
      .map(([category, icons]) => ({
        category: category as TechIconOption['category'],
        icons: icons.sort((a, b) => a.label.localeCompare(b.label)),
      }))
      .sort((a, b) => a.category.localeCompare(b.category));
  }

  get selectedIcon(): TechIconOption | undefined {
    return this.icons.find((icon) => icon.id === this.value || icon.id === this.value?.toString());
  }

  onChange(next: string | null): void {
    this.valueChange.emit(next);
  }

  toCategoryLabel(category: string): string {
    return category.charAt(0).toUpperCase() + category.slice(1);
  }
}
