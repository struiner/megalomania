# SDK UI Consistency Framework - Usage Guide

The SDK UI Consistency Framework provides reusable shell components and styling patterns that enforce UI charter compliance while eliminating layout duplication across SDK tools.

## Overview

The framework consists of:

- **SdkShellComponent**: Main container with header, tabs, and bottom action bar
- **SdkPanelComponent**: Consistent panel framing for content organization
- **SdkActionGroupComponent**: Standardized action button grouping
- **Design Tokens**: SCSS tokens for spacing, typography, and colors
- **Utility Classes**: Extendable base classes for common patterns

## Quick Start

### 1. Basic Shell Usage

```html
<app-sdk-shell
  [eyebrowText]="'SDK / Category'"
  [title]="'Tool Name'"
  [ledeText]="'Brief description of tool purpose'"
  [summaryStats]="summaryStatsArray"
  [bottomActions]="bottomActionsArray"
>
  <!-- Your tool content here -->
  <div class="tool-layout">
    <!-- Content organized in panels -->
  </div>
</app-sdk-shell>
```

### 2. Tabbed Shell Usage

```html
<app-sdk-shell
  [eyebrowText]="'SDK / Technology'"
  [title]="'Tech Editor'"
  [ledeText]="'Manage technology trees and dependencies'"
  [tabs]="tabsArray"
  [(activeTabId)]="activeTab"
  [bottomActions]="bottomActionsArray"
>
  <!-- Tab content is handled by the shell component -->
</app-sdk-shell>
```

### 3. Panel Usage

```html
<app-sdk-panel title="Panel Title">
  <div slot="actions">
    <app-sdk-action-group [actions]="panelActions"></app-sdk-action-group>
  </div>
  
  <!-- Panel content -->
  <form>
    <!-- Form fields -->
  </form>
  
  <div slot="footer">
    <!-- Optional footer content -->
  </div>
</app-sdk-panel>
```

## Component Reference

### SdkShellComponent

Main container component that provides consistent layout structure.

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `eyebrowText` | `string` | Small text above title (e.g., "SDK / Economy") |
| `title` | `string` | Main page title |
| `ledeText` | `string` | Descriptive text below title |
| `headerActions` | `SdkShellAction[]` | Actions for header area |
| `bottomActions` | `SdkShellAction[]` | Actions for bottom action bar |
| `summaryStats` | `SdkShellStat[]` | Summary statistics pills |
| `tabs` | `SdkShellTab[]` | Tab definitions for tabbed interface |
| `activeTabId` | `string` | Currently active tab ID |

#### SdkShellAction Interface

```typescript
interface SdkShellAction {
  label: string;          // Button label
  icon?: string;          // Optional icon
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;   // Click handler
  disabled?: boolean;     // Disabled state
  variant?: 'primary' | 'secondary' | 'danger';
}
```

#### SdkShellTab Interface

```typescript
interface SdkShellTab {
  id: string;             // Unique tab identifier
  label: string;          // Tab label
  content: any;           // TemplateRef for tab content
}
```

### SdkPanelComponent

Reusable panel component for content organization.

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `title` | `string` | Panel title |
| `compact` | `boolean` | Use compact padding variant |

#### Content Slots

- Default slot: Main panel content
- `slot="header"`: Additional header content
- `slot="actions"`: Header actions
- `slot="footer"`: Footer content

### SdkActionGroupComponent

Consistent action button grouping.

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `actions` | `SdkActionGroupAction[]` | Array of action definitions |
| `direction` | `'horizontal' \| 'vertical'` | Button arrangement |

#### SdkActionGroupAction Interface

```typescript
interface SdkActionGroupAction {
  label: string;
  icon?: string;
  title?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}
```

## Design Tokens

The framework provides SCSS design tokens for consistent styling:

### Spacing Tokens

```scss
$spacing-xs: 6px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;
```

### Typography Tokens

```scss
$font-size-xs: 10px;
$font-size-sm: 12px;
$font-size-md: 14px;
$font-size-lg: 16px;
$font-size-xl: 18px;
$font-size-xxl: 22px;
```

### Color Tokens

```scss
$color-primary: #8abdf7;
$color-secondary: #9fface;
$color-accent: #ffcf79;
$color-danger: #ff9292;
```

## Utility Classes

### Form Utilities

```scss
.sdk-form-field {
  @extend %sdk-form-field;
}

.sdk-form-input {
  @extend %sdk-form-input;
}
```

### List Utilities

```scss
.sdk-list {
  @extend %sdk-list;
}

.sdk-list-item {
  @extend %sdk-list-item;
}
```

### Typography Utilities

```scss
.sdk-eyebrow {
  @extend %sdk-eyebrow;
}

.sdk-heading {
  @extend %sdk-heading;
}

.sdk-lede {
  @extend %sdk-lede;
}
```

### Interactive Utilities

```scss
.sdk-tag {
  @extend %sdk-tag;
}

.sdk-pill {
  @extend %sdk-pill;
}
```

## Common Patterns

### Two-Column Layout

```html
<div class="tool-layout">
  <div class="tool-column">
    <app-sdk-panel title="Form Panel">
      <!-- Form content -->
    </app-sdk-panel>
  </div>
  <div class="tool-column">
    <app-sdk-panel title="List Panel">
      <!-- List content -->
    </app-sdk-panel>
  </div>
</div>
```

