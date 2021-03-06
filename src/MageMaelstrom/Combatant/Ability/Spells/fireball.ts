import { StatusEffect } from "..";
import { mmFireball } from "../../../Common/Icon";
import { loggingManager } from "../../../Logging";
import { SpellLog } from "../../../Logic";
import { Entrant } from "../../entrant";
import { FullSpellTarget, isCoordinate, Spell } from "../spell";

const DAMAGE = 36;
const DOT = 8;
const DURATION = 300;

export class Fireball extends Spell {
  public constructor() {
    super({
      desc: {
        name: "Fireball",
        category: "damage",
        description:
          `Deal ${DAMAGE} damage and set the target ablaze, dealing ${DOT} damage per second for ` +
          `${DURATION / 100}s and halving their regen.`,
        icon: mmFireball,
      },
      type: "fireball",
      cooldown: 300,
      manaCost: 20,
      range: 5,
      targetTypes: "entrant",
    });
  }

  protected castSpell(
    caster: Entrant,
    target: FullSpellTarget
  ): SpellLog | undefined {
    if (!target || typeof target === "string" || isCoordinate(target)) {
      return;
    }
    caster.dealMagicDamage(target, DAMAGE, "fireball", mmFireball);
    target.applyStatusEffect(new OnFire(caster), caster);
  }
}

class OnFire extends StatusEffect {
  private source: Entrant;

  public constructor(source: Entrant) {
    super({
      type: "fire",
      desc: {
        name: "On Fire",
        description: `Take ${DOT} damage per second for ${
          DURATION / 300
        } seconds and halve your regen.`,
        icon: mmFireball,
      },
      duration: DURATION,
      isPositive: false,
    });

    this.source = source;
  }

  public override getHealthRegenMultiplier(): number {
    return 0.5;
  }

  public override updateEffect(entrant: Entrant) {
    if (this.timer % 50 === 1) {
      this.source.dealMagicDamage(
        entrant,
        DOT / 2,
        "fireball",
        mmFireball,
        false
      );
    }
  }
}
