import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { HudIconHeaderComponent } from './hud-icon-header.component';

export interface HudInfoPaneContent {
  heading: string;
  items: string[];
  icon?: string;
  subtitle?: string;
  badge?: string;
}

@Component({
  selector: 'app-hud-info-pane',
  standalone: true,
  imports: [CommonModule, HudIconHeaderComponent],
  templateUrl: './hud-info-pane.component.html',
  styleUrls: ['./hud-info-pane.component.scss'],
})
export class HudInfoPaneComponent {
  @Input({ required: true })
  content!: HudInfoPaneContent;

  @Input()
  align: 'left' | 'right' = 'left';

  // TODO: Confirm whether badges should be driven by notifications vs. caller-provided values.
}
