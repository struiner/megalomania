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
}
