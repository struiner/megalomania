import { Dayjs } from 'dayjs';
import { SettlementDisasterType } from '../enums/SettlementDisasterType';
import { CityEventType } from '../enums/SettlementEventType';
import { SettlementType } from '../enums/SettlementType';
import { HazardType } from '../enums/HazardType';
import { StructureType } from '../enums/StructureType';
import { Structure } from '../types/Structure';
import { Population } from '../types/settlement/Population';
import {
  BlockHeaderDTO,
  CrossRefDTO,
  EventHeaderDTO,
  Hash128,
  PlayerID,
} from './anna-readme.models';
import {
  CultureTagId,
  TechResearchPointer,
} from './tech-tree.models';
import {
  RoomBlueprint,
  RoomBlueprintIdentifier,
  RoomBlueprintReference,
  RoomBlueprintValidationHook,
  RoomBlueprintApplicationTarget,
  RoomConstructionSite,
} from './room-blueprint.models';

export enum TimeSpeed {
  SLOW = 3000,
  MEDIUM = 1500,
  FAST = 750,
  TURBO = 1,
}

// Fully generic ledger event
export interface LedgerEntry<T = any> {
  timestamp: Dayjs;
  events: LedgerEvent<T>[];
  hash: string;
}

// Generic event with dynamic payload
export interface LedgerEvent<T = any> {
  type: string;
  description: string;
  payload: T;
  resourceDelta: ResourceDelta; // must balance to zero
  apply: () => void;
  reverse: () => void;
}

export interface ResourceDelta {
  [resourceId: string]: any; 
}

export interface CityMilestone<T> {    
  cityId: string;                  
  type: CityEventType;    
  data: T;                

}
export type CityLedgerEvent =
  | LedgerEvent<CityMilestone<FoundingEventData>>
  | LedgerEvent<CityMilestone<ConstructionEventData>>
  | LedgerEvent<CityMilestone<AdvancementEventData>>
  | LedgerEvent<CityMilestone<DisasterEventData>>

export interface FoundingEventData {
  founder: string;
  location: { x: number; y: number };
  initialPopulation: Population;
}

export interface ConstructionEventData {
  buildingType: StructureType;
}

export interface AdvancementEventData {
  settlementType: SettlementType;
}

export interface DisasterEventData {
  disasterType: HazardType; // e.g., 'fire', 'flood'
  severity: number;
  affectedPopulation: number;
  affectedStructures: Structure[];
}

export enum ResearchLedgerEventType {
  RESEARCH_START = 'RESEARCH_START',
  RESEARCH_COMPLETE = 'RESEARCH_COMPLETE',
  RESEARCH_CANCELLED = 'RESEARCH_CANCELLED',
}

export interface CrossPlayerResearchValidation {
  validators: PlayerID[];
  expectedCultureTags?: CultureTagId[];
  validationNotes?: string;
}

export interface ResearchEventBasePayload {
  researchId: string;
  tech: TechResearchPointer;
  initiatedBy: PlayerID;
  minuteTimestampIso: string; // normalized to the start of the minute for determinism
  crossPlayerValidation?: CrossPlayerResearchValidation;
}

export interface ResearchStartedPayload extends ResearchEventBasePayload {
  source: 'player' | 'scripted' | 'system';
  initiatingCharacterId?: string;
}

export interface ResearchCompletedPayload extends ResearchEventBasePayload {
  completionProof?: Hash128;
  completionNotes?: string;
}

export interface ResearchCancelledPayload extends ResearchEventBasePayload {
  cancelledBy: PlayerID;
  reason: 'player_cancelled' | 'validation_failed' | 'interrupted';
  cancellationNotes?: string;
}

export type ResearchLedgerEvent =
  | LedgerEvent<ResearchStartedPayload>
  | LedgerEvent<ResearchCompletedPayload>
  | LedgerEvent<ResearchCancelledPayload>;

export enum RoomBlueprintLedgerEventType {
  CREATED = 'ROOM_BLUEPRINT_CREATED',
  UPDATED = 'ROOM_BLUEPRINT_UPDATED',
  DEPRECATED = 'ROOM_BLUEPRINT_DEPRECATED',
}

export interface RoomBlueprintEventBasePayload {
  blueprint: RoomBlueprint;
  checksum128: string;
  serializationRulesVersion: string; // aligns with ROOM_BLUEPRINT_SERIALIZATION_RULES to enforce determinism
  source: 'sdk' | 'import' | 'system';
}

