# Canvas Pan & Zoom Usage Guide

## Overview

This document provides comprehensive guidance for implementing pan and zoom functionality in the Tech Tree Editor. The system transforms the main grid into a spatial editing surface that scales gracefully from small trees (10 nodes) to large trees (100+ nodes) while maintaining structural integrity and deterministic export behavior.

## Philosophy & Principles

### Design System Compliance

The canvas pan and zoom system follows these core principles:

- **Spatial Navigation as Editorial Aid**: Pan and zoom enhance spatial understanding without affecting canonical node ordering
- **Performance First**: Smooth interactions maintained even with 100+ nodes at all zoom levels
- **Deterministic Preservation**: Export behavior remains unchanged regardless of spatial layout
- **Accessibility**: Keyboard navigation and screen reader compatibility maintained
- **Progressive Enhancement**: Works across devices from mobile to desktop

### UI & Ergonomics Charter Alignment

- Pan and zoom reinforce "World First, Interface Second" by providing spatial context without cluttering the main viewport
- Visual density changes support different editing workflows
- Smooth animations inform users of state changes without being distracting

## Core Components

### 1. PanZoomController

The main controller class for managing pan and zoom state:

```typescript
import { PanZoomController, PanZoomPerformanceMonitor } from './canvas-pan-zoom.tokens';

// Initialize controller
const controller = new PanZoomController({
  scale: 1,
  translateX: 0,
  translateY: 0
});

// Set content bounds
controller.setBounds({
  minX: 0,
  maxX: 1000,
  minY: 0,
  maxY: 1000,
  contentWidth: 1000,
  contentHeight: 1000
});

// Listen to state changes
controller.addListener(() => {
  const state = controller.getState();
  updateCanvasTransform(state);
});

// Zoom to specific level
controller.zoomTo(0.75); // Normal view

// Pan to position
controller.panTo(100, 50);

// Zoom to fit content
controller.zoomToFit();
```

### 2. Zoom Levels

The system provides five predefined zoom levels:

**Overview (0.25x)**
- Purpose: See entire tree structure
- Node Scale: 0.6
- Metadata: Hidden
- Performance: High (optimized for large trees)
- Use Case: Planning, understanding overall structure

**Compact (0.5x)**
- Purpose: Detailed overview with essential info
- Node Scale: 0.8
- Metadata: Limited (cost only)
- Performance: High
- Use Case: Quick editing, connection management

**Normal (0.75x)**
- Purpose: Standard editing view
- Node Scale: 1.0
- Metadata: Full metadata visible
- Performance: Medium
- Use Case: Most editing tasks

**Detailed (1.0x)**
- Purpose: Full editing capabilities
- Node Scale: 1.2
- Metadata: Enhanced detail
- Performance: Medium
- Use Case: Precise node editing

**Close-up (1.5x)**
- Purpose: Maximum detail for precise editing
- Node Scale: 1.5
- Metadata: Full detail
- Performance: Low (reduced effects)
- Use Case: Detailed node configuration

### 3. Performance Monitoring

Real-time performance tracking and optimization:

```typescript
const performanceMonitor = new PanZoomPerformanceMonitor();

// Monitor frame rate and render time
function updateFrame() {
  performanceMonitor.startFrame();
  
  // Render content
  renderCanvasContent();
  
  performanceMonitor.endFrame(renderTime);
  performanceMonitor.setNodeCount(nodeCount);
  performanceMonitor.setScale(currentScale);
  
  const metrics = performanceMonitor.getMetrics();
  updatePerformanceIndicator(metrics);
}
```

## Integration Patterns

### 1. Basic Canvas Implementation

