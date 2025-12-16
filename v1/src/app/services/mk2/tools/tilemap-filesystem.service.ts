import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TilemapFilesystemService {
  async initializeTilemapFolders(): Promise<void> {
    return Promise.resolve();
  }
}
