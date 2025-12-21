# Design System Spacing Tokens Integration Examples

## Overview

This document provides practical integration examples for the Design System Spacing & Layout Tokens across various Tech Tree Editor components and use cases. Each example demonstrates real-world implementation patterns that combine spacing tokens with other design system elements.

## Integration with Typography Tokens

### Heading and Content Spacing
```scss
// Combined typography and spacing usage
.section-header {
  @extend %ds-heading-2;
  margin-bottom: var(--ds-spacing-rhythm-loose);  // 16px
  
  + .section-content {
    margin-top: var(--ds-spacing-rhythm-normal);  // 12px
  }
}

.section-content {
  @extend %ds-body;
  margin-bottom: var(--ds-spacing-rhythm-tight);  // 8px
  
  p + p {
    margin-top: var(--ds-spacing-rhythm-tight);   // 8px
  }
  
  .highlight {
    @extend %ds-body-small;
    margin: var(--ds-spacing-sm) 0;               // 8px top/bottom
  }
}
```

```typescript
// TypeScript integration with typography
import { SPACING_TOKENS, TYPOGRAPHY_TOKENS } from '@/app/components/sdk/shared/design-system';

const createSectionStyles = () => {
  return {
    header: {
      marginBottom: SPACING_TOKENS.rhythm.loose,
      fontSize: TYPOGRAPHY_TOKENS.heading2.size,
      fontWeight: TYPOGRAPHY_TOKENS.heading2.weight
    },
    content: {
      marginBottom: SPACING_TOKENS.rhythm.tight,
      fontSize: TYPOGRAPHY_TOKENS.body.size,
      lineHeight: TYPOGRAPHY_TOKENS.body.lineHeight
    }
  };
};
```

### Tech Tree Node with Typography
```scss
.tech-tree-node {
  padding: var(--ds-spacing-node-padding);
  margin: var(--ds-spacing-node-margin);
  border-radius: var(--ds-spacing-node-border-radius);
  
  .node-header {
    @extend %ds-node-title;
    margin-bottom: var(--ds-spacing-xs);  // 4px
  }
  
  .node-description {
    @extend %ds-node-description;
    margin-bottom: var(--ds-spacing-sm);  // 8px
  }
  
  .node-meta {
    @extend %ds-node-meta;
    margin-top: var(--ds-spacing-xs);     // 4px
  }
  
  .node-icon {
    margin-right: var(--ds-spacing-node-icon-gap);  // 4px
  }
}
```

## Integration with Color Tokens

### Status-Based Spacing
```scss
// Spacing variations based on color states
.node-status {
  &.available {
    padding: var(--ds-spacing-node-padding);
    border: 2px solid var(--ds-color-node-available);
    
    &:hover {
      padding: var(--ds-spacing-node-padding);  // Maintains consistent padding
      border-width: 3px;  // Enhances border without affecting layout
    }
  }
  
  &.locked {
    padding: var(--ds-spacing-node-padding);
    border: 1px solid var(--ds-color-node-locked);
    opacity: 0.8;
    
    // Reduced visual weight, maintains accessibility
    .node-icon {
      margin-right: var(--ds-spacing-node-icon-gap);  // Still accessible
    }
  }
  
  &.error {
    padding: calc(var(--ds-spacing-node-padding) + var(--ds-spacing-xs));  // 16px for emphasis
    border: 2px solid var(--ds-color-node-error);
    
    .error-message {
      margin-top: var(--ds-spacing-validation-gap);  // 4px
      padding: var(--ds-spacing-validation-padding); // 8px
    }
  }
}
```

### Validation Feedback Spacing
```scss
.validation-container {
  padding: var(--ds-spacing-validation-padding);
  margin: var(--ds-spacing-sm) 0;
  
  &.error {
    border-left: 4px solid var(--ds-color-error);
    padding-left: var(--ds-spacing-md);  // Accounts for border
  }
  
  &.warning {
    border-left: 4px solid var(--ds-color-warning);
    padding-left: var(--ds-spacing-md);
  }
  
  &.success {
    border-left: 4px solid var(--ds-color-success);
    padding-left: var(--ds-spacing-md);
  }
  
  .validation-icon {
    margin-right: var(--ds-spacing-validation-gap);
    width: var(--ds-spacing-validation-icon-size);
    height: var(--ds-spacing-validation-icon-size);
  }
}
```

## Angular Component Integration

