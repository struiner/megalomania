# Design System Spacing Tokens Usage Guide

## Overview

The Design System Spacing Tokens provide a comprehensive spacing and layout system for the Tech Tree Editor. This system ensures visual consistency, predictable layout behavior, and optimal user experience across all components.

## Core Principles

### 1. Mathematical Consistency
- All spacing values follow a mathematical scale based on a 4px base unit
- Consistent increments provide visual harmony and predictable behavior
- Pixel-perfect alignment ensures crisp rendering

### 2. Density-Aware Design
- **Compact** (default): Maximum efficiency for large tech trees
- **Comfortable**: Balanced spacing for detailed editing
- **Spacious**: Enhanced spacing for presentations and demonstrations

### 3. Empty Space as Feature
- Strategic use of whitespace to improve readability
- Intentional spacing to guide user attention
- Breathing room that prevents visual clutter

## Import and Setup

### SCSS Import
```scss
// Import spacing tokens in your SCSS file
@import '~@/app/components/sdk/shared/design-system/spacing-tokens';

// Import spacing tokens with other design system tokens
@import '~@/app/components/sdk/shared/design-system/spacing-tokens';
@import '~@/app/components/sdk/shared/design-system/typography-tokens';
@import '~@/app/components/sdk/shared/design-system/color-tokens';
```

### TypeScript Import
```typescript
// Import spacing tokens and utilities
import { SPACING_TOKENS, SpacingUtils, ResponsiveSpacing } from '@/app/components/sdk/shared/design-system/spacing.tokens';
```

## Basic Spacing Tokens

### Base Scale
```scss
// CSS Custom Properties (recommended)
.my-component {
  padding: var(--ds-spacing-md);  // 12px
  margin: var(--ds-spacing-lg);   // 16px
  gap: var(--ds-spacing-sm);      // 8px
}

// SCSS Variables (alternative)
.my-component {
  padding: $spacing-md;  // 12px
  margin: $spacing-lg;   // 16px
  gap: $spacing-sm;      // 8px
}
```

```typescript
// TypeScript usage
const style = {
  padding: SPACING_TOKENS.md,
  margin: SPACING_TOKENS.lg,
  gap: SPACING_TOKENS.sm
};
```

### Available Spacing Values
| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Micro spacing, icon gaps |
| `sm` | 8px | Small spacing, tight layouts |
| `md` | 12px | Medium spacing, standard gaps |
| `lg` | 16px | Large spacing, comfortable breathing |
| `xl` | 24px | Extra large spacing, section breaks |
| `xxl` | 32px | Major section spacing |
| `xxxl` | 48px | Page-level spacing |
| `xxxxl` | 64px | Maximum spacing |

## Grid System Usage

### CSS Grid Implementation
```scss
// Basic grid container
.tech-tree-grid {
  @extend %ds-grid-container;
  // Results in: display: grid; grid-template-columns: repeat(12, 1fr); gap: 12px;
}

// Column spans
.tech-tree-node {
  @extend %ds-grid-column-3;  // Spans 3 columns
}

// Custom column span
.tech-tree-section {
  @include ds-grid-column(6);  // Spans 6 columns
}
```

```typescript
// TypeScript grid utilities
const gridStyle = {
  display: 'grid',
  gridTemplateColumns: `repeat(${SPACING_TOKENS.grid.columnCount}, 1fr)`,
  gap: SPACING_TOKENS.grid.gutterWidth,
  alignItems: 'start'
};

// Responsive grid columns
const responsiveGrid = ResponsiveSpacing.mobileFirst(
  'repeat(1, 1fr)',      // Mobile: 1 column
  'repeat(2, 1fr)',      // Tablet: 2 columns  
  'repeat(3, 1fr)'       // Desktop: 3 columns
);
```

### Container Usage
```scss
// Responsive container
.main-layout {
  @extend %ds-container-lg;  // Max-width: 1024px with auto margins
  
  // For custom container sizes:
  @include ds-container('xl');  // Max-width: 1280px
}

// Component container with custom padding
.component-section {
  @include ds-container('md');
  padding-top: var(--ds-spacing-xl);
  padding-bottom: var(--ds-spacing-xl);
}
```

## Density Management

### Applying Density Classes
```scss
// SCSS approach with mixins
.tech-tree-grid {
  &.compact {
    @include ds-density-compact;
  }
  
  &.comfortable {
    @include ds-density-comfortable;
  }
  
  &.spacious {
    @include ds-density-spacious;
  }
}
```

```scss
// CSS approach with utility classes
.tech-tree-grid.compact {
  @extend %ds-density-compact;
}

.tech-tree-grid.comfortable {
  @extend %ds-density-comfortable;
}

.tech-tree-grid.spacious {
  @extend %ds-density-spacious;
}
```

