import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TileInfo, TilemapProject } from '../../../services/mk2/tools/tilemap-analysis.service';

@Injectable({ providedIn: 'root' })
export class TilePropertiesEditorFacade {
  editForm$ = new BehaviorSubject<Partial<TileInfo>>({});
  hasChanges$ = new BehaviorSubject<boolean>(false);
  originalForm: Partial<TileInfo> = {};

  setEditForm(form: Partial<TileInfo>) {
    this.editForm$.next(form);
    this.originalForm = { ...form };
    this.hasChanges$.next(false);
  }

  markChanged() {
    this.hasChanges$.next(true);
  }

  resetChanges() {
    this.editForm$.next({ ...this.originalForm });
    this.hasChanges$.next(false);
  }

  // Add more state and logic methods as needed
}
