import { Injectable } from '@angular/core';
import { StructureType } from '../enums/StructureType';
import { RoomHazardType } from '../enums/RoomHazardType';
import {
  RoomBlueprint,
  RoomBlueprintExportResult,
  RoomBlueprintImportOptions,
  RoomBlueprintImportResult,
  RoomBlueprintValidationIssue,
  RoomBlueprintValidationSummary,
  RoomBlueprintValidationError,
} from '../models/room-blueprint.models';
import {
  buildEnumNormalizationMap,
  EnumNormalizationMap,
  normalizeEnumValue,
  normalizeIdentifier,
} from './tech-identifier-normalizer';
import { Position } from '../types/Position';

const MIN_DIMENSION = 16;
const MAX_DIMENSION = 512;

@Injectable({
  providedIn: 'root',
})
export class RoomBlueprintIoService {
  private readonly hazardMap: EnumNormalizationMap = buildEnumNormalizationMap(RoomHazardType as unknown as Record<string, string>);
  private readonly structureMap: EnumNormalizationMap = buildEnumNormalizationMap(StructureType as unknown as Record<string, string>);
  private readonly migrations: Record<number, (blueprint: RoomBlueprint) => RoomBlueprint> = {};
  private readonly defaultVersion = 1;

  importBlueprint(payload: unknown, options?: RoomBlueprintImportOptions): RoomBlueprintImportResult {
    const raw = this.parseJson(payload);
    const issues: RoomBlueprintValidationIssue[] = [];
    const normalized = this.normalizeBlueprint(raw, options, issues);
    this.validateBlueprint(normalized, issues);
    const migrated = this.applyMigrations(normalized, issues);
    const ordered = this.sortForDeterminism(migrated);
    const summary = this.buildSummary(issues);

    this.throwIfErrors(summary);

    return {
      blueprint: migrated,
      orderedBlueprint: ordered,
      validation: summary,
      normalizedFrom: payload,
    };
  }

  exportBlueprint(blueprint: RoomBlueprint): RoomBlueprintExportResult {
    const issues: RoomBlueprintValidationIssue[] = [];
    const normalized = this.normalizeBlueprint(blueprint as unknown as Record<string, unknown>, { deduplicateHazards: true }, issues);
    this.validateBlueprint(normalized, issues);
    const migrated = this.applyMigrations(normalized, issues);
    const ordered = this.sortForDeterminism(migrated);
    const summary = this.buildSummary(issues);

    this.throwIfErrors(summary);

    return {
      json: JSON.stringify(ordered, null, 2),
      orderedBlueprint: ordered,
      validation: summary,
    };
  }

  private parseJson(payload: unknown): Record<string, unknown> {
    if (typeof payload === 'string') {
      try {
        return JSON.parse(payload) as Record<string, unknown>;
      } catch (error) {
        throw new Error('Room blueprint payload is not valid JSON.');
      }
    }

    if (payload && typeof payload === 'object') {
      return payload as Record<string, unknown>;
    }

    throw new Error('Room blueprint payload must be a JSON string or object.');
  }

  private normalizeBlueprint(
    rawBlueprint: Record<string, unknown>,
    options: RoomBlueprintImportOptions | undefined,
    issues: RoomBlueprintValidationIssue[],
  ): RoomBlueprint {
    const blueprint = rawBlueprint as Partial<RoomBlueprint> & Record<string, unknown>;
    const name = ((blueprint.name as string) || '').trim();
    if (!name) {
      issues.push({ path: 'name', message: 'Name is required for a room blueprint.', severity: 'error' });
    }

    const idSource = (blueprint.id as string) || name || 'room_blueprint';
    const id = normalizeIdentifier(idSource);
    if (!id) {
      issues.push({ path: 'id', message: 'Blueprint id could not be normalized.', severity: 'error' });
    }

    const width = this.normalizeDimension(blueprint.width, 'width', issues);
    const height = this.normalizeDimension(blueprint.height, 'height', issues);
    const purpose = ((blueprint.purpose as string) || '').trim();
    if (!purpose) {
      issues.push({ path: 'purpose', message: 'Purpose is required to describe the room intent.', severity: 'error' });
    }

    const hazards = this.normalizeHazards(
      blueprint.hazards,
      options?.deduplicateHazards ?? true,
      issues,
    );
    const features = this.normalizeFeatures(blueprint.features, issues);
    const structureType = this.normalizeStructureType(
      blueprint.structureType ?? (blueprint as Record<string, unknown>)['structure_type'],
      issues,
    );
    const anchor = this.normalizePosition(blueprint.anchor ?? (blueprint as Record<string, unknown>)['position'], issues);
    const version = this.normalizeVersion(blueprint.version, issues);
    const metadata = (blueprint.metadata as Record<string, unknown>) || undefined;

    return {
      id,
      name,
      width,
      height,
      purpose,
      hazards,
      features,
      structureType,
      anchor,
      metadata,
      version,
    };
  }

