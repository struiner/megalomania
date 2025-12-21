# Addendum: Culture Tag Combobox – Implementation Follow-Ups

**Context:**  
This addendum records follow-up tasks identified during implementation review of
`CultureTagComboboxComponent`, ensuring alignment with the Culture Tag Combobox
design meeting outcomes.

This document introduces **no new decisions**.  
It clarifies **scope, rationale, and concrete next steps**.

---

## Goals of This Addendum

- Close gaps between agreed UX decisions and current implementation
- Preserve the existing component’s architecture and responsibilities
- Enable incremental improvements without refactors or schema changes

---

## Follow-Up Tasks

### 1. Namespace-Based Visual Grouping

**Current State**
- Culture tags are rendered as a flat list
- Namespace (`biome`, `settlement`, `guild`) is displayed per option but not grouped

**Task**
- Introduce visual grouping headers in the option list based on `option.source`
- Grouping must be:
  - Derived from existing data
  - Order-preserving within each group
  - Non-configurable

**Implementation Notes**
- Use a computed projection (e.g. `groupedOptions`)
- Render group headers (`Biome`, `Settlement`, `Guild`) conditionally
- No changes to `CultureTagOption` required

**Rationale**
- Improves scanability and cognitive load
- Aligns with meeting decision that namespaces are structural, not cosmetic

---

### 2. Make Selected Tokens Directly Actionable

**Current State**
- Selected tags are displayed as non-interactive tokens
- Removal requires reopening the combobox and reselecting the option

**Task**
- Allow removal of selected tags directly from the token row
- Tokens must be:
  - Keyboard-focusable
  - Clickable
  - Removable via keyboard (`Enter`, `Backspace`, `Delete`)

**Implementation Notes**
- Reuse existing `toggleOption(tagId)` logic
- Add `tabindex`, `role="button"`, and accessible labels
- No new state required

**Rationale**
- Dramatically improves speed for power users
- Required for full keyboard accessibility
- Matches “selected tags are facts” decision

---

### 3. Optional Usage / Rarity Signal Support

**Current State**
- All tags appear visually equal
- No indication of how widely a tag is used

**Task**
- Add optional support for displaying usage count or rarity metadata per tag

**Implementation Notes**
- Extend `CultureTagOption` *optionally* (e.g. `usageCount?: number`)
- Render only if present
- Do not compute usage in this component

**Rationale**
- Enables future UX improvements without refactor
- Supports designer awareness of overuse or rarity
- Keeps combobox presentation-only

---

### 4. Document Context-Sensitive Ordering Responsibility

**Current State**
- Options render in provided order
- No internal reordering logic exists

**Task**
- Explicitly document that:
  - Context-sensitive ordering is handled by the parent
  - The combobox does not infer or modify tag relevance

**Implementation Notes**
- No code changes required
- Add inline documentation or component-level comment

**Rationale**
- Prevents future misuse or overloading of the component
- Preserves clean separation of concerns

---

### 5. Preserve Checkbox Grid as a Separate Fallback Component

**Current State**
- Combobox does not include checkbox-grid fallback
- Fallback exists conceptually but not in this component

**Task**
- Ensure checkbox-grid fallback remains a separate component
- Toggle between combobox and grid at a higher level when needed

**Non-Task**
- Do not add checkbox-grid logic to this component

**Rationale**
- Keeps combobox focused and composable
- Avoids accessibility edge cases bloating the primary interaction

---

## Explicit Non-Goals

The following are intentionally **out of scope** for this component:

- ❌ Tag creation, editing, or deletion
- ❌ Automatic or AI-driven tag assignment
- ❌ Validation logic or conflict resolution
- ❌ Analytics computation
- ❌ Schema or model changes
- ❌ Modal-based selection workflows

---

## Architectural Integrity Check

These follow-ups:
- Preserve determinism
- Maintain accessibility guarantees
- Avoid schema duplication
- Respect existing Angular signal patterns
- Keep the component single-responsibility

---

## Summary

This addendum ensures the Culture Tag Combobox:
- Fully reflects agreed UX decisions
- Scales with future tag growth
- Remains accessible, performant, and maintainable
- Evolves through small, intentional improvements

**Guiding Principle (Reaffirmed):**
> The combobox assigns meaning — it does not invent it.
