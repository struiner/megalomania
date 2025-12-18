import { Position } from '../types/Position';
import { ID } from '../types/ID';
import { StructureType } from '../enums/StructureType';
import { RoomHazardType } from '../enums/RoomHazardType';

export interface RoomBlueprint {
  id: ID;
  name: string;
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
}
