import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseEffectEditor, EffectEditorInput, EffectEditorOutput, EffectValidationContext } from './effect-editor.types';
import { TechEnumOption } from '../../../../services/tech-enum-adapter.service';
import { TechNodeEffects, TechTreeValidationIssue } from '../../../../models/tech-tree.models';

/**
 * Abstract base class for all effect editors
 */
export abstract class AbstractEffectEditor extends BaseEffectEditor {
  @Input() value: any = null;
  @Input() options: TechEnumOption[] = [];
  @Input() disabled = false;
  @Input() placeholder?: string;
  @Input() helpText?: string;
  @Input() validationContext?: EffectValidationContext;

  @Output() valueChange = new EventEmitter<any>();
  @Output() validationIssuesChange = new EventEmitter<TechTreeValidationIssue[]>();

  protected constructor(
    public readonly effectType: string,
    public readonly label: string,
    public readonly description: string
  ) {
    super();
  }

  /**
   * Default validation implementation
   */
  validate(effects: Partial<TechNodeEffects>): TechTreeValidationIssue[] {
    const issues: TechTreeValidationIssue[] = [];
    const value = (effects as any)[this.effectType];
    
    // Call type-specific validation
    const typeSpecificIssues = this.validateTypeSpecific(value, effects);
    issues.push(...typeSpecificIssues);

    // Apply common validation rules
    issues.push(...this.validateCommon(value, effects));

    // Emit validation issues
    this.validationIssuesChange.emit(issues);
    
    return issues;
  }

  /**
   * Get available options for this effect type
   */
  getOptions(): TechEnumOption[] {
    return this.options;
  }

  /**
   * Check if this effect type is enabled/available
   */
  isEnabled(): boolean {
    return !this.disabled && this.options.length > 0;
  }

  /**
   * Handle value changes from the UI
   */
  onValueChange(newValue: any): void {
    this.value = newValue;
    this.valueChange.emit(newValue);
    
    // Trigger validation
    if (this.validationContext) {
      const issues = this.validate({
        ...this.validationContext.effects,
        [this.effectType]: newValue
      });
      this.validationIssuesChange.emit(issues);
    }
  }

  /**
   * Abstract method for type-specific validation
   * Must be implemented by each effect editor
   */
  protected abstract validateTypeSpecific(value: any, effects: Partial<TechNodeEffects>): TechTreeValidationIssue[];

  /**
   * Common validation rules that apply to all effect types
   */
  protected validateCommon(value: any, effects: Partial<TechNodeEffects>): TechTreeValidationIssue[] {
    const issues: TechTreeValidationIssue[] = [];
    
    if (this.validationContext?.strict) {
      // In strict mode, warn about missing values for optional effects
      if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) {
        issues.push({
          path: `${this.validationContext.path}.${this.effectType}`,
          message: `Effect '${this.label}' is not configured`,
          severity: 'warning'
        });
      }
    }

    return issues;
  }

  /**
   * Helper method to validate array values
   */
  protected validateArray(value: any, fieldName: string, required = false): TechTreeValidationIssue[] {
    const issues: TechTreeValidationIssue[] = [];

    if (required && (!value || !Array.isArray(value) || value.length === 0)) {
      issues.push({
        path: `${this.validationContext?.path || 'effects'}.${fieldName}`,
        message: `${this.label}: At least one option must be selected`,
        severity: 'error'
      });
    }

    if (value && Array.isArray(value)) {
      // Check for duplicate values
      const uniqueValues = [...new Set(value)];
      if (uniqueValues.length !== value.length) {
        issues.push({
          path: `${this.validationContext?.path || 'effects'}.${fieldName}`,
          message: `${this.label}: Duplicate values detected`,
          severity: 'warning'
        });
      }
    }

    return issues;
  }

  /**
   * Helper method to validate numeric values
   */
  protected validateNumeric(value: any, fieldName: string, min?: number, max?: number): TechTreeValidationIssue[] {
    const issues: TechTreeValidationIssue[] = [];

    if (value !== undefined && value !== null) {
      const numValue = Number(value);
      
      if (isNaN(numValue)) {
        issues.push({
          path: `${this.validationContext?.path || 'effects'}.${fieldName}`,
          message: `${this.label}: Value must be a valid number`,
          severity: 'error'
        });
      } else {
        if (min !== undefined && numValue < min) {
          issues.push({
            path: `${this.validationContext?.path || 'effects'}.${fieldName}`,
            message: `${this.label}: Value must be at least ${min}`,
            severity: 'error'
          });
        }
        
        if (max !== undefined && numValue > max) {
          issues.push({
            path: `${this.validationContext?.path || 'effects'}.${fieldName}`,
            message: `${this.label}: Value must be at most ${max}`,
            severity: 'error'
          });
        }
      }
    }

    return issues;
  }

  /**
   * Helper method to track options for ngFor
   */
  trackOption(_index: number, option: TechEnumOption): string {
    return option.value;
  }
}