import { LogEntry } from '@/stores/game.reducer';
import {
  clamp,
  getRandomIntInclusive,
  getTribeName,
  randomEnumValue,
  randomHexColor,
} from '../utils';
import { ARCHETYPE_PRESETS } from '../contants';
import { GameBalance } from './balance';
import { TileType, TribeCore } from './enums';
import { Events, GameEvent } from './events';
import { Tile } from './tile';
import { Tribe } from './tribe';

interface ActiveEvent {
  event: GameEvent;
  remaining: number;
}

export class Board {
  public MAX_HEIGHT?: number;
  public MAX_WIDTH?: number;
  public tiles: Tile[][] = [];
  public tribes: Tribe[] = [];
  public ticks: number = 0;
  public ticksDelayInMs: number = 2500;
  private logger!: (_entry: LogEntry) => void;
  public activeEvent?: ActiveEvent;
  private balance: GameBalance;
  public globalProductionModifier = 0;

  /**
   * Creates a new game board with tiles and initial tribes.
   */
  constructor({
    tribesCount = 2,
    width = 10,
    height = 10,
    logger,
    balance,
  }: {
    tribesCount: number;
    width: number;
    height: number;
    balance: GameBalance;
    logger: (_entry: LogEntry) => void;
  }) {
    this.logger = logger;
    for (let y = 0; y <= width; y++) {
      if (!this.tiles[y]) this.tiles[y] = [];
      for (let x = 0; x <= height; x++) {
        this.tiles[y][x] = new Tile({ board: this, x, y });
      }
    }
    for (let tribe = 1; tribe <= tribesCount; tribe++) {
      let x = getRandomIntInclusive(0, width ?? 0);
      let y = getRandomIntInclusive(0, height ?? 0);

      const newTribe = new Tribe({
        initialPosition: {
          x,
          y,
        },
        name: getTribeName(),
        color: randomHexColor(),
        core: randomEnumValue(TribeCore),
      });

      this.tribes.push(newTribe);
    }

    this.MAX_HEIGHT = height;
    this.MAX_WIDTH = width;
    this.balance = balance;
  }

  /**
   * Returns aggregated stats for the current simulation state.
   */
  getStats() {
    const totalPopulation = this.tribes.reduce((sum, t) => sum + t.population, 0);

    const totalSupplies = this.tribes.reduce((sum, t) => sum + t.supplies, 0);

    return {
      tick: this.ticks,
      tribes: this.tribes.length,
      population: totalPopulation,
      supplies: totalSupplies,
    };
  }

  /**
   * Creates a shallow clone of the board state.
   */
  clone(): Board {
    const board = new Board({
      width: this.MAX_WIDTH!,
      height: this.MAX_HEIGHT!,
      tribesCount: 0,
      balance: this.balance,
      logger: this.logger!,
    });

    board.tiles = this.tiles; //this.tiles.map((t) => t.clone());
    board.tribes = this.tribes.map((t) => t.clone());
    board.ticks = this.ticks;
    board.ticksDelayInMs = this.ticksDelayInMs;
    board.activeEvent = this.activeEvent;

    return board;
  }

  /**
   * Advances the simulation by one tick and returns the new board.
   */
  tick(): Board {
    const next = this.clone();
    next.ticks++;

    next.tribes = next.tribes
      .map((tribe) => {
        try {
          const tile = next.getTileAt(tribe.position);
          return next.processEconomy(tribe, tile);
        } catch (error) {
          console.error(error);
          return tribe;
        }
      })
      .filter(Boolean) as Tribe[];

    const should_new_tribe_appear = Math.random();
    if (should_new_tribe_appear < 0.02) {
      const newTribe = new Tribe({
        initialPosition: {
          x: getRandomIntInclusive(0, next.MAX_WIDTH ?? 0),
          y: getRandomIntInclusive(0, next.MAX_HEIGHT ?? 0),
        },
        name: getTribeName(),
        color: randomHexColor(),
        core: randomEnumValue(TribeCore),
      });
      next.tribes.push(newTribe);
      next.logger({ type: 'Info', content: `Tribe ${newTribe.name} has begun` });
    }

    next.tribes.forEach((tribe) => {
      try {
        this.decideAction(tribe, next);
      } catch (e) {
        console.error(e);
      }
    });

    if (next.activeEvent) {
      next.activeEvent.remaining--;

      if (next.activeEvent.remaining <= 0) {
        next.activeEvent.event.revert(next);
        next.activeEvent = undefined;
      }
    } else {
      next.tryTriggerEvent();
    }
    return next;
  }

