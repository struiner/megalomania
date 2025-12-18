/**
 * GOODS DERIVED STATS UTILITY MODULE
 * 
 * Computes derived statistics for the goods catalog including tier totals,
 * rarity-to-tier mapping validation, aggregate counts, and per-culture breakdowns.
 * All functions are deterministic and side-effect free.
 */

import { Injectable } from '@angular/core';
import { GoodsType } from '../enums/GoodsType';
import { GoodCategory, Rarity } from '../models/goods.model';
import { GoodsInfo } from '../data/goods/data';

/**
 * Core managed good interface with all necessary fields for stats computation
 */
export interface ManagedGood {
  type: GoodsType;
  title: string;
  rarity: number; // 1-5 numeric rating
  complexity: number; // 1-5
  basePrice: number;
  category: GoodCategory | string;
  cultureTags?: string[]; // Optional culture association
  description?: string;
  components?: Array<{ type: GoodsType; amount: number }>;
}

/**
 * Tier breakdown result
 */
export interface TierBreakdown {
  tier: number;
  count: number;
  percentage: number;
}

/**
 * Rarity breakdown result  
 */
export interface RarityBreakdown {
  rarity: Rarity;
  count: number;
  percentage: number;
}

/**
 * Category breakdown result
 */
export interface CategoryBreakdown {
  category: GoodCategory | string;
  count: number;
  percentage: number;
}

/**
 * Culture-specific aggregate data
 */
export interface CultureAggregate {
  cultureTag: string;
  totalGoods: number;
  categories: CategoryBreakdown[];
  rarities: RarityBreakdown[];
  averageComplexity: number;
  averageBasePrice: number;
}

/**
 * Validation warning for data inconsistencies
 */
export interface ValidationWarning {
  type: 'rarity_mismatch' | 'missing_data' | 'category_mismatch' | 'calculation_inconsistency';
  severity: 'warning' | 'error';
  message: string;
  affectedGoods: GoodsType[];
  suggestedFix?: string;
}

/**
 * Configuration for rarity-tier mapping rules
 */
export interface RarityTierMapping {
  rarity: Rarity;
  expectedTierRange: [number, number]; // [min, max]
  confidence: number; // 0-1, how strict this rule should be applied
}

/**
 * Comprehensive stats result
 */
export interface GoodsDerivedStats {
  totalGoods: number;
  tierBreakdown: TierBreakdown[];
  rarityBreakdown: RarityBreakdown[];
  categoryBreakdown: CategoryBreakdown[];
  cultureAggregates: CultureAggregate[];
  validationWarnings: ValidationWarning[];
  rarityTierMapping: RarityTierMapping[];
  metadata: {
    calculatedAt: Date;
    inputOrder: string[]; // Deterministic ordering of input goods
    calculationVersion: string;
  };
}

/**
 * Default configurable rarity-tier mapping rules
 */
export const DEFAULT_RARITY_TIER_MAPPING: RarityTierMapping[] = [
  { rarity: Rarity.Common, expectedTierRange: [1, 2], confidence: 0.9 },
  { rarity: Rarity.Uncommon, expectedTierRange: [2, 3], confidence: 0.8 },
  { rarity: Rarity.Rare, expectedTierRange: [3, 4], confidence: 0.8 },
  { rarity: Rarity.Exotic, expectedTierRange: [4, 5], confidence: 0.7 },
  { rarity: Rarity.Legendary, expectedTierRange: [5, 5], confidence: 0.9 },
];

/**
 * Culture tag groupings for aggregate calculations
 */
export const CULTURE_TAG_GROUPS = {
  // Biome-based cultures
  'biome_taiga': 'Northern Cultures',
  'biome_forest': 'Forest Cultures', 
  'biome_plains': 'Plains Cultures',
  'biome_desert': 'Desert Cultures',
  'biome_mountain': 'Mountain Cultures',
  'biome_coastal': 'Coastal Cultures',
  'biome_beach': 'Beach Cultures',
  
  // Settlement-based cultures
  'settlement_hamlet': 'Rural Communities',
  'settlement_village': 'Village Societies',
  'settlement_town': 'Town Cultures',
  'settlement_city': 'Urban Cultures',
  'settlement_trading_post': 'Trade Communities',
  
  // Guild-based cultures  
  'guild_merchants': 'Merchant Guilds',
  'guild_scholars': 'Academic Guilds',
  'guild_artisans': 'Craft Guilds',
  'guild_warriors': 'Military Orders',
};

@Injectable({
  providedIn: 'root'
})
export class GoodsDerivedStatsService {

