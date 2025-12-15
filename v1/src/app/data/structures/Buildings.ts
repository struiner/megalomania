import { Injectable } from "@angular/core";
import { StructureAction } from "../../enums/StructureActions";
import { GoodsType } from "../../enums/GoodsType";
import { StructureType } from "../../enums/StructureType";
import { StructureEffect } from "../../enums/StructureEffect";


interface Effect {
    name: string;
    consumption: Record<string, number>;
    results: Record<string, number>
}

interface Process {
    name: string;
    input:Record<string,number>;
    output:Record<string,number>;
    time: number;
}

interface Building {
    name: string;
    actions: StructureAction[];
    recipe: {
        ingredients: Record<string, number>;
        time: number;
    },
    effects: Effect[],
    production: Process[]
}

// Helper function to create placeholder buildings
function createPlaceholderBuilding(name: string): Building {
    return {
        name,
        actions: [],
        recipe: {
            ingredients: { [GoodsType.Wood]: 100 },
            time: 10
        },
        effects: [],
        production: []
    };
}

@Injectable({ providedIn: 'root' })
export class Buildings {
  private meta: { [key in StructureType]: Building } = {
      [StructureType.Bank]: {
          name: 'Bank',
          actions: [
              StructureAction.ManageLoans,
              StructureAction.ManageBonds,
              StructureAction.ManageAccounts,
          ],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 1000,
                  [GoodsType.Brick]: 1000,
                  [GoodsType.Steel]: 200,
                  [GoodsType.MetalGoods]: 200,
                  [GoodsType.Paper]: 500,
              },
              time: 500,
          },
          effects: [{
              name: "Increased Prosperity",
              consumption: {
                  [GoodsType.Paper]: 8
              },
              results: {
                  [StructureEffect.ProsperityMultiplier]: 1.2,
              }
          }],
          production: []
      },
      [StructureType.House]: {
          name: 'House',
          actions: [
              StructureAction.LeaseProperty,
              StructureAction.SellProperty,
          ],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 100,
                  [GoodsType.Brick]: 100,
                  [GoodsType.MetalGoods]: 20,
                  [GoodsType.Cloth]: 50,
              },
              time: 50,
          },
          effects: [{
              name: "Modest Housing",
              consumption: {
                  [GoodsType.Wood]: 0.1,
                  [GoodsType.Brick]: 0.1,
              },
              results: {
                  [StructureEffect.HousingIncrease]: 10,
              }
          }],
          production: []
      },
      [StructureType.Hut]: {
          name: 'Hut',
          actions: [],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 50,
              },
              time: 6,
          },
          effects: [{
              name: "Poor Housing",
              consumption: {},
              results: {
                  [StructureEffect.HousingIncrease]: 2,
              }
          }],
          production: []
      },
      [StructureType.Well]: {
          name: 'Well',
          actions: [],
          recipe: {
              ingredients: {
                  [GoodsType.Brick]: 50,
              },
              time: 12,
          },
          effects: [{
              name: "Drinking Water",
              consumption: {},
              results: {
                  [StructureEffect.WaterAccess]: 10,
              }
          }, {
              name: "Fire Safety",
              consumption: {},
              results: {
                  [StructureEffect.FireRiskReduction]: 10,
              }
          }],
          production: []
      },
      [StructureType.Woodcutter]: {
          name: 'Woodcutter',
          actions: [],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 150,
                  [GoodsType.Brick]: 100,
                  [GoodsType.MetalGoods]: 10,
              },
              time: 12,
          },
          effects: [{
              name: "Lumberjack Housing",
              consumption: {
                  [GoodsType.Wood]: 0.1,
                  [GoodsType.MetalGoods]: 0.05,
              },
              results: {
                  [StructureEffect.HousingIncrease]: 4,
              }
          }],
          production: [{
              name: "",
              input: {},
              output: { 'Wood': 5 },
              time: 12
          }]
      },
      [StructureType.Windmill]: {
          name: 'Windmill',
          actions: [],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 200,
                  [GoodsType.Brick]: 100,
                  [GoodsType.MetalGoods]: 20,
              },
              time: 24,
          },
          effects: [{
              name: "Miller Housing",
              consumption: {
                  [GoodsType.Wood]: 0.2,
                  [GoodsType.MetalGoods]: 0.1,
              },
              results: {
                  [StructureEffect.HousingIncrease]: 4,
              }
          }, {
              name: "Flour Production",
              consumption: {
                  [GoodsType.Grain]: 30,
              },
              results: {
                  [StructureEffect.FoodProductionBoost]: 60,
              }
          }],
          production: [],
      },
      [StructureType.Barn]: {
          name: 'Barn',
          actions: [],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 150,
                  [GoodsType.MetalGoods]: 5,
              },
              time: 12,
          },
          effects: [{
              name: "Storage",
              consumption: {
                  [GoodsType.Wood]: 0.1,
              },
              results: {
                  [StructureEffect.StorageIncrease]: 50,
              }
          }],
          production: [],
      },
      [StructureType.Market]: {
          name: 'Market',
          actions: [StructureAction.TradeGoods],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 250,
                  [GoodsType.Brick]: 150,
                  [GoodsType.MetalGoods]: 50,
              },
              time: 36,
          },
          effects: [{
              name: "Storage",
              consumption: {
                  [GoodsType.Wood]: 0.1,
              },
              results: {
                  [StructureEffect.StorageIncrease]: 250,
              }
          }],
          production: [],
      },
      [StructureType.Warehouse]: {
          name: 'Warehouse',
          actions: [],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 150,
                  [GoodsType.Brick]: 50,
                  [GoodsType.MetalGoods]: 10,
              },
              time: 36,
          },
          effects: [{
              name: "Storage",
              consumption: {
                  [GoodsType.Wood]: 0.1,
              },
              results: {
                  [StructureEffect.StorageIncrease]: 100,
              }
          }],
          production: [],
      },
      [StructureType.Docks]: {
    name: 'Docks',
    actions: [StructureAction.TradeGoods],
    recipe: {
        ingredients: {
            [GoodsType.Wood]: 500,
            [GoodsType.MetalGoods]: 100,
            [GoodsType.Brick]: 200
        },
        time: 100
    },
    effects: [{
        name: "Maritime Trade Boost",
        consumption: {},
        results: {
            [StructureEffect.TradeEfficiency]: 1.1,
        }
    }],
    production: []
},
[StructureType.Harbor]: {
    name: 'Harbor',
    actions: [StructureAction.BuildShips, StructureAction.Trade],
    recipe: {
        ingredients: {
            [GoodsType.Wood]: 300,
            [GoodsType.Brick]: 200
        },
        time: 24,
    },
    effects: [{
        name: "Trade Boost",
        results: {
            [StructureEffect.TradeEfficiency]: 0.15,
        },
        consumption: {}
    }],
    production: []
},

