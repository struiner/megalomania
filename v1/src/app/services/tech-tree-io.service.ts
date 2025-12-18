import { Injectable } from '@angular/core';
import { Biome } from '../enums/Biome';
import { GoodsType } from '../enums/GoodsType';
import { GuildType } from '../enums/GuildType';
import { FloraUseType } from '../enums/FloraUseType';
import { SettlementSpecialization } from '../enums/SettlementSpecialization';
import { SettlementType } from '../enums/SettlementType';
import { StructureEffect } from '../enums/StructureEffect';
import { StructureType } from '../enums/StructureType';
import {
  buildEnumNormalizationMap,
  EnumNormalizationMap,
  mapValuesToCanonical,
  normalizeEnumValue,
  normalizeIdentifier,
} from './tech-identifier-normalizer';
import {
  CultureTagBinding,
  CultureTagId,
  CultureTagNamespace,
  TechNode,
  TechNodeEffects,
  TechNodeMetadata,
  TechNodePrerequisite,
  TECH_PREREQUISITE_RELATION,
  TechTree,
  TechTreeExportResult,
  TechTreeImportResult,
  TechTreeOrdering,
  TechTreeValidationIssue,
} from '../models/tech-tree.models';

interface CultureTagDefinition extends CultureTagBinding {}

interface NormalizedTreeResult {
  tree: TechTree;
  issues: TechTreeValidationIssue[];
}

@Injectable({
  providedIn: 'root',
})
export class TechTreeIoService {
  private readonly cultureTagVocabulary = this.buildCultureTagVocabulary();
  private readonly migrations: Record<number, (tree: TechTree) => TechTree> = {};
  private readonly enumNormalizationMaps: {
    structures: EnumNormalizationMap;
    structureEffects: EnumNormalizationMap;
    goods: EnumNormalizationMap;
    settlements: EnumNormalizationMap;
    guilds: EnumNormalizationMap;
    floraUses: EnumNormalizationMap;
  } = {
    structures: buildEnumNormalizationMap(StructureType),
    structureEffects: buildEnumNormalizationMap(StructureEffect),
    goods: buildEnumNormalizationMap(GoodsType),
    settlements: buildEnumNormalizationMap(SettlementType),
    guilds: buildEnumNormalizationMap(GuildType),
    floraUses: buildEnumNormalizationMap(FloraUseType as unknown as Record<string, string>),
  };

  getCultureTagOptions(): CultureTagBinding[] {
    return Object.values(this.cultureTagVocabulary).sort((left, right) => left.id.localeCompare(right.id));
  }

  importTechTree(json: unknown): TechTreeImportResult {
    const parsed = this.parseJson(json);
    const normalized = this.normalizeTree(parsed);
    const migrated = this.applyMigrations(normalized.tree);
    const ordered = this.sortForDeterminism(migrated.tree);
    const validationIssues = this.validateTree(ordered);

    const issues = [...normalized.issues, ...migrated.issues, ...validationIssues];
    this.throwIfErrors(issues);

    return {
      tree: ordered,
      issues,
      normalizedFrom: json,
    };
  }

  exportTechTree(tree: TechTree): TechTreeExportResult {
    const normalized = this.normalizeTree(tree as unknown as Record<string, unknown>);
    const migrated = this.applyMigrations(normalized.tree);
    const ordered = this.sortForDeterminism(migrated.tree);
    const validationIssues = this.validateTree(ordered);

    const issues = [...normalized.issues, ...migrated.issues, ...validationIssues];
    this.throwIfErrors(issues);

    return {
      json: JSON.stringify(ordered, null, 2),
      issues,
      orderedTree: ordered,
    };
  }

  private parseJson(json: unknown): Record<string, unknown> {
    if (typeof json === 'string') {
      try {
        return JSON.parse(json) as Record<string, unknown>;
      } catch (error) {
        throw new Error('Tech tree payload is not valid JSON.');
      }
    }

    if (json && typeof json === 'object') {
      return json as Record<string, unknown>;
    }

    throw new Error('Tech tree payload must be a JSON string or object.');
  }

