import { HazardType } from '../../enums/HazardType';
import { RoomBlueprint, RoomBlueprintValidationNotice } from '../../models/room-blueprint.model';

export const ROOM_BLUEPRINT_FIXTURES: RoomBlueprint[] = [
  {
    id: 'containment-bay',
    name: 'Containment Bay',
    purpose: 'Hold quarantine cases with controlled ingress/egress',
    hazards: [HazardType.Biohazard, HazardType.PressureLoss, HazardType.Intrusion],
    dimensions: { width: 12, height: 8 },
    features: [
      {
        id: 'dual-airlock',
        label: 'Dual vestibule airlock',
        detail: 'Stacked ingress/egress with scrubbers and manual override',
      },
      {
        id: 'scrubber-stack',
        label: 'Atmospheric scrubber stack',
        detail: 'Filters tagged for biological and chemical events',
      },
      {
        id: 'analyzer',
        label: 'Analysis bench',
        children: [
          { id: 'microscopy', label: 'Microscopy bay' },
          { id: 'gene-lock', label: 'Gene lock vault', detail: 'Stores flagged samples' },
        ],
      },
    ],
    notes: 'Keep adjacency to med storage and away from primary crew bunks.',
    metadata: {
      source: 'fixtures/sdk/rooms',
      author: 'SDK team',
      tags: ['medical', 'restricted'],
      lastValidated: 'seed-v1',
    },
  },
  {
    id: 'aft-workshop',
    name: 'Aft Workshop',
    purpose: 'Repair bulkhead plates and maintain cargo pallets',
    hazards: [HazardType.Fire, HazardType.Electrical, HazardType.StructuralFailure],
    dimensions: { width: 10, height: 9 },
    features: [
      { id: 'crane', label: 'Ceiling crane', detail: 'Max load 3 tons; shared rail with cargo lift' },
      { id: 'tool-locker', label: 'Tool lockers', detail: 'Indexed inventory with ledger hooks' },
      { id: 'sparker', label: 'Arc welder bay', detail: 'Requires dedicated exhaust' },
    ],
    metadata: {
      source: 'fixtures/sdk/rooms',
      tags: ['industrial', 'maintenance'],
      lastValidated: 'seed-v1',
    },
  },
  {
    id: 'cargo-lift',
    name: 'Cargo Lift Vestibule',
    purpose: 'Interface between hold and dockside deliveries',
    hazards: [HazardType.Vacuum, HazardType.PressureLoss, HazardType.Flood],
    dimensions: { width: 9, height: 12 },
    features: [
      { id: 'lift', label: 'Hydraulic lift', detail: 'Deterministic height presets for pallets' },
      { id: 'seal', label: 'Pressure seals', detail: 'Redundant gaskets for hatch edges' },
      { id: 'sensor-grid', label: 'Sensor grid', detail: 'Tracks cargo tags and moisture incursion' },
    ],
    metadata: {
      source: 'fixtures/sdk/rooms',
      tags: ['logistics', 'dockside'],
      lastValidated: 'seed-v1',
    },
  },
];

export const ROOM_BLUEPRINT_VALIDATION_FIXTURES: RoomBlueprintValidationNotice[] = [
  {
    blueprintId: 'containment-bay',
    path: 'containment-bay.dimensions.height',
    message: 'Height below recommended clearance (target ≥ 9m for scrubber stacks).',
    severity: 'warning',
  },
  {
    blueprintId: 'aft-workshop',
    path: 'aft-workshop.features.arc_welder',
    message: 'Arc welder bay missing exhaust routing detail.',
    severity: 'error',
  },
  {
    blueprintId: 'cargo-lift',
    path: 'cargo-lift.hazards.pressure_loss',
    message: 'Pressure seals require adjacent maintenance checklist.',
    severity: 'warning',
  },
  {
    path: 'fixtures.ordering',
    message: 'Feature lists should remain in ingress→workspace→egress order for deterministic exports.',
    severity: 'warning',
  },
];
