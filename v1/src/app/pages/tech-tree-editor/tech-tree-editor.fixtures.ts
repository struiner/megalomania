import { TechTreeDocument, TechTreeNode } from './tech-tree-editor.types';

export const TECH_TREE_FIXTURES: TechTreeNode[] = [
  {
    id: 'basic-carpentry',
    name: 'Basic Carpentry',
    summary: 'Hand tools, timber prep, and square joinery norms.',
    tier: 1,
    category: 'craft',
    prerequisites: [],
  },
  {
    id: 'charted-coasts',
    name: 'Charted Coasts',
    summary: 'Reliable shoreline maps for convoy navigation.',
    tier: 1,
    category: 'exploration',
    prerequisites: [],
  },
  {
    id: 'reinforced-keel',
    name: 'Reinforced Keel',
    summary: 'Stiffer hull frames and ballast patterns.',
    tier: 2,
    category: 'shipwright',
    prerequisites: ['basic-carpentry'],
  },
  {
    id: 'canvas-rigging',
    name: 'Canvas Rigging',
    summary: 'Standardized sail kits with modular spars.',
    tier: 2,
    category: 'shipwright',
    prerequisites: ['basic-carpentry'],
  },
  {
    id: 'coastal-trade-ledgers',
    name: 'Coastal Trade Ledgers',
    summary: 'Ledger templates for harbor duties and portage fees.',
    tier: 3,
    category: 'commerce',
    prerequisites: ['charted-coasts', 'reinforced-keel'],
  },
  {
    id: 'convoy-discipline',
    name: 'Convoy Discipline',
    summary: 'Repeatable routines for escorts, spacing, and signals.',
    tier: 4,
    category: 'doctrine',
    prerequisites: ['coastal-trade-ledgers', 'canvas-rigging'],
  },
];

export const TECH_TREE_FIXTURE_DOCUMENT: TechTreeDocument = {
  nodes: TECH_TREE_FIXTURES,
  lastImportedFrom: 'fixtures/tech-tree-fixtures',
};
