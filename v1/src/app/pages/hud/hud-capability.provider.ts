import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, delay, map, shareReplay } from 'rxjs/operators';
import { HudCapabilityResolution, HudCapabilitySnapshot, LedgerCapabilityPipelinePayload } from './hud-capability.models';
import { LEDGER_CAPABILITY_PIPELINE_FALLBACK, LEDGER_CAPABILITY_PIPELINE_SNAPSHOT } from './hud-capability.pipeline';

@Injectable({ providedIn: 'root' })
export class HudCapabilityProvider {
  private cacheExpiry = 0;
  private cache$?: Observable<HudCapabilityResolution>;
  private readonly cacheTtlMs = 60_000;

  loadCapabilities(): Observable<HudCapabilityResolution> {
    const now = Date.now();

    if (!this.cache$ || now > this.cacheExpiry) {
      this.cacheExpiry = now + this.cacheTtlMs;
      this.cache$ = this.resolveFromLedgerConfig().pipe(shareReplay({ bufferSize: 1, refCount: true }));
    }

    return this.cache$;
  }

  getFallbackResolution(reason?: string): HudCapabilityResolution {
    return this.toResolution(LEDGER_CAPABILITY_PIPELINE_FALLBACK, true, reason);
  }

  private resolveFromLedgerConfig(): Observable<HudCapabilityResolution> {
    return of(LEDGER_CAPABILITY_PIPELINE_SNAPSHOT).pipe(
      delay(50),
      map((payload) => this.toResolution(payload, false)),
      catchError((error) => {
        console.error('Falling back to cached HUD capability snapshot', error);
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
