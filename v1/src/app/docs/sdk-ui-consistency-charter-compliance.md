# SDK UI Consistency Framework - Charter Compliance Checklist

This document provides a checklist for validating that SDK tool implementations comply with the UI & Ergonomics Charter while using the SDK UI Consistency Framework.

## Framework Overview

The SDK UI Consistency Framework provides reusable shell components and styling patterns that enforce charter compliance by design:

- **SdkShellComponent**: Main container with header, optional tabs, and bottom action bar
- **SdkPanelComponent**: Consistent panel framing for content organization  
- **SdkActionGroupComponent**: Standardized action button grouping
- **Design Tokens**: SCSS tokens for spacing, typography, and colors
- **Utility Classes**: Extendable base classes for common patterns

## Charter Compliance Checklist

### ✅ 1. World First, Interface Second

- [ ] **Center Area Preservation**: Shell components leave center area uncluttered
- [ ] **Header Placement**: Page titles and breadcrumbs use header section only
- [ ] **Content Organization**: Primary content uses left/right panel layout
- [ ] **No Center Obstruction**: No UI elements intrude on center screen space

**Implementation Guide**: Use `SdkShellComponent` with left/right `SdkPanel` children.

### ✅ 2. Attention Hierarchy

#### Primary Attention (Never Obstructed)
- [ ] **Center Sacred**: Shell layout preserves full center area for game world
- [ ] **No Overlays**: No full-screen overlays that block world view
- [ ] **Modal Restraint**: Dialogs use maximum 2-level depth

#### Secondary Attention (Stable & Grouped)
- [ ] **Header Stability**: Page titles and navigation stay in fixed header position
- [ ] **Tab Consistency**: Tab navigation uses stable position with visual grouping
- [ ] **Action Grouping**: Related actions grouped in bottom action bar or panel headers

#### Peripheral Attention (Glanceable)
- [ ] **Summary Stats**: Use `summaryStats` prop for quick-reference metrics
- [ ] **Status Indicators**: Use pill-style components for peripheral data
- [ ] **No Animation**: Peripheral elements avoid aggressive animation

**Implementation Guide**: Use `SdkShellComponent.summaryStats` for peripheral metrics.

### ✅ 3. Spatial Biases & Layout Laws

#### Bottom HUD Heavy & Stable
- [ ] **Action Bar Position**: Primary actions use bottom `SdkShellComponent.actions-bar`
- [ ] **Stable Layout**: Bottom action bar maintains consistent presence
- [ ] **No Dynamic Shifting**: Layout structure doesn't shift during interaction
- [ ] **Right-Aligned Actions**: Bottom actions follow charter symmetry (right-aligned)

**Implementation Guide**: Configure `SdkShellComponent.bottomActions` array.

#### Horizontal Over Vertical
- [ ] **Panel Layout**: Use grid layout with horizontal panel arrangement
- [ ] **Form Organization**: Horizontal form field grouping when possible
- [ ] **Action Orientation**: Primary actions use horizontal grouping
- [ ] **List Layout**: Horizontal metadata alongside vertical content

**Implementation Guide**: Use `SdkPanelComponent` with horizontal grid layouts.

#### Symmetry by Default
- [ ] **Action Balance**: Equal spacing and visual weight for paired actions
- [ ] **Panel Symmetry**: Left/right panels maintain visual balance
- [ ] **Header Balance**: Title left, actions right in headers
- [ ] **Icon Usage**: Symmetrical icon placement and sizing

**Implementation Guide**: Use built-in symmetry in shell and panel components.

### ✅ 4. Density & Restraint

#### Less Is Correct
- [ ] **Empty Space**: Maintain breathing room between UI elements
- [ ] **Minimal Chrome**: Avoid decorative borders or unnecessary styling
- [ ] **Purposeful Elements**: Every UI element serves clear functional purpose
- [ ] **Progressive Disclosure**: Advanced features behind tabs or dialogs

#### Visibility Limits
- [ ] **≤8 Primary Actions**: Bottom action bar contains maximum 8 actions
- [ ] **Action Grouping**: Related actions grouped; dissimilar actions separated
- [ ] **Tab Limiting**: Maximum 5-6 tabs to prevent crowding
- [ ] **Panel Focus**: Each panel focuses on single functional area

**Implementation Guide**: Configure `SdkShellComponent.bottomActions` with ≤8 items.

#### Icons Before Text, Text Before Numbers
- [ ] **Icon Priority**: Actions use icons with optional text labels
- [ ] **Text Clarity**: Descriptive text for all interactive elements
- [ ] **Number Context**: Numbers only appear with descriptive labels
- [ ] **Recognition Over Precision**: Icons provide recognition, text provides clarity

**Implementation Guide**: Use `SdkActionGroupComponent` with icon + label pattern.

### ✅ 5. Interaction Rules

#### One Action, One Result
- [ ] **Button Clarity**: Each button performs single, predictable action
- [ ] **No Dual Purpose**: Actions don't both open dialogs and navigate
- [ ] **Clear Labeling**: Action labels describe exact outcome
- [ ] **Consistent Patterns**: Same action uses same pattern across tools

#### No Hidden Gestures
- [ ] **Explicit Affordances**: All actions have visible buttons or controls
- [ ] **Hover Alternatives**: No hover-only interactions
- [ ] **Keyboard Support**: All actions accessible via keyboard
- [ ] **Discoverable Navigation**: Tab navigation clearly visible and clickable

