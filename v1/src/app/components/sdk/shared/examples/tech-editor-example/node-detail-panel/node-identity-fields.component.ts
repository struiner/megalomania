import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface NodeIdentityData {
  id: string;
  displayName: string;
  description: string;
  originalId?: string; // Track original ID for change detection
}

export interface IdentityValidationMessage {
  type: 'error' | 'warning' | 'info';
  field: 'id' | 'displayName' | 'description';
  message: string;
  downstreamImpact?: boolean;
  affectedNodes?: string[];
}

@Component({
  selector: 'app-node-identity-fields',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './node-identity-fields.component.html',
  styleUrls: ['./node-identity-fields.component.scss']
})
export class NodeIdentityFieldsComponent implements OnInit, OnDestroy {
  @Input() nodeData: NodeIdentityData | null = null;
  @Input() isReadOnly: boolean = false;
  @Output() identityChanged = new EventEmitter<NodeIdentityData>();
  @Output() validationRequested = new EventEmitter<{ field: string, value: string }>();

  // Editing state management
  editingStates = {
    id: false,
    displayName: false,
    description: false
  };

  // Guarded editing for Node ID
  idGuardedMode = false;
  idChangeConfirmation = '';
  showIdWarning = false;

  // Form models for inline editing
  formModels = {
    id: '',
    displayName: '',
    description: ''
  };

  // Validation messages specific to identity fields
  validationMessages: IdentityValidationMessage[] = [];

  // Downstream impact analysis
  downstreamImpactNodes: string[] = [];
  hasDownstreamImpact = false;

  ngOnInit(): void {
    this.initializeFormModels();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  /**
   * Initialize form models from node data
   */
  private initializeFormModels(): void {
    if (this.nodeData) {
      this.formModels.id = this.nodeData.id;
      this.formModels.displayName = this.nodeData.displayName;
      this.formModels.description = this.nodeData.description;
    }
  }

  /**
   * Handle field focus for inline editing
   */
  onFieldFocus(field: 'displayName' | 'description'): void {
    if (!this.isReadOnly && !this.editingStates[field]) {
      this.editingStates[field] = true;
    }
  }

  /**
   * Handle field blur for inline editing with immediate validation
   */
  onFieldBlur(field: 'displayName' | 'description'): void {
    if (this.editingStates[field]) {
      this.editingStates[field] = false;
      this.validateField(field, this.formModels[field]);
      this.emitChanges();
    }
  }

  /**
   * Handle Enter key for inline editing
   */
  onFieldKeydown(field: 'displayName' | 'description', event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.editingStates[field]) {
      this.editingStates[field] = false;
      this.validateField(field, this.formModels[field]);
      this.emitChanges();
      event.preventDefault();
    }
    
    if (event.key === 'Escape' && this.editingStates[field]) {
      this.editingStates[field] = false;
      // Reset to original value
      this.formModels[field] = this.nodeData?.[field] || '';
      event.preventDefault();
    }
  }

  /**
   * Initiate guarded editing for Node ID
   */
  initiateIdEdit(): void {
    if (this.isReadOnly) return;
    
    this.idGuardedMode = true;
    this.idChangeConfirmation = '';
    this.showIdWarning = true;
    this.validationMessages = this.validationMessages.filter(msg => msg.field !== 'id');
  }

  /**
   * Cancel Node ID editing
   */
  cancelIdEdit(): void {
    this.idGuardedMode = false;
    this.idChangeConfirmation = '';
    this.showIdWarning = false;
    this.formModels.id = this.nodeData?.id || '';
    this.validationMessages = this.validationMessages.filter(msg => msg.field !== 'id');
  }

  /**
   * Confirm Node ID change with validation
   */
  confirmIdChange(): void {
    if (this.idChangeConfirmation !== this.formModels.id) {
      this.addValidationMessage({
        type: 'error',
        field: 'id',
        message: 'Confirmation text must match the new Node ID exactly'
      });
      return;
    }

    this.validateField('id', this.formModels.id);
    
    if (!this.hasValidationErrors('id')) {
      this.idGuardedMode = false;
      this.showIdWarning = false;
      this.emitChanges();
    }
  }

  /**
   * Validate individual field
   */
  private validateField(field: 'id' | 'displayName' | 'description', value: string): void {
    // Remove existing validation messages for this field
    this.validationMessages = this.validationMessages.filter(msg => msg.field !== field);

    switch (field) {
      case 'id':
        this.validateNodeId(value);
        break;
      case 'displayName':
        this.validateDisplayName(value);
        break;
      case 'description':
        this.validateDescription(value);
        break;
    }

    // Request downstream impact analysis if it's an ID change
    if (field === 'id' && value !== this.nodeData?.id) {
      this.requestDownstreamImpactAnalysis(value);
    }
  }

