import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AbstractEffectEditor } from './abstract-effect-editor';
import { TechNodeEffects, TechTreeValidationIssue } from '../../../../models/tech-tree.models';
import { TechEnumOption } from '../../../../services/tech-enum-adapter.service';

/**
 * Editor for goods unlock effects
 */
@Component({
  selector: 'app-goods-unlocks-editor',
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
          <span class="field-label">Unlocked Goods</span>
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
      </div>
    </div>
  `,
  styleUrls: ['./effect-editor.component.scss']
})
export class GoodsUnlocksEditorComponent extends AbstractEffectEditor {
  constructor() {
    super(
      'unlock_goods',
      'Goods Unlocks',
      'Unlocks specific goods that can be produced or traded'
    );
  }

  protected validateTypeSpecific(value: any, effects: Partial<TechNodeEffects>): TechTreeValidationIssue[] {
    const issues: TechTreeValidationIssue[] = [];
    
    // Validate array format
    issues.push(...this.validateArray(value, 'unlock_goods', false));
    
    // Validate that selected goods exist in options
    if (Array.isArray(value) && value.length > 0) {
      const optionValues = new Set(this.options.map(opt => opt.value));
      const invalidGoods = value.filter(v => !optionValues.has(v));
      
      if (invalidGoods.length > 0) {
        issues.push({
          path: `${this.validationContext?.path || 'effects'}.unlock_goods`,
          message: `${this.label}: Invalid goods types: ${invalidGoods.join(', ')}`,
          severity: 'error'
        });
      }
    }
    
    // Check for logical economic combinations
    if (Array.isArray(value) && value.length > 0) {
      // Example: Check if basic and advanced goods are mixed appropriately
      const basicGoods = ['wood', 'stone', 'food', 'water'];
      const advancedGoods = ['steel', 'tools', 'luxury_items', 'precious_metals'];
      
      const hasAdvanced = value.some(g => advancedGoods.includes(g));
      const hasBasic = value.some(g => basicGoods.includes(g));
      
      if (hasAdvanced && !hasBasic) {
        issues.push({
          path: `${this.validationContext?.path || 'effects'}.unlock_goods`,
          message: `${this.label}: Consider unlocking basic goods alongside advanced ones for balanced economy`,
          severity: 'warning'
        });
      }
      
      // Check for conflicting goods
      const conflictingPairs = [
        ['iron', 'steel'], // Basic iron working vs advanced steel
        ['coal', 'clean_energy'] // Traditional vs clean energy
      ];
      
      for (const [good1, good2] of conflictingPairs) {
        if (value.includes(good1) && value.includes(good2)) {
          issues.push({
            path: `${this.validationContext?.path || 'effects'}.unlock_goods`,
            message: `${this.label}: Consider the economic impact of unlocking both '${good1}' and '${good2}'`,
            severity: 'warning'
          });
        }
      }
    }

    return issues;
  }
}