# Typography Integration Examples

## Overview

This document provides practical integration examples for implementing the Design System Typography Scale across all Tech Tree Editor components. Each example demonstrates proper usage of typography tokens, SCSS mixins, and TypeScript utilities.

---

## 1. Tech Tree Grid Component

### Component Structure
```scss
// tech-tree-grid.component.scss
@import 'design-system/typography-tokens';

.tech-tree-grid {
  padding: var(--sdk-spacing-lg);
  
  // Grid container typography
  .grid-header {
    @extend %ds-heading-2;
    margin-bottom: var(--sdk-spacing-xl);
  }
  
  // Individual nodes
  .tech-node {
    @include sdk-panel;
    padding: var(--sdk-spacing-md);
    margin-bottom: var(--sdk-spacing-sm);
    
    .node-title {
      @extend %ds-node-title;
      margin-bottom: var(--sdk-spacing-xs);
    }
    
    .node-description {
      @extend %ds-node-description;
      margin-bottom: var(--sdk-spacing-sm);
    }
    
    .node-meta {
      @extend %ds-node-meta;
      display: flex;
      gap: var(--sdk-spacing-sm);
    }
    
    .node-prerequisites {
      .prerequisite-label {
        @extend %ds-node-meta;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      
      .prerequisite-list {
        .prerequisite-item {
          @extend %ds-node-prerequisite;
        }
      }
    }
    
    .node-validation {
      @extend %ds-validation;
      margin-top: var(--sdk-spacing-sm);
      padding: var(--sdk-spacing-xs) var(--sdk-spacing-sm);
      border-radius: var(--sdk-border-radius-sm);
    }
  }
}
```

### TypeScript Implementation
```typescript
// tech-tree-grid.component.ts
import { Component, OnInit } from '@angular/core';
import { TYPOGRAPHY_TOKENS } from 'design-system/typography.tokens';

interface TechNode {
  id: string;
  title: string;
  description: string;
  tier: number;
  prerequisites: string[];
  effects: string[];
  validation?: ValidationMessage[];
}

@Component({
  selector: 'app-tech-tree-grid',
  template: `
    <div class="tech-tree-grid">
      <header class="grid-header">
        <h1>{{ title }}</h1>
      </header>
      
      <div class="tech-nodes-container">
        <div 
          *ngFor="let node of nodes" 
          class="tech-node"
          [attr.data-node-id]="node.id">
          
          <h3 class="node-title">{{ node.title }}</h3>
          <p class="node-description">{{ node.description }}</p>
          
          <div class="node-meta">
            <span class="tier">Tier {{ node.tier }}</span>
            <span class="effects-count">{{ node.effects.length }} effects</span>
          </div>
          
          <div *ngIf="node.prerequisites.length > 0" class="node-prerequisites">
            <span class="prerequisite-label">Requires:</span>
            <div class="prerequisite-list">
              <span 
                *ngFor="let prereq of node.prerequisites" 
                class="prerequisite-item">
                {{ prereq }}
              </span>
            </div>
          </div>
          
          <div 
            *ngIf="node.validation" 
            class="node-validation"
            [ngClass]="'validation-' + node.validation.severity">
            {{ node.validation.message }}
          </div>
        </div>
      </div>
    </div>
  `
})
export class TechTreeGridComponent implements OnInit {
  title = 'Technology Tree';
  nodes: TechNode[] = [];
  
  ngOnInit() {
    // Apply typography programmatically if needed
    this.applyGridTypography();
  }
  
  private applyGridTypography() {
    const style = document.createElement('style');
    style.textContent = `
      .tech-tree-grid {
        --grid-font-size: ${TYPOGRAPHY_TOKENS.nodeTitle.size};
        --grid-font-weight: ${TYPOGRAPHY_TOKENS.nodeTitle.weight};
      }
    `;
    document.head.appendChild(style);
  }
}
```

---

## 2. Node Detail Panel Component

