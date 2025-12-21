import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, combineLatest } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, filter, shareReplay } from 'rxjs/operators';
import { TechNode } from './tech-node.interface';

/**
 * Interface for Tech Tree Editor State
 */
export interface TechTreeEditorState {
  // Current tech tree data
  nodes: TechNode[];
  
  // Selection state
  selectedNodeId: string | null;
  focusedNodeId: string | null;
  
  // View state
  canvasState: {
    zoomLevel: number;
    panPosition: { x: number; y: number };
    isPanning: boolean;
  };
  
  // UI state
  detailPanelState: {
    isVisible: boolean;
    activeSection: string | null;
    isCollapsed: boolean;
  };
  
  previewState: {
    isOpen: boolean;
    isFullscreen: boolean;
    zoomLevel: number;
  };
  
  // Validation state
  validationState: {
    hasErrors: boolean;
    hasWarnings: boolean;
    errorCount: number;
    warningCount: number;
    lastValidated: Date | null;
  };
  
  // Workflow state
  workflowState: {
    isDirty: boolean;
    lastSaved: Date | null;
    pendingChanges: TechNode[];
    isLoading: boolean;
  };
  
  // Error state
  errorState: {
    hasDesync: boolean;
    lastSyncCheck: Date | null;
    syncErrors: string[];
  };
}

/**
 * Interface for State Change Events
 */
export interface StateChangeEvent {
  type: 'node-selected' | 'node-updated' | 'node-added' | 'node-removed' | 
        'canvas-zoom-changed' | 'canvas-panned' | 'detail-panel-toggled' | 
        'preview-opened' | 'preview-closed' | 'validation-updated' | 'state-synchronized' |
        'state-desynchronized' | 'workflow-updated';
  payload: any;
  timestamp: Date;
  source: string; // Which component emitted the change
}

/**
 * Interface for Node Update Events
 */
export interface NodeUpdateEvent {
  node: TechNode;
  changes: Partial<TechNode>;
  source: 'canvas' | 'detail-panel' | 'preview' | 'api';
  timestamp: Date;
}

/**
 * Service for managing centralized state across all tech tree components
 * Provides reactive state management with synchronization and conflict resolution
 */
@Injectable({
  providedIn: 'root'
})
export class TechTreeStateService {
  private readonly STATE_KEY = 'tech-tree-editor-state';
  private readonly VERSION = '1.0.0';
  
  // Core state
  private readonly stateSubject = new BehaviorSubject<TechTreeEditorState>(this.getInitialState());
  private readonly stateChangeSubject = new Subject<StateChangeEvent>();
  private readonly nodeUpdateSubject = new Subject<NodeUpdateEvent>();
  
  // Derived state observables
  public readonly state$ = this.stateSubject.asObservable();
  public readonly selectedNode$ = this.state$.pipe(
    map(state => state.nodes.find(n => n.id === state.selectedNodeId) || null),
    distinctUntilChanged()
  );
  
  public readonly focusedNode$ = this.state$.pipe(
    map(state => state.nodes.find(n => n.id === state.focusedNodeId) || null),
    distinctUntilChanged()
  );
  
  public readonly nodes$ = this.state$.pipe(
    map(state => state.nodes),
    distinctUntilChanged(),
    shareReplay(1)
  );
  
  public readonly canvasState$ = this.state$.pipe(
    map(state => state.canvasState),
    distinctUntilChanged()
  );
  
  public readonly detailPanelState$ = this.state$.pipe(
    map(state => state.detailPanelState),
    distinctUntilChanged()
  );
  
  public readonly previewState$ = this.state$.pipe(
    map(state => state.previewState),
    distinctUntilChanged()
  );
  
  public readonly validationState$ = this.state$.pipe(
    map(state => state.validationState),
    distinctUntilChanged()
  );
  
  public readonly workflowState$ = this.state$.pipe(
    map(state => state.workflowState),
    distinctUntilChanged()
  );
  
  public readonly errorState$ = this.state$.pipe(
    map(state => state.errorState),
    distinctUntilChanged()
  );
  
  // State change events
  public readonly stateChanges$ = this.stateChangeSubject.asObservable();
  public readonly nodeUpdates$ = this.nodeUpdateSubject.asObservable();
  
  // Debounced state sync check
  private readonly syncCheck$ = this.state$.pipe(
    debounceTime(100),
    map(state => ({
      timestamp: new Date(),
      nodeCount: state.nodes.length,
      selectedNodeId: state.selectedNodeId,
      canvasState: state.canvasState
    })),
    distinctUntilChanged((prev, curr) => 
      prev.nodeCount === curr.nodeCount && 
      prev.selectedNodeId === curr.selectedNodeId &&
      prev.canvasState.zoomLevel === curr.canvasState.zoomLevel
    )
  );
  
