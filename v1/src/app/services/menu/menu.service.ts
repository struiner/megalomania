// menu.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { MenuItem } from '../../models/menu.model';
import { MENU } from '../../data/menu.data';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private checkboxStates = new Map<string, boolean>();
  private checkboxState$ = new BehaviorSubject(this.checkboxStates);

  constructor(private router: Router) {}

  getMenu(): Observable<MenuItem[]> {
    return of(MENU);
  }

  getCheckboxStates() {
    return this.checkboxState$.asObservable();
  }

  toggleCheckbox(key: string) {
    const v = this.checkboxStates.get(key) ?? false;
    this.checkboxStates.set(key, !v);
    this.checkboxState$.next(this.checkboxStates);
  }

  getCheckboxState(key: string) {
    return this.checkboxStates.get(key) ?? false;
  }

  /** MAIN dispatcher used by UI and hotkeys */
  triggerMenuItem(item: MenuItem, key?: string) {
    const kind = item.type ?? 'route';

    switch (kind) {
      case 'route':
        if (item.route) {
          this.router.navigate([item.route]);
        }
        break;

      case 'button':
        console.log(`Button action: ${item.title}`);
        // if dialogs needed, emit/subject/etc. here
        break;

      case 'checkbox':
        if (!key) {
          key = item.title; // fallback
        }
        this.toggleCheckbox(key!);
        break;
    }
  }
}
