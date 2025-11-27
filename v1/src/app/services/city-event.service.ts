import { Injectable } from '@angular/core';
import { Settlement } from '../shared/types/Settlement';

@Injectable({ providedIn: 'root' })
export class LedgerEventActionsService {

  // === City foundation actions ===
  foundCity(settlement: Settlement): () => void {
    return () => {
      console.log(`Founded city ${settlement.name} at coordinates (${settlement.x}, ${settlement.y})`);
      // Add city to game state here.
    };
  }

  unfoundCity(settlement: Settlement): () => void {
    return () => {
      console.log(`Removed city ${settlement.name} from coordinates (${settlement.x}, ${settlement.y})`);
      // Remove city from game state here.
    };
  }

  // === City growth actions ===
  growCity(settlement: Settlement, populationGrowth: number): () => void {
    return () => {
      console.log(`City ${settlement.name} grows by ${populationGrowth} inhabitants.`);
      settlement.population += populationGrowth;
      // Update city population in game state here.
    };
  }

  shrinkCity(settlement: Settlement, populationReduction: number): () => void {
    return () => {
      console.log(`City ${settlement.name} shrinks by ${populationReduction} inhabitants.`);
      settlement.population -= populationReduction;
      // Update city population in game state here.
    };
  }

  // === Generic trade actions ===
  executeTrade(fromCity: Settlement, toCity: Settlement, resource: string, amount: number): () => void {
    return () => {
      console.log(`Executed trade of ${amount} ${resource} from ${fromCity.name} to ${toCity.name}.`);
      // Adjust resources accordingly here.
    };
  }

  reverseTrade(fromCity: Settlement, toCity: Settlement, resource: string, amount: number): () => void {
    return () => {
      console.log(`Reversed trade of ${amount} ${resource} from ${fromCity.name} to ${toCity.name}.`);
      // Reverse resource adjustments here.
    };
  }

}
