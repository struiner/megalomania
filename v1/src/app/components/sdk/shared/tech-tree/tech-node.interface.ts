/**
 * Interface for Technology Tree Node Data
 */
export interface TechNode {
  id: string;
  name: string;
  description: string;
  tier: number;
  cost: number;
  prerequisites: string[];
  effects: string[];
  cultureTags: string[];
  icon?: string;
  position: { x: number; y: number };
  isUnlocked?: boolean;
  isDiscovered?: boolean;
  isResearching?: boolean;
  isResearched?: boolean;
}

/**
 * Interface for Node Visual States
 */
export interface TechNodeState {
  selected: boolean;
  focused: boolean;
  invalid: boolean;
  disabled: boolean;
  activePath: boolean;
  prerequisiteSatisfied: boolean;
  prerequisiteUnsatisfied: boolean;
}

/**
 * Interface for Node Zoom Templates
 */
export interface TechNodeTemplate {
  id: string;
  name: string;
  minZoom: number;
  maxZoom: number;
  template: string; // 'compact', 'standard', 'detailed'
}

/**
 * Interface for Node Component Input
 */
export interface TechNodeComponentInput {
  node: TechNode;
  state: TechNodeState;
  zoomLevel: number;
  onNodeClick?: (node: TechNode) => void;
  onNodeFocus?: (node: TechNode) => void;
  onNodeSelect?: (node: TechNode) => void;
}