  /**
   * Main function to compute comprehensive derived stats
   */
  computeDerivedStats(
    goods: ManagedGood[], 
    rarityTierMapping: RarityTierMapping[] = DEFAULT_RARITY_TIER_MAPPING,
    cultureGroups: Record<string, string> = CULTURE_TAG_GROUPS
  ): GoodsDerivedStats {
    
    // Ensure deterministic input ordering
    const sortedGoods = this.sortGoodsDeterministically(goods);
    const inputOrder = sortedGoods.map(good => good.type);
    
    // Compute basic breakdowns
    const tierBreakdown = this.computeTierBreakdown(sortedGoods);
    const rarityBreakdown = this.computeRarityBreakdown(sortedGoods);
    const categoryBreakdown = this.computeCategoryBreakdown(sortedGoods);
    
    // Compute culture aggregates
    const cultureAggregates = this.computeCultureAggregates(sortedGoods, cultureGroups);
    
    // Validate rarity-tier mapping
    const validationWarnings = this.validateRarityTierMapping(sortedGoods, rarityTierMapping);
    
    return {
      totalGoods: sortedGoods.length,
      tierBreakdown,
      rarityBreakdown,
      categoryBreakdown,
      cultureAggregates,
      validationWarnings,
      rarityTierMapping,
      metadata: {
        calculatedAt: new Date(),
        inputOrder,
        calculationVersion: '1.0.0'
      }
    };
  }

  /**
   * Compute tier breakdown (1-5 tiers based on complexity)
   */
  computeTierBreakdown(goods: ManagedGood[]): TierBreakdown[] {
    const totals = new Map<number, number>();
    
    // Initialize all tiers
    for (let tier = 1; tier <= 5; tier++) {
      totals.set(tier, 0);
    }
    
    // Count goods per tier
    goods.forEach(good => {
      const tier = Math.max(1, Math.min(5, Math.round(good.complexity)));
      totals.set(tier, (totals.get(tier) || 0) + 1);
    });
    
    const total = goods.length;
    return Array.from(totals.entries())
      .map(([tier, count]) => ({
        tier,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0
      }))
      .sort((a, b) => a.tier - b.tier);
  }

  /**
   * Compute rarity breakdown
   */
  computeRarityBreakdown(goods: ManagedGood[]): RarityBreakdown[] {
    const totals = new Map<Rarity, number>();
    const total = goods.length;
    
    goods.forEach(good => {
      const rarity = this.mapNumericRarityToEnum(good.rarity);
      totals.set(rarity, (totals.get(rarity) || 0) + 1);
    });
    
    return Object.values(Rarity).map(rarity => ({
      rarity,
      count: totals.get(rarity) || 0,
      percentage: total > 0 ? ((totals.get(rarity) || 0) / total) * 100 : 0
    }));
  }

