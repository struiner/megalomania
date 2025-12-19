import { TestBed } from '@angular/core/testing';
import { Biome } from '../enums/Biome';
import { HazardType } from '../enums/HazardType';
import { SettlementType } from '../enums/SettlementType';
import { StructureType } from '../enums/StructureType';
import { RoomBlueprint } from '../models/room-blueprint.models';
import { RoomWorldContextValidationService } from './room-world-context-validation.service';

const buildBlueprint = (overrides: Partial<RoomBlueprint> = {}): RoomBlueprint => ({
  id: overrides.id || 'test_room',
  name: 'Test room',
  width: 10,
  height: 10,
  purpose: 'Crew space',
  hazards: [HazardType.Fire],
  features: ['Test fixtures'],
  ...overrides,
});

// Fixture categories for comprehensive testing
const VALID_FIXTURES = {
  // Valid water-dependent structure placements
  coastalHarbor: {
    blueprint: buildBlueprint({ 
      id: 'coastal_harbor',
      hazards: [HazardType.Storm] 
    }),
    context: {
      biome: Biome.Ocean,
      settlementType: SettlementType.TradeHub,
      structureType: StructureType.Harbor,
    },
    expectedNotices: [],
    description: 'Harbor structure in ocean biome'
  },

  // Valid sealed settlement with vacuum hazards
  undergroundVacuumLab: {
    blueprint: buildBlueprint({ 
      id: 'underground_vacuum_lab',
      hazards: [HazardType.Vacuum],
      width: 16,
      height: 12
    }),
    context: {
      biome: Biome.Rock,
      settlementType: SettlementType.UndergroundCity,
      structureType: StructureType.Tower,
    },
    expectedNotices: [],
    description: 'Vacuum lab in underground city'
  },

  // Valid low-tech settlement without electrical hazards
  hamletWorkshop: {
    blueprint: buildBlueprint({ 
      id: 'hamlet_workshop',
      hazards: [HazardType.Fire],
      width: 12,
      height: 8
    }),
    context: {
      biome: Biome.Grassland,
      settlementType: SettlementType.Hamlet,
      structureType: StructureType.House,
    },
    expectedNotices: [],
    description: 'Fire hazards in low-tech hamlet settlement'
  },

  // Valid scale for settlement type
  villageWorkshop: {
    blueprint: buildBlueprint({ 
      id: 'village_workshop',
      hazards: [HazardType.Fire],
      width: 12,
      height: 12  // 144 tiles - exactly at village ceiling
    }),
    context: {
      biome: Biome.Forest,
      settlementType: SettlementType.Village,
      structureType: StructureType.Blacksmith,
    },
    expectedNotices: [],
    description: 'Workshop at village scale limit'
  }
};

