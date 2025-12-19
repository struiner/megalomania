/**
 * UNIVERSAL GOODS MODEL — ASPECT-DRIVEN EDITION
 * (Version 2.0: For decentralized, agent-driven economies)
 */

import { GoodsType } from "../enums/GoodsType";
import { EraSuffixGenerator } from "./era-suffix.generator";

/////////////////////////////
// ENUMS
/////////////////////////////

export enum Era {
  // Mythic / Early Fantasy
  Primordial = "Primordial",      // Example: Titanborn clans, elemental spirits, arcane first settlements
  Elemental = "Elemental",        // Example: Air, fire, water, and earth cults
  Celestial = "Celestial",        // Example: Sky-temple societies, star-gazers
  Titanic = "Titanic",            // Example: Giant-kin, colossal construct builders
  Arcane = "Arcane",              // Example: Magic-wielding academies, spellbound courts
  Legendary = "Legendary",        // Example: Heroic kingdoms, famed adventurer guilds
  Draconic = "Draconic",          // Example: Dragon-riders, scaled kingdoms
  Fabled = "Fabled",              // Example: Myth-inspired villages and wandering tribes
  Ethereal = "Ethereal",          // Example: Ghostfolk, spectral communities
  Chimeric = "Chimeric",          // Example: Hybrid races, experimental arcane societies

  // Heroic / High Fantasy
  Heroic = "Heroic",              // Example: Knightly orders, warrior clans
  Runic = "Runic",                // Example: Rune-smith guilds, glyph-bound fortresses
  Warlike = "Warlike",            // Example: Militarized settlements, combat arenas
  Sovereign = "Sovereign",        // Example: Centralized monarchies, ruling dynasties
  Knightly = "Knightly",          // Example: Chivalric orders, tournament grounds
  Crowned = "Crowned",            // Example: Thrones, imperial courts
  Bannered = "Bannered",          // Example: Regional militias, feudal vassals
  Spellbound = "Spellbound",      // Example: Sorcerer courts, magical academies
  Dragonborn = "Dragonborn",      // Example: Draconic-human hybrid clans
  Crystaline = "Crystaline",      // Example: Mineral cities, gem-forged palaces

  // Classical / Ancient-Analog
  Obsidian = "Obsidian",          // Example: Dark stone citadels, volcanic settlements
  Ambered = "Ambered",            // Example: Desert kingdoms, trade-focused city-states
  Jade = "Jade",                  // Example: Eastern-inspired dynasties, artisan guilds
  Sunlit = "Sunlit",              // Example: Sun-worshipping empires
  Marble = "Marble",              // Example: Monumental architecture, senate-like councils
  Ivoryed = "Ivoryed",            // Example: Sacred temples, priestly societies
  Golden = "Golden",              // Example: Prosperous merchant republics
  Sandstone = "Sandstone",        // Example: Nomadic tribes, desert forts
  Sapphire = "Sapphire",          // Example: Coastal trading nations, port cities
  Ironbound = "Ironbound",        // Example: Fortified cities, early militarized states

  // Magitech / Alchemic
  Etheric = "Etheric",            // Example: Airship engineers, magical technologists
  Clockwork = "Clockwork",        // Example: Gear-driven societies, automated factories
  Steamforged = "Steamforged",    // Example: Steam-powered kingdoms, inventor guilds
  Gearbound = "Gearbound",        // Example: Mechanized strongholds, workshop cities
  Runeforged = "Runeforged",      // Example: Rune-powered forges, enchanted machinery
  Brassic = "Brassic",            // Example: Brass-crafted machines, alchemists
  ArcLinked = "ArcLinked",        // Example: Magitech academies, power-networked cities
  Sparked = "Sparked",            // Example: Experimental inventors, energy-harnessing cultures
  Cindric = "Cindric",            // Example: Fire-alchemy settlements, forges
  Fulgent = "Fulgent",            // Example: Light-manipulating civilizations, luminary guilds

  // Industrial-Analog
  Industrial = "Industrial",      // Example: Factories, smokestack cities, labor guilds
  Mechanized = "Mechanized",      // Example: Steam-trains, assembly-line settlements
  Smokeforged = "Smokeforged",    // Example: Coal-powered kingdoms, metallurgic cities
  Ironclad = "Ironclad",          // Example: Armored city-states, fortified zones
  Steelbound = "Steelbound",      // Example: Militarized industrial centers
  Riveted = "Riveted",            // Example: Bridges, mechanized ports, workshop networks
  Ashen = "Ashen",                // Example: Volcanic industry settlements, charred wastelands
  Forged = "Forged",              // Example: Metalworking empires, foundry cities
  Wired = "Wired",                // Example: Telegraph, early electric-powered hubs
  Machined = "Machined",          // Example: Mechanized production zones, factory complexes

