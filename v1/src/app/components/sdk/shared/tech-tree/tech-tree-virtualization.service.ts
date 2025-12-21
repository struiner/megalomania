import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { TechNode } from './tech-node.interface';

/**
 * Viewport information for virtualization calculations
 */
export interface ViewportInfo {
  width: number;
  height: number;
  scrollX: number;
  scrollY: number;
  zoomLevel: number;
}

/**
 * Virtual node with position and visibility information
 */
export interface VirtualNode extends TechNode {
  x: number;
  y: number;
  width: number;
  height: number;
  isVisible: boolean;
  isInRenderBounds: boolean;
  tier: number;
  positionInTier: number;
}

/**
 * Performance metrics for monitoring
 */
export interface PerformanceMetrics {
  renderTime: number;
  nodeCount: number;
  visibleNodeCount: number;
  connectionCount: number;
  frameRate: number;
  memoryUsage?: number;
  lastUpdate: number;
}

/**
 * Virtualization configuration
 */
export interface VirtualizationConfig {
  /** Buffer zone around viewport for smooth scrolling (in pixels) */
  bufferSize: number;
  /** Minimum zoom level for virtualization */
  minZoomLevel: number;
  /** Maximum nodes to render before enabling virtualization */
  virtualizationThreshold: number;
  /** Connection caching enabled */
  enableConnectionCaching: boolean;
  /** Performance monitoring enabled */
  enablePerformanceMonitoring: boolean;
  /** Debounce time for scroll events (ms) */
  scrollDebounceTime: number;
  /** Grid size for snapping */
  gridSize: number;
}

/**
 * Tech Tree Virtualization Service
 * Handles viewport-based rendering optimization and performance monitoring
 */
@Injectable({
  providedIn: 'root'
})
export class TechTreeVirtualizationService {
  private readonly DEFAULT_CONFIG: VirtualizationConfig = {
    bufferSize: 200,
    minZoomLevel: 0.5,
    virtualizationThreshold: 50,
    enableConnectionCaching: true,
    enablePerformanceMonitoring: true,
    scrollDebounceTime: 16, // ~60fps
    gridSize: 20
  };

  private config: VirtualizationConfig = { ...this.DEFAULT_CONFIG };
  
  // Viewport tracking
  private viewportSubject = new BehaviorSubject<ViewportInfo>({
    width: 0,
    height: 0,
    scrollX: 0,
    scrollY: 0,
    zoomLevel: 1.0
  });
  
  // Performance monitoring
  private performanceSubject = new BehaviorSubject<PerformanceMetrics>({
    renderTime: 0,
    nodeCount: 0,
    visibleNodeCount: 0,
    connectionCount: 0,
    frameRate: 60,
    lastUpdate: performance.now()
  });

  // Virtual nodes cache
  private virtualNodes: VirtualNode[] = [];
  private visibleNodes: VirtualNode[] = [];
  
  // Connection cache
  private connectionCache = new Map<string, any>();
  private lastCacheUpdate = 0;
  
  // Performance tracking
  private frameCount = 0;
  private lastFrameTime = performance.now();
  private renderStartTime = 0;

  // Observable streams
  public viewport$: Observable<ViewportInfo> = this.viewportSubject.asObservable();
  public performance$: Observable<PerformanceMetrics> = this.performanceSubject.asObservable();

  constructor() {
    this.initializePerformanceMonitoring();
  }

