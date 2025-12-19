# HUD Icon Integration Implementation Guide

This guide provides step-by-step instructions for completing the HUD icon asset pack sourcing integration after the decision to use Kenney Game Icons (CC0) as the primary source.

## Prerequisites

- Access to Kenney Game Icons pack (CC0 licensed)
- Image editing software capable of pixel-perfect recoloring
- Build system access for asset bundling

## Phase 1: Asset Acquisition and Preparation

### 1.1 Download Kenney Game Icons
```bash
# Download from https://kenney.nl/assets/game-icons
# Look for "1-bit" or "outline" style icons for best HUD compatibility
```

### 1.2 Create Directory Structure
```bash
mkdir -p megalomania/v1/src/app/pages/hud/assets/icons/sprites
mkdir -p megalomania/v1/src/app/pages/hud/assets/icons/kenney/16px
mkdir -p megalomania/v1/src/app/pages/hud/assets/icons/kenney/32px
```

### 1.3 Extract and Recolor Pilot Icons
Extract the following icons from Kenney pack and recolor to brass (#c08a3b) on transparent background:

| HUD Action | Kenney Filename | Notes |
|------------|-----------------|-------|
| Inventory | backpack.png | Primary action, brass stroke |
| Ledger | ledger.png | Official record symbol |
| Map | map.png | Keep negative space |
| Crew | group.png | Two silhouettes, 1-bit edges |
| Trade | scales.png | Balance/market symbol |
| Quests | compass.png | Exploration tone |
| Settings | cog.png | Standard configuration |
| Help | question.png | Outline variant |
| Status Header | anchor.png | Maritime motif |
| Notifications Header | bell.png | Badge-friendly |

**Recoloring Process:**
1. Convert to 1-bit (black/white)
2. Replace black with brass (#c08a3b)
3. Ensure hard edges, no anti-aliasing
4. Export as PNG with transparency
5. Save 16px and 32px versions

### 1.4 Generate Sprite Sheets

**Option A: Manual Packing (Recommended for Pilot)**
```bash
# Create sprite atlas manually using image editor
# Grid: 16x16 tiles, pack with 0 padding
# Filenames: hud-icons-16.png, hud-icons-32.png
```

**Option B: Automated Packing Script**
```bash
# Use tools like TexturePacker or similar
# Settings:
# - Trim mode: None
# - Padding: 0
# - Format: RGBA8888
# - Scale modes: Nearest neighbor
```

## Phase 2: Asset Integration

### 2.1 Update Asset Paths
Place generated sprite sheets in:
```
megalomania/v1/src/app/pages/hud/assets/icons/sprites/
├── hud-icons-16.png
└── hud-icons-32.png
```

### 2.2 Verify TypeScript Manifest
The `hud-icon-manifest.ts` file has been created with:
- Sprite sheet configurations
- Icon coordinate mappings
- Fallback emoji assignments
- Licensing attribution strings

**Update coordinates** after generating actual sprite sheets:
```typescript
// Example update needed after sprite sheet generation
coordinates: { x: 16, y: 32 }  // Update with actual positions
```

### 2.3 Configure Build System
Add sprite sheet paths to Angular assets configuration in `angular.json`:
```json
{
  "assets": [
    "src/favicon.ico",
    "src/assets",
    {
      "glob": "**/*",
      "input": "src/app/pages/hud/assets",
      "output": "/assets/hud/"
    }
  ]
}
```

## Phase 3: Component Updates

### 3.1 Update Existing Components
Components have been updated to support both sprite and emoji rendering:

- `HudIconComponent`: Now accepts `iconId` instead of `glyph`
- `HudIconHeaderComponent`: Updated to use `iconId` property
- Fallback to emoji glyphs if sprite loading fails

### 3.2 Usage Examples

**Before (Emoji only):**
```html
<app-hud-icon glyph="🎒" label="Inventory"></app-hud-icon>
```

**After (Sprite + Fallback):**
```html
<app-hud-icon iconId="inventory" label="Inventory"></app-hud-icon>
```

### 3.3 Test Fallback Behavior
```html
<!-- Force emoji fallback for testing -->
<app-hud-icon iconId="inventory" [forceEmoji]="true" label="Inventory"></app-hud-icon>
```

## Phase 4: Styling Integration

### 4.1 SCSS Tokens Added
The following CSS custom properties have been added to `hud-theme.tokens.scss`:
```scss
--hud-icon-stroke: var(--hud-brass, #c08a3b);
--hud-icon-shadow: var(--hud-shadow, #1b2433);
--hud-icon-bg: transparent;
--hud-icon-size-1x: 16px;
--hud-icon-size-2x: 32px;
--hud-icon-sprite-url-16: url('/assets/icons/sprites/hud-icons-16.png');
--hud-icon-sprite-url-32: url('/assets/icons/sprites/hud-icons-32.png');
--hud-icon-rendering: pixelated;
```

### 4.2 Component Styles
Update `hud-icon.component.scss` to use new tokens:
```scss
.hud-icon {
  // Use CSS custom properties for consistent theming
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  
  &--sprite {
    image-rendering: var(--hud-icon-rendering);
  }
  
  &--emoji {
    // Emoji fallback styling
    font-size: var(--hud-icon-size-1x);
    line-height: 1;
  }
}
```

## Phase 5: Integration Testing

### 5.1 Verify All Icons Load
1. Check browser network tab for sprite sheet requests
2. Verify fallback to emoji when sprites unavailable
3. Test both 1x and 2x sizes
4. Confirm accessibility labels work

### 5.2 Visual Regression Testing
```html
<!-- Test all pilot icons -->
<app-hud-icon iconId="inventory" label="Inventory"></app-hud-icon>
<app-hud-icon iconId="ledger" label="Ledger"></app-hud-icon>
<app-hud-icon iconId="map" label="Map"></app-hud-icon>
<app-hud-icon iconId="crew" label="Crew"></app-hud-icon>
<app-hud-icon iconId="trade" label="Trade"></app-hud-icon>
<app-hud-icon iconId="quests" label="Quests"></app-hud-icon>
<app-hud-icon iconId="settings" label="Settings"></app-hud-icon>
<app-hud-icon iconId="help" label="Help"></app-hud-icon>
```

### 5.3 Accessibility Testing
- Screen reader announcements
- High contrast mode compatibility
- Colorblind accessibility (brass/ink scheme)

## Phase 6: Deployment Checklist

### 6.1 Asset Optimization
- [ ] Compress sprite sheets (use tools like pngquant)
- [ ] Verify file sizes are reasonable
- [ ] Test loading performance

### 6.2 Licensing Compliance
- [ ] Add attribution to credits/ABOUT file:
  ```
  Icons by Kenney (CC0 1.0) - https://kenney.nl
  Icons by Lorc, Delapouite & contributors (CC BY 3.0) - https://game-icons.net (if used)
  ```
- [ ] Verify license files included in build

### 6.3 Documentation Updates
- [ ] Update component READMEs
- [ ] Add icon usage guidelines
- [ ] Document sprite sheet maintenance process

## Troubleshooting

### Common Issues

**Icons not displaying:**
1. Check sprite sheet paths in manifest
2. Verify image URLs are correct
3. Check browser console for 404 errors

**Fuzzy/pixelated icons:**
1. Ensure `image-rendering: pixelated` is applied
2. Verify sprite coordinates are correct
3. Check that 2x sprites are exactly double size

**Fallback not working:**
1. Verify `forceEmoji` input works
2. Check icon ID exists in manifest
3. Ensure fallback glyph is set

## Next Steps

After completing this integration:

1. **Expand Icon Coverage**: Add more icons beyond the pilot set
2. **Animation Integration**: Consider icon state animations (hover, active)
3. **Theme Variations**: Support light/dark theme icon variants
4. **Performance Optimization**: Implement sprite preloading
5. **Icon Search/Filter**: Build picker interface for icon selection

## File Changes Summary

### Created Files
- `megalomania/v1/src/app/pages/hud/assets/README.md`
- `megalomania/v1/src/app/pages/hud/assets/icons/kenney/README.md`
- `megalomania/v1/src/app/pages/hud/assets/icons/hud-icon-manifest.ts`
- `megalomania/v1/src/app/pages/hud/HUD-ICON-INTEGRATION-GUIDE.md` (this file)

### Modified Files
- `megalomania/v1/src/app/pages/hud/theme/hud-theme.tokens.scss` (added icon tokens)
- `megalomania/v1/src/app/pages/hud/components/hud-icon.component.ts` (sprite support)
- `megalomania/v1/src/app/pages/hud/components/hud-icon.component.html` (template updates)
- `megalomania/v1/src/app/pages/hud/components/hud-icon-header.component.ts` (API consistency)
- `megalomania/v1/src/app/pages/hud/components/hud-icon-header.component.html` (template updates)

### Assets to Add
- `megalomania/v1/src/app/pages/hud/assets/icons/sprites/hud-icons-16.png`
- `megalomania/v1/src/app/pages/hud/assets/icons/sprites/hud-icons-32.png`
- Individual recolored icons in `kenney/` directory