### Tech Tree Node Component
```typescript
// tech-tree-node.component.ts
import { Component, Input } from '@angular/core';
import { SPACING_TOKENS, SpacingUtils } from '@/app/components/sdk/shared/design-system';

@Component({
  selector: 'app-tech-tree-node',
  template: `
    <div class="tech-tree-node" 
         [class]="getNodeClasses()"
         [style]="getNodeStyles()">
      <div class="node-icon" *ngIf="icon">
        <img [src]="icon" [alt]="iconAlt">
      </div>
      <div class="node-content">
        <h3 class="node-header">{{ title }}</h3>
        <p class="node-description" *ngIf="description">{{ description }}</p>
        <span class="node-meta" *ngIf="meta">{{ meta }}</span>
      </div>
    </div>
  `,
  styleUrls: ['./tech-tree-node.component.scss']
})
export class TechTreeNodeComponent {
  @Input() title: string;
  @Input() description?: string;
  @Input() icon?: string;
  @Input() iconAlt?: string;
  @Input() meta?: string;
  @Input() status: 'available' | 'locked' | 'researching' | 'complete' | 'error' = 'locked';
  @Input() density: 'compact' | 'comfortable' | 'spacious' = 'compact';

  getNodeStyles() {
    const spacing = SpacingUtils.getDensitySpacing(this.density);
    return {
      padding: spacing.nodePadding,
      margin: SPACING_TOKENS.node.margin,
      rowGap: spacing.rowGap,
      columnGap: spacing.columnGap
    };
  }

  getNodeClasses() {
    return [
      'tech-tree-node',
      `tech-tree-node--${this.status}`,
      `tech-tree-node--${this.density}`
    ];
  }
}
```

```scss
// tech-tree-node.component.scss
@import '@/app/components/sdk/shared/design-system/spacing-tokens';

.tech-tree-node {
  display: flex;
  gap: var(--ds-spacing-node-icon-gap);
  border-radius: var(--ds-spacing-node-border-radius);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .node-icon {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
  }
  
  .node-content {
    flex: 1;
    min-width: 0;  // Allows text truncation
  }
  
  // Density variations
  &.tech-tree-node--compact {
    @include ds-density-compact;
  }
  
  &.tech-tree-node--comfortable {
    @include ds-density-comfortable;
  }
  
  &.tech-tree-node--spacious {
    @include ds-density-spacious;
  }
}
```

### Node Detail Panel Component
```typescript
// node-detail-panel.component.ts
import { Component, Input } from '@angular/core';
import { SPACING_TOKENS } from '@/app/components/sdk/shared/design-system';

@Component({
  selector: 'app-node-detail-panel',
  template: `
    <div class="node-detail-panel">
      <header class="panel-header">
        <h2 class="panel-title">{{ node?.title }}</h2>
        <button class="close-button" (click)="close()">×</button>
      </header>
      
      <div class="panel-content">
        <section class="description-section" *ngIf="node?.description">
          <h3>Description</h3>
          <p>{{ node.description }}</p>
        </section>
        
        <section class="effects-section" *ngIf="node?.effects?.length">
          <h3>Effects</h3>
          <ul class="effects-list">
            <li *ngFor="let effect of node.effects" class="effect-item">
              {{ effect }}
            </li>
          </ul>
        </section>
        
        <section class="prerequisites-section" *ngIf="node?.prerequisites?.length">
          <h3>Prerequisites</h3>
          <ul class="prerequisites-list">
            <li *ngFor="let prereq of node.prerequisites" class="prerequisite-item">
              {{ prereq.name }}
            </li>
          </ul>
        </section>
      </div>
      
      <footer class="panel-footer">
        <button class="btn btn-primary" (click)="research()">Research</button>
        <button class="btn btn-secondary" (click)="cancel()">Cancel</button>
      </footer>
    </div>
  `,
  styleUrls: ['./node-detail-panel.component.scss']
})
export class NodeDetailPanelComponent {
  @Input() node: any;
  
  panelStyles = {
    padding: SPACING_TOKENS.detail.padding,
    sectionGap: SPACING_TOKENS.detail.sectionGap,
    fieldGap: SPACING_TOKENS.detail.fieldGap
  };
}
```