```html
<div class="tech-canvas" 
     [class.loading]="isLoading"
     [class.pan-ready]="canPan"
     [class.zoom-ready]="canZoom">
  
  <!-- Zoom indicator -->
  <div class="zoom-indicator" 
       [class.visible]="showZoomIndicator">
    {{ currentZoomPercentage }}%
  </div>
  
  <!-- Canvas viewport -->
  <div class="canvas-viewport"
       (wheel)="onWheel($event)"
       (pointerdown)="onPointerDown($event)"
       (pointermove)="onPointerMove($event)"
       (pointerup)="onPointerUp($event)">
    
    <!-- Transformed content -->
    <div class="canvas-content performance-optimized"
         [style.transform]="getCanvasTransform()">
      <div class="tech-tree-grid">
        <!-- Tech tree nodes and connections -->
        <ng-content></ng-content>
      </div>
    </div>
  </div>
  
  <!-- Performance overlay -->
  <div class="performance-overlay" 
       [class.visible]="showPerformanceWarning">
    {{ performanceMessage }}
  </div>
  
  <!-- Mini-map for large trees -->
  <div class="mini-map" *ngIf="showMiniMap">
    <div class="mini-map-viewport">
      <div class="mini-map-content"
           [style.transform]="getMiniMapTransform()">
        <!-- Mini-map content -->
      </div>
      <div class="mini-map-view"
           [style.transform]="getMiniMapViewTransform()">
      </div>
    </div>
  </div>
</div>
```

### 2. Angular Component Implementation

