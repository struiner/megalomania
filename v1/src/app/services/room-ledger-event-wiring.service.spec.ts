import { TestBed } from '@angular/core/testing';
import { RoomLedgerEventWiringService } from './room-ledger-event-wiring.service';
import {
  RoomLedgerEventType,
  RoomBlueprintCreatedPayload,
  RoomBlueprintUpdatedPayload,
  RoomBlueprintExportedPayload,
  RoomBlueprintDeprecatedPayload,
} from '../models/ledger.models';
import {
  RoomBlueprint,
  RoomBlueprintIdentifier,
  HazardType,
  StructureType,
} from '../models/room-blueprint.models';
import { PlayerID, Hash128 } from '../models/anna-readme.models';

describe('RoomLedgerEventWiringService', () => {
  let service: RoomLedgerEventWiringService;

  const mockPlayerId: PlayerID = 'player_12345';
  const mockBlueprintId: RoomBlueprintIdentifier = {
    id: 'test_blueprint_001',
    version: '1.0.0',
  };

  const mockBlueprint: RoomBlueprint = {
    id: 'test_blueprint_001',
    name: 'Test Workshop',
    purpose: 'manufacturing',
    width: 10,
    height: 8,
    hazards: [HazardType.Fire, HazardType.ToxicSpill],
    features: ['furnace', 'workbench', 'storage'],
    structureType: StructureType.Blacksmith,
    blueprintId: mockBlueprintId,
    version: 1,
    tags: ['crafting', 'metalworking'],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomLedgerEventWiringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('emitBlueprintCreated', () => {
    it('should emit blueprint created event', () => {
      const event = service.emitBlueprintCreated(
        mockBlueprint,
        mockPlayerId,
        'player'
      );

      expect(event.type).toBe(RoomLedgerEventType.BLUEPRINT_CREATED);
      expect(event.description).toContain('Room blueprint created: Test Workshop');
      
      const payload = event.payload as RoomBlueprintCreatedPayload;
      expect(payload.initiatedBy).toBe(mockPlayerId);
      expect(payload.source).toBe('player');
      expect(payload.blueprint).toBeDefined();
      expect(payload.creationNotes).toContain('Blueprint "Test Workshop" created via player');
    });

    it('should include validation hooks when provided', () => {
      const crossPlayerVerification = {
        validators: ['validator1', 'validator2'],
        validationNotes: 'Cross-player validation required',
        expectedHazards: [HazardType.Fire, HazardType.ToxicSpill],
      };

      const event = service.emitBlueprintCreated(
        mockBlueprint,
        mockPlayerId,
        'player',
        { crossPlayerVerification }
      );

      const payload = event.payload as RoomBlueprintCreatedPayload;
      expect(payload.validation).toBeDefined();
      expect(payload.validation?.validators).toEqual(['validator1', 'validator2']);
      expect(payload.validation?.validationNotes).toBe('Cross-player validation required');
    });
  });

  describe('emitBlueprintUpdated', () => {
    it('should emit blueprint updated event', () => {
      const previousHash: Hash128 = 'a1b2c3d4e5f6789012345678901234567890abcd';
      
      const event = service.emitBlueprintUpdated(
        mockBlueprint,
        previousHash,
        mockPlayerId,
        'Added additional ventilation'
      );

      expect(event.type).toBe(RoomLedgerEventType.BLUEPRINT_UPDATED);
      expect(event.description).toContain('Room blueprint updated: Test Workshop');
      
      const payload = event.payload as RoomBlueprintUpdatedPayload;
      expect(payload.initiatedBy).toBe(mockPlayerId);
      expect(payload.previousRevisionHash).toBe(previousHash);
      expect(payload.changeSummary).toBe('Added additional ventilation');
    });
  });

  describe('emitBlueprintExported', () => {
    it('should emit blueprint exported event', () => {
      const exportHash: Hash128 = 'export123456789abcdef';
      
      const event = service.emitBlueprintExported(
        mockBlueprint,
        mockPlayerId,
        'json',
        exportHash,
        'Export for backup'
      );

      expect(event.type).toBe(RoomLedgerEventType.BLUEPRINT_EXPORTED);
      expect(event.description).toContain('Room blueprint exported: Test Workshop');
      
      const payload = event.payload as RoomBlueprintExportedPayload;
      expect(payload.initiatedBy).toBe(mockPlayerId);
      expect(payload.exportFormat).toBe('json');
      expect(payload.exportHash).toBe(exportHash);
      expect(payload.exportNotes).toBe('Export for backup');
    });
  });

  describe('emitBlueprintDeprecated', () => {
    it('should emit blueprint deprecated event', () => {
      const event = service.emitBlueprintDeprecated(
        mockBlueprintId,
        mockPlayerId,
        'superseded',
        'replacement_blueprint_002',
        'Replaced by newer version'
      );

      expect(event.type).toBe(RoomLedgerEventType.BLUEPRINT_DEPRECATED);
      expect(event.description).toContain('Room blueprint deprecated: test_blueprint_001');
      
      const payload = event.payload as RoomBlueprintDeprecatedPayload;
      expect(payload.initiatedBy).toBe(mockPlayerId);
      expect(payload.reason).toBe('superseded');
      expect(payload.replacementBlueprintId).toBe('replacement_blueprint_002');
      expect(payload.deprecationNotes).toContain('deprecated: superseded');
    });
  });

  describe('Validation and ordering rules', () => {
    it('should return ordering rules', () => {
      const rules = service.getOrderingRules();
      
      expect(rules).toBeDefined();
      expect(rules.timestampPrecision).toBe('minute');
      expect(rules.hashAlgorithm).toBe('sha128');
      expect(rules.serializationVersion).toBe('1.0.0');
    });

    it('should validate blueprint for ledger', () => {
      const result = service.validateBlueprintForLedger(mockBlueprint);
      
      expect(result.isValid).toBe(true);
      expect(result.issues).toEqual([]);
    });

    it('should identify invalid blueprints', () => {
      const invalidBlueprint = {
        ...mockBlueprint,
        id: '',
        width: 0,
      };

      const result = service.validateBlueprintForLedger(invalidBlueprint);
      
      expect(result.isValid).toBe(false);
      expect(result.issues.length).toBeGreaterThan(0);
    });
  });

  describe('Error handling', () => {
    it('should throw error when validation hooks are required but not provided', () => {
      expect(() => {
        service.emitBlueprintCreated(
          mockBlueprint,
          mockPlayerId,
          'player',
          { requireValidationHooks: true }
        );
      }).toThrowError('Cross-player verification hooks are required for this event type');
    });

    it('should create valid ledger events with apply and reverse methods', () => {
      const event = service.emitBlueprintCreated(
        mockBlueprint,
        mockPlayerId,
        'player'
      );

      expect(typeof event.apply).toBe('function');
      expect(typeof event.reverse).toBe('function');
      
      expect(() => event.apply()).not.toThrow();
      expect(() => event.reverse()).not.toThrow();
    });
  });
});