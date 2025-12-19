import { Injectable } from '@angular/core';
import { GoodsType } from '../enums/GoodsType';
import { Era, GoodCategory } from '../models/goods.model';

/**
 * Goods Icon Registry Service
 * 
 * Provides deterministic icon mapping for goods using GoodsType as single source of truth.
 * Supports era variants and validation for missing/duplicate icons.
 */

export interface GoodsIconDefinition {
  type: GoodsType;
  label: string;
  iconId: string;
  spritePath: string;
  gridSize: number;
  padding: number;
  stroke: number;
  era: Era;
  category: GoodCategory;
  status: 'complete' | 'placeholder' | 'missing';
  resolution: '64-32' | '128';
  contrast: 'single' | 'dual';
  notes?: string[];
}

export interface GoodsIconValidationIssue {
  kind: 'missing-icon' | 'duplicate-icon' | 'empty-sprite-path' | 'placeholder' | 'invalid-era-variant';
  message: string;
  affectedTypes: GoodsType[];
  suggestedFix?: string;
}

@Injectable({ providedIn: 'root' })
export class GoodsIconRegistryService {
  private static readonly GRID_SIZE = 64;
  private static readonly PADDING = 4;
  private static readonly STROKE = 2;

  // Base icon definitions with retro/Hanseatic styling guidelines
  private readonly baseIcons: GoodsIconDefinition[] = [
    this.createDefinition(GoodsType.Wood, Era.Marble, GoodCategory.RawMaterial, '64-32', 'dual', [
      'Use wooden plank texture with grain details',
      '64x32 resolution maintains retro pixel aesthetic',
      'Dual-tone contrast for readability at small sizes'
    ]),
    this.createDefinition(GoodsType.Brick, Era.Marble, GoodCategory.RawMaterial, '64-32', 'dual', [
      'Classic red brick pattern with mortar lines',
      'Maintain consistent brick proportions across goods set'
    ]),
    this.createDefinition(GoodsType.Grain, Era.Marble, GoodCategory.Food, '64-32', 'single', [
      'Wheat sheaf or individual grains',
      'Golden color palette for food classification'
    ]),
    this.createDefinition(GoodsType.Iron, Era.Ironbound, GoodCategory.RawMaterial, '64-32', 'dual', [
      'Ingot shape with metallic sheen',
      'Dark gray base with silver highlights'
    ]),
    this.createDefinition(GoodsType.MetalGoods, Era.Ironbound, GoodCategory.Tool, '64-32', 'dual', [
      'Tool silhouette (hammer, anvil, or gear)',
      'Clear functional shape for tool category recognition'
    ])
  ];

  private readonly registry: GoodsIconDefinition[] = this.buildRegistry();

  /**
   * Get all goods icon definitions
   */
  getIcons(): GoodsIconDefinition[] {
    return this.registry;
  }

  /**
   * Get icon definition by GoodsType
   */
  getIconByType(type: GoodsType, era?: Era): GoodsIconDefinition | undefined {
    const icons = this.registry.filter(icon => icon.type === type);
    if (era) {
      return icons.find(icon => icon.era === era);
    }
    // Return base era icon if no specific era requested
    return icons.find(icon => icon.status === 'complete') || icons[0];
  }

  /**
   * Get icons by category for filtering
   */
  getIconsByCategory(category: GoodCategory): GoodsIconDefinition[] {
    return this.registry.filter(icon => icon.category === category);
  }

  /**
   * Get icons by era for variant support
   */
  getIconsByEra(era: Era): GoodsIconDefinition[] {
    return this.registry.filter(icon => icon.era === era);
  }

  /**
   * Get placeholder icons that need art assets
   */
  getPlaceholderIcons(): GoodsIconDefinition[] {
    return this.registry.filter(icon => icon.status === 'placeholder' || icon.status === 'missing');
  }