  // Modern-Analog
  Modern = "Modern",              // Example: Contemporary nations, urban centers
  NeonLit = "NeonLit",            // Example: Cyberpunk districts, glowing metropolis
  Chromed = "Chromed",            // Example: High-tech industrial cities
  Networked = "Networked",        // Example: Communications-focused cultures
  Digital = "Digital",            // Example: Computerized, information-based societies
  Electric = "Electric",          // Example: Power-grid civilizations
  Polychrome = "Polychrome",      // Example: Art-focused modern city-states
  Broadcast = "Broadcast",        // Example: Media-centric cultures
  Urbanic = "Urbanic",            // Example: Dense city districts, modernist architecture
  WiredModern = "WiredModern",    // Example: Internet-integrated civilizations

  // Apocalyptic / Collapse
  Cataclysmic = "Cataclysmic",    // Example: Wastelands, refugee enclaves
  Blighted = "Blighted",          // Example: Radiation zones, poisoned plains
  Broken = "Broken",              // Example: Fragmented states, anarchic settlements
  Crimsoned = "Crimsoned",        // Example: Blood-soaked battlefields, warlords
  Shattered = "Shattered",        // Example: Collapsed empires, ruinous cities
  Forsaken = "Forsaken",          // Example: Abandoned strongholds, haunted zones
  Rusted = "Rusted",              // Example: Rusted machinery, decayed settlements
  Obscured = "Obscured",          // Example: Hidden enclaves, foggy wastelands
  Dimming = "Dimming",            // Example: Shadowed civilizations, failing infrastructure

  // Renewal / Rebirth
  Verdant = "Verdant",            // Example: Reclaimed lands, farming collectives
  Reclaimed = "Reclaimed",        // Example: Rebuilt cities, resettled territories
  Blooming = "Blooming",          // Example: Flourishing villages, botanical research
  Greened = "Greened",            // Example: Forest towns, nature-aligned societies
  Freshbound = "Freshbound",      // Example: Settlements on newly-terraformed zones
  Renewed = "Renewed",            // Example: Cultural revivals, restored communities
  Reforged = "Reforged",          // Example: Industrial + ecological hybrids
  Sprouting = "Sprouting",        // Example: Frontier settlements, experimental colonies
  Restorative = "Restorative",    // Example: Healing-focused, communal societies
  Hearthborn = "Hearthborn",      // Example: Village hearth cultures, close-knit communities

  // Interstellar / Cosmic
  Stellar = "Stellar",            // Example: Spacefaring empires, orbital stations
  Solar = "Solar",                // Example: Sun-worshiping colonies, energy-harvesters
  Astral = "Astral",              // Example: Astronomical observatories, sky-faring guilds
  Warpborn = "Warpborn",          // Example: Faster-than-light exploration cultures
  Pulsaric = "Pulsaric",          // Example: Pulsar-based navigation societies
  Nebular = "Nebular",            // Example: Clouded-space colonies
  Helionic = "Helionic",          // Example: Sun-harvesting enclaves
  Voidbound = "Voidbound",        // Example: Dark-space cultures, asteroid miners
  Starforged = "Starforged",      // Example: Stellar-smith civilizations
  Galaxic = "Galaxic",            // Example: Interstellar alliances

  // Extra-Dimensional / Alien
  Alienic = "Alienic",            // Example: Xeno societies, extra-dimensional enclaves
  Xenoic = "Xenoic",              // Example: Extraterrestrial settlements
  Fractal = "Fractal",            // Example: Multi-layered non-Euclidean structures
  Dimensional = "Dimensional",    // Example: Pocket-space communities
  Multiversal = "Multiversal",    // Example: Cross-plane enclaves
  Quantum = "Quantum",            // Example: Superposition-based civilizations
  Extradimensional = "Extradimensional", // Example: Planar travelers
  Transcendent = "Transcendent",  // Example: Posthuman, consciousness-focused enclaves
  Hybridic = "Hybridic",          // Example: Mixed-species or blended-technology societies
  Otherworldly = "Otherworldly"   // Example: Weird, alien-intuition settlements

  // Alliterating suffix generation is handled by the EraSuffixGenerator helper.
}

export enum GoodCategory {
  RawMaterial = "RawMaterial",   // Stone, metal, wood, ores, basic minerals
  Food = "Food",                 // Crops, meat, preserved foods, synthetic meals
  Tool = "Tool",                 // Implements, machines, devices
  Material = "Material",         // Semi-processed: ingots, planks, cloth, magical crystals
  Weapon = "Weapon",             // Swords, guns, magic staves, tech weaponry
  Luxury = "Luxury",             // Gems, jewelry, high-end items, magical trinkets
  Knowledge = "Knowledge",       // Books, scrolls, research data, arcane tomes
  Energy = "Energy",             // Coal, oil, electricity, magic power sources
  Artifact = "Artifact",         // Relics, enchanted objects, alien tech
  ExoticMaterial = "ExoticMaterial", // Rare materials from mythic or alien sources (meteorite, dragon-scale, aether crystal)
  Data = "Data",                 // Digital information, encrypted schematics, star charts
  Consumable = "Consumable",     // Potions, medicines, magical consumables
}

