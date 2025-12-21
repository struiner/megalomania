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
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { TechTreeVirtualizationService, VirtualNode } from './tech-tree-virtualization.service';

/**
 * Virtual scroll configuration
 */
export interface VirtualScrollConfig {
  /** Item height in pixels */
  itemHeight: number;
  /** Number of items to render outside viewport (buffer) */
  bufferSize: number;
  /** Scroll debounce time in milliseconds */
  scrollDebounce: number;
  /** Enable smooth scrolling */
  smoothScroll: boolean;
}

/**
 * Virtual scroll event
 */
export interface VirtualScrollEvent {
  startIndex: number;
  endIndex: number;
  scrollTop: number;
  viewportHeight: number;
}

/**
 * Virtual Scroll Component
 * Efficiently renders large lists by only displaying visible items
 */
@Component({
  selector: 'app-virtual-scroll',
  template: `
    <div 
      #viewport
      class="virtual-scroll-viewport"
      [style.height.px]="viewportHeight"
      (scroll)="onScroll()"
      [attr.aria-label]="ariaLabel"
      [attr.role]="role"
    >
      <!-- Spacer to maintain scroll height -->
      <div 
        class="virtual-scroll-spacer"
        [style.height.px]="totalHeight"
      ></div>
      
      <!-- Visible items container -->
      <div 
        class="virtual-scroll-content"
        [style.transform]="'translateY(' + scrollOffset + 'px)'"
      >
        <ng-container *ngFor="let item of visibleItems; trackBy: trackByFn; let i = index">
          <div 
            class="virtual-scroll-item"
            [style.height.px]="config.itemHeight"
            [attr.data-index]="startIndex + i"
          >
            <ng-content 
              [select]="itemTemplate" 
              [ngTemplateOutlet]="itemTemplate"
              [ngTemplateOutletContext]="{
                item: item,
                index: startIndex + i,
                isEven: (startIndex + i) % 2 === 0,
                isOdd: (startIndex + i) % 2 === 1
              }"
            ></ng-content>
          </div>
        </ng-container>
      </div>
      
      <!-- Performance indicator (development only) -->
      <div 
        *ngIf="showPerformanceIndicator" 
        class="virtual-scroll-performance"
      >
        <span>Items: {{ items.length }} | Visible: {{ visibleItems.length }} | FPS: {{ performanceMetrics.frameRate }}</span>
      </div>
    </div>
  `,
  styleUrls: ['./virtual-scroll.component.scss']
})
export class VirtualScrollComponent implements OnInit, OnDestroy, OnChanges {
  @Input() items: any[] = [];
  @Input() config: VirtualScrollConfig = {
    itemHeight: 80,
    bufferSize: 5,
    scrollDebounce: 16,
    smoothScroll: true
  };
  @Input() trackByFn: (index: number, item: any) => any = (index: number, item: any) => item.id || index;
  @Input() ariaLabel = 'Virtual scroll list';
  @Input() role = 'list';
  @Input() showPerformanceIndicator = false;

  @Output() scrolled = new EventEmitter<VirtualScrollEvent>();
  @Output() itemClicked = new EventEmitter<{ item: any; index: number }>();

  @ViewChild('viewport', { static: true }) viewport!: ElementRef<HTMLDivElement>;

  // Viewport state
  viewportHeight = 0;
  scrollTop = 0;
  totalHeight = 0;
  scrollOffset = 0;
  startIndex = 0;
  endIndex = 0;
  visibleItems: any[] = [];

  // Performance monitoring
  performanceMetrics = {
    frameRate: 60,
    renderTime: 0,
    lastUpdate: performance.now()
  };

  private scrollSubject = new Subject<number>();
  private destroy$ = new Subject<void>();
  private resizeObserver?: ResizeObserver;

  constructor(
    private cdr: ChangeDetectorRef,
    private virtualizationService: TechTreeVirtualizationService
  ) {}

