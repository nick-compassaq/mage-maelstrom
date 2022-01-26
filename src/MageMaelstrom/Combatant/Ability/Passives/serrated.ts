import { Passive, StatusEffect } from "..";
import { mmSerrated } from "../../../Common/Icon";
import { invertPercentage } from "../../../Common/labels";
import { Entrant, DamageType } from "../../entrant";

const CHANCE = 0.5;
const DAMAGE_TICK = 8;
const DURATION = 300;
const DAMAGE_REDUCTION_MULT = 0.8;

export class Serrated extends Passive {
  public constructor() {
    super({
      type: "serrated",
      desc: {
        name: "Serrated Blade",
        description:
          `Has a ${
            CHANCE * 100
          }% chance to inflict bleed upon the target, dealing ` +
          `${DAMAGE_TICK} damage per second and reducing their attack damage by ` +
          `${invertPercentage(DAMAGE_REDUCTION_MULT)}% for ${
            DURATION / 100
          } seconds`,
        category: "damage",
        icon: mmSerrated,
      },
    });
  }

  public override onDealDamage(
    me: Entrant,
    target: Entrant,
    type: DamageType
  ): void {
    if (type !== "attack" || Math.random() > CHANCE) {
      return;
    }

    target.applyStatusEffect(new Bleed(me), me);
  }
}

class Bleed extends StatusEffect {
  private source: Entrant;

  public constructor(source: Entrant) {
    super({
      type: "bleed",
      duration: DURATION,
      isPositive: false,
      desc: {
        name: "Bleed",
        description: `Deals ${DAMAGE_TICK} damage per second and reduces attack damage by ${invertPercentage(
          DAMAGE_REDUCTION_MULT
        )}%`,
        icon: mmSerrated,
      },
    });

    this.source = source;
  }

  public override getAttackDamageMultiplier(): number {
    return DAMAGE_REDUCTION_MULT;
  }

  public updateEffect(entrant: Entrant): void {
    if (this.timer % 25 === 1) {
      entrant.takeDamage(DAMAGE_TICK / 4, this.source, "magic", "serrated");
    }
  }
}