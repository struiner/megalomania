import { Injectable } from '@angular/core';
import { ID } from '../../shared/types/ID';
import { StructureType } from '../../shared/enums/StructureType';
import { Buildings } from '../../shared/meta/Buildings';
import { GoodsType } from '../../shared/enums/GoodsType';

export interface Structure {
  id: ID;
  name: string;
  category: string;
  techLevel: number;
  materials: string[];
  cost: number;
  children?: (StructureGroup | Structure)[];
  type: StructureType;
  description: string;
  buildTime: number; // in days
  maintenanceCost: number; // per month
  workers: number;
  produces?: string[];
  consumes?: string[];
  requirements?: string[];
  benefits?: string[];
  size: 'Small' | 'Medium' | 'Large' | 'Huge';
  unlockLevel: number;

  // Enhanced metadata from Buildings service
  actions?: string[];
  effects?: {
    name: string;
    consumption: Record<string, number>;
    results: Record<string, number>;
  }[];
  production?: {
    name: string;
    input: Record<string, number>;
    output: Record<string, number>;
    time: number;
  }[];
  ingredients?: Record<string, number>;
  constructionTime?: number;
}

export interface StructureGroup {
  name: string;
  children?: (StructureGroup | Structure)[];
}

@Injectable({
  providedIn: 'root',
})
export class ConstructionService {
  private selectedStructure: Structure | null = null;

  constructor(private buildings: Buildings) {
    this.initializeStructuresFromMetadata();
  }

  private structures: Structure[] = [];

  private initializeStructuresFromMetadata(): void {
    // Get all building metadata and convert to Structure format
    const buildingTypes = Object.values(StructureType);

    buildingTypes.forEach((structureType, index) => {
      const buildingMeta = this.buildings.getBuildingMeta(structureType);
      if (buildingMeta) {
        const structure = this.convertBuildingMetaToStructure(structureType, buildingMeta, index + 1);
        this.structures.push(structure);
      }
    });
  }

  private convertBuildingMetaToStructure(structureType: StructureType, buildingMeta: any, id: number): Structure {
    // Convert ingredients to materials array and calculate cost
    const materials = Object.keys(buildingMeta.recipe?.ingredients || {});
    const cost = this.calculateBuildingCost(buildingMeta.recipe?.ingredients || {});

    return {
      id: id.toString(),
      name: buildingMeta.name,
      type: structureType,
      category: this.getCategoryFromStructureType(structureType),
      techLevel: this.getTechLevelFromStructureType(structureType),
      materials: materials.map(material => this.getReadableMaterialName(material)),
      cost: cost,
      description: this.generateDescription(buildingMeta),
      buildTime: buildingMeta.recipe?.time || 10,
      maintenanceCost: this.calculateMaintenanceCost(cost),
      workers: this.calculateWorkerRequirement(structureType),
      produces: this.getProductionOutputs(buildingMeta.production || []),
      consumes: this.getProductionInputs(buildingMeta.production || []),
      requirements: this.getRequirements(structureType),
      benefits: this.getBenefits(buildingMeta.effects || []),
      size: this.getSizeFromStructureType(structureType),
      unlockLevel: this.getUnlockLevel(structureType),

      // Enhanced metadata
      actions: buildingMeta.actions?.map((action: any) => action.toString()) || [],
      effects: buildingMeta.effects || [],
      production: buildingMeta.production || [],
      ingredients: buildingMeta.recipe?.ingredients || {},
      constructionTime: buildingMeta.recipe?.time || 10
    };
  }

