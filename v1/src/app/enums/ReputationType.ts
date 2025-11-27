export enum ReputationType {
  Trading = "trading",
  Military = "military",
  Diplomatic = "diplomatic",
  Religious = "religious",
  Criminal = "criminal",
  Scholarly = "scholarly",
  Social = "social"
}

export enum ReputationLevel {
  Despised = "despised",      // -100 to -75
  Hated = "hated",           // -75 to -50
  Disliked = "disliked",     // -50 to -25
  Unknown = "unknown",        // -25 to 25
  Liked = "liked",           // 25 to 50
  Respected = "respected",    // 50 to 75
  Revered = "revered",       // 75 to 100
  Legendary = "legendary"     // 100+
}

export enum SocialStatus {
  Peasant = "peasant",
  Commoner = "commoner",
  Merchant = "merchant",
  Burgher = "burgher",
  Noble = "noble",
  Lord = "lord",
  Duke = "duke",
  King = "king"
}