  ngOnInit(): void {
    this.initializeViewport();
    this.setupScrollHandling();
    this.setupResizeHandling();
    this.updateVisibleItems();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.resizeObserver?.disconnect();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] || changes['config']) {
      this.updateMetrics();
      this.updateVisibleItems();
    }
  }

  /**
   * Scroll to specific index
   */
  scrollToIndex(index: number, behavior: ScrollBehavior = 'auto'): void {
    if (index < 0 || index >= this.items.length) {
      return;
    }

    const scrollTop = index * this.config.itemHeight;
    this.viewport.nativeElement.scrollTo({
      top: scrollTop,
      behavior: this.config.smoothScroll ? 'smooth' : 'auto'
    });
  }

  /**
   * Scroll to item by value
   */
  scrollToItem(item: any, behavior: ScrollBehavior = 'auto'): void {
    const index = this.items.findIndex(i => i === item || i.id === item?.id);
    if (index !== -1) {
      this.scrollToIndex(index, behavior);
    }
  }

  /**
   * Get current scroll metrics
   */
  getScrollMetrics(): VirtualScrollEvent {
    return {
      startIndex: this.startIndex,
      endIndex: this.endIndex,
      scrollTop: this.scrollTop,
      viewportHeight: this.viewportHeight
    };
  }

  /**
   * Refresh the component
   */
  refresh(): void {
    this.updateMetrics();
    this.updateVisibleItems();
    this.cdr.detectChanges();
  }

  /**
   * Private methods
   */
  
  private initializeViewport(): void {
    this.updateMetrics();
  }

  private setupScrollHandling(): void {
    this.scrollSubject.pipe(
      debounceTime(this.config.scrollDebounce),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.updateVisibleItems();
      this.emitScrollEvent();
    });
  }

  private setupResizeHandling(): void {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.onViewportResize();
      });
      this.resizeObserver.observe(this.viewport.nativeElement);
    } else {
      // Fallback for browsers without ResizeObserver
      window.addEventListener('resize', () => this.onViewportResize());
    }
  }

  private onScroll(): void {
    this.scrollTop = this.viewport.nativeElement.scrollTop;
    this.scrollSubject.next(this.scrollTop);
  }

  private onViewportResize(): void {
    this.updateMetrics();
    this.updateVisibleItems();
  }

  private updateMetrics(): void {
    const rect = this.viewport.nativeElement.getBoundingClientRect();
    this.viewportHeight = rect.height;
    this.totalHeight = this.items.length * this.config.itemHeight;
    
    // Update virtualization service
    this.virtualizationService.updateViewport({
      width: this.viewportHeight,
      height: this.viewportHeight,
      scrollX: 0,
      scrollY: this.scrollTop,
      zoomLevel: 1.0
    });
  }

  private updateVisibleItems(): void {
    const renderStartTime = performance.now();
    
    // Calculate visible range
    const buffer = this.config.bufferSize;
    const start = Math.max(0, Math.floor(this.scrollTop / this.config.itemHeight) - buffer);
    const end = Math.min(
      this.items.length,
      Math.ceil((this.scrollTop + this.viewportHeight) / this.config.itemHeight) + buffer
    );

    this.startIndex = start;
    this.endIndex = end;
    this.visibleItems = this.items.slice(start, end);
    this.scrollOffset = start * this.config.itemHeight;

    // Update performance metrics
    const renderTime = performance.now() - renderStartTime;
    this.performanceMetrics.renderTime = renderTime;
    this.performanceMetrics.lastUpdate = performance.now();

    // Trigger change detection
    this.cdr.detectChanges();
  }

  private emitScrollEvent(): void {
    const event: VirtualScrollEvent = {
      startIndex: this.startIndex,
      endIndex: this.endIndex,
      scrollTop: this.scrollTop,
      viewportHeight: this.viewportHeight
    };
    
    this.scrolled.emit(event);
  }

  /**
   * Template helper method for tracking
   */
  trackByIndex(index: number): number {
    return index;
  }

  trackById(index: number, item: any): any {
    return item?.id || index;
  }
}

/**
 * Virtual Scroll Item Template Directive
 * Allows custom template for scroll items
 */
import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appVirtualScrollItem]'
})
export class VirtualScrollItemDirective {
  constructor(public template: TemplateRef<any>) {}
}

/**
 * Virtual Scroll Performance Monitor
 * Displays performance metrics for debugging
 */
@Component({
  selector: 'app-virtual-scroll-performance',
  template: `
    <div class="virtual-scroll-performance-monitor" *ngIf="isVisible">
      <div class="performance-metric">
        <span class="metric-label">Frame Rate:</span>
        <span class="metric-value">{{ frameRate }} fps</span>
      </div>
      <div class="performance-metric">
        <span class="metric-label">Render Time:</span>
        <span class="metric-value">{{ renderTime.toFixed(2) }} ms</span>
      </div>
      <div class="performance-metric">
        <span class="metric-label">Visible Items:</span>
        <span class="metric-value">{{ visibleCount }}</span>
      </div>
      <div class="performance-metric">
        <span class="metric-label">Total Items:</span>
        <span class="metric-value">{{ totalCount }}</span>
      </div>
    </div>
  `,
  styles: [`
    .virtual-scroll-performance-monitor {
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 12px;
      z-index: 1000;
      pointer-events: none;
    }
    
    .performance-metric {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
    }
    
    .performance-metric:last-child {
      margin-bottom: 0;
    }
    
    .metric-label {
      color: #ccc;
      margin-right: 8px;
    }
    
    .metric-value {
      font-weight: bold;
    }
  `]
})
export class VirtualScrollPerformanceComponent implements OnInit, OnDestroy {
  @Input() isVisible = false;
  @Input() frameRate = 60;
  @Input() renderTime = 0;
  @Input() visibleCount = 0;
  @Input() totalCount = 0;

  private updateInterval?: number;

  ngOnInit(): void {
    if (this.isVisible) {
      this.startMonitoring();
    }
  }

  ngOnDestroy(): void {
    this.stopMonitoring();
  }

  ngOnChanges(): void {
    if (this.isVisible) {
      this.startMonitoring();
    } else {
      this.stopMonitoring();
    }
  }

  private startMonitoring(): void {
    this.updateInterval = window.setInterval(() => {
      // Performance monitoring logic can be added here
    }, 1000);
  }

  private stopMonitoring(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = undefined;
    }
  }
}