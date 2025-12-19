import {
  RoomLedgerEvent,
  RoomLedgerEventType,
  RoomBlueprintCreatedPayload,
  RoomBlueprintUpdatedPayload,
  RoomBlueprintAppliedPayload,
  RoomBlueprintExportedPayload,
  RoomBlueprintDeprecatedPayload,
  RoomConstructionStartedPayload,
  RoomConstructionCompletedPayload,
  RoomConstructionCancelledPayload,
} from '../models/ledger.models';
import {
  RoomBlueprint,
  RoomBlueprintIdentifier,
  RoomConstructionSite,
  RoomBlueprintApplicationTarget,
  HazardType,
  StructureType,
  ROOM_BLUEPRINT_FIXTURES,
} from '../models/room-blueprint.models';
import { PlayerID, Hash128, ChunkCoord } from '../models/anna-readme.models';

/**
 * Sample fixtures demonstrating valid ledger events for room blueprints.
 * These fixtures serve as examples and can be used for testing and documentation.
 */

export interface SampleLedgerEventFixture {
  name: string;
  description: string;
  event: RoomLedgerEvent;
  blueprint: RoomBlueprint;
  expectedHash: string;
}

export const SAMPLE_PLAYER_IDS: PlayerID[] = [
  'player_founder_001',
  'player_builder_002', 
  'player_architect_003',
  'player_validator_004',
  'system_automated',
];

export const SAMPLE_EXPORT_FORMATS: ('json' | 'binary' | 'yaml')[] = ['json', 'binary', 'yaml'];

export const SAMPLE_CONSTRUCTION_REASONS: ('player_cancelled' | 'supply_shortage' | 'validation_failed' | 'hazard_conflict' | 'other')[] = [
  'player_cancelled',
  'supply_shortage',
  'validation_failed', 
  'hazard_conflict',
  'other'
];

export const SAMPLE_DEPRECATION_REASONS: ('superseded' | 'invalidated' | 'withdrawn')[] = [
  'superseded',
  'invalidated', 
  'withdrawn'
];

/**
 * Creates a blueprint created event fixture
 */
export function createBlueprintCreatedFixture(
  blueprint: RoomBlueprint = ROOM_BLUEPRINT_FIXTURES[0],
  playerId: PlayerID = SAMPLE_PLAYER_IDS[0],
  source: 'player' | 'imported' | 'generated' = 'player'
): SampleLedgerEventFixture {
  const timestamp = new Date('2025-12-19T16:30:00.000Z').toISOString();
  
  const payload: RoomBlueprintCreatedPayload = {
    blueprint: {
      identity: {
        blueprintId: blueprint.id,
        revision: 1,
        blueprintHash: 'a1b2c3d4e5f6789012345678901234567890abcd' as Hash128,
      },
      structureType: blueprint.structureType,
      footprint: {
        width: blueprint.width,
        height: blueprint.height,
      },
      hazards: blueprint.hazards as HazardType[],
      purpose: blueprint.purpose,
      tags: blueprint.tags,
    },
    initiatedBy: playerId,
    minuteTimestampIso: timestamp,
    source,
    creationNotes: `Blueprint "${blueprint.name}" created via ${source}`,
    validation: {
      validators: [SAMPLE_PLAYER_IDS[3]],
      expectedHazards: blueprint.hazards as HazardType[],
      validationNotes: 'Initial validation completed',
    },
  };

  const event: RoomLedgerEvent = {
    type: RoomLedgerEventType.BLUEPRINT_CREATED,
    description: `Room blueprint created: ${blueprint.name}`,
    payload,
    resourceDelta: {},
    apply: () => console.log(`Applying ${RoomLedgerEventType.BLUEPRINT_CREATED}: ${blueprint.name}`),
    reverse: () => console.log(`Reversing ${RoomLedgerEventType.BLUEPRINT_CREATED}: ${blueprint.name}`),
  };

  return {
    name: 'Blueprint Created Event',
    description: `Demonstrates creation of blueprint "${blueprint.name}" by ${playerId}`,
    event,
    blueprint,
    expectedHash: 'blueprint_created_hash_123',
  };
}

/**
 * Creates a blueprint updated event fixture
 */
