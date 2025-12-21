# HUD Capability Authoritative Feed Integration

## Task Summary & Purpose
The `HudCapabilityService` currently uses hardcoded defaults for feature flags and initialized panels instead of an authoritative capability feed backed by ledger/config. This task replaces the static defaults with dynamic capability loading.

**Original TODO:** `// TODO: Replace hardcoded defaults with authoritative capability feed (ledger/config backed).` in `v1/src/app/pages/hud/hud-capability.service.ts:35`

## Explicit Non-Goals
- Do not implement the ledger/config backend systems for capability storage
- Do not modify the capability provider interface or existing resolution logic
- Do not change feature flag names or panel initialization behavior
- Do not add new capability types or categories

## Fidelity & Constraints
- **Target Stage:** Structural (skeleton) - establish the pattern for authoritative capability loading
- **Reference:** Ledger-first world model (capabilities must be derived from authoritative sources)
- **Domain:** Frontend surface and HUD system architecture

## Agent Assignments
- **Primary:** Frontend Developer
- **Collaborators:** Ledger Engineer (for capability feed design), Game Designer (for feature flag strategy)

## Deliverables & Review Gate
- [ ] Refactor `createDefaultFeatureFlags()` to accept a capability feed parameter
- [ ] Update service constructor to support graceful fallback when feed is unavailable
- [ ] Add configuration for capability feed endpoints or ledger event sources
- [ ] Implement capability cache invalidation and refresh mechanisms
- [ ] Add comprehensive error handling for capability feed failures

**Review Gate:** Frontend Developer validates that dynamic capability loading works correctly and gracefully handles feed unavailability.

## Dependencies & Sequencing
- **Prerequisites:** None - can proceed with interface design
- **Follow-up Tasks:** Implementation of backend capability feed, feature flag governance system

## Open Questions / Clarifications
- Should the service cache capabilities locally and refresh periodically, or always query the authoritative source?
- What should happen when the capability feed is unavailable - full fallback to defaults or partial functionality?
- Do we need to support capability hot-reloading without service restarts?