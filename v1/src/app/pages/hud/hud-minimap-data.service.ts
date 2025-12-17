import { Injectable } from '@angular/core';
import { TilemapService } from '../../services/worldGeneration/tile-map.service';

export interface HudMinimapMarker {
  label: string;
  x: number; // normalized 0..1
  y: number; // normalized 0..1
  glyph?: string;
}

export interface HudMinimapPreview {
  tiles: number[][];
  sourceResolution: number;
  tileSize: number;
  displayScale: number;
  markers: HudMinimapMarker[];
}

@Injectable({ providedIn: 'root' })
export class HudMinimapDataService {
  private readonly tilesPerAxis = 64;
  private readonly tileSize = 8;
  private readonly displayScale = 0.25;
  private readonly seed = 'hud-minimap-preview';

  constructor(private readonly tilemapService: TilemapService) {}

  getPreview(): HudMinimapPreview {
    const preview = this.tilemapService.generateTilemapPreview(this.seed, this.tilesPerAxis);
    const tiles = preview.tilemap.map((row) => row.map((height) => this.normalizeHeight(height)));

    // TODO: Select fixture markers with Game Designer input (biome centers, settlements, etc.).
    const markers: HudMinimapMarker[] = [
      { label: 'Origin', x: 0.5, y: 0.5, glyph: '✦' },
      { label: 'Harbor stub', x: 0.32, y: 0.68, glyph: '⚓' },
    ];

    return {
      tiles,
      sourceResolution: this.tileSize * this.tilesPerAxis,
      tileSize: this.tileSize,
      displayScale: this.displayScale,
      markers,
    };
  }

  private normalizeHeight(height: number): number {
    const normalized = (height + 1) / 2; // map to 0..1

    if (normalized < 0.35) {
      return 0;
    }

    if (normalized < 0.55) {
      return 1;
    }

    if (normalized < 0.78) {
      return 2;
    }

    return 3;
  }
}
