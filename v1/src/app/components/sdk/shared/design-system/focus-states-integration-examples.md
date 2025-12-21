# Focus States Integration Examples

## Overview

This document provides practical, ready-to-use examples of focus state integration across all Tech Tree Editor components. Each example demonstrates proper implementation patterns, accessibility compliance, and integration with the existing design system.

## Complete Component Examples

### 1. Tech Tree Node Component

**Complete Angular Component with Focus States**:

```typescript
// tech-tree-node.component.ts
import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { FocusStateUtils } from '../shared/design-system/focus-state.tokens';

interface TechnologyNode {
  id: string;
  name: string;
  description: string;
  icon: string;
  state: 'available' | 'locked' | 'researching' | 'complete' | 'error';
  prerequisites: string[];
  cost: number;
  category: string;
}

@Component({
  selector: 'app-tech-tree-node',
  template: `
    <div class="tech-tree-node"
         [class]="'tech-tree-node state-' + node.state"
         [attr.tabindex]="isFocusable ? 0 : -1"
         [attr.role]="isFocusable ? 'button' : null"
         [attr.aria-label]="getAriaLabel()"
         [attr.aria-pressed]="isSelected"
         [attr.aria-describedby]="getDescriptionId()"
         (click)="onNodeClick($event)"
         (keydown)="onNodeKeydown($event)"
         (focus)="onNodeFocus()"
         (blur)="onNodeBlur()">
      
      <!-- Node connection indicators -->
      <div class="node-connections" [attr.aria-hidden]="true">
        <div class="connection-point input" 
             [class.has-connection]="hasInputConnections"
             title="Prerequisites"></div>
        <div class="connection-point output" 
             [class.has-connection]="hasOutputConnections"
             title="Unlocks"></div>
      </div>
      
      <!-- Node icon -->
      <div class="node-icon">
        <img [src]="node.icon" 
             [alt]="node.name"
             width="32" 
             height="32"
             loading="lazy">
      </div>
      
      <!-- Node content -->
      <div class="node-content">
        <h3 class="node-title">{{ node.name }}</h3>
        <p class="node-description" [id]="getDescriptionId()">
          {{ node.description }}
        </p>
        <div class="node-meta">
          <span class="node-cost">{{ node.cost }} research points</span>
          <span class="node-category">{{ node.category }}</span>
        </div>
      </div>
      
      <!-- Node state indicator -->
      <div class="node-state-indicator" 
           [attr.aria-label]="getStateLabel()"
           [class.loading]="node.state === 'researching'">
        <span class="state-icon" [ngSwitch]="node.state">
          <span *ngSwitchCase="'available'" class="icon-available">✓</span>
          <span *ngSwitchCase="'locked'" class="icon-locked">🔒</span>
          <span *ngSwitchCase="'researching'" class="icon-researching">⏳</span>
          <span *ngSwitchCase="'complete'" class="icon-complete">✓</span>
          <span *ngSwitchCase="'error'" class="icon-error">⚠</span>
        </span>
      </div>
      
      <!-- Selection indicator -->
      <div class="selection-indicator" 
           *ngIf="isSelected"
           [attr.aria-hidden]="true">
        Selected
      </div>
    </div>
  `,
  styleUrls: ['./tech-tree-node.component.scss']
})
export class TechTreeNodeComponent {
  @Input() node!: TechnologyNode;
  @Input() isSelected = false;
  @Input() isFocusable = true;
  @Input() connectionMode = false;
  @Input() gridPosition = { row: 0, col: 0 };
  
  @Output() nodeSelected = new EventEmitter<TechnologyNode>();
  @Output() nodeFocused = new EventEmitter<TechnologyNode>();
  @Output() connectionStarted = new EventEmitter<TechnologyNode>();
  
  hasInputConnections = false;
  hasOutputConnections = false;
  
  constructor(private focusUtils: FocusStateUtils) {}
  
  onNodeClick(event: MouseEvent): void {
    if (this.node.state === 'available' || this.node.state === 'complete') {
      this.nodeSelected.emit(this.node);
    }
    
    if (this.connectionMode && event.shiftKey) {
      this.connectionStarted.emit(this.node);
    }
  }
  
  onNodeKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (this.node.state === 'available' || this.node.state === 'complete') {
          this.nodeSelected.emit(this.node);
        }
        break;
        
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        event.preventDefault();
        this.navigateToAdjacentNode(event.key);
        break;
        
      case 'c':
      case 'C':
        if (this.connectionMode) {
          event.preventDefault();
          this.connectionStarted.emit(this.node);
        }
        break;
        
      case 'Escape':
        // Handle escape for connection mode
        if (this.connectionMode) {
          this.emitConnectionCancelled();
        }
        break;
    }
  }
  
  onNodeFocus(): void {
    this.nodeFocused.emit(this.node);
  }
  
  onNodeBlur(): void {
    // Handle blur events if needed
  }
  
  getAriaLabel(): string {
    const stateLabels = {
      available: 'Available',
      locked: 'Locked',
      researching: 'Researching',
      complete: 'Complete',
      error: 'Error'
    };
    
    return `Technology: ${this.node.name} (${stateLabels[this.node.state]})`;
  }
  
  getStateLabel(): string {
    const stateLabels = {
      available: 'Available for research',
      locked: 'Locked - prerequisites required',
      researching: 'Currently being researched',
      complete: 'Research completed',
      error: 'Error in research'
    };
    
    return stateLabels[this.node.state];
  }
  
  getDescriptionId(): string {
    return `node-desc-${this.node.id}`;
  }
  
  private navigateToAdjacentNode(direction: string): void {
    // Implementation for grid navigation
    const event = new CustomEvent('nodeNavigation', {
      detail: {
        currentNode: this.node,
        direction: direction.toLowerCase(),
        gridPosition: this.gridPosition
      }
    });
    
    window.dispatchEvent(event);
  }
  
  private emitConnectionCancelled(): void {
    window.dispatchEvent(new CustomEvent('connectionCancelled'));
  }
}
```

