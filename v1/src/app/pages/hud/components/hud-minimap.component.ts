import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { HudMinimapDataService, HudMinimapMarker } from '../hud-minimap-data.service';

@Component({
  selector: 'app-hud-minimap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hud-minimap.component.html',
  styleUrls: ['./hud-minimap.component.scss'],
})
export class HudMinimapComponent implements OnInit {
  @Input()
  tileSize = 8; // TODO: Confirm baseline pixel density for live tiles (see task 2025-12-18_hud-minimap-scaling-policy).

  @Input()
  sourceResolution = 512;

  @Input()
  displayScale = 0.25; // renders 128px square by default to preserve pixel clarity.

  @Input()
  tiles: number[][] = [
    [0, 1, 2, 1, 0, 2, 1, 0],
    [1, 2, 3, 2, 1, 3, 2, 1],
    [0, 1, 2, 2, 2, 2, 1, 0],
    [1, 1, 2, 3, 2, 2, 1, 1],
    [0, 2, 3, 3, 3, 3, 2, 0],
    [1, 2, 2, 2, 2, 2, 2, 1],
    [0, 1, 1, 2, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
  ];

  @Input()
  markers: HudMinimapMarker[] = [];

  constructor(private readonly data: HudMinimapDataService) {}

  ngOnInit(): void {
    if (!this.tiles.length) {
      const preview = this.data.getPreview();
      this.tiles = preview.tiles;
      this.sourceResolution = preview.sourceResolution;
      this.tileSize = preview.tileSize;
      this.displayScale = preview.displayScale;
      this.markers = preview.markers;
    }
  }

  protected get renderSize(): number {
    return Math.floor(this.sourceResolution * this.displayScale);
  }

  protected get renderFootnote(): string {
    return `${this.sourceResolution}px baseline (${this.tileCount} tiles @ ${this.tileSize}px) → ${this.renderSize}px displayed`;
  }

  protected get tileCount(): number {
    return this.tiles?.length ?? 0;
  }

  protected get gridTemplate(): string {
    return `repeat(${this.tileCount}, 1fr)`;
  }

  // TODO: Should the HUD enforce a maximum scale to prevent blurry magnification on low DPI screens?
  // TODO: Decide on letterboxing vs. dynamic resampling for lower-resolution devices.
  // TODO: Task 2025-12-18_hud-minimap-scaling-policy — document scaling/resolution strategy for the minimap surface.
}
