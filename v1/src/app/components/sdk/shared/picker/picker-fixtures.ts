import { PickerItem, PickerAdapter, PickerConfig, DEFAULT_PICKER_CONFIG } from './picker.types';

/**
 * Mock icon service for testing
 */
export class MockIconService {
  private iconMap = new Map<string, string>([
    // Goods icons
    ['wood', 'tree'],
    ['steel', 'metal'],
    ['electronics', 'chip'],
    ['cloth', 'fabric'],
    ['food', 'utensils'],
    ['water', 'droplet'],
    
    // Hazard icons
    ['fire', 'flame'],
    ['flood', 'wave'],
    ['electrical', 'lightning'],
    ['intrusion', 'shield'],
    ['vacuum', 'space'],
    ['radiation', 'atom'],
    
    // Structure icons
    ['house', 'home'],
    ['barracks', 'building'],
    ['tower', 'tower'],
    ['harbor', 'anchor'],
    ['mine', 'pickaxe'],
    ['workshop', 'tools'],
    
    // Biome icons
    ['forest', 'trees'],
    ['desert', 'cactus'],
    ['ocean', 'waves'],
    ['mountain', 'mountain'],
    ['grassland', 'grass']
  ]);

  getIcon(iconName: string): string {
    return this.iconMap.get(iconName) || 'circle';
  }
}

/**
 * Base fixture adapter for testing
 */
export abstract class BaseFixtureAdapter<T extends PickerItem> implements PickerAdapter<T> {
  protected items: T[];
  protected iconService: MockIconService;

  constructor(items: T[]) {
    this.items = [...items];
    this.iconService = new MockIconService();
  }

  getItems(): T[] {
    return [...this.items];
  }

  getItemById(id: string): T | undefined {
    return this.items.find(item => item.id === id);
  }

  searchItems(query: string): T[] {
    const lowercaseQuery = query.toLowerCase().trim();
    return this.items.filter(item => 
      item.label.toLowerCase().includes(lowercaseQuery) ||
      item.id.toLowerCase().includes(lowercaseQuery)
    );
  }

  getSortComparator(): ((a: T, b: T) => number) | null {
    return (a, b) => a.label.localeCompare(b.label);
  }

  getGrouping(): ((item: T) => string) | null {
    return null;
  }
}

/**
 * Goods picker fixtures
 */
export class GoodsPickerFixture extends BaseFixtureAdapter<PickerItem> {
  constructor() {
    const goodsItems: PickerItem[] = [
      { id: 'wood', label: 'Wood', icon: 'wood', metadata: { type: 'resource', category: 'basic' } },
      { id: 'steel', label: 'Steel', icon: 'steel', metadata: { type: 'resource', category: 'metal' } },
      { id: 'electronics', label: 'Electronics', icon: 'electronics', metadata: { type: 'component', category: 'advanced' } },
      { id: 'cloth', label: 'Cloth', icon: 'cloth', metadata: { type: 'material', category: 'fabric' } },
      { id: 'food', label: 'Food', icon: 'food', metadata: { type: 'consumable', category: 'provisions' } },
      { id: 'water', label: 'Water', icon: 'water', metadata: { type: 'resource', category: 'essential' } },
      { id: 'stone', label: 'Stone', icon: 'rock', metadata: { type: 'resource', category: 'basic' } },
      { id: 'iron', label: 'Iron', icon: 'metal', metadata: { type: 'resource', category: 'metal' } },
      { id: 'glass', label: 'Glass', icon: 'crystal', metadata: { type: 'material', category: 'refined' } },
      { id: 'leather', label: 'Leather', icon: 'hide', metadata: { type: 'material', category: 'animal' } }
    ];
    super(goodsItems);
  }
}

/**
 * Hazard picker fixtures
 */
