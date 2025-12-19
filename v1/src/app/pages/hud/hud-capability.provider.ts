import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, delay, map, shareReplay } from 'rxjs/operators';
import { HudCapabilityResolution, HudCapabilitySnapshot, LedgerCapabilityPipelinePayload } from './hud-capability.models';
import { LEDGER_CAPABILITY_PIPELINE_FALLBACK, LEDGER_CAPABILITY_PIPELINE_SNAPSHOT } from './hud-capability.pipeline';

export interface HudCapabilityProviderConfig {
  capabilityEndpoint?: string;
  cacheTtlMs?: number;
}

@Injectable({ providedIn: 'root' })
export class HudCapabilityProvider {
  private capabilityEndpoint = 'ledger/config/hud-capabilities';
  private cacheExpiry = 0;
  private cache$?: Observable<HudCapabilityResolution>;
  private cacheTtlMs = 60_000;

  loadCapabilities(config?: HudCapabilityProviderConfig): Observable<HudCapabilityResolution> {
    this.configure(config);

    const now = Date.now();

    if (!this.cache$ || now > this.cacheExpiry) {
      this.cacheExpiry = now + this.cacheTtlMs;
      this.cache$ = this.resolveFromLedgerConfig(this.capabilityEndpoint).pipe(
        shareReplay({ bufferSize: 1, refCount: true }),
      );
    }

    return this.cache$;
  }

  configure(config?: HudCapabilityProviderConfig): void {
    if (!config) {
      return;
    }

    if (config.cacheTtlMs && config.cacheTtlMs !== this.cacheTtlMs) {
      this.cacheTtlMs = config.cacheTtlMs;
      this.invalidateCache();
    }

    if (config.capabilityEndpoint && config.capabilityEndpoint !== this.capabilityEndpoint) {
      this.capabilityEndpoint = config.capabilityEndpoint;
      this.invalidateCache();
    }
  }

  invalidateCache(): void {
    this.cache$ = undefined;
    this.cacheExpiry = 0;
  }

  getFallbackResolution(reason?: string): HudCapabilityResolution {
    return this.toResolution(LEDGER_CAPABILITY_PIPELINE_FALLBACK, true, reason);
  }

  private resolveFromLedgerConfig(endpoint: string): Observable<HudCapabilityResolution> {
    return of(LEDGER_CAPABILITY_PIPELINE_SNAPSHOT).pipe(
      delay(50),
      map((payload) => this.toResolution(payload, false)),
      catchError((error) => {
        console.error(`Falling back to cached HUD capability snapshot from ${endpoint}`, error);
        return of(
          this.getFallbackResolution(
            'Unable to read HUD capability envelope from ledger/config pipeline; using cached snapshot.',
          ),
        );
      }),
    );
  }

  private toResolution(
    payload: LedgerCapabilityPipelinePayload,
    fallback: boolean,
    error?: string,
  ): HudCapabilityResolution {
    const snapshot: HudCapabilitySnapshot = {
      featureFlags: { ...payload.featureFlags },
      initializedPanels: new Set<string>(payload.initializedPanels),
    };

    return {
      snapshot,
      source: payload.source,
      sequence: payload.sequence,
      generatedAt: payload.generatedAt,
      fallback,
      error,
    };
  }
}
