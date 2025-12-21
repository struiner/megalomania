# Tech Tree Editor Header Section – Design Meeting Outcomes

**Meeting Type:** UX alignment & scope definition  
**Phase:** Phase 3 preparation  
**Scope:** Editor header section (identity & metadata only)

---

## Decisions

### 1. The Header Is an Identity & Trust Surface
- The header’s primary role is to answer:
  > “What am I editing right now?”
- It provides identity, provenance, and state
- It is not an action hub or editing surface

---

### 2. Information Hierarchy Is Explicit

**Priority Order:**
1. **Tree Name** – primary identifier, most prominent
2. **Version Number** – visible but secondary, indicates state
3. **Source Label** – read-only provenance, lowest emphasis

This hierarchy must be visually reinforced through typography and spacing.

---

### 3. Header Is Read-Only by Default
- No inline editing of:
  - Tree name
  - Version number
  - Source
- Renaming, versioning, or source changes (if supported) occur through
  deliberate, explicit workflows elsewhere
- Prevents accidental or ambiguous edits

---

### 4. No Primary Actions in the Header
- The header must not include:
  - Save
  - Import / export
  - Preview
  - Destructive actions
- Operational controls remain exclusively in the **Action Dock**

---

### 5. Versioning Is Reflected, Not Controlled
- The header displays the current version
- Version increments are:
  - Automatic or system-driven
  - Not user-controlled from the header
- The header reflects state; it does not mutate it

---

### 6. Source Information Is Visible but De-Emphasized
- Source label is:
  - Always visible by default
  - Read-only
  - Lower visual priority than name and version
- Hiding source by default is explicitly discouraged

---

### 7. Persistent Placement
- The header remains visible during editing
- It anchors the editor spatially and cognitively
- Any collapsing behavior must be:
  - Explicit
  - Reversible
  - Non-default

---

### 8. Visual Treatment Emphasizes Calm & Clarity
- Compact layout (single-line or minimal multi-line)
- Scannable in under half a second
- Avoids decorative or interactive noise
- Integrates cleanly with the overall editor design system

---

## Tasks

### Information Architecture
- [ ] Define typographic hierarchy for name, version, and source
- [ ] Ensure tree name is the strongest visual anchor
- [ ] De-emphasize metadata without hiding it

---

### Interaction Constraints
- [ ] Enforce read-only behavior for all header fields
- [ ] Prevent accidental focus or edit affordances
- [ ] Route all renaming/versioning through explicit workflows

---

### Layout & Persistence
- [ ] Ensure header remains visible during scrolling
- [ ] Validate layout at common viewport sizes
- [ ] Avoid vertical bloat or unnecessary spacing

---

### Accessibility
- [ ] Provide clear screen reader labels for:
  - Tree name
  - Version
  - Source
- [ ] Ensure metadata does not rely on color alone
- [ ] Support text scaling without layout breakage

---

### Integration
- [ ] Verify clear separation from Action Dock controls
- [ ] Ensure header does not duplicate operational affordances
- [ ] Maintain consistent spacing and alignment with overview

---

## Considerations & Constraints

### Trust & Safety
- Users must always know which tree they are editing
- Accidental edits at the header level are unacceptable
- Clarity is more important than flexibility

---

### Workflow
- Header supports confirmation and orientation, not speed
- It should fade into the background during normal work
- It should stand out immediately when context matters

---

### Extensibility
- Phase 3+ enhancements may include:
  - Version history
  - Author attribution
  - Timestamps
- Any additions must preserve:
  - Read-only default
  - Clear hierarchy
  - Non-operational role

---

## Summary

- The header is a stable, read-only identity surface
- It reinforces trust, context, and provenance
- It does not compete with the overview or action dock
- Phase 3 success is measured by clarity, not feature count

**Guiding Principle:**
> The header confirms where you are,  
> not what you are about to do.
