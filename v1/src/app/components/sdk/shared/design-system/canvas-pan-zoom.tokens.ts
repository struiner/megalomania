// Design System Canvas Pan & Zoom Tokens
// Comprehensive pan and zoom system for Tech Tree Canvas
// Complies with UI & Ergonomics Charter principles
// Spatial navigation as editorial aid, not structural modification

export interface CanvasViewport {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PanZoomState {
  scale: number;
  translateX: number;
  translateY: number;
  viewport: CanvasViewport;
  bounds: CanvasBounds;
}

export interface CanvasBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  contentWidth: number;
  contentHeight: number;
}

export interface ZoomLevel {
  value: number;
  label: string;
  description: string;
  nodeScale: number;
  connectionScale: number;
  metadataVisible: boolean;
  nodeSpacing: number;
  iconSize: number;
  textSize: 'xs' | 'sm' | 'md' | 'lg';
  performance: 'low' | 'medium' | 'high';
}

export interface PanZoomConfig {
  minScale: number;
  maxScale: number;
  zoomStep: number;
  panSpeed: number;
  wheelSensitivity: number;
  animationDuration: number;
  boundsPadding: number;
  zoomToCursor: boolean;
  debounceMs: number;
  throttleMs: number;
}

// ============================================================================
// CANVAS PAN & ZOOM TOKEN DEFINITIONS
// ============================================================================

export const PAN_ZOOM_TOKENS = {
  // Zoom levels from overview to detailed editing
  zoomLevels: {
    overview: {
      value: 0.25,
      label: 'Overview',
      description: 'See entire tree structure',
      nodeScale: 0.6,
      connectionScale: 0.8,
      metadataVisible: false,
      nodeSpacing: 1.5,
      iconSize: 16,
      textSize: 'xs' as const,
      performance: 'high' as const
    },
    compact: {
      value: 0.5,
      label: 'Compact',
      description: 'Detailed overview with essential info',
      nodeScale: 0.8,
      connectionScale: 0.9,
      metadataVisible: false,
      nodeSpacing: 1.2,
      iconSize: 20,
      textSize: 'xs' as const,
      performance: 'high' as const
    },
    normal: {
      value: 0.75,
      label: 'Normal',
      description: 'Standard editing view',
      nodeScale: 1.0,
      connectionScale: 1.0,
      metadataVisible: true,
      nodeSpacing: 1.0,
      iconSize: 24,
      textSize: 'sm' as const,
      performance: 'medium' as const
    },
    detailed: {
      value: 1.0,
      label: 'Detailed',
      description: 'Full editing capabilities',
      nodeScale: 1.2,
      connectionScale: 1.1,
      metadataVisible: true,
      nodeSpacing: 0.9,
      iconSize: 28,
      textSize: 'sm' as const,
      performance: 'medium' as const
    },
    closeup: {
      value: 1.5,
      label: 'Close-up',
      description: 'Maximum detail for precise editing',
      nodeScale: 1.5,
      connectionScale: 1.2,
      metadataVisible: true,
      nodeSpacing: 0.8,
      iconSize: 32,
      textSize: 'md' as const,
      performance: 'low' as const
    }
  },

  // Pan and zoom configuration
  config: {
    minScale: 0.1,
    maxScale: 3.0,
    zoomStep: 0.1,
    panSpeed: 1.0,
    wheelSensitivity: 0.001,
    animationDuration: 200, // ms
    boundsPadding: 50, // px
    debounceMs: 16, // ~60fps
    throttleMs: 50,
    zoomToCursor: true
  },

  // Performance thresholds
  performance: {
    lowDensity: 25,     // nodes
    mediumDensity: 50,  // nodes
    highDensity: 100,   // nodes
    maxNodes: 200       // absolute maximum
  },

  // Interaction settings
  interaction: {
    // Mouse/touch interactions
    doubleClickZoom: true,
    pinchToZoom: true,
    panInertia: 0.85,
    zoomToCursor: true,
    
    // Keyboard shortcuts
    keyboardZoomStep: 0.1,
    keyboardPanStep: 50,
    
    // Gesture thresholds
    panThreshold: 5,      // px before pan starts
    zoomThreshold: 0.05,  // scale delta for zoom
    rotationThreshold: 15 // degrees (future feature)
  },

  // Visual feedback
  feedback: {
    // Zoom indicator
    zoomIndicator: {
      position: 'bottom-right' as const,
      opacity: 0.8,
      animationDuration: 150,
      showPercentage: true
    },
    
    // Loading states
    loadingOverlay: {
      opacity: 0.3,
      animationDuration: 300,
      showSpinner: true
    },
    
    // Bounds feedback
    boundsIndicator: {
      color: '#ff6b35',
      opacity: 0.6,
      thickness: 2
    }
  },

  // CSS Custom Properties for theming
  cssProperties: {
    '--canvas-zoom-indicator-bg': 'rgba(0, 0, 0, 0.7)',
    '--canvas-zoom-indicator-color': '#ffffff',
    '--canvas-bounds-indicator-color': '#ff6b35',
    '--canvas-pan-cursor-grab': 'grab',
    '--canvas-pan-cursor-grabbing': 'grabbing',
    '--canvas-zoom-cursor-crosshair': 'crosshair',
    '--canvas-transition-duration': '200ms',
    '--canvas-ease-out': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  }
} as const;

