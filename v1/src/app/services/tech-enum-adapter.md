# Tech Enum Adapter (read-only)

Purpose: give the tech editor deterministic, authoritative option lists without duplicating domain truths.

Sources:
- `v1/src/app/enums/*` for structure, goods, guild, flora, event, diplomatic, settlement and map structure identifiers.
- `GoodCategory` and `Rarity` from `v1/src/app/models/goods.model.ts` for category/rarity pickers.

Rules baked into `TechEnumAdapterService`:
- **Read-only:** the service only reads the enums/models; it never mutates or extends them. If a new value is needed, update the source enum/model and the adapter will pick it up.
- **Deterministic labels & ordering:** labels are title-cased with underscores/camelCase split; all option arrays are sorted by label (`en` locale) to keep pickers stable.
- **Fallback support:** every getter accepts `extraValues` so imported tech data with unknown identifiers can still render. Unknowns are returned with the same formatting and marked as `source: 'fallback'`; they should be reviewed upstream rather than redefined in the UI.
- **Shared casing rules:** enum values are normalized through `tech-identifier-normalizer.ts` (shared with `TechTreeIoService`) so PascalCase enum values (e.g., `GoodsType.Mead`) and snake_case payloads stay aligned without emitting fallback warnings.

Integration guidance:
- UI pickers should depend on `TechEnumAdapterService` instead of hardcoded lists—this service owns the tech-editor-facing view, while the enums/models own the underlying truths.
- Persist or validate identifiers using the `value` field; display using `label` to keep UX deterministic.
