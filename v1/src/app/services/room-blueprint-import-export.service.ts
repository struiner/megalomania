import { Injectable } from '@angular/core';
import {
  RoomBlueprint,
  RoomBlueprintImportResult,
  RoomBlueprintExportResult,
  RoomBlueprintImportOptions,
  RoomBlueprintValidationSummary,
  RoomBlueprintValidationIssue,
  RoomBlueprintValidationError,
  RoomBlueprintOrderingRules,
  ROOM_BLUEPRINT_SERIALIZATION_RULES,
  HazardType,
  RoomSocketType,
  RoomCostPhase,
  RoomConstraintType,
  StructureType,
  GoodsType,
} from '../models/room-blueprint.models';
import { ValidationNotice } from '../models/validation.models';
import { RoomBlueprintValidationService } from './room-blueprint-validation.service';

@Injectable({
  providedIn: 'root',
})
export class RoomBlueprintImportExportService {
  constructor(private readonly validationService: RoomBlueprintValidationService) {}

  /**
   * Import a room blueprint from JSON string.
   * Validates the blueprint against the schema and shared enums.
   * Provides hazard normalization option per user preference.
   */
  importRoomBlueprint(
    jsonString: string,
    options: RoomBlueprintImportOptions = {},
  ): RoomBlueprintImportResult {
    try {
      // Parse JSON
      const parsed = JSON.parse(jsonString);
      
      // Validate and normalize the parsed blueprint
      const normalizedBlueprint = this.normalizeBlueprint(parsed, options);
      
      // Validate the normalized blueprint
      const validationSummary = this.validateImportedBlueprint(normalizedBlueprint);
      
      // Check for validation errors
      if (validationSummary.hasErrors) {
        throw new RoomBlueprintValidationError(validationSummary);
      }
      
      return {
        blueprint: normalizedBlueprint,
        orderedBlueprint: this.orderBlueprintForDeterminism(normalizedBlueprint),
        validation: validationSummary,
        normalizedFrom: parsed,
      };
    } catch (error) {
      if (error instanceof RoomBlueprintValidationError) {
        throw error;
      }
      
      // Handle JSON parsing errors or other exceptions
      const validationSummary: RoomBlueprintValidationSummary = {
        hasErrors: true,
        issues: [{
          path: 'root',
          message: `Failed to import blueprint: ${error instanceof Error ? error.message : 'Unknown error'}`,
          severity: 'error',
        }],
        issuesByPath: {
          'root': [{
            path: 'root',
            message: `Failed to import blueprint: ${error instanceof Error ? error.message : 'Unknown error'}`,
            severity: 'error',
          }],
        },
      };
      
      throw new RoomBlueprintValidationError(validationSummary);
    }
  }

  /**
   * Export a room blueprint to JSON string.
   * Ensures deterministic ordering for reproducible exports.
   */
  exportRoomBlueprint(blueprint: RoomBlueprint): RoomBlueprintExportResult {
    // Validate the blueprint first
    const validationResult = this.validationService.validateBlueprint(blueprint);
    
    if (validationResult.notices.some(notice => notice.severity === 'error')) {
      const issues: RoomBlueprintValidationIssue[] = validationResult.notices.map(notice => ({
        path: notice.path,
        message: notice.message,
        severity: notice.severity as 'warning' | 'error',
      }));
      
      const issuesByPath: Record<string, RoomBlueprintValidationIssue[]> = {};
      issues.forEach(issue => {
        if (!issuesByPath[issue.path]) {
          issuesByPath[issue.path] = [];
        }
        issuesByPath[issue.path].push(issue);
      });
      
      const validationSummary: RoomBlueprintValidationSummary = {
        hasErrors: issues.some(issue => issue.severity === 'error'),
        issues,
        issuesByPath,
      };
      
      throw new RoomBlueprintValidationError(validationSummary);
    }
    
    // Order blueprint for deterministic export
    const orderedBlueprint = this.orderBlueprintForDeterminism(blueprint);
    
    // Convert to JSON with proper formatting
    const json = JSON.stringify(orderedBlueprint, null, 2);
    
    // Create validation summary from validation service result
    const issues: RoomBlueprintValidationIssue[] = validationResult.notices.map(notice => ({
      path: notice.path,
      message: notice.message,
      severity: notice.severity as 'warning' | 'error',
    }));
    
    const issuesByPath: Record<string, RoomBlueprintValidationIssue[]> = {};
    issues.forEach(issue => {
      if (!issuesByPath[issue.path]) {
        issuesByPath[issue.path] = [];
      }
      issuesByPath[issue.path].push(issue);
    });
    
    const validationSummary: RoomBlueprintValidationSummary = {
      hasErrors: false,
      issues,
      issuesByPath,
    };
    
    return {
      json,
      orderedBlueprint,
      validation: validationSummary,
    };
  }

