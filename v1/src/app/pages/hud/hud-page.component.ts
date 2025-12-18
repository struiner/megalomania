import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { BottomHudComponent } from './components/bottom-hud.component';
import { HudOverlayShellComponent } from './components/hud-overlay-shell.component';
import { HudAction } from './components/hud-button-grid.component';
import { HudInfoPaneContent } from './components/hud-info-pane.component';
import { HUD_OVERLAY_PANELS, HudPanelDefinition } from './hud-panel-registry';
import {
  HudAvailabilityService,
  HudPanelBlockNotice,
  HudPanelGateDecision,
} from './hud-availability.service';
import { HudStandaloneDialogComponent } from './components/hud-standalone-dialog.component';

interface AuxiliaryDialogSpec {
  heading: string;
  subheading?: string;
  icon?: string;
  body: string;
  ctaLabel?: string;
  ctaRoute?: string[];
}

type AuxiliaryActionOwner = 'world-configuration' | 'reference-docs';

type AuxiliaryActionTarget =
  | { type: 'dialog'; owner: AuxiliaryActionOwner; dialog: AuxiliaryDialogSpec }
  | { type: 'route'; owner: AuxiliaryActionOwner; route: string[]; dialogFallback?: AuxiliaryDialogSpec };

@Component({
  selector: 'app-hud-page',
  standalone: true,
  imports: [CommonModule, BottomHudComponent, HudOverlayShellComponent, HudStandaloneDialogComponent],
  templateUrl: './hud-page.component.html',
  styleUrls: ['./hud-page.component.scss'],
})
export class HudPageComponent implements OnInit, OnDestroy {
  protected actions: HudAction[] = [
    { id: 'inventory', label: 'Inventory', icon: '📦' },
    { id: 'ledger', label: 'Ledger', icon: '📜' },
    { id: 'map', label: 'Maps', icon: '🗺️' },
    { id: 'crew', label: 'Crew', icon: '👥' },
    { id: 'trade', label: 'Trade', icon: '⚖️' },
    { id: 'quests', label: 'Quests', icon: '⭐' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'help', label: 'Help', icon: '❔' },
  ];

  protected overlayPanels: HudPanelDefinition[] = HUD_OVERLAY_PANELS;

  private readonly auxiliaryTargets: Record<string, AuxiliaryActionTarget> = {
    settings: {
      owner: 'world-configuration',
      type: 'route',
      route: ['/world/generation'],
      dialogFallback: {
        heading: 'World configuration owns settings',
        subheading: 'HUD only routes into the config workspace',
        icon: '⚙️',
        body:
          'Settings live in the world configuration workspace; HUD merely launches that surface. Retry navigation or open the workspace directly when route guards are active.',
        ctaLabel: 'Open world configuration',
        ctaRoute: ['/world/generation'],
      },
    },
    help: {
      owner: 'reference-docs',
      type: 'dialog',
      dialog: {
        heading: 'HUD help is owned by reference docs',
        subheading: 'Shortcut primer + deep link',
        icon: '❔',
        body:
          'HUD shows the short-form primer only. Full control listings, chords, and tutorial hooks live in the design/reference documentation domain.',
        ctaLabel: 'Open design doc',
        ctaRoute: ['/game/design-doc'],
      },
    },
  };

  protected leftPane: HudInfoPaneContent = {
    heading: 'Status',
    subtitle: 'Ship + crew health',
    icon: '⚓',
    items: ['Calm seas', 'Stores steady', 'Ledger balanced'],
  };

  protected rightPane: HudInfoPaneContent = {
    heading: 'Notifications',
    subtitle: 'Operational signals',
    icon: '🔔',
    badge: '0',
    items: ['No active advisories', 'Next report: TBD'],
  };

  protected activePanel: string | null = null;
  protected blockedPanelMessage: string | null = null;
  protected auxiliaryDialog: AuxiliaryDialogSpec | null = null;
  protected blockNotice: HudPanelBlockNotice | null = null;

  private subscriptions = new Subscription();

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly availability: HudAvailabilityService,
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.params
        .pipe(map((params: Params) => params['panel'] ?? null))
        .subscribe((panel) => {
          this.activePanel = panel;
          this.blockedPanelMessage = null;
        }),
    );

    this.subscriptions.add(
      this.availability.getBlockedPanels().subscribe((block) => {
        this.setBlockedPanel(block);
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  protected handleActionSelected(actionId: string): void {
    this.blockedPanelMessage = null;
    this.closeAuxiliaryDialog();

    const panelExists = this.overlayPanels.some((panel) => panel.id === actionId);

    if (panelExists) {
      const descriptor = this.overlayPanels.find((panel) => panel.id === actionId)!;
      const gate = this.availability.evaluatePanel(descriptor);

      if (!gate.allowed) {
        this.handlePanelBlocked(gate, descriptor.id);
        return;
      }

      if (this.activePanel === actionId) {
        this.closeOverlay();
        return;
      }

      void this.router.navigate(['/game/interface', actionId]);
      return;
    }

    this.handleAuxiliaryAction(actionId);
  }

  protected closeOverlay(): void {
    void this.router.navigate(['/game/interface']);
  }

  protected handlePanelBlocked(decision: HudPanelGateDecision, panelId?: string): void {
    const descriptor = panelId ? this.overlayPanels.find((panel) => panel.id === panelId) : undefined;
    const block: HudPanelBlockNotice = {
      panelId: panelId ?? 'hud-panel',
      panelLabel: descriptor?.label ?? 'HUD panel',
      decision,
    };

    this.setBlockedPanel(block);
    if (descriptor) {
      this.availability.announceBlockedPanel(descriptor, decision);
    }
  }

  protected closeAuxiliaryDialog(): void {
    this.auxiliaryDialog = null;
  }

  protected clearBlockedNotice(): void {
    this.blockNotice = null;
  }

  protected triggerAuxiliaryCta(): void {
    if (this.auxiliaryDialog?.ctaRoute) {
      this.navigateToRoute(this.auxiliaryDialog.ctaRoute);
      this.closeAuxiliaryDialog();
    }
  }

  private handleAuxiliaryAction(actionId: string): void {
    const target = this.auxiliaryTargets[actionId];

    if (!target) {
      this.auxiliaryDialog = {
        heading: this.actions.find((action) => action.id === actionId)?.label ?? 'HUD action',
        subheading: 'Unmapped HUD action',
        icon: this.actions.find((action) => action.id === actionId)?.icon,
        body: 'No auxiliary routing is registered for this HUD action. Define its owning domain and destination before wiring.',
      };
      return;
    }

    if (target.type === 'route') {
      this.navigateToRoute(target.route, target.dialogFallback);
      return;
    }

    this.auxiliaryDialog = target.dialog;
  }

  private navigateToRoute(route: string[], fallbackDialog?: AuxiliaryDialogSpec): void {
    void this.router.navigate(route).then(
      (navigated) => {
        if (!navigated && fallbackDialog) {
          this.auxiliaryDialog = fallbackDialog;
        }
      },
      () => {
        if (fallbackDialog) {
          this.auxiliaryDialog = fallbackDialog;
        }
      },
    );
  }

  private setBlockedPanel(block: HudPanelBlockNotice): void {
    this.blockNotice = block;
    this.blockedPanelMessage = block.decision.reason ?? 'Selected panel is unavailable.';
  }
}