// ============================================================================
// UTILITY CLASSES
// ============================================================================

export class PanZoomController {
  private state: PanZoomState;
  private config: PanZoomConfig;
  private listeners: Set<() => void> = new Set();
  private animationFrame: number | null = null;
  private lastPanPoint: { x: number; y: number } | null = null;
  private isPanning = false;
  private isZooming = false;

  constructor(
    initialState?: Partial<PanZoomState>,
    config?: Partial<PanZoomConfig>
  ) {
    this.config = { 
      ...PAN_ZOOM_TOKENS.config, 
      ...config
    };
    
    this.state = {
      scale: 1,
      translateX: 0,
      translateY: 0,
      viewport: { x: 0, y: 0, width: 0, height: 0 },
      bounds: {
        minX: 0,
        maxX: 1000,
        minY: 0,
        maxY: 1000,
        contentWidth: 1000,
        contentHeight: 1000
      },
      ...initialState
    };

    this.updateViewport();
  }

  // State Management
  getState(): PanZoomState {
    return { ...this.state };
  }

  setState(newState: Partial<PanZoomState>): void {
    this.state = { ...this.state, ...newState };
    this.updateViewport();
    this.notifyListeners();
  }

  // Zoom Methods
  zoomTo(scale: number, centerX?: number, centerY?: number): void {
    const clampedScale = this.clampScale(scale);
    const center = centerX !== undefined && centerY !== undefined 
      ? { x: centerX, y: centerY }
      : this.getViewportCenter();

    // Zoom to cursor position
    if (this.config.zoomToCursor && center) {
      const { translateX, translateY } = this.calculateZoomTranslation(
        clampedScale,
        center.x,
        center.y
      );
      
      this.setState({
        scale: clampedScale,
        translateX,
        translateY
      });
    } else {
      this.setState({ scale: clampedScale });
    }
  }

  zoomIn(step: number = this.config.zoomStep): void {
    this.zoomTo(this.state.scale + step);
  }

  zoomOut(step: number = this.config.zoomStep): void {
    this.zoomTo(this.state.scale - step);
  }

  zoomToFit(): void {
    const bounds = this.state.bounds;
    const viewport = this.state.viewport;
    
    if (bounds.contentWidth === 0 || bounds.contentHeight === 0) return;

    const scaleX = (viewport.width - this.config.boundsPadding * 2) / bounds.contentWidth;
    const scaleY = (viewport.height - this.config.boundsPadding * 2) / bounds.contentHeight;
    const scale = Math.min(scaleX, scaleY, this.config.maxScale);

    const translateX = (viewport.width - bounds.contentWidth * scale) / 2;
    const translateY = (viewport.height - bounds.contentHeight * scale) / 2;

    this.setState({
      scale,
      translateX,
      translateY
    });
  }

  // Pan Methods
  panBy(deltaX: number, deltaY: number): void {
    this.setState({
      translateX: this.state.translateX + deltaX,
      translateY: this.state.translateY + deltaY
    });
  }

  panTo(x: number, y: number): void {
    this.setState({
      translateX: x,
      translateY: y
    });
  }

  // Bounds Management
  setBounds(bounds: CanvasBounds): void {
    this.setState({ bounds });
  }

