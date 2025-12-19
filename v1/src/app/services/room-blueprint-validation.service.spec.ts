import { TestBed } from '@angular/core/testing';
import { RoomBlueprint } from '../models/room-blueprint.models';
import { RoomBlueprintValidationService } from './room-blueprint-validation.service';
import { HazardType } from '../enums/HazardType';
import { StructureType } from '../enums/StructureType';
import { RoomSocketType } from '../models/room-blueprint.models';

describe('RoomBlueprintValidationService', () => {
  let service: RoomBlueprintValidationService;

  const validBlueprint: RoomBlueprint = {
    id: 'crew_quarters',
    name: 'Crew Quarters',
    purpose: 'Rest space',
    width: 32,
    height: 24,
    hazards: [HazardType.Fire],
    features: ['Sleeping pods', 'Lockers'],
    structureType: StructureType.Barracks,
    sockets: [
      {
        id: 'main_door',
        kind: 'structural',
        position: { x: 16, y: 0 }
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoomBlueprintValidationService],
    });

    service = TestBed.inject(RoomBlueprintValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('validateBlueprint', () => {
    it('should validate a valid blueprint without errors', () => {
      const result = service.validateBlueprint(validBlueprint);
      
      expect(result.blueprintId).toBe(validBlueprint.id);
      expect(result.blueprintName).toBe(validBlueprint.name);
      expect(result.notices.length).toBe(0);
    });

    describe('Identity validation', () => {
      it('should require blueprint id', () => {
        const blueprint = { ...validBlueprint, id: '' };
        const result = service.validateBlueprint(blueprint);
        
        const idError = result.notices.find(notice => 
          notice.path === 'id' && notice.severity === 'error'
        );
        expect(idError).toBeDefined();
        expect(idError?.message).toContain('Blueprint id is required');
      });

      it('should require blueprint name', () => {
        const blueprint = { ...validBlueprint, name: '' };
        const result = service.validateBlueprint(blueprint);
        
        const nameError = result.notices.find(notice => 
          notice.path === 'name' && notice.severity === 'error'
        );
        expect(nameError).toBeDefined();
        expect(nameError?.message).toContain('Room name is required');
      });

      it('should warn about short names', () => {
        const blueprint = { ...validBlueprint, name: 'AB' };
        const result = service.validateBlueprint(blueprint);
        
        const nameWarning = result.notices.find(notice => 
          notice.path === 'name' && notice.severity === 'warning'
        );
        expect(nameWarning).toBeDefined();
        expect(nameWarning?.message).toContain('very short');
      });

      it('should warn about names with whitespace', () => {
        const blueprint = { ...validBlueprint, name: '  Crew Quarters  ' };
        const result = service.validateBlueprint(blueprint);
        
        const whitespaceWarning = result.notices.find(notice => 
          notice.path === 'name' && notice.message.includes('leading or trailing whitespace')
        );
        expect(whitespaceWarning).toBeDefined();
      });

      it('should require purpose', () => {
        const blueprint = { ...validBlueprint, purpose: '' };
        const result = service.validateBlueprint(blueprint);
        
        const purposeError = result.notices.find(notice => 
          notice.path === 'purpose' && notice.severity === 'error'
        );
        expect(purposeError).toBeDefined();
        expect(purposeError?.message).toContain('Room purpose is required');
      });

      it('should warn about purpose with whitespace', () => {
        const blueprint = { ...validBlueprint, purpose: '  Rest space  ' };
        const result = service.validateBlueprint(blueprint);
        
        const purposeWarning = result.notices.find(notice => 
          notice.path === 'purpose' && notice.message.includes('leading or trailing whitespace')
        );
        expect(purposeWarning).toBeDefined();
      });
    });

    describe('Dimension validation', () => {
      it('should require finite width', () => {
        const blueprint = { ...validBlueprint, width: Infinity };
        const result = service.validateBlueprint(blueprint);
        
        const widthError = result.notices.find(notice => 
          notice.path === 'dimensions.width' && notice.severity === 'error'
        );
        expect(widthError).toBeDefined();
        expect(widthError?.message).toContain('must be a finite number');
      });

      it('should require finite height', () => {
        const blueprint = { ...validBlueprint, height: NaN };
        const result = service.validateBlueprint(blueprint);
        
        const heightError = result.notices.find(notice => 
          notice.path === 'dimensions.height' && notice.severity === 'error'
        );
        expect(heightError).toBeDefined();
        expect(heightError?.message).toContain('must be a finite number');
      });

      it('should require integer width', () => {
        const blueprint = { ...validBlueprint, width: 10.5 };
        const result = service.validateBlueprint(blueprint);
        
        const widthError = result.notices.find(notice => 
          notice.path === 'dimensions.width' && notice.message.includes('must be an integer')
        );
        expect(widthError).toBeDefined();
      });

      it('should require integer height', () => {
        const blueprint = { ...validBlueprint, height: 10.5 };
        const result = service.validateBlueprint(blueprint);
        
        const heightError = result.notices.find(notice => 
          notice.path === 'dimensions.height' && notice.message.includes('must be an integer')
        );
        expect(heightError).toBeDefined();
      });

      it('should enforce minimum dimension (16x16)', () => {
        const blueprint = { ...validBlueprint, width: 15, height: 15 };
        const result = service.validateBlueprint(blueprint);
        
        const widthError = result.notices.find(notice => 
          notice.path === 'dimensions.width' && notice.message.includes('below the minimum of 16')
        );
        const heightError = result.notices.find(notice => 
          notice.path === 'dimensions.height' && notice.message.includes('below the minimum of 16')
        );
        expect(widthError).toBeDefined();
        expect(heightError).toBeDefined();
      });

      it('should enforce maximum dimension (512x512)', () => {
        const blueprint = { ...validBlueprint, width: 513, height: 513 };
        const result = service.validateBlueprint(blueprint);
        
        const widthError = result.notices.find(notice => 
          notice.path === 'dimensions.width' && notice.message.includes('exceeds the maximum of 512')
        );
        const heightError = result.notices.find(notice => 
          notice.path === 'dimensions.height' && notice.message.includes('exceeds the maximum of 512')
        );
        expect(widthError).toBeDefined();
        expect(heightError).toBeDefined();
      });

      it('should accept valid dimension boundaries', () => {
        const blueprint = { ...validBlueprint, width: 16, height: 512 };
        const result = service.validateBlueprint(blueprint);
        
        const dimensionErrors = result.notices.filter(notice => 
          notice.path.startsWith('dimensions.')
        );
        expect(dimensionErrors.length).toBe(0);
      });
    });

    describe('Features validation', () => {
      it('should require at least one feature', () => {
        const blueprint = { ...validBlueprint, features: [] };
        const result = service.validateBlueprint(blueprint);
        
        const featuresError = result.notices.find(notice => 
          notice.path === 'features' && notice.severity === 'error'
        );
        expect(featuresError).toBeDefined();
        expect(featuresError?.message).toContain('At least one feature is required');
      });

      it('should warn about empty feature entries', () => {
        const blueprint = { ...validBlueprint, features: ['Valid feature', '', 'Another feature'] };
        const result = service.validateBlueprint(blueprint);
        
        const emptyFeatureWarning = result.notices.find(notice => 
          notice.path === 'features[1]' && notice.severity === 'warning'
        );
        expect(emptyFeatureWarning).toBeDefined();
        expect(emptyFeatureWarning?.message).toContain('Feature entry is empty');
      });

      it('should warn about features with whitespace', () => {
        const blueprint = { ...validBlueprint, features: ['  Feature  ', 'Normal feature'] };
        const result = service.validateBlueprint(blueprint);
        
        const whitespaceWarning = result.notices.find(notice => 
          notice.path === 'features[0]' && notice.message.includes('leading or trailing whitespace')
        );
        expect(whitespaceWarning).toBeDefined();
      });

      it('should error when all features are empty after trimming', () => {
        const blueprint = { ...validBlueprint, features: ['', '  ', '   '] };
        const result = service.validateBlueprint(blueprint);
        
        const allEmptyError = result.notices.find(notice => 
          notice.path === 'features' && notice.message.includes('All feature entries are empty after trimming')
        );
        expect(allEmptyError).toBeDefined();
      });
    });

    describe('Hazards validation', () => {
      it('should warn about duplicate hazards', () => {
        const blueprint = { ...validBlueprint, hazards: [HazardType.Fire, HazardType.Fire] };
        const result = service.validateBlueprint(blueprint);
        
        const duplicateWarning = result.notices.find(notice => 
          notice.path === 'hazards' && notice.severity === 'warning'
        );
        expect(duplicateWarning).toBeDefined();
        expect(duplicateWarning?.message).toContain('listed multiple times');
      });

      it('should validate hazards against provided vocabulary', () => {
        const blueprint = { 
          ...validBlueprint, 
          hazards: ['invalid_hazard'] as any 
        };
        
        const options = {
          hazardVocabulary: [HazardType.Fire, HazardType.Flood] as any
        };
        
        const result = service.validateBlueprint(blueprint, options);
        
        const invalidHazardError = result.notices.find(notice => 
          notice.path === 'hazards[0]' && notice.severity === 'error'
        );
        expect(invalidHazardError).toBeDefined();
        expect(invalidHazardError?.message).toContain('not in the provided hazard vocabulary');
      });
    });

    describe('Sockets validation', () => {
      it('should warn when no sockets are defined', () => {
        const blueprint = { ...validBlueprint, sockets: [] };
        const result = service.validateBlueprint(blueprint);
        
        const noSocketsWarning = result.notices.find(notice => 
          notice.path === 'sockets' && notice.severity === 'warning'
        );
        expect(noSocketsWarning).toBeDefined();
        expect(noSocketsWarning?.message).toContain('No sockets defined');
      });

      it('should require socket id', () => {
        const blueprint = {
          ...validBlueprint,
          sockets: [{
            id: '', // Missing id to trigger validation error
            kind: 'structural',
            position: { x: 5, y: 5 }
          }]
        };
        
        const result = service.validateBlueprint(blueprint);
        
        const socketIdError = result.notices.find(notice => 
          notice.path === 'sockets[0].id' && notice.severity === 'error'
        );
        expect(socketIdError).toBeDefined();
        expect(socketIdError?.message).toContain('Socket id is required');
      });

      it('should require unique socket ids', () => {
        const blueprint = {
          ...validBlueprint,
          sockets: [
            {
              id: 'same_id',
              kind: 'structural',
              position: { x: 5, y: 5 }
            },
            {
              id: 'same_id',
              kind: 'power',
              position: { x: 10, y: 5 }
            }
          ]
        };
        
        const result = service.validateBlueprint(blueprint);
        
        const duplicateSocketError = result.notices.find(notice => 
          notice.path === 'sockets[1].id' && notice.severity === 'error'
        );
        expect(duplicateSocketError).toBeDefined();
        expect(duplicateSocketError?.message).toContain('Socket id "same_id" is duplicated');
      });

      it('should validate socket position bounds', () => {
        const blueprint = {
          ...validBlueprint,
          width: 10,
          height: 10,
          sockets: [
            {
              id: 'out_of_bounds',
              kind: 'structural',
              position: { x: 15, y: 5 } // x is out of bounds
            }
          ]
        };
        
        const result = service.validateBlueprint(blueprint);
        
        const boundsError = result.notices.find(notice => 
          notice.path === 'sockets[0].position.x' && notice.severity === 'error'
        );
        expect(boundsError).toBeDefined();
        expect(boundsError?.message).toContain('lies outside the width bounds');
      });

      it('should validate socket position coordinates', () => {
        const blueprint = {
          ...validBlueprint,
          sockets: [
            {
              id: 'invalid_position',
              kind: 'structural',
              position: { x: NaN, y: 5 } as any
            }
          ]
        };
        
        const result = service.validateBlueprint(blueprint);
        
        const positionError = result.notices.find(notice => 
          notice.path === 'sockets[0].position' && notice.severity === 'error'
        );
        expect(positionError).toBeDefined();
        expect(positionError?.message).toContain('numeric x and y coordinates');
      });

      it('should validate supported socket kinds', () => {
        const blueprint = {
          ...validBlueprint,
          sockets: [
            {
              id: 'test_socket',
              kind: 'unsupported_kind' as any,
              position: { x: 5, y: 5 }
            }
          ]
        };
        
        const options = {
          socketKinds: ['power', 'data', 'structural', 'fluid']
        };
        
        const result = service.validateBlueprint(blueprint, options);
        
        const kindWarning = result.notices.find(notice => 
          notice.path === 'sockets[0].kind' && notice.severity === 'warning'
        );
        expect(kindWarning).toBeDefined();
        expect(kindWarning?.message).toContain('not in the allowed set');
      });

      it('should handle advanced room sockets', () => {
        const blueprint = {
          ...validBlueprint,
          sockets: [
            {
              socketId: 'advanced_socket',
              type: RoomSocketType.Power,
              position: { x: 5, y: 5 },
              orientation: 'north' as any,
              required: true
            }
          ]
        };
        
        const result = service.validateBlueprint(blueprint);
        
        expect(result.notices.length).toBe(0);
      });
    });

    describe('Prerequisites validation', () => {
      it('should validate prerequisite structure', () => {
        const blueprint = {
          ...validBlueprint,
          prerequisites: [
            {
              id: '', // Empty id should error
              description: 'Test prerequisite'
            }
          ]
        };
        
        const result = service.validateBlueprint(blueprint);
        
        const prereqIdError = result.notices.find(notice => 
          notice.path === 'prerequisites[0].id' && notice.severity === 'error'
        );
        expect(prereqIdError).toBeDefined();
        expect(prereqIdError?.message).toContain('Prerequisite id is required');
      });

      it('should validate prerequisite blueprint references', () => {
        const blueprint = {
          ...validBlueprint,
          prerequisites: [
            {
              id: 'prereq_1',
              requiresBlueprintId: 'nonexistent_blueprint' as any,
              description: 'Requires missing blueprint'
            }
          ]
        };
        
        const options = {
          knownBlueprintIds: ['known_blueprint'] as any
        };
        
        const result = service.validateBlueprint(blueprint, options);
        
        const blueprintRefError = result.notices.find(notice => 
          notice.path === 'prerequisites[0].requiresBlueprintId' && notice.severity === 'error'
        );
        expect(blueprintRefError).toBeDefined();
        expect(blueprintRefError?.message).toContain('references missing blueprint');
      });

      it('should validate prerequisite socket references', () => {
        const blueprint = {
          ...validBlueprint,
          prerequisites: [
            {
              id: 'prereq_1',
              requiresSockets: ['nonexistent_socket'] as any
            }
          ]
        };
        
        const result = service.validateBlueprint(blueprint);
        
        const socketRefError = result.notices.find(notice => 
          notice.path === 'prerequisites[0].requiresSockets[0]' && notice.severity === 'error'
        );
        expect(socketRefError).toBeDefined();
        expect(socketRefError?.message).toContain('expects socket "nonexistent_socket" which is not defined');
      });
    });
  });

  describe('validateBlueprints', () => {
    it('should validate multiple blueprints', () => {
      const blueprints = [validBlueprint, { ...validBlueprint, id: 'different_id' }];
      
      const results = service.validateBlueprints(blueprints);
      
      expect(results.length).toBe(2);
      expect(results[0].blueprintId).toBe(blueprints[0].id);
      expect(results[1].blueprintId).toBe(blueprints[1].id);
    });

    it('should detect duplicate blueprint IDs', () => {
      const blueprints = [
        validBlueprint,
        { ...validBlueprint, name: 'Duplicate Name' } // Same ID
      ];
      
      const results = service.validateBlueprints(blueprints);
      
      const duplicateError = results[1].notices.find(notice => 
        notice.path === 'id' && notice.message.includes('Duplicate')
      );
      expect(duplicateError).toBeDefined();
    });

    it('should respect enforceUniqueBlueprintIds option', () => {
      const blueprints = [
        validBlueprint,
        { ...validBlueprint, name: 'Duplicate Name' }
      ];
      
      const options = { enforceUniqueBlueprintIds: false };
      const results = service.validateBlueprints(blueprints, options);
      
      const duplicateError = results[1].notices.find(notice => 
        notice.path === 'id' && notice.message.includes('Duplicate')
      );
      expect(duplicateError).toBeUndefined();
    });
  });

  describe('Deterministic ordering', () => {
    it('should produce consistent notice ordering', () => {
      const blueprint = {
        ...validBlueprint,
        name: '  Test  ',
        purpose: '  Purpose  ',
        features: ['', 'Feature B', 'Feature A']
      };
      
      const result1 = service.validateBlueprint(blueprint);
      const result2 = service.validateBlueprint(blueprint);
      
      const paths1 = result1.notices.map(n => n.path);
      const paths2 = result2.notices.map(n => n.path);
      
      expect(paths1).toEqual(paths2);
      
      // Check severity ordering (errors first, then warnings, then info)
      const severities = result1.notices.map(n => n.severity);
      expect(severities).toEqual(['error', 'warning', 'warning']);
    });
  });

  describe('Edge cases', () => {
    it('should handle blueprints with missing optional properties', () => {
      const minimalBlueprint: RoomBlueprint = {
        id: 'minimal',
        name: 'Minimal',
        purpose: 'Testing',
        width: 16,
        height: 16,
        hazards: [],
        features: ['One feature']
      };
      
      const result = service.validateBlueprint(minimalBlueprint);
      
      expect(result.notices.length).toBe(0);
    });

    it('should handle blueprints with all optional properties', () => {
      const complexBlueprint: RoomBlueprint = {
        ...validBlueprint,
        depth: 2,
        gridUnit: 1.5,
        origin: { x: 5, y: 5 },
        notes: 'Complex blueprint with all properties',
        tags: ['tag1', 'tag2'],
        metadata: {
          author: 'test_author',
          source: 'sdk'
        }
      };
      
      const result = service.validateBlueprint(complexBlueprint);
      
      expect(result.notices.length).toBe(0);
    });

    it('should handle null/undefined arrays gracefully', () => {
      const blueprint = {
        ...validBlueprint,
        hazards: null as any,
        features: undefined as any
      };
      
      const result = service.validateBlueprint(blueprint);
      
      // Should have error for missing features
      const featuresError = result.notices.find(notice => 
        notice.path === 'features' && notice.severity === 'error'
      );
      expect(featuresError).toBeDefined();
    });
  });
});
