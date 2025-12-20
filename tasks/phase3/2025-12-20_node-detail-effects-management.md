# Task Specification: Node Detail Panel Effects Management

## Task Summary & Purpose

Implement type-specific effect editor components with dedicated validation rules for each effect type. Effects configuration must be compositional, with each effect type defining its own inputs and validation while integrating with the global validation pipeline.

**Why this exists:** Current effects editing uses monolithic forms that don't scale well and lack proper validation, leading to complex, error-prone effect configuration workflows.

## Explicit Non-Goals

- Do not implement effect business logic or validation algorithms
- Do not create new effect types or modify existing effect schemas
- Do not implement effect execution or simulation
- Do not create effect analytics or impact analysis

## Fidelity & Constraints

**Target Fidelity:** Functional (working effect editors with type-specific validation)
**Constraints:** Must be compositional, integrate with global validation, maintain extensibility
**Reference Documents:** 
- `megalomania/tasks/meetings/notes/tech-tree-node-detail-meeting-results.md`
- `megalomania/tasks/tech-tree-phase3-roadmap.md` (Wave 2: Effects)

## Agent Assignments

**Primary Executor:** Frontend Developer
**Collaborators:** Game Designer (effect UX validation), QA & Test Engineer (validation testing)
**Architecture Steward:** Review for compositional architecture and validation integration

## Deliverables & Review Gate

**Required Outputs:**
1. Type-specific effect editor component architecture
2. Individual effect type editors with custom inputs and validation
3. Global validation pipeline integration for effects
4. Compositional effects configuration system

**Acceptance Criteria:**
- [ ] Each effect type has dedicated editor with custom inputs
- [ ] Type-specific validation rules integrate with global validation
- [ ] Effects configuration is compositional and extensible
- [ ] Validation feedback is immediate and contextually relevant
- [ ] Game Designer validates effect editing workflow and usability

## Dependencies & Sequencing

**Prerequisites:** Node detail panel layout/structure and prerequisite management implementation
**Sequencing:** Must be completed before culture tags integration

## Open Questions / Clarifications

- Should effect editors support drag-and-drop reordering?
- How should complex effect validation be presented to users?
- Are there specific effect type groupings that should influence editor organization?

---

**Review Gate Questions:**
1. Are effect editors composable and extensible for new effect types?
2. Does validation integration provide clear, actionable feedback?
3. Is the effects editing workflow intuitive for both simple and complex effects?