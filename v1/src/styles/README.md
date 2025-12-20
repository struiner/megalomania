# Design system foundations

This directory hosts reusable SCSS tokens and utilities for the SDK and page shells. Tokens keep spacing, typography, and color pairings consistent across the technology tree editor, preview dialog, and future SDK tools.

## Token palette

- **Typography:** `--ds-font-size-xs | sm | md | lg | xl`, `--ds-font-family-base`, and `--ds-line-height-*` cover the standard scale for labels, body, and headings.
- **Color ramps:** surfaces (`--ds-color-surface-900…500`), text (`--ds-color-text-primary`, `--ds-color-text-muted`), and contrast-checked accents (`--ds-color-accent-ice-400`, `--ds-color-accent-amber-400`, `--ds-color-danger-500`). The pairs are tuned for WCAG AA on dark surfaces; use accent ice for focus and selection, amber for primaries, and danger for destructive states.
- **Spacing and shape:** `--ds-space-1…7` (4 px base), radii (`--ds-radius-xs…lg`, `--ds-radius-full`), and grid sizing tokens for the tech canvas (`--ds-tech-column-width`, `--ds-tech-row-height`, `--ds-tech-gutter`).
- **Focus rings:** `--ds-focus-ring` (ice) and `--ds-focus-ring-strong` (amber) pair with `--ds-focus-radius` and `--ds-focus-outline-offset` for consistent outlines.

## Usage guidance (do/don’t)

Do:
- Import `_design-tokens.scss` and `_utilities.scss` into component styles or global `styles.scss` so CSS variables are available.
- Use spacing tokens for padding and gaps (e.g., `gap: var(--ds-space-3)`), and use `--ds-radius-sm`/`--ds-radius-md` instead of hard-coded radii.
- Apply focus helpers (`:focus-visible` uses `--ds-focus-ring` by default) and keep outlines visible on keyboard targets.
- Prefer `--ds-color-surface-card`/`--ds-color-surface-subtle` as backgrounds and pair text with `--ds-color-text-primary`/`--ds-color-text-muted`.

Don’t:
- Introduce new ad-hoc colors or spacing values that don’t map to the token scale.
- Remove focus outlines or rely solely on box shadows for focus indication.
- Mix pixel and sub-pixel transforms that break the integer grid defined by the tech canvas tokens.

## Sample utility classes

The `_utilities.scss` partial exposes lightweight helpers:

- **Layout:** `.ds-stack` (grid stack with `--ds-space-2` gaps), `.ds-inline` (inline flex with consistent spacing), `.ds-panel`/`.ds-card` (tokenized backgrounds/borders), `.ds-divider`.
- **Focus/visibility:** `.ds-focus-target` for inset focus outline, `.ds-focus-ring-strong` for amber outlines, `.ds-sr-only` for live regions or instructional text.
- **Chips and pills:** `.ds-pill` for pill buttons/toggles that use the spacing and border tokens.

Example:

```scss
@use '../styles/design-tokens';

.node-chip {
  @extend .ds-card;
  padding: var(--ds-space-3);
  border-radius: var(--ds-radius-sm);
  gap: var(--ds-space-1);
}

.grid-cell:focus-visible {
  box-shadow: var(--ds-focus-ring);
}
```

## Layout and focus templates

- **Tech canvas:** width and height per column/row should derive from `--ds-tech-column-width` and `--ds-tech-row-height` to keep connectors aligned and virtualization deterministic.
- **Focusable controls:** use `.ds-focus-ring-strong` on primary/amber actions and keep `aria-label`/`aria-describedby` in sync with the new live-region announcements in the tech tree editor.