  /**
   * Configure virtualization settings
   */
  configure(config: Partial<VirtualizationConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Update viewport information
   */
  updateViewport(viewport: Partial<ViewportInfo>): void {
    const current = this.viewportSubject.value;
    const updated = { ...current, ...viewport };
    
    this.viewportSubject.next(updated);
    
    if (this.config.enablePerformanceMonitoring) {
      this.measureViewportChange();
    }
  }

  /**
   * Calculate virtual nodes from tech nodes
   */
  calculateVirtualNodes(nodes: TechNode[], nodeSpacing: { x: number; y: number }): VirtualNode[] {
    this.renderStartTime = performance.now();
    
    const virtualNodes: VirtualNode[] = [];
    const tierGroups = new Map<number, TechNode[]>();
    
    // Group nodes by tier
    nodes.forEach(node => {
      if (!tierGroups.has(node.tier)) {
        tierGroups.set(node.tier, []);
      }
      tierGroups.get(node.tier)!.push(node);
    });
    
    // Calculate positions for each tier
    tierGroups.forEach((tierNodes, tier) => {
      tierNodes.sort((a, b) => a.name.localeCompare(b.name));
      
      tierNodes.forEach((node, index) => {
        const x = index * nodeSpacing.x;
        const y = (tier - 1) * nodeSpacing.y;
        
        virtualNodes.push({
          ...node,
          x,
          y,
          width: 120, // Standard node width
          height: 80, // Standard node height
          isVisible: false,
          isInRenderBounds: false,
          tier,
          positionInTier: index
        });
      });
    });
    
    this.virtualNodes = virtualNodes;
    this.updateVisibleNodes();
    
    return this.virtualNodes;
  }

  /**
   * Get nodes that are currently visible in the viewport
   */
  getVisibleNodes(): VirtualNode[] {
    return this.visibleNodes;
  }

  /**
   * Get nodes that should be rendered (visible + buffer zone)
   */
  getNodesInRenderBounds(): VirtualNode[] {
    return this.virtualNodes.filter(node => node.isInRenderBounds);
  }

  /**
   * Check if virtualization should be enabled
   */
  shouldVirtualize(nodeCount: number): boolean {
    return nodeCount >= this.config.virtualizationThreshold;
  }

  /**
   * Get cached connection data
   */
  getCachedConnection(connectionId: string): any | null {
    if (!this.config.enableConnectionCaching) {
      return null;
    }
    
    const cached = this.connectionCache.get(connectionId);
    if (cached && (performance.now() - cached.timestamp) < 5000) { // 5 second cache
      return cached.data;
    }
    
    return null;
  }

  /**
   * Cache connection data
   */
  cacheConnection(connectionId: string, data: any): void {
    if (!this.config.enableConnectionCaching) {
      return;
    }
    
    this.connectionCache.set(connectionId, {
      data,
      timestamp: performance.now()
    });
    
    // Clean old cache entries
    if (this.connectionCache.size > 1000) {
      this.cleanOldCacheEntries();
    }
  }

  /**
   * Clear connection cache
   */
  clearConnectionCache(): void {
    this.connectionCache.clear();
    this.lastCacheUpdate = performance.now();
  }

  /**
   * Measure and report performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics {
    return this.performanceSubject.value;
  }

  /**
   * Get performance recommendations
   */
  getPerformanceRecommendations(): string[] {
    const metrics = this.performanceSubject.value;
    const recommendations: string[] = [];
    
    if (metrics.frameRate < 30) {
      recommendations.push('Consider reducing visible nodes or enabling aggressive virtualization');
    }
    
    if (metrics.renderTime > 16) {
      recommendations.push('Render time exceeds frame budget - optimize component updates');
    }
    
    if (metrics.visibleNodeCount > 100) {
      recommendations.push('High visible node count - consider zooming out or virtualizing');
    }
    
    if (metrics.connectionCount > 200) {
      recommendations.push('Many connections detected - connection caching is recommended');
    }
    
    return recommendations;
  }

  /**
   * Create scroll event observable for viewport updates
   */
  createScrollObservable(element: HTMLElement): Observable<ViewportInfo> {
    const scroll$ = fromEvent(element, 'scroll');
    const resize$ = fromEvent(window, 'resize');
    
    return merge(scroll$, resize$).pipe(
      debounceTime(this.config.scrollDebounceTime),
      map(() => this.calculateViewportFromElement(element))
    );
  }

  /**
   * Optimize component update cycle to prevent layout thrashing
   */
  scheduleUpdate(callback: () => void): void {
    // Use requestAnimationFrame for smooth updates
    requestAnimationFrame(() => {
      callback();
      this.updatePerformanceMetrics();
    });
  }

  /**
   * Check if a node is in the visible viewport
   */
  isNodeVisible(node: VirtualNode, viewport?: ViewportInfo): boolean {
    const vp = viewport || this.viewportSubject.value;
    const buffer = this.config.bufferSize;
    
    return (
      node.x + node.width >= vp.scrollX - buffer &&
      node.x <= vp.scrollX + vp.width + buffer &&
      node.y + node.height >= vp.scrollY - buffer &&
      node.y <= vp.scrollY + vp.height + buffer
    );
  }

  /**
   * Calculate grid snap position
   */
  snapToGrid(position: number): number {
    return Math.round(position / this.config.gridSize) * this.config.gridSize;
  }

  /**
   * Get connection complexity for caching strategy
   */
  calculateConnectionComplexity(fromNode: VirtualNode, toNode: VirtualNode): number {
    const distance = Math.sqrt(
      Math.pow(toNode.x - fromNode.x, 2) + Math.pow(toNode.y - fromNode.y, 2)
    );
    
    const tierDistance = Math.abs(toNode.tier - fromNode.tier);
    
    // Complexity score based on distance and tier separation
    return distance * 0.001 + tierDistance * 10;
  }

  /**
   * Private methods
   */
  
  private initializePerformanceMonitoring(): void {
    if (!this.config.enablePerformanceMonitoring) {
      return;
    }
    
    // Monitor frame rate
    const updateFrameRate = () => {
      this.frameCount++;
      const now = performance.now();
      
      if (now - this.lastFrameTime >= 1000) { // Update every second
        const frameRate = this.frameCount;
        this.frameCount = 0;
        this.lastFrameTime = now;
        
        const current = this.performanceSubject.value;
        this.performanceSubject.next({
          ...current,
          frameRate,
          lastUpdate: now
        });
      }
      
      requestAnimationFrame(updateFrameRate);
    };
    
    requestAnimationFrame(updateFrameRate);
  }

  private updateVisibleNodes(): void {
    const viewport = this.viewportSubject.value;
    const buffer = this.config.bufferSize;
    
    this.virtualNodes.forEach(node => {
      const wasVisible = node.isVisible;
      node.isVisible = this.isNodeVisible(node, viewport);
      
      // Check if node is in extended render bounds
      node.isInRenderBounds = this.isNodeVisible(node, {
        ...viewport,
        scrollX: viewport.scrollX - buffer,
        scrollY: viewport.scrollY - buffer,
        width: viewport.width + buffer * 2,
        height: viewport.height + buffer * 2
      });
      
      // Update visibility tracking
      if (wasVisible !== node.isVisible) {
        // Node visibility changed - could trigger visibility callbacks
      }
    });
    
    this.visibleNodes = this.virtualNodes.filter(node => node.isVisible);
  }

  private calculateViewportFromElement(element: HTMLElement): ViewportInfo {
    const rect = element.getBoundingClientRect();
    const scrollX = element.scrollLeft || 0;
    const scrollY = element.scrollTop || 0;
    
    return {
      width: rect.width,
      height: rect.height,
      scrollX,
      scrollY,
      zoomLevel: this.viewportSubject.value.zoomLevel
    };
  }

  private measureViewportChange(): void {
    const renderTime = performance.now() - this.renderStartTime;
    const current = this.performanceSubject.value;
    
    this.performanceSubject.next({
      ...current,
      renderTime,
      nodeCount: this.virtualNodes.length,
      visibleNodeCount: this.visibleNodes.length
    });
  }

  private updatePerformanceMetrics(): void {
    const renderTime = performance.now() - this.renderStartTime;
    const connectionCount = this.connectionCache.size;
    
    const current = this.performanceSubject.value;
    this.performanceSubject.next({
      ...current,
      renderTime,
      connectionCount
    });
  }

  private cleanOldCacheEntries(): void {
    const now = performance.now();
    const maxAge = 10000; // 10 seconds
    
    for (const [key, value] of this.connectionCache.entries()) {
      if (now - value.timestamp > maxAge) {
        this.connectionCache.delete(key);
      }
    }
  }
}