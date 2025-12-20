# Task Specification: Preview Dialog Layout & Structure

## Task Summary & Purpose

Implement tier-banded, export-aligned preview layout that maintains deterministic ordering and visual parity with the editor grid. The preview must exactly match export structure while providing clear, readable presentation for large trees.

**Why this exists:** Current preview lacks proper alignment with export structure and doesn't scale well for large trees, leading to discrepancies between preview and actual export behavior.

## Explicit Non-Goals

- Do not implement editing functionality within the preview
- Do not create alternate layouts or tabbed views
- Do not modify the underlying export logic
- Do not implement preview customization or configuration

## Fidelity & Constraints

**Target Fidelity:** Functional (working preview layout with export alignment)
**Constraints:** Must exactly match export structure, maintain readability at scale
**Reference Documents:** 
- `megalomania/tasks/meetings/notes/tech-tree-preview-dialog-meeting-results.md`
- `megalomania/tasks/tech-tree-phase3-roadmap.md` (Wave 3: Preview Dialog)

## Agent Assignments

**Primary Executor:** Frontend Developer
**Collaborators:** Game Designer (layout clarity validation), QA & Test Engineer (export parity testing)
**Architecture Steward:** Review for export determinism compliance

## Deliverables & Review Gate

**Required Outputs:**
1. Tier-banded preview layout component
2. Deterministic ordering system matching export output
3. Visual parity with editor grid while maintaining preview clarity
4. Modal dialog structure with proper focus management

**Acceptance Criteria:**
- [ ] Layout exactly matches export structure and ordering
- [ ] Tier bands provide clear visual organization
- [ ] Maintains readability for trees with 100+ nodes
- [ ] Visual parity with editor grid where appropriate
- [ ] Game Designer validates layout clarity and export alignment

## Dependencies & Sequencing

**Prerequisites:** Design system tokens (typography, colors, spacing) and main grid implementation
**Sequencing:** Must be completed before node presentation implementation

## Open Questions / Clarifications

- Should preview support horizontal scrolling for wide trees or enforce width constraints?
- How should empty tiers be visually handled in the preview?
- Are there specific layout requirements for different tree sizes (small vs. large)?

---

**Review Gate Questions:**
1. Does the preview layout exactly match export structure and ordering?
2. Is the layout readable and navigable for large technology trees?
3. Does the system maintain visual parity with the editor grid appropriately?