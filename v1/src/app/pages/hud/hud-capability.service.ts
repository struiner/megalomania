import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HudCapabilityProvider, HudCapabilityProviderConfig } from './hud-capability.provider';
import { HudCapabilityResolution, HudCapabilitySnapshot, LedgerCapabilityPipelinePayload } from './hud-capability.models';

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

type CapabilityFeedSnapshot = HudCapabilitySnapshot | LedgerCapabilityPipelinePayload | undefined;

function createDefaultFeatureFlags(snapshot?: CapabilityFeedSnapshot, forceDefaults = false): Record<string, boolean> {
  if (!forceDefaults && snapshot?.featureFlags && Object.keys(snapshot.featureFlags).length) {
    return { ...snapshot.featureFlags };
  }

  return Object.values(HUD_PANEL_CAPABILITY_REGISTRY).reduce((flags, requirement) => {
    if (requirement.featureFlag) {
      flags[requirement.featureFlag] = true;
    }

    return flags;
  }, {} as Record<string, boolean>);
}

function createInitializedPanels(snapshot?: CapabilityFeedSnapshot, forceDefaults = false): Set<string> {
  if (!forceDefaults) {
    if (snapshot?.initializedPanels instanceof Set) {
      return new Set<string>(snapshot.initializedPanels);
    }

    if (Array.isArray(snapshot?.initializedPanels)) {
      return new Set<string>(snapshot.initializedPanels);
    }
  }

  return new Set<string>(['inventory']);
}

@Injectable({ providedIn: 'root' })
export class HudCapabilityService {
  private readonly resolution$: BehaviorSubject<HudCapabilityResolution>;
  private readonly loading$ = new BehaviorSubject<boolean>(true);
  private readonly error$ = new BehaviorSubject<string | null>(null);
  private snapshot: HudCapabilitySnapshot;
  private capabilityEndpoint = 'ledger/config/hud-capabilities';

  constructor(private readonly provider: HudCapabilityProvider) {
    const fallbackResolution = this.provider.getFallbackResolution();
    this.snapshot = this.buildSnapshot(fallbackResolution.snapshot);

    this.resolution$ = new BehaviorSubject<HudCapabilityResolution>({
      ...fallbackResolution,
      snapshot: this.snapshot,
    });

    this.bootstrap();
  }

  configureProvider(config?: HudCapabilityProviderConfig): void {
    if (!config) {
      return;
    }

    if (config.capabilityEndpoint) {
      this.capabilityEndpoint = config.capabilityEndpoint;
    }

    this.provider.configure(config);
    this.refreshCapabilities();
  }

  refreshCapabilities(endpoint = this.capabilityEndpoint): void {
    this.capabilityEndpoint = endpoint;
    this.provider.invalidateCache();
    this.bootstrap(endpoint);
  }

  private bootstrap(endpoint = this.capabilityEndpoint): void {
    this.loading$.next(true);

    this.provider.loadCapabilities({ capabilityEndpoint: endpoint }).subscribe({
      next: (resolution) => {
        const forceDefaults = resolution.fallback && !!resolution.error;
        this.applyResolution(resolution, forceDefaults);
        this.error$.next(resolution.error ?? null);
        this.loading$.next(false);
      },
      error: (error) => {
        this.handleProviderError(error, endpoint);
      },
    });
  }

  private applyResolution(resolution: HudCapabilityResolution, forceDefaults = false): void {
    this.snapshot = this.buildSnapshot(resolution.snapshot, forceDefaults);

    this.resolution$.next({
      ...resolution,
      snapshot: this.snapshot,
    });
  }

  private handleProviderError(error: unknown, endpoint: string): void {
    const fallbackResolution = this.provider.getFallbackResolution('provider-error');
    this.applyResolution(fallbackResolution, true);
    this.error$.next('Failed to load HUD capabilities from ledger/config pipeline. Using default HUD capability flags.');
    this.loading$.next(false);
    console.error(`HUD capability provider error for endpoint "${endpoint}"`, error);
  }

  private buildSnapshot(snapshot?: CapabilityFeedSnapshot, forceDefaults = false): HudCapabilitySnapshot {
    return {
      featureFlags: createDefaultFeatureFlags(snapshot, forceDefaults),
      initializedPanels: createInitializedPanels(snapshot, forceDefaults),
    };
  }

  getFeatureFlag(flag: string): boolean {
    return !!this.snapshot.featureFlags[flag];
  }

  isPanelInitialized(panelId: string): boolean {
    return this.snapshot.initializedPanels.has(panelId);
  }

  updateSnapshot(partial: Partial<HudCapabilitySnapshot>): void {
    this.snapshot = {
      featureFlags: partial.featureFlags ? { ...this.snapshot.featureFlags, ...partial.featureFlags } : this.snapshot.featureFlags,
      initializedPanels: partial.initializedPanels
        ? new Set(partial.initializedPanels)
        : new Set(this.snapshot.initializedPanels),
    };

    this.resolution$.next({
      ...this.resolution$.value,
      snapshot: this.snapshot,
    });
  }

  getSnapshot(): HudCapabilitySnapshot {
    return {
      featureFlags: { ...this.snapshot.featureFlags },
      initializedPanels: new Set(this.snapshot.initializedPanels),
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
