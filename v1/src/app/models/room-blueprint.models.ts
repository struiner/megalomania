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