**SCSS Styles with Focus States**:

```scss
// tech-tree-node.component.scss
@import '../shared/design-system/focus-state-tokens';
@import '../shared/design-system/color-tokens';
@import '../shared/design-system/spacing-tokens';
@import '../shared/design-system/typography-tokens';

.tech-tree-node {
  @extend %ds-focus-node;
  
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--ds-spacing-node-padding);
  border: 1px solid var(--ds-color-border-primary);
  border-radius: var(--ds-spacing-node-border-radius);
  background: var(--ds-color-background-primary);
  cursor: pointer;
  transition: all var(--ds-focus-transition-duration) var(--ds-focus-transition-timing);
  min-width: 120px;
  max-width: 200px;
  
  // Focus states
  &:focus {
    @include ds-focus-enhanced;
    z-index: 10;
    transform: translateZ(0);
  }
  
  &:focus-visible {
    @include ds-focus-enhanced;
  }
  
  // Connection mode focus
  &.connection-mode {
    &:focus {
      @include ds-focus-enhanced;
      box-shadow: 0 0 0 3px var(--ds-color-focus),
                  0 0 var(--ds-focus-shadow-blur) var(--ds-focus-shadow-spread) var(--ds-focus-shadow-color);
      
      .node-connections {
        .connection-point {
          &.input,
          &.output {
            background: var(--ds-color-focus);
            transform: scale(1.2);
          }
        }
      }
    }
  }
  
  // State-specific styling
  &.state-available {
    @include ds-node-state-available;
    
    &:hover {
      background: var(--ds-color-hover);
    }
  }
  
  &.state-locked {
    @include ds-node-state-locked;
    cursor: not-allowed;
    
    &:focus {
      @include ds-focus-ring('error');
    }
  }
  
  &.state-researching {
    @include ds-node-state-researching;
    
    &:focus {
      @include ds-focus-ring('info');
    }
  }
  
  &.state-complete {
    @include ds-node-state-complete;
    
    &:hover {
      background: var(--ds-color-selected);
    }
  }
  
  &.state-error {
    @include ds-node-state-error;
    
    &:focus {
      @include ds-focus-ring('error');
    }
  }
  
  // Selected state
  &.selected {
    border-color: var(--ds-color-secondary);
    background: var(--ds-color-selected);
    box-shadow: 0 0 0 2px var(--ds-color-secondary);
  }
  
  // Connection points
  .node-connections {
    position: absolute;
    inset: -4px;
    pointer-events: none;
    
    .connection-point {
      position: absolute;
      width: 8px;
      height: 8px;
      background: var(--ds-color-neutral-300);
      border-radius: 50%;
      transition: all 150ms ease;
      
      &.input {
        top: -4px;
        left: 50%;
        transform: translateX(-50%);
      }
      
      &.output {
        bottom: -4px;
        left: 50%;
        transform: translateX(-50%);
      }
      
      &.has-connection {
        background: var(--ds-color-connection-valid);
        
        &::after {
          content: '';
          position: absolute;
          inset: -2px;
          border: 1px solid var(--ds-color-connection-valid);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
      }
    }
  }
  
  // Node icon
  .node-icon {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--ds-spacing-xs);
    background: var(--ds-color-background-secondary);
    margin-bottom: var(--ds-spacing-sm);
    
    img {
      width: 32px;
      height: 32px;
      object-fit: contain;
    }
  }
  
  // Node content
  .node-content {
    text-align: center;
    flex-grow: 1;
    
    .node-title {
      @extend %ds-text-primary;
      font-size: map-get($font-sizes, 'sm');
      font-weight: map-get($font-weights, 'medium');
      margin: 0 0 var(--ds-spacing-xs) 0;
      line-height: 1.2;
    }
    
    .node-description {
      @extend %ds-text-muted;
      font-size: map-get($font-sizes, 'xs');
      line-height: 1.3;
      margin: 0 0 var(--ds-spacing-sm) 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .node-meta {
      display: flex;
      flex-direction: column;
      gap: var(--ds-spacing-xs);
      
      .node-cost {
        @extend %ds-text-secondary;
        font-size: map-get($font-sizes, 'xs');
        font-weight: map-get($font-weights, 'medium');
      }
      
      .node-category {
        @extend %ds-text-muted;
        font-size: map-get($font-sizes, 'xs');
      }
    }
  }
  
  // State indicator
  .node-state-indicator {
    position: absolute;
    top: var(--ds-spacing-xs);
    right: var(--ds-spacing-xs);
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: var(--ds-color-background-primary);
    border: 1px solid var(--ds-color-border-secondary);
    
    .state-icon {
      font-size: 12px;
      
      &.icon-available {
        color: var(--ds-color-success);
      }
      
      &.icon-locked {
        color: var(--ds-color-neutral-400);
      }
      
      &.icon-researching {
        color: var(--ds-color-info);
      }
      
      &.icon-complete {
        color: var(--ds-color-secondary);
      }
      
      &.icon-error {
        color: var(--ds-color-error);
      }
    }
    
    &.loading {
      .icon-researching {
        animation: spin 1s linear infinite;
      }
    }
  }
  
  // Selection indicator
  .selection-indicator {
    position: absolute;
    bottom: var(--ds-spacing-xs);
    left: 50%;
    transform: translateX(-50%);
    padding: 2px var(--ds-spacing-xs);
    background: var(--ds-color-secondary);
    color: var(--ds-color-text-inverse);
    font-size: map-get($font-sizes, 'xs');
    border-radius: var(--ds-spacing-xs);
    font-weight: map-get($font-weights, 'medium');
  }
}

// Animations
@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.1);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// Responsive adjustments
@media (max-width: 767px) {
  .tech-tree-node {
    min-width: 100px;
    max-width: 150px;
    padding: var(--ds-spacing-sm);
    
    .node-icon {
      width: 40px;
      height: 40px;
      
      img {
        width: 28px;
        height: 28px;
      }
    }
    
    .node-content {
      .node-title {
        font-size: map-get($font-sizes, 'xs');
      }
      
      .node-description {
        font-size: 10px;
      }
    }
  }
}

// High contrast mode
@media (prefers-contrast: high) {
  .tech-tree-node {
    border-width: 2px;
    
    &:focus {
      outline-width: 3px;
      outline-offset: 2px;
    }
    
    .node-connections {
      .connection-point {
        width: 10px;
        height: 10px;
        border: 2px solid var(--ds-color-text-primary);
      }
    }
  }
}

// Reduced motion
@media (prefers-reduced-motion: reduce) {
  .tech-tree-node {
    transition: none;
    
    .node-state-indicator.loading .icon-researching {
      animation: none;
    }
    
    .node-connections .connection-point.has-connection::after {
      animation: none;
    }
  }
}
```

