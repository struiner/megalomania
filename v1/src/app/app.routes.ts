import { Routes } from '@angular/router';
import { menuToRoutes } from './services/menu/menu-routes';
import { HudPageComponent } from './pages/hud/hud-page.component';

const generated = menuToRoutes();

export const routes: Routes = [
  ...generated,
  { path: 'game/interface/:panel', component: HudPageComponent },
  { path: '', pathMatch: 'full', redirectTo: generated[0]?.path ?? '' },
  { path: '**', redirectTo: generated[0]?.path ?? '' },
];
