# Hazard Icon Style Guide & Implementation Standards

## Overview

This guide defines the visual and technical standards for hazard icons used throughout the SDK room tools, ensuring consistency across all hazard types while maintaining accessibility and legibility in retro/Hanseatic UI surfaces.

## Grid & Technical Specifications

### Grid System
- **Primary Grid Size**: 16px × 16px
- **Padding**: 1px internal border (reserved for badge overlays)
- **Stroke Width**: 1px minimum
- **Image Rendering**: `pixelated` for crisp edges

### File Naming Convention
```
assets/hazards/hazard_[type]_[gridSize].png
```
- Example: `assets/hazards/hazard_fire_16.png`
- Placeholder suffix: `_placeholder` for missing assets

### Asset Requirements
- **Format**: PNG with transparency
- **Resolution**: Scalable from 16px base
- **Color Depth**: Support for alpha channels
- **Compression**: Lossless for sharp pixel art

## Visual Design Standards

### Contrast & Legibility
- **Contrast Options**: `light`, `dark`, `dual`
- **Dual-tone preferred** for maximum flexibility across UI themes
- **Avoid sub-pixel alpha** - use hard edges aligned to pixel grid
- **Minimum contrast ratio**: 4.5:1 for accessibility compliance

### Color System
Each hazard type has an associated `badgeTint` color used for:
- Selection indicators
- Severity overlays
- Contextual highlighting
- Status badges

#### Recommended Badge Colors by Category
```scss
// Environmental & Structural
Fire: #f25f4c        // Ember red - warmth and danger
Flood: #6ec7e0       // Cool blue - water/condensation
Storm: #7b68ee       // Deep purple - electric atmosphere
Earthquake: #d4a574  // Earth tone - ground movement

// Biological & Ecological  
Plague: #9bd97c      // Sickly green - biological threat
Epidemic: #8fbc8f    // Muted green - widespread disease
CropFailure: #deb887 // Harvest gold - agricultural loss

// Resource & Survival
Radiation: #f0e68c   // Nuclear yellow - energy/contamination
ToxicSpill: #9bd97c  // Chemical green - industrial hazard
Famine: #daa520      // Goldenrod - resource scarcity

// Security & Conflict
War: #cd5c5c         // Indian red - conflict
Intrusion: #a39ad0   // Lavender - unauthorized access
SocialUnrest: #ffa500 // Orange - civil disturbance

// Techno-magical
Electrical: #f2b705  // Electric yellow - high voltage
MagicalBacklash: #9932cc // Dark orchid - arcane energy
```

### Badge Overlay System
- **Size**: 8px × 24px vertical badge
- **Position**: Right side of icon container
- **Border**: 1px inset shadow for depth
- **Opacity**: 0.9 for subtle but visible indication
- **Shape**: Rounded corners (6px radius)

## Icon Design Patterns

### Environmental Hazards
- **Fire**: Flame silhouette with ember details
- **Flood**: Water droplet with wave motion
- **Storm**: Lightning bolt with cloud silhouette
- **Earthquake**: Cracked ground with seismic waves

### Biological Hazards
- **Plague**: Crossbones with biological symbol
- **Toxic Gas**: Fume plume with breathing mask
- **Biohazard**: Standard biohazard symbol
- **Chemical**: Flask with warning symbol

### Structural Hazards
- **Building Collapse**: Cracked building silhouette
- **Structural Failure**: Broken beam or support
- **Vacuum**: Airlock chevrons with pressure arrows

### Security Hazards
- **Intrusion**: Shield with unauthorized mark
- **War**: Crossed weapons or battle standard
- **Containment Breach**: Broken container symbol

## Implementation Guidelines

### Component Integration
```typescript
// Standard icon definition structure
interface HazardIconDefinition {
  type: HazardType;
  label: string;
  iconId: string;
  spritePath: string;
  gridSize: number;        // Always 16px
  padding: number;         // Always 1px
  stroke: number;          // Always 1px
  badgeTint: string;       // Category-appropriate color
  status: 'ready' | 'placeholder';
  contrast: 'light' | 'dark' | 'dual';
  notes: string[];         // Implementation guidance
}
```

### CSS Implementation
```scss
.hazard-option__icon {
  width: 32px;  // 2x grid size for clarity
  height: 32px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  position: relative;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.25);
  
  &::before {
    content: '';
    position: absolute;
    inset: 2px;  // Creates padding band
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 4px;
    image-rendering: pixelated;
  }
}
```

### Accessibility Standards
- **ARIA Labels**: Descriptive labels for screen readers
- **Focus Indicators**: Clear visual focus states
- **Color Independence**: Do not rely solely on color for meaning
- **Minimum Touch Target**: 44px × 44px for interactive elements

## Validation & Quality Assurance

### Automated Checks
- **Icon ID Uniqueness**: No duplicate icon identifiers
- **Sprite Path Validation**: Verify asset existence
- **Contrast Compliance**: WCAG 2.1 AA standards
- **Grid Alignment**: 1px stroke alignment verification

### Manual Review Criteria
- **Visual Consistency**: Icons follow established patterns
- **Brand Alignment**: Consistent with Hanseatic theme
- **Scalability**: Icons remain legible at different sizes
- **Cultural Sensitivity**: Avoid potentially offensive symbols

## Severity Overlay System

### Badge Levels
```typescript
type SeverityLevel = 'info' | 'warning' | 'critical' | 'fatal';

// Implementation in icon definition
interface SeverityBadge {
  level: SeverityLevel;
  position: 'top-right' | 'bottom-right' | 'top-left';
  color: string;  // Derived from badgeTint with level modifiers
}
```

### Color Modifiers by Severity
```scss
// Severity-based color adjustments
.info     { opacity: 0.6; }    // Subtle
.warning  { opacity: 0.8; }    // Noticeable  
.critical { opacity: 1.0; }    // Prominent
.fatal    { opacity: 1.0; filter: brightness(1.2); }  // Urgent
```

## Integration Patterns

### Picker Component Usage
```html
<app-hazard-picker
  [selected]="selectedHazards"
  (selectedChange)="onHazardsChange($event)">
</app-hazard-picker>
```

### Room Creator Integration
```typescript
interface RoomHazard {
  type: HazardType;
  severity?: SeverityLevel;
  position?: { x: number; y: number };
  notes?: string;
}
```

## Migration & Maintenance

### Adding New Hazard Types
1. Add to `HazardType` enum
2. Include in `HAZARD_DISPLAY_ORDER` (if primary hazard)
3. Create icon definition with appropriate styling
4. Update validation tests
5. Document in this guide

### Asset Update Process
1. Replace sprite file following naming convention
2. Update `status` from 'placeholder' to 'ready'
3. Verify validation passes
4. Update component cache if needed

## Dependencies & References

- **HazardType Enum**: Authoritative source for hazard categorization
- **HazardIconRegistryService**: Central registry for icon metadata
- **Picker Component**: UI implementation for hazard selection
- **Room Tools**: Integration context for hazard assignment

---

**Document Version**: 1.0  
**Last Updated**: 2025-12-19  
**Maintainer**: SDK & Modding Engineer  
**Review Cycle**: Quarterly or upon hazard enum changes