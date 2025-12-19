/**
 * HUD Icon Manifest
 * 
 * Maps HUD actions to sprite sheet coordinates and provides metadata
 * for the brass/copper HUD icon system.
 */

// Sprite sheet configuration
export interface SpriteSheetConfig {
  url: string;
  tileSize: number;
  scale: number;
}

// HUD Icon manifest structure
export interface HudIconDefinition {
  id: string;
  name: string;
  kenneyFilename?: string;
  spriteSheet?: 'hud-icons-16' | 'hud-icons-24';
  coordinates?: {
    x: number;
    y: number;
  };
  url16?: string;
  url24?: string;
  fallbackGlyph: string;
  license: 'CC0' | 'CC-BY-3.0';
  usage: 'primary' | 'supplemental';
}

// Sprite sheet configurations
export const SPRITE_SHEETS: Record<'hud-icons-16' | 'hud-icons-24', SpriteSheetConfig> = {
  'hud-icons-16': {
    url: './assets/icons/sprites/hud-icons-16.png',
    tileSize: 16,
    scale: 1,
  },
  'hud-icons-24': {
    url: './assets/icons/sprites/hud-icons-24.png', 
    tileSize: 24,
    scale: 1.5,
  },
};

// HUD Icon mappings based on pilot set from decision log
export const HUD_ICON_MANIFEST: Record<string, HudIconDefinition> = {
  // Primary HUD Actions
  inventory: {
    id: 'inventory',
    name: 'Inventory',
    url16: '/assets/hud/icons/inventory-16.svg',
    url24: '/assets/hud/icons/inventory-24.svg',
    fallbackGlyph: '🎒',
    license: 'CC0',
    usage: 'primary',
  },
  ledger: {
    id: 'ledger',
    name: 'Ledger',
    url16: '/assets/hud/icons/ledger-16.svg',
    url24: '/assets/hud/icons/ledger-24.svg',
    fallbackGlyph: '📋',
    license: 'CC0',
    usage: 'primary',
  },
  map: {
    id: 'map',
    name: 'Map',
    url16: '/assets/hud/icons/map-16.svg',
    url24: '/assets/hud/icons/map-24.svg',
    fallbackGlyph: '🗺️',
    license: 'CC0',
    usage: 'primary',
  },
  crew: {
    id: 'crew',
    name: 'Crew',
    url16: '/assets/hud/icons/crew-16.svg',
    url24: '/assets/hud/icons/crew-24.svg',
    fallbackGlyph: '👥',
    license: 'CC0',
    usage: 'primary',
  },
  trade: {
    id: 'trade',
    name: 'Trade',
    url16: '/assets/hud/icons/trade-16.svg',
    url24: '/assets/hud/icons/trade-24.svg',
    fallbackGlyph: '⚖️',
    license: 'CC0',
    usage: 'primary',
  },
  quests: {
    id: 'quests',
    name: 'Quests',
    url16: '/assets/hud/icons/quests-16.svg',
    url24: '/assets/hud/icons/quests-24.svg',
    fallbackGlyph: '🧭',
    license: 'CC0',
    usage: 'primary',
  },
  settings: {
    id: 'settings',
    name: 'Settings',
    url16: '/assets/hud/icons/settings-16.svg',
    url24: '/assets/hud/icons/settings-24.svg',
    fallbackGlyph: '⚙️',
    license: 'CC0',
    usage: 'primary',
  },
  help: {
    id: 'help',
    name: 'Help',
    url16: '/assets/hud/icons/help-16.svg',
    url24: '/assets/hud/icons/help-24.svg',
    fallbackGlyph: '❓',
    license: 'CC0',
    usage: 'primary',
  },

  // Header Icons
  status: {
    id: 'status',
    name: 'Status',
    url16: '/assets/hud/icons/status-16.svg',
    url24: '/assets/hud/icons/status-24.svg',
    fallbackGlyph: '⚓',
    license: 'CC0',
    usage: 'primary',
  },
  notifications: {
    id: 'notifications',
    name: 'Notifications',
    url16: '/assets/hud/icons/notifications-16.svg',
    url24: '/assets/hud/icons/notifications-24.svg',
    fallbackGlyph: '🔔',
    license: 'CC0',
    usage: 'primary',
  },

  helm: {
    id: 'helm',
    name: 'Navigation Helm',
    url16: '/assets/hud/icons/helm-16.svg',
    url24: '/assets/hud/icons/helm-24.svg',
    fallbackGlyph: '⛵',
    license: 'CC0',
    usage: 'primary',
  },
  cargo: {
    id: 'cargo',
    name: 'Cargo',
    url16: '/assets/hud/icons/cargo-16.svg',
    url24: '/assets/hud/icons/cargo-24.svg',
    fallbackGlyph: '📦',
    license: 'CC0',
    usage: 'primary',
  },
  diplomacy: {
    id: 'diplomacy',
    name: 'Diplomacy',
    url16: '/assets/hud/icons/diplomacy-16.svg',
    url24: '/assets/hud/icons/diplomacy-24.svg',
    fallbackGlyph: '🤝',
    license: 'CC0',
    usage: 'primary',
  },
  harbor: {
    id: 'harbor',
    name: 'Harbor',
    url16: '/assets/hud/icons/harbor-16.svg',
    url24: '/assets/hud/icons/harbor-24.svg',
    fallbackGlyph: '🚢',
    license: 'CC0',
    usage: 'primary',
  },
  scouting: {
    id: 'scouting',
    name: 'Scouting',
    url16: '/assets/hud/icons/scouting-16.svg',
    url24: '/assets/hud/icons/scouting-24.svg',
    fallbackGlyph: '🔭',
    license: 'CC0',
    usage: 'primary',
  },
  craft: {
    id: 'craft',
    name: 'Craft',
    url16: '/assets/hud/icons/craft-16.svg',
    url24: '/assets/hud/icons/craft-24.svg',
    fallbackGlyph: '🔨',
    license: 'CC0',
    usage: 'primary',
  },
};

