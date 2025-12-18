import { Injectable } from '@angular/core';
import { GoodsType } from '../enums/GoodsType';
import { FloraType } from '../enums/FloraType';
import { GoodCategory, Rarity, UnitType } from '../models/goods.model';

/**
 * ManagedGood represents a goods entry in the catalog that can be imported/exported.
 * This extends the basic GoodsInfo with additional metadata for catalog management.
 */
export interface ManagedGood {
  type: GoodsType;
  name: string;
  category: GoodCategory | string;
  description: string;
  tags: string[];
  
  // Core properties
  rarity: Rarity | number; // Support both enum and numeric for flexibility
  complexity: number; // 1-5 scale
  basePrice: number;
  
  // Flora/provenance data
  floraSources?: FloraType[];
  
  // Metadata
  tier?: number;
  unitType?: UnitType;
  isSynthetic?: boolean;
  eraOrigin?: string;
  
  // Components/recipe data
  components?: {
    type: GoodsType;
    amount: number;
  }[];
}

/**
 * Import/Export result with validation issues
 */
export interface GoodsCatalogResult {
  success: boolean;
  goods: ManagedGood[];
  issues: GoodsCatalogIssue[];
  version?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Structured error format for SDK consumers
 */
export interface GoodsCatalogIssue {
  path: string;
  message: string;
  severity: 'error' | 'warning';
  code: string;
  context?: Record<string, unknown>;
}

/**
 * Validation rules for goods catalog entries
 */
export interface GoodsCatalogValidationRules {
  requiredFields: string[];
  numericBounds: {
    rarity: [number, number];
    complexity: [number, number];
    basePrice: [number, number];
  };
  enumValidation: {
    categories: string[];
    rarities: string[];
    unitTypes: string[];
  };
}

/**
 * Migration hook for schema evolution
 */
export interface GoodsCatalogMigration {
  fromVersion: string;
  toVersion: string;
  migrate: (data: unknown) => unknown;
}

@Injectable({
  providedIn: 'root'
})
export class GoodsCatalogIoService {
  
  private readonly currentVersion = '1.0.0';
  
  // Validation rules
  private readonly validationRules: GoodsCatalogValidationRules = {
    requiredFields: ['type', 'name', 'category', 'description', 'rarity', 'complexity', 'basePrice'],
    numericBounds: {
      rarity: [1, 5],
      complexity: [1, 5],
      basePrice: [0, 100000]
    },
    enumValidation: {
      categories: Object.values(GoodCategory),
      rarities: Object.values(Rarity),
      unitTypes: Object.values(UnitType)
    }
  };
  
  // Migration hooks for future schema evolution
  private readonly migrations: GoodsCatalogMigration[] = [
    // Future migrations will be added here
  ];
  