  /**
   * Compute category breakdown
   */
  computeCategoryBreakdown(goods: ManagedGood[]): CategoryBreakdown[] {
    const totals = new Map<string, number>();
    const total = goods.length;
    
    goods.forEach(good => {
      const category = good.category || 'Uncategorized';
      totals.set(category, (totals.get(category) || 0) + 1);
    });
    
    return Array.from(totals.entries())
      .map(([category, count]) => ({
        category,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Compute per-culture aggregates
   */
  computeCultureAggregates(
    goods: ManagedGood[], 
    cultureGroups: Record<string, string> = CULTURE_TAG_GROUPS
  ): CultureAggregate[] {
    
    const cultureData = new Map<string, {
      goods: ManagedGood[];
      categories: Map<string, number>;
      rarities: Map<Rarity, number>;
      totalComplexity: number;
      totalBasePrice: number;
    }>();
    
    // Group goods by culture
    goods.forEach(good => {
      const cultureTags = good.cultureTags || ['uncategorized'];
      
      cultureTags.forEach(tag => {
        const groupName = cultureGroups[tag] || tag;
        
        if (!cultureData.has(groupName)) {
          cultureData.set(groupName, {
            goods: [],
            categories: new Map(),
            rarities: new Map(),
            totalComplexity: 0,
            totalBasePrice: 0
          });
        }
        
        const data = cultureData.get(groupName)!;
        data.goods.push(good);
        
        // Count categories
        const category = good.category || 'Uncategorized';
        data.categories.set(category, (data.categories.get(category) || 0) + 1);
        
        // Count rarities
        const rarity = this.mapNumericRarityToEnum(good.rarity);
        data.rarities.set(rarity, (data.rarities.get(rarity) || 0) + 1);
        
        // Sum for averages
        data.totalComplexity += good.complexity;
        data.totalBasePrice += good.basePrice;
      });
    });
    
    // Convert to CultureAggregate format
    const totalGoods = goods.length;
    return Array.from(cultureData.entries()).map(([cultureTag, data]) => {
      const cultureTotal = data.goods.length;
      
      return {
        cultureTag,
        totalGoods: cultureTotal,
        categories: Array.from(data.categories.entries()).map(([category, count]) => ({
          category,
          count,
          percentage: totalGoods > 0 ? (count / totalGoods) * 100 : 0
        })).sort((a, b) => b.count - a.count),
        rarities: Object.values(Rarity).map(rarity => ({
          rarity,
          count: data.rarities.get(rarity) || 0,
          percentage: totalGoods > 0 ? ((data.rarities.get(rarity) || 0) / totalGoods) * 100 : 0
        })),
        averageComplexity: cultureTotal > 0 ? data.totalComplexity / cultureTotal : 0,
        averageBasePrice: cultureTotal > 0 ? data.totalBasePrice / cultureTotal : 0
      };
    }).sort((a, b) => b.totalGoods - a.totalGoods);
  }

  /**
   * Validate rarity-tier mapping and generate warnings
   */
  validateRarityTierMapping(
    goods: ManagedGood[], 
    mapping: RarityTierMapping[]
  ): ValidationWarning[] {
    
    const warnings: ValidationWarning[] = [];
    
    goods.forEach(good => {
      const rarity = this.mapNumericRarityToEnum(good.rarity);
      const mappingRule = mapping.find(m => m.rarity === rarity);
      
      if (mappingRule) {
        const [minTier, maxTier] = mappingRule.expectedTierRange;
        const actualTier = Math.round(good.complexity);
        
        if (actualTier < minTier || actualTier > maxTier) {
          warnings.push({
            type: 'rarity_mismatch',
            severity: 'warning',
            message: `Good "${good.title}" has rarity ${rarity} but tier ${actualTier} (expected ${minTier}-${maxTier})`,
            affectedGoods: [good.type],
            suggestedFix: `Adjust complexity to ${Math.max(minTier, Math.min(maxTier, actualTier))} or update rarity to match tier ${actualTier}`
          });
        }
      }
    });
    
    return warnings;
  }

  /**
   * Convert numeric rarity (1-5) to Rarity enum
   */
  private mapNumericRarityToEnum(rarity: number): Rarity {
    if (rarity >= 5) return Rarity.Legendary;
    if (rarity === 4) return Rarity.Exotic;
    if (rarity === 3) return Rarity.Rare;
    if (rarity === 2) return Rarity.Uncommon;
    return Rarity.Common;
  }

  /**
   * Sort goods deterministically for reproducible calculations
   */
  private sortGoodsDeterministically(goods: ManagedGood[]): ManagedGood[] {
    return [...goods].sort((a, b) => {
      // Primary sort: by type
      const typeCompare = a.type.localeCompare(b.type);
      if (typeCompare !== 0) return typeCompare;
      
      // Secondary sort: by title
      const titleCompare = a.title.localeCompare(b.title);
      if (titleCompare !== 0) return titleCompare;
      
      // Tertiary sort: by rarity
      return a.rarity - b.rarity;
    });
  }

  /**
   * Utility function to validate input data completeness
   */
  validateInputData(goods: ManagedGood[]): ValidationWarning[] {
    const warnings: ValidationWarning[] = [];
    
    goods.forEach(good => {
      if (!good.title || good.title.trim() === '') {
        warnings.push({
          type: 'missing_data',
          severity: 'error',
          message: `Good ${good.type} is missing title`,
          affectedGoods: [good.type]
        });
      }
      
      if (good.rarity < 1 || good.rarity > 5) {
        warnings.push({
          type: 'missing_data',
          severity: 'error',
          message: `Good "${good.title}" has invalid rarity ${good.rarity} (must be 1-5)`,
          affectedGoods: [good.type],
          suggestedFix: 'Set rarity between 1 and 5'
        });
      }
      
      if (good.complexity < 1 || good.complexity > 5) {
        warnings.push({
          type: 'missing_data',
          severity: 'error',
          message: `Good "${good.title}" has invalid complexity ${good.complexity} (must be 1-5)`,
          affectedGoods: [good.type],
          suggestedFix: 'Set complexity between 1 and 5'
        });
      }
    });
    
    return warnings;
  }

  /**
   * Get summary statistics for quick overview
   */
  getSummaryStats(stats: GoodsDerivedStats): string {
    const { totalGoods, tierBreakdown, rarityBreakdown, validationWarnings } = stats;
    
    const summary = [
      `Total Goods: ${totalGoods}`,
      `Tier Distribution: ${tierBreakdown.map(t => `T${t.tier}:${t.count}`).join(', ')}`,
      `Rarity Distribution: ${rarityBreakdown.map(r => `${r.rarity}:${r.count}`).join(', ')}`,
      `Validation Issues: ${validationWarnings.length}`
    ];
    
    return summary.join(' | ');
  }
}