import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  ViewChild, 
  ElementRef,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef
} from '@angular/core';
import { TechNode, TechNodeState } from './tech-node.interface';
import { TechTreeVirtualizationService, VirtualNode, ViewportInfo, PerformanceMetrics } from './tech-tree-virtualization.service';

/**
 * Interface for Connection Path Data
 */
export interface TechConnection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  path: string;
  isActive: boolean;
  isSatisfied: boolean;
  complexity: 'simple' | 'routed' | 'full';
}

/**
 * Interface for Connection Cache
 */
export interface ConnectionCache {
  connections: Map<string, TechConnection>;
  lastUpdate: number;
  nodePositions: Map<string, { x: number; y: number }>;
  zoomLevel: number;
}

export interface DragDropConfig {
  enableDragDrop: boolean;
  enableStructuralEditing: boolean;
  snapToGrid: boolean;
  snapToTier: boolean;
  snapThreshold: number;
  dragOpacity: number;
  invalidDropOpacity: number;
  showDropZones: boolean;
  requireConfirmationForStructuralChanges: boolean;
  visualFeedbackDelay: number;
}

export interface DragState {
  isDragging: boolean;
  draggedNode: TechNode | null;
  startPosition: { x: number; y: number };
  currentPosition: { x: number; y: number };
  snapPosition: { x: number; y: number };
  targetTier: number | null;
  isValidDrop: boolean;
  dragMode: 'position' | 'structural' | null;
  requiresConfirmation: boolean;
}

export interface DropZone {
  x: number;
  y: number;
  width: number;
  height: number;
  tier: number;
  isValid: boolean;
  occupiedBy: string | null;
  distance: number;
}

export interface AccessibilityConfig {
  enableKeyboardNavigation: boolean;
  enableScreenReaderSupport: boolean;
  enableFocusManagement: boolean;
  enableKeyboardShortcuts: boolean;
  announcementsDelay: number;
  focusVisibleTimeout: number;
}

export interface FocusManagement {
  currentFocusNode: string | null;
  previousFocusNode: string | null;
  focusHistory: string[];
  isFocusTrapped: boolean;
  skipLinksEnabled: boolean;
  focusTabIndex: number;
  spatialNavigation: boolean;
}

export interface LiveRegionAnnouncement {
  message: string;
  priority: 'polite' | 'assertive';
  timestamp: number;
  id: string;
}

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: string;
  description: string;
}

export interface SpatialNavigationNode {
  id: string;
  tier: number;
  position: { x: number; y: number };
  neighbors: {
    up: string | null;
    down: string | null;
    left: string | null;
    right: string | null;
    tierUp: string | null;
    tierDown: string | null;
  };
}

export interface TechTreeCanvasConfig {
  zoomMin: number;
  zoomMax: number;
  zoomStep: number;
  initialZoom: number;
  nodeSpacing: { x: number; y: number };
  gridSize: number;
  tierBandHeight: number;
  tierBandOpacity: number;
  enableTierBands: boolean;
  enableSnapToTier: boolean;
  // Drag & Drop settings
  dragDrop: DragDropConfig;
  // Connection rendering settings
  enableConnections: boolean;
  connectionCacheTimeout: number;
  maxConnectionsVisible: number;
  connectionDetailThresholds: {
    simple: number;    // Below this zoom, show simple lines
    routed: number;    // Between simple and routed, show curved paths
    full: number;      // Above this zoom, show full detail paths
  };
  connectionColors: {
    active: string;
    satisfied: string;
    unsatisfied: string;
    highlighted: string;
  };
  // Drag & Drop colors
  dragDropColors: {
    dragPreview: string;
    validDropZone: string;
    invalidDropZone: string;
    snapIndicator: string;
    structuralChangeWarning: string;
  };
}

@Component({
  selector: 'app-tech-tree-canvas',
  templateUrl: './tech-tree-canvas.component.html',
  styleUrls: ['./tech-tree-canvas.component.scss']
})
export class TechTreeCanvasComponent implements OnInit, OnDestroy, OnChanges {
  @Input() nodes: TechNode[] = [];
  @Input() config: TechTreeCanvasConfig = {
    zoomMin: 0.25,
    zoomMax: 3.0,
    zoomStep: 0.1,
    initialZoom: 1.0,
    nodeSpacing: { x: 200, y: 150 },
    gridSize: 20,
    tierBandHeight: 160,
    tierBandOpacity: 0.05,
    enableTierBands: true,
    enableSnapToTier: true,
    // Drag & Drop configuration
    dragDrop: {
      enableDragDrop: true,
      enableStructuralEditing: false,
      snapToGrid: true,
      snapToTier: true,
      snapThreshold: 10,
      dragOpacity: 0.7,
      invalidDropOpacity: 0.3,
      showDropZones: true,
      requireConfirmationForStructuralChanges: true,
      visualFeedbackDelay: 100
    },
    // Connection rendering defaults
    enableConnections: true,
    connectionCacheTimeout: 5000, // 5 seconds
    maxConnectionsVisible: 500,
    connectionDetailThresholds: {
      simple: 0.5,   // Below 0.5x zoom: simple lines
      routed: 1.0,   // Between 0.5x and 1.0x: curved paths
      full: 1.5      // Above 1.5x: full detail paths
    },
    connectionColors: {
      active: '#4CAF50',      // Green for active paths
      satisfied: '#2196F3',   // Blue for satisfied prerequisites
      unsatisfied: '#FF9800', // Orange for unsatisfied prerequisites
      highlighted: '#E91E63'  // Pink for highlighted connections
    },
    // Drag & Drop colors
    dragDropColors: {
      dragPreview: 'rgba(33, 150, 243, 0.7)',     // Blue with transparency
      validDropZone: 'rgba(76, 175, 80, 0.3)',   // Green with transparency
      invalidDropZone: 'rgba(244, 67, 54, 0.3)', // Red with transparency
      snapIndicator: '#FF9800',                   // Orange
      structuralChangeWarning: '#FF5722'          // Deep orange
    }
  };
  
  @Input() accessibilityConfig: AccessibilityConfig = {
    enableKeyboardNavigation: true,
    enableScreenReaderSupport: true,
    enableFocusManagement: true,
    enableKeyboardShortcuts: true,
    announcementsDelay: 100,
    focusVisibleTimeout: 3000
  };
  
  @Output() nodeSelected = new EventEmitter<TechNode>();
  @Output() nodeFocused = new EventEmitter<TechNode>();
  @Output() zoomChanged = new EventEmitter<number>();
  @Output() panChanged = new EventEmitter<{ x: number; y: number }>();
  @Output() connectionHighlighted = new EventEmitter<{ fromNodeId: string; toNodeId: string }>();
  @Output() nodeDragStart = new EventEmitter<TechNode>();
  @Output() nodeDragEnd = new EventEmitter<{ node: TechNode; finalPosition: { x: number; y: number }; tierChange?: number }>();
  @Output() structuralChangeRequested = new EventEmitter<{ nodeId: string; type: 'tier' | 'prerequisites'; newValue: any }>();
  @Output() dragDropModeChanged = new EventEmitter<boolean>();

  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('canvasViewport', { static: true }) canvasViewport!: ElementRef<HTMLDivElement>;
  @ViewChild('connectionsSvg', { static: false }) connectionsSvg!: ElementRef<SVGElement>;

  zoomLevel = 1.0;
  panPosition = { x: 0, y: 0 };
  selectedNodeId: string | null = null;
  focusedNodeId: string | null = null;
  highlightedConnectionId: string | null = null;
  
  // Drag & Drop state
  dragState: DragState = {
    isDragging: false,
    draggedNode: null,
    startPosition: { x: 0, y: 0 },
    currentPosition: { x: 0, y: 0 },
    snapPosition: { x: 0, y: 0 },
    targetTier: null,
    isValidDrop: false,
    dragMode: null,
    requiresConfirmation: false
  };
  
