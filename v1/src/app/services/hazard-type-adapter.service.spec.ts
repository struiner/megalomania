import { TestBed } from '@angular/core/testing';

import { HazardSeverity } from '../enums/HazardSeverity';
import { HazardType } from '../enums/HazardType';
import { HazardTypeAdapterService } from './hazard-type-adapter.service';

describe('HazardTypeAdapterService', () => {
  let service: HazardTypeAdapterService;

  const expectedSeverity: Record<HazardType, HazardSeverity> = {
    [HazardType.Fire]: HazardSeverity.Critical,
    [HazardType.Flood]: HazardSeverity.Warning,
    [HazardType.Earthquake]: HazardSeverity.Fatal,
    [HazardType.Storm]: HazardSeverity.Warning,
    [HazardType.HarshWinter]: HazardSeverity.Warning,
    [HazardType.BuildingCollapse]: HazardSeverity.Fatal,
    [HazardType.StructuralFailure]: HazardSeverity.Critical,
    [HazardType.Plague]: HazardSeverity.Fatal,
    [HazardType.Epidemic]: HazardSeverity.Critical,
    [HazardType.LivestockDisease]: HazardSeverity.Warning,
    [HazardType.CropFailure]: HazardSeverity.Warning,
    [HazardType.Famine]: HazardSeverity.Fatal,
    [HazardType.Radiation]: HazardSeverity.Fatal,
    [HazardType.ToxicSpill]: HazardSeverity.Critical,
    [HazardType.VentilationFailure]: HazardSeverity.Critical,
    [HazardType.VacuumBreach]: HazardSeverity.Fatal,
    [HazardType.War]: HazardSeverity.Fatal,
    [HazardType.Raid]: HazardSeverity.Critical,
    [HazardType.Intrusion]: HazardSeverity.Warning,
    [HazardType.ContainmentBreach]: HazardSeverity.Critical,
    [HazardType.SocialUnrest]: HazardSeverity.Warning,
    [HazardType.WitchHunt]: HazardSeverity.Warning,
    [HazardType.Electrical]: HazardSeverity.Warning,
    [HazardType.MagicalBacklash]: HazardSeverity.Critical,
    [HazardType.Flooding]: HazardSeverity.Warning,
    [HazardType.VacuumExposure]: HazardSeverity.Fatal,
    [HazardType.HostileFauna]: HazardSeverity.Warning,
    [HazardType.Biohazard]: HazardSeverity.Critical,
    [HazardType.Chemical]: HazardSeverity.Warning,
    [HazardType.ToxicGas]: HazardSeverity.Fatal,
    [HazardType.Vacuum]: HazardSeverity.Fatal,
    [HazardType.Fauna]: HazardSeverity.Warning,
    [HazardType.PressureLoss]: HazardSeverity.Fatal,
  };

  const expectedCategories: Record<HazardType, 'environmental' | 'structural' | 'biological' | 'security'> = {
    [HazardType.Fire]: 'environmental',
    [HazardType.Flood]: 'environmental',
    [HazardType.Earthquake]: 'environmental',
    [HazardType.Storm]: 'environmental',
    [HazardType.HarshWinter]: 'environmental',
    [HazardType.BuildingCollapse]: 'structural',
    [HazardType.StructuralFailure]: 'structural',
    [HazardType.Plague]: 'biological',
    [HazardType.Epidemic]: 'biological',
    [HazardType.LivestockDisease]: 'biological',
    [HazardType.CropFailure]: 'environmental',
    [HazardType.Famine]: 'environmental',
    [HazardType.Radiation]: 'environmental',
    [HazardType.ToxicSpill]: 'environmental',
    [HazardType.VentilationFailure]: 'structural',
    [HazardType.VacuumBreach]: 'environmental',
    [HazardType.War]: 'security',
    [HazardType.Raid]: 'security',
    [HazardType.Intrusion]: 'security',
    [HazardType.ContainmentBreach]: 'security',
    [HazardType.SocialUnrest]: 'security',
    [HazardType.WitchHunt]: 'security',
    [HazardType.Electrical]: 'structural',
    [HazardType.MagicalBacklash]: 'environmental',
    [HazardType.Flooding]: 'environmental',
    [HazardType.VacuumExposure]: 'environmental',
    [HazardType.HostileFauna]: 'biological',
    [HazardType.Biohazard]: 'biological',
    [HazardType.Chemical]: 'environmental',
    [HazardType.ToxicGas]: 'environmental',
    [HazardType.Vacuum]: 'environmental',
    [HazardType.Fauna]: 'biological',
    [HazardType.PressureLoss]: 'environmental',
  };

  const expectedTags: Record<HazardType, string[]> = {
    [HazardType.Fire]: ['urban', 'shipboard', 'workshop'],
    [HazardType.Flood]: ['coastal', 'cavern'],
    [HazardType.Earthquake]: ['tectonic', 'mining'],
    [HazardType.Storm]: ['weather', 'coastal'],
    [HazardType.HarshWinter]: ['climate', 'survival'],
    [HazardType.BuildingCollapse]: ['structural', 'aging'],
    [HazardType.StructuralFailure]: ['aging', 'tremor'],
    [HazardType.Plague]: ['disease', 'overcrowding'],
    [HazardType.Epidemic]: ['disease', 'trade'],
    [HazardType.LivestockDisease]: ['agriculture', 'farming'],
    [HazardType.CropFailure]: ['agriculture', 'farming'],
    [HazardType.Famine]: ['agriculture', 'trade'],
    [HazardType.Radiation]: ['reactor', 'arcane'],
    [HazardType.ToxicSpill]: ['industrial', 'accident'],
    [HazardType.VentilationFailure]: ['underground', 'confined'],
    [HazardType.VacuumBreach]: ['space', 'hull'],
    [HazardType.War]: ['conflict', 'political'],
    [HazardType.Raid]: ['conflict', 'border'],
    [HazardType.Intrusion]: ['boarding', 'siege', 'urban'],
    [HazardType.ContainmentBreach]: ['prison', 'facility'],
    [HazardType.SocialUnrest]: ['political', 'economic'],
    [HazardType.WitchHunt]: ['political', 'religious'],
    [HazardType.Electrical]: ['infrastructure', 'shipboard'],
    [HazardType.MagicalBacklash]: ['arcane', 'experimental'],
    [HazardType.Flooding]: ['coastal', 'weather'],
    [HazardType.VacuumExposure]: ['space', 'pressure'],
    [HazardType.HostileFauna]: ['wilderness', 'untamed'],
    [HazardType.Biohazard]: ['medical', 'research'],
    [HazardType.Chemical]: ['industrial', 'laboratory'],
    [HazardType.ToxicGas]: ['mine', 'laboratory'],
    [HazardType.Vacuum]: ['space', 'pressure'],
    [HazardType.Fauna]: ['wilderness', 'sewers'],
    [HazardType.PressureLoss]: ['hull', 'bulkhead'],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HazardTypeAdapterService]
    });
    service = TestBed.inject(HazardTypeAdapterService);
  });

  it('creates the adapter service', () => {
    expect(service).toBeTruthy();
  });

  it('maps every hazard type to a severity level', () => {
    const optionsById = new Map(
      service.getHazardOptions().map((option) => [option.id, option])
    );

    expect(optionsById.size).toBe(Object.values(HazardType).length);

    Object.values(HazardType).forEach((hazard) => {
      const option = optionsById.get(hazard);
      expect(option?.severity).toBe(expectedSeverity[hazard]);
    });
  });

  it('preserves category and tag mappings for backward compatibility', () => {
    const optionsById = new Map(
      service.getHazardOptions().map((option) => [option.id, option])
    );

    Object.values(HazardType).forEach((hazard) => {
      const option = optionsById.get(hazard);
      expect(option?.category).toBe(expectedCategories[hazard]);
      expect(option?.tags).toEqual(expectedTags[hazard]);
    });
  });
});
