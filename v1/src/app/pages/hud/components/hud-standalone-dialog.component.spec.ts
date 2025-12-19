import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HudStandaloneDialogComponent } from './hud-standalone-dialog.component';

@Component({
  standalone: true,
  imports: [HudStandaloneDialogComponent],
  template: `
    <app-hud-standalone-dialog heading="Primary" (closeRequested)="primaryClosed++">
      <p>Primary dialog</p>
    </app-hud-standalone-dialog>

    <app-hud-standalone-dialog
      *ngIf="showSecondary"
      heading="Secondary"
      (closeRequested)="secondaryClosed++"
    >
      <p>Secondary dialog</p>
    </app-hud-standalone-dialog>
  `,
})
class DialogHostComponent {
  showSecondary = true;
  primaryClosed = 0;
  secondaryClosed = 0;
}

describe('HudStandaloneDialogComponent ESC handling', () => {
  let fixture: ComponentFixture<DialogHostComponent>;
  let host: DialogHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  function dispatchEscape(): KeyboardEvent {
    const event = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true, bubbles: true });
    document.dispatchEvent(event);
    return event;
  }

  it('consumes ESC locally for the top-most dialog', () => {
    const event = dispatchEscape();

    expect(event.defaultPrevented).toBeTrue();
    expect(host.secondaryClosed).toBe(1);
    expect(host.primaryClosed).toBe(0);
  });

  it('falls back to the remaining dialog after the top-most is destroyed', () => {
    host.showSecondary = false;
    fixture.detectChanges();

    const event = dispatchEscape();

    expect(event.defaultPrevented).toBeTrue();
    expect(host.primaryClosed).toBe(1);
    expect(host.secondaryClosed).toBe(0);
  });

  it('honors events that were already handled upstream', () => {
    host.primaryClosed = 0;
    const event = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true, bubbles: true });
    event.preventDefault();

    document.dispatchEvent(event);

    expect(host.primaryClosed).toBe(0);
    expect(host.secondaryClosed).toBe(0);
  });
});
