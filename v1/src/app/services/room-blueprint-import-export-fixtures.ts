import { HazardType, StructureType, GoodsType, RoomSocketType, RoomCostPhase, RoomConstraintType } from '../models/room-blueprint.models';

/**
 * Sample JSON fixtures for testing room blueprint import/export functionality.
 * Includes both valid and invalid examples to test validation and error handling.
 */

export interface RoomBlueprintFixture {
  name: string;
  description: string;
  valid: boolean;
  json: string;
  expectedIssues?: {
    errorCount: number;
    warningCount: number;
  };
}

/**
 * Valid room blueprint fixtures for testing successful import/export.
 */
export const VALID_ROOM_BLUEPRINT_FIXTURES: RoomBlueprintFixture[] = [
  {
    name: 'Basic Workshop',
    description: 'Simple room blueprint with minimal required fields',
    valid: true,
    json: JSON.stringify({
      id: 'basic_workshop',
      name: 'Basic Workshop',
      purpose: 'Simple crafting and repair',
      width: 10,
      height: 8,
      hazards: ['fire', 'electrical'],
      features: ['Workbench', 'Tool storage', 'Good lighting'],
      tags: ['crafting', 'workshop']
    }, null, 2)
  },
  {
    name: 'Advanced Laboratory',
    description: 'Complex blueprint with full property set',
    valid: true,
    json: JSON.stringify({
      blueprintId: {
        id: 'advanced_laboratory',
        version: '2.1.0',
        namespace: 'research_facility'
      },
      name: 'Advanced Laboratory',
      purpose: 'High-tech research and experimentation',
      width: 16,
      height: 12,
      depth: 2,
      dimensions: {
        width: 16,
        height: 12,
        depth: 2,
        origin: { x: 5, y: 5 },
        gridUnit: 1.5
      },
      hazards: [HazardType.Radiation, HazardType.ToxicSpill, HazardType.Electrical],
      features: [
        'Sterile workbenches',
        'Chemical storage vault',
        'Radiation shielding',
        'Emergency shower',
        'Data collection terminals'
      ],
      structureType: StructureType.Tower,
      sockets: [
        {
          id: 'main_entrance',
          kind: 'structural',
          position: { x: 0, y: 6 },
          label: 'Main entrance'
        },
        {
          socketId: 'power_main',
          type: RoomSocketType.Power,
          position: { x: 15, y: 6 },
          orientation: 'east',
          required: true,
          label: 'Main power feed'
        },
        {
          socketId: 'data_network',
          type: RoomSocketType.Data,
          position: { x: 8, y: 0 },
          orientation: 'north',
          label: 'Research network'
        },
        {
          socketId: 'ventilation',
          type: RoomSocketType.Ventilation,
          position: { x: 4, y: 11 },
          orientation: 'south',
          label: 'Air filtration system'
        }
      ],
      costs: [
        { resourceId: GoodsType.Electronics, amount: 75, phase: RoomCostPhase.Build },
        { resourceId: GoodsType.Steel, amount: 50, phase: RoomCostPhase.Build },
        { resourceId: GoodsType.Glassware, amount: 25, phase: RoomCostPhase.Build },
        { resourceId: GoodsType.Paper, amount: 5, phase: RoomCostPhase.Maintenance, notes: 'Research logs' }
      ],
      constraints: [
        {
          constraintId: 'max_hazards',
          type: RoomConstraintType.MaxHazardCount,
          value: 3,
          rationale: 'Safety protocols'
        },
        {
          constraintId: 'requires_power',
          type: RoomConstraintType.RequiresSocketType,
          value: RoomSocketType.Power,
          rationale: 'Equipment needs power'
        }
      ],
      tags: ['research', 'advanced', 'hazmat', 'sterile'],
      metadata: {
        author: 'research_team_lead',
        source: 'sdk',
        createdAtIso: '2025-12-19T16:00:00.000Z',
        lastUpdatedAtIso: '2025-12-19T16:00:00.000Z',
        checksum128: 'advanced_lab_v2_1_0',
        department: 'R&D',
        classification: 'Level 3'
      },
      version: '2.1.0',
      notes: 'Requires Level 3 hazmat certification'
    }, null, 2)
  },
  {
    name: 'Crew Quarters',
    description: 'Habitation room with standard amenities',
    valid: true,
    json: JSON.stringify({
      id: 'crew_quarters_mk1',
      name: 'Crew Quarters Mk I',
      purpose: 'Crew rest and rotation',
      width: 8,
      height: 6,
      hazards: [HazardType.Fire, HazardType.Intrusion],
      features: ['Sleeping pods', 'Lockers', 'Emergency mask cache'],
      structureType: StructureType.Barracks,
      sockets: [
        {
          id: 'door_north',
          kind: 'structural',
          position: { x: 3, y: 0 },
          label: 'Main entrance'
        },
        {
          socketId: 'vent_stack',
          type: RoomSocketType.Ventilation,
          position: { x: 7, y: 2 },
          orientation: 'ceiling',
          label: 'Air circulation'
        }
      ],
      costs: [
        { resourceId: GoodsType.Cloth, amount: 12, phase: RoomCostPhase.Build },
        { resourceId: GoodsType.Wood, amount: 60, phase: RoomCostPhase.Build }
      ],
      constraints: [
        { constraintId: 'hazard_cap', type: RoomConstraintType.MaxHazardCount, value: 3 },
        { constraintId: 'min_width', type: RoomConstraintType.MinWidth, value: 6, rationale: 'Bunks need clearance' }
      ],
      tags: ['crew', 'habitation'],
      metadata: {
        author: 'sdk-sample',
        source: 'sdk',
        checksum128: 'crew_quarters_mk1_v1'
      },
      version: '1.0.0'
    }, null, 2)
  },
  {
    name: 'Minimal Room',
    description: 'Room with only required fields',
    valid: true,
    json: JSON.stringify({
      id: 'minimal_room',
      name: 'Minimal Room',
      purpose: 'Storage',
      width: 4,
      height: 4,
      hazards: [],
      features: ['Empty space']
    }, null, 2)
  }
];