  constrainToBounds(): void {
    const { scale, translateX, translateY, viewport, bounds } = this.state;
    
    // Calculate visible content bounds
    const contentWidth = bounds.contentWidth * scale;
    const contentHeight = bounds.contentHeight * scale;
    
    // Minimum and maximum translations
    const minTranslateX = Math.min(0, viewport.width - contentWidth);
    const maxTranslateX = Math.max(0, viewport.width - contentWidth);
    const minTranslateY = Math.min(0, viewport.height - contentHeight);
    const maxTranslateY = Math.max(0, viewport.height - contentHeight);

    this.setState({
      translateX: Math.max(minTranslateX, Math.min(maxTranslateX, translateX)),
      translateY: Math.max(minTranslateY, Math.min(maxTranslateY, translateY))
    });
  }

  // Event Handling
  onWheel(event: WheelEvent): void {
    event.preventDefault();
    
    const rect = (event.target as Element).getBoundingClientRect();
    const centerX = event.clientX - rect.left;
    const centerY = event.clientY - rect.top;
    
    const scaleFactor = 1 - event.deltaY * this.config.wheelSensitivity;
    const newScale = this.state.scale * scaleFactor;
    
    this.zoomTo(newScale, centerX, centerY);
  }

  onPointerDown(event: PointerEvent): void {
    this.isPanning = true;
    this.lastPanPoint = { x: event.clientX, y: event.clientY };
    (event.target as Element).setPointerCapture(event.pointerId);
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.isPanning || !this.lastPanPoint) return;

    const deltaX = event.clientX - this.lastPanPoint.x;
    const deltaY = event.clientY - this.lastPanPoint.y;
    
    this.panBy(deltaX, deltaY);
    
