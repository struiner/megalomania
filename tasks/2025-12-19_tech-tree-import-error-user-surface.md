# Tech Tree Import Error User Surface Routing

## Task Summary & Purpose
The `TechTreeEditorService` currently swallows structured import errors in the catch block without providing user feedback. This task implements proper error routing to make import failures visible to users through the existing validation system.

**Original TODO:** `// TODO: route structured import errors to a user-visible surface instead of swallowing them here.` in `v1/src/app/pages/tech-tree-editor/tech-tree-editor.service.ts:227`

## Explicit Non-Goals
- Do not change the underlying import validation logic or error types
- Do not implement error recovery or automatic correction mechanisms
- Do not modify import file format or validation rules
- Do not add import success confirmation beyond existing export tracking

## Fidelity & Constraints
- **Target Stage:** Functional (playable) - ensure users can see and respond to import failures
- **Reference:** UI & Ergonomics Charter (users must understand what went wrong)
- **Domain:** Frontend UI surface and user experience

## Agent Assignments
- **Primary:** Frontend Developer
- **Collaborators:** SDK & Modding Engineer (for error message consistency)

## Deliverables & Review Gate
- [ ] Extract error details from caught exceptions and format for user consumption
- [ ] Route structured import errors to existing `validationIssues` signal
- [ ] Implement user-friendly error messages with actionable guidance
- [ ] Add specific error types for common import failures (syntax, schema, duplicates)
- [ ] Update UI to display import errors prominently in the editor interface

**Review Gate:** Frontend Developer validates that import errors are clearly communicated and users can take corrective action.

## Dependencies & Sequencing
- **Prerequisites:** None - can leverage existing validation display infrastructure
- **Follow-up Tasks:** Import error recovery suggestions, batch import error reporting

## Open Questions / Clarifications
- Should import errors prevent the import entirely or allow partial imports with warnings?
- Do we need to preserve the raw error details for developer debugging while showing user-friendly messages?
- Should import errors include line numbers or location information when available?