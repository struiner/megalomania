// src/app/menu.model.ts
import { Type } from '@angular/core';

export type MenuItemType = 'route' | 'button' | 'checkbox';

export interface MenuItem {
  title: string;
  route?: string;           // required if type === 'route'
  component?: Type<any>;    // optional, for route
  type?: MenuItemType;      // default 'route'
  icon?: string;
  children?: MenuItem[];
  keybind?: string;         // e.g., 'A' for Alt+A
}