export function createBlueprintUpdatedFixture(
  blueprint: RoomBlueprint = ROOM_BLUEPRINT_FIXTURES[0],
  playerId: PlayerID = SAMPLE_PLAYER_IDS[1],
  changeSummary: string = 'Added enhanced ventilation system'
): SampleLedgerEventFixture {
  const timestamp = new Date('2025-12-19T16:31:00.000Z').toISOString();
  
  const payload: RoomBlueprintUpdatedPayload = {
    blueprint: {
      identity: {
        blueprintId: blueprint.id,
        revision: 2,
        blueprintHash: 'b2c3d4e5f6789012345678901234567890abcdef',
      },
      structureType: blueprint.structureType,
      footprint: {
        width: blueprint.width,
        height: blueprint.height,
      },
      hazards: blueprint.hazards as HazardType[],
      purpose: blueprint.purpose,
      tags: blueprint.tags,
    },
    initiatedBy: playerId,
    minuteTimestampIso: timestamp,
    previousRevisionHash: 'a1b2c3d4e5f6789012345678901234567890abcd',
    changeSummary,
    validation: {
      validators: [SAMPLE_PLAYER_IDS[3], SAMPLE_PLAYER_IDS[0]],
      expectedHazards: blueprint.hazards as HazardType[],
      validationNotes: 'Cross-player validation for safety improvements',
    },
  };

  const event: RoomLedgerEvent = {
    type: RoomLedgerEventType.BLUEPRINT_UPDATED,
    description: `Room blueprint updated: ${blueprint.name}`,
    payload,
    resourceDelta: {},
    apply: () => console.log(`Applying ${RoomLedgerEventType.BLUEPRINT_UPDATED}: ${blueprint.name}`),
    reverse: () => console.log(`Reversing ${RoomLedgerEventType.BLUEPRINT_UPDATED}: ${blueprint.name}`),
  };

  return {
    name: 'Blueprint Updated Event',
    description: `Demonstrates update to blueprint "${blueprint.name}" with enhanced ventilation`,
    event,
    blueprint,
    expectedHash: 'blueprint_updated_hash_456',
  };
}

/**
 * Creates a blueprint exported event fixture
 */
export function createBlueprintExportedFixture(
  blueprint: RoomBlueprint = ROOM_BLUEPRINT_FIXTURES[0],
  playerId: PlayerID = SAMPLE_PLAYER_IDS[2],
  exportFormat: 'json' | 'binary' | 'yaml' = 'json',
  exportHash: Hash128 = 'export_hash_789abcdef'
): SampleLedgerEventFixture {
  const timestamp = new Date('2025-12-19T16:32:00.000Z').toISOString();
  
  const payload: RoomBlueprintExportedPayload = {
    blueprint: {
      identity: {
        blueprintId: blueprint.id,
        revision: 2,
        blueprintHash: 'b2c3d4e5f6789012345678901234567890abcdef',
      },
      structureType: blueprint.structureType,
      footprint: {
        width: blueprint.width,
        height: blueprint.height,
      },
      hazards: blueprint.hazards as HazardType[],
      purpose: blueprint.purpose,
      tags: blueprint.tags,
    },
    initiatedBy: playerId,
    minuteTimestampIso: timestamp,
    exportFormat,
    exportHash,
    exportNotes: `Exported blueprint "${blueprint.name}" as ${exportFormat} for backup`,
    validation: {
      validators: [SAMPLE_PLAYER_IDS[3]],
      expectedHazards: blueprint.hazards as HazardType[],
      validationNotes: 'Export validation completed',
    },
  };

  const event: RoomLedgerEvent = {
    type: RoomLedgerEventType.BLUEPRINT_EXPORTED,
    description: `Room blueprint exported: ${blueprint.name}`,
    payload,
    resourceDelta: {},
    apply: () => console.log(`Applying ${RoomLedgerEventType.BLUEPRINT_EXPORTED}: ${blueprint.name}`),
    reverse: () => console.log(`Reversing ${RoomLedgerEventType.BLUEPRINT_EXPORTED}: ${blueprint.name}`),
  };

  return {
    name: 'Blueprint Exported Event',
    description: `Demonstrates export of blueprint "${blueprint.name}" in ${exportFormat} format`,
    event,
    blueprint,
    expectedHash: 'blueprint_exported_hash_789',
  };
}

/**
 * Creates a blueprint deprecated event fixture
 */