  /**
   * Determines the next action for a tribe based on nearby tribes and core.
   */
  decideAction(tribe: Tribe, nextBoard: Board) {
    const nearby = this.getNearbyTribes(tribe, tribe.personality.expansionism > 0.75 ? 2 : 1);
    if (nearby.length === 0) {
      return this.decideExploration(tribe);
    }

    for (const other of nearby) {
      const threat = tribe.evaluateThreat(tribe, other);
      const opportunity = tribe.evaluateOpportunity(tribe, other);

      // 1️⃣ FUGA
      if (tribe.personality.fear > threat && tribe.core === 'exploration') {
        this.logger({ type: 'Info', content: `${tribe.name} flew away from ${other.name}` });
        return this.flee(tribe, other);
      }

      // 2️⃣ ATAQUE
      if (tribe.core === 'war' && tribe.personality.aggression > Math.random()) {
        this.logger({ type: 'War', content: `${tribe.name} attacks ${other.name}!` });
        return this.attack(tribe, other);
      }

      // 3️⃣ COOPERAÇÃO / CASAMENTO
      if (tribe.core === 'peace' && opportunity > Math.random()) {
        return this.mergeTribes(tribe, other, nextBoard);
      }
    }

    return this.decideExploration(tribe);
  }

  /**
   * Returns tribes within the given Manhattan range of the provided tribe.
   */
  getNearbyTribes(tribe: Tribe, range = 1): Tribe[] {
    return this.tribes.filter((other) => {
      if (other === tribe || !other.position || !tribe.position) return false;

      const dx = Math.abs(other.position.x - tribe.position.x);
      const dy = Math.abs(other.position.y - tribe.position.y);

      return dx <= range && dy <= range;
    });
  }

  /**
   * Moves a tribe away from a threat, clamping to valid board bounds.
   */
  flee(tribe: Tribe, threat: Tribe) {
    const dx = tribe.position!.x - threat.position!.x;
    const dy = tribe.position!.y - threat.position!.y;

    const target = {
      x: tribe.position!.x + Math.sign(dx),
      y: tribe.position!.y + Math.sign(dy),
    };

    if (this.isValidPosition(target)) {
      tribe.move(target);
      return;
    }

    const maxX = Math.max(0, (this.MAX_WIDTH ?? 1) - 1);
    const maxY = Math.max(0, (this.MAX_HEIGHT ?? 1) - 1);
    tribe.move({
      x: clamp(target.x, 0, maxX),
      y: clamp(target.y, 0, maxY),
    });
  }

  /**
   * Resolves combat between attacker and defender and updates their stats.
   */
  attack(attacker: Tribe, defender: Tribe) {
    const powerA = attacker.population * attacker.personality.aggression;
    const powerD = defender.population * (1 - defender.personality.fear);

    if (powerA > powerD) {
      defender.population *= 0.7;
      attacker.population *= 0.9;

      defender.personality.aggression = defender.applyMemory(
        defender.personality.aggression,
        +0.01
      );
      defender.personality.fear = defender.applyMemory(defender.personality.fear, +0.2);
      defender.personality.cooperation = defender.applyMemory(defender.personality.fear, -0.1);

      this.logger({ type: 'War', content: `${attacker.name} wins over ${defender.name} at war!` });
    } else {
      this.logger({ type: 'War', content: `${attacker.name} loses for ${defender.name}` });
      attacker.population *= 0.6;
      attacker.personality.aggression = attacker.applyMemory(
        attacker.personality.aggression,
        +0.01
      );
      attacker.personality.cooperation = attacker.applyMemory(attacker.personality.fear, -0.1);
      attacker.personality.fear = attacker.applyMemory(attacker.personality.fear, +0.2);
      defender.personality.cooperation = defender.applyMemory(defender.personality.fear, 0.1);
    }
  }

  /**
   * Merges two tribes into a new one on the provided board.
   */
  mergeTribes(a: Tribe, b: Tribe, nextBoard: Board) {
    const newPop = Math.floor((a.population + b.population) * 0.6);

    nextBoard.tribes = this.tribes.filter((t) => t !== a && t !== b);

    nextBoard.tribes.push(
      new Tribe({
        initialPosition: a.position!,
        name: getTribeName(),
        color: randomHexColor(),
        core: randomEnumValue(TribeCore),
        initialPopulation: newPop,
      })
    );
  }

  /**
   * Chooses whether the tribe should move to a neighboring tile.
   */
  decideExploration(tribe: Tribe) {
    if (!tribe.position) return;

    const currentTile = this.getTileAt(tribe.position);
    const neighbors = this.getNeighborTiles(tribe.position);
    const preferences = ARCHETYPE_PRESETS[tribe.archetype]?.preferences;

    if (!currentTile || neighbors.length === 0) return;

    let bestTile = currentTile;
    let bestScore = this.evaluateTileSurvival(tribe, currentTile, currentTile, preferences);

    for (const tile of neighbors) {
      const score = this.evaluateTileSurvival(tribe, tile, currentTile, preferences);

      if (score > bestScore) {
        bestScore = score;
        bestTile = tile;
      }
    }

    // só se move se for melhor
    if (bestTile !== currentTile) {
      tribe.move(bestTile.position);
    }
  }

