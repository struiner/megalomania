# Tech Tree Editor — Routed Skeleton

The tech tree editor is a routed SDK surface that hosts three structural panels: overview, node detail, and prerequisite visualization. It is wired to fixtures and exposes stubbed import/export hook points for later service wiring.

## Layout and flows

- **Route**: `/sdk/tech-tree` (also discoverable via the SDK menu). The route uses the `SdkToolPageComponent` shell so the editor can be swapped or embedded without changing navigation.
- **Panels**: overview (tier-banded chips), node detail (three-field edit stub), prerequisite diagram (minimal columnar tree). Panels do not own truth; they read from `TechTreeEditorService` signals.
- **Action dock**: bottom-weighted section with two primary actions (import fixtures, export snapshot) to respect the UI charter’s limits on visible actions.
- **Selection flow**: selecting a chip or node highlights dependencies and updates the detail form. Form edits update the injected service so fixtures can be replaced later.

## Extension points

- **Import**: `TechTreeEditorService.requestImport` accepts a `TechTreeImportPayload`; replace its body with an SDK or API call and keep the provenance label for audit trails.
- **Export**: `TechTreeEditorService.requestExport` returns a `TechTreeExportPayload`; attach your persistence or download logic here.
- **Data contract**: types live in `tech-tree-editor.types.ts`. Swap the fixture document in `tech-tree-editor.fixtures.ts` for real data without touching the component shell.
- **Prerequisite diagram**: `prerequisiteColumns` in the component currently produces a minimal columnar view; replace it with a richer visualization component when available while keeping the column contract for stability.

## Determinism and ownership

- The editor never asserts authoritative truth; it only surfaces injected data and emits structured payloads for import/export. Any persistence or ledger emission must live in the consuming SDK service.
- Fixture data is intentional: it keeps the UI demonstrable while making replacements straightforward once the data model and SDK contracts stabilize.
