import { 
  Component, 
  OnInit, 
  OnDestroy, 
  ViewChild, 
  ElementRef, 
  ChangeDetectorRef,
  AfterViewInit,
  Input
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, combineLatest, Subscription } from 'rxjs';
import { TechTreeStateService, TechTreeEditorState } from './tech-tree-state.service';
import { TechNode } from './tech-node.interface';
import { TechTreeCanvasComponent, TechTreeCanvasConfig } from './tech-tree-canvas.component';
import { TechTreePreviewDialogComponent, TechTreePreviewData } from './tech-tree-preview-dialog.component';
import { NodeDetailPanelComponent } from '../examples/tech-editor-example/node-detail-panel/node-detail-panel.component';
import { SdkPanelComponent } from '../sdk-panel/sdk-panel.component';
import { MatDialog } from '@angular/material/dialog';

/**
 * Interface for Integration Configuration
 */
export interface TechTreeIntegrationConfig {
  enableAutoSave: boolean;
  enableRealTimeSync: boolean;
  enableStatePersistence: boolean;
  enableValidation: boolean;
  enableErrorRecovery: boolean;
  debounceMs: number;
  validationIntervalMs: number;
}

/**
 * Interface for Workflow Status
 */
export interface WorkflowStatus {
  isLoading: boolean;
  hasUnsavedChanges: boolean;
  lastSaved: Date | null;
  validationErrors: number;
  validationWarnings: number;
  syncStatus: 'synchronized' | 'desynchronized' | 'recovering';
}

/**
 * Integration wrapper component that orchestrates all tech tree components
 * Provides seamless state synchronization and workflow management
 */