  private normalizeTree(raw: Record<string, unknown>): NormalizedTreeResult {
    const issues: TechTreeValidationIssue[] = [];
    const rawTree = raw as Partial<TechTree> & Record<string, unknown>;

    const techTreeId = normalizeIdentifier(
      (rawTree.tech_tree_id as string) ?? (rawTree as Record<string, string>)['techTreeId'] ?? ''
    );

    const nodes = Array.isArray(rawTree.nodes)
      ? (rawTree.nodes as unknown[]).map((node, index) => this.normalizeNode(node, `nodes[${index}]`, issues))
      : [];

    const normalizedTree: TechTree = {
      tech_tree_id: techTreeId,
      version: this.toInteger(rawTree.version, 'version', issues),
      default_culture_tags: this.normalizeCultureTagArray(
        (rawTree.default_culture_tags as string[] | undefined)
          || (rawTree as Record<string, string[]>)['defaultCultureTags']
          || [],
        'default_culture_tags',
        issues,
      ),
      nodes,
      ordering: rawTree.ordering ? this.normalizeOrdering(rawTree.ordering as TechTreeOrdering) : undefined,
      metadata: (rawTree.metadata as TechTree['metadata']) || undefined,
    };

    return { tree: normalizedTree, issues };
  }

  private normalizeNode(raw: unknown, path: string, issues: TechTreeValidationIssue[]): TechNode {
    const nodeObject = (raw || {}) as Partial<TechNode> & Record<string, unknown>;
    const nodeId = normalizeIdentifier((nodeObject.id as string) || '');

    const cultureTags = this.normalizeCultureTagArray(
      (nodeObject.culture_tags as string[]) || (nodeObject as Record<string, string[]>)['cultureTags'] || [],
      `${path}.culture_tags`,
      issues,
    );

    const node: TechNode = {
      id: nodeId,
      title: ((nodeObject.title as string) || '').trim(),
      summary: ((nodeObject.summary as string) || '').trim(),
      tier: this.normalizeTier(nodeObject.tier, `${path}.tier`, issues),
      display_order: this.normalizeDisplayOrder(nodeObject.display_order, `${path}.display_order`, issues),
      category: ((nodeObject.category as string) || '').trim() || undefined,
      culture_tags: cultureTags,
      prerequisites: this.normalizePrerequisites(
        (nodeObject.prerequisites as TechNodePrerequisite[]) || [],
        `${path}.prerequisites`,
        issues,
      ),
      effects: this.normalizeEffects((nodeObject.effects as Partial<TechNodeEffects>) || {}, `${path}.effects`, issues),
      metadata: this.normalizeMetadata((nodeObject.metadata as Record<string, unknown>) || {}, `${path}.metadata`, issues),
    };

    return node;
  }

  private normalizePrerequisites(
    rawPrerequisites: TechNodePrerequisite[],
    path: string,
    issues: TechTreeValidationIssue[],
  ): TechNodePrerequisite[] {
    if (!Array.isArray(rawPrerequisites)) {
      return [];
    }

    return rawPrerequisites
      .map((prerequisite, index) => {
        const node = normalizeIdentifier(((prerequisite as TechNodePrerequisite).node as string) || '');
        const relation = (prerequisite as TechNodePrerequisite).relation || TECH_PREREQUISITE_RELATION.Requires;

        if (relation !== TECH_PREREQUISITE_RELATION.Requires) {
          issues.push({
            path: `${path}[${index}].relation`,
            message: `Unsupported prerequisite relation "${relation}" replaced with "requires".`,
            severity: 'warning',
          });
        }

        return node
          ? {
              node,
              relation: TECH_PREREQUISITE_RELATION.Requires,
            }
          : undefined;
      })
      .filter((value): value is TechNodePrerequisite => Boolean(value));
  }

