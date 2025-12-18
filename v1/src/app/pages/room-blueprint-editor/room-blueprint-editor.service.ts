import { Injectable, computed, inject, signal } from '@angular/core';

import { HazardType } from '../../enums/HazardType';
import { RoomBlueprint, RoomBlueprintDimensions, RoomBlueprintFeature, RoomBlueprintValidationNotice } from '../../models/room-blueprint.model';
import { HazardTypeAdapterService, HazardOption } from '../../services/hazard-type-adapter.service';
import { ROOM_BLUEPRINT_FIXTURES, ROOM_BLUEPRINT_VALIDATION_FIXTURES } from './room-blueprint-editor.fixtures';

@Injectable()
export class RoomBlueprintEditorService {
  private hazardAdapter = inject(HazardTypeAdapterService);

  private sequence = signal(ROOM_BLUEPRINT_FIXTURES.length + 1);

  blueprints = signal<RoomBlueprint[]>(ROOM_BLUEPRINT_FIXTURES);
  selectedBlueprintId = signal<string | null>(ROOM_BLUEPRINT_FIXTURES[0]?.id ?? null);
  validationNotices = signal<RoomBlueprintValidationNotice[]>(ROOM_BLUEPRINT_VALIDATION_FIXTURES);

  lastExport = signal<string | null>(null);
  lastImportLabel = signal<string | null>(null);

  hazardOptions = computed<HazardOption[]>(() => this.hazardAdapter.getHazardOptions());
  hazardOptionMap = computed(() => new Map(this.hazardOptions().map((option) => [option.id, option])));

  blueprintSummaries = computed(() =>
    this.blueprints().map((blueprint) => ({
      id: blueprint.id,
      name: blueprint.name,
      purpose: blueprint.purpose,
      hazards: blueprint.hazards,
      area: blueprint.dimensions.width * blueprint.dimensions.height,
      tags: blueprint.metadata?.tags ?? [],
    })),
  );

  selectedBlueprint = computed(() =>
    this.blueprints().find((blueprint) => blueprint.id === this.selectedBlueprintId()) ?? null,
  );

  selectedMetrics = computed(() => {
    const blueprint = this.selectedBlueprint();
    if (!blueprint) {
      return null;
    }

    const { width, height } = blueprint.dimensions;
    const area = width * height;
    const aspectRatio = height === 0 ? 0 : Number((width / height).toFixed(2));

    return { area, aspectRatio };
  });

  noticeCounts = computed(() => {
    const counts: Record<'error' | 'warning', number> = { error: 0, warning: 0 };

    this.validationNotices().forEach((notice) => {
      if (notice.severity === 'error') {
        counts.error += 1;
      }
      if (notice.severity === 'warning') {
        counts.warning += 1;
      }
    });

    return counts;
  });

  selectedNotices = computed(() => {
    const activeId = this.selectedBlueprintId();
    return this.validationNotices().filter((notice) => !notice.blueprintId || notice.blueprintId === activeId);
  });

  selectBlueprint(id: string): void {
    if (this.blueprints().some((blueprint) => blueprint.id === id)) {
      this.selectedBlueprintId.set(id);
    }
  }

  createBlueprint(): void {
    const id = `room-blueprint-${this.sequence()}`;
    this.sequence.update((value) => value + 1);

    const blueprint: RoomBlueprint = {
      id,
      name: 'New Room Blueprint',
      purpose: 'Unspecified',
      hazards: [HazardType.Fire],
      dimensions: { width: 8, height: 8 },
      features: [
        {
          id: `${id}-feature-1`,
          label: 'Unspecified feature',
          detail: 'Replace with structured entry order later.',
        },
      ],
      metadata: {
        source: 'sdk/manual-entry',
        tags: ['draft'],
      },
    };

    this.blueprints.update((list) => [...list, blueprint]);
    this.selectedBlueprintId.set(blueprint.id);
  }

