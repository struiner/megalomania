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
    [HazardType.Earthquake]: 'environmental',
    [HazardType.Storm]: 'environmental',
    [HazardType.HarshWinter]: 'environmental',
    [HazardType.BuildingCollapse]: 'structural',
    [HazardType.StructuralFailure]: 'structural',
    [HazardType.Plague]: 'biological',
    [HazardType.Epidemic]: 'biological',
    [HazardType.LivestockDisease]: 'biological',
    [HazardType.CropFailure]: 'environmental',
    [HazardType.Famine]: 'environmental',
    [HazardType.Radiation]: 'environmental',
    [HazardType.ToxicSpill]: 'environmental',
    [HazardType.VentilationFailure]: 'structural',
    [HazardType.VacuumBreach]: 'environmental',
    [HazardType.War]: 'security',
    [HazardType.Raid]: 'security',
    [HazardType.Intrusion]: 'security',
    [HazardType.ContainmentBreach]: 'security',
    [HazardType.SocialUnrest]: 'security',
    [HazardType.WitchHunt]: 'security',
    [HazardType.Electrical]: 'structural',
    [HazardType.MagicalBacklash]: 'environmental',
    [HazardType.Flooding]: 'environmental',
    [HazardType.VacuumExposure]: 'environmental',
    [HazardType.HostileFauna]: 'biological',
    [HazardType.Biohazard]: 'biological',
    [HazardType.Chemical]: 'environmental',
    [HazardType.ToxicGas]: 'environmental',
    [HazardType.Vacuum]: 'environmental',
    [HazardType.Fauna]: 'biological',
    [HazardType.PressureLoss]: 'environmental',
  };

  private readonly tags: Record<HazardType, string[]> = {
    [HazardType.Fire]: ['urban', 'shipboard', 'workshop'],
    [HazardType.Flood]: ['coastal', 'cavern'],
    [HazardType.Earthquake]: ['tectonic', 'mining'],
    [HazardType.Storm]: ['weather', 'coastal'],
    [HazardType.HarshWinter]: ['climate', 'survival'],
    [HazardType.BuildingCollapse]: ['structural', 'aging'],
    [HazardType.StructuralFailure]: ['aging', 'tremor'],
    [HazardType.Plague]: ['disease', 'overcrowding'],
    [HazardType.Epidemic]: ['disease', 'trade'],
    [HazardType.LivestockDisease]: ['agriculture', 'farming'],
    [HazardType.CropFailure]: ['agriculture', 'farming'],
    [HazardType.Famine]: ['agriculture', 'trade'],
    [HazardType.Radiation]: ['reactor', 'arcane'],
    [HazardType.ToxicSpill]: ['industrial', 'accident'],
    [HazardType.VentilationFailure]: ['underground', 'confined'],
    [HazardType.VacuumBreach]: ['space', 'hull'],
    [HazardType.War]: ['conflict', 'political'],
    [HazardType.Raid]: ['conflict', 'border'],
    [HazardType.Intrusion]: ['boarding', 'siege', 'urban'],
    [HazardType.ContainmentBreach]: ['prison', 'facility'],
    [HazardType.SocialUnrest]: ['political', 'economic'],
    [HazardType.WitchHunt]: ['political', 'religious'],
    [HazardType.Electrical]: ['infrastructure', 'shipboard'],
    [HazardType.MagicalBacklash]: ['arcane', 'experimental'],
    [HazardType.Flooding]: ['coastal', 'weather'],
    [HazardType.VacuumExposure]: ['space', 'pressure'],
    [HazardType.HostileFauna]: ['wilderness', 'untamed'],
    [HazardType.Biohazard]: ['medical', 'research'],
    [HazardType.Chemical]: ['industrial', 'laboratory'],
    [HazardType.ToxicGas]: ['mine', 'laboratory'],
    [HazardType.Vacuum]: ['space', 'pressure'],
    [HazardType.Fauna]: ['wilderness', 'sewers'],
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
