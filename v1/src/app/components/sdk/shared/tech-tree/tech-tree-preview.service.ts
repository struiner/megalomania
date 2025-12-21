import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { TechTreePreviewDialogComponent, TechTreePreviewData } from './tech-tree-preview-dialog.component';
import { TechNode } from './tech-node.interface';

/**
 * Service for opening tech tree preview dialogs
 * 
 * This service provides a convenient way to open preview dialogs
 * from anywhere in the application while maintaining consistency
 * and proper error handling.
 */
@Injectable({
  providedIn: 'root'
})
export class TechTreePreviewService {
  
  constructor(private dialog: MatDialog) {}

  /**
   * Open a preview dialog for a technology tree
   * 
   * @param nodes Array of technology nodes to display
   * @param title Title for the preview dialog
   * @param description Optional description for the preview
   * @param config Optional configuration for the preview
   * @returns Observable that emits when dialog is closed
   */
  openPreview(
    nodes: TechNode[], 
    title: string = 'Technology Tree Preview',
    description?: string,
    config?: Partial<TechTreePreviewData>
  ): Observable<any> {
    
    // Validate input
    if (!nodes || nodes.length === 0) {
      throw new Error('TechTreePreviewService: Cannot open preview with empty or null nodes array');
    }
    
    if (!title || title.trim().length === 0) {
      throw new Error('TechTreePreviewService: Title cannot be empty');
    }
    
    // Create dialog data
    const dialogData: TechTreePreviewData = {
      nodes: [...nodes], // Create a copy to prevent external mutation
      title: title.trim(),
      description: description?.trim(),
      ...config
    };
    
    // Open the dialog
    const dialogRef = this.dialog.open(TechTreePreviewDialogComponent, {
      data: dialogData,
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'tech-tree-preview-dialog',
      disableClose: false,
      autoFocus: true,
      restoreFocus: true
    });
    
    // Return observable that emits when dialog is closed
    return dialogRef.afterClosed();
  }

  /**
   * Open a preview dialog with custom configuration
   * 
   * @param nodes Array of technology nodes
   * @param dialogData Complete dialog data including custom configuration
   * @returns Observable that emits when dialog is closed
   */
  openPreviewWithConfig(nodes: TechNode[], dialogData: TechTreePreviewData): Observable<any> {
    // Validate nodes array
    if (!nodes || nodes.length === 0) {
      throw new Error('TechTreePreviewService: Cannot open preview with empty or null nodes array');
    }
    
    // Ensure nodes are properly set in dialog data
    const completeDialogData: TechTreePreviewData = {
      ...dialogData,
      nodes: [...nodes] // Create a copy to prevent external mutation
    };
    
    // Open the dialog with custom configuration
    const dialogRef = this.dialog.open(TechTreePreviewDialogComponent, {
      data: completeDialogData,
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'tech-tree-preview-dialog',
      disableClose: false,
      autoFocus: true,
      restoreFocus: true
    });
    
    return dialogRef.afterClosed();
  }

  /**
   * Open a preview dialog with optimized settings for large trees
   * 
   * @param nodes Array of technology nodes
   * @param title Title for the preview
   * @param description Optional description
   * @returns Observable that emits when dialog is closed
   */
  openLargeTreePreview(
    nodes: TechNode[], 
    title: string = 'Technology Tree Preview',
    description?: string
  ): Observable<any> {
    
    if (!nodes || nodes.length === 0) {
      throw new Error('TechTreePreviewService: Cannot open preview with empty or null nodes array');
    }
    
    const dialogData: TechTreePreviewData = {
      nodes: [...nodes],
      title: title.trim(),
      description: description?.trim()
      // Large tree optimizations are handled internally by the component
    };
    
    const dialogRef = this.dialog.open(TechTreePreviewDialogComponent, {
      data: dialogData,
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'tech-tree-preview-dialog-large',
      disableClose: false,
      autoFocus: false, // Skip auto-focus for large trees to improve performance
      restoreFocus: true
    });
    
    return dialogRef.afterClosed();
  }