  constructor() {
    this.initializeStateSync();
    this.loadPersistedState();
  }
  
  /**
   * Get current state snapshot
   */
  getCurrentState(): TechTreeEditorState {
    return this.stateSubject.value;
  }
  
  /**
   * Update state with patch
   */
  updateState(patch: Partial<TechTreeEditorState>, source: string, emitEvent: boolean = true): void {
    const currentState = this.stateSubject.value;
    const newState = { ...currentState, ...patch };
    
    this.stateSubject.next(newState);
    
    if (emitEvent) {
      this.emitStateChange('state-synchronized', { patch, newState }, source);
    }
    
    this.persistState(newState);
  }
  
  /**
   * Set nodes and trigger validation
   */
  setNodes(nodes: TechNode[], source: string): void {
    this.updateState({ 
      nodes: [...nodes],
      workflowState: {
        ...this.getCurrentState().workflowState,
        isDirty: true,
        pendingChanges: []
      }
    }, source);
    
    this.validateNodes();
  }
  
  /**
   * Select a node
   */
  selectNode(nodeId: string | null, source: string): void {
    this.updateState({ 
      selectedNodeId: nodeId,
      detailPanelState: {
        ...this.getCurrentState().detailPanelState,
        isVisible: nodeId !== null
      }
    }, source);
    
    this.emitStateChange('node-selected', { nodeId }, source);
  }
  
  /**
   * Focus a node
   */
  focusNode(nodeId: string | null, source: string): void {
    this.updateState({ focusedNodeId: nodeId }, source);
    this.emitStateChange('node-selected', { nodeId, isFocus: true }, source);
  }
  
  /**
   * Update canvas state
   */
  updateCanvasState(canvasPatch: Partial<TechTreeEditorState['canvasState']>, source: string): void {
    const currentCanvasState = this.getCurrentState().canvasState;
    const newCanvasState = { ...currentCanvasState, ...canvasPatch };
    
    this.updateState({ canvasState: newCanvasState }, source);
    
    if (canvasPatch.zoomLevel !== undefined) {
      this.emitStateChange('canvas-zoom-changed', { zoomLevel: canvasPatch.zoomLevel }, source);
    }
    
    if (canvasPatch.panPosition !== undefined) {
      this.emitStateChange('canvas-panned', { panPosition: canvasPatch.panPosition }, source);
    }
  }
  
  /**
   * Update detail panel state
   */
  updateDetailPanelState(detailPatch: Partial<TechTreeEditorState['detailPanelState']>, source: string): void {
    const currentDetailState = this.getCurrentState().detailPanelState;
    const newDetailState = { ...currentDetailState, ...detailPatch };
    
    this.updateState({ detailPanelState: newDetailState }, source);
    
    if (detailPatch.isVisible !== undefined) {
      this.emitStateChange('detail-panel-toggled', { isVisible: detailPatch.isVisible }, source);
    }
  }
  
  /**
   * Update preview state
   */
  updatePreviewState(previewPatch: Partial<TechTreeEditorState['previewState']>, source: string): void {
    const currentPreviewState = this.getCurrentState().previewState;
    const newPreviewState = { ...currentPreviewState, ...previewPatch };
    
    this.updateState({ previewState: newPreviewState }, source);
    
    if (previewPatch.isOpen !== undefined) {
      const eventType = previewPatch.isOpen ? 'preview-opened' : 'preview-closed';
      this.emitStateChange(eventType, { previewState: newPreviewState }, source);
    }
  }
  
  /**
   * Update a node with conflict resolution
   */
  updateNode(nodeId: string, changes: Partial<TechNode>, source: string): void {
    const currentState = this.getCurrentState();
    const nodeIndex = currentState.nodes.findIndex(n => n.id === nodeId);
    
    if (nodeIndex === -1) {
      console.warn(`Node with id ${nodeId} not found`);
      return;
    }
    
    const currentNode = currentState.nodes[nodeIndex];
    const updatedNode = { ...currentNode, ...changes };
    
    // Create new nodes array
    const newNodes = [...currentState.nodes];
    newNodes[nodeIndex] = updatedNode;
    
    // Update workflow state
    const workflowState = {
      ...currentState.workflowState,
      isDirty: true,
      pendingChanges: this.addPendingChange(currentState.workflowState.pendingChanges, updatedNode)
    };
    
    this.updateState({ nodes: newNodes, workflowState }, source);
    
    // Emit node update event
    this.nodeUpdateSubject.next({
      node: updatedNode,
      changes,
      source: source as any,
      timestamp: new Date()
    });
    
    this.emitStateChange('node-updated', { nodeId, changes, updatedNode }, source);
    
    // Trigger validation after node update
    setTimeout(() => this.validateNodes(), 50);
  }
  
