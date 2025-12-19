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
  MultiPickerState,
  PickerEvent,
  PickerKey,
  PickerA11yAttributes,
  PickerUtils,
  DEFAULT_PICKER_CONFIG,
  PICKER_ROLES,
  PICKER_ARIA_STATES
} from './picker.types';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-multi-picker',
  template: `
    <div class="picker-container picker--multi" 
         [class.picker--open]="state.isOpen"
         [attr.role]="a11y.role || PICKER_ROLES.COMBOBOX"
         [attr.aria-label]="a11y['aria-label']"
         [attr.aria-describedby]="a11y['aria-describedby']"
         [attr.aria-expanded]="state.isOpen"
         [attr.aria-controls]="dropdownId">
      
      <!-- Selected items chips -->
      <div class="picker__selected-items">
        <div *ngFor="let item of state.selectedItems; let i = index" 
             class="picker__chip"
             [class.picker__chip--disabled]="item.disabled">
          
          <app-icon *ngIf="config.showIcons && item.icon" 
                    [name]="item.icon"
                    class="picker__chip-icon"></app-icon>
          
          <span class="picker__chip-label">{{ item.label }}</span>
          
          <button type="button"
                  class="picker__chip-remove"
                  (click)="!item.disabled && deselectItem(item)"
                  [disabled]="item.disabled"
                  [attr.aria-label]="'Remove ' + item.label"
                  tabindex="-1">
            <app-icon name="x" class="picker__chip-remove-icon"></app-icon>
          </button>
        </div>
        
        <!-- Add button when no items selected -->
        <button type="button"
                class="picker__add-trigger"
                *ngIf="state.selectedItems.length === 0"
                (click)="toggle()"
                (keydown)="onTriggerKeydown($event)"
                [attr.aria-haspopup]="PICKER_ROLES.LISTBOX"
                [attr.aria-expanded]="state.isOpen"
                [attr.aria-controls]="dropdownId">
          <span class="picker__add-trigger-text">{{ config.placeholder }}</span>
          <app-icon name="plus" class="picker__add-trigger-icon"></app-icon>
        </button>
      </div>

      <!-- Search input (when open) -->
      <div class="picker__search" *ngIf="state.isOpen && config.searchable">
        <input #searchInput
               type="text"
               class="picker__search-input"
               [value]="state.searchQuery"
               (input)="onSearchInput($event)"
               (keydown)="onSearchKeydown($event)"
               [placeholder]="'Search and select items...'"
               [attr.aria-label]="'Search picker items'">
      </div>

      <!-- Dropdown list -->
      <div class="picker__dropdown"
           *ngIf="state.isOpen"
           [id]="dropdownId"
           role="listbox"
           [attr.aria-label]="a11y['aria-label'] || 'Picker options'"
           [attr.aria-multiselectable]="true">
        
        <!-- Empty state -->
        <div *ngIf="state.filteredItems.length === 0 && config.showEmptyState" 
             class="picker__empty-state">
          <span class="picker__empty-message">{{ config.emptyStateMessage }}</span>
        </div>

        <!-- Item list -->
        <ul *ngIf="state.filteredItems.length > 0" 
            class="picker__list"
            (keydown)="onListKeydown($event)">
          <li *ngFor="let item of state.filteredItems; let i = index"
              class="picker__item"
              [class.picker__item--focused]="i === state.focusedIndex"
              [class.picker__item--selected]="isItemSelected(item)"
              [class.picker__item--disabled]="item.disabled"
              role="option"
              [attr.id]="getOptionId(i)"
              [attr.aria-selected]="isItemSelected(item)"
              [attr.aria-disabled]="item.disabled"
              (click)="!item.disabled && toggleItemSelection(item)"
              (mouseenter)="!item.disabled && focusItem(i)">
            
            <div class="picker__item-content">
              <app-icon *ngIf="config.showIcons && item.icon" 
                        [name]="item.icon"
                        class="picker__item-icon"></app-icon>
              <span class="picker__item-label">{{ item.label }}</span>
            </div>

            <div class="picker__item-actions">
              <app-icon *ngIf="isItemSelected(item)" 
                        name="check"
                        class="picker__item-check"></app-icon>
              
              <button type="button"
                      *ngIf="!isItemSelected(item)"
                      class="picker__item-add"
                      (click)="!item.disabled && selectItem(item)"
                      [disabled]="item.disabled"
                      [attr.aria-label]="'Select ' + item.label">
                <app-icon name="plus" class="picker__item-add-icon"></app-icon>
              </button>
            </div>
          </li>
        </ul>
      </div>

      <!-- Overlay for closing dropdown -->
      <div *ngIf="state.isOpen" 
           class="picker__overlay"
           (click)="close()"></div>
    </div>
  `,
  styleUrls: ['./multi-picker.component.scss']
})
export class MultiPickerComponent implements OnInit, OnDestroy {
  @Input() adapter!: PickerAdapter<PickerItem>;
  @Input() config: PickerConfig = DEFAULT_PICKER_CONFIG;
  @Input() selectedItems: PickerItem[] = [];
  @Input() a11y: PickerA11yAttributes = {};
  
  @Output() selectionChange = new EventEmitter<PickerItem[]>();
  @Output() pickerEvent = new EventEmitter<PickerEvent>();

  @ViewChild('searchInput', { static: false }) searchInput?: ElementRef<HTMLInputElement>;

  readonly PICKER_ROLES = PICKER_ROLES;
  
  state: MultiPickerState = {
    selectedItems: [],
    isOpen: false,
    searchQuery: '',
    filteredItems: [],
    focusedIndex: -1
  };

