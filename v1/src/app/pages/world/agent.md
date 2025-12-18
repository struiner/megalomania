# WorldMapComponent – Agent Instructions (STRICT)

## Canonical Source
The authoritative implementation reference for this task is:
- `WorldMapComponent` (attached)

All work MUST align with this component’s existing imports, services, enums, and types.

---

## CRITICAL RULE: Reuse Existing Code
You MUST use **pre-existing enums, interfaces, services, and types** wherever they already exist.

### Absolutely forbidden:
❌ Creating new enums when one already exists  
❌ Creating duplicate interfaces for tiles, settlements, routes, chunks  
❌ Introducing parallel services (e.g. WorldMapService2, SettlementServiceAlt)  
❌ Replacing mk2 services with mk1 equivalents  

### Required behavior:
✅ Search the codebase for existing enums/types before creating anything new  
✅ Prefer mk2 services over mk1 when both exist  
✅ Import shared enums and models from their canonical locations  
✅ Extend existing services instead of bypassing them  

If a required enum or service does not exist:
➡️ Leave a TODO comment instead of inventing one.

---

## Component Purpose
`WorldMapComponent` renders a procedurally generated world map onto a `<canvas>` using:
- Chunk-based terrain generation
- Deterministic seed-driven world data
- Centralized zoom and pan control
- Later integration of settlements and routes

This component is **read-only visualization logic**.
It must not own world state.

---

## Services You MUST Use

### World & Data
- `ChunkService`
  - `loadOrGenerateChunk(cx, cy, 'binary')`
- `WorldService` (future integration)
- `SeedService`
  - Seed must be set exactly once on init

### UI & Control
- `MapControlService`
  - `zoom$`
  - `offset$`
  - `pan(dx, dy)`
  - `setZoom(...)`
  - `setOffset(...)`

### Access & Navigation
- `DirectoryAccessService`
- `Router`

Do NOT bypass these services with local state or ad-hoc logic.

---

## Enums & Models (MANDATORY REUSE)

You MUST reuse:
- `CellData` for terrain tiles
- `Settlement` for settlement data
- Any biome, terrain, or world enums already defined in mk2

Biome handling MUST rely on:
- `tile.biome` (string or enum value)
- Existing biome definitions (do not invent new biome names)

If biome typing is loose:
➡️ Handle gracefully, do not “fix” it by creating new enums.

---

## Rendering Responsibilities

### 1. Terrain Rendering
- Chunk size: 512×512 tiles
- Tile size: `tileSizeBase * zoom`
- World → screen conversion must respect:
  - `offset.x`, `offset.y`
  - `zoom`

Rendering rules:
- Only render visible tiles
- Skip tiles outside viewport
- One draw pass per pan/zoom update

---

### 2. Tile Coloring
- Use existing biome identifiers
- Use the provided `biomeColors` map
- Elevation must lighten the base biome color
- Preserve `getTileColor(tile: CellData)` logic

Do NOT:
❌ Replace color logic with textures  
❌ Introduce new biome color systems  

---

### 3. Zoom & Pan
Zoom and pan state is **owned by `MapControlService`**.

User interaction:
- CTRL + mouse drag → pan
- Pan updates must call `mapControlService.pan(dx, dy)`
- Component only mirrors zoom/offset values locally

Do NOT:
❌ Mutate offset directly  
❌ Store authoritative zoom state in the component  

---

## Settlement Integration (TODO – mk2 ONLY)

When implementing settlements:
- Use existing settlement services and enums
- Do NOT hardcode settlement data
- Do NOT reintroduce mk1 settlement logic

Rendering rules:
- Settlements are always visible
- Render as circles
- Enforce a minimum screen size
- Skip off-screen settlements

---

## Settlement Hover Detection
Implement in `updateHoveredSettlement()`.

You MUST:
- Convert mouse screen coords → world tile coords
- Compare against existing `Settlement` positions
- Use distance-based selection (≈2 tiles)
- Update:
  - `hoveredSettlement`
  - `popupX`, `popupY`

Popup rules:
- Non-interactive
- Follows cursor
- Uses existing `Settlement` fields only

---

## Routes (Deferred – Do Not Implement Unless Told)
Route rendering is intentionally commented out.

If instructed later:
- Use existing route enums/types
- Quadratic Bezier curves only
- Sea vs land styling must reuse existing route type enums

---

## Performance Constraints
You MUST:
- Avoid redraws inside inner loops
- Avoid triggering Angular change detection per tile
- Batch chunk rendering per frame
- Call `drawMap()` only when:
  - zoom changes
  - offset changes
  - canvas resizes

---

## Angular Constraints
- Standalone component only
- No NgModules
- No DOM overlays for tiles
- Canvas rendering only

---

## What NOT to Do
❌ Do not invent new world abstractions  
❌ Do not replace services with local logic  
❌ Do not introduce WebGL, Pixi, or Three.js  
❌ Do not normalize enums by renaming values  
❌ Do not “clean up” TODOs without implementing them  

---

## Expected Result
- Deterministic world rendering from seed
- Smooth panning and zooming
- Correct chunk-based terrain drawing
- Settlement hover works when mk2 data is wired
- Zero duplication of enums, models, or services

---

## Agent Behavior Rules
When unsure:
➡️ Ask before inventing
➡️ Leave TODOs instead of guessing
➡️ Prefer reading existing services over creating new ones
➡️ Optimize for consistency over cleverness
