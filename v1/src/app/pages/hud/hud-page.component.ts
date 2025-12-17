import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { BottomHudComponent } from './components/bottom-hud.component';
import { HudOverlayShellComponent } from './components/hud-overlay-shell.component';
import { HudAction } from './components/hud-button-grid.component';
import { HudInfoPaneContent } from './components/hud-info-pane.component';
import { HUD_OVERLAY_PANELS, HudPanelDefinition } from './hud-panel-registry';

@Component({
  selector: 'app-hud-page',
  standalone: true,
  imports: [CommonModule, BottomHudComponent, HudOverlayShellComponent],
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

  private subscription?: Subscription;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.subscription = this.route.params
      .pipe(map((params: Params) => params['panel'] ?? null))
      .subscribe((panel) => (this.activePanel = panel));
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  protected handleActionSelected(actionId: string): void {
    const panelExists = this.overlayPanels.some((panel) => panel.id === actionId);

    if (panelExists) {
      void this.router.navigate(['/game/interface', actionId]);
      return;
    }

    // TODO: Confirm whether non-panel actions should open standalone dialogs or route elsewhere.
  }

  protected closeOverlay(): void {
    void this.router.navigate(['/game/interface']);
  }
}
