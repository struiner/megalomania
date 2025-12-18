import { Injectable } from '@angular/core';

import { HazardType } from '../enums/HazardType';

export interface HazardOption {
  id: HazardType;
  label: string;
  category: 'environmental' | 'structural' | 'biological' | 'security';
  tags: string[];
}

@Injectable({ providedIn: 'root' })
export class HazardTypeAdapterService {
  private readonly locale = 'en';

  // TODO: Extend with explicit severity categories once validation service consumes them.

  private readonly categoryMap: Record<HazardType, HazardOption['category']> = {
    [HazardType.Fire]: 'environmental',
    [HazardType.Flood]: 'environmental',
    [HazardType.Intrusion]: 'security',
    [HazardType.Electrical]: 'structural',
    [HazardType.Vacuum]: 'environmental',
    [HazardType.Fauna]: 'biological',
    [HazardType.StructuralFailure]: 'structural',
    [HazardType.ToxicGas]: 'environmental',
    [HazardType.Radiation]: 'environmental',
    [HazardType.Biohazard]: 'biological',
    [HazardType.PressureLoss]: 'environmental',
  };

  private readonly tags: Record<HazardType, string[]> = {
    [HazardType.Fire]: ['urban', 'shipboard', 'workshop'],
    [HazardType.Flood]: ['coastal', 'cavern'],
    [HazardType.Intrusion]: ['boarding', 'siege', 'urban'],
    [HazardType.Electrical]: ['infrastructure', 'shipboard'],
    [HazardType.Vacuum]: ['space', 'pressure'],
    [HazardType.Fauna]: ['wilderness', 'sewers'],
    [HazardType.StructuralFailure]: ['aging', 'tremor'],
    [HazardType.ToxicGas]: ['mine', 'laboratory'],
    [HazardType.Radiation]: ['reactor', 'arcane'],
    [HazardType.Biohazard]: ['medical', 'research'],
    [HazardType.PressureLoss]: ['hull', 'bulkhead'],
  };

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
    return {
      id,
      label: this.formatLabel(id),
      category: this.categoryMap[id] ?? 'environmental',
      tags: this.tags[id] ?? [],
    };
  }

  private formatLabel(raw: string): string {
    return raw
      .replace(/_/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
