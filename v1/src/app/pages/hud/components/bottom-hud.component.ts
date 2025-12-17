import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HudButtonGridComponent, HudAction } from './hud-button-grid.component';
import { HudMinimapComponent } from './hud-minimap.component';
import { HudInfoPaneComponent, HudInfoPaneContent } from './hud-info-pane.component';

@Component({
  selector: 'app-bottom-hud',
  standalone: true,
  imports: [CommonModule, HudButtonGridComponent, HudMinimapComponent, HudInfoPaneComponent],
  templateUrl: './bottom-hud.component.html',
  styleUrls: ['./bottom-hud.component.scss'],
})
export class BottomHudComponent {
  @Input({ required: true })
  leftPane!: HudInfoPaneContent;

  @Input({ required: true })
  rightPane!: HudInfoPaneContent;

  @Input({ required: true })
  actions!: HudAction[];

  @Output()
  readonly actionSelected = new EventEmitter<string>();

  protected readonly hudHeight = 160; // 10 * 16px, grounded per charter guidance.
  protected readonly gutter = 8;

  protected handleAction(actionId: string): void {
    this.actionSelected.emit(actionId);
  }
}
