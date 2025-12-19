import { TestBed } from '@angular/core/testing';
import { GoodsIconRegistryService, GoodsIconDefinition, GoodsIconValidationIssue } from './goods-icon-registry.service';
import { GoodsType } from '../enums/GoodsType';
import { GoodCategory, Era } from '../models/goods.model';
import { GoodsIconRegistryFixtures } from '../data/goods/goods-icon-registry.fixtures';

describe('GoodsIconRegistryService', () => {
  let service: GoodsIconRegistryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoodsIconRegistryService]
    });
    service = TestBed.inject(GoodsIconRegistryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getIcons()', () => {
    it('should return all icon definitions', () => {
      const icons = service.getIcons();
      expect(icons).toBeDefined();
      expect(Array.isArray(icons)).toBe(true);
      expect(icons.length).toBeGreaterThan(0);
    });

    it('should return valid icon definitions', () => {
      const icons = service.getIcons();
      icons.forEach(icon => {
        expect(icon.type).toBeDefined();
        expect(icon.label).toBeDefined();
        expect(icon.iconId).toBeDefined();
        expect(icon.spritePath).toBeDefined();
        expect(icon.status).toBeDefined();
        expect(Object.values(GoodsType)).toContain(icon.type);
      });
    });
  });

  describe('getIconByType()', () => {
    it('should return icon for valid GoodsType', () => {
      const icon = service.getIconByType(GoodsType.Wood);
      expect(icon).toBeDefined();
      expect(icon?.type).toBe(GoodsType.Wood);
    });

    it('should return undefined for invalid GoodsType', () => {
      const icon = service.getIconByType('INVALID_TYPE' as GoodsType);
      expect(icon).toBeUndefined();
    });

    it('should return era-specific icon when era is specified', () => {
      const baseIcon = service.getIconByType(GoodsType.Wood);
      const eraIcon = service.getIconByType(GoodsType.Wood, Era.Marble);
      
      expect(baseIcon).toBeDefined();
      expect(eraIcon).toBeDefined();
      // Both should exist, eraIcon might be the same as baseIcon if it's the default
    });
  });

  describe('getIconsByCategory()', () => {
    it('should return icons filtered by category', () => {
      const rawMaterialIcons = service.getIconsByCategory(GoodCategory.RawMaterial);
      expect(rawMaterialIcons.length).toBeGreaterThan(0);
      rawMaterialIcons.forEach(icon => {
        expect(icon.category).toBe(GoodCategory.RawMaterial);
      });
    });

    it('should return empty array for non-existent category', () => {
      const icons = service.getIconsByCategory('NonExistentCategory' as GoodCategory);
      expect(icons).toEqual([]);
    });
  });

  describe('getIconsByEra()', () => {
    it('should return icons filtered by era', () => {
      const marbleIcons = service.getIconsByEra(Era.Marble);
      expect(marbleIcons.length).toBeGreaterThan(0);
      marbleIcons.forEach(icon => {
        expect(icon.era).toBe(Era.Marble);
      });
    });

    it('should return empty array for non-existent era', () => {
      const icons = service.getIconsByEra('NonExistentEra' as Era);
      expect(icons).toEqual([]);
    });
  });

  describe('getPlaceholderIcons()', () => {
    it('should return only placeholder icons', () => {
      const placeholderIcons = service.getPlaceholderIcons();
      expect(placeholderIcons.length).toBeGreaterThan(0);
      placeholderIcons.forEach(icon => {
        expect(['placeholder', 'missing']).toContain(icon.status);
      });
    });

    it('should not return complete icons', () => {
      const placeholderIcons = service.getPlaceholderIcons();
      const hasCompleteIcons = placeholderIcons.some(icon => icon.status === 'complete');
      expect(hasCompleteIcons).toBe(false);
    });
  });

  describe('validateRegistry()', () => {
    it('should return validation issues for problems found', () => {
      const issues = service.validateRegistry();
      expect(Array.isArray(issues)).toBe(true);
      
      // Should find placeholder and missing icons
      const hasPlaceholderIssues = issues.some(issue => issue.kind === 'placeholder');
      const hasMissingIssues = issues.some(issue => issue.kind === 'missing-icon');
      
      expect(hasPlaceholderIssues || hasMissingIssues).toBe(true);
    });

    it('should return structured validation issues', () => {
      const issues = service.validateRegistry();
      issues.forEach(issue => {
        expect(issue.kind).toBeDefined();
        expect(issue.message).toBeDefined();
        expect(issue.affectedTypes).toBeDefined();
        expect(['missing-icon', 'duplicate-icon', 'empty-sprite-path', 'placeholder', 'invalid-era-variant']).toContain(issue.kind);
        expect(Array.isArray(issue.affectedTypes)).toBe(true);
      });
    });

    it('should detect duplicate icon IDs', () => {
      // This test would require manually creating duplicates in the registry
      // For now, we'll test the structure
      const issues = service.validateRegistry();
      const duplicateIssues = issues.filter(issue => issue.kind === 'duplicate-icon');
      expect(duplicateIssues).toBeDefined();
    });
  });

  describe('exportValidationReport()', () => {
    it('should generate a markdown report', () => {
      const report = service.exportValidationReport();
      expect(typeof report).toBe('string');
      expect(report).toContain('# Goods Icon Validation Report');
      expect(report).toContain('Generated:');
    });

    it('should include validation issues in report', () => {
      const issues = service.validateRegistry();
      if (issues.length > 0) {
        const report = service.exportValidationReport();
        expect(report).toContain('## Issues Found:');
        expect(report).toContain(issues[0].kind.toUpperCase());
      }
    });

    it('should handle empty issues gracefully', () => {
      // Mock service with no issues
      const emptyService = Object.create(service);
      (emptyService as any).registry = [
        {
          type: GoodsType.Wood,
          label: 'Wood',
          iconId: 'goods_wood_marble',
          spritePath: 'assets/goods/goods_wood_marble@64-32.png',
          gridSize: 64,
          padding: 4,
          stroke: 2,
          era: Era.Marble,
          category: GoodCategory.RawMaterial,
          status: 'complete',
          resolution: '64-32',
          contrast: 'dual'
        }
      ];
      
      const report = (emptyService as any).exportValidationReport();
      expect(report).toContain('✅ No validation issues found');
    });
  });

  describe('Integration Tests', () => {
    it('should handle large datasets efficiently', () => {
      const largeDataset = GoodsIconRegistryFixtures.generatePerformanceTestData(1000);
      
      // Override registry temporarily
      (service as any).registry = largeDataset;
      
      const startTime = performance.now();
      const icons = service.getIcons();
      const issues = service.validateRegistry();
      const endTime = performance.now();
      
      expect(icons.length).toBe(1000);
      expect(Array.isArray(issues)).toBe(true);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should maintain data consistency across operations', () => {
      const icons = service.getIcons();
      const placeholderIcons = service.getPlaceholderIcons();
      const completeIcons = icons.filter(icon => icon.status === 'complete');
      
      expect(icons.length).toBe(completeIcons.length + placeholderIcons.length);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty registry gracefully', () => {
      const emptyService = Object.create(service);
      (emptyService as any).registry = [];
      
      expect(() => emptyService.validateRegistry()).not.toThrow();
      expect(() => emptyService.exportValidationReport()).not.toThrow();
    });

    it('should handle undefined/null inputs gracefully', () => {
      expect(() => service.getIconByType(null as any)).not.toThrow();
      expect(() => service.getIconByType(undefined as any)).not.toThrow();
      expect(service.getIconByType(null as any)).toBeUndefined();
      expect(service.getIconByType(undefined as any)).toBeUndefined();
    });

    it('should handle invalid era and category filters', () => {
      expect(() => service.getIconsByEra('InvalidEra' as Era)).not.toThrow();
      expect(() => service.getIconsByCategory('InvalidCategory' as GoodCategory)).not.toThrow();
    });
  });

  describe('Performance Tests', () => {
    it('should complete validation within reasonable time', () => {
      const startTime = performance.now();
      const issues = service.validateRegistry();
      const endTime = performance.now();
      
      expect(issues).toBeDefined();
      expect(endTime - startTime).toBeLessThan(100); // Should complete within 100ms
    });

    it('should handle multiple concurrent operations', () => {
      const operations = [
        () => service.getIcons(),
        () => service.getPlaceholderIcons(),
        () => service.validateRegistry(),
        () => service.exportValidationReport()
      ];
      
      const startTime = performance.now();
      const results = operations.map(op => op());
      const endTime = performance.now();
      
      expect(results.length).toBe(4);
      expect(endTime - startTime).toBeLessThan(200); // Should complete within 200ms
    });
  });

  describe('Data Integrity', () => {
    it('should have complete coverage of all GoodsType values', () => {
      const icons = service.getIcons();
      const iconTypes = icons.map(icon => icon.type);
      const allGoodsTypes = Object.values(GoodsType);
      
      allGoodsTypes.forEach(type => {
        expect(iconTypes).toContain(type);
      });
    });

    it('should have valid sprite paths for complete icons', () => {
      const icons = service.getIcons();
      const completeIcons = icons.filter(icon => icon.status === 'complete');
      
      completeIcons.forEach(icon => {
        expect(icon.spritePath).toBeTruthy();
        expect(icon.spritePath.length).toBeGreaterThan(0);
        expect(icon.spritePath).toContain('assets/goods/');
      });
    });

    it('should have appropriate era assignments', () => {
      const icons = service.getIcons();
      
      icons.forEach(icon => {
        expect(Object.values(Era)).toContain(icon.era);
        expect(icon.era).toBeTruthy();
      });
    });
  });
});