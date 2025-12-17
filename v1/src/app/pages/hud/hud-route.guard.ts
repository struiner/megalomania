import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { HUD_OVERLAY_PANELS, HUD_PANEL_IDS, HudPanelDefinition } from './hud-panel-registry';

@Injectable({ providedIn: 'root' })
export class HudRouteGuard implements CanActivate {
  constructor(private readonly router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean | UrlTree {
    const panelId = route.params['panel'];

    if (typeof panelId !== 'string') {
      return this.router.createUrlTree(['/game/interface']);
    }

    if (!HUD_PANEL_IDS.has(panelId)) {
      // TODO: Decide whether to surface an inline HUD message/toast on blocked panels.
      return this.router.createUrlTree(['/game/interface']);
    }

    const descriptor = HUD_OVERLAY_PANELS.find((panel) => panel.id === panelId);

    return descriptor ? this.isPanelEnabled(descriptor) : this.router.createUrlTree(['/game/interface']);
  }

  private isPanelEnabled(panel: HudPanelDefinition): boolean | UrlTree {
    // TODO: Wire feature flag and initialization readiness predicates; currently always enabled for structural phase.
    if (panel.featureFlag || panel.requiresInit) {
      // Placeholder for future predicate evaluation; keeping deterministic allow-list for now.
    }

    return true;
  }
}
