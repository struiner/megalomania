import { inject, Injectable, InjectionToken } from '@angular/core';
import { SettlementType } from '../../../../shared/enums/SettlementType';

export interface CityNameService {
  generateSettlementName(rand: () => number, context: { type: SettlementType; seed?: string }): string;
}

@Injectable({ providedIn: 'root' })
export class CultureAgnosticNameService implements CityNameService {
  private readonly roots = ['Port', 'Lake', 'Stone', 'Bay', 'Shore', 'Cliff', 'North', 'South', 'East', 'West'];
  private readonly suffixes = ['ton', 'ville', 'stead', 'burg', 'mouth', 'ford', 'haven', 'holm'];

  generateSettlementName(rand: () => number, context: { type: SettlementType; seed?: string }): string {
    const root = this.roots[this.pickDeterministicIndex(rand, this.roots.length, `${context.seed ?? context.type}_root`)];
    const suffix = this.suffixes[this.pickDeterministicIndex(rand, this.suffixes.length, `${context.seed ?? context.type}_suffix`)];

    return `${root}${suffix}`;
  }

  private pickDeterministicIndex(rand: () => number, length: number, seed?: string): number {
    if (length === 0) {
      return 0;
    }

    const base = Math.floor(rand() * length);

    if (!seed) {
      return base;
    }

    const offset = this.hashSeed(seed) % length;
    return (base + offset) % length;
  }

  private hashSeed(seed: string): number {
    let hash = 0;

    for (let i = 0; i < seed.length; i++) {
      hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }

    return hash;
  }
}

export const CITY_NAME_SERVICE = new InjectionToken<CityNameService>('CityNameService', {
  providedIn: 'root',
  factory: () => inject(CultureAgnosticNameService),
});

/**
 * Extension: Provide a culture-specific CityNameService by supplying the CITY_NAME_SERVICE
 * injection token with your own implementation. Custom services can mix in biome, language,
 * or lore-aware root/suffix pools while remaining deterministic by relying solely on the
 * provided rand() function and optional context.seed value.
 */
