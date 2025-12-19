import { Injectable } from '@angular/core';

import { BiomeType } from '../enums/BiomeType';
import { HazardSeverity } from '../enums/HazardSeverity';
import { HazardDefinition, HazardType, HAZARD_DEFINITIONS } from '../enums/HazardType';

export interface HazardOption {
  id: HazardType;
  label: string;
  category: HazardDefinition['category'];
  tags: string[];
  severity: HazardSeverity;
  biomes: BiomeType[];
}

@Injectable({ providedIn: 'root' })
export class HazardTypeAdapterService {
  private readonly locale = 'en';

  getHazardOptions(): HazardOption[] {
    return Object.values(HazardType)
      .map((id) => this.toOption(id))
      .sort((left, right) => left.label.localeCompare(right.label, this.locale));
  }

  labelFor(id: HazardType): string {
    const option = this.toOption(id);
    return option.label;
  }

  private toOption(id: HazardType): HazardOption {
    const definition = this.definitionFor(id);
    return {
      id,
      label: definition.label,
      category: definition.category,
      tags: definition.tags,
      severity: definition.severity,
      biomes: definition.biomes,
    };
  }

  private definitionFor(id: HazardType): HazardDefinition {
    return (
      HAZARD_DEFINITIONS[id] ?? {
        type: id,
        label: this.formatLabel(id),
        category: 'environmental',
        severity: HazardSeverity.Moderate,
        biomes: [],
        tags: [],
      }
    );
  }

  private formatLabel(raw: string): string {
    return raw
      .replace(/_/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