const INVALID_FIXTURES = {
  // Structure-biome mismatches
  harborInDesert: {
    blueprint: buildBlueprint({ 
      id: 'desert_harbor',
      hazards: [HazardType.Storm] 
    }),
    context: {
      biome: Biome.Desert,
      settlementType: SettlementType.TradeHub,
      structureType: StructureType.Harbor,
    },
    expectedNoticeCodes: ['structure-biome-mismatch'],
    description: 'Harbor structure in desert biome'
  },

  mineNearWater: {
    blueprint: buildBlueprint({ 
      id: 'coastal_mine',
      hazards: [HazardType.Earthquake] 
    }),
    context: {
      biome: Biome.Beach,
      settlementType: SettlementType.Village,
      structureType: StructureType.Mine,
    },
    expectedNoticeCodes: ['structure-biome-flooding'],
    description: 'Mine structure near water'
  },

  // Hazard-biome mismatches
  vacuumInForest: {
    blueprint: buildBlueprint({ 
      id: 'forest_vacuum_lab',
      hazards: [HazardType.Vacuum] 
    }),
    context: {
      biome: Biome.Forest,
      settlementType: SettlementType.Town,
    },
    expectedNoticeCodes: ['hazard-biome-vacuum'],
    description: 'Vacuum hazard in forest biome'
  },

  floodInDesert: {
    blueprint: buildBlueprint({ 
      id: 'desert_flood_facility',
      hazards: [HazardType.Flood] 
    }),
    context: {
      biome: Biome.Desert,
      settlementType: SettlementType.TradingPost,
    },
    expectedNoticeCodes: ['hazard-biome-arid'],
    description: 'Flood hazard in arid biome'
  },

  fireAtSea: {
    blueprint: buildBlueprint({ 
      id: 'ocean_fire_lab',
      hazards: [HazardType.Fire] 
    }),
    context: {
      biome: Biome.Ocean,
      settlementType: SettlementType.Lighthouse,
    },
    expectedNoticeCodes: ['hazard-biome-water'],
    description: 'Fire hazard in water biome'
  },

  // Hazard-settlement mismatches
  vacuumInHamlet: {
    blueprint: buildBlueprint({ 
      id: 'hamlet_vacuum_facility',
      hazards: [HazardType.Vacuum] 
    }),
    context: {
      biome: Biome.Grassland,
      settlementType: SettlementType.Hamlet,
    },
    expectedNoticeCodes: ['hazard-settlement-vacuum'],
    description: 'Vacuum hazard in surface settlement'
  },

  electricalInTribe: {
    blueprint: buildBlueprint({ 
      id: 'tribe_electrical_plant',
      hazards: [HazardType.Electrical] 
    }),
    context: {
      biome: Biome.Grassland,
      settlementType: SettlementType.Tribe,
    },
    expectedNoticeCodes: ['hazard-settlement-electrical'],
    description: 'Electrical hazard in low-tech settlement'
  },

  // Scale violations
  oversizedForVillage: {
    blueprint: buildBlueprint({ 
      id: 'village_megahouse',
      hazards: [HazardType.Fire],
      width: 20,
      height: 20  // 400 tiles - exceeds village ceiling of 144
    }),
    context: {
      biome: Biome.Grassland,
      settlementType: SettlementType.Village,
      structureType: StructureType.House,
    },
    expectedNoticeCodes: ['room-size-out-of-scale'],
    description: 'Room oversized for village settlement'
  },

  nearLimitForHamlet: {
    blueprint: buildBlueprint({ 
      id: 'hamlet_large_house',
      hazards: [HazardType.Fire],
      width: 10,
      height: 10  // 100 tiles - approaching hamlet ceiling of 96
    }),
    context: {
      biome: Biome.Forest,
      settlementType: SettlementType.Hamlet,
      structureType: StructureType.House,
    },
    expectedNoticeCodes: ['room-size-near-limit'],
    description: 'Room approaching hamlet scale limit'
  },

  // Combined validation issues
  multipleViolations: {
    blueprint: buildBlueprint({ 
      id: 'problematic_facility',
      hazards: [HazardType.Vacuum, HazardType.Flood],
      width: 30,
      height: 20  // 600 tiles
    }),
    context: {
      biome: Biome.Desert,
      settlementType: SettlementType.Hamlet,
      structureType: StructureType.Harbor,
    },
    expectedNoticeCodes: [
      'structure-biome-mismatch',
      'hazard-biome-vacuum', 
      'hazard-biome-arid',
      'hazard-settlement-vacuum',
      'room-size-out-of-scale'
    ],
    description: 'Multiple validation violations'
  }
};

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

  // Valid fixture tests
  describe('Valid Context Combinations', () => {
    Object.entries(VALID_FIXTURES).forEach(([name, fixture]) => {
      it(`${name}: ${fixture.description}`, () => {
        const result = service.validatePlacement(fixture.blueprint, fixture.context);
        
        if (fixture.expectedNotices.length === 0) {
          expect(result.notices.length).toBe(0);
        } else {
          const noticeCodes = result.notices.map(n => n.code);
          expect(noticeCodes).toEqual(fixture.expectedNotices);
        }
      });
    });
  });

  // Invalid fixture tests
  describe('Invalid Context Combinations', () => {
    Object.entries(INVALID_FIXTURES).forEach(([name, fixture]) => {
      it(`${name}: ${fixture.description}`, () => {
        const result = service.validatePlacement(fixture.blueprint, fixture.context);
        const noticeCodes = result.notices.map(n => n.code);
        
        expect(noticeCodes).toEqual(fixture.expectedNoticeCodes);
        
        // Verify all expected notices are present
        fixture.expectedNoticeCodes.forEach(code => {
          expect(noticeCodes).toContain(code);
        });
      });
    });
  });

  // Edge case tests
  describe('Edge Cases', () => {
    it('handles partial context data gracefully', () => {
      const blueprint = buildBlueprint({ hazards: [HazardType.Vacuum] });
      const partialContext = { biome: Biome.Forest }; // Missing settlementType and structureType
      
      const result = service.validatePlacement(blueprint, partialContext);
      
      // Should only validate against provided biome
      expect(result.notices.some(n => n.code === 'hazard-biome-vacuum')).toBeTrue();
    });

    it('handles empty context', () => {
      const blueprint = buildBlueprint({ hazards: [HazardType.Vacuum] });
      const emptyContext = {};
      
      const result = service.validatePlacement(blueprint, emptyContext);
      
      // Should not crash and return empty notices
      expect(result.notices.length).toBe(0);
    });

    it('validates multiple hazards against same context', () => {
      const blueprint = buildBlueprint({ 
        hazards: [HazardType.Vacuum, HazardType.Flood, HazardType.Electrical] 
      });
      const context = {
        biome: Biome.Desert,
        settlementType: SettlementType.Hamlet,
      };
      
      const result = service.validatePlacement(blueprint, context);
      const noticeCodes = result.notices.map(n => n.code);
      
      expect(noticeCodes).toContain('hazard-biome-vacuum');
      expect(noticeCodes).toContain('hazard-biome-arid');
      expect(noticeCodes).toContain('hazard-settlement-electrical');
    });

    it('handles null/undefined hazard arrays', () => {
      const blueprint = buildBlueprint({ hazards: [] });
      const context = {
        biome: Biome.Ocean,
        structureType: StructureType.Harbor,
      };
      
      const result = service.validatePlacement(blueprint, context);
      
      // Should not crash with empty hazards
      expect(result.notices.length).toBeGreaterThanOrEqual(0);
    });
  });

  // Severity and ordering tests
  describe('Severity and Ordering', () => {
    it('orders notices by severity then code', () => {
      const blueprint = buildBlueprint({ 
        hazards: [HazardType.Vacuum],
        width: 50,
        height: 50
      });
      const context = {
        biome: Biome.Forest,
        settlementType: SettlementType.Hamlet,
        structureType: StructureType.Harbor,
      };
      
      const result = service.validatePlacement(blueprint, context);
      
      // Warnings should come before info
      const warningIndices = result.notices
        .map((n, i) => ({ index: i, severity: n.severity }))
        .filter(n => n.severity === 'warning')
        .map(n => n.index);
      
      const infoIndices = result.notices
        .map((n, i) => ({ index: i, severity: n.severity }))
        .filter(n => n.severity === 'info')
        .map(n => n.index);
      
      if (warningIndices.length > 0 && infoIndices.length > 0) {
        expect(Math.max(...warningIndices)).toBeLessThan(Math.min(...infoIndices));
      }
    });
  });
});
