import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HudPanelDefinition } from './hud-panel-registry';
import { HudCapabilityService } from './hud-capability.service';

export interface HudPanelGateDecision {
  allowed: boolean;
  reason?: string;
  blockedBy?: 'featureFlag' | 'initialization';
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
    const capability = this.capabilities.getPanelCapability(panel.id);
    const featureFlag = panel.featureFlag ?? capability?.featureFlag;
    const requiresInit = panel.requiresInit ?? capability?.requiresInit;

    if (featureFlag && !this.capabilities.getFeatureFlag(featureFlag)) {
      return {
        allowed: false,
        blockedBy: 'featureFlag',
        reason: `${panel.label} is gated by feature flag ${featureFlag}.`,
      };
    }

    if (requiresInit && !this.capabilities.isPanelInitialized(panel.id)) {
      return {
        allowed: false,
        blockedBy: 'initialization',
        reason: `${panel.label} is not ready; initialization pending.`,
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
}
