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
  SinglePickerState,
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
  selector: 'app-single-picker',
  template: `
    <div class="picker-container" 
         [class.picker--open]="state.isOpen"
         [attr.role]="a11y.role || PICKER_ROLES.COMBOBOX"
         [attr.aria-label]="a11y['aria-label']"
         [attr.aria-describedby]="a11y['aria-describedby']"
         [attr.aria-expanded]="state.isOpen"
         [attr.aria-controls]="dropdownId">
      
      <!-- Search input (when open) -->
      <div class="picker__search" *ngIf="state.isOpen && config.searchable">
        <input #searchInput
               type="text"
               class="picker__search-input"
               [value]="state.searchQuery"
               (input)="onSearchInput($event)"
               (keydown)="onSearchKeydown($event)"
               [placeholder]="'Search items...'"
               [attr.aria-label]="'Search picker items'">
      </div>

      <!-- Selected item display -->
      <button type="button"
              class="picker__trigger"
              (click)="toggle()"
              (keydown)="onTriggerKeydown($event)"
              [attr.aria-haspopup]="PICKER_ROLES.LISTBOX"
              [attr.aria-expanded]="state.isOpen"
              [attr.aria-controls]="dropdownId"
              [attr.aria-activedescendant]="getActiveDescendant()"
              [disabled]="false">
        <span class="picker__trigger-content">
          <span *ngIf="state.selectedItem" class="picker__trigger-item">
            <app-icon *ngIf="config.showIcons && state.selectedItem.icon" 
                      [name]="state.selectedItem.icon"
                      class="picker__trigger-icon"></app-icon>
            <span class="picker__trigger-label">{{ state.selectedItem.label }}</span>
          </span>
          <span *ngIf="!state.selectedItem" 
                class="picker__trigger-placeholder">{{ config.placeholder }}</span>
        </span>
        <app-icon name="chevron-down" 
                  class="picker__trigger-arrow"
                  [class.picker__trigger-arrow--open]="state.isOpen"></app-icon>
      </button>

      <!-- Dropdown list -->
      <div class="picker__dropdown"
           *ngIf="state.isOpen"
           [id]="dropdownId"
           role="listbox"
           [attr.aria-label]="a11y['aria-label'] || 'Picker options'">
        
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
              (click)="!item.disabled && selectItem(item)"
              (mouseenter)="!item.disabled && focusItem(i)">
            
            <div class="picker__item-content">
              <app-icon *ngIf="config.showIcons && item.icon" 
                        [name]="item.icon"
                        class="picker__item-icon"></app-icon>
              <span class="picker__item-label">{{ item.label }}</span>
            </div>

            <app-icon *ngIf="isItemSelected(item)" 
                      name="check"
                      class="picker__item-check"></app-icon>
          </li>
        </ul>
      </div>

      <!-- Overlay for closing dropdown -->
      <div *ngIf="state.isOpen" 
           class="picker__overlay"
           (click)="close()"></div>
    </div>
  `,
  styleUrls: ['./single-picker.component.scss']
})
export class SinglePickerComponent implements OnInit, OnDestroy {
  @Input() adapter!: PickerAdapter<PickerItem>;
  @Input() config: PickerConfig = DEFAULT_PICKER_CONFIG;
  @Input() selectedItem: PickerItem | null = null;
  @Input() a11y: PickerA11yAttributes = {};
  
  @Output() selectionChange = new EventEmitter<PickerItem | null>();
  @Output() pickerEvent = new EventEmitter<PickerEvent>();

  @ViewChild('searchInput', { static: false }) searchInput?: ElementRef<HTMLInputElement>;

  readonly PICKER_ROLES = PICKER_ROLES;
  
  state: SinglePickerState = {
    selectedItem: null,
    isOpen: false,
    searchQuery: '',
    filteredItems: [],
    focusedIndex: -1
  };

  dropdownId = `picker-dropdown-${Math.random().toString(36).substr(2, 9)}`;
  
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
    this.state.selectedItem = this.selectedItem;
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
    this.state.focusedIndex = this.getSelectedItemIndex();
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
    if (item.disabled) return;
    
    this.state.selectedItem = item;
    this.state.searchQuery = '';
    this.updateFilteredItems();
    this.close();
    
    this.selectionChange.emit(item);
    this.emitEvent({ type: 'select', item });
    
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
    return this.state.selectedItem?.id === item.id;
  }

  getActiveDescendant(): string | null {
    if (this.state.focusedIndex < 0) return null;
    return this.getOptionId(this.state.focusedIndex);
  }

  getOptionId(index: number): string {
    return `picker-option-${index}`;
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
      this.state.focusedIndex = this.state.filteredItems.length - 1;
    }
    
    this.cdr.detectChanges();
  }

  private updateFilteredItems(): void {
    this.filterItems(this.state.searchQuery);
  }

  private getSortedItems(items: PickerItem[]): PickerItem[] {
    const comparator = this.adapter.getSortComparator() || undefined;
    return PickerUtils.sortItems(items, comparator);
  }

  private getSelectedItemIndex(): number {
    if (!this.state.selectedItem) return 0;
    
    const index = this.state.filteredItems.findIndex(
      item => item.id === this.state.selectedItem!.id
    );
    
    return index >= 0 ? index : 0;
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

  private emitEvent(event: PickerEvent): void {
    this.pickerEvent.emit(event);
  }
}