#### Shallow Modal Depth
- [ ] **Maximum 2 Levels**: Dialogs within dialogs maximum 2 deep
- [ ] **Full View Alternative**: Deep navigation uses full view changes
- [ ] **Clear Modal Stack**: Users understand their navigation context
- [ ] **Escape Routes**: Clear paths to exit modal flows

### ✅ 6. Visual Tone & Aesthetic Direction

#### Retro Pixel Heritage
- [ ] **Pixel Grid Alignment**: All UI elements align to pixel boundaries
- [ ] **Integer Scaling**: No fractional scaling that causes blur
- [ ] **16-bit Sensibility**: Color palette and styling reflect 16-bit heritage
- [ ] **Functional Design**: Visual elements serve function over decoration

**Implementation Guide**: Use provided design tokens and utility classes.

#### Hanseatic Fantasy, Not High Fantasy
- [ ] **Earthy Colors**: Muted, earthy color palette over bright fantasy colors
- [ ] **Instrument Aesthetic**: UI resembles tools and ledgers, not magic interfaces
- [ ] **Mercantile Sensibility**: Business-like organization and clarity
- [ ] **Solid Forms**: Avoid filigree or overly ornate decorative elements

#### Motion Is Informational
- [ ] **State Indication**: Animations show state changes only
- [ ] **Causality**: Movement explains why something changed
- [ ] **No Decoration**: No purely decorative animations
- [ ] **Performance**: Animations don't impact simulation performance

### ✅ 7. Framework-Specific Implementation Rules

#### Shell Component Usage
- [ ] **Consistent Header**: All tools use `SdkShellComponent` header structure
- [ ] **Tab Organization**: Complex tools use tabs for organization
- [ ] **Bottom Actions**: Primary actions always in bottom action bar
- [ ] **Summary Stats**: Quick metrics use `summaryStats` prop

#### Panel Component Usage
- [ ] **Panel Framing**: Content organized within `SdkPanelComponent`
- [ ] **Header Consistency**: Panel headers follow established pattern
- [ ] **Action Integration**: Panel-specific actions in header slot
- [ ] **Compact Option**: Dense content uses `compact` variant

#### Action Group Usage
- [ ] **Grouping Logic**: Related actions grouped together
- [ ] **Direction Consistency**: Horizontal for primary, vertical for secondary
- [ ] **Variant Usage**: Primary/secondary/danger variants used appropriately
- [ ] **Icon Integration**: Icons used for recognition, labels for clarity

#### Design Token Usage
- [ ] **Spacing Consistency**: All spacing uses tokenized values
- [ ] **Typography Scale**: Text sizes follow established scale
- [ ] **Color Variables**: Colors reference design token variables
- [ ] **Border Radius**: Consistent border radius values

## Testing Checklist

### Visual Regression Testing
- [ ] **Charter Compliance**: UI passes charter compliance review
- [ ] **Component Consistency**: All tools use framework components
- [ ] **Token Application**: Design tokens applied consistently
- [ ] **Responsive Behavior**: Layout works at target screen sizes

### Interaction Testing  
- [ ] **Action Clarity**: All actions have clear, single purposes
- [ ] **Navigation Flow**: Tab and panel navigation works smoothly
- [ ] **Keyboard Support**: All interactions available via keyboard
- [ ] **Accessibility**: UI passes basic accessibility checks

### Performance Testing
- [ ] **Render Performance**: Framework components don't impact performance
- [ ] **Memory Usage**: Component instances don't leak memory
- [ ] **Animation Performance**: Animations run smoothly at 60fps
- [ ] **Bundle Size**: Framework doesn't significantly increase bundle size

## Implementation Validation

### Code Review Checklist
- [ ] **Framework Components Used**: Custom components use SDK framework
- [ ] **Design Tokens Referenced**: Styles use provided token variables
- [ ] **Charter Comments**: Complex decisions documented with charter rationale
- [ ] **Component Props**: Framework components configured via props, not styles

### Design Review Checklist
- [ ] **Charter Alignment**: Layout follows charter guidelines
- [ ] **Visual Hierarchy**: Attention hierarchy properly implemented
- [ ] **Action Organization**: Actions grouped and prioritized correctly
- [ ] **Aesthetic Consistency**: Visual style matches Hanseatic theme

## Framework Evolution

The SDK UI Consistency Framework should evolve to maintain charter compliance:

### Adding New Components
1. **Charter Analysis**: New components must support charter principles
2. **Token Integration**: New components use existing design tokens
3. **Consistency Check**: New components follow established patterns
4. **Documentation**: New components documented with usage examples

### Updating Existing Components
1. **Backward Compatibility**: Changes don't break existing implementations
2. **Charter Validation**: Updates maintain or improve charter compliance
3. **Token Consistency**: Updates use consistent token usage
4. **Migration Guide**: Breaking changes include migration documentation

## Sign-off

- [ ] **Frontend Developer**: Framework implementation review
- [ ] **Architecture Steward**: Charter compliance validation  
- [ ] **QA Engineer**: Testing checklist completion
- [ ] **Game Designer**: Aesthetic alignment confirmation

---

**Framework Version**: 1.0.0  
**Last Updated**: 2025-12-19  
**Charter Reference**: megalomania/charter_UI_ergonomics.md