  dropZones: DropZone[] = [];
  structuralEditMode = false;
  pendingStructuralChanges: Array<{ nodeId: string; type: 'tier' | 'prerequisites'; newValue: any; description: string }> = [];
  showStructuralChangeDialog = false;
  
  // Connection rendering properties
  connections: TechConnection[] = [];
  connectionCache: ConnectionCache = {
    connections: new Map(),
    lastUpdate: 0,
    nodePositions: new Map(),
    zoomLevel: 1.0
  };
  
  // Accessibility state
  focusManagement: FocusManagement = {
    currentFocusNode: null,
    previousFocusNode: null,
    focusHistory: [],
    isFocusTrapped: false,
    skipLinksEnabled: true,
    focusTabIndex: 0,
    spatialNavigation: true
  };
  
  liveRegionAnnouncements: LiveRegionAnnouncement[] = [];
  spatialNavigationNodes: SpatialNavigationNode[] = [];
  keyboardShortcuts: KeyboardShortcut[] = [];
  skipLinksEnabled = true;
  focusTrapActive = false;
  
  private isPanning = false;
  private lastPanPoint = { x: 0, y: 0 };
  private wheelTimeout: any;
  private cacheUpdateTimeout: any;
  private announcementTimeout: any;

  // Virtualization properties
  private virtualNodes: VirtualNode[] = [];
  private visibleNodes: VirtualNode[] = [];
  private currentViewport: ViewportInfo = {
    width: 0,
    height: 0,
    scrollX: 0,
    scrollY: 0,
    zoomLevel: 1.0
  };
  private performanceMetrics: PerformanceMetrics = {
    renderTime: 0,
    nodeCount: 0,
    visibleNodeCount: 0,
    connectionCount: 0,
    frameRate: 60,
    lastUpdate: performance.now()
  };
  private virtualizationEnabled = true;
  private performanceMonitorEnabled = true;

  constructor(
    private cdr: ChangeDetectorRef,
    private virtualizationService: TechTreeVirtualizationService
  ) {
    this.initializeAccessibility();
    this.initializeVirtualization();
  }

  // Accessibility Methods
  private initializeAccessibility(): void {
    if (!this.accessibilityConfig.enableKeyboardNavigation) return;
    
    this.initializeKeyboardShortcuts();
    this.initializeSpatialNavigation();
    this.announceToScreenReader('Technology tree canvas loaded. Use arrow keys to navigate, Enter to select.', 'polite');
  }
  
  private initializeVirtualization(): void {
    // Configure virtualization service
    this.virtualizationService.configure({
      bufferSize: 200,
      minZoomLevel: 0.5,
      virtualizationThreshold: 50,
      enableConnectionCaching: true,
      enablePerformanceMonitoring: this.performanceMonitorEnabled,
      scrollDebounceTime: 16,
      gridSize: this.config.gridSize
    });
    
    // Subscribe to performance updates
    this.virtualizationService.performance$.subscribe(metrics => {
      this.performanceMetrics = metrics;
      if (this.performanceMonitorEnabled) {
        this.cdr.detectChanges();
      }
    });
    
    // Subscribe to viewport changes
    this.virtualizationService.viewport$.subscribe(viewport => {
      this.currentViewport = viewport;
      this.updateVirtualNodes();
    });
  }
  
  private initializeKeyboardShortcuts(): void {
    this.keyboardShortcuts = [
      { key: 'a', ctrlKey: true, action: 'selectAll', description: 'Select all nodes' },
      { key: 'd', ctrlKey: true, action: 'deselectAll', description: 'Deselect all nodes' },
      { key: 'f', ctrlKey: true, action: 'focusSearch', description: 'Focus search/filter' },
      { key: '+', ctrlKey: true, action: 'zoomIn', description: 'Zoom in' },
      { key: '-', ctrlKey: true, action: 'zoomOut', description: 'Zoom out' },
      { key: '0', ctrlKey: true, action: 'resetZoom', description: 'Reset zoom' },
      { key: ' ', ctrlKey: true, action: 'toggleStructuralEdit', description: 'Toggle structural edit mode' },
      { key: 'Escape', action: 'cancelOperations', description: 'Cancel operations, close dialogs' },
      { key: 'F6', action: 'cycleRegions', description: 'Cycle through canvas regions' }
    ];
  }
  
  private initializeSpatialNavigation(): void {
    this.spatialNavigationNodes = this.nodes.map(node => ({
      id: node.id,
      tier: node.tier,
      position: this.getNodePosition(node),
      neighbors: this.calculateNeighbors(node)
    }));
  }
  
  private calculateNeighbors(node: TechNode): SpatialNavigationNode['neighbors'] {
    const currentPos = this.getNodePosition(node);
    const nodesInSameTier = this.nodes.filter(n => n.tier === node.tier);
    const nodesInTierAbove = this.nodes.filter(n => n.tier === node.tier - 1);
    const nodesInTierBelow = this.nodes.filter(n => n.tier === node.tier + 1);
    
    // Find nearest neighbors in same tier
    const leftNeighbor = nodesInSameTier
      .filter(n => this.getNodePosition(n).x < currentPos.x)
      .sort((a, b) => this.getNodePosition(b).x - this.getNodePosition(a).x)[0];
    
    const rightNeighbor = nodesInSameTier
      .filter(n => this.getNodePosition(n).x > currentPos.x)
      .sort((a, b) => this.getNodePosition(a).x - this.getNodePosition(b).x)[0];
    
    // Find nearest neighbors in adjacent tiers
    const tierUpNeighbor = nodesInTierAbove
      .sort((a, b) => {
        const distA = Math.abs(this.getNodePosition(a).x - currentPos.x);
        const distB = Math.abs(this.getNodePosition(b).x - currentPos.x);
        return distA - distB;
      })[0];
    
    const tierDownNeighbor = nodesInTierBelow
      .sort((a, b) => {
        const distA = Math.abs(this.getNodePosition(a).x - currentPos.x);
        const distB = Math.abs(this.getNodePosition(b).x - currentPos.x);
        return distA - distB;
      })[0];
    
    return {
      up: tierUpNeighbor?.id || null,
      down: tierDownNeighbor?.id || null,
      left: leftNeighbor?.id || null,
      right: rightNeighbor?.id || null,
      tierUp: null,
      tierDown: null
    };
  }
  
