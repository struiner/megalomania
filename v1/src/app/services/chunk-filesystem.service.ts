import { Injectable } from '@angular/core';
import { CellData, Tile } from './worldGeneration/world-map.service';
import { DirectoryAccessService } from '../shared/directory-access.service';

interface CompressedCellData {
  e: number; // elevation
  m: number; // moisture
  t: number; // temperature
  b: string; // biome code
}

@Injectable({ providedIn: 'root' })
export class FileSystemService {
  private readonly chunkSize = 512;
  private readonly cellSize = 256; // 256x256 tiles per cell
  private readonly tileSize = 1; // Individual tile size

  constructor(private directoryAccessService: DirectoryAccessService) {}

  /**
   * Generate tiles on-the-fly for a specific cell
   * Only generates tiles when needed for rendering/interaction
   */
  generateTilesForCell(cellData: CellData, cellX: number, cellY: number, layer: number = 0): Tile[][] {
    const tiles: Tile[][] = [];

    for (let tileY = 0; tileY < this.cellSize; tileY++) {
      const row: Tile[] = [];
      for (let tileX = 0; tileX < this.cellSize; tileX++) {
        // Generate tile based on cell properties and position
        const tile = this.generateSingleTile(cellData, tileX, tileY, layer);
        row.push(tile);
      }
      tiles.push(row);
    }

    return tiles;
  }

  /**
   * Generate a single tile based on cell data and position
   * Uses deterministic algorithms for consistent results
   */
  private generateSingleTile(cellData: CellData, tileX: number, tileY: number, layer: number): Tile {
    // Create deterministic seed from position
    const seed = this.createSeed(cellData, tileX, tileY, layer);

    // Generate tile based on biome and position
    const sprite = this.getTileSprite(cellData.biome, seed, tileX, tileY);

    return {
      sprite,
      // Only add inventory/special data for specific tiles
      inventory: this.shouldHaveInventory(seed) ? this.generateTileInventory(seed) : undefined,
      linkedTileData: this.shouldHaveLinkedData(seed) ? this.generateLinkedTile(seed) : undefined
    };
  }

  async requestDirectoryAccess(): Promise<void> {
    return this.directoryAccessService.requestDirectoryAccess();
  }

  hasDirectory(): boolean {
    return this.directoryAccessService.hasDirectory();
  }
  private biomeNameToCode(name: string): number {
    const map: Record<string, number> = {
      beach: 1, desert: 2, woodland: 3, taiga: 4, tundra: 5,
      rainforest: 6, grassland: 7, forest: 8, mountain: 9,
      rock: 10, alpine: 11, 'alpine grassland': 12, ocean: 13, water: 14
    };
    return map[name] ?? 0;
  }
  
  private codeToBiomeName(code: number): string {
    const map: Record<number, string> = {
      1: 'beach', 2: 'desert', 3: 'woodland', 4: 'taiga', 5: 'tundra',
      6: 'rainforest', 7: 'grassland', 8: 'forest', 9: 'mountain',
      10: 'rock', 11: 'alpine', 12: 'alpine grassland', 13: 'ocean', 14: 'water'
    };
    return map[code] ?? 'unknown';
  }
  
  private biomeCodeMap: Record<string, string> = {
    b: 'beach', d: 'desert', w: 'woodland', t: 'taiga', u: 'tundra',
    r: 'rainforest', g: 'grassland', f: 'forest', m: 'mountain',
    k: 'rock', a: 'alpine', l: 'alpine grassland', o: 'ocean', v: 'water'
  };
  
  private nameToLetterCode(name: string): string {
    const map: Record<string, string> = {
      beach: 'b', desert: 'd', woodland: 'w', taiga: 't', tundra: 'u',
      rainforest: 'r', grassland: 'g', forest: 'f', mountain: 'm',
      rock: 'k', alpine: 'a', 'alpine grassland': 'l', ocean: 'o', water: 'v'
    };
    return map[name] ?? '?';
  }
  
  
  private compressChunk(chunk: CellData[][]): CompressedCellData[][] {
    return chunk.map(row =>
      row.map(cell => ({
        e: Number(cell.elevation.toFixed(3)),
        m: Number(cell.moisture.toFixed(3)),
        t: Number(cell.temperature.toFixed(3)),
        b: this.nameToLetterCode(cell.biome), 
      }))
    );
  }
  
