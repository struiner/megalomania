import { ChangeDetectorRef } from '@angular/core';

/**
 * Base interface for all selectable items in pickers
 */
export interface PickerItem {
  /** Unique identifier for the item */
  id: string;
  /** Display label for the item */
  label: string;
  /** Optional icon identifier or path */
  icon?: string;
  /** Optional additional metadata */
  metadata?: Record<string, unknown>;
  /** Optional disabled state */
  disabled?: boolean;
}

/**
 * Interface for picker adapter that provides data to picker components
 */
export interface PickerAdapter<T extends PickerItem = PickerItem> {
  /** Get all available items */
  getItems(): T[];
  /** Get item by ID */
  getItemById(id: string): T | undefined;
  /** Search items by query string */
  searchItems(query: string): T[];
  /** Get sorting comparator for deterministic ordering */
  getSortComparator(): ((a: T, b: T) => number) | null;
  /** Get grouping function (optional) */
  getGrouping?(): ((item: T) => string) | null;
}

/**
 * Configuration options for picker components
 */
export interface PickerConfig {
  /** Placeholder text when nothing is selected */
  placeholder?: string;
  /** Enable search/filtering functionality */
  searchable?: boolean;
  /** Show icons alongside labels */
  showIcons?: boolean;
  /** Maximum number of items to display (for performance) */
  maxItems?: number;
  /** Custom CSS class for styling */
  customClass?: string;
  /** Enable keyboard navigation */
  keyboardNavigation?: boolean;
  /** Show empty state when no items match */
  showEmptyState?: boolean;
  /** Empty state message */
  emptyStateMessage?: string;
}

/**
 * Single selection picker state
 */
export interface SinglePickerState {
  selectedItem: PickerItem | null;
  isOpen: boolean;
  searchQuery: string;
  filteredItems: PickerItem[];
  focusedIndex: number;
}

/**
 * Multi-selection picker state
 */
export interface MultiPickerState {
  selectedItems: PickerItem[];
  isOpen: boolean;
  searchQuery: string;
  filteredItems: PickerItem[];
  focusedIndex: number;
}

/**
 * Event emitted by picker components
 */
export interface PickerEvent {
  /** Type of event */
  type: 'select' | 'deselect' | 'search' | 'open' | 'close' | 'focus';
  /** Associated item (if applicable) */
  item?: PickerItem;
  /** Event data */
  data?: unknown;
}

/**
 * Keyboard interaction types
 */
export enum PickerKey {
  ArrowUp = 'ArrowUp',
  ArrowDown = 'ArrowDown',
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
  Enter = 'Enter',
  Escape = 'Escape',
  Space = ' ',
  Tab = 'Tab',
  Backspace = 'Backspace'
}

/**
 * Accessibility attributes for picker components
 */
export interface PickerA11yAttributes {
  /** ARIA label for the picker */
  'aria-label'?: string;
  /** ARIA described by reference */
  'aria-describedby'?: string;
  /** ARIA expanded state */
  'aria-expanded'?: boolean;
  /** ARIA controls reference */
  'aria-controls'?: string;
  /** ARIA active descendant */
  'aria-activedescendant'?: string;
  /** Role attribute */
  role?: string;
}

/**
 * Picker component lifecycle interface
 */
export interface PickerLifecycle {
  /** Initialize the picker */
  onInit?(): void;
  /** Handle item selection */
  onSelect?(item: PickerItem): void;
  /** Handle item deselection */
  onDeselect?(item: PickerItem): void;
  /** Handle search query changes */
  onSearch?(query: string): void;
  /** Handle dropdown open */
  onOpen?(): void;
  /** Handle dropdown close */
  onClose?(): void;
  /** Handle keyboard navigation */
  onKeydown?(event: KeyboardEvent): void;
}

/**
 * Base picker component interface
 */
export interface BasePickerComponent<T extends PickerItem = PickerItem> extends PickerLifecycle {
  /** Configuration options */
  config: PickerConfig;
  /** Data adapter */
  adapter: PickerAdapter<T>;
  /** Current selection state */
  state: SinglePickerState | MultiPickerState;
  /** Accessibility attributes */
  a11y: PickerA11yAttributes;
  
