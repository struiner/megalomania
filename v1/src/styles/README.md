# Design system foundations

This directory hosts reusable SCSS tokens and utilities for the SDK and page shells. The foundations align with the Phase 3 Wave 1 priorities (DS-01…DS-04) so the tech tree editor, preview dialog, and future SDK tools share the same typography, color, spacing, and focus rules.

## Typography scale (DS-01)

- **Tokens:** `--ds-font-size-xs | sm | md | lg | xl | 2xl`, weights `--ds-font-weight-regular | medium | semibold | bold`, and line heights `--ds-line-height-tight | snug | default | relaxed`.
- **Usage:**  
  - Page titles and modal headers: `.ds-heading-lg`/`.ds-heading-xl`  
  - Panel and section titles: `.ds-heading-md`  
  - Labels and captions: `.ds-label` + `.ds-body-xs` for helper text  
  - Body copy: default body or `.ds-body-sm` in dense panels
- **Accessibility:** Pair text with `--ds-color-text-primary` or `--ds-color-text-muted`; the contrast pairs are tuned for WCAG 2.1 AA on the dark surface ramp.

## Color tokens (DS-02)

- **Surfaces & text:** `--ds-color-surface-900…500`, `--ds-color-surface-card`, `--ds-color-surface-subtle`, `--ds-color-text-primary`, `--ds-color-text-muted`.
- **States:** `--ds-color-state-hover | active | selected | pressed`, `--ds-color-disabled`, and callouts (`--ds-color-callout-error | warning | info`).
- **Connectors & focus:** `--ds-color-connector-weak | default | highlight`, `--ds-focus-outline-color`, and `--ds-focus-outline-strong-color` keep canvas connections and modal focus outlines consistent.
- **Guidance:** Use ice for selection/focus, amber for primaries, danger for destructive paths. Avoid inventing new ramps; map new states onto the existing semantic tokens.

## Spacing & layout rhythm (DS-03)

- **Scale:** `--ds-space-0…8` (4 px base) plus shape tokens (`--ds-radius-xs…lg`, `--ds-radius-full`).
- **Layout bounds:** `--ds-layout-content-max` caps editor width; `--ds-layout-row-gap`/`--ds-layout-column-gap` keep page and panel gaps predictable.
- **Grid sizing:** `--ds-tech-column-width`, `--ds-tech-row-height`, and `--ds-tech-gutter` define the canvas grid and connector math. Keep transforms integer-aligned.
- **Patterns:** Use `.ds-panel` for carded sections, `.ds-stack` for vertical form groups, and CSS Grid with the spacing tokens for modal forms or action docks.

## Focus & keyboard patterns (DS-04)

- **Tokens:** `--ds-focus-ring`, `--ds-focus-ring-strong`, `--ds-focus-radius`, `--ds-focus-outline-offset` power the default `:focus-visible` outline.  
- **Utilities:** `.ds-focus-target` adds inset outlines for chips/cards; `.ds-pill` and `.ds-focus-ring-strong` are ready for primary actions and keyboard loops.  
- **Checklist:** every interactive element should be reachable by keyboard, show the default focus ring (or strong ring for primary/amber actions), and expose ARIA labels or descriptions that match on-screen copy. Avoid removing outlines; adjust offset via `--ds-focus-outline-offset` instead.

## Component application map

- **Tech canvas:** column/row math from `--ds-tech-column-width`/`--ds-tech-row-height`; node chips use hover/selected state tokens and the strong focus ring; connectors use `--ds-color-connector-*`.
- **Detail stack & action dock:** `.ds-panel`, `.ds-stack`, spacing tokens for gaps, and `.ds-pill` for tier controls or filter toggles.
- **Preview dialog:** dialog shell uses card/surface tokens; close button and node cards rely on the strong focus ring and hover/active state tokens.

## Usage guidance (do/don’t)

Do:
- Import `_design-tokens.scss` and `_utilities.scss` so CSS variables and helpers are available to components.
- Use spacing tokens for padding/gaps and the radius tokens instead of hard-coded values.
- Keep focus outlines visible; prefer the strong focus ring for destructive or primary actions and ensure ARIA labels follow the visual text.
- Keep layouts within `--ds-layout-content-max` to preserve readability and the attention hierarchy.

Don’t:
- Introduce ad-hoc colors or spacing values that don’t map to the token scale.
- Remove focus outlines or rely only on color to convey focus/selection.
- Mix pixel and sub-pixel transforms that break the integer grid defined by the tech canvas tokens.

## Sample utility classes

```scss
@use '../styles/design-tokens';

.node-chip {
  @extend .ds-card;
  padding: var(--ds-space-3);
  border-radius: var(--ds-radius-sm);
  gap: var(--ds-space-1);
}

.pill {
  @extend .ds-pill;
}

.grid-cell:focus-visible {
  box-shadow: var(--ds-focus-ring);
}
```

Focusable controls (e.g., canvas nodes, icon grids, preview dialog close buttons) should use the strong focus ring when they trigger primary or destructive actions; informational controls should stick to the default focus ring.
