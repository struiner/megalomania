import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HudPanelDefinition } from './hud-panel-registry';
import { HudCapabilityService } from './hud-capability.service';

export type HudPanelGateReason = 'featureFlag' | 'initialization' | 'capabilityLoad' | 'capabilityError';

export interface HudPanelGateDecision {
  allowed: boolean;
  reason?: string;
  blockedBy?: HudPanelGateReason;
}

export interface HudPanelBlockNotice {
  panelId: string;
  panelLabel: string;
  decision: HudPanelGateDecision;
}

@Injectable({ providedIn: 'root' })
export class HudAvailabilityService {
  private readonly blockedPanels$ = new Subject<HudPanelBlockNotice>();

  constructor(private readonly capabilities: HudCapabilityService) {}

  evaluatePanel(panel: HudPanelDefinition): HudPanelGateDecision {
    if (this.capabilities.isLoading()) {
      return {
        allowed: false,
        blockedBy: 'capabilityLoad',
        reason: 'HUD capability snapshot is still loading from ledger/config.',
      };
    }

    const snapshot = this.capabilities.getSnapshot();

    if (panel.featureFlag && !this.capabilities.getFeatureFlag(panel.featureFlag)) {
      return {
        allowed: false,
        blockedBy: 'featureFlag',
        reason: this.enrichReason(`"${panel.label}" is gated by feature flag ${panel.featureFlag}.`),
      };
    }

    if (panel.requiresInit && !snapshot.initializedPanels.has(panel.id)) {
      return {
        allowed: false,
        blockedBy: 'initialization',
        reason: this.enrichReason(`"${panel.label}" is not ready; initialization pending.`),
      };
    }

    const capability = this.capabilities.getPanelCapability(panel.id);
    const featureFlag = panel.featureFlag ?? capability?.featureFlag;
    const requiresInit = panel.requiresInit ?? capability?.requiresInit;

    if (featureFlag && !this.capabilities.getFeatureFlag(featureFlag)) {
      return {
        allowed: false,
        blockedBy: 'featureFlag',
        reason: this.enrichReason(`"${panel.label}" is gated by feature flag ${featureFlag}.`),
      };
    }

    if (requiresInit && !this.capabilities.isPanelInitialized(panel.id)) {
      return {
        allowed: false,
        blockedBy: 'initialization',
        reason: this.enrichReason(`"${panel.label}" is not ready; initialization pending.`),
      };
    }

    return { allowed: true };
  }

  announceBlockedPanel(panel: HudPanelDefinition, decision: HudPanelGateDecision): void {
    this.blockedPanels$.next({
      panelId: panel.id,
      panelLabel: panel.label,
      decision,
    });
  }

  getBlockedPanels(): Observable<HudPanelBlockNotice> {
    return this.blockedPanels$.asObservable();
  }

  private enrichReason(reason: string): string {
    if (!this.capabilities.isFallback() && !this.capabilities.getLastError()) {
      return reason;
    }

    const errorSuffix = this.capabilities.getLastError()
      ? ` Feed notice: ${this.capabilities.getLastError()}`
      : ' Using cached capability snapshot.';

    return `${reason} ${errorSuffix}`;
  }
}
