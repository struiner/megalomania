# Tech Tree Icon Picker – Design Meeting Outcomes

**Meeting Type:** UX / Visual Systems design alignment  
**Phase:** Phase 2 consolidation → Phase 3 preparation  
**Scope:** Icon discovery, selection, preview, and accessibility

---

## Decisions

### 1. Icons Are Visual Identifiers, Not Data Fields
- Icons represent meaning but do not define it
- The icon picker is a **selector for curated assets**, not a creative tool
- Icon selection must remain:
  - Deterministic
  - Reversible
  - Safe to experiment with

---

### 2. Categorization Is Structural and Derived
- Icon categories (Structures, Goods, Guild/Culture, Settlement, Generic):
  - Already exist in the registry
  - Must be surfaced clearly in the UI
- Categories are:
  - Visually grouped
  - Not flattened
  - Not user-configurable
- No additional icon taxonomy or grammar registry is introduced

---

### 3. Grid-Based Selection Is the Target Interaction Model
- Icon selection should move beyond a native `<select>`
- A grid of icon tiles is the preferred long-term interaction model
- Grid supports:
  - Visual scanning
  - Keyboard navigation
  - Direct comparison

Native `<select>` is acceptable only as a temporary baseline.

---

### 4. Search Complements Browsing, It Does Not Replace It
- Text search is required for power users
- Category-based browsing remains essential for:
  - Discoverability
  - Accessibility
  - Onboarding
- Search must never be the only path to selection

---

### 5. Preview Is Informational, Not Ceremonial
- Icon preview should answer:
  - What is this icon?
  - What category does it belong to?
  - Will it read at small sizes?
- Preview is:
  - Inline or hover-based
  - Non-blocking
  - Non-modal by default

---

### 6. Contextual Surfacing, Not Automatic Selection
- Icons may be surfaced or ordered based on node context
- The system must not:
  - Automatically assign icons
  - Hide non-contextual icons
- Final selection always belongs to the designer

---

### 7. Icon Registry Remains Curated
- No user-uploaded custom icons
- No in-editor registry mutation
- Icon extension occurs via curated asset packs or DLC

---

### 8. Accessibility Is a First-Class Requirement
- Icon picker must support:
  - Full keyboard navigation
  - Screen reader accessibility
  - Visible focus indicators
- Each icon must expose:
  - Accessible name
  - Category context
- Custom UI is acceptable where it improves accessibility beyond native controls

---

### 9. Performance Is a UX Concern
- Large icon libraries must not block editor load
- Icon assets should be:
  - Lazy-loaded by category
  - Cached aggressively
- Thumbnails load before high-detail previews

---

## Tasks

### Picker Interaction
- [ ] Replace native `<select>` with a controlled picker trigger
- [ ] Implement popover/panel-based icon selection
- [ ] Render icons in a focusable, keyboard-navigable grid

---

### Categorization & Ordering
- [ ] Visually group icons by existing category
- [ ] Apply explicit category ordering (semantic, not alphabetical)
- [ ] Preserve deterministic ordering within categories

---

### Search & Discovery
- [ ] Add text-based search/filtering
- [ ] Ensure search coexists with category browsing
- [ ] Maintain accessibility for non-search discovery paths

---

### Preview & Feedback
- [ ] Add hover/focus-based icon preview
- [ ] Display icon metadata (category, frame, overlays)
- [ ] Ensure preview reflects small-size readability

---

### Accessibility
- [ ] Implement keyboard navigation across icon grid
- [ ] Add ARIA roles and labels for icon options
- [ ] Ensure focus state is visible and non-color-dependent

---

### Performance
- [ ] Lazy-load icon assets by category
- [ ] Optimize thumbnail rendering
- [ ] Avoid blocking editor load on icon data

---

## Considerations & Constraints

### Usability
- Icon selection should feel fast and low-risk
- One-click selection must always be reversible
- UI should favor recognition over recall

---

### Consistency
- Icon style and usage should remain coherent across the tech tree
- The picker should reinforce visual consistency, not undermine it

---

### Determinism
- Icon selection must serialize cleanly
- UI ordering must not affect exported data
- No implicit defaults beyond shared frame behavior

---

### Extensibility
- Design must allow for:
  - Growing icon libraries
  - Additional categories
  - Future bulk assignment workflows
- No schema changes required to support enhancements

---

## Summary

- Icon selection is a visual, not textual, task
- Grid-based interaction better matches user intent than form controls
- Categorization and preview are projection concerns, not schema concerns
- Accessibility and performance are treated as core design requirements
- The icon picker remains a selector, not an authoring tool

**Guiding Principle:**
> Icons should reinforce meaning instantly,  
> not require explanation or second-guessing.
