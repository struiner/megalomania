# Design System Focus States Usage Guide

## Overview

This document provides comprehensive guidance for implementing consistent focus states across all Tech Tree Editor components. Focus states are a critical accessibility feature that ensures keyboard navigation works effectively and meets WCAG 2.1 AA requirements.

## Philosophy & Principles

### Design System Compliance

Focus states in the Tech Tree Editor must follow these core principles:

- **Accessibility First**: Focus indicators must be visible, non-color-dependent, and meet WCAG contrast requirements
- **Consistency**: All interactive elements use the same focus state patterns
- **Pixel-Perfect**: Focus indicators align to the design system's 4px grid
- **Hanseatic Aesthetic**: Focus states complement the earthy, mercantile visual theme
- **Performance**: Focus transitions are smooth but respect reduced motion preferences

### UI & Ergonomics Charter Alignment

- Focus states reinforce the "World First, Interface Second" principle by being informative without being distracting
- Focus indicators use the established color hierarchy without competing with primary game elements
- Focus animations are informational, not decorative

## Focus State Types

### 1. Default Focus State

**Usage**: Standard interactive elements
**Characteristics**:
- 2px solid royal blue outline
- 2px offset for visibility
- Subtle background tint
- 150ms transition

**CSS Classes**:
```scss
.ds-focusable          // Basic focus capability
@include ds-focus-ring('default')  // Custom application
```

**Example Implementation**:
```html
<button class="ds-button ds-focusable">
  Research Technology
</button>
```

### 2. Enhanced Focus State

**Usage**: High-priority interactive elements (primary buttons, form inputs)
**Characteristics**:
- 3px solid dark blue outline
- 3px offset for prominence
- Visible border and shadow
- Stronger background tint

**CSS Classes**:
```scss
.ds-focus-enhanced
@include ds-focus-enhanced()
```

**Example Implementation**:
```html
<button class="ds-button ds-focus-enhanced">
  Save Changes
</button>

<input class="ds-input ds-focus-enhanced" 
       type="text" 
       placeholder="Technology name">
```

### 3. Subtle Focus State

**Usage**: Secondary elements, links, decorative interactions
**Characteristics**:
- 1px solid light blue outline
- Minimal visual impact
- Light background tint
- 100ms transition

**CSS Classes**:
```scss
.ds-focus-subtle
@include ds-focus-subtle()
```

**Example Implementation**:
```html
<a href="/documentation" class="ds-link ds-focus-subtle">
  View Documentation
</a>
```

### 4. Error Focus State

**Usage**: Form validation errors, invalid inputs
**Characteristics**:
- 2px solid crimson outline
- Red border and shadow
- Error background tint
- Clear visual feedback

**CSS Classes**:
```scss
@include ds-focus-ring('error')
```

**Example Implementation**:
```html
<input class="ds-input" 
       type="text" 
       [class.ds-focus-error]="hasError"
       placeholder="Technology name">
```

### 5. Success Focus State

**Usage**: Valid form submissions, successful actions
**Characteristics**:
- 2px solid forest green outline
- Green border and shadow
- Success background tint
- Positive visual feedback

**CSS Classes**:
```scss
@include ds-focus-ring('success')
```

**Example Implementation**:
```html
<button class="ds-button" 
        [class.ds-focus-success]="isValid">
  Research Technology
</button>
```

## Component-Specific Integration

### Tech Tree Nodes

**Focus Requirements**:
- Must be keyboard accessible
- Clear visual hierarchy
- Compatible with grid navigation
- Support for connection mode

**Implementation**:
```scss
.tech-tree-node {
  @extend %ds-focus-node;
  
  // Additional node-specific styling
  &:focus {
    // Enhanced focus for nodes
    transform: translateZ(0);
    z-index: 10;
    
    // Node-specific focus indicators
    &::before {
      content: '';
      position: absolute;
      inset: -2px;
      border: 2px solid var(--ds-color-focus);
      border-radius: inherit;
      pointer-events: none;
    }
  }
}
```

