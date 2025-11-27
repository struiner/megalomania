// src/app/menu-routes.ts
import { Routes } from '@angular/router';
import { MenuItem } from '../../models/menu.model';
import { MENU } from '../../data/menu.data';

export function menuToRoutes(items: MenuItem[] = MENU): Routes {
  const routes: Routes = [];

  function recurse(menu: MenuItem[]) {
    for (const item of menu) {
      if (item.route && item.component) {
        routes.push({
          path: item.route,
          component: item.component
        });
      }
      if (item.children) recurse(item.children);
    }
  }

  recurse(items);
  return routes;
}