/**
 * Invalid room blueprint fixtures for testing validation error handling.
 */
export const INVALID_ROOM_BLUEPRINT_FIXTURES: RoomBlueprintFixture[] = [
  {
    name: 'Missing Required Fields',
    description: 'Blueprint missing essential id, name, purpose fields',
    valid: false,
    json: JSON.stringify({
      width: 10,
      height: 8,
      hazards: ['fire'],
      features: ['Workbench']
    }, null, 2),
    expectedIssues: {
      errorCount: 3, // id, name, purpose required
      warningCount: 0
    }
  },
  {
    name: 'Invalid Dimensions',
    description: 'Room with invalid width and height values',
    valid: false,
    json: JSON.stringify({
      id: 'invalid_dimensions',
      name: 'Invalid Dimensions Room',
      purpose: 'Testing invalid dimensions',
      width: -5,
      height: 1000,
      hazards: ['fire'],
      features: ['Nothing special']
    }, null, 2),
    expectedIssues: {
      errorCount: 2, // negative width, height too large
      warningCount: 0
    }
  },
  {
    name: 'Invalid Hazard Types',
    description: 'Room with non-existent hazard types',
    valid: false,
    json: JSON.stringify({
      id: 'invalid_hazards',
      name: 'Invalid Hazards Room',
      purpose: 'Testing invalid hazards',
      width: 8,
      height: 6,
      hazards: ['nonexistent_hazard', 'another_invalid'],
      features: ['Dangerous features']
    }, null, 2),
    expectedIssues: {
      errorCount: 2, // invalid hazards
      warningCount: 0
    }
  },
  {
    name: 'Empty Features Array',
    description: 'Room with empty features array',
    valid: false,
    json: JSON.stringify({
      id: 'empty_features',
      name: 'Empty Features Room',
      purpose: 'No features defined',
      width: 6,
      height: 6,
      hazards: [],
      features: []
    }, null, 2),
    expectedIssues: {
      errorCount: 1, // at least one feature required
      warningCount: 0
    }
  },
  {
    name: 'Invalid Socket Configuration',
    description: 'Room with malformed socket data',
    valid: false,
    json: JSON.stringify({
      id: 'invalid_sockets',
      name: 'Invalid Sockets Room',
      purpose: 'Testing socket validation',
      width: 10,
      height: 8,
      hazards: ['fire'],
      features: ['Socket testing'],
      sockets: [
        {
          // Missing id
          kind: 'structural',
          position: { x: 5, y: 0 },
          label: 'Invalid socket'
        },
        {
          id: 'valid_socket',
          kind: 'power',
          // Missing position
          label: 'Missing position'
        }
      ]
    }, null, 2),
    expectedIssues: {
      errorCount: 2, // missing socket id and position
      warningCount: 0
    }
  },
  {
    name: 'Invalid Cost Data',
    description: 'Room with malformed cost information',
    valid: false,
    json: JSON.stringify({
      id: 'invalid_costs',
      name: 'Invalid Costs Room',
      purpose: 'Testing cost validation',
      width: 8,
      height: 6,
      hazards: [],
      features: ['Cost testing'],
      costs: [
        {
          resourceId: 'invalid_resource',
          amount: -10,
          phase: 'invalid_phase'
        }
      ]
    }, null, 2),
    expectedIssues: {
      errorCount: 3, // invalid resource, negative amount, invalid phase
      warningCount: 0
    }
  },
  {
    name: 'Whitespace Validation',
    description: 'Room with leading/trailing whitespace in required fields',
    valid: false,
    json: JSON.stringify({
      id: '  whitespace_room  ',
      name: '  Whitespace Room  ',
      purpose: '  Testing whitespace  ',
      width: 6,
      height: 6,
      hazards: [],
      features: ['  Feature with spaces  ']
    }, null, 2),
    expectedIssues: {
      errorCount: 0, // Whitespace issues are warnings, not errors
      warningCount: 4 // id, name, purpose, features with whitespace
    }
  }
];

