import { LogEntry } from '@/stores/game.reducer';
import { getRandomIntInclusive, getTribeName, randomEnumValue, randomHexColor } from '../utils';
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

  tick(): Board {
    const next = this.clone();
    next.ticks++;

    next.tribes = next.tribes
      .map((tribe) => {
        if (Math.random() < 0.1) {
          this.moveTribe(tribe, next);
        }
        if (!tribe.position) return tribe;

        if (tribe.core === TribeCore.Exploration && next.isEnemyNearby(tribe)) {
          return next.fleeFromWar(tribe);
        }

        const tile = next.getTileAt(tribe.position);
        if (!tile) {
          return tribe;
        }

        const shouldMigrate = this.shouldMigrate(tribe, this.getTileAt(tribe.position));

        if (shouldMigrate) {
          const target = this.chooseMigrationTile(tribe.position);
          if (!target || !target.position) return tribe;
          if (target) {
            if (target.tileType === TileType.WaterTile) return tribe;

            const hasBiggerProduction = this.getProduction(target) > this.getProduction(tile);
            if (hasBiggerProduction) {
              const threshold =
                this.balance.population.minToDivide + this.balance.core[tribe.core].divisionThresholdModifier;

              if (tribe.population > threshold) {
                const migratingPop = Math.floor(tribe.population * 0.3);

                tribe.population -= migratingPop;
                next.logger({ type: 'Marriage', content: `Uma nova tribo nasce de ${tribe.name}` });
                next.tribes.push(
                  new Tribe({
                    initialPosition: target.position,
                    initialPopulation: migratingPop,
                    initialSupplies: Math.floor(tribe.supplies * 0.3),
                    name: getTribeName(),
                    color: randomHexColor(),
                    core: Math.random() > 0.05 ? tribe.core : randomEnumValue(TribeCore),
                  })
                );
              } else {
                tribe.move(target.position);
              }
            }
          }
        }

        return tribe;
      })
      .map((tribe) => {
        if (this.ticks % 5 !== 0) return tribe;
        const tile = next.getTileAt(tribe.position);
        return next.processEconomy(tribe, tile);
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

    // combate
    const conflicts = next.detectConflicts(next.tribes);

    next.tribes = [];

    for (const group of conflicts.values()) {
      const cores = new Set(group.map((t) => t.core));

      if (cores.has(TribeCore.War)) {
        next.tribes.push(next.handleWar(group));
      } else if (cores.has(TribeCore.Peace)) {
        next.tribes.push(...next.handlePeace(group));
      } else {
        next.tribes.push(group[0]);
      }
    }
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

  private isEnemyNearby(tribe: Tribe): boolean {
    return this.getAdjacentTiles(tribe.position).some((tile) =>
      this.tribes.some(
        (t) =>
          t.core === TribeCore.War &&
          t.position.x === tile.position.x &&
          t.position.y === tile.position.y
      )
    );
  }

  private fleeFromWar(tribe: Tribe): Tribe {
    const safeTiles = this.getAdjacentTiles(tribe.position).filter(
      (t) =>
        !this.tribes.some(
          (enemy) =>
            enemy.core === TribeCore.War &&
            enemy.position.x === t.position.x &&
            enemy.position.y === t.position.y
        )
    );

    if (safeTiles.length === 0) return tribe;

    const target = safeTiles[Math.floor(Math.random() * safeTiles.length)];

    const t = tribe.clone();
    t.position = target.position;

    return t;
  }

  private handleWar(group: Tribe[]): Tribe {
    return this.resolveCombat(group);
  }

  private handlePeace(group: Tribe[]): Tribe[] {
    if (group.length !== 2) return group;

    const [a, b] = group;

    const childPop = Math.floor((a.population + b.population) * 0.3);

    a.population -= Math.floor(a.population * 0.2);
    b.population -= Math.floor(b.population * 0.2);
    const name = getTribeName();
    this.logger({
      type: 'Marriage',
      content: `${a.name} e ${b.name} se unem em paz para gerar ${name}`,
    });
    return [
      a,
      b,
      new Tribe({
        initialPosition: a.position,
        core: randomEnumValue(TribeCore),
        initialPopulation: childPop,
        initialSupplies: 10,
        color: randomHexColor(),
        name,
      }),
    ];
  }

  private detectConflicts(tribes: Tribe[]): Map<string, Tribe[]> {
    const map = new Map<string, Tribe[]>();

    for (const tribe of tribes) {
      const key = `${tribe.position.x}:${tribe.position.y}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(tribe);
    }

    return map;
  }

  private resolveCombat(tribes: Tribe[]): Tribe {
    if (tribes.length === 1) return tribes[0];

    const scored = tribes.map((t) => ({
      tribe: t,
      score: t.population + Math.floor(t.supplies / 2),
    }));

    scored.sort((a, b) => b.score - a.score);
    this.logger({
      type: 'War',
      content: `A ${scored.at(0)?.tribe.name} derrotou a(s) tribo(s) ${scored
        .slice(1)
        .map((t) => t.tribe.name)
        .join(', ')}!`,
    });
    return scored[0].tribe;
  }

  private processEconomy(tribe: Tribe, tile: Tile) {
    const t = tribe.clone();

    // PRODUÇÃO baseada no terreno
    const production = this.getProduction(tile);
    t.supplies += production;

    // CONSUMO
    t.supplies -= t.population * this.balance.supplies.consumptionPerPop;

    // CRESCIMENTO / FOME
    if (t.supplies >= 0) {
      // crescimento lento
      const growthRate = this.balance.population.growthRate + this.balance.core[t.core].growthBonus;

      t.population += Math.floor(t.population * growthRate);
    } else {
      // fome
      t.population -= Math.ceil(
        Math.max(1, Math.abs(t.supplies) * this.balance.population.starvationLossRate)
      );
      t.supplies = 0;
    }

    // limite inferior
    // t.population = Math.max(1, t.population);

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
      .map((d) =>
        this.getTileAt({ x: this.clamp(pos.x + d.x, 0, 1), y: this.clamp(pos.y + d.y, 0, 1) })
      )
      .filter(Boolean);
  }

  private shouldMigrate(tribe: Tribe, tile: Tile): boolean {
    if (tribe.supplies > tribe.population * 2) return false;
    // if (tribe.population < 20) return true;

    return this.getProduction(tile) <= 1;
  }
  private chooseMigrationTile(from: Game.Position): Tile | null {
    const candidates = this.getAdjacentTiles(from);

    return candidates.sort((a, b) => this.getProduction(b) - this.getProduction(a))[0] ?? null;
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

  clone(): Board {
    const board = new Board({
      width: this.MAX_WIDTH!,
      height: this.MAX_HEIGHT!,
      tribesCount: 0,
      logger: this.logger!,
    });

    board.tiles = this.tiles; //this.tiles.map((t) => t.clone());
    board.tribes = this.tribes; // this.tribes.map((t) => t.clone());
    board.ticks = this.ticks;
    board.ticksDelayInMs = this.ticksDelayInMs;
    board.activeEvent = this.activeEvent;

    return board;
  }

  private moveTribe(tribe: Tribe, board: Board) {
    const { position } = tribe;
    if (!position) return;

    const move_d20 = Math.random();
    const moves = move_d20 < 0.05 ? 3 : move_d20 < 0.2 ? 2 : 1;

    tribe.move({
      x: this.clamp(position.x + (Math.random() < 0.5 ? -moves : moves), 0, board.MAX_WIDTH! - 1),
      y: this.clamp(position.y + (Math.random() < 0.5 ? -moves : moves), 0, board.MAX_HEIGHT! - 1),
    });
    if (!this.logger) return;
    this.logger({
      content: `[${tribe.name}] Moved to [x:${tribe.position?.x}, y:${tribe.position?.y}]`,
      type: 'Info',
    });
  }

  private clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
  }
}