  dropdownId = `multi-picker-dropdown-${Math.random().toString(36).substr(2, 9)}`;
  
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.initializeState();
    this.setupSearchSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeState(): void {
    this.state.selectedItems = [...this.selectedItems];
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
    this.state.focusedIndex = this.getFirstUnselectedItemIndex();
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
    this.emitEvent({ type: 'close' });
    
    this.cdr.detectChanges();
  }

  selectItem(item: PickerItem): void {
    if (item.disabled || this.isItemSelected(item)) return;
    
    this.state.selectedItems.push(item);
    this.updateFilteredItems();
    
    // Keep focus on the next unselected item
    this.state.focusedIndex = this.getFirstUnselectedItemIndex();
    
    this.selectionChange.emit([...this.state.selectedItems]);
    this.emitEvent({ type: 'select', item });
    
    this.cdr.detectChanges();
  }

  deselectItem(item: PickerItem): void {
    const index = this.state.selectedItems.findIndex(selected => selected.id === item.id);
    if (index === -1) return;
    
    this.state.selectedItems.splice(index, 1);
    this.updateFilteredItems();
    
    this.selectionChange.emit([...this.state.selectedItems]);
    this.emitEvent({ type: 'deselect', item });
    
    this.cdr.detectChanges();
  }

  toggleItemSelection(item: PickerItem): void {
    if (this.isItemSelected(item)) {
      this.deselectItem(item);
    } else {
      this.selectItem(item);
    }
  }

  clearSelection(): void {
    this.state.selectedItems = [];
    this.updateFilteredItems();
    this.selectionChange.emit([]);
    this.cdr.detectChanges();
  }

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
      case PickerKey.Backspace:
        if (!this.state.searchQuery) {
          event.preventDefault();
          // Remove last selected item
          const lastItem = this.state.selectedItems[this.state.selectedItems.length - 1];
          if (lastItem) {
            this.deselectItem(lastItem);
          }
        }
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
        this.toggleFocusedItem();
        break;
      case PickerKey.Escape:
        event.preventDefault();
        this.close();
        break;
      case PickerKey.Tab:
        this.close();
        break;
      case PickerKey.Space:
        event.preventDefault();
        this.toggleFocusedItem();
        break;
    }
  }

  focusNext(): void {
    if (!this.state.filteredItems.length) return;
    
    const nextIndex = this.state.focusedIndex + 1;
    this.state.focusedIndex = nextIndex >= this.state.filteredItems.length ? 0 : nextIndex;
    
    this.scrollFocusedItemIntoView();
    this.cdr.detectChanges();
  }

  focusPrevious(): void {
    if (!this.state.filteredItems.length) return;
    
    const prevIndex = this.state.focusedIndex - 1;
    this.state.focusedIndex = prevIndex < 0 ? this.state.filteredItems.length - 1 : prevIndex;
    
    this.scrollFocusedItemIntoView();
    this.cdr.detectChanges();
  }

  focusFirst(): void {
    if (!this.state.filteredItems.length) return;
    
    this.state.focusedIndex = 0;
    this.scrollFocusedItemIntoView();
    this.cdr.detectChanges();
  }

  focusLast(): void {
    if (!this.state.filteredItems.length) return;
    
    this.state.focusedIndex = this.state.filteredItems.length - 1;
    this.scrollFocusedItemIntoView();
    this.cdr.detectChanges();
  }

  focusItem(index: number): void {
    if (index < 0 || index >= this.state.filteredItems.length) return;
    
    this.state.focusedIndex = index;
    this.cdr.detectChanges();
  }

  isItemSelected(item: PickerItem): boolean {
    return this.state.selectedItems.some(selected => selected.id === item.id);
  }

  getActiveDescendant(): string | null {
    if (this.state.focusedIndex < 0) return null;
    return this.getOptionId(this.state.focusedIndex);
  }

  getOptionId(index: number): string {
    return `multi-picker-option-${index}`;
  }

  private filterItems(query: string): void {
    const allItems = this.adapter.getItems();
    
    if (!query.trim()) {
      this.state.filteredItems = this.getSortedItems(allItems);
    } else {
      const searchResults = this.adapter.searchItems(query);
      this.state.filteredItems = this.getSortedItems(searchResults);
    }
    
    // Adjust focused index to valid range
    if (this.state.focusedIndex >= this.state.filteredItems.length) {
      this.state.focusedIndex = this.getFirstUnselectedItemIndex();
    }
    
    this.cdr.detectChanges();
  }

  private updateFilteredItems(): void {
    this.filterItems(this.state.searchQuery);
  }

  private getSortedItems(items: PickerItem[]): PickerItem[] {
    const comparator = this.adapter.getSortComparator() || undefined;
    return PickerUtils.getDisplayOrder(items, this.state.selectedItems);
  }

  private getFirstUnselectedItemIndex(): number {
    const firstUnselected = this.state.filteredItems.findIndex(item => !this.isItemSelected(item));
    return firstUnselected >= 0 ? firstUnselected : 0;
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

  private toggleFocusedItem(): void {
    if (this.state.focusedIndex < 0 || this.state.focusedIndex >= this.state.filteredItems.length) {
      return;
    }
    
    const focusedItem = this.state.filteredItems[this.state.focusedIndex];
    if (!focusedItem.disabled) {
      this.toggleItemSelection(focusedItem);
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

  private emitEvent(event: PickerEvent): void {
    this.pickerEvent.emit(event);
  }
}