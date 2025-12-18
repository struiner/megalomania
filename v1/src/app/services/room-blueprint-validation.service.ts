import { Injectable } from '@angular/core';
import {
  RoomBlueprint,
  RoomBlueprintValidationOptions,
  RoomBlueprintValidationResult,
  RoomSocket,
  RoomSocketKind,
} from '../models/room-blueprint.models';
import { ValidationNotice } from '../models/validation.models';

@Injectable({
  providedIn: 'root',
})
export class RoomBlueprintValidationService {
  static readonly MIN_DIMENSION = 16;
  static readonly MAX_DIMENSION = 512;

  private readonly defaultSocketKinds: RoomSocketKind[] = ['power', 'data', 'structural', 'fluid'];

  validateBlueprints(
    blueprints: RoomBlueprint[],
    options: RoomBlueprintValidationOptions = {},
  ): RoomBlueprintValidationResult[] {
    const knownBlueprintIds = new Set(blueprints.map((blueprint) => blueprint.id));
    const duplicateIds = this.collectDuplicateIds(blueprints);

    return blueprints.map((blueprint) => {
      const result = this.validateBlueprint(blueprint, { ...options, knownBlueprintIds });
      if (duplicateIds.has(blueprint.id) && options.enforceUniqueBlueprintIds !== false) {
        result.notices = this.sortNotices([
          ...result.notices,
          this.buildNotice(
            'id',
            `Duplicate blueprint id "${blueprint.id}" detected.`,
            'error',
            'Use a unique id to keep import/export deterministic.',
          ),
        ]);
      }
      return result;
    });
  }

  validateBlueprint(
    blueprint: RoomBlueprint,
    options: RoomBlueprintValidationOptions = {},
  ): RoomBlueprintValidationResult {
    const notices: ValidationNotice[] = [];

    this.validateIdentity(blueprint, notices);
    this.validateDimensions(blueprint, notices);
    this.validateFeatures(blueprint, notices);
    this.validateHazards(blueprint, options, notices);
    this.validateSockets(blueprint, options, notices);
    this.validatePrerequisites(blueprint, options, notices);

    return {
      blueprintId: blueprint.id,
      blueprintName: blueprint.name,
      notices: this.sortNotices(notices),
    };
  }

  private validateIdentity(blueprint: RoomBlueprint, notices: ValidationNotice[]): void {
    if (!blueprint.id || !blueprint.id.trim()) {
      notices.push(
        this.buildNotice('id', 'Blueprint id is required for deterministic references.', 'error', 'Provide a stable id.'),
      );
    }

    if (!blueprint.name || !blueprint.name.trim()) {
      notices.push(this.buildNotice('name', 'Room name is required.', 'error', 'Add a descriptive name.'));
    } else if (blueprint.name.trim().length < 3) {
      notices.push(
        this.buildNotice('name', 'Room name is very short; minimum length is 3 characters.', 'warning', 'Expand the name.'),
      );
    } else if (blueprint.name.trim() !== blueprint.name) {
      notices.push(
        this.buildNotice('name', 'Room name has leading or trailing whitespace.', 'warning', 'Trim the whitespace.'),
      );
    }

    if (!blueprint.purpose || !blueprint.purpose.trim()) {
      notices.push(this.buildNotice('purpose', 'Room purpose is required.', 'error', 'State the intended purpose.'));
    } else if (blueprint.purpose.trim() !== blueprint.purpose) {
      notices.push(
        this.buildNotice(
          'purpose',
          'Room purpose has leading or trailing whitespace.',
          'warning',
          'Trim the whitespace.',
        ),
      );
    }
  }

  private validateDimensions(blueprint: RoomBlueprint, notices: ValidationNotice[]): void {
    const width = blueprint.width;
    const height = blueprint.height;

    if (!Number.isFinite(width)) {
      notices.push(this.buildNotice('dimensions.width', 'Width must be a finite number.', 'error', 'Set a numeric width.'));
    }

    if (!Number.isFinite(height)) {
      notices.push(this.buildNotice('dimensions.height', 'Height must be a finite number.', 'error', 'Set a numeric height.'));
    }

    if (Number.isFinite(width) && !Number.isInteger(width)) {
      notices.push(this.buildNotice('dimensions.width', 'Width must be an integer.', 'error', 'Round to a whole number.'));
    }

    if (Number.isFinite(height) && !Number.isInteger(height)) {
      notices.push(this.buildNotice('dimensions.height', 'Height must be an integer.', 'error', 'Round to a whole number.'));
    }

    if (Number.isInteger(width) && width < RoomBlueprintValidationService.MIN_DIMENSION) {
      notices.push(
        this.buildNotice(
          'dimensions.width',
          `Width ${width} is below the minimum of ${RoomBlueprintValidationService.MIN_DIMENSION}.`,
          'error',
          `Increase width to at least ${RoomBlueprintValidationService.MIN_DIMENSION}.`,
        ),
      );
    }

    if (Number.isInteger(height) && height < RoomBlueprintValidationService.MIN_DIMENSION) {
      notices.push(
        this.buildNotice(
          'dimensions.height',
          `Height ${height} is below the minimum of ${RoomBlueprintValidationService.MIN_DIMENSION}.`,
          'error',
          `Increase height to at least ${RoomBlueprintValidationService.MIN_DIMENSION}.`,
        ),
      );
    }

    if (Number.isInteger(width) && width > RoomBlueprintValidationService.MAX_DIMENSION) {
      notices.push(
        this.buildNotice(
          'dimensions.width',
          `Width ${width} exceeds the maximum of ${RoomBlueprintValidationService.MAX_DIMENSION}.`,
          'error',
          `Reduce width to ${RoomBlueprintValidationService.MAX_DIMENSION} or less.`,
        ),
      );
    }

    if (Number.isInteger(height) && height > RoomBlueprintValidationService.MAX_DIMENSION) {
      notices.push(
        this.buildNotice(
          'dimensions.height',
          `Height ${height} exceeds the maximum of ${RoomBlueprintValidationService.MAX_DIMENSION}.`,
          'error',
          `Reduce height to ${RoomBlueprintValidationService.MAX_DIMENSION} or less.`,
        ),
      );
    }
  }

