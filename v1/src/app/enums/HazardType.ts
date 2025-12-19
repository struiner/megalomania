import { BiomeType } from './BiomeType';
import { HazardSeverity } from './HazardSeverity';

export enum HazardType {
  // Environmental and structural
  Fire = 'fire',
  Flood = 'flood',
  Earthquake = 'earthquake',
  Storm = 'storm',
  HarshWinter = 'harsh_winter',
  BuildingCollapse = 'building_collapse',
  StructuralFailure = 'structural_failure',

  // Biological and ecological
  Plague = 'plague',
  Epidemic = 'epidemic',
  LivestockDisease = 'livestock_disease',
  CropFailure = 'crop_failure',

  // Resource and survival
  Famine = 'famine',
  Radiation = 'radiation',
  ToxicSpill = 'toxic_spill',
  VentilationFailure = 'ventilation_failure',
  VacuumBreach = 'vacuum_breach',

  // Security and conflict
  War = 'war',
  Raid = 'raid',
  Intrusion = 'intrusion',
  ContainmentBreach = 'containment_breach',
  SocialUnrest = 'social_unrest',
  WitchHunt = 'witch_hunt',

  // Techno-magical
  Electrical = 'electrical',
  MagicalBacklash = 'magical_backlash',

  // Additional hazard types
  Flooding = 'flooding',
  VacuumExposure = 'vacuum_exposure',
  HostileFauna = 'hostile_fauna',
  Biohazard = 'biohazard',
  Chemical = 'chemical',
  ToxicGas = 'toxic_gas',
  Vacuum = 'vacuum',
  Fauna = 'fauna',
  PressureLoss = 'pressure_loss'
}

type HazardCategory = 'environmental' | 'structural' | 'biological' | 'security';

export interface HazardDefinition {
  type: HazardType;
  label: string;
  category: HazardCategory;
  severity: HazardSeverity;
  biomes: BiomeType[];
  tags: string[];
}

/**
 * Canonical hazard metadata keyed by {@link HazardType}. Severity and biome tags
 * allow simulation and validation services to pre-filter hazards for a room or
 * settlement context without losing backward compatibility with serialized enum
 * values. Future hazard simulators can rank risks by {@link HazardSeverity} and
 * world-context validators can short-circuit invalid biome combinations by reading
 * {@link HazardDefinition.biomes}.
 */
