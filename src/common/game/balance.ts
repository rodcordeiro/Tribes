// gameBalance.ts
export type GameBalance = {
  population: {
    initial: number;
    growthRate: number;
    minToDivide: number;
    starvationLossRate: number;
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
  city: {
    minPopulation: number;
    minSupplies: number;
    foundingCostSupplies: number;
    foundingCostPopulation: number;
    growthRate: number;
    productionBonus: number;
    defenseBase: number;
    raidSuppliesRate: number;
  };
  roads: {
    buildChance: number;
    buildCostSupplies: number;
    maxLevel: number;
    levelGain: number;
    productionBonusPerLevel: number;
  };
};

export const DEFAULT_BALANCE: GameBalance = {
  population: {
    initial: 30,
    growthRate: 0.05,
    minToDivide: 80,
    starvationLossRate: 0.05,
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
  city: {
    minPopulation: 40,
    minSupplies: 50,
    foundingCostSupplies: 25,
    foundingCostPopulation: 5,
    growthRate: 0.04,
    productionBonus: 2,
    defenseBase: 0.2,
    raidSuppliesRate: 0.35,
  },
  roads: {
    buildChance: 0.5,
    buildCostSupplies: 8,
    maxLevel: 1,
    levelGain: 1,
    productionBonusPerLevel: 0.5,
  },
};
