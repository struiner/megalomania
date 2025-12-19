import { Injectable } from '@angular/core';

import { BiomeType } from '../enums/BiomeType';
import { HazardSeverity } from '../enums/HazardSeverity';
import { HazardDefinition, HazardType, HAZARD_DEFINITIONS } from '../enums/HazardType';
import { HazardType } from '../enums/HazardType';
import { HazardSeverity } from '../enums/HazardSeverity';

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

  /**
   * Adapter responsible for translating `HazardType` enum values into UI-ready option objects.
   *
   * Categories and tags remain stable for compatibility with existing picker flows and validation
   * logic. The optional `severity` field provides a normalized signal for UI overlays (e.g., hazard
   * badges) without forcing consumers to rework existing category/tag handling. Consumers MAY ignore
   * severity until hazard simulation/validation layers explicitly require it.
   */

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

  private readonly severityMap: Record<HazardType, HazardSeverity> = {
    [HazardType.Fire]: HazardSeverity.Critical,
    [HazardType.Flood]: HazardSeverity.Warning,
    [HazardType.Earthquake]: HazardSeverity.Fatal,
    [HazardType.Storm]: HazardSeverity.Warning,
    [HazardType.HarshWinter]: HazardSeverity.Warning,
    [HazardType.BuildingCollapse]: HazardSeverity.Fatal,
    [HazardType.StructuralFailure]: HazardSeverity.Critical,
    [HazardType.Plague]: HazardSeverity.Fatal,
    [HazardType.Epidemic]: HazardSeverity.Critical,
    [HazardType.LivestockDisease]: HazardSeverity.Warning,
    [HazardType.CropFailure]: HazardSeverity.Warning,
    [HazardType.Famine]: HazardSeverity.Fatal,
    [HazardType.Radiation]: HazardSeverity.Fatal,
    [HazardType.ToxicSpill]: HazardSeverity.Critical,
    [HazardType.VentilationFailure]: HazardSeverity.Critical,
    [HazardType.VacuumBreach]: HazardSeverity.Fatal,
    [HazardType.War]: HazardSeverity.Fatal,
    [HazardType.Raid]: HazardSeverity.Critical,
    [HazardType.Intrusion]: HazardSeverity.Warning,
    [HazardType.ContainmentBreach]: HazardSeverity.Critical,
    [HazardType.SocialUnrest]: HazardSeverity.Warning,
    [HazardType.WitchHunt]: HazardSeverity.Warning,
    [HazardType.Electrical]: HazardSeverity.Warning,
    [HazardType.MagicalBacklash]: HazardSeverity.Critical,
    [HazardType.Flooding]: HazardSeverity.Warning,
    [HazardType.VacuumExposure]: HazardSeverity.Fatal,
    [HazardType.HostileFauna]: HazardSeverity.Warning,
    [HazardType.Biohazard]: HazardSeverity.Critical,
    [HazardType.Chemical]: HazardSeverity.Warning,
    [HazardType.ToxicGas]: HazardSeverity.Fatal,
    [HazardType.Vacuum]: HazardSeverity.Fatal,
    [HazardType.Fauna]: HazardSeverity.Warning,
    [HazardType.PressureLoss]: HazardSeverity.Fatal,
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
