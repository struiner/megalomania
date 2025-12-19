/**
 * GOODS PROVENANCE INTEGRATION EXAMPLES
 * 
 * Comprehensive examples demonstrating how to integrate and use the goods provenance
 * system with SDK tools, import/export flows, and validation processes.
 */

import { Injectable } from '@angular/core';
import { 
  MANAGED_GOODS_FIXTURES, 
  ManagedGood, 
  ManagedGoodUtils 
} from '../models/managed-goods.model';
import { 
  GoodsProvenanceValidationService, 
  ManagedGoodProvenanceValidation,
  GoodsProvenanceCoverage 
} from './goods-provenance-validation.service';
import { 
  GoodsProvenanceLookupService, 
  ProvenanceLookupResult,
  ProvenanceSearchCriteria 
} from './goods-provenance-lookup.service';
import { GoodsType } from '../enums/GoodsType';
import { FloraType } from '../enums/FloraType';
import { BiomeType } from '../enums/BiomeType';
import { StructureType } from '../enums/StructureType';

@Injectable({
  providedIn: 'root'
})
export class GoodsProvenanceIntegrationExamples {

  constructor(
    private validationService: GoodsProvenanceValidationService,
    private lookupService: GoodsProvenanceLookupService
  ) {
    this.initializeExamples();
  }

  /**
   * Initialize the lookup service with fixture data
   */
  private initializeExamples(): void {
    this.lookupService.initializeIndex(MANAGED_GOODS_FIXTURES);
  }

  /**
   * Example 1: Basic provenance validation workflow
   */
  demonstrateBasicValidation(): void {
    console.log('=== BASIC PROVENANCE VALIDATION ===');
    
    const goods = MANAGED_GOODS_FIXTURES;
    
    // Validate entire collection
    const validations = this.validationService.validateGoodsCollection(goods);
    
    console.log('Validation Results:');
    validations.forEach(validation => {
      console.log(`- ${validation.good.name}:`);
      console.log(`  Has provenance: ${validation.hasProvenance}`);
      console.log(`  Valid structure: ${validation.provenanceValid}`);
      console.log(`  Flora consistent: ${validation.floraConsistency}`);
      console.log(`  Structure consistent: ${validation.structureConsistency}`);
      
      if (validation.errors.length > 0) {
        console.log(`  Errors: ${validation.errors.join(', ')}`);
      }
      
      if (validation.warnings.length > 0) {
        console.log(`  Warnings: ${validation.warnings.join(', ')}`);
      }
    });

    // Get coverage statistics
    const coverage = this.validationService.getProvenanceCoverage(goods);
    console.log('Coverage Statistics:');
    console.log(`- Total goods: ${coverage.totalGoods}`);
    console.log(`- Goods with provenance: ${coverage.goodsWithProvenance}`);
    console.log(`- Coverage percentage: ${coverage.coveragePercentage.toFixed(1)}%`);
    console.log(`- Invalid records: ${coverage.invalidProvenanceRecords}`);
    
    if (coverage.missingProvenanceGoods.length > 0) {
      console.log(`- Missing provenance: ${coverage.missingProvenanceGoods.join(', ')}`);
    }
  }

  /**
   * Example 2: Provenance lookup and search
   */
  demonstrateProvenanceLookup(): void {
    console.log('=== PROVENANCE LOOKUP EXAMPLES ===');

    // Lookup by good type
    console.log('1. Lookup by GoodsType:');
    const woodResult = this.lookupService.getProvenanceByGoodType(GoodsType.Wood);
    console.log(`Found: ${woodResult.found}`);
    if (woodResult.provenance) {
      console.log(`- Primary biome: ${woodResult.provenance.primaryBiome}`);
      console.log(`- Flora sources: ${woodResult.provenance.floraSources.join(', ')}`);
      console.log(`- Extraction structures: ${woodResult.provenance.extractionStructures.join(', ')}`);
    }

    // Search by biome
    console.log('\\n2. Search by biome (Forest):');
    const forestGoods = this.lookupService.getProvenanceByBiome(BiomeType.Forest);
    forestGoods.forEach(provenance => {
      console.log(`- ${provenance.good}: ${provenance.primaryBiome}`);
    });

    // Search by flora source
    console.log('\\n3. Search by flora source (CoffeePlant):');
    const coffeeGoods = this.lookupService.getProvenanceByFlora(FloraType.CoffeePlant);
    coffeeGoods.forEach(provenance => {
      console.log(`- ${provenance.good}: ${provenance.primaryBiome}`);
    });

    // Complex search criteria
    console.log('\\n4. Complex search (extraction structure):');
    const searchCriteria: ProvenanceSearchCriteria = {
      extractionStructure: StructureType.Lumberyard
    };
    const searchResults = this.lookupService.searchProvenance(searchCriteria);
    searchResults.forEach(provenance => {
      console.log(`- ${provenance.good}: ${provenance.extractionStructures.join(', ')}`);
    });

    // Get provenance summary
    console.log('\\n5. Provenance summary:');
    const summary = this.lookupService.getProvenanceSummary();
    console.log(`- Total goods: ${summary.totalGoods}`);
    console.log(`- With provenance: ${summary.goodsWithProvenance}`);
    console.log('- Coverage by category:');
    summary.coverageByCategory.forEach((percentage, category) => {
      console.log(`  ${category}: ${percentage.toFixed(1)}%`);
    });
  }