  private oldStructures: Structure[] = [
    {
      id: '1',
      name: 'Artisan Bakery',
      category: 'Food Production',
      techLevel: 1,
      materials: ['Wood', 'Stone', 'Clay'],
      cost: 1200,
      type: StructureType.Brewery, // Using closest available type
      description: 'A well-equipped bakery that produces high-quality bread and pastries for the local market.',
      buildTime: 14,
      maintenanceCost: 45,
      workers: 6,
      produces: ['Bread', 'Pastries', 'Flour Products'],
      consumes: ['Grain', 'Fuel'],
      benefits: ['Increases city happiness', 'Provides steady food supply'],
      size: 'Medium',
      unlockLevel: 1
    },
    {
      id: '2',
      name: 'Master Blacksmith',
      category: 'Metalworking',
      techLevel: 2,
      materials: ['Iron', 'Coal', 'Stone', 'Tools'],
      cost: 2500,
      type: StructureType.Blacksmith,
      description: 'An advanced smithy capable of producing weapons, tools, and metal goods of exceptional quality.',
      buildTime: 21,
      maintenanceCost: 85,
      workers: 8,
      produces: ['Weapons', 'Tools', 'Metal Goods', 'Horseshoes'],
      consumes: ['Iron Ore', 'Coal', 'Charcoal'],
      requirements: ['Access to iron deposits'],
      benefits: ['Produces high-value goods', 'Enables weapon production'],
      size: 'Large',
      unlockLevel: 3
    },
    {
      id: '3',
      name: 'Steam-Powered Lumber Mill',
      category: 'Wood Processing',
      techLevel: 3,
      materials: ['Wood', 'Iron', 'Steam Engine'],
      cost: 3500,
      type: StructureType.Woodcutter,
      description: 'A modern lumber mill using steam power to process timber efficiently and produce various wood products.',
      buildTime: 28,
      maintenanceCost: 120,
      workers: 12,
      produces: ['Lumber', 'Planks', 'Furniture', 'Barrels'],
      consumes: ['Raw Timber', 'Coal'],
      requirements: ['Access to forest', 'Steam technology'],
      benefits: ['High production efficiency', 'Multiple wood products'],
      size: 'Huge',
      unlockLevel: 5
    },
    {
      id: '4',
      name: 'Grand Marketplace',
      category: 'Commerce',
      techLevel: 2,
      materials: ['Stone', 'Wood', 'Decorative Materials'],
      cost: 4000,
      type: StructureType.Market,
      description: 'A magnificent covered marketplace that attracts merchants from across the realm.',
      buildTime: 35,
      maintenanceCost: 150,
      workers: 20,
      benefits: ['Increases trade volume', 'Attracts foreign merchants', 'Boosts city reputation'],
      size: 'Huge',
      unlockLevel: 4
    },
    {
      id: '5',
      name: 'Textile Workshop',
      category: 'Manufacturing',
      techLevel: 2,
      materials: ['Wood', 'Looms', 'Tools'],
      cost: 1800,
      type: StructureType.Tailor,
      description: 'A specialized workshop for producing fine textiles and clothing.',
      buildTime: 18,
      maintenanceCost: 65,
      workers: 10,
      produces: ['Cloth', 'Clothing', 'Tapestries', 'Rope'],
      consumes: ['Raw Fiber', 'Dyes'],
      benefits: ['Produces luxury goods', 'Employs skilled artisans'],
      size: 'Medium',
      unlockLevel: 2
    },
    {
      id: '6',
      name: 'Alchemist Laboratory',
      category: 'Research',
      techLevel: 4,
      materials: ['Stone', 'Glass', 'Rare Materials'],
      cost: 5000,
      type: StructureType.Church, // Using closest available type
      description: 'A mysterious laboratory where alchemists research new formulas and create powerful potions.',
      buildTime: 42,
      maintenanceCost: 200,
      workers: 4,
      produces: ['Potions', 'Medicines', 'Alchemical Supplies'],
      consumes: ['Rare Herbs', 'Minerals', 'Reagents'],
      requirements: ['Master Alchemist', 'Rare material access'],
      benefits: ['Unlocks advanced recipes', 'Provides unique products'],
      size: 'Medium',
      unlockLevel: 8
    },
    {
      id: '7',
      name: 'Shipyard',
      category: 'Maritime',
      techLevel: 3,
      materials: ['Wood', 'Iron', 'Rope', 'Tar'],
      cost: 8000,
      type: StructureType.Harbor,
      description: 'A comprehensive shipbuilding facility capable of constructing various types of vessels.',
      buildTime: 60,
      maintenanceCost: 300,
      workers: 25,
      produces: ['Ships', 'Boats', 'Naval Equipment'],
      consumes: ['Timber', 'Iron', 'Canvas', 'Rope'],
      requirements: ['Coastal location', 'Master shipwright'],
      benefits: ['Enables fleet expansion', 'Ship repair capabilities'],
      size: 'Huge',
      unlockLevel: 6
    },
    {
      id: '8',
      name: 'Banking House',
      category: 'Finance',
      techLevel: 3,
      materials: ['Stone', 'Iron', 'Security Systems'],
      cost: 6000,
      type: StructureType.Bank,
      description: 'A secure financial institution that provides banking services and manages large sums of money.',
      buildTime: 45,
      maintenanceCost: 250,
      workers: 15,
      benefits: ['Increases trade efficiency', 'Provides loans', 'Manages finances'],
      requirements: ['High security', 'Trusted staff'],
      size: 'Large',
      unlockLevel: 7
    },
    {
      id: '9',
      name: 'Warehouse Complex',
      category: 'Storage',
      techLevel: 1,
      materials: ['Wood', 'Stone'],
      cost: 2000,
      type: StructureType.Warehouse,
      description: 'A large storage facility for keeping goods safe and organized.',
      buildTime: 20,
      maintenanceCost: 75,
      workers: 8,
      benefits: ['Increases storage capacity', 'Protects goods from weather', 'Improves logistics'],
      size: 'Large',
      unlockLevel: 2
    },
    {
      id: '10',
      name: 'Tavern & Inn',
      category: 'Hospitality',
      techLevel: 1,
      materials: ['Wood', 'Stone', 'Furnishings'],
      cost: 1500,
      type: StructureType.House, // Using closest available type
      description: 'A welcoming establishment that provides food, drink, and lodging for travelers.',
      buildTime: 16,
      maintenanceCost: 60,
      workers: 12,
      produces: ['Hospitality Services', 'Information'],
      consumes: ['Food', 'Ale', 'Wine'],
      benefits: ['Attracts travelers', 'Provides information network', 'Boosts morale'],
      size: 'Medium',
      unlockLevel: 1
    }
  ];

