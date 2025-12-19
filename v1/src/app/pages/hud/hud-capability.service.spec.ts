import { of, throwError } from 'rxjs';
import { HudCapabilityProvider } from './hud-capability.provider';
import { HudCapabilityResolution } from './hud-capability.models';
import { HudCapabilityService } from './hud-capability.service';

describe('HudCapabilityService capability feed handling', () => {
  let provider: HudCapabilityProvider;

  beforeEach(() => {
    provider = new HudCapabilityProvider();
  });

  it('prefers feed snapshots over defaults when ledger/config is available', () => {
    const feedResolution: HudCapabilityResolution = {
      snapshot: {
        featureFlags: { inventory: true, ledger: true, map: false },
        initializedPanels: new Set(['inventory', 'ledger']),
      },
      source: 'ledger/config bootstrap',
      sequence: 'seq-test-001',
      generatedAt: '2025-01-01T00:00:00Z',
      fallback: false,
    };

    spyOn(provider, 'loadCapabilities').and.returnValue(of(feedResolution));
    spyOn(provider, 'getFallbackResolution').and.callThrough();

    const service = new HudCapabilityService(provider);

    expect(provider.loadCapabilities).toHaveBeenCalledWith({ capabilityEndpoint: 'ledger/config/hud-capabilities' });
    expect(service.getFeatureFlag('map')).toBeFalse();
    expect(service.isFallback()).toBeFalse();
    expect(service.getLastError()).toBeNull();
  });

  it('falls back to deterministic defaults when the provider feed fails', () => {
    const fallbackResolution: HudCapabilityResolution = {
      snapshot: {
        featureFlags: { inventory: true },
        initializedPanels: new Set(['inventory']),
      },
      source: 'test-fallback',
      sequence: 'seq-fallback-001',
      generatedAt: '2024-01-01T00:00:00Z',
      fallback: true,
    };

    spyOn(provider, 'loadCapabilities').and.returnValue(throwError(() => new Error('feed-down')));
    spyOn(provider, 'getFallbackResolution').and.returnValue(fallbackResolution);

    const service = new HudCapabilityService(provider);

    expect(provider.getFallbackResolution).toHaveBeenCalledWith('provider-error');
    expect(service.getFeatureFlag('quests')).toBeTrue();
    expect(service.getLastError()).toContain('Failed to load HUD capabilities');
    expect(service.isFallback()).toBeTrue();
  });

  it('invalidates cached feed when refreshing against a new endpoint', () => {
    const loadSpy = spyOn(provider, 'loadCapabilities').and.returnValue(of(provider.getFallbackResolution('bootstrap')));
    const invalidateSpy = spyOn(provider, 'invalidateCache').and.callThrough();

    const service = new HudCapabilityService(provider);

    service.refreshCapabilities('ledger/config/hud-capabilities-dev');

    expect(invalidateSpy).toHaveBeenCalled();
    expect(loadSpy).toHaveBeenCalledWith({ capabilityEndpoint: 'ledger/config/hud-capabilities-dev' });
  });
});