  /**
   * Validate Node ID format and uniqueness
   */
  private validateNodeId(value: string): void {
    if (!value.trim()) {
      this.addValidationMessage({
        type: 'error',
        field: 'id',
        message: 'Node ID is required and cannot be empty'
      });
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      this.addValidationMessage({
        type: 'error',
        field: 'id',
        message: 'Node ID can only contain letters, numbers, underscores, and hyphens'
      });
    }

    if (value.length < 3) {
      this.addValidationMessage({
        type: 'error',
        field: 'id',
        message: 'Node ID must be at least 3 characters long'
      });
    }

    if (value.length > 50) {
      this.addValidationMessage({
        type: 'error',
        field: 'id',
        message: 'Node ID must not exceed 50 characters'
      });
    }

    if (this.nodeData?.originalId && value !== this.nodeData.originalId) {
      this.addValidationMessage({
        type: 'warning',
        field: 'id',
        message: 'Changing Node ID may break existing references and save files',
        downstreamImpact: true
      });
    }
  }

  /**
   * Validate display name
   */
  private validateDisplayName(value: string): void {
    if (!value.trim()) {
      this.addValidationMessage({
        type: 'error',
        field: 'displayName',
        message: 'Display name is required'
      });
    }

    if (value.length > 100) {
      this.addValidationMessage({
        type: 'warning',
        field: 'displayName',
        message: 'Display name is quite long and may be truncated in some interfaces'
      });
    }
  }

  /**
   * Validate description
   */
  private validateDescription(value: string): void {
    if (value.length > 500) {
      this.addValidationMessage({
        type: 'warning',
        field: 'displayName',
        message: 'Description is quite long and may impact performance'
      });
    }
  }

  /**
   * Request downstream impact analysis for ID changes
   */
  private requestDownstreamImpactAnalysis(newId: string): void {
    // Emit event to request downstream impact analysis
    this.validationRequested.emit({ field: 'id', value: newId });
    
    // Simulate downstream impact detection (in real implementation, this would be async)
    setTimeout(() => {
      this.analyzeDownstreamImpact(newId);
    }, 500);
  }

  /**
   * Analyze downstream impact of ID changes
   */
  private analyzeDownstreamImpact(newId: string): void {
    // This would typically make an API call or use a service to check for:
    // - References in save files
    // - Dependencies in other nodes
    // - Export/import data
    // - Analytics and tracking data
    
    // For demo purposes, simulate finding some impact
    this.downstreamImpactNodes = ['tech_tree_root', 'advanced_manufacturing', 'quantum_computing'];
    this.hasDownstreamImpact = this.downstreamImpactNodes.length > 0;

    if (this.hasDownstreamImpact) {
      // Add or update downstream impact warning
      const existingImpactMsg = this.validationMessages.find(msg => 
        msg.field === 'id' && msg.downstreamImpact
      );

      if (existingImpactMsg) {
        existingImpactMsg.message = `This Node ID change will affect ${this.downstreamImpactNodes.length} dependent nodes and may break save file compatibility`;
        existingImpactMsg.affectedNodes = [...this.downstreamImpactNodes];
      } else {
        this.addValidationMessage({
          type: 'warning',
          field: 'id',
          message: `This Node ID change will affect ${this.downstreamImpactNodes.length} dependent nodes`,
          downstreamImpact: true,
          affectedNodes: [...this.downstreamImpactNodes]
        });
      }
    }
  }

  /**
   * Add validation message
   */
  private addValidationMessage(message: IdentityValidationMessage): void {
    this.validationMessages.push(message);
  }

  /**
   * Check if field has validation errors
   */
  hasValidationErrors(field: string): boolean {
    return this.validationMessages.some(msg => msg.field === field && msg.type === 'error');
  }

  /**
   * Check if field has validation warnings
   */
  hasValidationWarnings(field: string): boolean {
    return this.validationMessages.some(msg => msg.field === field && msg.type === 'warning');
  }

  /**
   * Get validation messages for a specific field
   */
  getFieldValidationMessages(field: string): IdentityValidationMessage[] {
    return this.validationMessages.filter(msg => msg.field === field);
  }

  /**
   * Emit changes to parent component
   */
  private emitChanges(): void {
    if (this.nodeData) {
      const updatedData: NodeIdentityData = {
        ...this.nodeData,
        id: this.formModels.id,
        displayName: this.formModels.displayName,
        description: this.formModels.description
      };
      this.identityChanged.emit(updatedData);
    }
  }

  /**
   * Get field display value with editing state
   */
  getFieldDisplayValue(field: 'id' | 'displayName' | 'description'): string {
    if (field === 'id' && this.idGuardedMode) {
      return this.formModels.id;
    }
    
    if (this.editingStates[field]) {
      return this.formModels[field];
    }
    
    return this.nodeData?.[field] || '';
  }

  /**
   * Check if field is in editing mode
   */
  isFieldEditing(field: 'id' | 'displayName' | 'description'): boolean {
    if (field === 'id') {
      return this.idGuardedMode;
    }
    return this.editingStates[field];
  }

  /**
   * Get validation icon for message type
   */
  getValidationIcon(type: string): string {
    switch (type) {
      case 'error': return '✗';
      case 'warning': return '⚠';
      case 'info': return 'ℹ';
      default: return 'ℹ';
    }
  }

  /**
   * Check if form has any validation issues
   */
  hasValidationIssues(): boolean {
    return this.validationMessages.length > 0;
  }

  /**
   * Get validation count by type
   */
  getValidationCountByType(type: string): number {
    return this.validationMessages.filter(msg => msg.type === type).length;
  }
}