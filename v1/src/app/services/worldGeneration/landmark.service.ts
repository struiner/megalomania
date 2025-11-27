import { Injectable } from "@angular/core";
import { SeedService } from "./seed.service";

@Injectable({ providedIn: 'root' })
export class LandmarkService {
    private _noise?: (x: number, y: number) => number;

    constructor(private seedService: SeedService) {}
  
    private getNoise(): (x: number, y: number) => number {
      if (!this._noise) {
        this._noise = this.seedService.getNoise();
      }
      return this._noise;
    }
  
    // Use this in any method:
    // const noise = this.getNoise();
    // const value = noise(x, y);

  applyElevationLandmarks(
    elevationMap: number[][],
    xStart: number,
    yStart: number,
    moistureMap?: number[][]
  ): void {
    const height = elevationMap.length;
    const width = elevationMap[0].length;
  
    this.createEnormousLandMarks(elevationMap, width, height);

    this.applyErosion(elevationMap, width, height);
    this.enhancePeaks(elevationMap, width, height);
    this.sharpenCliffs(elevationMap, width, height);
    this.flattenLakes(elevationMap,0,0,width, height);
    this.carveDownhillRivers(elevationMap,0,0,width, height);
  }
  

  private flattenLakes(elev: number[][], xStart: number, yStart: number, width: number, height: number): void {
    const noise = this.getNoise();
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const wx = xStart + x;
        const wy = yStart + y;

        const lakeNoise = noise(wx * 0.02, wy * 0.02);
        if (lakeNoise < 0.1 && elev[y][x] > 0.18 && elev[y][x] < 0.3) {
          // Average nearby elevations for smooth lake basin
          let total = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              total += elev[y + dy][x + dx];
            }
          }
          const avg = total / 9;
          elev[y][x] = Math.min(elev[y][x], avg - 0.02);
        }
      }
    }
  }

  private enhancePeaks(elev: number[][], width: number, height: number): void {
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const current = elev[y][x];
        if (current > 0.85 && this.isLocalMax(elev, x, y)) {
          elev[y][x] += 0.03;
          elev[y][x] = Math.min(1, elev[y][x]);
        }
      }
    }
  }

  private isLocalMax(elev: number[][], x: number, y: number): boolean {
    const e = elev[y][x];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dy === 0 && dx === 0) continue;
        if (elev[y + dy][x + dx] > e) return false;
      }
    }
    return true;
  }

  private sharpenCliffs(elev: number[][], width: number, height: number): void {
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const e = elev[y][x];
        let maxDiff = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dy === 0 && dx === 0) continue;
            const diff = Math.abs(e - elev[y + dy][x + dx]);
            if (diff > maxDiff) maxDiff = diff;
          }
        }

        if (maxDiff > 0.25) {
          // Slightly steepen the slope
          elev[y][x] = e < 0.5 ? e - 0.02 : e + 0.02;
          elev[y][x] = Math.max(0, Math.min(1, elev[y][x]));
        }
      }
    }
  }
  private applyErosion(elev: number[][], width: number, height: number): void {
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const current = elev[y][x];
        let total = 0, count = 0;
  
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const neighbor = elev[y + dy][x + dx];
            total += neighbor;
            count++;
          }
        }
  
        const avg = total / count;
        if (current - avg > 0.12) {
          elev[y][x] -= 0.02; // Simulate erosion by cutting sharp peak
        }
      }
    }
  }
  private carveDownhillRivers(elev: number[][], xStart: number, yStart: number, width: number, height: number): void {
    const noise = this.getNoise();
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const wx = xStart + x;
        const wy = yStart + y;
        const seed = noise(wx * 0.004, wy * 0.004);
  
        // Select only a few starting points
        if (seed > 0.985 && elev[y][x] > 0.5) {
          let cx = x, cy = y;
  
          for (let i = 0; i < 12; i++) {
            const current = elev[cy][cx];
            let lowest = current;
            let next = [cx, cy];
  
            for (let dy = -1; dy <= 1; dy++) {
              for (let dx = -1; dx <= 1; dx++) {
                const nx = cx + dx;
                const ny = cy + dy;
                if (nx < 0 || ny < 0 || ny >= height || nx >= width) continue;
  
                const candidate = elev[ny][nx];
                if (candidate < lowest) {
                  lowest = candidate;
                  next = [nx, ny];
                }
              }
            }
  
            const [nx, ny] = next;
            if (nx === cx && ny === cy) break; // local minimum
  
            elev[cy][cx] -= 0.015; // carve river path
            cx = nx;
            cy = ny;
  
            if (elev[cy][cx] < 0.18) break; // stop if near water
          }
        }
      }
    }
  }
  private isMoistEnough(moisture: number, elevation: number): boolean {
    return moisture > 0.45 && elevation > 0.18;
  }
  
  private isSteepEnough(elev: number[][], x: number, y: number): boolean {
    const current = elev[y][x];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const neighbor = elev[y + dy][x + dx];
        if (Math.abs(current - neighbor) > 0.25) return true;
      }
    }
    return false;
  }
  private createEnormousLandMarks(elev: number[][], width: number, height: number): void {
    const noise = this.getNoise();
  
    const featureChance = noise(width * 0.01, height * 0.01);
    if (featureChance < 0.3) return; // Approximately 1 in 10 chance
  
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;
  
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
  
        if (distance > radius) continue; // Focus landmarks in the center region
  
        const nx = (x + width) * 0.01;
        const ny = (y + height) * 0.01;
        const largeFeatureNoise = noise(nx * 2, ny * 2);
        const fineFeatureNoise = noise(nx * 10, ny * 10);
  
        // Select one feature based on seed
        if (featureChance < 0.92 && largeFeatureNoise > 0.65 && fineFeatureNoise > 0.4) {
          elev[y][x] = Math.min(1, elev[y][x] + 0.15); // Mesas
        } else if (featureChance < 0.94 && largeFeatureNoise < -0.6 && fineFeatureNoise < 0) {
          elev[y][x] = Math.max(0, elev[y][x] - 0.2); // Canyons
        } else if (featureChance < 0.96 && largeFeatureNoise > 0.3 && largeFeatureNoise < 0.5 && elev[y][x] < 0.25) {
          elev[y][x] += 0.3; // Archipelagos
        } else if (featureChance < 0.98 && largeFeatureNoise > 0.7) {
          elev[y][x] = Math.min(1, elev[y][x] + (largeFeatureNoise - 0.7) * 0.6); // Mountain ranges
        } else if (featureChance >= 0.98 && largeFeatureNoise < -0.65 && elev[y][x] > 0.2) {
          elev[y][x] -= 0.15; // Ravines
          if (elev[y][x] < 0.18) elev[y][x] = 0.17;
        }
      }
    }
  }
  
}
