import seedrandom from "seedrandom";
import type { Era } from "./goods.model";

type EraTheme =
  | "mythic"
  | "heroic"
  | "ancient"
  | "magitech"
  | "industrial"
  | "modern"
  | "collapse"
  | "renewal"
  | "cosmic"
  | "alien";

interface EraSyllablePool {
  leadingEndings: string[];
  trailingFragments: string[];
  connectors?: string[];
}

export interface EraSuffixOptions {
  era: Era;
  seed: string;
  culture?: string;
}

const themeLookup = new Map<string, EraTheme>();

const eraThemes: Record<EraTheme, string[]> = {
  mythic: [
    "Primordial",
    "Elemental",
    "Celestial",
    "Titanic",
    "Arcane",
    "Legendary",
    "Draconic",
    "Fabled",
    "Ethereal",
    "Chimeric",
  ],
  heroic: [
    "Heroic",
    "Runic",
    "Warlike",
    "Sovereign",
    "Knightly",
    "Crowned",
    "Bannered",
    "Spellbound",
    "Dragonborn",
    "Crystaline",
  ],
  ancient: [
    "Obsidian",
    "Ambered",
    "Jade",
    "Sunlit",
    "Marble",
    "Ivoryed",
    "Golden",
    "Sandstone",
    "Sapphire",
    "Ironbound",
  ],
  magitech: [
    "Etheric",
    "Clockwork",
    "Steamforged",
    "Gearbound",
    "Runeforged",
    "Brassic",
    "ArcLinked",
    "Sparked",
    "Cindric",
    "Fulgent",
  ],
  industrial: [
    "Industrial",
    "Mechanized",
    "Smokeforged",
    "Ironclad",
    "Steelbound",
    "Riveted",
    "Ashen",
    "Forged",
    "Wired",
    "Machined",
  ],
  modern: [
    "Modern",
    "NeonLit",
    "Chromed",
    "Networked",
    "Digital",
    "Electric",
    "Polychrome",
    "Broadcast",
    "Urbanic",
    "WiredModern",
  ],
  collapse: [
    "Cataclysmic",
    "Blighted",
    "Broken",
    "Crimsoned",
    "Shattered",
    "Forsaken",
    "Rusted",
    "Obscured",
    "Dimming",
  ],
  renewal: [
    "Verdant",
    "Reclaimed",
    "Blooming",
    "Greened",
    "Freshbound",
    "Renewed",
    "Reforged",
    "Sprouting",
    "Restorative",
    "Hearthborn",
  ],
  cosmic: [
    "Stellar",
    "Solar",
    "Astral",
    "Warpborn",
    "Pulsaric",
    "Nebular",
    "Helionic",
    "Voidbound",
    "Starforged",
    "Galaxic",
  ],
  alien: [
    "Alienic",
    "Xenoic",
    "Fractal",
    "Dimensional",
    "Multiversal",
    "Quantum",
    "Extradimensional",
    "Transcendent",
    "Hybridic",
    "Otherworldly",
  ],
};

Object.entries(eraThemes).forEach(([theme, eras]) => {
  eras.forEach((era) => themeLookup.set(era, theme as EraTheme));
});

const defaultPool: EraSyllablePool = {
  leadingEndings: ["ar", "en", "ir", "or", "eth", "ian", "elle"],
  trailingFragments: ["haven", "spire", "reach", "ward", "crest", "hold"],
  connectors: ["", "-"],
};