### SCSS Implementation
```scss
// node-detail-panel.component.scss
@import 'design-system/typography-tokens';

.node-detail-panel {
  @include sdk-panel;
  padding: var(--sdk-spacing-xl);
  max-width: 480px;
  
  // Panel header
  .panel-header {
    border-bottom: 1px solid var(--sdk-border-subtle);
    padding-bottom: var(--sdk-spacing-lg);
    margin-bottom: var(--sdk-spacing-lg);
    
    .panel-title {
      @extend %ds-heading-2;
      margin-bottom: var(--sdk-spacing-sm);
    }
    
    .panel-subtitle {
      @extend %ds-body-small;
      color: var(--sdk-text-secondary);
    }
  }
  
  // Content sections
  .content-section {
    margin-bottom: var(--sdk-spacing-lg);
    
    .section-title {
      @extend %ds-heading-4;
      margin-bottom: var(--sdk-spacing-sm);
    }
    
    .section-content {
      @extend %ds-body;
      
      .effects-list {
        .effect-item {
          @extend %ds-body: var(--sdk-small;
          padding-spacing-xs) 0;
          border-bottom: 1px solid var(--sdk-border-subtle);
          
          &:last-child {
            border-bottom: none;
          }
        }
      }
      
      .description-text {
        @extend %ds-body;
        line-height: var(--ds-line-height-relaxed);
        color: var(--sdk-text-primary);
      }
    }
  }
  
  // Metadata section
  .metadata-section {
    .metadata-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--sdk-spacing-md);
      
      .metadata-item {
        @extend %ds-body-small;
        
        .label {
          @extend %ds-node-meta;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .value {
          @extend %ds-body;
          font-weight: var(--ds-font-weight-medium);
        }
      }
    }
  }
  
  // Validation section
  .validation-section {
    @extend %ds-validation;
    margin-top: var(--sdk-spacing-lg);
    padding: var(--sdk-spacing-md);
    border-radius: var(--sdk-border-radius-sm);
    
    &.validation-error {
      @extend %validation-notice-error;
    }
    
    &.validation-warning {
      @extend %validation-notice-warning;
    }
    
    &.validation-info {
      @extend %validation-notice-info;
    }
  }
}
```

### HTML Template
```html
<!-- node-detail-panel.component.html -->
<div class="node-detail-panel">
  <header class="panel-header">
    <h2 class="panel-title">{{ node.title }}</h2>
    <p class="panel-subtitle">Tier {{ node.tier }} Technology</p>
  </header>
  
  <section class="content-section">
    <h3 class="section-title">Description</h3>
    <div class="section-content">
      <p class="description-text">{{ node.description }}</p>
    </div>
  </section>
  
  <section class="content-section" *ngIf="node.effects.length > 0">
    <h3 class="section-title">Effects</h3>
    <div class="section-content">
      <ul class="effects-list">
        <li 
          *ngFor="let effect of node.effects" 
          class="effect-item">
          {{ effect }}
        </li>
      </ul>
    </div>
  </section>
  
  <section class="content-section" *ngIf="node.prerequisites.length > 0">
    <h3 class="section-title">Prerequisites</h3>
    <div class="section-content">
      <ul class="prerequisites-list">
        <li 
          *ngFor="let prereq of node.prerequisites" 
          class="prerequisite-item">
          {{ prereq }}
        </li>
      </ul>
    </div>
  </section>
  
  <section class="metadata-section">
    <h3 class="section-title">Details</h3>
    <div class="metadata-grid">
      <div class="metadata-item">
        <span class="label">Tier</span>
        <span class="value">{{ node.tier }}</span>
      </div>
      <div class="metadata-item">
        <span class="label">Cost</span>
        <span class="value">{{ node.cost }}</span>
      </div>
      <div class="metadata-item">
        <span class="label">Category</span>
        <span class="value">{{ node.category }}</span>
      </div>
      <div class="metadata-item">
        <span class="label">Duration</span>
        <span class="value">{{ node.duration }}</span>
      </div>
    </div>
  </section>
  
  <section 
    *ngIf="validation" 
    class="validation-section"
    [ngClass]="'validation-' + validation.severity">
    <strong>{{ validation.title }}</strong>
    <p>{{ validation.message }}</p>
  </section>
</div>
```