  /**
   * Example 3: Handling synthetic goods
   */
  demonstrateSyntheticGoodsHandling(): void {
    console.log('=== SYNTHETIC GOODS HANDLING ===');

    // Create a synthetic good (electronics)
    const syntheticElectronics: ManagedGood = {
      id: "electronics_material_3_uncommon_3",
      goodsType: GoodsType.Electronics,
      category: 'Data' as any, // Using 'as any' to demonstrate synthetic case
      floraSources: [],
      name: "Electronic Components",
      description: "Synthetic electronic components manufactured in labs.",
      tier: 3 as any,
      rarity: 'Common' as any,
      complexity: 3 as any,
      basePrice: 25,
      priceUnit: 'Weight' as any,
      storageType: 'Hazardous' as any,
      tags: ["electronic", "synthetic", "technology"],
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1
      // No provenance - will be generated
    };

    console.log('1. Validating synthetic good without provenance:');
    const syntheticValidation = this.validationService.validateManagedGoodProvenance(syntheticElectronics);
    console.log(`Has provenance: ${syntheticValidation.hasProvenance}`);
    console.log(`Should have provenance: ${this.validationService.shouldHaveProvenance(syntheticElectronics)}`);

    // Generate synthetic provenance
    console.log('\\n2. Generating synthetic provenance:');
    const syntheticProvenance = this.validationService.generateSyntheticProvenance(syntheticElectronics);
    console.log(`Generated primary biome: ${syntheticProvenance.primaryBiome}`);
    console.log(`Extraction structures: ${syntheticProvenance.extractionStructures.join(', ')}`);
    console.log(`Region tags: ${syntheticProvenance.regionTags.join(', ')}`);
    console.log(`Notes: ${syntheticProvenance.notes}`);

    // Apply synthetic provenance and validate
    const goodWithSyntheticProvenance = {
      ...syntheticElectronics,
      provenance: syntheticProvenance
    };

    console.log('\\n3. Validating good with synthetic provenance:');
    const reValidation = this.validationService.validateManagedGoodProvenance(goodWithSyntheticProvenance);
    console.log(`Has provenance: ${reValidation.hasProvenance}`);
    console.log(`Valid structure: ${reValidation.provenanceValid}`);
  }

  /**
   * Example 4: Import/Export workflow
   */
  demonstrateImportExportWorkflow(): void {
    console.log('=== IMPORT/EXPORT WORKFLOW ===');

    // Export provenance data
    console.log('1. Exporting provenance data:');
    const exportData = this.lookupService.exportProvenanceData();
    console.log(`Version: ${exportData.version}`);
    console.log(`Timestamp: ${exportData.timestamp}`);
    console.log(`Records count: ${exportData.provenanceRecords.length}`);
    console.log(`Normalization rules: ${JSON.stringify(exportData.normalizationRules, null, 2)}`);

    // Demonstrate serialization consistency
    console.log('\\n2. Demonstrating serialization consistency:');
    const goods = MANAGED_GOODS_FIXTURES;
    goods.forEach(good => {
      if (good.provenance) {
        // Simulate serialization/deserialization cycle
        const serialized = JSON.stringify(good.provenance);
        const deserialized = JSON.parse(serialized);
        
        console.log(`${good.name}:`);
        console.log(`- Flora sources count: ${deserialized.floraSources.length}`);
        console.log(`- Ledger refs count: ${deserialized.ledgerRefs.length}`);
        console.log(`- Region tags: ${deserialized.regionTags.join(', ')}`);
      }
    });
  }

