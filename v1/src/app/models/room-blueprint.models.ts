import { ID } from '../types/ID';
import { Position } from '../types/Position';
import { ValidationNotice } from './validation.models';

export type RoomHazard = string;

export type RoomSocketKind = 'power' | 'data' | 'structural' | 'fluid' | string;

export interface RoomSocket {
  id: ID;
  kind: RoomSocketKind;
  position: Position;
  label?: string;
}

export interface RoomBlueprintPrerequisite {
  id: ID;
  requiresBlueprintId?: ID;
  requiresSockets?: ID[];
  description?: string;
}
//TODO: Consolidate code

import { Position } from '../types/Position';
import { ID } from '../types/ID';
import { StructureType } from '../enums/StructureType';
import { RoomHazardType } from '../enums/RoomHazardType';

export interface RoomBlueprint {
  id: ID;
  name: string;
  purpose: string;
  width: number;
  height: number;
  hazards: RoomHazard[];
  sockets?: RoomSocket[];
  prerequisites?: RoomBlueprintPrerequisite[];
  features: string[];
  notes?: string;
}

export interface RoomBlueprintValidationResult {
  blueprintId: ID;
  blueprintName: string;
  notices: ValidationNotice[];
}

export interface RoomBlueprintValidationOptions {
  hazardVocabulary?: RoomHazard[];
  socketKinds?: RoomSocketKind[];
  knownBlueprintIds?: ReadonlySet<ID> | ID[];
  enforceUniqueBlueprintIds?: boolean;
  width: number;
  height: number;
  purpose: string;
  hazards: RoomHazardType[];
  features: string[];
  structureType?: StructureType;
  anchor?: Position;
  metadata?: Record<string, unknown>;
  version: number;
}

export interface RoomBlueprintImportOptions {
  /**
   * Deduplicate hazards during normalization. Defaults to `true` to keep deterministic exports.
   */
  deduplicateHazards?: boolean;
}

export interface RoomBlueprintValidationIssue {
  path: string;
  message: string;
  severity: 'warning' | 'error';
}

export interface RoomBlueprintValidationSummary {
  hasErrors: boolean;
  issues: RoomBlueprintValidationIssue[];
  issuesByPath: Record<string, RoomBlueprintValidationIssue[]>;
}

export interface RoomBlueprintImportResult {
  blueprint: RoomBlueprint;
  orderedBlueprint: RoomBlueprint;
  validation: RoomBlueprintValidationSummary;
  normalizedFrom: unknown;
}

export interface RoomBlueprintExportResult {
  json: string;
  orderedBlueprint: RoomBlueprint;
  validation: RoomBlueprintValidationSummary;
}

