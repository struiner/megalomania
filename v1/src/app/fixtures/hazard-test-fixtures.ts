import { HazardType } from '../enums/HazardType';

/**
 * Sample fixtures for testing hazard enum alignment and validation.
 * These fixtures provide representative hazard combinations for various room types.
 */

export interface HazardTestFixture {
  name: string;
  description: string;
  hazards: HazardType[];
  expectedCategories: string[];
  roomTypes: string[];
}

/**
 * Test fixtures covering different hazard categories and combinations.
 * These fixtures help validate that the HazardType enum is being used correctly
 * across SDK components and validation services.
 */
export const HAZARD_TEST_FIXTURES: HazardTestFixture[] = [
  {
    name: 'Basic Fire Hazard Room',
    description: 'Simple room with single fire hazard for basic testing',
    hazards: [HazardType.Fire],
    expectedCategories: ['environmental'],
    roomTypes: ['kitchen', 'engineering', 'workshop']
  },
  {
    name: 'Multiple Environmental Hazards',
    description: 'Room with multiple environmental hazards',
    hazards: [HazardType.Fire, HazardType.Flood, HazardType.Electrical],
    expectedCategories: ['environmental', 'structural'],
    roomTypes: ['utility', 'basement', 'control_room']
  },
  {
    name: 'Security Focus Room',
    description: 'Room with security-related hazards',
    hazards: [HazardType.Intrusion, HazardType.Raid],
    expectedCategories: ['security'],
    roomTypes: ['vault', 'command_center', 'perimeter_station']
  },
  {
    name: 'Biological Hazard Room',
    description: 'Room with biological/health hazards',
    hazards: [HazardType.Plague, HazardType.Biohazard, HazardType.ToxicGas],
    expectedCategories: ['biological', 'environmental'],
    roomTypes: ['medical', 'laboratory', 'quarantine']
  },
  {
    name: 'Space/Vacuum Hazards',
    description: 'Room with space-specific hazards',
    hazards: [HazardType.VacuumBreach, HazardType.PressureLoss, HazardType.VacuumExposure],
    expectedCategories: ['environmental'],
    roomTypes: ['airlock', 'exterior_station', 'space_habitat']
  },
  {
    name: 'Comprehensive Hazard Room',
    description: 'Room with hazards from multiple categories for stress testing',
    hazards: [
      HazardType.Fire,
      HazardType.Intrusion,
      HazardType.Electrical,
      HazardType.HostileFauna,
      HazardType.StructuralFailure
    ],
    expectedCategories: ['environmental', 'structural', 'security', 'biological'],
    roomTypes: ['wilderness_outpost', 'research_station', 'frontier_settlement']
  }
];

/**
 * Sample room blueprints using HazardType enum for validation testing.
 * These provide concrete examples of how the enum should be used in practice.
 */
export const SAMPLE_HAZARD_ROOM_BLUEPRINTS = [
  {
    id: 'crew_quarters_basic',
    name: 'Basic Crew Quarters',
    purpose: 'Standard crew accommodation',
    hazards: [HazardType.Fire, HazardType.Intrusion],
    features: ['Bunks', 'Storage', 'Emergency equipment'],
    notes: 'Standard accommodation with basic hazard protection'
  },
  {
    id: 'engineering_bay',
    name: 'Engineering Bay',
    purpose: 'Technical maintenance and repair',
    hazards: [HazardType.Electrical, HazardType.Fire, HazardType.StructuralFailure],
    features: ['Tool storage', 'Workbenches', 'Safety equipment'],
    notes: 'High-risk area requiring enhanced safety protocols'
  },
  {
    id: 'medical_facility',
    name: 'Medical Facility',
    purpose: 'Health care and emergency treatment',
    hazards: [HazardType.Biohazard, HazardType.Plague, HazardType.ToxicGas],
    features: ['Medical equipment', 'Quarantine area', 'Sterile storage'],
    notes: 'Requires specialized containment and cleaning procedures'
  },
  {
    id: 'airlock_complex',
    name: 'Airlock Complex',
    purpose: 'Pressure transition and external access',
    hazards: [HazardType.VacuumBreach, HazardType.PressureLoss, HazardType.VacuumExposure],
    features: ['Pressure doors', 'Emergency supplies', 'Communication equipment'],
    notes: 'Critical safety systems required for operation'
  },
  {
    id: 'agricultural_bay',
    name: 'Agricultural Bay',
    purpose: 'Food production and processing',
    hazards: [HazardType.CropFailure, HazardType.LivestockDisease, HazardType.HostileFauna],
    features: ['Growing areas', 'Irrigation', 'Storage'],
    notes: 'Biological hazards require careful monitoring'
  }
];

/**
 * Validation test cases for hazard enum alignment.
 * These test cases verify that the enum values work correctly with validation logic.
 */
export const HAZARD_VALIDATION_TEST_CASES = [
  {
    name: 'Single Valid Hazard',
    input: [HazardType.Fire],
    expectedValid: true,
    expectedErrors: []
  },
  {
    name: 'Multiple Valid Hazards',
    input: [HazardType.Fire, HazardType.Flood, HazardType.Intrusion],
    expectedValid: true,
    expectedErrors: []
  },
  {
    name: 'Duplicate Hazards',
    input: [HazardType.Fire, HazardType.Fire],
    expectedValid: false,
    expectedErrors: ['Duplicate hazard entries detected']
  },
  {
    name: 'Empty Hazard List',
    input: [],
    expectedValid: true,
    expectedErrors: []
  },
  {
    name: 'All Hazard Categories',
    input: [
      HazardType.Fire,           // environmental
      HazardType.StructuralFailure, // structural  
      HazardType.Plague,         // biological
      HazardType.Intrusion,      // security
      HazardType.Electrical      // structural/environmental
    ],
    expectedValid: true,
    expectedErrors: []
  }
];

/**
 * Test data for adapter service validation.
 * Ensures that hazard adapters correctly convert enum values to display labels.
 */
export const HAZARD_ADAPTER_TEST_DATA = [
  {
    enumValue: HazardType.Fire,
    expectedLabel: 'Fire',
    expectedCategory: 'environmental',
    expectedTags: ['urban', 'shipboard', 'workshop']
  },
  {
    enumValue: HazardType.Intrusion,
    expectedLabel: 'Intrusion',
    expectedCategory: 'security',
    expectedTags: ['boarding', 'siege', 'urban']
  },
  {
    enumValue: HazardType.Electrical,
    expectedLabel: 'Electrical',
    expectedCategory: 'structural',
    expectedTags: ['infrastructure', 'shipboard']
  },
  {
    enumValue: HazardType.VacuumExposure,
    expectedLabel: 'Vacuum Exposure',
    expectedCategory: 'environmental',
    expectedTags: ['space', 'pressure']
  },
  {
    enumValue: HazardType.HostileFauna,
    expectedLabel: 'Hostile Fauna',
    expectedCategory: 'biological',
    expectedTags: ['wilderness', 'untamed']
  }
];