  private normalizeEffects(
    effects: Partial<TechNodeEffects>,
    path: string,
    issues: TechTreeValidationIssue[],
  ): TechNodeEffects {
    const normalizeEnumArray = <T extends string>(
      values: unknown,
      map: EnumNormalizationMap,
      key: string,
    ): T[] => {
      if (!Array.isArray(values)) return [];

      const normalized = mapValuesToCanonical(values as string[], map);
      const allowedValues = new Set(Object.values(map));

      normalized.forEach((value) => {
        if (!allowedValues.has(value)) {
          issues.push({
            path: `${path}.${key}`,
            message: `Value "${value}" is not present in authoritative enum; kept as fallback.`,
            severity: 'warning',
          });
        }
      });

      return normalized as T[];
    };

    const normalized: TechNodeEffects = {
      unlock_structures: normalizeEnumArray<StructureType>(effects.unlock_structures, this.enumNormalizationMaps.structures, 'unlock_structures'),
      unlock_structure_effects: normalizeEnumArray(
        effects.unlock_structure_effects,
        this.enumNormalizationMaps.structureEffects,
        'unlock_structure_effects',
      ),
      unlock_goods: normalizeEnumArray<GoodsType>(effects.unlock_goods, this.enumNormalizationMaps.goods, 'unlock_goods'),
      unlock_settlements: normalizeEnumArray<SettlementType>(effects.unlock_settlements, this.enumNormalizationMaps.settlements, 'unlock_settlements'),
      unlock_guilds: normalizeEnumArray<GuildType>(effects.unlock_guilds, this.enumNormalizationMaps.guilds, 'unlock_guilds'),
      flora_unlocks: normalizeEnumArray<FloraUseType>(effects.flora_unlocks, this.enumNormalizationMaps.floraUses, 'flora_unlocks'),
      grants_settlement_specialization: effects.grants_settlement_specialization,
      research_rate_modifier:
        effects.research_rate_modifier !== undefined
          ? Number(effects.research_rate_modifier)
          : undefined,
      metadata: effects.metadata,
      guild_reputation: Array.isArray(effects.guild_reputation)
        ? effects.guild_reputation
            .map((entry: { guild: GuildType; delta: number }, index: number) => {
              const mappedGuild = normalizeEnumValue(
                (entry as { guild: GuildType }).guild,
                this.enumNormalizationMaps.guilds,
              );
              const delta = Number((entry as { delta: number }).delta);

              if (!mappedGuild.isKnown) {
                issues.push({
                  path: `${path}.guild_reputation[${index}].guild`,
                  message: `Guild "${mappedGuild.normalized}" is not present in authoritative enum; kept as fallback.`,
                  severity: 'warning',
                });
              }

              if (!Number.isFinite(delta)) {
                issues.push({
                  path: `${path}.guild_reputation[${index}].delta`,
                  message: 'guild_reputation.delta must be a finite number.',
                  severity: 'error',
                });
              }

              const guild = (mappedGuild.canonical ?? mappedGuild.normalized) as GuildType;
              return { guild, delta: Number.isFinite(delta) ? delta : 0 };
            })
            .filter((value: { guild: GuildType; delta: number }) => Boolean(value.guild))
        : undefined,
    };

    return normalized;
  }

