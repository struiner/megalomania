import { BiomeType } from '../enums/BiomeType';
import { FloraType } from '../enums/FloraType';
import { FloraUseType } from '../enums/FloraUseType';

export interface FloraProfile {
  id: string;
  name: string;
  biomes: BiomeType[];
  presence: number;
  clusterSize: [number, number];
  note: string;
}

export const FLORA_PROFILES: FloraProfile[] = [
  {
    id: 'wildflowers',
    name: 'Wildflower Carpets',
    biomes: [BiomeType.Grassland, BiomeType.Woodland],
    presence: 0.36,
    clusterSize: [3, 10],
    note: 'Seasonal blooms that track rainfall and seed pollinator routes.',
  },
  {
    id: 'reed_beds',
    name: 'Reed Beds',
    biomes: [BiomeType.Water, BiomeType.Beach],
    presence: 0.3,
    clusterSize: [4, 12],
    note: 'Thick wetlands that anchor river mouths and filter sediments.',
  },
  {
    id: 'mangroves',
    name: 'Mangrove Clusters',
    biomes: [BiomeType.Beach, BiomeType.Water, BiomeType.Rainforest],
    presence: 0.26,
    clusterSize: [2, 6],
    note: 'Root tangles stabilizing tidelines and sheltering coastal nurseries.',
  },
  {
    id: 'lichen',
    name: 'Tundra Lichen',
    biomes: [BiomeType.Taiga, BiomeType.Alpine, BiomeType.AlpineGrassland],
    presence: 0.32,
    clusterSize: [4, 14],
    note: 'Hardy mats that creep across stone and feed cold-adapted herds.',
  },
  {
    id: 'mushrooms',
    name: 'Fungal Rings',
    biomes: [BiomeType.Forest, BiomeType.Woodland, BiomeType.Rainforest],
    presence: 0.28,
    clusterSize: [3, 9],
    note: 'Mycelial blooms marking decayed trunks and ley-touched soil.',
  },
  {
    id: 'succulents',
    name: 'Desert Succulents',
    biomes: [BiomeType.Desert],
    presence: 0.22,
    clusterSize: [2, 7],
    note: 'Water-hoarding blooms clustering along shadowed dune faces.',
  },
  {
    id: 'algae',
    name: 'Tidal Algae',
    biomes: [BiomeType.Ocean, BiomeType.Water],
    presence: 0.34,
    clusterSize: [6, 16],
    note: 'Kelp forests and slicks that tint sheltered coves.',
  },
  {
    id: 'orchids',
    name: 'Canopy Orchids',
    biomes: [BiomeType.Rainforest],
    presence: 0.24,
    clusterSize: [2, 5],
    note: 'Epiphytes tethered to high boughs near persistent mist.',
  },
  {
    id: 'heather',
    name: 'Heath & Heather',
    biomes: [BiomeType.Grassland, BiomeType.Taiga],
    presence: 0.29,
    clusterSize: [3, 11],
    note: 'Low shrubs that blanket wind-shorn ridges and brighten moors.',
  },
  {
    id: 'water_lilies',
    name: 'Water Lilies',
    biomes: [BiomeType.Water, BiomeType.Beach, BiomeType.Rainforest],
    presence: 0.27,
    clusterSize: [4, 10],
    note: 'Broad leaves that shade shallows and signal still, fresh water.',
  },
];

export interface FloraMetadata {
  id: FloraType;
  biome: BiomeType;
  uses: FloraUseType[];
  description: string;
}

export const FLORA_METADATA: Partial<Record<FloraType, FloraMetadata>> = {
  [FloraType.WaterLily]: {
    id: FloraType.WaterLily,
    biome: BiomeType.Water,
    uses: [FloraUseType.Food, FloraUseType.Ritual, FloraUseType.Water],
    description: 'Floating leaves and tubers harvested for starch and ceremonial offerings.',
  },
  [FloraType.Reeds]: {
    id: FloraType.Reeds,
    biome: BiomeType.Beach,
    uses: [FloraUseType.Construction, FloraUseType.Material, FloraUseType.Fodder],
    description: 'Flexible stalks used for thatching, baskets, and livestock bedding near wetlands.',
  },
  [FloraType.Lichen]: {
    id: FloraType.Lichen,
    biome: BiomeType.Alpine,
    uses: [FloraUseType.Fodder, FloraUseType.Fertilizer, FloraUseType.Medicine],
    description: 'Crusty mats that hold soil on bare rock and feed cold-adapted herds.',
  },
  [FloraType.Arrowhead]: {
    id: FloraType.Arrowhead,
    biome: BiomeType.Water,
    uses: [FloraUseType.Food, FloraUseType.Trade],
    description: 'Marsh tubers dug from shallows, traded dried or roasted for festivals.',
  },
  [FloraType.SeaOats]: {
    id: FloraType.SeaOats,
    biome: BiomeType.Beach,
    uses: [FloraUseType.Construction, FloraUseType.Fuel, FloraUseType.Water],
    description: 'Salt-tolerant stalks that stabilize shorelines and yield dense, slow-burning thatch.',
  },
  [FloraType.SaguaroCactus]: {
    id: FloraType.SaguaroCactus,
    biome: BiomeType.Desert,
    uses: [FloraUseType.Water, FloraUseType.Food, FloraUseType.Ritual],
    description: 'Towering cacti storing emergency water, fruit, and ritual dyes in arid basins.',
  },
  [FloraType.Edelweiss]: {
    id: FloraType.Edelweiss,
    biome: BiomeType.AlpineGrassland,
    uses: [FloraUseType.Ritual, FloraUseType.Medicine],
    description: 'Rare alpine blossoms prized as omens of safe passage and brewed in tonics.',
  },
  [FloraType.BeachGrass]: {
    id: FloraType.BeachGrass,
    biome: BiomeType.Beach,
    uses: [FloraUseType.Fertilizer, FloraUseType.Construction],
    description: 'Dune-binding grasses that reduce erosion and provide fiber for cordage.',
  },
  [FloraType.Spruce]: {
    id: FloraType.Spruce,
    biome: BiomeType.Taiga,
    uses: [FloraUseType.Construction, FloraUseType.Fuel, FloraUseType.Medicine],
    description: 'Straight trunks and resin that anchor taiga building, pitch, and teas.',
  },
  [FloraType.BrownAlgae]: {
    id: FloraType.BrownAlgae,
    biome: BiomeType.Ocean,
    uses: [FloraUseType.Fertilizer, FloraUseType.Food, FloraUseType.Industry],
    description: 'Seaweeds dried for salts, broth, and soil conditioning along cold shores.',
  },
};
