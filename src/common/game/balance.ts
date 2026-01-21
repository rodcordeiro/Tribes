// gameBalance.ts
export type GameBalance = {
  population: {
    initial: number;
    growthRate: number;
    minToDivide: number;
  };
  supplies: {
    initial: number;
    consumptionPerPop: number;
  };
  core: {
    peace: {
      growthBonus: number;
      migrationBonus: number;
      combatBonus: number;
      divisionThresholdModifier: number;
    };
    war: {
      growthBonus: number;
      combatBonus: number;
      migrationBonus: number;
      divisionThresholdModifier: number;
    };
    exploration: {
      growthBonus: number;
      migrationBonus: number;
      divisionThresholdModifier: number;
    };
  };
  game: {
    width: number;
    height: number;
    tribes: number;
  };
};
export const DEFAULT_BALANCE: GameBalance = {
  population: {
    initial: 30,
    growthRate: 0.05,
    minToDivide: 80,
  },
  supplies: {
    initial: 60,
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
