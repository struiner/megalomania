import { Injectable } from '@angular/core';
import dayjs, { Dayjs } from 'dayjs';
import { Hash128, PlayerID } from '../models/anna-readme.models';
import {
  LedgerEvent,
  ResourceDelta,
  RoomBlueprintAppliedPayload,
  RoomBlueprintCreatedPayload,
  RoomBlueprintDeprecatedPayload,
  RoomBlueprintEventBase,
  RoomBlueprintExportedPayload,
  RoomBlueprintUpdatedPayload,
  RoomConstructionCancellationReason,
  RoomConstructionCancelledPayload,
  RoomConstructionCompletedPayload,
  RoomConstructionEventBase,
  RoomConstructionStartedPayload,
  RoomLedgerEventType,
} from '../models/ledger.models';
import {
  RoomBlueprintApplicationTarget,
  RoomBlueprintReference,
  RoomBlueprintValidationHook,
  RoomConstructionSite,
} from '../models/room-blueprint.models';

interface BlueprintContextBase {
  blueprint: RoomBlueprintReference;
  initiatedBy: PlayerID;
  timestamp?: Dayjs;
  validation?: RoomBlueprintValidationHook;
}

interface BlueprintCreatedContext extends BlueprintContextBase {
  source?: RoomBlueprintCreatedPayload['source'];
  creationNotes?: string;
}

interface BlueprintUpdatedContext extends BlueprintContextBase {
  previousRevisionHash: Hash128;
  changeSummary?: string;
}

interface BlueprintAppliedContext extends BlueprintContextBase {
  applicationId: string;
  target: RoomBlueprintApplicationTarget;
  applicationProof?: Hash128;
}

interface BlueprintExportedContext extends BlueprintContextBase {
  exportFormat?: RoomBlueprintExportedPayload['exportFormat'];
  exportHash: Hash128;
  exportNotes?: string;
}

interface BlueprintDeprecatedContext extends BlueprintContextBase {
  reason: RoomBlueprintDeprecatedPayload['reason'];
  replacementBlueprintId?: string;
  deprecationNotes?: string;
}

interface ConstructionContextBase {
  construction: RoomConstructionSite;
  blueprint: RoomBlueprintReference;
  initiatedBy: PlayerID;
  timestamp?: Dayjs;
  validation?: RoomBlueprintValidationHook;
}

interface ConstructionStartedContext extends ConstructionContextBase {
  scheduledCompletionIso?: string;
  applicationId?: string;
}

interface ConstructionCompletedContext extends ConstructionContextBase {
  completionProof?: Hash128;
}

interface ConstructionCancelledContext extends ConstructionContextBase {
  reason: RoomConstructionCancellationReason;
  notes?: string;
}

@Injectable({ providedIn: 'root' })
export class RoomLedgerService {
  createBlueprintCreatedEvent(
    context: BlueprintCreatedContext,
  ): LedgerEvent<RoomBlueprintCreatedPayload> {
    const payload: RoomBlueprintCreatedPayload = {
      ...this.buildBlueprintBasePayload(context),
      source: context.source ?? 'player',
      creationNotes: context.creationNotes,
    };

    return this.wrapEvent(
      RoomLedgerEventType.BLUEPRINT_CREATED,
      `Room blueprint created: ${context.blueprint.identity.blueprintId}#${context.blueprint.identity.revision}`,
      payload,
    );
  }

  createBlueprintUpdatedEvent(
    context: BlueprintUpdatedContext,
  ): LedgerEvent<RoomBlueprintUpdatedPayload> {
    const payload: RoomBlueprintUpdatedPayload = {
      ...this.buildBlueprintBasePayload(context),
      previousRevisionHash: context.previousRevisionHash,
      changeSummary: context.changeSummary,
    };

    return this.wrapEvent(
      RoomLedgerEventType.BLUEPRINT_UPDATED,
      `Room blueprint updated: ${context.blueprint.identity.blueprintId}#${context.blueprint.identity.revision}`,
      payload,
    );
  }

  createBlueprintAppliedEvent(
    context: BlueprintAppliedContext,
  ): LedgerEvent<RoomBlueprintAppliedPayload> {
    const payload: RoomBlueprintAppliedPayload = {
      ...this.buildBlueprintBasePayload(context),
      applicationId: context.applicationId,
      target: this.normalizeTarget(context.target),
      applicationProof: context.applicationProof,
    };

    return this.wrapEvent(
      RoomLedgerEventType.BLUEPRINT_APPLIED,
      `Room blueprint applied: ${context.blueprint.identity.blueprintId}#${context.blueprint.identity.revision}`,
      payload,
    );
  }

  createBlueprintExportedEvent(
    context: BlueprintExportedContext,
  ): LedgerEvent<RoomBlueprintExportedPayload> {
    const payload: RoomBlueprintExportedPayload = {
      ...this.buildBlueprintBasePayload(context),
      exportFormat: context.exportFormat ?? 'json',
      exportHash: context.exportHash,
      exportNotes: context.exportNotes,
    };

    return this.wrapEvent(
      RoomLedgerEventType.BLUEPRINT_EXPORTED,
      `Room blueprint exported: ${context.blueprint.identity.blueprintId}#${context.blueprint.identity.revision}`,
      payload,
    );
  }

