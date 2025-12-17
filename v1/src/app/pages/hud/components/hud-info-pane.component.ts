import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface HudInfoPaneContent {
  heading: string;
  items: string[];
}

@Component({
  selector: 'app-hud-info-pane',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hud-info-pane.component.html',
  styleUrls: ['./hud-info-pane.component.scss'],
})
export class HudInfoPaneComponent {
  @Input({ required: true })
  content!: HudInfoPaneContent;

  @Input()
  align: 'left' | 'right' = 'left';

  // TODO: Integrate shared icon/header utility once defined in the referenced epic.
}
