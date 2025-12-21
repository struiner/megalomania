import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  OnInit, 
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import { 
  PickerItem, 
  PickerAdapter, 
  PickerConfig, 
  PickerEvent,
  PickerKey,
  PickerA11yAttributes,
  DEFAULT_PICKER_CONFIG
} from './picker.types';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

/**
 * Extended interface for icon picker items with metadata
 */
export interface IconPickerItem extends PickerItem {
  /** Icon category for grouping */
  category: string;
  /** Preview image URL or data */
  previewUrl?: string;
  /** Small size preview URL */
  thumbnailUrl?: string;
  /** Icon metadata */
  metadata?: {
    size?: string;
    style?: string;
    tags?: string[];
    usage?: string;
  };
  /** Visual characteristics for scanning */
  visualCharacteristics?: {
    isComplex?: boolean;
    primaryColor?: string;
    shape?: string;
  };
}

/**
 * Icon picker configuration with grid-specific options
 */
export interface IconPickerConfig extends PickerConfig {
  /** Number of columns in the grid */
  columns?: number;
  /** Icon size in grid (small, medium, large) */
  iconSize?: 'small' | 'medium' | 'large';
  /** Show category headers */
  showCategoryHeaders?: boolean;
  /** Enable visual scanning mode */
  enableVisualScanning?: boolean;
  /** Grid gap size */
  gridGap?: string;
  /** Maximum icons to load per category for performance */
  maxIconsPerCategory?: number;
  /** Show icon metadata on hover */
  showMetadataOnHover?: boolean;
}

/**
 * Icon picker state with grid navigation
 */
export interface IconPickerState {
  selectedItem: IconPickerItem | null;
  isOpen: boolean;
  searchQuery: string;
  filteredItems: IconPickerItem[];
  focusedIndex: number;
  focusedRow: number;
  focusedCol: number;
  currentCategory: string | null;
  availableCategories: string[];
  isGridMode: boolean;
}

/**
 * Category information for icon organization
 */
export interface IconCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  count: number;
  order: number;
}

/**
 * Icon picker component for grid-based icon selection
 * Supports visual scanning, keyboard navigation, and category organization
 */
