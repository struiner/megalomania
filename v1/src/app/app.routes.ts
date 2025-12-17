import { Routes } from '@angular/router';
import { menuToRoutes } from './services/menu/menu-routes';
import { HudPageComponent } from './pages/hud/hud-page.component';
import { HudRouteGuard } from './pages/hud/hud-route.guard';

const generated = menuToRoutes();

export const routes: Routes = [
  ...generated,
  { path: 'game/interface/:panel', component: HudPageComponent, canActivate: [HudRouteGuard] },
  { path: '', pathMatch: 'full', redirectTo: generated[0]?.path ?? '' },
  { path: '**', redirectTo: generated[0]?.path ?? '' },
];