```typescript
// TypeScript density utilities
const getDensityStyles = (density: 'compact' | 'comfortable' | 'spacious') => {
  const spacing = ResponsiveSpacing.withDensity(density);
  
  return {
    rowGap: spacing.rowGap,
    columnGap: spacing.columnGap,
    padding: spacing.nodePadding,
    margin: SPACING_TOKENS.node.margin
  };
};
```

## Component-Specific Spacing

### Button Spacing
```scss
// Using utility classes
.button {
  @extend %ds-clickable;
  padding: var(--ds-spacing-button-padding-y) var(--ds-spacing-button-padding-x);
  gap: var(--ds-spacing-button-icon-gap);
  
  .icon {
    margin-right: var(--ds-spacing-button-icon-gap);
  }
}

// Using component tokens
.button-alt {
  padding: var(--ds-spacing-button-padding-y) var(--ds-spacing-button-padding-x);
  gap: var(--ds-spacing-button-icon-gap);
}
```

```typescript
// TypeScript button spacing
const buttonStyle = SpacingUtils.getSpacingForUseCase('button');
// Returns: { padding: '8px 12px', gap: '4px' }
```

### Card and Panel Spacing
```scss
.card {
  padding: var(--ds-spacing-card-padding);
  gap: var(--ds-spacing-card-gap);
  
  .card-header {
    margin-bottom: var(--ds-spacing-card-gap);
  }
  
  .card-content {
    > * + * {
      margin-top: var(--ds-spacing-card-gap);
    }
  }
}

.panel {
  padding: var(--ds-spacing-panel-padding);
  gap: var(--ds-spacing-panel-gap);
}
```

### Tech Tree Node Spacing
```scss
.tech-tree-node {
  margin: var(--ds-spacing-node-margin);
  padding: var(--ds-spacing-node-padding);
  border-radius: var(--ds-spacing-node-border-radius);
  
  .node-icon {
    margin-right: var(--ds-spacing-node-icon-gap);
  }
  
  .node-content {
    gap: var(--ds-spacing-xs);
  }
}

// Grid layout for nodes
.tech-tree-grid {
  gap: var(--ds-spacing-node-grid-gap);
}
```

```typescript
// TypeScript tech tree spacing
const nodeStyle = SpacingUtils.getSpacingForUseCase('node');
// Returns: { margin: '8px', padding: '12px', gap: '8px' }
```

## Responsive Spacing

### Mobile-First Approach
```scss
// Responsive padding
.responsive-component {
  padding: var(--ds-spacing-sm);  // Mobile default
  
  @include ds-breakpoint-up(md) {
    padding: var(--ds-spacing-md);  // Tablet and up
  }
  
  @include ds-breakpoint-up(lg) {
    padding: var(--ds-spacing-lg);  // Desktop and up
  }
}

// Responsive gaps
.responsive-grid {
  gap: var(--ds-spacing-xs);  // Mobile
  
  @include ds-breakpoint-up(md) {
    gap: var(--ds-spacing-sm);  // Tablet
  }
  
  @include ds-breakpoint-up(lg) {
    gap: var(--ds-spacing-md);  // Desktop
  }
}
```

```typescript
// TypeScript responsive utilities
const responsivePadding = ResponsiveSpacing.mobileFirst(
  SPACING_TOKENS.sm,  // Mobile: 8px
  SPACING_TOKENS.md,  // Tablet: 12px
  SPACING_TOKENS.lg   // Desktop: 16px
);

const responsiveGrid = SpacingUtils.getResponsiveGridColumns(1, 2, 3);
```

## Utility Classes Reference

### Spacing Utilities
```scss
// Margin utilities
.my-element {
  @extend %ds-margin-top-lg;
  @extend %ds-margin-bottom-md;
  @extend %ds-margin-left-sm;
  @extend %ds-margin-right-sm;
}

// Padding utilities
.my-element {
  @extend %ds-padding-top-md;
  @extend %ds-padding-bottom-md;
  @extend %ds-padding-left-lg;
  @extend %ds-padding-right-lg;
}

// Gap utilities
.flex-container {
  @extend %ds-gap-md;        // All gaps
}

.grid-container {
  @extend %ds-row-gap-sm;    // Row gaps only
  @extend %ds-column-gap-md; // Column gaps only
}
```

### Container and Grid Utilities
```scss
// Container utilities
.main-container {
  @extend %ds-container-lg;
}

.sidebar-container {
  @extend %ds-container-sm;
}

// Grid utilities
.full-width {
  @extend %ds-grid-column-12;
}

.half-width {
  @extend %ds-grid-column-6;
}

.third-width {
  @extend %ds-grid-column-4;
}
```

## Best Practices