  /**
   * Validate the icon registry for issues
   */
  validateRegistry(): GoodsIconValidationIssue[] {
    const issues: GoodsIconValidationIssue[] = [];
    const seenIconIds = new Map<string, GoodsType[]>();
    const missingIcons: GoodsType[] = [];
    const placeholderIcons: GoodsType[] = [];
    const emptySpritePaths: GoodsType[] = [];

    this.registry.forEach((definition) => {
      // Check for empty sprite paths
      if (!definition.spritePath.trim()) {
        emptySpritePaths.push(definition.type);
      }

      // Check for placeholder status
      if (definition.status === 'placeholder') {
        placeholderIcons.push(definition.type);
      }

      // Check for missing complete icons
      if (definition.status === 'missing') {
        missingIcons.push(definition.type);
      }

      // Track duplicate icon IDs
      const bucket = seenIconIds.get(definition.iconId) ?? [];
      bucket.push(definition.type);
      seenIconIds.set(definition.iconId, bucket);
    });

    // Generate issues for problems found
    if (missingIcons.length) {
      issues.push({
        kind: 'missing-icon',
        message: `Missing icons for goods: ${this.toList(missingIcons)}. Create art assets before production use.`,
        affectedTypes: missingIcons,
        suggestedFix: 'Assign actual sprite paths to replace placeholder entries'
      });
    }

    if (placeholderIcons.length) {
      issues.push({
        kind: 'placeholder',
        message: `Placeholder icons for: ${this.toList(placeholderIcons)}. Art assets needed but exports are not blocked.`,
        affectedTypes: placeholderIcons,
        suggestedFix: 'Source or create icon assets to replace placeholders'
      });
    }

    if (emptySpritePaths.length) {
      issues.push({
        kind: 'empty-sprite-path',
        message: `Empty sprite paths for: ${this.toList(emptySpritePaths)}. Will fall back to placeholder rendering.`,
        affectedTypes: emptySpritePaths,
        suggestedFix: 'Populate spritePath field with valid asset references'
      });
    }

    seenIconIds.forEach((types, iconId) => {
      if (types.length > 1) {
        issues.push({
          kind: 'duplicate-icon',
          message: `Duplicate icon ID '${iconId}' used by: ${this.toList(types)}`,
          affectedTypes: types,
          suggestedFix: 'Ensure each icon ID is unique across all goods'
        });
      }
    });

    return issues;
  }

  /**
   * Export validation report for external use
   */
  exportValidationReport(): string {
    const issues = this.validateRegistry();
    const timestamp = new Date().toISOString();
    
    let report = `# Goods Icon Validation Report\n`;
    report += `Generated: ${timestamp}\n\n`;
    
    if (issues.length === 0) {
      report += `✅ No validation issues found. All goods icons are properly configured.\n`;
      return report;
    }

    report += `## Issues Found: ${issues.length}\n\n`;
    
    issues.forEach((issue, index) => {
      report += `### ${index + 1}. ${issue.kind.toUpperCase().replace('-', ' ')}\n`;
      report += `**Message:** ${issue.message}\n`;
      report += `**Affected Goods:** ${issue.affectedTypes.map(t => this.toLabel(t)).join(', ')}\n`;
      if (issue.suggestedFix) {
        report += `**Suggested Fix:** ${issue.suggestedFix}\n`;
      }
      report += `\n`;
    });

    return report;
  }

  private buildRegistry(): GoodsIconDefinition[] {
    const definitions: GoodsIconDefinition[] = [...this.baseIcons];
    
    // Generate placeholder entries for all GoodsType values not in base definitions
    const coveredTypes = new Set(this.baseIcons.map(def => def.type));
    const allGoodsTypes = Object.values(GoodsType);
    
    allGoodsTypes.forEach(type => {
      if (!coveredTypes.has(type)) {
        definitions.push(this.createPlaceholderDefinition(type));
      }
    });

    // Sort by category then by type name
    return definitions.sort((left, right) => {
      if (left.category !== right.category) {
        return left.category.localeCompare(right.category);
      }
      return left.type.localeCompare(right.type);
    });
  }

