import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  OnInit, 
  OnDestroy, 
  OnChanges, 
  SimpleChanges
} from '@angular/core';
import { PerformanceMetrics } from './tech-tree-virtualization.service';

/**
 * Performance Monitor Component
 * Displays real-time performance metrics and recommendations
 */
@Component({
  selector: 'app-performance-monitor',
  template: `
    <div 
      class="performance-monitor"
      [class.expanded]="isExpanded"
      [class.performance-warning]="hasPerformanceIssues"
      [class.performance-good]="!hasPerformanceIssues"
    >
      <!-- Monitor Header -->
      <div class="monitor-header" (click)="toggleExpanded()">
        <div class="monitor-title">
          <span class="title-text">Performance Monitor</span>
          <span class="status-indicator" [class.good]="!hasPerformanceIssues" [class.warning]="hasPerformanceIssues"></span>
        </div>
        <div class="expand-icon" [class.expanded]="isExpanded">▼</div>
      </div>
      
      <!-- Expanded Content -->
      <div class="monitor-content" *ngIf="isExpanded">
        <!-- Real-time Metrics -->
        <div class="metrics-section">
          <h4 class="section-title">Real-time Metrics</h4>
          <div class="metrics-grid">
            <div class="metric-item">
              <div class="metric-label">Frame Rate</div>
              <div class="metric-value" [class.warning]="performanceMetrics.frameRate < 30" [class.critical]="performanceMetrics.frameRate < 15">
                {{ performanceMetrics.frameRate }} fps
              </div>
            </div>
            
            <div class="metric-item">
              <div class="metric-label">Render Time</div>
              <div class="metric-value" [class.warning]="performanceMetrics.renderTime > 16" [class.critical]="performanceMetrics.renderTime > 33">
                {{ performanceMetrics.renderTime.toFixed(2) }} ms
              </div>
            </div>
            
            <div class="metric-item">
              <div class="metric-label">Total Nodes</div>
              <div class="metric-value">
                {{ performanceMetrics.nodeCount }}
              </div>
            </div>
            
            <div class="metric-item">
              <div class="metric-label">Visible Nodes</div>
              <div class="metric-value">
                {{ performanceMetrics.visibleNodeCount }}
              </div>
            </div>
            
            <div class="metric-item">
              <div class="metric-label">Virtualization Ratio</div>
              <div class="metric-value">
                {{ getVirtualizationRatio() }}%
              </div>
            </div>
            
            <div class="metric-item" *ngIf="performanceMetrics.memoryUsage">
              <div class="metric-label">Memory Usage</div>
              <div class="metric-value">
                {{ (performanceMetrics.memoryUsage / 1024 / 1024).toFixed(1) }} MB
              </div>
            </div>
          </div>
        </div>
        
        <!-- Performance Recommendations -->
        <div class="recommendations-section" *ngIf="recommendations.length > 0">
          <h4 class="section-title">Recommendations</h4>
          <div class="recommendations-list">
            <div 
              *ngFor="let recommendation of recommendations; trackBy: trackByRecommendation" 
              class="recommendation-item"
              [class.critical]="recommendation.includes('critical') || recommendation.includes('severe')"
              [class.warning]="recommendation.includes('consider') || recommendation.includes('should')"
            >
              <div class="recommendation-icon">⚠</div>
              <div class="recommendation-text">{{ recommendation }}</div>
            </div>
          </div>
        </div>
        
        <!-- Performance History -->
        <div class="history-section" *ngIf="performanceHistory.length > 0">
          <h4 class="section-title">Performance History</h4>
          <div class="history-chart">
            <div 
              *ngFor="let point of performanceHistory; trackBy: trackByHistoryPoint" 
              class="history-point"
              [style.left.%]="(point.timestamp - performanceHistory[0].timestamp) / (performanceHistory[performanceHistory.length - 1].timestamp - performanceHistory[0].timestamp) * 100"
              [style.bottom.%]="Math.min(point.frameRate / 60 * 100, 100)"
              [title]="'Frame Rate: ' + point.frameRate + ' fps at ' + (point.timestamp / 1000).toFixed(1) + 's'"
            ></div>
          </div>
        </div>
        
        <!-- Controls -->
        <div class="controls-section">
          <div class="control-group">
            <label class="control-label">
              <input 
                type="checkbox" 
                [checked]="autoHide" 
                (change)="onAutoHideChange($event)"
                class="control-checkbox"
              >
              Auto-hide when good performance
            </label>
          </div>
          
          <div class="control-group">
            <label class="control-label">
              <input 
                type="checkbox" 
                [checked]="showHistory" 
                (change)="onShowHistoryChange($event)"
                class="control-checkbox"
              >
              Show performance history
            </label>
          </div>
          
          <div class="control-group">
            <button 
              class="control-button reset-button" 
              (click)="resetMetrics()"
            >
              Reset Metrics
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./performance-monitor.component.scss']
})
export class PerformanceMonitorComponent implements OnInit, OnDestroy, OnChanges {
  @Input() performanceMetrics: PerformanceMetrics = {
    renderTime: 0,
    nodeCount: 0,
    visibleNodeCount: 0,
    connectionCount: 0,
    frameRate: 60,
    lastUpdate: performance.now()
  };
  @Input() recommendations: string[] = [];
  @Input() isVisible = true;
  @Input() autoHide = true;
  @Input() showHistory = false;
  
  @Output() metricsReset = new EventEmitter<void>();
  @Output() visibilityChanged = new EventEmitter<boolean>();
  
  isExpanded = false;
  hasPerformanceIssues = false;
  performanceHistory: Array<{ timestamp: number; frameRate: number; renderTime: number }> = [];
  private historyLimit = 50;
  private updateInterval?: number;
  private readonly GOOD_PERFORMANCE_THRESHOLD = {
    frameRate: 30,
    renderTime: 16
  };
  
  constructor() {}
  
  ngOnInit(): void {
    this.startPerformanceTracking();
  }
  
  ngOnDestroy(): void {
    this.stopPerformanceTracking();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['performanceMetrics'] && !changes['performanceMetrics'].firstChange) {
      this.updatePerformanceIssues();
      this.addToHistory();
    }
    
    if (changes['autoHide']) {
      this.updateVisibility();
    }
  }
  
  private startPerformanceTracking(): void {
    this.updateInterval = window.setInterval(() => {
      this.addToHistory();
      this.updatePerformanceIssues();
      this.updateVisibility();
    }, 1000);
  }
  
  private stopPerformanceTracking(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = undefined;
    }
  }
  
  private updatePerformanceIssues(): void {
    this.hasPerformanceIssues = 
      this.performanceMetrics.frameRate < this.GOOD_PERFORMANCE_THRESHOLD.frameRate ||
      this.performanceMetrics.renderTime > this.GOOD_PERFORMANCE_THRESHOLD.renderTime;
  }
  
  private updateVisibility(): void {
    if (this.autoHide && !this.hasPerformanceIssues && !this.isExpanded) {
      // Auto-hide when performance is good and not expanded
      // This would be controlled by parent component
    }
  }
  
  private addToHistory(): void {
    const now = performance.now();
    const newPoint = {
      timestamp: now,
      frameRate: this.performanceMetrics.frameRate,
      renderTime: this.performanceMetrics.renderTime
    };
    
    this.performanceHistory.push(newPoint);
    
    // Limit history size
    if (this.performanceHistory.length > this.historyLimit) {
      this.performanceHistory = this.performanceHistory.slice(-this.historyLimit);
    }
  }
  
  toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
    this.visibilityChanged.emit(this.isExpanded);
  }
  
  getVirtualizationRatio(): number {
    if (this.performanceMetrics.nodeCount === 0) return 0;
    return Math.round((1 - this.performanceMetrics.visibleNodeCount / this.performanceMetrics.nodeCount) * 100);
  }
  
  onAutoHideChange(event: Event): void {
    this.autoHide = (event.target as HTMLInputElement).checked;
  }
  
  onShowHistoryChange(event: Event): void {
    this.showHistory = (event.target as HTMLInputElement).checked;
  }
  
  resetMetrics(): void {
    this.performanceHistory = [];
    this.metricsReset.emit();
  }
  
  trackByRecommendation(index: number, recommendation: string): string {
    return recommendation;
  }
  
  trackByHistoryPoint(index: number, point: any): number {
    return point.timestamp;
  }
}