**HTML Structure**:
```html
<div class="tech-tree-node ds-focus-node" 
     tabindex="0" 
     role="button"
     [attr.aria-label]="'Technology: ' + node.name"
     [class.available]="node.state === 'available'">
  
  <div class="node-icon">
    <img [src]="node.icon" [alt]="node.name">
  </div>
  
  <div class="node-content">
    <h3 class="node-title">{{ node.name }}</h3>
    <p class="node-description">{{ node.description }}</p>
  </div>
  
  <div class="node-state" [attr.aria-label]="node.state">
    <!-- State indicators -->
  </div>
</div>
```

### Form Inputs

**Focus Requirements**:
- Clear input boundaries
- Validation state feedback
- Accessible labels
- Proper ARIA attributes

**Implementation**:
```scss
.ds-input {
  @extend %ds-focus-input;
  
  padding: var(--ds-spacing-input-padding-y) var(--ds-spacing-input-padding-x);
  border: 1px solid var(--ds-color-border-primary);
  border-radius: var(--ds-spacing-xs);
  
  &:focus {
    border-color: var(--ds-focus-border-color);
    box-shadow: inset 0 0 0 1px var(--ds-focus-border-color);
  }
  
  &.error {
    @include ds-focus-ring('error');
  }
  
  &.success {
    @include ds-focus-ring('success');
  }
}
```

**HTML Structure**:
```html
<div class="form-field">
  <label for="tech-name" class="ds-label">
    Technology Name
    <span class="required" aria-label="required">*</span>
  </label>
  <input id="tech-name" 
         class="ds-input ds-focus-enhanced"
         type="text"
         required
         [attr.aria-invalid]="hasError"
         [attr.aria-describedby]="hasError ? 'tech-name-error' : null">
  
  <div id="tech-name-error" 
       class="error-message" 
       *ngIf="hasError"
       role="alert">
    Technology name is required
  </div>
</div>
```

### Buttons

**Focus Requirements**:
- Clear activation affordance
- Consistent sizing
- Icon support
- Loading states

**Implementation**:
```scss
.ds-button {
  @extend %ds-focus-button;
  
  display: inline-flex;
  align-items: center;
  gap: var(--ds-spacing-button-icon-gap);
  padding: var(--ds-spacing-button-padding-y) var(--ds-spacing-button-padding-x);
  border: none;
  border-radius: var(--ds-spacing-xs);
  cursor: pointer;
  
  &:focus {
    position: relative;
    z-index: 1;
  }
  
  &.primary {
    background: var(--ds-color-primary);
    color: var(--ds-color-text-inverse);
    
    &:focus {
      @include ds-focus-enhanced;
    }
  }
  
  &.secondary {
    background: var(--ds-color-background-secondary);
    color: var(--ds-color-text-primary);
    border: 1px solid var(--ds-color-border-primary);
    
    &:focus {
      @include ds-focus-subtle;
    }
  }
}
```

**HTML Structure**:
```html
<button class="ds-button primary ds-focus-button"
        type="button"
        [disabled]="isLoading"
        [attr.aria-busy]="isLoading">
  
  <span class="button-icon" *ngIf="icon">
    <img [src]="icon" [alt]="''">
  </span>
  
  <span class="button-text">{{ label }}</span>
  
  <span class="loading-indicator" *ngIf="isLoading" aria-hidden="true">
    Loading...
  </span>
</button>
```

## Keyboard Navigation Patterns

### Standard Tab Navigation

**Implementation Guidelines**:
- Use logical DOM order for tab sequence
- Set `tabindex="0"` for interactive elements
- Set `tabindex="-1"` for focus management targets
- Avoid `tabindex` values greater than 0

**Example**:
```html
<!-- Good tab order -->
<div class="form-section">
  <label for="name">Name</label>
  <input id="name" tabindex="0">  <!-- First in tab order -->
  
  <label for="description">Description</label>
  <textarea id="description" tabindex="0"></textarea>  <!-- Second -->
  
  <button tabindex="0">Save</button>  <!-- Third -->
  <button tabindex="0">Cancel</button>  <!-- Fourth -->
</div>
```

### Arrow Key Navigation

