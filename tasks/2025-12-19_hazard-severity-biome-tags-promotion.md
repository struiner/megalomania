# Hazard Type Severity and Biome Tags Promotion

## Task Summary & Purpose
The `HazardType` enum contains a TODO indicating that severity and biome tags should be promoted once hazard simulation is modeled. This task implements the enhanced enum structure with severity levels and biome associations for more sophisticated hazard modeling.

**Original TODO:** `// TODO: Promote severity/biome tags once hazard simulation is modeled.` in `megalomania/v1/src/app/enums/HazardType.ts:2`

## Explicit Non-Goals
- Do not implement hazard simulation logic or damage calculation systems
- Do not change existing hazard type names or basic categorization
- Do not create hazard validation rules or business logic
- Do not modify hazard adapter service or UI components

## Fidelity & Constraints
- **Target Stage:** Structural (skeleton) - enhance enum structure for future simulation use
- **Reference:** Level-of-Detail Charter (structural enhancement for future functionality)
- **Domain:** Hazard management and simulation systems

## Agent Assignments
- **Primary:** Ledger Engineer
- **Collaborators:** Economy Engineer (for hazard modeling), SDK & Modding Engineer (for enum patterns)

## Deliverables & Review Gate
- [ ] Create `HazardSeverity` enum (minor, moderate, major, critical)
- [ ] Create `BiomeType` enum for hazard environment associations
- [ ] Add severity and biome metadata to hazard types
- [ ] Update hazard adapter service to work with enhanced metadata
- [ ] Add comprehensive JSDoc explaining severity/biome usage patterns

**Review Gate:** Ledger Engineer validates that enhanced enum structure supports future simulation requirements and maintains backward compatibility.

## Dependencies & Sequencing
- **Prerequisites:** None - can proceed with enum enhancement
- **Follow-up Tasks:** Hazard simulation modeling, risk assessment integration

## Open Questions / Clarifications
- Should severity levels be numeric for easy comparison or categorical strings for clarity?
- Do we need to support multiple biome associations per hazard type?
- Should biome tags be mandatory or optional for hazard type definition?