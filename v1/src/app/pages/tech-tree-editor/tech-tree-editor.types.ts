export interface TechTreeNode {
  id: string;
  name: string;
  summary: string;
  tier: number;
  category: string;
  prerequisites: string[];
}

export interface TechTreeDocument {
  nodes: TechTreeNode[];
  lastImportedFrom?: string;
}

export interface TechTreeImportPayload {
  sourceLabel: string;
  document: TechTreeDocument;
}

export interface TechTreeExportPayload {
  exportedAt: string;
  document: TechTreeDocument;
}