  private validateFeatures(blueprint: RoomBlueprint, notices: ValidationNotice[]): void {
    const features = Array.isArray(blueprint.features) ? blueprint.features : [];
    const usableFeatures = features.map((feature) => feature?.trim?.() ?? '').filter((feature) => !!feature);

    if (!features.length) {
      notices.push(
        this.buildNotice('features', 'At least one feature is required for a blueprint.', 'error', 'Add a feature description.'),
      );
      return;
    }

    features.forEach((feature, index) => {
      if (!feature || !feature.trim()) {
        notices.push(
          this.buildNotice(
            `features[${index}]`,
            'Feature entry is empty; remove or describe it to keep exports deterministic.',
            'warning',
            'Delete blank feature entries.',
          ),
        );
      } else if (feature.trim() !== feature) {
        notices.push(
          this.buildNotice(
            `features[${index}]`,
            'Feature has leading or trailing whitespace.',
            'warning',
            'Trim surrounding whitespace.',
          ),
        );
      }
    });

    if (!usableFeatures.length) {
      notices.push(
        this.buildNotice('features', 'All feature entries are empty after trimming.', 'error', 'Provide at least one feature.'),
      );
    }
  }

  private validateHazards(
    blueprint: RoomBlueprint,
    options: RoomBlueprintValidationOptions,
    notices: ValidationNotice[],
  ): void {
    const hazards = Array.isArray(blueprint.hazards) ? blueprint.hazards : [];
    const vocabulary = this.buildVocabulary(options.hazardVocabulary);
    const seen: Record<string, number> = {};

    hazards.forEach((hazard, index) => {
      const key = String(hazard);
      seen[key] = (seen[key] ?? 0) + 1;

      if (vocabulary && !vocabulary.has(key)) {
        notices.push(
          this.buildNotice(
            `hazards[${index}]`,
            `"${hazard}" is not in the provided hazard vocabulary.`,
            'error',
            'Select a hazard from the shared enum.',
          ),
        );
      }
    });

    Object.entries(seen)
      .filter(([, count]) => count > 1)
      .forEach(([hazard]) => {
        notices.push(
          this.buildNotice(
            'hazards',
            `Hazard "${hazard}" is listed multiple times.`,
            'warning',
            'Deduplicate hazard entries.',
          ),
        );
      });
  }

  private validateSockets(
    blueprint: RoomBlueprint,
    options: RoomBlueprintValidationOptions,
    notices: ValidationNotice[],
  ): void {
    const sockets = Array.isArray(blueprint.sockets) ? blueprint.sockets : [];

    if (!sockets.length) {
      notices.push(
        this.buildNotice(
          'sockets',
          'No sockets defined; placement and connections may be ambiguous.',
          'warning',
          'Specify structural, power, or data sockets.',
        ),
      );
      return;
    }

    const supportedKinds = this.normalizeSocketKinds(options.socketKinds || this.defaultSocketKinds);
    const seenIds = new Set<string>();
    const width = blueprint.width;
    const height = blueprint.height;

    sockets.forEach((socket: RoomSocket, index: number) => {
      const path = `sockets[${index}]`;

      if (!socket.id || !socket.id.trim()) {
        notices.push(this.buildNotice(`${path}.id`, 'Socket id is required.', 'error', 'Assign a unique socket id.'));
      } else if (seenIds.has(socket.id)) {
        notices.push(
          this.buildNotice(
            `${path}.id`,
            `Socket id "${socket.id}" is duplicated.`,
            'error',
            'Use unique socket identifiers.',
          ),
        );
      } else {
        seenIds.add(socket.id);
      }

      if (!socket.kind || !socket.kind.toString().trim()) {
        notices.push(
          this.buildNotice(`${path}.kind`, 'Socket kind is missing.', 'error', 'Pick a socket category.'),
        );
      } else if (supportedKinds && !supportedKinds.has(socket.kind)) {
        notices.push(
          this.buildNotice(
            `${path}.kind`,
            `Socket kind "${socket.kind}" is not in the allowed set.`,
            'warning',
            `Use one of: ${Array.from(supportedKinds).join(', ')}.`,
          ),
        );
      }

      if (!socket.position || !Number.isFinite(socket.position.x) || !Number.isFinite(socket.position.y)) {
        notices.push(
          this.buildNotice(
            `${path}.position`,
            'Socket position must include numeric x and y coordinates.',
            'error',
            'Provide numeric coordinates.',
          ),
        );
      } else {
        if (Number.isInteger(width) && (socket.position.x < 0 || socket.position.x >= width)) {
          notices.push(
            this.buildNotice(
              `${path}.position.x`,
              `Socket "${socket.id}" lies outside the width bounds (0-${width - 1}).`,
              'error',
              'Place the socket within room bounds.',
            ),
          );
        }
        if (Number.isInteger(height) && (socket.position.y < 0 || socket.position.y >= height)) {
          notices.push(
            this.buildNotice(
              `${path}.position.y`,
              `Socket "${socket.id}" lies outside the height bounds (0-${height - 1}).`,
              'error',
              'Place the socket within room bounds.',
            ),
          );
        }
      }
    });
  }

