# Tech Canvas Keyboard Shortcuts Reference

## Overview
This document provides a comprehensive reference for all keyboard shortcuts available in the Tech Canvas component. These shortcuts enable efficient keyboard-only navigation and operation of the technology tree.

## Navigation Shortcuts

### Basic Navigation
| Shortcut | Action | Description |
|----------|--------|-------------|
| `Tab` | Next Node | Move to the next technology node in spatial order |
| `Shift + Tab` | Previous Node | Move to the previous technology node in spatial order |
| `↑` | Move Up | Navigate to node above current position |
| `↓` | Move Down | Navigate to node below current position |
| `←` | Move Left | Navigate to node to the left in same tier |
| `→` | Move Right | Navigate to node to the right in same tier |

### Quick Navigation
| Shortcut | Action | Description |
|----------|--------|-------------|
| `Home` | First Node | Jump to the first node in the canvas |
| `End` | Last Node | Jump to the last node in the canvas |
| `Page Up` | Previous Tier | Navigate to closest node in tier above |
| `Page Down` | Next Tier | Navigate to closest node in tier below |

## Selection and Actions

### Node Selection
| Shortcut | Action | Description |
|----------|--------|-------------|
| `Enter` | Select Node | Select the currently focused node |
| `Space` | Select Node | Alternative key to select focused node |
| `Ctrl + A` | Select All | Select all nodes in the canvas |
| `Ctrl + D` | Deselect All | Clear all node selections |

### Drag and Drop
| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl + Space` | Toggle Structural Edit | Enable/disable structural editing mode |
| `Escape` | Cancel Operations | Cancel current drag operation or close dialog |

## Canvas Control

### Zoom and Pan
| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl + +` | Zoom In | Increase zoom level |
| `Ctrl + -` | Zoom Out | Decrease zoom level |
| `Ctrl + 0` | Reset Zoom | Return zoom to 100% |
| `Mouse Wheel` | Zoom | Scroll to zoom in/out (mouse only) |
| `Mouse Drag` | Pan | Drag canvas to pan (mouse only) |

### Canvas Regions
| Shortcut | Action | Description |
|----------|--------|-------------|
| `F6` | Cycle Regions | Move focus through different canvas regions |
| `Ctrl + F` | Focus Search | Move focus to search/filter input |

## Utility Shortcuts

### System Operations
| Shortcut | Action | Description |
|----------|--------|-------------|
| `Escape` | Cancel | Cancel ongoing operations, close dialogs |
| `Ctrl + R` | Refresh | Refresh canvas data (when implemented) |
| `Ctrl + S` | Save | Save current canvas state (when implemented) |

### Help and Information
| Shortcut | Action | Description |
|----------|--------|-------------|
| `F1` | Help | Show help documentation (when implemented) |
| `F11` | Fullscreen | Toggle fullscreen mode (when implemented) |

## Spatial Navigation Details

### How Spatial Navigation Works
The Tech Canvas uses intelligent spatial navigation that follows the visual layout of the technology tree:

1. **Tier-Based Organization**: Nodes are organized in horizontal tiers
2. **Left-to-Right Reading**: Within each tier, navigation follows left-to-right order
3. **Vertical Connections**: Arrow keys can move between tiers when aligned
4. **Nearest Neighbor Logic**: When no direct alignment exists, the nearest node is chosen

### Navigation Examples

#### Example 1: Basic Tier Navigation
```
Tier 1: [Node A] → [Node B] → [Node C]
Tier 2:         [Node D] → [Node E]
```
- From Node A: `→` goes to Node B, `↓` goes to Node D
- From Node C: `←` goes to Node B, `↓` goes to Node E

#### Example 2: Cross-Tier Navigation
```
Tier 1: [Node A]       [Node C]
Tier 2:       [Node B]
```
- From Node A: `→` goes to Node C, `↓` goes to Node B
- From Node B: `↑` chooses closest node (Node A or Node C)

## Accessibility Features

### Screen Reader Support
- All shortcuts are announced to screen readers
- Navigation actions provide spatial context
- State changes are announced (selection, focus, zoom)

### Focus Management
- Visual focus indicators for all shortcuts
- Focus is preserved during canvas operations
- Skip links available for large canvases

### High Contrast Mode
- All shortcuts work in high contrast mode
- Focus indicators are enhanced for visibility
- Keyboard shortcuts are preserved regardless of theme

## Shortcut Customization

### Configuration Options
The keyboard shortcuts can be customized through the component configuration:

```typescript
interface AccessibilityConfig {
  enableKeyboardNavigation: boolean;    // Enable/disable all keyboard navigation
  enableKeyboardShortcuts: boolean;     // Enable/disable shortcuts
  announcementsDelay: number;           // Delay for screen reader announcements
  focusVisibleTimeout: number;          // How long focus indicators remain visible
}
```

### Disabling Shortcuts
To disable specific shortcuts:

1. Set `enableKeyboardShortcuts: false` in accessibility config
2. Individual shortcuts can be overridden by setting up custom key handlers
3. All navigation shortcuts remain functional even when other shortcuts are disabled

## Troubleshooting

### Shortcuts Not Working
1. **Check Focus**: Ensure the canvas has keyboard focus
2. **Browser Focus**: Click on the canvas or use Tab to focus it
3. **Accessibility Settings**: Verify accessibility features are enabled
4. **Browser Compatibility**: Test in supported browsers

### Conflicts with Browser Shortcuts
- Some shortcuts may conflict with browser defaults
- Browser shortcuts typically take precedence
- Consider using alternative shortcuts for important functions

### Screen Reader Issues
1. **Enable Screen Reader**: Ensure screen reader is running
2. **Check Announcements**: Verify live regions are working
3. **Test Different Readers**: Test with NVDA, JAWS, VoiceOver
4. **Update Screen Reader**: Ensure latest version is installed

## Best Practices

### For Power Users
- Learn spatial navigation patterns for faster traversal
- Use keyboard shortcuts for common operations
- Memorize frequently used shortcut combinations
- Practice spatial mental mapping

### For Accessibility Users
- Rely on screen reader announcements for context
- Use Home/End for quick navigation to extremes
- Use Page Up/Down for tier-based navigation
- Take advantage of skip links for large canvases

### For Developers
- Ensure all functionality is keyboard accessible
- Test with actual assistive technology users
- Provide alternative input methods where possible
- Maintain consistent shortcut patterns across components

## Version History

### Current Version: 1.0
- Initial keyboard shortcut implementation
- Full spatial navigation support
- Screen reader integration
- WCAG 2.1 AA compliance

### Future Enhancements
- Customizable shortcut keybindings
- Macro recording and playback
- Advanced navigation patterns
- Integration with external accessibility tools

---

## Quick Reference Card

```
NAVIGATION:     Tab/Shift+Tab, Arrow Keys, Home/End, Page Up/Down
SELECTION:      Enter/Space, Ctrl+A, Ctrl+D
ZOOM:           Ctrl++/-, Ctrl+0
UTILITIES:      Ctrl+F, Ctrl+Space, Escape, F6
```

*Keep this reference handy for quick lookup of keyboard shortcuts while using the Tech Canvas.*