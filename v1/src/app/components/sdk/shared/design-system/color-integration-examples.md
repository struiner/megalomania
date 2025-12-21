# Color Tokens Integration Examples

## Overview

This document provides comprehensive integration examples for implementing the Design System Color Tokens across all Tech Tree Editor components. Each example demonstrates proper usage patterns, accessibility considerations, and real-world component implementations.

## Import and Setup

### SCSS Integration
```scss
// Import color tokens in your component SCSS file
@import '../shared/design-system/color-tokens';

// Usage in component styles
.tech-tree-node {
  color: var(--ds-color-text-primary);
  background-color: var(--ds-color-background-primary);
  border-color: var(--ds-color-border-primary);
  
  &:hover {
    background-color: var(--ds-color-hover);
  }
  
  &:focus {
    @include ds-focus-ring;
  }
}
```

### TypeScript Integration
```typescript
// Import color utilities
import { COLOR_TOKENS, ColorUtils } from '../shared/design-system/color.tokens';

// Usage in component class
export class TechTreeNodeComponent {
  getNodeColor(node: TechNode): string {
    if (node.isAvailable) {
      return COLOR_TOKENS.nodeAvailable;
    }
    if (node.isLocked) {
      return COLOR_TOKENS.nodeLocked;
    }
    return COLOR_TOKENS.nodeResearching;
  }
  
  validateAccessibility(): void {
    const validation = ColorUtils.validateAccessibility();
    if (!validation.passed) {
      console.warn('Color accessibility issues:', validation.failures);
    }
  }
}
```

## Component Integration Examples

### 1. Tech Tree Grid Component

#### SCSS Implementation
```scss
// src/app/components/tech-tree-grid/tech-tree-grid.component.scss
@import '../shared/design-system/color-tokens';

.ds-tech-grid {
  @include ds-bg-primary;
  @include ds-text-primary;
  display: grid;
  gap: var(--spacing-sm, 8px);
  padding: var(--spacing-md, 16px);
  
  // Grid node states
  &__node {
    @include ds-node-title;
    @include ds-bg-secondary;
    @include ds-border-primary;
    @include ds-hover-overlay;
    @include ds-focus-ring;
    @include ds-active-overlay;
    
    padding: var(--spacing-md, 16px);
    border-radius: var(--border-radius-sm, 4px);
    transition: all 150ms ease-in-out;
    
    // Available state
    &--available {
      @extend %ds-node-available;
      cursor: pointer;
      
      &:hover {
        background-color: var(--ds-color-hover);
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(139, 69, 19, 0.12);
      }
    }
    
    // Locked state
    &--locked {
      @extend %ds-node-locked;
      cursor: not-allowed;
      position: relative;
      
      &::after {
        content: "🔒";
        position: absolute;
        top: 8px;
        right: 8px;
        font-size: 14px;
      }
    }
    
    // Researching state
    &--researching {
      @extend %ds-node-researching;
      position: relative;
      overflow: hidden;
      
      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 2px;
        background: linear-gradient(
          90deg,
          transparent,
          var(--ds-color-node-researching),
          transparent
        );
        animation: progress-shimmer 2s infinite;
      }
    }
    
    // Complete state
    &--complete {
      @extend %ds-node-complete;
      position: relative;
      
      &::after {
        content: "✓";
        position: absolute;
        top: 8px;
        right: 8px;
        color: var(--ds-color-node-complete);
        font-weight: bold;
        font-size: 14px;
      }
    }
    
    // Error state
    &--error {
      @extend %ds-node-error;
      
      &::after {
        content: "⚠";
        position: absolute;
        top: 8px;
        right: 8px;
        color: var(--ds-color-node-error);
        font-size: 14px;
      }
    }
  }
  
  // Connection lines between nodes
  &__connection {
    &--valid {
      stroke: var(--ds-color-connection-valid);
      stroke-width: 2;
      opacity: 0.8;
    }
    
    &--invalid {
      stroke: var(--ds-color-connection-invalid);
      stroke-width: 2;
      stroke-dasharray: 4, 4;
      opacity: 0.8;
    }
    
    &--prerequisite {
      stroke: var(--ds-color-connection-prerequisite);
      stroke-width: 1;
      opacity: 0.6;
      stroke-dasharray: 2, 2;
    }
  }
  
  // Responsive adjustments
  @media (max-width: 768px) {
    gap: var(--spacing-xs, 4px);
    padding: var(--spacing-sm, 8px);
    
    &__node {
      padding: var(--spacing-sm, 8px);
      font-size: var(--ds-font-size-sm);
    }
  }
}

// Animations
@keyframes progress-shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

// High contrast support
@media (prefers-contrast: high) {
  .ds-tech-grid__node {
    &--locked {
      border-style: solid;
      border-width: 2px;
      opacity: 1;
    }
    
    &--available:hover {
      border-width: 3px;
    }
  }
}
```