  createBlueprintDeprecatedEvent(
    context: BlueprintDeprecatedContext,
  ): LedgerEvent<RoomBlueprintDeprecatedPayload> {
    const payload: RoomBlueprintDeprecatedPayload = {
      ...this.buildBlueprintBasePayload(context),
      reason: context.reason,
      replacementBlueprintId: context.replacementBlueprintId,
      deprecationNotes: context.deprecationNotes,
    };

    return this.wrapEvent(
      RoomLedgerEventType.BLUEPRINT_DEPRECATED,
      `Room blueprint deprecated: ${context.blueprint.identity.blueprintId}#${context.blueprint.identity.revision}`,
      payload,
    );
  }

  createConstructionStartedEvent(
    context: ConstructionStartedContext,
  ): LedgerEvent<RoomConstructionStartedPayload> {
    const payload: RoomConstructionStartedPayload = {
      ...this.buildConstructionBasePayload(context),
      scheduledCompletionIso: context.scheduledCompletionIso,
      applicationId: context.applicationId,
    };

    return this.wrapEvent(
      RoomLedgerEventType.CONSTRUCTION_STARTED,
      `Room construction started: ${context.construction.constructionId}`,
      payload,
    );
  }

  createConstructionCompletedEvent(
    context: ConstructionCompletedContext,
  ): LedgerEvent<RoomConstructionCompletedPayload> {
    const payload: RoomConstructionCompletedPayload = {
      ...this.buildConstructionBasePayload(context),
      completionProof: context.completionProof,
    };

    return this.wrapEvent(
      RoomLedgerEventType.CONSTRUCTION_COMPLETED,
      `Room construction completed: ${context.construction.constructionId}`,
      payload,
    );
  }

  createConstructionCancelledEvent(
    context: ConstructionCancelledContext,
  ): LedgerEvent<RoomConstructionCancelledPayload> {
    const payload: RoomConstructionCancelledPayload = {
      ...this.buildConstructionBasePayload(context),
      reason: context.reason,
      notes: context.notes,
    };

    return this.wrapEvent(
      RoomLedgerEventType.CONSTRUCTION_CANCELLED,
      `Room construction cancelled: ${context.construction.constructionId}`,
      payload,
    );
  }

  private buildBlueprintBasePayload(
    context: BlueprintContextBase,
  ): RoomBlueprintEventBase {
    return {
      blueprint: this.normalizeBlueprint(context.blueprint),
      initiatedBy: context.initiatedBy,
      minuteTimestampIso: this.toMinuteIso(context.timestamp),
      validation: this.normalizeValidation(context.validation),
    };
  }

  private buildConstructionBasePayload(
    context: ConstructionContextBase,
  ): RoomConstructionEventBase {
    return {
      construction: this.normalizeConstruction(context.construction),
      blueprint: this.normalizeBlueprint(context.blueprint),
      initiatedBy: context.initiatedBy,
      minuteTimestampIso: this.toMinuteIso(context.timestamp),
      validation: this.normalizeValidation(context.validation),
    };
  }

  private normalizeBlueprint(blueprint: RoomBlueprintReference): RoomBlueprintReference {
    const hazards = [...blueprint.hazards].sort();
    const tags = blueprint.tags ? [...blueprint.tags].sort() : undefined;

    return {
      ...blueprint,
      hazards,
      tags,
    };
  }

  private normalizeConstruction(construction: RoomConstructionSite): RoomConstructionSite {
    return {
      ...construction,
      target: this.normalizeTarget(construction.target),
    };
  }

  private normalizeTarget(target: RoomBlueprintApplicationTarget): RoomBlueprintApplicationTarget {
    if (!target) {
      return {};
    }

    return {
      ...target,
    };
  }

  private normalizeValidation(
    validation?: RoomBlueprintValidationHook,
  ): RoomBlueprintValidationHook | undefined {
    if (!validation) {
      return undefined;
    }

    const validators = validation.validators?.length
      ? [...validation.validators].sort()
      : undefined;
    const expectedHazards = validation.expectedHazards?.length
      ? [...validation.expectedHazards].sort()
      : undefined;

    if (!validators && !expectedHazards && !validation.validationNotes) {
      return undefined;
    }

    return {
      validators,
      expectedHazards,
      validationNotes: validation.validationNotes,
    };
  }

  private toMinuteIso(timestamp?: Dayjs): string {
    return (timestamp ?? dayjs()).startOf('minute').toISOString();
  }

  private wrapEvent<T>(
    type: RoomLedgerEventType,
    description: string,
    payload: T,
  ): LedgerEvent<T> {
    return {
      type,
      description,
      payload,
      resourceDelta: this.noOpDelta(),
      apply: () => {},
      reverse: () => {},
    };
  }

  private noOpDelta(): ResourceDelta {
    return {};
  }
}