  duplicateSelected(): void {
    const original = this.selectedBlueprint();
    if (!original) {
      return;
    }

    const id = `${original.id}-copy-${this.sequence()}`;
    this.sequence.update((value) => value + 1);

    const copy: RoomBlueprint = {
      ...original,
      id,
      name: `${original.name} (Copy)`,
      features: original.features.map((feature, index) => ({
        ...feature,
        id: `${id}-feature-${index + 1}`,
      })),
    };

    this.blueprints.update((list) => [...list, copy]);
    this.selectedBlueprintId.set(copy.id);
  }

  deleteSelected(): void {
    const activeId = this.selectedBlueprintId();
    if (!activeId) {
      return;
    }

    this.blueprints.update((list) => list.filter((blueprint) => blueprint.id !== activeId));
    this.validationNotices.update((list) => list.filter((notice) => notice.blueprintId !== activeId));

    const remaining = this.blueprints();
    this.selectedBlueprintId.set(remaining[0]?.id ?? null);
  }

  updateBlueprint(partial: Partial<RoomBlueprint>): void {
    this.patchSelected((blueprint) => ({
      ...blueprint,
      ...partial,
      dimensions: partial.dimensions ?? blueprint.dimensions,
      features: partial.features ?? blueprint.features,
      metadata: partial.metadata ?? blueprint.metadata,
    }));
  }

  updateDimensions(partial: Partial<RoomBlueprintDimensions>): void {
    this.patchSelected((blueprint) => ({
      ...blueprint,
      dimensions: {
        ...blueprint.dimensions,
        ...this.coerceDimensions(partial),
      },
    }));
  }

  toggleHazard(hazard: HazardType): void {
    this.patchSelected((blueprint) => {
      const existing = new Set(blueprint.hazards);
      if (existing.has(hazard)) {
        existing.delete(hazard);
      } else {
        existing.add(hazard);
      }

      const allowed = new Set(this.hazardOptions().map((option) => option.id));
      const hazards = Array.from(existing).filter((value) => allowed.has(value));

      return {
        ...blueprint,
        hazards: hazards.sort(),
      };
    });
  }

  addFeature(): void {
    this.patchSelected((blueprint) => {
      const id = `${blueprint.id}-feature-${blueprint.features.length + 1}`;
      return {
        ...blueprint,
        features: [
          ...blueprint.features,
          {
            id,
            label: 'New feature',
            detail: 'Stack structured items in ingress→workspace→egress order.',
          },
        ],
      };
    });
  }

  updateFeature(index: number, partial: Partial<RoomBlueprintFeature>): void {
    this.patchSelected((blueprint) => {
      if (!blueprint.features[index]) {
        return blueprint;
      }

      const features = blueprint.features.map((feature, featureIndex) =>
        featureIndex === index ? { ...feature, ...partial } : feature,
      );

      return { ...blueprint, features };
    });
  }

  removeFeature(index: number): void {
    this.patchSelected((blueprint) => ({
      ...blueprint,
      features: blueprint.features.filter((_, featureIndex) => featureIndex !== index),
    }));
  }

  requestImport(label: string): void {
    this.lastImportLabel.set(label);
  }

  requestExport(): void {
    const blueprint = this.selectedBlueprint();
    if (!blueprint) {
      return;
    }

    const payload = {
      ...blueprint,
      area: this.selectedMetrics()?.area ?? null,
    };

    this.lastExport.set(JSON.stringify(payload, null, 2));
  }

  hazardLabel(id: HazardType): string {
    return this.hazardOptionMap().get(id)?.label ?? this.hazardAdapter.labelFor(id);
  }

  private patchSelected(mutator: (blueprint: RoomBlueprint) => RoomBlueprint): void {
    const activeId = this.selectedBlueprintId();
    if (!activeId) {
      return;
    }

    this.blueprints.update((list) =>
      list.map((blueprint) => (blueprint.id === activeId ? mutator(blueprint) : blueprint)),
    );
  }

  private coerceDimensions(partial: Partial<RoomBlueprintDimensions>): RoomBlueprintDimensions {
    const width = partial.width ?? this.selectedBlueprint()?.dimensions.width ?? 0;
    const height = partial.height ?? this.selectedBlueprint()?.dimensions.height ?? 0;

    return {
      width: Math.max(1, Number.isFinite(width) ? Number(width) : 0),
      height: Math.max(1, Number.isFinite(height) ? Number(height) : 0),
    };
  }
}
