import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, inject } from '@angular/core';

import { HazardType } from '../../../enums/HazardType';
import { HazardIconRegistryService } from '../../../services/hazard-icon-registry.service';
import { HazardIconDefinition, HazardIconValidationIssue } from '../../../types/hazard';

@Component({
  selector: 'app-hazard-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hazard-picker.component.html',
  styleUrls: ['./hazard-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HazardPickerComponent implements OnChanges {
  @Input() selected: HazardType[] = [];
  @Output() selectedChange = new EventEmitter<HazardType[]>();

  private readonly registry = inject(HazardIconRegistryService);
  readonly hazards: HazardIconDefinition[] = this.registry.getIcons();
  readonly validationIssues: HazardIconValidationIssue[] = this.registry.validateRegistry();

  private readonly selection = new Set<HazardType>();

  ngOnChanges(): void {
    this.selection.clear();
    (this.selected ?? []).forEach((hazard) => this.selection.add(hazard));
  }

  toggleHazard(hazard: HazardType): void {
    if (this.selection.has(hazard)) {
      this.selection.delete(hazard);
    } else {
      this.selection.add(hazard);
    }

    const ordered = this.registry.sortHazards(Array.from(this.selection));
    this.selection.clear();
    ordered.forEach((entry) => this.selection.add(entry));
    this.selectedChange.emit(ordered);
  }

  isSelected(hazard: HazardType): boolean {
    return this.selection.has(hazard);
  }

  labelFor(hazard: HazardType): string {
    return this.registry.labelFor(hazard);
  }

  trackByType(_: number, hazard: HazardIconDefinition): string {
    return hazard.type;
  }
}
