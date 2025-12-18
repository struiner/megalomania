import { TestBed } from '@angular/core/testing';
import { GoodsCatalogIoService, GoodsCatalogResult, ManagedGood } from './goods-catalog-io.service';
import { 
  VALID_GOODS_CATALOG_FIXTURES, 
  INVALID_GOODS_CATALOG_FIXTURES, 
  SAMPLE_IMPORT_PAYLOADS 
} from '../data/goods/goods-catalog-fixtures';

describe('GoodsCatalogIoService', () => {
  let service: GoodsCatalogIoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoodsCatalogIoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('importCatalog', () => {
    it('should import valid catalog successfully', () => {
      const result = service.importCatalog(SAMPLE_IMPORT_PAYLOADS.validArray);
      
      expect(result.success).toBe(true);
      expect(result.goods.length).toBe(VALID_GOODS_CATALOG_FIXTURES.length);
      expect(result.issues.length).toBe(0);
      
      // Verify deterministic ordering
      for (let i = 0; i < result.goods.length - 1; i++) {
        expect(result.goods[i].type.localeCompare(result.goods[i + 1].type)).toBeLessThanOrEqual(0);
      }
    });

    it('should import valid object format with metadata', () => {
      const result = service.importCatalog(SAMPLE_IMPORT_PAYLOADS.validObject);
      
      expect(result.success).toBe(true);
      expect(result.goods.length).toBe(VALID_GOODS_CATALOG_FIXTURES.length);
      expect(result.version).toBe('1.0.0');
      expect(result.metadata).toBeDefined();
    });

    it('should handle invalid JSON gracefully', () => {
      const result = service.importCatalog(SAMPLE_IMPORT_PAYLOADS.invalidJson);
      
      expect(result.success).toBe(false);
      expect(result.goods.length).toBe(0);
      expect(result.issues.length).toBeGreaterThan(0);
      expect(result.issues[0].code).toBe('PARSE_ERROR');
    });

    it('should handle empty array', () => {
      const result = service.importCatalog(SAMPLE_IMPORT_PAYLOADS.emptyArray);
      
      expect(result.success).toBe(true);
      expect(result.goods.length).toBe(0);
      expect(result.issues.length).toBe(0);
    });

    it('should handle wrong structure gracefully', () => {
      const result = service.importCatalog(SAMPLE_IMPORT_PAYLOADS.wrongStructure);
      
      expect(result.success).toBe(false);
      expect(result.goods.length).toBe(0);
      expect(result.issues.length).toBeGreaterThan(0);
    });

    it('should validate required fields', () => {
      const invalidPayload = JSON.stringify([INVALID_GOODS_CATALOG_FIXTURES[0]]);
      const result = service.importCatalog(invalidPayload);
      
      expect(result.success).toBe(false);
      expect(result.issues.some(issue => issue.code === 'MISSING_FIELD')).toBe(true);
    });

    it('should validate enum values', () => {
      const invalidPayload = JSON.stringify([INVALID_GOODS_CATALOG_FIXTURES[1]]);
      const result = service.importCatalog(invalidPayload);
      
      expect(result.success).toBe(false);
      expect(result.issues.some(issue => issue.code === 'INVALID_ENUM_VALUE')).toBe(true);
    });

    it('should validate numeric bounds', () => {
      const invalidPayload = JSON.stringify([INVALID_GOODS_CATALOG_FIXTURES[2]]);
      const result = service.importCatalog(invalidPayload);
      
      expect(result.success).toBe(false);
      expect(result.issues.some(issue => issue.code === 'OUT_OF_BOUNDS')).toBe(true);
    });

    it('should validate string lengths', () => {
      const invalidPayload = JSON.stringify([INVALID_GOODS_CATALOG_FIXTURES[3]]);
      const result = service.importCatalog(invalidPayload);
      
      expect(result.success).toBe(false);
      expect(result.issues.some(issue => issue.code === 'TOO_SHORT' || issue.code === 'TOO_LONG')).toBe(true);
    });

    it('should validate array item types', () => {
      const invalidPayload = JSON.stringify([INVALID_GOODS_CATALOG_FIXTURES[4]]);
      const result = service.importCatalog(invalidPayload);
      
      expect(result.success).toBe(false);
      expect(result.issues.some(issue => issue.code === 'INVALID_ARRAY_ITEM_TYPE' || issue.code === 'INVALID_FLORA_TYPE')).toBe(true);
    });

    it('should validate component structures', () => {
      const invalidPayload = JSON.stringify([INVALID_GOODS_CATALOG_FIXTURES[5]]);
      const result = service.importCatalog(invalidPayload);
      
      expect(result.success).toBe(false);
      expect(result.issues.some(issue => 
        issue.code === 'INVALID_COMPONENT_TYPE' || 
        issue.code === 'MISSING_FIELD' || 
        issue.code === 'INVALID_COMPONENT_AMOUNT'
      )).toBe(true);
    });

    it('should handle mixed valid/invalid items', () => {
      const result = service.importCatalog(SAMPLE_IMPORT_PAYLOADS.mixedValidity);
      
      expect(result.success).toBe(false);
      expect(result.goods.length).toBeGreaterThan(0); // Some valid items should be processed
      expect(result.issues.length).toBeGreaterThan(0); // But with validation issues
    });
  });

  describe('exportCatalog', () => {
    it('should export goods deterministically', () => {
      const export1 = service.exportCatalog(VALID_GOODS_CATALOG_FIXTURES, { prettyPrint: false });
      const export2 = service.exportCatalog(VALID_GOODS_CATALOG_FIXTURES, { prettyPrint: false });
      
      expect(export1).toBe(export2); // Should be identical for same input
    });

    it('should include metadata by default', () => {
      const exportData = service.exportCatalog(VALID_GOODS_CATALOG_FIXTURES);
      const parsed = JSON.parse(exportData);
      
      expect(parsed.version).toBeDefined();
      expect(parsed.exportedAt).toBeDefined();
      expect(parsed.metadata).toBeDefined();
      expect(parsed.metadata.totalItems).toBe(VALID_GOODS_CATALOG_FIXTURES.length);
    });

    it('can exclude metadata', () => {
      const exportData = service.exportCatalog(VALID_GOODS_CATALOG_FIXTURES, { includeMetadata: false });
      const parsed = JSON.parse(exportData);
      
      expect(parsed.metadata).toBeUndefined();
      expect(parsed.goods).toBeDefined();
    });

    it('should support custom version', () => {
      const exportData = service.exportCatalog(VALID_GOODS_CATALOG_FIXTURES, { version: '2.0.0' });
      const parsed = JSON.parse(exportData);
      
      expect(parsed.version).toBe('2.0.0');
    });

    it('should sort goods deterministically', () => {
      // Create unsorted array
      const unsorted = [...VALID_GOODS_CATALOG_FIXTURES].reverse();
      const exportData = service.exportCatalog(unsorted);
      const parsed = JSON.parse(exportData);
      
      // Verify goods are sorted by type
      for (let i = 0; i < parsed.goods.length - 1; i++) {
        expect(parsed.goods[i].type.localeCompare(parsed.goods[i + 1].type)).toBeLessThanOrEqual(0);
      }
    });

    it('should pretty print by default', () => {
      const prettyExport = service.exportCatalog(VALID_GOODS_CATALOG_FIXTURES, { prettyPrint: true });
      const compactExport = service.exportCatalog(VALID_GOODS_CATALOG_FIXTURES, { prettyPrint: false });
      
      expect(prettyExport.includes('\\n')).toBe(true);
      expect(compactExport.includes('\\n')).toBe(false);
      expect(prettyExport.length).toBeGreaterThan(compactExport.length);
    });

    it('should handle empty goods array', () => {
      const exportData = service.exportCatalog([]);
      const parsed = JSON.parse(exportData);
      
      expect(parsed.goods).toEqual([]);
      expect(parsed.metadata.totalItems).toBe(0);
      expect(parsed.metadata.categories).toEqual([]);
    });
  });

  describe('round-trip validation', () => {
    it('should maintain data integrity through import/export cycle', () => {
      // Import valid fixtures
      const importResult = service.importCatalog(SAMPLE_IMPORT_PAYLOADS.validArray);
      expect(importResult.success).toBe(true);
      
      // Export the imported data
      const exportData = service.exportCatalog(importResult.goods);
      
      // Re-import the exported data
      const reimportResult = service.importCatalog(exportData);
      expect(reimportResult.success).toBe(true);
      
      // Should have same goods count
      expect(reimportResult.goods.length).toBe(importResult.goods.length);
      
      // Verify key properties are preserved
      reimportResult.goods.forEach((good, index) => {
        const original = importResult.goods[index];
        expect(good.type).toBe(original.type);
        expect(good.name).toBe(original.name);
        expect(good.category).toBe(original.category);
        expect(good.basePrice).toBe(original.basePrice);
      });
    });

    it('should normalize data during round-trip', () => {
      // Test with mixed case and formatting
      const mixedCasePayload = JSON.stringify([
        {
          type: "Wood", // Mixed case
          name: "Timber",
          category: "RawMaterial",
          description: "Basic construction material from forest trees.",
          rarity: 1,
          complexity: 1.0, // Number format
          basePrice: "50", // String format
          tags: ["construction", "basic", "renewable"]
        }
      ]);
      
      const importResult = service.importCatalog(mixedCasePayload);
      expect(importResult.success).toBe(true);
      
      const exportData = service.exportCatalog(importResult.goods, { prettyPrint: false });
      const reimportResult = service.importCatalog(exportData);
      expect(reimportResult.success).toBe(true);
      
      // Verify normalization
      const good = reimportResult.goods[0];
      expect(good.type).toBe("wood"); // Should be normalized to lowercase
      expect(good.complexity).toBe(1); // Should be integer
      expect(good.basePrice).toBe(50); // Should be number
    });
  });

  describe('localization support', () => {
    it('should handle unicode characters in names and descriptions', () => {
      const unicodeGoods: ManagedGood[] = [
        {
          type: 'wood' as any,
          name: '木材 (Timber)',
          category: 'RawMaterial',
          description: 'Construction material from forest trees. 建筑材料。',
          tags: ['construction', 'basic', 'renewable'],
          rarity: 1,
          complexity: 1,
          basePrice: 50
        }
      ];
      
      const exportData = service.exportCatalog(unicodeGoods);
      const importResult = service.importCatalog(exportData);
      
      expect(importResult.success).toBe(true);
      expect(importResult.goods[0].name).toBe('木材 (Timber)');
      expect(importResult.goods[0].description).toContain('建筑材料');
    });
  });

  describe('error reporting', () => {
    it('should provide structured error information', () => {
      const invalidPayload = JSON.stringify([INVALID_GOODS_CATALOG_FIXTURES[0]]);
      const result = service.importCatalog(invalidPayload);
      
      expect(result.issues.length).toBeGreaterThan(0);
      
      // Check error structure
      result.issues.forEach(issue => {
        expect(issue.path).toBeDefined();
        expect(issue.message).toBeDefined();
        expect(issue.severity).toBe('error');
        expect(issue.code).toBeDefined();
      });
    });

    it('should include context in error messages', () => {
      const invalidPayload = JSON.stringify([
        {
          type: 'INVALID_TYPE',
          name: 'Test',
          category: 'RawMaterial',
          description: 'Test description',
          rarity: 1,
          complexity: 1,
          basePrice: 50
        }
      ]);
      
      const result = service.importCatalog(invalidPayload);
      const typeError = result.issues.find(issue => issue.code === 'INVALID_ENUM_VALUE');
      
      expect(typeError).toBeDefined();
      expect(typeError!.context).toBeDefined();
      expect(typeError!.context!['value']).toBe('INVALID_TYPE');
    });
  });
});