[StructureType.Tavern]: {
    name: 'Tavern',
    actions: [
        StructureAction.Gamble,
        StructureAction.SmuggleGoods,
        StructureAction.RecruitWorkers,
        StructureAction.HostEvent],
    recipe: {
        ingredients: {
            [GoodsType.Wood]: 150,
            [GoodsType.Brick]: 100,
        },
        time: 18,
    },
    effects: [{
        name: "Morale Boost",
        results: {
            [StructureEffect.HappinessMultiplier]: 1.1,
        },
        consumption: {}
    }],
    production: []
},

      [StructureType.Church]: {
    name: 'Church',
    actions: [
        StructureAction.Pray,
        StructureAction.PoorMeal,
        StructureAction.Donate],
    recipe: {
        ingredients: {
            [GoodsType.Wood]: 100,
            [GoodsType.Brick]: 400,
        },
        time: 18,
    },
    effects: [{
        name: "Morale Boost",
        results: {
            [StructureEffect.HappinessMultiplier]: 1.4,
        },
        consumption: {}
    }],
    production: []
},
      [StructureType.Cathedral]: {
    name: 'Cathedral',
    actions: [
        StructureAction.Pray,
        StructureAction.PoorMeal,
        StructureAction.Donate,
        StructureAction.IndulganceSale],
    recipe: {
        ingredients: {
            [GoodsType.Wood]: 200,
            [GoodsType.Brick]: 800,
            [GoodsType.Marble]: 400,
            [GoodsType.Glassware]: 100,
            [GoodsType.MetalGoods]: 50,
        },
        time: 18,
    },
    effects: [{
        name: "Morale Boost",
        results: {
            [StructureEffect.HappinessMultiplier]: 2,
        },
        consumption: {}
    }],
    production: []
},
      [StructureType.TownHall]: {
    name: 'Town Hall',
    actions: [
        StructureAction.BribeOfficials,
        StructureAction.GrantCharter,
        StructureAction.HoldCouncil,
        StructureAction.IssueDecree],
    recipe: {
        ingredients: {
            [GoodsType.Wood]: 200,
            [GoodsType.Brick]: 400,
            [GoodsType.Paper]: 50,
        },
        time: 18,
    },
    effects: [],
    production: []
},
      [StructureType.Palace]: {
    name: 'Palace',
    actions: [
        StructureAction.BribeOfficials,
        StructureAction.GrantCharter,
        StructureAction.HoldAudience,
        StructureAction.RequestAudience,
        StructureAction.IssueDecree],
    recipe: {
        ingredients: {
            [GoodsType.Wood]: 200,
            [GoodsType.Brick]: 400,
            [GoodsType.Marble]: 800,
            [GoodsType.MetalGoods]: 50,
        },
        time: 18,
    },
    effects: [],
    production: []
},

