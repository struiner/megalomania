# Tech Tree Editor – Design Meeting Outcomes

**Meeting Type:** Cross-disciplinary design alignment  
**Phase:** Phase 2 close-out → Phase 3 preparation  
**Scope:** Editor usability, canvas interaction, node representation

---

## Core Decisions (Foundational – Agreed Early)

These decisions were made at the start of the meeting and are **non-negotiable constraints** for all subsequent work.

### 1. Ease of Use Is a Primary Goal
- The editor must be:
  - Learnable without documentation
  - Safe to explore without fear of mutation
  - Efficient for power users
- Discoverability is prioritized over visual novelty

---

### 2. Direct Manipulation via Drag & Drop
- Users must be able to:
  - Reposition nodes directly
  - Reason spatially about progression
- Drag & drop is considered a **core interaction**, not an enhancement
- Structural changes must be explicit and mode-gated (see below)

---

### 3. Nodes Are First-Class Components
- Tech nodes are **not** simple boxes or SVG elements
- Each node is a dedicated Angular component
- Nodes may:
  - Surface meaningful data at a glance
  - Change presentation with zoom and mode
  - Contain limited inline affordances

This decision enables:
- At-a-glance comprehension
- Reduced modal usage
- Progressive disclosure of complexity

---

## Subsequent Decisions (Derived & Confirmed)

These build directly on the core decisions above.

---

### 4. Unified Tech Canvas
- Replace:
  - Overview Tree Map
  - Minimal Tree Diagram
- Introduce a single, pan/zoom-enabled canvas
- Canvas supports:
  - Spatial reasoning
  - Drag & drop
  - Inline relationship visualization

---

### 5. Explicit Interaction Modes
To preserve ease of use and safety:

| Mode | Purpose | Mutability |
|----|--------|-----------|
| Explore (default) | Navigate, inspect | None |
| Edit | Adjust node data | Node-local |
| Structure | Change dependencies / tiers | Explicit |

Modes are required to prevent accidental edits during exploration.

---

### 6. No Visual Grammar Registry
- ❌ No separate visual grammar or configuration layer
- ❌ No parallel schema
- ❌ No duplicated semantics

**Rationale:**  
The existing TypeScript model already encodes all required meaning.

---

### 7. Projection-Based Visualization
- Visual behavior is **derived**, not configured
- Projections depend on:
  - Existing node fields
  - Validation output
  - Zoom level
  - Interaction mode
- The canvas is an *editorial projection*, not a new system

---

### 8. Canonical Model Remains Authoritative
- No changes to:
  - `TechTree`
  - `TechNode`
  - `TechNodeEffects`
  - Deterministic ordering / export
- Spatial layout never mutates canonical ordering implicitly

---

## Tasks

### Canvas & Interaction
- [ ] Implement `TechCanvasComponent`
- [ ] Add pan / zoom / focus navigation
- [ ] Implement drag & drop with mode gating
- [ ] Route Action Dock context from canvas state

---

### Node Components
- [ ] Implement base `TechNodeCanvasComponent`
- [ ] Support zoom-responsive templates
- [ ] Surface:
  - Icon
  - Tier
  - Category
  - Culture tags
  - Validation state
- [ ] Enforce per-node visual complexity limits

---

### Projection Rules
- [ ] Define what node data is visible at each zoom level
- [ ] Define visual emphasis rules (tier, effects, culture)
- [ ] Map validation severity to visual affordances

---

### Prerequisites
- [ ] Render prerequisites as spatial edges
- [ ] Support active-path highlighting
- [ ] Optional collapse/expand of upstream branches

---

### Migration
- [ ] Deprecate Overview Tree Map
- [ ] Deprecate Minimal Tree Diagram
- [ ] Preserve detail panel for full editing

---

## Considerations & Constraints

### Usability
- Exploration must be mutation-proof
- Dragging must feel intentional, not fragile
- Inline affordances must never overwhelm scanability

---

### Determinism
- Export ordering remains canonical
- Canvas layout is editorial only
- Validation always runs against the same model

---

### Accessibility
- Full keyboard navigation
- Focus indicators independent of color
- ARIA labels on node components

---

## Summary

- Ease of use, drag & drop, and componentized nodes are **foundational decisions**
- The canvas is a new *interaction surface*, not a new data system
- All visual meaning is derived from the existing model
- Safety and determinism are preserved by explicit modes

**Guiding Principle:**
> Make the right thing obvious,  
> the dangerous thing explicit,  
> and the complex thing readable.
