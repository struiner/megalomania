import { HazardType } from '../../enums/HazardType';

export const HAZARD_ENUM_BASELINE: HazardType[] = [
  HazardType.Fire,
  HazardType.Flooding,
  HazardType.Intrusion,
  HazardType.Electrical,
  HazardType.VacuumExposure,
  HazardType.HostileFauna,
  HazardType.StructuralFailure,
  HazardType.Chemical,
  HazardType.Radiation,
  HazardType.Biohazard,
];

export const HAZARD_COMPATIBILITY_PAYLOADS: string[] = [
  'Fire',
  'Flood',
  'Hull breach',
  'Water ingress',
  'Radiation leak',
  'Toxic gas',
  'Fauna',
  'Sabotage',
  'Quarantine',
  'Hull stress',
];

export interface HazardNormalizationFixture {
  input: string[];
  expected: HazardType[];
}

export const HAZARD_NORMALIZATION_FIXTURE: HazardNormalizationFixture = {
  input: HAZARD_COMPATIBILITY_PAYLOADS,
  expected: [
    HazardType.Biohazard,
    HazardType.Chemical,
    HazardType.Fire,
    HazardType.Flooding,
    HazardType.HostileFauna,
    HazardType.Intrusion,
    HazardType.Radiation,
    HazardType.StructuralFailure,
    HazardType.VacuumExposure,
  ],
};
