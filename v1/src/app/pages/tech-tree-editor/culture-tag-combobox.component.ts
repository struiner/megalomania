import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  computed,
  effect,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CultureTagId } from '../../models/tech-tree.models';
import { CultureTagOption } from './tech-tree-editor.types';

@Component({
  selector: 'app-culture-tag-combobox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="combobox" [class.open]="isOpen()" (keydown.escape)="close()">
      <button
        type="button"
        class="trigger"
        role="combobox"
        aria-haspopup="listbox"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-controls]="listboxId"
        (click)="toggleOpen()"
        (keydown)="handleTriggerKeydown($event)"
      >
        <div class="trigger-content" [class.placeholder]="!selectedOrder().length">
          <ng-container *ngIf="selectedOrder().length; else placeholder">
            <div class="token-row" aria-live="polite">
              <span class="token" *ngFor="let option of selectedOptions(); trackBy: trackById">
                <span class="pill">{{ option.source }}</span>
                <span class="label">{{ option.label }}</span>
              </span>
            </div>
          </ng-container>
          <ng-template #placeholder>
            <span>{{ placeholderText }}</span>
          </ng-template>
        </div>
        <span class="chevron" aria-hidden="true">▾</span>
      </button>

      <div class="panel" *ngIf="isOpen()">
        <div class="filter-row">
          <label class="sr-only" [for]="inputId">Filter culture tags</label>
          <input
            [id]="inputId"
            type="text"
            [value]="query()"
            (input)="updateQuery(($event.target as HTMLInputElement).value)"
            (keydown)="handleInputKeydown($event)"
            [attr.aria-controls]="listboxId"
            aria-label="Filter culture tags"
            placeholder="Search culture tags"
          />
          <button type="button" class="clear" *ngIf="query()" (click)="clearQuery()" aria-label="Clear filter">
            ✕
          </button>
        </div>

        <ul
          class="option-list"
          role="listbox"
          [id]="listboxId"
          aria-multiselectable="true"
          [attr.aria-activedescendant]="activeOptionId()"
        >
          <li
            *ngFor="let option of filteredOptions(); let index = index; trackBy: trackById"
            role="option"
            [id]="optionId(option)"
            [attr.aria-selected]="selectedSet().has(option.id)"
            [class.active]="index === activeIndex()"
            [class.selected]="selectedSet().has(option.id)"
            (click)="toggleOption(option.id)"
            (mouseenter)="activeIndex.set(index)"
          >
            <span class="checkbox" aria-hidden="true"></span>
            <div class="option-labels">
              <span class="label">{{ option.label }}</span>
              <span class="meta">{{ option.id }}</span>
            </div>
            <span class="namespace">{{ option.source }}</span>
          </li>
          <li class="empty" *ngIf="!filteredOptions().length">
            <span>No culture tags match your filter.</span>
          </li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .combobox {
      display: grid;
      gap: 6px;
    }

    .trigger {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.14);
      background: rgba(0, 0, 0, 0.35);
      color: inherit;
      cursor: pointer;
      text-align: left;
    }

    .trigger:focus-visible {
      outline: 2px solid #9de5ff;
      outline-offset: 2px;
    }

    .trigger-content {
      min-height: 24px;
      display: grid;
      align-items: center;
    }

    .trigger-content.placeholder {
      opacity: 0.76;
    }

    .token-row {
      display: flex;
      flex-wrap: nowrap;
      gap: 6px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .token {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 6px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
    }

    .pill {
      font-size: 11px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      opacity: 0.78;
    }

    .label {
      font-weight: 600;
    }

    .chevron {
      font-size: 14px;
      opacity: 0.8;
    }

    .panel {
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.54);
      padding: 8px;
      display: grid;
      gap: 6px;
    }

    .filter-row {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 6px;
      align-items: center;
    }

    input[type='text'] {
      width: 100%;
      padding: 8px 10px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.18);
      background: rgba(0, 0, 0, 0.4);
      color: inherit;
    }

    .clear {
      border: 1px solid rgba(255, 255, 255, 0.18);
      background: rgba(255, 255, 255, 0.06);
      color: inherit;
      border-radius: 6px;
      padding: 8px 10px;
      cursor: pointer;
      min-width: 38px;
    }

    .option-list {
      list-style: none;
      padding: 0;
      margin: 0;
      max-height: 220px;
      overflow: auto;
      display: grid;
      gap: 4px;
    }

    .option-list li {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 8px;
      align-items: center;
      padding: 6px 8px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(255, 255, 255, 0.03);
      cursor: pointer;
    }

    .option-list li.active {
      border-color: #9de5ff;
      box-shadow: 0 0 0 1px rgba(157, 229, 255, 0.24);
    }

    .option-list li.selected .checkbox {
      background: linear-gradient(180deg, #ffd369 0%, #ffaf3a 100%);
      border-color: #ffaf3a;
      box-shadow: inset 0 1px 0 rgba(0, 0, 0, 0.35);
    }

    .option-list li.selected .checkbox::after {
      content: '';
      position: absolute;
      width: 6px;
      height: 10px;
      border: 2px solid #2d1b05;
      border-top: 0;
      border-left: 0;
      transform: rotate(45deg);
      top: 2px;
      left: 5px;
    }

    .option-list li.empty {
      text-align: center;
      opacity: 0.8;
      border-style: dashed;
    }

    .checkbox {
      position: relative;
      width: 18px;
      height: 18px;
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.28);
      background: rgba(255, 255, 255, 0.06);
    }

    .option-labels {
      display: grid;
      gap: 2px;
      min-width: 0;
    }

    .option-labels .meta {
      opacity: 0.7;
      font-size: 12px;
      font-family: 'Fira Code', monospace;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .namespace {
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 11px;
      opacity: 0.76;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      border: 0;
    }
  `],
})
export class CultureTagComboboxComponent implements OnChanges {
  @Input({ required: true }) options: CultureTagOption[] = [];
  @Input({ required: true }) selectedIds: CultureTagId[] = [];
  @Input() placeholderText = 'Select culture tags';

  @Output() selectionChange = new EventEmitter<CultureTagId[]>();

  protected readonly isOpen = signal(false);
  protected readonly query = signal('');
  protected readonly activeIndex = signal(0);

  private readonly optionsState = signal<CultureTagOption[]>([]);
  private readonly selectedState = signal<Set<CultureTagId>>(new Set<CultureTagId>());

  protected readonly filteredOptions = computed(() => {
    const search = this.query().trim().toLowerCase();
    const options = this.optionsState();

    if (!search) return options;

    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(search)
        || option.id.toLowerCase().includes(search)
        || option.source.toLowerCase().includes(search),
    );
  });

  protected readonly selectedOrder = computed(() =>
    this.optionsState()
      .filter((option) => this.selectedState().has(option.id))
      .map((option) => option.id),
  );

  protected readonly selectedOptions = computed(() =>
    this.optionsState().filter((option) => this.selectedState().has(option.id)),
  );

  readonly inputId = 'culture-tag-filter';
  readonly listboxId = 'culture-tag-listbox';

  constructor() {
    effect(() => {
      const filtered = this.filteredOptions();
      const index = this.activeIndex();

      if (!filtered.length) {
        this.activeIndex.set(-1);
      } else if (index < 0 || index >= filtered.length) {
        this.activeIndex.set(0);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.optionsState.set(this.options || []);
    }

    if (changes['selectedIds']) {
      this.selectedState.set(new Set((this.selectedIds || []) as CultureTagId[]));
    }
  }

  toggleOpen(): void {
    this.isOpen.set(!this.isOpen());
  }

  close(): void {
    this.isOpen.set(false);
  }

  updateQuery(next: string): void {
    this.query.set(next);
    this.activeIndex.set(0);
  }

  clearQuery(): void {
    this.updateQuery('');
  }

  handleTriggerKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.isOpen.set(true);
      this.activeIndex.set(0);
    }
  }

  handleInputKeydown(event: KeyboardEvent): void {
    const total = this.filteredOptions().length;
    if (!total) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.moveActive(1, total);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.moveActive(-1, total);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const active = this.filteredOptions()[this.activeIndex()];
      if (active) {
        this.toggleOption(active.id);
      }
    }
  }

  moveActive(delta: number, total: number): void {
    if (!total) return;
    const nextIndex = (this.activeIndex() + delta + total) % total;
    this.activeIndex.set(nextIndex);
  }

  toggleOption(tagId: CultureTagId): void {
    const nextSelection = new Set(this.selectedState());
    if (nextSelection.has(tagId)) {
      nextSelection.delete(tagId);
    } else {
      nextSelection.add(tagId);
    }

    this.selectedState.set(nextSelection);
    const ordered = this.optionsState()
      .filter((option) => nextSelection.has(option.id))
      .map((option) => option.id);
    this.selectionChange.emit(ordered);
  }

  trackById(_: number, option: CultureTagOption): string {
    return option.id;
  }

  optionId(option: CultureTagOption): string {
    return `culture-tag-option-${option.id}`;
  }

  activeOptionId(): string | null {
    const option = this.filteredOptions()[this.activeIndex()];
    return option ? this.optionId(option) : null;
  }

  protected selectedSet(): Set<CultureTagId> {
    return this.selectedState();
  }
}