```typescript
// tech-canvas.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { PanZoomController, PanZoomPerformanceMonitor, PAN_ZOOM_TOKENS } from './canvas-pan-zoom.tokens';

@Component({
  selector: 'app-tech-canvas',
  template: `
    <div class="tech-canvas" 
         [class.loading]="isLoading"
         [class.pan-ready]="canPan"
         [class.zoom-ready]="canZoom"
         [class]="'zoom-level-' + currentZoomLevel">
      
      <!-- Canvas content -->
      <div class="canvas-viewport"
           (wheel)="onWheel($event)"
           (pointerdown)="onPointerDown($event)"
           (pointermove)="onPointerMove($event)"
           (pointerup)="onPointerUp($event)"
           (dblclick)="onDoubleClick($event)">
        
        <div class="canvas-content performance-optimized"
             [style.transform]="getCanvasTransform()">
          <ng-content></ng-content>
        </div>
      </div>
      
      <!-- Zoom indicator -->
      <div class="zoom-indicator" 
           [class.visible]="showZoomIndicator">
        <span class="zoom-percentage">{{ Math.round(currentScale * 100) }}%</span>
        <span class="zoom-level">{{ currentZoomLevelLabel }}</span>
      </div>
      
      <!-- Performance warning -->
      <div class="performance-overlay" 
           [class.visible]="performanceLevel === 'poor'">
        Performance optimization recommended
      </div>
    </div>
  `,
  styleUrls: ['./tech-canvas.component.scss']
})
export class TechCanvasComponent implements OnInit, OnDestroy {
  @Input() nodes: TechnologyNode[] = [];
  @Input() connections: TechnologyConnection[] = [];
  @Input() readonly = false;
  @Input() enableMiniMap = true;
  
  @Output() nodeSelected = new EventEmitter<TechnologyNode>();
  @Output() viewportChanged = new EventEmitter<PanZoomState>();
  
  // State
  controller: PanZoomController;
  performanceMonitor: PanZoomPerformanceMonitor;
  currentScale = 1;
  currentZoomLevel = 'normal';
  currentZoomLevelLabel = 'Normal';
  isLoading = false;
  canPan = true;
  canZoom = true;
  showZoomIndicator = false;
  showPerformanceWarning = false;
  performanceLevel: 'excellent' | 'good' | 'fair' | 'poor' = 'excellent';
  performanceMessage = '';
  
  // Math for template
  Math = Math;
  
  private zoomIndicatorTimeout?: number;
  private animationFrame?: number;
  
  constructor() {
    this.controller = new PanZoomController();
    this.performanceMonitor = new PanZoomPerformanceMonitor();
  }
  
  ngOnInit(): void {
    this.setupEventListeners();
    this.updateCanvasBounds();
    this.startPerformanceMonitoring();
  }
  
  ngOnDestroy(): void {
    if (this.zoomIndicatorTimeout) {
      clearTimeout(this.zoomIndicatorTimeout);
    }
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
  
  private setupEventListeners(): void {
    this.controller.addListener(() => {
      this.updateCanvasTransform();
      this.updateViewportState();
    });
  }
  
  private updateCanvasBounds(): void {
    // Calculate bounds based on nodes
    const bounds = this.calculateContentBounds();
    this.controller.setBounds(bounds);
  }
  
  private calculateContentBounds(): CanvasBounds {
    if (this.nodes.length === 0) {
      return {
        minX: 0,
        maxX: 1000,
        minY: 0,
        maxY: 1000,
        contentWidth: 1000,
        contentHeight: 1000
      };
    }
    
    const positions = this.nodes.map(node => node.gridPosition);
    const minX = Math.min(...positions.map(p => p.x));
    const maxX = Math.max(...positions.map(p => p.x));
    const minY = Math.min(...positions.map(p => p.y));
    const maxY = Math.max(...positions.map(p => p.y));
    
    // Add padding
    const padding = 100;
    
    return {
      minX: minX - padding,
      maxX: maxX + padding,
      minY: minY - padding,
      maxY: maxY + padding,
      contentWidth: (maxX - minX) + padding * 2,
      contentHeight: (maxY - minY) + padding * 2
    };
  }
  
  private updateCanvasTransform(): void {
    const state = this.controller.getState();
    this.currentScale = state.scale;
    this.updateZoomLevel();
    
    // Update performance metrics
    this.performanceMonitor.setScale(state.scale);
    this.performanceMonitor.setNodeCount(this.nodes.length);
  }
  
  private updateZoomLevel(): void {
    const zoomLevel = this.controller.getZoomLevel();
    this.currentZoomLevel = zoomLevel.label.toLowerCase();
    this.currentZoomLevelLabel = zoomLevel.label;
  }
  
  private updateViewportState(): void {
    const state = this.controller.getState();
    this.viewportChanged.emit(state);
    
    // Show zoom indicator temporarily
    this.showZoomIndicator = true;
    if (this.zoomIndicatorTimeout) {
      clearTimeout(this.zoomIndicatorTimeout);
    }
    this.zoomIndicatorTimeout = window.setTimeout(() => {
      this.showZoomIndicator = false;
    }, 1500);
  }
  
  private startPerformanceMonitoring(): void {
    const monitorFrame = () => {
      this.performanceMonitor.startFrame();
      
      // Simulate render time measurement
      const renderStart = performance.now();
      
      // Your render logic here
      this.updateCanvasTransform();
      
      const renderTime = performance.now() - renderStart;
      this.performanceMonitor.endFrame(renderTime);
      
      const metrics = this.performanceMonitor.getMetrics();
      this.updatePerformanceLevel(metrics);
      
      this.animationFrame = requestAnimationFrame(monitorFrame);
    };
    
    this.animationFrame = requestAnimationFrame(monitorFrame);
  }
  
  private updatePerformanceLevel(metrics: any): void {
    this.performanceLevel = metrics.performance;
    
    // Update CSS classes for performance optimization
    const canvas = document.querySelector('.tech-canvas') as HTMLElement;
    if (canvas) {
      canvas.className = canvas.className.replace(/canvas-performance-\w+/, '');
      canvas.classList.add(`canvas-performance-${this.performanceLevel}`);
    }
    
    // Show warning for poor performance
    this.showPerformanceWarning = this.performanceLevel === 'poor';
    this.performanceMessage = this.getPerformanceMessage();
  }
  
  private getPerformanceMessage(): string {
    switch (this.performanceLevel) {
      case 'excellent':
        return '';
      case 'good':
        return 'Performance: Good';
      case 'fair':
        return 'Performance: Fair - Consider zooming out for better performance';
      case 'poor':
        return 'Performance: Poor - Zoom out for better performance';
      default:
        return '';
    }
  }
  
  // Event handlers
  onWheel(event: WheelEvent): void {
    if (!this.canZoom) return;
    
    event.preventDefault();
    this.controller.onWheel(event);
  }
  
  onPointerDown(event: PointerEvent): void {
    if (!this.canPan) return;
    
    this.controller.onPointerDown(event);
  }
  
  onPointerMove(event: PointerEvent): void {
    if (!this.canPan) return;
    
    this.controller.onPointerMove(event);
  }
  
  onPointerUp(event: PointerEvent): void {
    if (!this.canPan) return;
    
    this.controller.onPointerUp(event);
  }
  
  onDoubleClick(event: MouseEvent): void {
    if (!this.canZoom) return;
    
    const rect = (event.target as Element).getBoundingClientRect();
    const centerX = event.clientX - rect.left;
    const centerY = event.clientY - rect.top;
    
    // Toggle between current zoom and 1.0x
    const targetScale = this.currentScale === 1 ? 1.5 : 1;
    this.controller.zoomTo(targetScale, centerX, centerY);
  }
  
  // Public API methods
  zoomToFit(): void {
    this.controller.zoomToFit();
  }
  
  zoomIn(): void {
    this.controller.zoomIn();
  }
  
  zoomOut(): void {
    this.controller.zoomOut();
  }
  
  resetView(): void {
    this.controller.animateTo({
      scale: 1,
      translateX: 0,
      translateY: 0
    });
  }
  
  getCanvasTransform(): string {
    const state = this.controller.getState();
    return `translate(${state.translateX}px, ${state.translateY}px) scale(${state.scale})`;
  }
}
```