export enum Rarity {
  Common = "Common",
  Uncommon = "Uncommon",
  Rare = "Rare",
  Exotic = "Exotic",
  Legendary = "Legendary",
}

export enum UnitType {
  Weight = "Weight",
  Volume = "Volume",
  Count = "Count",
}

export enum StorageType {
  Dry = "Dry",
  Cool = "Cool",
  Frozen = "Frozen",
  Secure = "Secure",
  Hazardous = "Hazardous",
}

export enum AspectType {
  Physical = "Physical",
  Economic = "Economic",
  Cultural = "Cultural",
  Technological = "Technological",
  Ecological = "Ecological",
  Production = "Production",
}

/////////////////////////////
// BASE TYPES
/////////////////////////////

export interface Aspect {
  type: AspectType;
  weight?: number; // relative importance (0–1)
}

/////////////////////////////
// PHYSICAL
/////////////////////////////

export interface PhysicalAspect extends Aspect {
  type: AspectType.Physical;
  mass: number;
  volume: number;
  durability?: number;
  perishability?: number; // 0–1
  storage: StorageType;
}

/////////////////////////////
// ECONOMIC
/////////////////////////////

export interface EconomicAspect extends Aspect {
  type: AspectType.Economic;
  baseValue: number;
  elasticityOfDemand: number;
  elasticityOfSupply: number;
  volatility: number;
  rarity: Rarity;
}

/////////////////////////////
// CULTURAL
/////////////////////////////

export interface CulturalAspect extends Aspect {
  type: AspectType.Cultural;
  prestige?: number; // social value 0–1
  taboo?: number; // how restricted or forbidden it is
  symbolicUses?: string[];
  preferredByCultures?: string[];
}

/////////////////////////////
// TECHNOLOGICAL
/////////////////////////////

export interface TechnologicalAspect extends Aspect {
  type: AspectType.Technological;
  techLevelRequired: number;
  obsoletedBy?: string;
  enabledEras: Era[];
  productionEfficiencyModifier?: number;
}

/////////////////////////////
// ECOLOGICAL
/////////////////////////////

export interface EcologicalAspect extends Aspect {
  type: AspectType.Ecological;
  renewability: number; // 0 = finite, 1 = fully renewable
  environmentalImpact: number; // negative externality 0–1
  climateDependency?: number; // 0–1
}

/////////////////////////////
// PRODUCTION
/////////////////////////////

export interface ProductionAspect extends Aspect {
  type: AspectType.Production;
  inputs: Record<string, number>;
  outputs: Record<string, number>;
  laborCost: number;
  energyCost?: number;
  facilityType?: string;
  duration: number;
  byproducts?: Record<string, number>;
}

/////////////////////////////
// UNIFIED GOOD DEFINITION
/////////////////////////////

export interface Good {
  id: string;
  name: string;
  type: GoodsType;
  category: GoodCategory;
  description: string;
  tags: string[];

  // Core aspects
  aspects: {
    physical: PhysicalAspect;
    economic: EconomicAspect;
    cultural?: CulturalAspect;
    technological?: TechnologicalAspect;
    ecological?: EcologicalAspect;
    production?: ProductionAspect;
  };

  // Metadata
  eraOrigin: Era;
  eraVariants?: Era[];
  baseEraValueModifier?: number;
  isSynthetic?: boolean;
}

/////////////////////////////
// DYNAMIC BEHAVIOR (OPTIONAL)
/////////////////////////////

export interface GoodEvolutionRule {
  trigger: (good: Good, context: WorldContext) => boolean;
  mutate: (good: Good, context: WorldContext) => Good;
  description?: string;
}

export interface WorldContext {
  era: Era;
  techLevel: number;
  globalScarcity: Record<string, number>;
  culturalTrends: Record<string, number>; // e.g. "luxury": 1.2, "eco": 0.8
  random: () => number;
}

/////////////////////////////
// PROCEDURAL EVOLUTION ENGINE
/////////////////////////////

export function evolveGood(good: Good, context: WorldContext, rules: GoodEvolutionRule[]): Good {
  let evolved = { ...good };
  for (const rule of rules) {
    if (rule.trigger(evolved, context)) {
      evolved = rule.mutate(evolved, context);
    }
  }
  return evolved;
}

/////////////////////////////
// ERA SUFFIX HELPER
/////////////////////////////

/**
 * Deterministically build an alliterative suffix for a given era and culture.
 * Provide a stable seed (and optional culture label) to ensure repeatable output
 * across simulations or catalog exports.
 */
export function getEraSuffixForCulture(era: Era, seed: string, culture?: string): string {
  return EraSuffixGenerator.generateSuffix({ era, seed, culture });
}