  private announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.accessibilityConfig.enableScreenReaderSupport) return;
    
    const announcement: LiveRegionAnnouncement = {
      id: `announcement-${Date.now()}`,
      message,
      priority,
      timestamp: Date.now()
    };
    
    this.liveRegionAnnouncements.push(announcement);
    
    // Auto-remove announcement after delay
    setTimeout(() => {
      this.liveRegionAnnouncements = this.liveRegionAnnouncements.filter(a => a.id !== announcement.id);
    }, this.accessibilityConfig.announcementsDelay);
  }

  ngOnInit(): void {
    this.zoomLevel = this.config.initialZoom;
    this.setupEventListeners();
    this.initializeConnectionSystem();
    
    // Initialize virtual nodes
    this.updateVirtualNodes();
  }

  ngOnDestroy(): void {
    this.removeEventListeners();
    this.clearCacheTimeout();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['nodes'] && !changes['nodes'].firstChange) {
      this.onNodesChanged();
    }
    
    if (changes['config']) {
      this.onConfigChanged();
    }
  }

  private onNodesChanged(): void {
    if (this.config.enableConnections) {
      // Debounce node updates to avoid excessive regeneration
      if (this.cacheUpdateTimeout) {
        clearTimeout(this.cacheUpdateTimeout);
      }
      
      this.cacheUpdateTimeout = setTimeout(() => {
        this.generateConnections();
        this.cdr.detectChanges();
      }, 100);
    }
    
    // Update virtual nodes for new data
    this.updateVirtualNodes();
  }

  private onConfigChanged(): void {
    if (this.config.enableConnections !== undefined) {
      this.initializeConnectionSystem();
    }
  }

  private setupEventListeners(): void {
    // Mouse wheel zoom
    this.canvasContainer.nativeElement.addEventListener('wheel', this.onWheel.bind(this), { passive: false });
    
    // Mouse pan
    this.canvasContainer.nativeElement.addEventListener('mousedown', this.onMouseDown.bind(this));
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
    
    // Keyboard navigation
    this.canvasContainer.nativeElement.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  private removeEventListeners(): void {
    this.canvasContainer.nativeElement.removeEventListener('wheel', this.onWheel.bind(this));
    this.canvasContainer.nativeElement.removeEventListener('mousedown', this.onMouseDown.bind(this));
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('mouseup', this.onMouseUp.bind(this));
    this.canvasContainer.nativeElement.removeEventListener('keydown', this.onKeyDown.bind(this));
  }

  private onWheel(event: WheelEvent): void {
    event.preventDefault();
    
    const delta = event.deltaY > 0 ? -this.config.zoomStep : this.config.zoomStep;
    const newZoom = Math.max(this.config.zoomMin, Math.min(this.config.zoomMax, this.zoomLevel + delta));
    
    if (newZoom !== this.zoomLevel) {
      this.zoomLevel = newZoom;
      this.zoomChanged.emit(this.zoomLevel);
      
      // Clear previous timeout
      if (this.wheelTimeout) {
        clearTimeout(this.wheelTimeout);
      }
      
      // Debounce zoom changes
      this.wheelTimeout = setTimeout(() => {
        this.onZoomComplete();
      }, 100);
    }
  }

  private onZoomComplete(): void {
    // Update connection rendering based on new zoom level
    if (this.config.enableConnections) {
      this.updateConnectionRendering();
    }
    
    // Update virtualization for zoom change
    this.updateVirtualNodes();
    
    console.log('Zoom completed:', this.zoomLevel);
  }

  private onMouseDown(event: MouseEvent): void {
    if (event.button === 0 || event.button === 1) { // Left or middle mouse button
      this.isPanning = true;
      this.lastPanPoint = { x: event.clientX, y: event.clientY };
      this.canvasContainer.nativeElement.style.cursor = 'grabbing';
    }
  }

  private onMouseMove(event: MouseEvent): void {
    if (this.isPanning) {
      const deltaX = event.clientX - this.lastPanPoint.x;
      const deltaY = event.clientY - this.lastPanPoint.y;
      
      this.panPosition.x += deltaX;
      this.panPosition.y += deltaY;
      
      this.panChanged.emit(this.panPosition);
      
      // Update virtualization viewport for pan
      this.updateViewportOnPan();
      
      this.lastPanPoint = { x: event.clientX, y: event.clientY };
    }
  }

  private onMouseUp(event: MouseEvent): void {
    if (this.isPanning) {
      this.isPanning = false;
      this.canvasContainer.nativeElement.style.cursor = 'grab';
    }
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (!this.accessibilityConfig.enableKeyboardNavigation) return;
    
    // Check for keyboard shortcuts first
    if (this.accessibilityConfig.enableKeyboardShortcuts) {
      if (this.handleKeyboardShortcut(event)) {
        event.preventDefault();
        return;
      }
    }
    
    switch (event.key) {
      case 'Tab':
        this.handleTabNavigation(event);
        event.preventDefault();
        break;
      case 'Home':
        this.navigateToFirstNode();
        event.preventDefault();
        break;
      case 'End':
        this.navigateToLastNode();
        event.preventDefault();
        break;
      case 'PageUp':
        this.navigateToPreviousTier();
        event.preventDefault();
        break;
      case 'PageDown':
        this.navigateToNextTier();
        event.preventDefault();
        break;
      case '+':
      case '=':
        this.zoomIn();
        this.announceToScreenReader(`Zoom level: ${Math.round(this.zoomLevel * 100)}%`, 'polite');
        break;
      case '-':
        this.zoomOut();
        this.announceToScreenReader(`Zoom level: ${Math.round(this.zoomLevel * 100)}%`, 'polite');
        break;
      case '0':
        this.resetZoom();
        this.announceToScreenReader('Zoom reset to 100%', 'polite');
        break;
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        this.navigateNodes(event.key);
        event.preventDefault();
        break;
    }
  }
  
  private handleKeyboardShortcut(event: KeyboardEvent): boolean {
    if (!this.accessibilityConfig.enableKeyboardShortcuts) return false;
    
    const shortcut = this.keyboardShortcuts.find(s => {
      return s.key === event.key && 
             s.ctrlKey === event.ctrlKey && 
             s.shiftKey === event.shiftKey && 
             s.altKey === event.altKey;
    });
    
    if (shortcut) {
      this.executeShortcutAction(shortcut.action);
      return true;
    }
    
    return false;
  }
  
  private executeShortcutAction(action: string): void {
    switch (action) {
      case 'selectAll':
        this.selectAllNodes();
        this.announceToScreenReader(`Selected all ${this.nodes.length} nodes`, 'polite');
        break;
      case 'deselectAll':
        this.deselectAllNodes();
        this.announceToScreenReader('Deselected all nodes', 'polite');
        break;
      case 'focusSearch':
        this.focusSearchFilter();
        this.announceToScreenReader('Focus moved to search filter', 'polite');
        break;
      case 'zoomIn':
        this.zoomIn();
        this.announceToScreenReader(`Zoom level: ${Math.round(this.zoomLevel * 100)}%`, 'polite');
        break;
      case 'zoomOut':
        this.zoomOut();
        this.announceToScreenReader(`Zoom level: ${Math.round(this.zoomLevel * 100)}%`, 'polite');
        break;
      case 'resetZoom':
        this.resetZoom();
        this.announceToScreenReader('Zoom reset to 100%', 'polite');
        break;
      case 'toggleStructuralEdit':
        this.toggleStructuralEditMode();
        const modeText = this.isStructuralEditMode() ? 'Structural editing enabled' : 'Structural editing disabled';
        this.announceToScreenReader(modeText, 'polite');
        break;
      case 'cancelOperations':
        this.cancelOperations();
        this.announceToScreenReader('Operations cancelled', 'assertive');
        break;
      case 'cycleRegions':
        this.cycleCanvasRegions();
        this.announceToScreenReader('Cycled to next canvas region', 'polite');
        break;
    }
  }
  
  private handleTabNavigation(event: KeyboardEvent): void {
    if (!this.focusManagement.spatialNavigation) {
      // Standard tab navigation
      const nodes = this.nodes;
      const currentIndex = this.focusedNodeId ? nodes.findIndex(n => n.id === this.focusedNodeId) : -1;
      
      if (event.shiftKey) {
        // Shift+Tab: go to previous node
        const previousIndex = currentIndex > 0 ? currentIndex - 1 : nodes.length - 1;
        this.focusedNodeId = nodes[previousIndex].id;
      } else {
        // Tab: go to next node
        const nextIndex = currentIndex < nodes.length - 1 ? currentIndex + 1 : 0;
        this.focusedNodeId = nodes[nextIndex].id;
      }
      
      const focusedNode = this.nodes.find(n => n.id === this.focusedNodeId);
      if (focusedNode) {
        this.announceNodeFocus(focusedNode);
      }
    } else {
      // Spatial navigation with Tab
      this.navigateToNextSpatialNode(event.shiftKey);
    }
  }
  
  private navigateToFirstNode(): void {
    if (this.nodes.length === 0) return;
    
    const firstNode = this.nodes[0];
    this.focusedNodeId = firstNode.id;
    this.announceNodeFocus(firstNode);
  }
  
  private navigateToLastNode(): void {
    if (this.nodes.length === 0) return;
    
    const lastNode = this.nodes[this.nodes.length - 1];
    this.focusedNodeId = lastNode.id;
    this.announceNodeFocus(lastNode);
  }
  
  private navigateToPreviousTier(): void {
    if (!this.focusedNodeId) return;
    
    const currentNode = this.nodes.find(n => n.id === this.focusedNodeId);
    if (!currentNode) return;
    
    const previousTierNodes = this.nodes.filter(n => n.tier < currentNode.tier);
    if (previousTierNodes.length === 0) return;
    
    // Find the closest node in the previous tier
    const closestNode = previousTierNodes.reduce((closest, node) => {
      const currentDistance = Math.abs(this.getNodePosition(node).x - this.getNodePosition(currentNode).x);
      const closestDistance = Math.abs(this.getNodePosition(closest).x - this.getNodePosition(currentNode).x);
      return currentDistance < closestDistance ? node : closest;
    });
    
    this.focusedNodeId = closestNode.id;
    this.announceNodeFocus(closestNode);
  }
  
  private navigateToNextTier(): void {
    if (!this.focusedNodeId) return;
    
    const currentNode = this.nodes.find(n => n.id === this.focusedNodeId);
    if (!currentNode) return;
    
    const nextTierNodes = this.nodes.filter(n => n.tier > currentNode.tier);
    if (nextTierNodes.length === 0) return;
    
    // Find the closest node in the next tier
    const closestNode = nextTierNodes.reduce((closest, node) => {
      const currentDistance = Math.abs(this.getNodePosition(node).x - this.getNodePosition(currentNode).x);
      const closestDistance = Math.abs(this.getNodePosition(closest).x - this.getNodePosition(currentNode).x);
      return currentDistance < closestDistance ? node : closest;
    });
    
    this.focusedNodeId = closestNode.id;
    this.announceNodeFocus(closestNode);
  }
  
  private navigateToNextSpatialNode(isReverse: boolean = false): void {
    if (!this.focusedNodeId) {
      this.navigateToFirstNode();
      return;
    }
    
    const currentNode = this.nodes.find(n => n.id === this.focusedNodeId);
    if (!currentNode) return;
    
    const spatialNode = this.spatialNavigationNodes.find(sn => sn.id === currentNode.id);
    if (!spatialNode) return;
    
    // Determine next node based on spatial relationships
    let nextNodeId: string | null = null;
    
    if (!isReverse) {
      // Forward navigation: right, then down, then left, then up
      nextNodeId = spatialNode.neighbors.right || spatialNode.neighbors.down || spatialNode.neighbors.left || spatialNode.neighbors.up;
    } else {
      // Reverse navigation: left, then up, then right, then down
      nextNodeId = spatialNode.neighbors.left || spatialNode.neighbors.up || spatialNode.neighbors.right || spatialNode.neighbors.down;
    }
    
    if (nextNodeId) {
      this.focusedNodeId = nextNodeId;
      const nextNode = this.nodes.find(n => n.id === nextNodeId);
      if (nextNode) {
        this.announceNodeFocus(nextNode);
      }
    }
  }
  
  private announceNodeFocus(node: TechNode): void {
    const spatialContext = this.getSpatialContext(node);
    const announcement = `${node.name}, Tier ${node.tier}, ${spatialContext}`;
    this.announceToScreenReader(announcement, 'polite');
  }
  
  private getSpatialContext(node: TechNode): string {
    const position = this.getNodePosition(node);
    const nodesInSameTier = this.getNodesInTier(node.tier);
    const nodeIndex = nodesInSameTier.indexOf(node);
    
    let context = '';
    
    if (nodeIndex === 0) {
      context = 'first in tier';
    } else if (nodeIndex === nodesInSameTier.length - 1) {
      context = 'last in tier';
    } else {
      context = `position ${nodeIndex + 1} of ${nodesInSameTier.length} in tier`;
    }
    
    return context;
  }

  onNodeClick(node: TechNode): void {
    this.selectedNodeId = node.id;
    this.nodeSelected.emit(node);
  }

  onNodeFocus(node: TechNode): void {
    this.focusedNodeId = node.id;
    this.nodeFocused.emit(node);
  }

  onNodeSelect(node: TechNode): void {
    this.selectedNodeId = node.id;
    this.nodeSelected.emit(node);
  }

  getNodeState(node: TechNode): TechNodeState {
    return {
      selected: node.id === this.selectedNodeId,
      focused: node.id === this.focusedNodeId,
      invalid: this.isNodeInvalid(node),
      disabled: this.isNodeDisabled(node),
      activePath: this.isNodeInActivePath(node),
      prerequisiteSatisfied: this.arePrerequisitesSatisfied(node),
      prerequisiteUnsatisfied: !this.arePrerequisitesSatisfied(node)
    };
  }

  private isNodeInvalid(node: TechNode): boolean {
    // Check for circular dependencies or other validation issues
    return false; // Placeholder for validation logic
  }

  private isNodeDisabled(node: TechNode): boolean {
    return !node.isUnlocked && !this.arePrerequisitesSatisfied(node);
  }

  private isNodeInActivePath(node: TechNode): boolean {
    // Check if node is part of the currently selected tech path
    return false; // Placeholder for active path logic
  }

  private arePrerequisitesSatisfied(node: TechNode): boolean {
    if (!node.prerequisites || node.prerequisites.length === 0) {
      return true;
    }
    
    return node.prerequisites.every(prereqId => 
      this.nodes.find(n => n.id === prereqId)?.isResearched || false
    );
  }

  getNodePosition(node: TechNode): { x: number; y: number } {
    // Calculate position based on tier and dependencies
    const tierIndex = node.tier - 1;
    const positionInTier = this.nodes.filter(n => n.tier === node.tier).indexOf(node);
    
    const x = positionInTier * this.config.nodeSpacing.x;
    const y = tierIndex * this.config.nodeSpacing.y;
    
    return { x, y };
  }

  // Zoom controls
  zoomIn(): void {
    const newZoom = Math.min(this.config.zoomMax, this.zoomLevel + this.config.zoomStep);
    this.setZoom(newZoom);
  }

  zoomOut(): void {
    const newZoom = Math.max(this.config.zoomMin, this.zoomLevel - this.config.zoomStep);
    this.setZoom(newZoom);
  }

  resetZoom(): void {
    this.setZoom(this.config.initialZoom);
  }

  private setZoom(zoom: number): void {
    this.zoomLevel = zoom;
    this.zoomChanged.emit(this.zoomLevel);
  }
  
  // Public testing methods
  public setZoomForTesting(zoom: number): void {
    this.setZoom(zoom);
  }
  
  public updateVirtualNodesForTesting(): void {
    this.updateVirtualNodes();
  }
  
  public generateConnectionsForTesting(): void {
    this.generateConnections();
  }
  
  public onNodesChangedForTesting(): void {
    this.onNodesChanged();
  }
  
  public updateViewportOnPanForTesting(): void {
    this.updateViewportOnPan();
  }

  // Navigation
  private navigateNodes(direction: string): void {
    if (!this.focusedNodeId && this.nodes.length > 0) {
      this.focusedNodeId = this.nodes[0].id;
      return;
    }

    const currentNode = this.nodes.find(n => n.id === this.focusedNodeId);
    if (!currentNode) return;

    let targetNode: TechNode | undefined;

    switch (direction) {
      case 'ArrowUp':
        targetNode = this.nodes.find(n => n.tier < currentNode.tier);
        break;
      case 'ArrowDown':
        targetNode = this.nodes.find(n => n.tier > currentNode.tier);
        break;
      case 'ArrowLeft':
        targetNode = this.nodes
          .filter(n => n.tier === currentNode.tier)
          .find((n, index, arr) => arr[index - 1]?.id === currentNode.id);
        break;
      case 'ArrowRight':
        targetNode = this.nodes
          .filter(n => n.tier === currentNode.tier)
          .find((n, index, arr) => arr[index + 1]?.id === currentNode.id);
        break;
    }

    if (targetNode) {
      this.focusedNodeId = targetNode.id;
      this.nodeFocused.emit(targetNode);
    }
  }

  getCanvasStyle(): any {
    return {
      'transform': `translate(${this.panPosition.x}px, ${this.panPosition.y}px) scale(${this.zoomLevel})`,
      'transform-origin': '0 0'
    };
  }

  trackByNodeId(index: number, node: TechNode): string {
    return node.id;
  }

  trackByConnectionId(index: number, connection: TechConnection): string {
    return connection.id;
  }

  trackByTier(index: number, tier: number): number {
    return tier;
  }
  
  trackByZone(index: number, zone: DropZone): string {
    return `${zone.tier}-${zone.x}-${zone.y}`;
  }

  getGridPattern(): string {
    // Generate SVG grid pattern
    const size = this.config.gridSize;
    const svg = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
            <path d="M ${size} 0 L 0 0 0 ${size}" fill="none" stroke="#e0e0e0" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    `;
    return `url("data:image/svg+xml;base64,${btoa(svg)}")`;
  }

  // Tier Management Methods
  getUniqueTiers(): number[] {
    const tiers = [...new Set(this.nodes.map(node => node.tier))];
    return tiers.sort((a, b) => a - b);
  }

  getNodesInTier(tier: number): TechNode[] {
    return this.nodes.filter(node => node.tier === tier);
  }

  addTier(tierNumber?: number): number {
    const existingTiers = this.getUniqueTiers();
    const newTier = tierNumber || (existingTiers.length > 0 ? Math.max(...existingTiers) + 1 : 1);
    
    if (!existingTiers.includes(newTier)) {
      console.log(`Added new tier: ${newTier}`);
      return newTier;
    }
    
    return newTier;
  }

  removeTier(tierNumber: number): void {
    const nodesInTier = this.getNodesInTier(tierNumber);
    if (nodesInTier.length > 0) {
      console.warn(`Cannot remove tier ${tierNumber} - it contains ${nodesInTier.length} nodes`);
      return;
    }
    
    console.log(`Removed tier: ${tierNumber}`);
  }

  moveNodeToTier(nodeId: string, newTier: number): void {
    const node = this.nodes.find(n => n.id === nodeId);
    if (node) {
      const oldTier = node.tier;
      node.tier = newTier;
      console.log(`Moved node ${nodeId} from tier ${oldTier} to tier ${newTier}`);
    }
  }

  snapToNearestTier(yPosition: number): number {
    const tierIndex = Math.round(yPosition / this.config.tierBandHeight);
    return Math.max(1, tierIndex + 1);
  }

  getTierBandStyle(tier: number): any {
    const tierIndex = tier - 1;
    const top = tierIndex * this.config.tierBandHeight;
    
    return {
      'top.px': top,
      'height.px': this.config.tierBandHeight,
      'opacity': this.config.tierBandOpacity
    };
  }

  getTierBandPosition(tier: number): { x: number; y: number; width: number; height: number } {
    const tierIndex = tier - 1;
    return {
      x: 0,
      y: tierIndex * this.config.tierBandHeight,
      width: 10000, // Large width to cover the canvas
      height: this.config.tierBandHeight
    };
  }

  // Drag and Drop Integration
  onNodeDragStart(node: TechNode, event: DragEvent): void {
    if (!this.config.dragDrop.enableDragDrop) return;
    
    // Set drag image for better visual feedback
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', node.id);
    }
    
    // Initialize drag state
    this.dragState.isDragging = true;
    this.dragState.draggedNode = node;
    this.dragState.startPosition = this.getNodePosition(node);
    this.dragState.currentPosition = { ...this.dragState.startPosition };
    this.dragState.snapPosition = { ...this.dragState.startPosition };
    this.dragState.targetTier = node.tier;
    this.dragState.dragMode = 'position';
    this.dragState.requiresConfirmation = false;
    
    // Determine if this will be a structural change
    this.dragState.requiresConfirmation = this.willRequireStructuralChange(node, node.tier);
    
    // Generate drop zones for visual feedback
    this.generateDropZones();
    
    // Emit drag start event
    this.nodeDragStart.emit(node);
    
    console.log(`Started dragging node: ${node.id}`);
  }

  onNodeDrag(event: DragEvent, node: TechNode): void {
    if (!this.dragState.isDragging || !this.config.dragDrop.enableDragDrop) return;
    
    const rect = this.canvasViewport.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Account for pan and zoom
    const adjustedX = (x - this.panPosition.x) / this.zoomLevel;
    const adjustedY = (y - this.panPosition.y) / this.zoomLevel;
    
    // Update current position
    this.dragState.currentPosition = { x: adjustedX, y: adjustedY };
    
    // Calculate snap position
    this.updateSnapPosition();
    
    // Update target tier if snap to tier is enabled
    if (this.config.dragDrop.snapToTier) {
      const newTier = this.snapToNearestTier(adjustedY);
      this.dragState.targetTier = newTier;
    }
    
    // Validate drop
    this.dragState.isValidDrop = this.validateDrop();
    
    // Update drop zones highlighting
    this.updateDropZonesHighlighting();
    
    console.log(`Dragging node ${node.id} to position:`, this.dragState.snapPosition);
  }

  onNodeDragEnd(event: DragEvent, node: TechNode): void {
    if (!this.dragState.isDragging) return;
    
    const finalPosition = { ...this.dragState.snapPosition };
    const tierChange = this.dragState.targetTier !== node.tier ? this.dragState.targetTier : undefined;
    
    // Check if structural change is needed and if confirmation is required
    if (tierChange && this.dragState.requiresConfirmation && this.config.dragDrop.requireConfirmationForStructuralChanges) {
      this.requestStructuralChangeConfirmation(node, tierChange);
    } else {
      // Apply the change directly
      this.applyDragEndChanges(node, finalPosition, tierChange);
    }
    
    // Reset drag state
    this.resetDragState();
    
    // Clear drop zones
    this.dropZones = [];
    
    console.log(`Ended dragging node: ${node.id}`);
  }
  
  // Drag and Drop Helper Methods
  private willRequireStructuralChange(node: TechNode, newTier?: number): boolean {
    if (!newTier) return false;
    
    // Check if this is a structural change (tier modification)
    const isTierChange = newTier !== node.tier;
    
    // Check if the change requires confirmation
    const requiresConfirm = this.requiresConfirmation(node, newTier);
    
    // Check if structural edit mode is required
    const requiresStructuralMode = isTierChange && !this.structuralEditMode;
    
    return isTierChange && (requiresConfirm || requiresStructuralMode);
  }
  
  private generateDropZones(): void {
    this.dropZones = [];
    
    if (!this.config.dragDrop.showDropZones) return;
    
    // Generate drop zones for each tier
    const tiers = this.getUniqueTiers();
    for (const tier of tiers) {
      const tierNodes = this.getNodesInTier(tier);
      const tierY = (tier - 1) * this.config.tierBandHeight;
      
      // Add zones between existing nodes
      for (let i = 0; i <= tierNodes.length; i++) {
        const zoneX = i * this.config.nodeSpacing.x;
        
        const dropZone: DropZone = {
          x: zoneX,
          y: tierY,
          width: this.config.nodeSpacing.x,
          height: this.config.tierBandHeight,
          tier: tier,
          isValid: true,
          occupiedBy: tierNodes[i]?.id || null,
          distance: 0
        };
        
        this.dropZones.push(dropZone);
      }
    }
  }
  
  private updateSnapPosition(): void {
    if (!this.dragState.draggedNode) return;
    
    let snapX = this.dragState.currentPosition.x;
    let snapY = this.dragState.currentPosition.y;
    
    // Snap to grid if enabled
    if (this.config.dragDrop.snapToGrid) {
      snapX = this.snapToGrid(snapX);
      snapY = this.snapToGrid(snapY);
    }
    
    // Snap to tier if enabled
    if (this.config.dragDrop.snapToTier && this.dragState.targetTier) {
      snapY = (this.dragState.targetTier - 1) * this.config.tierBandHeight + (this.config.tierBandHeight / 2);
    }
    
    this.dragState.snapPosition = { x: snapX, y: snapY };
  }
  
  private snapToGrid(position: number): number {
    return Math.round(position / this.config.gridSize) * this.config.gridSize;
  }
  
  private validateDrop(): boolean {
    if (!this.dragState.draggedNode) return false;
    
    // Check if drop zone is valid
    const nearestZone = this.getNearestDropZone(this.dragState.currentPosition);
    if (!nearestZone) return false;
    
    // Check if zone is too close to existing nodes
    const distance = this.calculateDistance(this.dragState.currentPosition, { x: nearestZone.x, y: nearestZone.y });
    return distance <= this.config.dragDrop.snapThreshold;
  }
  
  private getNearestDropZone(position: { x: number; y: number }): DropZone | null {
    if (this.dropZones.length === 0) return null;
    
    let nearest = this.dropZones[0];
    let minDistance = this.calculateDistance(position, { x: nearest.x, y: nearest.y });
    
    for (const zone of this.dropZones) {
      const distance = this.calculateDistance(position, { x: zone.x, y: zone.y });
      if (distance < minDistance) {
        minDistance = distance;
        nearest = zone;
      }
    }
    
    return nearest;
  }
  
  private calculateDistance(pos1: { x: number; y: number }, pos2: { x: number; y: number }): number {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  private updateDropZonesHighlighting(): void {
    const nearestZone = this.getNearestDropZone(this.dragState.currentPosition);
    
    for (const zone of this.dropZones) {
      zone.isValid = zone === nearestZone && this.dragState.isValidDrop;
      zone.distance = this.calculateDistance(this.dragState.currentPosition, { x: zone.x, y: zone.y });
    }
  }
  
  private requestStructuralChangeConfirmation(node: TechNode, newTier: number): void {
    const changeDescription = this.generateChangeDescription(node, 'tier', newTier);
    
    // Check if user wants to see confirmation dialog
    if (this.config.dragDrop.requireConfirmationForStructuralChanges) {
      // Add to pending changes queue
      this.pendingStructuralChanges.push({
        nodeId: node.id,
        type: 'tier',
        newValue: newTier,
        description: changeDescription
      });
      
      // Show confirmation dialog
      this.showStructuralChangeDialog = true;
      
      // Emit event for external confirmation handling
      this.structuralChangeRequested.emit({
        nodeId: node.id,
        type: 'tier',
        newValue: newTier
      });
    } else {
      // Apply immediately without confirmation
      this.applyStructuralChange(node, newTier, 'tier');
    }
  }
  
  private generateChangeDescription(node: TechNode, changeType: 'tier' | 'prerequisites', newValue: any): string {
    switch (changeType) {
      case 'tier':
        return `Move "${node.name}" from Tier ${node.tier} to Tier ${newValue}`;
      case 'prerequisites':
        return `Modify prerequisites for "${node.name}"`;
      default:
        return `Unknown change to "${node.name}"`;
    }
  }
  
  private applyStructuralChange(node: TechNode, newValue: any, changeType: 'tier' | 'prerequisites'): void {
    switch (changeType) {
      case 'tier':
        this.moveNodeToTier(node.id, newValue as number);
        break;
      case 'prerequisites':
        // Handle prerequisite changes
        console.log(`Would modify prerequisites for node ${node.id}`);
        break;
    }
  }
  
  // Public methods for handling structural change confirmations
  confirmStructuralChange(index: number): void {
    if (index >= 0 && index < this.pendingStructuralChanges.length) {
      const change = this.pendingStructuralChanges[index];
      const node = this.nodes.find(n => n.id === change.nodeId);
      
      if (node) {
        this.applyStructuralChange(node, change.newValue, change.type);
      }
      
      this.pendingStructuralChanges.splice(index, 1);
      
      if (this.pendingStructuralChanges.length === 0) {
        this.showStructuralChangeDialog = false;
      }
    }
  }
  
  rejectStructuralChange(index: number): void {
    if (index >= 0 && index < this.pendingStructuralChanges.length) {
      this.pendingStructuralChanges.splice(index, 1);
      
      if (this.pendingStructuralChanges.length === 0) {
        this.showStructuralChangeDialog = false;
      }
    }
  }
  
  confirmAllStructuralChanges(): void {
    while (this.pendingStructuralChanges.length > 0) {
      const change = this.pendingStructuralChanges.shift()!;
      const node = this.nodes.find(n => n.id === change.nodeId);
      
      if (node) {
        this.applyStructuralChange(node, change.newValue, change.type);
      }
    }
    
    this.showStructuralChangeDialog = false;
  }
  
  rejectAllStructuralChanges(): void {
    this.pendingStructuralChanges = [];
    this.showStructuralChangeDialog = false;
  }
  
  // Enhanced mode controls
  canPerformStructuralEdit(): boolean {
    return this.structuralEditMode && this.config.dragDrop.enableStructuralEditing;
  }
  
  isChangeDestructive(node: TechNode, newTier: number): boolean {
    // Consider a change destructive if it moves a node more than 2 tiers
    // or if it would create potential circular dependencies
    const tierDifference = Math.abs(newTier - node.tier);
    return tierDifference > 2;
  }
  
  requiresConfirmation(node: TechNode, newTier: number): boolean {
    return this.isChangeDestructive(node, newTier) || 
           this.config.dragDrop.requireConfirmationForStructuralChanges;
  }
  
  private applyDragEndChanges(node: TechNode, finalPosition: { x: number; y: number }, tierChange?: number | null): void {
    // Update node position if needed
    const oldPosition = this.getNodePosition(node);
    if (Math.abs(finalPosition.x - oldPosition.x) > 1 || Math.abs(finalPosition.y - oldPosition.y) > 1) {
      // Position change would be applied here
      console.log(`Would move node ${node.id} to position:`, finalPosition);
    }
    
    // Update tier if changed
    if (tierChange && tierChange !== node.tier) {
      this.moveNodeToTier(node.id, tierChange);
    }
    
    // Emit drag end event
    this.nodeDragEnd.emit({ node, finalPosition, tierChange: tierChange ?? undefined });
  }
  
  private resetDragState(): void {
    this.dragState = {
      isDragging: false,
      draggedNode: null,
      startPosition: { x: 0, y: 0 },
      currentPosition: { x: 0, y: 0 },
      snapPosition: { x: 0, y: 0 },
      targetTier: null,
      isValidDrop: false,
      dragMode: null,
      requiresConfirmation: false
    };
  }
  
  // Public methods for controlling structural editing mode
  toggleStructuralEditMode(): void {
    this.structuralEditMode = !this.structuralEditMode;
    this.dragDropModeChanged.emit(this.structuralEditMode);
  }
  
  setStructuralEditMode(enabled: boolean): void {
    this.structuralEditMode = enabled;
    this.dragDropModeChanged.emit(this.structuralEditMode);
  }
  
  // Visual feedback methods
  getDragPreviewStyle(): any {
    if (!this.dragState.isDragging || !this.dragState.draggedNode) {
      return { display: 'none' };
    }
    
    return {
      position: 'absolute',
      left: this.dragState.snapPosition.x + 'px',
      top: this.dragState.snapPosition.y + 'px',
      opacity: this.dragState.isValidDrop ? this.config.dragDrop.dragOpacity : this.config.dragDrop.invalidDropOpacity,
      pointerEvents: 'none',
      zIndex: 1000,
      transform: `scale(${this.zoomLevel})`,
      transformOrigin: '0 0'
    };
  }
  
  getDropZoneStyle(zone: DropZone): any {
    const isHighlighted = zone === this.getNearestDropZone(this.dragState.currentPosition);
    
    return {
      position: 'absolute',
      left: zone.x + 'px',
      top: zone.y + 'px',
      width: zone.width + 'px',
      height: zone.height + 'px',
      backgroundColor: zone.isValid ? 
        (isHighlighted ? this.config.dragDropColors.validDropZone : 'transparent') :
        (isHighlighted ? this.config.dragDropColors.invalidDropZone : 'transparent'),
      border: isHighlighted ? 
        `2px dashed ${zone.isValid ? this.config.dragDropColors.validDropZone : this.config.dragDropColors.invalidDropZone}` :
        'none',
      pointerEvents: 'none',
      zIndex: 5
    };
  }
  
  getSnapIndicatorStyle(): any {
    if (!this.dragState.isDragging || !this.dragState.draggedNode) {
      return { display: 'none' };
    }
    
    return {
      position: 'absolute',
      left: this.dragState.snapPosition.x + 'px',
      top: this.dragState.snapPosition.y + 'px',
      width: '100px',
      height: '2px',
      backgroundColor: this.config.dragDropColors.snapIndicator,
      pointerEvents: 'none',
      zIndex: 999,
      transform: `scale(${this.zoomLevel})`,
      transformOrigin: '0 0'
    };
  }
  
  // Get methods for template
  getDragState(): DragState {
    return this.dragState;
  }
  
  getDropZones(): DropZone[] {
    return this.dropZones;
  }
  
  isStructuralEditMode(): boolean {
    return this.structuralEditMode;
  }
  
  getPendingStructuralChanges(): Array<{ nodeId: string; type: 'tier' | 'prerequisites'; newValue: any; description: string }> {
    return this.pendingStructuralChanges;
  }
  
  shouldShowStructuralChangeDialog(): boolean {
    return this.showStructuralChangeDialog;
  }
  
  getStructuralEditModeText(): string {
    return this.structuralEditMode ? 'Structural Editing: ON' : 'Structural Editing: OFF';
  }
  
  canEnableStructuralEditing(): boolean {
    return this.config.dragDrop.enableStructuralEditing;
  }

  // Connection System Methods
  private initializeConnectionSystem(): void {
    if (!this.config.enableConnections) return;
    
    this.generateConnections();
    this.cdr.detectChanges();
  }

  private generateConnections(): void {
    const connections: TechConnection[] = [];
    
    for (const node of this.nodes) {
      if (!node.prerequisites || node.prerequisites.length === 0) continue;
      
      for (const prereqId of node.prerequisites) {
        const prereqNode = this.nodes.find(n => n.id === prereqId);
        if (!prereqNode) continue;
        
        const connection: TechConnection = {
          id: `${prereqId}->${node.id}`,
          fromNodeId: prereqId,
          toNodeId: node.id,
          path: '',
          isActive: this.isConnectionActive(prereqId, node.id),
          isSatisfied: this.isPrerequisiteSatisfied(prereqId, node.id),
          complexity: this.determineConnectionComplexity()
        };
        
        connections.push(connection);
      }
    }
    
    // Limit connections for performance
    this.connections = connections.slice(0, this.config.maxConnectionsVisible);
    this.updateConnectionPaths();
  }

  private isConnectionActive(fromNodeId: string, toNodeId: string): boolean {
    // Check if this connection is part of an active research path
    const toNode = this.nodes.find(n => n.id === toNodeId);
    return toNode?.isResearching || false;
  }

  private isPrerequisiteSatisfied(prereqId: string, targetNodeId: string): boolean {
    const prereqNode = this.nodes.find(n => n.id === prereqId);
    return prereqNode?.isResearched || false;
  }

  private determineConnectionComplexity(): 'simple' | 'routed' | 'full' {
    if (this.zoomLevel < this.config.connectionDetailThresholds.simple) {
      return 'simple';
    } else if (this.zoomLevel < this.config.connectionDetailThresholds.routed) {
      return 'routed';
    } else {
      return 'full';
    }
  }

  private updateConnectionPaths(): void {
    for (const connection of this.connections) {
      connection.path = this.generateConnectionPath(connection);
      connection.complexity = this.determineConnectionComplexity();
    }
  }

  private generateConnectionPath(connection: TechConnection): string {
    const fromNode = this.nodes.find(n => n.id === connection.fromNodeId);
    const toNode = this.nodes.find(n => n.id === connection.toNodeId);
    
    if (!fromNode || !toNode) return '';
    
    const fromPos = this.getNodePosition(fromNode);
    const toPos = this.getNodePosition(toNode);
    
    switch (connection.complexity) {
      case 'simple':
        return `M ${fromPos.x + 50} ${fromPos.y + 25} L ${toPos.x + 50} ${toPos.y + 25}`;
      case 'routed':
        const midX = (fromPos.x + toPos.x) / 2;
        const midY = (fromPos.y + toPos.y) / 2;
        return `M ${fromPos.x + 50} ${fromPos.y + 25} Q ${midX} ${midY} ${toPos.x + 50} ${toPos.y + 25}`;
      case 'full':
        return this.generateDetailedPath(fromPos, toPos);
      default:
        return `M ${fromPos.x + 50} ${fromPos.y + 25} L ${toPos.x + 50} ${toPos.y + 25}`;
    }
  }

  private generateDetailedPath(fromPos: { x: number; y: number }, toPos: { x: number; y: number }): string {
    // Generate a more sophisticated path with multiple control points
    const deltaX = toPos.x - fromPos.x;
    const deltaY = toPos.y - fromPos.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Create curved path with multiple segments for better visual appeal
    const controlPoint1 = {
      x: fromPos.x + deltaX * 0.25,
      y: fromPos.y - Math.abs(deltaY) * 0.1
    };
    
    const controlPoint2 = {
      x: fromPos.x + deltaX * 0.75,
      y: toPos.y + Math.abs(deltaY) * 0.1
    };
    
    return `M ${fromPos.x + 50} ${fromPos.y + 25} C ${controlPoint1.x + 50} ${controlPoint1.y + 25} ${controlPoint2.x + 50} ${controlPoint2.y + 25} ${toPos.x + 50} ${toPos.y + 25}`;
  }

  private updateConnectionRendering(): void {
    if (!this.config.enableConnections) return;
    
    // Debounce connection updates for performance
    if (this.cacheUpdateTimeout) {
      clearTimeout(this.cacheUpdateTimeout);
    }
    
    this.cacheUpdateTimeout = setTimeout(() => {
      this.updateConnectionPaths();
      this.updateConnectionCache();
      this.cdr.detectChanges();
    }, 50); // 50ms debounce
  }

  private updateConnectionCache(): void {
    this.connectionCache.lastUpdate = Date.now();
    this.connectionCache.zoomLevel = this.zoomLevel;
    this.connectionCache.nodePositions.clear();
    
    // Cache node positions
    for (const node of this.nodes) {
      this.connectionCache.nodePositions.set(node.id, this.getNodePosition(node));
    }
    
    // Cache connections
    this.connectionCache.connections.clear();
    for (const connection of this.connections) {
      this.connectionCache.connections.set(connection.id, { ...connection });
    }
  }

  private clearCacheTimeout(): void {
    if (this.cacheUpdateTimeout) {
      clearTimeout(this.cacheUpdateTimeout);
    }
  }

  // Connection interaction methods
  onConnectionMouseEnter(connection: TechConnection): void {
    this.highlightedConnectionId = connection.id;
    this.connectionHighlighted.emit({
      fromNodeId: connection.fromNodeId,
      toNodeId: connection.toNodeId
    });
  }

  onConnectionMouseLeave(): void {
    this.highlightedConnectionId = null;
  }

  getConnectionStyle(connection: TechConnection): any {
    let color = this.config.connectionColors.satisfied;
    
    if (connection.id === this.highlightedConnectionId) {
      color = this.config.connectionColors.highlighted;
    } else if (connection.isActive) {
      color = this.config.connectionColors.active;
    } else if (!connection.isSatisfied) {
      color = this.config.connectionColors.unsatisfied;
    }
    
    const strokeWidth = this.getConnectionStrokeWidth(connection.complexity);
    
    return {
      'stroke': color,
      'stroke-width': strokeWidth,
      'fill': 'none',
      'opacity': this.getConnectionOpacity(connection),
      'stroke-dasharray': connection.isSatisfied ? 'none' : '5,5',
      'marker-end': connection.complexity === 'full' ? 'url(#arrowhead)' : 'none'
    };
  }

  private getConnectionStrokeWidth(complexity: 'simple' | 'routed' | 'full'): number {
    switch (complexity) {
      case 'simple': return 1;
      case 'routed': return 2;
      case 'full': return 3;
      default: return 2;
    }
  }

  private getConnectionOpacity(connection: TechConnection): number {
    if (connection.id === this.highlightedConnectionId) {
      return 1.0;
    }
    if (connection.isActive) {
      return 0.9;
    }
    if (connection.isSatisfied) {
      return 0.6;
    }
    return 0.4;
  }

  // Performance optimization methods
  shouldRenderConnection(connection: TechConnection): boolean {
    if (!this.virtualizationEnabled) {
      // Fallback to original logic for non-virtualized mode
      const now = Date.now();
      return (now - this.connectionCache.lastUpdate) < this.config.connectionCacheTimeout;
    }
    
    // Only render connections for visible nodes in virtualization mode
    const visibleNodeIds = new Set(this.visibleNodes.map(node => node.id));
    return visibleNodeIds.has(connection.fromNodeId) && visibleNodeIds.has(connection.toNodeId);
  }

  getVisibleConnections(): TechConnection[] {
    if (!this.config.enableConnections) return [];
    
    if (!this.virtualizationEnabled) {
      // Fallback to original logic for non-virtualized mode
      return this.connections.filter(connection => {
        if (this.connections.length > this.config.maxConnectionsVisible) {
          // Show only important connections when too many exist
          return connection.isActive || connection.isSatisfied || 
                 connection.id === this.highlightedConnectionId;
        }
        return true;
      });
    }
    
    // Filter connections based on visible nodes in virtualization mode
    const visibleNodeIds = new Set(this.visibleNodes.map(node => node.id));
    
    return this.connections.filter(connection => {
      // Only show connections between visible nodes
      const isBetweenVisibleNodes = visibleNodeIds.has(connection.fromNodeId) && visibleNodeIds.has(connection.toNodeId);
      
      if (this.connections.length > this.config.maxConnectionsVisible) {
        // Show only important connections when too many exist
        return isBetweenVisibleNodes && (connection.isActive || connection.isSatisfied || 
               connection.id === this.highlightedConnectionId);
      }
      return isBetweenVisibleNodes;
    });
  }
  
  // Accessibility Helper Methods
  private selectAllNodes(): void {
    // Implementation for selecting all nodes
    // This would typically involve a multi-select mechanism
    console.log('Select all nodes');
  }
  
  private deselectAllNodes(): void {
    this.selectedNodeId = null;
    console.log('Deselect all nodes');
  }
  
  private focusSearchFilter(): void {
    // Implementation to focus search/filter input
    // This would typically emit an event or focus a specific element
    console.log('Focus search filter');
  }
  
  private cancelOperations(): void {
    // Cancel any ongoing operations
    if (this.dragState.isDragging) {
      this.resetDragState();
      this.dropZones = [];
    }
    
    if (this.showStructuralChangeDialog) {
      this.rejectAllStructuralChanges();
    }
    
    // Reset focus to canvas
    this.focusedNodeId = null;
    console.log('Operations cancelled');
  }
  
  private cycleCanvasRegions(): void {
    // Implementation to cycle through different regions of the canvas
    // This could include controls, main canvas, info panel, etc.
    console.log('Cycle canvas regions');
  }
  
  // Public accessibility methods
  getLiveRegionAnnouncements(): LiveRegionAnnouncement[] {
    return this.liveRegionAnnouncements;
  }
  
  getKeyboardShortcuts(): KeyboardShortcut[] {
    return this.keyboardShortcuts;
  }
  
  getFocusManagementState(): FocusManagement {
    return { ...this.focusManagement };
  }
  
  isSkipLinksEnabled(): boolean {
    return this.skipLinksEnabled;
  }
  
  setSkipLinksEnabled(enabled: boolean): void {
    this.skipLinksEnabled = enabled;
  }
  
  // Virtualization Methods
  private updateVirtualNodes(): void {
    if (!this.virtualizationEnabled || this.nodes.length === 0) {
      this.virtualNodes = [];
      this.visibleNodes = [];
      return;
    }
    
    // Calculate virtual nodes with positions
    this.virtualNodes = this.virtualizationService.calculateVirtualNodes(this.nodes, this.config.nodeSpacing);
    
    // Update viewport information
    this.virtualizationService.updateViewport({
      width: this.canvasViewport?.nativeElement?.offsetWidth || 0,
      height: this.canvasViewport?.nativeElement?.offsetHeight || 0,
      scrollX: this.panPosition.x,
      scrollY: this.panPosition.y,
      zoomLevel: this.zoomLevel
    });
    
    // Get visible nodes
    this.visibleNodes = this.virtualizationService.getVisibleNodes();
    
    // Update performance metrics
    this.performanceMetrics.nodeCount = this.virtualNodes.length;
    this.performanceMetrics.visibleNodeCount = this.visibleNodes.length;
  }
  
  private updateViewportOnPan(): void {
    if (!this.virtualizationEnabled) return;
    
    this.virtualizationService.scheduleUpdate(() => {
      this.virtualizationService.updateViewport({
        width: this.canvasViewport?.nativeElement?.offsetWidth || 0,
        height: this.canvasViewport?.nativeElement?.offsetHeight || 0,
        scrollX: this.panPosition.x,
        scrollY: this.panPosition.y,
        zoomLevel: this.zoomLevel
      });
      
      this.updateVirtualNodes();
    });
  }
  
  // Virtualization Public API
  getVirtualNodes(): VirtualNode[] {
    return this.virtualizationEnabled ? this.visibleNodes : this.nodes as VirtualNode[];
  }
  
  getVisibleNodes(): VirtualNode[] {
    return this.visibleNodes;
  }
  
  getPerformanceMetrics(): PerformanceMetrics {
    return this.performanceMetrics;
  }
  
  isVirtualizationEnabled(): boolean {
    return this.virtualizationEnabled;
  }
  
  setVirtualizationEnabled(enabled: boolean): void {
    this.virtualizationEnabled = enabled;
    this.updateVirtualNodes();
  }
  
  getPerformanceRecommendations(): string[] {
    return this.virtualizationService.getPerformanceRecommendations();
  }
  
  // Enhanced Connection Caching with Virtualization
  getCachedConnection(connectionId: string): any {
    return this.virtualizationService.getCachedConnection(connectionId);
  }
  
  cacheConnection(connectionId: string, data: any): void {
    this.virtualizationService.cacheConnection(connectionId, data);
  }
  
  clearConnectionCache(): void {
    this.virtualizationService.clearConnectionCache();
  }
  
  // Viewport-based Connection Filtering
  getVisibleConnectionsVirtualized(): TechConnection[] {
    if (!this.config.enableConnections) return [];
    
    // Filter connections based on visible nodes
    const visibleNodeIds = new Set(this.visibleNodes.map(node => node.id));
    
    return this.connections.filter(connection => {
      // Only show connections between visible nodes
      return visibleNodeIds.has(connection.fromNodeId) && visibleNodeIds.has(connection.toNodeId);
    });
  }
  
  shouldRenderConnectionVirtualized(connection: TechConnection): boolean {
    // Only render connections for visible nodes
    const visibleNodeIds = new Set(this.visibleNodes.map(node => node.id));
    return visibleNodeIds.has(connection.fromNodeId) && visibleNodeIds.has(connection.toNodeId);
  }
}