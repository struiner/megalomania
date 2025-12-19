import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { 
  getIconDefinition, 
  getIconSpriteUrl, 
  getIconCoordinates, 
  getFallbackGlyph 
} from '../assets/icons/hud-icon-manifest';

type HudIconSize = '1x' | '2x';

@Component({
  selector: 'app-hud-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hud-icon.component.html',
  styleUrls: ['./hud-icon.component.scss'],
})
export class HudIconComponent {
  @Input({ required: true })
  iconId!: string; // Changed from 'glyph' to 'iconId' for sprite sheet lookup

  @Input()
  label?: string;

  @Input()
  size: HudIconSize = '1x';

  @Input()
  framed = true;

  @Input()
  forceEmoji = false; // For development/testing fallback

  protected get pixelSize(): number {
    return this.size === '2x' ? 32 : 16;
  }

  /**
   * Get the icon definition from the manifest
   */
  protected get iconDefinition() {
    return getIconDefinition(this.iconId);
  }

  /**
   * Get sprite sheet URL for current size
   */
  protected get spriteUrl(): string {
    if (this.forceEmoji || !this.iconDefinition) {
      return '';
    }
    const sizeKey = this.size === '2x' ? '32' : '16';
    return getIconSpriteUrl(this.iconId, sizeKey);
  }

  /**
   * Get sprite coordinates for positioning
   */
  protected get spriteCoordinates(): { x: number; y: number } | null {
    if (this.forceEmoji || !this.iconDefinition) {
      return null;
    }
    return getIconCoordinates(this.iconId);
  }

  /**
   * Get fallback emoji glyph
   */
  protected get fallbackGlyph(): string {
    const fallback = getFallbackGlyph(this.iconId);
    return fallback || (this.iconId ? this.iconId.charAt(0).toUpperCase() : '□');
  }

  /**
   * Check if sprite sheet rendering should be used
   */
  protected get useSprite(): boolean {
    return !this.forceEmoji && !!this.iconDefinition && !!this.spriteUrl;
  }

  /**
   * Generate CSS background position for sprite
   */
  protected get backgroundPosition(): string {
    const coords = this.spriteCoordinates;
    if (!coords) return '0 0';
    return `-${coords.x}px -${coords.y}px`;
  }
}
