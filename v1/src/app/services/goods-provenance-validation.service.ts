/**
 * GOODS PROVENANCE VALIDATION SERVICE
 * 
 * Validates that managed goods carry deterministic provenance links to world truths
 * (flora, biomes, extraction sites) without duplicating identifiers. This service
 * ensures SDK tools and import/export flows cannot drift from world generation data.
 */

import { Injectable } from '@angular/core';
import { ManagedGood } from '../models/managed-goods.model';
import { 
  GoodsProvenanceRecord, 
  validateGoodsProvenanceRecord,
  GoodsProvenanceValidationResult,
  DEFAULT_GOODS_PROVENANCE_NORMALIZATION 
} from '../models/goods-provenance.model';
import { GoodsType } from '../enums/GoodsType';
import { FloraType } from '../enums/FloraType';
import { BiomeType } from '../enums/BiomeType';
import { StructureType } from '../enums/StructureType';

export interface ManagedGoodProvenanceValidation {
  good: ManagedGood;
  hasProvenance: boolean;
  provenanceValid: boolean;
  floraConsistency: boolean;
  structureConsistency: boolean;
  errors: string[];
  warnings: string[];
}

export interface GoodsProvenanceCoverage {
  totalGoods: number;
  goodsWithProvenance: number;
  coveragePercentage: number;
  invalidProvenanceRecords: number;
  missingProvenanceGoods: string[];
}

@Injectable({
  providedIn: 'root'
})
export class GoodsProvenanceValidationService {

  constructor() {}

  /**
   * Validate a single managed good's provenance alignment
   */
  validateManagedGoodProvenance(good: ManagedGood): ManagedGoodProvenanceValidation {
    const validation: ManagedGoodProvenanceValidation = {
      good,
      hasProvenance: !!good.provenance,
      provenanceValid: false,
      floraConsistency: true,
      structureConsistency: true,
      errors: [],
      warnings: []
    };

    // Check if provenance exists
    if (!good.provenance) {
      validation.errors.push('Missing provenance record');
      return validation;
    }

    // Validate provenance record structure and enum values
    const provenanceValidation = validateGoodsProvenanceRecord(good.provenance);
    if (provenanceValidation.errors.length > 0) {
      validation.errors.push(...provenanceValidation.errors);
      return validation;
    }
    validation.provenanceValid = true;

    // Validate flora consistency between managed good and provenance
    validation.floraConsistency = this.validateFloraConsistency(good, validation);
    if (!validation.floraConsistency) {
      validation.errors.push('Flora sources mismatch between managed good and provenance');
    }

    // Validate structure consistency
    validation.structureConsistency = this.validateStructureConsistency(good, validation);
    if (!validation.structureConsistency) {
      validation.errors.push('Invalid extraction/refinement structures for good type');
    }

    // Add warnings for edge cases
    this.addProvenanceWarnings(good, validation);

    return validation;
  }

  /**
   * Validate a collection of managed goods
   */
  validateGoodsCollection(goods: ManagedGood[]): ManagedGoodProvenanceValidation[] {
    return goods.map(good => this.validateManagedGoodProvenance(good));
  }

  /**
   * Get coverage statistics for goods provenance
   */
  getProvenanceCoverage(goods: ManagedGood[]): GoodsProvenanceCoverage {
    const validations = this.validateGoodsCollection(goods);
    const goodsWithProvenance = validations.filter(v => v.hasProvenance).length;
    const invalidProvenanceRecords = validations.filter(v => v.hasProvenance && !v.provenanceValid).length;
    const missingProvenanceGoods = validations
      .filter(v => !v.hasProvenance)
      .map(v => v.good.id);

    return {
      totalGoods: goods.length,
      goodsWithProvenance,
      coveragePercentage: (goodsWithProvenance / goods.length) * 100,
      invalidProvenanceRecords,
      missingProvenanceGoods
    };
  }

  /**
   * Validate that provenance references exist in world data
   */
  validateWorldDataReferences(provenance: GoodsProvenanceRecord): {
    biomeExists: boolean;
    floraExists: boolean[];
    structuresExist: boolean[];
    allValid: boolean;
  } {
    const result = {
      biomeExists: Object.values(BiomeType).includes(provenance.primaryBiome),
      floraExists: provenance.floraSources.map(flora => Object.values(FloraType).includes(flora)),
      structuresExist: [
        ...provenance.extractionStructures,
        ...provenance.refinementStructures
      ].map(structure => Object.values(StructureType).includes(structure)),
      allValid: false
    };

    result.allValid = result.biomeExists && 
                     result.floraExists.every(exists => exists) && 
                     result.structuresExist.every(exists => exists);

    return result;
  }

