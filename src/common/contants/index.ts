export const TILE_SIZE = 5;

export const PERSONALITY_PRESETS = {
  war: {
    aggression: 0.8,
    cooperation: 0.2,
    fear: 0.1,
    expansionism: 0.7,
  },
  peace: {
    aggression: 0.1,
    cooperation: 0.8,
    fear: 0.4,
    expansionism: 0.3,
  },
  exploration: {
    aggression: 0.3,
    cooperation: 0.3,
    fear: 0.2,
    expansionism: 0.9,
  },
};

export const Balance = {
  population: {
    initial: 10,
    minToDivide: 100,
    growthRate: 0.05,
    divisionCost: 0.75,
    starvationLossRate: 0.75,
  },

  supplies: {
    initial: 25,
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