### 3. Tech Tree Grid Integration

```scss
// tech-tree-grid.component.scss
@import 'canvas-pan-zoom-tokens';

.tech-tree-grid {
  position: relative;
  display: grid;
  gap: var(--ds-spacing-md);
  padding: var(--ds-spacing-xl);
  
  // Apply zoom level styles
  &.zoom-level-overview {
    .tech-tree-node {
      transform: scale(0.6);
      
      .node-description,
      .node-meta {
        display: none;
      }
    }
  }
  
  &.zoom-level-compact {
    .tech-tree-node {
      transform: scale(0.8);
      
      .node-meta .node-category {
        display: none;
      }
    }
  }
  
  &.zoom-level-normal {
    .tech-tree-node {
      transform: scale(1.0);
    }
  }
  
  &.zoom-level-detailed {
    .tech-tree-node {
      transform: scale(1.2);
    }
  }
  
  &.zoom-level-closeup {
    .tech-tree-node {
      transform: scale(1.5);
    }
  }
  
  // Performance optimizations
  &.performance-optimized {
    will-change: transform;
    backface-visibility: hidden;
    perspective: 1000px;
    
    .tech-tree-node,
    .tech-tree-connection {
      will-change: transform;
    }
  }
}
```

## Keyboard Navigation

### 1. Keyboard Shortcuts

```typescript
// Keyboard shortcuts for pan and zoom
const KEYBOARD_SHORTCUTS = {
  'Ctrl+Plus': () => controller.zoomIn(),
  'Ctrl+Minus': () => controller.zoomOut(),
  'Ctrl+0': () => controller.zoomTo(1),
  'Ctrl+9': () => controller.zoomToFit(),
  'Space+Drag': () => enablePanMode(),
  'ArrowUp': () => controller.panBy(0, -50),
  'ArrowDown': () => controller.panBy(0, 50),
  'ArrowLeft': () => controller.panBy(-50, 0),
  'ArrowRight': () => controller.panBy(50, 0),
  'Home': () => controller.panTo(0, 0),
  'End': () => controller.panTo(maxX, maxY)
};

onKeydown(event: KeyboardEvent): void {
  const key = this.getKeyboardShortcut(event);
  const handler = KEYBOARD_SHORTCUTS[key];
  
  if (handler) {
    event.preventDefault();
    handler();
  }
}
```