```scss
.tool-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: var(--sdk-spacing-md, 16px);
}

.tool-column {
  display: flex;
  flex-direction: column;
  gap: var(--sdk-spacing-sm, 10px);
}
```

### Form with Actions

```html
<app-sdk-panel title="Create Item">
  <form>
    <!-- Form fields -->
  </form>
  
  <div slot="footer">
    <app-sdk-action-group 
      [actions]="[
        { label: 'Cancel', variant: 'secondary' },
        { label: 'Create', variant: 'primary' }
      ]"
      direction="horizontal"
    ></app-sdk-action-group>
  </div>
</app-sdk-panel>
```

### List with Actions

```html
<app-sdk-panel title="Items">
  <div slot="actions">
    <input class="sdk-form-input" placeholder="Filter..." />
    <app-sdk-action-group 
      [actions]="[{ label: 'Add New', variant: 'primary' }]"
    ></app-sdk-action-group>
  </div>
  
  <ul class="sdk-list">
    <li class="sdk-list-item" *ngFor="let item of items">
      <div>
        <h4>{{ item.name }}</h4>
        <p class="sdk-lede">{{ item.description }}</p>
      </div>
      <div class="sdk-meta">
        <app-sdk-action-group 
          [actions]="[{ label: 'Edit' }, { label: 'Delete', variant: 'danger' }]"
          direction="vertical"
        ></app-sdk-action-group>
      </div>
    </li>
  </ul>
</app-sdk-panel>
```

## Charter Compliance

The framework is designed to enforce UI charter compliance:

### ✅ Bottom Heavy and Stable
- Bottom action bar provides stable, consistent action placement
- Actions maintain fixed position and don't shift during interaction

### ✅ ≤8 Primary Actions
- Bottom action bar limited to 8 actions maximum
- Actions grouped logically with clear separation

### ✅ Symmetry by Default
- Headers balanced: title left, actions right
- Panel layouts maintain visual symmetry
- Action groups follow consistent spacing patterns

### ✅ Icons Before Text
- Action components support icons with optional labels
- Visual hierarchy emphasizes icon recognition

### ✅ Pixel Grid Alignment
- All components align to pixel boundaries
- No sub-pixel positioning or fractional scaling

### ✅ Hanseatic Aesthetic
- Earthy color palette
- Instrument-like visual design
- Functional over ornamental styling

## Migration Guide

### From Custom Layouts

1. **Replace wrapper divs** with `SdkShellComponent`
2. **Convert custom headers** to shell header props
3. **Replace custom panels** with `SdkPanelComponent`
4. **Convert custom action bars** to shell bottomActions
5. **Update styles** to use design tokens and utility classes

### Example Migration

**Before:**
```html
<section class="custom-tool">
  <header class="tool-header">
    <div class="title-area">
      <span class="eyebrow">SDK / Economy</span>
      <h2>Goods Manager</h2>
    </div>
    <div class="actions">
      <button>Export</button>
    </div>
  </header>
  
  <div class="content">
    <!-- Custom content -->
  </div>
  
  <footer class="action-bar">
    <button class="primary">Save</button>
    <button>Reset</button>
  </footer>
</section>
```

**After:**
```html
<app-sdk-shell
  [eyebrowText]="'SDK / Economy'"
  [title]="'Goods Manager'"
  [bottomActions]="[
    { label: 'Save', variant: 'primary' },
    { label: 'Reset', variant: 'secondary' }
  ]"
>
  <!-- Content using panels -->
</app-sdk-shell>
```

## Best Practices

### Action Design
- Use primary variant for main actions (Save, Create, Submit)
- Use secondary variant for supporting actions (Cancel, Reset, Export)
- Use danger variant for destructive actions (Delete, Remove)
- Keep action labels clear and action-specific

### Panel Organization
- Each panel should focus on single functional area
- Use compact variant for dense content
- Group related actions in panel headers
- Use footer slots for panel-specific actions

### Layout Principles
- Maintain visual hierarchy through proper panel nesting
- Use consistent spacing between related elements
- Balance content across left/right panels
- Keep center area clear for main content

### Responsive Behavior
- Panel grids collapse to single column on small screens
- Action groups stack vertically when space is limited
- Tab navigation remains accessible at all sizes

## Troubleshooting

### Common Issues

**Issue**: Actions not appearing in bottom bar
**Solution**: Ensure `bottomActions` array is properly bound and contains valid action objects

**Issue**: Tabs not switching content
**Solution**: Verify `activeTabId` is properly bound with two-way binding `[(activeTabId)]`

**Issue**: Styles not applying consistently
**Solution**: Ensure SCSS tokens file is imported and design token variables are available

**Issue**: Charter compliance warnings
**Solution**: Review [Charter Compliance Checklist](./sdk-ui-consistency-charter-compliance.md)

### Performance Considerations

- Framework components are lightweight with minimal DOM overhead
- Design tokens use CSS custom properties for runtime customization
- Component change detection optimized for typical SDK tool usage patterns
- No external dependencies beyond Angular core

---

**Framework Version**: 1.0.0  
**Last Updated**: 2025-12-19  
**Charter Reference**: megalomania/charter_UI_ergonomics.md