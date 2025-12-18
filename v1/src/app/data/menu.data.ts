import { MenuItem } from '../models/menu.model';
import { CityWrapperComponent } from '../pages/city/city-wrapper.component';
import { GoodsOverviewComponent } from '../pages/config/econ/goods-overview.component';
import { WorldGenerationComponent } from '../pages/config/gen/world-generation.component';
import { DesignDocumentComponent } from '../pages/design/design-document.component';
import { KirbyComponent } from '../pages/kirby/kirby.component';
import { BiomeOverviewComponent } from '../pages/biomes/biome-overview.component';
import { GoodsManagerPageComponent } from '../pages/sdk/goods-manager/goods-manager-page.component';
import { RoomCreatorComponent } from '../components/sdk/room-creator/room-creator.component';
import { SettlementManagerComponent } from '../components/sdk/settlement-manager/settlement-manager.component';
import { StructureCreatorComponent } from '../components/sdk/structure-creator/structure-creator.component';
import { StructuremanagerComponent } from '../components/sdk/structuremanager/structuremanager.component';
import { WorldRenderComponent } from '../pages/world/world-render.component';
import { HudPageComponent } from '../pages/hud/hud-page.component';
import { TechTreeEditorComponent } from '../pages/tech-tree-editor/tech-tree-editor.component';

export const MENU: MenuItem[] = [
    {
        title: 'Game',
        children:[{
            title:'User Interface',
            type: 'route',
            route:'game/interface',
            component: HudPageComponent,
        },
        {
            title: 'Design Doc',
            type: 'route',
            route: 'game/design-doc',
            component: DesignDocumentComponent,
        }]
    },
  {
    title: 'World',
    children: [
      {
        title: 'Render',
        type: 'route',
        route: 'world/render',
            keybind: 'v',
        component: WorldRenderComponent,
      },
      {
        title: 'Generation',
        type: 'route',
        route: 'world/generation',
            keybind: 'w',
        component: WorldGenerationComponent,
      },
      {
        title: 'Planes',
        type: 'route',
        route: 'world/planes',
            keybind: 'p',
        component: KirbyComponent,
      },
      {
        title: 'Biomes',
        children: [
          {
            title: 'Overview',
            type: 'route',
            keybind: 'b',
            route: 'biomes/overview',
            component: BiomeOverviewComponent,
          },
          {
            title: 'Flora',
            type: 'route',
            route: 'biomes/flora',
            component: KirbyComponent,
          },
          {
            title: 'Fauna',
            type: 'route',
            route: 'biomes/fauna',
            component: KirbyComponent,
          },
          {
            title: 'Features',
            type: 'route',
            route: 'biomes/features',
            component: KirbyComponent,
          },
        ],
      },
    ],
  },

  {
    title: 'Cultures',
    children: [
      {
        title: 'Economy',
        children: [
          {
            title: 'Goods',
            route: 'economy/goods',
            type: 'route',
            keybind: 'g',
            component: GoodsOverviewComponent,
          },
          {
            title: 'Structures',
            route: 'economy/structures',
            type: 'route',
            component: KirbyComponent,
            keybind: 's',
          },
          {
            title: 'Estates',
            route: 'economy/estates',
            type: 'route',
            component: KirbyComponent,
            keybind: 'e',
          },
        ],
      },
      {
        title: 'Settlements',
        children: [
          {
            title: 'naming',
            route: 'settlements/naming',
            type: 'route',
            keybind: 't',
            component: KirbyComponent,
          },
          {
            title: 'production',
            route: 'settlements/production',
            type: 'route',
            keybind: 'p',
            component: CityWrapperComponent,
          },
          {
            title: 'organization',
            route: 'settlements/organization',
            type: 'route',
            keybind: 'o',
            component: KirbyComponent,
          },
        ],
      },
    ],
  },

  {
    title: 'Transport',
    children: [
      {
        title: 'Convoys',
        children: [
          {
            title: 'All Convoys',
            route: 'fleets/convoys',
            type: 'route',
            component: KirbyComponent,
          },
          { title: 'Create Convoy', type: 'button' },
        ],
      },
      {
        title: 'Vessels',
        children: [
          { title: 'Overview', type: 'button' },
          { title: 'Create Vessel', type: 'button' },
          { title: 'Auto-Maintain', type: 'checkbox' },
        ],
      },
    ],
  },

  {
    title: 'NPC',
    children: [
      {
        title: 'Nations',
        route: 'diplomacy/nations',
        type: 'route',
        component: KirbyComponent,
      },
      {
        title: 'Guild',
        route: 'diplomacy/guild',
        type: 'route',
        component: KirbyComponent,
      },
      {
        title: 'Trade',
        route: 'diplomacy/trade',
        type: 'route',
        component: KirbyComponent,
      },
    ],
  },

  {
    title: 'Exploration',
    children: [
      {
        title: 'Sea Routes',
        type: 'route',
        route: 'exploration/routes',
        component: KirbyComponent,
      },
      {
        title: 'Harbors',
        type: 'route',
        route: 'exploration/harbors',
        component: KirbyComponent,
      },
      {
        title: 'Fog of War',
        type: 'checkbox',
        keybind: 'x',
      },
    ],
  },

  {
    title: 'Personnel',
    children: [
      {
        title: 'Captains',
        route: 'personnel/captains',
        type: 'route',
        component: KirbyComponent,
      },
      {
        title: 'Crew',
        route: 'personnel/crew',
        type: 'route',
        component: KirbyComponent,
      },
      { title: 'Hiring Auto-Fill', type: 'checkbox' },
    ],
  },

  {
    title: 'Settings',
    children: [
      { title: 'Sound', type: 'checkbox' },
      { title: 'Music', type: 'checkbox' },
      { title: 'Fullscreen', type: 'checkbox' },
    ],
  },

  {
    title: 'SDK',
    children: [
      {
        title: 'Goods Manager',
        type: 'route',
        route: 'sdk/tech/goods',
        sdkComponent: GoodsManagerPageComponent,
        description: 'SDK tech shell for fixture-backed goods management.',
      },
      {
        title: 'Room Creator',
        type: 'route',
        route: 'sdk/rooms',
        sdkComponent: RoomCreatorComponent,
        description: 'Workspace for designing rooms or interiors.',
      },
      {
        title: 'Settlement Manager',
        type: 'route',
        route: 'sdk/settlements',
        sdkComponent: SettlementManagerComponent,
        description: 'Manage and iterate on settlement data through the SDK.',
      },
      {
        title: 'Structure Creator',
        type: 'route',
        route: 'sdk/structures',
        sdkComponent: StructureCreatorComponent,
        description: 'Scaffold for creating structures within the SDK.',
      },
      {
        title: 'Structure Manager',
        type: 'route',
        route: 'sdk/structure-manager',
        sdkComponent: StructuremanagerComponent,
        description: 'Placeholder view for the structure management tool.',
      },
      {
        title: 'Tech Tree Editor',
        type: 'route',
        route: 'sdk/tech-tree',
        sdkComponent: TechTreeEditorComponent,
        description: 'Stable layout for editing tech tree overview, detail, and prerequisites.',
      },
    ],
  },
];
