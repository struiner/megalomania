import { Injectable } from '@angular/core';
import { TechNode } from '../../../tech-tree/tech-node.interface';

export interface ValidationResult {
  isValid: boolean;
  message?: string;
  type?: 'circular' | 'missing' | 'self' | 'chain' | 'warning';
  affectedNodes?: string[];
}

export interface ValidationSummary {
  isValid: boolean;
  totalIssues: number;
  circularDependencies: number;
  missingNodes: number;
  selfReferences: number;
  chainIssues: number;
  warnings: number;
  details: ValidationResult[];
}

@Injectable({
  providedIn: 'root'
})
export class PrerequisiteValidationService {

  constructor() {}

  /**
   * Validate prerequisites for a specific node
   */
  validatePrerequisites(
    nodeId: string, 
    prerequisites: string[], 
    allNodes: TechNode[]
  ): Map<string, ValidationResult> {
    const results = new Map<string, ValidationResult>();
    
    // Create a map for quick node lookup
    const nodeMap = new Map(allNodes.map(node => [node.id, node]));
    
    // Check each prerequisite
    for (const prereqId of prerequisites) {
      const result = this.validateSinglePrerequisite(nodeId, prereqId, nodeMap, allNodes);
      results.set(prereqId, result);
    }
    
    return results;
  }
  
  /**
   * Validate a single prerequisite relationship
   */
  private validateSinglePrerequisite(
    nodeId: string,
    prereqId: string,
    nodeMap: Map<string, TechNode>,
    allNodes: TechNode[]
  ): ValidationResult {
    
    // Check if prerequisite node exists
    if (!nodeMap.has(prereqId)) {
      return {
        isValid: false,
        message: `Prerequisite node "${prereqId}" does not exist`,
        type: 'missing'
      };
    }
    
    // Check for self-reference
    if (nodeId === prereqId) {
      return {
        isValid: false,
        message: 'Node cannot be a prerequisite of itself',
        type: 'self',
        affectedNodes: [nodeId]
      };
    }
    
    // Check for circular dependencies
    const hasCircularDependency = this.checkCircularDependency(nodeId, prereqId, nodeMap);
    if (hasCircularDependency) {
      return {
        isValid: false,
        message: 'Circular dependency detected',
        type: 'circular',
        affectedNodes: this.getCircularPath(nodeId, prereqId, nodeMap)
      };
    }
    
    // Check for chain issues (e.g., very long prerequisite chains)
    const chainLength = this.getPrerequisiteChainLength(prereqId, nodeMap);
    if (chainLength > 5) {
      return {
        isValid: true, // Still valid but warn about complexity
        message: `Long prerequisite chain (${chainLength} levels)`,
        type: 'warning'
      };
    }
    
    return {
      isValid: true,
      message: 'Valid prerequisite'
    };
  }
  
  /**
   * Check if adding a prerequisite would create a circular dependency
   */
  private checkCircularDependency(
    targetNodeId: string, 
    prereqId: string, 
    nodeMap: Map<string, TechNode>
  ): boolean {
    const visited = new Set<string>();
    return this.dfsHasCycle(prereqId, targetNodeId, nodeMap, visited);
  }
  
