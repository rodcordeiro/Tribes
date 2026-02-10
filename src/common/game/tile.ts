import { Board } from './board';
import { TileType } from './enums';

export class Tile {
  public position: Game.Position = { x: -1, y: -1 };
  public tileType?: TileType;
  public warMemory: number = 0;

  /**
   * Creates a tile at the given coordinates and assigns a random tile type.
   */
  constructor({ x, y }: { board: Board; x: number; y: number }) {
    this.position = { x, y };
    this.getTileType();
  }

  /**
   * Randomly assigns a tile type using weighted thresholds.
   */
  private getTileType() {
    const d100 = Math.floor(Math.random() * 100);
    if (d100 > 90) {
      this.tileType = TileType.WaterTile;
    } else if (d100 > 75) {
      this.tileType = TileType.Mountain;
    } else if (d100 > 50) {
      this.tileType = TileType.Forest;
    } else {
      this.tileType = TileType.LandTile;
    }
    return;
  }

  /**
   * Marks this tile as a recent war location.
   */
  public recordWar() {
    this.warMemory = 1;
  }

  /**
   * Gradually fades war memory over time.
   */
  public decayWarMemory() {
    if (this.warMemory <= 0) return;
    this.warMemory = Math.max(0, this.warMemory - 0.1);
  }
}
