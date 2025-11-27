import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarMenuComponent } from './toolbar-menu.component';
import { MenuItem } from '../../models/menu.model';
import { MenuService } from '../../services/menu/menu.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, ToolbarMenuComponent],
  template: `
    <nav class="toolbar" role="menubar" aria-label="Main toolbar">
      <ul class="menu-root">
        <app-toolbar-menu [items]="menu"></app-toolbar-menu>
      </ul>
    </nav>
  `,
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  menu: MenuItem[] = [];

  constructor(private menuService: MenuService) {}

  ngOnInit() {
   // this.menu = this.menuService.getMenu()
    this.menuService.getMenu().subscribe({
      next: (data: MenuItem[]) => (this.menu = data),
      error: (err: any )=> {
        console.error('Failed loading menu.json', err);
        this.menu = [];
      }
    });
  }
}
