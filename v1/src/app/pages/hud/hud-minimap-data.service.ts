import { Injectable } from '@angular/core';
import { TilemapService } from '../../services/worldGeneration/tile-map.service';
import {
  HUD_MINIMAP_MARKER_FIXTURES,
  HudMinimapMarkerFixture,
} from './data/fixtures/hud-minimap-marker.fixtures';

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
  private readonly markerSafeAreaInset = 0.08; // normalized inset to keep markers off the frame edges/letterbox.

  constructor(private readonly tilemapService: TilemapService) {}

  getPreview(): HudMinimapPreview {
    const preview = this.tilemapService.generateTilemapPreview(this.seed, this.tilesPerAxis);
    const tiles = preview.tilemap.map((row) => row.map((height) => this.normalizeHeight(height)));

    const markers = this.buildMarkersFromFixtures();

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

  private buildMarkersFromFixtures(): HudMinimapMarker[] {
    return HUD_MINIMAP_MARKER_FIXTURES
      .map((fixture) => ({
        ...fixture,
        x: this.applyMarkerSafeArea(fixture.x),
        y: this.applyMarkerSafeArea(fixture.y),
      }))
      .sort((a, b) => this.sortMarkers(a, b))
      .map(({ id: _id, priority: _priority, category: _category, source: _source, ...marker }) => marker);
  }

  private sortMarkers(a: HudMinimapMarkerFixture, b: HudMinimapMarkerFixture): number {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }

    return a.label.localeCompare(b.label);
  }

  private applyMarkerSafeArea(value: number): number {
    const clamped = Math.min(Math.max(value, 0), 1);
    const inset = this.markerSafeAreaInset;
    const minimum = 0 + inset;
    const maximum = 1 - inset;

    if (clamped < minimum) {
      return minimum;
    }

    if (clamped > maximum) {
      return maximum;
    }

    return clamped;
  }
}
