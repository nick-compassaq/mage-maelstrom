export type GameSpecs = Readonly<{
  rules: {
    maxCombatants: number;
    minStat: number;
    maxTotalStats: number;
  };
  arena: {
    width: number;
    height: number;
  };
  stats: {
    healthPerStrength: number;
    healthRegenPerStrength: number;
    agilityBonus: number;
    manaPerInt: number;
    manaRegenPerInt: number;
    vision: number;
  };
}>;
