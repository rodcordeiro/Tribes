import { LogEntry } from '@/stores/game.reducer';
import {
  clamp,
  getRandomIntInclusive,
  getTribeName,
  randomEnumValue,
  randomHexColor,
} from '../utils';
import { Tile } from './tile';
import { Tribe } from './tribe';
import { TileType, TribeCore } from './enums';
import { Balance, MIN_POPULATION_TO_DIVIDE } from '../contants';
import { Events, GameEvent } from './events';
import { GameBalance } from './balance';
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

  clone(): Board {
    const board = new Board({
      width: this.MAX_WIDTH!,
      height: this.MAX_HEIGHT!,
      tribesCount: 0,
      balance: this.balance,
      logger: this.logger!,
    });

    board.tiles = this.tiles; //this.tiles.map((t) => t.clone());
    board.tribes = this.tribes; // this.tribes.map((t) => t.clone());
    board.ticks = this.ticks;
    board.ticksDelayInMs = this.ticksDelayInMs;
    board.activeEvent = this.activeEvent;

    return board;
  }

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
  getNearbyTribes(tribe: Tribe, range = 1): Tribe[] {
    return this.tribes.filter((other) => {
      if (other === tribe || !other.position || !tribe.position) return false;

      const dx = Math.abs(other.position.x - tribe.position.x);
      const dy = Math.abs(other.position.y - tribe.position.y);

      return dx <= range && dy <= range;
    });
  }

  flee(tribe: Tribe, threat: Tribe) {
    const dx = tribe.position!.x - threat.position!.x;
    const dy = tribe.position!.y - threat.position!.y;

    tribe.move({
      x: tribe.position!.x + Math.sign(dx),
      y: tribe.position!.y + Math.sign(dy),
    });
  }

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
  decideExploration(tribe: Tribe) {
    if (!tribe.position) return;

    const currentTile = this.getTileAt(tribe.position);
    const neighbors = this.getNeighborTiles(tribe.position);

    if (!currentTile || neighbors.length === 0) return;

    let bestTile = currentTile;
    let bestScore = this.evaluateTileSurvival(tribe, currentTile);

    for (const tile of neighbors) {
      const score = this.evaluateTileSurvival(tribe, tile);

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

  private evaluateTileSurvival(tribe: Tribe, tile: Tile): number {
    let score = 1;

    // // 🌱 Fertilidade (produção)
    // score += tile.fertility * (1 - tribe.personality.fear);

    // // ☠️ Hostilidade (perigo)
    // score -= tile.hostility * tribe.personality.fear;

    // 🧭 Preferência cultural
    if (tribe.core === 'exploration') {
      score += 0.2;
    }

    // if (tribe.core === 'peace' && tile.hostility > 0.5) {
    //   score -= 0.2;
    // }

    return score;
  }

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

  public isValidPosition(pos: Game.Position) {
    return pos.x >= 0 && pos.y >= 0 && pos.x < this.MAX_WIDTH! && pos.y < this.MAX_HEIGHT!;
  }

  // tick(): Board {
  //   const next = this.clone();
  //   next.ticks++;

  //   next.tribes = next.tribes
  //     .map((tribe) => {
  //       if (Math.random() < 0.1) {
  //         this.moveTribe(tribe, next);
  //       }
  //       if (!tribe.position) return tribe;

  //       if (tribe.core === TribeCore.Exploration && next.isEnemyNearby(tribe)) {
  //         return next.fleeFromWar(tribe);
  //       }

  //       const tile = next.getTileAt(tribe.position);
  //       if (!tile) {
  //         return tribe;
  //       }

  //       const shouldMigrate = this.shouldMigrate(tribe, this.getTileAt(tribe.position));

  //       if (shouldMigrate) {
  //         const target = this.chooseMigrationTile(tribe.position);
  //         if (!target || !target.position) return tribe;
  //         if (target) {
  //           if (target.tileType === TileType.WaterTile) return tribe;

  //           const hasBiggerProduction = this.getProduction(target) > this.getProduction(tile);
  //           if (hasBiggerProduction) {
  //             const threshold =
  //               this.balance.population.minToDivide +
  //               this.balance.core[tribe.core].divisionThresholdModifier;

  //             if (tribe.population > threshold) {
  //               const migratingPop = Math.floor(tribe.population * 0.3);

  //               tribe.population -= migratingPop;
  //               next.logger({ type: 'Marriage', content: `Uma nova tribo nasce de ${tribe.name}` });
  //               next.tribes.push(
  //                 new Tribe({
  //                   initialPosition: target.position,
  //                   initialPopulation: migratingPop,
  //                   initialSupplies: Math.floor(tribe.supplies * 0.3),
  //                   name: getTribeName(),
  //                   color: randomHexColor(),
  //                   core: Math.random() > 0.05 ? tribe.core : randomEnumValue(TribeCore),
  //                 })
  //               );
  //             } else {
  //               tribe.move(target.position);
  //             }
  //           }
  //         }
  //       }

  //       return tribe;
  //     })
  //     .map((tribe) => {
  //       if (this.ticks % 5 !== 0) return tribe;
  //       const tile = next.getTileAt(tribe.position);
  //       return next.processEconomy(tribe, tile);
  //     })
  //     .filter(Boolean) as Tribe[];

  //   const should_new_tribe_appear = Math.random();
  //   if (should_new_tribe_appear < 0.02) {
  //     const newTribe = new Tribe({
  //       initialPosition: {
  //         x: getRandomIntInclusive(0, next.MAX_WIDTH ?? 0),
  //         y: getRandomIntInclusive(0, next.MAX_HEIGHT ?? 0),
  //       },
  //       name: getTribeName(),
  //       color: randomHexColor(),
  //       core: randomEnumValue(TribeCore),
  //     });
  //     next.tribes.push(newTribe);
  //     next.logger({ type: 'Info', content: `Tribe ${newTribe.name} has begun` });
  //   }

  //   // combate
  //   const conflicts = next.detectConflicts(next.tribes);

  //   next.tribes = [];

  //   for (const group of conflicts.values()) {
  //     const cores = new Set(group.map((t) => t.core));

  //     if (cores.has(TribeCore.War)) {
  //       next.tribes.push(next.handleWar(group));
  //     } else if (cores.has(TribeCore.Peace)) {
  //       next.tribes.push(...next.handlePeace(group));
  //     } else {
  //       next.tribes.push(group[0]);
  //     }
  //   }
  //   if (next.activeEvent) {
  //     next.activeEvent.remaining--;

  //     if (next.activeEvent.remaining <= 0) {
  //       next.activeEvent.event.revert(next);
  //       next.activeEvent = undefined;
  //     }
  //   } else {
  //     next.tryTriggerEvent();
  //   }
  //   return next;
  // }
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

  public getTileAt(position: Game.Position) {
    return this.tiles[position.x][position.y];
  }

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

  private getAdjacentTiles(pos: Game.Position): Tile[] {
    const directions = [
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
    ];

    return directions
      .map((d) => this.getTileAt({ x: clamp(pos.x + d.x, 0, 1), y: clamp(pos.y + d.y, 0, 1) }))
      .filter(Boolean);
  }

  private isCoastal(tile: Tile): boolean {
    return this.getAdjacentTiles(tile.position).some((t) => t.tileType === TileType.WaterTile);
  }

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