  getGroupedStructures(groupBy: string): StructureGroup {
    const root: StructureGroup = { name: 'All Structures', children: [] };

    const addToGroup = (group: StructureGroup, structure: Structure, key: string) => {
      let subgroup = group.children!.find(
        (child) => 'name' in child && child.name === key
      ) as StructureGroup;
      
      if (!subgroup) {
        subgroup = { name: key, children: [] };
        group.children!.push(subgroup);
      }
      subgroup.children!.push(structure);
    };

    this.structures.forEach((structure) => {
      switch (groupBy) {
        case 'production-horizontal':
        case 'production-vertical':
          addToGroup(root, structure, structure.category);
          break;
        case 'techLevel':
          addToGroup(root, structure, `Tech Level ${structure.techLevel}`);
          break;
        case 'materials':
          structure.materials.forEach((material) => addToGroup(root, structure, material));
          break;
        case 'cost':
          const costRange = structure.cost < 800 ? 'Low Cost' : 'High Cost';
          addToGroup(root, structure, costRange);
          break;
        default:
          root.children!.push(structure);
      }
    });

    return root;
  }

  setSelectedStructure(structure: Structure): void {
    this.selectedStructure = structure;
  }

  getSelectedStructure(): Structure | null {
    return this.selectedStructure;
  }

  getStructures(): Structure[] {
    return this.structures;
  }

  // Helper methods for converting building metadata
  private calculateBuildingCost(ingredients: Record<string, number>): number {
    let totalCost = 0;
    for (const [material, quantity] of Object.entries(ingredients)) {
      totalCost += this.getMaterialBaseCost(material) * quantity;
    }
    return Math.max(totalCost, 100); // Minimum cost of 100
  }

  private getMaterialBaseCost(material: string): number {
    const materialCosts: Record<string, number> = {
      [GoodsType.Wood]: 5,
      [GoodsType.Brick]: 8,
      [GoodsType.RawMetal]: 15,
      [GoodsType.MetalGoods]: 25,
      [GoodsType.Cloth]: 12,
      [GoodsType.Pelts]: 10,
      [GoodsType.Grain]: 3,
      [GoodsType.Meat]: 8,
      [GoodsType.Stockfish]: 6,
      [GoodsType.Beer]: 4,
      [GoodsType.Wine]: 20,
      [GoodsType.Salt]: 15,
      [GoodsType.Spices]: 30,
      [GoodsType.Honey]: 12,
      [GoodsType.Silver]: 100,
      [GoodsType.Gold]: 200,
      [GoodsType.Wool]: 8,
      [GoodsType.Hemp]: 6
    };
    return materialCosts[material] || 10;
  }

