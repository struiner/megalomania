import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HudCapabilityProvider } from './hud-capability.provider';
import { HudCapabilityResolution, HudCapabilitySnapshot } from './hud-capability.models';

@Injectable({ providedIn: 'root' })
export class HudCapabilityService {
  private readonly resolution$ = new BehaviorSubject<HudCapabilityResolution>(
    this.provider.getFallbackResolution(),
  );
  private readonly loading$ = new BehaviorSubject<boolean>(true);
  private readonly error$ = new BehaviorSubject<string | null>(null);

  constructor(private readonly provider: HudCapabilityProvider) {
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
}