@Component({
  selector: 'app-icon-picker',
  template: `
    <div class="icon-picker-container" 
         [class.icon-picker--open]="state.isOpen"
         [class.icon-picker--grid]="state.isGridMode"
         [attr.role]="a11y.role || 'combobox'"
         [attr.aria-label]="a11y['aria-label']"
         [attr.aria-describedby]="a11y['aria-describedby']"
         [attr.aria-expanded]="state.isOpen"
         [attr.aria-controls]="dropdownId">
      
      <!-- Search input (when open) -->
      <div class="icon-picker__search" *ngIf="state.isOpen && config.searchable">
        <div class="icon-picker__search-header">
          <input #searchInput
                 type="text"
                 class="icon-picker__search-input"
                 [value]="state.searchQuery"
                 (input)="onSearchInput($event)"
                 (keydown)="onSearchKeydown($event)"
                 [placeholder]="'Search icons...'"
                 [attr.aria-label]="'Search icon picker items'">
          
          <!-- View toggle -->
          <div class="icon-picker__view-toggle" role="group" aria-label="View options">
            <button type="button"
                    class="icon-picker__view-btn"
                    [class.icon-picker__view-btn--active]="!state.isGridMode"
                    (click)="setListView()"
                    [attr.aria-pressed]="!state.isGridMode"
                    aria-label="List view">
              <app-icon name="list"></app-icon>
            </button>
            <button type="button"
                    class="icon-picker__view-btn"
                    [class.icon-picker__view-btn--active]="state.isGridMode"
                    (click)="setGridView()"
                    [attr.aria-pressed]="state.isGridMode"
                    aria-label="Grid view">
              <app-icon name="grid"></app-icon>
            </button>
          </div>
        </div>
        
        <!-- Category filter -->
        <div class="icon-picker__category-filter" *ngIf="state.availableCategories.length > 1">
          <button type="button"
                  class="icon-picker__category-btn"
                  [class.icon-picker__category-btn--active]="!state.currentCategory"
                  (click)="selectCategory(null)"
                  [attr.aria-pressed]="!state.currentCategory">
            All Categories
          </button>
          <button *ngFor="let category of state.availableCategories; trackBy: trackByCategoryId"
                  type="button"
                  class="icon-picker__category-btn"
                  [class.icon-picker__category-btn--active]="state.currentCategory === category"
                  (click)="selectCategory(category)"
                  [attr.aria-pressed]="state.currentCategory === category">
            {{ getCategoryDisplayName(category) }}
            <span class="icon-picker__category-count">({{ getCategoryCount(category) }})</span>
          </button>
        </div>
      </div>

      <!-- Selected item display -->
      <button type="button"
              class="icon-picker__trigger"
              (click)="toggle()"
              (keydown)="onTriggerKeydown($event)"
              [attr.aria-haspopup]="'listbox'"
              [attr.aria-expanded]="state.isOpen"
              [attr.aria-controls]="dropdownId"
              [attr.aria-activedescendant]="getActiveDescendant()"
              [disabled]="false">
        <span class="icon-picker__trigger-content">
          <span *ngIf="state.selectedItem" class="icon-picker__trigger-item">
            <div class="icon-picker__trigger-icon" [attr.aria-hidden]="true">
              <img *ngIf="state.selectedItem.thumbnailUrl" 
                   [src]="state.selectedItem.thumbnailUrl" 
                   [alt]="state.selectedItem.label + ' icon'"
                   class="icon-picker__trigger-image">
              <span *ngIf="!state.selectedItem.thumbnailUrl" class="icon-picker__trigger-placeholder">
                {{ state.selectedItem.label.charAt(0).toUpperCase() }}
              </span>
            </div>
            <div class="icon-picker__trigger-info">
              <span class="icon-picker__trigger-label">{{ state.selectedItem.label }}</span>
              <span class="icon-picker__trigger-category">{{ state.selectedItem.category }}</span>
            </div>
          </span>
          <span *ngIf="!state.selectedItem" 
                class="icon-picker__trigger-placeholder">{{ config.placeholder }}</span>
        </span>
        <app-icon name="chevron-down" 
                  class="icon-picker__trigger-arrow"
                  [class.icon-picker__trigger-arrow--open]="state.isOpen"></app-icon>
      </button>

      <!-- Dropdown list/grid -->
      <div class="icon-picker__dropdown"
           *ngIf="state.isOpen"
           [id]="dropdownId"
           role="listbox"
           [attr.aria-label]="a11y['aria-label'] || 'Icon picker options'">
        
        <!-- Empty state -->
        <div *ngIf="state.filteredItems.length === 0 && config.showEmptyState" 
             class="icon-picker__empty-state">
          <div class="icon-picker__empty-icon">
            <app-icon name="search"></app-icon>
          </div>
          <span class="icon-picker__empty-message">{{ config.emptyStateMessage }}</span>
        </div>

        <!-- Grid view -->
        <div *ngIf="state.filteredItems.length > 0 && state.isGridMode" 
             class="icon-picker__grid"
             [style.grid-template-columns]="getGridColumns()"
             [style.gap]="config.gridGap || '8px'"
             (keydown)="onGridKeydown($event)"
             role="grid"
             [attr.aria-label]="'Icon grid'">
          
          <!-- Category headers -->
          <ng-container *ngFor="let category of getVisibleCategories()">
            <div *ngIf="config.showCategoryHeaders && hasItemsInCategory(category)" 
                 class="icon-picker__category-header"
                 [attr.role]="'rowheader'">
              {{ getCategoryDisplayName(category) }}
            </div>
            
            <!-- Icon grid items -->
            <div *ngFor="let item of getItemsByCategory(category); let i = index"
                 class="icon-picker__grid-item"
                 [class.icon-picker__grid-item--focused]="isItemFocused(item)"
                 [class.icon-picker__grid-item--selected]="isItemSelected(item)"
                 [class.icon-picker__grid-item--disabled]="item.disabled"
                 [attr.role]="'option'"
                 [attr.id]="getOptionId(getGridItemIndex(item))"
                 [attr.aria-selected]="isItemSelected(item)"
                 [attr.aria-disabled]="item.disabled"
                 [attr.aria-label]="getItemAriaLabel(item)"
                 (click)="!item.disabled && selectItem(item)"
                 (mouseenter)="!item.disabled && focusItemById(item.id)"
                 (mouseleave)="clearHover()">
              
              <div class="icon-picker__grid-item-content">
                <div class="icon-picker__grid-item-image">
                  <img *ngIf="item.thumbnailUrl" 
                       [src]="item.thumbnailUrl" 
                       [alt]="item.label"
                       class="icon-picker__grid-image"
                       [class.icon-picker__grid-image--large]="config.iconSize === 'large'"
                       [class.icon-picker__grid-image--small]="config.iconSize === 'small'">
                  <div *ngIf="!item.thumbnailUrl" 
                       class="icon-picker__grid-placeholder"
                       [class.icon-picker__grid-placeholder--large]="config.iconSize === 'large'"
                       [class.icon-picker__grid-placeholder--small]="config.iconSize === 'small'">
                    {{ item.label.charAt(0).toUpperCase() }}
                  </div>
                </div>
                
                <div class="icon-picker__grid-item-label">{{ item.label }}</div>
                
                <!-- Selection indicator -->
                <div *ngIf="isItemSelected(item)" class="icon-picker__grid-item-selected">
                  <app-icon name="check" class="icon-picker__grid-check"></app-icon>
                </div>
              </div>
              
              <!-- Hover metadata -->
              <div *ngIf="config.showMetadataOnHover && isItemFocused(item)" 
                   class="icon-picker__grid-item-tooltip">
                <div class="icon-picker__tooltip-title">{{ item.label }}</div>
                <div class="icon-picker__tooltip-category">{{ item.category }}</div>
                <div *ngIf="item.metadata?.tags?.length" class="icon-picker__tooltip-tags">
                  <span *ngFor="let tag of item.metadata.tags" 
                        class="icon-picker__tooltip-tag">{{ tag }}</span>
                </div>
              </div>
            </div>
          </ng-container>
        </div>

        <!-- List view (fallback) -->
        <ul *ngIf="state.filteredItems.length > 0 && !state.isGridMode" 
            class="icon-picker__list"
            (keydown)="onListKeydown($event)">
          <li *ngFor="let item of state.filteredItems; let i = index"
              class="icon-picker__item"
              [class.icon-picker__item--focused]="i === state.focusedIndex"
              [class.icon-picker__item--selected]="isItemSelected(item)"
              [class.icon-picker__item--disabled]="item.disabled"
              role="option"
              [attr.id]="getOptionId(i)"
              [attr.aria-selected]="isItemSelected(item)"
              [attr.aria-disabled]="item.disabled"
              (click)="!item.disabled && selectItem(item)"
              (mouseenter)="!item.disabled && focusItem(i)">
            
            <div class="icon-picker__item-content">
              <div class="icon-picker__item-image">
                <img *ngIf="item.thumbnailUrl" 
                     [src]="item.thumbnailUrl" 
                     [alt]="item.label"
                     class="icon-picker__item-thumbnail">
                <span *ngIf="!item.thumbnailUrl" class="icon-picker__item-placeholder">
                  {{ item.label.charAt(0).toUpperCase() }}
                </span>
              </div>
              
              <div class="icon-picker__item-info">
                <span class="icon-picker__item-label">{{ item.label }}</span>
                <span class="icon-picker__item-category">{{ item.category }}</span>
              </div>
            </div>

            <app-icon *ngIf="isItemSelected(item)" 
                      name="check"
                      class="icon-picker__item-check"></app-icon>
          </li>
        </ul>
      </div>

      <!-- Overlay for closing dropdown -->
      <div *ngIf="state.isOpen" 
           class="icon-picker__overlay"
           (click)="close()"></div>
    </div>
  `,
  styleUrls: ['./icon-picker.component.scss']
})
export class IconPickerComponent implements OnInit, OnDestroy {
  @Input() adapter!: PickerAdapter<IconPickerItem>;
  @Input() config: IconPickerConfig = { ...DEFAULT_PICKER_CONFIG };
  @Input() selectedItem: IconPickerItem | null = null;
  @Input() a11y: PickerA11yAttributes = {};
  