  private normalizeMetadata(
    metadata: Partial<TechNodeMetadata>,
    path: string,
    issues: TechTreeValidationIssue[],
  ): TechNodeMetadata | undefined {
    if (!metadata || typeof metadata !== 'object' || !Object.keys(metadata).length) {
      return undefined;
    }

    const normalized: TechNodeMetadata = {};

    if (Array.isArray(metadata.culture_overlays)) {
      normalized.culture_overlays = metadata.culture_overlays
        .map((overlay: NonNullable<TechNodeMetadata['culture_overlays']>[number], index: number) => {
          const tag = normalizeIdentifier(String(overlay.tag || ''));
          if (!tag) return undefined;

          if (!this.cultureTagVocabulary[tag]) {
            issues.push({
              path: `${path}.culture_overlays[${index}].tag`,
              message: `Culture overlay tag "${tag}" is not part of the authoritative vocabulary; kept as fallback.`,
              severity: 'warning',
            });
          }

          return {
            ...overlay,
            tag,
          };
        })
        .filter((value): value is NonNullable<TechNodeMetadata['culture_overlays']>[number] => Boolean(value));
    }

    if (metadata.icon_id) {
      normalized.icon_id = normalizeIdentifier(String(metadata.icon_id));
    }

    if (Array.isArray(metadata.icon_overlays)) {
      normalized.icon_overlays = this.normalizeCultureTagArray(
        metadata.icon_overlays as string[],
        `${path}.icon_overlays`,
        issues,
      );
    }

    if (metadata.custom) {
      normalized.custom = metadata.custom;
    }

    return Object.keys(normalized).length ? normalized : undefined;
  }

  private normalizeOrdering(ordering: TechTreeOrdering): TechTreeOrdering {
    const nodes = this.normalizeStringArray(ordering.nodes as string[]);
    const prerequisites = ordering.prerequisites || {};
    const normalizedPrereqs: Record<string, string[]> = {};

    Object.keys(prerequisites).forEach((key) => {
      const normalizedKey = normalizeIdentifier(key);
      normalizedPrereqs[normalizedKey] = this.normalizeStringArray(prerequisites[key]);
    });

    return {
      nodes,
      prerequisites: normalizedPrereqs,
    };
  }

  private sortForDeterminism(tree: TechTree): TechTree {
    const nodes = [...tree.nodes]
      .map((node) => ({
        ...node,
        tier: this.clampTier(node.tier),
        culture_tags: this.uniqueAndSort(node.culture_tags),
        prerequisites: this.sortPrerequisites(node.prerequisites),
        effects: node.effects ? this.orderEffects(node.effects) : undefined,
      }))
      .sort((left, right) => {
        const tierDelta = this.clampTier(left.tier) - this.clampTier(right.tier);
        if (tierDelta !== 0) {
          return tierDelta;
        }

        const displayOrderDelta = (left.display_order ?? Number.MAX_SAFE_INTEGER)
          - (right.display_order ?? Number.MAX_SAFE_INTEGER);
        if (displayOrderDelta !== 0) {
          return displayOrderDelta;
        }

        return left.id.localeCompare(right.id);
      });

    const orderedTree: TechTree = {
      tech_tree_id: tree.tech_tree_id,
      version: tree.version,
      default_culture_tags: this.uniqueAndSort(tree.default_culture_tags),
      nodes,
      ordering: this.buildOrdering(nodes),
      metadata: tree.metadata,
    };

    return orderedTree;
  }

  private buildOrdering(nodes: TechNode[]): TechTreeOrdering {
    const prerequisites: Record<string, string[]> = {};

    nodes.forEach((node) => {
      prerequisites[node.id] = node.prerequisites.map((prerequisite) => prerequisite.node);
    });

    return {
      nodes: nodes.map((node) => node.id),
      prerequisites,
    };
  }

  private sortPrerequisites(prerequisites: TechNodePrerequisite[]): TechNodePrerequisite[] {
    const deduped = new Map<string, TechNodePrerequisite>();

    prerequisites.forEach((prerequisite) => {
      if (prerequisite.node) {
        deduped.set(prerequisite.node, {
          node: prerequisite.node,
          relation: TECH_PREREQUISITE_RELATION.Requires,
        });
      }
    });

    return Array.from(deduped.values()).sort((left, right) => left.node.localeCompare(right.node));
  }

