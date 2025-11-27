import { Injectable } from '@angular/core';
import { DirectoryAccessService } from '../shared/directory-access.service';
import { GameStateData } from './world-data.service';

@Injectable({ providedIn: 'root' })
export class GameStateFileSystemService {

  constructor(private directoryAccessService: DirectoryAccessService) {}

  async initializeDirectory(): Promise<void> {
    // Directory access is now handled centrally, no initialization needed
  }

  private async ensureStateFolder(): Promise<FileSystemDirectoryHandle> {
    const directoryHandle = this.directoryAccessService.getDirectoryHandle();
    if (!directoryHandle) {
      throw new Error('No directory access. Please grant directory access first.');
    }
    return await directoryHandle.getDirectoryHandle('state', { create: true });
  }

  private getStateFilename(chunkId: string): string {
    return `state_${chunkId}.json`;
  }

  async saveGameState(chunkId: string, state: GameStateData): Promise<void> {
    const folder = await this.ensureStateFolder();
    const filename = this.getStateFilename(chunkId);
    const fileHandle = await folder.getFileHandle(filename, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(state));
    await writable.close();
  }

  async loadGameState(chunkId: string): Promise<GameStateData | undefined> {
    const folder = await this.ensureStateFolder();
    const filename = this.getStateFilename(chunkId);
    try {
      const fileHandle = await folder.getFileHandle(filename);
      const file = await fileHandle.getFile();
      const text = await file.text();
      return JSON.parse(text) as GameStateData;
    } catch (err) {
      console.warn(`No game state found for chunk ${chunkId}`);
      return undefined;
    }
  }

  async hasGameState(chunkId: string): Promise<boolean> {
    const folder = await this.ensureStateFolder();
    const filename = this.getStateFilename(chunkId);
    try {
      await folder.getFileHandle(filename);
      return true;
    } catch {
      return false;
    }
  }
}
