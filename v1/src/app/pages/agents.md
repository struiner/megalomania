# Pages Directory Agents Charter

This document defines the responsibilities, constraints and collaboration patterns for work performed in the `v1/src/app/pages` directory.  It supplements the global project charter by describing how the core principles apply to Angular page components such as the HUD, the technology tree editor, goods management tools and other SDK pages.  The goal is to ensure that every page respects the UI & Ergonomics Charter and Level‑of‑Detail Charter while avoiding truth ownership and keeping the game’s Hanseatic tone consistent.

## Purpose and Scope

The `pages/` directory contains high‑level Angular pages that host major UI surfaces: the gameplay HUD, the technology tree editor, goods and room managers, and other tools exposed via the SDK.  Pages are entry points; they assemble domain‑specific components, provide routing into sub‑views and overlays, and coordinate the layout skeleton.  They never own or mutate core game truth—instead they consume view models and emit events to services.

This charter applies to:

- **HUD pages** (e.g., `pages/hud`), which render the bottom HUD, overlay shells, minimap and auxiliary dialogs.  Tasks such as the HUD skeleton, minimap integration, overlay tab logic, anchoring and theme retrofit are all examples of page‑level work:contentReference[oaicite:0]{index=0}.  Pages must respect bottom anchoring, pixel‑grid alignment and the attention hierarchy defined in the UI & Ergonomics Charter:contentReference[oaicite:1]{index=1}.
- **Editor and SDK pages** (e.g., `pages/tech-tree-editor`, `pages/goods-manager`), which host tools for managing data such as technology trees.  These pages define shell layouts with panels for lists, detail forms and action bars:contentReference[oaicite:2]{index=2} and share UI primitives via a consistency framework:contentReference[oaicite:3]{index=3}.
- **Future SDK pages** for room construction, guild management or import/export tools.  This charter should guide the creation of new page‑level tasks.

## Key Principles for Pages

1. **Structural fidelity first.**  Pages begin life at **Conceptual** or **Structural** fidelity: they should establish the shape and layout of the UI without implementing gameplay logic or owning truth:contentReference[oaicite:4]{index=4}.  Use placeholder data or fixtures and avoid premature abstraction:contentReference[oaicite:5]{index=5}.
2. **UI as an instrument.**  The page’s primary role is to orient and empower the user while keeping the world viewport clear.  For HUD pages this means a bottom‑anchored layout with ≤ 8 primary actions and symmetrical spacing:contentReference[oaicite:6]{index=6}.  For editors and SDK pages, establish a header, list panel, detail panel and bottom action row with stable placement:contentReference[oaicite:7]{index=7}.
3. **No truth ownership.**  Pages render data passed in via services or inputs and emit events to request changes.  They never derive or store authoritative state; instead they rely on ledger‑driven view models or SDK services:contentReference[oaicite:8]{index=8}.  All gameplay events must be emitted to the ledger via appropriate domains.
4. **Pixel integrity and Hanseatic tone.**  Pages must align elements on the integer pixel grid, respect 4 px/8 px padding increments, and avoid fractional transforms.  Use the palette, typography and icon rules defined in the Hanseatic theme foundations:contentReference[oaicite:9]{index=9}.  Decorative treatments should be restrained and avoid gradients or sub‑pixel blurs:contentReference[oaicite:10]{index=10}.
5. **Attention hierarchy and safe areas.**  The center of the screen belongs to the game world; pages should not obstruct it:contentReference[oaicite:11]{index=11}.  For HUD pages, maintain a safe bottom reserve for the HUD container and ensure overlays do not occlude critical information.  For editors, limit the number of primary actions and avoid modals that break the attention flow.

## Roles and Responsibilities

| Role                        | Page responsibilities                                                                                                       |
|-----------------------------|-----------------------------------------------------------------------------------------------------------------------------|
| **Frontend Developer**     | Owns implementation of page layouts, routing, shells and component wiring.  Creates Angular components, SCSS, and tests to ensure pixel alignment and ergonomics.  Implements tasks such as minimap scaling policy:contentReference[oaicite:12]{index=12}, bottom HUD anchoring:contentReference[oaicite:13]{index=13}, tech‑tree editor skeleton:contentReference[oaicite:14]{index=14} and SDK UI consistency framework:contentReference[oaicite:15]{index=15}.  Confirms that pages consume data via services rather than owning state. |
| **Game Designer**          | Provides design intent for page structure, panel content, culture and narrative tone.  Supplies sample metadata and fixtures for editors:contentReference[oaicite:16]{index=16}, defines HUD overlay tab semantics:contentReference[oaicite:17]{index=17}, and curates the Hanseatic theme tokens:contentReference[oaicite:18]{index=18}.  Approves aesthetics and ensures that pages reinforce the late‑medieval fantasy style without violating the charters. |
| **Architecture Steward**   | Guards against truth leakage, ensures pages remain rebuildable from the ledger and verifies that pages respect domain boundaries.  Validates that routing and overlays avoid owning state and that pixel integrity is maintained.  Approves changes to page scaffolding and cross‑domain APIs. |
| **Project Manager**        | Coordinates task intake, sequencing and assignments for page work.  Tracks epics such as the HUD and editor phases, manages promotion decisions (e.g., from structural to functional fidelity):contentReference[oaicite:19]{index=19} and ensures tasks include explicit non‑goals and review gates. |
| **QA & Test Engineer**     | Validates layout stability across viewport sizes, DPI profiles and safe‑area variations.  Writes tests for drag interactions, anchoring, tab logic and minimap scaling:contentReference[oaicite:20]{index=20}.  Confirms pages do not introduce non‑determinism or own truth. |
| **Art/Brand Consultant**   | Provides icons, textures and typography assets aligned with the Hanseatic theme.  Ensures icons adhere to pixel grids and the defined stroke/spacing rules:contentReference[oaicite:21]{index=21}.  Consulted on decorative treatments and color accessibility variants. |

