import { Routes } from '@angular/router';
import { menuToRoutes } from './services/menu/menu-routes';
import { HudPageComponent } from './pages/hud/hud-page.component';
import { HudRouteGuard } from './pages/hud/hud-route.guard';
import { SdkToolPageComponent } from './pages/sdk/sdk-tool-page.component';
import { TechTreeEditorComponent } from './pages/tech-tree-editor/tech-tree-editor.component';

const techTreeRoute = {
  path: 'sdk/tech-tree',
  component: SdkToolPageComponent,
  data: {
    sdkComponent: TechTreeEditorComponent,
    title: 'Tech Tree Editor',
    description: 'Routed shell for tree overview, node detail, and prerequisite visualization.',
  },
};
const generated = menuToRoutes();

export const routes: Routes = [
  techTreeRoute,
  ...generated.filter((route) => route.path !== techTreeRoute.path),
  { path: 'game/interface/:panel', component: HudPageComponent, canActivate: [HudRouteGuard] },
  { path: '', pathMatch: 'full', redirectTo: generated[0]?.path ?? '' },
  { path: '**', redirectTo: generated[0]?.path ?? '' },
];