#### TypeScript Integration
```typescript
// src/app/components/tech-tree-grid/tech-tree-grid.component.ts
import { Component, OnInit } from '@angular/core';
import { COLOR_TOKENS, ColorUtils } from '../shared/design-system/color.tokens';

interface TechNode {
  id: string;
  name: string;
  description: string;
  isAvailable: boolean;
  isLocked: boolean;
  isResearching: boolean;
  isComplete: boolean;
  hasError: boolean;
  prerequisites: string[];
}

@Component({
  selector: 'app-tech-tree-grid',
  templateUrl: './tech-tree-grid.component.html',
  styleUrls: ['./tech-tree-grid.component.scss']
})
export class TechTreeGridComponent implements OnInit {
  nodes: TechNode[] = [];
  connections: any[] = [];
  
  ngOnInit() {
    this.loadNodes();
    this.validateColorAccessibility();
  }
  
  getNodeClass(node: TechNode): string {
    if (node.hasError) return 'ds-tech-grid__node--error';
    if (node.isComplete) return 'ds-tech-grid__node--complete';
    if (node.isResearching) return 'ds-tech-grid__node--researching';
    if (node.isLocked) return 'ds-tech-grid__node--locked';
    if (node.isAvailable) return 'ds-tech-grid__node--available';
    return 'ds-tech-grid__node';
  }
  
  getConnectionClass(connection: any): string {
    const baseClass = 'ds-tech-grid__connection';
    
    switch (connection.type) {
      case 'valid':
        return `${baseClass}--valid`;
      case 'invalid':
        return `${baseClass}--invalid`;
      case 'prerequisite':
        return `${baseClass}--prerequisite`;
      default:
        return baseClass;
    }
  }
  
  getNodeIcon(node: TechNode): string {
    if (node.hasError) return '⚠';
    if (node.isComplete) return '✓';
    if (node.isResearching) return '⏳';
    if (node.isLocked) return '🔒';
    if (node.isAvailable) return '▶';
    return '○';
  }
  
  private validateColorAccessibility(): void {
    const validation = ColorUtils.validateAccessibility();
    if (!validation.passed) {
      console.warn('Color accessibility issues detected:', validation.failures);
      // You could also send this to an error reporting service
    }
  }
  
  private loadNodes(): void {
    // Load nodes from service
    this.nodes = [
      {
        id: '1',
        name: 'Basic Construction',
        description: 'Learn fundamental building techniques',
        isAvailable: true,
        isLocked: false,
        isResearching: false,
        isComplete: false,
        hasError: false,
        prerequisites: []
      }
      // ... more nodes
    ];
  }
}
```