```scss
// node-detail-panel.component.scss
@import '@/app/components/sdk/shared/design-system/spacing-tokens';
@import '@/app/components/sdk/shared/design-system/typography-tokens';
@import '@/app/components/sdk/shared/design-system/color-tokens';

.node-detail-panel {
  @extend %ds-container-sm;
  background: var(--ds-color-surface-raised);
  border-radius: var(--ds-spacing-node-border-radius);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  
  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: var(--ds-spacing-md);
    margin-bottom: var(--ds-spacing-detail-section-gap);
    border-bottom: 1px solid var(--ds-color-border-primary);
    
    .panel-title {
      @extend %ds-heading-2;
      margin: 0;
    }
    
    .close-button {
      padding: var(--ds-spacing-xs);
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 24px;
      line-height: 1;
    }
  }
  
  .panel-content {
    > section {
      margin-bottom: var(--ds-spacing-detail-section-gap);
      
      > h3 {
        @extend %ds-heading-5;
        margin-bottom: var(--ds-spacing-detail-field-gap);
      }
      
      > p {
        @extend %ds-body;
        margin: 0;
      }
    }
  }
  
  .effects-list,
  .prerequisites-list {
    list-style: none;
    padding: 0;
    margin: 0;
    
    .effect-item,
    .prerequisite-item {
      padding: var(--ds-spacing-sm) 0;
      border-bottom: 1px solid var(--ds-color-border-secondary);
      
      &:last-child {
        border-bottom: none;
      }
    }
  }
  
  .panel-footer {
    display: flex;
    gap: var(--ds-spacing-md);
    justify-content: flex-end;
    padding-top: var(--ds-spacing-lg);
    margin-top: var(--ds-spacing-detail-section-gap);
    border-top: 1px solid var(--ds-color-border-primary);
    
    .btn {
      padding: var(--ds-spacing-button-padding-y) var(--ds-spacing-button-padding-x);
      border-radius: var(--ds-spacing-node-border-radius);
      cursor: pointer;
      transition: all 0.2s ease;
      
      &.btn-primary {
        background: var(--ds-color-primary);
        color: var(--ds-color-text-inverse);
        border: 1px solid var(--ds-color-primary-dark);
        
        &:hover {
          background: var(--ds-color-primary-dark);
          transform: translateY(-1px);
        }
      }
      
      &.btn-secondary {
        background: transparent;
        color: var(--ds-color-text-primary);
        border: 1px solid var(--ds-color-border-primary);
        
        &:hover {
          background: var(--ds-color-hover);
        }
      }
    }
  }
}
```

## Responsive Design Integration

### Mobile-First Grid Layout
```scss
// Responsive grid with spacing tokens
.tech-tree-editor {
  @include ds-grid-container;
  padding: var(--ds-spacing-sm);  // Mobile padding
  
  @include ds-breakpoint-up(md) {
    padding: var(--ds-spacing-md);  // Tablet padding
  }
  
  @include ds-breakpoint-up(lg) {
    padding: var(--ds-spacing-lg);  // Desktop padding
  }
  
  .tech-tree-grid {
    // Mobile: Single column
    grid-template-columns: 1fr;
    gap: var(--ds-spacing-node-grid-gap);  // 8px
    
    @include ds-breakpoint-up(md) {
      // Tablet: 2 columns
      grid-template-columns: repeat(2, 1fr);
      gap: var(--ds-spacing-node-grid-gap);  // Maintain consistent gap
    }
    
    @include ds-breakpoint-up(lg) {
      // Desktop: 3-4 columns based on available space
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--ds-spacing-node-grid-gap);
    }
    
    @include ds-breakpoint-up(xl) {
      // Large desktop: 4-5 columns
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: var(--ds-spacing-node-grid-gap);
    }
  }
}
```

### Density Switching Implementation
```scss
// Density-aware component layout
.density-switcher {
  display: flex;
  gap: var(--ds-spacing-sm);
  padding: var(--ds-spacing-sm);
  background: var(--ds-color-background-secondary);
  border-radius: var(--ds-spacing-node-border-radius);
  
  .density-button {
    padding: var(--ds-spacing-xs) var(--ds-spacing-sm);
    border: 1px solid var(--ds-color-border-primary);
    background: transparent;
    border-radius: var(--ds-spacing-xs);
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: var(--ds-color-hover);
    }
    
    &.active {
      background: var(--ds-color-primary);
      color: var(--ds-color-text-inverse);
      border-color: var(--ds-color-primary);
    }
  }
}

.tech-tree-container {
  // Density transitions
  transition: gap 0.3s ease, padding 0.3s ease;
  
  &.density-compact {
    @include ds-density-compact;
  }
  
  &.density-comfortable {
    @include ds-density-comfortable;
  }
  
  &.density-spacious {
    @include ds-density-spacious;
  }
}
```

