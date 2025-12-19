# Room Blueprint Data Model Documentation

**Status:** ✅ COMPLETED - Structural fidelity achieved  
**Implementation Date:** 2025-12-19  
**Related Files:** `v1/src/app/models/room-blueprint.models.ts`, `v1/src/app/enums/HazardType.ts`, `v1/src/app/enums/StructureType.ts`

## Overview

The Room Blueprint Data Model provides a comprehensive TypeScript interface system for defining room blueprints with dimensions, purposes, hazards, features, and metadata. It integrates seamlessly with existing hazard and structure enums while maintaining deterministic identifiers for SDK import/export operations.

## Core Data Model

### RoomBlueprint Interface

The primary `RoomBlueprint` interface supports multiple usage patterns:

```typescript
export interface RoomBlueprint {
  // Core identity
  id: ID;
  blueprintId?: RoomBlueprintIdentifier;
  
  // Basic properties
  name: string;
  purpose: string;
  
  // Dimensions (supports both direct and nested)
  width: number;
  height: number;
  dimensions?: RoomDimensions;
  
  // Hazards (supports multiple patterns)
  hazards: (HazardType | RoomHazardType | RoomHazard)[];
  
  // Features
  features: string[];
  
  // Optional advanced properties
  sockets?: (RoomSocket | AdvancedRoomSocket)[];
  prerequisites?: RoomBlueprintPrerequisite[];
  notes?: string;
  structureType?: StructureType;
  anchor?: Position;
  metadata?: RoomBlueprintMetadata;
  version?: number | string;
  tags?: string[];
  costs?: RoomCost[];
  constraints?: RoomConstraint[];
  depth?: number;
  gridUnit?: number;
  origin?: Position;
}
```

### Supporting Interfaces

#### RoomBlueprintIdentifier
```typescript
export interface RoomBlueprintIdentifier {
  /** Lower_snake_case, stable across imports; used as ledger entity key. */
  id: ID;
  /** Semver string to keep import/export deterministic and comparable. */
  version: string;
  /** Optional namespace to prevent collisions between mods/SDKs. */
  namespace?: string;
}
```

#### RoomDimensions
```typescript
export interface RoomDimensions {
  width: number;
  height: number;
  depth?: number;
  /** Anchor in the parent structure grid; defaults to { x: 0, y: 0 }. */
  origin?: Position;
  /** Tile size in world units; defaults to 1 when omitted. */
  gridUnit?: number;
}
```

## Hazard Integration

### HazardType Enum
The authoritative `HazardType` enum provides 25+ hazard types across multiple categories:

```typescript
export enum HazardType {
  // Environmental and structural
  Fire = 'fire',
  Flood = 'flood',
  Earthquake = 'earthquake',
  Storm = 'storm',
  HarshWinter = 'harsh_winter',
  BuildingCollapse = 'building_collapse',
  StructuralFailure = 'structural_failure',

  // Biological and ecological
  Plague = 'plague',
  Epidemic = 'epidemic',
  LivestockDisease = 'livestock_disease',
  CropFailure = 'crop_failure',

  // Resource and survival
  Famine = 'famine',
  Radiation = 'radiation',
  ToxicSpill = 'toxic_spill',
  VentilationFailure = 'ventilation_failure',
  VacuumBreach = 'vacuum_breach',

  // Security and conflict
  War = 'war',
  Raid = 'raid',
  Intrusion = 'intrusion',
  ContainmentBreach = 'containment_breach',
  SocialUnrest = 'social_unrest',
  WitchHunt = 'witch_hunt',

  // Techno-magical
  Electrical = 'electrical',
  MagicalBacklash = 'magical_backlash',

  // Additional hazard types
  Flooding = 'flooding',
  VacuumExposure = 'vacuum_exposure',
  HostileFauna = 'hostile_fauna',
  Biohazard = 'biohazard',
  Chemical = 'chemical',
  ToxicGas = 'toxic_gas',
  Vacuum = 'vacuum',
  Fauna = 'fauna',
  PressureLoss = 'pressure_loss'
}
```

### Deterministic Hazard Ordering
```typescript
export const HAZARD_DISPLAY_ORDER: readonly HazardType[] = [
  HazardType.Fire,
  HazardType.Flood,
  HazardType.Electrical,
  HazardType.Intrusion,
  HazardType.ToxicGas,
  HazardType.VacuumExposure,
  HazardType.StructuralFailure,
  HazardType.HostileFauna,
];
```

## Validation Rules

### Serialization Rules
The `ROOM_BLUEPRINT_SERIALIZATION_RULES` constant defines comprehensive validation:

