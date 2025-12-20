import {
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Inject,
  Injectable,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

export interface DragDropCell {
  tier: number;
  column: number;
  nodeId?: string | null;
  columnLabel?: number;
}

export interface DragKeyboardMove {
  nodeId: string;
  tier: number;
  column: number;
}

@Injectable({ providedIn: 'root' })
export class DragDropAnnouncerService {
  private lastMessage = '';

  message(): string {
    return this.lastMessage;
  }

  announce(message: string): void {
    this.lastMessage = message;
  }
}

@Directive({
  selector: '[appDragDropBehavior]',
  standalone: true,
})
export class DragDropBehaviorDirective implements OnChanges {
  @Input('appDragDropBehavior') cell!: DragDropCell;
  @Input() activeDragId: string | null = null;
  @Input() active = false;
  @Input() allowDrop = true;
  @Input() focusVersion = 0;

  @Output() drop = new EventEmitter<DragDropCell>();
  @Output() requestMove = new EventEmitter<DragKeyboardMove>();
  @Output() requestGrab = new EventEmitter<string>();
  @Output() focusCell = new EventEmitter<DragDropCell>();
  @Output() announce = new EventEmitter<string>();

  @HostBinding('attr.role') role = 'gridcell';
  @HostBinding('attr.tabindex') get tabIndex(): number {
    return this.active ? 0 : -1;
  }
  @HostBinding('attr.aria-selected') get ariaSelected(): boolean {
    return Boolean(this.cell?.nodeId && this.active);
  }
  @HostBinding('attr.aria-label') get ariaLabel(): string {
    const base = `Tier ${this.cell?.tier || 0}, column ${this.cell?.column || 0}`;
    if (this.cell?.nodeId) {
      return `${base}. Contains ${this.cell.nodeId}.`;
    }
    return `${base}. Empty slot.`;
  }

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['focusVersion'] && this.active) {
      queueMicrotask(() => this.elementRef.nativeElement.focus());
    }
  }

  @HostListener('focus')
  onFocus(): void {
    this.focusCell.emit(this.cell);
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!this.activeDragId && this.cell?.nodeId) {
        this.requestGrab.emit(this.cell.nodeId);
        this.announce.emit(`Picked up ${this.cell.nodeId}. Use arrow keys with control to move.`);
        return;
      }

      if (this.activeDragId && this.allowDrop) {
        this.drop.emit(this.cell);
        this.announce.emit(`Dropped on tier ${this.cell.tier}, column ${this.cell.column}.`);
      } else {
        this.announce.emit('Cannot drop here. Slot is blocked.');
      }
      return;
    }

    if (event.ctrlKey || event.metaKey) {
      const offset = this.getOffset(event.key);
      if (offset && this.cell?.nodeId) {
        event.preventDefault();
        const target: DragKeyboardMove = {
          nodeId: this.cell.nodeId,
          tier: Math.max(1, this.cell.tier + offset.dy),
          column: Math.max(1, this.cell.column + offset.dx),
        };
        this.requestMove.emit(target);
        this.announce.emit(`Move ${this.cell.nodeId} to tier ${target.tier}, column ${target.column}.`);
      }
    }
  }

  @HostListener('dragover', ['$event'])
  allowPointerDrop(event: DragEvent): void {
    if (!this.allowDrop) return;
    event.preventDefault();
  }

  @HostListener('drop', ['$event'])
  onPointerDrop(event: DragEvent): void {
    if (!this.allowDrop) return;
    event.preventDefault();
    this.drop.emit(this.cell);
  }

  private getOffset(key: string): { dx: number; dy: number } | null {
    switch (key) {
      case 'ArrowUp':
        return { dx: 0, dy: -1 };
      case 'ArrowDown':
        return { dx: 0, dy: 1 };
      case 'ArrowLeft':
        return { dx: -1, dy: 0 };
      case 'ArrowRight':
        return { dx: 1, dy: 0 };
      default:
        return null;
    }
  }
}
