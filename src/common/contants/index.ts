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

export const ARCHETYPES_BY_CORE = {
  war: ['conquistador', 'colonizador', 'barbaro'],
  exploration: ['cartografo', 'explorador', 'saqueador'],
  peace: ['pacifista', 'arcano', 'defensor'],
} as const;

export const ARCHETYPE_PRESETS = {
  conquistador: {
    core: 'war',
    personality: {
      aggression: 0.9,
      cooperation: 0.1,
      fear: 0.1,
      expansionism: 0.8,
    },
    preferences: {
      movement: 0.8,
      stability: 0.2,
      production: 0.3,
    },
  },
  colonizador: {
    core: 'war',
    personality: {
      aggression: 0.75,
      cooperation: 0.2,
      fear: 0.2,
      expansionism: 0.5,
    },
    preferences: {
      movement: 0.4,
      stability: 0.75,
      production: 0.5,
    },
  },
  barbaro: {
    core: 'war',
    personality: {
      aggression: 0.95,
      cooperation: 0.05,
      fear: 0.05,
      expansionism: 0.9,
    },
    preferences: {
      movement: 0.95,
      stability: 0.1,
      production: 0.2,
    },
  },
  cartografo: {
    core: 'exploration',
    personality: {
      aggression: 0.2,
      cooperation: 0.4,
      fear: 0.2,
      expansionism: 0.95,
    },
    preferences: {
      movement: 0.95,
      stability: 0.2,
      production: 0.8,
    },
  },
  explorador: {
    core: 'exploration',
    personality: {
      aggression: 0.3,
      cooperation: 0.3,
      fear: 0.2,
      expansionism: 0.9,
    },
    preferences: {
      movement: 0.85,
      stability: 0.2,
      production: 0.9,
    },
  },
  saqueador: {
    core: 'exploration',
    personality: {
      aggression: 0.5,
      cooperation: 0.2,
      fear: 0.2,
      expansionism: 0.85,
    },
    preferences: {
      movement: 0.9,
      stability: 0.15,
      production: 0.7,
    },
  },
  pacifista: {
    core: 'peace',
    personality: {
      aggression: 0.05,
      cooperation: 0.9,
      fear: 0.5,
      expansionism: 0.2,
    },
    preferences: {
      movement: 0.2,
      stability: 0.9,
      production: 0.4,
    },
  },
  arcano: {
    core: 'peace',
    personality: {
      aggression: 0.1,
      cooperation: 0.7,
      fear: 0.4,
      expansionism: 0.3,
    },
    preferences: {
      movement: 0.3,
      stability: 0.7,
      production: 0.6,
    },
  },
  defensor: {
    core: 'peace',
    personality: {
      aggression: 0.2,
      cooperation: 0.6,
      fear: 0.3,
      expansionism: 0.2,
    },
    preferences: {
      movement: 0.2,
      stability: 0.95,
      production: 0.5,
    },
  },
} as const;

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