  /**
   * Add a new node
   */
  addNode(node: TechNode, source: string): void {
    const currentState = this.getCurrentState();
    const newNodes = [...currentState.nodes, node];
    
    this.setNodes(newNodes, source);
    this.emitStateChange('node-added', { node }, source);
  }
  
  /**
   * Remove a node
   */
  removeNode(nodeId: string, source: string): void {
    const currentState = this.getCurrentState();
    const newNodes = currentState.nodes.filter(n => n.id !== nodeId);
    
    // If removing selected node, clear selection
    const selectedNodeId = currentState.selectedNodeId === nodeId ? null : currentState.selectedNodeId;
    
    this.updateState({ 
      nodes: newNodes, 
      selectedNodeId,
      workflowState: {
        ...currentState.workflowState,
        isDirty: true
      }
    }, source);
    
    this.emitStateChange('node-removed', { nodeId }, source);
  }
  
  /**
   * Mark state as saved
   */
  markSaved(source: string): void {
    const currentState = this.getCurrentState();
    this.updateState({
      workflowState: {
        ...currentState.workflowState,
        isDirty: false,
        lastSaved: new Date(),
        pendingChanges: []
      }
    }, source);
    
    this.emitStateChange('workflow-updated', { action: 'saved' }, source);
  }
  
  /**
   * Set loading state
   */
  setLoading(isLoading: boolean, source: string): void {
    const currentState = this.getCurrentState();
    this.updateState({
      workflowState: {
        ...currentState.workflowState,
        isLoading
      }
    }, source);
  }
  
  /**
   * Check for state desynchronization
   */
  checkForDesync(): boolean {
    const currentState = this.getCurrentState();
    const errors: string[] = [];
    
    // Check if selected node exists
    if (currentState.selectedNodeId) {
      const selectedNode = currentState.nodes.find(n => n.id === currentState.selectedNodeId);
      if (!selectedNode) {
        errors.push(`Selected node ${currentState.selectedNodeId} does not exist`);
      }
    }
    
    // Check if focused node exists
    if (currentState.focusedNodeId) {
      const focusedNode = currentState.nodes.find(n => n.id === currentState.focusedNodeId);
      if (!focusedNode) {
        errors.push(`Focused node ${currentState.focusedNodeId} does not exist`);
      }
    }
    
    // Check for duplicate node IDs
    const nodeIds = currentState.nodes.map(n => n.id);
    const duplicates = nodeIds.filter((id, index) => nodeIds.indexOf(id) !== index);
    if (duplicates.length > 0) {
      errors.push(`Duplicate node IDs found: ${duplicates.join(', ')}`);
    }
    
    // Update error state
    const hasDesync = errors.length > 0;
    this.updateState({
      errorState: {
        hasDesync,
        lastSyncCheck: new Date(),
        syncErrors: errors
      }
    }, 'state-service');
    
    if (hasDesync) {
      this.emitStateChange('state-desynchronized', { errors }, 'state-service');
    }
    
    return hasDesync;
  }
  
  /**
   * Recover from state desynchronization
   */
  recoverFromDesync(source: string): void {
    console.log('Attempting to recover from state desynchronization...');
    
    const currentState = this.getCurrentState();
    
    // Clear invalid selections
    let selectedNodeId = currentState.selectedNodeId;
    let focusedNodeId = currentState.focusedNodeId;
    
    if (selectedNodeId && !currentState.nodes.find(n => n.id === selectedNodeId)) {
      selectedNodeId = null;
    }
    
    if (focusedNodeId && !currentState.nodes.find(n => n.id === focusedNodeId)) {
      focusedNodeId = null;
    }
    
    // Update state with corrections
    this.updateState({
      selectedNodeId,
      focusedNodeId,
      errorState: {
        hasDesync: false,
        lastSyncCheck: new Date(),
        syncErrors: []
      }
    }, source);
    
    this.emitStateChange('state-synchronized', { action: 'recovery' }, source);
  }
  
  /**
   * Get validation summary
   */
  getValidationSummary(): { errors: number; warnings: number; lastValidated: Date | null } {
    const validationState = this.getCurrentState().validationState;
    return {
      errors: validationState.errorCount,
      warnings: validationState.warningCount,
      lastValidated: validationState.lastValidated
    };
  }
  
  /**
   * Get workflow status
   */
  getWorkflowStatus(): { isDirty: boolean; lastSaved: Date | null; pendingChanges: number } {
    const workflowState = this.getCurrentState().workflowState;
    return {
      isDirty: workflowState.isDirty,
      lastSaved: workflowState.lastSaved,
      pendingChanges: workflowState.pendingChanges.length
    };
  }
  
  // Private methods
  
