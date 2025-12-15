import { FloraType } from "../enums/FloraType";
import { FloraUseType } from "../enums/FloraUseType";
import { BiomeType } from "../enums/BiomeType";

export interface FloraMetadata {
  id: FloraType;
  biome: BiomeType;
  uses: FloraUseType[];
  description: string;
}


export const FLORA_METADATA: Record<FloraType, FloraMetadata> = {
  [FloraType.GiantKelp]: {
    id: FloraType.GiantKelp,
    biome: BiomeType.Ocean,
    uses: [
      FloraUseType.Food,
      FloraUseType.Fertilizer,
      FloraUseType.Material,
      FloraUseType.Trade
    ],
    description: 'Massive kelp used for food, rope fibers, fertilizer, and iodine-rich trade goods.'
  },

  [FloraType.BullKelp]: {
    id: FloraType.BullKelp,
    biome: BiomeType.Ocean,
    uses: [FloraUseType.Food, FloraUseType.Material],
    description: 'Edible kelp with hollow stalks used for containers and cordage.'
  },

  [FloraType.SugarKelp]: {
    id: FloraType.SugarKelp,
    biome: BiomeType.Ocean,
    uses: [FloraUseType.Food, FloraUseType.Industry, FloraUseType.Trade],
    description: 'Sweet kelp harvested for food, fermentation, and preserved trade goods.'
  },

  [FloraType.Wakame]: {
    id: FloraType.Wakame,
    biome: BiomeType.Ocean,
    uses: [FloraUseType.Food, FloraUseType.Trade],
    description: 'Highly nutritious edible seaweed, commonly dried for transport and trade.'
  },

  [FloraType.Nori]: {
    id: FloraType.Nori,
    biome: BiomeType.Ocean,
    uses: [FloraUseType.Food, FloraUseType.Trade],
    description: 'Thin seaweed sheets pressed and dried as long-lasting staple food.'
  },

  [FloraType.Sargassum]: {
    id: FloraType.Sargassum,
    biome: BiomeType.Ocean,
    uses: [FloraUseType.Fertilizer, FloraUseType.Food],
    description: 'Floating algae collected for composting, fertilizer, and animal feed.'
  },

  [FloraType.Eelgrass]: {
    id: FloraType.Eelgrass,
    biome: BiomeType.Ocean,
    uses: [FloraUseType.Insulation, FloraUseType.Material],
    description: 'Tough seagrass used for insulation, bedding, and packing materials.'
  },

  [FloraType.Bladderwrack]: {
    id: FloraType.Bladderwrack,
    biome: BiomeType.Ocean,
    uses: [FloraUseType.Medicine, FloraUseType.Industry],
    description: 'Iodine-rich seaweed used in medicine and chemical extraction.'
  },

  [FloraType.IrishMoss]: {
    id: FloraType.IrishMoss,
    biome: BiomeType.Ocean,
    uses: [FloraUseType.Food, FloraUseType.Medicine, FloraUseType.Industry],
    description: 'Gel-forming algae used in food thickening and medicinal preparations.'
  },

  [FloraType.SeaLettuce]: {
    id: FloraType.SeaLettuce,
    biome: BiomeType.Ocean,
    uses: [FloraUseType.Food],
    description: 'Tender green algae eaten fresh or dried as a coastal vegetable.'
  },

  [FloraType.RedAlgae]: {
    id: FloraType.RedAlgae,
    biome: BiomeType.Ocean,
    uses: [FloraUseType.Industry, FloraUseType.Food],
    description: 'Primary source of agar used in food processing and crafts.'
  },

  [FloraType.CorallineAlgae]: {
    id: FloraType.CorallineAlgae,
    biome: BiomeType.Ocean,
    uses: [FloraUseType.Industry, FloraUseType.Fertilizer],
    description: 'Calcified algae ground into lime for soil enrichment and mortar.'
  },

  [FloraType.SeaPalm]: {
    id: FloraType.SeaPalm,
    biome: BiomeType.Ocean,
    uses: [FloraUseType.Food],
    description: 'Edible palm-like kelp harvested as a survival and coastal staple food.'
  },

  [FloraType.FeatherBoaKelp]: {
    id: FloraType.FeatherBoaKelp,
    biome: BiomeType.Ocean,
    uses: [FloraUseType.Food],
    description: 'Soft kelp variety valued for drying and preservation.'
  },

  [FloraType.BrownAlgae]: {
    id: FloraType.BrownAlgae,
    biome: BiomeType.Ocean,
    uses: [FloraUseType.Industry],
    description: 'Processed into alginates used as binders and stabilizers.'
  },

  [FloraType.BlueGreenAlgae]: {
    id: FloraType.BlueGreenAlgae,
    biome: BiomeType.Ocean,
    uses: [FloraUseType.Food, FloraUseType.Fertilizer],
    description: 'Nutrient-dense algae cultivated as supplements and soil enhancers.'
  },

  [FloraType.MarinePhytoplankton]: {
    id: FloraType.MarinePhytoplankton,
    biome: BiomeType.Ocean,
    uses: [FloraUseType.Food],
    description: 'Microscopic algae forming the foundation of marine food chains.'
  },

  [FloraType.SeaMoss]: {
    id: FloraType.SeaMoss,
    biome: BiomeType.Ocean,
    uses: [FloraUseType.Food, FloraUseType.Medicine],
    description: 'Gelatinous algae used in tonics, desserts, and cosmetic mixtures.'
  },

  [FloraType.Rockweed]: {
    id: FloraType.Rockweed,
    biome: BiomeType.Ocean,
    uses: [FloraUseType.Fertilizer, FloraUseType.Trade],
    description: 'Hardy seaweed harvested for fertilizer and coastal commerce.'
  },

  [FloraType.DriftAlgaeMats]: {
    id: FloraType.DriftAlgaeMats,
    biome: BiomeType.Ocean,
    uses: [FloraUseType.Fertilizer, FloraUseType.Industry],
    description: 'Collected algae masses used for composting and salt extraction.'
  },

  [FloraType.BeachGrass]: {
  id: FloraType.BeachGrass,
  biome: BiomeType.Beach,
  uses: [FloraUseType.Material, FloraUseType.Construction],
  description: 'Tough coastal grass used for thatching, rope-making, and dune stabilization.'
},

[FloraType.SeaOats]: {
  id: FloraType.SeaOats,
  biome: BiomeType.Beach,
  uses: [FloraUseType.Food, FloraUseType.Material],
  description: 'Grain-bearing grass cultivated for food and erosion control.'
},

[FloraType.BeachMorningGlory]: {
  id: FloraType.BeachMorningGlory,
  biome: BiomeType.Beach,
  uses: [FloraUseType.Medicine],
  description: 'Medicinal vine used in poultices and anti-inflammatory remedies.'
},

[FloraType.DuneSunflower]: {
  id: FloraType.DuneSunflower,
  biome: BiomeType.Beach,
  uses: [FloraUseType.Food],
  description: 'Produces edible seeds and oil-rich kernels.'
},

[FloraType.SeaPea]: {
  id: FloraType.SeaPea,
  biome: BiomeType.Beach,
  uses: [FloraUseType.Food],
  description: 'Legume with edible seeds and soil-enriching properties.'
},

[FloraType.SeaLavender]: {
  id: FloraType.SeaLavender,
  biome: BiomeType.Beach,
  uses: [FloraUseType.Dye, FloraUseType.Trade],
  description: 'Source of purple dyes and dried ornamental trade goods.'
},

[FloraType.SeaRocket]: {
  id: FloraType.SeaRocket,
  biome: BiomeType.Beach,
  uses: [FloraUseType.Food],
  description: 'Peppery coastal plant eaten fresh or preserved.'
},

[FloraType.Glasswort]: {
  id: FloraType.Glasswort,
  biome: BiomeType.Beach,
  uses: [FloraUseType.Food, FloraUseType.Industry],
  description: 'Edible salt plant burned for soda ash used in glassmaking.'
},

[FloraType.Saltwort]: {
  id: FloraType.Saltwort,
  biome: BiomeType.Beach,
  uses: [FloraUseType.Fertilizer],
  description: 'Salt-tolerant plant composted to improve poor soils.'
},

[FloraType.BeachRose]: {
  id: FloraType.BeachRose,
  biome: BiomeType.Beach,
  uses: [FloraUseType.Food, FloraUseType.Medicine],
  description: 'Produces vitamin-rich rose hips used in teas and preserves.'
},

[FloraType.IcePlant]: {
  id: FloraType.IcePlant,
  biome: BiomeType.Beach,
  uses: [FloraUseType.Food],
  description: 'Succulent coastal plant eaten fresh or cooked.'
},

[FloraType.SandVerbena]: {
  id: FloraType.SandVerbena,
  biome: BiomeType.Beach,
  uses: [FloraUseType.Medicine],
  description: 'Used in traditional remedies for fevers and pain.'
},

[FloraType.CoastalSedge]: {
  id: FloraType.CoastalSedge,
  biome: BiomeType.Beach,
  uses: [FloraUseType.Material],
  description: 'Fibrous sedge used for weaving mats and baskets.'
},

[FloraType.BeachHeather]: {
  id: FloraType.BeachHeather,
  biome: BiomeType.Beach,
  uses: [FloraUseType.Medicine],
  description: 'Herb used in teas for respiratory ailments.'
},

[FloraType.SeaHolly]: {
  id: FloraType.SeaHolly,
  biome: BiomeType.Beach,
  uses: [FloraUseType.Medicine, FloraUseType.Trade],
  description: 'Root used as tonic and aphrodisiac, valued in trade.'
},

[FloraType.Saltbush]: {
  id: FloraType.Saltbush,
  biome: BiomeType.Beach,
  uses: [FloraUseType.Food, FloraUseType.Fertilizer],
  description: 'Edible leaves used as fodder and soil improver.'
},

[FloraType.SeasideGoldenrod]: {
  id: FloraType.SeasideGoldenrod,
  biome: BiomeType.Beach,
  uses: [FloraUseType.Medicine],
  description: 'Medicinal herb used for kidney and urinary treatments.'
},

[FloraType.CoastalSage]: {
  id: FloraType.CoastalSage,
  biome: BiomeType.Beach,
  uses: [FloraUseType.Medicine, FloraUseType.Ritual],
  description: 'Aromatic herb used for healing and ceremonial cleansing.'
},

[FloraType.DuneGrass]: {
  id: FloraType.DuneGrass,
  biome: BiomeType.Beach,
  uses: [FloraUseType.Material, FloraUseType.Construction],
  description: 'Strong grass used for rope, thatch, and dune reinforcement.'
},

[FloraType.CoastalRosemary]: {
  id: FloraType.CoastalRosemary,
  biome: BiomeType.Beach,
  uses: [FloraUseType.Medicine],
  description: 'Fragrant shrub used in teas and herbal remedies.'
},
[FloraType.WaterLily]: {
    id: FloraType.WaterLily,
    biome: BiomeType.Water,
    uses: [FloraUseType.Food, FloraUseType.Medicine],
    description: 'Aquatic plant with edible roots and seeds, also used in traditional medicine.'
  },

  [FloraType.Duckweed]: {
    id: FloraType.Duckweed,
    biome: BiomeType.Water,
    uses: [FloraUseType.Food, FloraUseType.Fertilizer],
    description: 'Fast-growing aquatic plant used as animal feed, fertilizer, and protein source.'
  },

  [FloraType.WaterHyacinth]: {
    id: FloraType.WaterHyacinth,
    biome: BiomeType.Water,
    uses: [FloraUseType.Material, FloraUseType.Fuel],
    description: 'Fibrous floating plant harvested for basketry, paper, and biofuel.'
  },

  [FloraType.Cattails]: {
    id: FloraType.Cattails,
    biome: BiomeType.Water,
    uses: [
      FloraUseType.Food,
      FloraUseType.Material,
      FloraUseType.Fuel
    ],
    description: 'Versatile marsh plant providing edible shoots, weaving fibers, and tinder.'
  },

  [FloraType.Reeds]: {
    id: FloraType.Reeds,
    biome: BiomeType.Water,
    uses: [FloraUseType.Material, FloraUseType.Construction],
    description: 'Tall grasses used for thatching, mats, baskets, and light construction.'
  },

  [FloraType.Pondweed]: {
    id: FloraType.Pondweed,
    biome: BiomeType.Water,
    uses: [FloraUseType.Food],
    description: 'Submerged plant with edible seeds and value as fish habitat.'
  },

  [FloraType.WaterMilfoil]: {
    id: FloraType.WaterMilfoil,
    biome: BiomeType.Water,
    uses: [FloraUseType.Fertilizer],
    description: 'Aquatic plant composted into nutrient-rich fertilizer.'
  },

  [FloraType.Hornwort]: {
    id: FloraType.Hornwort,
    biome: BiomeType.Water,
    uses: [FloraUseType.Fertilizer],
    description: 'Free-floating plant used in composting and soil enrichment.'
  },

  [FloraType.Lotus]: {
    id: FloraType.Lotus,
    biome: BiomeType.Water,
    uses: [
      FloraUseType.Food,
      FloraUseType.Medicine,
      FloraUseType.Ritual,
      FloraUseType.Trade
    ],
    description: 'Sacred aquatic plant with edible roots, seeds, and ceremonial importance.'
  },

  [FloraType.Frogbit]: {
    id: FloraType.Frogbit,
    biome: BiomeType.Water,
    uses: [FloraUseType.Fertilizer],
    description: 'Floating plant harvested for compost and water purification.'
  },

  [FloraType.Pickerelweed]: {
    id: FloraType.Pickerelweed,
    biome: BiomeType.Water,
    uses: [FloraUseType.Food],
    description: 'Edible seeds gathered from shallow wetlands.'
  },

  [FloraType.Arrowhead]: {
    id: FloraType.Arrowhead,
    biome: BiomeType.Water,
    uses: [FloraUseType.Food, FloraUseType.Trade],
    description: 'Produces starchy tubers used as a freshwater staple crop.'
  },

  [FloraType.Bulrush]: {
    id: FloraType.Bulrush,
    biome: BiomeType.Water,
    uses: [FloraUseType.Material, FloraUseType.Construction],
    description: 'Wetland plant used for mats, baskets, ropes, and shelter walls.'
  },

  [FloraType.MarshMarigold]: {
    id: FloraType.MarshMarigold,
    biome: BiomeType.Water,
    uses: [FloraUseType.Medicine],
    description: 'Medicinal wetland flower used in controlled herbal remedies.'
  },

  [FloraType.WaterChestnut]: {
    id: FloraType.WaterChestnut,
    biome: BiomeType.Water,
    uses: [FloraUseType.Food, FloraUseType.Trade],
    description: 'Nut-bearing aquatic plant cultivated as a valuable food crop.'
  },

  [FloraType.TapeGrass]: {
    id: FloraType.TapeGrass,
    biome: BiomeType.Water,
    uses: [FloraUseType.Fertilizer],
    description: 'Submerged grass harvested for compost and soil enrichment.'
  },

  [FloraType.Elodea]: {
    id: FloraType.Elodea,
    biome: BiomeType.Water,
    uses: [FloraUseType.Industry],
    description: 'Oxygenating plant used in water treatment and managed waterways.'
  },

  [FloraType.FreshwaterAlgae]: {
    id: FloraType.FreshwaterAlgae,
    biome: BiomeType.Water,
    uses: [FloraUseType.Food, FloraUseType.Fertilizer],
    description: 'Collected algae used as nutrient supplements and fertilizer.'
  },

  [FloraType.WaterMoss]: {
    id: FloraType.WaterMoss,
    biome: BiomeType.Water,
    uses: [FloraUseType.Medicine, FloraUseType.Insulation],
    description: 'Absorbent moss used for wound dressing and insulation.'
  },

  [FloraType.FloatingFern]: {
    id: FloraType.FloatingFern,
    biome: BiomeType.Water,
    uses: [FloraUseType.Fertilizer],
    description: 'Nitrogen-fixing fern used to enrich agricultural soils.'
  },
[FloraType.Edelweiss]: {
  id: FloraType.Edelweiss,
  biome: BiomeType.Alpine,
  uses: [FloraUseType.Medicine, FloraUseType.Trade],
  description: 'Rare alpine flower used in respiratory remedies and high-value trade.'
},

[FloraType.AlpineGentian]: {
  id: FloraType.AlpineGentian,
  biome: BiomeType.Alpine,
  uses: [FloraUseType.Medicine],
  description: 'Extremely bitter root used to stimulate digestion.'
},

[FloraType.AlpineForgetMeNot]: {
  id: FloraType.AlpineForgetMeNot,
  biome: BiomeType.Alpine,
  uses: [FloraUseType.Ritual],
  description: 'Symbolic flower used in remembrance rites.'
},

[FloraType.AlpineButtercup]: {
  id: FloraType.AlpineButtercup,
  biome: BiomeType.Alpine,
  uses: [FloraUseType.Medicine],
  description: 'Used externally for inflammation; toxic if misused.'
},

[FloraType.AlpineCushionPlant]: {
  id: FloraType.AlpineCushionPlant,
  biome: BiomeType.Alpine,
  uses: [FloraUseType.Fuel],
  description: 'Dense growth burned as emergency alpine fuel.'
},

[FloraType.SnowLotus]: {
  id: FloraType.SnowLotus,
  biome: BiomeType.Alpine,
  uses: [FloraUseType.Medicine, FloraUseType.Trade],
  description: 'Highly prized medicinal plant growing at extreme elevations.'
},

[FloraType.AlpineThyme]: {
  id: FloraType.AlpineThyme,
  biome: BiomeType.Alpine,
  uses: [FloraUseType.Food, FloraUseType.Medicine],
  description: 'Aromatic herb used in cooking and antiseptic remedies.'
},

[FloraType.AlpineSorrel]: {
  id: FloraType.AlpineSorrel,
  biome: BiomeType.Alpine,
  uses: [FloraUseType.Food],
  description: 'Edible sour leaves used fresh in alpine diets.'
},

[FloraType.AlpineMoss]: {
  id: FloraType.AlpineMoss,
  biome: BiomeType.Alpine,
  uses: [FloraUseType.Insulation],
  description: 'Cold-resistant moss used for insulation and bedding.'
},
[FloraType.AlpineBluegrass]: {
  id: FloraType.AlpineBluegrass,
  biome: BiomeType.AlpineGrassland,
  uses: [FloraUseType.Fodder],
  description: 'Cold-hardy grass forming the backbone of alpine grazing lands.'
},

[FloraType.FescueGrass]: {
  id: FloraType.FescueGrass,
  biome: BiomeType.AlpineGrassland,
  uses: [FloraUseType.Fodder],
  description: 'Resilient pasture grass tolerant of cold and poor soils.'
},

[FloraType.TuftedHairgrass]: {
  id: FloraType.TuftedHairgrass,
  biome: BiomeType.AlpineGrassland,
  uses: [FloraUseType.Fodder],
  description: 'Tuft-forming grass grazed by livestock and wild herbivores.'
},

[FloraType.AlpineClover]: {
  id: FloraType.AlpineClover,
  biome: BiomeType.AlpineGrassland,
  uses: [FloraUseType.Fertilizer, FloraUseType.Fodder],
  description: 'Nitrogen-fixing legume improving soil fertility and pasture quality.'
},

[FloraType.AlpineDaisy]: {
  id: FloraType.AlpineDaisy,
  biome: BiomeType.AlpineGrassland,
  uses: [FloraUseType.Medicine],
  description: 'Medicinal flower used in anti-inflammatory infusions.'
},

[FloraType.AlpineSage]: {
  id: FloraType.AlpineSage,
  biome: BiomeType.AlpineGrassland,
  uses: [FloraUseType.Medicine, FloraUseType.Ritual],
  description: 'Aromatic herb used for healing and cleansing rites.'
},

[FloraType.AlpineBistortGrassland]: {
  id: FloraType.AlpineBistortGrassland,
  biome: BiomeType.AlpineGrassland,
  uses: [FloraUseType.Food],
  description: 'Produces edible roots and shoots used as a hardy food source.'
},

[FloraType.AlpineViolet]: {
  id: FloraType.AlpineViolet,
  biome: BiomeType.AlpineGrassland,
  uses: [FloraUseType.Medicine],
  description: 'Used in teas to soothe coughs and respiratory ailments.'
},

[FloraType.AlpinePhlox]: {
  id: FloraType.AlpinePhlox,
  biome: BiomeType.AlpineGrassland,
  uses: [FloraUseType.Trade],
  description: 'Decorative flowering plant traded as dried ornamentals.'
},

[FloraType.AlpineCranesbill]: {
  id: FloraType.AlpineCranesbill,
  biome: BiomeType.AlpineGrassland,
  uses: [FloraUseType.Medicine],
  description: 'Herb used to stop bleeding and treat wounds.'
},

[FloraType.AlpineHawkweed]: {
  id: FloraType.AlpineHawkweed,
  biome: BiomeType.AlpineGrassland,
  uses: [FloraUseType.Medicine],
  description: 'Used in eye washes and anti-inflammatory remedies.'
},

[FloraType.AlpineMilkvetch]: {
  id: FloraType.AlpineMilkvetch,
  biome: BiomeType.AlpineGrassland,
  uses: [FloraUseType.Fertilizer],
  description: 'Nitrogen-fixing plant supporting long-term pasture sustainability.'
},

[FloraType.AlpineYarrowGrassland]: {
  id: FloraType.AlpineYarrowGrassland,
  biome: BiomeType.AlpineGrassland,
  uses: [FloraUseType.Medicine],
  description: 'Widely used medicinal herb for wound care and fevers.'
},

[FloraType.AlpinePlantainGrassland]: {
  id: FloraType.AlpinePlantainGrassland,
  biome: BiomeType.AlpineGrassland,
  uses: [FloraUseType.Medicine],
  description: 'Leaves used to treat insect bites and skin irritation.'
},

[FloraType.AlpineSedgeGrassland]: {
  id: FloraType.AlpineSedgeGrassland,
  biome: BiomeType.AlpineGrassland,
  uses: [FloraUseType.Material],
  description: 'Fibrous sedge used for cordage and mat weaving.'
},

[FloraType.AlpineTimothy]: {
  id: FloraType.AlpineTimothy,
  biome: BiomeType.AlpineGrassland,
  uses: [FloraUseType.Fodder],
  description: 'High-quality hay grass harvested for winter feed.'
},

[FloraType.AlpineRyegrass]: {
  id: FloraType.AlpineRyegrass,
  biome: BiomeType.AlpineGrassland,
  uses: [FloraUseType.Fodder],
  description: 'Fast-growing grass used for grazing and hay.'
},

[FloraType.AlpineMeadowButtercup]: {
  id: FloraType.AlpineMeadowButtercup,
  biome: BiomeType.AlpineGrassland,
  uses: [FloraUseType.Medicine],
  description: 'Externally applied medicinal plant for joint pain.'
},

[FloraType.AlpineWildOnion]: {
  id: FloraType.AlpineWildOnion,
  biome: BiomeType.AlpineGrassland,
  uses: [FloraUseType.Food],
  description: 'Wild onion harvested as seasoning and vegetable.'
},

[FloraType.AlpineMeadowSorrel]: {
  id: FloraType.AlpineMeadowSorrel,
  biome: BiomeType.AlpineGrassland,
  uses: [FloraUseType.Food],
  description: 'Sour leafy green eaten fresh or cooked.'
},

[FloraType.Spruce]: {
  id: FloraType.Spruce,
  biome: BiomeType.Taiga,
  uses: [FloraUseType.Construction, FloraUseType.Fuel, FloraUseType.Material],
  description: 'Primary timber tree used for buildings, tools, and firewood.'
},

[FloraType.Pine]: {
  id: FloraType.Pine,
  biome: BiomeType.Taiga,
  uses: [FloraUseType.Construction, FloraUseType.Fuel, FloraUseType.Material],
  description: 'Versatile conifer used for lumber, charcoal, and tools.'
},

[FloraType.Fir]: {
  id: FloraType.Fir,
  biome: BiomeType.Taiga,
  uses: [FloraUseType.Construction, FloraUseType.Fuel],
  description: 'Straight-growing tree valued for beams and firewood.'
},

[FloraType.Larch]: {
  id: FloraType.Larch,
  biome: BiomeType.Taiga,
  uses: [FloraUseType.Construction, FloraUseType.Material],
  description: 'Rot-resistant timber ideal for outdoor structures.'
},

[FloraType.FeatherMoss]: {
  id: FloraType.FeatherMoss,
  biome: BiomeType.Taiga,
  uses: [FloraUseType.Insulation],
  description: 'Used for insulation, bedding, and wound dressing.'
},

[FloraType.LabradorTea]: {
  id: FloraType.LabradorTea,
  biome: BiomeType.Taiga,
  uses: [FloraUseType.Medicine],
  description: 'Aromatic shrub used in medicinal teas.'
},

[FloraType.Lingonberry]: {
  id: FloraType.Lingonberry,
  biome: BiomeType.Taiga,
  uses: [FloraUseType.Food, FloraUseType.Trade],
  description: 'Preservable berry rich in acids and nutrients.'
},

[FloraType.Blueberry]: {
  id: FloraType.Blueberry,
  biome: BiomeType.Taiga,
  uses: [FloraUseType.Food, FloraUseType.Trade],
  description: 'Sweet berry eaten fresh or dried.'
},

[FloraType.BogCranberry]: {
  id: FloraType.BogCranberry,
  biome: BiomeType.Taiga,
  uses: [FloraUseType.Food, FloraUseType.Trade],
  description: 'Tart berry valued for preservation and medicine.'
},

[FloraType.CloudberryTaiga]: {
  id: FloraType.CloudberryTaiga,
  biome: BiomeType.Taiga,
  uses: [FloraUseType.Food, FloraUseType.Trade],
  description: 'Rare, nutrient-rich berry with high trade value.'
},

[FloraType.BearberryTaiga]: {
  id: FloraType.BearberryTaiga,
  biome: BiomeType.Taiga,
  uses: [FloraUseType.Food, FloraUseType.Medicine],
  description: 'Edible berries and medicinal leaves.'
},

[FloraType.WillowShrub]: {
  id: FloraType.WillowShrub,
  biome: BiomeType.Taiga,
  uses: [FloraUseType.Medicine, FloraUseType.Material],
  description: 'Flexible wood and natural pain-relieving bark.'
},

[FloraType.DwarfBirchTaiga]: {
  id: FloraType.DwarfBirchTaiga,
  biome: BiomeType.Taiga,
  uses: [FloraUseType.Fuel, FloraUseType.Material],
  description: 'Shrub birch used for fuel, tools, and bark products.'
},

[FloraType.Horsetail]: {
  id: FloraType.Horsetail,
  biome: BiomeType.Taiga,
  uses: [FloraUseType.Medicine, FloraUseType.Industry],
  description: 'Silica-rich plant used for polishing and medicine.'
},

[FloraType.Clubmoss]: {
  id: FloraType.Clubmoss,
  biome: BiomeType.Taiga,
  uses: [FloraUseType.Medicine, FloraUseType.Industry],
  description: 'Spores historically used for flash powder and coatings.'
},

[FloraType.Wintergreen]: {
  id: FloraType.Wintergreen,
  biome: BiomeType.Taiga,
  uses: [FloraUseType.Medicine],
  description: 'Source of methyl salicylate used for pain relief.'
},

[FloraType.PineGrass]: {
  id: FloraType.PineGrass,
  biome: BiomeType.Taiga,
  uses: [FloraUseType.Fodder],
  description: 'Forest grass grazed by livestock and wildlife.'
},

[FloraType.BogSedge]: {
  id: FloraType.BogSedge,
  biome: BiomeType.Taiga,
  uses: [FloraUseType.Material],
  description: 'Fibrous sedge used for rope and matting.'
},

[FloraType.TaigaMushrooms]: {
  id: FloraType.TaigaMushrooms,
  biome: BiomeType.Taiga,
  uses: [FloraUseType.Food, FloraUseType.Trade],
  description: 'Edible forest fungi harvested seasonally.'
},

[FloraType.ResinPine]: {
  id: FloraType.ResinPine,
  biome: BiomeType.Taiga,
  uses: [FloraUseType.Industry, FloraUseType.Trade],
  description: 'Produces resin for pitch, waterproofing, and adhesives.'
},
[FloraType.SaguaroCactus]: {
  id: FloraType.SaguaroCactus,
  biome: BiomeType.Desert,
  uses: [FloraUseType.Food, FloraUseType.Material],
  description: 'Provides edible fruit and woody ribs used in construction.'
},

[FloraType.PricklyPear]: {
  id: FloraType.PricklyPear,
  biome: BiomeType.Desert,
  uses: [FloraUseType.Food, FloraUseType.Medicine],
  description: 'Edible pads and fruit used as food and blood-sugar medicine.'
},

[FloraType.BarrelCactus]: {
  id: FloraType.BarrelCactus,
  biome: BiomeType.Desert,
  uses: [FloraUseType.Water, FloraUseType.Food],
  description: 'Emergency water source and edible seeds.'
},

[FloraType.ChollaCactus]: {
  id: FloraType.ChollaCactus,
  biome: BiomeType.Desert,
  uses: [FloraUseType.Food, FloraUseType.Material],
  description: 'Edible buds and woody skeletons for tools.'
},

[FloraType.CreosoteBush]: {
  id: FloraType.CreosoteBush,
  biome: BiomeType.Desert,
  uses: [FloraUseType.Medicine],
  description: 'Potent medicinal shrub with antimicrobial properties.'
},

[FloraType.JoshuaTree]: {
  id: FloraType.JoshuaTree,
  biome: BiomeType.Desert,
  uses: [FloraUseType.Material, FloraUseType.Construction],
  description: 'Fibrous wood used for building and cordage.'
},

[FloraType.Mesquite]: {
  id: FloraType.Mesquite,
  biome: BiomeType.Desert,
  uses: [FloraUseType.Food, FloraUseType.Fuel],
  description: 'Pods ground into flour; wood used for charcoal.'
},

[FloraType.DesertSage]: {
  id: FloraType.DesertSage,
  biome: BiomeType.Desert,
  uses: [FloraUseType.Medicine, FloraUseType.Ritual],
  description: 'Aromatic herb used for healing and purification.'
},

[FloraType.Yucca]: {
  id: FloraType.Yucca,
  biome: BiomeType.Desert,
  uses: [FloraUseType.Food, FloraUseType.Material],
  description: 'Roots used for soap; flowers and fruit edible.'
},

[FloraType.Agave]: {
  id: FloraType.Agave,
  biome: BiomeType.Desert,
  uses: [FloraUseType.Food, FloraUseType.Industry, FloraUseType.Trade],
  description: 'Source of sweet sap, fibers, and fermented beverages.'
},

[FloraType.Ocotillo]: {
  id: FloraType.Ocotillo,
  biome: BiomeType.Desert,
  uses: [FloraUseType.Material],
  description: 'Flexible canes used for fencing and shelter frames.'
},

[FloraType.Brittlebush]: {
  id: FloraType.Brittlebush,
  biome: BiomeType.Desert,
  uses: [FloraUseType.Medicine],
  description: 'Resin used for pain relief and incense.'
},

[FloraType.DesertMarigold]: {
  id: FloraType.DesertMarigold,
  biome: BiomeType.Desert,
  uses: [FloraUseType.Medicine],
  description: 'Used in teas for digestive and respiratory issues.'
},

[FloraType.DesertLupine]: {
  id: FloraType.DesertLupine,
  biome: BiomeType.Desert,
  uses: [FloraUseType.Fertilizer],
  description: 'Nitrogen-fixing plant improving desert soils.'
},

[FloraType.DesertPoppy]: {
  id: FloraType.DesertPoppy,
  biome: BiomeType.Desert,
  uses: [FloraUseType.Medicine],
  description: 'Mild sedative and pain-relieving herb.'
},

[FloraType.SaltDesertbush]: {
  id: FloraType.SaltDesertbush,
  biome: BiomeType.Desert,
  uses: [FloraUseType.Fodder],
  description: 'Salt-tolerant shrub grazed by desert livestock.'
},

[FloraType.DesertGrass]: {
  id: FloraType.DesertGrass,
  biome: BiomeType.Desert,
  uses: [FloraUseType.Fodder],
  description: 'Sparse grass supporting grazing animals.'
},

[FloraType.Aloe]: {
  id: FloraType.Aloe,
  biome: BiomeType.Desert,
  uses: [FloraUseType.Medicine, FloraUseType.Trade],
  description: 'Gel used for burns, skin care, and trade goods.'
},

[FloraType.IceDesertPlant]: {
  id: FloraType.IceDesertPlant,
  biome: BiomeType.Desert,
  uses: [FloraUseType.Food],
  description: 'Succulent leaves eaten fresh in arid climates.'
},

[FloraType.SandVerbenaDesert]: {
  id: FloraType.SandVerbenaDesert,
  biome: BiomeType.Desert,
  uses: [FloraUseType.Medicine],
  description: 'Used in treatments for fever and inflammation.'
},

[FloraType.KapokTree]: {
  id: FloraType.KapokTree,
  biome: BiomeType.Rainforest,
  uses: [FloraUseType.Material, FloraUseType.Trade],
  description: 'Produces lightweight fiber used for stuffing and insulation.'
},

[FloraType.Mahogany]: {
  id: FloraType.Mahogany,
  biome: BiomeType.Rainforest,
  uses: [FloraUseType.Construction, FloraUseType.Trade],
  description: 'Highly valued hardwood used in fine construction.'
},

[FloraType.RubberTree]: {
  id: FloraType.RubberTree,
  biome: BiomeType.Rainforest,
  uses: [FloraUseType.Industry, FloraUseType.Trade],
  description: 'Source of latex used in rubber production.'
},

[FloraType.StranglerFig]: {
  id: FloraType.StranglerFig,
  biome: BiomeType.Rainforest,
  uses: [FloraUseType.Food],
  description: 'Produces abundant fruit supporting dense populations.'
},

[FloraType.FigTreeRainforest]: {
  id: FloraType.FigTreeRainforest,
  biome: BiomeType.Rainforest,
  uses: [FloraUseType.Food, FloraUseType.Trade],
  description: 'Fruit-bearing tree cultivated near settlements.'
},

[FloraType.BananaPlant]: {
  id: FloraType.BananaPlant,
  biome: BiomeType.Rainforest,
  uses: [FloraUseType.Food],
  description: 'Staple carbohydrate crop with year-round harvest.'
},

[FloraType.CocoaTree]: {
  id: FloraType.CocoaTree,
  biome: BiomeType.Rainforest,
  uses: [FloraUseType.Food, FloraUseType.Trade],
  description: 'Seeds processed into cocoa and chocolate.'
},

[FloraType.CoffeePlant]: {
  id: FloraType.CoffeePlant,
  biome: BiomeType.Rainforest,
  uses: [FloraUseType.Food, FloraUseType.Trade],
  description: 'Beans used to produce stimulant beverages.'
},

[FloraType.Orchids]: {
  id: FloraType.Orchids,
  biome: BiomeType.Rainforest,
  uses: [FloraUseType.Trade, FloraUseType.Ritual],
  description: 'Decorative and ceremonial flowers with high value.'
},

[FloraType.Bromeliads]: {
  id: FloraType.Bromeliads,
  biome: BiomeType.Rainforest,
  uses: [FloraUseType.Water, FloraUseType.Material],
  description: 'Collect rainwater and provide fibers.'
},

[FloraType.Heliconia]: {
  id: FloraType.Heliconia,
  biome: BiomeType.Rainforest,
  uses: [FloraUseType.Trade],
  description: 'Bright flowering plant used in ornamentation.'
},

[FloraType.BambooRainforest]: {
  id: FloraType.BambooRainforest,
  biome: BiomeType.Rainforest,
  uses: [FloraUseType.Construction, FloraUseType.Material],
  description: 'Fast-growing structural material for tools and buildings.'
},

[FloraType.TreeFern]: {
  id: FloraType.TreeFern,
  biome: BiomeType.Rainforest,
  uses: [FloraUseType.Material],
  description: 'Fibrous trunk used for containers and planting beds.'
},

[FloraType.Lianas]: {
  id: FloraType.Lianas,
  biome: BiomeType.Rainforest,
  uses: [FloraUseType.Material],
  description: 'Woody vines harvested for rope and binding.'
},

[FloraType.MossRainforest]: {
  id: FloraType.MossRainforest,
  biome: BiomeType.Rainforest,
  uses: [FloraUseType.Insulation],
  description: 'Used for packing, bedding, and wound care.'
},

[FloraType.Epiphytes]: {
  id: FloraType.Epiphytes,
  biome: BiomeType.Rainforest,
  uses: [FloraUseType.Medicine],
  description: 'Medicinal plants growing on trees.'
},

[FloraType.PitcherPlant]: {
  id: FloraType.PitcherPlant,
  biome: BiomeType.Rainforest,
  uses: [FloraUseType.Medicine],
  description: 'Used in digestive and antiparasitic treatments.'
},

[FloraType.VanillaOrchid]: {
  id: FloraType.VanillaOrchid,
  biome: BiomeType.Rainforest,
  uses: [FloraUseType.Food, FloraUseType.Trade],
  description: 'Produces vanilla pods used as flavoring.'
},

[FloraType.PalmTree]: {
  id: FloraType.PalmTree,
  biome: BiomeType.Rainforest,
  uses: [FloraUseType.Food, FloraUseType.Material],
  description: 'Provides fruit, oil, leaves, and construction materials.'
},

[FloraType.MedicinalVines]: {
  id: FloraType.MedicinalVines,
  biome: BiomeType.Rainforest,
  uses: [FloraUseType.Medicine, FloraUseType.Trade],
  description: 'Potent vines harvested for complex medicinal compounds.'
},
[FloraType.PrairieGrass]: {
  id: FloraType.PrairieGrass,
  biome: BiomeType.Grassland,
  uses: [FloraUseType.Fodder],
  description: 'Dominant grazing grass supporting large herbivores.'
},

[FloraType.BuffaloGrass]: {
  id: FloraType.BuffaloGrass,
  biome: BiomeType.Grassland,
  uses: [FloraUseType.Fodder],
  description: 'Low-growing grass resilient to drought and grazing.'
},

[FloraType.Switchgrass]: {
  id: FloraType.Switchgrass,
  biome: BiomeType.Grassland,
  uses: [FloraUseType.Fuel, FloraUseType.Material],
  description: 'Tall grass used for biofuel, thatch, and fiber.'
},

[FloraType.BigBluestem]: {
  id: FloraType.BigBluestem,
  biome: BiomeType.Grassland,
  uses: [FloraUseType.Fodder],
  description: 'High-yield pasture grass used for hay.'
},

[FloraType.LittleBluestem]: {
  id: FloraType.LittleBluestem,
  biome: BiomeType.Grassland,
  uses: [FloraUseType.Fodder],
  description: 'Cold- and drought-tolerant grazing grass.'
},

[FloraType.RyeGrass]: {
  id: FloraType.RyeGrass,
  biome: BiomeType.Grassland,
  uses: [FloraUseType.Food, FloraUseType.Fodder],
  description: 'Grain-producing grass cultivated for bread and feed.'
},

[FloraType.WildOats]: {
  id: FloraType.WildOats,
  biome: BiomeType.Grassland,
  uses: [FloraUseType.Food],
  description: 'Harvested grain used for porridge and flour.'
},

[FloraType.GrasslandClover]: {
  id: FloraType.GrasslandClover,
  biome: BiomeType.Grassland,
  uses: [FloraUseType.Fertilizer, FloraUseType.Fodder],
  description: 'Nitrogen-fixing plant improving pasture quality.'
},

[FloraType.Dandelion]: {
  id: FloraType.Dandelion,
  biome: BiomeType.Grassland,
  uses: [FloraUseType.Food, FloraUseType.Medicine],
  description: 'Leaves and roots eaten and used in tonics.'
},

[FloraType.Milkweed]: {
  id: FloraType.Milkweed,
  biome: BiomeType.Grassland,
  uses: [FloraUseType.Material, FloraUseType.Medicine],
  description: 'Produces fiber and medicinal sap.'
},

[FloraType.PrairieSunflower]: {
  id: FloraType.PrairieSunflower,
  biome: BiomeType.Grassland,
  uses: [FloraUseType.Food],
  description: 'Oil-rich seeds harvested for food.'
},

[FloraType.Goldenrod]: {
  id: FloraType.Goldenrod,
  biome: BiomeType.Grassland,
  uses: [FloraUseType.Medicine],
  description: 'Used in teas for inflammation and infection.'
},

[FloraType.Coneflower]: {
  id: FloraType.Coneflower,
  biome: BiomeType.Grassland,
  uses: [FloraUseType.Medicine],
  description: 'Immune-boosting medicinal plant.'
},

[FloraType.PrairieViolet]: {
  id: FloraType.PrairieViolet,
  biome: BiomeType.Grassland,
  uses: [FloraUseType.Medicine],
  description: 'Used in soothing syrups and teas.'
},

[FloraType.WildCarrot]: {
  id: FloraType.WildCarrot,
  biome: BiomeType.Grassland,
  uses: [FloraUseType.Food],
  description: 'Edible root plant, ancestor of cultivated carrots.'
},

[FloraType.PrairieSage]: {
  id: FloraType.PrairieSage,
  biome: BiomeType.Grassland,
  uses: [FloraUseType.Medicine, FloraUseType.Ritual],
  description: 'Aromatic herb used in medicine and cleansing.'
},

[FloraType.Thistle]: {
  id: FloraType.Thistle,
  biome: BiomeType.Grassland,
  uses: [FloraUseType.Medicine],
  description: 'Seeds and roots used in liver remedies.'
},

[FloraType.Chicory]: {
  id: FloraType.Chicory,
  biome: BiomeType.Grassland,
  uses: [FloraUseType.Food, FloraUseType.Medicine],
  description: 'Roots roasted as coffee substitute; leaves edible.'
},

[FloraType.PrairieLupine]: {
  id: FloraType.PrairieLupine,
  biome: BiomeType.Grassland,
  uses: [FloraUseType.Fertilizer],
  description: 'Nitrogen-fixing wildflower improving soils.'
},

[FloraType.TallGrassMix]: {
  id: FloraType.TallGrassMix,
  biome: BiomeType.Grassland,
  uses: [FloraUseType.Fodder, FloraUseType.Material],
  description: 'Mixed grasses used for grazing and thatching.'
},
[FloraType.Oak]: {
  id: FloraType.Oak,
  biome: BiomeType.Woodland,
  uses: [FloraUseType.Construction, FloraUseType.Food],
  description: 'Produces strong timber and edible acorns.'
},

[FloraType.Birch]: {
  id: FloraType.Birch,
  biome: BiomeType.Woodland,
  uses: [FloraUseType.Material, FloraUseType.Medicine],
  description: 'Bark used for containers and medicinal extracts.'
},

[FloraType.Maple]: {
  id: FloraType.Maple,
  biome: BiomeType.Woodland,
  uses: [FloraUseType.Food],
  description: 'Sap collected and boiled into syrup.'
},

[FloraType.Aspen]: {
  id: FloraType.Aspen,
  biome: BiomeType.Woodland,
  uses: [FloraUseType.Material],
  description: 'Lightweight wood used for tools and panels.'
},

[FloraType.Hazel]: {
  id: FloraType.Hazel,
  biome: BiomeType.Woodland,
  uses: [FloraUseType.Food],
  description: 'Nut-bearing shrub cultivated for food.'
},

[FloraType.Hawthorn]: {
  id: FloraType.Hawthorn,
  biome: BiomeType.Woodland,
  uses: [FloraUseType.Medicine],
  description: 'Heart-strengthening medicinal berries.'
},

[FloraType.Rowan]: {
  id: FloraType.Rowan,
  biome: BiomeType.Woodland,
  uses: [FloraUseType.Food, FloraUseType.Ritual],
  description: 'Berries used in preserves and protective charms.'
},

[FloraType.Elderberry]: {
  id: FloraType.Elderberry,
  biome: BiomeType.Woodland,
  uses: [FloraUseType.Food, FloraUseType.Medicine],
  description: 'Berries and flowers used in syrups and remedies.'
},

[FloraType.Brambles]: {
  id: FloraType.Brambles,
  biome: BiomeType.Woodland,
  uses: [FloraUseType.Food],
  description: 'Produces berries such as blackberries and raspberries.'
},

[FloraType.WoodlandFerns]: {
  id: FloraType.WoodlandFerns,
  biome: BiomeType.Woodland,
  uses: [FloraUseType.Food],
  description: 'Young fronds eaten as seasonal vegetables.'
},

[FloraType.WoodlandMoss]: {
  id: FloraType.WoodlandMoss,
  biome: BiomeType.Woodland,
  uses: [FloraUseType.Insulation],
  description: 'Used for packing, bedding, and wound care.'
},

[FloraType.WildGarlic]: {
  id: FloraType.WildGarlic,
  biome: BiomeType.Woodland,
  uses: [FloraUseType.Food],
  description: 'Strongly flavored leaves and bulbs used in cooking.'
},

[FloraType.Bluebells]: {
  id: FloraType.Bluebells,
  biome: BiomeType.Woodland,
  uses: [FloraUseType.Ritual],
  description: 'Culturally significant flowers used in rites.'
},

[FloraType.WoodAnemone]: {
  id: FloraType.WoodAnemone,
  biome: BiomeType.Woodland,
  uses: [FloraUseType.Medicine],
  description: 'Used externally in traditional medicine.'
},

[FloraType.Ivy]: {
  id: FloraType.Ivy,
  biome: BiomeType.Woodland,
  uses: [FloraUseType.Material, FloraUseType.Medicine],
  description: 'Fibers used for binding; leaves used medicinally.'
},

[FloraType.Honeysuckle]: {
  id: FloraType.Honeysuckle,
  biome: BiomeType.Woodland,
  uses: [FloraUseType.Food, FloraUseType.Medicine],
  description: 'Edible nectar and medicinal flowers.'
},

[FloraType.WoodlandGrass]: {
  id: FloraType.WoodlandGrass,
  biome: BiomeType.Woodland,
  uses: [FloraUseType.Fodder],
  description: 'Shaded grass used for grazing.'
},

[FloraType.Dogwood]: {
  id: FloraType.Dogwood,
  biome: BiomeType.Woodland,
  uses: [FloraUseType.Material],
  description: 'Hard wood used for tools and implements.'
},

[FloraType.Serviceberry]: {
  id: FloraType.Serviceberry,
  biome: BiomeType.Woodland,
  uses: [FloraUseType.Food],
  description: 'Sweet berries eaten fresh or dried.'
},

[FloraType.WoodlandSedge]: {
  id: FloraType.WoodlandSedge,
  biome: BiomeType.Woodland,
  uses: [FloraUseType.Material],
  description: 'Fibrous plant used for mats and weaving.'
},

[FloraType.ForestOak]: {
  id: FloraType.ForestOak,
  biome: BiomeType.Forest,
  uses: [FloraUseType.Construction, FloraUseType.Food],
  description: 'Large oak producing timber and acorns.'
},

[FloraType.ForestPine]: {
  id: FloraType.ForestPine,
  biome: BiomeType.Forest,
  uses: [FloraUseType.Construction, FloraUseType.Fuel],
  description: 'Common conifer used for lumber and firewood.'
},

[FloraType.Beech]: {
  id: FloraType.Beech,
  biome: BiomeType.Forest,
  uses: [FloraUseType.Construction, FloraUseType.Food],
  description: 'Produces dense wood and edible nuts.'
},

[FloraType.ForestMaple]: {
  id: FloraType.ForestMaple,
  biome: BiomeType.Forest,
  uses: [FloraUseType.Food, FloraUseType.Material],
  description: 'Sap for syrup and wood for furniture.'
},

[FloraType.Cedar]: {
  id: FloraType.Cedar,
  biome: BiomeType.Forest,
  uses: [FloraUseType.Construction, FloraUseType.Medicine],
  description: 'Rot-resistant wood and aromatic oils.'
},

[FloraType.ForestSpruce]: {
  id: FloraType.ForestSpruce,
  biome: BiomeType.Forest,
  uses: [FloraUseType.Construction, FloraUseType.Fuel],
  description: 'Tall conifer used for beams and firewood.'
},

[FloraType.ForestFir]: {
  id: FloraType.ForestFir,
  biome: BiomeType.Forest,
  uses: [FloraUseType.Construction],
  description: 'Straight timber used in framing.'
},

[FloraType.Hemlock]: {
  id: FloraType.Hemlock,
  biome: BiomeType.Forest,
  uses: [FloraUseType.Industry],
  description: 'Bark used in tanning leather.'
},

[FloraType.ForestFerns]: {
  id: FloraType.ForestFerns,
  biome: BiomeType.Forest,
  uses: [FloraUseType.Food],
  description: 'Edible fiddleheads harvested seasonally.'
},

[FloraType.ForestMoss]: {
  id: FloraType.ForestMoss,
  biome: BiomeType.Forest,
  uses: [FloraUseType.Insulation],
  description: 'Used for bedding and wound care.'
},

[FloraType.ForestLichens]: {
  id: FloraType.ForestLichens,
  biome: BiomeType.Forest,
  uses: [FloraUseType.Dye],
  description: 'Source of natural dyes.'
},

[FloraType.UnderstoryShrubs]: {
  id: FloraType.UnderstoryShrubs,
  biome: BiomeType.Forest,
  uses: [FloraUseType.Food],
  description: 'Mixed shrubs producing berries and edible shoots.'
},

[FloraType.Holly]: {
  id: FloraType.Holly,
  biome: BiomeType.Forest,
  uses: [FloraUseType.Ritual],
  description: 'Symbolic evergreen used in ceremonies.'
},

[FloraType.Yew]: {
  id: FloraType.Yew,
  biome: BiomeType.Forest,
  uses: [FloraUseType.Medicine, FloraUseType.Material],
  description: 'Source of potent medicines and durable wood.'
},

[FloraType.ForestIvy]: {
  id: FloraType.ForestIvy,
  biome: BiomeType.Forest,
  uses: [FloraUseType.Material],
  description: 'Climbing plant used for binding and rope.'
},

[FloraType.Bracken]: {
  id: FloraType.Bracken,
  biome: BiomeType.Forest,
  uses: [FloraUseType.Fuel],
  description: 'Dried fronds used as fuel and bedding.'
},

[FloraType.WildMushroomsForest]: {
  id: FloraType.WildMushroomsForest,
  biome: BiomeType.Forest,
  uses: [FloraUseType.Food, FloraUseType.Trade],
  description: 'Seasonal edible fungi with trade value.'
},

[FloraType.ForestWildflowers]: {
  id: FloraType.ForestWildflowers,
  biome: BiomeType.Forest,
  uses: [FloraUseType.Medicine],
  description: 'Mixed medicinal flowers harvested in spring.'
},

[FloraType.ForestGrass]: {
  id: FloraType.ForestGrass,
  biome: BiomeType.Forest,
  uses: [FloraUseType.Fodder],
  description: 'Shaded grass grazed by forest animals.'
},

[FloraType.CanopyVines]: {
  id: FloraType.CanopyVines,
  biome: BiomeType.Forest,
  uses: [FloraUseType.Material],
  description: 'Strong vines used for rope and construction binding.'
}

};
