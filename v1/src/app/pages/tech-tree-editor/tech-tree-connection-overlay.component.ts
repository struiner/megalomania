import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PrerequisiteOverlayEdge, PrerequisiteOverlayNode } from './tech-tree-editor.types';

interface OverlayPath {
  id: string;
  d: string;
  dashed: boolean;
  highlighted: boolean;
  to: { x: number; y: number };
}

@Component({
  selector: 'app-tech-tree-connection-overlay',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      *ngIf="paths.length"
      class="connection-canvas"
      [attr.width]="width"
      [attr.height]="height"
      [attr.viewBox]="'0 0 ' + width + ' ' + height"
      shape-rendering="crispEdges"
    >
      <g *ngFor="let path of paths">
        <path
          class="connection-path"
          [attr.d]="path.d"
          [class.active]="path.highlighted"
          [attr.stroke-dasharray]="path.dashed ? '8 6' : undefined"
        ></path>
        <circle class="connection-node" [attr.cx]="path.to.x" [attr.cy]="path.to.y" r="3"></circle>
      </g>
    </svg>
  `,
  styles: [`
    :host {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .connection-canvas {
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    .connection-path {
      fill: none;
      stroke: var(--ds-color-accent-ice-400);
      stroke-width: 2;
      stroke-linejoin: round;
      stroke-linecap: round;
      transition: stroke 120ms ease, stroke-width 120ms ease;
    }

    .connection-path.active {
      stroke: var(--ds-color-accent-amber-400);
      stroke-width: 2.5;
    }

    .connection-node {
      fill: var(--ds-color-accent-amber-400);
      stroke: var(--ds-color-border-strong);
      stroke-width: 1;
    }
  `],
})
export class TechTreeConnectionOverlayComponent {
  @Input() nodes: PrerequisiteOverlayNode[] = [];
  @Input() edges: PrerequisiteOverlayEdge[] = [];
  @Input() columns = 1;
  @Input() selectedId: string | null = null;

  private readonly columnWidth = 220;
  private readonly rowHeight = 96;
  private readonly paddingX = 24;
  private readonly paddingY = 24;

  get paths(): OverlayPath[] {
    const positions = new Map<string, { x: number; y: number }>();
    this.nodes.forEach((node) => positions.set(node.id, this.toPoint(node)));

    const paths: OverlayPath[] = this.edges
      .map((edge) => {
        const from = positions.get(edge.from.id);
        const to = positions.get(edge.to.id);
        if (!from || !to) return undefined;

        return {
          id: `${edge.from.id}-${edge.to.id}`,
          d: this.buildPath(from, to),
          dashed: edge.relation !== 'requires',
          highlighted: this.isHighlighted(edge),
          to,
        };
      })
      .filter((value): value is OverlayPath => Boolean(value))
      .sort((left, right) => left.id.localeCompare(right.id));

    return paths;
  }

  get width(): number {
    return Math.max(1, this.columns) * this.columnWidth + this.paddingX * 2;
  }

  get height(): number {
    const maxRow = this.nodes.reduce((max, node) => Math.max(max, node.row), 0);
    return (maxRow + 1) * this.rowHeight + this.paddingY * 2;
  }

  private toPoint(node: PrerequisiteOverlayNode): { x: number; y: number } {
    const x = this.paddingX + node.column * this.columnWidth + this.columnWidth / 2;
    const y = this.paddingY + node.row * this.rowHeight + this.rowHeight / 2;
    return { x, y };
  }

  private buildPath(from: { x: number; y: number }, to: { x: number; y: number }): string {
    const midX = Math.round((from.x + to.x) / 2);
    return [
      `M ${Math.round(from.x)} ${Math.round(from.y)}`,
      `L ${midX} ${Math.round(from.y)}`,
      `L ${midX} ${Math.round(to.y)}`,
      `L ${Math.round(to.x)} ${Math.round(to.y)}`,
    ].join(' ');
  }

  private isHighlighted(edge: PrerequisiteOverlayEdge): boolean {
    return Boolean(this.selectedId && (edge.to.id === this.selectedId || edge.from.id === this.selectedId));
  }
}
