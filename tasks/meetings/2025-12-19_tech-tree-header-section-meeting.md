# Tech Tree Editor Header Section - Design Meeting Brief

**Meeting Purpose:** Design the optimal header section layout and information hierarchy for tech tree identification and metadata

**Current State:**
```
[Tree: northern_trade_v1 · v1] [Source: fixtures/tech-tree-fixtures]
```

**Attendees Required:**
- UX Designer (Primary)
- Game Designer (Primary)
- Frontend Developer (Technical constraints)
- Project Manager (User workflow context)

## Current Header Elements

### 1. Tree Identification
- **Tree Name:** Displayed prominently (e.g., "northern_trade_v1")
- **Version Number:** Shows current version (e.g., "v1")
- **Source Label:** Indicates data source (e.g., "fixtures/tech-tree-fixtures")

### 2. Information Architecture
- Tree name serves as primary identifier
- Version indicates edit state and export tracking
- Source helps with provenance and debugging

## Design Questions & Discussions

### 1. Information Hierarchy
- Should tree name be the most prominent element?
- How important is the version number for day-to-day editing?
- Should source information be visible or hidden by default?

### 2. User Workflow Considerations
- How often do users work with multiple trees simultaneously?
- Should the header support quick tree switching?
- Do users need to see version history or just current version?

### 3. Visual Treatment
- Should the header be compact or spacious?
- How should it integrate with the overall editor theme?
- Should it be persistent or collapsible?

### 4. Interactive Elements
- Should users be able to edit tree name directly in header?
- Should there be quick actions (save, export) in the header?
- Should version increment be manual or automatic?

## Accessibility Considerations
- Screen reader labels for tree identification
- Keyboard navigation for header interactions
- Color contrast for metadata text
- Scalable text for different viewport sizes

## Design Decisions Needed
- [ ] Information priority and hierarchy
- [ ] Interactive vs. read-only elements
- [ ] Visual styling and spacing
- [ ] Integration with action dock
- [ ] Mobile/responsive behavior

## Proposed Enhancements for Phase 3
1. **Enhanced Tree Identification**
   - More descriptive naming support
   - Quick rename functionality
   - Visual version indicators

2. **Metadata Improvements**
   - Creation/modification timestamps
   - Author attribution
   - Custom metadata fields

3. **Workflow Integration**
   - Quick save/export shortcuts
   - Multi-tree workspace support
   - Recent files access

## Success Criteria
- Clear, scannable tree identification
- Intuitive information hierarchy
- Seamless workflow integration
- Accessible to all user types
- Consistent with overall editor design system