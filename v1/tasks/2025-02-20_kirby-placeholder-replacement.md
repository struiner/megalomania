# Task Summary
- **Title:** Replace Kirby placeholder routes with purposeful feature stubs
- **Trigger:** Multiple menu entries across diplomacy, biomes, and SDK routes still render the generic `KirbyComponent` placeholder.
- **Purpose:** Convert placeholder routes into minimal, domain-owned feature shells that communicate intent and unblock future UX work.

## Explicit Non-Goals
- No new simulation or ledger mechanics.
- No data fetching beyond existing mock/derived views.
- No visual restyling of the global shell outside the placeholder replacements.

## Agent Assignments
- **Project Manager (primary):** Validate scope per route and confirm owners for each replacement.
- **Frontend Developer:** Implement per-route standalone components with descriptive copy and stubbed UI elements.
- **Game Designer (consult):** Provide one-line UX intent per route to avoid overreach.
- **Architecture Steward (optional):** Ensure new stubs do not own authoritative state.

## Deliverables
- One standalone Angular component per replaced route (e.g., diplomacy/nations, diplomacy/trade, biomes/flora/fauna/features, exploration/harbors, sdk routes still pointing to Kirby).
- Menu wiring updated to point to the new components without changing route paths.
- Each stub includes: page title, intent paragraph, and a TODO checklist scoped to that domain.

## Review Gate
- [ ] All Kirby placeholders removed from user-facing routes listed above.
- [ ] No new stateful services introduced.
- [ ] Routes remain navigable via the toolbar menu.

## Signals & References
- `src/app/data/menu.data.ts` imports `KirbyComponent` for multiple menu items.
- Task template guidance: `global_task_agent.md` (task specs from repository signals).
