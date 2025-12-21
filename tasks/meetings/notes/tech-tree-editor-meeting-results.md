# Tech Tree Editor Overview – Design Meeting Outcomes

**Meeting Type:** Orientation & design principles alignment  
**Phase:** Phase 2 close-out → Phase 3 planning  
**Scope:** Tech tree editor overview (explicitly excluding Action Dock)

---

## Decisions

### 1. The Overview Is a Cognitive Surface, Not an Action Hub
- The tree editor overview exists to support:
  - Orientation
  - Reasoning
  - Structural understanding
- It is **not** the primary place for:
  - Import/export
  - Destructive actions
  - Global state changes
- Operational controls remain the responsibility of the **Action Dock**

---

### 2. Target User Is System-Literate but Fallible
- The editor is designed for users who:
  - Understand tech trees and systems design
  - Regularly work with complex interdependencies
- The overview must:
  - Reward expertise
  - Prevent accidental or implicit mutations
- Safety and clarity are prioritized over raw speed

---

### 3. Overview Prioritizes Orientation Over Precision
- The overview answers:
  - “What is going on in this tree?”
  - “Where are the bottlenecks or problems?”
- Precision editing belongs to:
  - Node Detail Panel
  - Dedicated workflows
- Interactions in the overview must be:
  - Obvious
  - Reversible
  - Low-risk

---

### 4. Clear Visual Hierarchy Is Mandatory
At overview level, the following hierarchy is enforced:

1. Tier progression and vertical rhythm
2. Relative importance of nodes
3. Dependency direction and flow
4. Validation states (errors before warnings)

All other information is secondary or contextual.

---

### 5. Information Density Is Actively Managed
- The overview should feel **calm**, not exhaustive
- It must avoid trying to surface all node data at once
- Progressive disclosure is preferred over dense presentation

---

### 6. Orientation Cues Are In-Scope for Phase 3
The overview must support spatial and cognitive orientation through:
- Strong tier anchors
- Clear dependency direction
- Visual focus on active paths
- De-emphasis of irrelevant nodes when focused

These cues are considered core UX, not polish.

---

### 7. The Overview Primarily Serves “Scan & Reason” Workflows
Three workflows were identified:

1. Scan & reason about the tree
2. Adjust structure (move, re-tier, reorder)
3. Deep edit node details

The overview primarily optimizes for **workflow #1**.

---

### 8. Power Features Are Secondary to Clarity
- Keyboard shortcuts and accelerators are allowed
- They must never be the only way to perform an action
- The UI must remain self-explanatory without shortcut knowledge

---

### 9. Desktop-First, Large-Canvas Assumptions
- The editor is desktop-first
- Large canvases are expected and supported
- Responsive behavior focuses on graceful degradation, not mobile parity

---

## Tasks

### Visual Hierarchy & Orientation
- [ ] Strengthen tier headers as visual anchors
- [ ] Clarify dependency direction and flow
- [ ] Emphasize active dependency paths
- [ ] De-emphasize irrelevant nodes during focused states

---

### Interaction Safety
- [ ] Ensure overview interactions are reversible
- [ ] Avoid implicit structural changes
- [ ] Gate higher-risk edits behind explicit modes or panels

---

### Information Density Control
- [ ] Audit which node attributes are shown at overview level
- [ ] Remove or defer low-priority information
- [ ] Define progressive disclosure rules

---

### Workflow Support
- [ ] Validate overview effectiveness for “scan & reason” tasks
- [ ] Ensure structural adjustments remain clear and intentional
- [ ] Prevent precision editing from creeping into the overview

---

### Accessibility
- [ ] Ensure orientation cues do not rely on color alone
- [ ] Maintain clear focus indicators
- [ ] Support keyboard navigation without requiring shortcuts

---

## Considerations & Constraints

### Cognitive Load
- The overview must reduce mental effort, not add to it
- Visual calm is a success metric
- Overloading the overview is considered a design failure

---

### Safety & Trust
- Users must trust that simply navigating the overview is safe
- Structural changes must feel intentional and explicit
- Undo/redo expectations should be respected

---

### Separation of Responsibilities
- Overview = thinking, understanding, navigating
- Action Dock = committing, importing/exporting, global operations
- Blurring this line is explicitly discouraged

---

### Extensibility
- Phase 3 enhancements must:
  - Fit within the overview’s cognitive role
  - Avoid introducing new operational responsibilities
- New features should first ask:
  “Does this help the user *understand* the tree?”

---

## Summary

- The Tree Editor Overview is a calm, orientation-first surface
- It prioritizes understanding, flow, and safety
- Precision and power live elsewhere
- Action Dock responsibilities remain separate
- Phase 3 success is measured by reduced cognitive load

**Guiding Principle:**
> The overview is where you think.  
> The action dock is where you commit.
