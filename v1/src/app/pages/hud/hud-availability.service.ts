import { Injectable } from '@angular/core';
import { HudPanelDefinition } from './hud-panel-registry';

export interface HudPanelGateDecision {
  allowed: boolean;
  reason?: string;
  blockedBy?: 'featureFlag' | 'initialization';
}

@Injectable({ providedIn: 'root' })
export class HudAvailabilityService {
  // TODO: Replace stubbed feature flag map with live capability service once available.
  private readonly featureFlags: Record<string, boolean> = {
    inventory: true,
    ledger: true,
    map: true,
    crew: true,
    trade: true,
    quests: true,
  };

  // TODO: Wire initialization readiness to actual HUD bootstrap lifecycle.
  private readonly initializedPanels = new Set<string>(['inventory', 'ledger', 'map']);

  evaluatePanel(panel: HudPanelDefinition): HudPanelGateDecision {
    if (panel.featureFlag && !this.featureFlags[panel.featureFlag]) {
      return {
        allowed: false,
        blockedBy: 'featureFlag',
        reason: `${panel.label} is gated by feature flag ${panel.featureFlag}.`,
      };
    }

    if (panel.requiresInit && !this.initializedPanels.has(panel.id)) {
      return {
        allowed: false,
        blockedBy: 'initialization',
        reason: `${panel.label} is not ready; initialization pending.`,
      };
    }

    return { allowed: true };
  }
}
