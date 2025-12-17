import { HUD_PANEL_CAPABILITY_REGISTRY } from './hud-capability.service';

export interface HudPanelDefinition {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  featureFlag?: string;
  requiresInit?: boolean;
}

const BASE_HUD_OVERLAY_PANELS: HudPanelDefinition[] = [
  { id: 'inventory', label: 'Inventory Ledger', description: 'Stub container for cargo & supplies.', icon: '📦' },
  { id: 'ledger', label: 'Ledger View', description: 'Placeholder for settlement and trade ledgers.', icon: '📜' },
  { id: 'map', label: 'World Maps', description: 'Secondary cartography overlay shell.', icon: '🗺️' },
  { id: 'crew', label: 'Crew', description: 'Manifest and morale summaries TBD.', icon: '👥' },
  { id: 'trade', label: 'Trade', description: 'Market interaction shell placeholder.', icon: '⚖️' },
  { id: 'quests', label: 'Quests', description: 'Tasks and contracts listing shell.', icon: '⭐' },
];

export const HUD_OVERLAY_PANELS: HudPanelDefinition[] = BASE_HUD_OVERLAY_PANELS.map((panel) => ({
  ...panel,
  ...HUD_PANEL_CAPABILITY_REGISTRY[panel.id],
}));

export const HUD_PANEL_IDS = new Set(HUD_OVERLAY_PANELS.map((panel) => panel.id));