  /**
   * Import multiple room blueprints from JSON array.
   */
  importRoomBlueprints(
    jsonArrayString: string,
    options: RoomBlueprintImportOptions = {},
  ): RoomBlueprintImportResult[] {
    try {
      const parsedArray = JSON.parse(jsonArrayString);
      
      if (!Array.isArray(parsedArray)) {
        throw new Error('Expected JSON array for batch import');
      }
      
      return parsedArray.map((item, index) => {
        try {
          const jsonString = JSON.stringify(item);
          return this.importRoomBlueprint(jsonString, options);
        } catch (error) {
          // Create a failed import result
          const validationSummary: RoomBlueprintValidationSummary = {
            hasErrors: true,
            issues: [{
              path: `items[${index}]`,
              message: `Failed to import blueprint at index ${index}: ${error instanceof Error ? error.message : 'Unknown error'}`,
              severity: 'error',
            }],
            issuesByPath: {
              [`items[${index}]`]: [{
                path: `items[${index}]`,
                message: `Failed to import blueprint at index ${index}: ${error instanceof Error ? error.message : 'Unknown error'}`,
                severity: 'error',
              }],
            },
          };
          
          return {
            blueprint: {} as RoomBlueprint, // Empty blueprint as fallback
            orderedBlueprint: {} as RoomBlueprint,
            validation: validationSummary,
            normalizedFrom: item,
          };
        }
      });
    } catch (error) {
      throw new Error(`Failed to parse JSON array: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Export multiple room blueprints to JSON array.
   */
  exportRoomBlueprints(blueprints: RoomBlueprint[]): string {
    const orderedBlueprints = blueprints.map(blueprint => 
      this.orderBlueprintForDeterminism(blueprint)
    );
    
    return JSON.stringify(orderedBlueprints, null, 2);
  }

  /**
   * Validate blueprint version and apply migration hooks if needed.
   * This provides scaffolding for future schema evolution.
   */
  migrateBlueprintIfNeeded(blueprint: any, targetVersion: string = '1.0.0'): {
    migrated: boolean;
    blueprint: RoomBlueprint;
    appliedMigrations: string[];
  } {
    const appliedMigrations: string[] = [];
    let migrated = false;
    
    // Convert unknown format to RoomBlueprint if needed
    let normalizedBlueprint = this.normalizeUnknownFormat(blueprint);
    
    // Check if migration is needed
    const currentVersion = this.getBlueprintVersion(normalizedBlueprint);
    if (currentVersion !== targetVersion) {
      // Apply version-specific migrations here
      normalizedBlueprint = this.applyMigrationHooks(normalizedBlueprint, currentVersion, targetVersion, appliedMigrations);
      migrated = true;
    }
    
    return {
      migrated,
      blueprint: normalizedBlueprint,
      appliedMigrations,
    };
  }

  private normalizeBlueprint(rawBlueprint: any, options: RoomBlueprintImportOptions): RoomBlueprint {
    // Ensure we have required fields
    if (!rawBlueprint || typeof rawBlueprint !== 'object') {
      throw new Error('Blueprint must be a valid object');
    }
    
    // Normalize basic properties
    const normalized: RoomBlueprint = {
      id: this.normalizeId(rawBlueprint.id || rawBlueprint.blueprintId?.id),
      name: this.normalizeString(rawBlueprint.name),
      purpose: this.normalizeString(rawBlueprint.purpose),
      width: this.normalizeNumber(rawBlueprint.width),
      height: this.normalizeNumber(rawBlueprint.height),
      hazards: this.normalizeHazards(rawBlueprint.hazards, options.deduplicateHazards),
      features: this.normalizeFeatures(rawBlueprint.features),
    };
    
    // Optional properties
    if (rawBlueprint.blueprintId) {
      normalized.blueprintId = {
        id: this.normalizeId(rawBlueprint.blueprintId.id),
        version: this.normalizeString(rawBlueprint.blueprintId.version) || '1.0.0',
        namespace: rawBlueprint.blueprintId.namespace ? this.normalizeId(rawBlueprint.blueprintId.namespace) : undefined,
      };
    }
    
    if (rawBlueprint.dimensions) {
      normalized.dimensions = this.normalizeDimensions(rawBlueprint.dimensions);
    }
    
    if (rawBlueprint.sockets) {
      normalized.sockets = this.normalizeSockets(rawBlueprint.sockets);
    }
    
    if (rawBlueprint.prerequisites) {
      normalized.prerequisites = this.normalizePrerequisites(rawBlueprint.prerequisites);
    }
    
    if (rawBlueprint.notes) {
      normalized.notes = this.normalizeString(rawBlueprint.notes);
    }
    
    if (rawBlueprint.structureType) {
      normalized.structureType = this.normalizeStructureType(rawBlueprint.structureType);
    }
    
    if (rawBlueprint.anchor) {
      normalized.anchor = this.normalizePosition(rawBlueprint.anchor);
    }
    
    if (rawBlueprint.metadata) {
      normalized.metadata = this.normalizeMetadata(rawBlueprint.metadata);
    }
    
    if (rawBlueprint.version) {
      normalized.version = rawBlueprint.version;
    }
    
    if (rawBlueprint.tags) {
      normalized.tags = this.normalizeTags(rawBlueprint.tags);
    }
    
    if (rawBlueprint.costs) {
      normalized.costs = this.normalizeCosts(rawBlueprint.costs);
    }
    
    if (rawBlueprint.constraints) {
      normalized.constraints = this.normalizeConstraints(rawBlueprint.constraints);
    }
    
    if (rawBlueprint.depth !== undefined) {
      normalized.depth = this.normalizeNumber(rawBlueprint.depth);
    }
    
    if (rawBlueprint.gridUnit !== undefined) {
      normalized.gridUnit = this.normalizeNumber(rawBlueprint.gridUnit);
    }
    
    if (rawBlueprint.origin) {
      normalized.origin = this.normalizePosition(rawBlueprint.origin);
    }
    
    return normalized;
  }

  private validateImportedBlueprint(blueprint: RoomBlueprint): RoomBlueprintValidationSummary {
    // Use existing validation service
    const validationResult = this.validationService.validateBlueprint(blueprint);
    
    // Convert to validation summary format
    const issues: RoomBlueprintValidationIssue[] = validationResult.notices.map(notice => ({
      path: notice.path,
      message: notice.message,
      severity: notice.severity as 'warning' | 'error',
    }));
    
    const issuesByPath: Record<string, RoomBlueprintValidationIssue[]> = {};
    issues.forEach(issue => {
      if (!issuesByPath[issue.path]) {
        issuesByPath[issue.path] = [];
      }
      issuesByPath[issue.path].push(issue);
    });
    
    return {
      hasErrors: issues.some(issue => issue.severity === 'error'),
      issues,
      issuesByPath,
    };
  }

  private orderBlueprintForDeterminism(blueprint: RoomBlueprint): RoomBlueprint {
    const ordered: RoomBlueprint = { ...blueprint };
    
    // Order hazards deterministically
    if (ordered.hazards && Array.isArray(ordered.hazards)) {
      ordered.hazards = this.orderHazards(ordered.hazards);
    }
    
    // Order sockets deterministically
    if (ordered.sockets && Array.isArray(ordered.sockets)) {
      ordered.sockets = this.orderSockets(ordered.sockets);
    }
    
    // Order costs deterministically
    if (ordered.costs && Array.isArray(ordered.costs)) {
      ordered.costs = this.orderCosts(ordered.costs);
    }
    
    // Order constraints deterministically
    if (ordered.constraints && Array.isArray(ordered.constraints)) {
      ordered.constraints = this.orderConstraints(ordered.constraints);
    }
    
    // Order tags deterministically
    if (ordered.tags && Array.isArray(ordered.tags)) {
      ordered.tags = this.orderTags(ordered.tags);
    }
    
    // Features maintain author/UI order - no reordering
    
    return ordered;
  }

  private normalizeId(id: any): string {
    if (!id || typeof id !== 'string') {
      throw new Error('ID is required and must be a string');
    }
    
    // Ensure lower_snake_case
    const normalized = id.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    
    if (!normalized) {
      throw new Error('ID cannot be empty after normalization');
    }
    
    return normalized;
  }

  private normalizeString(value: any): string {
    if (value === null || value === undefined) {
      throw new Error('Value is required');
    }
    
    const stringValue = String(value).trim();
    
    if (!stringValue) {
      throw new Error('Value cannot be empty');
    }
    
    return stringValue;
  }

  private normalizeNumber(value: any): number {
    if (value === null || value === undefined) {
      throw new Error('Number is required');
    }
    
    const num = Number(value);
    
    if (!Number.isFinite(num)) {
      throw new Error('Value must be a finite number');
    }
    
    return num;
  }

  private normalizeHazards(hazards: any[], deduplicate: boolean = true): (HazardType | string)[] {
    if (!Array.isArray(hazards)) {
      throw new Error('Hazards must be an array');
    }
    
    let normalized = hazards.map(hazard => String(hazard));
    
    if (deduplicate) {
      // Remove duplicates while preserving order
      const seen = new Set<string>();
      normalized = normalized.filter(hazard => {
        if (seen.has(hazard)) {
          return false;
        }
        seen.add(hazard);
        return true;
      });
    }
    
    return normalized;
  }

  private normalizeFeatures(features: any[]): string[] {
    if (!Array.isArray(features)) {
      throw new Error('Features must be an array');
    }
    
    return features.map(feature => String(feature).trim()).filter(feature => feature.length > 0);
  }

  private normalizeDimensions(dimensions: any): any {
    if (!dimensions || typeof dimensions !== 'object') {
      throw new Error('Dimensions must be an object');
    }
    
    return {
      width: this.normalizeNumber(dimensions.width),
      height: this.normalizeNumber(dimensions.height),
      depth: dimensions.depth !== undefined ? this.normalizeNumber(dimensions.depth) : undefined,
      origin: dimensions.origin ? this.normalizePosition(dimensions.origin) : undefined,
      gridUnit: dimensions.gridUnit !== undefined ? this.normalizeNumber(dimensions.gridUnit) : 1,
    };
  }

  private normalizeSockets(sockets: any[]): any[] {
    if (!Array.isArray(sockets)) {
      throw new Error('Sockets must be an array');
    }
    
    return sockets.map((socket, index) => {
      if (!socket || typeof socket !== 'object') {
        throw new Error(`Socket at index ${index} must be an object`);
      }
      
      // Handle both socket types
      if ('id' in socket) {
        // RoomSocket format
        return {
          id: this.normalizeId(socket.id),
          kind: String(socket.kind),
          position: this.normalizePosition(socket.position),
          label: socket.label ? String(socket.label) : undefined,
        };
      } else if ('socketId' in socket) {
        // AdvancedRoomSocket format
        return {
          socketId: this.normalizeId(socket.socketId),
          type: String(socket.type),
          position: this.normalizePosition(socket.position),
          orientation: socket.orientation ? String(socket.orientation) : undefined,
          required: socket.required !== undefined ? Boolean(socket.required) : undefined,
          label: socket.label ? String(socket.label) : undefined,
        };
      } else {
        throw new Error(`Socket at index ${index} must have either 'id' or 'socketId' property`);
      }
    });
  }

  private normalizePrerequisites(prerequisites: any[]): any[] {
    if (!Array.isArray(prerequisites)) {
      throw new Error('Prerequisites must be an array');
    }
    
    return prerequisites.map((prereq, index) => {
      if (!prereq || typeof prereq !== 'object') {
        throw new Error(`Prerequisite at index ${index} must be an object`);
      }
      
      return {
        id: this.normalizeId(prereq.id),
        requiresBlueprintId: prereq.requiresBlueprintId ? this.normalizeId(prereq.requiresBlueprintId) : undefined,
        requiresSockets: Array.isArray(prereq.requiresSockets) 
          ? prereq.requiresSockets.map((socketId: any) => this.normalizeId(socketId))
          : undefined,
        description: prereq.description ? String(prereq.description) : undefined,
      };
    });
  }

  private normalizeStructureType(structureType: any): StructureType {
    const normalized = String(structureType);
    
    // Check if it's a valid StructureType
    if (!Object.values(StructureType).includes(normalized as StructureType)) {
      throw new Error(`Invalid structure type: ${structureType}`);
    }
    
    return normalized as StructureType;
  }

  private normalizePosition(position: any): any {
    if (!position || typeof position !== 'object') {
      throw new Error('Position must be an object');
    }
    
    return {
      x: this.normalizeNumber(position.x),
      y: this.normalizeNumber(position.y),
    };
  }

  private normalizeMetadata(metadata: any): any {
    if (!metadata || typeof metadata !== 'object') {
      throw new Error('Metadata must be an object');
    }
    
    // Create a copy and ensure basic metadata fields are present
    const normalized = { ...metadata };
    
    if (!normalized.source) {
      normalized.source = 'imported';
    }
    
    return normalized;
  }

  private normalizeTags(tags: any[]): string[] {
    if (!Array.isArray(tags)) {
      throw new Error('Tags must be an array');
    }
    
    return tags
      .map(tag => String(tag).trim().toLowerCase().replace(/\s+/g, '_'))
      .filter(tag => tag.length > 0);
  }

  private normalizeCosts(costs: any[]): any[] {
    if (!Array.isArray(costs)) {
      throw new Error('Costs must be an array');
    }
    
    return costs.map((cost, index) => {
      if (!cost || typeof cost !== 'object') {
        throw new Error(`Cost at index ${index} must be an object`);
      }
      
      const normalized: any = {
        resourceId: this.normalizeGoodsType(cost.resourceId),
        amount: this.normalizeNumber(cost.amount),
        phase: this.normalizeCostPhase(cost.phase),
      };
      
      if (cost.notes) {
        normalized.notes = String(cost.notes);
      }
      
      return normalized;
    });
  }

  private normalizeConstraints(constraints: any[]): any[] {
    if (!Array.isArray(constraints)) {
      throw new Error('Constraints must be an array');
    }
    
    return constraints.map((constraint, index) => {
      if (!constraint || typeof constraint !== 'object') {
        throw new Error(`Constraint at index ${index} must be an object`);
      }
      
      const normalized: any = {
        constraintId: this.normalizeId(constraint.constraintId),
        type: this.normalizeConstraintType(constraint.type),
      };
      
      if (constraint.value !== undefined) {
        normalized.value = constraint.value;
      }
      
      if (constraint.rationale) {
        normalized.rationale = String(constraint.rationale);
      }
      
      return normalized;
    });
  }

  private normalizeGoodsType(goodsType: any): GoodsType {
    const normalized = String(goodsType);
    
    // Check if it's a valid GoodsType
    if (!Object.values(GoodsType).includes(normalized as GoodsType)) {
      throw new Error(`Invalid goods type: ${goodsType}`);
    }
    
    return normalized as GoodsType;
  }

  private normalizeCostPhase(phase: any): RoomCostPhase {
    const normalized = String(phase);
    
    if (!Object.values(RoomCostPhase).includes(normalized as RoomCostPhase)) {
      throw new Error(`Invalid cost phase: ${phase}`);
    }
    
    return normalized as RoomCostPhase;
  }

  private normalizeConstraintType(type: any): RoomConstraintType {
    const normalized = String(type);
    
    if (!Object.values(RoomConstraintType).includes(normalized as RoomConstraintType)) {
      throw new Error(`Invalid constraint type: ${type}`);
    }
    
    return normalized as RoomConstraintType;
  }

  private orderHazards(hazards: (HazardType | string)[]): (HazardType | string)[] {
    // Sort hazards by HazardType value and de-duplicate
    return [...hazards].sort();
  }

  private orderSockets(sockets: any[]): any[] {
    // Order sockets by position.y, position.x, then type, then socketId
    return [...sockets].sort((a, b) => {
      const aPos = a.position || { x: 0, y: 0 };
      const bPos = b.position || { x: 0, y: 0 };
      
      // Sort by y first
      if (aPos.y !== bPos.y) {
        return aPos.y - bPos.y;
      }
      
      // Then by x
      if (aPos.x !== bPos.x) {
        return aPos.x - bPos.x;
      }
      
      // Then by type
      const aType = a.type || a.kind || '';
      const bType = b.type || b.kind || '';
      if (aType !== bType) {
        return String(aType).localeCompare(String(bType));
      }
      
      // Finally by socketId
      const aId = a.socketId || a.id || '';
      const bId = b.socketId || b.id || '';
      return String(aId).localeCompare(String(bId));
    });
  }

  private orderCosts(costs: any[]): any[] {
    // Sort costs by resourceId then phase
    return [...costs].sort((a, b) => {
      const resourceCompare = String(a.resourceId).localeCompare(String(b.resourceId));
      if (resourceCompare !== 0) {
        return resourceCompare;
      }
      return String(a.phase).localeCompare(String(b.phase));
    });
  }

  private orderConstraints(constraints: any[]): any[] {
    // Sort constraints by type then constraintId
    return [...constraints].sort((a, b) => {
      const typeCompare = String(a.type).localeCompare(String(b.type));
      if (typeCompare !== 0) {
        return typeCompare;
      }
      return String(a.constraintId).localeCompare(String(b.constraintId));
    });
  }

  private orderTags(tags: string[]): string[] {
    // Normalize tags to lower_snake_case and sort lexicographically
    return [...tags]
      .map(tag => tag.trim().toLowerCase().replace(/\s+/g, '_'))
      .sort();
  }

  private normalizeUnknownFormat(blueprint: any): RoomBlueprint {
    // Handle different input formats and convert to standard RoomBlueprint
    if (blueprint.id && blueprint.name && blueprint.width && blueprint.height) {
      return blueprint as RoomBlueprint;
    }
    
    throw new Error('Blueprint does not match expected format');
  }

  private getBlueprintVersion(blueprint: RoomBlueprint): string {
    return String(blueprint.version || blueprint.blueprintId?.version || '1.0.0');
  }

  private applyMigrationHooks(
    blueprint: RoomBlueprint,
    currentVersion: string,
    targetVersion: string,
    appliedMigrations: string[],
  ): RoomBlueprint {
    // This is scaffolding for future migrations
    // Currently no migrations are implemented
    
    // Example migration logic structure:
    // if (currentVersion === '1.0.0' && targetVersion === '1.1.0') {
    //   blueprint = this.migrate_1_0_0_to_1_1_0(blueprint);
    //   appliedMigrations.push('migrate_1_0_0_to_1_1_0');
    // }
    
    return blueprint;
  }
}