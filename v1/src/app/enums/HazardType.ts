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
  MagicalBacklash = 'magical_backlash'
}
