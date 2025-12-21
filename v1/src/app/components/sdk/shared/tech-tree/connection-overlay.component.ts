import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  OnInit, 
  OnDestroy, 
  OnChanges, 
  SimpleChanges,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import { TechConnection } from './tech-tree-canvas.component';
import { VirtualNode } from './tech-tree-virtualization.service';

/**
 * Connection Overlay Component
 * Virtualized rendering of tech tree connections for performance
 */
@Component({
  selector: 'app-connection-overlay',
  template: `
    <svg
      #connectionSvg
      class="connection-overlay"
      [attr.width]="svgWidth"
      [attr.height]="svgHeight"
      [attr.viewBox]="viewBox"
      [attr.preserveAspectRatio]="'xMidYMid meet'"
    >
      <defs>
        <!-- Arrow markers for different connection types -->
        <marker
          id="arrowhead-active"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            [attr.fill]="connectionColors.active"
          />
        </marker>
        
        <marker
          id="arrowhead-satisfied"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            [attr.fill]="connectionColors.satisfied"
          />
        </marker>
        
        <marker
          id="arrowhead-unsatisfied"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            [attr.fill]="connectionColors.unsatisfied"
          />
        </marker>
        
        <marker
          id="arrowhead-highlighted"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            [attr.fill]="connectionColors.highlighted"
          />
        </marker>
        
        <!-- Connection path gradients -->
        <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" [attr.stop-color]="connectionColors.satisfied" stop-opacity="0.8"/>
          <stop offset="100%" [attr.stop-color]="connectionColors.active" stop-opacity="0.8"/>
        </linearGradient>
      </defs>
      
      <!-- Render only visible connections -->
      <g class="connections-group">
        <path
          *ngFor="let connection of visibleConnections; trackBy: trackByConnectionId"
          class="connection-path"
          [attr.d]="connection.path"
          [attr.marker-end]="getArrowMarker(connection)"
          [style]="getConnectionStyle(connection)"
          (mouseenter)="onConnectionMouseEnter(connection)"
          (mouseleave)="onConnectionMouseLeave(connection)"
        />
      </g>
      
      <!-- Performance indicator (development only) -->
      <g class="performance-info" *ngIf="showPerformanceInfo">
        <rect
          x="10"
          y="10"
          width="120"
          height="60"
          fill="rgba(0, 0, 0, 0.8)"
          rx="4"
        />
        <text
          x="20"
          y="25"
          fill="white"
          font-family="monospace"
          font-size="12"
        >
          Connections: {{ connections.length }}
        </text>
        <text
          x="20"
          y="40"
          fill="white"
          font-family="monospace"
          font-size="12"
        >
          Visible: {{ visibleConnections.length }}
        </text>
        <text
          x="20"
          y="55"
          fill="white"
          font-family="monospace"
          font-size="12"
        >
          Render: {{ renderTime.toFixed(1) }}ms
        </text>
      </g>
    </svg>
  `,
  styleUrls: ['./connection-overlay.component.scss']
})
export class ConnectionOverlayComponent implements OnInit, OnDestroy, OnChanges {
  @Input() connections: TechConnection[] = [];
  @Input() visibleNodes: VirtualNode[] = [];
  @Input() zoomLevel = 1.0;
  @Input() panPosition = { x: 0, y: 0 };
  @Input() svgWidth = 1000;
  @Input() svgHeight = 800;
  @Input() viewBox = '0 0 1000 800';
  @Input() connectionColors = {
    active: '#4CAF50',
    satisfied: '#2196F3', 
    unsatisfied: '#FF9800',
    highlighted: '#E91E63'
  };
  @Input() showPerformanceInfo = false;
  
  @Output() connectionHighlighted = new EventEmitter<TechConnection>();
  @Output() connectionUnhighlighted = new EventEmitter<void>();
  
  @ViewChild('connectionSvg', { static: true }) connectionSvg!: ElementRef<SVGElement>;
  
  visibleConnections: TechConnection[] = [];
  renderTime = 0;
  private visibleNodeIds = new Set<string>();
  
  constructor(private cdr: ChangeDetectorRef) {}
  
  ngOnInit(): void {
    this.updateVisibleConnections();
  }
  
