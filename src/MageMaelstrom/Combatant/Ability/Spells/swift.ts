import { Spell } from "..";
import { mmSwift } from "../../../Common/Icon";
import { GameManager } from "../../../Logic/GameManager";
import { Entrant } from "../../entrant";
import { FullSpellTarget } from "../spell";

const DAMAGE_MULT = 0.75;

export class Swift extends Spell {
  public constructor() {
    super({
      type: "swift",
      cooldown: 150,
      manaCost: 5,
      targetTypes: "entrant",
      range: 1,
      desc: {
        name: "Swift",
        category: "damage",
        description: `Attack twice at ${DAMAGE_MULT * 100}% attack damage`,
        notes: [
          "Attacks are considered ordinary attacks, dealing attack damage and activating " +
            "attack effects",
        ],
        icon: mmSwift,
      },
    });
  }

  protected castSpell(
    caster: Entrant,
    target: Entrant,
    gameManager: GameManager
  ): void {
    caster.attack(target, DAMAGE_MULT);
    caster.attack(target, DAMAGE_MULT);
  }
}