#### HTML Template
```html
<!-- src/app/components/tech-tree-grid/tech-tree-grid.component.html -->
<div class="ds-tech-grid" role="grid" aria-label="Technology Tree">
  <!-- Render nodes -->
  <div
    *ngFor="let node of nodes"
    [class]="getNodeClass(node)"
    [attr.aria-label]="node.name"
    [attr.aria-describedby]="'desc-' + node.id"
    role="gridcell"
    tabindex="0"
  >
    <div class="ds-tech-grid__node-content">
      <span class="ds-tech-grid__node-icon" aria-hidden="true">
        {{ getNodeIcon(node) }}
      </span>
      <h3 class="ds-tech-grid__node-title">{{ node.name }}</h3>
      <p class="ds-tech-grid__node-description" [id]="'desc-' + node.id">
        {{ node.description }}
      </p>
      
      <!-- Prerequisite indicators -->
      <div class="ds-tech-grid__node-prereqs" *ngIf="node.prerequisites.length > 0">
        <span class="ds-tech-grid__node-prereqs-label">
          Requires:
        </span>
        <span class="ds-tech-grid__node-prereqs-list">
          {{ node.prerequisites.join(', ') }}
        </span>
      </div>
    </div>
  </div>
  
  <!-- SVG for connections -->
  <svg class="ds-tech-grid__connections" aria-hidden="true">
    <line
      *ngFor="let connection of connections"
      [attr.class]="getConnectionClass(connection)"
      [attr.x1]="connection.x1"
      [attr.y1]="connection.y1"
      [attr.x2]="connection.x2"
      [attr.y2]="connection.y2"
    />
  </svg>
</div>
```

### 2. Node Detail Panel Component

#### SCSS Implementation
```scss
// src/app/components/node-detail-panel/node-detail-panel.component.scss
@import '../shared/design-system/color-tokens';

.ds-node-detail {
  @include ds-bg-primary;
  @include ds-text-primary;
  @include ds-border-primary;
  
  border-radius: var(--border-radius-md, 8px);
  padding: var(--spacing-lg, 24px);
  max-width: 400px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  
  // Header section
  &__header {
    margin-bottom: var(--spacing-lg, 24px);
    padding-bottom: var(--spacing-md, 16px);
    border-bottom: 1px solid var(--ds-color-border-primary);
  }
  
  &__title {
    @include ds-heading(2);
    margin: 0 0 var(--spacing-xs, 4px) 0;
    color: var(--ds-color-text-primary);
  }
  
  &__status {
    @include ds-body-small;
    @extend %ds-validation;
    
    &--available {
      @include ds-validation-success;
    }
    
    &--locked {
      @include ds-validation-warning;
    }
    
    &--researching {
      @include ds-validation-info;
    }
    
    &--complete {
      @include ds-validation-success;
    }
    
    &--error {
      @include ds-validation-error;
    }
  }
  
  // Content sections
  &__section {
    margin-bottom: var(--spacing-lg, 24px);
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  &__section-title {
    @include ds-heading(5);
    @include ds-text-secondary;
    margin: 0 0 var(--spacing-sm, 8px) 0;
    font-size: var(--ds-font-size-sm);
    font-weight: var(--ds-font-weight-medium);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  &__description {
    @include ds-body;
    @include ds-text-secondary;
    line-height: var(--ds-line-height-relaxed);
  }
  
  // Effects list
  &__effects {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  &__effect-item {
    @include ds-body-small;
    @include ds-text-secondary;
    display: flex;
    align-items: center;
    padding: var(--spacing-xs, 4px) 0;
    
    &::before {
      content: "•";
      color: var(--ds-color-secondary);
      font-weight: bold;
      margin-right: var(--spacing-sm, 8px);
    }
  }
  
  // Prerequisites
  &__prerequisites {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  &__prerequisite {
    @include ds-body-small;
    display: flex;
    align-items: center;
    padding: var(--spacing-xs, 4px) 0;
    
    &--met {
      color: var(--ds-color-success);
      
      &::before {
        content: "✓";
        margin-right: var(--spacing-sm, 8px);
        font-weight: bold;
      }
    }
    
    &--unmet {
      color: var(--ds-color-text-muted);
      
      &::before {
        content: "○";
        margin-right: var(--spacing-sm, 8px);
      }
    }
  }
  
  // Action buttons
  &__actions {
    display: flex;
    gap: var(--spacing-sm, 8px);
    margin-top: var(--spacing-lg, 24px);
  }
  
  &__action-button {
    @include ds-body;
    @include ds-bg-secondary;
    @include ds-text-primary;
    @include ds-border-primary;
    @include ds-hover-overlay;
    @include ds-focus-ring;
    @include ds-active-overlay;
    
    padding: var(--spacing-sm, 8px) var(--spacing-md, 16px);
    border-radius: var(--border-radius-sm, 4px);
    cursor: pointer;
    transition: all 150ms ease;
    flex: 1;
    text-align: center;
    
    &--primary {
      @include ds-bg-primary;
      color: var(--ds-color-text-inverse);
      background-color: var(--ds-color-primary);
      
      &:hover {
        background-color: var(--ds-color-primary-dark);
      }
    }
    
    &--secondary {
      @include ds-bg-secondary;
      color: var(--ds-color-text-primary);
      
      &:hover {
        background-color: var(--ds-color-background-tertiary);
      }
    }
    
    &--disabled {
      @extend %ds-text-disabled;
      cursor: not-allowed;
      opacity: 0.6;
      
      &:hover,
      &:focus {
        background-color: var(--ds-color-background-secondary);
      }
    }
  }
  
  // Loading state
  &--loading {
    opacity: 0.7;
    pointer-events: none;
    
    &::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      width: 20px;
      height: 20px;
      margin: -10px 0 0 -10px;
      border: 2px solid var(--ds-color-border-secondary);
      border-top-color: var(--ds-color-primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

// Responsive design
@media (max-width: 768px) {
  .ds-node-detail {
    padding: var(--spacing-md, 16px);
    max-width: none;
    width: 100%;
    
    &__actions {
      flex-direction: column;
    }
    
    &__action-button {
      width: 100%;
    }
  }
}

// High contrast support
@media (prefers-contrast: high) {
  .ds-node-detail {
    border-width: 2px;
    
    &__action-button--disabled {
      opacity: 1;
      border-style: dashed;
    }
  }
}
```

