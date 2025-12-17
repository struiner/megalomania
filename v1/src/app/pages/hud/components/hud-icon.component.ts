import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

type HudIconSize = '1x' | '2x';

@Component({
  selector: 'app-hud-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hud-icon.component.html',
  styleUrls: ['./hud-icon.component.scss'],
})
export class HudIconComponent {
  @Input({ required: true })
  glyph!: string;

  @Input()
  label?: string;

  @Input()
  size: HudIconSize = '1x';

  @Input()
  framed = true;

  // TODO: Decide whether primary action icons should use a heavier frame or alternate bevel compared to headers.

  protected get pixelSize(): number {
    return this.size === '2x' ? 32 : 16;
  }
}