// Utility functions
export function getIconDefinition(iconId: string): HudIconDefinition | null {
  return HUD_ICON_MANIFEST[iconId] || null;
}

export function getIconSpriteUrl(iconId: string, size: '16' | '24' = '16'): string {
  const icon = getIconDefinition(iconId);
  if (!icon) return '';

  if (size === '24' && icon.url24) {
    return icon.url24;
  }
  if (size === '16' && icon.url16) {
    return icon.url16;
  }

  const spriteSheet = size === '24' ? 'hud-icons-24' : 'hud-icons-16';
  return SPRITE_SHEETS[spriteSheet].url;
}

export function getIconCoordinates(iconId: string): { x: number; y: number } | null {
  const icon = getIconDefinition(iconId);
  return icon && icon.coordinates ? icon.coordinates : null;
}

export function getFallbackGlyph(iconId: string): string | null {
  const icon = getIconDefinition(iconId);
  return icon ? icon.fallbackGlyph : null;
}

export function getAllIconsByUsage(usage: 'primary' | 'supplemental'): HudIconDefinition[] {
  return Object.values(HUD_ICON_MANIFEST).filter(icon => icon.usage === usage);
}

// Attribution strings for licensing compliance
export const ATTRIBUTION_STRINGS = {
  'kenney': 'Icons by Kenney (CC0 1.0) - https://kenney.nl',
  'game-icons-net': 'Icons by Lorc, Delapouite & contributors (CC BY 3.0) - https://game-icons.net',
  '0x72': 'Sprites by 0x72 (CC0 1.0) - https://0x72.itch.io',
};

// Export for tree-shaking and bundle analysis
export const HUD_ICON_CONSTANTS = {
  SPRITE_SHEETS,
  HUD_ICON_MANIFEST,
  ATTRIBUTION_STRINGS,
} as const;