  private normalizeDimension(raw: unknown, path: string, issues: RoomBlueprintValidationIssue[]): number {
    if (raw === null || raw === undefined) {
      issues.push({ path, message: `${path} is required.`, severity: 'error' });
      return NaN;
    }

    const value = Number(raw);
    if (!Number.isFinite(value)) {
      issues.push({ path, message: `${path} must be a finite number.`, severity: 'error' });
      return NaN;
    }

    const rounded = Math.round(value);
    if (rounded !== value) {
      issues.push({ path, message: `${path} has been rounded to the nearest integer.`, severity: 'warning' });
    }

    return rounded;
  }

  private normalizeHazards(
    rawHazards: unknown,
    deduplicateHazards: boolean,
    issues: RoomBlueprintValidationIssue[],
  ): RoomHazardType[] {
    const hazardsArray = Array.isArray(rawHazards)
      ? rawHazards
      : typeof rawHazards === 'string'
        ? rawHazards.split(',')
        : [];

    const hazards: RoomHazardType[] = [];
    const duplicates = new Set<string>();

    hazardsArray.forEach((value, index) => {
      const normalized = normalizeEnumValue(value, this.hazardMap);
      if (!normalized.isKnown) {
        issues.push({ path: `hazards[${index}]`, message: `Unknown hazard "${String(value)}".`, severity: 'error' });
        return;
      }

      const hazard = normalized.canonical as RoomHazardType;
      if (hazards.includes(hazard)) {
        duplicates.add(hazard);
        if (!deduplicateHazards) {
          hazards.push(hazard);
        }
        return;
      }

      hazards.push(hazard);
    });

    if (duplicates.size > 0) {
      issues.push({
        path: 'hazards',
        message: deduplicateHazards
          ? `Duplicate hazards normalized: ${Array.from(duplicates).join(', ')}.`
          : `Duplicate hazards retained: ${Array.from(duplicates).join(', ')}.` ,
        severity: 'warning',
      });
    }

    return hazards.sort((left, right) => left.localeCompare(right));
  }

  private normalizeFeatures(rawFeatures: unknown, issues: RoomBlueprintValidationIssue[]): string[] {
    const featuresArray = Array.isArray(rawFeatures)
      ? rawFeatures
      : typeof rawFeatures === 'string'
        ? rawFeatures.split(',')
        : [];

    const seen = new Set<string>();
    const features: string[] = [];

    featuresArray.forEach((value, index) => {
      const feature = String(value ?? '').trim();
      if (!feature) {
        issues.push({ path: `features[${index}]`, message: 'Empty feature entries are ignored.', severity: 'warning' });
        return;
      }

      const key = feature.toLowerCase();
      if (seen.has(key)) {
        issues.push({ path: 'features', message: `Duplicate feature normalized: ${feature}.`, severity: 'warning' });
        return;
      }

      seen.add(key);
      features.push(feature);
    });

    return features.sort((left, right) => left.localeCompare(right));
  }

  private normalizeStructureType(structureType: unknown, issues: RoomBlueprintValidationIssue[]): StructureType | undefined {
    if (!structureType) {
      return undefined;
    }

    const normalized = normalizeEnumValue(structureType, this.structureMap);
    if (!normalized.isKnown) {
      issues.push({ path: 'structureType', message: `Unknown structure type "${String(structureType)}".`, severity: 'error' });
      return undefined;
    }

    return normalized.canonical as StructureType;
  }

