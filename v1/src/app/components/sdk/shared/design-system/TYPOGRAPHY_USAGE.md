# Typography System Usage Guide

## Overview

The Design System Typography Scale provides a comprehensive, accessible typography system for the Tech Tree Editor. This system ensures visual consistency, accessibility compliance, and pixel-perfect alignment across all components.

## Design Principles

### UI Charter Compliance
- **Pixel Integrity**: All typography aligns to the pixel grid
- **Attention Hierarchy**: Clear visual hierarchy supports user focus
- **Retro Aesthetic**: Typography respects the Hanseatic fantasy visual language
- **Density & Restraint**: Efficient use of space without compromising readability

### Accessibility Standards
- **WCAG 2.1 AA Compliance**: All text meets minimum contrast ratios (4.5:1 for normal text, 3:1 for large text)
- **High Contrast Support**: Enhanced visibility for users with visual impairments
- **Reduced Motion**: No typography animations for users who prefer reduced motion

## Typography Scale

### Base Scale
```
Display: 36px (1.2 line-height, 700 weight)
XXXL:   28px (1.2 line-height, 600 weight)
XXL:    22px (1.2 line-height, 600 weight)
XL:     18px (1.4 line-height, 500 weight)
LG:     16px (1.4 line-height, 400 weight)
MD:     14px (1.4 line-height, 400 weight)
SM:     12px (1.4 line-height, 400 weight)
XS:     10px (1.6 line-height, 400 weight)
```

### Hierarchy Mapping

#### Headings
- **H1**: Display (36px) - Main page titles
- **H2**: XXXL (28px) - Section headers
- **H3**: XXL (22px) - Subsection headers
- **H4**: XL (18px) - Component titles
- **H5**: LG (16px) - Sub-component titles

#### Body Text
- **Body Large**: LG (16px) - Important descriptions
- **Body**: MD (14px) - Standard text content
- **Body Small**: SM (12px) - Secondary information
- **Body Tiny**: XS (10px) - Fine print, metadata

#### Specialized Text
- **Node Title**: LG (16px, 600 weight) - Tech tree node names
- **Node Description**: SM (12px) - Node explanatory text
- **Node Meta**: XS (10px, 500 weight) - Node statistics, tags
- **Validation**: SM (12px, 500 weight) - Error/warning messages
- **Tooltip**: SM (12px) - Hover help text
- **Caption**: XS (10px) - Image labels, figure captions

## Implementation

### SCSS Usage

#### Import the typography tokens
```scss
@import 'design-system/typography-tokens';
```

#### Apply typography using extend classes
```scss
.tech-tree-node {
  .node-title {
    @extend %ds-node-title;
  }
  
  .node-description {
    @extend %ds-node-description;
  }
  
  .node-meta {
    @extend %ds-node-meta;
  }
}
```

#### Use utility mixins for custom styling
```scss
.custom-heading {
  @include ds-heading(3);
  color: var(--sdk-accent-primary);
}

.custom-body {
  @include ds-body('small');
  margin-bottom: var(--ds-spacing-md);
}
```

### TypeScript Usage

#### Import tokens
```typescript
import { TYPOGRAPHY_TOKENS, TypographyUtils } from 'design-system/typography.tokens';
```

#### Apply tokens programmatically
```typescript
// Direct token usage
const titleStyle = {
  fontSize: TYPOGRAPHY_TOKENS.nodeTitle.size,
  fontWeight: TYPOGRAPHY_TOKENS.nodeTitle.weight,
  lineHeight: TYPOGRAPHY_TOKENS.nodeTitle.lineHeight
};

// Using utility functions
const style = element.style;
TypographyUtils.applyToStyle(TYPOGRAPHY_TOKENS.nodeTitle, style);

// Get component-specific typography
const gridTypography = TYPOGRAPHY_COMPONENTS['tech-tree-grid'];
```

### CSS Custom Properties

