import { Injectable } from '@angular/core';

export interface HudCapabilitySnapshot {
  featureFlags: Record<string, boolean>;
  initializedPanels: Set<string>;
}

export interface HudPanelCapabilityRequirement {
  featureFlag?: string;
  requiresInit?: boolean;
}

export const HUD_PANEL_CAPABILITY_REGISTRY: Record<string, HudPanelCapabilityRequirement> = {
  inventory: { featureFlag: 'inventory', requiresInit: true },
  ledger: { featureFlag: 'ledger', requiresInit: true },
  map: { featureFlag: 'map', requiresInit: true },
  crew: { featureFlag: 'crew', requiresInit: true },
  trade: { featureFlag: 'trade', requiresInit: true },
  quests: { featureFlag: 'quests', requiresInit: true },
};

function createDefaultFeatureFlags(): Record<string, boolean> {
  return Object.values(HUD_PANEL_CAPABILITY_REGISTRY).reduce((flags, requirement) => {
    if (requirement.featureFlag) {
      flags[requirement.featureFlag] = true;
    }

    return flags;
  }, {} as Record<string, boolean>);
}

@Injectable({ providedIn: 'root' })
export class HudCapabilityService {
  // TODO: Replace hardcoded defaults with authoritative capability feed (ledger/config backed).
  private snapshot: HudCapabilitySnapshot = {
    featureFlags: createDefaultFeatureFlags(),
    initializedPanels: new Set<string>(['inventory', 'ledger', 'map']),
  };

  getFeatureFlag(flag: string): boolean {
    return !!this.snapshot.featureFlags[flag];
  }

  isPanelInitialized(panelId: string): boolean {
    return this.snapshot.initializedPanels.has(panelId);
  }

  updateSnapshot(partial: Partial<HudCapabilitySnapshot>): void {
    this.snapshot = {
      featureFlags: partial.featureFlags ? { ...this.snapshot.featureFlags, ...partial.featureFlags } : this.snapshot.featureFlags,
      initializedPanels: partial.initializedPanels ?? this.snapshot.initializedPanels,
    };
  }

  getSnapshot(): HudCapabilitySnapshot {
    return {
      featureFlags: { ...this.snapshot.featureFlags },
      initializedPanels: new Set(this.snapshot.initializedPanels),
    };
  }

  getPanelCapability(panelId: string): HudPanelCapabilityRequirement | undefined {
    return HUD_PANEL_CAPABILITY_REGISTRY[panelId];
  }
}
