import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HudIconComponent } from './hud-icon.component';

export interface HudAction {
  id: string;
  label: string;
  icon?: string;
}

@Component({
  selector: 'app-hud-button-grid',
  standalone: true,
  imports: [CommonModule, HudIconComponent],
  templateUrl: './hud-button-grid.component.html',
  styleUrls: ['./hud-button-grid.component.scss'],
})
export class HudButtonGridComponent {
  @Input({ required: true })
  actions!: HudAction[];

  @Output()
  readonly actionSelected = new EventEmitter<string>();

  protected onAction(action: HudAction): void {
    this.actionSelected.emit(action.id);
  }
}
