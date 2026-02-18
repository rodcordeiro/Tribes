import { DEFAULT_BALANCE } from './balance';
import { Board } from './board';
import { Tile } from './tile';

const createBoard = () =>
  new Board({
    tribesCount: 0,
    width: 4,
    height: 4,
    balance: DEFAULT_BALANCE,
    logger: () => {},
  });

describe('Tile', () => {
  it('records war and decays memory over time', () => {
    const tile = new Tile({ board: createBoard(), x: 0, y: 0 });

    tile.recordWar();
    expect(tile.warMemory).toBe(1);

    tile.decayWarMemory();
    expect(tile.warMemory).toBeCloseTo(0.9, 5);

    for (let i = 0; i < 20; i++) {
      tile.decayWarMemory();
    }
    expect(tile.warMemory).toBe(0);
  });
});