export function createBlueprintDeprecatedFixture(
  blueprintId: RoomBlueprintIdentifier = { id: 'legacy_blueprint_001', version: '1.0.0' },
  playerId: PlayerID = SAMPLE_PLAYER_IDS[0],
  reason: 'superseded' | 'invalidated' | 'withdrawn' = 'superseded',
  replacementBlueprintId?: string
): SampleLedgerEventFixture {
  const timestamp = new Date('2025-12-19T16:33:00.000Z').toISOString();
  
  const payload: RoomBlueprintDeprecatedPayload = {
    blueprint: {
      identity: {
        blueprintId: blueprintId.id,
        revision: 1,
        blueprintHash: 'deprecated_hash_legacy',
      },
      structureType: StructureType.House,
      footprint: {
        width: 5,
        height: 5,
      },
      hazards: [],
      purpose: 'legacy',
      tags: ['deprecated'],
    },
    initiatedBy: playerId,
    minuteTimestampIso: timestamp,
    reason,
    replacementBlueprintId,
    deprecationNotes: `Blueprint "${blueprintId.id}" deprecated: ${reason}${replacementBlueprintId ? `, replaced by ${replacementBlueprintId}` : ''}`,
  };

  const event: RoomLedgerEvent = {
    type: RoomLedgerEventType.BLUEPRINT_DEPRECATED,
    description: `Room blueprint deprecated: ${blueprintId.id}`,
    payload,
    resourceDelta: {},
    apply: () => console.log(`Applying ${RoomLedgerEventType.BLUEPRINT_DEPRECATED}: ${blueprintId.id}`),
    reverse: () => console.log(`Reversing ${RoomLedgerEventType.BLUEPRINT_DEPRECATED}: ${blueprintId.id}`),
  };

  const blueprint: RoomBlueprint = {
    id: blueprintId.id,
    name: 'Legacy Blueprint',
    purpose: 'legacy',
    width: 5,
    height: 5,
    hazards: [],
    features: ['legacy_feature'],
    structureType: StructureType.House,
    blueprintId,
    version: 1,
    tags: ['deprecated'],
  };

  return {
    name: 'Blueprint Deprecated Event',
    description: `Demonstrates deprecation of blueprint "${blueprintId.id}" due to ${reason}`,
    event,
    blueprint,
    expectedHash: 'blueprint_deprecated_hash_abc',
  };
}

/**
 * Creates a blueprint applied event fixture
 */
export function createBlueprintAppliedFixture(
  blueprint: RoomBlueprint = ROOM_BLUEPRINT_FIXTURES[0],
  playerId: PlayerID = SAMPLE_PLAYER_IDS[1],
  applicationId: string = 'app_2025_001',
  applicationTarget: RoomBlueprintApplicationTarget = {
    structureId: 'structure_main_complex',
    chunkCoord: { x: 150, y: 200 } as ChunkCoord,
    roomLabel: 'Crew Quarters Section A',
  }
): SampleLedgerEventFixture {
  const timestamp = new Date('2025-12-19T16:34:00.000Z').toISOString();
  
  const payload: RoomBlueprintAppliedPayload = {
    blueprint: {
      identity: {
        blueprintId: blueprint.id,
        revision: 2,
        blueprintHash: 'b2c3d4e5f6789012345678901234567890abcdef',
      },
      structureType: blueprint.structureType,
      footprint: {
        width: blueprint.width,
        height: blueprint.height,
      },
      hazards: blueprint.hazards as HazardType[],
      purpose: blueprint.purpose,
      tags: blueprint.tags,
    },
    initiatedBy: playerId,
    minuteTimestampIso: timestamp,
    applicationId,
    target: applicationTarget,
    applicationProof: 'application_proof_def456',
    validation: {
      validators: [SAMPLE_PLAYER_IDS[3], SAMPLE_PLAYER_IDS[0]],
      expectedHazards: blueprint.hazards as HazardType[],
      validationNotes: 'Multi-player validation for construction placement',
    },
  };

  const event: RoomLedgerEvent = {
    type: RoomLedgerEventType.BLUEPRINT_APPLIED,
    description: `Room blueprint applied: ${blueprint.name}`,
    payload,
    resourceDelta: {},
    apply: () => console.log(`Applying ${RoomLedgerEventType.BLUEPRINT_APPLIED}: ${blueprint.name}`),
    reverse: () => console.log(`Reversing ${RoomLedgerEventType.BLUEPRINT_APPLIED}: ${blueprint.name}`),
  };

  return {
    name: 'Blueprint Applied Event',
    description: `Demonstrates application of blueprint "${blueprint.name}" for construction`,
    event,
    blueprint,
    expectedHash: 'blueprint_applied_hash_def',
  };
}

/**
 * Creates a construction started event fixture
 */