---

## 3. Preview Dialog Component

### SCSS Implementation
```scss
// preview-dialog.component.scss
@import 'design-system/typography-tokens';

.preview-dialog {
  @include sdk-panel;
  padding: var(--sdk-spacing-xl);
  max-width: 600px;
  margin: 0 auto;
  
  // Dialog header
  .dialog-header {
    @extend %ds-heading-3;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--sdk-spacing-lg);
    padding-bottom: var(--sdk-spacing-md);
    border-bottom: 1px solid var(--sdk-border-subtle);
    
    .dialog-title {
      @extend %ds-heading-3;
    }
    
    .close-button {
      @extend %sdk-button-base;
      background: var(--sdk-bg-button-secondary);
      border: 1px solid var(--sdk-border-medium);
      padding: var(--sdk-spacing-sm);
      min-width: auto;
    }
  }
  
  // Dialog content
  .dialog-content {
    .preview-section {
      margin-bottom: var(--sdk-spacing-lg);
      
      .section-title {
        @extend %ds-heading-4;
        margin-bottom: var(--sdk-spacing-sm);
      }
      
      .preview-node {
        @include sdk-panel;
        padding: var(--sdk-spacing-lg);
        
        .node-title {
          @extend %ds-node-title;
          margin-bottom: var(--sdk-spacing-sm);
        }
        
        .node-description {
          @extend %ds-node-description;
          margin-bottom: var(--sdk-spacing-md);
        }
        
        .node-preview-meta {
          @extend %ds-node-meta;
          display: flex;
          gap: var(--sdk-spacing-md);
        }
      }
    }
    
    // Validation preview
    .validation-preview {
      @extend %ds-validation;
      margin-top: var(--sdk-spacing-lg);
      padding: var(--sdk-spacing-md);
      border-radius: var(--sdk-border-radius-sm);
    }
  }
  
  // Dialog footer
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--sdk-spacing-md);
    margin-top: var(--sdk-spacing-xl);
    padding-top: var(--sdk-spacing-lg);
    border-top: 1px solid var(--sdk-border-subtle);
    
    .footer-button {
      @extend %sdk-button-base;
      
      &.primary {
        background: var(--sdk-bg-button-primary);
        color: var(--sdk-text-primary);
      }
      
      &.secondary {
        background: var(--sdk-bg-button-secondary);
        color: var(--sdk-text-secondary);
      }
    }
  }
}
```

---

## 4. Icon Picker Component