## Page Templates and Patterns

### HUD Page Pattern

The HUD page serves as the primary gameplay UI surface.  Implementations should:

- Use a **bottom‑anchored grid** reserved for two info panes, a central 2×4 action grid, and a square minimap:contentReference[oaicite:22]{index=22}.  Anchoring must be fixed across scroll contexts:contentReference[oaicite:23]{index=23}.
- Host overlay shells routed to via the action grid.  Tab logic must define active/deselected states and behaviors for actions without panels:contentReference[oaicite:24]{index=24}.  Overlay dialogs should be draggable with bounded offsets:contentReference[oaicite:25]{index=25}.
- Keep world view unobstructed.  Overlays and dialogs must respect safe‑area constraints and allow the player to reposition them.  Avoid modal stacks deeper than two layers and ensure ESC/Close semantics route correctly:contentReference[oaicite:26]{index=26}.
- Apply Hanseatic theme tokens via SCSS partials.  Use brass/wood/parchment palettes and rope motifs; token variables and mixins should live in a HUD theme partial for reuse:contentReference[oaicite:27]{index=27}.  Visual updates should not alter layout or routing:contentReference[oaicite:28]{index=28}.
- Consume preview data from services for the minimap and info panes.  Do not derive simulation state inside the UI:contentReference[oaicite:29]{index=29}.  Document scaling assumptions and letterboxing policy:contentReference[oaicite:30]{index=30}.

### Editor/SDK Page Pattern

Pages that host editors or SDK tools should follow a consistent layout skeleton:

- **Shell layout:** header (title + breadcrumb), left panel for lists or trees, right panel for details/forms, and bottom action row for global actions:contentReference[oaicite:31]{index=31}.  Use ≤ 8 primary actions and symmetrical spacing:contentReference[oaicite:32]{index=32}.
- **Shared UI primitives:** leverage a common SDK UI consistency framework of panel components, toolbars and action rows to avoid duplicating layout logic:contentReference[oaicite:33]{index=33}.  Adopt shared SCSS tokens for spacing, typography and grid alignment.
- **Data binding:** editors operate on fixture data and enums.  For example, the tech tree editor uses placeholder node definitions and culture tags:contentReference[oaicite:34]{index=34}, while goods managers will eventually rely on goods catalog fixtures.  All import/export logic lives outside the page and is injected via services.
- **Non‑goals:** editors do not implement research progression or simulation logic:contentReference[oaicite:35]{index=35}.  They avoid complex graph drawing beyond minimal visualization needed for structure validation at structural fidelity:contentReference[oaicite:36]{index=36}.

### Auxiliary Dialogs and Overlays

Many pages expose auxiliary actions (settings, help, diagnostics) via buttons.  These should:

- Route to existing configuration or help pages where available.  If the destination is not yet implemented, open a placeholder dialog that clearly marks itself as a stub:contentReference[oaicite:37]{index=37}.
- Clearly document CTA ownership and fallback behavior in the HUD page or editor shell.  Avoid inventing new gameplay surfaces or options:contentReference[oaicite:38]{index=38}.
- Maintain deterministic navigation and safe‑area respect; dialogs must not occlude the world view or primary panels.  They remain at structural fidelity until final routes are confirmed:contentReference[oaicite:39]{index=39}.

## Task Specification Guidelines for Pages

When authoring tasks for work in the `pages/` directory, follow the reusable task spec template and include page‑specific details:

1. **Task Summary & Purpose:** Describe the high‑level goal (e.g., build HUD minimap skeleton, implement tech tree editor panels) and why it is needed.  Link to the relevant epic or phase review documents when applicable:contentReference[oaicite:40]{index=40}.
2. **Explicit Non‑Goals:** List what is intentionally excluded—such as gameplay logic, ledger updates, or visual polish—to prevent scope creep:contentReference[oaicite:41]{index=41}.
3. **Fidelity & Constraints:** Specify the target fidelity stage (conceptual, structural, functional, refinement) and reference charters that apply (UI & Ergonomics, Level of Detail, Hanseatic theme).  Emphasize pixel alignment, safe‑area handling and limited primary actions:contentReference[oaicite:42]{index=42}.
4. **Agent Assignments:** Assign the Frontend Developer as executor and identify consulted roles (Game Designer, Architecture Steward, Art Consultant).  Clarify QA involvement for layout and interaction tests:contentReference[oaicite:43]{index=43}.
5. **Deliverables:** Enumerate the components, services, SCSS files and documentation updates expected.  For example, a minimap scaling task should produce codified scaling rules in `hud-minimap.component.ts` and a README summary:contentReference[oaicite:44]{index=44}.
6. **Review Gate:** Provide criteria for acceptance—such as pixel integrity, charter compliance, and absence of truth ownership—and list approvers:contentReference[oaicite:45]{index=45}.
7. **Dependencies & Sequencing:** Note predecessor tasks (e.g., theme foundations must precede theme retrofits) and how the task fits into the global execution ladder (data model → import/export → shared enums → UI → ledger wiring):contentReference[oaicite:46]{index=46}.
8. **Open Questions:** Include clarifications needed from stakeholders about visual details, routing semantics or future data sources:contentReference[oaicite:47]{index=47}.

By adhering to this charter, contributors can build and evolve pages that are deterministic, ergonomic and visually cohesive.  Pages serve as instruments for players and modders; they guide interaction without owning game truth.  All work should reflect the Hanseatic tone and pixel‑precise aesthetic that underpin the Megalomania project.