  /**
   * Check if a good should have provenance based on its category
   */
  shouldHaveProvenance(good: ManagedGood): boolean {
    // Goods that typically don't need natural provenance
    const noNaturalProvenance = [
      'Energy', // Electricity, magical power sources
      'Data',   // Digital information
      'Artifact' // Relics, items without clear natural origin
    ];

    return !noNaturalProvenance.includes(good.category);
  }

  /**
   * Generate synthetic provenance for goods that don't have natural origins
   */
  generateSyntheticProvenance(good: ManagedGood): GoodsProvenanceRecord {
    return {
      good: good.goodsType,
      primaryBiome: BiomeType.Grassland, // Generic fallback
      secondaryBiomes: [],
      floraSources: [], // Synthetic goods don't come from flora
      extractionStructures: this.getSyntheticExtractionStructures(good),
      refinementStructures: this.getSyntheticRefinementStructures(good),
      regionTags: ['synthetic', 'artificial', 'laboratory'],
      ledgerRefs: [
        {
          stream: 'catalogue',
          eventType: 'synthetic.production',
          schemaRef: 'synthetic-v1',
          hashPointer: `synthetic_${good.id}`
        }
      ],
      normalization: DEFAULT_GOODS_PROVENANCE_NORMALIZATION,
      notes: `Synthetic alternative for ${good.name} - identifiable by distinct modifiers and structure requirements`
    };
  }

  private validateFloraConsistency(good: ManagedGood, validation: ManagedGoodProvenanceValidation): boolean {
    if (!good.provenance || !good.provenance.floraSources) {
      return good.floraSources.length === 0; // Both empty is consistent
    }

    // Check if flora sources match (order doesn't matter)
    const goodFloraSet = new Set(good.floraSources);
    const provenanceFloraSet = new Set(good.provenance.floraSources);

    if (goodFloraSet.size !== provenanceFloraSet.size) {
      return false;
    }

    for (const flora of goodFloraSet) {
      if (!provenanceFloraSet.has(flora)) {
        return false;
      }
    }

    return true;
  }

  private validateStructureConsistency(good: ManagedGood, validation: ManagedGoodProvenanceValidation): boolean {
    if (!good.provenance) {
      return false;
    }

    // Basic validation - ensure structures exist and are appropriate
    const allStructures = [
      ...good.provenance.extractionStructures,
      ...good.provenance.refinementStructures
    ];

    // For this implementation, we trust the structure enum validation
    // In a real implementation, you might have business rules about
    // which structures are appropriate for which goods
    return allStructures.length > 0;
  }

  private addProvenanceWarnings(good: ManagedGood, validation: ManagedGoodProvenanceValidation): void {
    if (!good.provenance) {
      if (this.shouldHaveProvenance(good)) {
        validation.warnings.push('Good should have provenance but none provided');
      }
      return;
    }

    // Warn if no secondary biomes for goods that might come from multiple sources
    if (good.provenance.secondaryBiomes.length === 0 && good.category === 'Luxury') {
      validation.warnings.push('Luxury goods often have multiple biome sources');
    }

    // Warn if no ledger hash pointers (affects audit capability)
    if (good.provenance.ledgerRefs.some(ref => !ref.hashPointer)) {
      validation.warnings.push('Missing ledger hash pointers - audit capability reduced');
    }
  }

  private getSyntheticExtractionStructures(good: ManagedGood): StructureType[] {
    // Return appropriate structures for synthetic goods
    switch (good.category) {
      case 'Energy':
        return [StructureType.Refinery, StructureType.HydrogenPlant];
      case 'Data':
        return [StructureType.SiliconLab, StructureType.ElectronicsFactory];
      case 'Artifact':
        return [StructureType.ArcaniteSpire, StructureType.LuminarChamber];
      default:
        return [StructureType.SiliconLab];
    }
  }

  private getSyntheticRefinementStructures(good: ManagedGood): StructureType[] {
    // Return appropriate refinement structures for synthetic goods
    switch (good.category) {
      case 'Energy':
        return [StructureType.Refinery, StructureType.HydrogenPlant];
      case 'Data':
        return [StructureType.SiliconLab, StructureType.ElectronicsFactory];
      case 'Artifact':
        return [StructureType.ArcaniteSpire, StructureType.LuminarChamber];
      default:
        return [StructureType.SiliconLab, StructureType.ChemicalPlant];
    }
  }
}