export class HazardPickerFixture extends BaseFixtureAdapter<PickerItem> {
  constructor() {
    const hazardItems: PickerItem[] = [
      { id: 'fire', label: 'Fire', icon: 'fire', metadata: { severity: 'high', category: 'environmental' } },
      { id: 'flood', label: 'Flood', icon: 'flood', metadata: { severity: 'high', category: 'environmental' } },
      { id: 'electrical', label: 'Electrical', icon: 'electrical', metadata: { severity: 'medium', category: 'technical' } },
      { id: 'intrusion', label: 'Intrusion', icon: 'intrusion', metadata: { severity: 'medium', category: 'security' } },
      { id: 'vacuum', label: 'Vacuum', icon: 'vacuum', metadata: { severity: 'high', category: 'environmental' } },
      { id: 'radiation', label: 'Radiation', icon: 'radiation', metadata: { severity: 'high', category: 'technical' } },
      { id: 'storm', label: 'Storm', icon: 'weather', metadata: { severity: 'medium', category: 'environmental' } },
      { id: 'plague', label: 'Plague', icon: 'disease', metadata: { severity: 'high', category: 'biological' } },
      { id: 'collapse', label: 'Structural Collapse', icon: 'building', metadata: { severity: 'high', category: 'structural' } },
      { id: 'toxic', label: 'Toxic Spill', icon: 'chemical', metadata: { severity: 'medium', category: 'chemical' } }
    ];
    super(hazardItems);
  }
}

/**
 * Structure type picker fixtures
 */
export class StructurePickerFixture extends BaseFixtureAdapter<PickerItem> {
  constructor() {
    const structureItems: PickerItem[] = [
      { id: 'house', label: 'House', icon: 'house', metadata: { category: 'residential', capacity: 4 } },
      { id: 'barracks', label: 'Barracks', icon: 'barracks', metadata: { category: 'military', capacity: 20 } },
      { id: 'tower', label: 'Tower', icon: 'tower', metadata: { category: 'defensive', capacity: 8 } },
      { id: 'harbor', label: 'Harbor', icon: 'harbor', metadata: { category: 'commercial', capacity: 50 } },
      { id: 'mine', label: 'Mine', icon: 'mine', metadata: { category: 'industrial', capacity: 15 } },
      { id: 'workshop', label: 'Workshop', icon: 'workshop', metadata: { category: 'industrial', capacity: 6 } },
      { id: 'market', label: 'Market', icon: 'market', metadata: { category: 'commercial', capacity: 30 } },
      { id: 'barn', label: 'Barn', icon: 'barn', metadata: { category: 'agricultural', capacity: 12 } },
      { id: 'warehouse', label: 'Warehouse', icon: 'warehouse', metadata: { category: 'storage', capacity: 100 } },
      { id: 'tavern', label: 'Tavern', icon: 'tavern', metadata: { category: 'social', capacity: 25 } }
    ];
    super(structureItems);
  }
}

/**
 * Biome picker fixtures
 */
export class BiomePickerFixture extends BaseFixtureAdapter<PickerItem> {
  constructor() {
    const biomeItems: PickerItem[] = [
      { id: 'forest', label: 'Forest', icon: 'forest', metadata: { category: 'terrestrial', difficulty: 'medium' } },
      { id: 'desert', label: 'Desert', icon: 'desert', metadata: { category: 'arid', difficulty: 'hard' } },
      { id: 'ocean', label: 'Ocean', icon: 'ocean', metadata: { category: 'aquatic', difficulty: 'hard' } },
      { id: 'mountain', label: 'Mountain', icon: 'mountain', metadata: { category: 'highland', difficulty: 'hard' } },
      { id: 'grassland', label: 'Grassland', icon: 'grassland', metadata: { category: 'terrestrial', difficulty: 'easy' } },
      { id: 'tundra', label: 'Tundra', icon: 'snow', metadata: { category: 'cold', difficulty: 'medium' } },
      { id: 'rainforest', label: 'Rainforest', icon: 'jungle', metadata: { category: 'tropical', difficulty: 'hard' } },
      { id: 'swamp', label: 'Swamp', icon: 'marsh', metadata: { category: 'wetland', difficulty: 'medium' } },
      { id: 'beach', label: 'Beach', icon: 'coast', metadata: { category: 'coastal', difficulty: 'easy' } },
      { id: 'cave', label: 'Cave System', icon: 'cave', metadata: { category: 'underground', difficulty: 'medium' } }
    ];
    super(biomeItems);
  }
}

