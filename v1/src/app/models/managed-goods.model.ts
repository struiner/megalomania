/**
 * MANAGED GOODS DATA MODEL
 * Composes existing goods, flora, and category enums with derived fields
 * for tier, rarity, complexity, base price and tags
 */

import { GoodsType } from "../enums/GoodsType";
import { FloraType } from "../enums/FloraType";
import { GoodCategory, Rarity, UnitType, StorageType } from "./goods.model";
import { BiomeType } from "../enums/BiomeType";
import { StructureType } from "../enums/StructureType";
import { GoodsProvenanceRecord } from "./goods-provenance.model";

// Cultural Archetypes for Generic Cultural Context
export enum CulturalArchetype {
  CavemenTribe = "CavemenTribe",
  TermiteCollective = "TermiteCollective", 
  RomanColony = "RomanColony",
  VikingEnclave = "VikingEnclave",
  HanseaticTradingEnclave = "HanseaticTradingEnclave",
  NuclearHolocaustSurvivors = "NuclearHolocaustSurvivors",
  Foxfolk = "Foxfolk",
  CentaurNomads = "CentaurNomads",
  FreeCity = "FreeCity",
  Necropolis = "Necropolis",
  GeneticallyAlteredRatColony = "GeneticallyAlteredRatColony",
}

// Tier levels for goods categorization
export enum GoodTier {
  Primitive = 1,    // Basic tools, raw materials
  Basic = 2,        // Simple processed goods
  Standard = 3,     // Common manufactured items
  Advanced = 4,     // Complex machinery, refined goods
  Sophisticated = 5, // High-tech, magical, or luxury items
  Legendary = 6     // Mythic, artifact-level goods
}

// Complexity levels for production and usage
export enum ComplexityLevel {
  Simple = 1,       // Basic processing, minimal skills
  Moderate = 2,     // Standard crafting, intermediate skills  
  Complex = 3,      // Advanced manufacturing, expert skills
  Intricate = 4,    // Precise work, master-level skills
  Arcane = 5,       // Magical/technological requiring specialized knowledge
  Transcendent = 6  // Reality-bending, legendary expertise
}

/**
 * Core ManagedGood interface
 * Composes authoritative enums with derived fields
 */
export interface ManagedGood {
  // Deterministic identifier - must be unique and stable
  id: string;
  
  // Link to authoritative enum sources (no duplication)
  goodsType: GoodsType;
  category: GoodCategory;
  
  // Flora sources (for goods derived from plants) - supports multiple sources
  floraSources: FloraType[];
  
  // Core identification
  name: string;
  description: string;
  
  // Derived categorization fields
  tier: GoodTier;
  rarity: Rarity;
  complexity: ComplexityLevel;
  
  // Economic data
  basePrice: number;        // Base economic value
  priceUnit: UnitType;      // How price is measured
  storageType: StorageType; // Storage requirements
  
  // Flexible tagging system (freeform strings as specified)
  tags: string[];
  
  // Cultural context overrides (generic archetypes)
  culturalPreferences?: CulturalArchetype[];
  culturalTaboos?: CulturalArchetype[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  version: number;
  
  // Optional: Multiple flora source representation for UI
  primaryFloraSource?: FloraType;
  secondaryFloraSources?: FloraType[];
  
  // Goods provenance alignment — world truth references
  // Links this good to authoritative world biomes, flora, and structures
  // Ensures deterministic provenance without enum duplication
  provenance?: GoodsProvenanceRecord;
}

/**
 * Identifier normalization rules and constraints
 */
export interface IdentifierNormalization {
  // ID format: [goodsType]_[category]_[tier]_[rarity]_[complexity]
  // Example: "wood_rawmaterial_1_common_1" or "iron_basic_2_uncommon_2"
  
  format: string;
  rules: {
    goodsType: string;     // Lowercase enum value
    category: string;      // PascalCase enum value  
    tier: string;          // Numeric tier (1-6)
    rarity: string;        // PascalCase enum value
    complexity: string;    // Numeric complexity (1-6)
  };
  
