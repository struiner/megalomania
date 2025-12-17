import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hud-minimap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hud-minimap.component.html',
  styleUrls: ['./hud-minimap.component.scss'],
})
export class HudMinimapComponent {
  @Input()
  tileSize = 8; // TODO: Confirm baseline pixel density for live tiles.

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

  // TODO: Accept frame overlays (e.g., markers) once view models are defined.

  protected get renderSize(): number {
    return Math.floor(this.sourceResolution * this.displayScale);
  }

  protected get renderFootnote(): string {
    return `${this.sourceResolution} baseline, ${this.renderSize}px displayed`;
  }

  // TODO: Should the HUD enforce a maximum scale to prevent blurry magnification on low DPI screens?
  // TODO: Decide on letterboxing vs. dynamic resampling for lower-resolution devices.
}