  private normalizePosition(raw: unknown, issues: RoomBlueprintValidationIssue[]): Position | undefined {
    if (!raw) {
      return undefined;
    }

    if (typeof raw !== 'object') {
      issues.push({ path: 'anchor', message: 'Anchor must be an object with x and y coordinates.', severity: 'error' });
      return undefined;
    }

    const position = raw as Position;
    if (!this.isFiniteNumber(position.x) || !this.isFiniteNumber(position.y)) {
      issues.push({ path: 'anchor', message: 'Anchor requires finite x and y coordinates.', severity: 'error' });
      return undefined;
    }

    const anchor: Position = { x: Number(position.x), y: Number(position.y) };

    if (position.z !== undefined) {
      if (!this.isFiniteNumber(position.z)) {
        issues.push({ path: 'anchor.z', message: 'Anchor z coordinate must be a finite number when provided.', severity: 'error' });
      } else {
        anchor.z = Number(position.z);
      }
    }

    return anchor;
  }

  private normalizeVersion(version: unknown, issues: RoomBlueprintValidationIssue[]): number {
    if (version === undefined || version === null) {
      return this.defaultVersion;
    }

    const numeric = Number(version);
    if (!Number.isInteger(numeric) || numeric < 1) {
      issues.push({ path: 'version', message: 'Version must be a positive integer; defaulting to 1.', severity: 'warning' });
      return this.defaultVersion;
    }

    return numeric;
  }

  private validateBlueprint(blueprint: RoomBlueprint, issues: RoomBlueprintValidationIssue[]): void {
    if (!Number.isFinite(blueprint.width) || !Number.isFinite(blueprint.height)) {
      issues.push({ path: 'dimensions', message: 'Width and height must be finite numbers.', severity: 'error' });
      return;
    }

    if (blueprint.width < MIN_DIMENSION || blueprint.height < MIN_DIMENSION) {
      issues.push({
        path: 'dimensions',
        message: `Room dimensions must be at least ${MIN_DIMENSION}x${MIN_DIMENSION}.`,
        severity: 'error',
      });
    }

    if (blueprint.width > MAX_DIMENSION || blueprint.height > MAX_DIMENSION) {
      issues.push({
        path: 'dimensions',
        message: `Room dimensions must not exceed ${MAX_DIMENSION}x${MAX_DIMENSION}.`,
        severity: 'error',
      });
    }

    if (!blueprint.hazards || !Array.isArray(blueprint.hazards)) {
      issues.push({ path: 'hazards', message: 'Hazards must be an array.', severity: 'error' });
    }

    if (!blueprint.features || !Array.isArray(blueprint.features)) {
      issues.push({ path: 'features', message: 'Features must be an array.', severity: 'error' });
    }
  }

  private applyMigrations(blueprint: RoomBlueprint, issues: RoomBlueprintValidationIssue[]): RoomBlueprint {
    let current = blueprint;
    let guard = 0;

    while (this.migrations[current.version] && guard < 10) {
      current = this.migrations[current.version](current);
      guard += 1;
    }

    if (guard >= 10) {
      issues.push({ path: 'version', message: 'Exceeded migration depth; possible migration loop detected.', severity: 'error' });
    }

    return current;
  }

  private sortForDeterminism(blueprint: RoomBlueprint): RoomBlueprint {
    return {
      ...blueprint,
      hazards: [...blueprint.hazards].sort((left, right) => left.localeCompare(right)),
      features: [...blueprint.features].sort((left, right) => left.localeCompare(right)),
      metadata: blueprint.metadata ? { ...blueprint.metadata } : undefined,
    };
  }

  private buildSummary(issues: RoomBlueprintValidationIssue[]): RoomBlueprintValidationSummary {
    const issuesByPath: Record<string, RoomBlueprintValidationIssue[]> = {};
    issues.forEach((issue) => {
      if (!issuesByPath[issue.path]) {
        issuesByPath[issue.path] = [];
      }
      issuesByPath[issue.path].push(issue);
    });

    return {
      hasErrors: issues.some((issue) => issue.severity === 'error'),
      issues,
      issuesByPath,
    };
  }

  private throwIfErrors(summary: RoomBlueprintValidationSummary): void {
    if (summary.hasErrors) {
      throw new RoomBlueprintValidationError(summary);
    }
  }

  private isFiniteNumber(value: unknown): boolean {
    return Number.isFinite(Number(value));
  }
}
