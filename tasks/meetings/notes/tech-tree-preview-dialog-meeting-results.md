# Tech Tree Preview Dialog – Design Meeting Outcomes

**Meeting Type:** UX validation & publishing workflow alignment  
**Phase:** Phase 2 validation surface → Phase 3 enhancement  
**Scope:** Read-only preview of a technology tree prior to export or publishing

---

## Decisions

### 1. The Preview Is a Validation Surface, Not an Editor
- The preview dialog is strictly **read-only**
- No direct editing is allowed inside the preview
- Its purpose is confidence-building and validation, not iteration

---

### 2. The Preview Reflects Export Reality
- The preview must **exactly match export structure**
  - Tier ordering
  - Node ordering
  - Prerequisite relationships
- Any discrepancy between preview and export is considered a bug
- The preview is the *last human-readable representation* before export

---

### 3. Single Canonical View (No Tabs or Modes)
- The preview opens into a single, canonical representation
- No tabbed views or alternate layouts in Phase 2
- Visual clarity is preferred over configurability

---

### 4. Tier-Banded Layout Is Retained
- Horizontal tier bands remain the primary organizational structure
- Layout mirrors the deterministic grid ordering
- Users should immediately recognize parity with the editor grid

---

### 5. Simplified Node Representation
- Nodes display:
  - Icon
  - Title
  - Tier
  - Category (if space allows)
- Full node details (effects, metadata) are not shown inline
- Hover or focus affordances may reveal limited secondary information

---

### 6. Prerequisite Visualization Is Mandatory
- Connection overlays are always visible
- Visual emphasis favors clarity over stylistic detail
- Relationship types are not expanded beyond `requires` in Phase 2

---

### 7. Culture Tags Are Shown as a Legend
- Culture tags are represented visually on nodes
- A persistent legend explains:
  - Namespace (biome / settlement / guild)
  - Color or glyph meaning
- The preview must make cultural constraints understandable at a glance

---

### 8. Modal-Based Delivery Is Retained
- Preview opens as a modal dialog
- Modal includes:
  - Clear title
  - Explicit close action
  - Escape-key handling
- Focus is trapped within the modal while open

---

### 9. The Preview Supports Large Trees Gracefully
- Large trees must remain readable and navigable
- Scrolling within the modal is acceptable
- Zoom and pan are deferred to Phase 3

---

### 10. Accessibility Is Non-Negotiable
- Modal follows full accessibility best practices:
  - Focus management
  - Keyboard navigation
  - Screen reader compatibility
- All visual relationships must have non-color-only cues
- High-contrast mode must remain legible

---

## Tasks

### Layout & Structure
- [ ] Implement tier-banded, export-aligned preview layout
- [ ] Ensure deterministic ordering matches export output
- [ ] Maintain visual parity with editor grid where appropriate

---

### Node Presentation
- [ ] Define simplified node card design for preview
- [ ] Ensure icon, title, and tier are clearly visible
- [ ] Add optional hover/focus detail affordances

---

### Prerequisite Visualization
- [ ] Render connection overlays efficiently for large trees
- [ ] Ensure connection clarity at multiple viewport sizes
- [ ] Avoid visual clutter for dense prerequisite graphs

---

### Culture Tag Legend
- [ ] Implement persistent culture tag legend
- [ ] Clearly map visual indicators to tag namespaces
- [ ] Ensure legend is keyboard and screen-reader accessible

---

### Modal Behavior
- [ ] Implement focus trapping within the modal
- [ ] Ensure escape and explicit close actions work consistently
- [ ] Preserve scroll position appropriately for large trees

---

### Performance
- [ ] Optimize rendering for trees with 100+ nodes
- [ ] Avoid unnecessary reflows during modal open/close
- [ ] Ensure SVG overlays do not degrade interaction responsiveness

---

### Accessibility
- [ ] Validate modal against WCAG requirements
- [ ] Ensure preview content is navigable via keyboard
- [ ] Provide alternative cues for visual relationships

---

## Considerations & Constraints

### Scope Discipline
- Editing features inside preview are explicitly out of scope
- Any “quick edit” functionality is deferred to Phase 3
- The preview should not evolve into a second editor

---

### Cognitive Load
- The preview prioritizes comprehension over density
- Users should be able to answer:
  - “Does this tree look correct?”
  - “Do the dependencies make sense?”
- Fine-grained data inspection remains in the detail panel

---

### Workflow Integration
- Preview should feel like a natural pause before export
- Opening and closing preview should be fast and low-friction
- Users should be able to iterate quickly between edit → preview

---

### Extensibility
- Design should allow future additions:
  - Zoom and pan
  - Comparison views
  - Validation overlays
- No schema changes are required to support these enhancements

---

## Summary

- The preview dialog is a **trust-building, read-only validation step**
- It must faithfully reflect export structure and ordering
- Visual clarity and accessibility take priority over configurability
- The preview integrates tightly with the publishing workflow
- Its success is measured by user confidence at export time

**Guiding Principle:**
> If the preview looks right,  
> the export should never surprise you.