  private getReadableMaterialName(material: string): string {
    const materialNames: Record<string, string> = {
      [GoodsType.Wood]: 'Wood',
      [GoodsType.Brick]: 'Brick',
      [GoodsType.RawMetal]: 'Raw Metal',
      [GoodsType.MetalGoods]: 'Metal Goods',
      [GoodsType.Cloth]: 'Cloth',
      [GoodsType.Pelts]: 'Pelts',
      [GoodsType.Grain]: 'Grain',
      [GoodsType.Meat]: 'Meat',
      [GoodsType.Stockfish]: 'Stockfish',
      [GoodsType.Beer]: 'Beer',
      [GoodsType.Wine]: 'Wine',
      [GoodsType.Salt]: 'Salt',
      [GoodsType.Spices]: 'Spices',
      [GoodsType.Honey]: 'Honey',
      [GoodsType.Silver]: 'Silver',
      [GoodsType.Gold]: 'Gold',
      [GoodsType.Wool]: 'Wool',
      [GoodsType.Hemp]: 'Hemp'
    };
    return materialNames[material] || material;
  }

  private getCategoryFromStructureType(structureType: StructureType): string {
    const categories: Partial<Record<StructureType, string>> = {
      [StructureType.GrainFarm]: 'Agriculture',
      [StructureType.SheepFarm]: 'Agriculture',
      [StructureType.Fishery]: 'Food Production',
      [StructureType.Brewery]: 'Food Production',
      [StructureType.Butchery]: 'Food Production',
      [StructureType.Blacksmith]: 'Metalworking',
      [StructureType.Tailor]: 'Textiles',
      [StructureType.Tannery]: 'Leather Working',
      [StructureType.Woodcutter]: 'Resource Extraction',
      [StructureType.CopperMine]: 'Mining',
      [StructureType.Papermill]: 'Manufacturing',
      [StructureType.Windmill]: 'Processing',
      [StructureType.Harbor]: 'Maritime',
      [StructureType.Warehouse]: 'Storage',
      [StructureType.Market]: 'Commerce',
      [StructureType.Bank]: 'Finance',
      [StructureType.TownHall]: 'Government',
      [StructureType.Church]: 'Religious',
      [StructureType.Cathedral]: 'Religious',
      [StructureType.House]: 'Housing',
      [StructureType.Barn]: 'Storage',
      [StructureType.Well]: 'Infrastructure',
      [StructureType.Hall]: 'Government'
    };
    return categories[structureType] || 'General';
  }

  private getTechLevelFromStructureType(structureType: StructureType): number {
    const techLevels: Partial<Record<StructureType, number>> = {
      [StructureType.House]: 1,
      [StructureType.Well]: 1,
      [StructureType.GrainFarm]: 1,
      [StructureType.Woodcutter]: 1,
      [StructureType.Fishery]: 1,
      [StructureType.Market]: 2,
      [StructureType.Blacksmith]: 2,
      [StructureType.Brewery]: 2,
      [StructureType.Church]: 2,
      [StructureType.Barn]: 2,
      [StructureType.SheepFarm]: 2,
      [StructureType.Tailor]: 3,
      [StructureType.Tannery]: 3,
      [StructureType.Butchery]: 3,
      [StructureType.CopperMine]: 3,
      [StructureType.Windmill]: 3,
      [StructureType.Harbor]: 4,
      [StructureType.Warehouse]: 4,
      [StructureType.TownHall]: 4,
      [StructureType.Hall]: 4,
      [StructureType.Bank]: 5,
      [StructureType.Papermill]: 5,
      [StructureType.Cathedral]: 6
    };
    return techLevels[structureType] || 1;
  }

  private calculateMaintenanceCost(buildCost: number): number {
    return Math.floor(buildCost * 0.05); // 5% of build cost per month
  }