**Grid Layout Navigation**:
```typescript
// TypeScript implementation for arrow key navigation
class GridNavigator {
  private currentIndex = 0;
  private items: HTMLElement[] = [];
  
  constructor(private container: HTMLElement) {
    this.items = Array.from(container.querySelectorAll('[role="gridcell"]'));
    this.setupKeyboardListeners();
  }
  
  private setupKeyboardListeners() {
    this.container.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault();
          this.navigateHorizontal(1);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          this.navigateHorizontal(-1);
          break;
        case 'ArrowDown':
          event.preventDefault();
          this.navigateVertical(1);
          break;
        case 'ArrowUp':
          event.preventDefault();
          this.navigateVertical(-1);
          break;
        case 'Home':
          event.preventDefault();
          this.navigateToIndex(0);
          break;
        case 'End':
          event.preventDefault();
          this.navigateToIndex(this.items.length - 1);
          break;
      }
    });
  }
  
  private navigateHorizontal(direction: number) {
    const columns = this.getGridColumns();
    const newIndex = this.currentIndex + (direction * columns);
    this.navigateToIndex(Math.max(0, Math.min(newIndex, this.items.length - 1)));
  }
  
  private navigateVertical(direction: number) {
    const newIndex = this.currentIndex + direction;
    this.navigateToIndex(Math.max(0, Math.min(newIndex, this.items.length - 1)));
  }
  
  private navigateToIndex(index: number) {
    if (this.items[index]) {
      this.items[this.currentIndex]?.setAttribute('tabindex', '-1');
      this.items[index].setAttribute('tabindex', '0');
      this.items[index].focus();
      this.currentIndex = index;
    }
  }
  
  private getGridColumns(): number {
    // Calculate based on container width and item width
    const containerWidth = this.container.clientWidth;
    const itemWidth = 48 + 4; // icon size + gap
    return Math.floor(containerWidth / itemWidth);
  }
}
```

## Accessibility Guidelines

### WCAG 2.1 AA Compliance

**Focus Visible (2.4.7)**:
- All interactive elements must have visible focus indicators
- Focus indicators must have sufficient contrast (3:1 minimum)
- Focus indicators must not rely solely on color

**Keyboard Accessible (2.1.1)**:
- All functionality must be available via keyboard
- No keyboard traps
- Focus order must be logical

**Focus Order (2.4.3)**:
- Focus must follow a logical sequence
- Tab order must match visual layout when possible

### Implementation Checklist

**Focus Indicators**:
- [ ] All interactive elements have visible focus indicators
- [ ] Focus indicators meet contrast requirements
- [ ] Focus indicators work in both light and dark themes
- [ ] Focus indicators are not color-dependent only

**Keyboard Navigation**:
- [ ] All functionality is keyboard accessible
- [ ] Tab order is logical and predictable
- [ ] No keyboard traps exist
- [ ] Arrow key navigation works for grids and lists
- [ ] Escape key closes modals and dropdowns

**Screen Reader Support**:
- [ ] Focus changes are announced
- [ ] Element purposes are clear
- [ ] State changes are announced
- [ ] ARIA attributes are properly used

**Performance**:
- [ ] Focus transitions are smooth
- [ ] Reduced motion preferences are respected
- [ ] Focus styles don't cause layout shifts

## Best Practices

### DO:
- Use semantic HTML elements (`<button>`, `<a>`, `<input>`)
- Apply focus states consistently across components
- Test keyboard navigation with screen readers
- Use appropriate ARIA attributes
- Maintain logical tab order
- Provide skip links for long pages
- Test with actual keyboard users

### DON'T:
- Remove focus outlines without replacement
- Use `tabindex` values greater than 0
- Create keyboard traps
- Rely solely on color for focus indication
- Ignore focus order in complex layouts
- Use focus states for decorative purposes only
- Break focus in responsive layouts

## Integration Notes

### Dependencies
- Requires color tokens for focus colors
- Requires spacing tokens for focus offsets
- Requires typography tokens for text states

### Browser Support
- Modern browsers (Chrome 88+, Firefox 85+, Safari 14+)
- Internet Explorer 11 (with polyfills)
- Mobile browsers (iOS Safari 14+, Chrome Mobile 88+)

### Performance Impact
- Minimal CSS footprint
- Hardware-accelerated transitions
- No JavaScript required for basic focus states
- Progressive enhancement approach