export interface RoomBlueprintCreatedPayload extends RoomBlueprintEventBasePayload {
  importOrder: number; // stable order within an import batch
}

export interface RoomBlueprintUpdatedPayload extends RoomBlueprintEventBasePayload {
  previousBlueprint: RoomBlueprintIdentifier;
  changeNotes?: string;
}

export interface RoomBlueprintDeprecatedPayload {
  blueprint: RoomBlueprintIdentifier;
  deprecatedAtVersion: string;
  reason: 'superseded' | 'withdrawn' | 'invalidated';
}

export type RoomBlueprintLedgerEvent =
  | LedgerEvent<RoomBlueprintCreatedPayload>
  | LedgerEvent<RoomBlueprintUpdatedPayload>
  | LedgerEvent<RoomBlueprintDeprecatedPayload>;
export enum RoomLedgerEventType {
  BLUEPRINT_CREATED = 'ROOM_BLUEPRINT_CREATED',
  BLUEPRINT_UPDATED = 'ROOM_BLUEPRINT_UPDATED',
  BLUEPRINT_APPLIED = 'ROOM_BLUEPRINT_APPLIED',
  BLUEPRINT_EXPORTED = 'ROOM_BLUEPRINT_EXPORTED',
  BLUEPRINT_DEPRECATED = 'ROOM_BLUEPRINT_DEPRECATED',
  CONSTRUCTION_STARTED = 'ROOM_CONSTRUCTION_STARTED',
  CONSTRUCTION_COMPLETED = 'ROOM_CONSTRUCTION_COMPLETED',
  CONSTRUCTION_CANCELLED = 'ROOM_CONSTRUCTION_CANCELLED',
}

export interface RoomBlueprintEventBase {
  blueprint: RoomBlueprintReference;
  initiatedBy: PlayerID;
  minuteTimestampIso: string; // normalized to the start of the minute for determinism
  validation?: RoomBlueprintValidationHook;
}

export interface RoomBlueprintCreatedPayload extends RoomBlueprintEventBase {
  source: 'player' | 'imported' | 'generated';
  creationNotes?: string;
}

export interface RoomBlueprintUpdatedPayload extends RoomBlueprintEventBase {
  previousRevisionHash: Hash128;
  changeSummary?: string;
}

export interface RoomBlueprintAppliedPayload extends RoomBlueprintEventBase {
  applicationId: string;
  target: RoomBlueprintApplicationTarget;
  applicationProof?: Hash128;
}

export interface RoomBlueprintExportedPayload extends RoomBlueprintEventBase {
  exportFormat: 'json' | 'binary' | 'yaml';
  exportHash: Hash128;
  exportNotes?: string;
}

export interface RoomBlueprintDeprecatedPayload extends RoomBlueprintEventBase {
  reason: 'superseded' | 'invalidated' | 'retired';
  replacementBlueprintId?: string;
  deprecationNotes?: string;
}

export interface RoomConstructionEventBase {
  construction: RoomConstructionSite;
  blueprint: RoomBlueprintReference;
  initiatedBy: PlayerID;
  minuteTimestampIso: string; // normalized to the start of the minute for determinism
  validation?: RoomBlueprintValidationHook;
}

export interface RoomConstructionStartedPayload extends RoomConstructionEventBase {
  scheduledCompletionIso?: string;
  applicationId?: string;
}

export interface RoomConstructionCompletedPayload extends RoomConstructionEventBase {
  completionProof?: Hash128;
}

export type RoomConstructionCancellationReason =
  | 'player_cancelled'
  | 'supply_shortage'
  | 'validation_failed'
  | 'hazard_conflict'
  | 'other';

export interface RoomConstructionCancelledPayload extends RoomConstructionEventBase {
  reason: RoomConstructionCancellationReason;
  notes?: string;
}

export type RoomLedgerEvent =
  | LedgerEvent<RoomBlueprintCreatedPayload>
  | LedgerEvent<RoomBlueprintUpdatedPayload>
  | LedgerEvent<RoomBlueprintAppliedPayload>
  | LedgerEvent<RoomBlueprintExportedPayload>
  | LedgerEvent<RoomBlueprintDeprecatedPayload>
  | LedgerEvent<RoomConstructionStartedPayload>
  | LedgerEvent<RoomConstructionCompletedPayload>
  | LedgerEvent<RoomConstructionCancelledPayload>;

// Per-Player Blockchain DTOs are sourced from the README-aligned design models.
export type { EventHeaderDTO, BlockHeaderDTO, CrossRefDTO };
