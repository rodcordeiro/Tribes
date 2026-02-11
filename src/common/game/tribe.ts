import { v4 as uuid } from 'uuid';
import { ARCHETYPES_BY_CORE, ARCHETYPE_PRESETS, Balance, PERSONALITY_PRESETS } from '../contants';
import { clamp, randomArrayItem, randomEnumValue } from '../utils';
import { TribeArchetype, TribeCore } from './enums';

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

const getRandomArchetypeForCore = (core: TribeCore): TribeArchetype =>
  randomArrayItem(ARCHETYPES_BY_CORE[core] as unknown as TribeArchetype[]);

export class Tribe {
  public position!: Game.Position;
  public id!: string;
  public name: string = '';
  public color: string = '';

  public population!: number;
  public supplies!: number;
  public core!: TribeCore;
  public archetype!: TribeArchetype;
  public personality!: TribePersonality;
  public cities: string[] = [];

  /**
   * Creates a tribe with initial stats, core, and archetype.
   */
  constructor({
    initialPosition,
    initialPopulation = Balance.population.initial,
    initialSupplies = Balance.supplies.initial,
    name,
    color,
    core = randomEnumValue(TribeCore),
    id,
    archetype,
    personality,
    cities = [],
  }: {
    id?: string;
    initialPosition: Game.Position;
    initialPopulation?: number;
    initialSupplies?: number;
    name: string;
    color: string;
    core: TribeCore;
    archetype?: TribeArchetype;
    personality?: TribePersonality;
    cities?: string[];
  }) {
    this.id = id ?? uuid();
    this.position = initialPosition;
    this.name = name;
    this.color = color;
    this.population = Math.floor(initialPopulation + initialPopulation * Math.random());
    this.supplies = Math.floor(initialSupplies + initialSupplies * Math.random());
    this.core = core;
    this.archetype = archetype ?? getRandomArchetypeForCore(core);
    this.personality = personality ?? this.generatePersonality(core, this.archetype);
    this.cities = [...cities];
  }

  /**
   * Clones the tribe and applies core change chance (2%) with new archetype/personality.
   */
  clone(): Tribe {
    const shouldChangeCore = Math.random() < 0.02;
    const nextCore = shouldChangeCore ? randomEnumValue(TribeCore) : this.core;
    const nextArchetype = shouldChangeCore ? getRandomArchetypeForCore(nextCore) : this.archetype;
    const nextPersonality = shouldChangeCore
      ? this.generatePersonality(nextCore, nextArchetype)
      : this.personality;

    return new Tribe({
      id: this.id,
      initialPosition: { ...this.position },
      initialPopulation: this.population,
      initialSupplies: this.supplies,
      name: this.name,
      color: this.color,
      core: nextCore,
      archetype: nextArchetype,
      personality: nextPersonality,
      cities: [...this.cities],
    });
  }

  /**
   * Updates the tribe position.
   */
  move(newPosition: Game.Position) {
    this.position = newPosition;
  }

  /**
   * Estimates threat posed by another tribe.
   */
  evaluateThreat(self: Tribe, other: Tribe): number {
    if (self.id === other.id) return 0;
    return other.personality.aggression * 0.6 + (other.population / (self.population + 1)) * 0.4;
  }

  /**
   * Estimates cooperation opportunity between two tribes.
   */
  evaluateOpportunity(self: Tribe, other: Tribe): number {
    if (self.id === other.id) return 0;
    return (self.personality.cooperation + other.personality.cooperation) / 2;
  }

  /**
   * Mutates a base trait by a random variance and clamps to [0, 1].
   */
  mutate(base: number, variance = 0.15) {
    return clamp(base + (Math.random() * variance - variance / 2), 0, 1);
  }

  /**
   * Generates a personality based on core and archetype presets.
   */
  generatePersonality(
    core: keyof typeof PERSONALITY_PRESETS,
    archetype: TribeArchetype
  ): TribePersonality {
    const base = ARCHETYPE_PRESETS[archetype]?.personality ?? PERSONALITY_PRESETS[core];
    return {
      aggression: this.mutate(base.aggression),
      cooperation: this.mutate(base.cooperation),
      fear: this.mutate(base.fear),
      expansionism: this.mutate(base.expansionism),
    };
  }

  /**
   * Applies a delta to a trait and clamps it to [0, 1].
   */
  applyMemory(trait: number, delta: number) {
    return Math.min(1, Math.max(0, trait + delta));
  }
}
