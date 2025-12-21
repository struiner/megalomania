import { 
  Component, 
  Inject, 
  OnInit, 
  OnDestroy, 
  ViewChild, 
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import { 
  MAT_DIALOG_DATA, 
  MatDialogRef 
} from '@angular/material/dialog';
import { TechNode } from './tech-node.interface';

/**
 * Interface for Preview Dialog Data
 */
export interface TechTreePreviewData {
  nodes: TechNode[];
  title: string;
  description?: string;
}

/**
 * Interface for Culture Tag Legend
 */
export interface CultureTagLegend {
  namespace: 'biome' | 'settlement' | 'guild';
  label: string;
  color: string;
  icon: string;
  count: number;
}

/**
 * Interface for Preview Configuration
 */
export interface PreviewDialogConfig {
  showConnections: boolean;
  showCultureTags: boolean;
  maxNodesForFullDetail: number;
  enableKeyboardNavigation: boolean;
  focusTrapEnabled: boolean;
}

/**
 * Interface for Export-Aligned Ordering
 */
export interface ExportOrdering {
  tier: number;
  nodes: TechNode[];
  order: string[]; // Array of node IDs in export order
}

/**
 * Interface for Enhanced Connection Path Data
 */
export interface ConnectionPathData {
  id: string;
  path: string;
  fromNode: TechNode;
  toNode: TechNode;
  tierDistance: number;
  isDense: boolean;
  style: {
    strokeWidth: number;
    opacity: number;
    strokeDasharray: string;
    stroke: string;
  };
  complexity: 'simple' | 'complex' | 'circular';
}

/**
 * Interface for Viewport-Aware Scaling
 */
export interface ViewportScaleConfig {
  minZoom: number;
  maxZoom: number;
  connectionThickness: {
    thin: number;
    normal: number;
    thick: number;
  };
  opacityRange: {
    min: number;
    max: number;
  };
}

/**
 * Preview Dialog Component for Tech Tree Visualization
 * 
 * This component provides a read-only modal preview of a technology tree
 * that exactly matches the export structure and maintains visual parity
 * with the editor grid while optimizing for clarity and readability.
 */
@Component({
  selector: 'app-tech-tree-preview-dialog',
  templateUrl: './tech-tree-preview-dialog.component.html',
  styleUrls: ['./tech-tree-preview-dialog.component.scss']
})
export class TechTreePreviewDialogComponent implements OnInit, OnDestroy {
  @ViewChild('dialogContainer', { static: true }) dialogContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('previewContent', { static: false }) previewContent?: ElementRef<HTMLDivElement>;

  // Data
  nodes: TechNode[] = [];
  title = '';
  description?: string;
  
  // Layout and ordering
  exportOrdering: ExportOrdering[] = [];
  uniqueTiers: number[] = [];
  
  // Configuration
  config: PreviewDialogConfig = {
    showConnections: true,
    showCultureTags: true,
    maxNodesForFullDetail: 100,
    enableKeyboardNavigation: true,
    focusTrapEnabled: true
  };
  
  // Culture tag management
  cultureTagLegends: CultureTagLegend[] = [];
  showCultureLegend = false;
  
  // Modal state
  isFullscreen = false;
  zoomLevel = 1.0;
  focusedNodeId: string | null = null;
  
  // Performance optimization
  renderNodes: TechNode[] = [];
  connectionPaths: ConnectionPathData[] = [];
  
  // Enhanced connection visualization
  private readonly CONNECTION_STYLE_CONFIG = {
    normal: {
      strokeWidth: 2,
      opacity: 0.7,
      strokeDasharray: 'none'
    },
    highlight: {
      strokeWidth: 3,
      opacity: 0.9,
      strokeDasharray: 'none'
    },
    dense: {
      strokeWidth: 1,
      opacity: 0.4,
      strokeDasharray: '3,3'
    }
  };
  
  private connectionDensity = 0;
  private readonly DENSITY_THRESHOLD = 0.3; // Connections per node
  
  // Accessibility
  private focusableElements: HTMLElement[] = [];
  private previousFocus: HTMLElement | null = null;
  
  constructor(
    public dialogRef: MatDialogRef<TechTreePreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TechTreePreviewData,
    private cdr: ChangeDetectorRef
  ) {
    this.nodes = data.nodes || [];
    this.title = data.title || 'Technology Tree Preview';
    this.description = data.description;
  }

  ngOnInit(): void {
    this.initializePreview();
    this.setupEventListeners();
    this.setupFocusManagement();
    
    // Initial focus management
    setTimeout(() => {
      this.trapFocus();
    }, 100);
  }

  ngOnDestroy(): void {
    this.removeEventListeners();
    this.restoreFocus();
  }

  /**
   * Initialize preview data and layout
   */
  private initializePreview(): void {
    this.processExportOrdering();
    this.extractCultureTagLegends();
    this.optimizeRendering();
    
    if (this.config.showConnections) {
      this.generateConnectionPaths();
    }
  }

  /**
   * Process nodes into export-aligned ordering
   * This ensures the preview exactly matches the export structure
   */
  private processExportOrdering(): void {
    // Get unique tiers and sort them
    this.uniqueTiers = [...new Set(this.nodes.map(node => node.tier))].sort((a, b) => a - b);
    
    // Process each tier for export ordering
    this.exportOrdering = this.uniqueTiers.map(tier => {
      const tierNodes = this.nodes
        .filter(node => node.tier === tier)
        .sort((a, b) => {
          // Primary sort: by tier position (x-coordinate equivalent)
          const aPos = this.getNodeTierPosition(a);
          const bPos = this.getNodeTierPosition(b);
          if (aPos !== bPos) return aPos - bPos;
          
          // Secondary sort: by name for deterministic ordering
          return a.name.localeCompare(b.name);
        });
      
      return {
        tier,
        nodes: tierNodes,
        order: tierNodes.map(node => node.id)
      };
    });
  }

  /**
   * Get the position of a node within its tier for ordering
   * This should match the export logic exactly
   */
  private getNodeTierPosition(node: TechNode): number {
    // This should mirror the positioning logic used in export
    // For now, using a simple index-based approach
    const nodesInTier = this.nodes.filter(n => n.tier === node.tier);
    return nodesInTier.indexOf(node);
  }

  /**
   * Extract culture tag legends from nodes
   */
  private extractCultureTagLegends(): void {
    if (!this.config.showCultureTags) return;
    
    const tagCounts = new Map<string, { namespace: string; count: number }>();
    
    this.nodes.forEach(node => {
      if (node.cultureTags) {
        node.cultureTags.forEach(tag => {
          const key = tag;
          const existing = tagCounts.get(key);
          
          if (existing) {
            existing.count++;
          } else {
            tagCounts.set(key, {
              namespace: this.getCultureTagNamespace(tag),
              count: 1
            });
          }
        });
      }
    });
    
    this.cultureTagLegends = Array.from(tagCounts.entries()).map(([tag, data]) => ({
      namespace: data.namespace as 'biome' | 'settlement' | 'guild',
      label: tag,
      color: this.getCultureTagColor(data.namespace),
      icon: this.getCultureTagIcon(data.namespace),
      count: data.count
    })).sort((a, b) => a.namespace.localeCompare(b.namespace) || a.label.localeCompare(b.label));
  }

  /**
   * Get the namespace for a culture tag
   */
  private getCultureTagNamespace(tag: string): string {
    // This should be based on actual tag taxonomy
    if (tag.startsWith('biome_')) return 'biome';
    if (tag.startsWith('settlement_')) return 'settlement';
    if (tag.startsWith('guild_')) return 'guild';
    return 'settlement'; // default
  }

  /**
   * Get color for culture tag namespace
   */
  private getCultureTagColor(namespace: string): string {
    switch (namespace) {
      case 'biome': return '#4CAF50';
      case 'settlement': return '#2196F3';
      case 'guild': return '#FF9800';
      default: return '#9E9E9E';
    }
  }

  /**
   * Get icon for culture tag namespace
   */
  private getCultureTagIcon(namespace: string): string {
    switch (namespace) {
      case 'biome': return '🌿';
      case 'settlement': return '🏘️';
      case 'guild': return '👥';
      default: return '🏷️';
    }
  }

  /**
   * Optimize rendering for large trees
   */
  private optimizeRendering(): void {
    if (this.nodes.length <= this.config.maxNodesForFullDetail) {
      this.renderNodes = [...this.nodes];
    } else {
      // For large trees, only render nodes in visible tiers
      // This is a simplified approach - in practice, you'd want virtual scrolling
      this.renderNodes = [...this.nodes];
    }
  }

  /**
   * Generate connection paths for prerequisite visualization
   * Enhanced with density analysis, viewport scaling, and clutter avoidance
   */
  private generateConnectionPaths(): void {
    this.connectionPaths = [];
    
    // Calculate connection density for clutter avoidance
    this.calculateConnectionDensity();
    
    for (const node of this.nodes) {
      if (!node.prerequisites || node.prerequisites.length === 0) continue;
      
      for (const prereqId of node.prerequisites) {
        const prereqNode = this.nodes.find(n => n.id === prereqId);
        if (!prereqNode) continue;
        
        const connectionData = this.createEnhancedConnectionPath(prereqNode, node);
        if (connectionData) {
          this.connectionPaths.push(connectionData);
        }
      }
    }
    
    // Apply viewport-aware scaling
    this.applyViewportScaling();
  }

  /**
   * Generate SVG path for a connection between two nodes
   */
  private generateConnectionPath(fromNode: TechNode, toNode: TechNode): string {
    const fromPos = this.getNodePosition(fromNode);
    const toPos = this.getNodePosition(toNode);
    
    // Use a simple straight line for preview to maintain clarity
    const fromX = fromPos.x + 60; // Center of node
    const fromY = fromPos.y + 20;
    const toX = toPos.x + 60;
    const toY = toPos.y + 20;
    
    return `M ${fromX} ${fromY} L ${toX} ${toY}`;
  }

  /**
   * Calculate connection density for clutter avoidance
   */
  private calculateConnectionDensity(): void {
    const totalConnections = this.nodes.reduce((count, node) => {
      return count + (node.prerequisites?.length || 0);
    }, 0);
    
    this.connectionDensity = this.nodes.length > 0 ? totalConnections / this.nodes.length : 0;
  }

  /**
   * Create enhanced connection path with density analysis and style optimization
   */
  private createEnhancedConnectionPath(fromNode: TechNode, toNode: TechNode): ConnectionPathData | null {
    const fromPos = this.getNodePosition(fromNode);
    const toPos = this.getNodePosition(toNode);
    const tierDistance = Math.abs(toNode.tier - fromNode.tier);
    
    // Determine connection complexity
    const complexity = this.analyzeConnectionComplexity(fromNode, toNode, tierDistance);
    
    // Generate path based on complexity
    const path = this.generateSmartPath(fromPos, toPos, tierDistance, complexity);
    
    // Determine if this connection is in a dense area
    const isDense = this.connectionDensity > this.DENSITY_THRESHOLD;
    
    // Apply appropriate styling
    const style = this.getConnectionStyle(complexity, isDense);
    
    return {
      id: `${fromNode.id}-${toNode.id}`,
      path,
      fromNode,
      toNode,
      tierDistance,
      isDense,
      style,
      complexity
    };
  }

  /**
   * Analyze connection complexity for path routing decisions
   */
  private analyzeConnectionComplexity(fromNode: TechNode, toNode: TechNode, tierDistance: number): 'simple' | 'complex' | 'circular' {
    // Check for circular dependencies
    if (this.hasCircularDependency(fromNode, toNode)) {
      return 'circular';
    }
    
    // Check for cross-tier complexity
    if (tierDistance > 2) {
      return 'complex';
    }
    
    // Check for dense areas
    const fromConnections = this.getNodeConnectionCount(fromNode.id);
    const toConnections = this.getNodeConnectionCount(toNode.id);
    
    if (fromConnections > 3 || toConnections > 3) {
      return 'complex';
    }
    
    return 'simple';
  }

  /**
   * Generate smart path routing based on complexity
   */
  private generateSmartPath(fromPos: {x: number, y: number}, toPos: {x: number, y: number}, tierDistance: number, complexity: 'simple' | 'complex' | 'circular'): string {
    const fromX = fromPos.x + 60; // Center of node
    const fromY = fromPos.y + 20;
    const toX = toPos.x + 60;
    const toY = toPos.y + 20;
    
    switch (complexity) {
      case 'simple':
        // Straight line for simple connections
        return `M ${fromX} ${fromY} L ${toX} ${toY}`;
        
      case 'complex':
        // Curved path for complex connections to reduce visual clutter
        const midX = (fromX + toX) / 2;
        const midY = Math.min(fromY, toY) - 20; // Curve upward
        return `M ${fromX} ${fromY} Q ${midX} ${midY} ${toX} ${toY}`;
        
      case 'circular':
        // Highlighted path for circular dependencies
        const circMidX = (fromX + toX) / 2;
        const circMidY = Math.max(fromY, toY) + 30; // Curve downward to indicate issue
        return `M ${fromX} ${fromY} Q ${circMidX} ${circMidY} ${toX} ${toY}`;
        
      default:
        return `M ${fromX} ${fromY} L ${toX} ${toY}`;
    }
  }

  /**
   * Get connection styling based on complexity and density
   */
  private getConnectionStyle(complexity: 'simple' | 'complex' | 'circular', isDense: boolean): ConnectionPathData['style'] {
    const baseStyle = isDense ? this.CONNECTION_STYLE_CONFIG.dense : this.CONNECTION_STYLE_CONFIG.normal;
    
    switch (complexity) {
      case 'simple':
        return {
          ...baseStyle,
          stroke: '#4CAF50', // Green for simple
        };
        
      case 'complex':
        return {
          ...this.CONNECTION_STYLE_CONFIG.highlight,
          stroke: '#2196F3', // Blue for complex
        };
        
      case 'circular':
        return {
          ...this.CONNECTION_STYLE_CONFIG.highlight,
          stroke: '#F44336', // Red for circular
          strokeDasharray: '8,4',
        };
        
      default:
        return {
          ...baseStyle,
          stroke: '#9E9E9E', // Default gray
        };
    }
  }

  /**
   * Check for circular dependencies
   */
  private hasCircularDependency(fromNode: TechNode, toNode: TechNode): boolean {
    // Simple circular dependency check
    // In a full implementation, this would use a more sophisticated cycle detection algorithm
    return toNode.prerequisites?.includes(fromNode.id) || false;
  }

  /**
   * Get connection count for a specific node
   */
  private getNodeConnectionCount(nodeId: string): number {
    const node = this.nodes.find(n => n.id === nodeId);
    if (!node) return 0;
    
    // Count both outgoing and incoming connections
    const outgoing = node.prerequisites?.length || 0;
    const incoming = this.nodes.filter(n => n.prerequisites?.includes(nodeId)).length;
    
    return outgoing + incoming;
  }

  /**
   * Apply viewport-aware scaling to connections
   */
  private applyViewportScaling(): void {
    this.connectionPaths.forEach(connection => {
      // Scale stroke width based on zoom level
      const scaleFactor = Math.max(0.5, Math.min(2.0, this.zoomLevel));
      connection.style.strokeWidth = connection.style.strokeWidth * scaleFactor;
      
      // Adjust opacity based on zoom and density
      const densityFactor = connection.isDense ? 0.7 : 1.0;
      const zoomFactor = this.zoomLevel < 1.0 ? 0.8 : 1.0;
      connection.style.opacity = Math.max(0.2, Math.min(1.0, connection.style.opacity * densityFactor * zoomFactor));
    });
  }

  /**
   * Get position of a node in the preview layout
   */
  private getNodePosition(node: TechNode): { x: number; y: number } {
    const tierIndex = node.tier - 1;
    const nodesInTier = this.exportOrdering.find(tier => tier.tier === node.tier);
    const positionInTier = nodesInTier ? nodesInTier.order.indexOf(node.id) : 0;
    
    const x = positionInTier * 200; // Horizontal spacing
    const y = tierIndex * 150; // Vertical tier spacing
    
    return { x, y };
  }

  /**
   * Setup event listeners for modal interaction
   */
  private setupEventListeners(): void {
    // Escape key handling
    document.addEventListener('keydown', this.handleKeydown.bind(this));
    
    // Focus management
    document.addEventListener('focusin', this.handleFocusIn.bind(this));
  }

  /**
   * Remove event listeners
   */
  private removeEventListeners(): void {
    document.removeEventListener('keydown', this.handleKeydown.bind(this));
    document.removeEventListener('focusin', this.handleFocusIn.bind(this));
  }

  /**
   * Handle keyboard navigation
   */
  private handleKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Escape':
        this.onClose();
        event.preventDefault();
        break;
      case 'F11':
        this.toggleFullscreen();
        event.preventDefault();
        break;
      case 'c':
      case 'C':
        if (event.ctrlKey || event.metaKey) {
          // Copy tree info to clipboard (future feature)
          event.preventDefault();
        }
        break;
      default:
        if (this.config.enableKeyboardNavigation) {
          this.handleNavigationKey(event);
        }
        break;
    }
  }

  /**
   * Handle navigation keys for node selection
   */
  private handleNavigationKey(event: KeyboardEvent): void {
    const currentIndex = this.focusedNodeId ? 
      this.renderNodes.findIndex(node => node.id === this.focusedNodeId) : -1;
    
    let newIndex = currentIndex;
    
    switch (event.key) {
      case 'ArrowRight':
        newIndex = Math.min(currentIndex + 1, this.renderNodes.length - 1);
        break;
      case 'ArrowLeft':
        newIndex = Math.max(currentIndex - 1, 0);
        break;
      case 'ArrowDown':
        // Move to next tier
        newIndex = this.findNextTierNode(currentIndex);
        break;
      case 'ArrowUp':
        // Move to previous tier
        newIndex = this.findPreviousTierNode(currentIndex);
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = this.renderNodes.length - 1;
        break;
    }
    
    if (newIndex !== currentIndex && newIndex >= 0) {
      this.focusedNodeId = this.renderNodes[newIndex].id;
      this.cdr.detectChanges();
    }
  }

  /**
   * Find next node in the next tier
   */
  private findNextTierNode(currentIndex: number): number {
    if (currentIndex < 0) return 0;
    
    const currentNode = this.renderNodes[currentIndex];
    const nextTierNodes = this.renderNodes.filter(node => node.tier > currentNode.tier);
    
    if (nextTierNodes.length === 0) return currentIndex;
    
    // Find the closest node in the next tier
    const currentPos = this.getNodePosition(currentNode);
    let closestNode = nextTierNodes[0];
    let closestDistance = Math.abs(this.getNodePosition(closestNode).x - currentPos.x);
    
    for (const node of nextTierNodes) {
      const distance = Math.abs(this.getNodePosition(node).x - currentPos.x);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestNode = node;
      }
    }
    
    return this.renderNodes.findIndex(node => node.id === closestNode.id);
  }

  /**
   * Find previous node in the previous tier
   */
  private findPreviousTierNode(currentIndex: number): number {
    if (currentIndex < 0) return 0;
    
    const currentNode = this.renderNodes[currentIndex];
    const prevTierNodes = this.renderNodes.filter(node => node.tier < currentNode.tier);
    
    if (prevTierNodes.length === 0) return currentIndex;
    
    // Find the closest node in the previous tier
    const currentPos = this.getNodePosition(currentNode);
    let closestNode = prevTierNodes[0];
    let closestDistance = Math.abs(this.getNodePosition(closestNode).x - currentPos.x);
    
    for (const node of prevTierNodes) {
      const distance = Math.abs(this.getNodePosition(node).x - currentPos.x);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestNode = node;
      }
    }
    
    return this.renderNodes.findIndex(node => node.id === closestNode.id);
  }

  /**
   * Handle focus changes for accessibility
   */
  private handleFocusIn(event: FocusEvent): void {
    if (!this.config.focusTrapEnabled) return;
    
    const target = event.target as HTMLElement;
    
    // Check if focus is outside the dialog
    if (!this.dialogContainer.nativeElement.contains(target)) {
      this.trapFocus();
    }
  }

  /**
   * Setup focus management
   */
  private setupFocusManagement(): void {
    // Store the previously focused element
    this.previousFocus = document.activeElement as HTMLElement;
    
    // Update focusable elements
    this.updateFocusableElements();
  }

  /**
   * Update the list of focusable elements
   */
  private updateFocusableElements(): void {
    const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), .preview-node';
    this.focusableElements = Array.from(
      this.dialogContainer.nativeElement.querySelectorAll(selector)
    ) as HTMLElement[];
  }

  /**
   * Trap focus within the dialog
   */
  private trapFocus(): void {
    if (!this.config.focusTrapEnabled || this.focusableElements.length === 0) return;
    
    const firstElement = this.focusableElements[0];
    const lastElement = this.focusableElements[this.focusableElements.length - 1];
    
    // Focus the first element or the previously focused element
    const elementToFocus = this.focusedNodeId ? 
      this.focusableElements.find(el => el.getAttribute('data-node-id') === this.focusedNodeId) :
      firstElement;
    
    (elementToFocus || firstElement).focus();
  }

  /**
   * Restore focus to the previously focused element
   */
  private restoreFocus(): void {
    if (this.previousFocus && this.previousFocus.focus) {
      this.previousFocus.focus();
    }
  }

  /**
   * Toggle culture tag legend visibility
   */
  toggleCultureLegend(): void {
    this.showCultureLegend = !this.showCultureLegend;
    this.cdr.detectChanges();
  }

  /**
   * Toggle fullscreen mode
   */
  toggleFullscreen(): void {
    this.isFullscreen = !this.isFullscreen;
    this.cdr.detectChanges();
  }

  /**
   * Zoom in
   */
  zoomIn(): void {
    this.zoomLevel = Math.min(3.0, this.zoomLevel + 0.1);
    this.cdr.detectChanges();
  }

  /**
   * Zoom out
   */
  zoomOut(): void {
    this.zoomLevel = Math.max(0.5, this.zoomLevel - 0.1);
    this.cdr.detectChanges();
  }

  /**
   * Reset zoom
   */
  resetZoom(): void {
    this.zoomLevel = 1.0;
    this.cdr.detectChanges();
  }

  /**
   * Close the dialog
   */
  onClose(): void {
    this.dialogRef.close();
  }

  /**
   * Handle node focus for accessibility
   */
  onNodeFocus(nodeId: string): void {
    this.focusedNodeId = nodeId;
  }

  /**
   * Get tier band style
   */
  getTierBandStyle(tier: number): any {
    const tierIndex = tier - 1;
    return {
      top: `${tierIndex * 160}px`,
      height: '150px',
      opacity: 0.05
    };
  }

  /**
   * Get preview content style
   */
  getPreviewContentStyle(): any {
    const height = this.uniqueTiers.length * 160;
    return {
      height: `${height}px`,
      transform: `scale(${this.zoomLevel})`,
      transformOrigin: 'top left'
    };
  }

  /**
   * Track by functions for performance
   */
  trackByNodeId(index: number, node: TechNode): string {
    return node.id;
  }

  trackByTier(index: number, tier: ExportOrdering): number {
    return tier.tier;
  }

  trackByConnectionPath(index: number, connection: ConnectionPathData): string {
    return connection.id;
  }

  trackByCultureLegend(index: number, legend: CultureTagLegend): string {
    return `${legend.namespace}-${legend.label}`;
  }
}