  /**
   * Evaluates how suitable a tile is for survival and movement decisions.
   */
  private evaluateTileSurvival(
    tribe: Tribe,
    tile: Tile,
    currentTile: Tile,
    preferences?: { movement: number; stability: number; production: number }
  ): number {
    let score = 1;
    const prefs = preferences ?? { movement: 0.5, stability: 0.5, production: 0.5 };
    const production = this.getProduction(tile);
    const productionNorm = clamp(production / 5, 0, 1);

    // // 🌱 Fertilidade (produção)
    // score += tile.fertility * (1 - tribe.personality.fear);

    // // ☠️ Hostilidade (perigo)
    // score -= tile.hostility * tribe.personality.fear;

    // 🧭 Preferência cultural
    if (tribe.core === 'exploration') {
      score += 0.2;
    }

    // Preferência por produção (mais forte em arquétipos exploradores)
    score += productionNorm * (0.3 + prefs.production * 0.7);

    // Estabilidade: favorece permanecer no tile atual
    if (tile === currentTile) {
      score += prefs.stability * 0.6;
    } else {
      score -= (1 - prefs.movement) * 0.4;
    }

    // if (tribe.core === 'peace' && tile.hostility > 0.5) {
    //   score -= 0.2;
    // }

    return score;
  }

  /**
   * Returns valid neighboring tiles around a position.
   */
  public getNeighborTiles(pos: Game.Position): Tile[] {
    const dirs = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ];

    return dirs
      .map((d) => ({ x: pos.x + d.x, y: pos.y + d.y }))
      .filter((d) => this.isValidPosition(d))
      .map((d) => this.getTileAt(d))
      .filter(Boolean) as Tile[];
  }

  /**
   * Checks if a position is within board bounds.
   */
  public isValidPosition(pos: Game.Position) {
    return pos.x >= 0 && pos.y >= 0 && pos.x < this.MAX_WIDTH! && pos.y < this.MAX_HEIGHT!;
  }

  /**
   * Attempts to trigger a random global event.
   */
  private tryTriggerEvent() {
    if (this.activeEvent) return;
    if (Math.random() > 0.05) return; // 5%

    const event = Events[Math.floor(Math.random() * Events.length)];

    this.activeEvent = {
      event,
      remaining: event.duration,
    };
    this.logger({ type: 'Info', content: `Evento ${event.name} iniciado!` });
    event.apply(this);
  }

  /**
   * Returns the tile at a given position.
   */
  public getTileAt(position: Game.Position) {
    return this.tiles[position.x][position.y];
  }

  /**
   * Processes economy effects for a tribe on a tile.
   */
  private processEconomy(tribe: Tribe, tile: Tile) {
    const t = tribe.clone();

    // PRODUÇÃO baseada no terreno
    const production = this.getProduction(tile);
    t.supplies += production;

    // CONSUMO
    t.supplies -= Math.round(t.population * this.balance.supplies.consumptionPerPop);

    // CRESCIMENTO / FOME
    if (t.supplies >= 1) {
      // crescimento lento
      const growthRate = this.balance.population.growthRate + this.balance.core[t.core].growthBonus;

      t.population += Math.floor(t.population * growthRate);
    } else {
      // fome
      t.population -= Math.ceil(
        Math.max(1, Math.abs(t.supplies) * this.balance.population.starvationLossRate)
      );
      t.supplies = Math.max(0, t.supplies);
    }

    if (t.population < 1) {
      this.logger({ type: 'Info', content: `The tribe ${t.name} has died` });
      return undefined;
    }

    return t;
  }

  /**
   * Returns adjacent tiles (up, right, down, left).
   */
  private getAdjacentTiles(pos: Game.Position): Tile[] {
    const directions = [
      { x: 0, y: 1 },
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: -1, y: 0 },
    ];

    return directions
      .map((d) => this.getTileAt({ x: clamp(pos.x + d.x, 0, 1), y: clamp(pos.y + d.y, 0, 1) }))
      .filter(Boolean);
  }

  /**
   * Checks if a tile is coastal (adjacent to water).
   */
  private isCoastal(tile: Tile): boolean {
    return this.getAdjacentTiles(tile.position).some((t) => t.tileType === TileType.WaterTile);
  }

  /**
   * Calculates base production for a tile, including global modifiers.
   */
  private getProduction(tile: Tile): number {
    let base = 0;

    switch (tile.tileType) {
      case TileType.Forest:
        base = 3;
        if (this.isCoastal(tile)) base += 2;
        break;
      case TileType.LandTile:
        base = 3;
        if (this.isCoastal(tile)) base += 1;
        break;
      case TileType.Mountain:
        base = 1;
        break;
    }

    return base + this.globalProductionModifier;
  }
}
