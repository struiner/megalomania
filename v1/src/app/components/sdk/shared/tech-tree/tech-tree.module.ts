import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { TechNodeComponent } from './tech-node.component';
import { TechTreeCanvasComponent } from './tech-tree-canvas.component';
import { TechTreePreviewDialogComponent } from './tech-tree-preview-dialog.component';
import { VirtualScrollComponent } from './virtual-scroll.component';
import { ConnectionOverlayComponent } from './connection-overlay.component';
import { PerformanceMonitorComponent } from './performance-monitor.component';

@NgModule({
  declarations: [
    TechNodeComponent,
    TechTreeCanvasComponent,
    TechTreePreviewDialogComponent,
    VirtualScrollComponent,
    ConnectionOverlayComponent,
    PerformanceMonitorComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule
  ],
  exports: [
    TechNodeComponent,
    TechTreeCanvasComponent,
    TechTreePreviewDialogComponent,
    VirtualScrollComponent,
    ConnectionOverlayComponent,
    PerformanceMonitorComponent
  ]
})
export class TechTreeModule { }