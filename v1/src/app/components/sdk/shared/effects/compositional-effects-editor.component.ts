import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TechNodeEffects, TechTreeValidationIssue } from '../../../../models/tech-tree.models';
import { TechEnumOption } from '../../../../services/tech-enum-adapter.service';
import { BaseEffectEditor, EffectValidationContext, EffectsConfiguration } from './effect-editor.types';
import { EffectEditorRegistryService } from './effect-editor-registry.service';

/**
 * Compositional effects editor that manages multiple effect types
 */
@Component({
  selector: 'app-compositional-effects-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="compositional-effects-editor">
      <div class="compositional-effects-editor__header">
        <h3 class="compositional-effects-editor__title">Effects Configuration</h3>
        <p class="compositional-effects-editor__description">
          Configure technology effects using type-specific editors with dedicated validation
        </p>
        
        <div class="compositional-effects-editor__controls">
          <label class="toggle">
            <input 
              type="checkbox" 
              [(ngModel)]="config.showAdvanced"
              (ngModelChange)="onConfigurationChange()">
            <span class="toggle-label">Show Advanced Effects</span>
          </label>
          
          <label class="toggle">
            <input 
              type="checkbox" 
              [(ngModel)]="config.groupByCategory"
              (ngModelChange)="onConfigurationChange()">
            <span class="toggle-label">Group by Category</span>
          </label>
        </div>
      </div>

      <div class="compositional-effects-editor__content">
        <!-- Validation Summary -->
        <div 
          class="validation-summary"
          [class.validation-summary--has-errors]="hasErrors"
          [class.validation-summary--has-warnings]="hasWarnings"
          *ngIf="allValidationIssues.length > 0">
          
          <h4 class="validation-summary__title">Validation Summary</h4>
          <div class="validation-summary__issues">
            <div 
              *ngFor="let issue of allValidationIssues; trackBy: trackValidationIssue"
              class="validation-issue"
              [class.validation-issue--error]="issue.severity === 'error'"
              [class.validation-issue--warning]="issue.severity === 'warning'">
              
              <span class="validation-issue__path">{{ issue.path }}</span>
              <span class="validation-issue__message">{{ issue.message }}</span>
            </div>
          </div>
        </div>

        <!-- Effect Editors -->
        <div class="effect-editors">
          <div 
            *ngFor="let editorInfo of availableEditors; trackBy: trackEditor"
            class="effect-editor-container"
            [class.effect-editor-container--advanced]="isAdvancedEditor(editorInfo.editor)">
            
            <div class="effect-editor-header">
              <h4 class="effect-editor-title">{{ editorInfo.editor.label }}</h4>
              <span 
                class="effect-editor-status"
                [class.effect-editor-status--has-issues]="editorInfo.issues.length > 0">
                {{ editorInfo.issues.length }} issues
              </span>
            </div>
            
            <div class="effect-editor-content">
              <!-- Dynamic component injection would go here -->
              <!-- For now, we'll show a placeholder -->
              <div class="effect-editor-placeholder">
                <p>Editor for: {{ editorInfo.editor.effectType }}</p>
                <p>Current value: {{ getEffectValue(editorInfo.editor.effectType) | json }}</p>
                <p>Issues: {{ editorInfo.issues.length }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div class="empty-state" *ngIf="availableEditors.length === 0">
          <h4>No Effects Configured</h4>
          <p>This technology node doesn't have any effects configured yet.</p>
          <p>Select effect types from the available options to get started.</p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./compositional-effects-editor.component.scss']
})
export class CompositionalEffectsEditorComponent implements OnInit, OnDestroy {
  @Input() effects: Partial<TechNodeEffects> = {};
  @Input() effectOptions: Record<string, TechEnumOption[]> = {};
  @Input() nodeId = '';
  @Input() path = 'effects';
  @Input() strictValidation = false;
  
  @Output() effectsChange = new EventEmitter<Partial<TechNodeEffects>>();
  @Output() validationIssuesChange = new EventEmitter<TechTreeValidationIssue[]>();

  config: EffectsConfiguration = {
    showAdvanced: false,
    groupByCategory: true,
    validationMode: 'strict'
  };

  availableEditors: Array<{
    editor: BaseEffectEditor;
    issues: TechTreeValidationIssue[];
  }> = [];

  allValidationIssues: TechTreeValidationIssue[] = [];
  
  private subscription = new Subscription();

  constructor(private editorRegistry: EffectEditorRegistryService) {}

  ngOnInit(): void {
    // Subscribe to editor registry updates
    this.subscription.add(
      this.editorRegistry.editors$.subscribe(() => {
        this.updateAvailableEditors();
      })
    );

    this.updateAvailableEditors();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Get validation context for editors
   */
  getValidationContext(): EffectValidationContext {
    return {
      nodeId: this.nodeId,
      effects: this.effects,
      path: this.path,
      strict: this.strictValidation
    };
  }

  /**
   * Check if editor has errors
   */
  get hasErrors(): boolean {
    return this.allValidationIssues.some(issue => issue.severity === 'error');
  }

  /**
   * Check if editor has warnings
   */
  get hasWarnings(): boolean {
    return this.allValidationIssues.some(issue => issue.severity === 'warning');
  }

  /**
   * Check if editor is advanced
   */
  isAdvancedEditor(editor: BaseEffectEditor): boolean {
    const advancedTypes = ['metadata', 'research_rate_modifier', 'guild_reputation'];
    return advancedTypes.includes(editor.effectType);
  }

  /**
   * Get effect value for a specific type
   */
  getEffectValue(effectType: string): any {
    return (this.effects as any)[effectType];
  }

  /**
   * Handle configuration changes
   */
  onConfigurationChange(): void {
    this.updateAvailableEditors();
  }

  /**
   * Update available editors based on current effects and configuration
   */
  private updateAvailableEditors(): void {
    const allEditors = this.editorRegistry.getAllEditors();
    const enabledEditors = allEditors.filter(editor => {
      // Filter by configuration
      if (!this.config.showAdvanced && this.isAdvancedEditor(editor)) {
        return false;
      }
      
      // Show editors that have values or are commonly used
      const hasValue = this.getEffectValue(editor.effectType) !== undefined;
      const isCommon = ['unlock_structures', 'unlock_goods', 'unlock_settlements'].includes(editor.effectType);
      
      return hasValue || isCommon;
    });

    // Get validation issues for each editor
    this.availableEditors = enabledEditors.map(editor => ({
      editor,
      issues: editor.validate(this.effects)
    }));

    // Collect all validation issues
    this.allValidationIssues = this.availableEditors.flatMap(info => info.issues);
    
    // Emit validation issues
    this.validationIssuesChange.emit(this.allValidationIssues);
  }

  /**
   * Track by function for validation issues
   */
  trackValidationIssue(_index: number, issue: TechTreeValidationIssue): string {
    return `${issue.path}-${issue.severity}-${issue.message}`;
  }

  /**
   * Track by function for editors
   */
  trackEditor(_index: number, editorInfo: { editor: BaseEffectEditor; issues: TechTreeValidationIssue[] }): string {
    return editorInfo.editor.effectType;
  }
}