### 2. Form Input Component

**Accessible Form Input with Focus States**:

```typescript
// form-field.component.ts
import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

type InputType = 'text' | 'email' | 'password' | 'number' | 'url';
type ValidationState = 'default' | 'success' | 'warning' | 'error';

@Component({
  selector: 'app-form-field',
  template: `
    <div class="form-field" [class]="'validation-' + validationState">
      <label [for]="fieldId" class="form-label" 
             [class.required]="required">
        {{ label }}
        <span class="required-indicator" *ngIf="required" aria-label="required">*</span>
      </label>
      
      <div class="input-wrapper">
        <input
          #inputRef
          class="form-input"
          [id]="fieldId"
          [type]="type"
          [placeholder]="placeholder"
          [value]="value"
          [disabled]="disabled"
          [readonly]="readonly"
          [required]="required"
          [attr.aria-invalid]="validationState === 'error'"
          [attr.aria-describedby]="getDescriptionIds()"
          [attr.aria-label]="ariaLabel || label"
          (input)="onInput($event)"
          (blur)="onBlur($event)"
          (focus)="onFocus($event)"
          (keydown)="onKeydown($event)"
        />
        
        <!-- Input icon/button -->
        <div class="input-action" *ngIf="inputAction">
          <button type="button"
                  class="input-action-button"
                  [attr.aria-label]="inputAction.label"
                  (click)="inputAction.handler()">
            {{ inputAction.icon }}
          </button>
        </div>
        
        <!-- Validation icon -->
        <div class="validation-icon" 
             [attr.aria-hidden]="true"
             *ngIf="validationState !== 'default'">
          <span [ngSwitch]="validationState">
            <span *ngSwitchCase="'success'" class="icon-success">✓</span>
            <span *ngSwitchCase="'warning'" class="icon-warning">⚠</span>
            <span *ngSwitchCase="'error'" class="icon-error">✗</span>
          </span>
        </div>
      </div>
      
      <!-- Help text -->
      <div class="help-text" 
           *ngIf="helpText"
           [id]="helpTextId">
        {{ helpText }}
      </div>
      
      <!-- Validation message -->
      <div class="validation-message" 
           *ngIf="validationMessage"
           [id]="validationMessageId"
           role="alert"
           [attr.aria-live]="validationState === 'error' ? 'assertive' : 'polite'">
        {{ validationMessage }}
      </div>
    </div>
  `,
  styleUrls: ['./form-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldComponent),
      multi: true
    }
  ]
})
export class FormFieldComponent implements ControlValueAccessor {
  @Input() label!: string;
  @Input() type: InputType = 'text';
  @Input() placeholder = '';
  @Input() helpText = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() validationState: ValidationState = 'default';
  @Input() validationMessage = '';
  @Input() ariaLabel = '';
  @Input() fieldId = '';
  @Input() inputAction?: {
    icon: string;
    label: string;
    handler: () => void;
  };
  
  @Output() blur = new EventEmitter<FocusEvent>();
  @Output() focus = new EventEmitter<FocusEvent>();
  @Output() input = new EventEmitter<Event>();
  
  value = '';
  private onChange = (value: any) => {};
  private onTouched = () => {};
  
  get fieldIdGenerated(): string {
    return this.fieldId || `field-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  get helpTextId(): string {
    return `${this.fieldIdGenerated}-help`;
  }
  
  get validationMessageId(): string {
    return `${this.fieldIdGenerated}-error`;
  }
  
  getDescriptionIds(): string {
    const ids = [];
    if (this.helpText) ids.push(this.helpTextId);
    if (this.validationState === 'error' && this.validationMessage) {
      ids.push(this.validationMessageId);
    }
    return ids.join(' ') || undefined;
  }
  
  writeValue(value: any): void {
    this.value = value || '';
  }
  
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.input.emit(event);
  }
  
  onBlur(event: FocusEvent): void {
    this.onTouched();
    this.blur.emit(event);
  }
  
  onFocus(event: FocusEvent): void {
    this.focus.emit(event);
  }
  
  onKeydown(event: KeyboardEvent): void {
    // Handle special key combinations
    if (event.key === 'Enter' && this.type !== 'text') {
      event.preventDefault();
      this.onSubmit();
    }
  }
  
  private onSubmit(): void {
    // Trigger form submission if needed
    window.dispatchEvent(new CustomEvent('formSubmit'));
  }
}
```

**Form Field SCSS with Focus States**:

```scss
// form-field.component.scss
@import '../shared/design-system/focus-state-tokens';
@import '../shared/design-system/color-tokens';
@import '../shared/design-system/spacing-tokens';
@import '../shared/design-system/typography-tokens';

