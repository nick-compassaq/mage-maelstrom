import { CategorizedDescriptiveIcon } from "..";
import { nextId } from "../../Common";

export const spellTypeArray = [
  "fireball",
  "poison",
  "bear",
  "heal",
  "regen",
  "force",
  "ice",
  "stun",
  "snipe",
  "dash",
  "meteor",
  "potion",
  "barrier",
  "flash",
  "swift",
  "dispel",
  "teleport",
  "burnout",
  "burst",
  "sentry",
  "fear",
  "zap",
] as const;

export const passiveTypeArray = [
  "talented",
  "critical",
  "thorns",
  "vision",
  "manasteal",
  "teleportitis",
  "doubletap",
  "evasion",
  "frost",
  "mind",
  "ranged",
  "spirits",
  "serrated",
  "darkness",
  "amplitude",
] as const;

export type SpellType = typeof spellTypeArray[number];
export type PassiveType = typeof passiveTypeArray[number];

export type AbilityType = SpellType | PassiveType;

const internalPassiveTypes = [
  "bearPassive",
  "sentryPassive",
  "spiritPassive",
] as const;

export type InternalPassiveType = typeof internalPassiveTypes[number];
export type ExtendedPassiveType = PassiveType | InternalPassiveType;

export type ExtendedAbilityType = SpellType | ExtendedPassiveType;

export function isSpell(type: ExtendedAbilityType): type is SpellType {
  return spellTypeArray.includes(type as SpellType);
}

export function isPassive(type: ExtendedAbilityType): type is PassiveType {
  return passiveTypeArray.includes(type as PassiveType);
}

export function isAbility(type: ExtendedAbilityType): type is AbilityType {
  return isSpell(type) || isPassive(type);
}

export interface AbilityDefinition {
  desc?: CategorizedDescriptiveIcon;
  type: ExtendedAbilityType;
}

export interface AbilityStatus extends AbilityDefinition {
  id: number;
}

export abstract class Ability {
  protected def: AbilityDefinition;
  protected id: number;

  public constructor(def: AbilityDefinition) {
    this.def = def;
    this.id = nextId();
  }

  public getType() {
    return this.def.type;
  }

  public toReadonly(): AbilityStatus {
    return {
      ...this.def,
      id: this.id,
    };
  }
}
