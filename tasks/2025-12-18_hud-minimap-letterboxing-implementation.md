# Task Specification — HUD Minimap Letterboxing Implementation

**STATUS: COMPLETED (functional) — aesthetic fill decision pending**

## Task Summary
Implement letterboxing functionality for the HUD minimap to handle aspect ratio differences between the minimap container and the rendered map data while maintaining pixel integrity.

## Purpose and Scope
- Add letterboxing/pillarboxing to the minimap component when aspect ratios don't match
- Preserve pixel integrity during letterboxing operations
- Maintain clear visual distinction between the minimap content and letterbox bars

## Explicit Non-Goals
- No changes to minimap rendering logic or data sources
- No dynamic resizing or zoom functionality
- No complex masking or shader effects

## Fidelity & Constraints
- **Functional fidelity**: working letterboxing implementation with visual testing
- Must maintain integer scaling and pixel-grid alignment
- Letterbox bars should use theme-appropriate styling

## Agent Assignments
- **Owner / Executor:** Frontend Developer
- **Design Intent:** Letterbox bars should feel like part of the instrument frame - subtle, consistent with the Hanseatic aesthetic
- **QA:** Validate letterboxing across different aspect ratios and scaling factors

## Deliverables
- Updated minimap component with letterboxing support
- SCSS for letterbox bar styling consistent with theme
- Testing documentation showing letterboxing behavior at different aspect ratios
- Updated README notes on minimap scaling policy with implementation details

## Review Gate
- [ ] Letterboxing preserves pixel integrity
- [ ] Visual treatment aligns with Hanseatic theme
- [ ] Performance impact is negligible
- **Approvers:** Frontend Developer + Architecture Steward

## Dependencies & Sequencing
- Depends on: Minimap scaling policy (completed)
- Can run in parallel with other HUD improvements

## Open Questions / Clarifications
- Original TODO: "README summarizes policy with TODOs for letterboxing"
- Clarification: Should letterbox bars use solid colors or subtle textures to match the overall HUD aesthetic?
- New: Confirm whether letterbox fill should adapt to device DPI (e.g., darker fill on OLED-safe areas) or remain static.