### 3. Icon Picker Component

#### SCSS Implementation
```scss
// src/app/components/icon-picker/icon-picker.component.scss
@import '../shared/design-system/color-tokens';

.ds-icon-picker {
  @include ds-bg-primary;
  @include ds-text-primary;
  
  border-radius: var(--border-radius-md, 8px);
  padding: var(--spacing-lg, 24px);
  max-width: 600px;
  
  // Search input
  &__search {
    @include ds-bg-secondary;
    @include ds-text-primary;
    @include ds-border-primary;
    @include ds-focus-ring;
    
    width: 100%;
    padding: var(--spacing-md, 16px);
    border-radius: var(--border-radius-sm, 4px);
    margin-bottom: var(--spacing-lg, 24px);
    font-size: var(--ds-font-size-md);
    
    &::placeholder {
      @include ds-text-muted;
    }
    
    &:focus {
      @include ds-border-focus;
    }
  }
  
  // Category filters
  &__categories {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs, 4px);
    margin-bottom: var(--spacing-lg, 24px);
  }
  
  &__category-filter {
    @include ds-body-small;
    @include ds-text-secondary;
    @include ds-bg-tertiary;
    @include ds-border-primary;
    @include ds-hover-overlay;
    @include ds-focus-ring;
    
    padding: var(--spacing-xs, 4px) var(--spacing-sm, 8px);
    border-radius: var(--border-radius-sm, 4px);
    cursor: pointer;
    border: none;
    
    &--active {
      @include ds-text-inverse;
      background-color: var(--ds-color-primary);
      color: var(--ds-color-text-inverse);
    }
  }
  
  // Icon grid
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));
    gap: var(--spacing-sm, 8px);
    max-height: 400px;
    overflow-y: auto;
  }
  
  &__icon-item {
    @include ds-bg-secondary;
    @include ds-border-primary;
    @include ds-hover-overlay;
    @include ds-focus-ring;
    @include ds-selected-overlay;
    
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: var(--border-radius-sm, 4px);
    cursor: pointer;
    transition: all 150ms ease;
    
    &:hover {
      background-color: var(--ds-color-hover-secondary);
      transform: translateY(-1px);
    }
    
    &:focus {
      outline: none;
    }
    
    &--selected {
      @include ds-border-focus;
      background-color: var(--ds-color-selected);
      box-shadow: 0 0 0 2px rgba(218, 165, 32, 0.2);
    }
  }
  
  &__icon {
    font-size: 20px;
    line-height: 1;
    
    // Icon color variations
    &--primary {
      color: var(--ds-color-primary);
    }
    
    &--secondary {
      color: var(--ds-color-secondary);
    }
    
    &--success {
      color: var(--ds-color-success);
    }
    
    &--warning {
      color: var(--ds-color-warning);
    }
    
    &--error {
      color: var(--ds-color-error);
    }
    
    &--info {
      color: var(--ds-color-info);
    }
  }
  
  // Icon preview
  &__preview {
    @include ds-bg-secondary;
    @include ds-text-primary;
    @include ds-border-primary;
    
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    border-radius: var(--border-radius-md, 8px);
    margin-bottom: var(--spacing-md, 16px);
    
    &-icon {
      font-size: 32px;
    }
  }
  
  // Icon details
  &__details {
    @include ds-body-small;
    @include ds-text-secondary;
    
    margin-bottom: var(--spacing-lg, 24px);
  }
  
  &__icon-name {
    @include ds-text-primary;
    font-weight: var(--ds-font-weight-medium);
    margin-bottom: var(--spacing-xs, 4px);
  }
  
  &__icon-category {
    @include ds-text-muted;
    font-size: var(--ds-font-size-xs);
  }
  
  // Actions
  &__actions {
    display: flex;
    gap: var(--spacing-sm, 8px);
    justify-content: flex-end;
  }
  
  &__action-button {
    @include ds-body;
    @include ds-bg-secondary;
    @include ds-text-primary;
    @include ds-border-primary;
    @include ds-hover-overlay;
    @include ds-focus-ring;
    
    padding: var(--spacing-sm, 8px) var(--spacing-md, 16px);
    border-radius: var(--border-radius-sm, 4px);
    cursor: pointer;
    transition: all 150ms ease;
    
    &--primary {
      @include ds-bg-primary;
      color: var(--ds-color-text-inverse);
      background-color: var(--ds-color-primary);
    }
    
    &--disabled {
      @extend %ds-text-disabled;
      cursor: not-allowed;
      opacity: 0.6;
    }
  }
  
  // Empty state
  &__empty {
    @include ds-text-muted;
    text-align: center;
    padding: var(--spacing-xxl, 48px) var(--spacing-lg, 24px);
    
    &-icon {
      font-size: 48px;
      margin-bottom: var(--spacing-md, 16px);
      opacity: 0.5;
    }
    
    &-message {
      @include ds-body;
      margin-bottom: var(--spacing-sm, 8px);
    }
    
    &-suggestion {
      @include ds-body-small;
      @include ds-text-muted;
    }
  }
  
  // Loading state
  &__loading {
    @include ds-text-muted;
    text-align: center;
    padding: var(--spacing-xxl, 48px);
    
    &-spinner {
      width: 24px;
      height: 24px;
      border: 2px solid var(--ds-color-border-secondary);
      border-top-color: var(--ds-color-primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto var(--spacing-md, 16px);
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .ds-icon-picker {
    padding: var(--spacing-md, 16px);
    max-width: none;
    
    &__grid {
      grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
      gap: var(--spacing-xs, 4px);
    }
    
    &__icon-item {
      width: 40px;
      height: 40px;
    }
    
    &__icon {
      font-size: 16px;
    }
  }
}

// High contrast support
@media (prefers-contrast: high) {
  .ds-icon-picker {
    &__category-filter--active {
      border: 2px solid var(--ds-color-primary);
    }
    
    &__icon-item--selected {
      border-width: 3px;
    }
  }
}
```