### SCSS Implementation
```scss
// icon-picker.component.scss
@import 'design-system/typography-tokens';

.icon-picker {
  @include sdk-panel;
  padding: var(--sdk-spacing-lg);
  
  // Picker header
  .picker-header {
    margin-bottom: var(--sdk-spacing-lg);
    
    .picker-title {
      @extend %ds-heading-3;
      margin-bottom: var(--sdk-spacing-md);
    }
    
    .search-container {
      .search-input {
        @extend %sdk-form-input;
        width: 100%;
        @extend %ds-body;
      }
      
      .search-placeholder {
        @extend %ds-body-small;
        color: var(--sdk-text-muted);
      }
    }
  }
  
  // Category filters
  .category-filters {
    margin-bottom: var(--sdk-spacing-lg);
    
    .filter-label {
      @extend %ds-icon-label;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: var(--sdk-spacing-sm);
    }
    
    .filter-tabs {
      display: flex;
      gap: var(--sdk-spacing-xs);
      flex-wrap: wrap;
      
      .filter-tab {
        @extend %sdk-tab;
        padding: var(--sdk-spacing-xs) var(--sdk-spacing-sm);
        background: var(--sdk-bg-button-secondary);
        border: 1px solid var(--sdk-border-medium);
        
        &.active {
          background: var(--sdk-bg-button-primary);
          border-color: var(--sdk-border-primary);
        }
      }
    }
  }
  
  // Icon grid
  .icon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: var(--sdk-spacing-md);
    
    .icon-item {
      @include sdk-pixel-align;
      @include sdk-focus-state;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: var(--sdk-spacing-md);
      background: var(--sdk-bg-subtle);
      border: 1px solid var(--sdk-border-subtle);
      border-radius: var(--sdk-border-radius-sm);
      cursor: pointer;
      transition: background-color var(--sdk-transition-fast);
      
      &:hover {
        background: var(--sdk-bg-secondary);
      }
      
      &:focus {
        outline: 2px solid var(--sdk-accent-primary);
        outline-offset: 2px;
      }
      
      .icon-symbol {
        font-size: 24px;
        margin-bottom: var(--sdk-spacing-sm);
      }
      
      .icon-label {
        @extend %ds-icon-label;
        text-align: center;
        line-height: var(--ds-line-height-tight);
      }
      
      .icon-category {
        @extend %ds-caption;
        text-align: center;
        margin-top: var(--sdk-spacing-xs);
      }
    }
  }
  
  // Results info
  .results-info {
    @extend %ds-body-small;
    color: var(--sdk-text-muted);
    text-align: center;
    margin-top: var(--sdk-spacing-lg);
    padding: var(--sdk-spacing-md);
    background: var(--sdk-bg-subtle);
    border-radius: var(--sdk-border-radius-sm);
  }
}
```

---

## 5. Validation Components

### Validation Notice Integration
```scss
// validation-notice.component.scss
@import 'design-system/typography-tokens';

.validation-notice {
  @extend %validation-notice-base;
  @include sdk-pixel-align;
  
  .validation-notice__content {
    .validation-notice__message {
      @extend %ds-validation;
      font-weight: var(--ds-font-weight-medium);
    }
    
    .validation-notice__suggestion {
      @extend %ds-body-small;
      margin-top: var(--sdk-spacing-xs);
      opacity: 0.8;
    }
    
    .validation-notice__path {
      @extend %ds-code;
      margin-top: var(--sdk-spacing-xs);
      opacity: 0.6;
    }
  }
  
  // Severity variations
  &.error {
    @extend %validation-notice-error;
  }
  
  &.warning {
    @extend %validation-notice-warning;
  }
  
  &.info {
    @extend %validation-notice-info;
  }
}
```

### Validation Badge Integration
```scss
// validation-badge.component.scss
@import 'design-system/typography-tokens';

.validation-badge {
  @include sdk-pixel-align;
  
  &.error {
    @extend %validation-badge-error;
  }
  
  &.warning {
    @extend %validation-badge-warning;
  }
  
  &.info {
    @extend %validation-badge-info;
  }
  
  .badge-content {
    @extend %ds-body-tiny;
    font-weight: var(--ds-font-weight-bold);
    text-align: center;
    line-height: var(--validation-badge-size);
  }
}
```

---

## 6. Global Typography Integration

### Application-wide Setup
```scss
// app.component.scss
@import 'design-system/typography-tokens';

// Apply typography to root elements
* {
  font-family: var(--ds-font-family-base);
}

// Headings hierarchy
h1 { @extend %ds-heading-1; }
h2 { @extend %ds-heading-2; }
h3 { @extend %ds-heading-3; }
h4 { @extend %ds-heading-4; }
h5 { @extend %ds-heading-5; }

// Body text hierarchy
p, div, span { 
  &.large { @extend %ds-body-large; }
  &.normal { @extend %ds-body; }
  &.small { @extend %ds-body-small; }
  &.tiny { @extend %ds-body-tiny; }
}

// Tech tree specific
.tech-tree {
  .node-title { @extend %ds-node-title; }
  .node-description { @extend %ds-node-description; }
  .node-meta { @extend %ds-node-meta; }
  .validation { @extend %ds-validation; }
  .tooltip { @extend %ds-tooltip; }
  .caption { @extend %ds-caption; }
  .code { @extend %ds-code; }
}
```