#### Identifier Normalization
- `blueprintId.id` must be lower_snake_case derived from display name
- `blueprintId.version` is required and must use semver
- `namespace` is optional but must be lower_snake_case when present

#### Deterministic Ordering
```typescript
ordering: {
  hazards: 'Sort hazards by HazardType value and de-duplicate before export',
  sockets: 'Order sockets by position.y, position.x, then type, then socketId',
  costs: 'Sort costs by resourceId then phase',
  constraints: 'Sort constraints by type then constraintId',
  features: 'Preserve author/UI order exactly as captured in the view',
  tags: 'Normalize tags to lower_snake_case and sort lexicographically'
}
```

#### Validation Constraints
```typescript
validation: {
  dimensions: [
    'width and height must be >= 1 and integers',
    'depth, when provided, must be >= 0',
    'gridUnit defaults to 1 when omitted'
  ],
  hazards: [
    'hazards must be members of HazardType and contain no duplicates',
    'apply MaxHazardCount constraint when present'
  ],
  sockets: [
    'socketId must be unique per blueprint',
    'required sockets must exist in import payloads',
    'positions snap to integer tile coordinates'
  ],
  costs: [
    'amounts must be non-negative',
    'resourceId must map to a GoodsType'
  ],
  constraints: [
    'constraint values must match the type',
    'unknown constraint types should fail validation'
  ]
}
```

## Sample Blueprint Fixtures

### Crew Quarters Mk I
```typescript
{
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
    { constraintId: 'min_width', type: RoomConstraintType.MinWidth, value: 6 }
  ],
  tags: ['crew', 'habitation'],
  metadata: {
    author: 'sdk-sample',
    source: 'sdk',
    checksum128: 'crew_quarters_mk1_v1'
  },
  version: '1.0.0'
}
```

### Reactor Control
```typescript
{
  id: 'reactor_control',
  name: 'Reactor Control',
  purpose: 'Monitoring and emergency shutdown',
  width: 6,
  height: 6,
  hazards: [HazardType.Electrical, HazardType.Radiation, HazardType.ToxicSpill],
  features: ['Reinforced console dais', 'Shielded cabling trench', 'Emergency coolant purge lever'],
  structureType: StructureType.Tower,
  sockets: [
    {
      id: 'access_hatch',
      kind: 'structural',
      position: { x: 0, y: 3 },
      label: 'Access point'
    },
    {
      socketId: 'data_bus',
      type: RoomSocketType.Data,
      position: { x: 5, y: 3 },
      orientation: 'east'
    }
  ],
  costs: [
    { resourceId: GoodsType.Electronics, amount: 30, phase: RoomCostPhase.Build },
    { resourceId: GoodsType.Steel, amount: 45, phase: RoomCostPhase.Build }
  ],
  constraints: [
    {
      constraintId: 'hazard_exclusion',
      type: RoomConstraintType.ExcludesHazard,
      value: HazardType.Flood
    }
  ],
  tags: ['control', 'critical', 'reactor'],
  metadata: {
    author: 'sdk-sample',
    source: 'sdk',
    checksum128: 'reactor_control_v1'
  },
  version: '1.0.0'
}
```

## Integration Points

### Shared Type Reuse
- **ID**: From `v1/src/app/types/ID.ts`
- **Position**: From `v1/src/app/types/Position.ts`
- **StructureType**: From `v1/src/app/enums/StructureType.ts`
- **HazardType**: From `v1/src/app/enums/HazardType.ts`
- **GoodsType**: From `v1/src/app/enums/GoodsType.ts`

### Validation Services
- **RoomBlueprintValidationService**: Validates basic blueprint constraints
- **RoomWorldContextValidationService**: Validates world-context coherence

### UI Integration Points
- **RoomCreatorComponent**: Blueprint creation interface
- **TilePropertiesEditorComponent**: Blueprint editing capabilities
- **HazardPickerComponent**: Multi-select hazard selection

## Dimension Constraints

### Supported Ranges
- **Minimum**: 1x1 (width ≥ 1, height ≥ 1)
- **Maximum**: 512x512 (per task specification)
- **Depth**: Optional, ≥ 0 when provided
- **Grid Unit**: Defaults to 1, must be positive

### Coordinate System
- **Origin**: Defaults to { x: 0, y: 0 }
- **Position**: Integer-aligned tile coordinates
- **Socket Orientation**: Cardinal directions + ceiling/floor

## Feature Ordering

Per task specification, features maintain **author/UI order exactly as captured in the view**. This means:
- Features are NOT auto-sorted
- Order is preserved during import/export
- Deterministic ordering comes from capture order, not alphabetical

## Purpose Classification

