import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeIdentityFieldsComponent, NodeIdentityData } from './node-identity-fields.component';
import { PrerequisiteSelectorComponent, PrerequisiteSelectorData, PrerequisiteSelectorConfig } from './prerequisite-selector.component';
import { PrerequisiteListComponent, PrerequisiteListItem, PrerequisiteListConfig } from './prerequisite-list.component';
import { PrerequisiteValidationService, ValidationResult } from './prerequisite-validation.service';
import { CompositionalEffectsEditorComponent } from '../../../effects/compositional-effects-editor.component';
import { CultureTagComboboxComponent } from '../../../../pages/tech-tree-editor/culture-tag-combobox.component';
import { CultureTagId } from '../../../../models/tech-tree.models';
import { GovernedCultureTagOption } from '../../../../pages/tech-tree-editor/tech-tree-editor.types';
// import { EditorTechNodeEffects, TechEnumOption } from '../../../tech-tree-editor/tech-tree-editor.types';

export interface ValidationMessage {
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
  field?: string;
  section?: string;
}

export interface NodeDetailSection {
  id: string;
  title: string;
  description?: string;
  isCollapsed: boolean;
  validationMessages: ValidationMessage[];
}

@Component({
  selector: 'app-node-detail-panel',
  standalone: true,
  imports: [CommonModule, NodeIdentityFieldsComponent, PrerequisiteSelectorComponent, PrerequisiteListComponent, CultureTagComboboxComponent],
  templateUrl: './node-detail-panel.component.html',
  styleUrls: ['./node-detail-panel.component.scss']
})
export class NodeDetailPanelComponent {
  @Input() selectedNode: any = null;
  @Input() isVisible: boolean = false;
  @Output() nodeUpdated = new EventEmitter<any>();
  
  // Reference to identity fields component
  @ViewChild(NodeIdentityFieldsComponent) identityFieldsComponent?: NodeIdentityFieldsComponent;
  
  // Culture tag combobox reference
  @ViewChild(CultureTagComboboxComponent) cultureTagCombobox?: CultureTagComboboxComponent;
  
  // Culture tag inputs
  @Input() cultureTagOptions: GovernedCultureTagOption[] = [];
  @Input() defaultCultureTags: CultureTagId[] = [];
  
  // Current culture tags (synced with selected node)
  get currentCultureTags(): CultureTagId[] {
    return this.selectedNode?.culture_tags || [];
  }
  
  // Identity fields data
  get nodeIdentityData(): NodeIdentityData | null {
    if (!this.selectedNode) return null;
    
    return {
      id: this.selectedNode.id || '',
      displayName: this.selectedNode.name || '',
      description: this.selectedNode.description || '',
      originalId: this.selectedNode.id
    };
  }

  // Section configuration with progressive disclosure in mind
  sections: NodeDetailSection[] = [
    {
      id: 'identity',
      title: 'Identity & Naming',
      description: 'Basic node identification and naming properties',
      isCollapsed: false,
      validationMessages: []
    },
    {
      id: 'visual',
      title: 'Visual Identity',
      description: 'Icon, colors, and visual representation',
      isCollapsed: false,
      validationMessages: []
    },
    {
      id: 'prerequisites',
      title: 'Prerequisites',
      description: 'Requirements and dependencies',
      isCollapsed: false,
      validationMessages: []
    },
    {
      id: 'effects',
      title: 'Effects',
      description: 'Node effects and consequences',
      isCollapsed: false,
      validationMessages: []
    },
    {
      id: 'metadata',
      title: 'Metadata & Advanced',
      description: 'Advanced properties and metadata',
      isCollapsed: true, // Start collapsed for progressive disclosure
      validationMessages: []
    }
  ];

  // Global validation messages that remain visible across all sections
  globalValidationMessages: ValidationMessage[] = [];

  /**
   * Toggle section collapse/expand state
   * Supports progressive disclosure while maintaining validation visibility
   */
  toggleSection(sectionId: string): void {
    const section = this.sections.find(s => s.id === sectionId);
    if (section) {
      section.isCollapsed = !section.isCollapsed;
    }
  }

