export interface HudCapabilitySnapshot {
  featureFlags: Record<string, boolean>;
  initializedPanels: Set<string>;
}

export interface LedgerCapabilityPipelinePayload {
  featureFlags: Record<string, boolean>;
  initializedPanels: string[];
  source: string;
  sequence: string;
  generatedAt: string;
}

export interface HudCapabilityResolution {
  snapshot: HudCapabilitySnapshot;
  source: string;
  sequence: string;
  generatedAt: string;
  fallback: boolean;
  error?: string;
}