export function createConstructionStartedFixture(
  blueprint: RoomBlueprint = ROOM_BLUEPRINT_FIXTURES[0],
  playerId: PlayerID = SAMPLE_PLAYER_IDS[1],
  constructionSite: RoomConstructionSite = {
    constructionId: 'const_2025_001',
    target: {
      structureId: 'structure_main_complex',
      chunkCoord: { x: 150, y: 200 } as ChunkCoord,
      roomLabel: 'Crew Quarters Section A',
    },
  }
): SampleLedgerEventFixture {
  const timestamp = new Date('2025-12-19T16:35:00.000Z').toISOString();
  const scheduledCompletion = new Date('2025-12-20T08:00:00.000Z').toISOString();
  
  const payload: RoomConstructionStartedPayload = {
    construction: constructionSite,
    blueprint: {
      identity: {
        blueprintId: blueprint.id,
        revision: 2,
        blueprintHash: 'b2c3d4e5f6789012345678901234567890abcdef',
      },
      structureType: blueprint.structureType,
      footprint: {
        width: blueprint.width,
        height: blueprint.height,
      },
      hazards: blueprint.hazards as HazardType[],
      purpose: blueprint.purpose,
      tags: blueprint.tags,
    },
    initiatedBy: playerId,
    minuteTimestampIso: timestamp,
    scheduledCompletionIso: scheduledCompletion,
    applicationId: 'app_2025_001',
    validation: {
      validators: [SAMPLE_PLAYER_IDS[3], SAMPLE_PLAYER_IDS[0]],
      expectedHazards: blueprint.hazards as HazardType[],
      validationNotes: 'Construction start validation completed',
    },
  };

  const event: RoomLedgerEvent = {
    type: RoomLedgerEventType.CONSTRUCTION_STARTED,
    description: `Room construction started: ${blueprint.name}`,
    payload,
    resourceDelta: {},
    apply: () => console.log(`Applying ${RoomLedgerEventType.CONSTRUCTION_STARTED}: ${blueprint.name}`),
    reverse: () => console.log(`Reversing ${RoomLedgerEventType.CONSTRUCTION_STARTED}: ${blueprint.name}`),
  };

  return {
    name: 'Construction Started Event',
    description: `Demonstrates start of construction for blueprint "${blueprint.name}"`,
    event,
    blueprint,
    expectedHash: 'construction_started_hash_ghi',
  };
}

/**
 * Creates a construction completed event fixture
 */
export function createConstructionCompletedFixture(
  blueprint: RoomBlueprint = ROOM_BLUEPRINT_FIXTURES[0],
  playerId: PlayerID = SAMPLE_PLAYER_IDS[1],
  constructionSite: RoomConstructionSite = {
    constructionId: 'const_2025_001',
    target: {
      structureId: 'structure_main_complex',
      chunkCoord: { x: 150, y: 200 } as ChunkCoord,
      roomLabel: 'Crew Quarters Section A',
    },
  }
): SampleLedgerEventFixture {
  const timestamp = new Date('2025-12-19T16:36:00.000Z').toISOString();
  
  const payload: RoomConstructionCompletedPayload = {
    construction: constructionSite,
    blueprint: {
      identity: {
        blueprintId: blueprint.id,
        revision: 2,
        blueprintHash: 'b2c3d4e5f6789012345678901234567890abcdef',
      },
      structureType: blueprint.structureType,
      footprint: {
        width: blueprint.width,
        height: blueprint.height,
      },
      hazards: blueprint.hazards as HazardType[],
      purpose: blueprint.purpose,
      tags: blueprint.tags,
    },
    initiatedBy: playerId,
    minuteTimestampIso: timestamp,
    completionProof: 'completion_proof_789xyz',
    validation: {
      validators: [SAMPLE_PLAYER_IDS[3], SAMPLE_PLAYER_IDS[0]],
      expectedHazards: blueprint.hazards as HazardType[],
      validationNotes: 'Construction completion validation passed',
    },
  };

  const event: RoomLedgerEvent = {
    type: RoomLedgerEventType.CONSTRUCTION_COMPLETED,
    description: `Room construction completed: ${blueprint.name}`,
    payload,
    resourceDelta: {},
    apply: () => console.log(`Applying ${RoomLedgerEventType.CONSTRUCTION_COMPLETED}: ${blueprint.name}`),
    reverse: () => console.log(`Reversing ${RoomLedgerEventType.CONSTRUCTION_COMPLETED}: ${blueprint.name}`),
  };

  return {
    name: 'Construction Completed Event',
    description: `Demonstrates completion of construction for blueprint "${blueprint.name}"`,
    event,
    blueprint,
    expectedHash: 'construction_completed_hash_jkl',
  };
}

/**
 * Creates a construction cancelled event fixture
 */
