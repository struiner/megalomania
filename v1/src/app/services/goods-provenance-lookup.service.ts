/**
 * GOODS PROVENANCE LOOKUP SERVICE
 * 
 * Provides deterministic lookup of provenance information for managed goods.
 * Enables SDK tools to retrieve world-aligned provenance data without
 * maintaining duplicate identifiers or breaking alignment with world generation.
 */

import { Injectable } from '@angular/core';
import { ManagedGood } from '../models/managed-goods.model';
import { GoodsProvenanceRecord, GoodsProvenanceLookup } from '../models/goods-provenance.model';
import { GoodsType } from '../enums/GoodsType';
import { FloraType } from '../enums/FloraType';
import { BiomeType } from '../enums/BiomeType';
import { StructureType } from '../enums/StructureType';

export interface ProvenanceLookupResult {
  found: boolean;
  provenance?: GoodsProvenanceRecord;
  good?: ManagedGood;
  suggestions?: GoodsType[];
}

export interface ProvenanceSearchCriteria {
  goodType?: GoodsType;
  primaryBiome?: BiomeType;
  floraSource?: FloraType;
  extractionStructure?: StructureType;
  refinementStructure?: StructureType;
  regionTag?: string;
}

export interface GoodsProvenanceIndex {
  byGoodType: Map<GoodsType, GoodsProvenanceRecord>;
  byBiome: Map<BiomeType, GoodsProvenanceRecord[]>;
  byFlora: Map<FloraType, GoodsProvenanceRecord[]>;
  byStructure: Map<StructureType, GoodsProvenanceRecord[]>;
  byRegion: Map<string, GoodsProvenanceRecord[]>;
}

@Injectable({
  providedIn: 'root'
})
export class GoodsProvenanceLookupService {
  private provenanceIndex: GoodsProvenanceIndex = {
    byGoodType: new Map(),
    byBiome: new Map(),
    byFlora: new Map(),
    byStructure: new Map(),
    byRegion: new Map()
  };

  private goodsLookup: Map<string, ManagedGood> = new Map();

  constructor() {}

  /**
   * Initialize the provenance index with a collection of managed goods
   */
  initializeIndex(goods: ManagedGood[]): void {
    this.clearIndex();
    
    goods.forEach(good => {
      this.goodsLookup.set(good.id, good);
      
      if (good.provenance) {
        this.indexProvenanceRecord(good.provenance, good);
      }
    });
  }

  /**
   * Look up provenance by GoodsType
   */
  getProvenanceByGoodType(goodType: GoodsType): ProvenanceLookupResult {
    const provenance = this.provenanceIndex.byGoodType.get(goodType);
    const good = this.findGoodByType(goodType);

    return {
      found: !!provenance,
      provenance,
      good,
      suggestions: provenance ? undefined : this.getSimilarGoods(goodType)
    };
  }

  /**
   * Search for provenance records matching criteria
   */
  searchProvenance(criteria: ProvenanceSearchCriteria): GoodsProvenanceRecord[] {
    let results: GoodsProvenanceRecord[] = [];

    if (criteria.goodType) {
      const directMatch = this.provenanceIndex.byGoodType.get(criteria.goodType);
      if (directMatch) {
        results.push(directMatch);
      }
    }

    if (criteria.primaryBiome) {
      const biomeMatches = this.provenanceIndex.byBiome.get(criteria.primaryBiome) || [];
      results = this.mergeResults(results, biomeMatches);
    }

    if (criteria.floraSource) {
      const floraMatches = this.provenanceIndex.byFlora.get(criteria.floraSource) || [];
      results = this.mergeResults(results, floraMatches);
    }

    if (criteria.extractionStructure) {
      const structureMatches = this.provenanceIndex.byStructure.get(criteria.extractionStructure) || [];
      results = this.mergeResults(results, structureMatches);
    }

    if (criteria.refinementStructure) {
      const structureMatches = this.provenanceIndex.byStructure.get(criteria.refinementStructure) || [];
      results = this.mergeResults(results, structureMatches);
    }

    if (criteria.regionTag) {
      const regionMatches = this.provenanceIndex.byRegion.get(criteria.regionTag) || [];
      results = this.mergeResults(results, regionMatches);
    }

    // Remove duplicates and sort by relevance
    return this.deduplicateAndSort(results, criteria);
  }

  /**
   * Get all provenance records for a specific biome
   */
  getProvenanceByBiome(biome: BiomeType): GoodsProvenanceRecord[] {
    return this.provenanceIndex.byBiome.get(biome) || [];
  }

  /**
   * Get all provenance records for a specific flora type
   */
  getProvenanceByFlora(flora: FloraType): GoodsProvenanceRecord[] {
    return this.provenanceIndex.byFlora.get(flora) || [];
  }

  /**
   * Get all provenance records for a specific structure type
   */
  getProvenanceByStructure(structure: StructureType): GoodsProvenanceRecord[] {
    return this.provenanceIndex.byStructure.get(structure) || [];
  }

  /**
   * Check if a good has provenance and it's valid
   */
  validateProvenanceExists(goodType: GoodsType): boolean {
    return this.provenanceIndex.byGoodType.has(goodType);
  }