  ngOnDestroy(): void {}
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['connections'] || changes['visibleNodes'] || changes['zoomLevel'] || changes['panPosition']) {
      this.updateVisibleConnections();
    }
  }
  
  private updateVisibleConnections(): void {
    const startTime = performance.now();
    
    // Update visible node IDs for quick lookup
    this.visibleNodeIds = new Set(this.visibleNodes.map(node => node.id));
    
    // Filter connections to only show those between visible nodes
    this.visibleConnections = this.connections.filter(connection => {
      return this.visibleNodeIds.has(connection.fromNodeId) && 
             this.visibleNodeIds.has(connection.toNodeId);
    });
    
    // Sort connections by priority for better rendering
    this.visibleConnections.sort((a, b) => {
      // Highlighted connections first
      if (a.id.includes('highlighted') && !b.id.includes('highlighted')) return -1;
      if (!a.id.includes('highlighted') && b.id.includes('highlighted')) return 1;
      
      // Active connections second
      if (a.isActive && !b.isActive) return -1;
      if (!a.isActive && b.isActive) return 1;
      
      // Satisfied connections third
      if (a.isSatisfied && !b.isSatisfied) return -1;
      if (!a.isSatisfied && b.isSatisfied) return 1;
      
      return 0;
    });
    
    // Calculate render time for performance monitoring
    this.renderTime = performance.now() - startTime;
    
    // Trigger change detection
    this.cdr.detectChanges();
  }
  
  getConnectionStyle(connection: TechConnection): any {
    let color = this.connectionColors.satisfied;
    let strokeWidth = this.getStrokeWidth(connection.complexity);
    let opacity = this.getConnectionOpacity(connection);
    let strokeDasharray = 'none';
    
    // Determine color based on connection state
    if (connection.id.includes('highlighted')) {
      color = this.connectionColors.highlighted;
      strokeWidth *= 1.5; // Make highlighted connections thicker
      opacity = 1.0;
    } else if (connection.isActive) {
      color = this.connectionColors.active;
      opacity = 0.9;
    } else if (connection.isSatisfied) {
      color = this.connectionColors.satisfied;
      opacity = 0.7;
    } else {
      color = this.connectionColors.unsatisfied;
      opacity = 0.5;
      strokeDasharray = '5,5'; // Dashed lines for unsatisfied connections
    }
    
    return {
      'stroke': color,
      'stroke-width': strokeWidth,
      'fill': 'none',
      'opacity': opacity,
      'stroke-dasharray': strokeDasharray,
      'vector-effect': 'non-scaling-stroke', // Keep stroke width consistent during zoom
      'transition': 'all 0.15s ease-in-out'
    };
  }
  
  private getStrokeWidth(complexity: 'simple' | 'routed' | 'full'): number {
    const baseWidth = 2;
    const zoomMultiplier = Math.max(0.5, Math.min(2.0, this.zoomLevel));
    
    switch (complexity) {
      case 'simple': return baseWidth * 0.5 * zoomMultiplier;
      case 'routed': return baseWidth * zoomMultiplier;
      case 'full': return baseWidth * 1.5 * zoomMultiplier;
      default: return baseWidth * zoomMultiplier;
    }
  }
  
  private getConnectionOpacity(connection: TechConnection): number {
    // Reduce opacity for connections at extreme zoom levels for better performance
    if (this.zoomLevel < 0.3) {
      return 0.3;
    } else if (this.zoomLevel > 2.0) {
      return 0.8;
    }
    return 0.7;
  }
  
  getArrowMarker(connection: TechConnection): string | null {
    // Only show arrows for high-detail connections
    if (connection.complexity === 'simple' && this.zoomLevel < 0.8) {
      return null;
    }
    
    if (connection.id.includes('highlighted')) {
      return 'url(#arrowhead-highlighted)';
    } else if (connection.isActive) {
      return 'url(#arrowhead-active)';
    } else if (connection.isSatisfied) {
      return 'url(#arrowhead-satisfied)';
    } else {
      return 'url(#arrowhead-unsatisfied)';
    }
  }
  
  onConnectionMouseEnter(connection: TechConnection): void {
    this.connectionHighlighted.emit(connection);
  }
  
  onConnectionMouseLeave(): void {
    this.connectionUnhighlighted.emit();
  }
  
  trackByConnectionId(index: number, connection: TechConnection): string {
    return connection.id;
  }
  
  // Performance monitoring methods
  getPerformanceMetrics(): { total: number; visible: number; renderTime: number } {
    return {
      total: this.connections.length,
      visible: this.visibleConnections.length,
      renderTime: this.renderTime
    };
  }
}