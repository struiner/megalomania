# Hazard Enum Adapter (read-only)

Purpose: expose deterministic, normalized hazard identifiers for SDK pickers and validation without duplicating truth in UI components.

Sources & ownership:
- Canonical values live in `v1/src/app/enums/HazardType.ts`.
- Compatibility inputs are flattened to canonical identifiers through `HazardEnumAdapterService` (this service owns picker-facing shape).
- Hazard scoring fields in `v1/src/app/data/design-doc.data.ts` (e.g., `MagicHazardScore`) remain design placeholders; they should eventually map to `HazardType` values or derived hazard facets in a dedicated validation layer.

Behavior:
- **Read-only surface:** the adapter only reads `HazardType` and exposes options/normalizers; it does not author new hazard strings.
- **Deterministic ordering:** options are locale-sorted by label to keep picker order stable.
- **Normalization & compatibility:** common payloads such as `Fire`, `Hull breach`, `Water ingress`, or `Fauna` normalize to canonical `HazardType` entries. See `hazard-enum-adapter.fixtures.ts` for sample payloads.
- **Fallback display:** `getHazardOptions(extraValues)` will surface unknown hazard strings as `fallback` options so imported data remains visible for review.

Integration guidance:
- UI pickers should call `getHazardOptions()` and keep hazards stored as `HazardType[]` via `normalizeSelection` + `sortSelection`.
- When importing legacy room blueprints, normalize hazard arrays before persisting; log or flag any `fallback` entries for human review rather than inventing new canonical values in the UI.

Future notes:
- Severity/biome tags are intentionally deferred; add them to `HazardType` once hazard simulation/data models are defined.
