import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HudCapabilityProvider } from './hud-capability.provider';
import { HudCapabilityResolution, HudCapabilitySnapshot } from './hud-capability.models';

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
  private readonly resolution$: BehaviorSubject<HudCapabilityResolution>;
  private readonly loading$ = new BehaviorSubject<boolean>(true);
  private readonly error$ = new BehaviorSubject<string | null>(null);
  // TODO: Replace hardcoded defaults with authoritative capability feed (ledger/config backed).
  private snapshot: HudCapabilitySnapshot = {
    featureFlags: createDefaultFeatureFlags(),
    initializedPanels: new Set<string>(['inventory', 'ledger', 'map']),
  };

  constructor(private readonly provider: HudCapabilityProvider) {
    this.resolution$ = new BehaviorSubject<HudCapabilityResolution>(
      this.provider.getFallbackResolution(),
    );
    this.bootstrap();
  }

  private bootstrap(): void {
    this.loading$.next(true);

    this.provider.loadCapabilities().subscribe({
      next: (resolution) => {
        this.resolution$.next(resolution);
        this.error$.next(resolution.error ?? null);
        this.loading$.next(false);
      },
      error: (error) => {
        this.resolution$.next(this.provider.getFallbackResolution('provider-error'));
        this.error$.next('Failed to load HUD capabilities from ledger/config pipeline.');
        this.loading$.next(false);
        console.error('HUD capability provider error', error);
      },
    });
  }

  getFeatureFlag(flag: string): boolean {
    return !!this.resolution$.value.snapshot.featureFlags[flag];
  }

  isPanelInitialized(panelId: string): boolean {
    return this.resolution$.value.snapshot.initializedPanels.has(panelId);
  }

  updateSnapshot(partial: Partial<HudCapabilitySnapshot>): void {
    this.snapshot = {
      featureFlags: partial.featureFlags ? { ...this.snapshot.featureFlags, ...partial.featureFlags } : this.snapshot.featureFlags,
      initializedPanels: partial.initializedPanels ?? this.snapshot.initializedPanels,
    };
  }

  getSnapshot(): HudCapabilitySnapshot {
    return {
      featureFlags: { ...this.resolution$.value.snapshot.featureFlags },
      initializedPanels: new Set(this.resolution$.value.snapshot.initializedPanels),
    };
  }

  watchResolution(): Observable<HudCapabilityResolution> {
    return this.resolution$.asObservable();
  }

  isLoading(): boolean {
    return this.loading$.value;
  }

  watchLoading(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  getLastError(): string | null {
    return this.error$.value;
  }

  watchErrors(): Observable<string | null> {
    return this.error$.asObservable();
  }

  isFallback(): boolean {
    return this.resolution$.value.fallback;
  }

  getPanelCapability(panelId: string): HudPanelCapabilityRequirement | undefined {
    return HUD_PANEL_CAPABILITY_REGISTRY[panelId];
  }
}