[StructureType.Barracks]: {
    name: 'Barracks',
    actions: [StructureAction.TrainGuards,StructureAction.EnforceLaws],
    recipe: {
        ingredients: {
            [GoodsType.Wood]: 250,
            [GoodsType.Brick]: 150,
            [GoodsType.MetalGoods]: 100,
        },
        time: 30,
    },
    effects: [{
        name: "Military Training",
        results: {
            [StructureEffect.MilitaryTrainingEfficiency]: 1.2,
        },
        consumption: {}
    }],
    production: []
},

      [StructureType.Tower]: createPlaceholderBuilding('Tower'),
      [StructureType.Wall]: createPlaceholderBuilding('Wall'),
      [StructureType.MilitaryAcademy]: createPlaceholderBuilding('Military Academy'),
      [StructureType.Lumberyard]: createPlaceholderBuilding('Lumberyard'),
      [StructureType.Brickworks]: createPlaceholderBuilding('Brickworks'),
[StructureType.GrainFarm]: {
    name: 'Grain Farm',
    actions: [],
    recipe: {
        ingredients: {
            [GoodsType.Wood]: 100,
            [GoodsType.Brick]: 50,
        },
        time: 12,
    },
    effects: [],
    production: [{
        name: "Produce Grain",
        input: {},
        output: {
            [GoodsType.Grain]: 20,
        },
        time: 8
    }]
},
      [StructureType.HempFarm]:  {
        name: 'Hemp Farm',
        actions: [],
        recipe: {
            ingredients: {
                [GoodsType.Wood]: 100,
                [GoodsType.Brick]: 50,
            },
            time: 12,
        },
        effects: [],
        production: [{
            name: "Produce Hemp",
            input: {},
            output: {
                [GoodsType.Hemp]: 20,
            },
            time: 8
        }]
    },
      [StructureType.SheepFarm]:  {
    name: 'Sheep Farm',
    actions: [],
    recipe: {
        ingredients: {
            [GoodsType.Wood]: 100,
            [GoodsType.Brick]: 50,
        },
        time: 12,
    },
    effects: [],
    production: [{
        name: "Produce Wool",
        input: {},
        output: {
            [GoodsType.Wool]: 20,
        },
        time: 8
    },{
        name: "Produce Meat",
        input: {
            [GoodsType.Salt]: 5,},
        output: {
            [GoodsType.Meat]: 20,
        },
        time: 8
    }]
},
[StructureType.Mine]: {
    name: 'Mine',
    actions: [],
    recipe: {
        ingredients: {
            [GoodsType.Wood]: 100,
            [GoodsType.Brick]: 150,
            [GoodsType.Steel]: 50,
        },
        time: 24,
    },
    effects: [],
    production: [{
        name: "Extract Raw Metal",
        input: {},
        output: {
            [GoodsType.Iron]: 15,
        },
        time: 10
    }]
},

      [StructureType.Beekeeping]: {
    name: 'Mine',
    actions: [],
    recipe: {
        ingredients: {
            [GoodsType.Wood]: 150,
            [GoodsType.Brick]: 150,
        },
        time: 24,
    },
    effects: [],
    production: [{
        name: "Produce Honey",
        input: {},
        output: {
            [GoodsType.Honey]: 15,
        },
        time: 10
    }]
},
      [StructureType.SaltWorks]: {
    name: 'Mine',
    actions: [],
    recipe: {
        ingredients: {
            [GoodsType.Wood]: 200,
            [GoodsType.Brick]: 150,
        },
        time: 24,
    },
    effects: [],
    production: [{
        name: "Produce Salt",
        input: {},
        output: {
            [GoodsType.Salt]: 20,
        },
        time: 10
    }]
},
      [StructureType.Blacksmith]: {
    name: 'Blacksmith',
    actions: [],
    recipe: {
        ingredients: {
            [GoodsType.Wood]: 200,
            [GoodsType.Brick]: 100,
            [GoodsType.MetalGoods]: 200,
            [GoodsType.Steel]: 50
        },
        time: 36,
    },
    effects: [{
        name: "Metalworks",
        consumption: {
            [GoodsType.Coal]: 5,
            [GoodsType.Iron]: 10,
        },
        results: {
            [StructureEffect.WeaponQualityIncrease]: 0.2,
        }
    }],
    production: [{
        name: "Produce MetalGoods",
        input: {
            [GoodsType.Coal]: 5,
            [GoodsType.Iron]: 10
        },
        output: {
            [GoodsType.MetalGoods]: 8
        },
        time: 12
    }]
},

