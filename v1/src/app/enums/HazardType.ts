export enum HazardType {
  Fire = 'Fire',
  Flood = 'Flood',
  Electrical = 'Electrical',
  Intrusion = 'Intrusion',
  ToxicGas = 'ToxicGas',
  Vacuum = 'Vacuum',
  StructuralFailure = 'StructuralFailure',
  Fauna = 'Fauna',
}

export const HAZARD_DISPLAY_ORDER: readonly HazardType[] = [
  HazardType.Fire,
  HazardType.Flood,
  HazardType.Electrical,
  HazardType.Intrusion,
  HazardType.ToxicGas,
  HazardType.Vacuum,
  HazardType.StructuralFailure,
  HazardType.Fauna,
];