  private createDefinition(
    type: GoodsType, 
    era: Era, 
    category: GoodCategory, 
    resolution: '64-32' | '128',
    contrast: 'single' | 'dual',
    notes: string[]
  ): GoodsIconDefinition {
    const iconId = this.toIconId(type, era);
    
    return {
      type,
      label: this.toLabel(type),
      iconId,
      spritePath: `assets/goods/${iconId}@${resolution}`,
      gridSize: GoodsIconRegistryService.GRID_SIZE,
      padding: GoodsIconRegistryService.PADDING,
      stroke: GoodsIconRegistryService.STROKE,
      era,
      category,
      status: 'complete',
      resolution,
      contrast,
      notes
    };
  }

  private createPlaceholderDefinition(type: GoodsType): GoodsIconDefinition {
    const era = this.inferEraFromType(type);
    const category = this.inferCategoryFromType(type);
    const iconId = this.toIconId(type, era);
    
    return {
      type,
      label: this.toLabel(type),
      iconId,
      spritePath: '', // Empty path indicates missing asset
      gridSize: GoodsIconRegistryService.GRID_SIZE,
      padding: GoodsIconRegistryService.PADDING,
      stroke: GoodsIconRegistryService.STROKE,
      era,
      category,
      status: 'placeholder',
      resolution: '64-32',
      contrast: 'dual',
      notes: [
        'Placeholder icon - requires art asset creation',
        `Inferred era: ${era}, category: ${category}`,
        'Follow retro/Hanseatic art style guidelines'
      ]
    };
  }

  private toIconId(type: GoodsType, era: Era): string {
    const normalizedType = this.normalize(type);
    const normalizedEra = this.normalize(era);
    return `goods_${normalizedType}_${normalizedEra}`;
  }

  private toLabel(type: GoodsType): string {
    return this.normalize(type)
      .split('_')
      .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' ');
  }

  private normalize(value: string): string {
    return value.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
  }

  private inferEraFromType(type: GoodsType): Era {
    // Basic heuristic for era inference based on goods type
    const modernGoods = [
      GoodsType.Electronics, GoodsType.PlasticGoods, GoodsType.Aluminium,
      GoodsType.Titanium, GoodsType.Fuel, GoodsType.Oil, GoodsType.Chemicals
    ];
    const industrialGoods = [
      GoodsType.Steel, GoodsType.Coal, GoodsType.Machinery, GoodsType.Copper
    ];
    
    if (modernGoods.includes(type)) return Era.Modern;
    if (industrialGoods.includes(type)) return Era.Smokeforged;
    if (type.toString().toLowerCase().includes('aether') || 
        type.toString().toLowerCase().includes('quantum') ||
        type.toString().toLowerCase().includes('plasma')) {
      return Era.Stellar;
    }
    
    return Era.Marble; // Default to classical for most goods
  }

  private inferCategoryFromType(type: GoodsType): GoodCategory {
    // Basic category inference from type name
    const typeStr = type.toString().toLowerCase();
    
    if (typeStr.includes('food') || typeStr.includes('grain') || 
        typeStr.includes('meat') || typeStr.includes('beer') || 
        typeStr.includes('wine') || typeStr.includes('honey')) {
      return GoodCategory.Food;
    }
    if (typeStr.includes('tool') || typeStr.includes('machinery') ||
        typeStr.includes('metal') || typeStr.includes('electronics')) {
      return GoodCategory.Tool;
    }
    if (typeStr.includes('gem') || typeStr.includes('gold') || 
        typeStr.includes('silver') || typeStr.includes('jewelry') ||
        typeStr.includes('spice')) {
      return GoodCategory.Luxury;
    }
    if (typeStr.includes('paper') || typeStr.includes('book')) {
      return GoodCategory.Knowledge;
    }
    if (typeStr.includes('coal') || typeStr.includes('oil') || 
        typeStr.includes('fuel') || typeStr.includes('hydrogen')) {
      return GoodCategory.Energy;
    }
    
    return GoodCategory.RawMaterial; // Default category
  }

  private toList(types: GoodsType[]): string {
    return types
      .map(type => this.toLabel(type))
      .sort()
      .join(', ');
  }
}