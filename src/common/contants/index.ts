export const TILE_SIZE = 5;

export const INITIAL_POPULATION_BASE = 30;
export const INITIAL_SUPPLIES_BASE = 60;

export const POPULATION_GROWTH_RATE = 0.05;
export const SUPPLIES_CONSUMPTION_PER_POP = 1;

export const MIN_POPULATION_TO_DIVIDE = 80;
export const DIVISION_POPULATION_COST = 0.3;

export const Balance = {
  population: {
    initial: 30,
    minToDivide: 100,
    growthRate: 0.75,
    divisionCost: 0.25,
    starvationLossRate: 0.5,
  },

  supplies: {
    initial: 100,
    consumptionPerPop: 1,
  },

  core: {
    peace: {
      growthBonus: 0.05,
      migrationBonus: 0,
      combatBonus: 0,
      divisionThresholdModifier: 5,
    },
    war: {
      growthBonus: -0.01,
      combatBonus: 0.2,
      migrationBonus: 0.5,
      divisionThresholdModifier: -20,
    },
    exploration: {
      growthBonus: 0.02,
      migrationBonus: 1,
      divisionThresholdModifier: -10,
    },
  },
  game: {
    width: 4,
    height: 4,
    tribes: 4,
  },
};
