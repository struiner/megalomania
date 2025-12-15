import { BiomeType } from '../enums/BiomeType';

export type BiomeDefinition = {
  type: BiomeType;
  name: string;
  climate: string;
  notes: string;
};

export const BIOME_DEFINITIONS: Record<BiomeType, BiomeDefinition> = {
  [BiomeType.Ocean]: {
    type: BiomeType.Ocean,
    name: 'Open Ocean',
    climate: 'Deep saltwater with shifting currents and little direct sunlight.',
    notes: 'Controls climate and trade routes; storms originate over these waters.',
  },
  [BiomeType.Water]: {
    type: BiomeType.Water,
    name: 'Freshwater',
    climate: 'Rivers, lakes, and wetlands with steady moisture and seasonal flow.',
    notes: 'Supports transport networks, early settlements, and fishing enclaves.',
  },
  [BiomeType.Beach]: {
    type: BiomeType.Beach,
    name: 'Beach',
    climate: 'Sandy shoreline where salt spray and tides meet coastal winds.',
    notes: 'Gateway between sea and land; ideal for harbors and saltworks.',
  },
  [BiomeType.Alpine]: {
    type: BiomeType.Alpine,
    name: 'High Alpine',
    climate: 'Cold, thin air above the tree line with strong sun and snow cover.',
    notes: 'Natural barriers that channel travel through specific passes.',
  },
  [BiomeType.AlpineGrassland]: {
    type: BiomeType.AlpineGrassland,
    name: 'Alpine Grassland',
    climate: 'Windy plateaus and meadows below peaks with cool, bright days.',
    notes: 'Summer pastures for nomads; excellent vantage points for watchposts.',
  },
  [BiomeType.Taiga]: {
    type: BiomeType.Taiga,
    name: 'Taiga',
    climate: 'Cold forests with long winters, acidic soils, and slow decay.',
    notes: 'Vast timber reserves but slow farming; fuels resin and fur trades.',
  },
  [BiomeType.Desert]: {
    type: BiomeType.Desert,
    name: 'Desert',
    climate: 'Arid heat with scarce water, intense sun, and sudden night chills.',
    notes: 'Caravan hubs cluster at oases; wind shapes dunes and travel lanes.',
  },
  [BiomeType.Rainforest]: {
    type: BiomeType.Rainforest,
    name: 'Rainforest',
    climate: 'Humid, rain-heavy canopies with layered shade and constant growth.',
    notes: 'Abundant biomass and rare materials; travel is slow without clearings.',
  },
  [BiomeType.Grassland]: {
    type: BiomeType.Grassland,
    name: 'Grassland',
    climate: 'Open plains with fertile soils, steady rainfall, and broad skies.',
    notes: 'Prime farmland and pasture; rapid road-building and settlement growth.',
  },
  [BiomeType.Woodland]: {
    type: BiomeType.Woodland,
    name: 'Woodland',
    climate: 'Mixed open woods with moderate rain and warm summers.',
    notes: 'Balanced resource mix: timber, forage, and hunting grounds.',
  },
  [BiomeType.Forest]: {
    type: BiomeType.Forest,
    name: 'Temperate Forest',
    climate: 'Dense canopy with rich soils, cool shade, and seasonal rains.',
    notes: 'Excellent wood supply and wildlife; requires clearing for farmland.',
  },
};
