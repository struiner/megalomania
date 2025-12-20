# Task Specification: Preview Dialog Prerequisite Visualization

## Task Summary & Purpose

Implement connection overlay rendering for prerequisite relationships that maintains clarity at multiple viewport sizes and avoids visual clutter for dense prerequisite graphs. Connection overlays must be always visible and emphasize clarity over stylistic detail.

**Why this exists:** Current preview lacks proper prerequisite visualization and doesn't scale well, leading to confusing relationship displays and poor understanding of technology dependencies.

## Explicit Non-Goals

- Do not implement interactive connection editing
- Do not create connection analytics or pathway analysis
- Do not modify the underlying prerequisite data structure
- Do not implement connection customization or styling options

## Fidelity & Constraints

**Target Fidelity:** Functional (working connection overlay rendering)
**Constraints:** Must scale to large trees, maintain clarity, avoid visual clutter
**Reference Documents:** 
- `megalomania/tasks/meetings/notes/tech-tree-preview-dialog-meeting-results.md`
- `megalomania/tasks/tech-tree-phase3-roadmap.md` (Wave 3: Prerequisite Visualization)

## Agent Assignments

**Primary Executor:** Frontend Developer
**Collaborators:** Game Designer (connection clarity validation), QA & Test Engineer (visual clarity testing)
**Architecture Steward:** Review for visual clarity vs. information density balance

## Deliverables & Review Gate

**Required Outputs:**
1. SVG-based connection overlay renderer optimized for preview
2. Connection clarity scaling for different viewport sizes
3. Visual clutter avoidance for dense prerequisite graphs
4. Integration with existing prerequisite data and validation

**Acceptance Criteria:**
- [ ] Connection overlays are always visible and clearly rendered
- [ ] Maintains clarity at multiple viewport sizes
- [ ] Avoids visual clutter for complex prerequisite graphs
- [ ] Connection rendering doesn't interfere with node readability
- [ ] Game Designer validates connection clarity and usefulness

## Dependencies & Sequencing

**Prerequisites:** Preview dialog layout/structure and main grid connection implementation
**Sequencing:** Must be completed before culture tag legend implementation

## Open Questions / Clarifications

- Should connection paths be simplified for readability or show full routing?
- How should circular prerequisites be visually handled in the preview?
- Are there specific connection styling requirements for different relationship types?

---

**Review Gate Questions:**
1. Does prerequisite visualization remain clear across all viewport sizes?
2. Is visual clutter avoided for complex prerequisite graphs?
3. Do connection overlays enhance rather than hinder tree comprehension?