  private orderEffects(effects: TechNodeEffects): TechNodeEffects {
    return {
      unlock_structures: this.uniqueAndSort(effects.unlock_structures || []),
      unlock_structure_effects: this.uniqueAndSort(effects.unlock_structure_effects || []),
      unlock_goods: this.uniqueAndSort(effects.unlock_goods || []),
      unlock_settlements: this.uniqueAndSort(effects.unlock_settlements || []),
      unlock_guilds: this.uniqueAndSort(effects.unlock_guilds || []),
      flora_unlocks: this.uniqueAndSort(effects.flora_unlocks || []),
      grants_settlement_specialization: effects.grants_settlement_specialization,
      guild_reputation: effects.guild_reputation
        ? effects.guild_reputation
            .map((entry: { guild: GuildType; delta: number }) => ({ guild: entry.guild, delta: entry.delta }))
            .sort((left: { guild: GuildType }, right: { guild: GuildType }) => left.guild.localeCompare(right.guild))
        : undefined,
      research_rate_modifier: effects.research_rate_modifier,
      metadata: effects.metadata,
    } as TechNodeEffects;
  }

  private validateTree(tree: TechTree): TechTreeValidationIssue[] {
    const issues: TechTreeValidationIssue[] = [];

    if (!tree.tech_tree_id) {
      issues.push({ path: 'tech_tree_id', message: 'Tech tree id is required.', severity: 'error' });
    }

    if (!Number.isInteger(tree.version) || tree.version < 0) {
      issues.push({ path: 'version', message: 'Tech tree version must be a non-negative integer.', severity: 'error' });
    }

    if (!Array.isArray(tree.nodes) || tree.nodes.length === 0) {
      issues.push({ path: 'nodes', message: 'Tech tree must include at least one node.', severity: 'error' });
      return issues;
    }

    const nodeIds = new Set<string>();
    tree.nodes.forEach((node, index) => {
      if (!node.id) {
        issues.push({ path: `nodes[${index}].id`, message: 'Every tech node must have an id.', severity: 'error' });
      }

      if (nodeIds.has(node.id)) {
        issues.push({ path: `nodes[${index}].id`, message: `Duplicate tech node id detected: ${node.id}`, severity: 'error' });
      }

      nodeIds.add(node.id);
    });

    tree.nodes.forEach((node, index) => {
      if (!node.title.trim() || !node.summary.trim()) {
        issues.push({
          path: `nodes[${index}]`,
          message: `Tech node ${node.id || index} must include a title and summary.`,
          severity: 'error',
        });
      }

      const cultureTags = node.culture_tags.length > 0 ? node.culture_tags : tree.default_culture_tags;
      if (!cultureTags.length) {
        issues.push({
          path: `nodes[${index}].culture_tags`,
          message: 'Each node must specify culture tags or rely on default_culture_tags.',
          severity: 'error',
        });
      }

      cultureTags.forEach((tag) => {
        if (!this.cultureTagVocabulary[tag]) {
          issues.push({
            path: `nodes[${index}].culture_tags`,
            message: `Culture tag "${tag}" is not in the authoritative vocabulary; kept as fallback.`,
            severity: 'warning',
          });
        }
      });

      this.validateEffects(node.effects, `nodes[${index}].effects`, issues);
      this.validatePrerequisites(node, nodeIds, `nodes[${index}].prerequisites`, issues);
    });

    issues.push(...this.assertAcyclicPrerequisites(tree.nodes));
    return issues;
  }

