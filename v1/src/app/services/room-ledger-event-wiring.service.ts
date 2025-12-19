import { Injectable } from '@angular/core';
import { Dayjs } from 'dayjs';
import {
  RoomLedgerEvent,
  RoomLedgerEventType,
  RoomBlueprintCreatedPayload,
  RoomBlueprintUpdatedPayload,
  RoomBlueprintAppliedPayload,
  RoomBlueprintExportedPayload,
  RoomBlueprintDeprecatedPayload,
  RoomConstructionStartedPayload,
  RoomConstructionCompletedPayload,
  RoomConstructionCancelledPayload,
} from '../models/ledger.models';
import {
  RoomBlueprint,
  RoomBlueprintIdentifier,
  RoomBlueprintReference,
  RoomBlueprintValidationHook,
  RoomBlueprintApplicationTarget,
  RoomConstructionSite,
  ROOM_BLUEPRINT_SERIALIZATION_RULES,
} from '../models/room-blueprint.models';
import { PlayerID, Hash128 } from '../models/anna-readme.models';
import dayjs from 'dayjs';

export interface CrossPlayerVerificationHooks {
  validators: PlayerID[];
  validationNotes?: string;
  expectedHazards?: string[];
}

export interface BlueprintEventValidationOptions {
  requireValidationHooks?: boolean;
  allowSystemSource?: boolean;
  validateDeterminism?: boolean;
  crossPlayerVerification?: CrossPlayerVerificationHooks;
  timestampPrecision?: 'minute' | 'second' | 'millisecond';
}

export interface BlueprintEventOrderingRules {
  timestampPrecision: 'minute' | 'second' | 'millisecond';
  hashAlgorithm: 'sha256' | 'sha128';
  serializationVersion: string;
}

@Injectable({
  providedIn: 'root',
})
export class RoomLedgerEventWiringService {
  private readonly serializationVersion = '1.0.0';
  private readonly defaultOrderingRules: BlueprintEventOrderingRules = {
    timestampPrecision: 'minute',
    hashAlgorithm: 'sha128',
    serializationVersion: this.serializationVersion,
  };

  constructor() {}

  /**
   * Emit a blueprint created event when a new room blueprint is created.
   * Called by SDK and import-export flows when blueprints are initially created.
   */
  emitBlueprintCreated(
    blueprint: RoomBlueprint,
    initiatedBy: PlayerID,
    source: 'player' | 'imported' | 'generated',
    options: BlueprintEventValidationOptions = {},
  ): RoomLedgerEvent {
    this.validateEventOptions(options);

    const blueprintReference = this.createBlueprintReference(blueprint);
    const minuteTimestamp = this.normalizeTimestamp(options.timestampPrecision);
    const validation = this.buildValidationHook(blueprint, options.crossPlayerVerification);

    const payload: RoomBlueprintCreatedPayload = {
      blueprint: blueprintReference,
      initiatedBy,
      minuteTimestampIso: minuteTimestamp,
      source,
      creationNotes: `Blueprint "${blueprint.name}" created via ${source}`,
      validation,
    };

    return this.createLedgerEvent(
      RoomLedgerEventType.BLUEPRINT_CREATED,
      `Room blueprint created: ${blueprint.name}`,
      payload,
    );
  }

  /**
   * Emit a blueprint updated event when an existing blueprint is modified.
   * Called by editor flows when blueprints are edited and saved.
   */
  emitBlueprintUpdated(
    blueprint: RoomBlueprint,
    previousRevisionHash: Hash128,
    initiatedBy: PlayerID,
    changeSummary?: string,
    options: BlueprintEventValidationOptions = {},
  ): RoomLedgerEvent {
    this.validateEventOptions(options);

    const blueprintReference = this.createBlueprintReference(blueprint);
    const minuteTimestamp = this.normalizeTimestamp(options.timestampPrecision);
    const validation = this.buildValidationHook(blueprint, options.crossPlayerVerification);

    const payload: RoomBlueprintUpdatedPayload = {
      blueprint: blueprintReference,
      initiatedBy,
      minuteTimestampIso: minuteTimestamp,
      previousRevisionHash,
      changeSummary: changeSummary || `Updated blueprint "${blueprint.name}"`,
      validation,
    };

    return this.createLedgerEvent(
      RoomLedgerEventType.BLUEPRINT_UPDATED,
      `Room blueprint updated: ${blueprint.name}`,
      payload,
    );
  }

