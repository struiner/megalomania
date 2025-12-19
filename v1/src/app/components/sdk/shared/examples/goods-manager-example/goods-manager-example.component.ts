import { Component } from '@angular/core';

@Component({
  selector: 'app-goods-manager-example',
  templateUrl: './goods-manager-example.component.html',
  styleUrls: ['./goods-manager-example.component.scss']
})
export class GoodsManagerExampleComponent {
  // Mock data for example purposes
  tierStats = [
    { label: 'Common', value: 12 },
    { label: 'Uncommon', value: 8 },
    { label: 'Rare', value: 4 },
    { label: 'Legendary', value: 1 }
  ];

  bottomActions = [
    { label: 'Save Changes', variant: 'primary' },
    { label: 'Reset', variant: 'secondary' },
    { label: 'Export All', variant: 'secondary' }
  ];

  goodsTypeOptions = ['Raw Material', 'Processed', 'Luxury', 'Weapon', 'Tool'];
  categories = [
    { name: 'Food & Drink' },
    { name: 'Materials' },
    { name: 'Tools' },
    { name: 'Weapons' },
    { name: 'Luxury Goods' }
  ];

  // Mock goods data
  mockGoods = [
    {
      category: 'Food & Drink',
      type: 'Raw Material',
      title: 'Skyfruit',
      rarity: 3,
      complexity: 2,
      basePrice: 25,
      description: 'Sweet fruit that grows at high altitudes',
      tags: ['food', 'sweet']
    },
    {
      category: 'Materials',
      type: 'Processed',
      title: 'Moonsteel',
      rarity: 4,
      complexity: 5,
      basePrice: 150,
      description: 'Rare metal with lunar properties',
      tags: ['metal', 'rare', 'magical']
    }
  ];

  // Simple mock methods
  readableGoods(type: string): string {
    return type.replace(/([A-Z])/g, ' $1').trim();
  }

  filteredGoods() {
    return this.mockGoods;
  }

  removeGood(index: number) {
    this.mockGoods.splice(index, 1);
  }

  addGood() {
    // Mock implementation
    console.log('Adding good...');
  }
}