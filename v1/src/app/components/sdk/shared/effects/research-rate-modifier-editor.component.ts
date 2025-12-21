import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AbstractEffectEditor } from './abstract-effect-editor';
import { TechNodeEffects, TechTreeValidationIssue } from '../../../../models/tech-tree.models';
import { TechEnumOption } from '../../../../services/tech-enum-adapter.service';

/**
 * Editor for research rate modifier effects
 */
@Component({
  selector: 'app-research-rate-modifier-editor',
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
          <span class="field-label">Research Rate Modifier</span>
          <div class="research-rate-input">
            <input 
              type="number"
              class="field-input"
              [ngModel]="value" 
              (ngModelChange)="onValueChange($event)"
              [disabled]="disabled"
              [attr.aria-label]="label"
              [attr.aria-describedby]="'help-' + effectType"
              min="0"
              max="5"
              step="0.1"
              placeholder="1.0">
            <span class="input-suffix">×</span>
          </div>
          <div 
            *ngIf="helpText" 
            class="field-help" 
            [id]="'help-' + effectType">
            {{ helpText }}
          </div>
          <div class="field-preview" *ngIf="value !== null && value !== undefined">
            <span class="preview-label">Effect:</span>
            <span 
              class="preview-value"
              [class.preview-positive]="value > 1"
              [class.preview-negative]="value < 1"
              [class.preview-neutral]="value === 1">
              {{ formatModifier(value) }}
            </span>
          </div>
        </label>
      </div>
    </div>
  `,
  styleUrls: ['./effect-editor.component.scss']
})
export class ResearchRateModifierEditorComponent extends AbstractEffectEditor {
  constructor() {
    super(
      'research_rate_modifier',
      'Research Rate Modifier',
      'Modifies the speed at which research progresses (1.0 = normal speed)'
    );
  }

  protected validateTypeSpecific(value: any, effects: Partial<TechNodeEffects>): TechTreeValidationIssue[] {
    const issues: TechTreeValidationIssue[] = [];
    
    // Validate numeric value
    issues.push(...this.validateNumeric(value, 'research_rate_modifier', 0, 10));
    
    // Additional business logic validation
    if (value !== undefined && value !== null) {
      const numValue = Number(value);
      
      if (!isNaN(numValue)) {
        // Warn about extreme values
        if (numValue > 3) {
          issues.push({
            path: `${this.validationContext?.path || 'effects'}.research_rate_modifier`,
            message: `${this.label}: Very high research modifier (${numValue}x) may unbalance gameplay`,
            severity: 'warning'
          });
        }
        
        if (numValue < 0.5 && numValue > 0) {
          issues.push({
            path: `${this.validationContext?.path || 'effects'}.research_rate_modifier`,
            message: `${this.label}: Very low research modifier (${numValue}x) may frustrate players`,
            severity: 'warning'
          });
        }
        
        // Check for combinations with other effects
        if (effects.unlock_structures?.length && numValue > 2) {
          issues.push({
            path: `${this.validationContext?.path || 'effects'}.research_rate_modifier`,
            message: `${this.label}: High research rate combined with structure unlocks may accelerate progression too much`,
            severity: 'warning'
          });
        }
        
        // Suggest balanced combinations
        if (numValue > 1.5 && (!effects.unlock_goods || effects.unlock_goods.length === 0)) {
          issues.push({
            path: `${this.validationContext?.path || 'effects'}.research_rate_modifier`,
            message: `${this.label}: Consider adding goods unlocks to balance high research rate`,
            severity: 'warning'
          });
        }
      }
    }

    return issues;
  }

  /**
   * Format the modifier for display
   */
  formatModifier(value: number): string {
    if (value === 1) return 'No change (1.0x)';
    if (value > 1) return `+${Math.round((value - 1) * 100)}% faster research (${value}x)`;
    return `${Math.round((value - 1) * 100)}% slower research (${value}x)`;
  }
}