export const HAZARD_DEFINITIONS: Record<HazardType, HazardDefinition> = {
  [HazardType.Fire]: definition(
    HazardType.Fire,
    'environmental',
    HazardSeverity.High,
    [BiomeType.Forest, BiomeType.Woodland, BiomeType.Grassland, BiomeType.Desert],
    ['urban', 'shipboard', 'workshop'],
  ),
  [HazardType.Flood]: definition(
    HazardType.Flood,
    'environmental',
    HazardSeverity.High,
    [BiomeType.Water, BiomeType.Beach, BiomeType.Rainforest, BiomeType.Grassland],
    ['coastal', 'cavern'],
  ),
  [HazardType.Earthquake]: definition(
    HazardType.Earthquake,
    'environmental',
    HazardSeverity.High,
    [BiomeType.Alpine, BiomeType.AlpineGrassland, BiomeType.Taiga],
    ['tectonic', 'mining'],
  ),
  [HazardType.Storm]: definition(
    HazardType.Storm,
    'environmental',
    HazardSeverity.Moderate,
    [BiomeType.Ocean, BiomeType.Water, BiomeType.Beach, BiomeType.Grassland],
    ['weather', 'coastal'],
  ),
  [HazardType.HarshWinter]: definition(
    HazardType.HarshWinter,
    'environmental',
    HazardSeverity.High,
    [BiomeType.Alpine, BiomeType.AlpineGrassland, BiomeType.Taiga],
    ['climate', 'survival'],
  ),
  [HazardType.BuildingCollapse]: definition(
    HazardType.BuildingCollapse,
    'structural',
    HazardSeverity.High,
    [BiomeType.Grassland, BiomeType.Woodland, BiomeType.Forest],
    ['structural', 'aging'],
  ),
  [HazardType.StructuralFailure]: definition(
    HazardType.StructuralFailure,
    'structural',
    HazardSeverity.High,
    [BiomeType.Grassland, BiomeType.Woodland],
    ['aging', 'tremor'],
  ),
  [HazardType.Plague]: definition(
    HazardType.Plague,
    'biological',
    HazardSeverity.High,
    [BiomeType.Grassland, BiomeType.Woodland, BiomeType.Forest],
    ['disease', 'overcrowding'],
  ),
  [HazardType.Epidemic]: definition(
    HazardType.Epidemic,
    'biological',
    HazardSeverity.High,
    [BiomeType.Grassland, BiomeType.Woodland, BiomeType.Forest],
    ['disease', 'trade'],
  ),
  [HazardType.LivestockDisease]: definition(
    HazardType.LivestockDisease,
    'biological',
    HazardSeverity.Moderate,
    [BiomeType.Grassland, BiomeType.Woodland],
    ['agriculture', 'farming'],
  ),
  [HazardType.CropFailure]: definition(
    HazardType.CropFailure,
    'environmental',
    HazardSeverity.Moderate,
    [BiomeType.Grassland, BiomeType.Woodland, BiomeType.Desert],
    ['agriculture', 'farming'],
  ),
  [HazardType.Famine]: definition(
    HazardType.Famine,
    'environmental',
    HazardSeverity.Critical,
    [BiomeType.Desert, BiomeType.Grassland, BiomeType.Woodland],
    ['agriculture', 'trade'],
  ),
  [HazardType.Radiation]: definition(
    HazardType.Radiation,
    'environmental',
    HazardSeverity.Critical,
    [BiomeType.Alpine, BiomeType.Desert, BiomeType.Grassland],
    ['reactor', 'arcane'],
  ),
  [HazardType.ToxicSpill]: definition(
    HazardType.ToxicSpill,
    'environmental',
    HazardSeverity.High,
    [BiomeType.Grassland, BiomeType.Woodland, BiomeType.Desert],
    ['industrial', 'accident'],
  ),
  [HazardType.VentilationFailure]: definition(
    HazardType.VentilationFailure,
    'structural',
    HazardSeverity.Moderate,
    [BiomeType.Alpine, BiomeType.Taiga],
    ['underground', 'confined'],
  ),
  [HazardType.VacuumBreach]: definition(
    HazardType.VacuumBreach,
    'environmental',
    HazardSeverity.Critical,
    [BiomeType.Alpine, BiomeType.AlpineGrassland],
    ['space', 'hull'],
  ),
  [HazardType.War]: definition(
    HazardType.War,
    'security',
    HazardSeverity.Critical,
    [BiomeType.Grassland, BiomeType.Woodland, BiomeType.Forest, BiomeType.Desert, BiomeType.Taiga],
    ['conflict', 'political'],
  ),
  [HazardType.Raid]: definition(
    HazardType.Raid,
    'security',
    HazardSeverity.Moderate,
    [BiomeType.Grassland, BiomeType.Woodland, BiomeType.Forest, BiomeType.Desert],
    ['conflict', 'border'],
  ),
  [HazardType.Intrusion]: definition(
    HazardType.Intrusion,
    'security',
    HazardSeverity.Moderate,
    [BiomeType.Grassland, BiomeType.Woodland, BiomeType.Forest],
    ['boarding', 'siege', 'urban'],
  ),
  [HazardType.ContainmentBreach]: definition(
    HazardType.ContainmentBreach,
    'security',
    HazardSeverity.High,
    [BiomeType.Grassland, BiomeType.Woodland],
    ['prison', 'facility'],
  ),
  [HazardType.SocialUnrest]: definition(
    HazardType.SocialUnrest,
    'security',
    HazardSeverity.Moderate,
    [BiomeType.Grassland, BiomeType.Woodland, BiomeType.Forest],
    ['political', 'economic'],
  ),
  [HazardType.WitchHunt]: definition(
    HazardType.WitchHunt,
    'security',
    HazardSeverity.Moderate,
    [BiomeType.Woodland, BiomeType.Forest],
    ['political', 'religious'],
  ),
  [HazardType.Electrical]: definition(
    HazardType.Electrical,
    'structural',
    HazardSeverity.Moderate,
    [BiomeType.Grassland, BiomeType.Woodland],
    ['infrastructure', 'shipboard'],
  ),
  [HazardType.MagicalBacklash]: definition(
    HazardType.MagicalBacklash,
    'environmental',
    HazardSeverity.High,
    [BiomeType.Rainforest, BiomeType.Alpine],
    ['arcane', 'experimental'],
  ),
  [HazardType.Flooding]: definition(
    HazardType.Flooding,
    'environmental',
    HazardSeverity.Moderate,
    [BiomeType.Water, BiomeType.Beach, BiomeType.Rainforest],
    ['coastal', 'weather'],
  ),
  [HazardType.VacuumExposure]: definition(
    HazardType.VacuumExposure,
    'environmental',
    HazardSeverity.Critical,
    [BiomeType.Alpine, BiomeType.AlpineGrassland],
    ['space', 'pressure'],
  ),
  [HazardType.HostileFauna]: definition(
    HazardType.HostileFauna,
    'biological',
    HazardSeverity.Moderate,
    [BiomeType.Forest, BiomeType.Woodland, BiomeType.Grassland, BiomeType.Taiga, BiomeType.Rainforest],
    ['wilderness', 'untamed'],
  ),
  [HazardType.Biohazard]: definition(
    HazardType.Biohazard,
    'biological',
    HazardSeverity.High,
    [BiomeType.Rainforest, BiomeType.Forest, BiomeType.Woodland],
    ['medical', 'research'],
  ),
  [HazardType.Chemical]: definition(
    HazardType.Chemical,
    'environmental',
    HazardSeverity.High,
    [BiomeType.Grassland, BiomeType.Woodland, BiomeType.Desert],
    ['industrial', 'laboratory'],
  ),
  [HazardType.ToxicGas]: definition(
    HazardType.ToxicGas,
    'environmental',
    HazardSeverity.High,
    [BiomeType.Taiga, BiomeType.Alpine, BiomeType.Forest],
    ['mine', 'laboratory'],
  ),
  [HazardType.Vacuum]: definition(
    HazardType.Vacuum,
    'environmental',
    HazardSeverity.Critical,
    [BiomeType.Alpine, BiomeType.AlpineGrassland],
    ['space', 'pressure'],
  ),
  [HazardType.Fauna]: definition(
    HazardType.Fauna,
    'biological',
    HazardSeverity.Moderate,
    [BiomeType.Forest, BiomeType.Woodland, BiomeType.Grassland],
    ['wilderness', 'sewers'],
  ),
  [HazardType.PressureLoss]: definition(
    HazardType.PressureLoss,
    'environmental',
    HazardSeverity.Critical,
    [BiomeType.Alpine, BiomeType.AlpineGrassland],
    ['hull', 'bulkhead'],
  ),
};

export const HAZARD_DISPLAY_ORDER: readonly HazardType[] = [
  HazardType.Fire,
  HazardType.Flood,
  HazardType.Electrical,
  HazardType.Intrusion,
  HazardType.ToxicGas,
  HazardType.VacuumExposure,
  HazardType.StructuralFailure,
  HazardType.HostileFauna,
];

function definition(
  type: HazardType,
  category: HazardCategory,
  severity: HazardSeverity,
  biomes: BiomeType[],
  tags: string[],
): HazardDefinition {
  return {
    type,
    label: formatLabel(type),
    category,
    severity,
    biomes,
    tags,
  };
}

function formatLabel(raw: string): string {
  return raw
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
