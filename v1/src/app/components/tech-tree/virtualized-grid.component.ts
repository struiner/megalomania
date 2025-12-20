import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { EditorTechNode } from '../../pages/tech-tree-editor/tech-tree-editor.types';

export interface VirtualizedWindow {
  startRow: number;
  endRow: number;
  startColumn: number;
  endColumn: number;
}

@Component({
  selector: 'app-virtualized-grid',
  standalone: true,
  imports: [CommonModule],
  template: '<ng-content></ng-content>',
})
export class VirtualizedGridComponent implements OnChanges {
  @Input() nodes: EditorTechNode[] = [];
  @Input() viewportWidth = 0;
  @Input() viewportHeight = 0;
  @Input() panX = 0;
  @Input() panY = 0;
  @Input() scale = 1;
  @Input() columnWidth = 220;
  @Input() rowHeight = 96;

  @Output() visibleNodesChange = new EventEmitter<EditorTechNode[]>();
  @Output() windowChange = new EventEmitter<VirtualizedWindow>();

  ngOnChanges(changes: SimpleChanges): void {
    if (this.viewportWidth && this.viewportHeight) {
      this.emitWindow();
    } else if (changes['nodes']) {
      this.visibleNodesChange.emit(this.nodes);
    }
  }

  private emitWindow(): void {
    const scaledColumnWidth = this.columnWidth * this.scale;
    const scaledRowHeight = this.rowHeight * this.scale;
    const visibleColumns = Math.ceil(this.viewportWidth / Math.max(1, scaledColumnWidth)) + 2;
    const visibleRows = Math.ceil(this.viewportHeight / Math.max(1, scaledRowHeight)) + 2;

    const startColumn = Math.max(0, Math.floor(-this.panX / Math.max(1, scaledColumnWidth)) - 1);
    const startRow = Math.max(0, Math.floor(-this.panY / Math.max(1, scaledRowHeight)) - 1);

    const window: VirtualizedWindow = {
      startColumn,
      endColumn: startColumn + visibleColumns,
      startRow,
      endRow: startRow + visibleRows,
    };

    this.windowChange.emit(window);

    const visibleNodes = this.nodes.filter((node) => {
      const columnIndex = Math.max(0, (node.display_order || 1) - 1);
      const rowIndex = Math.max(0, (node.tier || 1) - 1);
      return columnIndex >= window.startColumn
        && columnIndex <= window.endColumn
        && rowIndex >= window.startRow
        && rowIndex <= window.endRow;
    });

    this.visibleNodesChange.emit(visibleNodes);
  }
}