Per task specification, purposes are **freeform for now**, allowing:
- Descriptive room purposes without constrained vocabulary
- Flexible naming for various room types
- Future constraint development when needed

## Version Control

### SemVer Usage
- Blueprint versions use semantic versioning (MAJOR.MINOR.PATCH)
- Version compatibility affects import/export behavior
- Migration hooks support future schema evolution

### Identifier Stability
- `blueprintId.id` remains stable across imports/exports
- Used as ledger entity key for event tracking
- Lower_snake_case convention prevents collisions

## Usage Examples

### Creating a Basic Blueprint
```typescript
import { RoomBlueprint, HazardType, StructureType } from '../models/room-blueprint.models';

const workshop: RoomBlueprint = {
  id: 'metal_workshop_basic',
  name: 'Basic Metal Workshop',
  purpose: 'Metalworking and tool production',
  width: 10,
  height: 8,
  hazards: [HazardType.Fire, HazardType.Electrical],
  features: ['Forge', 'Anvil', 'Storage racks'],
  structureType: StructureType.Blacksmith,
  tags: ['production', 'metalwork']
};
```

### Advanced Blueprint with Sockets
```typescript
const advancedLab: RoomBlueprint = {
  id: 'research_lab_mk2',
  name: 'Research Laboratory Mk II',
  blueprintId: {
    id: 'research_lab_mk2',
    version: '2.0.0',
    namespace: 'research_facility'
  },
  name: 'Research Laboratory Mk II',
  purpose: 'Advanced research and experimentation',
  dimensions: {
    width: 12,
    height: 10,
    depth: 3,
    origin: { x: 5, y: 5 },
    gridUnit: 1.5
  },
  hazards: [HazardType.ToxicSpill, HazardType.Radiation, HazardType.Electrical],
  features: [
    'Sterile workbenches',
    'Chemical storage',
    'Radiation shielding',
    'Emergency shower'
  ],
  structureType: StructureType.Laboratory,
  sockets: [
    {
      id: 'main_entrance',
      kind: 'structural',
      position: { x: 0, y: 4 },
      label: 'Main entrance'
    },
    {
      socketId: 'power_main',
      type: RoomSocketType.Power,
      position: { x: 11, y: 5 },
      orientation: 'east',
      required: true
    },
    {
      socketId: 'data_network',
      type: RoomSocketType.Data,
      position: { x: 6, y: 0 },
      orientation: 'north'
    }
  ],
  costs: [
    { resourceId: GoodsType.Electronics, amount: 50, phase: RoomCostPhase.Build },
    { resourceId: GoodsType.Steel, amount: 30, phase: RoomCostPhase.Build }
  ],
  constraints: [
    {
      constraintId: 'max_hazards',
      type: RoomConstraintType.MaxHazardCount,
      value: 3
    },
    {
      constraintId: 'requires_power',
      type: RoomConstraintType.RequiresSocketType,
      value: RoomSocketType.Power
    }
  ],
  metadata: {
    author: 'research_team',
    source: 'sdk',
    createdAtIso: new Date().toISOString()
  },
  version: '2.0.0',
  tags: ['research', 'advanced', 'hazmat']
};
```

## Implementation Status

✅ **COMPLETED DELIVERABLES:**

1. **Interfaces/Types**: Comprehensive `RoomBlueprint` interface with supporting types
2. **Hazard Integration**: Full `HazardType` enum with 25+ hazard types
3. **Validation Rules**: Complete serialization and validation rule set
4. **Sample Fixtures**: `ROOM_BLUEPRINT_FIXTURES` with working examples
5. **Documentation**: This comprehensive usage guide

✅ **REVIEW GATES MET:**

- [x] Hazard/purpose references come from authoritative enums/types
- [x] Dimension and identifier rules documented for validation
- [x] Deterministic ordering guidance included for serialization

✅ **DEPENDENCIES FULFILLED:**

- [x] Hazard enum alignment completed (replaces SettlementDisasterType)
- [x] Design guidance on purposes/features (freeform approach)
- [x] Shared type integration (Position, ID, StructureType)

## Future Enhancements

The implementation provides a solid foundation for:

1. **Blueprint Import/Export Service**: Deterministic JSON serialization
2. **Room Blueprint Editor UI**: Form-based blueprint creation/editing
3. **Validation Service Integration**: Automated blueprint validation
4. **Hazard Severity/Biome Tags**: Enhanced hazard modeling (future task)
5. **World Context Validation**: Cross-reference with world data

## Conclusion

The Room Blueprint Data Model successfully provides a comprehensive, type-safe foundation for room blueprint management in the SDK. It maintains structural fidelity while providing extensibility for future enhancements, and integrates seamlessly with existing hazard and structure systems.