```typescript
// Responsive spacing utilities
import { SPACING_TOKENS, ResponsiveSpacing } from '@/app/components/sdk/shared/design-system';

export class ResponsiveLayoutService {
  
  getContainerStyles() {
    return ResponsiveSpacing.mobileFirst(
      SPACING_TOKENS.sm,  // Mobile: 8px
      SPACING_TOKENS.md,  // Tablet: 12px
      SPACING_TOKENS.lg   // Desktop: 16px
    );
  }
  
  getGridColumns() {
    return ResponsiveSpacing.mobileFirst(1, 2, 3);
  }
  
  getNodeSpacing(density: 'compact' | 'comfortable' | 'spacious') {
    return ResponsiveSpacing.withDensity(density);
  }
  
  getTouchOptimizedSpacing(baseSpacing: string) {
    return ResponsiveSpacing.touchOptimized(baseSpacing);
  }
}
```

## Animation and Transition Integration

### Smooth Density Transitions
```scss
// Animated density changes
.tech-tree-grid {
  transition: 
    gap 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    padding 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    margin 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  // Ensure smooth transitions for all density modes
  &.density-compact,
  &.density-comfortable,
  &.density-spacious {
    transition: 
      gap 0.4s cubic-bezier(0.4, 0, 0.2, 1),
      padding 0.4s cubic-bezier(0.4, 0, 0.2, 1),
      margin 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .tech-tree-node {
    transition: 
      padding 0.3s ease,
      margin 0.3s ease,
      transform 0.2s ease;
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .tech-tree-grid,
  .tech-tree-node {
    transition: none !important;
  }
}
```

### Staggered Layout Animations
```scss
// Staggered node appearance
.tech-tree-grid {
  .tech-tree-node {
    opacity: 0;
    transform: translateY(20px);
    animation: nodeFadeIn 0.6s ease forwards;
    
    @for $i from 1 through 20 {
      &:nth-child(#{$i}) {
        animation-delay: #{$i * 0.1}s;
      }
    }
  }
}

@keyframes nodeFadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Respect reduced motion
@media (prefers-reduced-motion: reduce) {
  .tech-tree-grid .tech-tree-node {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
```

## Performance Optimization Examples

### Critical CSS Optimization
```scss
// Above-the-fold critical spacing
.critical-spacing {
  // Inline critical spacing tokens
  padding: var(--ds-spacing-panel-padding, 24px);
  margin: var(--ds-spacing-node-margin, 8px);
  gap: var(--ds-spacing-sm, 8px);
}

// Non-critical spacing loaded later
.non-critical-spacing {
  // These can be loaded with component-specific CSS
  .tech-tree-grid {
    gap: var(--ds-spacing-node-grid-gap, 8px);
  }
  
  .node-detail-panel {
    .section-gap {
      gap: var(--ds-spacing-detail-section-gap, 24px);
    }
  }
}
```

### Runtime Performance
```typescript
// Efficient spacing calculations
import { SpacingUtils, SPACING_TOKENS } from '@/app/components/sdk/shared/design-system';

export class SpacingPerformanceService {
  
  // Cache frequently used spacing values
  private spacingCache = new Map<string, string>();
  
  getSpacing(size: string): string {
    if (!this.spacingCache.has(size)) {
      this.spacingCache.set(size, SPACING_TOKENS[size as keyof typeof SPACING_TOKENS]);
    }
    return this.spacingCache.get(size)!;
  }
  
  // Pre-calculate responsive spacing
  getResponsiveSpacing() {
    return {
      mobile: SPACING_TOKENS.sm,
      tablet: SPACING_TOKENS.md,
      desktop: SPACING_TOKENS.lg
    };
  }
  
  // Batch spacing applications
  applyBatchSpacing(element: HTMLElement, spacingConfig: any) {
    requestAnimationFrame(() => {
      Object.assign(element.style, {
        padding: spacingConfig.padding,
        margin: spacingConfig.margin,
        gap: spacingConfig.gap
      });
    });
  }
}
```

## Testing Integration Examples

