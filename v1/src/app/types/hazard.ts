import { HazardType } from '../enums/HazardType';

export type HazardIconStatus = 'ready' | 'placeholder';

export interface HazardIconDefinition {
  type: HazardType;
  label: string;
  iconId: string;
  spritePath: string;
  gridSize: number;
  padding: number;
  stroke: number;
  badgeTint: string;
  status: HazardIconStatus;
  contrast: 'light' | 'dark' | 'dual';
  notes: string[];
}

export type HazardIconValidationIssueKind =
  | 'missing-icon-id'
  | 'duplicate-icon-id'
  | 'placeholder-icon'
  | 'empty-sprite-path';

export interface HazardIconValidationIssue {
  kind: HazardIconValidationIssueKind;
  message: string;
  affectedTypes: HazardType[];
}