  private validateEffects(effects: TechNodeEffects | undefined, context: string, issues: TechTreeValidationIssue[]): void {
    if (!effects) return;

    this.assertEnumValues(effects.unlock_structures || [], StructureType, `${context}.unlock_structures`, issues);
    this.assertEnumValues(effects.unlock_goods || [], GoodsType, `${context}.unlock_goods`, issues);
    this.assertEnumValues(
      effects.unlock_structure_effects || [],
      StructureEffect,
      `${context}.unlock_structure_effects`,
      issues,
    );
    this.assertEnumValues(
      effects.unlock_settlements || [],
      SettlementType,
      `${context}.unlock_settlements`,
      issues,
    );
    this.assertEnumValues(
      effects.flora_unlocks || [],
      FloraUseType as unknown as Record<string, string>,
      `${context}.flora_unlocks`,
      issues,
    );

    if (effects.grants_settlement_specialization &&
      !Object.values(SettlementSpecialization).includes(effects.grants_settlement_specialization)) {
      issues.push({
        path: `${context}.grants_settlement_specialization`,
        message: 'Settlement specialization must use the authoritative enum or be removed.',
        severity: 'error',
      });
    }

    if (effects.guild_reputation) {
      effects.guild_reputation.forEach((entry: { guild: GuildType; delta: number }, index: number) => {
        if (!Object.values(GuildType).includes(entry.guild)) {
          issues.push({
            path: `${context}.guild_reputation[${index}].guild`,
            message: `Guild "${entry.guild}" is not present in authoritative enum; kept as fallback.`,
            severity: 'warning',
          });
        }

        if (!Number.isFinite(entry.delta)) {
          issues.push({
            path: `${context}.guild_reputation[${index}].delta`,
            message: 'guild_reputation.delta must be a finite number.',
            severity: 'error',
          });
        }
      });
    }

    if (effects.research_rate_modifier !== undefined && !Number.isFinite(effects.research_rate_modifier)) {
      issues.push({
        path: `${context}.research_rate_modifier`,
        message: 'research_rate_modifier must be a finite number.',
        severity: 'error',
      });
    }
  }

  private validatePrerequisites(
    node: TechNode,
    nodeIds: Set<string>,
    path: string,
    issues: TechTreeValidationIssue[],
  ): void {
    node.prerequisites.forEach((prerequisite, index) => {
      if (!prerequisite.node) {
        issues.push({ path: `${path}[${index}]`, message: 'Prerequisite entry is missing a node id.', severity: 'error' });
      }

      if (prerequisite.relation !== TECH_PREREQUISITE_RELATION.Requires) {
        issues.push({
          path: `${path}[${index}].relation`,
          message: `Invalid prerequisite relation on ${node.id}: ${prerequisite.relation}`,
          severity: 'error',
        });
      }

      if (prerequisite.node && !nodeIds.has(prerequisite.node)) {
        issues.push({
          path: `${path}[${index}]`,
          message: `Prerequisite references unknown node ${prerequisite.node}.`,
          severity: 'error',
        });
      }
    });
  }

  private assertAcyclicPrerequisites(nodes: TechNode[]): TechTreeValidationIssue[] {
    const issues: TechTreeValidationIssue[] = [];
    const adjacency: Record<string, string[]> = {};
    const visitState: Record<string, 'unvisited' | 'visiting' | 'visited'> = {};

    nodes.forEach((node) => {
      adjacency[node.id] = node.prerequisites.map((prerequisite) => prerequisite.node);
      visitState[node.id] = 'unvisited';
    });

    const hasCycle = (nodeId: string): boolean => {
      if (visitState[nodeId] === 'visiting') {
        return true;
      }

      if (visitState[nodeId] === 'visited') {
        return false;
      }

      visitState[nodeId] = 'visiting';
      for (const neighbor of adjacency[nodeId] || []) {
        if (hasCycle(neighbor)) {
          return true;
        }
      }
      visitState[nodeId] = 'visited';
      return false;
    };

    nodes.forEach((node) => {
      if (visitState[node.id] === 'unvisited' && hasCycle(node.id)) {
        issues.push({
          path: `nodes`,
          message: `Cycle detected in tech tree prerequisites starting at node ${node.id}.`,
          severity: 'error',
        });
      }
    });

    return issues;
  }

  private assertEnumValues(
    values: string[],
    enumObject: Record<string, string>,
    context: string,
    issues: TechTreeValidationIssue[],
  ): void {
    const allowed = new Set(Object.values(enumObject));
    values.forEach((value) => {
      if (!allowed.has(value)) {
        issues.push({
          path: context,
          message: `${value} is not part of the authoritative enum; kept as fallback.`,
          severity: 'warning',
        });
      }
    });
  }

