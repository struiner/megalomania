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
interface HudMinimapScalePolicy {
  baselineResolution: number;
  minScale: number;
  maxScale: number;
  preferredSteps: number[];
}

export class HudMinimapComponent implements OnInit {
  @Input()
  tileSize = 8; // TODO: Confirm baseline pixel density for live tiles (see task 2025-12-18_hud-minimap-scaling-policy).

  @Input()
  sourceResolution = 512;

  @Input()
  displayScale = 0.25; // renders 128px square by default to preserve pixel clarity.

  @Input()
  desiredDisplaySize = 160; // TODO: Confirm intended viewport allocation for the minimap frame.

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

  protected readonly scalePolicy: HudMinimapScalePolicy = {
    baselineResolution: 512,
    minScale: 0.25,
    maxScale: 0.5,
    preferredSteps: [0.25, 0.3125, 0.375, 0.5],
  };

  protected resolvedScale = this.scalePolicy.minScale;

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

    this.applyScalingPolicy();
  }

  protected get renderSize(): number {
    return Math.floor(this.sourceResolution * this.resolvedScale);
  }

  protected get renderFootnote(): string {
    return `${this.sourceResolution}px baseline (${this.tileCount} tiles @ ${this.tileSize}px) → ${this.renderSize}px displayed @ ${this.resolvedScale * 100}%`;
  }

  protected get tileCount(): number {
    return this.tiles?.length ?? 0;
  }

  protected get gridTemplate(): string {
    return `repeat(${this.tileCount}, 1fr)`;
  }

  private applyScalingPolicy(): void {
    const clampedSource = Math.max(this.sourceResolution, this.scalePolicy.baselineResolution);
    const rawScaleFromDesired = this.desiredDisplaySize / clampedSource;
    const candidateScale = Math.max(this.displayScale, rawScaleFromDesired);
    const clamped = Math.min(Math.max(candidateScale, this.scalePolicy.minScale), this.scalePolicy.maxScale);

    this.resolvedScale = this.snapToPreferredScale(clamped);

    // TODO: Decide on letterboxing vs. dynamic resampling for lower-resolution devices when desired size is smaller than the
    // TODO: preferred step results (task 2025-12-18_hud-minimap-scaling-policy).
  }

  private snapToPreferredScale(scale: number): number {
    return this.scalePolicy.preferredSteps.reduce((nearest, current) => {
      const nearestDelta = Math.abs(scale - nearest);
      const currentDelta = Math.abs(scale - current);

      if (currentDelta < nearestDelta) {
        return current;
      }

      return nearest;
    }, this.scalePolicy.preferredSteps[0]);
  }
}
