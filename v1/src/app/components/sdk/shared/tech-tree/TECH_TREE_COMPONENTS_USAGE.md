# Tech Tree Components Usage Guide

## Overview

The Tech Tree Components provide a complete implementation of zoom-responsive node components for technology trees with pan/zoom canvas functionality. These components are designed to adapt their visual presentation based on canvas zoom level while maintaining readability and consistent interaction patterns.

## Components

### TechTreeCanvasComponent
The main container component that manages the zoomable, pannable canvas for displaying technology nodes.

**Features:**
- Zoom controls (0.25x to 3.0x)
- Mouse wheel zoom and drag-to-pan
- Keyboard navigation support
- Grid background for spatial reference
- Real-time zoom and pan position updates

### TechNodeComponent
Individual technology node component with zoom-responsive templates.

**Features:**
- Three template modes: `compact`, `standard`, `detailed`
- Visual state management (selected, focused, invalid, disabled, etc.)
- Progressive information disclosure
- Accessibility support with keyboard navigation

## Usage

### Basic Setup

1. **Import the Module**
```typescript
import { TechTreeModule } from './shared/tech-tree';

@NgModule({
  imports: [
    // ... other imports
    TechTreeModule
  ]
})
export class YourModule { }
```

2. **Add to Template**
```html
<app-tech-tree-canvas
  [nodes]="techNodes"
  [config]="canvasConfig"
  (nodeSelected)="onNodeSelected($event)"
  (nodeFocused)="onNodeFocused($event)"
  (zoomChanged)="onZoomChanged($event)">
</app-tech-tree-canvas>
```

### Configuration

```typescript
import { TechNode, TechTreeCanvasConfig } from './shared/tech-tree';

const canvasConfig: TechTreeCanvasConfig = {
  zoomMin: 0.25,
  zoomMax: 3.0,
  zoomStep: 0.1,
  initialZoom: 1.0,
  nodeSpacing: { x: 200, y: 150 },
  gridSize: 20
};

const techNodes: TechNode[] = [
  {
    id: 'basic-metallurgy',
    name: 'Basic Metallurgy',
    description: 'Learn to work with basic metals',
    tier: 1,
    cost: 50,
    prerequisites: [],
    effects: ['Unlocks basic metal tools'],
    cultureTags: ['metalworking'],
    position: { x: 0, y: 0 },
    isUnlocked: true,
    isDiscovered: true,
    isResearched: false,
    isResearching: false
  }
  // ... more nodes
];
```

### Event Handling

```typescript
onNodeSelected(node: TechNode): void {
  console.log('Selected node:', node.name);
  // Handle node selection logic
}

onNodeFocused(node: TechNode): void {
  console.log('Focused node:', node.name);
  // Handle node focus for accessibility
}

onZoomChanged(zoom: number): void {
  console.log('Current zoom:', zoom);
  // Handle zoom changes for analytics or UI updates
}
```

## Template Modes

### Compact Mode (Zoom < 0.5)
- Icon + Title only
- Minimum space usage
- Maximum density for overview

### Standard Mode (Zoom 0.5 - 1.5)
- Icon + Title + Basic metadata
- Tier and cost information
- Limited prerequisite display

### Detailed Mode (Zoom > 1.5)
- Full information display
- Complete prerequisite list
- Effects and culture tags
- Best for editing and detailed review

## Visual States

### Node States
- **Selected**: Node is currently selected (highlighted border)
- **Focused**: Node has keyboard focus (focus ring)
- **Invalid**: Node has validation issues (warning styling)
- **Disabled**: Node cannot be interacted with (reduced opacity)
- **Active Path**: Node is part of current research path
- **Prerequisite States**: Visual feedback for requirement fulfillment

### State Icons
- `⚠` - Warning/Invalid state
- `⏸` - Disabled state
- `✓` - Researched/Completed
- `⟳` - Currently researching
- `●` - Unlocked and available
- `○` - Locked/Requires prerequisites

## Accessibility Features

### Keyboard Navigation
- **Arrow Keys**: Navigate between nodes
- **Enter/Space**: Select focused node
- **+/-**: Zoom in/out
- **0**: Reset zoom to default
- **Mouse Wheel**: Zoom canvas
- **Drag**: Pan canvas

### Screen Reader Support
- ARIA labels for all interactive elements
- Descriptive tooltips with full node information
- Role="application" for the canvas component
- Live regions for zoom and selection updates

## Responsive Design

### Mobile Optimization
- Touch-friendly controls
- Simplified interface at small screen sizes
- Optimized button sizes and spacing
- Reduced information density

### High Contrast Mode
- Enhanced border visibility
- Clearer state differentiation
- Improved color contrast ratios

### Reduced Motion
- Disabled transitions for users who prefer reduced motion
- Static zoom and pan controls

## Integration Examples

### With Form Validation
```typescript
getNodeState(node: TechNode): TechNodeState {
  return {
    selected: node.id === this.selectedNodeId,
    focused: node.id === this.focusedNodeId,
    invalid: this.hasCircularDependencies(node),
    disabled: !node.isUnlocked,
    activePath: this.isInActivePath(node),
    prerequisiteSatisfied: this.arePrerequisitesMet(node),
    prerequisiteUnsatisfied: !this.arePrerequisitesMet(node)
  };
}
```

### With State Management
```typescript
// Update node states based on research progress
updateNodeStates(): void {
  this.nodes.forEach(node => {
    node.isResearched = this.researchService.isResearched(node.id);
    node.isUnlocked = this.arePrerequisitesMet(node);
    node.isResearching = this.researchService.isResearching(node.id);
  });
}
```

## Performance Considerations

### Virtual Scrolling
For large technology trees (>100 nodes), consider implementing virtual scrolling to maintain performance.

### Debounced Events
Zoom and pan events are debounced to prevent excessive updates.

### Efficient Rendering
- Use `trackBy` functions for node lists
- Minimize DOM manipulations
- Leverage Angular's change detection strategies

## Customization

### Styling
Components use design system tokens for consistent theming:
- Typography tokens for font sizes and weights
- Color tokens for state-specific styling
- Spacing tokens for layout consistency
- Focus state tokens for accessibility

### Custom Templates
The component structure supports template customization through content projection if needed.

## Testing

### Unit Testing
```typescript
describe('TechNodeComponent', () => {
  let component: TechNodeComponent;
  let fixture: ComponentFixture<TechNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechNodeComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(TechNodeComponent);
    component = fixture.componentInstance;
  });

  it('should display node name', () => {
    component.node = mockTechNode;
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Basic Metallurgy');
  });
});
```

### Integration Testing
Test the complete canvas interaction flow including zoom, pan, and node selection.

## Troubleshooting

### Common Issues

1. **Nodes not displaying**: Check that all required node properties are provided
2. **Zoom not working**: Ensure wheel event listeners are properly attached
3. **States not updating**: Verify event handlers are connected correctly
4. **Performance issues**: Consider implementing virtual scrolling for large datasets

### Debug Mode
Enable debug logging by setting `console.log` statements in event handlers to trace component behavior.

## Future Enhancements

- Connection lines between prerequisite nodes
- Drag and drop node repositioning
- Undo/redo functionality
- Export/import technology tree data
- Advanced filtering and search capabilities