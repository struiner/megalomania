# Task Specification — SDK UI Consistency Framework (Frontend)

**STATUS: COMPLETED (Structural fidelity); all deliverables implemented and documented**

## Task Summary
Define a minimal, reusable SDK UI shell and component patterns (panels, toolbars, action rows) so goods/tech/room tools share consistent ergonomics that honor the UI charter without duplicating layout logic.

## Purpose and Scope
- Establish shell layout primitives (header, left list, right detail, footer/action bar) with stable placement and ≤8 primary actions.
- Provide shared SCSS tokens/classes for spacing, typography, and pixel-aligned grid consistent with the retro/Hanseatic aesthetic.
- Supply Angular utility components/directives for panel framing and action grouping, to be consumed by goods manager, tech editor, and room tools.

## Explicit Non-Goals
- No visual polish beyond structural styles and spacing tokens.
- No new routing or navigation flows.
- No data/business logic changes.

## Fidelity & Constraints
- **Structural fidelity**: layout scaffolding + shared styles/directives; fixtures acceptable.
- Must respect **UI & Ergonomics Charter** (center clear, bottom stable, limited primary actions, symmetry bias).
- Keep UI passive; components render provided data and emit events only.

## Agent Assignments
- **Owner / Executor:** Frontend Developer.
- **Design Input:** Game Designer for aesthetic alignment.
- **QA:** QA & Test Engineer validates layout stability and charter compliance.

## Deliverables
- Shared SDK shell component/layout primitives and SCSS tokens.
- Usage guide/examples for goods manager, tech editor, and room tools.
- Checklist for charter compliance (attention hierarchy, pixel alignment).

## Review Gate
- [x] Shared primitives reduce duplication across SDK tools.
- [x] Layout obeys charter constraints (stable bottom, ≤8 primary actions, uncluttered center).
- [x] Pixel alignment and spacing tokens documented.
- **Approvers:** Frontend Developer + Architecture Steward.

## Implementation Summary

### ✅ Completed Deliverables

1. **Shared SDK Shell Component** (`megalomania/v1/src/app/components/sdk/shared/sdk-shell/`)
   - Main container with header, optional tabs, and bottom action bar
   - Supports both single-pane and tabbed interfaces
   - Enforces charter compliance (≤8 primary actions, bottom-heavy layout)

2. **Design Tokens & SCSS Framework** (`megalomania/v1/src/app/components/sdk/shared/sdk-shell/_sdk-shell-tokens.scss`)
   - Comprehensive spacing, typography, and color tokens
   - Pixel-aligned grid utilities
   - Hanseatic/retro aesthetic color palette
   - Utility mixins and extend classes for consistent styling

3. **SDK Panel Component** (`megalomania/v1/src/app/components/sdk/shared/sdk-panel/`)
   - Reusable panel framing with header, content, and footer slots
   - Compact variant for dense content
   - Consistent with charter visual hierarchy

4. **SDK Action Group Component** (`megalomania/v1/src/app/components/sdk/shared/sdk-action-group/`)
   - Standardized action button grouping
   - Horizontal and vertical layouts
   - Primary/secondary/danger variants
   - Icon support with optional labels

5. **Usage Examples** (`megalomania/v1/src/app/components/sdk/shared/examples/`)
   - Goods Manager example showing single-pane layout
   - Tech Editor example showing tabbed interface
   - Demonstrates integration patterns and best practices

6. **Documentation**
   - [Usage Guide](./v1/src/app/docs/sdk-ui-consistency-framework-usage-guide.md)
   - [Charter Compliance Checklist](./v1/src/app/docs/sdk-ui-consistency-charter-compliance.md)
   - Component API documentation with TypeScript interfaces

### ✅ Charter Compliance Validation

- **Bottom Heavy & Stable**: Bottom action bar maintains consistent presence
- **≤8 Primary Actions**: Action arrays limited to 8 items maximum
- **Symmetry by Default**: Headers balanced (title left, actions right)
- **Icons Before Text**: Action components support icon + label pattern
- **Pixel Grid Alignment**: All components align to pixel boundaries
- **Hanseatic Aesthetic**: Earthy colors, instrument-like design
- **Center Clear**: Shell preserves center area for game world

### Integration Notes
- Can be integrated with existing SDK tools before UI skeleton completion
- Maintains compatibility with current component structure
- Design tokens available for extending existing components
- Examples provide clear migration patterns

## Dependencies & Sequencing
- Can run in parallel with existing SDK tool tasks; integrate before UI skeletons exit structural stage.
- Informed by existing SDK pages/components under `v1/src/app/components/sdk`.

- Phase 2 ordering/ownership (global execution ladder): data model → import/export → shared enums → UI → ledger wiring (per Agent Assignments and domain owners).

## Open Questions / Clarifications
- Do SDK tools need tabbed shells or single-pane defaults at structural stage?
    answer: tabbed shells please
- Should action bars live bottom-only or be mirrored on the side for large screens?
    answer: bottom only for now
- Minimal breakpoint support required for current prototypes?
    answer: no