  /**
   * Emit a blueprint exported event when a blueprint is exported.
   * Called by import-export service to record export operations.
   */
  emitBlueprintExported(
    blueprint: RoomBlueprint,
    initiatedBy: PlayerID,
    exportFormat: 'json' | 'binary' | 'yaml',
    exportHash: Hash128,
    exportNotes?: string,
    options: BlueprintEventValidationOptions = {},
  ): RoomLedgerEvent {
    this.validateEventOptions(options);

    const blueprintReference = this.createBlueprintReference(blueprint);
    const minuteTimestamp = this.normalizeTimestamp(options.timestampPrecision);
    const validation = this.buildValidationHook(blueprint, options.crossPlayerVerification);

    const payload: RoomBlueprintExportedPayload = {
      blueprint: blueprintReference,
      initiatedBy,
      minuteTimestampIso: minuteTimestamp,
      exportFormat,
      exportHash,
      exportNotes: exportNotes || `Exported blueprint "${blueprint.name}" as ${exportFormat}`,
      validation,
    };

    return this.createLedgerEvent(
      RoomLedgerEventType.BLUEPRINT_EXPORTED,
      `Room blueprint exported: ${blueprint.name}`,
      payload,
    );
  }

  /**
   * Emit a blueprint deprecated event when a blueprint is retired or superseded.
   * Called by management flows when blueprints are intentionally removed from service.
   */
  emitBlueprintDeprecated(
    blueprintIdentifier: RoomBlueprintIdentifier,
    initiatedBy: PlayerID,
    reason: 'superseded' | 'invalidated' | 'withdrawn',
    replacementBlueprintId?: string,
    deprecationNotes?: string,
    options: BlueprintEventValidationOptions = {},
  ): RoomLedgerEvent {
    this.validateEventOptions(options);

    const minuteTimestamp = this.normalizeTimestamp(options.timestampPrecision);

    // Create a minimal reference for deprecated blueprints
    const blueprintReference: RoomBlueprintReference = {
      identity: {
        blueprintId: blueprintIdentifier.id,
        revision: 0, // Unknown revision for deprecated blueprints
        blueprintHash: 'deprecated' as Hash128,
      },
      footprint: { width: 0, height: 0 }, // Unknown dimensions
      hazards: [], // Unknown hazards
      purpose: 'deprecated',
      tags: ['deprecated'],
    };

    const payload: RoomBlueprintDeprecatedPayload = {
      blueprint: blueprintReference,
      initiatedBy,
      minuteTimestampIso: minuteTimestamp,
      reason,
      replacementBlueprintId,
      deprecationNotes: deprecationNotes || `Blueprint "${blueprintIdentifier.id}" deprecated: ${reason}`,
    };

    return this.createLedgerEvent(
      RoomLedgerEventType.BLUEPRINT_DEPRECATED,
      `Room blueprint deprecated: ${blueprintIdentifier.id}`,
      payload,
    );
  }

  /**
   * Emit a blueprint applied event when a blueprint is used for construction.
   * Called by world generation or placement systems.
   */
  emitBlueprintApplied(
    blueprint: RoomBlueprint,
    applicationId: string,
    target: RoomBlueprintApplicationTarget,
    initiatedBy: PlayerID,
    applicationProof?: Hash128,
    options: BlueprintEventValidationOptions = {},
  ): RoomLedgerEvent {
    this.validateEventOptions(options);

    const blueprintReference = this.createBlueprintReference(blueprint);
    const minuteTimestamp = this.normalizeTimestamp(options.timestampPrecision);
    const validation = this.buildValidationHook(blueprint, options.crossPlayerVerification);

    const payload: RoomBlueprintAppliedPayload = {
      blueprint: blueprintReference,
      initiatedBy,
      minuteTimestampIso: minuteTimestamp,
      applicationId,
      target,
      applicationProof,
      validation,
    };

    return this.createLedgerEvent(
      RoomLedgerEventType.BLUEPRINT_APPLIED,
      `Room blueprint applied: ${blueprint.name}`,
      payload,
    );
  }

