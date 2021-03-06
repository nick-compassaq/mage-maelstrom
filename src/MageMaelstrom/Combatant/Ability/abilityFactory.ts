import { PassiveType, SpellType } from "./ability";
import { Passive } from "./passive";
import { Amplitude } from "./Passives/amplitude";
import { Critical } from "./Passives/critical";
import { Darkness } from "./Passives/darkness";
import { DoubleTap } from "./Passives/doubleTap";
import { Evasion } from "./Passives/evasion";
import { Frost } from "./Passives/frost";
import { ManaSteal } from "./Passives/manaSteal";
import { PresenceOfMind } from "./Passives/presenceOfMind";
import { Ranged } from "./Passives/ranged";
import { Serrated } from "./Passives/serrated";
import { Talented } from "./Passives/talented";
import { Teleportitis } from "./Passives/teleportitis";
import { Thorns } from "./Passives/thorns";
import { VengefulSpirits } from "./Passives/vengefulSpirits";
import { Vision } from "./Passives/vision";
import { Spell } from "./spell";
import { Barrier } from "./Spells/barrier";
import { Burst } from "./Spells/burst";
import { Dash } from "./Spells/dash";
import { Dispel } from "./Spells/dispel";
import { Fear } from "./Spells/fear";
import { Fireball } from "./Spells/fireball";
import { Flash } from "./Spells/flash";
import { Force } from "./Spells/force";
import { Burnout } from "./Spells/burnout";
import { Heal } from "./Spells/heal";
import { HealthPotion } from "./Spells/healthPotion";
import { Meteor } from "./Spells/meteor";
import { Poison } from "./Spells/poison";
import { Regen } from "./Spells/regen";
import { Sentry } from "./Spells/sentry";
import { IceBlast } from "./Spells/iceBlast";
import { Snipe } from "./Spells/snipe";
import { Stun } from "./Spells/stun";
import { SummonBear } from "./Spells/summonBear";
import { Swift } from "./Spells/swift";
import { Teleport } from "./Spells/teleport";
import { Zap } from "./Spells/zap";

export function buildSpell(type: SpellType): Spell {
  switch (type) {
    case "fireball":
      return new Fireball();
    case "poison":
      return new Poison();
    case "bear":
      return new SummonBear();
    case "heal":
      return new Heal();
    case "regen":
      return new Regen();
    case "force":
      return new Force();
    case "ice":
      return new IceBlast();
    case "stun":
      return new Stun();
    case "snipe":
      return new Snipe();
    case "dash":
      return new Dash();
    case "meteor":
      return new Meteor();
    case "potion":
      return new HealthPotion();
    case "barrier":
      return new Barrier();
    case "flash":
      return new Flash();
    case "swift":
      return new Swift();
    case "dispel":
      return new Dispel();
    case "teleport":
      return new Teleport();
    case "burnout":
      return new Burnout();
    case "burst":
      return new Burst();
    case "sentry":
      return new Sentry();
    case "fear":
      return new Fear();
    case "zap":
      return new Zap();
  }
}

export function buildPassive(type: PassiveType): Passive {
  switch (type) {
    case "talented":
      return new Talented();
    case "critical":
      return new Critical();
    case "thorns":
      return new Thorns();
    case "vision":
      return new Vision();
    case "manasteal":
      return new ManaSteal();
    case "teleportitis":
      return new Teleportitis();
    case "doubletap":
      return new DoubleTap();
    case "evasion":
      return new Evasion();
    case "frost":
      return new Frost();
    case "mind":
      return new PresenceOfMind();
    case "ranged":
      return new Ranged();
    case "spirits":
      return new VengefulSpirits();
    case "serrated":
      return new Serrated();
    case "darkness":
      return new Darkness();
    case "amplitude":
      return new Amplitude();
  }
}
