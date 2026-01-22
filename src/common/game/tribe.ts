import { v4 as uuid } from 'uuid';
import { Balance, PERSONALITY_PRESETS } from '../contants';
import { clamp, randomEnumValue } from '../utils';
import { TribeCore } from './enums';

export type TribePersonality = {
  aggression: number; // 0–1
  cooperation: number; // 0–1
  fear: number; // 0–1
  expansionism: number; // 0–1
};
export type TribeMemory = {
  warsWon: number;
  warsLost: number;
  alliances: number;
  migrations: number;
  lastTraumaTick?: number;
};
export class Tribe {
  public position!: Game.Position;
  public id!: string;
  public name: string = '';
  public color: string = '';

  public population!: number;
  public supplies!: number;
  public core!: TribeCore;
  public personality!: TribePersonality;

  constructor({
    initialPosition,
    initialPopulation = Balance.population.initial,
    initialSupplies = Balance.supplies.initial,
    name,
    color,
    core = randomEnumValue(TribeCore),
    id,
    personality,
  }: {
    id?: string;
    initialPosition: Game.Position;
    initialPopulation?: number;
    initialSupplies?: number;
    name: string;
    color: string;
    core: TribeCore;
    personality?: TribePersonality;
  }) {
    this.id = id ?? uuid();
    this.position = initialPosition;
    this.name = name;
    this.color = color;
    this.population = Math.floor(initialPopulation + initialPopulation * Math.random());
    this.supplies = Math.floor(initialSupplies + initialSupplies * Math.random());
    this.core = core;
    this.personality = personality ?? this.generatePersonality(core);
  }
  clone(): Tribe {
    return new Tribe({
      id: this.id,
      initialPosition: { ...this.position },
      initialPopulation: this.population,
      initialSupplies: this.supplies,
      name: this.name,
      color: this.color,
      core: Math.random() < 0.02 ? randomEnumValue(TribeCore) : this.core,
      personality: this.personality,
    });
  }
  move(newPosition: Game.Position) {
    this.position = newPosition;
  }

  evaluateThreat(self: Tribe, other: Tribe): number {
    return other.personality.aggression * 0.6 + (other.population / (self.population + 1)) * 0.4;
  }

  evaluateOpportunity(self: Tribe, other: Tribe): number {
    return (self.personality.cooperation + other.personality.cooperation) / 2;
  }

  mutate(base: number, variance = 0.15) {
    return clamp(base + (Math.random() * variance - variance / 2), 0, 1);
  }

  generatePersonality(core: keyof typeof PERSONALITY_PRESETS): TribePersonality {
    const base = PERSONALITY_PRESETS[core];
    return {
      aggression: this.mutate(base.aggression),
      cooperation: this.mutate(base.cooperation),
      fear: this.mutate(base.fear),
      expansionism: this.mutate(base.expansionism),
    };
  }
  applyMemory(trait: number, delta: number) {
    return Math.min(1, Math.max(0, trait + delta));
  }
}
