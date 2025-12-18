import { Injectable } from '@angular/core';
import { Biome } from '../enums/Biome';
import { GoodsType } from '../enums/GoodsType';
import { GuildType } from '../enums/GuildType';
import { SettlementSpecialization } from '../enums/SettlementSpecialization';
import { SettlementType } from '../enums/SettlementType';
import { StructureType } from '../enums/StructureType';
import {
  TechEffects,
  TechNode,
  TechPrerequisiteLink,
  TechPrerequisiteRelation,
  TechTree,
  TechTreeOrdering,
} from '../models/tech-tree.model';

type CultureTagDefinition = {
  source: 'biome' | 'settlement' | 'guild';
  enumValue: Biome | SettlementType | GuildType;
};

@Injectable({
  providedIn: 'root',
})
export class TechTreeIoService {
  private readonly cultureTagVocabulary: Record<string, CultureTagDefinition> = {
    biome_taiga: { source: 'biome', enumValue: Biome.Taiga },
    biome_beach: { source: 'biome', enumValue: Biome.Beach },
    settlement_trading_post: { source: 'settlement', enumValue: SettlementType.TradingPost },
    settlement_hamlet: { source: 'settlement', enumValue: SettlementType.Hamlet },
    guild_merchants: { source: 'guild', enumValue: GuildType.Merchants },
    guild_scholars: { source: 'guild', enumValue: GuildType.Scholars },
  };

  private readonly migrations: Record<number, (tree: TechTree) => TechTree> = {};

  importTechTree(json: unknown): TechTree {
    const parsed = this.parseJson(json);
    const migrated = this.applyMigrations(parsed);
    const normalized = this.normalizeTree(migrated);
    this.validateTree(normalized);
    return this.sortForDeterminism(normalized);
  }