## Migration Examples

### Legacy Component Migration

#### Before (Legacy Colors)
```scss
.legacy-tech-node {
  color: #333333;
  background-color: #ffffff;
  border: 1px solid #cccccc;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  &.available {
    border-color: #4caf50;
    color: #4caf50;
  }
  
  &.locked {
    opacity: 0.6;
    color: #999999;
  }
  
  &.error {
    border-color: #f44336;
    color: #f44336;
  }
}
```

#### After (Design System Tokens)
```scss
.tech-node {
  @include ds-text-primary;
  @include ds-bg-primary;
  @include ds-border-primary;
  @include ds-hover-overlay;
  
  &.available {
    @extend %ds-node-available;
    @extend %ds-clickable;
  }
  
  &.locked {
    @extend %ds-node-locked;
  }
  
  &.error {
    @extend %ds-node-error;
  }
}
```

### JavaScript/TypeScript Migration

#### Before (Hardcoded Colors)
```typescript
function getNodeColor(node: TechNode): string {
  if (node.isAvailable) return '#4caf50';
  if (node.isLocked) return '#999999';
  if (node.hasError) return '#f44336';
  return '#2196f3';
}
```

#### After (Design System Tokens)
```typescript
import { COLOR_TOKENS } from '../shared/design-system/color.tokens';

function getNodeColor(node: TechNode): string {
  if (node.isAvailable) return COLOR_TOKENS.nodeAvailable;
  if (node.isLocked) return COLOR_TOKENS.nodeLocked;
  if (node.hasError) return COLOR_TOKENS.nodeError;
  return COLOR_TOKENS.nodeResearching;
}
```

