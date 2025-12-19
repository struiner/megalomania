import { TestBed } from '@angular/core/testing';

import { RoomBlueprintImportExportService } from './room-blueprint-import-export.service';
import { RoomBlueprintValidationService } from './room-blueprint-validation.service';
import {
  VALID_ROOM_BLUEPRINT_FIXTURES,
  INVALID_ROOM_BLUEPRINT_FIXTURES,
  BATCH_IMPORT_TEST_DATA,
  EDGE_CASE_FIXTURES,
  getFixturesByValidationStatus,
  getFixtureByName,
  countExpectedIssues,
} from './room-blueprint-import-export-fixtures';
import {
  RoomBlueprint,
  RoomBlueprintValidationError,
  HazardType,
  StructureType,
  GoodsType,
  RoomSocketType,
  RoomCostPhase,
  RoomConstraintType,
} from '../models/room-blueprint.models';

describe('RoomBlueprintImportExportService', () => {
  let service: RoomBlueprintImportExportService;
  let validationService: RoomBlueprintValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoomBlueprintImportExportService, RoomBlueprintValidationService],
    });
    service = TestBed.inject(RoomBlueprintImportExportService);
    validationService = TestBed.inject(RoomBlueprintValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('importRoomBlueprint', () => {
    describe('Valid blueprints', () => {
      it('should import basic workshop blueprint successfully', () => {
        const fixture = getFixtureByName('Basic Workshop');
        expect(fixture).toBeDefined();
        expect(fixture?.valid).toBe(true);

        const result = service.importRoomBlueprint(fixture!.json);

        expect(result.blueprint).toBeDefined();
        expect(result.blueprint.id).toBe('basic_workshop');
        expect(result.blueprint.name).toBe('Basic Workshop');
        expect(result.blueprint.width).toBe(10);
        expect(result.blueprint.height).toBe(8);
        expect(result.validation.hasErrors).toBe(false);
      });

      it('should import advanced laboratory blueprint with all properties', () => {
        const fixture = getFixtureByName('Advanced Laboratory');
        expect(fixture).toBeDefined();
        expect(fixture?.valid).toBe(true);

        const result = service.importRoomBlueprint(fixture!.json);

        expect(result.blueprint).toBeDefined();
        expect(result.blueprint.id).toBe('advanced_laboratory');
        expect(result.blueprint.blueprintId?.version).toBe('2.1.0');
        expect(result.blueprint.blueprintId?.namespace).toBe('research_facility');
        expect(result.blueprint.width).toBe(16);
        expect(result.blueprint.height).toBe(12);
        expect(result.blueprint.depth).toBe(2);
        expect(result.blueprint.sockets).toBeDefined();
        expect(result.blueprint.sockets?.length).toBe(4);
        expect(result.blueprint.costs).toBeDefined();
        expect(result.blueprint.costs?.length).toBe(4);
        expect(result.blueprint.constraints).toBeDefined();
        expect(result.blueprint.constraints?.length).toBe(2);
        expect(result.validation.hasErrors).toBe(false);
      });

      it('should import crew quarters blueprint successfully', () => {
        const fixture = getFixtureByName('Crew Quarters');
        expect(fixture).toBeDefined();
        expect(fixture?.valid).toBe(true);

        const result = service.importRoomBlueprint(fixture!.json);

        expect(result.blueprint).toBeDefined();
        expect(result.blueprint.id).toBe('crew_quarters_mk1');
        expect(result.blueprint.name).toBe('Crew Quarters Mk I');
        expect(result.blueprint.structureType).toBe(StructureType.Barracks);
        expect(result.blueprint.hazards).toContain(HazardType.Fire);
        expect(result.blueprint.hazards).toContain(HazardType.Intrusion);
        expect(result.validation.hasErrors).toBe(false);
      });

      it('should import minimal room blueprint with only required fields', () => {
        const fixture = getFixtureByName('Minimal Room');
        expect(fixture).toBeDefined();
        expect(fixture?.valid).toBe(true);

        const result = service.importRoomBlueprint(fixture!.json);

        expect(result.blueprint).toBeDefined();
        expect(result.blueprint.id).toBe('minimal_room');
        expect(result.blueprint.name).toBe('Minimal Room');
        expect(result.blueprint.width).toBe(4);
        expect(result.blueprint.height).toBe(4);
        expect(result.blueprint.features).toContain('Empty space');
        expect(result.validation.hasErrors).toBe(false);
      });
    });

    describe('Invalid blueprints', () => {
      it('should reject blueprint with missing required fields', () => {
        const fixture = getFixtureByName('Missing Required Fields');
        expect(fixture).toBeDefined();
        expect(fixture?.valid).toBe(false);

        expect(() => {
          service.importRoomBlueprint(fixture!.json);
        }).toThrow(RoomBlueprintValidationError);

        try {
          service.importRoomBlueprint(fixture!.json);
        } catch (error) {
          expect(error).toBeInstanceOf(RoomBlueprintValidationError);
          const validationError = error as RoomBlueprintValidationError;
          expect(validationError.summary.hasErrors).toBe(true);
          expect(validationError.summary.issues.length).toBeGreaterThan(0);
        }
      });

      it('should reject blueprint with invalid dimensions', () => {
        const fixture = getFixtureByName('Invalid Dimensions');
        expect(fixture).toBeDefined();
        expect(fixture?.valid).toBe(false);

        expect(() => {
          service.importRoomBlueprint(fixture!.json);
        }).toThrow(RoomBlueprintValidationError);

        try {
          service.importRoomBlueprint(fixture!.json);
        } catch (error) {
          expect(error).toBeInstanceOf(RoomBlueprintValidationError);
          const validationError = error as RoomBlueprintValidationError;
          expect(validationError.summary.hasErrors).toBe(true);
          expect(validationError.summary.issues.some(issue => 
            issue.message.includes('negative') || issue.message.includes('too large')
          )).toBe(true);
        }
      });

      it('should reject blueprint with invalid hazard types', () => {
        const fixture = getFixtureByName('Invalid Hazard Types');
        expect(fixture).toBeDefined();
        expect(fixture?.valid).toBe(false);

        expect(() => {
          service.importRoomBlueprint(fixture!.json);
        }).toThrow(RoomBlueprintValidationError);

        try {
          service.importRoomBlueprint(fixture!.json);
        } catch (error) {
          expect(error).toBeInstanceOf(RoomBlueprintValidationError);
          const validationError = error as RoomBlueprintValidationError;
          expect(validationError.summary.hasErrors).toBe(true);
          expect(validationError.summary.issues.some(issue => 
            issue.message.includes('hazard vocabulary')
          )).toBe(true);
        }
      });

      it('should reject blueprint with empty features array', () => {
        const fixture = getFixtureByName('Empty Features Array');
        expect(fixture).toBeDefined();
        expect(fixture?.valid).toBe(false);

        expect(() => {
          service.importRoomBlueprint(fixture!.json);
        }).toThrow(RoomBlueprintValidationError);

        try {
          service.importRoomBlueprint(fixture!.json);
        } catch (error) {
          expect(error).toBeInstanceOf(RoomBlueprintValidationError);
          const validationError = error as RoomBlueprintValidationError;
          expect(validationError.summary.hasErrors).toBe(true);
          expect(validationError.summary.issues.some(issue => 
            issue.message.includes('feature') && issue.severity === 'error'
          )).toBe(true);
        }
      });

      it('should reject blueprint with invalid socket configuration', () => {
        const fixture = getFixtureByName('Invalid Socket Configuration');
        expect(fixture).toBeDefined();
        expect(fixture?.valid).toBe(false);

        expect(() => {
          service.importRoomBlueprint(fixture!.json);
        }).toThrow(RoomBlueprintValidationError);

        try {
          service.importRoomBlueprint(fixture!.json);
        } catch (error) {
          expect(error).toBeInstanceOf(RoomBlueprintValidationError);
          const validationError = error as RoomBlueprintValidationError;
          expect(validationError.summary.hasErrors).toBe(true);
          expect(validationError.summary.issues.some(issue => 
            issue.message.includes('Socket') && issue.severity === 'error'
          )).toBe(true);
        }
      });

      it('should reject blueprint with invalid cost data', () => {
        const fixture = getFixtureByName('Invalid Cost Data');
        expect(fixture).toBeDefined();
        expect(fixture?.valid).toBe(false);

        expect(() => {
          service.importRoomBlueprint(fixture!.json);
        }).toThrow(RoomBlueprintValidationError);

        try {
          service.importRoomBlueprint(fixture!.json);
        } catch (error) {
          expect(error).toBeInstanceOf(RoomBlueprintValidationError);
          const validationError = error as RoomBlueprintValidationError;
          expect(validationError.summary.hasErrors).toBe(true);
        }
      });

      it('should handle whitespace validation as warnings, not errors', () => {
        const fixture = getFixtureByName('Whitespace Validation');
        expect(fixture).toBeDefined();
        expect(fixture?.valid).toBe(false);

        const result = service.importRoomBlueprint(fixture!.json);

        expect(result.validation.hasErrors).toBe(false);
        expect(result.validation.issues.length).toBeGreaterThan(0);
        expect(result.validation.issues.every(issue => issue.severity === 'warning')).toBe(true);
      });
    });

    describe('Hazard normalization', () => {
      it('should deduplicate hazards when deduplicateHazards is true', () => {
        const blueprintWithDuplicates = JSON.stringify({
          id: 'duplicate_hazards',
          name: 'Duplicate Hazards Room',
          purpose: 'Testing deduplication',
          width: 8,
          height: 6,
          hazards: ['fire', 'electrical', 'fire', 'electrical', 'fire'],
          features: ['Duplicated hazards']
        });

        const result = service.importRoomBlueprint(blueprintWithDuplicates, {
          deduplicateHazards: true
        });

        expect(result.blueprint.hazards).toEqual(['electrical', 'fire']);
        expect(result.blueprint.hazards.length).toBe(2);
      });

      it('should preserve duplicate hazards when deduplicateHazards is false', () => {
        const blueprintWithDuplicates = JSON.stringify({
          id: 'duplicate_hazards',
          name: 'Duplicate Hazards Room',
          purpose: 'Testing deduplication',
          width: 8,
          height: 6,
          hazards: ['fire', 'electrical', 'fire'],
          features: ['Duplicated hazards']
        });

        const result = service.importRoomBlueprint(blueprintWithDuplicates, {
          deduplicateHazards: false
        });

        expect(result.blueprint.hazards).toEqual(['fire', 'electrical', 'fire']);
        expect(result.blueprint.hazards.length).toBe(3);
      });
    });
  });

  describe('exportRoomBlueprint', () => {
    it('should export blueprint to valid JSON', () => {
      const blueprint: RoomBlueprint = {
        id: 'test_export',
        name: 'Test Export',
        purpose: 'Testing export functionality',
        width: 10,
        height: 8,
        hazards: [HazardType.Fire, HazardType.Electrical],
        features: ['Test feature 1', 'Test feature 2'],
        tags: ['test', 'export']
      };

      const result = service.exportRoomBlueprint(blueprint);

      expect(result.json).toBeDefined();
      expect(result.json).toContain('"id": "test_export"');
      expect(result.json).toContain('"name": "Test Export"');
      expect(result.json).toContain('"width": 10');
      expect(result.json).toContain('"height": 8');
      expect(result.validation.hasErrors).toBe(false);
    });

    it('should reject invalid blueprint during export', () => {
      const invalidBlueprint = {
        // Missing required fields
        id: '',
        name: '',
        purpose: '',
        width: 10,
        height: 8,
        hazards: [],
        features: []
      } as unknown as RoomBlueprint;

      expect(() => {
        service.exportRoomBlueprint(invalidBlueprint);
      }).toThrow(RoomBlueprintValidationError);
    });

    it('should produce deterministic JSON output', () => {
      const blueprint: RoomBlueprint = {
        id: 'deterministic_test',
        name: 'Deterministic Test',
        purpose: 'Testing deterministic export',
        width: 12,
        height: 10,
        hazards: [HazardType.Fire, HazardType.Electrical, HazardType.Flood],
        features: ['Feature A', 'Feature B', 'Feature C'],
        tags: ['tag3', 'tag1', 'tag2']
      };

      const result1 = service.exportRoomBlueprint(blueprint);
      const result2 = service.exportRoomBlueprint(blueprint);

      expect(result1.json).toBe(result2.json);
    });

    it('should order hazards deterministically', () => {
      const blueprint: RoomBlueprint = {
        id: 'hazard_ordering_test',
        name: 'Hazard Ordering Test',
        purpose: 'Testing hazard ordering',
        width: 8,
        height: 6,
        hazards: [HazardType.Fire, HazardType.Electrical, HazardType.Flood],
        features: ['Test features']
      };

      const result = service.exportRoomBlueprint(blueprint);

      const parsed = JSON.parse(result.json);
      // Hazards should be sorted alphabetically
      expect(parsed.hazards).toEqual(['electrical', 'fire', 'flood']);
    });
  });

  describe('Batch operations', () => {
    it('should import multiple blueprints from JSON array', () => {
      const results = service.importRoomBlueprints(BATCH_IMPORT_TEST_DATA.valid.json);

      expect(results).toBeDefined();
      expect(results.length).toBe(2);
      expect(results[0].blueprint.id).toBe('batch_room_1');
      expect(results[1].blueprint.id).toBe('batch_room_2');
      expect(results.every(result => !result.validation.hasErrors)).toBe(true);
    });

    it('should handle mixed valid/invalid blueprints in batch import', () => {
      const results = service.importRoomBlueprints(BATCH_IMPORT_TEST_DATA.mixed.json);

      expect(results).toBeDefined();
      expect(results.length).toBe(3);
      
      // First and third should be valid
      expect(results[0].validation.hasErrors).toBe(false);
      expect(results[2].validation.hasErrors).toBe(false);
      
      // Second should be invalid (missing ID)
      expect(results[1].validation.hasErrors).toBe(true);
    });

    it('should export multiple blueprints to JSON array', () => {
      const blueprints: RoomBlueprint[] = [
        {
          id: 'batch_1',
          name: 'Batch Room 1',
          purpose: 'First room',
          width: 8,
          height: 6,
          hazards: [],
          features: ['Feature 1']
        },
        {
          id: 'batch_2',
          name: 'Batch Room 2',
          purpose: 'Second room',
          width: 10,
          height: 8,
          hazards: [HazardType.Fire],
          features: ['Feature 2']
        }
      ];

      const jsonArray = service.exportRoomBlueprints(blueprints);

      expect(jsonArray).toBeDefined();
      expect(jsonArray).toContain('"id": "batch_1"');
      expect(jsonArray).toContain('"id": "batch_2"');
    });
  });

  describe('Migration hooks', () => {
    it('should handle blueprint version migration', () => {
      const oldBlueprint = {
        id: 'migration_test',
        name: 'Migration Test',
        purpose: 'Testing migration',
        width: 8,
        height: 6,
        hazards: ['fire'],
        features: ['Old format'],
        version: '0.9.0'
      };

      const result = service.migrateBlueprintIfNeeded(oldBlueprint, '1.0.0');

      expect(result.migrated).toBe(true);
      expect(result.appliedMigrations).toContain('migrate_0_9_0_to_1_0_0');
      expect(result.blueprint.version).toBe('1.0.0');
    });

    it('should not migrate when already at target version', () => {
      const currentBlueprint = {
        id: 'current_version',
        name: 'Current Version',
        purpose: 'Testing no migration',
        width: 8,
        height: 6,
        hazards: [],
        features: ['Current features'],
        version: '1.0.0'
      };

      const result = service.migrateBlueprintIfNeeded(currentBlueprint, '1.0.0');

      expect(result.migrated).toBe(false);
      expect(result.appliedMigrations.length).toBe(0);
    });
  });

  describe('Error handling', () => {
    it('should handle invalid JSON during import', () => {
      const invalidJson = '{ invalid json string }';

      expect(() => {
        service.importRoomBlueprint(invalidJson);
      }).toThrow(RoomBlueprintValidationError);

      try {
        service.importRoomBlueprint(invalidJson);
      } catch (error) {
        expect(error).toBeInstanceOf(RoomBlueprintValidationError);
        const validationError = error as RoomBlueprintValidationError;
        expect(validationError.summary.issues[0].path).toBe('root');
        expect(validationError.summary.issues[0].severity).toBe('error');
      }
    });

    it('should handle non-array input for batch import', () => {
      const nonArrayJson = JSON.stringify({
        id: 'single_object',
        name: 'Not an array',
        purpose: 'Testing non-array handling',
        width: 8,
        height: 6,
        hazards: [],
        features: ['Single']
      });

      expect(() => {
        service.importRoomBlueprints(nonArrayJson);
      }).toThrow('Expected JSON array for batch import');
    });

    it('should handle malformed JSON during parsing', () => {
      const malformedJson = '{"incomplete": "json"';

      expect(() => {
        service.importRoomBlueprint(malformedJson);
      }).toThrow();
    });
  });

  describe('Deterministic ordering', () => {
    it('should order tags lexicographically', () => {
      const blueprint: RoomBlueprint = {
        id: 'tag_ordering',
        name: 'Tag Ordering Test',
        purpose: 'Testing tag ordering',
        width: 8,
        height: 6,
        hazards: [],
        features: ['Test'],
        tags: ['zebra', 'apple', 'middle', 'beginning']
      };

      const result = service.exportRoomBlueprint(blueprint);
      const parsed = JSON.parse(result.json);

      expect(parsed.tags).toEqual(['apple', 'beginning', 'middle', 'zebra']);
    });

    it('should order sockets by position', () => {
      const blueprint: RoomBlueprint = {
        id: 'socket_ordering',
        name: 'Socket Ordering Test',
        purpose: 'Testing socket ordering',
        width: 20,
        height: 15,
        hazards: [],
        features: ['Test'],
        sockets: [
          {
            id: 'socket_bottom_right',
            kind: 'power',
            position: { x: 19, y: 14 }
          },
          {
            id: 'socket_top_left',
            kind: 'data',
            position: { x: 0, y: 0 }
          },
          {
            id: 'socket_middle',
            kind: 'structural',
            position: { x: 10, y: 7 }
          }
        ]
      };

      const result = service.exportRoomBlueprint(blueprint);
      const parsed = JSON.parse(result.json);

      expect(parsed.sockets[0].id).toBe('socket_top_left');
      expect(parsed.sockets[1].id).toBe('socket_middle');
      expect(parsed.sockets[2].id).toBe('socket_bottom_right');
    });

    it('should order costs by resource ID then phase', () => {
      const blueprint: RoomBlueprint = {
        id: 'cost_ordering',
        name: 'Cost Ordering Test',
        purpose: 'Testing cost ordering',
        width: 8,
        height: 6,
        hazards: [],
        features: ['Test'],
        costs: [
          { resourceId: GoodsType.Wood, amount: 10, phase: RoomCostPhase.Build },
          { resourceId: GoodsType.Steel, amount: 5, phase: RoomCostPhase.Build },
          { resourceId: GoodsType.Steel, amount: 2, phase: RoomCostPhase.Maintenance },
          { resourceId: GoodsType.Wood, amount: 3, phase: RoomCostPhase.Maintenance }
        ]
      };

      const result = service.exportRoomBlueprint(blueprint);
      const parsed = JSON.parse(result.json);

      expect(parsed.costs[0].resourceId).toBe('wood');
      expect(parsed.costs[0].phase).toBe('build');
      expect(parsed.costs[1].resourceId).toBe('wood');
      expect(parsed.costs[1].phase).toBe('maintenance');
      expect(parsed.costs[2].resourceId).toBe('steel');
      expect(parsed.costs[2].phase).toBe('build');
      expect(parsed.costs[3].resourceId).toBe('steel');
      expect(parsed.costs[3].phase).toBe('maintenance');
    });
  });

  describe('Edge cases', () => {
    EDGE_CASE_FIXTURES.forEach(fixture => {
      it(`should handle ${fixture.name}`, () => {
        if (fixture.valid) {
          const result = service.importRoomBlueprint(fixture.json);
          expect(result.validation.hasErrors).toBe(false);
        } else {
          expect(() => {
            service.importRoomBlueprint(fixture.json);
          }).toThrow(RoomBlueprintValidationError);
        }
      });
    });
  });
});