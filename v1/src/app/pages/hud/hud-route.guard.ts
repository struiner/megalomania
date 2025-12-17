import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { HUD_OVERLAY_PANELS, HUD_PANEL_IDS, HudPanelDefinition } from './hud-panel-registry';
import { HudAvailabilityService } from './hud-availability.service';

@Injectable({ providedIn: 'root' })
export class HudRouteGuard implements CanActivate {
  constructor(private readonly router: Router, private readonly availability: HudAvailabilityService) {}

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
    const decision = this.availability.evaluatePanel(panel);

    if (decision.allowed) {
      return true;
    }

    // TODO: Pipe block reason into HUD-level messaging instead of silent redirects.
    return this.router.createUrlTree(['/game/interface'], {
      queryParams: {
        blockedPanel: panel.id,
        reason: decision.reason,
      },
    });
  }
}