  validation: {
    deterministic: boolean;      // Same input always produces same ID
    uniqueness: boolean;         // Each combination is unique
    stable: boolean;            // ID never changes for same good
  };
}

/**
 * Tag validation hints and constraints
 */
export interface TagValidation {
  // Tags are freeform strings as specified in requirements
  constraints: {
    maxLength: number;      // Maximum tag length
    allowedCharacters: RegExp; // Character restrictions
    maxCount: number;       // Maximum tags per good
  };
  
  recommendations: {
    semantic: string[];     // Suggested semantic categories
    functional: string[];   // Suggested functional categories
    cultural: string[];     // Suggested cultural context tags
  };
}

/**
 * Sample data fixtures for downstream testing
 */
export const MANAGED_GOODS_FIXTURES: ManagedGood[] = [
  {
    id: "wood_rawmaterial_1_common_1",
    goodsType: GoodsType.Wood,
    category: GoodCategory.RawMaterial,
    floraSources: [FloraType.Oak, FloraType.ForestPine],
    name: "Basic Lumber",
    description: "Raw timber from common forest trees, suitable for basic construction and crafting.",
    tier: GoodTier.Primitive,
    rarity: Rarity.Common,
    complexity: ComplexityLevel.Simple,
    basePrice: 10,
    priceUnit: UnitType.Weight,
    storageType: StorageType.Dry,
    tags: ["construction", "crafting", "fuel", "renewable"],
    culturalPreferences: [CulturalArchetype.CavemenTribe, CulturalArchetype.VikingEnclave],
    createdAt: new Date("2025-12-19T09:42:00Z"),
    updatedAt: new Date("2025-12-19T09:42:00Z"),
    version: 1,
    primaryFloraSource: FloraType.Oak,
    secondaryFloraSources: [FloraType.ForestPine],
    provenance: {
      good: GoodsType.Wood,
      primaryBiome: BiomeType.Forest,
      secondaryBiomes: [BiomeType.Woodland],
      floraSources: [FloraType.Oak, FloraType.ForestPine],
      extractionStructures: [StructureType.Lumberyard, StructureType.Woodcutter],
      refinementStructures: [],
      regionTags: ["temperate", "renewable"],
      ledgerRefs: [
        {
          stream: "worldgen",
          eventType: "flora.discovery",
          schemaRef: "flora-forest-v1",
          hashPointer: "forest_wood_001"
        }
      ],
      normalization: {
        biomeOrdering: "alphabetical",
        floraOrdering: "alphabetical",
        structureOrdering: "alphabetical",
        ledgerOrdering: "stream-event-schema",
        casing: "lower-snake"
      }
    }
  },
  
  {
    id: "iron_material_2_uncommon_2",
    goodsType: GoodsType.Iron,
    category: GoodCategory.Material,
    floraSources: [], // Iron is not derived from flora
    name: "Refined Iron Ingots",
    description: "Processed iron ingots ready for tool and weapon crafting.",
    tier: GoodTier.Basic,
    rarity: Rarity.Uncommon,
    complexity: ComplexityLevel.Moderate,
    basePrice: 50,
    priceUnit: UnitType.Weight,
    storageType: StorageType.Dry,
    tags: ["metalworking", "tools", "weapons", "infrastructure"],
    culturalPreferences: [CulturalArchetype.RomanColony, CulturalArchetype.VikingEnclave],
    createdAt: new Date("2025-12-19T09:42:00Z"),
    updatedAt: new Date("2025-12-19T09:42:00Z"),
    version: 1,
    provenance: {
      good: GoodsType.Iron,
      primaryBiome: BiomeType.Grassland, // Common mining areas
      secondaryBiomes: [BiomeType.Desert, BiomeType.Forest], // Various mining locations
      floraSources: [], // Iron is mineral-based, not flora-derived
      extractionStructures: [StructureType.Mine, StructureType.GoldMine], // Generic mines for iron extraction
      refinementStructures: [StructureType.Steelworks, StructureType.Blacksmith],
      regionTags: ["mineral", "refined", "metallurgy"],
      ledgerRefs: [
        {
          stream: "worldgen",
          eventType: "ore.discovery",
          schemaRef: "ore-deposit-v1",
          hashPointer: "iron_ore_001"
        },
        {
          stream: "catalogue",
          eventType: "metal.processing",
          schemaRef: "metal-refinery-v1",
          hashPointer: "iron_refined_001"
        }
      ],
      normalization: {
        biomeOrdering: "alphabetical",
        floraOrdering: "alphabetical",
        structureOrdering: "alphabetical",
        ledgerOrdering: "stream-event-schema",
        casing: "lower-snake"
      }
    }
  },
  
  {
    id: "spices_luxury_3_rare_3",
    goodsType: GoodsType.Spices,
    category: GoodCategory.Luxury,
    floraSources: [FloraType.CoffeePlant, FloraType.DesertSage],
    name: "Exotic Spice Blend",
    description: "Rare spice mixture from distant lands, prized for flavoring and preservation.",
    tier: GoodTier.Standard,
    rarity: Rarity.Rare,
    complexity: ComplexityLevel.Complex,
    basePrice: 200,
    priceUnit: UnitType.Weight,
    storageType: StorageType.Dry,
    tags: ["culinary", "preservation", "trade", "medicinal", "exotic"],
    culturalPreferences: [CulturalArchetype.HanseaticTradingEnclave, CulturalArchetype.RomanColony],
    culturalTaboos: [CulturalArchetype.CavemenTribe],
    createdAt: new Date("2025-12-19T09:42:00Z"),
    updatedAt: new Date("2025-12-19T09:42:00Z"),
    version: 1,
    primaryFloraSource: FloraType.CoffeePlant,
    provenance: {
      good: GoodsType.Spices,
      primaryBiome: BiomeType.Rainforest, // Coffee plant origin
      secondaryBiomes: [BiomeType.Desert, BiomeType.Grassland], // Desert sage and trade routes
      floraSources: [FloraType.CoffeePlant, FloraType.DesertSage],
      extractionStructures: [StructureType.CoffeePlantation, StructureType.SpiceMarket],
      refinementStructures: [StructureType.SpiceMarket, StructureType.Warehouse], // Processing and storage
      regionTags: ["tropical", "exotic", "trade", "aromatic"],
      ledgerRefs: [
        {
          stream: "worldgen",
          eventType: "flora.discovery",
          schemaRef: "tropical-flora-v1",
          hashPointer: "spice_tropical_001"
        },
        {
          stream: "trade",
          eventType: "spice.route",
          schemaRef: "trade-route-v1",
          hashPointer: "spice_trade_001"
        }
      ],
      normalization: {
        biomeOrdering: "alphabetical",
        floraOrdering: "alphabetical",
        structureOrdering: "alphabetical",
        ledgerOrdering: "stream-event-schema",
        casing: "lower-snake"
      }
    }
  },
  
  {
    id: "aetherium_exoticmaterial_6_legendary_6",
    goodsType: GoodsType.Aetherium,
    category: GoodCategory.ExoticMaterial,
    floraSources: [FloraType.ManaBud, FloraType.SingingCrystals],
    name: "Concentrated Aetherium Crystal",
    description: "Highly refined magical crystal containing condensed aetherium essence.",
    tier: GoodTier.Legendary,
    rarity: Rarity.Legendary,
    complexity: ComplexityLevel.Transcendent,
    basePrice: 5000,
    priceUnit: UnitType.Count,
    storageType: StorageType.Secure,
    tags: ["magic", "crystal", "energy", "transcendent", "artifact"],
    culturalPreferences: [CulturalArchetype.Necropolis, CulturalArchetype.Foxfolk],
    createdAt: new Date("2025-12-19T09:42:00Z"),
    updatedAt: new Date("2025-12-19T09:42:00Z"),
    version: 1,
    primaryFloraSource: FloraType.ManaBud,
    secondaryFloraSources: [FloraType.SingingCrystals],
    provenance: {
      good: GoodsType.Aetherium,
      primaryBiome: BiomeType.Alpine, // High-altitude magical environments
      secondaryBiomes: [BiomeType.Rainforest], // Crystal grotto environments
      floraSources: [FloraType.ManaBud, FloraType.SingingCrystals],
      extractionStructures: [StructureType.AetheriumReactor, StructureType.ArcaniteSpire],
      refinementStructures: [StructureType.AetheriumReactor, StructureType.LuminarChamber],
      regionTags: ["magical", "crystalline", "high-altitude", "transcendent"],
      ledgerRefs: [
        {
          stream: "worldgen",
          eventType: "magical.crystal.formation",
          schemaRef: "magical-crystal-v1",
          hashPointer: "aetherium_crystal_001"
        },
        {
          stream: "catalogue",
          eventType: "exotic.material.refinement",
          schemaRef: "exotic-refinery-v1",
          hashPointer: "aetherium_refined_001"
        }
      ],
      normalization: {
        biomeOrdering: "alphabetical",
        floraOrdering: "alphabetical",
        structureOrdering: "alphabetical",
        ledgerOrdering: "stream-event-schema",
        casing: "lower-snake"
      },
      notes: "Synthetic alternative: Arcane energy can be synthesized in laboratories using different modifiers and structure requirements"
    }
  }
];

/**
 * Constants for validation and reference
 */
export const MANAGED_GOODS_CONSTANTS = {
  IDENTIFIER_NORMALIZATION: {
    format: "{goodsType}_{category}_{tier}_{rarity}_{complexity}",
    rules: {
      goodsType: "lowercase enum value",
      category: "PascalCase enum value", 
      tier: "numeric (1-6)",
      rarity: "PascalCase enum value",
      complexity: "numeric (1-6)"
    }
  } as IdentifierNormalization,
  
  TAG_VALIDATION: {
    constraints: {
      maxLength: 50,
      allowedCharacters: /^[a-zA-Z0-9_\-\s]+$/,
      maxCount: 10
    },
    recommendations: {
      semantic: ["renewable", "synthetic", "magical", "technological", "organic"],
      functional: ["construction", "crafting", "culinary", "medicinal", "decorative"],
      cultural: ["sacred", "taboo", "prestige", "common", "exotic"]
    }
  } as TagValidation
};

/**
 * Utility functions for ManagedGood validation and processing
 */
export class ManagedGoodUtils {
  
