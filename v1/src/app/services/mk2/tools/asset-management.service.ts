import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AssetManagementService {
  async initializeAssetFolders(): Promise<void> {
    return Promise.resolve();
  }
}