.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--ds-spacing-xs);
  margin-bottom: var(--ds-spacing-md);
  
  .form-label {
    @extend %ds-text-primary;
    font-size: map-get($font-sizes, 'sm');
    font-weight: map-get($font-weights, 'medium');
    display: flex;
    align-items: center;
    gap: var(--ds-spacing-xs);
    
    &.required {
      &::after {
        content: '*';
        color: var(--ds-color-error);
        font-weight: map-get($font-weights, 'bold');
      }
    }
    
    .required-indicator {
      @extend %ds-text-error;
      font-size: map-get($font-sizes, 'xs');
    }
  }
  
  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    
    .form-input {
      @extend %ds-focus-input;
      
      width: 100%;
      padding: var(--ds-spacing-input-padding-y) var(--ds-spacing-input-padding-x);
      border: 1px solid var(--ds-color-border-primary);
      border-radius: var(--ds-spacing-xs);
      background: var(--ds-color-background-primary);
      color: var(--ds-color-text-primary);
      font-size: map-get($font-sizes, 'sm');
      font-family: inherit;
      transition: all var(--ds-focus-transition-duration) var(--ds-focus-transition-timing);
      
      &::placeholder {
        color: var(--ds-color-text-muted);
        opacity: 1; // Firefox fix
      }
      
      &:disabled {
        @extend %ds-text-disabled;
        background: var(--ds-color-background-disabled);
        cursor: not-allowed;
        opacity: 0.6;
      }
      
      &:read-only {
        background: var(--ds-color-background-secondary);
        cursor: text;
      }
      
      // Focus state
      &:focus {
        @include ds-focus-enhanced;
        border-color: var(--ds-focus-border-color);
        background: var(--ds-focus-background-color);
        box-shadow: inset 0 0 0 1px var(--ds-focus-border-color);
      }
      
      &:focus-visible {
        @include ds-focus-enhanced;
      }
    }
    
    // Input action button
    .input-action {
      position: absolute;
      right: var(--ds-spacing-xs);
      
      .input-action-button {
        @extend %ds-focus-button;
        
        background: transparent;
        border: none;
        padding: var(--ds-spacing-xs);
        border-radius: var(--ds-spacing-xs);
        cursor: pointer;
        color: var(--ds-color-text-secondary);
        font-size: map-get($font-sizes, 'sm');
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        
        &:hover {
          background: var(--ds-color-hover);
          color: var(--ds-color-text-primary);
        }
        
        &:focus {
          @include ds-focus-subtle;
        }
      }
    }
    
    // Validation icon
    .validation-icon {
      position: absolute;
      right: var(--ds-spacing-xs);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      
      .icon-success {
        color: var(--ds-color-success);
        font-size: 14px;
      }
      
      .icon-warning {
        color: var(--ds-color-warning);
        font-size: 14px;
      }
      
      .icon-error {
        color: var(--ds-color-error);
        font-size: 14px;
      }
    }
  }
  
  // Validation states
  &.validation-success {
    .form-input {
      border-color: var(--ds-color-success);
      
      &:focus {
        @include ds-focus-ring('success');
        box-shadow: inset 0 0 0 1px var(--ds-color-success);
      }
    }
    
    .validation-icon .icon-success {
      color: var(--ds-color-success);
    }
  }
  
  &.validation-warning {
    .form-input {
      border-color: var(--ds-color-warning);
      
      &:focus {
        @include ds-focus-ring('warning');
        box-shadow: inset 0 0 0 1px var(--ds-color-warning);
      }
    }
    
    .validation-icon .icon-warning {
      color: var(--ds-color-warning);
    }
  }
  
  &.validation-error {
    .form-input {
      border-color: var(--ds-color-error);
      
      &:focus {
        @include ds-focus-ring('error');
        box-shadow: inset 0 0 0 1px var(--ds-color-error);
      }
    }
    
    .validation-icon .icon-error {
      color: var(--ds-color-error);
    }
    
    .form-label {
      color: var(--ds-color-error);
    }
  }
  
  // Help text
  .help-text {
    @extend %ds-text-muted;
    font-size: map-get($font-sizes, 'xs');
    line-height: 1.4;
  }
  
  // Validation message
  .validation-message {
    font-size: map-get($font-sizes, 'xs');
    line-height: 1.4;
    
    &.validation-success {
      @extend %ds-text-success;
    }
    
    &.validation-warning {
      @extend %ds-text-warning;
    }
    
    &.validation-error {
      @extend %ds-text-error;
    }
  }
}

