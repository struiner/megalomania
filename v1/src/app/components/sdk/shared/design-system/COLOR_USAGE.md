# Design System Color Usage Guidelines

## Overview

This document defines the comprehensive usage guidelines for the Design System Color Tokens, ensuring consistent color application across all Tech Tree Editor components while maintaining accessibility and adhering to the UI & Ergonomics Charter principles.

**Core Principle:** Color is a **secondary signal**, never the sole meaning carrier. Always pair color with icons, text, or structural indicators.

## Color Philosophy

### Hanseatic Fantasy Aesthetic
Our color palette reflects a **Hanseatic merchant theme** with:
- **Warm, earthy tones** that evoke leather, wood, and aged materials
- **Golden accents** representing prosperity, trade, and achievement
- **Muted sophistication** that supports the retro pixel heritage
- **Functional hierarchy** where color guides attention without overwhelming

### Retro Pixel Heritage
- Colors align to the pixel grid for crisp rendering
- High contrast ratios ensure readability at all scales
- Color combinations respect the 16-bit era aesthetic
- Subtle gradients and opacity changes maintain pixel integrity

## Color Categories

### 1. Primary Colors
**Usage:** Main brand elements, primary actions, key navigation

- `--ds-color-primary` (#8b4513) - Saddle brown for leather/wood feel
- `--ds-color-primary-light` (#cd853f) - Peru for hover states
- `--ds-color-primary-dark` (#654321) - Dark brown for active/pressed states

**Applications:**
- Primary buttons and call-to-action elements
- Main navigation highlights
- Key interactive elements
- Brand accent elements

### 2. Secondary Colors
**Usage:** Secondary actions, achievements, positive feedback

- `--ds-color-secondary` (#daa520) - Goldenrod for prosperity
- `--ds-color-secondary-light` (#ffd700) - Gold for emphasis
- `--ds-color-secondary-dark` (#b8860b) - Dark goldenrod for depth

**Applications:**
- Secondary buttons
- Achievement indicators
- Success states and completions
- Prosperity/trade-related UI elements

### 3. Neutral Colors
**Usage:** Text hierarchy, backgrounds, borders, disabled states

**Text Hierarchy:**
- `--ds-color-text-primary` (#202020) - Primary content, headings
- `--ds-color-text-secondary` (#606060) - Secondary content, descriptions
- `--ds-color-text-muted` (#808080) - Meta information, timestamps
- `--ds-color-text-disabled` (#a0a0a0) - Disabled content
- `--ds-color-text-inverse` (#ffffff) - Text on dark backgrounds

**Background Hierarchy:**
- `--ds-color-background-primary` (#ffffff) - Main backgrounds
- `--ds-color-background-secondary` (#f8f8f8) - Panel backgrounds
- `--ds-color-background-tertiary` (#f0f0f0) - Section backgrounds
- `--ds-color-background-disabled` (#f0f0f0) - Disabled backgrounds

**Border Hierarchy:**
- `--ds-color-border-primary` (#e0e0e0) - Default borders
- `--ds-color-border-secondary` (#c0c0c0) - Subtle dividers
- `--ds-color-border-focus` (#4169e1) - Focus indicators
- `--ds-color-border-error` (#dc143c) - Error states

### 4. Semantic Colors
**Usage:** Status indicators, validation feedback, important information

#### Success States
- `--ds-color-success` (#228b22) - Forest green for valid/complete
- `--ds-color-success-light` (#32cd32) - Bright green for positive feedback
- `--ds-color-success-dark` (#006400) - Dark green for strong validation

#### Warning States
- `--ds-color-warning` (#ff8c00) - Dark orange for caution
- `--ds-color-warning-light` (#ffa500) - Orange for mild warnings
- `--ds-color-warning-dark` (#cc7000) - Dark orange for attention

#### Error States
- `--ds-color-error` (#dc143c) - Crimson for errors/critical
- `--ds-color-error-light` (#ff4757) - Bright red for immediate errors
- `--ds-color-error-dark` (#b22222) - Dark red for severe issues

#### Information States
- `--ds-color-info` (#4682b4) - Steel blue for information
- `--ds-color-info-light` (#6495ed) - Light blue for mild info
- `--ds-color-info-dark` (#1e3a5f) - Dark blue for important info

## Interaction States

### Focus States
**Purpose:** Clear keyboard navigation and accessibility

```scss
// Focus ring implementation
@mixin ds-focus-ring {
  outline: 2px solid var(--ds-color-focus);
  outline-offset: 2px;
}

// Usage
.focusable-element {
  &:focus {
    @include ds-focus-ring;
  }
}
```

**Guidelines:**
- Always visible with sufficient contrast (minimum 3:1)
- Use `outline` for better screen reader compatibility
- Maintain consistency across all interactive elements
- Support `:focus-visible` for modern browsers

### Hover States
**Purpose:** Visual feedback for interactive elements

```scss
// Hover overlay implementation
@mixin ds-hover-overlay {
  &:hover {
    background-color: var(--ds-color-hover);
  }
}

// Usage
.interactive-element {
  @include ds-hover-overlay;
}
```

**Guidelines:**
- Subtle opacity changes (8-12% for primary, 12-16% for secondary)
- Respect user's motion preferences
- Maintain text readability during hover
- Use consistent timing (150ms transition)

### Active States
**Purpose:** Immediate feedback for pressed/clicked elements

```scss
// Active overlay implementation
@mixin ds-active-overlay {
  &:active {
    background-color: var(--ds-color-active);
  }
}
```

**Guidelines:**
- Slightly more opaque than hover (16-20%)
- Provide tactile feedback feeling
- Reset quickly after interaction
- Combine with appropriate shadow/border changes

### Selected States
**Purpose:** Indicate active selection or current choice

```scss
// Selected state implementation
@mixin ds-selected-overlay {
  &.selected,
  &[aria-selected="true"] {
    background-color: var(--ds-color-selected);
    border-color: var(--ds-color-secondary);
  }
}
```

**Guidelines:**
- Use secondary color for selection highlighting
- Combine with border changes for clarity
- Support ARIA attributes for accessibility
- Maintain selection state visibility

### Disabled States
**Purpose:** Indicate non-interactive elements

**Implementation Guidelines:**
- Reduce opacity to 60%
- Use `--ds-color-text-disabled` for text
- Use `--ds-color-border-secondary` for borders
- Remove hover/focus states entirely
- Maintain sufficient contrast for readability

## Component-Specific Guidelines

### Tech Tree Nodes

#### Available Nodes
```scss
@mixin ds-node-state-available {
  color: var(--ds-color-node-available);
  border-color: var(--ds-color-node-available);
}
```

**Usage:** Nodes that can be researched/activated
- Bright, optimistic color (green)
- Clear border indication
- Full opacity and interaction

#### Locked Nodes
```scss
@mixin ds-node-state-locked {
  color: var(--ds-color-node-locked);
  border-color: var(--ds-color-node-locked);
  opacity: 0.6;
}
```

**Usage:** Nodes requiring prerequisites
- Muted gray color
- Reduced opacity
- No interaction feedback
- Structural indicators (icons/lock symbols)

#### Researching Nodes
```scss
@mixin ds-node-state-researching {
  color: var(--ds-color-node-researching);
  border-color: var(--ds-color-node-researching);
  animation: pulse 2s infinite;
}
```

**Usage:** Nodes currently being researched
- Informational blue color
- Subtle pulsing animation (respects reduced motion)
- Progress indicators
- Time-based feedback

#### Complete Nodes
```scss
@mixin ds-node-state-complete {
  color: var(--ds-color-node-complete);
  border-color: var(--ds-color-node-complete);
}
```

**Usage:** Successfully completed nodes
- Prosperous gold color
- Achievement indication
- Full visibility and permanence

#### Error Nodes
```scss
@mixin ds-node-state-error {
  color: var(--ds-color-node-error);
  border-color: var(--ds-color-node-error);
}
```

**Usage:** Nodes with validation or research errors
- Attention-grabbing red
- Clear error messaging
- Recovery options visible

### Connections Between Nodes

#### Valid Connections
- `--ds-color-connection-valid` (#228b22) - Green for achievable paths

#### Invalid Connections
- `--ds-color-connection-invalid` (#dc143c) - Red for impossible paths

#### Prerequisite Connections
- `--ds-color-connection-prerequisite` (#606060) - Gray for requirements

## Validation Feedback

### Success Validation
```scss
@mixin ds-validation-success {
  color: var(--ds-color-success);
  &::before {
    content: "✓";
    color: var(--ds-color-success);
  }
}
```

**Usage:** Form validation, successful operations, complete states

### Warning Validation
```scss
@mixin ds-validation-warning {
  color: var(--ds-color-warning);
  &::before {
    content: "⚠";
    color: var(--ds-color-warning);
  }
}
```

**Usage:** Caution messages, non-critical issues, deprecated features

### Error Validation
```scss
@mixin ds-validation-error {
  color: var(--ds-color-error);
  &::before {
    content: "✗";
    color: var(--ds-color-error);
  }
}
```

**Usage:** Critical errors, validation failures, blocking issues

## Accessibility Requirements

### Contrast Ratios
- **Normal text:** Minimum 4.5:1 ratio (WCAG AA)
- **Large text:** Minimum 3:1 ratio (WCAG AA)
- **UI components:** Minimum 3:1 ratio (WCAG AA)
- **Focus indicators:** Minimum 3:1 ratio (WCAG AA)

### Color Blindness Support
- Never rely solely on color for meaning
- Use icons, patterns, or text labels
- Test with deuteranopia, protanopia, and tritanopia
- Provide alternative visual indicators

### High Contrast Support
```scss
@media (prefers-contrast: high) {
  :root {
    --ds-color-focus: #0066ff;
    --ds-color-border-focus: #0066ff;
  }
  
  %ds-node-locked {
    opacity: 1;
    border-style: solid;
    border-width: 2px;
  }
}
```

## Implementation Examples

### Button Component
```scss
.ds-button {
  @include ds-bg-primary;
  @include ds-text-primary;
  @include ds-border-primary;
  @include ds-hover-overlay;
  @include ds-focus-ring;
  @include ds-active-overlay;
  
  &.ds-button--secondary {
    background-color: var(--ds-color-secondary);
    color: var(--ds-color-text-inverse);
  }
  
  &.ds-button--disabled {
    @extend %ds-text-disabled;
    opacity: 0.6;
    cursor: not-allowed;
    
    &:hover,
    &:focus {
      background-color: var(--ds-color-background-disabled);
    }
  }
}
```

### Form Input Component
```scss
.ds-input {
  @include ds-bg-primary;
  @include ds-text-primary;
  @include ds-border-primary;
  
  &:focus {
    @include ds-border-focus;
  }
  
  &.ds-input--error {
    @include ds-border-error;
    
    &::placeholder {
      color: var(--ds-color-error);
    }
  }
  
  &.ds-input--disabled {
    @extend %ds-text-disabled;
    background-color: var(--ds-color-background-disabled);
  }
}
```

### Tech Tree Node Component
```scss
.ds-tech-node {
  position: relative;
  
  &.ds-tech-node--available {
    @extend %ds-node-available;
    @extend %ds-clickable;
  }
  
  &.ds-tech-node--locked {
    @extend %ds-node-locked;
  }
  
  &.ds-tech-node--researching {
    @extend %ds-node-researching;
  }
  
  &.ds-tech-node--complete {
    @extend %ds-node-complete;
  }
  
  &.ds-tech-node--error {
    @extend %ds-node-error;
  }
}
```

## Dark Theme Considerations

The color system supports dark themes through CSS custom properties:

```scss
[data-theme="dark"] {
  --ds-color-text-primary: var(--ds-color-neutral-100);
  --ds-color-background-primary: var(--ds-color-neutral-900);
  // ... additional dark theme adjustments
}
```

**Guidelines:**
- Maintain contrast ratios in both themes
- Test all color combinations in both contexts
- Ensure focus indicators remain visible
- Verify semantic colors work appropriately

## Migration from Legacy Colors

When updating existing components:

1. **Audit Current Usage:** Identify all color-related styles
2. **Map to Semantic Tokens:** Replace hex codes with semantic names
3. **Test Accessibility:** Verify contrast ratios and focus states
4. **Update Components:** Apply new mixins and classes
5. **Validate Functionality:** Ensure all interaction states work

### Legacy Color Mapping
```scss
// Old hex codes to new semantic tokens
$legacy-color-mapping: (
  '#ff0000': '--ds-color-error',
  '#00ff00': '--ds-color-success',
  '#0000ff': '--ds-color-info',
  '#ffff00': '--ds-color-warning',
  '#ffffff': '--ds-color-background-primary',
  '#000000': '--ds-color-text-primary'
);
```

## Testing and Validation

### Automated Testing
- Visual regression tests for color states
- Accessibility audits for contrast compliance
- Cross-browser testing for color consistency
- Screen reader testing for color-independent meaning

### Manual Testing
- Keyboard navigation with focus indicators
- Color blindness simulation
- High contrast mode verification
- Dark theme validation

### Performance Considerations
- CSS custom properties for runtime theming
- Efficient color calculations
- Minimal repaints during state transitions
- GPU-accelerated animations where appropriate

---

## Summary

The Design System Color Tokens provide a comprehensive, accessible, and consistent color foundation for the Tech Tree Editor. By following these guidelines, we ensure:

- **Consistent user experience** across all components
- **Accessibility compliance** with WCAG standards
- **Semantic clarity** through meaningful color naming
- **Future maintainability** through centralized token management
- **Brand coherence** with the Hanseatic fantasy aesthetic

Remember: **Color enhances understanding but should never be the only way to convey meaning.**