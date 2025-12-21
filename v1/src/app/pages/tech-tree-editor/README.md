# Tech Tree Editor — Routed Skeleton

The tech tree editor is a routed SDK surface that hosts the tech canvas, structured detail stack, and preview dialog. It is wired to fixtures and now consumes the canonical tech-tree data model with deterministic import/export wiring. Design tokens live under `v1/src/styles` and are imported globally so new panels stay aligned with the SDK shell.

## Layout and flows

- **Route**: `/sdk/tech-tree` (also discoverable via the SDK menu). The route uses the `SdkToolPageComponent` shell so the editor can be swapped or embedded without changing navigation.
- **Panels**: overview (tech canvas with pan/zoom and keyboard/pointer drag/drop), identity (title/summary/tier/order/category + icon picker), effects, culture tags, and inline prerequisite editor. Panels do not own truth; they read from `TechTreeEditorService` signals via the `TechTreeEditorOrchestrator`.
- **Overlay layer**: `TechTreeConnectionOverlayComponent` renders Manhattan connectors with tokenized colors behind the tech canvas and preview dialog. Connection highlighting follows the active/focused node.
- **Icon picker**: node detail includes a registry-backed icon selector (`TechIconRegistryService` + `TechIconPickerComponent`) using shared taxonomy IDs (e.g., `structure_lumberyard`) with culture-overlay hints.
- **Culture tags**: a combobox-driven picker sits in `CultureTagsPanelComponent`; a toggleable legacy grid supports audits. Governance CRUD lives in a modal shell that routes create/edit/delete proposals through `CultureTagGovernanceAdapterService` with audit trails and versioned statuses.
- **Preview dialog**: `TechTreePreviewDialogComponent` traps focus, restores focus on close, highlights prerequisite paths for the focused/hovered node, and now exposes a legend for connector semantics. It uses design tokens for spacing and contrast.
- **Action dock**: bottom-weighted section with import/export controls and node creation actions. Validation issues and governance notices surface under the dock for early feedback.
- **Selection flow**: selecting a chip or node highlights dependencies and updates the detail form. Form edits update the injected service; import failures are surfaced via validation issues and the import banner.

## Integration contract

- **Orchestrator**: `TechTreeEditorOrchestrator` coordinates shared state (selection, viewport, preview open/close, validation aggregation) and proxies service updates so subcomponents remain stateless. Canvas viewport changes are emitted as `{ panX, panY, scale }` and consumed by overlays and the preview dialog.
- **Tech canvas**: `TechCanvasComponent` owns pan/zoom, roving tabindex, keyboard drag/drop (`Ctrl/Cmd + Arrow`), and virtualization. It emits node move events (`nodeId`, `tier`, `column`) and viewport changes; consumers keep overlays/connectors in sync via these outputs.
- **Drag/drop accessibility**: `DragDropBehaviorDirective` adds ARIA roles (`grid`, `gridcell`, `draggable`), focus restoration, and live-region announcements. Keyboard users can grab via Enter/Space and reposition with modifier + arrows. The announcer is exposed as a service so other surfaces can reuse the live region.
- **Detail stack**: `NodeIdentityCardComponent`, `EffectsEditorComponent`, `PrerequisiteEditorComponent`, and `CultureTagsPanelComponent` are isolated and emit minimal payloads. Validation is field-scoped (`node.title`, `node.tier`, `node.display_order`, `node.summary`) and merged with export issues for the page-level list.
- **Preview dialog**: accepts `document`, `nodes`, `tierBands`, `cultureTagOptions`, and `effectOptions`; highlights connectors via `selectedId` and traps focus with `cdkTrapFocusAutoCapture`. ESC and the Close button restore the prior focus target.

## Performance and virtualization

- **Virtualized grid**: `VirtualizedGridComponent` windows the visible set of nodes based on viewport size, pan, and zoom. `TechCanvasComponent` uses this window for node rendering and overlay edge filtering while preserving deterministic ordering for export/validation.
- **Perf harness**: `TECH_TREE_PERFORMANCE_FIXTURE` (140 nodes) lives in `tech-tree-editor.fixtures.ts` for render/memory baselines. Swap it into `requestImport` or canvas inputs to measure pan/zoom and virtualization performance without altering the main fixture.
- **Metrics**: track render time for 100–200 nodes and memory allocations when panning/zooming; overlays should react to viewport changes without re-rendering offscreen nodes.

## Extension points

- **Import**: `TechTreeEditorService.requestImport` delegates to `TechTreeIoService.importTechTree` for deterministic parsing/validation; keep the provenance label for audit trails and route errors to user-visible surfaces.
- **Export**: `TechTreeEditorService.requestExport` returns a deterministic `TechTreeExportResult` with sorted JSON output and surfaced issues; attach persistence or download logic here.
- **Data contract**: types alias the canonical models in `v1/src/app/models/tech-tree.models.ts`. Swap the fixture document in `tech-tree-editor.fixtures.ts` for real data without touching the component shell.
- **Prerequisite diagram**: `prerequisiteColumns` in the component currently produces a minimal columnar view; replace it with a richer visualization component when available while keeping the column contract for stability.

## Determinism and ownership

- The editor never asserts authoritative truth; it only surfaces injected data and emits structured payloads for import/export. Any persistence or ledger emission must live in the consuming SDK service.
- Fixture data is intentional: it keeps the UI demonstrable while making replacements straightforward once the data model and SDK contracts stabilize. Culture tags and effect pickers are sourced from authoritative enums via `TechTreeIoService` and `TechEnumAdapterService`.
