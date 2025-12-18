import { TestBed } from '@angular/core/testing';
import { Biome } from '../enums/Biome';
import { HazardType } from '../enums/HazardType';
import { SettlementType } from '../enums/SettlementType';
import { StructureType } from '../enums/StructureType';
import { RoomBlueprint } from '../models/room-blueprint.model';
import { RoomWorldContextValidationService } from './room-world-context-validation.service';

const buildBlueprint = (overrides: Partial<RoomBlueprint> = {}): RoomBlueprint => ({
  name: 'Test room',
  width: 10,
  height: 10,
  purpose: 'Crew space',
  hazards: [HazardType.Fire],
  features: 'Test fixtures',
  ...overrides,
});

describe('RoomWorldContextValidationService', () => {
  let service: RoomWorldContextValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoomWorldContextValidationService],
    });

    service = TestBed.inject(RoomWorldContextValidationService);
  });

  it('flags coastal structures that are placed away from water biomes', () => {
    const blueprint = buildBlueprint({ hazards: [HazardType.Flood] });
    const context = {
      biome: Biome.Desert,
      settlementType: SettlementType.TradeHub,
      structureType: StructureType.Harbor,
    };

    const result = service.validatePlacement(blueprint, context);

    expect(result.notices.some((notice) => notice.code === 'structure-biome-mismatch')).toBeTrue();
  });

  it('warns when vacuum mitigation is requested outside sealed settlements and biomes', () => {
    const blueprint = buildBlueprint({ hazards: [HazardType.Vacuum] });
    const context = {
      biome: Biome.Grassland,
      settlementType: SettlementType.Hamlet,
    };

    const result = service.validatePlacement(blueprint, context);

    const codes = result.notices.map((notice) => notice.code);
    expect(codes).toContain('hazard-settlement-vacuum');
    expect(codes).toContain('hazard-biome-vacuum');
  });

  it('limits oversized rooms for small settlements', () => {
    const oversized = buildBlueprint({ width: 40, height: 12, hazards: [] });
    const context = {
      biome: Biome.Forest,
      settlementType: SettlementType.Hamlet,
    };

    const result = service.validatePlacement(oversized, context);

    expect(result.notices.map((notice) => notice.code)).toContain('room-size-out-of-scale');
  });

  it('remains deterministic for identical inputs', () => {
    const blueprint = buildBlueprint({ hazards: [HazardType.Flood, HazardType.Intrusion] });
    const context = {
      biome: Biome.Desert,
      settlementType: SettlementType.Fortress,
      structureType: StructureType.Docks,
    };

    const first = service.validatePlacement(blueprint, context);
    const second = service.validatePlacement(blueprint, context);

    expect(first).toEqual(second);
  });
});
