import { Routes } from '@angular/router';
import { menuToRoutes } from './services/menu/menu-routes';

const generated = menuToRoutes();

export const routes: Routes = [
  ...generated,
  { path: '', pathMatch: 'full', redirectTo: generated[0]?.path ?? '' },
  { path: '**', redirectTo: generated[0]?.path ?? '' },
];