  exportTechTree(tree: TechTree): string {
    const normalized = this.normalizeTree(tree);
    this.validateTree(normalized);
    const ordered = this.sortForDeterminism(normalized);
    return JSON.stringify(ordered, null, 2);
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

  private applyMigrations(tree: Record<string, unknown>): TechTree {
    const targetVersion = this.toNumber(tree.version);
    let migrated: TechTree = { ...(tree as TechTree), version: targetVersion };

    Object.keys(this.migrations)
      .map(version => Number(version))
      .sort((a, b) => a - b)
      .forEach(version => {
        if (migrated.version < version) {
          migrated = this.migrations[version](migrated);
        }
      });

    return migrated;
  }

  private normalizeTree(raw: Record<string, unknown>): TechTree {
    const techTreeId = this.normalizeIdentifier(
      (raw.tech_tree_id as string) ?? (raw as Record<string, string>).techTreeId ?? ''
    );

    const nodes = Array.isArray(raw.nodes)
      ? (raw.nodes as unknown[]).map(node => this.normalizeNode(node))
      : [];

    return {
      tech_tree_id: techTreeId,
      version: this.toNumber(raw.version),
      default_culture_tags: this.normalizeCultureTagArray(
        (raw.default_culture_tags as string[] | undefined) || (raw as Record<string, string[]>).defaultCultureTags || []
      ),
      nodes,
      ordering: raw.ordering ? this.normalizeOrdering(raw.ordering as TechTreeOrdering) : undefined,
      metadata: (raw.metadata as Record<string, unknown>) || undefined,
    };
  }

  private normalizeNode(raw: unknown): TechNode {
    const nodeObject = (raw || {}) as Record<string, unknown>;
    const nodeId = this.normalizeIdentifier((nodeObject.id as string) || '');

    return {
      id: nodeId,
      title: ((nodeObject.title as string) || '').trim(),
      summary: ((nodeObject.summary as string) || '').trim(),
      culture_tags: this.normalizeCultureTagArray(
        (nodeObject.culture_tags as string[]) || (nodeObject as Record<string, string[]>).cultureTags || []
      ),
      prerequisites: this.normalizePrerequisites((nodeObject.prerequisites as TechPrerequisiteLink[]) || []),
      effects: this.normalizeEffects((nodeObject.effects as Partial<TechEffects>) || {}),
      metadata: (nodeObject.metadata as Record<string, unknown>) || undefined,
    };
  }

  private normalizePrerequisites(rawPrerequisites: TechPrerequisiteLink[]): TechPrerequisiteLink[] {
    if (!Array.isArray(rawPrerequisites)) {
      return [];
    }

    return rawPrerequisites
      .map(prerequisite => {
        const node = this.normalizeIdentifier(((prerequisite as TechPrerequisiteLink).node as string) || '');
        const relation = (prerequisite as TechPrerequisiteLink).relation || TechPrerequisiteRelation.Requires;

        return node
          ? {
              node,
              relation: relation === TechPrerequisiteRelation.Requires ? relation : TechPrerequisiteRelation.Requires,
            }
          : undefined;
      })
      .filter((value): value is TechPrerequisiteLink => Boolean(value));
  }

  private normalizeEffects(effects: Partial<TechEffects>): TechEffects {
    return {
      unlock_structures: this.normalizeStringArray(effects.unlock_structures as string[]),
      unlock_goods: this.normalizeStringArray(effects.unlock_goods as string[]),
      grants_settlement_specialization: effects.grants_settlement_specialization,
      guild_reputation: effects.guild_reputation
        ? {
            guild: effects.guild_reputation.guild,
            delta: this.toNumber(effects.guild_reputation.delta),
          }
        : undefined,
      research_rate_modifier:
        effects.research_rate_modifier !== undefined
          ? this.toNumber(effects.research_rate_modifier)
          : undefined,
      metadata: effects.metadata,
    };
  }

  private normalizeOrdering(ordering: TechTreeOrdering): TechTreeOrdering {
    const nodes = this.normalizeStringArray(ordering.nodes as string[]);
    const prerequisites = ordering.prerequisites || {};
    const normalizedPrereqs: Record<string, string[]> = {};

    Object.keys(prerequisites).forEach(key => {
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
      .map(node => ({
        ...node,
        culture_tags: this.uniqueAndSort(node.culture_tags),
        prerequisites: this.sortPrerequisites(node.prerequisites),
        effects: this.orderEffects(node.effects),
      }))
      .sort((left, right) => left.id.localeCompare(right.id));

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

    nodes.forEach(node => {
      prerequisites[node.id] = node.prerequisites.map(prerequisite => prerequisite.node);
    });

    return {
      nodes: nodes.map(node => node.id),
      prerequisites,
    };
  }

  private sortPrerequisites(prerequisites: TechPrerequisiteLink[]): TechPrerequisiteLink[] {
    const deduped = new Map<string, TechPrerequisiteLink>();

    prerequisites.forEach(prerequisite => {
      if (prerequisite.node) {
        deduped.set(prerequisite.node, {
          node: prerequisite.node,
          relation: TechPrerequisiteRelation.Requires,
        });
      }
    });

    return Array.from(deduped.values()).sort((left, right) => left.node.localeCompare(right.node));
  }

  private orderEffects(effects: TechEffects): TechEffects {
    return {
      unlock_structures: this.uniqueAndSort(effects.unlock_structures || []),
      unlock_goods: this.uniqueAndSort(effects.unlock_goods || []),
      grants_settlement_specialization: effects.grants_settlement_specialization,
      guild_reputation: effects.guild_reputation
        ? { guild: effects.guild_reputation.guild, delta: effects.guild_reputation.delta }
        : undefined,
      research_rate_modifier: effects.research_rate_modifier,
      metadata: effects.metadata,
    };
  }

  private validateTree(tree: TechTree): void {
    if (!tree.tech_tree_id) {
      throw new Error('Tech tree id is required.');
    }

    if (!Number.isInteger(tree.version) || tree.version < 0) {
      throw new Error('Tech tree version must be a non-negative integer.');
    }

    if (tree.default_culture_tags.length > 0) {
      this.assertCultureTags(tree.default_culture_tags, 'default_culture_tags');
    }

    if (!Array.isArray(tree.nodes) || tree.nodes.length === 0) {
      throw new Error('Tech tree must include at least one node.');
    }

    const nodeIds = new Set<string>();
    tree.nodes.forEach(node => {
      if (!node.id) {
        throw new Error('Every tech node must have an id.');
      }

      if (nodeIds.has(node.id)) {
        throw new Error(`Duplicate tech node id detected: ${node.id}`);
      }

      nodeIds.add(node.id);
    });

    tree.nodes.forEach(node => {
      if (!node.title.trim() || !node.summary.trim()) {
        throw new Error(`Tech node ${node.id} must include a title and summary.`);
      }

      const cultureTags = node.culture_tags.length > 0 ? node.culture_tags : tree.default_culture_tags;
      this.assertCultureTags(cultureTags, `culture tags for node ${node.id}`);

      this.validateEffects(node.effects, node.id);
      this.validatePrerequisites(node, nodeIds);
    });

    this.assertAcyclicPrerequisites(tree.nodes);
  }

  private validateEffects(effects: TechEffects, context: string): void {
    this.assertEnumValues(effects.unlock_structures, StructureType, `unlock_structures in ${context}`);
    this.assertEnumValues(effects.unlock_goods, GoodsType, `unlock_goods in ${context}`);

    if (effects.grants_settlement_specialization) {
      this.assertEnumValue(
        effects.grants_settlement_specialization,
        SettlementSpecialization,
        `grants_settlement_specialization in ${context}`
      );
    }

    if (effects.guild_reputation) {
      this.assertEnumValue(effects.guild_reputation.guild, GuildType, `guild_reputation.guild in ${context}`);

      if (!Number.isFinite(effects.guild_reputation.delta)) {
        throw new Error(`guild_reputation.delta in ${context} must be a finite number.`);
      }
    }

    if (effects.research_rate_modifier !== undefined && !Number.isFinite(effects.research_rate_modifier)) {
      throw new Error(`research_rate_modifier in ${context} must be a finite number.`);
    }
  }

  private validatePrerequisites(node: TechNode, nodeIds: Set<string>): void {
    node.prerequisites.forEach(prerequisite => {
      if (!prerequisite.node) {
        throw new Error(`Prerequisite entry on ${node.id} is missing a node id.`);
      }

      if (prerequisite.relation !== TechPrerequisiteRelation.Requires) {
        throw new Error(`Invalid prerequisite relation on ${node.id}: ${prerequisite.relation}`);
      }

      if (!nodeIds.has(prerequisite.node)) {
        throw new Error(`Prerequisite on ${node.id} references unknown node ${prerequisite.node}.`);
      }
    });
  }

  private assertAcyclicPrerequisites(nodes: TechNode[]): void {
    const adjacency: Record<string, string[]> = {};
    const visitState: Record<string, 'unvisited' | 'visiting' | 'visited'> = {};

    nodes.forEach(node => {
      adjacency[node.id] = node.prerequisites.map(prerequisite => prerequisite.node);
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

    nodes.forEach(node => {
      if (visitState[node.id] === 'unvisited' && hasCycle(node.id)) {
        throw new Error(`Cycle detected in tech tree prerequisites starting at node ${node.id}.`);
      }
    });
  }

  private assertCultureTags(tags: string[], context: string): void {
    if (!Array.isArray(tags) || tags.length === 0) {
      throw new Error(`${context} must include at least one culture tag.`);
    }

    tags.forEach(tag => {
      if (!this.cultureTagVocabulary[tag]) {
        throw new Error(`${context} contains invalid culture tag: ${tag}`);
      }
    });
  }

  private assertEnumValues(values: string[], enumObject: Record<string, string>, context: string): void {
    const allowed = new Set(Object.values(enumObject));
    values.forEach(value => this.assertEnumValue(value, enumObject, context, allowed));
  }

  private assertEnumValue(
    value: string,
    enumObject: Record<string, string>,
    context: string,
    allowed?: Set<string>
  ): void {
    const allowedValues = allowed || new Set(Object.values(enumObject));
    if (!allowedValues.has(value)) {
      throw new Error(`${context} must be one of: ${Array.from(allowedValues).join(', ')}`);
    }
  }

  private normalizeIdentifier(value: string): string {
    return value
      .trim()
      .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .replace(/_{2,}/g, '_')
      .toLowerCase();
  }

  private normalizeCultureTagArray(tags: string[]): string[] {
    return this.uniqueAndSort(tags.map(tag => this.normalizeIdentifier(tag)));
  }

  private normalizeStringArray(values?: string[]): string[] {
    if (!Array.isArray(values)) {
      return [];
    }
    return this.uniqueAndSort(values.map(value => (value || '').toString().trim()).filter(Boolean));
  }

  private uniqueAndSort(values: string[]): string[] {
    return Array.from(new Set(values)).sort((left, right) => left.localeCompare(right));
  }

  private toNumber(value: unknown): number {
    return Number(value);
  }
}
