import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechNode } from '../../../tech-tree/tech-node.interface';

export interface PrerequisiteListItem {
  id: string;
  name: string;
  tier: number;
  isValid: boolean;
  validationMessage?: string;
  isEditing: boolean;
}

export interface PrerequisiteListConfig {
  showTier: boolean;
  showValidation: boolean;
  allowReordering: boolean;
  allowEditing: boolean;
  emptyMessage: string;
}

@Component({
  selector: 'app-prerequisite-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prerequisite-list.component.html',
  styleUrls: ['./prerequisite-list.component.scss']
})
export class PrerequisiteListComponent implements OnChanges {
  @Input() prerequisites: string[] = [];
  @Input() availableNodes: TechNode[] = [];
  @Input() config: PrerequisiteListConfig = {
    showTier: true,
    showValidation: true,
    allowReordering: false,
    allowEditing: false,
    emptyMessage: 'No prerequisites selected'
  };
  @Input() isDisabled: boolean = false;
  
  @Output() prerequisiteRemoved = new EventEmitter<string>();
  @Output() prerequisiteReordered = new EventEmitter<{ fromIndex: number; toIndex: number }>();
  @Output() prerequisiteClicked = new EventEmitter<string>();
  @Output() listModified = new EventEmitter<string[]>();
  
  listItems: PrerequisiteListItem[] = [];
  draggedItemIndex: number | null = null;
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['prerequisites'] || changes['availableNodes']) {
      this.updateListItems();
    }
  }
  
  /**
   * Update the list items based on current prerequisites and available nodes
   */
  private updateListItems(): void {
    this.listItems = this.prerequisites.map(prereqId => {
      const node = this.availableNodes.find(n => n.id === prereqId);
      return {
        id: prereqId,
        name: node?.name || prereqId,
        tier: node?.tier || 0,
        isValid: true, // Will be updated by validation system
        validationMessage: undefined,
        isEditing: false
      };
    });
  }
  
  /**
   * Handle prerequisite removal
   */
  onRemovePrerequisite(prereqId: string, event: Event): void {
    event.stopPropagation();
    if (this.isDisabled) return;
    
    this.prerequisiteRemoved.emit(prereqId);
    this.emitListModified();
  }
  
  /**
   * Handle prerequisite click (for navigation or focus)
   */
  onPrerequisiteClick(prereqId: string): void {
    if (this.isDisabled) return;
    
    this.prerequisiteClicked.emit(prereqId);
  }
  
  /**
   * Handle drag start for reordering
   */
  onDragStart(index: number, event: DragEvent): void {
    if (!this.config.allowReordering || this.isDisabled) return;
    
    this.draggedItemIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', index.toString());
    }
  }
  
  /**
   * Handle drag over for reordering
   */
  onDragOver(event: DragEvent): void {
    if (!this.config.allowReordering || this.isDisabled || this.draggedItemIndex === null) return;
    
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }
  
  /**
   * Handle drop for reordering
   */
  onDrop(targetIndex: number, event: DragEvent): void {
    if (!this.config.allowReordering || this.isDisabled || this.draggedItemIndex === null) return;
    
    event.preventDefault();
    
    const fromIndex = this.draggedItemIndex;
    const toIndex = targetIndex;
    
    if (fromIndex !== toIndex) {
      // Reorder the prerequisites array
      const newPrerequisites = [...this.prerequisites];
      const [movedItem] = newPrerequisites.splice(fromIndex, 1);
      newPrerequisites.splice(toIndex, 0, movedItem);
      
      // Emit reorder event
      this.prerequisiteReordered.emit({ fromIndex, toIndex });
      this.emitListModified();
    }
    
    this.draggedItemIndex = null;
  }
  
  /**
   * Handle drag end
   */
  onDragEnd(): void {
    this.draggedItemIndex = null;
  }
  
  /**
   * Handle keyboard navigation for reordering
   */
  onKeydown(event: KeyboardEvent, index: number): void {
    if (!this.config.allowReordering || this.isDisabled) return;
    
    switch (event.key) {
      case 'ArrowUp':
        if (index > 0) {
          event.preventDefault();
          this.moveItem(index, index - 1);
        }
        break;
      case 'ArrowDown':
        if (index < this.listItems.length - 1) {
          event.preventDefault();
          this.moveItem(index, index + 1);
        }
        break;
      case 'Delete':
      case 'Backspace':
        event.preventDefault();
        this.onRemovePrerequisite(this.listItems[index].id, event);
        break;
    }
  }
  
  /**
   * Move item from one index to another
   */
  private moveItem(fromIndex: number, toIndex: number): void {
    const newPrerequisites = [...this.prerequisites];
    const [movedItem] = newPrerequisites.splice(fromIndex, 1);
    newPrerequisites.splice(toIndex, 0, movedItem);
    
    this.prerequisiteReordered.emit({ fromIndex, toIndex });
    this.emitListModified();
  }
  
  /**
   * Emit the modified list
   */
  private emitListModified(): void {
    this.listModified.emit([...this.prerequisites]);
  }
  
  /**
   * Update validation state for list items
   */
  updateValidation(validationResults: Map<string, { isValid: boolean; message?: string }>): void {
    this.listItems.forEach(item => {
      const validation = validationResults.get(item.id);
      if (validation) {
        item.isValid = validation.isValid;
        item.validationMessage = validation.message;
      }
    });
  }
  
  /**
   * Get display tier text
   */
  getTierDisplay(tier: number): string {
    return `Tier ${tier}`;
  }
  
  /**
   * Get validation icon based on type
   */
  getValidationIcon(item: PrerequisiteListItem): string {
    if (!item.validationMessage) return '';
    
    // Could be enhanced to show different icons for different validation types
    return '⚠';
  }
  
  /**
   * Check if list is empty
   */
  isEmpty(): boolean {
    return this.listItems.length === 0;
  }
  
  /**
   * Get total count of prerequisites
   */
  getCount(): number {
    return this.listItems.length;
  }
  
  /**
   * Get valid prerequisite count
   */
  getValidCount(): number {
    return this.listItems.filter(item => item.isValid).length;
  }
  
  /**
   * Get invalid prerequisite count
   */
  getInvalidCount(): number {
    return this.listItems.filter(item => !item.isValid).length;
  }
}
