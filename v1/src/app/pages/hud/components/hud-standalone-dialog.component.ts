import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { HudIconHeaderComponent } from './hud-icon-header.component';

@Component({
  selector: 'app-hud-standalone-dialog',
  standalone: true,
  imports: [CommonModule, HudIconHeaderComponent],
  templateUrl: './hud-standalone-dialog.component.html',
  styleUrls: ['./hud-standalone-dialog.component.scss'],
})
export class HudStandaloneDialogComponent {
  @Input({ required: true })
  heading!: string;

  @Input()
  subheading?: string;

  @Input()
  icon?: string;

  @Input()
  width = 520;

  @Output()
  readonly closeRequested = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    // TODO: Confirm whether ESC should bubble to HUD router or remain local to dialog shell.
    this.closeRequested.emit();
  }

  protected requestClose(): void {
    this.closeRequested.emit();
  }
}
