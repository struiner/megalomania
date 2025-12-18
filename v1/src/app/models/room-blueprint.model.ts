import { HazardType } from '../enums/HazardType';
import { IssueSeverity } from './tech-tree.models';
import { ID } from '../types/ID';

export interface RoomBlueprintFeature {
  id: ID;
  label: string;
  detail?: string;
  children?: RoomBlueprintFeature[];
}

export interface RoomBlueprintDimensions {
  width: number;
  height: number;
}

export interface RoomBlueprintMetadata {
  source: string;
  author?: string;
  tags?: string[];
  lastValidated?: string;
}

export interface RoomBlueprint {
  id: ID;
  name: string;
  purpose: string;
  hazards: HazardType[];
  dimensions: RoomBlueprintDimensions;
  features: RoomBlueprintFeature[];
  notes?: string;
  metadata?: RoomBlueprintMetadata;
}

export interface RoomBlueprintValidationNotice {
  blueprintId?: ID;
  path: string;
  message: string;
  severity: IssueSeverity;
}
