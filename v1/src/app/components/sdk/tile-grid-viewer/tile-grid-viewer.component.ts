import { Component, OnInit, OnDestroy, OnChanges, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { TilemapConfig, TileInfo } from '../../services/mk2/tools/tilemap-analysis.service';

@Component({
  selector: 'app-tile-grid-viewer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSliderModule,
    MatCheckboxModule
  ],
  template: `
    <div class="tile-grid-viewer">
      <!-- Toolbar -->
      <div class="viewer-toolbar">
        <div class="zoom-controls">
          <button mat-icon-button (click)="zoomOut()" matTooltip="Zoom Out">
            <mat-icon>zoom_out</mat-icon>
          </button>
          <span class="zoom-level">{{ (zoomLevel * 100).toFixed(0) }}%</span>
          <button mat-icon-button (click)="zoomIn()" matTooltip="Zoom In">
            <mat-icon>zoom_in</mat-icon>
          </button>
          <button mat-icon-button (click)="resetZoom()" matTooltip="Reset Zoom">
            <mat-icon>center_focus_strong</mat-icon>
          </button>
        </div>

        <div class="view-options">
          <mat-checkbox [(ngModel)]="showGrid" (change)="redraw()">
            Show Grid
          </mat-checkbox>
          <mat-checkbox [(ngModel)]="showLabels" (change)="redraw()">
            Show Labels
          </mat-checkbox>
          <mat-checkbox [(ngModel)]="showSelection" (change)="redraw()">
            Show Selection
          </mat-checkbox>
        </div>

        <div class="selection-tools">
          <button mat-button (click)="selectAll()" matTooltip="Select All">
            <mat-icon>select_all</mat-icon>
            All
          </button>
          <button mat-button (click)="selectNone()" matTooltip="Clear Selection">
            <mat-icon>deselect</mat-icon>
            None
          </button>
          <button mat-button (click)="invertSelection()" matTooltip="Invert Selection">
            <mat-icon>flip</mat-icon>
            Invert
          </button>
        </div>

        <div class="info-display">
          <span *ngIf="config">{{ config.tilesPerRow }}×{{ config.tilesPerColumn }} tiles</span>
          <span *ngIf="selectedTiles.length > 0" class="selection-count">
            {{ selectedTiles.length }} selected
          </span>
        </div>
      </div>

      <!-- Canvas Container -->
      <div class="canvas-container"
           #canvasContainer
           tabindex="0"
           (keydown)="onKeyDown($event)"
           (wheel)="onWheel($event)"
           (mousedown)="onMouseDown($event)"
           (mousemove)="onMouseMove($event)"
           (mouseup)="onMouseUp($event)"
           (mouseleave)="onMouseLeave($event)">
        
        <canvas #gridCanvas
                id="tilemap-creation-canvas"
                class="grid-canvas">
        </canvas>
      </div>

      <!-- Status Bar -->
      <div class="status-bar">
        <div class="status-left">
          <span *ngIf="hoveredTile">
            Tile: {{ hoveredTile.name }} ({{ hoveredTile.gridX }}, {{ hoveredTile.gridY }})
            - {{ hoveredTile.category }}/{{ hoveredTile.subcategory }}
          </span>
        </div>
        
        <div class="status-right">
          <span *ngIf="config">
            {{ config.tileWidth }}×{{ config.tileHeight }}px tiles
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tile-grid-viewer {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 500px;
      background: #f5f5f5;
    }

    .viewer-toolbar {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 8px 16px;
      background: white;
      border-bottom: 1px solid #e0e0e0;
      flex-wrap: wrap;
    }

    .zoom-controls,
    .view-options,
    .selection-tools,
    .info-display {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .zoom-level {
      font-size: 0.9em;
      color: #666;
      min-width: 40px;
      text-align: center;
    }

    .selection-count {
      color: #1976d2;
      font-weight: 500;
    }

    .canvas-container {
      flex: 1;
      position: relative;
      overflow: auto;
      background: #e0e0e0;
      cursor: crosshair;
      min-height: 600px;
      height: 100%;
    }

    .grid-canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: white;
      border: 1px solid #ccc;
      image-rendering: pixelated;
      z-index: 1;
    }

    .status-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 16px;
      background: white;
      border-top: 1px solid #e0e0e0;
      font-size: 0.9em;
    }

    .status-left {
      color: #333;
    }

    .status-right {
      color: #666;
    }

    /* Selection styles */
    .canvas-container.selecting {
      cursor: crosshair;
    }

    .canvas-container.panning {
      cursor: grabbing;
    }
  `]
})
export class TileGridViewerComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @ViewChild('gridCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasContainer') containerRef!: ElementRef<HTMLDivElement>;

  @Input() config: TilemapConfig | null = null;
  @Input() tiles: TileInfo[] = [];
  @Input() selectedTileIds: string[] = [];

  @Output() tileSelected = new EventEmitter<TileInfo>();
  @Output() tilesSelected = new EventEmitter<TileInfo[]>();
  @Output() selectionChanged = new EventEmitter<string[]>();

  // View state
  zoomLevel = 1;
  showGrid = true;
  showLabels = false;
  showSelection = true;

  // Canvas state
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private spritesheet: HTMLImageElement | null = null;
  
  // Interaction state
  private isSelecting = false;
  private isPanning = false;
  private lastMousePos = { x: 0, y: 0 };
  private panOffset = { x: 0, y: 0 };
  private selectionStart: { x: number, y: number } | null = null;
  private selectionEnd: { x: number, y: number } | null = null;

  // Current state
  hoveredTile: TileInfo | null = null;
  selectedTiles: TileInfo[] = [];

  private destroy$ = new Subject<void>();

  constructor() {}

  ngOnInit(): void {
    this.updateSelectedTiles();
  }

  ngOnChanges(): void {
    console.log('🔄 TileGridViewer inputs changed:', {
      config: !!this.config,
      tilesCount: this.tiles.length,
      selectedCount: this.selectedTileIds.length
    });

    this.updateSelectedTiles();

    if (this.config && this.canvas) {
      this.loadSpritesheet();
    }
  }

  ngAfterViewInit(): void {
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.ctx.imageSmoothingEnabled = false;

    // IMPORTANT: Resize canvas FIRST, then draw
    this.resizeCanvas();

    // Test canvas AFTER resizing
    this.testCanvas();

    // Only load spritesheet if we have config
    if (this.config) {
      this.loadSpritesheet();
    }
  }

  private testCanvas(): void {
    console.log('🧪 Testing canvas drawing...');

    // Canvas detection debug (disabled)
    // const allCanvases = document.querySelectorAll('canvas');
    // console.log('🔍 Found', allCanvases.length, 'canvas elements');

    // Test 1: Fill entire canvas with light gray
    this.ctx.fillStyle = '#f0f0f0';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Test 2: Draw multiple colored rectangles
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(10, 10, 100, 50);

    this.ctx.fillStyle = 'green';
    this.ctx.fillRect(120, 10, 100, 50);

    this.ctx.fillStyle = 'blue';
    this.ctx.fillRect(230, 10, 100, 50);

    // Test 3: Draw text
    this.ctx.fillStyle = 'black';
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillText('CANVAS IS WORKING!', 10, 100);

    // Test 4: Draw border around entire canvas
    this.ctx.strokeStyle = 'purple';
    this.ctx.lineWidth = 5;
    this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);

    console.log('🧪 Canvas test complete - you should see colored rectangles and text');
    console.log('🧪 Canvas dimensions:', this.canvas.width, 'x', this.canvas.height);
    console.log('🧪 Canvas style:', getComputedStyle(this.canvas));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadSpritesheet(): void {
    if (!this.config) return;

    // Clear existing spritesheet
    this.spritesheet = null;

    const newSpritesheet = new Image();
    newSpritesheet.crossOrigin = 'anonymous';
    newSpritesheet.onload = () => {
      console.log('✅ Spritesheet loaded successfully:', newSpritesheet.width, 'x', newSpritesheet.height);
      this.spritesheet = newSpritesheet;
      // Force redraw now that spritesheet is loaded
      setTimeout(() => this.redraw(), 0);
    };
    newSpritesheet.onerror = (error) => {
      console.error('❌ Failed to load spritesheet:', error);
      console.log('Image URL:', this.config?.imageUrl);
    };
    newSpritesheet.src = this.config.imageUrl;
    console.log('🔄 Loading spritesheet from:', this.config.imageUrl);
  }

  private updateSelectedTiles(): void {
    this.selectedTiles = this.tiles.filter(tile => 
      this.selectedTileIds.includes(tile.id)
    );
  }

  zoomIn(): void {
    this.zoomLevel = Math.min(this.zoomLevel * 1.2, 5);
    this.redraw();
  }

  zoomOut(): void {
    this.zoomLevel = Math.max(this.zoomLevel / 1.2, 0.1);
    this.redraw();
  }

  resetZoom(): void {
    this.zoomLevel = 1;
    this.panOffset = { x: 0, y: 0 };
    this.redraw();
  }

  selectAll(): void {
    this.selectAllTiles();
  }

  selectNone(): void {
    this.clearSelection();
  }

  invertSelection(): void {
    const currentIds = new Set(this.selectedTileIds);
    const invertedIds = this.tiles
      .filter(tile => !currentIds.has(tile.id))
      .map(tile => tile.id);
    
    this.selectionChanged.emit(invertedIds);
    this.updateSelectedTiles();
    this.redraw();
  }

  onWheel(event: WheelEvent): void {
    event.preventDefault();
    
    if (event.ctrlKey || event.metaKey) {
      // Zoom
      const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
      this.zoomLevel = Math.max(0.1, Math.min(5, this.zoomLevel * zoomFactor));
      this.redraw();
    } else {
      // Pan
      this.panOffset.x -= event.deltaX;
      this.panOffset.y -= event.deltaY;
      this.redraw();
    }
  }

  onMouseDown(event: MouseEvent): void {
    if (event.button === 1 || (event.button === 0 && event.altKey)) {
      // Middle mouse or Alt+click for panning
      this.isPanning = true;
      this.lastMousePos = { x: event.clientX, y: event.clientY };
    } else if (event.button === 0) {
      // Left click for selection
      this.isSelecting = true;
      this.selectionStart = this.getGridPosition(event);
      this.selectionEnd = this.selectionStart;
      
      const tile = this.getTileAt(event);
      if (tile) {
        console.log('🖱️ Tile clicked:', {
          tile: tile.id,
          ctrl: event.ctrlKey,
          shift: event.shiftKey,
          alt: event.altKey,
          currentSelection: this.selectedTileIds.length
        });

        if (event.ctrlKey || event.metaKey) {
          // Ctrl+Click: Toggle individual tile selection
          this.toggleTileSelection(tile);
        } else if (event.shiftKey && this.selectedTiles.length > 0) {
          // Shift+Click: Range selection from last selected tile
          const lastTile = this.selectedTiles[this.selectedTiles.length - 1];
          this.selectRange(lastTile, tile);
        } else if (event.altKey) {
          // Alt+Click: Add to selection without toggling
          this.addTileToSelection(tile);
        } else {
          // Normal Click: Single selection (clears others)
          this.selectSingleTile(tile);
        }
      } else {
        // Clicked empty area
        if (!event.ctrlKey && !event.metaKey && !event.shiftKey) {
          // Clear selection only if no modifier keys are held
          this.clearSelection();
        }
      }
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isPanning) {
      const deltaX = event.clientX - this.lastMousePos.x;
      const deltaY = event.clientY - this.lastMousePos.y;
      this.panOffset.x += deltaX;
      this.panOffset.y += deltaY;
      this.lastMousePos = { x: event.clientX, y: event.clientY };
      this.redraw();
    } else if (this.isSelecting && this.selectionStart) {
      this.selectionEnd = this.getGridPosition(event);
      this.redraw();
    } else {
      // Update hovered tile
      this.hoveredTile = this.getTileAt(event);
    }
  }

  onMouseUp(event: MouseEvent): void {
    if (this.isSelecting && this.selectionStart && this.selectionEnd) {
      // Only do area selection if we actually dragged (not just a click)
      const isDrag = this.selectionStart.x !== this.selectionEnd.x || this.selectionStart.y !== this.selectionEnd.y;

      console.log('🖱️ Mouse up:', {
        start: this.selectionStart,
        end: this.selectionEnd,
        isDrag,
        addToSelection: event.ctrlKey || event.metaKey
      });

      if (isDrag) {
        this.selectArea(this.selectionStart, this.selectionEnd, event.ctrlKey || event.metaKey);
      }
      // Single clicks are handled in onMouseDown
    }

    this.isSelecting = false;
    this.isPanning = false;
    this.selectionStart = null;
    this.selectionEnd = null;
    this.redraw();
  }

  onMouseLeave(event: MouseEvent): void {
    this.isSelecting = false;
    this.isPanning = false;
    this.hoveredTile = null;
    this.selectionStart = null;
    this.selectionEnd = null;
  }

  onKeyDown(event: KeyboardEvent): void {
    console.log('⌨️ Key pressed:', event.key, {
      ctrl: event.ctrlKey,
      shift: event.shiftKey,
      alt: event.altKey
    });

    switch (event.key.toLowerCase()) {
      case 'a':
        if (event.ctrlKey || event.metaKey) {
          // Ctrl+A: Select all tiles
          event.preventDefault();
          this.selectAllTiles();
        }
        break;

      case 'escape':
        // Escape: Clear selection
        event.preventDefault();
        this.clearSelection();
        break;

      case 'delete':
      case 'backspace':
        // Delete/Backspace: Could be used for tile operations
        event.preventDefault();
        console.log('🗑️ Delete key pressed with', this.selectedTiles.length, 'tiles selected');
        // You can add delete functionality here if needed
        break;
    }
  }

  private getTileAt(event: MouseEvent): TileInfo | null {
    if (!this.config) return null;

    const gridPos = this.getGridPosition(event);
    if (!gridPos) {
      console.log('❌ No grid position found for click');
      return null;
    }

    const tile = this.tiles.find(tile =>
      tile.gridX === gridPos.x && tile.gridY === gridPos.y
    );

    console.log('🔍 Tile lookup:', {
      gridPos: `${gridPos.x},${gridPos.y}`,
      foundTile: tile ? `${tile.id} (${tile.name || 'unnamed'})` : 'none',
      totalTiles: this.tiles.length
    });

    return tile || null;
  }

  private getGridPosition(event: MouseEvent): { x: number, y: number } | null {
    if (!this.config) return null;

    const rect = this.canvas.getBoundingClientRect();
    const canvasX = event.clientX - rect.left;
    const canvasY = event.clientY - rect.top;

    const scaledTileSize = this.config.tileWidth * this.zoomLevel;

    // Use the same positioning as in the drawing code, accounting for pan offset
    const offsetX = 10 + this.panOffset.x; // Start 10px from left edge + pan offset
    const offsetY = 10 + this.panOffset.y; // Start 10px from top + pan offset

    const gridX = Math.floor((canvasX - offsetX) / scaledTileSize);
    const gridY = Math.floor((canvasY - offsetY) / scaledTileSize);

    // Debug mouse clicks
    console.log('🖱️ Mouse click debug:', {
      canvasPos: `${canvasX},${canvasY}`,
      gridPos: `${gridX},${gridY}`,
      scaledTileSize: scaledTileSize,
      offset: `${offsetX},${offsetY}`,
      gridBounds: `${this.config.tilesPerRow}x${this.config.tilesPerColumn}`,
      inBounds: gridX >= 0 && gridX < this.config.tilesPerRow && gridY >= 0 && gridY < this.config.tilesPerColumn
    });

    if (gridX >= 0 && gridX < this.config.tilesPerRow && gridY >= 0 && gridY < this.config.tilesPerColumn) {
      return { x: gridX, y: gridY };
    }

    console.log('❌ Click outside grid bounds');
    return null;
  }

  private selectSingleTile(tile: TileInfo): void {
    this.selectionChanged.emit([tile.id]);
    this.updateSelectedTiles();
    this.tileSelected.emit(tile);
    this.redraw();
  }

  private addTileToSelection(tile: TileInfo): void {
    if (!this.selectedTileIds.includes(tile.id)) {
      const newSelection = [...this.selectedTileIds, tile.id];
      this.selectionChanged.emit(newSelection);
      this.updateSelectedTiles();
      this.tilesSelected.emit(this.selectedTiles);
      this.redraw();
    }
  }

  private clearSelection(): void {
    this.selectionChanged.emit([]);
    this.updateSelectedTiles();
    this.redraw();
  }

  private selectAllTiles(): void {
    const allTileIds = this.tiles.map(tile => tile.id);
    this.selectionChanged.emit(allTileIds);
    this.updateSelectedTiles();
    this.tilesSelected.emit(this.selectedTiles);
    this.redraw();
    console.log('✅ Selected all', allTileIds.length, 'tiles');
  }

  private toggleTileSelection(tile: TileInfo): void {
    const currentIds = [...this.selectedTileIds];
    const index = currentIds.indexOf(tile.id);
    
    if (index >= 0) {
      currentIds.splice(index, 1);
    } else {
      currentIds.push(tile.id);
    }
    
    this.selectionChanged.emit(currentIds);
    this.updateSelectedTiles();
    this.redraw();
  }

  private selectRange(startTile: TileInfo, endTile: TileInfo): void {
    const minX = Math.min(startTile.gridX, endTile.gridX);
    const maxX = Math.max(startTile.gridX, endTile.gridX);
    const minY = Math.min(startTile.gridY, endTile.gridY);
    const maxY = Math.max(startTile.gridY, endTile.gridY);

    console.log('📐 Range selection:', {
      from: `${startTile.gridX},${startTile.gridY}`,
      to: `${endTile.gridX},${endTile.gridY}`,
      area: `${minX}-${maxX}, ${minY}-${maxY}`,
      size: `${maxX - minX + 1}×${maxY - minY + 1}`
    });

    const rangeIds = this.tiles
      .filter(tile =>
        tile.gridX >= minX && tile.gridX <= maxX &&
        tile.gridY >= minY && tile.gridY <= maxY
      )
      .map(tile => tile.id);

    this.selectionChanged.emit(rangeIds);
    this.updateSelectedTiles();
    this.tilesSelected.emit(this.selectedTiles);
    this.redraw();
  }

  private selectArea(start: { x: number, y: number }, end: { x: number, y: number }, addToSelection: boolean): void {
    const minX = Math.min(start.x, end.x);
    const maxX = Math.max(start.x, end.x);
    const minY = Math.min(start.y, end.y);
    const maxY = Math.max(start.y, end.y);

    const areaIds = this.tiles
      .filter(tile => 
        tile.gridX >= minX && tile.gridX <= maxX &&
        tile.gridY >= minY && tile.gridY <= maxY
      )
      .map(tile => tile.id);

    let newSelection: string[];
    if (addToSelection) {
      const currentIds = new Set(this.selectedTileIds);
      areaIds.forEach(id => currentIds.add(id));
      newSelection = Array.from(currentIds);
    } else {
      newSelection = areaIds;
    }

    this.selectionChanged.emit(newSelection);
    this.updateSelectedTiles();
    this.tilesSelected.emit(this.selectedTiles);
  }

  private resizeCanvas(): void {
    if (!this.canvas || !this.containerRef) return;

    const container = this.containerRef.nativeElement;
    let width = container.clientWidth || 800;
    let height = container.clientHeight || 600;

    // If we have config, calculate minimum size needed for all tiles
    if (this.config) {
      const tileSize = this.config.tileWidth * this.zoomLevel;
      const minWidth = (this.config.tilesPerRow * tileSize) + 20; // 10px margin on each side
      const minHeight = (this.config.tilesPerColumn * tileSize) + 20; // 10px margin on each side

      width = Math.max(width, minWidth);
      height = Math.max(height, minHeight);

      console.log('📐 Canvas sizing:', {
        containerSize: `${container.clientWidth}x${container.clientHeight}`,
        calculatedSize: `${width}x${height}`,
        tileGrid: `${this.config.tilesPerRow}x${this.config.tilesPerColumn}`,
        tileSize
      });
    }

    console.log('📐 Container dimensions:', {
      clientWidth: container.clientWidth,
      clientHeight: container.clientHeight,
      offsetWidth: container.offsetWidth,
      offsetHeight: container.offsetHeight,
      scrollWidth: container.scrollWidth,
      scrollHeight: container.scrollHeight,
      computedStyle: {
        width: getComputedStyle(container).width,
        height: getComputedStyle(container).height,
        minHeight: getComputedStyle(container).minHeight
      }
    });

    // Only resize if dimensions actually changed
    if (this.canvas.width !== width || this.canvas.height !== height) {
      console.log('📐 Canvas resizing from', this.canvas.width, 'x', this.canvas.height, 'to', width, 'x', height);
      this.canvas.width = width;
      this.canvas.height = height;

      // Re-apply canvas settings after resize
      this.ctx.imageSmoothingEnabled = false;
    }
  }

  redraw(): void {
    if (!this.canvas || !this.ctx || !this.config) {
      console.log('❌ Redraw skipped - missing canvas, ctx, or config');
      return;
    }

    if (!this.spritesheet) {
      console.log('❌ Redraw skipped - spritesheet not loaded');
      return;
    }

    console.log('🎨 Redrawing canvas with', this.tiles.length, 'tiles');

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const scaledTileSize = this.config!.tileWidth * this.zoomLevel;

    // Optimized positioning with minimal margins
    const offsetX = 10; // Start 10px from left edge
    const offsetY = 10; // Start 10px from top

    console.log('📐 Tile positioning:', {
      scaledTileSize,
      offsetX,
      offsetY,
      canvasSize: `${this.canvas.width}x${this.canvas.height}`,
      gridSize: `${this.config!.tilesPerRow}x${this.config!.tilesPerColumn}`
    });

    // Draw tiles
    let tilesDrawn = 0;
    this.tiles.forEach(tile => {
      const x = offsetX + tile.gridX * scaledTileSize;
      const y = offsetY + tile.gridY * scaledTileSize;

      // Only draw tiles that are visible on screen
      if (x + scaledTileSize >= 0 && x < this.canvas.width &&
          y + scaledTileSize >= 0 && y < this.canvas.height) {

        // Draw tile image
        try {
          this.ctx.drawImage(
            this.spritesheet!,
            tile.pixelX, tile.pixelY, tile.width, tile.height,
            x, y, scaledTileSize, scaledTileSize
          );

          // Draw debug info for first few tiles
          if (tilesDrawn < 5) {
            console.log(`🎨 Drawing tile ${tilesDrawn}:`, {
              source: `${tile.pixelX},${tile.pixelY} ${tile.width}x${tile.height}`,
              dest: `${x},${y} ${scaledTileSize}x${scaledTileSize}`,
              spritesheet: `${this.spritesheet!.width}x${this.spritesheet!.height}`
            });
          }

          tilesDrawn++;
        } catch (error) {
          console.error('❌ Error drawing tile:', error, tile);
        }
      }

      // Draw selection highlight
      if (this.showSelection && this.selectedTileIds.includes(tile.id)) {
        this.ctx.fillStyle = 'rgba(33, 150, 243, 0.3)';
        this.ctx.fillRect(x, y, scaledTileSize, scaledTileSize);
        this.ctx.strokeStyle = '#2196f3';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, scaledTileSize, scaledTileSize);
      }

      // Draw labels
      if (this.showLabels && scaledTileSize > 32) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(x, y + scaledTileSize - 20, scaledTileSize, 20);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
          tile.name.length > 8 ? tile.name.substr(0, 8) + '...' : tile.name,
          x + scaledTileSize / 2,
          y + scaledTileSize - 6
        );
      }
    });

    // Draw grid
    if (this.showGrid) {
      this.drawGrid(offsetX, offsetY, scaledTileSize);
    }

    // Draw selection rectangle
    if (this.isSelecting && this.selectionStart && this.selectionEnd) {
      this.drawSelectionRectangle(offsetX, offsetY, scaledTileSize);
    }

    console.log('🎨 Redraw complete:', tilesDrawn, 'tiles drawn out of', this.tiles.length);
    console.log('📊 Canvas info:', {
      size: `${this.canvas.width}x${this.canvas.height}`,
      position: this.canvas.getBoundingClientRect(),
      visible: this.canvas.offsetParent !== null,
      zIndex: getComputedStyle(this.canvas).zIndex
    });
  }

  private drawGrid(offsetX: number, offsetY: number, tileSize: number): void {
    if (!this.config) return;

    this.ctx.strokeStyle = '#ccc';
    this.ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x <= this.config.tilesPerRow; x++) {
      const lineX = offsetX + x * tileSize;
      this.ctx.beginPath();
      this.ctx.moveTo(lineX, offsetY);
      this.ctx.lineTo(lineX, offsetY + this.config.tilesPerColumn * tileSize);
      this.ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= this.config.tilesPerColumn; y++) {
      const lineY = offsetY + y * tileSize;
      this.ctx.beginPath();
      this.ctx.moveTo(offsetX, lineY);
      this.ctx.lineTo(offsetX + this.config.tilesPerRow * tileSize, lineY);
      this.ctx.stroke();
    }
  }

  private drawSelectionRectangle(offsetX: number, offsetY: number, tileSize: number): void {
    if (!this.selectionStart || !this.selectionEnd) return;

    const startX = offsetX + this.selectionStart.x * tileSize;
    const startY = offsetY + this.selectionStart.y * tileSize;
    const endX = offsetX + this.selectionEnd.x * tileSize + tileSize;
    const endY = offsetY + this.selectionEnd.y * tileSize + tileSize;

    this.ctx.strokeStyle = '#2196f3';
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([5, 5]);
    this.ctx.strokeRect(
      Math.min(startX, endX),
      Math.min(startY, endY),
      Math.abs(endX - startX),
      Math.abs(endY - startY)
    );
    this.ctx.setLineDash([]);
  }

  getCanvasTransform(): string {
    return `translate(-50%, -50%)`;
  }
}
