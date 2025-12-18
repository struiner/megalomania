import {
  CultureTagBinding,
  TechNode,
  TechNodeEffects,
  TechTree,
  TechTreeExportResult,
  TechTreeImportResult,
  TechTreeValidationIssue,
} from '../../models/tech-tree.models';
import { TechEnumOption } from '../../services/tech-enum-adapter.service';

export type EditorTechTree = TechTree;
export type EditorTechNode = TechNode;
export type EditorTechTreeExport = TechTreeExportResult;
export type EditorTechTreeImport = TechTreeImportResult;
export type EditorTechNodeEffects = TechNodeEffects;
export type EditorTechValidationIssue = TechTreeValidationIssue;

export interface TechTreeImportPayload {
  sourceLabel: string;
  raw: unknown;
}

export interface CultureTagOption extends CultureTagBinding {
  label: string;
}

export interface EffectOptionSet {
  structures: TechEnumOption[];
  goods: TechEnumOption[];
  settlements: TechEnumOption[];
  guilds: TechEnumOption[];
}

export interface PrerequisiteOverlayNode {
  id: string;
  column: number;
  row: number;
  tier: number;
}

export interface PrerequisiteOverlayEdge {
  from: PrerequisiteOverlayNode;
  to: PrerequisiteOverlayNode;
  relation: string;
}
