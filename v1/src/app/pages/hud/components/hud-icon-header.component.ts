import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { HudIconComponent } from './hud-icon.component';

@Component({
  selector: 'app-hud-icon-header',
  standalone: true,
  imports: [CommonModule, HudIconComponent],
  templateUrl: './hud-icon-header.component.html',
  styleUrls: ['./hud-icon-header.component.scss'],
})
export class HudIconHeaderComponent {
  @Input({ required: true })
  title!: string;

  @Input()
  subtitle?: string;

  @Input()
  iconId?: string; // Changed from 'icon' to 'iconId' for consistency with HudIconComponent

  @Input()
  badge?: string;

  // TODO: Confirm whether hotkey glyphs should be rendered inline with the title.
  // TODO: Define truncation rules for very narrow panes vs. caller-managed overflow.
}
