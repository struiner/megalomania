import { computed, inject, Injectable, signal } from '@angular/core';
import {
  CultureTagBinding,
  CultureTagId,
  CultureTagNamespace,
  IssueSeverity,
  TechTreeValidationIssue,
} from '../models/tech-tree.models';
import { normalizeIdentifier } from './tech-identifier-normalizer';
import { TechTreeIoService } from './tech-tree-io.service';

type GovernanceStatus = 'authoritative' | 'proposed' | 'edit_proposed' | 'delete_requested';

export interface GovernedCultureTag extends CultureTagBinding {
  status: GovernanceStatus;
  version: number;
  note?: string;
  governanceRef?: string;
}

interface DeleteContext {
  id: CultureTagId;
  referencedBy: string[];
  auditRef?: string;
}

@Injectable({ providedIn: 'root' })
export class CultureTagGovernanceAdapterService {
  private readonly io = inject(TechTreeIoService);
  private readonly proposals = signal<GovernedCultureTag[]>([]);
  private readonly issuesState = signal<TechTreeValidationIssue[]>([]);
  private readonly auditTrailState = signal<string[]>([]);
  private auditCounter = 1;

  readonly vocabulary = computed<GovernedCultureTag[]>(() => {
    const authoritative: GovernedCultureTag[] = this.io.getCultureTagOptions().map((entry) => ({
      ...entry,
      status: 'authoritative' as GovernanceStatus,
      version: 1,
    }));

    const merged = new Map<CultureTagId, GovernedCultureTag>();
    authoritative.forEach((tag) => merged.set(tag.id, tag));
    this.proposals().forEach((tag) => merged.set(tag.id, tag));

    return Array.from(merged.values()).sort((left, right) => left.id.localeCompare(right.id));
  });

  readonly issues = computed(() => this.issuesState());
  readonly auditTrail = computed(() => this.auditTrailState());

  proposeCreate(input: {
    namespace: CultureTagNamespace;
    slug: string;
    note?: string;
    version?: number;
    auditRef?: string;
  }): void {
    const issues: TechTreeValidationIssue[] = [];
    this.ensureNamespace(input.namespace, issues);
    const normalizedSlug = normalizeIdentifier(input.slug);
    if (!normalizedSlug) {
      issues.push(this.toIssue('slug', 'Slug must be snake_case and non-empty.', 'error'));
    }

    const id = `${input.namespace}_${normalizedSlug}` as CultureTagId;
    const existing = this.vocabulary().find((entry) => entry.id === id);
    if (existing) {
      issues.push(
        this.toIssue(
          'id',
          `Tag ${id} already exists as ${existing.status}; governance prevents duplicate creation.`,
          'error',
        ),
      );
    }

    const version = this.normalizeVersion(input.version, 'version', issues, 1);

    if (!issues.some((issue) => issue.severity === 'error')) {
      this.proposals.update((current) => [
        ...current.filter((entry) => entry.id !== id),
        {
          id,
          source: input.namespace,
          sourceValue: normalizedSlug as CultureTagBinding['sourceValue'],
          note: input.note,
          status: 'proposed',
          version,
          governanceRef: input.auditRef || 'tech-tree-editor',
        },
      ]);
      this.recordAudit('proposed create', id, input.auditRef);
    }

    this.issuesState.set(issues);
  }

  proposeEdit(input: { id: CultureTagId; note?: string; version?: number; auditRef?: string }): void {
    const issues: TechTreeValidationIssue[] = [];
    const existing = this.vocabulary().find((entry) => entry.id === input.id);
    if (!existing) {
      issues.push(this.toIssue('id', `Cannot edit unknown tag ${input.id}.`, 'error'));
      this.issuesState.set(issues);
      return;
    }

    const nextVersion = this.normalizeVersion(input.version, 'version', issues, existing.version + 1);

    if (!issues.some((issue) => issue.severity === 'error')) {
      this.proposals.update((current) => [
        ...current.filter((entry) => entry.id !== input.id),
        {
          ...existing,
          status: 'edit_proposed',
          note: input.note ?? existing.note,
          version: nextVersion,
          governanceRef: input.auditRef || 'tech-tree-editor',
        },
      ]);
      this.recordAudit('proposed edit', input.id, input.auditRef);
    }

    this.issuesState.set(issues);
  }

  requestDelete(context: DeleteContext): void {
    const issues: TechTreeValidationIssue[] = [];
    const existing = this.vocabulary().find((entry) => entry.id === context.id);
    if (!existing) {
      issues.push(this.toIssue('id', `Cannot delete unknown tag ${context.id}.`, 'error'));
      this.issuesState.set(issues);
      return;
    }

    if (context.referencedBy.length) {
      issues.push(
        this.toIssue(
          'usage',
          `Deletion blocked; ${context.id} is referenced by ${context.referencedBy.join(', ')}.`,
          'error',
        ),
      );
    }

    if (!issues.some((issue) => issue.severity === 'error')) {
      this.proposals.update((current) => [
        ...current.filter((entry) => entry.id !== context.id),
        {
          ...existing,
          status: 'delete_requested',
          governanceRef: context.auditRef || 'tech-tree-editor',
          version: existing.version + 1,
        },
      ]);
      this.recordAudit('requested delete', context.id, context.auditRef);
    }

    this.issuesState.set(issues);
  }

  private normalizeVersion(
    value: number | undefined,
    path: string,
    issues: TechTreeValidationIssue[],
    fallback: number,
  ): number {
    if (value === undefined || value === null) {
      return fallback;
    }

    if (!Number.isInteger(value) || value < 1) {
      issues.push(this.toIssue(path, 'Version must be a positive integer; falling back to deterministic default.', 'warning'));
      return fallback;
    }

    return value;
  }

  private ensureNamespace(namespace: CultureTagNamespace, issues: TechTreeValidationIssue[]): void {
    if (!['biome', 'settlement', 'guild'].includes(namespace)) {
      issues.push(this.toIssue('namespace', `Namespace ${namespace} is not governed.`, 'error'));
    }
  }

  private toIssue(path: string, message: string, severity: IssueSeverity): TechTreeValidationIssue {
    return { path, message, severity };
  }

  private recordAudit(action: string, id: CultureTagId, auditRef?: string): void {
    this.auditTrailState.update((entries) => [
      ...entries,
      `#${this.auditCounter++} ${action} for ${id} (ref: ${auditRef || 'tech-tree-editor'})`,
    ]);
  }
}