    this.lastPanPoint = { x: event.clientX, y: event.clientY };
  }

  onPointerUp(event: PointerEvent): void {
    this.isPanning = false;
    this.lastPanPoint = null;
    (event.target as Element).releasePointerCapture(event.pointerId);
  }

  // Animation
  animateTo(targetState: Partial<PanZoomState>, duration: number = this.config.animationDuration): void {
    const startState = this.getState();
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easedProgress = this.easeOutCubic(progress);
      
      // Interpolate values
      const newState: Partial<PanZoomState> = {};
      
      if (targetState.scale !== undefined) {
        newState.scale = this.lerp(startState.scale, targetState.scale, easedProgress);
      }
      
      if (targetState.translateX !== undefined) {
        newState.translateX = this.lerp(startState.translateX, targetState.translateX, easedProgress);
      }
      
      if (targetState.translateY !== undefined) {
        newState.translateY = this.lerp(startState.translateY, targetState.translateY, easedProgress);
      }
      
      this.setState(newState);
      
      if (progress < 1) {
        this.animationFrame = requestAnimationFrame(animate);
      }
    };

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    
    this.animationFrame = requestAnimationFrame(animate);
  }

  // Utility Methods
  screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
    return {
      x: (screenX - this.state.translateX) / this.state.scale,
      y: (screenY - this.state.translateY) / this.state.scale
    };
  }

  worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
    return {
      x: worldX * this.state.scale + this.state.translateX,
      y: worldY * this.state.scale + this.state.translateY
    };
  }

  getZoomLevel(): ZoomLevel {
    const levels = Object.values(PAN_ZOOM_TOKENS.zoomLevels);
    
    // Find closest zoom level
    let closest = levels[0];
    let closestDistance = Math.abs(this.state.scale - closest.value);
    
    for (const level of levels) {
      const distance = Math.abs(this.state.scale - level.value);
      if (distance < closestDistance) {
        closest = level;
        closestDistance = distance;
      }
    }
    
    return closest;
  }

  // Event System
  addListener(listener: () => void): void {
    this.listeners.add(listener);
  }

  removeListener(listener: () => void): void {
    this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  private updateViewport(): void {
    const viewport: CanvasViewport = {
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    this.state.viewport = viewport;
  }

  private calculateZoomTranslation(
    newScale: number,
    centerX: number,
    centerY: number
  ): { translateX: number; translateY: number } {
    const scaleRatio = newScale / this.state.scale;
    const worldX = (centerX - this.state.translateX) / this.state.scale;
    const worldY = (centerY - this.state.translateY) / this.state.scale;
    
    return {
      translateX: centerX - worldX * newScale,
      translateY: centerY - worldY * newScale
    };
  }

  private clampScale(scale: number): number {
    return Math.max(this.config.minScale, Math.min(this.config.maxScale, scale));
  }

  private getViewportCenter(): { x: number; y: number } {
    return {
      x: this.state.viewport.width / 2,
      y: this.state.viewport.height / 2
    };
  }

  private lerp(start: number, end: number, progress: number): number {
    return start + (end - start) * progress;
  }

  private easeOutCubic(progress: number): number {
    return 1 - Math.pow(1 - progress, 3);
  }
}

// Performance monitoring
export class PanZoomPerformanceMonitor {
  private metrics: {
    frameCount: number;
    lastTime: number;
    averageFPS: number;
    renderTime: number[];
    nodeCount: number;
    scale: number;
  } = {
    frameCount: 0,
    lastTime: performance.now(),
    averageFPS: 60,
    renderTime: [],
    nodeCount: 0,
    scale: 1
  };

  startFrame(): void {
    this.metrics.frameCount++;
  }

  endFrame(renderTime: number): void {
    this.metrics.renderTime.push(renderTime);
    
    // Keep only last 60 frames for average
    if (this.metrics.renderTime.length > 60) {
      this.metrics.renderTime.shift();
    }
    
    const now = performance.now();
    if (now - this.metrics.lastTime >= 1000) {
      this.metrics.averageFPS = this.metrics.frameCount;
      this.metrics.frameCount = 0;
      this.metrics.lastTime = now;
    }
  }

  setNodeCount(count: number): void {
    this.metrics.nodeCount = count;
  }

  setScale(scale: number): void {
    this.metrics.scale = scale;
  }

  getMetrics() {
    const avgRenderTime = this.metrics.renderTime.length > 0 
      ? this.metrics.renderTime.reduce((a, b) => a + b, 0) / this.metrics.renderTime.length
      : 0;

    return {
      fps: this.metrics.averageFPS,
      avgRenderTime,
      nodeCount: this.metrics.nodeCount,
      scale: this.metrics.scale,
      performance: this.getPerformanceLevel()
    } as {
      fps: number;
      avgRenderTime: number;
      nodeCount: number;
      scale: number;
      performance: 'excellent' | 'good' | 'fair' | 'poor';
    };
  }

  private getPerformanceLevel(): 'excellent' | 'good' | 'fair' | 'poor' {
    const avgRenderTime = this.metrics.renderTime.length > 0 
      ? this.metrics.renderTime.reduce((a, b) => a + b, 0) / this.metrics.renderTime.length
      : 0;
    const fps = this.metrics.averageFPS;
    const nodeCount = this.metrics.nodeCount;
    const scale = this.metrics.scale;
    
    // Calculate complexity score
    const complexity = nodeCount * scale;
    
    if (fps >= 50 && avgRenderTime < 16 && complexity < 1000) {
      return 'excellent';
    } else if (fps >= 30 && avgRenderTime < 33 && complexity < 2000) {
      return 'good';
    } else if (fps >= 20 && avgRenderTime < 50 && complexity < 4000) {
      return 'fair';
    } else {
      return 'poor';
    }
  }
}

// Export utility functions
export const CanvasPanZoomUtils = {
  // Calculate optimal zoom for content
  calculateOptimalZoom(
    contentBounds: { width: number; height: number },
    viewportBounds: { width: number; height: number },
    padding: number = 50
  ): number {
    const scaleX = (viewportBounds.width - padding * 2) / contentBounds.width;
    const scaleY = (viewportBounds.height - padding * 2) / contentBounds.height;
    return Math.min(scaleX, scaleY);
  },

  // Validate pan zoom state
  validateState(state: PanZoomState): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];
    
    if (state.scale < PAN_ZOOM_TOKENS.config.minScale) {
      issues.push(`Scale ${state.scale} below minimum ${PAN_ZOOM_TOKENS.config.minScale}`);
    }
    
    if (state.scale > PAN_ZOOM_TOKENS.config.maxScale) {
      issues.push(`Scale ${state.scale} above maximum ${PAN_ZOOM_TOKENS.config.maxScale}`);
    }
    
    // Check bounds constraints
    const contentWidth = state.bounds.contentWidth * state.scale;
    const contentHeight = state.bounds.contentHeight * state.scale;
    
    if (state.translateX > 0 || state.translateX < state.viewport.width - contentWidth) {
      issues.push('X translation outside bounds');
    }
    
    if (state.translateY > 0 || state.translateY < state.viewport.height - contentHeight) {
      issues.push('Y translation outside bounds');
    }
    
    return {
      isValid: issues.length === 0,
      issues
    };
  },

  // Debounce utility for performance
  debounce<T extends (...args: any[]) => void>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // Throttle utility for performance
  throttle<T extends (...args: any[]) => void>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

export default PAN_ZOOM_TOKENS;