  /** Open the picker dropdown */
  open(): void;
  /** Close the picker dropdown */
  close(): void;
  /** Toggle picker dropdown */
  toggle(): void;
  /** Select an item */
  selectItem(item: T): void;
  /** Deselect an item */
  deselectItem(item: T): void;
  /** Handle keyboard navigation */
  handleKeydown(event: KeyboardEvent): void;
  /** Filter items based on search query */
  filterItems(query: string): void;
  /** Focus next item in the list */
  focusNext(): void;
  /** Focus previous item in the list */
  focusPrevious(): void;
  /** Focus first item */
  focusFirst(): void;
  /** Focus last item */
  focusLast(): void;
}

/**
 * Filtering and sorting utilities
 */
export class PickerUtils {
  /**
   * Apply search filter to items
   */
  static filterItems<T extends PickerItem>(
    items: T[], 
    query: string,
    searchFields: (keyof T)[] = ['label', 'id']
  ): T[] {
    if (!query.trim()) return items;
    
    const lowercaseQuery = query.toLowerCase().trim();
    
    return items.filter(item => 
      searchFields.some(field => {
        const value = item[field];
        return typeof value === 'string' && value.toLowerCase().includes(lowercaseQuery);
      })
    );
  }

  /**
   * Sort items deterministically
   */
  static sortItems<T extends PickerItem>(
    items: T[],
    comparator?: (a: T, b: T) => number
  ): T[] {
    const sortComparator = comparator || ((a, b) => a.label.localeCompare(b.label));
    return [...items].sort(sortComparator);
  }

  /**
   * Group items by a grouping function
   */
  static groupItems<T extends PickerItem>(
    items: T[],
    groupingFn?: (item: T) => string
  ): Map<string, T[]> {
    if (!groupingFn) {
      return new Map([['all', items]]);
    }

    const groups = new Map<string, T[]>();
    
    items.forEach(item => {
      const group = groupingFn(item);
      if (!groups.has(group)) {
        groups.set(group, []);
      }
      groups.get(group)!.push(item);
    });

    return groups;
  }

  /**
   * Check if item matches search query
   */
  static matchesQuery<T extends PickerItem>(item: T, query: string): boolean {
    if (!query.trim()) return true;
    
    const searchFields: (keyof T)[] = ['label', 'id'];
    const lowercaseQuery = query.toLowerCase().trim();
    
    return searchFields.some(field => {
      const value = item[field];
      return typeof value === 'string' && value.toLowerCase().includes(lowercaseQuery);
    });
  }

  /**
   * Get deterministic item display order
   */
  static getDisplayOrder<T extends PickerItem>(
    items: T[],
    selectedItems: T[] = []
  ): T[] {
    // Selected items first, in order of their selection
    const ordered = [...selectedItems];
    
    // Then unselected items, sorted alphabetically
    const unselectedItems = items.filter(item => !selectedItems.includes(item));
    const sortedUnselected = unselectedItems.sort((a, b) => a.label.localeCompare(b.label));
    
    return [...ordered, ...sortedUnselected];
  }
}

/**
 * Default configuration values
 */
export const DEFAULT_PICKER_CONFIG: PickerConfig = {
  placeholder: 'Select an item...',
  searchable: true,
  showIcons: true,
  maxItems: 100,
  keyboardNavigation: true,
  showEmptyState: true,
  emptyStateMessage: 'No items found'
};

/**
 * Accessibility role definitions
 */
export const PICKER_ROLES = {
  COMBOBOX: 'combobox',
  LISTBOX: 'listbox',
  OPTION: 'option'
} as const;

/**
 * ARIA state attributes
 */
export const PICKER_ARIA_STATES = {
  EXPANDED: 'aria-expanded',
  CONTROLS: 'aria-controls',
  ACTIVE_DESCENDANT: 'aria-activedescendant',
  LABEL: 'aria-label',
  DESCRIBED_BY: 'aria-describedby'
} as const;