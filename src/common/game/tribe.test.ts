import { TribeArchetype, TribeCore } from './enums';
import { Tribe } from './tribe';

const basePersonality = {
  aggression: 0.5,
  cooperation: 0.5,
  fear: 0.5,
  expansionism: 0.5,
};

const createTribe = (overrides?: Partial<ConstructorParameters<typeof Tribe>[0]>) =>
  new Tribe({
    id: 'tribe-1',
    initialPosition: { x: 0, y: 0 },
    initialPopulation: 20,
    initialSupplies: 20,
    name: 'Tribe',
    color: '#123456',
    core: TribeCore.Peace,
    archetype: TribeArchetype.Pacifista,
    personality: basePersonality,
    ...overrides,
  });

describe('Tribe', () => {
  it('returns zero threat/opportunity when comparing with itself', () => {
    const tribe = createTribe();

    expect(tribe.evaluateThreat(tribe, tribe)).toBe(0);
    expect(tribe.evaluateOpportunity(tribe, tribe)).toBe(0);
  });

  it('calculates non-zero threat and opportunity for different tribes', () => {
    const self = createTribe({ id: 'self' });
    const other = createTribe({
      id: 'other',
      personality: { aggression: 0.8, cooperation: 0.6, fear: 0.2, expansionism: 0.5 },
      initialPopulation: 30,
    });

    expect(self.evaluateThreat(self, other)).toBeGreaterThan(0);
    expect(self.evaluateOpportunity(self, other)).toBeGreaterThan(0);
  });

  it('clamps memory changes between zero and one', () => {
    const tribe = createTribe();

    expect(tribe.applyMemory(0.9, 0.5)).toBe(1);
    expect(tribe.applyMemory(0.1, -0.5)).toBe(0);
  });

  it('keeps core/archetype when clone does not trigger core switch', () => {
    const tribe = createTribe({
      id: 'stable',
      core: TribeCore.War,
      archetype: TribeArchetype.Conquistador,
    });
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

    const clone = tribe.clone();

    expect(clone.id).toBe(tribe.id);
    expect(clone.core).toBe(tribe.core);
    expect(clone.archetype).toBe(tribe.archetype);
    expect(clone.population).toBe(tribe.population);
    expect(clone.supplies).toBe(tribe.supplies);

    randomSpy.mockRestore();
  });
});