[StructureType.Brewery]: {
    name: 'Brewery',
    actions: [],
    recipe: {
        ingredients: {
            [GoodsType.Wood]: 100,
            [GoodsType.Brick]: 50,
            [GoodsType.MetalGoods]: 50,
        },
        time: 20,
    },
    effects: [],
    production: [{
        name: "Brew Beer",
        input: {
            [GoodsType.Grain]: 5,
        },
        output: {
            [GoodsType.Beer]: 10,
        },
        time: 6
    }]},

      [StructureType.Meadery]: {
          name: 'Meadery',
          actions: [],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 120,
                  [GoodsType.Brick]: 80,
                  [GoodsType.MetalGoods]: 30,
              },
              time: 24,
          },
          effects: [],
          production: [{
              name: "Brew Mead",
              input: {
                  [GoodsType.Honey]: 8,
              },
              output: {
                  [GoodsType.Mead]: 12,
              },
              time: 8
          }]
      },
      [StructureType.Tailor]: {
          name: 'Tailor',
          actions: [],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 100,
                  [GoodsType.Brick]: 50,
                  [GoodsType.MetalGoods]: 20,
              },
              time: 18,
          },
          effects: [],
          production: [{
              name: "Make Clothing",
              input: {
                  [GoodsType.Cloth]: 5,
              },
              output: {
                  [GoodsType.Clothing]: 3,
              },
              time: 6
          }]
      },
      [StructureType.Cheesemaker]: {
          name: 'Cheesemaker',
          actions: [],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 80,
                  [GoodsType.Brick]: 60,
              },
              time: 15,
          },
          effects: [],
          production: [{
              name: "Make Cheese",
              input: {
                  [GoodsType.Salt]: 2,
              },
              output: {
                  [GoodsType.Cheese]: 8,
              },
              time: 4
          }]
      },
      [StructureType.Fishery]: {
          name: 'Fishery',
          actions: [],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 150,
                  [GoodsType.MetalGoods]: 30,
              },
              time: 12,
          },
          effects: [],
          production: [{
              name: "Catch Fish",
              input: {
                  [GoodsType.Salt]: 3,
              },
              output: {
                  [GoodsType.Stockfish]: 15,
              },
              time: 6
          }]
      },
      [StructureType.Tannery]: {
          name: 'Tannery',
          actions: [],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 120,
                  [GoodsType.Brick]: 80,
              },
              time: 20,
          },
          effects: [],
          production: [{
              name: "Process Pelts",
              input: {
                  [GoodsType.Salt]: 2,
              },
              output: {
                  [GoodsType.Pelts]: 6,
              },
              time: 8
          }]
      },
      [StructureType.Butchery]: {
          name: 'Butchery',
          actions: [],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 100,
                  [GoodsType.Brick]: 50,
                  [GoodsType.MetalGoods]: 15,
              },
              time: 15,
          },
          effects: [],
          production: [{
              name: "Process Meat",
              input: {
                  [GoodsType.Salt]: 3,
              },
              output: {
                  [GoodsType.Meat]: 10,
              },
              time: 4
          }]
      },
      [StructureType.Vineyard]: {
          name: 'Vineyard',
          actions: [],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 200,
                  [GoodsType.Brick]: 100,
              },
              time: 30,
          },
          effects: [],
          production: [{
              name: "Produce Wine",
              input: {},
              output: {
                  [GoodsType.Wine]: 12,
              },
              time: 12
          }]
      },
      [StructureType.SpiceMarket]: {
          name: 'Spice Market',
          actions: [StructureAction.TradeGoods],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 300,
                  [GoodsType.Brick]: 200,
                  [GoodsType.MetalGoods]: 100,
              },
              time: 40,
          },
          effects: [{
              name: "Luxury Trade Boost",
              consumption: {},
              results: {
                  [StructureEffect.TradeEfficiency]: 1.3,
              }
          }],
          production: []
      },
      [StructureType.CottonPlantation]: {
          name: 'Cotton Plantation',
          actions: [],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 250,
                  [GoodsType.Brick]: 100,
              },
              time: 36,
          },
          effects: [],
          production: [{
              name: "Grow Cotton",
              input: {},
              output: {
                  [GoodsType.Cotton]: 25,
              },
              time: 16
          }]
      },
      [StructureType.SugarPlantation]: {
          name: 'Sugar Plantation',
          actions: [],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 300,
                  [GoodsType.Brick]: 150,
              },
              time: 40,
          },
          effects: [],
          production: [{
              name: "Harvest Sugar",
              input: {},
              output: {
                  [GoodsType.Sugar]: 20,
              },
              time: 18
          }]
      },
      [StructureType.TobaccoPlantation]: {
          name: 'Tobacco Plantation',
          actions: [],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 280,
                  [GoodsType.Brick]: 120,
              },
              time: 35,
          },
          effects: [],
          production: [{
              name: "Grow Tobacco",
              input: {},
              output: {
                  [GoodsType.Tobacco]: 15,
              },
              time: 20
          }]
      },
      [StructureType.GoldMine]: {
          name: 'Gold Mine',
          actions: [],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 200,
                  [GoodsType.Brick]: 300,
                  [GoodsType.Steel]: 150,
              },
              time: 60,
          },
          effects: [],
          production: [{
              name: "Extract Gold",
              input: {},
              output: {
                  [GoodsType.Gold]: 5,
              },
              time: 24
          }]
      },
      [StructureType.SilverMine]: {
          name: 'Silver Mine',
          actions: [],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 150,
                  [GoodsType.Brick]: 250,
                  [GoodsType.Steel]: 100,
              },
              time: 45,
          },
          effects: [],
          production: [{
              name: "Extract Silver",
              input: {},
              output: {
                  [GoodsType.Silver]: 8,
              },
              time: 18
          }]
      },
      [StructureType.GemstoneMine]: {
          name: 'Gemstone Mine',
          actions: [],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 180,
                  [GoodsType.Brick]: 280,
                  [GoodsType.Steel]: 120,
              },
              time: 50,
          },
          effects: [],
          production: [{
              name: "Extract Gemstones",
              input: {},
              output: {
                  [GoodsType.Gemstones]: 3,
              },
              time: 30
          }]
      },
      [StructureType.JewelryWorkshop]: {
          name: 'Jewelry Workshop',
          actions: [],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 150,
                  [GoodsType.Brick]: 100,
                  [GoodsType.MetalGoods]: 80,
              },
              time: 30,
          },
          effects: [],
          production: [{
              name: "Craft Jewelry",
              input: {
                  [GoodsType.Gold]: 2,
                  [GoodsType.Gemstones]: 1,
              },
              output: {
                  [GoodsType.Jewelry]: 4,
              },
              time: 12
          }]
      },
      [StructureType.Papermill]: {
          name: 'Paper Mill',
          actions: [],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 200,
                  [GoodsType.Brick]: 150,
                  [GoodsType.MetalGoods]: 50,
              },
              time: 25,
          },
          effects: [],
          production: [{
              name: "Make Paper",
              input: {
                  [GoodsType.Wood]: 8,
              },
              output: {
                  [GoodsType.Paper]: 20,
              },
              time: 8
          }]
      },
      [StructureType.Steelworks]: {
          name: 'Steelworks',
          actions: [],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 300,
                  [GoodsType.Brick]: 400,
                  [GoodsType.MetalGoods]: 200,
              },
              time: 50,
          },
          effects: [],
          production: [{
              name: "Produce Steel",
              input: {
                  [GoodsType.Iron]: 15,
                  [GoodsType.Coal]: 10,
              },
              output: {
                  [GoodsType.Steel]: 12,
              },
              time: 15
          }]
      },
      [StructureType.OilRig]: {
          name: 'Oil Rig',
          actions: [],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 400,
                  [GoodsType.Steel]: 300,
                  [GoodsType.MetalGoods]: 200,
              },
              time: 80,
          },
          effects: [],
          production: [{
              name: "Extract Oil",
              input: {},
              output: {
                  [GoodsType.Oil]: 25,
              },
              time: 20
          }]
      },
      [StructureType.PitchMaker]: {
          name: 'Pitch Maker',
          actions: [],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 180,
                  [GoodsType.Brick]: 120,
              },
              time: 25,
          },
          effects: [],
          production: [{
              name: "Make Pitch",
              input: {
                  [GoodsType.Wood]: 10,
              },
              output: {
                  [GoodsType.Pitch]: 8,
              },
              time: 10
          }]
      },
      [StructureType.Lighthouse]: {
          name: 'Lighthouse',
          actions: [],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 200,
                  [GoodsType.Brick]: 300,
                  [GoodsType.MetalGoods]: 100,
              },
              time: 45,
          },
          effects: [{
              name: "Navigation Aid",
              consumption: {},
              results: {
                  [StructureEffect.NavigationAid]: 1.5,
              }
          }],
          production: []
      },
      [StructureType.Totem]: {
          name: 'Totem',
          actions: [],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 100,
              },
              time: 8,
          },
          effects: [{
              name: "Cultural Influence",
              consumption: {},
              results: {
                  [StructureEffect.CulturalInfluence]: 1.2,
              }
          }],
          production: []
      },
      [StructureType.Hall]: {
          name: 'Hall',
          actions: [StructureAction.HostEvent],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 300,
                  [GoodsType.Brick]: 200,
              },
              time: 35,
          },
          effects: [{
              name: "Entertainment Value",
              consumption: {},
              results: {
                  [StructureEffect.EntertainmentValue]: 1.3,
              }
          }],
          production: []
      },
      [StructureType.Forge]: {
          name: 'Forge',
          actions: [],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 150,
                  [GoodsType.Brick]: 200,
                  [GoodsType.MetalGoods]: 100,
              },
              time: 30,
          },
          effects: [],
          production: [{
              name: "Forge Metal Goods",
              input: {
                  [GoodsType.Iron]: 8,
                  [GoodsType.Coal]: 4,
              },
              output: {
                  [GoodsType.MetalGoods]: 6,
              },
              time: 8
          }]
      },
      [StructureType.ClayPit]: {
          name: 'Clay Pit',
          actions: [],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 80,
                  [GoodsType.MetalGoods]: 20,
              },
              time: 15,
          },
          effects: [],
          production: [{
              name: "Extract Clay",
              input: {},
              output: {
                  [GoodsType.Clay]: 30,
              },
              time: 8
          }]
      },
      [StructureType.MarbleQuarry]: {
          name: 'Marble Quarry',
          actions: [],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 200,
                  [GoodsType.Steel]: 150,
                  [GoodsType.MetalGoods]: 100,
              },
              time: 40,
          },
          effects: [],
          production: [{
              name: "Extract Marble",
              input: {},
              output: {
                  [GoodsType.Marble]: 12,
              },
              time: 20
          }]
      },
      [StructureType.RubberPlantation]: {
          name: 'Rubber Plantation',
          actions: [],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 250,
                  [GoodsType.Brick]: 100,
              },
              time: 35,
          },
          effects: [],
          production: [{
              name: "Harvest Rubber",
              input: {},
              output: {
                  [GoodsType.Rubber]: 18,
              },
              time: 15
          }]
      },
      [StructureType.Glassworks]: {
          name: 'Glassworks',
          actions: [],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 180,
                  [GoodsType.Brick]: 150,
                  [GoodsType.MetalGoods]: 80,
              },
              time: 30,
          },
          effects: [],
          production: [{
              name: "Make Glassware",
              input: {
                  [GoodsType.Coal]: 6,
              },
              output: {
                  [GoodsType.Glassware]: 10,
              },
              time: 12
          }]
      },
      [StructureType.TeaPlantation]: {
          name: 'Tea Plantation',
          actions: [],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 200,
                  [GoodsType.Brick]: 100,
              },
              time: 30,
          },
          effects: [],
          production: [{
              name: "Grow Tea",
              input: {},
              output: {
                  [GoodsType.Tea]: 15,
              },
              time: 18
          }]
      },
      [StructureType.DyeWorks]: {
          name: 'Dye Works',
          actions: [],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 150,
                  [GoodsType.Brick]: 120,
                  [GoodsType.MetalGoods]: 60,
              },
              time: 25,
          },
          effects: [],
          production: [{
              name: "Make Dye",
              input: {},
              output: {
                  [GoodsType.Dye]: 12,
              },
              time: 10
          }]
      },
      [StructureType.PotteryWorkshop]: {
          name: 'Pottery Workshop',
          actions: [],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 100,
                  [GoodsType.Brick]: 80,
              },
              time: 20,
          },
          effects: [],
          production: [{
              name: "Make Pottery",
              input: {
                  [GoodsType.Clay]: 8,
              },
              output: {
                  [GoodsType.Pottery]: 12,
              },
              time: 8
          }]
      },
      [StructureType.CocoaPlantation]: {
          name: 'Cocoa Plantation',
          actions: [],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 220,
                  [GoodsType.Brick]: 120,
              },
              time: 35,
          },
          effects: [],
          production: [{
              name: "Harvest Cocoa",
              input: {},
              output: {
                  [GoodsType.Cocoa]: 12,
              },
              time: 20
          }]
      },
      [StructureType.CoffeePlantation]: {
          name: 'Coffee Plantation',
          actions: [],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 200,
                  [GoodsType.Brick]: 110,
              },
              time: 32,
          },
          effects: [],
          production: [{
              name: "Grow Coffee",
              input: {},
              output: {
                  [GoodsType.Coffee]: 14,
              },
              time: 18
          }]
      },
      [StructureType.SaffronFields]: {
          name: 'Saffron Fields',
          actions: [],
          recipe: {
              ingredients: {
                  [GoodsType.Wood]: 150,
                  [GoodsType.Brick]: 100,
              },
              time: 40,
          },
          effects: [],
          production: [{
              name: "Harvest Saffron",
              input: {},
              output: {
                  [GoodsType.Saffron]: 3,
              },
              time: 30
          }]
      },
      [StructureType.PlasticsFactory]: createPlaceholderBuilding('Plastics Factory'),
      [StructureType.AluminiumRefinery]: createPlaceholderBuilding('Aluminium Refinery'),
      [StructureType.TitaniumFoundry]: createPlaceholderBuilding('Titanium Foundry'),
      [StructureType.Refinery]: createPlaceholderBuilding('Refinery'),
      [StructureType.HydrogenPlant]: createPlaceholderBuilding('Hydrogen Plant'),
      [StructureType.OxygenPlant]: createPlaceholderBuilding('Oxygen Plant'),
      [StructureType.HeliumExtractionFacility]: createPlaceholderBuilding('Helium Extraction Facility'),
      [StructureType.FertilizerPlant]: createPlaceholderBuilding('Fertilizer Plant'),
      [StructureType.CopperMine]: createPlaceholderBuilding('Copper Mine'),
      [StructureType.ManaSlimeHarvester]: createPlaceholderBuilding('Mana Slime Harvester'),
      [StructureType.AetherResidueCollector]: createPlaceholderBuilding('Aether Residue Collector'),
      [StructureType.SiliconLab]: createPlaceholderBuilding('Silicon Lab'),
      [StructureType.GunpowderMill]: createPlaceholderBuilding('Gunpowder Mill'),
      [StructureType.CarbonFiberWorks]: createPlaceholderBuilding('Carbon Fiber Works'),
      [StructureType.ElectronicsFactory]: createPlaceholderBuilding('Electronics Factory'),
      [StructureType.PlasmaGelLab]: createPlaceholderBuilding('Plasma Gel Lab'),
      [StructureType.MachineWorks]: createPlaceholderBuilding('Machine Works'),
      [StructureType.ObsidianQuarry]: createPlaceholderBuilding('Obsidian Quarry'),
      [StructureType.ChemicalPlant]: createPlaceholderBuilding('Chemical Plant'),
      [StructureType.GraniteQuarry]: createPlaceholderBuilding('Granite Quarry'),
      [StructureType.NitrogenPlant]: createPlaceholderBuilding('Nitrogen Plant'),
      [StructureType.CrylithiumSynthesizer]: createPlaceholderBuilding('Crylithium Synthesizer'),
      [StructureType.VortaniteForge]: createPlaceholderBuilding('Vortanite Forge'),
      [StructureType.NeptuniumMine]: createPlaceholderBuilding('Neptunium Mine'),
      [StructureType.AetheriumReactor]: createPlaceholderBuilding('Aetherium Reactor'),
      [StructureType.SolariumHarvester]: createPlaceholderBuilding('Solarium Harvester'),
      [StructureType.QuantiteSynthesizer]: createPlaceholderBuilding('Quantite Synthesizer'),
      [StructureType.XenoriteExtractor]: createPlaceholderBuilding('Xenorite Extractor'),
      [StructureType.LuminarChamber]: createPlaceholderBuilding('Luminar Chamber'),
      [StructureType.GravitaniumWell]: createPlaceholderBuilding('Gravitanium Well'),
      [StructureType.ObscuriumMine]: createPlaceholderBuilding('Obscurium Mine'),
      [StructureType.RadiantiteRefinery]: createPlaceholderBuilding('Radiantite Refinery'),
      [StructureType.PulsariteAccelerator]: createPlaceholderBuilding('Pulsarite Accelerator'),
      [StructureType.NovaciteForge]: createPlaceholderBuilding('Novacite Forge'),
      [StructureType.ZephyriumSanctuary]: createPlaceholderBuilding('Zephyrium Sanctuary'),
      [StructureType.AstraliteObservatory]: createPlaceholderBuilding('Astralite Observatory'),
      [StructureType.NebulonSynthesizer]: createPlaceholderBuilding('Nebulon Synthesizer'),
      [StructureType.ChronotiteForge]: createPlaceholderBuilding('Chronotite Forge'),
      [StructureType.ThermiumRefinery]: createPlaceholderBuilding('Thermium Refinery'),
      [StructureType.ElectritePlant]: createPlaceholderBuilding('Electrite Plant'),
      [StructureType.MagnetariteHarvester]: createPlaceholderBuilding('Magnetarite Harvester'),
      [StructureType.DragoniteSanctum]: createPlaceholderBuilding('Dragonite Sanctum'),
      [StructureType.EmberithKiln]: createPlaceholderBuilding('Emberith Kiln'),
      [StructureType.GlimbriteLab]: createPlaceholderBuilding('Glimbrite Lab'),
      [StructureType.TharnaxVault]: createPlaceholderBuilding('Tharnax Vault'),
      [StructureType.VelunorShrine]: createPlaceholderBuilding('Velunor Shrine'),
      [StructureType.KryntalChamber]: createPlaceholderBuilding('Kryntal Chamber'),
      [StructureType.ZorviumMine]: createPlaceholderBuilding('Zorvium Mine'),
      [StructureType.EldrithiumSanctum]: createPlaceholderBuilding('Eldrithium Sanctum'),
      [StructureType.MorvexSynthesisLab]: createPlaceholderBuilding('Morvex Synthesis Lab'),
      [StructureType.SylvaranGrove]: createPlaceholderBuilding('Sylvaran Grove'),
      [StructureType.DurnaciteForge]: createPlaceholderBuilding('Durnacite Forge'),
      [StructureType.LuminexCrucible]: createPlaceholderBuilding('Luminex Crucible'),
      [StructureType.VireliumHarvester]: createPlaceholderBuilding('Virelium Harvester'),
      [StructureType.NexaliteMine]: createPlaceholderBuilding('Nexalite Mine'),
      [StructureType.QuenrilForge]: createPlaceholderBuilding('Quenril Forge'),
      [StructureType.ArcaniteSpire]: createPlaceholderBuilding('Arcanite Spire'),
      [StructureType.FelbrimAltar]: createPlaceholderBuilding('Felbrim Altar'),
      [StructureType.XenthiumArray]: createPlaceholderBuilding('Xenthium Array'),
      [StructureType.MyrralithForge]: createPlaceholderBuilding('Myrralith Forge'),
      [StructureType.ZephyriteSanctuary]: createPlaceholderBuilding('Zephyrite Sanctuary'),
      [StructureType.NexosCore]: createPlaceholderBuilding('Nexos Core'),
      [StructureType.BerilliumReactor]: createPlaceholderBuilding('Berillium Reactor')
  };

  getBuildingMeta(structureType: StructureType): Building | null {
    return this.meta[structureType] || null;
  }
}