/**
 * Technology picker fixtures (placeholder for future tech system)
 */
export class TechPickerFixture extends BaseFixtureAdapter<PickerItem> {
  constructor() {
    const techItems: PickerItem[] = [
      { id: 'agriculture', label: 'Agriculture', icon: 'plant', metadata: { tier: 1, category: 'basic' } },
      { id: 'mining', label: 'Mining', icon: 'pickaxe', metadata: { tier: 1, category: 'basic' } },
      { id: 'metallurgy', label: 'Metallurgy', icon: 'forge', metadata: { tier: 2, category: 'industrial' } },
      { id: 'engineering', label: 'Engineering', icon: 'gear', metadata: { tier: 3, category: 'advanced' } },
      { id: 'medicine', label: 'Medicine', icon: 'medical', metadata: { tier: 2, category: 'social' } },
      { id: 'navigation', label: 'Navigation', icon: 'compass', metadata: { tier: 2, category: 'exploration' } },
      { id: 'architecture', label: 'Architecture', icon: 'blueprint', metadata: { tier: 3, category: 'construction' } },
      { id: 'education', label: 'Education', icon: 'book', metadata: { tier: 2, category: 'social' } },
      { id: 'trade', label: 'Trade', icon: 'coins', metadata: { tier: 1, category: 'economic' } },
      { id: 'military', label: 'Military Tactics', icon: 'sword', metadata: { tier: 2, category: 'military' } }
    ];
    super(techItems);
  }
}

/**
 * Culture tags picker fixtures (placeholder for future culture system)
 */
export class CulturePickerFixture extends BaseFixtureAdapter<PickerItem> {
  constructor() {
    const cultureItems: PickerItem[] = [
      { id: 'martial', label: 'Martial', icon: 'sword', metadata: { domain: 'social', influence: 'high' } },
      { id: 'scholarly', label: 'Scholarly', icon: 'book', metadata: { domain: 'social', influence: 'medium' } },
      { id: 'trading', label: 'Trading', icon: 'coins', metadata: { domain: 'economic', influence: 'high' } },
      { id: 'agricultural', label: 'Agricultural', icon: 'plant', metadata: { domain: 'economic', influence: 'medium' } },
      { id: 'artistic', label: 'Artistic', icon: 'palette', metadata: { domain: 'cultural', influence: 'medium' } },
      { id: 'religious', label: 'Religious', icon: 'church', metadata: { domain: 'spiritual', influence: 'high' } },
      { id: 'exploratory', label: 'Exploratory', icon: 'compass', metadata: { domain: 'social', influence: 'low' } },
      { id: 'isolationist', label: 'Isolationist', icon: 'wall', metadata: { domain: 'political', influence: 'medium' } },
      { id: 'warlike', label: 'Warlike', icon: 'shield', metadata: { domain: 'military', influence: 'high' } },
      { id: 'peaceful', label: 'Peaceful', icon: 'dove', metadata: { domain: 'social', influence: 'medium' } }
    ];
    super(cultureItems);
  }
}

/**
 * Pre-configured picker configurations for different use cases
 */
