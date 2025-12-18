# HUD Icon Asset Pack Sourcing — Decision Log (Phase 2)

This document records the evaluation of pixel icon packs for the Hanseatic HUD. It targets Structural fidelity: clarifying licensing, palette fit, and integration steps without introducing runtime ownership.

## Selection Criteria
- 16×16 native pixels with clean 2× exports; no sub-pixel curves or antialiasing.
- License permits commercial redistribution and bundling inside the game client.
- Readable at 1-bit or two-tone treatments to match brass/ink framing and parchment grounds.
- Enough semantic coverage for HUD actions (inventory, ledger, map, crew, trade, quests, settings, help) plus future overlays.

## Candidate Evaluation
| Pack | License | Palette / Fit | Notes & Risks |
| --- | --- | --- | --- |
| **Kenney “Game Icons” (1-bit/monochrome set)** | CC0 1.0 (public domain) | Ships 16px PNGs plus vector sources; survives recolor to `Accent Brass` strokes on `Primary Background` without edge blur. | ✅ Selected. Large coverage (1k+ icons), consistent 1–2px stroke weight, easy to downsample to 2× for crisp HUD buttons. |
| **Game-Icons.net (Lorc/Delapouite & community)** | CC BY 3.0 (requires attribution) | Vector-first; downscales cleanly with hard-edged rasterization and brass recolor; many nautical/trade motifs. | ⚠️ Attribution required in credits screen/build manifest. Some glyphs need manual pixel cleanup at 16px to avoid diagonal stair-step noise. |
| **0x72 Dungeon Tileset II (UI glyph subset)** | CC0 1.0 | 16×16 native sprites with 3–4 tone palettes; integrates well on dark plates. | Limited HUD-friendly pictograms (good for map markers/alerts, weaker for “ledger/quests”). Use as supplemental set for markers if Game Icons coverage fails. |

## Decision
- **Adopt Kenney “Game Icons” CC0 pack as the canonical base**, with a brass/ink recolor layer for HUD chrome.
- **Keep Game-Icons.net as a licensed fallback** when a specific pictogram is missing; ensure attribution string is captured in build credits.
- **Supplement markers from 0x72** only for map/minimap glyphs if Kenney coverage lacks the needed silhouettes.

## Palette & Rendering Guidance
- Render icons as 1-bit or two-tone: **stroke = Accent Brass (`#c08a3b`)**, **fill/negative space = transparent**, optional **shadow inset = Cool Shadow (`#1b2433`)** when on parchment.
- Export canonical sprites at **16px and 32px (2×)**; enforce `image-rendering: pixelated` and integer scaling only.
- Avoid gradients; limit per-icon colors to brass + ink to preserve etched/engraved tone against Parchment or Dark Wood plates.

## HUD Pilot Mapping (Kenney Game Icons)
| HUD Action/Header | Suggested Glyph (Kenney filename) | Notes |
| --- | --- | --- |
| Inventory | `backpack.png` | Works for cargo/hold; recolor brass stroke on parchment. |
| Ledger | `ledger.png` (or `book.png`) | Prefer ledger/book with clasp to read as official record. |
| Maps | `map.png` | Keep negative space to avoid filling the brass frame. |
| Crew | `group.png` | Two silhouettes; avoid shaded variants to keep 1-bit edges. |
| Trade | `scales.png` | Conveys balance/market; option to invert when inactive. |
| Quests | `compass.png` (fallback `star.png`) | Compass better matches exploration tone; star acceptable for achievements. |
| Settings | `cog.png` | Standard; pair with copper hover stroke per theme. |
| Help | `question.png` | Use outline variant; fill stays transparent. |
| Info Pane Header (Status) | `anchor.png` | Matches maritime motif; can double as loading/standby icon. |
| Info Pane Header (Notifications) | `bell.png` | Badge-friendly; center aligns on 16px grid. |

## Integration Steps (for HUD theme retrofit)
1. **Ingest pack**: Store selected Kenney PNGs plus SVG sources under `v1/src/app/pages/hud/assets/icons/kenney/` (keep original filenames for traceability).
2. **Generate sprite sheets**: Produce `hud-icons-16.png` and `hud-icons-32.png` via hard-edged packing (no padding trimming); export a JSON/TS manifest mapping HUD action IDs to sprite coordinates.
3. **Styling hooks**: Add SCSS tokens for `--hud-icon-stroke` (Accent Brass), `--hud-icon-shadow` (Cool Shadow), and `--hud-icon-bg` (transparent); force `image-rendering: pixelated`.
4. **Integration shim**: Update HUD button/info-pane components to accept sprite references instead of emoji; keep existing emoji as **runtime fallback** if sprite fails to load.
5. **Attribution ledger**: If any Game-Icons.net glyphs are pulled, add credit entry (“Icons by Lorc, Delapouite & contributors — CC BY 3.0”) to the build credits manifest and docs.

## Licensing Log
- **Kenney Game Icons** — CC0 1.0: no attribution required; redistribution allowed in commercial builds.
- **Game-Icons.net** — CC BY 3.0: attribution mandatory; derivatives allowed; ensure notice is bundled with binaries and docs.
- **0x72 Dungeon Tileset II** — CC0 1.0: no attribution required; suitable for supplemental markers.

## Fallback Policy
- Default to emoji glyphs already present in HUD if the sprite atlas fails to load or if a glyph is missing during development builds.
- Prefer swapping to Game-Icons.net equivalents only after attribution is wired; otherwise keep emoji fallback to avoid license risk.