  /**
   * Generate deterministic ID for a managed good
   */
  static generateId(goodsType: GoodsType, category: GoodCategory, tier: GoodTier, rarity: Rarity, complexity: ComplexityLevel): string {
    return `${goodsType.toLowerCase()}_${category}_${tier}_${rarity}_${complexity}`;
  }
  
  /**
   * Validate managed good against constraints
   */
  static validateManagedGood(good: ManagedGood): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Validate ID format
    const expectedId = this.generateId(good.goodsType, good.category, good.tier, good.rarity, good.complexity);
    if (good.id !== expectedId) {
      errors.push(`ID mismatch: expected "${expectedId}", got "${good.id}"`);
    }
    
    // Validate tag constraints
    if (good.tags.length > MANAGED_GOODS_CONSTANTS.TAG_VALIDATION.constraints.maxCount) {
      errors.push(`Too many tags: maximum ${MANAGED_GOODS_CONSTANTS.TAG_VALIDATION.constraints.maxCount}`);
    }
    
    good.tags.forEach(tag => {
      if (tag.length > MANAGED_GOODS_CONSTANTS.TAG_VALIDATION.constraints.maxLength) {
        errors.push(`Tag too long: "${tag}" exceeds ${MANAGED_GOODS_CONSTANTS.TAG_VALIDATION.constraints.maxLength} characters`);
      }
      
      if (!MANAGED_GOODS_CONSTANTS.TAG_VALIDATION.constraints.allowedCharacters.test(tag)) {
        errors.push(`Invalid tag characters: "${tag}"`);
      }
    });
    
    // Validate flora sources for non-mineral goods
    if (good.category !== GoodCategory.RawMaterial && good.category !== GoodCategory.Material && 
        good.category !== GoodCategory.Energy && good.category !== GoodCategory.Artifact &&
        good.category !== GoodCategory.ExoticMaterial && good.floraSources.length === 0) {
      errors.push(`Good of category "${good.category}" should have flora sources`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Get goods by category for filtering
   */
  static getGoodsByCategory(goods: ManagedGood[], category: GoodCategory): ManagedGood[] {
    return goods.filter(good => good.category === category);
  }
  
  /**
   * Get goods by tier for progression analysis
   */
  static getGoodsByTier(goods: ManagedGood[], tier: GoodTier): ManagedGood[] {
    return goods.filter(good => good.tier === tier);
  }
}