### Component Testing with Spacing
```typescript
// tech-tree-node.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TechTreeNodeComponent } from './tech-tree-node.component';
import { SPACING_TOKENS } from '@/app/components/sdk/shared/design-system';

describe('TechTreeNodeComponent', () => {
  let component: TechTreeNodeComponent;
  let fixture: ComponentFixture<TechTreeNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechTreeNodeComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechTreeNodeComponent);
    component = fixture.componentInstance;
    component.title = 'Test Node';
    component.description = 'Test Description';
  });

  it('should apply correct spacing based on density', () => {
    component.density = 'compact';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const nodeElement = compiled.querySelector('.tech-tree-node');
    
    expect(nodeElement.style.padding).toBe(SPACING_TOKENS.density.compact.nodePadding);
    expect(nodeElement.style.margin).toBe(SPACING_TOKENS.node.margin);
  });

  it('should maintain accessibility spacing in error state', () => {
    component.status = 'error';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const nodeElement = compiled.querySelector('.tech-tree-node');
    
    // Verify minimum touch target size is maintained
    const computedStyle = window.getComputedStyle(nodeElement);
    const minHeight = parseInt(computedStyle.minHeight) || parseInt(computedStyle.height);
    expect(minHeight).toBeGreaterThanOrEqual(44); // WCAG touch target minimum
  });
});
```

### Visual Regression Testing
```scss
// Snapshot testing considerations
.tech-tree-node {
  // Ensure consistent spacing for screenshot testing
  padding: var(--ds-spacing-node-padding);
  margin: var(--ds-spacing-node-margin);
  
  // Fixed dimensions for consistent snapshots
  min-width: 200px;
  min-height: 80px;
}

// Test different density modes
.tech-tree-node--compact { /* Compact spacing */ }
.tech-tree-node--comfortable { /* Comfortable spacing */ }
.tech-tree-node--spacious { /* Spacious spacing */ }
```

## Advanced Integration Patterns

### Dynamic Theme Switching
```scss
// Theme-aware spacing
[data-theme="dark"] {
  .tech-tree-node {
    // Enhanced spacing for dark theme visual clarity
    padding: calc(var(--ds-spacing-node-padding) + var(--ds-spacing-xs));
    margin: calc(var(--ds-spacing-node-margin) + var(--ds-spacing-xs));
  }
}

[data-theme="high-contrast"] {
  .tech-tree-node {
    // Maximum spacing for accessibility
    padding: var(--ds-spacing-lg);
    margin: var(--ds-spacing-md);
    border-width: 2px;
  }
}
```

### Dynamic Content Adaptation
```typescript
// Content-aware spacing adjustments
export class AdaptiveSpacingService {
  
  adjustSpacingForContentLength(content: string, baseSpacing: string): string {
    const length = content.length;
    const baseValue = SpacingUtils.getNumericValue(baseSpacing);
    
    // Increase spacing for longer content
    if (length > 100) {
      return SpacingUtils.addSpacing(baseSpacing, SPACING_TOKENS.xs);
    }
    
    return baseSpacing;
  }
  
  adaptNodeSpacing(nodes: any[], density: 'compact' | 'comfortable' | 'spacious'): any {
    const spacing = ResponsiveSpacing.withDensity(density);
    
    // Adapt spacing based on node count
    if (nodes.length > 50 && density === 'compact') {
      // Increase gaps for large node sets to prevent crowding
      return {
        ...spacing,
        rowGap: SpacingUtils.addSpacing(spacing.rowGap, SPACING_TOKENS.xs),
        columnGap: SpacingUtils.addSpacing(spacing.columnGap, SPACING_TOKENS.xs)
      };
    }
    
    return spacing;
  }
}
```

## Best Practices Summary

### Integration Guidelines
1. **Always use design system tokens** instead of hard-coded values
2. **Combine spacing with typography and color tokens** for cohesive design
3. **Test responsive behavior** across all breakpoints and density modes
4. **Validate accessibility** including touch targets and screen readers
5. **Optimize performance** by caching frequently used spacing values
6. **Document spacing decisions** for future maintenance and updates

### Common Patterns
- **Consistent vertical rhythm** using rhythm tokens
- **Responsive spacing** with mobile-first approach
- **Density-aware components** supporting user preferences
- **Accessibility enhancement** with automatic touch target sizing
- **Performance optimization** with critical CSS and caching

This comprehensive integration guide ensures spacing tokens work seamlessly across all Tech Tree Editor components while maintaining accessibility, performance, and visual consistency.