  /**
   * Get a summary of provenance coverage by category
   */
  getProvenanceSummary(): {
    totalGoods: number;
    goodsWithProvenance: number;
    coverageByCategory: Map<string, number>;
    missingProvenance: GoodsType[];
  } {
    const totalGoods = this.goodsLookup.size;
    const goodsWithProvenance = this.provenanceIndex.byGoodType.size;
    const coverageStats = new Map<string, { total: number; withProvenance: number }>();
    const missingProvenance: GoodsType[] = [];

    // Analyze coverage by looking at goods without provenance
    this.goodsLookup.forEach(good => {
      const category = good.category;
      const hasProvenance = !!good.provenance;
      
      const current = coverageStats.get(category) || { total: 0, withProvenance: 0 };
      current.total++;
      if (hasProvenance) current.withProvenance++;
      coverageStats.set(category, current);

      if (!hasProvenance) {
        missingProvenance.push(good.goodsType);
      }
    });

    // Convert to percentages
    const coveragePercentages = new Map<string, number>();
    coverageStats.forEach((stats, category) => {
      coveragePercentages.set(category, (stats.withProvenance / stats.total) * 100);
    });

    return {
      totalGoods,
      goodsWithProvenance,
      coverageByCategory: coveragePercentages,
      missingProvenance
    };
  }

  /**
   * Export provenance data for import/export operations
   */
  exportProvenanceData(): {
    version: string;
    timestamp: string;
    provenanceRecords: GoodsProvenanceRecord[];
    normalizationRules: any;
  } {
    const provenanceRecords = Array.from(this.provenanceIndex.byGoodType.values());
    
    return {
      version: '1.0',
      timestamp: new Date().toISOString(),
      provenanceRecords,
      normalizationRules: {
        ordering: 'alphabetical',
        casing: 'lower-snake',
        deterministic: true
      }
    };
  }

  private clearIndex(): void {
    this.provenanceIndex = {
      byGoodType: new Map(),
      byBiome: new Map(),
      byFlora: new Map(),
      byStructure: new Map(),
      byRegion: new Map()
    };
    this.goodsLookup.clear();
  }

  private indexProvenanceRecord(provenance: GoodsProvenanceRecord, good: ManagedGood): void {
    // Index by good type
    this.provenanceIndex.byGoodType.set(provenance.good, provenance);

    // Index by primary biome
    this.addToIndex(this.provenanceIndex.byBiome, provenance.primaryBiome, provenance);

    // Index by secondary biomes
    provenance.secondaryBiomes.forEach(biome => {
      this.addToIndex(this.provenanceIndex.byBiome, biome, provenance);
    });

    // Index by flora sources
    provenance.floraSources.forEach(flora => {
      this.addToIndex(this.provenanceIndex.byFlora, flora, provenance);
    });

    // Index by extraction structures
    provenance.extractionStructures.forEach(structure => {
      this.addToIndex(this.provenanceIndex.byStructure, structure, provenance);
    });

    // Index by refinement structures
    provenance.refinementStructures.forEach(structure => {
      this.addToIndex(this.provenanceIndex.byStructure, structure, provenance);
    });

    // Index by region tags
    provenance.regionTags.forEach(tag => {
      this.addToIndex(this.provenanceIndex.byRegion, tag, provenance);
    });
  }

  private addToIndex<K, V>(index: Map<K, V[]>, key: K, value: V): void {
    const existing = index.get(key) || [];
    existing.push(value);
    index.set(key, existing);
  }

  private findGoodByType(goodType: GoodsType): ManagedGood | undefined {
    for (const good of this.goodsLookup.values()) {
      if (good.goodsType === goodType) {
        return good;
      }
    }
    return undefined;
  }

  private getSimilarGoods(goodType: GoodsType): GoodsType[] {
    // Simple similarity based on enum proximity (in a real implementation,
    // you might use more sophisticated matching)
    const allGoods = Object.values(GoodsType);
    const currentIndex = allGoods.indexOf(goodType);
    const suggestions: GoodsType[] = [];

    // Suggest nearby goods in the enum
    if (currentIndex > 0) suggestions.push(allGoods[currentIndex - 1]);
    if (currentIndex < allGoods.length - 1) suggestions.push(allGoods[currentIndex + 1]);

    return suggestions;
  }

  private mergeResults(existing: any[], newResults: any[]): any[] {
    const combined = [...existing, ...newResults];
    return combined.filter((item, index, arr) => 
      arr.findIndex(i => i === item) === index
    );
  }

  private deduplicateAndSort(results: GoodsProvenanceRecord[], criteria: ProvenanceSearchCriteria): GoodsProvenanceRecord[] {
    const unique = results.filter((item, index, arr) => 
      arr.findIndex(i => i.good === item.good) === index
    );

    // Sort by relevance to search criteria
    return unique.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      if (criteria.goodType && a.good === criteria.goodType) scoreA += 10;
      if (criteria.primaryBiome && a.primaryBiome === criteria.primaryBiome) scoreA += 5;
      if (criteria.floraSource && a.floraSources.includes(criteria.floraSource)) scoreA += 3;

      if (criteria.goodType && b.good === criteria.goodType) scoreB += 10;
      if (criteria.primaryBiome && b.primaryBiome === criteria.primaryBiome) scoreB += 5;
      if (criteria.floraSource && b.floraSources.includes(criteria.floraSource)) scoreB += 3;

      return scoreB - scoreA;
    });
  }
}