// Input types specific styling
.form-input[type="password"] {
  font-family: '•'.repeat(8); // Password masking
}

// Number input specific styling
.form-input[type="number"] {
  -moz-appearance: textfield; // Firefox
  
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}

// Search input specific styling
.form-input[type="search"] {
  &::-webkit-search-cancel-button {
    -webkit-appearance: none;
    appearance: none;
  }
}

// High contrast mode
@media (prefers-contrast: high) {
  .form-field {
    .form-input {
      border-width: 2px;
      
      &:focus {
        outline-width: 3px;
        outline-offset: 2px;
      }
    }
    
    &.validation-error .form-input {
      border-color: var(--ds-color-error);
      border-width: 2px;
    }
  }
}

// Reduced motion
@media (prefers-reduced-motion: reduce) {
  .form-field .form-input {
    transition: none;
  }
}

// Touch device optimizations
@media (pointer: coarse) {
  .form-field {
    .form-input {
      min-height: 44px;
      font-size: 16px; // Prevent zoom on iOS
    }
    
    .input-action .input-action-button {
      width: 32px;
      height: 32px;
      min-width: 32px;
      min-height: 32px;
    }
  }
}
```

### 3. Modal Dialog Component

**Accessible Modal with Focus Management**:

```typescript
// modal.component.ts
import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FocusManager, FocusStateUtils } from '../shared/design-system/focus-state.tokens';

