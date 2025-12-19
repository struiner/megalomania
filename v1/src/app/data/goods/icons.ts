import { GoodsType } from "../../enums/GoodsType";

/**
 * Goods Icon Registry - Deterministic Asset Mapping
 * 
 * This registry provides deterministic icon mapping for all goods using GoodsType 
 * as the single source of truth. It supports era variants and follows retro/Hanseatic
 * art style guidelines.
 * 
 * Naming Convention:
 * - Format: goods_{goodstype}_{era}@{resolution}
 * - Resolution: 64-32 (primary), 128 (hi-res variant)
 * - Era variants allow for visual evolution across different time periods
 * 
 * Asset Structure:
 * /assets/goods/
 *   ├── goods_wood_marble@64-32.png      (Base era variant)
 *   ├── goods_wood_marble@128.png        (Hi-res variant)
 *   ├── goods_iron_ironbound@64-32.png   (Industrial variant)
 *   └── ... (additional era variants)
 */

export class GoodsIcons {
  /**
   * Primary icon registry - maps GoodsType to base era icon paths
   * All paths are relative to /assets/goods/ and use @64-32 resolution by default
   * 
   * Status Legend:
   * - Complete: Asset exists and is ready for use
   * - Placeholder: Temporary icon, needs actual art asset
   * - Missing: No icon assigned, will fall back to placeholder
   */
  static readonly iconRegistry: Record<GoodsType, IconEntry> = {
    // COMPLETE ICONS - Art assets available
    [GoodsType.Wood]: {
      path: "goods_wood_marble@64-32",
      status: "complete",
      era: "Marble",
      category: "RawMaterial",
      notes: "Wooden plank texture with grain details"
    },
    
    // PLACEHOLDER ICONS - Temporary, need art assets
    [GoodsType.Brick]: {
      path: "goods_brick_marble@64-32", 
      status: "placeholder",
      era: "Marble",
      category: "RawMaterial",
      notes: "Classic red brick pattern with mortar lines"
    },
    [GoodsType.Grain]: {
      path: "goods_grain_marble@64-32",
      status: "placeholder", 
      era: "Marble",
      category: "Food",
      notes: "Wheat sheaf or individual grains in golden color"
    },
    [GoodsType.Hemp]: {
      path: "goods_hemp_marble@64-32",
      status: "placeholder",
      era: "Marble", 
      category: "RawMaterial",
      notes: "Hemp fibers or rope texture"
    },
    [GoodsType.Wool]: {
      path: "goods_wool_marble@64-32",
      status: "placeholder",
      era: "Marble",
      category: "RawMaterial", 
      notes: "Raw wool or spun yarn texture"
    },
    [GoodsType.Iron]: {
      path: "goods_iron_ironbound@64-32",
      status: "placeholder",
      era: "Ironbound",
      category: "RawMaterial",
      notes: "Metal ingot with dark gray base and silver highlights"
    },
    [GoodsType.Honey]: {
      path: "goods_honey_marble@64-32",
      status: "placeholder",
      era: "Marble",
      category: "Food",
      notes: "Honey jar or golden honey texture"
    },
    [GoodsType.Salt]: {
      path: "goods_salt_marble@64-32", 
      status: "placeholder",
      era: "Marble",
      category: "RawMaterial",
      notes: "Salt crystals or salt pile texture"
    },
    [GoodsType.MetalGoods]: {
      path: "goods_metal_goods_ironbound@64-32",
      status: "placeholder",
      era: "Ironbound", 
      category: "Tool",
      notes: "Tool silhouette (hammer, anvil, or gear) for tool category recognition"
    },
    [GoodsType.Mead]: {
      path: "goods_mead_marble@64-32",
      status: "placeholder",
      era: "Marble",
      category: "Food", 
      notes: "Mead horn or honey wine vessel"
    },
    [GoodsType.Cloth]: {
      path: "goods_cloth_marble@64-32",
      status: "placeholder",
      era: "Marble",
      category: "Material",
      notes: "Woven fabric texture or bolt of cloth"
    },
    [GoodsType.Beer]: {
      path: "goods_beer_marble@64-32",
      status: "placeholder",
      era: "Marble",
      category: "Food",
      notes: "Beer mug or ale tankard"
    },
    [GoodsType.Stockfish]: {
      path: "goods_stockfish_marble@64-32",
      status: "placeholder",
      era: "Marble",
      category: "Food",
      notes: "Dried fish fillet or stockfish bundle"
    },
    [GoodsType.Clothing]: {
      path: "goods_clothing_marble@64-32",
      status: "placeholder", 
      era: "Marble",
      category: "Material",
      notes: "Finished garment or clothing item"
    },
    [GoodsType.Cheese]: {
      path: "goods_cheese_marble@64-32",
      status: "placeholder",
      era: "Marble",
      category: "Food",
      notes: "Cheese wheel or wedge with distinctive texture"
    },
    [GoodsType.Pitch]: {
      path: "goods_pitch_marble@64-32",
      status: "placeholder",
      era: "Marble",
      category: "RawMaterial", 
      notes: "Tar-like substance in container or puddle"
    },
    [GoodsType.Pelts]: {
      path: "goods_pelts_marble@64-32",
      status: "placeholder",
      era: "Marble",
      category: "RawMaterial",
      notes: "Animal fur pelts or hide bundles"
    },
    [GoodsType.Meat]: {
      path: "goods_meat_marble@64-32",
      status: "placeholder",
      era: "Marble", 
      category: "Food",
      notes: "Fresh meat cuts or processed meat products"
    },
    [GoodsType.Wine]: {
      path: "goods_wine_marble@64-32",
      status: "placeholder",
      era: "Marble",
      category: "Food",
      notes: "Wine bottle or amphora with grape motif"
    },
    [GoodsType.Spices]: {
      path: "goods_spices_marble@64-32",
      status: "placeholder",
      era: "Marble",
      category: "Luxury",
      notes: "Exotic spice containers or spice pile"
    },

    // RAW MATERIALS (lowercase entries)
    [GoodsType.Clay]: {
      path: "goods_clay_marble@64-32",
      status: "placeholder",
      era: "Marble",
      category: "RawMaterial",
      notes: "Clay blocks or pottery clay texture"
    },
    [GoodsType.Marble]: {
      path: "goods_marble_marble@64-32",
      status: "placeholder", 
      era: "Marble",
      category: "RawMaterial",
      notes: "Marble stone blocks with distinctive veining"
    },
    [GoodsType.Rubber]: {
      path: "goods_rubber_steamforged@64-32",
      status: "placeholder",
      era: "Steamforged",
      category: "RawMaterial",
      notes: "Raw rubber or rubber tree sap"
    },
    [GoodsType.Glassware]: {
      path: "goods_glassware_steamforged@64-32",
      status: "placeholder",
      era: "Steamforged",
      category: "Material", 
      notes: "Glass vessels, bottles, or windows"
    },
    [GoodsType.Tea]: {
      path: "goods_tea_marble@64-32",
      status: "placeholder",
      era: "Marble",
      category: "Food",
      notes: "Tea leaves, tea bags, or tea ceremony items"
    },
    [GoodsType.Dye]: {
      path: "goods_dye_marble@64-32",
      status: "placeholder",
      era: "Marble",
      category: "Material",
      notes: "Color dye containers or colored pigments"
    },
    [GoodsType.Pottery]: {
      path: "goods_pottery_marble@64-32",
      status: "placeholder",
      era: "Marble",
      category: "Material",
      notes: "Ceramic pots, bowls, or pottery vessels"
    },
    [GoodsType.Cocoa]: {
      path: "goods_cocoa_marble@64-32",
      status: "placeholder",
      era: "Marble", 
      category: "Food",
      notes: "Cocoa beans or chocolate原料"
    },
    [GoodsType.Coffee]: {
      path: "goods_coffee_marble@64-32",
      status: "placeholder",
      era: "Marble",
      category: "Food",
      notes: "Coffee beans or coffee preparation items"
    },
    [GoodsType.Cotton]: {
      path: "goods_cotton_marble@64-32",
      status: "placeholder",
      era: "Marble",
      category: "RawMaterial",
      notes: "Raw cotton bolls or cotton fabric"
    },
    [GoodsType.Sugar]: {
      path: "goods_sugar_marble@64-32",
      status: "placeholder", 
      era: "Marble",
      category: "Food",
      notes: "Sugar crystals, cane, or refined sugar"
    },
    [GoodsType.Tobacco]: {
      path: "goods_tobacco_marble@64-32",
      status: "placeholder",
      era: "Marble",
      category: "RawMaterial",
      notes: "Tobacco leaves or tobacco products"
    },
    [GoodsType.Silver]: {
      path: "goods_silver_ironbound@64-32",
      status: "placeholder",
      era: "Ironbound",
      category: "Luxury",
      notes: "Silver ingots or silver coins"
    },
    [GoodsType.Saffron]: {
      path: "goods_saffron_marble@64-32",
      status: "placeholder",
      era: "Marble",
      category: "Luxury", 
      notes: "Saffron threads or saffron spice containers"
    },
    [GoodsType.Gold]: {
      path: "goods_gold_ironbound@64-32",
      status: "placeholder",
      era: "Ironbound",
      category: "Luxury",
      notes: "Gold ingots, coins, or jewelry components"
    },
    [GoodsType.Gemstones]: {
      path: "goods_gemstones_ironbound@64-32",
      status: "placeholder",
      era: "Ironbound",
      category: "Luxury",
      notes: "Precious gemstones, crystals, or gems"
    },
    [GoodsType.Jewelry]: {
      path: "goods_jewelry_ironbound@64-32",
      status: "placeholder",
      era: "Ironbound",
      category: "Luxury",
      notes: "Finished jewelry pieces or precious accessories"
    },
    [GoodsType.Paper]: {
      path: "goods_paper_marble@64-32",
      status: "placeholder",
      era: "Marble",
      category: "Knowledge",
      notes: "Paper scrolls, books, or writing materials"
    },
    [GoodsType.Coal]: {
      path: "goods_coal_smokeforged@64-32",
      status: "placeholder",
      era: "Smokeforged",
      category: "Energy",
      notes: "Coal chunks or energy source material"
    },
    [GoodsType.Steel]: {
      path: "goods_steel_smokeforged@64-32",
      status: "placeholder", 
      era: "Smokeforged",
      category: "Material",
      notes: "Steel ingots or processed steel components"
    },
    [GoodsType.Oil]: {
      path: "goods_oil_modern@64-32",
      status: "placeholder",
      era: "Modern",
      category: "Energy",
      notes: "Oil barrels or petroleum products"
    },

    // INDUSTRIAL GOODS (PascalCase entries)
    [GoodsType.PlasticGoods]: {
      path: "goods_plastic_goods_modern@64-32",
      status: "placeholder",
      era: "Modern",
      category: "Tool",
      notes: "Plastic products or synthetic materials"
    },
    [GoodsType.Aluminium]: {
      path: "goods_aluminium_modern@64-32",
      status: "placeholder",
      era: "Modern",
      category: "RawMaterial", 
      notes: "Aluminum ingots or lightweight metal components"
    },
    [GoodsType.Titanium]: {
      path: "goods_titanium_stellar@64-32",
      status: "placeholder",
      era: "Stellar",
      category: "RawMaterial",
      notes: "Titanium components or aerospace materials"
    },
    [GoodsType.Fuel]: {
      path: "goods_fuel_modern@64-32",
      status: "placeholder",
      era: "Modern",
      category: "Energy",
      notes: "Fuel canisters or energy sources"
    },
    [GoodsType.Hydrogen]: {
      path: "goods_hydrogen_stellar@64-32",
      status: "placeholder",
      era: "Stellar", 
      category: "Energy",
      notes: "Hydrogen fuel cells or gas containers"
    },
    [GoodsType.Oxygen]: {
      path: "goods_oxygen_stellar@64-32",
      status: "placeholder",
      era: "Stellar",
      category: "Energy",
      notes: "Oxygen tanks or atmospheric components"
    },
    [GoodsType.Helium]: {
      path: "goods_helium_stellar@64-32",
      status: "placeholder",
      era: "Stellar",
      category: "Energy",
      notes: "Helium gas or lighter-than-air materials"
    },
    [GoodsType.Fertilizer]: {
      path: "goods_fertilizer_mechanized@64-32",
      status: "placeholder",
      era: "Mechanized",
      category: "RawMaterial",
      notes: "Agricultural fertilizer or soil enhancement"
    },
    [GoodsType.Copper]: {
      path: "goods_copper_smokeforged@64-32",
      status: "placeholder",
      era: "Smokeforged",
      category: "RawMaterial",
      notes: "Copper ingots or electrical components"
    },
    [GoodsType.ManaSlime]: {
      path: "goods_mana_slime_ethereal@64-32",
      status: "placeholder",
      era: "Ethereal",
      category: "ExoticMaterial",
      notes: "Magical slime or arcane materials"
    },
    [GoodsType.AetherResidue]: {
      path: "goods_aether_residue_ethereal@64-32", 
      status: "placeholder",
      era: "Ethereal",
      category: "ExoticMaterial",
      notes: "Aether crystal fragments or magical residue"
    },
    [GoodsType.Silicon]: {
      path: "goods_silicon_modern@64-32",
      status: "placeholder",
      era: "Modern",
      category: "RawMaterial",
      notes: "Silicon wafers or semiconductor materials"
    },
    [GoodsType.Gunpowder]: {
      path: "goods_gunpowder_smokeforged@64-32",
      status: "placeholder",
      era: "Smokeforged",
      category: "Material",
      notes: "Black powder or explosive materials"
    },
    [GoodsType.CarbonFiber]: {
      path: "goods_carbon_fiber_modern@64-32",
      status: "placeholder",
      era: "Modern",
      category: "Material",
      notes: "Carbon fiber weave or advanced composites"
    },
    [GoodsType.Electronics]: {
      path: "goods_electronics_modern@64-32",
      status: "placeholder",
      era: "Modern",
      category: "Tool",
      notes: "Electronic components or circuit boards"
    },
    [GoodsType.PlasmaGel]: {
      path: "goods_plasma_gel_stellar@64-32",
      status: "placeholder",
      era: "Stellar",
      category: "ExoticMaterial", 
      notes: "Plasma energy storage or exotic matter"
    },
    [GoodsType.Machinery]: {
      path: "goods_machinery_mechanized@64-32",
      status: "placeholder",
      era: "Mechanized",
      category: "Tool",
      notes: "Mechanical components or industrial machinery"
    },
    [GoodsType.Obsidian]: {
      path: "goods_obsidian_ethereal@64-32",
      status: "placeholder",
      era: "Ethereal",
      category: "RawMaterial",
      notes: "Obsidian glass or volcanic glass materials"
    },
    [GoodsType.Chemicals]: {
      path: "goods_chemicals_modern@64-32",
      status: "placeholder",
      era: "Modern",
      category: "Material",
      notes: "Chemical compounds or laboratory materials"
    },
    [GoodsType.Granite]: {
      path: "goods_granite_ironbound@64-32",
      status: "placeholder",
      era: "Ironbound",
      category: "RawMaterial", 
      notes: "Granite stone blocks or construction materials"
    },
    [GoodsType.Nitrogen]: {
      path: "goods_nitrogen_stellar@64-32",
      status: "placeholder",
      era: "Stellar",
      category: "Energy",
      notes: "Nitrogen gas or atmospheric components"
    },

    // EXOTIC MATERIALS (Fantasy/Sci-fi goods)
    [GoodsType.Crylithium]: {
      path: "goods_crylithium_stellar@64-32",
      status: "placeholder",
      era: "Stellar",
      category: "ExoticMaterial",
      notes: "Exotic crystal material or energy source"
    },
    [GoodsType.Vortanite]: {
      path: "goods_vortanite_stellar@64-32",
      status: "placeholder",
      era: "Stellar",
      category: "ExoticMaterial", 
      notes: "Vortex energy crystals or spacetime materials"
    },
    [GoodsType.Neptunium]: {
      path: "goods_neptunium_stellar@64-32",
      status: "placeholder",
      era: "Stellar",
      category: "ExoticMaterial",
      notes: "Heavy element or exotic matter"
    },
    [GoodsType.Aetherium]: {
      path: "goods_aetherium_ethereal@64-32",
      status: "placeholder",
      era: "Ethereal",
      category: "ExoticMaterial",
      notes: "Pure aether crystals or magical energy"
    },
    [GoodsType.Solarium]: {
      path: "goods_solarium_stellar@64-32",
      status: "placeholder",
      era: "Stellar",
      category: "ExoticMaterial",
      notes: "Solar energy crystals or light-based materials"
    },
    [GoodsType.Quantite]: {
      path: "goods_quantite_quantum@64-32",
      status: "placeholder",
      era: "Quantum",
      category: "ExoticMaterial",
      notes: "Quantum entangled particles or reality-bending materials"
    },
    [GoodsType.Xenorite]: {
      path: "goods_xenorite_alienic@64-32",
      status: "placeholder",
      era: "Alienic",
      category: "ExoticMaterial",
      notes: "Alien crystal formations or xeno materials"
    },
    [GoodsType.Luminar]: {
      path: "goods_luminar_stellar@64-32",
      status: "placeholder",
      era: "Stellar",
      category: "ExoticMaterial",
      notes: "Luminous energy crystals or bright materials"
    },
    [GoodsType.Gravitanium]: {
      path: "goods_gravitanium_stellar@64-32",
      status: "placeholder",
      era: "Stellar",
      category: "ExoticMaterial",
      notes: "Gravity-affecting materials or heavy elements"
    },
    [GoodsType.Obscurium]: {
      path: "goods_obscurium_ethereal@64-32",
      status: "placeholder",
      era: "Ethereal",
      category: "ExoticMaterial",
      notes: "Shadow matter or darkness-concentrated materials"
    },
    [GoodsType.Radiantite]: {
      path: "goods_radiantite_stellar@64-32",
      status: "placeholder",
      era: "Stellar",
      category: "ExoticMaterial",
      notes: "Radiant energy crystals or glowing materials"
    },
    [GoodsType.Pulsarite]: {
      path: "goods_pulsarite_stellar@64-32",
      status: "placeholder",
      era: "Stellar",
      category: "ExoticMaterial",
      notes: "Pulsar energy materials or rhythmic energy sources"
    },
    [GoodsType.Novacite]: {
      path: "goods_novacite_stellar@64-32",
      status: "placeholder",
      era: "Stellar",
      category: "ExoticMaterial", 
      notes: "Nova blast materials or explosive energy crystals"
    },
    [GoodsType.Zephyrium]: {
      path: "goods_zephyrium_ethereal@64-32",
      status: "placeholder",
      era: "Ethereal",
      category: "ExoticMaterial",
      notes: "Wind essence crystals or air-based materials"
    },
    [GoodsType.Astralite]: {
      path: "goods_astralite_stellar@64-32",
      status: "placeholder",
      era: "Stellar",
      category: "ExoticMaterial",
      notes: "Astral plane materials or cosmic energy"
    },
    [GoodsType.Nebulon]: {
      path: "goods_nebulon_stellar@64-32",
      status: "placeholder",
      era: "Stellar",
      category: "ExoticMaterial",
      notes: "Nebula gas clouds or cosmic materials"
    },
    [GoodsType.Chronotite]: {
      path: "goods_chronotite_quantum@64-32",
      status: "placeholder",
      era: "Quantum",
      category: "ExoticMaterial",
      notes: "Time-manipulation crystals or temporal materials"
    },
    [GoodsType.Thermium]: {
      path: "goods_thermium_stellar@64-32",
      status: "placeholder",
      era: "Stellar",
      category: "ExoticMaterial",
      notes: "Extreme heat materials or thermal energy crystals"
    },
    [GoodsType.Electrite]: {
      path: "goods_electrite_stellar@64-32",
      status: "placeholder",
      era: "Stellar",
      category: "ExoticMaterial",
      notes: "Pure electrical energy crystals or lightning materials"
    },
    [GoodsType.Magnetarite]: {
      path: "goods_magnetarite_stellar@64-32",
      status: "placeholder",
      era: "Stellar",
      category: "ExoticMaterial",
      notes: "Magnetic field crystals or magnetic materials"
    },
    [GoodsType.Dragonite]: {
      path: "goods_dragonite_ethereal@64-32",
      status: "placeholder",
      era: "Ethereal",
      category: "ExoticMaterial",
      notes: "Dragon-scale materials or mythical substances"
    },

    // Additional fantasy materials
    [GoodsType.Emberith]: {
      path: "goods_emberith_ethereal@64-32",
      status: "placeholder",
      era: "Ethereal", 
      category: "ExoticMaterial",
      notes: "Ember crystals or fire essence materials"
    },
    [GoodsType.Glimbrite]: {
      path: "goods_glimbrite_ethereal@64-32",
      status: "placeholder",
      era: "Ethereal",
      category: "ExoticMaterial",
      notes: "Glittering crystal fragments or light materials"
    },
    [GoodsType.Tharnax]: {
      path: "goods_tharnax_ethereal@64-32",
      status: "placeholder",
      era: "Ethereal",
      category: "ExoticMaterial",
      notes: "Dark crystal formations or shadow materials"
    },
    [GoodsType.Velunor]: {
      path: "goods_velunor_ethereal@64-32",
      status: "placeholder",
      era: "Ethereal",
      category: "ExoticMaterial",
      notes: "Velvet-like materials or soft crystalline substances"
    },
    [GoodsType.Kryntal]: {
      path: "goods_kryntal_ethereal@64-32",
      status: "placeholder",
      era: "Ethereal",
      category: "ExoticMaterial",
      notes: "Ice crystal formations or frozen essence"
    },
    [GoodsType.Zorvium]: {
      path: "goods_zorvium_ethereal@64-32",
      status: "placeholder",
      era: "Ethereal",
      category: "ExoticMaterial",
      notes: "Dark metallic crystals or void materials"
    },
    [GoodsType.Eldrithium]: {
      path: "goods_eldrithium_ethereal@64-32",
      status: "placeholder",
      era: "Ethereal",
      category: "ExoticMaterial",
      notes: "Elder magic crystals or ancient essence"
    },
    [GoodsType.Morvex]: {
      path: "goods_morvex_ethereal@64-32",
      status: "placeholder",
      era: "Ethereal",
      category: "ExoticMaterial",
      notes: "Morphing materials or shape-changing substances"
    },
    [GoodsType.Sylvaran]: {
      path: "goods_sylvaran_ethereal@64-32",
      status: "placeholder",
      era: "Ethereal",
      category: "ExoticMaterial",
      notes: "Nature essence crystals or forest materials"
    },
    [GoodsType.Durnacite]: {
      path: "goods_durnacite_ethereal@64-32",
      status: "placeholder",
      era: "Ethereal",
      category: "ExoticMaterial",
      notes: "Hardened magical materials or durable crystals"
    },
    [GoodsType.Luminex]: {
      path: "goods_luminex_ethereal@64-32",
      status: "placeholder",
      era: "Ethereal",
      category: "ExoticMaterial", 
      notes: "Brilliant light crystals or illumination materials"
    },
    [GoodsType.Virelium]: {
      path: "goods_virelium_ethereal@64-32",
      status: "placeholder",
      era: "Ethereal",
      category: "ExoticMaterial",
      notes: "Living metal crystals or animate materials"
    },
    [GoodsType.Nexalite]: {
      path: "goods_nexalite_ethereal@64-32",
      status: "placeholder",
      era: "Ethereal",
      category: "ExoticMaterial",
      notes: "Nexus point crystals or connection materials"
    },
    [GoodsType.Quenril]: {
      path: "goods_quenril_ethereal@64-32",
      status: "placeholder",
      era: "Ethereal",
      category: "ExoticMaterial",
      notes: "Questioning crystals or uncertainty materials"
    },
    [GoodsType.Arcanite]: {
      path: "goods_arcanite_ethereal@64-32",
      status: "placeholder",
      era: "Ethereal",
      category: "ExoticMaterial",
      notes: "Arcane magic crystals or spell materials"
    },
    [GoodsType.Felbrim]: {
      path: "goods_felbrim_ethereal@64-32",
      status: "placeholder",
      era: "Ethereal",
      category: "ExoticMaterial",
      notes: "Feline-like crystals or cat essence materials"
    },
    [GoodsType.Xenthium]: {
      path: "goods_xenthium_ethereal@64-32",
      status: "placeholder",
      era: "Ethereal",
      category: "ExoticMaterial",
      notes: "Xenomorphic crystals or alien-formed materials"
    },
    [GoodsType.Myrralith]: {
      path: "goods_myrralith_ethereal@64-32",
      status: "placeholder",
      era: "Ethereal",
      category: "ExoticMaterial",
      notes: "Myrrh-like aromatic crystals or resin materials"
    },
    [GoodsType.Zephyrite]: {
      path: "goods_zephyrite_ethereal@64-32",
      status: "placeholder",
      era: "Ethereal",
      category: "ExoticMaterial",
      notes: "Zephyr wind crystals or air essence materials"
    },
    [GoodsType.Nexos]: {
      path: "goods_nexos_ethereal@64-32",
      status: "placeholder",
      era: "Ethereal",
      category: "ExoticMaterial",
      notes: "Connection nexus crystals or linking materials"
    },
    [GoodsType.Berillium]: {
      path: "goods_berillium_ethereal@64-32",
      status: "placeholder",
      era: "Ethereal",
      category: "ExoticMaterial",
      notes: "Beryl-like crystals or green gemstone materials"
    }
  };