#### Use CSS variables for runtime styling
```css
.tech-tree-node {
  font-size: var(--ds-typography-node-title-size);
  font-weight: var(--ds-typography-node-title-weight);
  line-height: var(--ds-typography-node-title-line-height);
  color: var(--sdk-text-primary);
}
```

## Component-Specific Guidelines

### Tech Tree Grid
- **Node Titles**: Use `nodeTitle` typography
- **Node Descriptions**: Use `nodeDescription` typography
- **Node Metadata**: Use `nodeMeta` typography
- **Prerequisites**: Use `nodePrerequisite` typography

### Node Detail Panel
- **Panel Title**: Use `heading2` typography
- **Description**: Use `body` typography
- **Effects List**: Use `bodySmall` typography
- **Validation Messages**: Use `validation` typography

### Preview Dialog
- **Dialog Title**: Use `heading3` typography
- **Content**: Use `body` typography
- **Validation**: Use `validation` typography

### Icon Picker
- **Search Input**: Use `body` typography
- **Category Labels**: Use `iconLabel` typography
- **Icon Labels**: Use `iconLabel` typography

## Accessibility Guidelines

### Contrast Requirements
All text combinations must meet WCAG 2.1 AA standards:

- **Normal Text (≤18px)**: Minimum 4.5:1 contrast ratio
- **Large Text (≥18px or ≥14px bold)**: Minimum 3:1 contrast ratio

### Current Theme Color Combinations
```
Primary Text on Transparent: #e8e0ff (High contrast)
Secondary Text on Transparent: rgba(232, 224, 255, 0.85) (Passes AA)
Muted Text on Transparent: rgba(232, 224, 255, 0.65) (Passes AA)
Validation Error: #ff9292 (High contrast)
Validation Warning: #ffcf79 (High contrast)
Validation Info: #8abdf7 (High contrast)
```

### High Contrast Mode
The system automatically enhances contrast in high contrast mode:
- Font weights increase for better visibility
- All text uses white for maximum visibility
- Border and background opacity increases

### Reduced Motion
Typography transitions are disabled for users with reduced motion preference.

## Best Practices

### Do's
✅ Use the provided typography tokens consistently
✅ Maintain pixel grid alignment
✅ Respect the attention hierarchy
✅ Test contrast ratios in both light and dark contexts
✅ Use semantic HTML headings (h1, h2, h3, etc.)

### Don'ts
❌ Don't create custom font sizes outside the scale
❌ Don't use colors that don't meet contrast requirements
❌ Don't apply typography animations
❌ Don't mix different typography systems
❌ Don't ignore the pixel grid alignment

## Migration Guide

### From Inline Styles
```typescript
// Before
style.fontSize = '16px';
style.fontWeight = '600';

// After
TypographyUtils.applyToStyle(TYPOGRAPHY_TOKENS.nodeTitle, style);
```

### From Custom CSS Classes
```scss
/* Before */
.custom-title {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
}

/* After */
.custom-title {
  @extend %ds-node-title;
}
```

## Testing Guidelines

### Visual Testing
- Verify typography renders correctly at all supported resolutions
- Check pixel grid alignment in browser dev tools
- Test high contrast mode compatibility
- Validate reduced motion behavior

### Accessibility Testing
- Use automated tools (axe-core, Lighthouse)
- Manual contrast ratio testing
- Screen reader compatibility testing
- Keyboard navigation testing

### Performance Testing
- Measure font loading performance
- Check for layout shift during font loading
- Validate CSS custom property performance

## Troubleshooting

### Common Issues

**Typography not applying correctly**
- Ensure SCSS files are imported properly
- Check CSS custom property support
- Verify extend classes are available

**Contrast ratio failures**
- Use the provided color tokens
- Check theme combinations
- Test in high contrast mode

**Pixel misalignment**
- Use the provided mixins
- Check transform properties
- Verify hardware acceleration

### Support
For typography system issues, refer to:
1. This documentation
2. The design system source files
3. The UI & Ergonomics Charter
4. WCAG 2.1 accessibility guidelines