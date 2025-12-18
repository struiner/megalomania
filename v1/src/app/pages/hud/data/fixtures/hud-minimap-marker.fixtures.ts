import { MapStructureType } from '../../../../enums/MapStructureType';
import { NatureFeatureType } from '../../../../enums/NaturalFeatureType';
import { SettlementType } from '../../../../enums/SettlementType';
import { HudMinimapMarker } from '../../hud-minimap-data.service';

export type HudMinimapMarkerFixtureCategory = 'settlement' | 'structure' | 'feature';

export interface HudMinimapMarkerFixture extends HudMinimapMarker {
  id: string;
  priority: number;
  category: HudMinimapMarkerFixtureCategory;
  source:
    | { type: 'settlement'; settlement: SettlementType }
    | { type: 'structure'; structure: MapStructureType }
    | { type: 'feature'; feature: NatureFeatureType };
}

export const HUD_MINIMAP_MARKER_FIXTURES: HudMinimapMarkerFixture[] = [
  {
    id: 'capital_harbor_fixture',
    label: 'Capital harbor (fixture)',
    glyph: '✶',
    x: 0.52,
    y: 0.58,
    priority: 1,
    category: 'settlement',
    source: { type: 'settlement', settlement: SettlementType.Capital },
  },
  {
    id: 'trade_pier_fixture',
    label: 'Guild pier (fixture)',
    glyph: '⚓',
    x: 0.38,
    y: 0.68,
    priority: 2,
    category: 'settlement',
    source: { type: 'settlement', settlement: SettlementType.TradeHub },
  },
  {
    id: 'lighthouse_fixture',
    label: 'Lighthouse approach (fixture)',
    glyph: '▲',
    x: 0.86,
    y: 0.32,
    priority: 3,
    category: 'settlement',
    source: { type: 'settlement', settlement: SettlementType.Lighthouse },
  },
  {
    id: 'grove_fixture',
    label: 'Grove reserve (fixture)',
    glyph: '◆',
    x: 0.18,
    y: 0.24,
    priority: 4,
    category: 'feature',
    source: { type: 'feature', feature: NatureFeatureType.ANCIENT_GROVE },
  },
  {
    id: 'ridge_pass_fixture',
    label: 'High ridge pass (fixture)',
    glyph: '△',
    x: 0.62,
    y: 0.18,
    priority: 5,
    category: 'feature',
    source: { type: 'feature', feature: NatureFeatureType.MOUNTAIN_PASS },
  },
  {
    id: 'watch_post_fixture',
    label: 'Watch post (fixture)',
    glyph: '✧',
    x: 0.27,
    y: 0.52,
    priority: 6,
    category: 'structure',
    source: { type: 'structure', structure: MapStructureType.MILITARY_OUTPOST },
  },
];
