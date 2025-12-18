# Tech Tree Editor — Routed Skeleton

The tech tree editor is a routed SDK surface that hosts three structural panels: overview, node detail, and prerequisite visualization. It is wired to fixtures and now consumes the canonical tech-tree data model with deterministic import/export wiring.

## Layout and flows

- **Route**: `/sdk/tech-tree` (also discoverable via the SDK menu). The route uses the `SdkToolPageComponent` shell so the editor can be swapped or embedded without changing navigation.
- **Panels**: overview (grid of tier rows × deterministic display-order columns with inline tier controls), node detail (title/summary/tier/category, culture tag picker, enum-bound effect selectors), prerequisite diagram (minimal columnar tree). Panels do not own truth; they read from `TechTreeEditorService` signals.
- **Overlay layer**: `TechTreeConnectionOverlayComponent` renders Manhattan connectors (4px rounding, crisp edges) behind the prerequisite grid to keep dependency lines readable without occluding node content.
- **Icon picker**: node detail now includes a registry-backed icon selector (`TechIconRegistryService` + `TechIconPickerComponent`) using shared taxonomy IDs (e.g., `structure_lumberyard`) with culture-overlay hints.
- **Action dock**: bottom-weighted section with two primary actions (import fixtures, export snapshot) to respect the UI charter’s limits on visible actions. Tier controls stay scoped to the overview grid so the action dock remains stable. Validation issues are surfaced under the export log to highlight schema problems early.
- **Selection flow**: selecting a chip or node highlights dependencies and updates the detail form. Form edits update the injected service so fixtures can be replaced later.

## Extension points

- **Import**: `TechTreeEditorService.requestImport` delegates to `TechTreeIoService.importTechTree` for deterministic parsing/validation; keep the provenance label for audit trails and route errors to user-visible surfaces.
- **Export**: `TechTreeEditorService.requestExport` returns a deterministic `TechTreeExportResult` with sorted JSON output and surfaced issues; attach persistence or download logic here.
- **Data contract**: types alias the canonical models in `v1/src/app/models/tech-tree.models.ts`. Swap the fixture document in `tech-tree-editor.fixtures.ts` for real data without touching the component shell.
- **Prerequisite diagram**: `prerequisiteColumns` in the component currently produces a minimal columnar view; replace it with a richer visualization component when available while keeping the column contract for stability.

## Determinism and ownership

- The editor never asserts authoritative truth; it only surfaces injected data and emits structured payloads for import/export. Any persistence or ledger emission must live in the consuming SDK service.
- Fixture data is intentional: it keeps the UI demonstrable while making replacements straightforward once the data model and SDK contracts stabilize. Culture tags and effect pickers are sourced from authoritative enums via `TechTreeIoService` and `TechEnumAdapterService`.