  /**
   * Get icon path for a specific GoodsType
   * @param type The GoodsType to get icon for
   * @returns Icon path string or empty string if not found
   */
  static getIconPath(type: GoodsType): string {
    const entry = this.iconRegistry[type];
    return entry ? `assets/${entry.path}.png` : '';
  }

  /**
   * Get icon status for a specific GoodsType
   * @param type The GoodsType to get status for
   * @returns Icon status or 'missing' if not found
   */
  static getIconStatus(type: GoodsType): 'complete' | 'placeholder' | 'missing' {
    const entry = this.iconRegistry[type];
    return entry ? entry.status : 'missing';
  }

  /**
   * Get all icon entries as an array
   * @returns Array of icon entries with metadata
   */
  static getAllIcons(): Array<{type: GoodsType} & IconEntry> {
    return Object.entries(this.iconRegistry).map(([type, entry]) => ({
      type: type as GoodsType,
      ...entry
    }));
  }

  /**
   * Get icons by category
   * @param category The category to filter by
   * @returns Array of icon entries for the specified category
   */
  static getIconsByCategory(category: string): Array<{type: GoodsType} & IconEntry> {
    return this.getAllIcons().filter(icon => icon.category === category);
  }

  /**
   * Get icons by era
   * @param era The era to filter by
   * @returns Array of icon entries for the specified era
   */
  static getIconsByEra(era: string): Array<{type: GoodsType} & IconEntry> {
    return this.getAllIcons().filter(icon => icon.era === era);
  }

