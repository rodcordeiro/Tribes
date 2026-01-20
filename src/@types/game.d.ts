import { Tile } from '../common/game/tile';
import { Tribe } from '../common/game/tribe';

declare global {
  export namespace Game {
    export interface Position {
      x: number;
      y: number;
    }
    export type Tile = typeof Tile;
    export type Tribe = typeof Tribe;
  }
}

export {};