interface ModalAction {
  label: string;
  action: () => void;
  type?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

@Component({
  selector: 'app-modal',
  template: `
    <div class="modal-overlay" 
         *ngIf="isOpen"
         [class.modal-enter]="isAnimating"
         (click)="onOverlayClick($event)"
         (keydown.esc)="onEscapeKey()">
      
      <div class="modal-container"
           [class.modal-size-small]="size === 'small'"
           [class.modal-size-medium]="size === 'medium'"
           [class.modal-size-large]="size === 'large'"
           [class.modal-size-full]="size === 'full'"
           role="dialog"
           [attr.aria-labelledby]="titleId"
           [attr.aria-describedby]="descriptionId"
           [attr.aria-modal]="true"
           (click)="$event.stopPropagation()"
           #modalContent>
        
        <!-- Modal header -->
        <header class="modal-header" *ngIf="title || showCloseButton">
          <h2 class="modal-title" [id]="titleId">
            {{ title }}
          </h2>
          
          <button class="modal-close ds-focus-button"
                  *ngIf="showCloseButton"
                  type="button"
                  [attr.aria-label]="closeAriaLabel || 'Close modal'"
                  (click)="onCloseClick()">
            <span aria-hidden="true">×</span>
          </button>
        </header>
        
        <!-- Modal content -->
        <main class="modal-content" [id]="descriptionId">
          <ng-content></ng-content>
          
          <!-- Default content if no projection -->
          <div class="modal-default-content" *ngIf="!hasProjectedContent">
            {{ content }}
          </div>
        </main>
        
        <!-- Modal actions -->
        <footer class="modal-actions" *ngIf="actions && actions.length > 0">
          <button class="modal-action ds-focus-button"
                  *ngFor="let action of actions; trackBy: trackByAction"
                  [class]="'modal-action-' + (action.type || 'secondary')"
                  type="button"
                  [disabled]="action.disabled"
                  (click)="action.action()">
            {{ action.label }}
          </button>
        </footer>
      </div>
    </div>
  `,
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements AfterViewInit, OnDestroy {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() content = '';
  @Input() size: 'small' | 'medium' | 'large' | 'full' = 'medium';
  @Input() showCloseButton = true;
  @Input() closeAriaLabel = '';
  @Input() closeOnOverlayClick = true;
  @Input() closeOnEscapeKey = true;
  @Input() trapFocus = true;
  @Input() returnFocusTo: HTMLElement | null = null;
  @Input() actions: ModalAction[] = [];
  
  @Output() closed = new EventEmitter<void>();
  @Output() opened = new EventEmitter<void>();
  @Output() actionClicked = new EventEmitter<ModalAction>();
  
  @ViewChild('modalContent', { static: false }) modalContent?: ElementRef;
  
  isAnimating = false;
  hasProjectedContent = false;
  private focusManager?: FocusManager;
  private previouslyFocusedElement: HTMLElement | null = null;
  
  get titleId(): string {
    return `modal-title-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  get descriptionId(): string {
    return `modal-desc-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  ngAfterViewInit(): void {
    this.checkProjectedContent();
  }
  
  ngOnDestroy(): void {
    if (this.focusManager) {
      this.focusManager.releaseFocus();
    }
  }
  
  private checkProjectedContent(): void {
    // Check if content is projected
    setTimeout(() => {
      const contentElement = this.modalContent?.nativeElement.querySelector('.modal-content');
      this.hasProjectedContent = contentElement && contentElement.children.length > 0;
    });
  }
  
  ngOnChanges(): void {
    if (this.isOpen) {
      this.openModal();
    } else {
      this.closeModal();
    }
  }
  
  private openModal(): void {
    this.isAnimating = true;
    this.previouslyFocusedElement = document.activeElement as HTMLElement;
    
    // Wait for animation to complete before managing focus
    setTimeout(() => {
      this.isAnimating = false;
      this.manageFocus();
      this.opened.emit();
    }, 150);
  }
  
  private closeModal(): void {
    if (this.focusManager) {
      this.focusManager.releaseFocus();
      this.focusManager = undefined;
    }
    
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
      this.previouslyFocusedElement = null;
    }
    
    this.closed.emit();
  }
  
  private manageFocus(): void {
    if (this.trapFocus && this.modalContent) {
      this.focusManager = new FocusManager(this.modalContent.nativeElement);
      this.focusManager.trapFocus();
    }
  }
  
  onOverlayClick(event: MouseEvent): void {
    if (this.closeOnOverlayClick && event.target === event.currentTarget) {
      this.close();
    }
  }
  
  onCloseClick(): void {
    this.close();
  }
  
  onEscapeKey(): void {
    if (this.closeOnEscapeKey) {
      this.close();
    }
  }
  
  close(): void {
    this.isOpen = false;
  }
  
  trackByAction(index: number, action: ModalAction): string {
    return action.label;
  }
}
```

**Modal SCSS with Focus States**:

```scss
// modal.component.scss
@import '../shared/design-system/focus-state-tokens';
@import '../shared/design-system/color-tokens';
@import '../shared/design-system/spacing-tokens';
@import '../shared/design-system/typography-tokens';

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  animation: modal-fade-in 150ms ease-out forwards;
  
  &.modal-enter {
    animation: modal-fade-in 150ms ease-out;
  }
  
  .modal-container {
    @extend %ds-focus-modal;
    
    background: var(--ds-color-background-primary);
    border-radius: var(--ds-spacing-md);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    max-width: 90vw;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    opacity: 0;
    transform: scale(0.95) translateY(-20px);
    animation: modal-slide-in 150ms ease-out forwards;
    
    // Size variants
    &.modal-size-small {
      width: 320px;
    }
    
    &.modal-size-medium {
      width: 512px;
    }
    
    &.modal-size-large {
      width: 768px;
    }
    
    &.modal-size-full {
      width: 90vw;
      height: 90vh;
    }
    
    &:focus {
      outline: none;
    }
  }
  
  // Modal header
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--ds-spacing-lg);
    border-bottom: 1px solid var(--ds-color-border-primary);
    
    .modal-title {
      @extend %ds-text-primary;
      font-size: map-get($font-sizes, 'lg');
      font-weight: map-get($font-weights, 'medium');
      margin: 0;
      line-height: 1.2;
    }
    
    .modal-close {
      @extend %ds-focus-button;
      
      background: transparent;
      border: none;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--ds-spacing-xs);
      color: var(--ds-color-text-secondary);
      font-size: map-get($font-sizes, 'xl');
      cursor: pointer;
      flex-shrink: 0;
      
      &:hover {
        background: var(--ds-color-hover);
        color: var(--ds-color-text-primary);
      }
      
      &:focus {
        @include ds-focus-subtle;
      }
    }
  }
  
  // Modal content
  .modal-content {
    flex: 1;
    padding: var(--ds-spacing-lg);
    overflow-y: auto;
    
    // Ensure focusable elements within content are accessible
    button,
    input,
    select,
    textarea,
    [tabindex] {
      @include ds-focus-subtle;
    }
  }
  
  // Modal actions
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--ds-spacing-md);
    padding: var(--ds-spacing-lg);
    border-top: 1px solid var(--ds-color-border-primary);
    
    .modal-action {
      @extend %ds-focus-button;
      
      padding: var(--ds-spacing-button-padding-y) var(--ds-spacing-button-padding-x);
      border: 1px solid transparent;
      border-radius: var(--ds-spacing-xs);
      font-size: map-get($font-sizes, 'sm');
      font-weight: map-get($font-weights, 'medium');
      cursor: pointer;
      transition: all var(--ds-focus-transition-duration) var(--ds-focus-transition-timing);
      min-width: 80px;
      
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      
      // Action type variants
      &.modal-action-primary {
        background: var(--ds-color-primary);
        color: var(--ds-color-text-inverse);
        border-color: var(--ds-color-primary);
        
        &:hover:not(:disabled) {
          background: var(--ds-color-primary-dark);
          border-color: var(--ds-color-primary-dark);
        }
        
        &:focus {
          @include ds-focus-enhanced;
        }
      }
      
      &.modal-action-secondary {
        background: var(--ds-color-background-secondary);
        color: var(--ds-color-text-primary);
        border-color: var(--ds-color-border-primary);
        
        &:hover:not(:disabled) {
          background: var(--ds-color-hover);
        }
        
        &:focus {
          @include ds-focus-subtle;
        }
      }
      
      &.modal-action-danger {
        background: var(--ds-color-error);
        color: var(--ds-color-text-inverse);
        border-color: var(--ds-color-error);
        
        &:hover:not(:disabled) {
          background: var(--ds-color-error-dark);
          border-color: var(--ds-color-error-dark);
        }
        
        &:focus {
          @include ds-focus-ring('error');
        }
      }
    }
  }
}