  /**
   * Depth-first search to detect cycles
   */
  private dfsHasCycle(
    currentNodeId: string, 
    targetNodeId: string, 
    nodeMap: Map<string, TechNode>, 
    visited: Set<string>
  ): boolean {
    if (currentNodeId === targetNodeId) {
      return true;
    }
    
    if (visited.has(currentNodeId)) {
      return false;
    }
    
    visited.add(currentNodeId);
    
    const currentNode = nodeMap.get(currentNodeId);
    if (!currentNode || !currentNode.prerequisites) {
      return false;
    }
    
    for (const nextPrereqId of currentNode.prerequisites) {
      if (this.dfsHasCycle(nextPrereqId, targetNodeId, nodeMap, visited)) {
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Get the circular path for reporting
   */
  private getCircularPath(
    nodeId: string, 
    prereqId: string, 
    nodeMap: Map<string, TechNode>
  ): string[] {
    const path: string[] = [];
    const visited = new Set<string>();
    
    this.buildCircularPath(nodeId, prereqId, nodeMap, visited, path);
    return path;
  }
  
  /**
   * Build the circular path for reporting
   */
  private buildCircularPath(
    currentNodeId: string, 
    targetNodeId: string, 
    nodeMap: Map<string, TechNode>, 
    visited: Set<string>, 
    path: string[]
  ): boolean {
    path.push(currentNodeId);
    
    if (currentNodeId === targetNodeId) {
      return true;
    }
    
    if (visited.has(currentNodeId)) {
      path.pop();
      return false;
    }
    
    visited.add(currentNodeId);
    
    const currentNode = nodeMap.get(currentNodeId);
    if (!currentNode || !currentNode.prerequisites) {
      path.pop();
      return false;
    }
    
    for (const nextPrereqId of currentNode.prerequisites) {
      if (this.buildCircularPath(nextPrereqId, targetNodeId, nodeMap, visited, path)) {
        return true;
      }
    }
    
    path.pop();
    visited.delete(currentNodeId);
    return false;
  }
  
  /**
   * Get the length of a prerequisite chain
   */
  private getPrerequisiteChainLength(
    nodeId: string, 
    nodeMap: Map<string, TechNode>
  ): number {
    const visited = new Set<string>();
    return this.dfsChainLength(nodeId, nodeMap, visited);
  }
  
  /**
   * Calculate chain length using DFS
   */
  private dfsChainLength(
    nodeId: string, 
    nodeMap: Map<string, TechNode>, 
    visited: Set<string>
  ): number {
    if (visited.has(nodeId)) {
      return 0; // Already counted in this chain
    }
    
    visited.add(nodeId);
    
    const node = nodeMap.get(nodeId);
    if (!node || !node.prerequisites || node.prerequisites.length === 0) {
      return 1;
    }
    
    let maxChainLength = 1;
    for (const prereqId of node.prerequisites) {
      const chainLength = this.dfsChainLength(prereqId, nodeMap, new Set(visited));
      maxChainLength = Math.max(maxChainLength, 1 + chainLength);
    }
    
    return maxChainLength;
  }
  
  /**
   * Validate all prerequisites in the tech tree
   */
  validateAllPrerequisites(allNodes: TechNode[]): ValidationSummary {
    const results: ValidationResult[] = [];
    const nodeMap = new Map(allNodes.map(node => [node.id, node]));
    
    // Check each node's prerequisites
    for (const node of allNodes) {
      if (node.prerequisites && node.prerequisites.length > 0) {
        const nodeResults = this.validatePrerequisites(node.id, node.prerequisites, allNodes);
        for (const [prereqId, result] of nodeResults.entries()) {
          if (!result.isValid || result.type === 'warning') {
            results.push(result);
          }
        }
      }
    }
    
    // Count issues by type
    const summary: ValidationSummary = {
      isValid: results.every(r => r.isValid),
      totalIssues: results.length,
      circularDependencies: results.filter(r => r.type === 'circular').length,
      missingNodes: results.filter(r => r.type === 'missing').length,
      selfReferences: results.filter(r => r.type === 'self').length,
      chainIssues: results.filter(r => r.type === 'chain').length,
      warnings: results.filter(r => r.type === 'warning').length,
      details: results
    };
    
    return summary;
  }
  
  /**
   * Check if a prerequisite would be valid if added
   */
  wouldBeValidPrerequisite(
    nodeId: string, 
    prereqId: string, 
    allNodes: TechNode[]
  ): ValidationResult {
    const nodeMap = new Map(allNodes.map(node => [node.id, node]));
    return this.validateSinglePrerequisite(nodeId, prereqId, nodeMap, allNodes);
  }
  
  /**
   * Get suggested valid prerequisites for a node
   */
  getSuggestedPrerequisites(
    nodeId: string, 
    allNodes: TechNode[], 
    maxSuggestions: number = 10
  ): TechNode[] {
    const nodeMap = new Map(allNodes.map(node => [node.id, node]));
    const currentNode = nodeMap.get(nodeId);
    
    if (!currentNode) {
      return [];
    }
    
    // Get all nodes that could potentially be prerequisites
    const candidates = allNodes.filter(node => {
      // Exclude self and nodes that already are prerequisites
      if (node.id === nodeId || currentNode.prerequisites.includes(node.id)) {
        return false;
      }
      
      // Check if adding this as prerequisite would be valid
      const validation = this.wouldBeValidPrerequisite(nodeId, node.id, allNodes);
      return validation.isValid;
    });
    
    // Sort by tier (prefer same or adjacent tiers) and name
    return candidates
      .sort((a, b) => {
        const tierDiffA = Math.abs(a.tier - currentNode.tier);
        const tierDiffB = Math.abs(b.tier - currentNode.tier);
        
        if (tierDiffA !== tierDiffB) {
          return tierDiffA - tierDiffB;
        }
        
        return a.name.localeCompare(b.name);
      })
      .slice(0, maxSuggestions);
  }
}