  private normalizeCultureTagArray(
    tags: string[],
    path: string,
    issues: TechTreeValidationIssue[],
  ): CultureTagId[] {
    if (!Array.isArray(tags)) return [];

    return this.uniqueAndSort(
      tags
        .map((tag) => normalizeIdentifier(tag))
        .filter((tag) => {
          if (!tag) return false;
          if (!this.cultureTagVocabulary[tag]) {
            issues.push({
              path,
              message: `Culture tag "${tag}" is not in the authoritative vocabulary; kept as fallback.`,
              severity: 'warning',
            });
          }
          return true;
        }) as CultureTagId[],
    );
  }

  private normalizeTier(value: unknown, path: string, issues: TechTreeValidationIssue[]): number {
    const parsed = this.toInteger(value, path, issues, 1);
    if (parsed < 1 || parsed > 256) {
      issues.push({
        path,
        message: 'Tier must be between 1 and 256 (inclusive) to remain deterministic.',
        severity: 'error',
      });
    }
    return this.clampTier(parsed);
  }

  private normalizeDisplayOrder(
    value: unknown,
    path: string,
    issues: TechTreeValidationIssue[],
  ): number | undefined {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    const parsed = this.toInteger(value, path, issues, 0);
    if (parsed < 0) {
      issues.push({
        path,
        message: 'display_order must be zero or positive; clamped to 0.',
        severity: 'warning',
      });
      return 0;
    }
    return parsed;
  }

  private clampTier(value?: number): number {
    if (!Number.isFinite(value)) return 1;
    return Math.min(256, Math.max(1, value || 1));
  }

  private normalizeStringArray(values?: string[]): string[] {
    if (!Array.isArray(values)) {
      return [];
    }
    return this.uniqueAndSort(values.map((value) => (value || '').toString().trim()).filter(Boolean));
  }

  private uniqueAndSort<T extends string>(values: T[]): T[] {
    return Array.from(new Set(values)).sort((left, right) => left.localeCompare(right));
  }

  private toInteger(value: unknown, path: string, issues: TechTreeValidationIssue[], fallback = 0): number {
    const parsed = Number(value ?? fallback);
    if (!Number.isInteger(parsed)) {
      issues.push({ path, message: `${path} must be an integer; defaulting to ${fallback}.`, severity: 'warning' });
      return fallback;
    }
    return parsed;
  }

  private buildCultureTagVocabulary(): Record<string, CultureTagDefinition> {
    const vocabulary: Record<string, CultureTagDefinition> = {};

    const register = <T extends string>(enumObject: Record<string, T>, source: CultureTagNamespace) => {
      Object.values(enumObject).forEach((value) => {
        const normalized = `${source}_${normalizeIdentifier(String(value))}` as CultureTagId;
        vocabulary[normalized] = {
          id: normalized,
          source,
          sourceValue: value as unknown as Biome | SettlementType | GuildType,
        };
      });
    };

    register(Biome, 'biome');
    register(SettlementType, 'settlement');
    register(GuildType, 'guild');

    return vocabulary;
  }

  private applyMigrations(tree: TechTree): NormalizedTreeResult {
    let migrated: TechTree = { ...tree };
    const issues: TechTreeValidationIssue[] = [];

    Object.keys(this.migrations)
      .map((version) => Number(version))
      .sort((a, b) => a - b)
      .forEach((version) => {
        if ((migrated.metadata?.last_migration_applied ?? migrated.version) < version) {
          migrated = this.migrations[version](migrated);
          migrated = {
            ...migrated,
            metadata: { ...(migrated.metadata || {}), last_migration_applied: version },
          };
          issues.push({
            path: 'metadata.last_migration_applied',
            message: `Applied migration ${version}.`,
            severity: 'warning',
          });
        }
      });

    return { tree: migrated, issues };
  }

  private throwIfErrors(issues: TechTreeValidationIssue[]): void {
    const errors = issues.filter((issue) => issue.severity === 'error');
    if (errors.length) {
      const message = errors.map((issue) => `${issue.path}: ${issue.message}`).join(' | ');
      throw new Error(`Tech tree validation failed: ${message}`);
    }
  }
}