// Animations
@keyframes modal-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modal-slide-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

// High contrast mode
@media (prefers-contrast: high) {
  .modal-overlay {
    background: rgba(0, 0, 0, 0.8);
    
    .modal-container {
      border: 2px solid var(--ds-color-text-primary);
      
      .modal-header,
      .modal-actions {
        border-color: var(--ds-color-text-primary);
      }
    }
    
    .modal-close:focus {
      outline-width: 3px;
      outline-offset: 2px;
    }
  }
}

// Reduced motion
@media (prefers-reduced-motion: reduce) {
  .modal-overlay {
    animation: none;
    
    .modal-container {
      animation: none;
      transform: none;
      opacity: 1;
    }
  }
  
  .modal-action {
    transition: none;
  }
}

// Mobile optimizations
@media (max-width: 767px) {
  .modal-overlay {
    padding: var(--ds-spacing-md);
    align-items: flex-end;
    
    .modal-container {
      width: 100%;
      max-width: none;
      max-height: 80vh;
      border-radius: var(--ds-spacing-lg) var(--ds-spacing-lg) 0 0;
      animation: modal-slide-up 150ms ease-out;
      
      &.modal-size-full {
        height: 100vh;
        max-height: 100vh;
        border-radius: 0;
      }
    }
  }
  
  @keyframes modal-slide-up {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
}

// Print styles
@media print {
  .modal-overlay {
    position: static;
    background: none;
    
    .modal-container {
      box-shadow: none;
      border: 1px solid #000;
      max-width: none;
      max-height: none;
    }
  }
}
```

## Usage Examples

### Basic Implementation

```html
<!-- Tech Tree Node -->
<app-tech-tree-node
  [node]="technologyNode"
  [isSelected]="nodeSelected"
  [connectionMode]="isConnectionMode"
  (nodeSelected)="onNodeSelected($event)"
  (nodeFocused)="onNodeFocused($event)">
</app-tech-tree-node>

<!-- Form Field -->
<app-form-field
  label="Technology Name"
  type="text"
  placeholder="Enter technology name"
  [required]="true"
  [validationState]="nameValidationState"
  [validationMessage]="nameError"
  helpText="Enter a descriptive name for the technology"
  (blur)="onFieldBlur($event)">
</app-form-field>

<!-- Modal Dialog -->
<app-modal
  [isOpen]="showConfirmDialog"
  title="Confirm Research"
  content="Are you sure you want to research this technology?"
  size="medium"
  [actions]="[
    { label: 'Cancel', action: () => closeDialog(), type: 'secondary' },
    { label: 'Confirm', action: () => confirmResearch(), type: 'primary' }
  ]"
  (closed)="onDialogClosed()">
