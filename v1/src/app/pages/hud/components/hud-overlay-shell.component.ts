import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface HudOverlayPanel {
  id: string;
  label: string;
  description?: string;
}

@Component({
  selector: 'app-hud-overlay-shell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hud-overlay-shell.component.html',
  styleUrls: ['./hud-overlay-shell.component.scss'],
})
export class HudOverlayShellComponent {
  @Input({ required: true })
  panels!: HudOverlayPanel[];

  @Input({ required: true })
  activePanel!: string;

  @Output()
  readonly closeRequested = new EventEmitter<void>();

  @Output()
  readonly panelSelected = new EventEmitter<string>();

  protected requestClose(): void {
    this.closeRequested.emit();
  }

  protected requestPanel(panelId: string): void {
    this.panelSelected.emit(panelId);
  }

  protected getPanelDescription(panelId: string): string {
    const match = this.panels?.find((panel) => panel.id === panelId);
    return match?.description ?? 'Placeholder panel shell';
  }

  // TODO: Add dynamic route guarding once feature-flag strategy is defined.
}