  @Output() selectionChange = new EventEmitter<IconPickerItem | null>();
  @Output() pickerEvent = new EventEmitter<PickerEvent>();

  @ViewChild('searchInput', { static: false }) searchInput?: ElementRef<HTMLInputElement>;

  state: IconPickerState = {
    selectedItem: null,
    isOpen: false,
    searchQuery: '',
    filteredItems: [],
    focusedIndex: -1,
    focusedRow: -1,
    focusedCol: -1,
    currentCategory: null,
    availableCategories: [],
    isGridMode: true
  };

  dropdownId = `icon-picker-dropdown-${Math.random().toString(36).substr(2, 9)}`;
  
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();
  private hoveredItemId: string | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.initializeState();
    this.setupSearchSubscription();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeState(): void {
    this.state.selectedItem = this.selectedItem;
    this.state.isGridMode = this.config.enableVisualScanning !== false;
    this.updateFilteredItems();
  }

  private setupSearchSubscription(): void {
    this.searchSubject.pipe(
      debounceTime(150),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.filterItems(query);
    });
  }

  private loadCategories(): void {
    const items = this.adapter.getItems();
    const categories = [...new Set(items.map(item => item.category))].sort();
    this.state.availableCategories = categories;
  }

  toggle(): void {
    if (this.state.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open(): void {
    if (this.state.isOpen) return;
    
    this.state.isOpen = true;
    this.updateGridFocus();
    this.updateFilteredItems();
    this.focusSearchInput();
    this.emitEvent({ type: 'open' });
    
    this.cdr.detectChanges();
  }

  close(): void {
    if (!this.state.isOpen) return;
    
    this.state.isOpen = false;
    this.state.searchQuery = '';
    this.state.focusedIndex = -1;
    this.state.focusedRow = -1;
    this.state.focusedCol = -1;
    this.hoveredItemId = null;
    this.emitEvent({ type: 'close' });
    
    this.cdr.detectChanges();
  }

  selectItem(item: IconPickerItem): void {
    if (item.disabled) return;
    
    this.state.selectedItem = item;
    this.state.searchQuery = '';
    this.updateFilteredItems();
    this.close();
    
    this.selectionChange.emit(item);
    this.emitEvent({ type: 'select', item });
    
    this.cdr.detectChanges();
  }

  selectCategory(category: string | null): void {
    this.state.currentCategory = category;
    this.updateFilteredItems();
    this.resetGridFocus();
    this.cdr.detectChanges();
  }

  setGridView(): void {
    this.state.isGridMode = true;
    this.updateGridFocus();
    this.cdr.detectChanges();
  }

  setListView(): void {
    this.state.isGridMode = false;
    this.updateListFocus();
    this.cdr.detectChanges();
  }

  // Grid navigation methods
  focusItemById(itemId: string): void {
    const index = this.state.filteredItems.findIndex(item => item.id === itemId);
    if (index >= 0) {
      this.focusItem(index);
    }
  }

  focusItem(index: number): void {
    if (index < 0 || index >= this.state.filteredItems.length) return;
    
    this.state.focusedIndex = index;
    if (this.state.isGridMode) {
      this.updateGridPosition(index);
    }
    
    this.cdr.detectChanges();
  }

  focusNext(): void {
    if (!this.state.filteredItems.length) return;
    
    if (this.state.isGridMode) {
      this.focusGridNext();
    } else {
      const nextIndex = this.state.focusedIndex + 1;
      this.state.focusedIndex = nextIndex >= this.state.filteredItems.length ? 0 : nextIndex;
    }
    
    this.scrollFocusedItemIntoView();
    this.cdr.detectChanges();
  }

  focusPrevious(): void {
    if (!this.state.filteredItems.length) return;
    
    if (this.state.isGridMode) {
      this.focusGridPrevious();
    } else {
      const prevIndex = this.state.focusedIndex - 1;
      this.state.focusedIndex = prevIndex < 0 ? this.state.filteredItems.length - 1 : prevIndex;
    }
    
    this.scrollFocusedItemIntoView();
    this.cdr.detectChanges();
  }

  focusNextRow(): void {
    if (!this.state.isGridMode) return;
    
    const columns = this.getGridColumnsCount();
    const nextIndex = this.state.focusedIndex + columns;
    
    if (nextIndex < this.state.filteredItems.length) {
      this.focusItem(nextIndex);
    } else {
      // Wrap to first item in next visible category
      this.focusFirst();
    }
  }

  focusPreviousRow(): void {
    if (!this.state.isGridMode) return;
    
    const columns = this.getGridColumnsCount();
    const prevIndex = this.state.focusedIndex - columns;
    
    if (prevIndex >= 0) {
      this.focusItem(prevIndex);
    } else {
      // Wrap to last item
      this.focusLast();
    }
  }

  focusNextColumn(): void {
    if (!this.state.isGridMode) return;
    
    const nextIndex = this.state.focusedIndex + 1;
    
    if (nextIndex < this.state.filteredItems.length && this.isInSameRow(nextIndex)) {
      this.focusItem(nextIndex);
    }
  }

  focusPreviousColumn(): void {
    if (!this.state.isGridMode) return;
    
    const prevIndex = this.state.focusedIndex - 1;
    
    if (prevIndex >= 0 && this.isInSameRow(prevIndex)) {
      this.focusItem(prevIndex);
    }
  }

  focusFirst(): void {
    if (!this.state.filteredItems.length) return;
    
    this.focusItem(0);
  }

  focusLast(): void {
    if (!this.state.filteredItems.length) return;
    
    this.focusItem(this.state.filteredItems.length - 1);
  }

  // Event handlers
  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const query = target.value;
    
    this.state.searchQuery = query;
    this.searchSubject.next(query);
    
    this.emitEvent({ type: 'search', data: query });
  }

  onTriggerKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case PickerKey.Enter:
      case PickerKey.Space:
        event.preventDefault();
        this.toggle();
        break;
      case PickerKey.ArrowDown:
        event.preventDefault();
        this.open();
        break;
    }
  }

  onSearchKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case PickerKey.ArrowDown:
        event.preventDefault();
        this.focusNext();
        break;
      case PickerKey.ArrowUp:
        event.preventDefault();
        this.focusPrevious();
        break;
      case PickerKey.Enter:
        event.preventDefault();
        this.selectFocusedItem();
        break;
      case PickerKey.Escape:
        event.preventDefault();
        this.close();
        break;
    }
  }

  onListKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case PickerKey.ArrowDown:
        event.preventDefault();
        this.focusNext();
        break;
      case PickerKey.ArrowUp:
        event.preventDefault();
        this.focusPrevious();
        break;
      case PickerKey.Enter:
        event.preventDefault();
        this.selectFocusedItem();
        break;
      case PickerKey.Escape:
        event.preventDefault();
        this.close();
        break;
      case PickerKey.Tab:
        this.close();
        break;
    }
  }

  onGridKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case PickerKey.ArrowDown:
        event.preventDefault();
        this.focusNextRow();
        break;
      case PickerKey.ArrowUp:
        event.preventDefault();
        this.focusPreviousRow();
        break;
      case PickerKey.ArrowRight:
        event.preventDefault();
        this.focusNextColumn();
        break;
      case PickerKey.ArrowLeft:
        event.preventDefault();
        this.focusPreviousColumn();
        break;
      case PickerKey.Enter:
      case PickerKey.Space:
        event.preventDefault();
        this.selectFocusedItem();
        break;
      case PickerKey.Escape:
        event.preventDefault();
        this.close();
        break;
      case PickerKey.Tab:
        this.close();
        break;
    }
  }

  // Utility methods
  isItemSelected(item: IconPickerItem): boolean {
    return this.state.selectedItem?.id === item.id;
  }

  isItemFocused(item: IconPickerItem): boolean {
    return this.state.filteredItems[this.state.focusedIndex]?.id === item.id;
  }

  getActiveDescendant(): string | null {
    if (this.state.focusedIndex < 0) return null;
    return this.getOptionId(this.state.focusedIndex);
  }

  getOptionId(index: number): string {
    return `icon-picker-option-${index}`;
  }

  getItemAriaLabel(item: IconPickerItem): string {
    return `${item.label}, ${item.category} category`;
  }

  getCategoryDisplayName(category: string): string {
    return category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1');
  }

  getCategoryCount(category: string): number {
    return this.state.filteredItems.filter(item => item.category === category).length;
  }

  getVisibleCategories(): string[] {
    const filtered = this.state.currentCategory 
      ? [this.state.currentCategory]
      : this.state.availableCategories;
    return filtered.filter(category => this.hasItemsInCategory(category));
  }

  getItemsByCategory(category: string): IconPickerItem[] {
    let items = this.state.filteredItems.filter(item => item.category === category);
    
    const maxIcons = this.config.maxIconsPerCategory || 50;
    if (items.length > maxIcons) {
      items = items.slice(0, maxIcons);
    }
    
    return items;
  }

  hasItemsInCategory(category: string): boolean {
    return this.state.filteredItems.some(item => item.category === category);
  }

  getGridColumns(): string {
    const columns = this.config.columns || 6;
    return `repeat(${columns}, 1fr)`;
  }

  getGridColumnsCount(): number {
    return this.config.columns || 6;
  }

  // Private methods
  private filterItems(query: string): void {
    let allItems = this.adapter.getItems();
    
    // Filter by category if selected
    if (this.state.currentCategory) {
      allItems = allItems.filter(item => item.category === this.state.currentCategory);
    }
    
    // Apply search filter
    if (!query.trim()) {
      this.state.filteredItems = this.getSortedItems(allItems);
    } else {
      const searchResults = this.adapter.searchItems(query);
      const filteredByCategory = this.state.currentCategory
        ? searchResults.filter(item => item.category === this.state.currentCategory)
        : searchResults;
      this.state.filteredItems = this.getSortedItems(filteredByCategory);
    }
    
    // Adjust focused index to valid range
    if (this.state.focusedIndex >= this.state.filteredItems.length) {
      this.state.focusedIndex = this.state.filteredItems.length - 1;
    }
    
    this.cdr.detectChanges();
  }

  private updateFilteredItems(): void {
    this.filterItems(this.state.searchQuery);
  }

  private getSortedItems(items: IconPickerItem[]): IconPickerItem[] {
    const comparator = this.adapter.getSortComparator() || ((a, b) => a.label.localeCompare(b.label));
    return [...items].sort(comparator);
  }

  private updateGridFocus(): void {
    if (this.state.selectedItem) {
      const index = this.state.filteredItems.findIndex(item => item.id === this.state.selectedItem!.id);
      if (index >= 0) {
        this.state.focusedIndex = index;
        this.updateGridPosition(index);
        return;
      }
    }
    this.resetGridFocus();
  }

  private updateListFocus(): void {
    if (this.state.selectedItem) {
      const index = this.state.filteredItems.findIndex(item => item.id === this.state.selectedItem!.id);
      if (index >= 0) {
        this.state.focusedIndex = index;
        return;
      }
    }
    this.state.focusedIndex = 0;
  }

  private updateGridPosition(index: number): void {
    const columns = this.getGridColumnsCount();
    this.state.focusedRow = Math.floor(index / columns);
    this.state.focusedCol = index % columns;
  }

  private resetGridFocus(): void {
    this.state.focusedIndex = 0;
    this.state.focusedRow = 0;
    this.state.focusedCol = 0;
  }

  private focusGridNext(): void {
    const columns = this.getGridColumnsCount();
    const nextIndex = this.state.focusedIndex + 1;
    
    if (nextIndex < this.state.filteredItems.length) {
      this.focusItem(nextIndex);
    }
  }

  private focusGridPrevious(): void {
    const prevIndex = this.state.focusedIndex - 1;
    
    if (prevIndex >= 0) {
      this.focusItem(prevIndex);
    }
  }

  private isInSameRow(index: number): boolean {
    const columns = this.getGridColumnsCount();
    const currentRow = Math.floor(this.state.focusedIndex / columns);
    const targetRow = Math.floor(index / columns);
    return currentRow === targetRow;
  }

  private selectFocusedItem(): void {
    if (this.state.focusedIndex < 0 || this.state.focusedIndex >= this.state.filteredItems.length) {
      return;
    }
    
    const focusedItem = this.state.filteredItems[this.state.focusedIndex];
    if (!focusedItem.disabled) {
      this.selectItem(focusedItem);
    }
  }

  private scrollFocusedItemIntoView(): void {
    // TODO: Implement scroll into view for better UX
    // This would involve getting the focused element and calling scrollIntoView()
  }

  private focusSearchInput(): void {
    if (this.config.searchable && this.searchInput) {
      setTimeout(() => {
        this.searchInput?.nativeElement.focus();
      }, 0);
    }
  }

  private clearHover(): void {
    this.hoveredItemId = null;
  }

  private emitEvent(event: PickerEvent): void {
    this.pickerEvent.emit(event);
  }

  // Track by functions
  trackByCategoryId(index: number, category: string): string {
    return category;
  }

  getGridItemIndex(item: IconPickerItem): number {
    return this.state.filteredItems.findIndex(i => i.id === item.id);
  }
}