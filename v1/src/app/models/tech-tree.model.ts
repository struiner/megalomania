import {
  CultureTagBinding,
  CultureTagId,
  CultureTagNamespace,
  TechNode as CanonicalTechNode,
  TechNodeEffects,
  TechNodeId,
  TechNodePrerequisite,
  TechPrerequisiteRelation,
  TechResearchPointer,
  TechTree as CanonicalTechTree,
  TechTreeOrdering,
  TechTreeExportResult,
  TechTreeImportResult,
  TechTreeValidationIssue,
} from './tech-tree.models';

// Compatibility aliases for legacy imports. Prefer importing directly from tech-tree.models.ts.
export type TechIdentifier = TechNodeId;
export type TechPrerequisiteLink = TechNodePrerequisite;
export type TechEffects = TechNodeEffects;
export type TechGuildReputationEffect = NonNullable<TechNodeEffects['guild_reputation']>[number];

export type {
  CultureTagBinding,
  CultureTagId,
  CultureTagNamespace,
  TechPrerequisiteRelation,
  TechResearchPointer,
  TechTreeExportResult,
  TechTreeImportResult,
  TechTreeOrdering,
  TechTreeValidationIssue,
};

export type TechNode = CanonicalTechNode;

export type TechTree = CanonicalTechTree;
