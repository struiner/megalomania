# HUD Assets Directory

This directory contains all visual assets for the HUD system.

## Directory Structure

```
assets/
├── icons/              # Icon sprite sheets and source files
│   ├── kenney/        # Kenney Game Icons (CC0) - primary source
│   ├── game-icons-net/ # Game-Icons.net (CC BY 3.0) - supplemental
│   └── 0x72/          # 0x72 Dungeon Tileset II (CC0) - markers only
├── fonts/             # HUD-specific fonts
└── textures/          # Background textures and patterns
```

## Icon Assets

### Kenney Game Icons (Primary)
- License: CC0 1.0 (public domain)
- Source: https://kenney.nl/assets/game-icons
- Format: PNG (16px, 32px) + SVG sources
- Usage: Primary HUD icon source, brass recolor applied

### Game-Icons.net (Supplemental)
- License: CC BY 3.0 (attribution required)
- Source: https://game-icons.net/
- Usage: Fill gaps in Kenney coverage
- Attribution: "Icons by Lorc, Delapouite & contributors"

### 0x72 Dungeon Tileset II (Markers Only)
- License: CC0 1.0
- Source: https://0x72.itch.io/dungeon-tileset-ii
- Usage: Map markers and minimap indicators only

## Integration Notes

- All icons must maintain pixel grid integrity
- Brass/ink recolor applied for Hanseatic theme consistency
- Sprite atlases generated for optimal performance
- Fallback to emoji glyphs if sprite loading fails