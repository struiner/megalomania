import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HudStandaloneDialogComponent } from './hud-standalone-dialog.component';
import { HudIconHeaderComponent } from './hud-icon-header.component';
import { HudPanelDefinition } from '../hud-panel-registry';

@Component({
  selector: 'app-hud-overlay-shell',
  standalone: true,
  imports: [CommonModule, HudStandaloneDialogComponent, HudIconHeaderComponent],
  templateUrl: './hud-overlay-shell.component.html',
  styleUrls: ['./hud-overlay-shell.component.scss'],
})
export class HudOverlayShellComponent {
  @Input({ required: true })
  panels!: HudPanelDefinition[];

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

  protected getPanelLabel(panelId: string): string {
    return this.panels?.find((panel) => panel.id === panelId)?.label ?? 'HUD Panel';
  }

  protected getPanelIcon(panelId: string): string | undefined {
    return this.panels?.find((panel) => panel.id === panelId)?.icon;
  }
}
