import { BiomeType } from '../enums/BiomeType';

export interface FaunaProfile {
  id: string;
  name: string;
  biomes: BiomeType[];
  presence: number;
  groupSize: [number, number];
  note: string;
}

export const FAUNA_PROFILES: FaunaProfile[] = [
  {
    id: 'caribou',
    name: 'Caribou Herds',
    biomes: [BiomeType.AlpineGrassland, BiomeType.Taiga],
    presence: 0.24,
    groupSize: [6, 18],
    note: 'Migratory grazers that favor cool slopes and sheltered tundra basins.',
  },
  {
    id: 'snow_leopard',
    name: 'Snow Leopards',
    biomes: [BiomeType.Alpine, BiomeType.AlpineGrassland],
    presence: 0.12,
    groupSize: [1, 2],
    note: 'Solitary apex hunters patrolling crags and high ridges.',
  },
  {
    id: 'fox',
    name: 'Fox Packs',
    biomes: [BiomeType.Forest, BiomeType.Woodland, BiomeType.Grassland],
    presence: 0.32,
    groupSize: [2, 6],
    note: 'Foragers shadowing settlements and berry thickets.',
  },
  {
    id: 'boar',
    name: 'Boar Sounders',
    biomes: [BiomeType.Forest, BiomeType.Woodland],
    presence: 0.28,
    groupSize: [3, 9],
    note: 'Rooting omnivores that tear up forest clearings after rain.',
  },
  {
    id: 'ibis',
    name: 'Ibis Flocks',
    biomes: [BiomeType.Beach, BiomeType.Water, BiomeType.Ocean],
    presence: 0.3,
    groupSize: [5, 14],
    note: 'Shoreline waders clustering around tidal flats and marshy bogs.',
  },
  {
    id: 'jackal',
    name: 'Jackals',
    biomes: [BiomeType.Desert, BiomeType.Grassland],
    presence: 0.22,
    groupSize: [2, 5],
    note: 'Heat-adapted scavengers haunting dunes and caravan roads.',
  },
  {
    id: 'parrots',
    name: 'Rainforest Parrots',
    biomes: [BiomeType.Rainforest],
    presence: 0.34,
    groupSize: [4, 16],
    note: 'Vibrant canopy dwellers that mirror magical anomaly blooms.',
  },
  {
    id: 'termite',
    name: 'Termite Swarms',
    biomes: [BiomeType.Woodland, BiomeType.Rainforest, BiomeType.Grassland],
    presence: 0.18,
    groupSize: [20, 50],
    note: 'Bio-architects building vents and undermining soft soils.',
  },
  {
    id: 'deer',
    name: 'Stag Herds',
    biomes: [BiomeType.Forest, BiomeType.Woodland, BiomeType.Grassland],
    presence: 0.38,
    groupSize: [4, 12],
    note: 'Browsers drawn to meadow edges near water and low walls.',
  },
  {
    id: 'camel',
    name: 'Dune Camels',
    biomes: [BiomeType.Desert],
    presence: 0.16,
    groupSize: [3, 8],
    note: 'Caravan-ready beasts that cache water near fault ridges.',
  },
];
