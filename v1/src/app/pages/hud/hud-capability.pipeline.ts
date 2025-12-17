import { LedgerCapabilityPipelinePayload } from './hud-capability.models';

export const LEDGER_CAPABILITY_PIPELINE_SNAPSHOT: LedgerCapabilityPipelinePayload = {
  featureFlags: {
    inventory: true,
    ledger: true,
    map: true,
    crew: false,
    trade: false,
    quests: false,
  },
  initializedPanels: ['inventory', 'ledger', 'map'],
  source: 'ledger/config bootstrap',
  sequence: 'genesis-capability-rollup-014',
  generatedAt: '2024-12-12T07:00:00Z',
};

export const LEDGER_CAPABILITY_PIPELINE_FALLBACK: LedgerCapabilityPipelinePayload = {
  featureFlags: {
    inventory: true,
    ledger: true,
    map: true,
  },
  initializedPanels: ['inventory'],
  source: 'static-fallback',
  sequence: 'hud-defaults-001',
  generatedAt: '2024-01-01T00:00:00Z',
};
