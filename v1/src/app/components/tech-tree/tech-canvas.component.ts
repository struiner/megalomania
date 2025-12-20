import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  signal,
} from '@angular/core';
import { EditorTechNode } from '../../pages/tech-tree-editor/tech-tree-editor.types';
import { TechTreeConnectionOverlayComponent } from '../../pages/tech-tree-editor/tech-tree-connection-overlay.component';
import {
  DragDropAnnouncerService,
  DragDropBehaviorDirective,
  DragDropCell,
  DragKeyboardMove,
} from './drag-drop-behavior';
import { VirtualizedGridComponent, VirtualizedWindow } from './virtualized-grid.component';

export interface CanvasViewport {
  panX: number;
  panY: number;
  scale: number;
}

@Component({
  selector: 'app-tech-canvas',
  standalone: true,
  imports: [CommonModule, DragDropBehaviorDirective, VirtualizedGridComponent, TechTreeConnectionOverlayComponent],
  templateUrl: './tech-canvas.component.html',
  styleUrls: ['./tech-canvas.component.scss'],
})
export class TechCanvasComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() tierBands: number[] = [];
  @Input() columnLabels: number[] = [];
  @Input() nodes: EditorTechNode[] = [];
  @Input() selectedId: string | null = null;
  @Input() viewport: CanvasViewport = { panX: 0, panY: 0, scale: 1 };

  @Output() viewportChange = new EventEmitter<CanvasViewport>();
  @Output() moveNode = new EventEmitter<{ nodeId: string; tier: number; column: number }>();
  @Output() selectNode = new EventEmitter<string>();

  @ViewChild('viewportRef', { static: true }) viewportRef!: ElementRef<HTMLElement>;

  protected pan = signal<{ x: number; y: number }>({ x: 0, y: 0 });
  protected scale = signal(1);
  protected activeCell = signal<{ tier: number; column: number }>({ tier: 1, column: 1 });
  protected focusVersion = signal(0);
  protected activeDragId = signal<string | null>(null);
  protected viewportSize = signal<{ width: number; height: number }>({ width: 0, height: 0 });
  protected visibleWindow = signal<VirtualizedWindow | null>(null);
  protected visibleNodes = signal<EditorTechNode[]>([]);

  private resizeObserver?: ResizeObserver;

  constructor(public readonly announcer: DragDropAnnouncerService) {}

  ngAfterViewInit(): void {
    this.pan.set({ x: this.viewport.panX, y: this.viewport.panY });
    this.scale.set(this.viewport.scale);
    this.resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry?.contentRect) {
        this.viewportSize.set({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });
    this.resizeObserver.observe(this.viewportRef.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['viewport'] && this.viewport) {
      this.pan.set({ x: this.viewport.panX, y: this.viewport.panY });
      this.scale.set(this.viewport.scale);
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    event.preventDefault();
    if (event.ctrlKey || event.metaKey) {
      const delta = -event.deltaY * 0.0015;
      const nextScale = this.clampScale(this.scale() + delta);
      this.scale.set(nextScale);
      this.emitViewport();
    } else {
      const factor = 1 / Math.max(0.25, this.scale());
      const nextPan = {
        x: this.pan().x - event.deltaX * factor,
        y: this.pan().y - event.deltaY * factor,
      };
      this.pan.set(nextPan);
      this.emitViewport();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.altKey && ['=', '+', '-'].includes(event.key)) {
      event.preventDefault();
      const delta = event.key === '-' ? -0.1 : 0.1;
      this.scale.set(this.clampScale(this.scale() + delta));
      this.emitViewport();
      this.announce(`Zoom ${Math.round(this.scale() * 100)} percent`);
      return;
    }

    if (!event.ctrlKey && !event.metaKey) {
      const offset = this.getOffset(event.key);
      if (offset) {
        event.preventDefault();
        this.shiftActiveCell(offset.dx, offset.dy);
      }
    }
  }

  onWindowChange(window: VirtualizedWindow): void {
    this.visibleWindow.set(window);
    const cell = this.activeCell();
    const normalized = {
      tier: Math.max(window.startRow + 1, Math.min(window.endRow + 1, cell.tier)),
      column: Math.max(window.startColumn + 1, Math.min(window.endColumn + 1, cell.column)),
    };
    if (normalized.tier !== cell.tier || normalized.column !== cell.column) {
      this.activeCell.set(normalized);
      this.focusVersion.update((value) => value + 1);
    }
  }

  onVisibleNodesChange(nodes: EditorTechNode[]): void {
    this.visibleNodes.set(nodes);
  }

  onPointerGrab(nodeId: string, event: DragEvent): void {
    event.dataTransfer?.setData('text/plain', nodeId);
    this.onGrab(nodeId);
  }

  onGrab(nodeId: string): void {
    this.activeDragId.set(nodeId);
    this.announce(`Grabbed ${nodeId}. Navigate to a tier and column to drop.`);
  }

  onDrop(cell: DragDropCell): void {
    const nodeId = this.activeDragId() ?? cell.nodeId;
    if (!nodeId) {
      this.announce('No node selected for drop.');
      return;
    }

    this.moveNode.emit({ nodeId, tier: cell.tier, column: cell.column });
    this.activeDragId.set(null);
    this.activeCell.set({ tier: cell.tier, column: cell.column });
    this.focusVersion.update((value) => value + 1);
  }

  onRequestMove(payload: DragKeyboardMove): void {
    this.moveNode.emit({ nodeId: payload.nodeId, tier: payload.tier, column: payload.column });
    this.activeCell.set({ tier: payload.tier, column: payload.column });
    this.focusVersion.update((value) => value + 1);
  }

  onFocusCell(cell: DragDropCell): void {
    this.activeCell.set({ tier: cell.tier, column: cell.column });
  }

  onSelect(nodeId: string): void {
    this.selectNode.emit(nodeId);
  }

  announce(message: string): void {
    this.announcer.announce(message);
  }

  nodeAt(tier: number, column: number): EditorTechNode | undefined {
    const source = this.visibleWindow() ? this.visibleNodes() : this.nodes;
    return source.find(
      (node) => (node.tier || 1) === tier && (node.display_order || 1) === column,
    );
  }

  isActiveCell(tier: number, column: number): boolean {
    const cell = this.activeCell();
    return cell.tier === tier && cell.column === column;
  }

  allowDrop(tier: number, column: number): boolean {
    const occupant = this.nodeAt(tier, column);
    if (!this.activeDragId()) return !occupant;
    return !occupant || occupant.id === this.activeDragId();
  }

  trackTier = (_: number, tier: number) => tier;
  trackColumn = (_: number, column: number) => column;
  visibleColumns(): number[] {
    const window = this.visibleWindow();
    if (!window) return this.columnLabels;
    const visible = this.columnLabels.filter((_, index) => index >= window.startColumn && index <= window.endColumn);
    return visible.length ? visible : this.columnLabels;
  }

  visibleTiers(): number[] {
    const window = this.visibleWindow();
    if (!window) return this.tierBands;
    const visible = this.tierBands.filter((_, index) => index >= window.startRow && index <= window.endRow);
    return visible.length ? visible : this.tierBands;
  }

  overlayNodes() {
    const window = this.visibleWindow();
    const lookup = new Map<string, { column: number; row: number; tier: number }>();
    this.nodes.forEach((node) => {
      const columnIndex = Math.max(0, (node.display_order || 1) - 1);
      const rowIndex = Math.max(0, (node.tier || 1) - 1);
      if (
        !window
        || (columnIndex >= window.startColumn && columnIndex <= window.endColumn
        && rowIndex >= window.startRow && rowIndex <= window.endRow)
      ) {
        lookup.set(node.id, { column: columnIndex, row: rowIndex, tier: node.tier || 1 });
      }
    });

    return Array.from(lookup.entries()).map(([id, position]) => ({ id, ...position }));
  }

  overlayEdges() {
    const positions = new Map(this.overlayNodes().map((node) => [node.id, node]));
    return this.nodes
      .flatMap((node) =>
        node.prerequisites.map((prereq) => {
          const from = positions.get(prereq.node);
          const to = positions.get(node.id);
          if (!from || !to) return null;
          return { from, to, relation: prereq.relation };
        }),
      )
      .filter((edge): edge is NonNullable<typeof edge> => Boolean(edge));
  }

  private emitViewport(): void {
    this.viewportChange.emit({ panX: this.pan().x, panY: this.pan().y, scale: this.scale() });
  }

  private clampScale(value: number): number {
    return Math.min(2, Math.max(0.6, value));
  }

  private shiftActiveCell(dx: number, dy: number): void {
    const nextTier = Math.max(1, Math.min((this.tierBands.at(-1) || 1), this.activeCell().tier + dy));
    const nextColumn = Math.max(1, Math.min(this.columnLabels.length, this.activeCell().column + dx));
    this.activeCell.set({ tier: nextTier, column: nextColumn });
    this.focusVersion.update((value) => value + 1);
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
