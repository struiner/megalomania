import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AbstractEffectEditor } from './abstract-effect-editor';
import { TechNodeEffects, TechTreeValidationIssue } from '../../../../models/tech-tree.models';
import { TechEnumOption } from '../../../../services/tech-enum-adapter.service';

/**
 * Editor for structure unlock effects
 */
@Component({
  selector: 'app-structure-unlocks-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="effect-editor">
      <div class="effect-editor__header">
        <h4 class="effect-editor__title">{{ label }}</h4>
        <p class="effect-editor__description">{{ description }}</p>
      </div>
      
      <div class="effect-editor__content">
        <label class="field">
          <span class="field-label">Unlocked Structures</span>
          <select 
            class="field-select"
            multiple
            [ngModel]="value" 
            (ngModelChange)="onValueChange($event)"
            [disabled]="disabled"
            [attr.aria-label]="label"
            [attr.aria-describedby]="'help-' + effectType">
            <option 
              *ngFor="let option of options; trackBy: trackOption" 
              [ngValue]="option.value"
              [title]="option.label">
              {{ option.label }}
            </option>
          </select>
          <div 
            *ngIf="helpText" 
            class="field-help" 
            [id]="'help-' + effectType">
            {{ helpText }}
          </div>
        </label>
        
        <div class="effect-editor__validation" *ngIf="validationContext">
          <!-- Validation messages will be injected here by parent component -->
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./effect-editor.component.scss']
})
export class StructureUnlocksEditorComponent extends AbstractEffectEditor {
  constructor() {
    super(
      'unlock_structures',
      'Structure Unlocks',
      'Unlocks specific building structures that can be constructed'
    );
  }

  protected validateTypeSpecific(value: any, effects: Partial<TechNodeEffects>): TechTreeValidationIssue[] {
    const issues: TechTreeValidationIssue[] = [];
    
    // Validate array format
    issues.push(...this.validateArray(value, 'unlock_structures', false));
    
    // Validate that selected structures exist in options
    if (Array.isArray(value) && value.length > 0) {
      const optionValues = new Set(this.options.map(opt => opt.value));
      const invalidStructures = value.filter(v => !optionValues.has(v));
      
      if (invalidStructures.length > 0) {
        issues.push({
          path: `${this.validationContext?.path || 'effects'}.unlock_structures`,
          message: `${this.label}: Invalid structure types: ${invalidStructures.join(', ')}`,
          severity: 'error'
        });
      }
    }
    
    // Check for logical combinations (e.g., don't unlock advanced structures without basic ones)
    if (Array.isArray(value) && value.length > 0) {
      const advancedStructures = ['steelworks', 'advanced_workshop', 'precision_factory'];
      const basicStructures = ['workshop', 'forge', 'basic_workshop'];
      
      const hasAdvanced = value.some(s => advancedStructures.includes(s));
      const hasBasic = value.some(s => basicStructures.includes(s));
      
      if (hasAdvanced && !hasBasic) {
        issues.push({
          path: `${this.validationContext?.path || 'effects'}.unlock_structures`,
          message: `${this.label}: Consider unlocking basic structures alongside advanced ones`,
          severity: 'warning'
        });
      }
    }

    return issues;
  }
}