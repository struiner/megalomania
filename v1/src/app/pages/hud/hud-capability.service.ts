import { Injectable } from '@angular/core';

export interface HudCapabilitySnapshot {
  featureFlags: Record<string, boolean>;
  initializedPanels: Set<string>;
}

@Injectable({ providedIn: 'root' })
export class HudCapabilityService {
  // TODO: Replace hardcoded defaults with authoritative capability feed (ledger/config backed).
  private snapshot: HudCapabilitySnapshot = {
    featureFlags: {
      inventory: true,
      ledger: true,
      map: true,
      crew: true,
      trade: true,
      quests: true,
    },
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
      featureFlags: partial.featureFlags ?? this.snapshot.featureFlags,
      initializedPanels: partial.initializedPanels ?? this.snapshot.initializedPanels,
    };
  }

  getSnapshot(): HudCapabilitySnapshot {
    return {
      featureFlags: { ...this.snapshot.featureFlags },
      initializedPanels: new Set(this.snapshot.initializedPanels),
    };
  }
}
