import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MenuItem } from '../../models/menu.model';
import { MenuService } from '../../services/menu/menu.service';

@Component({
  selector: 'app-toolbar-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toolbar-menu.component.html',
  styleUrls: ['./toolbar-menu.component.scss']
})
export class ToolbarMenuComponent implements OnInit, OnDestroy {
  @Input() items: MenuItem[] = [];
  @Input() path: string = ''; // parent path, e.g. '/File'
  checkboxMap = new Map<string, boolean>();
  private sub = new Subscription();

  constructor(private menuService: MenuService, private router: Router) {}

  ngOnInit() {
    this.sub.add(
      this.menuService.getCheckboxStates().subscribe(m => {
        this.checkboxMap = m;
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  itemKey(item: MenuItem): string {
    // Build a stable key for this item, based on parent path + title
    const base = this.path ? this.path.replace(/\/+$/, '') : '';
    return (base ? base + '/' : '') + item.title;
  }

  isChecked(item: MenuItem): boolean {
    return this.checkboxMap.get(this.itemKey(item)) ?? false;
  }

  handleClick(item: MenuItem) {
    const key = this.itemKey(item);
    if ((item.type ?? 'route') === 'route' && item.route) {
      // navigate relative to root; adjust if you want relative navigation
      this.router.navigate([item.route]);
    } else if (item.type === 'button') {
      // open dialog or emit event — placeholder
      console.log('button action:', item.title);
    } else if (item.type === 'checkbox') {
      this.menuService.toggleCheckbox(key);
    }
  }

  handleEnter(event: any) {
    const el = event.currentTarget as HTMLElement;
    el.click();
  }

  renderTitleWithKeybind(item: MenuItem): string {
    if (!item.keybind) return escapeHtml(item.title);
    const key = item.keybind;
    // find first occurrence (case-insensitive) and underline it
    const idx = item.title.toLowerCase().indexOf(key.toLowerCase());
    if (idx === -1) return escapeHtml(item.title);
    const before = escapeHtml(item.title.slice(0, idx));
    const char = escapeHtml(item.title[idx]);
    const after = escapeHtml(item.title.slice(idx + 1));
    return `${before}<u>${char}</u>${after}`;
  }
}

/** small helper to escape HTML so innerHTML is safe for titles */
function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