export const PICKER_CONFIGS = {
  // Minimal config for simple selections
  minimal: {
    ...DEFAULT_PICKER_CONFIG,
    searchable: false,
    showIcons: true
  } as PickerConfig,

  // Config for large lists with search
  searchable: {
    ...DEFAULT_PICKER_CONFIG,
    searchable: true,
    showIcons: true,
    maxItems: 50
  } as PickerConfig,

  // Config for mobile/small screens
  mobile: {
    ...DEFAULT_PICKER_CONFIG,
    searchable: true,
    showIcons: false, // Save space on mobile
    maxItems: 20
  } as PickerConfig,

  // Config for accessibility
  accessible: {
    ...DEFAULT_PICKER_CONFIG,
    searchable: true,
    showIcons: true,
    keyboardNavigation: true
  } as PickerConfig
};

/**
 * Test scenarios for picker validation
 */
export const PICKER_TEST_SCENARIOS = {
  // Basic functionality
  basic: {
    description: 'Basic single selection',
    adapter: new GoodsPickerFixture(),
    selectedItems: [],
    expectedSelection: 'wood'
  },

  // Multi-selection
  multi: {
    description: 'Multi-selection with chips',
    adapter: new HazardPickerFixture(),
    selectedItems: ['fire', 'flood'],
    expectedAdd: 'electrical',
    expectedRemove: 'fire'
  },

  // Search functionality
  search: {
    description: 'Search and filter items',
    adapter: new StructurePickerFixture(),
    searchQuery: 'house',
    expectedResults: ['house']
  },

  // Accessibility
  accessibility: {
    description: 'Keyboard navigation',
    adapter: new BiomePickerFixture(),
    keyboardActions: ['ArrowDown', 'Enter', 'Escape']
  },

  // Empty state
  empty: {
    description: 'Empty selection state',
    adapter: new TechPickerFixture(),
    selectedItems: [],
    config: { ...PICKER_CONFIGS.minimal, placeholder: 'Select technology...' }
  }
};

/**
 * Mock implementations for testing without Angular dependencies
 */
export class MockPickerAdapter implements PickerAdapter<PickerItem> {
  private items: PickerItem[] = [];

  constructor(items: PickerItem[] = []) {
    this.items = [...items];
  }

  getItems(): PickerItem[] {
    return [...this.items];
  }

  getItemById(id: string): PickerItem | undefined {
    return this.items.find(item => item.id === id);
  }

  searchItems(query: string): PickerItem[] {
    const lowercaseQuery = query.toLowerCase().trim();
    return this.items.filter(item => 
      item.label.toLowerCase().includes(lowercaseQuery) ||
      item.id.toLowerCase().includes(lowercaseQuery)
    );
  }

  getSortComparator(): ((a: PickerItem, b: PickerItem) => number) | null {
    return (a, b) => a.label.localeCompare(b.label);
  }

  getGrouping(): ((item: PickerItem) => string) | null {
    return null;
  }
}

/**
 * Helper to create test data
 */
export class PickerTestDataFactory {
  static createItems(count: number, prefix: string = 'item'): PickerItem[] {
    return Array.from({ length: count }, (_, i) => ({
      id: `${prefix}_${i}`,
      label: `${prefix.charAt(0).toUpperCase() + prefix.slice(1)} ${i}`,
      icon: `${prefix}_icon`,
      metadata: { index: i, prefix }
    }));
  }

  static createDisabledItems(): PickerItem[] {
    return [
      { id: 'enabled_1', label: 'Enabled Item 1', icon: 'icon1' },
      { id: 'disabled_1', label: 'Disabled Item', icon: 'icon2', disabled: true },
      { id: 'enabled_2', label: 'Enabled Item 2', icon: 'icon3' }
    ];
  }

  static createItemsWithMetadata(): PickerItem[] {
    return [
      { 
        id: 'tech_1', 
        label: 'Advanced Technology', 
        icon: 'tech',
        metadata: { tier: 3, category: 'advanced', prerequisites: ['tech_0'] }
      },
      { 
        id: 'tech_2', 
        label: 'Basic Technology', 
        icon: 'basic',
        metadata: { tier: 1, category: 'basic', prerequisites: [] }
      }
    ];
  }
}