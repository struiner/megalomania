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
  CultureTagBinding,
  CultureTagId,
  CultureTagNamespace,
  TechNode,
  TechNodeEffects,
  TechNodePrerequisite,
  TECH_PREREQUISITE_RELATION,
  TechTree,
  TechTreeExportResult,
  TechTreeImportResult,
  TechTreeOrdering,
  TechTreeValidationIssue,
} from '../models/tech-tree.model';

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

    const techTreeId = this.normalizeIdentifier(
      (raw.tech_tree_id as string) ?? (raw as Record<string, string>).techTreeId ?? ''
    );

    const nodes = Array.isArray(raw.nodes)
      ? (raw.nodes as unknown[]).map((node, index) => this.normalizeNode(node, `nodes[${index}]`, issues))
      : [];

    const normalizedTree: TechTree = {
      tech_tree_id: techTreeId,
      version: this.toInteger(raw.version, 'version', issues),
      default_culture_tags: this.normalizeCultureTagArray(
        (raw.default_culture_tags as string[] | undefined)
          || (raw as Record<string, string[]>).defaultCultureTags
          || [],
        'default_culture_tags',
        issues,
      ),
      nodes,
      ordering: raw.ordering ? this.normalizeOrdering(raw.ordering as TechTreeOrdering) : undefined,
      metadata: (raw.metadata as TechTree['metadata']) || undefined,
    };

    return { tree: normalizedTree, issues };
  }

  private normalizeNode(raw: unknown, path: string, issues: TechTreeValidationIssue[]): TechNode {
    const nodeObject = (raw || {}) as Record<string, unknown>;
    const nodeId = this.normalizeIdentifier((nodeObject.id as string) || '');

    const cultureTags = this.normalizeCultureTagArray(
      (nodeObject.culture_tags as string[]) || (nodeObject as Record<string, string[]>).cultureTags || [],
      `${path}.culture_tags`,
      issues,
    );

    const node: TechNode = {
      id: nodeId,
      title: ((nodeObject.title as string) || '').trim(),
      summary: ((nodeObject.summary as string) || '').trim(),
      tier: this.toInteger(nodeObject.tier, `${path}.tier`, issues, 1),
      category: ((nodeObject.category as string) || '').trim() || undefined,
      culture_tags: cultureTags,
      prerequisites: this.normalizePrerequisites(
        (nodeObject.prerequisites as TechNodePrerequisite[]) || [],
        `${path}.prerequisites`,
        issues,
      ),
      effects: this.normalizeEffects((nodeObject.effects as Partial<TechNodeEffects>) || {}, `${path}.effects`, issues),
      metadata: (nodeObject.metadata as Record<string, unknown>) || undefined,
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
        const node = this.normalizeIdentifier(((prerequisite as TechNodePrerequisite).node as string) || '');
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
    const normalizeEnumArray = (
      values: unknown,
      enumObject: Record<string, string>,
      key: string,
    ): string[] => {
      if (!Array.isArray(values)) return [];

      const allowed = new Set(Object.values(enumObject));
      return this.uniqueAndSort(
        (values as unknown[])
          .map((value) => this.normalizeIdentifier(String(value || '')))
          .filter((value) => {
            if (!value) return false;
            if (!allowed.has(value)) {
              issues.push({
                path: `${path}.${key}`,
                message: `Value "${value}" is not present in authoritative enum; kept as fallback.`,
                severity: 'warning',
              });
            }
            return true;
          }),
      );
    };

    const normalized: TechNodeEffects = {
      unlock_structures: normalizeEnumArray(effects.unlock_structures, StructureType, 'unlock_structures'),
      unlock_structure_effects: normalizeEnumArray(
        effects.unlock_structure_effects,
        StructureEffect,
        'unlock_structure_effects',
      ),
      unlock_goods: normalizeEnumArray(effects.unlock_goods, GoodsType, 'unlock_goods'),
      unlock_settlements: normalizeEnumArray(effects.unlock_settlements, SettlementType, 'unlock_settlements'),
      unlock_guilds: normalizeEnumArray(effects.unlock_guilds, GuildType, 'unlock_guilds'),
      flora_unlocks: normalizeEnumArray(effects.flora_unlocks, FloraUseType as unknown as Record<string, string>, 'flora_unlocks'),
      grants_settlement_specialization: effects.grants_settlement_specialization,
      research_rate_modifier:
        effects.research_rate_modifier !== undefined
          ? Number(effects.research_rate_modifier)
          : undefined,
      metadata: effects.metadata,
      guild_reputation: Array.isArray(effects.guild_reputation)
        ? effects.guild_reputation.map((entry, index) => {
            const guild = (entry as { guild: GuildType }).guild;
            const delta = Number((entry as { delta: number }).delta);

            if (guild && !Object.values(GuildType).includes(guild)) {
              issues.push({
                path: `${path}.guild_reputation[${index}].guild`,
                message: `Guild "${guild}" is not present in authoritative enum; kept as fallback.`,
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

            return { guild, delta } as { guild: GuildType; delta: number };
          })
        : undefined,
    };

    return normalized;
  }

  private normalizeOrdering(ordering: TechTreeOrdering): TechTreeOrdering {
    const nodes = this.normalizeStringArray(ordering.nodes as string[]);
    const prerequisites = ordering.prerequisites || {};
    const normalizedPrereqs: Record<string, string[]> = {};

    Object.keys(prerequisites).forEach((key) => {
      const normalizedKey = this.normalizeIdentifier(key);
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
        culture_tags: this.uniqueAndSort(node.culture_tags),
        prerequisites: this.sortPrerequisites(node.prerequisites),
        effects: node.effects ? this.orderEffects(node.effects) : undefined,
      }))
      .sort((left, right) => {
        if (left.tier !== right.tier) {
          return (left.tier ?? 0) - (right.tier ?? 0);
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
            .map((entry) => ({ guild: entry.guild, delta: entry.delta }))
            .sort((left, right) => left.guild.localeCompare(right.guild))
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
      effects.guild_reputation.forEach((entry, index) => {
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

  private normalizeIdentifier(value: string): string {
    // TODO: reconcile PascalCase enum values (e.g., GoodsType.Mead) with snake_case normalization to avoid fallback warnings and type drift; tracked in tasks/2025-12-18_tech-enum-case-alignment.md.
    return value
      .trim()
      .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .replace(/_{2,}/g, '_')
      .toLowerCase();
  }

  private normalizeCultureTagArray(
    tags: string[],
    path: string,
    issues: TechTreeValidationIssue[],
  ): CultureTagId[] {
    if (!Array.isArray(tags)) return [];

    return this.uniqueAndSort(
      tags
        .map((tag) => this.normalizeIdentifier(tag))
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
        const normalized = `${source}_${this.normalizeIdentifier(String(value))}` as CultureTagId;
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
