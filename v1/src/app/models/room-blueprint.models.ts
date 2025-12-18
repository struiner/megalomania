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
}
