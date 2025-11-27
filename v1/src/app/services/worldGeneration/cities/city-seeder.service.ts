import { Injectable } from "@angular/core";
import dayjs from 'dayjs';
import { Settlement } from "../../../../shared/types/Settlement";
import { WorldSessionService } from "../../world-session.service";
import { CellData } from "../world-map.service";
import { WorldExpansionService } from "./world-expansion.service";
import { LocationService } from "./location.service";
import { CityGeneratorService } from "./city-generator.service";
import { ChunkLedgerService } from "../../chunk-ledger.service";

@Injectable({ providedIn: 'root' })
export class CitySeederService {
  constructor(
    private worldSessionService: WorldSessionService,
    private worldExpansionService: WorldExpansionService,
    private locationService: LocationService,
    private cityGeneratorService: CityGeneratorService,
    private chunkLedgerService: ChunkLedgerService
  ) {}

  async seedConnectedWorld(
    chunk: CellData[][],
    seedRandom: () => number,
    chunkX: number,
    chunkY: number,
    iterations: number = 7
  ): Promise<Settlement[]> {
    const settlements: Settlement[] = [];

    // === 1. Find a starting coastal location ===
    const startLoc = this.locationService.findCoastalLocations(chunk, seedRandom, 1)[0];
    if (!startLoc) {
      console.warn("No starting coastal location found!");
      return settlements;
    }

    const globalStartX = chunkX * 512 + startLoc.x;
    const globalStartY = chunkY * 512 + startLoc.y;

    const startSettlement = this.cityGeneratorService.createSettlementAt(
      globalStartX,
      globalStartY,
      'coastal',
      seedRandom
    );

    settlements.push(startSettlement);

    // Log foundation event far in the past
    const startTimestamp = dayjs().subtract(640, 'year');
    await this.chunkLedgerService.recordEventAt({
      type: 'CITY_FOUNDATION',
      description: `${startTimestamp}: Foundation of settlement ${startSettlement.name}`,
      payload: { settlement: startSettlement },
      resourceDelta: { population: startSettlement.population, resources: -startSettlement.population },
      apply: () => console.log(`Settlement ${startSettlement.name} founded.`),
      reverse: () => console.log(`Settlement ${startSettlement.name} removed.`),
    },startTimestamp);

    // === 2. Expand the world logically ===
    const newSettlements = await this.worldExpansionService.structuredWorldExpansion(
      startSettlement,
      seedRandom
    );

    // Log expansions sequentially, each a few years apart
    let expansionTimestamp = startTimestamp;
    for (const settlement of newSettlements) {
      expansionTimestamp = expansionTimestamp.add(2, 'year');
      await this.chunkLedgerService.recordEventAt({
        type: 'CITY_FOUNDATION',
        description: `${expansionTimestamp}: Foundation of settlement ${settlement.name}`,
        payload: { settlement },
        resourceDelta: { population: settlement.population, resources: -settlement.population },
        apply: () => console.log(`Settlement ${settlement.name} founded.`),
        reverse: () => console.log(`Settlement ${settlement.name} removed.`),
      },expansionTimestamp);
    }

    settlements.push(...newSettlements);

    this.worldSessionService.setSettlements(settlements);
    this.chunkLedgerService.setCurrentTimestamp(expansionTimestamp)
    
    console.log(`CitySeederService: Seeded ${settlements.length} settlements.`);
    return settlements;
  }
}