  private calculateWorkerRequirement(structureType: StructureType): number {
    const workerRequirements: Partial<Record<StructureType, number>> = {
      [StructureType.House]: 0,
      [StructureType.Well]: 0,
      [StructureType.Barn]: 1,
      [StructureType.GrainFarm]: 3,
      [StructureType.SheepFarm]: 2,
      [StructureType.Fishery]: 4,
      [StructureType.Woodcutter]: 2,
      [StructureType.CopperMine]: 8,
      [StructureType.Blacksmith]: 3,
      [StructureType.Brewery]: 3,
      [StructureType.Butchery]: 2,
      [StructureType.Tailor]: 2,
      [StructureType.Tannery]: 3,
      [StructureType.Papermill]: 4,
      [StructureType.Windmill]: 1,
      [StructureType.Market]: 2,
      [StructureType.Harbor]: 5,
      [StructureType.Warehouse]: 3,
      [StructureType.Bank]: 4,
      [StructureType.TownHall]: 6,
      [StructureType.Church]: 2,
      [StructureType.Cathedral]: 8,
      [StructureType.Hall]: 4
    };
    return workerRequirements[structureType] || 1;
  }

  private getProductionOutputs(production: any[]): string[] {
    const outputs: string[] = [];
    production.forEach(prod => {
      if (prod.output) {
        outputs.push(...Object.keys(prod.output).map(key => this.getReadableMaterialName(key)));
      }
    });
    return [...new Set(outputs)]; // Remove duplicates
  }

  private getProductionInputs(production: any[]): string[] {
    const inputs: string[] = [];
    production.forEach(prod => {
      if (prod.input) {
        inputs.push(...Object.keys(prod.input).map(key => this.getReadableMaterialName(key)));
      }
    });
    return [...new Set(inputs)]; // Remove duplicates
  }

  private getRequirements(structureType: StructureType): string[] {
    const requirements: Partial<Record<StructureType, string[]>> = {
      [StructureType.Harbor]: ['Coastal location'],
      [StructureType.Fishery]: ['Water access'],
      [StructureType.CopperMine]: ['Copper deposits'],
      [StructureType.Bank]: ['Town status'],
      [StructureType.Cathedral]: ['City status'],
      [StructureType.TownHall]: ['Town status']
    };
    return requirements[structureType] || [];
  }

  private getBenefits(effects: any[]): string[] {
    const benefits: string[] = [];
    effects.forEach(effect => {
      if (effect.name) {
        benefits.push(effect.name);
      }
    });
    return benefits;
  }

  private getSizeFromStructureType(structureType: StructureType): 'Small' | 'Medium' | 'Large' | 'Huge' {
    const sizes: Partial<Record<StructureType, 'Small' | 'Medium' | 'Large' | 'Huge'>> = {
      [StructureType.House]: 'Small',
      [StructureType.Well]: 'Small',
      [StructureType.Barn]: 'Medium',
      [StructureType.GrainFarm]: 'Large',
      [StructureType.SheepFarm]: 'Large',
      [StructureType.Fishery]: 'Medium',
      [StructureType.Woodcutter]: 'Medium',
      [StructureType.CopperMine]: 'Large',
      [StructureType.Blacksmith]: 'Medium',
      [StructureType.Brewery]: 'Medium',
      [StructureType.Butchery]: 'Small',
      [StructureType.Tailor]: 'Small',
      [StructureType.Tannery]: 'Medium',
      [StructureType.Papermill]: 'Large',
      [StructureType.Windmill]: 'Medium',
      [StructureType.Market]: 'Medium',
      [StructureType.Harbor]: 'Huge',
      [StructureType.Warehouse]: 'Large',
      [StructureType.Bank]: 'Medium',
      [StructureType.TownHall]: 'Large',
      [StructureType.Church]: 'Medium',
      [StructureType.Cathedral]: 'Huge',
      [StructureType.Hall]: 'Large'
    };
    return sizes[structureType] || 'Medium';
  }

  private getUnlockLevel(structureType: StructureType): number {
    return this.getTechLevelFromStructureType(structureType);
  }

  private generateDescription(buildingMeta: any): string {
    let description = buildingMeta.name;

    if (buildingMeta.production && buildingMeta.production.length > 0) {
      const firstProduction = buildingMeta.production[0];
      if (firstProduction.output) {
        const outputs = Object.keys(firstProduction.output).map(key => this.getReadableMaterialName(key));
        description += ` that produces ${outputs.join(', ')}.`;
      }
    }

    if (buildingMeta.effects && buildingMeta.effects.length > 0) {
      description += ` Provides ${buildingMeta.effects.map((e: any) => e.name).join(', ')}.`;
    }

    return description;
  }
}
