import { HUD_OVERLAY_PANELS } from './hud-panel-registry';
import { HudAvailabilityService } from './hud-availability.service';
import { HudCapabilityService } from './hud-capability.service';

describe('HudAvailabilityService capability gating', () => {
  let capabilityService: HudCapabilityService;
  let service: HudAvailabilityService;

  beforeEach(() => {
    capabilityService = new HudCapabilityService();
    service = new HudAvailabilityService(capabilityService);
  });

  it('applies feature flag requirements from the capability registry', () => {
    const tradePanel = HUD_OVERLAY_PANELS.find((panel) => panel.id === 'trade');

    expect(tradePanel?.featureFlag).toBe('trade');

    capabilityService.updateSnapshot({ featureFlags: { trade: false } });
    const decision = service.evaluatePanel(tradePanel!);

    expect(decision.allowed).toBeFalse();
    expect(decision.blockedBy).toBe('featureFlag');
    expect(decision.reason).toContain('feature flag trade');
  });

  it('blocks panels awaiting initialization when required by capability registry', () => {
    const crewPanel = HUD_OVERLAY_PANELS.find((panel) => panel.id === 'crew');

    capabilityService.updateSnapshot({ initializedPanels: new Set(['inventory', 'ledger']) });
    const decision = service.evaluatePanel(crewPanel!);

    expect(decision.allowed).toBeFalse();
    expect(decision.blockedBy).toBe('initialization');
  });

  it('allows panels that are both enabled and initialized', () => {
    const inventoryPanel = HUD_OVERLAY_PANELS.find((panel) => panel.id === 'inventory');

    const decision = service.evaluatePanel(inventoryPanel!);

    expect(decision.allowed).toBeTrue();
  });
});
