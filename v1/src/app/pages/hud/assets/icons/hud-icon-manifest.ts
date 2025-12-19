/**
 * HUD Icon Manifest
 * 
 * Maps HUD actions to sprite sheet coordinates and provides metadata
 * for the Kenney Game Icons-based HUD icon system.
 * 
 * Generated for Hanseatic HUD theme with brass/ink recoloring.
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
  kenneyFilename: string;
  spriteSheet: 'hud-icons-16' | 'hud-icons-32';
  coordinates: {
    x: number;
    y: number;
  };
  fallbackGlyph: string;
  license: 'CC0' | 'CC-BY-3.0';
  usage: 'primary' | 'supplemental';
}

// Sprite sheet configurations
export const SPRITE_SHEETS: Record<'hud-icons-16' | 'hud-icons-32', SpriteSheetConfig> = {
  'hud-icons-16': {
    url: './assets/icons/sprites/hud-icons-16.png',
    tileSize: 16,
    scale: 1,
  },
  'hud-icons-32': {
    url: './assets/icons/sprites/hud-icons-32.png', 
    tileSize: 32,
    scale: 2,
  },
};

// HUD Icon mappings based on pilot set from decision log
export const HUD_ICON_MANIFEST: Record<string, HudIconDefinition> = {
  // Primary HUD Actions
  inventory: {
    id: 'inventory',
    name: 'Inventory',
    kenneyFilename: 'backpack.png',
    spriteSheet: 'hud-icons-16',
    coordinates: { x: 0, y: 0 },
    fallbackGlyph: '🎒',
    license: 'CC0',
    usage: 'primary',
  },
  ledger: {
    id: 'ledger',
    name: 'Ledger',
    kenneyFilename: 'ledger.png',
    spriteSheet: 'hud-icons-16',
    coordinates: { x: 16, y: 0 },
    fallbackGlyph: '📋',
    license: 'CC0',
    usage: 'primary',
  },
  map: {
    id: 'map',
    name: 'Map',
    kenneyFilename: 'map.png',
    spriteSheet: 'hud-icons-16',
    coordinates: { x: 32, y: 0 },
    fallbackGlyph: '🗺️',
    license: 'CC0',
    usage: 'primary',
  },
  crew: {
    id: 'crew',
    name: 'Crew',
    kenneyFilename: 'group.png',
    spriteSheet: 'hud-icons-16',
    coordinates: { x: 48, y: 0 },
    fallbackGlyph: '👥',
    license: 'CC0',
    usage: 'primary',
  },
  trade: {
    id: 'trade',
    name: 'Trade',
    kenneyFilename: 'scales.png',
    spriteSheet: 'hud-icons-16',
    coordinates: { x: 64, y: 0 },
    fallbackGlyph: '⚖️',
    license: 'CC0',
    usage: 'primary',
  },
  quests: {
    id: 'quests',
    name: 'Quests',
    kenneyFilename: 'compass.png',
    spriteSheet: 'hud-icons-16',
    coordinates: { x: 80, y: 0 },
    fallbackGlyph: '🧭',
    license: 'CC0',
    usage: 'primary',
  },
  settings: {
    id: 'settings',
    name: 'Settings',
    kenneyFilename: 'cog.png',
    spriteSheet: 'hud-icons-16',
    coordinates: { x: 96, y: 0 },
    fallbackGlyph: '⚙️',
    license: 'CC0',
    usage: 'primary',
  },
  help: {
    id: 'help',
    name: 'Help',
    kenneyFilename: 'question.png',
    spriteSheet: 'hud-icons-16',
    coordinates: { x: 112, y: 0 },
    fallbackGlyph: '❓',
    license: 'CC0',
    usage: 'primary',
  },

  // Header Icons
  status: {
    id: 'status',
    name: 'Status',
    kenneyFilename: 'anchor.png',
    spriteSheet: 'hud-icons-16',
    coordinates: { x: 0, y: 16 },
    fallbackGlyph: '⚓',
    license: 'CC0',
    usage: 'primary',
  },
  notifications: {
    id: 'notifications',
    name: 'Notifications',
    kenneyFilename: 'bell.png',
    spriteSheet: 'hud-icons-16',
    coordinates: { x: 16, y: 16 },
    fallbackGlyph: '🔔',
    license: 'CC0',
    usage: 'primary',
  },

  // Fallback icons (Game-Icons.net if Kenney lacks coverage)
  questStar: {
    id: 'quest-star',
    name: 'Quest Achievement',
    kenneyFilename: 'star.png',
    spriteSheet: 'hud-icons-16',
    coordinates: { x: 32, y: 16 },
    fallbackGlyph: '⭐',
    license: 'CC0',
    usage: 'supplemental',
  },
  ledgerBook: {
    id: 'ledger-book',
    name: 'Ledger Book',
    kenneyFilename: 'book.png',
    spriteSheet: 'hud-icons-16',
    coordinates: { x: 48, y: 16 },
    fallbackGlyph: '📚',
    license: 'CC0',
    usage: 'supplemental',
  },
};

// Utility functions
export function getIconDefinition(iconId: string): HudIconDefinition | null {
  return HUD_ICON_MANIFEST[iconId] || null;
}

export function getIconSpriteUrl(iconId: string, size: '16' | '32' = '16'): string {
  const icon = getIconDefinition(iconId);
  if (!icon) return '';
  
  const spriteSheet = size === '32' ? 'hud-icons-32' : 'hud-icons-16';
  return SPRITE_SHEETS[spriteSheet].url;
}

export function getIconCoordinates(iconId: string): { x: number; y: number } | null {
  const icon = getIconDefinition(iconId);
  return icon ? icon.coordinates : null;
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