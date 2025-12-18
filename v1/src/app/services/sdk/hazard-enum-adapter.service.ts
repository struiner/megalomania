import { Injectable } from '@angular/core';

import { HazardType } from '../../enums/HazardType';
import { buildEnumNormalizationMap, mapValuesToCanonical, normalizeIdentifier } from '../tech-identifier-normalizer';

export type HazardOptionSource = 'enum' | 'fallback';

export interface HazardOption {
  value: HazardType | string;
  label: string;
  canonical: HazardType | null;
  source: HazardOptionSource;
}

@Injectable({ providedIn: 'root' })
export class HazardEnumAdapterService {
  private readonly locale = 'en';
  private readonly normalizationMap = this.buildNormalizationMap();

  getHazardOptions(extraValues: string[] = []): HazardOption[] {
    const canonicalValues = Object.values(HazardType);
    const canonicalOptions = canonicalValues.map((value) => this.toOption(value, 'enum', value));

    const normalizedExtras = mapValuesToCanonical(extraValues, this.normalizationMap);
    const fallbackValues = normalizedExtras.filter((value) => !this.isHazardType(value));
    const fallbackOptions = fallbackValues.map((value) => this.toOption(value, 'fallback', null));

    return this.sortOptions(this.dedupeOptions([...canonicalOptions, ...fallbackOptions]));
  }

  normalizeSelection(values: string[]): HazardType[] {
    const normalized = mapValuesToCanonical(values, this.normalizationMap);
    return normalized.filter((value): value is HazardType => this.isHazardType(value));
  }

  sortSelection(values: HazardType[]): HazardType[] {
    const unique = Array.from(new Set(values));
    return unique.sort((left, right) => this.formatLabel(left).localeCompare(this.formatLabel(right), this.locale));
  }

  private dedupeOptions(options: HazardOption[]): HazardOption[] {
    const seen = new Set<string>();
    const unique: HazardOption[] = [];

    options.forEach((option) => {
      if (seen.has(option.value)) {
        return;
      }

      seen.add(option.value);
      unique.push(option);
    });

    return unique;
  }

  private sortOptions(options: HazardOption[]): HazardOption[] {
    return [...options].sort((a, b) => a.label.localeCompare(b.label, this.locale));
  }

  private toOption(value: HazardOption['value'], source: HazardOptionSource, canonical: HazardType | null): HazardOption {
    return {
      value,
      label: this.formatLabel(value),
      canonical,
      source,
    };
  }

  private formatLabel(rawValue: string): string {
    if (!rawValue) {
      return 'Unknown';
    }

    const spaced = rawValue
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/[_-]+/g, ' ')
      .trim();

    return spaced
      .split(' ')
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private buildNormalizationMap(): Record<string, string> {
    const map = buildEnumNormalizationMap(HazardType);

    Object.entries(this.compatibilityAliases).forEach(([alias, canonical]) => {
      const key = normalizeIdentifier(alias);
      if (!map[key]) {
        map[key] = canonical;
      }
    });

    return map;
  }

  private isHazardType(value: string): value is HazardType {
    return Object.values(HazardType).includes(value as HazardType);
  }

  private readonly compatibilityAliases: Record<string, HazardType> = {
    // Direct vocabulary alignments
    Fire: HazardType.Fire,
    Flood: HazardType.Flooding,
    Intrusion: HazardType.Intrusion,
    Electrical: HazardType.Electrical,
    Vacuum: HazardType.VacuumExposure,
    Fauna: HazardType.HostileFauna,
    // Expected synonyms from editor payloads
    'Hull breach': HazardType.VacuumExposure,
    Depressurization: HazardType.VacuumExposure,
    'Atmospheric loss': HazardType.VacuumExposure,
    'Water ingress': HazardType.Flooding,
    Flooding: HazardType.Flooding,
    Breach: HazardType.Intrusion,
    Sabotage: HazardType.Intrusion,
    Wildlife: HazardType.HostileFauna,
    Beast: HazardType.HostileFauna,
    'Hostile fauna': HazardType.HostileFauna,
    Biohazard: HazardType.Biohazard,
    Contagion: HazardType.Biohazard,
    Quarantine: HazardType.Biohazard,
    Radiation: HazardType.Radiation,
    'Radiation leak': HazardType.Radiation,
    Chemical: HazardType.Chemical,
    'Chemical spill': HazardType.Chemical,
    'Toxic gas': HazardType.Chemical,
    'Structural failure': HazardType.StructuralFailure,
    Collapse: HazardType.StructuralFailure,
    'Hull stress': HazardType.StructuralFailure,
  };
}
