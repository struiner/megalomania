import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SettlementNamingService {
  private readonly coastalRoots = ['Port', 'Lake', 'Stone', 'Bay', 'Shore', 'Cliff', 'North', 'South', 'East', 'West'];
  private readonly inlandRoots = ['Ridge', 'Field', 'Oak', 'River', 'Pine', 'Hill', 'Crest', 'Willow', 'Glen', 'Crown'];
  private readonly suffixes = ['ton', 'ville', 'stead', 'burg', 'mouth', 'ford', 'haven', 'holm'];

  generate(rand: () => number, biomeHint?: string): string {
    const roots = this.pickRoots(biomeHint);
    const root = roots[Math.floor(rand() * roots.length)];
    const suffix = this.suffixes[Math.floor(rand() * this.suffixes.length)];
    return `${root}${suffix}`;
  }

  private pickRoots(biomeHint?: string): string[] {
    if (!biomeHint) {
      return [...this.coastalRoots, ...this.inlandRoots];
    }

    if (biomeHint.includes('coast') || biomeHint.includes('ocean') || biomeHint.includes('bay')) {
      return this.coastalRoots;
    }

    return this.inlandRoots;
  }
}
