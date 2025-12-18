import { Injectable } from '@angular/core';
import dayjs, { Dayjs } from 'dayjs';
import { PlayerID, Hash128 } from '../models/anna-readme.models';
import {
  LedgerEvent,
  ResearchCancelledPayload,
  ResearchCompletedPayload,
  CrossPlayerResearchValidation,
  ResearchLedgerEventType,
  ResearchStartedPayload,
  ResourceDelta,
} from '../models/ledger.models';
import { TechResearchPointer } from '../models/tech-tree.models';

interface ResearchContextBase {
  researchId: string;
  tech: TechResearchPointer;
  initiatedBy: PlayerID;
  validators?: PlayerID[];
  timestamp?: Dayjs;
}

interface ResearchStartContext extends ResearchContextBase {
  source?: ResearchStartedPayload['source'];
  initiatingCharacterId?: string;
}

interface ResearchCompleteContext extends ResearchContextBase {
  completionProof?: Hash128;
  completionNotes?: string;
}

interface ResearchCancellationContext extends ResearchContextBase {
  cancelledBy: PlayerID;
  reason: ResearchCancelledPayload['reason'];
  cancellationNotes?: string;
}

@Injectable({ providedIn: 'root' })
export class TechLedgerService {
  createResearchStartEvent(
    context: ResearchStartContext,
  ): LedgerEvent<ResearchStartedPayload> {
    const payload: ResearchStartedPayload = {
      researchId: context.researchId,
      tech: context.tech,
      initiatedBy: context.initiatedBy,
      minuteTimestampIso: this.toMinuteIso(context.timestamp),
      crossPlayerValidation: this.buildCrossValidation(
        context.validators,
        context.tech.cultureTags,
      ),
      source: context.source ?? 'player',
      initiatingCharacterId: context.initiatingCharacterId,
    };

    return {
      type: ResearchLedgerEventType.RESEARCH_START,
      description: `Research started for ${context.tech.nodeId} (${context.tech.techTreeId})`,
      payload,
      resourceDelta: this.noOpDelta(),
      apply: () => {},
      reverse: () => {},
    };
  }

  createResearchCompleteEvent(
    context: ResearchCompleteContext,
  ): LedgerEvent<ResearchCompletedPayload> {
    const payload: ResearchCompletedPayload = {
      researchId: context.researchId,
      tech: context.tech,
      initiatedBy: context.initiatedBy,
      minuteTimestampIso: this.toMinuteIso(context.timestamp),
      crossPlayerValidation: this.buildCrossValidation(
        context.validators,
        context.tech.cultureTags,
      ),
      completionProof: context.completionProof,
      completionNotes: context.completionNotes,
    };

    return {
      type: ResearchLedgerEventType.RESEARCH_COMPLETE,
      description: `Research completed for ${context.tech.nodeId} (${context.tech.techTreeId})`,
      payload,
      resourceDelta: this.noOpDelta(),
      apply: () => {},
      reverse: () => {},
    };
  }

  createResearchCancelledEvent(
    context: ResearchCancellationContext,
  ): LedgerEvent<ResearchCancelledPayload> {
    const payload: ResearchCancelledPayload = {
      researchId: context.researchId,
      tech: context.tech,
      initiatedBy: context.initiatedBy,
      minuteTimestampIso: this.toMinuteIso(context.timestamp),
      crossPlayerValidation: this.buildCrossValidation(
        context.validators,
        context.tech.cultureTags,
      ),
      cancelledBy: context.cancelledBy,
      reason: context.reason,
      cancellationNotes: context.cancellationNotes,
    };

    return {
      type: ResearchLedgerEventType.RESEARCH_CANCELLED,
      description: `Research cancelled for ${context.tech.nodeId} (${context.tech.techTreeId})`,
      payload,
      resourceDelta: this.noOpDelta(),
      apply: () => {},
      reverse: () => {},
    };
  }

  private toMinuteIso(timestamp?: Dayjs): string {
    return (timestamp ?? dayjs()).startOf('minute').toISOString();
  }

  private buildCrossValidation(
    validators?: PlayerID[],
    expectedCultureTags?: TechResearchPointer['cultureTags'],
  ): CrossPlayerResearchValidation | undefined {
    if (!validators?.length) {
      return undefined;
    }

    return {
      validators,
      expectedCultureTags,
      validationNotes: 'Hook for cross-player signature and culture-tag validation.',
    };
  }

  private noOpDelta(): ResourceDelta {
    return {};
  }
}