  /**
   * Expand all sections - useful for validation review
   */
  expandAllSections(): void {
    this.sections.forEach(section => section.isCollapsed = false);
  }

  /**
   * Collapse all sections except critical ones
   */
  collapseAllSections(): void {
    this.sections.forEach(section => {
      // Keep identity section always visible for context
      if (section.id !== 'identity') {
        section.isCollapsed = true;
      }
    });
  }

  /**
   * Add validation message to a specific section
   */
  addValidationMessage(sectionId: string, message: ValidationMessage): void {
    const section = this.sections.find(s => s.id === sectionId);
    if (section) {
      section.validationMessages.push({ ...message, section: sectionId });
    }
  }

  /**
   * Add global validation message (visible regardless of section state)
   */
  addGlobalValidationMessage(message: ValidationMessage): void {
    this.globalValidationMessages.push(message);
  }

  /**
   * Clear all validation messages
   */
  clearValidationMessages(): void {
    this.sections.forEach(section => section.validationMessages = []);
    this.globalValidationMessages = [];
  }

  /**
   * Get validation count for display
   */
  getValidationCount(): number {
    const sectionCount = this.sections.reduce((sum, section) => 
      sum + section.validationMessages.length, 0);
    return sectionCount + this.globalValidationMessages.length;
  }

  /**
   * Get validation icon based on type
   */
  getValidationIcon(type: string): string {
    switch (type) {
      case 'error': return '✗';
      case 'warning': return '⚠';
      case 'success': return '✓';
      case 'info': return 'ℹ';
      default: return 'ℹ';
    }
  }

