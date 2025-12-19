# Hazard Type Severity Categories Extension

## Task Summary & Purpose
The `HazardTypeAdapterService` currently provides basic hazard categorization (environmental, structural, biological, security) but lacks explicit severity levels needed for validation services and risk assessment. This task extends the service with severity categories to support more sophisticated hazard modeling.

**Original TODO:** `// TODO: Extend with explicit severity categories once validation service consumes them.` in `v1/src/app/services/hazard-type-adapter.service.ts:16`

## Explicit Non-Goals
- Do not implement hazard simulation logic or damage calculations
- Do not modify existing hazard type definitions or categories
- Do not create hazard severity validation rules or business logic
- Do not change the public API surface of the adapter service

## Fidelity & Constraints
- **Target Stage:** Structural (skeleton) - add severity fields to existing interface without breaking changes
- **Reference:** Level-of-Detail Charter (structural fidelity for data model extension)
- **Domain:** SDK/extensibility and hazard management systems

## Agent Assignments
- **Primary:** SDK & Modding Engineer
- **Collaborators:** Economy Engineer (for risk assessment patterns)

## Deliverables & Review Gate
- [ ] Extend `HazardOption` interface with optional `severity` field (minor, moderate, major, critical)
- [ ] Add severity mapping in `HazardTypeAdapterService` for existing hazard types
- [ ] Update `toOption()` method to include severity in returned objects
- [ ] Add JSDoc documentation explaining severity levels and usage
- [ ] Create basic unit tests for severity mapping coverage

**Review Gate:** SDK Engineer validates interface extension doesn't break existing consumers and follows established patterns.

## Dependencies & Sequencing
- **Prerequisites:** None - can proceed independently
- **Follow-up Tasks:** Hazard validation service integration, risk assessment modeling

## Open Questions / Clarifications
- Should severity levels be numeric (1-4) or categorical strings for better UI binding?
- Do we need to support multiple severity levels per hazard type based on context?
- Should severity be required or optional to allow gradual adoption?