export class RoomBlueprintValidationError extends Error {
  constructor(readonly summary: RoomBlueprintValidationSummary) {
    super(summary.issues.map((issue) => `${issue.path}: ${issue.message}`).join('; ') || 'Room blueprint validation failed.');
  }
import { GoodsType } from '../enums/GoodsType';
import { HazardType } from '../enums/HazardType';
import { StructureType } from '../enums/StructureType';
import { ID } from '../types/ID';
import { Position } from '../types/Position';

export interface RoomBlueprintIdentifier {
  /** Lower_snake_case, stable across imports; used as ledger entity key. */
  id: ID;
  /** Semver string to keep import/export deterministic and comparable. */
  version: string;
  /** Optional namespace to prevent collisions between mods/SDKs. */
  namespace?: string;
}

export interface RoomDimensions {
  width: number;
  height: number;
  depth?: number;
  /** Anchor in the parent structure grid; defaults to { x: 0, y: 0 }. */
  origin?: Position;
  /** Tile size in world units; defaults to 1 when omitted. */
  gridUnit?: number;
}

export enum RoomSocketType {
  Door = 'door',
  Corridor = 'corridor',
  Power = 'power',
  Data = 'data',
  Fluid = 'fluid',
  Ventilation = 'ventilation',
  Structural = 'structural_anchor'
}

export type SocketOrientation =
  | 'north'
  | 'south'
  | 'east'
  | 'west'
  | 'ceiling'
  | 'floor';

export interface RoomSocket {
  socketId: ID;
  type: RoomSocketType;
  position: Position;
  orientation?: SocketOrientation;
  required?: boolean;
  label?: string;
}

export enum RoomConstraintType {
  MinWidth = 'min_width',
  MinHeight = 'min_height',
  MaxHazardCount = 'max_hazard_count',
  RequiresSocketType = 'requires_socket_type',
  ExcludesHazard = 'excludes_hazard',
  StructureAffinity = 'structure_affinity'
}

export interface RoomConstraint {
  constraintId: ID;
  type: RoomConstraintType;
  value?: number | HazardType | RoomSocketType | StructureType | string;
  rationale?: string;
}

export enum RoomCostPhase {
  Build = 'build',
  Maintenance = 'maintenance'
}

export interface RoomCost {
  resourceId: GoodsType;
  amount: number;
  phase: RoomCostPhase;
  notes?: string;
}

export interface RoomBlueprintMetadata {
  author?: string;
  source?: 'sdk' | 'imported' | 'system';
  createdAtIso?: string;
  lastUpdatedAtIso?: string;
  checksum128?: string;
}

export interface RoomBlueprint {
  blueprintId: RoomBlueprintIdentifier;
  name: string;
  purpose: string; // freeform per task guidance
  structureType?: StructureType;
  dimensions: RoomDimensions;
  hazards: HazardType[];
  features: string[];
  sockets: RoomSocket[];
  costs?: RoomCost[];
  constraints?: RoomConstraint[];
  tags?: string[];
  metadata?: RoomBlueprintMetadata;
}

export type RoomTemplate = RoomBlueprint;

export interface RoomBlueprintOrderingRules {
  hazards: string;
  sockets: string;
  costs: string;
  constraints: string;
  features: string;
  tags: string;
}

export interface RoomBlueprintValidationRules {
  dimensions: string[];
  hazards: string[];
  sockets: string[];
  costs: string[];
  constraints: string[];
}

export interface RoomBlueprintSerializationRules {
  identifierNormalization: string[];
  ordering: RoomBlueprintOrderingRules;
  validation: RoomBlueprintValidationRules;
}

export const ROOM_BLUEPRINT_SERIALIZATION_RULES: RoomBlueprintSerializationRules = {
  identifierNormalization: [
    'blueprintId.id must be lower_snake_case derived from the display name with whitespace trimmed; reject imports that deviate',
    'blueprintId.version is required and must use semver so ledger events can diff payloads deterministically',
    'namespace is optional but must be lower_snake_case when present to avoid collisions across mods'
  ],
  ordering: {
    hazards: 'Sort hazards by HazardType value and de-duplicate before export to guarantee stable arrays',
    sockets: 'Order sockets by position.y, position.x, then type, then socketId to make layout merges deterministic',
    costs: 'Sort costs by resourceId then phase; aggregate duplicate resources prior to export',
    constraints: 'Sort constraints by type then constraintId to keep rule evaluation reproducible',
    features: 'Preserve author/UI order exactly as captured in the view; never auto-sort',
    tags: 'Normalize tags to lower_snake_case and sort lexicographically'
  },
  validation: {
    dimensions: [
      'width and height must be >= 1 and integers; depth, when provided, must be >= 0',
      'gridUnit defaults to 1 when omitted; origin coordinates default to 0 and should stay integer aligned'
    ],
    hazards: [
      'hazards must be members of HazardType and contain no duplicates',
      'apply MaxHazardCount constraint when present before accepting an import payload'
    ],
    sockets: [
      'socketId must be unique per blueprint; required sockets must exist in import payloads',
      'positions snap to integer tile coordinates; orientation is limited to cardinal directions plus ceiling/floor'
    ],
    costs: [
      'amounts must be non-negative and resourceId must map to a GoodsType to stay aligned with ledger deltas',
      'maintenance costs should be separately listed using phase=maintenance instead of folded into build costs'
    ],
    constraints: [
      'constraint values must match the type (e.g., numbers for size, HazardType for exclusions)',
      'unknown constraint types should fail validation rather than being ignored to avoid nondeterministic behavior'
    ]
  }
};

export const ROOM_BLUEPRINT_FIXTURES: RoomBlueprint[] = [
  {
    blueprintId: { id: 'crew_quarters_mk1', version: '1.0.0', namespace: 'core' },
    name: 'Crew Quarters Mk I',
    purpose: 'Crew rest and rotation',
    structureType: StructureType.Barracks,
    dimensions: { width: 8, height: 6, origin: { x: 0, y: 0 } },
    hazards: [HazardType.Fire, HazardType.Intrusion],
    features: ['Sleeping pods', 'Lockers', 'Emergency mask cache'],
    sockets: [
      {
        socketId: 'door_north',
        type: RoomSocketType.Door,
        position: { x: 3, y: 0 },
        orientation: 'north',
        required: true
      },
      {
        socketId: 'vent_stack',
        type: RoomSocketType.Ventilation,
        position: { x: 7, y: 2 },
        orientation: 'ceiling'
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
    }
  },
  {
    blueprintId: { id: 'reactor_control', version: '1.0.0', namespace: 'core' },
    name: 'Reactor Control',
    purpose: 'Monitoring and emergency shutdown',
    structureType: StructureType.Tower,
    dimensions: { width: 6, height: 6, origin: { x: 0, y: 0 } },
    hazards: [HazardType.Electrical, HazardType.Radiation, HazardType.ToxicSpill],
    features: ['Reinforced console dais', 'Shielded cabling trench', 'Emergency coolant purge lever'],
    sockets: [
      {
        socketId: 'access_hatch',
        type: RoomSocketType.Door,
        position: { x: 0, y: 3 },
        orientation: 'west',
        required: true
      },
      {
        socketId: 'data_bus',
        type: RoomSocketType.Data,
        position: { x: 5, y: 3 },
        orientation: 'east'
      },
      {
        socketId: 'power_feed',
        type: RoomSocketType.Power,
        position: { x: 3, y: 5 },
        orientation: 'south'
      }
    ],
    costs: [
      { resourceId: GoodsType.Electronics, amount: 30, phase: RoomCostPhase.Build },
      { resourceId: GoodsType.Paper, amount: 2, phase: RoomCostPhase.Maintenance, notes: 'Monthly inspection logs' },
      { resourceId: GoodsType.Steel, amount: 45, phase: RoomCostPhase.Build }
    ],
    constraints: [
      {
        constraintId: 'hazard_exclusion',
        type: RoomConstraintType.ExcludesHazard,
        value: HazardType.Flood,
        rationale: 'Sensitive electronics'
      },
      {
        constraintId: 'structure_affinity',
        type: RoomConstraintType.StructureAffinity,
        value: StructureType.AetheriumReactor,
        rationale: 'Calibrated for reactor stack adjacency'
      }
    ],
    tags: ['control', 'critical', 'reactor'],
    metadata: {
      author: 'sdk-sample',
      source: 'sdk',
      checksum128: 'reactor_control_v1'
    }
  }
];
import { HazardType } from '../enums/HazardType';
import { StructureType } from '../enums/StructureType';
import { ChunkCoord, Hash128, PlayerID } from './anna-readme.models';

export interface RoomBlueprintFootprint {
  width: number;
  height: number;
}

export interface RoomBlueprintIdentity {
  blueprintId: string;
  revision: number;
  blueprintHash: Hash128;
}

export interface RoomBlueprintReference {
  identity: RoomBlueprintIdentity;
  structureType?: StructureType;
  footprint: RoomBlueprintFootprint;
  hazards: HazardType[];
  purpose?: string;
  tags?: string[];
}

export interface RoomBlueprintValidationHook {
  validators?: PlayerID[];
  expectedHazards?: HazardType[];
  validationNotes?: string;
}

export interface RoomBlueprintApplicationTarget {
  structureId?: string;
  chunkCoord?: ChunkCoord;
  roomLabel?: string;
}

export interface RoomConstructionSite {
  constructionId: string;
  target: RoomBlueprintApplicationTarget;
}