</app-modal>
```

### Advanced Integration

```typescript
// Advanced tech tree with focus management
@Component({
  template: `
    <div class="tech-tree-editor" 
         role="application"
         [attr.aria-label]="'Tech Tree Editor for ' + civilizationName"
         (keydown)="onKeydown($event)">
      
      <!-- Toolbar -->
      <div class="toolbar" role="toolbar" aria-label="Tech tree controls">
        <button class="toolbar-button ds-focus-enhanced"
                (click)="toggleConnectionMode()"
                [attr.aria-pressed]="connectionMode">
          Connect Nodes
        </button>
      </div>
      
      <!-- Tech Tree Grid -->
      <div class="tech-tree-grid"
           role="grid"
           [attr.aria-label]="techTreeAriaLabel">
        
        <app-tech-tree-node
          *ngFor="let node of visibleNodes; trackBy: trackByNodeId"
          [node]="node"
          [gridPosition]="getGridPosition(node)"
          [connectionMode]="connectionMode"
          [isFocusable]="isNodeFocusable(node)"
          (nodeSelected)="onNodeSelected($event)"
          (nodeFocused)="onNodeFocused($event)"
          (connectionStarted)="onConnectionStarted($event)">
        </app-tech-tree-node>
      </div>
      
      <!-- Node Details Panel -->
      <app-node-detail-panel
        [selectedNode]="selectedNode"
        [visible]="showNodeDetails"
        (close)="closeNodeDetails()"
        (nodeUpdated)="onNodeUpdated($event)">
      </app-node-detail-panel>
    </div>
  `
})
export class TechTreeEditorComponent implements AfterViewInit {
  @ViewChildren(TechTreeNodeComponent) nodeComponents!: QueryList<TechTreeNodeComponent>;
  
  selectedNode: TechnologyNode | null = null;
  connectionMode = false;
  showNodeDetails = false;
  
  ngAfterViewInit(): void {
    this.setupGridNavigation();
  }
  
  private setupGridNavigation(): void {
    // Set up arrow key navigation between nodes
    window.addEventListener('nodeNavigation', (event: CustomEvent) => {
      const { currentNode, direction } = event.detail;
      const nextNode = this.findAdjacentNode(currentNode, direction);
      if (nextNode) {
        this.focusNode(nextNode);
      }
    });
  }
  
  onKeydown(event: KeyboardEvent): void {
    // Global keyboard shortcuts
    switch (event.key) {
      case 'Escape':
        if (this.connectionMode) {
          this.toggleConnectionMode();
          event.preventDefault();
        }
        if (this.showNodeDetails) {
          this.closeNodeDetails();
          event.preventDefault();
        }
        break;
        
      case 'F2':
        if (this.selectedNode) {
          this.editSelectedNode();
          event.preventDefault();
        }
        break;
        
      case 'Delete':
        if (this.selectedNode) {
          this.deleteSelectedNode();
          event.preventDefault();
        }
        break;
    }
  }
  
  private focusNode(node: TechnologyNode): void {
    const nodeComponent = this.nodeComponents.find(comp => comp.node.id === node.id);
    nodeComponent?.focus();
  }
}
```

## Integration Testing

### Component Test Examples

```typescript
// tech-tree-node.component.spec.ts
describe('TechTreeNodeComponent Focus States', () => {
  it('should be keyboard accessible', () => {
    const { getByRole } = render(
      <TechTreeNodeComponent 
        node={availableNode}
        isFocusable={true}
      />
    );
    
    const node = getByRole('button');
    
    // Should be focusable
    node.focus();
    expect(node).toHaveFocus();
    
    // Should activate with Enter
    userEvent.keyboard('{Enter}');
    expect(mockOnNodeSelected).toHaveBeenCalledWith(availableNode);
  });
  
  it('should show focus in connection mode', () => {
    render(
      <TechTreeNodeComponent 
        node={availableNode}
        connectionMode={true}
      />
    );
    
    const node = getByRole('button');
    node.focus();
    
    expect(node).toHaveClass('connection-mode');
    
    // Should show connection-specific focus styles
    const styles = window.getComputedStyle(node);
    expect(styles.boxShadow).toContain('var(--ds-color-focus)');
  });
  
  it('should announce node state to screen readers', () => {
    render(<TechTreeNodeComponent node={lockedNode} />);
    
    const node = getByRole('button');
    node.focus();
    
    expect(node).toHaveAttribute('aria-label', 'Technology: Advanced Metallurgy (Locked)');
  });
});
```

These examples demonstrate comprehensive focus state integration that:

- Maintains accessibility compliance (WCAG 2.1 AA)
- Provides consistent keyboard navigation
- Supports screen reader users
- Works across different themes and contrast modes
- Includes proper error handling and validation
- Integrates seamlessly with Angular's component architecture
- Supports advanced features like focus trapping and grid navigation

Each example includes proper TypeScript interfaces, comprehensive SCSS styling with design system tokens, accessibility features, and thorough testing examples to ensure robust implementation.