const pools: Record<EraTheme, EraSyllablePool> = {
  mythic: {
    leadingEndings: ["ar", "wyn", "eth", "iel", "orin", "ara", "oril"],
    trailingFragments: ["veil", "grove", "song", "hollow", "glade", "spire", "bloom"],
    connectors: ["", "-"],
  },
  heroic: {
    leadingEndings: ["an", "or", "helm", "erian", "ald", "avar", "eron"],
    trailingFragments: ["keep", "march", "banner", "crown", "watch", "bastion", "spear"],
    connectors: ["-", ""],
  },
  ancient: {
    leadingEndings: ["ora", "ara", "yra", "yad", "eron", "yss", "alon"],
    trailingFragments: ["polis", "forum", "basil", "arch", "hall", "causeway", "vault"],
    connectors: ["", "-"],
  },
  magitech: {
    leadingEndings: ["yxis", "exis", "yra", "ara", "enx", "yron", "yte"],
    trailingFragments: ["forge", "loom", "coil", "spark", "matrix", "gear", "circuit"],
    connectors: ["-", ""],
  },
  industrial: {
    leadingEndings: ["rail", "ast", "erra", "iron", "ind", "elth", "arth"],
    trailingFragments: ["mill", "works", "stack", "yard", "rail", "smoke", "lathe"],
    connectors: ["", "-"],
  },
  modern: {
    leadingEndings: ["ex", "aia", "en", "elix", "yron", "ion", "ara"],
    trailingFragments: ["grid", "plex", "nexus", "link", "district", "sector", "array"],
    connectors: ["", "-"],
  },
  collapse: {
    leadingEndings: ["ash", "grim", "scar", "dreg", "ruin", "husk", "morrow"],
    trailingFragments: ["waste", "hollow", "fall", "rift", "scar", "grave", "blight"],
    connectors: ["", "-"],
  },
  renewal: {
    leadingEndings: ["aran", "ellen", "iver", "olan", "aranth", "elen", "avel"],
    trailingFragments: ["grove", "garden", "reach", "hearth", "spring", "terrace", "bloom"],
    connectors: ["", "-"],
  },
  cosmic: {
    leadingEndings: ["astra", "ion", "ely", "yrix", "orin", "eon", "uine"],
    trailingFragments: ["orbit", "void", "nova", "pylon", "station", "eclipse", "drift"],
    connectors: ["", "-"],
  },
  alien: {
    leadingEndings: ["yth", "xil", "qir", "ul", "oth", "ezz", "ael"],
    trailingFragments: ["spire", "husk", "node", "sprawl", "myriad", "fold", "lattice"],
    connectors: ["", "-"],
  },
};

export class EraSuffixGenerator {
  static generateSuffix(options: EraSuffixOptions): string {
    const { era, seed, culture } = options;
    const baseLetter = EraSuffixGenerator.extractBaseLetter(culture, era);
    const pool = pools[themeLookup.get(era) ?? "mythic"] ?? defaultPool;
    const lead = EraSuffixGenerator.pickAlliterativeLead(baseLetter, pool, seed, era, culture);
    const connector = EraSuffixGenerator.pickConnector(pool, seed, era, culture);
    const trailing = EraSuffixGenerator.pickTrailing(pool, seed, era, culture);

    return `${lead}${connector}${trailing}`;
  }

  private static extractBaseLetter(culture: string | undefined, era: Era): string {
    const baseFromCulture = culture?.match(/[a-zA-Z]/)?.[0];
    if (baseFromCulture) {
      return baseFromCulture.toLowerCase();
    }
    return era.charAt(0).toLowerCase();
  }

  private static pickAlliterativeLead(
    baseLetter: string,
    pool: EraSyllablePool,
    seed: string,
    era: Era,
    culture?: string
  ): string {
    const endings = (pool.leadingEndings.length ? pool.leadingEndings : defaultPool.leadingEndings).map((ending) =>
      ending.startsWith(baseLetter) ? ending.slice(1) : ending
    );
    const candidates = endings.map((ending) => `${baseLetter}${ending}`);
    const rng = seedrandom(`${seed}-lead-${culture ?? "anon"}-${era}`);
    return candidates[Math.floor(rng() * candidates.length)];
  }

  private static pickTrailing(pool: EraSyllablePool, seed: string, era: Era, culture?: string): string {
    const trailingPool = pool.trailingFragments.length ? pool.trailingFragments : defaultPool.trailingFragments;
    const rng = seedrandom(`${seed}-trail-${culture ?? "anon"}-${era}`);
    return trailingPool[Math.floor(rng() * trailingPool.length)];
  }

  private static pickConnector(pool: EraSyllablePool, seed: string, era: Era, culture?: string): string {
    const connectors = pool.connectors ?? defaultPool.connectors ?? [""];
    const rng = seedrandom(`${seed}-connector-${culture ?? "anon"}-${era}`);
    return connectors[Math.floor(rng() * connectors.length)];
  }
}