  private getInitialState(): TechTreeEditorState {
    return {
      nodes: [],
      selectedNodeId: null,
      focusedNodeId: null,
      canvasState: {
        zoomLevel: 1.0,
        panPosition: { x: 0, y: 0 },
        isPanning: false
      },
      detailPanelState: {
        isVisible: false,
        activeSection: null,
        isCollapsed: false
      },
      previewState: {
        isOpen: false,
        isFullscreen: false,
        zoomLevel: 1.0
      },
      validationState: {
        hasErrors: false,
        hasWarnings: false,
        errorCount: 0,
        warningCount: 0,
        lastValidated: null
      },
      workflowState: {
        isDirty: false,
        lastSaved: null,
        pendingChanges: [],
        isLoading: false
      },
      errorState: {
        hasDesync: false,
        lastSyncCheck: null,
        syncErrors: []
      }
    };
  }
  
  private addPendingChange(pendingChanges: TechNode[], updatedNode: TechNode): TechNode[] {
    const filtered = pendingChanges.filter(n => n.id !== updatedNode.id);
    return [...filtered, updatedNode];
  }
  
  private validateNodes(): void {
    const currentState = this.getCurrentState();
    let errorCount = 0;
    let warningCount = 0;
    
    // Basic validation logic
    for (const node of currentState.nodes) {
      // Check for missing required fields
      if (!node.id || !node.name) {
        errorCount++;
      }
      
      // Check for circular dependencies
      if (this.hasCircularDependency(node, currentState.nodes)) {
        errorCount++;
      }
      
      // Check for duplicate prerequisites
      if (node.prerequisites && this.hasDuplicatePrerequisites(node.prerequisites)) {
        warningCount++;
      }
    }
    
    this.updateState({
      validationState: {
        hasErrors: errorCount > 0,
        hasWarnings: warningCount > 0,
        errorCount,
        warningCount,
        lastValidated: new Date()
      }
    }, 'state-service');
    
    this.emitStateChange('validation-updated', { errorCount, warningCount }, 'state-service');
  }
  
  private hasCircularDependency(node: TechNode, allNodes: TechNode[]): boolean {
    if (!node.prerequisites || node.prerequisites.length === 0) {
      return false;
    }
    
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    
    const hasCycle = (nodeId: string): boolean => {
      if (recursionStack.has(nodeId)) {
        return true; // Cycle detected
      }
      
      if (visited.has(nodeId)) {
        return false; // Already processed
      }
      
      visited.add(nodeId);
      recursionStack.add(nodeId);
      
      const currentNode = allNodes.find(n => n.id === nodeId);
      if (currentNode && currentNode.prerequisites) {
        for (const prereqId of currentNode.prerequisites) {
          if (hasCycle(prereqId)) {
            return true;
          }
        }
      }
      
      recursionStack.delete(nodeId);
      return false;
    };
    
    return hasCycle(node.id);
  }
  
  private hasDuplicatePrerequisites(prerequisites: string[]): boolean {
    return prerequisites.length !== new Set(prerequisites).size;
  }
  
  private emitStateChange(type: StateChangeEvent['type'], payload: any, source: string): void {
    this.stateChangeSubject.next({
      type,
      payload,
      source,
      timestamp: new Date()
    });
  }
  
  private initializeStateSync(): void {
    // Subscribe to sync checks and perform desynchronization detection
    this.syncCheck$.subscribe(() => {
      this.checkForDesync();
    });
    
    // Auto-recovery for common desync scenarios
    this.stateChanges$.subscribe(event => {
      if (event.type === 'state-desynchronized') {
        // Attempt auto-recovery for selection issues
        const currentState = this.getCurrentState();
        if (currentState.errorState.syncErrors.some(error => 
          error.includes('Selected node') || error.includes('Focused node')
        )) {
          setTimeout(() => this.recoverFromDesync('auto-recovery'), 100);
        }
      }
    });
  }
  
  private loadPersistedState(): void {
    try {
      const saved = localStorage.getItem(this.STATE_KEY);
      if (saved) {
        const parsedState = JSON.parse(saved);
        // Validate saved state structure
        if (this.isValidState(parsedState)) {
          this.stateSubject.next(parsedState);
        }
      }
    } catch (error) {
      console.warn('Failed to load persisted state:', error);
    }
  }
  
  private persistState(state: TechTreeEditorState): void {
    try {
      // Only persist essential state (exclude large objects and volatile data)
      const persistableState = {
        ...state,
        workflowState: {
          ...state.workflowState,
          pendingChanges: [] // Don't persist pending changes
        },
        errorState: {
          ...state.errorState,
          syncErrors: [] // Don't persist errors
        }
      };
      
      localStorage.setItem(this.STATE_KEY, JSON.stringify(persistableState));
    } catch (error) {
      console.warn('Failed to persist state:', error);
    }
  }
  
  private isValidState(state: any): state is TechTreeEditorState {
    return state && 
           Array.isArray(state.nodes) &&
           typeof state.canvasState === 'object' &&
           typeof state.detailPanelState === 'object' &&
           typeof state.previewState === 'object';
  }
}