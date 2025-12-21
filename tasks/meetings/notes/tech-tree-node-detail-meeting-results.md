# Tech Tree Node Detail Panel – Design Meeting Outcomes

**Meeting Type:** UX / Systems Editing Surface design alignment  
**Phase:** Phase 2 consolidation → Phase 3 refinement  
**Scope:** Form-based editing of individual technology node properties

---

## Decisions

### 1. The Detail Panel Edits Canonical Data
- The node detail panel is the **authoritative editor** for a single technology node
- Changes made here update canonical data immediately
- The panel reflects *truth*; the canvas provides *context*

---

### 2. The Panel Is Single-Node Focused
- The panel edits one node at a time
- Bulk editing and multi-node workflows are explicitly deferred
- The panel is not a discovery or visualization surface

---

### 3. Sectioned Vertical Layout (No Tabs)
- Properties are organized into vertical sections, not tabs
- Sections may be collapsible but are never hidden behind navigation
- Validation messages must always remain visible

**Agreed Section Order (High → Low Stability):**
1. Identity & Naming  
2. Visual Identity  
3. Prerequisites  
4. Effects  
5. Metadata / Advanced  

---

### 4. Identity Changes Are Deliberate
- **Node ID**
  - Editable only in an explicit, guarded mode
  - Strong validation required
  - Clear warnings about downstream impact
- **Display Name & Description**
  - Inline editable
  - Low-friction, immediate feedback

---

### 5. Visual Properties Must Not Fight the Canvas
- Tier edits in the panel immediately reflect on the canvas
- Display order is secondary and treated as an advanced concern
- The panel must never contradict spatial placement on the canvas

---

### 6. Prerequisite Management Is Collaborative
- The panel handles:
  - Adding and removing prerequisites
  - Displaying the prerequisite list
- The canvas handles:
  - Spatial reasoning
  - Relationship visualization
- Raw ID lists are not exposed to users

---

### 7. Effects Are Edited via Type-Specific Components
- Effects configuration is composed of dedicated subcomponents
- Each effect type:
  - Defines its own inputs
  - Defines its own validation
- No monolithic “effects form” is introduced

---

### 8. Culture Tag Editing Reuses Existing Components
- Culture tags are edited using the agreed multi-select combobox
- Namespace grouping, validation, and feedback remain consistent
- No tag creation or management occurs in the panel

---

### 9. Real-Time Validation Is Required
- Validation runs continuously as users edit
- Severity is clearly distinguished:
  - Errors block export
  - Warnings inform design decisions
- Validation feedback is:
  - Inline
  - Field-associated
  - Never hidden or delayed

---

### 10. Changes Apply Immediately
- No global “Save” button
- Canonical data updates instantly
- Dangerous edits are gated by explicit action, not confirmation dialogs
- Undo/redo support is deferred to Phase 3

---

### 11. The Panel Is Reactive to Canvas Selection
- Selecting a node in the canvas populates the panel
- The panel scrolls to top on node change
- Changes persist when focus shifts back to the canvas
- The panel never steals control from the canvas

---

### 12. Accessibility Is a First-Class Requirement
- Logical tab order across all fields
- Explicit labels and instructions for all inputs
- Error messages associated via ARIA
- Keyboard shortcuts for common actions
- Icon previews include alternative text

---

## Tasks

### Layout & Structure
- [ ] Implement sectioned vertical layout with collapsible sections
- [ ] Ensure validation messages remain visible across sections
- [ ] Define consistent spacing and information density

---

### Identity & Core Fields
- [ ] Implement guarded editing mode for Node ID
- [ ] Add strong validation and warnings for ID changes
- [ ] Support inline editing for display name and description

---

### Prerequisites
- [ ] Implement prerequisite selector using known nodes
- [ ] Add live validation for cycles and invalid chains
- [ ] Keep prerequisite visualization on the canvas

---

### Effects
- [ ] Implement type-specific effect editor components
- [ ] Define validation rules per effect type
- [ ] Integrate effect validation with global validation pipeline

---

### Culture Tags
- [ ] Integrate existing culture tag combobox
- [ ] Surface inline validation and usage feedback
- [ ] Ensure consistent behavior with other tag surfaces

---

### Validation & Feedback
- [ ] Implement real-time validation model
- [ ] Distinguish warnings vs errors visually and semantically
- [ ] Associate messages with fields via ARIA

---

### Workflow Integration
- [ ] Sync panel state with canvas selection
- [ ] Preserve edits when switching focus
- [ ] Support quick, low-friction edits

---

### Accessibility
- [ ] Validate tab order and keyboard navigation
- [ ] Ensure all form controls have accessible labels
- [ ] Link error messages to inputs for screen readers

---

## Considerations & Constraints

### Usability
- The panel must support both:
  - Careful, deliberate editing
  - Quick iteration
- Information density should increase progressively
- Complex fields should be composed, not flattened

---

### Safety & Trust
- Users must understand the impact of identity and prerequisite changes
- Accidental destructive edits must be difficult
- Over-confirmation is avoided in favor of explicit modes

---

### Determinism
- All edits serialize cleanly
- No UI-only state leaks into exported data
- The panel never introduces implicit structure

---

### Extensibility
- Design must accommodate:
  - Bulk editing (future)
  - Undo/redo history
  - Quick-edit overlays
- No schema changes required for these enhancements

---

## Summary

- The node detail panel edits canonical truth
- Sectioned layout preserves clarity and validation visibility
- Complex domains (effects, prerequisites) are handled compositionally
- Immediate feedback and accessibility are foundational
- The panel and canvas cooperate without duplicating responsibility

**Guiding Principle:**
> The detail panel should make intent explicit  
> and mistakes difficult, without slowing experts down.
