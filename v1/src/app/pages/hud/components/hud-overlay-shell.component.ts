import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { HudStandaloneDialogComponent } from './hud-standalone-dialog.component';
import { HudIconHeaderComponent } from './hud-icon-header.component';
import { HudPanelDefinition } from '../hud-panel-registry';
import { HudAvailabilityService } from '../hud-availability.service';
import { HudPanelGateDecision } from '../hud-availability.service';

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

  @Output()
  readonly panelBlocked = new EventEmitter<{ panelId: string; decision: HudPanelGateDecision }>();

  protected dragOffsetX = 0;
  protected dragOffsetY = 0;
  protected isDragging = false;
  protected dragAnchor: { x: number; y: number } | null = null;

  constructor(private readonly availability: HudAvailabilityService) {}

  @HostListener('document:mouseup')
  protected stopDrag(): void {
    this.isDragging = false;
    this.dragAnchor = null;
  }

  @HostListener('document:mousemove', ['$event'])
  protected handleDrag(event: MouseEvent): void {
    if (!this.isDragging || !this.dragAnchor) {
      return;
    }

    const nextX = Math.round(event.clientX - this.dragAnchor.x);
    const nextY = Math.round(event.clientY - this.dragAnchor.y);

    this.dragOffsetX = this.snapToGrid(this.boundHorizontal(nextX));
    this.dragOffsetY = this.snapToGrid(this.boundVertical(nextY));
  }

  protected requestClose(): void {
    this.closeRequested.emit();
  }

  protected requestPanel(panelId: string): void {
    if (panelId === this.activePanel) {
      // TODO: Confirm whether re-selecting the active tab should close the overlay or reset panel state.
      this.closeRequested.emit();
      return;
    }

    const gate = this.availability.evaluatePanel(this.getPanel(panelId));

    if (!gate.allowed) {
      this.availability.announceBlockedPanel(this.getPanel(panelId), gate);
      this.panelBlocked.emit({ panelId, decision: gate });
      return;
    }

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

  protected getPanel(panelId: string): HudPanelDefinition {
    return this.panels?.find((panel) => panel.id === panelId) ?? { id: panelId, label: panelId };
  }

  protected isPanelAvailable(panelId: string): boolean {
    return this.availability.evaluatePanel(this.getPanel(panelId)).allowed;
  }

  protected getBlockReason(panelId: string): string | undefined {
    const decision = this.availability.evaluatePanel(this.getPanel(panelId));
    return decision.allowed ? undefined : decision.reason;
  }

  protected startDrag(event: MouseEvent): void {
    if ((event.target as HTMLElement)?.closest('button.tab')) {
      return; // Allow tab click without dragging.
    }

    this.isDragging = true;
    this.dragAnchor = {
      x: event.clientX - this.dragOffsetX,
      y: event.clientY - this.dragOffsetY,
    };
  }

  protected getTransform(): string {
    return `translate(-50%, 0) translate(${this.dragOffsetX}px, ${this.dragOffsetY}px)`;
  }

  private boundHorizontal(offset: number): number {
    const maxOffset = Math.max(0, Math.floor(window.innerWidth / 2 - 220));
    return Math.min(Math.max(offset, -maxOffset), maxOffset);
  }

  private boundVertical(offset: number): number {
    const maxRise = Math.max(0, Math.floor(window.innerHeight / 2));
    const maxDrop = Math.floor(0.25 * parseInt(getComputedStyle(document.documentElement).getPropertyValue('--bottom-hud-height') || '160', 10));

    // Favor upward movement; prevent collision with bottom HUD.
    return Math.min(Math.max(offset, -maxRise), maxDrop);
  }

  private snapToGrid(offset: number): number {
    const gridSize = 4; // TODO: Confirm whether snapping should honor a different pixel multiple.
    return Math.round(offset / gridSize) * gridSize;
  }
}