### 2. Accessibility Features

```html
<!-- Accessible canvas implementation -->
<div class="tech-canvas canvas-accessible-pan"
     role="application"
     [attr.aria-label]="'Tech Tree Canvas. Current zoom: ' + currentZoomPercentage + ' percent'"
     [attr.aria-describedby]="'canvas-instructions'"
     tabindex="0"
     (keydown)="onKeydown($event)">
  
  <!-- Screen reader instructions -->
  <div id="canvas-instructions" class="sr-only">
    Use arrow keys to pan, Ctrl+Plus and Ctrl+Minus to zoom, Ctrl+0 to reset zoom.
    Press Space and drag to pan. Double-click to toggle zoom level.
  </div>
  
  <!-- Visual zoom indicator for screen readers -->
  <div class="sr-only" 
       [attr.aria-live]="'polite'"
       [textContent]="'Zoom level: ' + currentZoomLevelLabel + ', ' + currentZoomPercentage + ' percent'">
  </div>
</div>
```

## Performance Optimization

### 1. Dynamic Performance Management

```typescript
// Performance optimization based on content and zoom level
class CanvasPerformanceOptimizer {
  private thresholds = {
    excellent: { nodes: 25, scale: 2.0 },
    good: { nodes: 50, scale: 1.5 },
    fair: { nodes: 100, scale: 1.0 },
    poor: { nodes: 200, scale: 0.5 }
  };
  
  optimizePerformance(nodeCount: number, scale: number): string {
    const complexity = nodeCount * scale;
    
    if (complexity < this.thresholds.excellent.nodes * this.thresholds.excellent.scale) {
      return 'excellent';
    } else if (complexity < this.thresholds.good.nodes * this.thresholds.good.scale) {
      return 'good';
    } else if (complexity < this.thresholds.fair.nodes * this.thresholds.fair.scale) {
      return 'fair';
    } else {
      return 'poor';
    }
  }
  
  applyOptimizations(canvas: HTMLElement, level: string): void {
    // Remove previous performance classes
    canvas.className = canvas.className.replace(/canvas-performance-\w+/, '');
    
    // Apply new performance class
    canvas.classList.add(`canvas-performance-${level}`);
    
    // Apply specific optimizations
    switch (level) {
      case 'poor':
        this.disableAnimations(canvas);
        this.reduceDetail(canvas);
        this.enableVirtualScrolling(canvas);
        break;
      case 'fair':
        this.reduceAnimations(canvas);
        this.optimizeConnections(canvas);
        break;
      case 'good':
        this.standardOptimizations(canvas);
        break;
      case 'excellent':
        this.enableAllFeatures(canvas);
        break;
    }
  }
  
  private disableAnimations(canvas: HTMLElement): void {
    canvas.style.setProperty('--canvas-transition-duration', '0ms');
    const nodes = canvas.querySelectorAll('.tech-tree-node');
    nodes.forEach(node => {
      (node as HTMLElement).style.setProperty('animation', 'none');
    });
  }
  
  private reduceDetail(canvas: HTMLElement): void {
    const connections = canvas.querySelectorAll('.tech-tree-connection');
    connections.forEach(connection => {
      const arrow = connection.querySelector('.connection-arrow');
      if (arrow) arrow.remove();
    });
  }
}
```

### 2. Virtual Scrolling for Large Trees