  /**
   * Validate technology tree data before opening preview
   * 
   * @param nodes Array of technology nodes to validate
   * @returns Validation result with isValid flag and any errors
   */
  validateTreeData(nodes: TechNode[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!nodes) {
      errors.push('Nodes array is null or undefined');
      return { isValid: false, errors };
    }
    
    if (nodes.length === 0) {
      errors.push('Nodes array is empty');
      return { isValid: false, errors };
    }
    
    // Validate each node
    nodes.forEach((node, index) => {
      if (!node.id || node.id.trim().length === 0) {
        errors.push(`Node at index ${index} has missing or empty ID`);
      }
      
      if (!node.name || node.name.trim().length === 0) {
        errors.push(`Node at index ${index} has missing or empty name`);
      }
      
      if (typeof node.tier !== 'number' || node.tier < 1) {
        errors.push(`Node "${node.name || 'Unknown'}" has invalid tier (must be >= 1)`);
      }
      
      if (typeof node.cost !== 'number' || node.cost < 0) {
        errors.push(`Node "${node.name || 'Unknown'}" has invalid cost (must be >= 0)`);
      }
      
      // Validate prerequisites reference valid nodes
      if (node.prerequisites && node.prerequisites.length > 0) {
        const validPrereqIds = new Set(nodes.map(n => n.id));
        const invalidPrereqs = node.prerequisites.filter(prereqId => !validPrereqIds.has(prereqId));
        
        if (invalidPrereqs.length > 0) {
          errors.push(`Node "${node.name}" has invalid prerequisites: ${invalidPrereqs.join(', ')}`);
        }
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get statistics about the technology tree for preview optimization
   * 
   * @param nodes Array of technology nodes
   * @returns Tree statistics including node count, tier count, etc.
   */
  getTreeStatistics(nodes: TechNode[]): {
    nodeCount: number;
    tierCount: number;
    maxTier: number;
    minTier: number;
    totalConnections: number;
    averageNodesPerTier: number;
    cultureTagCount: number;
    complexityScore: number;
  } {
    if (!nodes || nodes.length === 0) {
      return {
        nodeCount: 0,
        tierCount: 0,
        maxTier: 0,
        minTier: 0,
        totalConnections: 0,
        averageNodesPerTier: 0,
        cultureTagCount: 0,
        complexityScore: 0
      };
    }
    
    const tiers = [...new Set(nodes.map(node => node.tier))].sort((a, b) => a - b);
    const tierCount = tiers.length;
    const maxTier = Math.max(...tiers);
    const minTier = Math.min(...tiers);
    
    // Count total connections (prerequisites)
    let totalConnections = 0;
    const cultureTags = new Set<string>();
    
    nodes.forEach(node => {
      if (node.prerequisites) {
        totalConnections += node.prerequisites.length;
      }
      
      if (node.cultureTags) {
        node.cultureTags.forEach(tag => cultureTags.add(tag));
      }
    });
    
    // Calculate complexity score (simple heuristic)
    const complexityScore = (nodes.length * 0.4) + (totalConnections * 0.3) + (tierCount * 0.3);
    
    return {
      nodeCount: nodes.length,
      tierCount,
      maxTier,
      minTier,
      totalConnections,
      averageNodesPerTier: nodes.length / tierCount,
      cultureTagCount: cultureTags.size,
      complexityScore
    };
  }

  /**
   * Check if a tree should use large tree optimizations
   * 
   * @param nodes Array of technology nodes
   * @returns True if optimizations should be used
   */
  shouldUseLargeTreeOptimizations(nodes: TechNode[]): boolean {
    if (!nodes || nodes.length === 0) return false;
    
    const stats = this.getTreeStatistics(nodes);
    
    // Use optimizations for large or complex trees
    return (
      stats.nodeCount > 50 || 
      stats.tierCount > 10 || 
      stats.totalConnections > 100 ||
      stats.complexityScore > 30
    );
  }
}