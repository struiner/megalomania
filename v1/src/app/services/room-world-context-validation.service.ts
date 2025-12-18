import { Injectable } from '@angular/core';
import { Biome } from '../enums/Biome';
import { BiomeType } from '../enums/BiomeType';
import { HazardType } from '../enums/HazardType';
import { SettlementType } from '../enums/SettlementType';
import { StructureType } from '../enums/StructureType';
import { RoomBlueprint } from '../models/room-blueprint.model';

type RoomContextNoticeSeverity = 'info' | 'warning';

export interface RoomWorldContext {
  biome?: Biome | BiomeType;
  settlementType?: SettlementType;
  structureType?: StructureType;
}

export interface RoomContextNotice {
  code: string;
  severity: RoomContextNoticeSeverity;
  message: string;
  context: Partial<RoomWorldContext>;
}

export interface RoomWorldValidationResult {
  notices: RoomContextNotice[];
}

interface HazardBiomeGuard {
  hazard: HazardType;
  discouragedBiomes?: Set<Biome>;
  limitedToBiomes?: Set<Biome>;
  code: string;
  severity: RoomContextNoticeSeverity;
  message: string;
}

interface HazardSettlementGuard {
  hazard: HazardType;
  allowedSettlements?: Set<SettlementType>;
  discouragedSettlements?: Set<SettlementType>;
  code: string;
  severity: RoomContextNoticeSeverity;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class RoomWorldContextValidationService {
  private readonly waterBiomes = new Set<Biome>([Biome.Ocean, Biome.Water, Biome.Beach]);
  private readonly aridBiomes = new Set<Biome>([Biome.Desert]);
  private readonly coldBiomes = new Set<Biome>([Biome.Tundra, Biome.Alpine, Biome.AlpineGrassland]);
  private readonly lowTechSettlements = new Set<SettlementType>([
    SettlementType.Hamlet,
    SettlementType.Village,
    SettlementType.Tribe,
  ]);
  private readonly sealedSettlements = new Set<SettlementType>([
    SettlementType.FloatingCity,
    SettlementType.PhasingCity,
    SettlementType.UndergroundCity,
  ]);
  private readonly fortifiedSettlements = new Set<SettlementType>([
    SettlementType.Fortress,
    SettlementType.Capital,
  ]);

  private readonly waterDependentStructures = new Set<StructureType>([
    StructureType.Docks,
    StructureType.Harbor,
    StructureType.Lighthouse,
    StructureType.Fishery,
  ]);

  private readonly settlementAreaCeilings: Map<SettlementType, number> = new Map([
    [SettlementType.Hamlet, 96],
    [SettlementType.Village, 144],
    [SettlementType.TradingPost, 160],
    [SettlementType.Tribe, 120],
    [SettlementType.Town, 220],
    [SettlementType.City, 320],
    [SettlementType.Metropolis, 420],
    [SettlementType.Capital, 512],
    [SettlementType.Fortress, 260],
    [SettlementType.TradeHub, 260],
    [SettlementType.Lighthouse, 120],
    [SettlementType.Ruins, 200],
    [SettlementType.AncientRuins, 220],
    [SettlementType.UndergroundCity, 320],
    [SettlementType.FloatingCity, 320],
    [SettlementType.PhasingCity, 320],
  ]);

  private readonly hazardBiomeGuards: HazardBiomeGuard[];
  private readonly hazardSettlementGuards: HazardSettlementGuard[];

  constructor() {
    this.hazardBiomeGuards = [
      {
        hazard: HazardType.Flood,
        discouragedBiomes: this.aridBiomes,
        code: 'hazard-biome-arid',
        severity: 'info',
        message: 'Floodproofing is rarely needed in arid biomes; dust sealing or heat controls are more applicable.',
      },
      {
        hazard: HazardType.Fire,
        discouragedBiomes: this.waterBiomes,
        code: 'hazard-biome-water',
        severity: 'info',
        message: 'Open water biomes make fire a low-probability hazard; prioritize corrosion or pressure risks instead.',
      },
      {
        hazard: HazardType.Vacuum,
        limitedToBiomes: new Set<Biome>([
          Biome.Beach,
          Biome.Ocean,
          Biome.Water,
          Biome.Alpine,
          Biome.AlpineGrassland,
          Biome.Rock,
        ]),
        code: 'hazard-biome-vacuum',
        severity: 'warning',
        message: 'Vacuum mitigation only aligns with exposed high-altitude, coastal, or void-linked biomes. Other zones suggest a mismatched hazard profile.',
      },
    ];

    this.hazardSettlementGuards = [
      {
        hazard: HazardType.Vacuum,
        allowedSettlements: this.sealedSettlements,
        code: 'hazard-settlement-vacuum',
        severity: 'warning',
        message:
          'Vacuum-proofing belongs to sealed settlements (floating, phasing, underground). Surface settlements should swap to pressure, intrusion, or weatherproofing.',
      },
      {
        hazard: HazardType.Electrical,
        discouragedSettlements: this.lowTechSettlements,
        code: 'hazard-settlement-electrical',
        severity: 'info',
        message: 'Electrical hazards assume stable grids. Low-tech settlements rarely sustain them; reconsider the threat model or upgrade requirements.',
      },
      {
        hazard: HazardType.Intrusion,
        allowedSettlements: this.fortifiedSettlements,
        code: 'hazard-settlement-intrusion',
        severity: 'info',
        message: 'Intrusion countermeasures shine in fortified capitals or strongholds. Smaller settlements may prefer simpler perimeter hardening.',
      },
    ];
  }

  validatePlacement(blueprint: RoomBlueprint, context: RoomWorldContext): RoomWorldValidationResult {
    const notices: RoomContextNotice[] = [];
    const biome = this.normalizeBiome(context.biome);
    const hazardSet = new Set(blueprint.hazards);

    this.guardStructureBiome(biome, context.structureType, notices);
    this.guardHazardsAgainstBiome(hazardSet, biome, context, notices);
    this.guardHazardsAgainstSettlement(hazardSet, context.settlementType, context, notices);
    this.guardRoomScaleAgainstSettlement(blueprint, context.settlementType, context, notices);

    return { notices: this.sortNotices(notices) };
  }

  private guardStructureBiome(
    biome: Biome | undefined,
    structureType: StructureType | undefined,
    notices: RoomContextNotice[],
  ): void {
    if (!biome || !structureType) return;

    if (this.waterDependentStructures.has(structureType) && !this.waterBiomes.has(biome)) {
      notices.push({
        code: 'structure-biome-mismatch',
        severity: 'warning',
        message: `Structure type ${structureType} expects a coastline or inland water biome, but received ${biome}.`,
        context: { biome, structureType },
      });
    }

    if (structureType === StructureType.Mine && this.waterBiomes.has(biome)) {
      notices.push({
        code: 'structure-biome-flooding',
        severity: 'info',
        message: 'Mine-adjacent rooms near coastlines will face constant flooding pressure; prefer inland biomes.',
        context: { biome, structureType },
      });
    }
  }

  private guardHazardsAgainstBiome(
    hazards: Set<HazardType>,
    biome: Biome | undefined,
    context: RoomWorldContext,
    notices: RoomContextNotice[],
  ): void {
    if (!biome) return;

    for (const guard of this.hazardBiomeGuards) {
      if (!hazards.has(guard.hazard)) continue;

      if (guard.discouragedBiomes?.has(biome)) {
        notices.push({
          code: guard.code,
          severity: guard.severity,
          message: guard.message,
          context: { ...context, biome },
        });
      }

      if (guard.limitedToBiomes && !guard.limitedToBiomes.has(biome)) {
        notices.push({
          code: guard.code,
          severity: guard.severity,
          message: guard.message,
          context: { ...context, biome },
        });
      }
    }
  }

  private guardHazardsAgainstSettlement(
    hazards: Set<HazardType>,
    settlementType: SettlementType | undefined,
    context: RoomWorldContext,
    notices: RoomContextNotice[],
  ): void {
    if (!settlementType) return;

    for (const guard of this.hazardSettlementGuards) {
      if (!hazards.has(guard.hazard)) continue;

      const violatesAllowed = guard.allowedSettlements && !guard.allowedSettlements.has(settlementType);
      const hitsDiscouraged = guard.discouragedSettlements?.has(settlementType);

      if (violatesAllowed || hitsDiscouraged) {
        notices.push({
          code: guard.code,
          severity: guard.severity,
          message: guard.message,
          context: { ...context, settlementType },
        });
      }
    }
  }

  private guardRoomScaleAgainstSettlement(
    blueprint: RoomBlueprint,
    settlementType: SettlementType | undefined,
    context: RoomWorldContext,
    notices: RoomContextNotice[],
  ): void {
    if (!settlementType) return;

    const area = blueprint.width * blueprint.height;
    const ceiling = this.settlementAreaCeilings.get(settlementType) ?? 240;
    const tolerance = ceiling * 1.15;

    if (area > tolerance) {
      notices.push({
        code: 'room-size-out-of-scale',
        severity: 'warning',
        message: `Room area ${area} exceeds the ${settlementType} scale guardrail (${ceiling}). Split the blueprint or target a larger settlement tier.`,
        context: { ...context, settlementType },
      });
      return;
    }

    if (area > ceiling) {
      notices.push({
        code: 'room-size-near-limit',
        severity: 'info',
        message: `Room area ${area} is above the preferred ${settlementType} threshold (${ceiling}). Expect tight fit or higher upkeep.`,
        context: { ...context, settlementType },
      });
    }
  }

  private normalizeBiome(biome?: Biome | BiomeType): Biome | undefined {
    if (!biome) return undefined;
    return biome as Biome;
  }

  private sortNotices(notices: RoomContextNotice[]): RoomContextNotice[] {
    const severityRank: Record<RoomContextNoticeSeverity, number> = { warning: 0, info: 1 };
    return [...notices].sort((a, b) => {
      const severityDelta = severityRank[a.severity] - severityRank[b.severity];
      if (severityDelta !== 0) return severityDelta;
      return a.code.localeCompare(b.code);
    });
  }
}
