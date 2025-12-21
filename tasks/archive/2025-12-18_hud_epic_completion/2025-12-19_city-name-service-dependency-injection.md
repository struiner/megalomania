# City Name Service Dependency Injection

## Task Summary & Purpose
The `CityGeneratorService` currently uses hardcoded name generation arrays instead of a proper naming service dependency injection. This TODO addresses the need to implement proper DI for settlement naming to support culture-specific naming patterns and more sophisticated name generation.

**Original TODO:** `//TODO: nameServiceDI` in `v1/src/app/services/worldGeneration/cities/city-generator.service.ts:179`

## Explicit Non-Goals
- Do not implement full culture-specific name generation algorithms in this task
- Do not modify settlement generation logic beyond name service integration
- Do not change existing settlement creation signatures or templates
- Do not implement name validation or uniqueness checking

## Fidelity & Constraints
- **Target Stage:** Structural (skeleton) - establish the DI relationship and basic service interface
- **Reference:** Level-of-Detail Charter (structural fidelity appropriate for infrastructure work)
- **Domain:** World generation and settlement creation systems

## Agent Assignments
- **Primary:** World Generator
- **Collaborators:** SDK & Modding Engineer (for service interface design)

## Deliverables & Review Gate
- [ ] Create `CityNameService` interface with basic name generation contract
- [ ] Implement default `CultureAgnosticNameService` with current hardcoded arrays
- [ ] Update `CityGeneratorService` constructor to inject `CityNameService`
- [ ] Refactor `generateSettlementName()` to use injected service
- [ ] Add basic documentation explaining the service pattern and extension points

**Review Gate:** World Generator validates that DI pattern is established and current functionality is preserved.

## Dependencies & Sequencing
- **Prerequisites:** None - foundational infrastructure work
- **Follow-up Tasks:** Culture-specific name services, advanced naming algorithms

## Open Questions / Clarifications
- Should the service support synchronous or asynchronous name generation?
- Do we need to preserve the current random seed behavior for determinism?
- Should the service interface support multiple naming strategies or cultures in a single method?