import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TechNode } from '../../tech-tree/tech-node.interface';

export interface PrerequisiteSelectorData {
  id: string;
  name: string;
  tier: number;
  isSelected: boolean;
  isValid: boolean;
  validationMessage?: string;
}

export interface PrerequisiteSelectorConfig {
  allowMultiSelect: boolean;
  showTier: boolean;
  showValidation: boolean;
  placeholder: string;
  maxHeight: number;
}

@Component({
  selector: 'app-prerequisite-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prerequisite-selector.component.html',
  styleUrls: ['./prerequisite-selector.component.scss']
})
export class PrerequisiteSelectorComponent implements OnChanges {
  @Input() availableNodes: TechNode[] = [];
  @Input() selectedPrerequisites: string[] = [];
  @Input() currentNodeId: string = '';
  @Input() config: PrerequisiteSelectorConfig = {
    allowMultiSelect: true,
    showTier: true,
    showValidation: true,
    placeholder: 'Search and select prerequisites...',
    maxHeight: 300
  };
  @Input() isDisabled: boolean = false;
  
  @Output() prerequisiteSelected = new EventEmitter<string>();
  @Output() prerequisiteDeselected = new EventEmitter<string>();
  @Output() searchChanged = new EventEmitter<string>();
  @Output() nodeFocused = new EventEmitter<TechNode>();
  
  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;
  
  searchTerm: string = '';
  filteredNodes: PrerequisiteSelectorData[] = [];
  isDropdownOpen: boolean = false;
  focusedIndex: number = -1;
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['availableNodes'] || changes['selectedPrerequisites'] || changes['currentNodeId']) {
      this.updateFilteredNodes();
    }
  }
  
  /**
   * Update the filtered nodes list based on search term and current selections
   */
  private updateFilteredNodes(): void {
    const searchLower = this.searchTerm.toLowerCase();
    
    this.filteredNodes = this.availableNodes
      .filter(node => {
        // Filter out the current node itself
        if (node.id === this.currentNodeId) {
          return false;
        }
        
        // Apply search filter
        if (this.searchTerm) {
          return node.name.toLowerCase().includes(searchLower) ||
                 node.id.toLowerCase().includes(searchLower);
        }
        
        return true;
      })
      .map(node => ({
        id: node.id,
        name: node.name,
        tier: node.tier,
        isSelected: this.selectedPrerequisites.includes(node.id),
        isValid: true, // Will be updated by validation system
        validationMessage: undefined
      }))
      .sort((a, b) => {
        // Sort by tier first, then by name
        if (a.tier !== b.tier) {
          return a.tier - b.tier;
        }
        return a.name.localeCompare(b.name);
      });
    
    // Reset focused index when filter changes
    this.focusedIndex = -1;
  }
  
  /**
   * Handle search input changes
   */
  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.searchChanged.emit(term);
    this.updateFilteredNodes();
  }
  
  /**
   * Toggle dropdown open/closed
   */
  toggleDropdown(): void {
    if (this.isDisabled) return;
    
    this.isDropdownOpen = !this.isDropdownOpen;
    
    if (this.isDropdownOpen) {
      // Focus search input when dropdown opens
      setTimeout(() => {
        this.searchInput?.nativeElement.focus();
      }, 100);
    }
  }
  
  /**
   * Handle prerequisite selection
   */
  onPrerequisiteClick(nodeData: PrerequisiteSelectorData): void {
    if (this.isDisabled || !nodeData.isValid) return;
    
    if (nodeData.isSelected) {
      this.prerequisiteDeselected.emit(nodeData.id);
    } else {
      // Check if multi-select is allowed
      if (!this.config.allowMultiSelect && this.selectedPrerequisites.length > 0) {
        // Replace existing selection
        this.prerequisiteDeselected.emit(this.selectedPrerequisites[0]);
      }
      this.prerequisiteSelected.emit(nodeData.id);
    }
  }
  
  /**
   * Handle keyboard navigation
   */
  onKeydown(event: KeyboardEvent): void {
    if (!this.isDropdownOpen) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.toggleDropdown();
      }
      return;
    }
    
    switch (event.key) {
      case 'Escape':
        this.closeDropdown();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.moveFocus(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.moveFocus(-1);
        break;
      case 'Enter':
        event.preventDefault();
        this.selectFocusedItem();
        break;
      case ' ':
        event.preventDefault();
        this.selectFocusedItem();
        break;
    }
  }
  
  /**
   * Move focus up/down in the list
   */
  private moveFocus(direction: number): void {
    const validItems = this.filteredNodes.filter(node => node.isValid);
    
    if (validItems.length === 0) return;
    
    // Find current focus among valid items
    let currentValidIndex = -1;
    if (this.focusedIndex >= 0) {
      const focusedItem = this.filteredNodes[this.focusedIndex];
      currentValidIndex = validItems.findIndex(item => item.id === focusedItem.id);
    }
    
    // Calculate new valid index
    let newValidIndex = currentValidIndex + direction;
    
    if (newValidIndex < 0) {
      newValidIndex = validItems.length - 1;
    } else if (newValidIndex >= validItems.length) {
      newValidIndex = 0;
    }
    
    // Find the index in the full filtered list
    const newFocusedItem = validItems[newValidIndex];
    this.focusedIndex = this.filteredNodes.findIndex(item => item.id === newFocusedItem.id);
  }
  
  /**
   * Select the currently focused item
   */
  private selectFocusedItem(): void {
    if (this.focusedIndex >= 0 && this.focusedIndex < this.filteredNodes.length) {
      const nodeData = this.filteredNodes[this.focusedIndex];
      this.onPrerequisiteClick(nodeData);
    }
  }
  
  /**
   * Close dropdown and reset state
   */
  closeDropdown(): void {
    this.isDropdownOpen = false;
    this.focusedIndex = -1;
    this.searchTerm = '';
    this.updateFilteredNodes();
  }
  
  /**
   * Get display text for selected prerequisites
   */
  getSelectedDisplayText(): string {
    if (this.selectedPrerequisites.length === 0) {
      return this.config.placeholder;
    }
    
    if (this.selectedPrerequisites.length === 1) {
      const node = this.availableNodes.find(n => n.id === this.selectedPrerequisites[0]);
      return node ? node.name : this.selectedPrerequisites[0];
    }
    
    return `${this.selectedPrerequisites.length} prerequisites selected`;
  }
  
  /**
   * Update validation state for nodes
   */
  updateValidation(validationResults: Map<string, { isValid: boolean; message?: string }>): void {
    this.filteredNodes.forEach(node => {
      const validation = validationResults.get(node.id);
      if (validation) {
        node.isValid = validation.isValid;
        node.validationMessage = validation.message;
      }
    });
  }
  
  /**
   * Check if a node should be disabled
   */
  isNodeDisabled(nodeData: PrerequisiteSelectorData): boolean {
    return this.isDisabled || 
           !nodeData.isValid || 
           (!this.config.allowMultiSelect && this.selectedPrerequisites.length > 0 && !nodeData.isSelected);
  }
  
  /**
   * Get node display tier text
   */
  getTierDisplay(tier: number): string {
    return `Tier ${tier}`;
  }
  
  /**
   * Handle clicking outside to close dropdown
   */
  onClickOutside(event: Event): void {
    const target = event.target as Element;
    if (!target.closest('.prerequisite-selector')) {
      this.closeDropdown();
    }
  }
}