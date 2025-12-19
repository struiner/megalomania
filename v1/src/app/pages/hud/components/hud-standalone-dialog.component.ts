import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { HudIconHeaderComponent } from './hud-icon-header.component';

/**
 * Standalone HUD dialog shell.
 *
 * ESC handling is **local to this dialog**: the most recently created dialog instance consumes the
 * Escape key, stops propagation, and raises `closeRequested` so parents can decide whether to
 * navigate or dismiss. This prevents HUD-level ESC routers from double-closing stacked dialogs while
 * keeping accessibility semantics explicit at the shell boundary.
 */
@Component({
  selector: 'app-hud-standalone-dialog',
  standalone: true,
  imports: [CommonModule, HudIconHeaderComponent],
  templateUrl: './hud-standalone-dialog.component.html',
  styleUrls: ['./hud-standalone-dialog.component.scss'],
})
export class HudStandaloneDialogComponent implements OnInit, OnDestroy {
  private static openStack: HudStandaloneDialogComponent[] = [];

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

  ngOnInit(): void {
    HudStandaloneDialogComponent.openStack.push(this);
  }

  ngOnDestroy(): void {
    HudStandaloneDialogComponent.openStack = HudStandaloneDialogComponent.openStack.filter(
      (instance) => instance !== this,
    );
  }

  @HostListener('document:keydown.escape', ['$event'])
  protected onEscape(event: KeyboardEvent): void {
    if (event.defaultPrevented || !this.isTopMost()) {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
    this.closeRequested.emit();
  }

  protected requestClose(): void {
    this.closeRequested.emit();
  }

  private isTopMost(): boolean {
    const { openStack } = HudStandaloneDialogComponent;
    return openStack[openStack.length - 1] === this;
  }
}
