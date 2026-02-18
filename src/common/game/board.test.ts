import { DEFAULT_BALANCE } from './balance';
import { Board } from './board';
import { TribeCore } from './enums';
import { Tribe } from './tribe';

const createBoard = (width = 4, height = 4) =>
  new Board({
    tribesCount: 0,
    width,
    height,
    balance: DEFAULT_BALANCE,
    logger: () => {},
  });

describe('Board', () => {
  it('creates tiles respecting width and height', () => {
    const board = createBoard(4, 3);

    expect(board.tiles).toHaveLength(3);
    expect(board.tiles[0]).toHaveLength(4);
  });

  it('returns the expected tile by x/y coordinates', () => {
    const board = createBoard();
    const tile = board.getTileAt({ x: 2, y: 1 });

    expect(tile?.position).toEqual({ x: 2, y: 1 });
  });

  it('returns valid neighbors for center and corner positions', () => {
    const board = createBoard();

    expect(board.getNeighborTiles({ x: 1, y: 1 })).toHaveLength(4);
    expect(board.getNeighborTiles({ x: 0, y: 0 })).toHaveLength(2);
  });

  it('keeps fleeing tribe inside board bounds', () => {
    const board = createBoard();
    const tribe = new Tribe({
      initialPosition: { x: 0, y: 0 },
      name: 'A',
      color: '#123456',
      core: TribeCore.Exploration,
    });
    const threat = new Tribe({
      initialPosition: { x: 1, y: 1 },
      name: 'B',
      color: '#654321',
      core: TribeCore.War,
    });

    board.flee(tribe, threat);

    expect(board.isValidPosition(tribe.position)).toBe(true);
  });

  it('records war memory on the battle tile', () => {
    const board = createBoard();
    const attacker = new Tribe({
      initialPosition: { x: 1, y: 1 },
      initialPopulation: 100,
      initialSupplies: 100,
      name: 'Atk',
      color: '#f00',
      core: TribeCore.War,
      personality: { aggression: 1, cooperation: 0.1, fear: 0.1, expansionism: 0.7 },
    });
    const defender = new Tribe({
      initialPosition: { x: 1, y: 1 },
      initialPopulation: 10,
      initialSupplies: 100,
      name: 'Def',
      color: '#0f0',
      core: TribeCore.Peace,
      personality: { aggression: 0.1, cooperation: 0.7, fear: 0.9, expansionism: 0.2 },
    });

    board.attack(attacker, defender);

    expect(board.getTileAt({ x: 1, y: 1 })?.warMemory).toBe(1);
  });

  it('interlinks adjacent road segments from the same tribe', () => {
    const board = createBoard(3, 3);
    const center = board.getTileAt({ x: 1, y: 1 })!;
    const right = board.getTileAt({ x: 2, y: 1 })!;

    center.roadLevel = 1;
    center.roadOwnerId = 'tribe-1';
    right.roadLevel = 1;
    right.roadOwnerId = 'tribe-1';

    (board as any).connectRoadToAdjacentSegments(center, 'tribe-1');

    expect(center.roadConnections.right).toBe(true);
    expect(right.roadConnections.left).toBe(true);
  });
});