  /**
   * Emit construction started event when room construction begins.
   * Called by construction management systems.
   */
  emitConstructionStarted(
    construction: RoomConstructionSite,
    blueprint: RoomBlueprint,
    initiatedBy: PlayerID,
    scheduledCompletionIso?: string,
    applicationId?: string,
    options: BlueprintEventValidationOptions = {},
  ): RoomLedgerEvent {
    this.validateEventOptions(options);

    const blueprintReference = this.createBlueprintReference(blueprint);
    const minuteTimestamp = this.normalizeTimestamp(options.timestampPrecision);
    const validation = this.buildValidationHook(blueprint, options.crossPlayerVerification);

    const payload: RoomConstructionStartedPayload = {
      construction,
      blueprint: blueprintReference,
      initiatedBy,
      minuteTimestampIso: minuteTimestamp,
      scheduledCompletionIso,
      applicationId,
      validation,
    };

    return this.createLedgerEvent(
      RoomLedgerEventType.CONSTRUCTION_STARTED,
      `Room construction started: ${blueprint.name}`,
      payload,
    );
  }

  /**
   * Emit construction completed event when room construction finishes.
   * Called by construction management systems.
   */
  emitConstructionCompleted(
    construction: RoomConstructionSite,
    blueprint: RoomBlueprint,
    initiatedBy: PlayerID,
    completionProof?: Hash128,
    options: BlueprintEventValidationOptions = {},
  ): RoomLedgerEvent {
    this.validateEventOptions(options);

    const blueprintReference = this.createBlueprintReference(blueprint);
    const minuteTimestamp = this.normalizeTimestamp(options.timestampPrecision);
    const validation = this.buildValidationHook(blueprint, options.crossPlayerVerification);

    const payload: RoomConstructionCompletedPayload = {
      construction,
      blueprint: blueprintReference,
      initiatedBy,
      minuteTimestampIso: minuteTimestamp,
      completionProof,
      validation,
    };

    return this.createLedgerEvent(
      RoomLedgerEventType.CONSTRUCTION_COMPLETED,
      `Room construction completed: ${blueprint.name}`,
      payload,
    );
  }

  /**
   * Emit construction cancelled event when room construction is aborted.
   * Called by construction management systems.
   */
  emitConstructionCancelled(
    construction: RoomConstructionSite,
    blueprint: RoomBlueprint,
    initiatedBy: PlayerID,
    reason: 'player_cancelled' | 'supply_shortage' | 'validation_failed' | 'hazard_conflict' | 'other',
    notes?: string,
    options: BlueprintEventValidationOptions = {},
  ): RoomLedgerEvent {
    this.validateEventOptions(options);

    const blueprintReference = this.createBlueprintReference(blueprint);
    const minuteTimestamp = this.normalizeTimestamp(options.timestampPrecision);
    const validation = this.buildValidationHook(blueprint, options.crossPlayerVerification);

    const payload: RoomConstructionCancelledPayload = {
      construction,
      blueprint: blueprintReference,
      initiatedBy,
      minuteTimestampIso: minuteTimestamp,
      reason,
      notes: notes || `Construction cancelled: ${reason}`,
      validation,
    };

    return this.createLedgerEvent(
      RoomLedgerEventType.CONSTRUCTION_CANCELLED,
      `Room construction cancelled: ${blueprint.name}`,
      payload,
    );
  }

  /**
   * Validate event options and enforce business rules.
   */
  private validateEventOptions(options: BlueprintEventValidationOptions): void {
    if (options.requireValidationHooks && !options.crossPlayerVerification) {
      throw new Error('Cross-player verification hooks are required for this event type');
    }

    if (!options.allowSystemSource) {
      // Additional validation can be added here
    }
  }

  /**
   * Create a deterministic blueprint reference from a full blueprint.
   */
  private createBlueprintReference(blueprint: RoomBlueprint): RoomBlueprintReference {
    const blueprintId = blueprint.blueprintId || {
      id: blueprint.id,
      version: String(blueprint.version || '1.0.0'),
    };

    return {
      identity: {
        blueprintId: blueprintId.id,
        revision: this.extractRevision(blueprint),
        blueprintHash: this.generateBlueprintHash(blueprint),
      },
      structureType: blueprint.structureType,
      footprint: {
        width: blueprint.width,
        height: blueprint.height,
      },
      hazards: blueprint.hazards as any[],
      purpose: blueprint.purpose,
      tags: blueprint.tags,
    };
  }

