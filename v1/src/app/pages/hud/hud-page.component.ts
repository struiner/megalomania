import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { BottomHudComponent } from './components/bottom-hud.component';
import { HudOverlayShellComponent } from './components/hud-overlay-shell.component';
import { HudAction } from './components/hud-button-grid.component';
import { HudInfoPaneContent } from './components/hud-info-pane.component';
import { HUD_OVERLAY_PANELS, HudPanelDefinition } from './hud-panel-registry';
import { HudAvailabilityService, HudPanelGateDecision } from './hud-availability.service';
import { HudStandaloneDialogComponent } from './components/hud-standalone-dialog.component';

interface AuxiliaryDialogSpec {
  heading: string;
  subheading?: string;
  icon?: string;
  body: string;
}

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

  private subscription?: Subscription;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly availability: HudAvailabilityService,
  ) {}

  ngOnInit(): void {
    this.subscription = this.route.params
      .pipe(map((params: Params) => params['panel'] ?? null))
      .subscribe((panel) => {
        this.activePanel = panel;
        this.blockedPanelMessage = null;
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  protected handleActionSelected(actionId: string): void {
    this.blockedPanelMessage = null;
    this.closeAuxiliaryDialog();

    const panelExists = this.overlayPanels.some((panel) => panel.id === actionId);

    if (panelExists) {
      const descriptor = this.overlayPanels.find((panel) => panel.id === actionId)!;
      const gate = this.availability.evaluatePanel(descriptor);

      if (!gate.allowed) {
        this.handlePanelBlocked(gate);
        return;
      }

      if (this.activePanel === actionId) {
        this.closeOverlay();
        return;
      }

      void this.router.navigate(['/game/interface', actionId]);
      return;
    }

    this.auxiliaryDialog = {
      heading: this.actions.find((action) => action.id === actionId)?.label ?? 'HUD action',
      subheading: 'Placeholder dialog until routing target is confirmed.',
      icon: this.actions.find((action) => action.id === actionId)?.icon,
      body: 'TODO: Confirm non-overlay HUD destinations (settings, help, etc.).',
    };
  }

  protected closeOverlay(): void {
    void this.router.navigate(['/game/interface']);
  }

  protected handlePanelBlocked(decision: HudPanelGateDecision): void {
    // TODO: Replace with HUD-native toast/breadcrumb once interaction model is approved.
    this.blockedPanelMessage = decision.reason ?? 'Selected panel is unavailable.';
  }

  protected closeAuxiliaryDialog(): void {
    this.auxiliaryDialog = null;
  }
}