@Component({
  selector: 'app-tech-tree-integration',
  template: `
    <div class="tech-tree-integration" [class.tech-tree-integration--fullscreen]="isFullscreen">
      
      <!-- Header with workflow status -->
      <div class="integration-header" *ngIf="showHeader">
        <div class="header-left">
          <h2 class="integration-title">{{ title }}</h2>
          <p class="integration-subtitle" *ngIf="subtitle">{{ subtitle }}</p>
        </div>
        
        <div class="header-center">
          <div class="workflow-status" [class.workflow-status--dirty]="workflowStatus.hasUnsavedChanges">
            <div class="status-indicator" 
                 [class.status-indicator--loading]="workflowStatus.isLoading"
                 [class.status-indicator--dirty]="workflowStatus.hasUnsavedChanges"
                 [class.status-indicator--error]="workflowStatus.validationErrors > 0">
            </div>
            <span class="status-text">{{ getStatusText() }}</span>
          </div>
        </div>
        
        <div class="header-right">
          <button class="integration-btn integration-btn--secondary" 
                  (click)="openPreview()"
                  [disabled]="nodes.length === 0">
            <span class="btn-icon">👁️</span>
            Preview
          </button>
          
          <button class="integration-btn integration-btn--primary" 
                  (click)="saveTree()"
                  [disabled]="!workflowStatus.hasUnsavedChanges || workflowStatus.isLoading">
            <span class="btn-icon">💾</span>
            Save
          </button>
        </div>
      </div>
      
      <!-- Main editor layout -->
      <div class="integration-content" [class.integration-content--fullscreen]="isFullscreen">
        
        <!-- Canvas section -->
        <div class="canvas-section" [class.canvas-section--expanded]="detailPanelCollapsed">
          <app-tech-tree-canvas
            #canvas
            [nodes]="nodes"
            [config]="canvasConfig"
            [accessibilityConfig]="accessibilityConfig"
            (nodeSelected)="onNodeSelected($event)"
            (nodeFocused)="onNodeFocused($event)"
            (zoomChanged)="onZoomChanged($event)"
            (panChanged)="onPanChanged($event)"
            (nodeUpdated)="onNodeUpdatedFromCanvas($event)"
            (structuralChangeRequested)="onStructuralChangeRequested($event)">
          </app-tech-tree-canvas>
        </div>
        
        <!-- Detail panel section -->
        <div class="detail-section" 
             [class.detail-section--collapsed]="detailPanelCollapsed"
             *ngIf="detailPanelVisible">
          
          <app-sdk-panel 
            [title]="getDetailPanelTitle()"
            [compact]="detailPanelCollapsed">
            
            <div slot="actions">
              <button class="panel-btn panel-btn--collapse" 
                      (click)="toggleDetailPanel()"
                      [attr.aria-label]="detailPanelCollapsed ? 'Expand detail panel' : 'Collapse detail panel'">
                {{ detailPanelCollapsed ? '↗' : '↙' }}
              </button>
            </div>
            
            <!-- Detail panel content -->
            <div class="detail-content" [class.detail-content--collapsed]="detailPanelCollapsed">
              
              <!-- Validation summary -->
              <div class="validation-summary" 
                   *ngIf="workflowStatus.validationErrors > 0 || workflowStatus.validationWarnings > 0"
                   [class.validation-summary--errors]="workflowStatus.validationErrors > 0"
                   [class.validation-summary--warnings]="workflowStatus.validationWarnings > 0">
                <div class="validation-icon">
                  {{ workflowStatus.validationErrors > 0 ? '⚠️' : 'ℹ️' }}
                </div>
                <div class="validation-text">
                  <span *ngIf="workflowStatus.validationErrors > 0">
                    {{ workflowStatus.validationErrors }} error{{ workflowStatus.validationErrors > 1 ? 's' : '' }}
                  </span>
                  <span *ngIf="workflowStatus.validationWarnings > 0">
                    {{ workflowStatus.validationWarnings }} warning{{ workflowStatus.validationWarnings > 1 ? 's' : '' }}
                  </span>
                </div>
                <button class="validation-action" (click)="showValidationDetails()">
                  View Details
                </button>
              </div>
              
              <!-- Node detail panel -->
              <app-node-detail-panel
                *ngIf="selectedNode"
                [selectedNode]="selectedNode"
                [isVisible]="true"
                [allNodes]="nodes"
                [cultureTagOptions]="cultureTagOptions"
                [defaultCultureTags]="defaultCultureTags"
                (nodeUpdated)="onNodeUpdatedFromDetailPanel($event)">
              </app-node-detail-panel>
              
              <!-- Empty state -->
              <div class="empty-state" *ngIf="!selectedNode">
                <div class="empty-icon">🎯</div>
                <h3>No Node Selected</h3>
                <p>Select a node from the canvas to view and edit its properties</p>
              </div>
            </div>
          </app-sdk-panel>
        </div>
        
        <!-- Toggle detail panel button (when collapsed) -->
        <button class="detail-toggle-btn" 
                *ngIf="!detailPanelVisible"
                (click)="toggleDetailPanel()"
                aria-label="Show detail panel">
          ▶
        </button>
      </div>
      
      <!-- Status bar -->
      <div class="integration-footer" *ngIf="showFooter">
        <div class="status-bar-left">
          <span class="status-item">
            Nodes: <strong>{{ nodes.length }}</strong>
          </span>
          <span class="status-item">
            Selected: <strong>{{ selectedNode?.name || 'None' }}</strong>
          </span>
          <span class="status-item">
            Zoom: <strong>{{ canvasState?.zoomLevel | number:'1.1-1' }}x</strong>
          </span>
        </div>
        
        <div class="status-bar-center">
          <div class="sync-status" 
               [class.sync-status--synchronized]="workflowStatus.syncStatus === 'synchronized'"
               [class.sync-status--desynchronized]="workflowStatus.syncStatus === 'desynchronized'"
               [class.sync-status--recovering]="workflowStatus.syncStatus === 'recovering'">
            <div class="sync-indicator"></div>
            <span class="sync-text">{{ getSyncStatusText() }}</span>
          </div>
        </div>
        
        <div class="status-bar-right">
          <span class="status-item" *ngIf="workflowStatus.lastSaved">
            Last saved: <strong>{{ workflowStatus.lastSaved | date:'short' }}</strong>
          </span>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./tech-tree-integration.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TechTreeCanvasComponent,
    TechTreePreviewDialogComponent,
    NodeDetailPanelComponent,
    SdkPanelComponent
  ]
})
export class TechTreeIntegrationComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('canvas') canvasComponent?: TechTreeCanvasComponent;
  
  // Component inputs
  @Input() initialNodes: TechNode[] = [];
  @Input() title = 'Technology Tree Editor';
  @Input() subtitle?: string;
  @Input() config: TechTreeIntegrationConfig = {
    enableAutoSave: true,
    enableRealTimeSync: true,
    enableStatePersistence: true,
    enableValidation: true,
    enableErrorRecovery: true,
    debounceMs: 300,
    validationIntervalMs: 2000
  };
  @Input() showHeader = true;
  @Input() showFooter = true;
  @Input() defaultDetailPanelVisible = true;
  
  // Component state
  nodes: TechNode[] = [];
  selectedNode: TechNode | null = null;
  focusedNode: TechNode | null = null;
  canvasState = { zoomLevel: 1.0, panPosition: { x: 0, y: 0 }, isPanning: false };
  detailPanelVisible = true;
  detailPanelCollapsed = false;
  isFullscreen = false;
  workflowStatus: WorkflowStatus = {
    isLoading: false,
    hasUnsavedChanges: false,
    lastSaved: null,
    validationErrors: 0,
    validationWarnings: 0,
    syncStatus: 'synchronized'
  };
  
  // Configuration
  canvasConfig: TechTreeCanvasConfig = {
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
    enableConnections: true,
    connectionCacheTimeout: 5000,
    maxConnectionsVisible: 500,
    connectionDetailThresholds: {
      simple: 0.5,
      routed: 1.0,
      full: 1.5
    },
    connectionColors: {
      active: '#4CAF50',
      satisfied: '#2196F3',
      unsatisfied: '#FF9800',
      highlighted: '#E91E63'
    },
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
    dragDropColors: {
      dragPreview: 'rgba(33, 150, 243, 0.7)',
      validDropZone: 'rgba(76, 175, 80, 0.3)',
      invalidDropZone: 'rgba(244, 67, 54, 0.3)',
      snapIndicator: '#FF9800',
      structuralChangeWarning: '#FF5722'
    }
  };
  
  accessibilityConfig = {
    enableKeyboardNavigation: true,
    enableScreenReaderSupport: true,
    enableFocusManagement: true,
    enableKeyboardShortcuts: true,
    announcementsDelay: 100,
    focusVisibleTimeout: 3000
  };
  
  // Mock data for culture tags (in real implementation, this would come from a service)
  cultureTagOptions = [
    { id: 'biome_forest', label: 'Forest', source: 'biome' },
    { id: 'biome_mountain', label: 'Mountain', source: 'biome' },
    { id: 'settlement_coastal', label: 'Coastal', source: 'settlement' },
    { id: 'guild_metalworkers', label: 'Metalworkers', source: 'guild' }
  ];
  
  defaultCultureTags: string[] = [];
  
  private destroy$ = new Subject<void>();
  private subscriptions: Subscription[] = [];
  private autoSaveTimeout?: any;
  private validationTimeout?: any;
  
  constructor(
    private stateService: TechTreeStateService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    this.initializeComponent();
    this.setupStateSynchronization();
    this.setupWorkflowManagement();
  }
  
  ngAfterViewInit(): void {
    // Initialize with provided nodes
    if (this.initialNodes.length > 0) {
      this.stateService.setNodes(this.initialNodes, 'integration-component');
    }
    
    this.detailPanelVisible = this.defaultDetailPanelVisible;
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    
    // Clear timeouts
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }
    
    if (this.validationTimeout) {
      clearTimeout(this.validationTimeout);
    }
  }
  
  // Event handlers
  
  onNodeSelected(node: TechNode): void {
    this.stateService.selectNode(node.id, 'integration-canvas');
  }
  
  onNodeFocused(node: TechNode): void {
    this.stateService.focusNode(node.id, 'integration-canvas');
  }
  
  onZoomChanged(zoom: number): void {
    this.stateService.updateCanvasState({ zoomLevel: zoom }, 'integration-canvas');
  }
  
  onPanChanged(panPosition: { x: number; y: number }): void {
    this.stateService.updateCanvasState({ panPosition }, 'integration-canvas');
  }
  
  onNodeUpdatedFromCanvas(event: { node: TechNode; finalPosition: { x: number; y: number }; tierChange?: number }): void {
    const changes: Partial<TechNode> = {
      position: event.finalPosition
    };
    
    if (event.tierChange !== undefined) {
      changes.tier = event.tierChange;
    }
    
    this.stateService.updateNode(event.node.id, changes, 'integration-canvas');
  }
  
  onStructuralChangeRequested(event: { nodeId: string; type: 'tier' | 'prerequisites'; newValue: any }): void {
    // Handle structural changes (tier changes, prerequisite modifications)
    console.log('Structural change requested:', event);
    
    const changes: Partial<TechNode> = {};
    changes[event.type] = event.newValue;
    
    this.stateService.updateNode(event.nodeId, changes, 'integration-canvas');
  }
  
  onNodeUpdatedFromDetailPanel(updatedNode: TechNode): void {
    this.stateService.updateNode(updatedNode.id, updatedNode, 'integration-detail-panel');
  }
  
  // UI actions
  
  toggleDetailPanel(): void {
    this.detailPanelVisible = !this.detailPanelVisible;
    this.stateService.updateDetailPanelState(
      { isVisible: this.detailPanelVisible }, 
      'integration-ui'
    );
  }
  
  openPreview(): void {
    const previewData: TechTreePreviewData = {
      nodes: this.nodes,
      title: this.title,
      description: this.subtitle
    };
    
    const dialogRef = this.dialog.open(TechTreePreviewDialogComponent, {
      data: previewData,
      width: '90vw',
      height: '90vh',
      maxWidth: '1200px',
      maxHeight: '800px'
    });
    
    this.stateService.updatePreviewState({ isOpen: true }, 'integration-preview');
    
    dialogRef.afterClosed().subscribe(() => {
      this.stateService.updatePreviewState({ isOpen: false }, 'integration-preview');
    });
  }
  
  saveTree(): void {
    this.workflowStatus.isLoading = true;
    this.cdr.detectChanges();
    
    // Simulate save operation
    setTimeout(() => {
      this.stateService.markSaved('integration-manual');
      this.workflowStatus.isLoading = false;
      this.cdr.detectChanges();
    }, 1000);
  }
  
  showValidationDetails(): void {
    // Open validation details dialog or panel
    console.log('Show validation details');
  }
  
  // Status text getters
  
  getStatusText(): string {
    if (this.workflowStatus.isLoading) {
      return 'Saving...';
    }
    
    if (this.workflowStatus.syncStatus === 'desynchronized') {
      return 'Sync Error';
    }
    
    if (this.workflowStatus.hasUnsavedChanges) {
      return 'Unsaved Changes';
    }
    
    if (this.workflowStatus.validationErrors > 0) {
      return 'Validation Errors';
    }
    
    return 'Saved';
  }
  
  getSyncStatusText(): string {
    switch (this.workflowStatus.syncStatus) {
      case 'synchronized':
        return 'Synchronized';
      case 'desynchronized':
        return 'Desynchronized';
      case 'recovering':
        return 'Recovering...';
      default:
        return 'Unknown';
    }
  }
  
  getDetailPanelTitle(): string {
    if (!this.selectedNode) {
      return 'Node Properties';
    }
    
    return `${this.selectedNode.name} Properties`;
  }
  
  // Private methods
  
  private initializeComponent(): void {
    // Set up initial workflow status
    this.workflowStatus = {
      isLoading: false,
      hasUnsavedChanges: false,
      lastSaved: null,
      validationErrors: 0,
      validationWarnings: 0,
      syncStatus: 'synchronized'
    };
  }
  
  private setupStateSynchronization(): void {
    // Subscribe to state changes
    this.subscriptions.push(
      this.stateService.state$.pipe(
        takeUntil(this.destroy$)
      ).subscribe(state => {
        this.handleStateChange(state);
      })
    );
    
    // Subscribe to state change events
    this.subscriptions.push(
      this.stateService.stateChanges$.pipe(
        takeUntil(this.destroy$)
      ).subscribe(event => {
        this.handleStateChangeEvent(event);
      })
    );
    
    // Subscribe to node updates
    this.subscriptions.push(
      this.stateService.nodeUpdates$.pipe(
        takeUntil(this.destroy$)
      ).subscribe(event => {
        this.handleNodeUpdate(event);
      })
    );
  }
  
  private setupWorkflowManagement(): void {
    if (this.config.enableAutoSave) {
      this.setupAutoSave();
    }
    
    if (this.config.enableValidation) {
      this.setupValidation();
    }
  }
  
  private handleStateChange(state: TechTreeEditorState): void {
    // Update local state from service
    this.nodes = state.nodes;
    this.selectedNode = state.nodes.find(n => n.id === state.selectedNodeId) || null;
    this.focusedNode = state.nodes.find(n => n.id === state.focusedNodeId) || null;
    this.canvasState = state.canvasState;
    this.detailPanelVisible = state.detailPanelState.isVisible;
    this.detailPanelCollapsed = state.detailPanelState.isCollapsed;
    
    // Update workflow status
    this.workflowStatus.hasUnsavedChanges = state.workflowState.isDirty;
    this.workflowStatus.lastSaved = state.workflowState.lastSaved;
    this.workflowStatus.validationErrors = state.validationState.errorCount;
    this.workflowStatus.validationWarnings = state.validationState.warningCount;
    this.workflowStatus.syncStatus = state.errorState.hasDesync ? 'desynchronized' : 'synchronized';
    
    this.cdr.detectChanges();
  }
  
  private handleStateChangeEvent(event: any): void {
    switch (event.type) {
      case 'node-selected':
        // Ensure canvas selection matches state
        if (event.payload.nodeId && this.canvasComponent) {
          // Focus the selected node in canvas if needed
          console.log('Node selected via state:', event.payload.nodeId);
        }
        break;
        
      case 'node-updated':
        // Update canvas if needed
        console.log('Node updated via state:', event.payload.nodeId);
        break;
        
      case 'state-desynchronized':
        this.handleDesynchronization(event.payload.errors);
        break;
        
      case 'state-synchronized':
        if (event.payload.action === 'recovery') {
          this.workflowStatus.syncStatus = 'synchronized';
          this.cdr.detectChanges();
        }
        break;
    }
  }
  
  private handleNodeUpdate(event: any): void {
    // Handle node updates from any source
    console.log('Node updated:', event.node.id, 'from:', event.source);
    
    // Auto-save if enabled
    if (this.config.enableAutoSave && !this.workflowStatus.isLoading) {
      this.scheduleAutoSave();
    }
  }
  
  private handleDesynchronization(errors: string[]): void {
    console.warn('State desynchronization detected:', errors);
    
    this.workflowStatus.syncStatus = 'desynchronized';
    this.cdr.detectChanges();
    
    if (this.config.enableErrorRecovery) {
      // Attempt recovery
      setTimeout(() => {
        this.stateService.recoverFromDesync('integration-recovery');
      }, 1000);
    }
  }
  
  private setupAutoSave(): void {
    // Watch for changes and auto-save after debounce
    this.subscriptions.push(
      combineLatest([
        this.stateService.workflowState$,
        this.stateService.validationState$
      ]).pipe(
        takeUntil(this.destroy$)
      ).subscribe(([workflow, validation]) => {
        if (workflow.isDirty && !workflow.isLoading && validation.errorCount === 0) {
          this.scheduleAutoSave();
        }
      })
    );
  }
  
  private scheduleAutoSave(): void {
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }
    
    this.autoSaveTimeout = setTimeout(() => {
      if (this.workflowStatus.hasUnsavedChanges && !this.workflowStatus.isLoading) {
        this.saveTree();
      }
    }, this.config.debounceMs);
  }
  
  private setupValidation(): void {
    // Periodic validation if enabled
    this.validationTimeout = setInterval(() => {
      if (this.config.enableValidation) {
        // Trigger validation check
        const summary = this.stateService.getValidationSummary();
        console.log('Validation check:', summary);
      }
    }, this.config.validationIntervalMs);
  }
}