  private validatePrerequisites(
    blueprint: RoomBlueprint,
    options: RoomBlueprintValidationOptions,
    notices: ValidationNotice[],
  ): void {
    const prerequisites = Array.isArray(blueprint.prerequisites) ? blueprint.prerequisites : [];
    const knownBlueprintIds = this.buildVocabulary(options.knownBlueprintIds);
    const socketIds = new Set((blueprint.sockets || []).map((socket) => socket.id));
    const seenPrerequisites = new Set<string>();

    prerequisites.forEach((prerequisite, index) => {
      const path = `prerequisites[${index}]`;
      if (!prerequisite.id || !prerequisite.id.trim()) {
        notices.push(this.buildNotice(`${path}.id`, 'Prerequisite id is required.', 'error', 'Assign a prerequisite id.'));
      } else if (seenPrerequisites.has(prerequisite.id)) {
        notices.push(
          this.buildNotice(
            `${path}.id`,
            `Prerequisite id "${prerequisite.id}" is duplicated.`,
            'error',
            'Use unique prerequisite ids per blueprint.',
          ),
        );
      } else {
        seenPrerequisites.add(prerequisite.id);
      }

      if (prerequisite.requiresBlueprintId && knownBlueprintIds && !knownBlueprintIds.has(prerequisite.requiresBlueprintId)) {
        notices.push(
          this.buildNotice(
            `${path}.requiresBlueprintId`,
            `Prerequisite references missing blueprint "${prerequisite.requiresBlueprintId}".`,
            'error',
            'Reference an available blueprint id.',
          ),
        );
      }

      if (Array.isArray(prerequisite.requiresSockets)) {
        prerequisite.requiresSockets.forEach((socketId, socketIndex) => {
          if (!socketIds.has(socketId)) {
            notices.push(
              this.buildNotice(
                `${path}.requiresSockets[${socketIndex}]`,
                `Prerequisite expects socket "${socketId}" which is not defined.`,
                'error',
                'Reference an existing socket id.',
              ),
            );
          }
        });
      }
    });
  }

  private collectDuplicateIds(blueprints: RoomBlueprint[]): Set<string> {
    const seen = new Set<string>();
    const duplicates = new Set<string>();

    blueprints.forEach((blueprint) => {
      if (seen.has(blueprint.id)) {
        duplicates.add(blueprint.id);
      } else {
        seen.add(blueprint.id);
      }
    });

    return duplicates;
  }

  private buildVocabulary(values?: Iterable<string> | ArrayLike<string> | null): Set<string> | null {
    if (!values) return null;
    return new Set(Array.from(values).map((value) => value.toString()));
  }

  private normalizeSocketKinds(socketKinds: RoomSocketKind[]): Set<RoomSocketKind> {
    return new Set(socketKinds.map((kind: RoomSocketKind) => kind));
  }

  private sortNotices(notices: ValidationNotice[]): ValidationNotice[] {
    const severityOrder: Record<ValidationNotice['severity'], number> = {
      error: 0,
      warning: 1,
      info: 2,
    };

    return [...notices].sort((left, right) => {
      const severityComparison = severityOrder[left.severity] - severityOrder[right.severity];
      if (severityComparison !== 0) return severityComparison;

      const pathComparison = left.path.localeCompare(right.path);
      if (pathComparison !== 0) return pathComparison;

      return left.message.localeCompare(right.message);
    });
  }

  private buildNotice(
    path: string,
    message: string,
    severity: ValidationNotice['severity'],
    suggestion?: string,
  ): ValidationNotice {
    return { path, message, severity, suggestion };
  }
}