## Testing Integration

### Component Testing with Color Tokens
```typescript
// tech-tree-grid.component.spec.ts
import { TestBed } from '@angular/core/testing';
import { TechTreeGridComponent } from './tech-tree-grid.component';
import { COLOR_TOKENS } from '../shared/design-system/color.tokens';

describe('TechTreeGridComponent', () => {
  let component: TechTreeGridComponent;
  let fixture: ComponentFixture<TechTreeGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechTreeGridComponent],
      imports: []
    }).compileComponents();

    fixture = TestBed.createComponent(TechTreeGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should apply correct colors for available nodes', () => {
    const availableNode = {
      isAvailable: true,
      isLocked: false,
      isResearching: false,
      isComplete: false,
      hasError: false
    };

    const element = fixture.nativeElement.querySelector('.ds-tech-grid__node');
    expect(element.classList.contains('ds-tech-grid__node--available')).toBe(true);
  });

  it('should validate color accessibility', () => {
    const validation = ColorUtils.validateAccessibility();
    expect(validation.passed).toBe(true);
  });

  it('should use semantic color tokens', () => {
    const nodeColor = component.getNodeColor({
      isAvailable: true,
      isLocked: false,
      isResearching: false,
      isComplete: false,
      hasError: false
    });
    
    expect(nodeColor).toBe(COLOR_TOKENS.nodeAvailable);
  });
});
```

## Performance Considerations

### CSS Custom Properties Optimization
```scss
// Use CSS custom properties efficiently
.tech-node {
  // Define once
  --node-color: var(--ds-color-node-available);
  --node-border-color: var(--ds-color-node-available);
  
  // Use multiple times without recalculation
  color: var(--node-color);
  border-color: var(--node-border-color);
  
  &:hover {
    // Subtle hover state
    --node-color: var(--ds-color-node-available-dark);
    --node-border-color: var(--ds-color-node-available-dark);
  }
}
```

### TypeScript Performance
```typescript
// Cache color lookups for performance
const NODE_COLOR_CACHE = new Map<string, string>();

function getCachedNodeColor(nodeType: string): string {
  if (!NODE_COLOR_CACHE.has(nodeType)) {
    NODE_COLOR_CACHE.set(nodeType, getNodeColor(nodeType));
  }
  return NODE_COLOR_CACHE.get(nodeType)!;
}
```

## Summary

These integration examples demonstrate:

1. **Consistent Usage** - All components use the same color tokens
2. **Accessibility First** - WCAG compliance built into every component
3. **Responsive Design** - Color tokens work across all screen sizes
4. **Performance Optimized** - Efficient use of CSS custom properties
5. **Future Maintainable** - Centralized color management
6. **Theme Ready** - Easy dark theme implementation
7. **Testing Integration** - Comprehensive test examples

The color token system provides a robust foundation for consistent, accessible, and maintainable color usage across all Tech Tree Editor components.