export function createConstructionCancelledFixture(
  blueprint: RoomBlueprint = ROOM_BLUEPRINT_FIXTURES[0],
  playerId: PlayerID = SAMPLE_PLAYER_IDS[1],
  reason: 'player_cancelled' | 'supply_shortage' | 'validation_failed' | 'hazard_conflict' | 'other' = 'supply_shortage',
  constructionSite: RoomConstructionSite = {
    constructionId: 'const_2025_002',
    target: {
      structureId: 'structure_secondary_complex',
      chunkCoord: { x: 200, y: 250 } as ChunkCoord,
      roomLabel: 'Workshop Section B',
    },
  }
): SampleLedgerEventFixture {
  const timestamp = new Date('2025-12-19T16:37:00.000Z').toISOString();
  
  const payload: RoomConstructionCancelledPayload = {
    construction: constructionSite,
    blueprint: {
      identity: {
        blueprintId: blueprint.id,
        revision: 1,
        blueprintHash: 'c3d4e5f6789012345678901234567890abcdef12',
      },
      structureType: blueprint.structureType,
      footprint: {
        width: blueprint.width,
        height: blueprint.height,
      },
      hazards: blueprint.hazards as HazardType[],
      purpose: blueprint.purpose,
      tags: blueprint.tags,
    },
    initiatedBy: playerId,
    minuteTimestampIso: timestamp,
    reason,
    notes: `Construction cancelled due to ${reason}`,
    validation: {
      validators: [SAMPLE_PLAYER_IDS[3]],
      expectedHazards: blueprint.hazards as HazardType[],
      validationNotes: 'Cancellation validation completed',
    },
  };

  const event: RoomLedgerEvent = {
    type: RoomLedgerEventType.CONSTRUCTION_CANCELLED,
    description: `Room construction cancelled: ${blueprint.name}`,
    payload,
    resourceDelta: {},
    apply: () => console.log(`Applying ${RoomLedgerEventType.CONSTRUCTION_CANCELLED}: ${blueprint.name}`),
    reverse: () => console.log(`Reversing ${RoomLedgerEventType.CONSTRUCTION_CANCELLED}: ${blueprint.name}`),
  };

  return {
    name: 'Construction Cancelled Event',
    description: `Demonstrates cancellation of construction for blueprint "${blueprint.name}" due to ${reason}`,
    event,
    blueprint,
    expectedHash: 'construction_cancelled_hash_mno',
  };
}

/**
 * Complete collection of sample ledger event fixtures
 */
export const ROOM_LEDGER_EVENT_FIXTURES: SampleLedgerEventFixture[] = [
  createBlueprintCreatedFixture(),
  createBlueprintCreatedFixture(ROOM_BLUEPRINT_FIXTURES[1], SAMPLE_PLAYER_IDS[1], 'imported'),
  createBlueprintUpdatedFixture(),
  createBlueprintUpdatedFixture(ROOM_BLUEPRINT_FIXTURES[1], SAMPLE_PLAYER_IDS[2], 'Enhanced safety protocols added'),
  createBlueprintExportedFixture(),
  createBlueprintExportedFixture(ROOM_BLUEPRINT_FIXTURES[1], SAMPLE_PLAYER_IDS[0], 'yaml', 'yaml_export_hash'),
  createBlueprintDeprecatedFixture(),
  createBlueprintAppliedFixture(),
  createConstructionStartedFixture(),
  createConstructionCompletedFixture(),
  createConstructionCancelledFixture(),
];

/**
 * Get fixture by event type
 */
export function getFixturesByEventType(eventType: RoomLedgerEventType): SampleLedgerEventFixture[] {
  return ROOM_LEDGER_EVENT_FIXTURES.filter(fixture => fixture.event.type === eventType);
}

/**
 * Get all fixture names for documentation
 */
export function getAllFixtureNames(): string[] {
  return ROOM_LEDGER_EVENT_FIXTURES.map(fixture => fixture.name);
}

/**
 * Validate fixture structure
 */
export function validateFixture(fixture: SampleLedgerEventFixture): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!fixture.name?.trim()) {
    errors.push('Fixture name is required');
  }
  
  if (!fixture.description?.trim()) {
    errors.push('Fixture description is required');
  }
  
  if (!fixture.event) {
    errors.push('Event is required');
  } else {
    if (!fixture.event.type) {
      errors.push('Event type is required');
    }
    if (!fixture.event.description?.trim()) {
      errors.push('Event description is required');
    }
    if (!fixture.event.payload) {
      errors.push('Event payload is required');
    }
    if (typeof fixture.event.apply !== 'function') {
      errors.push('Event apply method is required');
    }
    if (typeof fixture.event.reverse !== 'function') {
      errors.push('Event reverse method is required');
    }
  }
  
  if (!fixture.blueprint) {
    errors.push('Blueprint is required');
  }
  
  if (!fixture.expectedHash?.trim()) {
    errors.push('Expected hash is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}