---

## 7. Utility Classes

### Typography Utilities
```scss
// typography-utilities.scss
@import 'design-system/typography-tokens';

// Text alignment utilities
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }

// Text transformation utilities
.uppercase { text-transform: uppercase; }
.lowercase { text-transform: lowercase; }
.capitalize { text-transform: capitalize; }

// Font weight utilities
.font-light { font-weight: var(--ds-font-weight-light); }
.font-normal { font-weight: var(--ds-font-weight-normal); }
.font-medium { font-weight: var(--ds-font-weight-medium); }
.font-semibold { font-weight: var(--ds-font-weight-semibold); }
.font-bold { font-weight: var(--ds-font-weight-bold); }

// Line height utilities
.line-tight { line-height: var(--ds-line-height-tight); }
.line-normal { line-height: var(--ds-line-height-normal); }
.line-relaxed { line-height: var(--ds-line-height-relaxed); }

// Margin utilities for typography
.heading-margin { margin: var(--sdk-spacing-lg) 0 var(--sdk-spacing-md) 0; }
.body-margin { margin: var(--sdk-spacing-md) 0; }
.small-margin { margin: var(--sdk-spacing-sm) 0; }
```

---

## 8. Performance Optimization

### Critical Typography CSS
```scss
// critical-typography.scss (Inline critical styles)
@import 'design-system/typography-tokens';

// Critical above-the-fold typography
.tech-tree-header {
  @extend %ds-heading-1;
}

.tech-node {
  .node-title {
    @extend %ds-node-title;
  }
}
```

### Non-critical Typography Loading
```scss
// non-critical-typography.scss (Lazy load)
@import 'design-system/typography-tokens';

// Less critical typography
.preview-dialog {
  @extend %ds-heading-3;
}

.validation-notice {
  @extend %ds-validation;
}
```

---

## 9. Theme Integration

### Dark Theme (Default)
```scss
// theme-dark.scss
@import 'design-system/typography-tokens';

:root {
  // Dark theme typography colors
  --sdk-text-primary: #e8e0ff;
  --sdk-text-secondary: rgba(232, 224, 255, 0.85);
  --sdk-text-muted: rgba(232, 224, 255, 0.65);
}
```

### High Contrast Theme
```scss
// theme-high-contrast.scss
@import 'design-system/typography-tokens';

@media (prefers-contrast: high) {
  :root {
    --sdk-text-primary: #ffffff;
    --sdk-text-secondary: #ffffff;
    --sdk-text-muted: #ffffff;
    
    // Enhanced font weights
    --ds-font-weight-normal: 500;
    --ds-font-weight-medium: 600;
    --ds-font-weight-semibold: 700;
  }
}
```

---

## 10. Testing Examples

### Visual Regression Testing
```typescript
// typography.test.ts
import { TYPOGRAPHY_TOKENS } from 'design-system/typography.tokens';

describe('Typography Integration', () => {
  it('should apply correct font sizes to tech tree nodes', () => {
    const nodeTitle = document.querySelector('.node-title');
    expect(window.getComputedStyle(nodeTitle).fontSize).toBe(TYPOGRAPHY_TOKENS.nodeTitle.size);
  });
  
  it('should apply correct font weights to headings', () => {
    const heading = document.querySelector('h1');
    expect(window.getComputedStyle(heading).fontWeight).toBe(TYPOGRAPHY_TOKENS.heading1.weight.toString());
  });
});
```

---

This comprehensive integration guide ensures consistent typography implementation across all Tech Tree Editor components while maintaining accessibility standards and performance optimization.