  /**
   * Get placeholder icons (status: placeholder or missing)
   * @returns Array of icon entries that need art assets
   */
  static getPlaceholderIcons(): Array<{type: GoodsType} & IconEntry> {
    return this.getAllIcons().filter(icon => icon.status === 'placeholder' || icon.status === 'missing');
  }

  /**
   * Validate the icon registry for issues
   * @returns Array of validation issues found
   */
  static validateRegistry(): Array<{
    type: GoodsType;
    issue: string;
    severity: 'error' | 'warning' | 'info';
  }> {
    const issues: Array<{
      type: GoodsType;
      issue: string;
      severity: 'error' | 'warning' | 'info';
    }> = [];

    // Check for missing entries
    const allGoodsTypes = Object.values(GoodsType);
    allGoodsTypes.forEach(type => {
      if (!this.iconRegistry[type]) {
        issues.push({
          type,
          issue: `Missing icon entry for ${type}`,
          severity: 'error'
        });
      }
    });

    // Check for placeholder entries
    Object.entries(this.iconRegistry).forEach(([type, entry]) => {
      if (entry.status === 'placeholder') {
        issues.push({
          type: type as GoodsType,
          issue: `Placeholder icon for ${type} - needs art asset`,
          severity: 'warning'
        });
      }
    });

    return issues;
  }
}

/**
 * Icon entry interface defining the structure for each good's icon metadata
 */
interface IconEntry {
  path: string;           // Relative path without extension or resolution suffix
  status: 'complete' | 'placeholder' | 'missing';
  era: string;            // Era variant for the icon
  category: string;       // Good category for filtering
  notes?: string;         // Art guidelines and notes
}