### 1. Use Design System Tokens
```scss
// ✅ Good - Uses design system tokens
.component {
  padding: var(--ds-spacing-md);
  gap: var(--ds-spacing-sm);
}

// ❌ Bad - Hard-coded values
.component {
  padding: 12px;
  gap: 8px;
}
```

### 2. Apply Density Consistently
```scss
// ✅ Good - Consistent density application
.tech-tree-grid {
  @include ds-density-compact;
  
  .tech-tree-node {
    padding: var(--ds-node-padding);
  }
}

// ❌ Bad - Inconsistent spacing
.tech-tree-grid {
  .tech-tree-node {
    padding: 8px;  // Should use density tokens
  }
}
```

### 3. Respect Breakpoints
```scss
// ✅ Good - Responsive spacing
.responsive-component {
  gap: var(--ds-spacing-xs);  // Mobile
  
  @include ds-breakpoint-up(md) {
    gap: var(--ds-spacing-sm);  // Tablet
  }
}

// ❌ Bad - Fixed spacing everywhere
.responsive-component {
  gap: var(--ds-spacing-sm);
}
```

### 4. Use Semantic Naming
```scss
// ✅ Good - Semantic spacing names
.validation-message {
  margin-top: var(--ds-spacing-validation-gap);
  padding: var(--ds-spacing-validation-padding);
}

// ❌ Bad - Generic spacing names
.validation-message {
  margin-top: var(--ds-spacing-sm);
  padding: var(--ds-spacing-xs);
}
```

### 5. Maintain Vertical Rhythm
```scss
// ✅ Good - Consistent vertical rhythm
.content-section {
  margin-bottom: var(--ds-spacing-rhythm-loose);
  
  .subsection {
    margin-bottom: var(--ds-spacing-rhythm-normal);
  }
  
  .sub-subsection {
    margin-bottom: var(--ds-spacing-rhythm-tight);
  }
}
```

## Common Patterns

### Form Layout
```scss
.form-group {
  margin-bottom: var(--ds-spacing-lg);
  
  .form-label {
    margin-bottom: var(--ds-spacing-sm);
  }
  
  .form-input {
    margin-bottom: var(--ds-spacing-xs);
  }
  
  .form-error {
    margin-top: var(--ds-spacing-xs);
    padding: var(--ds-spacing-validation-padding);
  }
}
```

### Card Layout
```scss
.card {
  padding: var(--ds-spacing-card-padding);
  margin-bottom: var(--ds-spacing-md);
  
  .card-header {
    margin-bottom: var(--ds-spacing-card-gap);
    padding-bottom: var(--ds-spacing-sm);
  }
  
  .card-content {
    > * + * {
      margin-top: var(--ds-spacing-card-gap);
    }
  }
  
  .card-footer {
    margin-top: var(--ds-spacing-card-gap);
    padding-top: var(--ds-spacing-sm);
  }
}
```

### Tech Tree Grid Layout
```scss
.tech-tree-grid {
  @include ds-grid-container;
  @include ds-density-compact;
  
  .tech-tree-node {
    margin: var(--ds-spacing-node-margin);
    padding: var(--ds-spacing-node-padding);
    
    &.selected {
      margin: var(--ds-spacing-xs);  // Reduced margin for selection
    }
  }
}
```

## Troubleshooting

### Common Issues

1. **Spacing not applying**
   - Ensure SCSS tokens are imported
   - Check CSS custom property support
   - Verify class names match exactly

2. **Responsive spacing not working**
   - Check breakpoint mixin usage
   - Ensure media queries are properly structured
   - Verify TypeScript responsive utilities syntax

3. **Grid layout issues**
   - Confirm grid container is properly set up
   - Check column span calculations
   - Ensure grid gaps are applied correctly

4. **Density not changing**
   - Verify density mixins are applied to correct elements
   - Check CSS custom property overrides
   - Ensure component supports density changes

### Performance Considerations

1. **CSS Custom Properties**: Use for theming and dynamic spacing
2. **SCSS Variables**: Use for static, compile-time spacing
3. **Utility Classes**: Use for rapid development and consistency
4. **TypeScript Utilities**: Use for runtime spacing calculations

## Integration with Other Systems

### With Angular Flex Layout
```scss
// Flex layout with design system spacing
.flex-container {
  display: flex;
  gap: var(--ds-spacing-md);
  padding: var(--ds-spacing-panel-padding);
}
```

### With CSS Grid
```scss
// CSS Grid with design system tokens
.grid-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--ds-spacing-grid-gutter);
  padding: var(--ds-spacing-container);
}
```

### With Animation Systems
```scss
// Smooth spacing transitions
.animated-layout {
  transition: gap 0.2s ease, padding 0.2s ease;
  
  &:hover {
    gap: var(--ds-spacing-lg);  // Expands on hover
  }
}
```

This spacing system provides a solid foundation for consistent, accessible, and responsive layouts throughout the Tech Tree Editor.