  /**
   * Handle section expansion with validation focus
   */
  onSectionToggle(sectionId: string): void {
    this.toggleSection(sectionId);
    
    // If expanding a section with validation messages, scroll to first validation
    const section = this.sections.find(s => s.id === sectionId);
    if (section && !section.isCollapsed && section.validationMessages.length > 0) {
      setTimeout(() => {
        const validationElement = document.getElementById(`validation-${sectionId}`);
        if (validationElement) {
          validationElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    }
  }

  /**
   * Check if node has any validation issues
   */
  hasValidationIssues(): boolean {
    return this.getValidationCount() > 0;
  }

  /**
   * Get sections with validation messages (for priority display)
   */
  getSectionsWithValidations(): NodeDetailSection[] {
    return this.sections.filter(section => section.validationMessages.length > 0);
  }



  /**
   * Handle validation requests from identity fields
   */
  onIdentityValidationRequested(request: { field: string, value: string }): void {
    if (request.field === 'id' && request.value !== this.selectedNode?.id) {
      // Add validation message to identity section for ID changes
      this.addValidationMessage('identity', {
        type: 'warning',
        message: `Node ID change from "${this.selectedNode?.id}" to "${request.value}" may have downstream impact`,
        field: 'id',
        section: 'identity'
      });
      
      // Also add to global validation messages
      this.addGlobalValidationMessage({
        type: 'warning',
        message: `Identity change detected: Node ID modification requires validation`,
        field: 'id'
      });
    }
  }

  /**
   * Check if identity section has validation issues
   */
  hasIdentityValidationIssues(): boolean {
    const identitySection = this.sections.find(s => s.id === 'identity');
    return identitySection ? identitySection.validationMessages.length > 0 : false;
  }

  /**
   * Get identity validation count
   */
  getIdentityValidationCount(): number {
    const identitySection = this.sections.find(s => s.id === 'identity');
    return identitySection ? identitySection.validationMessages.length : 0;
  }

  // ============================================================================
  // PREREQUISITE MANAGEMENT (P1-9 Implementation)
  // ============================================================================

  // Reference to prerequisite components
  @ViewChild(PrerequisiteSelectorComponent) prerequisiteSelector?: PrerequisiteSelectorComponent;
  @ViewChild(PrerequisiteListComponent) prerequisiteList?: PrerequisiteListComponent;

  // Prerequisite management data
  @Input() allNodes: any[] = []; // TechNode[] - all available nodes in the tech tree
  
  // Prerequisite configurations
  get prerequisiteSelectorConfig(): PrerequisiteSelectorConfig {
    return {
      allowMultiSelect: true,
      showTier: true,
      showValidation: true,
      placeholder: 'Search and select prerequisites...',
      maxHeight: 300
    };
  }

  get prerequisiteListConfig(): PrerequisiteListConfig {
    return {
      showTier: true,
      showValidation: true,
      allowReordering: false, // Disabled for initial implementation
      allowEditing: false,    // Disabled for initial implementation
      emptyMessage: 'No prerequisites selected'
    };
  }

  // Current prerequisites (synced with selected node)
  get currentPrerequisites(): string[] {
    return this.selectedNode?.prerequisites || [];
  }

  /**
   * Handle prerequisite selection from selector
   */
  onPrerequisiteSelected(prereqId: string): void {
    if (!this.selectedNode) return;

    // Check if prerequisite already exists
    if (this.currentPrerequisites.includes(prereqId)) {
      return;
    }

    // Validate the prerequisite before adding
    const validation = this.validatePrerequisite(prereqId);
    if (!validation.isValid) {
      this.addPrerequisiteValidationMessage(validation);
      return;
    }

    // Add the prerequisite
    const updatedNode = {
      ...this.selectedNode,
      prerequisites: [...this.currentPrerequisites, prereqId]
    };

    this.nodeUpdated.emit(updatedNode);
  }

  /**
   * Handle prerequisite deselection from selector
   */
  onPrerequisiteDeselected(prereqId: string): void {
    if (!this.selectedNode) return;

    const updatedNode = {
      ...this.selectedNode,
      prerequisites: this.currentPrerequisites.filter(id => id !== prereqId)
    };

    this.nodeUpdated.emit(updatedNode);
  }

  /**
   * Handle prerequisite removal from list
   */
  onPrerequisiteRemoved(prereqId: string): void {
    this.onPrerequisiteDeselected(prereqId);
  }

  /**
   * Handle prerequisite reordering
   */
  onPrerequisiteReordered(event: { fromIndex: number; toIndex: number }): void {
    if (!this.selectedNode) return;

    const newPrerequisites = [...this.currentPrerequisites];
    const [movedItem] = newPrerequisites.splice(event.fromIndex, 1);
    newPrerequisites.splice(event.toIndex, 0, movedItem);

    const updatedNode = {
      ...this.selectedNode,
      prerequisites: newPrerequisites
    };

    this.nodeUpdated.emit(updatedNode);
  }

  /**
   * Handle prerequisite click (for navigation/focus)
   */
  onPrerequisiteClicked(prereqId: string): void {
    // This could emit an event to focus/highlight the prerequisite node in the canvas
    console.log('Prerequisite clicked:', prereqId);
  }

  /**
   * Handle list modification
   */
  onPrerequisiteListModified(prerequisites: string[]): void {
    if (!this.selectedNode) return;

    const updatedNode = {
      ...this.selectedNode,
      prerequisites: prerequisites
    };

    this.nodeUpdated.emit(updatedNode);
  }

  /**
   * Validate a single prerequisite
   */
  private validatePrerequisite(prereqId: string): ValidationResult {
    if (!this.selectedNode || !this.allNodes.length) {
      return {
        isValid: false,
        message: 'Cannot validate: insufficient data',
        type: 'warning'
      };
    }

    const validationService = new PrerequisiteValidationService();
    return validationService.wouldBeValidPrerequisite(
      this.selectedNode.id,
      prereqId,
      this.allNodes
    );
  }

  /**
   * Validate all current prerequisites
   */
  private validateAllPrerequisites(): void {
    if (!this.selectedNode || !this.allNodes.length) {
      return;
    }

    const validationService = new PrerequisiteValidationService();
    const validationResults = validationService.validatePrerequisites(
      this.selectedNode.id,
      this.currentPrerequisites,
      this.allNodes
    );

    // Update prerequisite components with validation results
    this.prerequisiteSelector?.updateValidation(validationResults);
    this.prerequisiteList?.updateValidation(validationResults);

    // Update section validation messages
    this.updatePrerequisiteValidationMessages(validationResults);
  }

  /**
   * Add validation messages to prerequisites section
   */
  private addPrerequisiteValidationMessage(validation: ValidationResult): void {
    const message: ValidationMessage = {
      type: validation.isValid ? 'warning' : 'error',
      message: validation.message || 'Prerequisite validation failed',
      section: 'prerequisites'
    };

    this.addValidationMessage('prerequisites', message);
  }

  /**
   * Update prerequisite section validation messages
   */
  private updatePrerequisiteValidationMessages(validationResults: Map<string, ValidationResult>): void {
    // Clear existing prerequisite validation messages
    const prereqSection = this.sections.find(s => s.id === 'prerequisites');
    if (prereqSection) {
      prereqSection.validationMessages = [];
    }

    // Add new validation messages for invalid prerequisites
    for (const [prereqId, result] of validationResults.entries()) {
      if (!result.isValid) {
        const node = this.allNodes.find(n => n.id === prereqId);
        const nodeName = node?.name || prereqId;
        
        this.addValidationMessage('prerequisites', {
          type: result.type === 'circular' ? 'error' : 'error',
          message: `${nodeName}: ${result.message}`,
          field: 'prerequisites',
          section: 'prerequisites'
        });
      }
    }
  }

  /**
   * Check if prerequisites section has validation issues
   */
  hasPrerequisiteValidationIssues(): boolean {
    const prereqSection = this.sections.find(s => s.id === 'prerequisites');
    return prereqSection ? prereqSection.validationMessages.length > 0 : false;
  }

  /**
   * Get prerequisite validation count
   */
  getPrerequisiteValidationCount(): number {
    const prereqSection = this.sections.find(s => s.id === 'prerequisites');
    return prereqSection ? prereqSection.validationMessages.length : 0;
  }

  /**
   * Get available nodes for prerequisite selection (excluding current node)
   */
  getAvailableNodes(): any[] {
    if (!this.selectedNode) return this.allNodes;
    
    return this.allNodes.filter(node => node.id !== this.selectedNode.id);
  }

  /**
   * Handle search changes in prerequisite selector
   */
  onPrerequisiteSearchChanged(searchTerm: string): void {
    // Could be used for analytics or to update other UI elements
    console.log('Prerequisite search changed:', searchTerm);
  }

  /**
   * Handle prerequisite node focus
   */
  onPrerequisiteNodeFocused(node: any): void {
    // Could be used to highlight the node in the canvas or show additional info
    console.log('Prerequisite node focused:', node.id);
  }

  /**
   * Refresh prerequisite validation (called when node data changes)
   */
  refreshPrerequisiteValidation(): void {
    setTimeout(() => {
      this.validateAllPrerequisites();
    }, 100); // Small delay to ensure data is updated
  }

  // ============================================================================
  // CULTURE TAG MANAGEMENT (P1-11 Implementation)
  // ============================================================================

  /**
   * Handle culture tag selection changes from combobox
   */
  onCultureTagsChanged(tags: CultureTagId[]): void {
    if (!this.selectedNode) return;

    // Validate the culture tags before applying
    const validation = this.validateCultureTags(tags);
    if (!validation.isValid) {
      this.addCultureTagValidationMessage(validation);
      return;
    }

    // Update the node with new culture tags
    const updatedNode = {
      ...this.selectedNode,
      culture_tags: tags
    };

    this.nodeUpdated.emit(updatedNode);
  }

  /**
   * Validate culture tag selection
   */
  private validateCultureTags(tags: CultureTagId[]): { isValid: boolean; message: string; type: 'error' | 'warning' | 'success' } {
    if (!this.selectedNode) {
      return {
        isValid: false,
        message: 'Cannot validate: no node selected',
        type: 'warning'
      };
    }

    // Check for invalid tag IDs
    const invalidTags = tags.filter(tagId => 
      !this.cultureTagOptions.find(option => option.id === tagId)
    );

    if (invalidTags.length > 0) {
      return {
        isValid: false,
        message: `Invalid culture tags detected: ${invalidTags.join(', ')}`,
        type: 'error'
      };
    }

    // Check for deprecated tags
    const deprecatedTags = tags.filter(tagId => {
      const option = this.cultureTagOptions.find(opt => opt.id === tagId);
      return option && option.status === 'delete_requested';
    });

    if (deprecatedTags.length > 0) {
      return {
        isValid: true, // Allow but warn
        message: `Warning: ${deprecatedTags.length} deprecated tag(s) selected`,
        type: 'warning'
      };
    }

    return {
      isValid: true,
      message: 'Culture tags are valid',
      type: 'success'
    };
  }

  /**
   * Add validation message to culture tags section
   */
  private addCultureTagValidationMessage(validation: { isValid: boolean; message: string; type: 'error' | 'warning' | 'success' }): void {
    const message: ValidationMessage = {
      type: validation.type === 'success' ? 'success' : validation.type,
      message: validation.message || 'Culture tag validation failed',
      section: 'visual'
    };

    this.addValidationMessage('visual', message);
  }

  /**
   * Check if culture tags section has validation issues
   */
  hasCultureTagValidationIssues(): boolean {
    const visualSection = this.sections.find(s => s.id === 'visual');
    return visualSection ? visualSection.validationMessages.length > 0 : false;
  }

  /**
   * Get culture tag validation count
   */
  getCultureTagValidationCount(): number {
    const visualSection = this.sections.find(s => s.id === 'visual');
    return visualSection ? visualSection.validationMessages.length : 0;
  }

  /**
   * Describe default culture tags for display
   */
  describeDefaultCultureTags(): string {
    return this.defaultCultureTags.length ? this.defaultCultureTags.join(', ') : 'none';
  }

  /**
   * Check if node is using default culture tags
   */
  isUsingDefaultCultureTags(): boolean {
    const nodeTags = this.currentCultureTags;
    const defaults = this.defaultCultureTags;
    
    if (nodeTags.length === 0 && defaults.length === 0) return true;
    if (nodeTags.length !== defaults.length) return false;
    
    return nodeTags.every(tag => defaults.includes(tag)) && 
           defaults.every(tag => nodeTags.includes(tag));
  }

  /**
   * Track by function for culture tag IDs
   */
  trackByCultureTagId(index: number, tagId: CultureTagId): string {
    return tagId;
  }

  /**
   * Get culture tag label by ID
   */
  getCultureTagLabel(tagId: CultureTagId): string {
    const option = this.cultureTagOptions.find(opt => opt.id === tagId);
    return option ? option.label : tagId;
  }

  /**
   * Get culture tag namespace by ID
   */
  getCultureTagNamespace(tagId: CultureTagId): string {
    const option = this.cultureTagOptions.find(opt => opt.id === tagId);
    return option ? option.source.toUpperCase() : 'UNKNOWN';
  }

  /**
   * Check if a culture tag is deprecated
   */
  isTagDeprecated(tagId: CultureTagId): boolean {
    const option = this.cultureTagOptions.find(opt => opt.id === tagId);
    return option ? option.status === 'delete_requested' : false;
  }

  // Override node update to refresh prerequisite validation
  onIdentityChanged(identityData: NodeIdentityData): void {
    if (this.selectedNode) {
      // Update the selected node with new identity data
      const updatedNode = {
        ...this.selectedNode,
        id: identityData.id,
        name: identityData.displayName,
        description: identityData.description
      };
      
      // Update the original ID for change tracking
      updatedNode.originalId = identityData.originalId;
      
      // Emit the updated node
      this.nodeUpdated.emit(updatedNode);
      
      // Refresh prerequisite validation after identity change
      this.refreshPrerequisiteValidation();
    }
  }
}