/**
 * Test data for batch import/export operations.
 */
export const BATCH_IMPORT_TEST_DATA = {
  valid: {
    description: 'Array of valid blueprints for batch testing',
    json: JSON.stringify([
      {
        id: 'batch_room_1',
        name: 'Batch Room 1',
        purpose: 'First room in batch',
        width: 8,
        height: 6,
        hazards: ['fire'],
        features: ['Basic features']
      },
      {
        id: 'batch_room_2',
        name: 'Batch Room 2',
        purpose: 'Second room in batch',
        width: 10,
        height: 8,
        hazards: ['electrical'],
        features: ['More features', 'Additional features']
      }
    ], null, 2)
  },
  mixed: {
    description: 'Array with mix of valid and invalid blueprints',
    json: JSON.stringify([
      {
        id: 'valid_room',
        name: 'Valid Room',
        purpose: 'This is valid',
        width: 6,
        height: 6,
        hazards: [],
        features: ['Valid feature']
      },
      {
        name: 'Missing ID',
        purpose: 'Missing ID field',
        width: 6,
        height: 6,
        hazards: [],
        features: ['Invalid feature']
      },
      {
        id: 'another_valid',
        name: 'Another Valid',
        purpose: 'Also valid',
        width: 8,
        height: 8,
        hazards: ['fire'],
        features: ['Another feature']
      }
    ], null, 2)
  }
};

/**
 * Edge case test data for comprehensive validation testing.
 */
export const EDGE_CASE_FIXTURES: RoomBlueprintFixture[] = [
  {
    name: 'Maximum Dimensions',
    description: 'Room at the maximum allowed size',
    valid: true,
    json: JSON.stringify({
      id: 'max_dimensions_room',
      name: 'Maximum Dimensions Room',
      purpose: 'Testing maximum size limits',
      width: 512,
      height: 512,
      hazards: ['fire', 'flood', 'electrical'],
      features: Array(50).fill('Feature').map((f, i) => `${f} ${i + 1}`)
    }, null, 2)
  },
  {
    name: 'Minimum Dimensions',
    description: 'Room at the minimum allowed size',
    valid: true,
    json: JSON.stringify({
      id: 'min_dimensions_room',
      name: 'Minimum Dimensions Room',
      purpose: 'Testing minimum size limits',
      width: 1,
      height: 1,
      hazards: [],
      features: ['Single feature']
    }, null, 2)
  },
  {
    name: 'Complex Socket Network',
    description: 'Room with many interconnected sockets',
    valid: true,
    json: JSON.stringify({
      id: 'complex_sockets',
      name: 'Complex Socket Network',
      purpose: 'Testing complex socket validation',
      width: 20,
      height: 15,
      hazards: ['electrical', 'radiation'],
      features: ['Complex setup'],
      sockets: Array.from({ length: 20 }, (_, i) => ({
        id: `socket_${i}`,
        kind: i % 2 === 0 ? 'power' : 'data',
        position: { x: i % 5, y: Math.floor(i / 5) },
        label: `Socket ${i}`
      }))
    }, null, 2)
  },
  {
    name: 'Large Cost Array',
    description: 'Room with many different resources',
    valid: true,
    json: JSON.stringify({
      id: 'large_costs',
      name: 'Large Cost Array',
      purpose: 'Testing cost array limits',
      width: 12,
      height: 10,
      hazards: [],
      features: ['Expensive room'],
      costs: Object.values(GoodsType).slice(0, 10).map(good => ({
        resourceId: good,
        amount: Math.floor(Math.random() * 100) + 1,
        phase: Math.random() > 0.5 ? 'build' : 'maintenance'
      }))
    }, null, 2)
  }
];

/**
 * Export all fixtures for easy importing in tests.
 */
export const ALL_ROOM_BLUEPRINT_FIXTURES: RoomBlueprintFixture[] = [
  ...VALID_ROOM_BLUEPRINT_FIXTURES,
  ...INVALID_ROOM_BLUEPRINT_FIXTURES,
  ...EDGE_CASE_FIXTURES
];

/**
 * Utility function to get fixtures by validation status.
 */
export function getFixturesByValidationStatus(valid: boolean): RoomBlueprintFixture[] {
  return ALL_ROOM_BLUEPRINT_FIXTURES.filter(fixture => fixture.valid === valid);
}

/**
 * Utility function to get a specific fixture by name.
 */
export function getFixtureByName(name: string): RoomBlueprintFixture | undefined {
  return ALL_ROOM_BLUEPRINT_FIXTURES.find(fixture => fixture.name === name);
}

/**
 * Utility function to count expected issues in a fixture.
 */
export function countExpectedIssues(fixture: RoomBlueprintFixture): { errors: number; warnings: number } {
  if (!fixture.expectedIssues) {
    return { errors: 0, warnings: 0 };
  }
  return {
    errors: fixture.expectedIssues.errorCount,
    warnings: fixture.expectedIssues.warningCount
  };
}