  /**
   * Import goods catalog from JSON payload
   */
  importCatalog(jsonPayload: string): GoodsCatalogResult {
    const issues: GoodsCatalogIssue[] = [];
    
    try {
      // Parse JSON with error handling
      const parsed = JSON.parse(jsonPayload);
      
      // Handle migration if needed
      const migratedData = this.applyMigrations(parsed);
      
      // Extract goods array
      let goodsArray: unknown[];
      if (Array.isArray(migratedData)) {
        goodsArray = migratedData;
      } else if (typeof migratedData === 'object' && migratedData !== null && 'goods' in migratedData && Array.isArray((migratedData as any).goods)) {
        goodsArray = (migratedData as any).goods;
      } else {
        return this.createErrorResult('Invalid JSON structure: expected array or object with goods property', issues);
      }
      
      if (issues.length > 0) {
        return this.createErrorResult('Import failed', issues);
      }
      
      // Validate and normalize each good
      const validatedGoods: ManagedGood[] = [];
      
      for (let i = 0; i < goodsArray.length; i++) {
        const good = goodsArray[i];
        const goodIssues = this.validateGood(good, `goods[${i}]`);
        issues.push(...goodIssues);
        
        if (goodIssues.filter(issue => issue.severity === 'error').length === 0) {
          validatedGoods.push(this.normalizeGood(good));
        }
      }
      
      return {
        success: issues.filter(issue => issue.severity === 'error').length === 0,
        goods: validatedGoods,
        issues,
        version: this.extractVersion(migratedData),
        metadata: this.extractMetadata(migratedData)
      };
      
    } catch (error) {
      issues.push({
        path: 'root',
        message: `JSON parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error',
        code: 'PARSE_ERROR'
      });
      
      return this.createErrorResult('Import failed', issues);
    }
  }
  
  /**
   * Export goods catalog to JSON with deterministic ordering
   */
  exportCatalog(goods: ManagedGood[], options?: {
    version?: string;
    includeMetadata?: boolean;
    prettyPrint?: boolean;
  }): string {
    const exportVersion = options?.version ?? this.currentVersion;
    const includeMetadata = options?.includeMetadata ?? true;
    const prettyPrint = options?.prettyPrint ?? true;
    
    // Sort goods deterministically: by type, then by name
    const sortedGoods = [...goods].sort((a, b) => {
      const typeCompare = a.type.localeCompare(b.type);
      if (typeCompare !== 0) return typeCompare;
      return a.name.localeCompare(b.name);
    });
    
    const exportData: Record<string, unknown> = {
      version: exportVersion,
      exportedAt: new Date().toISOString(),
      goods: sortedGoods
    };
    
    if (includeMetadata) {
      (exportData as any).metadata = {
        totalItems: sortedGoods.length,
        categories: [...new Set(sortedGoods.map(g => g.category))].sort(),
        rarityDistribution: this.calculateRarityDistribution(sortedGoods),
        complexityRange: this.calculateComplexityRange(sortedGoods)
      };
    }
    
    const jsonString = prettyPrint 
      ? JSON.stringify(exportData, null, 2)
      : JSON.stringify(exportData);
    
    return jsonString;
  }
  
  /**
   * Validate a single good entry
   */
  private validateGood(good: unknown, path: string): GoodsCatalogIssue[] {
    const issues: GoodsCatalogIssue[] = [];
    
    if (typeof good !== 'object' || good === null) {
      issues.push({
        path,
        message: 'Good entry must be an object',
        severity: 'error',
        code: 'INVALID_TYPE',
        context: { actualType: typeof good }
      });
      return issues;
    }
    
    const goodObj = good as any;
    
    // Check required fields
    for (const field of this.validationRules.requiredFields) {
      if (!(field in goodObj)) {
        issues.push({
          path: `${path}.${field}`,
          message: `Required field '${field}' is missing`,
          severity: 'error',
          code: 'MISSING_FIELD'
        });
      }
    }
    
    // Validate type against GoodsType enum
    if ('type' in goodObj) {
      const typeValue = goodObj['type'];
      if (typeof typeValue !== 'string' || !this.isValidGoodsType(typeValue)) {
        issues.push({
          path: `${path}.type`,
          message: `Invalid GoodsType: '${typeValue}'. Must be a valid GoodsType enum value.`,
          severity: 'error',
          code: 'INVALID_ENUM_VALUE',
          context: { 
            value: typeValue,
            validValues: Object.values(GoodsType).slice(0, 10) // Show first 10 for brevity
          }
        });
      }
    }
    
    // Validate numeric bounds
    this.validateNumericField(goodObj, 'rarity', path, issues);
    this.validateNumericField(goodObj, 'complexity', path, issues);
    this.validateNumericField(goodObj, 'basePrice', path, issues);
    
    // Validate string fields
    this.validateStringField(goodObj, 'name', path, issues, { minLength: 1, maxLength: 100 });
    this.validateStringField(goodObj, 'description', path, issues, { minLength: 1, maxLength: 500 });
    
    // Validate category against allowed values
    if ('category' in goodObj) {
      const categoryValue = goodObj['category'];
      if (!this.isValidCategory(categoryValue)) {
        issues.push({
          path: `${path}.category`,
          message: `Invalid category: '${categoryValue}'. Must be a valid GoodCategory or string.`,
          severity: 'error',
          code: 'INVALID_CATEGORY',
          context: { value: categoryValue }
        });
      }
    }
    
    // Validate arrays
    this.validateStringArrayField(goodObj, 'tags', path, issues, { maxItems: 20, maxItemLength: 50 });
    this.validateFloraArrayField(goodObj, 'floraSources', path, issues);
    this.validateComponentsArrayField(goodObj, 'components', path, issues);
    
    return issues;
  }
  
  /**
   * Normalize good entry for consistent export
   */
  private normalizeGood(good: unknown): ManagedGood {
    const goodObj = good as Record<string, unknown>;
    
    return {
      type: goodObj['type'] as GoodsType,
      name: String(goodObj['name']),
      category: goodObj['category'] as GoodCategory | string,
      description: String(goodObj['description']),
      tags: Array.isArray(goodObj['tags']) ? goodObj['tags'].map(String) : [],
      rarity: this.normalizeRarity(goodObj['rarity']),
      complexity: Number(goodObj['complexity']),
      basePrice: Number(goodObj['basePrice']),
      floraSources: Array.isArray(goodObj['floraSources']) ? goodObj['floraSources'] as FloraType[] : undefined,
      tier: goodObj['tier'] ? Number(goodObj['tier']) : undefined,
      unitType: goodObj['unitType'] ? goodObj['unitType'] as UnitType : undefined,
      isSynthetic: goodObj['isSynthetic'] ? Boolean(goodObj['isSynthetic']) : undefined,
      eraOrigin: goodObj['eraOrigin'] ? String(goodObj['eraOrigin']) : undefined,
      components: Array.isArray(goodObj['components']) ? 
        goodObj['components'].map((comp: any) => ({
          type: comp['type'] as GoodsType,
          amount: Number(comp['amount'])
        })) : undefined
    };
  }
  
  /**
   * Apply migrations based on version
   */
  private applyMigrations(data: unknown): unknown {
    let migratedData = data;
    const dataVersion = this.extractVersion(data) ?? '0.0.0';
    
    for (const migration of this.migrations) {
      if (this.compareVersions(dataVersion, migration.fromVersion) < 0) {
        migratedData = migration.migrate(migratedData);
      }
    }
    
    return migratedData;
  }
  
  // Validation helper methods
  private validateNumericField(good: any, field: string, path: string, issues: GoodsCatalogIssue[]): void {
    if (field in good) {
      const value = good[field];
      const numericValue = Number(value);
      
      if (isNaN(numericValue)) {
        issues.push({
          path: `${path}.${field}`,
          message: `${field} must be a number, got '${value}'`,
          severity: 'error',
          code: 'INVALID_NUMBER',
          context: { value, type: typeof value }
        });
        return;
      }
      
      const bounds = this.validationRules.numericBounds[field as keyof typeof this.validationRules.numericBounds];
      if (bounds && (numericValue < bounds[0] || numericValue > bounds[1])) {
        issues.push({
          path: `${path}.${field}`,
          message: `${field} must be between ${bounds[0]} and ${bounds[1]}, got ${numericValue}`,
          severity: 'error',
          code: 'OUT_OF_BOUNDS',
          context: { value: numericValue, bounds }
        });
      }
    }
  }
  
  private validateStringField(good: any, field: string, path: string, issues: GoodsCatalogIssue[], constraints?: { minLength?: number; maxLength?: number }): void {
    if (field in good) {
      const value = good[field];
      const stringValue = String(value);
      
      if (constraints?.minLength && stringValue.length < constraints.minLength) {
        issues.push({
          path: `${path}.${field}`,
          message: `${field} must be at least ${constraints.minLength} characters, got ${stringValue.length}`,
          severity: 'error',
          code: 'TOO_SHORT',
          context: { value: stringValue, minLength: constraints.minLength }
        });
      }
      
      if (constraints?.maxLength && stringValue.length > constraints.maxLength) {
        issues.push({
          path: `${path}.${field}`,
          message: `${field} must be at most ${constraints.maxLength} characters, got ${stringValue.length}`,
          severity: 'error',
          code: 'TOO_LONG',
          context: { value: stringValue, maxLength: constraints.maxLength }
        });
      }
    }
  }
  
  private validateStringArrayField(good: any, field: string, path: string, issues: GoodsCatalogIssue[], constraints?: { maxItems?: number; maxItemLength?: number }): void {
    if (field in good && Array.isArray(good[field])) {
      const array = good[field] as unknown[];
      
      if (constraints?.maxItems && array.length > constraints.maxItems) {
        issues.push({
          path: `${path}.${field}`,
          message: `${field} can have at most ${constraints.maxItems} items, got ${array.length}`,
          severity: 'error',
          code: 'TOO_MANY_ITEMS',
          context: { itemCount: array.length, maxItems: constraints.maxItems }
        });
      }
      
      for (let i = 0; i < array.length; i++) {
        const item = array[i];
        const itemPath = `${path}.${field}[${i}]`;
        
        if (typeof item !== 'string') {
          issues.push({
            path: itemPath,
            message: `${field}[${i}] must be a string, got ${typeof item}`,
            severity: 'error',
            code: 'INVALID_ARRAY_ITEM_TYPE',
            context: { index: i, actualType: typeof item }
          });
        } else if (constraints?.maxItemLength && item.length > constraints.maxItemLength) {
          issues.push({
            path: itemPath,
            message: `${field}[${i}] must be at most ${constraints.maxItemLength} characters, got ${item.length}`,
            severity: 'error',
            code: 'ARRAY_ITEM_TOO_LONG',
            context: { index: i, item, maxLength: constraints.maxItemLength }
          });
        }
      }
    }
  }
  
  private validateFloraArrayField(good: any, field: string, path: string, issues: GoodsCatalogIssue[]): void {
    if (field in good && Array.isArray(good[field])) {
      const array = good[field] as unknown[];
      
      for (let i = 0; i < array.length; i++) {
        const item = array[i];
        const itemPath = `${path}.${field}[${i}]`;
        
        if (typeof item !== 'string' || !this.isValidFloraType(item)) {
          issues.push({
            path: itemPath,
            message: `${field}[${i}] must be a valid FloraType, got '${item}'`,
            severity: 'error',
            code: 'INVALID_FLORA_TYPE',
            context: { index: i, value: item }
          });
        }
      }
    }
  }
  
  private validateComponentsArrayField(good: any, field: string, path: string, issues: GoodsCatalogIssue[]): void {
    if (field in good && Array.isArray(good[field])) {
      const array = good[field] as unknown[];
      
      for (let i = 0; i < array.length; i++) {
        const item = array[i];
        const itemPath = `${path}.${field}[${i}]`;
        
        if (typeof item !== 'object' || item === null) {
          issues.push({
            path: itemPath,
            message: `${field}[${i}] must be an object with 'type' and 'amount' properties`,
            severity: 'error',
            code: 'INVALID_COMPONENT_STRUCTURE',
            context: { index: i, actualType: typeof item }
          });
          continue;
        }
        
        const comp = item as any;
        
        if (!('type' in comp) || !this.isValidGoodsType(String(comp['type']))) {
          issues.push({
            path: `${itemPath}.type`,
            message: `${field}[${i}].type must be a valid GoodsType`,
            severity: 'error',
            code: 'INVALID_COMPONENT_TYPE',
            context: { index: i, value: comp['type'] }
          });
        }
        
        if (!('amount' in comp) || isNaN(Number(comp['amount'])) || Number(comp['amount']) <= 0) {
          issues.push({
            path: `${itemPath}.amount`,
            message: `${field}[${i}].amount must be a positive number`,
            severity: 'error',
            code: 'INVALID_COMPONENT_AMOUNT',
            context: { index: i, value: comp['amount'] }
          });
        }
      }
    }
  }
  
  // Enum validation helpers
  private isValidGoodsType(value: string): value is GoodsType {
    return Object.values(GoodsType).includes(value as GoodsType);
  }
  
  private isValidFloraType(value: string): value is FloraType {
    return Object.values(FloraType).includes(value as FloraType);
  }
  
  private isValidCategory(value: string): boolean {
    return Object.values(GoodCategory).includes(value as GoodCategory) || typeof value === 'string';
  }
  
  // Normalization helpers
  private normalizeRarity(value: unknown): Rarity | number {
    if (typeof value === 'number') {
      return Math.max(1, Math.min(5, value));
    }
    
    if (typeof value === 'string') {
      // Try to match enum values, fall back to numeric parsing
      const enumMatch = Object.values(Rarity).find(r => r.toLowerCase() === value.toLowerCase());
      if (enumMatch) return enumMatch;
      
      const numericValue = parseInt(value, 10);
      if (!isNaN(numericValue)) {
        return Math.max(1, Math.min(5, numericValue));
      }
    }
    
    return 1; // Default to lowest rarity
  }
  
  // Metadata extraction helpers
  private extractVersion(data: unknown): string | undefined {
    if (typeof data === 'object' && data !== null) {
      const obj = data as any;
      return typeof obj['version'] === 'string' ? obj['version'] : undefined;
    }
    return undefined;
  }
  
  private extractMetadata(data: unknown): Record<string, unknown> | undefined {
    if (typeof data === 'object' && data !== null) {
      const obj = data as any;
      return typeof obj['metadata'] === 'object' ? obj['metadata'] as Record<string, unknown> : undefined;
    }
    return undefined;
  }
  
  private createErrorResult(message: string, issues: GoodsCatalogIssue[]): GoodsCatalogResult {
    return {
      success: false,
      goods: [],
      issues: [{
        path: 'root',
        message,
        severity: 'error',
        code: 'IMPORT_FAILED'
      }, ...issues]
    };
  }
  
  private calculateRarityDistribution(goods: ManagedGood[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    
    for (const good of goods) {
      const rarityKey = typeof good.rarity === 'number' ? `numeric_${good.rarity}` : String(good.rarity);
      distribution[rarityKey] = (distribution[rarityKey] ?? 0) + 1;
    }
    
    return distribution;
  }
  
  private calculateComplexityRange(goods: ManagedGood[]): { min: number; max: number; average: number } {
    if (goods.length === 0) {
      return { min: 0, max: 0, average: 0 };
    }
    
    const complexities = goods.map(g => g.complexity).filter(c => !isNaN(c));
    const min = Math.min(...complexities);
    const max = Math.max(...complexities);
    const average = complexities.reduce((sum, c) => sum + c, 0) / complexities.length;
    
    return { min, max, average: Math.round(average * 100) / 100 };
  }
  
  private compareVersions(version1: string, version2: string): number {
    const v1Parts = version1.split('.').map(Number);
    const v2Parts = version2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const v1Part = v1Parts[i] ?? 0;
      const v2Part = v2Parts[i] ?? 0;
      
      if (v1Part < v2Part) return -1;
      if (v1Part > v2Part) return 1;
    }
    
    return 0;
  }
}