# Tech Tree Main Grid (Tech Canvas) – Design Meeting Outcomes

**Meeting Type:** UX / Core Interaction Systems design alignment  
**Phase:** Phase 2 consolidation → Phase 3 foundation  
**Scope:** Core grid layout, node interaction, prerequisite visualization, scalability

---

## Decisions

### 1. The Grid Is the Primary Editing Surface
- The main grid is the **center of gravity** of the Tech Tree Editor
- All other panels (detail, actions, validation) are supporting surfaces
- If the grid feels fragile or misleading, the entire editor fails

---

### 2. The Grid Is a Canvas (Experientially)
- Internally:
  - Tier-banded
  - Grid-aligned
  - Deterministic ordering preserved
- Experientially:
  - A **pan-and-zoom canvas**
  - Spatial navigation is first-class
- From this point forward, the system is referred to as the **Tech Canvas**

---

### 3. Spatial Layout Is Editorial, Not Canonical
- Node position on the canvas:
  - Is an editorial aid
  - Must never silently mutate canonical ordering
- Export determinism is preserved
- Structural meaning (tier, prerequisites) remains explicit

---

### 4. Zoom Is the Primary Scalability Mechanism
- The grid must scale from:
  - Small trees (~10 nodes)
  - To large trees (100+ nodes)
- Zoom level controls:
  - Node visual density
  - Connection fidelity
  - Amount of visible metadata
- Grid size itself does not change to accommodate scale

---

### 5. Nodes Are Componentized, Not Boxes
- Each tech node is a dedicated component
- Node presentation:
  - Adapts to zoom level
  - Reflects selection, validation, and focus state
- No permanent “importance” ranking is encoded visually

---

### 6. Tier Is the Primary Visual Hierarchy
- Tier bands provide the strongest structural signal
- Category and effects provide secondary, contextual cues
- Hierarchy is situational and derived, not hard-coded

---

### 7. Prerequisite Visualization Is Progressive
- Connections are explanatory, not decorative
- Connection detail scales with zoom:
  - Zoomed out: simplified, straight lines
  - Medium zoom: routed paths, active emphasis
  - Zoomed in: full fidelity and interaction
- No user-facing toggle for connection complexity

---

### 8. Drag & Drop Remains a Core Interaction
- Direct manipulation is required for spatial reasoning
- Drag & drop must be:
  - Predictable
  - Snapped and clamped
  - Visually previewed
- Structural changes (tier shifts, prerequisite changes):
  - Require explicit mode
  - Must never be accidental

---

### 9. Accessibility Shapes Architecture
- The grid must be usable without a mouse
- Required support includes:
  - Tab and arrow-key navigation
  - Keyboard-based selection and movement
  - Screen reader-compatible grid semantics
- Accessibility is a first-order design constraint

---

### 10. Performance Is a UX Requirement
- Large trees must remain responsive
- Required strategies include:
  - Virtualized node rendering
  - Lazy connection calculation
  - Viewport-based updates
- Visual polish must never block interaction

---

## Tasks

### Canvas & Navigation
- [ ] Implement pan-and-zoom behavior for the Tech Canvas
- [ ] Ensure zoom level drives visual density and detail
- [ ] Support focus and centering on selected nodes

---

### Node Components
- [ ] Implement zoom-responsive node templates
- [ ] Define visual states (selected, focused, invalid, active path)
- [ ] Ensure nodes remain readable at multiple scales

---

### Grid & Tier Layout
- [ ] Maintain tier-banded layout with clear visual separation
- [ ] Support dynamic tier addition/removal
- [ ] Clamp node movement to valid tier boundaries

---

### Prerequisite Connections
- [ ] Implement zoom-based connection fidelity
- [ ] Highlight active prerequisite paths
- [ ] Optimize connection rendering for large trees

---

### Drag & Drop Ergonomics
- [ ] Add snap-to-grid behavior
- [ ] Provide clear drag previews and drop targets
- [ ] Gate structural changes behind explicit modes

---

### Accessibility
- [ ] Define keyboard navigation model for the canvas
- [ ] Ensure logical tab order matches spatial layout
- [ ] Add screen reader-friendly grid and node semantics

---

### Performance
- [ ] Virtualize node rendering for large trees
- [ ] Cache and reuse connection paths where possible
- [ ] Avoid layout thrashing during drag operations

---

## Considerations & Constraints

### Usability
- The grid must support both:
  - Exploratory reasoning
  - Precise editing
- Exploration must be mutation-safe
- Visual clutter must degrade gracefully with scale

---

### Determinism
- Spatial layout is editorial only
- Export ordering and prerequisite logic remain canonical
- No implicit structural changes allowed

---

### Visual Fidelity
- Visual complexity is progressive, not static
- Simplification at scale is a feature, not a compromise
- Color must never be the sole carrier of meaning

---

### Extensibility
- Design must accommodate:
  - Multi-selection (future)
  - Search and filtering overlays
  - Bulk operations
- No schema changes required for these enhancements

---

## Summary

- The main grid is formally elevated to a **Tech Canvas**
- Zoom is the key abstraction for scalability and clarity
- Nodes and connections adapt progressively to context
- Drag & drop is powerful but explicitly constrained
- Accessibility and performance are foundational, not optional

**Guiding Principle:**
> The canvas should help designers think spatially  
> without ever lying about structure.
