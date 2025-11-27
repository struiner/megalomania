// src/app/menu-hotkeys.service.ts
import { Injectable, OnDestroy } from '@angular/core';
import { MenuService } from './menu.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MenuItem } from '../../models/menu.model';

@Injectable({ providedIn: 'root' })
export class MenuHotkeysService implements OnDestroy {
  private keymap = new Map<string, MenuItem>();
  private subs = new Subscription();

  constructor(
    private menuService: MenuService,
    private router: Router
  ) {
    this.subs.add(
      this.menuService.getMenu().subscribe(menu => {
        this.keymap.clear();
        this.buildKeyMap(menu);
      })
    );

    document.addEventListener('keydown', this.handleKey);
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.handleKey);
    this.subs.unsubscribe();
  }

  private buildKeyMap(items: MenuItem[]) {
    for (const item of items) {
      if (item.keybind) {
        this.keymap.set(item.keybind.toLowerCase(), item);
      }
      if (item.children?.length) {
        this.buildKeyMap(item.children);
      }
    }
  }

  private handleKey = (e: KeyboardEvent) => {
    if (!e.altKey) return;
    const key = e.key.toLowerCase();
    const item = this.keymap.get(key);
    if (!item) return;

    this.trigger(item);
    e.preventDefault();
    e.stopPropagation();
  };

  private trigger(item: MenuItem) {
    this.menuService.triggerMenuItem(item);
  }
}
