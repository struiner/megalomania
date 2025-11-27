import dayjs, { Dayjs } from 'dayjs';
import { CityEventType } from '../enums/SettlementEventType';
import { SettlementType } from '../enums/SettlementType';
import { SettlementDisasterType } from '../enums/SettlementDisasterType';
import { Structure } from '../types/Structure';
import { Population } from '../types/settlement/Population';
import { StructureType } from '../enums/StructureType';

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
  disasterType: SettlementDisasterType; // e.g., 'fire', 'flood'
  severity: number;
  affectedPopulation: number;
  affectedStructures: Structure[];
}