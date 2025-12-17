# Task Specification — HUD Panel Block Messaging & Capability Wiring

**STATUS: TODO — needs UX-approved messaging and live capability sources.**

## Task Summary
Wire `HudAvailabilityService` and `HudRouteGuard` to real feature-flag/initialization sources and surface blocked panel feedback through HUD-native messaging instead of silent redirects or inline text toasts.

## Purpose and Scope
- Replace stubbed feature-flag and initialization predicates with data from the canonical capability service once exposed.
- Define and implement HUD-level messaging (toast/banner) for blocked overlay/tab interactions without introducing gameplay truth in the UI.
- Document fallback routing expectations and analytics hooks for blocked attempts.

## Explicit Non-Goals
- No gameplay-side entitlement changes or ledger mutations.
- No visual restyle of overlay tabs beyond messaging affordance hooks.
- No persistence of user acknowledgements; focus on per-attempt feedback.

## Fidelity & Constraints
- Target **Structural→Functional** fidelity: real predicates with minimal UI polish.
- Messaging must respect the UI ergonomics charter (peripheral, non-intrusive) and avoid occluding the viewport.
- Keep guard logic deterministic and side-effect free beyond navigation/messaging triggers.

## Agent Assignments
- **Owner / Executor:** Frontend Developer
- **Consulted:** Architecture Steward (truth boundaries), Game Designer (tone of messaging), QA (blocked/allowed scenarios)

## Deliverables
- Updated `HudAvailabilityService` consuming live capability sources with test hooks.
- HUD-level messaging component or pattern for blocked panels and tab selections.
- Documentation in HUD README outlining messaging triggers and fallback routes.

## Review Gate
- [ ] Blocked panels show clear, minimal HUD messaging without breaking navigation flow.
- [ ] Guards use authoritative capability data; no stubbed maps remain.
- [ ] No gameplay state is cached or mutated in UI components.

## Dependencies & Sequencing
- Depends on: Availability of capability/feature-flag provider.
- Related to: HUD overlay tab logic and standalone dialog routing.

## Open Questions / Clarifications
- Should blocked-panel messaging stack or coalesce when multiple tabs are gated?
- Which capability provider (ledger-derived vs. configuration) should be considered source-of-truth for HUD gating?