  private decompressChunk(compressed: CompressedCellData[][]): CellData[][] {
    return compressed.map(row =>
      row.map(c => ({
        elevation: c.e,
        moisture: c.m,
        temperature: c.t,
        biome: this.biomeCodeMap[c.b] ?? 'unknown',
      }))
    );
  }
  
  // 🏗️ BINARY ENCODE (no changes needed)
  private encodeChunkBinary(chunk: CellData[][]): ArrayBuffer {
    const width = chunk[0]?.length ?? this.chunkSize;
    const height = chunk.length ?? this.chunkSize;
    const bytesPerCell = 2 + 2 + 2 + 1;
    const buffer = new ArrayBuffer(width * height * bytesPerCell);
    const view = new DataView(buffer);
    let i = 0;
  
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const cell = chunk[y][x];
        view.setUint16(i, Math.round(cell.elevation * 1000)); i += 2;
        view.setUint16(i, Math.round(cell.moisture * 1000)); i += 2;
        view.setUint16(i, Math.round(cell.temperature * 1000)); i += 2;
        view.setUint8(i, this.biomeNameToCode(cell.biome)); i += 1;
  
      
      }
    }
    return buffer;
  }
  
  // 🏗️ BINARY DECODE (no changes needed)
  private decodeChunkBinary(buffer: ArrayBuffer): CellData[][] {
    const view = new DataView(buffer);
    const width = this.chunkSize;
    const height = this.chunkSize;
    const chunk: CellData[][] = [];
    let i = 0;
  
    for (let y = 0; y < height; y++) {
      const row: CellData[] = [];
      for (let x = 0; x < width; x++) {
        const elevation = view.getUint16(i) / 1000; i += 2;
        const moisture = view.getUint16(i) / 1000; i += 2;
        const temperature = view.getUint16(i) / 1000; i += 2;
        const biome = this.codeToBiomeName(view.getUint8(i)); i += 1;  
        row.push({ elevation, moisture, temperature, biome });
      }
      chunk.push(row);
    }
    return chunk;
  }
  
  async saveChunkAsJSON(chunk: CellData[][], x: number, y: number): Promise<void> {
    const json = JSON.stringify(this.compressChunk(chunk));
    const fileHandle = await this.getFileHandle(`chunk_${x}_${y}.json`, 'maps');
    const writable = await fileHandle.createWritable();
    await writable.write(json);
    await writable.close();
  }

  async loadOrSaveChunkJSON(gen: () => CellData[][], x: number, y: number): Promise<CellData[][]> {
    try {
      const fileHandle = await this.getFileHandle(`chunk_${x}_${y}.json`, 'maps');
      const file = await fileHandle.getFile();
      const text = await file.text();
      const compressed = JSON.parse(text) as CompressedCellData[][];
      return this.decompressChunk(compressed);
    } catch {
      const chunk = gen();
      await this.saveChunkAsJSON(chunk, x, y);
      return chunk;
    }
  }

  async saveChunkAsBinary(chunk: CellData[][], x: number, y: number): Promise<void> {
    const buffer = this.encodeChunkBinary(chunk);
    const fileHandle = await this.getFileHandle(`chunk_${x}_${y}.bin`, 'maps');
    const writable = await fileHandle.createWritable();
    await writable.write(buffer);
    await writable.close();
  }

  async loadOrSaveChunkBinary(gen: () => CellData[][], x: number, y: number): Promise<CellData[][]> {
    try {
      const fileHandle = await this.getFileHandle(`chunk_${x}_${y}.bin`, 'maps');
      const file = await fileHandle.getFile();
      const buffer = await file.arrayBuffer();
      return this.decodeChunkBinary(buffer);
    } catch {
      const chunk = gen();
      await this.saveChunkAsBinary(chunk, x, y);
      return chunk;
    }
  }
  private async getFileHandle(name: string, folder: string): Promise<FileSystemFileHandle> {
    return this.directoryAccessService.getFileHandle(name, folder);
  }

  // ===== ON-THE-FLY TILE GENERATION HELPERS =====

  /**
   * Create deterministic seed for tile generation
   */
  private createSeed(cellData: CellData, tileX: number, tileY: number, layer: number): number {
    // Combine position and cell properties for deterministic seed
    let seed = 0;
    seed ^= tileX * 73856093;
    seed ^= tileY * 19349663;
    seed ^= layer * 83492791;
    seed ^= Math.floor(cellData.elevation * 1000) * 102334155;
    seed ^= Math.floor(cellData.moisture * 1000) * 224737;
    seed ^= Math.floor(cellData.temperature * 1000) * 982451653;
    return Math.abs(seed);
  }

  /**
   * Get appropriate sprite for tile based on biome and position
   */
  private getTileSprite(biome: string, seed: number, tileX: number, tileY: number): string {
    const random = this.seededRandom(seed);

    const biomeSprites: Record<string, string[]> = {
      'grassland': ['grass1', 'grass2', 'grass3', 'flower1'],
      'forest': ['tree1', 'tree2', 'bush1', 'grass1'],
      'mountain': ['rock1', 'rock2', 'stone1', 'cliff1'],
      'desert': ['sand1', 'sand2', 'cactus1', 'dune1'],
      'ocean': ['water1', 'water2', 'wave1'],
      'beach': ['sand1', 'shell1', 'driftwood1'],
      'taiga': ['pine1', 'pine2', 'snow1'],
      'tundra': ['snow1', 'ice1', 'rock1']
    };

    const sprites = biomeSprites[biome] || ['default'];
    return sprites[Math.floor(random * sprites.length)];
  }

  /**
   * Determine if tile should have inventory (chests, etc.)
   */
  private shouldHaveInventory(seed: number): boolean {
    return this.seededRandom(seed + 1000) < 0.001; // 0.1% chance
  }

  /**
   * Generate inventory for special tiles
   */
  private generateTileInventory(seed: number): any {
    // Simple treasure chest inventory
    return {
      equipment: {},
      assets: {
        wallet: {
          thalers: Math.floor(this.seededRandom(seed + 2000) * 100),
          gold: 0,
          dollars: 0,
          guilders: 0,
          florins: 0
        }
      }
    };
  }

  /**
   * Determine if tile should have linked data (doors, etc.)
   */
  private shouldHaveLinkedData(seed: number): boolean {
    return this.seededRandom(seed + 3000) < 0.0001; // 0.01% chance
  }

  /**
   * Generate linked tile data for special tiles
   */
  private generateLinkedTile(seed: number): Tile {
    return {
      sprite: 'door_interior',
      inventory: undefined,
      linkedTileData: undefined
    };
  }

  /**
   * Seeded random number generator for consistent results
   */
  private seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  /**
   * Get tiles for a specific viewport (only generate what's visible)
   */
  getTilesInViewport(
    cellData: CellData,
    startTileX: number,
    startTileY: number,
    viewWidth: number,
    viewHeight: number,
    layer: number = 0
  ): Tile[][] {
    const tiles: Tile[][] = [];

    for (let y = 0; y < viewHeight; y++) {
      const row: Tile[] = [];
      for (let x = 0; x < viewWidth; x++) {
        const tileX = startTileX + x;
        const tileY = startTileY + y;

        // Only generate if within cell bounds
        if (tileX >= 0 && tileX < this.cellSize && tileY >= 0 && tileY < this.cellSize) {
          row.push(this.generateSingleTile(cellData, tileX, tileY, layer));
        } else {
          // Default tile for out-of-bounds
          row.push({ sprite: 'void' });
        }
      }
      tiles.push(row);
    }

    return tiles;
  }
}