  /**
   * Example 5: SDK Integration patterns
   */
  demonstrateSDKIntegrationPatterns(): void {
    console.log('=== SDK INTEGRATION PATTERNS ===');

    // Pattern 1: Real-time validation during goods editing
    console.log('1. Real-time validation pattern:');
    const testGood = MANAGED_GOODS_FIXTURES[0]; // Wood good
    console.log(`Testing good: ${testGood.name}`);
    
    const validation = this.validationService.validateManagedGoodProvenance(testGood);
    
    // Simulate SDK tool providing user feedback
    if (validation.errors.length > 0) {
      console.log('SDK should show error indicators for:');
      validation.errors.forEach(error => console.log(`  - ${error}`));
    }
    
    if (validation.warnings.length > 0) {
      console.log('SDK should show warning indicators for:');
      validation.warnings.forEach(warning => console.log(`  - ${warning}`));
    }

    // Pattern 2: Provenance-aware filtering
    console.log('\\n2. Provenance-aware filtering:');
    const allGoods = MANAGED_GOODS_FIXTURES;
    
    // Filter goods by biome availability
    const forestCompatible = allGoods.filter(good => {
      if (!good.provenance) return false;
      return good.provenance.primaryBiome === BiomeType.Forest || 
             good.provenance.secondaryBiomes.includes(BiomeType.Forest);
    });
    
    console.log(`Goods compatible with Forest biome: ${forestCompatible.length}`);
    forestCompatible.forEach(good => console.log(`  - ${good.name}`));

    // Pattern 3: Structure requirement validation
    console.log('\\n3. Structure requirement validation:');
    const lumberyardDependent = allGoods.filter(good => {
      if (!good.provenance) return false;
      return good.provenance.extractionStructures.includes(StructureType.Lumberyard);
    });
    
    console.log(`Goods requiring Lumberyard: ${lumberyardDependent.length}`);
    lumberyardDependent.forEach(good => console.log(`  - ${good.name}`));
  }

  /**
   * Example 6: Comprehensive validation report
   */
  generateComprehensiveValidationReport(): void {
    console.log('=== COMPREHENSIVE VALIDATION REPORT ===');

    const goods = MANAGED_GOODS_FIXTURES;
    
    // Run all validations
    const validations = this.validationService.validateGoodsCollection(goods);
    const coverage = this.validationService.getProvenanceCoverage(goods);
    const lookupSummary = this.lookupService.getProvenanceSummary();

    // Report structure
    console.log('GOODS PROVENANCE VALIDATION REPORT');
    console.log('====================================');
    console.log(`Generated: ${new Date().toISOString()}`);
    console.log('');

    // Coverage summary
    console.log('COVERAGE SUMMARY:');
    console.log(`- Total goods analyzed: ${coverage.totalGoods}`);
    console.log(`- Goods with provenance: ${coverage.goodsWithProvenance}`);
    console.log(`- Coverage rate: ${coverage.coveragePercentage.toFixed(1)}%`);
    console.log(`- Invalid provenance records: ${coverage.invalidProvenanceRecords}`);
    console.log('');

    // Detailed findings
    console.log('DETAILED FINDINGS:');
    validations.forEach((validation, index) => {
      console.log(`${index + 1}. ${validation.good.name} (${validation.good.id})`);
      console.log(`   Status: ${validation.provenanceValid ? 'VALID' : 'INVALID'}`);
      
      if (validation.errors.length > 0) {
        console.log(`   Errors: ${validation.errors.join('; ')}`);
      }
      
      if (validation.warnings.length > 0) {
        console.log(`   Warnings: ${validation.warnings.join('; ')}`);
      }
      
      if (validation.provenanceValid && validation.good.provenance) {
        const prov = validation.good.provenance;
        console.log(`   Biome: ${prov.primaryBiome}`);
        console.log(`   Flora: ${prov.floraSources.length} sources`);
        console.log(`   Structures: ${prov.extractionStructures.length} extraction, ${prov.refinementStructures.length} refinement`);
        console.log(`   Ledger refs: ${prov.ledgerRefs.length} entries`);
      }
      console.log('');
    });

    // Recommendations
    console.log('RECOMMENDATIONS:');
    if (coverage.coveragePercentage < 100) {
      console.log('- Add provenance records for goods missing them');
    }
    
    const invalidRecords = validations.filter(v => v.hasProvenance && !v.provenanceValid);
    if (invalidRecords.length > 0) {
      console.log('- Fix invalid provenance record structures');
    }
    
    const goodsWithoutFloraConsistency = validations.filter(v => !v.floraConsistency);
    if (goodsWithoutFloraConsistency.length > 0) {
      console.log('- Align flora sources between managed goods and provenance records');
    }

    console.log('- Implement automated validation in import/export pipelines');
    console.log('- Add provenance validation to SDK tools');
  }
}