  /**
   * Generate a deterministic hash for the blueprint.
   * Uses the serialization rules to ensure consistent hashing.
   */
  private generateBlueprintHash(blueprint: RoomBlueprint): Hash128 {
    // This is a simplified hash generation
    // In production, this would use the actual serialization rules
    const normalizedBlueprint = JSON.stringify({
      id: blueprint.id,
      name: blueprint.name,
      width: blueprint.width,
      height: blueprint.height,
      hazards: [...blueprint.hazards].sort(),
      features: blueprint.features,
    });

    // Simple hash function for demonstration
    let hash = 0;
    for (let i = 0; i < normalizedBlueprint.length; i++) {
      const char = normalizedBlueprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(16).padStart(32, '0') as Hash128;
  }

  /**
   * Extract revision number from blueprint metadata or version.
   */
  private extractRevision(blueprint: RoomBlueprint): number {
    if (typeof blueprint.version === 'number') {
      return blueprint.version;
    }
    
    // Parse semantic version for revision
    const versionStr = String(blueprint.version || '1.0.0');
    const parts = versionStr.split('.');
    return parseInt(parts[0]) || 1;
  }

  /**
   * Normalize timestamp to the specified precision for determinism.
   */
  private normalizeTimestamp(precision?: 'minute' | 'second' | 'millisecond'): string {
    const timestamp = dayjs();
    
    switch (precision) {
      case 'minute':
        return timestamp.startOf('minute').toISOString();
      case 'second':
        return timestamp.startOf('second').toISOString();
      case 'millisecond':
      default:
        return timestamp.toISOString();
    }
  }

  /**
   * Build validation hook for cross-player verification.
   */
  private buildValidationHook(
    blueprint: RoomBlueprint,
    crossPlayerVerification?: CrossPlayerVerificationHooks,
  ): RoomBlueprintValidationHook | undefined {
    if (!crossPlayerVerification) {
      return undefined;
    }

    return {
      validators: crossPlayerVerification.validators,
      expectedHazards: crossPlayerVerification.expectedHazards || blueprint.hazards as any[],
      validationNotes: crossPlayerVerification.validationNotes,
    };
  }

  /**
   * Create a ledger event with proper structure and apply/reverse methods.
   */
  private createLedgerEvent<T>(
    type: RoomLedgerEventType,
    description: string,
    payload: T,
  ): RoomLedgerEvent {
    return {
      type,
      description,
      payload: payload as any, // Type assertion needed due to union type structure
      resourceDelta: {}, // Room blueprints don't directly impact resources
      apply: () => {
        // Stub implementation - actual apply logic would be implemented by the ledger system
        console.log(`Applying ${type}: ${description}`);
      },
      reverse: () => {
        // Stub implementation - actual reverse logic would be implemented by the ledger system
        console.log(`Reversing ${type}: ${description}`);
      },
    };
  }

  /**
   * Get the ordering rules for this service.
   */
  getOrderingRules(): BlueprintEventOrderingRules {
    return { ...this.defaultOrderingRules };
  }

  /**
   * Validate that a blueprint can be used for ledger events.
   */
  validateBlueprintForLedger(blueprint: RoomBlueprint): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];

    // Check required fields
    if (!blueprint.id?.trim()) {
      issues.push('Blueprint ID is required for ledger events');
    }

    if (!blueprint.name?.trim()) {
      issues.push('Blueprint name is required for ledger events');
    }

    if (!Number.isInteger(blueprint.width) || blueprint.width <= 0) {
      issues.push('Blueprint width must be a positive integer');
    }

    if (!Number.isInteger(blueprint.height) || blueprint.height <= 0) {
      issues.push('Blueprint height must be a positive integer');
    }

    // Check serialization rules compliance
    if (blueprint.blueprintId) {
      if (!blueprint.blueprintId.id?.match(/^[a-z0-9_]+$/)) {
        issues.push('Blueprint ID must be lower_snake_case for ledger determinism');
      }

      if (!blueprint.blueprintId.version) {
        issues.push('Blueprint version is required for ledger events');
      }
    }

    return {
      isValid: issues.length === 0,
      issues,
    };
  }
}