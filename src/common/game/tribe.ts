import { Balance, INITIAL_POPULATION_BASE, INITIAL_SUPPLIES_BASE } from '../contants';
import { randomEnumValue } from '../utils';
import { TribeCore } from './enums';

export class Tribe {
  public position!: Game.Position;
  public name: string = '';
  public color: string = '';

  public population!: number;
  public supplies!: number;
  public core!: TribeCore;

  constructor({
    initialPosition,
    initialPopulation = Balance.population.initial,
    initialSupplies = Balance.supplies.initial,
    name,
    color,
    core = randomEnumValue(TribeCore),
  }: {
    initialPosition: Game.Position;
    initialPopulation?: number;
    initialSupplies?: number;
    name: string;
    color: string;
    core: TribeCore;
  }) {
    this.position = initialPosition;
    this.name = name;
    this.color = color;
    this.population = Math.floor(initialPopulation + initialPopulation * Math.random());
    this.supplies = Math.floor(initialSupplies + initialSupplies * Math.random());
    this.core = core;
  }
  clone(): Tribe {
    return new Tribe({
      initialPosition: { ...this.position },
      initialPopulation: this.population,
      initialSupplies: this.supplies,
      name: this.name,
      color: this.color,
      core: Math.random() < 0.05 ? randomEnumValue(TribeCore) : this.core,
    });
  }
  move(newPosition: Game.Position) {
    this.position = newPosition;
  }
}
