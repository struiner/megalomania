export interface EquipmentItem {
    quantity: number;
    value: number; // Per unit value
   // effect: ItemEffect[];
  }

// Enhanced inventory item interface for detailed item management
export interface InventoryItem {
  name: string;
  icon: string;
  quantity: number;
  value: number;
  category: string;
  weight: number;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  description: string;
  origin?: string;
  durability?: number;
  maxDurability?: number;
}

export interface EquipmentSlot {
  slot: string;
  item: InventoryItem | null;
}