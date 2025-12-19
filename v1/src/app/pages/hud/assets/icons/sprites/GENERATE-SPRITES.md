# Sprite Atlas Generation Instructions

This directory should contain the generated sprite atlases for the HUD icon system.

## Required Files

- `hud-icons-16.png` - 16x16 pixel sprite atlas
- `hud-icons-32.png` - 32x32 pixel sprite atlas (2x scale)

## Generation Steps

### Option 1: Manual Creation (Recommended for Pilot)
1. Download Kenney Game Icons pack from https://kenney.nl/assets/game-icons
2. Extract the following icons and recolor to brass (#c08a3b):
   - backpack.png → inventory
   - ledger.png → ledger
   - map.png → map
   - group.png → crew
   - scales.png → trade
   - compass.png → quests
   - cog.png → settings
   - question.png → help
   - anchor.png → status
   - bell.png → notifications
3. Arrange in a grid with 16x16 tiles, no padding
4. Save as both 16px and 32px versions

### Option 2: Automated Packing
Use tools like TexturePacker, ShoeBox, or similar sprite packing software.

**Settings:**
- Trim mode: None
- Padding: 0
- Format: RGBA8888
- Scale modes: Nearest neighbor
- Size: 128x64px (4x2 grid for 16px icons)

## Sprite Layout Reference

Based on the current manifest, the sprite sheet layout should be:

```
Row 0: inventory, ledger, map, crew, trade, quests, settings, help
Row 1: status, notifications, quest-star, ledger-book, [empty], [empty], [empty], [empty]
```

Each icon occupies 16x16 pixels (or 32x32 for the 2x version).

## Integration Verification

After generating the sprite sheets:

1. Place them in this directory
2. Update the coordinate values in `../hud-icon-manifest.ts` if needed
3. Test with the HUD components

## File Structure
```
sprites/
├── hud-icons-16.png      # Main sprite atlas (16px)
├── hud-icons-32.png      # 2x scale sprite atlas (32px)
└── GENERATE-SPRITES.md   # This file
```

## Notes

- Keep transparency for backgrounds
- Use hard edges, no anti-aliasing
- Brass recolor should be #c08a3b
- Ensure pixel-perfect alignment