```typescript
// Virtual scrolling implementation for very large trees
class CanvasVirtualScrolling {
  private viewportSize = { width: 0, height: 0 };
  private itemSize = { width: 120, height: 80 };
  private visibleRange = { start: 0, end: 0 };
  
  calculateVisibleRange(scale: number): { start: number; end: number } {
    const viewport = this.controller.getState().viewport;
    const visibleWidth = viewport.width / scale;
    const visibleHeight = viewport.height / scale;
    
    const startCol = Math.floor(-this.controller.getState().translateX / scale / this.itemSize.width);
    const endCol = Math.ceil((visibleWidth - this.controller.getState().translateX / scale) / this.itemSize.width);
    const startRow = Math.floor(-this.controller.getState().translateY / scale / this.itemSize.height);
    const endRow = Math.ceil((visibleHeight - this.controller.getState().translateY / scale) / this.itemSize.height);
    
    return {
      start: startRow * this.getTotalColumns() + startCol,
      end: endRow * this.getTotalColumns() + endCol
    };
  }
  
  renderVisibleItems(nodes: TechnologyNode[]): TechnologyNode[] {
    const range = this.calculateVisibleRange(this.currentScale);
    return nodes.slice(range.start, range.end);
  }
}
```

## Best Practices

### DO:
- Use the predefined zoom levels for consistent user experience
- Implement proper bounds checking to prevent users from getting lost
- Monitor performance and apply optimizations automatically
- Provide keyboard shortcuts for power users
- Use smooth animations to indicate state changes
- Implement proper accessibility features
- Test with large trees (100+ nodes) regularly

### DON'T:
- Allow infinite zoom levels that break visual hierarchy
- Ignore performance metrics when node count increases
- Forget to handle bounds constraints
- Use jarring animations that disorient users
- Neglect keyboard accessibility
- Disable user preferences for motion or zoom
- Break deterministic export behavior

## Troubleshooting

### Common Issues

**Jerky pan/zoom performance**:
- Check node count and apply performance optimizations
- Verify hardware acceleration is enabled
- Consider reducing animation complexity

**Users getting lost in large trees**:
- Implement mini-map for trees > 50 nodes
- Add "zoom to fit" functionality
- Provide breadcrumbs or location indicators

**Zoom levels not applying correctly**:
- Verify CSS classes are being applied
- Check transform origin settings
- Ensure proper scale calculations

**Performance degradation at high zoom**:
- Apply poor performance optimizations
- Disable expensive effects at high zoom levels
- Consider virtual scrolling for very large datasets

### Debug Tools

```typescript
// Debug utilities for pan and zoom
export class PanZoomDebugger {
  static logState(controller: PanZoomController): void {
    const state = controller.getState();
    console.log('Canvas State:', {
      scale: state.scale,
      translate: { x: state.translateX, y: state.translateY },
      bounds: state.bounds,
      viewport: state.viewport
    });
  }
  
  static measurePerformance(controller: PanZoomController): PerformanceMetrics {
    const start = performance.now();
    controller.zoomTo(2);
    const end = performance.now();
    
    return {
      zoomTime: end - start,
      fps: this.measureFPS(),
      memoryUsage: this.getMemoryUsage()
    };
  }
  
  private static measureFPS(): number {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const countFrames = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        console.log('FPS:', frameCount);
        frameCount = 0;
        lastTime = now;
      }
      requestAnimationFrame(countFrames);
    };
    
    requestAnimationFrame(countFrames);
    return 0; // Placeholder
  }
}
```

## Integration Notes

### Dependencies
- Design system tokens (colors, spacing, typography)
- Pan and zoom controller utilities
- Performance monitoring tools

### Browser Support
- Modern browsers with CSS transform support
- Pointer events for touch devices
- RequestAnimationFrame for smooth animations

### Performance Impact
- Minimal CPU overhead for basic pan/zoom
- Automatic optimization based on content complexity
- Graceful degradation for older devices

The pan and zoom system provides a powerful spatial editing experience while maintaining the deterministic behavior and performance characteristics required for the Tech Tree Editor.